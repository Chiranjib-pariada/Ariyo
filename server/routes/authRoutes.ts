import { Router } from 'express';
import { db, hashPassword, verifyPassword, UserDoc } from '../db/database';
import { generateJwtToken, generateRefreshToken } from '../utils/auth';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
  }

  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials.',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'This account has been deactivated. Please contact administration.',
    });
  }

  const accessToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user);

  let profileRecord: any = null;
  if (user.role === 'STUDENT') {
    profileRecord = db.students.find((s) => s.userId === user._id) || null;
  } else if (user.role === 'FACULTY') {
    profileRecord = db.faculty.find((f) => f.userId === user._id) || null;
  }

  db.logAudit(user._id, user.name, user.role, 'USER_LOGIN', 'Auth', user._id, `User logged in successfully`);

  return res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      profileRecord,
      token: accessToken,
      refreshToken,
    },
  });
});

router.post('/register', (req, res) => {
  const { name, email, password, role, phone, departmentId, semester, batch, designation } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required fields.',
    });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists.',
    });
  }

  const chosenRole = role === 'FACULTY' ? 'FACULTY' : 'STUDENT';
  const userId = 'usr_' + Date.now();
  const passwordHash = hashPassword(password);

  const newUser: UserDoc = {
    _id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: chosenRole,
    phone: phone || '+1 (555) 000-0000',
    profileImage: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
    isActive: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  let profileRecord: any = null;
  if (chosenRole === 'STUDENT') {
    const studentCount = db.students.length + 1;
    const studentId = `AR2026-STU${String(studentCount).padStart(3, '0')}`;
    profileRecord = {
      _id: 'stu_' + Date.now(),
      userId,
      studentId,
      departmentId: departmentId || 'dept_cs',
      semester: Number(semester) || 1,
      batch: batch || '2026-2030',
      dateOfBirth: '2005-01-01',
      gender: 'Unspecified',
      address: 'Campus Hostel Block 4',
      guardianName: 'Guardian',
      guardianPhone: phone || '+1 (555) 000-0000',
      courses: ['crs_btech_cs'],
      cgpa: 8.5,
      createdAt: new Date().toISOString(),
    };
    db.students.push(profileRecord);
  } else if (chosenRole === 'FACULTY') {
    const facultyCount = db.faculty.length + 1;
    const facultyId = `ARFAC-${String(facultyCount).padStart(3, '0')}`;
    profileRecord = {
      _id: 'fac_' + Date.now(),
      userId,
      facultyId,
      departmentId: departmentId || 'dept_cs',
      designation: designation || 'Assistant Professor',
      qualification: 'M.Tech / Ph.D Candidate',
      subjects: ['sub_algo'],
      courses: ['crs_btech_cs'],
      createdAt: new Date().toISOString(),
    };
    db.faculty.push(profileRecord);
  }

  db.save();

  const accessToken = generateJwtToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  db.logAudit(userId, newUser.name, newUser.role, 'USER_REGISTER', 'User', userId, `New ${chosenRole} registered: ${newUser.email}`);

  return res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt,
      },
      profileRecord,
      token: accessToken,
      refreshToken,
    },
  });
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u._id === req.user?.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found.',
    });
  }

  let profileRecord: any = null;
  if (user.role === 'STUDENT') {
    profileRecord = db.students.find((s) => s.userId === user._id) || null;
  } else if (user.role === 'FACULTY') {
    profileRecord = db.faculty.find((f) => f.userId === user._id) || null;
  }

  return res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      profileRecord,
    },
  });
});

router.post('/reset-demo', (req, res) => {
  db.resetToDefaults();
  return res.json({
    success: true,
    message: 'Database reset to clean ARIYO default state.',
  });
});

export default router;
