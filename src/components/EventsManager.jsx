import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  ExternalLink, 
  CheckSquare, 
  Sparkles,
  Tent,
  Users,
  Compass,
  Hourglass,
  Car,
  Utensils,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Megaphone,
  RefreshCw,
  Zap,
  ListOrdered,
  AlertTriangle,
  Search,
  CheckCircle,
  History,
  CalendarDays,
  CheckSquare2,
  Layers,
  Printer,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Shield,
  User,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  ChevronRight,
  MessageCircle,
  Share2,
  Smartphone,
  Award,
  Trees,
  HeartHandshake,
  Flame,
  BookOpen,
  Target,
  Trophy
} from 'lucide-react';
import ConferenceCountdown from './ConferenceCountdown';
import AdminCalendarSync from './AdminCalendarSync';
import ScheduleParentMeetingModal from './ScheduleParentMeetingModal';
import { 
  formatKashafEventWhatsApp, 
  generateEventReminderWhatsApp, 
  applyIslamicTransliteration, 
  getEventAudienceInfo,
  getKashafGreeting
} from '../utils/kashafVoice';
import { dispatchParentNotification, dispatchScoutNotification, dispatchBulkScoutNotifications, dispatchPatrolStreamAlert } from '../utils/notificationPipeline';
import { 
  generateScoutingYearSchedule, 
  generateMonthSchedule, 
  generateRangeSchedule, 
  seedCalendarEventsList, 
  seedCalendarEvents, 
  deleteEventsBatch, 
  purgeGeneratedCalendarEvents, 
  RECURRING_SCHEDULE_CONFIG 
} from '../utils/calendarGenerator';
import { cancelMeetingByLeader } from '../services/parentRequestService';

// ── ACTIVITY CLASSIFICATION ENGINE CONSTANTS ──
export const EVENT_TYPES = [
  {
    id: 'scouting',
    label: 'Scouting Activity',
    icon: '🏕️',
    description: 'Outdoor adventures, hiking, fishing, sports, and scoutcraft',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    colorTheme: 'emerald'
  },
  {
    id: 'volunteering',
    label: 'Volunteering & Service',
    icon: '🤝',
    description: 'Community service, conservation, environmental cleanups, and credited service hours',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    colorTheme: 'amber'
  },
  {
    id: 'meeting',
    label: 'Troop / Patrol Meeting',
    icon: '📋',
    description: 'Weekly troop meetings, patrol leader council (PLC), and advancement sessions',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    colorTheme: 'blue'
  },
  {
    id: 'camp',
    label: 'Overnight Campout',
    icon: '⛺',
    description: 'Weekend camping, wilderness survival, camporees, and outdoor expeditions',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    colorTheme: 'sky'
  },
  {
    id: 'faith',
    label: 'Halqa & Faith Gathering',
    icon: '🕌',
    description: 'Islamic studies, spiritual halqas, Qur’an circles, and religious occasions',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    colorTheme: 'teal'
  },
  {
    id: 'ceremony',
    label: 'Court of Honor / Ceremony',
    icon: '🎖️',
    description: 'Rank advancement ceremonies, Eagle courts of honor, and troop awards',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    colorTheme: 'purple'
  }
];

export const ACTIVITY_SUBTYPES = {
  scouting: [
    { id: 'hiking', label: 'Hiking & Trail Trek', icon: '🥾' },
    { id: 'fishing', label: 'Fishing & Aquatics', icon: '🎣' },
    { id: 'sports', label: 'Sports & Athletics', icon: '⚽' },
    { id: 'knot_crafts', label: 'Pioneering & Rope Crafts', icon: '🪢' },
    { id: 'orienteering', label: 'Navigation & Orienteering', icon: '🧭' },
    { id: 'first_aid_drill', label: 'First Aid Drills & Simulation', icon: '🩹' },
    { id: 'campcraft', label: 'Campcraft & Cooking Skills', icon: '🍳' },
    { id: 'swimming', label: 'Swimming & Water Safety', icon: '🏊' },
    { id: 'shooting_sports', label: 'Archery & Marksmanship', icon: '🎯' },
    { id: 'other_scouting', label: 'General Scouting Activity', icon: '⚜️' }
  ],
  volunteering: [
    { id: 'community_service', label: 'Community Service Outreach', icon: '🤝' },
    { id: 'environmental_cleanup', label: 'Environmental & Trail Cleanup', icon: '🌲' },
    { id: 'food_drive', label: 'Food Drive & Distribution', icon: '🥫' },
    { id: 'masjid_service', label: 'Masjid Service & Maintenance', icon: '🕌' },
    { id: 'tree_planting', label: 'Tree Planting & Conservation', icon: '🌱' },
    { id: 'park_cleanup', label: 'Park & Public Space Cleanup', icon: '🏞️' },
    { id: 'elderly_support', label: 'Senior & Elder Assistance', icon: '👴' },
    { id: 'other_service', label: 'General Service Project', icon: '🤝' }
  ],
  service: [
    { id: 'community_service', label: 'Community Service Outreach', icon: '🤝' },
    { id: 'environmental_cleanup', label: 'Environmental & Trail Cleanup', icon: '🌲' },
    { id: 'food_drive', label: 'Food Drive & Distribution', icon: '🥫' },
    { id: 'masjid_service', label: 'Masjid Service & Maintenance', icon: '🕌' },
    { id: 'tree_planting', label: 'Tree Planting & Conservation', icon: '🌱' },
    { id: 'park_cleanup', label: 'Park & Public Space Cleanup', icon: '🏞️' },
    { id: 'elderly_support', label: 'Senior & Elder Assistance', icon: '👴' },
    { id: 'other_service', label: 'General Service Project', icon: '🤝' }
  ],
  meeting: [
    { id: 'weekly_patrol_session', label: 'Weekly Troop / Patrol Meeting', icon: '🏕️' },
    { id: 'leadership_meeting', label: 'Patrol Leaders Council (PLC)', icon: '👔' },
    { id: 'court_of_honor', label: 'Court of Honor & Advancement', icon: '🎖️' },
    { id: 'workshop', label: 'Merit Badge / Skill Workshop', icon: '💡' },
    { id: 'parent_orientation', label: 'Parent Orientation & Info Session', icon: '👨‍👩‍👧' },
    { id: 'other_meeting', label: 'General Troop Meeting', icon: '📋' }
  ],
  camp: [
    { id: 'overnight_campout', label: 'Overnight Weekend Campout', icon: '⛺' },
    { id: 'wilderness_survival', label: 'Wilderness Survival Expedition', icon: '🔥' },
    { id: 'camporee', label: 'District / Council Camporee', icon: '🚩' },
    { id: 'winter_camp', label: 'Winter Survival Camp', icon: '❄️' },
    { id: 'other_camp', label: 'General Outdoor Camp', icon: '⛺' }
  ],
  campout: [
    { id: 'overnight_campout', label: 'Overnight Weekend Campout', icon: '⛺' },
    { id: 'wilderness_survival', label: 'Wilderness Survival Expedition', icon: '🔥' },
    { id: 'camporee', label: 'District / Council Camporee', icon: '🚩' },
    { id: 'winter_camp', label: 'Winter Survival Camp', icon: '❄️' },
    { id: 'other_camp', label: 'General Outdoor Camp', icon: '⛺' }
  ],
  faith: [
    { id: 'halqa', label: 'Youth Islamic Halqa', icon: '🕌' },
    { id: 'quran_study', label: 'Qur’an Study & Tajweed Circle', icon: '📖' },
    { id: 'tahajjud_night', label: 'Tahajjud & Spiritual Night Program', icon: '🌙' },
    { id: 'interfaith_outreach', label: 'Interfaith Dialogue & Goodwill', icon: '🕊️' },
    { id: 'other_faith', label: 'General Faith Gathering', icon: '🕌' }
  ],
  ceremony: [
    { id: 'court_of_honor', label: 'Court of Honor & Rank Badges', icon: '🎖️' },
    { id: 'eagle_ceremony', label: 'Eagle Scout Court of Honor', icon: '🦅' },
    { id: 'investiture', label: 'Investiture & Promise Ceremony', icon: '⚜️' },
    { id: 'other_ceremony', label: 'Special Troop Ceremony', icon: '🎖️' }
  ]
};

export const SERVICE_HOURS_PRESETS = [1, 2, 3, 4, 6, 8];

