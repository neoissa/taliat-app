import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import ScoutProgressReport from './ScoutProgressReport';
import AdvancementTracker from './AdvancementTracker';
import { 
  isSuperUser, 
  getAccessiblePatrols, 
  isScoutInPatrol, 
  getScoutPatrolName, 
  filterScoutsForUser 
} from '../utils/patrolScoping';
import { Users, ChevronRight, Search, Filter, Award, Shield, User, Sparkles, ArrowLeft, CheckSquare, FileText, Crown } from 'lucide-react';

export default function ScoutList({ currentUser }) {
  const [allScouts, setAllScouts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPatrolFilter, setSelectedPatrolFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScout, setSelectedScout] = useState(null);
  const [selectedScoutViewMode, setSelectedScoutViewMode] = useState('interactive'); // 'interactive' | 'report'
  const [loading, setLoading] = useState(true);

  const superUser = isSuperUser(currentUser);

  // 1. Fetch Patrols / Groups
  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived);
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setGroups(list);
    }, (err) => console.warn('Failed to load groups in ScoutList:', err));

    return () => unsubGroups();
  }, []);

  // 2. Fetch All Scouts in Real-Time
  useEffect(() => {
    const scoutsQuery = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsub = onSnapshot(scoutsQuery, (snap) => {
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
      setAllScouts(list);
      setLoading(false);
    }, (err) => {
      console.error('Failed to load scouts in ScoutList:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 3. Resolve accessible patrols for the current user
  const accessibleGroups = useMemo(() => {
    return getAccessiblePatrols(currentUser, groups);
  }, [currentUser, groups]);

  // 4. Default patrol filter initialization
  useEffect(() => {
    if (selectedPatrolFilter) return;

    if (superUser) {
      setSelectedPatrolFilter('all');
    } else if (accessibleGroups.length > 0) {
      // Default to first assigned patrol ID or 'all' if leader has multiple
      setSelectedPatrolFilter(accessibleGroups[0].id || 'all');
    } else {
      setSelectedPatrolFilter('all');
    }
  }, [superUser, accessibleGroups, selectedPatrolFilter]);

  // Primary assigned patrol name label
  const primaryPatrolName = useMemo(() => {
    if (superUser) return 'All Troop Patrols';
    if (accessibleGroups.length > 0) {
      return `${accessibleGroups[0].name} Patrol`;
    }
    return currentUser?.assignedPatrol || currentUser?.patrol || 'Assigned Patrol';
  }, [superUser, accessibleGroups, currentUser]);

  // 5. Filter Scouts based on Patrol and Search Query
  const filteredScouts = useMemo(() => {
    const scopedList = filterScoutsForUser(allScouts, currentUser, groups, selectedPatrolFilter);

    if (!searchQuery.trim()) return scopedList;

    const q = searchQuery.toLowerCase().trim();
    return scopedList.filter((scout) => {
      const name = (scout.fullName || '').toLowerCase();
      const username = (scout.username || '').toLowerCase();
      const email = (scout.email || scout.personalEmail || scout.scoutEmail || '').toLowerCase();
      const rank = (scout.rank || '').toLowerCase();
      const bsaId = (scout.bsaId || '').toLowerCase();
      const pName = getScoutPatrolName(scout, groups).toLowerCase();

      return name.includes(q) || username.includes(q) || email.includes(q) || rank.includes(q) || bsaId.includes(q) || pName.includes(q);
    });
  }, [allScouts, currentUser, groups, selectedPatrolFilter, searchQuery]);

  if (selectedScout) {
    const pName = getScoutPatrolName(selectedScout, groups);
    const userPhoto = selectedScout.photoURL || selectedScout.avatar || selectedScout.photo || selectedScout.profilePic;
    const initials = (selectedScout.fullName?.charAt(0) || selectedScout.username?.charAt(0) || 'S').toUpperCase();

    return (
      <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
        {/* Top Breadcrumb & Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-850 border border-slate-750 p-4 sm:p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedScout(null)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shrink-0 shadow-sm"
              title="Return to Scout Directory"
            >
              <ArrowLeft size={15} />
              <span>← Back to Directory</span>
            </button>

            {/* Scout Quick Profile Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-300 font-black text-sm shrink-0 overflow-hidden shadow-sm">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={selectedScout.fullName || selectedScout.username}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate flex items-center gap-2">
                  <span>{selectedScout.fullName || selectedScout.username}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold px-2 py-0.5 rounded-md shrink-0">
                    ⚜️ {selectedScout.rank || 'Scout'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  🏕️ {pName} • BSA ID: <strong className="text-slate-300 font-mono">{selectedScout.bsaId || '—'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-750 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSelectedScoutViewMode('interactive')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedScoutViewMode === 'interactive'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare size={13} />
              <span>7 Ranks Checklist & Sign-Off</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedScoutViewMode('report')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedScoutViewMode === 'report'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText size={13} />
              <span>Official Progress Report</span>
            </button>
          </div>
        </div>

        {/* Selected Mode View */}
        {selectedScoutViewMode === 'interactive' ? (
          <AdvancementTracker
            scoutId={selectedScout.uid}
            currentUser={currentUser}
            onBack={() => setSelectedScout(null)}
          />
        ) : (
          <ScoutProgressReport
            scout={selectedScout}
            currentUser={currentUser}
            onBack={() => setSelectedScout(null)}
          />
        )}
      </div>
    );
  }

  // Active selectable groups for this user (All for superuser, accessible for leader)
  const selectableGroups = superUser ? groups : accessibleGroups;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-750 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-950/60 shrink-0">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Advancement Tracker & Scout Reports
              </h2>
              {superUser ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <Crown size={11} /> Super User (All Patrols Access)
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <Shield size={11} /> {primaryPatrolName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {superUser 
                ? 'Select any patrol to filter and inspect rank requirements, print progress reports, and review completions across the entire troop.'
                : `Review rank requirements, print progress reports, and manage advancement for all scouts in ${primaryPatrolName}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0 self-start md:self-auto">
          <Users size={16} className="text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">
            Showing <strong className="text-emerald-400 font-mono">{filteredScouts.length}</strong> Scout{filteredScouts.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* ── CONTROLS & PATROL FILTER BAR ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search scouts by name, rank, email, BSA ID, or patrol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Patrol Selector Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={14} className="text-emerald-400" />
            <select
              value={selectedPatrolFilter}
              onChange={(e) => setSelectedPatrolFilter(e.target.value)}
              className="bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {superUser && (
                <option value="all">⚜️ All Patrols ({allScouts.length} Scouts)</option>
              )}
              {!superUser && selectableGroups.length > 1 && (
                <option value="all">⚜️ All My Patrols ({filterScoutsForUser(allScouts, currentUser, groups, 'all').length} Scouts)</option>
              )}
              {selectableGroups.map((g) => {
                const count = allScouts.filter(s => isScoutInPatrol(s, g, groups)).length;
                return (
                  <option key={g.id} value={g.id}>
                    🏕️ {g.name} Patrol ({count} Scouts)
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Quick Patrol Filter Chips */}
        {selectableGroups.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-thin">
            {superUser && (
              <button
                type="button"
                onClick={() => setSelectedPatrolFilter('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                  selectedPatrolFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                All Patrols ({allScouts.length})
              </button>
            )}
            {!superUser && selectableGroups.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedPatrolFilter('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                  selectedPatrolFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                All My Patrols ({filterScoutsForUser(allScouts, currentUser, groups, 'all').length})
              </button>
            )}
            {selectableGroups.map((g) => {
              const count = allScouts.filter(s => isScoutInPatrol(s, g, groups)).length;
              const isSelected = selectedPatrolFilter === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedPatrolFilter(g.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  {g.name} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── SCOUTS ROSTER LIST ── */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading scout advancement profiles...</span>
        </div>
      ) : filteredScouts.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-xs bg-slate-850/80 rounded-3xl border border-slate-750 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl mx-auto text-slate-500">
            🔍
          </div>
          <h4 className="text-sm font-bold text-white">No Scouts Found</h4>
          <p className="max-w-md mx-auto text-slate-400">
            {searchQuery 
              ? `No scout matches the search query "${searchQuery}".`
              : `No scouts found in the selected patrol filter. Try selecting another patrol or verifying scout patrol assignments.`}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScouts.map((scout) => {
            const pName = getScoutPatrolName(scout, groups);
            const userPhoto = scout.photoURL || scout.avatar || scout.photo || scout.profilePic;
            const initials = (scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S').toUpperCase();

            return (
              <div
                key={scout.uid}
                onClick={() => setSelectedScout(scout)}
                className="bg-slate-850 hover:bg-slate-800/90 border border-slate-750 hover:border-emerald-500/60 p-5 rounded-2xl transition cursor-pointer shadow-md group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  {/* Scout Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-300 font-black text-base shrink-0 shadow-md overflow-hidden group-hover:scale-105 transition">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={scout.fullName || scout.username}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  {/* Scout Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-white text-sm sm:text-base truncate group-hover:text-emerald-300 transition">
                      {scout.fullName || scout.username}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      @{scout.username || scout.email?.split('@')[0]}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                        <Award size={10} />
                        <span>{scout.rank || 'Scout'}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-900 text-sky-300 border border-slate-750">
                        {pName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-750 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-400">
                    BSA ID: <strong className="text-slate-200">{scout.bsaId || '—'}</strong>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>View Progress</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
