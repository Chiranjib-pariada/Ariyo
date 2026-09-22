import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { EventItem } from '../../types';
import { Calendar, MapPin, Clock, Users, ArrowUpRight, Check } from 'lucide-react';

export const PublicEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await api.get<EventItem[]>('/api/events', 'events_catalog');
        setEvents(data || []);
      } catch (err) {
        console.warn('Events fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleRegister = async (id: string) => {
    if (registeredIds.includes(id)) return;
    try {
      await api.post(`/api/events/${id}/register`);
      setRegisteredIds((prev) => [...prev, id]);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, attendeesCount: e.attendeesCount + 1 } : e))
      );
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900">
          <Calendar className="w-3.5 h-3.5" />
          <span>Campus Life & Academics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Upcoming Campus Events & Symposia
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          From nationwide collegiate hackathons and technical symposiums to cultural galas and annual convocations.
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Calendar className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No events currently scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">Check back soon for new semester activities!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = registeredIds.includes(event._id);
            return (
              <div
                key={event._id}
                className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                      {new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{event.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate">{event.venue}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.attendeesCount} Registered</span>
                    </span>

                    <button
                      onClick={() => handleRegister(event._id)}
                      disabled={isRegistered}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                        isRegistered
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </>
                      ) : (
                        <>
                          <span>RSVP Free</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
