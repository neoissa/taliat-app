import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  Crown, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Edit3, 
  Plus, 
  Save, 
  Sparkles, 
  UserCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { SCOUT_YOUTH_POSITIONS } from '../data/rolesData';
import { YOUTH_LEADERSHIP_POSITIONS, EAGLE_QUALIFYING_POSITIONS } from '../data/troopPositions';

export default function ScoutLeadershipClock({ 
  scout = {}, 
  currentUser = {}, 
  canEdit = false, 
  onSaveSuccess 
}) {
  const profile = { ...currentUser, ...scout };
  const targetUid = profile.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin';
  const isSuper = isOwner || isLeader || canEdit;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Position States
  const [positionTitle, setPositionTitle] = useState(profile.scoutPosition || profile.position || 'General Scout / Member');
  const [startDate, setStartDate] = useState(profile.leadershipStartDate || '');
  const [termMonths, setTermMonths] = useState(profile.leadershipTermMonths || 6);
  const [responsibilities, setResponsibilities] = useState(profile.leadershipResponsibilities || '');
  const [previousPositions, setPreviousPositions] = useState(
    Array.isArray(profile.previousPositions) ? profile.previousPositions : Array.isArray(profile.pastPositions) ? profile.pastPositions : []
  );

  // New Past Position Inputs
  const [pastTitle, setPastTitle] = useState('');
  const [pastDates, setPastDates] = useState('');

  // Calculate Leadership Term Served
  const calculateLeadershipProgress = () => {
    if (!startDate || positionTitle === 'General Scout / Member') {
      return {
        daysServed: 0,
        monthsServed: 0,
        starProgressPct: 0,
        eagleProgressPct: 0,
        isStarMet: false,
        isEagleMet: false
      };
    }

    const start = new Date(startDate + 'T00:00:00');
    const now = new Date();
    const diffMs = now - start;
    const daysServed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const monthsServed = +(daysServed / 30.44).toFixed(1);

    const starProgressPct = Math.min(100, Math.round((monthsServed / 4) * 100));
    const eagleProgressPct = Math.min(100, Math.round((monthsServed / 6) * 100));

    return {
      daysServed,
      monthsServed,
      starProgressPct,
      eagleProgressPct,
      isStarMet: monthsServed >= 4,
      isEagleMet: monthsServed >= 6
    };
  };

  const progress = calculateLeadershipProgress();
  const isEagleQualifying = EAGLE_QUALIFYING_POSITIONS?.some(p => p.toLowerCase() === positionTitle.toLowerCase()) || 
    SCOUT_YOUTH_POSITIONS.some(p => p.id !== 'member' && p.title.toLowerCase() === positionTitle.toLowerCase());

  const handleAddPastPosition = () => {
    if (!pastTitle.trim() || !pastDates.trim()) return;
    setPreviousPositions([
      ...previousPositions,
      { title: pastTitle.trim(), dates: pastDates.trim(), id: Date.now() }
    ]);
    setPastTitle('');
    setPastDates('');
  };

  const handleRemovePastPosition = (idx) => {
    setPreviousPositions(previousPositions.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!targetUid) return;

    setSaving(true);
    setSaveMsg('');
    try {
      const userRef = doc(db, 'users', targetUid);
      const updates = {
        scoutPosition: positionTitle,
        position: positionTitle,
        leadershipStartDate: startDate || null,
        leadershipTermMonths: Number(termMonths) || 6,
        leadershipResponsibilities: responsibilities.trim() || null,
        previousPositions: previousPositions,
        pastPositions: previousPositions,
        updatedLeadershipAt: new Date().toISOString()
      };

      await setDoc(userRef, updates, { merge: true });
      setSaveMsg('✓ Leadership position & term record saved successfully!');
      setIsEditing(false);
      if (onSaveSuccess) onSaveSuccess(updates);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      console.error("Failed to save leadership clock:", err);
      alert("Failed to save leadership records: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── HEADER & SUMMARY ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-lg shadow-amber-950/40">
            <Crown size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                BSA Position of Responsibility
              </span>
              {isEagleQualifying && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  ⚜️ Eagle-Qualifying Role
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Patrol Duties & Eagle Leadership Clock
            </h3>
            <p className="text-xs text-slate-400">
              Track active term duration required for Star (4 months), Life (6 months), and Eagle Scout (6 months).
            </p>
          </div>
        </div>

        {isSuper && (
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-950/40 self-start sm:self-auto"
          >
            <Edit3 size={13} />
            <span>{isEditing ? 'Cancel Edit' : 'Assign / Edit Position'}</span>
          </button>
        )}
      </div>

      {saveMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* ── MAIN DISPLAY CARDS ── */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Active Role Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Crown size={17} className="text-amber-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Current Active Duty</h4>
              </div>
              <span className="text-xs font-black text-amber-300 font-mono">
                {positionTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Term Start Date</span>
                <strong className="text-white font-mono text-xs">{startDate || 'Not set'}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Time Served</span>
                <strong className="text-emerald-400 font-mono text-sm">{progress.monthsServed} Months</strong>
                <span className="text-[10px] text-slate-500 block">({progress.daysServed} days)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Term Goal</span>
                <strong className="text-amber-300 font-mono text-sm">{termMonths} Months</strong>
              </div>
            </div>

            {/* Eagle Leadership Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" />
                  <span>Eagle Leadership Clock (6-Month Requirement):</span>
                </span>
                <span className="font-black text-emerald-400 font-mono">{progress.eagleProgressPct}%</span>
              </div>
              
              <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-700 overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress.eagleProgressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span className={progress.isStarMet ? "text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400"}>
                  {progress.isStarMet ? "✓ 4 Mos Star Req Met" : "○ 4 Mos (Star Rank)"}
                </span>
                <span className={progress.isEagleMet ? "text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400"}>
                  {progress.isEagleMet ? "✓ 6 Mos Life/Eagle Req Met" : "○ 6 Mos (Life & Eagle Rank)"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Key Responsibilities Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Position Expectations</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {responsibilities || 'Active participation in Patrol Leaders\' Council (PLC), leading patrol huddles, and serving as a model scout.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Eagle Qualifying Status</span>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Counts toward Star, Life & Eagle rank</span>
              </span>
            </div>
          </div>

          {/* 3. Past Positions History */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm md:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Past Leadership History</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{previousPositions.length} positions recorded</span>
            </div>

            {previousPositions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No previous troop leadership terms on file. Current position is recorded above.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {previousPositions.map((pos, i) => (
                  <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between gap-2">
                    <div>
                      <strong className="text-white text-xs block">{pos.title}</strong>
                      <span className="text-[11px] text-slate-400 font-mono">{pos.dates}</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── EDIT FORM ── */
        <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl text-xs">
          <h4 className="text-sm font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Edit3 size={15} className="text-amber-400" />
            <span>Update Youth Position of Responsibility</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Position Title */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Select Position of Responsibility:</label>
              <select
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="General Scout / Member">General Scout / Member (No active duty)</option>
                <option value="Senior Patrol Leader">Senior Patrol Leader (SPL)</option>
                <option value="Assistant Senior Patrol Leader">Assistant Senior Patrol Leader (ASPL)</option>
                <option value="Patrol Leader">Patrol Leader (PL)</option>
                <option value="Assistant Patrol Leader">Assistant Patrol Leader (APL)</option>
                <option value="Troop Scribe">Troop Scribe (Attendance & Notes)</option>
                <option value="Troop Quartermaster">Troop Quartermaster (Gear & Supplies)</option>
                <option value="Chaplain Aide / Muezzin">Chaplain Aide / Muezzin (Halqas & Duas)</option>
                <option value="Troop Historian">Troop Historian (Photos & Scrapbook)</option>
                <option value="Troop Webmaster">Troop Webmaster</option>
                <option value="Troop Bugler">Troop Bugler</option>
                <option value="Outdoor Ethics Guide">Outdoor Ethics Guide</option>
                <option value="Junior Assistant Scoutmaster">Junior Assistant Scoutmaster (JASM)</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Term Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Expected Term Length:</label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value={4}>4 Months (Star Requirement)</option>
                <option value={6}>6 Months (Life / Eagle Requirement)</option>
                <option value={12}>12 Months (Full Scouting Year)</option>
              </select>
            </div>

            {/* Specific Duties / Notes */}
            <div className="sm:col-span-3">
              <label className="font-bold text-slate-300 block mb-1">Key Duties & Specific Project Assignment:</label>
              <textarea
                rows={2}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="e.g. Lead weekly patrol roll call, maintain equipment tent, coordinate Quran recitation schedule"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
          </div>

          {/* Past Positions Management */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <label className="font-bold text-slate-300 block">Add Completed Past Position:</label>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                value={pastTitle}
                onChange={(e) => setPastTitle(e.target.value)}
                placeholder="Position Title (e.g. Scribe)"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs flex-1"
              />
              <input
                type="text"
                value={pastDates}
                onChange={(e) => setPastDates(e.target.value)}
                placeholder="Dates (e.g. Sept 2024 - Mar 2025)"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs flex-1 font-mono"
              />
              <button
                type="button"
                onClick={handleAddPastPosition}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition cursor-pointer"
              >
                + Add
              </button>
            </div>

            {previousPositions.map((pos, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-white font-semibold">{pos.title} &bull; <span className="text-slate-400 font-mono">{pos.dates}</span></span>
                <button
                  type="button"
                  onClick={() => handleRemovePastPosition(i)}
                  className="text-red-400 hover:text-red-300 font-bold px-2 py-0.5 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-lg shadow-amber-950/40 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Leadership Term'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
