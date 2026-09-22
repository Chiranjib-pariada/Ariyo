import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  phone: string;
  profileImage: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface StudentDoc {
  _id: string;
  userId: string;
  studentId: string;
  departmentId: string;
  semester: number;
  batch: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  courses: string[];
  cgpa: number;
  createdAt: string;
}

export interface FacultyDoc {
  _id: string;
  userId: string;
  facultyId: string;
  departmentId: string;
  designation: string;
  qualification: string;
  subjects: string[];
  courses: string[];
  createdAt: string;
}

export interface DepartmentDoc {
  _id: string;
  name: string;
  code: string;
  hod: string;
  description: string;
  status: 'Active' | 'Inactive';
  studentCount: number;
  facultyCount: number;
}

export interface CourseDoc {
  _id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: number;
  credits: number;
  facultyId: string;
  description: string;
}

export interface SubjectDoc {
  _id: string;
  name: string;
  code: string;
  courseId: string;
  departmentId: string;
  semester: number;
  credits: number;
  facultyId: string;
}

export interface AttendanceDoc {
  _id: string;
  studentId: string;
  facultyId: string;
  subjectId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

export interface AssignmentDoc {
  _id: string;
  title: string;
  description: string;
  facultyId: string;
  subjectId: string;
  courseId: string;
  dueDate: string;
  maxMarks: number;
  attachments?: string[];
  createdAt: string;
}

export interface SubmissionDoc {
  _id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  status: 'Pending' | 'Submitted' | 'Late' | 'Graded';
  marks?: number;
  feedback?: string;
}

export interface ResultDoc {
  _id: string;
  studentId: string;
  subjectId: string;
  semester: number;
  internalMarks: number;
  assignmentMarks: number;
  practicalMarks: number;
  examMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
}

export interface TimetableDoc {
  _id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subjectId: string;
  facultyId: string;
  room: string;
  departmentId: string;
  semester: number;
}

export interface NoticeDoc {
  _id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Examination' | 'Event' | 'Holiday' | 'General' | 'Emergency';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  targetAudience: 'ALL' | 'STUDENT' | 'FACULTY';
  department?: string;
  semester?: number;
  publishedAt: string;
  createdBy: string;
}

export interface EventDoc {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  image: string;
  registrationLink?: string;
  attendeesCount: number;
  createdBy: string;
}

export interface NotificationDoc {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'notice' | 'attendance' | 'result' | 'event' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AuditLogDoc {
  _id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface DatabaseSchema {
  users: UserDoc[];
  students: StudentDoc[];
  faculty: FacultyDoc[];
  departments: DepartmentDoc[];
  courses: CourseDoc[];
  subjects: SubjectDoc[];
  attendance: AttendanceDoc[];
  assignments: AssignmentDoc[];
  submissions: SubmissionDoc[];
  results: ResultDoc[];
  timetable: TimetableDoc[];
  notices: NoticeDoc[];
  events: EventDoc[];
  notifications: NotificationDoc[];
  auditLogs: AuditLogDoc[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ariyo-db.json');

// Password hash helper
export function hashPassword(password: string): string {
  const salt = 'ariyo_campus_salt_2026';
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function getInitialData(): DatabaseSchema {
  const adminId = 'usr_admin_1';
  const faculty1Id = 'usr_fac_1';
  const faculty2Id = 'usr_fac_2';
  const student1Id = 'usr_stu_1';
  const student2Id = 'usr_stu_2';

  const defaultPassword = hashPassword('Ariyo@2026');

  const users: UserDoc[] = [
    {
      _id: adminId,
      name: 'Dr. Arthur Sterling',
      email: 'admin@ariyo.edu',
      passwordHash: defaultPassword,
      role: 'ADMIN',
      phone: '+1 (555) 019-2831',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-01T09:00:00Z',
    },
    {
      _id: faculty1Id,
      name: 'Dr. Ananya Sen',
      email: 'ananya.sen@ariyo.edu',
      passwordHash: defaultPassword,
      role: 'FACULTY',
      phone: '+1 (555) 019-4422',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-05T10:00:00Z',
    },
    {
      _id: faculty2Id,
      name: 'Prof. Marcus Vance',
      email: 'marcus.vance@ariyo.edu',
      passwordHash: defaultPassword,
      role: 'FACULTY',
      phone: '+1 (555) 019-5561',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-05T11:00:00Z',
    },
    {
      _id: student1Id,
      name: 'Rahul Sharma',
      email: 'student@ariyo.edu',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      phone: '+1 (555) 019-7788',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-10T12:00:00Z',
    },
    {
      _id: student2Id,
      name: 'Sophia Chen',
      email: 'sophia.chen@ariyo.edu',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      phone: '+1 (555) 019-8899',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-10T12:30:00Z',
    },
  ];

  const departments: DepartmentDoc[] = [
    {
      _id: 'dept_cs',
      name: 'Computer Science & Engineering',
      code: 'CSE',
      hod: 'Dr. Ananya Sen',
      description: 'Computing systems, algorithms, machine intelligence, and software engineering.',
      status: 'Active',
      studentCount: 420,
      facultyCount: 24,
    },
    {
      _id: 'dept_it',
      name: 'Information Technology',
      code: 'IT',
      hod: 'Prof. Marcus Vance',
      description: 'Distributed systems, enterprise networking, and cloud architectures.',
      status: 'Active',
      studentCount: 380,
      facultyCount: 18,
    },
    {
      _id: 'dept_ece',
      name: 'Electronics & Communication',
      code: 'ECE',
      hod: 'Dr. Elena Rostova',
      description: 'Semiconductors, signal processing, and telecommunications.',
      status: 'Active',
      studentCount: 310,
      facultyCount: 16,
    },
    {
      _id: 'dept_mech',
      name: 'Mechanical Engineering',
      code: 'MECH',
      hod: 'Dr. Vikram Patel',
      description: 'Thermodynamics, robotics, and advanced manufacturing.',
      status: 'Active',
      studentCount: 290,
      facultyCount: 14,
    },
    {
      _id: 'dept_civil',
      name: 'Civil Engineering',
      code: 'CIVIL',
      hod: 'Prof. Thomas Wright',
      description: 'Structural design, hydrology, and sustainable urban infrastructure.',
      status: 'Active',
      studentCount: 240,
      facultyCount: 12,
    },
    {
      _id: 'dept_bba',
      name: 'Business Administration',
      code: 'BBA',
      hod: 'Dr. Sarah Jenkins',
      description: 'Strategic management, financial systems, and entrepreneurship.',
      status: 'Active',
      studentCount: 350,
      facultyCount: 20,
    },
  ];

  const courses: CourseDoc[] = [
    {
      _id: 'crs_btech_cs',
      name: 'B.Tech Computer Science & Engineering',
      code: 'CS-401',
      departmentId: 'dept_cs',
      semester: 6,
      credits: 24,
      facultyId: 'fac_1',
      description: 'Four-year comprehensive undergraduate engineering program in computing.',
    },
    {
      _id: 'crs_btech_it',
      name: 'B.Tech Information Technology',
      code: 'IT-302',
      departmentId: 'dept_it',
      semester: 4,
      credits: 22,
      facultyId: 'fac_2',
      description: 'Undergraduate curriculum specializing in networks and enterprise software.',
    },
    {
      _id: 'crs_mtech_ai',
      name: 'M.Tech Artificial Intelligence & Robotics',
      code: 'AI-601',
      departmentId: 'dept_cs',
      semester: 2,
      credits: 20,
      facultyId: 'fac_1',
      description: 'Postgraduate program covering neural architectures and autonomous agents.',
    },
  ];

  const subjects: SubjectDoc[] = [
    {
      _id: 'sub_algo',
      name: 'Design & Analysis of Algorithms',
      code: 'CS601',
      courseId: 'crs_btech_cs',
      departmentId: 'dept_cs',
      semester: 6,
      credits: 4,
      facultyId: 'fac_1',
    },
    {
      _id: 'sub_dbms',
      name: 'Distributed Database Systems',
      code: 'CS602',
      courseId: 'crs_btech_cs',
      departmentId: 'dept_cs',
      semester: 6,
      credits: 4,
      facultyId: 'fac_1',
    },
    {
      _id: 'sub_net',
      name: 'Computer Networks & Security',
      code: 'CS603',
      courseId: 'crs_btech_cs',
      departmentId: 'dept_cs',
      semester: 6,
      credits: 4,
      facultyId: 'fac_2',
    },
    {
      _id: 'sub_os',
      name: 'Operating Systems Architecture',
      code: 'CS604',
      courseId: 'crs_btech_cs',
      departmentId: 'dept_cs',
      semester: 6,
      credits: 3,
      facultyId: 'fac_2',
    },
    {
      _id: 'sub_se',
      name: 'Software Engineering Principles',
      code: 'CS605',
      courseId: 'crs_btech_cs',
      departmentId: 'dept_cs',
      semester: 6,
      credits: 3,
      facultyId: 'fac_1',
    },
  ];

  const students: StudentDoc[] = [
    {
      _id: 'stu_1',
      userId: student1Id,
      studentId: 'AR2023-CS042',
      departmentId: 'dept_cs',
      semester: 6,
      batch: '2023-2027',
      dateOfBirth: '2004-03-15',
      gender: 'Male',
      address: '42 Highland Ave, Cambridge, MA',
      guardianName: 'Ramesh Sharma',
      guardianPhone: '+1 (555) 012-3490',
      courses: ['crs_btech_cs'],
      cgpa: 9.18,
      createdAt: '2025-08-10T12:00:00Z',
    },
    {
      _id: 'stu_2',
      userId: student2Id,
      studentId: 'AR2023-CS088',
      departmentId: 'dept_cs',
      semester: 6,
      batch: '2023-2027',
      dateOfBirth: '2004-07-22',
      gender: 'Female',
      address: '108 Beacon St, Boston, MA',
      guardianName: 'David Chen',
      guardianPhone: '+1 (555) 014-5567',
      courses: ['crs_btech_cs'],
      cgpa: 8.94,
      createdAt: '2025-08-10T12:30:00Z',
    },
  ];

  const faculty: FacultyDoc[] = [
    {
      _id: 'fac_1',
      userId: faculty1Id,
      facultyId: 'ARFAC-CS001',
      departmentId: 'dept_cs',
      designation: 'Associate Professor & HOD',
      qualification: 'Ph.D. in Computer Science (MIT), M.Tech',
      subjects: ['sub_algo', 'sub_dbms', 'sub_se'],
      courses: ['crs_btech_cs', 'crs_mtech_ai'],
      createdAt: '2025-08-05T10:00:00Z',
    },
    {
      _id: 'fac_2',
      userId: faculty2Id,
      facultyId: 'ARFAC-IT004',
      departmentId: 'dept_it',
      designation: 'Senior Assistant Professor',
      qualification: 'Ph.D. in Systems & Networking (Stanford)',
      subjects: ['sub_net', 'sub_os'],
      courses: ['crs_btech_cs', 'crs_btech_it'],
      createdAt: '2025-08-05T11:00:00Z',
    },
  ];

  const attendance: AttendanceDoc[] = [
    { _id: 'att_1', studentId: 'stu_1', facultyId: 'fac_1', subjectId: 'sub_algo', date: '2026-09-18', status: 'Present' },
    { _id: 'att_2', studentId: 'stu_1', facultyId: 'fac_1', subjectId: 'sub_algo', date: '2026-09-19', status: 'Present' },
    { _id: 'att_3', studentId: 'stu_1', facultyId: 'fac_1', subjectId: 'sub_algo', date: '2026-09-20', status: 'Present' },
    { _id: 'att_4', studentId: 'stu_1', facultyId: 'fac_1', subjectId: 'sub_algo', date: '2026-09-21', status: 'Late', remarks: 'Traffic delay' },
    { _id: 'att_5', studentId: 'stu_1', facultyId: 'fac_1', subjectId: 'sub_dbms', date: '2026-09-18', status: 'Present' },
    { _id: 'att_6', studentId: 'stu_1', facultyId: 'fac_1', subjectId: 'sub_dbms', date: '2026-09-20', status: 'Present' },
    { _id: 'att_7', studentId: 'stu_1', facultyId: 'fac_2', subjectId: 'sub_net', date: '2026-09-19', status: 'Present' },
    { _id: 'att_8', studentId: 'stu_1', facultyId: 'fac_2', subjectId: 'sub_net', date: '2026-09-21', status: 'Present' },
    { _id: 'att_9', studentId: 'stu_1', facultyId: 'fac_2', subjectId: 'sub_os', date: '2026-09-18', status: 'Present' },
    { _id: 'att_10', studentId: 'stu_1', facultyId: 'fac_2', subjectId: 'sub_os', date: '2026-09-21', status: 'Absent', remarks: 'Medical leave' },
    { _id: 'att_11', studentId: 'stu_2', facultyId: 'fac_1', subjectId: 'sub_algo', date: '2026-09-21', status: 'Present' },
    { _id: 'att_12', studentId: 'stu_2', facultyId: 'fac_2', subjectId: 'sub_net', date: '2026-09-21', status: 'Present' },
  ];

  const assignments: AssignmentDoc[] = [
    {
      _id: 'asg_1',
      title: 'Dynamic Programming: Knapsack & Longest Common Subsequence',
      description: 'Implement bottom-up DP solutions with space optimization and formal algorithmic complexity analysis.',
      facultyId: 'fac_1',
      subjectId: 'sub_algo',
      courseId: 'crs_btech_cs',
      dueDate: '2026-09-28T23:59:59Z',
      maxMarks: 50,
      createdAt: '2026-09-15T10:00:00Z',
    },
    {
      _id: 'asg_2',
      title: 'Query Optimization & B+ Tree Index Partitioning',
      description: 'Benchmark composite indices against query execution plans on a 2-million record synthetic dataset.',
      facultyId: 'fac_1',
      subjectId: 'sub_dbms',
      courseId: 'crs_btech_cs',
      dueDate: '2026-10-02T23:59:59Z',
      maxMarks: 40,
      createdAt: '2026-09-18T14:00:00Z',
    },
    {
      _id: 'asg_3',
      title: 'Zero-Knowledge Cryptographic Handshake Simulation',
      description: 'Simulate TLS 1.3 key exchange using elliptic curve Diffie-Hellman in Wireshark packet captures.',
      facultyId: 'fac_2',
      subjectId: 'sub_net',
      courseId: 'crs_btech_cs',
      dueDate: '2026-10-05T23:59:59Z',
      maxMarks: 60,
      createdAt: '2026-09-20T09:00:00Z',
    },
  ];

  const submissions: SubmissionDoc[] = [
    {
      _id: 'subm_1',
      assignmentId: 'asg_1',
      studentId: 'stu_1',
      fileUrl: '/uploads/asg1_rahul_sharma.pdf',
      fileName: 'DP_Algorithms_AR2023CS042.pdf',
      submittedAt: '2026-09-20T19:40:00Z',
      status: 'Graded',
      marks: 48,
      feedback: 'Excellent asymptotic time and space optimization diagrams. Clean proof of correctness.',
    },
    {
      _id: 'subm_2',
      assignmentId: 'asg_2',
      studentId: 'stu_1',
      fileUrl: '/uploads/asg2_rahul_sharma.pdf',
      fileName: 'DBMS_Optimization_AR2023CS042.pdf',
      submittedAt: '2026-09-22T06:15:00Z',
      status: 'Submitted',
    },
  ];

  const results: ResultDoc[] = [
    {
      _id: 'res_1',
      studentId: 'stu_1',
      subjectId: 'sub_algo',
      semester: 6,
      internalMarks: 28,
      assignmentMarks: 19,
      practicalMarks: 24,
      examMarks: 25,
      totalMarks: 96,
      grade: 'A+',
      gradePoint: 10.0,
    },
    {
      _id: 'res_2',
      studentId: 'stu_1',
      subjectId: 'sub_dbms',
      semester: 6,
      internalMarks: 26,
      assignmentMarks: 18,
      practicalMarks: 23,
      examMarks: 24,
      totalMarks: 91,
      grade: 'A+',
      gradePoint: 10.0,
    },
    {
      _id: 'res_3',
      studentId: 'stu_1',
      subjectId: 'sub_net',
      semester: 6,
      internalMarks: 25,
      assignmentMarks: 17,
      practicalMarks: 22,
      examMarks: 24,
      totalMarks: 88,
      grade: 'A',
      gradePoint: 9.0,
    },
    {
      _id: 'res_4',
      studentId: 'stu_1',
      subjectId: 'sub_os',
      semester: 6,
      internalMarks: 24,
      assignmentMarks: 17,
      practicalMarks: 21,
      examMarks: 23,
      totalMarks: 85,
      grade: 'A',
      gradePoint: 9.0,
    },
    {
      _id: 'res_5',
      studentId: 'stu_1',
      subjectId: 'sub_se',
      semester: 6,
      internalMarks: 27,
      assignmentMarks: 18,
      practicalMarks: 24,
      examMarks: 23,
      totalMarks: 92,
      grade: 'A+',
      gradePoint: 10.0,
    },
  ];

  const timetable: TimetableDoc[] = [
    {
      _id: 'tt_1',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:15',
      subjectId: 'sub_algo',
      facultyId: 'fac_1',
      room: 'Turing Hall (LH-301)',
      departmentId: 'dept_cs',
      semester: 6,
    },
    {
      _id: 'tt_2',
      day: 'Monday',
      startTime: '10:30',
      endTime: '11:45',
      subjectId: 'sub_dbms',
      facultyId: 'fac_1',
      room: 'Systems Lab B',
      departmentId: 'dept_cs',
      semester: 6,
    },
    {
      _id: 'tt_3',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '10:15',
      subjectId: 'sub_net',
      facultyId: 'fac_2',
      room: 'Networking Lab (NL-104)',
      departmentId: 'dept_cs',
      semester: 6,
    },
    {
      _id: 'tt_4',
      day: 'Wednesday',
      startTime: '11:00',
      endTime: '12:15',
      subjectId: 'sub_algo',
      facultyId: 'fac_1',
      room: 'Turing Hall (LH-301)',
      departmentId: 'dept_cs',
      semester: 6,
    },
    {
      _id: 'tt_5',
      day: 'Thursday',
      startTime: '13:30',
      endTime: '15:30',
      subjectId: 'sub_os',
      facultyId: 'fac_2',
      room: 'Operating Systems Sandbox',
      departmentId: 'dept_cs',
      semester: 6,
    },
    {
      _id: 'tt_6',
      day: 'Friday',
      startTime: '10:00',
      endTime: '11:30',
      subjectId: 'sub_se',
      facultyId: 'fac_1',
      room: 'Auditorium West',
      departmentId: 'dept_cs',
      semester: 6,
    },
    {
      _id: 'tt_7',
      day: 'Saturday',
      startTime: '10:00',
      endTime: '12:00',
      subjectId: 'sub_algo',
      facultyId: 'fac_1',
      room: 'Seminar Hall 2',
      departmentId: 'dept_cs',
      semester: 6,
    },
  ];

  const notices: NoticeDoc[] = [
    {
      _id: 'ntc_1',
      title: 'End-Semester Theory & Practical Examination Schedule',
      description: 'The final examination schedule for B.Tech Semesters 4, 6 and M.Tech has been published by the Controller of Examinations. Hall tickets are available for download.',
      category: 'Examination',
      priority: 'Urgent',
      targetAudience: 'ALL',
      department: 'dept_cs',
      semester: 6,
      publishedAt: '2026-09-21T08:00:00Z',
      createdBy: 'Dr. Arthur Sterling',
    },
    {
      _id: 'ntc_2',
      title: 'Annual Campus Hackathon — HackARIYO 2026 Registrations Open',
      description: '48-hour national level hackathon focusing on AI for Sustainability and Smart Infrastructure. Cash prizes worth $25,000 sponsored by premier tech partners.',
      category: 'Event',
      priority: 'High',
      targetAudience: 'STUDENT',
      publishedAt: '2026-09-20T11:30:00Z',
      createdBy: 'Dr. Ananya Sen',
    },
    {
      _id: 'ntc_3',
      title: 'Academic Council Meeting & Curriculum Revision Guidelines',
      description: 'Mandatory faculty briefing regarding outcome-based education (OBE) accreditation and updated credit distribution matrices.',
      category: 'Academic',
      priority: 'Medium',
      targetAudience: 'FACULTY',
      publishedAt: '2026-09-19T14:00:00Z',
      createdBy: 'Dr. Arthur Sterling',
    },
    {
      _id: 'ntc_4',
      title: 'Campus Solar Microgrid Upgrade & Planned Power Shift',
      description: 'Green energy transition work will take place this Sunday from 02:00 AM to 06:00 AM. Backup generators will supply uninterrupted power to server facilities.',
      category: 'General',
      priority: 'Low',
      targetAudience: 'ALL',
      publishedAt: '2026-09-18T16:00:00Z',
      createdBy: 'Campus Facilities',
    },
  ];

  const events: EventDoc[] = [
    {
      _id: 'evt_1',
      title: 'HackARIYO: National Smart Campus Hackathon',
      description: 'A 48-hour student innovation challenge creating open smart campus tools, generative AI assistants, and green sensor telemetry.',
      date: '2026-10-14',
      time: '09:00 AM - 05:00 PM',
      venue: 'Main Innovation & Research Complex',
      organizer: 'Department of Computer Science & Robotics Club',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
      registrationLink: 'https://ariyo.edu/hackariyo',
      attendeesCount: 384,
      createdBy: 'admin@ariyo.edu',
    },
    {
      _id: 'evt_2',
      title: 'Global Tech Symposium: Quantum & Neural Architectures',
      description: 'Distinguished keynotes from IEEE fellows, Turing laureates, and industry leaders on quantum algorithms and agentic computing.',
      date: '2026-10-22',
      time: '10:00 AM - 04:30 PM',
      venue: 'Grand Convocation Auditorium',
      organizer: 'Academic Affairs Council',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
      registrationLink: 'https://ariyo.edu/symposium',
      attendeesCount: 520,
      createdBy: 'admin@ariyo.edu',
    },
    {
      _id: 'evt_3',
      title: 'Inter-Collegiate Cultural Festival: AURA 2026',
      description: 'Three days of music, theatre, digital arts, choreography, and culinary showcases celebrating campus multiculturalism.',
      date: '2026-11-05',
      time: '04:00 PM - 10:00 PM',
      venue: 'Open Air Amphitheatre',
      organizer: 'Student Cultural Committee',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      registrationLink: 'https://ariyo.edu/aura',
      attendeesCount: 1450,
      createdBy: 'admin@ariyo.edu',
    },
  ];

  const notifications: NotificationDoc[] = [
    {
      _id: 'notif_1',
      userId: student1Id,
      title: 'Assignment Graded',
      message: 'Dr. Ananya Sen graded your submission for Dynamic Programming (48/50).',
      type: 'assignment',
      read: false,
      createdAt: '2026-09-21T18:00:00Z',
    },
    {
      _id: 'notif_2',
      userId: student1Id,
      title: 'Exam Schedule Announced',
      message: 'End-semester examination schedule for Semester 6 is now available.',
      type: 'notice',
      read: false,
      createdAt: '2026-09-21T08:15:00Z',
    },
    {
      _id: 'notif_3',
      userId: student1Id,
      title: 'Attendance Alert',
      message: 'Your overall attendance is healthy at 90.9%. Keep it above 85% for exam clearance.',
      type: 'attendance',
      read: true,
      createdAt: '2026-09-20T10:00:00Z',
    },
    {
      _id: 'notif_4',
      userId: faculty1Id,
      title: 'New Assignment Submissions',
      message: '24 students submitted their DBMS Optimization queries.',
      type: 'assignment',
      read: false,
      createdAt: '2026-09-22T06:30:00Z',
    },
    {
      _id: 'notif_5',
      userId: adminId,
      title: 'System Audit',
      message: 'Daily integrity checks completed across all student enrollment records.',
      type: 'system',
      read: true,
      createdAt: '2026-09-22T04:00:00Z',
    },
  ];

  const auditLogs: AuditLogDoc[] = [
    {
      _id: 'log_1',
      userId: adminId,
      userName: 'Dr. Arthur Sterling',
      role: 'ADMIN',
      action: 'SYSTEM_INITIALIZATION',
      entity: 'System',
      entityId: 'ariyo_core',
      details: 'ARIYO Smart Campus Core initialized with 6 academic departments and role security.',
      timestamp: '2026-09-15T00:00:00Z',
      ip: '127.0.0.1',
    },
    {
      _id: 'log_2',
      userId: faculty1Id,
      userName: 'Dr. Ananya Sen',
      role: 'FACULTY',
      action: 'ATTENDANCE_RECORDED',
      entity: 'Attendance',
      entityId: 'sub_algo',
      details: 'Marked lecture attendance for 42 students in Design & Analysis of Algorithms.',
      timestamp: '2026-09-21T10:20:00Z',
      ip: '10.0.4.12',
    },
    {
      _id: 'log_3',
      userId: adminId,
      userName: 'Dr. Arthur Sterling',
      role: 'ADMIN',
      action: 'NOTICE_PUBLISHED',
      entity: 'Notice',
      entityId: 'ntc_1',
      details: 'Published high-priority notice: End-Semester Theory & Practical Examination Schedule.',
      timestamp: '2026-09-21T08:00:00Z',
      ip: '10.0.1.2',
    },
  ];

  return {
    users,
    students,
    faculty,
    departments,
    courses,
    subjects,
    attendance,
    assignments,
    submissions,
    results,
    timetable,
    notices,
    events,
    notifications,
    auditLogs,
  };
}

class AriyoDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read existing database file, falling back to seed data:', e);
    }
    const seed = getInitialData();
    this.saveDataDirect(seed);
    return seed;
  }

  private saveDataDirect(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  public resetToDefaults() {
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  public get users() { return this.data.users; }
  public get students() { return this.data.students; }
  public get faculty() { return this.data.faculty; }
  public get departments() { return this.data.departments; }
  public get courses() { return this.data.courses; }
  public get subjects() { return this.data.subjects; }
  public get attendance() { return this.data.attendance; }
  public get assignments() { return this.data.assignments; }
  public get submissions() { return this.data.submissions; }
  public get results() { return this.data.results; }
  public get timetable() { return this.data.timetable; }
  public get notices() { return this.data.notices; }
  public get events() { return this.data.events; }
  public get notifications() { return this.data.notifications; }
  public get auditLogs() { return this.data.auditLogs; }

  public logAudit(userId: string, userName: string, role: string, action: string, entity: string, entityId: string, details: string, ip?: string) {
    const entry: AuditLogDoc = {
      _id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      userName,
      role,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      ip,
    };
    this.data.auditLogs.unshift(entry);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
  }
}

export const db = new AriyoDatabase();
