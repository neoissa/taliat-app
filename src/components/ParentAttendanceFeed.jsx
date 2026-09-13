import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Award,
  Sparkles,
  TrendingUp,
  FileText,
  Mail,
  Plus,
  Search,
  Filter,
  Shield,
  User,
  Users,
  Moon,
  ChevronRight,
  Info,
  Check,
  X
} from 'lucide-react';
import { 
  calculateScoutCompliance, 
  isFridayDate, 
  isFridayProgramEvent, 
  isMandatoryEvent, 
  isAttendanceTracked 
} from '../utils/attendanceCompliance';

export default function ParentAttendanceFeed({ currentUser, linkedScouts: propLinkedScouts = [] }) {
  const [linkedScouts, setLinkedScouts] = useState(propLinkedScouts || []);
  const [selectedScoutUid, setSelectedScoutUid] = useState('');
  const [sessions, setSessions] = useState([]);
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scopeFilter, setScopeFilter] = useState('tracked_only');
  const [searchQuery, setSearchQuery] = useState('');

  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseScoutUid, setExcuseScoutUid] = useState('');
  const [excuseDate, setExcuseDate] = useState(new Date().toISOString().split('T')[0]);
  const [excuseReason, setExcuseReason] = useState('Illness / Medical');
  const [excuseNotes, setExcuseNotes] = useState('');
  const [excuseSubmitting, setExcuseSubmitting] = useState(false);
  const [excuseSuccessMsg, setExcuseSuccessMsg] = useState('');

  useEffect(() => {
    if (propLinkedScouts && propLinkedScouts.length > 0) {
      setLinkedScouts(propLinkedScouts);
      if (!selectedScoutUid) setSelectedScoutUid(propLinkedScouts[0].uid || propLinkedScouts[0].id);
      return;
    }
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
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
      if (matching.length > 0 && !selectedScoutUid) {
        setSelectedScoutUid(matching[0].uid);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser, propLinkedScouts, selectedScoutUid]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setSessions(list);
      setLoading(false);
    }, (err) => {
      console.warn('Parent attendance sessions listener:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(collection(db, 'attendance_excuses'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.submittedByUid === currentUser.uid || linkedScouts.some(s => s.uid === e.scoutId));
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setExcuses(list);
    }, (err) => console.warn('Parent excuses listener:', err));

    return () => unsub();
  }, [currentUser?.uid, linkedScouts]);

  const activeScout = useMemo(() => {
    return linkedScouts.find(s => s.uid === selectedScoutUid) || linkedScouts[0] || null;
  }, [linkedScouts, selectedScoutUid]);

  const scoutsComplianceMap = useMemo(() => {
    const map = {};
    linkedScouts.forEach(s => {
      map[s.uid] = calculateScoutCompliance(s.uid, sessions, { filterMode: scopeFilter });
    });
    return map;
  }, [linkedScouts, sessions, scopeFilter]);

  const activeCompliance = useMemo(() => {
    if (!activeScout) {
      return {
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
        excusedCount: 0,
        attendanceRate: 100,
        fridaySessions: { total: 0, attended: 0, percentage: 100 },
        mandatoryEvents: { total: 0, attended: 0, percentage: 100 },
        totalTrackedHours: 0,
        totalCampingNights: 0,
        riskLevel: 'green',
        riskLabel: 'Good Standing',
        isEligibleForAdvancement: true,
        trackedSessions: []
      };
    }
    return scoutsComplianceMap[activeScout.uid] || calculateScoutCompliance(activeScout.uid, sessions, { filterMode: scopeFilter });
  }, [activeScout, scoutsComplianceMap, sessions, scopeFilter]);

  const filteredRecords = useMemo(() => {
    let list = activeCompliance.trackedSessions || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        (r.title || '').toLowerCase().includes(q) ||
        (r.date || '').includes(q) ||
        (r.eventType || '').toLowerCase().includes(q) ||
        (r.note || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCompliance.trackedSessions, searchQuery]);

  const handleSubmitExcuse = async (e) => {
    e.preventDefault();
    const targetId = excuseScoutUid || activeScout?.uid;
    const targetScoutObj = linkedScouts.find(s => s.uid === targetId) || activeScout;
    if (!targetId || !excuseDate) {
      alert('Please select the scout and date.');
      return;
    }
    setExcuseSubmitting(true);
    setExcuseSuccessMsg('');

    try {
      const excuseId = `excuse_${targetId}_${excuseDate.replace(/-/g, '')}_${Date.now()}`;
      await setDoc(doc(db, 'attendance_excuses', excuseId), {
        id: excuseId,
        scoutId: targetId,
        scoutName: targetScoutObj?.fullName || targetScoutObj?.username || 'Scout',
        date: excuseDate,
        reason: excuseReason,
        notes: excuseNotes.trim(),
        submittedByUid: currentUser.uid,
        submittedByName: currentUser.fullName || currentUser.username || 'Parent',
        submittedByRole: 'parent',
        parentEmail: currentUser.email || '',
        parentPhone: currentUser.phone || currentUser.parentPhone || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      }, { merge: true });

      setExcuseSuccessMsg('✓ Official absence notice submitted to troop leadership!');
      setTimeout(() => {
        setExcuseSuccessMsg('');
        setShowExcuseModal(false);
        setExcuseNotes('');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit parent excuse:', err);
      alert('Error submitting absence notice: ' + err.message);
    } finally {
      setExcuseSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Family Attendance Records...</span>
      </div>
    );
  }

  if (linkedScouts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          👨‍👩‍👧
        </div>
        <h3 className="text-base font-black text-white">No Linked Scouts Found</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your parent account is not currently linked to any scout profiles. Please contact the Scoutmaster to connect your family roster.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      
      {/* ── TOP HERO HEADER & ACTIONS ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/50 shrink-0">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Parent Attendance Feed & Compliance
                </span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  2026–2027 Season
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Family Attendance & Advancement Status
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Monitor Friday Scouting Program attendance and mandatory troop events. Active participation is required for BSA rank advancement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => {
                setExcuseScoutUid(activeScout?.uid || '');
                setShowExcuseModal(true);
                setExcuseSuccessMsg('');
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02]"
            >
              <Mail size={15} />
              <span>Submit Absence Excuse</span>
            </button>
          </div>
        </div>

        {/* ── SCOUT SWITCHER TABS ── */}
        {linkedScouts.length > 1 && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none relative z-10">
            <span className="text-[10px] uppercase font-black text-slate-400 px-1 shrink-0 flex items-center gap-1">
              <Users size={12} className="text-emerald-400" /> Select Scout:
            </span>
            {linkedScouts.map(scout => {
              const sComp = scoutsComplianceMap[scout.uid];
              const isSelected = scout.uid === activeScout?.uid;
              return (
                <button
                  key={scout.uid}
                  type="button"
                  onClick={() => setSelectedScoutUid(scout.uid)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-750'
                  }`}
                >
                  <span>{scout.fullName || scout.username}</span>
                  {sComp && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sComp.attendanceRate}%
                    </span>
                  )}
                  {sComp?.riskLevel === 'red' && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── KPI COMPLIANCE TILES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 relative z-10 text-xs">
          
          {/* Active Participation Rate */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Rate
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                activeCompliance.riskLevel === 'red'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : activeCompliance.riskLevel === 'yellow'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {activeCompliance.riskLabel}
              </span>
            </div>
            <strong className="text-2xl font-black text-white font-mono block">
              {activeCompliance.attendanceRate}%
            </strong>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  activeCompliance.attendanceRate >= 75 ? 'bg-emerald-500' : activeCompliance.attendanceRate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, activeCompliance.attendanceRate)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              {activeCompliance.presentCount} of {activeCompliance.totalSessions} sessions attended
            </span>
          </div>

          {/* Friday Program Turnout */}
          <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Friday Programs
            </span>
            <strong className="text-2xl font-black text-emerald-300 font-mono block">
              {activeCompliance.fridaySessions.attended} / {activeCompliance.fridaySessions.total}
            </strong>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, activeCompliance.fridaySessions.percentage)}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-400/80 block pt-0.5">
              {activeCompliance.fridaySessions.percentage}% Friday completion
            </span>
          </div>

          {/* Mandatory Troop Events */}
          <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              Mandatory Events
            </span>
            <strong className="text-2xl font-black text-amber-400 font-mono block">
              {activeCompliance.mandatoryEvents.attended} / {activeCompliance.mandatoryEvents.total}
            </strong>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${Math.min(100, activeCompliance.mandatoryEvents.percentage)}%` }}
              />
            </div>
            <span className="text-[10px] text-amber-300/80 block pt-0.5">
              {activeCompliance.mandatoryEvents.percentage}% milestone rating
            </span>
          </div>

          {/* Advancement Review Threshold */}
          <div className="bg-slate-900/90 border border-sky-500/30 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Advancement Review
              </span>
              <Award size={14} className={activeCompliance.isEligibleForAdvancement ? "text-emerald-400" : "text-amber-400"} />
            </div>
            <strong className={`text-sm font-black font-mono block ${activeCompliance.isEligibleForAdvancement ? 'text-emerald-300' : 'text-amber-400'}`}>
              {activeCompliance.isEligibleForAdvancement ? 'Eligible for Review' : 'Threshold Pending'}
            </strong>
            <span className="text-[10px] text-slate-300 block">
              {activeCompliance.totalTrackedHours}h credited • {activeCompliance.totalCampingNights} nights
            </span>
            <span className="text-[9px] text-slate-400 block pt-0.5">
              {activeCompliance.isEligibleForAdvancement ? '✓ Meets 70% active standard' : '⚠️ Maintain ≥ 70% attendance'}
            </span>
          </div>

        </div>

        {/* ── SCOPE FILTER TABS ── */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 relative z-10 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-black text-slate-400 px-1 flex items-center gap-1">
              <Filter size={12} className="text-emerald-400" /> Filter View:
            </span>
            <button
              type="button"
              onClick={() => setScopeFilter('tracked_only')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scopeFilter === 'tracked_only'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>⭐ Friday & Mandatory (Compliance)</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('friday_only')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scopeFilter === 'friday_only'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>🏕️ Friday Programs</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('mandatory_only')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scopeFilter === 'mandatory_only'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>⭐ Mandatory Only</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scopeFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>📋 All Sessions</span>
            </button>
          </div>

          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── UNEXCUSED ABSENCE WARNING CALLOUT ── */}
      {activeCompliance.absentCount > 0 && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
          activeCompliance.riskLevel === 'red'
            ? 'bg-red-950/40 border-red-500/60 text-red-200'
            : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
        }`}>
          <AlertCircle size={18} className={activeCompliance.riskLevel === 'red' ? 'text-red-400 shrink-0 mt-0.5' : 'text-amber-400 shrink-0 mt-0.5'} />
          <div className="space-y-1 flex-1">
            <strong className="font-black text-sm block">
              {activeCompliance.riskLevel === 'red' ? 'Critical Attendance Warning' : 'Attendance Follow-up Recommended'}
            </strong>
            <p className="leading-relaxed">
              {activeScout?.fullName || activeScout?.username} has <strong>{activeCompliance.absentCount} unexcused absence{activeCompliance.absentCount > 1 ? 's' : ''}</strong> recorded in Friday Scouting Programs and mandatory troop events. Submitting an excuse notice allows troop leaders to review and excuse verified absences.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setExcuseScoutUid(activeScout?.uid || '');
                  setShowExcuseModal(true);
                }}
                className="underline font-bold hover:text-white cursor-pointer"
              >
                Submit an absence excuse notice &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DETAILED ATTENDANCE FEED / LOG ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {activeScout?.fullName || activeScout?.username}'s Recorded Sessions ({filteredRecords.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {activeCompliance.presentCount} Present &bull; {activeCompliance.absentCount} Absent &bull; {activeCompliance.excusedCount} Excused
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs italic space-y-1">
            <p>No recorded sessions found in this scope.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredRecords.map((rec) => {
              const isPresent = rec.status === 'present';
              const isLate = rec.status === 'late';
              const isExcused = rec.status === 'excused';
              const isAbsent = rec.status === 'absent';

              return (
                <div
                  key={rec.sessionId || `${rec.date}_${rec.title}`}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAbsent
                      ? 'bg-red-950/20 border-red-500/30'
                      : isExcused
                      ? 'bg-sky-950/20 border-sky-500/30'
                      : isLate
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border ${
                      isAbsent 
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : isExcused
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : isLate
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {isAbsent ? '✕' : isExcused ? '✉' : isLate ? '⏱' : '✓'}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          📅 {rec.date}
                        </span>
                        
                        {rec.isFriday && (
                          <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-md">
                            Friday Program
                          </span>
                        )}

                        {rec.isMandatory && (
                          <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-md">
                            ⭐ Mandatory
                          </span>
                        )}

                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase border ${
                          isAbsent
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : isExcused
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : isLate
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {rec.status}
                        </span>
                      </div>

                      <strong className="text-xs font-bold text-white block truncate">
                        {rec.title || rec.eventType}
                      </strong>

                      {rec.note && (
                        <p className="text-[11px] text-slate-400 italic">
                          Remark: {rec.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs font-mono">
                    <span className="text-emerald-300 font-bold bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                      ⏱️ {rec.hours}h {rec.nights > 0 ? `• ${rec.nights}n` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PARENT ABSENCE EXCUSE MODAL ── */}
      {showExcuseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-emerald-400" />
                <h3 className="font-black text-white text-base">Submit Absence Excuse Notice</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExcuseModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitExcuse} className="space-y-4 text-xs">
              {linkedScouts.length > 1 && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Select Scout:</label>
                  <select
                    value={excuseScoutUid || activeScout?.uid}
                    onChange={(e) => setExcuseScoutUid(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {linkedScouts.map(s => (
                      <option key={s.uid} value={s.uid}>
                        {s.fullName || s.username} ({s.rank || 'Scout'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">Session Date:</label>
                <input
                  type="date"
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Primary Reason for Absence:</label>
                <select
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Illness / Medical">🤒 Illness / Medical</option>
                  <option value="Family Obligation / Emergency">👨‍👩‍👧 Family Obligation / Emergency</option>
                  <option value="Academic / Exam Preparation">📚 Academic / Exam Preparation</option>
                  <option value="Travel / Out of Town">✈️ Travel / Out of Town</option>
                  <option value="Religious / Islamic Observance">🕌 Religious / Islamic Observance</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Parent Explanation / Details:</label>
                <textarea
                  rows={3}
                  placeholder="Provide brief context for unit leadership..."
                  value={excuseNotes}
                  onChange={(e) => setExcuseNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {excuseSuccessMsg && (
                <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold p-3 rounded-xl text-center">
                  {excuseSuccessMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExcuseModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={excuseSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {excuseSubmitting ? 'Submitting...' : 'Submit Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
