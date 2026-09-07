import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { MERIT_BADGES } from '../data/meritBadges';
import { getLatestAchievedRank } from '../data/ranksData';
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
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Check,
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  DollarSign,
  HardHat,
  Flame,
  Info,
  CheckSquare,
  HelpCircle,
  Flag,
  TrendingUp,
  Circle
} from 'lucide-react';

// Helper to normalize badge IDs
function normalizeId(id = '') {
  return (id || '').toLowerCase().replace(/_/g, '-');
}

// 11 Core Solo Mandatory Eagle Badges
const MANDATORY_SOLO_BADGES = [
  { id: 'first-aid', name: 'First Aid', icon: '🩹', timeAlert: null },
  { id: 'citizenship-in-society', name: 'Citizenship in Society', icon: '🤝', timeAlert: null },
  { id: 'citizenship-in-the-community', name: 'Citizenship in the Community', icon: '🏛️', timeAlert: null },
  { id: 'citizenship-in-the-nation', name: 'Citizenship in the Nation', icon: '🇺🇸', timeAlert: null },
  { id: 'citizenship-in-the-world', name: 'Citizenship in the World', icon: '🌐', timeAlert: null },
  { id: 'communication', name: 'Communication', icon: '📢', timeAlert: null },
  { id: 'cooking', name: 'Cooking', icon: '🍳', timeAlert: null },
  { id: 'personal-fitness', name: 'Personal Fitness', icon: '🏃', timeAlert: 'Requires 90-day physical fitness tracking log' },
  { id: 'personal-management', name: 'Personal Management', icon: '📊', timeAlert: 'Requires 90-day personal budget & finance tracking log' },
  { id: 'camping', name: 'Camping', icon: '⛺', timeAlert: 'Requires 20 days and nights of logged campouts' },
  { id: 'family-life', name: 'Family Life', icon: '🏡', timeAlert: 'Requires 90-day family chore & project tracking log' },
];

// 3 Alternate Choice Groups (1 Required From Each)
const CHOICE_GROUPS = [
  {
    groupId: 'group1',
    groupName: 'Emergency Preparedness OR Lifesaving',
    badges: [
      { id: 'emergency-preparedness', name: 'Emergency Preparedness', icon: '🚨' },
      { id: 'lifesaving', name: 'Lifesaving', icon: '🛟' }
    ]
  },
  {
    groupId: 'group2',
    groupName: 'Environmental Science OR Sustainability',
    badges: [
      { id: 'environmental-science', name: 'Environmental Science', icon: '🔬' },
      { id: 'sustainability', name: 'Sustainability', icon: '🌱' }
    ]
  },
  {
    groupId: 'group3',
    groupName: 'Swimming OR Hiking OR Cycling',
    badges: [
      { id: 'swimming', name: 'Swimming', icon: '🏊' },
      { id: 'hiking', name: 'Hiking', icon: '🥾' },
      { id: 'cycling', name: 'Cycling', icon: '🚴' }
    ]
  }
];

