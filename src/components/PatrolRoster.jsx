import React, { useState, useEffect, useMemo } from 'react';
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
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import AdvancementTracker from './AdvancementTracker';
import MeritBadgeDashboard from './MeritBadgeDashboard';
import VideoResources from './VideoResources';
import ServiceLogs from './ServiceLogs';
import IslamicBasics from './IslamicBasics';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { RANKS_DATA, getLatestAchievedRank, getNextIncompleteRank, getRankCompletionPercentage, isRankCompleted } from '../data/ranksData';
import { SCOUT_YOUTH_POSITIONS, ADULT_LEADER_POSITIONS } from '../data/rolesData';
import { 
  Printer, 
  ArrowLeft, 
  Save, 
  Award, 
  Star, 
  BookOpen, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  CheckCheck, 
  Bell, 
  Compass, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  Crown, 
  Shield, 
  Copy, 
  Check, 
  Search, 
  Globe, 
  RefreshCw, 
  KeyRound, 
  ExternalLink, 
  Edit3, 
  RotateCcw, 
  Lock, 
  X 
} from 'lucide-react';
import { 
  getKashafGreeting, 
  getLockedClosing, 
  generateScoutInviteMessage, 
  generateParentInviteMessage, 
  generateLeaderInviteMessage 
} from '../utils/kashafVoice';

