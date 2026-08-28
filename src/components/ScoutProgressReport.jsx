import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { Printer, ArrowLeft, Save } from 'lucide-react';

export default function ScoutProgressReport({ scout, currentUser, onBack, setChatScout, setCurrentTab }) {
  const [requirements, setRequirements] = useState([]);
  const [progress, setProgress] = useState({});
  const [leaderNote, setLeaderNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Load requirements
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'requirements'), (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by category then title for a consistent requirement number sequence
      docs.sort((a, b) =>
        (a.category || '').localeCompare(b.category || '') ||
        (a.title || '').localeCompare(b.title || '')
      );
      setRequirements(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load scout's individual progress (completedAt timestamps)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `users/${scout.uid}/progress`),
      (snap) => {
        const map = {};
        snap.docs.forEach((d) => {
          map[d.id] = d.data();
        });
        setProgress(map);
      }
    );
    return () => unsub();
  }, [scout.uid]);

  // Load private leader notes for this scout
  useEffect(() => {
    const noteRef = doc(db, 'leaderNotes', scout.uid);
    getDoc(noteRef).then((snap) => {
      if (snap.exists()) {
        const note = snap.data().note || '';
        setLeaderNote(note);
        setSavedNote(note);
      }
    });
  }, [scout.uid]);

  const handleSaveNote = async () => {
    try {
      await setDoc(doc(db, 'leaderNotes', scout.uid), {
        note: leaderNote,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid,
      });
      setSavedNote(leaderNote);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  // Derive stats
  const totalReqs = requirements.length;

  // A requirement is "completed" if the scout's UID is in completedBy (AdvancementTracker model)
  // OR if there's a progress doc for it (ProgressDashboard model).
  const completedReqs = requirements.filter(
    (r) => r.completedBy?.includes(scout.uid) || !!progress[r.id]
  );
  const completedCount = completedReqs.length;
  const progressPercent =
    totalReqs > 0 ? Math.round((completedCount / totalReqs) * 100) : 0;

  // Merit badges: requirements in a "Merit Badge" category
  const meritBadgesEarned = completedReqs.filter(
    (r) =>
      (r.category || '').toLowerCase().includes('merit') ||
      (r.category || '').toLowerCase().includes('badge')
  ).length;

  // Build requirement number labels like "1", "2", "2a", "2b" based on sorted list
  const reqNumberMap = {};
  let catIndex = {};
  requirements.forEach((r, idx) => {
    const cat = r.category || 'General';
    catIndex[cat] = (catIndex[cat] || 0) + 1;
    reqNumberMap[r.id] = catIndex[cat];
  });

  // Group requirements by category for the breakdown table
  const byCategory = requirements.reduce((acc, r) => {
    const cat = r.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Screen-only action bar */}
      <div className="print-hide flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Scout List
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setChatScout(scout);
              setCurrentTab('chat');
            }}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
          >
            Chat with Scout
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-emerald-900/30"
          >
            <Printer size={16} />
            Print Progress Report
          </button>
        </div>
      </div>

      {/* ── PRINT REPORT CONTAINER ── */}
      <div id="print-report" className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">

        {/* Report Header */}
        <div className="report-header border-b border-slate-600 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-white">{scout.fullName || scout.email}</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                <span className="font-semibold text-emerald-400">{scout.rank || 'Scout'}</span>
                {scout.patrol && (
                  <> &bull; <span>{scout.patrol} Patrol</span></>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide">Progress Report</p>
              <p className="text-sm text-white mt-1">{reportDate}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Leader: <span className="text-white">{currentUser.fullName || currentUser.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-emerald-400">{progressPercent}%</p>
              <p className="text-xs text-slate-400 mt-1">Rank Progress</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white">{completedCount}</p>
              <p className="text-xs text-slate-400 mt-1">
                of {totalReqs} Requirements
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-amber-400">{meritBadgesEarned}</p>
              <p className="text-xs text-slate-400 mt-1">Merit Badges Earned</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Requirement Breakdown Table */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">
            Requirement Breakdown
          </h2>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading requirements…</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(byCategory).map(([category, reqs]) => (
                <div key={category}>
                  <h3 className="text-xs font-bold uppercase text-slate-300 bg-slate-900/60 border border-slate-700 rounded-t-lg px-3 py-2">
                    {category}
                  </h3>
                  <table className="w-full text-sm border border-t-0 border-slate-700 rounded-b-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-900/40 text-left text-xs text-slate-400">
                        <th className="px-3 py-2 w-10">#</th>
                        <th className="px-3 py-2">Requirement</th>
                        <th className="px-3 py-2 w-28 text-center">Status</th>
                        <th className="px-3 py-2 w-36">Date Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reqs.map((req, i) => {
                        const isCompleted =
                          req.completedBy?.includes(scout.uid) || !!progress[req.id];
                        const progressData = progress[req.id];
                        const completedAt = progressData?.completedAt
                          ? new Date(progressData.completedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : null;

                        // Build req number label: category letter + index e.g. "K1", "F2"
                        const catLetter = (category.charAt(0) || 'R').toUpperCase();
                        const reqLabel = `${catLetter}${i + 1}`;

                        return (
                          <tr
                            key={req.id}
                            className={`border-t border-slate-700/50 ${
                              isCompleted ? 'bg-emerald-950/10' : 'bg-slate-800/30'
                            }`}
                          >
                            <td className="px-3 py-2 text-slate-400 font-mono text-xs">
                              {reqLabel}
                            </td>
                            <td className="px-3 py-2">
                              <p className={`font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                                {req.title}
                              </p>
                              {req.description && (
                                <p className="text-xs text-slate-500 mt-0.5">{req.description}</p>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {isCompleted ? (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                                  Complete
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 text-xs font-semibold border border-slate-600/30">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-400 text-xs">
                              {completedAt || (isCompleted ? '—' : '')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leader Notes Section */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">
            Leader Notes
            <span className="ml-2 text-[10px] font-normal normal-case text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">
              Private — visible to leaders only
            </span>
          </h2>
          <div className="border border-slate-600 rounded-xl overflow-hidden">
            {/* Editable area (screen only) */}
            <textarea
              value={leaderNote}
              onChange={(e) => setLeaderNote(e.target.value)}
              rows={5}
              placeholder="Add discussion points, observations, or goals for the parent conference…"
              className="print-hide w-full bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none resize-none"
            />

            {/* Static text for print */}
            <div className="print-only bg-slate-900/30 px-4 py-3 min-h-[6rem] text-sm text-slate-200 whitespace-pre-wrap">
              {savedNote || <span className="text-slate-500 italic">No notes recorded.</span>}
            </div>

            {/* Save button (screen only) */}
            <div className="print-hide flex items-center justify-between bg-slate-900/40 px-4 py-2 border-t border-slate-700/50">
              {noteSaved && (
                <span className="text-xs text-emerald-400 font-semibold">Notes saved!</span>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSaveNote}
                  disabled={leaderNote === savedNote}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition cursor-pointer"
                >
                  <Save size={12} />
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
