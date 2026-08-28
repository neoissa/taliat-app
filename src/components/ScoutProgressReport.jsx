import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { Printer, ArrowLeft, Save, Award, Star, BookOpen } from 'lucide-react';

export default function ScoutProgressReport({ scout, currentUser, onBack }) {
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [leaderNote, setLeaderNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Normalize selected rank ID (lowercase, with underscores)
  const initialRankId = (scout.rank || 'Scout').toLowerCase().replace(' ', '_');
  const [selectedRankId, setSelectedRankId] = useState(initialRankId);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 1. Fetch Ranks & Merit Badges progress in real-time
  useEffect(() => {
    const ranksRef = collection(db, 'user_progress', scout.uid, 'ranks');
    const unsubRanks = onSnapshot(ranksRef, (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });

    const meritRef = collection(db, 'user_progress', scout.uid, 'merit_badges');
    const unsubMerit = onSnapshot(meritRef, (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
    });

    return () => {
      unsubRanks();
      unsubMerit();
    };
  }, [scout.uid]);

  // 2. Fetch leader notes from /scout_notes/{scoutId}
  useEffect(() => {
    const loadNotes = async () => {
      const noteRef = doc(db, 'scout_notes', scout.uid);
      try {
        const snap = await getDoc(noteRef);
        if (snap.exists()) {
          const data = snap.data();
          setLeaderNote(data.note || '');
          setSavedNote(data.note || '');
        }
      } catch (err) {
        console.error('Failed to load leader notes:', err);
      } finally {
        setNotesLoading(false);
      }
    };
    loadNotes();
  }, [scout.uid]);

  const handleSaveNote = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const noteRef = doc(db, 'scout_notes', scout.uid);
      await setDoc(noteRef, {
        note: leaderNote,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
      }, { merge: true });
      setSavedNote(leaderNote);
      setSaveMsg('Notes saved.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      console.error('Failed to save leader note:', err);
      setSaveMsg('Error saving notes.');
    } finally {
      setSaving(false);
    }
  };

  // Derive metrics
  const completedRanksCount = RANKS_DATA.filter(rank => {
    const rp = ranksProgress[rank.id] || { completedRequirements: {} };
    const completedReqs = rp.completedRequirements || {};
    const total = rank.categories.reduce((sum, c) => sum + c.requirements.length, 0);
    const done = rank.categories.reduce((sum, c) => sum + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0);
    return total > 0 && done === total;
  }).length;

  const activeRankData = RANKS_DATA.find(r => r.id === selectedRankId) || RANKS_DATA[0];
  const activeProg = ranksProgress[activeRankData.id] || { completedRequirements: {} };
  const completedReqs = activeProg.completedRequirements || {};
  const activeTotal = activeRankData.categories.reduce((sum, c) => sum + c.requirements.length, 0);
  const activeDone = activeRankData.categories.reduce((sum, c) => sum + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0);
  const activePercent = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  // Merit Badge Stats
  const badgesEarned = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    return b.requirements.filter(r => p.steps?.[r.id]).length === b.requirements.length;
  });
  const eagleBadgesEarned = badgesEarned.filter(b => b.eagleRequired).length;

  return (
    <div className="space-y-6">
      {/* Action Bar (Screen Only) */}
      <div className="print-hide flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Scout List
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-emerald-900/30"
        >
          <Printer size={16} />
          Print Progress Report
        </button>
      </div>

      {/* Screen Options Panel (Screen Only) */}
      <div className="print-hide bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Select Rank for Checklist</h2>
          <p className="text-xs text-slate-400">Choose which rank checklist to view/print below</p>
        </div>
        <select
          value={selectedRankId}
          onChange={(e) => setSelectedRankId(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {RANKS_DATA.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* ── PROGRESS REPORT CONTAINER ── */}
      <div id="print-report" className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl">

        {/* Report Header */}
        <div className="report-header border-b border-slate-600 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-white">{scout.fullName || scout.username}</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Patrol: <span className="font-semibold text-emerald-400">{scout.patrolId || 'Taliʿa'} Patrol</span> &bull; 
                Active Rank: <span className="font-semibold text-white">{scout.rank || 'Scout'}</span>
              </p>
            </div>
            <div className="text-right font-sans">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Progress Report Summary</p>
              <p className="text-sm text-white mt-1">{reportDate}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Leader: <span className="text-white">{currentUser.fullName || currentUser.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Overall Progress</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-emerald-400">{activePercent}%</p>
              <p className="text-xs text-slate-400 mt-1">{activeRankData.name} Progress</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white">{completedRanksCount} / 7</p>
              <p className="text-xs text-slate-400 mt-1">Ranks Completed</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-amber-400">{badgesEarned.length}</p>
              <p className="text-xs text-slate-400 mt-1">{eagleBadgesEarned} / {TOTAL_EAGLE_REQUIRED_FOR_RANK} Eagle Badges</p>
            </div>
          </div>

          {/* Active Rank Progress Bar (Screen Only) */}
          <div className="mt-4 w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700 print-hide">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${activePercent}%` }}
            />
          </div>
        </div>

        {/* Requirement Checklist */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Checklist: {activeRankData.name} Requirements
          </h2>
          <table className="w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-900/60 text-left text-xs text-slate-400 border-b border-slate-700">
                <th className="px-3 py-2 w-12 border-r border-slate-700">No.</th>
                <th className="px-3 py-2 border-r border-slate-700">Requirement Detail</th>
                <th className="px-3 py-2 w-28 text-center border-r border-slate-700">Status</th>
                <th className="px-3 py-2 w-32">Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {activeRankData.categories.map((category) => 
                category.requirements.map((req) => {
                  const isDone = !!completedReqs[req.id]?.completed;
                  const completionDate = completedReqs[req.id]?.completedAt || '';
                  return (
                    <tr key={req.id} className={`border-t border-slate-700/50 ${isDone ? 'bg-emerald-950/10' : 'bg-slate-800/20'}`}>
                      <td className="px-3 py-2 border-r border-slate-700 font-mono font-bold text-slate-400 text-xs">
                        {req.number}
                      </td>
                      <td className="px-3 py-2 border-r border-slate-700">
                        <span className={isDone ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {req.text}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center border-r border-slate-700">
                        <span className={isDone ? 'print-report-complete text-emerald-400 font-semibold text-xs' : 'print-report-pending text-slate-500 text-xs'}>
                          {isDone ? 'TESTED' : 'NOT TESTED'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-400 text-xs font-mono">
                        {completionDate || (isDone ? '—' : '')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Private Leader notes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Leader Discussion Notes
              <span className="print-hide ml-2 text-[9px] font-normal normal-case text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                Private — visible to leaders only
              </span>
            </h2>
            {saveMsg && <span className="text-xs text-emerald-400 font-semibold print-hide">{saveMsg}</span>}
          </div>

          <div className="border border-slate-600 rounded-xl overflow-hidden">
            {/* Screen textarea editor */}
            {notesLoading ? (
              <div className="p-4 text-xs text-slate-500">Loading notes...</div>
            ) : (
              <textarea
                value={leaderNote}
                onChange={(e) => setLeaderNote(e.target.value)}
                rows={4}
                placeholder="Write observations, goals, or concerns for parent-leader conference discussion..."
                className="print-hide w-full bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none resize-none"
              />
            )}

            {/* Static notes visible on print */}
            <div className="print-only bg-slate-900/10 px-4 py-3 min-h-[5rem] text-xs text-black whitespace-pre-wrap">
              {savedNote || <span className="text-slate-400 italic">No notes recorded.</span>}
            </div>

            {/* Save bar */}
            <div className="print-hide flex items-center justify-end bg-slate-900/40 px-4 py-2 border-t border-slate-700/50">
              <button
                onClick={handleSaveNote}
                disabled={saving || leaderNote === savedNote}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition cursor-pointer flex items-center gap-1.5"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
