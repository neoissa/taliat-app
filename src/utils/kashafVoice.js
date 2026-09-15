/**
 * KashafVoice v4.0 — WhatsApp Announcement & Communication Engine
 * Based on: WhatsApp Announcement Rules — Dhulfiqār Scouts (Version 2.1)
 * 
 * Rules:
 * 1. The one-pass rule (say each fact exactly once)
 * 2. Fixed block order: Greeting -> Header -> Purpose -> Details (When/Where) -> Gear -> Note -> RSVP -> Carpool -> Questions -> Du'a -> Signature
 * 3. Length & fold discipline: Routine messages under ~700 chars, When & Where in first 6 lines
 * 4. WhatsApp formatting: Single asterisks *bold*, _italics_, bare URL on its own line, one link per message
 * 5. Emoji discipline: 🌿 greeting, 📢 header, 📅 date, 📍 location, 🎒 gear, 📝 note, 🔗 link, 🚗 carpool, 📞 contact, 🙏 du'a, ⚜️ signature
 * 6. Bare RSVP URL on its own line for Open Graph preview card
 * 7. One channel per action: RSVP in portal, Carpool in group reply, Questions to leader directly
 * 8. Date, time, and address formatting: "Weekday, Month D, YYYY · H:MM–H:MM AM/PM" & "6514 Kinloch St., Dearborn Heights, MI 48127"
 * 9. Gear label matches item count: 1 item -> *Required Gear:*, 2+ items -> *Packing Checklist:* with "• "
 * 10. Templates A (Weekly), B (Overnight), C (Cancellation), D (Recap), E (Day-of nudge)
 */

export const APP_PORTAL_URL = 'https://taliat-app.vercel.app/';
export const DEFAULT_HQ_ADDRESS = '6514 Kinloch St., Dearborn Heights, MI 48127';
export const DEFAULT_PATROL_SIGNATURE = 'Patrol 2 — Ṭalīʿat Abū al-Faḍl al-ʿAbbās';
export const TEAM_SIGNATURE = '⚜️ Dhulfiqār Scouts Team ⚜️';

