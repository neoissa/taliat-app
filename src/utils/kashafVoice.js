/**
 * KashafVoice v4.0 — The Kashaf Parent Messenger (Shia Islamic Edition)
 * 
 * Role: Lead Community Communicator for the Kashaf parents.
 * Objective: Refine and reformat any raw text into a warm, Twelver Shia faith-rooted, and highly readable WhatsApp message.
 * 
 * 1️⃣ TONE & BEHAVIOR:
 * - Voice: Warm, community-centered, and respectful. Root all encouragement in the ethics (akhlāq) and values (tarbiyah) of the Ahl al-Bayt (ʿa). Never robotic or corporate.
 * - WhatsApp Native: Output strictly in WhatsApp format. Use asterisks for bolding (*text*), underscores for italics (_text_), and completely avoid Markdown headers (###).
 * - Logic: Do NOT ask for event details (date/time/location) unless they are already in the raw text. If they are missing, simply format the message based on the content provided.
 * - Transliteration: Use academic diacritics (ā, ī, ū, ʿ, ʾ) for all Islamic terms. Always affix appropriate honorifics for the Prophet Muḥammad (ṣ), the Ahl al-Bayt (ʿa), and Imam al-Mahdī (ʿaj).
 * 
 * 2️⃣ GREETING (LOCKED):
 * 🌿 Assalāmu ʿAlaykum dear parents,🌿
 * Hope you are all doing well 😊 ✨
 * (Exactly two lines. One blank line follows.)
 * 
 * 3️⃣ MESSAGE BODY STRUCTURE:
 * - Purpose Line: 1–2 lines max to set the context.
 * - Content Refinement: Break long paragraphs into short, 1–3 line "WhatsApp-style" blocks for easy reading on mobile.
 * - Structured Bullets (Optional): If the message contains list items, use one emoji per bullet and one bullet per line.
 * 
 * 4️⃣ QURʾĀN & HADITH BLOCK (OPTIONAL):
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 * [Arabic Text with full tashkīl]
 * [English translation ONLY if requested]
 * صَدَقَ اللَّهُ الْعَلِيُّ الْعَظِيمُ
 * 
 * 5️⃣ CLOSING (LOCKED):
 * *Jazākum Allāhu khayran for your continued support 🙏*
 * *✨ [Assigned Patrol Name (optional)] .✨*
 * *⚜️ Dhulfiqār Scouts Team⚜️*
 */

// Helper to apply academic transliteration (ā, ī, ū, ʿ, ʾ) and Twelver Shia honorifics
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
 * 2️⃣ ROLE-AWARE GREETING BUILDER
 * - Parent: "🌿 Assalāmu ʿAlaykum dear parents,🌿\nHope you are all doing well 😊 ✨"
 * - Leader: "🌿 Assalāmu ʿAlaykum dear Leader ${name},🌿\nHope you are doing well 😊 ✨"
 * - Scout: "🌿 Assalāmu ʿAlaykum dear Scout ${name},🌿\nHope you are doing well 😊 ✨"
 */
export function getKashafGreeting(roleOrType = 'parent', name = '') {
  const cleanName = name ? name.trim() : '';
  const type = (roleOrType || '').toLowerCase();
  
  if (type === 'parent' || type === 'parents') {
    return '🌿 Assalāmu ʿAlaykum dear parents,🌿\nHope you are all doing well 😊 ✨';
  }
  
  if (type === 'leader' || type === 'owner') {
    const leaderTitle = cleanName ? `dear Leader ${cleanName}` : 'dear Leader';
    return `🌿 Assalāmu ʿAlaykum ${leaderTitle},🌿\nHope you are doing well 😊 ✨`;
  }
  
  if (type === 'scout') {
    const scoutTitle = cleanName ? `dear Scout ${cleanName}` : 'dear Scout';
    return `🌿 Assalāmu ʿAlaykum ${scoutTitle},🌿\nHope you are doing well 😊 ✨`;
  }
  
  if (cleanName) {
    return `🌿 Assalāmu ʿAlaykum dear ${cleanName},🌿\nHope you are doing well 😊 ✨`;
  }
  
  return '🌿 Assalāmu ʿAlaykum dear parents,🌿\nHope you are all doing well 😊 ✨';
}

export const LOCKED_GREETING = `🌿 Assalāmu ʿAlaykum dear parents,🌿\nHope you are all doing well 😊 ✨`;

/**
 * 4️⃣ QURʾĀN & HADITH BLOCK (OPTIONAL)
 * Formats strictly with Bismillah, Tashkīl Arabic, optional English translation, and Sadaqallāh.
 */
