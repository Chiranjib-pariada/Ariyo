import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Assignment, TimetableSlot, Subject, FacultyProfile } from '../../types';
import {
  Users,
  CalendarCheck,
  FileText,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface FacultyDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigateTab }) => {
  const { user, profileRecord } = useAuth();
  const faculty = profileRecord as FacultyProfile | null;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<TimetableSlot[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFacultyData() {
      try {
        setLoading(true);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDay = days[new Date().getDay()] || 'Monday';
        const dayToFetch = todayDay === 'Sunday' ? 'Monday' : todayDay;

        const [assignData, timeData, subData] = await Promise.all([
          api.get<Assignment[]>('/api/assignments', 'faculty_assignments'),
          api.get<TimetableSlot[]>(`/api/timetable?day=${dayToFetch}`, 'faculty_today_tt'),
          api.get<Subject[]>('/api/subjects', 'faculty_subjects'),
        ]);

        setAssignments(assignData || []);
        setTodaySchedule(timeData || []);
        setSubjects(subData || []);
      } catch (err) {
        console.warn('Faculty dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFacultyData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
              Faculty Workspace • {faculty?.designation || 'Head of Department'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Faculty ID: <span className="font-mono font-bold">{faculty?.facultyId || 'FAC-CSE-001'}</span> •{' '}
              {faculty?.qualification || 'Ph.D. in Computer Science'} • {faculty?.departmentName || 'Computer Science & Engineering'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 shadow-md transition"
            >
              Mark Today&apos;s Attendance
            </button>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition border border-white/20"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('students')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Students</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">128 Enrolled</div>
          <div className="text-[11px] text-slate-500">Across Semesters 4, 6 & 8</div>
        </div>

        <div
          onClick={() => onNavigateTab('assignments')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Published Coursework</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{assignments.length} Tasks</div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            14 Submissions to grade
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('timetable')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lectures Scheduled</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{todaySchedule.length} Sessions</div>
          <div className="text-[11px] text-slate-500">Next: Turing Lab 2</div>
        </div>

        <div
          onClick={() => onNavigateTab('results')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-800 transition cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Grade Submissions</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Active Portal</div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            Continuous Evaluation Open
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Teaching Schedule and Quick Submissions to Grade */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Today's Teaching Slots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Today&apos;s Teaching Schedule</span>
            </h3>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Weekly Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                No lecture sessions allocated for today.
              </div>
            ) : (
              todaySchedule.map((slot) => (
                <div
                  key={slot._id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold shrink-0">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {slot.subjectName} ({slot.subjectCode})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Semester {slot.semester} • Room: <strong className="text-slate-700 dark:text-slate-300">{slot.room}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition"
                  >
                    Take Attendance
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Assignment Submissions To Grade */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Assignments Overview</span>
            </h3>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {a.subjectCode}
                  </span>
                  <span className="text-xs text-slate-400">Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{a.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">Max Marks: {a.maxMarks}</span>
                  <button
                    onClick={() => onNavigateTab('assignments')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Grade Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
