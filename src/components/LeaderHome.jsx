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
  Zap
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

  return (
    <div className="space-y-3.5 pb-6 font-sans">
      {/* ── 1. LEADER / OWNER HERO COMMAND CARD ── */}
      <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden ${
        isOwner 
          ? 'bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/30 border border-amber-500/40 shadow-amber-950/30' 
          : 'bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/30 border border-emerald-500/30 shadow-emerald-950/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center p-2 shadow-lg shrink-0 text-2xl sm:text-3xl ${
              isOwner 
                ? 'bg-gradient-to-br from-amber-500/25 to-amber-700/15 border-2 border-amber-400 text-amber-300 shadow-amber-950/40' 
                : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
            }`}>
              {isOwner ? '👑' : '⚜️'}
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                {isOwner ? (
                  <StatusBadge type="warning" size="xs" label="👑 Troop Owner" />
                ) : (
                  <StatusBadge type="success" size="xs" label={`⚜️ ${roleLabel}`} />
                )}
                <StatusBadge type="indigo" size="xs" label={`${scouts.length} Scouts`} />
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('profile')}
                  className="cursor-pointer transition-transform hover:scale-105"
                  title="Click to view or update Safety/Protection Training (SPT) in your profile"
                >
                  <StatusBadge 
                    type={(currentUser?.spt || currentUser?.sptDate || currentUser?.sptFileUrl || currentUser?.yptCompleted) ? 'success' : 'warning'} 
                    size="xs" 
                    label={`SPT: ${(currentUser?.spt || currentUser?.sptDate) ? `✓ ${currentUser?.spt || currentUser?.sptDate}` : ((currentUser?.sptFileUrl || currentUser?.yptCompleted) ? '✓ Certified' : 'Pending')}`} 
                  />
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || (isOwner ? 'Owner' : 'Leader')}! {isOwner ? '👑' : '⚜️'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                {isOwner 
                  ? 'Command Center: Monitor scout advancement, verify testing submissions, take roll call, and manage troop activities.'
                  : 'Leadership Hub: Monitor scout advancement, verify testing submissions, take roll call, and schedule troop events.'
                }
              </p>
            </div>
          </div>

          {/* ── 3 Streamlined Primary Action Buttons ── */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 items-center">
            {/* 1. Take Roll Call */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('attendance')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40"
            >
              <CheckCircle2 size={15} className="shrink-0 text-slate-950" />
              <span>Take Roll Call</span>
            </button>

            {/* 2. Troop Calendar */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('events')}
              className="bg-slate-800 hover:bg-slate-750 text-sky-300 hover:text-white border border-slate-700/80 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar size={14} className="text-sky-400 shrink-0" />
              <span>Troop Calendar</span>
            </button>

            {/* 3. Review Action Items (or Broadcast) */}
            {totalPendingApprovals > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedPendingScoutId(null);
                  setShowPendingModal(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-amber-950/40 animate-pulse"
              >
                <Clock size={14} className="shrink-0" />
                <span>Review ({totalPendingApprovals})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('broadcasts')}
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Megaphone size={14} className="text-purple-400 shrink-0" />
                <span>Broadcast</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Streamlined 4-Item Horizontal Pill Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-3.5 border-t border-slate-800/80 relative z-10 text-xs">
          {/* 1. Active Scouts */}
          <div 
            onClick={() => onNavigate && onNavigate('roster')}
            className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/60 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider">Troop Members</span>
              <strong className="text-xs sm:text-sm font-black text-white block truncate">
                {scouts.length} Registered Scouts
              </strong>
            </div>
          </div>

          {/* 2. Pending Reviews */}
          <div 
            onClick={() => {
              if (totalPendingApprovals > 0) {
                setSelectedPendingScoutId(null);
                setShowPendingModal(true);
              }
            }}
            className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 transition border shadow-xs ${
              totalPendingApprovals > 0 
                ? 'bg-amber-950/30 border-amber-500/50 cursor-pointer hover:border-amber-400 hover:shadow-md' 
                : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={18} className={totalPendingApprovals > 0 ? "animate-pulse" : ""} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-amber-400 block uppercase font-bold tracking-wider">Pending Reviews</span>
              <strong className="text-xs sm:text-sm font-black text-white block truncate">
                {totalPendingApprovals} Action Items
              </strong>
            </div>
          </div>

          {/* 3. Patrol Attendance */}
          <div 
            onClick={() => onNavigate && onNavigate('attendance')}
            className="bg-slate-900/90 border border-sky-500/30 hover:border-sky-400/60 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-sky-400 block uppercase font-bold tracking-wider">Attendance</span>
                {patrolRedRiskCount > 0 && (
                  <span className="bg-rose-500/30 border border-rose-500/50 text-rose-300 text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    {patrolRedRiskCount} Risk
                  </span>
                )}
              </div>
              <strong className="text-xs sm:text-sm font-black text-white block truncate">
                {attendanceSessions.length} Sessions Logged
              </strong>
            </div>
          </div>

          {/* 4. Patrol Units */}
          <div 
            onClick={() => onNavigate && onNavigate('roster')}
            className="bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400/60 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Shield size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-indigo-400 block uppercase font-bold tracking-wider">
                {isTroopWideAuthority ? 'Patrol Units' : 'Assigned Unit'}
              </span>
              <strong className="text-xs sm:text-sm font-black text-white block truncate">
                {isTroopWideAuthority 
                  ? `${groups.length} Patrol Units` 
                  : (myGroup ? `🛡️ ${myGroup.name}` : 'Assigned Unit')}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 1.6 EDUCATIONAL LEADER WORKFLOW GUIDE ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-lg transition space-y-3">
        <div 
          onClick={() => setShowLeaderGuide(!showLeaderGuide)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <span>⚜️ Troop Leadership Workflow & Quick Guide</span>
                <span className="text-[10px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.2 rounded-full font-bold uppercase">
                  How-To
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Key steps for taking roll call, verifying oral submissions, communicating with parents, and managing patrols.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold p-1 rounded-lg bg-slate-800 group-hover:bg-slate-750 transition cursor-pointer"
          >
            {showLeaderGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showLeaderGuide && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 animate-fadeIn text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 size={14} />
                <span>1. Take Roll Call</span>
              </div>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                Click <strong>Take Roll Call</strong> during weekly sessions to log attendance. Absences marked with parent notices automatically record as Excused.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock size={14} />
                <span>2. Test & Sign-off</span>
              </div>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                Click <strong>Review Action Items</strong> to open the testing queue. Ask candidates their oral prompt, then click <em>Conduct Test & Sign-off</em>.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <MessageSquare size={14} />
                <span>3. Parent Inquiries</span>
              </div>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                Parent messages, conference requests, and signed progress reports appear in the <strong>Action Center</strong> for 1-click scheduling or replies.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Megaphone size={14} />
                <span>4. Troop Broadcasts</span>
              </div>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                Publish whole-troop announcements and packing lists directly to parent and scout notification feeds with real-time push badges.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 1.7 UNIFIED LEADER ACTION CENTER & INQUIRIES ── */}
      {(() => {
        const unreadDms = directThreads.filter(t => t.unreadByLeader);
        const pendingMeetingReqs = parentRequests.filter(r => r.status === 'pending_review' && r.requestType === 'meeting_request');
        const pendingOtherReqs = parentRequests.filter(r => r.status === 'pending_review' && r.requestType !== 'meeting_request');
        const confirmedConferences = parentRequests.filter(r => r.status === 'confirmed' && r.requestType === 'meeting_request');

        const totalActionCount = unreadDms.length + pendingMeetingReqs.length + pendingOtherReqs.length;
        if (totalActionCount === 0 && confirmedConferences.length === 0) return null;

        return (
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
            {/* Action Center Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold shrink-0 shadow-sm">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Leader Action Center & Inquiries
                    </h3>
                    {totalActionCount > 0 ? (
                      <StatusBadge type="danger" size="xs" pulse label={`${totalActionCount} Action Required`} />
                    ) : (
                      <StatusBadge type="success" size="xs" label="Up to Date" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Parent communications, conference scheduling requests, and upcoming confirmed appointments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowScheduleMeetingModal(true)}
                  className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Schedule Meeting</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('communication-hub')}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-950/40"
                >
                  <MessageSquare size={13} />
                  <span>Communication Hub &rarr;</span>
                </button>
              </div>
            </div>

            {/* Grid of Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 1. Unread DMs */}
              {unreadDms.length > 0 && (
                <div className="bg-slate-900/90 border border-indigo-500/40 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💬</span>
                        <span className="text-xs font-bold text-indigo-300">Direct Messages</span>
                      </div>
                      <StatusBadge type="danger" size="xs" label={`${unreadDms.length} Unread`} />
                    </div>
                    <p className="text-xs text-white font-semibold line-clamp-1">
                      From {unreadDms[0]?.parentName}: &ldquo;{unreadDms[0]?.lastMessage || unreadDms[0]?.subject}&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('direct-messages')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare size={13} />
                    <span>Reply to Message ({unreadDms.length}) &rarr;</span>
                  </button>
                </div>
              )}

              {/* 2. Conference Requests */}
              {pendingMeetingReqs.map(req => (
                <div
                  key={req.id || req.requestId}
                  className="bg-slate-900/90 border border-purple-500/40 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🤝</span>
                        <span className="text-xs font-bold text-purple-300">Conference Request</span>
                      </div>
                      <StatusBadge type="purple" size="xs" label={req.patrolName || 'Patrol'} />
                    </div>
                    <div className="text-xs text-slate-200">
                      <strong className="text-white">{req.parentName}</strong> for <strong className="text-purple-300">{req.scoutName}</strong>
                    </div>
                    <div className="text-[11px] text-purple-200 font-mono bg-purple-950/40 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                      📅 {req.proposedDate || 'Flexible'} @ {req.proposedTime || 'Evening'}
                      {req.meetingTopic && <span className="block italic text-slate-300 mt-0.5">&ldquo;{req.meetingTopic}&rdquo;</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('parent-requests', { requestId: req.id || req.requestId, confirmMeeting: true })}
                    className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Calendar size={13} />
                    <span>Confirm & Schedule Conference &rarr;</span>
                  </button>
                </div>
              ))}

              {/* 3. General Parent Requests */}
              {pendingOtherReqs.length > 0 && (
                <div className="bg-slate-900/90 border border-sky-500/40 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📝</span>
                        <span className="text-xs font-bold text-sky-300">Parent Requests / Absences</span>
                      </div>
                      <StatusBadge type="info" size="xs" label={`${pendingOtherReqs.length} Pending`} />
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-1">
                      From <strong className="text-white">{pendingOtherReqs[0].parentName}</strong> ({pendingOtherReqs[0].scoutName}): &ldquo;{pendingOtherReqs[0].message}&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('parent-requests', { requestId: pendingOtherReqs[0].id || pendingOtherReqs[0].requestId })}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Review Submissions ({pendingOtherReqs.length}) &rarr;</span>
                  </button>
                </div>
              )}

              {/* 4. Confirmed Conferences */}
              {confirmedConferences.length > 0 && (
                <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📅</span>
                        <span className="text-xs font-bold text-emerald-300">Scheduled Conference</span>
                      </div>
                      <StatusBadge type="success" size="xs" label={`${confirmedConferences.length} Upcoming`} />
                    </div>
                    <p className="text-xs text-slate-200">
                      With <strong className="text-white">{confirmedConferences[0].parentName}</strong> ({confirmedConferences[0].scoutName}) on <strong className="text-emerald-300">{confirmedConferences[0].confirmedDate} at {confirmedConferences[0].confirmedTime}</strong>
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <ConferenceCountdown
                      date={confirmedConferences[0].confirmedDate}
                      time={confirmedConferences[0].confirmedTime}
                      variant="pill"
                    />
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('parent-requests', { filterTab: 'all' })}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer hover:underline"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <LiveClockAndCalendar currentUser={currentUser} onNavigate={onNavigate} />

      {/* ── 1.9 RECENT TROOP BROADCASTS & NOTIFICATIONS ── */}
      {recentBroadcasts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-sm">
                <Megaphone size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Recent Troop Announcements & Broadcasts
                  </h3>
                  <StatusBadge type="success" size="xs" label="Active Feed" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Published updates pushed directly to parents, scouts, and patrol messenger streams.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('broadcasts')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 shrink-0"
              >
                <Megaphone size={13} />
                <span>Open Broadcast Center &rarr;</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentBroadcasts.map((b) => (
              <div
                key={b.id || b.broadcastId}
                className="bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 p-4 rounded-2xl space-y-2.5 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <StatusBadge type="neutral" size="xs" label={b.category || 'General'} />
                    <StatusBadge 
                      type={b.priority === 'urgent' ? 'danger' : b.priority === 'high' ? 'warning' : 'neutral'} 
                      size="xs" 
                      pulse={b.priority === 'urgent'}
                      label={b.priority || 'Normal'} 
                    />
                  </div>

                  <h4 className="text-xs font-black text-white line-clamp-1 leading-snug">
                    {b.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {b.message}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="truncate">By {b.authorName || 'Leader'}</span>
                  <span>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. SLEEK ACTIONABLE NOTIFICATION & TESTING CENTER ── */}
      {totalPendingApprovals > 0 ? (
        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-xl space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-sm">
                <Clock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    Pending Submissions & Oral Testing ({totalPendingApprovals})
                  </h4>
                  <StatusBadge type="warning" size="xs" pulse label="Action Required" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {scoutsWithPending.length} scout{scoutsWithPending.length !== 1 ? 's' : ''} awaiting leader verification and oral sign-off.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPendingScoutId(null);
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
              {totalRanksPending > 0 && (
                <StatusBadge type="success" size="xs" label={`⚜️ ${totalRanksPending} Rank Reqs`} />
              )}
              {totalIslamicPending > 0 && (
                <StatusBadge type="info" size="xs" label={`🕌 ${totalIslamicPending} Islamic Tests`} />
              )}
              {totalHwPending > 0 && (
                <StatusBadge type="indigo" size="xs" label={`🎒 ${totalHwPending} Homework`} />
              )}
              {totalMeritPending > 0 && (
                <StatusBadge type="warning" size="xs" label={`🏅 ${totalMeritPending} Badges`} />
              )}
            </div>

            {/* Scout Direct Jump Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-0.5">Scouts:</span>
              {scoutsWithPending.slice(0, 6).map(s => (
                <button
                  key={s.uid}
                  type="button"
                  onClick={() => {
                    setSelectedPendingScoutId(s.uid);
                    setShowPendingModal(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Click to review this scout's queue directly"
                >
                  <span>{s.fullName?.split(' ')[0] || s.username}</span>
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {pendingMap[s.uid]?.total || 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>All submissions up-to-date (0 pending sign-offs in your queue).</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('reports')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Reports Center</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* ── 3. MAIN HUB: PATROL OVERVIEW & UPCOMING ACTIVITIES ── */}
      <div className="space-y-3.5">
        {/* Patrol Summary / Unit Focus */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {isTroopWideAuthority ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                  <Users size={16} className="text-emerald-400" />
                  <span>Taliʿat Patrol Units ({groups.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('roster')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Roster</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {groups.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-3 col-span-3">No patrol groups registered yet.</p>
                ) : (
                  groups.map((g) => {
                    const pScouts = scouts.filter(s => isScoutInPatrol(s, g.id, groups));
                    const pPending = pScouts.reduce((sum, s) => sum + (pendingMap[s.uid]?.total || 0), 0);
                    return (
                      <div
                        key={g.id}
                        onClick={() => onNavigate && onNavigate('roster')}
                        className="bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 p-4 rounded-2xl transition-all duration-200 cursor-pointer space-y-2 group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                            🛡️ {g.name} Patrol
                          </strong>
                          <span className="text-[10px] bg-slate-850 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold border border-slate-750">
                            {pScouts.length} Scouts
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {g.description || 'Active Dhulfiqār scouting patrol unit'}
                        </p>
                        {pPending > 0 && (
                          <div className="pt-1">
                            <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                              {pPending} Pending Tasks
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-750 pb-3">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Shield size={16} className="text-emerald-400" />
                  <span>My Assigned Patrol Unit</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('chat')}
                    className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Patrol Chat</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('roster')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Patrol Roster</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {myGroup ? (
                <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          🛡️ Assigned Patrol Unit
                        </span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-slate-700">
                          {scouts.length} Assigned Scouts
                        </span>
                        {totalPendingApprovals > 0 && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-sm">
                            {totalPendingApprovals} Pending Sign-Offs
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-white pt-1">
                        🛡️ {myGroup.name} Patrol
                      </h4>
                      {myGroup.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {myGroup.description}
                        </p>
                      )}
                    </div>

                    {/* Quick Action CTAs */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('roster')}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Users size={13} />
                        <span>View Roster</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('chat')}
                        className="bg-slate-800 hover:bg-slate-750 text-sky-300 border border-sky-500/30 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        <span>Patrol Chat</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Roster Member Chips */}
                  {scouts.length > 0 ? (
                    <div className="pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                        Unit Scouts ({scouts.length}):
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {scouts.map((s) => (
                          <div
                            key={s.uid}
                            onClick={() => onNavigate && onNavigate('roster')}
                            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                            <span>{s.fullName || s.username}</span>
                            {s.rank && (
                              <span className="text-[10px] text-emerald-400/80 font-mono">({s.rank})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-slate-800/80">
                      <p className="text-xs text-slate-400 italic">No scouts currently assigned to this patrol unit.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/80 border border-amber-500/30 p-5 rounded-2xl text-center space-y-2">
                  <span className="text-2xl">🛡️</span>
                  <h4 className="text-sm font-bold text-amber-300">No Patrol Unit Assigned</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You are currently not assigned to a specific patrol unit. Please contact a troop administrator to assign you to your patrol.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── UPCOMING TROOP EVENTS & ATTENDANCE ROLL CALL MONITOR ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                <Calendar size={18} className="text-teal-400" />
                <span>Troop Events & Attendance Roll Call</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scheduled troop events automatically sync with patrol roll call & attendance tracking.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('attendance')}
                className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>📋 Attendance Hub</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('events')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <span>All Events</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setEventAttendanceFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer border ${
                eventAttendanceFilter === 'all'
                  ? 'bg-slate-750 text-white border-slate-600 shadow-xs'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              All Events ({allEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setEventAttendanceFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                eventAttendanceFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-xs'
                  : 'bg-slate-900/90 text-slate-400 hover:text-amber-300 border-slate-800'
              }`}
            >
              <span>⚠️ Roll Call Pending</span>
              <span className="bg-amber-500/30 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {pendingRollCallCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setEventAttendanceFilter('recorded')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                eventAttendanceFilter === 'recorded'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-xs'
                  : 'bg-slate-900/90 text-slate-400 hover:text-emerald-300 border-slate-800'
              }`}
            >
              <span>🟢 Logged Sessions</span>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {recordedRollCallCount}
              </span>
            </button>
          </div>

          {/* Event List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEvents.length === 0 ? (
              <div className="col-span-1 md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-400 italic">
                  {eventAttendanceFilter === 'pending'
                    ? '🎉 Awesome! All scheduled events have attendance logs completed.'
                    : eventAttendanceFilter === 'recorded'
                    ? 'No attendance sessions logged yet for scheduled events.'
                    : 'No upcoming troop events found in the schedule.'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('events')}
                  className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                >
                  <span>➕ Schedule New Troop Event</span>
                </button>
              </div>
            ) : (
              filteredEvents.slice(0, 8).map(ev => {
                const info = getEventAttendanceInfo(ev);
                const aud = getEventAudienceInfo(ev, currentUser, groups);
                return (
                  <div
                    key={ev.id}
                    className={`bg-slate-900/80 border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${
                      info.recorded
                        ? 'border-emerald-500/30 hover:border-emerald-500/60'
                        : 'border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge type="info" size="xs" label={ev.date || 'Upcoming'} />
                        {ev.time && (
                          <StatusBadge type="neutral" size="xs" label={ev.time} />
                        )}
                        <StatusBadge type="neutral" size="xs" label={ev.category || ev.type || 'Event'} />
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${aud.colorClass}`}>
                          <span>{aud.icon}</span>
                          <span className="font-bold">{aud.badge}</span>
                        </span>
                        {info.recorded ? (
                          <StatusBadge type="success" size="xs" label={`Logged: ${info.presentCount}/${info.totalCount} (${info.turnoutPct}%)`} />
                        ) : (
                          <StatusBadge type="warning" size="xs" pulse label="Roll Call Pending" />
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm text-white pt-0.5">{ev.title}</h4>

                      {ev.location && (
                        <p className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg w-fit max-w-full">
                          <MapPin size={11} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </p>
                      )}
                    </div>

                    {/* Action CTA Button */}
                    <div className="pt-2 border-t border-slate-850 flex justify-end">
                      {info.recorded ? (
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('attendance', { date: ev.date, eventType: info.mappedType, notes: ev.title })}
                          className="w-full sm:w-auto bg-slate-850 hover:bg-slate-800 text-teal-300 border border-teal-500/40 hover:border-teal-400 text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>✏️ Update Roll Call</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('attendance', { date: ev.date, eventType: info.mappedType, notes: ev.title })}
                          className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-950/40 hover:scale-[1.02]"
                        >
                          <Calendar size={13} />
                          <span>📋 Take Attendance</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