export default function ParentEagleTracker({
  linkedScouts = [],
  selectedScoutId = 'all',
  onSelectScout,
  allGroups = [],
  ranksProgressMap = {},
  meritProgressMap = {}
}) {
  // Determine active scout
  const effectiveScout = 
    (selectedScoutId !== 'all' ? linkedScouts.find(s => s.uid === selectedScoutId) : null) || 
    linkedScouts[0] || 
    null;

  const activeScoutId = effectiveScout?.uid;

  // Real-time Scout Profile & Project Roadmap
  const [scoutDoc, setScoutDoc] = useState(effectiveScout || {});
  const [projectRoadmap, setProjectRoadmap] = useState(null);
  const [activeProjectPhase, setActiveProjectPhase] = useState('phase1');
  const [badgeViewMode, setBadgeViewMode] = useState('eagle_required'); // 'eagle_required' | 'electives'
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

  // 1. Subscribe in real time to scout's user doc for Eagle data
  useEffect(() => {
    if (!activeScoutId) return;
    const unsubUser = onSnapshot(doc(db, 'users', activeScoutId), (snap) => {
      if (snap.exists()) {
        setScoutDoc({ uid: snap.id, ...snap.data() });
      } else if (effectiveScout) {
        setScoutDoc(effectiveScout);
      }
    });

    const unsubRoadmap = onSnapshot(
      doc(db, 'user_progress', activeScoutId, 'road_to_eagle', 'project_roadmap'),
      (snap) => {
        if (snap.exists()) {
          setProjectRoadmap(snap.data());
        } else {
          setProjectRoadmap(null);
        }
        setLoadingRoadmap(false);
      },
      (err) => {
        console.warn('ParentEagleTracker roadmap listener:', err);
        setLoadingRoadmap(false);
      }
    );

    return () => {
      unsubUser();
      unsubRoadmap();
    };
  }, [activeScoutId, effectiveScout]);

  if (!effectiveScout) {
    return (
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-8 text-center text-slate-400">
        <Compass size={40} className="mx-auto text-slate-500 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Scout Profile Found</h3>
        <p className="text-xs">Link a child scout profile in the Household Profile tab to track their Road to Eagle.</p>
      </div>
    );
  }

  // Current Scout Progress Maps
  const sRanks = ranksProgressMap[activeScoutId] || {};
  const sMerit = meritProgressMap[activeScoutId] || {};
  const latestRank = getLatestAchievedRank(sRanks, scoutDoc.rank);

  // Group / Patrol Name
  const scoutPatrolName = 
    scoutDoc.patrol || 
    scoutDoc.patrolName || 
    scoutDoc.talia || 
    allGroups.find(g => g.id === scoutDoc.groupId)?.name || 
    'Al-Dhulfiqār Unit';

  // Badge Status Helper
  const getBadgeStatus = (badgeId) => {
    const rawId = badgeId;
    const normId = normalizeId(badgeId);
    const p = sMerit[rawId] || sMerit[normId];
    if (!p) return { status: 'not-started', label: 'Remaining', data: null };

    if (p.completed === true || p.dateCompleted) {
      return { 
        status: 'earned', 
        label: 'Earned', 
        data: p,
        date: p.dateCompleted || p.completedAt || 'Certified',
        counselor: p.counselorName || p.approvedByName || null
      };
    }

    const badge = MERIT_BADGES.find(b => normalizeId(b.id) === normId);
    if (badge && Array.isArray(badge.requirements) && badge.requirements.length > 0) {
      const approvedCount = badge.requirements.filter(r => {
        const stepVal = p.steps?.[r.id];
        return stepVal === true || stepVal?.completed === true;
      }).length;
      if (approvedCount === badge.requirements.length) {
        return { status: 'earned', label: 'Earned', data: p };
      }
      if (approvedCount > 0) {
        return { 
          status: 'in-progress', 
          label: `${approvedCount}/${badge.requirements.length} Reqs Done`, 
          data: p,
          count: approvedCount,
          total: badge.requirements.length
        };
      }
    }

    if (p.planned === true) {
      return { status: 'planned', label: 'Planned', data: p };
    }

    return { status: 'not-started', label: 'Remaining', data: null };
  };

  // Evaluate Solo Badges
  const soloEvaluated = MANDATORY_SOLO_BADGES.map(b => {
    const st = getBadgeStatus(b.id);
    return { ...b, ...st };
  });

  // Evaluate Choice Groups
  const groupsEvaluated = CHOICE_GROUPS.map(g => {
    const badges = g.badges.map(b => {
      const st = getBadgeStatus(b.id);
      return { ...b, ...st };
    });
    const earnedBadge = badges.find(b => b.status === 'earned');
    const inProgressBadge = badges.find(b => b.status === 'in-progress');
    const isEarned = !!earnedBadge;
    const isInProgress = !isEarned && !!inProgressBadge;
    return {
      ...g,
      badges,
      isEarned,
      isInProgress,
      earnedBadge,
      inProgressBadge
    };
  });

  // Eagle Required Counts
  const eagleSoloEarnedCount = soloEvaluated.filter(b => b.status === 'earned').length;
  const eagleGroupsEarnedCount = groupsEvaluated.filter(g => g.isEarned).length;
  const totalEagleRequiredEarned = eagleSoloEarnedCount + eagleGroupsEarnedCount;

  // Elective Merit Badges Evaluation
  const allEagleBadgeIds = new Set([
    ...MANDATORY_SOLO_BADGES.map(b => normalizeId(b.id)),
    ...CHOICE_GROUPS.flatMap(g => g.badges.map(b => normalizeId(b.id)))
  ]);

  const electiveBadges = MERIT_BADGES.filter(b => !allEagleBadgeIds.has(normalizeId(b.id)));
  const earnedElectives = electiveBadges.filter(b => getBadgeStatus(b.id).status === 'earned');
  const inProgressElectives = electiveBadges.filter(b => getBadgeStatus(b.id).status === 'in-progress');
  const plannedElectives = electiveBadges.filter(b => getBadgeStatus(b.id).status === 'planned');

  const totalElectivesEarned = earnedElectives.length;
  const totalMeritBadgesEarned = totalEagleRequiredEarned + totalElectivesEarned;

  // Eagle Palms Calculation (> 21 Merit Badges)
  const extraBadgesBeyond21 = Math.max(0, totalMeritBadgesEarned - 21);
  const totalPalmsEarned = Math.floor(extraBadgesBeyond21 / 5);
  const silverPalms = Math.floor(totalPalmsEarned / 3);
  const remainingAfterSilver = totalPalmsEarned % 3;
  const goldPalms = Math.floor(remainingAfterSilver / 2);
  const bronzePalms = remainingAfterSilver % 2;

  // Leadership Position & Tenure
  const pos = scoutDoc.positionOfResponsibility || {};
  const leadershipTitle = pos.title || scoutDoc.leadershipPosition || 'None Designated';
  const leadershipMonths = Number(pos.durationMonths) || (pos.startDate ? 6 : 0);
  const isLeadershipQualified = leadershipMonths >= 6 && leadershipTitle && leadershipTitle !== 'None Designated';

  // Project Roadmap State
  const p1 = projectRoadmap?.phase1 || scoutDoc.eagleProject || {};
  const p2 = projectRoadmap?.phase2 || {};
  const p3 = projectRoadmap?.phase3 || {};
  const p4 = projectRoadmap?.phase4 || {};
  const p5 = projectRoadmap?.phase5 || {};

  const p1Done = !!p1.completed || !!p1.title || !!scoutDoc.eagleProject?.title;
  const p2SignaturesCount = [
    p2.signatures?.beneficiary,
    p2.signatures?.scoutmaster,
    p2.signatures?.committee,
    p2.signatures?.district
  ].filter(Boolean).length;
  const p2Done = !!p2.completed || p2SignaturesCount === 4 || (scoutDoc.eagleProject?.proposalApprovedDate);

  const p3Done = !!p3.completed || (p3.checks?.stepByStepPlan && p3.checks?.materialsListFinal);
  const p4Done = !!p4.completed || (Array.isArray(p4.volunteerLogs) && p4.volunteerLogs.length > 0 && p4.checks?.photosDocumented);
  const p5Done = !!p5.completed || (p5.finalSignatures?.beneficiary && p5.finalSignatures?.scoutmaster) || scoutDoc.eagleProject?.status === 'completed';

  // Current Active Project Phase Determination
  let currentActivePhaseKey = 'phase1';
  let currentActivePhaseLabel = 'Phase 1: Concept & Beneficiary';
  if (p5Done) {
    currentActivePhaseKey = 'phase5';
    currentActivePhaseLabel = 'Phase 5: Completed & Approved';
  } else if (p4Done || (p4.volunteerLogs && p4.volunteerLogs.length > 0)) {
    currentActivePhaseKey = 'phase4';
    currentActivePhaseLabel = 'Phase 4: Execution & Volunteer Logs';
  } else if (p3Done || p3.budget) {
    currentActivePhaseKey = 'phase3';
    currentActivePhaseLabel = 'Phase 3: Fundraising & Planning';
  } else if (p2Done || p2SignaturesCount > 0) {
    currentActivePhaseKey = 'phase2';
    currentActivePhaseLabel = 'Phase 2: Proposal Approvals';
  }

  // Board of Review Status
  const isBorCompleted = !!scoutDoc.borApproved;
  const isSmConfCompleted = !!scoutDoc.smConferenceApproved;
  const isBorReady = !isBorCompleted && totalEagleRequiredEarned >= 14 && totalMeritBadgesEarned >= 21 && isLeadershipQualified && p5Done && isSmConfCompleted;

  // Rank Pacing Status
  const isStarEarned = sRanks['star']?.completed === true || ['star', 'life', 'eagle'].includes((scoutDoc.rank || '').toLowerCase());
  const isLifeEarned = sRanks['life']?.completed === true || ['life', 'eagle'].includes((scoutDoc.rank || '').toLowerCase());
  const isEagleEarned = sRanks['eagle']?.completed === true || isBorCompleted;

  // Overall Eagle Completion Percentage Engine (Weighted 6 Core Gates)
  let eagleProgressPct = 0;
  
  // 1. Ranks (up to 15%)
  if (isLifeEarned) eagleProgressPct += 15;
  else if (isStarEarned) eagleProgressPct += 8;

  // 2. Eagle Required Badges (up to 25%)
  eagleProgressPct += Math.min(25, Math.round((Math.min(14, totalEagleRequiredEarned) / 14) * 25));

  // 3. Electives (up to 10%)
  eagleProgressPct += Math.min(10, Math.round((Math.min(7, totalElectivesEarned) / 7) * 10));

  // 4. Leadership (up to 15%)
  if (isLeadershipQualified) eagleProgressPct += 15;
  else if (leadershipMonths > 0) eagleProgressPct += Math.min(15, Math.round((leadershipMonths / 6) * 15));

  // 5. Project (up to 20%)
  if (p1Done) eagleProgressPct += 4;
  if (p2Done) eagleProgressPct += 4;
  if (p3Done) eagleProgressPct += 4;
  if (p4Done) eagleProgressPct += 4;
  if (p5Done) eagleProgressPct += 4;

  // 6. References & BOR (up to 15%)
  if (Array.isArray(scoutDoc.eagleReferences) && scoutDoc.eagleReferences.length >= 4) eagleProgressPct += 3;
  if (scoutDoc.statementOfAmbitions && scoutDoc.statementOfAmbitions.length > 20) eagleProgressPct += 2;
  if (isSmConfCompleted) eagleProgressPct += 5;
  if (isBorCompleted) eagleProgressPct += 5;

  eagleProgressPct = Math.min(100, Math.max(0, eagleProgressPct));

  // Target Date & 18th Birthday Countdown
  const targetDateStr = scoutDoc.targetEagleDate || scoutDoc.targetDate || '';
  let targetRemainingText = 'Not specified';
  if (targetDateStr) {
    try {
      const targetD = new Date(targetDateStr);
      const nowD = new Date();
      const diffMs = targetD - nowD;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 0) targetRemainingText = `Passed (${Math.abs(diffDays)}d ago)`;
      else if (diffDays === 0) targetRemainingText = 'Target is Today!';
      else if (diffDays < 30) targetRemainingText = `${diffDays} days remaining`;
      else {
        const months = Math.floor(diffDays / 30.4);
        targetRemainingText = `${months} month${months === 1 ? '' : 's'} remaining (${new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`;
      }
    } catch {
      targetRemainingText = targetDateStr;
    }
  }

  // Calculate Volunteer Hours for Phase 4
  const volunteerLogs = Array.isArray(p4.volunteerLogs) ? p4.volunteerLogs : [];
  const totalYouthHours = volunteerLogs
    .filter(v => (v.role || '').toLowerCase().includes('youth') || (v.role || '').toLowerCase().includes('scout'))
    .reduce((acc, v) => acc + (parseFloat(v.hours) || 0), 0);
  const totalAdultHours = volunteerLogs
    .filter(v => (v.role || '').toLowerCase().includes('adult') || (v.role || '').toLowerCase().includes('leader') || (v.role || '').toLowerCase().includes('parent'))
    .reduce((acc, v) => acc + (parseFloat(v.hours) || 0), 0);
  const totalServiceHours = volunteerLogs.reduce((acc, v) => acc + (parseFloat(v.hours) || 0), 0) || (parseFloat(scoutDoc.eagleProject?.volunteerHours) || 0);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* ── TOP SCOUT SWITCHER PILLS (If Multiple Scouts) ── */}
      {linkedScouts.length > 1 && (
        <div className="bg-slate-900 border border-slate-750 p-2.5 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black text-slate-400 px-2 flex items-center gap-1">
              <Users size={12} className="text-emerald-400" />
              <span>Select Scout:</span>
            </span>
            {linkedScouts.map(scout => {
              const isSelected = scout.uid === activeScoutId;
              const sRank = getLatestAchievedRank(ranksProgressMap[scout.uid] || {}, scout.rank);
              return (
                <button
                  key={scout.uid}
                  type="button"
                  onClick={() => onSelectScout && onSelectScout(scout.uid)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 scale-[1.02]'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-950/60 border border-white/20 flex items-center justify-center text-[10px] font-black shrink-0 uppercase">
                    {scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}
                  </div>
                  <span>{scout.fullName || scout.username}</span>
                  <span className="text-[10px] opacity-75 font-mono">({sRank.name})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 1. SCOUT SUMMARY BANNER & EAGLE READINESS GAUGE ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/50 border border-slate-750 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 p-0.5 shadow-xl shadow-emerald-950/80 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-white uppercase">
                {scoutDoc.fullName?.charAt(0) || scoutDoc.username?.charAt(0) || '🦅'}
              </div>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
              <RankIcon rank={scoutDoc.rank || latestRank.id} size={14} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">
                {scoutDoc.fullName || scoutDoc.username}
              </h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
                <span>🦅 Road to Eagle</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap font-medium">
              <span className="flex items-center gap-1 text-emerald-400">
                <Award size={13} />
                <span>Current Rank: <strong>{latestRank.name}</strong></span>
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1 text-sky-300">
                <Shield size={13} />
                <span>Patrol: <strong>{scoutPatrolName}</strong></span>
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Calendar size={13} />
                <span>Target: <strong>{targetRemainingText}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Overall Eagle Readiness Ring / Metric */}
        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-750/80 p-4 rounded-2xl shrink-0 self-stretch lg:self-auto justify-between sm:justify-start">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${eagleProgressPct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black font-mono text-white">
              {eagleProgressPct}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Eagle Readiness Score
            </span>
            <span className="text-xs font-bold text-emerald-300 block">
              {eagleProgressPct >= 100 ? '🎉 All Requirements Met!' : eagleProgressPct >= 75 ? '🔥 Final Lap to Eagle' : eagleProgressPct >= 50 ? '📈 Pacing Strong' : '🌱 Building Foundation'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {totalMeritBadgesEarned}/21 MBs &bull; {p5Done ? 'Project Complete' : currentActivePhaseLabel.split(':')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HIGH-LEVEL EAGLE READINESS & PACING DASHBOARD ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* MILESTONE PACING TIMELINE (Star -> Life -> Eagle Gates) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Advancement Milestone Pacing</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Rank Pathway to Eagle Scout
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* GATE 1: STAR RANK */}
            <div className={`p-4 rounded-2xl border transition ${
              isStarEarned 
                ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200' 
                : 'bg-slate-900/70 border-slate-750 text-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-xs font-black text-white">Gate 1: Star Rank</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                  isStarEarned ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isStarEarned ? '✓ Certified' : 'In Progress'}
                </span>
              </div>
              <ul className="text-[11px] space-y-1 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className={totalMeritBadgesEarned >= 6 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {totalMeritBadgesEarned >= 6 ? '✓' : '○'} 6 Merit Badges ({totalEagleRequiredEarned >= 4 ? '✓ 4 Eagle-Req' : `${totalEagleRequiredEarned}/4 Eagle-Req`})
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={isStarEarned ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isStarEarned ? '✓' : '○'} 4 Months Active Service
                  </span>
                </li>
              </ul>
            </div>

            {/* GATE 2: LIFE RANK */}
            <div className={`p-4 rounded-2xl border transition ${
              isLifeEarned 
                ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200' 
                : isStarEarned 
                ? 'bg-amber-950/20 border-amber-800/60 text-amber-200' 
                : 'bg-slate-900/70 border-slate-750 text-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌱</span>
                  <span className="text-xs font-black text-white">Gate 2: Life Rank</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                  isLifeEarned ? 'bg-emerald-500 text-slate-950' : isStarEarned ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isLifeEarned ? '✓ Certified' : isStarEarned ? 'Active Gate' : 'Pending Star'}
                </span>
              </div>
              <ul className="text-[11px] space-y-1 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className={totalMeritBadgesEarned >= 11 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {totalMeritBadgesEarned >= 11 ? '✓' : '○'} 11 Merit Badges ({totalEagleRequiredEarned >= 7 ? '✓ 7 Eagle-Req' : `${totalEagleRequiredEarned}/7 Eagle-Req`})
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={isLifeEarned ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isLifeEarned ? '✓' : '○'} 6 Months Leadership & Service
                  </span>
                </li>
              </ul>
            </div>

            {/* GATE 3: EAGLE RANK */}
            <div className={`p-4 rounded-2xl border transition ${
              isEagleEarned 
                ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border-emerald-500 text-emerald-200' 
                : isLifeEarned 
                ? 'bg-amber-950/20 border-amber-500/60 text-amber-200' 
                : 'bg-slate-900/70 border-slate-750 text-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🦅</span>
                  <span className="text-xs font-black text-white">Gate 3: Eagle Scout</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                  isEagleEarned ? 'bg-emerald-500 text-slate-950 animate-pulse' : isBorReady ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isEagleEarned ? '🏅 Awarded!' : isBorReady ? 'Ready for BOR' : 'In Progress'}
                </span>
              </div>
              <ul className="text-[11px] space-y-1 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className={totalMeritBadgesEarned >= 21 && totalEagleRequiredEarned >= 14 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {totalMeritBadgesEarned >= 21 ? '✓' : '○'} 21 Merit Badges ({totalEagleRequiredEarned}/14 Eagle-Req)
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={p5Done ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {p5Done ? '✓' : '○'} Eagle Service Project & BOR
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* 4 KEY EAGLE GATE STATUS PILLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          
          {/* PILL 1: MERIT BADGES */}
          <div className="bg-slate-900/90 border border-slate-750 p-4 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Award size={13} className="text-amber-400" />
                <span>21 Merit Badges</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                totalMeritBadgesEarned >= 21 && totalEagleRequiredEarned >= 14
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {totalMeritBadgesEarned >= 21 ? 'Complete' : `${21 - totalMeritBadgesEarned} Left`}
              </span>
            </div>
            <div>
              <div className="text-xl font-black text-white font-mono">
                {totalMeritBadgesEarned} <span className="text-xs text-slate-400 font-sans">/ 21 Earned</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                <strong className="text-amber-300">{totalEagleRequiredEarned}</strong> of 14 Eagle-Req &bull; <strong className="text-sky-300">{totalElectivesEarned}</strong> of 7 Electives
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, (totalMeritBadgesEarned / 21) * 100)}%` }}
              />
            </div>
          </div>

          {/* PILL 2: LEADERSHIP TENURE */}
          <div className="bg-slate-900/90 border border-slate-750 p-4 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-emerald-400" />
                <span>Leadership Tenure</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                isLeadershipQualified
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isLeadershipQualified ? 'Qualified' : `${Math.max(0, 6 - leadershipMonths)} mo left`}
              </span>
            </div>
            <div>
              <div className="text-xl font-black text-white font-mono">
                {leadershipMonths} <span className="text-xs text-slate-400 font-sans">/ 6 Months</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                {leadershipTitle}
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, (leadershipMonths / 6) * 100)}%` }}
              />
            </div>
          </div>

          {/* PILL 3: EAGLE SERVICE PROJECT */}
          <div className="bg-slate-900/90 border border-slate-750 p-4 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <HardHat size={13} className="text-sky-400" />
                <span>Eagle Project</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                p5Done
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}>
                {p5Done ? 'Complete' : 'In Progress'}
              </span>
            </div>
            <div>
              <div className="text-sm font-black text-white truncate">
                {p5Done ? 'Phase 5: Approved' : currentActivePhaseLabel}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {p1.projectTitle || scoutDoc.eagleProject?.title || 'Title pending proposal'}
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${p5Done ? 100 : p4Done ? 80 : p3Done ? 60 : p2Done ? 40 : p1Done ? 20 : 5}%` }}
              />
            </div>
          </div>

          {/* PILL 4: EAGLE BOARD OF REVIEW */}
          <div className="bg-slate-900/90 border border-slate-750 p-4 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-purple-400" />
                <span>Eagle BOR</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                isBorCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isBorReady
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isBorCompleted ? 'Passed' : isBorReady ? 'Ready' : 'Locked'}
              </span>
            </div>
            <div>
              <div className="text-sm font-black text-white">
                {isBorCompleted ? 'Eagle Scout Certified' : isBorReady ? 'Ready to Schedule' : isSmConfCompleted ? 'SM Conf Passed' : 'Prerequisites Pending'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {scoutDoc.borDate ? `BOR Date: ${scoutDoc.borDate}` : 'Unit & District Board'}
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${isBorCompleted ? 'bg-emerald-500 w-full' : isBorReady ? 'bg-purple-500 w-3/4' : 'bg-slate-700 w-1/4'}`}
              />
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. READ-ONLY 5-PHASE EAGLE SERVICE PROJECT ROADMAP ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <HardHat size={18} className="text-sky-400" />
              <span>Eagle Scout Service Project Roadmap</span>
              <span className="text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                5 Phases
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Read-only transparent view of proposal approvals, budget, volunteer service hours, and execution milestones.
            </p>
          </div>

          <a
            href="https://filestore.scouting.org/filestore/pdf/512-927_fillable.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition self-start sm:self-center shrink-0"
          >
            <Download size={13} className="text-amber-400" />
            <span>Official BSA Workbook (PDF)</span>
          </a>
        </div>

        {/* Phase Accordion Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'phase1', label: '1. Concept', fullLabel: 'Phase 1: Concept & Beneficiary', isDone: p1Done, icon: Compass },
            { id: 'phase2', label: '2. Proposal', fullLabel: 'Phase 2: Proposal & Signatures', isDone: p2Done, icon: FileText },
            { id: 'phase3', label: '3. Planning', fullLabel: 'Phase 3: Fundraising & Planning', isDone: p3Done, icon: DollarSign },
            { id: 'phase4', label: '4. Execution', fullLabel: 'Phase 4: Execution & Hours', isDone: p4Done, icon: HardHat },
            { id: 'phase5', label: '5. Report', fullLabel: 'Phase 5: Final Report & BOR', isDone: p5Done, icon: ShieldCheck }
          ].map(ph => {
            const Icon = ph.icon;
            const isSelected = activeProjectPhase === ph.id;
            return (
              <button
                key={ph.id}
                type="button"
                onClick={() => setActiveProjectPhase(ph.id)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500 text-white shadow-lg shadow-sky-950/40'
                    : 'bg-slate-900/60 border-slate-750 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={14} className={isSelected ? 'text-sky-400' : 'text-slate-500'} />
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    ph.isDone ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {ph.isDone ? '✓ Done' : 'Pending'}
                  </span>
                </div>
                <span className="text-xs font-bold truncate block">{ph.label}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE PHASE INSPECTION CONTENT */}
        <div className="bg-slate-900/90 border border-slate-750 rounded-2xl p-5 space-y-4">
          
          {/* ── PHASE 1: CONCEPT ── */}
          {activeProjectPhase === 'phase1' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧭</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Phase 1: Project Concept & Beneficiary</h4>
                    <p className="text-xs text-slate-400">Selecting a qualified non-profit or community beneficiary.</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  p1Done ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {p1Done ? '✓ Concept Documented' : 'In Progress'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Project Scope</span>
                  <div className="space-y-1">
                    <span className="text-slate-400">Project Title:</span>
                    <p className="text-white font-bold text-sm">{p1.projectTitle || scoutDoc.eagleProject?.title || 'Not yet titled'}</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400">Concept & Community Impact:</span>
                    <p className="text-slate-300 leading-relaxed italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {p1.concept || 'Concept notes will appear here once saved in the scout or leader hub.'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Beneficiary Organization</span>
                  <div className="space-y-1">
                    <span className="text-slate-400">Organization / Facility:</span>
                    <p className="text-white font-bold">{p1.beneficiary || scoutDoc.eagleProject?.beneficiary || 'Not yet designated'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Contact Person:</span>
                      <strong className="text-slate-200">{p1.contactName || 'Pending'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone:</span>
                      <strong className="text-slate-200">{p1.contactPhone || 'Pending'}</strong>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 block text-[10px]">Email:</span>
                    <strong className="text-slate-200">{p1.contactEmail || 'Pending'}</strong>
                  </div>
                </div>
              </div>

              {/* Preliminary checks */}
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 flex items-center justify-around gap-2 text-xs flex-wrap">
                <span className={`flex items-center gap-1.5 ${p1.checks?.metBeneficiary ? 'text-emerald-300 font-bold' : 'text-slate-500'}`}>
                  {p1.checks?.metBeneficiary ? '✓' : '○'} Met with Beneficiary
                </span>
                <span className={`flex items-center gap-1.5 ${p1.checks?.lastingValue ? 'text-emerald-300 font-bold' : 'text-slate-500'}`}>
                  {p1.checks?.lastingValue ? '✓' : '○'} Lasting Community Value
                </span>
                <span className={`flex items-center gap-1.5 ${p1.checks?.notCommercialOrBsa ? 'text-emerald-300 font-bold' : 'text-slate-500'}`}>
                  {p1.checks?.notCommercialOrBsa ? '✓' : '○'} Non-Commercial / Non-BSA property
                </span>
              </div>
            </div>
          )}

          {/* ── PHASE 2: PROPOSAL & 4 MANDATORY SIGNATURES ── */}
          {activeProjectPhase === 'phase2' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Phase 2: Eagle Proposal & 4 Mandatory Approvals</h4>
                    <p className="text-xs text-slate-400">All 4 formal signatures must be secured before starting any physical work.</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  p2Done ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {p2Done ? '✓ All 4 Approvals Secured' : `${p2SignaturesCount} of 4 Signed`}
                </span>
              </div>

              {/* 4 Mandatory Signatures Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    title: '1. Beneficiary Rep',
                    isSigned: !!p2.signatures?.beneficiary || !!scoutDoc.eagleProject?.beneficiaryApproval,
                    name: p2.signatures?.beneficiaryName || 'Representative',
                    date: p2.signatures?.beneficiaryDate || scoutDoc.eagleProject?.proposalApprovedDate || 'Pending'
                  },
                  {
                    title: '2. Unit Leader / SM',
                    isSigned: !!p2.signatures?.scoutmaster || !!scoutDoc.eagleProject?.smApproval,
                    name: p2.signatures?.scoutmasterName || 'Scoutmaster',
                    date: p2.signatures?.scoutmasterDate || scoutDoc.eagleProject?.proposalApprovedDate || 'Pending'
                  },
                  {
                    title: '3. Committee Chair',
                    isSigned: !!p2.signatures?.committee || !!scoutDoc.eagleProject?.committeeApproval,
                    name: p2.signatures?.committeeName || 'Committee Chair',
                    date: p2.signatures?.committeeDate || scoutDoc.eagleProject?.proposalApprovedDate || 'Pending'
                  },
                  {
                    title: '4. District / Council',
                    isSigned: !!p2.signatures?.district || !!scoutDoc.eagleProject?.districtApproval,
                    name: p2.signatures?.districtName || 'District Board Rep',
                    date: p2.signatures?.districtDate || scoutDoc.eagleProject?.proposalApprovedDate || 'Pending'
                  }
                ].map((sig, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      sig.isSigned
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{sig.title}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        sig.isSigned ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {sig.isSigned ? '✓ Signed' : 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-0.5 text-[11px]">
                      <p className="text-slate-300 truncate">{sig.name}</p>
                      <p className="text-slate-500 font-mono text-[10px]">Date: {sig.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Proposal Sections Checklist */}
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Proposal Sections Complete</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <span className={p2.proposalSections?.description ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                    {p2.proposalSections?.description ? '✓' : '○'} Project Description
                  </span>
                  <span className={p2.proposalSections?.givingLeadership ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                    {p2.proposalSections?.givingLeadership ? '✓' : '○'} Giving Leadership Plan
                  </span>
                  <span className={p2.proposalSections?.materials ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                    {p2.proposalSections?.materials ? '✓' : '○'} Materials & Supplies
                  </span>
                  <span className={p2.proposalSections?.permits ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                    {p2.proposalSections?.permits ? '✓' : '○'} Permits & Permissions
                  </span>
                  <span className={p2.proposalSections?.costEstimate ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                    {p2.proposalSections?.costEstimate ? '✓' : '○'} Preliminary Cost Estimate
                  </span>
                  <span className={p2.proposalSections?.safetyPlan ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                    {p2.proposalSections?.safetyPlan ? '✓' : '○'} Safety & First Aid Plan
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── PHASE 3: FUNDRAISING & PLANNING ── */}
          {activeProjectPhase === 'phase3' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Phase 3: Fundraising & Detailed Project Plan</h4>
                    <p className="text-xs text-slate-400">Budget management, step-by-step logistics, and tool checklists.</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  p3Done ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {p3Done ? '✓ Plan Formulated' : 'Planning in Progress'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget vs Raised Card */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Financial Overview</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ${p3.fundsRaised || 0} Raised / ${p3.budget || 0} Estimated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Estimated Budget:</span>
                      <span className="text-white font-mono font-black text-base">${p3.budget || '0.00'}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Funds Collected:</span>
                      <span className="text-emerald-400 font-mono font-black text-base">${p3.fundsRaised || '0.00'}</span>
                    </div>
                  </div>

                  {p3.needsFundraising && (
                    <div className="text-[11px] bg-amber-950/20 border border-amber-800/40 p-2.5 rounded-lg text-amber-300 flex items-center justify-between">
                      <span>Council Fundraising Application Status:</span>
                      <strong className={p3.fundraisingApproved ? 'text-emerald-300' : 'text-amber-400'}>
                        {p3.fundraisingApproved ? '✓ Approved by Council' : 'Pending Council Sign-off'}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Planning Checkpoints Card */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2.5 text-xs">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Planning Readiness</span>
                  <div className="space-y-2">
                    <div className={`p-2 rounded-lg border flex items-center justify-between ${
                      p3.checks?.stepByStepPlan ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span>Step-by-Step Execution Plan Completed</span>
                      <span className="font-mono text-[10px]">{p3.checks?.stepByStepPlan ? '✓ Done' : '○ Pending'}</span>
                    </div>
                    <div className={`p-2 rounded-lg border flex items-center justify-between ${
                      p3.checks?.materialsListFinal ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span>Final Materials & Donated Supplies List</span>
                      <span className="font-mono text-[10px]">{p3.checks?.materialsListFinal ? '✓ Done' : '○ Pending'}</span>
                    </div>
                    <div className={`p-2 rounded-lg border flex items-center justify-between ${
                      p3.checks?.toolsListFinal ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span>Tools & Equipment Safety Check</span>
                      <span className="font-mono text-[10px]">{p3.checks?.toolsListFinal ? '✓ Done' : '○ Pending'}</span>
                    </div>
                    <div className={`p-2 rounded-lg border flex items-center justify-between ${
                      p3.checks?.safetyFirstAidKit ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span>First Aid Kit & Emergency Contacts on Site</span>
                      <span className="font-mono text-[10px]">{p3.checks?.safetyFirstAidKit ? '✓ Done' : '○ Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PHASE 4: EXECUTION & VOLUNTEER SERVICE HOURS ── */}
          {activeProjectPhase === 'phase4' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔨</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Phase 4: Leadership, Execution & Service Log</h4>
                    <p className="text-xs text-slate-400">Directing volunteer workdays, documenting progress, and logging hours.</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  p4Done ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {p4Done ? '✓ Execution Documented' : `${volunteerLogs.length} Logs Recorded`}
                </span>
              </div>

              {/* Volunteer Service Hours Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Total Service Hours</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{totalServiceHours.toFixed(1)} hrs</span>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Youth Scout Hours</span>
                  <span className="text-lg font-black text-sky-400 font-mono">{totalYouthHours.toFixed(1)} hrs</span>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Adult / Leader Hours</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{totalAdultHours.toFixed(1)} hrs</span>
                </div>
              </div>

              {/* Volunteer Logs Table */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Users size={13} className="text-sky-400" />
                    <span>Volunteer Workday Log ({volunteerLogs.length} entries)</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">Certified by Scout</span>
                </div>

                {volunteerLogs.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No volunteer workdays logged yet. Entries recorded in the scout hub will appear here automatically.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80 max-h-56 overflow-y-auto">
                    {volunteerLogs.map((log, idx) => (
                      <div key={log.id || idx} className="p-3 text-xs flex items-center justify-between gap-3 hover:bg-slate-900/40">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <strong className="text-white">{log.volunteerName || 'Volunteer'}</strong>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-full font-mono">
                              {log.role || 'Youth Scout'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] truncate">{log.task || 'General project service work'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-emerald-400 font-bold font-mono text-sm">{log.hours} hrs</span>
                          <span className="text-slate-500 block text-[10px] font-mono">{log.date || '—'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PHASE 5: FINAL REPORT & SIGN-OFFS ── */}
          {activeProjectPhase === 'phase5' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Phase 5: Project Final Report & Completion Sign-Offs</h4>
                    <p className="text-xs text-slate-400">Post-project reflection, final financial accounting, and closing approvals.</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  p5Done ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {p5Done ? '✓ Project Fully Approved' : 'Wrap-Up in Progress'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Final Reflections</span>
                  <div className="space-y-1">
                    <span className="text-slate-400">Project Summary:</span>
                    <p className="text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                      {p5.finalReportText || 'Final project summary will appear here once written.'}
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400">Leadership Challenges Overcome:</span>
                    <p className="text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                      {p5.leadershipChallengesText || 'Leadership reflections will appear here.'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Completion Approvals & Accounting</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Final Project Cost:</span>
                      <strong className="text-emerald-400 font-mono text-base">${p5.finalCost || p3.budget || '0.00'}</strong>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Total Service Hours:</span>
                      <strong className="text-sky-400 font-mono text-base">{totalServiceHours.toFixed(1)} hrs</strong>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                      p5.finalSignatures?.beneficiary ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <div>
                        <span className="font-bold text-white block">Beneficiary Final Sign-off</span>
                        <span className="text-[10px] text-slate-500 font-mono">Date: {p5.finalSignatures?.beneficiaryDate || 'Pending'}</span>
                      </div>
                      <span className="font-mono text-[10px]">{p5.finalSignatures?.beneficiary ? '✓ Signed' : '○ Pending'}</span>
                    </div>

                    <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                      p5.finalSignatures?.scoutmaster ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <div>
                        <span className="font-bold text-white block">Scoutmaster Final Sign-off</span>
                        <span className="text-[10px] text-slate-500 font-mono">Date: {p5.finalSignatures?.scoutmasterDate || 'Pending'}</span>
                      </div>
                      <span className="font-mono text-[10px]">{p5.finalSignatures?.scoutmaster ? '✓ Signed' : '○ Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── 4. 21 MERIT BADGES ROADMAP MATRIX ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              <span>21 Merit Badges Roadmap Matrix</span>
              <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {totalMeritBadgesEarned} of 21 Complete
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              14 mandatory Eagle-required badges + 7 elective merit badges required for the Eagle Rank.
            </p>
          </div>

          {/* Sub-tab view mode */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-750 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setBadgeViewMode('eagle_required')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                badgeViewMode === 'eagle_required' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Eagle-Required ({totalEagleRequiredEarned}/14)
            </button>
            <button
              type="button"
              onClick={() => setBadgeViewMode('electives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                badgeViewMode === 'electives' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Electives & Palms ({totalElectivesEarned}/7)
            </button>
          </div>
        </div>

        {/* ── VIEW MODE 1: 14 EAGLE-REQUIRED MATRIX ── */}
        {badgeViewMode === 'eagle_required' && (
          <div className="space-y-5">
            
            {/* 11 SOLO MANDATORY BADGES */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  11 Core Mandatory Badges ({eagleSoloEarnedCount}/11 Earned)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">No substitutions permitted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {soloEvaluated.map(badge => {
                  const isDone = badge.status === 'earned';
                  const isInProg = badge.status === 'in-progress';
                  const isPlan = badge.status === 'planned';
                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
                          : isInProg
                          ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                          : isPlan
                          ? 'bg-sky-950/20 border-sky-800/50 text-sky-200'
                          : 'bg-slate-900/60 border-slate-755 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{badge.icon}</span>
                          <div className="min-w-0">
                            <strong className="text-white text-xs block truncate">{badge.name}</strong>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {isDone ? `Earned: ${badge.date || 'Certified'}` : isInProg ? badge.label : isPlan ? 'Planned in Roadmap' : 'Not Started'}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isDone
                            ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                            : isInProg
                            ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                            : isPlan
                            ? 'bg-sky-900/80 text-sky-300 border border-sky-700'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isDone ? '✓ Earned' : isInProg ? 'In Progress' : isPlan ? 'Planned' : 'Remaining'}
                        </span>
                      </div>

                      {/* Time Alert Note */}
                      {badge.timeAlert && (
                        <div className="text-[10px] bg-black/30 px-2.5 py-1 rounded-lg text-amber-300/90 flex items-center gap-1.5">
                          <Clock size={11} className="shrink-0 text-amber-400" />
                          <span className="truncate">{badge.timeAlert}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 ALTERNATE CHOICE GROUPS */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  3 Choice Groups (1 Required From Each Group &bull; {eagleGroupsEarnedCount}/3 Completed)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Excess badges count as Electives</span>
              </div>

              <div className="space-y-3">
                {groupsEvaluated.map((group, gIdx) => (
                  <div
                    key={group.groupId}
                    className={`p-4 rounded-2xl border ${
                      group.isEarned
                        ? 'bg-emerald-950/15 border-emerald-800/50'
                        : group.isInProgress
                        ? 'bg-amber-950/15 border-amber-800/50'
                        : 'bg-slate-900/60 border-slate-755'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Group {gIdx + 1}: {group.groupName}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        group.isEarned
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                          : group.isInProgress
                          ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {group.isEarned ? `✓ Met with ${group.earnedBadge?.name}` : 'Choice Slot Open'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {group.badges.map(b => {
                        const isDone = b.status === 'earned';
                        const isInProg = b.status === 'in-progress';
                        return (
                          <div
                            key={b.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                              isDone
                                ? 'bg-emerald-900/40 border-emerald-700 text-emerald-200 font-bold'
                                : isInProg
                                ? 'bg-amber-900/40 border-amber-700 text-amber-200'
                                : 'bg-slate-950/50 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{b.icon}</span>
                              <span>{b.name}</span>
                            </span>
                            <span className="text-[10px] font-mono">
                              {isDone ? '✓ Earned' : isInProg ? 'In Progress' : '○'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── VIEW MODE 2: ELECTIVES & PALMS ── */}
        {badgeViewMode === 'electives' && (
          <div className="space-y-5">
            
            {/* Electives Summary Card */}
            <div className="bg-slate-900/80 border border-slate-750 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>7 Elective Merit Badges ({totalElectivesEarned} of 7 Earned)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Any additional merit badges explored beyond the 14 Eagle-required categories.
                </p>
              </div>

              <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border self-start sm:self-center shrink-0 ${
                totalElectivesEarned >= 7
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                  : 'bg-amber-950/60 text-amber-300 border-amber-700'
              }`}>
                {totalElectivesEarned >= 7 ? '✓ 7 Electives Complete' : `${7 - totalElectivesEarned} More Needed`}
              </span>
            </div>

            {/* Earned & In Progress Electives List */}
            {earnedElectives.length === 0 && inProgressElectives.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
                No elective merit badges started yet. Badges earned by the scout outside the 14 mandatory list will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {earnedElectives.map(b => (
                  <div key={b.id} className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-bold text-white truncate">{b.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0 font-bold">✓ Earned</span>
                  </div>
                ))}
                {inProgressElectives.map(b => (
                  <div key={b.id} className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs flex items-center justify-between">
                    <span className="text-slate-300 truncate">{b.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 shrink-0">In Progress</span>
                  </div>
                ))}
              </div>
            )}

            {/* Eagle Palms Showcase (If > 21 Merit Badges) */}
            <div className="bg-gradient-to-r from-slate-900 to-amber-950/30 border border-amber-500/30 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌴</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Eagle Palms Recognition</h4>
                    <p className="text-xs text-slate-400">Awarded for every 5 merit badges earned beyond the 21 Eagle requirement.</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {totalMeritBadgesEarned > 21 ? `${totalMeritBadgesEarned - 21} Extra Badges` : '0 Palms (Need > 21)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <span className="text-lg block">🥉</span>
                  <span className="text-xs font-bold text-white block">Bronze Palms (5 MBs)</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{bronzePalms} Earned</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <span className="text-lg block">🥇</span>
                  <span className="text-xs font-bold text-white block">Gold Palms (10 MBs)</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{goldPalms} Earned</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <span className="text-lg block">🥈</span>
                  <span className="text-xs font-bold text-white block">Silver Palms (15 MBs)</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{silverPalms} Earned</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── 5. OFFICIAL GUIDELINES & PARENT COACHING CARD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* DOWNLOADABLE OFFICIAL BSA RESOURCES */}
        <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-750 pb-3">
            <Download size={18} className="text-amber-400" />
            <h3 className="font-extrabold text-white text-base">Official Eagle Documents</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Download official, fillable BSA publications required for the Eagle Scout Board of Review.
          </p>

          <div className="space-y-2.5">
            <a
              href="https://filestore.scouting.org/filestore/pdf/512-927_fillable.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-750 hover:border-amber-500/50 rounded-2xl flex items-center justify-between text-xs transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white group-hover:text-amber-300 block">Eagle Project Workbook</span>
                <span className="text-[10px] text-slate-500 font-mono">Publication 512-927 (Fillable PDF)</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 group-hover:text-amber-300 shrink-0" />
            </a>

            <a
              href="https://filestore.scouting.org/filestore/pdf/512-728_WB_fillable.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-750 hover:border-amber-500/50 rounded-2xl flex items-center justify-between text-xs transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white group-hover:text-amber-300 block">Eagle Scout Rank Application</span>
                <span className="text-[10px] text-slate-500 font-mono">Publication 512-728 (Fillable PDF)</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 group-hover:text-amber-300 shrink-0" />
            </a>

            <a
              href="https://www.scouting.org/skills/merit-badges/"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-750 hover:border-amber-500/50 rounded-2xl flex items-center justify-between text-xs transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white group-hover:text-amber-300 block">Official Merit Badge Library</span>
                <span className="text-[10px] text-slate-500 font-mono">Scouting.org Complete Requirements</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 group-hover:text-amber-300 shrink-0" />
            </a>
          </div>
        </div>

        {/* PARENT COACHING & ENCOURAGEMENT CARD (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-850 via-slate-850 to-emerald-950/30 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-750 pb-3">
            <span className="text-xl">💡</span>
            <div>
              <h3 className="font-extrabold text-white text-base">How Parents Can Support the Eagle Journey</h3>
              <p className="text-xs text-slate-400">Best practices for guiding your scout to self-reliance and leadership.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            
            <div className="bg-slate-900/70 border border-slate-750 p-3.5 rounded-2xl space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>🛡️</span> Sounding Board, Not Project Manager
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Allow your scout to lead communications with the beneficiary, scoutmaster, and council representatives. The goal is personal leadership growth.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-750 p-3.5 rounded-2xl space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>⏱️</span> Track 90-Day Merit Badges Early
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>Personal Fitness</strong>, <strong>Personal Management</strong>, and <strong>Family Life</strong> each require 3 consecutive months of daily logs. Help establish weekly tracking routines.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-750 p-3.5 rounded-2xl space-y-1">
              <span className="font-bold text-sky-300 flex items-center gap-1.5">
                <span>📋</span> Respect Project Signature Order
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Ensure all 4 proposal signatures (Beneficiary, Scoutmaster, Committee, and District) are formally certified before starting any fundraising or construction.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-750 p-3.5 rounded-2xl space-y-1">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <span>🎉</span> Celebrate Every Rank Gate
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Advancing through Star and Life ranks builds essential stamina. Celebrate each milestone and board of review as major stepping stones to the Eagle capstone.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
