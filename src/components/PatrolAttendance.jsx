import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, query, where, getDocs } from 'firebase/firestore';
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
  Plus
} from 'lucide-react';

const EVENT_TYPES = [
  'Weekly Troop Meeting',
  'Campout',
  'Halqa / Study Circle',
  'Service Project',
  'Day Hike',
  'Special Workshop'
];

export default function PatrolAttendance({ currentUser }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;

  // Patrol Scouts Roster State
  const [scouts, setScouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Session State
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { [scoutUid]: { status: 'present'|'absent'|'excused'|'late', note: '' } }
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Historical Sessions State (for Attendance Risk & KPI trends)
  const [historicalSessions, setHistoricalSessions] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // 1. Fetch Patrol Scouts (Data Isolation Scoped to Leader's Patrol)
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      
      // Data Isolation: Only leader's assigned scouts / group
      if (!isOwner) {
        list = list.filter(s => {
          if (currentUser.groupId && s.groupId === currentUser.groupId) return true;
          if (s.leaderId === currentUser.uid) return true;
          if (currentUser.patrolName && s.patrolName === currentUser.patrolName) return true;
          return false;
        });
      }

      // Sort alphabetically by full name
      list.sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
      setScouts(list);
      setLoading(false);
    }, (err) => {
      console.error('Failed to load patrol scouts:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser, isOwner]);

  // 2. Fetch Historical Sessions for Patrol Risk Engine
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter sessions for this patrol / leader
      if (!isOwner && currentUser?.groupId) {
        list = list.filter(s => s.groupId === currentUser.groupId || s.leaderId === currentUser.uid);
      } else if (!isOwner) {
        list = list.filter(s => s.leaderId === currentUser?.uid);
      }

      // Sort by date descending
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setHistoricalSessions(list);
    }, (err) => {
      console.warn('Historical sessions fallback:', err);
    });

    return () => unsub();
  }, [currentUser, isOwner]);

  // 3. Load Session Data when date changes
  useEffect(() => {
    const sessionId = `${sessionDate}_${eventType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const existingSession = historicalSessions.find(s => s.date === sessionDate && s.eventType === eventType);

    if (existingSession && existingSession.records) {
      setAttendanceRecords(existingSession.records);
      setSessionNotes(existingSession.notes || '');
    } else {
      // Default all scouts to 'present' for new daily session
      const initialMap = {};
      scouts.forEach(s => {
        initialMap[s.uid] = { status: 'present', note: '' };
      });
      setAttendanceRecords(initialMap);
      setSessionNotes('');
    }
  }, [sessionDate, eventType, historicalSessions, scouts]);

  // ── 4. AUTOMATED ABSENCE RISK ENGINE (YELLOW & RED THRESHOLDS) ──
  // Calculate unexcused absences and risk level across historical sessions
  const getScoutRiskData = (scoutUid) => {
    let unexcusedAbsenceCount = 0;
    let consecutiveAbsences = 0;
    let totalRecordedSessions = 0;
    let attendedSessions = 0;

    historicalSessions.forEach(session => {
      const record = session.records?.[scoutUid];
      if (record) {
        totalRecordedSessions++;
        if (record.status === 'present' || record.status === 'late') {
          attendedSessions++;
        } else if (record.status === 'absent') {
          unexcusedAbsenceCount++;
        }
      }
    });

    // Check consecutive absences in recent sessions
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

    // Threshold logic:
    // Red: >= 3 absences
    // Yellow: > 1 absence (2 absences)
    // Green: 0-1 absence
    let riskLevel = 'green';
    let riskLabel = 'Good Standing';
    let riskTooltip = 'Regular attendance (Good Standing)';

    if (unexcusedAbsenceCount >= 3 || consecutiveAbsences >= 3) {
      riskLevel = 'red';
      riskLabel = 'Critical Risk';
      riskTooltip = `Critical: ${unexcusedAbsenceCount} unexcused absences. Immediate parent outreach recommended.`;
    } else if (unexcusedAbsenceCount >= 2 || consecutiveAbsences >= 2) {
      riskLevel = 'yellow';
      riskLabel = 'At Risk';
      riskTooltip = `Needs follow-up: ${unexcusedAbsenceCount} recent absences.`;
    }

    return {
      unexcusedAbsenceCount,
      consecutiveAbsences,
      totalRecordedSessions,
      attendanceRate,
      riskLevel,
      riskLabel,
      riskTooltip
    };
  };

  // ── 5. RECORD ACTIONS ──
  const setScoutStatus = (scoutUid, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [scoutUid]: {
        ...(prev[scoutUid] || {}),
        status
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
    scouts.forEach(s => {
      updated[s.uid] = {
        ...(attendanceRecords[s.uid] || {}),
        status
      };
    });
    setAttendanceRecords(updated);
  };

  // ── 6. SAVE ATTENDANCE SESSION TO FIRESTORE ──
  const handleSaveSession = async () => {
    setSaving(true);
    setSaveSuccess('');

    const sessionId = `${sessionDate}_${eventType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const payload = {
      sessionId,
      leaderId: currentUser?.uid || '',
      groupId: currentUser?.groupId || '',
      patrolName: currentUser?.patrolName || '',
      date: sessionDate,
      eventType,
      notes: sessionNotes.trim(),
      records: attendanceRecords,
      updatedAt: new Date().toISOString()
    };

    try {
      // 1. Save to global attendance_sessions collection
      await setDoc(doc(db, 'attendance_sessions', sessionId), payload, { merge: true });

      // 2. Also save to groups/{groupId}/attendance_sessions/{sessionId} if group exists
      if (currentUser?.groupId) {
        await setDoc(doc(db, 'groups', currentUser.groupId, 'attendance_sessions', sessionId), payload, { merge: true });
      }

      setSaveSuccess(`✓ Attendance for ${eventType} on ${sessionDate} saved successfully!`);
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

  // Patrol health overall breakdown
  let greenCount = 0;
  let yellowCount = 0;
  let redCount = 0;

  scouts.forEach(s => {
    const risk = getScoutRiskData(s.uid);
    if (risk.riskLevel === 'red') redCount++;
    else if (risk.riskLevel === 'yellow') yellowCount++;
    else greenCount++;
  });

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
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Patrol Roll Call & Attendance Monitor
              </h2>
              <p className="text-xs text-slate-350 mt-1 max-w-2xl leading-relaxed">
                Take daily attendance, track unexcused absences, and identify scouts at risk of disengagement with automated retention alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print Sheet</span>
            </button>
            <button
              type="button"
              onClick={handleSaveSession}
              disabled={saving || scouts.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50 hover:scale-[1.02]"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
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
              Session Turnout
            </span>
            <strong className="text-xl font-black text-emerald-300 font-mono block">
              {presentCount} / {totalRosterCount} ({sessionTurnoutPct}%)
            </strong>
            <span className="text-[10px] text-emerald-400/80">Present & on-time today</span>
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

      {/* ── 3. SESSION SETUP & DAILY CONTROLS BAR ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 print-hide">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-750 pb-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-1 text-xs">
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

            {/* Event Type Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock size={12} className="text-amber-400" /> Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Session Notes / Topic Input */}
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileText size={12} className="text-sky-400" /> Session Topic / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Pioneering Lashings & Halqa"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Bulk Action Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-end flex-wrap pt-1">
            <button
              type="button"
              onClick={() => markAll('present')}
              className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={13} />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => markAll('absent')}
              className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={13} />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>

        {/* Informational Guidance Alert */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-750">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Attendance changes are ready to be saved for <strong>{eventType} ({sessionDate})</strong>.</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {presentCount} Present &bull; {absentCount} Absent &bull; {excusedCount} Excused
          </span>
        </div>
      </div>

      {/* ── 4. ROLL CALL ACTION GRID ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-emerald-400" />
            <span>Patrol Roll Call Roster ({scouts.length} Scouts)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click any status pill to record attendance.
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
                  <th className="py-3 px-3">Absence Risk Level</th>
                  <th className="py-3 px-3">Session Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-750/60">
                {scouts.map((scout) => {
                  const record = attendanceRecords[scout.uid] || { status: 'present', note: '' };
                  const status = record.status || 'present';
                  const risk = getScoutRiskData(scout.uid);

                  return (
                    <tr
                      key={scout.uid}
                      className={`transition ${
                        risk.riskLevel === 'red'
                          ? 'bg-red-950/20 hover:bg-red-950/30'
                          : risk.riskLevel === 'yellow'
                          ? 'bg-amber-950/15 hover:bg-amber-950/25'
                          : 'hover:bg-slate-750/30'
                      }`}
                    >
                      {/* Scout Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            risk.riskLevel === 'red'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : risk.riskLevel === 'yellow'
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
                        <span className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-xl">
                          ⚜️ {scout.rank || 'Scout'}
                        </span>
                      </td>

                      {/* Status Selector Buttons */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Present Button */}
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

                          {/* Absent Button */}
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

                          {/* Excused Button */}
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

                          {/* Late Button */}
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

                      {/* Automated Absence Risk Engine Badge */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5" title={risk.riskTooltip}>
                          {risk.riskLevel === 'red' ? (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/50 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <AlertCircle size={11} />
                              <span>Critical: {risk.unexcusedAbsenceCount} Absences</span>
                            </span>
                          ) : risk.riskLevel === 'yellow' ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle size={11} />
                              <span>At Risk: {risk.unexcusedAbsenceCount} Absences</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>Good Standing ({risk.attendanceRate}%)</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Remark / Note Input */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          placeholder="e.g. Flu, excused with note"
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

      {/* ── 5. RECENT ATTENDANCE HISTORY LOG ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 print-hide">
        <div className="flex items-center justify-between border-b border-slate-750 pb-3">
          <div className="flex items-center gap-2">
            <History size={16} className="text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Patrol Attendance Sessions ({historicalSessions.length} Total Logs)
            </h3>
          </div>
        </div>

        {historicalSessions.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            No historical attendance logs recorded yet. Use the roll call table above to record your first session!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {historicalSessions.slice(0, 6).map((session) => {
              const sessionRecords = session.records || {};
              const sessionPresent = Object.values(sessionRecords).filter(r => r.status === 'present' || r.status === 'late').length;
              const sessionTotal = Object.keys(sessionRecords).length;
              const rate = sessionTotal > 0 ? Math.round((sessionPresent / sessionTotal) * 100) : 0;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setSessionDate(session.date);
                    setEventType(session.eventType);
                  }}
                  className="bg-slate-900/90 border border-slate-750 hover:border-emerald-500/40 p-4 rounded-2xl transition cursor-pointer space-y-2 group shadow-sm"
                  title="Click to view/edit this session"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Calendar size={12} /> {session.date}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                      {rate}% Turnout
                    </span>
                  </div>

                  <strong className="text-xs font-bold text-white block group-hover:text-emerald-300 transition">
                    {session.eventType}
                  </strong>

                  {session.notes && (
                    <p className="text-[10px] text-slate-400 line-clamp-1">{session.notes}</p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>{sessionPresent} of {sessionTotal} Present</span>
                    <span className="text-teal-400 font-semibold group-hover:underline">Edit Log &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 6. CLEAN PRINT VIEW (VISIBLE ON PRINT ONLY) ── */}
      <div className="hidden print:block bg-white text-slate-900 p-8 space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase">Dhulfiqār Scouts BSA</h1>
            <h2 className="text-sm font-bold text-slate-700">Official Patrol Attendance & Roll Call Record</h2>
          </div>
          <div className="text-right text-xs font-mono">
            <p><strong>Session Date:</strong> {sessionDate}</p>
            <p><strong>Event Type:</strong> {eventType}</p>
            <p><strong>Patrol:</strong> {currentUser?.patrolName || 'Taliʿa Patrol'}</p>
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold">
              <th className="p-2 border-r border-slate-300">#</th>
              <th className="p-2 border-r border-slate-300">Scout Name</th>
              <th className="p-2 border-r border-slate-300">Rank</th>
              <th className="p-2 border-r border-slate-300">Status</th>
              <th className="p-2">Notes / Reason</th>
            </tr>
          </thead>
          <tbody>
            {scouts.map((s, idx) => {
              const rec = attendanceRecords[s.uid] || { status: 'present', note: '' };
              return (
                <tr key={s.uid} className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 font-mono">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-200 font-bold">{s.fullName || s.username}</td>
                  <td className="p-2 border-r border-slate-200">{s.rank || 'Scout'}</td>
                  <td className="p-2 border-r border-slate-200 uppercase font-semibold">{rec.status}</td>
                  <td className="p-2">{rec.note || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
