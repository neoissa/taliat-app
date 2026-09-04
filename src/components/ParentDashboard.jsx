import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import RankIcon from './RankIcon';
import {
  Award,
  Star,
  Compass,
  Calendar,
  Clock,
  BookOpen,
  Heart,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  User,
  Users,
  Layers,
  Lock,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Tent,
  Sparkles,
  Check,
  ArrowRight,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export default function ParentDashboard({ currentUser = {}, onNavigate }) {
  const [parentDoc, setParentDoc] = useState(currentUser);
  const [linkedScouts, setLinkedScouts] = useState([]);
  const [selectedScoutId, setSelectedScoutId] = useState(null);
  const [activeTab, setActiveTab] = useState('advancement'); // 'advancement' | 'merit-badges' | 'attendance' | 'tasks-events' | 'eagle'
  const [loading, setLoading] = useState(true);

  // Active Scout real-time progress state
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [scoutSubmissions, setScoutSubmissions] = useState({});
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [serviceLogs, setServiceLogs] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [eagleData, setEagleData] = useState({});
  const [eagleRoadmap, setEagleRoadmap] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [activeWhatsappPhone, setActiveWhatsappPhone] = useState(null);
  const [activeWhatsappName, setActiveWhatsappName] = useState('');

  // 1. Keep Parent Document updated in real-time
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setParentDoc({ uid: snap.id, ...data });
      }
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // 2. Fetch all users and groups for leader info & scouts lookup
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setAllGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    return () => {
      unsubUsers();
      unsubGroups();
    };
  }, []);

  // 3. Resolve Linked Scouts
  useEffect(() => {
    const linkedIds = parentDoc?.linkedScoutIds || [];
    const matchingScouts = allUsers.filter(u => {
      if (u.role !== 'scout') return false;
      if (linkedIds.includes(u.uid)) return true;
      if (Array.isArray(u.parentUids) && u.parentUids.includes(parentDoc?.uid)) return true;
      if (parentDoc?.email && u.parentEmail && u.parentEmail.toLowerCase().trim() === parentDoc.email.toLowerCase().trim()) return true;
      return false;
    });

    setLinkedScouts(matchingScouts);
    if (matchingScouts.length > 0 && (!selectedScoutId || !matchingScouts.some(s => s.uid === selectedScoutId))) {
      setSelectedScoutId(matchingScouts[0].uid);
    }
    setLoading(false);
  }, [parentDoc, allUsers, selectedScoutId]);

  // Active Selected Scout Object
  const activeScout = linkedScouts.find(s => s.uid === selectedScoutId) || linkedScouts[0] || null;
  const activeScoutId = activeScout?.uid;

  // 4. Real-time Progress Listeners for Active Child
  useEffect(() => {
    if (!activeScoutId) return;

    // Ranks Progress
    const unsubRanks = onSnapshot(collection(db, 'user_progress', activeScoutId, 'ranks'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });

    // Merit Badges Progress
    const unsubMerit = onSnapshot(collection(db, 'user_progress', activeScoutId, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
    });

    // Islamic Basics Progress
    const unsubIslamic = onSnapshot(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) setIslamicProgress(snap.data() || {});
      else setIslamicProgress({});
    });

    // Assignments & Submissions
    const unsubSub = onSnapshot(collection(db, 'user_progress', activeScoutId, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setScoutSubmissions(map);
    });

    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Service Logs
    const unsubService = onSnapshot(collection(db, 'service_logs'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.scoutId === activeScoutId || l.userId === activeScoutId);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setServiceLogs(list);
    });

    // Attendance Sessions
    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.records && s.records[activeScoutId]);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setAttendanceSessions(list);
    });

    // Planned Events
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setEventsList(list);
    });

    // Road to Eagle
    const unsubEagle = onSnapshot(doc(db, 'user_progress', activeScoutId, 'road_to_eagle', 'data'), (snap) => {
      if (snap.exists()) setEagleData(snap.data() || {});
      else setEagleData({});
    });

    const unsubRoadmap = onSnapshot(doc(db, 'user_progress', activeScoutId, 'road_to_eagle', 'project_roadmap'), (snap) => {
      if (snap.exists()) setEagleRoadmap(snap.data() || {});
      else setEagleRoadmap({});
    });

    return () => {
      unsubRanks();
      unsubMerit();
      unsubIslamic();
      unsubSub();
      unsubAssign();
      unsubService();
      unsubAttendance();
      unsubEvents();
      unsubEagle();
      unsubRoadmap();
    };
  }, [activeScoutId]);

  // ── DERIVE ACTIVE SCOUT METRICS ──
  const scoutFullName = activeScout?.fullName || activeScout?.username || 'Scout Member';
  const scoutRank = activeScout?.rank || 'Scout';
  const scoutPatrolName = (() => {
    const g = allGroups.find(grp => grp.id === (activeScout?.groupId || activeScout?.patrolId));
    if (g) return g.name.toLowerCase().includes('patrol') ? g.name : `${g.name} Patrol`;
    return 'Taliʿat Al-Huda';
  })();

  const assignedLeader = allUsers.find(u => u.uid === activeScout?.leaderId) || null;

  // 1. Rank Advancement Calculations
  const completedRanks = RANKS_DATA.filter(rank => {
    const rp = ranksProgress[rank.id] || { completedRequirements: {} };
    const completedReqs = rp.completedRequirements || {};
    const total = rank.categories ? rank.categories.reduce((sum, c) => sum + c.requirements.length, 0) : (rank.requirements?.length || 0);
    const done = rank.categories 
      ? rank.categories.reduce((sum, c) => sum + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0)
      : (rank.requirements?.filter(r => completedReqs[r.id]?.completed)?.length || 0);
    return total > 0 && done === total;
  });

  const activeRankId = scoutRank.toLowerCase().replace(' ', '_');
  const activeRankData = RANKS_DATA.find(r => r.id === activeRankId || r.name.toLowerCase() === scoutRank.toLowerCase()) || RANKS_DATA[0];
  const activeProg = ranksProgress[activeRankData.id] || { completedRequirements: {} };
  const activeCompletedReqs = activeProg.completedRequirements || {};
  const activeTotalReqs = activeRankData.categories 
    ? activeRankData.categories.reduce((sum, c) => sum + c.requirements.length, 0)
    : (activeRankData.requirements?.length || 0);
  const activeDoneReqs = activeRankData.categories
    ? activeRankData.categories.reduce((sum, c) => sum + c.requirements.filter(r => activeCompletedReqs[r.id]?.completed).length, 0)
    : (activeRankData.requirements?.filter(r => activeCompletedReqs[r.id]?.completed)?.length || 0);
  const activePercent = activeTotalReqs > 0 ? Math.round((activeDoneReqs / activeTotalReqs) * 100) : 0;

  // 2. Merit Badges Calculations
  const earnedBadges = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    const totalReqs = b.requirements ? b.requirements.length : 1;
    const doneCount = b.requirements ? b.requirements.filter(r => {
      const s = p.steps?.[r.id] || p.completedSteps?.[r.id];
      return s === true || s?.completed === true || s === 'approved' || s?.approved === true;
    }).length : 0;
    return p.completed === true || (totalReqs > 0 && doneCount === totalReqs);
  });

  const eagleBadgesEarned = earnedBadges.filter(b => b.eagleRequired).length;

  const inProgressBadges = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    const totalReqs = b.requirements ? b.requirements.length : 1;
    const doneCount = b.requirements ? b.requirements.filter(r => {
      const s = p.steps?.[r.id] || p.completedSteps?.[r.id];
      return s === true || s?.completed === true || s === 'approved' || s?.approved === true;
    }).length : 0;
    return !p.completed && doneCount > 0 && doneCount < totalReqs;
  });

  const plannedBadgesList = eagleData.selectedBadges || [];

  // 3. Attendance Calculations
  let totalAttendedHours = 0;
  let campingNights = 0;
  let tuesdayHours = 0;
  let fridayHours = 0;
  let attendedSessionsCount = 0;
  let unexcusedAbsences = 0;
  let excusedCount = 0;

  attendanceSessions.forEach(s => {
    const rec = s.records?.[activeScoutId];
    if (rec) {
      const sType = s.eventType || '';
      const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
      const defaultN = sType.includes('Camp') ? 2 : 0;
      const h = rec.hours !== undefined ? Number(rec.hours) : (s.hours !== undefined ? Number(s.hours) : defaultH);
      const n = rec.nights !== undefined ? Number(rec.nights) : (s.nights !== undefined ? Number(s.nights) : defaultN);

      if (rec.status === 'present' || rec.status === 'late') {
        attendedSessionsCount++;
        totalAttendedHours += h;
        campingNights += n;
        if (sType.includes('Tuesday')) tuesdayHours += h;
        else if (sType.includes('Weekly') || sType.includes('Friday')) fridayHours += h;
      } else if (rec.status === 'excused') {
        excusedCount++;
      } else if (rec.status === 'absent') {
        unexcusedAbsences++;
      }
    }
  });

  const totalSessionsCount = attendanceSessions.length;
  const attendanceRate = totalSessionsCount > 0 ? Math.round((attendedSessionsCount / totalSessionsCount) * 100) : 100;
  const riskLevel = unexcusedAbsences >= 3 ? 'critical' : unexcusedAbsences === 2 ? 'warning' : 'good';

  // 4. Service Hours Calculation
  const totalServiceHours = serviceLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  const conservationHours = serviceLogs.filter(l => l.conservation).reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  // 5. Homework & Tasks
  const homeworkList = assignmentsList.map(a => {
    const sub = scoutSubmissions[a.id] || {};
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate || 'Ongoing',
      category: a.category || (a.isIslamic ? 'Islamic Knowledge' : 'General Skill'),
      status: sub.completed ? 'Completed' : sub.submittedDate ? 'Submitted / Under Review' : 'Assigned',
      grade: sub.grade || (sub.completed ? '✓ Approved' : 'Pending Review'),
      submittedDate: sub.submittedDate || ''
    };
  });

  // 6. Islamic Basics
  const completedIslamicTopics = ISLAMIC_BASICS_TOPICS.filter(t => {
    const p = islamicProgress[t.id] || {};
    return p.completed === true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-semibold">Loading Parent Portal...</span>
      </div>
    );
  }

  // ── EMPTY STATE IF NO LINKED CHILDREN ──
  if (linkedScouts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-800 border-2 border-emerald-500/40 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl">
          👨‍👩‍👧
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Welcome to the Dhulfiqār Parent Portal</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your parent account is active, but no scout profiles have been linked to your account yet.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-left max-w-md mx-auto space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Next Steps to Connect:</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">1.</span>
              <span>Notify your child's <strong>Patrol Leader</strong> or <strong>Scoutmaster</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">2.</span>
              <span>Provide them with your email address: <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-mono">{parentDoc?.email}</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">3.</span>
              <span>Once linked, your child's real-time advancement, attendance, merit badges, and event calendar will appear here automatically.</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ── 1. CHILD SELECTOR SWITCHER (SCREEN ONLY) ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-hide">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1.5">
            <Users size={14} className="text-emerald-400" />
            <span>Select Scout:</span>
          </span>
          {linkedScouts.map(child => {
            const isSelected = child.uid === activeScoutId;
            return (
              <button
                key={child.uid}
                onClick={() => setSelectedScoutId(child.uid)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40 scale-105'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                {child.photoURL ? (
                  <img src={child.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-[10px] uppercase font-bold">
                    {(child.fullName || child.username).charAt(0)}
                  </div>
                )}
                <span>{child.fullName || child.username}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {child.rank || 'Scout'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Print Button */}
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Printer size={14} />
          <span>Print Progress Plan</span>
        </button>
      </div>

      {/* ── 2. HERO SCOUT PROFILE & LEADER CONTACT CARD (SCREEN ONLY) ── */}
      <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-750 rounded-3xl p-6 shadow-2xl space-y-6 print-hide">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-750/70 pb-6">
          {/* Scout Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {activeScout?.photoURL ? (
                <img
                  src={activeScout.photoURL}
                  alt={scoutFullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-500/40 flex items-center justify-center text-white text-2xl font-black shadow-lg uppercase">
                  {scoutFullName.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-slate-700 p-1 rounded-lg shadow-md">
                <RankIcon rankName={scoutRank} size={20} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">{scoutFullName}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {scoutRank} Rank
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                🛡️ {scoutPatrolName} &bull; BSA ID: <span className="font-mono text-slate-300 font-bold">{activeScout?.bsaId || 'BSA-110-' + activeScoutId.substring(0, 5).toUpperCase()}</span>
              </p>
            </div>
          </div>

          {/* Assigned Leader Quick Contact */}
          {assignedLeader && (
            <div className="bg-slate-900/80 border border-slate-750 p-3.5 rounded-2xl flex items-center gap-3.5 shrink-0 self-stretch sm:self-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                ⚜️
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Patrol Leader</span>
                <p className="font-bold text-white text-xs truncate">{assignedLeader.fullName || assignedLeader.username}</p>
                <p className="text-[10px] text-slate-400 truncate">{assignedLeader.leaderPosition || assignedLeader.role}</p>
              </div>

              {assignedLeader.scoutPhone && (
                <button
                  onClick={() => {
                    setActiveWhatsappPhone(assignedLeader.scoutPhone);
                    setActiveWhatsappName(assignedLeader.fullName || assignedLeader.username);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition cursor-pointer flex items-center justify-center shadow-md shrink-0"
                  title="Chat with Leader on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── 4-TILE SUMMARY KPI BAR ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Rank Progress Tile */}
          <div className="bg-slate-900/70 border border-slate-755 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase">
              <span>{activeRankData.name} Rank</span>
              <span className="text-emerald-400 font-mono text-sm">{activePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">
              {activeDoneReqs} of {activeTotalReqs} requirements signed
            </span>
          </div>

          {/* Attendance Standing Tile */}
          <div className={`border p-4 rounded-2xl space-y-1 ${
            riskLevel === 'critical'
              ? 'bg-red-950/40 border-red-800/80 text-red-200'
              : riskLevel === 'warning'
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">Attendance Standing</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-mono">{attendanceRate}%</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/40">
                {riskLevel === 'critical' ? '🚨 Critical' : riskLevel === 'warning' ? '⚠️ At Risk' : '🟢 Good'}
              </span>
            </div>
            <span className="text-[10px] opacity-90 block">
              {Math.round(totalAttendedHours * 10) / 10}h &bull; {campingNights} Nights
            </span>
          </div>

          {/* Merit Badges Tile */}
          <div className="bg-slate-900/70 border border-slate-755 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Merit Badges</span>
            <p className="text-xl font-black text-amber-400 font-mono">
              {earnedBadges.length} <span className="text-xs font-bold text-slate-400">/ 21 Earned</span>
            </p>
            <span className="text-[10px] text-slate-400 block">
              ★ {eagleBadgesEarned} of 14 Eagle-Required
            </span>
          </div>

          {/* Service Hours Tile */}
          <div className="bg-slate-900/70 border border-slate-755 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Community Service</span>
            <p className="text-xl font-black text-sky-400 font-mono">
              {totalServiceHours}h <span className="text-xs font-bold text-slate-400">Logged</span>
            </p>
            <span className="text-[10px] text-slate-400 block">
              🌿 {conservationHours}h Conservation
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. PARENT DASHBOARD NAVIGATION TABS (SCREEN ONLY) ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-750 scrollbar-none print-hide">
        <button
          onClick={() => setActiveTab('advancement')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'advancement'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Award size={15} />
          <span>7 Ranks Advancement</span>
        </button>

        <button
          onClick={() => setActiveTab('merit-badges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'merit-badges'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Star size={15} />
          <span>Merit Badges ({earnedBadges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Compass size={15} />
          <span>Attendance & Activities</span>
          {riskLevel !== 'good' && (
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
              riskLevel === 'critical' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-slate-950'
            }`}>
              {unexcusedAbsences} Absences
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tasks-events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'tasks-events'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar size={15} />
          <span>Homework & Troop Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('eagle')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'eagle'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span>🦅 Road to Eagle</span>
        </button>
      </div>

      {/* ── 4. TAB CONTENTS (STRICTLY READ-ONLY) ── */}
      <div className="print-hide">

        {/* ──── TAB 1: RANK ADVANCEMENT ──── */}
        {activeTab === 'advancement' && (
          <div className="space-y-6">
            {/* Completed Ranks Timeline */}
            {completedRanks.length > 0 && (
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Fully Completed Ranks ({completedRanks.length} of 7)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {completedRanks.map(r => (
                    <div key={r.id} className="bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-xl flex items-center gap-3">
                      <RankIcon rankName={r.name} size={28} />
                      <div>
                        <strong className="text-sm font-black text-white">{r.name} Rank</strong>
                        <span className="text-[10px] text-emerald-400 block font-semibold">✓ Board of Review Passed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Active Rank Checklist */}
            <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-4">
                <div className="flex items-center gap-3">
                  <RankIcon rankName={activeRankData.name} size={36} />
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Current Target: {activeRankData.name} Rank
                    </h3>
                    <p className="text-xs text-slate-400">
                      {activeDoneReqs} of {activeTotalReqs} requirements signed off by Scoutmaster
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{activePercent}%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Progress to Next Rank</span>
                </div>
              </div>

              {/* Requirement Categories Breakdown */}
              <div className="space-y-4">
                {activeRankData.categories ? (
                  activeRankData.categories.map((category) => (
                    <div key={category.name} className="bg-slate-900/60 border border-slate-750 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5">
                        {category.name}
                      </h4>
                      <div className="space-y-2">
                        {category.requirements.map((req) => {
                          const isDone = !!activeCompletedReqs[req.id]?.completed;
                          const signDate = activeCompletedReqs[req.id]?.completedAt || '';
                          const note = activeCompletedReqs[req.id]?.note || '';

                          return (
                            <div
                              key={req.id}
                              className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs transition ${
                                isDone
                                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                                  : 'bg-slate-800/40 border-slate-750 text-slate-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-black mt-0.5 ${
                                  isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {isDone ? '✓' : req.number}
                                </span>
                                <div className="space-y-1">
                                  <p className={isDone ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}>
                                    {req.text}
                                  </p>
                                  {note && (
                                    <p className="text-[11px] text-emerald-300/80 italic">
                                      Leader remark: "{note}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                {isDone ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    {signDate ? `Signed ${signDate}` : 'Completed'}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                    Incomplete
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No categories recorded for this rank.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──── TAB 2: MERIT BADGES ──── */}
        {activeTab === 'merit-badges' && (
          <div className="space-y-6">
            {/* Earned Badges Showcase */}
            <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-750 pb-3">
                <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                  <Award size={16} className="text-emerald-400" />
                  <span>Fully Earned Merit Badges ({earnedBadges.length})</span>
                </h3>
                <span className="text-xs font-bold text-amber-400">★ {eagleBadgesEarned} Eagle-Required</span>
              </div>

              {earnedBadges.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No merit badges completed yet. Merit badges in progress are listed below.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {earnedBadges.map(b => {
                    const mp = meritProgress[b.id] || {};
                    return (
                      <div key={b.id} className="bg-slate-900/80 border border-slate-750 p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{b.icon || '🏅'}</span>
                          <div>
                            <strong className="text-xs font-black text-white block">{b.name}</strong>
                            <span className="text-[10px] text-emerald-400 font-bold block">✓ Verified Complete</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>{b.eagleRequired ? '★ Eagle-Req' : 'Elective'}</span>
                          <span className="font-mono">{mp.completedDate || mp.dateCompleted || 'Completed'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* In-Progress Merit Badges */}
            <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2 border-b border-slate-750 pb-3">
                <Clock size={16} className="text-amber-400" />
                <span>Active In-Progress Badges ({inProgressBadges.length})</span>
              </h3>

              {inProgressBadges.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No active badges currently in progress.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {inProgressBadges.map(b => {
                    const mp = meritProgress[b.id] || {};
                    const totalReqs = b.requirements ? b.requirements.length : 1;
                    const doneCount = b.requirements ? b.requirements.filter(r => {
                      const s = mp.steps?.[r.id] || mp.completedSteps?.[r.id];
                      return s === true || s?.completed === true || s === 'approved';
                    }).length : 0;
                    const pct = Math.round((doneCount / totalReqs) * 100);

                    return (
                      <div key={b.id} className="bg-slate-900/80 border border-slate-750 p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{b.icon || '🏅'}</span>
                          <div className="min-w-0 flex-1">
                            <strong className="text-xs font-black text-white block truncate">{b.name}</strong>
                            <span className="text-[10px] text-amber-400 font-bold block">{doneCount} of {totalReqs} steps ({pct}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 14 Eagle-Required Checklist */}
            <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2 border-b border-slate-750 pb-3">
                <span>🦅 14 Eagle-Required Subject Matrix</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {MERIT_BADGES.filter(b => b.eagleRequired).map(b => {
                  const mp = meritProgress[b.id] || {};
                  const isEarned = mp.completed === true || (b.requirements && b.requirements.filter(r => mp.steps?.[r.id]).length === b.requirements.length);

                  return (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                        isEarned
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200 font-bold'
                          : 'bg-slate-900/50 border-slate-750 text-slate-400'
                      }`}
                    >
                      <span className="truncate text-xs">{b.name}</span>
                      <span className="text-[10px] shrink-0 font-mono">
                        {isEarned ? '✓' : 'Needed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ──── TAB 3: ATTENDANCE & ACTIVITIES ──── */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Standing Risk Banner */}
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              riskLevel === 'critical'
                ? 'bg-red-950/40 border-red-700/60 text-red-200 shadow-xl shadow-red-950/30'
                : riskLevel === 'warning'
                ? 'bg-amber-950/40 border-amber-700/60 text-amber-200 shadow-xl shadow-amber-950/30'
                : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200 shadow-xl shadow-emerald-950/30'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
                  riskLevel === 'critical' ? 'bg-red-500/20 border border-red-500 text-red-400' : riskLevel === 'warning' ? 'bg-amber-500/20 border border-amber-500 text-amber-400' : 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                }`}>
                  {riskLevel === 'critical' ? '🚨' : riskLevel === 'warning' ? '⚠️' : '🟢'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {riskLevel === 'critical' ? 'Official Retention Alert: Critical Risk' : riskLevel === 'warning' ? 'Attendance Notice: At Risk' : 'Attendance Health: In Good Standing'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                    {riskLevel === 'critical'
                      ? `${scoutFullName} has ${unexcusedAbsences} unexcused absences (${attendanceRate}% overall rate). Please connect with your patrol leader to schedule an attendance review.`
                      : riskLevel === 'warning'
                      ? `${scoutFullName} has 2 unexcused absences (${attendanceRate}% overall rate). Minimum 75% attendance standard required for rank advancement.`
                      : `${scoutFullName} is in good standing with ${attendanceRate}% attendance rate, ${Math.round(totalAttendedHours * 10) / 10} credited hours, and ${campingNights} camping nights.`}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-700 px-4 py-2 rounded-xl text-center shrink-0 self-start sm:self-auto font-mono text-xs">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Attendance Rate</span>
                <span className="text-base font-black text-white">{attendanceRate}%</span>
                <span className="text-[10px] text-slate-400 block">({attendedSessionsCount}/{totalSessionsCount} Sessions)</span>
              </div>
            </div>

            {/* Attendance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Attended</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{Math.round(totalAttendedHours * 10) / 10}h</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Credited Hours</span>
              </div>
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Camping Experience</span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-1">{campingNights} Nights</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Overnight Camps</span>
              </div>
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tuesday Program</span>
                <p className="text-2xl font-black text-sky-400 font-mono mt-1">{Math.round(tuesdayHours * 10) / 10}h</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Midweek Sessions</span>
              </div>
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Troop Meetings</span>
                <p className="text-2xl font-black text-purple-400 font-mono mt-1">{Math.round(fridayHours * 10) / 10}h</p>
                <span className="text-[10px] text-slate-500 block mt-0.5">Friday Weekly</span>
              </div>
            </div>

            {/* Chronological Session History Ledger */}
            <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="font-bold text-white text-sm">Attendance History Ledger</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-750">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Program / Session</th>
                      <th className="p-3 text-center">Hours</th>
                      <th className="p-3 text-center">Nights</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Session Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-750">
                    {attendanceSessions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center text-slate-400 italic">No attendance records logged yet.</td>
                      </tr>
                    ) : (
                      attendanceSessions.map(s => {
                        const rec = s.records?.[activeScoutId] || { status: 'present' };
                        const isAttended = rec.status === 'present' || rec.status === 'late';
                        const sType = s.eventType || '';
                        const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
                        const defaultN = sType.includes('Camp') ? 2 : 0;
                        const h = isAttended ? (rec.hours !== undefined ? Number(rec.hours) : (s.hours !== undefined ? Number(s.hours) : defaultH)) : 0;
                        const n = isAttended ? (rec.nights !== undefined ? Number(rec.nights) : (s.nights !== undefined ? Number(s.nights) : defaultN)) : 0;

                        return (
                          <tr key={s.id} className="hover:bg-slate-800/40 transition">
                            <td className="p-3 font-mono text-slate-300 font-bold">{s.date}</td>
                            <td className="p-3 font-semibold text-white">{s.eventType}</td>
                            <td className="p-3 text-center font-mono font-bold text-emerald-400">{h}h</td>
                            <td className="p-3 text-center font-mono text-amber-400">{n}n</td>
                            <td className="p-3 text-center">
                              {rec.status === 'present' ? (
                                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full text-[10px] font-bold">✓ Present</span>
                              ) : rec.status === 'late' ? (
                                <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded-full text-[10px] font-bold">⏱️ Late</span>
                              ) : rec.status === 'excused' ? (
                                <span className="bg-sky-950/80 text-sky-300 border border-sky-700/60 px-2 py-0.5 rounded-full text-[10px] font-bold">✉️ Excused</span>
                              ) : (
                                <span className="bg-red-950/80 text-red-300 border border-red-700/60 px-2 py-0.5 rounded-full text-[10px] font-bold">✗ Absent</span>
                              )}
                            </td>
                            <td className="p-3 text-slate-400">{rec.note || s.notes || '—'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ──── TAB 4: HOMEWORK & TROOP EVENTS ──── */}
        {activeTab === 'tasks-events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assigned Homework & Tasks */}
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-750 pb-3">
                  <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                    <BookOpen size={16} className="text-emerald-400" />
                    <span>Assigned Tasks & Homework</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{homeworkList.length} Tasks</span>
                </div>

                <div className="space-y-2.5">
                  {homeworkList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">No assignments logged.</p>
                  ) : (
                    homeworkList.map(h => (
                      <div key={h.id} className="bg-slate-900/80 border border-slate-750 p-3.5 rounded-xl space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <strong className="text-xs font-bold text-white block">{h.title}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            h.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                        {h.description && (
                          <p className="text-[11px] text-slate-400 leading-relaxed">{h.description}</p>
                        )}
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                          <span>Due: {h.dueDate}</span>
                          <span className="font-bold text-emerald-400">{h.grade}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Islamic Knowledge Curriculum */}
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-750 pb-3">
                  <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span>Islamic Basics Curriculum</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{completedIslamicTopics.length} / {ISLAMIC_BASICS_TOPICS.length} Passed</span>
                </div>

                <div className="space-y-2">
                  {ISLAMIC_BASICS_TOPICS.slice(0, 6).map(topic => {
                    const p = islamicProgress[topic.id] || {};
                    const isDone = p.completed === true;

                    return (
                      <div
                        key={topic.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isDone ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-slate-900/50 border-slate-750 text-slate-400'
                        }`}
                      >
                        <span className="font-bold">{topic.title}</span>
                        <span className="text-[10px] font-mono">
                          {isDone ? '✓ Tested & Passed' : 'Pending Study'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Troop Events & Campouts */}
            <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2 border-b border-slate-750 pb-3">
                <Calendar size={16} className="text-sky-400" />
                <span>Troop Calendar & Scheduled Events</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {eventsList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center col-span-full">No upcoming events scheduled in the calendar.</p>
                ) : (
                  eventsList.slice(0, 6).map(ev => (
                    <div key={ev.id} className="bg-slate-900/80 border border-slate-750 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-xs font-bold text-white block">{ev.title}</strong>
                        <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full font-mono shrink-0">
                          {ev.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 capitalize">{ev.type || 'Troop Meeting'}</p>
                      {ev.location && (
                        <p className="text-[10px] text-slate-500">📍 {ev.location}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──── TAB 5: ROAD TO EAGLE ──── */}
        {activeTab === 'eagle' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-850 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-amber-500/30 pb-4">
                <div>
                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <span>🦅 Road to Eagle Capstone Portfolio</span>
                  </h3>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    Monitoring requirements for BSA's highest rank of Eagle Scout.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-xl border border-amber-700">
                  {eagleBadgesEarned} / 14 Eagle Badges
                </span>
              </div>

              {/* 5-Phase Project Roadmap Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Eagle Service Project 5-Phase Progression:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {[
                    { phase: 1, name: 'Project Proposal', status: eagleRoadmap.phase1?.status || 'In Progress' },
                    { phase: 2, name: 'Approvals & Signatures', status: eagleRoadmap.phase2?.status || 'Pending' },
                    { phase: 3, name: 'Fundraising & Planning', status: eagleRoadmap.phase3?.status || 'Pending' },
                    { phase: 4, name: 'Project Execution', status: eagleRoadmap.phase4?.status || 'Pending' },
                    { phase: 5, name: 'Final Report & BoR', status: eagleRoadmap.phase5?.status || 'Pending' }
                  ].map((p) => {
                    const isPhaseDone = p.status === 'Completed' || p.status === 'Approved';
                    return (
                      <div
                        key={p.phase}
                        className={`p-3 rounded-xl border text-center space-y-1 ${
                          isPhaseDone
                            ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                            : 'bg-slate-900/60 border-slate-750 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold block">Phase {p.phase}</span>
                        <strong className="text-xs block text-white">{p.name}</strong>
                        <span className="text-[9px] font-mono block text-amber-400 font-bold">{p.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ──────────────── 5. OFFICIAL PRINT-ONLY PROGRESS DOCUMENT ──────────────── */}
      <div className="print-only space-y-6 text-black bg-white p-6">
        {/* Header */}
        <div className="border-b-4 border-black pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase">DHULFIQĀR SCOUTS BSA</h1>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">Official Scout Advancement & Progress Report</h2>
          </div>
          <div className="text-right text-xs text-slate-700 font-mono">
            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Patrol:</strong> {scoutPatrolName}</p>
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3 rounded border border-slate-300 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Scout Name</span>
            <strong className="text-sm text-black font-black">{scoutFullName}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Current Rank</span>
            <strong className="text-sm text-black font-black uppercase">{scoutRank}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-600 block">BSA Member ID</span>
            <strong className="text-xs text-black font-mono">{activeScout?.bsaId || 'BSA-110-' + activeScoutId.substring(0, 5).toUpperCase()}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Attendance Rate</span>
            <strong className="text-xs text-black font-mono font-bold">{attendanceRate}% ({Math.round(totalAttendedHours * 10) / 10}h)</strong>
          </div>
        </div>

        {/* Official Attendance & Retention Standing Box */}
        <div className={`border-2 p-3.5 rounded-xl ${
          riskLevel === 'critical' ? 'border-red-600 bg-red-50 text-red-950' : riskLevel === 'warning' ? 'border-amber-600 bg-amber-50 text-amber-950' : 'border-emerald-700 bg-emerald-50 text-emerald-950'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <strong className="text-xs uppercase font-black">
              {riskLevel === 'critical' ? '🚨 OFFICIAL RETENTION NOTICE: CRITICAL ATTENDANCE RISK' : riskLevel === 'warning' ? '⚠️ ATTENDANCE WARNING NOTICE: AT RISK' : '🟢 ATTENDANCE CERTIFICATION: IN GOOD STANDING'}
            </strong>
            <span className="font-mono text-xs font-bold">
              {attendedSessionsCount}/{totalSessionsCount} Sessions ({attendanceRate}%) &bull; {unexcusedAbsences} Unexcused Absences
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            {riskLevel === 'critical'
              ? `Scout has accumulated ${unexcusedAbsences} unexcused absences (${attendanceRate}% overall rate). A parent-leader conference is required prior to rank board of review qualification.`
              : riskLevel === 'warning'
              ? `Scout has 2 unexcused absences (${attendanceRate}% overall rate). Minimum 75% attendance standard required for rank advancement.`
              : `Scout is certified in good standing with ${attendanceRate}% attendance rate, ${Math.round(totalAttendedHours * 10) / 10} attended hours, and ${campingNights} camping nights.`}
          </p>
        </div>

        {/* Advancement Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-black border-b border-slate-300 pb-1">
            Advancement Summary ({activeRankData.name} Rank Checklist)
          </h3>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-black">
                <th className="p-1.5 border border-slate-300 w-12">No.</th>
                <th className="p-1.5 border border-slate-300">Requirement Details</th>
                <th className="p-1.5 border border-slate-300 w-24 text-center">Status</th>
                <th className="p-1.5 border border-slate-300 w-28">Date Signed</th>
              </tr>
            </thead>
            <tbody>
              {activeRankData.categories?.map(category =>
                category.requirements.map(req => {
                  const isDone = !!activeCompletedReqs[req.id]?.completed;
                  const signDate = activeCompletedReqs[req.id]?.completedAt || '';
                  return (
                    <tr key={req.id} className="border-t border-slate-300">
                      <td className="p-1.5 border border-slate-300 font-mono font-bold">{req.number}</td>
                      <td className="p-1.5 border border-slate-300">{req.text}</td>
                      <td className="p-1.5 border border-slate-300 text-center font-bold">
                        {isDone ? 'COMPLETED' : 'INCOMPLETE'}
                      </td>
                      <td className="p-1.5 border border-slate-300 font-mono">{signDate || (isDone ? 'Verified' : '—')}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Attendance Activity Ledger Table */}
        <div className="space-y-2">
          <div className="flex justify-between items-center border-b border-slate-300 pb-1">
            <h3 className="text-xs font-black uppercase text-black">Attendance & Participation Ledger</h3>
            <span className="text-[10px] font-mono text-slate-600 font-bold">
              Total Attended: {Math.round(totalAttendedHours * 10) / 10}h &bull; {campingNights} Camping Nights
            </span>
          </div>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-black">
                <th className="p-1.5 border border-slate-300 w-24">Date</th>
                <th className="p-1.5 border border-slate-300">Program / Event</th>
                <th className="p-1.5 border border-slate-300 w-16 text-center">Hours</th>
                <th className="p-1.5 border border-slate-300 w-16 text-center">Nights</th>
                <th className="p-1.5 border border-slate-300 w-24 text-center">Status</th>
                <th className="p-1.5 border border-slate-300">Notes / Topic</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSessions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2 text-center text-slate-500 italic">No attendance records logged.</td>
                </tr>
              ) : (
                attendanceSessions.map(s => {
                  const rec = s.records?.[activeScoutId] || { status: 'present' };
                  const isAttended = rec.status === 'present' || rec.status === 'late';
                  const sType = s.eventType || '';
                  const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
                  const defaultN = sType.includes('Camp') ? 2 : 0;
                  const h = isAttended ? (rec.hours !== undefined ? Number(rec.hours) : (s.hours !== undefined ? Number(s.hours) : defaultH)) : 0;
                  const n = isAttended ? (rec.nights !== undefined ? Number(rec.nights) : (s.nights !== undefined ? Number(s.nights) : defaultN)) : 0;

                  return (
                    <tr key={s.id} className="border-t border-slate-300">
                      <td className="p-1.5 border border-slate-300 font-mono">{s.date}</td>
                      <td className="p-1.5 border border-slate-300 font-bold">{s.eventType}</td>
                      <td className="p-1.5 border border-slate-300 text-center font-mono font-bold">{h}h</td>
                      <td className="p-1.5 border border-slate-300 text-center font-mono">{n}n</td>
                      <td className="p-1.5 border border-slate-300 text-center font-bold text-[10px]">
                        {rec.status === 'present' ? '✓ Present' : rec.status === 'late' ? '⏱️ Late' : rec.status === 'excused' ? '✉️ Excused' : '✗ Absent'}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-slate-700">{rec.note || s.notes || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t-2 border-black grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="border-b border-black h-10"></div>
            <p className="font-bold text-black mt-1">Parent / Guardian Signature</p>
          </div>
          <div>
            <div className="border-b border-black h-10"></div>
            <p className="font-bold text-black mt-1">Scoutmaster / Unit Leader Signature</p>
          </div>
        </div>
      </div>

      {/* ── 6. WHATSAPP TEMPLATE MODAL ── */}
      {activeWhatsappPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print-hide">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-left">
            <h3 className="font-bold text-white text-base">Send WhatsApp to Leader</h3>
            <p className="text-xs text-slate-300">
              Select a message template to send to <strong>{activeWhatsappName}</strong> ({activeWhatsappPhone}):
            </p>
            <div className="space-y-2">
              {[
                { label: "General Inquiry", text: `Salam! This is ${parentDoc.fullName || 'Parent'} regarding ${scoutFullName}.` },
                { label: "Attendance & Absence Notice", text: `Salam! Regarding upcoming troop meeting/campout, I wanted to notify you about ${scoutFullName}'s attendance.` },
                { label: "Advancement Check-In", text: `Salam! I wanted to check in regarding ${scoutFullName}'s progress on ${activeRankData.name} rank requirements.` },
                { label: "Merit Badge Question", text: `Salam! I have a question regarding ${scoutFullName}'s active merit badge counselor.` }
              ].map((tmpl) => {
                const encodedText = encodeURIComponent(tmpl.text);
                const waLink = `https://wa.me/${activeWhatsappPhone.replace(/[^0-9]/g, '')}${tmpl.text ? `?text=${encodedText}` : ''}`;
                return (
                  <a
                    key={tmpl.label}
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveWhatsappPhone(null)}
                    className="block w-full bg-slate-900 border border-slate-750 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition"
                  >
                    {tmpl.label}
                    {tmpl.text && <span className="block text-[10px] text-slate-450 font-normal mt-0.5 truncate">{tmpl.text}</span>}
                  </a>
                );
              })}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-750">
              <button
                onClick={() => setActiveWhatsappPhone(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