// Academic transliteration (ā, ī, ū, ʿ, ʾ) and Shia honorifics
export function applyIslamicTransliteration(text) {
  if (!text) return '';
  const map = [
    { regex: /\bAssalamu\s+Alaikum\b/gi, rep: 'Assalāmu ʿAlaykum' },
    { regex: /\bAssalamu\s+Alaykum\b/gi, rep: 'Assalāmu ʿAlaykum' },
    { regex: /\bSalam\b/gi, rep: 'Salām' },
    { regex: /\bQuran\b/gi, rep: 'Qurʾān' },
    { regex: /\bKoran\b/gi, rep: 'Qurʾān' },
    { regex: /\bAllah\b/gi, rep: 'Allāh' },
    { regex: /\bAhlulbayt\b/gi, rep: 'Ahl al-Bayt (ʿa)' },
    { regex: /\bAhlul\s+Bayt\b/gi, rep: 'Ahl al-Bayt (ʿa)' },
    { regex: /\bProphet\s+Muhammad\b/gi, rep: 'Prophet Muḥammad (ṣ)' },
    { regex: /\bImam\s+Ali\b/gi, rep: 'Imām ʿAlī (ʿa)' },
    { regex: /\bImam\s+Hasan\b/gi, rep: 'Imām al-Ḥasan (ʿa)' },
    { regex: /\bImam\s+Husayn\b/gi, rep: 'Imām al-Ḥusayn (ʿa)' },
    { regex: /\bImam\s+Hussain\b/gi, rep: 'Imām al-Ḥusayn (ʿa)' },
    { regex: /\bImam\s+Mahdi\b/gi, rep: 'Imām al-Mahdī (ʿaj)' },
    { regex: /\bAbbas\b/gi, rep: 'Abū al-Faḍl al-ʿAbbās (ʿa)' },
    { regex: /\bFatima\b/gi, rep: 'Sayyidah Fāṭimah al-Zahrāʾ (ʿa)' },
    { regex: /\bZaynab\b/gi, rep: 'Sayyidah Zaynab (ʿa)' },
    { regex: /\bInshallah\b/gi, rep: 'InshāʾAllāh' },
    { regex: /\bInsha\s+Allah\b/gi, rep: 'InshāʾAllāh' },
    { regex: /\bMashaAllah\b/gi, rep: 'MāshāʾAllāh' },
    { regex: /\bMasha\s+Allah\b/gi, rep: 'MāshāʾAllāh' },
    { regex: /\bSubhanallah\b/gi, rep: 'SubḥānAllāh' },
    { regex: /\bAlhamdulillah\b/gi, rep: 'Alḥamdulillāh' },
    { regex: /\bJazakallah\b/gi, rep: 'Jazākum Allāhu khayran' },
    { regex: /\bJazakum\s+Allah\b/gi, rep: 'Jazākum Allāhu khayran' },
    { regex: /\bSalat\b/gi, rep: 'Ṣalāt' },
    { regex: /\bSalah\b/gi, rep: 'Ṣalāt' },
    { regex: /\bNamaz\b/gi, rep: 'Ṣalāt' },
    { regex: /\bWudu\b/gi, rep: 'Wuḍūʾ' },
    { regex: /\bAdhan\b/gi, rep: 'Adhān' },
    { regex: /\bIqama\b/gi, rep: 'Iqāmah' },
    { regex: /\bAkhlaq\b/gi, rep: 'Akhlāq' },
    { regex: /\bTarbiyah\b/gi, rep: 'Tarbiyah' },
    { regex: /\bTaqwa\b/gi, rep: 'Taqwā' },
    { regex: /\bKarbala\b/gi, rep: 'Karbalāʾ' },
    { regex: /\bAshura\b/gi, rep: 'ʿĀshūrāʾ' },
    { regex: /\bTawhid\b/gi, rep: 'Tawḥīd' },
    { regex: /\bNubuwwah\b/gi, rep: 'Nubuwwah' },
    { regex: /\bImamah\b/gi, rep: 'Imāmah' },
    { regex: /\bHadith\b/gi, rep: 'Ḥadīth' },
    { regex: /\bDua\b/gi, rep: 'Duʿāʾ' },
    { regex: /\bDuas\b/gi, rep: 'Adʿiyah' },
    { regex: /\bZiyarat\b/gi, rep: 'Ziyārah' },
    { regex: /\bZiyarah\b/gi, rep: 'Ziyārah' },
    { regex: /\bTafsir\b/gi, rep: 'Tafsīr' },
    { regex: /\bSunnah\b/gi, rep: 'Sunnah' },
    { regex: /\bShia\b/gi, rep: 'Shīʿah' },
    { regex: /\bNahjul\s+Balagha\b/gi, rep: 'Nahj al-Balāghah' },
    { regex: /\bNahj\s+al-Balagha\b/gi, rep: 'Nahj al-Balāghah' },
    { regex: /\bAl-Kafi\b/gi, rep: 'Al-Kāfī' }
  ];

  let result = text;
  map.forEach(({ regex, rep }) => {
    result = result.replace(regex, rep);
  });
  return result;
}

/**
 * Standard Patrol Signature Formatter
 * Formats according to Rule 14:
 * "Patrol 2 — Ṭalīʿat Abū al-Faḍl al-ʿAbbās"
 */
export function formatPatrolSignature(patrolName = '') {
  if (!patrolName || typeof patrolName !== 'string') {
    return DEFAULT_PATROL_SIGNATURE;
  }
  const clean = patrolName.trim();
  if (!clean || clean.toLowerCase() === 'all' || clean.toLowerCase() === 'troop') {
    return DEFAULT_PATROL_SIGNATURE;
  }
  if (clean.toLowerCase().startsWith('patrol ')) {
    return clean;
  }
  if (clean.toLowerCase().includes('ṭalīʿat') || clean.toLowerCase().includes('talia')) {
    return `Patrol — ${clean}`;
  }
  return `Patrol 2 — Ṭalīʿat ${clean}`;
}

