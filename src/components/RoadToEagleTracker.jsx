import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK, TOTAL_MERIT_BADGES_FOR_EAGLE } from '../data/meritBadges';
import { 
  Award, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Star, 
  Calendar, 
  User, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckSquare, 
  AlertTriangle, 
  Save, 
  ShieldCheck, 
  Shield, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ExternalLink,
  Zap,
  Flame,
  Check,
  Target,
  Plus,
  Trash2,
  BookOpen,
  Search,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

const BSA_LEADERSHIP_POSITIONS = [
  'Senior Patrol Leader (SPL)',
  'Assistant Senior Patrol Leader (ASPL)',
  'Patrol Leader',
  'Troop Guide',
  'Order of the Arrow Representative',
  'Scribe',
  'Librarian',
  'Historian',
  'Quartermaster',
  'Bugler',
  'Junior Assistant Scoutmaster (JASM)',
  'Chaplain Aide',
  'Instructor',
  'Webmaster',
  'Outdoor Ethics Guide',
  'Den Chief'
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

const DEFAULT_REFERENCES = [
  { type: 'Parents / Guardians', name: '', address: '', phone: '', email: '' },
  { type: 'Religious Leader', name: '', address: '', phone: '', email: '' },
  { type: 'Educational / Principal / Teacher', name: '', address: '', phone: '', email: '' },
  { type: 'Employer (or N/A if student)', name: '', address: '', phone: '', email: '' },
  { type: 'Reference 1 (Personal / Character)', name: '', address: '', phone: '', email: '' },
  { type: 'Reference 2 (Personal / Character)', name: '', address: '', phone: '', email: '' }
];

// Helper to normalize badge ID matching
function normalizeId(id = '') {
  return id.toLowerCase().replace(/_/g, '-');
}

export default function RoadToEagleTracker({ currentUser, scoutId: propScoutId, readOnly = false, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  const scoutUid = propScoutId || currentUser?.uid;

  const [scoutProfile, setScoutProfile] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeGateTab, setActiveGateTab] = useState('audit'); // 'audit' | 'tenure' | 'project' | 'references' | 'palms' | 'bor'

  // Elective Modal Picker State
  const [showElectiveModal, setShowElectiveModal] = useState(false);
  const [electiveSearch, setElectiveSearch] = useState('');
  const [recommendedCategory, setRecommendedCategory] = useState('All');

  // Editable Form States
  const [joinedTroopDate, setJoinedTroopDate] = useState('');
  const [activeTenureStartDate, setActiveTenureStartDate] = useState('');
  const [leadershipTitle, setLeadershipTitle] = useState(BSA_LEADERSHIP_POSITIONS[0]);
  const [leadershipStartDate, setLeadershipStartDate] = useState('');
  const [leadershipEndDate, setLeadershipEndDate] = useState('');
  const [leadershipMonths, setLeadershipMonths] = useState(6);
  const [conservationHours, setConservationHours] = useState(0);

  // Eagle Project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectBeneficiary, setProjectBeneficiary] = useState('');
  const [projectStatus, setProjectStatus] = useState('planning');
  const [proposalApprovedDate, setProposalApprovedDate] = useState('');
  const [executionStartDate, setExecutionStartDate] = useState('');
  const [projectCompletedDate, setProjectCompletedDate] = useState('');
  const [workbookCompleted, setWorkbookCompleted] = useState(false);
  const [beneficiaryApproval, setBeneficiaryApproval] = useState(false);
  const [smApproval, setSmApproval] = useState(false);
  const [committeeApproval, setCommitteeApproval] = useState(false);
  const [districtApproval, setDistrictApproval] = useState(false);
  const [projectScoutHours, setProjectScoutHours] = useState('');
  const [projectVolunteerHours, setProjectVolunteerHours] = useState('');

  // References & Ambitions
  const [references, setReferences] = useState(DEFAULT_REFERENCES);
  const [statementOfAmbitions, setStatementOfAmbitions] = useState('');

  // Scoutmaster Conference & BOR (Leader Verifications)
  const [smConferenceDate, setSmConferenceDate] = useState('');
  const [smConferenceApproved, setSmConferenceApproved] = useState(false);
  const [borDate, setBorDate] = useState('');
  const [borApproved, setBorApproved] = useState(false);

  // 1. Subscribe to User Profile
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'users', scoutUid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setScoutProfile(data);
        setJoinedTroopDate(data.joinedTroopDate || '');
        setActiveTenureStartDate(data.activeTenureStartDate || data.lifeRankDate || '');
        
        // Leadership
        if (data.positionOfResponsibility) {
          setLeadershipTitle(data.positionOfResponsibility.title || BSA_LEADERSHIP_POSITIONS[0]);
          setLeadershipStartDate(data.positionOfResponsibility.startDate || '');
          setLeadershipEndDate(data.positionOfResponsibility.endDate || '');
          setLeadershipMonths(data.positionOfResponsibility.durationMonths || 6);
        }

        setConservationHours(data.conservationHours || 0);

        // Project
        if (data.eagleProject) {
          setProjectTitle(data.eagleProject.title || '');
          setProjectBeneficiary(data.eagleProject.beneficiary || '');
          setProjectStatus(data.eagleProject.status || 'planning');
          setProposalApprovedDate(data.eagleProject.proposalApprovedDate || '');
          setExecutionStartDate(data.eagleProject.executionStartDate || '');
          setProjectCompletedDate(data.eagleProject.completedDate || '');
          setWorkbookCompleted(!!data.eagleProject.workbookCompleted);
          setBeneficiaryApproval(!!data.eagleProject.beneficiaryApproval);
          setSmApproval(!!data.eagleProject.smApproval);
          setCommitteeApproval(!!data.eagleProject.committeeApproval);
          setDistrictApproval(!!data.eagleProject.districtApproval);
          setProjectScoutHours(data.eagleProject.scoutHours || '');
          setProjectVolunteerHours(data.eagleProject.volunteerHours || '');
        }

        // References
        if (Array.isArray(data.eagleReferences) && data.eagleReferences.length === 6) {
          setReferences(data.eagleReferences);
        }

        setStatementOfAmbitions(data.statementOfAmbitions || '');

        // SM Conf & BOR
        setSmConferenceDate(data.smConferenceDate || '');
        setSmConferenceApproved(!!data.smConferenceApproved);
        setBorDate(data.borDate || '');
        setBorApproved(!!data.borApproved);
      }
    });

    return () => unsub();
  }, [scoutUid]);

  // 2. Subscribe to Merit Badges Progress in Real-Time
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { 
        map[d.id] = d.data();
        map[normalizeId(d.id)] = d.data();
      });
      setMeritProgress(map);
      setLoading(false);
    });
    return () => unsub();
  }, [scoutUid]);

  // ── BADGE STATUS DETERMINATION HELPER ──
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

  // Toggle Planned state directly from Road to Eagle
  const handleTogglePlanned = async (badgeId, currentlyPlanned) => {
    if (readOnly) return;
    const normId = normalizeId(badgeId);
    const ref = doc(db, 'user_progress', scoutUid, 'merit_badges', normId);
    const existing = meritProgress[normId] || meritProgress[badgeId] || {};
    try {
      await setDoc(ref, {
        ...existing,
        planned: !currentlyPlanned,
        plannedAt: !currentlyPlanned ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error toggling planned badge in RoadToEagle:", err);
    }
  };

  // ── AUDIT & PLANNING ENGINE ──
  // 11 Core Solo Mandatory Eagle Badges
  const mandatorySoloBadges = [
    { id: 'first-aid', name: 'First Aid' },
    { id: 'citizenship-in-society', name: 'Citizenship in Society' },
    { id: 'citizenship-in-the-community', name: 'Citizenship in the Community' },
    { id: 'citizenship-in-the-nation', name: 'Citizenship in the Nation' },
    { id: 'citizenship-in-the-world', name: 'Citizenship in the World' },
    { id: 'communication', name: 'Communication' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'personal-fitness', name: 'Personal Fitness' },
    { id: 'personal-management', name: 'Personal Management' },
    { id: 'camping', name: 'Camping' },
    { id: 'family-life', name: 'Family Life' },
  ];

  // 3 Alternate Choice Groups (1 Required From Each)
  const group1Badges = [
    { id: 'emergency-preparedness', name: 'Emergency Preparedness' },
    { id: 'lifesaving', name: 'Lifesaving' }
  ];

  const group2Badges = [
    { id: 'environmental-science', name: 'Environmental Science' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  const group3Badges = [
    { id: 'swimming', name: 'Swimming' },
    { id: 'hiking', name: 'Hiking' },
    { id: 'cycling', name: 'Cycling' }
  ];

  // Evaluate Solo Badges
  const soloEvaluated = mandatorySoloBadges.map(b => {
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

  const group1Evaluated = evaluateGroup('Emergency Prep OR Lifesaving', group1Badges);
  const group2Evaluated = evaluateGroup('Environmental Science OR Sustainability', group2Badges);
  const group3Evaluated = evaluateGroup('Swimming OR Hiking OR Cycling', group3Badges);

  // Eagle Required Counts (Earned vs Planned)
  const eagleSoloEarned = soloEvaluated.filter(b => b.earned).length;
  const eagleSoloPlanned = soloEvaluated.filter(b => b.planned || b.inProgress).length;

  const eagleGroupsEarned = 
    (group1Evaluated.earned ? 1 : 0) +
    (group2Evaluated.earned ? 1 : 0) +
    (group3Evaluated.earned ? 1 : 0);

  const eagleGroupsPlanned =
    (!group1Evaluated.earned && group1Evaluated.plannedOrInProgress ? 1 : 0) +
    (!group2Evaluated.earned && group2Evaluated.plannedOrInProgress ? 1 : 0) +
    (!group3Evaluated.earned && group3Evaluated.plannedOrInProgress ? 1 : 0);

  const totalEagleRequiredEarned = eagleSoloEarned + eagleGroupsEarned;
  const totalEagleRequiredPlanned = eagleSoloPlanned + eagleGroupsPlanned;
  const totalEagleRequiredRemaining = Math.max(0, 14 - totalEagleRequiredEarned);
  const totalEagleRequiredMissingToPlan = Math.max(0, 14 - (totalEagleRequiredEarned + totalEagleRequiredPlanned));

  // ── ELECTIVE MERIT BADGES EVALUATION ──
  // Any badge that is not one of the 14 counted Eagle required slots
  const allEagleBadgeIds = new Set([
    ...mandatorySoloBadges.map(b => b.id),
    ...group1Badges.map(b => b.id),
    ...group2Badges.map(b => b.id),
    ...group3Badges.map(b => b.id)
  ]);

  const electiveBadges = MERIT_BADGES.filter(b => !allEagleBadgeIds.has(normalizeId(b.id)));

  const earnedElectives = electiveBadges.filter(b => isBadgeEarned(b.id));
  const plannedElectives = electiveBadges.filter(b => isBadgePlanned(b.id) || isBadgeInProgress(b.id));

  const totalElectivesEarned = earnedElectives.length;
  const totalElectivesPlanned = plannedElectives.length;
  const totalElectivesRemainingToEarn = Math.max(0, 7 - totalElectivesEarned);
  const totalElectivesMissingToPlan = Math.max(0, 7 - (totalElectivesEarned + totalElectivesPlanned));

  // Total 21 Merit Badges Summary
  const totalEarnedOverall = MERIT_BADGES.filter(b => isBadgeEarned(b.id)).length;
  const totalPlannedOverall = MERIT_BADGES.filter(b => isBadgePlanned(b.id) || isBadgeInProgress(b.id)).length;
  const totalRemainingOverallToEarn = Math.max(0, 21 - totalEarnedOverall);
  const totalRemainingOverallToPlan = Math.max(0, 21 - (totalEarnedOverall + totalPlannedOverall));

  const is21BadgesComplete = totalEagleRequiredEarned >= 14 && totalEarnedOverall >= 21;
  const is21PlanComplete = (totalEagleRequiredEarned + totalEagleRequiredPlanned >= 14) && (totalEarnedOverall + totalPlannedOverall >= 21);

  // ── EAGLE PALMS CALCULATOR ──
  const extraBadgesBeyond21 = Math.max(0, totalEarnedOverall - 21);
  const totalPalmsEarned = Math.floor(extraBadgesBeyond21 / 5);
  const silverPalms = Math.floor(totalPalmsEarned / 3);
  const remainingAfterSilver = totalPalmsEarned % 3;
  const goldPalms = Math.floor(remainingAfterSilver / 2);
  const bronzePalms = remainingAfterSilver % 2;

  // Tenure calculation (Life -> Eagle: 6 months minimum)
  const calculateTenureMonths = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return Math.max(0, months);
  };

  const activeLifeMonths = calculateTenureMonths(activeTenureStartDate);
  const isTenureComplete = activeLifeMonths >= 6;
  const isLeadershipComplete = leadershipMonths >= 6 && leadershipTitle;
  const isProjectComplete = projectStatus === 'completed' && workbookCompleted && beneficiaryApproval && smApproval && committeeApproval && districtApproval;
  const areReferencesComplete = references.every(r => r.name.trim() && (r.phone.trim() || r.email.trim()));
  const isAmbitionsComplete = statementOfAmbitions.trim().length > 50;

  // Save All Eagle Data to Firestore
  const handleSaveEagleProgress = async () => {
    if (readOnly) return;
    setSaving(true);
    setSaveMsg('');

    try {
      const userRef = doc(db, 'users', scoutUid);
      const updatePayload = {
        joinedTroopDate,
        activeTenureStartDate,
        positionOfResponsibility: {
          title: leadershipTitle,
          startDate: leadershipStartDate,
          endDate: leadershipEndDate,
          durationMonths: Number(leadershipMonths) || 6
        },
        conservationHours: Number(conservationHours) || 0,
        meritBadgesSummary: {
          totalCount: totalEarnedOverall,
          eagleRequiredCount: totalEagleRequiredEarned,
          is21Complete: is21BadgesComplete
        },
        eagleProject: {
          title: projectTitle.trim(),
          beneficiary: projectBeneficiary.trim(),
          status: projectStatus,
          proposalApprovedDate,
          executionStartDate,
          completedDate: projectCompletedDate,
          workbookCompleted,
          beneficiaryApproval,
          smApproval,
          committeeApproval,
          districtApproval,
          scoutHours: projectScoutHours,
          volunteerHours: projectVolunteerHours
        },
        eagleReferences: references,
        statementOfAmbitions: statementOfAmbitions.trim(),
        eaglePalms: {
          totalPalms: totalPalmsEarned,
          silver: silverPalms,
          gold: goldPalms,
          bronze: bronzePalms,
          totalMeritBadges: totalEarnedOverall
        },
        smConferenceDate,
        smConferenceApproved,
        borDate,
        borApproved,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, updatePayload, { merge: true });
      setSaveMsg('✓ Eagle Advancement Record saved successfully!');
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      console.error("Failed to save Eagle progress:", err);
      setSaveMsg('⚠️ Error saving progress: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReferenceChange = (idx, field, value) => {
    const updated = [...references];
    updated[idx] = { ...updated[idx], [field]: value };
    setReferences(updated);
  };

  // Filter Electives for the Modal Picker
  const filteredElectivesForModal = electiveBadges.filter(b => {
    if (!electiveSearch.trim()) return true;
    const q = electiveSearch.toLowerCase();
    return b.name.toLowerCase().includes(q) || (b.category || '').toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading Eagle Advancement Audit Engine...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* ── HERO BANNER: ROAD TO EAGLE MASTER DASHBOARD ── */}
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
                  Rank: {scoutProfile.rank || 'Life Scout'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Road to Eagle Scout & Eagle Palms Portal
              </h2>
              <p className="text-xs text-slate-350 mt-1 max-w-2xl leading-relaxed">
                Automated 6-gate milestone validation, 21-merit badge roadmap planner, project approval checklist, 6 reference contacts, and Eagle Palms calculator for <strong>{scoutProfile.fullName || scoutProfile.username || 'Scout'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <button
              onClick={handleSaveEagleProgress}
              disabled={saving || readOnly}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 hover:scale-[1.02] disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Saving Records...' : 'Save Eagle Record'}</span>
            </button>
          </div>
        </div>

        {/* ── 6 EAGLE MILESTONE PROGRESS GATES OVERVIEW ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6 pt-5 border-t border-slate-700/60 relative z-10 text-xs">
          {/* Gate 1: 21 Badges */}
          <button
            onClick={() => setActiveGateTab('audit')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeGateTab === 'audit'
                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/60 border-slate-750 hover:border-slate-650'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gate 1</span>
              {is21BadgesComplete ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-500" />}
            </div>
            <strong className="text-xs text-white block truncate">21 Merit Badges</strong>
            <span className={`text-[11px] font-bold ${is21BadgesComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {totalEarnedOverall}/21 ({totalEagleRequiredEarned}/14 Req)
            </span>
          </button>

          {/* Gate 2: 6 Mo Tenure & Leadership */}
          <button
            onClick={() => setActiveGateTab('tenure')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeGateTab === 'tenure'
                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/60 border-slate-750 hover:border-slate-650'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gate 2</span>
              {isTenureComplete && isLeadershipComplete ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-500" />}
            </div>
            <strong className="text-xs text-white block truncate">6-Mo Leadership</strong>
            <span className={`text-[11px] font-bold ${isTenureComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeLifeMonths} Mo Active ({leadershipMonths} Mo Lead)
            </span>
          </button>

          {/* Gate 3: Eagle Project */}
          <button
            onClick={() => setActiveGateTab('project')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeGateTab === 'project'
                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/60 border-slate-750 hover:border-slate-650'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gate 3</span>
              {isProjectComplete ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-500" />}
            </div>
            <strong className="text-xs text-white block truncate">Service Project</strong>
            <span className={`text-[11px] font-bold capitalize ${isProjectComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {projectStatus}
            </span>
          </button>

          {/* Gate 4: 6 References */}
          <button
            onClick={() => setActiveGateTab('references')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeGateTab === 'references'
                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/60 border-slate-750 hover:border-slate-650'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gate 4</span>
              {areReferencesComplete ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-500" />}
            </div>
            <strong className="text-xs text-white block truncate">6 References</strong>
            <span className={`text-[11px] font-bold ${areReferencesComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {references.filter(r => r.name.trim()).length}/6 Provided
            </span>
          </button>

          {/* Gate 5: Ambitions Statement */}
          <button
            onClick={() => setActiveGateTab('references')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeGateTab === 'references'
                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/60 border-slate-750 hover:border-slate-650'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gate 5</span>
              {isAmbitionsComplete ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-500" />}
            </div>
            <strong className="text-xs text-white block truncate">Ambitions Essay</strong>
            <span className={`text-[11px] font-bold ${isAmbitionsComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isAmbitionsComplete ? 'Completed' : 'Drafting'}
            </span>
          </button>

          {/* Gate 6: Palms Calculator */}
          <button
            onClick={() => setActiveGateTab('palms')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeGateTab === 'palms'
                ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/60 border-slate-750 hover:border-slate-650'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gate 6</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <strong className="text-xs text-white block truncate">Eagle Palms</strong>
            <span className="text-[11px] font-bold text-amber-300">
              {totalPalmsEarned} Palms Earned
            </span>
          </button>
        </div>
      </div>

      {/* ── GATE 1 DETAIL VIEW: 21 MERIT BADGES & 14 EAGLE CATEGORIES PLANNER & AUDIT ── */}
      {activeGateTab === 'audit' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-7 animate-fadeIn">
          
          {/* Header Title & Plan Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦅</span>
                <h3 className="text-lg font-black text-white">
                  Eagle Merit Badge Blueprint & Requirement Planner
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                To reach Eagle Scout rank, you must earn <strong>21 Total Merit Badges</strong>: 14 Eagle-Required Badges + 7 Elective Badges.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('merit-badges')}
                className="bg-slate-750 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border border-slate-650 flex items-center gap-1.5 shadow-sm"
              >
                <Compass size={14} className="text-teal-400" />
                <span>Open Badges Dashboard</span>
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

          {/* ── SMART EAGLE PROGRESSION & REMAINING COUNTER CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Total 21 Badges Metric */}
            <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Award size={16} className="text-amber-400" />
                  <span>Total Badges For Eagle</span>
                </span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {totalEarnedOverall} / 21
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalEarnedOverall / 21) * 100)}%` }}
                    title={`${totalEarnedOverall} Earned`}
                  />
                  <div 
                    className="bg-amber-400/80 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100 - (totalEarnedOverall / 21) * 100, (totalPlannedOverall / 21) * 100)}%` }}
                    title={`${totalPlannedOverall} Planned`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-emerald-400">✓ {totalEarnedOverall} Earned</span>
                  <span className="text-amber-300">🎯 {totalPlannedOverall} In Plan</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Remaining to Earn:</span>
                <strong className={`font-mono ${totalRemainingOverallToEarn === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalRemainingOverallToEarn === 0 ? '✓ Complete!' : `${totalRemainingOverallToEarn} more needed`}
                </strong>
              </div>
            </div>

            {/* 14 Eagle-Required Badges Metric */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Star size={16} className="text-emerald-400" />
                  <span>Eagle-Required Badges</span>
                </span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {totalEagleRequiredEarned} / 14
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalEagleRequiredEarned / 14) * 100)}%` }}
                    title={`${totalEagleRequiredEarned} Earned`}
                  />
                  <div 
                    className="bg-teal-400/80 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100 - (totalEagleRequiredEarned / 14) * 100, (totalEagleRequiredPlanned / 14) * 100)}%` }}
                    title={`${totalEagleRequiredPlanned} Planned`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-emerald-400">✓ {totalEagleRequiredEarned} Earned</span>
                  <span className="text-teal-300">🎯 {totalEagleRequiredPlanned} In Plan</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Remaining to Plan:</span>
                <strong className={`font-mono ${totalEagleRequiredMissingToPlan === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalEagleRequiredMissingToPlan === 0 ? '✓ 14 Selected!' : `${totalEagleRequiredMissingToPlan} unselected`}
                </strong>
              </div>
            </div>

            {/* 7 Elective Badges Metric */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/40 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                  <Compass size={16} className="text-sky-400" />
                  <span>Elective Badges</span>
                </span>
                <span className="text-xs font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {totalElectivesEarned} / 7
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div 
                    className="bg-sky-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalElectivesEarned / 7) * 100)}%` }}
                    title={`${totalElectivesEarned} Earned`}
                  />
                  <div 
                    className="bg-indigo-400/80 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100 - (totalElectivesEarned / 7) * 100, (totalElectivesPlanned / 7) * 100)}%` }}
                    title={`${totalElectivesPlanned} Planned`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-sky-400">✓ {totalElectivesEarned} Earned</span>
                  <span className="text-indigo-300">🎯 {totalElectivesPlanned} In Plan</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Remaining to Plan:</span>
                <strong className={`font-mono ${totalElectivesMissingToPlan === 0 ? 'text-emerald-400' : 'text-sky-400'}`}>
                  {totalElectivesMissingToPlan === 0 ? '✓ 7 Selected!' : `${totalElectivesMissingToPlan} more needed`}
                </strong>
              </div>
            </div>

          </div>

          {/* ── SMART GUIDANCE ADVICE BANNER ── */}
          <div className="bg-slate-900/80 border border-slate-750 p-4 rounded-2xl flex items-start gap-3">
            <Zap className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div className="text-xs space-y-1">
              <strong className="text-white block">Eagle Candidate Advancement Guidance:</strong>
              {is21BadgesComplete ? (
                <p className="text-emerald-300 leading-relaxed font-semibold">
                  🎉 Outstanding! You have satisfied all 21 Merit Badges and 14 Eagle-Required categories! Make sure to verify your requirements and complete your Eagle Scout Service Project.
                </p>
              ) : is21PlanComplete ? (
                <p className="text-teal-300 leading-relaxed">
                  ⭐ Excellent Planning! You have mapped out all 21 merit badges (14 Eagle-Required + 7 Electives). Continue completing your requirements with your counselors to earn each badge!
                </p>
              ) : (
                <p className="text-slate-300 leading-relaxed">
                  {totalEagleRequiredMissingToPlan > 0 ? (
                    <span>You still need to select <strong>{totalEagleRequiredMissingToPlan} Eagle-Required badges</strong> below. </span>
                  ) : (
                    <span>✓ All 14 Eagle-required categories are selected in your plan! </span>
                  )}
                  {totalElectivesMissingToPlan > 0 && (
                    <span>You also need to select <strong>{totalElectivesMissingToPlan} more elective badges</strong> (use the "+ Add Elective to Plan" button above).</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* ── SECTION A: 14 EAGLE-REQUIRED MERIT BADGES ── */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-base">⚜️</span>
                <span>Part 1: 14 Mandatory Eagle-Required Badges & Choice Groups</span>
              </h4>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {totalEagleRequiredEarned} Earned • {totalEagleRequiredPlanned} Planned
              </span>
            </div>

            {/* 11 Solo Mandatory Badges */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                11 Core Mandatory Badges (All 11 Must Be Completed)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {soloEvaluated.map(b => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                      b.earned
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                        : b.planned || b.inProgress
                        ? 'bg-teal-950/20 border-teal-500/40 shadow-sm'
                        : 'bg-slate-900/70 border-slate-750 hover:border-slate-650'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          b.earned
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : b.inProgress
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : b.planned
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {b.earned ? '✓ Earned' : b.inProgress ? '⏳ In Progress' : b.planned ? '🎯 In Plan' : 'Not In Plan'}
                        </span>
                        {b.pamphletSku && (
                          <span className="text-[9px] text-slate-500 font-mono">SKU #{b.pamphletSku}</span>
                        )}
                      </div>
                      <strong className={`text-xs block ${b.earned ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                        {b.name}
                      </strong>
                      {b.timeAlert && (
                        <p className="text-[10px] text-amber-300/80 mt-1 line-clamp-1" title={b.timeAlert}>
                          ⏳ {b.timeAlert}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleTogglePlanned(b.id, b.planned)}
                        disabled={b.earned || readOnly}
                        className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                          b.earned
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 cursor-default'
                            : b.planned
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-red-950/40 hover:text-red-300'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        {b.earned ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Earned</span>
                          </>
                        ) : b.planned ? (
                          <>
                            <Target size={12} />
                            <span>In Plan (Click to Remove)</span>
                          </>
                        ) : (
                          <>
                            <Plus size={12} />
                            <span>Add to Plan</span>
                          </>
                        )}
                      </button>

                      {b.pamphletUrl && (
                        <a
                          href={b.pamphletUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-teal-700 text-teal-300 hover:text-white border border-slate-700 transition"
                          title="View Official Pamphlet"
                        >
                          <BookOpen size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Alternate Choice Groups */}
            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                3 Alternate Choice Groups (Choose & Complete 1 From Each Group)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Choice Group 1', group: group1Evaluated },
                  { title: 'Choice Group 2', group: group2Evaluated },
                  { title: 'Choice Group 3', group: group3Evaluated }
                ].map(({ title, group }, gIdx) => (
                  <div
                    key={gIdx}
                    className={`p-4 rounded-2xl border space-y-3 ${
                      group.earned
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : group.plannedOrInProgress
                        ? 'bg-teal-950/20 border-teal-500/30'
                        : 'bg-slate-900/60 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <strong className="text-xs font-black text-white block">{title}</strong>
                        <span className="text-[10px] text-slate-400">{group.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        group.earned
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : group.plannedOrInProgress
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {group.earned ? '✓ Completed' : group.plannedOrInProgress ? '🎯 In Plan' : 'Pick 1'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.badges.map(b => (
                        <div
                          key={b.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition ${
                            b.earned
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : b.planned
                              ? 'bg-teal-950/30 border-teal-500/30 text-teal-200'
                              : 'bg-slate-950/50 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="min-w-0">
                            <strong className="block truncate text-xs">{b.name}</strong>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {b.earned ? 'Earned' : b.planned ? 'Planned' : 'Available'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {!b.earned && (
                              <button
                                type="button"
                                onClick={() => handleTogglePlanned(b.id, b.planned)}
                                disabled={readOnly}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                  b.planned
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                }`}
                              >
                                {b.planned ? 'In Plan' : '+ Plan'}
                              </button>
                            )}
                            {b.pamphletUrl && (
                              <a
                                href={b.pamphletUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg bg-slate-850 hover:bg-teal-700 text-teal-300 hover:text-white border border-slate-700 transition"
                                title="View Pamphlet"
                              >
                                <BookOpen size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PART 3: CUSTOM ELECTIVES ROADMAP & RECOMMENDED BADGES HUB ── */}
          <div className="space-y-4 pt-4 border-t border-slate-700/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-base">🎨</span>
                  <span>Part 3: 7 Elective Badges Roadmap & Recommended Badges Hub</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plan your 7 electives by choosing from the recommended badges on the right or browsing all 120+ electives.
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

            {/* Two-Column Studio Layout: Left = Selected Roadmap Slots, Right = Recommended Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (7 Cols): Scout's Selected & Planned Electives Roadmap */}
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

                {/* If NO electives selected, show the Empty State Board */}
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
                          <Plus size={13} className="text-slate-600 group-hover:text-teal-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Render All Selected & Earned Badges */}
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
                                disabled={readOnly}
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

                    {/* Remaining Empty Slot Boxes up to 7 */}
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

              {/* Right Column (5 Cols): Recommended Badges Studio Panel */}
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

                {/* Recommended Badges Scrollable List */}
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
                              disabled={isEarned || readOnly}
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

      {/* ── GATE 2 DETAIL VIEW: TENURE & POSITION OF RESPONSIBILITY ── */}
      {activeGateTab === 'tenure' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="text-emerald-400" size={20} />
              <span>Gate 2: Active Life Scout Tenure & Leadership Position</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 1 & 4: Be active in your troop for at least 6 months as a Life Scout, and serve in an approved position of responsibility for 6 months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Active Tenure */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={15} /> Life Scout Active Tenure (6 Months Req)
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Life Rank Board of Review Date:</label>
                  <input
                    type="date"
                    disabled={readOnly}
                    value={activeTenureStartDate}
                    onChange={(e) => setActiveTenureStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Total Active Months:</span>
                  <strong className={`text-sm font-mono ${isTenureComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {activeLifeMonths} Months {isTenureComplete ? '✓ (Complete)' : '(Needs 6)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Leadership Position */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={15} /> Position of Responsibility (6 Months Req)
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Leadership Position:</label>
                  <select
                    disabled={readOnly}
                    value={leadershipTitle}
                    onChange={(e) => setLeadershipTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
                  >
                    {BSA_LEADERSHIP_POSITIONS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Start Date:</label>
                    <input
                      type="date"
                      disabled={readOnly}
                      value={leadershipStartDate}
                      onChange={(e) => setLeadershipStartDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">End Date:</label>
                    <input
                      type="date"
                      disabled={readOnly}
                      value={leadershipEndDate}
                      onChange={(e) => setLeadershipEndDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Service Duration (Months):</label>
                  <input
                    type="number"
                    min="0"
                    disabled={readOnly}
                    value={leadershipMonths}
                    onChange={(e) => setLeadershipMonths(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GATE 3 DETAIL VIEW: EAGLE SCOUT SERVICE PROJECT ── */}
      {activeGateTab === 'project' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Gate 3: Eagle Scout Service Project Workbook & Approvals</span>
            </h3>
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                  { label: 'Beneficiary Approval', val: beneficiaryApproval, setVal: setBeneficiaryApproval },
                  { label: 'Scoutmaster Approval', val: smApproval, setVal: setSmApproval },
                  { label: 'Troop Committee Approval', val: committeeApproval, setVal: setCommitteeApproval },
                  { label: 'Council / District Approval', val: districtApproval, setVal: setDistrictApproval },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <input
                      type="checkbox"
                      disabled={readOnly}
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

      {/* ── GATE 4 & 5: REFERENCES & AMBITIONS ESSAY ── */}
      {activeGateTab === 'references' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileText className="text-amber-400" size={20} />
              <span>Gate 4 & 5: Eagle Scout Reference Contacts & Ambitions Essay</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 2 & 6: Provide 6 references who can attest to your character, and write a statement of your ambitions and life purpose.
            </p>
          </div>

          {/* 6 References Grid */}
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
                      disabled={readOnly}
                      value={r.name}
                      onChange={(e) => handleReferenceChange(idx, 'name', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      disabled={readOnly}
                      value={r.phone}
                      onChange={(e) => handleReferenceChange(idx, 'phone', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    disabled={readOnly}
                    value={r.email}
                    onChange={(e) => handleReferenceChange(idx, 'email', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ambitions Essay */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Statement of Ambitions and Life Purpose (Requirement 6)
            </h4>
            <textarea
              rows={5}
              disabled={readOnly}
              value={statementOfAmbitions}
              onChange={(e) => setStatementOfAmbitions(e.target.value)}
              placeholder="Attach a statement of your ambitions and life purpose and a listing of positions held in your religious institution, school, camp, community, or other organizations, during which you demonstrated leadership skills. Include honors and awards received during this service."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-white leading-relaxed placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* ── GATE 6: EAGLE PALMS CALCULATOR ── */}
      {activeGateTab === 'palms' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Gate 6: Official Eagle Palms Calculator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              After earning the 21 merit badges required for Eagle Scout, you earn 1 Eagle Palm for every 5 additional merit badges completed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Badges Earned</span>
              <strong className="text-2xl font-black text-white font-mono block">{totalEarnedOverall}</strong>
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

      {/* ── ELECTIVE BADGES PICKER MODAL ── */}
      {showElectiveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-850 border-2 border-teal-500/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
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

            {/* Search input */}
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

            {/* Elective Grid List */}
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
                        disabled={isEarned || readOnly}
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

            {/* Modal Footer */}
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
