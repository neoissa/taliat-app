import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * Parses date string (YYYY-MM-DD) and time string (e.g. "6:30 PM", "18:30", "6:00 PM (Pre-Meeting)")
 * into a JavaScript Date object.
 */
export function getMeetingTargetDate(dateStr, timeStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return null;

    if (!timeStr) {
      d.setHours(18, 30, 0, 0); // Default to 6:30 PM
      return d;
    }

    // Extract hours, minutes, and am/pm
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = (timeMatch[3] || '').toUpperCase();

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      d.setHours(hours, minutes, 0, 0);
    } else {
      d.setHours(18, 30, 0, 0);
    }

    return d;
  } catch (e) {
    return null;
  }
}

/**
 * ConferenceCountdown Component
 * @param {string} date - Meeting date (YYYY-MM-DD)
 * @param {string} time - Meeting time (e.g. "6:30 PM")
 * @param {string} variant - 'compact' | 'full' | 'banner' | 'pill'
 */
export default function ConferenceCountdown({ date, time, variant = 'compact', className = '' }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const target = getMeetingTargetDate(date, time);
    if (!target) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        // Meeting is past or in progress (within 2 hours)
        const isRecent = diffMs > -2 * 60 * 60 * 1000;
        setTimeLeft({
          isPast: !isRecent,
          isInProgress: isRecent,
          totalSeconds: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        isPast: false,
        isInProgress: false,
        isToday: days === 0,
        isUrgent: days === 0 && hours < 4,
        totalSeconds,
        days,
        hours,
        minutes,
        seconds
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  if (!timeLeft) return null;

  if (timeLeft.isInProgress) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono text-xs font-bold animate-pulse ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>🟢 Conference In Progress / Today</span>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono text-[11px] ${className}`}>
        <CheckCircle2 size={12} className="text-emerald-500" />
        <span>Completed</span>
      </div>
    );
  }

  // Pill Variant (Compact single-line)
  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold ${
        timeLeft.isUrgent
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
          : timeLeft.isToday
          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60'
      } ${className}`}>
        <Clock size={12} className={timeLeft.isUrgent ? 'text-amber-400' : 'text-emerald-400'} />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  // Full Widget Variant (Block with segmented units)
  if (variant === 'full') {
    return (
      <div className={`bg-slate-950/80 border border-emerald-500/40 p-3 rounded-2xl space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-wider text-emerald-400">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            <span>Live Conference Countdown</span>
          </span>
          {timeLeft.isToday && (
            <span className="text-amber-300 bg-amber-950/60 px-2 py-0.2 rounded-full border border-amber-500/30">
              Today
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <span className="text-base font-black text-white block">{timeLeft.days}</span>
            <span className="text-[9px] uppercase text-slate-400 block font-sans">Days</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <span className="text-base font-black text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase text-slate-400 block font-sans">Hours</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <span className="text-base font-black text-emerald-400 block">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase text-slate-400 block font-sans">Mins</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <span className="text-base font-black text-emerald-300 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase text-slate-400 block font-sans">Secs</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Compact Badge with icon
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold ${
      timeLeft.isUrgent
        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-950/40'
        : timeLeft.isToday
        ? 'bg-sky-950/80 text-sky-300 border border-sky-500/50'
        : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
    } ${className}`}>
      <Clock size={13} className={timeLeft.isUrgent ? 'text-amber-400 animate-spin' : 'text-emerald-400'} />
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
      <span className="text-[10px] font-sans font-normal opacity-80">
        {timeLeft.isToday ? '(Today)' : 'left'}
      </span>
    </div>
  );
}
