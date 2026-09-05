import React, { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { Users, UserPlus, Shield, ShieldCheck, ShieldAlert, Award, Search, KeyRound, Lock, Trash2, Edit2, Edit3, AlertTriangle, CheckCircle, RefreshCw, X, FolderTree, Camera, Loader2 } from 'lucide-react';

const BSA_LEADER_POSITIONS = [
  'Scoutmaster',
  'Assistant Scoutmaster',
  'Assistant Leader',
  'Committee Chair',
  'Committee Member',
  'Chartered Org Representative',
  'Advancement Chair',
  'Outdoor Activity Chair',
  'Treasurer',
  'Secretary',
  'Patrol Advisor',
  'Unit College Scouter Reserve'
];


function compressImage(file, maxWidth = 500, maxHeight = 500, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

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
  const [leadPosition, setLeadPosition] = useState('Scoutmaster');
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
  const [scoutPhone, setScoutPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [scoutMsg, setScoutMsg] = useState('');
  const [scoutErr, setScoutErr] = useState('');
  const [scoutAdding, setScoutAdding] = useState(false);

  // Editing User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [uploadingUserPhoto, setUploadingUserPhoto] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [editGroup, setEditGroup] = useState('');
  const [editLeader, setEditLeader] = useState('');
  const [editRank, setEditRank] = useState('');
  const [editBsaId, setEditBsaId] = useState('');
  const [editPersonalEmail, setEditPersonalEmail] = useState('');
  const [editParentEmail, setEditParentEmail] = useState('');
  const [editScoutPhone, setEditScoutPhone] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editLeadPosition, setEditLeadPosition] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editSpt, setEditSpt] = useState('');
  const [editSptFileUrl, setEditSptFileUrl] = useState('');
  const [editSptFileName, setEditSptFileName] = useState('');
  const [uploadingAdminSpt, setUploadingAdminSpt] = useState(false);
  const [editParentLinkedScoutIds, setEditParentLinkedScoutIds] = useState([]);
  const [activeWhatsappPhone, setActiveWhatsappPhone] = useState(null);
  const [activeWhatsappName, setActiveWhatsappName] = useState('');

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
        leaderPosition: leadPosition,
        createdAt: serverTimestamp()
      });

      await setDoc(doc(db, 'users', newUid, 'private', 'secrets'), { password });

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
      setLeadPosition('Scoutmaster');
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
        scoutPhone: scoutPhone.trim(),
        parentPhone: parentPhone.trim(),
        createdAt: serverTimestamp()
      });

      await setDoc(doc(db, 'users', newUid, 'private', 'secrets'), { password });

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
      setScoutPhone('');
      setParentPhone('');
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
    setEditPhotoUrl(user.photoURL || '');
    setEditRole(user.role || 'scout');
    setEditGroup(user.groupId || '');
    setEditLeader(user.leaderId || '');
    setEditRank(user.rank || 'Scout');
    setEditBsaId(user.bsaId || '');
    setEditPersonalEmail(user.scoutEmail || '');
    setEditParentEmail(user.parentEmail || '');
    setEditScoutPhone(user.scoutPhone || '');
    setEditParentPhone(user.parentPhone || '');
    setEditLeadPosition(user.leaderPosition || 'Scoutmaster');
    setEditSpt(user.spt || '');
    setEditSptFileUrl(user.sptFileUrl || '');
    setEditSptFileName(user.sptFileName || '');
    setEditPassword('');
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const ref = doc(db, 'users', editingUser.uid);
      const updates = {
        fullName: editFullName.trim(),
        photoURL: editPhotoUrl || null,
        role: editRole,
        groupId: editGroup || null,
        patrolId: editGroup || null,
        leaderId: editRole === 'scout' ? (editLeader || null) : null,
        isOwner: editRole === 'owner' ? true : false,
        rank: editRole === 'scout' ? editRank : null,
        bsaId: editBsaId.trim() || null,
        scoutEmail: editPersonalEmail.trim() || null,
        parentEmail: editRole === 'scout' ? editParentEmail.trim() : null,
        scoutPhone: editScoutPhone.trim() || null,
        parentPhone: editRole === 'scout' ? editParentPhone.trim() : null,
        leaderPosition: editRole === 'leader' ? editLeadPosition : null,
        spt: editSpt.trim() || null,
        sptFileUrl: editSptFileUrl || null,
        sptFileName: editSptFileName || null
      };

      if (editPassword.trim()) {
        if (editPassword.trim().length < 6) {
          alert("New password must be at least 6 characters.");
          return;
        }
        const secretsRef = doc(db, 'users', editingUser.uid, 'private', 'secrets');
        const secretsSnap = await getDoc(secretsRef);
        let currentPassword = '';
        if (secretsSnap.exists()) {
          currentPassword = secretsSnap.data().password;
        } else {
          currentPassword = editingUser.username;
        }
        if (!currentPassword) {
          throw new Error("Could not retrieve current password for reset.");
        }
        const userEmail = editingUser.email || `${editingUser.username}@talia.app`;
        let secApp;
        try {
          secApp = getApp('secondary');
        } catch {
          secApp = initializeApp(firebaseConfig, 'secondary');
        }
        const secAuth = getAuth(secApp);
        const userCred = await signInWithEmailAndPassword(secAuth, userEmail, currentPassword);
        await updatePassword(userCred.user, editPassword.trim());
        await secAuth.signOut();
        await setDoc(secretsRef, { password: editPassword.trim() }, { merge: true });
      }

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Scout Phone Number</label>
                <input
                  type="tel"
                  value={scoutPhone}
                  onChange={(e) => setScoutPhone(e.target.value)}
                  placeholder="e.g. +1234567890"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Parent Phone Number</label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="e.g. +1234567890"
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
                      <option key={l.uid} value={l.uid}>
                        {l.fullName || l.username} {l.leaderPosition ? `— ${l.leaderPosition}` : `(${l.role})`}
                      </option>
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

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">BSA Leadership Position</label>
                <select
                  value={leadPosition}
                  onChange={(e) => setLeadPosition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {BSA_LEADER_POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
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
                        {user.role === 'leader' && user.leaderPosition && (
                          <span className="text-[9px] bg-slate-800 text-emerald-400 border border-slate-700 font-bold px-1.5 py-0.5 rounded leading-none uppercase">
                            {user.leaderPosition}
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
                      {user.bsaId && (
                        <span>BSA ID: <span className="text-slate-300 font-semibold">{user.bsaId}</span></span>
                      )}
                      {user.role === 'scout' && user.scoutEmail && (
                        <span>Scout Email: <span className="text-slate-300 font-semibold">{user.scoutEmail}</span></span>
                      )}
                      {user.role !== 'scout' && user.scoutEmail && (
                        <span>Personal Email: <span className="text-slate-300 font-semibold">{user.scoutEmail}</span></span>
                      )}
                      {user.role === 'scout' && user.parentEmail && (
                        <span>Parent Email: <span className="text-slate-300 font-semibold">{user.parentEmail}</span></span>
                      )}
                      {user.role !== 'scout' && user.spt && (
                        <span>SPT: <span className="text-emerald-400 font-semibold">{user.spt}</span></span>
                      )}
                      {user.scoutPhone && (
                        <span className="inline-flex items-center gap-1">
                          {user.role === 'scout' ? 'Scout' : 'Leader'} Phone: <span className="text-slate-300 font-semibold">{user.scoutPhone}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveWhatsappPhone(user.scoutPhone);
                              setActiveWhatsappName(user.fullName || user.username);
                            }}
                            className="text-emerald-450 hover:text-emerald-400 cursor-pointer inline-flex items-center"
                            title="Chat on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-emerald-500 hover:fill-emerald-400 ml-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                            </svg>
                          </button>
                        </span>
                      )}
                      {user.role === 'scout' && user.parentPhone && (
                        <span className="inline-flex items-center gap-1">
                          Parent Phone: <span className="text-slate-300 font-semibold">{user.parentPhone}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveWhatsappPhone(user.parentPhone);
                              setActiveWhatsappName(`${user.fullName || user.username}'s Parent`);
                            }}
                            className="text-emerald-450 hover:text-emerald-400 cursor-pointer inline-flex items-center"
                            title="Chat with parent on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-emerald-500 hover:fill-emerald-400 ml-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                            </svg>
                          </button>
                        </span>
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
            <div className="flex items-center gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-750">
              <div className="relative shrink-0">
                {editPhotoUrl ? (
                  <img src={editPhotoUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-slate-200 text-lg uppercase">
                    {(editFullName || 'U').charAt(0)}
                  </div>
                )}
                {uploadingUserPhoto && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
                    <Loader2 size={16} className="animate-spin text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition inline-flex items-center gap-1.5 border border-slate-700">
                  <Camera size={12} className="text-emerald-400" />
                  <span>{uploadingUserPhoto ? 'Processing...' : (editPhotoUrl ? 'Change Photo' : 'Upload Photo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingUserPhoto}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingUserPhoto(true);
                      try {
                        const compressed = await compressImage(file, 400, 400, 0.8);
                        setEditPhotoUrl(compressed);
                      } catch (err) {
                        alert("Failed to process photo: " + err.message);
                      } finally {
                        setUploadingUserPhoto(false);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {editPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditPhotoUrl('')}
                    className="text-[10px] text-red-400 hover:underline block cursor-pointer ml-1"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
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

              {editRole === 'leader' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">BSA Leadership Position</label>
                  <select
                    value={editLeadPosition}
                    onChange={(e) => setEditLeadPosition(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {BSA_LEADER_POSITIONS.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              )}

              {editRole === 'parent' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Linked Children ({editParentLinkedScoutIds.length} Selected)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl max-h-48 overflow-y-auto border border-slate-750">
                    {users.filter(u => u.role === 'scout').map(s => {
                      const isChecked = editParentLinkedScoutIds.includes(s.uid);
                      return (
                        <label
                          key={s.uid}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                            isChecked ? 'bg-emerald-950/40 border-emerald-600 text-white font-bold' : 'bg-slate-800/60 border-slate-750 text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditParentLinkedScoutIds(prev => [...prev, s.uid]);
                              } else {
                                setEditParentLinkedScoutIds(prev => prev.filter(id => id !== s.uid));
                              }
                            }}
                            className="w-3.5 h-3.5 rounded text-emerald-600 bg-slate-900 border-slate-700"
                          />
                          <span className="truncate">{s.fullName || s.username} ({s.rank || 'Scout'})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                        <option key={l.uid} value={l.uid}>
                          {l.fullName || l.username} {l.leaderPosition ? `— ${l.leaderPosition}` : ''}
                        </option>
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
                </>
              )}

              {/* Shared Information Fields */}
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
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Personal Email</label>
                <input
                  type="email"
                  value={editPersonalEmail}
                  onChange={(e) => setEditPersonalEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editScoutPhone}
                  onChange={(e) => setEditScoutPhone(e.target.value)}
                  placeholder="e.g. +1234567890"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Scout-Only Parent Information */}
              {editRole === 'scout' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent's Email</label>
                    <input
                      type="email"
                      value={editParentEmail}
                      onChange={(e) => setEditParentEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parent Phone</label>
                    <input
                      type="tel"
                      value={editParentPhone}
                      onChange={(e) => setEditParentPhone(e.target.value)}
                      placeholder="e.g. +1234567890"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* Leader-Only Safety/Protection Training (SPT) */}
              {editRole !== 'scout' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Safety/Protection Training (SPT) Date</label>
                  <input
                    type="date"
                    value={editSpt}
                    onChange={(e) => setEditSpt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Reset Password (Only if changing)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  autoComplete="new-password"
                />
              </div>

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

      {/* WhatsApp Template Modal */}
      {activeWhatsappPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print-hide">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-left">
            <h3 className="font-bold text-white text-base">Send WhatsApp Message</h3>
            <p className="text-xs text-slate-350">
              Select a template to send to <strong>{activeWhatsappName}</strong> ({activeWhatsappPhone}):
            </p>
            <div className="space-y-2">
              {[
                { label: "General Chat (Blank)", text: "" },
                { 
                  label: "📅 Meeting Reminder", 
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

Just a quick note to remind you about our upcoming Dhulfiqār Scouting Session.

🔗 *Portal Link:* https://taliat-app.vercel.app/
📍 *Preparation:* Please arrive on time in full uniform with your Scout Handbook and notebook ready.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                },
                { 
                  label: "🛡️ Safeguarding Video Reminder", 
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

We wanted to share a quick reminder to complete the mandatory Youth Protection and Safety Training (SPT) video modules.

🔗 *Portal Link:* https://taliat-app.vercel.app/
📌 *Instructions:* Access your profile, watch the video modules, and confirm verification with leadership.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                },
                { 
                  label: "🕌 Islamic Knowledge Progress Reminder", 
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

Just a friendly check-in regarding the Islamic Knowledge modules (Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and Sīrah of Ahl al-Bayt ʿa).

🔗 *Checklist Portal:* https://taliat-app.vercel.app/
📌 *Instructions:* Review unit milestones and prepare for oral/written leader assessment.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                },
                { 
                  label: "⏱️ Service Hours Reminder", 
                  text: `🌿 Assalāmu ʿAlaykum dear parents,🌿
Hope you are all doing well 😊 ✨

We wanted to remind scouts to log their community service and volunteering hours into the portal.

🔗 *Service Log:* https://taliat-app.vercel.app/
📌 *Instructions:* Log the project title, date, duration, and beneficiary for verification.

*Jazākum Allāhu khayran for your continued support 🙏*
*✨ Patrol 2 (Ṭalīʿat Abū al-Faḍl al-ʿAbbās) .✨*
*⚜️ Dhulfiqār Scouts Team⚜️*` 
                }
              ].map((tmpl) => {
                const encodedText = encodeURIComponent(tmpl.text);
                const waLink = `https://wa.me/${activeWhatsappPhone.replace(/[^0-9]/g, '')}${tmpl.text ? `?text=${encodedText}` : ''}`;
                return (
                  <a
                    key={tmpl.label}
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveWhatsappPhone(null)}
                    className="block w-full bg-slate-900 border border-slate-750 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition"
                  >
                    {tmpl.label}
                    {tmpl.text && <span className="block text-[10px] text-slate-450 font-normal mt-0.5 truncate">{tmpl.text}</span>}
                  </a>
                );
              })}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-750/50">
              <button
                onClick={() => setActiveWhatsappPhone(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