const BSA_LEADER_POSITIONS = ADULT_LEADER_POSITIONS;

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
  const completedRanksCount = RANKS_DATA.filter(rank => isRankCompleted(rank, ranksProgress)).length;

  const latestAchievedRank = getLatestAchievedRank(ranksProgress, scout.rank);
  const nextTargetRank = getNextIncompleteRank(ranksProgress);
  const activeRank = latestAchievedRank.name;

  const targetStats = getRankCompletionPercentage(nextTargetRank.id, ranksProgress);
  const activePercent = targetStats.percentage;

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

  const handlePrint = () => {
    const originalTitle = document.title;
    const sanitizedName = (scout.fullName || scout.username || 'Scout').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    
    document.title = `${sanitizedName}_Progress_Report_${dateStr}`;
    window.print();
    
    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

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
          onClick={handlePrint}
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
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>@{scout.username}</span> &bull; 
                <span className="text-emerald-400 font-bold">{activeRank}</span> &bull; 
                <span>{scout.patrolId || 'Taliʿa'} Patrol</span>
                {(scout.scoutPosition || scout.position) && (scout.scoutPosition || scout.position) !== 'General Scout / Member' && (
                  <>
                    &bull;
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown size={10} />
                      <span>{scout.scoutPosition || scout.position}</span>
                    </span>
                  </>
                )}
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
            <span className="text-slate-550 block uppercase text-[9px] font-bold text-slate-500">Current Position</span>
            <span className="font-semibold text-amber-300 text-sm flex items-center gap-1 mt-0.5">
              <Crown size={12} className="text-amber-400 shrink-0" />
              <span>{scout.scoutPosition || scout.position || 'General Scout / Member'}</span>
            </span>
          </div>
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

        {/* 📜 Previous Positions (Leadership History) Card */}
        {((Array.isArray(scout.previousPositions) && scout.previousPositions.length > 0) || (Array.isArray(scout.pastPositions) && scout.pastPositions.length > 0)) && (
          <div className="bg-slate-900/50 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <span>📜</span> Previous Scouting Positions (Leadership History)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {(scout.previousPositions || scout.pastPositions).map((prev, idx) => (
                <div key={prev.id || idx} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-semibold text-xs">{prev.position}</strong>
                    {prev.term && <span className="text-[10px] font-mono text-amber-300 font-bold">{prev.term}</span>}
                  </div>
                  {prev.notes && <p className="text-[11px] text-slate-400 italic">{prev.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

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
                Active Rank: <span className="font-semibold text-black">{activeRank}</span> &bull; 
                Position: <span className="font-semibold text-black">{scout.scoutPosition || scout.position || 'General Scout / Member'}</span>
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

        {/* Previous Leadership Positions in Print (if any) */}
        {((Array.isArray(scout.previousPositions) && scout.previousPositions.length > 0) || (Array.isArray(scout.pastPositions) && scout.pastPositions.length > 0)) && (
          <div className="border border-slate-300 p-2.5 rounded text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">Leadership History (Past Positions Held):</span>
            <p className="text-black">
              {(scout.previousPositions || scout.pastPositions).map(p => `${p.position}${p.term ? ` (${p.term})` : ''}${p.notes ? ` - ${p.notes}` : ''}`).join(' • ')}
            </p>
          </div>
        )}

        {/* Print Summary cards */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Advancement & Attendance Summary</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{activeRank}</p>
              <p className="text-[10px] text-slate-500">Current Achieved Rank</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{completedRanksCount} / {RANKS_DATA.length}</p>
              <p className="text-[10px] text-slate-500">Ranks Fully Earned</p>
            </div>
            <div className="border border-slate-300 p-3 rounded text-center">
              <p className="text-xl font-bold text-black">{nextTargetRank.name} ({activePercent}%)</p>
              <p className="text-[10px] text-slate-500">Target Rank in Progress</p>
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
              {(() => {
                const isScoutRecipient = activeWhatsappPhone === scout.scoutPhone;
                const isParentRecipient = activeWhatsappPhone === scout.parentPhone;
                const recipientRole = isScoutRecipient ? 'scout' : (isParentRecipient ? 'parent' : 'parent');
                const recipientName = isScoutRecipient ? (scout.fullName || scout.username) : (scout.fullName ? `${scout.fullName}'s Parents` : 'Parents');
                const patrolName = scout.patrolName || '';
                const greeting = getKashafGreeting(recipientRole, recipientName);
                const closing = getLockedClosing(patrolName);
                const appUrl = 'https://taliat-app.vercel.app/';

                return [
                  {
                    label: "⭐ Scout Portal Login & Profile Setup Invitation",
                    text: generateScoutInviteMessage({
                      name: scout.fullName || scout.username || 'Scout',
                      username: scout.username || scout.email || '',
                      password: scout.tempPassword || scout.username || 'taliat2026',
                      patrolName,
                      appUrl
                    })
                  },
                  {
                    label: "👨‍👩‍👧 Parent Portal Invitation & Family Profile Setup",
                    text: generateParentInviteMessage({
                      name: recipientName,
                      email: scout.parentEmail || scout.username || '',
                      username: scout.parentEmail || scout.username || '',
                      password: scout.tempPassword || 'taliat2026',
                      patrolName,
                      appUrl
                    })
                  },
                  { 
                    label: "📅 Meeting Reminder", 
                    text: `${greeting}

Just a quick note to remind you about our upcoming Dhulfiqār Scouting Session.

🔗 *Portal Link:* ${appUrl}
📍 *Preparation:* Please arrive on time in full uniform with your Scout Handbook and notebook ready.${closing}` 
                  },
                  { 
                    label: "🛡️ Safeguarding Video Reminder", 
                    text: `${greeting}

We wanted to share a quick reminder to complete the mandatory Youth Protection and Safety Training (SPT/YPT) video modules.

🔗 *Portal Link:* ${appUrl}
📌 *Instructions:* Access your profile, complete the video modules, and confirm verification with leadership.${closing}` 
                  },
                  { 
                    label: "🕌 Islamic Knowledge Progress Reminder", 
                    text: `${greeting}

Just a friendly check-in regarding the Islamic Knowledge modules (Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and Sīrah of Ahl al-Bayt ʿa).

🔗 *Checklist Portal:* ${appUrl}
📌 *Instructions:* Review unit milestones and prepare for oral/written leader assessment.${closing}` 
                  },
                  { 
                    label: "⏱️ Service Hours Reminder", 
                    text: `${greeting}

We wanted to remind scouts to log their community service and volunteering hours into the portal.

🔗 *Service Log:* ${appUrl}
📌 *Instructions:* Log the project title, date, duration, and beneficiary for verification.${closing}` 
                  }
                ];
              })().map((tmpl) => {
                const cleanPhone = (activeWhatsappPhone || '').replace(/[^0-9]/g, '');
                const encodedText = encodeURIComponent(tmpl.text || '');
                const waLink = cleanPhone 
                  ? `https://wa.me/${cleanPhone}${tmpl.text ? `?text=${encodedText}` : ''}`
                  : `https://wa.me/?text=${encodedText}`;
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
  const canAddOrDeleteScouts = isExecutive || currentUser?.role === 'leader' || currentUser?.role === 'admin' || isOwner;

  // ── UNIFIED ALL-USERS SUBSCRIPTION STATE ──
  const [rawAllUsers, setRawAllUsers] = useState([]);
  const [directorySearch, setDirectorySearch] = useState('');
  const [copiedUid, setCopiedUid] = useState(null);
  const [updatingUserRole, setUpdatingUserRole] = useState(null);
  const [updatingUserGroup, setUpdatingUserGroup] = useState(null);
  const [quickActionMsg, setQuickActionMsg] = useState('');

  // ── SCOUT EDIT MODAL STATE ──
  const [editingUser, setEditingUser] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editBsaId, setEditBsaId] = useState('');
  const [editScoutEmail, setEditScoutEmail] = useState('');
  const [editScoutPhone, setEditScoutPhone] = useState('');
  const [editParentEmail, setEditParentEmail] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editGroupId, setEditGroupId] = useState('');
  const [editRank, setEditRank] = useState('Scout');
  const [editScoutPosition, setEditScoutPosition] = useState('General Scout / Member');
  const [editPreviousPositions, setEditPreviousPositions] = useState([]);
  const [editRole, setEditRole] = useState('scout');
  const [editLeaderPosition, setEditLeaderPosition] = useState('Assistant Scoutmaster');
  const [userUpdating, setUserUpdating] = useState(false);
  const [editMsg, setEditMsg] = useState('');
  const [editErr, setEditErr] = useState('');

  // ── WHATSAPP SHARE MODAL STATE ──
  const [whatsappUser, setWhatsappUser] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('scout_invite');
  const [whatsappPassword, setWhatsappPassword] = useState('');
  const [whatsappCustomMsg, setWhatsappCustomMsg] = useState('');
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // ── RESET PASSWORD / CREDENTIALS MODAL STATE ──
  const [resettingUser, setResettingUser] = useState(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [resetErr, setResetErr] = useState('');

  // 1. Unified Subscription to Users, Groups, and Attendance
  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setRawAllUsers(allUsers);

      // 1. Leaders
      const leaderList = allUsers.filter(u => {
        const r = (u.role || '').toLowerCase();
        return r === 'leader' || r === 'owner' || r === 'admin' || r === 'scoutmaster' || r === 'assistant_scoutmaster';
      });
      setLeaders(leaderList);

      // 2. Parents
      const parentList = allUsers.filter(u => {
        const r = (u.role || '').toLowerCase();
        return r === 'parent';
      });
      setParents(parentList);

      // 3. Scouts & Registered Members (inclusive of all non-leader/parent accounts)
      let scoutList = allUsers.filter(u => {
        const r = (u.role || '').toLowerCase();
        return r !== 'leader' && r !== 'owner' && r !== 'admin' && r !== 'scoutmaster' && r !== 'assistant_scoutmaster' && r !== 'parent';
      });

      if (!isExecutive) {
        // Regular leaders see assigned scouts + unassigned scouts
        scoutList = scoutList.filter(s => {
          const matchesLeader = s.leaderId === currentUser?.uid;
          const matchesPatrol = currentUser?.groupId && (s.groupId === currentUser?.groupId || s.patrolId === currentUser?.groupId);
          const isUnassigned = !s.groupId && !s.patrolId;
          return matchesLeader || matchesPatrol || isUnassigned;
        });
      }

      setScouts(scoutList);
    }, (err) => {
      console.error("Error listening to users in PatrolRoster:", err);
    });

    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      setAttendanceSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error loading attendance in PatrolRoster:", err));
    
    return () => {
      unsubGroups();
      unsubUsers();
      unsubAttendance();
    };
  }, [currentUser?.uid, currentUser?.groupId, isExecutive]);

  // Ensure non-executive leaders cannot access Global User Directory
  useEffect(() => {
    if (!isExecutive && rosterSubTab === 'all_users') {
      setRosterSubTab('scouts');
    }
  }, [isExecutive, rosterSubTab]);

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
  const totalRanksNeeded = Object.values(pendingApprovalsMap).reduce((sum, item) => sum + (item?.ranks || 0), 0);
  const totalIslamicNeeded = Object.values(pendingApprovalsMap).reduce((sum, item) => sum + (item?.islamic || 0), 0);
  const totalMeritNeeded = Object.values(pendingApprovalsMap).reduce((sum, item) => sum + (item?.merit || 0), 0);
  const totalHwNeeded = Object.values(pendingApprovalsMap).reduce((sum, item) => sum + (item?.assignments || 0), 0);
  const scoutsWithPendingInRoster = scouts.filter(s => (pendingApprovalsMap[s.uid]?.total || 0) > 0);

  const handleCopyUid = (uid, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handleQuickUpdateUserRole = async (targetUid, newRole) => {
    setUpdatingUserRole(targetUid);
    setQuickActionMsg('');
    try {
      await setDoc(doc(db, 'users', targetUid), {
        role: newRole,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setQuickActionMsg(`✓ Role updated to ${newRole}`);
      setTimeout(() => setQuickActionMsg(''), 2500);
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role: " + err.message);
    } finally {
      setUpdatingUserRole(null);
    }
  };

  const handleQuickAssignPatrol = async (targetUid, newGroupId) => {
    setUpdatingUserGroup(targetUid);
    setQuickActionMsg('');
    try {
      await setDoc(doc(db, 'users', targetUid), {
        groupId: newGroupId || null,
        patrolId: newGroupId || null,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setQuickActionMsg(`✓ Patrol assignment updated`);
      setTimeout(() => setQuickActionMsg(''), 2500);
    } catch (err) {
      console.error("Failed to assign patrol:", err);
      alert("Failed to assign patrol: " + err.message);
    } finally {
      setUpdatingUserGroup(null);
    }
  };

  // ── SCOUT EDIT MODAL HANDLERS ──
  const handleOpenEditUser = async (u) => {
    setEditingUser(u);
    setEditFullName(u.fullName || '');
    setEditUsername(u.username || (u.email ? u.email.split('@')[0] : ''));
    setEditPassword('');
    setEditBsaId(u.bsaId || '');
    setEditScoutEmail(u.scoutEmail || u.personalEmail || (u.role === 'scout' ? u.email : '') || '');
    setEditScoutPhone(u.scoutPhone || (u.role === 'scout' ? u.phone : '') || '');
    setEditParentEmail(u.parentEmail || '');
    setEditParentPhone(u.parentPhone || '');
    setEditGroupId(u.groupId || u.patrolId || '');
    setEditRank(u.rank || 'Scout');
    setEditScoutPosition(u.scoutPosition || u.position || 'General Scout / Member');
    setEditPreviousPositions(Array.isArray(u.previousPositions) ? u.previousPositions : Array.isArray(u.pastPositions) ? u.pastPositions : []);
    setEditRole(u.role || 'scout');
    setEditLeaderPosition(u.leaderPosition || 'Assistant Scoutmaster');
    setEditMsg('');
    setEditErr('');

    try {
      const snap = await getDoc(doc(db, 'users', u.uid, 'private', 'secrets'));
      if (snap.exists() && snap.data().password) {
        setEditPassword(snap.data().password);
      }
    } catch (e) {
      console.log('No secrets read access:', e);
    }
  };

  const handleSaveEditUser = async (e) => {
    e?.preventDefault?.();
    if (!editingUser) return;
    setUserUpdating(true);
    setEditErr('');
    setEditMsg('');

    try {
      const updatePayload = {
        fullName: editFullName.trim(),
        role: editRole,
        bsaId: editBsaId.trim() || null,
        scoutEmail: editScoutEmail.trim() || null,
        personalEmail: editScoutEmail.trim() || null,
        scoutPhone: editScoutPhone.trim() || null,
        parentEmail: editParentEmail.trim() || null,
        parentPhone: editParentPhone.trim() || null,
        groupId: editGroupId || null,
        patrolId: editGroupId || null,
        updatedAt: serverTimestamp()
      };

      if (editUsername.trim()) {
        const cleaned = editUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
        updatePayload.username = cleaned;
      }

      if (editRole === 'scout') {
        updatePayload.rank = editRank;
        updatePayload.scoutPosition = editScoutPosition || 'General Scout / Member';
        updatePayload.position = editScoutPosition || 'General Scout / Member';
        updatePayload.previousPositions = editPreviousPositions;
      } else if (editRole === 'leader' || editRole === 'owner' || editRole === 'admin') {
        updatePayload.leaderPosition = editLeaderPosition;
        updatePayload.previousPositions = editPreviousPositions;
      }

      await setDoc(doc(db, 'users', editingUser.uid), updatePayload, { merge: true });

      if (editPassword.trim().length >= 6) {
        await setDoc(doc(db, 'users', editingUser.uid, 'private', 'secrets'), { password: editPassword.trim() }, { merge: true });
      }

      setEditMsg('✓ Scout account updated successfully!');
      setTimeout(() => {
        setEditingUser(null);
      }, 1200);
    } catch (err) {
      console.error("Failed to update user:", err);
      setEditErr("Error updating user: " + err.message);
    } finally {
      setUserUpdating(false);
    }
  };

  // ── SCOUT DELETION HANDLER ──
  const handleDeleteScout = async (u) => {
    if (!window.confirm(`Are you sure you want to delete ${u.fullName || u.username} (${u.email || u.uid})? This action cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'users', u.uid));
      setQuickActionMsg(`✓ Deleted ${u.fullName || u.username}`);
      setTimeout(() => setQuickActionMsg(''), 2500);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user: " + err.message);
    }
  };

  // ── WHATSAPP SHARE MODAL HANDLERS ──
  const handleOpenWhatsAppModal = async (u) => {
    setWhatsappUser(u);
    const phone = u.scoutPhone || u.parentPhone || u.phone || '';
    setWhatsappPhone(phone);
    
    if (u.role === 'leader' || u.role === 'owner') {
      setWhatsappTemplate('leader_invite');
    } else if (u.role === 'parent') {
      setWhatsappTemplate('parent_invite');
    } else {
      setWhatsappTemplate('scout_invite');
    }

    setWhatsappCustomMsg('');
    setWhatsappCopied(false);
    setWhatsappLoading(true);

    let pass = '';
    try {
      const snap = await getDoc(doc(db, 'users', u.uid, 'private', 'secrets'));
      if (snap.exists() && snap.data().password) {
        pass = snap.data().password;
      }
    } catch (e) {
      console.log('No secrets read:', e);
    }
    setWhatsappPassword(pass || 'taliat2026');
    setWhatsappLoading(false);
  };

  const getWhatsAppMessageText = () => {
    if (!whatsappUser) return '';
    const name = whatsappUser.fullName || whatsappUser.username || 'Member';
    const username = whatsappUser.username || (whatsappUser.email ? whatsappUser.email.split('@')[0] : 'username');
    const password = whatsappPassword || 'taliat2026';
    const appUrl = 'https://taliat-app.vercel.app/';
    const uPatrol = groups.find(g => g.id === whatsappUser.groupId || g.id === whatsappUser.patrolId)?.name || '';
    const patrolName = uPatrol;
    const leaderPosition = whatsappUser.leaderPosition || (whatsappUser.role === 'owner' ? 'Troop Headmaster / Lead Admin' : 'Scout Leader');

    if (whatsappTemplate === 'leader_invite') {
      return generateLeaderInviteMessage({
        name,
        username,
        password,
        leaderPosition,
        patrolName,
        appUrl
      });
    }

    if (whatsappTemplate === 'scout_invite') {
      return generateScoutInviteMessage({
        name,
        username,
        password,
        patrolName,
        appUrl
      });
    }

    if (whatsappTemplate === 'parent_invite') {
      return generateParentInviteMessage({
        name,
        email: whatsappUser.email || '',
        username,
        password,
        patrolName,
        appUrl
      });
    }

    let recipientType = 'parent';
    if (whatsappUser.role === 'leader' || whatsappUser.role === 'owner') {
      recipientType = 'leader';
    } else if (whatsappUser.role === 'scout') {
      recipientType = 'scout';
    }
    const greeting = getKashafGreeting(recipientType, name);
    const lockedClosing = getLockedClosing(patrolName);

    if (whatsappTemplate === 'meeting') {
      return `${greeting}

Attendance reminder for our upcoming Dhulfiqār Scouting Session.

🔗 *Leadership Portal:* ${appUrl}
📍 *Protocol:* Arrive punctually in full uniform with your Scout Handbook and notebook prepared.${lockedClosing}`;
    }

    if (whatsappTemplate === 'video') {
      return `${greeting}

Reminder to complete your mandatory Youth Protection and Safety Training (SPT/YPT) video modules.

🔗 *Portal Link:* ${appUrl}
📌 *Instructions:* Access your profile, complete the video modules, and confirm verification with leadership.${lockedClosing}`;
    }

    if (whatsappTemplate === 'islamic') {
      return `${greeting}

Friendly check-in regarding the Islamic Knowledge modules (Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and Sīrah of Ahl al-Bayt ʿa).

🔗 *Checklist Portal:* ${appUrl}
📌 *Instructions:* Review unit milestones and prepare for oral/written leader assessment.${lockedClosing}`;
    }

    if (whatsappTemplate === 'service') {
      return `${greeting}

Reminder to log your community service and volunteering hours into the portal.

🔗 *Service Log:* ${appUrl}
📌 *Instructions:* Log the project title, date, duration, and beneficiary for verification.${lockedClosing}`;
    }

    if (whatsappTemplate === 'custom') {
      const customContent = whatsappCustomMsg.trim();
      return customContent ? `${greeting}\n\n${customContent}${lockedClosing}` : '';
    }

    return '';
  };

  const handleCopyWhatsAppMsg = () => {
    const text = getWhatsAppMessageText();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2500);
    });
  };

  // ── RESET PASSWORD / CREDENTIALS MODAL HANDLERS ──
  const handleOpenResetModal = (u) => {
    setResettingUser(u);
    setResetPasswordVal('');
    setResetMsg('');
    setResetErr('');
  };

  const handleExecuteResetPassword = async (e) => {
    e?.preventDefault?.();
    if (!resettingUser || resetPasswordVal.trim().length < 6) {
      setResetErr('Password must be at least 6 characters.');
      return;
    }
    setResetLoading(true);
    setResetMsg('');
    setResetErr('');
    try {
      await setDoc(doc(db, 'users', resettingUser.uid, 'private', 'secrets'), {
        password: resetPasswordVal.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      setResetMsg('✓ Password updated successfully!');
      setTimeout(() => {
        setResettingUser(null);
      }, 1500);
    } catch (err) {
      setResetErr('Failed to reset password: ' + err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const searchedAllUsers = useMemo(() => {
    if (!directorySearch.trim()) return rawAllUsers;
    const q = directorySearch.toLowerCase().trim();
    return rawAllUsers.filter(u => {
      const name = (u.fullName || '').toLowerCase();
      const username = (u.username || '').toLowerCase();
      const email = (u.email || u.parentEmail || u.scoutEmail || u.personalEmail || '').toLowerCase();
      const phone = (u.scoutPhone || u.parentPhone || u.phone || '').toLowerCase();
      const bsaId = (u.bsaId || '').toLowerCase();
      const uid = (u.uid || '').toLowerCase();
      const role = (u.role || '').toLowerCase();
      const groupName = (groups.find(g => g.id === u.groupId || g.id === u.patrolId)?.name || '').toLowerCase();
      return name.includes(q) || username.includes(q) || email.includes(q) || phone.includes(q) || bsaId.includes(q) || uid.includes(q) || role.includes(q) || groupName.includes(q);
    });
  }, [rawAllUsers, directorySearch, groups]);

  const searchedScouts = useMemo(() => {
    if (!directorySearch.trim()) return scouts;
    const q = directorySearch.toLowerCase().trim();
    return scouts.filter(s => {
      const name = (s.fullName || '').toLowerCase();
      const username = (s.username || '').toLowerCase();
      const email = (s.email || s.parentEmail || s.scoutEmail || s.personalEmail || '').toLowerCase();
      const phone = (s.scoutPhone || s.parentPhone || s.phone || '').toLowerCase();
      const bsaId = (s.bsaId || '').toLowerCase();
      const uid = (s.uid || '').toLowerCase();
      return name.includes(q) || username.includes(q) || email.includes(q) || phone.includes(q) || bsaId.includes(q) || uid.includes(q);
    });
  }, [scouts, directorySearch]);

  const searchedLeaders = useMemo(() => {
    if (!directorySearch.trim()) return leaders;
    const q = directorySearch.toLowerCase().trim();
    return leaders.filter(l => {
      const name = (l.fullName || '').toLowerCase();
      const username = (l.username || '').toLowerCase();
      const email = (l.email || l.personalEmail || '').toLowerCase();
      const phone = (l.scoutPhone || l.phone || '').toLowerCase();
      const uid = (l.uid || '').toLowerCase();
      const pos = (l.leaderPosition || '').toLowerCase();
      return name.includes(q) || username.includes(q) || email.includes(q) || phone.includes(q) || uid.includes(q) || pos.includes(q);
    });
  }, [leaders, directorySearch]);

  const searchedParents = useMemo(() => {
    if (!directorySearch.trim()) return parents;
    const q = directorySearch.toLowerCase().trim();
    return parents.filter(p => {
      const name = (p.fullName || '').toLowerCase();
      const username = (p.username || '').toLowerCase();
      const email = (p.email || p.parentEmail || '').toLowerCase();
      const phone = (p.parentPhone || p.phone || '').toLowerCase();
      const uid = (p.uid || '').toLowerCase();
      return name.includes(q) || username.includes(q) || email.includes(q) || phone.includes(q) || uid.includes(q);
    });
  }, [parents, directorySearch]);

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
    const rawInput = parentEmail.trim().toLowerCase();
    const password = parentPassword;

    if (!name || !rawInput || !password) {
      setParentErr('Please fill in parent name, username / login ID, and temporary password.');
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

    const cleanUsername = rawInput.includes('@') ? rawInput.split('@')[0] : rawInput;
    const authEmail = rawInput.includes('@') ? rawInput : `${rawInput}@talia.app`;

    try {
      let secApp;
      try {
        secApp = getApp('secondary');
      } catch {
        secApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secAuth = getAuth(secApp);
      const cred = await createUserWithEmailAndPassword(secAuth, authEmail, password);
      const newUid = cred.user.uid;
      await secAuth.signOut();

      // Create Parent User Document
      await setDoc(doc(db, 'users', newUid), {
        fullName: name,
        email: authEmail,
        username: cleanUsername,
        parentEmail: rawInput.includes('@') ? rawInput : null,
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

      setParentMsg(`✓ Parent account created for ${name}! Username: ${cleanUsername} · Temporary Password: ${password}`);
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
      const assignedLeaderId = isOwner ? (newLeader || currentUser.uid) : currentUser.uid;
      const myPatrolId = currentUser?.groupId || currentUser?.patrolId;
      const assignedPatrolId = isExecutive ? (newGroup || null) : (myPatrolId || null);

      await setDoc(doc(db, 'users', newUid), {
        fullName: newName.trim(),
        username,
        email,
        role: 'scout',
        leaderId: assignedLeaderId || null,
        groupId: assignedPatrolId,
        patrolId: assignedPatrolId,
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

  const myPatrolId = currentUser?.groupId || currentUser?.patrolId;
  const visibleGroups = isExecutive
    ? groups
    : groups.filter(g => g.id === myPatrolId || g.leaderId === currentUser.uid || (Array.isArray(g.assistantLeaderIds) && g.assistantLeaderIds.includes(currentUser.uid)) || (Array.isArray(g.assignedLeaderIds) && g.assignedLeaderIds.includes(currentUser.uid)));


  const filteredScouts = activeGroupTab === 'all'
    ? searchedScouts
    : searchedScouts.filter(s => s.groupId === activeGroupTab);

  return (
    <div className="space-y-6 print-hide">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-white">Patrol Roster & Directory</h3>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-black uppercase border ${
              isOwner 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {isOwner ? '👑 Owner Superadmin' : `⚜️ ${currentUser.leaderPosition || 'Troop Leader'}`}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {rosterSubTab === 'scouts' 
              ? `${searchedScouts.length} scout${searchedScouts.length !== 1 ? 's' : ''} in roster`
              : rosterSubTab === 'leaders'
              ? `${searchedLeaders.length} leader${searchedLeaders.length !== 1 ? 's' : ''} in troop`
              : rosterSubTab === 'parents'
              ? `${searchedParents.length} parent account${searchedParents.length !== 1 ? 's' : ''} registered`
              : isExecutive
              ? `${searchedAllUsers.length} total Firebase account${searchedAllUsers.length !== 1 ? 's' : ''} indexed`
              : `${searchedScouts.length} scout${searchedScouts.length !== 1 ? 's' : ''} in roster`}
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

      {/* ── SEARCH BAR & FEEDBACK BANNER ── */}
      <div className="space-y-2">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={directorySearch}
            onChange={(e) => setDirectorySearch(e.target.value)}
            placeholder="Search directory by name, @username, BSA ID, email, phone, or User ID (e.g. 5Ib8dwcwB0ZbsCEX8oIYGgvWFIf2)..."
            className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-450 focus:outline-none shadow-inner transition"
          />
          {directorySearch && (
            <button
              type="button"
              onClick={() => setDirectorySearch('')}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {quickActionMsg && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 shadow animate-fade-in">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{quickActionMsg}</span>
          </div>
        )}
      </div>

      {/* ── SLEEK ACTIONABLE NOTIFICATION & TESTING CENTER ── */}
      {totalApprovalsNeeded > 0 && (
        <div className="bg-slate-850/90 border border-amber-500/50 rounded-2xl p-5 shadow-xl space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-sm">
                <Clock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    Pending Submissions & Oral Testing ({totalApprovalsNeeded})
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {scoutsWithPendingInRoster.length} scout{scoutsWithPendingInRoster.length !== 1 ? 's' : ''} in your roster awaiting leader verification and oral sign-off.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPendingModalScoutId(null);
                setShowPendingModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 self-start sm:self-auto shrink-0"
            >
              <CheckCheck size={14} />
              <span>Open Testing Queue & Batch Sign-off &rarr;</span>
            </button>
          </div>

          {/* Breakdown Pills: Domains & Scouts */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            {/* Category Breakdown Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-0.5">Awaiting:</span>
              {totalRanksNeeded > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-emerald-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  ⚜️ {totalRanksNeeded} Rank Reqs
                </span>
              )}
              {totalIslamicNeeded > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-teal-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  🕌 {totalIslamicNeeded} Islamic Tests
                </span>
              )}
              {totalHwNeeded > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-sky-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  🎒 {totalHwNeeded} Homework
                </span>
              )}
              {totalMeritNeeded > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-amber-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  🏅 {totalMeritNeeded} Badges
                </span>
              )}
            </div>

            {/* Scout Direct Jump Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-0.5">Scouts:</span>
              {scoutsWithPendingInRoster.slice(0, 6).map(s => (
                <button
                  key={s.uid}
                  type="button"
                  onClick={() => {
                    setPendingModalScoutId(s.uid);
                    setShowPendingModal(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Click to review this scout's queue directly"
                >
                  <span>{s.fullName?.split(' ')[0] || s.username}</span>
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {pendingApprovalsMap[s.uid]?.total || 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Directory Sub-tabs */}
      <div className="flex gap-2 sm:gap-4 border-b border-slate-700/60 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setRosterSubTab('scouts')}
          className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
            rosterSubTab === 'scouts' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>⚜️ Scouts Roster ({searchedScouts.length})</span>
          {totalApprovalsNeeded > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-slate-950 animate-pulse">
              {totalApprovalsNeeded}
            </span>
          )}
        </button>
        <button
          onClick={() => setRosterSubTab('leaders')}
          className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
            rosterSubTab === 'leaders' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🎖️ Leaders Directory ({searchedLeaders.length})
        </button>
        <button
          onClick={() => setRosterSubTab('parents')}
          className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            rosterSubTab === 'parents' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>👨‍👩‍👧 Parents Directory</span>
          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-800 text-emerald-300 border border-slate-700">
            {searchedParents.length}
          </span>
        </button>

        {isExecutive && (
          <button
            onClick={() => setRosterSubTab('all_users')}
            className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              rosterSubTab === 'all_users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌐 Global User Directory</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-mono">
              {searchedAllUsers.length}
            </span>
          </button>
        )}
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
                  {isExecutive ? (
                    <select
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">No Patrol (Unassigned)</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name} Patrol</option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between">
                      <span className="font-bold text-emerald-400">
                        🛡️ {groups.find(g => g.id === myPatrolId)?.name || 'Your Patrol'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">🔒 Locked to your assigned patrol</span>
                    </div>
                  )}
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
                {searchedScouts.length}
              </span>
            </button>
            {visibleGroups.map((g) => {
              const groupScouts = searchedScouts.filter(s => s.groupId === g.id);
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
                const groupScouts = searchedScouts.filter(s => s.groupId === g.id);
                const groupApprovals = groupScouts.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
                patrolSections.push({
                  id: g.id,
                  name: g.name,
                  description: g.description || 'Active Troop Patrol',
                  leaderId: g.leaderId,
                  assistantLeaderIds: g.assistantLeaderIds || [],
                  assignedLeaderIds: g.assignedLeaderIds || [],
                  photoURL: g.photoURL || null,
                  motto: g.motto || null,
                  scouts: groupScouts,
                  approvals: groupApprovals
                });
              });
              const unassigned = searchedScouts.filter(s => !s.groupId || !visibleGroups.some(g => g.id === s.groupId));
              if (unassigned.length > 0) {
                const unassignedApprovals = unassigned.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
                patrolSections.push({
                  id: 'unassigned',
                  name: 'Unassigned Scouts',
                  description: 'Scouts pending assignment to a specific patrol',
                  leaderId: null,
                  assistantLeaderIds: [],
                  assignedLeaderIds: [],
                  photoURL: null,
                  motto: null,
                  scouts: unassigned,
                  approvals: unassignedApprovals
                });
              }
            } else {
              const selectedGroup = visibleGroups.find(g => g.id === activeGroupTab);
              const groupScouts = searchedScouts.filter(s => s.groupId === activeGroupTab);
              const groupApprovals = groupScouts.reduce((sum, s) => sum + (pendingApprovalsMap[s.uid]?.total || 0), 0);
              patrolSections.push({
                id: activeGroupTab,
                name: selectedGroup ? selectedGroup.name : 'Selected Patrol',
                description: selectedGroup?.description || 'Active Troop Patrol',
                leaderId: selectedGroup?.leaderId,
                assistantLeaderIds: selectedGroup?.assistantLeaderIds || [],
                assignedLeaderIds: selectedGroup?.assignedLeaderIds || [],
                photoURL: selectedGroup?.photoURL || null,
                motto: selectedGroup?.motto || null,
                scouts: groupScouts,
                approvals: groupApprovals
              });
            }

            if (patrolSections.length === 0 || searchedScouts.length === 0) {
              return (
                <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
                  {directorySearch ? `No scouts found matching "${directorySearch}".` : 'No scouts found. Click "+ Add Scout" to register troop members.'}
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {patrolSections.map((patrol) => {
                  const assignedLeader = leaders.find(l => l.uid === patrol.leaderId || (l.groupId === patrol.id && l.leaderPosition !== 'Assistant Leader' && l.leaderPosition !== 'Assistant Scoutmaster'));
                  const assistantLeaders = leaders.filter(l => {
                    if (l.uid === (patrol.leaderId || assignedLeader?.uid)) return false;
                    if (Array.isArray(patrol.assistantLeaderIds) && patrol.assistantLeaderIds.includes(l.uid)) return true;
                    if (Array.isArray(patrol.assignedLeaderIds) && patrol.assignedLeaderIds.includes(l.uid)) return true;
                    if (l.groupId === patrol.id || l.patrolId === patrol.id) return true;
                    return false;
                  });

                  return (
                    <div
                      key={patrol.id}
                      className="bg-slate-850/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4"
                    >
                      {/* Patrol Header Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-lg shrink-0 overflow-hidden shadow-md">
                            {patrol.photoURL ? (
                              <img src={patrol.photoURL} alt={patrol.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>🛡️</span>
                            )}
                          </div>
                          <div className="space-y-1 min-w-0">
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
                              {patrol.motto && (
                                <span className="text-xs text-slate-400 italic">
                                  &bull; &ldquo;{patrol.motto}&rdquo;
                                </span>
                              )}
                            </div>

                            {/* Leadership info row */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {assignedLeader ? (
                                <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-750 px-2 py-0.5 rounded-lg">
                                  <Crown size={12} className="text-amber-400 shrink-0" />
                                  <span className="text-slate-400 text-[10px]">Leader:</span>
                                  <strong className="text-slate-200">{assignedLeader.fullName || assignedLeader.username}</strong>
                                  {assignedLeader.leaderPosition && (
                                    <span className="text-[9px] text-emerald-400 font-mono">({assignedLeader.leaderPosition})</span>
                                  )}
                                </div>
                              ) : patrol.id !== 'unassigned' ? (
                                <span className="text-slate-500 italic text-[11px]">No Leader Assigned</span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">{patrol.description}</span>
                              )}

                              {assistantLeaders.length > 0 && (
                                <div className="inline-flex flex-wrap items-center gap-1 bg-slate-900 border border-slate-750 px-2 py-0.5 rounded-lg">
                                  <Shield size={12} className="text-emerald-400 shrink-0" />
                                  <span className="text-slate-400 text-[10px]">Assistants:</span>
                                  {assistantLeaders.map(al => (
                                    <span key={al.uid} className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 px-1.5 py-0.2 rounded font-medium">
                                      <span className="font-bold">{al.fullName || al.username}</span>
                                      {al.leaderPosition && (
                                        <span className="text-[9px] text-emerald-300/80 font-mono">({al.leaderPosition})</span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
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
                                      <p className="font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                                        <span>{scout.fullName || scout.username}</span>
                                        {(scout.scoutPosition || scout.position) && (scout.scoutPosition || scout.position) !== 'General Scout / Member' && (
                                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                            <Crown size={9} />
                                            <span>{scout.scoutPosition || scout.position}</span>
                                          </span>
                                        )}
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

                                    {/* ── SCOUT QUICK ACTIONS CLUSTER ── */}
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenEditUser(scout);
                                        }}
                                        className="p-1.5 bg-slate-900/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
                                        title="Edit Scout Account"
                                      >
                                        <Edit3 size={13} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenWhatsAppModal(scout);
                                        }}
                                        className="p-1.5 bg-slate-900/90 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
                                        title="Share Message via WhatsApp"
                                      >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                                        </svg>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenResetModal(scout);
                                        }}
                                        className="p-1.5 bg-slate-900/90 hover:bg-amber-950 text-amber-400 hover:text-amber-200 rounded-lg border border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                                        title="Reset Password / Credentials"
                                      >
                                        <RotateCcw size={13} />
                                      </button>

                                      {canAddOrDeleteScouts && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteScout(scout);
                                          }}
                                          className="p-1.5 bg-slate-900/90 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-red-500/50 transition cursor-pointer"
                                          title="Delete Scout Account"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      )}
                                    </div>

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
        <div className="space-y-6">
          {(() => {
            const execLeaders = searchedLeaders.filter(l => l.role === 'owner' || l.leaderPosition === 'Scoutmaster' || l.leaderPosition === 'Assistant Scoutmaster' || l.role === 'admin');
            const unitLeaders = searchedLeaders.filter(l => l.role !== 'owner' && l.leaderPosition !== 'Scoutmaster' && l.leaderPosition !== 'Assistant Scoutmaster' && l.role !== 'admin');

            return (
              <>
                {/* 1. Troop Executive Leadership Column / Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <div className="flex items-center gap-2">
                      <Crown size={16} className="text-amber-400" />
                      <h4 className="font-extrabold text-white text-sm">Troop Executive Leadership ({execLeaders.length})</h4>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                      Troop-Wide Rights (All Patrols)
                    </span>
                  </div>

                  {execLeaders.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-3">
                      {directorySearch ? `No executive leaders found matching "${directorySearch}".` : 'No Scoutmasters registered.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {execLeaders.map((lead) => {
                        const isSuperOwner = lead.role === 'owner' || lead.email === 'neoissa@gmail.com';
                        return (
                          <div key={lead.uid} className="bg-slate-800/90 border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-lg p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {lead.photoURL ? (
                                  <img src={lead.photoURL} alt="Avatar" className="w-11 h-11 rounded-full object-cover border border-amber-500/60 shrink-0 shadow-md" />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-300 text-sm shrink-0">
                                    {(lead.fullName || lead.username).charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="font-bold text-white text-sm truncate">{lead.fullName || lead.username}</h4>
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 mt-0.5">
                                    {isSuperOwner ? '👑 Troop Owner' : `⚜️ ${lead.leaderPosition || 'Scoutmaster'}`}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-lg shrink-0">
                                  All Patrols
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(lead)}
                                  className="p-1 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
                                  title="Edit Leader Account"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenWhatsAppModal(lead)}
                                  className="p-1 bg-slate-900 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
                                  title="Share Message via WhatsApp"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenResetModal(lead)}
                                  className="p-1 bg-slate-900 hover:bg-amber-950 text-amber-400 hover:text-amber-200 rounded-lg border border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                                  title="Reset Password"
                                >
                                  <RotateCcw size={13} />
                                </button>
                                {isOwner && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteScout(lead)}
                                    className="p-1 bg-slate-900 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-red-500/50 transition cursor-pointer"
                                    title="Delete Leader Account"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/60">
                              <div>
                                <span className="text-slate-400 block uppercase text-[9px] font-bold">Username</span>
                                <span className="font-mono font-semibold text-slate-200 text-[11px]">@{lead.username || lead.email?.split('@')[0]}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase text-[9px] font-bold">Safety (SPT)</span>
                                <span className={`text-[11px] font-bold inline-flex items-center gap-1 ${(lead.spt || lead.sptDate || lead.sptFileUrl || lead.yptCompleted) ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {(lead.spt || lead.sptDate) ? `✓ ${lead.spt || lead.sptDate}` : ((lead.sptFileUrl || lead.yptCompleted) ? '✓ Certified' : 'Pending')}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-400 block uppercase text-[9px] font-bold">Contact</span>
                                <span className="text-slate-300 text-[11px] truncate block">{lead.scoutPhone || lead.personalEmail || lead.email || '—'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Patrol Unit Staff & Leaders Column / Section */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-emerald-400" />
                      <h4 className="font-extrabold text-white text-sm">Patrol Leaders & Unit Staff ({unitLeaders.length})</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                      Patrol Scoped Rights
                    </span>
                  </div>

                  {unitLeaders.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-3">No patrol unit leaders registered.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unitLeaders.map((lead) => {
                        const leadPatrol = groups.find(g => g.id === lead.groupId || g.id === lead.patrolId);
                        return (
                          <div key={lead.uid} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {lead.photoURL ? (
                                  <img src={lead.photoURL} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-650 shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 uppercase">
                                    {(lead.fullName || lead.username).charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="font-bold text-white text-sm truncate">{lead.fullName || lead.username}</h4>
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 mt-0.5">
                                    🛡️ {lead.leaderPosition || 'Patrol Leader'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {leadPatrol ? (
                                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-xl shrink-0">
                                    👥 {leadPatrol.name}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic shrink-0">Unassigned</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(lead)}
                                  className="p-1 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
                                  title="Edit Leader Account"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenWhatsAppModal(lead)}
                                  className="p-1 bg-slate-900 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
                                  title="Share Message via WhatsApp"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenResetModal(lead)}
                                  className="p-1 bg-slate-900 hover:bg-amber-950 text-amber-400 hover:text-amber-200 rounded-lg border border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                                  title="Reset Password"
                                >
                                  <RotateCcw size={13} />
                                </button>
                                {isOwner && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteScout(lead)}
                                    className="p-1 bg-slate-900 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-red-500/50 transition cursor-pointer"
                                    title="Delete Leader Account"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/60">
                              <div>
                                <span className="text-slate-400 block uppercase text-[9px] font-bold">Username</span>
                                <span className="font-mono font-semibold text-slate-200 text-[11px]">@{lead.username || lead.email?.split('@')[0]}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase text-[9px] font-bold">Safety (SPT)</span>
                                <span className={`text-[11px] font-bold inline-flex items-center gap-1 ${(lead.spt || lead.sptDate || lead.sptFileUrl || lead.yptCompleted) ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {(lead.spt || lead.sptDate) ? `✓ ${lead.spt || lead.sptDate}` : ((lead.sptFileUrl || lead.yptCompleted) ? '✓ Certified' : 'Pending')}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-400 block uppercase text-[9px] font-bold">Contact</span>
                                <span className="text-slate-300 text-[11px] truncate block">{lead.scoutPhone || lead.personalEmail || lead.email || '—'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
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
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent Username / Login ID *</label>
                    <input
                      type="text"
                      required
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value.toLowerCase().replace(/[^a-z0-9._@-]/g, ''))}
                      placeholder="e.g. fatima.ahmed (no email required)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Parents can log in with just their username.</p>
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
            {searchedParents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
                {directorySearch ? `No parent accounts found matching "${directorySearch}".` : 'No parent accounts registered in the organization. Click "+ Create Parent Account" to register parents.'}
              </div>
            ) : (
              searchedParents.map((p) => {
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
                          onClick={() => handleOpenWhatsAppModal(p)}
                          className="bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                          title="Share Message via WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>

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

                        <button
                          onClick={() => handleOpenEditUser(p)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                          title="Edit Parent Account Details"
                        >
                          <Edit3 size={13} />
                        </button>

                        {canAddOrDeleteScouts && (
                          <button
                            onClick={() => handleDeleteScout(p)}
                            className="p-1.5 bg-slate-900 hover:bg-red-600/80 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                            title="Delete Parent Account"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
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
      ) : (rosterSubTab === 'all_users' && isExecutive) ? (
        <div className="space-y-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm sm:text-base">
                  Troop-Wide Firebase User Directory ({rawAllUsers.length})
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete real-time index of every registered Firestore profile. Manage roles, patrol assignments, and inspect User IDs (UIDs).
                </p>
              </div>
            </div>
            {quickActionMsg && (
              <div className="bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl shadow">
                {quickActionMsg}
              </div>
            )}
          </div>

          {searchedAllUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm bg-slate-800/40 rounded-2xl border border-slate-800">
              No users matching "{directorySearch}". Try searching by a different name, email, phone, or User ID.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchedAllUsers.map((u) => {
                const userPatrol = groups.find(g => g.id === u.groupId || g.id === u.patrolId);
                const roleLower = (u.role || '').toLowerCase();
                const isScoutUser = roleLower === 'scout' || (!u.role && !['leader', 'admin', 'owner', 'parent'].includes(roleLower));
                const isLeaderUser = ['leader', 'scoutmaster', 'assistant_scoutmaster'].includes(roleLower);
                const isParentUser = roleLower === 'parent';
                const isExecUser = ['owner', 'admin'].includes(roleLower) || u.email === 'neoissa@gmail.com';

                let roleBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                let roleLabel = u.role || 'Unassigned';
                if (isExecUser) {
                  roleBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                  roleLabel = u.role === 'owner' ? '👑 Owner' : '⚙️ Admin';
                } else if (isLeaderUser) {
                  roleBadgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
                  roleLabel = `⚜️ ${u.leaderPosition || 'Leader'}`;
                } else if (isParentUser) {
                  roleBadgeColor = 'bg-purple-950 text-purple-300 border-purple-700/60';
                  roleLabel = '👨‍👩‍👧 Parent';
                } else if (isScoutUser) {
                  roleBadgeColor = 'bg-sky-950 text-sky-300 border-sky-700/60';
                  roleLabel = `🏕️ Scout (${u.rank || 'Scout'})`;
                }

                return (
                  <div
                    key={u.uid}
                    className="bg-slate-800/90 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 shadow-md space-y-3 transition"
                  >
                    {/* Top Row: User Avatar, Name, Role, and UID */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm uppercase shrink-0 border ${
                            isExecUser ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            isLeaderUser ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' :
                            isParentUser ? 'bg-purple-950 text-purple-300 border-purple-700/60' :
                            'bg-sky-950 text-sky-300 border-sky-700/60'
                          }`}>
                            {(u.fullName || u.username || 'U').charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">
                            {u.fullName || u.username || 'Unnamed User'}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            @{u.username || (u.email ? u.email.split('@')[0] : 'no-user')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${roleBadgeColor}`}>
                          {roleLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
                          title="Edit Account Details"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppModal(u)}
                          className="p-1 bg-slate-900 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
                          title="Share Message via WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenResetModal(u)}
                          className="p-1 bg-slate-900 hover:bg-amber-950 text-amber-400 hover:text-amber-200 rounded-lg border border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                          title="Reset Password"
                        >
                          <RotateCcw size={13} />
                        </button>
                        {canAddOrDeleteScouts && (
                          <button
                            type="button"
                            onClick={() => handleDeleteScout(u)}
                            className="p-1 bg-slate-900 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-red-500/50 transition cursor-pointer"
                            title="Delete User Account"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* UID Chip with Copy */}
                    <div className="bg-slate-900 border border-slate-750/80 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">User ID (Firebase UID)</span>
                        <span className="text-[11px] font-mono text-slate-300 truncate block select-all">
                          {u.uid}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopyUid(u.uid, e)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                          copiedUid === u.uid
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title="Copy UID to clipboard"
                      >
                        {copiedUid === u.uid ? (
                          <>
                            <Check size={11} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy UID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Contact info grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-750/60">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Email</span>
                        <span className="text-[11px] text-slate-300 truncate block font-mono">
                          {u.email || u.scoutEmail || u.personalEmail || u.parentEmail || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Phone</span>
                        <span className="text-[11px] text-slate-300 truncate block">
                          {u.scoutPhone || u.parentPhone || u.phone || '—'}
                        </span>
                      </div>
                      {u.bsaId && (
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">BSA Member ID</span>
                          <span className="text-[11px] text-emerald-400 font-mono block">
                            #{u.bsaId}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Current Patrol</span>
                        <span className="text-[11px] text-slate-200 font-semibold block">
                          {userPatrol ? `🛡️ ${userPatrol.name}` : <span className="text-slate-500 italic">Unassigned</span>}
                        </span>
                      </div>
                    </div>

                    {/* Quick Management Actions (Role, Patrol, Profile) */}
                    {isExecutive && (
                      <div className="pt-2 border-t border-slate-750/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Update Role</label>
                          <select
                            value={u.role || 'scout'}
                            disabled={updatingUserRole === u.uid}
                            onChange={(e) => handleQuickUpdateUserRole(u.uid, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="scout">Scout</option>
                            <option value="leader">Leader</option>
                            <option value="parent">Parent</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Assign Patrol</label>
                          <select
                            value={u.groupId || u.patrolId || ''}
                            disabled={updatingUserGroup === u.uid}
                            onChange={(e) => handleQuickAssignPatrol(u.uid, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="">No Patrol (Unassigned)</option>
                            {groups.map(g => (
                              <option key={g.id} value={g.id}>{g.name} Patrol</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {isScoutUser && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setSelected(u)}
                          className="w-full bg-slate-750 hover:bg-slate-700 text-emerald-300 hover:text-white text-xs font-semibold py-1.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink size={12} />
                          <span>Open Scout Advancement & Notes &rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* ── 1. SCOUT / USER EDIT MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`bg-slate-900 border-2 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isOwner ? 'border-amber-500/60 shadow-amber-950/50' : 'border-emerald-500/50'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                {isOwner ? <Crown size={18} className="text-amber-400" /> : <Edit3 size={18} className="text-emerald-400" />}
                <span>Edit User: {editingUser.fullName || editingUser.username}</span>
                {isOwner && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-black">
                    👑 OWNER EDIT
                  </span>
                )}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {editErr && <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-600">{editErr}</p>}
            {editMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{editMsg}</p>}

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`block text-xs font-bold uppercase flex items-center gap-1 ${
                      isOwner ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {isOwner ? <Crown size={12} className="text-amber-400" /> : <Lock size={12} className="text-slate-500" />}
                      <span>Username</span>
                    </label>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                      isOwner 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {isOwner ? '👑 Editable' : '🔒 Locked'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    disabled={!isOwner}
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                    className={`w-full rounded-xl px-4 py-2 text-xs font-mono transition ${
                      isOwner 
                        ? 'bg-slate-950 border-2 border-amber-500/60 focus:border-amber-400 text-amber-200 focus:outline-none' 
                        : 'bg-slate-950/60 border border-slate-800 text-slate-500 cursor-not-allowed select-none'
                    }`}
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Role Elevation</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="scout">Scout</option>
                    <option value="parent">Parent</option>
                    <option value="leader">Leader</option>
                    <option value="admin">Admin</option>
                    {isOwner && <option value="owner">Troop Owner</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    {editRole === 'parent' ? 'Patrol Affiliation' : 'Patrol Assignment'}
                  </label>
                  {editRole === 'parent' ? (
                    <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 italic flex items-center gap-1.5">
                      <span>👨‍👩‍👧</span>
                      <span>Not Applicable (Linked to Children)</span>
                    </div>
                  ) : (
                    <select
                      value={editGroupId}
                      onChange={(e) => setEditGroupId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">Unassigned (No Patrol)</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name} Patrol</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {editRole === 'scout' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Current Rank</label>
                      <select
                        value={editRank}
                        onChange={(e) => setEditRank(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Scout">Scout</option>
                        <option value="Tenderfoot">Tenderfoot</option>
                        <option value="Second Class">Second Class</option>
                        <option value="First Class">First Class</option>
                        <option value="Star">Star</option>
                        <option value="Life">Life</option>
                        <option value="Eagle Scout">Eagle Scout</option>
                        <option value="Arrow of Light">Arrow of Light</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1 flex items-center gap-1">
                        <Crown size={12} className="text-amber-400" />
                        <span>Current Position</span>
                      </label>
                      <select
                        value={editScoutPosition}
                        onChange={(e) => setEditScoutPosition(e.target.value)}
                        className="w-full bg-slate-950 border-2 border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        {SCOUT_YOUTH_POSITIONS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">BSA ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 13579246"
                        value={editBsaId}
                        onChange={(e) => setEditBsaId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* 📜 Previous Scouting Positions Manager (For Scouts) */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                          <span>📜</span> Previous Positions (Leadership History)
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Log past youth leadership positions held in the troop.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPreviousPositions([
                            ...editPreviousPositions,
                            {
                              id: `prev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                              position: 'Assistant Patrol Leader (APL)',
                              term: '',
                              notes: ''
                            }
                          ]);
                        }}
                        className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <Plus size={12} />
                        <span>Add Previous Position</span>
                      </button>
                    </div>

                    {editPreviousPositions.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-2.5 bg-slate-900/60 rounded-xl border border-slate-850 text-center">
                        No previous positions recorded yet. Click &quot;Add Previous Position&quot; to log past terms.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {editPreviousPositions.map((item, idx) => (
                          <div key={item.id || idx} className="bg-slate-900 border border-slate-750 p-2.5 rounded-xl space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                                Past Position #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditPreviousPositions(editPreviousPositions.filter((_, i) => i !== idx));
                                }}
                                className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/40 transition cursor-pointer"
                                title="Remove position"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Position</label>
                                <select
                                  value={item.position || 'General Scout / Member'}
                                  onChange={(e) => {
                                    const next = [...editPreviousPositions];
                                    next[idx] = { ...next[idx], position: e.target.value };
                                    setEditPreviousPositions(next);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                                >
                                  {SCOUT_YOUTH_POSITIONS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Term</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 2024–2025"
                                  value={item.term || ''}
                                  onChange={(e) => {
                                    const next = [...editPreviousPositions];
                                    next[idx] = { ...next[idx], term: e.target.value };
                                    setEditPreviousPositions(next);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Notes / Patrol</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Patrol 1"
                                  value={item.notes || ''}
                                  onChange={(e) => {
                                    const next = [...editPreviousPositions];
                                    next[idx] = { ...next[idx], notes: e.target.value };
                                    setEditPreviousPositions(next);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {editRole === 'leader' && (
                <div className="space-y-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Leader Position</label>
                      <select
                        value={editLeaderPosition}
                        onChange={(e) => setEditLeaderPosition(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {ADULT_LEADER_POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">BSA ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 13579246"
                        value={editBsaId}
                        onChange={(e) => setEditBsaId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* 📜 Previous Adult Leadership Roles Manager */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                          <span>📜</span> Previous Leadership Roles (Leadership History)
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Record past adult leadership roles in the troop.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPreviousPositions([
                            ...editPreviousPositions,
                            {
                              id: `prev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                              position: 'Assistant Scoutmaster',
                              term: '',
                              notes: ''
                            }
                          ]);
                        }}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <Plus size={12} />
                        <span>Add Previous Role</span>
                      </button>
                    </div>

                    {editPreviousPositions.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 text-center">
                        No previous leadership roles recorded yet. Click &quot;Add Previous Role&quot; to log past terms.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {editPreviousPositions.map((item, idx) => (
                          <div key={item.id || idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">
                                Past Role #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditPreviousPositions(editPreviousPositions.filter((_, i) => i !== idx));
                                }}
                                className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/40 transition cursor-pointer"
                                title="Remove role"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Role</label>
                                <select
                                  value={item.position || 'Assistant Scoutmaster'}
                                  onChange={(e) => {
                                    const next = [...editPreviousPositions];
                                    next[idx] = { ...next[idx], position: e.target.value };
                                    setEditPreviousPositions(next);
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                  {ADULT_LEADER_POSITIONS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Term</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 2022–2024"
                                  value={item.term || ''}
                                  onChange={(e) => {
                                    const next = [...editPreviousPositions];
                                    next[idx] = { ...next[idx], term: e.target.value };
                                    setEditPreviousPositions(next);
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Notes</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Unit Advisor"
                                  value={item.notes || ''}
                                  onChange={(e) => {
                                    const next = [...editPreviousPositions];
                                    next[idx] = { ...next[idx], notes: e.target.value };
                                    setEditPreviousPositions(next);
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Scout Email</label>
                    <input
                      type="email"
                      placeholder="scout@example.com"
                      value={editScoutEmail}
                      onChange={(e) => setEditScoutEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Scout Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. (313) 555-0199"
                      value={editScoutPhone}
                      onChange={(e) => setEditScoutPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Parent Email</label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={editParentEmail}
                      onChange={(e) => setEditParentEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Parent Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. (313) 555-0188"
                      value={editParentPhone}
                      onChange={(e) => setEditParentPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave empty to keep existing password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={userUpdating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={15} />
                  <span>{userUpdating ? 'Saving Changes...' : 'Save User Updates'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. WHATSAPP SHARE MODAL ── */}
      {whatsappUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-white text-base">Send WhatsApp Message</h3>
              </div>
              <button
                onClick={() => setWhatsappUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Target User Info & Editable Phone Number */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white block font-bold">{whatsappUser.fullName || whatsappUser.username}</strong>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      whatsappUser.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      whatsappUser.role === 'leader' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      whatsappUser.role === 'parent' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {whatsappUser.role || 'scout'}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5 space-x-2">
                    <span>User: <strong className="text-slate-200">{whatsappUser.username || (whatsappUser.email ? whatsappUser.email.split('@')[0] : '')}</strong></span>
                    {whatsappUser.leaderPosition && <span>• Pos: <strong className="text-emerald-300">{whatsappUser.leaderPosition}</strong></span>}
                    {groups.find(g => g.id === whatsappUser.groupId || g.id === whatsappUser.patrolId)?.name && (
                      <span>• Patrol: <strong className="text-slate-300">{groups.find(g => g.id === whatsappUser.groupId || g.id === whatsappUser.patrolId)?.name}</strong></span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-slate-800 text-teal-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono font-bold block">
                    Pass: {whatsappPassword || 'taliat2026'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Recipient WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 13135551234 or +13135551234"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Template Selector Pills */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Message Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('scout_invite')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'scout_invite'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>⚜️ Scout Login & Setup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('leader_invite')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'leader_invite'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🛡️ Leader Onboarding</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('parent_invite')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'parent_invite'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>👨‍👩‍👧 Parent Invite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('meeting')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'meeting'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>📅 Meeting Reminder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('video')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'video'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🛡️ Safety SPT/YPT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('islamic')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'islamic'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🕌 Islamic Knowledge</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('service')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'service'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>⏱️ Service Hours</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('custom')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 col-span-2 sm:col-span-1 ${
                    whatsappTemplate === 'custom'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>✏️ Custom Message</span>
                </button>
              </div>
            </div>

            {/* Custom message textarea if custom selected */}
            {whatsappTemplate === 'custom' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Custom Message Content:
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your WhatsApp message..."
                  value={whatsappCustomMsg}
                  onChange={(e) => setWhatsappCustomMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>
            )}

            {/* Message Preview Box */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Message Preview:
                </label>
                <span className="text-[10px] text-teal-300 font-mono">App Link: https://taliat-app.vercel.app/</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-sans text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {getWhatsAppMessageText() || <span className="text-slate-500 italic">Enter message content above...</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyWhatsAppMsg}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
              >
                {whatsappCopied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-300">✓ Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <a
                href={(whatsappPhone && whatsappPhone.replace(/[^0-9]/g, '')) 
                  ? `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getWhatsAppMessageText())}`
                  : `https://wa.me/?text=${encodeURIComponent(getWhatsAppMessageText())}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => setWhatsappUser(null), 1000);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                </svg>
                <span>Open in WhatsApp &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. RESET PASSWORD MODAL ── */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <RotateCcw size={16} />
                </div>
                <h3 className="font-extrabold text-white text-base">Reset Password / Credentials</h3>
              </div>
              <button
                onClick={() => setResettingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {resetErr && (
              <div className="p-3 bg-red-950/80 border border-red-600 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-red-400" />
                <span>{resetErr}</span>
              </div>
            )}

            {resetMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                <span>{resetMsg}</span>
              </div>
            )}

            {/* Target User Summary Card */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-sm shrink-0">
                {resettingUser.fullName?.charAt(0) || resettingUser.username?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-white truncate">{resettingUser.fullName || resettingUser.username}</h4>
                <p className="text-[11px] text-slate-400 truncate">
                  @{resettingUser.username || (resettingUser.email ? resettingUser.email.split('@')[0] : '')} &bull; <strong className="text-emerald-400 capitalize">{resettingUser.role || 'Scout'}</strong>
                </p>
                {resettingUser.rank && (
                  <span className="text-[10px] text-slate-500 font-mono">Rank: {resettingUser.rank}</span>
                )}
              </div>
            </div>

            <form onSubmit={handleExecuteResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This will securely update the user's login password in Firestore credentials.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={resetLoading || resetPasswordVal.trim().length < 6}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <RotateCcw size={14} className={resetLoading ? 'animate-spin' : ''} />
                  <span>{resetLoading ? 'Updating Password...' : 'Save New Password'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {(() => {
                const currentGroup = groups.find(g => g.id === activeGroupTab);
                const currentPatrolName = currentGroup ? currentGroup.name : '';
                const greeting = getKashafGreeting('parent');
                const closing = getLockedClosing(currentPatrolName);
                const appUrl = 'https://taliat-app.vercel.app/';

                return [
                  { label: "General Chat (Blank)", text: "" },
                  { 
                    label: "📅 Meeting Reminder", 
                    text: `${greeting}

Operational directive: Attendance reminder for our upcoming Dhulfiqār Scouting Session.

🔗 *Leadership Portal:* ${appUrl}
📍 *Protocol:* Arrive punctually in full uniform with your Scout Handbook and notebook prepared.${closing}` 
                  },
                  { 
                    label: "🛡️ Safeguarding Video Reminder", 
                    text: `${greeting}

We wanted to share a quick reminder to complete the mandatory Youth Protection and Safety Training (SPT/YPT) video modules.

🔗 *Portal Link:* ${appUrl}
📌 *Instructions:* Access your profile, complete the video modules, and confirm verification with leadership.${closing}` 
                  },
                  { 
                    label: "🕌 Islamic Knowledge Progress Reminder", 
                    text: `${greeting}

Just a friendly check-in regarding the Islamic Knowledge modules (Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and Sīrah of Ahl al-Bayt ʿa).

🔗 *Checklist Portal:* ${appUrl}
📌 *Instructions:* Review unit milestones and prepare for oral/written leader assessment.${closing}` 
                  },
                  { 
                    label: "⏱️ Service Hours Reminder", 
                    text: `${greeting}

We wanted to remind scouts to log their community service and volunteering hours into the portal.

🔗 *Service Log:* ${appUrl}
📌 *Instructions:* Log the project title, date, duration, and beneficiary for verification.${closing}` 
                  }
                ];
              })().map((tmpl) => {
                const cleanPhone = (activeWhatsappPhone || '').replace(/[^0-9]/g, '');
                const encodedText = encodeURIComponent(tmpl.text || '');
                const waLink = cleanPhone 
                  ? `https://wa.me/${cleanPhone}${tmpl.text ? `?text=${encodedText}` : ''}`
                  : `https://wa.me/?text=${encodedText}`;
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
