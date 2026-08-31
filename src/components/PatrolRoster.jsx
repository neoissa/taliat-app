import React, { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
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
import VideoResources from './VideoResources';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { RANKS_DATA } from '../data/ranksData';
import { Printer, ArrowLeft, Save, Award, Star, BookOpen, ShieldAlert, Plus, Trash2 } from 'lucide-react';

function ScoutDetail({ scout, currentUser, onBack }) {
  const [notesList, setNotesList] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [adminResetPassword, setAdminResetPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [detailTab, setDetailTab] = useState('advancement'); // 'advancement' | 'merit-badges' | 'video-resources'

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
          if (Array.isArray(data.notes)) {
            setNotesList(data.notes);
          } else if (data.note) {
            // Migrate legacy note
            const legacyNote = {
              id: 'legacy',
              text: data.note,
              date: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              authorName: 'Leader',
              authorPosition: 'Leader',
              createdAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toISOString() : new Date().toISOString()
            };
            setNotesList([legacyNote]);
          } else {
            setNotesList([]);
          }
        } else {
          setNotesList([]);
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

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const ref = doc(db, 'scout_notes', scout.uid);
      const newNote = {
        id: Date.now().toString(),
        text: newNoteText.trim(),
        date: newNoteDate || new Date().toISOString().split('T')[0],
        authorId: currentUser.uid,
        authorName: currentUser.fullName || currentUser.username || currentUser.email,
        authorPosition: currentUser.leaderPosition || currentUser.role || 'Leader',
        createdAt: new Date().toISOString()
      };
      const updatedNotes = [...notesList, newNote];
      await setDoc(ref, {
        notes: updatedNotes,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      }, { merge: true });
      setNotesList(updatedNotes);
      setNewNoteText('');
      setSaveMsg('Note added.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      console.error('Failed to add note:', err);
      setSaveMsg('Error adding note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setSaving(true);
    try {
      const ref = doc(db, 'scout_notes', scout.uid);
      const updatedNotes = notesList.filter(n => n.id !== noteId);
      await setDoc(ref, {
        notes: updatedNotes,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      }, { merge: true });
      setNotesList(updatedNotes);
      setSaveMsg('Note deleted.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      console.error('Failed to delete note:', err);
      setSaveMsg('Error deleting note.');
    } finally {
      setSaving(false);
    }
  };

  const handleAdminResetPassword = async () => {
    if (!adminResetPassword.trim()) return;
    if (adminResetPassword.trim().length < 6) {
      setResetPasswordError("Password must be at least 6 characters.");
      return;
    }
    setResettingPassword(true);
    setResetPasswordError('');
    setResetPasswordSuccess('');
    
    try {
      const secretsRef = doc(db, 'users', scout.uid, 'private', 'secrets');
      const secretsSnap = await getDoc(secretsRef);
      
      let currentPassword = '';
      if (secretsSnap.exists()) {
        currentPassword = secretsSnap.data().password;
      } else {
        currentPassword = scout.username;
      }
      
      if (!currentPassword) {
        throw new Error("Could not retrieve current password for reset.");
      }
      
      const userEmail = scout.email || `${scout.username}@talia.app`;
      
      let secApp;
      try {
        secApp = getApp('secondary');
      } catch {
        secApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secAuth = getAuth(secApp);
      const userCred = await signInWithEmailAndPassword(secAuth, userEmail, currentPassword);
      await updatePassword(userCred.user, adminResetPassword.trim());
      await secAuth.signOut();
      
      await setDoc(secretsRef, { password: adminResetPassword.trim() }, { merge: true });
      setResetPasswordSuccess("Password updated successfully!");
      setAdminResetPassword('');
    } catch (err) {
      console.error(err);
      setResetPasswordError("Failed to reset password: " + err.message);
    } finally {
      setResettingPassword(false);
    }
  };

  // Derive summary metrics for scout
  const completedRanksCount = RANKS_DATA.filter(rank => {
    const rp = ranksProgress[rank.id] || { completedRequirements: {} };
    const completedReqs = rp.completedRequirements || {};
    const total = rank.categories.reduce((sum, c) => sum + c.requirements.length, 0);
    const done = rank.categories.reduce((sum, c) => sum + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0);
    return total > 0 && done === total;
  }).length;

  const activeRank = scout.rank || 'Scout';
  const activeRankId = activeRank.toLowerCase().replace(' ', '_');
  const activeRankData = RANKS_DATA.find(r => r.id === activeRankId || r.name.toLowerCase() === activeRank.toLowerCase()) || RANKS_DATA[0];
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
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl print-hide space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            {scout.photoURL ? (
              <img src={scout.photoURL} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/50" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-slate-200 text-lg uppercase">
                {(scout.fullName || scout.username).charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-xl text-white">{scout.fullName || scout.username}</h3>
              <p className="text-xs text-slate-400 mt-1">
                @{scout.username} &bull; <span className="text-emerald-400 font-bold">{activeRank}</span> &bull; {scout.patrolId || 'Taliʿa'} Patrol
              </p>
            </div>
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

        {/* BSA & Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">BSA Member ID</span>
            <span className="font-semibold text-slate-200 text-sm">{scout.bsaId || '—'}</span>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">Scout Email</span>
            <span className="font-semibold text-slate-200 text-sm">{scout.scoutEmail || '—'}</span>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">Scout Phone</span>
            <span className="font-semibold text-slate-200 text-sm">{scout.scoutPhone || '—'}</span>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">Parent Email</span>
            <span className="font-semibold text-slate-200 text-sm">{scout.parentEmail || '—'}</span>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">Parent Phone</span>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="font-semibold text-slate-200 text-sm">{scout.parentPhone || '—'}</span>
              {scout.parentPhone && (
                <a
                  href={`https://wa.me/${scout.parentPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg p-1 transition cursor-pointer flex items-center justify-center"
                  title="Chat with parent on WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Administrative Password Reset (Owners Only) */}
        {(currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com') && (
          <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 mt-4 print-hide">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Administrative Controls</h4>
            <p className="text-[11px] text-slate-400 mt-1">Set a new password for this scout.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="password"
                value={adminResetPassword}
                onChange={(e) => setAdminResetPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                autoComplete="new-password"
              />
              <button
                onClick={handleAdminResetPassword}
                disabled={resettingPassword || !adminResetPassword.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition cursor-pointer shrink-0"
              >
                {resettingPassword ? 'Updating...' : 'Set Password'}
              </button>
            </div>
            {resetPasswordSuccess && (
              <p className="text-xs text-emerald-400 font-semibold mt-2">{resetPasswordSuccess}</p>
            )}
            {resetPasswordError && (
              <p className="text-xs text-red-400 font-semibold mt-2">{resetPasswordError}</p>
            )}
          </div>
        )}
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
          <div className="space-y-4">
            {/* List of notes */}
            {notesList.length > 0 ? (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {notesList.map((note) => {
                  const canDelete = currentUser.uid === note.authorId || currentUser.role === 'owner';
                  return (
                    <div key={note.id} className="bg-slate-900/60 border border-slate-750 p-3 rounded-xl text-xs space-y-1 relative group">
                      <div className="flex justify-between items-center text-slate-400 font-semibold border-b border-slate-800/40 pb-1 mb-1">
                        <span>{note.authorName} ({note.authorPosition})</span>
                        <div className="flex items-center gap-2">
                          <span>{note.date}</span>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-400 hover:text-red-300 transition cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-450 italic bg-slate-900/30 border border-slate-800 p-3 rounded-xl text-center">
                No private evaluation notes recorded yet.
              </div>
            )}

            {/* Form to add note */}
            <div className="border-t border-slate-700/50 pt-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter new evaluation note..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-between">
                  <input
                    type="date"
                    value={newNoteDate}
                    onChange={(e) => setNewNoteDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={saving || !newNoteText.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} />
                    Add Note
                  </button>
                </div>
              </div>
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
        <button
          onClick={() => setDetailTab('resources')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
            detailTab === 'resources'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Resources
        </button>
      </div>

      {/* Render selected tracker (Screen Only) */}
      <div className="print-hide">
        {detailTab === 'advancement' && (
          <AdvancementTracker currentUser={currentUser} scoutId={scout.uid} />
        )}
        {detailTab === 'merit-badges' && (
          <MeritBadgeDashboard currentUser={currentUser} scoutId={scout.uid} />
        )}
        {detailTab === 'resources' && (
          <VideoResources currentUser={currentUser} scoutId={scout.uid} scout={scout} />
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
            Remaining vs. Completed Requirements ({activeRankData.name})
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
              {activeRankData.categories.map((category) => 
                category.requirements.map((req) => {
                  const isDone = !!completedReqs[req.id]?.completed;
                  const completionDate = completedReqs[req.id]?.completedAt || '';
                  return (
                    <tr key={req.id} className="border-t border-slate-300">
                      <td className="p-2 border border-slate-300 font-mono font-bold text-slate-600">{req.number}</td>
                      <td className="p-2 border border-slate-300">
                        <span className={isDone ? 'line-through text-slate-400' : 'text-black font-medium'}>
                          {req.text}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span className={isDone ? 'print-report-complete' : 'print-report-pending'}>
                          {isDone ? 'COMPLETED' : 'INCOMPLETE'}
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
          <div className="space-y-2">
            {notesList.length > 0 ? (
              notesList.map((n) => (
                <div key={n.id} className="p-2 border border-slate-350 rounded text-xs text-black bg-white">
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-0.5 mb-1 text-[10px] text-slate-600">
                    <span>{n.authorName} ({n.authorPosition})</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed text-black">{n.text}</p>
                </div>
              ))
            ) : (
              <div className="leader-notes-box p-3 border border-black min-h-[50px] text-xs text-slate-400 italic">
                No notes recorded.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function PatrolRoster({ currentUser }) {
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
  const [scouts, setScouts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRank, setNewRank] = useState('Scout');
  const [newGroup, setNewGroup] = useState('');
  const [newLeader, setNewLeader] = useState('');
  const [newBsaId, setNewBsaId] = useState('');
  const [newPersonalEmail, setNewPersonalEmail] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newScoutPhone, setNewScoutPhone] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [groups, setGroups] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
    const isScoutmaster = currentUser.role === 'leader' && currentUser.leaderPosition === 'Scoutmaster';
    const q = (isOwner || isScoutmaster)
      ? query(collection(db, 'users'), where('role', '==', 'scout'))
      : query(collection(db, 'users'), where('role', '==', 'scout'), where('leaderId', '==', currentUser.uid));
      
    const unsub = onSnapshot(q, (snap) => {
      setScouts(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser.uid, currentUser.role, currentUser.email, currentUser.leaderPosition]);

  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setLeaders(allUsers.filter(u => u.role === 'leader' || u.role === 'owner'));
    });
    
    return () => {
      unsubGroups();
      unsubUsers();
    };
  }, []);

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

      const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
      const assignedLeaderId = isOwner ? newLeader : currentUser.uid;

      await setDoc(doc(db, 'users', newUid), {
        fullName: newName.trim(),
        username,
        email,
        role: 'scout',
        leaderId: assignedLeaderId || null,
        groupId: newGroup || null,
        patrolId: newGroup || null,
        rank: newRank.trim(),
        bsaId: newBsaId.trim(),
        scoutEmail: newPersonalEmail.trim(),
        parentEmail: newParentEmail.trim(),
        scoutPhone: newScoutPhone.trim(),
        parentPhone: newParentPhone.trim(),
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'users', newUid, 'private', 'secrets'), { password });

      setAddMsg(`Scout added! Username: ${username} · Temporary password: ${password}`);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setNewRank('Scout');
      setNewGroup('');
      setNewLeader('');
      setNewBsaId('');
      setNewPersonalEmail('');
      setNewParentEmail('');
      setNewScoutPhone('');
      setNewParentPhone('');
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">BSA Member ID</label>
                <input
                  type="text"
                  value={newBsaId}
                  onChange={(e) => setNewBsaId(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Scout Personal Email</label>
                <input
                  type="email"
                  value={newPersonalEmail}
                  onChange={(e) => setNewPersonalEmail(e.target.value)}
                  placeholder="e.g. scout@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent's Email</label>
                <input
                  type="email"
                  value={newParentEmail}
                  onChange={(e) => setNewParentEmail(e.target.value)}
                  placeholder="e.g. parent@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Scout Phone Number</label>
                <input
                  type="tel"
                  value={newScoutPhone}
                  onChange={(e) => setNewScoutPhone(e.target.value)}
                  placeholder="e.g. +1234567890"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent Phone Number</label>
                <input
                  type="tel"
                  value={newParentPhone}
                  onChange={(e) => setNewParentPhone(e.target.value)}
                  placeholder="e.g. +1234567890"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {isOwner && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Leader</label>
                <select
                  required
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">Select Leader</option>
                  {leaders.map(l => (
                    <option key={l.uid} value={l.uid}>
                      {l.fullName || l.username} {l.leaderPosition ? `— ${l.leaderPosition}` : `(${l.role})`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Patrol / Group</label>
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="">No Patrol</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Initial Rank</label>
              <select
                value={newRank}
                onChange={(e) => setNewRank(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {RANKS_DATA.map(r => (
                  <option key={r.name} value={r.name}>{r.name}</option>
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
                <div className="flex items-center gap-3">
                  {scout.photoURL ? (
                    <img
                      src={scout.photoURL}
                      alt="Scout Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 uppercase">
                      {(scout.fullName || scout.username).charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-sm">{scout.fullName || scout.username}</p>
                    <p className="text-xs text-slate-400">@{scout.username} &bull; <span className="text-emerald-400 font-semibold">{scout.rank || 'Scout'}</span></p>
                  </div>
                </div>
                <span className="text-slate-400 text-lg">{expanded === scout.uid ? '▲' : '▼'}</span>
              </button>

              {expanded === scout.uid && (
                <div className="px-5 pb-4 border-t border-slate-700/60 pt-3 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">BSA Member ID</span>
                      <span className="font-semibold text-slate-200">{scout.bsaId || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Personal Email</span>
                      <span className="font-semibold text-slate-200">{scout.scoutEmail || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Scout Phone</span>
                      <span className="font-semibold text-slate-200">{scout.scoutPhone || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Parent Email</span>
                      <span className="font-semibold text-slate-200">{scout.parentEmail || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Parent Phone</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-200">{scout.parentPhone || '—'}</span>
                        {scout.parentPhone && (
                          <a
                            href={`https://wa.me/${scout.parentPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded p-0.5 transition cursor-pointer inline-flex items-center justify-center"
                            title="Chat with parent on WhatsApp"
                          >
                            <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

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
