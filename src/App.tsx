import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { DemoSwitcherModal } from './components/common/DemoSwitcherModal';

// Public Views
import { PublicHome } from './components/public/PublicHome';
import { PublicCourses } from './components/public/PublicCourses';
import { PublicNotices } from './components/public/PublicNotices';
import { PublicEvents } from './components/public/PublicEvents';
import { PublicFeatures } from './components/public/PublicFeatures';
import { PublicAbout } from './components/public/PublicAbout';
import { PublicContact } from './components/public/PublicContact';
import { PublicLoginModal } from './components/public/PublicLoginModal';

// Student Portal Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentResults } from './components/student/StudentResults';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentProfile } from './components/student/StudentProfile';

// Faculty Portal Views
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultyAttendance } from './components/faculty/FacultyAttendance';
import { FacultyAssignments } from './components/faculty/FacultyAssignments';
import { FacultyStudents } from './components/faculty/FacultyStudents';
import { FacultyResults } from './components/faculty/FacultyResults';

// Admin Portal Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminFaculty } from './components/admin/AdminFaculty';
import { AdminDepartments } from './components/admin/AdminDepartments';
import { AdminNotices } from './components/admin/AdminNotices';
import { AdminEvents } from './components/admin/AdminEvents';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';

// AI Campus Assistant
import { CampusAiChatbot } from './components/common/CampusAiChatbot';
import { AiChatbotWidget } from './components/common/AiChatbotWidget';

import { Sparkles, KeyRound } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user logs in and was on a public tab, navigate to dashboard
  React.useEffect(() => {
    if (user && (activeTab === 'home' || activeTab === 'courses' || activeTab === 'features' || activeTab === 'about' || activeTab === 'contact')) {
      setActiveTab('dashboard');
    }
  }, [user]);

  const renderContent = () => {
    // PUBLIC MODE
    if (!user) {
      switch (activeTab) {
        case 'courses':
          return <PublicCourses />;
        case 'notices':
          return <PublicNotices />;
        case 'events':
          return <PublicEvents />;
        case 'features':
          return <PublicFeatures />;
        case 'about':
          return <PublicAbout />;
        case 'contact':
          return <PublicContact />;
        case 'ai-chat':
          return <CampusAiChatbot />;
        case 'home':
        default:
          return (
            <PublicHome
              onOpenLogin={() => setLoginModalOpen(true)}
              onOpenDemoSwitcher={() => setDemoModalOpen(true)}
              onNavigate={(tab: string) => setActiveTab(tab)}
            />
          );
      }
    }

    // LOGGED-IN PORTAL MODE (Role-based)
    if (user.role === 'STUDENT') {
      switch (activeTab) {
        case 'attendance':
          return <StudentAttendance />;
        case 'assignments':
          return <StudentAssignments />;
        case 'results':
          return <StudentResults />;
        case 'timetable':
          return <StudentTimetable />;
        case 'profile':
          return <StudentProfile />;
        case 'notices':
          return <PublicNotices />;
        case 'events':
          return <PublicEvents />;
        case 'courses':
          return <PublicCourses />;
        case 'ai-chat':
          return <CampusAiChatbot />;
        case 'dashboard':
        default:
          return <StudentDashboard onNavigateTab={(tab) => setActiveTab(tab)} />;
      }
    }

    if (user.role === 'FACULTY') {
      switch (activeTab) {
        case 'attendance':
          return <FacultyAttendance />;
        case 'assignments':
          return <FacultyAssignments />;
        case 'students':
          return <FacultyStudents />;
        case 'results':
          return <FacultyResults />;
        case 'timetable':
          return <StudentTimetable />;
        case 'notices':
          return <PublicNotices />;
        case 'events':
          return <PublicEvents />;
        case 'courses':
          return <PublicCourses />;
        case 'ai-chat':
          return <CampusAiChatbot />;
        case 'dashboard':
        default:
          return <FacultyDashboard onNavigateTab={(tab) => setActiveTab(tab)} />;
      }
    }

    if (user.role === 'ADMIN') {
      switch (activeTab) {
        case 'students':
          return <AdminStudents />;
        case 'faculty':
          return <AdminFaculty />;
        case 'departments':
          return <AdminDepartments />;
        case 'attendance':
          return <FacultyAttendance />;
        case 'assignments':
          return <FacultyAssignments />;
        case 'results':
          return <FacultyResults />;
        case 'timetable':
          return <StudentTimetable />;
        case 'notices':
          return <AdminNotices />;
        case 'events':
          return <AdminEvents />;
        case 'reports':
          return <AdminReports />;
        case 'audit-logs':
          return <AdminAuditLogs />;
        case 'ai-chat':
          return <CampusAiChatbot />;
        case 'dashboard':
        default:
          return <AdminDashboard onNavigateTab={(tab) => setActiveTab(tab)} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab: string) => setActiveTab(tab)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenDemoModal={() => setDemoModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar for Authenticated Users */}
        {user && (
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="sticky top-24">
              <Sidebar activeTab={activeTab} onSelectTab={(tab: string) => setActiveTab(tab)} />
            </div>
          </aside>
        )}

        {/* Mobile Sidebar overlay for logged in user */}
        {user && mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab: string) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Dynamic View */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${user ? user.role : 'guest'}-${activeTab}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Demo Role Switcher Quick Pill */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setDemoModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all border border-slate-700 dark:border-slate-200"
          title="Switch Demo Role"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-500 animate-spin" />
          <span>Demo Roles</span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <PublicLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onOpenDemoSwitcher={() => {
          setLoginModalOpen(false);
          setDemoModalOpen(true);
        }}
      />

      <DemoSwitcherModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Floating Campus AI Assistant Widget */}
      <AiChatbotWidget onOpenFullScreen={() => setActiveTab('ai-chat')} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
