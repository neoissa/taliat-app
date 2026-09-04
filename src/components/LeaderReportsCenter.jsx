import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import {
  Printer,
  Sparkles,
  Filter,
  Layers,
  CalendarRange,
  Users,
  User,
  CheckSquare,
  Square,
  Award,
  Star,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  FileText,
  Lock,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Check,
  Shield
} from 'lucide-react';
import RankIcon from './RankIcon';

// Single Scout Report Sub-Component
function SingleScoutCustomReport({
  scout,
  currentUser,
  config,
  groupsMap,
  startDate,
  endDate,
  reportMode,
  generationDate
}) {
  const scoutUid = scout.uid;

  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [serviceLogs, setServiceLogs] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [scoutSubmissions, setScoutSubmissions] = useState({});
  const [scoutHomeworkMap, setScoutHomeworkMap] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [leaderNotes, setLeaderNotes] = useState({});
  const [eagleData, setEagleData] = useState({});
  const [eagleRoadmap, setEagleRoadmap] = useState({});

  useEffect(() => {
    if (!scoutUid) return;
    const unsubRanks = onSnapshot(collection(db, 'user_progress', scoutUid, 'ranks'), (snap) => {
      const m = {};
      snap.docs.forEach(d => { m[d.id] = d.data(); });
      setRanksProgress(m);
    });
    const unsubMerit = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      const m = {};
      snap.docs.forEach(d => { m[d.id] = d.data(); });
      setMeritProgress(m);
    });
    const unsubIslamic = onSnapshot(doc(db, 'user_progress', scoutUid, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) setIslamicProgress(snap.data() || {});
    });
    const unsubService = onSnapshot(collection(db, 'service_logs'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.scoutId === scoutUid || l.userId === scoutUid);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setServiceLogs(list);
    });
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubHw = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const m = {};
      snap.docs.forEach(d => { m[d.id] = d.data(); });
      setScoutHomeworkMap(m);
    });
    const unsubSub = onSnapshot(collection(db, 'user_progress', scoutUid, 'assignments'), (snap) => {
      const m = {};
      snap.docs.forEach(d => { m[d.id] = d.data(); });
      setScoutSubmissions(m);
    });
    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.records && s.records[scoutUid]);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setAttendanceSessions(list);
    });
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setEventsList(list);
    });
    const unsubNotes = onSnapshot(doc(db, 'scout_notes', scoutUid), (snap) => {
      if (snap.exists()) setLeaderNotes(snap.data() || {});
    });
    const unsubEagle = onSnapshot(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'data'), (snap) => {
      if (snap.exists()) setEagleData(snap.data() || {});
    });
    const unsubRoadmap = onSnapshot(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'project_roadmap'), (snap) => {
      if (snap.exists()) setEagleRoadmap(snap.data() || {});
    });

    return () => {
      unsubHw();
      unsubRanks();
      unsubMerit();
      unsubIslamic();
      unsubService();
      unsubAssign();
      unsubSub();
      unsubAttendance();
      unsubEvents();
      unsubNotes();
      unsubEagle();
      unsubRoadmap();
    };
  }, [scoutUid]);

  const isDateInWindow = (dateStr) => {
    if (!dateStr) return false;
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isItemActiveInMode = (dateStr) => {
    if (reportMode === 'window') return isDateInWindow(dateStr);
    return true;
  };

  const scoutFullName = scout.fullName || scout.username || 'Scout Member';
  const scoutRank = (scout.rank || 'Scout').toLowerCase();
  const groupObj = groupsMap[scout.groupId || scout.patrolId] || {};
  const rawPatrol = groupObj.name || scout.patrolName || scout.groupName || 'Al-Huda';
  const formattedTaliaName = (() => {
    const l = String(rawPatrol).toLowerCase().trim();
    if (l.startsWith('taliat') || l.startsWith('talia') || l.startsWith('taliʿa') || l.startsWith('taliʿat') || l.startsWith('tali\'at')) {
      return rawPatrol;
    }
    return `Taliʿat ${rawPatrol}`;
  })();

  const rankOrder = ['scout', 'tenderfoot', 'secondclass', 'firstclass', 'star', 'life', 'eagle'];
  let currentRankIdx = rankOrder.indexOf(scoutRank);
  if (currentRankIdx === -1) currentRankIdx = 0;
  const currentRankData = RANKS_DATA[currentRankIdx] || RANKS_DATA[0];

  // Filter Ranks to Render
  let ranksToRender = [];
  if (config.ranks.enabled) {
    if (config.ranks.scope === 'current') {
      ranksToRender = [currentRankData];
    } else if (config.ranks.scope === 'all') {
      ranksToRender = RANKS_DATA;
    } else if (config.ranks.scope === 'custom') {
      ranksToRender = RANKS_DATA.filter(r => config.ranks.specific.includes(r.id));
    }
  }

  // Filter Badges to Render
  let badgesToRender = [];
  if (config.badges.enabled) {
    badgesToRender = MERIT_BADGES.filter(b => {
      const mp = meritProgress[b.id] || {};
      const totalReqs = b.requirements ? b.requirements.length : 1;
      const completedCount = b.requirements ? b.requirements.filter(r => {
        const s = mp.steps?.[r.id] || mp.completedSteps?.[r.id];
        return s === true || s?.completed === true || s === 'approved' || s?.approved === true;
      }).length : 0;
      const isEarned = mp.completed === true || (totalReqs > 0 && completedCount === totalReqs);
      const isProg = completedCount > 0 && !isEarned;
      const isPlan = !!mp.planned;

      if (config.badges.scope === 'all') return isEarned || isProg;
      if (config.badges.scope === 'eagle_only') return b.eagleRequired && (isEarned || isProg);
      if (config.badges.scope === 'plan_matrix') return b.eagleRequired || isPlan || isEarned;
      if (config.badges.scope === 'custom') return config.badges.specific.includes(b.id);
      return isEarned || isProg;
    });
  }

  // Filter Service Logs
  const filteredService = config.service.enabled ? serviceLogs.filter(l => {
    if (!isItemActiveInMode(l.date)) return false;
    if (config.service.conservationOnly && !(l.conservation || (l.category || '').toLowerCase().includes('conservation'))) {
      return false;
    }
    return true;
  }) : [];
  const totalServiceHours = filteredService.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  // Filter Homework with Strict Lifecycle & Schema
  const filteredHomework = config.homework.enabled && config.homework.includeAssignments ? assignmentsList.filter(a => {
    // Check target applicability
    if (a.assignedTarget === 'patrol' && scout.groupId && a.targetGroupId !== scout.groupId) return false;
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
  }) : [];

  // Filter Islamic Topics
  const completedIslamicTopics = config.homework.enabled && config.homework.includeIslamic ? ISLAMIC_BASICS_TOPICS.filter(t => {
    const p = islamicProgress[t.id] || {};
    if (!p.completed) return false;
    return isItemActiveInMode(p.completedDate || p.dateCompleted || '');
  }) : [];

  // Filter Events & Real Attendance Sessions
  const filteredAttendance = config.activities.enabled ? attendanceSessions.filter(s => {
    if (!isItemActiveInMode(s.date)) return false;
    const type = (s.eventType || '').toLowerCase();
    if (type.includes('camp')) return config.activities.includeCampouts;
    if (type.includes('hike') || type.includes('outdoor')) return config.activities.includeHikes;
    return config.activities.includeMeetings;
  }) : [];

  let reportTotalAttendedHours = 0;
  let reportTotalCampingNights = 0;
  let reportTotalServiceAttendanceHours = 0;
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
        if (sType.includes('Service') || sType.includes('Volunteer')) reportTotalServiceAttendanceHours += h;
        else if (sType.includes('Tuesday')) reportTotalTuesdayHours += h;
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

  const filteredEvents = config.activities.enabled ? eventsList.filter(ev => {
    if (!isItemActiveInMode(ev.date)) return false;
    const type = (ev.type || '').toLowerCase();
    const title = (ev.title || '').toLowerCase();
    if (type.includes('camp') || title.includes('camp')) return config.activities.includeCampouts;
    if (type.includes('hike') || type.includes('outdoor')) return config.activities.includeHikes;
    return config.activities.includeMeetings;
  }) : [];

  return (
    <div className="scout-report-container bg-white p-8 sm:p-10 rounded-2xl shadow-xl space-y-7 border border-slate-300 text-slate-900 print:p-0 print:border-none print:shadow-none print:m-0 print:rounded-none mb-8">
      {/* ── 1. OFFICIAL HEADER ── */}
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
              Scout Advancement & Progress Record
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
          <strong className="text-xs text-slate-900 font-mono">{scout.bsaId || 'BSA-110-' + scoutUid.substring(0, 5).toUpperCase()}</strong>
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

      {/* ── 3. RANK ADVANCEMENT MODULE ── */}
      {config.ranks.enabled && ranksToRender.length > 0 && (
        <div className="space-y-4 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-1.5 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
              <Award size={16} />
              <span>Rank Advancement ({ranksToRender.length} Rank{ranksToRender.length !== 1 ? 's' : ''})</span>
            </h3>
          </div>

          <div className="space-y-4">
            {ranksToRender.map(r => {
              const rp = ranksProgress[r.id] || {};
              const reqs = r.categories ? r.categories.flatMap(c => c.requirements) : (r.requirements || []);
              const completedReqs = reqs.filter(req => {
                const s = rp.completedRequirements?.[req.id] || rp.steps?.[req.id];
                const isDone = s === true || s?.completed === true;
                if (!isDone) return false;
                return isItemActiveInMode(s?.completedAt || s?.approvedAt || s?.date || rp.completedDate || '');
              });
              const pct = reqs.length > 0 ? Math.round((completedReqs.length / reqs.length) * 100) : 0;

              return (
                <div key={r.id} className="border border-slate-300 rounded-xl p-4 space-y-2.5 page-break-avoid">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <strong className="text-sm font-black text-slate-950">{r.name} Rank</strong>
                      <span className="text-xs text-slate-600 ml-2">({completedReqs.length}/{reqs.length} steps &bull; {pct}%)</span>
                    </div>
                    {pct === 100 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-100">
                      {reqs.map(req => {
                        const s = rp.completedRequirements?.[req.id] || rp.steps?.[req.id];
                        const isDone = s === true || s?.completed === true;
                        const signDate = s?.completedAt || s?.approvedAt || s?.date || rp.completedDate || '';
                        return (
                          <tr key={req.id}>
                            <td className="py-1.5 w-12 font-bold font-mono text-slate-700">{req.id}</td>
                            <td className="py-1.5 text-slate-850">{req.text}</td>
                            <td className="py-1.5 w-24 text-right font-mono font-semibold">
                              {isDone ? (
                                <span className="text-emerald-800">✓ {signDate || 'Done'}</span>
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

      {/* ── 4. MERIT BADGES MODULE ── */}
      {config.badges.enabled && badgesToRender.length > 0 && (
        <div className="space-y-3 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-1.5 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
              <Star size={16} />
              <span>Merit Badge Inventory ({badgesToRender.length} Included)</span>
            </h3>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-2">Badge Title</th>
                <th className="p-2 w-32">Classification</th>
                <th className="p-2 w-32">Status</th>
                <th className="p-2 w-36 text-right">Date / Counselor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {badgesToRender.map(b => {
                const mp = meritProgress[b.id] || {};
                const totalReqs = b.requirements ? b.requirements.length : 1;
                const completedCount = b.requirements ? b.requirements.filter(r => {
                  const s = mp.steps?.[r.id] || mp.completedSteps?.[r.id];
                  return s === true || s?.completed === true || s === 'approved' || s?.approved === true;
                }).length : 0;
                const isEarned = mp.completed === true || (totalReqs > 0 && completedCount === totalReqs);

                return (
                  <tr key={b.id} className={isEarned ? 'bg-emerald-50/20' : ''}>
                    <td className="p-2 font-bold text-slate-950">{b.name}</td>
                    <td className="p-2">
                      {b.eagleRequired ? (
                        <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">★ Eagle-Required</span>
                      ) : (
                        <span className="text-slate-600">Elective</span>
                      )}
                    </td>
                    <td className="p-2 font-semibold">
                      {isEarned ? (
                        <span className="text-emerald-800 font-bold">✓ Fully Earned</span>
                      ) : (
                        <span className="text-amber-900">In Progress ({completedCount}/{totalReqs})</span>
                      )}
                    </td>
                    <td className="p-2 text-right font-mono text-slate-700">
                      {mp.dateCompleted || mp.completedDate || 'Verified'} ({mp.counselorName || 'Counselor'})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 5. EAGLE PROJECT & CAPSTONE MODULE ── */}
      {config.eagle.enabled && (
        <div className="space-y-3 page-break-avoid border-2 border-amber-800 rounded-xl p-4.5 bg-amber-50/20">
          <div className="border-b border-amber-300 pb-2 flex justify-between items-center">
            <strong className="text-sm font-black uppercase text-amber-950 flex items-center gap-1.5">
              <span>🦅 Road to Eagle Capstone Portfolio</span>
            </strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {config.eagle.includeTenure && (
              <div className="border border-amber-200 p-2.5 rounded-lg bg-white">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Active Life Tenure</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {eagleData.joinedTroopDate ? `Started: ${eagleData.joinedTroopDate}` : '6 Months Active Service Record'}
                </p>
              </div>
            )}

            {config.eagle.includePhases && (
              <div className="border border-amber-200 p-2.5 rounded-lg bg-white">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Project 5-Phase Status</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {eagleRoadmap.phase1?.projectTitle || 'Eagle Project Proposed'} ({eagleRoadmap.phase5?.completed ? '✓ Final Report Completed' : 'Phase 1–5 Active'})
                </p>
              </div>
            )}

            {config.eagle.includeVolunteerHours && (
              <div className="border border-amber-200 p-2.5 rounded-lg bg-white">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Volunteer Service Hours</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {eagleRoadmap.phase4?.totalVolunteerHours || 0} Hours Logged
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 6. SERVICE HOURS & CONSERVATION ── */}
      {config.service.enabled && (
        <div className="space-y-2.5 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-1.5 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
              <Heart size={16} />
              <span>Service Hours Log ({totalServiceHours} Total Hours)</span>
            </h3>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-2 w-24">Date</th>
                <th className="p-2">Project / Organization</th>
                <th className="p-2 w-28">Conservation</th>
                <th className="p-2 w-20 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredService.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-slate-500 italic">No service logs in this timeframe.</td>
                </tr>
              ) : (
                filteredService.map(l => (
                  <tr key={l.id}>
                    <td className="p-2 font-mono text-slate-700">{l.date}</td>
                    <td className="p-2 font-bold text-slate-950">{l.description || l.title || 'Community Service'}</td>
                    <td className="p-2 text-slate-600">{l.conservation ? 'Yes (Conservation)' : 'No'}</td>
                    <td className="p-2 text-right font-black font-mono text-slate-950">{l.hours}h</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 7. HOMEWORK & ISLAMIC CURRICULUM ── */}
      {config.homework.enabled && (
        <div className="space-y-4 page-break-avoid">
          {config.homework.includeAssignments && (
            <div className="space-y-2">
              <div className="border-b-2 border-slate-800 pb-1 flex justify-between items-center">
                <h4 className="text-sm font-black uppercase text-slate-950 flex items-center gap-1.5">
                  <FileText size={15} />
                  <span>Homework & Assignments ({filteredHomework.length} Total Records)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-600">Strict Status Lifecycle Tracking</span>
              </div>

              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[9px] text-slate-700">
                  <tr>
                    <th className="p-2">Assignment Name</th>
                    <th className="p-2 w-24">Due Date</th>
                    <th className="p-2 w-32 text-center">Status</th>
                    <th className="p-2 w-28 text-center">Completion Date</th>
                    <th className="p-2 w-32 text-right">Leader Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredHomework.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-slate-500 italic text-[11px]">
                        No homework assignments recorded for this reporting period.
                      </td>
                    </tr>
                  ) : (
                    filteredHomework.map(h => (
                      <tr key={h.id}>
                        <td className="p-2 font-bold text-slate-950">
                          <span>{h.title}</span>
                          <span className="block text-[9px] text-slate-500 font-normal">{h.category}</span>
                        </td>
                        <td className="p-2 font-mono text-slate-700">{h.dueDate}</td>
                        <td className="p-2 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded ${h.statusClass}`}>
                            {h.status}
                          </span>
                        </td>
                        <td className="p-2 text-center font-mono text-slate-700">{h.completionDate}</td>
                        <td className="p-2 text-right font-semibold text-slate-900">{h.leaderSignOff}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {config.homework.includeIslamic && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black uppercase text-slate-950 border-b border-slate-300 pb-1">
                Islamic Basics & Curriculum Testing ({completedIslamicTopics.length} Passed)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {completedIslamicTopics.length === 0 ? (
                  <p className="text-slate-500 italic text-[11px] p-2 col-span-full">No Islamic tests recorded in this window.</p>
                ) : (
                  completedIslamicTopics.map(t => (
                    <div key={t.id} className="flex justify-between items-center p-2 rounded bg-emerald-50/50 border border-emerald-200">
                      <span className="font-semibold text-slate-900 truncate max-w-[160px]">{t.title}</span>
                      <span className="font-mono text-[10px] text-emerald-800 font-bold">✓ Tested</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 8. PATROL ACTIVITIES & ATTENDANCE ── */}
      {config.activities.enabled && (
        <div className="space-y-2.5 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-1.5 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950 flex items-center gap-2">
              <Compass size={16} />
              <span>Taliʿa Patrol Activities & Attendance ({Math.round(reportTotalAttendedHours * 10) / 10} Total Attended Hours)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700">
              {reportTotalCampingNights} Camping Nights &bull; {reportAttendedSessionsCount}/{filteredAttendance.length} Sessions Attended
            </span>
          </div>

          {/* Quick Hours Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-300 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Attended</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{Math.round(reportTotalAttendedHours * 10) / 10} Hours</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Camping Nights</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{reportTotalCampingNights} Nights</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Tuesday Program</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{Math.round(reportTotalTuesdayHours * 10) / 10} Hours</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Friday Meetings</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{Math.round(reportTotalFridayHours * 10) / 10} Hours</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Unexcused Absences</span>
              <strong className={`text-sm font-black font-mono ${reportUnexcusedAbsences >= 3 ? 'text-red-700' : reportUnexcusedAbsences === 2 ? 'text-amber-700' : 'text-emerald-800'}`}>
                {reportUnexcusedAbsences} Absences
              </strong>
            </div>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-2 w-24">Date</th>
                <th className="p-2">Program / Session</th>
                <th className="p-2 w-20 text-center">Hours</th>
                <th className="p-2 w-16 text-center">Nights</th>
                <th className="p-2 w-28 text-center">Status</th>
                <th className="p-2">Notes / Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAttendance.length === 0 && filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-slate-500 italic">No attendance or activity logs recorded in this period.</td>
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
                      <td className="p-2 font-mono text-slate-700">{s.date}</td>
                      <td className="p-2 font-bold text-slate-950">{s.eventType}</td>
                      <td className="p-2 text-center font-mono font-bold">{h}h</td>
                      <td className="p-2 text-center font-mono">{n}n</td>
                      <td className="p-2 text-center uppercase font-bold text-[10px]">
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
                      <td className="p-2 text-slate-700">{rec.note || s.notes || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 9. LEADER COMMENTARY & PARENT NOTES ── */}
      {config.notes.enabled && (
        <div className="border-t-2 border-slate-800 pt-4 space-y-3 page-break-avoid">
          <h3 className="text-sm font-black uppercase text-slate-950 flex items-center gap-2">
            <Lock size={15} className="text-slate-700" />
            <span>Leader Commentary & Conference Action Plan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
              <strong className="text-emerald-900 block font-bold uppercase text-[10px]">1. Strengths & Achievements</strong>
              <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {leaderNotes.strengths || leaderNotes.notes || 'Scout demonstrates strong patrol leadership, dedication, and punctuality.'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
              <strong className="text-amber-900 block font-bold uppercase text-[10px]">2. Areas of Focus</strong>
              <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {leaderNotes.focusAreas || `Complete remaining ${currentRankData.name} rank steps and active merit badge worksheets.`}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
              <strong className="text-sky-900 block font-bold uppercase text-[10px]">3. Parent Action Items</strong>
              <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {leaderNotes.parentActionItems || 'Assist scout with weekly requirements review and outdoor gear readiness.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. SIGNATURE BLOCK ── */}
      {config.signatures.enabled && (
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs page-break-avoid">
          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Scout Candidate Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Unit Leader Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-900 h-10"></div>
            <p className="font-bold text-slate-950">Parent / Guardian Signature</p>
            <p className="text-[10px] text-slate-600">Date: ________________________</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN LEADER REPORTS CENTER CONTROLLER COMPONENT ──
export default function LeaderReportsCenter({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster';

  // Scouts & Groups Data
  const [scoutsList, setScoutsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [groupsMap, setGroupsMap] = useState({});

  // Target Selection: 'single' vs 'batch'
  const [targetType, setTargetType] = useState('single');
  const [selectedScoutId, setSelectedScoutId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('all');

  // Reporting Period
  const [reportMode, setReportMode] = useState('cumulative'); // 'cumulative' | 'window'
  const defaultStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEndDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Modular Item Filter Config Object
  const [config, setConfig] = useState({
    ranks: {
      enabled: true,
      scope: 'current', // 'current' | 'all' | 'custom'
      specific: ['scout', 'tenderfoot', 'secondclass', 'firstclass']
    },
    badges: {
      enabled: true,
      scope: 'all', // 'all' | 'eagle_only' | 'plan_matrix' | 'custom'
      specific: []
    },
    eagle: {
      enabled: true,
      includeTenure: true,
      includePhases: true,
      includeVolunteerHours: true,
      includeReferences: true,
      includePalms: true
    },
    service: {
      enabled: true,
      conservationOnly: false
    },
    homework: {
      enabled: true,
      includeAssignments: true,
      includeIslamic: true
    },
    activities: {
      enabled: true,
      includeMeetings: true,
      includeCampouts: true,
      includeHikes: true
    },
    notes: {
      enabled: true
    },
    signatures: {
      enabled: true
    }
  });

  // Fetch Scouts & Groups
  useEffect(() => {
    const qScouts = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsubScouts = onSnapshot(qScouts, (snap) => {
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setScoutsList(list);
      if (list.length > 0 && !selectedScoutId) {
        setSelectedScoutId(list[0].uid);
      }
    });

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      const gList = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived);
      setGroupsList(gList);
      const gm = {};
      gList.forEach(g => { gm[g.id] = g; });
      setGroupsMap(gm);
    });

    return () => {
      unsubScouts();
      unsubGroups();
    };
  }, []);

  // 1-Click Preset Quick-Configs
  const applyPreset = (presetType) => {
    if (presetType === 'parent_conference') {
      setConfig({
        ranks: { enabled: true, scope: 'current', specific: [] },
        badges: { enabled: true, scope: 'all', specific: [] },
        eagle: { enabled: false, includeTenure: false, includePhases: false, includeVolunteerHours: false, includeReferences: false, includePalms: false },
        service: { enabled: true, conservationOnly: false },
        homework: { enabled: true, includeAssignments: true, includeIslamic: true },
        activities: { enabled: true, includeMeetings: true, includeCampouts: true, includeHikes: true },
        notes: { enabled: true },
        signatures: { enabled: true }
      });
    } else if (presetType === 'court_of_honor') {
      setConfig({
        ranks: { enabled: true, scope: 'all', specific: [] },
        badges: { enabled: true, scope: 'all', specific: [] },
        eagle: { enabled: true, includeTenure: true, includePhases: true, includeVolunteerHours: true, includeReferences: true, includePalms: true },
        service: { enabled: true, conservationOnly: false },
        homework: { enabled: false, includeAssignments: false, includeIslamic: false },
        activities: { enabled: false, includeMeetings: false, includeCampouts: false, includeHikes: false },
        notes: { enabled: false },
        signatures: { enabled: true }
      });
    } else if (presetType === 'eagle_review') {
      setConfig({
        ranks: { enabled: true, scope: 'custom', specific: ['star', 'life', 'eagle'] },
        badges: { enabled: true, scope: 'plan_matrix', specific: [] },
        eagle: { enabled: true, includeTenure: true, includePhases: true, includeVolunteerHours: true, includeReferences: true, includePalms: true },
        service: { enabled: true, conservationOnly: false },
        homework: { enabled: false, includeAssignments: false, includeIslamic: false },
        activities: { enabled: true, includeMeetings: true, includeCampouts: true, includeHikes: true },
        notes: { enabled: true },
        signatures: { enabled: true }
      });
    } else if (presetType === 'attendance_transcript') {
      setConfig({
        ranks: { enabled: false, scope: 'current', specific: [] },
        badges: { enabled: false, scope: 'all', specific: [] },
        eagle: { enabled: false, includeTenure: false, includePhases: false, includeVolunteerHours: false, includeReferences: false, includePalms: false },
        service: { enabled: true, conservationOnly: false },
        homework: { enabled: false, includeAssignments: false, includeIslamic: false },
        activities: { enabled: true, includeMeetings: true, includeCampouts: true, includeHikes: true },
        notes: { enabled: true },
        signatures: { enabled: true }
      });
    } else if (presetType === 'master_record') {
      setConfig({
        ranks: { enabled: true, scope: 'all', specific: [] },
        badges: { enabled: true, scope: 'all', specific: [] },
        eagle: { enabled: true, includeTenure: true, includePhases: true, includeVolunteerHours: true, includeReferences: true, includePalms: true },
        service: { enabled: true, conservationOnly: false },
        homework: { enabled: true, includeAssignments: true, includeIslamic: true },
        activities: { enabled: true, includeMeetings: true, includeCampouts: true, includeHikes: true },
        notes: { enabled: true },
        signatures: { enabled: true }
      });
    }
  };

  // Compile Target Scouts
  let targetScouts = [];
  if (targetType === 'single') {
    const single = scoutsList.find(s => s.uid === selectedScoutId);
    if (single) targetScouts = [single];
  } else {
    if (selectedGroupId === 'all') {
      targetScouts = scoutsList;
    } else {
      targetScouts = scoutsList.filter(s => s.groupId === selectedGroupId || s.patrolId === selectedGroupId);
    }
  }

  const generationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* ── SCREEN CONTROL PANEL (HIDDEN IN PRINT) ── */}
      <div className="bg-slate-850 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 print-hide">
        {/* Header Title & Print Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-750 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Leader Command Center
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Custom Item Builder & Report Compiler
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>📈 Reports & Analytics Center</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-emerald-950/60 hover:scale-[1.02] shrink-0"
          >
            <Printer size={16} />
            <span>Print Compiled Report ({targetScouts.length} Scout{targetScouts.length !== 1 ? 's' : ''})</span>
          </button>
        </div>

        {/* 1-Click Preset Quick-Configs */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>1-Click Preset Quick-Configs:</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => applyPreset('parent_conference')}
              className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-800 text-left transition cursor-pointer group shadow-sm"
            >
              <strong className="text-emerald-300 block font-bold group-hover:text-emerald-200">👨‍👩‍👧 Parent Conference</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">Active rank + Badges + Notes + Signatures</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('court_of_honor')}
              className="p-3 rounded-2xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 hover:bg-slate-800 text-left transition cursor-pointer group shadow-sm"
            >
              <strong className="text-amber-300 block font-bold group-hover:text-amber-200">🎖️ Court of Honor</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">Completed ranks + All badges + Service</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('eagle_review')}
              className="p-3 rounded-2xl bg-slate-900 border border-sky-500/40 hover:border-sky-400 hover:bg-slate-800 text-left transition cursor-pointer group shadow-sm"
            >
              <strong className="text-sky-300 block font-bold group-hover:text-sky-200">🦅 Eagle Candidate Review</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">Star/Life/Eagle + 21 Badges + Project</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('attendance_transcript')}
              className="p-3 rounded-2xl bg-slate-900 border border-teal-500/40 hover:border-teal-400 hover:bg-slate-800 text-left transition cursor-pointer group shadow-sm"
            >
              <strong className="text-teal-300 block font-bold group-hover:text-teal-200">📋 Attendance & Hours Transcript</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">Official hours, nights & service audit</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('master_record')}
              className="p-3 rounded-2xl bg-slate-900 border border-purple-500/40 hover:border-purple-400 hover:bg-slate-800 text-left transition cursor-pointer group shadow-sm"
            >
              <strong className="text-purple-300 block font-bold group-hover:text-purple-200">📜 Master Record File</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">Complete comprehensive audit</p>
            </button>
          </div>
        </div>

        {/* Target Selection & Date Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-750 text-xs">
          {/* Target Selection */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-750 space-y-3">
            <span className="font-extrabold uppercase text-slate-400 block tracking-wider text-[11px]">
              1. Target Scout or Patrol Batch:
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTargetType('single')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  targetType === 'single' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <User size={13} />
                <span>Single Scout</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('batch')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  targetType === 'batch' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Users size={13} />
                <span>Patrol / Troop Batch</span>
              </button>
            </div>

            {targetType === 'single' ? (
              <select
                value={selectedScoutId}
                onChange={(e) => setSelectedScoutId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
              >
                {scoutsList.map(s => (
                  <option key={s.uid} value={s.uid}>
                    {s.fullName || s.username} ({s.rank || 'Scout'} • @{s.username})
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
              >
                <option value="all">All Troop Scouts ({scoutsList.length} Scouts)</option>
                {groupsList.map(g => {
                  const count = scoutsList.filter(s => s.groupId === g.id || s.patrolId === g.id).length;
                  return (
                    <option key={g.id} value={g.id}>
                      {g.name} Patrol ({count} Scouts)
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Reporting Period Filter */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-750 space-y-3">
            <span className="font-extrabold uppercase text-slate-400 block tracking-wider text-[11px]">
              2. Reporting Period Scope:
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setReportMode('cumulative')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  reportMode === 'cumulative' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Layers size={13} />
                <span>All-Time Cumulative</span>
              </button>

              <button
                type="button"
                onClick={() => setReportMode('window')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  reportMode === 'window' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <CalendarRange size={13} />
                <span>Date Range Window</span>
              </button>
            </div>

            {reportMode === 'window' && (
              <div className="flex items-center gap-3 pt-1 animate-fadeIn">
                <div className="flex items-center gap-1.5">
                  <label className="text-slate-400 text-[11px]">Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-slate-400 text-[11px]">End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MODULAR ITEM BUILDER CHECKLIST & GRANULAR SELECTORS ── */}
        <div className="pt-4 border-t border-slate-750 space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Filter size={15} className="text-emerald-400" />
            <span>Modular Section Checkboxes & Granular Selectors</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* 1. Ranks Advancement */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 space-y-2.5">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.ranks.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, ranks: { ...prev.ranks, enabled: e.target.checked } }))}
                  className="rounded text-emerald-500"
                />
                <Award size={14} className="text-emerald-400" />
                <span>Rank Advancement</span>
              </label>

              {config.ranks.enabled && (
                <div className="space-y-2 pl-5 pt-1 text-[11px] text-slate-350 border-l border-slate-750">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rank_scope"
                      checked={config.ranks.scope === 'current'}
                      onChange={() => setConfig(prev => ({ ...prev, ranks: { ...prev.ranks, scope: 'current' } }))}
                    />
                    <span>Current Active Rank Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rank_scope"
                      checked={config.ranks.scope === 'all'}
                      onChange={() => setConfig(prev => ({ ...prev, ranks: { ...prev.ranks, scope: 'all' } }))}
                    />
                    <span>All 7 Ranks (Full Checklist)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rank_scope"
                      checked={config.ranks.scope === 'custom'}
                      onChange={() => setConfig(prev => ({ ...prev, ranks: { ...prev.ranks, scope: 'custom' } }))}
                    />
                    <span>Specific Custom Rank(s)</span>
                  </label>
                </div>
              )}
            </div>

            {/* 2. Merit Badges */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 space-y-2.5">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.badges.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, badges: { ...prev.badges, enabled: e.target.checked } }))}
                  className="rounded text-emerald-500"
                />
                <Star size={14} className="text-amber-400" />
                <span>Merit Badges Module</span>
              </label>

              {config.badges.enabled && (
                <div className="space-y-2 pl-5 pt-1 text-[11px] text-slate-350 border-l border-slate-750">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="badge_scope"
                      checked={config.badges.scope === 'all'}
                      onChange={() => setConfig(prev => ({ ...prev, badges: { ...prev.badges, scope: 'all' } }))}
                    />
                    <span>All Earned & In-Progress</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="badge_scope"
                      checked={config.badges.scope === 'eagle_only'}
                      onChange={() => setConfig(prev => ({ ...prev, badges: { ...prev.badges, scope: 'eagle_only' } }))}
                    />
                    <span>Eagle-Required Only (14 Badges)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="badge_scope"
                      checked={config.badges.scope === 'plan_matrix'}
                      onChange={() => setConfig(prev => ({ ...prev, badges: { ...prev.badges, scope: 'plan_matrix' } }))}
                    />
                    <span>Road to Eagle 21-Badge Pathway</span>
                  </label>
                </div>
              )}
            </div>

            {/* 3. Eagle Scout Project & Milestones */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 space-y-2.5">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.eagle.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, eagle: { ...prev.eagle, enabled: e.target.checked } }))}
                  className="rounded text-emerald-500"
                />
                <Shield size={14} className="text-amber-400" />
                <span>Eagle Project & Milestones</span>
              </label>

              {config.eagle.enabled && (
                <div className="space-y-1.5 pl-5 pt-1 text-[11px] text-slate-350 border-l border-slate-750">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.eagle.includeTenure}
                      onChange={(e) => setConfig(prev => ({ ...prev, eagle: { ...prev.eagle, includeTenure: e.target.checked } }))}
                    />
                    <span>6-Month Tenure & Leadership</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.eagle.includePhases}
                      onChange={(e) => setConfig(prev => ({ ...prev, eagle: { ...prev.eagle, includePhases: e.target.checked } }))}
                    />
                    <span>Project 5-Phase Breakdown</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.eagle.includeVolunteerHours}
                      onChange={(e) => setConfig(prev => ({ ...prev, eagle: { ...prev.eagle, includeVolunteerHours: e.target.checked } }))}
                    />
                    <span>Volunteer Hours Log</span>
                  </label>
                </div>
              )}
            </div>

            {/* 4. Service Hours */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 space-y-2.5">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.service.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, service: { ...prev.service, enabled: e.target.checked } }))}
                  className="rounded text-emerald-500"
                />
                <Heart size={14} className="text-sky-400" />
                <span>Service Hours Log</span>
              </label>

              {config.service.enabled && (
                <div className="space-y-1.5 pl-5 pt-1 text-[11px] text-slate-350 border-l border-slate-750">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.service.conservationOnly}
                      onChange={(e) => setConfig(prev => ({ ...prev, service: { ...prev.service, conservationOnly: e.target.checked } }))}
                    />
                    <span>Show Conservation-Only Hours</span>
                  </label>
                </div>
              )}
            </div>

            {/* 5. Homework & Curriculum */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 space-y-2.5">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.homework.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, homework: { ...prev.homework, enabled: e.target.checked } }))}
                  className="rounded text-emerald-500"
                />
                <BookOpen size={14} className="text-teal-400" />
                <span>Homework & Islamic Curriculum</span>
              </label>

              {config.homework.enabled && (
                <div className="space-y-1.5 pl-5 pt-1 text-[11px] text-slate-350 border-l border-slate-750">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.homework.includeAssignments}
                      onChange={(e) => setConfig(prev => ({ ...prev, homework: { ...prev.homework, includeAssignments: e.target.checked } }))}
                    />
                    <span>Scouting Homework & Tasks</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.homework.includeIslamic}
                      onChange={(e) => setConfig(prev => ({ ...prev, homework: { ...prev.homework, includeIslamic: e.target.checked } }))}
                    />
                    <span>Islamic Knowledge Tracker</span>
                  </label>
                </div>
              )}
            </div>

            {/* 6. Activities, Notes & Signatures */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-750 space-y-2.5">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.activities.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, activities: { ...prev.activities, enabled: e.target.checked } }))}
                  className="rounded text-emerald-500"
                />
                <Compass size={14} className="text-emerald-400" />
                <span>Patrol Activities & Attendance</span>
              </label>

              <div className="flex gap-4 pt-1 text-[11px]">
                <label className="flex items-center gap-1.5 text-slate-350 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.notes.enabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, notes: { enabled: e.target.checked } }))}
                  />
                  <span>Leader Notes</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-350 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.signatures.enabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, signatures: { enabled: e.target.checked } }))}
                  />
                  <span>Signatures</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPILED PRINTABLE REPORTS CONTAINER ── */}
      <div id="compiled-reports-container">
        {targetScouts.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-3xl border border-slate-700 text-center space-y-3">
            <User size={48} className="mx-auto text-slate-500 opacity-60" />
            <h3 className="text-lg font-bold text-white">No Scouts Selected</h3>
            <p className="text-xs text-slate-400">Select a scout or patrol batch to compile customized reports.</p>
          </div>
        ) : (
          targetScouts.map(scout => (
            <SingleScoutCustomReport
              key={scout.uid}
              scout={scout}
              currentUser={currentUser}
              config={config}
              groupsMap={groupsMap}
              startDate={startDate}
              endDate={endDate}
              reportMode={reportMode}
              generationDate={generationDate}
            />
          ))
        )}
      </div>
    </div>
  );
}
