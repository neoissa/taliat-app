/**
 * Automated Recurring Event Generator & Seeder for Troop Calendar
 * Generates standalone troop sessions across the 2026–2027 Scouting Year.
 * 
 * Schedule:
 * - Friday Sessions: Oct 2, 2026 – Jun 25, 2027 (Weekly, 6:30 PM – 9:30 PM, 3 hrs)
 * - Tuesday Sessions: Sep 8, 2026 – Jun 29, 2027 (Weekly, 6:30 PM – 9:30 PM, 3 hrs)
 */

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';

export const RECURRING_SCHEDULE_CONFIG = {
  friday: {
    title: 'Troop Meeting / Activity Session',
    eventType: 'meeting',
    category: 'meeting',
    startDate: '2026-10-02',
    endDate: '2027-06-25',
    dayOfWeek: 5, // Friday
    dayName: 'Friday',
    startTime: '18:30',
    endTime: '21:30',
    time: '6:30 PM – 9:30 PM',
    durationHours: 3,
    recurringPattern: 'weekly_friday',
    frequency: 'Every Friday',
    location: 'Troop Headquarters / Main Hall',
    description: 'Weekly Friday Standalone Troop Session / Skills & Activity Meeting (6:30 PM – 9:30 PM). Focus on outdoor skills, rank advancement, and patrol leadership.',
    requiredItems: 'Complete Class A Field Uniform, Scout Handbook, Water Bottle, Pen & Notebook'
  },
  tuesday: {
    title: 'Troop Meeting / Activity Session',
    eventType: 'meeting',
    category: 'meeting',
    startDate: '2026-09-08',
    endDate: '2027-06-29',
    dayOfWeek: 2, // Tuesday
    dayName: 'Tuesday',
    startTime: '18:30',
    endTime: '21:30',
    time: '6:30 PM – 9:30 PM',
    durationHours: 3,
    recurringPattern: 'weekly_tuesday',
    frequency: 'Every Tuesday',
    location: 'Troop Headquarters / Main Hall',
    description: 'Weekly Tuesday Standalone Troop Session / Skills & Activity Meeting (6:30 PM – 9:30 PM). Focus on merit badge workshops, character building, and patrol teamwork.',
    requiredItems: 'Activity Uniform / Class B, Scout Handbook, Workshop Materials, Water Bottle'
  }
};

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateToISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generate standard document ID: event_YYYYMMDD_HHMM
 */
export function generateEventDocId(dateStr, startTime = '18:30') {
  const cleanDate = (dateStr || '').replace(/[^0-9]/g, '');
  const cleanTime = (startTime || '18:30').replace(/[^0-9]/g, '');
  return `event_${cleanDate}_${cleanTime}`;
}

/**
 * Generate an array of YYYY-MM-DD date strings for a specific day of week between start and end dates
 * @param {string} startDateStr - 'YYYY-MM-DD'
 * @param {string} endDateStr - 'YYYY-MM-DD'
 * @param {number} targetDayOfWeek - 0 (Sun) to 6 (Sat)
 */
export function generateDateSequence(startDateStr, endDateStr, targetDayOfWeek) {
  const dates = [];
  const [sy, sm, sd] = startDateStr.split('-').map(Number);
  const [ey, em, ed] = endDateStr.split('-').map(Number);

  // Use noon to prevent local daylight saving/timezone hour skips
  let current = new Date(sy, sm - 1, sd, 12, 0, 0);
  const end = new Date(ey, em - 1, ed, 12, 0, 0);

  // Advance to first matching day of week
  while (current.getDay() !== targetDayOfWeek && current <= end) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    dates.push(formatDateToISO(current));
    current.setDate(current.getDate() + 7);
  }

  return dates;
}

/**
 * Generate all 82 standalone event objects for the 2026-2027 scouting year
 * @param {Object} customConfig - Optional custom overrides
 * @returns {Array<Object>} List of event document objects
 */
