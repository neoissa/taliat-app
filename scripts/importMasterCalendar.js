// scripts/importMasterCalendar.js
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, collection, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';
import { parseMasterCalendarWorkbook } from '../src/utils/importCalendar.js';

const firebaseConfig = {
  apiKey: "AIzaSyCpcSwYcwUQ_f7_0BgYtQzKxSMnsZ2e6CE",
  authDomain: "taliat-portal.firebaseapp.com",
  projectId: "taliat-portal",
  storageBucket: "taliat-portal.firebasestorage.app",
  messagingSenderId: "258276231531",
  appId: "1:258276231531:web:035f8c04d21a68f33ca42e",
  measurementId: "G-VQSJ9ZFKLY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 DHULFIQĀR SCOUT TROOP — 2026–2027 MASTER CALENDAR INGESTION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const filePath = '2026-27 Scout Year Calendar.xlsx';
  if (!fs.existsSync(filePath)) {
    throw new Error(`Master Excel calendar file not found at: ${filePath}`);
  }

  console.log(`📖 Ingesting '${filePath}'...`);
  const buf = fs.readFileSync(filePath);
  const parsed = parseMasterCalendarWorkbook(buf);

  console.log(`\n📊 Ingestion Statistics:`);
  console.log(`  • Total Raw Rows Analyzed: ${parsed.allParsedCount}`);
  console.log(`  • Ingestible Active Sessions: ${parsed.stats.totalIngestibleEvents}`);
  console.log(`  • Blackout Dates / Closures Filtered: ${parsed.stats.totalBlackouts}`);
  console.log(`  • Tuesday Youth Programs: ${parsed.stats.tuesdayYouthPrograms}`);
  console.log(`  • Friday Scouting Programs: ${parsed.stats.fridayScoutingPrograms}`);
  console.log(`  • Leader Executive Meetings: ${parsed.stats.leaderMeetings}`);
  console.log(`  • Multi-Day Camps & Retreats: ${parsed.stats.camps}`);
  console.log(`  • Special Troop Events: ${parsed.stats.specialEvents}`);
  console.log(`  • Islamic Milestones & Occasions: ${parsed.stats.islamicOccasionsCount}`);

  console.log('\n🔒 Leader Scoping Sample:');
  const leaderMeetingSample = parsed.events.find(e => e.eventType === 'leader_meeting');
  if (leaderMeetingSample) {
    console.log(`  - Title: "${leaderMeetingSample.title}" | Date: ${leaderMeetingSample.date} | Location: "${leaderMeetingSample.location}" | LeaderOnly: ${leaderMeetingSample.leaderOnly}`);
  }

  console.log('\n🏕️ Camp Multi-Day Sample:');
  const campSample = parsed.events.find(e => e.eventType === 'camp');
  if (campSample) {
    console.log(`  - Title: "${campSample.title}" | Date: ${campSample.date} | Location: "${campSample.location}" | Packing Items: ${campSample.packingList?.length || 0}`);
  }

  console.log('\n🚫 Blackout Sample:');
  const blackoutSample = parsed.blackouts[0];
  if (blackoutSample) {
    console.log(`  - Title: "${blackoutSample.title}" | Date: ${blackoutSample.date} | Notes: "${blackoutSample.rawNotes}"`);
  }

  console.log('\n💾 Committing to Firestore Collection: `/events` ...');

  const batchSize = 400;
  let count = 0;
  for (let i = 0; i < parsed.events.length; i += batchSize) {
    const chunk = parsed.events.slice(i, i + batchSize);
    const batch = writeBatch(db);

    chunk.forEach(ev => {
      const docRef = doc(db, 'events', ev.id);
      batch.set(docRef, {
        ...ev,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
    });

    await batch.commit();
    count += chunk.length;
    console.log(`  ✓ Committed chunk ${Math.floor(i / batchSize) + 1}: ${count} / ${parsed.events.length} documents.`);
  }

  console.log(`\n🎉 SUCCESS: All ${count} master calendar events successfully seeded into Firestore /events!`);

  const snap = await getDocs(collection(db, 'events'));
  console.log(`📅 Total live events currently in Firestore /events: ${snap.docs.length}\n`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Failed to ingest master calendar:', err);
  process.exit(1);
});