export function getActivityClassification(ev) {
  if (!ev) {
    return {
      eventType: 'meeting',
      typeLabel: 'Troop Meeting',
      typeIcon: '📋',
      subtype: 'weekly_patrol_session',
      subtypeLabel: 'Weekly Meeting',
      subtypeIcon: '🏕️',
      isService: false,
      serviceHoursCredited: 0,
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };
  }

  // 1. Resolve primary eventType
  let primaryType = ev.eventType || ev.category || 'meeting';
  if (primaryType === 'campout') primaryType = 'camp';
  if (primaryType === 'service_project') primaryType = 'volunteering';

  // 2. Resolve subtype
  let subtype = ev.activitySubtype || '';
  if (!subtype) {
    const lowerTitle = (ev.title || '').toLowerCase();
    const lowerDesc = (ev.description || '').toLowerCase();
    const combined = `${lowerTitle} ${lowerDesc}`;
    
    if (combined.includes('hik') || combined.includes('trail')) subtype = 'hiking';
    else if (combined.includes('fish')) subtype = 'fishing';
    else if (combined.includes('sport') || combined.includes('soccer') || combined.includes('basket')) subtype = 'sports';
    else if (combined.includes('clean') || combined.includes('litter') || combined.includes('trash')) subtype = 'environmental_cleanup';
    else if (combined.includes('food') || combined.includes('pantry')) subtype = 'food_drive';
    else if (combined.includes('tree') || combined.includes('plant')) subtype = 'tree_planting';
    else if (combined.includes('masjid') || combined.includes('mosque')) subtype = 'masjid_service';
    else if (combined.includes('knot') || combined.includes('pioneer') || combined.includes('lash')) subtype = 'knot_crafts';
    else if (combined.includes('first aid') || combined.includes('cpr') || combined.includes('drill')) subtype = 'first_aid_drill';
    else if (combined.includes('orient') || combined.includes('compass') || combined.includes('navigat')) subtype = 'orienteering';
    else if (combined.includes('court of honor') || combined.includes('advancement')) subtype = 'court_of_honor';
    else if (combined.includes('halqa') || combined.includes('quran') || combined.includes('spiritual')) subtype = 'halqa';
    else if (combined.includes('camp') || combined.includes('survival') || combined.includes('tents')) subtype = 'overnight_campout';
    else if (primaryType === 'scouting') subtype = 'hiking';
    else if (primaryType === 'volunteering' || primaryType === 'service') subtype = 'community_service';
    else if (primaryType === 'faith') subtype = 'halqa';
    else if (primaryType === 'camp') subtype = 'overnight_campout';
    else subtype = 'weekly_patrol_session';
  }

  const typeCfg = EVENT_TYPES.find(t => t.id === primaryType) || {
    id: primaryType,
    label: primaryType.charAt(0).toUpperCase() + primaryType.slice(1),
    icon: '📅',
    badgeClass: 'bg-slate-700 text-slate-200 border-slate-600'
  };

  const subtypeList = ACTIVITY_SUBTYPES[primaryType] || ACTIVITY_SUBTYPES[ev.category] || [];
  const foundSubtype = subtypeList.find(s => s.id === subtype);
  const subtypeLabel = foundSubtype ? foundSubtype.label : (subtype.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  const subtypeIcon = foundSubtype ? foundSubtype.icon : (typeCfg.icon || '📌');

  const isService = primaryType === 'volunteering' || primaryType === 'service' || subtype.includes('service') || subtype.includes('cleanup') || subtype.includes('food_drive');
  const serviceHours = Number(ev.serviceHoursCredited || (isService && ev.durationHours ? ev.durationHours : 0)) || 0;

  return {
    eventType: primaryType,
    typeLabel: typeCfg.label,
    typeIcon: typeCfg.icon,
    subtype,
    subtypeLabel,
    subtypeIcon,
    isService,
    serviceHoursCredited: serviceHours,
    badgeClass: typeCfg.badgeClass
  };
}

// ── TIME RANGE SELECTOR HELPERS ──
export function formatTime12h(time24) {
  if (!time24 || typeof time24 !== 'string') return '';
  const parts = time24.trim().split(':');
  if (parts.length < 2) return time24;
  let h = parseInt(parts[0], 10);
  const m = parts[1].padStart(2, '0');
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function parseTimeTo24h(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '10:00';
  const str = timeStr.trim();
  const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = match12[2];
    const ampm = (match12[3] || '').toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
  }
  return '10:00';
}

export function calculateDuration(start24, end24) {
  if (!start24 || !end24) return '';
  const [sH, sM] = start24.split(':').map(Number);
  const [eH, eM] = end24.split(':').map(Number);
  if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) return '';
  
  let diffMinutes = (eH * 60 + eM) - (sH * 60 + sM);
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // Crosses midnight
  }
  if (diffMinutes === 0) return '0 min';
  
  const hrs = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${mins} min${mins > 1 ? 's' : ''}`;
}

export function getEventDisplayDuration(ev) {
  if (!ev) return '';

  // 1. If start and end time exist in 24h format (e.g. "19:15" and "20:30")
  if (ev.startTime && ev.endTime) {
    const dur = calculateDuration(ev.startTime, ev.endTime);
    if (dur) return dur;
  }

  // 2. If time string is a valid range (e.g. "7:15 PM – 8:30 PM" or "7:00 PM – 8:15 PM")
  if (ev.time) {
    const parsed = parseTimeRange(ev.time);
    if (parsed && parsed.start && parsed.end && !parsed.isCustom) {
      const dur = calculateDuration(parsed.start, parsed.end);
      if (dur) return dur;
    }
  }

  // 3. If explicit duration string is provided on doc
  if (ev.duration && typeof ev.duration === 'string') {
    return ev.duration;
  }

  // 4. Fallback to numeric durationHours
  if (typeof ev.durationHours === 'number' && ev.durationHours > 0) {
    if (ev.durationHours === 1.25) return '1h 15m';
    if (ev.durationHours === 1.5) return '1h 30m';
    if (ev.durationHours === 2.5) return '2h 30m';
    if (ev.durationHours === 3.5) return '3h 30m';
    return `${ev.durationHours} hr${ev.durationHours > 1 ? 's' : ''}`;
  }

  return '';
}

export function parseTimeRange(rangeStr) {
  if (!rangeStr || typeof rangeStr !== 'string') {
    return { start: '10:00', end: '14:00', isAllDay: false, isCustom: false };
  }
  const trimmed = rangeStr.trim();
  if (/^all[\s-]?day$/i.test(trimmed)) {
    return { start: '09:00', end: '17:00', isAllDay: true, isCustom: false };
  }
  const parts = trimmed.split(/\s*[–—\-]\s*/);
  if (parts.length === 2) {
    const s24 = parseTimeTo24h(parts[0]);
    const e24 = parseTimeTo24h(parts[1]);
    return { start: s24, end: e24, isAllDay: false, isCustom: false };
  }
  return { start: '10:00', end: '14:00', isAllDay: false, isCustom: true };
}

export const SCOUT_TIME_PRESETS = [
  { id: 'friday_session', label: '🏕️ Friday Weekly Meeting', start: '18:30', end: '21:30', desc: '6:30 PM – 9:30 PM (3 hrs)' },
  { id: 'tuesday_session', label: '🕌 Tuesday Youth Program', start: '19:15', end: '20:30', desc: '7:15 PM – 8:30 PM (1h 15m)' },
  { id: 'workshop', label: '🛠️ Weekend Workshop', start: '10:00', end: '14:00', desc: '10:00 AM – 2:00 PM (4 hrs)' },
  { id: 'day_hike', label: '🥾 Morning Day Hike', start: '08:30', end: '13:00', desc: '8:30 AM – 1:00 PM (4.5 hrs)' },
  { id: 'ceremony', label: '🎖️ Court of Honor', start: '17:00', end: '19:30', desc: '5:00 PM – 7:30 PM (2.5 hrs)' },
  { id: 'all_day', label: '🌅 All Day Campout', start: '08:00', end: '18:00', isAllDay: true, desc: 'All Day Event' }
];

export const STANDARD_GEAR_OPTIONS = [
  { id: 'class_a', label: 'Complete Class A Field Uniform', icon: '👔', category: 'uniform' },
  { id: 'class_b', label: 'Activity Uniform (Class B Shirt)', icon: '👕', category: 'uniform' },
  { id: 'handbook', label: 'Scout Handbook', icon: '📖', category: 'essentials' },
  { id: 'pen_notebook', label: 'Pen & Notebook', icon: '📝', category: 'essentials' },
  { id: 'water_bottle', label: 'Refillable Water Bottle (32oz+)', icon: '💧', category: 'essentials' },
  { id: 'sleeping_bag', label: 'Warm Sleeping Bag & Ground Pad', icon: '🛏️', category: 'camping' },
  { id: 'tent_tarp', label: 'Ground Tarp / Tent', icon: '⛺', category: 'camping' },
  { id: 'mess_kit', label: 'Mess Kit & Cutlery', icon: '🍽️', category: 'camping' },
  { id: 'flashlight', label: 'Flashlight or Headlamp with Extra Batteries', icon: '🔦', category: 'tools' },
  { id: 'first_aid', label: 'Personal First Aid Kit', icon: '🩹', category: 'tools' },
  { id: 'pocket_knife', label: "Pocket Knife (Totin' Chip)", icon: '🔪', category: 'tools' },
  { id: 'hiking_boots', label: 'Sturdy Hiking Boots & Wool Socks', icon: '🥾', category: 'outdoor' },
  { id: 'rain_gear', label: 'Rain Jacket / Weather Layering', icon: '🧥', category: 'outdoor' },
  { id: 'prayer_rug', label: 'Prayer Rug / Turbah / Small Compass', icon: '🧭', category: 'faith' },
  { id: 'work_gloves', label: 'Heavy Duty Work Gloves', icon: '🧤', category: 'tools' },
  { id: 'sun_bug', label: 'Sunscreen & Insect Repellent', icon: '☀️', category: 'outdoor' }
];

export default function EventsManager({ currentUser, onNavigate, linkedScouts: propsLinkedScouts = [] }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;
  const isLeader = currentUser?.role === 'leader' || isOwner || isExecutive;
  const isParent = currentUser?.role === 'parent';
  const isScout = !isLeader && !isParent;

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [linkedScouts, setLinkedScouts] = useState(propsLinkedScouts || []);

  // Listen to linked scouts for parents if not passed as prop
  useEffect(() => {
    if (propsLinkedScouts && propsLinkedScouts.length > 0) {
      setLinkedScouts(propsLinkedScouts);
      return;
    }
    if (!isParent || !currentUser?.uid) return;
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      const linkedIds = currentUser.linkedScoutIds || [];
      const matching = allUsers.filter(u => {
        if (u.role !== 'scout') return false;
        if (linkedIds.includes(u.uid)) return true;
        if (Array.isArray(u.parentUids) && u.parentUids.includes(currentUser.uid)) return true;
        if (currentUser.email && u.parentEmail && u.parentEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return true;
        return false;
      });
      setLinkedScouts(matching);
    });
    return () => unsubUsers();
  }, [isParent, currentUser, propsLinkedScouts]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ── WHATSAPP REMINDER GENERATOR STATE ──
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappModalEvent, setWhatsappModalEvent] = useState(null);
  const [whatsappReminderType, setWhatsappReminderType] = useState('general'); // 'general' | 'urgent' | 'rsvp' | 'packing'
  const [whatsappPatrolId, setWhatsappPatrolId] = useState('all');
  const [whatsappCustomNote, setWhatsappCustomNote] = useState('');
  const [whatsappIncludeRsvpLink, setWhatsappIncludeRsvpLink] = useState(true);
  const [whatsappRecipientType, setWhatsappRecipientType] = useState('parent'); // 'parent' | 'scout' | 'leader'
  const [whatsappRecipientName, setWhatsappRecipientName] = useState('');
  const [whatsappRecipientPhone, setWhatsappRecipientPhone] = useState('');
  const [whatsappLiveText, setWhatsappLiveText] = useState('');
  const [whatsappCopiedToast, setWhatsappCopiedToast] = useState(false);

  // Users & Global RSVPs Collections
  const [users, setUsers] = useState([]);
  const [globalRsvps, setGlobalRsvps] = useState([]);

  // RSVPs Map: { [eventId]: { [scoutOrParentUid]: rsvpData } }
  const [eventRsvps, setEventRsvps] = useState({});

  // ── Leader Attendee Filter & Controls State ──
  const [rsvpFilterTab, setRsvpFilterTab] = useState('all'); // 'all' | 'attending' | 'tentative' | 'not_attending' | 'pending'
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');
  const [leaderUpdatingRsvp, setLeaderUpdatingRsvp] = useState(false);
  const [leaderRsvpMsg, setLeaderRsvpMsg] = useState('');
  const [showPrintRosterModal, setShowPrintRosterModal] = useState(false);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);

  // ── TIME HORIZON TABS: 'upcoming' | 'past' | 'all' ──
  const [timeHorizon, setTimeHorizon] = useState('upcoming');

  // Category Filtering & Search
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'standalone' | 'scouting' | 'volunteering' | 'camp' | 'faith' | 'meeting'
  const [searchQuery, setSearchQuery] = useState('');

  // Event Creator Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('6:30 PM – 9:30 PM');
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('21:30');
  const [timeMode, setTimeMode] = useState('picker'); // 'picker' | 'presets' | 'custom'
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('Highview Elementary School (Troop Headquarters)');
  const [eventType, setEventType] = useState('scouting'); // 'scouting' | 'volunteering' | 'meeting' | 'camp' | 'faith' | 'ceremony'
  const [activitySubtype, setActivitySubtype] = useState('hiking');
  const [customSubtypeText, setCustomSubtypeText] = useState('');
  const [serviceHoursCredited, setServiceHoursCredited] = useState(0);
  const [requiresRsvp, setRequiresRsvp] = useState(true);
  const [category, setCategory] = useState('meeting'); // 'campout' | 'meeting' | 'service' | 'faith' | 'ceremony'
  const [description, setDescription] = useState('');
  const [requiredItems, setRequiredItems] = useState('Complete Class A Field Uniform, Scout Handbook, Water Bottle, Pen & Notebook');
  const [quranVerse, setQuranVerse] = useState('');
  const [groups, setGroups] = useState([]);
  const [targetGroupId, setTargetGroupId] = useState(isExecutive ? 'all' : (currentUser?.groupId || 'all'));

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // ── MULTI-SELECT BATCH DELETE STATE ──
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // ── RECURRING CALENDAR GENERATOR STATE ──
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showMasterSyncModal, setShowMasterSyncModal] = useState(false);
  const [generatorTab, setGeneratorTab] = useState('overview'); // 'overview' | 'preview'
  const [generatorMode, setGeneratorMode] = useState('upcoming_month'); // 'upcoming_month' | 'custom_month' | 'next_4_weeks' | 'full_season'
  
  // Default to upcoming/current month
  const initialDate = new Date();
  const [generatorYear, setGeneratorYear] = useState(initialDate.getFullYear());
  const [generatorMonth, setGeneratorMonth] = useState(initialDate.getMonth() + 1); // 1-12
  const [generatorIncludeFriday, setGeneratorIncludeFriday] = useState(true);
  const [generatorIncludeTuesday, setGeneratorIncludeTuesday] = useState(true);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [generatorProgress, setGeneratorProgress] = useState(null);
  const [generatorSuccessMsg, setGeneratorSuccessMsg] = useState('');
  const [generatorError, setGeneratorError] = useState('');
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewFilter, setPreviewFilter] = useState('all'); // 'all' | 'friday' | 'tuesday'

  // Parent / Scout RSVP Form State
  const [rsvpStatus, setRsvpStatus] = useState('attending'); // 'attending' | 'not_attending' | 'tentative'
  const [rsvpDietary, setRsvpDietary] = useState('');
  const [rsvpDriverAvailable, setRsvpDriverAvailable] = useState(false);
  const [rsvpSeats, setRsvpSeats] = useState(0);
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpSuccessMsg, setRsvpSuccessMsg] = useState('');

  // 1. Subscribe to users collection for roster resolution
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    }, (err) => console.warn("EventsManager users listener:", err));
    return () => unsubUsers();
  }, []);

  // 2. Subscribe to global event_rsvps collection for all events
  useEffect(() => {
    const unsubGlobalRsvps = onSnapshot(collection(db, 'event_rsvps'), (snap) => {
      setGlobalRsvps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("EventsManager globalRsvps listener:", err));
    return () => unsubGlobalRsvps();
  }, []);

  // 3. Subscribe to events collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter scoped to patrol if regular leader
      if (!isExecutive && currentUser?.groupId) {
        list = list.filter(ev => ev.targetGroupId === 'all' || ev.targetGroupId === currentUser.groupId || !ev.targetGroupId);
      }

      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEvents(list);
      setLoading(false);
    }, (err) => {
      console.error("Failed to load events:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [isExecutive, currentUser?.groupId]);

  // 4. Subscribe to groups for leader filter & patrol badge resolution across all user roles
  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    return () => unsubGroups();
  }, []);

  // 5. Subscribe to RSVPs for the selected event subcollection
  useEffect(() => {
    if (!selectedEvent?.id) return;
    const unsubRsvp = onSnapshot(collection(db, 'events', selectedEvent.id, 'rsvps'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setEventRsvps(prev => ({ ...prev, [selectedEvent.id]: map }));
    });
    return () => unsubRsvp();
  }, [selectedEvent?.id]);

  // 6. Subscribe to Confirmed Parent Conferences
  const [confirmedConferences, setConfirmedConferences] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'parent_requests'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => r.requestType === 'meeting_request' && r.status === 'confirmed');
      
      const matching = list.filter(r => {
        if (isParent) {
          if (r.parentUid === currentUser?.uid) return true;
          if (currentUser?.email && r.parentEmail && r.parentEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return true;
          if (linkedScouts.some(s => s.uid === r.scoutId || s.id === r.scoutId || s.fullName === r.scoutName)) return true;
          return false;
        }
        if (!isExecutive && currentUser?.groupId) {
          if (r.targetLeaderUid === currentUser?.uid || r.confirmedByUid === currentUser?.uid) return true;
          if (r.patrolId && (r.patrolId === currentUser.groupId || r.patrolName === currentUser.assignedPatrol)) return true;
          return false;
        }
        return true;
      });

      matching.sort((a, b) => new Date(a.confirmedDate || '9999-12-31') - new Date(b.confirmedDate || '9999-12-31'));
      setConfirmedConferences(matching);
    }, (err) => console.warn("EventsManager parent_requests listener:", err));

    return () => unsub();
  }, [isParent, isExecutive, currentUser, linkedScouts]);

  const [cancellingConfId, setCancellingConfId] = useState(null);

  const handleCancelConference = async (conf) => {
    const confId = conf.id || conf.requestId;
    if (!window.confirm(`Are you sure you want to cancel and remove the conference for ${conf.scoutName || 'this scout'} on ${conf.confirmedDate}? This will remove it from the schedule immediately.`)) {
      return;
    }
    try {
      setCancellingConfId(confId);
      await cancelMeetingByLeader({
        requestId: confId,
        leaderUid: currentUser?.uid,
        leaderName: currentUser?.fullName || currentUser?.username || 'Troop Leader',
        leaderRole: currentUser?.role || 'Leader',
        cancelReason: 'Cancelled by troop leader.',
        parentUid: conf.parentUid || null,
        parentEmail: conf.parentEmail || null,
        scoutName: conf.scoutName || 'Scout Member',
        meetingTopic: conf.meetingTopic || 'Leader Conference',
        removeDoc: true
      });
    } catch (err) {
      console.error("Failed to cancel conference:", err);
      alert("Failed to cancel conference: " + err.message);
    } finally {
      setCancellingConfId(null);
    }
  };

  // Sync existing RSVP if user already submitted
  useEffect(() => {
    if (selectedEvent && currentUser?.uid) {
      const currentRsvp = eventRsvps[selectedEvent.id]?.[currentUser.uid];
      if (currentRsvp) {
        setRsvpStatus(currentRsvp.status || 'attending');
        setRsvpDietary(currentRsvp.dietary || '');
        setRsvpDriverAvailable(!!currentRsvp.driverAvailable);
        setRsvpSeats(currentRsvp.seats || 0);
        setRsvpNotes(currentRsvp.notes || '');
      } else {
        setRsvpStatus('attending');
        setRsvpDietary('');
        setRsvpDriverAvailable(false);
        setRsvpSeats(0);
        setRsvpNotes('');
      }
    }
  }, [selectedEvent, currentUser?.uid, eventRsvps]);



  // Current selected month label for Generator
  const currentMonthLabel = useMemo(() => {
    return new Date(generatorYear, generatorMonth - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [generatorYear, generatorMonth]);

  // Dynamic Generator Schedule calculated on the fly
  const targetGeneratedSchedule = useMemo(() => {
    if (generatorMode === 'full_season') {
      return generateScoutingYearSchedule();
    }
    if (generatorMode === 'next_4_weeks') {
      const start = todayStr;
      const endD = new Date();
      endD.setDate(endD.getDate() + 28);
      const end = endD.toISOString().split('T')[0];
      return generateRangeSchedule({
        startDate: start,
        endDate: end,
        includeFriday: generatorIncludeFriday,
        includeTuesday: generatorIncludeTuesday
      });
    }
    // 'upcoming_month' or 'custom_month'
    return generateMonthSchedule(generatorYear, generatorMonth, {
      includeFriday: generatorIncludeFriday,
      includeTuesday: generatorIncludeTuesday
    });
  }, [generatorMode, generatorYear, generatorMonth, generatorIncludeFriday, generatorIncludeTuesday, todayStr]);

  // Map of existing IDs in Firestore for sync check
  const existingEventIdMap = useMemo(() => {
    const map = new Set();
    events.forEach(ev => map.add(ev.id));
    return map;
  }, [events]);

  // Standalone session stats
  const standaloneStats = useMemo(() => {
    const standaloneEvents = events.filter(e => e.isStandalone);
    const fridayCount = events.filter(e => e.isStandalone && (e.recurringPattern === 'weekly_friday' || new Date(e.date + 'T12:00:00').getDay() === 5)).length;
    const tuesdayCount = events.filter(e => e.isStandalone && (e.recurringPattern === 'weekly_tuesday' || new Date(e.date + 'T12:00:00').getDay() === 2)).length;
    const customCount = events.filter(e => !e.isStandalone).length;
    
    const upcomingCount = events.filter(e => (e.date || '') >= todayStr).length;
    const pastCount = events.filter(e => (e.date || '') < todayStr).length;

    return {
      totalStandalone: standaloneEvents.length,
      fridayCount,
      tuesdayCount,
      customCount,
      upcomingCount,
      pastCount
    };
  }, [events, todayStr]);

  // Split and filter events based on Time Horizon + Subcategory + Search
  const filteredEvents = useMemo(() => {
    let list = [...events];

    // 1. Time Horizon Filter
    if (timeHorizon === 'upcoming') {
      list = list.filter(ev => (ev.date || '') >= todayStr);
      // Sort upcoming ascending (nearest first)
      list.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    } else if (timeHorizon === 'past') {
      list = list.filter(ev => (ev.date || '') < todayStr);
      // Sort past descending (most recent past session first)
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    } else {
      // 'all'
      list.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }

    // 2. Subcategory Filter
    if (filterTab === 'standalone') list = list.filter(ev => ev.isStandalone);
    if (filterTab === 'scouting') {
      list = list.filter(ev => {
        const cls = getActivityClassification(ev);
        return cls.eventType === 'scouting' || ['hiking', 'fishing', 'sports', 'knot_crafts', 'orienteering', 'first_aid_drill', 'campcraft', 'swimming', 'shooting_sports'].includes(cls.subtype);
      });
    }
    if (filterTab === 'volunteering' || filterTab === 'service') {
      list = list.filter(ev => {
        const cls = getActivityClassification(ev);
        return cls.isService || cls.eventType === 'volunteering' || cls.eventType === 'service' || (Number(ev.serviceHoursCredited) > 0);
      });
    }
    if (filterTab === 'camp' || filterTab === 'campouts') {
      list = list.filter(ev => {
        const cls = getActivityClassification(ev);
        return cls.eventType === 'camp' || ev.category === 'campout' || cls.subtype.includes('camp');
      });
    }
    if (filterTab === 'faith') {
      list = list.filter(ev => {
        const cls = getActivityClassification(ev);
        return cls.eventType === 'faith' || ev.category === 'faith' || ev.islamicOccasion || (ev.islamicOccasions && ev.islamicOccasions.length > 0);
      });
    }
    if (filterTab === 'meeting') {
      list = list.filter(ev => {
        const cls = getActivityClassification(ev);
        return cls.eventType === 'meeting' || ev.category === 'meeting' || ev.isStandalone;
      });
    }

    // 3. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(ev => {
        const matchesTitle = (ev.title || '').toLowerCase().includes(q);
        const matchesDate = (ev.date || '').toLowerCase().includes(q);
        const matchesLoc = (ev.location || '').toLowerCase().includes(q);
        const matchesDesc = (ev.description || '').toLowerCase().includes(q);
        const matchesSubtype = (ev.activitySubtype || '').toLowerCase().includes(q);
        return matchesTitle || matchesDate || matchesLoc || matchesDesc || matchesSubtype;
      });
    }

    return list;
  }, [events, timeHorizon, todayStr, filterTab, searchQuery]);

  // Auto-select first item when list changes or resets
  useEffect(() => {
    if (filteredEvents.length > 0) {
      // If no selection or selected event is not in current list, select first
      if (!selectedEvent || !filteredEvents.some(e => e.id === selectedEvent.id)) {
        setSelectedEvent(filteredEvents[0]);
      }
    } else {
      setSelectedEvent(null);
    }
  }, [filteredEvents, timeHorizon]);

  const mapCategoryToEventType = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('camp') || c === 'campout') return 'Campout';
    if (c.includes('faith') || c.includes('halqa') || c.includes('study')) return 'Halqa / Study Circle';
    if (c.includes('service') || c.includes('volunteer')) return 'Service Project';
    if (c.includes('hike') || c.includes('outdoor')) return 'Day Hike';
    if (c.includes('ceremony') || c.includes('court')) return 'Special Workshop';
    return 'Weekly Troop Meeting';
  };

  const canUserEditEvent = (ev) => {
    if (!ev || !currentUser) return false;
    if (isExecutive) return true;
    if (!isLeader) return false;

    // An event set for the whole troop cannot be edited or deleted by normal leaders
    const isTroopWide = !ev.targetGroupId || ev.targetGroupId === 'all' || ev.isGlobalScope || ev.pushToAllPatrols || ev.targetScope === 'troop_wide';
    if (isTroopWide) return false;

    // Regular leaders can ONLY edit events that are scoped specifically to their group / patrol
    const userPatrolId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
    return Boolean(userPatrolId && (ev.targetGroupId === userPatrolId || ev.targetGroupId === currentUser?.groupId || ev.targetGroupId === currentUser?.patrolId || ev.targetScope === userPatrolId));
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('18:30');
    setEndTime('21:30');
    setIsAllDay(false);
    setTimeMode('picker');
    setTime('6:30 PM – 9:30 PM');
    setLocation('Highview Elementary School (25225 Richardson St, Dearborn Heights, MI 48127)');
    setEventType('scouting');
    setActivitySubtype('hiking');
    setCustomSubtypeText('');
    setServiceHoursCredited(0);
    setRequiresRsvp(true);
    setCategory('meeting');
    setDescription('');
    setRequiredItems('Complete Class A Field Uniform, Scout Handbook, Water Bottle, Pen & Notebook');
    setQuranVerse('');
    const defaultScope = isExecutive ? 'all' : (currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol || 'all');
    setTargetGroupId(defaultScope);
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (ev) => {
    if (!canUserEditEvent(ev)) {
      alert("You only have permission to edit events scoped specifically to your assigned patrol unit. Troop-wide events can only be modified by the Scoutmaster or Troop Administrators.");
      return;
    }
    const cls = getActivityClassification(ev);
    setEditingId(ev.id);
    setTitle(ev.title || '');
    setDate(ev.date || '');
    setLocation(ev.location || '');
    setEventType(ev.eventType || (ev.category === 'campout' ? 'camp' : ev.category === 'service' ? 'volunteering' : ev.category) || cls.eventType || 'meeting');
    setActivitySubtype(ev.activitySubtype || cls.subtype || 'hiking');
    setCustomSubtypeText('');
    setServiceHoursCredited(ev.serviceHoursCredited !== undefined ? ev.serviceHoursCredited : (cls.isService ? 3 : 0));
    setRequiresRsvp(ev.requiresRsvp !== undefined ? ev.requiresRsvp : true);
    setCategory(ev.category || (ev.eventType === 'camp' ? 'campout' : ev.eventType === 'volunteering' ? 'service' : ev.eventType) || 'meeting');
    setDescription(ev.description || '');
    setRequiredItems(ev.requiredItems || '');
    setQuranVerse(ev.quranVerse || '');
    setTargetGroupId(ev.targetGroupId || (ev.targetScope === 'troop_wide' ? 'all' : ev.targetScope) || 'all');
    setTime(ev.time || '6:30 PM – 9:30 PM');

    const parsed = parseTimeRange(ev.time);
    setStartTime(ev.startTime || parsed.start);
    setEndTime(ev.endTime || parsed.end);
    setIsAllDay(!!parsed.isAllDay);
    setTimeMode(parsed.isCustom ? 'custom' : 'picker');
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    if (!isAllDay) {
      const formatted = `${formatTime12h(newStart)} – ${formatTime12h(endTime)}`;
      setTime(formatted);
    }
  };

  const handleEndTimeChange = (newEnd) => {
    setEndTime(newEnd);
    if (!isAllDay) {
      const formatted = `${formatTime12h(startTime)} – ${formatTime12h(newEnd)}`;
      setTime(formatted);
    }
  };

  const handleToggleAllDay = (checked) => {
    setIsAllDay(checked);
    if (checked) {
      setTime('All Day Event');
    } else {
      setTime(`${formatTime12h(startTime)} – ${formatTime12h(endTime)}`);
    }
  };

  const handleSelectPreset = (preset) => {
    if (preset.isAllDay) {
      setIsAllDay(true);
      setTime('All Day Event');
      setStartTime(preset.start);
      setEndTime(preset.end);
    } else {
      setIsAllDay(false);
      setStartTime(preset.start);
      setEndTime(preset.end);
      setTime(preset.desc || `${formatTime12h(preset.start)} – ${formatTime12h(preset.end)}`);
    }
  };

  // ── REQUIRED GEAR / ITEMS CHECKLIST HELPERS ──
  const isGearItemChecked = (itemLabel) => {
    if (!requiredItems) return false;
    const lowerReq = requiredItems.toLowerCase();
    const lowerItem = itemLabel.toLowerCase();
    if (lowerReq.includes(lowerItem)) return true;
    if (itemLabel.includes('Class A') && lowerReq.includes('class a')) return true;
    if (itemLabel.includes('Class B') && lowerReq.includes('class b')) return true;
    if (itemLabel.includes('Handbook') && lowerReq.includes('handbook')) return true;
    if (itemLabel.includes('Pen & Notebook') && (lowerReq.includes('notebook') || lowerReq.includes('pen'))) return true;
    if (itemLabel.includes('Water Bottle') && lowerReq.includes('water bottle')) return true;
    if (itemLabel.includes('Sleeping Bag') && lowerReq.includes('sleeping bag')) return true;
    if (itemLabel.includes('Mess Kit') && lowerReq.includes('mess kit')) return true;
    if (itemLabel.includes('Flashlight') && (lowerReq.includes('flashlight') || lowerReq.includes('headlamp'))) return true;
    if (itemLabel.includes('First Aid') && lowerReq.includes('first aid')) return true;
    if (itemLabel.includes('Hiking Boots') && lowerReq.includes('hiking boots')) return true;
    if (itemLabel.includes('Prayer Rug') && (lowerReq.includes('prayer rug') || lowerReq.includes('turbah'))) return true;
    if (itemLabel.includes('Work Gloves') && lowerReq.includes('gloves')) return true;
    if (itemLabel.includes('Pocket Knife') && lowerReq.includes('knife')) return true;
    if (itemLabel.includes('Rain Jacket') && (lowerReq.includes('rain') || lowerReq.includes('poncho'))) return true;
    if (itemLabel.includes('Sunscreen') && (lowerReq.includes('sunscreen') || lowerReq.includes('repellent'))) return true;
    return false;
  };

  const handleToggleGearItem = (itemLabel) => {
    const isChecked = isGearItemChecked(itemLabel);
    let itemsArray = requiredItems ? requiredItems.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    if (isChecked) {
      itemsArray = itemsArray.filter(i => {
        const iLow = i.toLowerCase();
        if (iLow === itemLabel.toLowerCase()) return false;
        if (itemLabel.includes('Class A') && iLow.includes('class a')) return false;
        if (itemLabel.includes('Class B') && iLow.includes('class b')) return false;
        if (itemLabel.includes('Handbook') && iLow.includes('handbook')) return false;
        if (itemLabel.includes('Pen & Notebook') && (iLow.includes('notebook') || iLow.includes('pen'))) return false;
        if (itemLabel.includes('Water Bottle') && iLow.includes('water bottle')) return false;
        if (itemLabel.includes('Sleeping Bag') && iLow.includes('sleeping bag')) return false;
        if (itemLabel.includes('Mess Kit') && iLow.includes('mess kit')) return false;
        if (itemLabel.includes('Flashlight') && (iLow.includes('flashlight') || iLow.includes('headlamp'))) return false;
        if (itemLabel.includes('First Aid') && iLow.includes('first aid')) return false;
        if (itemLabel.includes('Hiking Boots') && iLow.includes('hiking boots')) return false;
        if (itemLabel.includes('Prayer Rug') && (iLow.includes('prayer rug') || iLow.includes('turbah'))) return false;
        if (itemLabel.includes('Work Gloves') && iLow.includes('gloves')) return false;
        if (itemLabel.includes('Pocket Knife') && iLow.includes('knife')) return false;
        if (itemLabel.includes('Rain Jacket') && (iLow.includes('rain') || iLow.includes('poncho'))) return false;
        if (itemLabel.includes('Sunscreen') && (iLow.includes('sunscreen') || iLow.includes('repellent'))) return false;
        return true;
      });
    } else {
      itemsArray.push(itemLabel);
    }
    setRequiredItems(itemsArray.join(', '));
  };

  const handleApplyGearPackage = (presetType) => {
    if (presetType === 'friday_meeting') {
      setRequiredItems('Complete Class A Field Uniform, Scout Handbook, Refillable Water Bottle (32oz+), Pen & Notebook');
    } else if (presetType === 'tuesday_halqa') {
      setRequiredItems('Activity Uniform (Class B Shirt), Scout Handbook, Workshop Materials, Refillable Water Bottle (32oz+)');
    } else if (presetType === 'overnight_camp') {
      setRequiredItems('Complete Class A Field Uniform, Activity Uniform (Class B Shirt), Scout Handbook, Warm Sleeping Bag & Ground Pad, Mess Kit & Cutlery, Flashlight or Headlamp with Extra Batteries, Personal First Aid Kit, Sturdy Hiking Boots & Wool Socks, Rain Jacket / Weather Layering, Refillable Water Bottle (32oz+), Prayer Rug / Turbah / Small Compass');
    } else if (presetType === 'service_project') {
      setRequiredItems('Activity Uniform (Class B Shirt), Heavy Duty Work Gloves, Refillable Water Bottle (32oz+), Personal First Aid Kit');
    } else if (presetType === 'clear') {
      setRequiredItems('');
    }
  };

  // Save / Update Event Handler
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (!title.trim() || !date) {
      setError("Event title and date are required.");
      return;
    }

    if (editingId) {
      const existingEv = events.find(ev => ev.id === editingId);
      if (existingEv && !canUserEditEvent(existingEv)) {
        setError("Permission denied: You cannot edit a troop-wide event.");
        return;
      }
    }

    setSaving(true);
    const userPatrolId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
    const scope = isExecutive ? targetGroupId : (userPatrolId || 'all');
    const targetScopeVal = scope === 'all' ? 'troop_wide' : scope;
    const finalSubtype = customSubtypeText.trim() ? customSubtypeText.trim().toLowerCase().replace(/\s+/g, '_') : activitySubtype;
    const isServiceCategory = eventType === 'volunteering' || eventType === 'service' || finalSubtype.includes('service') || finalSubtype.includes('cleanup') || finalSubtype.includes('food_drive');
    const finalServiceHours = isServiceCategory || Number(serviceHoursCredited) > 0 ? Number(serviceHoursCredited) : 0;
    
    let legacyCat = category;
    if (eventType === 'camp') legacyCat = 'campout';
    else if (eventType === 'volunteering') legacyCat = 'service';
    else if (eventType === 'meeting') legacyCat = 'meeting';
    else if (eventType === 'faith') legacyCat = 'faith';
    else if (eventType === 'ceremony') legacyCat = 'ceremony';
    else if (eventType === 'scouting') legacyCat = 'meeting';

    let calculatedDurStr = isAllDay ? '8 hrs' : (startTime && endTime ? calculateDuration(startTime, endTime) : '3 hrs');
    let calculatedHours = 3;
    if (isAllDay) {
      calculatedHours = 8;
    } else if (startTime && endTime) {
      const [sH, sM] = startTime.split(':').map(Number);
      const [eH, eM] = endTime.split(':').map(Number);
      if (!isNaN(sH) && !isNaN(eH)) {
        let diff = (eH * 60 + eM) - (sH * 60 + sM);
        if (diff < 0) diff += 24 * 60;
        calculatedHours = Math.round((diff / 60) * 100) / 100;
      }
    }

    const eventData = {
      title: title.trim(),
      date,
      time: time.trim(),
      startTime: startTime || '18:30',
      endTime: endTime || '21:30',
      durationHours: calculatedHours,
      duration: calculatedDurStr,
      location: location.trim(),
      eventType,
      activitySubtype: finalSubtype,
      serviceHoursCredited: finalServiceHours,
      requiresRsvp: Boolean(requiresRsvp),
      targetScope: targetScopeVal,
      category: legacyCat,
      description: description.trim(),
      requiredItems: requiredItems.trim(),
      quranVerse: quranVerse.trim(),
      targetGroupId: scope,
      createdBy: currentUser?.email || currentUser?.uid || 'neoissa@gmail.com',
      createdByName: currentUser?.fullName || currentUser?.username || 'Leader',
      isGlobalScope: scope === 'all',
      pushToAllPatrols: scope === 'all',
      updatedAt: serverTimestamp()
    };

    try {
      const docId = editingId || `event_${date.replace(/-/g, '')}_${(startTime || '1830').replace(/:/g, '')}`;
      await setDoc(doc(db, 'events', docId), eventData, { merge: true });

      // Automatically post announcement alert to patrol stream
      if (scope === 'all') {
        groups.forEach(g => {
          dispatchPatrolStreamAlert(g.id, `📅 New Troop Event Posted: ${title.trim()} on ${date} at ${time.trim()}.`);
        });
      } else {
        dispatchPatrolStreamAlert(scope, `📅 New Patrol Event: ${title.trim()} on ${date} at ${time.trim()}.`);
      }

      // Dispatch alert to target scouts on new event creation
      if (!editingId) {
        getDocs(query(collection(db, 'users'), where('role', '==', 'scout'))).then(snap => {
          let targetScouts = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
          if (scope !== 'all') {
            targetScouts = targetScouts.filter(s => s.groupId === scope || s.patrolId === scope);
          }
          if (targetScouts.length > 0) {
            dispatchBulkScoutNotifications({
              scouts: targetScouts,
              title: `📅 Upcoming Outing / Event: ${title.trim()}`,
              message: `${title.trim()} scheduled for ${date}${time ? ` at ${time}` : ''}. Location: ${location || 'Troop HQ'}.`,
              type: 'event',
              priority: 'normal',
              actionUrl: '/#events',
              metadata: { eventId: docId }
            }).catch(e => console.warn("Failed to dispatch new event notifications:", e));
          }
        }).catch(e => console.warn("Fetch scouts for event alert fallback:", e));
      }

      setMsg(editingId ? "Event updated!" : "New event published!");
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
      }, 1200);
    } catch (err) {
      console.error("Failed to save event:", err);
      setError("Error saving event: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    const evToDelete = events.find(e => e.id === id) || selectedEvent;
    if (!canUserEditEvent(evToDelete)) {
      alert("Permission denied: You do not have permission to delete a troop-wide event.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel and delete this event?")) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      setSelectedEventIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  // ── MULTI-SELECT BATCH DELETE HANDLERS ──
  const allFilteredSelected = useMemo(() => {
    if (!filteredEvents || filteredEvents.length === 0) return false;
    return filteredEvents.every(e => selectedEventIds.has(e.id));
  }, [filteredEvents, selectedEventIds]);

  const handleToggleSelectEvent = (eventId, e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    setSelectedEventIds(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    if (!filteredEvents || filteredEvents.length === 0) return;
    
    if (allFilteredSelected) {
      setSelectedEventIds(prev => {
        const next = new Set(prev);
        filteredEvents.forEach(e => next.delete(e.id));
        return next;
      });
    } else {
      setSelectedEventIds(prev => {
        const next = new Set(prev);
        filteredEvents.forEach(e => next.add(e.id));
        return next;
      });
    }
  };

  const handleDeleteSelectedEvents = async () => {
    const count = selectedEventIds.size;
    if (count === 0) return;
    if (!window.confirm(`⚠️ Are you sure you want to permanently delete ${count} selected event${count > 1 ? 's' : ''}?`)) {
      return;
    }

    setIsBatchDeleting(true);
    try {
      const idsToDelete = Array.from(selectedEventIds);
      await deleteEventsBatch(idsToDelete, { groups });
      if (selectedEvent && selectedEventIds.has(selectedEvent.id)) {
        setSelectedEvent(null);
      }
      setSelectedEventIds(new Set());
      setMsg(`✓ Successfully deleted ${count} event${count > 1 ? 's' : ''}!`);
      setTimeout(() => setMsg(''), 3500);
    } catch (err) {
      console.error("Batch delete failed:", err);
      alert("Failed to delete events: " + err.message);
    } finally {
      setIsBatchDeleting(false);
    }
  };

  // ── SEEDING & PURGING CALENDAR SESSIONS ──
  const handleRunSeeder = async () => {
    if (targetGeneratedSchedule.length === 0) {
      setGeneratorError("No events to generate based on your current selection.");
      return;
    }
    setIsSeeding(true);
    setGeneratorError('');
    setGeneratorSuccessMsg('');
    setGeneratorProgress({ current: 0, total: targetGeneratedSchedule.length, percentage: 0, status: 'Initializing calendar generator...' });

    try {
      const res = await seedCalendarEventsList(targetGeneratedSchedule, {
        onProgress: (p) => setGeneratorProgress(p),
        groups,
        customConfig: {
          createdBy: currentUser?.email || 'neoissa@gmail.com',
          createdByName: currentUser?.fullName || 'Scoutmaster Admin'
        }
      });

      const label = generatorMode === 'upcoming_month' || generatorMode === 'custom_month'
        ? currentMonthLabel
        : generatorMode === 'next_4_weeks' ? 'the next 4 weeks' : 'the 2026–2027 season';

      setGeneratorSuccessMsg(`🎉 Successfully generated and seeded ${res.totalCommitted} standalone session${res.totalCommitted > 1 ? 's' : ''} for ${label}! (${res.fridayCount} Fridays + ${res.tuesdayCount} Tuesdays)`);
    } catch (err) {
      console.error("Seeder failed:", err);
      setGeneratorError("Failed to seed calendar: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePurgeGenerated = async () => {
    if (!window.confirm("⚠️ Are you sure you want to purge all standalone recurring sessions? Custom events and campouts will NOT be deleted.")) {
      return;
    }
    setIsPurging(true);
    setGeneratorError('');
    setGeneratorSuccessMsg('');
    setGeneratorProgress({ current: 0, total: 0, percentage: 0, status: 'Scanning standalone sessions...' });

    try {
      const res = await purgeGeneratedCalendarEvents({
        onProgress: (p) => setGeneratorProgress(p),
        groups
      });
      setGeneratorSuccessMsg(`🗑️ Successfully purged ${res.deletedCount} standalone generated events from the calendar.`);
    } catch (err) {
      console.error("Purge failed:", err);
      setGeneratorError("Failed to purge events: " + err.message);
    } finally {
      setIsPurging(false);
    }
  };

  // Submit RSVP Handler (For Parents & Scouts)
  const handleSubmitRsvp = async (e) => {
    e.preventDefault();
    if (!selectedEvent?.id || !currentUser?.uid) return;
    setRsvpSaving(true);
    setRsvpSuccessMsg('');

    const userPatrolObj = groups.find(g => g.id === (currentUser.groupId || currentUser.patrolId));

    const rsvpData = {
      userId: currentUser.uid,
      userName: currentUser.fullName || currentUser.username || 'Family',
      userRole: currentUser.role || 'scout',
      userEmail: currentUser.email || '',
      userPhone: currentUser.phone || currentUser.scoutPhone || currentUser.parentPhone || '',
      groupId: currentUser.groupId || currentUser.patrolId || '',
      patrolName: userPatrolObj?.name ? `${userPatrolObj.name} Patrol` : '',
      scoutRank: currentUser.rank || '',
      linkedScoutIds: Array.isArray(currentUser.linkedScoutIds) ? currentUser.linkedScoutIds : [],
      status: rsvpStatus, // 'attending' | 'not_attending' | 'tentative'
      dietary: rsvpDietary.trim(),
      driverAvailable: rsvpDriverAvailable,
      seats: rsvpDriverAvailable ? parseInt(rsvpSeats, 10) || 0 : 0,
      notes: rsvpNotes.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      // 1. Save to subcollection events/{eventId}/rsvps/{currentUser.uid}
      await setDoc(doc(db, 'events', selectedEvent.id, 'rsvps', currentUser.uid), rsvpData, { merge: true });

      // 2. Also save to global event_rsvps collection for unified fast lookup
      const rsvpDocId = `rsvp_${selectedEvent.id}_${currentUser.uid}`;
      await setDoc(doc(db, 'event_rsvps', rsvpDocId), {
        ...rsvpData,
        eventId: selectedEvent.id,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 3. If parent with linked scouts, also link each scout's record
      if (currentUser.role === 'parent' && Array.isArray(currentUser.linkedScoutIds) && currentUser.linkedScoutIds.length > 0) {
        for (const sId of currentUser.linkedScoutIds) {
          const sRsvpId = `rsvp_${selectedEvent.id}_${sId}`;
          const scoutObj = users.find(u => u.uid === sId);
          await setDoc(doc(db, 'event_rsvps', sRsvpId), {
            eventId: selectedEvent.id,
            scoutId: sId,
            scoutName: scoutObj?.fullName || scoutObj?.username || 'Scout',
            parentUid: currentUser.uid,
            parentName: currentUser.fullName || currentUser.username || 'Parent',
            status: rsvpStatus === 'attending' ? 'going' : (rsvpStatus === 'not_attending' ? 'cant_go' : 'tentative'),
            dietary: rsvpDietary.trim(),
            driverAvailable: rsvpDriverAvailable,
            seats: rsvpDriverAvailable ? parseInt(rsvpSeats, 10) || 0 : 0,
            notes: rsvpNotes.trim(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }

      setRsvpSuccessMsg('✓ RSVP Submitted Successfully!');
      setTimeout(() => setRsvpSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Failed to submit RSVP:", err);
      alert("Error saving RSVP: " + err.message);
    } finally {
      setRsvpSaving(false);
    }
  };

  // Leader RSVP Override Handler
  const handleLeaderOverrideRsvp = async (eventId, attendee, newStatus) => {
    if (!eventId || !attendee) return;
    setLeaderUpdatingRsvp(true);
    setLeaderRsvpMsg('');

    try {
      const rsvpData = {
        userId: attendee.userId,
        scoutId: attendee.scoutId || attendee.userId,
        userName: attendee.name,
        userRole: attendee.role,
        status: newStatus,
        updatedByLeader: currentUser?.fullName || currentUser?.username || 'Leader',
        submittedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'events', eventId, 'rsvps', attendee.userId), rsvpData, { merge: true });
      await setDoc(doc(db, 'event_rsvps', `rsvp_${eventId}_${attendee.userId}`), {
        ...rsvpData,
        eventId,
        status: newStatus === 'attending' ? 'going' : (newStatus === 'not_attending' ? 'cant_go' : 'tentative'),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setLeaderRsvpMsg(`✓ Recorded ${attendee.name} as ${newStatus === 'attending' ? 'ATTENDING' : newStatus === 'tentative' ? 'TENTATIVE' : 'DECLINED'}`);
      setTimeout(() => setLeaderRsvpMsg(''), 3000);
    } catch (err) {
      console.error("Leader RSVP override failed:", err);
      alert("Failed to update RSVP: " + err.message);
    } finally {
      setLeaderUpdatingRsvp(false);
    }
  };

  // ── WHATSAPP REMINDER GENERATOR HELPERS ──
  const buildWhatsAppMessage = (ev, type, patrolId, customNote, includeRsvp, recipType, recipName) => {
    if (!ev) return '';
    let pName = '';
    if (patrolId && patrolId !== 'all') {
      const g = groups.find(grp => grp.id === patrolId);
      pName = g?.name ? `${g.name} Patrol` : '';
    } else if (ev.targetGroupId && ev.targetGroupId !== 'all') {
      const g = groups.find(grp => grp.id === ev.targetGroupId);
      pName = g?.name ? `${g.name} Patrol` : '';
    }

    return generateEventReminderWhatsApp(ev, {
      patrolName: pName,
      reminderType: type,
      recipientType: recipType,
      recipientName: recipName,
      customNote,
      includeRsvpLink: includeRsvp,
      appUrl: 'https://taliat-app.vercel.app/'
    });
  };

  const handleOpenWhatsAppReminder = (ev, directRecipient = null) => {
    if (!ev) return;
    setWhatsappModalEvent(ev);
    const initialType = 'general';
    const initialPatrolId = ev.targetGroupId || 'all';
    const initialNote = '';
    const initialIncludeRsvp = true;
    const initialRecipType = directRecipient ? (directRecipient.role === 'scout' ? 'scout' : 'parent') : 'parent';
    const initialRecipName = directRecipient ? (directRecipient.parentName || directRecipient.name || '') : '';
    const initialPhone = directRecipient ? (directRecipient.parentPhone || directRecipient.userPhone || '') : '';

    setWhatsappReminderType(initialType);
    setWhatsappPatrolId(initialPatrolId);
    setWhatsappCustomNote(initialNote);
    setWhatsappIncludeRsvpLink(initialIncludeRsvp);
    setWhatsappRecipientType(initialRecipType);
    setWhatsappRecipientName(initialRecipName);
    setWhatsappRecipientPhone(initialPhone);

    const generated = buildWhatsAppMessage(
      ev, 
      initialType, 
      initialPatrolId, 
      initialNote, 
      initialIncludeRsvp, 
      initialRecipType, 
      initialRecipName
    );
    setWhatsappLiveText(generated);
    setShowWhatsAppModal(true);
  };

  const handleUpdateReminderOption = (changes) => {
    const nextType = changes.type !== undefined ? changes.type : whatsappReminderType;
    const nextPatrolId = changes.patrolId !== undefined ? changes.patrolId : whatsappPatrolId;
    const nextCustomNote = changes.customNote !== undefined ? changes.customNote : whatsappCustomNote;
    const nextIncludeRsvp = changes.includeRsvp !== undefined ? changes.includeRsvp : whatsappIncludeRsvpLink;
    const nextRecipType = changes.recipType !== undefined ? changes.recipType : whatsappRecipientType;
    const nextRecipName = changes.recipName !== undefined ? changes.recipName : whatsappRecipientName;
    const nextPhone = changes.phone !== undefined ? changes.phone : whatsappRecipientPhone;

    if (changes.type !== undefined) setWhatsappReminderType(nextType);
    if (changes.patrolId !== undefined) setWhatsappPatrolId(nextPatrolId);
    if (changes.customNote !== undefined) setWhatsappCustomNote(nextCustomNote);
    if (changes.includeRsvp !== undefined) setWhatsappIncludeRsvpLink(nextIncludeRsvp);
    if (changes.recipType !== undefined) setWhatsappRecipientType(nextRecipType);
    if (changes.recipName !== undefined) setWhatsappRecipientName(nextRecipName);
    if (changes.phone !== undefined) setWhatsappRecipientPhone(nextPhone);

    const generated = buildWhatsAppMessage(
      whatsappModalEvent,
      nextType,
      nextPatrolId,
      nextCustomNote,
      nextIncludeRsvp,
      nextRecipType,
      nextRecipName
    );
    setWhatsappLiveText(generated);
  };

  const handleResetWhatsAppTemplate = () => {
    const generated = buildWhatsAppMessage(
      whatsappModalEvent,
      whatsappReminderType,
      whatsappPatrolId,
      whatsappCustomNote,
      whatsappIncludeRsvpLink,
      whatsappRecipientType,
      whatsappRecipientName
    );
    setWhatsappLiveText(generated);
  };

  const handleCopyWhatsAppMsgText = () => {
    if (!whatsappLiveText) return;
    navigator.clipboard.writeText(whatsappLiveText);
    setWhatsappCopiedToast(true);
    setTimeout(() => setWhatsappCopiedToast(false), 2500);
  };

  const getWhatsAppDispatchUrl = () => {
    const cleanPhone = (whatsappRecipientPhone || '').replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(whatsappLiveText || '');
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encodedText}`;
    }
    return `https://wa.me/?text=${encodedText}`;
  };

  // Preview List filtered in generator modal
  const filteredPreviewList = useMemo(() => {
    return targetGeneratedSchedule.filter(ev => {
      if (previewFilter === 'friday' && ev.recurringPattern !== 'weekly_friday') return false;
      if (previewFilter === 'tuesday' && ev.recurringPattern !== 'weekly_tuesday') return false;
      if (previewSearch.trim()) {
        const q = previewSearch.toLowerCase();
        return ev.date.includes(q) || ev.dayOfWeek.toLowerCase().includes(q) || ev.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [targetGeneratedSchedule, previewFilter, previewSearch]);

  // Helper to calculate RSVP summary for any event card
  const getEventRsvpSummary = useMemo(() => (ev) => {
    if (!ev?.id) return { attending: 0, tentative: 0, notAttending: 0, total: 0 };
    const subMap = eventRsvps[ev.id] || {};
    const globalList = globalRsvps.filter(r => r.eventId === ev.id);

    const combined = { ...subMap };
    globalList.forEach(r => {
      const k = r.userId || r.scoutId || r.id;
      if (k && !combined[k]) combined[k] = r;
    });

    const vals = Object.values(combined);
    const attending = vals.filter(r => r.status === 'attending' || r.status === 'going' || r.status === 'yes').length;
    const tentative = vals.filter(r => r.status === 'tentative' || r.status === 'maybe').length;
    const notAttending = vals.filter(r => r.status === 'not_attending' || r.status === 'cant_go' || r.status === 'no').length;

    return { attending, tentative, notAttending, total: vals.length };
  }, [eventRsvps, globalRsvps]);

  // Comprehensive Computed Attendee Data for Selected Event
  const selectedEventAttendeeData = useMemo(() => {
    if (!selectedEvent) return { attendees: [], attendingCount: 0, tentativeCount: 0, notAttendingCount: 0, pendingCount: 0, totalDrivers: 0, totalSeats: 0, dietaryAlerts: [] };

    const eventId = selectedEvent.id;
    const subcolMap = eventRsvps[eventId] || {};
    const globalEventRsvps = globalRsvps.filter(r => r.eventId === eventId);

    // Merge RSVPs: subcollection takes precedence
    const combinedRsvpMap = {};
    
    globalEventRsvps.forEach(r => {
      const key = r.userId || r.scoutId || r.id;
      if (key) combinedRsvpMap[key] = { ...r };
    });

    Object.entries(subcolMap).forEach(([uid, rData]) => {
      combinedRsvpMap[uid] = { ...(combinedRsvpMap[uid] || {}), ...rData, userId: uid };
    });

    // Determine eligible scouts based on targetGroupId
    const targetPatrolId = selectedEvent.targetGroupId || selectedEvent.groupId || 'all';
    const eligibleScouts = users.filter(u => {
      if (u.role !== 'scout') return false;
      if (targetPatrolId === 'all') return true;
      return u.groupId === targetPatrolId || u.patrolId === targetPatrolId;
    });

    const attendeeList = [];
    const processedUserIds = new Set();

    // 1. Process all explicit RSVPs
    Object.entries(combinedRsvpMap).forEach(([uid, rData]) => {
      processedUserIds.add(uid);
      if (rData.scoutId) processedUserIds.add(rData.scoutId);

      const userObj = users.find(u => u.uid === uid || u.uid === rData.scoutId || u.uid === rData.userId);
      const parentObj = rData.parentUid ? users.find(u => u.uid === rData.parentUid) : null;
      const isScout = userObj?.role === 'scout' || (!userObj && !rData.userRole?.includes('parent'));
      const isParent = userObj?.role === 'parent' || rData.userRole === 'parent' || !!rData.parentUid;
      const isLeader = userObj?.role === 'leader' || userObj?.role === 'owner' || userObj?.role === 'admin' || rData.userRole === 'leader';

      const normalizedStatus = (rData.status === 'going' || rData.status === 'attending' || rData.status === 'yes') 
        ? 'attending' 
        : (rData.status === 'cant_go' || rData.status === 'not_attending' || rData.status === 'no') 
        ? 'not_attending' 
        : (rData.status === 'tentative' || rData.status === 'maybe')
        ? 'tentative'
        : 'pending';

      const pId = userObj?.groupId || userObj?.patrolId || rData.groupId;
      const patrolObj = groups.find(g => g.id === pId);

      attendeeList.push({
        id: uid,
        userId: uid,
        scoutId: rData.scoutId || (isScout ? uid : null),
        name: rData.userName || rData.scoutName || userObj?.fullName || userObj?.username || 'Attendee',
        role: isScout ? 'scout' : isParent ? 'parent' : isLeader ? 'leader' : 'family',
        roleLabel: isScout ? '⚜️ Scout' : isParent ? '👨‍👩‍👧 Parent' : isLeader ? '🛡️ Leader' : 'Guest',
        rank: userObj?.rank || rData.scoutRank || 'Scout',
        patrol: patrolObj?.name ? `${patrolObj.name} Patrol` : 'Troop Member',
        status: normalizedStatus,
        rawStatus: rData.status,
        dietary: rData.dietary || userObj?.dietaryRestrictions || userObj?.allergies || '',
        driverAvailable: !!rData.driverAvailable,
        seats: rData.seats || 0,
        notes: rData.notes || '',
        submittedAt: rData.submittedAt || rData.updatedAt || '',
        parentName: rData.parentName || parentObj?.fullName || parentObj?.username || userObj?.parent1Name || '',
        parentPhone: parentObj?.phone || parentObj?.parent1Phone || userObj?.parentPhone || userObj?.emergencyContactPhone || '',
        userPhone: userObj?.phone || userObj?.scoutPhone || userObj?.personalPhone || '',
        userEmail: userObj?.email || userObj?.personalEmail || rData.userEmail || '',
        photoURL: userObj?.photoURL || ''
      });
    });

    // 2. Add pending scouts who haven't responded yet
    eligibleScouts.forEach(scout => {
      if (!processedUserIds.has(scout.uid)) {
        const pId = scout.groupId || scout.patrolId;
        const patrolObj = groups.find(g => g.id === pId);

        attendeeList.push({
          id: scout.uid,
          userId: scout.uid,
          scoutId: scout.uid,
          name: scout.fullName || scout.username || 'Scout',
          role: 'scout',
          roleLabel: '⚜️ Scout',
          rank: scout.rank || 'Scout',
          patrol: patrolObj?.name ? `${patrolObj.name} Patrol` : 'Troop Member',
          status: 'pending',
          rawStatus: 'no_response',
          dietary: scout.dietaryRestrictions || scout.allergies || '',
          driverAvailable: false,
          seats: 0,
          notes: '',
          submittedAt: '',
          parentName: scout.parent1Name || scout.parentName || '',
          parentPhone: scout.parentPhone || scout.parent1Phone || scout.emergencyContactPhone || '',
          userPhone: scout.scoutPhone || scout.phone || '',
          userEmail: scout.email || scout.personalEmail || '',
          photoURL: scout.photoURL || ''
        });
      }
    });

    // Counts & aggregations
    const attendingList = attendeeList.filter(a => a.status === 'attending');
    const tentativeList = attendeeList.filter(a => a.status === 'tentative');
    const notAttendingList = attendeeList.filter(a => a.status === 'not_attending');
    const pendingList = attendeeList.filter(a => a.status === 'pending');

    const driversList = attendeeList.filter(a => a.driverAvailable && a.status === 'attending');
    const totalSeats = driversList.reduce((acc, d) => acc + (parseInt(d.seats, 10) || 0), 0);

    const dietaryAlerts = attendeeList
      .filter(a => a.status === 'attending' && a.dietary && a.dietary.trim())
      .map(a => ({ name: a.name, dietary: a.dietary }));

    return {
      attendees: attendeeList,
      attendingCount: attendingList.length,
      tentativeCount: tentativeList.length,
      notAttendingCount: notAttendingList.length,
      pendingCount: pendingList.length,
      totalDrivers: driversList.length,
      totalSeats,
      dietaryAlerts
    };
  }, [selectedEvent, eventRsvps, globalRsvps, users, groups]);

  const attendingCount = selectedEventAttendeeData.attendingCount;
  const tentativeCount = selectedEventAttendeeData.tentativeCount;
  const notAttendingCount = selectedEventAttendeeData.notAttendingCount;
  const pendingCount = selectedEventAttendeeData.pendingCount;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ── TOP BANNER & ACTION BAR ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-950/50 shrink-0">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-black text-white">
                {isParent ? 'Troop Calendar & Event RSVPs' : 'Troop Calendar & Planned Events'}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                {isExecutive ? 'Executive Broadcast Control' : isLeader ? 'Patrol Leader' : 'Family RSVP Portal'}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                2026–2027 Season
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isParent 
                ? 'Review upcoming campouts, weekly meetings, and volunteer service events. Confirm your family attendance and carpool seats.'
                : 'Plan weekly standalone meetings, campouts, and halqas. Track family RSVPs, volunteer drivers, and broadcast announcements.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {(isLeader || isExecutive) && (
            <button
              onClick={() => setShowMasterSyncModal(true)}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-md shrink-0 border border-slate-700"
              title="Import & Sync Official 2026–27 Scout Year Calendar Excel (.xlsx)"
            >
              <Calendar size={15} className="text-emerald-400" />
              <span>📥 Import Master Calendar (.xlsx)</span>
            </button>
          )}

          {isExecutive && (
            <button
              onClick={() => {
                setShowGeneratorModal(true);
                setGeneratorSuccessMsg('');
                setGeneratorError('');
              }}
              className="bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0 border border-amber-400/30"
              title="Automated Recurring Calendar Generator for 2026-2027"
            >
              <Zap size={15} className="text-amber-200 animate-pulse" />
              <span>⚡ Auto-Generate 2026–2027 Calendar</span>
            </button>
          )}

          {isLeader && (
            <button
              onClick={handleOpenNew}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0"
            >
              <Plus size={16} />
              <span>Publish Event</span>
            </button>
          )}
        </div>
      </div>

      {/* ── TIME HORIZON TABS: UPCOMING vs PAST vs ALL ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          {/* Main Time Horizon Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setTimeHorizon('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                timeHorizon === 'upcoming'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CalendarDays size={15} />
              <span>Upcoming Events</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                timeHorizon === 'upcoming' ? 'bg-black/30 text-white' : 'bg-slate-850 text-slate-400'
              }`}>
                {standaloneStats.upcomingCount}
              </span>
            </button>

            <button
              onClick={() => setTimeHorizon('past')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                timeHorizon === 'past'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History size={15} />
              <span>Past Events</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                timeHorizon === 'past' ? 'bg-black/30 text-white' : 'bg-slate-850 text-slate-400'
              }`}>
                {standaloneStats.pastCount}
              </span>
            </button>

            <button
              onClick={() => setTimeHorizon('all')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                timeHorizon === 'all'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>All ({events.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder={`Search in ${timeHorizon} events...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Subcategory Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'standalone', label: '⚡ Standalone Weekly Meetings' },
            { id: 'scouting', label: '🏕️ Scouting Activities (Hikes, Fishing, Sports)' },
            { id: 'volunteering', label: '🤝 Volunteering & Service (Credited Hours)' },
            { id: 'camp', label: '⛺ Overnight Campouts' },
            { id: 'faith', label: '🕌 Halqas & Faith' },
            { id: 'meeting', label: '📋 Troop Meetings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RECURRING EVENT GENERATOR MODAL (MONTHLY & CUSTOM RANGE) ── */}
      {showGeneratorModal && isExecutive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-4xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  ⚡
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <span>Recurring Calendar Generator & Seeder</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generate standalone Friday Weekly Meetings and Tuesday Youth Programs on a flexible monthly or seasonal schedule.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mode & Target Range Selector */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Target Generation Horizon
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'upcoming_month', label: '🗓️ Upcoming Month' },
                    { id: 'custom_month', label: '📅 Pick Month' },
                    { id: 'next_4_weeks', label: '⏱️ Next 4 Weeks' },
                    { id: 'full_season', label: '🌐 Full Season' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setGeneratorMode(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        generatorMode === m.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month / Year Pickers if in Monthly Mode */}
              {(generatorMode === 'upcoming_month' || generatorMode === 'custom_month') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Target Month</label>
                    <select
                      value={generatorMonth}
                      onChange={(e) => setGeneratorMonth(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      {[
                        { val: 1, name: 'January' },
                        { val: 2, name: 'February' },
                        { val: 3, name: 'March' },
                        { val: 4, name: 'April' },
                        { val: 5, name: 'May' },
                        { val: 6, name: 'June' },
                        { val: 7, name: 'July' },
                        { val: 8, name: 'August' },
                        { val: 9, name: 'September' },
                        { val: 10, name: 'October' },
                        { val: 11, name: 'November' },
                        { val: 12, name: 'December' }
                      ].map(m => (
                        <option key={m.val} value={m.val}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Target Year</label>
                    <select
                      value={generatorYear}
                      onChange={(e) => setGeneratorYear(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                      <option value={2028}>2028</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Day Selection Toggles */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-850 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Include Sessions:</span>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-300 font-bold">
                  <input
                    type="checkbox"
                    checked={generatorIncludeFriday}
                    onChange={(e) => setGeneratorIncludeFriday(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                  />
                  <span>🟢 Fridays (Friday Weekly Meeting: 6:30 PM – 9:30 PM)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-sky-300 font-bold">
                  <input
                    type="checkbox"
                    checked={generatorIncludeTuesday}
                    onChange={(e) => setGeneratorIncludeTuesday(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer accent-sky-500"
                  />
                  <span>🔵 Tuesdays (Tuesday Youth Program: 7:15 PM – 8:30 PM)</span>
                </label>
              </div>
            </div>

            {/* Schedule Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Friday Sessions */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    🟢 Every Friday
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {targetGeneratedSchedule.filter(e => e.recurringPattern === 'weekly_friday').length} in Selection
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Friday Weekly Meetings</h4>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-400" /> 6:30 PM – 9:30 PM (3.0 hrs)</div>
                </div>
                <div className="pt-1 text-[11px] text-slate-400">
                  Status: <strong className="text-emerald-300">{generatorIncludeFriday ? 'Active in Generator' : 'Disabled'}</strong>
                </div>
              </div>

              {/* Tuesday Sessions */}
              <div className="bg-slate-950 border border-sky-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                    🔵 Every Tuesday
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-400">
                    {targetGeneratedSchedule.filter(e => e.recurringPattern === 'weekly_tuesday').length} in Selection
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">Tuesday Youth Program</h4>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5"><Clock size={12} className="text-sky-400" /> 7:15 PM – 8:30 PM (1h 15m)</div>
                </div>
                <div className="pt-1 text-[11px] text-slate-400">
                  Status: <strong className="text-sky-300">{generatorIncludeTuesday ? 'Active in Generator' : 'Disabled'}</strong>
                </div>
              </div>

              {/* Total & Target Documents */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    📊 Selected Total
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">{targetGeneratedSchedule.length} Sessions</span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {generatorMode === 'upcoming_month' || generatorMode === 'custom_month' 
                    ? currentMonthLabel 
                    : generatorMode === 'next_4_weeks' ? 'Next 4 Weeks' : '2026–2027 Season'}
                </h4>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div>• Schema: <code>event_YYYYMMDD_HHMM</code></div>
                  <div>• Scope: <code>pushToAllPatrols: true</code></div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs in Modal */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setGeneratorTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  generatorTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Zap size={14} />
                <span>Overview & Actions</span>
              </button>
              <button
                onClick={() => setGeneratorTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  generatorTab === 'preview'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ListOrdered size={14} />
                <span>Interactive Preview ({targetGeneratedSchedule.length} Dates)</span>
              </button>
            </div>

            {/* Feedback Alerts */}
            {generatorError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-400 shrink-0" />
                <span>{generatorError}</span>
              </div>
            )}
            {generatorSuccessMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{generatorSuccessMsg}</span>
              </div>
            )}

            {/* Progress Bar during Seeding/Purging */}
            {generatorProgress && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{generatorProgress.status}</span>
                  <span className="font-mono font-bold text-emerald-400">{generatorProgress.percentage || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${generatorProgress.percentage || 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tab 1: Overview & Seeding Actions */}
            {generatorTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <strong className="text-white block text-sm font-bold">Standalone Recurring Session Generator:</strong>
                  <p>
                    Populates the calendar with independent standalone meetings for <strong>{generatorMode === 'upcoming_month' || generatorMode === 'custom_month' ? currentMonthLabel : generatorMode === 'next_4_weeks' ? 'the next 4 weeks' : 'the full season'}</strong>:
                    <br />&bull; <strong>Friday Weekly Meetings</strong>: 6:30 PM – 9:30 PM (3.0 hrs).
                    <br />&bull; <strong>Tuesday Youth Programs</strong>: 7:15 PM – 8:30 PM (1h 15m).
                  </p>
                  <p>
                    Each meeting is created as an independent document in Firestore, allowing individual attendance tracking, RSVPs, and customization.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleRunSeeder}
                    disabled={isSeeding || isPurging || targetGeneratedSchedule.length === 0}
                    className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    {isSeeding ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} className="text-amber-200" />}
                    <span>{isSeeding ? 'Generating & Publishing to Firestore...' : `🚀 Generate & Publish ${targetGeneratedSchedule.length} Sessions`}</span>
                  </button>

                  <button
                    onClick={handlePurgeGenerated}
                    disabled={isSeeding || isPurging}
                    className="w-full sm:w-auto bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 hover:border-rose-700 disabled:opacity-50 text-xs font-semibold py-3.5 px-4 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
                    title="Remove all standalone recurring sessions if you need to reset"
                  >
                    <Trash2 size={15} />
                    <span>Purge Generated Sessions</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Schedule Preview */}
            {generatorTab === 'preview' && (
              <div className="space-y-3">
                {/* Search & Filter in Preview */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => setPreviewFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({targetGeneratedSchedule.length})
                    </button>
                    <button
                      onClick={() => setPreviewFilter('friday')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewFilter === 'friday' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Fridays ({targetGeneratedSchedule.filter(e => e.recurringPattern === 'weekly_friday').length})
                    </button>
                    <button
                      onClick={() => setPreviewFilter('tuesday')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewFilter === 'tuesday' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tuesdays ({targetGeneratedSchedule.filter(e => e.recurringPattern === 'weekly_tuesday').length})
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search date or title..."
                      value={previewSearch}
                      onChange={(e) => setPreviewSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Preview Table */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5 pl-4">#</th>
                        <th className="p-2.5">Day</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Event Title</th>
                        <th className="p-2.5">Time & Duration</th>
                        <th className="p-2.5 text-right pr-4">Live Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredPreviewList.map((item, idx) => {
                        const isLive = existingEventIdMap.has(item.id);
                        return (
                          <tr key={item.id} className="hover:bg-slate-900/60 transition">
                            <td className="p-2.5 pl-4 font-mono text-slate-500">{idx + 1}</td>
                            <td className="p-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.dayOfWeek === 'Friday' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                              }`}>
                                {item.dayOfWeek}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono font-bold text-white">{item.date}</td>
                            <td className="p-2.5 text-slate-200 font-medium truncate max-w-[160px]">{item.title}</td>
                            <td className="p-2.5 text-slate-300 font-mono text-[11px]">
                              {item.time} ({item.duration || getEventDisplayDuration(item)})
                            </td>
                            <td className="p-2.5 text-right pr-4">
                              {isLive ? (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <CheckCircle size={10} /> Live
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                                  Pending Seed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT EVENT MODAL ── */}
      {showForm && isLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">
                {editingId ? 'Edit Event Details' : 'Publish Planned Event'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {error && <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-600">{error}</p>}
            {msg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{msg}</p>}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall Camporee & Pioneering Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Date & Date Info */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* ── ACTIVITY CLASSIFICATION ENGINE: EVENT TYPE ── */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎯</span>
                    <label className="text-xs font-black text-slate-200 uppercase tracking-wide">
                      Activity Classification & Event Type *
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Select primary category</span>
                </div>

                {/* Primary Category Grid (6 Types) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVENT_TYPES.map(t => {
                    const isSelected = eventType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setEventType(t.id);
                          const subtypes = ACTIVITY_SUBTYPES[t.id] || [];
                          if (subtypes.length > 0) {
                            setActivitySubtype(subtypes[0].id);
                          }
                          setCustomSubtypeText('');
                          if (t.id === 'volunteering' || t.id === 'service') {
                            if (!serviceHoursCredited || serviceHoursCredited === 0) {
                              setServiceHoursCredited(3);
                            }
                          } else {
                            setServiceHoursCredited(0);
                          }
                          if (t.id === 'camp') setCategory('campout');
                          else if (t.id === 'volunteering') setCategory('service');
                          else if (t.id === 'meeting') setCategory('meeting');
                          else if (t.id === 'faith') setCategory('faith');
                          else if (t.id === 'ceremony') setCategory('ceremony');
                          else setCategory('meeting');
                        }}
                        className={`text-left p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? `${t.badgeClass} ring-1 ring-emerald-500 shadow-md`
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{t.icon}</span>
                          {isSelected && <span className="text-[10px] text-emerald-400 font-black">✓ Active</span>}
                        </div>
                        <div className="mt-1.5">
                          <strong className="text-xs font-bold text-white block leading-tight">{t.label}</strong>
                          <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{t.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Granular Activity Subtype Selector */}
                <div className="pt-2 border-t border-slate-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                      <span>📌</span>
                      <span>Granular Activity Subtype:</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activitySubtype ? (ACTIVITY_SUBTYPES[eventType]?.find(s => s.id === activitySubtype)?.label || activitySubtype) : 'None'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(ACTIVITY_SUBTYPES[eventType] || ACTIVITY_SUBTYPES.scouting).map(st => {
                      const isSubSelected = activitySubtype === st.id && !customSubtypeText;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setActivitySubtype(st.id);
                            setCustomSubtypeText('');
                            if (st.id.includes('service') || st.id.includes('cleanup') || st.id.includes('food_drive')) {
                              if (!serviceHoursCredited || serviceHoursCredited === 0) setServiceHoursCredited(3);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                            isSubSelected
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
                          }`}
                        >
                          <span>{st.icon}</span>
                          <span>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Subtype Text Option */}
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Or specify custom activity subtype (e.g. Pioneering Tower, River Kayaking, Food Pantry)..."
                      value={customSubtypeText}
                      onChange={(e) => {
                        setCustomSubtypeText(e.target.value);
                        if (e.target.value.trim()) {
                          setActivitySubtype(e.target.value.trim().toLowerCase().replace(/\s+/g, '_'));
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* Service Hours Credited Field (Highlighted for Volunteering/Service) */}
                {(eventType === 'volunteering' || eventType === 'service' || activitySubtype.includes('service') || activitySubtype.includes('cleanup') || activitySubtype.includes('food_drive') || Number(serviceHoursCredited) > 0) && (
                  <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-sm">⏳</span>
                        <span>Service Hours Credited to Scouts</span>
                      </label>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                        BSA Rank Credit
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Attendance recorded for this event will automatically award these service hours toward scouts' rank advancement (Tenderfoot through Eagle).
                    </p>

                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      <div className="flex items-center gap-1">
                        {SERVICE_HOURS_PRESETS.map(h => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setServiceHoursCredited(h)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                              Number(serviceHoursCredited) === h
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                                : 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-amber-950'
                            }`}
                          >
                            {h} hr{h > 1 ? 's' : ''}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="48"
                          step="0.5"
                          value={serviceHoursCredited}
                          onChange={(e) => setServiceHoursCredited(parseFloat(e.target.value) || 0)}
                          className="w-20 bg-slate-900 border border-amber-500/50 rounded-xl px-2.5 py-1 text-xs text-amber-200 text-center font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                        <span className="text-xs text-amber-300 font-medium">hrs total</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* RSVP & Attendance Requirement Control */}
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={requiresRsvp}
                        onChange={(e) => setRequiresRsvp(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-slate-900 cursor-pointer"
                      />
                      <span>Pre-Event Attendance RSVP Required</span>
                    </label>
                    <p className="text-[10px] text-slate-400 ml-6 mt-0.5">
                      {requiresRsvp 
                        ? 'Families will be asked to confirm attendance, carpool seats, and dietary restrictions.' 
                        : 'Open attendance event — no RSVP required, all scouts and families welcome.'}
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    requiresRsvp 
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                      : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  }`}>
                    {requiresRsvp ? '📝 RSVP Enabled' : '🔓 Open Attendance'}
                  </span>
                </div>
              </div>

              {/* ── TIME RANGE SELECTOR ── */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-emerald-400" />
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Time Range & Schedule
                    </label>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setTimeMode('picker')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        timeMode === 'picker'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⏱️ Time Picker
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeMode('presets')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        timeMode === 'presets'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⚡ Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeMode('custom')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        timeMode === 'custom'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ✏️ Custom
                    </button>
                  </div>
                </div>

                {/* Mode 1: Interactive Time Picker */}
                {timeMode === 'picker' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          disabled={isAllDay}
                          onChange={(e) => handleStartTimeChange(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          disabled={isAllDay}
                          onChange={(e) => handleEndTimeChange(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/60">
                      <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isAllDay}
                          onChange={(e) => handleToggleAllDay(e.target.checked)}
                          className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-slate-900 cursor-pointer"
                        />
                        <span>All Day Event</span>
                      </label>

                      {/* Live Badge Preview */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold shadow-sm">
                          <span>🕒</span>
                          <span>{time}</span>
                        </span>
                        {!isAllDay && calculateDuration(startTime, endTime) && (
                          <span className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg">
                            ⏱️ {calculateDuration(startTime, endTime)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode 2: Quick Presets */}
                {timeMode === 'presets' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Select a standard Kashaf Scout troop schedule to apply instantly:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SCOUT_TIME_PRESETS.map((p) => {
                        const isCurrent = (!p.isAllDay && !isAllDay && startTime === p.start && endTime === p.end) || (p.isAllDay && isAllDay);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPreset(p)}
                            className={`text-left p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                              isCurrent
                                ? 'bg-emerald-950/50 border-emerald-500 text-white'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{p.label}</span>
                              {isCurrent && <span className="text-[10px] text-emerald-400 font-bold">✓ Selected</span>}
                            </div>
                            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-mono">
                              <span>{p.desc}</span>
                              {!p.isAllDay && (
                                <span className="text-emerald-400/90 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                  {calculateDuration(p.start, p.end)}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mode 3: Freeform Custom Text */}
                {timeMode === 'custom' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Custom Time Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. After Maghrib – 9:30 PM, or Overnight Fri-Sun"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 italic">
                      Use this for non-standard schedules, prayer-anchored times, or multi-day campout descriptions.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-400" /> Location / Venue Address
                  </label>
                  <span className="text-[10px] text-slate-400">Headquarters or venue name</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Highview Elementary School (25225 Richardson St, Dearborn Heights, MI 48127)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setLocation('Highview Elementary School (25225 Richardson St, Dearborn Heights, MI 48127)')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-750 hover:border-emerald-700 rounded-lg transition cursor-pointer"
                  >
                    🏫 Highview Elementary (25225 Richardson St)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('6514 Kinloch St, Dearborn Heights, MI 48127')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-amber-950 hover:text-amber-300 text-slate-300 border border-slate-750 hover:border-amber-700 rounded-lg transition cursor-pointer"
                  >
                    🏠 Leader Hassan Issa (6514 Kinloch St)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('Hype Athletics (23302 W Warren Ave, Dearborn Heights, MI 48127)')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-purple-950 hover:text-purple-300 text-slate-300 border border-slate-750 hover:border-purple-700 rounded-lg transition cursor-pointer"
                  >
                    🏟️ Hype Athletics (23302 W Warren Ave)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation("D' Bar A Scout Ranch (880 E Sutton Rd, Metamora, MI 48455)")}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-sky-950 hover:text-sky-300 text-slate-300 border border-slate-750 hover:border-sky-700 rounded-lg transition cursor-pointer"
                  >
                    🏕️ D' Bar A Scout Ranch
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('Masjid / Community Hall (Dearborn Heights, MI)')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-teal-950 hover:text-teal-300 text-slate-300 border border-slate-750 hover:border-teal-700 rounded-lg transition cursor-pointer"
                  >
                    🕌 Masjid / Community Hall
                  </button>
                </div>
              </div>

              {/* Push Scope & Executive Controls */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Event Visibility & Scope
                </label>
                {isExecutive ? (
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">⚡ Push to Entire Troop (All Patrols)</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} Patrol Only</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-400">
                    Scoped to your assigned patrol: <strong className="text-emerald-400">{groups.find(g => g.id === currentUser?.groupId)?.name || 'My'} Patrol</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event Description & Program Details</label>
                <textarea
                  rows={3}
                  placeholder="Detailed schedule, objective, and instructions for parents & scouts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* ── INTERACTIVE REQUIRED GEAR & PACKING CHECKLIST ── */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                      <CheckSquare size={14} className="text-emerald-400" />
                      <span>Required Gear & Items Checklist</span>
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Select checkboxes to automatically build the required gear list, or type custom items below.
                    </p>
                  </div>

                  {/* Quick Package Presets */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleApplyGearPackage('friday_meeting')}
                      className="text-[10px] font-bold px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 rounded-lg transition cursor-pointer"
                      title="Class A, Handbook, Pen & Notebook, Water Bottle"
                    >
                      🏕️ Friday Meeting
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGearPackage('tuesday_halqa')}
                      className="text-[10px] font-bold px-2 py-1 bg-teal-950/60 hover:bg-teal-900 text-teal-300 border border-teal-600/50 rounded-lg transition cursor-pointer"
                      title="Class B, Handbook, Materials, Water Bottle"
                    >
                      🕌 Tuesday Halqa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGearPackage('overnight_camp')}
                      className="text-[10px] font-bold px-2 py-1 bg-sky-950/60 hover:bg-sky-900 text-sky-300 border border-sky-600/50 rounded-lg transition cursor-pointer"
                      title="Full Camping Pack: Sleeping Bag, Mess Kit, Boots, First Aid, Prayer Rug, etc."
                    >
                      ⛺ Campout
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGearPackage('service_project')}
                      className="text-[10px] font-bold px-2 py-1 bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-600/50 rounded-lg transition cursor-pointer"
                      title="Class B, Work Gloves, Water Bottle, First Aid"
                    >
                      🤝 Service
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGearPackage('clear')}
                      className="text-[10px] font-semibold px-1.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-750 rounded-lg transition cursor-pointer"
                      title="Clear checklist"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Checkbox Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {STANDARD_GEAR_OPTIONS.map((gear) => {
                    const checked = isGearItemChecked(gear.label);
                    return (
                      <button
                        key={gear.id}
                        type="button"
                        onClick={() => handleToggleGearItem(gear.label)}
                        className={`text-left p-2 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                          checked
                            ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">{gear.icon}</span>
                          <span className="text-xs font-medium truncate">{gear.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                          checked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950 text-transparent'
                        }`}>
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Editable Freeform Text Box for Custom / Additional Gear */}
                <div className="pt-2 border-t border-slate-850">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Compiled Gear List & Custom Additions (Editable Text)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Complete Class A Field Uniform, Scout Handbook, Water Bottle, Swim Trunks..."
                    value={requiredItems}
                    onChange={(e) => setRequiredItems(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Publish Event'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── UPCOMING CONFIRMED 1-ON-1 LEADER CONFERENCES ── */}
      {timeHorizon === 'upcoming' && confirmedConferences.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border-2 border-sky-500/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-300 shrink-0 shadow-md">
                <Calendar size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase bg-sky-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                    1-on-1 Conference
                  </span>
                  <span className="text-xs text-sky-400 font-mono font-bold">
                    {confirmedConferences.length} Scheduled
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-0.5">
                  Confirmed Leader & Parent Conferences
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {!isParent && (
                <button
                  type="button"
                  onClick={() => setShowScheduleMeetingModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus size={13} />
                  <span>➕ Schedule Conference</span>
                </button>
              )}

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate(isParent ? 'parent-hub' : 'parent-requests', { filterTab: 'meeting_request' })}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto hover:underline bg-sky-950/60 border border-sky-500/40 px-3 py-1.5 rounded-xl transition"
                >
                  <span>{isParent ? 'Open Parent Hub' : 'Manage Inquiries'}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {confirmedConferences.map(conf => {
              const waMsg = encodeURIComponent(
                `Salam ${conf.parentName}, reminder regarding the upcoming conference for ${conf.scoutName} scheduled for ${conf.confirmedDate} at ${conf.confirmedTime || '6:30 PM'} at ${conf.meetingLocation || 'Troop Headquarters'}.`
              );
              const waPhone = (conf.parentPhone || '').replace(/[^0-9]/g, '');

              return (
                <div
                  key={conf.id || conf.requestId}
                  className="bg-slate-950/90 border border-sky-500/40 hover:border-sky-400/80 transition p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono font-bold text-sky-400 uppercase bg-sky-950/70 border border-sky-500/30 px-2 py-0.5 rounded-md">
                          {conf.patrolName || 'Troop 1318'}
                        </span>
                        {conf.rsvpStatus && (
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            conf.rsvpStatus === 'attending'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : conf.rsvpStatus === 'reschedule_requested'
                              ? 'bg-amber-950 text-amber-300 border-amber-500'
                              : conf.rsvpStatus === 'declined'
                              ? 'bg-rose-950 text-rose-300 border-rose-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {conf.rsvpStatus === 'attending' ? '✓ RSVP: Confirmed' : conf.rsvpStatus === 'reschedule_requested' ? '🔄 Reschedule Req' : '⏳ RSVP: Pending'}
                          </span>
                        )}
                      </div>
                      <strong className="text-sm font-black text-white block">
                        {conf.scoutName}
                      </strong>
                      <span className="text-xs text-slate-300">
                        Parent: <strong>{conf.parentName}</strong>
                      </span>
                      {conf.meetingTopic && (
                        <div className="text-[11px] text-sky-300 font-medium mt-0.5">
                          📌 {conf.meetingTopic}
                        </div>
                      )}
                    </div>
                    <ConferenceCountdown date={conf.confirmedDate} time={conf.confirmedTime} variant="pill" />
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <Calendar size={13} className="text-emerald-400 shrink-0" />
                      <span>{conf.confirmedDate} at {conf.confirmedTime || '6:30 PM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-sky-400 shrink-0" />
                      <span className="truncate">{conf.meetingLocation || 'Troop Headquarters'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={13} className="text-sky-400 shrink-0" />
                      <span>Leader: <strong>{conf.confirmedBy || 'Troop Leader'}</strong> ({conf.confirmedByRole || 'Leader'})</span>
                    </div>
                    {conf.confirmationNote && (
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                        "{conf.confirmationNote}"
                      </p>
                    )}
                  </div>

                  {/* Actions Toolbar on Card */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}?text=${waMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                          title="Message parent on WhatsApp"
                        >
                          <span>💬 WhatsApp</span>
                        </a>
                      )}
                      {conf.parentPhone && (
                        <a
                          href={`tel:${conf.parentPhone}`}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                          title="Call parent"
                        >
                          <Phone size={11} />
                          <span>Call</span>
                        </a>
                      )}
                    </div>

                    {onNavigate && !isParent && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onNavigate('parent-requests', {
                            requestId: conf.id || conf.requestId,
                            confirmMeeting: true,
                            filterTab: 'meeting_request'
                          })}
                          className="px-3 py-1.5 bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 border border-sky-500/50 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>✏️ Edit / Reschedule</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelConference(conf)}
                          disabled={cancellingConfId === (conf.id || conf.requestId)}
                          className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-600/50 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Cancel and remove this conference from schedule"
                        >
                          <Trash2 size={11} />
                          <span>{cancellingConfId === (conf.id || conf.requestId) ? 'Removing...' : 'Cancel'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('parent-requests', {
                            requestId: conf.id || conf.requestId,
                            filterTab: 'meeting_request'
                          })}
                          className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer hover:text-white"
                        >
                          <span>Manage &rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── EVENTS WORKSPACE: LIST & DETAIL VIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Events List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              {timeHorizon === 'upcoming' ? (
                <>
                  <CalendarDays size={15} className="text-emerald-400" />
                  <span>Upcoming Schedule ({filteredEvents.length})</span>
                </>
              ) : timeHorizon === 'past' ? (
                <>
                  <History size={15} className="text-purple-400" />
                  <span>Past Events Archive ({filteredEvents.length})</span>
                </>
              ) : (
                <>
                  <Layers size={15} className="text-slate-400" />
                  <span>All Events ({filteredEvents.length})</span>
                </>
              )}
            </h3>

            {isLeader && filteredEvents.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-emerald-300 border border-slate-700/60 shadow-sm"
              >
                <span>{allFilteredSelected ? '✓ Deselect All' : '☑️ Select All'}</span>
              </button>
            )}
          </div>

          {/* ── BATCH MULTI-SELECT ACTION BAR ── */}
          {isLeader && selectedEventIds.size > 0 && (
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500/70 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center font-black text-sm shrink-0 shadow-inner">
                  {selectedEventIds.size}
                </div>
                <div>
                  <strong className="text-white text-xs sm:text-sm block leading-tight">
                    {selectedEventIds.size} Event{selectedEventIds.size > 1 ? 's' : ''} Selected
                  </strong>
                  <span className="text-[10px] text-slate-300">
                    Ready for instant batch deletion
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedEventIds(new Set())}
                  className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border border-slate-750"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelectedEvents}
                  disabled={isBatchDeleting}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/60 disabled:opacity-50"
                >
                  {isBatchDeleting ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  <span>Delete Selected ({selectedEventIds.size})</span>
                </button>
              </div>
            </div>
          )}

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-slate-850 rounded-3xl border border-slate-755 text-slate-400 text-xs italic space-y-2">
              <p>
                {timeHorizon === 'past'
                  ? 'No past events found in this category.'
                  : timeHorizon === 'upcoming'
                  ? 'No upcoming events scheduled.'
                  : 'No events match your filter.'}
              </p>
              {isExecutive && (
                <button
                  onClick={() => setShowGeneratorModal(true)}
                  className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline text-xs cursor-pointer"
                >
                  <Zap size={13} /> Auto-Generate Calendar
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredEvents.map(ev => {
                const cls = getActivityClassification(ev);
                const isSelected = selectedEvent?.id === ev.id;
                const isChecked = selectedEventIds.has(ev.id);
                const rsvpSum = getEventRsvpSummary(ev);
                const isPast = (ev.date || '') < todayStr;
                const isFriday = ev.recurringPattern === 'weekly_friday' || new Date(ev.date + 'T12:00:00').getDay() === 5;
                const isTuesday = ev.recurringPattern === 'weekly_tuesday' || new Date(ev.date + 'T12:00:00').getDay() === 2;

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 shadow-sm ${
                      isChecked
                        ? 'border-rose-500/70 bg-rose-950/20'
                        : isSelected
                        ? isPast 
                          ? 'bg-purple-950/40 border-purple-500/60 shadow-purple-950/40'
                          : 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-950/30'
                        : 'bg-slate-850 border-slate-755 hover:border-slate-650'
                    }`}
                  >
                    {isLeader && (
                      <button
                        type="button"
                        onClick={(e) => handleToggleSelectEvent(ev.id, e)}
                        className="pt-0.5 shrink-0 cursor-pointer p-1.5 -m-1.5 rounded-xl hover:bg-slate-755/60 transition-colors focus:outline-none"
                        title={isChecked ? "Deselect event" : "Select event for batch deletion"}
                        aria-label={isChecked ? `Deselect ${ev.title}` : `Select ${ev.title} for batch delete`}
                      >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-950/80 scale-105' 
                            : 'border-slate-600 bg-slate-900/90 hover:border-slate-400'
                        }`}>
                          {isChecked && (
                            <Check size={13} strokeWidth={3.5} className="text-white" />
                          )}
                        </div>
                      </button>
                    )}

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isPast 
                              ? 'text-purple-300 bg-purple-500/10 border-purple-500/30'
                              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          }`}>
                            📅 {ev.date}
                          </span>
                          
                          {/* Activity Subtype Chip */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${cls.badgeClass}`}>
                            <span>{cls.subtypeIcon}</span>
                            <span>{cls.subtypeLabel}</span>
                          </span>

                          {cls.serviceHoursCredited > 0 && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <span>⏳</span>
                              <span>{cls.serviceHoursCredited}h Service</span>
                            </span>
                          )}

                          {isPast && (
                            <span className="text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                              ✓ Past
                            </span>
                          )}
                          {ev.isStandalone && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isFriday ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                            }`}>
                              {isFriday ? 'Fri' : isTuesday ? 'Tue' : 'Weekly'}
                            </span>
                          )}
                          {ev.requiresRsvp === false && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30">
                              🔓 Open
                            </span>
                          )}
                        </div>

                        {/* Live RSVP Status Pills on Card */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border flex items-center gap-1 ${
                            rsvpSum.attending > 0 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-sm' 
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}>
                            <Users size={11} />
                            <span>{rsvpSum.attending} {isPast ? 'Attended' : 'Going'}</span>
                          </span>
                          {rsvpSum.tentative > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">
                              ? {rsvpSum.tentative}
                            </span>
                          )}
                        </div>
                      </div>

                      <strong className="text-sm font-bold text-white block leading-snug truncate">{ev.title}</strong>
                      
                      {(() => {
                        const aud = getEventAudienceInfo(ev, currentUser, groups, linkedScouts);
                        return (
                          <div className="pt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${aud.colorClass}`}>
                              <span>{aud.icon}</span>
                              <span className="font-bold">{aud.badge}</span>
                            </span>

                            {/* Islamic Occasion Badge on Card */}
                            {(ev.islamicOccasion || (ev.islamicOccasions && ev.islamicOccasions.length > 0)) && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35">
                                <span>🕌</span>
                                <span className="truncate max-w-[200px]">{ev.islamicOccasion || ev.islamicOccasions?.map(i => i.name).join(' & ')}</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Special Excel Note snippet if present and not already displayed as Islamic occasion */}
                      {(ev.rawNotes || ev.notes) && !ev.islamicOccasion && (!ev.islamicOccasions || ev.islamicOccasions.length === 0) && (
                        <div className="text-[10px] text-amber-300/90 font-medium bg-amber-950/30 border border-amber-500/20 px-2 py-0.5 rounded-lg truncate max-w-full">
                          <span>📝 Note: {ev.rawNotes || ev.notes}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                        <span>⏰ {ev.time}</span>
                        {getEventDisplayDuration(ev) && <span>&bull; {getEventDisplayDuration(ev)}</span>}
                      </div>

                      {ev.location && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-xl w-fit max-w-full">
                          <MapPin size={11} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      )}

                      {/* Action Bar on Card: Quick WhatsApp Reminder */}
                      {isLeader && (
                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-755/80 mt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenWhatsAppReminder(ev);
                            }}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-500/60 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                            title="Generate and send WhatsApp reminder message"
                          >
                            <MessageSquare size={12} className="text-emerald-400" />
                            <span>💬 WhatsApp Reminder</span>
                          </button>

                          <span className="text-[10px] text-slate-500 font-mono">
                            {ev.isStandalone ? 'Weekly' : 'Event'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Event Detail & RSVP Center */}
        {selectedEvent ? (
          <div className="lg:col-span-2 space-y-5">
            <div className={`border rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 ${
              (selectedEvent.date || '') < todayStr
                ? 'bg-slate-850 border-purple-500/30'
                : 'bg-slate-850 border-slate-755'
            }`}>
              {/* Event Header */}
              {(() => {
                const cls = getActivityClassification(selectedEvent);
                return (
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-750 pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Primary Event Type Badge */}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border flex items-center gap-1 ${cls.badgeClass}`}>
                          <span>{cls.typeIcon}</span>
                          <span>{cls.typeLabel}</span>
                        </span>

                        {/* Granular Activity Subtype Badge */}
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <span>{cls.subtypeIcon}</span>
                          <span>{cls.subtypeLabel}</span>
                        </span>

                        {/* Service Hours Credited Badge */}
                        {cls.serviceHoursCredited > 0 && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <span>⏳</span>
                            <span>{cls.serviceHoursCredited} Service Hours Credited</span>
                          </span>
                        )}

                        {(selectedEvent.date || '') < todayStr ? (
                          <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <History size={11} /> Completed / Past Session
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CalendarDays size={11} /> Upcoming Event
                          </span>
                        )}
                        {selectedEvent.isStandalone && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Zap size={10} /> Standalone Session
                          </span>
                        )}
                        {selectedEvent.requiresRsvp === false ? (
                          <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <span>🔓</span> Open Attendance
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <span>📝</span> RSVP Required
                          </span>
                        )}
                        {(selectedEvent.islamicOccasion || (selectedEvent.islamicOccasions && selectedEvent.islamicOccasions.length > 0)) && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <span>🕌</span> {selectedEvent.islamicOccasion || selectedEvent.islamicOccasions?.map(i => i.name).join(' & ')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-white">{selectedEvent.title}</h3>
                      
                      {/* High Visibility Target Audience Banner */}
                      {(() => {
                        const aud = getEventAudienceInfo(selectedEvent, currentUser, groups, linkedScouts);
                        return (
                          <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${aud.colorClass}`}>
                            <span className="text-xl shrink-0">{aud.icon}</span>
                            <div className="min-w-0">
                              <strong className="block text-xs uppercase tracking-wider font-black">{aud.badge}</strong>
                              <span className="text-[11px] opacity-90 block">{aud.label}</span>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 flex-wrap font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-emerald-400" /> {selectedEvent.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={13} className="text-emerald-400" /> {selectedEvent.time}</span>
                        {getEventDisplayDuration(selectedEvent) && (
                          <span className="flex items-center gap-1.5"><Hourglass size={13} className="text-emerald-400" /> {getEventDisplayDuration(selectedEvent)} duration</span>
                        )}
                      </div>
                    </div>

                    {isLeader && (
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {/* Send WhatsApp Reminder Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppReminder(selectedEvent)}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40 hover:scale-[1.02]"
                          title="Generate and broadcast WhatsApp reminder message with event info"
                        >
                          <MessageSquare size={14} className="text-emerald-200" />
                          <span>💬 Send WhatsApp Reminder</span>
                        </button>

                        {/* Print Roster / Muster Sheet */}
                        <button
                          type="button"
                          onClick={() => setShowPrintRosterModal(true)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-sm"
                          title="Print Attendance & RSVP Check-in Roster"
                        >
                          <Printer size={14} className="text-emerald-400" />
                          <span>Print Roster</span>
                        </button>

                        {/* Take Attendance (Enabled for all leaders on all events) */}
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('attendance', { 
                            date: selectedEvent.date, 
                            eventType: mapCategoryToEventType(selectedEvent.category || selectedEvent.eventType), 
                            notes: selectedEvent.title 
                          })}
                          className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-950/40 hover:scale-[1.02]"
                          title="Take Roll Call / Attendance for this event"
                        >
                          <CheckSquare size={14} />
                          <span>📋 Take Attendance</span>
                        </button>

                        {canUserEditEvent(selectedEvent) ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(selectedEvent)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                              title="Edit Patrol Event"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(selectedEvent.id)}
                              className="p-2 bg-slate-800 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                              title="Delete Patrol Event"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-755 px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-1 shadow-inner" title="Troop-wide event managed by Scoutmaster or Troop Administrator">
                            <span>🔒</span> Troop-Wide Event
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── PROMINENT LOCATION & VENUE CARD ── */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/35 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 flex items-center gap-1">
                      📍 Event Location & Venue
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white leading-snug mt-0.5">
                      {selectedEvent.location || 'Highview Elementary School (Troop Headquarters)'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Official assembly, meeting, and activity venue for this session.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location || 'Highview Elementary School')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-emerald-950/50 shrink-0 cursor-pointer"
                >
                  <MapPin size={13} />
                  <span>Directions / Map</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* ── SERVICE HOURS CREDITED HERO CARD ── */}
              {(() => {
                const cls = getActivityClassification(selectedEvent);
                if (cls.serviceHoursCredited <= 0) return null;
                return (
                  <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 border-2 border-amber-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-fadeIn">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                        ⏳
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                            🌟 BSA Service Hours Credited
                          </span>
                          <span className="text-xs font-black text-amber-200">
                            {cls.serviceHoursCredited} Hours Available
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white mt-0.5">
                          Volunteering & Community Service Credit
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Scouts attending this session will automatically earn <strong>{cls.serviceHoursCredited} hours</strong> toward their rank advancement service requirement.
                        </p>
                      </div>
                    </div>

                    <div className="px-3.5 py-2 bg-amber-500/15 border border-amber-500/40 rounded-xl text-center shrink-0 self-start sm:self-auto shadow-inner">
                      <span className="text-lg font-black text-amber-300 font-mono block">+{cls.serviceHoursCredited}h</span>
                      <span className="text-[9px] uppercase font-bold text-amber-400/90 tracking-wider">Service Credit</span>
                    </div>
                  </div>
                );
              })()}

              {/* ── ISLAMIC OCCASION & SPIRITUAL MILESTONE CARD ── */}
              {(selectedEvent.islamicOccasion || (selectedEvent.islamicOccasions && selectedEvent.islamicOccasions.length > 0)) && (
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-2xl p-4 flex items-start gap-3.5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                    🕌
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
                      Islamic Occasion & Spiritual Milestone
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {selectedEvent.islamicOccasion || selectedEvent.islamicOccasions?.map(i => i.name).join(' & ')}
                    </h4>
                    {selectedEvent.rawNotes && (
                      <p className="text-[11px] text-slate-300 italic pt-0.5">
                        "{selectedEvent.rawNotes}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Special Calendar Notes / Remarks */}
              {(selectedEvent.rawNotes || selectedEvent.notes) && !selectedEvent.islamicOccasion && (!selectedEvent.islamicOccasions || selectedEvent.islamicOccasions.length === 0) && (
                <div className="p-3.5 bg-slate-900/90 border border-slate-750 rounded-2xl text-xs space-y-1">
                  <strong className="text-amber-300 uppercase text-[10px] block font-bold flex items-center gap-1.5">
                    <span>📝</span> Special Calendar Notes & Remarks:
                  </strong>
                  <p className="text-slate-200">{selectedEvent.rawNotes || selectedEvent.notes}</p>
                </div>
              )}

              {/* Description */}
              {selectedEvent.description && (
                <div className="space-y-1 text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-2xl border border-slate-755">
                  <strong className="text-white block uppercase text-[10px] font-bold text-slate-400">Program Outline & Instructions:</strong>
                  <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              )}

              {/* Required Items */}
              {selectedEvent.requiredItems && (
                <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs space-y-1">
                  <strong className="text-amber-400 uppercase text-[10px] block font-bold">🎒 Packing List & Required Gear:</strong>
                  <p className="text-slate-200">{selectedEvent.requiredItems}</p>
                </div>
              )}

              {/* ── INTERACTIVE RSVP MODULE (PARENTS & SCOUTS) ── */}
              <div className="bg-slate-900 border border-slate-750 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <CheckSquare size={16} className="text-emerald-400" />
                    <span>
                      {(selectedEvent.date || '') < todayStr ? 'Your Family Event Attendance Record' : 'Your Family Event RSVP'}
                    </span>
                  </h4>
                  {rsvpSuccessMsg && <span className="text-xs text-emerald-400 font-bold">{rsvpSuccessMsg}</span>}
                </div>

                {selectedEvent.requiresRsvp === false && (
                  <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-3 text-xs text-sky-300 flex items-center gap-2.5">
                    <span className="text-lg">🔓</span>
                    <p className="leading-snug text-[11px]">
                      <strong>Open Attendance Session:</strong> Pre-event RSVP is not required. Attendance will be recorded during roll-call at the venue. You may still indicate carpool driver availability below if you wish to assist other scouts.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmitRsvp} className="space-y-3.5">
                  <div className="flex gap-2">
                    {[
                      { id: 'attending', label: (selectedEvent.date || '') < todayStr ? '✓ Attended' : '✓ Going / Attending', color: 'bg-emerald-600 text-white' },
                      { id: 'tentative', label: (selectedEvent.date || '') < todayStr ? '❓ Partial' : '❓ Tentative', color: 'bg-amber-600 text-white' },
                      { id: 'not_attending', label: (selectedEvent.date || '') < todayStr ? '✗ Absent' : '✗ Not Attending', color: 'bg-slate-800 text-slate-400' }
                    ].map(st => (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setRsvpStatus(st.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          rsvpStatus === st.id ? `${st.color} border-emerald-500 shadow-md` : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Utensils size={12} className="text-amber-400" /> Dietary Restrictions / Allergies
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Halal, Peanut Allergy"
                        value={rsvpDietary}
                        onChange={(e) => setRsvpDietary(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Car size={12} className="text-sky-400" /> Carpool Driver Volunteer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rsvpDriverAvailable}
                            onChange={(e) => setRsvpDriverAvailable(e.target.checked)}
                          />
                          <span>Can drive scouts</span>
                        </label>
                        {rsvpDriverAvailable && (
                          <input
                            type="number"
                            min="1"
                            max="8"
                            placeholder="Seats"
                            value={rsvpSeats}
                            onChange={(e) => setRsvpSeats(e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white text-center"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Carpool / Additional Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Leaving at 6:15 PM from North center..."
                      value={rsvpNotes}
                      onChange={(e) => setRsvpNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpSaving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <Check size={14} />
                    <span>{rsvpSaving ? 'Saving...' : (selectedEvent.date || '') < todayStr ? 'Update Attendance Note' : 'Submit / Update RSVP'}</span>
                  </button>
                </form>
              </div>

              {/* ── LEADER COMPREHENSIVE RSVP ATTENDEE MANAGEMENT & ROSTER CENTER ── */}
              {isLeader && (
                <div className="bg-slate-900 border border-slate-750 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
                  {/* Header & Live KPI Stat Pills */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                        <Users size={16} className="text-emerald-400" />
                        <span>
                          👥 {(selectedEvent.date || '') < todayStr ? 'Event Attendees & Attendance Roster' : 'RSVP Attendees & Response Roster'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Track confirmed scout attendees, volunteer carpool drivers, and pending families.
                      </p>
                    </div>

                    {leaderRsvpMsg && (
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-700 animate-fadeIn">
                        {leaderRsvpMsg}
                      </span>
                    )}
                  </div>

                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40 text-center shadow-sm">
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">✓ Confirmed Attending</span>
                      <strong className="text-lg font-black text-emerald-300 font-mono">{attendingCount}</strong>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/40 text-center shadow-sm">
                      <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">❓ Tentative</span>
                      <strong className="text-lg font-black text-amber-300 font-mono">{tentativeCount}</strong>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-750 text-center shadow-sm">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">✗ Declined</span>
                      <strong className="text-lg font-black text-slate-300 font-mono">{notAttendingCount}</strong>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/30 text-center shadow-sm">
                      <span className="text-[10px] uppercase font-black tracking-wider text-sky-400 block">⏳ No Response</span>
                      <strong className="text-lg font-black text-sky-300 font-mono">{pendingCount}</strong>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-teal-500/40 text-center shadow-sm">
                      <span className="text-[10px] uppercase font-black tracking-wider text-teal-400 block">🚗 Carpool Capacity</span>
                      <strong className="text-lg font-black text-teal-300 font-mono">{selectedEventAttendeeData.totalSeats} seats</strong>
                      <span className="text-[9px] text-slate-400 block">({selectedEventAttendeeData.totalDrivers} drivers)</span>
                    </div>
                  </div>

                  {/* Dietary & Allergy Warning Box */}
                  {selectedEventAttendeeData.dietaryAlerts.length > 0 && (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-2xl text-xs space-y-1">
                      <strong className="text-amber-400 uppercase text-[10px] font-bold flex items-center gap-1.5">
                        <Utensils size={13} /> Special Dietary Needs & Allergies ({selectedEventAttendeeData.dietaryAlerts.length}):
                      </strong>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedEventAttendeeData.dietaryAlerts.map((d, i) => (
                          <span key={i} className="text-[11px] bg-slate-900 border border-amber-500/30 text-slate-200 px-2.5 py-0.5 rounded-lg">
                            <strong className="text-amber-300">{d.name}:</strong> {d.dietary}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filter Tabs & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
                      {[
                        { id: 'all', label: `All (${selectedEventAttendeeData.attendees.length})` },
                        { id: 'attending', label: `✓ Attending (${attendingCount})`, color: 'text-emerald-300' },
                        { id: 'tentative', label: `❓ Tentative (${tentativeCount})`, color: 'text-amber-300' },
                        { id: 'not_attending', label: `✗ Declined (${notAttendingCount})`, color: 'text-slate-300' },
                        { id: 'pending', label: `⏳ No Response (${pendingCount})`, color: 'text-sky-300' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setRsvpFilterTab(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                            rsvpFilterTab === tab.id
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-56">
                      <Search className="absolute left-3 top-2.5 text-slate-500" size={13} />
                      <input
                        type="text"
                        placeholder="Search attendee..."
                        value={rsvpSearchQuery}
                        onChange={(e) => setRsvpSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Attendee Cards List */}
                  {(() => {
                    const filteredAttendees = selectedEventAttendeeData.attendees.filter(a => {
                      if (rsvpFilterTab !== 'all' && a.status !== rsvpFilterTab) return false;
                      if (rsvpSearchQuery.trim()) {
                        const q = rsvpSearchQuery.toLowerCase();
                        return a.name.toLowerCase().includes(q) || a.patrol.toLowerCase().includes(q) || (a.notes || '').toLowerCase().includes(q) || (a.parentName || '').toLowerCase().includes(q);
                      }
                      return true;
                    });

                    if (filteredAttendees.length === 0) {
                      return (
                        <p className="text-xs text-slate-500 italic py-6 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
                          No attendees match the current filter.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {filteredAttendees.map((att, idx) => {
                          const isGoing = att.status === 'attending';
                          const isTentative = att.status === 'tentative';
                          const isDeclined = att.status === 'not_attending';
                          const isNoResponse = att.status === 'pending';

                          return (
                            <div
                              key={att.id || idx}
                              className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                isGoing
                                  ? 'bg-emerald-950/20 border-emerald-500/35 hover:border-emerald-400'
                                  : isTentative
                                  ? 'bg-amber-950/20 border-amber-500/35 hover:border-amber-400'
                                  : isDeclined
                                  ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                              }`}
                            >
                              {/* Left: Attendee Info */}
                              <div className="flex items-start gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                                  isGoing ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                                  isTentative ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                                  isDeclined ? 'bg-slate-800 text-slate-400 border-slate-700' :
                                  'bg-slate-900 text-slate-500 border-slate-800'
                                }`}>
                                  {att.photoURL ? (
                                    <img src={att.photoURL} alt={att.name} className="w-full h-full object-cover rounded-xl" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                  ) : (
                                    <span>{att.name.charAt(0).toUpperCase()}</span>
                                  )}
                                </div>

                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <strong className="text-white text-xs font-bold leading-tight truncate">
                                      {att.name}
                                    </strong>
                                    <span className="text-[10px] bg-slate-900 border border-slate-750 px-2 py-0.2 rounded-full font-semibold text-slate-300">
                                      {att.patrol}
                                    </span>
                                    {att.rank && att.rank !== 'Scout' && (
                                      <span className="text-[10px] text-amber-300 font-bold">
                                        ({att.rank})
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      {att.roleLabel}
                                    </span>
                                  </div>

                                  {/* Badges: Carpool, Dietary, Notes, Parent */}
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                                    {att.driverAvailable && (
                                      <span className="text-teal-300 bg-teal-950/60 border border-teal-700 px-2 py-0.2 rounded-md font-bold flex items-center gap-1">
                                        🚗 Driver ({att.seats} seats)
                                      </span>
                                    )}
                                    {att.dietary && (
                                      <span className="text-amber-300 bg-amber-950/60 border border-amber-700 px-2 py-0.2 rounded-md font-semibold">
                                        🍽️ {att.dietary}
                                      </span>
                                    )}
                                    {att.notes && (
                                      <span className="text-slate-300 italic">
                                        "{att.notes}"
                                      </span>
                                    )}
                                    {att.parentName && att.parentName !== att.name && (
                                      <span className="text-slate-400">
                                        Parent: <strong className="text-slate-200">{att.parentName}</strong>
                                      </span>
                                    )}
                                  </div>

                                  {/* Contact Links */}
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 flex-wrap">
                                    {(att.parentPhone || att.userPhone) && (
                                      <a
                                        href={`tel:${att.parentPhone || att.userPhone}`}
                                        className="text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
                                      >
                                        <Phone size={10} /> {att.parentPhone || att.userPhone}
                                      </a>
                                    )}
                                    {(att.parentPhone || att.userPhone) && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenWhatsAppReminder(selectedEvent, att);
                                        }}
                                        className="text-[10px] text-emerald-300 hover:text-emerald-100 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono font-bold transition cursor-pointer"
                                        title={`Send WhatsApp reminder directly to ${att.name}`}
                                      >
                                        <MessageSquare size={10} />
                                        <span>💬 WhatsApp</span>
                                      </button>
                                    )}
                                    {att.userEmail && (
                                      <a
                                        href={`mailto:${att.userEmail}`}
                                        className="text-slate-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[140px]"
                                      >
                                        <Mail size={10} /> {att.userEmail}
                                      </a>
                                    )}
                                    {att.submittedAt && (
                                      <span className="text-slate-500 font-mono text-[9px]">
                                        &bull; {new Date(att.submittedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Status Pill & Quick Leader Override Buttons */}
                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
                                  isGoing ? 'bg-emerald-950 text-emerald-200 border-emerald-600 shadow-sm' :
                                  isTentative ? 'bg-amber-950 text-amber-200 border-amber-600' :
                                  isDeclined ? 'bg-slate-900 text-slate-400 border-slate-750' :
                                  'bg-slate-900 text-sky-300 border-sky-800'
                                }`}>
                                  {isGoing ? <><Check size={11} /> Attending</> :
                                   isTentative ? <><HelpCircle size={11} /> Tentative</> :
                                   isDeclined ? <><X size={11} /> Declined</> :
                                   <><Clock size={11} /> No Response</>}
                                </span>

                                {/* Leader One-Click Status Override Dropdown/Buttons */}
                                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                  <button
                                    type="button"
                                    onClick={() => handleLeaderOverrideRsvp(selectedEvent.id, att, 'attending')}
                                    disabled={leaderUpdatingRsvp || isGoing}
                                    title="Mark as Attending"
                                    className={`p-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                      isGoing ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLeaderOverrideRsvp(selectedEvent.id, att, 'tentative')}
                                    disabled={leaderUpdatingRsvp || isTentative}
                                    title="Mark as Tentative"
                                    className={`p-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                      isTentative ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    ?
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLeaderOverrideRsvp(selectedEvent.id, att, 'not_attending')}
                                    disabled={leaderUpdatingRsvp || isDeclined}
                                    title="Mark as Declined"
                                    className={`p-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                      isDeclined ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-red-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    ✗
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 text-center py-20 bg-slate-850 rounded-3xl border border-slate-755 text-slate-400 text-xs">
            {timeHorizon === 'past' 
              ? 'Select a past completed event from the archive to review notes and attendance logs.'
              : 'Select an event from the schedule to view details and submit RSVP.'}
          </div>
        )}
      </div>

      {/* ── PRINTABLE MUSTER ROLL & CHECK-IN MODAL ── */}
      {showPrintRosterModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 print-hide">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  <Printer size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Printable Event Check-In & Muster Sheet</h3>
                  <p className="text-[11px] text-slate-400">Official roster for attendance check-in, carpools, and emergency contacts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg"
                >
                  <Printer size={14} />
                  <span>Print Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintRosterModal(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Content Block */}
            <div className="bg-white text-slate-900 p-6 rounded-2xl space-y-4 font-sans text-xs">
              {/* Official Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚜️</span>
                    <h2 className="text-base font-black uppercase tracking-tight text-slate-950">
                      Dhulfiqār Scouts &bull; Event Muster Sheet
                    </h2>
                  </div>
                  <h3 className="text-lg font-black text-emerald-800 mt-1">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    📅 {selectedEvent.date} &bull; ⏰ {selectedEvent.time} &bull; 📍 {selectedEvent.location || 'Troop Headquarters'}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono">
                  <span className="font-bold block">Confirmed Going: {attendingCount}</span>
                  <span className="text-slate-600 block">Carpool Seats: {selectedEventAttendeeData.totalSeats}</span>
                  <span className="text-slate-500 text-[10px]">Printed: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Special Dietary / Allergy Alert Box */}
              {selectedEventAttendeeData.dietaryAlerts.length > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-900">
                  <strong className="uppercase font-bold">⚠️ Special Dietary / Medical Alerts: </strong>
                  {selectedEventAttendeeData.dietaryAlerts.map(d => `${d.name} (${d.dietary})`).join('; ')}
                </div>
              )}

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-700">
                      <th className="p-2 border border-slate-300 w-10 text-center">In</th>
                      <th className="p-2 border border-slate-300 w-10 text-center">Out</th>
                      <th className="p-2 border border-slate-300">Scout / Attendee Name</th>
                      <th className="p-2 border border-slate-300">Patrol & Rank</th>
                      <th className="p-2 border border-slate-300">Status</th>
                      <th className="p-2 border border-slate-300">Driver / Carpool</th>
                      <th className="p-2 border border-slate-300">Emergency / Parent Phone</th>
                      <th className="p-2 border border-slate-300">Dietary / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEventAttendeeData.attendees.map((att, i) => (
                      <tr key={i} className={`border-b border-slate-200 ${att.status === 'attending' ? 'bg-emerald-50/40 font-medium' : att.status === 'tentative' ? 'bg-amber-50/40' : 'bg-slate-50 opacity-70'}`}>
                        <td className="p-2 border border-slate-300 text-center font-mono">[  ]</td>
                        <td className="p-2 border border-slate-300 text-center font-mono">[  ]</td>
                        <td className="p-2 border border-slate-300 font-bold text-slate-900">{att.name}</td>
                        <td className="p-2 border border-slate-300">{att.patrol} {att.rank ? `(${att.rank})` : ''}</td>
                        <td className="p-2 border border-slate-300 capitalize font-bold">
                          {att.status === 'attending' ? '✓ Attending' : att.status === 'tentative' ? 'Tentative' : att.status === 'not_attending' ? 'Declined' : 'No Response'}
                        </td>
                        <td className="p-2 border border-slate-300">{att.driverAvailable ? `🚗 Yes (${att.seats} seats)` : 'No'}</td>
                        <td className="p-2 border border-slate-300 font-mono text-[10px]">{att.parentPhone || att.userPhone || '—'}</td>
                        <td className="p-2 border border-slate-300 text-[10px]">{att.dietary || att.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures Footer */}
              <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-6 text-[11px] text-slate-700">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Lead Scoutmaster / Leader Sign-off:</span>
                  <div className="border-b border-slate-400 h-8 mt-1"></div>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Event Date & Final Attendance Count:</span>
                  <div className="border-b border-slate-400 h-8 mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MASTER CALENDAR SYNC & INGESTION MODAL ── */}
      {showMasterSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-6xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  🗓️
                </div>
                <h3 className="font-extrabold text-white text-base">
                  Master Calendar Ingestion & Seeding Engine
                </h3>
              </div>
              <button
                onClick={() => setShowMasterSyncModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <AdminCalendarSync
              currentUser={currentUser}
              onNavigate={(tab) => {
                setShowMasterSyncModal(false);
                if (onNavigate) onNavigate(tab);
              }}
              onClose={() => setShowMasterSyncModal(false)}
            />
          </div>
        </div>
      )}

      {/* ── WHATSAPP REMINDER GENERATOR & BROADCAST MODAL ── */}
      {showWhatsAppModal && whatsappModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-4xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-950/50 shrink-0">
                  💬
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-white text-base">
                      WhatsApp Reminder & Broadcast Messenger
                    </h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      KashafVoice v4.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Faith-rooted, highly readable WhatsApp reminder formatted with Islamic transliteration, event details, and packing lists.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Event Summary Banner */}
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {whatsappModalEvent.category || whatsappModalEvent.eventType || 'Event'}
                  </span>
                  <strong className="text-white text-sm font-bold truncate">{whatsappModalEvent.title}</strong>
                </div>
                <div className="flex items-center gap-3 text-slate-400 flex-wrap font-medium">
                  <span className="flex items-center gap-1 text-emerald-400"><Calendar size={12} /> {whatsappModalEvent.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {whatsappModalEvent.time}</span>
                  {whatsappModalEvent.location && (
                    <span className="flex items-center gap-1 truncate max-w-[260px]"><MapPin size={12} /> {whatsappModalEvent.location}</span>
                  )}
                </div>
              </div>

              {/* Target Audience Badge */}
              {(() => {
                const aud = getEventAudienceInfo(whatsappModalEvent, currentUser, groups, linkedScouts);
                return (
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border self-start sm:self-auto ${aud.colorClass}`}>
                    <span>{aud.icon}</span>
                    <span className="font-bold">{aud.badge}</span>
                  </span>
                );
              })()}
            </div>

            {/* Template / Reminder Style Preset Tabs */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                1. Select Reminder Type & Purpose
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'general', label: '📢 Standard Reminder', desc: 'Full event details, date, time, venue, and gear' },
                  { id: 'urgent', label: '🚨 Urgent / Tomorrow', desc: 'High-priority alert for tomorrow or tonight' },
                  { id: 'rsvp', label: '📝 RSVP Confirmation', desc: 'Focus on attendance confirmation & carpool rides' },
                  { id: 'packing', label: '🎒 Gear & Uniform', desc: 'Emphasize Class A uniform & packing list' }
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleUpdateReminderOption({ type: tmpl.id })}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      whatsappReminderType === tmpl.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{tmpl.label}</span>
                    <span className="text-[10px] text-slate-400 mt-1 leading-snug">{tmpl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options Bar */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                2. Audience & Customization Settings
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Patrol / Troop Scope */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Patrol / Unit Closing Signature
                  </label>
                  <select
                    value={whatsappPatrolId}
                    onChange={(e) => handleUpdateReminderOption({ patrolId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Troop-Wide (Dhulfiqār Scouts Team)</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} Patrol</option>
                    ))}
                  </select>
                </div>

                {/* Recipient Role Greeting */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Recipient Greeting Tone
                  </label>
                  <select
                    value={whatsappRecipientType}
                    onChange={(e) => handleUpdateReminderOption({ recipType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="parent">🌿 Dear Parents (Assalāmu ʿAlaykum dear parents)</option>
                    <option value="scout">⚜️ Dear Scout (Assalāmu ʿAlaykum dear Scout)</option>
                    <option value="leader">🛡️ Dear Leader (Assalāmu ʿAlaykum dear Leader)</option>
                  </select>
                </div>

                {/* Direct Contact Phone (Optional) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center justify-between">
                    <span>Direct Phone (Optional)</span>
                    {whatsappRecipientPhone && (
                      <button
                        type="button"
                        onClick={() => handleUpdateReminderOption({ phone: '', recipName: '' })}
                        className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 313-555-0199 (Blank = Group Chat)"
                    value={whatsappRecipientPhone}
                    onChange={(e) => handleUpdateReminderOption({ phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Leader Custom Note Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Custom Leader Note (Optional insert)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please remember to arrive 15 minutes early for roll call..."
                    value={whatsappCustomNote}
                    onChange={(e) => handleUpdateReminderOption({ customNote: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 sm:pt-2 flex items-center">
                  <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={whatsappIncludeRsvpLink}
                      onChange={(e) => handleUpdateReminderOption({ includeRsvp: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-slate-900 cursor-pointer"
                    />
                    <span>Include Portal & RSVP Link</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Dual Grid: Live Editor + Simulated WhatsApp Bubble Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Editable Textarea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-300 uppercase text-[11px] flex items-center gap-1.5">
                    <Edit3 size={13} className="text-emerald-400" />
                    <span>3. Edit Message Text</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleResetWhatsAppTemplate}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer hover:underline"
                    title="Reset text to the default generated template"
                  >
                    <Sparkles size={11} />
                    <span>Reset to Template</span>
                  </button>
                </div>
                <textarea
                  rows={13}
                  value={whatsappLiveText}
                  onChange={(e) => setWhatsappLiveText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-2xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-y"
                  placeholder="Generated message..."
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>{whatsappLiveText.length} characters &bull; {whatsappLiveText.split('\n').length} lines</span>
                  <span>*bold* _italics_ supported</span>
                </div>
              </div>

              {/* Right: WhatsApp Simulated Chat Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-300 uppercase text-[11px] flex items-center gap-1.5">
                    <Smartphone size={13} className="text-emerald-400" />
                    <span>WhatsApp Chat Live Preview</span>
                  </label>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    {whatsappRecipientPhone ? `Direct to ${whatsappRecipientPhone}` : 'Troop / Patrol Group Chat'}
                  </span>
                </div>

                {/* Simulated WhatsApp Chat Background */}
                <div className="bg-[#0b141a] border border-[#1f2c34] rounded-2xl p-4 min-h-[290px] max-h-[340px] overflow-y-auto space-y-2 shadow-inner flex flex-col justify-between">
                  {/* Chat Message Bubble */}
                  <div className="self-end bg-[#005c4b] text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[95%] shadow-md space-y-2 border border-emerald-600/30">
                    <div className="text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-100">
                      {whatsappLiveText}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/70 font-mono pt-1">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-sky-300 font-bold">✓✓</span>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[9px] text-slate-500 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                      🔒 Messages are end-to-end encrypted in WhatsApp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {whatsappRecipientPhone ? (
                  <span>Will open WhatsApp chat directly with <strong>{whatsappRecipientPhone}</strong></span>
                ) : (
                  <span>Will launch WhatsApp to share with any group or parent contact</span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyWhatsAppMsgText}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-sm"
                >
                  {whatsappCopiedToast ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <a
                  href={getWhatsAppDispatchUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 hover:scale-[1.02]"
                >
                  <Send size={14} />
                  <span>{whatsappRecipientPhone ? 'Send Direct via WhatsApp' : 'Open in WhatsApp / Share to Chat'}</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Parent Meeting Modal */}
      <ScheduleParentMeetingModal
        isOpen={showScheduleMeetingModal}
        onClose={() => setShowScheduleMeetingModal(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
