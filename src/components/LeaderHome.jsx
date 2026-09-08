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
  Video
} from 'lucide-react';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import LiveClockAndCalendar from './LiveClockAndCalendar';
import { getEventAudienceInfo } from '../utils/kashafVoice';

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
    <div className="space-y-6 pb-12 font-sans">
      {/* ── 1. LEADER / OWNER HERO COMMAND CARD ── */}
      <div className={`rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden ${
        isOwner 
          ? 'bg-gradient-to-br from-slate-950 via-amber-950/60 to-slate-900 border-2 border-amber-500/60 shadow-amber-950/50' 
          : 'bg-gradient-to-br from-slate-850 via-slate-800 to-emerald-950/60 border-2 border-emerald-500/40 shadow-emerald-950/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shrink-0 text-3xl ${
              isOwner 
                ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-2 border-amber-400 text-amber-300 shadow-amber-950/60' 
                : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50'
            }`}>
              {isOwner ? '👑' : '⚜️'}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border ${
                  isOwner 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isOwner ? '👑 Troop Owner & Superadmin' : `⚜️ ${roleLabel}`}
                </span>
                <span className="bg-slate-700/70 text-slate-200 border border-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>👥</span> {scouts.length} Registered Scouts
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>✨</span> Be Prepared &bull; كُن مُسْتَعِدّاً
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('profile')}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border transition cursor-pointer ${
                    (currentUser?.spt || currentUser?.sptDate || currentUser?.sptFileUrl || currentUser?.yptCompleted)
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:border-emerald-500'
                      : 'bg-amber-950/80 text-amber-300 border-amber-700/60 hover:border-amber-500'
                  }`}
                  title="Click to view or update Safety/Protection Training (SPT) in your profile"
                >
                  <Shield size={11} />
                  <span>SPT: {(currentUser?.spt || currentUser?.sptDate) ? `✓ ${currentUser?.spt || currentUser?.sptDate}` : ((currentUser?.sptFileUrl || currentUser?.yptCompleted) ? '✓ Certified' : 'Pending')}</span>
                </button>
                {isOwner && (
                  <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Crown size={10} /> Full Superadmin Authority
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || (isOwner ? 'Owner' : 'Leader')}! {isOwner ? '👑' : '⚜️'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {isOwner 
                  ? 'Welcome to the Supreme Troop Owner Command Center. You hold exclusive authority to modify usernames, supervise all patrol hierarchies, manage system-wide credentials, and oversee troop governance.'
                  : 'Welcome to your Dhulfiqār Leadership Command Center. Monitor scout advancement, test submissions, schedule events, and generate customized troop reports.'
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            {(isOwner || isExecutive) && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('admin')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-amber-950/60 hover:scale-[1.02]"
              >
                <Crown size={15} />
                <span>⚡ Executive Admin Hub</span>
              </button>
            )}

            {totalPendingApprovals > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPendingScoutId(null);
                  setShowPendingModal(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-amber-950/60 hover:scale-[1.02]"
              >
                <Clock size={15} className="animate-pulse" />
                <span>⏳ Review Submissions ({totalPendingApprovals})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('events')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Calendar size={15} className="text-teal-400" />
              <span>📅 Troop Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('attendance')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>📋 Patrol Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('reports')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <Printer size={15} />
              <span>📈 Reports Center</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('roster')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Users size={15} />
              <span>👥 Patrol Roster</span>
            </button>
          </div>
        </div>

        {/* ── Quick KPI Stat Tiles ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-700/60 relative z-10 text-xs">
          <div 
            onClick={() => {
              if (totalPendingApprovals > 0) {
                setSelectedPendingScoutId(null);
                setShowPendingModal(true);
              }
            }}
            className={`p-3.5 rounded-2xl border transition ${
              totalPendingApprovals > 0 
                ? 'bg-amber-950/40 border-amber-500/60 cursor-pointer hover:border-amber-400' 
                : 'bg-slate-900/70 border-slate-750'
            }`}
          >
            <span className="text-[10px] text-amber-400 block uppercase font-bold tracking-wider">Pending Tasks</span>
            <strong className="text-base font-black text-white block mt-0.5">
              {totalPendingApprovals} Action Items
            </strong>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('attendance')}
            className="bg-slate-900/70 border border-teal-500/30 p-3.5 rounded-2xl cursor-pointer hover:border-teal-400 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-teal-400 block uppercase font-bold tracking-wider">Patrol Attendance</span>
              {patrolRedRiskCount > 0 && (
                <span className="bg-red-500/30 border border-red-500/50 text-red-300 text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {patrolRedRiskCount} Risk
                </span>
              )}
            </div>
            <strong className="text-base font-black text-white block mt-0.5">
              {attendanceSessions.length} Sessions Logged
            </strong>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('scouts')}
            className="bg-slate-900/70 border border-emerald-500/30 p-3.5 rounded-2xl cursor-pointer hover:border-emerald-400 transition"
          >
            <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider">Active Scouts</span>
            <strong className="text-base font-black text-white block mt-0.5">
              {scouts.length} Troop Members
            </strong>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('roster')}
            className="bg-slate-900/70 border border-sky-500/30 p-3.5 rounded-2xl cursor-pointer hover:border-sky-400 transition"
          >
            <span className="text-[10px] text-sky-400 block uppercase font-bold tracking-wider">
              {isTroopWideAuthority ? 'Taliʿat Patrols' : 'My Patrol Unit'}
            </span>
            <strong className="text-base font-black text-white block mt-0.5 truncate">
              {isTroopWideAuthority 
                ? `${groups.length} Active Patrols` 
                : (myGroup ? `🛡️ ${myGroup.name}` : 'Assigned Unit')}
            </strong>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('events')}
            className="bg-slate-900/70 border border-purple-500/30 p-3.5 rounded-2xl cursor-pointer hover:border-purple-400 transition"
          >
            <span className="text-[10px] text-purple-400 block uppercase font-bold tracking-wider">Planned Events</span>
            <strong className="text-base font-black text-white block mt-0.5">
              {allEvents.length} Scheduled
            </strong>
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
              <div className="bg-gradient-to-r from-purple-950/95 via-slate-900 to-amber-950/40 border-2 border-purple-500/70 p-5 rounded-3xl shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/30 pb-3.5 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/25 border border-purple-400 flex items-center justify-center text-xl shrink-0 text-purple-300 shadow-inner">
                      🤝
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase bg-purple-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                          Conference Requested
                        </span>
                        <span className="text-xs text-purple-200 font-mono font-bold">
                          {pendingMeetingReqs.length} Awaiting Confirmation
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white mt-0.5">
                        Leader-Parent Conferences Pending Scheduling
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('parent-requests', { filterTab: 'pending' })}
                    className="text-xs text-purple-300 hover:text-purple-200 font-bold self-start sm:self-auto cursor-pointer underline underline-offset-4"
                  >
                    View All in Console &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingMeetingReqs.map(req => (
                    <div 
                      key={req.id || req.requestId} 
                      className="bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 p-4 rounded-2xl flex flex-col justify-between gap-3 transition shadow-md"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                            {req.scoutName}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                            {req.patrolName || 'Dhulfiqar Patrol'}
                          </span>
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

                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1">
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
                        className="w-full bg-gradient-to-r from-purple-600 via-emerald-600 to-teal-600 hover:from-purple-500 hover:to-emerald-500 text-white font-black text-xs py-2.5 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40"
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
              <div className="bg-gradient-to-r from-sky-950/90 via-slate-900 to-slate-900 border-2 border-sky-500/60 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-2xl shrink-0 text-sky-300">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-sky-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                        Parent Submissions ({pendingOtherReqs.length})
                      </span>
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
              <div className="bg-slate-900/80 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Scheduled Appointments ({confirmedConferences.length})
                    </span>
                    <p className="text-xs text-slate-200">
                      Next: <strong>{confirmedConferences[0].parentName}</strong> ({confirmedConferences[0].scoutName}) on <strong className="text-emerald-300">{confirmedConferences[0].confirmedDate} at {confirmedConferences[0].confirmedTime}</strong> • {confirmedConferences[0].meetingLocation || 'Troop HQ'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('parent-requests', { filterTab: 'confirmed' })}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  View Confirmed List &rarr;
                </button>
              </div>
            )}
          </div>
        );
      })()}

      <LiveClockAndCalendar currentUser={currentUser} onNavigate={onNavigate} />

      {/* ── 2. SLEEK ACTIONABLE NOTIFICATION & TESTING CENTER ── */}
      {totalPendingApprovals > 0 ? (
        <div className="bg-slate-850/90 border border-amber-500/50 rounded-2xl p-5 shadow-xl space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-sm">
                <Clock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    Pending Submissions & Oral Testing ({totalPendingApprovals})
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    Action Required
                  </span>
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
                <span className="bg-slate-900 border border-slate-750 text-emerald-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  ⚜️ {totalRanksPending} Rank Reqs
                </span>
              )}
              {totalIslamicPending > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-teal-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  🕌 {totalIslamicPending} Islamic Tests
                </span>
              )}
              {totalHwPending > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-sky-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  🎒 {totalHwPending} Homework
                </span>
              )}
              {totalMeritPending > 0 && (
                <span className="bg-slate-900 border border-slate-750 text-amber-300 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1">
                  🏅 {totalMeritPending} Badges
                </span>
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
                  className="bg-slate-900 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
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
        <div className="bg-slate-850/60 border border-slate-750 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
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
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl space-y-4">
          {isTroopWideAuthority ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-750 pb-3">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
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
                        className="bg-slate-900/80 border border-slate-750 hover:border-emerald-500/50 p-4 rounded-2xl transition cursor-pointer space-y-2 group"
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
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-4">
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
                className="bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
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
                  ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              All Events ({allEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setEventAttendanceFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                eventAttendanceFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-amber-300 border-slate-800'
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
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-emerald-300 border-slate-800'
              }`}
            >
              <span>🟢 Logged Sessions</span>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {recordedRollCallCount}
              </span>
            </button>
          </div>

          {/* Event List */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
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
                return (
                  <div
                    key={ev.id}
                    className={`bg-slate-900/80 border rounded-2xl p-4 transition space-y-3 ${
                      info.recorded
                        ? 'border-emerald-500/30 hover:border-emerald-500/60'
                        : 'border-slate-750 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] bg-slate-800 text-teal-300 border border-slate-700 font-mono font-bold px-2 py-0.5 rounded-md">
                            📅 {ev.date || 'Upcoming'}
                          </span>
                          {ev.time && (
                            <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock size={10} className="text-amber-400" /> {ev.time}
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-bold px-2 py-0.5 rounded-md">
                            {ev.category || ev.type || 'Event'}
                          </span>
                          {(() => {
                            const aud = getEventAudienceInfo(ev, currentUser, groups);
                            return (
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${aud.colorClass}`}>
                                <span>{aud.icon}</span>
                                <span className="font-bold">{aud.badge}</span>
                              </span>
                            );
                          })()}
                          {info.recorded ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span>🟢 Logged:</span> {info.presentCount}/{info.totalCount} Scouts ({info.turnoutPct}%)
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span>⚠️ Roll Call Pending</span>
                            </span>
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
                      <div className="shrink-0">
                        {info.recorded ? (
                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('attendance', { date: ev.date, eventType: info.mappedType, notes: ev.title })}
                            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/40 hover:border-teal-400 text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <span>✏️ Update Roll Call</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('attendance', { date: ev.date, eventType: info.mappedType, notes: ev.title })}
                            className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-950/40 hover:scale-[1.02]"
                          >
                            <Calendar size={13} />
                            <span>📋 Take Attendance (Auto-Sync)</span>
                          </button>
                        )}
                      </div>
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
    </div>
  );
}
