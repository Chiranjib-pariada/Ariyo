import { Router } from 'express';
import { db, AttendanceDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET attendance list
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const { studentId, subjectId, date, facultyId } = req.query;

  let list = db.attendance;

  // If student, can only view own attendance
  if (req.user?.role === 'STUDENT') {
    const student = db.students.find((s) => s.userId === req.user?.userId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }
    list = list.filter((a) => a.studentId === student._id);
  } else if (studentId) {
    list = list.filter((a) => a.studentId === studentId);
  }

  if (subjectId) {
    list = list.filter((a) => a.subjectId === subjectId);
  }
  if (date) {
    list = list.filter((a) => a.date === date);
  }
  if (facultyId) {
    list = list.filter((a) => a.facultyId === facultyId);
  }

  const enriched = list.map((att) => {
    const stu = db.students.find((s) => s._id === att.studentId);
    const stuUser = stu ? db.users.find((u) => u._id === stu.userId) : null;
    const sub = db.subjects.find((s) => s._id === att.subjectId);
    return {
      ...att,
      studentName: stuUser?.name || 'Student',
      studentRollNo: stu?.studentId || att.studentId,
      subjectName: sub?.name || att.subjectId,
      subjectCode: sub?.code || '',
    };
  });

  return res.json({ success: true, data: enriched });
});

// GET attendance statistics summary for a student
router.get('/summary/:studentId', requireAuth, (req: AuthenticatedRequest, res) => {
  let targetStudentId = req.params.studentId;

  if (req.user?.role === 'STUDENT') {
    const selfStudent = db.students.find((s) => s.userId === req.user?.userId);
    if (!selfStudent) return res.status(404).json({ success: false, message: 'Student not found.' });
    targetStudentId = selfStudent._id;
  }

  const records = db.attendance.filter((a) => a.studentId === targetStudentId);
  const total = records.length;
  const present = records.filter((a) => a.status === 'Present').length;
  const late = records.filter((a) => a.status === 'Late').length;
  const absent = records.filter((a) => a.status === 'Absent').length;
  const excused = records.filter((a) => a.status === 'Excused').length;

  // Count late as 0.5 or 1 depending on rule; here standard: Present + Late are attended
  const attended = present + late;
  const overallPercentage = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 100;

  // Subject-wise breakdown
  const subjectMap = new Map<string, { subjectId: string; subjectName: string; total: number; attended: number }>();

  db.subjects.forEach((sub) => {
    subjectMap.set(sub._id, {
      subjectId: sub._id,
      subjectName: sub.name,
      total: 0,
      attended: 0,
    });
  });

  records.forEach((rec) => {
    const entry = subjectMap.get(rec.subjectId);
    if (entry) {
      entry.total += 1;
      if (rec.status === 'Present' || rec.status === 'Late') {
        entry.attended += 1;
      }
    }
  });

  const subjectWise = Array.from(subjectMap.values())
    .filter((item) => item.total > 0)
    .map((item) => ({
      ...item,
      percentage: Number(((item.attended / item.total) * 100).toFixed(1)),
    }));

  return res.json({
    success: true,
    data: {
      totalClasses: total,
      presentCount: present,
      lateCount: late,
      absentCount: absent,
      excusedCount: excused,
      overallPercentage,
      isWarning: overallPercentage < 75,
      subjectWise,
    },
  });
});

// POST mark attendance (Faculty or Admin)
router.post('/mark', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const { entries, subjectId, date, courseId } = req.body;
  // entries: Array<{ studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks?: string }>

  if (!entries || !Array.isArray(entries) || !subjectId || !date) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payload: entries array, subjectId, and date are required.',
    });
  }

  let facultyRecordId = 'fac_1';
  if (req.user?.role === 'FACULTY') {
    const fac = db.faculty.find((f) => f.userId === req.user?.userId);
    if (!fac) return res.status(403).json({ success: false, message: 'Faculty record not found.' });

    // Ensure faculty teaches this subject
    if (!fac.subjects.includes(subjectId)) {
      return res.status(403).json({
        success: false,
        message: 'Security Restriction: You are not authorized to mark attendance for a course you do not teach.',
      });
    }
    facultyRecordId = fac._id;
  }

  // Upsert attendance records for the date and subject
  entries.forEach((item) => {
    const existingIndex = db.attendance.findIndex(
      (a) => a.studentId === item.studentId && a.subjectId === subjectId && a.date === date
    );

    if (existingIndex >= 0) {
      db.attendance[existingIndex].status = item.status;
      db.attendance[existingIndex].remarks = item.remarks || '';
      db.attendance[existingIndex].facultyId = facultyRecordId;
    } else {
      const newRec: AttendanceDoc = {
        _id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        studentId: item.studentId,
        facultyId: facultyRecordId,
        subjectId,
        date,
        status: item.status,
        remarks: item.remarks || '',
      };
      db.attendance.push(newRec);
    }
  });

  db.save();

  db.logAudit(
    req.user!.userId,
    req.user!.name,
    req.user!.role,
    'ATTENDANCE_RECORDED',
    'Attendance',
    subjectId,
    `Recorded attendance for ${entries.length} students on ${date}`
  );

  return res.json({
    success: true,
    message: `Attendance marked successfully for ${entries.length} students.`,
  });
});

export default router;
