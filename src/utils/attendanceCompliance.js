/**
 * Attendance Compliance & Tracking Engine
 * 
 * Enforces Friday-Only Scouting Program & Mandatory Event attendance rules
 * for active participation compliance, absence risk evaluation, and rank advancement.
 */

/**
 * Check if a date string (YYYY-MM-DD) falls on a Friday (Day 5).
 * Uses local noon time to avoid timezone offset edge cases.
 */
export function isFridayDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  return dt.getDay() === 5;
}

/**
 * Evaluate if an event or attendance session represents a Friday Scouting Program.
 */
export function isFridayProgramEvent(eventOrSession) {
  if (!eventOrSession) return false;

  if (eventOrSession.isFridaySession === true) return true;
  if (eventOrSession.recurringPattern === 'weekly_friday') return true;

  const dateStr = eventOrSession.date || '';
  if (isFridayDate(dateStr)) return true;

  const title = (eventOrSession.title || '').toLowerCase();
  const eventType = (eventOrSession.eventType || '').toLowerCase();
  const category = (eventOrSession.category || '').toLowerCase();
  const notes = (eventOrSession.notes || '').toLowerCase();
  const combined = `${title} ${eventType} ${category} ${notes}`;

  if (combined.includes('friday') || combined.includes('weekly troop meeting') || combined.includes('dhulfiqār scouting program') || combined.includes('dhulfiqar scouting program')) {
    return true;
  }

  return false;
}

/**
 * Evaluate if an event or session is explicitly flagged as mandatory.
 */
export function isMandatoryEvent(eventOrSession) {
  if (!eventOrSession) return false;

  if (eventOrSession.mustAttend === true || eventOrSession.isMandatory === true) return true;

  const title = (eventOrSession.title || '').toLowerCase();
  const eventType = (eventOrSession.eventType || '').toLowerCase();
  const category = (eventOrSession.category || '').toLowerCase();
  const notes = (eventOrSession.notes || '').toLowerCase();
  const combined = `${title} ${eventType} ${category} ${notes}`;

  // Key troop mandatory milestones
  if (
    combined.includes('mandatory') ||
    combined.includes('must attend') ||
    combined.includes('court of honor') ||
    combined.includes('campout') ||
    combined.includes('camporee') ||
    combined.includes('advancement review') ||
    combined.includes('board of review') ||
    combined.includes('drill simulation') ||
    category === 'campout' ||
    category === 'camp' ||
    eventType === 'campout' ||
    eventType === 'camp'
  ) {
    return true;
  }

  return false;
}

/**
 * Evaluate if an event or session should be tracked for official attendance compliance.
 * Restricts tracking strictly to Friday Scouting Programs and Mandatory Events.
 */
export function isAttendanceTracked(eventOrSession) {
  if (!eventOrSession) return false;
  return isFridayProgramEvent(eventOrSession) || isMandatoryEvent(eventOrSession);
}

/**
 * Filter an array of events to only those tracked for official attendance compliance.
 * @param {Array} events - List of event objects
 * @param {string} filterMode - 'tracked_only' | 'friday_only' | 'mandatory_only' | 'all'
 */
export function filterAttendanceTrackedEvents(events = [], filterMode = 'tracked_only') {
  if (!Array.isArray(events)) return [];
  if (filterMode === 'all') return events;
  if (filterMode === 'friday_only') return events.filter(isFridayProgramEvent);
  if (filterMode === 'mandatory_only') return events.filter(isMandatoryEvent);
  // Default 'tracked_only' -> Fridays + Mandatory
  return events.filter(isAttendanceTracked);
}

/**
 * Filter an array of attendance sessions to only those tracked for official compliance.
 * @param {Array} sessions - List of attendance session objects
 * @param {string} filterMode - 'tracked_only' | 'friday_only' | 'mandatory_only' | 'all'
 */
export function filterAttendanceTrackedSessions(sessions = [], filterMode = 'tracked_only') {
  if (!Array.isArray(sessions)) return [];
  if (filterMode === 'all') return sessions;
  if (filterMode === 'friday_only') return sessions.filter(isFridayProgramEvent);
  if (filterMode === 'mandatory_only') return sessions.filter(isMandatoryEvent);
  return sessions.filter(isAttendanceTracked);
}

/**
 * Calculate comprehensive compliance statistics for a specific scout.
 * Evaluates active participation rate, unexcused absence risk, and advancement threshold.
 * 
 * @param {string} scoutUid - The scout's unique user ID
 * @param {Array} allSessions - List of all recorded attendance sessions
 * @param {Object} options - { filterMode: 'tracked_only', minAdvancementRate: 70 }
 */
