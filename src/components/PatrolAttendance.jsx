import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  User,
  Shield,
  Save,
  Check,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  History,
  FileText,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Moon,
  Heart,
  BookOpen,
  Search,
  X
} from 'lucide-react';

export const EVENT_PROGRAM_CONFIG = {
  'Weekly Troop Meeting (Friday)': {
    id: 'weekly_friday',
    defaultHours: 3.0,
    defaultNights: 0,
    category: 'meeting',
    label: 'Weekly Troop Meeting (Friday)',
    shortLabel: 'Friday Meeting',
    icon: '🤝',
    description: 'Regular Friday Troop Meeting (Default: 3.0 hrs)'
  },
  'Tuesday Program': {
    id: 'tuesday_program',
    defaultHours: 1.25,
    defaultNights: 0,
    category: 'meeting',
    label: 'Tuesday Program',
    shortLabel: 'Tuesday Program',
    icon: '📅',
    description: 'Weekly Tuesday Scouting Program (Default: 1.25 hrs)'
  },
  'Campout': {
    id: 'campout',
    defaultHours: 48.0,
    defaultNights: 2,
    category: 'campout',
    label: 'Campout',
    shortLabel: 'Campout',
    icon: '🏕️',
    description: 'Troop & Patrol Campout (Default: 2 nights / 48.0 hrs, editable)'
  },
  'Halqa / Study Circle': {
    id: 'halqa',
    defaultHours: 1.5,
    defaultNights: 0,
    category: 'faith',
    label: 'Halqa / Study Circle',
    shortLabel: 'Halqa / Circle',
    icon: '🕌',
    description: 'Islamic Study Circle & Tarbiya (Default: 1.5 hrs)'
  },
  'Service Project / Volunteering': {
    id: 'service',
    defaultHours: 3.0,
    defaultNights: 0,
    category: 'service',
    label: 'Service Project / Volunteering',
    shortLabel: 'Service Project',
    icon: '🛠️',
    description: 'Community Service & Conservation Volunteering (Default: 3.0 hrs)'
  },
  'Day Hike': {
    id: 'day_hike',
    defaultHours: 4.0,
    defaultNights: 0,
    category: 'outdoor',
    label: 'Day Hike',
    shortLabel: 'Day Hike',
    icon: '🥾',
    description: 'Outdoor Patrol Day Hike (Default: 4.0 hrs)'
  },
  'Special Workshop': {
    id: 'workshop',
    defaultHours: 2.0,
    defaultNights: 0,
    category: 'workshop',
    label: 'Special Workshop',
    shortLabel: 'Workshop',
    icon: '🎯',
    description: 'Merit Badge & Skills Workshop (Default: 2.0 hrs)'
  },
  'Other / Custom Session': {
    id: 'custom',
    defaultHours: 1.0,
    defaultNights: 0,
    category: 'other',
    label: 'Other / Custom Session',
    shortLabel: 'Custom',
    icon: '📋',
    description: 'Custom Activity or Meeting'
  }
};

export const EVENT_TYPES = Object.keys(EVENT_PROGRAM_CONFIG);

export const normalizeEventType = (type) => {
  if (!type) return 'Weekly Troop Meeting (Friday)';
  if (type === 'Weekly Troop Meeting') return 'Weekly Troop Meeting (Friday)';
  if (type.includes('Tuesday')) return 'Tuesday Program';
  if (type.includes('Camp')) return 'Campout';
  if (type.includes('Halqa') || type.includes('Study')) return 'Halqa / Study Circle';
  if (type.includes('Service') || type.includes('Volunteer')) return 'Service Project / Volunteering';
  if (type.includes('Hike')) return 'Day Hike';
  if (type.includes('Workshop')) return 'Special Workshop';
  return type;
};

