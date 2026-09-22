import React from 'react';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  CalendarCheck,
  FileText,
  Award,
  CalendarDays,
  BellRing,
  ArrowRight,
  Sparkles,
  WifiOff,
  Moon,
  Laptop,
  CheckCircle2,
  BookOpen,
  Calendar,
  Building,
  TrendingUp,
} from 'lucide-react';

interface PublicHomeProps {
  onNavigate: (view: string) => void;
  onOpenDemoSwitcher: () => void;
  onOpenLogin: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onNavigate,
  onOpenDemoSwitcher,
  onOpenLogin,
}) => {
  const stats = [
    { label: 'Enrolled Students', value: '10,000+', icon: GraduationCap, sub: 'Across 6 Departments' },
    { label: 'Distinguished Faculty', value: '500+', icon: Users, sub: 'Ph.D & Research Fellows' },
    { label: 'Degree Programs', value: '50+', icon: BookOpen, sub: 'Undergrad & Postgraduate' },
    { label: 'Compliance & Attendance', value: '98.4%', icon: TrendingUp, sub: 'Smart RFID & Digital Tracking' },
  ];

  const features = [
    {
      title: 'Smart Attendance',
      description: 'Faculty mark batch attendance in seconds with real-time defalcation tracking, automated low-attendance warnings, and student donut charts.',
      icon: CalendarCheck,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Digital Assignments',
      description: 'Publish coursework with strict deadlines, accept PDF submissions, grade with qualitative feedback, and track submission statuses.',
      icon: FileText,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      title: 'Academic Results & CGPA',
      description: 'Server-verified mark calculations combining internals, practicals, assignments, and exams into official letter grades and cumulative grade points.',
      icon: Award,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      title: 'Smart Weekly Timetable',
      description: 'Interactive day-by-day lecture schedules mapping Turing halls, systems labs, faculty slots, and elective subjects across all days.',
      icon: CalendarDays,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Campus Digital Notices',
      description: 'Categorized institutional broadcasts for examinations, emergencies, and holidays with audience targeting and push notifications.',
      icon: BellRing,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Offline-First Campus Cache',
      description: 'Continue viewing class schedules, submitted grades, and assignment briefs even in low-connectivity areas with automatic synchronization.',
      icon: WifiOff,
      color: 'text-rose-500 bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Next-Generation Smart Campus SaaS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Smart Campus. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
                  Smarter Future.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                ARIYO is a centralized Smart College Management System designed to digitally manage and connect
                students, faculty, and administrators with real-time attendance, digital assignments, verified results,
                timetables, and offline reliability.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-explore-btn"
                  onClick={() => onNavigate('features')}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  <span>Explore Features</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-login-btn"
                  onClick={onOpenLogin}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3.5 text-sm font-semibold transition-all"
                >
                  Login to Portal
                </button>

                <button
                  id="hero-demo-role-btn"
                  onClick={onOpenDemoSwitcher}
                  className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-3.5 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Try 1-Click Role Demo</span>
                </button>
              </div>

              {/* Badges / Highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Full Offline Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Student & Faculty Portals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>RBAC & Audit Trails</span>
                </div>
              </div>
            </div>

            {/* Right Visual — Connected Smart Campus Node Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-white shadow-2xl">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-sky-400">campus.ariyo.edu/portal</span>
                </div>

                {/* Central hub illustration */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Student Portal</h4>
                        <p className="text-xs text-slate-400">Rahul Sharma • B.Tech CSE</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-800">
                      90.9% ATT
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Faculty Portal</h4>
                        <p className="text-xs text-slate-400">Dr. Ananya Sen • HOD</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-1 rounded-md border border-sky-800">
                      42 Submissions
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Admin Core</h4>
                        <p className="text-xs text-slate-400">Institutional Governance</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-1 rounded-md border border-purple-800">
                      Zero Anomalies
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Real-time Campus Mesh
                  </span>
                  <span className="text-slate-500">Node v20 • Express API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            * Sample metrics representative of deployed ARIYO institutional benchmarks. Configurable per campus deployment.
          </p>
        </div>
      </section>

      {/* Smart Campus Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Connected Smart Campus Infrastructure
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            How ARIYO unifies fragmented departmental silos into a single high-performance digital fabric.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Students</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instant mobile access to overall and subject-level attendance, assignment submission deadlines, digital grade sheets, weekly timetables, and campus notifications.
            </p>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Course Catalogs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-900 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Faculty</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Frictionless attendance entry, assignment authoring with attachments, automated submission grading, academic internal mark entry, and department lecture schedules.
            </p>
            <button
              onClick={onOpenDemoSwitcher}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View Faculty Workspace</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Administration</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Institutional enrollment control, faculty onboarding, departmental curriculum governance, system-wide attendance compliance, security audit logging, and reporting.
            </p>
            <button
              onClick={onOpenDemoSwitcher}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View Admin Governance</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Smart Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Purpose-Built Smart Features
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered with deep academic operational workflows to optimize institutional efficiency.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 transition-all hover:shadow-lg space-y-3"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to modernize your campus?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Step inside the ARIYO ecosystem. Experience live portals for Students, Faculty, and Administrators with 1-click test accounts.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenDemoSwitcher}
                className="rounded-xl bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 text-xs font-bold shadow-md transition"
              >
                Launch Demo Portals
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="rounded-xl border border-white/40 hover:bg-white/10 text-white px-6 py-3 text-xs font-semibold transition"
              >
                Campus Administration Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
