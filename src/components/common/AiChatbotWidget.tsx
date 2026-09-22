import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CampusAiChatbot } from './CampusAiChatbot';

interface AiChatbotWidgetProps {
  onOpenFullScreen?: () => void;
}

export const AiChatbotWidget: React.FC<AiChatbotWidgetProps> = ({ onOpenFullScreen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all border border-purple-400/30"
            title="Ask ARIYO AI Campus Assistant"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Ask Campus AI</span>
          </motion.button>
        )}
      </div>

      {/* Floating Drawer / Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-[480px] h-[90vh] sm:h-[620px] max-h-screen bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold text-xs">ARIYO Assistant (Python + Gemini)</span>
                </div>
                <div className="flex items-center gap-1">
                  {onOpenFullScreen && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenFullScreen();
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition text-white"
                      title="Open full page"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition text-white"
                    title="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden p-2 bg-slate-50 dark:bg-slate-950">
                <CampusAiChatbot />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