/**
 * Role-Aware Greeting Builder (Rule 2 & Rule 5)
 * Exactly one line, framed with 🌿
 */
export function getKashafGreeting(roleOrType = 'parent', name = '') {
  const cleanName = name ? name.trim() : '';
  const type = (roleOrType || '').toLowerCase();

  if (type === 'parent' || type === 'parents') {
    return '🌿 Assalāmu ʿAlaykum dear parents 🌿';
  }
  if (type === 'leader' || type === 'owner') {
    const leaderTitle = cleanName ? `dear Leader ${cleanName}` : 'dear Leader';
    return `🌿 Assalāmu ʿAlaykum ${leaderTitle} 🌿`;
  }
  if (type === 'scout') {
    const scoutTitle = cleanName ? `dear Scout ${cleanName}` : 'dear Scout';
    return `🌿 Assalāmu ʿAlaykum ${scoutTitle} 🌿`;
  }
  if (cleanName) {
    return `🌿 Assalāmu ʿAlaykum dear ${cleanName} 🌿`;
  }
  return '🌿 Assalāmu ʿAlaykum dear parents 🌿';
}

export const LOCKED_GREETING = '🌿 Assalāmu ʿAlaykum dear parents 🌿';

/**
 * Standard Closing Block (Rule 2 & Rule 5)
 * Closing duʿāʾ line + Patrol signature + Team signature
 */
export function getLockedClosing(patrolName = '', variant = 'default') {
  const patrolSig = formatPatrolSignature(patrolName);
  const duaLine = (variant === 'cancel' || variant === 'cancellation')
    ? 'Jazākum Allāhu khayran for your understanding 🙏'
    : 'Jazākum Allāhu khayran for your continued support 🙏';

  return `${duaLine}\n${patrolSig}\n${TEAM_SIGNATURE}`;
}

/**
 * Format Date & Time according to Rule 8:
 * "Tuesday, September 15, 2026 · 7:15–8:30 PM"
 * Overnight: "Fri, October 9 5:00 PM → Sun, October 11 11:00 AM"
 */
export function formatEventWhen(dateStr = '', timeStr = '', endDateStr = '', endTimeStr = '') {
  if (!dateStr) return '';

  let datePart = dateStr;

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(dObj.getTime())) {
        datePart = dObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
  } catch {
    datePart = dateStr;
  }

  // Handle multi-day / overnight
  if (endDateStr && endDateStr !== dateStr) {
    try {
      const p1 = dateStr.split('-');
      const p2 = endDateStr.split('-');
      const d1 = new Date(parseInt(p1[0], 10), parseInt(p1[1], 10) - 1, parseInt(p1[2], 10));
      const d2 = new Date(parseInt(p2[0], 10), parseInt(p2[1], 10) - 1, parseInt(p2[2], 10));
      const s1 = d1.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
      const s2 = d2.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
      const t1 = timeStr ? ` ${timeStr.replace(/\s*at\s*/i, '').trim()}` : '';
      const t2 = endTimeStr ? ` ${endTimeStr.replace(/\s*at\s*/i, '').trim()}` : '';
      return `${s1}${t1} → ${s2}${t2}`;
    } catch {
      // fallback
    }
  }

  // Standard single-day time formatting
  let cleanTime = (timeStr || '').trim();
  if (cleanTime) {
    // Replace " - " or " to " with en-dash "–"
    cleanTime = cleanTime.replace(/\s*(?:-|to)\s*/gi, '–').replace(/\s*at\s*/i, '').trim();
    return `${datePart} · ${cleanTime}`;
  }

  return datePart;
}

/**
 * Format Location Address according to Rule 8:
 * "6514 Kinloch St., Dearborn Heights, MI 48127"
 * Bare unwrapped text, comma after street, state and ZIP.
 */
export function formatEventWhere(locationStr = '') {
  if (!locationStr || !locationStr.trim()) {
    return DEFAULT_HQ_ADDRESS;
  }
  let loc = locationStr.trim();
  // Strip enclosing parentheses or quotes
  loc = loc.replace(/^\((.*)\)$/, '$1').replace(/^"(.*)"$/, '$1').trim();
  return loc;
}

