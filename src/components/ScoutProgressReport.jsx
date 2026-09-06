import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { RANKS_DATA, getLatestAchievedRank, getNextIncompleteRank, isRankCompleted, getRankCompletionPercentage, getRankById, getRankIndex } from '../data/ranksData';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import { publishProgressReport, signPublishedReportByParent, signPublishedReportByScout } from '../services/publishedReportsService';
import SignaturePadModal from './SignaturePadModal';
import DigitalVerificationStamp from './DigitalVerificationStamp';
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
  ShieldCheck,
  PenTool,
  Send,
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
  CheckCheck,
  Target,
  TrendingUp,
  AlertCircle,
  Milestone,
  Flag,
  Zap,
  Sliders,
  Edit2,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import RankIcon from './RankIcon';

// ── ADVANCEMENT PLAN DEFAULT GENERATOR ──
export function generateDefaultAdvancementPlan(scoutProfile = {}, currentRankId = 'scout') {
  const joinedDateStr = scoutProfile?.joinedDate || scoutProfile?.createdAt?.split?.('T')?.[0] || new Date().toISOString().split('T')[0];
  const joinedDate = new Date(joinedDateStr);

  const addMonths = (base, m) => {
    const d = new Date(base);
    d.setMonth(d.getMonth() + m);
    return d.toISOString().split('T')[0];
  };

  // Standard BSA pacing intervals from joined date:
  // Scout: 1 month, Tenderfoot: 4 months, Second Class: 8 months, First Class: 12 months, Star: 18 months, Life: 24 months, Eagle: 36 months
  const targetRanks = {
    scout: addMonths(joinedDate, 1),
    tenderfoot: addMonths(joinedDate, 4),
    secondclass: addMonths(joinedDate, 8),
    firstclass: addMonths(joinedDate, 12),
    star: addMonths(joinedDate, 18),
    life: addMonths(joinedDate, 24),
    eagle: addMonths(joinedDate, 36)
  };

  let targetEagleDate = targetRanks.eagle;
  if (scoutProfile?.dob || scoutProfile?.birthday) {
    const dob = new Date(scoutProfile.dob || scoutProfile.birthday);
    const bday18 = new Date(dob);
    bday18.setFullYear(bday18.getFullYear() + 18);
    // Eagle target should ideally be 6 months before 18th birthday
    const eagleTargetFromDob = new Date(bday18);
    eagleTargetFromDob.setMonth(eagleTargetFromDob.getMonth() - 6);
    if (eagleTargetFromDob > joinedDate) {
      targetEagleDate = eagleTargetFromDob.toISOString().split('T')[0];
      targetRanks.eagle = targetEagleDate;
    }
  }

  return {
    targetEagleDate,
    targetRanks,
    meritBadgesPlan: {
      targetAnnualCount: 4,
      plannedBadgesList: []
    },
    serviceHoursGoal: 25,
    leadershipTenureTarget: 6
  };
}

