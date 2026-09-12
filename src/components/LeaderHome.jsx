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
  Megaphone
} from 'lucide-react';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import LiveClockAndCalendar from './LiveClockAndCalendar';
import ConferenceCountdown from './ConferenceCountdown';
import ScheduleParentMeetingModal from './ScheduleParentMeetingModal';
import { getEventAudienceInfo } from '../utils/kashafVoice';
import StatusBadge from './StatusBadge';

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

  // Resolved Patrol for Leader
  const leaderGroupId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
  const myGroup = groups.find(g => 
    g.id === leaderGroupId || 
    g.name === leaderGroupId || 
    (currentUser?.assignedPatrol && (g.name === currentUser.assignedPatrol || g.id === currentUser.assignedPatrol)) ||
    (currentUser?.patrol && (g.name === currentUser.patrol || g.id === currentUser.patrol))
  );

  // 1. Fetch Scouts (Scoped for normal leaders to their assigned patrol)
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      const targetGId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
      if (!isTroopWideAuthority && targetGId) {
        list = list.filter(s => 
          s.groupId === targetGId || 
          s.patrolId === targetGId || 
          s.leaderId === currentUser?.uid || 
          s.patrol === targetGId ||
          (myGroup && (s.groupId === myGroup.id || s.patrolId === myGroup.id || s.patrol === myGroup.name))
        );
      } else if (!isTroopWideAuthority) {
        list = list.filter(s => s.leaderId === currentUser?.uid);
      }
      setScouts(list);
    }, (err) => console.warn('LeaderHome scouts fallback:', err));
    return () => unsub();
  }, [isTroopWideAuthority, currentUser?.groupId, currentUser?.patrolId, currentUser?.assignedPatrol, currentUser?.uid, myGroup?.id, myGroup?.name]);

  // 2. Fetch Groups / Patrols
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn('LeaderHome groups fallback:', err));
    return () => unsub();
  }, []);

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
      const targetGId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
      if (!isTroopWideAuthority && targetGId) {
        list = list.filter(s => 
          s.groupId === targetGId || 
          s.patrolId === targetGId || 
          s.leaderId === currentUser?.uid ||
          (myGroup && (s.groupId === myGroup.id || s.patrolId === myGroup.id))
        );
      } else if (!isTroopWideAuthority) {
        list = list.filter(s => s.leaderId === currentUser?.uid);
      }
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setAttendanceSessions(list);
    }, (err) => console.warn('Attendance sessions fallback in LeaderHome:', err));
    return () => unsub();
  }, [currentUser, isTroopWideAuthority, myGroup?.id]);

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
      const targetGId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
      if (!isTroopWideAuthority && targetGId) {
        list = list.filter(r => 
          r.patrolId === targetGId || 
          r.patrolName === currentUser.assignedPatrol || 
          !r.patrolId ||
          r.targetLeaderUid === currentUser?.uid ||
          r.assignedLeaderUid === currentUser?.uid
        );
      } else if (!isTroopWideAuthority) {
        list = list.filter(r => 
          !r.targetLeaderUid || 
          r.targetLeaderUid === currentUser?.uid || 
          r.assignedLeaderUid === currentUser?.uid
        );
      }
      setParentRequests(list);
    }, (err) => console.warn('Parent requests fallback in LeaderHome:', err));
    return () => unsub();
  }, [currentUser, isTroopWideAuthority]);

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
  const mapCategoryToEventType = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('camp') || c === 'campout') return 'Campout';
    if (c.includes('faith') || c.includes('halqa') || c.includes('study')) return 'Halqa / Study Circle';
    if (c.includes('service') || c.includes('volunteer')) return 'Service Project';
    if (c.includes('hike') || c.includes('outdoor')) return 'Day Hike';
    if (c.includes('workshop') || c.includes('ceremony')) return 'Special Workshop';
    return 'Weekly Troop Meeting';
  };

  // 7. Helper to cross-reference event with recorded attendance sessions
  const getEventAttendanceInfo = (ev) => {
    if (!ev) return { recorded: false, presentCount: 0, totalCount: 0, turnoutPct: 0, session: null, mappedType: 'Weekly Troop Meeting' };
    const mappedType = mapCategoryToEventType(ev.category || ev.type);
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

  // Calculate Patrol Risk metrics
  let patrolYellowRiskCount = 0;
  let patrolRedRiskCount = 0;

  (scouts || []).forEach(scout => {
    if (!scout?.uid) return;
    let unexcusedCount = 0;
    (attendanceSessions || []).forEach(sess => {
      const rec = sess?.records?.[scout.uid];
      if (rec && rec.status === 'absent') {
        unexcusedCount++;
      }
    });
    if (unexcusedCount >= 3) {
      patrolRedRiskCount++;
    } else if (unexcusedCount > 1) {
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
    <div className="space-y-4 pb-8 font-sans">
      {/* ── 1. LEADER / OWNER HERO COMMAND CARD ── */}
      <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden ${
        isOwner 
          ? 'bg-gradient-to-br from-slate-950 via-amber-950/60 to-slate-900 border border-amber-500/60 shadow-amber-950/50' 
          : 'bg-gradient-to-br from-slate-850 via-slate-800 to-emerald-950/60 border border-emerald-500/40 shadow-emerald-950/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-2 shadow-xl shrink-0 text-2xl sm:text-3xl ${
              isOwner 
                ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-2 border-amber-400 text-amber-300 shadow-amber-950/60' 
                : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50'
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
                <StatusBadge type="purple" size="xs" label="Be Prepared • كُن مُسْتَعِدّاً" />
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

              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || (isOwner ? 'Owner' : 'Leader')}! {isOwner ? '👑' : '⚜️'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                {isOwner 
                  ? 'Supreme Command Center: Oversee troop governance, patrol hierarchies, usernames, and system credentials.'
                  : 'Leadership Command Center: Monitor scout advancement, verify submissions, take roll call, and schedule events.'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto shrink-0">
            {(isOwner || isExecutive) && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('admin')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50"
              >
                <Crown size={13} className="shrink-0" />
                <span className="truncate">Admin Hub</span>
              </button>
            )}

            {totalPendingApprovals > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPendingScoutId(null);
                  setShowPendingModal(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50"
              >
                <Clock size={13} className="animate-pulse shrink-0" />
                <span className="truncate">Review ({totalPendingApprovals})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowScheduleMeetingModal(true)}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-teal-950/40"
            >
              <Users size={13} className="shrink-0" />
              <span className="truncate">Meeting</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('broadcasts')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/40"
            >
              <Megaphone size={13} className="shrink-0" />
              <span className="truncate">Broadcast</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('attendance')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span className="truncate">Roll Call</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('events')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Calendar size={13} className="text-teal-400 shrink-0" />
              <span className="truncate">Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('reports')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Printer size={13} className="shrink-0" />
              <span className="truncate">Reports</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('roster')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Users size={13} className="text-sky-400 shrink-0" />
              <span className="truncate">Roster</span>
            </button>
          </div>
        </div>

        {/* ── Streamlined 4-Item Horizontal Pill Summary Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-4 border-t border-slate-700/60 relative z-10 text-xs">
          {/* 1. Active Scouts */}
          <div 
            onClick={() => onNavigate && onNavigate('roster')}
            className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/60 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs"
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
                ? 'bg-amber-950/40 border-amber-500/60 cursor-pointer hover:border-amber-400 hover:shadow-md' 
                : 'bg-slate-900/90 border-slate-800'
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
            className="bg-slate-900/90 border border-teal-500/30 hover:border-teal-400/60 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-teal-400 block uppercase font-bold tracking-wider">Attendance</span>
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
            className="bg-slate-900/90 border border-sky-500/30 hover:border-sky-400/60 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Shield size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-sky-400 block uppercase font-bold tracking-wider">
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

      {/* ── 1.8 PENDING PARENT REQUESTS & CONFERENCE ALERTS ── */}
      {(() => {
        const pendingMeetingReqs = parentRequests.filter(r => r.status === 'pending_review' && r.requestType === 'meeting_request');
        const pendingOtherReqs = parentRequests.filter(r => r.status === 'pending_review' && r.requestType !== 'meeting_request');
        const confirmedConferences = parentRequests.filter(r => r.status === 'confirmed' && r.requestType === 'meeting_request');

        if (pendingMeetingReqs.length === 0 && pendingOtherReqs.length === 0 && confirmedConferences.length === 0) return null;

        return (
          <div className="space-y-3.5 animate-fadeIn">
            {/* A. High-Priority Conference Requests Banner */}
            {pendingMeetingReqs.length > 0 && (
              <div className="bg-gradient-to-r from-purple-950/95 via-slate-900 to-amber-950/40 border border-purple-500/70 p-5 rounded-3xl shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/30 pb-3.5 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/25 border border-purple-400 flex items-center justify-center text-xl shrink-0 text-purple-300 shadow-inner">
                      🤝
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge type="purple" size="xs" label="Conference Requested" />
                        <span className="text-xs text-purple-200 font-mono font-bold">
                          {pendingMeetingReqs.length} Awaiting Confirmation
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white mt-0.5">
                        Leader-Parent Conferences Pending Scheduling
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowScheduleMeetingModal(true)}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Plus size={13} />
                      <span>Schedule Meeting</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('parent-requests', { filterTab: 'pending' })}
                      className="text-xs text-purple-300 hover:text-purple-200 font-bold cursor-pointer underline underline-offset-4"
                    >
                      Console &rarr;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingMeetingReqs.map(req => (
                    <div 
                      key={req.id || req.requestId} 
                      className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl flex flex-col justify-between gap-3 transition-all duration-200 shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                            {req.scoutName}
                          </span>
                          <StatusBadge type="neutral" size="xs" label={req.patrolName || 'Dhulfiqar Patrol'} />
                        </div>

                        <div className="text-xs text-slate-200 font-medium">
                          Parent: <strong className="text-white">{req.parentName}</strong>
                          {req.targetLeaderName ? (
                            <span className="text-purple-300 block text-[11px] mt-0.5">
                              Requested with: <strong>Leader {req.targetLeaderName}</strong> ({req.targetLeaderRole || 'Leader'})
                            </span>
                          ) : (
                            <span className="text-slate-400 block text-[11px] mt-0.5">
                              Requested with: <em>Any Available Unit Leader</em>
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1">
                          <div className="flex items-center gap-2 text-purple-200 font-mono text-[11px]">
                            <Calendar size={12} className="text-purple-400 shrink-0" />
                            <span>Requested: <strong>{req.proposedDate || 'Flexible Date'}</strong> @ <strong>{req.proposedTime || 'Evening'}</strong></span>
                          </div>
                          {req.meetingTopic && (
                            <div className="text-slate-300 text-[11px] italic">
                              Topic: "{req.meetingTopic}"
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('parent-requests', { requestId: req.id || req.requestId, confirmMeeting: true })}
                        className="w-full bg-gradient-to-r from-purple-600 via-emerald-600 to-teal-600 hover:from-purple-500 hover:to-emerald-500 text-white font-black text-xs py-2.5 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-purple-950/40"
                      >
                        <Calendar size={14} />
                        <span>📅 Confirm & Schedule Conference &rarr;</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* B. General Parent Requests Banner (Absences, Reports, Forms) */}
            {pendingOtherReqs.length > 0 && (
              <div className="bg-gradient-to-r from-sky-950/90 via-slate-900 to-slate-900 border border-sky-500/60 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-2xl shrink-0 text-sky-300">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge type="info" size="xs" label={`Parent Submissions (${pendingOtherReqs.length})`} />
                      <span className="text-xs text-sky-200 font-mono">
                        {pendingOtherReqs.filter(r => r.requestType === 'absence_notice').length > 0 
                          ? `${pendingOtherReqs.filter(r => r.requestType === 'absence_notice').length} Absence Notice(s)` 
                          : 'Action Required'}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white mt-1">
                      Incoming submission from {pendingOtherReqs[0].parentName} for {pendingOtherReqs[0].scoutName}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      "{pendingOtherReqs[0].message}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('parent-requests', { requestId: pendingOtherReqs[0].id || pendingOtherReqs[0].requestId })}
                  className="bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer shadow-lg shrink-0 self-start sm:self-center"
                >
                  Review Parent Requests &rarr;
                </button>
              </div>
            )}

            {/* C. Confirmed Conferences Reminder */}
            {confirmedConferences.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <StatusBadge type="success" size="xs" label={`Scheduled Appointments (${confirmedConferences.length})`} />
                    <p className="text-xs text-slate-200 mt-1">
                      Next: <strong>{confirmedConferences[0].parentName}</strong> ({confirmedConferences[0].scoutName}) on <strong className="text-emerald-300">{confirmedConferences[0].confirmedDate} at {confirmedConferences[0].confirmedTime}</strong> • {confirmedConferences[0].meetingLocation || 'Troop HQ'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <ConferenceCountdown 
                    date={confirmedConferences[0].confirmedDate} 
                    time={confirmedConferences[0].confirmedTime} 
                    variant="pill" 
                  />
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('parent-requests', { filterTab: 'all' })}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold shrink-0 cursor-pointer hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>
              </div>
            )}
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
                className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl space-y-2.5 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
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
                  className="bg-slate-950 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
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
      <div className="space-y-6">
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
                    const pScouts = scouts.filter(s => s.groupId === g.id || s.patrolId === g.id);
                    const pPending = pScouts.reduce((sum, s) => sum + (pendingMap[s.uid]?.total || 0), 0);
                    return (
                      <div
                        key={g.id}
                        onClick={() => onNavigate && onNavigate('roster')}
                        className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition-all duration-200 cursor-pointer space-y-2 group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                            🛡️ {g.name} Patrol
                          </strong>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
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
                  ? 'bg-slate-700 text-white border-slate-500 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
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
                  : 'bg-slate-950 text-slate-400 hover:text-amber-300 border-slate-800'
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
                  : 'bg-slate-950 text-slate-400 hover:text-emerald-300 border-slate-800'
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
              <div className="col-span-1 md:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
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
                    className={`bg-slate-950/70 border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${
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
        onClose={() => setShowPendingModal(false)}
        scoutId={selectedPendingScoutId || scouts[0]?.uid || currentUser?.uid}
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
