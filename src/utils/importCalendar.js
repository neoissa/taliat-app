/**
 * Advanced Calendar Ingestion & Automated Seeding Engine
 * Parses the official 2026–27 Scout Year Calendar Excel dataset (`2026–27 Scout Year Calendar.xlsx`)
 * to auto-populate standalone sessions, recurring youth/scouting programs, leader meetings,
 * camps, and Islamic occasions into Firestore.
 */

import * as XLSX from 'xlsx';
import { db } from '../firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';

// ── DESIGNATED LOCATIONS MAP ──
export const DESIGNATED_LOCATIONS = {
  highview: 'Highview Elementary School (25225 Richardson St, Dearborn Heights, MI 48127)',
  leaderResidence: '6514 Kinloch St, Dearborn Heights, MI 48127',
  leaderHassan: '6514 Kinloch St, Dearborn Heights, MI 48127',
  pleasantRidge: '6514 Kinloch St, Dearborn Heights, MI 48127', // Preserved alias
  dBarA: "D' Bar A Scout Ranch (880 E Sutton Rd, Metamora, MI 48455)",
  hypeAthletics: 'Hype Athletics (23302 W Warren Ave, Dearborn Heights, MI 48127)',
  tbd: 'To Be Determined (TBD)'
};

// ── DIACRITIC-INSENSITIVE TEXT STRIPPER ──
export function stripDiacritics(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[āĀ]/g, 'a')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[ṭṬ]/g, 't')
    .replace(/[ḍḌ]/g, 'd')
    .replace(/[ṣṢ]/g, 's')
    .replace(/[ḥḤ]/g, 'h')
    .replace(/[ʿʾ`']/g, '')
    .toLowerCase()
    .trim();
}

// ── ISLAMIC OCCASIONS DICTIONARY ──
export const ISLAMIC_OCCASIONS_MAP = [
  { 
    id: 'birth_imam_ali', 
    keywords: ['birth of imam ali', 'wiladat imam ali', '13 rajab'], 
    name: 'Birth of Imam Ali (as)', 
    icon: '🕌', 
    tag: 'Islamic Celebration' 
  },
  { 
    id: 'martyrdom_imam_ali', 
    keywords: ['martyrdom imam ali', 'shahadat imam ali', 'majlis martyrdom imam ali', '21 ramadan'], 
    name: 'Martyrdom of Imam Ali (as) - Youth Majlis', 
    icon: '🕯️', 
    tag: 'Youth Majlis' 
  },
  { 
    id: 'birth_fatimah', 
    keywords: ['birth of sy. fatimah', 'birth of sayyidah fatimah', 'birth of sy. fatemah', 'birth of fatimah', 'birth of fatemah', '20 jumada'], 
    name: 'Birth of Sayyidah Fatimah al-Zahra (as)', 
    icon: '🌸', 
    tag: 'Islamic Celebration' 
  },
  { 
    id: 'martyrdom_fatimah', 
    keywords: ['martyrdom sayyidah fatemah', 'martyrdom sayyidah fatimah', 'martyrdom fatimah', 'martyrdom fatemah', 'fatimiyyah'], 
    name: 'Martyrdom of Sayyidah Fatimah (as) - Youth Majlis', 
    icon: '🕯️', 
    tag: 'Youth Majlis' 
  },
  { 
    id: 'birth_zainab', 
    keywords: ['birth of sy. zainab', 'birth of sayyidah zainab', 'birth of sy. zaynab', 'birth of zainab', '5 jumada'], 
    name: 'Birth of Sayyidah Zainab (as)', 
    icon: '🌹', 
    tag: 'Islamic Celebration' 
  },
  { 
    id: 'birth_shaban_heroes', 
    keywords: ['birth of imam hussain', 'imam hussain, al-abbas', 'al-abbas, imam sajjad', 'shaban celebrations'], 
    name: 'Birth of Imam Hussain, Abu Fadl al-Abbas & Imam Sajjad (as)', 
    icon: '✨', 
    tag: 'Islamic Celebration' 
  },
  { 
    id: 'birth_mahdi', 
    keywords: ['birth of imam mahdi', '15 shaban', 'imam mahdi (aj)'], 
    name: "Birth of Imam al-Mahdi (aj) - 15th Sha'ban", 
    icon: '⭐', 
    tag: 'Islamic Celebration' 
  },
  { 
    id: 'birth_ridha', 
    keywords: ['birth of imam al-ridha', 'birth of imam ridha', 'birth of imam reza', '11 dhu al-qadah'], 
    name: 'Birth of Imam Al-Ridha (as)', 
    icon: '🌟', 
    tag: 'Islamic Celebration' 
  },
  { 
    id: 'eid_ghadir', 
    keywords: ['eid al-ghadir', 'eid al ghadir', 'ghadir celebration', 'eid-e-ghadir', '18 dhu al-hijjah'], 
    name: 'Eid Al-Ghadir Celebration', 
    icon: '👑', 
    tag: 'Eid Celebration' 
  },
  { 
    id: 'eid_fitr', 
    keywords: ['eid ul-fitr', 'eid al-fitr', 'eid fitr', '1 shawwal'], 
    name: 'Eid ul-Fitr', 
    icon: '🌙', 
    tag: 'Eid Celebration' 
  },
  { 
    id: 'eid_adha', 
    keywords: ['eid al-adha', 'eid al adha', 'eid adha', '10 dhul-hijjah', '10 dhu al-hijjah'], 
    name: 'Eid al-Adha (10 Dhul-Hijjah)', 
    icon: '🐑', 
    tag: 'Eid Celebration' 
  },
  { 
    id: 'ramadan_season', 
    keywords: ['shahr ramadan', 'holy month of ramadan', 'ramadan prep'], 
    name: 'Shahr Ramadan Season', 
    icon: '🌙', 
    tag: 'Ramadan' 
  },
  { 
    id: 'family_iftar', 
    keywords: ['scout family potluck iftar', 'family potluck iftar', 'potluck iftar'], 
    name: 'Scout Family Potluck Iftar', 
    icon: '🍲', 
    tag: 'Community Iftar' 
  },
  { 
    id: 'scout_iftar', 
    keywords: ['scout-only iftar', 'scout only iftar'], 
    name: 'Scout-Only Iftar & Reflections', 
    icon: '🍽️', 
    tag: 'Scout Iftar' 
  },
  { 
    id: 'sirat_conf', 
    keywords: ['sirat conference', 'winter break/sirat'], 
    name: 'Sirat Youth Conference & Winter Break', 
    icon: '🧭', 
    tag: 'Conference' 
  }
];

// ── DEFAULT CAMP PACKING LISTS ──
export const DEFAULT_CAMP_PACKING_LIST = [
  'Complete BSA Field Uniform (Class A)',
  'Troop Activity T-Shirt (Class B)',
  'Scout Handbook & Pen',
  'Warm Sleeping Bag (rated for 20°F-40°F)',
  'Sleeping Pad & Ground Tarp',
  'Mess Kit (Plate, Bowl, Cup, Fork, Spoon)',
  'Refillable Water Bottle (32oz+)',
  'Personal First Aid Kit',
  'Flashlight or Headlamp with Extra Batteries',
  'Sturdy Hiking Boots & 3x Wool Socks',
  'Weather-Appropriate Layering Clothes',
  'Rain Jacket / Poncho',
  'Toiletries & Small Quick-Dry Towel',
  'Prayer Rug / Turbah / Small Compass'
];

/**
 * Normalizes Excel dates (serial numbers or string dates) into ISO YYYY-MM-DD
 */
export function normalizeDateToISO(rawDate) {
  if (!rawDate) return '';

  // 1. If Date object
  if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
    return rawDate.toISOString().split('T')[0];
  }

  // 2. If number (Excel serial date code e.g. 46277)
  if (typeof rawDate === 'number' || (!isNaN(Number(rawDate)) && String(rawDate).trim() !== '')) {
    const serial = Number(rawDate);
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    const fractionalDay = serial - Math.floor(serial) + 0.0000001;
    let totalSeconds = Math.floor(86400 * fractionalDay);
    const seconds = totalSeconds % 60;
    totalSeconds -= seconds;
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const finalDate = new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate() + 1, hours, minutes, seconds);
    const y = finalDate.getFullYear();
    const m = String(finalDate.getMonth() + 1).padStart(2, '0');
    const d = String(finalDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 3. If string date (e.g. "Saturday, September 12, 2026" or "2026-09-12" or "9/12/2026")
  if (typeof rawDate === 'string') {
    const trimmed = rawDate.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getFullYear();
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const d = String(parsed.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }

  return '';
}

/**
 * Parses time string or Excel decimal fraction into 24h start/end and 12h display
 */
export function normalizeTimeRange(rawTime, eventType = '') {
  if (!rawTime || String(rawTime).trim() === '' || String(rawTime).trim().toLowerCase() === 'tbd') {
    // Default fallback times based on event type
    if (eventType === 'youth_program') {
      return { startTime: '19:30', endTime: '20:30', timeDisplay: '7:30 PM – 8:30 PM', isAllDay: false, durationHours: 1.0 };
    }
    if (eventType === 'scouting_program') {
      return { startTime: '18:30', endTime: '21:00', timeDisplay: '6:30 PM – 9:00 PM', isAllDay: false, durationHours: 2.5 };
    }
    if (eventType === 'leader_meeting') {
      return { startTime: '21:00', endTime: '22:30', timeDisplay: '9:00 PM – 10:30 PM', isAllDay: false, durationHours: 1.5 };
    }
    return { startTime: '18:30', endTime: '20:30', timeDisplay: 'TBD', isAllDay: false, durationHours: 2.0 };
  }

  const str = String(rawTime).trim();

  // 1. All Day check
  if (str.toLowerCase() === 'all day' || str.toLowerCase() === 'allday') {
    return { startTime: '00:00', endTime: '23:59', timeDisplay: 'All Day', isAllDay: true, durationHours: 24.0 };
  }

  // 2. Numeric Decimal time (e.g. 0.7916666 = 19:00 / 7:00 PM, 0.5 = 12:00 PM)
  if (!isNaN(Number(str))) {
    const num = Number(str);
    const totalMinutes = Math.round(num * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const start24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const display = `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
    return { startTime: start24, endTime: start24, timeDisplay: display, isAllDay: false, durationHours: 2.0 };
  }

  // 3. Time Range format: e.g. "6:30 PM - 9:00 PM" or "7:30 PM - 8:30 PM"
  const rangeMatch = str.match(/^(\d{1,2}(?::\d{2})?)\s*(AM|PM)?\s*(?:-|–|to)\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)$/i);
  if (rangeMatch) {
    const parsePart = (val, forcedAmpm) => {
      let [hStr, mStr] = val.includes(':') ? val.split(':') : [val, '00'];
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr || '0', 10);
      const ampm = (forcedAmpm || '').toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return {
        h24: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        display: `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${ampm || (h >= 12 ? 'PM' : 'AM')}`
      };
    };

    const startAmpm = rangeMatch[2] || rangeMatch[4];
    const endAmpm = rangeMatch[4];

    const startObj = parsePart(rangeMatch[1], startAmpm);
    const endObj = parsePart(rangeMatch[3], endAmpm);

    const [sh, sm] = startObj.h24.split(':').map(Number);
    const [eh, em] = endObj.h24.split(':').map(Number);
    let durMinutes = (eh * 60 + em) - (sh * 60 + sm);
    if (durMinutes < 0) durMinutes += 24 * 60;
    const durationHours = Number((durMinutes / 60).toFixed(2));

    return {
      startTime: startObj.h24,
      endTime: endObj.h24,
      timeDisplay: `${startObj.display} – ${endObj.display}`,
      isAllDay: false,
      durationHours: durationHours || 1.5
    };
  }

  // 4. Single time format: e.g. "5:00 PM" or "1:30 PM"
  const singleMatch = str.match(/^(\d{1,2}(?::\d{2})?)\s*(AM|PM)$/i);
  if (singleMatch) {
    let [hStr, mStr] = singleMatch[1].includes(':') ? singleMatch[1].split(':') : [singleMatch[1], '00'];
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    const ampm = singleMatch[2].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const h24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const display = `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${ampm}`;
    return {
      startTime: h24,
      endTime: h24,
      timeDisplay: `${display} onwards`,
      isAllDay: false,
      durationHours: 3.0
    };
  }

  return { startTime: '18:30', endTime: '20:30', timeDisplay: str, isAllDay: false, durationHours: 2.0 };
}