export function generateScoutingYearSchedule(customConfig = {}) {
  const fridayCfg = { ...RECURRING_SCHEDULE_CONFIG.friday, ...(customConfig.friday || {}) };
  const tuesdayCfg = { ...RECURRING_SCHEDULE_CONFIG.tuesday, ...(customConfig.tuesday || {}) };
  const createdBy = customConfig.createdBy || 'neoissa@gmail.com';
  const createdByName = customConfig.createdByName || 'Scoutmaster Admin';

  const fridayDates = generateDateSequence(fridayCfg.startDate, fridayCfg.endDate, fridayCfg.dayOfWeek);
  const tuesdayDates = generateDateSequence(tuesdayCfg.startDate, tuesdayCfg.endDate, tuesdayCfg.dayOfWeek);

  const events = [];

  // Generate Friday Sessions
  fridayDates.forEach((dateStr) => {
    const docId = generateEventDocId(dateStr, fridayCfg.startTime);
    events.push({
      id: docId,
      title: fridayCfg.title,
      eventType: fridayCfg.eventType,
      category: fridayCfg.category,
      date: dateStr,
      startTime: fridayCfg.startTime,
      endTime: fridayCfg.endTime,
      time: fridayCfg.time,
      durationHours: fridayCfg.durationHours,
      duration: `${fridayCfg.durationHours} hrs`,
      isStandalone: true,
      recurringPattern: fridayCfg.recurringPattern,
      dayOfWeek: fridayCfg.dayName,
      location: fridayCfg.location,
      description: fridayCfg.description,
      requiredItems: fridayCfg.requiredItems,
      createdBy: createdBy,
      createdByName: createdByName,
      pushToAllPatrols: true,
      isGlobalScope: true,
      targetGroupId: 'all',
      season: '2026-2027',
      createdAt: new Date().toISOString()
    });
  });

  // Generate Tuesday Sessions
  tuesdayDates.forEach((dateStr) => {
    const docId = generateEventDocId(dateStr, tuesdayCfg.startTime);
    events.push({
      id: docId,
      title: tuesdayCfg.title,
      eventType: tuesdayCfg.eventType,
      category: tuesdayCfg.category,
      date: dateStr,
      startTime: tuesdayCfg.startTime,
      endTime: tuesdayCfg.endTime,
      time: tuesdayCfg.time,
      durationHours: tuesdayCfg.durationHours,
      duration: `${tuesdayCfg.durationHours} hrs`,
      isStandalone: true,
      recurringPattern: tuesdayCfg.recurringPattern,
      dayOfWeek: tuesdayCfg.dayName,
      location: tuesdayCfg.location,
      description: tuesdayCfg.description,
      requiredItems: tuesdayCfg.requiredItems,
      createdBy: createdBy,
      createdByName: createdByName,
      pushToAllPatrols: true,
      isGlobalScope: true,
      targetGroupId: 'all',
      season: '2026-2027',
      createdAt: new Date().toISOString()
    });
  });

  // Sort chronologically by date and start time
  events.sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.startTime.localeCompare(b.startTime);
  });

  return events;
}

/**
 * Commit all generated standalone events to Firestore in batches
 * @param {Object} options - Configuration and callbacks
 * @returns {Promise<Object>} Summary of committed documents
 */
export async function seedCalendarEvents(options = {}) {
  const { 
    onProgress, 
    customConfig,
    batchSize = 200,
    groups = []
  } = options;

  const events = generateScoutingYearSchedule(customConfig);
  const total = events.length;
  let committed = 0;

  if (onProgress) {
    onProgress({ current: 0, total, percentage: 0, status: 'Starting calendar seeding...' });
  }

  // Chunk events into batches (Firestore supports max 500 ops per batch)
  for (let i = 0; i < total; i += batchSize) {
    const chunk = events.slice(i, i + batchSize);
    const batch = writeBatch(db);

    for (const ev of chunk) {
      const eventRef = doc(db, 'events', ev.id);
      const dataToSave = {
        ...ev,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
      batch.set(eventRef, dataToSave, { merge: true });

      // If group-level sync is requested
      if (groups && groups.length > 0 && ev.pushToAllPatrols) {
        for (const g of groups) {
          if (g.id) {
            const groupEventRef = doc(db, 'groups', g.id, 'events', ev.id);
            batch.set(groupEventRef, { ...dataToSave, targetGroupId: g.id }, { merge: true });
          }
        }
      }
    }

    await batch.commit();
    committed += chunk.length;

    if (onProgress) {
      const percentage = Math.round((committed / total) * 100);
      onProgress({ 
        current: committed, 
        total, 
        percentage, 
        status: `Committed ${committed} of ${total} sessions...` 
      });
    }
  }

  const fridayCount = events.filter(e => e.recurringPattern === 'weekly_friday').length;
  const tuesdayCount = events.filter(e => e.recurringPattern === 'weekly_tuesday').length;

  if (onProgress) {
    onProgress({ 
      current: total, 
      total, 
      percentage: 100, 
      status: `Successfully generated and seeded all ${total} standalone sessions!` 
    });
  }

  return {
    success: true,
    totalCommitted: committed,
    totalGenerated: total,
    fridayCount,
    tuesdayCount,
    events
  };
}

/**
 * Purge previously generated standalone recurring events from Firestore
 * @param {Object} options - Callbacks and filters
 */
export async function purgeGeneratedCalendarEvents(options = {}) {
  const { onProgress } = options;
  if (onProgress) onProgress({ status: 'Scanning for standalone recurring events...' });

  const eventsSnap = await getDocs(collection(db, 'events'));
  const docsToDelete = [];

  eventsSnap.forEach((docSnap) => {
    const data = docSnap.data();
    // Identify standalone generated events
    const isStandaloneGenerated = 
      data.isStandalone === true && 
      (data.recurringPattern === 'weekly_friday' || data.recurringPattern === 'weekly_tuesday' || docSnap.id.startsWith('event_2026') || docSnap.id.startsWith('event_2027'));
    
    if (isStandaloneGenerated) {
      docsToDelete.push(docSnap.id);
    }
  });

  const total = docsToDelete.length;
  let deletedCount = 0;

  for (let i = 0; i < total; i += 200) {
    const chunk = docsToDelete.slice(i, i + 200);
    const batch = writeBatch(db);
    chunk.forEach(id => {
      batch.delete(doc(db, 'events', id));
    });
    await batch.commit();
    deletedCount += chunk.length;
    if (onProgress) {
      onProgress({
        current: deletedCount,
        total,
        percentage: Math.round((deletedCount / (total || 1)) * 100),
        status: `Deleted ${deletedCount} of ${total} events...`
      });
    }
  }

  return {
    success: true,
    deletedCount
  };
}
