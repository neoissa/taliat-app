import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Flame, 
  Scissors, 
  Tent, 
  Award, 
  Check, 
  Sparkles,
  Layers,
  Shirt
} from 'lucide-react';

export default function ScoutUniformGear({ 
  scout = {}, 
  currentUser = {}, 
  canEdit = false, 
  onSaveSuccess 
}) {
  const profile = { ...currentUser, ...scout };
  const targetUid = profile.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin';
  const isParent = currentUser?.role === 'parent';
  const isSelf = currentUser?.uid === targetUid;
  const userCanEdit = canEdit || isOwner || isLeader || isParent || isSelf;

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Sizing & Gear States
  const [shirtSize, setShirtSize] = useState(profile.uniformShirtSize || 'Youth L');
  const [bootSize, setBootSize] = useState(profile.bootSize || '8 US');
  const [beltSize, setBeltSize] = useState(profile.beltSize || 'Medium');
  const [backpackCapacity, setBackpackCapacity] = useState(profile.backpackCapacity || '50 Liters');
  const [sleepingBagRating, setSleepingBagRating] = useState(profile.sleepingBagRating || '20°F (3-Season / Winter)');
  const [hasNeckerchief, setHasNeckerchief] = useState(profile.hasNeckerchief !== false);
  const [hasSash, setHasSash] = useState(Boolean(profile.hasSash));
  const [hasMessKit, setHasMessKit] = useState(profile.hasMessKit !== false);
  const [totinChip, setTotinChip] = useState(Boolean(profile.totinChip));
  const [firemnChit, setFiremnChit] = useState(Boolean(profile.firemnChit));
  const [uniformInspected, setUniformInspected] = useState(Boolean(profile.uniformInspected));
  const [gearNotes, setGearNotes] = useState(profile.gearNotes || '');

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!targetUid) return;

    setSaving(true);
    setSaveMsg('');
    try {
      const updates = {
        uniformShirtSize: shirtSize,
        bootSize: bootSize,
        beltSize: beltSize,
        backpackCapacity: backpackCapacity,
        sleepingBagRating: sleepingBagRating,
        hasNeckerchief: hasNeckerchief,
        hasSash: hasSash,
        hasMessKit: hasMessKit,
        totinChip: totinChip,
        firemnChit: firemnChit,
        uniformInspected: uniformInspected,
        gearNotes: gearNotes.trim() || null,
        updatedGearAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', targetUid), updates, { merge: true });
      setSaveMsg('✓ Uniform sizes and outdoor gear profile saved successfully!');
      if (onSaveSuccess) onSaveSuccess(updates);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      console.error("Failed to save uniform and gear profile:", err);
      alert("Failed to save gear record: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border-2 border-sky-500/40 flex items-center justify-center text-sky-300 shrink-0 shadow-lg shadow-sky-950/40">
            <Shirt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                Uniform & Equipment Profile
              </span>
              {totinChip && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  🔪 Totin' Chip Certified
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Official Uniform & Outdoor Gear Readiness
            </h3>
            <p className="text-xs text-slate-400">
              Sizing for troop quartermaster logistics, inspection readiness, and outdoor certifications.
            </p>
          </div>
        </div>

        {userCanEdit && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-950/40 self-start sm:self-auto disabled:opacity-50"
          >
            <Save size={13} />
            <span>{saving ? 'Saving...' : 'Save Gear Record'}</span>
          </button>
        )}
      </div>

      {saveMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* ── GRID: SIZING & GEAR INSPECTION ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Uniform Sizing Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Shirt size={16} className="text-sky-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Official Uniform Sizing</h4>
            </div>
            <span className="text-[10px] font-bold text-sky-300 font-mono">Quartermaster Log</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Shirt Size:</label>
              <select
                value={shirtSize}
                onChange={(e) => setShirtSize(e.target.value)}
                disabled={!userCanEdit}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500 font-semibold"
              >
                <option value="Youth S">Youth Small (6-8)</option>
                <option value="Youth M">Youth Medium (10-12)</option>
                <option value="Youth L">Youth Large (14-16)</option>
                <option value="Youth XL">Youth XL (18-20)</option>
                <option value="Adult S">Adult Small</option>
                <option value="Adult M">Adult Medium</option>
                <option value="Adult L">Adult Large</option>
                <option value="Adult XL">Adult XL</option>
                <option value="Adult 2XL">Adult 2XL</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Hiking Boot Size:</label>
              <input
                type="text"
                value={bootSize}
                onChange={(e) => setBootSize(e.target.value)}
                disabled={!userCanEdit}
                placeholder="e.g. 8.5 US"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500 font-semibold font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Scout Belt Size:</label>
              <input
                type="text"
                value={beltSize}
                onChange={(e) => setBeltSize(e.target.value)}
                disabled={!userCanEdit}
                placeholder="e.g. Medium (32-34)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Backpack Capacity:</label>
              <input
                type="text"
                value={backpackCapacity}
                onChange={(e) => setBackpackCapacity(e.target.value)}
                disabled={!userCanEdit}
                placeholder="e.g. 50 Liters"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div className="col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Sleeping Bag Rating:</label>
              <input
                type="text"
                value={sleepingBagRating}
                onChange={(e) => setSleepingBagRating(e.target.value)}
                disabled={!userCanEdit}
                placeholder="e.g. 20°F (Winter rating)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 2. Safety & Inspection Checklists */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Safety Chips & Uniform Check</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-300">Certifications</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Totin Chip */}
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850 cursor-pointer hover:border-emerald-500/40 transition">
              <div className="flex items-center gap-2.5">
                <Scissors size={16} className={totinChip ? "text-emerald-400" : "text-slate-500"} />
                <div>
                  <span className="font-bold text-white block">Totin' Chip (Knife & Ax Safety)</span>
                  <span className="text-[10px] text-slate-400">Authorized to carry pocketknife at campouts</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={totinChip}
                onChange={(e) => setTotinChip(e.target.checked)}
                disabled={!userCanEdit}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            {/* Firem'n Chit */}
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850 cursor-pointer hover:border-amber-500/40 transition">
              <div className="flex items-center gap-2.5">
                <Flame size={16} className={firemnChit ? "text-amber-400" : "text-slate-500"} />
                <div>
                  <span className="font-bold text-white block">Firem'n Chit (Campfire & Stove Safety)</span>
                  <span className="text-[10px] text-slate-400">Authorized to build campfires and light stoves</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={firemnChit}
                onChange={(e) => setFiremnChit(e.target.checked)}
                disabled={!userCanEdit}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-600 focus:ring-amber-500"
              />
            </label>

            {/* Uniform Inspection */}
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850 cursor-pointer hover:border-sky-500/40 transition">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className={uniformInspected ? "text-sky-400" : "text-slate-500"} />
                <div>
                  <span className="font-bold text-white block">Class A Uniform Inspection Passed</span>
                  <span className="text-[10px] text-slate-400">Insignia, patrol patch, and neckerchief verified</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={uniformInspected}
                onChange={(e) => setUniformInspected(e.target.checked)}
                disabled={!userCanEdit}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-sky-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
