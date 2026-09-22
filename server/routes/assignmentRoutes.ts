import { Router } from 'express';
import { db, AssignmentDoc, SubmissionDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all assignments
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const { subjectId, courseId } = req.query;

  let list = db.assignments;
  if (subjectId) list = list.filter((a) => a.subjectId === subjectId);
  if (courseId) list = list.filter((a) => a.courseId === courseId);

  // If student is logged in, attach their submission status to each assignment
  let studentDoc: any = null;
  if (req.user?.role === 'STUDENT') {
    studentDoc = db.students.find((s) => s.userId === req.user?.userId);
  }

  const enriched = list.map((asg) => {
    const sub = db.subjects.find((s) => s._id === asg.subjectId);
    const crs = db.courses.find((c) => c._id === asg.courseId);
    const fac = db.faculty.find((f) => f._id === asg.facultyId);
    const facUser = fac ? db.users.find((u) => u._id === fac.userId) : null;
    const submissions = db.submissions.filter((s) => s.assignmentId === asg._id);

    let mySubmission: SubmissionDoc | undefined = undefined;
    if (studentDoc) {
      mySubmission = submissions.find((s) => s.studentId === studentDoc._id);
    }

    return {
      ...asg,
      subjectName: sub?.name || 'General',
      subjectCode: sub?.code || '',
      courseName: crs?.name || '',
      facultyName: facUser?.name || 'Faculty',
      totalSubmissionsCount: submissions.length,
      mySubmission,
    };
  });

  return res.json({ success: true, data: enriched });
});

// GET single assignment with all submissions (Faculty or Admin)
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const asg = db.assignments.find((a) => a._id === req.params.id);
  if (!asg) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }

  const sub = db.subjects.find((s) => s._id === asg.subjectId);
  const crs = db.courses.find((c) => c._id === asg.courseId);
  const fac = db.faculty.find((f) => f._id === asg.facultyId);
  const facUser = fac ? db.users.find((u) => u._id === fac.userId) : null;

  const rawSubmissions = db.submissions.filter((s) => s.assignmentId === asg._id);
  const submissions = rawSubmissions.map((sm) => {
    const student = db.students.find((st) => st._id === sm.studentId);
    const stUser = student ? db.users.find((u) => u._id === student.userId) : null;
    return {
      ...sm,
      studentName: stUser?.name || 'Student',
      studentRollNo: student?.studentId || sm.studentId,
    };
  });

  return res.json({
    success: true,
    data: {
      ...asg,
      subjectName: sub?.name,
      subjectCode: sub?.code,
      courseName: crs?.name,
      facultyName: facUser?.name,
      submissions,
    },
  });
});

// POST create assignment (Faculty only)
router.post('/', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const { title, description, subjectId, courseId, dueDate, maxMarks } = req.body;

  if (!title || !subjectId || !dueDate) {
    return res.status(400).json({ success: false, message: 'Title, Subject, and Due Date are required.' });
  }

  let facultyRecordId = 'fac_1';
  if (req.user?.role === 'FACULTY') {
    const fac = db.faculty.find((f) => f.userId === req.user?.userId);
    if (fac) facultyRecordId = fac._id;
  }

  const newAssignment: AssignmentDoc = {
    _id: 'asg_' + Date.now(),
    title,
    description: description || '',
    facultyId: facultyRecordId,
    subjectId,
    courseId: courseId || 'crs_btech_cs',
    dueDate,
    maxMarks: Number(maxMarks) || 50,
    createdAt: new Date().toISOString(),
  };

  db.assignments.push(newAssignment);

  // Notify students
  db.students.forEach((stu) => {
    db.notifications.push({
      _id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: stu.userId,
      title: 'New Assignment Posted',
      message: `${title} has been posted. Due: ${new Date(dueDate).toLocaleDateString()}`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString(),
    });
  });

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'ASSIGNMENT_CREATED', 'Assignment', newAssignment._id, `Posted assignment: ${title}`);

  return res.status(201).json({
    success: true,
    message: 'Assignment published successfully',
    data: newAssignment,
  });
});

