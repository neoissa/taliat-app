import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  Award,
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
  ArrowRight,
  Save,
  Check,
  DollarSign,
  Camera,
  HardHat,
  HelpCircle,
  Flame,
  Info
} from 'lucide-react';

const INITIAL_ROADMAP_STATE = {
  phase1: {
    completed: false,
    projectTitle: '',
    beneficiary: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    concept: '',
    checks: {
      metBeneficiary: false,
      lastingValue: false,
      notCommercialOrBsa: false
    }
  },
  phase2: {
    completed: false,
    proposalSections: {
      description: false,
      givingLeadership: false,
      materials: false,
      permits: false,
      costEstimate: false,
      safetyPlan: false
    },
    signatures: {
      beneficiary: false,
      beneficiaryName: '',
      beneficiaryDate: '',
      scoutmaster: false,
      scoutmasterName: '',
      scoutmasterDate: '',
      committee: false,
      committeeName: '',
      committeeDate: '',
      district: false,
      districtName: '',
      districtDate: ''
    }
  },
  phase3: {
    completed: false,
    needsFundraising: false,
    fundraisingApproved: false,
    fundraisingApprovalDate: '',
    budget: '',
    fundsRaised: '',
    checks: {
      stepByStepPlan: false,
      materialsListFinal: false,
      toolsListFinal: false,
      safetyFirstAidKit: false
    }
  },
  phase4: {
    completed: false,
    volunteerLogs: [],
    photosNote: '',
    checks: {
      photosDocumented: false,
      changesDocumented: false,
      safetyBriefingsHeld: false
    }
  },
  phase5: {
    completed: false,
    finalReportText: '',
    leadershipChallengesText: '',
    finalCost: '',
    checks: {
      receiptsOrganized: false,
      siteCleanedUp: false,
      thankYouNotesSent: false
    },
    finalSignatures: {
      beneficiary: false,
      beneficiaryName: '',
      beneficiaryDate: '',
      scoutmaster: false,
      scoutmasterName: '',
      scoutmasterDate: ''
    }
  },
  overallProjectProgress: 0
};