export function formatIsolatedQuranBlock(arabic, translation = '') {
  let block = '\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n';
  if (arabic) block += `${arabic.trim()}\n`;
  if (translation) block += `"${translation.trim()}"\n`;
  block += 'صَدَقَ اللَّهُ الْعَلِيُّ الْعَظِيمُ';
  return block;
}

/**
 * 5️⃣ LOCKED CLOSING
 * Uses asterisks for WhatsApp bold on each line, no extra lines.
 * Only outputs the patrol line if a patrolName is explicitly provided.
 */
export function getLockedClosing(patrolName = '') {
  const patrolClean = patrolName && typeof patrolName === 'string' ? patrolName.trim() : '';
  const patrolLine = patrolClean ? `\n*✨ ${patrolClean} .✨*` : '';
    
  return `\n\n*Jazākum Allāhu khayran for your continued support 🙏*${patrolLine}\n*⚜️ Dhulfiqār Scouts Team⚜️*`;
}

/**
 * 6️⃣ DEDICATED LEADER ONBOARDING & SETUP MESSAGE GENERATOR
 */
export function generateLeaderInviteMessage({
  name = 'Leader',
  username = '',
  email = '',
  password = '',
  leaderPosition = 'Scout Leader',
  patrolName = '',
  appUrl = 'https://taliat-app.vercel.app/'
}) {
  const greeting = getKashafGreeting('leader', name);
  const patrolClosing = getLockedClosing(patrolName);
  const unitLine = patrolName && patrolName.trim() ? patrolName.trim() : 'Dhulfiqār Leadership HQ';
  const cleanLogin = username || (email && !email.endsWith('@talia.app') ? email : (email ? email.split('@')[0] : 'username'));
  
  return `${greeting}

We are pleased to provide your leadership access credentials and onboarding details for the *Dhulfiqār Scouts Portal*:

📌 *Leadership Role:* ${leaderPosition || 'Scout Leader'}
🛡️ *Assigned Unit / Patrol:* ${unitLine}

🔗 *Portal Link:* ${appUrl}
👤 *Username:* ${cleanLogin}
🔑 *Temporary Password:* ${password}

📌 *Required Leader Setup & Action Checklist:*
1. 📱 Log into the leadership portal using the link above.
2. 👤 Go to *"My Profile"* (👤) to set your secure personal password and update personal contact details.
3. 📜 Upload your profile photo and current *Youth Protection Training (YPT) / Safety Protection Training (SPT)* certificate.
4. 📋 Review and manage your assigned patrol roster, scout attendance records, and advancement verifications.

Jazākum Allāhu khayran for your leadership, dedication, and service to the youth!${patrolClosing}`;
}

/**
 * 7️⃣ DEDICATED SCOUT LOGIN & ONBOARDING MESSAGE GENERATOR
 */
export function generateScoutInviteMessage({
  name = 'Scout',
  username = '',
  email = '',
  password = '',
  patrolName = '',
  appUrl = 'https://taliat-app.vercel.app/'
}) {
  const greeting = getKashafGreeting('scout', name);
  const closing = getLockedClosing(patrolName);
  const cleanLogin = username || (email && !email.endsWith('@talia.app') ? email : (email ? email.split('@')[0] : 'username'));

  return `${greeting}

We wanted to share the official login credentials and onboarding access for *${name}* to the *Dhulfiqār Scouts Portal*:

🔗 *Portal Link:* ${appUrl}
👤 *Username:* ${cleanLogin}
🔑 *Temporary Password:* ${password}

📌 *Required Profile Setup Instructions:*
1. 📱 Open the app link above and log in with your credentials.
2. 👤 Go to *"My Profile"* (👤) from the navigation menu.
3. ⚙️ Please complete the following profile updates:
   • Change your temporary password to your own secure personal password.
   • Upload your clear scout profile picture / photo.
   • Fill in all required details (personal email, scout phone, parent contact, BSA Member ID, and emergency contact).

If you have any questions or need help logging in, reach out to your patrol leadership.${closing}`;
}

/**
 * 8️⃣ DEDICATED PARENT PORTAL INVITE MESSAGE GENERATOR
 */
export function generateParentInviteMessage({
  name = 'Parents',
  email = '',
  username = '',
  password = '',
  patrolName = '',
  appUrl = 'https://taliat-app.vercel.app/'
}) {
  const greeting = getKashafGreeting('parent', name);
  const closing = getLockedClosing(patrolName);
  const cleanLogin = username || (email && !email.endsWith('@talia.app') ? email : (email ? email.split('@')[0] : 'username'));

  return `${greeting}

We are pleased to provide your parent access credentials for the *Dhulfiqār Scouts Family Portal*:

🔗 *Portal Link:* ${appUrl}
👤 *Username:* ${cleanLogin}
🔑 *Temporary Password:* ${password}

📌 *Parent Portal Features & Instructions:*
1. 📱 Log into the portal using the link above.
2. 📊 Monitor real-time progress across all 7 BSA Ranks, Merit Badges, and Islamic Modules.
3. 📋 Track attendance records, camping nights, and service hours.
4. 📝 Access digital medical forms, waivers, and event RSVPs.
5. 👨‍👩‍👧 Manage family profile details and emergency contacts.${closing}`;
}

