import { Router } from 'express';
import { db, StudentDoc, UserDoc, hashPassword } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all students with search & filter
router.get('/', (req, res) => {
  const { search, departmentId, semester, page = '1', limit = '20' } = req.query;

  let list = db.students.map((stu) => {
    const user = db.users.find((u) => u._id === stu.userId);
    const dept = db.departments.find((d) => d._id === stu.departmentId);
    return {
      ...stu,
      name: user?.name || 'Unknown',
      email: user?.email || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || '',
      departmentName: dept?.name || stu.departmentId,
      departmentCode: dept?.code || '',
    };
  });

  if (departmentId && departmentId !== 'ALL') {
    list = list.filter((s) => s.departmentId === departmentId);
  }

  if (semester) {
    list = list.filter((s) => s.semester === Number(semester));
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.departmentName.toLowerCase().includes(q)
    );
  }

  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 20;
  const total = list.length;
  const pages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = list.slice(startIndex, startIndex + limitNum);

  return res.json({
    success: true,
    data: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages,
    },
  });
});

// GET single student
router.get('/:id', (req, res) => {
  const student = db.students.find((s) => s._id === req.params.id || s.studentId === req.params.id || s.userId === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student record not found.' });
  }

  const user = db.users.find((u) => u._id === student.userId);
  const dept = db.departments.find((d) => d._id === student.departmentId);

  return res.json({
    success: true,
    data: {
      ...student,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      profileImage: user?.profileImage,
      departmentName: dept?.name,
      departmentCode: dept?.code,
    },
  });
});

// POST add new student (Admin only)
router.post('/', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { name, email, phone, departmentId, semester, batch, dateOfBirth, gender, address, guardianName, guardianPhone, courses } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Student name and email are required.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
  }

  const userId = 'usr_' + Date.now();
  const newUser: UserDoc = {
    _id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword('Ariyo@2026'),
    role: 'STUDENT',
    phone: phone || '+1 (555) 000-0000',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  const studentCount = db.students.length + 1;
  const studentId = `AR2026-CS${String(studentCount).padStart(3, '0')}`;
  const newStudent: StudentDoc = {
    _id: 'stu_' + Date.now(),
    userId,
    studentId,
    departmentId: departmentId || 'dept_cs',
    semester: Number(semester) || 1,
    batch: batch || '2026-2030',
    dateOfBirth: dateOfBirth || '2005-01-01',
    gender: gender || 'Other',
    address: address || 'Campus Residence',
    guardianName: guardianName || 'Guardian',
    guardianPhone: guardianPhone || phone || '+1 (555) 000-0000',
    courses: courses || ['crs_btech_cs'],
    cgpa: 8.5,
    createdAt: new Date().toISOString(),
  };
  db.students.push(newStudent);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'STUDENT_CREATED', 'Student', newStudent._id, `Added student: ${name} (${studentId})`);

  return res.status(201).json({
    success: true,
    message: 'Student created successfully with temporary password Ariyo@2026',
    data: {
      ...newStudent,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

// PUT update student
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const student = db.students.find((s) => s._id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  // Only Admin or the student himself can update
  if (req.user?.role !== 'ADMIN' && req.user?.userId !== student.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized to modify this profile.' });
  }

  const { name, email, phone, address, guardianName, guardianPhone, semester, departmentId, batch, profileImage } = req.body;

  const user = db.users.find((u) => u._id === student.userId);
  if (user) {
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (profileImage) user.profileImage = profileImage;
    if (email && req.user?.role === 'ADMIN') user.email = email.trim().toLowerCase();
  }

  if (address !== undefined) student.address = address;
  if (guardianName !== undefined) student.guardianName = guardianName;
  if (guardianPhone !== undefined) student.guardianPhone = guardianPhone;

  // Only admin can change semester, department, batch
  if (req.user?.role === 'ADMIN') {
    if (semester !== undefined) student.semester = Number(semester);
    if (departmentId) student.departmentId = departmentId;
    if (batch) student.batch = batch;
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'STUDENT_UPDATED', 'Student', student._id, `Updated student ${student.studentId} (${user?.name})`);

  return res.json({
    success: true,
    message: 'Student profile updated successfully',
    data: {
      ...student,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      profileImage: user?.profileImage,
    },
  });
});

// DELETE delete/deregister student
router.delete('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.students.findIndex((s) => s._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  const student = db.students[index];
  const user = db.users.find((u) => u._id === student.userId);

  // Remove from students collection
  db.students.splice(index, 1);
  if (user) {
    const uIndex = db.users.findIndex((u) => u._id === user._id);
    if (uIndex !== -1) db.users.splice(uIndex, 1);
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'STUDENT_DELETED', 'Student', student._id, `Deregistered student ${student.studentId}`);

  return res.json({
    success: true,
    message: `Student ${student.studentId} deregistered successfully.`,
  });
});

export default router;
