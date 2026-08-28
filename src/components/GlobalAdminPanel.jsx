import React, { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { UserPlus, Shield, UserMinus, Search, Edit3, Trash2 } from 'lucide-react';
import { RANKS_DATA } from '../data/ranksData';

export default function GlobalAdminPanel({ currentUser }) {
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Form states: Create Leader
  const [leadName, setLeadName] = useState('');
  const [leadUsername, setLeadUsername] = useState('');
  const [leadPassword, setLeadPassword] = useState('');
  const [leadGroup, setLeadGroup] = useState('');
  const [leadMsg, setLeadMsg] = useState('');
  const [leadErr, setLeadErr] = useState('');
  const [leadAdding, setLeadAdding] = useState(false);

  // Form states: Create Scout
  const [scoutName, setScoutName] = useState('');
  const [scoutUsername, setScoutUsername] = useState('');
  const [scoutPassword, setScoutPassword] = useState('');
  const [scoutLeader, setScoutLeader] = useState('');
  const [scoutGroup, setScoutGroup] = useState('');
  const [scoutRank, setScoutRank] = useState('Scout');
  const [scoutBsaId, setScoutBsaId] = useState('');
  const [scoutPersonalEmail, setScoutPersonalEmail] = useState('');
  const [scoutParentEmail, setScoutParentEmail] = useState('');
  const [scoutMsg, setScoutMsg] = useState('');
  const [scoutErr, setScoutErr] = useState('');
  const [scoutAdding, setScoutAdding] = useState(false);

  // Editing User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editGroup, setEditGroup] = useState('');
  const [editLeader, setEditLeader] = useState('');
  const [editRank, setEditRank] = useState('');
  const [editBsaId, setEditBsaId] = useState('');
  const [editPersonalEmail, setEditPersonalEmail] = useState('');
  const [editParentEmail, setEditParentEmail] = useState('');

  useEffect(() => {
    // 1. Listen to all users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });

    // 2. Listen to active groups
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });

    return () => {
      unsubUsers();
      unsubGroups();
    };
  }, []);

  const handleAddLeader = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    setLeadErr('');
    setLeadMsg('');
    const username = leadUsername.trim().toLowerCase();
    const password = leadPassword;
    if (!leadName.trim() || !username || !password) return;

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      setLeadErr('Username must be 3-30 characters (letters, numbers, dots, dashes, underscores).');
      return;
    }
    if (password.length < 6) {
      setLeadErr('Password must be at least 6 characters.');
      return;
    }
    setLeadAdding(true);

    const email = `${username}@talia.app`;

    try {
      let secApp;
      try {
        secApp = getApp('secondary');
      } catch {
        secApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secAuth = getAuth(secApp);
      const cred = await createUserWithEmailAndPassword(secAuth, email, password);
      const newUid = cred.user.uid;
      await secAuth.signOut();

      await setDoc(doc(db, 'users', newUid), {
        fullName: leadName.trim(),
        username,
        email,
        role: 'leader',
        isOwner: false,
        leaderId: null,
        groupId: leadGroup || null,
        patrolId: leadGroup || null,
        createdAt: serverTimestamp()
      });

      // If group is selected, also assign this leader to the group's assignedLeaderIds
      if (leadGroup) {
        const groupRef = doc(db, 'groups', leadGroup);
        const groupDoc = groups.find(g => g.id === leadGroup);
        if (groupDoc) {
          const leadersList = groupDoc.assignedLeaderIds || [];
          if (!leadersList.includes(newUid)) {
            await updateDoc(groupRef, {
              assignedLeaderIds: [...leadersList, newUid]
            });
          }
        }
      }

      setLeadMsg(`Leader created! Username: ${username} · Password: ${password}`);
      setLeadName('');
      setLeadUsername('');
      setLeadPassword('');
      setLeadGroup('');
    } catch (err) {
      console.error(err);
      setLeadErr(`Error: ${err.message}`);
    } finally {
      setLeadAdding(false);
    }
  };

  const handleAddScout = async (e) => {
    e.preventDefault();
    setScoutErr('');
    setScoutMsg('');
    const username = scoutUsername.trim().toLowerCase();
    const password = scoutPassword;
    const assignedLeader = isOwner ? scoutLeader : currentUser.uid;

    if (!scoutName.trim() || !username || !password || !assignedLeader) {
      setScoutErr('Please fill in all required fields.');
      return;
    }

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      setScoutErr('Username must be 3-30 characters.');
      return;
    }
    if (password.length < 6) {
      setScoutErr('Password must be at least 6 characters.');
      return;
    }
    setScoutAdding(true);

    const email = `${username}@talia.app`;

    try {
      let secApp;
      try {
        secApp = getApp('secondary');
      } catch {
        secApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secAuth = getAuth(secApp);
      const cred = await createUserWithEmailAndPassword(secAuth, email, password);
      const newUid = cred.user.uid;
      await secAuth.signOut();

      await setDoc(doc(db, 'users', newUid), {
        fullName: scoutName.trim(),
        username,
        email,
        role: 'scout',
        leaderId: assignedLeader,
        groupId: scoutGroup || null,
        patrolId: scoutGroup || null,
        rank: scoutRank,
        bsaId: scoutBsaId.trim(),
        scoutEmail: scoutPersonalEmail.trim(),
        parentEmail: scoutParentEmail.trim(),
        createdAt: serverTimestamp()
      });

      setScoutMsg(`Scout created! Username: ${username} · Password: ${password}`);
      setScoutName('');
      setScoutUsername('');
      setScoutPassword('');
      setScoutLeader('');
      setScoutGroup('');
      setScoutRank('Scout');
      setScoutBsaId('');
      setScoutPersonalEmail('');
      setScoutParentEmail('');
    } catch (err) {
      console.error(err);
      setScoutErr(`Error: ${err.message}`);
    } finally {
      setScoutAdding(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!isOwner) return;
    if (user.uid === currentUser.uid) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${user.fullName || user.username}?`)) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditFullName(user.fullName || '');
    setEditRole(user.role || 'scout');
    setEditGroup(user.groupId || '');
    setEditLeader(user.leaderId || '');
    setEditRank(user.rank || 'Scout');
    setEditBsaId(user.bsaId || '');
    setEditPersonalEmail(user.scoutEmail || '');
    setEditParentEmail(user.parentEmail || '');
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const ref = doc(db, 'users', editingUser.uid);
      const updates = {
        fullName: editFullName.trim(),
        role: editRole,
        groupId: editGroup || null,
        patrolId: editGroup || null,
        leaderId: editRole === 'scout' ? (editLeader || null) : null,
        isOwner: editRole === 'owner' ? true : false,
        rank: editRole === 'scout' ? editRank : null,
        bsaId: editRole === 'scout' ? editBsaId.trim() : null,
        scoutEmail: editRole === 'scout' ? editPersonalEmail.trim() : null,
        parentEmail: editRole === 'scout' ? editParentEmail.trim() : null
      };

      await updateDoc(ref, updates);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter lists
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;

    // Leaders can only see scouts they manage in their list if they access the overview
    const matchesScope = isOwner ? true : (u.role === 'scout' && u.leaderId === currentUser.uid);

    return matchesSearch && matchesRole && matchesScope;
  });

  const leadersList = users.filter(u => u.role === 'leader' || u.role === 'owner');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="text-emerald-400" size={24} />
          Organization & Admin Hub
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isOwner 
            ? 'Super Admin view: provision scouts/leaders, manage roles, and perform global maintenance.' 
            : 'Leader view: provision and manage scouts assigned to your patrol.'}
        </p>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provision Scout */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-1.5">
            <UserPlus size={16} className="text-emerald-400" /> Provision Scout Account
          </h3>
          {scoutMsg && (
            <div className="p-3 mb-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl font-semibold">
              {scoutMsg}
            </div>
          )}
          {scoutErr && (
            <div className="p-3 mb-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl">
              {scoutErr}
            </div>
          )}
          <form onSubmit={handleAddScout} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={scoutName}
                  onChange={(e) => setScoutName(e.target.value)}
                  placeholder="e.g. Ahmad Rashid"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={scoutUsername}
                  onChange={(e) => setScoutUsername(e.target.value)}
                  placeholder="e.g. ahmad.scout"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Temporary Password</label>
              <input
                type="text"
                required
                minLength={6}
                value={scoutPassword}
                onChange={(e) => setScoutPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">BSA Member ID</label>
                <input
                  type="text"
                  value={scoutBsaId}
                  onChange={(e) => setScoutBsaId(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Scout Personal Email</label>
                <input
                  type="email"
                  value={scoutPersonalEmail}
                  onChange={(e) => setScoutPersonalEmail(e.target.value)}
                  placeholder="e.g. scout@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Parent's Email</label>
                <input
                  type="email"
                  value={scoutParentEmail}
                  onChange={(e) => setScoutParentEmail(e.target.value)}
                  placeholder="e.g. parent@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {isOwner ? (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Assign Leader</label>
                  <select
                    required
                    value={scoutLeader}
                    onChange={(e) => setScoutLeader(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">Select Leader</option>
                    {leadersList.map(l => (
                      <option key={l.uid} value={l.uid}>{l.fullName || l.username} ({l.role})</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Assign Patrol / Group</label>
                <select
                  value={scoutGroup}
                  onChange={(e) => setScoutGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">No Patrol</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Initial Rank</label>
              <select
                value={scoutRank}
                onChange={(e) => setScoutRank(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {RANKS_DATA.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={scoutAdding}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer mt-2"
            >
              {scoutAdding ? 'Provisioning...' : 'Provision Scout'}
            </button>
          </form>
        </div>

        {/* Provision Leader (Owner Only) */}
        {isOwner ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-1.5">
              <UserPlus size={16} className="text-emerald-400" /> Provision Leader Account
            </h3>
            {leadMsg && (
              <div className="p-3 mb-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl font-semibold">
                {leadMsg}
              </div>
            )}
            {leadErr && (
              <div className="p-3 mb-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl">
                {leadErr}
              </div>
            )}
            <form onSubmit={handleAddLeader} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Salim Ali"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={leadUsername}
                    onChange={(e) => setLeadUsername(e.target.value)}
                    placeholder="e.g. salim.leader"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Temporary Password</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={leadPassword}
                  onChange={(e) => setLeadPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Assign Patrol / Group</label>
                <select
                  value={leadGroup}
                  onChange={(e) => setLeadGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">No Patrol</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={leadAdding}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer mt-2"
              >
                {leadAdding ? 'Provisioning...' : 'Provision Leader'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex items-center justify-center text-center">
            <div>
              <Shield className="mx-auto text-slate-600 mb-2" size={40} />
              <p className="text-sm font-semibold text-slate-400">Leader Scoped View</p>
              <p className="text-xs text-slate-500 mt-1">Contact owner neoissa@gmail.com for leader provisioning access.</p>
            </div>
          </div>
        )}
      </div>

      {/* Global Roster Overview */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="font-bold text-white text-sm">Roster Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage details, promote roles, and reassign groups.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-none md:w-56">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roster..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owners</option>
              <option value="leader">Leaders</option>
              <option value="scout">Scouts</option>
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="space-y-2.5">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No users found.</div>
          ) : (
            filteredUsers.map(user => {
              const userGroup = groups.find(g => g.id === user.groupId);
              const userLeaderObj = users.find(u => u.uid === user.leaderId);
              
              return (
                <div key={user.uid} className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 uppercase">
                        {(user.fullName || user.username).charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{user.fullName || user.username}</span>
                        {user.role !== 'scout' && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border leading-none font-bold uppercase ${
                            user.role === 'owner'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {user.role}
                          </span>
                        )}
                        {user.role === 'scout' && (
                          <span className="text-[9px] bg-sky-950 text-sky-400 border border-sky-900 font-bold px-1.5 py-0.5 rounded leading-none uppercase">
                            {user.rank || 'Scout'}
                          </span>
                        )}
                      </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      @{user.username} &bull; {user.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-slate-400">
                      {userGroup && (
                        <span>Patrol: <span className="text-slate-300 font-semibold">{userGroup.name}</span></span>
                      )}
                      {user.role === 'scout' && userLeaderObj && (
                        <span>Leader: <span className="text-slate-300 font-semibold">{userLeaderObj.fullName || userLeaderObj.username}</span></span>
                      )}
                      {user.role === 'scout' && user.bsaId && (
                        <span>BSA ID: <span className="text-slate-300 font-semibold">{user.bsaId}</span></span>
                      )}
                      {user.role === 'scout' && user.scoutEmail && (
                        <span>Scout Email: <span className="text-slate-300 font-semibold">{user.scoutEmail}</span></span>
                      )}
                      {user.role === 'scout' && user.parentEmail && (
                        <span>Parent Email: <span className="text-slate-300 font-semibold">{user.parentEmail}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                  {isOwner && (
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer text-xs flex items-center gap-1"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/60 text-red-400 hover:text-white rounded-lg transition cursor-pointer text-xs flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Editing User Modal Dialog */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Edit User Profile</h3>
            
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Role / Authority</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="scout">Scout (Member)</option>
                  <option value="leader">Leader (Patrol/Troop Lead)</option>
                  <option value="owner">Owner (Super Admin)</option>
                </select>
              </div>

              {editRole === 'scout' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Leader</label>
                    <select
                      value={editLeader}
                      onChange={(e) => setEditLeader(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">No Assigned Leader</option>
                      {leadersList.map(l => (
                        <option key={l.uid} value={l.uid}>{l.fullName || l.username}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Rank</label>
                    <select
                      value={editRank}
                      onChange={(e) => setEditRank(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {RANKS_DATA.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">BSA Member ID</label>
                    <input
                      type="text"
                      value={editBsaId}
                      onChange={(e) => setEditBsaId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Scout Personal Email</label>
                    <input
                      type="email"
                      value={editPersonalEmail}
                      onChange={(e) => setEditPersonalEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent's Email</label>
                    <input
                      type="email"
                      value={editParentEmail}
                      onChange={(e) => setEditParentEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Patrol / Group</label>
                <select
                  value={editGroup}
                  onChange={(e) => setEditGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">No Patrol</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