export default function EagleProjectRoadmap({ scoutId, currentUser, onSyncParent }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'assistant_leader';
  const isLeaderOrOwner = isOwner || isLeader;

  const [roadmap, setRoadmap] = useState(INITIAL_ROADMAP_STATE);
  const [activePhase, setActivePhase] = useState('phase1');
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');

  // Volunteer logger form state (Phase 4)
  const [volName, setVolName] = useState('');
  const [volRole, setVolRole] = useState('Youth Scout');
  const [volDate, setVolDate] = useState(new Date().toISOString().split('T')[0]);
  const [volHours, setVolHours] = useState('');
  const [volTask, setVolTask] = useState('');

  // 1. Subscribe in real time to project roadmap document
  useEffect(() => {
    if (!scoutId) return;

    const docRef = doc(db, 'user_progress', scoutId, 'road_to_eagle', 'project_roadmap');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoadmap(prev => ({
          ...prev,
          ...data,
          phase1: { ...prev.phase1, ...(data.phase1 || {}) },
          phase2: { ...prev.phase2, ...(data.phase2 || {}) },
          phase3: { ...prev.phase3, ...(data.phase3 || {}) },
          phase4: { ...prev.phase4, ...(data.phase4 || {}) },
          phase5: { ...prev.phase5, ...(data.phase5 || {}) }
        }));
      }
    }, (err) => console.warn('Roadmap listener fallback:', err));

    return () => unsub();
  }, [scoutId]);

  // Phase Progress Calculations
  const calcPhase1Progress = () => {
    let pts = 0;
    const p = roadmap.phase1;
    if (p.projectTitle?.trim()) pts += 20;
    if (p.beneficiary?.trim()) pts += 20;
    if (p.concept?.trim()) pts += 20;
    if (p.checks?.metBeneficiary) pts += 15;
    if (p.checks?.lastingValue) pts += 15;
    if (p.checks?.notCommercialOrBsa) pts += 10;
    return Math.min(100, pts);
  };

  const calcPhase2Progress = () => {
    let pts = 0;
    const p = roadmap.phase2;
    const secCount = Object.values(p.proposalSections || {}).filter(Boolean).length;
    pts += (secCount / 6) * 40;
    if (p.signatures?.beneficiary) pts += 15;
    if (p.signatures?.scoutmaster) pts += 15;
    if (p.signatures?.committee) pts += 15;
    if (p.signatures?.district) pts += 15;
    return Math.min(100, Math.round(pts));
  };

  const calcPhase3Progress = () => {
    let pts = 0;
    const p = roadmap.phase3;
    if (p.budget) pts += 25;
    const checks = Object.values(p.checks || {}).filter(Boolean).length;
    pts += (checks / 4) * 50;
    if (!p.needsFundraising || (p.needsFundraising && p.fundraisingApproved)) pts += 25;
    return Math.min(100, Math.round(pts));
  };

  const calcPhase4Progress = () => {
    let pts = 0;
    const p = roadmap.phase4;
    if ((p.volunteerLogs || []).length > 0) pts += 40;
    const checks = Object.values(p.checks || {}).filter(Boolean).length;
    pts += (checks / 3) * 60;
    return Math.min(100, Math.round(pts));
  };

  const calcPhase5Progress = () => {
    let pts = 0;
    const p = roadmap.phase5;
    if (p.finalReportText?.trim()) pts += 30;
    if (p.finalCost) pts += 10;
    const checks = Object.values(p.checks || {}).filter(Boolean).length;
    pts += (checks / 3) * 20;
    if (p.finalSignatures?.beneficiary) pts += 20;
    if (p.finalSignatures?.scoutmaster) pts += 20;
    return Math.min(100, Math.round(pts));
  };

  const p1Pct = calcPhase1Progress();
  const p2Pct = calcPhase2Progress();
  const p3Pct = calcPhase3Progress();
  const p4Pct = calcPhase4Progress();
  const p5Pct = calcPhase5Progress();

  const overallProgress = Math.round((p1Pct + p2Pct + p3Pct + p4Pct + p5Pct) / 5);

  // Volunteer hours aggregation
  const volunteerLogs = roadmap.phase4.volunteerLogs || [];
  const totalVolunteerHours = volunteerLogs.reduce((sum, v) => sum + (Number(v.hours) || 0), 0);
  const youthVolunteerHours = volunteerLogs.filter(v => v.role?.toLowerCase().includes('youth')).reduce((sum, v) => sum + (Number(v.hours) || 0), 0);
  const adultVolunteerHours = volunteerLogs.filter(v => v.role?.toLowerCase().includes('adult')).reduce((sum, v) => sum + (Number(v.hours) || 0), 0);

  // Save to Firestore
  const handleSaveRoadmap = async (customRoadmap = roadmap) => {
    if (!scoutId) return;
    setSaving(true);
    setSaveFeedback('');

    try {
      const docRef = doc(db, 'user_progress', scoutId, 'road_to_eagle', 'project_roadmap');
      const userRef = doc(db, 'users', scoutId);
      const eagleDataRef = doc(db, 'user_progress', scoutId, 'road_to_eagle', 'data');

      const updatedRoadmap = {
        ...customRoadmap,
        overallProjectProgress: overallProgress,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, updatedRoadmap, { merge: true });

      // Synchronize summary to user profile & eagle data document
      const summaryPayload = {
        eagleProject: {
          title: customRoadmap.phase1.projectTitle || '',
          beneficiary: customRoadmap.phase1.beneficiary || '',
          beneficiaryContact: customRoadmap.phase1.contactName || '',
          stage: customRoadmap.phase5.completed ? 'completed' : customRoadmap.phase4.completed ? 'report' : customRoadmap.phase3.completed ? 'execution' : customRoadmap.phase2.completed ? 'planning' : 'proposal',
          beneficiaryApproval: !!customRoadmap.phase2.signatures?.beneficiary,
          smApproval: !!customRoadmap.phase2.signatures?.scoutmaster,
          committeeApproval: !!customRoadmap.phase2.signatures?.committee,
          districtApproval: !!customRoadmap.phase2.signatures?.district,
          workbookCompleted: !!customRoadmap.phase2.completed,
          finalReportSigned: !!customRoadmap.phase5.finalSignatures?.scoutmaster,
          volunteerLogs: customRoadmap.phase4.volunteerLogs || []
        }
      };

      await setDoc(userRef, summaryPayload, { merge: true });
      await setDoc(eagleDataRef, summaryPayload, { merge: true });

      if (onSyncParent) onSyncParent(summaryPayload.eagleProject);

      setSaveFeedback('✓ Eagle Project Roadmap saved & synchronized in real time!');
      setTimeout(() => setSaveFeedback(''), 4000);
    } catch (err) {
      console.error('Error saving roadmap:', err);
      setSaveFeedback('⚠️ Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add volunteer entry
  const handleAddVolunteer = (e) => {
    e.preventDefault();
    if (!volName.trim() || !volHours) return;

    const newEntry = {
      id: Date.now().toString(),
      name: volName.trim(),
      role: volRole,
      date: volDate,
      hours: Number(volHours) || 0,
      task: volTask.trim()
    };

    const nextLogs = [...volunteerLogs, newEntry];
    const nextRoadmap = {
      ...roadmap,
      phase4: {
        ...roadmap.phase4,
        volunteerLogs: nextLogs
      }
    };
    setRoadmap(nextRoadmap);
    handleSaveRoadmap(nextRoadmap);

    setVolName('');
    setVolHours('');
    setVolTask('');
  };

  // Delete volunteer entry
  const handleDeleteVolunteer = (id) => {
    const nextLogs = volunteerLogs.filter(v => v.id !== id);
    const nextRoadmap = {
      ...roadmap,
      phase4: {
        ...roadmap.phase4,
        volunteerLogs: nextLogs
      }
    };
    setRoadmap(nextRoadmap);
    handleSaveRoadmap(nextRoadmap);
  };

  const PHASES_LIST = [
    { id: 'phase1', number: '1', title: 'Concept & Beneficiary', progress: p1Pct, isDone: roadmap.phase1.completed },
    { id: 'phase2', number: '2', title: 'Proposal & 4 Approvals', progress: p2Pct, isDone: roadmap.phase2.completed },
    { id: 'phase3', number: '3', title: 'Fundraising & Planning', progress: p3Pct, isDone: roadmap.phase3.completed },
    { id: 'phase4', number: '4', title: 'Execution & Hours Log', progress: p4Pct, isDone: roadmap.phase4.completed },
    { id: 'phase5', number: '5', title: 'Report & Final Sign-Off', progress: p5Pct, isDone: roadmap.phase5.completed }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── HEADER CARD WITH OVERALL PROGRESS ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Milestone 4 Roadmap
              </span>
              <span className="text-xs text-amber-300 font-bold">
                Official BSA Eagle Scout Service Project Engine (Pub. 512-927)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Eagle Scout Service Project Interactive Workflow</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Step through all 5 official phases of your Eagle Project. Complete required sub-tasks, secure mandatory signatures, log volunteer service hours, and finalize your project report!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://www.scouting.org/wp-content/uploads/2021/04/512-927_2021-Eagle-Project-Workbook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Download size={13} />
              <span>Official BSA PDF</span>
            </a>

            <button
              onClick={() => handleSaveRoadmap()}
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Project'}</span>
            </button>
          </div>
        </div>

        {/* Overall Project Progress Bar */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Overall Project Journey Completion</span>
            </span>
            <strong className="text-sm font-black text-amber-400 font-mono">{overallProgress}% Completed</strong>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-750">
            <div
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {saveFeedback && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold p-3 rounded-xl text-center animate-fadeIn shadow-md">
            {saveFeedback}
          </div>
        )}
      </div>

      {/* ── 5-PHASE INTERACTIVE STEPPER NAVIGATION ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {PHASES_LIST.map((phase) => {
          const isActive = activePhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/60 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-amber-400">
                  Phase {phase.number}
                </span>
                {phase.isDone ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{phase.progress}%</span>
                )}
              </div>

              <strong className="text-xs text-white block truncate leading-tight mt-1">
                {phase.title}
              </strong>
            </button>
          );
        })}
      </div>

      {/* ──────────────── PHASE 1: CONCEPT & BENEFICIARY SELECTION ──────────────── */}
      {activePhase === 'phase1' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Instructions */}
          <div className="bg-slate-900/80 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1.5 text-xs text-slate-200">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={15} />
              <span>Phase 1 Guidelines: Concept & Beneficiary Selection</span>
            </h4>
            <p>
              Your Eagle Scout service project must benefit a religious institution, school, or community organization (such as a park, municipality, or non-profit).
            </p>
            <p className="text-amber-200/90 font-medium">
              ⚠️ <strong>Strict Rules:</strong> The project <em>CANNOT</em> benefit the Boy Scouts of America (BSA properties/camps), cannot benefit commercial/for-profit businesses, and cannot be routine maintenance (e.g. mowing grass).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Project & Beneficiary Form Inputs */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Project & Beneficiary Details
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Project Title / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Center Courtyard Garden & Educational Pavilion"
                  value={roadmap.phase1.projectTitle || ''}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase1: { ...roadmap.phase1, projectTitle: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Beneficiary Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Center of Greater Detroit"
                  value={roadmap.phase1.beneficiary || ''}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase1: { ...roadmap.phase1, beneficiary: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ahmed Hassan"
                    value={roadmap.phase1.contactName || ''}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase1: { ...roadmap.phase1, contactName: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Contact Phone / Email
                  </label>
                  <input
                    type="text"
                    placeholder="Phone or Email"
                    value={roadmap.phase1.contactPhone || ''}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase1: { ...roadmap.phase1, contactPhone: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Brief Concept & Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the problem being solved, who will benefit, and what will be constructed or created..."
                  value={roadmap.phase1.concept || ''}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase1: { ...roadmap.phase1, concept: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            </div>

            {/* Right: Sub-task Checklist & Progress */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Phase 1 Feasibility Checklist
                </h4>

                <div className="space-y-3 text-xs">
                  <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase1.checks?.metBeneficiary}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase1: {
                          ...roadmap.phase1,
                          checks: { ...roadmap.phase1.checks, metBeneficiary: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                    />
                    <span>Met with the beneficiary representative in person to discuss initial needs, constraints, and project feasibility.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase1.checks?.lastingValue}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase1: {
                          ...roadmap.phase1,
                          checks: { ...roadmap.phase1.checks, lastingValue: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                    />
                    <span>Verified that the proposed project provides lasting community value and will involve planning, developing, and giving leadership to others.</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase1.checks?.notCommercialOrBsa}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase1: {
                          ...roadmap.phase1,
                          checks: { ...roadmap.phase1.checks, notCommercialOrBsa: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                    />
                    <span>Confirmed that the project does NOT benefit a commercial business, is not on BSA property, and is not routine maintenance.</span>
                  </label>
                </div>
              </div>

              {/* Mark Phase Completed Toggle */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phase 1 Progress:</span>
                  <strong className="text-amber-400 font-mono text-sm">{p1Pct}%</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextRoadmap = {
                      ...roadmap,
                      phase1: { ...roadmap.phase1, completed: !roadmap.phase1.completed }
                    };
                    setRoadmap(nextRoadmap);
                    handleSaveRoadmap(nextRoadmap);
                  }}
                  className={`text-xs px-4 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                    roadmap.phase1.completed
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                  }`}
                >
                  <Check size={14} />
                  <span>{roadmap.phase1.completed ? '✓ Phase 1 Completed' : 'Mark Phase 1 Done'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── PHASE 2: PROPOSAL & 4 MANDATORY SIGNATURES ──────────────── */}
      {activePhase === 'phase2' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Instructions */}
          <div className="bg-slate-900/80 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1.5 text-xs text-slate-200">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={15} />
              <span>Phase 2 Guidelines: Proposal & Mandatory Approvals</span>
            </h4>
            <p>
              Fill out the formal <strong>Eagle Scout Service Project Proposal</strong> in the workbook. Before <em>any</em> physical construction or fundraising begins, you must obtain all 4 required signatures in sequential order.
            </p>
            <p className="text-amber-200/90 font-medium">
              ⚠️ <strong>Critical Rule:</strong> Work done before securing all 4 official approval signatures cannot be counted toward your Eagle Project!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Proposal Sub-sections Checklist */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Workbook Proposal Sub-Sections
              </h4>

              <div className="space-y-2.5 text-xs">
                {[
                  { key: 'description', label: '1. Project Description & Beneficiary Impact' },
                  { key: 'givingLeadership', label: '2. Giving Leadership (Recruitment & Supervision Plan)' },
                  { key: 'materials', label: '3. Materials, Supplies, Tools & Other Needs' },
                  { key: 'permits', label: '4. Permits & Permissions Required' },
                  { key: 'costEstimate', label: '5. Preliminary Cost Estimate & Funding Sources' },
                  { key: 'safetyPlan', label: '6. Safety Hazards & First Aid Mitigation Plan' }
                ].map(sec => (
                  <label key={sec.key} className="flex items-center gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase2.proposalSections?.[sec.key]}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          proposalSections: {
                            ...roadmap.phase2.proposalSections,
                            [sec.key]: e.target.checked
                          }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>{sec.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Right: 4 Mandatory Signatures */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  4 Mandatory Official Signatures
                </h4>

                {/* Sig 1: Beneficiary */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase2.signatures?.beneficiary}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, beneficiary: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>1. Beneficiary Representative Approval</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Signer Name"
                      value={roadmap.phase2.signatures?.beneficiaryName || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, beneficiaryName: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="date"
                      value={roadmap.phase2.signatures?.beneficiaryDate || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, beneficiaryDate: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Sig 2: Scoutmaster */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase2.signatures?.scoutmaster}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, scoutmaster: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>2. Scoutmaster / Unit Leader Approval</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Scoutmaster Name"
                      value={roadmap.phase2.signatures?.scoutmasterName || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, scoutmasterName: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="date"
                      value={roadmap.phase2.signatures?.scoutmasterDate || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, scoutmasterDate: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Sig 3: Committee */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase2.signatures?.committee}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, committee: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>3. Unit Committee Chair Approval</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Committee Chair Name"
                      value={roadmap.phase2.signatures?.committeeName || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, committeeName: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="date"
                      value={roadmap.phase2.signatures?.committeeDate || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, committeeDate: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Sig 4: District */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase2.signatures?.district}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, district: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>4. District / Council Advancement Approval</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="District Chair Name"
                      value={roadmap.phase2.signatures?.districtName || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, districtName: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="date"
                      value={roadmap.phase2.signatures?.districtDate || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase2: {
                          ...roadmap.phase2,
                          signatures: { ...roadmap.phase2.signatures, districtDate: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Mark Phase Completed Toggle */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phase 2 Progress:</span>
                  <strong className="text-amber-400 font-mono text-sm">{p2Pct}%</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextRoadmap = {
                      ...roadmap,
                      phase2: { ...roadmap.phase2, completed: !roadmap.phase2.completed }
                    };
                    setRoadmap(nextRoadmap);
                    handleSaveRoadmap(nextRoadmap);
                  }}
                  className={`text-xs px-4 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                    roadmap.phase2.completed
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                  }`}
                >
                  <Check size={14} />
                  <span>{roadmap.phase2.completed ? '✓ Phase 2 Completed' : 'Mark Phase 2 Done'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── PHASE 3: FUNDRAISING & DETAILED PLANNING ──────────────── */}
      {activePhase === 'phase3' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Instructions */}
          <div className="bg-slate-900/80 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1.5 text-xs text-slate-200">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={15} />
              <span>Phase 3 Guidelines: Fundraising Application & Detailed Plan</span>
            </h4>
            <p>
              If funds are needed outside of the beneficiary, unit, chartered organization, or the Scout\'s family, submit an official <strong>Eagle Scout Project Fundraising Application</strong> to Council for written approval.
            </p>
            <p className="text-amber-200/90 font-medium">
              Complete the extensive "Project Plan" section in the workbook before starting hands-on leadership!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Financials & Fundraising Form */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Financial Planning & Fundraising
              </h4>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase3.needsFundraising}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: { ...roadmap.phase3, needsFundraising: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Fundraising from outside sources is required for this project</span>
                </label>

                {roadmap.phase3.needsFundraising && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <label className="flex items-center gap-2 text-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!roadmap.phase3.fundraisingApproved}
                        onChange={(e) => setRoadmap({
                          ...roadmap,
                          phase3: { ...roadmap.phase3, fundraisingApproved: e.target.checked }
                        })}
                        className="w-4 h-4 rounded text-emerald-500"
                      />
                      <span>Council / District Project Fundraising Application Officially Approved</span>
                    </label>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Approval Date</label>
                      <input
                        type="date"
                        value={roadmap.phase3.fundraisingApprovalDate || ''}
                        onChange={(e) => setRoadmap({
                          ...roadmap,
                          phase3: { ...roadmap.phase3, fundraisingApprovalDate: e.target.value }
                        })}
                        className="w-full bg-slate-900 border border-slate-750 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Estimated Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={roadmap.phase3.budget || ''}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: { ...roadmap.phase3, budget: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Funds Raised So Far ($)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={roadmap.phase3.fundsRaised || ''}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: { ...roadmap.phase3, fundsRaised: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Right: Detailed Planning Checklist */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3 text-xs">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detailed Project Plan Checklist
                </h4>

                <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase3.checks?.stepByStepPlan}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: {
                        ...roadmap.phase3,
                        checks: { ...roadmap.phase3.checks, stepByStepPlan: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                  />
                  <span>Step-by-step construction, landscaping, or execution plan thoroughly outlined in workbook.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase3.checks?.materialsListFinal}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: {
                        ...roadmap.phase3,
                        checks: { ...roadmap.phase3.checks, materialsListFinal: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                  />
                  <span>Comprehensive materials and supplies list finalized with exact quantities and supplier quotes.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase3.checks?.toolsListFinal}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: {
                        ...roadmap.phase3,
                        checks: { ...roadmap.phase3.checks, toolsListFinal: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                  />
                  <span>Tool list finalized with designated adult supervision for all power tools per the Guide to Safe Scouting.</span>
                </label>

                <label className="flex items-start gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase3.checks?.safetyFirstAidKit}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase3: {
                        ...roadmap.phase3,
                        checks: { ...roadmap.phase3.checks, safetyFirstAidKit: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500 mt-0.5"
                  />
                  <span>Safety plan prepared: First Aid kit on site, emergency contact list, hydration & weather plan, required PPE.</span>
                </label>
              </div>

              {/* Mark Phase Completed Toggle */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phase 3 Progress:</span>
                  <strong className="text-amber-400 font-mono text-sm">{p3Pct}%</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextRoadmap = {
                      ...roadmap,
                      phase3: { ...roadmap.phase3, completed: !roadmap.phase3.completed }
                    };
                    setRoadmap(nextRoadmap);
                    handleSaveRoadmap(nextRoadmap);
                  }}
                  className={`text-xs px-4 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                    roadmap.phase3.completed
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                  }`}
                >
                  <Check size={14} />
                  <span>{roadmap.phase3.completed ? '✓ Phase 3 Completed' : 'Mark Phase 3 Done'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── PHASE 4: LEADERSHIP & EXECUTION (VOLUNTEER HOURS LOGGER) ──────────────── */}
      {activePhase === 'phase4' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Instructions */}
          <div className="bg-slate-900/80 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1.5 text-xs text-slate-200">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={15} />
              <span>Phase 4 Guidelines: Leadership & Volunteer Execution</span>
            </h4>
            <p>
              Direct, supervise, and lead your volunteers during project execution. The Scout acts as the general contractor and leader, directing others and enforcing safety rather than simply doing physical work alone.
            </p>
            <p className="text-amber-200/90 font-medium">
              Keep exact records of all volunteer hours logged, separated by youth and adult volunteers.
            </p>
          </div>

          {/* Volunteer Hours KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-amber-500/40 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Volunteer Hours</span>
              <strong className="text-2xl font-black text-amber-400 font-mono">{totalVolunteerHours} Hrs</strong>
            </div>

            <div className="bg-slate-900/80 border border-emerald-500/40 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Youth Scout Hours</span>
              <strong className="text-2xl font-black text-emerald-400 font-mono">{youthVolunteerHours} Hrs</strong>
            </div>

            <div className="bg-slate-900/80 border border-sky-500/40 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Adult Volunteer Hours</span>
              <strong className="text-2xl font-black text-sky-400 font-mono">{adultVolunteerHours} Hrs</strong>
            </div>

            <div className="bg-slate-900/80 border border-slate-750 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sessions Logged</span>
              <strong className="text-2xl font-black text-white font-mono">{volunteerLogs.length} Entries</strong>
            </div>
          </div>

          {/* Volunteer Hours Table & Add Entry Form */}
          <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Log Volunteer Service Hours
            </h4>

            <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 text-xs">
              <input
                type="text"
                placeholder="Volunteer Name"
                value={volName}
                onChange={(e) => setVolName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white sm:col-span-2"
                required
              />

              <select
                value={volRole}
                onChange={(e) => setVolRole(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white cursor-pointer"
              >
                <option value="Youth Scout">Youth Scout</option>
                <option value="Adult Volunteer">Adult Volunteer</option>
                <option value="Other Youth">Other Youth</option>
                <option value="Beneficiary Staff">Beneficiary Staff</option>
              </select>

              <input
                type="date"
                value={volDate}
                onChange={(e) => setVolDate(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
              />

              <input
                type="number"
                step="0.5"
                min="0.5"
                placeholder="Hours"
                value={volHours}
                onChange={(e) => setVolHours(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-md"
              >
                <Plus size={14} />
                <span>Add Log</span>
              </button>

              <input
                type="text"
                placeholder="Tasks Performed (e.g. Assembled garden benches, painted pavilion railings)"
                value={volTask}
                onChange={(e) => setVolTask(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white sm:col-span-6"
              />
            </form>

            {/* Volunteer Logs Table */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 pt-2 border-t border-slate-800 text-xs">
              {volunteerLogs.length === 0 ? (
                <p className="text-slate-500 text-xs italic text-center py-6">No volunteer hours logged yet. Add your work sessions above.</p>
              ) : (
                volunteerLogs.map(v => (
                  <div key={v.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{v.name}</strong>
                        <span className={`text-[9px] px-2 py-0.2 rounded-full font-bold uppercase ${
                          v.role?.includes('Youth') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                        }`}>
                          {v.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{v.date} • {v.task || 'General leadership & construction'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <strong className="text-amber-400 font-black font-mono text-sm">{v.hours} hrs</strong>
                      <button
                        type="button"
                        onClick={() => handleDeleteVolunteer(v.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 transition cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Execution Checklist */}
          <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Execution & Leadership Checklist
            </h4>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  checked={!!roadmap.phase4.checks?.photosDocumented}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase4: {
                      ...roadmap.phase4,
                      checks: { ...roadmap.phase4.checks, photosDocumented: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Captured comprehensive Before, During, and After project photos for the workbook.</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  checked={!!roadmap.phase4.checks?.changesDocumented}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase4: {
                      ...roadmap.phase4,
                      checks: { ...roadmap.phase4.checks, changesDocumented: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Documented any deviations or changes made from the original proposal with reasons.</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  checked={!!roadmap.phase4.checks?.safetyBriefingsHeld}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase4: {
                      ...roadmap.phase4,
                      checks: { ...roadmap.phase4.checks, safetyBriefingsHeld: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Conducted daily safety briefings, assigned buddy pairs, and enforced hydration/PPE.</span>
              </label>
            </div>

            {/* Mark Phase Completed Toggle */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phase 4 Progress:</span>
                <strong className="text-amber-400 font-mono text-sm">{p4Pct}%</strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextRoadmap = {
                    ...roadmap,
                    phase4: { ...roadmap.phase4, completed: !roadmap.phase4.completed }
                  };
                  setRoadmap(nextRoadmap);
                  handleSaveRoadmap(nextRoadmap);
                }}
                className={`text-xs px-4 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  roadmap.phase4.completed
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                }`}
              >
                <Check size={14} />
                <span>{roadmap.phase4.completed ? '✓ Phase 4 Completed' : 'Mark Phase 4 Done'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── PHASE 5: REPORT & FINAL SIGN-OFFS ──────────────── */}
      {activePhase === 'phase5' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Instructions */}
          <div className="bg-slate-900/80 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-1.5 text-xs text-slate-200">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={15} />
              <span>Phase 5 Guidelines: Project Report & Final Sign-Offs</span>
            </h4>
            <p>
              Complete the Project Report section in the official workbook. Detail your project outcomes, how you exercised leadership, what challenges you overcame, and summarize the financial accounting.
            </p>
            <p className="text-amber-200/90 font-medium">
              Obtain the final completion signatures from the Beneficiary Representative and your Scoutmaster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Final Project Reflections */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Final Project Report & Leadership Reflection
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Summary of Project Success & Leadership Challenges Overcome
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail what went well, how you led others when problems arose, and the lasting impact on the community..."
                  value={roadmap.phase5.finalReportText || ''}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase5: { ...roadmap.phase5, finalReportText: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Actual Final Project Cost ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1420"
                  value={roadmap.phase5.finalCost || ''}
                  onChange={(e) => setRoadmap({
                    ...roadmap,
                    phase5: { ...roadmap.phase5, finalCost: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase5.checks?.receiptsOrganized}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase5: {
                        ...roadmap.phase5,
                        checks: { ...roadmap.phase5.checks, receiptsOrganized: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>All receipts, invoices, and leftover materials accounted for.</span>
                </label>

                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase5.checks?.siteCleanedUp}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase5: {
                        ...roadmap.phase5,
                        checks: { ...roadmap.phase5.checks, siteCleanedUp: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Project site fully cleaned and returned in pristine condition.</span>
                </label>

                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!roadmap.phase5.checks?.thankYouNotesSent}
                    onChange={(e) => setRoadmap({
                      ...roadmap,
                      phase5: {
                        ...roadmap.phase5,
                        checks: { ...roadmap.phase5.checks, thankYouNotesSent: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Thank you letters sent to donors, volunteers, and supporters.</span>
                </label>
              </div>
            </div>

            {/* Right: 2 Mandatory Final Sign-Offs */}
            <div className="bg-slate-900/60 border border-slate-750 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  2 Mandatory Final Completion Approvals
                </h4>

                {/* Final Sig 1: Beneficiary */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase5.finalSignatures?.beneficiary}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase5: {
                          ...roadmap.phase5,
                          finalSignatures: { ...roadmap.phase5.finalSignatures, beneficiary: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>1. Beneficiary Final Completion Sign-Off</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Beneficiary Signer"
                      value={roadmap.phase5.finalSignatures?.beneficiaryName || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase5: {
                          ...roadmap.phase5,
                          finalSignatures: { ...roadmap.phase5.finalSignatures, beneficiaryName: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="date"
                      value={roadmap.phase5.finalSignatures?.beneficiaryDate || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase5: {
                          ...roadmap.phase5,
                          finalSignatures: { ...roadmap.phase5.finalSignatures, beneficiaryDate: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Final Sig 2: Scoutmaster */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!roadmap.phase5.finalSignatures?.scoutmaster}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase5: {
                          ...roadmap.phase5,
                          finalSignatures: { ...roadmap.phase5.finalSignatures, scoutmaster: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span>2. Scoutmaster Final Completion Sign-Off</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Scoutmaster Signer"
                      value={roadmap.phase5.finalSignatures?.scoutmasterName || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase5: {
                          ...roadmap.phase5,
                          finalSignatures: { ...roadmap.phase5.finalSignatures, scoutmasterName: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="date"
                      value={roadmap.phase5.finalSignatures?.scoutmasterDate || ''}
                      onChange={(e) => setRoadmap({
                        ...roadmap,
                        phase5: {
                          ...roadmap.phase5,
                          finalSignatures: { ...roadmap.phase5.finalSignatures, scoutmasterDate: e.target.value }
                        }
                      })}
                      className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Mark Phase Completed Toggle */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phase 5 Progress:</span>
                  <strong className="text-amber-400 font-mono text-sm">{p5Pct}%</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextRoadmap = {
                      ...roadmap,
                      phase5: { ...roadmap.phase5, completed: !roadmap.phase5.completed }
                    };
                    setRoadmap(nextRoadmap);
                    handleSaveRoadmap(nextRoadmap);
                  }}
                  className={`text-xs px-4 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                    roadmap.phase5.completed
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                  }`}
                >
                  <Check size={14} />
                  <span>{roadmap.phase5.completed ? '✓ Project Finished & Signed!' : 'Mark Project Complete'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
