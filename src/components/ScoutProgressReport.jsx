import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import { Printer, ArrowLeft, Save, Award, Star, BookOpen, Calendar, MessageSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import RankIcon from './RankIcon';

const SAFETY_VIDEOS = [
  { id: 'parent_overview', title: '📹 Parent Overview Briefing' },
  { id: 'mod1', title: '🛡️ Module 1: Barriers to Abuse' },
  { id: 'mod2', title: '🚩 Module 2: Awareness & Red Flags' },
  { id: 'mod3', title: '💻 Module 3: Digital Safety & Privacy' },
  { id: 'mod4', title: '📞 Module 4: Reporting Protocols' }
];

export default function ScoutProgressReport({ scout, currentUser, onBack }) {
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [safetyVideosProgress, setSafetyVideosProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [notesList, setNotesList] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Authorization checks
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser.role === 'leader' && currentUser.leaderPosition === 'Scoutmaster';
  const isAssignedLeader = currentUser.role === 'leader' && scout.leaderId === currentUser.uid;
  const canEdit = isOwner || isScoutmaster || isAssignedLeader;

  // Normalize selected rank ID (lowercase, with underscores)
  const initialRankId = (scout.rank || 'Scout').toLowerCase().replace(' ', '_');
  const [selectedRankId, setSelectedRankId] = useState(initialRankId);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 1. Fetch Ranks, Merit Badges, & Safety Videos progress in real-time
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

    const safetyRef = doc(db, 'user_progress', scout.uid, 'safety_videos', 'status');
    const unsubSafety = onSnapshot(safetyRef, (snap) => {
      if (snap.exists()) {
        setSafetyVideosProgress(snap.data());
      } else {
        setSafetyVideosProgress({});
      }
    });

    const islamicRef = doc(db, 'user_progress', scout.uid, 'islamic_basics', 'status');
    const unsubIslamic = onSnapshot(islamicRef, (snap) => {
      if (snap.exists()) {
        setIslamicProgress(snap.data());
      } else {
        setIslamicProgress({});
      }
    });

    return () => {
      unsubRanks();
      unsubMerit();
      unsubSafety();
      unsubIslamic();
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
        console.error('Failed to load leader notes:', err);
      } finally {
        setNotesLoading(false);
      }
    };
    loadNotes();
  }, [scout.uid]);

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const noteRef = doc(db, 'scout_notes', scout.uid);
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
      await setDoc(noteRef, {
        notes: updatedNotes,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
      }, { merge: true });
      setNotesList(updatedNotes);
      setNewNoteText('');
      setSaveMsg('Note added.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      console.error('Failed to save leader note:', err);
      setSaveMsg('Error saving notes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setSaving(true);
    try {
      const noteRef = doc(db, 'scout_notes', scout.uid);
      const updatedNotes = notesList.filter(n => n.id !== noteId);
      await setDoc(noteRef, {
        notes: updatedNotes,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
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

  // Progress update helpers
  const toggleRequirement = async (reqId) => {
    if (!canEdit) return;
    const docRef = doc(db, 'user_progress', scout.uid, 'ranks', selectedRankId);
    const existingReq = completedReqs[reqId] || {};
    const newCompleted = !existingReq.completed;

    const reqData = {
      completed: newCompleted,
      notes: existingReq.notes || '',
      completedAt: newCompleted ? (existingReq.completedAt || new Date().toISOString().split('T')[0]) : ''
    };

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: reqData
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating requirement status:', err);
    }
  };

  const handleDateChange = async (reqId, dateString) => {
    if (!canEdit) return;
    const docRef = doc(db, 'user_progress', scout.uid, 'ranks', selectedRankId);
    const existingReq = completedReqs[reqId] || {};

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: {
            completed: !!existingReq.completed,
            notes: existingReq.notes || '',
            completedAt: dateString
          }
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating date:', err);
    }
  };

  const handleScoutCompletionDateChange = async (dateVal) => {
    if (!canEdit) return;
    const docRef = doc(db, 'user_progress', scout.uid, 'ranks', selectedRankId);
    try {
      await setDoc(docRef, { scoutCompletedAt: dateVal }, { merge: true });
    } catch (err) {
      console.error('Error updating scout completion date:', err);
    }
  };

  const handleTestingDateChange = async (dateVal) => {
    if (!canEdit) return;
    const docRef = doc(db, 'user_progress', scout.uid, 'ranks', selectedRankId);
    try {
      await setDoc(docRef, { testingCompletedAt: dateVal }, { merge: true });
    } catch (err) {
      console.error('Error updating testing completion date:', err);
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
              <p className="text-3xl font-black text-white">{completedRanksCount} / {RANKS_DATA.length}</p>
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
                  const reqProg = completedReqs[req.id] || {};
                  const isDone = !!reqProg.completed;
                  const isPending = !!reqProg.pending && !isDone;
                  const completionDate = reqProg.completedAt || reqProg.submittedAt || '';
                  return (
                    <tr key={req.id} className={`border-t border-slate-700/50 ${isDone ? 'bg-emerald-950/10' : isPending ? 'bg-amber-950/15' : 'bg-slate-800/20'}`}>
                      <td className="px-3 py-2 border-r border-slate-700 font-mono font-bold text-slate-400 text-xs">
                        {req.number}
                      </td>
                      <td className="px-3 py-2 border-r border-slate-700">
                        <span className={isDone ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {req.text}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center border-r border-slate-700">
                        {/* Screen View */}
                        <div className="print-hide">
                          {canEdit ? (
                            <button
                              onClick={() => toggleRequirement(req.id)}
                              className={`text-[9px] px-2 py-1 rounded font-bold uppercase transition leading-none cursor-pointer border ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : isPending
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-700/50 text-slate-400 border-slate-600'
                              }`}
                            >
                              {isDone ? 'APPROVED' : isPending ? 'PENDING' : 'INCOMPLETE'}
                            </button>
                          ) : (
                            <span className={isDone ? 'text-emerald-400 font-semibold text-xs' : isPending ? 'text-amber-400 font-semibold text-xs' : 'text-slate-500 text-xs'}>
                              {isDone ? 'APPROVED' : isPending ? 'PENDING' : 'INCOMPLETE'}
                            </span>
                          )}
                        </div>
                        {/* Print View */}
                        <div className="print-only">
                          <span className={isDone ? 'print-report-complete text-emerald-400 font-semibold text-xs' : isPending ? 'text-amber-600 font-semibold text-xs' : 'print-report-pending text-slate-500 text-xs'}>
                            {isDone ? 'APPROVED' : isPending ? 'PENDING APPROVAL' : 'INCOMPLETE'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-450 text-xs font-mono">
                        {/* Screen View */}
                        <div className="print-hide">
                          {canEdit ? (
                            <input
                              type="date"
                              value={completionDate}
                              onChange={(e) => handleDateChange(req.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500 max-w-[125px]"
                            />
                          ) : (
                            <span>{completionDate || (isDone ? '—' : '')}</span>
                          )}
                        </div>
                        {/* Print View */}
                        <div className="print-only">
                          <span>{completionDate || (isDone ? '—' : '')}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Milestones (Board of Review Sign-offs) */}
        <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/50 pb-2">
            Rank Completion Sign-Off Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scout Finished Date */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={12} className="text-emerald-400" /> Scout Finished Date
              </label>
              <div className="print-hide">
                {canEdit ? (
                  <input
                    type="date"
                    value={activeProg.scoutCompletedAt || ''}
                    onChange={(e) => handleScoutCompletionDateChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <span className="text-slate-300 text-xs">{activeProg.scoutCompletedAt || 'No completion date set.'}</span>
                )}
              </div>
              <div className="print-only text-xs text-black">
                {activeProg.scoutCompletedAt || '—'}
              </div>
            </div>

            {/* Board of Review / Sign-Off Date */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Award size={12} className="text-amber-400" /> Board of Review / Sign-Off Date
              </label>
              <div className="print-hide">
                {canEdit ? (
                  <input
                    type="date"
                    value={activeProg.testingCompletedAt || ''}
                    onChange={(e) => handleTestingDateChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <span className="text-slate-300 text-xs">{activeProg.testingCompletedAt || 'No review date set.'}</span>
                )}
              </div>
              <div className="print-only text-xs text-black">
                {activeProg.testingCompletedAt || '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Safeguarding & Youth Protection Training (Screen & Print) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Safeguarding & Youth Protection Training
          </h2>
          <table className="w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-900/60 text-left text-xs text-slate-400 border-b border-slate-700">
                <th className="px-3 py-2 border-r border-slate-700">Module / Video</th>
                <th className="px-3 py-2 border-r border-slate-700 text-center w-24">Status</th>
                <th className="px-3 py-2 border-r border-slate-700 w-28">Completion Date</th>
                <th className="px-3 py-2">Lesson Learned Summary</th>
              </tr>
            </thead>
            <tbody>
              {SAFETY_VIDEOS.map((video) => {
                const videoProg = safetyVideosProgress[video.id] || {};
                const isWatched = !!videoProg.watched;
                const completedDate = videoProg.completedDate || (videoProg.watchedAt ? new Date(videoProg.watchedAt).toLocaleDateString() : '');
                const lesson = videoProg.lessonLearned || '';

                return (
                  <tr key={video.id} className="border-b border-slate-700 text-xs hover:bg-slate-900/10">
                    <td className="px-3 py-2 border-r border-slate-700 font-medium text-slate-200">
                      {video.title}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-700 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isWatched
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                      }`}>
                        {isWatched ? 'COMPLETED' : 'INCOMPLETE'}
                      </span>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-700 text-slate-300 font-mono">
                      {completedDate || '—'}
                    </td>
                    <td className="px-3 py-2 text-slate-350 italic whitespace-pre-wrap">
                      {isWatched ? `"${lesson || 'No lesson entered.'}"` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Islamic Shia Basics Checklist */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Islamic Shia Basics Checklist
          </h2>
          <table className="w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-900/60 text-left text-xs text-slate-400 border-b border-slate-700">
                <th className="px-3 py-2 border-r border-slate-700 w-1/3">Topic</th>
                <th className="px-3 py-2 border-r border-slate-700 text-center w-28">Status</th>
                <th className="px-3 py-2 border-r border-slate-700 w-32">Completion Date</th>
                <th className="px-3 py-2">Signed off By</th>
              </tr>
            </thead>
            <tbody>
              {ISLAMIC_BASICS_TOPICS.map((topic) => {
                const topicProg = islamicProgress[topic.id] || {};
                const isCompleted = !!topicProg.completed;
                const isPending = !!topicProg.pending && !isCompleted;
                const completedDate = topicProg.completedDate || topicProg.submittedDate || '';
                const signedBy = topicProg.approvedByName || topicProg.updatedByName || '';

                return (
                  <tr key={topic.id} className={`border-b border-slate-700 text-xs ${isCompleted ? 'bg-emerald-950/10' : isPending ? 'bg-amber-950/15' : 'hover:bg-slate-900/10'}`}>
                    <td className="px-3 py-2 border-r border-slate-700 font-medium text-slate-200">
                      {topic.title}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-700 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                      }`}>
                        {isCompleted ? 'APPROVED' : isPending ? 'PENDING' : 'INCOMPLETE'}
                      </span>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-700 text-slate-300 font-mono">
                      {completedDate || '—'}
                    </td>
                    <td className="px-3 py-2 text-slate-350 italic">
                      {isCompleted ? (signedBy || 'Leader') : isPending ? 'Awaiting Sign-off' : '—'}
                    </td>
                  </tr>
                );
              })}
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

          {/* Screen UI */}
          <div className="print-hide bg-slate-900/30 border border-slate-700 rounded-xl p-4 space-y-4">
            {notesLoading ? (
              <div className="text-xs text-slate-500">Loading notes...</div>
            ) : (
              <div className="space-y-4">
                {/* List of notes on screen */}
                {notesList.length > 0 ? (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {notesList.map((note) => {
                      const canDelete = currentUser.uid === note.authorId || currentUser.role === 'owner';
                      return (
                        <div key={note.id} className="bg-slate-900 border border-slate-750 p-3 rounded-xl text-xs space-y-1 relative group">
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
                    No leader discussion notes recorded yet.
                  </div>
                )}

                {/* Form to add note on screen */}
                <div className="border-t border-slate-700/50 pt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <textarea
                        rows={2}
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Enter new discussion note..."
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

          {/* Print-only static list */}
          <div className="print-only space-y-2">
            {notesList.length > 0 ? (
              notesList.map((n) => (
                <div key={n.id} className="p-2 border border-slate-300 rounded text-xs text-black bg-white">
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-0.5 mb-1 text-[10px] text-slate-500">
                    <span>{n.authorName} ({n.authorPosition})</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed text-black">{n.text}</p>
                </div>
              ))
            ) : (
              <div className="p-3 border border-black min-h-[50px] text-xs text-slate-450 italic">
                No leader notes recorded.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
