import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import {
  Printer,
  ArrowLeft,
  Award,
  Star,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  CheckSquare,
  FileText,
  User,
  Shield,
  Video,
  Check,
  Filter,
  Layers,
  CalendarRange,
  History,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import RankIcon from './RankIcon';

export default function ScoutProgressReport({ scout, currentUser, onBack }) {
  const scoutUid = scout?.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'assistant_leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  // Leader Export Modes: 'comprehensive' | 'window' | 'snapshot'
  const [leaderReportMode, setLeaderReportMode] = useState(isScout ? 'scout_summary' : 'comprehensive');

  // Date Range Filtering (Mode B: Window)
  const defaultStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 90 days ago
  const defaultEndDate = new Date().toISOString().split('T')[0];
  const [windowStartDate, setWindowStartDate] = useState(defaultStartDate);
  const [windowEndDate, setWindowEndDate] = useState(defaultEndDate);

  // Cumulative Snapshot Date (Mode C: Snapshot)
  const [snapshotDate, setSnapshotDate] = useState(defaultEndDate);

  // Real-time data states
  const [profileData, setProfileData] = useState(null);
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [serviceLogs, setServiceLogs] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [scoutSubmissions, setScoutSubmissions] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [leaderNotes, setLeaderNotes] = useState('');
  const [eagleProjectRoadmap, setEagleProjectRoadmap] = useState({});
  const [loading, setLoading] = useState(true);

  const reportPrintDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 1. Fetch Scout User Profile Info
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'users', scoutUid), (snap) => {
      if (snap.exists()) {
        setProfileData(snap.data());
      }
    });
    return () => unsub();
  }, [scoutUid]);

  // 2. Fetch 7 Ranks Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'ranks'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });
    return () => unsub();
  }, [scoutUid]);

  // 3. Fetch Merit Badges Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
    });
    return () => unsub();
  }, [scoutUid]);

  // 4. Fetch Islamic Knowledge Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'user_progress', scoutUid, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) {
        setIslamicProgress(snap.data());
      }
    });
    return () => unsub();
  }, [scoutUid]);

  // 5. Fetch Service & Volunteering Logs
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'service_logs'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.scoutId === scoutUid || l.userId === scoutUid);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setServiceLogs(list);
    });
    return () => unsub();
  }, [scoutUid]);

  // 6. Fetch Assignments & Submissions
  useEffect(() => {
    if (!scoutUid) return;
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSub = onSnapshot(collection(db, 'user_progress', scoutUid, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setScoutSubmissions(map);
    });
    return () => {
      unsubAssign();
      unsubSub();
    };
  }, [scoutUid]);

  // 7. Fetch Events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEventsList(list);
    });
    return () => unsub();
  }, []);

  // 8. Fetch Leader Private Notes & Eagle Roadmap
  useEffect(() => {
    if (!scoutUid) return;
    const unsubNotes = onSnapshot(doc(db, 'scout_notes', scoutUid), (snap) => {
      if (snap.exists()) {
        setLeaderNotes(snap.data().notes || snap.data().text || '');
      }
    });
    const unsubRoadmap = onSnapshot(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'project_roadmap'), (snap) => {
      if (snap.exists()) {
        setEagleProjectRoadmap(snap.data());
      }
      setLoading(false);
    });
    return () => {
      unsubNotes();
      unsubRoadmap();
    };
  }, [scoutUid]);

  // Helper date filters
  const isDateWithinWindow = (dateStr) => {
    if (!dateStr) return false;
    return dateStr >= windowStartDate && dateStr <= windowEndDate;
  };

  const isDateBeforeOrOnSnapshot = (dateStr) => {
    if (!dateStr) return false;
    return dateStr <= snapshotDate;
  };

  // Scout Info
  const scoutInfo = profileData || scout || currentUser || {};
  const scoutFullName = scoutInfo.fullName || scoutInfo.username || 'Scout Member';
  const scoutRank = scoutInfo.rank || 'Scout';
  const scoutPatrol = scoutInfo.patrolName || scoutInfo.patrolId || 'Taliʿa Patrol';
  const leaderName = currentUser?.fullName || currentUser?.username || 'Unit Scoutmaster';

  // ── DATE FILTERING CALCULATIONS FOR FILTER MODES ──
  // Mode A & Scout Summary: All
  // Mode B: Window (Start to End)
  // Mode C: Snapshot (Up to Snapshot Date)

  const isItemActiveInMode = (itemDate) => {
    if (leaderReportMode === 'window') return isDateWithinWindow(itemDate);
    if (leaderReportMode === 'snapshot') return isDateBeforeOrOnSnapshot(itemDate);
    return true; // comprehensive & scout_summary
  };

  // Service Hours
  const filteredServiceLogs = serviceLogs.filter(l => isItemActiveInMode(l.date));
  const totalFilteredServiceHours = filteredServiceLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  // Merit Badges
  const isBadgeEarnedInMode = (badge) => {
    const p = meritProgress[badge.id];
    if (!p) return false;
    const isCompleted = p.completed === true || (badge.requirements && badge.requirements.every(r => p.steps?.[r.id] === true || p.steps?.[r.id]?.completed === true));
    if (!isCompleted) return false;
    const earnedDate = p.dateCompleted || p.completedDate || p.updatedAt?.split('T')[0] || '';
    if (leaderReportMode === 'window') return isDateWithinWindow(earnedDate);
    if (leaderReportMode === 'snapshot') return isDateBeforeOrOnSnapshot(earnedDate);
    return true;
  };

  const earnedBadgesInScope = MERIT_BADGES.filter(isBadgeEarnedInMode);
  const eagleRequiredEarnedCount = earnedBadgesInScope.filter(b => b.eagleRequired).length;
  const electiveEarnedCount = earnedBadgesInScope.filter(b => !b.eagleRequired).length;

  // Islamic Knowledge
  const isIslamicTopicCompletedInMode = (topicId) => {
    const p = islamicProgress[topicId] || {};
    if (!p.completed) return false;
    const dateVal = p.completedDate || p.dateCompleted || '';
    if (leaderReportMode === 'window') return isDateWithinWindow(dateVal);
    if (leaderReportMode === 'snapshot') return isDateBeforeOrOnSnapshot(dateVal);
    return true;
  };

  const completedIslamicTopics = ISLAMIC_BASICS_TOPICS.filter(t => isIslamicTopicCompletedInMode(t.id));
  const islamicPercent = ISLAMIC_BASICS_TOPICS.length > 0 ? Math.round((completedIslamicTopics.length / ISLAMIC_BASICS_TOPICS.length) * 100) : 0;

  // Current Rank Details (For Scout Mode & Focused views)
  const currentRankObj = RANKS_DATA.find(r => r.name.toLowerCase() === scoutRank.toLowerCase()) || RANKS_DATA[0];
  const currentRankProg = ranksProgress[currentRankObj?.id] || {};
  const currentRankCompletedSteps = currentRankObj?.requirements ? currentRankObj.requirements.filter(req => {
    const s = currentRankProg.steps?.[req.id];
    const isDone = s === true || s?.completed === true;
    if (!isDone) return false;
    const d = s?.date || currentRankProg.completedDate || '';
    return isItemActiveInMode(d);
  }).length : 0;
  const currentRankTotalSteps = currentRankObj?.requirements?.length || 1;
  const currentRankPct = Math.round((currentRankCompletedSteps / currentRankTotalSteps) * 100);

  // Past Ranks
  const rankIndexMap = { scout: 0, tenderfoot: 1, secondclass: 2, firstclass: 3, star: 4, life: 5, eagle: 6 };
  const currentRankIdx = rankIndexMap[currentRankObj?.id] || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16 text-slate-900">
      {/* ── SCREEN-ONLY REPORT CONTROL TOOLBAR & MODE SELECTOR ── */}
      <div className="bg-slate-850 border border-slate-700 p-5 rounded-3xl shadow-2xl space-y-4 print-hide">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-650 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Printer className="text-emerald-400" size={18} />
                <span>Advancement & Progress Report Generator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Generating printable record for <strong className="text-amber-300">{scoutFullName}</strong> ({scoutRank})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-emerald-950/60 hover:scale-[1.02]"
          >
            <Printer size={16} />
            <span>Print Official Report (PDF)</span>
          </button>
        </div>

        {/* Leader Export Mode Selector (If Leader or Owner) */}
        {isLeaderOrOwner && (
          <div className="pt-3 border-t border-slate-750/70 space-y-3">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Filter size={13} /> Select Report Format & Filter Mode:
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setLeaderReportMode('comprehensive')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    leaderReportMode === 'comprehensive'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Layers size={13} />
                  <span>Mode A: Full Comprehensive Audit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeaderReportMode('window')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    leaderReportMode === 'window'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <CalendarRange size={13} />
                  <span>Mode B: Date Window Filter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeaderReportMode('snapshot')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    leaderReportMode === 'snapshot'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <History size={13} />
                  <span>Mode C: Historical Snapshot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeaderReportMode('scout_summary')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    leaderReportMode === 'scout_summary'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <User size={13} />
                  <span>Scout Active Summary View</span>
                </button>
              </div>
            </div>

            {/* Sub-inputs for Mode B (Window) */}
            {leaderReportMode === 'window' && (
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/40 flex flex-wrap items-center gap-4 text-xs animate-fadeIn">
                <span className="font-bold text-amber-300">Activity Window Filter:</span>
                <div className="flex items-center gap-2">
                  <label className="text-slate-400">Start Date:</label>
                  <input
                    type="date"
                    value={windowStartDate}
                    onChange={(e) => setWindowStartDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-slate-400">End Date:</label>
                  <input
                    type="date"
                    value={windowEndDate}
                    onChange={(e) => setWindowEndDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-400 italic">
                  * Only shows requirements, badges, service hours, and logs earned between these dates.
                </span>
              </div>
            )}

            {/* Sub-inputs for Mode C (Snapshot) */}
            {leaderReportMode === 'snapshot' && (
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-sky-500/40 flex flex-wrap items-center gap-4 text-xs animate-fadeIn">
                <span className="font-bold text-sky-300">Cumulative Snapshot As-of:</span>
                <div className="flex items-center gap-2">
                  <label className="text-slate-400">As-of Date:</label>
                  <input
                    type="date"
                    value={snapshotDate}
                    onChange={(e) => setSnapshotDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-400 italic">
                  * Evaluates progress up to this exact date, ignoring future completions.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ──────────────── PRINTABLE DOCUMENT CONTAINER ──────────────── */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl space-y-8 border border-slate-300 text-slate-900 print:p-0 print:border-none print:shadow-none print:m-0 print:rounded-none">
        
        {/* ── 1. OFFICIAL INK-FRIENDLY REPORT HEADER ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-slate-900 pb-5 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black shrink-0 print:border print:border-slate-900">
              ⚜️
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                DHULFIQĀR SCOUTS BSA
              </h1>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 mt-0.5">
                {leaderReportMode === 'scout_summary'
                  ? 'Official Scout Active Advancement Summary'
                  : leaderReportMode === 'window'
                  ? `Timed Activity Window Record (${windowStartDate} to ${windowEndDate})`
                  : leaderReportMode === 'snapshot'
                  ? `Historical Progress Snapshot (As of ${snapshotDate})`
                  : 'Official Comprehensive Advancement & Audit Record'}
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-700 font-mono space-y-0.5">
            <p><strong>Print Date:</strong> {reportPrintDate}</p>
            <p><strong>Unit:</strong> Taliʿa Troop 110</p>
            <p><strong>Certifying Leader:</strong> {leaderName}</p>
          </div>
        </div>

        {/* ── 2. SCOUT DEMOGRAPHICS & PROFILE BOX ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-100/70 p-4 rounded-xl border border-slate-300 text-xs">
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Scout Name</span>
            <strong className="text-sm text-slate-950 font-black">{scoutFullName}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Active Rank</span>
            <strong className="text-sm text-emerald-800 font-black uppercase">{scoutRank}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Patrol Unit</span>
            <strong className="text-xs text-slate-900 font-bold">{scoutPatrol}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">BSA Member ID</span>
            <strong className="text-xs text-slate-900 font-mono">{scoutInfo.bsaId || '—'}</strong>
          </div>
        </div>

        {/* ── 3. TOP-LEVEL KPI OVERVIEW SUMMARY ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-300 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">{scoutRank} Rank Progress</span>
            <div className="flex justify-between items-center mt-1">
              <strong className="text-base font-black text-slate-950 font-mono">{currentRankPct}%</strong>
              <span className="text-xs text-slate-600 font-mono">({currentRankCompletedSteps}/{currentRankTotalSteps})</span>
            </div>
          </div>

          <div className="bg-white border border-slate-300 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Merit Badges Earned</span>
            <div className="flex justify-between items-center mt-1">
              <strong className="text-base font-black text-slate-950 font-mono">{earnedBadgesInScope.length} Badges</strong>
              <span className="text-xs text-emerald-800 font-bold">({eagleRequiredEarnedCount} Eagle, {electiveEarnedCount} Elec)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-300 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Service Hours</span>
            <div className="flex justify-between items-center mt-1">
              <strong className="text-base font-black text-slate-950 font-mono">{totalFilteredServiceHours} Hours</strong>
              <span className="text-xs text-slate-600">({filteredServiceLogs.length} logs)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-300 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Islamic Knowledge</span>
            <div className="flex justify-between items-center mt-1">
              <strong className="text-base font-black text-slate-950 font-mono">{islamicPercent}%</strong>
              <span className="text-xs text-slate-600">({completedIslamicTopics.length}/{ISLAMIC_BASICS_TOPICS.length})</span>
            </div>
          </div>
        </div>

        {/* ── 4. RANK REQUIREMENTS SECTION ── */}
        {/* If Scout Mode: Show ONLY current rank requirements + compact past ranks badge bar */}
        {leaderReportMode === 'scout_summary' ? (
          <div className="space-y-4 page-break-avoid">
            <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-center">
              <h3 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
                <span>Current Active Rank: {scoutRank} Requirements</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700">{currentRankCompletedSteps} of {currentRankTotalSteps} Completed</span>
            </div>

            {/* Past Earned Ranks Badges */}
            <div className="flex flex-wrap gap-2">
              {RANKS_DATA.slice(0, currentRankIdx).map(pr => (
                <span key={pr.id} className="text-xs bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                  ✓ {pr.name} (Earned)
                </span>
              ))}
            </div>

            {/* Current Rank Checklist Table */}
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
                <tr>
                  <th className="p-2.5 w-16 text-center">Status</th>
                  <th className="p-2.5 w-16">Req #</th>
                  <th className="p-2.5">Requirement Description</th>
                  <th className="p-2.5 w-28 text-right">Date Signed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentRankObj?.requirements?.map((req) => {
                  const s = currentRankProg.steps?.[req.id];
                  const isDone = s === true || s?.completed === true;
                  const dateStr = s?.date || currentRankProg.completedDate || '';
                  return (
                    <tr key={req.id} className={isDone ? 'bg-emerald-50/40' : ''}>
                      <td className="p-2.5 text-center font-bold">
                        {isDone ? <span className="text-emerald-800">✓ Done</span> : <span className="text-slate-400">○ Open</span>}
                      </td>
                      <td className="p-2.5 font-bold font-mono text-slate-800">{req.id}</td>
                      <td className="p-2.5 text-slate-850">{req.text}</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">{isDone ? (dateStr || 'Verified') : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Comprehensive Leader View: All 7 Ranks */
          <div className="space-y-6 page-break-avoid">
            <div className="border-b-2 border-slate-800 pb-2">
              <h3 className="text-base font-black uppercase text-slate-950">
                BSA 7-Rank Advancement Audit Record
              </h3>
            </div>

            <div className="space-y-4">
              {RANKS_DATA.map((r) => {
                const rp = ranksProgress[r.id] || {};
                const rSteps = r.requirements || [];
                const completedSteps = rSteps.filter(req => {
                  const s = rp.steps?.[req.id];
                  const isDone = s === true || s?.completed === true;
                  if (!isDone) return false;
                  return isItemActiveInMode(s?.date || rp.completedDate || '');
                }).length;
                const isFullyEarned = rSteps.length > 0 && completedSteps === rSteps.length;

                return (
                  <div key={r.id} className="border border-slate-300 rounded-xl p-4 space-y-2.5 page-break-avoid">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-slate-950">{r.name} Rank</strong>
                        {isFullyEarned && <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded">✓ Completed</span>}
                      </div>
                      <span className="text-xs font-mono text-slate-700">{completedSteps} / {rSteps.length} Steps</span>
                    </div>

                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-slate-100">
                        {rSteps.map(req => {
                          const s = rp.steps?.[req.id];
                          const isDone = s === true || s?.completed === true;
                          const dateVal = s?.date || rp.completedDate || '';
                          return (
                            <tr key={req.id}>
                              <td className="py-1.5 w-12 font-bold font-mono text-slate-700">{req.id}</td>
                              <td className="py-1.5 text-slate-800">{req.text}</td>
                              <td className="py-1.5 w-24 text-right font-mono font-semibold">
                                {isDone ? (
                                  <span className="text-emerald-800">✓ {dateVal || 'Passed'}</span>
                                ) : (
                                  <span className="text-slate-400">Needed</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 5. MERIT BADGES INVENTORY & COUNSELORS ── */}
        <div className="space-y-3 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950">
              Merit Badges Record ({earnedBadgesInScope.length} Earned)
            </h3>
            <span className="text-xs font-mono text-slate-700">14 Eagle Required Target</span>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-2.5">Badge Title</th>
                <th className="p-2.5 w-32">Classification</th>
                <th className="p-2.5 w-32">Date Completed</th>
                <th className="p-2.5 w-40">Counselor / Signer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {earnedBadgesInScope.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500 italic">No merit badges recorded in this timeframe.</td>
                </tr>
              ) : (
                earnedBadgesInScope.map(b => {
                  const p = meritProgress[b.id] || {};
                  return (
                    <tr key={b.id}>
                      <td className="p-2.5 font-bold text-slate-950">{b.name}</td>
                      <td className="p-2.5 font-semibold">
                        {b.eagleRequired ? (
                          <span className="text-emerald-800 font-black">Eagle-Required</span>
                        ) : (
                          <span className="text-slate-600">Elective</span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono text-slate-700">{p.dateCompleted || p.completedDate || 'Verified'}</td>
                      <td className="p-2.5 text-slate-700">{p.counselorName || 'Troop Counselor'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 6. SERVICE & VOLUNTEERING LOGS ── */}
        <div className="space-y-3 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950">
              Community Service & Volunteering Record ({totalFilteredServiceHours} Total Hours)
            </h3>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-2.5 w-24">Date</th>
                <th className="p-2.5">Project / Activity Description</th>
                <th className="p-2.5 w-28">Category</th>
                <th className="p-2.5 w-20 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredServiceLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500 italic">No service logs recorded in this period.</td>
                </tr>
              ) : (
                filteredServiceLogs.map(l => (
                  <tr key={l.id}>
                    <td className="p-2.5 font-mono text-slate-700">{l.date}</td>
                    <td className="p-2.5 font-bold text-slate-950">{l.description || l.title || 'Community Service'}</td>
                    <td className="p-2.5 text-slate-600 capitalize">{l.category || 'General'}</td>
                    <td className="p-2.5 text-right font-black font-mono text-slate-950">{l.hours} hrs</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── 7. ASSIGNED HOMEWORK & TROOP EVENTS (Scout Mode & Comprehensive) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 page-break-avoid">
          {/* Homework */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
              Homework & Tasks Record
            </h4>
            <div className="space-y-1.5 text-xs">
              {assignmentsList.slice(0, 5).map(a => {
                const sub = scoutSubmissions[a.id];
                const isSubmitted = !!sub?.completed || !!sub?.submittedDate;
                return (
                  <div key={a.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{a.title}</span>
                    <span className={`font-mono text-[10px] font-bold ${isSubmitted ? 'text-emerald-800' : 'text-slate-500'}`}>
                      {isSubmitted ? '✓ Submitted' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
              Troop Events & Campouts
            </h4>
            <div className="space-y-1.5 text-xs">
              {eventsList.slice(0, 5).map(ev => (
                <div key={ev.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <strong className="text-slate-900 block truncate max-w-[180px]">{ev.title}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">{ev.date}</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 8. LEADER PRIVATE NOTES & AUDIT COMMENTS (Comprehensive Leader View Only) ── */}
        {isLeaderOrOwner && leaderReportMode === 'comprehensive' && (
          <div className="space-y-3 page-break-avoid border-t-2 border-slate-800 pt-4">
            <h3 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
              <Lock size={16} className="text-slate-700" />
              <span>Confidential Leader Notes & Scout Conference Log</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
              {leaderNotes || 'No private leader notes recorded for this candidate.'}
            </div>
          </div>
        )}

        {/* ── 9. OFFICIAL VERIFICATION & SIGNATURE BLOCK ── */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs page-break-avoid">
          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Scoutmaster Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Committee Chair Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Scout Candidate Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
