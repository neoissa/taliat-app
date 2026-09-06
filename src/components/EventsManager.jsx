import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
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
  Layers
} from 'lucide-react';
import { formatKashafEventWhatsApp, applyIslamicTransliteration } from '../utils/kashafVoice';
import { dispatchParentNotification, dispatchPatrolStreamAlert } from '../utils/notificationPipeline';
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

export default function EventsManager({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;
  const isLeader = currentUser?.role === 'leader' || isOwner || isExecutive;
  const isParent = currentUser?.role === 'parent';
  const isScout = !isLeader && !isParent;

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // RSVPs Map: { [eventId]: { [scoutOrParentUid]: rsvpData } }
  const [eventRsvps, setEventRsvps] = useState({});

  // ── TIME HORIZON TABS: 'upcoming' | 'past' | 'all' ──
  const [timeHorizon, setTimeHorizon] = useState('upcoming');

  // Category Filtering & Search
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'standalone' | 'campouts' | 'service' | 'faith'
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

  // 1. Subscribe to events collection
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

  // 2. Subscribe to groups for leader filter
  useEffect(() => {
    if (isLeader) {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
        setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
      });
      return () => unsubGroups();
    }
  }, [isLeader]);

  // 3. Subscribe to RSVPs for the selected event
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

  // Update WhatsApp text when selected event changes (leaders only)
  useEffect(() => {
    if (selectedEvent && isLeader) {
      setCustomWhatsAppMsg(formatKashafEventWhatsApp(selectedEvent));
    }
  }, [selectedEvent, isLeader]);

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
    if (filterTab === 'campouts') list = list.filter(ev => ev.category === 'campout');
    if (filterTab === 'service') list = list.filter(ev => ev.category === 'service');
    if (filterTab === 'faith') list = list.filter(ev => ev.category === 'faith');

    // 3. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(ev => {
        const matchesTitle = (ev.title || '').toLowerCase().includes(q);
        const matchesDate = (ev.date || '').toLowerCase().includes(q);
        const matchesLoc = (ev.location || '').toLowerCase().includes(q);
        const matchesDesc = (ev.description || '').toLowerCase().includes(q);
        return matchesTitle || matchesDate || matchesLoc || matchesDesc;
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

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('18:30');
    setEndTime('21:30');
    setIsAllDay(false);
    setTimeMode('picker');
    setTime('6:30 PM – 9:30 PM');
    setLocation('Highview Elementary School (Troop Headquarters)');
    setCategory('meeting');
    setDescription('');
    setRequiredItems('Complete Class A Field Uniform, Scout Handbook, Water Bottle, Pen & Notebook');
    setQuranVerse('');
    setTargetGroupId(isExecutive ? 'all' : (currentUser?.groupId || 'all'));
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingId(ev.id);
    setTitle(ev.title || '');
    setDate(ev.date || '');
    setLocation(ev.location || '');
    setCategory(ev.category || 'meeting');
    setDescription(ev.description || '');
    setRequiredItems(ev.requiredItems || '');
    setQuranVerse(ev.quranVerse || '');
    setTargetGroupId(ev.targetGroupId || 'all');
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

  // Save / Update Event Handler
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (!title.trim() || !date) {
      setError("Event title and date are required.");
      return;
    }

    setSaving(true);
    const scope = isExecutive ? targetGroupId : (currentUser?.groupId || 'all');
    
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
      category,
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

    const rsvpData = {
      userId: currentUser.uid,
      userName: currentUser.fullName || currentUser.username || 'Family',
      userRole: currentUser.role || 'scout',
      status: rsvpStatus,
      dietary: rsvpDietary.trim(),
      driverAvailable: rsvpDriverAvailable,
      seats: rsvpDriverAvailable ? parseInt(rsvpSeats, 10) || 0 : 0,
      notes: rsvpNotes.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'events', selectedEvent.id, 'rsvps', currentUser.uid), rsvpData, { merge: true });
      setRsvpSuccessMsg('✓ RSVP Submitted Successfully!');
      setTimeout(() => setRsvpSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Failed to submit RSVP:", err);
      alert("Error saving RSVP: " + err.message);
    } finally {
      setRsvpSaving(false);
    }
  };

  // Copy WhatsApp Broadcast Text
  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(customWhatsAppMsg);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
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

  const currentEventRsvpsList = selectedEvent ? Object.values(eventRsvps[selectedEvent.id] || {}) : [];
  const attendingCount = currentEventRsvpsList.filter(r => r.status === 'attending').length;
  const tentativeCount = currentEventRsvpsList.filter(r => r.status === 'tentative').length;
  const notAttendingCount = currentEventRsvpsList.filter(r => r.status === 'not_attending').length;

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
            { id: 'campouts', label: '⛺ Overnight Campouts' },
            { id: 'service', label: '🤝 Community Service' },
            { id: 'faith', label: '🕌 Halqas & Faith' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold'
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="meeting">🏕️ Troop Meeting / Standalone Session</option>
                    <option value="campout">⛺ Overnight Campout</option>
                    <option value="service">🤝 Service Project</option>
                    <option value="faith">🕌 Halqa / Spiritual Circle</option>
                    <option value="ceremony">🎖️ Court of Honor / Ceremony</option>
                  </select>
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
                  placeholder="e.g. Highview Elementary School (Troop Headquarters)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setLocation('Highview Elementary School (6514 Kinloch St. Dearborn Heights 48127)')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-750 hover:border-emerald-700 rounded-lg transition cursor-pointer"
                  >
                    🏫 Highview Elementary (6514 Kinloch St)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('Campout / Outdoor Campsite')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-amber-950 hover:text-amber-300 text-slate-300 border border-slate-750 hover:border-amber-700 rounded-lg transition cursor-pointer"
                  >
                    🏕️ Campout Site
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('Masjid / Community Hall')}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-sky-950 hover:text-sky-300 text-slate-300 border border-slate-750 hover:border-sky-700 rounded-lg transition cursor-pointer"
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

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Required Gear / Items to Bring</label>
                <input
                  type="text"
                  placeholder="e.g. Class A Uniform, Pocket Knife, Water Bottle, Mess Kit"
                  value={requiredItems}
                  onChange={(e) => setRequiredItems(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
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
                const isSelected = selectedEvent?.id === ev.id;
                const isChecked = selectedEventIds.has(ev.id);
                const rsvps = Object.values(eventRsvps[ev.id] || {});
                const countAttending = rsvps.filter(r => r.status === 'attending').length;
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
                        className="pt-0.5 shrink-0 cursor-pointer p-1.5 -m-1.5 rounded-xl hover:bg-slate-750/60 transition-colors focus:outline-none"
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

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isPast 
                              ? 'text-purple-300 bg-purple-500/10 border-purple-500/30'
                              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          }`}>
                            📅 {ev.date}
                          </span>
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
                        </div>
                        <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                          {countAttending} {isPast ? 'Attended' : 'Going'}
                        </span>
                      </div>
                      <strong className="text-sm font-bold text-white block leading-snug truncate">{ev.title}</strong>
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
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-750 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase">
                      {selectedEvent.category || selectedEvent.eventType || 'meeting'}
                    </span>
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
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full">
                      {selectedEvent.targetGroupId === 'all' || selectedEvent.pushToAllPatrols ? '⚡ Troop-Wide Broadcast' : 'Patrol Scoped'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 flex-wrap font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-emerald-400" /> {selectedEvent.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-emerald-400" /> {selectedEvent.time}</span>
                    {getEventDisplayDuration(selectedEvent) && (
                      <span className="flex items-center gap-1.5"><Hourglass size={13} className="text-emerald-400" /> {getEventDisplayDuration(selectedEvent)} duration</span>
                    )}
                  </div>
                </div>

                {isLeader && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(selectedEvent)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="p-2 bg-slate-800 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

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

              {/* ── LEADER RSVP PLANNING ROSTER ── */}
              {isLeader && (
                <div className="bg-slate-900 border border-slate-750 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <Users size={14} className="text-emerald-400" />
                      <span>
                        {(selectedEvent.date || '') < todayStr ? 'Recorded Attendance / Responses' : 'Roster RSVPs'} ({currentEventRsvpsList.length} Responses)
                      </span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400 font-bold">✓ {attendingCount} { (selectedEvent.date || '') < todayStr ? 'Present' : 'Attending' }</span>
                      <span className="text-amber-400 font-bold">? {tentativeCount} Tentative</span>
                      <span className="text-slate-400">✗ {notAttendingCount} Out</span>
                    </div>
                  </div>

                  {currentEventRsvpsList.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No RSVP responses recorded for this event.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {currentEventRsvpsList.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-950 text-xs border border-slate-800">
                          <div>
                            <strong className="text-white block">{r.userName}</strong>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              {r.dietary && <span>Dietary: {r.dietary}</span>}
                              {r.driverAvailable && <span className="text-sky-400 font-semibold">🚗 Driver ({r.seats} seats)</span>}
                              {r.notes && <span className="italic">"{r.notes}"</span>}
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            r.status === 'attending' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            r.status === 'tentative' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                            'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            {r.status === 'attending' ? ((selectedEvent.date || '') < todayStr ? 'Present' : 'Attending') : r.status === 'tentative' ? 'Tentative' : 'Declined'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
    </div>
  );
}
