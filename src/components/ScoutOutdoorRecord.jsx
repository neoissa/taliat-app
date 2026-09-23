import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  Tent, 
  Compass, 
  Clock, 
  MapPin, 
  Plus, 
  Award, 
  CheckCircle2, 
  Trees, 
  Flame, 
  Calendar, 
  Edit3, 
  Save, 
  Sparkles,
  ChevronRight,
  Footprints
} from 'lucide-react';

export default function ScoutOutdoorRecord({ 
  scout = {}, 
  currentUser = {}, 
  attendanceStats = {}, 
  canEdit = false, 
  onSaveSuccess 
}) {
  const profile = { ...currentUser, ...scout };
  const targetUid = profile.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin';
  const userCanEdit = canEdit || isOwner || isLeader || (currentUser?.uid === targetUid);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  // Stats from attendance + manual records
  const initialNights = Number(profile.manualCampingNights || 0) + Number(attendanceStats?.campingNights || 0);
  const initialMiles = Number(profile.manualHikingMiles || 0);
  const totalServiceHours = Number(attendanceStats?.serviceHours || profile.serviceHours || 0);

  const [totalNights, setTotalNights] = useState(initialNights);
  const [totalMiles, setTotalMiles] = useState(initialMiles);
  const [outdoorLogs, setOutdoorLogs] = useState(
    Array.isArray(profile.outdoorLogs) ? profile.outdoorLogs : [
      { id: 1, title: 'Fall Patrol Campout & Wilderness Survival', date: '2025-10-18', nights: 2, miles: 5.5, location: 'Camp Agawam' },
      { id: 2, title: 'Spring Orienteering Hike', date: '2026-04-12', nights: 0, miles: 8.0, location: 'Harriman State Park' },
      { id: 3, title: 'Winter Halqa & Snow Camp', date: '2026-01-24', nights: 2, miles: 3.0, location: 'Camp Alpine' }
    ]
  );

  // New Log Entry States
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNights, setNewNights] = useState(1);
  const [newMiles, setNewMiles] = useState(3.0);
  const [newLocation, setNewLocation] = useState('');

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newLog = {
      id: Date.now(),
      title: newTitle.trim(),
      date: newDate,
      nights: Number(newNights) || 0,
      miles: Number(newMiles) || 0,
      location: newLocation.trim() || 'Outdoor Site'
    };

    const updatedLogs = [newLog, ...outdoorLogs];
    const updatedNights = totalNights + (Number(newNights) || 0);
    const updatedMiles = totalMiles + (Number(newMiles) || 0);

    setOutdoorLogs(updatedLogs);
    setTotalNights(updatedNights);
    setTotalMiles(updatedMiles);

    if (targetUid) {
      setSaving(true);
      try {
        const userRef = doc(db, 'users', targetUid);
        await setDoc(userRef, {
          outdoorLogs: updatedLogs,
          manualCampingNights: updatedNights - Number(attendanceStats?.campingNights || 0),
          manualHikingMiles: updatedMiles,
          updatedOutdoorAt: new Date().toISOString()
        }, { merge: true });

        setSaveMsg('✓ Campout / Hike logged successfully!');
        setShowLogModal(false);
        setNewTitle('');
        setNewLocation('');
        setTimeout(() => setSaveMsg(''), 3500);
      } catch (err) {
        console.error("Failed to save outdoor log:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── HEADER & SUMMARY ── */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 shadow-lg shadow-teal-950/40">
            <Tent size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                Outdoor & Camping Journey
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                {totalNights} Nights Under Stars
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Camping Nights, Hiking Miles & Outdoor Awards
            </h3>
            <p className="text-xs text-slate-400">
              Cumulative outdoor record for Camping Merit Badge (20 nights), Order of the Arrow, and 50-Miler Trek.
            </p>
          </div>
        </div>

        {userCanEdit && (
          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-950/40 self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ Log Campout / Hike</span>
          </button>
        )}
      </div>

      {saveMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* ── 3 METRIC TILES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* 1. Nights Camped */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Camping Nights</span>
            <Tent size={16} className="text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl sm:text-3xl font-black text-white font-mono">{totalNights}</strong>
            <span className="text-xs text-slate-400 font-bold">/ 20 Goal</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-teal-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.round((totalNights / 20) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5">
            {totalNights >= 20 ? '✓ Camping Merit Badge Requirement Met!' : `${Math.max(0, 20 - totalNights)} nights needed for Camping MB`}
          </span>
        </div>

        {/* 2. Hiking Miles */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Trail Miles Hiked</span>
            <Footprints size={16} className="text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl sm:text-3xl font-black text-white font-mono">{totalMiles.toFixed(1)}</strong>
            <span className="text-xs text-slate-400 font-bold">Miles</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-sky-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.round((totalMiles / 50) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5">
            {totalMiles >= 50 ? '✓ 50-Miler Trek Award Milestone Met!' : `${(50 - totalMiles).toFixed(1)} miles toward 50-Miler Trek Award`}
          </span>
        </div>

        {/* 3. Service Hours */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Service & Conservation</span>
            <Trees size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl sm:text-3xl font-black text-white font-mono">{totalServiceHours}</strong>
            <span className="text-xs text-slate-400 font-bold">Hours</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.round((totalServiceHours / 18) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5">
            Community service and conservation projects
          </span>
        </div>
      </div>

      {/* ── OUTDOOR TRIPS LOG LIST ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass size={17} className="text-teal-400" />
            <h4 className="text-sm font-black text-white">Recorded Troop Expeditions & Hikes</h4>
          </div>
          <span className="text-xs text-slate-400 font-bold">{outdoorLogs.length} Events Logged</span>
        </div>

        <div className="space-y-2.5">
          {outdoorLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-950/80 border border-slate-850 hover:border-teal-500/40 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    {log.date}
                  </span>
                  {log.nights > 0 && (
                    <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-md">
                      🏕️ {log.nights} Night{log.nights === 1 ? '' : 's'}
                    </span>
                  )}
                  {log.miles > 0 && (
                    <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-md">
                      🥾 {log.miles} Miles
                    </span>
                  )}
                </div>
                <h5 className="font-extrabold text-xs sm:text-sm text-white truncate">{log.title}</h5>
                {log.location && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin size={11} className="text-slate-500" />
                    <span>{log.location}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: LOG NEW CAMPOUT / HIKE ── */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Tent size={16} className="text-teal-400" />
              <span>Log Campout or Hiking Trek</span>
            </h4>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Event / Trip Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Summer Campout at Camp No-Be-Bos-Sco"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Date:</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Location / Site:</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Camp Agawam, NJ"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Nights Camped:</label>
                  <input
                    type="number"
                    min="0"
                    max="14"
                    value={newNights}
                    onChange={(e) => setNewNights(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Hiking Miles:</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={newMiles}
                    onChange={(e) => setNewMiles(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-lg shadow-teal-950/40 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Add to Outdoor Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