/**
 * Smart Category and Type Resolver
 */
export function resolveEventTypeAndCategory(eventTitle = '') {
  const t = (eventTitle || '').trim();
  const lower = t.toLowerCase();

  if (lower.startsWith('no dhulfiqār') || lower.startsWith('no dhulfiqar') || lower.startsWith('no scouting') || lower.startsWith('no youth')) {
    return {
      eventType: 'blackout',
      category: 'blackout',
      isBlackout: true,
      categoryLabel: 'Holiday Closure / Blackout'
    };
  }

  if (lower.includes('youth program')) {
    return {
      eventType: 'youth_program',
      category: 'youth_program',
      isBlackout: false,
      categoryLabel: 'Tuesday Youth Program'
    };
  }

  if (lower.includes('scouting program')) {
    return {
      eventType: 'scouting_program',
      category: 'scouting_program',
      isBlackout: false,
      categoryLabel: 'Friday Scouting Program'
    };
  }

  if (lower.includes('leader meeting') || lower.includes('orientation') || lower.includes('retreat')) {
    return {
      eventType: 'leader_meeting',
      category: 'leader_meeting',
      isBlackout: false,
      categoryLabel: 'Leader Executive Meeting'
    };
  }

  if (lower.includes('camp')) {
    return {
      eventType: 'camp',
      category: 'camp',
      isBlackout: false,
      categoryLabel: 'Scout Camp & Outdoor Retreat'
    };
  }

  if (lower.includes('parent open house') || lower.includes('open house')) {
    return {
      eventType: 'open_house',
      category: 'special_event',
      isBlackout: false,
      categoryLabel: 'Parent Open House'
    };
  }

  if (lower.includes('uniform') || lower.includes('bsa application')) {
    return {
      eventType: 'uniform_ordering',
      category: 'special_event',
      isBlackout: false,
      categoryLabel: 'Uniform Ordering & Registration'
    };
  }

  if (lower.includes('merit badge')) {
    return {
      eventType: 'merit_badge',
      category: 'merit_badge',
      isBlackout: false,
      categoryLabel: 'Merit Badge Workshop'
    };
  }

  if (lower.includes('conference') || lower.includes('parent-leader')) {
    return {
      eventType: 'parent_conference',
      category: 'parent_conference',
      isBlackout: false,
      categoryLabel: 'Parent-Leader Conference'
    };
  }

  return {
    eventType: 'special_event',
    category: 'special_event',
    isBlackout: false,
    categoryLabel: 'Troop Event'
  };
}

