import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  Sparkles,
  Heart,
  Compass,
  Tent,
  Flame,
  CheckCheck
} from 'lucide-react';
import RankIcon from './RankIcon';

export default function ScoutProgressReport({ scout, currentUser, onBack }) {
  const scoutUid = scout?.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'assistant_leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  // Mode Toggle: 'cumulative' vs 'window'
  const [reportMode, setReportMode] = useState('cumulative');

  // Date Range Inputs (defaults: 90 days ago through today)
  const defaultStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEndDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Real-time data states
  const [profileData, setProfileData] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [serviceLogs, setServiceLogs] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [scoutSubmissions, setScoutSubmissions] = useState({});
  const [scoutHomeworkMap, setScoutHomeworkMap] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [leaderNotesDoc, setLeaderNotesDoc] = useState({});
  const [eagleData, setEagleData] = useState({});
  const [eagleRoadmap, setEagleRoadmap] = useState({});
  const [loading, setLoading] = useState(true);

  // Editable commentary fields for Leader
  const [strengthsText, setStrengthsText] = useState('');
  const [focusAreasText, setFocusAreasText] = useState('');
  const [parentActionItems, setParentActionItems] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaveMsg, setNotesSaveMsg] = useState('');

  const generationDate = new Date().toLocaleDateString('en-US', {
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

  // 1.5. Fetch Scout Group / Tali'a Info
  useEffect(() => {
    const gId = profileData?.groupId || profileData?.patrolId || scout?.groupId || scout?.patrolId || currentUser?.groupId;
    if (!gId) {
      setGroupData(null);
      return;
    }
    const unsub = onSnapshot(doc(db, 'groups', gId), (snap) => {
      if (snap.exists()) {
        setGroupData(snap.data());
      } else {
        setGroupData(null);
      }
    }, (err) => console.warn('Group listener fallback:', err));
    return () => unsub();
  }, [profileData?.groupId, profileData?.patrolId, scout?.groupId, scout?.patrolId, currentUser?.groupId]);

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
        setIslamicProgress(snap.data() || {});
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
    const unsubHw = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const m = {};
      snap.docs.forEach(d => { m[d.id] = d.data(); });
      setScoutHomeworkMap(m);
    });
    const unsubSub = onSnapshot(collection(db, 'user_progress', scoutUid, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setScoutSubmissions(map);
    });
    return () => {
      unsubAssign();
      unsubSub();
      unsubHw();
    };
  }, [scoutUid]);

  // 7. Fetch Events List & Attendance Sessions
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setEventsList(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!scoutUid) return;
    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.records && s.records[scoutUid]);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setAttendanceSessions(list);
    });
    return () => unsubAttendance();
  }, [scoutUid]);

  // 8. Fetch Leader Notes & Road to Eagle
  useEffect(() => {
    if (!scoutUid) return;
    const unsubNotes = onSnapshot(doc(db, 'scout_notes', scoutUid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLeaderNotesDoc(data);
        setStrengthsText(data.strengths || data.notes || '');
        setFocusAreasText(data.focusAreas || '');
        setParentActionItems(data.parentActionItems || '');
      }
    });

    const unsubEagle = onSnapshot(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'data'), (snap) => {
      if (snap.exists()) setEagleData(snap.data() || {});
    });

    const unsubRoadmap = onSnapshot(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'project_roadmap'), (snap) => {
      if (snap.exists()) setEagleRoadmap(snap.data() || {});
      setLoading(false);
    });

    return () => {
      unsubNotes();
      unsubEagle();
      unsubRoadmap();
    };
  }, [scoutUid]);

  const handleSaveLeaderNotes = async () => {
    if (!scoutUid) return;
    setSavingNotes(true);
    try {
      await setDoc(doc(db, 'scout_notes', scoutUid), {
        strengths: strengthsText,
        focusAreas: focusAreasText,
        parentActionItems: parentActionItems,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.uid || 'leader'
      }, { merge: true });
      setNotesSaveMsg('✓ Notes saved for report.');
      setTimeout(() => setNotesSaveMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save leader notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Scout Demographic Metadata
  const scoutInfo = profileData || scout || currentUser || {};
  const scoutFullName = scoutInfo.fullName || scoutInfo.username || 'Scout Member';
  const scoutRank = (scoutInfo.rank || 'Scout').toLowerCase();
  const rawPatrolName = groupData?.name || profileData?.patrolName || profileData?.groupName || scout?.patrolName || scout?.groupName || currentUser?.patrolName || profileData?.groupId || scout?.groupId || 'Al-Huda';
  const formattedTaliaName = (() => {
    if (!rawPatrolName) return 'Taliʿat Al-Huda';
    const lower = String(rawPatrolName).toLowerCase().trim();
    if (lower.startsWith('taliat') || lower.startsWith('talia') || lower.startsWith('taliʿa') || lower.startsWith('taliʿat') || lower.startsWith('tali\'at')) {
      return rawPatrolName;
    }
    return `Taliʿat ${rawPatrolName}`;
  })();
  const scoutPatrol = formattedTaliaName;
  const scoutBsaId = scoutInfo.bsaId || 'BSA-110-' + (scoutUid ? scoutUid.substring(0, 5).toUpperCase() : '0000');
  const assignedLeaderName = currentUser?.fullName || currentUser?.username || 'Unit Scoutmaster';

  // ── ATTENDANCE METRICS ENGINE ──
  const filteredAttendance = attendanceSessions.filter(s => {
    if (reportMode === 'window') {
      return s.date >= startDate && s.date <= endDate;
    }
    return true;
  });

  let reportTotalAttendedHours = 0;
  let reportTotalCampingNights = 0;
  let reportTotalTuesdayHours = 0;
  let reportTotalFridayHours = 0;
  let reportAttendedSessionsCount = 0;
  let reportUnexcusedAbsences = 0;
  let reportExcusedCount = 0;

  filteredAttendance.forEach(s => {
    const rec = s.records?.[scoutUid];
    if (rec) {
      const sType = s.eventType || '';
      const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
      const defaultN = sType.includes('Camp') ? 2 : 0;
      const h = rec.hours !== undefined ? Number(rec.hours) : (s.hours !== undefined ? Number(s.hours) : defaultH);
      const n = rec.nights !== undefined ? Number(rec.nights) : (s.nights !== undefined ? Number(s.nights) : defaultN);

      if (rec.status === 'present' || rec.status === 'late') {
        reportAttendedSessionsCount++;
        reportTotalAttendedHours += h;
        reportTotalCampingNights += n;
        if (sType.includes('Tuesday')) reportTotalTuesdayHours += h;
        else if (sType.includes('Weekly') || sType.includes('Friday')) reportTotalFridayHours += h;
      } else if (rec.status === 'excused') {
        reportExcusedCount++;
      } else if (rec.status === 'absent') {
        reportUnexcusedAbsences++;
      }
    }
  });

  const reportTotalSessionsCount = filteredAttendance.length;
  const reportAttendanceRate = reportTotalSessionsCount > 0 ? Math.round((reportAttendedSessionsCount / reportTotalSessionsCount) * 100) : 100;
  const reportRiskLevel = reportUnexcusedAbsences >= 3 ? 'critical' : reportUnexcusedAbsences === 2 ? 'warning' : 'good';

  // ── DATE FILTERING ENGINE ──
  const isDateInWindow = (dateStr) => {
    if (!dateStr) return false;
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isDatePriorToStart = (dateStr) => {
    if (!dateStr) return false;
    return dateStr < startDate;
  };

  // Rank Index & Progressive Ranks
  const rankOrder = ['scout', 'tenderfoot', 'secondclass', 'firstclass', 'star', 'life', 'eagle'];
  let currentRankIndex = rankOrder.indexOf(scoutRank);
  if (currentRankIndex === -1) currentRankIndex = 0;

  const currentRankData = RANKS_DATA[currentRankIndex] || RANKS_DATA[0];
  const pastRanksData = RANKS_DATA.slice(0, currentRankIndex);
  const isLifeOrEagle = scoutRank === 'life' || scoutRank === 'eagle';

  // Current Rank Granular Requirements
  const currentRankDoc = ranksProgress[currentRankData.id] || {};
  const currentRankReqs = currentRankData.categories ? currentRankData.categories.flatMap(c => c.requirements) : (currentRankData.requirements || []);
  
  const currentRankCompletedReqs = currentRankReqs.filter(req => {
    const s = currentRankDoc.completedRequirements?.[req.id] || currentRankDoc.steps?.[req.id];
    const isDone = s === true || s?.completed === true;
    if (!isDone) return false;
    if (reportMode === 'window') {
      const d = s?.completedAt || s?.approvedAt || s?.date || currentRankDoc.completedDate || '';
      return isDateInWindow(d);
    }
    return true;
  });

  const currentRankCompletedCount = currentRankCompletedReqs.length;
  const currentRankTotalCount = currentRankReqs.length || 1;
  const currentRankPercent = Math.round((currentRankCompletedCount / currentRankTotalCount) * 100);

  // Starting Baseline Calculation (Mode: Window)
  const baselineRankCompletedCount = currentRankReqs.filter(req => {
    const s = currentRankDoc.completedRequirements?.[req.id] || currentRankDoc.steps?.[req.id];
    const isDone = s === true || s?.completed === true;
    if (!isDone) return false;
    const d = s?.completedAt || s?.approvedAt || s?.date || currentRankDoc.completedDate || '';
    return isDatePriorToStart(d);
  }).length;
  const baselinePercent = Math.round((baselineRankCompletedCount / currentRankTotalCount) * 100);

  // ── MERIT BADGES PORTFOLIO & ROADMAP MATRIX ──
  const earnedBadges = [];
  const inProgressBadges = [];
  const plannedBadges = [];

  MERIT_BADGES.forEach(badge => {
    const mp = meritProgress[badge.id] || {};
    const totalReqs = badge.requirements ? badge.requirements.length : 1;
    const completedReqCount = badge.requirements ? badge.requirements.filter(r => {
      const s = mp.steps?.[r.id] || mp.completedSteps?.[r.id];
      return s === true || s?.completed === true || s === 'approved' || s?.approved === true;
    }).length : 0;

    const isEarned = mp.completed === true || (totalReqs > 0 && completedReqCount === totalReqs);

    if (isEarned) {
      const earnedDate = mp.dateCompleted || mp.completedDate || mp.updatedAt?.split('T')[0] || '';
      if (reportMode === 'cumulative' || isDateInWindow(earnedDate)) {
        earnedBadges.push({ ...badge, completedDate: earnedDate, counselorName: mp.counselorName || 'Troop Counselor' });
      }
    } else if (completedReqCount > 0) {
      inProgressBadges.push({
        ...badge,
        completedCount: completedReqCount,
        totalCount: totalReqs,
        percent: Math.round((completedReqCount / totalReqs) * 100)
      });
    } else if (mp.planned) {
      plannedBadges.push(badge);
    }
  });

  const eagleRequiredEarned = earnedBadges.filter(b => b.eagleRequired);
  const electiveEarned = earnedBadges.filter(b => !b.eagleRequired);

  // 14 Eagle-Required Checklist
  const eagleRequiredChecklist = MERIT_BADGES.filter(b => b.eagleRequired).map(b => {
    const isEarned = earnedBadges.some(eb => eb.id === b.id);
    const isInProg = inProgressBadges.some(ip => ip.id === b.id);
    const isPlan = plannedBadges.some(pb => pb.id === b.id);
    let status = 'Not Started';
    if (isEarned) status = 'Earned ✓';
    else if (isInProg) status = 'In Progress';
    else if (isPlan) status = 'Planned';
    return { ...b, status };
  });

  // ── SERVICE HOURS LOG ──
  const filteredServiceLogs = serviceLogs.filter(l => {
    if (reportMode === 'window') return isDateInWindow(l.date);
    return true;
  });
  const totalWindowServiceHours = filteredServiceLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  const conservationHours = filteredServiceLogs.filter(l => l.conservation || (l.category || '').toLowerCase().includes('conservation')).reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  // Baseline Service Hours prior to window
  const baselineServiceHours = serviceLogs.filter(l => isDatePriorToStart(l.date)).reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  // ── HOMEWORK & EDUCATIONAL ASSIGNMENTS (STRICT LIFECYCLE) ──
  const filteredHomework = assignmentsList.filter(a => {
    if (a.assignedTarget === 'patrol' && (profileData?.groupId || scout?.groupId) && a.targetGroupId !== (profileData?.groupId || scout?.groupId)) return false;
    if (a.assignedTarget === 'scout' && a.targetScoutUid !== scoutUid) return false;
    return true;
  }).map(a => {
    const hwKey = `${a.id}_${scoutUid}`;
    const rec = scoutHomeworkMap[hwKey] || scoutSubmissions[a.id] || {};
    const isComp = !!(rec.isCompleted || rec.status === 'completed' || rec.verifiedByLeader || (rec.completed && !rec.pending));
    const isSub = rec.status === 'submitted' || (!!rec.submittedAt && !isComp);

    let statusLabel = 'Incomplete';
    let statusClass = 'text-slate-600 bg-slate-100';
    let completionDate = '—';
    let leaderSignOff = '—';

    if (isComp) {
      statusLabel = 'Completed';
      statusClass = 'text-emerald-900 bg-emerald-100 font-bold';
      completionDate = rec.completedDate || (rec.completedAt ? rec.completedAt.split('T')[0] : (rec.submittedDate || 'Verified'));
      leaderSignOff = rec.leaderName || rec.verifiedByName || (rec.verifiedByLeader ? '✓ Signed by Leader' : 'Verified');
    } else if (isSub) {
      statusLabel = 'Submitted';
      statusClass = 'text-blue-900 bg-blue-100 font-bold';
      completionDate = 'Awaiting Review';
      leaderSignOff = 'Pending Review';
    } else if (a.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(a.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due < today) {
        statusLabel = 'Overdue / Incomplete';
        statusClass = 'text-red-900 bg-red-100 font-bold';
      }
    }

    return {
      id: a.id,
      title: a.title,
      category: a.category || (a.isIslamic ? 'Islamic Knowledge' : 'Scouting Skills'),
      dueDate: a.dueDate || 'Ongoing',
      status: statusLabel,
      statusClass,
      completionDate,
      leaderSignOff,
      dateForFilter: completionDate !== '—' && completionDate !== 'Awaiting Review' ? completionDate : a.dueDate
    };
  }).filter(h => {
    if (reportMode === 'window') {
      return isDateInWindow(h.dateForFilter);
    }
    return true;
  });

  // ── TALI'A PATROL ACTIVITIES & ATTENDANCE ──
  const filteredEvents = eventsList.filter(ev => {
    if (reportMode === 'window') return isDateInWindow(ev.date);
    return true;
  });
  const campoutNights = filteredEvents.filter(ev => (ev.type || '').toLowerCase().includes('camp') || (ev.title || '').toLowerCase().includes('camp')).length;
  const outdoorActivities = filteredEvents.filter(ev => (ev.type || '').toLowerCase().includes('hike') || (ev.type || '').toLowerCase().includes('outdoor') || (ev.location || '').toLowerCase().includes('park')).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16 text-slate-900">
      {/* ── 1. SCREEN CONFIGURATION TOOLBAR & DATE FILTER ENGINE ── */}
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
                <span>Scout Advancement & Progress Plan Report</span>
              </h2>
              <p className="text-xs text-slate-400">
                Official Document for <strong className="text-amber-300">{scoutFullName}</strong> ({currentRankData.name})
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

        {/* Mode Toggle & Date Filter Controls */}
        <div className="pt-3 border-t border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Filter size={13} /> Report Scope:
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setReportMode('cumulative')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  reportMode === 'cumulative'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <Layers size={13} />
                <span>All-Time Cumulative Progress Plan</span>
              </button>

              <button
                type="button"
                onClick={() => setReportMode('window')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  reportMode === 'window'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <CalendarRange size={13} />
                <span>Activity Period Window</span>
              </button>
            </div>
          </div>

          {/* Date Range Inputs */}
          {reportMode === 'window' && (
            <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-xl border border-amber-500/40 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <label className="text-slate-400 text-[11px]">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-slate-400 text-[11px]">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Leader Notes Editor (Screen Only) */}
        {isLeaderOrOwner && (
          <div className="pt-3 border-t border-slate-750/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                <FileText size={13} /> Edit Parent Conference Notes & Commentary
              </span>
              <button
                type="button"
                onClick={handleSaveLeaderNotes}
                disabled={savingNotes}
                className="bg-slate-700 hover:bg-slate-650 text-emerald-400 hover:text-white text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Check size={13} /> {notesSaveMsg || (savingNotes ? 'Saving…' : 'Save Notes')}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Key Strengths & Achievements..."
                value={strengthsText}
                onChange={(e) => setStrengthsText(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Areas of Focus for Upcoming Month..."
                value={focusAreasText}
                onChange={(e) => setFocusAreasText(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
              <input
                type="text"
                placeholder="Parent Action Items & Support..."
                value={parentActionItems}
                onChange={(e) => setParentActionItems(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* ──────────────── PRINTABLE DOCUMENT CONTAINER ──────────────── */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl space-y-8 border border-slate-300 text-slate-900 print:p-0 print:border-none print:shadow-none print:m-0 print:rounded-none">
        
        {/* ── 1. OFFICIAL HEADER SECTION ── */}
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
                Scout Advancement & Progress Plan Report
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-700 font-mono space-y-0.5">
            <p><strong>Generation Date:</strong> {generationDate}</p>
            <p><strong>Taliʿa:</strong> {formattedTaliaName}</p>
            <p><strong>Reporting Period:</strong> {reportMode === 'cumulative' ? 'All-Time Cumulative' : `${startDate} to ${endDate}`}</p>
          </div>
        </div>

        {/* ── 2. SCOUT DEMOGRAPHICS & ATTENDANCE STANDING ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-100/70 p-4 rounded-xl border border-slate-300 text-xs">
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Scout Name</span>
            <strong className="text-sm text-slate-950 font-black">{scoutFullName}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Current Rank</span>
            <strong className="text-sm text-emerald-850 font-black uppercase">{currentRankData.name}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Taliʿa</span>
            <strong className="text-xs text-slate-900 font-bold">{formattedTaliaName}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">BSA Member ID</span>
            <strong className="text-xs text-slate-900 font-mono">{scoutBsaId}</strong>
          </div>
          <div>
            <span className="text-slate-600 uppercase text-[10px] font-bold block">Attendance Standing</span>
            <strong className={`text-xs font-mono font-bold block mt-0.5 ${
              reportRiskLevel === 'critical' ? 'text-red-700' : reportRiskLevel === 'warning' ? 'text-amber-700' : 'text-emerald-800'
            }`}>
              {Math.round(reportTotalAttendedHours * 10) / 10}h &bull; {reportTotalCampingNights}n ({reportAttendanceRate}%)
            </strong>
          </div>
        </div>

        {/* Official Attendance Standing & Risk Warning Notice Box */}
        <div className={`border-2 p-4 rounded-xl page-break-avoid ${
          reportRiskLevel === 'critical'
            ? 'border-red-600 bg-red-50 text-red-950'
            : reportRiskLevel === 'warning'
            ? 'border-amber-600 bg-amber-50 text-amber-950'
            : 'border-emerald-700 bg-emerald-50 text-emerald-950'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1.5 border-b border-black/10 pb-1">
            <strong className="text-xs uppercase font-black tracking-wide flex items-center gap-1.5">
              <span>
                {reportRiskLevel === 'critical'
                  ? '🚨 OFFICIAL RETENTION NOTICE: CRITICAL ATTENDANCE RISK'
                  : reportRiskLevel === 'warning'
                  ? '⚠️ ATTENDANCE WARNING NOTICE: AT RISK'
                  : '🟢 ATTENDANCE CERTIFICATION: IN GOOD STANDING'}
              </span>
            </strong>
            <span className="font-mono text-xs font-bold">
              {reportAttendedSessionsCount}/{reportTotalSessionsCount} Sessions ({reportAttendanceRate}%) &bull; {reportUnexcusedAbsences} Unexcused Absences
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            {reportRiskLevel === 'critical'
              ? `Scout has accumulated ${reportUnexcusedAbsences} unexcused absences (${reportAttendanceRate}% overall attendance rate). A mandatory parent-leader retention conference is required prior to rank advancement or board of review qualification.`
              : reportRiskLevel === 'warning'
              ? `Scout has 2 unexcused absences (${reportAttendanceRate}% overall attendance rate). Regular attendance at weekly troop meetings and patrol activities is required to maintain rank advancement eligibility.`
              : `Scout is certified in good standing with ${reportAttendanceRate}% overall attendance rate, ${Math.round(reportTotalAttendedHours * 10) / 10} attended hours, and ${reportTotalCampingNights} camping nights across troop meetings, Tuesday workshops, and outdoor events.`}
          </p>
        </div>

        {/* Date Window Historical Baseline Banner (If Mode: Window) */}
        {reportMode === 'window' && (
          <div className="bg-amber-50/80 border border-amber-300 p-4 rounded-xl text-xs space-y-2 page-break-avoid">
            <div className="flex justify-between items-center border-b border-amber-200 pb-1.5">
              <strong className="text-amber-950 font-black flex items-center gap-1.5">
                <History size={14} className="text-amber-800" />
                <span>Historical Baseline & Activity Window Dynamics</span>
              </strong>
              <span className="font-mono text-[11px] text-amber-900 font-bold">Window: {startDate} ➔ {endDate}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-amber-800 block text-[10px] uppercase font-bold">Starting Baseline ({startDate})</span>
                <p className="font-semibold text-slate-900">
                  {currentRankData.name} ({baselinePercent}%) &bull; {baselineServiceHours} Service Hrs
                </p>
              </div>
              <div>
                <span className="text-amber-800 block text-[10px] uppercase font-bold">Activity Logged in Window</span>
                <p className="font-semibold text-emerald-850">
                  +{currentRankCompletedCount - baselineRankCompletedCount} Req Signed &bull; +{totalWindowServiceHours} Service Hrs &bull; +{earnedBadges.length} Badges
                </p>
              </div>
              <div>
                <span className="text-amber-800 block text-[10px] uppercase font-bold">Ending Snapshot ({endDate})</span>
                <p className="font-semibold text-slate-900">
                  {currentRankData.name} ({currentRankPercent}%) &bull; {baselineServiceHours + totalWindowServiceHours} Total Hrs
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. PROGRESSIVE RANK PROGRESS & ACTION PLAN ── */}
        <div className="space-y-4 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950">
              Rank Advancement & Action Plan
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700">
              Active: {currentRankData.name} Rank
            </span>
          </div>

          {/* Past Completed Ranks Summary Banner */}
          {pastRanksData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pastRanksData.map(pr => {
                const prDoc = ranksProgress[pr.id] || {};
                const signDate = prDoc.completedDate || prDoc.testingCompletedAt || 'Signed Off';
                return (
                  <span
                    key={pr.id}
                    className="text-xs bg-slate-100 border border-slate-300 text-slate-850 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span><strong>{pr.name} Rank:</strong> Completed on {signDate}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Current Active Rank Detailed Granular Breakdown */}
          <div className="border-2 border-slate-800 rounded-xl p-4.5 space-y-3 bg-white">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-950">
                  Current Rank: {currentRankData.name} Checklist
                </h4>
                <p className="text-[11px] text-slate-600">
                  {currentRankCompletedCount} of {currentRankTotalCount} requirements completed ({currentRankPercent}%)
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black font-mono text-emerald-800">{currentRankPercent}%</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
              <div
                className="bg-slate-900 h-full rounded-full"
                style={{ width: `${currentRankPercent}%` }}
              />
            </div>

            {/* Granular Requirements Table */}
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
                <tr>
                  <th className="p-2 w-16 text-center">Status</th>
                  <th className="p-2 w-14">Req #</th>
                  <th className="p-2">Requirement Description & Scout Notes</th>
                  <th className="p-2 w-28 text-right">Sign-Off Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentRankReqs.map(req => {
                  const s = currentRankDoc.completedRequirements?.[req.id] || currentRankDoc.steps?.[req.id];
                  const isDone = s === true || s?.completed === true;
                  const dateStr = s?.completedAt || s?.approvedAt || s?.date || currentRankDoc.completedDate || '';
                  const notes = s?.notes || '';
                  return (
                    <tr key={req.id} className={isDone ? 'bg-emerald-50/40' : ''}>
                      <td className="p-2 text-center font-bold">
                        {isDone ? (
                          <span className="text-emerald-800 font-bold">✓ Done</span>
                        ) : (
                          <span className="text-slate-400">Needed</span>
                        )}
                      </td>
                      <td className="p-2 font-bold font-mono text-slate-800">{req.id}</td>
                      <td className="p-2 text-slate-850">
                        <span>{req.text}</span>
                        {notes && (
                          <span className="block text-[10px] text-slate-600 italic mt-0.5 font-serif">
                            Scout reflection: "{notes}"
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono text-slate-700">
                        {isDone ? (dateStr || 'Verified') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Eagle Rank Focus (If Scout is Life or Eagle) */}
          {isLifeOrEagle && (
            <div className="border-2 border-amber-800 rounded-xl p-4.5 space-y-3 bg-amber-50/30 page-break-avoid">
              <div className="border-b border-amber-300 pb-2 flex justify-between items-center">
                <strong className="text-sm font-black uppercase text-amber-950 flex items-center gap-1.5">
                  <span>🦅 Road to Eagle Capstone Module</span>
                </strong>
                <span className="text-xs font-mono text-amber-900 font-bold">Mandatory BSA Standards</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="border border-amber-200 p-2.5 rounded-lg bg-white">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Active Life Tenure</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {eagleData.joinedTroopDate ? `Started: ${eagleData.joinedTroopDate}` : '6 Months Active Service Required'}
                  </p>
                </div>

                <div className="border border-amber-200 p-2.5 rounded-lg bg-white">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Position of Responsibility</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {scoutInfo.leadershipPosition || 'Patrol Leader / Senior Patrol'} (6 Months)
                  </p>
                </div>

                <div className="border border-amber-200 p-2.5 rounded-lg bg-white">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Eagle Service Project</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {eagleRoadmap.phase1?.projectTitle || 'Eagle Project Proposed'} ({eagleRoadmap.phase5?.completed ? '✓ Final Report Signed' : 'In Planning/Execution'})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. MERIT BADGE PORTFOLIO & EAGLE ROADMAP MATRIX ── */}
        <div className="space-y-4 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950">
              Merit Badge Portfolio & Eagle 21-Badge Pathway
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700">
              {earnedBadges.length} Earned &bull; {eagleRequiredEarned.length}/14 Eagle-Required
            </span>
          </div>

          {/* Earned & In-Progress Badges Table */}
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-2">Badge Name</th>
                <th className="p-2 w-32">Type</th>
                <th className="p-2 w-36">Status / Progress</th>
                <th className="p-2 w-36 text-right">Date / Counselor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {earnedBadges.length === 0 && inProgressBadges.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-slate-500 italic">No earned or in-progress merit badges recorded in this timeframe.</td>
                </tr>
              ) : (
                <>
                  {earnedBadges.map(b => (
                    <tr key={b.id} className="bg-emerald-50/20">
                      <td className="p-2 font-bold text-slate-950">{b.name}</td>
                      <td className="p-2">
                        {b.eagleRequired ? (
                          <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">★ Eagle-Required</span>
                        ) : (
                          <span className="text-slate-600">Elective</span>
                        )}
                      </td>
                      <td className="p-2 text-emerald-800 font-bold">✓ Fully Earned</td>
                      <td className="p-2 text-right font-mono text-slate-700">{b.completedDate || 'Verified'} ({b.counselorName})</td>
                    </tr>
                  ))}
                  {inProgressBadges.map(b => (
                    <tr key={b.id} className="bg-amber-50/20">
                      <td className="p-2 font-bold text-slate-950">{b.name}</td>
                      <td className="p-2">
                        {b.eagleRequired ? (
                          <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">★ Eagle-Required</span>
                        ) : (
                          <span className="text-slate-600">Elective</span>
                        )}
                      </td>
                      <td className="p-2 text-amber-900 font-bold">In Progress ({b.completedCount}/{b.totalCount} - {b.percent}%)</td>
                      <td className="p-2 text-right text-slate-600 italic">Active Work</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          {/* 14 Eagle-Required Pathway Checklist */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-600 block mb-2">
              Official 14 Eagle-Required Subject Pathway Matrix:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {eagleRequiredChecklist.map(b => (
                <div key={b.id} className="flex items-center justify-between p-1.5 bg-white border border-slate-200 rounded">
                  <span className="truncate max-w-[120px] font-medium text-slate-800">{b.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    b.status.includes('✓') ? 'bg-emerald-100 text-emerald-900' : b.status === 'In Progress' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. SERVICE HOURS, HOMEWORK & TALI'A PATROL ACTIVITIES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 page-break-avoid">
          {/* Service Hours Log */}
          <div className="space-y-2.5">
            <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
              <h4 className="text-xs font-black uppercase text-slate-950">
                Community Service & Volunteering ({totalWindowServiceHours} Hrs)
              </h4>
              <span className="text-[10px] font-mono text-slate-600">{conservationHours} Conservation Hrs</span>
            </div>

            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[9px] text-slate-700">
                <tr>
                  <th className="p-1.5">Date</th>
                  <th className="p-1.5">Project / Org</th>
                  <th className="p-1.5">Conservation</th>
                  <th className="p-1.5 text-right">Hrs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredServiceLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-2 text-center text-slate-500 italic text-[11px]">No service hours logged in this period.</td>
                  </tr>
                ) : (
                  filteredServiceLogs.slice(0, 5).map(l => (
                    <tr key={l.id}>
                      <td className="p-1.5 font-mono text-slate-700">{l.date}</td>
                      <td className="p-1.5 font-bold text-slate-900 truncate max-w-[120px]">{l.description || l.title || 'Service'}</td>
                      <td className="p-1.5 text-slate-600">{l.conservation ? 'Yes' : 'No'}</td>
                      <td className="p-1.5 text-right font-bold text-slate-950">{l.hours}h</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Educational Homework & Assignments */}
          <div className="space-y-2.5">
            <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
              <h4 className="text-xs font-black uppercase text-slate-950">
                Homework & Educational Assignments
              </h4>
              <span className="text-[10px] font-mono text-slate-600">{filteredHomework.length} Tasks</span>
            </div>

            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[9px] text-slate-700">
                <tr>
                  <th className="p-1.5">Assignment Name</th>
                  <th className="p-1.5 w-20">Due Date</th>
                  <th className="p-1.5 w-28 text-center">Status</th>
                  <th className="p-1.5 w-24 text-center">Completion Date</th>
                  <th className="p-1.5 text-right w-28">Leader Sign-off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredHomework.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-2 text-center text-slate-500 italic text-[11px]">No assignments logged in this period.</td>
                  </tr>
                ) : (
                  filteredHomework.map(h => (
                    <tr key={h.id}>
                      <td className="p-1.5 font-bold text-slate-900 truncate max-w-[120px]">
                        <span>{h.title}</span>
                        <span className="block text-[8px] text-slate-500 font-normal">{h.category}</span>
                      </td>
                      <td className="p-1.5 font-mono text-slate-700 text-[10px]">{h.dueDate}</td>
                      <td className="p-1.5 text-center">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded ${h.statusClass}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="p-1.5 text-center font-mono text-[10px] text-slate-700">{h.completionDate}</td>
                      <td className="p-1.5 text-right font-bold text-slate-900 text-[10px]">{h.leaderSignOff}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tali'a Patrol Activities & Attendance */}
        <div className="space-y-2.5 page-break-avoid">
          <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
            <h4 className="text-xs font-black uppercase text-slate-950">
              Taliʿa Patrol Activities & Attendance ({Math.round(reportTotalAttendedHours * 10) / 10} Attended Hours)
            </h4>
            <span className="text-[11px] font-mono text-slate-700 font-bold">
              {reportTotalCampingNights} Camping Nights &bull; {reportAttendedSessionsCount}/{reportTotalSessionsCount} Sessions ({reportAttendanceRate}%)
            </span>
          </div>

          {/* Quick Hours Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-300 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Attended</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{Math.round(reportTotalAttendedHours * 10) / 10}h</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Camping Nights</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{reportTotalCampingNights} Nights</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Tuesday Program</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{Math.round(reportTotalTuesdayHours * 10) / 10}h</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Friday Meetings</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{Math.round(reportTotalFridayHours * 10) / 10}h</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Unexcused Absences</span>
              <strong className={`text-sm font-black font-mono ${reportUnexcusedAbsences >= 3 ? 'text-red-700' : reportUnexcusedAbsences === 2 ? 'text-amber-700' : 'text-emerald-800'}`}>
                {reportUnexcusedAbsences} Absences
              </strong>
            </div>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[9px] text-slate-700">
              <tr>
                <th className="p-1.5 w-24">Date</th>
                <th className="p-1.5">Program / Session</th>
                <th className="p-1.5 w-16 text-center">Hours</th>
                <th className="p-1.5 w-16 text-center">Nights</th>
                <th className="p-1.5 w-24 text-center">Status</th>
                <th className="p-1.5">Notes / Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2 text-center text-slate-500 italic text-[11px]">No attendance sessions logged in this timeframe.</td>
                </tr>
              ) : (
                filteredAttendance.map(s => {
                  const rec = s.records?.[scoutUid] || { status: 'present' };
                  const isAttended = rec.status === 'present' || rec.status === 'late';
                  const sType = s.eventType || '';
                  const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
                  const defaultN = sType.includes('Camp') ? 2 : 0;
                  const h = isAttended ? (rec.hours !== undefined ? Number(rec.hours) : (s.hours !== undefined ? Number(s.hours) : defaultH)) : 0;
                  const n = isAttended ? (rec.nights !== undefined ? Number(rec.nights) : (s.nights !== undefined ? Number(s.nights) : defaultN)) : 0;

                  return (
                    <tr key={s.id}>
                      <td className="p-1.5 font-mono text-slate-700">{s.date}</td>
                      <td className="p-1.5 font-bold text-slate-900">{s.eventType}</td>
                      <td className="p-1.5 text-center font-mono font-bold">{h}h</td>
                      <td className="p-1.5 text-center font-mono">{n}n</td>
                      <td className="p-1.5 text-center font-bold text-[10px]">
                        {rec.status === 'present' ? (
                          <span className="text-emerald-800">✓ Present</span>
                        ) : rec.status === 'late' ? (
                          <span className="text-amber-800">⏱️ Late</span>
                        ) : rec.status === 'excused' ? (
                          <span className="text-sky-800">✉️ Excused</span>
                        ) : (
                          <span className="text-red-700">✗ Absent</span>
                        )}
                      </td>
                      <td className="p-1.5 text-slate-700">{rec.note || s.notes || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 6. LEADER NOTES & PARENT CONFERENCE SECTION ── */}
        <div className="border-t-2 border-slate-800 pt-4 space-y-3 page-break-avoid">
          <h3 className="text-sm font-black uppercase text-slate-950 flex items-center gap-2">
            <Lock size={15} className="text-slate-700" />
            <span>Leader Commentary & Parent Conference Action Plan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
              <strong className="text-emerald-900 block font-bold uppercase text-[10px]">1. Strengths & Achievements</strong>
              <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {strengthsText || 'Scout displays exemplary scout spirit, punctuality, and commitment to learning.'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
              <strong className="text-amber-900 block font-bold uppercase text-[10px]">2. Areas of Focus for Upcoming Month</strong>
              <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {focusAreasText || `Complete remaining ${currentRankData.name} rank requirements and finalize active merit badge work.`}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
              <strong className="text-sky-900 block font-bold uppercase text-[10px]">3. Parent Action Items & Support</strong>
              <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {parentActionItems || 'Assist scout with practicing knots/first-aid and ensure attendance at upcoming weekend campout.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── 7. OFFICIAL SIGNATURE & VERIFICATION BLOCK ── */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs page-break-avoid">
          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Scout Candidate Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Unit Leader / Scoutmaster Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Parent / Guardian Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
