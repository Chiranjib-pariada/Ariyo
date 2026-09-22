import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminStats } from '../../types';
import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  CalendarCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.get<AdminStats>('/api/admin/stats', 'admin_dashboard_stats');
        setStats(data);
      } catch (err) {
        console.warn('Admin stats error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
              University Administration Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Governance Overview
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
              Centralized telemetry controlling admissions, faculty appointments, compliance audit logs, and academic circulars.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-3.5 py-2 rounded-xl bg-white text-purple-800 font-bold text-xs hover:bg-purple-50 shadow-md transition"
            >
              + Add Student
            </button>
            <button
              onClick={() => onNavigateTab('notices')}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition border border-white/20"
            >
              Broadcast Circular
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onNavigateTab('students')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition cursor-pointer shadow-xs space-y-1"
        >
          <span className="text-[11px] text-slate-500 font-semibold">Total Students</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.metrics.totalStudents || 128}
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Enrolled</span>
        </div>

        <div
          onClick={() => onNavigateTab('faculty')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition cursor-pointer shadow-xs space-y-1"
        >
          <span className="text-[11px] text-slate-500 font-semibold">Faculty Staff</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.metrics.totalFaculty || 14}
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Appointed</span>
        </div>

        <div
          onClick={() => onNavigateTab('departments')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition cursor-pointer shadow-xs space-y-1"
        >
          <span className="text-[11px] text-slate-500 font-semibold">Departments</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.metrics.totalDepartments || 6}
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Faculties</span>
        </div>

        <div
          onClick={() => onNavigateTab('departments')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition cursor-pointer shadow-xs space-y-1"
        >
          <span className="text-[11px] text-slate-500 font-semibold">Degree Programs</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.metrics.totalCourses || 8}
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">Curricula</span>
        </div>

        <div
          onClick={() => onNavigateTab('attendance')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition cursor-pointer shadow-xs space-y-1"
        >
          <span className="text-[11px] text-slate-500 font-semibold">Avg Attendance</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats?.metrics.avgAttendance || 91.5}%
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">High Compliance</span>
        </div>

        <div
          onClick={() => onNavigateTab('assignments')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition cursor-pointer shadow-xs space-y-1"
        >
          <span className="text-[11px] text-slate-500 font-semibold">Coursework Done</span>
          <div className="text-2xl font-black text-amber-500">
            {stats?.metrics.assignmentCompletionRate || 82}%
          </div>
          <span className="text-[10px] text-amber-500 font-bold">Turn-in Ratio</span>
        </div>
      </div>

      {/* Main Grid: Department Distribution and Recent Security Audit Logs */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Department Distribution */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Department Enrolled Capacity</span>
            </h3>
            <button
              onClick={() => onNavigateTab('departments')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {stats?.departmentStats.map((dept) => (
              <div
                key={dept.code}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</span>
                  <p className="text-[11px] text-slate-400">Department Code: {dept.code}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block font-mono">
                    {dept.students} Students
                  </span>
                  <span className="text-[11px] text-slate-400">{dept.faculty} Faculty</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security & Administrative Activity Trail</span>
            </h3>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Full Trail
            </button>
          </div>

          <div className="space-y-2.5">
            {stats?.recentAuditLogs.slice(0, 5).map((log) => (
              <div
                key={log._id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white truncate">{log.userName}</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
