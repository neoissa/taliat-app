import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc 
} from 'firebase/firestore';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Star, 
  Trophy, 
  User, 
  Video, 
  ChevronRight, 
  Shield, 
  ShieldCheck, 
  Flame, 
  Target, 
  Compass, 
  Heart, 
  MapPin, 
  Check, 
  ArrowRight, 
  Zap, 
  AlertTriangle, 
  AlertCircle, 
  Bell, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  GraduationCap, 
  Radio, 
  CheckSquare, 
  HelpCircle, 
  PlayCircle, 
  Info, 
  Users, 
  Bookmark, 
  FileCheck, 
  Layers, 
  FileCode 
} from 'lucide-react';
import RankIcon from './RankIcon';
import AssignmentsManager from './AssignmentsManager';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import LiveClockAndCalendar from './LiveClockAndCalendar';
import { RANKS_DATA, getLatestAchievedRank, getNextIncompleteRank, getRankCompletionPercentage } from '../data/ranksData';
import { MERIT_BADGES } from '../data/meritBadges';
import { getEventAudienceInfo } from '../utils/kashafVoice';
import PublishedReportViewerModal from './PublishedReportViewerModal';
import { getRecommendedBadges } from '../utils/badgeRecommendations';
import { MERIT_BADGE_COUNSELORS } from '../data/counselorsData';
import StatusBadge from './StatusBadge';
import { calculateScoutCompliance } from '../utils/attendanceCompliance';

