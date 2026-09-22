export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  profileImage: string;
  createdAt: string;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  studentId: string;
  departmentId: string;
  departmentName?: string;
  departmentCode?: string;
  semester: number;
  batch: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  courses: string[];
  cgpa: number;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface FacultyProfile {
  _id: string;
  userId: string;
  facultyId: string;
  departmentId: string;
  departmentName?: string;
  departmentCode?: string;
  designation: string;
  qualification: string;
  subjects: string[];
  courses: string[];
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  assignedSubjects?: Subject[];
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  hod: string;
  headOfDepartment?: string;
  description: string;
  status: 'Active' | 'Inactive';
  studentCount: number;
  facultyCount: number;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName?: string;
  semester: number;
  credits: number;
  facultyId: string;
  facultyName?: string;
  description: string;
  subjectCount?: number;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  courseId: string;
  departmentId: string;
  semester: number;
  credits: number;
  facultyId: string;
  facultyName?: string;
}

export interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  facultyId: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  overallPercentage: number;
  isWarning: boolean;
  subjectWise: {
    subjectId: string;
    subjectName: string;
    total: number;
    attended: number;
    percentage: number;
  }[];
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  facultyId: string;
  facultyName?: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  courseId: string;
  dueDate: string;
  maxMarks: number;
  totalSubmissionsCount?: number;
  mySubmission?: Submission;
  createdAt: string;
}

export interface Submission {
  _id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  status: 'Pending' | 'Submitted' | 'Late' | 'Graded';
  marks?: number;
  feedback?: string;
}

export interface Result {
  _id: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  credits: number;
  semester: number;
  internalMarks: number;
  assignmentMarks: number;
  practicalMarks: number;
  examMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
}

export interface TimetableSlot {
  _id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  facultyId: string;
  facultyName?: string;
  room: string;
  departmentId: string;
  departmentName?: string;
  departmentCode?: string;
  semester: number;
}

export interface Notice {
  _id: string;
  title: string;
  description: string;
  content?: string;
  category: 'Academic' | 'Examination' | 'Event' | 'Holiday' | 'General' | 'Emergency' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  targetAudience: 'ALL' | 'STUDENT' | 'FACULTY';
  department?: string;
  semester?: number;
  publishedAt: string;
  publishDate?: string;
  createdBy: string;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  category?: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  image: string;
  registrationLink?: string;
  attendeesCount: number;
  createdBy: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'notice' | 'attendance' | 'result' | 'event' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
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
  ipAddress?: string;
}

export interface AdminStats {
  metrics: {
    totalStudents: number;
    totalFaculty: number;
    totalDepartments: number;
    totalCourses: number;
    totalSubjects: number;
    totalAssignments: number;
    totalNotices: number;
    totalEvents: number;
    avgAttendance: number;
    assignmentCompletionRate: number;
  };
  departmentStats: {
    name: string;
    code: string;
    students: number;
    faculty: number;
  }[];
  recentAuditLogs: AuditLog[];
  attendanceBreakdown: { label: string; count: number; percentage: number }[];
  semesterPerformance: { semester: string; averageGpa: number }[];
}
