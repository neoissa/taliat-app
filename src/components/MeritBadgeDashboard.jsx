import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK, TOTAL_MERIT_BADGES_FOR_EAGLE } from '../data/meritBadges';
import {
  Award, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp,
  X, Trophy, Star, BookOpen, CalendarDays, User, StickyNote, FileText, Download, ExternalLink, Check, AlertCircle, Plus, Trash2, Target, Sparkles, CheckSquare, Compass, ShieldAlert, Zap, Globe, FileDown, AlertTriangle
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
  if (p.planned) return 'planned';
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

function getCategoryIcon(catName = '') {
  if (catName.includes('Outdoor')) return '🏕️';
  if (catName.includes('Civics')) return '🤝';
  if (catName.includes('Health')) return '🩹';
  if (catName.includes('Fitness')) return '🏃';
  if (catName.includes('Nature') || catName.includes('STEM')) return '🔬';
  if (catName.includes('Trades')) return '🛠️';
  if (catName.includes('Arts')) return '🎨';
  return '🏅';
}

// ── KPI Header ────────────────────────────────────────────────────────────────

function KPIHeader({ progress, activeTab, onSelectTab }) {
  const earned = MERIT_BADGES.filter(b => badgeStatus(b, progress) === 'earned');
  const inProgress = MERIT_BADGES.filter(b => badgeStatus(b, progress) === 'in-progress' || badgeStatus(b, progress) === 'pending');
  const planned = MERIT_BADGES.filter(b => progress[b.id]?.planned && badgeStatus(b, progress) !== 'earned');
  const totalPending = MERIT_BADGES.reduce((sum, b) => sum + stepsPending(b, progress), 0);
  
  // Eagle calculations (14 Eagle-Required + 7 Electives = 21 Total)
  const eagleRequiredEarned = earned.filter(b => b.eagleRequired).length;
  const eagleRequiredPlanned = planned.filter(b => b.eagleRequired).length;
  const electivesEarned = earned.filter(b => !b.eagleRequired).length;
  const electivesPlanned = planned.filter(b => !b.eagleRequired).length;

  const totalEaglePathPlannedOrEarned = Math.min(14, eagleRequiredEarned + eagleRequiredPlanned) + Math.min(7, electivesEarned + electivesPlanned);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5 print-hide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-lg shrink-0">
            🏅
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Official BSA & USScouts Database
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                137 Official Badges
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>Merit Badge Dashboard & Eagle Fast-Track</span>
            </h2>
            <p className="text-xs text-slate-350">
              Download official worksheets, view requirements from Scouting America & USScouts, and plan your 21 Eagle Merit Badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {totalPending > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 animate-pulse">
              <Clock size={13} /> {totalPending} Pending Approval
            </span>
          )}
          <button
            onClick={() => onSelectTab('planned')}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md ${
              activeTab === 'planned'
                ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400'
                : 'bg-slate-700 hover:bg-slate-650 text-amber-300 border border-amber-500/30'
            }`}
          >
            <Target size={14} />
            <span>My Planned Badges ({planned.length + earned.length}/21)</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Eagle Path Roadmap */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
            <Star size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Eagle 21-Badge Path</p>
            <p className="text-base font-black text-white">
              <span className="text-amber-400">{totalEaglePathPlannedOrEarned}</span>
              <span className="text-slate-500 text-xs"> / 21 Planned/Earned</span>
            </p>
          </div>
        </div>

        {/* 14 Eagle-Required */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">14 Eagle Required</p>
            <p className="text-base font-black text-white">
              <span className="text-emerald-400">{eagleRequiredEarned}</span>
              <span className="text-slate-500 text-xs"> earned • </span>
              <span className="text-amber-400">{eagleRequiredPlanned}</span>
              <span className="text-slate-500 text-xs"> planned</span>
            </p>
          </div>
        </div>

        {/* 7 Electives */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">7 Elective Badges</p>
            <p className="text-base font-black text-white">
              <span className="text-sky-400">{electivesEarned}</span>
              <span className="text-slate-500 text-xs"> earned • </span>
              <span className="text-amber-400">{electivesPlanned}</span>
              <span className="text-slate-500 text-xs"> planned</span>
            </p>
          </div>
        </div>
      </div>

      {/* Eagle Roadmap Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-350 font-semibold mb-1">
          <span>Eagle Rank 21-Badge Path Progress</span>
          <span className="font-bold text-amber-400">{Math.round((totalEaglePathPlannedOrEarned / 21) * 100)}% ({totalEaglePathPlannedOrEarned}/21)</span>
        </div>
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, Math.round((totalEaglePathPlannedOrEarned / 21) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Badge Detail Modal ────────────────────────────────────────────────────────

function BadgeModal({ badge, progressEntry, onClose, onToggleStep, onApproveStep, onTogglePlanned, onSaveMeta, readOnly, isLeaderOrOwner, isScout }) {
  const [dateCompleted, setDateCompleted] = useState(progressEntry?.dateCompleted || '');
  const [counselor, setCounselor] = useState(progressEntry?.counselor || '');
  const [notes, setNotes] = useState(progressEntry?.notes || '');
  const [plannedTarget, setPlannedTarget] = useState(progressEntry?.plannedTarget || '');
  const [metaDirty, setMetaDirty] = useState(false);

  const steps = badge.requirements || [];
  const approvedCount = steps.filter(r => getStepState(progressEntry?.steps?.[r.id]) === 'approved').length;
  const pendingCount = steps.filter(r => getStepState(progressEntry?.steps?.[r.id]) === 'pending').length;
  const pct = steps.length > 0 ? Math.round((approvedCount / steps.length) * 100) : 0;
  const allApproved = steps.length > 0 && approvedCount === steps.length;
  const isPlanned = !!progressEntry?.planned;

  const handleMetaChange = (setter) => (e) => {
    setter(e.target.value);
    setMetaDirty(true);
  };

  const handleSave = () => {
    if (readOnly) return;
    onSaveMeta(badge.id, { dateCompleted, counselor, notes, plannedTarget });
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
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700 bg-slate-850">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {badge.eagleRequired ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase flex items-center gap-1">
                  <Star size={11} /> Eagle Required
                </span>
              ) : (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold uppercase">
                  Elective Badge
                </span>
              )}

              {badge.category && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span>{getCategoryIcon(badge.category)}</span> {badge.category}
                </span>
              )}

              {allApproved && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  ✓ Earned & Approved
                </span>
              )}

              {isPlanned && !allApproved && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black uppercase flex items-center gap-1">
                  <Target size={11} /> Planned For Eagle Path
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-white">{badge.name}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Action Bar: Plan toggle + Official Downloads & Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-750">
            {/* Left: Plan toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className={isPlanned ? "text-amber-400" : "text-slate-500"} size={18} />
                <div>
                  <strong className="text-xs font-bold text-white block">
                    {isPlanned ? "In Your Plan" : "Add to Roadmap"}
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    {isPlanned ? "21-badge Eagle path" : "Track towards Eagle"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onTogglePlanned(badge.id, isPlanned)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  isPlanned
                    ? 'bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/40'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                }`}
              >
                {isPlanned ? (
                  <>
                    <Trash2 size={12} /> Remove
                  </>
                ) : (
                  <>
                    <Plus size={13} /> Add to Plan
                  </>
                )}
              </button>
            </div>

            {/* Right: Official Pamphlet, Worksheets & External Links */}
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              {badge.pamphletUrl && (
                <a
                  href={badge.pamphletUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
                  title={`Open Official ${badge.name} Merit Badge Pamphlet & Guide`}
                >
                  <BookOpen size={13} />
                  <span>Official Pamphlet</span>
                </a>
              )}

              {badge.packetPdfUrl && (
                <a
                  href={badge.packetPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 font-bold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1 border border-emerald-500/30"
                  title="Download Printable USScouts PDF Workbook"
                >
                  <FileDown size={13} />
                  <span>PDF Workbook</span>
                </a>
              )}

              {badge.packetDocxUrl && (
                <a
                  href={badge.packetDocxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-[11px] px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 border border-slate-700"
                  title="Download Editable Word DOCX Workbook"
                >
                  <FileText size={13} />
                  <span>DOCX</span>
                </a>
              )}

              {badge.scoutShopPamphletUrl && (
                <a
                  href={badge.scoutShopPamphletUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 font-semibold text-[11px] px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 border border-slate-700"
                  title="Purchase Print Pamphlet on ScoutShop.org"
                >
                  <ExternalLink size={13} />
                  <span>ScoutShop</span>
                </a>
              )}
            </div>
          </div>

          {/* Official Pamphlet Specification Card */}
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="text-xs font-black text-white">
                    {badge.pamphletTitle || `${badge.name} Merit Badge Pamphlet`}
                  </h5>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.2 rounded-full font-bold">
                    Rev. {badge.pamphletRevYear || '2024'}
                  </span>
                  {badge.pamphletSku && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.2 rounded-full font-mono">
                      Item SKU #{badge.pamphletSku}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Official Scouting America study guide, counselor instructions, and workbook references.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <a
                href={badge.pamphletGuideUrl || "http://www.usscouts.org/mb/mbbooks.asp"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition"
                title="View in USScouts Pamphlet Revision Catalog"
              >
                <span>USScouts Index</span>
                <ExternalLink size={11} />
              </a>
              <a
                href={badge.scoutingOrgSkillsUrl || "https://www.scouting.org/skills/merit-badges/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900 px-2.5 py-1.5 rounded-lg border border-sky-700/50 flex items-center gap-1 transition"
                title="View Scouting.org Skills Library"
              >
                <span>Scouting.org Hub</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Time Alert Banner if Badge has special tracking or prerequisite */}
          {badge.timeAlert && (
            <div className="bg-amber-950/40 border border-amber-500/50 p-3.5 rounded-2xl flex items-start gap-2.5 shadow-sm">
              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
              <div className="text-xs">
                <strong className="text-amber-300 block mb-0.5">Time-Commitment / Prerequisite Alert:</strong>
                <p className="text-amber-200/90 leading-relaxed">{badge.timeAlert}</p>
              </div>
            </div>
          )}

          {/* Eagle Pro-Tip Banner */}
          {badge.eagleTip && (
            <div className="bg-slate-900/60 border border-slate-750 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs">
              <Zap className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-emerald-400 block mb-0.5">⚡ Eagle Scout Strategy Tip:</strong>
                <p className="text-slate-300 leading-relaxed">{badge.eagleTip}</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Requirements Progress ({approvedCount} / {steps.length} approved)</span>
              <span className="font-bold text-emerald-400">{pct}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare size={14} className="text-emerald-400" />
              <span>Badge Requirements Checklist ({steps.length})</span>
            </h4>
            <div className="space-y-2">
              {steps.map((req, idx) => {
                const state = getStepState(progressEntry?.steps?.[req.id]);
                const isApproved = state === 'approved';
                const isPending = state === 'pending';

                return (
                  <div
                    key={req.id}
                    className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                      isApproved
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : isPending
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-slate-900/40 border-slate-750'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={readOnly || (isScout && isApproved)}
                      onClick={() => {
                        if (isLeaderOrOwner) {
                          onApproveStep(badge.id, req.id, state);
                        } else {
                          onToggleStep(badge.id, req.id, state);
                        }
                      }}
                      className="mt-0.5 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                    >
                      {isApproved ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : isPending ? (
                        <Clock size={18} className="text-amber-400 animate-pulse" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>

                    <div className="flex-1 text-xs">
                      <span className="font-bold text-slate-400 block mb-0.5">Requirement {req.id || idx + 1}</span>
                      <p className="text-slate-200 leading-relaxed">{req.text}</p>
                    </div>

                    <div className="shrink-0">
                      {isApproved && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                          Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                          Pending Leader
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planning & Counselor Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-700/60">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Target Season / Date (e.g. Summer Camp 2026)
              </label>
              <input
                type="text"
                value={plannedTarget}
                onChange={handleMetaChange(setPlannedTarget)}
                placeholder="e.g. Summer Camp 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Merit Badge Counselor Name
              </label>
              <input
                type="text"
                value={counselor}
                onChange={handleMetaChange(setCounselor)}
                placeholder="e.g. Br. Tariq / Leader"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {metaDirty && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                Save Planning Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Badge Card ────────────────────────────────────────────────────────────────

function BadgeCard({ badge, progress, onOpen, onTogglePlanned }) {
  const status = badgeStatus(badge, progress);
  const p = progress[badge.id] || {};
  const isPlanned = !!p.planned;
  const isEarned = status === 'earned';
  const isPending = status === 'pending';
  const isInProgress = status === 'in-progress';
  const approved = stepsApproved(badge, progress);
  const total = badge.requirements.length;

  return (
    <div className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 shadow-md ${
      isEarned
        ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
        : isPlanned
        ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {badge.eagleRequired ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase flex items-center gap-1">
                <Star size={10} /> Eagle
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 font-semibold uppercase">
                Elective
              </span>
            )}

            {badge.category && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                {getCategoryIcon(badge.category)} {badge.category.split('&')[0].trim()}
              </span>
            )}
          </div>

          {isEarned ? (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              ✓ Earned
            </span>
          ) : isPlanned ? (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30 flex items-center gap-1">
              <Target size={10} /> Planned
            </span>
          ) : isPending ? (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
              Pending
            </span>
          ) : null}
        </div>

        <h4 className="font-extrabold text-sm text-white mb-1">{badge.name}</h4>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{badge.description}</p>
        
        {badge.timeAlert && (
          <div className="mt-2 text-[10px] text-amber-300/90 font-medium bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1">
            <Clock size={10} className="shrink-0 text-amber-400" />
            <span className="truncate">{badge.timeCommitment}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-700/50">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{approved}/{total} Steps Approved</span>
          <span className="font-bold text-white">{total > 0 ? Math.round((approved / total) * 100) : 0}%</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpen(badge)}
            className="flex-1 bg-slate-700 hover:bg-slate-650 text-white font-semibold text-xs py-1.5 rounded-xl transition cursor-pointer text-center"
          >
            Requirements
          </button>

          {badge.pamphletUrl && (
            <a
              href={badge.pamphletUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-900/80 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 hover:border-teal-400 rounded-xl transition cursor-pointer"
              title={`View ${badge.name} Official Pamphlet & Guide (Rev. ${badge.pamphletRevYear || '2024'})`}
            >
              <BookOpen size={14} />
            </a>
          )}

          {badge.packetPdfUrl && (
            <a
              href={badge.packetPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-900/60 hover:bg-emerald-600 text-slate-400 hover:text-white border border-slate-750 hover:border-emerald-500/40 rounded-xl transition cursor-pointer"
              title="Download Printable PDF Workbook"
            >
              <FileDown size={14} />
            </a>
          )}
          
          <button
            onClick={() => onTogglePlanned(badge.id, isPlanned)}
            className={`p-1.5 rounded-xl transition cursor-pointer border ${
              isPlanned
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-red-950/40 hover:text-red-400 hover:border-red-800'
                : 'bg-slate-900/60 text-slate-400 border-slate-750 hover:text-amber-300 hover:border-amber-500/40'
            }`}
            title={isPlanned ? "Remove from planned list" : "Add to My Planned Badges"}
          >
            <Target size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Merit Badge Dashboard ────────────────────────────────────────────────

export default function MeritBadgeDashboard({ currentUser, scoutId: customScoutId, readOnly = false }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  const scoutId = customScoutId || currentUser?.uid;

  const [progress, setProgress] = useState({});
  const [filter, setFilter] = useState('planned');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  const progressCol = `user_progress/${scoutId}/merit_badges`;

  useEffect(() => {
    if (!scoutId) return;
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

  // Toggle Planned state
  const handleTogglePlanned = async (badgeId, currentlyPlanned) => {
    if (readOnly) return;
    const ref = doc(db, progressCol, badgeId);
    const existing = progress[badgeId] || {};
    try {
      await setDoc(ref, {
        ...existing,
        planned: !currentlyPlanned,
        plannedAt: !currentlyPlanned ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error toggling planned badge:", err);
    }
  };

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
        approvedBy: currentUser?.uid || 'leader',
        approvedByName: currentUser?.fullName || currentUser?.username || 'Leader',
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
    const isPlanned = !!progress[b.id]?.planned;
    const matchesSearch = !search || 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.requirements.some(r => r.text.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    if (categoryFilter !== 'all' && b.category !== categoryFilter) {
      return false;
    }

    if (filter === 'planned') return isPlanned || status === 'earned';
    if (filter === 'eagle') return b.eagleRequired;
    if (filter === 'elective') return !b.eagleRequired;
    if (filter === 'long-duration') return !!b.timeAlert;
    if (filter === 'earned') return status === 'earned';
    if (filter === 'pending') return stepsPending(b, progress) > 0;
    if (filter === 'in-progress') return status === 'in-progress' || status === 'pending';
    return true;
  });

  const filterTabs = [
    { key: 'planned', label: '🎯 My Planned Badges' },
    { key: 'all', label: `All Badges (${MERIT_BADGES.length})` },
    { key: 'eagle', label: '⭐ Eagle Required (14)' },
    { key: 'long-duration', label: '⏳ 90-Day Tracking Badges' },
    { key: 'elective', label: '🎨 Electives' },
    { key: 'pending', label: '⏳ Pending Approval' },
    { key: 'earned', label: '✓ Earned' },
  ];

  const categoriesList = [
    { id: 'all', label: 'All Categories' },
    { id: 'Outdoor & Wilderness', label: '🏕️ Outdoor & Wilderness' },
    { id: 'Civics & Citizenship', label: '🤝 Civics & Citizenship' },
    { id: 'Health & Safety', label: '🩹 Health & Safety' },
    { id: 'Life Skills & Fitness', label: '🏃 Life Skills & Fitness' },
    { id: 'Nature & Science (STEM)', label: '🔬 Nature & Science' },
    { id: 'STEM & Technology', label: '💻 STEM & Technology' },
    { id: 'Trades & Craftsmanship', label: '🛠️ Trades & Craftsmanship' },
    { id: 'Arts & Hobbies', label: '🎨 Arts & Hobbies' },
    { id: 'Careers & Electives', label: '👔 Careers & Electives' },
  ];

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading merit badges...</div>;
  }

  return (
    <div className="space-y-6">
      <KPIHeader progress={progress} activeTab={filter} onSelectTab={setFilter} />

      {/* Top Quick Resource Reference Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950/40 border border-teal-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg print-hide">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-2">
              <span>Official Merit Badge Pamphlet & Workbook Resources</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.2 rounded-full font-bold">
                137 Official Badges
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Access official Scouting America pamphlets, USScouts revision index, printable PDF workbooks, and DOCX worksheets for all merit badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <a
            href="http://www.usscouts.org/mb/mbbooks.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800 hover:bg-slate-750 text-teal-300 hover:text-white border border-teal-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <span>📚 USScouts Books Index</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="https://www.scouting.org/skills/merit-badges/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <span>🌐 Scouting.org Skills Hub</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 justify-between print-hide">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filter === key
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer sm:w-60"
          >
            {categoriesList.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search badges, skills or requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 sm:w-72"
          />
        </div>
      </div>

      {/* Fast-Track 90-Day Badges Alert Banner if on 'long-duration' tab */}
      {filter === 'long-duration' && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-800 to-amber-950/60 border border-amber-500/50 rounded-2xl p-5 shadow-xl space-y-2 print-hide">
          <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
            <Zap size={18} className="text-amber-400" />
            <span>Eagle Scout Fast-Track: 90-Day & Multi-Week Tracking Badges</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            These merit badges (such as <strong>Personal Fitness</strong>, <strong>Personal Management</strong>, <strong>Family Life</strong>, and <strong>Camping</strong>) have mandatory multi-week tracking logs that cannot be finished in a single weekend. <strong>Start these early in your scouting journey to avoid delays on your path to Eagle!</strong>
          </p>
        </div>
      )}

      {/* Planned Badges Roadmap Guide if on 'planned' tab */}
      {filter === 'planned' && (
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-amber-950/30 border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-3 print-hide">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
            <Sparkles size={18} />
            <span>How to Plan Your Eagle Rank (21 Merit Badges)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To achieve the <strong>Eagle Scout Rank</strong>, you need a minimum of <strong>21 merit badges</strong>: exactly <strong>14 Eagle-Required badges</strong> (such as First Aid, Citizenship, Camping, Cooking, Personal Fitness) plus <strong>7 Elective badges</strong>.
            Click the target icon <span className="text-amber-400 font-bold">🎯</span> on any badge below or browse "All Badges" to add badges to your personal roadmap!
          </p>
        </div>
      )}

      {/* Badge Grid */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
          <Target size={36} className="mx-auto text-amber-400 opacity-40" />
          {filter === 'planned' ? (
            <div>
              <p className="font-bold text-white">No planned badges added yet!</p>
              <p className="text-xs text-slate-400 mt-1">
                Switch to the "All Badges" or "Eagle Required" tab to pick the merit badges you want to earn.
              </p>
              <button
                onClick={() => setFilter('eagle')}
                className="mt-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Browse Eagle Required Badges
              </button>
            </div>
          ) : (
            <p>No badges found matching your criteria.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              progress={progress}
              onOpen={setSelectedBadge}
              onTogglePlanned={handleTogglePlanned}
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
          onTogglePlanned={handleTogglePlanned}
          onSaveMeta={saveMeta}
          readOnly={readOnly}
          isLeaderOrOwner={isLeaderOrOwner}
          isScout={isScout}
        />
      )}
    </div>
  );
}
