import React from 'react';
import {
  CalendarCheck,
  FileText,
  Award,
  CalendarDays,
  BellRing,
  WifiOff,
  Moon,
  ShieldCheck,
  Users,
  BookOpen,
  Sparkles,
  Smartphone,
  Cpu,
} from 'lucide-react';

export const PublicFeatures: React.FC = () => {
  const deepFeatures = [
    {
      category: 'Smart Academic Operations',
      items: [
        {
          title: 'Automated Attendance Intelligence',
          desc: 'Fast digital roll-call with Present, Absent, Late, and Excused classifications. Automated 75% regulatory warning triggers alert students before defaulter lists are issued.',
          icon: CalendarCheck,
          accent: 'text-blue-500',
        },
        {
          title: 'Coursework & Assignment Manager',
          desc: 'Instructors set deadlines, describe rubric criteria, attach reference links, and inspect student PDF submissions with instant grade assignment and personalized qualitative feedback.',
          icon: FileText,
          accent: 'text-indigo-500',
        },
        {
          title: 'Continuous Evaluation & Result Matrices',
          desc: 'Unified grade sheets computing Internal marks (25), Assignments (15), Practicals (20), and Term Exams (40) into official letter grades (O, A+, A, B+) and Semester Grade Point Averages.',
          icon: Award,
          accent: 'text-purple-500',
        },
        {
          title: 'Dynamic Weekly Class Schedules',
          desc: 'Cross-departmental schedule visualization mapping lecture halls, computing labs, faculty leads, and course codes across Monday through Saturday.',
          icon: CalendarDays,
          accent: 'text-emerald-500',
        },
      ],
    },
    {
      category: 'Resilience & User Experience',
      items: [
        {
          title: 'Offline-First Low-Connectivity Resilience',
          desc: 'Engineered specifically for challenging university connectivity environments. Timetables, recent notices, grade records, and assignments stay fully available offline with automatic background sync.',
          icon: WifiOff,
          accent: 'text-rose-500',
        },
        {
          title: 'Dark / Light High-Contrast Themes',
          desc: 'Carefully tuned palettes prioritizing ocular comfort during late-night study sessions or harsh daylight conditions, with persistent theme storage.',
          icon: Moon,
          accent: 'text-amber-500',
        },
        {
          title: 'Installable PWA for Mobile & Desktop',
          desc: 'Add ARIYO directly to iOS Home Screen, Android devices, or desktop docks without requiring separate app store downloads.',
          icon: Smartphone,
          accent: 'text-sky-500',
        },
        {
          title: 'Security & Role-Based Access Control',
          desc: 'Military-grade cryptographic hashing, signed JWT auth tokens, fine-grained RBAC separating Student, Faculty, and Admin permissions, with comprehensive immutable audit trails.',
          icon: ShieldCheck,
          accent: 'text-teal-500',
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Architectural Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Built for Academic Excellence & Operational Velocity
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Every capability in ARIYO is constructed to reduce administrative friction and enhance student outcomes.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {deepFeatures.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
              {section.category}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition shadow-xs flex items-start gap-4"
                  >
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0">
                      <Icon className={`w-6 h-6 ${item.accent}`} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
