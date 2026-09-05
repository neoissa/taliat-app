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
  password = '',
  leaderPosition = 'Scout Leader',
  patrolName = '',
  appUrl = 'https://taliat-app.vercel.app/'
}) {
  const greeting = getKashafGreeting('leader', name);
  const patrolClosing = getLockedClosing(patrolName);
  const unitLine = patrolName && patrolName.trim() ? patrolName.trim() : 'Dhulfiqār Leadership HQ';
  
  return `${greeting}

We are pleased to provide your leadership access credentials and onboarding details for the *Dhulfiqār Scouts Portal*:

📌 *Leadership Role:* ${leaderPosition || 'Scout Leader'}
🛡️ *Assigned Unit / Patrol:* ${unitLine}

🔗 *Portal Link:* ${appUrl}
👤 *Username:* ${username}
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
  password = '',
  patrolName = '',
  appUrl = 'https://taliat-app.vercel.app/'
}) {
  const greeting = getKashafGreeting('scout', name);
  const closing = getLockedClosing(patrolName);

  return `${greeting}

We wanted to share the official login credentials and onboarding access for *${name}* to the *Dhulfiqār Scouts Portal*:

🔗 *Portal Link:* ${appUrl}
👤 *Username:* ${username}
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

  return `${greeting}

We are pleased to provide your parent access credentials for the *Dhulfiqār Scouts Family Portal*:

🔗 *Portal Link:* ${appUrl}
👤 *Email / Username:* ${email || username}
🔑 *Temporary Password:* ${password}

📌 *Parent Portal Features & Instructions:*
1. 📱 Log into the portal using the link above.
2. 📊 Monitor real-time progress across all 7 BSA Ranks, Merit Badges, and Islamic Modules.
3. 📋 Track attendance records, camping nights, and service hours.
4. 📝 Access digital medical forms, waivers, and event RSVPs.
5. 👨‍👩‍👧 Manage family profile details and emergency contacts.${closing}`;
}

/**
 * Generates a warm, structured WhatsApp message for Planned Events (KashafVoice v4.0).
 */
export function formatKashafEventWhatsApp(event, patrolName = '') {
  if (!event) return '';

  const titleFormatted = applyIslamicTransliteration(event.title || 'Scouting Event');
  const greeting = LOCKED_GREETING;
  
  // 1–2 lines purpose context
  const purposeLine = `We wanted to share an update regarding our upcoming *${titleFormatted}*.`;
  const blocks = [greeting, purposeLine];

  // Warm description in 1–3 line blocks
  if (event.description && event.description.trim()) {
    const descClean = applyIslamicTransliteration(event.description.trim());
    blocks.push(descClean);
  }

  // Structured event details (only if present in raw event)
  const details = [];
  if (event.date) details.push(`📅 *Date:* ${event.date}${event.time ? ` at ${event.time}` : ''}`);
  if (event.location) details.push(`📍 *Location:* ${event.location}`);
  if (event.meetingPoint) details.push(`🚩 *Meeting Point:* ${event.meetingPoint}`);
  if (event.registrationDeadline || event.deadline) {
    details.push(`⏳ *Registration Deadline:* ${event.registrationDeadline || event.deadline}`);
  }

  if (details.length > 0) {
    blocks.push(details.join('\n'));
  }

  // Equipment Checklist (one emoji per bullet, one bullet per line)
  if (event.requiredItems && event.requiredItems.trim()) {
    const rawItems = event.requiredItems.split('\n').map(l => l.trim()).filter(Boolean);
    const itemBullets = rawItems.map(item => {
      const clean = item.replace(/^[-*•\d+.)]\s*/, '').trim();
      return `🎒 ${clean}`;
    });
    if (itemBullets.length > 0) {
      blocks.push(`*Packing Checklist:*\n${itemBullets.join('\n')}`);
    }
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
