import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { MERIT_BADGES } from '../data/meritBadges';
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
  Check
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

const DEFAULT_REFERENCES = [
  { type: 'Parents / Guardians', name: '', address: '', phone: '', email: '' },
  { type: 'Religious Leader', name: '', address: '', phone: '', email: '' },
  { type: 'Educational / Principal / Teacher', name: '', address: '', phone: '', email: '' },
  { type: 'Employer (or N/A if student)', name: '', address: '', phone: '', email: '' },
  { type: 'Reference 1 (Personal / Character)', name: '', address: '', phone: '', email: '' },
  { type: 'Reference 2 (Personal / Character)', name: '', address: '', phone: '', email: '' }
];

export default function RoadToEagleTracker({ currentUser, scoutId: propScoutId, readOnly = false }) {
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

  // 2. Subscribe to Merit Badges Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
      setLoading(false);
    });
    return () => unsub();
  }, [scoutUid]);

  // ── AUDIT ENGINE: VALIDATE 21 MERIT BADGES & 14 EAGLE CATEGORIES ──
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

  // Grouped Eagle Categories
  const mandatorySoloBadges = [
    { id: 'first_aid', name: 'First Aid' },
    { id: 'citizenship_in_society', name: 'Citizenship in Society' },
    { id: 'citizenship_in_the_community', name: 'Citizenship in the Community' },
    { id: 'citizenship_in_the_nation', name: 'Citizenship in the Nation' },
    { id: 'citizenship_in_the_world', name: 'Citizenship in the World' },
    { id: 'communication', name: 'Communication' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'personal_fitness', name: 'Personal Fitness' },
    { id: 'personal_management', name: 'Personal Management' },
    { id: 'camping', name: 'Camping' },
    { id: 'family_life', name: 'Family Life' },
  ];

  const group1Badges = [
    { id: 'emergency_preparedness', name: 'Emergency Preparedness' },
    { id: 'lifesaving', name: 'Lifesaving' }
  ];

  const group2Badges = [
    { id: 'environmental_science', name: 'Environmental Science' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  const group3Badges = [
    { id: 'swimming', name: 'Swimming' },
    { id: 'hiking', name: 'Hiking' },
    { id: 'cycling', name: 'Cycling' }
  ];

  // Evaluate Solo Badges
  const soloEvaluated = mandatorySoloBadges.map(b => ({ ...b, earned: isBadgeEarned(b.id) }));
  const group1Evaluated = { name: 'Emergency Prep OR Lifesaving', earned: group1Badges.some(b => isBadgeEarned(b.id)), badges: group1Badges.map(b => ({ ...b, earned: isBadgeEarned(b.id) })) };
  const group2Evaluated = { name: 'Environmental Science OR Sustainability', earned: group2Badges.some(b => isBadgeEarned(b.id)), badges: group2Badges.map(b => ({ ...b, earned: isBadgeEarned(b.id) })) };
  const group3Evaluated = { name: 'Swimming OR Hiking OR Cycling', earned: group3Badges.some(b => isBadgeEarned(b.id)), badges: group3Badges.map(b => ({ ...b, earned: isBadgeEarned(b.id) })) };

  const eagleCategoriesPassedCount = 
    soloEvaluated.filter(b => b.earned).length + 
    (group1Evaluated.earned ? 1 : 0) + 
    (group2Evaluated.earned ? 1 : 0) + 
    (group3Evaluated.earned ? 1 : 0);

  const totalEarnedBadges = MERIT_BADGES.filter(b => isBadgeEarned(b.id));
  const totalEarnedCount = totalEarnedBadges.length;
  const electivesCount = Math.max(0, totalEarnedCount - eagleCategoriesPassedCount);
  const totalTarget21Count = Math.min(14, eagleCategoriesPassedCount) + Math.min(7, electivesCount);
  const is21BadgesComplete = eagleCategoriesPassedCount >= 14 && totalEarnedCount >= 21;

  // ── EAGLE PALMS CALCULATOR ──
  // 1 Palm for every 5 badges beyond 21
  const extraBadgesBeyond21 = Math.max(0, totalEarnedCount - 21);
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
          totalCount: totalEarnedCount,
          eagleRequiredCount: eagleCategoriesPassedCount,
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
          totalMeritBadges: totalEarnedCount
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
                Automated 6-gate milestone validation, 21-merit badge audit engine, project approval checklist, 6 reference contacts, and Eagle Palms calculator for <strong>{scoutProfile.fullName || scoutProfile.username || 'Scout'}</strong>.
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
              {totalTarget21Count}/21 ({eagleCategoriesPassedCount}/14 Req)
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

      {/* ── GATE 1 DETAIL VIEW: 21 MERIT BADGES & 14 EAGLE CATEGORIES AUDIT ── */}
      {activeGateTab === 'audit' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CheckSquare className="text-amber-400" size={20} />
                <span>Merit Badge Audit Engine (14 Eagle-Required + 7 Electives)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every Eagle Scout candidate must earn 21 merit badges, satisfying all 14 mandatory categories below.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
                is21BadgesComplete
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {is21BadgesComplete ? '✓ 21 Badges Requirement Satisfied!' : `Missing ${14 - eagleCategoriesPassedCount} Req / ${Math.max(0, 21 - totalEarnedCount)} Total`}
              </span>
            </div>
          </div>

          {/* 11 Solo Mandatory Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              11 Core Mandatory Eagle Badges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {soloEvaluated.map(b => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                    b.earned
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-750 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {b.earned ? (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-slate-600 shrink-0" />
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

          {/* 3 Alternate Choice Groups */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              3 Alternate Choice Groups (1 Required From Each Group)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group 1 */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                group1Evaluated.earned ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-750'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-300">Choice Group 1</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    group1Evaluated.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {group1Evaluated.earned ? '✓ Satisfied' : 'Pick 1'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group1Evaluated.badges.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className={b.earned ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{b.name}</span>
                      {b.earned && <Check size={13} className="text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2 */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                group2Evaluated.earned ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-750'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-300">Choice Group 2</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    group2Evaluated.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {group2Evaluated.earned ? '✓ Satisfied' : 'Pick 1'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group2Evaluated.badges.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className={b.earned ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{b.name}</span>
                      {b.earned && <Check size={13} className="text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3 */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                group3Evaluated.earned ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-750'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-300">Choice Group 3</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    group3Evaluated.earned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {group3Evaluated.earned ? '✓ Satisfied' : 'Pick 1'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group3Evaluated.badges.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/50 border border-slate-800">
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
            {/* Tenure Tracker */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={15} className="text-amber-400" />
                <span>Life Scout Tenure Dates</span>
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Life Rank Conferred / Active Tenure Start Date
                </label>
                <input
                  type="date"
                  value={activeTenureStartDate}
                  onChange={(e) => setActiveTenureStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Joined Troop Date
                </label>
                <input
                  type="date"
                  value={joinedTroopDate}
                  onChange={(e) => setJoinedTroopDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Active Life Tenure:</span>
                <strong className={`font-black ${isTenureComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {activeLifeMonths} Months {isTenureComplete ? '(✓ >= 6 Mo Complete)' : '(Need 6 Mo)'}
                </strong>
              </div>
            </div>

            {/* Leadership Position Tracker */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Approved Position of Responsibility</span>
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  BSA Leadership Position Held
                </label>
                <select
                  value={leadershipTitle}
                  onChange={(e) => setLeadershipTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {BSA_LEADERSHIP_POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={leadershipEndDate}
                    onChange={(e) => setLeadershipEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Duration Served (Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={leadershipMonths}
                  onChange={(e) => setLeadershipMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GATE 3 DETAIL VIEW: EAGLE SCOUT SERVICE PROJECT WORKFLOW ── */}
      {activeGateTab === 'project' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Award className="text-amber-400" size={20} />
              <span>Gate 3: Eagle Scout Service Project Management</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 5: Plan, develop, and give leadership to others in a service project helpful to any religious institution, school, or community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Project Title / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mosque Library Renovation & Book Cataloging"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Beneficiary Organization & Contact
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Center of America / Director Br. Ali"
                  value={projectBeneficiary}
                  onChange={(e) => setProjectBeneficiary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Execution Start Date</label>
                  <input
                    type="date"
                    value={executionStartDate}
                    onChange={(e) => setExecutionStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Completed Date</label>
                  <input
                    type="date"
                    value={projectCompletedDate}
                    onChange={(e) => setProjectCompletedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Candidate Leadership Hours</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={projectScoutHours}
                    onChange={(e) => setProjectScoutHours(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Volunteer Helper Hours</label>
                  <input
                    type="number"
                    placeholder="e.g. 180"
                    value={projectVolunteerHours}
                    onChange={(e) => setProjectVolunteerHours(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Approval Checklist */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-3.5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare size={16} />
                <span>4 Mandatory Project Approvals & Workbook</span>
              </h4>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={beneficiaryApproval}
                  onChange={(e) => setBeneficiaryApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200">1. Beneficiary Representative Approval</span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smApproval}
                  onChange={(e) => setSmApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200">2. Scoutmaster / Unit Leader Approval</span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={committeeApproval}
                  onChange={(e) => setCommitteeApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200">3. Unit Committee Chair Approval</span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={districtApproval}
                  onChange={(e) => setDistrictApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200">4. District / Council Advancement Committee Approval</span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={workbookCompleted}
                  onChange={(e) => setWorkbookCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <strong className="text-xs text-emerald-300 font-bold">5. Official Eagle Project Workbook Completed & Signed</strong>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── GATE 4 & 5 DETAIL VIEW: 6 REFERENCES & STATEMENT OF AMBITIONS ── */}
      {activeGateTab === 'references' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Users className="text-amber-400" size={20} />
              <span>Gate 4 & 5: 6 Character References & Statement of Ambitions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requirement 2 & 6: Attach names and contacts of 6 individuals who know you well, and write your Statement of Ambitions and Life Purpose.
            </p>
          </div>

          {/* 6 References Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              6 Required Reference Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {references.map((ref, idx) => (
                <div key={idx} className="bg-slate-900/70 border border-slate-750 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-black text-amber-300 truncate">{ref.type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Ref #{idx + 1}</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={ref.name}
                    onChange={(e) => handleReferenceChange(idx, 'name', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />

                  <input
                    type="text"
                    placeholder="Mailing Address, City, State"
                    value={ref.address}
                    onChange={(e) => handleReferenceChange(idx, 'address', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={ref.phone}
                      onChange={(e) => handleReferenceChange(idx, 'phone', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={ref.email}
                      onChange={(e) => handleReferenceChange(idx, 'email', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statement of Ambitions Editor */}
          <div className="space-y-2 pt-3 border-t border-slate-700/60">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={15} className="text-emerald-400" />
              <span>Statement of Ambitions and Life Purpose</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Attach a statement of your ambitions, life purpose, and a listing of positions held in community, school, camp, and religious organization with honors and awards.
            </p>
            <textarea
              rows={6}
              value={statementOfAmbitions}
              onChange={(e) => setStatementOfAmbitions(e.target.value)}
              placeholder="Write your personal statement of ambitions, goals in life and college/career, leadership reflections, and faith values..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400 placeholder-slate-500"
            />
          </div>
        </div>
      )}

      {/* ── GATE 6 DETAIL VIEW: EAGLE PALMS CALCULATOR & TRACKER ── */}
      {activeGateTab === 'palms' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>Eagle Palms Calculator & Multi-Palm Recognition</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Earn 1 Palm for every 5 merit badges beyond the 21 required for Eagle. Palms can be awarded concurrently at the Eagle Board of Review or post-Eagle!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bronze Palm */}
            <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border-2 border-amber-700/50 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥉</span>
              <h4 className="font-extrabold text-sm text-amber-200">Bronze Palm</h4>
              <p className="text-[11px] text-slate-400">5 Additional Merit Badges</p>
              <div className="text-2xl font-black text-white pt-2">{bronzePalms} Earned</div>
            </div>

            {/* Gold Palm */}
            <div className="bg-gradient-to-br from-yellow-950/30 to-slate-900 border-2 border-yellow-500/50 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥇</span>
              <h4 className="font-extrabold text-sm text-yellow-300">Gold Palm</h4>
              <p className="text-[11px] text-slate-400">10 Additional Merit Badges</p>
              <div className="text-2xl font-black text-white pt-2">{goldPalms} Earned</div>
            </div>

            {/* Silver Palm */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-400/50 p-5 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥈</span>
              <h4 className="font-extrabold text-sm text-slate-200">Silver Palm</h4>
              <p className="text-[11px] text-slate-400">15 Additional Merit Badges</p>
              <div className="text-2xl font-black text-white pt-2">{silverPalms} Earned</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-750 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Total Merit Badges Earned:</span>
              <span className="text-amber-400 text-sm font-black">{totalEarnedCount} Badges</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Additional Badges Beyond 21:</span>
              <span className="font-mono">{extraBadgesBeyond21} Badges</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Total Palms Concurrently Earned at Eagle BOR:</span>
              <span className="text-emerald-400 font-black">{totalPalmsEarned} Palms Total ({silverPalms} Silver, {goldPalms} Gold, {bronzePalms} Bronze)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
