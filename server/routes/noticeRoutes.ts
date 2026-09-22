import { Router } from 'express';
import { db, NoticeDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all notices
router.get('/', (req, res) => {
  const { category, priority, audience, search } = req.query;

  let list = db.notices;

  if (category && category !== 'ALL') {
    list = list.filter((n) => n.category.toLowerCase() === String(category).toLowerCase());
  }

  if (priority && priority !== 'ALL') {
    list = list.filter((n) => n.priority.toLowerCase() === String(priority).toLowerCase());
  }

  if (audience && audience !== 'ALL') {
    list = list.filter((n) => n.targetAudience === audience || n.targetAudience === 'ALL');
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
  }

  // Sort by publishedAt descending
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return res.json({ success: true, data: list });
});

// POST create notice (Faculty or Admin)
router.post('/', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const { title, description, category, priority, targetAudience, department, semester } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Notice title and description are required.' });
  }

  const newNotice: NoticeDoc = {
    _id: 'ntc_' + Date.now(),
    title,
    description,
    category: category || 'General',
    priority: priority || 'Medium',
    targetAudience: targetAudience || 'ALL',
    department,
    semester: semester ? Number(semester) : undefined,
    publishedAt: new Date().toISOString(),
    createdBy: req.user!.name,
  };

  db.notices.unshift(newNotice);

  // Send notifications to target users
  const targetUsers = db.users.filter((u) => {
    if (newNotice.targetAudience === 'ALL') return true;
    return u.role === newNotice.targetAudience;
  });

  targetUsers.forEach((u) => {
    db.notifications.push({
      _id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: u._id,
      title: `Notice: ${title}`,
      message: description.slice(0, 100) + '...',
      type: 'notice',
      read: false,
      createdAt: new Date().toISOString(),
    });
  });

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'NOTICE_PUBLISHED', 'Notice', newNotice._id, `Published notice: ${title}`);

  return res.status(201).json({
    success: true,
    message: 'Notice published successfully to campus network.',
    data: newNotice,
  });
});

// PUT update notice (Faculty or Admin)
router.put('/:id', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const notice = db.notices.find((n) => n._id === req.params.id);
  if (!notice) {
    return res.status(404).json({ success: false, message: 'Notice not found.' });
  }

  const { title, description, category, priority, targetAudience, department, semester } = req.body;
  if (title) notice.title = title.trim();
  if (description) notice.description = description.trim();
  if (category) notice.category = category;
  if (priority) notice.priority = priority;
  if (targetAudience) notice.targetAudience = targetAudience;
  if (department !== undefined) notice.department = department;
  if (semester !== undefined) notice.semester = semester ? Number(semester) : undefined;

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'NOTICE_UPDATED', 'Notice', notice._id, `Updated notice: ${notice.title}`);

  return res.json({
    success: true,
    message: 'Notice updated successfully.',
    data: notice,
  });
});

// DELETE notice
router.delete('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.notices.findIndex((n) => n._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Notice not found.' });
  }

  const deleted = db.notices.splice(index, 1)[0];
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'NOTICE_DELETED', 'Notice', deleted._id, `Deleted notice: ${deleted.title}`);

  return res.json({ success: true, message: 'Notice deleted successfully.' });
});

export default router;
