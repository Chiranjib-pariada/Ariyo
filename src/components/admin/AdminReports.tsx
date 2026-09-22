import React from 'react';
import { FileSpreadsheet, Download, CheckCircle, BarChart3, Users, CalendarCheck, Award } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const reports = [
    {
      id: 'rep_1',
      title: 'Institutional Attendance Compliance Audit (Semesters 1-8)',
      category: 'Attendance & Compliance',
      generatedDate: '2026-09-20',
      fileSize: '2.4 MB',
      format: 'PDF & CSV',
      icon: CalendarCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      id: 'rep_2',
      title: 'Semester End Examination Transcript & Mark Matrix',
      category: 'Examination & Grading',
      generatedDate: '2026-09-18',
      fileSize: '5.1 MB',
      format: 'XLSX Spreadsheet',
      icon: Award,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60',
    },
    {
      id: 'rep_3',
      title: 'Admissions & Department Seat Capacity Dossier',
      category: 'Admissions',
      generatedDate: '2026-09-15',
      fileSize: '1.8 MB',
      format: 'CSV Export',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      id: 'rep_4',
      title: 'Faculty Workload, Course Credit Allocations & Timetables',
      category: 'Faculty Management',
      generatedDate: '2026-09-12',
      fileSize: '3.2 MB',
      format: 'PDF',
      icon: BarChart3,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
    },
  ];

  const handleDownload = (title: string) => {
    alert(`Downloading export for: "${title}". Generated with digital signature.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
          <span>Institutional Intelligence & Regulatory Reports</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Generate accredited reports for educational regulatory boards, internal quality audits, and semester summaries.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${rep.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">{rep.format}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {rep.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {rep.title}
                  </h3>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Date: {rep.generatedDate} • {rep.fileSize}</span>
                <button
                  onClick={() => handleDownload(rep.title)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
