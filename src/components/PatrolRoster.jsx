import React, { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import AdvancementTracker from './AdvancementTracker';
import MeritBadgeDashboard from './MeritBadgeDashboard';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { RANKS, RANKS_SCHEMA } from '../data/ranksSchema';
import { Printer, ArrowLeft, Save, Award, Star, BookOpen, ShieldAlert } from 'lucide-react';

function ScoutDetail({ scout, currentUser, onBack }) {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [detailTab, setDetailTab] = useState('advancement'); // 'advancement' | 'merit-badges'

  // Loading rank and merit badge counts for the KPI summary
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});

  // 1. Fetch private leader notes from /scout_notes/{scoutId}
  useEffect(() => {
    const loadNotes = async () => {
      const ref = doc(db, 'scout_notes', scout.uid);
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNotes(data.note || '');
          setSavedNotes(data.note || '');
        }
      } catch (err) {
        console.error('Failed to load notes:', err);
      } finally {
        setNotesLoading(false);
      }
    };
    loadNotes();
  }, [scout.uid]);

  // 2. Fetch progress data for summary KPIs and printing
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

  const saveNotes = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const ref = doc(db, 'scout_notes', scout.uid);
      await setDoc(ref, {
        note: notes,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      }, { merge: true });
      setSavedNotes(notes);
      setSaveMsg('Notes saved.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      console.error('Failed to save notes:', err);
      setSaveMsg('Error saving notes.');
    } finally {
      setSaving(false);
    }
  };

  // Derive summary metrics for scout
  const completedRanksCount = RANKS.filter(rank => {
    const rp = ranksProgress[rank] || { completed: {} };
    const schema = RANKS_SCHEMA[rank];
    const total = schema.categories.reduce((sum, c) => sum + c.requirements.length, 0);
    const done = schema.categories.reduce((sum, c) => sum + c.requirements.filter(r => rp.completed?.[r.id]).length, 0);
    return total > 0 && done === total;
  }).length;

  const activeRank = scout.rank || 'Scout';
  const activeSchema = RANKS_SCHEMA[activeRank] || RANKS_SCHEMA.Scout;
  const activeProg = ranksProgress[activeRank] || { completed: {} };
  const activeTotal = activeSchema.categories.reduce((sum, c) => sum + c.requirements.length, 0);
  const activeDone = activeSchema.categories.reduce((sum, c) => sum + c.requirements.filter(r => activeProg.completed?.[r.id]).length, 0);
  const activePercent = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  // Merit Badge Stats
  const badgesEarned = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    return b.requirements.filter(r => p.steps?.[r.id]).length === b.requirements.length;
  });
  const eagleBadgesEarned = badgesEarned.filter(b => b.eagleRequired).length;

  // Print Report Date
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Action Bar (Screen Only) */}
      <div className="flex justify-between items-center print-hide">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Roster
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-900/30"
        >
          <Printer size={14} />
          Print Progress Report
        </button>
      </div>

      {/* Roster detail view dashboard (Screen Only) */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl print-hide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl text-white">{scout.fullName || scout.username}</h3>
            <p className="text-xs text-slate-400 mt-1">
              @{scout.username} &bull; <span className="text-emerald-400 font-bold">{activeRank}</span> &bull; {scout.patrolId || 'Taliʿa'} Patrol
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-white block">{completedRanksCount} / 7</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ranks Earned</span>
            </div>
            <div className="text-center px-4 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-white block">{activePercent}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Progress</span>
            </div>
            <div className="text-center px-4 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-white block">{eagleBadgesEarned} / {TOTAL_EAGLE_REQUIRED_FOR_RANK}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Eagle Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Private Notes Section (Screen Only) */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl print-hide">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="font-bold text-white text-sm">Private Leader Notes</h4>
            <p className="text-xs text-slate-400">Notes stored in database. Never visible to the scout.</p>
          </div>
          {saveMsg && (
            <span className="text-xs text-emerald-400 font-semibold">{saveMsg}</span>
          )}
        </div>

        {notesLoading ? (
          <div className="text-xs text-slate-400">Loading notes…</div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter private evaluation notes, parent meeting notes, or milestones..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={saveNotes}
                disabled={saving || notes === savedNotes}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Save size={12} />
                {saving ? 'Saving...' : 'Save Private Notes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs to switch between Ranks and Merit Badges (Screen Only) */}
      <div className="flex gap-2 border-b border-slate-700/60 pb-1 print-hide">
        <button
          onClick={() => setDetailTab('advancement')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
            detailTab === 'advancement'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Advancement Requirements
        </button>
        <button
          onClick={() => setDetailTab('merit-badges')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
            detailTab === 'merit-badges'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Merit Badges Tracker
        </button>
      </div>

      {/* Render selected tracker (Screen Only) */}
      <div className="print-hide">
        {detailTab === 'advancement' ? (
          <AdvancementTracker currentUser={currentUser} scoutId={scout.uid} />
        ) : (
          <MeritBadgeDashboard currentUser={currentUser} scoutId={scout.uid} />
        )}
      </div>

      {/* ── PRINT-ONLY PROGRESS REPORT CONTAINER (Hidden on Screen) ── */}
      <div id="print-report" className="print-only space-y-6">
        <div className="report-header border-b-2 border-black pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-black">{scout.fullName || scout.username}</h1>
              <p className="text-sm text-slate-600 mt-1">
                Patrol: <span className="font-semibold text-black">{scout.patrolId || 'Taliʿa'}</span> &bull; 
                Active Rank: <span className="font-semibold text-black">{activeRank}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Conference Progress Report</p>
              <p className="text-sm text-black mt-1">{reportDate}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Leader: <span className="text-black">{currentUser.fullName || currentUser.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Print Summary cards */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Advancement Summary</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{activePercent}%</p>
              <p className="text-[10px] text-slate-500">Active Rank Progress ({activeRank})</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{completedRanksCount} / 7</p>
              <p className="text-[10px] text-slate-500">Ranks Fully Earned</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{badgesEarned.length}</p>
              <p className="text-[10px] text-slate-500">Merit Badges ({eagleBadgesEarned} Eagle-Req)</p>
            </div>
          </div>
        </div>

        {/* Detailed Requirement Checklist */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Remaining vs. Completed Requirements ({activeRank})
          </h2>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-black">
                <th className="p-2 border border-slate-300 w-12">No.</th>
                <th className="p-2 border border-slate-300">Requirement details</th>
                <th className="p-2 border border-slate-300 w-24 text-center">Status</th>
                <th className="p-2 border border-slate-300 w-28">Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {activeSchema.categories.map((category) => 
                category.requirements.map((req) => {
                  const isDone = !!activeProg.completed?.[req.id];
                  const completionDate = activeProg.dates?.[req.id] || '';
                  return (
                    <tr key={req.id} className="border-t border-slate-300">
                      <td className="p-2 border border-slate-300 font-mono font-bold text-slate-600">{req.number}</td>
                      <td className="p-2 border border-slate-300">
                        <span className={isDone ? 'line-through text-slate-400' : 'text-black font-medium'}>
                          {req.description}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span className={isDone ? 'print-report-complete' : 'print-report-pending'}>
                          {isDone ? 'COMPLETED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-600">{completionDate || (isDone ? '—' : '')}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Leader Discussion Notes */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Leader Discussion Notes</h2>
          <div className="leader-notes-box p-3 border border-black min-h-[100px] text-xs text-black whitespace-pre-wrap">
            {savedNotes || <span className="text-slate-400 italic">No notes recorded.</span>}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function PatrolRoster({ currentUser }) {
  const [scouts, setScouts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selected, setSelected] = useState(null);

  // Add scout form state
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRank, setNewRank] = useState('Scout');
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('leaderId', '==', currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setScouts(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser.uid]);

  const handleAddScout = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddMsg('');
    const username = newUsername.trim().toLowerCase();
    const password = newPassword;
    if (!newName.trim() || !username || !password) return;
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      setAddError('Username must be 3–30 characters and use only letters, numbers, dots, underscores, or hyphens.');
      return;
    }
    if (password.length < 6) {
      setAddError('Temporary password must be at least 6 characters.');
      return;
    }
    setAdding(true);

    const email = `${username}@talia.app`;

    try {
      let secondaryApp;
      try {
        secondaryApp = getApp('secondary');
      } catch {
        secondaryApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secondaryAuth = getAuth(secondaryApp);
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUid = cred.user.uid;
      await secondaryAuth.signOut();

      await setDoc(doc(db, 'users', newUid), {
        fullName: newName.trim(),
        username,
        email,
        role: 'scout',
        leaderId: currentUser.uid,
        patrolId: currentUser.patrolId || currentUser.uid,
        rank: newRank.trim(),
        createdAt: serverTimestamp(),
      });

      setAddMsg(`Scout added! Username: ${username} · Temporary password: ${password}`);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setNewRank('Scout');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setAddError(`Error: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  if (selected) {
    return (
      <ScoutDetail
        scout={selected}
        currentUser={currentUser}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6 print-hide">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-white">Patrol Roster</h3>
          <p className="text-xs text-slate-400">{scouts.length} scout{scouts.length !== 1 ? 's' : ''} assigned to you</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setAddMsg(''); setAddError(''); }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ Add Scout'}
        </button>
      </div>

      {addMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold">
          {addMsg}
        </div>
      )}

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl">
          <h4 className="font-semibold text-white text-sm mb-3">Create Scout Account</h4>
          {addError && (
            <div className="p-3 mb-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl">
              {addError}
            </div>
          )}
          <form onSubmit={handleAddScout} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ahmad Al-Rashid"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Username</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. ahmad.scout"
                pattern="[a-zA-Z0-9._-]{3,30}"
                title="3–30 letters, numbers, dots, underscores, or hyphens"
                autoCapitalize="none"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Temporary Password</label>
              <input
                type="text"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Initial Rank</label>
              <select
                value={newRank}
                onChange={(e) => setNewRank(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {RANKS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm"
            >
              {adding ? 'Creating account…' : 'Create Scout Account'}
            </button>
          </form>
        </div>
      )}

      {/* Scout list */}
      <div className="space-y-2">
        {scouts.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
            No scouts assigned yet. Add your first scout above.
          </div>
        ) : (
          scouts.map((scout) => (
            <div key={scout.uid} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow">
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left cursor-pointer hover:bg-slate-700/50 transition"
                onClick={() => setExpanded((v) => (v === scout.uid ? null : scout.uid))}
              >
                <div>
                  <p className="font-semibold text-white text-sm">{scout.fullName || scout.username}</p>
                  <p className="text-xs text-slate-400">@{scout.username} &bull; <span className="text-emerald-400 font-semibold">{scout.rank || 'Scout'}</span></p>
                </div>
                <span className="text-slate-400 text-lg">{expanded === scout.uid ? '▲' : '▼'}</span>
              </button>

              {expanded === scout.uid && (
                <div className="px-5 pb-4 border-t border-slate-700/60 pt-3 space-y-2">
                  <button
                    onClick={() => setSelected(scout)}
                    className="mt-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Open Granular Portal & Notes &rarr;
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
