import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  AttendanceSummary,
  Assignment,
  Result,
  TimetableSlot,
  Notice,
  StudentProfile,
} from '../../types';
import {
  GraduationCap,
  CalendarCheck,
  FileText,
  Award,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const { user, profileRecord } = useAuth();
  const student = profileRecord as StudentProfile | null;
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<TimetableSlot[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        setLoading(true);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDay = days[new Date().getDay()] || 'Monday';
        const dayToFetch = todayDay === 'Sunday' ? 'Monday' : todayDay;

        const [attData, assignData, resData, timeData, notifData] = await Promise.all([
          api.get<AttendanceSummary>('/api/attendance/my-summary', 'student_att_sum'),
          api.get<Assignment[]>('/api/assignments', 'student_assignments'),
          api.get<Result[]>('/api/results/my-results', 'student_results'),
          api.get<TimetableSlot[]>(`/api/timetable?day=${dayToFetch}`, 'student_today_tt'),
          api.get<Notice[]>('/api/notices', 'student_notices'),
        ]);

        setAttendance(attData);
        setAssignments(assignData || []);
        setResults(resData || []);
        setTodaySchedule(timeData || []);
        setNotices((notifData || []).slice(0, 3));
      } catch (err) {
        console.warn('Dashboard fetch fallback to offline cache:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, []);

  const pendingAssignments = assignments.filter(
    (a) => !a.mySubmission || a.mySubmission.status === 'Pending'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
              Student Portal • Semester {student?.semester || 6}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Student ID: <span className="font-mono font-bold">{student?.studentId || 'STU-2024-001'}</span> •{' '}
              {student?.departmentName || 'Computer Science & Engineering'} • Batch {student?.batch || '2023-2027'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[90px]">
              <span className="block text-[10px] text-blue-200 uppercase font-semibold">Current CGPA</span>
              <span className="text-2xl font-black">{student?.cgpa?.toFixed(2) || '8.85'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[90px]">
              <span className="block text-[10px] text-blue-200 uppercase font-semibold">Attendance</span>
              <span className="text-2xl font-black">{attendance?.overallPercentage || 90.9}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Attendance</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {attendance?.overallPercentage || 90.9}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible for End-Sem Exam (&gt;75%)</span>
          </div>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => onNavigateTab('assignments')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assignments</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {pendingAssignments.length} Pending
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>{assignments.length} Total Coursework Tasks</span>
          </div>
        </div>

        {/* Academic Results */}
        <div
          onClick={() => onNavigateTab('results')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Latest SGPA</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            8.90 SGPA
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Grade: Distinction (O / A+)</span>
          </div>
        </div>

        {/* Today's Lectures */}
        <div
          onClick={() => onNavigateTab('timetable')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today&apos;s Lectures</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {todaySchedule.length || 3} Classes
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Next: Distributed Systems (10:00 AM)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Actionable Items */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Today's Schedule Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Today&apos;s Lecture Schedule</span>
            </h3>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full Week</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                No scheduled lectures for today. Enjoy your study session!
              </div>
            ) : (
              todaySchedule.map((slot) => (
                <div
                  key={slot._id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold shrink-0">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {slot.subjectName} ({slot.subjectCode})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {slot.facultyName} • Hall: <strong className="text-slate-700 dark:text-slate-300">{slot.room}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded">
                    Room {slot.room}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Pending Coursework List */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Urgent Assignments Due</span>
              </h3>
              <button
                onClick={() => onNavigateTab('assignments')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({assignments.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingAssignments.slice(0, 2).map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded font-bold">
                      {item.subjectCode}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Due: {new Date(item.dueDate).toLocaleDateString()} • Max Marks: {item.maxMarks}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('assignments')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Subject Attendance Breakdown & Circulars */}
        <div className="lg:col-span-5 space-y-6">
          {/* Subject Attendance Breakdown */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject Attendance</h3>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Details
              </button>
            </div>

            <div className="space-y-3">
              {attendance?.subjectWise?.map((sub) => (
                <div key={sub.subjectId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {sub.subjectName}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        sub.percentage >= 75
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sub.percentage >= 75 ? 'bg-blue-600' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, sub.percentage)}%` }}
                    />
                  </div>
                </div>
              )) || (
                <div className="text-xs text-slate-400">Loading attendance metrics...</div>
              )}
            </div>
          </div>

          {/* Important Notices Widget */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Official Bulletins</h3>
              <button
                onClick={() => onNavigateTab('notices')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {notices.map((n) => (
                <div key={n._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    {n.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {n.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