// ── PLAN VS. ACTUAL VARIANCE & PACING ENGINE ──
export function calculateAdvancementPacing({
  plan,
  ranksProgress,
  earnedBadges,
  eagleRequiredEarned,
  electiveEarned,
  currentRankId,
  currentRankPercent,
  serviceHours,
  scoutProfile,
  eagleRoadmap
}) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const bsaRanks = RANKS_DATA.filter(r => r.id !== 'arrow_of_light');
  const latestRank = getLatestAchievedRank(ranksProgress, scoutProfile?.rank);
  const targetRank = getNextIncompleteRank(ranksProgress);

  // 1. Rank Milestones Pacing Matrix
  const rankMilestones = bsaRanks.map((rank) => {
    const rId = rank.id;
    const targetDateStr = plan?.targetRanks?.[rId] || '';
    const rp = ranksProgress?.[rId] || {};
    const actualDateStr = rp.completedDate || rp.approvedAt || rp.testingCompletedAt || null;
    const isCompleted = isRankCompleted(rank, ranksProgress);
    const isActive = rId === targetRank.id && !isCompleted;
    const isUpcoming = !isCompleted && !isActive;

    let statusType = 'planned'; // 'ahead' | 'on_track' | 'behind' | 'delayed' | 'planned'
    let varianceLabel = '—';
    let deltaDays = 0;
    let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';

    if (isCompleted && targetDateStr) {
      const targetDate = new Date(targetDateStr);
      const actualDate = new Date(actualDateStr || targetDateStr);
      deltaDays = Math.round((targetDate - actualDate) / (1000 * 60 * 60 * 24));
      if (deltaDays >= 0) {
        statusType = 'ahead';
        varianceLabel = deltaDays === 0 ? '✓ On Schedule' : `✓ +${deltaDays}d Ahead`;
        badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      } else {
        statusType = 'delayed';
        varianceLabel = `${deltaDays}d Behind Target`;
        badgeColor = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
      }
    } else if (isActive && targetDateStr) {
      const targetDate = new Date(targetDateStr);
      deltaDays = Math.round((targetDate - now) / (1000 * 60 * 60 * 24));
      if (deltaDays >= 0) {
        statusType = 'on_track';
        varianceLabel = `On Track (Due in ${deltaDays}d)`;
        badgeColor = 'bg-blue-100 text-blue-900 border-blue-400 font-bold';
      } else {
        statusType = 'behind';
        varianceLabel = `🚨 ${Math.abs(deltaDays)}d Past Target`;
        badgeColor = 'bg-red-100 text-red-900 border-red-400 font-bold';
      }
    } else if (isUpcoming && targetDateStr) {
      statusType = 'planned';
      varianceLabel = `Target: ${targetDateStr}`;
      badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
    }

    return {
      rankId: rId,
      rankName: rank.name,
      targetDate: targetDateStr || 'TBD',
      actualDate: actualDateStr || (isCompleted ? 'Completed' : '—'),
      isCompleted,
      isActive,
      isUpcoming,
      statusType,
      varianceLabel,
      deltaDays,
      badgeColor
    };
  });

  // 2. Eagle Countdown & Pacing Projections
  const targetEagleStr = plan?.targetEagleDate || plan?.targetRanks?.eagle || '';
  let daysToEagle = null;
  let monthsToEagle = null;
  if (targetEagleStr) {
    const targetEagleDate = new Date(targetEagleStr);
    daysToEagle = Math.round((targetEagleDate - now) / (1000 * 60 * 60 * 24));
    monthsToEagle = Math.max(1, Math.round(daysToEagle / 30.44));
  }

  // 18th Birthday Deadline
  let daysTo18thBday = null;
  let bday18DateStr = null;
  if (scoutProfile?.dob || scoutProfile?.birthday) {
    const dob = new Date(scoutProfile.dob || scoutProfile.birthday);
    const bday18 = new Date(dob);
    bday18.setFullYear(bday18.getFullYear() + 18);
    bday18DateStr = bday18.toISOString().split('T')[0];
    daysTo18thBday = Math.round((bday18 - now) / (1000 * 60 * 60 * 24));
  }

  // Merit Badge Velocity
  const totalBadgesEarned = earnedBadges.length;
  const eagleBadgesEarned = eagleRequiredEarned.length;
  const electiveBadgesEarned = electiveEarned.length;

  const totalBadgesRemaining = Math.max(0, 21 - totalBadgesEarned);
  const eagleBadgesRemaining = Math.max(0, 14 - eagleBadgesEarned);
  const electiveBadgesRemaining = Math.max(0, 7 - electiveBadgesEarned);

  // Planned badges expected by today (based on annual rate or target dates)
  const annualTarget = Number(plan?.meritBadgesPlan?.targetAnnualCount) || 4;
  const joinedDateStr = scoutProfile?.joinedDate || scoutProfile?.createdAt?.split?.('T')?.[0] || now.toISOString().split('T')[0];
  const tenureYears = Math.max(0.25, (now - new Date(joinedDateStr)) / (1000 * 60 * 60 * 24 * 365.25));
  const expectedBadgesToDate = Math.round(tenureYears * annualTarget);
  const badgeDelta = totalBadgesEarned - expectedBadgesToDate;

  const badgesPerMonthRequired = monthsToEagle && monthsToEagle > 0 
    ? (totalBadgesRemaining / monthsToEagle).toFixed(1) 
    : '0.0';

  // Service Hours Goal & Gap
  const serviceGoal = Number(plan?.serviceHoursGoal) || 25;
  const serviceGap = Math.max(0, serviceGoal - serviceHours);

  // Overall Plan Health
  const activeMilestone = rankMilestones.find(r => r.isActive);
  let overallPlanHealth = 'On Track';
  let overallPlanHealthColor = 'bg-blue-100 text-blue-900 border-blue-400 font-black';

  if (activeMilestone?.statusType === 'ahead' || (activeMilestone?.statusType === 'on_track' && badgeDelta >= 0)) {
    overallPlanHealth = 'Ahead of Plan';
    overallPlanHealthColor = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black';
  } else if (activeMilestone?.statusType === 'behind' || badgeDelta <= -2 || (daysToEagle !== null && daysToEagle < 0)) {
    overallPlanHealth = 'Needs Acceleration';
    overallPlanHealthColor = 'bg-red-100 text-red-900 border-red-400 font-black';
  } else {
    overallPlanHealth = 'On Track';
    overallPlanHealthColor = 'bg-blue-100 text-blue-900 border-blue-400 font-black';
  }

  // Dynamic Projected Eagle Date
  let projectedEagleDateStr = targetEagleStr;
  const completedRanksCount = rankMilestones.filter(r => r.isCompleted).length;
  if (completedRanksCount > 0) {
    const avgDaysPerRank = Math.max(60, (now - new Date(joinedDateStr)) / (1000 * 60 * 60 * 24 * completedRanksCount));
    const remainingRanks = Math.max(0, 7 - completedRanksCount);
    const projectedDays = remainingRanks * avgDaysPerRank;
    const projDate = new Date(now.getTime() + projectedDays * 24 * 60 * 60 * 1000);
    projectedEagleDateStr = projDate.toISOString().split('T')[0];
  }

  // Total Eagle Journey Completion Score (out of 30 points)
  const totalEagleWeight = 30;
  const completedPoints = completedRanksCount + totalBadgesEarned + (eagleRoadmap?.phase5?.completed ? 1 : 0) + (serviceHours >= serviceGoal ? 1 : 0);
  const completedPercent = Math.min(100, Math.round((completedPoints / totalEagleWeight) * 100));

  return {
    rankMilestones,
    targetEagleStr,
    projectedEagleDateStr,
    daysToEagle,
    monthsToEagle,
    daysTo18thBday,
    bday18DateStr,
    totalBadgesEarned,
    eagleBadgesEarned,
    electiveBadgesEarned,
    totalBadgesRemaining,
    eagleBadgesRemaining,
    electiveBadgesRemaining,
    expectedBadgesToDate,
    badgeDelta,
    badgesPerMonthRequired,
    serviceGoal,
    serviceGap,
    overallPlanHealth,
    overallPlanHealthColor,
    completedPercent
  };
}

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
  const [advancementPlan, setAdvancementPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable commentary fields for Leader
  const [strengthsText, setStrengthsText] = useState('');
  const [focusAreasText, setFocusAreasText] = useState('');
  const [parentActionItems, setParentActionItems] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaveMsg, setNotesSaveMsg] = useState('');

  // Target Plan Editor Modal State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTargetEagleDate, setPlanTargetEagleDate] = useState('');
  const [planTargetScout, setPlanTargetScout] = useState('');
  const [planTargetTenderfoot, setPlanTargetTenderfoot] = useState('');
  const [planTargetSecondClass, setPlanTargetSecondClass] = useState('');
  const [planTargetFirstClass, setPlanTargetFirstClass] = useState('');
  const [planTargetStar, setPlanTargetStar] = useState('');
  const [planTargetLife, setPlanTargetLife] = useState('');
  const [planTargetEagle, setPlanTargetEagle] = useState('');
  const [planAnnualBadges, setPlanAnnualBadges] = useState(4);
  const [planServiceGoal, setPlanServiceGoal] = useState(25);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaveMsg, setPlanSaveMsg] = useState('');

  // Published Reports & Digital Signature State
  const [publishedReports, setPublishedReports] = useState([]);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signModalType, setSignModalType] = useState('leader'); // 'leader' | 'parent' | 'scout'
  const [isSubmittingSignature, setIsSubmittingSignature] = useState(false);
  const [publishSuccessToast, setPublishSuccessToast] = useState('');

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

  // 1.2. Fetch Published Reports for Scout
  useEffect(() => {
    if (!scoutUid) return;
    const qPub = query(collection(db, 'published_reports'), where('scoutId', '==', scoutUid));
    const unsub = onSnapshot(qPub, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      setPublishedReports(list);
    }, (err) => console.warn('Published reports listener:', err));
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

  // 8. Fetch Leader Notes, Road to Eagle, and Advancement Plan
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
    });

    const unsubPlan = onSnapshot(doc(db, 'user_progress', scoutUid, 'advancement_plan'), (snap) => {
      if (snap.exists()) {
        const planDoc = snap.data();
        setAdvancementPlan(planDoc);
        setPlanTargetEagleDate(planDoc.targetEagleDate || '');
        setPlanTargetScout(planDoc.targetRanks?.scout || '');
        setPlanTargetTenderfoot(planDoc.targetRanks?.tenderfoot || '');
        setPlanTargetSecondClass(planDoc.targetRanks?.secondclass || '');
        setPlanTargetFirstClass(planDoc.targetRanks?.firstclass || '');
        setPlanTargetStar(planDoc.targetRanks?.star || '');
        setPlanTargetLife(planDoc.targetRanks?.life || '');
        setPlanTargetEagle(planDoc.targetRanks?.eagle || '');
        setPlanAnnualBadges(planDoc.meritBadgesPlan?.targetAnnualCount || 4);
        setPlanServiceGoal(planDoc.serviceHoursGoal || 25);
      } else {
        setAdvancementPlan(null);
      }
      setLoading(false);
    });

    return () => {
      unsubNotes();
      unsubEagle();
      unsubRoadmap();
      unsubPlan();
    };
  }, [scoutUid]);

  // Handle saving commentary
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

  // Handle saving target plan
  const handleSaveTargetPlan = async (e) => {
    e?.preventDefault?.();
    if (!scoutUid) return;
    setSavingPlan(true);
    setPlanSaveMsg('');

    const payload = {
      targetEagleDate: planTargetEagleDate || planTargetEagle,
      targetRanks: {
        scout: planTargetScout,
        tenderfoot: planTargetTenderfoot,
        secondclass: planTargetSecondClass,
        firstclass: planTargetFirstClass,
        star: planTargetStar,
        life: planTargetLife,
        eagle: planTargetEagle || planTargetEagleDate
      },
      meritBadgesPlan: {
        targetAnnualCount: Number(planAnnualBadges) || 4,
        plannedBadgesList: []
      },
      serviceHoursGoal: Number(planServiceGoal) || 25,
      updatedAt: serverTimestamp(),
      updatedBy: currentUser?.uid || 'leader'
    };

    try {
      await setDoc(doc(db, 'user_progress', scoutUid, 'advancement_plan'), payload, { merge: true });
      setPlanSaveMsg('✓ Target Advancement Plan updated successfully!');
      setTimeout(() => {
        setPlanSaveMsg('');
        setShowPlanModal(false);
      }, 1200);
    } catch (err) {
      alert("Error saving target plan: " + err.message);
    } finally {
      setSavingPlan(false);
    }
  };

  // Populate standard BSA timeline in plan editor
  const handleResetToBsaStandardPlan = () => {
    const defaultP = generateDefaultAdvancementPlan(profileData || scout, scoutRank);
    setPlanTargetEagleDate(defaultP.targetEagleDate);
    setPlanTargetScout(defaultP.targetRanks.scout);
    setPlanTargetTenderfoot(defaultP.targetRanks.tenderfoot);
    setPlanTargetSecondClass(defaultP.targetRanks.secondclass);
    setPlanTargetFirstClass(defaultP.targetRanks.firstclass);
    setPlanTargetStar(defaultP.targetRanks.star);
    setPlanTargetLife(defaultP.targetRanks.life);
    setPlanTargetEagle(defaultP.targetRanks.eagle);
    setPlanAnnualBadges(defaultP.meritBadgesPlan.targetAnnualCount);
    setPlanServiceGoal(defaultP.serviceHoursGoal);
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
  const scoutBsaId = scoutInfo.bsaId || 'BSA-110-' + (scoutUid ? scoutUid.substring(0, 5).toUpperCase() : '0000');

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

  // Latest Achieved Rank & Target In-Progress Rank
  const latestAchievedRank = getLatestAchievedRank(ranksProgress, scout.rank);
  const nextTargetRank = getNextIncompleteRank(ranksProgress);
  const currentRankData = latestAchievedRank;
  const targetRankData = nextTargetRank;
  const currentRankIndex = getRankIndex(latestAchievedRank.id);
  const isLifeOrEagle = latestAchievedRank.id === 'life' || latestAchievedRank.id === 'eagle';

  // Target Rank Granular Requirements
  const targetRankDoc = ranksProgress[targetRankData.id] || {};
  const currentRankDoc = targetRankDoc;
  const currentRankReqs = targetRankData.categories ? targetRankData.categories.flatMap(c => c.requirements) : (targetRankData.requirements || []);
  
  const currentRankCompletedReqs = currentRankReqs.filter(req => {
    const s = targetRankDoc.completedRequirements?.[req.id] || targetRankDoc.steps?.[req.id];
    const isDone = s === true || s?.completed === true;
    if (!isDone) return false;
    if (reportMode === 'window') {
      const d = s?.completedAt || s?.approvedAt || s?.date || targetRankDoc.completedDate || '';
      return isDateInWindow(d);
    }
    return true;
  });

  const currentRankCompletedCount = currentRankCompletedReqs.length;
  const currentRankTotalCount = currentRankReqs.length || 1;
  const currentRankPercent = Math.round((currentRankCompletedCount / currentRankTotalCount) * 100);

  // Remaining Requirements for Target Rank
  const currentRankRemainingReqs = currentRankReqs.filter(req => {
    const s = targetRankDoc.completedRequirements?.[req.id] || targetRankDoc.steps?.[req.id];
    return !(s === true || s?.completed === true);
  });

  // Starting Baseline Calculation (Mode: Window)
  const baselineRankCompletedCount = currentRankReqs.filter(req => {
    const s = targetRankDoc.completedRequirements?.[req.id] || targetRankDoc.steps?.[req.id];
    const isDone = s === true || s?.completed === true;
    if (!isDone) return false;
    const d = s?.completedAt || s?.approvedAt || s?.date || targetRankDoc.completedDate || '';
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
  const baselineServiceHours = serviceLogs.filter(l => isDatePriorToStart(l.date)).reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  // ── DYNAMIC VARIANCE PACING ENGINE EXECUTION ──
  const activePlan = advancementPlan || generateDefaultAdvancementPlan(scoutInfo, scoutRank);
  const pacingMetrics = calculateAdvancementPacing({
    plan: activePlan,
    ranksProgress,
    earnedBadges,
    eagleRequiredEarned,
    electiveEarned,
    currentRankId: currentRankData.id,
    currentRankPercent,
    serviceHours: totalWindowServiceHours,
    scoutProfile: scoutInfo,
    eagleRoadmap
  });

  // ── HOMEWORK & EDUCATIONAL ASSIGNMENTS ──
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

  const latestPublishedReport = publishedReports[0] || null;

  const handleOpenSignatureModal = (type) => {
    setSignModalType(type);
    setShowSignModal(true);
  };

  const handleSaveDigitalSignature = async ({ signerName, signerRole, signatureDataUrl, signedAt }) => {
    setIsSubmittingSignature(true);
    try {
      if (signModalType === 'leader') {
        // Build full snapshot and publish to parent portal
        const snapshot = {
          rank: latestAchievedRank.name,
          rankProgress: targetRankProgress.percentage,
          attendanceRate: reportAttendanceRate,
          completedRankSteps: activeStepsList.filter(s => s.isCompleted),
          meritBadges: Object.values(meritProgress),
          serviceHours: totalServiceHoursInReport,
          homeworkRecords: filteredHomework,
          leaderCommentary: {
            strengths: strengthsText,
            focusAreas: focusAreasText,
            parentActionItems: parentActionItems
          },
          advancementPlan: advancementPlan,
          totalEventsAttended: reportAttendedCount
        };

        await publishProgressReport({
          scoutId: scoutUid,
          scoutName: scoutFullName,
          groupId: groupData?.id || profileData?.groupId || 'all',
          patrolName: groupData?.name || profileData?.patrolName || 'Taliʿa Patrol',
          parentEmail: profileData?.parentEmail || null,
          parentUid: profileData?.parentUid || null,
          leaderId: currentUser?.uid || 'leader',
          leaderName: currentUser?.fullName || currentUser?.username || 'Unit Leader',
          reportingPeriod: reportMode === 'cumulative' ? 'All-Time Cumulative' : `${startDate} to ${endDate}`,
          reportSnapshot: snapshot,
          leaderSignature: {
            signed: true,
            signerName,
            signerRole,
            signatureDataUrl,
            signedAt
          }
        });

        setPublishSuccessToast(`✓ Official progress report published and sent to ${scoutFullName}'s Parent Portal!`);
      } else if (signModalType === 'parent') {
        if (!latestPublishedReport) {
          alert('No published report found to sign. Ask unit leader to publish the report first.');
          return;
        }
        await signPublishedReportByParent({
          reportId: latestPublishedReport.id,
          signerName,
          signerRole,
          signatureDataUrl,
          signerUid: currentUser?.uid || null
        });
        setPublishSuccessToast('✓ Parent digital signature verified and securely stamped!');
      } else if (signModalType === 'scout') {
        if (!latestPublishedReport) {
          alert('No published report found to sign. Ask unit leader to publish the report first.');
          return;
        }
        await signPublishedReportByScout({
          reportId: latestPublishedReport.id,
          signerName,
          signatureDataUrl
        });
        setPublishSuccessToast('✓ Scout candidate digital signature recorded!');
      }

      setShowSignModal(false);
    } catch (err) {
      console.error('Signature submission error:', err);
      alert('Error saving signature: ' + err.message);
    } finally {
      setIsSubmittingSignature(false);
      setTimeout(() => setPublishSuccessToast(''), 4000);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const sanitizedName = (scoutFullName || 'Scout').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Set suggested filename: e.g. "Hussein_Nehme_Progress_Report_2026-09-06"
    document.title = `${sanitizedName}_Progress_Report_${dateStr}`;
    
    window.print();
    
    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-semibold">Generating Advancement Progress Report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16 text-slate-900">
      {/* ── PRINT CSS FIXES ── */}
      <style>{`
        @media print {
          @page {
            margin: 10mm 12mm 10mm 12mm;
            size: auto;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hide {
            display: none !important;
          }
          .page-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* ── 1. SCREEN CONFIGURATION TOOLBAR & DATE FILTER ENGINE ── */}
      <div className="bg-slate-850 border border-slate-700 p-5 rounded-3xl shadow-2xl space-y-4 print-hide">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-655 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
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
                Official Pacing & Variance Document for <strong className="text-amber-300">{scoutFullName}</strong> ({currentRankData.name})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isLeaderOrOwner && (
              <button
                type="button"
                onClick={() => handleOpenSignatureModal('leader')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
              >
                <ShieldCheck size={15} />
                <span>Sign & Publish to Parent Portal</span>
              </button>
            )}

            {(currentUser?.role === 'parent' || currentUser?.parentEmail) && latestPublishedReport && !latestPublishedReport.signatures?.parent?.signed && (
              <button
                type="button"
                onClick={() => handleOpenSignatureModal('parent')}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-950/40 animate-pulse"
              >
                <PenTool size={15} />
                <span>Review & Sign as Parent</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (!advancementPlan) handleResetToBsaStandardPlan();
                setShowPlanModal(true);
              }}
              className="bg-slate-750 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Target size={14} className="text-amber-400" />
              <span>{advancementPlan ? 'Edit Target Plan' : '🎯 Setup Target Plan'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-emerald-950/60 hover:scale-[1.02]"
            >
              <Printer size={15} />
              <span>Print Report (PDF)</span>
            </button>
          </div>
        </div>

        {/* Publish / Sign Toast Alert */}
        {publishSuccessToast && (
          <div className="p-3.5 bg-emerald-950 border border-emerald-500/60 rounded-2xl text-emerald-200 text-xs flex items-center gap-2 font-bold animate-fadeIn shadow-lg">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{publishSuccessToast}</span>
          </div>
        )}

        {/* Published Report Status Banner */}
        {latestPublishedReport && (
          <div className="bg-slate-900/90 border border-slate-750 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck size={14} /> Published Record:
              </span>
              <span className="text-slate-300 font-mono">
                {latestPublishedReport.publishedAt?.split('T')[0]} by {latestPublishedReport.leaderName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {latestPublishedReport.signatures?.parent?.signed ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                  <Check size={11} /> Parent Signed ({latestPublishedReport.signatures?.parent?.signerName})
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                  <Clock size={11} /> Awaiting Parent Signature
                </span>
              )}
            </div>
          </div>
        )}

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
                <span>All-Time Cumulative Progress</span>
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
                Official Scout Advancement, Plan vs. Actual & Pacing Report
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

        {/* ── 3. PROMINENT ADVANCEMENT PLAN VS. ACTUAL PROGRESS MATRIX ── */}
        <div className="border-2 border-slate-900 rounded-2xl p-5 bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-5 page-break-avoid shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-slate-900" />
              <h3 className="text-base font-black uppercase text-slate-950 tracking-tight">
                Advancement Plan vs. Actual Progress & Pacing Matrix
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              Target Eagle: {pacingMetrics.targetEagleStr || 'TBD'}
            </span>
          </div>

          {/* 3A. Pacing Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Card 1: Overall Plan Health */}
            <div className="p-3.5 rounded-xl border-2 border-slate-300 bg-white space-y-1.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Overall Plan Health
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${pacingMetrics.overallPlanHealthColor}`}>
                  {pacingMetrics.overallPlanHealth === 'Ahead of Plan' ? '🚀 Ahead of Plan' :
                   pacingMetrics.overallPlanHealth === 'On Track' ? '✓ On Track' : '⚠️ Needs Acceleration'}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug pt-1 font-medium">
                {pacingMetrics.overallPlanHealth === 'Ahead of Plan' 
                  ? 'Advancing ahead of defined milestones with strong rank and badge velocity.'
                  : pacingMetrics.overallPlanHealth === 'On Track'
                  ? 'Milestone completion is aligned with the target schedule.'
                  : 'Action required to close milestone and badge tenure gaps.'}
              </p>
            </div>

            {/* Card 2: Eagle Target vs Projected Completion */}
            <div className="p-3.5 rounded-xl border-2 border-slate-300 bg-white space-y-1.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Eagle Target vs. Projected
              </span>
              <div className="flex items-baseline gap-2 font-mono">
                <strong className="text-sm font-black text-slate-950">
                  {pacingMetrics.targetEagleStr}
                </strong>
                <span className="text-[10px] text-slate-600">
                  ({pacingMetrics.daysToEagle !== null ? `${pacingMetrics.daysToEagle}d left` : 'TBD'})
                </span>
              </div>
              <div className="text-[11px] text-slate-700 space-y-0.5 pt-0.5">
                <p><strong>Velocity Projected:</strong> <span className="font-mono font-semibold">{pacingMetrics.projectedEagleDateStr}</span></p>
                {pacingMetrics.bday18DateStr && (
                  <p className="text-[10px] text-amber-900 font-mono"><strong>18th Birthday:</strong> {pacingMetrics.bday18DateStr} ({pacingMetrics.daysTo18thBday}d)</p>
                )}
              </div>
            </div>

            {/* Card 3: Eagle Milestone Gap & Velocity */}
            <div className="p-3.5 rounded-xl border-2 border-slate-300 bg-white space-y-1.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Milestone Velocity & Rate
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-bold">
                  {pacingMetrics.totalBadgesEarned}/21 Badges
                </span>
                <span className={`text-[10px] font-bold ${pacingMetrics.badgeDelta >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                  ({pacingMetrics.badgeDelta >= 0 ? `+${pacingMetrics.badgeDelta}` : pacingMetrics.badgeDelta} vs pace)
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug pt-1">
                <strong>Required Rate:</strong> {pacingMetrics.badgesPerMonthRequired} badges/mo to hit target date.
              </p>
            </div>
          </div>

          {/* Eagle Milestone Gap Visual Delta Bar */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-300">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp size={13} className="text-emerald-700" />
                <span>Overall Eagle Progression Journey: {pacingMetrics.completedPercent}% Complete</span>
              </span>
              <span className="font-mono text-slate-600 text-[10px]">
                {7 - currentRankIndex - 1} Ranks &bull; {pacingMetrics.totalBadgesRemaining} Badges to Eagle
              </span>
            </div>
            
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-400 flex">
              <div 
                className="bg-emerald-700 h-full transition-all"
                style={{ width: `${pacingMetrics.completedPercent}%` }}
                title={`Completed: ${pacingMetrics.completedPercent}%`}
              />
            </div>
          </div>

          {/* 3B. Milestone Roadmap Comparison Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">
              BSA Milestone Roadmap: Planned vs. Actual Sign-Offs
            </h4>

            <table className="w-full text-xs text-left border-2 border-slate-800">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 w-36">Milestone / Goal</th>
                  <th className="p-2 w-28 text-center">Planned Target</th>
                  <th className="p-2 w-28 text-center">Actual Date</th>
                  <th className="p-2 w-36 text-center">Status / Variance</th>
                  <th className="p-2">Remaining Action Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 bg-white font-medium">
                
                {/* 7 BSA Ranks */}
                {pacingMetrics.rankMilestones.map((m) => {
                  const isCur = m.rankId === currentRankData.id;
                  return (
                    <tr key={m.rankId} className={isCur ? 'bg-amber-50/50' : m.isCompleted ? 'bg-emerald-50/20' : ''}>
                      <td className="p-2 font-bold text-slate-950 flex items-center gap-1.5">
                        <span className="text-base">{m.rankId === 'eagle' ? '🦅' : '⚜️'}</span>
                        <span>{m.rankName} Rank</span>
                        {isCur && <span className="text-[9px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-black uppercase">Active</span>}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-700">{m.targetDate}</td>
                      <td className="p-2 text-center font-mono font-bold text-slate-900">{m.actualDate}</td>
                      <td className="p-2 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded border inline-block ${m.badgeColor}`}>
                          {m.varianceLabel}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700 text-[11px]">
                        {m.isCompleted ? (
                          <span className="text-emerald-800 font-bold">✓ Rank Certified & Board of Review Complete</span>
                        ) : isCur ? (
                          <span className="font-semibold text-slate-900">{currentRankRemainingReqs.length} of {currentRankTotalCount} requirements left to complete</span>
                        ) : (
                          <span className="text-slate-500 italic">Prerequisite: Advance through preceding ranks</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* 21 Merit Badges Goal */}
                <tr className="bg-slate-50/60">
                  <td className="p-2 font-bold text-slate-950 flex items-center gap-1.5">
                    <span>🏅</span>
                    <span>21 Merit Badges</span>
                  </td>
                  <td className="p-2 text-center font-mono text-slate-700">{activePlan.targetEagleDate}</td>
                  <td className="p-2 text-center font-mono font-bold text-slate-900">{earnedBadges.length} Badges</td>
                  <td className="p-2 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold inline-block ${
                      pacingMetrics.badgeDelta >= 0 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {pacingMetrics.badgeDelta >= 0 ? `+${pacingMetrics.badgeDelta} vs Plan` : `${pacingMetrics.badgeDelta} Behind Pace`}
                    </span>
                  </td>
                  <td className="p-2 text-slate-700 text-[11px]">
                    {pacingMetrics.eagleBadgesRemaining} Eagle-Required + {pacingMetrics.electiveBadgesRemaining} Elective badges remaining
                  </td>
                </tr>

                {/* 6-Month Leadership Position Tenure */}
                <tr>
                  <td className="p-2 font-bold text-slate-950 flex items-center gap-1.5">
                    <span>🎖️</span>
                    <span>Leadership Position</span>
                  </td>
                  <td className="p-2 text-center font-mono text-slate-700">6 Months</td>
                  <td className="p-2 text-center font-mono font-bold text-slate-900">
                    {scoutInfo.leadershipPosition || 'Patrol Member'}
                  </td>
                  <td className="p-2 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold inline-block ${
                      isLifeOrEagle ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {isLifeOrEagle ? 'Active Tenure' : 'Gate for Star/Life'}
                    </span>
                  </td>
                  <td className="p-2 text-slate-700 text-[11px]">
                    Serve actively in an approved youth leadership position (SPL, PL, Scribe, Quartermaster)
                  </td>
                </tr>

                {/* Eagle Scout Service Project */}
                <tr className="bg-slate-50/60">
                  <td className="p-2 font-bold text-slate-950 flex items-center gap-1.5">
                    <span>🔨</span>
                    <span>Eagle Service Project</span>
                  </td>
                  <td className="p-2 text-center font-mono text-slate-700">{activePlan.targetEagleDate}</td>
                  <td className="p-2 text-center font-mono font-bold text-slate-900">
                    {eagleRoadmap.phase5?.completed ? '✓ Final Report' : eagleRoadmap.phase1?.projectTitle ? 'Proposal' : 'Not Started'}
                  </td>
                  <td className="p-2 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold inline-block ${
                      eagleRoadmap.phase5?.completed ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {eagleRoadmap.phase5?.completed ? 'Completed' : 'Mandatory for Eagle'}
                    </span>
                  </td>
                  <td className="p-2 text-slate-700 text-[11px]">
                    Plan, develop, and give leadership to others in a service project beneficial to school/community
                  </td>
                </tr>

                {/* Annual Service Hours & Nights */}
                <tr>
                  <td className="p-2 font-bold text-slate-950 flex items-center gap-1.5">
                    <span>⏱️</span>
                    <span>Annual Service & Nights</span>
                  </td>
                  <td className="p-2 text-center font-mono text-slate-700">{activePlan.serviceHoursGoal || 25}h / 10n</td>
                  <td className="p-2 text-center font-mono font-bold text-slate-900">
                    {totalWindowServiceHours}h / {reportTotalCampingNights}n
                  </td>
                  <td className="p-2 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold inline-block ${
                      pacingMetrics.serviceGap === 0 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {pacingMetrics.serviceGap === 0 ? '✓ Goal Met' : `${pacingMetrics.serviceGap}h Remaining`}
                    </span>
                  </td>
                  <td className="p-2 text-slate-700 text-[11px]">
                    Participate in troop service projects and weekend campout activities
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* 3C. Targeted Action Plan to Close the Gap */}
          <div className="bg-amber-50/80 border-2 border-amber-600/70 p-4 rounded-xl space-y-2.5 page-break-avoid">
            <div className="flex items-center gap-2 border-b border-amber-300 pb-1.5">
              <Zap size={16} className="text-amber-700" />
              <strong className="text-xs font-black uppercase text-amber-950">
                Action Plan to Close the Gap & Maintain Pacing
              </strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Box 1: Target Rank Next Steps */}
              <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1 shadow-xs">
                <strong className="text-[10px] uppercase font-black text-slate-900 block flex items-center gap-1">
                  <span>1. Target Rank ({targetRankData.name})</span>
                </strong>
                {currentRankRemainingReqs.length === 0 ? (
                  <p className="text-emerald-800 font-bold text-[11px]">✓ All requirements completed! Schedule Board of Review.</p>
                ) : (
                  <ul className="text-[11px] text-slate-800 space-y-0.5 list-disc list-inside">
                    {currentRankRemainingReqs.slice(0, 3).map(r => (
                      <li key={r.id} className="truncate" title={r.text}>
                        <strong>Req {r.id}:</strong> {r.text}
                      </li>
                    ))}
                    {currentRankRemainingReqs.length > 3 && (
                      <li className="text-slate-500 italic text-[10px] font-sans">
                        +{currentRankRemainingReqs.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Box 2: Next Eagle Badges */}
              <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1 shadow-xs">
                <strong className="text-[10px] uppercase font-black text-slate-900 block flex items-center gap-1">
                  <span>2. Recommended Badges in Queue</span>
                </strong>
                {eagleRequiredChecklist.filter(b => !b.status.includes('✓')).length === 0 ? (
                  <p className="text-emerald-800 font-bold text-[11px]">✓ All 14 Eagle-required badges completed!</p>
                ) : (
                  <ul className="text-[11px] text-slate-800 space-y-0.5 list-disc list-inside">
                    {eagleRequiredChecklist.filter(b => !b.status.includes('✓')).slice(0, 3).map(b => (
                      <li key={b.id} className="truncate">
                        <strong>{b.name}</strong> ({b.status})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Box 3: Key Milestone & Service Gate */}
              <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1 shadow-xs">
                <strong className="text-[10px] uppercase font-black text-slate-900 block flex items-center gap-1">
                  <span>3. Service & Leadership Pacing</span>
                </strong>
                <p className="text-[11px] text-slate-800 leading-snug">
                  {pacingMetrics.serviceGap > 0 
                    ? `Complete ${pacingMetrics.serviceGap} more service hours to achieve annual goal of ${activePlan.serviceHoursGoal || 25}h.` 
                    : `✓ Annual service hours target met (${totalWindowServiceHours}h).`}
                </p>
                <p className="text-[10px] text-slate-600 pt-0.5">
                  Maintain monthly rate of <strong>{pacingMetrics.badgesPerMonthRequired} badges/mo</strong> to finish on target date.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ── 4. TARGET RANK REQUIREMENTS CHECKLIST ── */}
        <div className="space-y-4 page-break-avoid">
          <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-base font-black uppercase text-slate-950">
              Target Rank Requirements Checklist ({targetRankData.name})
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700">
              {currentRankCompletedCount} of {currentRankTotalCount} Completed ({currentRankPercent}%)
            </span>
          </div>

          <div className="border-2 border-slate-800 rounded-xl p-4.5 space-y-3 bg-white">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-950">
                  {targetRankData.name} Rank Advancement Details
                </h4>
                <p className="text-[11px] text-slate-600">
                  Current Achieved Rank: <strong className="text-slate-950">{currentRankData.name}</strong> &bull; Sign-off log for {targetRankData.name}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black font-mono text-emerald-800">{currentRankPercent}%</span>
              </div>
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

        {/* ── 5. MERIT BADGE PORTFOLIO & EAGLE ROADMAP MATRIX ── */}
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

        {/* ── 6. SERVICE HOURS, HOMEWORK & TALI'A PATROL ACTIVITIES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 page-break-avoid">
          {/* Service Hours Log */}
          <div className="space-y-2.5">
            <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
              <h4 className="text-xs font-black uppercase text-slate-950">
                Community Service & Volunteering ({totalWindowServiceHours} Hrs)
              </h4>
              <span className="text-[10px] font-mono text-slate-600">{conservationHours} Conservation Hrs</span>
            </div>

            {filteredServiceLogs.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 italic text-xs text-center">
                No service hours logged in this reporting period.
              </div>
            ) : (
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
                  {filteredServiceLogs.slice(0, 5).map(l => (
                    <tr key={l.id}>
                      <td className="p-1.5 font-mono text-slate-700">{l.date}</td>
                      <td className="p-1.5 font-bold text-slate-900 truncate max-w-[120px]">{l.description || l.title || 'Service'}</td>
                      <td className="p-1.5 text-slate-600">{l.conservation ? 'Yes' : 'No'}</td>
                      <td className="p-1.5 text-right font-bold text-slate-950">{l.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Educational Homework & Assignments */}
          <div className="space-y-2.5">
            <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
              <h4 className="text-xs font-black uppercase text-slate-950">
                Homework & Educational Assignments
              </h4>
              <span className="text-[10px] font-mono text-slate-600">{filteredHomework.length} Tasks</span>
            </div>

            {filteredHomework.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 italic text-xs text-center">
                No homework assignments recorded in this reporting period.
              </div>
            ) : (
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
                  {filteredHomework.map(h => (
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
                  ))}
                </tbody>
              </table>
            )}
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

        {/* ── 7. LEADER NOTES & PARENT CONFERENCE SECTION ── */}
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

        {/* ── 8. OFFICIAL SIGNATURE & VERIFICATION BLOCK ── */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs page-break-avoid">
          {/* Scout Signature */}
          <DigitalVerificationStamp
            title="Scout Candidate Signature"
            signatureData={latestPublishedReport?.signatures?.scout}
            canSign={(currentUser?.role === 'scout' || isLeaderOrOwner) && !latestPublishedReport?.signatures?.scout?.signed}
            onSignClick={() => handleOpenSignatureModal('scout')}
            pendingLabel="Awaiting Scout Signature"
          />

          {/* Leader Signature */}
          <DigitalVerificationStamp
            title="Unit Leader / Scoutmaster"
            signatureData={latestPublishedReport?.signatures?.leader}
            canSign={isLeaderOrOwner && !latestPublishedReport?.signatures?.leader?.signed}
            onSignClick={() => handleOpenSignatureModal('leader')}
            pendingLabel="Awaiting Leader Publication"
            signerRole="Unit Leader"
          />

          {/* Parent Signature */}
          <DigitalVerificationStamp
            title="Parent / Guardian Signature"
            signatureData={latestPublishedReport?.signatures?.parent}
            canSign={(currentUser?.role === 'parent' || currentUser?.parentEmail || isLeaderOrOwner) && !latestPublishedReport?.signatures?.parent?.signed}
            onSignClick={() => handleOpenSignatureModal('parent')}
            pendingLabel="Awaiting Parent Signature in Portal"
          />
        </div>
      </div>

      {/* ── 9. TARGET ADVANCEMENT PLAN SETUP & CONFIGURATION MODAL ── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1">
                  <Target size={13} />
                  <span>Advancement Target Configuration</span>
                </span>
                <h3 className="font-extrabold text-white text-base mt-0.5">
                  Set Target Advancement Plan for {scoutFullName}
                </h3>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {planSaveMsg && (
              <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">
                {planSaveMsg}
              </p>
            )}

            <form onSubmit={handleSaveTargetPlan} className="space-y-4">
              
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300">
                  Quick generate standard milestone schedule:
                </span>
                <button
                  type="button"
                  onClick={handleResetToBsaStandardPlan}
                  className="bg-slate-800 hover:bg-slate-750 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <RotateCcw size={13} />
                  <span>Auto-Calculate BSA Standard Pace</span>
                </button>
              </div>

              {/* Target Eagle Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                    Target Eagle Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={planTargetEagleDate}
                    onChange={(e) => {
                      setPlanTargetEagleDate(e.target.value);
                      setPlanTargetEagle(e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Annual Merit Badge Target Goal
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={planAnnualBadges}
                    onChange={(e) => setPlanAnnualBadges(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Planned Rank Completion Dates */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Target Completion Date for Each Rank
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Scout Rank</label>
                    <input
                      type="date"
                      value={planTargetScout}
                      onChange={(e) => setPlanTargetScout(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Tenderfoot Rank</label>
                    <input
                      type="date"
                      value={planTargetTenderfoot}
                      onChange={(e) => setPlanTargetTenderfoot(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Second Class Rank</label>
                    <input
                      type="date"
                      value={planTargetSecondClass}
                      onChange={(e) => setPlanTargetSecondClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">First Class Rank</label>
                    <input
                      type="date"
                      value={planTargetFirstClass}
                      onChange={(e) => setPlanTargetFirstClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Star Rank</label>
                    <input
                      type="date"
                      value={planTargetStar}
                      onChange={(e) => setPlanTargetStar(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Life Rank</label>
                    <input
                      type="date"
                      value={planTargetLife}
                      onChange={(e) => setPlanTargetLife(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-amber-400 uppercase font-bold mb-1">Eagle Scout Rank</label>
                    <input
                      type="date"
                      value={planTargetEagle}
                      onChange={(e) => {
                        setPlanTargetEagle(e.target.value);
                        setPlanTargetEagleDate(e.target.value);
                      }}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Service Hours Target */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Annual Community Service Hours Goal
                </label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  value={planServiceGoal}
                  onChange={(e) => setPlanServiceGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={15} />
                  <span>{savingPlan ? 'Saving Advancement Plan...' : 'Save Advancement Plan'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 10. DIGITAL SIGNATURE CANVAS MODAL ── */}
      {showSignModal && (
        <SignaturePadModal
          isOpen={showSignModal}
          onClose={() => setShowSignModal(false)}
          onSave={handleSaveDigitalSignature}
          isSubmitting={isSubmittingSignature}
          signerType={signModalType}
          defaultSignerName={
            signModalType === 'leader'
              ? (currentUser?.fullName || currentUser?.username || 'Unit Leader')
              : signModalType === 'parent'
              ? (currentUser?.parent1Name || currentUser?.fullName || '')
              : (scoutFullName || '')
          }
          defaultSignerRole={
            signModalType === 'leader'
              ? 'Scoutmaster / Unit Leader'
              : signModalType === 'parent'
              ? (currentUser?.parent1Relation || 'Father')
              : 'Scout Candidate'
          }
          title={
            signModalType === 'leader'
              ? 'Leader Signature & Progress Report Publishing'
              : signModalType === 'parent'
              ? 'Parent Digital Signature & Verification'
              : 'Scout Candidate Digital Signature'
          }
          subtitle={
            signModalType === 'leader'
              ? `Certify and publish the official progress report snapshot for ${scoutFullName} to the Parent Portal.`
              : `Review and certify the official progress report for ${scoutFullName}.`
          }
        />
      )}
    </div>
  );
}
