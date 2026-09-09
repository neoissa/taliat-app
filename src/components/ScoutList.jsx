import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import ScoutProgressReport from './ScoutProgressReport';
import { Users, ChevronRight, Search, Filter, Award, Shield, User, Sparkles } from 'lucide-react';

export default function ScoutList({ currentUser }) {
  const [allScouts, setAllScouts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPatrolFilter, setSelectedPatrolFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScout, setSelectedScout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authority & Role Calculation
  const isOwner = currentUser?.role === 'owner' || currentUser?.isOwner || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = (currentUser?.role === 'leader' || currentUser?.role === 'admin') && currentUser?.leaderPosition === 'Scoutmaster';
  const isSuperUser = isOwner || currentUser?.role === 'admin' || currentUser?.isExecutive || isScoutmaster;
  const userPatrolId = currentUser?.groupId || currentUser?.patrolId || null;

  // Set default patrol filter
  useEffect(() => {
    if (isSuperUser) {
      setSelectedPatrolFilter('all');
    } else if (userPatrolId) {
      setSelectedPatrolFilter(userPatrolId);
    } else {
      setSelectedPatrolFilter('all');
    }
  }, [isSuperUser, userPatrolId]);

  // 1. Fetch Patrols / Groups
  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived);
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

  // Assigned Patrol Name for regular leaders
  const assignedPatrolObj = groups.find(g => g.id === userPatrolId);
  const assignedPatrolName = assignedPatrolObj?.name || currentUser?.patrolName || currentUser?.patrol || 'Assigned Patrol';

  // 3. Filter Scouts based on Patrol and Search
  const filteredScouts = useMemo(() => {
    return allScouts.filter((scout) => {
      // 1. Patrol Scoping
      if (isSuperUser) {
        // Super user can select any patrol or view all
        if (selectedPatrolFilter !== 'all') {
          const selectedGroupObj = groups.find(g => g.id === selectedPatrolFilter);
          const matchesId = scout.groupId === selectedPatrolFilter || scout.patrolId === selectedPatrolFilter;
          const matchesName = selectedGroupObj && (scout.patrol === selectedGroupObj.name || scout.patrolName === selectedGroupObj.name);
          if (!matchesId && !matchesName) return false;
        }
      } else {
        // Regular Leader: strictly scoped to assigned patrol only
        if (userPatrolId) {
          const inLeaderPatrol = scout.groupId === userPatrolId || 
            scout.patrolId === userPatrolId || 
            scout.leaderId === currentUser?.uid ||
            (currentUser?.patrolName && (scout.patrolName === currentUser.patrolName || scout.patrol === currentUser.patrolName));
          if (!inLeaderPatrol) return false;
        } else if (currentUser?.patrolName) {
          const inLeaderPatrolName = scout.patrolName === currentUser.patrolName || scout.patrol === currentUser.patrolName;
          if (!inLeaderPatrolName) return false;
        }
      }

      // 2. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (scout.fullName || '').toLowerCase();
        const username = (scout.username || '').toLowerCase();
        const email = (scout.email || '').toLowerCase();
        const rank = (scout.rank || '').toLowerCase();
        const bsaId = (scout.bsaId || '').toLowerCase();
        const patrol = (scout.patrol || scout.patrolName || '').toLowerCase();

        return name.includes(q) || username.includes(q) || email.includes(q) || rank.includes(q) || bsaId.includes(q) || patrol.includes(q);
      }

      return true;
    });
  }, [allScouts, groups, selectedPatrolFilter, isSuperUser, userPatrolId, currentUser, searchQuery]);

  if (selectedScout) {
    return (
      <ScoutProgressReport
        scout={selectedScout}
        currentUser={currentUser}
        onBack={() => setSelectedScout(null)}
      />
    );
  }

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
              {isSuperUser ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  👑 Super User (All Patrols Access)
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  🏕️ {assignedPatrolName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isSuperUser 
                ? 'Select any patrol to filter and inspect rank requirements, print progress reports, and review completions across the troop.'
                : `Review rank requirements, print progress reports, and manage advancement for ${assignedPatrolName}.`}
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
              placeholder="Search scouts by name, rank, email, or BSA ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Super User Patrol Selector OR Regular Leader Patrol Indicator */}
          {isSuperUser ? (
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={14} className="text-emerald-400" />
              <select
                value={selectedPatrolFilter}
                onChange={(e) => setSelectedPatrolFilter(e.target.value)}
                className="bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="all">⚜️ All Patrols ({allScouts.length} Scouts)</option>
                {groups.map((g) => {
                  const count = allScouts.filter(s => s.groupId === g.id || s.patrolId === g.id || s.patrolName === g.name || s.patrol === g.name).length;
                  return (
                    <option key={g.id} value={g.id}>
                      🏕️ {g.name} ({count} Scouts)
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0">
              <Shield size={14} className="text-emerald-400" />
              <span>Assigned Patrol: <strong className="text-white">{assignedPatrolName}</strong></span>
            </div>
          )}
        </div>

        {/* Super User Quick Patrol Filter Chips */}
        {isSuperUser && groups.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-thin">
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
            {groups.map((g) => {
              const count = allScouts.filter(s => s.groupId === g.id || s.patrolId === g.id || s.patrolName === g.name || s.patrol === g.name).length;
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
              : `No scouts found in the selected patrol filter. Try selecting "All Patrols" or assigning scouts to this patrol in the Admin Panel.`}
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
            const scoutPatrolObj = groups.find(g => g.id === (scout.groupId || scout.patrolId));
            const pName = scoutPatrolObj?.name || scout.patrolName || scout.patrol || 'Dhulfiqār Patrol';
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
