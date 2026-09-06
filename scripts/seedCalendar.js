// scripts/seedCalendar.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocs, collection, writeBatch, serverTimestamp } from 'firebase/firestore';

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

function formatDateToISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateDateSequence(startDateStr, endDateStr, targetDayOfWeek) {
  const dates = [];
  const [sy, sm, sd] = startDateStr.split('-').map(Number);
  const [ey, em, ed] = endDateStr.split('-').map(Number);

  let current = new Date(sy, sm - 1, sd, 12, 0, 0);
  const end = new Date(ey, em - 1, ed, 12, 0, 0);

  while (current.getDay() !== targetDayOfWeek && current <= end) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    dates.push(formatDateToISO(current));
    current.setDate(current.getDate() + 7);
  }

  return dates;
}

export function generateScoutingYearSchedule() {
  const fridayDates = generateDateSequence('2026-10-02', '2027-06-25', 5);
  const tuesdayDates = generateDateSequence('2026-09-08', '2027-06-29', 2);
  const events = [];

  fridayDates.forEach(dateStr => {
    const cleanDate = dateStr.replace(/-/g, '');
    events.push({
      id: `event_${cleanDate}_1830`,
      title: 'Troop Meeting / Activity Session',
      eventType: 'meeting',
      category: 'meeting',
      date: dateStr,
      startTime: '18:30',
      endTime: '21:30',
      time: '6:30 PM – 9:30 PM',
      durationHours: 3,
      duration: '3 hrs',
      isStandalone: true,
      recurringPattern: 'weekly_friday',
      dayOfWeek: 'Friday',
      location: 'Troop Headquarters / Main Hall',
      description: 'Weekly Friday Standalone Troop Session / Skills & Activity Meeting (6:30 PM – 9:30 PM).',
      requiredItems: 'Complete Class A Field Uniform, Scout Handbook, Water Bottle, Pen & Notebook',
      createdBy: 'neoissa@gmail.com',
      createdByName: 'Scoutmaster Admin',
      pushToAllPatrols: true,
      isGlobalScope: true,
      targetGroupId: 'all',
      season: '2026-2027',
      createdAt: new Date().toISOString()
    });
  });

  tuesdayDates.forEach(dateStr => {
    const cleanDate = dateStr.replace(/-/g, '');
    events.push({
      id: `event_${cleanDate}_1830`,
      title: 'Troop Meeting / Activity Session',
      eventType: 'meeting',
      category: 'meeting',
      date: dateStr,
      startTime: '18:30',
      endTime: '21:30',
      time: '6:30 PM – 9:30 PM',
      durationHours: 3,
      duration: '3 hrs',
      isStandalone: true,
      recurringPattern: 'weekly_tuesday',
      dayOfWeek: 'Tuesday',
      location: 'Troop Headquarters / Main Hall',
      description: 'Weekly Tuesday Standalone Troop Session / Skills & Activity Meeting (6:30 PM – 9:30 PM).',
      requiredItems: 'Activity Uniform / Class B, Scout Handbook, Workshop Materials, Water Bottle',
      createdBy: 'neoissa@gmail.com',
      createdByName: 'Scoutmaster Admin',
      pushToAllPatrols: true,
      isGlobalScope: true,
      targetGroupId: 'all',
      season: '2026-2027',
      createdAt: new Date().toISOString()
    });
  });

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}

async function main() {
  console.log('🚀 Generating 2026-2027 Scouting Year Standalone Events...');
  const events = generateScoutingYearSchedule();
  console.log(`Total sessions generated: ${events.length}`);
  console.log(`- Friday Sessions: ${events.filter(e => e.recurringPattern === 'weekly_friday').length} (Oct 2, 2026 to Jun 25, 2027)`);
  console.log(`- Tuesday Sessions: ${events.filter(e => e.recurringPattern === 'weekly_tuesday').length} (Sep 8, 2026 to Jun 29, 2027)`);

  console.log('\nCommitting to Firestore collection: /events ...');
  const batch = writeBatch(db);
  for (const ev of events) {
    const docRef = doc(db, 'events', ev.id);
    batch.set(docRef, {
      ...ev,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
  }

  await batch.commit();
  console.log(`✅ Successfully seeded all ${events.length} standalone session documents into Firestore!`);

  const snap = await getDocs(collection(db, 'events'));
  console.log(`📅 Total events currently live in Firestore /events: ${snap.docs.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Failed to seed calendar events:', err);
  process.exit(1);
});
