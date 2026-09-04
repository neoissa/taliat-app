import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK, TOTAL_MERIT_BADGES_FOR_EAGLE } from '../data/meritBadges';
import { RANKS_DATA } from '../data/ranksData';
import {
  Award,
  Star,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  User,
  Users,
  ShieldCheck,
  Shield,
  FileText,
  CheckSquare,
  AlertTriangle,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  Flame,
  Check,
  Save,
  Printer,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Compass,
  Search,
  X
} from 'lucide-react';
import RankIcon from './RankIcon';
import EagleProjectRoadmap from './EagleProjectRoadmap';

const QUALIFYING_LEADERSHIP_POSITIONS = [
  { title: 'Senior Patrol Leader (SPL)', troop: true, qualifies: true },
  { title: 'Assistant Senior Patrol Leader (ASPL)', troop: true, qualifies: true },
  { title: 'Patrol Leader', troop: true, qualifies: true },
  { title: 'Troop Guide', troop: true, qualifies: true },
  { title: 'Order of the Arrow Troop Representative', troop: true, qualifies: true },
  { title: 'Den Chief', troop: true, qualifies: true },
  { title: 'Scribe', troop: true, qualifies: true },
  { title: 'Librarian', troop: true, qualifies: true },
  { title: 'Historian', troop: true, qualifies: true },
  { title: 'Quartermaster', troop: true, qualifies: true },
  { title: 'Junior Assistant Scoutmaster (JASM)', troop: true, qualifies: true },
  { title: 'Chaplain Aide', troop: true, qualifies: true },
  { title: 'Instructor', troop: true, qualifies: true },
  { title: 'Webmaster', troop: true, qualifies: true },
  { title: 'Outdoor Ethics Guide', troop: true, qualifies: true }
];

const DEFAULT_REFERENCES = [
  { type: '1. Parents / Guardians', name: '', address: '', phone: '', email: '' },
  { type: '2. Religious Reference (or parent statement if unaffiliated)', name: '', address: '', phone: '', email: '' },
  { type: '3. Educational Reference (Principal / Teacher)', name: '', address: '', phone: '', email: '' },
  { type: '4. Employer (if employed, or N/A)', name: '', address: '', phone: '', email: '' },
  { type: '5. Personal Reference 1 (Character)', name: '', address: '', phone: '', email: '' },
  { type: '6. Personal Reference 2 (Character)', name: '', address: '', phone: '', email: '' }
];

const RECOMMENDED_BADGES_DATA = [
  { id: 'wilderness-survival', name: 'Wilderness Survival', category: 'Outdoors', highlight: 'Build natural shelters & survive overnight' },
  { id: 'robotics', name: 'Robotics', category: 'STEM', highlight: 'Design, build and code autonomous robots' },
  { id: 'chess', name: 'Chess', category: 'Strategy', highlight: 'Tactics, strategies, and tournament play' },
  { id: 'astronomy', name: 'Astronomy', category: 'STEM', highlight: 'Telescopes, night sky mapping & stars' },
  { id: 'woodwork', name: 'Woodwork', category: 'Trades', highlight: 'Hand tools, joinery, and crafting projects' },
  { id: 'archery', name: 'Archery', category: 'Outdoors', highlight: 'Bows, arrows, range safety, and marksmanship' },
  { id: 'programming', name: 'Programming', category: 'STEM', highlight: 'Software algorithms, Python/JS, and web tech' },
  { id: 'pioneering', name: 'Pioneering', category: 'Outdoors', highlight: 'Rope lashings, bridges, and camp towers' },
  { id: 'leatherwork', name: 'Leatherwork', category: 'Trades', highlight: 'Carving, stitching, and tooling leather gear' },
  { id: 'public-speaking', name: 'Public Speaking', category: 'Leadership', highlight: 'Speeches, storytelling, and debate skills' },
  { id: 'automotive-maintenance', name: 'Automotive Maintenance', category: 'Trades', highlight: 'Engines, tires, fluids, and car safety' },
  { id: 'orienteering', name: 'Orienteering', category: 'Outdoors', highlight: 'Map & compass navigation in rugged terrain' },
  { id: 'photography', name: 'Photography', category: 'Arts', highlight: 'Visual storytelling, lighting, and camera modes' },
  { id: 'electricity', name: 'Electricity', category: 'STEM', highlight: 'Circuits, wiring safety, and electromagnets' }
];

// Helper to normalize badge ID matching
function normalizeId(id = '') {
  return id.toLowerCase().replace(/_/g, '-');
}

