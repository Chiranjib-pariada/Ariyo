import { Router } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

const router = Router();

// GET notifications for logged in user
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const userNotifs = db.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  return res.json({
    success: true,
    data: userNotifs,
    unreadCount,
  });
});

// PUT mark single notification as read
router.put('/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  const notif = db.notifications.find((n) => n._id === req.params.id && n.userId === req.user!.userId);
  if (notif) {
    notif.read = true;
    db.save();
  }
  return res.json({ success: true, message: 'Notification marked as read.' });
});

// PUT mark all as read
router.put('/read-all', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  db.notifications.forEach((n) => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  db.save();
  return res.json({ success: true, message: 'All notifications marked as read.' });
});

// DELETE notification
router.delete('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const index = db.notifications.findIndex((n) => n._id === req.params.id && n.userId === req.user!.userId);
  if (index >= 0) {
    db.notifications.splice(index, 1);
    db.save();
  }
  return res.json({ success: true, message: 'Notification removed.' });
});

export default router;
