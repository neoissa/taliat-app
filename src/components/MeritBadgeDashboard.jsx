import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import {
  Award, CheckCircle2, Circle, ChevronDown, ChevronUp,
  X, Trophy, Star, BookOpen, CalendarDays, User, StickyNote
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

function badgeStatus(badge, progress) {
  const p = progress[badge.id];
  if (!p) return 'not-started';
  const total = badge.requirements.length;
  const done = badge.requirements.filter(r => p.steps?.[r.id]).length;
  if (done === total) return 'earned';
  if (done > 0) return 'in-progress';
  return 'not-started';
}

function stepsDone(badge, progress) {
  const p = progress[badge.id];
  if (!p) return 0;
  return badge.requirements.filter(r => p.steps?.[r.id]).length;
}

// ── KPI Header ────────────────────────────────────────────────────────────────

function KPIHeader({ progress }) {
  const earned = MERIT_BADGES.filter(b => badgeStatus(b, progress) === 'earned');
  const inProgress = MERIT_BADGES.filter(b => badgeStatus(b, progress) === 'in-progress');
  const eagleEarned = earned.filter(b => b.eagleRequired).length;
  const overallPct = Math.round(
    (MERIT_BADGES.reduce((sum, b) => {
      const total = b.requirements.length;
      return sum + (total > 0 ? stepsDone(b, progress) / total : 0);
    }, 0) /
      MERIT_BADGES.length) *
      100
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2">
        <Trophy className="text-amber-400" size={22} />
        <h2 className="text-lg font-bold text-white">Merit Badge Dashboard</h2>
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
              <span className="text-slate-500 mx-1">earned</span>
              <span className="text-amber-400">{inProgress.length}</span>
              <span className="text-slate-500 ml-1">in progress</span>
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
            <p className="text-xs text-slate-400">Steps Completed</p>
            <p className="text-base font-bold text-white">
              <span className="text-sky-400">{overallPct}%</span>
              <span className="text-slate-500 ml-1">overall</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Overall badge completion</span>
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

function BadgeModal({ badge, progressEntry, onClose, onToggleStep, onSaveMeta }) {
  const [dateCompleted, setDateCompleted] = useState(progressEntry?.dateCompleted || '');
  const [counselor, setCounselor] = useState(progressEntry?.counselor || '');
  const [notes, setNotes] = useState(progressEntry?.notes || '');
  const [metaDirty, setMetaDirty] = useState(false);

  const steps = badge.requirements;
  const doneCount = steps.filter(r => progressEntry?.steps?.[r.id]).length;
  const pct = Math.round((doneCount / steps.length) * 100);
  const allDone = doneCount === steps.length;

  const handleMetaChange = (setter) => (e) => {
    setter(e.target.value);
    setMetaDirty(true);
  };

  const handleSave = () => {
    onSaveMeta(badge.id, { dateCompleted, counselor, notes });
    setMetaDirty(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl my-8">
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {badge.eagleRequired && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
                  Eagle Required
                </span>
              )}
              {allDone && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  Earned
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

        {/* Progress bar inside modal */}
        <div className="px-5 py-3 border-b border-slate-700/60">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{doneCount} / {steps.length} requirements</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${allDone ? 'bg-emerald-500' : 'bg-sky-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="px-5 py-4 space-y-2 max-h-64 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Requirements</p>
          {steps.map((req) => {
            const isDone = !!progressEntry?.steps?.[req.id];
            return (
              <button
                key={req.id}
                onClick={() => onToggleStep(badge.id, req.id, isDone)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isDone
                    ? <CheckCircle2 className="text-emerald-400" size={17} />
                    : <Circle className="text-slate-500" size={17} />
                  }
                </div>
                <span className={`text-sm ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  <span className="font-semibold text-slate-400 mr-1">{req.id}.</span>
                  {req.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Metadata fields */}
        <div className="px-5 py-4 border-t border-slate-700/60 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Log Details</p>

          <div className="flex items-center gap-3">
            <CalendarDays size={15} className="text-slate-500 shrink-0" />
            <input
              type="date"
              value={dateCompleted}
              onChange={handleMetaChange(setDateCompleted)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Date completed"
            />
          </div>

          <div className="flex items-center gap-3">
            <User size={15} className="text-slate-500 shrink-0" />
            <input
              type="text"
              value={counselor}
              onChange={handleMetaChange(setCounselor)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Counselor name"
            />
          </div>

          <div className="flex items-start gap-3">
            <StickyNote size={15} className="text-slate-500 shrink-0 mt-2" />
            <textarea
              value={notes}
              onChange={handleMetaChange(setNotes)}
              rows={3}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Personal notes..."
            />
          </div>

          {metaDirty && (
            <button
              onClick={handleSave}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 rounded-xl transition cursor-pointer"
            >
              Save Details
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
  const done = stepsDone(badge, progress);
  const total = badge.requirements.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const statusColors = {
    earned: 'border-emerald-700/60 bg-emerald-950/20',
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
            {status === 'in-progress' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold uppercase">
                In Progress
              </span>
            )}
          </div>
          <p className="font-semibold text-white text-sm leading-tight">{badge.name}</p>
        </div>
        {status === 'earned'
          ? <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
          : <Circle className="text-slate-600 shrink-0" size={18} />
        }
      </div>

      {/* Mini progress bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all duration-300 ${status === 'earned' ? 'bg-emerald-500' : 'bg-sky-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500">{done} / {total} steps</p>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MeritBadgeDashboard({ currentUser }) {
  const [progress, setProgress] = useState({});   // { [badgeId]: { steps, dateCompleted, counselor, notes } }
  const [filter, setFilter] = useState('all');     // 'all' | 'eagle' | 'elective' | 'earned' | 'in-progress'
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  const progressCol = `users/${currentUser.uid}/meritBadgeProgress`;

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
  }, [currentUser.uid]);

  const toggleStep = async (badgeId, reqId, isDone) => {
    const ref = doc(db, progressCol, badgeId);
    const existing = progress[badgeId] || {};
    const steps = { ...(existing.steps || {}), [reqId]: !isDone };
    try {
      await setDoc(ref, { ...existing, steps }, { merge: true });
    } catch (err) {
      console.error('Error toggling step:', err);
    }
  };

  const saveMeta = async (badgeId, meta) => {
    const ref = doc(db, progressCol, badgeId);
    try {
      await setDoc(ref, { ...(progress[badgeId] || {}), ...meta }, { merge: true });
    } catch (err) {
      console.error('Error saving meta:', err);
    }
  };

  const filteredBadges = MERIT_BADGES.filter(b => {
    const status = badgeStatus(b, progress);
    if (filter === 'eagle') return b.eagleRequired;
    if (filter === 'elective') return !b.eagleRequired;
    if (filter === 'earned') return status === 'earned';
    if (filter === 'in-progress') return status === 'in-progress';
    return true;
  });

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'eagle', label: 'Eagle Required' },
    { key: 'elective', label: 'Elective' },
    { key: 'earned', label: 'Earned' },
    { key: 'in-progress', label: 'In Progress' },
  ];

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading merit badges...</div>;
  }

  return (
    <div className="space-y-6">
      <KPIHeader progress={progress} />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
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

      {/* Badge Grid */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm bg-slate-800/40 rounded-2xl border border-slate-800">
          No badges in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          onToggleStep={toggleStep}
          onSaveMeta={saveMeta}
        />
      )}
    </div>
  );
}