export const mapCategoryToEventType = (cat, title = '') => {
  const c = (cat || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (t.includes('tuesday') || c.includes('tuesday')) return 'Tuesday Program';
  if (t.includes('friday') || (c.includes('meeting') && !t.includes('tuesday'))) return 'Weekly Troop Meeting (Friday)';
  if (c.includes('camp') || t.includes('camp')) return 'Campout';
  if (c.includes('faith') || c.includes('halqa') || t.includes('halqa') || t.includes('circle') || t.includes('study')) return 'Halqa / Study Circle';
  if (c.includes('service') || c.includes('volunteer') || t.includes('service') || t.includes('volunteer')) return 'Service Project / Volunteering';
  if (c.includes('hike') || t.includes('hike')) return 'Day Hike';
  if (c.includes('workshop') || c.includes('skills') || t.includes('workshop')) return 'Special Workshop';
  return 'Weekly Troop Meeting (Friday)';
};

export default function PatrolAttendance({ currentUser, initialData }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;

  // Patrol Scouts Roster State
  const [scouts, setScouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Session State
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [sessionHours, setSessionHours] = useState(EVENT_PROGRAM_CONFIG[EVENT_TYPES[0]].defaultHours);
  const [sessionNights, setSessionNights] = useState(EVENT_PROGRAM_CONFIG[EVENT_TYPES[0]].defaultNights);
  const [sessionNotes, setSessionNotes] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [editingSessionId, setEditingSessionId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Historical Sessions State
  const [historicalSessions, setHistoricalSessions] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyProgramFilter, setHistoryProgramFilter] = useState('all');

  // Scheduled Events State
  const [scheduledEvents, setScheduledEvents] = useState([]);

  // Print Dialog & Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printMode, setPrintMode] = useState('current'); // 'current' | 'program' | 'scout'
  const [selectedPrintProgram, setSelectedPrintProgram] = useState('all');
  const [selectedPrintScoutId, setSelectedPrintScoutId] = useState('');

  // 1. Fetch Patrol Scouts (Scoped to Leader's Patrol)
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      
      if (!isOwner) {
        list = list.filter(s => {
          if (currentUser.groupId && s.groupId === currentUser.groupId) return true;
          if (s.leaderId === currentUser.uid) return true;
          if (currentUser.patrolName && s.patrolName === currentUser.patrolName) return true;
          return false;
        });
      }

      list.sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
      setScouts(list);
      if (list.length > 0 && !selectedPrintScoutId) {
        setSelectedPrintScoutId(list[0].uid);
      }
      setLoading(false);
    }, (err) => {
      console.error('Failed to load patrol scouts:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser, isOwner]);

  // 2. Fetch Historical Sessions for Patrol
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (!isOwner && currentUser?.groupId) {
        list = list.filter(s => s.groupId === currentUser.groupId || s.leaderId === currentUser.uid);
      } else if (!isOwner) {
        list = list.filter(s => s.leaderId === currentUser?.uid);
      }

      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setHistoricalSessions(list);
    }, (err) => {
      console.warn('Historical sessions fallback:', err);
    });

    return () => unsub();
  }, [currentUser, isOwner]);

  // 3. Fetch All Scheduled Events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setScheduledEvents(list);
    }, (err) => console.warn('Events listener fallback in PatrolAttendance:', err));

    return () => unsub();
  }, []);

  // 4. Handle Initial Data Navigation Pre-fill
  useEffect(() => {
    if (initialData) {
      if (initialData.date) setSessionDate(initialData.date);
      if (initialData.eventType) {
        const norm = normalizeEventType(initialData.eventType);
        setEventType(norm);
        const cfg = EVENT_PROGRAM_CONFIG[norm] || EVENT_PROGRAM_CONFIG['Weekly Troop Meeting (Friday)'];
        setSessionHours(cfg.defaultHours);
        setSessionNights(cfg.defaultNights);
      }
      if (initialData.notes) setSessionNotes(initialData.notes);
    }
  }, [initialData]);

  // 5. Load Session Data when date or eventType changes
  useEffect(() => {
    const norm = normalizeEventType(eventType);
    const existingSession = historicalSessions.find(s => 
      s.date === sessionDate && (s.eventType === eventType || normalizeEventType(s.eventType) === norm)
    );

    if (existingSession) {
      setEditingSessionId(existingSession.id);
      if (existingSession.hours !== undefined) setSessionHours(Number(existingSession.hours));
      if (existingSession.nights !== undefined) setSessionNights(Number(existingSession.nights));
      if (existingSession.notes) setSessionNotes(existingSession.notes);
      if (existingSession.records) setAttendanceRecords(existingSession.records);
    } else {
      setEditingSessionId(null);
      const cfg = EVENT_PROGRAM_CONFIG[norm] || EVENT_PROGRAM_CONFIG['Weekly Troop Meeting (Friday)'];
      setSessionHours(cfg.defaultHours);
      setSessionNights(cfg.defaultNights);
      
      // Default all scouts to 'present' for new daily session
      const initialMap = {};
      scouts.forEach(s => {
        initialMap[s.uid] = { 
          status: 'present', 
          hours: cfg.defaultHours, 
          nights: cfg.defaultNights, 
          note: '' 
        };
      });
      setAttendanceRecords(initialMap);
      if (!initialData?.notes) {
        setSessionNotes('');
      }
    }
  }, [sessionDate, eventType, historicalSessions, scouts]);

  // Handle Event Type Change with Default Hours & Nights
  const handleEventTypeChange = (newType) => {
    const norm = normalizeEventType(newType);
    setEventType(norm);
    const cfg = EVENT_PROGRAM_CONFIG[norm] || EVENT_PROGRAM_CONFIG['Weekly Troop Meeting (Friday)'];
    setSessionHours(cfg.defaultHours);
    setSessionNights(cfg.defaultNights);
  };

  // Handler to select and auto-sync a scheduled event
  const handleSelectScheduledEvent = (ev) => {
    if (ev.date) setSessionDate(ev.date);
    const mapped = mapCategoryToEventType(ev.category || ev.type, ev.title);
    handleEventTypeChange(mapped);
    setSessionNotes(ev.title + (ev.location ? ` (📍 ${ev.location})` : ''));
  };

  // Start fresh new session
  const handleStartNewSession = () => {
    setEditingSessionId(null);
    const today = new Date().toISOString().split('T')[0];
    setSessionDate(today);
    setEventType('Weekly Troop Meeting (Friday)');
    setSessionHours(3.0);
    setSessionNights(0);
    setSessionNotes('');
    const initialMap = {};
    scouts.forEach(s => {
      initialMap[s.uid] = { status: 'present', hours: 3.0, nights: 0, note: '' };
    });
    setAttendanceRecords(initialMap);
  };

  // Load a past session for editing
  const handleLoadSessionForEditing = (session) => {
    setEditingSessionId(session.id);
    setSessionDate(session.date);
    const norm = normalizeEventType(session.eventType);
    setEventType(norm);
    setSessionHours(session.hours !== undefined ? Number(session.hours) : (EVENT_PROGRAM_CONFIG[norm]?.defaultHours || 3.0));
    setSessionNights(session.nights !== undefined ? Number(session.nights) : (EVENT_PROGRAM_CONFIG[norm]?.defaultNights || 0));
    setSessionNotes(session.notes || '');
    if (session.records) {
      setAttendanceRecords(session.records);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a session log
  const handleDeleteSession = async (sessionId, sessionTitle) => {
    if (!window.confirm(`Are you sure you want to delete the attendance log for "${sessionTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'attendance_sessions', sessionId));
      if (currentUser?.groupId) {
        try {
          await deleteDoc(doc(db, 'groups', currentUser.groupId, 'attendance_sessions', sessionId));
        } catch (e) {
          // ignore
        }
      }
      if (editingSessionId === sessionId) {
        handleStartNewSession();
      }
      setSaveSuccess('✓ Session log deleted.');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Error deleting session: ' + err.message);
    }
  };

  // ── 4. AUTOMATED ABSENCE RISK & TOTAL HOURS ENGINE ──
  const getScoutAggregates = (scoutUid) => {
    let totalAttendedHours = 0;
    let totalCampingNights = 0;
    let totalServiceHours = 0;
    let totalHalqaHours = 0;
    let totalTuesdayHours = 0;
    let totalFridayHours = 0;
    let totalRecordedSessions = 0;
    let attendedSessions = 0;
    let unexcusedAbsenceCount = 0;
    let consecutiveAbsences = 0;
    let excusedCount = 0;
    let lateCount = 0;

    historicalSessions.forEach(session => {
      const record = session.records?.[scoutUid];
      if (record) {
        totalRecordedSessions++;
        const isAttended = record.status === 'present' || record.status === 'late';
        const norm = normalizeEventType(session.eventType);
        const defaultH = EVENT_PROGRAM_CONFIG[norm]?.defaultHours || 0;
        const defaultN = EVENT_PROGRAM_CONFIG[norm]?.defaultNights || 0;
        const sHours = session.hours !== undefined ? Number(session.hours) : defaultH;
        const sNights = session.nights !== undefined ? Number(session.nights) : defaultN;
        const scoutH = record.hours !== undefined ? Number(record.hours) : sHours;
        const scoutN = record.nights !== undefined ? Number(record.nights) : sNights;

        if (isAttended) {
          attendedSessions++;
          totalAttendedHours += scoutH;
          totalCampingNights += scoutN;
          if (norm === 'Service Project / Volunteering') totalServiceHours += scoutH;
          else if (norm === 'Halqa / Study Circle') totalHalqaHours += scoutH;
          else if (norm === 'Tuesday Program') totalTuesdayHours += scoutH;
          else if (norm === 'Weekly Troop Meeting (Friday)') totalFridayHours += scoutH;
          if (record.status === 'late') lateCount++;
        } else if (record.status === 'absent') {
          unexcusedAbsenceCount++;
        } else if (record.status === 'excused') {
          excusedCount++;
        }
      }
    });

    for (let i = 0; i < historicalSessions.length; i++) {
      const rec = historicalSessions[i].records?.[scoutUid];
      if (rec && rec.status === 'absent') {
        consecutiveAbsences++;
      } else if (rec && (rec.status === 'present' || rec.status === 'late')) {
        break;
      }
    }

    const attendanceRate = totalRecordedSessions > 0 
      ? Math.round((attendedSessions / totalRecordedSessions) * 100) 
      : 100;

    let riskLevel = 'green';
    let riskLabel = 'Good Standing';
    let riskTooltip = 'Regular attendance (Good Standing)';

    if (unexcusedAbsenceCount >= 3 || consecutiveAbsences >= 3) {
      riskLevel = 'red';
      riskLabel = 'Critical Risk';
      riskTooltip = `Critical: ${unexcusedAbsenceCount} unexcused absences. Parent outreach recommended.`;
    } else if (unexcusedAbsenceCount >= 2 || consecutiveAbsences >= 2) {
      riskLevel = 'yellow';
      riskLabel = 'At Risk';
      riskTooltip = `Needs follow-up: ${unexcusedAbsenceCount} absences.`;
    }

    return {
      totalAttendedHours: Math.round(totalAttendedHours * 10) / 10,
      totalCampingNights,
      totalServiceHours: Math.round(totalServiceHours * 10) / 10,
      totalHalqaHours: Math.round(totalHalqaHours * 10) / 10,
      totalTuesdayHours: Math.round(totalTuesdayHours * 10) / 10,
      totalFridayHours: Math.round(totalFridayHours * 10) / 10,
      unexcusedAbsenceCount,
      consecutiveAbsences,
      totalRecordedSessions,
      attendedSessions,
      excusedCount,
      lateCount,
      attendanceRate,
      riskLevel,
      riskLabel,
      riskTooltip
    };
  };

  // ── 5. RECORD ACTIONS ──
  const setScoutStatus = (scoutUid, status) => {
    setAttendanceRecords(prev => {
      const current = prev[scoutUid] || {};
      const isAttended = status === 'present' || status === 'late';
      return {
        ...prev,
        [scoutUid]: {
          ...current,
          status,
          hours: isAttended ? (current.hours !== undefined ? current.hours : Number(sessionHours)) : 0,
          nights: isAttended ? (current.nights !== undefined ? current.nights : Number(sessionNights)) : 0
        }
      };
    });
  };

  const setScoutCustomHours = (scoutUid, hours) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [scoutUid]: {
        ...(prev[scoutUid] || {}),
        hours: Number(hours)
      }
    }));
  };

  const setScoutNote = (scoutUid, note) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [scoutUid]: {
        ...(prev[scoutUid] || {}),
        note
      }
    }));
  };

  const markAll = (status) => {
    const updated = {};
    const isAttended = status === 'present' || status === 'late';
    scouts.forEach(s => {
      updated[s.uid] = {
        ...(attendanceRecords[s.uid] || {}),
        status,
        hours: isAttended ? Number(sessionHours) : 0,
        nights: isAttended ? Number(sessionNights) : 0
      };
    });
    setAttendanceRecords(updated);
  };

  // ── 6. SAVE ATTENDANCE SESSION TO FIRESTORE ──
  const handleSaveSession = async () => {
    setSaving(true);
    setSaveSuccess('');

    const safeType = eventType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const sessionId = editingSessionId || `${sessionDate}_${safeType}`;
    
    const cleanedRecords = {};
    scouts.forEach(s => {
      const rec = attendanceRecords[s.uid] || { status: 'present', note: '' };
      const isAttended = rec.status === 'present' || rec.status === 'late';
      cleanedRecords[s.uid] = {
        status: rec.status || 'present',
        hours: isAttended ? (rec.hours !== undefined ? Number(rec.hours) : Number(sessionHours)) : 0,
        nights: isAttended ? (rec.nights !== undefined ? Number(rec.nights) : Number(sessionNights)) : 0,
        note: (rec.note || '').trim()
      };
    });

    const payload = {
      sessionId,
      leaderId: currentUser?.uid || '',
      groupId: currentUser?.groupId || '',
      patrolName: currentUser?.patrolName || '',
      date: sessionDate,
      eventType,
      hours: Number(sessionHours) || 0,
      nights: Number(sessionNights) || 0,
      notes: sessionNotes.trim(),
      records: cleanedRecords,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'attendance_sessions', sessionId), payload, { merge: true });

      if (currentUser?.groupId) {
        await setDoc(doc(db, 'groups', currentUser.groupId, 'attendance_sessions', sessionId), payload, { merge: true });
      }

      setEditingSessionId(sessionId);
      setSaveSuccess(`✓ Attendance for ${eventType} (${sessionHours} hrs, ${sessionNights} nights) saved successfully!`);
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to save attendance session:', err);
      setSaveSuccess('⚠️ Failed to save attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── 7. CALCULATE CURRENT SESSION KPI METRICS ──
  const totalRosterCount = scouts.length;
  const presentCount = scouts.filter(s => attendanceRecords[s.uid]?.status === 'present' || attendanceRecords[s.uid]?.status === 'late').length;
  const absentCount = scouts.filter(s => attendanceRecords[s.uid]?.status === 'absent').length;
  const excusedCount = scouts.filter(s => attendanceRecords[s.uid]?.status === 'excused').length;
  const sessionTurnoutPct = totalRosterCount > 0 ? Math.round((presentCount / totalRosterCount) * 100) : 0;

  let greenCount = 0;
  let yellowCount = 0;
  let redCount = 0;

  scouts.forEach(s => {
    const agg = getScoutAggregates(s.uid);
    if (agg.riskLevel === 'red') redCount++;
    else if (agg.riskLevel === 'yellow') yellowCount++;
    else greenCount++;
  });

  const filteredHistoricalSessions = historicalSessions.filter(s => {
    const norm = normalizeEventType(s.eventType);
    if (historyProgramFilter !== 'all' && norm !== historyProgramFilter) return false;
    if (historySearch) {
      const q = historySearch.toLowerCase();
      const matchDate = (s.date || '').includes(q);
      const matchType = (s.eventType || '').toLowerCase().includes(q);
      const matchNotes = (s.notes || '').toLowerCase().includes(q);
      if (!matchDate && !matchType && !matchNotes) return false;
    }
    return true;
  });

  const selectedPrintScout = scouts.find(s => s.uid === selectedPrintScoutId) || scouts[0];
  const selectedScoutAgg = selectedPrintScout ? getScoutAggregates(selectedPrintScout.uid) : null;

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Patrol Attendance Roster...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-16">
      
      {/* ── 1. TOP HERO & CONTROL BANNER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/50 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden print-hide">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/50 shrink-0">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Patrol Attendance & Retention Engine
                </span>
                {currentUser?.patrolName && (
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    👥 {currentUser.patrolName} Patrol
                  </span>
                )}
                {editingSessionId && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Edit3 size={11} /> Editing Saved Session
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Patrol Roll Call, Hours & Retention Center
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Log program attendance with default & custom hours, record camping nights, track unexcused absences, and print official attendance transcripts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {editingSessionId && (
              <button
                type="button"
                onClick={handleStartNewSession}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} className="text-emerald-400" />
                <span>+ New Session</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print Sheets & Transcripts</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSession}
              disabled={saving || scouts.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50 hover:scale-[1.02]"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : editingSessionId ? 'Update Session' : 'Save Attendance'}</span>
            </button>
          </div>
        </div>

        {/* ── 2. PATROL ATTENDANCE KPI METRICS HEADER ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 relative z-10 text-xs">
          
          {/* Total Patrol Roster */}
          <div className="bg-slate-900/80 border border-slate-750 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Patrol Roster
            </span>
            <strong className="text-xl font-black text-white font-mono block">
              {totalRosterCount} Scouts
            </strong>
            <span className="text-[10px] text-slate-400">Total assigned youth</span>
          </div>

          {/* Session Turnout */}
          <div className="bg-slate-900/80 border border-emerald-500/40 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Session Turnout & Hours
            </span>
            <strong className="text-xl font-black text-emerald-300 font-mono block">
              {presentCount} / {totalRosterCount} ({sessionTurnoutPct}%)
            </strong>
            <span className="text-[10px] text-emerald-400/80">
              {sessionHours}h session {sessionNights > 0 ? `• ${sessionNights} nights` : ''}
            </span>
          </div>

          {/* Patrol Health Warning (Yellow) */}
          <div className="bg-slate-900/80 border border-amber-500/40 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              Warning State (Yellow)
            </span>
            <strong className="text-xl font-black text-amber-400 font-mono block">
              {yellowCount} Scouts
            </strong>
            <span className="text-[10px] text-amber-300/80">&gt; 1 Unexcused Absence</span>
          </div>

          {/* Patrol Health Critical (Red) */}
          <div className="bg-slate-900/80 border border-red-500/40 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider block">
              Critical Risk (Red)
            </span>
            <strong className={`text-xl font-black font-mono block ${redCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
              {redCount} Scouts
            </strong>
            <span className="text-[10px] text-red-300/80">&ge; 3 Unexcused Absences</span>
          </div>

        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold p-4 rounded-2xl text-center shadow-lg animate-fadeIn print-hide">
          {saveSuccess}
        </div>
      )}

      {/* ── 2.5 ACTIVE SCHEDULED EVENTS QUICK PICKER ── */}
      {scheduledEvents.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 print-hide">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <Calendar size={15} className="text-teal-400" />
              <span>Troop Events & Halqa Schedule ({scheduledEvents.length})</span>
            </span>
            <span className="text-[11px] text-slate-400">Click any scheduled event to auto-fill roll call</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
            {scheduledEvents.map(ev => {
              const mappedType = mapCategoryToEventType(ev.category || ev.type, ev.title);
              const isSelected = sessionDate === ev.date && (sessionNotes.includes(ev.title) || eventType === mappedType);
              const existingSession = historicalSessions.find(s => s.date === ev.date && (s.eventType === mappedType || (s.notes && s.notes.includes(ev.title))));
              
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => handleSelectScheduledEvent(ev)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-3 shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-400 shadow-lg shadow-teal-900/30'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-750 hover:border-teal-500/50 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-base">📅</span>
                  <div className="text-left">
                    <div className="text-[10px] text-teal-300 font-mono font-bold">{ev.date || 'Upcoming'}</div>
                    <div className="text-xs truncate max-w-[170px] text-white">{ev.title}</div>
                    {ev.location && <div className="text-[9px] text-slate-400 truncate max-w-[170px]">📍 {ev.location}</div>}
                  </div>
                  {existingSession ? (
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] px-2 py-0.5 rounded-full font-black">
                      ✓ Logged
                    </span>
                  ) : (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] px-2 py-0.5 rounded-full font-black">
                      + Roll Call
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. SESSION SETUP & DAILY CONTROLS BAR ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 print-hide">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-750 pb-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1 text-xs">
            {/* Date Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={12} className="text-emerald-400" /> Session Date
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Event / Program Type Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock size={12} className="text-amber-400" /> Program / Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => handleEventTypeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                {EVENT_TYPES.map(t => {
                  const cfg = EVENT_PROGRAM_CONFIG[t];
                  return (
                    <option key={t} value={t}>
                      {cfg.icon} {t} ({cfg.defaultHours}h{cfg.defaultNights > 0 ? `, ${cfg.defaultNights}n` : ''})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Session Hours Duration Input (Defaulted & Editable) */}
            <div>
              <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-teal-400" /> Duration (Hours)
                </span>
                <span className="text-[9px] text-slate-400 font-normal">Editable</span>
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="168"
                value={sessionHours}
                onChange={(e) => setSessionHours(e.target.value)}
                className="w-full bg-slate-950 border border-teal-500/40 rounded-xl px-3 py-2 text-white font-bold font-mono focus:outline-none focus:border-teal-400"
                placeholder="e.g. 3.0 or 1.25"
              />
            </div>

            {/* Camping Nights Input (Editable, especially for Campouts) */}
            <div>
              <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Moon size={12} className="text-indigo-400" /> Camping Nights
                </span>
                <span className="text-[9px] text-slate-400 font-normal">Editable</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="30"
                value={sessionNights}
                onChange={(e) => setSessionNights(e.target.value)}
                className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-2 text-white font-bold font-mono focus:outline-none focus:border-indigo-400"
                placeholder="e.g. 2 nights"
              />
            </div>

            {/* Session Notes / Topic Input */}
            <div className="sm:col-span-2 md:col-span-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileText size={12} className="text-sky-400" /> Session Topic / Location & Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Lashings & Fire Safety, Surah Al-Kahf Study Circle, Camp Rotary..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Bulk Action Buttons & Program Defaults Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-[11px] font-bold">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleEventTypeChange('Weekly Troop Meeting (Friday)')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                eventType === 'Weekly Troop Meeting (Friday)'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60'
                  : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-white'
              }`}
            >
              🤝 Friday (3.0h)
            </button>
            <button
              type="button"
              onClick={() => handleEventTypeChange('Tuesday Program')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                eventType === 'Tuesday Program'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60'
                  : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-white'
              }`}
            >
              📅 Tuesday (1.25h)
            </button>
            <button
              type="button"
              onClick={() => handleEventTypeChange('Campout')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                eventType === 'Campout'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60'
                  : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-white'
              }`}
            >
              🏕️ Camp (2 nights)
            </button>
            <button
              type="button"
              onClick={() => handleEventTypeChange('Service Project / Volunteering')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                eventType === 'Service Project / Volunteering'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60'
                  : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-white'
              }`}
            >
              🛠️ Service (3.0h)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => markAll('present')}
              className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={13} />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => markAll('absent')}
              className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={13} />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>

        {/* Informational Guidance Alert */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-750">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <span>
              Recording <strong>{eventType}</strong> ({sessionHours}h{sessionNights > 0 ? `, ${sessionNights} nights` : ''}) on <strong>{sessionDate}</strong>.
            </span>
          </span>
          <span className="font-mono text-emerald-400 font-bold shrink-0">
            {presentCount} Present &bull; {absentCount} Absent &bull; {excusedCount} Excused
          </span>
        </div>
      </div>

      {/* ── 4. ROLL CALL ACTION GRID ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-emerald-400" />
              <span>Patrol Roll Call Roster ({scouts.length} Scouts)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select status, customize individual scout hours if needed, and enter session remarks.
            </p>
          </div>
          <span className="text-xs text-teal-300 font-mono font-bold">
            Total Hours to Award: {presentCount * sessionHours} scout-hours
          </span>
        </div>

        {scouts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs italic space-y-2">
            <Users size={32} className="mx-auto text-slate-600" />
            <p>No scouts found in your assigned patrol. Add scouts in the Organization Hub or Patrol Roster.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200 border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Scout Name</th>
                  <th className="py-3 px-3">Current Rank</th>
                  <th className="py-3 px-3">Attendance Status</th>
                  <th className="py-3 px-2 text-center">Session Hours</th>
                  <th className="py-3 px-3">Total Earned (History)</th>
                  <th className="py-3 px-3">Absence Risk Level</th>
                  <th className="py-3 px-3">Session Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-750/60">
                {scouts.map((scout) => {
                  const record = attendanceRecords[scout.uid] || { status: 'present', hours: sessionHours, nights: sessionNights, note: '' };
                  const status = record.status || 'present';
                  const agg = getScoutAggregates(scout.uid);
                  const isAttended = status === 'present' || status === 'late';

                  return (
                    <tr
                      key={scout.uid}
                      className={`transition ${
                        agg.riskLevel === 'red'
                          ? 'bg-red-950/20 hover:bg-red-950/30'
                          : agg.riskLevel === 'yellow'
                          ? 'bg-amber-950/15 hover:bg-amber-950/25'
                          : 'hover:bg-slate-750/30'
                      }`}
                    >
                      {/* Scout Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            agg.riskLevel === 'red'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : agg.riskLevel === 'yellow'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-750 text-slate-300 border border-slate-700'
                          }`}>
                            <User size={14} />
                          </div>
                          <div>
                            <strong className="text-white font-bold block">
                              {scout.fullName || scout.username}
                            </strong>
                            <span className="text-[10px] text-slate-400 font-mono">@{scout.username}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap">
                          ⚜️ {scout.rank || 'Scout'}
                        </span>
                      </td>

                      {/* Status Selector Buttons */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setScoutStatus(scout.uid, 'present')}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1 ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                                : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border border-slate-750'
                            }`}
                          >
                            <Check size={11} />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setScoutStatus(scout.uid, 'absent')}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1 ${
                              status === 'absent'
                                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                                : 'bg-slate-900 text-slate-400 hover:text-red-300 border border-slate-750'
                            }`}
                          >
                            <XCircle size={11} />
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setScoutStatus(scout.uid, 'excused')}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1 ${
                              status === 'excused'
                                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                                : 'bg-slate-900 text-slate-400 hover:text-sky-300 border border-slate-750'
                            }`}
                          >
                            <span>Excused</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setScoutStatus(scout.uid, 'late')}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1 ${
                              status === 'late'
                                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-950/50'
                                : 'bg-slate-900 text-slate-400 hover:text-amber-300 border border-slate-750'
                            }`}
                          >
                            <span>Late</span>
                          </button>
                        </div>
                      </td>

                      {/* Custom Hours for This Scout */}
                      <td className="py-3 px-2 text-center">
                        {isAttended ? (
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="168"
                            value={record.hours !== undefined ? record.hours : sessionHours}
                            onChange={(e) => setScoutCustomHours(scout.uid, e.target.value)}
                            className="w-16 bg-slate-950 border border-teal-500/40 rounded-lg px-1.5 py-1 text-xs text-white text-center font-mono font-bold focus:outline-none focus:border-teal-400"
                            title="Hours awarded for this scout"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">0h</span>
                        )}
                      </td>

                      {/* Total Earned History */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-teal-300 block text-xs">
                            ⏱️ {agg.totalAttendedHours}h Total
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            🏕️ {agg.totalCampingNights}n • 🛠️ {agg.totalServiceHours}h srv
                          </span>
                        </div>
                      </td>

                      {/* Automated Absence Risk Engine Badge */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5" title={agg.riskTooltip}>
                          {agg.riskLevel === 'red' ? (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <AlertCircle size={11} />
                              <span>Critical: {agg.unexcusedAbsenceCount} Absences</span>
                            </span>
                          ) : agg.riskLevel === 'yellow' ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle size={11} />
                              <span>At Risk: {agg.unexcusedAbsenceCount} Absences</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>Good ({agg.attendanceRate}%)</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Remark / Note Input */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          placeholder="e.g. Arrived 20m late, excused note"
                          value={record.note || ''}
                          onChange={(e) => setScoutNote(scout.uid, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 5. RECENT ATTENDANCE HISTORY LOG & SESSION EDITOR ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 print-hide">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
          <div className="flex items-center gap-2">
            <History size={18} className="text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Patrol Attendance Log History ({historicalSessions.length} Total Sessions)
              </h3>
              <p className="text-[11px] text-slate-400">
                Click "Edit Log" on any previous session to update hours, nights, notes, or scout records.
              </p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search date or topic..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={historyProgramFilter}
              onChange={(e) => setHistoryProgramFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Programs</option>
              {EVENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredHistoricalSessions.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">
            No historical attendance logs matched your filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredHistoricalSessions.slice(0, 9).map((session) => {
              const sessionRecords = session.records || {};
              const sessionPresent = Object.values(sessionRecords).filter(r => r.status === 'present' || r.status === 'late').length;
              const sessionTotal = Object.keys(sessionRecords).length;
              const rate = sessionTotal > 0 ? Math.round((sessionPresent / sessionTotal) * 100) : 0;
              const norm = normalizeEventType(session.eventType);
              const cfg = EVENT_PROGRAM_CONFIG[norm] || EVENT_PROGRAM_CONFIG['Weekly Troop Meeting (Friday)'];
              const sHours = session.hours !== undefined ? session.hours : cfg.defaultHours;
              const sNights = session.nights !== undefined ? session.nights : cfg.defaultNights;
              const isCurrentEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className={`bg-slate-900/90 border rounded-2xl p-4 transition space-y-2.5 shadow-sm relative ${
                    isCurrentEditing
                      ? 'border-teal-400 ring-2 ring-teal-500/40'
                      : 'border-slate-750 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Calendar size={12} /> {session.date}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800 text-teal-300 px-2 py-0.5 rounded-full border border-slate-700">
                      {sHours}h {sNights > 0 ? `• ${sNights}n` : ''}
                    </span>
                  </div>

                  <div>
                    <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{cfg.icon}</span>
                      <span>{session.eventType}</span>
                    </strong>

                    {session.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{session.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="font-mono text-slate-300">
                      {sessionPresent}/{sessionTotal} Present ({rate}%)
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoadSessionForEditing(session)}
                        className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 hover:border-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 size={11} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSession(session.id, `${session.eventType} (${session.date})`)}
                        className="bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 text-[10px] p-1 rounded-lg transition cursor-pointer"
                        title="Delete this session"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 6. PRINT & TRANSCRIPT MODAL ── */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print-hide">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <Printer size={20} className="text-amber-400" />
                <h3 className="font-black text-white text-base">Print Attendance Sheets & Official Transcripts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPrintMode('current')}
                className={`py-2 px-3 rounded-xl transition cursor-pointer ${
                  printMode === 'current'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📄 Active Session Sheet
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('program')}
                className={`py-2 px-3 rounded-xl transition cursor-pointer ${
                  printMode === 'program'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📚 Program Log Sheet
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('scout')}
                className={`py-2 px-3 rounded-xl transition cursor-pointer ${
                  printMode === 'scout'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                👤 Scout Hours Transcript
              </button>
            </div>

            {/* Mode-Specific Selectors */}
            {printMode === 'program' && (
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-300">Select Program to Print:</label>
                <select
                  value={selectedPrintProgram}
                  onChange={(e) => setSelectedPrintProgram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold cursor-pointer focus:border-emerald-500"
                >
                  <option value="all">🌟 All Troop Programs Combined</option>
                  {EVENT_TYPES.map(t => (
                    <option key={t} value={t}>{EVENT_PROGRAM_CONFIG[t].icon} {t}</option>
                  ))}
                </select>
              </div>
            )}

            {printMode === 'scout' && (
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-300">Select Scout Candidate:</label>
                <select
                  value={selectedPrintScoutId}
                  onChange={(e) => setSelectedPrintScoutId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold cursor-pointer focus:border-emerald-500"
                >
                  {scouts.map(s => (
                    <option key={s.uid} value={s.uid}>
                      {s.fullName || s.username} ({s.rank || 'Scout'}) - {getScoutAggregates(s.uid).totalAttendedHours} hrs
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Preview Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Print Details Preview</span>
              {printMode === 'current' && (
                <div className="text-slate-300 space-y-1">
                  <p><strong>Session:</strong> {eventType} on {sessionDate}</p>
                  <p><strong>Duration & Nights:</strong> {sessionHours} Hours, {sessionNights} Nights</p>
                  <p><strong>Roster:</strong> {scouts.length} Scouts ({presentCount} Present)</p>
                </div>
              )}
              {printMode === 'program' && (
                <div className="text-slate-300 space-y-1">
                  <p><strong>Program Filter:</strong> {selectedPrintProgram === 'all' ? 'All Programs' : selectedPrintProgram}</p>
                  <p><strong>Total Recorded Sessions:</strong> {
                    historicalSessions.filter(s => selectedPrintProgram === 'all' || normalizeEventType(s.eventType) === selectedPrintProgram).length
                  } Sessions</p>
                </div>
              )}
              {printMode === 'scout' && selectedPrintScout && selectedScoutAgg && (
                <div className="text-slate-300 space-y-1">
                  <p><strong>Scout:</strong> {selectedPrintScout.fullName || selectedPrintScout.username} ({selectedPrintScout.rank || 'Scout'})</p>
                  <p><strong>Total Attended Hours:</strong> {selectedScoutAgg.totalAttendedHours} hrs</p>
                  <p><strong>Camping Nights:</strong> {selectedScoutAgg.totalCampingNights} nights &bull; <strong>Service:</strong> {selectedScoutAgg.totalServiceHours} hrs</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. CLEAN PRINT VIEW (VISIBLE ON PRINT ONLY) ── */}
      <div className="hidden print:block bg-white text-slate-900 p-8 space-y-6 text-xs font-sans">
        
        {/* PRINT MODE 1: CURRENT ACTIVE SESSION SHEET */}
        {printMode === 'current' && (
          <div className="space-y-4">
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black uppercase text-slate-950 tracking-tight">Dhulfiqār Scouts BSA</h1>
                <h2 className="text-sm font-bold text-slate-700">Official Patrol Attendance & Roll Call Record</h2>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-800 space-y-0.5">
                <p><strong>Date:</strong> {sessionDate}</p>
                <p><strong>Program:</strong> {eventType}</p>
                <p><strong>Duration:</strong> {sessionHours} hrs {sessionNights > 0 ? `• ${sessionNights} nights` : ''}</p>
                <p><strong>Patrol:</strong> {currentUser?.patrolName || 'Taliʿa Patrol'}</p>
              </div>
            </div>

            {sessionNotes && (
              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-md">
                <strong>Topic / Location:</strong> {sessionNotes}
              </div>
            )}

            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-800">
                  <th className="p-2 border-r border-slate-300 w-8">#</th>
                  <th className="p-2 border-r border-slate-300">Scout Full Name</th>
                  <th className="p-2 border-r border-slate-300 w-24">Rank</th>
                  <th className="p-2 border-r border-slate-300 w-24">Status</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Hours</th>
                  <th className="p-2">Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {scouts.map((s, idx) => {
                  const rec = attendanceRecords[s.uid] || { status: 'present', note: '' };
                  const isAttended = rec.status === 'present' || rec.status === 'late';
                  const sHours = isAttended ? (rec.hours !== undefined ? rec.hours : sessionHours) : 0;
                  return (
                    <tr key={s.uid} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-bold">{s.fullName || s.username}</td>
                      <td className="p-2 border-r border-slate-200">{s.rank || 'Scout'}</td>
                      <td className="p-2 border-r border-slate-200 uppercase font-semibold text-slate-900">{rec.status}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">{sHours}h</td>
                      <td className="p-2 text-slate-700">{rec.note || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Patrol Leader / Scribe Signature</p>
                <p className="text-[10px] text-slate-600">Date: ________________________</p>
              </div>
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Unit Leader / Scoutmaster Signature</p>
                <p className="text-[10px] text-slate-600">Date: ________________________</p>
              </div>
            </div>
          </div>
        )}

        {/* PRINT MODE 2: PROGRAM ATTENDANCE SHEET */}
        {printMode === 'program' && (
          <div className="space-y-4">
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black uppercase text-slate-950 tracking-tight">Dhulfiqār Scouts BSA</h1>
                <h2 className="text-sm font-bold text-slate-700">
                  Program Attendance & Hours Ledger — {selectedPrintProgram === 'all' ? 'All Programs' : selectedPrintProgram}
                </h2>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-800">
                <p><strong>Patrol:</strong> {currentUser?.patrolName || 'Taliʿa Patrol'}</p>
                <p><strong>Printed:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-800">
                  <th className="p-2 border-r border-slate-300 w-24">Date</th>
                  <th className="p-2 border-r border-slate-300">Program / Event</th>
                  <th className="p-2 border-r border-slate-300 w-24">Topic / Notes</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Duration</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Nights</th>
                  <th className="p-2 text-right w-24">Turnout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {historicalSessions
                  .filter(s => selectedPrintProgram === 'all' || normalizeEventType(s.eventType) === selectedPrintProgram)
                  .map(s => {
                    const norm = normalizeEventType(s.eventType);
                    const cfg = EVENT_PROGRAM_CONFIG[norm] || EVENT_PROGRAM_CONFIG['Weekly Troop Meeting (Friday)'];
                    const sessionRecords = s.records || {};
                    const present = Object.values(sessionRecords).filter(r => r.status === 'present' || r.status === 'late').length;
                    const total = Object.keys(sessionRecords).length;
                    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
                    const sHours = s.hours !== undefined ? s.hours : cfg.defaultHours;
                    const sNights = s.nights !== undefined ? s.nights : cfg.defaultNights;

                    return (
                      <tr key={s.id}>
                        <td className="p-2 border-r border-slate-200 font-mono">{s.date}</td>
                        <td className="p-2 border-r border-slate-200 font-bold">{s.eventType}</td>
                        <td className="p-2 border-r border-slate-200 text-slate-700">{s.notes || '—'}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">{sHours}h</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{sNights}n</td>
                        <td className="p-2 text-right font-mono font-bold">{present}/{total} ({rate}%)</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Unit Leader Signature</p>
              </div>
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Scoutmaster / Committee Chair Signature</p>
              </div>
            </div>
          </div>
        )}

        {/* PRINT MODE 3: INDIVIDUAL SCOUT ATTENDANCE TRANSCRIPT */}
        {printMode === 'scout' && selectedPrintScout && selectedScoutAgg && (
          <div className="space-y-4">
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black uppercase text-slate-950 tracking-tight">Dhulfiqār Scouts BSA</h1>
                <h2 className="text-sm font-bold text-slate-700">Official Scout Attendance & Participation Transcript</h2>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-800">
                <p><strong>Candidate:</strong> {selectedPrintScout.fullName || selectedPrintScout.username}</p>
                <p><strong>Rank:</strong> {selectedPrintScout.rank || 'Scout'}</p>
                <p><strong>Patrol:</strong> {selectedPrintScout.patrolName || currentUser?.patrolName || 'Taliʿa'}</p>
              </div>
            </div>

            {/* Summary Hours Breakdown Tiles */}
            <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3 rounded-lg border border-slate-300 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Attended Hours</span>
                <strong className="text-base font-black text-slate-950 font-mono">{selectedScoutAgg.totalAttendedHours} Hours</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Camping Nights</span>
                <strong className="text-base font-black text-slate-950 font-mono">{selectedScoutAgg.totalCampingNights} Nights</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Service Hours</span>
                <strong className="text-base font-black text-slate-950 font-mono">{selectedScoutAgg.totalServiceHours} Hours</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Attendance Rate</span>
                <strong className="text-base font-black text-slate-950 font-mono">{selectedScoutAgg.attendanceRate}% ({selectedScoutAgg.attendedSessions}/{selectedScoutAgg.totalRecordedSessions})</strong>
              </div>
            </div>

            {/* Individual Attendance Timeline */}
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-800">
                  <th className="p-2 border-r border-slate-300 w-24">Date</th>
                  <th className="p-2 border-r border-slate-300">Program / Event</th>
                  <th className="p-2 border-r border-slate-300 w-24">Status</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Hours</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Nights</th>
                  <th className="p-2">Session Topic / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {historicalSessions.map(session => {
                  const rec = session.records?.[selectedPrintScout.uid];
                  if (!rec) return null;
                  const norm = normalizeEventType(session.eventType);
                  const cfg = EVENT_PROGRAM_CONFIG[norm] || EVENT_PROGRAM_CONFIG['Weekly Troop Meeting (Friday)'];
                  const isAttended = rec.status === 'present' || rec.status === 'late';
                  const sHours = isAttended ? (rec.hours !== undefined ? rec.hours : (session.hours !== undefined ? session.hours : cfg.defaultHours)) : 0;
                  const sNights = isAttended ? (rec.nights !== undefined ? rec.nights : (session.nights !== undefined ? session.nights : cfg.defaultNights)) : 0;

                  return (
                    <tr key={session.id}>
                      <td className="p-2 border-r border-slate-200 font-mono">{session.date}</td>
                      <td className="p-2 border-r border-slate-200 font-bold">{session.eventType}</td>
                      <td className="p-2 border-r border-slate-200 uppercase font-semibold">{rec.status}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">{sHours}h</td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono">{sNights}n</td>
                      <td className="p-2 text-slate-700">{rec.note || session.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs">
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Scout Candidate Signature</p>
                <p className="text-[10px] text-slate-600">Date: ________________________</p>
              </div>
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Unit Leader Signature</p>
                <p className="text-[10px] text-slate-600">Date: ________________________</p>
              </div>
              <div className="space-y-1">
                <div className="border-b border-slate-900 h-8"></div>
                <p className="font-bold">Parent / Guardian Signature</p>
                <p className="text-[10px] text-slate-600">Date: ________________________</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