export function calculateScoutCompliance(scoutUid, allSessions = [], options = {}) {
  const {
    filterMode = 'tracked_only',
    minAdvancementRate = 70 // Standard Scouting America active participation threshold
  } = options;

  if (!scoutUid || !Array.isArray(allSessions)) {
    return {
      totalSessions: 0,
      presentCount: 0,
      absentCount: 0,
      excusedCount: 0,
      lateCount: 0,
      attendanceRate: 100,
      fridaySessions: { total: 0, attended: 0, percentage: 100 },
      mandatoryEvents: { total: 0, attended: 0, percentage: 100 },
      totalTrackedHours: 0,
      totalCampingNights: 0,
      totalFridayHours: 0,
      riskLevel: 'green',
      riskLabel: 'Good Standing',
      riskTooltip: 'Active participation in good standing',
      isEligibleForAdvancement: true,
      trackedSessions: []
    };
  }

  // Filter sessions according to compliance scope (Default: Friday Programs & Mandatory Events)
  const scopedSessions = filterMode === 'all' 
    ? allSessions 
    : allSessions.filter(isAttendanceTracked);

  const scoutTrackedRecords = [];
  let present = 0;
  let absent = 0;
  let excused = 0;
  let late = 0;
  let totalTrackedHours = 0;
  let totalCampingNights = 0;
  let totalFridayHours = 0;

  let fridayTotal = 0;
  let fridayAttended = 0;
  let mandatoryTotal = 0;
  let mandatoryAttended = 0;

  scopedSessions.forEach((session) => {
    const record = session.records?.[scoutUid];
    if (!record) return;

    const isFriday = isFridayProgramEvent(session);
    const isMandatory = isMandatoryEvent(session);
    const status = record.status || 'present';
    const isAttended = status === 'present' || status === 'late';

    const sHours = record.hours !== undefined 
      ? Number(record.hours) 
      : (session.hours !== undefined ? Number(session.hours) : (isFriday ? 3.0 : 3.0));
    
    const sNights = record.nights !== undefined 
      ? Number(record.nights) 
      : (session.nights !== undefined ? Number(session.nights) : 0);

    if (isFriday) {
      fridayTotal++;
      if (isAttended) fridayAttended++;
    }

    if (isMandatory) {
      mandatoryTotal++;
      if (isAttended) mandatoryAttended++;
    }

    if (status === 'present') {
      present++;
    } else if (status === 'late') {
      late++;
      present++;
    } else if (status === 'absent') {
      absent++;
    } else if (status === 'excused') {
      excused++;
    }

    if (isAttended) {
      totalTrackedHours += sHours;
      totalCampingNights += sNights;
      if (isFriday) {
        totalFridayHours += sHours;
      }
    }

    scoutTrackedRecords.push({
      sessionId: session.id || session.sessionId,
      date: session.date || '',
      eventType: session.eventType || (isFriday ? 'Weekly Troop Meeting (Friday)' : 'Mandatory Event'),
      title: session.notes || session.eventType || 'Scouting Session',
      isFriday,
      isMandatory,
      status,
      hours: sHours,
      nights: sNights,
      note: record.note || ''
    });
  });

  // Sort chronological descending
  scoutTrackedRecords.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const total = scoutTrackedRecords.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 100;
  const fridayRate = fridayTotal > 0 ? Math.round((fridayAttended / fridayTotal) * 100) : 100;
  const mandatoryRate = mandatoryTotal > 0 ? Math.round((mandatoryAttended / mandatoryTotal) * 100) : 100;

  // Calculate consecutive recent unexcused absences
  let consecutiveAbsences = 0;
  for (let i = 0; i < scoutTrackedRecords.length; i++) {
    if (scoutTrackedRecords[i].status === 'absent') {
      consecutiveAbsences++;
    } else if (scoutTrackedRecords[i].status === 'present' || scoutTrackedRecords[i].status === 'late') {
      break;
    }
  }

  // Risk Classification
  let riskLevel = 'green';
  let riskLabel = 'Good Standing';
  let riskTooltip = 'Regular attendance (Good Standing)';

  if (absent >= 3 || consecutiveAbsences >= 3 || rate < 60) {
    riskLevel = 'red';
    riskLabel = 'Critical Risk';
    riskTooltip = `Critical: ${absent} unexcused absences in Friday/mandatory events (${rate}% attendance). Leader & parent review required.`;
  } else if (absent === 2 || consecutiveAbsences === 2 || rate < 75) {
    riskLevel = 'yellow';
    riskLabel = 'At Risk';
    riskTooltip = `Needs follow-up: ${absent} unexcused absences (${rate}% attendance).`;
  }

  const isEligibleForAdvancement = rate >= minAdvancementRate && absent < 3;

  return {
    totalSessions: total,
    presentCount: present,
    absentCount: absent,
    excusedCount: excused,
    lateCount: late,
    consecutiveAbsences,
    attendanceRate: rate,
    fridaySessions: {
      total: fridayTotal,
      attended: fridayAttended,
      percentage: fridayRate
    },
    mandatoryEvents: {
      total: mandatoryTotal,
      attended: mandatoryAttended,
      percentage: mandatoryRate
    },
    totalTrackedHours: Math.round(totalTrackedHours * 10) / 10,
    totalCampingNights,
    totalFridayHours: Math.round(totalFridayHours * 10) / 10,
    riskLevel,
    riskLabel,
    riskTooltip,
    isEligibleForAdvancement,
    trackedSessions: scoutTrackedRecords
  };
}