/**
 * Generates a warm, structured WhatsApp reminder or announcement message for Planned Events (KashafVoice v4.0).
 */
export function generateEventReminderWhatsApp(event, options = {}) {
  if (!event) return '';

  const opts = typeof options === 'string' ? { patrolName: options } : (options || {});
  const {
    patrolName = '',
    reminderType = 'general', // 'general' | 'urgent' | 'rsvp' | 'packing' | 'meeting'
    recipientType = 'parent', // 'parent' | 'leader' | 'scout'
    recipientName = '',
    customNote = '',
    includeRsvpLink = true,
    appUrl = 'https://taliat-app.vercel.app/'
  } = opts;

  const titleFormatted = applyIslamicTransliteration(event.title || 'Scouting Event');
  const greeting = getKashafGreeting(recipientType, recipientName);

  // Format date nicely (e.g. "Friday, Sep 18, 2026")
  let dateDisplay = event.date || '';
  if (event.date) {
    try {
      const dParts = event.date.split('-');
      if (dParts.length === 3) {
        const dObj = new Date(parseInt(dParts[0], 10), parseInt(dParts[1], 10) - 1, parseInt(dParts[2], 10));
        dateDisplay = dObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      dateDisplay = event.date;
    }
  }

  // Purpose line based on reminderType
  let purposeLine = '';
  if (reminderType === 'urgent') {
    purposeLine = `🚨 *Urgent Reminder: Upcoming Event Tomorrow / Tonight!*
We would like to remind all families about our upcoming *${titleFormatted}*.`;
  } else if (reminderType === 'rsvp') {
    purposeLine = `📝 *Action Needed: Attendance & RSVP Confirmation!*
Please confirm your scout's attendance and carpool seats for our upcoming *${titleFormatted}*.`;
  } else if (reminderType === 'packing') {
    purposeLine = `🎒 *Gear & Preparation Reminder: ${titleFormatted}*
Please review the required uniform and packing checklist for our upcoming session.`;
  } else {
    purposeLine = `📢 *Upcoming Scouting Session Reminder:*
We wanted to share a friendly reminder regarding our upcoming *${titleFormatted}*.`;
  }

  const blocks = [greeting, purposeLine];

  // Warm description in 1–3 line blocks
  if (event.description && event.description.trim()) {
    const descClean = applyIslamicTransliteration(event.description.trim());
    blocks.push(descClean);
  }

  // Islamic Occasion Note (if present)
  if (event.islamicOccasions && Array.isArray(event.islamicOccasions) && event.islamicOccasions.length > 0) {
    const occStr = event.islamicOccasions.join(', ');
    blocks.push(`🕌 *Islamic Milestone / Occasion:* ${applyIslamicTransliteration(occStr)}`);
  } else if (event.islamicOccasion && typeof event.islamicOccasion === 'string' && event.islamicOccasion.trim()) {
    blocks.push(`🕌 *Islamic Milestone / Occasion:* ${applyIslamicTransliteration(event.islamicOccasion.trim())}`);
  }

  // Structured event details (only if present in raw event)
  const details = [];
  if (dateDisplay) {
    const timeStr = event.time || (event.startTime && event.endTime ? `${event.startTime} – ${event.endTime}` : '');
    details.push(`📅 *Date:* ${dateDisplay}${timeStr ? ` at ${timeStr}` : ''}`);
  }
  if (event.location) details.push(`📍 *Location / Venue:* ${event.location}`);
  if (event.meetingPoint) details.push(`🚩 *Assembly / Meeting Point:* ${event.meetingPoint}`);
  if (event.registrationDeadline || event.deadline) {
    details.push(`⏳ *Registration / RSVP Deadline:* ${event.registrationDeadline || event.deadline}`);
  }

  if (details.length > 0) {
    blocks.push(details.join('\n'));
  }

  // Equipment Checklist (one emoji per bullet, one bullet per line)
  if (event.requiredItems && event.requiredItems.trim()) {
    const rawItems = event.requiredItems.split(/[\n;]+/).map(l => l.trim()).filter(Boolean);
    const itemBullets = rawItems.map(item => {
      const clean = item.replace(/^[-*•\d+.)]\s*/, '').trim();
      return `🎒 ${clean}`;
    });
    if (itemBullets.length > 0) {
      blocks.push(`*Required Gear & Packing Checklist:*\n${itemBullets.join('\n')}`);
    }
  }

  // Leader custom note
  if (customNote && customNote.trim()) {
    blocks.push(`📌 *Leader Note:*\n${applyIslamicTransliteration(customNote.trim())}`);
  }

  // RSVP Call to Action
  if (includeRsvpLink) {
    blocks.push(`🔗 *Portal Link & RSVPs:* ${appUrl}
_Please submit your RSVP and indicate if you can drive scouts in the carpool._`);
  }

  // Scriptural Block (Optional)
  let quranBlock = '';
  if (event.quranVerse && event.quranVerse.trim()) {
    quranBlock = formatIsolatedQuranBlock(event.quranVerse.trim(), event.quranTranslation || '');
  }

  let fullMsg = blocks.join('\n\n');
  if (quranBlock) {
    fullMsg += quranBlock;
  }

  return fullMsg + getLockedClosing(patrolName);
}

