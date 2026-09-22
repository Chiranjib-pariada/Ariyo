import { Router } from 'express';
import { db, FacultyDoc, UserDoc, hashPassword } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all faculty
router.get('/', (req, res) => {
  const { search, departmentId } = req.query;

  let list = db.faculty.map((fac) => {
    const user = db.users.find((u) => u._id === fac.userId);
    const dept = db.departments.find((d) => d._id === fac.departmentId);
    const assignedSubjects = db.subjects.filter((s) => fac.subjects.includes(s._id));
    return {
      ...fac,
      name: user?.name || 'Faculty Member',
      email: user?.email || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || '',
      departmentName: dept?.name || fac.departmentId,
      departmentCode: dept?.code || '',
      assignedSubjects,
    };
  });

  if (departmentId && departmentId !== 'ALL') {
    list = list.filter((f) => f.departmentId === departmentId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.facultyId.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    data: list,
  });
});

// GET single faculty
router.get('/:id', (req, res) => {
  const fac = db.faculty.find((f) => f._id === req.params.id || f.facultyId === req.params.id || f.userId === req.params.id);
  if (!fac) {
    return res.status(404).json({ success: false, message: 'Faculty member not found.' });
  }

  const user = db.users.find((u) => u._id === fac.userId);
  const dept = db.departments.find((d) => d._id === fac.departmentId);
  const assignedSubjects = db.subjects.filter((s) => fac.subjects.includes(s._id));

  return res.json({
    success: true,
    data: {
      ...fac,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      profileImage: user?.profileImage,
      departmentName: dept?.name,
      departmentCode: dept?.code,
      assignedSubjects,
    },
  });
});

// POST create faculty (Admin only)
router.post('/', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { name, email, phone, departmentId, designation, qualification, subjects, courses } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email address already in use.' });
  }

  const userId = 'usr_' + Date.now();
  const newUser: UserDoc = {
    _id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword('Ariyo@2026'),
    role: 'FACULTY',
    phone: phone || '+1 (555) 000-0000',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  const facCount = db.faculty.length + 1;
  const facultyId = `ARFAC-D${String(facCount).padStart(3, '0')}`;
  const newFaculty: FacultyDoc = {
    _id: 'fac_' + Date.now(),
    userId,
    facultyId,
    departmentId: departmentId || 'dept_cs',
    designation: designation || 'Assistant Professor',
    qualification: qualification || 'M.Tech / Ph.D',
    subjects: subjects || ['sub_algo'],
    courses: courses || ['crs_btech_cs'],
    createdAt: new Date().toISOString(),
  };
  db.faculty.push(newFaculty);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'FACULTY_CREATED', 'Faculty', newFaculty._id, `Added faculty member ${name} (${facultyId})`);

  return res.status(201).json({
    success: true,
    message: 'Faculty created successfully with temporary password Ariyo@2026',
    data: {
      ...newFaculty,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

// PUT update faculty (Admin or Self)
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const fac = db.faculty.find((f) => f._id === req.params.id);
  if (!fac) {
    return res.status(404).json({ success: false, message: 'Faculty member not found.' });
  }

  if (req.user?.role !== 'ADMIN' && req.user?.userId !== fac.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized to update this faculty profile.' });
  }

  const { name, email, phone, designation, qualification, departmentId, subjects, profileImage } = req.body;

  const user = db.users.find((u) => u._id === fac.userId);
  if (user) {
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (profileImage) user.profileImage = profileImage;
    if (email && req.user?.role === 'ADMIN') user.email = email.trim().toLowerCase();
  }

  if (qualification) fac.qualification = qualification;
  if (req.user?.role === 'ADMIN') {
    if (designation) fac.designation = designation;
    if (departmentId) fac.departmentId = departmentId;
    if (subjects && Array.isArray(subjects)) fac.subjects = subjects;
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'FACULTY_UPDATED', 'Faculty', fac._id, `Updated faculty ${fac.facultyId} (${user?.name})`);

  return res.json({
    success: true,
    message: 'Faculty profile updated successfully.',
    data: {
      ...fac,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      profileImage: user?.profileImage,
    },
  });
});

// DELETE faculty (Admin only)
router.delete('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.faculty.findIndex((f) => f._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Faculty member not found.' });
  }

  const fac = db.faculty[index];
  const user = db.users.find((u) => u._id === fac.userId);

  db.faculty.splice(index, 1);
  if (user) {
    const uIndex = db.users.findIndex((u) => u._id === user._id);
    if (uIndex !== -1) db.users.splice(uIndex, 1);
  }

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'FACULTY_DELETED', 'Faculty', fac._id, `Removed faculty ${fac.facultyId}`);

  return res.json({
    success: true,
    message: `Faculty ${fac.facultyId} removed successfully.`,
  });
});

export default router;