/**
 * Smart Location Resolver
 */
export function resolveEventLocation(rawLocation = '', eventType = '', eventTitle = '') {
  const loc = (rawLocation || '').trim();
  const titleLower = (eventTitle || '').toLowerCase();

  // If specific known location provided in spreadsheet
  if (loc.includes('Highview')) return DESIGNATED_LOCATIONS.highview;
  if (loc.includes('Kinloch') || loc.includes('Pleasant Ridge') || loc.includes('Hassan')) return DESIGNATED_LOCATIONS.leaderResidence;
  if (loc.includes("D' BAR A") || loc.includes("D' Bar A") || loc.includes("D Bar A")) return DESIGNATED_LOCATIONS.dBarA;
  if (loc.includes('Hype')) return DESIGNATED_LOCATIONS.hypeAthletics;
  if (loc.length > 5 && loc.toLowerCase() !== 'tbd') return loc.replace(/\r\n/g, ', ').replace(/\n/g, ', ');

  // Auto-Assign based on rules
  if (eventType === 'youth_program' || eventType === 'scouting_program') {
    return DESIGNATED_LOCATIONS.highview;
  }

  if (eventType === 'leader_meeting') {
    if (titleLower.includes('retreat')) return 'Leader Camp Retreat Grounds (TBD)';
    if (titleLower.includes('orientation')) return 'TBD (Orientation Hall / Virtual)';
    return DESIGNATED_LOCATIONS.leaderResidence;
  }

  if (eventType === 'camp') {
    if (titleLower.includes('fall') || titleLower.includes('october')) return DESIGNATED_LOCATIONS.dBarA;
    return 'Camp Grounds (Designated Scout Camp / TBD)';
  }

  if (eventType === 'open_house' || eventType === 'uniform_ordering') {
    return DESIGNATED_LOCATIONS.hypeAthletics;
  }

  return DESIGNATED_LOCATIONS.tbd;
}