/**
 * Backward-compatible wrapper for formatKashafEventWhatsApp
 */
export function formatKashafEventWhatsApp(event, optionsOrPatrol = '') {
  return generateEventReminderWhatsApp(event, optionsOrPatrol);
}

/**
 * Generates a warm, structured WhatsApp message for Lesson Plans (KashafVoice v4.0).
 */
export function formatKashafLessonPlanWhatsApp(plan, patrolName = '') {
  if (!plan) return '';

  const titleFormatted = applyIslamicTransliteration(plan.title || 'Weekly Scouting Session');
  const greeting = LOCKED_GREETING;
  
  const dateStr = plan.date ? ` for *${plan.date}*` : '';
  const purposeLine = `Just a quick note to share our scouting lesson plan and tarbiyah milestones${dateStr}: *${titleFormatted}*.`;
  const blocks = [greeting, purposeLine];

  // Qur'an / Hadith Block
  let quranBlock = '';
  if (plan.quranVerse && plan.quranVerse.trim()) {
    quranBlock = formatIsolatedQuranBlock(plan.quranVerse.trim(), plan.quranTranslation || '');
  }

  // Milestones & Activities
  if (plan.content && plan.content.trim()) {
    const rawLines = plan.content.split('\n').map(l => l.trim()).filter(Boolean);
    const bullets = rawLines.map(line => {
      const clean = line.replace(/^[-*•\d+.)]\s*/, '').trim();
      return `🎯 ${applyIslamicTransliteration(clean)}`;
    });
    if (bullets.length > 0) {
      blocks.push(`*Session Milestones:*\n${bullets.join('\n')}`);
    }
  }

  // Faith & Akhlaq Focus
  if (plan.islamicPrep && plan.islamicPrep.trim() && !quranBlock) {
    const prepClean = applyIslamicTransliteration(plan.islamicPrep.trim());
    blocks.push(`🕌 *Faith & Akhlāq Focus:*\n${prepClean}`);
  }

  // Curriculum Materials
  if (plan.resources && plan.resources.length > 0) {
    const cleanResources = plan.resources.filter(r => r.name && r.url);
    if (cleanResources.length > 0) {
      const resBullets = cleanResources.map(r => `📚 *${r.name}:* ${r.url}`).join('\n');
      blocks.push(`*Curriculum Materials:*\n${resBullets}`);
    }
  }

  let fullMsg = blocks.join('\n\n');
  if (quranBlock) {
    fullMsg += quranBlock;
  }

  return fullMsg + getLockedClosing(patrolName);
}

/**
 * Refines any raw text into KashafVoice v4.0 WhatsApp format.
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
  
  return blocks.join('\n\n') + closing;
}

/**
 * Resolves high-visibility audience and targeting badge for any event
 * across Scout, Leader, Parent, and Admin roles.
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

  // 1. Family Event (Court of Honor / Potluck / Parent invited)
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

  // 2. Troop-Wide / All Patrols Event
  if (!targetGroupId || targetGroupId === 'all' || targetGroupId === 'troop' || event.pushToAllPatrols || event.isGlobalScope) {
    return {
      type: 'troop',
      badge: '⚜️ All Scouts & Patrols (Troop-Wide)',
      label: 'Open to all scouts across all Dhulfiqār patrol units',
      icon: '⚜️',
      colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-black shadow-sm'
    };
  }

  // 3. Patrol-Specific Event
  const group = (groups || []).find(g => g.id === targetGroupId);
  const groupName = group?.name || 'Patrol Unit';

  // Check if current user or any linked child belongs to this patrol
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

