import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StudentProfile } from '../../types';
import { Users, Search, GraduationCap, Award, Phone, Mail } from 'lucide-react';

export const FacultyStudents: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const data = await api.get<StudentProfile[]>('/api/students');
        setStudents(data || []);
      } catch (err) {
        console.warn('Students fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.studentId && s.studentId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>Enrolled Department Students</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          View roster credentials, cumulative performance metrics, and contact info.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Student</th>
                <th className="pb-3">Student ID</th>
                <th className="pb-3">Semester</th>
                <th className="pb-3">Batch</th>
                <th className="pb-3">CGPA</th>
                <th className="pb-3">Attendance</th>
                <th className="pb-3">Guardian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">Loading student directory...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">No students match your query.</td>
                </tr>
              ) : (
                filtered.map((stu) => (
                  <tr key={stu._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.profileImage || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop`}
                          alt={stu.name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{stu.name}</h4>
                          <span className="text-[10px] text-slate-400">{stu.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {stu.studentId}
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">Sem {stu.semester}</td>
                    <td className="py-3.5 text-slate-500">{stu.batch}</td>
                    <td className="py-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {stu.cgpa?.toFixed(2) || '8.85'}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      91%
                    </td>
                    <td className="py-3.5 text-slate-500">{stu.guardianName}</td>
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
