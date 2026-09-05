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
import ServiceLogs from './ServiceLogs';
import IslamicBasics from './IslamicBasics';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { RANKS_DATA } from '../data/ranksData';
import { Printer, ArrowLeft, Save, Award, Star, BookOpen, ShieldAlert, Plus, Trash2, Clock, CheckCircle2, Bell, Compass, Calendar, AlertTriangle, ShieldCheck, Users } from 'lucide-react';

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
  const [detailTab, setDetailTab] = useState('advancement'); // 'advancement' | 'merit-badges' | 'resources' | 'service-logs' | 'islamic' | 'attendance'
  const [activeWhatsappPhone, setActiveWhatsappPhone] = useState(null);
  const [activeWhatsappName, setActiveWhatsappName] = useState('');

  // Loading rank, merit badge, and attendance counts for the KPI summary
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [attendanceSessions, setAttendanceSessions] = useState([]);

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

    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.records && s.records[scout.uid]);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setAttendanceSessions(list);
    });

    return () => {
      unsubRanks();
      unsubMerit();
      unsubAttendance();
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
    const total = rank.categories ? rank.categories.reduce((sum, c) => sum + c.requirements.length, 0) : (rank.requirements?.length || 0);
    const done = rank.categories 
      ? rank.categories.reduce((sum, c) => sum + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0)
      : (rank.requirements?.filter(r => completedReqs[r.id]?.completed)?.length || 0);
    return total > 0 && done === total;
  }).length;

  const activeRank = scout.rank || 'Scout';
  const activeRankId = activeRank.toLowerCase().replace(' ', '_');
  const activeRankData = RANKS_DATA.find(r => r.id === activeRankId || r.name.toLowerCase() === activeRank.toLowerCase()) || RANKS_DATA[0];
  const activeProg = ranksProgress[activeRankData.id] || { completedRequirements: {} };
  const completedReqs = activeProg.completedRequirements || {};
  const activeTotal = activeRankData.categories 
    ? activeRankData.categories.reduce((sum, c) => sum + c.requirements.length, 0)
    : (activeRankData.requirements?.length || 0);
  const activeDone = activeRankData.categories 
    ? activeRankData.categories.reduce((sum, c) => sum + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0) 
    : (activeRankData.requirements?.filter(r => completedReqs[r.id]?.completed)?.length || 0);
  const activePercent = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  // Merit Badge Stats
  const badgesEarned = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    return b.requirements.filter(r => p.steps?.[r.id]).length === b.requirements.length;
  });
  const eagleBadgesEarned = badgesEarned.filter(b => b.eagleRequired).length;

  // Attendance Metrics for Scout
  let scoutTotalAttendedHours = 0;
  let scoutTotalCampingNights = 0;
  let scoutFridayHrs = 0;
  let scoutTuesdayHrs = 0;
  let scoutServiceHrs = 0;
  let scoutAttendedCount = 0;
  let scoutUnexcused = 0;
  let scoutExcused = 0;

  attendanceSessions.forEach(session => {
    const rec = session.records?.[scout.uid];
    if (rec) {
      const sType = session.eventType || '';
      const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
      const defaultN = sType.includes('Camp') ? 2 : 0;
      const h = rec.hours !== undefined ? Number(rec.hours) : (session.hours !== undefined ? Number(session.hours) : defaultH);
      const n = rec.nights !== undefined ? Number(rec.nights) : (session.nights !== undefined ? Number(session.nights) : defaultN);

      if (rec.status === 'present' || rec.status === 'late') {
        scoutAttendedCount++;
        scoutTotalAttendedHours += h;
        scoutTotalCampingNights += n;
        if (sType.includes('Tuesday')) scoutTuesdayHrs += h;
        else if (sType.includes('Weekly') || sType.includes('Friday')) scoutFridayHrs += h;
        else if (sType.includes('Service') || sType.includes('Volunteer')) scoutServiceHrs += h;
      } else if (rec.status === 'excused') {
        scoutExcused++;
      } else if (rec.status === 'absent') {
        scoutUnexcused++;
      }
    }
  });

  const scoutTotalSessions = attendanceSessions.length;
  const scoutAttendanceRate = scoutTotalSessions > 0 ? Math.round((scoutAttendedCount / scoutTotalSessions) * 100) : 100;
  const scoutRiskLevel = scoutUnexcused >= 3 ? 'critical' : scoutUnexcused === 2 ? 'warning' : 'good';

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
          <div className="flex gap-3 flex-wrap">
            <div className="text-center px-3.5 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-white block">{completedRanksCount} / 7</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ranks Earned</span>
            </div>
            <div className="text-center px-3.5 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-white block">{activePercent}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Progress</span>
            </div>
            <div className="text-center px-3.5 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-white block">{eagleBadgesEarned} / {TOTAL_EAGLE_REQUIRED_FOR_RANK}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Eagle Badges</span>
            </div>
            <div className="text-center px-3.5 py-2 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <span className="text-sm font-bold text-emerald-400 block font-mono">{scoutTotalAttendedHours}h</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {scoutRiskLevel === 'critical' ? '🚨 At Risk' : scoutRiskLevel === 'warning' ? '⚠️ Warning' : '🟢 Standing'} ({scoutAttendanceRate}%)
              </span>
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
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="font-semibold text-slate-200 text-sm">{scout.scoutPhone || '—'}</span>
              {scout.scoutPhone && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveWhatsappPhone(scout.scoutPhone);
                    setActiveWhatsappName(scout.fullName || scout.username);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg p-1 transition cursor-pointer flex items-center justify-center"
                  title="Chat with scout on WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </button>
              )}
            </div>
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
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveWhatsappPhone(scout.parentPhone);
                    setActiveWhatsappName(`${scout.fullName || scout.username}'s Parent`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg p-1 transition cursor-pointer flex items-center justify-center"
                  title="Chat with parent on WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </button>
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
                    <div key={note.id} className="bg-slate-900/60 border border-slate-755 p-3 rounded-xl text-xs space-y-1 relative group">
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

      {/* Tabs to switch between sections (Screen Only) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-1 print-hide">
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
          onClick={() => setDetailTab('attendance')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            detailTab === 'attendance'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>📋 Attendance (${scoutTotalAttendedHours}h)</span>
          {scoutRiskLevel !== 'good' && (
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${scoutRiskLevel === 'critical' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-slate-950'}`}>
              {scoutUnexcused} Absences
            </span>
          )}
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
        <button
          onClick={() => setDetailTab('service-logs')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
            detailTab === 'service-logs'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Service & Volunteering
        </button>
        <button
          onClick={() => setDetailTab('islamic')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
            detailTab === 'islamic'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Islamic Basics
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
        {detailTab === 'attendance' && (
          <div className="space-y-4">
            {/* Retention Risk Notice */}
            {scoutRiskLevel === 'critical' && (
              <div className="p-4 rounded-2xl bg-red-950/70 border-2 border-red-500 text-red-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-300 text-sm">
                  <AlertTriangle size={18} className="text-red-400 animate-bounce shrink-0" />
                  <span>CRITICAL ATTENDANCE RISK ({scoutUnexcused} Unexcused Absences)</span>
                </div>
                <p className="leading-relaxed">
                  Scout has missed {scoutUnexcused} sessions unexcused. Minimum troop requirement is 75% attendance. Active parent conference recommended.
                </p>
              </div>
            )}

            {scoutRiskLevel === 'warning' && (
              <div className="p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-500/80 text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                  <span>ATTENDANCE WARNING (2 Unexcused Absences)</span>
                </div>
                <p className="leading-relaxed">
                  Scout has accumulated 2 absences ({scoutAttendanceRate}% attendance rate). Remind family of meeting requirements.
                </p>
              </div>
            )}

            {scoutRiskLevel === 'good' && (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-600/60 text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                  <span>CERTIFIED IN GOOD STANDING ({scoutAttendanceRate}% Attendance Rate)</span>
                </div>
                <span className="text-[11px] font-mono bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-emerald-300 font-bold border border-emerald-700">
                  Active Qualified
                </span>
              </div>
            )}

            {/* 4 Attendance Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Attended</span>
                <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">{scoutTotalAttendedHours}h</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{scoutAttendedCount} of {scoutTotalSessions} sessions ({scoutAttendanceRate}%)</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Camping Experience</span>
                <span className="text-2xl font-black text-amber-400 font-mono block mt-1">{scoutTotalCampingNights} Nights</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Overnight campouts</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tuesday Program</span>
                <span className="text-2xl font-black text-teal-400 font-mono block mt-1">{scoutTuesdayHrs}h</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">1.25 hrs / meeting</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Friday Troop Meetings</span>
                <span className="text-2xl font-black text-sky-400 font-mono block mt-1">{scoutFridayHrs}h</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">3.0 hrs / meeting</span>
              </div>
            </div>

            {/* Attendance Activity Ledger Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 border-b border-slate-700 bg-slate-850 flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-400" />
                  <span>Session Attendance Ledger</span>
                </h4>
                <span className="text-xs text-slate-400">{attendanceSessions.length} total logged sessions</span>
              </div>

              {attendanceSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No attendance records logged yet for this scout.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Program / Event</th>
                        <th className="p-3 text-center">Hours</th>
                        <th className="p-3 text-center">Nights</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3">Remarks / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {attendanceSessions.map((session) => {
                        const rec = session.records?.[scout.uid] || {};
                        const sType = session.eventType || '';
                        const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
                        const defaultN = sType.includes('Camp') ? 2 : 0;
                        const h = rec.hours !== undefined ? Number(rec.hours) : (session.hours !== undefined ? Number(session.hours) : defaultH);
                        const n = rec.nights !== undefined ? Number(rec.nights) : (session.nights !== undefined ? Number(session.nights) : defaultN);
                        const st = rec.status || 'unmarked';

                        let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                        if (st === 'present') badgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60';
                        else if (st === 'late') badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-600/60';
                        else if (st === 'excused') badgeColor = 'bg-blue-950/80 text-blue-300 border-blue-600/60';
                        else if (st === 'absent') badgeColor = 'bg-red-950/80 text-red-300 border-red-600/60 font-bold';

                        return (
                          <tr key={session.id} className="hover:bg-slate-750/30 transition">
                            <td className="p-3 font-mono text-slate-300 whitespace-nowrap">{session.date || '—'}</td>
                            <td className="p-3">
                              <span className="font-semibold text-white block">{session.title || session.eventType || 'Troop Meeting'}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{session.eventType}</span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-200">
                              {st === 'present' || st === 'late' ? `${h}h` : '0h'}
                            </td>
                            <td className="p-3 text-center font-mono text-amber-400 font-bold">
                              {(st === 'present' || st === 'late') && n > 0 ? `${n}n` : '—'}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] border uppercase tracking-wider font-semibold ${badgeColor}`}>
                                {st}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 italic max-w-xs truncate">
                              {rec.notes || session.notes || '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {detailTab === 'resources' && (
          <VideoResources currentUser={currentUser} scoutId={scout.uid} scout={scout} />
        )}
        {detailTab === 'service-logs' && (
          <ServiceLogs currentUser={currentUser} scoutId={scout.uid} />
        )}
        {detailTab === 'islamic' && (
          <IslamicBasics currentUser={currentUser} scoutId={scout.uid} />
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Advancement & Attendance Summary</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{activePercent}%</p>
              <p className="text-[10px] text-slate-500">Active Rank Progress ({activeRank})</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{completedRanksCount} / {RANKS_DATA.length}</p>
              <p className="text-[10px] text-slate-500">Ranks Fully Earned</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{badgesEarned.length}</p>
              <p className="text-[10px] text-slate-500">Merit Badges ({eagleBadgesEarned} Eagle-Req)</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{scoutTotalAttendedHours}h</p>
              <p className="text-[10px] text-slate-500">Attended ({scoutAttendanceRate}% Rate &bull; {scoutTotalCampingNights}n)</p>
            </div>
          </div>
        </div>

        {/* Attendance Risk / Standing Notice Box */}
        <div className="border border-black p-3 rounded text-xs space-y-1">
          <p className="font-bold text-black uppercase">
            Official Attendance & Retention Standing:
            {scoutRiskLevel === 'critical' ? ' 🚨 CRITICAL ATTENDANCE RISK' : scoutRiskLevel === 'warning' ? ' ⚠️ ATTENDANCE WARNING' : ' 🟢 IN GOOD STANDING'}
          </p>
          <p className="text-slate-700">
            Total Hours Logged: <strong>{scoutTotalAttendedHours}h</strong> | Camping: <strong>{scoutTotalCampingNights} Nights</strong> | Unexcused Absences: <strong>{scoutUnexcused}</strong> | Attendance Rate: <strong>{scoutAttendanceRate}%</strong>
          </p>
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
              {activeRankData.categories ? activeRankData.categories.map((category) => 
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
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Attendance Activity Ledger in Print */}
        {attendanceSessions.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Attendance & Activity Ledger</h2>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-black">
                  <th className="p-2 border border-slate-300 w-24">Date</th>
                  <th className="p-2 border border-slate-300">Event / Program</th>
                  <th className="p-2 border border-slate-300 w-16 text-center">Hours</th>
                  <th className="p-2 border border-slate-300 w-16 text-center">Nights</th>
                  <th className="p-2 border border-slate-300 w-20 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceSessions.map((session) => {
                  const rec = session.records?.[scout.uid] || {};
                  const sType = session.eventType || '';
                  const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
                  const defaultN = sType.includes('Camp') ? 2 : 0;
                  const h = rec.hours !== undefined ? Number(rec.hours) : (session.hours !== undefined ? Number(session.hours) : defaultH);
                  const n = rec.nights !== undefined ? Number(rec.nights) : (session.nights !== undefined ? Number(session.nights) : defaultN);
                  const st = rec.status || 'unmarked';
                  return (
                    <tr key={session.id} className="border-t border-slate-300">
                      <td className="p-2 border border-slate-300 font-mono text-black">{session.date || '—'}</td>
                      <td className="p-2 border border-slate-300 text-black font-medium">{session.title || session.eventType}</td>
                      <td className="p-2 border border-slate-300 text-center font-mono">{(st === 'present' || st === 'late') ? `${h}h` : '0h'}</td>
                      <td className="p-2 border border-slate-300 text-center font-mono">{(st === 'present' || st === 'late') && n > 0 ? `${n}n` : '—'}</td>
                      <td className="p-2 border border-slate-300 text-center uppercase font-bold text-[10px]">{st}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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

      {/* WhatsApp Template Modal */}
      {activeWhatsappPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print-hide">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-left">
            <h3 className="font-bold text-white text-base">Send WhatsApp Message</h3>
            <p className="text-xs text-slate-350">
              Select a template to send to <strong>{activeWhatsappName}</strong> ({activeWhatsappPhone}):
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "⭐ Scout Portal Login & Profile Setup Invitation (Predefined)",
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

Official onboarding credentials for *Dhulfiqār Scouts BSA* (Taliʿa Leadership Portal):

🔗 *App Link:* https://taliat-app.vercel.app/
👤 *Username:* ${scout.username || scout.email}
🔑 *Temporary Password:* ${scout.tempPassword || scout.username || 'taliat2026'}

📌 *Mandatory Account Configuration & Tarbiyah Setup:*
1. Log into the portal link above.
2. Navigate directly to *"My Profile"* (👤).
3. Complete your profile parameters:
   • Replace default username with your personal handle & assign your private password.
   • Upload a clear profile photograph.
   • Complete all profile parameters (personal email, scout mobile, parent contact, BSA Member ID, and emergency details).

If you have any questions or require login support, contact your patrol leader directly.

Jazākum Allāhu khayran for your continued support 🙏✨
✨ ${scout.patrolName ? `${scout.patrolName} Patrol` : 'Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās)'} ✨
⚜️ Dhulfiqār Scouts Team ⚜️`
                },
                {
                  label: "👨‍👩‍👧 Parent Portal Invitation & Family Profile Setup",
                  text: `👨‍👩‍👧 *Assalāmu ʿAlaykum ${scout.parentName || `${scout.fullName || scout.username}'s Parent`}!*

Official access credentials for the *Dhulfiqār Scouts Family & Parent Portal*:

🔗 *App Link:* https://taliat-app.vercel.app/
👤 *Login Email / Username:* ${scout.parentEmail || scout.username}
🔑 *Temporary Password:* ${scout.tempPassword || 'taliat2026'}
⚜️ *Linked Scout:* ${scout.fullName || scout.username}

📌 *Executive Parent Portal Capabilities:*
• Real-time monitoring across all 7 BSA Ranks & Merit Badges.
• Meeting attendance records, camping night logs, and service hours.
• Parent Action Center: Digital waivers, medical forms, and BSA Health Records.
• Event RSVPs, carpool seat allocations, and absence dispatch notices.
• Dual-Parent Household Profile management under *"Family Profile"* (👤).

Please log in and finalize your household profile parameters.

Jazākum Allāhu khayran for your continued support 🙏✨
✨ ${scout.patrolName ? `${scout.patrolName} Patrol` : 'Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās)'} ✨
⚜️ Dhulfiqār Scouts Team ⚜️`
                },
                { 
                  label: "📅 Meeting Reminder", 
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

Operational directive: Attendance reminder for our upcoming Dhulfiqār Scouting Session.

🔗 *Leadership Portal:* https://taliat-app.vercel.app/
📍 *Protocol:* Arrive punctually in full uniform with your Scout Handbook and notebook prepared.

Jazākum Allāhu khayran for your continued support 🙏✨
✨ ${scout.patrolName ? `${scout.patrolName} Patrol` : 'Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās)'} ✨
⚜️ Dhulfiqār Scouts Team ⚜️` 
                },
                { 
                  label: "🛡️ Safeguarding Video Reminder", 
                  text: `🛡️ *Assalāmu ʿAlaykum ${scout.fullName || scout.username}!*

Compliance directive: Complete your mandatory Youth Protection and Safety Training (SPT) video modules.

🔗 *Direct Access:* https://taliat-app.vercel.app/
📌 *Protocol:* Access your Taliʿa Profile, complete the video modules, and confirm verification with leadership.

Jazākum Allāhu khayran for your continued support 🙏✨
✨ ${scout.patrolName ? `${scout.patrolName} Patrol` : 'Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās)'} ✨
⚜️ Dhulfiqār Scouts Team ⚜️` 
                },
                { 
                  label: "🕌 Islamic Knowledge Progress Reminder", 
                  text: `🕌 *Assalāmu ʿAlaykum ${scout.fullName || scout.username}!*

Curriculum review directive: Complete the Twelver Shia Islamic Knowledge modules (Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and Sīrah of Ahl al-Bayt ʿalayhim al-salām).

🔗 *Portal Checklist:* https://taliat-app.vercel.app/
📌 *Protocol:* Complete your unit milestones and prepare for leader oral/written assessment.

Jazākum Allāhu khayran for your continued support 🙏✨
✨ ${scout.patrolName ? `${scout.patrolName} Patrol` : 'Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās)'} ✨
⚜️ Dhulfiqār Scouts Team ⚜️` 
                },
                { 
                  label: "⏱️ Service Hours Reminder", 
                  text: `⏱️ *Assalāmu ʿAlaykum ${scout.fullName || scout.username}!*

Service log directive: Submit your community volunteering and service project hours into the portal.

🔗 *Service Portal:* https://taliat-app.vercel.app/
📌 *Protocol:* Log project title, date, duration, and beneficiary organization for leader verification.

Jazākum Allāhu khayran for your continued support 🙏✨
✨ ${scout.patrolName ? `${scout.patrolName} Patrol` : 'Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās)'} ✨
⚜️ Dhulfiqār Scouts Team ⚜️` 
                }
              ].map((tmpl) => {
                const encodedText = encodeURIComponent(tmpl.text);
                const waLink = `https://wa.me/${activeWhatsappPhone.replace(/[^0-9]/g, '')}${tmpl.text ? `?text=${encodedText}` : ''}`;
                return (
                  <a
                    key={tmpl.label}
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveWhatsappPhone(null)}
                    className="block w-full bg-slate-900 border border-slate-750 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition"
                  >
                    {tmpl.label}
                    {tmpl.text && <span className="block text-[10px] text-slate-450 font-normal mt-0.5 truncate">{tmpl.text}</span>}
                  </a>
                );
              })}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-750/50">
              <button
                onClick={() => setActiveWhatsappPhone(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatrolRoster({ currentUser = {} }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const [activeGroupTab, setActiveGroupTab] = useState('all');
  const [rosterSubTab, setRosterSubTab] = useState('scouts'); // 'scouts' | 'leaders' | 'parents'
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
  const [pendingApprovalsMap, setPendingApprovalsMap] = useState({});
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingModalScoutId, setPendingModalScoutId] = useState(null);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [activeWhatsappPhone, setActiveWhatsappPhone] = useState(null);
  const [activeWhatsappName, setActiveWhatsappName] = useState('');

  // Parent Account Provisioning State
  const [parents, setParents] = useState([]);
  const [showParentForm, setShowParentForm] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentLinkedScoutIds, setParentLinkedScoutIds] = useState([]);
  const [parentAdding, setParentAdding] = useState(false);
  const [parentMsg, setParentMsg] = useState('');
  const [parentErr, setParentErr] = useState('');
  const [editingParent, setEditingParent] = useState(null);
  const [editParentLinkedIds, setEditParentLinkedIds] = useState([]);
  const [savingParentLinks, setSavingParentLinks] = useState(false);
  const [parentLinkMsg, setParentLinkMsg] = useState('');
  const [resettingParentUser, setResettingParentUser] = useState(null);
  const [newParentResetPass, setNewParentResetPass] = useState('');
  const [parentResetMsg, setParentResetMsg] = useState('');
  const [parentResetErr, setParentResetErr] = useState('');
  const [parentResetLoading, setParentResetLoading] = useState(false);

  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;
  const isAssistantLeader = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Leader';
  const canAddOrDeleteScouts = isExecutive || (currentUser?.role === 'leader' && !isAssistantLeader);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
      
    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      if (!isExecutive) {
        // Filter strictly by assigned leaderId OR matching patrol groupId
        list = list.filter(s => s.leaderId === currentUser?.uid || (currentUser?.groupId && (s.groupId === currentUser?.groupId || s.patrolId === currentUser?.groupId)));
      }
      setScouts(list);
    }, (err) => {
      console.error("Error listening to scouts in roster:", err);
    });
    return () => unsub();
  }, [currentUser?.uid, currentUser?.role, currentUser?.email, currentUser?.leaderPosition, currentUser?.groupId, isExecutive]);

  // Subscribe to real-time pending approvals count for all visible scouts (Ranks + Badges + Islamic + Assignments)
  useEffect(() => {
    if (scouts.length === 0) {
      setPendingApprovalsMap({});
      return;
    }

    const unsubs = [];
    scouts.forEach((scout) => {
      // 1. Listen to ranks progress
      const ranksRef = collection(db, 'user_progress', scout.uid, 'ranks');
      const unsubRanks = onSnapshot(ranksRef, (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          const reqs = data.completedRequirements || data.steps || {};
          Object.values(reqs).forEach((r) => {
            if ((r?.pending || r === 'pending') && !r?.completed) count++;
          });
        });
        setPendingApprovalsMap((prev) => {
          const prevScout = prev[scout.uid] || {};
          const next = { ...prevScout, ranks: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      }, (err) => console.error("Error loading scout ranks pending:", err));
      unsubs.push(unsubRanks);

      // 2. Listen to merit badges progress
      const meritRef = collection(db, 'user_progress', scout.uid, 'merit_badges');
      const unsubMerit = onSnapshot(meritRef, (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          const steps = data.completedSteps || data.steps || {};
          Object.values(steps).forEach((s) => {
            if ((s?.pending || s === 'pending') && !s?.approved && !s?.completed) count++;
          });
          if (data.pending && !data.completed) count++;
        });
        setPendingApprovalsMap((prev) => {
          const prevScout = prev[scout.uid] || {};
          const next = { ...prevScout, merit: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      }, (err) => console.error("Error loading scout merit pending:", err));
      unsubs.push(unsubMerit);

      // 3. Listen to Islamic basics progress
      const islamicRef = doc(db, 'user_progress', scout.uid, 'islamic_basics', 'status');
      const unsubIslamic = onSnapshot(islamicRef, (snap) => {
        let count = 0;
        if (snap.exists()) {
          const data = snap.data();
          Object.values(data).forEach((p) => {
            if ((p?.pending || p === 'pending') && !p?.completed) count++;
          });
        }
        setPendingApprovalsMap((prev) => {
          const prevScout = prev[scout.uid] || {};
          const next = { ...prevScout, islamic: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      }, (err) => console.error("Error loading scout islamic pending:", err));
      unsubs.push(unsubIslamic);

      // 4. Listen to Assignments submissions
      const assignRef = collection(db, 'user_progress', scout.uid, 'assignments');
      const unsubAssign = onSnapshot(assignRef, (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.submittedDate && !data.completed && !data.graded) count++;
        });
        setPendingApprovalsMap((prev) => {
          const prevScout = prev[scout.uid] || {};
          const next = { ...prevScout, assignments: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      }, (err) => console.error("Error loading scout assignments pending:", err));
      unsubs.push(unsubAssign);
    });

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [scouts]);

  const totalApprovalsNeeded = Object.values(pendingApprovalsMap).reduce((sum, item) => sum + (item?.total || 0), 0);

  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setLeaders(allUsers.filter(u => u.role === 'leader' || u.role === 'owner'));
      setParents(allUsers.filter(u => u.role === 'parent'));
    });

    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      setAttendanceSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error loading attendance in PatrolRoster:", err));
    
    return () => {
      unsubGroups();
      unsubUsers();
      unsubAttendance();
    };
  }, []);

  const getScoutAttendanceStats = (scoutUid) => {
    let totalAttendedHours = 0;
    let campingNights = 0;
    let fridayHrs = 0;
    let tuesdayHrs = 0;
    let serviceHrs = 0;
    let attended = 0;
    let unexcused = 0;
    let excused = 0;
    let total = 0;

    attendanceSessions.forEach(session => {
      const rec = session.records?.[scoutUid];
      if (rec) {
        total++;
        const sType = session.eventType || '';
        const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
        const defaultN = sType.includes('Camp') ? 2 : 0;
        const h = rec.hours !== undefined ? Number(rec.hours) : (session.hours !== undefined ? Number(session.hours) : defaultH);
        const n = rec.nights !== undefined ? Number(rec.nights) : (session.nights !== undefined ? Number(session.nights) : defaultN);

        if (rec.status === 'present' || rec.status === 'late') {
          attended++;
          totalAttendedHours += h;
          campingNights += n;
          if (sType.includes('Tuesday')) tuesdayHrs += h;
          else if (sType.includes('Weekly') || sType.includes('Friday')) fridayHrs += h;
          else if (sType.includes('Service') || sType.includes('Volunteer')) serviceHrs += h;
        } else if (rec.status === 'excused') {
          excused++;
        } else if (rec.status === 'absent') {
          unexcused++;
        }
      }
    });

    const rate = total > 0 ? Math.round((attended / total) * 100) : 100;
    const risk = unexcused >= 3 ? 'critical' : unexcused === 2 ? 'warning' : 'good';

    return {
      hours: totalAttendedHours,
      nights: campingNights,
      fridayHrs,
      tuesdayHrs,
      serviceHrs,
      attended,
      total,
      unexcused,
      excused,
      rate,
      risk
    };
  };

  const handleAddParent = async (e) => {
    e?.preventDefault?.();
    setParentErr('');
    setParentMsg('');
    const name = parentName.trim();
    const email = parentEmail.trim().toLowerCase();
    const password = parentPassword;

    if (!name || !email || !password) {
      setParentErr('Please fill in parent name, email, and temporary password.');
      return;
    }
    if (password.length < 6) {
      setParentErr('Password must be at least 6 characters.');
      return;
    }
    if (parentLinkedScoutIds.length === 0) {
      setParentErr('Please select at least one scout child to link to this parent.');
      return;
    }

    setParentAdding(true);

    try {
      let secApp;
      try {
        secApp = getApp('secondary');
      } catch {
        secApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secAuth = getAuth(secApp);
      const cred = await createUserWithEmailAndPassword(secAuth, email, password);
      const newUid = cred.user.uid;
      await secAuth.signOut();

      // Create Parent User Document
      await setDoc(doc(db, 'users', newUid), {
        fullName: name,
        email,
        username: email.split('@')[0],
        role: 'parent',
        linkedScoutIds: parentLinkedScoutIds,
        assignedLeaderId: currentUser?.uid || null,
        createdAt: serverTimestamp()
      });

      // Save secret for leader/owner password reset
      await setDoc(doc(db, 'users', newUid, 'private', 'secrets'), { password });

      // Automatically sync parentUids on each linked scout document
      for (const scoutId of parentLinkedScoutIds) {
        const targetScout = scouts.find(s => s.uid === scoutId);
        const existingParents = Array.isArray(targetScout?.parentUids) ? targetScout.parentUids : [];
        if (!existingParents.includes(newUid)) {
          await setDoc(doc(db, 'users', scoutId), {
            parentUids: [...existingParents, newUid]
          }, { merge: true });
        }
      }

      setParentMsg(`✓ Parent account created for ${name}! App Link: https://taliat-app.vercel.app/ · Login Email: ${email} · Temporary Password: ${password}`);
      setParentName('');
      setParentEmail('');
      setParentPassword('');
      setParentLinkedScoutIds([]);
      setShowParentForm(false);
    } catch (err) {
      console.error("Failed to create parent account:", err);
      setParentErr(`Error creating parent: ${err.message}`);
    } finally {
      setParentAdding(false);
    }
  };

  const handleSaveParentLinks = async () => {
    if (!editingParent) return;
    setSavingParentLinks(true);
    setParentLinkMsg('');

    try {
      const parentUid = editingParent.uid;
      const updatedLinkedIds = editParentLinkedIds;

      // 1. Update parent doc
      await setDoc(doc(db, 'users', parentUid), {
        linkedScoutIds: updatedLinkedIds,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Sync parentUids on all scouts
      for (const scout of scouts) {
        const isLinked = updatedLinkedIds.includes(scout.uid);
        const currentParents = Array.isArray(scout.parentUids) ? scout.parentUids : [];

        if (isLinked && !currentParents.includes(parentUid)) {
          await setDoc(doc(db, 'users', scout.uid), {
            parentUids: [...currentParents, parentUid]
          }, { merge: true });
        } else if (!isLinked && currentParents.includes(parentUid)) {
          await setDoc(doc(db, 'users', scout.uid), {
            parentUids: currentParents.filter(pId => pId !== parentUid)
          }, { merge: true });
        }
      }

      setParentLinkMsg('✓ Linked scouts updated successfully!');
      setTimeout(() => {
        setEditingParent(null);
        setParentLinkMsg('');
      }, 1500);
    } catch (err) {
      console.error("Failed to update parent links:", err);
      setParentLinkMsg(`Error: ${err.message}`);
    } finally {
      setSavingParentLinks(false);
    }
  };

  const handleResetParentPassword = async () => {
    if (!resettingParentUser || !newParentResetPass.trim()) return;
    if (newParentResetPass.trim().length < 6) {
      setParentResetErr("Password must be at least 6 characters.");
      return;
    }

    setParentResetLoading(true);
    setParentResetErr('');
    setParentResetMsg('');

    try {
      const secretsRef = doc(db, 'users', resettingParentUser.uid, 'private', 'secrets');
      const secretsSnap = await getDoc(secretsRef);
      let currentPassword = '';
      if (secretsSnap.exists()) {
        currentPassword = secretsSnap.data().password;
      } else {
        currentPassword = resettingParentUser.username;
      }

      if (!currentPassword) {
        throw new Error("Could not retrieve current password for reset.");
      }

      let secApp;
      try {
        secApp = getApp('secondary');
      } catch {
        secApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secAuth = getAuth(secApp);
      const userCred = await signInWithEmailAndPassword(secAuth, resettingParentUser.email, currentPassword);
      await updatePassword(userCred.user, newParentResetPass.trim());
      await secAuth.signOut();

      await setDoc(secretsRef, { password: newParentResetPass.trim() }, { merge: true });
      setParentResetMsg("✓ Password updated successfully!");
      setTimeout(() => {
        setResettingParentUser(null);
        setNewParentResetPass('');
        setParentResetMsg('');
      }, 1500);
    } catch (err) {
      console.error("Failed to reset parent password:", err);
      setParentResetErr(`Failed to reset password: ${err.message}`);
    } finally {
      setParentResetLoading(false);
    }
  };

  const handleAddScout = async (e) => {
    e.preventDefault();
    if (!canAddOrDeleteScouts) {
      setAddError('Assistant Leaders do not have permission to add or remove scouts.');
      return;
    }
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

  const visibleGroups = isOwner || isScoutmaster
    ? groups
    : groups.filter(g => g.leaderId === currentUser.uid || g.id === currentUser.groupId || scouts.some(s => s.groupId === g.id));

  const filteredScouts = activeGroupTab === 'all'
    ? scouts
    : scouts.filter(s => s.groupId === activeGroupTab);

  return (
    <div className="space-y-6 print-hide">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-white">Patrol Roster</h3>
          <p className="text-xs text-slate-400">
            {rosterSubTab === 'scouts' 
              ? `${scouts.length} scout${scouts.length !== 1 ? 's' : ''} assigned to you`
              : rosterSubTab === 'leaders'
              ? `${leaders.length} leader${leaders.length !== 1 ? 's' : ''} in the troop`
              : `${parents.length} parent account${parents.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rosterSubTab === 'scouts' && canAddOrDeleteScouts && (
            <button
              onClick={() => { setShowForm((v) => !v); setAddMsg(''); setAddError(''); }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              {showForm ? 'Cancel' : '+ Add Scout'}
            </button>
          )}

          {rosterSubTab === 'parents' && canAddOrDeleteScouts && (
            <button
              onClick={() => { setShowParentForm((v) => !v); setParentMsg(''); setParentErr(''); }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{showParentForm ? 'Cancel' : '+ Create Parent Account'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Approvals Needed Notification Banner (Interactive) */}
      {totalApprovalsNeeded > 0 && (
        <div
          onClick={() => {
            setPendingModalScoutId(null);
            setShowPendingModal(true);
          }}
          className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-2 border-amber-500/60 hover:border-amber-400 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-amber-950/40 cursor-pointer group transition duration-300 hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 shadow-md group-hover:scale-110 transition">
              <Bell size={24} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-black text-amber-300 flex items-center gap-2">
                  <span>{totalApprovalsNeeded} Approval{totalApprovalsNeeded !== 1 ? 's' : ''} Needed</span>
                </h4>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                Scouts in your patrol have submitted Islamic tests, rank requirements, merit badges, or tasks awaiting leader review.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPendingModalScoutId(null);
              setShowPendingModal(true);
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-950/50 shrink-0 self-start sm:self-auto group-hover:shadow-amber-500/20"
          >
            <Clock size={15} />
            <span>Review & Test Submissions ({totalApprovalsNeeded}) &rarr;</span>
          </button>
        </div>
      )}

      {/* Directory Sub-tabs */}
      <div className="flex gap-4 border-b border-slate-700/60 pb-1">
        <button
          onClick={() => setRosterSubTab('scouts')}
          className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            rosterSubTab === 'scouts' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Scouts Roster</span>
          {totalApprovalsNeeded > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-slate-950 animate-pulse">
              {totalApprovalsNeeded}
            </span>
          )}
        </button>
        <button
          onClick={() => setRosterSubTab('leaders')}
          className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${
            rosterSubTab === 'leaders' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Leaders Directory ({leaders.length})
        </button>
        <button
          onClick={() => setRosterSubTab('parents')}
          className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            rosterSubTab === 'parents' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>👨‍👩‍👧 Parents Directory</span>
          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-800 text-emerald-300 border border-slate-700">
            {parents.length}
          </span>
        </button>
      </div>

      {rosterSubTab === 'scouts' ? (
        <>
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
                    placeholder="e.g. Ali Ahmed"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Username (Used for Login)</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. aliahmed"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
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

          {/* Group / Patrol Tabs Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-700/60 scrollbar-none mb-4">
            <button
              onClick={() => setActiveGroupTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeGroupTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span>All Patrols</span>
              <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full font-mono">
                {scouts.length}
              </span>
            </button>
            {visibleGroups.map((g) => {
              const groupScouts = scouts.filter(s => s.groupId === g.id);
              const groupApprovals = groupScouts.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupTab(g.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    activeGroupTab === g.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛡️ {g.name} Patrol</span>
                  <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full font-mono">
                    {groupScouts.length}
                  </span>
                  {groupApprovals > 0 && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded-full font-black">
                      {groupApprovals}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── SEPARATED PATROLS VIEW ── */}
          {(() => {
            // Build list of patrols to render
            const patrolSections = [];
            if (activeGroupTab === 'all') {
              visibleGroups.forEach(g => {
                const groupScouts = scouts.filter(s => s.groupId === g.id);
                const groupApprovals = groupScouts.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
                patrolSections.push({
                  id: g.id,
                  name: g.name,
                  description: g.description || 'Active Troop Patrol',
                  leaderId: g.leaderId,
                  scouts: groupScouts,
                  approvals: groupApprovals
                });
              });
              const unassigned = scouts.filter(s => !s.groupId || !visibleGroups.some(g => g.id === s.groupId));
              if (unassigned.length > 0) {
                const unassignedApprovals = unassigned.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
                patrolSections.push({
                  id: 'unassigned',
                  name: 'Unassigned Scouts',
                  description: 'Scouts pending assignment to a specific patrol',
                  leaderId: null,
                  scouts: unassigned,
                  approvals: unassignedApprovals
                });
              }
            } else {
              const selectedGroup = visibleGroups.find(g => g.id === activeGroupTab);
              const groupScouts = scouts.filter(s => s.groupId === activeGroupTab);
              const groupApprovals = groupScouts.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
              patrolSections.push({
                id: activeGroupTab,
                name: selectedGroup ? selectedGroup.name : 'Selected Patrol',
                description: selectedGroup?.description || 'Active Troop Patrol',
                leaderId: selectedGroup?.leaderId,
                scouts: groupScouts,
                approvals: groupApprovals
              });
            }

            if (patrolSections.length === 0 || scouts.length === 0) {
              return (
                <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
                  No scouts found. Click "+ Add Scout" to register troop members.
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {patrolSections.map((patrol) => {
                  const assignedLeader = leaders.find(l => l.uid === patrol.leaderId);
                  return (
                    <div
                      key={patrol.id}
                      className="bg-slate-850/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4"
                    >
                      {/* Patrol Header Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg shrink-0">
                            🛡️
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-extrabold text-white">
                                {patrol.name.toLowerCase().includes('patrol') ? patrol.name : `${patrol.name} Patrol`}
                              </h4>
                              <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded-full font-bold">
                                {patrol.scouts.length} {patrol.scouts.length === 1 ? 'Scout' : 'Scouts'}
                              </span>
                              {patrol.approvals > 0 && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                                  <Clock size={11} /> {patrol.approvals} Needs Review
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {assignedLeader ? (
                                <span>Leader: <strong className="text-slate-200">{assignedLeader.fullName || assignedLeader.username}</strong></span>
                              ) : (
                                <span>{patrol.description}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Patrol Quick Actions */}
                        <div className="flex items-center gap-2">
                          {patrol.scouts.length > 0 && (
                            <button
                              onClick={() => {
                                const parentPhones = patrol.scouts.map(s => s.parentPhone).filter(Boolean);
                                if (parentPhones.length > 0) {
                                  setActiveWhatsappPhone(parentPhones[0]);
                                  setActiveWhatsappName(`${patrol.name} Parents`);
                                } else {
                                  alert('No phone numbers recorded for scouts in this patrol.');
                                }
                              }}
                              className="bg-emerald-700/40 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-600/30 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                              </svg>
                              <span>WhatsApp Patrol</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Patrol Scouts List */}
                      <div className="space-y-2.5">
                        {patrol.scouts.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-3 text-center">
                            No scouts currently assigned to this patrol.
                          </p>
                        ) : (
                          patrol.scouts.map((scout) => {
                            const scoutApprovals = pendingApprovalsMap[scout.uid]?.total || 0;
                            return (
                              <div
                                key={scout.uid}
                                className="bg-slate-800 border border-slate-700/80 rounded-xl overflow-hidden shadow-sm"
                              >
                                <button
                                  className="w-full flex justify-between items-center px-4 py-3 text-left cursor-pointer hover:bg-slate-750/50 transition"
                                  onClick={() => setExpanded((v) => (v === scout.uid ? null : scout.uid))}
                                >
                                  <div className="flex items-center gap-3">
                                    {scout.photoURL ? (
                                      <img
                                        src={scout.photoURL}
                                        alt="Scout Avatar"
                                        className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 uppercase">
                                        {(scout.fullName || scout.username).charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold text-white text-xs sm:text-sm">
                                        {scout.fullName || scout.username}
                                      </p>
                                      <p className="text-[11px] text-slate-400">
                                        @{scout.username} &bull; <span className="text-emerald-400 font-semibold">{scout.rank || 'Scout'}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2.5 flex-wrap justify-end">
                                    {/* Attendance & Standing Badge */}
                                    {(() => {
                                      const att = getScoutAttendanceStats(scout.uid);
                                      if (att.risk === 'critical') {
                                        return (
                                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/60 flex items-center gap-1 shadow-sm animate-pulse" title="Critical Attendance Risk - 3+ Unexcused Absences">
                                            🚨 {att.unexcused} Absences ({att.rate}% &bull; {att.hours}h)
                                          </span>
                                        );
                                      } else if (att.risk === 'warning') {
                                        return (
                                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1 shadow-sm" title="Attendance Warning - 2 Unexcused Absences">
                                            ⚠️ 2 Absences ({att.rate}% &bull; {att.hours}h)
                                          </span>
                                        );
                                      } else {
                                        return (
                                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1 shadow-sm" title="Certified In Good Standing">
                                            🟢 {att.rate}% ({att.hours}h{att.nights > 0 ? ` &bull; ${att.nights}n` : ''})
                                          </span>
                                        );
                                      }
                                    })()}

                                    {scoutApprovals > 0 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPendingModalScoutId(scout.uid);
                                          setShowPendingModal(true);
                                        }}
                                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 flex items-center gap-1 animate-pulse transition cursor-pointer"
                                        title="Click to review and test this scout's pending submissions"
                                      >
                                        <Clock size={11} /> {scoutApprovals} Needs Review
                                      </button>
                                    )}
                                    <span className="text-slate-400 text-sm">{expanded === scout.uid ? '▲' : '▼'}</span>
                                  </div>
                                </button>

                                {expanded === scout.uid && (
                                  <div className="px-4 pb-4 border-t border-slate-750 pt-3 space-y-3 bg-slate-900/30">
                                    {/* Attendance & Standing Quick Panel */}
                                    {(() => {
                                      const att = getScoutAttendanceStats(scout.uid);
                                      return (
                                        <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                          <div>
                                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Attended</span>
                                            <span className="font-bold text-emerald-400 font-mono text-sm">{att.hours}h</span>
                                            <span className="text-[10px] text-slate-400 block">({att.attended}/{att.total} sessions &bull; {att.rate}%)</span>
                                          </div>
                                          <div>
                                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Camping Nights</span>
                                            <span className="font-bold text-amber-400 font-mono text-sm">{att.nights} Nights</span>
                                            <span className="text-[10px] text-slate-400 block">Overnight campouts</span>
                                          </div>
                                          <div>
                                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Meetings Breakdown</span>
                                            <span className="font-bold text-slate-200 font-mono text-xs block">Friday: {att.fridayHrs}h</span>
                                            <span className="font-bold text-slate-200 font-mono text-xs block">Tuesday: {att.tuesdayHrs}h</span>
                                          </div>
                                          <div>
                                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Standing Status</span>
                                            <span className={`font-bold text-xs block mt-0.5 ${att.risk === 'critical' ? 'text-red-400 font-bold' : att.risk === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                              {att.risk === 'critical' ? `🚨 Critical (${att.unexcused} Absences)` : att.risk === 'warning' ? `⚠️ Warning (2 Absences)` : '🟢 Good Standing'}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-300">
                                      <div>
                                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Personal Email</span>
                                        <span className="font-semibold text-slate-200 truncate block">{scout.scoutEmail || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">Scout Phone</span>
                                        <span className="font-semibold text-slate-200 truncate block">{scout.scoutPhone || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Parent Email</span>
                                        <span className="font-semibold text-slate-200 truncate block">{scout.parentEmail || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Parent Phone</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="font-semibold text-slate-200">{scout.parentPhone || '—'}</span>
                                          {scout.parentPhone && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveWhatsappPhone(scout.parentPhone);
                                                setActiveWhatsappName(`${scout.fullName || scout.username}'s Parent`);
                                              }}
                                              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded p-0.5 transition cursor-pointer flex items-center justify-center shrink-0"
                                              title="Chat with parent on WhatsApp"
                                            >
                                              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                                              </svg>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                      <button
                                        onClick={() => setSelected(scout)}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-950/40"
                                      >
                                        <span>Open Granular Portal & Notes &rarr;</span>
                                      </button>

                                      {scoutApprovals > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPendingModalScoutId(scout.uid);
                                            setShowPendingModal(true);
                                          }}
                                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-950/40"
                                        >
                                          <Clock size={13} />
                                          <span>Conduct Oral Testing & Sign-Off ({scoutApprovals}) &rarr;</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </>
      ) : rosterSubTab === 'leaders' ? (
        <div className="space-y-3">
          {leaders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
              No leaders registered in the organization.
            </div>
          ) : (
            leaders.map((lead) => (
              <div key={lead.uid} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {lead.photoURL ? (
                      <img
                        src={lead.photoURL}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-650 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 uppercase">
                        {(lead.fullName || lead.username).charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white text-sm">{lead.fullName || lead.username}</h4>
                      <p className="text-xs text-slate-400 capitalize">{lead.leaderPosition || lead.role}</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 border-t border-slate-700/60 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 col-span-full">
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Email Address</span>
                      <span className="font-semibold text-slate-200 truncate block max-w-[200px]" title={lead.scoutEmail || lead.email}>
                        {lead.scoutEmail || lead.email || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Phone Number</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-200">{lead.scoutPhone || '—'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Safety Training (SPT)</span>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-semibold text-slate-200">
                          {lead.spt ? `Done: ${lead.spt}` : '—'}
                        </span>
                        {lead.sptFileUrl && (
                          <a
                            href={lead.sptFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
                          >
                            📄 View Cert
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : rosterSubTab === 'parents' ? (
        <div className="space-y-4">
          {parentMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold">
              {parentMsg}
            </div>
          )}

          {/* Create Parent Account Form */}
          {showParentForm && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="border-b border-slate-700 pb-2">
                <h4 className="font-bold text-white text-base">Provision New Parent Account</h4>
                <p className="text-xs text-slate-400">Parents receive read-only access to view their linked children's real-time progress.</p>
              </div>

              {parentErr && (
                <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl">
                  {parentErr}
                </div>
              )}

              <form onSubmit={handleAddParent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent Full Name</label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Fatima Ahmed"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent Email (Login Email)</label>
                    <input
                      type="email"
                      required
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="e.g. parent@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Temporary Password</label>
                    <input
                      type="password"
                      required
                      value={parentPassword}
                      onChange={(e) => setParentPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                    Link Scout Children ({parentLinkedScoutIds.length} selected):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl max-h-48 overflow-y-auto border border-slate-750">
                    {scouts.map((scout) => {
                      const isChecked = parentLinkedScoutIds.includes(scout.uid);
                      return (
                        <label
                          key={scout.uid}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                            isChecked ? 'bg-emerald-950/40 border-emerald-600 text-white font-bold' : 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-750'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setParentLinkedScoutIds(prev => [...prev, scout.uid]);
                              } else {
                                setParentLinkedScoutIds(prev => prev.filter(id => id !== scout.uid));
                              }
                            }}
                            className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate">{scout.fullName || scout.username}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{scout.rank || 'Scout'}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowParentForm(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={parentAdding || parentLinkedScoutIds.length === 0}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    {parentAdding ? 'Provisioning...' : 'Provision Parent Account'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Parents List */}
          <div className="space-y-3">
            {parents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
                No parent accounts registered in the organization. Click "+ Create Parent Account" to register parents.
              </div>
            ) : (
              parents.map((p) => {
                const linkedChildren = scouts.filter(s => {
                  const linkedArr = Array.isArray(p.linkedScoutIds) ? p.linkedScoutIds : [];
                  if (linkedArr.includes(s.uid)) return true;
                  if (Array.isArray(s.parentUids) && s.parentUids.includes(p.uid)) return true;
                  return false;
                });

                return (
                  <div key={p.uid} className="bg-slate-800 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg space-y-3 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg shrink-0">
                          👨‍👩‍👧
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-white text-base">{p.fullName || p.username}</h4>
                            <span className="text-[10px] bg-slate-900 border border-slate-700 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                              Parent Account
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Email: <strong className="text-slate-200">{p.email || '—'}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setEditingParent(p);
                            setEditParentLinkedIds(Array.isArray(p.linkedScoutIds) ? p.linkedScoutIds : linkedChildren.map(c => c.uid));
                            setParentLinkMsg('');
                          }}
                          className="bg-slate-900 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Users size={13} className="text-emerald-400" />
                          <span>Edit Linked Scouts ({linkedChildren.length})</span>
                        </button>

                        <button
                          onClick={() => {
                            setResettingParentUser(p);
                            setNewParentResetPass('');
                            setParentResetMsg('');
                            setParentResetErr('');
                          }}
                          className="bg-slate-900 hover:bg-slate-750 border border-slate-700 text-amber-300 hover:text-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <span>🔑 Reset Password</span>
                        </button>
                      </div>
                    </div>

                    {/* Linked Children Display */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Linked Children ({linkedChildren.length}):
                      </span>
                      {linkedChildren.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No scouts linked to this parent account yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {linkedChildren.map((c) => (
                            <div
                              key={c.uid}
                              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs"
                            >
                              <span className="text-emerald-400 font-bold">⚜️</span>
                              <span className="font-semibold text-white">{c.fullName || c.username}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded-md font-mono">
                                {c.rank || 'Scout'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Edit Linked Scouts Modal */}
          {editingParent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <div>
                    <h3 className="font-black text-white text-base">Edit Linked Scouts</h3>
                    <p className="text-xs text-slate-400">Parent: <strong>{editingParent.fullName || editingParent.username}</strong> ({editingParent.email})</p>
                  </div>
                  <button
                    onClick={() => setEditingParent(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    ✕
                  </button>
                </div>

                {parentLinkMsg && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl font-bold">
                    {parentLinkMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Check Scouts to Link:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl max-h-60 overflow-y-auto border border-slate-755">
                    {scouts.map(s => {
                      const isChecked = editParentLinkedIds.includes(s.uid);
                      return (
                        <label
                          key={s.uid}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                            isChecked ? 'bg-emerald-950/40 border-emerald-600 text-white font-bold' : 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-750'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditParentLinkedIds(prev => [...prev, s.uid]);
                              } else {
                                setEditParentLinkedIds(prev => prev.filter(id => id !== s.uid));
                              }
                            }}
                            className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate">{s.fullName || s.username}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{s.rank || 'Scout'}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-750">
                  <button
                    onClick={() => setEditingParent(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveParentLinks}
                    disabled={savingParentLinks}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    {savingParentLinks ? 'Saving…' : 'Save Linked Scouts'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reset Parent Password Modal */}
          {resettingParentUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <h3 className="font-bold text-white text-base">Reset Parent Password</h3>
                  <button
                    onClick={() => setResettingParentUser(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  Set a new password for <strong>{resettingParentUser.fullName || resettingParentUser.username}</strong> ({resettingParentUser.email}):
                </p>

                {parentResetMsg && (
                  <div className="p-2.5 bg-emerald-950 text-emerald-300 text-xs rounded-xl font-bold">
                    {parentResetMsg}
                  </div>
                )}
                {parentResetErr && (
                  <div className="p-2.5 bg-red-950 text-red-300 text-xs rounded-xl font-bold">
                    {parentResetErr}
                  </div>
                )}

                <div>
                  <input
                    type="password"
                    value={newParentResetPass}
                    onChange={(e) => setNewParentResetPass(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-750">
                  <button
                    onClick={() => setResettingParentUser(null)}
                    className="px-4 py-2 bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetParentPassword}
                    disabled={parentResetLoading || !newParentResetPass.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl"
                  >
                    {parentResetLoading ? 'Updating…' : 'Set New Password'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Universal Pending Queue Modal */}
      {showPendingModal && (
        <UniversalPendingQueueModal
          currentUser={currentUser}
          isOpen={showPendingModal}
          onClose={() => {
            setShowPendingModal(false);
            setPendingModalScoutId(null);
          }}
          targetScoutId={pendingModalScoutId}
        />
      )}

      {/* WhatsApp Template Modal for Patrol */}
      {activeWhatsappPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print-hide">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-left">
            <h3 className="font-bold text-white text-base">Send WhatsApp Message</h3>
            <p className="text-xs text-slate-350">
              Select a template to send to <strong>{activeWhatsappName}</strong> ({activeWhatsappPhone}):
            </p>
            <div className="space-y-2">
              {[
                { label: "General Chat (Blank)", text: "" },
                { 
                  label: "📅 Meeting Reminder", 
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

Operational directive: Attendance reminder for our upcoming Dhulfiqār Scouting Session.

🔗 *Leadership Portal:* https://taliat-app.vercel.app/
📍 *Protocol:* Arrive punctually in full uniform with your Scout Handbook and notebook prepared.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                },
                { 
                  label: "🛡️ Safeguarding Video Reminder", 
                  text: `🛡️ *Assalāmu ʿAlaykum!*

Compliance directive: Complete your mandatory Youth Protection and Safety Training (SPT) video modules.

🔗 *Direct Access:* https://taliat-app.vercel.app/
📌 *Protocol:* Access your Taliʿa Profile, complete the video modules, and confirm verification with leadership.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                },
                { 
                  label: "🕌 Islamic Knowledge Progress Reminder", 
                  text: `🕌 *Assalāmu ʿAlaykum!*

Curriculum review directive: Complete the Twelver Shia Islamic Knowledge modules (Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and Sīrah of Ahl al-Bayt ʿalayhim al-salām).

🔗 *Portal Checklist:* https://taliat-app.vercel.app/
📌 *Protocol:* Complete your unit milestones and prepare for leader oral/written assessment.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                },
                { 
                  label: "⏱️ Service Hours Reminder", 
                  text: `⏱️ *Assalāmu ʿAlaykum!*

Service log directive: Submit your community volunteering and service project hours into the portal.

🔗 *Service Portal:* https://taliat-app.vercel.app/
📌 *Protocol:* Log project title, date, duration, and beneficiary organization for leader verification.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                }
              ].map((tmpl) => {
                const encodedText = encodeURIComponent(tmpl.text);
                const waLink = `https://wa.me/${activeWhatsappPhone.replace(/[^0-9]/g, '')}${tmpl.text ? `?text=${encodedText}` : ''}`;
                return (
                  <a
                    key={tmpl.label}
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveWhatsappPhone(null)}
                    className="block w-full bg-slate-900 border border-slate-750 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition"
                  >
                    {tmpl.label}
                    {tmpl.text && <span className="block text-[10px] text-slate-450 font-normal mt-0.5 truncate">{tmpl.text}</span>}
                  </a>
                );
              })}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-750/50">
              <button
                onClick={() => setActiveWhatsappPhone(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