/**
 * Format Gear block according to Rule 9:
 * 1 item: 🎒 *Required Gear:* {item}
 * 2+ items: 🎒 *Packing Checklist:*\n• item 1\n• item 2
 */
export function formatGearBlock(requiredItems = '') {
  if (!requiredItems || !requiredItems.trim()) return '';

  const rawItems = requiredItems
    .split(/[\n;]+/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => l.replace(/^[-*•\d+.)]\s*/, '').trim())
    .filter(Boolean);

  if (rawItems.length === 0) return '';

  if (rawItems.length === 1) {
    return `🎒 *Required Gear:* ${rawItems[0]}`;
  }

  const checklistLines = rawItems.map(item => `• ${item}`);
  return `🎒 *Packing Checklist:*\n${checklistLines.join('\n')}`;
}

/**
 * Format Note block according to Rule 2 & Rule 9
 */
export function formatNoteBlock(notes = '') {
  if (!notes || !notes.trim()) return '';

  const rawLines = notes
    .split(/[\n]+/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => l.replace(/^[-*•\d+.)]\s*/, '').trim())
    .filter(Boolean);

  if (rawLines.length === 0) return '';

  if (rawLines.length === 1) {
    return `📝 *Note:* ${rawLines[0]}`;
  }

  const noteLines = rawLines.map(line => `• ${line}`);
  return `📝 *Note:*\n${noteLines.join('\n')}`;
}

/**
 * Scriptural Block Formatter (Optional)
 */
export function formatIsolatedQuranBlock(arabic, translation = '') {
  if (!arabic || !arabic.trim()) return '';
  let block = '\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n';
  block += `${arabic.trim()}\n`;
  if (translation && translation.trim()) block += `"${translation.trim()}"\n`;
  block += 'صَدَقَ اللَّهُ الْعَلِيُّ الْعَظِيمُ';
  return block;
}

/**
 * ── MASTER WHATSAPP ANNOUNCEMENT GENERATOR ──
 * Implements Templates A, B, C, D, E and custom types strictly following Rules 1-15.
 */
