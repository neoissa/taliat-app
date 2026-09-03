import React, { useState, useEffect } from 'react';
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
  CalendarCheck
} from 'lucide-react';

export default function LiveClockAndCalendar({ currentUser, onNavigate }) {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Events & Assignments Data
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // 1. Live Clock Ticking Effect (Updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Events from Firestore
  useEffect(() => {
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(list);
    }, (err) => console.warn('Events listener fallback in calendar:', err));
    return () => unsubEvents();
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

  const todayStr = new Date().toISOString().split('T')[0];

  // Events & Tasks on Selected Date
  const selectedDateEvents = events.filter(ev => ev.date === selectedDate);
  const selectedDateTasks = assignments.filter(a => a.dueDate === selectedDate);

  return (
    <div className="bg-slate-850 border border-slate-750 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
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
                  onClick={() => setSelectedDate(cell.dateString)}
                  className={`h-12 sm:h-14 p-1 rounded-xl transition cursor-pointer relative flex flex-col justify-between items-start border text-left ${
                    isSelected
                      ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md'
                      : isToday
                      ? 'bg-amber-950/30 border-amber-500/60 text-amber-300'
                      : cell.isCurrentMonth
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-950/40 border-slate-850 text-slate-600 hover:bg-slate-900'
                  }`}
                >
                  <span className={`text-[11px] font-bold font-mono px-1 rounded ${
                    isToday ? 'bg-amber-500 text-slate-950 font-black' : ''
                  }`}>
                    {cell.dayNumber}
                  </span>

                  {/* Activity Indicator Dots / Mini Pills */}
                  {hasActivity && (
                    <div className="flex items-center gap-0.5 mt-auto w-full overflow-hidden">
                      {dayEvents.map(e => (
                        <span
                          key={e.id}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                          title={e.title}
                        />
                      ))}
                      {dayTasks.map(t => (
                        <span
                          key={t.id}
                          className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                          title={t.title}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (4 Cols): Selected Day Schedule & Activity Feed */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-750 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="border-b border-slate-750 pb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Selected Day Schedule:
              </span>
              <h5 className="text-xs font-black text-emerald-300 font-mono mt-0.5">
                {selectedDate === todayStr ? '⭐ Today - ' : ''}{selectedDate}
              </h5>
            </div>

            {/* Scheduled Items List */}
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
                      <div className="flex items-center justify-between">
                        <strong className="text-white font-bold truncate max-w-[150px]">{ev.title}</strong>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-semibold">
                          {ev.type || 'Event'}
                        </span>
                      </div>
                      {ev.location && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
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