export default function RoadToEagleGuide({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  // For Leaders: Scout selection
  const [allScouts, setAllScouts] = useState([]);
  const [selectedScoutId, setSelectedScoutId] = useState(currentUser?.uid);

  // Active Scout Data & Firestore subscriptions
  const activeScoutId = isLeaderOrOwner ? (selectedScoutId || currentUser?.uid) : currentUser?.uid;
  const [scoutProfile, setScoutProfile] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Active Milestone Tab: 'tenure' | 'leadership' | 'badges' | 'project' | 'references' | 'bor' | 'palms'
  const [activeMilestone, setActiveMilestone] = useState('badges');

  // Elective Modal Picker State
  const [showElectiveModal, setShowElectiveModal] = useState(false);
  const [electiveSearch, setElectiveSearch] = useState('');
  const [recommendedCategory, setRecommendedCategory] = useState('All');

  // Milestone 1: Tenure
  const [lifeBorDate, setLifeBorDate] = useState('');
  const [joinedTroopDate, setJoinedTroopDate] = useState('');
  const [activeTenureChecklist, setActiveTenureChecklist] = useState({
    regularAttendance: false,
    scoutSpirit: false,
    activeRegistration: true
  });

  // Milestone 2: Leadership
  const [leadershipRole, setLeadershipRole] = useState(QUALIFYING_LEADERSHIP_POSITIONS[0].title);
  const [leadershipStartDate, setLeadershipStartDate] = useState('');
  const [leadershipEndDate, setLeadershipEndDate] = useState('');
  const [leadershipMonths, setLeadershipMonths] = useState(6);
  const [leadershipApproved, setLeadershipApproved] = useState(false);

  // Milestone 4: Eagle Project & Volunteer Hours
  const [projectTitle, setProjectTitle] = useState('');
  const [projectBeneficiary, setProjectBeneficiary] = useState('');
  const [projectBeneficiaryContact, setProjectBeneficiaryContact] = useState('');
  const [projectStage, setProjectStage] = useState('proposal'); // 'concept' | 'proposal' | 'fundraising' | 'execution' | 'report'
  const [beneficiaryApproved, setBeneficiaryApproved] = useState(false);
  const [smApproved, setSmApproved] = useState(false);
  const [committeeApproved, setCommitteeApproved] = useState(false);
  const [districtApproved, setDistrictApproved] = useState(false);
  const [workbookCompleted, setWorkbookCompleted] = useState(false);
  const [finalReportSigned, setFinalReportSigned] = useState(false);
  const [volunteerLogs, setVolunteerLogs] = useState([]);
  const [newVolName, setNewVolName] = useState('');
  const [newVolDate, setNewVolDate] = useState(new Date().toISOString().split('T')[0]);
  const [newVolHours, setNewVolHours] = useState('');
  const [newVolCategory, setNewVolCategory] = useState('Youth Scout');

  // Milestone 5: References & Ambitions
  const [references, setReferences] = useState(DEFAULT_REFERENCES);
  const [statementOfAmbitions, setStatementOfAmbitions] = useState('');

  // Milestone 6: Application, Conference & BOR
  const [appCompleted, setAppCompleted] = useState(false);
  const [smConferenceDate, setSmConferenceDate] = useState('');
  const [smConferenceSigned, setSmConferenceSigned] = useState(false);
  const [councilVerified, setCouncilVerified] = useState(false);
  const [borDate, setBorDate] = useState('');
  const [borPassed, setBorPassed] = useState(false);

  // 1. Fetch all scouts for Leader dropdown
  useEffect(() => {
    if (!isLeaderOrOwner) return;
    const fetchScouts = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'scout'));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setAllScouts(list);
        if (list.length > 0 && !selectedScoutId) {
          setSelectedScoutId(list[0].uid);
        }
      } catch (err) {
        console.warn('Fallback fetching scouts list:', err);
      }
    };
    fetchScouts();
  }, [isLeaderOrOwner]);

  // 2. Real-time Subscription to Scout Profile & Eagle Data
  useEffect(() => {
    if (!activeScoutId) return;

    const unsubUser = onSnapshot(doc(db, 'users', activeScoutId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setScoutProfile(data);
        setLifeBorDate(data.activeTenureStartDate || data.lifeRankDate || '');
        setJoinedTroopDate(data.joinedTroopDate || '');

        // Leadership
        if (data.positionOfResponsibility) {
          setLeadershipRole(data.positionOfResponsibility.title || QUALIFYING_LEADERSHIP_POSITIONS[0].title);
          setLeadershipStartDate(data.positionOfResponsibility.startDate || '');
          setLeadershipEndDate(data.positionOfResponsibility.endDate || '');
          setLeadershipMonths(data.positionOfResponsibility.durationMonths || 6);
          setLeadershipApproved(!!data.positionOfResponsibility.approved);
        }

        // Project
        if (data.eagleProject) {
          setProjectTitle(data.eagleProject.title || '');
          setProjectBeneficiary(data.eagleProject.beneficiary || '');
          setProjectBeneficiaryContact(data.eagleProject.beneficiaryContact || '');
          setProjectStage(data.eagleProject.stage || 'proposal');
          setBeneficiaryApproved(!!data.eagleProject.beneficiaryApproval);
          setSmApproved(!!data.eagleProject.smApproval);
          setCommitteeApproved(!!data.eagleProject.committeeApproval);
          setDistrictApproved(!!data.eagleProject.districtApproval);
          setWorkbookCompleted(!!data.eagleProject.workbookCompleted);
          setFinalReportSigned(!!data.eagleProject.finalReportSigned);
          if (Array.isArray(data.eagleProject.volunteerLogs)) {
            setVolunteerLogs(data.eagleProject.volunteerLogs);
          }
        }

        // References
        if (Array.isArray(data.eagleReferences) && data.eagleReferences.length === 6) {
          setReferences(data.eagleReferences);
        }

        // Ambitions
        setStatementOfAmbitions(data.statementOfAmbitions || '');

        // Final BOR
        setAppCompleted(!!data.eagleAppCompleted);
        setSmConferenceDate(data.smConferenceDate || '');
        setSmConferenceSigned(!!data.smConferenceApproved);
        setCouncilVerified(!!data.councilVerified);
        setBorDate(data.borDate || '');
        setBorPassed(!!data.borApproved);
      }
    });

    // 3. Real-time Subscription to Merit Badges Progress
    const unsubBadges = onSnapshot(collection(db, 'user_progress', activeScoutId, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { 
        map[d.id] = d.data();
        map[normalizeId(d.id)] = d.data();
      });
      setMeritProgress(map);
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubBadges();
    };
  }, [activeScoutId]);

  // ── REAL-TIME BADGE STATUS HELPER ──
  const getBadgeStatus = (badgeId) => {
    const rawId = badgeId;
    const normId = normalizeId(badgeId);
    const p = meritProgress[rawId] || meritProgress[normId];
    if (!p) return 'not-started';

    if (p.completed === true || p.dateCompleted) return 'earned';

    const badge = MERIT_BADGES.find(b => normalizeId(b.id) === normId);
    if (badge && Array.isArray(badge.requirements) && badge.requirements.length > 0) {
      const approvedCount = badge.requirements.filter(r => {
        const stepVal = p.steps?.[r.id];
        return stepVal === true || stepVal?.completed === true;
      }).length;
      if (approvedCount === badge.requirements.length) return 'earned';
      if (approvedCount > 0) return 'in-progress';
    }

    if (p.planned === true) return 'planned';
    return 'not-started';
  };

  const isBadgeEarned = (badgeId) => getBadgeStatus(badgeId) === 'earned';
  const isBadgePlanned = (badgeId) => getBadgeStatus(badgeId) === 'planned';
  const isBadgeInProgress = (badgeId) => getBadgeStatus(badgeId) === 'in-progress';

  // Toggle Planned state directly in real-time
  const handleTogglePlanned = async (badgeId, currentlyPlanned) => {
    const normId = normalizeId(badgeId);
    const ref = doc(db, 'user_progress', activeScoutId, 'merit_badges', normId);
    const existing = meritProgress[normId] || meritProgress[badgeId] || {};
    try {
      await setDoc(ref, {
        ...existing,
        planned: !currentlyPlanned,
        plannedAt: !currentlyPlanned ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error toggling planned badge in RoadToEagleGuide:", err);
    }
  };

  // 14 Mandatory Eagle Categories
  const mandatory11Solo = [
    { id: 'first-aid', name: 'First Aid' },
    { id: 'citizenship-in-the-community', name: 'Citizenship in the Community' },
    { id: 'citizenship-in-the-nation', name: 'Citizenship in the Nation' },
    { id: 'citizenship-in-society', name: 'Citizenship in Society' },
    { id: 'citizenship-in-the-world', name: 'Citizenship in the World' },
    { id: 'communication', name: 'Communication' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'personal-fitness', name: 'Personal Fitness' },
    { id: 'personal-management', name: 'Personal Management' },
    { id: 'camping', name: 'Camping' },
    { id: 'family-life', name: 'Family Life' }
  ];

  const groupA = [
    { id: 'emergency-preparedness', name: 'Emergency Preparedness' },
    { id: 'lifesaving', name: 'Lifesaving' }
  ];

  const groupB = [
    { id: 'environmental-science', name: 'Environmental Science' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  const groupC = [
    { id: 'swimming', name: 'Swimming' },
    { id: 'hiking', name: 'Hiking' },
    { id: 'cycling', name: 'Cycling' }
  ];

  const soloEvaluated = mandatory11Solo.map(b => {
    const status = getBadgeStatus(b.id);
    const fullBadge = MERIT_BADGES.find(mb => normalizeId(mb.id) === normalizeId(b.id));
    return {
      ...b,
      status,
      earned: status === 'earned',
      planned: status === 'planned',
      inProgress: status === 'in-progress',
      pamphletSku: fullBadge?.pamphletSku,
      pamphletUrl: fullBadge?.pamphletUrl,
      timeAlert: fullBadge?.timeAlert
    };
  });

  const evaluateGroup = (name, badgesList) => {
    const badges = badgesList.map(b => {
      const status = getBadgeStatus(b.id);
      const fullBadge = MERIT_BADGES.find(mb => normalizeId(mb.id) === normalizeId(b.id));
      return {
        ...b,
        status,
        earned: status === 'earned',
        planned: status === 'planned',
        inProgress: status === 'in-progress',
        pamphletSku: fullBadge?.pamphletSku,
        pamphletUrl: fullBadge?.pamphletUrl,
        timeAlert: fullBadge?.timeAlert
      };
    });
    const earned = badges.some(b => b.earned);
    const plannedOrInProgress = badges.some(b => b.planned || b.inProgress);
    return { name, earned, plannedOrInProgress, badges };
  };

  const groupAEvaluated = evaluateGroup('Emergency Preparedness OR Lifesaving', groupA);
  const groupBEvaluated = evaluateGroup('Environmental Science OR Sustainability', groupB);
  const groupCEvaluated = evaluateGroup('Swimming OR Hiking OR Cycling', groupC);

  const eagleSoloEarned = soloEvaluated.filter(b => b.earned).length;
  const eagleSoloPlanned = soloEvaluated.filter(b => b.planned || b.inProgress).length;

  const eagleGroupsEarned = 
    (groupAEvaluated.earned ? 1 : 0) +
    (groupBEvaluated.earned ? 1 : 0) +
    (groupCEvaluated.earned ? 1 : 0);

  const eagleGroupsPlanned = 
    (!groupAEvaluated.earned && groupAEvaluated.plannedOrInProgress ? 1 : 0) +
    (!groupBEvaluated.earned && groupBEvaluated.plannedOrInProgress ? 1 : 0) +
    (!groupCEvaluated.earned && groupCEvaluated.plannedOrInProgress ? 1 : 0);

  const totalEagleRequiredEarned = eagleSoloEarned + eagleGroupsEarned;
  const totalEagleRequiredPlanned = eagleSoloPlanned + eagleGroupsPlanned;
  const totalEagleRequiredMissingToPlan = Math.max(0, 14 - (totalEagleRequiredEarned + totalEagleRequiredPlanned));

  // Electives
  const allEagleBadgeIds = new Set([
    ...mandatory11Solo.map(b => b.id),
    ...groupA.map(b => b.id),
    ...groupB.map(b => b.id),
    ...groupC.map(b => b.id)
  ]);

  const electiveBadges = MERIT_BADGES.filter(b => !allEagleBadgeIds.has(normalizeId(b.id)));
  const earnedElectives = electiveBadges.filter(b => isBadgeEarned(b.id));
  const plannedElectives = electiveBadges.filter(b => isBadgePlanned(b.id) || isBadgeInProgress(b.id));

  const totalElectivesEarned = earnedElectives.length;
  const totalElectivesPlanned = plannedElectives.length;
  const totalElectivesMissingToPlan = Math.max(0, 7 - (totalElectivesEarned + totalElectivesPlanned));

  const totalBadgesEarnedCount = MERIT_BADGES.filter(b => isBadgeEarned(b.id)).length;
  const totalBadgesPlannedCount = MERIT_BADGES.filter(b => isBadgePlanned(b.id) || isBadgeInProgress(b.id)).length;
  const totalRemainingToEarn = Math.max(0, 21 - totalBadgesEarnedCount);
  const totalRemainingToPlan = Math.max(0, 21 - (totalBadgesEarnedCount + totalBadgesPlannedCount));

  const is21BadgesSatisfied = totalEagleRequiredEarned >= 14 && totalBadgesEarnedCount >= 21;
  const is21PlanSatisfied = (totalEagleRequiredEarned + totalEagleRequiredPlanned >= 14) && (totalBadgesEarnedCount + totalBadgesPlannedCount >= 21);

  // ── EAGLE PALMS CALCULATOR ──
  const extraBadgesBeyond21 = Math.max(0, totalBadgesEarnedCount - 21);
  const totalPalmsEarned = Math.floor(extraBadgesBeyond21 / 5);
  const silverPalms = Math.floor(totalPalmsEarned / 3);
  const remainingAfterSilver = totalPalmsEarned % 3;
  const goldPalms = Math.floor(remainingAfterSilver / 2);
  const bronzePalms = remainingAfterSilver % 2;

  // ── TENURE CALCULATOR (Elapsed Days Since Life BOR) ──
  const calculateTenureStats = (startDate) => {
    if (!startDate) return { days: 0, months: 0, isMet: false, remainingDays: 180 };
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - start.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.4375);
    const isMet = days >= 180; // 6 months minimum
    const remainingDays = Math.max(0, 180 - days);
    return { days, months, isMet, remainingDays };
  };

  const tenureStats = calculateTenureStats(lifeBorDate);
  const isLeadershipSatisfied = leadershipMonths >= 6 && leadershipRole;
  const totalVolunteerHours = volunteerLogs.reduce((sum, v) => sum + (Number(v.hours) || 0), 0);
  const isProjectSatisfied = beneficiaryApproved && smApproved && committeeApproved && districtApproved && workbookCompleted;
  const isReferencesSatisfied = references.every(r => r.name.trim() && (r.phone.trim() || r.email.trim()));
  const isAmbitionsSatisfied = statementOfAmbitions.trim().length >= 80;

  // Save changes to Firestore
  const handleSaveProgress = async () => {
    setSaving(true);
    setSaveSuccess('');

    try {
      const userRef = doc(db, 'users', activeScoutId);
      const payload = {
        activeTenureStartDate: lifeBorDate,
        joinedTroopDate,
        positionOfResponsibility: {
          title: leadershipRole,
          startDate: leadershipStartDate,
          endDate: leadershipEndDate,
          durationMonths: Number(leadershipMonths) || 6,
          approved: leadershipApproved
        },
        eagleProject: {
          title: projectTitle.trim(),
          beneficiary: projectBeneficiary.trim(),
          beneficiaryContact: projectBeneficiaryContact.trim(),
          stage: projectStage,
          beneficiaryApproval: beneficiaryApproved,
          smApproval: smApproved,
          committeeApproval: committeeApproved,
          districtApproval: districtApproved,
          workbookCompleted,
          finalReportSigned,
          volunteerLogs
        },
        eagleReferences: references,
        statementOfAmbitions: statementOfAmbitions.trim(),
        eagleAppCompleted: appCompleted,
        smConferenceDate,
        smConferenceApproved: smConferenceSigned,
        councilVerified,
        borDate,
        borApproved: borPassed,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, payload, { merge: true });
      setSaveSuccess('✓ Official Eagle Advancement Record saved successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to save Eagle progress:', err);
      setSaveSuccess('⚠️ Error saving record: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReferenceChange = (idx, field, value) => {
    const updated = [...references];
    updated[idx] = { ...updated[idx], [field]: value };
    setReferences(updated);
  };

  const scoutName = scoutProfile.fullName || scoutProfile.username || 'Scout';
  const scoutRank = scoutProfile.rank || 'Life Scout';

  const RANKS_PIPELINE = [
    { id: 'scout', label: 'Scout' },
    { id: 'tenderfoot', label: 'Tenderfoot' },
    { id: 'second_class', label: '2nd Class' },
    { id: 'first_class', label: '1st Class' },
    { id: 'star', label: 'Star' },
    { id: 'life', label: 'Life' },
    { id: 'eagle', label: 'Eagle' },
    { id: 'palms', label: 'Palms' }
  ];

  const filteredElectivesForModal = electiveBadges.filter(b => {
    if (!electiveSearch.trim()) return true;
    const q = electiveSearch.toLowerCase();
    return b.name.toLowerCase().includes(q) || (b.category || '').toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading Eagle Advancement Blueprint...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* ── 1. HERO BANNER: MASTER ROAD TO EAGLE PORTAL ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute right-4 top-2 opacity-10 pointer-events-none">
          <Award size={200} className="text-amber-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-950/60 shrink-0">
              🦅
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Star size={11} /> Official Scouting America Eagle Milestone Workflow
                </span>
                <span className="bg-slate-800 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Rank: {scoutRank}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Road to Eagle Scout Blueprint
              </h2>
              <p className="text-xs text-slate-350 mt-1 max-w-2xl leading-relaxed">
                Step-by-step 7-milestone blueprint, real-time 21 merit badge planner, project management, and board-of-review approvals for <strong>{scoutName}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <button
              onClick={handleSaveProgress}
              disabled={saving}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 hover:scale-[1.02] disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Eagle Progress'}</span>
            </button>
          </div>
        </div>

        {/* Leader Scout Selector */}
        {isLeaderOrOwner && allScouts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2 flex-wrap text-xs text-slate-300">
            <span className="font-bold uppercase text-[10px] text-amber-400">Reviewing Scout:</span>
            <select
              value={activeScoutId}
              onChange={(e) => setSelectedScoutId(e.target.value)}
              className="bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
            >
              {allScouts.map(s => (
                <option key={s.uid} value={s.uid}>
                  {s.fullName || s.username} ({s.rank || 'Scout'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── DYNAMIC KPI STATS BAR ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-700/60 relative z-10 text-xs">
          {/* Active Rank */}
          <div className="bg-slate-900/70 border border-slate-750 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Rank</span>
            <strong className="text-sm font-black text-emerald-400 capitalize block truncate">
              {scoutRank}
            </strong>
          </div>

          {/* Merit Badges */}
          <div className="bg-slate-900/70 border border-slate-750 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Merit Badges</span>
            <strong className="text-sm font-black text-amber-400 block truncate">
              {totalBadgesEarnedCount}/21 <span className="text-[10px] text-slate-400">({totalEagleRequiredEarned}/14 Req)</span>
            </strong>
          </div>

          {/* Leadership Days */}
          <div className="bg-slate-900/70 border border-slate-750 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Life Tenure Days</span>
            <strong className={`text-sm font-black block truncate ${tenureStats.isMet ? 'text-emerald-400' : 'text-amber-400'}`}>
              {tenureStats.days} / 180 Days {tenureStats.isMet ? '✓' : ''}
            </strong>
          </div>

          {/* Project Status */}
          <div className="bg-slate-900/70 border border-slate-750 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Eagle Project</span>
            <strong className="text-sm font-black text-sky-400 capitalize block truncate">
              {isProjectSatisfied ? '✓ Approved' : projectTitle ? projectStage : 'Planning'}
            </strong>
          </div>

          {/* Palms Earned */}
          <div className="bg-slate-900/70 border border-slate-750 p-3 rounded-2xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Earned Palms</span>
            <strong className="text-sm font-black text-yellow-300 block truncate">
              {totalPalmsEarned} Palms ({silverPalms}S, {goldPalms}G, {bronzePalms}B)
            </strong>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold p-3.5 rounded-2xl text-center shadow-lg animate-fadeIn">
          {saveSuccess}
        </div>
      )}

      {/* ── 2. MILESTONE NAVIGATION TABS ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-750 pb-3">
        {[
          { id: 'badges', label: '3. 21 Merit Badges', icon: '🏅', isDone: is21BadgesSatisfied },
          { id: 'tenure', label: '1. Tenure & Service', icon: '⏱️', isDone: tenureStats.isMet },
          { id: 'leadership', label: '2. 6-Mo Leadership', icon: '⚜️', isDone: isLeadershipSatisfied },
          { id: 'project', label: '4. Eagle Project', icon: '🛠️', isDone: isProjectSatisfied },
          { id: 'references', label: '5. References & Essay', icon: '📝', isDone: isReferencesSatisfied && isAmbitionsSatisfied },
          { id: 'bor', label: '6. Conference & BOR', icon: '🏛️', isDone: borPassed },
          { id: 'palms', label: '7. Eagle Palms', icon: '🪶', isDone: totalPalmsEarned > 0 }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMilestone(m.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeMilestone === m.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
            {m.isDone && <CheckCircle2 size={13} className={activeMilestone === m.id ? 'text-slate-950' : 'text-emerald-400'} />}
          </button>
        ))}
      </div>

      {/* ──────────────── MILESTONE 3: 21 MERIT BADGES AUDIT ENGINE & PLANNER ──────────────── */}
      {activeMilestone === 'badges' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-7 animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" size={22} />
                <span>Milestone 3: 21 Merit Badges Audit Engine & Real-Time Planner</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Requirement 3: Earn a total of 21 merit badges (14 Eagle-required categories + 7 electives).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('merit-badges')}
                className="bg-slate-750 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border border-slate-650 flex items-center gap-1.5 shadow-sm"
              >
                <Compass size={14} className="text-teal-400" />
                <span>Explore All 137 Badges</span>
              </button>
              <button
                type="button"
                onClick={() => setShowElectiveModal(true)}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <Plus size={15} />
                <span>Add Elective to Plan</span>
              </button>
            </div>
          </div>

          {/* ── METRIC CARDS & REAL-TIME REMAINING BADGES COUNTER ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total 21 Badges */}
            <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Award size={16} className="text-amber-400" />
                  <span>Total Badges</span>
                </span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {totalBadgesEarnedCount} / 21
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalBadgesEarnedCount / 21) * 100)}%` }}
                  />
                  <div 
                    className="bg-amber-400/80 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100 - (totalBadgesEarnedCount / 21) * 100, (totalBadgesPlannedCount / 21) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-emerald-400">✓ {totalBadgesEarnedCount} Earned</span>
                  <span className="text-amber-300">🎯 {totalBadgesPlannedCount} In Plan</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Remaining to Earn:</span>
                <strong className={`font-mono ${totalRemainingToEarn === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalRemainingToEarn === 0 ? '✓ Complete!' : `${totalRemainingToEarn} more needed`}
                </strong>
              </div>
            </div>

            {/* 14 Eagle-Required Badges */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Star size={16} className="text-emerald-400" />
                  <span>Eagle-Required</span>
                </span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {totalEagleRequiredEarned} / 14
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalEagleRequiredEarned / 14) * 100)}%` }}
                  />
                  <div 
                    className="bg-teal-400/80 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100 - (totalEagleRequiredEarned / 14) * 100, (totalEagleRequiredPlanned / 14) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-emerald-400">✓ {totalEagleRequiredEarned} Earned</span>
                  <span className="text-teal-300">🎯 {totalEagleRequiredPlanned} In Plan</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Remaining to Plan:</span>
                <strong className={`font-mono ${totalEagleRequiredMissingToPlan === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalEagleRequiredMissingToPlan === 0 ? '✓ 14 Selected!' : `${totalEagleRequiredMissingToPlan} unselected`}
                </strong>
              </div>
            </div>

            {/* 7 Elective Badges */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/40 p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                  <Compass size={16} className="text-sky-400" />
                  <span>Electives</span>
                </span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {totalElectivesEarned} / 7
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div 
                    className="bg-sky-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalElectivesEarned / 7) * 100)}%` }}
                  />
                  <div 
                    className="bg-indigo-400/80 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100 - (totalElectivesEarned / 7) * 100, (totalElectivesPlanned / 7) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-sky-400">✓ {totalElectivesEarned} Earned</span>
                  <span className="text-indigo-300">🎯 {totalElectivesPlanned} In Plan</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Remaining to Plan:</span>
                <strong className={`font-mono ${totalElectivesMissingToPlan === 0 ? 'text-emerald-400' : 'text-sky-400'}`}>
                  {totalElectivesMissingToPlan === 0 ? '✓ 7 Selected!' : `${totalElectivesMissingToPlan} more needed`}
                </strong>
              </div>
            </div>
          </div>

          {/* ── PART 1: 11 SOLO MANDATORY EAGLE-REQUIRED BADGES ── */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Part 1: 11 Solo Mandatory Eagle-Required Badges</span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">
                {eagleSoloEarned} Earned • {eagleSoloPlanned} Planned
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {soloEvaluated.map(b => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2.5 transition ${
                    b.earned
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-sm'
                      : b.planned || b.inProgress
                      ? 'bg-teal-950/20 border-teal-500/40 text-slate-200'
                      : 'bg-slate-900/60 border-slate-750 text-slate-400 hover:border-slate-650'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {b.earned ? (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    ) : b.planned || b.inProgress ? (
                      <Target size={18} className="text-teal-400 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-slate-600 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block truncate ${b.earned ? 'text-white' : 'text-slate-300'}`}>
                        {b.name}
                      </span>
                      {b.pamphletSku && (
                        <span className="text-[9px] text-slate-500 font-mono">SKU #{b.pamphletSku}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!b.earned && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlanned(b.id, b.planned)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                          b.planned
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-red-950/40 hover:text-red-300'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {b.planned ? (
                          <>
                            <Target size={11} />
                            <span>In Plan</span>
                          </>
                        ) : (
                          <>
                            <Plus size={11} />
                            <span>+ Plan</span>
                          </>
                        )}
                      </button>
                    )}

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      b.earned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : b.inProgress
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : b.planned
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {b.earned ? '✓ Earned' : b.inProgress ? 'In Progress' : b.planned ? 'Planned' : 'Needed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PART 2: 3 ALTERNATE CHOICE GROUPS ── */}
          <div className="space-y-3 pt-3 border-t border-slate-700/60">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              Part 2: 3 Alternate Choice Groups (Pick 1 from each group)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Group A (Prep / Lifesaving)', group: groupAEvaluated },
                { title: 'Group B (Environment)', group: groupBEvaluated },
                { title: 'Group C (Physical / Outdoor)', group: groupCEvaluated }
              ].map(({ title, group }, gIdx) => (
                <div
                  key={gIdx}
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    group.earned
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                      : group.plannedOrInProgress
                      ? 'bg-teal-950/20 border-teal-500/30'
                      : 'bg-slate-900/60 border-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black text-amber-300">{title}</strong>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      group.earned
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : group.plannedOrInProgress
                        ? 'bg-teal-500/20 text-teal-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {group.earned ? '✓ Satisfied' : group.plannedOrInProgress ? '🎯 In Plan' : 'Pick 1'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {group.badges.map(b => (
                      <div
                        key={b.id}
                        className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                          b.earned
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : b.planned
                            ? 'bg-teal-950/30 border-teal-500/30 text-teal-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className={b.earned ? 'font-bold' : ''}>{b.name}</span>
                        
                        <div className="flex items-center gap-1">
                          {!b.earned && (
                            <button
                              type="button"
                              onClick={() => handleTogglePlanned(b.id, b.planned)}
                              className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                                b.planned
                                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {b.planned ? 'In Plan' : '+ Plan'}
                            </button>
                          )}
                          {b.earned && <Check size={13} className="text-emerald-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PART 3: 7 ELECTIVES ROADMAP & RECOMMENDED BADGES STUDIO ── */}
          <div className="space-y-4 pt-4 border-t border-slate-700/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-base">🎨</span>
                  <span>Part 3: 7 Elective Badges Roadmap & Recommended Badges Hub</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plan your 7 electives by selecting from the recommended badges on the right or browsing all 120+ electives.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-900 border border-slate-750 text-emerald-400">
                  {earnedElectives.length + plannedElectives.length} of 7 Selected
                </span>
                <button
                  type="button"
                  onClick={() => setShowElectiveModal(true)}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Plus size={13} />
                  <span>Browse All 120+</span>
                </button>
              </div>
            </div>

            {/* Two-Column Studio Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left (7 Cols): Selected Elective Roadmap Slots */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare size={14} className="text-teal-400" />
                    <span>My Selected Elective Roadmap ({earnedElectives.length + plannedElectives.length}/7)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {totalElectivesMissingToPlan === 0 ? '✓ 7 Slots Filled' : `${totalElectivesMissingToPlan} empty slot${totalElectivesMissingToPlan === 1 ? '' : 's'}`}
                  </span>
                </div>

                {/* Empty State Board if 0 electives selected */}
                {earnedElectives.length === 0 && plannedElectives.length === 0 ? (
                  <div className="bg-slate-900/70 border-2 border-dashed border-slate-700 rounded-3xl p-7 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-2xl mx-auto shadow-md">
                      🎯
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-extrabold text-white">No Elective Badges Selected Yet</h5>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Your 7 elective slots are currently empty. Select badges from the <strong>Recommended Badges</strong> on the right or click below to browse all electives!
                      </p>
                    </div>

                    {/* 7 Empty Slot Placeholders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left">
                      {[1, 2, 3, 4, 5, 6, 7].map(slotNum => (
                        <div
                          key={slotNum}
                          onClick={() => setShowElectiveModal(true)}
                          className="p-3 rounded-xl border border-dashed border-slate-750 bg-slate-950/40 hover:border-teal-500/50 hover:bg-slate-900/60 transition cursor-pointer flex items-center justify-between text-xs text-slate-500 hover:text-teal-300"
                        >
                          <span className="font-semibold flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-400">{slotNum}</span>
                            <span>Empty Elective Slot</span>
                          </span>
                          <Plus size={13} className="text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {[...earnedElectives, ...plannedElectives].map((b, idx) => {
                      const status = getBadgeStatus(b.id);
                      const isEarned = status === 'earned';
                      return (
                        <div
                          key={b.id}
                          className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                            isEarned
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                              : 'bg-slate-900/80 border-slate-750 hover:border-slate-700 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isEarned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-500/20 text-teal-300'
                            }`}>
                              #{idx + 1}
                            </div>
                            <div className="min-w-0">
                              <strong className="text-xs font-extrabold text-white block truncate">{b.name}</strong>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>{b.category || 'Elective'}</span>
                                <span className={`font-bold px-1.5 py-0.2 rounded ${
                                  isEarned ? 'text-emerald-400 bg-emerald-950' : 'text-teal-400 bg-teal-950'
                                }`}>
                                  {isEarned ? '✓ Earned' : '🎯 In Plan'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {b.pamphletUrl && (
                              <a
                                href={b.pamphletUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-teal-700 text-teal-300 hover:text-white border border-slate-700 transition"
                                title="View Pamphlet"
                              >
                                <BookOpen size={13} />
                              </a>
                            )}
                            {!isEarned && (
                              <button
                                type="button"
                                onClick={() => handleTogglePlanned(b.id, true)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 transition cursor-pointer"
                                title="Remove from Plan"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Remaining Empty Slots */}
                    {Array.from({ length: Math.max(0, 7 - (earnedElectives.length + plannedElectives.length)) }).map((_, emptyIdx) => {
                      const slotNumber = earnedElectives.length + plannedElectives.length + emptyIdx + 1;
                      return (
                        <div
                          key={`empty-${emptyIdx}`}
                          onClick={() => setShowElectiveModal(true)}
                          className="p-3 rounded-2xl border border-dashed border-slate-750 bg-slate-950/40 hover:border-teal-500/40 hover:bg-slate-900/60 transition cursor-pointer flex items-center justify-between text-xs text-slate-500 hover:text-teal-300"
                        >
                          <span className="font-semibold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-xl bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-400">#{slotNumber}</span>
                            <span>Empty Slot #{slotNumber} &bull; Click to choose a badge</span>
                          </span>
                          <Plus size={13} className="text-slate-600" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right (5 Cols): Recommended Badges Studio Panel */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-teal-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      <span>Recommended Badges</span>
                    </h5>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">
                      Dhulfiqār Picks
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click <strong>+ Add</strong> on any badge below to instantly add it to your plan on the left.
                  </p>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  {['All', 'Outdoors', 'STEM', 'Trades', 'Strategy', 'Leadership', 'Arts'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setRecommendedCategory(cat)}
                      className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer border ${
                        recommendedCategory === cat
                          ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-750 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Recommended List */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {RECOMMENDED_BADGES_DATA
                    .filter(b => recommendedCategory === 'All' || b.category === recommendedCategory)
                    .map(item => {
                      const fullBadge = MERIT_BADGES.find(mb => normalizeId(mb.id) === normalizeId(item.id));
                      const status = getBadgeStatus(item.id);
                      const isEarned = status === 'earned';
                      const isPlanned = status === 'planned' || status === 'in-progress';

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-2 text-xs ${
                            isEarned
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                              : isPlanned
                              ? 'bg-teal-950/30 border-teal-500/40 text-teal-200'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <strong className="text-xs font-bold text-white block">{item.name}</strong>
                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.highlight}</p>
                            </div>
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full shrink-0">
                              {item.category}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-850">
                            {fullBadge?.pamphletUrl ? (
                              <a
                                href={fullBadge.pamphletUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                              >
                                <BookOpen size={11} />
                                <span>Pamphlet</span>
                              </a>
                            ) : <span />}

                            <button
                              type="button"
                              onClick={() => handleTogglePlanned(item.id, isPlanned)}
                              disabled={isEarned}
                              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                                isEarned
                                  ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                                  : isPlanned
                                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-red-950/40 hover:text-red-300'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              }`}
                            >
                              {isEarned ? (
                                <>
                                  <Check size={11} />
                                  <span>Earned</span>
                                </>
                              ) : isPlanned ? (
                                <>
                                  <Target size={11} />
                                  <span>In Plan (Remove)</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={11} />
                                  <span>Add to Plan</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 1: TENURE & ACTIVE SERVICE ──────────────── */}
      {activeMilestone === 'tenure' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="text-amber-400" size={20} />
              <span>Milestone 1: Life Scout Active Tenure (6 Months Minimum)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 1: Be active in your troop for at least six months as a Life Scout before submitting your Eagle Application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={15} /> Board of Review & Start Date
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Life Rank Board of Review Date:</label>
                  <input
                    type="date"
                    value={lifeBorDate}
                    onChange={(e) => setLifeBorDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Joined Troop Date:</label>
                  <input
                    type="date"
                    value={joinedTroopDate}
                    onChange={(e) => setJoinedTroopDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={15} /> Active Tenure Calculator
              </h3>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Elapsed Days Since Life Rank:</span>
                  <strong className={`font-mono text-sm ${tenureStats.isMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tenureStats.days} Days ({tenureStats.months} Months)
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Requirement Status:</span>
                  <strong className={tenureStats.isMet ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {tenureStats.isMet ? '✓ 6-Month Tenure Satisfied!' : `${tenureStats.remainingDays} Days Remaining`}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 2: 6-MONTH LEADERSHIP POSITION ──────────────── */}
      {activeMilestone === 'leadership' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Shield className="text-amber-400" size={20} />
              <span>Milestone 2: 6-Month Position of Responsibility</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 4: While a Life Scout, serve actively in your troop for six months in one or more of the qualifying positions of responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Leadership Position:</label>
                <select
                  value={leadershipRole}
                  onChange={(e) => setLeadershipRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
                >
                  {QUALIFYING_LEADERSHIP_POSITIONS.map(p => (
                    <option key={p.title} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Start Date:</label>
                  <input
                    type="date"
                    value={leadershipStartDate}
                    onChange={(e) => setLeadershipStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">End Date:</label>
                  <input
                    type="date"
                    value={leadershipEndDate}
                    onChange={(e) => setLeadershipEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Total Months Served:</label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={leadershipMonths}
                  onChange={(e) => setLeadershipMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Leadership Verification Status
                </h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Position Held:</span>
                    <strong className="text-white font-semibold">{leadershipRole}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Duration:</span>
                    <strong className={`font-black ${isLeadershipSatisfied ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {leadershipMonths} Months {isLeadershipSatisfied ? '(✓ $\\ge 6$ Mo Complete)' : '(Need 6 Mo)'}
                    </strong>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={leadershipApproved}
                  onChange={(e) => setLeadershipApproved(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Scoutmaster / Troop Leader Verified Leadership Performance</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 4: EAGLE PROJECT & WORKBOOK ──────────────── */}
      {activeMilestone === 'project' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Milestone 4: Eagle Scout Service Project Workbook & Approvals</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 5: While a Life Scout, plan, develop, and give leadership to others in a service project helpful to any religious institution, school, or community.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Project Title / Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Community Mosque Library Renovation & Book Cataloging"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Beneficiary Organization:</label>
                <input
                  type="text"
                  placeholder="e.g. Al-Hoda Educational Foundation"
                  value={projectBeneficiary}
                  onChange={(e) => setProjectBeneficiary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            {/* Approval Checkboxes */}
            <div className="bg-slate-900/60 border border-slate-750 p-4 rounded-2xl space-y-3">
              <strong className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Required Project Approvals (All Must Be Signed):
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Beneficiary Approval', val: beneficiaryApproved, setVal: setBeneficiaryApproved },
                  { label: 'Scoutmaster Approval', val: smApproved, setVal: setSmApproved },
                  { label: 'Troop Committee Approval', val: committeeApproved, setVal: setCommitteeApproved },
                  { label: 'Council / District Approval', val: districtApproved, setVal: setDistrictApproved },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <input
                      type="checkbox"
                      checked={item.val}
                      onChange={(e) => item.setVal(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 5: REFERENCES & AMBITIONS ──────────────── */}
      {activeMilestone === 'references' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <FileText className="text-amber-400" size={20} />
              <span>Milestone 5: Eagle Scout Reference Contacts & Ambitions Essay</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 2 & 6: Provide 6 references who can attest to your character, and write a statement of your ambitions and life purpose.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              6 Reference Contacts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {references.map((r, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <strong className="text-amber-300">{r.type}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">Ref #{idx + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={r.name}
                      onChange={(e) => handleReferenceChange(idx, 'name', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={r.phone}
                      onChange={(e) => handleReferenceChange(idx, 'phone', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={r.email}
                    onChange={(e) => handleReferenceChange(idx, 'email', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Statement of Ambitions and Life Purpose (Requirement 6)
            </h4>
            <textarea
              rows={5}
              value={statementOfAmbitions}
              onChange={(e) => setStatementOfAmbitions(e.target.value)}
              placeholder="Attach a statement of your ambitions and life purpose and a listing of positions held in your religious institution, school, camp, community, or other organizations, during which you demonstrated leadership skills. Include honors and awards received during this service."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-white leading-relaxed placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 6: BOR & SIGN-OFF ──────────────── */}
      {activeMilestone === 'bor' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="text-amber-400" size={20} />
              <span>Milestone 6: Scoutmaster Conference & Eagle Board of Review</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 7: Successfully complete your Scoutmaster Conference and Eagle Scout Board of Review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 bg-slate-900/60 border border-slate-750 rounded-2xl space-y-3">
              <strong className="text-amber-300 font-bold block">Scoutmaster Conference</strong>
              <input
                type="date"
                value={smConferenceDate}
                onChange={(e) => setSmConferenceDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smConferenceSigned}
                  onChange={(e) => setSmConferenceSigned(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Scoutmaster Conference Completed & Signed</span>
              </label>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-750 rounded-2xl space-y-3">
              <strong className="text-amber-300 font-bold block">Eagle Board of Review</strong>
              <input
                type="date"
                value={borDate}
                onChange={(e) => setBorDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={borPassed}
                  onChange={(e) => setBorPassed(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Eagle Board of Review Passed (Official Eagle Scout!)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 7: EAGLE PALMS ──────────────── */}
      {activeMilestone === 'palms' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Milestone 7: Official Eagle Palms Calculator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Earn 1 Eagle Palm for every 5 additional merit badges completed beyond the 21 required for Eagle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Badges Earned</span>
              <strong className="text-2xl font-black text-white font-mono block">{totalBadgesEarnedCount}</strong>
              <span className="text-[10px] text-emerald-400">({extraBadgesBeyond21} beyond 21)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bronze Palms (5 Badges)</span>
              <strong className="text-2xl font-black text-amber-600 font-mono block">{bronzePalms}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gold Palms (10 Badges)</span>
              <strong className="text-2xl font-black text-yellow-400 font-mono block">{goldPalms}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Silver Palms (15 Badges)</span>
              <strong className="text-2xl font-black text-slate-200 font-mono block">{silverPalms}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── ELECTIVE BADGES MODAL PICKER ── */}
      {showElectiveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-850 border-2 border-teal-500/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="p-5 border-b border-slate-750 flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Compass size={18} className="text-teal-400" />
                  <span>Choose Elective Merit Badges for Eagle Plan</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select elective merit badges to reach your 7 required electives ({earnedElectives.length + plannedElectives.length} / 7 selected).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowElectiveModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-800 bg-slate-900/60">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 120+ electives by name or category (e.g. Robotics, Wilderness, Archery)..."
                  value={electiveSearch}
                  onChange={(e) => setElectiveSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-2 max-h-[50vh]">
              {filteredElectivesForModal.map(b => {
                const status = getBadgeStatus(b.id);
                const isEarned = status === 'earned';
                const isPlanned = status === 'planned' || status === 'in-progress';

                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition ${
                      isEarned
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : isPlanned
                        ? 'bg-teal-950/30 border-teal-500/40 text-teal-200'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <strong className="block truncate text-white text-xs font-bold">{b.name}</strong>
                      <span className="text-[10px] text-slate-400">{b.category || 'Elective'}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {b.pamphletUrl && (
                        <a
                          href={b.pamphletUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-700 text-teal-300 hover:text-white border border-slate-700 transition"
                          title="View Official Pamphlet"
                        >
                          <BookOpen size={12} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleTogglePlanned(b.id, isPlanned)}
                        disabled={isEarned}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          isEarned
                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 cursor-default'
                            : isPlanned
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-red-950/40 hover:text-red-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                      >
                        {isEarned ? (
                          <>
                            <Check size={13} />
                            <span>Earned</span>
                          </>
                        ) : isPlanned ? (
                          <>
                            <Target size={13} />
                            <span>In Plan (Remove)</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} />
                            <span>Add to Plan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-750 bg-slate-900 flex justify-end">
              <button
                type="button"
                onClick={() => setShowElectiveModal(false)}
                className="bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer border border-slate-700"
              >
                Done Selecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
