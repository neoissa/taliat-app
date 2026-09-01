/**
 * KashafVoice v3.0 — The Kashaf Parent Messenger (General)
 * Role: Lead Community Communicator for the Kashaf parents.
 * Objective: Refine and reformat any raw text into a warm, faith-rooted, and highly readable WhatsApp message.
 */

// Helper to apply academic transliteration (ā, ī, ū, ʿ, ʾ) for all Islamic terms
export function applyIslamicTransliteration(text) {
  if (!text) return '';
  const map = [
    { regex: /\bAssalamu\s+Alaikum\b/gi, rep: 'Assalāmu ʿAlaykum' },
    { regex: /\bAssalamu\s+Alaykum\b/gi, rep: 'Assalāmu ʿAlaykum' },
    { regex: /\bSalam\b/gi, rep: 'Salām' },
    { regex: /\bQuran\b/gi, rep: 'Qurʾān' },
    { regex: /\bKoran\b/gi, rep: 'Qurʾān' },
    { regex: /\bAllah\b/gi, rep: 'Allāh' },
    { regex: /\bAhlulbayt\b/gi, rep: 'Ahl al-Bayt' },
    { regex: /\bAhlul\s+Bayt\b/gi, rep: 'Ahl al-Bayt' },
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
    { regex: /\bHusayn\b/gi, rep: 'Ḥusayn' },
    { regex: /\bHussain\b/gi, rep: 'Ḥusayn' },
    { regex: /\bHasan\b/gi, rep: 'Ḥasan' },
    { regex: /\bAbbas\b/gi, rep: 'ʿAbbās' },
    { regex: /\bZaynab\b/gi, rep: 'Zaynab' },
    { regex: /\bFatima\b/gi, rep: 'Fāṭimah' },
    { regex: /\bZahra\b/gi, rep: 'Zahrāʾ' },
    { regex: /\bKarbala\b/gi, rep: 'Karbalāʾ' },
    { regex: /\bAshura\b/gi, rep: 'ʿĀshūrāʾ' },
    { regex: /\bTawhid\b/gi, rep: 'Tawḥīd' },
    { regex: /\bNubuwwah\b/gi, rep: 'Nubuwwah' },
    { regex: /\bImamah\b/gi, rep: 'Imāmah' },
    { regex: /\bMahdi\b/gi, rep: 'Mahdī' },
    { regex: /\bHadith\b/gi, rep: 'Ḥadīth' },
    { regex: /\bDua\b/gi, rep: 'Duʿāʾ' },
    { regex: /\bDuas\b/gi, rep: 'Adʿiyah' },
    { regex: /\bZiyarat\b/gi, rep: 'Ziyārah' },
    { regex: /\bZiyarah\b/gi, rep: 'Ziyārah' },
    { regex: /\bTafsir\b/gi, rep: 'Tafsīr' },
    { regex: /\bSunnah\b/gi, rep: 'Sunnah' },
    { regex: /\bShia\b/gi, rep: 'Shīʿah' }
  ];

  let result = text;
  map.forEach(({ regex, rep }) => {
    result = result.replace(regex, rep);
  });
  return result;
}

/**
 * Generates a WhatsApp message for Lesson Plans following KashafVoice v3.0 rules.
 */