export function generateEventReminderWhatsApp(event, options = {}) {
  if (!event) return '';

  const opts = typeof options === 'string' ? { patrolName: options } : (options || {});
  const {
    patrolName = DEFAULT_PATROL_SIGNATURE,
    reminderType = 'general', // 'general' (Template A) | 'campout' (Template B) | 'cancel' (Template C) | 'recap' (Template D) | 'nudge' (Template E) | 'urgent' | 'rsvp' | 'packing'
    templateType = '',
    customPurpose = '',
    customNote = '',
    rsvpDeadline = '',
    carpoolNote = '',
    nextSessionStr = '',
    cancellationReason = '',
    includeRsvpLink = true,
    appUrl = APP_PORTAL_URL
  } = opts;

  const mode = templateType || reminderType || 'general';
  const eventTitle = applyIslamicTransliteration(event.title || 'Youth Scouting Program').trim();

  // ─────────────────────────────────────────────────────────
  // TEMPLATE E — Day-of Nudge (Rule 2 & Template E)
  // Drops greeting and signature frame. Under 200 chars.
  // ─────────────────────────────────────────────────────────
  if (mode === 'nudge' || mode === 'template_e' || mode === 'day_of') {
    const timeClean = (event.time || '7:15–8:30 PM').replace(/\s*(?:-|to)\s*/gi, '–').replace(/\s*at\s*/i, '').trim();
    const whereStr = formatEventWhere(event.location);
    const linkLine = includeRsvpLink ? `\n\n🔗 *Last-minute RSVP:*\n${appUrl}` : '';

    return `📢 *Tonight:* ${eventTitle}, ${timeClean}\n📍 ${whereStr}${linkLine}`;
  }

  // ─────────────────────────────────────────────────────────
  // TEMPLATE C — Cancellation or Postponement (Template C)
  // ─────────────────────────────────────────────────────────
  if (mode === 'cancel' || mode === 'template_c' || mode === 'cancellation') {
    const greeting = LOCKED_GREETING;
    const whenFormatted = formatEventWhen(event.date, event.time);
    const header = `📢 *Cancelled: ${eventTitle}, ${whenFormatted}*`;
    const reasonLine = cancellationReason || customPurpose || 'Due to inclement weather / scheduling conflict.';
    
    let nextBlock = '';
    if (nextSessionStr) {
      nextBlock = `\n\n📅 *Next session:* ${nextSessionStr}`;
    }

    const noteBlock = `\n\n📝 *Note:*\n• Nothing to drop off and no RSVP needed tonight\n• Any RSVP already submitted carries over`;
    const questionsBlock = `\n\n📞 *Questions:* message any of the scout leaders directly.`;
    const closing = `\n\n${getLockedClosing(patrolName, 'cancel')}`;

    return `${greeting}\n\n${header}\n${reasonLine}${nextBlock}${noteBlock}${questionsBlock}${closing}`;
  }

  // ─────────────────────────────────────────────────────────
  // TEMPLATE D — Post-Event Recap / Thank You (Template D)
  // ─────────────────────────────────────────────────────────
  if (mode === 'recap' || mode === 'template_d' || mode === 'thank_you') {
    const greeting = LOCKED_GREETING;
    const header = `📢 *${eventTitle} — Thank You*`;
    const accomplishments = customPurpose || event.description || 'An inspiring session focused on scout skills, brotherhood, and leadership.';
    
    let nextBlock = '';
    if (nextSessionStr) {
      nextBlock = `\n\n📅 *Next session:* ${nextSessionStr}`;
    }

    const carpoolSideNote = `\n\n🚗 _Side note: shukran to the parents who drove this week._`;
    const closing = `\n\n${getLockedClosing(patrolName)}`;

    return `${greeting}\n\n${header}\n${accomplishments}${nextBlock}${carpoolSideNote}${closing}`;
  }

  // ─────────────────────────────────────────────────────────
  // TEMPLATE B — Overnight Campout (Template B)
  // ─────────────────────────────────────────────────────────
  if (mode === 'campout' || mode === 'template_b' || mode === 'overnight') {
    const greeting = LOCKED_GREETING;
    const header = `📢 *${eventTitle} — Overnight*`;
    const purpose = customPurpose || event.description || 'A full weekend of outdoor skills, campfire tarbiyah, and advancement.';
    const whenStr = formatEventWhen(event.date, event.time, event.endDate || event.date, event.endTime || '11:00 AM');
    const whereStr = formatEventWhere(event.location);

    const detailsBlock = `📅 *When:* ${whenStr}\n📍 *Where:* ${whereStr}`;

    const defaultCampoutGear = 'Field Uniform (Class A) for travel\nActivity Uniform (Class B)\nSleeping bag and sleeping mat\nMess kit and water bottle\nRain jacket and warm layer\nToiletries and towel';
    const gearBlock = formatGearBlock(event.requiredItems || defaultCampoutGear);

    const defaultCampoutNotes = customNote || 'Meals provided from Friday dinner through Sunday breakfast\nDrop-off and pickup at 6514 Kinloch St.\nRain or shine unless a cancellation is posted in this group\nPermission slip must be submitted before departure';
    const noteBlock = formatNoteBlock(defaultCampoutNotes);

    const deadline = rsvpDeadline || event.registrationDeadline || 'Wednesday, 8:00 PM';
    const rsvpBlock = includeRsvpLink
      ? `🔗 *RSVP and permission slip by ${deadline}:*\n${appUrl}`
      : '';

    const carpoolSideNote = carpoolNote || '🚗 _Side note: reply in this group if you can drive scouts._';
    const questionsBlock = '📞 *Questions:* message any of the scout leaders directly.';
    const closing = getLockedClosing(patrolName);

    const blocks = [
      greeting,
      `${header}\n${purpose}`,
      detailsBlock,
      gearBlock,
      noteBlock,
      rsvpBlock,
      carpoolSideNote,
      questionsBlock,
      closing
    ].filter(Boolean);

    return blocks.join('\n\n');
  }

  // ─────────────────────────────────────────────────────────
  // TEMPLATE A — Standard Weekly Session / Reminder (Default)
  // ─────────────────────────────────────────────────────────
  const greeting = LOCKED_GREETING;
  
  let header = `📢 *${eventTitle} — Reminder*`;
  if (mode === 'urgent') {
    header = `📢 *${eventTitle} — Urgent Reminder*`;
  } else if (mode === 'rsvp') {
    header = `📢 *${eventTitle} — Attendance RSVP*`;
  } else if (mode === 'packing') {
    header = `📢 *${eventTitle} — Gear & Uniform Reminder*`;
  }

  // Single-sentence purpose
  let purpose = customPurpose;
  if (!purpose) {
    if (event.description && event.description.trim()) {
      purpose = applyIslamicTransliteration(event.description.trim().split('\n')[0]);
    } else {
      purpose = 'An evening focused on character building, scout skills, and youth development.';
    }
  }

  const whenStr = formatEventWhen(event.date, event.time);
  const whereStr = formatEventWhere(event.location);
  const detailsBlock = `📅 *When:* ${whenStr}\n📍 *Where:* ${whereStr}`;

  // Gear
  const defaultGear = event.requiredItems || 'Activity Uniform (Class B)';
  const gearBlock = formatGearBlock(defaultGear);

  // Optional Note
  const noteBlock = customNote ? formatNoteBlock(customNote) : (event.notes ? formatNoteBlock(event.notes) : '');

  // RSVP with deadline in label
  let deadline = rsvpDeadline || event.registrationDeadline || event.deadline;
  if (!deadline) {
    deadline = '5:00 PM today';
  }
  const rsvpBlock = includeRsvpLink
    ? (event.requiresRsvp === false
        ? `🔗 *Portal Link:*\n${appUrl}`
        : `🔗 *RSVP by ${deadline}:*\n${appUrl}`)
    : '';

  // Carpool side note
  const carpoolSideNote = carpoolNote || '🚗 _Side note: reply in this group if you can drive scouts tonight._';

  // Questions
  const questionsBlock = '📞 *Questions:* message any of the scout leaders directly.';

  // Closing
  const closing = getLockedClosing(patrolName);

  const blocks = [
    greeting,
    `${header}\n${purpose}`,
    detailsBlock,
    gearBlock,
    noteBlock,
    rsvpBlock,
    carpoolSideNote,
    questionsBlock,
    closing
  ].filter(Boolean);

  return blocks.join('\n\n');
}

