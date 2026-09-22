import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Award,
  CalendarDays,
  BookOpen,
  BellRing,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  BookMarked,
  ScrollText,
  ShieldCheck,
  User,
  LogOut,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onSelectTab }) => {
  const { role, user, logout } = useAuth();

  const handleTab = (id: string) => {
    if (onTabChange) onTabChange(id);
    if (onSelectTab) onSelectTab(id);
  };

  const getStudentItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'results', label: 'Results & CGPA', icon: Award },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'ai-chat', label: 'AI Campus Assistant', icon: Sparkles },
    { id: 'notices', label: 'Campus Notices', icon: BellRing },
    { id: 'events', label: 'Campus Events', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const getFacultyItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Mark Attendance', icon: CalendarCheck },
    { id: 'assignments', label: 'Assignments & Grading', icon: FileText },
    { id: 'students', label: 'Enrolled Students', icon: Users },
    { id: 'results', label: 'Submit Grades', icon: Award },
    { id: 'timetable', label: 'Teaching Schedule', icon: CalendarDays },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'ai-chat', label: 'AI Campus Assistant', icon: Sparkles },
    { id: 'notices', label: 'Notices', icon: BellRing },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'profile', label: 'Faculty Profile', icon: User },
  ];

  const getAdminItems = () => [
    { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'departments', label: 'Departments & Courses', icon: Building2 },
    { id: 'attendance', label: 'Attendance Monitor', icon: CalendarCheck },
    { id: 'assignments', label: 'Academic Assignments', icon: FileText },
    { id: 'results', label: 'Exam Results', icon: Award },
    { id: 'timetable', label: 'Master Timetable', icon: CalendarDays },
    { id: 'ai-chat', label: 'AI Campus Assistant', icon: Sparkles },
    { id: 'notices', label: 'Broadcast Notices', icon: BellRing },
    { id: 'events', label: 'Campus Events', icon: Calendar },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: ShieldCheck },
  ];

  const items =
    role === 'ADMIN'
      ? getAdminItems()
      : role === 'FACULTY'
      ? getFacultyItems()
      : getStudentItems();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 min-h-[calc(100vh-4rem)]">
        {/* User Card Mini */}
        <div className="p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
          <img
            src={user?.profileImage}
            alt={user?.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name}
            </h4>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider block">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => handleTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Horizontal Sub-Navigation Tab Bar */}
      <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-2 overflow-x-auto flex gap-1.5 scrollbar-none sticky top-16 z-30">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
