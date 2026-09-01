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

export default function LeaderHome({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const roleLabel = isOwner ? 'Troop Owner / Superadmin' : currentUser?.leaderPosition || 'Troop Leader';

  // Data states
  const [scouts, setScouts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
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

  // 3. Fetch Upcoming Events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEvents(list.slice(0, 4));
    }, (err) => console.warn('LeaderHome events fallback:', err));
    return () => unsub();
  }, []);

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 relative z-10 text-xs">
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
              {events.length} Upcoming
            </strong>
          </div>
        </div>
      </div>

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

          {/* Upcoming Troop Events & Halqas */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-750 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Calendar size={16} className="text-emerald-400" />
                <span>Upcoming Troop Events & Halqas</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('events')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>All Events</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              {events.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3">No upcoming events scheduled.</p>
              ) : (
                events.map(ev => (
                  <div key={ev.id} className="bg-slate-900/80 border border-slate-750 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{ev.title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>📅 {ev.date || 'Scheduled'}</span>
                        {ev.location && <span>📍 {ev.location}</span>}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full">
                      {ev.type || 'Meeting'}
                    </span>
                  </div>
                ))
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
