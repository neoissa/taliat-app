import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { MERIT_BADGES } from '../data/meritBadges';
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
  ChevronUp
} from 'lucide-react';
import RankIcon from './RankIcon';

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
  const [activeMilestone, setActiveMilestone] = useState('tenure');

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
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubBadges();
    };
  }, [activeScoutId]);

  // ── 21 MERIT BADGES AUDIT EVALUATION ──
  const isBadgeEarned = (badgeId) => {
    const p = meritProgress[badgeId];
    if (!p) return false;
    if (p.completed === true || p.dateCompleted) return true;
    const badge = MERIT_BADGES.find(b => b.id === badgeId);
    if (!badge || !badge.requirements) return false;
    const total = badge.requirements.length;
    const approved = badge.requirements.filter(r => p.steps?.[r.id] === true || p.steps?.[r.id]?.completed === true).length;
    return total > 0 && approved === total;
  };

  // 14 Mandatory Eagle Categories
  const mandatory11Solo = [
    { id: 'first_aid', name: 'First Aid', slug: 'first-aid' },
    { id: 'citizenship_in_the_community', name: 'Citizenship in the Community', slug: 'citizenship-in-the-community' },
    { id: 'citizenship_in_the_nation', name: 'Citizenship in the Nation', slug: 'citizenship-in-the-nation' },
    { id: 'citizenship_in_society', name: 'Citizenship in Society', slug: 'citizenship-in-society' },
    { id: 'citizenship_in_the_world', name: 'Citizenship in the World', slug: 'citizenship-in-the-world' },
    { id: 'communication', name: 'Communication', slug: 'communication' },
    { id: 'cooking', name: 'Cooking', slug: 'cooking' },
    { id: 'personal_fitness', name: 'Personal Fitness', slug: 'personal-fitness' },
    { id: 'personal_management', name: 'Personal Management', slug: 'personal-management' },
    { id: 'camping', name: 'Camping', slug: 'camping' },
    { id: 'family_life', name: 'Family Life', slug: 'family-life' }
  ];

  const groupA = [
    { id: 'emergency_preparedness', name: 'Emergency Preparedness' },
    { id: 'lifesaving', name: 'Lifesaving' }
  ];

  const groupB = [
    { id: 'environmental_science', name: 'Environmental Science' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  const groupC = [
    { id: 'swimming', name: 'Swimming' },
    { id: 'hiking', name: 'Hiking' },
    { id: 'cycling', name: 'Cycling' }
  ];

  const soloEvaluated = mandatory11Solo.map(b => ({ ...b, earned: isBadgeEarned(b.id) }));
  const groupAEvaluated = { name: 'Emergency Preparedness OR Lifesaving', earned: groupA.some(b => isBadgeEarned(b.id)), badges: groupA.map(b => ({ ...b, earned: isBadgeEarned(b.id) })) };
  const groupBEvaluated = { name: 'Environmental Science OR Sustainability', earned: groupB.some(b => isBadgeEarned(b.id)), badges: groupB.map(b => ({ ...b, earned: isBadgeEarned(b.id) })) };
  const groupCEvaluated = { name: 'Swimming OR Hiking OR Cycling', earned: groupC.some(b => isBadgeEarned(b.id)), badges: groupC.map(b => ({ ...b, earned: isBadgeEarned(b.id) })) };

  const eagleCategoriesPassed = 
    soloEvaluated.filter(b => b.earned).length +
    (groupAEvaluated.earned ? 1 : 0) +
    (groupBEvaluated.earned ? 1 : 0) +
    (groupCEvaluated.earned ? 1 : 0);

  const allEarnedBadges = MERIT_BADGES.filter(b => isBadgeEarned(b.id));
  const totalBadgesEarnedCount = allEarnedBadges.length;
  const electivesCount = Math.max(0, totalBadgesEarnedCount - eagleCategoriesPassed);
  const totalEaglePathBadgesCount = Math.min(14, eagleCategoriesPassed) + Math.min(7, electivesCount);
  const is21BadgesSatisfied = eagleCategoriesPassed >= 14 && totalBadgesEarnedCount >= 21;

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
      const eagleDocRef = doc(db, 'user_progress', activeScoutId, 'road_to_eagle', 'data');

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
        meritBadgesSummary: {
          totalCount: totalBadgesEarnedCount,
          eagleRequiredCount: eagleCategoriesPassed,
          is21Complete: is21BadgesSatisfied
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
        eaglePalms: {
          totalPalms: totalPalmsEarned,
          silver: silverPalms,
          gold: goldPalms,
          bronze: bronzePalms,
          totalMeritBadges: totalBadgesEarnedCount
        },
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, payload, { merge: true });
      await setDoc(eagleDocRef, payload, { merge: true });

      setSaveSuccess('✓ Road to Eagle progress saved and synchronized in real time!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to save Road to Eagle data:', err);
      setSaveSuccess('⚠️ Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add volunteer hour log
  const handleAddVolunteerLog = (e) => {
    e.preventDefault();
    if (!newVolName.trim() || !newVolHours) return;

    const newEntry = {
      id: Date.now().toString(),
      name: newVolName.trim(),
      date: newVolDate,
      hours: Number(newVolHours) || 0,
      category: newVolCategory
    };

    setVolunteerLogs([...volunteerLogs, newEntry]);
    setNewVolName('');
    setNewVolHours('');
  };

  const handleDeleteVolunteerLog = (id) => {
    setVolunteerLogs(volunteerLogs.filter(v => v.id !== id));
  };

  const handleRefChange = (index, field, val) => {
    const next = [...references];
    next[index] = { ...next[index], [field]: val };
    setReferences(next);
  };

  const scoutName = scoutProfile.fullName || scoutProfile.username || 'Scout';
  const scoutRank = scoutProfile.rank || 'Life Scout';

  const RANKS_PIPELINE = [
    { id: 'scout', label: 'Scout' },
    { id: 'tenderfoot', label: 'Tenderfoot' },
    { id: 'secondclass', label: '2nd Class' },
    { id: 'firstclass', label: '1st Class' },
    { id: 'star', label: 'Star' },
    { id: 'life', label: 'Life' },
    { id: 'eagle', label: '🦅 Eagle' },
    { id: 'palms', label: '🪶 Palms' }
  ];

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading Road to Eagle Portal...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-16">
      {/* ── 1. HERO HEADER: ROAD TO EAGLE INTERACTIVE PORTAL ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/50 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute right-4 top-2 opacity-10 pointer-events-none">
          <Award size={220} className="text-amber-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-950/60 shrink-0">
              🦅
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Star size={11} /> Official Scouting America Eagle Milestone Portal
                </span>
                <span className="bg-slate-800 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Candidate: {scoutName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Road to Eagle Scout & Eagle Palms Portal
              </h1>
              <p className="text-xs text-slate-350 mt-1 max-w-2xl leading-relaxed">
                Complete your self-guided journey to Scouting\'s highest rank: track active Life tenure, qualifying leadership, 21 merit badges, the Eagle service project, 6 references, and Eagle Palms!
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
              {totalEaglePathBadgesCount}/21 <span className="text-[10px] text-slate-400">({eagleCategoriesPassed}/14 Req)</span>
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

        {/* ── INTERACTIVE VISUAL PROGRESSION PIPELINE ── */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 relative z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
            BSA Scout Advancement Pipeline:
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {RANKS_PIPELINE.map((r, i) => {
              const isPastOrCurrent = true; // pipeline active representation
              const isEagleOrPalms = r.id === 'eagle' || r.id === 'palms';
              return (
                <div
                  key={r.id}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    isEagleOrPalms
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 font-black shadow-sm'
                      : 'bg-slate-900/50 border-slate-750 text-slate-300'
                  }`}
                >
                  <span className="text-xs">{r.label}</span>
                </div>
              );
            })}
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
          { id: 'tenure', label: '1. Tenure & Service', icon: '⏱️', isDone: tenureStats.isMet },
          { id: 'leadership', label: '2. 6-Mo Leadership', icon: '⚜️', isDone: isLeadershipSatisfied },
          { id: 'badges', label: '3. 21 Merit Badges', icon: '🏅', isDone: is21BadgesSatisfied },
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
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Life Board of Review & Active Date
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Life Scout Board of Review Date
                </label>
                <input
                  type="date"
                  value={lifeBorDate}
                  onChange={(e) => setLifeBorDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Initial Joined Troop Date
                </label>
                <input
                  type="date"
                  value={joinedTroopDate}
                  onChange={(e) => setJoinedTroopDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Elapsed Time & Verification Banner */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Active Tenure Countdown & Verification
                </h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Elapsed Active Time:</span>
                    <strong className="text-white font-mono text-sm">{tenureStats.days} Days ({tenureStats.months} Months)</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Requirement Status:</span>
                    <strong className={`font-black ${tenureStats.isMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tenureStats.isMet ? '✓ 6-Month Tenure Satisfied (180+ Days)' : `${tenureStats.remainingDays} Days Remaining`}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeTenureChecklist.regularAttendance}
                    onChange={(e) => setActiveTenureChecklist({ ...activeTenureChecklist, regularAttendance: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Maintained regular troop meeting & campout attendance</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeTenureChecklist.scoutSpirit}
                    onChange={(e) => setActiveTenureChecklist({ ...activeTenureChecklist, scoutSpirit: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Demonstrated Scout Oath, Law, and Scout Spirit in daily life</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 2: LEADERSHIP IN POSITION OF RESPONSIBILITY ──────────────── */}
      {activeMilestone === 'leadership' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} />
              <span>Milestone 2: Leadership in Position of Responsibility (6 Months Minimum)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 4: Serve actively in one or more qualifying leadership positions for at least six months while a Life Scout.
            </p>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-200 space-y-1">
            <strong className="text-amber-300 font-bold block">⚠️ Important BSA Leadership Qualification Rules:</strong>
            <p>
              Qualifying troop positions include SPL, ASPL, Patrol Leader, Troop Guide, OA Rep, Den Chief, Scribe, Librarian, Historian, Quartermaster, JASM, Chaplain Aide, Instructor, Webmaster, and Outdoor Ethics Guide.
            </p>
            <p className="text-amber-300/90 font-medium">
              * Note: Assistant Patrol Leader (APL) and Bugler do <strong>NOT</strong> qualify for Eagle Scout rank leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Select Qualifying Leadership Role
                </label>
                <select
                  value={leadershipRole}
                  onChange={(e) => setLeadershipRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {QUALIFYING_LEADERSHIP_POSITIONS.map(p => (
                    <option key={p.title} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leadershipStartDate}
                    onChange={(e) => setLeadershipStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={leadershipEndDate}
                    onChange={(e) => setLeadershipEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Months Served in Position
                </label>
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
                      {leadershipMonths} Months {isLeadershipSatisfied ? '(✓ $\ge 6$ Mo Complete)' : '(Need 6 Mo)'}
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

      {/* ──────────────── MILESTONE 3: 21 MERIT BADGES AUDIT ENGINE ──────────────── */}
      {activeMilestone === 'badges' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" size={20} />
                <span>Milestone 3: 21 Merit Badges Audit Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Requirement 3: Earn a total of 21 merit badges (14 Eagle-required categories + 7 electives).
              </p>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('merit-badges')}
              className="bg-slate-700 hover:bg-slate-650 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore All 137 Badges</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* 11 Solo Core Eagle Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              11 Solo Mandatory Eagle-Required Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {soloEvaluated.map(b => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2.5 transition ${
                    b.earned
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-750 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {b.earned ? (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-slate-600 shrink-0" />
                    )}
                    <span className={`text-xs font-bold truncate ${b.earned ? 'text-white' : 'text-slate-300'}`}>
                      {b.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    b.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {b.earned ? '✓ Earned' : 'Needed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Alternate Groups */}
          <div className="space-y-3 pt-3 border-t border-slate-700/60">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              3 Alternate Choice Groups (Pick 1 from each group)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group A */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                groupAEvaluated.earned ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-750'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-300">Group A (Prep / Lifesaving)</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    groupAEvaluated.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {groupAEvaluated.earned ? '✓ Satisfied' : 'Pick 1'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {groupAEvaluated.badges.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className={b.earned ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{b.name}</span>
                      {b.earned && <Check size={13} className="text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group B */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                groupBEvaluated.earned ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-750'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-300">Group B (Environment)</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    groupBEvaluated.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {groupBEvaluated.earned ? '✓ Satisfied' : 'Pick 1'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {groupBEvaluated.badges.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className={b.earned ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{b.name}</span>
                      {b.earned && <Check size={13} className="text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group C */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                groupCEvaluated.earned ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-750'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-300">Group C (Physical / Outdoor)</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    groupCEvaluated.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {groupCEvaluated.earned ? '✓ Satisfied' : 'Pick 1'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {groupCEvaluated.badges.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className={b.earned ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{b.name}</span>
                      {b.earned && <Check size={13} className="text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 4: EAGLE SCOUT SERVICE PROJECT ROADMAP ──────────────── */}
      {activeMilestone === 'project' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" size={20} />
                <span>Milestone 4: Eagle Scout Service Project Roadmap</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Requirement 5: Plan, develop, and give leadership to others in a service project helpful to a religious institution, school, or community.
              </p>
            </div>

            <a
              href="https://www.scouting.org/wp-content/uploads/2021/04/512-927_2021-Eagle-Project-Workbook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shrink-0"
            >
              <Download size={14} />
              <span>Official BSA Workbook (512-927)</span>
            </a>
          </div>

          {/* 5 Project Phases Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'concept', step: 'Phase 1', title: 'Concept & Beneficiary' },
              { id: 'proposal', step: 'Phase 2', title: 'Proposal & 4 Signatures' },
              { id: 'fundraising', step: 'Phase 3', title: 'Fundraising App' },
              { id: 'execution', step: 'Phase 4', title: 'Leadership & Execution' },
              { id: 'report', step: 'Phase 5', title: 'Final Report & Sign-off' }
            ].map(phase => (
              <button
                key={phase.id}
                onClick={() => setProjectStage(phase.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  projectStage === phase.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                    : 'bg-slate-900/60 border-slate-750 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase block">{phase.step}</span>
                <strong className="text-xs text-white block truncate">{phase.title}</strong>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project Details & Approvals */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mosque Courtyard Garden & Community Pavilion"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Beneficiary Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Center of America"
                  value={projectBeneficiary}
                  onChange={(e) => setProjectBeneficiary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-amber-300 uppercase">4 Mandatory Signatures</h4>
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={beneficiaryApproved}
                    onChange={(e) => setBeneficiaryApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>1. Beneficiary Representative Approval</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smApproved}
                    onChange={(e) => setSmApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>2. Scoutmaster / Unit Leader Approval</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={committeeApproved}
                    onChange={(e) => setCommitteeApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>3. Unit Committee Chair Approval</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={districtApproved}
                    onChange={(e) => setDistrictApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>4. District / Council Advancement Committee Approval</span>
                </label>
              </div>
            </div>

            {/* Volunteer Hours Logger Table */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Volunteer Hours Table ({totalVolunteerHours} Total Hrs)
                </h3>
              </div>

              <form onSubmit={handleAddVolunteerLog} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Volunteer Name"
                  value={newVolName}
                  onChange={(e) => setNewVolName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                />
                <input
                  type="number"
                  placeholder="Hours"
                  value={newVolHours}
                  onChange={(e) => setNewVolHours(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  + Add Log
                </button>
              </form>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {volunteerLogs.length === 0 ? (
                  <p className="text-slate-500 text-xs italic text-center py-4">No volunteer hours logged yet.</p>
                ) : (
                  volunteerLogs.map(v => (
                    <div key={v.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <strong className="text-white block">{v.name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{v.date} • {v.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">{v.hours} hrs</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteVolunteerLog(v.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 5: REFERENCES & STATEMENT OF AMBITIONS ──────────────── */}
      {activeMilestone === 'references' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Users className="text-amber-400" size={20} />
              <span>Milestone 5: 6 Character References & Statement of Ambitions</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 2 & 6: Provide contact information for six references and compose your Statement of Ambitions and Life Purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {references.map((ref, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-750 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-black text-amber-300 block truncate">{ref.type}</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={ref.name}
                  onChange={(e) => handleRefChange(idx, 'name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Mailing Address"
                  value={ref.address}
                  onChange={(e) => handleRefChange(idx, 'address', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={ref.phone}
                    onChange={(e) => handleRefChange(idx, 'phone', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={ref.email}
                    onChange={(e) => handleRefChange(idx, 'email', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Statement of Ambitions Editor */}
          <div className="space-y-2 pt-3 border-t border-slate-700/60">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={15} className="text-emerald-400" />
              <span>Statement of Ambitions and Life Purpose</span>
            </h3>
            <textarea
              rows={7}
              value={statementOfAmbitions}
              onChange={(e) => setStatementOfAmbitions(e.target.value)}
              placeholder="Write your personal statement of ambitions, goals in life, reflections on Islamic and Scout values, and a listing of leadership positions held outside of scouting..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 6: SCOUTMASTER CONFERENCE & EAGLE BOR ──────────────── */}
      {activeMilestone === 'bor' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Milestone 6: Scoutmaster Conference & Eagle Board of Review</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Final steps: Official Rank Application, Scoutmaster Conference, Council Verification, and the District Eagle Board of Review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-amber-300 uppercase text-xs">Eagle Application Steps</h3>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appCompleted}
                  onChange={(e) => setAppCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>1. Official Eagle Scout Rank Application Fully Completed</span>
              </label>

              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smConferenceSigned}
                  onChange={(e) => setSmConferenceSigned(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>2. Scoutmaster Conference Successfully Completed & Signed</span>
              </label>

              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={councilVerified}
                  onChange={(e) => setCouncilVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>3. Council Service Center Verified Records & Approved for BOR</span>
              </label>
            </div>

            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-emerald-300 uppercase text-xs">Eagle Board of Review</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Board of Review Date</label>
                <input
                  type="date"
                  value={borDate}
                  onChange={(e) => setBorDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <label className="flex items-center gap-2 text-slate-200 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={borPassed}
                  onChange={(e) => setBorPassed(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <strong className="text-emerald-400 font-bold">4. Eagle Scout Board of Review Passed (Eagle Rank Conferred!) 🦅</strong>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── MILESTONE 7: EAGLE PALMS EXPANSION MODULE ──────────────── */}
      {activeMilestone === 'palms' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Milestone 7: Eagle Palms Recognition & Expansion Module</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              1 Palm for every 5 merit badges earned beyond the 21 required for Eagle. Concurrently awarded at the Eagle Board of Review!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border-2 border-amber-700/50 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥉</span>
              <h3 className="font-extrabold text-sm text-amber-200">Bronze Palm</h3>
              <p className="text-[11px] text-slate-400">5 Additional Merit Badges</p>
              <div className="text-2xl font-black text-white pt-2">{bronzePalms} Earned</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-950/30 to-slate-900 border-2 border-yellow-500/50 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥇</span>
              <h3 className="font-extrabold text-sm text-yellow-300">Gold Palm</h3>
              <p className="text-[11px] text-slate-400">10 Additional Merit Badges</p>
              <div className="text-2xl font-black text-white pt-2">{goldPalms} Earned</div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-400/50 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥈</span>
              <h3 className="font-extrabold text-sm text-slate-200">Silver Palm</h3>
              <p className="text-[11px] text-slate-400">15 Additional Merit Badges</p>
              <div className="text-2xl font-black text-white pt-2">{silverPalms} Earned</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-750 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Total Merit Badges Earned:</span>
              <span className="text-amber-400 text-sm font-black">{totalBadgesEarnedCount} Badges</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Additional Badges Beyond 21:</span>
              <span className="font-mono">{extraBadgesBeyond21} Badges</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Total Palms Concurrently Earned:</span>
              <span className="text-emerald-400 font-black">{totalPalmsEarned} Palms Total ({silverPalms} Silver, {goldPalms} Gold, {bronzePalms} Bronze)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