export default function StudentHome({ currentUser, onNavigate, unreadChatCount = 0 }) {
  const [ranksProgress, setRanksProgress] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [publishedReports, setPublishedReports] = useState([]);
  const [viewingPublishedReport, setViewingPublishedReport] = useState(null);
  const [meritBadgesCount, setMeritBadgesCount] = useState(0);
  const [meritBadgesProgress, setMeritBadgesProgress] = useState({});
  const [serviceHours, setServiceHours] = useState(0);
  const [eagleData, setEagleData] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [homeworkList, setHomeworkList] = useState([]);
  const [scoutHomeworkProgress, setScoutHomeworkProgress] = useState({});
  const [activeGuideTab, setActiveGuideTab] = useState('advancement'); // 'advancement' | 'homework' | 'eagle' | 'patrol' | 'schedule' | 'profile'
  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 0,
    presentCount: 0,
    absentCount: 0,
    excusedCount: 0,
    lateCount: 0,
    attendanceRate: 100,
    riskLevel: 'green' // 'green' | 'yellow' | 'red'
  });
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showScoutGuide, setShowScoutGuide] = useState(true);
  const [loading, setLoading] = useState(true);

  const scoutUid = currentUser?.uid;

  // 0. Subscribe to Assignments and Scout Homework Records
  useEffect(() => {
    if (!scoutUid) return;

    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
      setHomeworkList(list);
    }, (err) => console.warn("Homework load fallback:", err));

    const unsubHw = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setScoutHomeworkProgress(prev => ({ ...prev, ...map }));
    }, (err) => console.warn("Scout homework load fallback:", err));

    const unsubProg = onSnapshot(collection(db, 'user_progress', scoutUid, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[`${d.id}_${scoutUid}`] = d.data(); });
      setScoutHomeworkProgress(prev => ({ ...prev, ...map }));
    }, (err) => console.warn("Scout prog assignments fallback:", err));

    return () => {
      unsubAssign();
      unsubHw();
      unsubProg();
    };
  }, [scoutUid]);

  // 1. Subscribe to scout's rank progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'ranks'), (snap) => {
      const pMap = {};
      snap.docs.forEach(d => {
        pMap[d.id] = d.data();
      });
      setRanksProgress(pMap);
      setLoading(false);
    }, (err) => {
      console.warn("Rank progress load fallback:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [scoutUid]);

  // 2. Subscribe to upcoming events and groups
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const upcoming = list.filter(ev => (ev.date || '9999-12-31') >= today);
      upcoming.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setUpcomingEvents(upcoming.slice(0, 4));
    }, (err) => console.warn("Events load fallback:", err));

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn("Groups load fallback:", err));

    return () => {
      unsubEvents();
      unsubGroups();
    };
  }, []);

  // 2.5. Subscribe to published progress reports for scout
  useEffect(() => {
    if (!scoutUid) return;
    const unsubPub = onSnapshot(collection(db, 'published_reports'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.scoutId === scoutUid);
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      setPublishedReports(list);
    }, (err) => console.warn("Scout published reports listener fallback:", err));
    return () => unsubPub();
  }, [scoutUid]);

  // 2.7. Subscribe to Scout Notifications (Pushed & Subcollection)
  useEffect(() => {
    if (!scoutUid) return;
    const unsubs = [];

    unsubs.push(onSnapshot(collection(db, 'scout_notifications'), (snap) => {
      const count = snap.docs
        .map(d => d.data())
        .filter(n => (!n.recipientUid || n.recipientUid === scoutUid || n.scoutEmail === currentUser?.email) && !n.read && !n.isRead).length;
      setUnreadNotifsCount(count);
    }, (err) => console.warn("Scout notifications listener fallback:", err)));

    unsubs.push(onSnapshot(collection(db, 'users', scoutUid, 'notifications'), (snap) => {
      const subCount = snap.docs.filter(d => !d.data().read && !d.data().isRead).length;
      if (subCount > 0) {
        setUnreadNotifsCount(prev => Math.max(prev, subCount));
      }
    }, (err) => console.warn("Subcol notifications listener fallback:", err)));

    return () => unsubs.forEach(u => u());
  }, [scoutUid, currentUser?.email]);

  // 3. Subscribe to merit badges completed
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      let count = 0;
      const pMap = {};
      snap.docs.forEach(d => {
        const data = d.data();
        pMap[d.id] = data;
        if (data.completed || (data.steps && Object.values(data.steps).every(v => v === true || v?.completed === true))) {
          count++;
        }
      });
      setMeritBadgesProgress(pMap);
      setMeritBadgesCount(count);
    }, (err) => console.warn("Merit badge count fallback:", err));

    return () => unsub();
  }, [scoutUid]);

  // 4. Subscribe to service logs
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'service_logs'), (snap) => {
      let total = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        if ((data.scoutId === scoutUid || data.userId === scoutUid) && data.hours) {
          total += Number(data.hours) || 0;
        }
      });
      setServiceHours(total);
    }, (err) => console.warn("Service hours fallback:", err));

    return () => unsub();
  }, [scoutUid]);

  // 4.5. Subscribe to Islamic Knowledge progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'user_progress', scoutUid, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) {
        setIslamicProgress(snap.data() || {});
      }
    }, (err) => console.warn("Islamic progress fallback:", err));
    return () => unsub();
  }, [scoutUid]);

  // 5. Subscribe to Road to Eagle data
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'data'), (snap) => {
      if (snap.exists()) {
        setEagleData(snap.data());
      }
    }, (err) => console.warn("Eagle progress listener fallback:", err));
    return () => unsub();
  }, [scoutUid]);

  // 6. Subscribe to attendance sessions for scout
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const allSessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const compliance = calculateScoutCompliance(scoutUid, allSessions, { filterMode: 'tracked_only' });

      setAttendanceStats({
        totalSessions: compliance.totalSessions,
        presentCount: compliance.presentCount,
        absentCount: compliance.absentCount,
        excusedCount: compliance.excusedCount,
        lateCount: compliance.lateCount,
        attendanceRate: compliance.attendanceRate,
        riskLevel: compliance.riskLevel,
        totalHours: compliance.totalTrackedHours,
        campingNights: compliance.totalCampingNights,
        fridayHours: compliance.totalFridayHours,
        fridaySessions: compliance.fridaySessions,
        mandatoryEvents: compliance.mandatoryEvents,
        isEligibleForAdvancement: compliance.isEligibleForAdvancement
      });
    }, (err) => console.warn("Attendance stats fallback:", err));

    return () => unsub();
  }, [scoutUid]);

  const latestAchievedRank = getLatestAchievedRank(ranksProgress, currentUser?.rank);
  const nextTargetRank = getNextIncompleteRank(ranksProgress);
  const activeRank = latestAchievedRank.name;
  const targetRankProgress = getRankCompletionPercentage(nextTargetRank.id, ranksProgress);

  // Real-time pending items count
  const pendingIslamicCount = Object.values(islamicProgress).filter(p => (p?.pending && !p?.completed) || p === 'pending').length;
  const pendingRanksCount = Object.values(ranksProgress).reduce((acc, rank) => {
    const steps = rank?.completedRequirements || rank?.steps || {};
    return acc + Object.values(steps).filter(s => (s?.pending === true || s === 'pending') && !s?.completed).length;
  }, 0);
  const totalPendingPortalItems = pendingIslamicCount + pendingRanksCount;

  // Calculate Eagle progress quick metrics
  const eagleRequiredCount = eagleData?.meritBadgesSummary?.eagleRequiredCount || 0;
  const projectStage = eagleData?.eagleProject?.stage || 'proposal';
  const projectDone = !!(eagleData?.eagleProject?.workbookCompleted && eagleData?.eagleProject?.districtApproval);
  const totalPalms = eagleData?.eaglePalms?.totalPalms || 0;

  // Compute smart recommended merit badges
  const recommendedBadges = getRecommendedBadges(currentUser, meritBadgesProgress);

  // Filter relevant homework for this scout
  const scoutAssignedHomework = useMemo(() => {
    return homeworkList.filter(a => {
      if (a.assignedTarget === 'patrol' && currentUser?.groupId && a.targetGroupId !== currentUser.groupId) return false;
      if (a.assignedTarget === 'scout' && a.targetScoutUid !== scoutUid) return false;
      return true;
    });
  }, [homeworkList, currentUser?.groupId, scoutUid]);

  // Comprehensive real-time homework analysis
  const homeworkAnalysis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let completedCount = 0;
    let submittedCount = 0;
    let overdueCount = 0;
    let dueTodayCount = 0;
    let pendingCount = 0;

    const activeTasks = [];

    scoutAssignedHomework.forEach(a => {
      const key = `${a.id}_${scoutUid}`;
      const rec = scoutHomeworkProgress[key] || {};
      const isCompleted = !!(rec.isCompleted || rec.status === 'completed' || rec.verifiedByLeader || (rec.completed && !rec.pending));
      const isSubmitted = rec.status === 'submitted' || (!!rec.submittedAt && !isCompleted);

      if (isCompleted) {
        completedCount++;
        return;
      }

      pendingCount++;
      if (isSubmitted) {
        submittedCount++;
      }

      let isOverdue = false;
      let diffDays = null;
      if (a.dueDate) {
        const due = new Date(a.dueDate);
        due.setHours(0, 0, 0, 0);
        diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          isOverdue = true;
          overdueCount++;
        } else if (diffDays === 0) {
          dueTodayCount++;
        }
      }

      activeTasks.push({
        ...a,
        record: rec,
        isSubmitted,
        isOverdue,
        diffDays,
        dueLabel: isSubmitted 
          ? 'Submitted (In Review)'
          : isOverdue 
          ? `Overdue (${Math.abs(diffDays)}d late)`
          : diffDays === 0 
          ? 'Due Today'
          : diffDays === 1
          ? 'Due Tomorrow'
          : diffDays !== null
          ? `Due in ${diffDays}d`
          : 'Assigned'
      });
    });

    // Sort active tasks: overdue first, then due today, then closest due date
    activeTasks.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
    });

    const urgentTask = activeTasks.length > 0 ? activeTasks[0] : null;

    return {
      totalAssigned: scoutAssignedHomework.length,
      completedCount,
      submittedCount,
      overdueCount,
      dueTodayCount,
      pendingCount,
      activeTasks,
      urgentTask
    };
  }, [scoutAssignedHomework, scoutHomeworkProgress, scoutUid]);

  return (
    <div className="space-y-3.5 pb-6">
      {/* ── 1. WELCOME HERO CARD ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-4 top-2 opacity-5 pointer-events-none">
          <Trophy size={180} className="text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 flex items-center justify-center p-2 shadow-xl shadow-emerald-950/50 shrink-0">
              <RankIcon rankId={latestAchievedRank.id} className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 drop-shadow-md" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <span>⚜️</span>
                  <span>{activeRank} Rank</span>
                </span>
                {currentUser?.patrolName && (
                  <span className="inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    <span>🏕️</span>
                    <span>{currentUser.patrolName} Patrol</span>
                  </span>
                )}
                {nextTargetRank.id !== latestAchievedRank.id && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    <span>Target: {nextTargetRank.name}</span>
                    <span className="font-mono text-[11px] opacity-80">({targetRankProgress.percentage}%)</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || 'Scout'}!</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Dhulfiqār Scouting Hub &bull; Master outdoor skills, complete weekly homework, earn merit badges, and advance on your Road to Eagle.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('advancement')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
            >
              <Award size={14} />
              <span>⚜️ My Advancement</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('assignments')}
              className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-950/40 hover:scale-[1.02]"
            >
              <BookOpen size={14} />
              <span>Weekly Homework</span>
              {homeworkAnalysis.pendingCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  homeworkAnalysis.overdueCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-orange-950 text-orange-200'
                }`}>
                  {homeworkAnalysis.pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('road-to-eagle')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xl shadow-amber-950/60 hover:scale-[1.02]"
            >
              <span>🦅 Road to Eagle</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPendingModal(true)}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-extrabold text-xs px-3.5 py-2 sm:py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 hover:border-slate-600"
            >
              <Clock size={14} className={totalPendingPortalItems > 0 ? "text-amber-400 animate-pulse" : "text-slate-400"} />
              <span>Pending Tasks ({totalPendingPortalItems})</span>
              {unreadNotifsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>
          </div>
        </div>

        {/* ── Streamlined 5-Item Horizontal Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-4 border-t border-slate-750/70 relative z-10 text-xs">
          {/* 1. Active Rank */}
          <div 
            onClick={() => onNavigate && onNavigate('advancement')}
            className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 shadow-xs cursor-pointer transition hover:bg-slate-900"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Current Rank</span>
              <strong className="text-xs sm:text-sm font-black text-emerald-400 capitalize block truncate">
                {activeRank}
              </strong>
            </div>
          </div>

          {/* 2. Weekly Homework Tile */}
          <div 
            onClick={() => onNavigate && onNavigate('assignments')}
            className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition border shadow-xs ${
              homeworkAnalysis.overdueCount > 0
                ? 'bg-rose-950/40 border-rose-500/60 hover:border-rose-400'
                : homeworkAnalysis.dueTodayCount > 0
                ? 'bg-amber-950/40 border-amber-500/60 hover:border-amber-400'
                : homeworkAnalysis.pendingCount > 0
                ? 'bg-orange-950/30 border-orange-500/40 hover:border-orange-400'
                : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              homeworkAnalysis.overdueCount > 0
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : homeworkAnalysis.dueTodayCount > 0
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : homeworkAnalysis.pendingCount > 0
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              <BookOpen size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] block uppercase font-bold tracking-wider ${
                  homeworkAnalysis.overdueCount > 0 ? 'text-rose-400' : homeworkAnalysis.dueTodayCount > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}>Homework</span>
                {homeworkAnalysis.overdueCount > 0 ? (
                  <span className="text-[9px] px-1 rounded font-bold uppercase bg-rose-500/30 text-rose-300">Late</span>
                ) : homeworkAnalysis.dueTodayCount > 0 ? (
                  <span className="text-[9px] px-1 rounded font-bold uppercase bg-amber-500/30 text-amber-300">Today</span>
                ) : null}
              </div>
              <strong className="text-xs sm:text-sm font-black text-white block truncate">
                {homeworkAnalysis.completedCount} / {homeworkAnalysis.totalAssigned} Done
              </strong>
            </div>
          </div>

          {/* 3. Attendance Standing Tile */}
          <div 
            onClick={() => onNavigate && onNavigate('profile', 'attendance')}
            className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition border shadow-xs ${
              attendanceStats.riskLevel === 'red'
                ? 'bg-rose-950/40 border-rose-500/60 hover:border-rose-400'
                : attendanceStats.riskLevel === 'yellow'
                ? 'bg-amber-950/40 border-amber-500/60 hover:border-amber-400'
                : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              attendanceStats.riskLevel === 'red'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : attendanceStats.riskLevel === 'yellow'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              <Calendar size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] block uppercase font-bold tracking-wider ${
                  attendanceStats.riskLevel === 'red' ? 'text-rose-400' : attendanceStats.riskLevel === 'yellow' ? 'text-amber-400' : 'text-slate-400'
                }`}>Attendance</span>
                {attendanceStats.riskLevel !== 'green' && (
                  <span className={`text-[9px] px-1 rounded font-bold uppercase ${
                    attendanceStats.riskLevel === 'red' ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'
                  }`}>Alert</span>
                )}
              </div>
              <strong className="text-xs sm:text-sm font-black text-white block truncate">
                {attendanceStats.attendanceRate}% ({attendanceStats.presentCount}/{attendanceStats.totalSessions})
              </strong>
            </div>
          </div>

          {/* 4. Merit Badges */}
          <div 
            onClick={() => onNavigate && onNavigate('merit-badges')}
            className="bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs hover:bg-slate-900"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Star size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Merit Badges</span>
              <strong className="text-xs sm:text-sm font-black text-amber-400 block truncate">
                {meritBadgesCount} / 21 Earned
              </strong>
            </div>
          </div>

          {/* 5. Service Hours */}
          <div 
            onClick={() => onNavigate && onNavigate('service-log')}
            className="bg-slate-900/80 border border-slate-800 hover:border-sky-400/50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs hover:bg-slate-900"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Heart size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Service Hours</span>
              <strong className="text-xs sm:text-sm font-black text-sky-400 block truncate">
                {serviceHours} Hours
              </strong>
            </div>
          </div>
        </div>

        {/* ── SCOUT MODULES QUICK LAUNCHPAD ── */}
        <div className="mt-4 pt-4 border-t border-slate-750/70">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>⚜️ Scout Command Modules</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold lowercase">7 interactive tools</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
            <button
              onClick={() => onNavigate && onNavigate('advancement-hub')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <Award size={15} />
                </div>
                <span className="text-xs font-black text-white group-hover:text-emerald-300 transition">My Advancement</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">7 Ranks, Handbooks & Videos</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('assignments')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
                  <BookOpen size={15} />
                </div>
                <div className="flex items-center justify-between gap-1 flex-1 min-w-0">
                  <span className="text-xs font-black text-white group-hover:text-orange-300 transition">Weekly Homework</span>
                  {homeworkAnalysis.pendingCount > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      homeworkAnalysis.overdueCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-orange-500 text-slate-950'
                    }`}>
                      {homeworkAnalysis.pendingCount}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Challenges & Submissions</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('events')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                  <Calendar size={15} />
                </div>
                <span className="text-xs font-black text-white group-hover:text-sky-300 transition">Troop Schedule</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Events, Meetings & RSVPs</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('knowledge-hub')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <GraduationCap size={15} />
                </div>
                <span className="text-xs font-black text-white group-hover:text-emerald-300 transition">Islamic Tarbiyah</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Duas, Quran & Ethics</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('tarbiyah-hub')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                  <MessageSquare size={15} />
                </div>
                <div className="flex items-center justify-between gap-1 flex-1 min-w-0">
                  <span className="text-xs font-black text-white group-hover:text-indigo-300 transition">Patrol Chat</span>
                  {unreadChatCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0">
                      {unreadChatCount}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Encrypted Messenger & Halqas</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('journal')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                  <FileText size={15} />
                </div>
                <span className="text-xs font-black text-white group-hover:text-amber-300 transition">Field Notes</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Reflections & Logs</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('profile')}
              className="p-2.5 sm:p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left transition group cursor-pointer shadow-xs col-span-2 sm:col-span-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                  <User size={15} />
                </div>
                <span className="text-xs font-black text-white group-hover:text-purple-300 transition">My Profile</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Scout Record & Settings</p>
            </button>
          </div>
        </div>
      </div>

      {/* ── 1.2. ACTIVE WEEKLY HOMEWORK & ACTION REMINDER BANNER ── */}
      {homeworkAnalysis.urgentTask ? (
        <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl border transition-all duration-300 ${
          homeworkAnalysis.urgentTask.isOverdue
            ? 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/40 border-rose-500/60 shadow-rose-950/30'
            : homeworkAnalysis.urgentTask.diffDays === 0
            ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border-amber-500/60 shadow-amber-950/30'
            : 'bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-850 border-orange-500/40 shadow-orange-950/30'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg border ${
                homeworkAnalysis.urgentTask.isOverdue
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : homeworkAnalysis.urgentTask.diffDays === 0
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-orange-500/20 border-orange-500/50 text-orange-300'
              }`}>
                {homeworkAnalysis.urgentTask.type === 'video' ? '🎬' : '📝'}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    homeworkAnalysis.urgentTask.isOverdue
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : homeworkAnalysis.urgentTask.diffDays === 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  }`}>
                    {homeworkAnalysis.urgentTask.isOverdue 
                      ? '🚨 Overdue Homework' 
                      : homeworkAnalysis.urgentTask.diffDays === 0 
                      ? '⚡ Due Today' 
                      : '📚 Active Homework'}
                  </span>
                  <span className="text-[11px] text-slate-300 font-semibold">
                    {homeworkAnalysis.urgentTask.category || 'Scouting Skills'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    &bull; {homeworkAnalysis.pendingCount} of {homeworkAnalysis.totalAssigned} Tasks Remaining
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>{homeworkAnalysis.urgentTask.title}</span>
                </h3>

                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl line-clamp-1">
                  {homeworkAnalysis.urgentTask.description || 'Watch the video lesson or complete the worksheet to submit for Scoutmaster review.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('assignments')}
                className={`font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg hover:scale-[1.02] ${
                  homeworkAnalysis.urgentTask.isOverdue
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                    : homeworkAnalysis.urgentTask.diffDays === 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-950/50'
                }`}
              >
                <span>{homeworkAnalysis.urgentTask.isSubmitted ? 'View Submission' : 'Start & Submit Assignment'}</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('assignments')}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                All Homework
              </button>
            </div>
          </div>
        </div>
      ) : homeworkAnalysis.totalAssigned > 0 && homeworkAnalysis.pendingCount === 0 ? (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border border-emerald-500/40 p-3.5 sm:p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-base shrink-0">
              ✓
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                🎉 All Weekly Homework Up To Date!
              </h4>
              <p className="text-[11px] text-slate-350">
                You've completed all {homeworkAnalysis.completedCount} assigned challenges. Keep up the high standard of excellence!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('assignments')}
            className="text-xs bg-slate-800 hover:bg-slate-750 text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer shrink-0"
          >
            Review Archive
          </button>
        </div>
      ) : null}

      {/* ── 1.4. SCOUT QUICK START & INTERACTIVE APP ORIENTATION GUIDE ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-lg transition space-y-3.5">
        <div 
          onClick={() => setShowScoutGuide(!showScoutGuide)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2 flex-wrap">
                <span>⚜️ Scout Quick Start & Interactive App Guide</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold uppercase">
                  Orientation
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Learn how to submit rank requirements, do weekly homework, chat with your patrol, and track your Road to Eagle.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold p-1 rounded-lg bg-slate-800 group-hover:bg-slate-750 transition cursor-pointer"
          >
            {showScoutGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showScoutGuide && (
          <div className="space-y-3 pt-3 border-t border-slate-800/80 animate-fadeIn text-xs">
            {/* Guide Interactive Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveGuideTab('advancement')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeGuideTab === 'advancement'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750'
                }`}
              >
                <Award size={13} />
                <span>1. Rank Advancement</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('homework')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeGuideTab === 'homework'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-950/50'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750'
                }`}
              >
                <BookOpen size={13} />
                <span>2. Weekly Homework</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('eagle')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeGuideTab === 'eagle'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-950/50'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750'
                }`}
              >
                <Star size={13} />
                <span>3. Road to Eagle</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('patrol')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeGuideTab === 'patrol'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750'
                }`}
              >
                <MessageSquare size={13} />
                <span>4. Patrol Chat & Voice</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('schedule')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeGuideTab === 'schedule'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750'
                }`}
              >
                <Calendar size={13} />
                <span>5. Schedule & Roll Call</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('profile')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeGuideTab === 'profile'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750'
                }`}
              >
                <User size={13} />
                <span>6. Digital ID & Profile</span>
              </button>
            </div>

            {/* Guide Tab Body */}
            {activeGuideTab === 'advancement' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ⚜️
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">How Rank Advancement & Testing Works</h4>
                      <p className="text-[11px] text-slate-400">Step-by-step path from Scout to Tenderfoot, Second Class, First Class, Star, Life & Eagle</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('advancement')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Open My Advancement</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>1️⃣</span> Learn the Skill
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Practice knots, first aid, outdoor cooking, and pioneering with your patrol during Friday meetings and campouts.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <span>2️⃣</span> Click to Request Test
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      In <strong>My Advancement</strong>, tap the circle next to any requirement. It will mark it as <em>Pending Oral Review</em> for your Scoutmaster.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <span>3️⃣</span> Oral Test & Sign-off
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Demonstrate the skill to your Scoutmaster. When approved, your rank percentage increases immediately toward your next badge!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'homework' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                      📚
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">How Weekly Homework & Challenges Work</h4>
                      <p className="text-[11px] text-slate-400">Instructional video lessons, skill worksheets, and submission for Patrol Leader review</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('assignments')}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Open Weekly Homework</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-orange-400 font-bold flex items-center gap-1">
                      <span>🎬</span> 1. Watch & Study
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Open active assignments to watch YouTube scouting video tutorials and study assigned reading materials.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <span>📝</span> 2. Write Responses
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Answer the reflection prompts and worksheet questions in the text field or attach documentation links.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>✅</span> 3. Submit for Sign-off
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Tap <strong>Submit Homework</strong>. Your Patrol Leader or Scoutmaster will grade it and award completion credits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'eagle' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      🦅
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">How Merit Badges & The Road to Eagle Work</h4>
                      <p className="text-[11px] text-slate-400">21 Merit Badges, Eagle Service Projects, and Board of Review milestones</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('road-to-eagle')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Explore Road to Eagle</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <span>🎖️</span> 14 Eagle-Required
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Complete Camping, First Aid, Citizenship in Society, Environmental Science, Swimming, and other core badges.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>🌟</span> 7 Elective Badges
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Choose 7 elective badges matched with our in-house certified troop counselors covering 27+ subject specialties.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      <span>🛠️</span> Eagle Service Project
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Plan and lead a community leadership project using the multi-stage digital workbook tracker before age 18.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'patrol' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      💬
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">How Patrol Chat & Voice Messenger Works</h4>
                      <p className="text-[11px] text-slate-400">Encrypted messaging, audio voice notes, pinned packing lists, and Google Meet</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('tarbiyah-hub', { subTab: 'chat' })}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Launch Patrol Hub</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      <span>🎙️</span> Audio Voice Memos
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Tap the Mic button to record audio notes with interactive waveform playback ($1.5\times$ and $2\times$ speeds).
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <span>📌</span> Pinned Announcements
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      View important leader notices and star critical messages to save packing lists and meet locations to your drawer.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <span>📹</span> Video Huddles
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Join weekly online patrol halqas and virtual skill reviews directly via the Patrol Meeting tab.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'schedule' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                      📅
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">How Troop Schedule & Roll Call Works</h4>
                      <p className="text-[11px] text-slate-400">Friday halqas, weekend campouts, RSVPs, and attendance standing</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('events')}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>View Troop Calendar</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <span>🗓️</span> Master Calendar
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Check meeting dates, timings, venue addresses, and specific packing lists for every troop gathering.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>🎯</span> Attendance Standing
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Attend regularly to maintain a green standing. Roll call is taken every session and syncs to your advancement record.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <span>📝</span> Absence Notices
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      If you are sick or travelling, submit an excuse note from your profile so your absence is marked as <em>Excused</em>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'profile' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      🪪
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">How Digital Scout ID & Profile Records Work</h4>
                      <p className="text-[11px] text-slate-400">Digital troop ID card, medical forms, uniform inspection, and official report signatures</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('profile')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Open Scout Profile</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      <span>🪪</span> Digital ID Card
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Show your official troop card with QR code, BSA ID, rank credentials, and emergency contact numbers.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <span>🏥</span> Medical Readiness
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Ensure your BSA Annual Health & Medical Record (Parts A/B/C) and allergy notes are always up to date.
                    </p>
                  </div>
                  <div className="bg-slate-850/80 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>✍️</span> Digital Signatures
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      Digitally sign official published progress reports and advancement certificates directly on your phone or tablet.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 1.5. COMPACT ATTENDANCE RISK ADVISORY (Only when attention needed) ── */}
      {attendanceStats.riskLevel !== 'green' && (
        <div 
          onClick={() => onNavigate && onNavigate('profile', 'attendance')}
          className={`rounded-2xl p-3.5 sm:p-4 shadow-lg border transition cursor-pointer ${
            attendanceStats.riskLevel === 'red'
              ? 'bg-rose-950/60 border-rose-500/80 hover:border-rose-400'
              : 'bg-amber-950/60 border-amber-500/80 hover:border-amber-400'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                attendanceStats.riskLevel === 'red'
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
              }`}>
                {attendanceStats.riskLevel === 'red' ? <AlertCircle size={18} /> : <AlertTriangle size={18} />}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge 
                    type={attendanceStats.riskLevel === 'red' ? 'danger' : 'warning'} 
                    size="xs"
                    label={attendanceStats.riskLevel === 'red' ? 'Critical Attendance Warning' : 'Attendance Notice'}
                  />
                  <span className="text-xs text-slate-200 font-bold">
                    {attendanceStats.absentCount} Absences Recorded ({attendanceStats.attendanceRate}% attendance rate)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {attendanceStats.riskLevel === 'red'
                    ? 'Unexcused absences exceed standard guidelines. Speak with your patrol leader to discuss makeup options.'
                    : 'Remember to notify your patrol leader ahead of time when absent so sessions can be excused.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate && onNavigate('profile', 'attendance');
              }}
              className={`font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0 self-start sm:self-center ${
                attendanceStats.riskLevel === 'red'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <span>View Attendance Log</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATION BANNER: OFFICIAL PROGRESS REPORT PUBLISHED ── */}
      {publishedReports.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-sky-950/30 border border-emerald-500/40 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-lg shrink-0 shadow-md">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge type="success" size="xs" label="Official Progress Report Published" />
                {!publishedReports[0].signatures?.scout?.signed ? (
                  <StatusBadge type="warning" size="xs" pulse label="✍️ Scout Signature Requested" />
                ) : (
                  <StatusBadge type="success" size="xs" label="✓ Candidate Signed" />
                )}
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-1">
                Unit Leader {publishedReports[0].leaderName} certified your {publishedReports[0].reportSnapshot?.rank || activeRank} Rank Advancement Snapshot
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Published {publishedReports[0].publishedAt?.split('T')[0]} &bull; Parent Status: {publishedReports[0].signatures?.parent?.signed ? '✓ Signed by Parent' : '⏳ Awaiting Parent Review'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setViewingPublishedReport(publishedReports[0])}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
            >
              <FileText size={14} />
              <span>{!publishedReports[0].signatures?.scout?.signed ? 'Review & Sign Report' : 'Inspect Certified PDF'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('profile', { tab: 'reports' })}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-750 transition cursor-pointer"
            >
              View in Profile
            </button>
          </div>
        </div>
      )}



      {/* ── 2.5. SMART MERIT BADGE RECOMMENDATIONS & TROOP COUNSELORS ── */}
      {recommendedBadges.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    <span>⚜️ Fast-Track Merit Badges</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    27+ Subjects With Certified Counselors
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Recommended For Your Next Rank & Eagle Pathway
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('merit-badges')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
              >
                <span>Browse All Badges</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {recommendedBadges.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                onClick={() => onNavigate && onNavigate('merit-badges')}
                className="bg-slate-900/85 border border-slate-800/80 hover:border-emerald-500/50 p-3.5 rounded-xl flex flex-col justify-between gap-2.5 cursor-pointer transition-all duration-200 group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      {rec.eagleRequired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">
                          Eagle Req.
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                          Elective
                        </span>
                      )}
                      {rec.hasInHouseCounselor && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          In-House
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {rec.score}% Match
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition">
                    {rec.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                    {rec.mainReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">Counselor: <strong className="text-white">{rec.counselorName}</strong></span>
                  <ChevronRight size={13} className="text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. SCOUT HOMEWORK & DUE TASKS (VIDEOS & WORKSHEETS) ── */}
      <AssignmentsManager currentUser={currentUser} scoutId={currentUser?.uid} isEmbeddedInProfile={false} />

      {/* ── 4. UPCOMING PLANNED EVENTS ── */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="text-emerald-400" size={18} />
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              Upcoming Troop Events & Campouts
            </h3>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('events')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-900/50 rounded-xl border border-slate-800/80">
            🏕️ No upcoming troop events scheduled right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingEvents.map(ev => {
              const isToday = ev.date === new Date().toISOString().split('T')[0];
              const aud = getEventAudienceInfo(ev, currentUser, groups);
              return (
                <div
                  key={ev.id}
                  className="bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 p-3.5 rounded-xl flex items-center justify-between gap-3 transition-all duration-200 shadow-xs hover:shadow-md"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge type="info" size="xs" label={ev.date} />
                      {ev.time && (
                        <StatusBadge type="neutral" size="xs" label={ev.time} />
                      )}
                      {isToday && (
                        <StatusBadge type="danger" size="xs" pulse label="TODAY!" />
                      )}
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${aud.colorClass}`}>
                        <span>{aud.icon}</span>
                        <span className="font-bold">{aud.badge}</span>
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-white truncate">{ev.title}</h4>
                    {ev.location && (
                      <p className="text-xs text-emerald-300 flex items-center gap-1.5 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg w-fit max-w-full mt-1">
                        <MapPin size={11} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate && onNavigate('events')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-3.5 py-2 rounded-xl border border-slate-700 shrink-0 cursor-pointer shadow-xs transition"
                  >
                    Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Universal Pending Items Modal */}
      <UniversalPendingQueueModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        scoutId={scoutUid}
        currentUser={currentUser}
        onNavigate={onNavigate}
      />

      {/* Published Report Viewer Modal */}
      {viewingPublishedReport && (
        <PublishedReportViewerModal
          isOpen={!!viewingPublishedReport}
          onClose={() => setViewingPublishedReport(null)}
          report={viewingPublishedReport}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