/**
 * Backward-compatible wrapper
 */
export function formatKashafEventWhatsApp(event, optionsOrPatrol = '') {
  return generateEventReminderWhatsApp(event, optionsOrPatrol);
}

/**
 * Lesson Plan WhatsApp Briefing Generator (Rules 1-15)
 */
export function formatKashafLessonPlanWhatsApp(plan, patrolName = '') {
  if (!plan) return '';

  const titleFormatted = applyIslamicTransliteration(plan.title || 'Weekly Scouting Session').trim();
  const greeting = LOCKED_GREETING;
  const header = `📢 *${titleFormatted} — Lesson Plan Briefing*`;
  const purpose = 'Our weekly scouting session plan, skill objectives, and tarbiyah milestones.';

  const blocks = [greeting, `${header}\n${purpose}`];

  // Date block if present
  if (plan.date) {
    const whenStr = formatEventWhen(plan.date);
    if (whenStr) {
      blocks.push(`📅 *When:* ${whenStr}`);
    }
  }

  // Milestones & Activities
  if (plan.content && plan.content.trim()) {
    const rawLines = plan.content.split('\n').map(l => l.trim()).filter(Boolean);
    const bullets = rawLines.map(line => {
      const clean = line.replace(/^[-*•\d+.)]\s*/, '').trim();
      return `• ${applyIslamicTransliteration(clean)}`;
    });
    if (bullets.length > 0) {
      blocks.push(`🎯 *Session Milestones:*\n${bullets.join('\n')}`);
    }
  }

  // Faith & Akhlaq Focus
  if (plan.islamicPrep && plan.islamicPrep.trim()) {
    const prepClean = applyIslamicTransliteration(plan.islamicPrep.trim());
    blocks.push(`🕌 *Faith & Akhlāq Focus:*\n${prepClean}`);
  }

  // Curriculum Link (Bare link on own line)
  blocks.push(`🔗 *Portal Link:*\n${APP_PORTAL_URL}`);

  // Questions
  blocks.push('📞 *Questions:* message any of the scout leaders directly.');

  // Closing
  blocks.push(getLockedClosing(patrolName));

  return blocks.join('\n\n');
}

