import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StudentProfile, Subject } from '../../types';
import { CalendarCheck, CheckCircle2, Clock, XCircle, Save, Check, Filter, Search } from 'lucide-react';

export const FacultyAttendance: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [subList, stuList] = await Promise.all([
          api.get<Subject[]>('/api/subjects'),
          api.get<StudentProfile[]>('/api/students'),
        ]);

        setSubjects(subList || []);
        if (subList && subList.length > 0) {
          setSelectedSubject(subList[0]._id);
        }

        setStudents(stuList || []);
        // Initialize default all present
        const initRec: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = {};
        (stuList || []).forEach((s) => {
          initRec[s._id] = 'Present';
        });
        setRecords(initRec);
      } catch (err) {
        console.warn('Attendance form load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMarkAll = (status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    const updated = { ...records };
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setRecords(updated);
  };

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    try {
      setSubmitting(true);
      const studentRecords = Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await api.post('/api/attendance/mark', {
        subjectId: selectedSubject,
        date,
        records: studentRecords,
      });

      setSuccessMsg(`Attendance for ${studentRecords.length} students recorded successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(records).filter((s) => s === 'Present').length;
  const absentCount = Object.values(records).filter((s) => s === 'Absent').length;
  const lateCount = Object.values(records).filter((s) => s === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-indigo-600" />
          <span>Mark Class Roll Call Attendance</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Record batch attendance with instant sync to university academic compliance registers.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Configuration Header */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Teaching Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lecture Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Quick Mark Action
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition border border-emerald-200 dark:border-emerald-800"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition border border-rose-200 dark:border-rose-800"
                >
                  All Absent
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Roll Call Summary
              </label>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono font-bold">
                <span className="text-emerald-600">{presentCount} P</span>
                <span className="text-rose-500">{absentCount} A</span>
                <span className="text-amber-500">{lateCount} L</span>
                <span className="text-slate-400">({students.length} Total)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roll Call List */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Enrolled Students Roster ({students.length})
            </h3>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting to Registry...' : 'Save & Submit Attendance'}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => {
              const currentStatus = records[student._id] || 'Present';
              return (
                <div
                  key={student._id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.profileImage || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`}
                      alt={student.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">
                        {student.studentId} • Sem {student.semester}
                      </p>
                    </div>
                  </div>

                  {/* Status Selection Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {(['Present', 'Absent', 'Late', 'Excused'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(student._id, st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          currentStatus === st
                            ? st === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : st === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : st === 'Late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
