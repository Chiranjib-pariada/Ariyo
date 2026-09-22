import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestored, setShowRestored] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showRestored) {
    return (
      <div
        id="network-restored-indicator"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-xs font-medium shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-bottom duration-300"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
        <span>Connected to Campus Network — Cache Synchronized</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator-banner"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 text-white px-4 py-2.5 text-xs font-medium shadow-2xl border border-amber-500 backdrop-blur-md animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
      <div>
        <p className="font-bold">Offline Mode Active</p>
        <p className="text-[11px] text-amber-100">Showing fast cached college records & timetable</p>
      </div>
    </div>
  );
};
