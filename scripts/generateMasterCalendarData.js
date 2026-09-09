import * as XLSX from 'xlsx/xlsx.mjs';
import fs from 'fs';
import { parseMasterCalendarWorkbook } from '../src/utils/importCalendar.js';

const buf = fs.readFileSync('2026-27 Scout Year Calendar.xlsx');
const parsed = parseMasterCalendarWorkbook(buf);

const content = `/**
 * Pre-compiled Master 2026–27 Scouting Year Calendar Dataset
 * Generated from '2026–27 Scout Year Calendar.xlsx'
 * Total Ingestible Events: ${parsed.events.length}
 * Total Blackouts: ${parsed.blackouts.length}
 */

export const MASTER_CALENDAR_DATA = ${JSON.stringify(parsed, null, 2)};

export default MASTER_CALENDAR_DATA;
`;

fs.writeFileSync('src/data/masterCalendarData.js', content, 'utf8');
console.log('✅ Successfully generated src/data/masterCalendarData.js!');
console.log(`- Ingestible Events: ${parsed.events.length}`);
console.log(`- Blackouts / Closures: ${parsed.blackouts.length}`);
console.log(`- Tuesday Youth Programs: ${parsed.stats.tuesdayYouthPrograms}`);
console.log(`- Friday Scouting Programs: ${parsed.stats.fridayScoutingPrograms}`);
console.log(`- Leader Meetings: ${parsed.stats.leaderMeetings}`);
console.log(`- Camps & Retreats: ${parsed.stats.camps}`);
console.log(`- Islamic Occasions: ${parsed.stats.islamicOccasionsCount}`);
