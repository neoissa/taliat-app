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
  AlertTriangle,
  Plus,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import UniversalPendingQueueModal from './UniversalPendingQueueModal';
import LiveClockAndCalendar from './LiveClockAndCalendar';

export default function LeaderHome({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
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

  // 1. Fetch Scouts
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      if (!isOwner && !isScoutmaster && currentUser?.groupId) {
        list = list.filter(s => s.groupId === currentUser.groupId || s.leaderId === currentUser.uid);
      }
      setScouts(list);
    }, (err) => console.warn('LeaderHome scouts fallback:', err));
    return () => unsub();
  }, [isOwner, isScoutmaster, currentUser?.groupId, currentUser?.uid]);

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
      if (!isOwner && currentUser?.groupId) {
        list = list.filter(s => s.groupId === currentUser.groupId || s.leaderId === currentUser.uid);
      } else if (!isOwner) {
        list = list.filter(s => s.leaderId === currentUser?.uid);
      }
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setAttendanceSessions(list);
    }, (err) => console.warn('Attendance sessions fallback in LeaderHome:', err));
    return () => unsub();
  }, [currentUser, isOwner]);

  // 4. Fetch Assignments
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'assignments'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignments(list.slice(0, 4));
    }, (err) => console.warn('LeaderHome assignments fallback:', err));
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
    const mappedType = mapCategoryToEventType(ev.category || ev.type);
    const session = attendanceSessions.find(s => 
      s.date === ev.date && 
      (s.eventType === mappedType || (s.notes && s.notes.includes(ev.title)))
    );

    if (!session || !session.records) {
      return { recorded: false, presentCount: 0, totalCount: 0, turnoutPct: 0, session: null, mappedType };
    }

    const records = Object.values(session.records);
    const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
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

  scouts.forEach(scout => {
    let unexcusedCount = 0;
    attendanceSessions.forEach(sess => {
      const rec = sess.records?.[scout.uid];
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
  const filteredEvents = allEvents.filter(ev => {
    const info = getEventAttendanceInfo(ev);
    if (eventAttendanceFilter === 'pending') return !info.recorded;
    if (eventAttendanceFilter === 'recorded') return info.recorded;
    return true;
  });

  const pendingRollCallCount = allEvents.filter(ev => !getEventAttendanceInfo(ev).recorded).length;
  const recordedRollCallCount = allEvents.filter(ev => getEventAttendanceInfo(ev).recorded).length;

  const totalPendingApprovals = Object.values(pendingMap).reduce((sum, item) => sum + (item?.total || 0), 0);
  const scoutsWithPending = scouts.filter(s => (pendingMap[s.uid]?.total || 0) > 0);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ── 1. LEADER HERO COMMAND CARD ── */}
      <div className="bg-gradient-to-br from-slate-850 via-slate-800 to-emerald-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 flex items-center justify-center p-2.5 shadow-xl shadow-emerald-950/50 shrink-0 text-3xl">
              ⚜️
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {roleLabel}
                </span>
                <span className="bg-slate-700/70 text-slate-200 border border-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>👥</span> {scouts.length} Registered Scouts
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>✨</span> Be Prepared &bull; كُن مُسْتَعِدّاً
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || 'Leader'}!
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Welcome to your Dhulfiqār Leadership Command Center. Monitor scout advancement, test submissions, schedule events, and generate customized troop reports.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
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
              onClick={() => onNavigate && onNavigate('attendance')}
              className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Calendar size={15} className="text-teal-400" />
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
            <span className="text-[10px] text-sky-400 block uppercase font-bold tracking-wider">Taliʿat Patrols</span>
            <strong className="text-base font-black text-white block mt-0.5">
              {groups.length} Active Patrols
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

      <LiveClockAndCalendar currentUser={currentUser} onNavigate={onNavigate} />

      {/* ── 2. PENDING SUBMISSIONS & NOTIFICATIONS BANNER ── */}
      {totalPendingApprovals > 0 ? (
        <div
          onClick={() => {
            setSelectedPendingScoutId(null);
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
                  <span>{totalPendingApprovals} Submissions Awaiting Testing & Sign-Off</span>
                </h4>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                {scoutsWithPending.length} scout{scoutsWithPending.length !== 1 ? 's have' : ' has'} submitted rank requirements, Islamic knowledge oral tests, or merit badge tasks for verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPendingScoutId(null);
              setShowPendingModal(true);
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-950/50 shrink-0 self-start sm:self-auto"
          >
            <Clock size={15} />
            <span>Open Testing Queue ({totalPendingApprovals}) &rarr;</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">All Submissions Up-to-Date</h4>
              <p className="text-[11px] text-slate-400">There are no pending oral exams or rank sign-offs waiting in your review queue.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('reports')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View Reports Center</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* ── 3. TWO-COLUMN MAIN HUB: UPCOMING ACTIVITIES & PATROL OVERVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Patrol Overview & Quick Scout Review */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patrol Summary */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groups.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 col-span-2">No patrol groups registered yet.</p>
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
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>📍 {ev.location}</span>
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

        {/* Right 1 Col: Quick Command Hub & Leader Tools */}
        <div className="space-y-6">
          {/* Quick Action Command Hub */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="font-extrabold text-white text-sm border-b border-slate-750 pb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>⚡ Leader Quick Actions</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('reports')}
                className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📈</span>
                  <div>
                    <h4 className="font-bold text-emerald-300 group-hover:text-emerald-200">Reports & Analytics Center</h4>
                    <p className="text-[10px] text-slate-400">Custom print progress builder</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('attendance')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-teal-500/50 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📋</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-teal-300">Patrol Attendance & Retention</h4>
                    <p className="text-[10px] text-slate-400">Roll call, presence logs & absence alerts</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-teal-400 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('scouts')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-slate-650 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📊</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-300">Advancement Tracker</h4>
                    <p className="text-[10px] text-slate-400">7-Rank sign-offs & progress</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-emerald-400 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('lesson-plans')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-slate-650 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📋</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-300">Lesson Plans & Curriculum</h4>
                    <p className="text-[10px] text-slate-400">Teaching modules & guides</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-emerald-400 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('resources')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-slate-650 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🦅</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-300">Road to Eagle Reference</h4>
                    <p className="text-[10px] text-slate-400">Eagle steps & planning guide</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-amber-400 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('chat')}
                className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-slate-650 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💬</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-300">Patrol Messenger</h4>
                    <p className="text-[10px] text-slate-400">Direct scout & parent chat</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-emerald-400 transition" />
              </button>
            </div>
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
