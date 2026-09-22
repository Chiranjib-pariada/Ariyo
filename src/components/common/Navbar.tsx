import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  LogOut,
  UserCheck,
  Shield,
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  Layers,
  ChevronDown,
  Bot,
} from 'lucide-react';

interface NavbarProps {
  currentView?: string;
  activeTab?: string;
  onNavigate?: (view: string) => void;
  onSelectTab?: (view: string) => void;
  onOpenDemoSwitcher?: () => void;
  onOpenDemoModal?: () => void;
  onOpenNotifications?: () => void;
  onOpenLogin?: () => void;
  unreadCount?: number;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeTab,
  onNavigate,
  onSelectTab,
  onOpenDemoSwitcher,
  onOpenDemoModal,
  onOpenNotifications,
  onOpenLogin,
  unreadCount = 0,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const active = currentView || activeTab || 'home';
  const handleNav = (target: string) => {
    if (target === 'login' && onOpenLogin) {
      onOpenLogin();
      return;
    }
    if (onNavigate) onNavigate(target);
    if (onSelectTab) onSelectTab(target);
  };
  const handleDemoOpen = () => {
    if (onOpenDemoSwitcher) onOpenDemoSwitcher();
    if (onOpenDemoModal) onOpenDemoModal();
  };
  const handleNotifOpen = () => {
    if (onOpenNotifications) onOpenNotifications();
  };

  const isMenuOpen = mobileMenuOpen !== undefined ? mobileMenuOpen : internalMobileMenuOpen;
  const toggleMenu = () => {
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    } else {
      setInternalMobileMenuOpen(!internalMobileMenuOpen);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Smart Features' },
    { id: 'courses', label: 'Courses' },
    { id: 'notices', label: 'Notices' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const getRoleBadge = () => {
    if (role === 'ADMIN') {
      return (
        <span className="flex items-center gap-1 text-[11px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
          <Shield className="w-3 h-3" />
          <span>Admin Portal</span>
        </span>
      );
    }
    if (role === 'FACULTY') {
      return (
        <span className="flex items-center gap-1 text-[11px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          <UserCheck className="w-3 h-3" />
          <span>Faculty Portal</span>
        </span>
      );
    }
    if (role === 'STUDENT') {
      return (
        <span className="flex items-center gap-1 text-[11px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
          <GraduationCap className="w-3 h-3" />
          <span>Student Portal</span>
        </span>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav(user ? 'dashboard' : 'home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-slate-900 dark:text-white">
                ARIYO
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                v2.6
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Smart Campus. Smarter Future.
            </p>
          </div>
        </div>

        {/* Public Desktop Navigation Links */}
        {!user && (
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  active === link.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role badge if logged in */}
          {user && <div className="hidden sm:block">{getRoleBadge()}</div>}

          {/* Quick Demo Switcher Button */}
          <button
            id="demo-switcher-btn"
            onClick={handleDemoOpen}
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-2.5 py-1.5 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shadow-xs"
            title="Switch between Student, Faculty, and Admin roles"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden xs:inline">Demo Switcher</span>
          </button>

          {/* Quick Ask AI button */}
          <button
            id="ask-ai-navbar-btn"
            onClick={() => handleNav('ai-chat')}
            className="flex items-center gap-1.5 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 px-2.5 py-1.5 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all shadow-xs"
            title="Ask ARIYO Campus AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Button (when logged in) */}
          {user && (
            <button
              id="notifications-bell-btn"
              onClick={handleNotifOpen}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </button>
          )}

          {/* User profile / login button */}
          {user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="hidden md:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1.5">{getRoleBadge()}</div>
                  </div>

                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                    <span>My Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => handleNav('home')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-500" />
                    <span>Campus Public Web</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="login-modal-btn"
              onClick={() => handleNav('login')}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition shadow-xs hover:shadow-blue-500/25 flex items-center gap-1.5"
            >
              <span>Portal Login</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3 animate-in slide-in-from-top duration-200">
          {!user && (
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    handleNav(link.id);
                    if (!onToggleMobileMenu) setInternalMobileMenuOpen(false);
                  }}
                  className={`text-left p-2.5 rounded-xl text-xs font-semibold ${
                    active === link.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {user && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  handleNav('dashboard');
                  if (!onToggleMobileMenu) setInternalMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to {role} Dashboard</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  if (!onToggleMobileMenu) setInternalMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
