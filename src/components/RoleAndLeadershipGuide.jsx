// src/components/RoleAndLeadershipGuide.jsx
import React, { useState } from 'react';
import { 
  Crown, 
  Shield, 
  User, 
  Users, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Star, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Info, 
  Zap, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { getRoleGuide, ALL_ROLES_ARRAY } from '../data/rolesData';
import { 
  TROOP_POSITIONS, 
  TROOP_POSITIONS_CATEGORIES, 
  findPositionByTitle, 
  YOUTH_LEADERSHIP_POSITIONS, 
  ADULT_LEADERSHIP_POSITIONS, 
  EAGLE_QUALIFYING_POSITIONS 
} from '../data/troopPositions';

export default function RoleAndLeadershipGuide({ currentUser, userData }) {
  const profile = userData || currentUser || {};
  const role = profile.role || 'scout';
  const leaderPosition = profile.leaderPosition || '';
  
  // Resolve system role guide
  const myRoleGuide = getRoleGuide(role, leaderPosition);

  // Check for assigned BSA Position of Responsibility
  // Can be in profile.positionOfResponsibility (object or string) or profile.leaderPosition
  let assignedPositionObj = null;
  let tenureData = null;

  if (profile.positionOfResponsibility) {
    if (typeof profile.positionOfResponsibility === 'object') {
      const posTitle = profile.positionOfResponsibility.title || '';
      assignedPositionObj = findPositionByTitle(posTitle);
      tenureData = profile.positionOfResponsibility;
    } else if (typeof profile.positionOfResponsibility === 'string') {
      assignedPositionObj = findPositionByTitle(profile.positionOfResponsibility);
      tenureData = {
        title: profile.positionOfResponsibility,
        durationMonths: 6,
        startDate: '',
        endDate: '',
        approved: false
      };
    }
  }

  // Fallback for adult leaders if not explicitly in positionOfResponsibility
  if (!assignedPositionObj && leaderPosition) {
    assignedPositionObj = findPositionByTitle(leaderPosition);
  }

  // Directory state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPositionId, setExpandedPositionId] = useState(assignedPositionObj?.id || null);
  const [activeGuideView, setActiveGuideView] = useState('my-role'); // 'my-role' | 'directory' | 'all-system-roles'

  // Filter positions
  const filteredPositions = TROOP_POSITIONS.filter(pos => {
    // Category filter
    if (selectedCategory === 'senior' && pos.category !== TROOP_POSITIONS_CATEGORIES.SENIOR_YOUTH) return false;
    if (selectedCategory === 'specialized' && pos.category !== TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH) return false;
    if (selectedCategory === 'adult' && pos.category !== TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP) return false;
    if (selectedCategory === 'eagle' && !pos.eagleQualifying) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = pos.title.toLowerCase().includes(q);
      const matchShort = pos.shortName.toLowerCase().includes(q);
      const matchSummary = pos.summary.toLowerCase().includes(q);
      const matchDuties = pos.coreDuties.some(d => d.toLowerCase().includes(q));
      return matchTitle || matchShort || matchSummary || matchDuties;
    }

    return true;
  });

  // Calculate tenure progress if assigned
  let tenurePercent = 0;
  let elapsedMonths = 0;
  if (tenureData?.startDate) {
    const start = new Date(tenureData.startDate);
    const end = tenureData.endDate ? new Date(tenureData.endDate) : new Date();
    const diffMonths = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
    elapsedMonths = diffMonths;
    const required = Number(tenureData.durationMonths) || 6;
    tenurePercent = Math.min(100, Math.round((elapsedMonths / required) * 100));
  } else if (tenureData?.durationMonths) {
    elapsedMonths = Number(tenureData.durationMonths);
    tenurePercent = tenureData.approved ? 100 : Math.min(100, Math.round((elapsedMonths / 6) * 100));
  }

  return (
    <div className="space-y-6 text-left">
      {/* ── TOP HEADER CONTROLS ── */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-emerald-400" />
            <h3 className="text-lg font-black text-white">Account Permissions & Leadership Role Guide</h3>
          </div>
          <p className="text-xs text-slate-400">
            Granular system capabilities, troop responsibilities, and official BSA troop position standards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-750 self-stretch sm:self-auto overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveGuideView('my-role')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeGuideView === 'my-role'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={13} />
            <span>My Account & Assigned Role</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuideView('directory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeGuideView === 'directory'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass size={13} />
            <span>BSA Troop Directory ({TROOP_POSITIONS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGuideView('all-system-roles')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeGuideView === 'all-system-roles'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={13} />
            <span>App Roles Matrix</span>
          </button>
        </div>
      </div>

      {/* ── 1. MY ACCOUNT & ASSIGNED BSA POSITION VIEW ── */}
      {activeGuideView === 'my-role' && (
        <div className="space-y-6">
          {/* Section A: My Account Level & App Permissions */}
          <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-2xl shrink-0 shadow-md">
                  {role === 'owner' ? '👑' : role === 'leader' ? '⚜️' : role === 'parent' ? '👨‍👩‍👧' : '🏕️'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-white">{myRoleGuide.positionName}</h4>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${myRoleGuide.badgeClass}`}>
                      {myRoleGuide.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    System Scope: <strong className="text-emerald-400">{myRoleGuide.accessScope}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {myRoleGuide.keyFeatures.map((feat) => (
                  <span key={feat} className="text-[10px] bg-slate-900 border border-slate-750 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              &ldquo;{myRoleGuide.tagline}&rdquo;
            </p>

            {/* Dual Grid: System Capabilities vs Core Responsibilities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column: What You Can Do in This App */}
              <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-4.5 space-y-3.5 shadow-md">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider border-b border-slate-800 pb-2.5">
                  <Zap size={14} className="text-emerald-400" />
                  <span>⚡ What You Can Do in This App (System Capabilities)</span>
                </div>
                <div className="space-y-3">
                  {myRoleGuide.appPermissions.map((perm, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-slate-850/60 p-2.5 rounded-xl border border-slate-750/60">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-white">{perm.title}</h5>
                        <p className="text-[11px] text-slate-350 leading-relaxed mt-0.5">{perm.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Your Core Unit Responsibilities */}
              <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-4.5 space-y-3.5 shadow-md">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider border-b border-slate-800 pb-2.5">
                  <Award size={14} className="text-amber-400" />
                  <span>🎯 Your Core Responsibilities & Unit Duties</span>
                </div>
                <div className="space-y-3">
                  {myRoleGuide.unitResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-slate-850/60 p-2.5 rounded-xl border border-slate-750/60">
                      <Star size={15} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-white">{resp.title}</h5>
                        <p className="text-[11px] text-slate-350 leading-relaxed mt-0.5">{resp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Assigned Official BSA Position & Tenure Card */}
          <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-amber-400" />
                <h4 className="text-base font-extrabold text-white">Official BSA Troop Position of Responsibility</h4>
              </div>
              {assignedPositionObj && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${
                  assignedPositionObj.eagleQualifying 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {assignedPositionObj.eagleQualifying ? '🦅 Eagle Qualifying' : 'Star / Life Qualifying'}
                </span>
              )}
            </div>

            {assignedPositionObj ? (
              <div className="space-y-5">
                {/* Hero Position Card */}
                <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl shrink-0 shadow-md">
                        {assignedPositionObj.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black text-white">{assignedPositionObj.title}</h3>
                          <span className="text-xs bg-slate-900 border border-slate-700 text-amber-300 font-mono px-2 py-0.5 rounded-lg font-bold">
                            {assignedPositionObj.shortName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{assignedPositionObj.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Position Details Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-800">
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Category</span>
                      <span className="font-semibold text-slate-200 text-xs">{assignedPositionObj.category}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Reports To</span>
                      <span className="font-semibold text-slate-200 text-xs">{assignedPositionObj.reportsTo}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Min. Rank</span>
                      <span className="font-semibold text-slate-200 text-xs">{assignedPositionObj.minRank}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Selection</span>
                      <span className="font-semibold text-slate-200 text-xs truncate block" title={assignedPositionObj.selectionMethod}>
                        {assignedPositionObj.selectionMethod}
                      </span>
                    </div>
                  </div>

                  {/* 6-Month Tenure Tracker */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-750 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-amber-400" />
                        <span className="font-bold text-xs text-white">Tenure of Responsibility Tracker (Star / Life / Eagle)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {tenureData?.approved 
                          ? '✓ Certified & Approved by Scoutmaster' 
                          : `${elapsedMonths} / ${tenureData?.durationMonths || 6} Months (${tenurePercent}%)`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          tenurePercent >= 100 || tenureData?.approved
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-amber-500 to-amber-400'
                        }`}
                        style={{ width: `${tenureData?.approved ? 100 : tenurePercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                      <span>Start: {tenureData?.startDate || 'Not specified'}</span>
                      <span>Target: 6 consecutive months minimum</span>
                      <span>End: {tenureData?.endDate || 'Active / In-Progress'}</span>
                    </div>
                  </div>
                </div>

                {/* Core Duties Breakdown */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-400" />
                    <span>Official BSA Core Duties for this Role:</span>
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {assignedPositionObj.coreDuties.map((duty, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{duty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leadership Expectations */}
                {assignedPositionObj.leadershipExpectations && (
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Leadership Expectations & Scout Spirit:</span>
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                      {assignedPositionObj.leadershipExpectations.map((exp, idx) => (
                        <li key={idx} className="leading-relaxed">{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto text-xl">
                  🧭
                </div>
                <h5 className="font-bold text-white text-sm">No Active BSA Troop Position Recorded</h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  For the <strong>Star</strong>, <strong>Life</strong>, and <strong>Eagle</strong> ranks, you must serve actively in a qualifying position of responsibility for at least 4 to 6 months.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveGuideView('directory')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                  >
                    <Compass size={13} />
                    <span>Explore Available Troop Positions &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. OFFICIAL BSA TROOP POSITIONS DIRECTORY ── */}
      {activeGuideView === 'directory' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-850 border border-slate-700/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search positions (e.g. SPL, Quartermaster, Eagle)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full md:w-auto">
              {[
                { id: 'all', label: `All (${TROOP_POSITIONS.length})` },
                { id: 'senior', label: '👑 Senior Youth' },
                { id: 'specialized', label: '🧭 Specialized Roles' },
                { id: 'eagle', label: '🦅 Eagle Qualifying' },
                { id: 'adult', label: '🛡️ Adult Leadership' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedCategory(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === f.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-750 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Positions Accordion Grid */}
          <div className="space-y-3">
            {filteredPositions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm bg-slate-850 rounded-2xl border border-slate-800">
                No BSA positions matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredPositions.map((pos) => {
                const isExpanded = expandedPositionId === pos.id;
                const isAssignedToMe = assignedPositionObj?.id === pos.id;

                return (
                  <div
                    key={pos.id}
                    className={`border rounded-2xl transition duration-200 overflow-hidden shadow-md ${
                      isAssignedToMe
                        ? 'bg-slate-850 border-amber-500/60 shadow-amber-950/20'
                        : isExpanded
                        ? 'bg-slate-850 border-slate-650'
                        : 'bg-slate-850/80 border-slate-750/70 hover:border-slate-650'
                    }`}
                  >
                    {/* Position Accordion Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedPositionId(isExpanded ? null : pos.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {pos.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm sm:text-base text-white">{pos.title}</h4>
                            <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.2 rounded-md">
                              {pos.shortName}
                            </span>
                            {isAssignedToMe && (
                              <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full shadow-sm">
                                ★ Your Assigned Position
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{pos.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {pos.eagleQualifying ? (
                          <span className="hidden sm:inline-flex text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-full font-bold">
                            🦅 Eagle Qualifying
                          </span>
                        ) : pos.starLifeQualifying ? (
                          <span className="hidden sm:inline-flex text-[10px] bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2.5 py-0.5 rounded-full font-bold">
                            Star / Life Only
                          </span>
                        ) : (
                          <span className="hidden sm:inline-flex text-[10px] bg-slate-900 text-slate-400 border border-slate-750 px-2.5 py-0.5 rounded-full font-bold">
                            {pos.category === TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP ? 'Adult Leadership' : 'Non-Qualifying'}
                          </span>
                        )}

                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center text-slate-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </button>

                    {/* Position Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-750 space-y-4 bg-slate-900/40">
                        {/* Qualification Alert Note */}
                        <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                          pos.eagleQualifying
                            ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200'
                            : pos.starLifeQualifying
                            ? 'bg-amber-950/40 border-amber-700/50 text-amber-200'
                            : 'bg-slate-900 border-slate-750 text-slate-300'
                        }`}>
                          <Info size={15} className="shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">{pos.qualificationNote}</span>
                          </div>
                        </div>

                        {/* Quick Spec Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Category</span>
                            <span className="font-semibold text-slate-200">{pos.category}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Reports To</span>
                            <span className="font-semibold text-slate-200">{pos.reportsTo}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Min. Rank</span>
                            <span className="font-semibold text-slate-200">{pos.minRank}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Selection</span>
                            <span className="font-semibold text-slate-200">{pos.selectionMethod}</span>
                          </div>
                        </div>

                        {/* Full Core Duties */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <Check size={13} className="text-emerald-400" />
                            <span>Core Duties & Responsibilities:</span>
                          </h5>
                          <ul className="space-y-1.5">
                            {pos.coreDuties.map((duty, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span className="leading-relaxed">{duty}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Leadership Expectations */}
                        {pos.leadershipExpectations && (
                          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                            <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles size={12} />
                              <span>Leadership Expectations:</span>
                            </h5>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                              {pos.leadershipExpectations.map((exp, idx) => (
                                <li key={idx} className="leading-relaxed">{exp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── 3. ALL SYSTEM ROLES MATRIX VIEW ── */}
      {activeGuideView === 'all-system-roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {ALL_ROLES_ARRAY.map((rg) => {
              const isMyActiveRole = myRoleGuide.id === rg.id;

              return (
                <div
                  key={rg.id}
                  className={`border rounded-2xl p-5 shadow-lg space-y-4 transition ${
                    isMyActiveRole
                      ? 'bg-slate-850 border-emerald-500/60 shadow-emerald-950/30'
                      : 'bg-slate-850/80 border-slate-750'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                        {rg.id === 'owner' ? '👑' : rg.id === 'scoutmaster' ? '⚜️' : rg.id === 'parent' ? '👨‍👩‍👧' : rg.id === 'scout' ? '🏕️' : '🛡️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm sm:text-base text-white">{rg.positionName}</h4>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${rg.badgeClass}`}>
                            {rg.badgeLabel}
                          </span>
                          {isMyActiveRole && (
                            <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.2 rounded-full">
                              ✓ Your Current Account Role
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Access Scope: <strong className="text-slate-200">{rg.accessScope}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">{rg.tagline}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Capabilities */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={12} />
                        <span>Core App Capabilities:</span>
                      </h5>
                      <ul className="space-y-1">
                        {rg.appPermissions.slice(0, 4).map((p, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span className="font-semibold text-slate-200">{p.title}:</span>
                            <span className="text-slate-400 truncate">{p.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Unit Duties */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Star size={12} />
                        <span>Key Responsibilities:</span>
                      </h5>
                      <ul className="space-y-1">
                        {rg.unitResponsibilities.slice(0, 4).map((r, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">•</span>
                            <span className="font-semibold text-slate-200">{r.title}:</span>
                            <span className="text-slate-400 truncate">{r.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
