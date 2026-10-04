import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, query, where, orderBy, limit } from 'firebase/firestore';
import {
  Bell,
  Clock,
  Users,
  Award,
  Star,
  BookOpen,
  Calendar,
  Compass,
  FileText,
  Printer,
  Sparkles,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Shield,
  CheckCircle2,
  CheckCheck,
  AlertTriangle,
  Plus,
  MessageSquare,
  TrendingUp,
  Crown,
  KeyRound,
  MapPin,
  Phone,
  Video,
  Megaphone,
  Zap,
  Sliders
} from 'lucide-react';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import LiveClockAndCalendar from './LiveClockAndCalendar';
import ConferenceCountdown from './ConferenceCountdown';
import ScheduleParentMeetingModal from './ScheduleParentMeetingModal';
import { getEventAudienceInfo } from '../utils/kashafVoice';
import StatusBadge from './StatusBadge';
import { 
  isSuperUser, 
  getAccessiblePatrols, 
  isScoutInPatrol, 
  getScoutPatrolName, 
  filterScoutsForUser 
} from '../utils/patrolScoping';
import { calculateScoutCompliance } from '../utils/attendanceCompliance';
import { subscribeToLeaderThreads } from '../services/directMessagingService';

export default function LeaderHome({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'executive' || currentUser?.isExecutive || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scout Master';
  const isScoutmaster = currentUser?.role === 'leader' && (currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster');
  const isTroopWideAuthority = isOwner || isExecutive || isScoutmaster;
  const roleLabel = isOwner ? 'Troop Owner / Superadmin' : currentUser?.leaderPosition || 'Troop Leader';

  // Data states
  const [scouts, setScouts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [eventAttendanceFilter, setEventAttendanceFilter] = useState('all'); // 'all' | 'pending' | 'recorded'
  const [assignments, setAssignments] = useState([]);
  const [pendingMap, setPendingMap] = useState({});
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedPendingScoutId, setSelectedPendingScoutId] = useState(null);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
  const [showLeaderGuide, setShowLeaderGuide] = useState(true);

  // Resolved Patrols for Leader
  const accessibleGroups = getAccessiblePatrols(currentUser, groups);
  const myGroup = accessibleGroups[0] || null;

  // 1. Fetch Groups / Patrols
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn('LeaderHome groups fallback:', err));
    return () => unsub();
  }, []);

  // 2. Fetch Scouts (Scoped for normal leaders to their assigned patrol)
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
      const scopedScouts = filterScoutsForUser(list, currentUser, groups, 'all');
      setScouts(scopedScouts);
    }, (err) => console.warn('LeaderHome scouts fallback:', err));
    return () => unsub();
  }, [currentUser, groups]);

  // 3. Fetch All Scheduled Events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setAllEvents(list);
      setEvents(list.slice(0, 6));
    }, (err) => console.warn('LeaderHome events fallback:', err));
    return () => unsub();
  }, []);

  // 3.5 Fetch Attendance Sessions (Scoped to Leader's Patrol)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!isTroopWideAuthority) {
        list = list.filter(s => {
          if (s.leaderId === currentUser?.uid) return true;
          return accessibleGroups.some(g => isScoutInPatrol({ groupId: s.groupId || s.patrolId }, g, groups) || s.patrolName === `${g.name} Patrol`);
        });
      }
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setAttendanceSessions(list);
    }, (err) => console.warn('Attendance sessions fallback in LeaderHome:', err));
    return () => unsub();
  }, [currentUser, isTroopWideAuthority, groups]);

  // 4. Fetch Assignments
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'assignments'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignments(list.slice(0, 4));
    }, (err) => console.warn('LeaderHome assignments fallback:', err));
    return () => unsub();
  }, []);

  // 4.5 Fetch Parent Requests
  const [parentRequests, setParentRequests] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'parent_requests'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!isTroopWideAuthority) {
        list = list.filter(r => {
          if (!r.patrolId && !r.targetLeaderUid) return true;
          if (r.targetLeaderUid === currentUser?.uid || r.assignedLeaderUid === currentUser?.uid) return true;
          return accessibleGroups.some(g => isScoutInPatrol({ groupId: r.patrolId, patrolName: r.patrolName }, g, groups));
        });
      }
      setParentRequests(list);
    }, (err) => console.warn('Parent requests fallback in LeaderHome:', err));
    return () => unsub();
  }, [currentUser, isTroopWideAuthority, groups]);

  // 4.8 Fetch Troop Broadcasts
  const [recentBroadcasts, setRecentBroadcasts] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'troop_broadcasts'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : new Date(a.createdAt || 0).getTime();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setRecentBroadcasts(list.slice(0, 3));
    }, (err) => console.warn('LeaderHome broadcasts fallback:', err));
    return () => unsub();
  }, []);

  // 4.9 Fetch Direct Messages / Parent Inquiries
  const [directThreads, setDirectThreads] = useState([]);
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = subscribeToLeaderThreads(currentUser, accessibleGroups, isTroopWideAuthority, (list) => {
      setDirectThreads(list);
    });
    return () => unsub();
  }, [currentUser, accessibleGroups, isTroopWideAuthority]);

  // 5. Aggregate Real-Time Pending Approvals
  useEffect(() => {
    if (scouts.length === 0) {
      setPendingMap({});
      return;
    }

    const unsubs = [];
    scouts.forEach((scout) => {
      // Listen to ranks
      const unsubRanks = onSnapshot(collection(db, 'user_progress', scout.uid, 'ranks'), (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          const reqs = data.completedRequirements || data.steps || {};
          Object.values(reqs).forEach((r) => {
            if ((r?.pending || r === 'pending') && !r?.completed) count++;
          });
        });
        setPendingMap(prev => {
          const prevS = prev[scout.uid] || {};
          const next = { ...prevS, ranks: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      });
      unsubs.push(unsubRanks);

      // Listen to merit badges
      const unsubMerit = onSnapshot(collection(db, 'user_progress', scout.uid, 'merit_badges'), (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          const steps = data.completedSteps || data.steps || {};
          Object.values(steps).forEach((s) => {
            if ((s?.pending || s === 'pending') && !s?.approved && !s?.completed) count++;
          });
          if (data.pending && !data.completed) count++;
        });
        setPendingMap(prev => {
          const prevS = prev[scout.uid] || {};
          const next = { ...prevS, merit: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      });
      unsubs.push(unsubMerit);

      // Listen to Islamic
      const unsubIslamic = onSnapshot(doc(db, 'user_progress', scout.uid, 'islamic_basics', 'status'), (snap) => {
        let count = 0;
        if (snap.exists()) {
          const data = snap.data();
          Object.values(data).forEach((p) => {
            if ((p?.pending || p === 'pending') && !p?.completed) count++;
          });
        }
        setPendingMap(prev => {
          const prevS = prev[scout.uid] || {};
          const next = { ...prevS, islamic: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      });
      unsubs.push(unsubIslamic);

      // Listen to assignments
      const unsubAssign = onSnapshot(collection(db, 'user_progress', scout.uid, 'assignments'), (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.submittedDate && !data.completed && !data.graded) count++;
        });
        setPendingMap(prev => {
          const prevS = prev[scout.uid] || {};
          const next = { ...prevS, assignments: count };
          const total = (next.ranks || 0) + (next.merit || 0) + (next.islamic || 0) + (next.assignments || 0);
          return { ...prev, [scout.uid]: { ...next, total } };
        });
      });
      unsubs.push(unsubAssign);
    });

    return () => unsubs.forEach(u => u());
  }, [scouts]);

  // 6. Category to EventType Mapper
  const mapCategoryToEventType = (cat, title = '') => {
    const c = (cat || '').toLowerCase();
    const t = (title || '').toLowerCase();
    if (t.includes('tuesday') || c.includes('tuesday')) return 'Tuesday Program';
    if (t.includes('friday') || (c.includes('meeting') && !t.includes('tuesday'))) return 'Weekly Troop Meeting (Friday)';
    if (c.includes('camp') || t.includes('camp')) return 'Campout';
    if (c.includes('faith') || c.includes('halqa') || t.includes('halqa') || t.includes('circle') || t.includes('study')) return 'Halqa / Study Circle';
    if (c.includes('service') || c.includes('volunteer') || t.includes('service') || t.includes('volunteer')) return 'Service Project / Volunteering';
    if (c.includes('hike') || t.includes('hike')) return 'Day Hike';
    if (c.includes('workshop') || c.includes('skills') || t.includes('workshop') || c.includes('ceremony') || c.includes('court')) return 'Special Workshop';
    return 'Weekly Troop Meeting (Friday)';
  };

  // 7. Helper to cross-reference event with recorded attendance sessions
  const getEventAttendanceInfo = (ev) => {
    if (!ev) return { recorded: false, presentCount: 0, totalCount: 0, turnoutPct: 0, session: null, mappedType: 'Weekly Troop Meeting (Friday)' };
    const mappedType = mapCategoryToEventType(ev.category || ev.type, ev.title);
    const session = (attendanceSessions || []).find(s => 
      s && s.date === ev.date && 
      (s.eventType === mappedType || (typeof s.notes === 'string' && typeof ev.title === 'string' && s.notes.includes(ev.title)))
    );

    if (!session || !session.records || typeof session.records !== 'object') {
      return { recorded: false, presentCount: 0, totalCount: 0, turnoutPct: 0, session: null, mappedType };
    }

    const records = Object.values(session.records).filter(Boolean);
    const present = records.filter(r => r && (r.status === 'present' || r.status === 'late')).length;
    const total = records.length;
    const turnout = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      recorded: true,
      presentCount: present,
      totalCount: total,
      turnoutPct: turnout,
      session,
      mappedType
    };
  };

  // Calculate Patrol Risk metrics using Friday & Mandatory Compliance engine
  let patrolYellowRiskCount = 0;
  let patrolRedRiskCount = 0;

  (scouts || []).forEach(scout => {
    if (!scout?.uid) return;
    const comp = calculateScoutCompliance(scout.uid, attendanceSessions, { scope: 'tracked_only' });
    if (comp.riskLevel === 'red') {
      patrolRedRiskCount++;
    } else if (comp.riskLevel === 'yellow') {
      patrolYellowRiskCount++;
    }
  });

  // Filter events based on attendance status
  const filteredEvents = (allEvents || []).filter(ev => {
    if (!ev) return false;
    const info = getEventAttendanceInfo(ev);
    if (eventAttendanceFilter === 'pending') return !info.recorded;
    if (eventAttendanceFilter === 'recorded') return info.recorded;
    return true;
  });

  const pendingRollCallCount = (allEvents || []).filter(ev => ev && !getEventAttendanceInfo(ev).recorded).length;
  const recordedRollCallCount = (allEvents || []).filter(ev => ev && getEventAttendanceInfo(ev).recorded).length;

  const totalPendingApprovals = Object.values(pendingMap || {}).reduce((sum, item) => sum + (item?.total || 0), 0);
  const totalRanksPending = Object.values(pendingMap || {}).reduce((sum, item) => sum + (item?.ranks || 0), 0);
  const totalIslamicPending = Object.values(pendingMap || {}).reduce((sum, item) => sum + (item?.islamic || 0), 0);
  const totalMeritPending = Object.values(pendingMap || {}).reduce((sum, item) => sum + (item?.merit || 0), 0);
  const totalHwPending = Object.values(pendingMap || {}).reduce((sum, item) => sum + (item?.assignments || 0), 0);
  const scoutsWithPending = (scouts || []).filter(s => s?.uid && (pendingMap[s.uid]?.total || 0) > 0);

  const nextEvent = events[0] || allEvents[0] || null;

  return (
    <div className="space-y-4 pb-8 font-sans max-w-7xl mx-auto">
      {/* ── 1. CLEAN HERO CARD ── */}
      <div className="rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden bg-slate-900 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl bg-slate-800 border border-sky-500/30 text-sky-300 shadow-md shrink-0">
              {isOwner ? '👑' : '⚜️'}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {isOwner ? '👑 Troop Owner' : `⚜️ ${roleLabel}`}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {scouts.length} Scouts
                </span>
                {nextEvent && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700 flex items-center gap-1">
                    <Calendar size={11} className="text-sky-400" />
                    <span>Next: {nextEvent.title || nextEvent.date}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || (isOwner ? 'Owner' : 'Leader')}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Dhulfiqār Scouts Command Center — 4 Main Hubs
              </p>
            </div>
          </div>

          {/* 2 Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('preparation-hub', { subTab: 'attendance' })}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md shadow-sky-950/40"
            >
              <CheckCircle2 size={16} />
              <span>Take Roll Call</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('education-hub', { subTab: 'homework' })}
              className="bg-slate-850 hover:bg-slate-800 text-white border border-sky-500/40 hover:border-sky-400 font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <BookOpen size={15} className="text-sky-400" />
              <span>Weekly Homework</span>
              {totalHwPending > 0 && (
                <span className="bg-sky-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {totalHwPending}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── OPTIONAL URGENT ALERT BANNER (If items await review) ── */}
      {totalPendingApprovals > 0 && (
        <div className="bg-slate-900 border border-sky-500/40 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Clock size={18} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                {totalPendingApprovals} Action Items Awaiting Review
              </h4>
              <p className="text-xs text-slate-300">
                {totalRanksPending > 0 && `${totalRanksPending} rank testing • `}
                {totalHwPending > 0 && `${totalHwPending} homework submissions • `}
                {parentRequests.filter(r => r.status === 'pending_review').length > 0 && `${parentRequests.filter(r => r.status === 'pending_review').length} parent requests`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('approvals-hub')}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-sky-950/30"
          >
            <CheckCheck size={14} />
            <span>Open Approvals &rarr;</span>
          </button>
        </div>
      )}

      {/* ── 2. THE 4 CORE HUBS COMMAND BOARD ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* ── HUB 1: APPROVALS ── */}
        <div 
          onClick={() => onNavigate && onNavigate('approvals-hub')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850/80 rounded-3xl p-6 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                <CheckCheck size={24} />
              </div>
              {totalPendingApprovals > 0 ? (
                <span className="bg-sky-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full animate-pulse shadow-sm">
                  {totalPendingApprovals} Pending
                </span>
              ) : (
                <span className="bg-slate-800 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                  Up to Date
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition">
                Approvals Hub
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                All testing sign-offs, weekly homework grading, and parent conference requests together in one queue.
              </p>
            </div>

            {/* Sub-features list */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <Award size={13} className="text-sky-400" />
                  <span>Rank Testing Sign-offs</span>
                </span>
                <span className="font-bold text-white font-mono">{totalRanksPending}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <BookOpen size={13} className="text-sky-400" />
                  <span>Homework Submissions to Grade</span>
                </span>
                <span className="font-bold text-white font-mono">{totalHwPending}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <MessageSquare size={13} className="text-sky-400" />
                  <span>Parent Conference Requests</span>
                </span>
                <span className="font-bold text-white font-mono">{parentRequests.filter(r => r.status === 'pending_review').length}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-bold group-hover:text-sky-300">
            <span>Open Approvals Hub</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ── HUB 2: PREPARATION ── */}
        <div 
          onClick={() => onNavigate && onNavigate('preparation-hub')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850/80 rounded-3xl p-6 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                <Calendar size={24} />
              </div>
              <span className="bg-slate-800 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                {allEvents.length} Events Scheduled
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition">
                Preparation Hub
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Troop schedule, meeting agendas, and weekly roll call check-in organized together.
              </p>
            </div>

            {/* Sub-features list */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <Calendar size={13} className="text-sky-400" />
                  <span>Master Calendar & Events</span>
                </span>
                <span className="font-bold text-white font-mono">{allEvents.length} total</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-sky-400" />
                  <span>Roll Call & Session Logs</span>
                </span>
                <span className="font-bold text-white font-mono">{attendanceSessions.length} logged</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <Clock size={13} className="text-sky-400" />
                  <span>Next Upcoming Meeting</span>
                </span>
                <span className="font-bold text-sky-300 truncate max-w-[140px]">
                  {nextEvent?.title || 'None Scheduled'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-bold group-hover:text-sky-300">
            <span>Open Preparation Hub</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ── HUB 3: EDUCATION ── */}
        <div 
          onClick={() => onNavigate && onNavigate('education-hub')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850/80 rounded-3xl p-6 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                <BookOpen size={24} />
              </div>
              <span className="bg-slate-800 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                {assignments.length} Active Tasks
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition">
                Education Hub
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Weekly troop homework, patrol curriculum lesson plans, Tarbiyah, and field handbooks in one place.
              </p>
            </div>

            {/* Sub-features list */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <BookOpen size={13} className="text-sky-400" />
                  <span>Weekly Homework & Challenges</span>
                </span>
                <span className="font-bold text-white font-mono">{assignments.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <FileText size={13} className="text-sky-400" />
                  <span>Lesson Plans & Agendas</span>
                </span>
                <span className="font-bold text-sky-300">Curriculum</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <Sparkles size={13} className="text-sky-400" />
                  <span>Islamic Tarbiyah & Duas</span>
                </span>
                <span className="font-bold text-sky-300">Tarbiyah</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-bold group-hover:text-sky-300">
            <span>Open Education Hub</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ── HUB 4: ADMIN & OPERATIONS ── */}
        <div 
          onClick={() => onNavigate && onNavigate('admin-hub')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850/80 rounded-3xl p-6 shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                <Sliders size={24} />
              </div>
              <span className="bg-slate-800 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                {scouts.length} Scouts • {groups.length} Patrols
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition">
                Admin & Operations Hub
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Patrol rosters, troop announcements, parent direct messages, reports, and governance.
              </p>
            </div>

            {/* Sub-features list */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <Users size={13} className="text-sky-400" />
                  <span>Patrol Rosters & Profiles</span>
                </span>
                <span className="font-bold text-white font-mono">{scouts.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <Megaphone size={13} className="text-sky-400" />
                  <span>Troop Broadcasts & Alerts</span>
                </span>
                <span className="font-bold text-white font-mono">{recentBroadcasts.length} recent</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <MessageSquare size={13} className="text-sky-400" />
                  <span>Parent Messages & Inquiries</span>
                </span>
                <span className="font-bold text-white font-mono">{directThreads.length}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-bold group-hover:text-sky-300">
            <span>Open Admin Hub</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Universal Pending Queue Modal */}
      <UniversalPendingQueueModal
        isOpen={showPendingModal}
        onClose={() => {
          setShowPendingModal(false);
          setSelectedPendingScoutId(null);
        }}
        targetScoutId={selectedPendingScoutId}
        scoutId={selectedPendingScoutId || 'all'}
        currentUser={currentUser}
        onNavigate={onNavigate}
      />

      {/* Schedule Parent Meeting Modal */}
      <ScheduleParentMeetingModal
        isOpen={showScheduleMeetingModal}
        onClose={() => setShowScheduleMeetingModal(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
