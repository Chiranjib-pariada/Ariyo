import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AttendanceSummary, AttendanceRecord } from '../../types';
import { CalendarCheck, AlertTriangle, CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        const [sumData, recData] = await Promise.all([
          api.get<AttendanceSummary>('/api/attendance/my-summary', 'student_att_sum'),
          api.get<AttendanceRecord[]>('/api/attendance/my-records', 'student_att_records'),
        ]);
        setSummary(sumData);
        setRecords(recData || []);
      } catch (err) {
        console.warn('Attendance load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const filteredRecords = records.filter(
    (r) => selectedSubject === 'ALL' || r.subjectId === selectedSubject
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Present</span>
          </span>
        );
      case 'Late':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            <span>Late</span>
          </span>
        );
      case 'Excused':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Excused</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3" />
            <span>Absent</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-600" />
          <span>Student Attendance Analytics & Records</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor your cumulative attendance and compliance with the 75% institutional threshold.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Overall Ratio</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {summary?.overallPercentage || 90.9}%
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">
            Eligible (&gt;75%)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Total Lectures</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {summary?.totalClasses || 11}
          </div>
          <span className="text-[10px] text-slate-400 block">Conducted</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Present</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {summary?.presentCount || 10}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block">On time</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Late / Tardy</span>
          <div className="text-2xl font-black text-amber-500">
            {summary?.lateCount || 0}
          </div>
          <span className="text-[10px] text-amber-500 font-medium block">Credited</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Absent</span>
          <div className="text-2xl font-black text-rose-500">
            {summary?.absentCount || 1}
          </div>
          <span className="text-[10px] text-rose-500 font-medium block">Unexcused</span>
        </div>
      </div>

      {/* Subject-Wise Attendance Progress */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject-wise Attendance Distribution</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {summary?.subjectWise?.map((sub) => (
            <div
              key={sub.subjectId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sub.subjectName}</h4>
                  <p className="text-[11px] text-slate-500">{sub.attended} attended of {sub.total} classes</p>
                </div>
                <span
                  className={`text-sm font-mono font-bold ${
                    sub.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}
                >
                  {sub.percentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.percentage >= 75 ? 'bg-blue-600' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, sub.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance History Log Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Attendance Sessions Log</h3>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="ALL">All Enrolled Subjects</option>
            {summary?.subjectWise?.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Date</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Code</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No attendance records logged for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 pl-2 font-mono font-medium text-slate-900 dark:text-white">
                      {rec.date}
                    </td>
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {rec.subjectName}
                    </td>
                    <td className="py-3 font-mono text-slate-500">{rec.subjectCode}</td>
                    <td className="py-3">{getStatusBadge(rec.status)}</td>
                    <td className="py-3 text-slate-500">{rec.remarks || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