export function formatKashafLessonPlanWhatsApp(plan) {
  if (!plan) return '';

  // 2️⃣ GREETING (LOCKED - exactly two lines, followed by one blank line)
  const greeting = '🌿 Assalāmu ʿAlaykum dear parents,🌿\nHope you are all doing well 😊 ✨\n\n';

  // 3️⃣ MESSAGE BODY STRUCTURE
  const titleFormatted = applyIslamicTransliteration(plan.title || 'Weekly Scouting Session');
  let purposeLine = 'We wanted to share an update regarding our upcoming scouting session: *' + titleFormatted + '*';
  if (plan.date) {
    purposeLine += ' scheduled for *' + plan.date + '*.';
  } else {
    purposeLine += '.';
  }

  const bodyBlocks = [purposeLine];

  // Scouting Activities & Highlights
  if (plan.content && plan.content.trim()) {
    const rawLines = plan.content.split('\n').map(l => l.trim()).filter(Boolean);
    const activityBullets = [];
    rawLines.forEach(line => {
      const clean = line.replace(/^[-*•\d+.)]\s*/, '').trim();
      if (clean) {
        activityBullets.push(applyIslamicTransliteration(clean));
      }
    });

    if (activityBullets.length > 0) {
      const bulletsText = activityBullets.map(b => '🎯 ' + b).join('\n');
      bodyBlocks.push('📋 *Session Highlights & Activities:*\n' + bulletsText);
    }
  }

  // 4️⃣ QURʾĀN BLOCK (OPTIONAL)
  let quranBlock = '';
  if (plan.quranVerse || (plan.islamicPrep && plan.islamicPrep.includes('بِسْمِ اللَّهِ'))) {
    const verseText = plan.quranVerse || plan.islamicPrep;
    quranBlock = '\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' + verseText.trim() + '\nصَدَقَ اللَّهُ الْعَلِيُّ الْعَظِيمُ\n';
  }

  // Islamic Preparation (Tarbiyah / Akhlaq)
  if (plan.islamicPrep && plan.islamicPrep.trim() && !quranBlock) {
    const prepClean = applyIslamicTransliteration(plan.islamicPrep.trim());
    bodyBlocks.push('🕌 *Faith & Akhlāq Connection:*\n' + prepClean);
  }

  // Helpful Resources & Materials
  if (plan.resources && plan.resources.length > 0) {
    const cleanResources = plan.resources.filter(r => r.name && r.url);
    if (cleanResources.length > 0) {
      const resBullets = cleanResources.map(r => '🔗 ' + r.name + ': ' + r.url).join('\n');
      bodyBlocks.push('📚 *Helpful Materials:*\n' + resBullets);
    }
  }

  let body = bodyBlocks.join('\n\n');
  if (quranBlock) {
    body += '\n' + quranBlock;
  }

  // 5️⃣ CLOSING (LOCKED - exactly as shown, no bold, no extra lines)
  const closing = '\n\nJazākum Allāhu khayran for your continued support 🙏\n✨ May Allāh bless your families and efforts.✨\n⚜️ Dhulfiqār Scouts Team⚜️';

  return greeting + body + closing;
}

/**
 * Generates a WhatsApp message for Planned Events following KashafVoice v3.0 rules.
 */
export function formatKashafEventWhatsApp(event) {
  if (!event) return '';

  // 2️⃣ GREETING (LOCKED - exactly two lines, followed by one blank line)
  const greeting = '🌿 Assalāmu ʿAlaykum dear parents,🌿\nHope you are all doing well 😊 ✨\n\n';

  // 3️⃣ MESSAGE BODY STRUCTURE
  const titleFormatted = applyIslamicTransliteration(event.title || 'Scouting Event');
  const purposeLine = 'We are excited to share details regarding our upcoming event: *' + titleFormatted + '*!';

  const bodyBlocks = [purposeLine];

  // Event Logistics Block
  const logistics = [];
  if (event.date) logistics.push('📅 *Date:* ' + event.date);
  if (event.time) logistics.push('⏰ *Time:* ' + event.time);
  if (event.location) logistics.push('📍 *Location:* ' + event.location);
  if (logistics.length > 0) {
    bodyBlocks.push(logistics.join('\n'));
  }

  // Event Description / Program Details
  if (event.description && event.description.trim()) {
    const descClean = applyIslamicTransliteration(event.description.trim());
    bodyBlocks.push('📋 *Event Details & Program:*\n' + descClean);
  }

  // Packing List / Required Gear
  if (event.requiredItems && event.requiredItems.trim()) {
    const rawItems = event.requiredItems.split('\n').map(l => l.trim()).filter(Boolean);
    const itemBullets = rawItems.map(item => {
      const clean = item.replace(/^[-*•\d+.)]\s*/, '').trim();
      return '🎒 ' + clean;
    });
    bodyBlocks.push('🎒 *What to Bring / Required Gear:*\n' + itemBullets.join('\n'));
  }

  // 4️⃣ QURʾĀN BLOCK (OPTIONAL)
  let quranBlock = '';
  if (event.quranVerse && event.quranVerse.trim()) {
    quranBlock = '\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' + event.quranVerse.trim() + '\nصَدَقَ اللَّهُ الْعَلِيُّ الْعَظِيمُ\n';
  }

  let body = bodyBlocks.join('\n\n');
  if (quranBlock) {
    body += '\n' + quranBlock;
  }

  // 5️⃣ CLOSING (LOCKED)
  const closing = '\n\nJazākum Allāhu khayran for your continued support 🙏\n✨ May Allāh bless your families and efforts.✨\n⚜️ Dhulfiqār Scouts Team⚜️';

  return greeting + body + closing;
}
