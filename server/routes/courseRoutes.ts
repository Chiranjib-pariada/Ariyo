import { Router } from 'express';
import { db, CourseDoc, SubjectDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Courses
router.get('/courses', (req, res) => {
  const { departmentId } = req.query;
  let list = db.courses.map((crs) => {
    const dept = db.departments.find((d) => d._id === crs.departmentId);
    const faculty = db.faculty.find((f) => f._id === crs.facultyId);
    const facultyUser = faculty ? db.users.find((u) => u._id === faculty.userId) : null;
    const subjects = db.subjects.filter((s) => s.courseId === crs._id);
    return {
      ...crs,
      departmentName: dept?.name,
      departmentCode: dept?.code,
      facultyName: facultyUser?.name || 'Assigned Faculty',
      subjectCount: subjects.length,
      subjects,
    };
  });

  if (departmentId && departmentId !== 'ALL') {
    list = list.filter((c) => c.departmentId === departmentId);
  }

  return res.json({ success: true, data: list });
});

router.post('/courses', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { name, code, departmentId, semester, credits, facultyId, description } = req.body;
  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Course name and code are required.' });
  }

  const newCourse: CourseDoc = {
    _id: 'crs_' + Date.now(),
    name,
    code: code.toUpperCase(),
    departmentId: departmentId || 'dept_cs',
    semester: Number(semester) || 1,
    credits: Number(credits) || 20,
    facultyId: facultyId || 'fac_1',
    description: description || '',
  };

  db.courses.push(newCourse);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'COURSE_CREATED', 'Course', newCourse._id, `Created course ${name}`);

  return res.status(201).json({ success: true, message: 'Course created successfully', data: newCourse });
});

// PUT update course (Admin only)
router.put('/courses/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const course = db.courses.find((c) => c._id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const { name, code, departmentId, semester, credits, facultyId, description } = req.body;
  if (name) course.name = name.trim();
  if (code) course.code = code.trim().toUpperCase();
  if (departmentId) course.departmentId = departmentId;
  if (semester !== undefined) course.semester = Number(semester);
  if (credits !== undefined) course.credits = Number(credits);
  if (facultyId) course.facultyId = facultyId;
  if (description !== undefined) course.description = description;

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'COURSE_UPDATED', 'Course', course._id, `Updated course ${course.name}`);

  return res.json({ success: true, message: 'Course updated successfully.', data: course });
});

// DELETE course (Admin only)
router.delete('/courses/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.courses.findIndex((c) => c._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const course = db.courses[index];
  db.courses.splice(index, 1);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'COURSE_DELETED', 'Course', course._id, `Deleted course ${course.name}`);

  return res.json({ success: true, message: `Course ${course.name} deleted successfully.` });
});

// Subjects
router.get('/subjects', (req, res) => {
  const { departmentId, courseId, semester } = req.query;
  let list = db.subjects.map((sub) => {
    const dept = db.departments.find((d) => d._id === sub.departmentId);
    const crs = db.courses.find((c) => c._id === sub.courseId);
    const fac = db.faculty.find((f) => f._id === sub.facultyId);
    const facUser = fac ? db.users.find((u) => u._id === fac.userId) : null;
    return {
      ...sub,
      departmentName: dept?.name,
      courseName: crs?.name,
      facultyName: facUser?.name || 'TBA',
    };
  });

  if (departmentId && departmentId !== 'ALL') {
    list = list.filter((s) => s.departmentId === departmentId);
  }
  if (courseId) {
    list = list.filter((s) => s.courseId === courseId);
  }
  if (semester) {
    list = list.filter((s) => s.semester === Number(semester));
  }

  return res.json({ success: true, data: list });
});

router.post('/subjects', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { name, code, courseId, departmentId, semester, credits, facultyId } = req.body;
  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Subject name and code are required.' });
  }

  const newSub: SubjectDoc = {
    _id: 'sub_' + Date.now(),
    name,
    code: code.toUpperCase(),
    courseId: courseId || 'crs_btech_cs',
    departmentId: departmentId || 'dept_cs',
    semester: Number(semester) || 1,
    credits: Number(credits) || 3,
    facultyId: facultyId || 'fac_1',
  };

  db.subjects.push(newSub);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'SUBJECT_CREATED', 'Subject', newSub._id, `Created subject ${name}`);

  return res.status(201).json({ success: true, message: 'Subject created successfully', data: newSub });
});

// PUT update subject (Admin only)
router.put('/subjects/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const subject = db.subjects.find((s) => s._id === req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found.' });
  }

  const { name, code, courseId, departmentId, semester, credits, facultyId } = req.body;
  if (name) subject.name = name.trim();
  if (code) subject.code = code.trim().toUpperCase();
  if (courseId) subject.courseId = courseId;
  if (departmentId) subject.departmentId = departmentId;
  if (semester !== undefined) subject.semester = Number(semester);
  if (credits !== undefined) subject.credits = Number(credits);
  if (facultyId) subject.facultyId = facultyId;

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'SUBJECT_UPDATED', 'Subject', subject._id, `Updated subject ${subject.name}`);

  return res.json({ success: true, message: 'Subject updated successfully.', data: subject });
});

// DELETE subject (Admin only)
router.delete('/subjects/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.subjects.findIndex((s) => s._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Subject not found.' });
  }

  const subject = db.subjects[index];
  db.subjects.splice(index, 1);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'SUBJECT_DELETED', 'Subject', subject._id, `Deleted subject ${subject.name}`);

  return res.json({ success: true, message: `Subject ${subject.name} deleted successfully.` });
});

export default router;
