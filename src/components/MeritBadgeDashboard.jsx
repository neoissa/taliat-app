import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import {
  Award, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp,
  X, Trophy, Star, BookOpen, CalendarDays, User, StickyNote, FileText, Download, ExternalLink, Check, AlertCircle
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

function getStepState(stepVal) {
  if (stepVal === true || stepVal?.completed === true) return 'approved';
  if (stepVal === 'pending' || stepVal?.pending === true) return 'pending';
  return 'not-started';
}

function badgeStatus(badge, progress) {
  const p = progress[badge.id];
  if (!p) return 'not-started';
  const total = badge.requirements.length;
  const steps = p.steps || {};
  const approvedCount = badge.requirements.filter(r => getStepState(steps[r.id]) === 'approved').length;
  const pendingCount = badge.requirements.filter(r => getStepState(steps[r.id]) === 'pending').length;
  
  if (approvedCount === total && total > 0) return 'earned';
  if (pendingCount > 0 && approvedCount === 0) return 'pending';
  if (approvedCount > 0 || pendingCount > 0) return 'in-progress';
  return 'not-started';
}

function stepsApproved(badge, progress) {
  const p = progress[badge.id];
  if (!p) return 0;
  return badge.requirements.filter(r => getStepState(p.steps?.[r.id]) === 'approved').length;
}

function stepsPending(badge, progress) {
  const p = progress[badge.id];
  if (!p) return 0;
  return badge.requirements.filter(r => getStepState(p.steps?.[r.id]) === 'pending').length;
}

// ── KPI Header ────────────────────────────────────────────────────────────────

function KPIHeader({ progress }) {
  const earned = MERIT_BADGES.filter(b => badgeStatus(b, progress) === 'earned');
  const inProgress = MERIT_BADGES.filter(b => badgeStatus(b, progress) === 'in-progress' || badgeStatus(b, progress) === 'pending');
  const totalPending = MERIT_BADGES.reduce((sum, b) => sum + stepsPending(b, progress), 0);
  const eagleEarned = earned.filter(b => b.eagleRequired).length;
  const overallPct = Math.round(
    (MERIT_BADGES.reduce((sum, b) => {
      const total = b.requirements.length;
      return sum + (total > 0 ? stepsApproved(b, progress) / total : 0);
    }, 0) /
      MERIT_BADGES.length) *
      100
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5 print-hide">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="text-amber-400" size={22} />
          <h2 className="text-lg font-bold text-white">Merit Badge Dashboard</h2>
        </div>
        {totalPending > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 animate-pulse">
            <Clock size={13} /> {totalPending} Requirement{totalPending !== 1 ? 's' : ''} Pending Approval
          </span>
        )}
      </div>

      {/* Three KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Earned vs In-Progress */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Badges Status</p>
            <p className="text-base font-bold text-white">
              <span className="text-emerald-400">{earned.length}</span>
              <span className="text-slate-500 mx-1 text-xs">earned</span>
              <span className="text-amber-400">{inProgress.length}</span>
              <span className="text-slate-500 ml-1 text-xs">in progress</span>
            </p>
          </div>
        </div>

        {/* Eagle-Required Ratio */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Eagle-Required</p>
            <p className="text-base font-bold text-white">
              <span className="text-amber-400">{eagleEarned}</span>
              <span className="text-slate-500"> / {TOTAL_EAGLE_REQUIRED_FOR_RANK}</span>
            </p>
          </div>
        </div>

        {/* Overall % */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Requirements Approved</p>
            <p className="text-base font-bold text-white">
              <span className="text-sky-400">{overallPct}%</span>
              <span className="text-slate-500 ml-1 text-xs">overall</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Overall badge completion (Approved)</span>
          <span>{overallPct}%</span>
        </div>
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Badge Detail Modal ────────────────────────────────────────────────────────

function BadgeModal({ badge, progressEntry, onClose, onToggleStep, onApproveStep, onSaveMeta, readOnly, isLeaderOrOwner, isScout }) {
  const [dateCompleted, setDateCompleted] = useState(progressEntry?.dateCompleted || '');
  const [counselor, setCounselor] = useState(progressEntry?.counselor || '');
  const [notes, setNotes] = useState(progressEntry?.notes || '');
  const [metaDirty, setMetaDirty] = useState(false);

  const steps = badge.requirements;
  const approvedCount = steps.filter(r => getStepState(progressEntry?.steps?.[r.id]) === 'approved').length;
  const pendingCount = steps.filter(r => getStepState(progressEntry?.steps?.[r.id]) === 'pending').length;
  const pct = Math.round((approvedCount / steps.length) * 100);
  const allApproved = approvedCount === steps.length;

  const handleMetaChange = (setter) => (e) => {
    setter(e.target.value);
    setMetaDirty(true);
  };

  const handleSave = () => {
    if (readOnly) return;
    onSaveMeta(badge.id, { dateCompleted, counselor, notes });
    setMetaDirty(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${badge.name} merit badge details`}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl my-8">
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-700">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {badge.eagleRequired && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
                  Eagle Required
                </span>
              )}
              {allApproved && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  Earned & Approved
                </span>
              )}
              {!allApproved && pendingCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase flex items-center gap-1">
                  <Clock size={11} /> {pendingCount} Pending Approval
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">{badge.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{badge.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Packet Links Banner */}
        <div className="bg-slate-900/70 border-b border-slate-700/80 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-350 font-semibold flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-400" /> Official Workbook Packets:
          </span>
          <div className="flex flex-wrap gap-2">
            {badge.packetPdfUrl && (
              <a
                href={badge.packetPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Download size={12} className="text-red-400" /> PDF Packet
              </a>
            )}
            {badge.packetDocxUrl && (
              <a
                href={badge.packetDocxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Download size={12} className="text-blue-400" /> Word (.docx)
              </a>
            )}
            {badge.pageUrl && (
              <a
                href={badge.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
              >
                <ExternalLink size={12} /> Online Guide
              </a>
            )}
          </div>
        </div>

        {/* Progress bar inside modal */}
        <div className="px-5 py-3 border-b border-slate-700/60">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{approvedCount} / {steps.length} approved ({pendingCount} pending)</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${allApproved ? 'bg-emerald-500' : 'bg-sky-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="px-5 py-4 space-y-2.5 max-h-72 overflow-y-auto">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Requirements Checklist</p>
            <span className="text-[10px] text-slate-400">
              {isScout ? 'Click to submit requirement to leader' : 'Click to approve/test requirement'}
            </span>
          </div>

          {steps.map((req) => {
            const rawStep = progressEntry?.steps?.[req.id];
            const state = getStepState(rawStep);
            const isApproved = state === 'approved';
            const isPending = state === 'pending';

            return (
              <div
                key={req.id}
                className={`w-full text-left p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                  isApproved
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : isPending
                    ? 'bg-amber-950/20 border-amber-600/40'
                    : 'bg-slate-900/50 border-slate-700/60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="shrink-0 mt-0.5">
                    {isApproved ? (
                      <CheckCircle2 className="text-emerald-400" size={18} />
                    ) : isPending ? (
                      <Clock className="text-amber-400 animate-pulse" size={18} />
                    ) : (
                      <Circle className="text-slate-500" size={18} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xs ${isApproved ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      <span className="font-bold text-slate-350 mr-1.5">{req.id}.</span>
                      {req.text}
                    </p>
                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center gap-1">
                          <Clock size={10} /> Pending Leader Approval
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!readOnly && (
                  <div className="shrink-0 flex items-center gap-1.5">
                    {isScout && (
                      <button
                        onClick={() => onToggleStep(badge.id, req.id, state)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                          isPending
                            ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40'
                            : isApproved
                            ? 'opacity-50 cursor-not-allowed bg-emerald-950/30 text-emerald-400'
                            : 'bg-slate-700 hover:bg-emerald-600 text-white'
                        }`}
                        disabled={isApproved}
                      >
                        {isPending ? 'Cancel' : isApproved ? 'Approved' : 'Submit'}
                      </button>
                    )}

                    {isLeaderOrOwner && (
                      <button
                        onClick={() => onApproveStep(badge.id, req.id, state)}
                        className={`text-xs px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 ${
                          isApproved
                            ? 'bg-emerald-700/40 text-emerald-300 hover:bg-red-900/40 hover:text-red-300 border border-emerald-600/30'
                            : isPending
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 animate-pulse'
                            : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                        }`}
                      >
                        {isApproved ? 'Approved ✓' : isPending ? 'Approve Now' : 'Mark Complete'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Metadata fields */}
        <div className="px-5 py-4 border-t border-slate-700/60 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sign-off & Log Details</p>

          <div className="flex items-center gap-3">
            <CalendarDays size={15} className="text-slate-500 shrink-0" />
            <input
              type="date"
              disabled={readOnly}
              value={dateCompleted}
              onChange={handleMetaChange(setDateCompleted)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              placeholder="Date completed"
            />
          </div>

          <div className="flex items-center gap-3">
            <User size={15} className="text-slate-500 shrink-0" />
            <input
              type="text"
              disabled={readOnly}
              value={counselor}
              onChange={handleMetaChange(setCounselor)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              placeholder="Merit badge counselor name"
            />
          </div>

          <div className="flex items-start gap-3">
            <StickyNote size={15} className="text-slate-500 shrink-0 mt-2" />
            <textarea
              value={notes}
              disabled={readOnly}
              onChange={handleMetaChange(setNotes)}
              rows={2}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none disabled:opacity-50"
              placeholder="Notes or leader feedback..."
            />
          </div>

          {!readOnly && metaDirty && (
            <button
              onClick={handleSave}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
            >
              Save Sign-off Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Badge Card ────────────────────────────────────────────────────────────────

function BadgeCard({ badge, progress, onOpen }) {
  const status = badgeStatus(badge, progress);
  const done = stepsApproved(badge, progress);
  const pending = stepsPending(badge, progress);
  const total = badge.requirements.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const statusColors = {
    earned: 'border-emerald-700/60 bg-emerald-950/20',
    pending: 'border-amber-600/50 bg-amber-950/20',
    'in-progress': 'border-sky-700/50 bg-sky-950/20',
    'not-started': 'border-slate-700 bg-slate-800',
  };

  return (
    <button
      onClick={() => onOpen(badge)}
      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer hover:border-slate-500 ${statusColors[status]}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {badge.eagleRequired && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
                Eagle
              </span>
            )}
            {status === 'earned' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                Earned
              </span>
            )}
            {pending > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase flex items-center gap-1">
                <Clock size={10} /> {pending} Pending
              </span>
            )}
            {status === 'in-progress' && pending === 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold uppercase">
                In Progress
              </span>
            )}
          </div>
          <p className="font-semibold text-white text-sm leading-tight">{badge.name}</p>
        </div>
        {status === 'earned' ? (
          <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
        ) : pending > 0 ? (
          <Clock className="text-amber-400 shrink-0" size={18} />
        ) : (
          <Circle className="text-slate-600 shrink-0" size={18} />
        )}
      </div>

      {/* Mini progress bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all duration-300 ${status === 'earned' ? 'bg-emerald-500' : 'bg-sky-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>{done} / {total} approved</span>
        {badge.packetPdfUrl && (
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <Download size={10} /> Packet
          </span>
        )}
      </div>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MeritBadgeDashboard({ currentUser, scoutId: customScoutId, readOnly = false }) {
  const scoutId = customScoutId || currentUser.uid;
  const isLeaderOrOwner = currentUser.role === 'leader' || currentUser.role === 'owner';
  const isScout = currentUser.role === 'scout';

  const [progress, setProgress] = useState({});   // { [badgeId]: { steps, dateCompleted, counselor, notes } }
  const [filter, setFilter] = useState('all');     // 'all' | 'eagle' | 'elective' | 'earned' | 'pending' | 'in-progress'
  const [search, setSearch] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  const progressCol = `user_progress/${scoutId}/merit_badges`;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, progressCol), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setProgress(map);
      setLoading(false);
    }, (err) => {
      console.error('Merit badge progress error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, [scoutId]);

  // Scout toggles step -> sets to 'pending' or resets
  const handleToggleStepScout = async (badgeId, reqId, currentState) => {
    if (readOnly) return;
    const ref = doc(db, progressCol, badgeId);
    const existing = progress[badgeId] || {};
    const currentSteps = existing.steps || {};
    
    let nextVal = 'pending';
    if (currentState === 'pending') {
      nextVal = false;
    }

    const steps = { ...currentSteps, [reqId]: nextVal };
    try {
      await setDoc(ref, { ...existing, steps, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.error('Error submitting step:', err);
    }
  };

  // Leader toggles step -> approves or resets
  const handleApproveStepLeader = async (badgeId, reqId, currentState) => {
    if (readOnly) return;
    const ref = doc(db, progressCol, badgeId);
    const existing = progress[badgeId] || {};
    const currentSteps = existing.steps || {};
    
    let nextVal = true;
    if (currentState === 'approved') {
      if (!window.confirm("Mark this requirement as incomplete?")) return;
      nextVal = false;
    }

    const steps = { ...currentSteps, [reqId]: nextVal };
    try {
      await setDoc(ref, {
        ...existing,
        steps,
        approvedBy: currentUser.uid,
        approvedByName: currentUser.fullName || currentUser.username,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Error approving step:', err);
    }
  };

  const saveMeta = async (badgeId, meta) => {
    if (readOnly) return;
    const ref = doc(db, progressCol, badgeId);
    try {
      await setDoc(ref, { ...(progress[badgeId] || {}), ...meta }, { merge: true });
    } catch (err) {
      console.error('Error saving meta:', err);
    }
  };

  const filteredBadges = MERIT_BADGES.filter(b => {
    const status = badgeStatus(b, progress);
    const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'eagle') return b.eagleRequired;
    if (filter === 'elective') return !b.eagleRequired;
    if (filter === 'earned') return status === 'earned';
    if (filter === 'pending') return stepsPending(b, progress) > 0;
    if (filter === 'in-progress') return status === 'in-progress' || status === 'pending';
    return true;
  });

  const filterTabs = [
    { key: 'all', label: `All (${MERIT_BADGES.length})` },
    { key: 'eagle', label: 'Eagle Required' },
    { key: 'elective', label: 'Elective' },
    { key: 'pending', label: 'Pending Approval' },
    { key: 'earned', label: 'Earned' },
    { key: 'in-progress', label: 'In Progress' },
  ];

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading merit badges...</div>;
  }

  return (
    <div className="space-y-6">
      <KPIHeader progress={progress} />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center print-hide">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filter === key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search 137+ merit badges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 sm:w-60"
        />
      </div>

      {/* Badge Grid */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm bg-slate-800/40 rounded-2xl border border-slate-800">
          No badges found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              progress={progress}
              onOpen={setSelectedBadge}
            />
          ))}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          progressEntry={progress[selectedBadge.id]}
          onClose={() => setSelectedBadge(null)}
          onToggleStep={handleToggleStepScout}
          onApproveStep={handleApproveStepLeader}
          onSaveMeta={saveMeta}
          readOnly={readOnly}
          isLeaderOrOwner={isLeaderOrOwner}
          isScout={isScout}
        />
      )}
    </div>
  );
}
