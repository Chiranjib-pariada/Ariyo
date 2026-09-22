import { Router } from 'express';
import { db, TimetableDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET timetable
router.get('/', (req, res) => {
  const { departmentId, semester, facultyId, day } = req.query;

  let list = db.timetable;

  if (departmentId && departmentId !== 'ALL') {
    list = list.filter((t) => t.departmentId === departmentId);
  }
  if (semester) {
    list = list.filter((t) => t.semester === Number(semester));
  }
  if (facultyId) {
    list = list.filter((t) => t.facultyId === facultyId);
  }
  if (day) {
    list = list.filter((t) => t.day.toLowerCase() === String(day).toLowerCase());
  }

  const enriched = list.map((item) => {
    const sub = db.subjects.find((s) => s._id === item.subjectId);
    const fac = db.faculty.find((f) => f._id === item.facultyId);
    const facUser = fac ? db.users.find((u) => u._id === fac.userId) : null;
    const dept = db.departments.find((d) => d._id === item.departmentId);

    return {
      ...item,
      subjectName: sub?.name || 'Subject',
      subjectCode: sub?.code || '',
      facultyName: facUser?.name || 'Assigned Faculty',
      departmentName: dept?.name || '',
      departmentCode: dept?.code || '',
    };
  });

  return res.json({ success: true, data: enriched });
});

// POST create timetable slot (Admin only)
router.post('/', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { day, startTime, endTime, subjectId, facultyId, room, departmentId, semester } = req.body;

  if (!day || !startTime || !endTime || !subjectId || !room) {
    return res.status(400).json({ success: false, message: 'Missing required timetable parameters.' });
  }

  const newEntry: TimetableDoc = {
    _id: 'tt_' + Date.now(),
    day,
    startTime,
    endTime,
    subjectId,
    facultyId: facultyId || 'fac_1',
    room,
    departmentId: departmentId || 'dept_cs',
    semester: Number(semester) || 6,
  };

  db.timetable.push(newEntry);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'TIMETABLE_CREATED', 'Timetable', newEntry._id, `Added ${day} slot for ${subjectId}`);

  return res.status(201).json({ success: true, message: 'Timetable entry added successfully', data: newEntry });
});

// PUT update timetable slot (Admin only)
router.put('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const slot = db.timetable.find((t) => t._id === req.params.id);
  if (!slot) {
    return res.status(404).json({ success: false, message: 'Timetable slot not found.' });
  }

  const { day, startTime, endTime, subjectId, facultyId, room, departmentId, semester } = req.body;
  if (day) slot.day = day;
  if (startTime) slot.startTime = startTime;
  if (endTime) slot.endTime = endTime;
  if (subjectId) slot.subjectId = subjectId;
  if (facultyId) slot.facultyId = facultyId;
  if (room) slot.room = room;
  if (departmentId) slot.departmentId = departmentId;
  if (semester !== undefined) slot.semester = Number(semester);

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'TIMETABLE_UPDATED', 'Timetable', slot._id, `Updated slot ${slot.day} in ${slot.room}`);

  return res.json({ success: true, message: 'Timetable slot updated successfully.', data: slot });
});

// DELETE timetable slot
router.delete('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.timetable.findIndex((t) => t._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Timetable slot not found.' });
  }

  db.timetable.splice(index, 1);
  db.save();
  return res.json({ success: true, message: 'Timetable slot deleted.' });
});

export default router;