/**
 * Generic Raw Text Formatter strictly applying WhatsApp rules
 */
export function formatKashafMessage(rawText, patrolName = '', customPurpose = '', recipient = { type: 'parent', name: '' }) {
  const greeting = getKashafGreeting(recipient?.type || 'parent', recipient?.name || '');
  const cleanContent = applyIslamicTransliteration(rawText || '').trim();
  const closing = getLockedClosing(patrolName);

  const blocks = [greeting];
  if (customPurpose && customPurpose.trim()) {
    blocks.push(customPurpose.trim());
  }
  if (cleanContent) {
    blocks.push(cleanContent);
  }
  blocks.push(closing);

  return blocks.join('\n\n');
}

/**
 * Leader Onboarding & Credentials Message (Rule 4, 5, 14)
 */
export function generateLeaderInviteMessage({
  name = 'Leader',
  username = '',
  email = '',
  password = '',
  leaderPosition = 'Scout Leader',
  patrolName = '',
  appUrl = APP_PORTAL_URL
}) {
  const greeting = getKashafGreeting('leader', name);
  const patrolSig = formatPatrolSignature(patrolName);
  const cleanLogin = username || (email && !email.endsWith('@talia.app') ? email : (email ? email.split('@')[0] : 'username'));

  return `${greeting}

We are pleased to provide your leadership access credentials for the *Dhulfiqār Scouts Portal*:

📌 *Leadership Role:* ${leaderPosition || 'Scout Leader'}
🛡️ *Assigned Unit:* ${patrolSig}

🔗 *Portal Link:*
${appUrl}

👤 *Username:* ${cleanLogin}
🔑 *Temporary Password:* ${password}

📝 *Required Setup Checklist:*
• Log into the leadership portal using the link above.
• Go to *My Profile* to set your personal password and update contact details.
• Upload your current Youth Protection Training (YPT/SPT) certificate.
• Review your assigned patrol roster and attendance records.

📞 *Questions:* reach out to Troop Administration directly.

Jazākum Allāhu khayran for your leadership and dedication!
${patrolSig}
${TEAM_SIGNATURE}`;
}

/**
 * Scout Login & Onboarding Message (Rule 4, 5, 14)
 */
export function generateScoutInviteMessage({
  name = 'Scout',
  username = '',
  email = '',
  password = '',
  patrolName = '',
  appUrl = APP_PORTAL_URL
}) {
  const greeting = getKashafGreeting('scout', name);
  const patrolSig = formatPatrolSignature(patrolName);
  const cleanLogin = username || (email && !email.endsWith('@talia.app') ? email : (email ? email.split('@')[0] : 'username'));

  return `${greeting}

We are pleased to share the official portal login credentials for *${name}*:

🔗 *Portal Link:*
${appUrl}

👤 *Username:* ${cleanLogin}
🔑 *Temporary Password:* ${password}

📝 *Profile Setup Instructions:*
• Open the portal link above and log in with your credentials.
• Go to *My Profile* to change your temporary password to a secure personal password.
• Upload a clear scout profile photo.
• Review your rank requirements, merit badges, and attendance standing.

📞 *Questions:* message your patrol leadership directly.

Jazākum Allāhu khayran for your enthusiasm!
${patrolSig}
${TEAM_SIGNATURE}`;
}

/**
 * Parent Portal Invite Message (Rule 4, 5, 14)
 */