/**
 * Matches Islamic Occasions and remarks from Notes column
 */
export function extractIslamicOccasions(notes = '', eventTitle = '') {
  const combined = stripDiacritics(`${notes} ${eventTitle}`);
  const matched = [];

  ISLAMIC_OCCASIONS_MAP.forEach(occ => {
    const hasKeyword = occ.keywords.some(k => combined.includes(stripDiacritics(k)));
    if (hasKeyword && !matched.some(m => m.name === occ.name)) {
      matched.push({ name: occ.name, icon: occ.icon, tag: occ.tag });
    }
  });

  return matched;
}

/**
 * Comprehensive parser for 2026-2027 Calendar Workbook
 * Takes an ArrayBuffer or binary string or JSON raw rows and returns structured event documents
 */
export function parseMasterCalendarWorkbook(workbookOrBuffer) {
  let wb = workbookOrBuffer;

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(workbookOrBuffer)) {
    wb = XLSX.read(workbookOrBuffer, { type: 'buffer', cellDates: true });
  } else if (workbookOrBuffer instanceof ArrayBuffer) {
    wb = XLSX.read(workbookOrBuffer, { type: 'array', cellDates: true });
  } else if (workbookOrBuffer instanceof Uint8Array) {
    wb = XLSX.read(workbookOrBuffer, { type: 'array', cellDates: true });
  } else if (typeof workbookOrBuffer === 'string') {
    wb = XLSX.read(workbookOrBuffer, { type: 'binary', cellDates: true });
  }

  const sheetName = wb.Sheets?.['Calendar'] ? 'Calendar' : (wb.SheetNames ? wb.SheetNames[0] : 'Calendar');
  const ws = wb.Sheets?.[sheetName];
  if (!ws) {
    throw new Error(`Sheet "${sheetName}" not found in calendar workbook.`);
  }

  const rawRows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

  const eventsList = [];
  const blackoutList = [];
  const islamicEventsList = [];

  rawRows.forEach((row, index) => {
    const rawDate = row['Date'] || row['date'] || '';
    const rawTime = row['Time'] || row['time'] || '';
    const rawEvent = row['Event'] || row['event'] || row['Title'] || row['title'] || '';
    const rawLocation = row['Location'] || row['location'] || '';
    const rawNotes = row['Notes'] || row['notes'] || row['Remarks'] || row['remarks'] || '';

    if (!rawDate && !rawEvent) return;

    const dateISO = normalizeDateToISO(rawDate);
    if (!dateISO) return;

    const { eventType, category, isBlackout, categoryLabel } = resolveEventTypeAndCategory(rawEvent);
    const timeObj = normalizeTimeRange(rawTime, eventType);
    const locationStr = resolveEventLocation(rawLocation, eventType, rawEvent);
    const islamicOccasions = extractIslamicOccasions(rawNotes, rawEvent);

    const cleanDate = dateISO.replace(/-/g, '');
    const cleanTime = timeObj.startTime.replace(/:/g, '');
    const eventDocId = `event_${cleanDate}_${cleanTime}_${eventType.substring(0, 4)}`;

    let requiredItems = 'Scout Handbook, Notebook & Pen, Water Bottle';
    if (eventType === 'scouting_program') {
      requiredItems = 'Complete Class A Field Uniform, Scout Handbook, Water Bottle, Pen & Notebook';
    } else if (eventType === 'youth_program') {
      requiredItems = 'Activity Uniform (Class B), Scout Handbook, Workshop Materials, Water Bottle';
    } else if (eventType === 'camp') {
      requiredItems = DEFAULT_CAMP_PACKING_LIST.join(', ');
    }

    const isLeaderOnly = eventType === 'leader_meeting';
    const allowedRoles = isLeaderOnly 
      ? ['owner', 'admin', 'scoutmaster', 'assistant_scoutmaster', 'leader', 'executive'] 
      : ['scout', 'parent', 'leader', 'admin', 'owner', 'assistant_scoutmaster', 'scoutmaster', 'executive'];

    let description = `${rawEvent}.`;
    if (rawNotes) {
      description += ` Special Notes: ${rawNotes}`;
    }
    if (islamicOccasions.length > 0) {
      description += ` 🕌 Islamic Occasion: ${islamicOccasions.map(i => i.name).join(' & ')}.`;
    }

    const eventDoc = {
      id: eventDocId,
      title: rawEvent,
      eventType: eventType,
      category: category,
      categoryLabel: categoryLabel,
      date: dateISO,
      startTime: timeObj.startTime,
      endTime: timeObj.endTime,
      time: timeObj.timeDisplay,
      durationHours: timeObj.durationHours,
      isAllDay: timeObj.isAllDay,
      location: locationStr,
      description: description.trim(),
      rawNotes: rawNotes || '',
      notes: rawNotes || '',
      isBlackout: isBlackout,
      isStandalone: true,
      season: '2026-2027',
      leaderOnly: isLeaderOnly,
      allowedRoles: allowedRoles,
      requiredItems: requiredItems,
      packingList: eventType === 'camp' ? DEFAULT_CAMP_PACKING_LIST : [],
      islamicOccasion: islamicOccasions.length > 0 ? islamicOccasions.map(i => i.name).join(' & ') : '',
      islamicOccasions: islamicOccasions.map(i => ({ name: i.name, icon: i.icon, tag: i.tag })),
      isIslamicSpecial: islamicOccasions.length > 0,
      pushToAllPatrols: true,
      isGlobalScope: true,
      targetGroupId: 'all',
      sourceSheetIndex: index + 1,
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isBlackout) {
      blackoutList.push(eventDoc);
    } else {
      eventsList.push(eventDoc);
      if (islamicOccasions.length > 0) {
        islamicEventsList.push(eventDoc);
      }
    }
  });

  eventsList.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  blackoutList.sort((a, b) => a.date.localeCompare(b.date));

  return {
    allParsedCount: rawRows.length,
    events: eventsList,
    blackouts: blackoutList,
    islamicEvents: islamicEventsList,
    stats: {
      totalIngestibleEvents: eventsList.length,
      totalBlackouts: blackoutList.length,
      tuesdayYouthPrograms: eventsList.filter(e => e.eventType === 'youth_program').length,
      fridayScoutingPrograms: eventsList.filter(e => e.eventType === 'scouting_program').length,
      leaderMeetings: eventsList.filter(e => e.eventType === 'leader_meeting').length,
      camps: eventsList.filter(e => e.eventType === 'camp').length,
      specialEvents: eventsList.filter(e => e.eventType === 'special_event' || e.eventType === 'open_house' || e.eventType === 'uniform_ordering' || e.eventType === 'parent_conference' || e.eventType === 'merit_badge').length,
      islamicOccasionsCount: islamicEventsList.length
    }
  };
}

/**
 * Commits a list of parsed events to Firestore `/events` in batches
 */
export async function commitEventsToFirestore(events = [], options = {}) {
  const { onProgress, overwriteMode = 'merge' } = options;

  if (!events || events.length === 0) {
    return { success: true, count: 0 };
  }

  const batchSize = 400;
  let committedCount = 0;

  for (let i = 0; i < events.length; i += batchSize) {
    const chunk = events.slice(i, i + batchSize);
    const batch = writeBatch(db);

    chunk.forEach(ev => {
      const docRef = doc(db, 'events', ev.id);
      batch.set(docRef, {
        ...ev,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: overwriteMode === 'merge' });
    });

    await batch.commit();
    committedCount += chunk.length;

    if (typeof onProgress === 'function') {
      onProgress(committedCount, events.length);
    }
  }

  return { success: true, count: committedCount };
}
