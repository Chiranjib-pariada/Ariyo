import React from 'react';
import { GraduationCap, Award, ShieldCheck, Compass, HeartHandshake, BookOpen } from 'lucide-react';

export const PublicAbout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Institutional Legacy & Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About ARIYO Smart College
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Founded as a benchmark technological institute, ARIYO leads modern collegiate learning through pedagogical excellence and cutting-edge software architecture.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            To build a world-class academic environment where technology fuels discovery, transparent governance empowers faculty, and every student thrives with seamless, modern digital tools.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminating administrative overhead through smart automation, fostering collaborative research, and delivering verifiable educational milestones with high institutional integrity.
          </p>
        </div>
      </div>

      {/* Accreditations & Core Values */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Accreditations & Compliance</h3>
        <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white mb-1">NAAC A++ Certified</strong>
              Highest grade of national academic accreditation with a 3.82 CGPA benchmark.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white mb-1">Tier-1 NBA Recognized</strong>
              All undergraduate engineering programs adhere to the Washington Accord.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white mb-1">ISO 9001:2015 Standards</strong>
              Systemic digitized quality management and academic operational transparency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
