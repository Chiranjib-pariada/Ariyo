import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Users, ShieldAlert, RotateCcw, X, Sparkles, Check, Globe } from 'lucide-react';
import { api } from '../../services/api';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPublic?: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({ isOpen, onClose, onNavigateToPublic }) => {
  const { user, switchRoleDemo, logout } = useAuth();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSwitch = async (role: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    setLoadingRole(role);
    try {
      await switchRoleDemo(role);
      onClose();
    } catch (e: any) {
      alert(e.message || 'Login failed');
    } finally {
      setLoadingRole(null);
    }
  };

  const handlePublic = () => {
    logout();
    if (onNavigateToPublic) onNavigateToPublic();
    onClose();
  };

  const handleResetData = async () => {
    if (!confirm('Reset ARIYO database to factory default records?')) return;
    try {
      await api.post('/api/auth/reset-demo');
      setResetMessage('Data restored to defaults! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e: any) {
      alert('Reset failed: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Role Switcher & Demo Accounts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instantly experience ARIYO across all primary roles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {resetMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            {resetMessage}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {/* Student Role Card */}
          <div
            onClick={() => handleSwitch('STUDENT')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              user?.role === 'STUDENT'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Student Portal</span>
                  {user?.role === 'STUDENT' && (
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rahul Sharma • Sem 6 Computer Science</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">student@ariyo.edu</p>
              </div>
            </div>
            <button
              disabled={loadingRole === 'STUDENT'}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {loadingRole === 'STUDENT' ? 'Logging in...' : user?.role === 'STUDENT' ? 'Current' : 'Switch'}
            </button>
          </div>

          {/* Faculty Role Card */}
          <div
            onClick={() => handleSwitch('FACULTY')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              user?.role === 'FACULTY'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Faculty Portal</span>
                  {user?.role === 'FACULTY' && (
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dr. Ananya Sen • HOD Computer Science</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">ananya.sen@ariyo.edu</p>
              </div>
            </div>
            <button
              disabled={loadingRole === 'FACULTY'}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {loadingRole === 'FACULTY' ? 'Logging in...' : user?.role === 'FACULTY' ? 'Current' : 'Switch'}
            </button>
          </div>

          {/* Admin Role Card */}
          <div
            onClick={() => handleSwitch('ADMIN')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              user?.role === 'ADMIN'
                ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Admin Portal</span>
                  {user?.role === 'ADMIN' && (
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dr. Arthur Sterling • Campus Dean</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">admin@ariyo.edu</p>
              </div>
            </div>
            <button
              disabled={loadingRole === 'ADMIN'}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              {loadingRole === 'ADMIN' ? 'Logging in...' : user?.role === 'ADMIN' ? 'Current' : 'Switch'}
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePublic}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Explore Public Website</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline"
            title="Reset seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
