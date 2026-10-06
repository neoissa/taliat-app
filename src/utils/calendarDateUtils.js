import { MASTER_CALENDAR_DATA } from '../data/masterCalendarData';

/**
 * Formats a Date object into 'YYYY-MM-DD'
 */
export function formatDateToISO(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Format a Date object or YYYY-MM-DD into readable label: "Tue, Oct 13"
 */
export function formatFriendlyDate(dateInput) {
  if (!dateInput) return '';
  let d;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, day] = dateInput.split('-').map(Number);
    d = new Date(y, m - 1, day, 12, 0, 0);
  } else {
    d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  }
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Finds next occurrence of a target day of week (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat).
 * If today matches targetDayOfWeek and skipToday is true, jumps +7 days.
 */
export function getNextDayOfWeekDate(targetDayOfWeek, refDate = new Date(), skipToday = false) {
  const current = new Date(refDate);
  current.setHours(12, 0, 0, 0); // avoid DST jumps
  const currentDay = current.getDay();

  let daysToAdd = (targetDayOfWeek - currentDay + 7) % 7;
  if (daysToAdd === 0 && skipToday) {
    daysToAdd = 7;
  }

  current.setDate(current.getDate() + daysToAdd);
  return formatDateToISO(current);
}

/**
 * Checks an auto-loaded calendar (live Firestore events and master calendar dataset)
 * for any session occurring on the specified date.
 * 
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {Array} liveEvents - Live Firestore events list
 * @returns {Object|null} Matching event details or null
 */
export function checkAutoLoadedCalendar(dateStr, liveEvents = []) {
  if (!dateStr) return null;

  // 1. Check live Firestore events first
  if (Array.isArray(liveEvents) && liveEvents.length > 0) {
    const match = liveEvents.find(ev => ev.date === dateStr && !ev.isDeleted && !ev.archived);
    if (match) {
      return {
        id: match.id,
        title: match.title,
        date: match.date,
        time: match.time || `${match.startTime || ''} – ${match.endTime || ''}`.trim(),
        startTime: match.startTime || '',
        endTime: match.endTime || '',
        location: match.location || '',
        eventType: match.eventType || 'meeting',
        category: match.category || 'meeting',
        requiredItems: match.requiredItems || '',
        source: 'firestore_live'
      };
    }
  }

  // 2. Check bundled Master Calendar dataset
  const masterEvents = MASTER_CALENDAR_DATA?.events || [];
  const masterMatch = masterEvents.find(ev => ev.date === dateStr && !ev.isBlackout);
  if (masterMatch) {
    return {
      id: masterMatch.id,
      title: masterMatch.title,
      date: masterMatch.date,
      time: masterMatch.time || `${masterMatch.startTime || ''} – ${masterMatch.endTime || ''}`.trim(),
      startTime: masterMatch.startTime || '',
      endTime: masterMatch.endTime || '',
      location: masterMatch.location || '',
      eventType: masterMatch.eventType || 'meeting',
      category: masterMatch.category || 'meeting',
      requiredItems: masterMatch.requiredItems || '',
      source: 'master_calendar_dataset'
    };
  }

  // 3. Check master calendar blackouts
  const blackouts = MASTER_CALENDAR_DATA?.blackouts || [];
  const blackoutMatch = blackouts.find(b => {
    if (b.date === dateStr) return true;
    if (b.startDate && b.endDate && dateStr >= b.startDate && dateStr <= b.endDate) return true;
    return false;
  });
  if (blackoutMatch) {
    return {
      isBlackout: true,
      title: blackoutMatch.title || blackoutMatch.reason || 'Blackout / Holiday Break',
      date: dateStr,
      source: 'master_calendar_blackout'
    };
  }

  return null;
}

/**
 * Resolves the next upcoming Tuesday and Friday, specifically checking against
 * the auto-loaded troop calendar dataset to match scheduled sessions.
 * 
 * @param {Array} liveEvents - Live Firestore events list
 * @param {Date} refDate - Starting reference date (defaults to now)
 * @returns {Object} { nextTuesday, nextFriday, todayTuesday, todayFriday }
 */
export function resolveNextScheduledDays(liveEvents = [], refDate = new Date()) {
  const todayStr = formatDateToISO(refDate);
  const now = new Date(refDate);
  const currentDayOfWeek = now.getDay();

  // Next Tuesday (day 2)
  // If today is Tuesday, next Tuesday is 7 days ahead; if today is another day, next Tuesday is upcoming.
  const isTodayTuesday = currentDayOfWeek === 2;
  const isTodayFriday = currentDayOfWeek === 5;

  const nextTuesdayDate = getNextDayOfWeekDate(2, now, isTodayTuesday);
  const nextFridayDate = getNextDayOfWeekDate(5, now, isTodayFriday);

  // Auto-loaded calendar checks
  const nextTuesdaySession = checkAutoLoadedCalendar(nextTuesdayDate, liveEvents);
  const nextFridaySession = checkAutoLoadedCalendar(nextFridayDate, liveEvents);

  const todayTuesdaySession = isTodayTuesday ? checkAutoLoadedCalendar(todayStr, liveEvents) : null;
  const todayFridaySession = isTodayFriday ? checkAutoLoadedCalendar(todayStr, liveEvents) : null;

  return {
    todayStr,
    nextTuesday: {
      date: nextTuesdayDate,
      friendlyLabel: formatFriendlyDate(nextTuesdayDate),
      calendarSession: nextTuesdaySession,
      hasSession: Boolean(nextTuesdaySession && !nextTuesdaySession.isBlackout),
      isBlackout: Boolean(nextTuesdaySession?.isBlackout)
    },
    nextFriday: {
      date: nextFridayDate,
      friendlyLabel: formatFriendlyDate(nextFridayDate),
      calendarSession: nextFridaySession,
      hasSession: Boolean(nextFridaySession && !nextFridaySession.isBlackout),
      isBlackout: Boolean(nextFridaySession?.isBlackout)
    },
    todayTuesday: isTodayTuesday ? {
      date: todayStr,
      friendlyLabel: `Today (${formatFriendlyDate(todayStr)})`,
      calendarSession: todayTuesdaySession,
      hasSession: Boolean(todayTuesdaySession && !todayTuesdaySession.isBlackout)
    } : null,
    todayFriday: isTodayFriday ? {
      date: todayStr,
      friendlyLabel: `Today (${formatFriendlyDate(todayStr)})`,
      calendarSession: todayFridaySession,
      hasSession: Boolean(todayFridaySession && !todayFridaySession.isBlackout)
    } : null
  };
}
