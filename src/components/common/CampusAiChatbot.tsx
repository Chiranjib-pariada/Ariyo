import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  RotateCcw,
  Terminal,
  Cpu,
  HelpCircle,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  timestamp: string;
  suggestions?: string[];
}

export const CampusAiChatbot: React.FC = () => {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: `👋 Greetings ${user?.name || 'Scholar'}! Welcome to the **ARIYO Campus AI Assistant**, powered by Python intelligence & Gemini.

I can provide authoritative campus answers regarding:
• **Attendance Regulations:** 75% minimum mandatory requirement, condonations
• **Academic Grading:** 10-point scale calculations, semester internal assessments (30% internal, 20% assignments)
• **Coursework:** Online portal assignment submissions, deadlines, curriculum subjects
• **Campus Life:** Academic timetable, faculty directories, digital library hours, and 24/7 emergency lines

What academic or administrative inquiry can I help you resolve?`,
      provider: 'Python Campus Intelligence Engine (Python 3.10)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'What is the minimum attendance requirement?',
        'How is the 10-point CGPA calculated?',
        'Where can I submit assignments?',
        'List 24/7 campus emergency numbers',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usePythonEngine, setUsePythonEngine] = useState(false);
  const [quickPills, setQuickPills] = useState<string[]>([
    'Attendance minimum percentage?',
    'Explain CGPA scale',
    'Assignment deadline policy',
    'Campus emergency numbers',
    'Department HODs',
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post<{
        reply: string;
        suggestions: string[];
        provider: string;
        intent?: string;
      }>('/api/ai/chat', {
        message: textToSend,
        forcePython: usePythonEngine,
      });

      if (res && res.reply) {
        const botMsg: ChatMessage = {
          id: 'bot_' + Date.now(),
          sender: 'assistant',
          text: res.reply,
          provider: res.provider || (usePythonEngine ? 'Python Campus Engine' : 'Gemini 3.8 Flash'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: res.suggestions || [],
        };
        setMessages((prev) => [...prev, botMsg]);
        if (res.suggestions && res.suggestions.length > 0) {
          setQuickPills(res.suggestions);
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: `⚠️ Apologies, the AI service encountered a temporary network glitch: ${err.message || 'Server unavailable'}. Please verify backend connection or toggle Python mode.`,
        provider: 'System Error Fallback',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: `Chat session refreshed. What question do you have regarding ARIYO campus policies, attendance, or academic departments?`,
        provider: usePythonEngine ? 'Python Campus Intelligence' : 'Gemini 3.8 Flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What is the minimum attendance requirement?',
          'How is CGPA calculated?',
          'Where can I submit assignments?',
        ],
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                ARIYO Campus AI Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Smart college advisor for attendance, grading, timetables & departments</span>
            </p>
          </div>
        </div>

        {/* Engine switcher & actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setUsePythonEngine(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                !usePythonEngine
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash</span>
            </button>
            <button
              onClick={() => setUsePythonEngine(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                usePythonEngine
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Python 3.10 Engine</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/10 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white shadow-xs rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Message footer */}
                <div
                  className={`mt-2.5 pt-2 border-t flex items-center justify-between gap-2 text-[10px] ${
                    m.sender === 'user'
                      ? 'border-purple-500/40 text-purple-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{m.timestamp}</span>
                    {m.provider && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[9px]">
                        {m.provider}
                      </span>
                    )}
                  </span>

                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="hover:text-purple-600 dark:hover:text-purple-400 transition flex items-center gap-1"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 shrink-0 mt-1">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2">
                {usePythonEngine ? 'Python 3.10 AI script analyzing campus policies...' : 'Synthesizing response with Gemini 3.8 Flash...'}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      {quickPills.length > 0 && (
        <div className="px-6 py-2 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Suggestions:
          </span>
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill)}
              className="shrink-0 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition text-xs flex items-center gap-1"
            >
              <span>{pill}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about attendance policies, CGPA, courses, assignments, or college facilities...`}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-md shadow-purple-500/20 shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
