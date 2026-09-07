import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Tag,
  BookOpen,
  Tent,
  Flame,
  CheckCircle2,
  CalendarCheck,
  History,
  CalendarDays
} from 'lucide-react';
import { getEventAudienceInfo } from '../utils/kashafVoice';

export default function LiveClockAndCalendar({ currentUser, onNavigate }) {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Feed Tab State: 'day' | 'upcoming' | 'past'
  const [feedTab, setFeedTab] = useState('day');

  // Events & Assignments Data
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);

  // 1. Live Clock Ticking Effect (Updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Events & Groups from Firestore
  useEffect(() => {
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(list);
    }, (err) => console.warn('Events listener fallback in calendar:', err));

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn('Groups listener fallback in calendar:', err));

    return () => {
      unsubEvents();
      unsubGroups();
    };
  }, []);

  // 3. Fetch Assignments for Due Dates
  useEffect(() => {
    const unsubAssignments = onSnapshot(collection(db, 'assignments'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignments(list);
    }, (err) => console.warn('Assignments listener fallback in calendar:', err));
    return () => unsubAssignments();
  }, []);

  // Formatting Clock and Dates
  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate Hijri Date (Intl)
  const hijriDateString = (() => {
    try {
      return new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(currentTime) + ' AH';
    } catch (e) {
      return '';
    }
  })();

  // Calendar Helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    setSelectedDate(now.toISOString().split('T')[0]);
    setFeedTab('day');
  };

  // Build Calendar Days Matrix
  const calendarDays = [];

  // Previous month padding days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateString: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateString: dayStr
    });
  }

  // Next month padding days to complete 35 or 42 grid cells
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= remainingCells && calendarDays.length < 42; d++) {
    const dayStr = `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateString: dayStr
    });
  }

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Events & Tasks on Selected Date
  const selectedDateEvents = events.filter(ev => ev.date === selectedDate);
  const selectedDateTasks = assignments.filter(a => a.dueDate === selectedDate);

  // Upcoming vs Past Events
  const upcomingEvents = useMemo(() => {
    return events
      .filter(ev => (ev.date || '') >= todayStr)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .slice(0, 10);
  }, [events, todayStr]);

  const pastEvents = useMemo(() => {
    return events
      .filter(ev => (ev.date || '') < todayStr)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 10);
  }, [events, todayStr]);

  return (
    <div className="bg-slate-850 border border-slate-755 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* ── TOP LIVE CLOCK & DATE HERO BANNER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black shadow-md shrink-0">
            <Clock size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                {timeString}
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Live Time
              </span>
            </div>
            <p className="text-xs font-bold text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>📅 {dateString}</span>
              {hijriDateString && (
                <>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-amber-300 font-serif">🌙 {hijriDateString}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={jumpToToday}
          className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white border border-slate-700 hover:border-emerald-500/50 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <CalendarCheck size={14} />
          <span>Today</span>
        </button>
      </div>

      {/* ── MONTHLY INTERACTIVE CALENDAR & DAY SCHEDULE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 Cols): Month View Grid */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-750 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-emerald-400" />
              <h4 className="text-sm font-black text-white tracking-wide">{monthName}</h4>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase py-1">
            <span className="text-rose-400">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span className="text-emerald-400">Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {calendarDays.map((cell, idx) => {
              const isToday = cell.dateString === todayStr;
              const isSelected = cell.dateString === selectedDate;
              const dayEvents = events.filter(ev => ev.date === cell.dateString);
              const dayTasks = assignments.filter(a => a.dueDate === cell.dateString);
              const hasActivity = dayEvents.length > 0 || dayTasks.length > 0;

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedDate(cell.dateString);
                    setFeedTab('day');
                  }}
                  className={`min-h-[64px] sm:min-h-[76px] p-1 sm:p-1.5 rounded-xl transition cursor-pointer relative flex flex-col justify-start items-start border text-left gap-1 overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md ring-1 ring-emerald-500/50'
                      : isToday
                      ? 'bg-amber-950/30 border-amber-500/60 text-amber-300'
                      : cell.isCurrentMonth
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-950/40 border-slate-850/60 text-slate-600 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] sm:text-[11px] font-bold font-mono px-1 rounded ${
                      isToday ? 'bg-amber-500 text-slate-950 font-black' : ''
                    }`}>
                      {cell.dayNumber}
                    </span>
                    {hasActivity && (
                      <span className="text-[8px] font-mono text-slate-400 font-bold sm:hidden">
                        {dayEvents.length + dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Render Event Chips Directly Under Day Number */}
                  {hasActivity && (
                    <div className="w-full space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 2).map(e => {
                        const isFriday = e.recurringPattern === 'weekly_friday' || new Date(e.date + 'T12:00:00').getDay() === 5;
                        const isTuesday = e.recurringPattern === 'weekly_tuesday' || new Date(e.date + 'T12:00:00').getDay() === 2;
                        
                        let chipBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                        let dotBg = 'bg-amber-400';
                        if (isFriday) {
                          chipBg = 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
                          dotBg = 'bg-emerald-400';
                        } else if (isTuesday) {
                          chipBg = 'bg-sky-500/25 text-sky-300 border-sky-500/40';
                          dotBg = 'bg-sky-400';
                        }

                        let shortTitle = e.title || 'Event';
                        if (/friday weekly meeting/i.test(shortTitle)) shortTitle = 'Fri Meeting';
                        else if (/tuesday youth program/i.test(shortTitle)) shortTitle = 'Tue Youth';
                        else if (/weekly meeting/i.test(shortTitle)) shortTitle = 'Meeting';
                        else if (/youth program/i.test(shortTitle)) shortTitle = 'Youth Prog';

                        return (
                          <div
                            key={e.id}
                            className={`w-full text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded border truncate leading-tight shadow-sm flex items-center gap-1 ${chipBg}`}
                            title={`${e.title} (${e.time || ''})`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${dotBg}`} />
                            <span className="truncate">{shortTitle}</span>
                          </div>
                        );
                      })}

                      {dayTasks.slice(0, Math.max(0, 2 - dayEvents.length)).map(t => (
                        <div
                          key={t.id}
                          className="w-full text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 truncate leading-tight shadow-sm flex items-center gap-1"
                          title={`Task Due: ${t.title}`}
                        >
                          <span>🎒</span>
                          <span className="truncate">{t.title}</span>
                        </div>
                      ))}

                      {dayEvents.length + dayTasks.length > 2 && (
                        <span className="text-[8px] text-slate-400 font-bold block truncate pl-0.5">
                          +{dayEvents.length + dayTasks.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (4 Cols): Interactive Day & Upcoming/Past Events Tabs */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-750 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Feed Tabs Bar */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFeedTab('day')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer truncate ${
                  feedTab === 'day'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Selected Day
              </button>
              <button
                type="button"
                onClick={() => setFeedTab('upcoming')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer truncate ${
                  feedTab === 'upcoming'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setFeedTab('past')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer truncate ${
                  feedTab === 'past'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past Events
              </button>
            </div>

            {/* Tab 1: Selected Day Schedule */}
            {feedTab === 'day' && (
              <div className="space-y-2">
                <div className="border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Schedule for:
                  </span>
                  <h5 className="text-xs font-black text-emerald-300 font-mono mt-0.5">
                    {selectedDate === todayStr ? '⭐ Today - ' : ''}{selectedDate}
                  </h5>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedDateEvents.length === 0 && selectedDateTasks.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic space-y-1">
                      <p>No troop events or tasks scheduled for this day.</p>
                    </div>
                  ) : (
                    <>
                      {selectedDateEvents.map(ev => (
                        <div
                          key={ev.id}
                          onClick={() => onNavigate && onNavigate('events')}
                          className="p-2.5 rounded-xl bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 transition cursor-pointer text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <strong className="text-white font-bold truncate max-w-[150px]">{ev.title}</strong>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-semibold">
                              {ev.category || ev.type || 'Event'}
                            </span>
                          </div>
                          {(() => {
                            const aud = getEventAudienceInfo(ev, currentUser, groups);
                            return (
                              <div>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${aud.colorClass}`}>
                                  <span>{aud.icon}</span>
                                  <span className="font-bold truncate max-w-[130px]">{aud.badge}</span>
                                </span>
                              </div>
                            );
                          })()}
                          <p className="text-[10px] text-slate-300 font-mono">⏰ {ev.time}</p>
                          {ev.location && (
                            <p className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium truncate bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-lg w-fit max-w-full">
                              <MapPin size={10} className="text-emerald-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </p>
                          )}
                        </div>
                      ))}

                      {selectedDateTasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => onNavigate && onNavigate('assignments')}
                          className="p-2.5 rounded-xl bg-slate-800 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-white font-bold truncate max-w-[150px]">🎒 {t.title}</strong>
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full font-semibold">
                              Due
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">Homework task due date</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Upcoming Events List */}
            {feedTab === 'upcoming' && (
              <div className="space-y-2">
                <div className="border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                    Next Scheduled Events:
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                      <p>No upcoming events found.</p>
                    </div>
                  ) : (
                    upcomingEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => {
                          setSelectedDate(ev.date);
                          onNavigate && onNavigate('events');
                        }}
                        className="p-2 rounded-xl bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-emerald-300">📅 {ev.date}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">
                            {ev.category || 'Meeting'}
                          </span>
                        </div>
                        <strong className="text-white font-bold block truncate">{ev.title}</strong>
                        {(() => {
                          const aud = getEventAudienceInfo(ev, currentUser, groups);
                          return (
                            <div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${aud.colorClass}`}>
                                <span>{aud.icon}</span>
                                <span className="font-bold truncate max-w-[130px]">{aud.badge}</span>
                              </span>
                            </div>
                          );
                        })()}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-slate-400 font-mono">⏰ {ev.time}</p>
                          {ev.location && (
                            <span className="text-[10px] text-emerald-300/90 flex items-center gap-0.5 truncate max-w-[140px]">
                              <MapPin size={9} className="text-emerald-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Past Events Archive */}
            {feedTab === 'past' && (
              <div className="space-y-2">
                <div className="border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block">
                    Recently Completed Sessions:
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {pastEvents.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                      <p>No past events recorded yet.</p>
                    </div>
                  ) : (
                    pastEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => {
                          setSelectedDate(ev.date);
                          onNavigate && onNavigate('events');
                        }}
                        className="p-2 rounded-xl bg-slate-800/80 border border-purple-500/30 hover:border-purple-400 transition cursor-pointer text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-purple-300">📅 {ev.date}</span>
                          <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                            ✓ Past
                          </span>
                        </div>
                        <strong className="text-slate-200 font-bold block truncate">{ev.title}</strong>
                        {(() => {
                          const aud = getEventAudienceInfo(ev, currentUser, groups);
                          return (
                            <div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${aud.colorClass}`}>
                                <span>{aud.icon}</span>
                                <span className="font-bold truncate max-w-[130px]">{aud.badge}</span>
                              </span>
                            </div>
                          );
                        })()}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-slate-400 font-mono">⏰ {ev.time}</p>
                          {ev.location && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 truncate max-w-[140px]">
                              <MapPin size={9} className="text-purple-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('events')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer text-center"
          >
            Open Full Troop Calendar &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
