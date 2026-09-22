import { Router } from 'express';
import { db, ResultDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

function calculateGradeAndPoint(total: number): { grade: string; gradePoint: number } {
  if (total >= 90) return { grade: 'A+', gradePoint: 10.0 };
  if (total >= 80) return { grade: 'A', gradePoint: 9.0 };
  if (total >= 70) return { grade: 'B+', gradePoint: 8.0 };
  if (total >= 60) return { grade: 'B', gradePoint: 7.0 };
  if (total >= 50) return { grade: 'C', gradePoint: 6.0 };
  if (total >= 40) return { grade: 'P', gradePoint: 4.0 };
  return { grade: 'F', gradePoint: 0.0 };
}

// GET results
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const { studentId, semester } = req.query;

  let targetStudentId = studentId ? String(studentId) : undefined;
  if (req.user?.role === 'STUDENT') {
    const student = db.students.find((s) => s.userId === req.user?.userId);
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });
    targetStudentId = student._id;
  }

  let list = db.results;
  if (targetStudentId) {
    list = list.filter((r) => r.studentId === targetStudentId);
  }
  if (semester) {
    list = list.filter((r) => r.semester === Number(semester));
  }

  const enriched = list.map((resItem) => {
    const sub = db.subjects.find((s) => s._id === resItem.subjectId);
    const stu = db.students.find((s) => s._id === resItem.studentId);
    const stuUser = stu ? db.users.find((u) => u._id === stu.userId) : null;
    return {
      ...resItem,
      subjectName: sub?.name || 'Subject',
      subjectCode: sub?.code || '',
      credits: sub?.credits || 3,
      studentName: stuUser?.name || 'Student',
      studentRollNo: stu?.studentId || resItem.studentId,
    };
  });

  // Calculate SGPA for requested semester or overall CGPA
  let totalCredits = 0;
  let weightedPoints = 0;
  enriched.forEach((item) => {
    totalCredits += item.credits;
    weightedPoints += item.gradePoint * item.credits;
  });

  const computedGpa = totalCredits > 0 ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;

  return res.json({
    success: true,
    data: {
      results: enriched,
      gpa: computedGpa,
      totalCredits,
    },
  });
});

// POST enter / update result (Faculty or Admin)
router.post('/', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const { studentId, subjectId, semester, internalMarks, assignmentMarks, practicalMarks, examMarks } = req.body;

  if (!studentId || !subjectId) {
    return res.status(400).json({ success: false, message: 'studentId and subjectId are required.' });
  }

  const internal = Math.min(30, Math.max(0, Number(internalMarks) || 0));
  const assignment = Math.min(20, Math.max(0, Number(assignmentMarks) || 0));
  const practical = Math.min(25, Math.max(0, Number(practicalMarks) || 0));
  const exam = Math.min(25, Math.max(0, Number(examMarks) || 0));

  const totalMarks = internal + assignment + practical + exam;
  const { grade, gradePoint } = calculateGradeAndPoint(totalMarks);

  const existingIndex = db.results.findIndex((r) => r.studentId === studentId && r.subjectId === subjectId);

  let record: ResultDoc;
  if (existingIndex >= 0) {
    db.results[existingIndex].internalMarks = internal;
    db.results[existingIndex].assignmentMarks = assignment;
    db.results[existingIndex].practicalMarks = practical;
    db.results[existingIndex].examMarks = exam;
    db.results[existingIndex].totalMarks = totalMarks;
    db.results[existingIndex].grade = grade;
    db.results[existingIndex].gradePoint = gradePoint;
    record = db.results[existingIndex];
  } else {
    record = {
      _id: 'res_' + Date.now(),
      studentId,
      subjectId,
      semester: Number(semester) || 6,
      internalMarks: internal,
      assignmentMarks: assignment,
      practicalMarks: practical,
      examMarks: exam,
      totalMarks,
      grade,
      gradePoint,
    };
    db.results.push(record);
  }

  // Update student CGPA
  const student = db.students.find((s) => s._id === studentId);
  if (student) {
    const studentResults = db.results.filter((r) => r.studentId === studentId);
    let totalC = 0;
    let weightedP = 0;
    studentResults.forEach((r) => {
      const sub = db.subjects.find((s) => s._id === r.subjectId);
      const cred = sub?.credits || 3;
      totalC += cred;
      weightedP += r.gradePoint * cred;
    });
    if (totalC > 0) {
      student.cgpa = Number((weightedP / totalC).toFixed(2));
    }

    db.notifications.push({
      _id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: student.userId,
      title: 'New Examination Result Published',
      message: `Your final marks for ${record.subjectId} have been published. Grade: ${grade}`,
      type: 'result',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'RESULT_PUBLISHED', 'Result', record._id, `Recorded grade ${grade} (${totalMarks}) for ${studentId}`);

  return res.status(201).json({
    success: true,
    message: 'Result computed and saved successfully with server-verified grading.',
    data: record,
  });
});

// DELETE result (Faculty or Admin only)
router.delete('/:id', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.results.findIndex((r) => r._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Result record not found.' });
  }

  const result = db.results[index];
  db.results.splice(index, 1);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'RESULT_DELETED', 'Result', result._id, `Deleted result record ${result._id}`);

  return res.json({ success: true, message: 'Result record deleted successfully.' });
});

export default router;