export function generateParentInviteMessage({
  name = 'Parents',
  email = '',
  username = '',
  password = '',
  patrolName = '',
  appUrl = APP_PORTAL_URL
}) {
  const greeting = getKashafGreeting('parent', name);
  const patrolSig = formatPatrolSignature(patrolName);
  const cleanLogin = username || (email && !email.endsWith('@talia.app') ? email : (email ? email.split('@')[0] : 'username'));

  return `${greeting}

We are pleased to provide your parent access credentials for the *Dhulfiqār Scouts Family Portal*:

🔗 *Portal Link:*
${appUrl}

👤 *Username:* ${cleanLogin}
🔑 *Temporary Password:* ${password}

📝 *Parent Portal Features:*
• Monitor real-time progress across BSA Ranks, Merit Badges, and Islamic Modules.
• Track attendance records, camping nights, and service hours.
• Submit event RSVPs and digital absence notices.
• Update family emergency contacts.

📞 *Questions:* message any of the scout leaders directly.

Jazākum Allāhu khayran for your continued support 🙏
${patrolSig}
${TEAM_SIGNATURE}`;
}

/**
 * Resolves high-visibility audience and targeting badge for any event
 */
export function getEventAudienceInfo(event, currentUser = {}, groups = [], linkedScouts = []) {
  if (!event) {
    return {
      type: 'troop',
      badge: '⚜️ All Scouts & Patrols (Troop-Wide)',
      label: 'Troop-Wide Event',
      icon: '⚜️',
      colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-black shadow-sm'
    };
  }

  const category = (event.category || event.eventType || '').toLowerCase();
  const title = (event.title || '').toLowerCase();
  const notes = (event.notes || event.description || '').toLowerCase();
  const targetGroupId = event.targetGroupId || event.groupId || 'all';

  if (
    category.includes('court of honor') || 
    category.includes('family') || 
    category.includes('ceremony') || 
    notes.includes('parent') || 
    notes.includes('family') || 
    notes.includes('potluck') || 
    title.includes('family') || 
    title.includes('court of honor')
  ) {
    return {
      type: 'family',
      badge: '👨‍👩‍👧 Family Event (Parents & Scouts)',
      label: 'Parents, Scouts, and Siblings are warmly invited to attend',
      icon: '👨‍👩‍👧',
      colorClass: 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-black shadow-sm'
    };
  }

  if (!targetGroupId || targetGroupId === 'all' || targetGroupId === 'troop' || event.pushToAllPatrols || event.isGlobalScope) {
    return {
      type: 'troop',
      badge: '⚜️ All Scouts & Patrols (Troop-Wide)',
      label: 'Open to all scouts across all Dhulfiqār patrol units',
      icon: '⚜️',
      colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-black shadow-sm'
    };
  }

  const group = (groups || []).find(g => g.id === targetGroupId);
  const groupName = group?.name || 'Patrol Unit';

  const userGroupId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
  const isUserPatrol = userGroupId === targetGroupId;
  const matchingLinkedScout = (linkedScouts || []).find(s => s.groupId === targetGroupId || s.patrolId === targetGroupId);

  if (isUserPatrol || matchingLinkedScout) {
    const scoutName = matchingLinkedScout ? (matchingLinkedScout.fullName || matchingLinkedScout.username) : null;
    return {
      type: 'patrol',
      badge: scoutName 
        ? `🛡️ ${groupName} Patrol (${scoutName}'s Patrol)` 
        : `🛡️ ${groupName} Patrol (Your Patrol)`,
      label: `Scheduled specifically for ${groupName} Patrol members`,
      icon: '🛡️',
      colorClass: 'bg-amber-500/25 text-amber-300 border-amber-500/70 font-black shadow-md'
    };
  }

  return {
    type: 'patrol',
    badge: `🛡️ ${groupName} Patrol Only`,
    label: `Scheduled specifically for ${groupName} Patrol`,
    icon: '🛡️',
    colorClass: 'bg-slate-800 text-slate-300 border-slate-700 font-bold'
  };
}

