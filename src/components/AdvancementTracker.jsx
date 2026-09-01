import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Calendar, MessageSquare, Award, Clock, User, Plus, Trash2, Tag, BookOpen, Sparkles, Send, CheckCheck } from 'lucide-react';
import RankIcon from './RankIcon';
import ScoutProgressReport from './ScoutProgressReport';

const RANK_COLORS = {
  emerald: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40',
    ring: 'ring-emerald-500',
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-800/50',
    bg: 'bg-emerald-950/20',
  },
  teal: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    active: 'bg-teal-600 text-white shadow-lg shadow-teal-900/40',
    ring: 'ring-teal-500',
    bar: 'bg-teal-500',
    text: 'text-teal-400',
    border: 'border-teal-800/50',
    bg: 'bg-teal-950/20',
  },
  cyan: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    active: 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40',
    ring: 'ring-cyan-500',
    bar: 'bg-cyan-500',
    text: 'text-cyan-400',
    border: 'border-cyan-800/50',
    bg: 'bg-cyan-950/20',
  },
  yellow: {
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    active: 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/40',
    ring: 'ring-yellow-500',
    bar: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-800/50',
    bg: 'bg-yellow-950/20',
  },
  orange: {
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    active: 'bg-orange-600 text-white shadow-lg shadow-orange-900/40',
    ring: 'ring-orange-500',
    bar: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-orange-800/50',
    bg: 'bg-orange-950/20',
  },
  red: {
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    active: 'bg-red-600 text-white shadow-lg shadow-red-900/40',
    ring: 'ring-red-500',
    bar: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-red-800/50',
    bg: 'bg-red-950/20',
  },
  purple: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    active: 'bg-purple-600 text-white shadow-lg shadow-purple-900/40',
    ring: 'ring-purple-500',
    bar: 'bg-purple-500',
    text: 'text-purple-400',
    border: 'border-purple-800/50',
    bg: 'bg-purple-950/20',
  },
};