// PUT update assignment (Faculty or Admin)
router.put('/:id', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const asg = db.assignments.find((a) => a._id === req.params.id);
  if (!asg) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }

  const { title, description, dueDate, maxMarks, subjectId, courseId } = req.body;
  if (title) asg.title = title.trim();
  if (description !== undefined) asg.description = description;
  if (dueDate) asg.dueDate = dueDate;
  if (maxMarks !== undefined) asg.maxMarks = Number(maxMarks);
  if (subjectId) asg.subjectId = subjectId;
  if (courseId) asg.courseId = courseId;

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'ASSIGNMENT_UPDATED', 'Assignment', asg._id, `Updated assignment ${asg.title}`);

  return res.json({ success: true, message: 'Assignment updated successfully.', data: asg });
});

// DELETE assignment (Faculty or Admin)
router.delete('/:id', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.assignments.findIndex((a) => a._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }

  const asg = db.assignments[index];
  db.assignments.splice(index, 1);
  // Also clean up submissions for this assignment in-place
  for (let i = db.submissions.length - 1; i >= 0; i--) {
    if (db.submissions[i].assignmentId === req.params.id) {
      db.submissions.splice(i, 1);
    }
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'ASSIGNMENT_DELETED', 'Assignment', asg._id, `Deleted assignment ${asg.title}`);

  return res.json({ success: true, message: `Assignment ${asg.title} and related submissions removed.` });
});

// POST submit assignment (Student only)
router.post('/:id/submit', requireAuth, requireRole(['STUDENT']), (req: AuthenticatedRequest, res) => {
  const asg = db.assignments.find((a) => a._id === req.params.id);
  if (!asg) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }

  const student = db.students.find((s) => s.userId === req.user?.userId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student profile not found.' });
  }

  const { fileName, fileContent } = req.body;
  const isLate = new Date() > new Date(asg.dueDate);

  const existingIndex = db.submissions.findIndex((s) => s.assignmentId === asg._id && s.studentId === student._id);

  if (existingIndex >= 0) {
    db.submissions[existingIndex].fileUrl = `/uploads/${fileName || 'submission.pdf'}`;
    db.submissions[existingIndex].fileName = fileName || 'submission.pdf';
    db.submissions[existingIndex].submittedAt = new Date().toISOString();
    db.submissions[existingIndex].status = isLate ? 'Late' : 'Submitted';
  } else {
    const newSubm: SubmissionDoc = {
      _id: 'subm_' + Date.now(),
      assignmentId: asg._id,
      studentId: student._id,
      fileUrl: `/uploads/${fileName || 'submission.pdf'}`,
      fileName: fileName || 'submission.pdf',
      submittedAt: new Date().toISOString(),
      status: isLate ? 'Late' : 'Submitted',
    };
    db.submissions.push(newSubm);
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'ASSIGNMENT_SUBMITTED', 'Submission', asg._id, `Submitted assignment ${asg.title}`);

  return res.json({
    success: true,
    message: isLate ? 'Assignment submitted late.' : 'Assignment submitted successfully!',
  });
});

// POST grade submission (Faculty only)
router.post('/submissions/:id/grade', requireAuth, requireRole(['FACULTY', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const subm = db.submissions.find((s) => s._id === req.params.id);
  if (!subm) {
    return res.status(404).json({ success: false, message: 'Submission not found.' });
  }

  const { marks, feedback } = req.body;
  subm.marks = Number(marks);
  subm.feedback = feedback || '';
  subm.status = 'Graded';

  // Notify student
  const student = db.students.find((s) => s._id === subm.studentId);
  if (student) {
    db.notifications.push({
      _id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: student.userId,
      title: 'Assignment Graded',
      message: `Your assignment submission was graded: ${marks} marks.`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'SUBMISSION_GRADED', 'Submission', subm._id, `Graded submission with ${marks} marks`);

  return res.json({
    success: true,
    message: 'Submission graded successfully',
    data: subm,
  });
});

export default router;
