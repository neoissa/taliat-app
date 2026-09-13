import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  query, 
  where 
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

export default function ScoutAttendance({ currentUser, scoutUid: propScoutUid, scoutName: propScoutName, onBack }) {
  const targetUid = propScoutUid || currentUser?.uid;
  const targetName = propScoutName || currentUser?.fullName || currentUser?.username || 'Scout';

  const [sessions, setSessions] = useState([]);
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [scopeFilter, setScopeFilter] = useState('tracked_only'); // 'tracked_only' | 'friday_only' | 'mandatory_only' | 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // Absence excuse modal state
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseDate, setExcuseDate] = useState(new Date().toISOString().split('T')[0]);
  const [excuseReason, setExcuseReason] = useState('Illness / Medical');
  const [excuseNotes, setExcuseNotes] = useState('');
  const [excuseSubmitting, setExcuseSubmitting] = useState(false);
  const [excuseSuccessMsg, setExcuseSuccessMsg] = useState('');

  // 1. Fetch Attendance Sessions in Real-Time
  useEffect(() => {
    if (!targetUid) return;

    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setSessions(list);
      setLoading(false);
    }, (err) => {
      console.warn('ScoutAttendance sessions load fallback:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [targetUid]);

  // 2. Fetch Absence Excuses for target scout
  useEffect(() => {
    if (!targetUid) return;

    const q = query(collection(db, 'attendance_excuses'), where('scoutId', '==', targetUid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setExcuses(list);
    }, (err) => {
      console.warn('ScoutAttendance excuses load fallback:', err);
    });

    return () => unsub();
  }, [targetUid]);

  // 3. Compute Real-time Compliance Metrics
  const compliance = useMemo(() => {
    if (!targetUid) {
      return {
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
        excusedCount: 0,
        lateCount: 0,
        attendanceRate: 100,
        fridaySessions: { total: 0, attended: 0, percentage: 100 },
        mandatoryEvents: { total: 0, attended: 0, percentage: 100 },
        totalTrackedHours: 0,
        totalCampingNights: 0,
        riskLevel: 'green',
        riskLabel: 'Good Standing',
        isEligibleForAdvancement: true,
        consecutiveAbsences: 0,
        trackedSessions: []
      };
    }

    return calculateScoutCompliance(targetUid, sessions, { filterMode: scopeFilter });
  }, [targetUid, sessions, scopeFilter]);

  // 4. Filter records by search query
  const filteredRecords = useMemo(() => {
    let list = compliance.trackedSessions || [];
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
  }, [compliance.trackedSessions, searchQuery]);

  // 5. Submit Absence Excuse Notice
  const handleSubmitExcuse = async (e) => {
    e.preventDefault();
    if (!excuseDate) {
      alert('Please select the date of the session.');
      return;
    }
    setExcuseSubmitting(true);
    setExcuseSuccessMsg('');

    try {
      const excuseId = `excuse_${targetUid}_${excuseDate.replace(/-/g, '')}_${Date.now()}`;
      await setDoc(doc(db, 'attendance_excuses', excuseId), {
        id: excuseId,
        scoutId: targetUid,
        scoutName: targetName,
        date: excuseDate,
        reason: excuseReason,
        notes: excuseNotes.trim(),
        submittedByUid: currentUser?.uid || targetUid,
        submittedByName: currentUser?.fullName || currentUser?.username || targetName,
        submittedByRole: currentUser?.role || 'scout',
        status: 'pending',
        createdAt: new Date().toISOString()
      }, { merge: true });

      setExcuseSuccessMsg('✓ Absence notice submitted to troop leadership!');
      setTimeout(() => {
        setExcuseSuccessMsg('');
        setShowExcuseModal(false);
        setExcuseNotes('');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit excuse:', err);
      alert('Error submitting absence notice: ' + err.message);
    } finally {
      setExcuseSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Scout Attendance Records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      
      {/* ── TOP HERO BANNER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/50 shrink-0">
              🏕️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Official Attendance Record
                </span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Friday Program & Mandatory Scope
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {targetName}&apos;s Attendance & Compliance
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Track participation across Friday Scouting Programs and mandatory troop events. A minimum 70% active attendance rate is required for rank advancement review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer border border-slate-700"
              >
                &larr; Back
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowExcuseModal(true);
                setExcuseSuccessMsg('');
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02]"
            >
              <Mail size={15} />
              <span>Submit Absence Notice</span>
            </button>
          </div>
        </div>

        {/* ── KPI COMPLIANCE TILES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 relative z-10 text-xs">
          
          {/* Active Participation Rate */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Rate
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                compliance.riskLevel === 'red'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : compliance.riskLevel === 'yellow'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {compliance.riskLabel}
              </span>
            </div>
            <strong className="text-2xl font-black text-white font-mono block">
              {compliance.attendanceRate}%
            </strong>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  compliance.riskLevel === 'red'
                    ? 'bg-rose-500'
                    : compliance.riskLevel === 'yellow'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, compliance.attendanceRate)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              {compliance.presentCount} of {compliance.totalSessions} sessions attended
            </span>
          </div>

          {/* Friday Program Turnout */}
          <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Friday Programs
            </span>
            <strong className="text-2xl font-black text-emerald-300 font-mono block">
              {compliance.fridaySessions.attended} / {compliance.fridaySessions.total}
            </strong>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, compliance.fridaySessions.percentage)}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-400/80 block pt-0.5">
              {compliance.fridaySessions.percentage}% Friday completion
            </span>
          </div>

          {/* Mandatory Troop Events */}
          <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              Mandatory Events
            </span>
            <strong className="text-2xl font-black text-amber-400 font-mono block">
              {compliance.mandatoryEvents.attended} / {compliance.mandatoryEvents.total}
            </strong>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${Math.min(100, compliance.mandatoryEvents.percentage)}%` }}
              />
            </div>
            <span className="text-[10px] text-amber-300/80 block pt-0.5">
              {compliance.mandatoryEvents.percentage}% milestone rating
            </span>
          </div>

          {/* Advancement Review Threshold */}
          <div className="bg-slate-900/90 border border-sky-500/30 p-4 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Advancement Review
              </span>
              <Award size={14} className={compliance.isEligibleForAdvancement ? "text-emerald-400" : "text-amber-400"} />
            </div>
            <strong className={`text-sm font-black font-mono block ${
              compliance.isEligibleForAdvancement ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {compliance.isEligibleForAdvancement ? 'Eligible for Review' : 'Threshold Pending'}
            </strong>
            <span className="text-[10px] text-slate-300 block">
              {compliance.totalTrackedHours}h credited • {compliance.totalCampingNights} nights
            </span>
            <span className="text-[9px] text-slate-400 block pt-0.5">
              {compliance.isEligibleForAdvancement ? '✓ Meets 70% active standard' : '⚠️ Maintain ≥ 70% attendance'}
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
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
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
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>🏕️ Friday Programs</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('mandatory_only')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scopeFilter === 'mandatory_only'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>⭐ Mandatory Only</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scopeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
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
      {compliance.absentCount > 0 && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
          compliance.riskLevel === 'red'
            ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
            : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
        }`}>
          <AlertCircle size={18} className={compliance.riskLevel === 'red' ? 'text-rose-400 shrink-0 mt-0.5' : 'text-amber-400 shrink-0 mt-0.5'} />
          <div className="space-y-1 flex-1">
            <strong className="font-black text-sm block">
              {compliance.riskLevel === 'red' ? 'Critical Attendance Warning' : 'Attendance Follow-up Recommended'}
            </strong>
            <p className="leading-relaxed">
              {targetName} has <strong>{compliance.absentCount} unexcused absence{compliance.absentCount > 1 ? 's' : ''}</strong> recorded in Friday Scouting Programs and mandatory troop events. Missing required sessions directly impacts rank advancement readiness and Scout Spirit standing.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExcuseModal(true)}
                className="underline font-bold hover:text-white cursor-pointer"
              >
                Submit an absence explanation notice &rarr;
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
              Attendance History & Recorded Turnout ({filteredRecords.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {compliance.presentCount} Present &bull; {compliance.absentCount} Absent &bull; {compliance.excusedCount} Excused
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs italic space-y-1">
            <p>No recorded sessions matched your search in this scope.</p>
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
                      ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-500/40'
                      : isExcused
                      ? 'bg-sky-950/20 border-sky-900/40 hover:border-sky-500/40'
                      : isLate
                      ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border ${
                      isAbsent
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : isExcused
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        : isLate
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isExcused
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                            : isLate
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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

      {/* ── ABSENCE EXCUSE MODAL ── */}
      {showExcuseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-emerald-400" />
                <h3 className="font-black text-white text-base">Submit Absence Explanation</h3>
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
                <label className="block font-bold text-slate-300 mb-1">Additional Details / Notes for Leaders:</label>
                <textarea
                  rows={3}
                  placeholder="Provide brief context for patrol leadership review..."
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