export default function AdvancementTracker({ currentUser = {}, scoutId: customScoutId, readOnly = false }) {
  const [selectedScoutId, setSelectedScoutId] = useState('');
  const [scoutsList, setScoutsList] = useState([]);
  
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScoutmaster = isLeader && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantLeader = isLeader && (currentUser?.leaderPosition === 'Assistant Scoutmaster' || currentUser?.leaderPosition === 'Assistant Leader');
  const isScout = currentUser?.role === 'scout' || (!isLeaderOrOwner && currentUser?.uid);
  const scoutId = customScoutId || (isLeaderOrOwner ? (selectedScoutId || currentUser?.uid) : currentUser?.uid);

  const [selectedRankId, setSelectedRankId] = useState('scout');
  const [allRanksProgress, setAllRanksProgress] = useState({});
  const [expandedReqs, setExpandedReqs] = useState({}); // { [reqId]: boolean }
  const [loading, setLoading] = useState(true);
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Scout Biography states
  const [scoutData, setScoutData] = useState(null);
  const [bioInput, setBioInput] = useState('');
  const [savingBio, setSavingBio] = useState(false);
  const [bioMsg, setBioMsg] = useState('');

  // Scout Journal & Dated Notes states
  const [journalNotes, setJournalNotes] = useState([]);
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNoteCategory, setNewNoteCategory] = useState('General Note');
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [journalMsg, setJournalMsg] = useState('');

  // 1. Subscribe to scout's specific profile info (including bio)
  useEffect(() => {
    if (!scoutId) {
      setScoutData(null);
      setBioInput('');
      return;
    }
    const unsub = onSnapshot(doc(db, 'users', scoutId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setScoutData(data);
        setBioInput(data.bio || '');
      } else {
        setScoutData(null);
        setBioInput('');
      }
    }, (err) => {
      console.error("Failed to subscribe to scout details:", err);
    });
    return () => unsub();
  }, [scoutId]);

  // 2. Subscribe to scout's dated journal notes
  useEffect(() => {
    if (!scoutId) {
      setJournalNotes([]);
      return;
    }
    const docRef = doc(db, 'user_progress', scoutId, 'journal', 'entries');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists() && Array.isArray(snap.data().notes)) {
        // Sort notes by date descending
        const sorted = [...snap.data().notes].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setJournalNotes(sorted);
      } else {
        setJournalNotes([]);
      }
    }, (err) => {
      console.error("Failed to load scout journal notes:", err);
    });
    return () => unsub();
  }, [scoutId]);

  const handleSaveBio = async () => {
    if (!scoutId) return;
    setSavingBio(true);
    setBioMsg('');
    try {
      await setDoc(doc(db, 'users', scoutId), { bio: bioInput }, { merge: true });
      setBioMsg('About Me updated successfully!');
      setTimeout(() => setBioMsg(''), 3000);
    } catch (err) {
      console.error("Failed to update bio:", err);
      setBioMsg('Failed to update About Me.');
    } finally {
      setSavingBio(false);
    }
  };

  const handleAddJournalNote = async (e) => {
    e.preventDefault();
    if (!scoutId || !newNoteText.trim()) return;
    setAddingNote(true);
    setJournalMsg('');

    const newEntry = {
      id: Date.now().toString(),
      date: newNoteDate || new Date().toISOString().split('T')[0],
      category: newNoteCategory || 'General Note',
      text: newNoteText.trim(),
      authorId: currentUser?.uid || '',
      authorName: currentUser?.fullName || currentUser?.username || currentUser?.email || 'Scout',
      authorRole: currentUser?.role || 'scout',
      createdAt: new Date().toISOString()
    };

    const updated = [newEntry, ...journalNotes];

    try {
      const docRef = doc(db, 'user_progress', scoutId, 'journal', 'entries');
      await setDoc(docRef, { notes: updated }, { merge: true });
      setNewNoteText('');
      setJournalMsg('Note added successfully!');
      setTimeout(() => setJournalMsg(''), 3000);
    } catch (err) {
      console.error("Failed to add journal note:", err);
      setJournalMsg('Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteJournalNote = async (noteId) => {
    if (!scoutId || !noteId) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    const updated = journalNotes.filter(n => n.id !== noteId);
    try {
      const docRef = doc(db, 'user_progress', scoutId, 'journal', 'entries');
      await setDoc(docRef, { notes: updated }, { merge: true });
    } catch (err) {
      console.error("Failed to delete journal note:", err);
    }
  };

  // Fetch scouts list if leader or owner and customScoutId is not provided
  useEffect(() => {
    if (!isLeaderOrOwner || customScoutId) return;

    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      const scouts = allUsers.filter(u => {
        if (u.role !== 'scout') return false;
        if (isOwner || isScoutmaster) return true;
        return u.leaderId === currentUser?.uid || (currentUser?.groupId && u.groupId === currentUser?.groupId);
      });
      setScoutsList(scouts);
      if (scouts.length > 0 && !selectedScoutId) {
        setSelectedScoutId(scouts[0].uid);
      }
    }, (err) => {
      console.error('Error listening to users in tracker:', err);
    });

    return () => unsub();
  }, [isLeaderOrOwner, customScoutId, currentUser?.role, currentUser?.uid, currentUser?.groupId, isOwner, isScoutmaster]);

  // Listen to all rank progress documents in real-time
  useEffect(() => {
    if (!scoutId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const colRef = collection(db, 'user_progress', scoutId, 'ranks');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const progressMap = {};
      snapshot.docs.forEach((doc) => {
        progressMap[doc.id] = doc.data();
      });
      setAllRanksProgress(progressMap);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to rank progress:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [scoutId]);

  const selectedRankData = RANKS_DATA.find((r) => r.id === selectedRankId) || RANKS_DATA[0];
  const activeProgress = allRanksProgress[selectedRankId] || { completedRequirements: {} };
  const completedRequirements = activeProgress.completedRequirements || {};
  const scoutCompletedAt = activeProgress.scoutCompletedAt || '';
  const testingCompletedAt = activeProgress.testingCompletedAt || '';

  const colorTheme = RANK_COLORS[selectedRankData.color] || RANK_COLORS.emerald;

  // Calculate overall requirements count and completed/pending count for selected rank
  const totalRequirements = selectedRankData.categories.reduce((sum, cat) => sum + cat.requirements.length, 0);
  const completedCount = selectedRankData.categories.reduce((sum, cat) => {
    return sum + cat.requirements.filter((r) => completedRequirements[r.id]?.completed).length;
  }, 0);
  const pendingCount = selectedRankData.categories.reduce((sum, cat) => {
    return sum + cat.requirements.filter((r) => completedRequirements[r.id]?.pending && !completedRequirements[r.id]?.completed).length;
  }, 0);
  const percentage = totalRequirements > 0 ? Math.round((completedCount / totalRequirements) * 100) : 0;

  // Total pending approvals across ALL 8 ranks for this scout
  const totalPendingAcrossAllRanks = Object.values(allRanksProgress).reduce((acc, rankDoc) => {
    const reqs = rankDoc?.completedRequirements || {};
    return acc + Object.values(reqs).filter(r => r?.pending && !r?.completed).length;
  }, 0);

  // Scout toggles requirement -> submits to leader (yellow pending) or cancels submission
  const handleToggleRequirementScout = async (reqId) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};
    
    // If already approved/completed, scout cannot modify it directly
    if (existingReq.completed) return;

    const isPending = !!existingReq.pending;
    const newPending = !isPending;

    const reqData = {
      completed: false,
      pending: newPending,
      notes: existingReq.notes || '',
      submittedAt: newPending ? new Date().toISOString().split('T')[0] : '',
      completedAt: ''
    };

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: reqData
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error submitting requirement status:', err);
    }
  };

  // Leader approves requirement -> marks complete & approved (green) or resets
  const handleApproveRequirementLeader = async (reqId) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};
    
    const isCompleted = !!existingReq.completed;
    const newCompleted = !isCompleted;

    const reqData = {
      completed: newCompleted,
      pending: false,
      notes: existingReq.notes || '',
      approvedAt: newCompleted ? new Date().toISOString().split('T')[0] : '',
      approvedBy: newCompleted ? currentUser.uid : '',
      approvedByName: newCompleted ? (currentUser.fullName || currentUser.username || 'Leader') : '',
      completedAt: newCompleted ? (existingReq.completedAt || new Date().toISOString().split('T')[0]) : ''
    };

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: reqData
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error approving requirement status:', err);
    }
  };

  // Batch submit all incomplete requirements in active rank (for scouts)
  const handleBatchSubmitScout = async () => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const today = new Date().toISOString().split('T')[0];
    const updates = { ...completedRequirements };

    selectedRankData.categories.forEach(cat => {
      cat.requirements.forEach(req => {
        const existing = updates[req.id] || {};
        if (!existing.completed && !existing.pending) {
          updates[req.id] = {
            ...existing,
            completed: false,
            pending: true,
            submittedAt: today
          };
        }
      });
    });

    try {
      await setDoc(docRef, { completedRequirements: updates }, { merge: true });
    } catch (err) {
      console.error("Failed to batch submit requirements:", err);
    }
  };

  // Batch approve all pending requirements in active rank (for leaders)
  const handleBatchApproveLeader = async () => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const today = new Date().toISOString().split('T')[0];
    const updates = { ...completedRequirements };

    selectedRankData.categories.forEach(cat => {
      cat.requirements.forEach(req => {
        const existing = updates[req.id] || {};
        if (existing.pending && !existing.completed) {
          updates[req.id] = {
            ...existing,
            completed: true,
            pending: false,
            approvedAt: today,
            approvedBy: currentUser.uid,
            approvedByName: currentUser.fullName || currentUser.username || 'Leader',
            completedAt: existing.completedAt || today
          };
        }
      });
    });

    try {
      await setDoc(docRef, { completedRequirements: updates }, { merge: true });
    } catch (err) {
      console.error("Failed to batch approve requirements:", err);
    }
  };

  const handleNoteChange = async (reqId, noteText) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: {
            ...existingReq,
            notes: noteText
          }
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating notes:', err);
    }
  };

  const handleDateChange = async (reqId, dateString) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: {
            ...existingReq,
            completedAt: dateString
          }
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating date:', err);
    }
  };

  const handleScoutCompletionDateChange = async (dateVal) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    try {
      await setDoc(docRef, { scoutCompletedAt: dateVal }, { merge: true });
    } catch (err) {
      console.error('Error updating scout completion date:', err);
    }
  };

  const handleTestingDateChange = async (dateVal) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    try {
      await setDoc(docRef, { testingCompletedAt: dateVal }, { merge: true });
    } catch (err) {
      console.error('Error updating testing completion date:', err);
    }
  };

  const toggleExpand = (reqId) => {
    setExpandedReqs((prev) => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading advancement portal...</div>;
  }

  if (isLeaderOrOwner && !customScoutId && scoutsList.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center text-slate-400 text-sm print-hide">
        No active scouts found. Set up scouts in the Organization Hub first.
      </div>
    );
  }

  if (showPrintReport) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowPrintReport(false)}
          className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer print-hide"
        >
          &larr; Back to Tracker
        </button>
        <ScoutProgressReport
          scout={scoutData || { uid: currentUser.uid, fullName: currentUser.fullName, username: currentUser.username, rank: currentUser.rank || 'Scout' }}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner with PDF Print */}
      <div className="flex justify-between items-center bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl print-hide">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Advancement Tracker</h2>
          <p className="text-xs text-slate-400">Track rank checklists and complete requirements.</p>
        </div>
        {scoutId && (
          <button
            onClick={() => setShowPrintReport(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/30"
          >
            Print Progress Report (PDF)
          </button>
        )}
      </div>

      {/* Scout Selector for Leader/Owner viewing the tracker directly */}
      {isLeaderOrOwner && !customScoutId && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-wrap gap-4 items-center justify-between print-hide">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Select Scout</h2>
            <p className="text-xs text-slate-400">View and track requirements progress for this scout</p>
          </div>
          <select
            value={selectedScoutId}
            onChange={(e) => setSelectedScoutId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {scoutsList.map(s => (
              <option key={s.uid} value={s.uid}>{s.fullName || s.username} ({s.rank || 'Scout'})</option>
            ))}
          </select>
        </div>
      )}
      {/* ── SEPARATE SECTION 1: ABOUT ME (SCOUT BIO) ── */}
      {scoutId && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3 print-hide">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">About Me</h2>
                <p className="text-[11px] text-slate-400">
                  {currentUser.uid === scoutId
                    ? 'Share facts about yourself, your hobbies, interests, and scouting goals.'
                    : `Personal biography and introduction for ${scoutData?.fullName || scoutData?.username || 'this scout'}.`}
                </p>
              </div>
            </div>
            {bioMsg && <span className="text-xs text-emerald-400 font-semibold">{bioMsg}</span>}
          </div>

          {currentUser.uid === scoutId ? (
            <div className="space-y-2">
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Write something about yourself, your interests, hobbies, goals in scouting, or a personal intro..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveBio}
                  disabled={savingBio}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  {savingBio ? 'Saving...' : 'Save About Me'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-750 p-4 rounded-xl min-h-[50px] text-xs text-slate-200 leading-relaxed">
              {scoutData?.bio ? (
                <p className="whitespace-pre-wrap">{scoutData.bio}</p>
              ) : (
                <span className="text-slate-400 italic">This scout has not added an About Me bio yet.</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SEPARATE SECTION 2: SCOUT JOURNAL & DATED NOTES ── */}
      {scoutId && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 print-hide">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Scout Journal & Dated Notes</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full font-mono text-slate-300">
                    {journalNotes.length} {journalNotes.length === 1 ? 'entry' : 'entries'}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">Log meeting notes, campout reflections, and advancement goals by date.</p>
              </div>
            </div>
            {journalMsg && <span className="text-xs text-emerald-400 font-semibold">{journalMsg}</span>}
          </div>

          {/* Add New Dated Note Form */}
          <form onSubmit={handleAddJournalNote} className="bg-slate-900/40 border border-slate-750 p-4 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Date Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} className="text-amber-400" /> Note Date
                </label>
                <input
                  type="date"
                  required
                  value={newNoteDate}
                  onChange={(e) => setNewNoteDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>

              {/* Category / Type Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag size={12} className="text-emerald-400" /> Category / Topic
                </label>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="General Note">General Note</option>
                  <option value="Troop Meeting">Troop Meeting</option>
                  <option value="Campout & Outdoors">Campout & Outdoors</option>
                  <option value="Advancement Goal">Advancement Goal</option>
                  <option value="Service Project">Service Project</option>
                  <option value="Personal Reflection">Personal Reflection</option>
                  <option value="Leader Feedback">Leader Feedback</option>
                </select>
              </div>
            </div>

            {/* Note Text */}
            <div>
              <textarea
                required
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write your dated note, activity recap, reflection, or goal here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingNote || !newNoteText.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                {addingNote ? 'Adding...' : 'Add Note to Journal'}
              </button>
            </div>
          </form>

          {/* List of Dated Notes (Chronological Feed) */}
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {journalNotes.length > 0 ? (
              journalNotes.map((note) => {
                const canDelete = currentUser.uid === note.authorId || currentUser.uid === scoutId || currentUser.role === 'owner';
                return (
                  <div
                    key={note.id}
                    className="bg-slate-900 border border-slate-750 hover:border-slate-700 p-3.5 rounded-xl space-y-2 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                          <Calendar size={11} /> {note.date}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-sans">
                          {note.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          by <strong className="text-slate-300">{note.authorName}</strong>
                        </span>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteJournalNote(note.id)}
                          className="text-slate-500 hover:text-red-400 transition cursor-pointer p-1 rounded hover:bg-slate-800"
                          title="Delete note"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl text-center text-xs text-slate-400 italic">
                No dated notes logged yet. Use the form above to record your first journal entry!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approvals Notification Banner for Leader */}
      {isLeaderOrOwner && totalPendingAcrossAllRanks > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg shadow-amber-950/20 print-hide">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={16} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                {totalPendingAcrossAllRanks} Requirement{totalPendingAcrossAllRanks !== 1 ? 's' : ''} Awaiting Sign-off for {scoutData?.fullName || scoutData?.username || 'this scout'}
              </h4>
              <p className="text-[11px] text-amber-200/80">
                Rank tabs with pending submissions are highlighted with amber badges below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ranks Tabs Bar */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-700/60 print-hide">
        {RANKS_DATA.map((rank) => {
          const isActive = selectedRankId === rank.id;
          const rankColor = RANK_COLORS[rank.color] || RANK_COLORS.emerald;

          // Calculate rank completion percentage for tab badge
          const rProg = allRanksProgress[rank.id] || { completedRequirements: {} };
          const rComp = rProg.completedRequirements || {};
          const rTotal = rank.categories.reduce((sum, c) => sum + c.requirements.length, 0);
          const rDone = rank.categories.reduce((sum, c) => sum + c.requirements.filter((r) => rComp[r.id]?.completed).length, 0);
          const rPending = rank.categories.reduce((sum, c) => sum + c.requirements.filter((r) => rComp[r.id]?.pending && !rComp[r.id]?.completed).length, 0);
          const rPct = rTotal > 0 ? Math.round((rDone / rTotal) * 100) : 0;

          return (
            <button
              key={rank.id}
              onClick={() => setSelectedRankId(rank.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? rankColor.active
                  : rPending > 0
                  ? 'bg-amber-950/40 border border-amber-500/50 text-amber-300 hover:bg-amber-900/40'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <RankIcon rankId={rank.id} size={14} />
              {rank.name}
              <span className={`text-[10px] px-1 rounded font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {rPct}%
              </span>
              {rPending > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-500 text-slate-950 flex items-center gap-0.5 animate-pulse" title={`${rPending} pending approval`}>
                  <Clock size={9} /> {rPending}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Rank Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <RankIcon rankId={selectedRankId} size={120} className={colorTheme.text} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${colorTheme.badge}`}>
                Rank {selectedRankData.order} of 8
              </span>
              <h2 className="text-xl font-bold text-white">{selectedRankData.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedRankData.description}</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${colorTheme.text}`}>{percentage}%</span>
            <p className="text-xs text-slate-400">{completedCount} of {totalRequirements} complete</p>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-500 rounded-full ${colorTheme.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Rank Progress & Batch Submission Banner */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg print-hide">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Requirements Status:</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" /> {completedCount} Approved
          </span>
          {pendingCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 animate-pulse">
              <Clock size={13} className="text-amber-400" /> {pendingCount} Pending Approval
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-700/60 text-slate-300">
            {totalRequirements - completedCount - pendingCount} Incomplete
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            {isScout && (totalRequirements - completedCount - pendingCount > 0) && (
              <button
                onClick={handleBatchSubmitScout}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
              >
                <Send size={13} />
                Submit Incomplete for Approval
              </button>
            )}

            {isLeaderOrOwner && pendingCount > 0 && (
              <button
                onClick={handleBatchApproveLeader}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 animate-pulse"
              >
                <CheckCheck size={14} />
                1-Click Approve All Pending ({pendingCount})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Categories & Requirements Checklist */}
      <div className="space-y-6">
        {selectedRankData.categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700/50 pb-2">
              {cat.name}
            </h3>
            <div className="space-y-3">
              {cat.requirements.map((req) => {
                const reqProgress = completedRequirements[req.id] || {};
                const isCompleted = !!reqProgress.completed;
                const isPending = !!reqProgress.pending && !isCompleted;
                const isExpanded = !!expandedReqs[req.id];
                const noteValue = reqProgress.notes || '';
                const dateValue = reqProgress.completedAt || reqProgress.submittedAt || '';
                const isScout = currentUser?.role === 'scout' || (!isLeaderOrOwner && currentUser?.uid === scoutId);

                return (
                  <div
                    key={req.id}
                    className={`rounded-xl border transition overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-950/15 border-emerald-800/40'
                        : isPending
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-sm shadow-amber-950/30'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {/* Header bar */}
                    <div className="p-4 flex items-start gap-4">
                      {/* Interactive Circular Checkbox Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isScout) {
                            handleToggleRequirementScout(req.id);
                          } else if (isLeaderOrOwner) {
                            handleApproveRequirementLeader(req.id);
                          }
                        }}
                        disabled={readOnly || (isScout && isCompleted)}
                        className={`mt-0.5 shrink-0 p-1 rounded-full transition cursor-pointer ${
                          isCompleted
                            ? 'text-emerald-400 hover:scale-110'
                            : isPending
                            ? 'text-amber-400 hover:scale-110 animate-pulse'
                            : 'text-slate-500 hover:text-emerald-400 hover:scale-110'
                        }`}
                        title={
                          isCompleted
                            ? 'Approved & Completed'
                            : isPending
                            ? 'Submitted - Pending Leader Approval (Click to cancel)'
                            : isScout
                            ? 'Click to Submit for Leader Approval'
                            : 'Click to Sign-off / Approve'
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="text-emerald-400" size={22} />
                        ) : isPending ? (
                          <Clock className="text-amber-400 animate-pulse" size={22} />
                        ) : (
                          <Circle className="text-slate-500 hover:text-emerald-400" size={22} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-slate-400">Requirement {req.number}</span>
                            {isCompleted && (
                              <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase leading-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 size={10} /> Approved & Completed
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase leading-none bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <Clock size={10} /> Pending Leader Approval
                              </span>
                            )}
                            {!isCompleted && !isPending && (
                              <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase leading-none bg-slate-700/50 text-slate-400 border border-slate-600">
                                Incomplete
                              </span>
                            )}
                          </div>

                          {/* Quick action buttons */}
                          {!readOnly && (
                            <div className="flex items-center gap-2">
                              {isScout && (
                                <button
                                  onClick={() => handleToggleRequirementScout(req.id)}
                                  disabled={isCompleted}
                                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                    isPending
                                      ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/30'
                                      : isCompleted
                                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-default opacity-80'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 hover:scale-[1.02]'
                                  }`}
                                >
                                  {isPending ? (
                                    <>
                                      <Clock size={13} className="animate-pulse" />
                                      <span>Pending Approval (Cancel)</span>
                                    </>
                                  ) : isCompleted ? (
                                    <>
                                      <CheckCircle2 size={13} />
                                      <span>Approved & Signed</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send size={13} />
                                      <span>Submit for Approval</span>
                                    </>
                                  )}
                                </button>
                              )}

                              {isLeaderOrOwner && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleApproveRequirementLeader(req.id)}
                                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                      isCompleted
                                        ? 'bg-emerald-800/30 text-emerald-300 hover:bg-red-900/40 hover:text-red-300 border border-emerald-700/40'
                                        : isPending
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 animate-pulse'
                                        : 'bg-slate-700 hover:bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {isCompleted ? 'Approved ✓' : isPending ? 'Approve Requirement' : 'Mark Tested / Sign-off'}
                                  </button>
                                  {isPending && (
                                    <button
                                      onClick={() => handleToggleRequirementScout(req.id)}
                                      className="text-xs px-2.5 py-1.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer"
                                      title="Return for Revision"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <p className={`text-sm mt-1 leading-relaxed ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                          {req.text}
                        </p>

                        {/* Sign-off Author details */}
                        {isCompleted && reqProgress.approvedByName && (
                          <p className="text-[10px] text-emerald-400/90 font-medium mt-1">
                            Approved by: <strong className="text-emerald-300">{reqProgress.approvedByName}</strong> {reqProgress.approvedAt ? `on ${reqProgress.approvedAt}` : ''}
                          </p>
                        )}
                        {isPending && reqProgress.submittedAt && (
                          <p className="text-[10px] text-amber-400 font-medium mt-1">
                            Submitted by Scout on <strong className="text-amber-300">{reqProgress.submittedAt}</strong> (Awaiting Leader Sign-off)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date and Notes */}
                    <div className="px-4 pb-4 pt-2 border-t border-slate-700/40 bg-slate-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date Field */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Calendar size={12} /> {isCompleted ? 'Approved Date' : 'Completion Date'}
                        </label>
                        <input
                          type="date"
                          disabled={readOnly}
                          value={dateValue}
                          onChange={(e) => handleDateChange(req.id, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                        />
                      </div>

                      {/* Reflections Field */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <MessageSquare size={12} /> Notes & Leader Feedback
                        </label>
                        <input
                          type="text"
                          disabled={readOnly}
                          value={noteValue}
                          onChange={(e) => handleNoteChange(req.id, e.target.value)}
                          placeholder={readOnly ? 'No notes entered' : 'Write notes or sign-off reflections here...'}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-75"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Rank Completion Milestones (Scout Finished Date & Testing Date) */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700/50 pb-2">
          Rank Completion Sign-Off Milestones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scout Finished Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 flex items-center gap-1">
              <Calendar size={14} className="text-emerald-400" /> Scout Finished Date
            </label>
            <p className="text-[11px] text-slate-400 mb-2">Logged by the Scout when all requirements are finished.</p>
            <input
              type="date"
              disabled={readOnly}
              value={scoutCompletedAt}
              onChange={(e) => handleScoutCompletionDateChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
          </div>

          {/* Leader Board of Review / Sign-Off Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 flex items-center gap-1">
              <Award size={14} className="text-amber-400" /> Board of Review / Sign-Off Date
            </label>
            <p className="text-[11px] text-slate-400 mb-2">Official date when completed and signed off by leaders.</p>
            <input
              type="date"
              disabled={readOnly}
              value={testingCompletedAt}
              onChange={(e) => handleTestingDateChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
