import React, { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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

function ScoutDetail({ scout, leaderId, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'requirements'));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, 'scout_notes', scout.uid);
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const leaderNote = data[leaderId] || '';
          setNotes(leaderNote);
          setSavedNotes(leaderNote);
        }
      } catch (err) {
        console.error('Failed to load notes:', err);
      } finally {
        setNotesLoading(false);
      }
    };
    load();
  }, [scout.uid, leaderId]);

  const saveNotes = async () => {
    setSaving(true);
    try {
      const ref = doc(db, 'scout_notes', scout.uid);
      await setDoc(ref, { [leaderId]: notes, updatedAt: serverTimestamp() }, { merge: true });
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

  const completedCount = tasks.filter((t) => t.completedBy?.includes(scout.uid)).length;
  const total = tasks.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const byCategory = tasks.reduce((acc, t) => {
    const cat = t.category || 'Core';
    if (!acc[cat]) acc[cat] = { total: 0, done: 0 };
    acc[cat].total++;
    if (t.completedBy?.includes(scout.uid)) acc[cat].done++;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition cursor-pointer"
      >
        ← Back to Roster
      </button>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-bold text-lg text-white">{scout.fullName || scout.username}</h3>
            <p className="text-xs text-slate-400">
              @{scout.username}
              {scout.rank ? ` · ${scout.rank}` : ''}
            </p>
          </div>
          <span className="text-emerald-400 font-bold text-xl">{percent}%</span>
        </div>

        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden mb-4 mt-3">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">
          Completed {completedCount} of {total} requirements
        </p>
      </div>

      {/* Rank breakdown by category */}
      {Object.keys(byCategory).length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <h4 className="font-semibold text-white text-sm mb-2">Rank Completion Breakdown</h4>
          {Object.entries(byCategory).map(([cat, { total: t, done }]) => {
            const pct = t > 0 ? Math.round((done / t) * 100) : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{cat}</span>
                  <span className="text-slate-400">
                    {done}/{t} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leader private notes */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h4 className="font-semibold text-white text-sm mb-1">Leader Private Notes</h4>
        <p className="text-xs text-slate-500 mb-3">Visible only to you. Never shown to the scout.</p>

        {notesLoading ? (
          <p className="text-xs text-slate-400">Loading notes…</p>
        ) : (
          <>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record observations, goals, or concerns here…"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              {saveMsg && (
                <span className="text-xs text-emerald-400 font-semibold">{saveMsg}</span>
              )}
              <button
                onClick={saveNotes}
                disabled={saving || notes === savedNotes}
                className="ml-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition cursor-pointer"
              >
                {saving ? 'Saving…' : 'Save Notes'}
              </button>
            </div>
          </>
        )}
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
  const [newRank, setNewRank] = useState('');
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
      // Use a secondary Firebase app instance so creating a new user doesn't
      // displace the currently signed-in leader from the primary auth context.
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
        meritBadges: [],
        createdAt: serverTimestamp(),
      });

      setAddMsg(`Scout added! Username: ${username} · Temporary password: ${password}`);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setNewRank('');
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
        leaderId={currentUser.uid}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
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
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h4 className="font-semibold text-white text-sm mb-3">New Scout</h4>
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
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Rank (optional)</label>
              <input
                type="text"
                value={newRank}
                onChange={(e) => setNewRank(e.target.value)}
                placeholder="e.g. Scout, Tenderfoot"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
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
            <div key={scout.uid} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left cursor-pointer hover:bg-slate-700/50 transition"
                onClick={() => setExpanded((v) => (v === scout.uid ? null : scout.uid))}
              >
                <div>
                  <p className="font-semibold text-white text-sm">{scout.fullName || scout.username}</p>
                  <p className="text-xs text-slate-400">@{scout.username}{scout.rank ? ` · ${scout.rank}` : ''}</p>
                </div>
                <span className="text-slate-400 text-lg">{expanded === scout.uid ? '▲' : '▼'}</span>
              </button>

              {expanded === scout.uid && (
                <div className="px-5 pb-4 border-t border-slate-700/60 pt-3 space-y-2">
                  {scout.meritBadges?.length > 0 && (
                    <p className="text-xs text-slate-400">
                      Merit badges: {scout.meritBadges.join(', ')}
                    </p>
                  )}
                  <button
                    onClick={() => setSelected(scout)}
                    className="mt-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    View Advancement & Notes →
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
