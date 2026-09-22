import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { TimetableSlot } from '../../types';
import { CalendarDays, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    async function loadTimetable() {
      try {
        setLoading(true);
        const data = await api.get<TimetableSlot[]>('/api/timetable', 'student_full_tt');
        setTimetable(data || []);
      } catch (err) {
        console.warn('Timetable load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTimetable();
  }, []);

  const daySlots = timetable
    .filter((s) => s.day.toLowerCase() === selectedDay.toLowerCase())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <span>Interactive Weekly Timetable</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Class lecture schedules, room numbers, and faculty allocations.
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedDay === day
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots for the selected day */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : daySlots.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CalendarDays className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No lectures scheduled for {selectedDay}</h3>
            <p className="text-xs text-slate-500 mt-1">This slot is reserved for student self-study or laboratory prep.</p>
          </div>
        ) : (
          daySlots.map((slot) => (
            <div
              key={slot._id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shrink-0 font-mono text-center min-w-[110px]">
                  <div className="flex items-center justify-center gap-1 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot.startTime}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">to {slot.endTime}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                      {slot.subjectCode}
                    </span>
                    <span className="text-xs text-slate-400">Semester {slot.semester}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {slot.subjectName}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{slot.facultyName}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Room {slot.room}</span>
                </span>
                <span className="text-[11px] text-slate-400 mt-1">Main Academic Block</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
