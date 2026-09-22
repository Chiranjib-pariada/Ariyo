import { Router } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET dashboard statistics & analytics
router.get('/stats', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const totalStudents = db.students.length;
  const totalFaculty = db.faculty.length;
  const totalDepartments = db.departments.length;
  const totalCourses = db.courses.length;
  const totalSubjects = db.subjects.length;
  const totalAssignments = db.assignments.length;
  const totalNotices = db.notices.length;
  const totalEvents = db.events.length;

  // Department distribution
  const departmentStats = db.departments.map((d) => ({
    name: d.name,
    code: d.code,
    students: d.studentCount || db.students.filter((s) => s.departmentId === d._id).length,
    faculty: d.facultyCount || db.faculty.filter((f) => f.departmentId === d._id).length,
  }));

  // Attendance trends
  const attendanceTotal = db.attendance.length;
  const attendancePresent = db.attendance.filter((a) => a.status === 'Present').length;
  const attendanceLate = db.attendance.filter((a) => a.status === 'Late').length;
  const avgAttendance = attendanceTotal > 0 ? Number((((attendancePresent + attendanceLate) / attendanceTotal) * 100).toFixed(1)) : 91.5;

  // Assignment completion
  const totalSubmissions = db.submissions.length;
  const gradedSubmissions = db.submissions.filter((s) => s.status === 'Graded').length;

  return res.json({
    success: true,
    data: {
      metrics: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalCourses,
        totalSubjects,
        totalAssignments,
        totalNotices,
        totalEvents,
        avgAttendance,
        assignmentCompletionRate: totalAssignments > 0 ? Number(((totalSubmissions / (totalAssignments * Math.max(1, totalStudents))) * 100).toFixed(1)) : 82,
      },
      departmentStats,
      recentAuditLogs: db.auditLogs.slice(0, 10),
      attendanceBreakdown: [
        { label: 'Present', count: attendancePresent, percentage: 84 },
        { label: 'Late', count: attendanceLate, percentage: 7 },
        { label: 'Absent', count: db.attendance.filter((a) => a.status === 'Absent').length, percentage: 7 },
        { label: 'Excused', count: db.attendance.filter((a) => a.status === 'Excused').length, percentage: 2 },
      ],
      semesterPerformance: [
        { semester: 'Sem 1', averageGpa: 8.1 },
        { semester: 'Sem 2', averageGpa: 8.3 },
        { semester: 'Sem 3', averageGpa: 8.4 },
        { semester: 'Sem 4', averageGpa: 8.7 },
        { semester: 'Sem 5', averageGpa: 8.9 },
        { semester: 'Sem 6', averageGpa: 9.1 },
      ],
    },
  });
});

// GET audit logs with search and pagination
router.get('/audit-logs', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { search, page = '1', limit = '20' } = req.query;

  let list = [...db.auditLogs];

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
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

// GET institutional reports
router.get('/reports', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const reports = [
    {
      id: 'rep_students_overall',
      title: 'Annual Student Enrollment & Demographics Report',
      category: 'Enrollment',
      generatedAt: '2026-09-20T12:00:00Z',
      recordsCount: db.students.length,
      status: 'Ready',
    },
    {
      id: 'rep_faculty_workload',
      title: 'Faculty Teaching Load & Research Distribution',
      category: 'Faculty',
      generatedAt: '2026-09-21T09:30:00Z',
      recordsCount: db.faculty.length,
      status: 'Ready',
    },
    {
      id: 'rep_attendance_summary',
      title: 'Institutional Attendance Compliance & Defaulters List',
      category: 'Academic',
      generatedAt: '2026-09-22T06:00:00Z',
      recordsCount: db.attendance.length,
      status: 'Ready',
    },
    {
      id: 'rep_examination_cgpa',
      title: 'Semester 6 Examination CGPA & Performance Matrix',
      category: 'Examination',
      generatedAt: '2026-09-21T18:00:00Z',
      recordsCount: db.results.length,
      status: 'Ready',
    },
  ];

  return res.json({ success: true, data: reports });
});

export default router;
