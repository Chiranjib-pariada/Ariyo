import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Result, StudentProfile, Subject } from '../../types';
import { Award, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const FacultyResults: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const [internal, setInternal] = useState<number>(23);
  const [assignment, setAssignment] = useState<number>(14);
  const [practical, setPractical] = useState<number>(19);
  const [exam, setExam] = useState<number>(36);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recentResults, setRecentResults] = useState<Result[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [subList, stuList, resList] = await Promise.all([
          api.get<Subject[]>('/api/subjects'),
          api.get<StudentProfile[]>('/api/students'),
          api.get<Result[]>('/api/results/all'),
        ]);

        setSubjects(subList || []);
        if (subList && subList.length > 0) setSelectedSubject(subList[0]._id);

        setStudents(stuList || []);
        if (stuList && stuList.length > 0) setSelectedStudent(stuList[0]._id);

        setRecentResults(resList || []);
      } catch (err) {
        console.warn(err);
      }
    }
    loadData();
  }, []);

  const totalMarks = Math.min(100, Math.max(0, internal + assignment + practical + exam));

  const calculateGrade = (total: number) => {
    if (total >= 90) return { grade: 'O', point: 10 };
    if (total >= 80) return { grade: 'A+', point: 9 };
    if (total >= 70) return { grade: 'A', point: 8 };
    if (total >= 60) return { grade: 'B+', point: 7 };
    if (total >= 50) return { grade: 'B', point: 6 };
    if (total >= 40) return { grade: 'C', point: 5 };
    return { grade: 'F', point: 0 };
  };

  const currentGrade = calculateGrade(totalMarks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !selectedStudent) return;

    try {
      setSubmitting(true);
      await api.post('/api/results/submit', {
        studentId: selectedStudent,
        subjectId: selectedSubject,
        internalMarks: internal,
        assignmentMarks: assignment,
        practicalMarks: practical,
        examMarks: exam,
      });

      setSuccessMsg('Academic evaluation registered and synced successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);

      const refreshed = await api.get<Result[]>('/api/results/all');
      setRecentResults(refreshed || []);
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          <span>Faculty Grade Entry & Continuous Evaluation</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Compute Internal, Practical, Assignment, and End-Semester exam weights with instant grade verification.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grade Entry Card */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Record Subject Grade</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course / Subject
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Candidate Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            >
              {students.map((stu) => (
                <option key={stu._id} value={stu._id}>
                  {stu.name} ({stu.studentId})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Marks Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Internal (Max 25)
            </label>
            <input
              required
              type="number"
              min={0}
              max={25}
              value={internal}
              onChange={(e) => setInternal(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment (Max 15)
            </label>
            <input
              required
              type="number"
              min={0}
              max={15}
              value={assignment}
              onChange={(e) => setAssignment(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Practical Lab (Max 20)
            </label>
            <input
              required
              type="number"
              min={0}
              max={20}
              value={practical}
              onChange={(e) => setPractical(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              End-Sem Exam (Max 40)
            </label>
            <input
              required
              type="number"
              min={0}
              max={40}
              value={exam}
              onChange={(e) => setExam(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>
        </div>

        {/* Calculated Grade Preview Pill */}
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Total Aggregated Score</span>
              <strong className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {totalMarks} / 100
              </strong>
            </div>

            <div className="border-l border-purple-200 dark:border-purple-800 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase">Computed Grade</span>
              <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {currentGrade.grade} ({currentGrade.point}.0 GP)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? 'Registering Marks...' : 'Submit & Seal Grade'}</span>
          </button>
        </div>
      </form>

      {/* Recent Evaluations Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Evaluated Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Student</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {recentResults.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white">{r.studentName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{r.subjectName} ({r.subjectCode})</td>
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{r.totalMarks} / 100</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{r.gradePoint}.0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
