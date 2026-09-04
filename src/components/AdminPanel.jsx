import React, { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  Search, 
  KeyRound, 
  Lock, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  X, 
  FolderTree, 
  Megaphone, 
  Calendar, 
  FileText, 
  Plus, 
  Send, 
  Check, 
  ExternalLink,
  Crown,
  Bell
} from 'lucide-react';
import { dispatchParentNotification, dispatchPatrolStreamAlert } from '../utils/notificationPipeline';

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
  'Patrol Advisor'
];

export default function AdminPanel({ currentUser }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'patrols' | 'broadcasts' | 'forms'
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Role Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // User Creation Modal / Form State
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserType, setNewUserType] = useState('leader'); // 'leader' | 'parent' | 'scout'
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newLeaderPosition, setNewLeaderPosition] = useState('Assistant Scoutmaster');
  const [newGroupId, setNewGroupId] = useState('');
  const [newLinkedScoutIds, setNewLinkedScoutIds] = useState([]);
  const [newRank, setNewRank] = useState('Scout');
  const [userCreating, setUserCreating] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const [userErr, setUserErr] = useState('');

  // Editing User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editLeaderPosition, setEditLeaderPosition] = useState('');
  const [editGroupId, setEditGroupId] = useState('');
  const [editParentLinkedScoutIds, setEditParentLinkedScoutIds] = useState([]);
  const [editPassword, setEditPassword] = useState('');
  const [editYptCompleted, setEditYptCompleted] = useState(false);
  const [editYptDate, setEditYptDate] = useState('');
  const [userUpdating, setUserUpdating] = useState(false);
  const [editMsg, setEditMsg] = useState('');
  const [editErr, setEditErr] = useState('');

  // Patrol Creation & Edit State
  const [newPatrolName, setNewPatrolName] = useState('');
  const [newPatrolMotto, setNewPatrolMotto] = useState('');
  const [newPatrolLeaderId, setNewPatrolLeaderId] = useState('');
  const [patrolCreating, setPatrolCreating] = useState(false);
  const [patrolMsg, setPatrolMsg] = useState('');

  // Global Announcement / Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('normal'); // 'normal' | 'high' | 'urgent'
  const [broadcastScope, setBroadcastScope] = useState('all'); // 'all' or specific groupId
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  // Troop-wide Form Assignment State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Medical & Health'); // 'Medical & Health' | 'Permission Slip' | 'Camp Waiver' | 'Payment / Fee'
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formDocUrl, setFormDocUrl] = useState('');
  const [formCreating, setFormCreating] = useState(false);
  const [formSuccessMsg, setFormSuccessMsg] = useState('');

  // 1. Subscribe to Firestore Collections
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      setLoading(false);
    });

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });

    const unsubBroadcasts = onSnapshot(collection(db, 'troop_broadcasts'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setBroadcasts(list);
    });

    const unsubTasks = onSnapshot(collection(db, 'parent_tasks'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
      setParentTasks(list);
    });

    return () => {
      unsubUsers();
      unsubGroups();
      unsubBroadcasts();
      unsubTasks();
    };
  }, []);

  if (!isExecutive) {
    return (
      <div className="p-8 bg-slate-800 border border-slate-700 rounded-3xl text-center max-w-xl mx-auto space-y-3">
        <ShieldAlert className="text-red-400 mx-auto" size={40} />
        <h3 className="text-lg font-bold text-white">Executive Access Restricted</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Executive Admin Hub is strictly restricted to the Troop Owner, Superadmins, Scoutmaster, and Assistant Scoutmasters.
        </p>
      </div>
    );
  }

  // ── 1. USER CREATION HANDLER ──
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserErr('');
    setUserMsg('');
    const email = newEmail.trim().toLowerCase();
    const name = newFullName.trim();
    const password = newPassword;

    if (!name || !email || !password) {
      setUserErr('Please provide full name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setUserErr('Password must be at least 6 characters.');
      return;
    }

    setUserCreating(true);

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

      const baseDoc = {
        fullName: name,
        email,
        username: email.split('@')[0],
        role: newUserType,
        createdAt: serverTimestamp()
      };

      if (newUserType === 'leader') {
        baseDoc.leaderPosition = newLeaderPosition;
        baseDoc.groupId = newGroupId || null;
      } else if (newUserType === 'parent') {
        baseDoc.linkedScoutIds = newLinkedScoutIds;
      } else if (newUserType === 'scout') {
        baseDoc.groupId = newGroupId || null;
        baseDoc.rank = newRank;
      }

      await setDoc(doc(db, 'users', newUid), baseDoc);
      await setDoc(doc(db, 'users', newUid, 'private', 'secrets'), { password });

      // If parent created, sync parentUids on linked scouts
      if (newUserType === 'parent' && newLinkedScoutIds.length > 0) {
        for (const sId of newLinkedScoutIds) {
          const targetScout = users.find(u => u.uid === sId);
          const existingParents = Array.isArray(targetScout?.parentUids) ? targetScout.parentUids : [];
          if (!existingParents.includes(newUid)) {
            await setDoc(doc(db, 'users', sId), { parentUids: [...existingParents, newUid] }, { merge: true });
          }
        }
      }

      setUserMsg(`✓ Account successfully created for ${name} (${newUserType.toUpperCase()})!`);
      setTimeout(() => {
        setShowUserModal(false);
        setNewFullName('');
        setNewEmail('');
        setNewPassword('');
        setNewLinkedScoutIds([]);
      }, 1500);
    } catch (err) {
      console.error("Failed to create user:", err);
      setUserErr("Error creating account: " + err.message);
    } finally {
      setUserCreating(false);
    }
  };

  // ── 2. EDIT USER HANDLER ──
  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setEditFullName(u.fullName || u.username || '');
    setEditRole(u.role || 'scout');
    setEditLeaderPosition(u.leaderPosition || 'Assistant Scoutmaster');
    setEditGroupId(u.groupId || '');
    setEditParentLinkedScoutIds(u.linkedScoutIds || []);
    setEditYptCompleted(!!u.yptCompleted);
    setEditYptDate(u.yptDate || '');
    setEditPassword('');
    setEditMsg('');
    setEditErr('');
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserUpdating(true);
    setEditMsg('');
    setEditErr('');

    try {
      const updatePayload = {
        fullName: editFullName.trim(),
        role: editRole,
        groupId: editGroupId || null,
        updatedAt: serverTimestamp()
      };

      if (editRole === 'leader') {
        updatePayload.leaderPosition = editLeaderPosition;
        updatePayload.yptCompleted = editYptCompleted;
        updatePayload.yptDate = editYptDate || null;
      } else if (editRole === 'parent') {
        updatePayload.linkedScoutIds = editParentLinkedScoutIds;
      }

      await setDoc(doc(db, 'users', editingUser.uid), updatePayload, { merge: true });

      // If admin reset password
      if (editPassword.trim().length >= 6) {
        await setDoc(doc(db, 'users', editingUser.uid, 'private', 'secrets'), { password: editPassword.trim() }, { merge: true });
      }

      setEditMsg('✓ User account updated successfully!');
      setTimeout(() => setEditingUser(null), 1200);
    } catch (err) {
      console.error("Failed to update user:", err);
      setEditErr("Error updating user: " + err.message);
    } finally {
      setUserUpdating(false);
    }
  };

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Are you sure you want to delete user ${u.fullName || u.username} (${u.email})? This action cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'users', u.uid));
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  // ── 3. PATROL CREATION HANDLER ──
  const handleCreatePatrol = async (e) => {
    e.preventDefault();
    if (!newPatrolName.trim()) return;
    setPatrolCreating(true);
    setPatrolMsg('');

    try {
      const patrolId = `patrol_${Date.now()}`;
      await setDoc(doc(db, 'groups', patrolId), {
        id: patrolId,
        name: newPatrolName.trim(),
        motto: newPatrolMotto.trim() || 'Forward with Honor',
        leaderId: newPatrolLeaderId || null,
        archived: false,
        createdAt: serverTimestamp()
      });

      // If leader assigned, update leader's groupId
      if (newPatrolLeaderId) {
        await setDoc(doc(db, 'users', newPatrolLeaderId), { groupId: patrolId }, { merge: true });
      }

      setPatrolMsg(`✓ Patrol "${newPatrolName}" created successfully!`);
      setNewPatrolName('');
      setNewPatrolMotto('');
      setNewPatrolLeaderId('');
      setTimeout(() => setPatrolMsg(''), 3000);
    } catch (err) {
      alert("Error creating patrol: " + err.message);
    } finally {
      setPatrolCreating(false);
    }
  };

  // ── 4. GLOBAL ANNOUNCEMENT / BROADCAST HANDLER ──
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    setBroadcastSending(true);
    setBroadcastMsg('');

    try {
      const broadcastDoc = {
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        priority: broadcastPriority,
        scope: broadcastScope, // 'all' or specific groupId
        authorId: currentUser?.uid || '',
        authorName: currentUser?.fullName || currentUser?.username || 'Scoutmaster',
        authorRole: isOwner ? 'Troop Owner' : 'Scoutmaster',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'troop_broadcasts'), broadcastDoc);

      // Inject automated alert to scoped patrol streams
      if (broadcastScope === 'all') {
        groups.forEach(g => {
          dispatchPatrolStreamAlert(g.id, `🚨 [Troop Broadcast - ${broadcastPriority.toUpperCase()}] ${broadcastTitle.trim()}: ${broadcastMessage.trim()}`);
        });
      } else {
        dispatchPatrolStreamAlert(broadcastScope, `📢 [${broadcastPriority.toUpperCase()}] ${broadcastTitle.trim()}: ${broadcastMessage.trim()}`);
      }

      // Dispatch in-app and email notifications to parents
      const parentUsers = users.filter(u => u.role === 'parent');
      for (const p of parentUsers) {
        await dispatchParentNotification({
          recipientUid: p.uid,
          parentEmail: p.email,
          title: `[Troop Announcement] ${broadcastTitle.trim()}`,
          message: broadcastMessage.trim(),
          type: 'broadcast',
          priority: broadcastPriority
        });
      }

      setBroadcastMsg('✓ Announcement published and dispatched to troop streams!');
      setBroadcastTitle('');
      setBroadcastMessage('');
      setTimeout(() => setBroadcastMsg(''), 3500);
    } catch (err) {
      alert("Failed to send broadcast: " + err.message);
    } finally {
      setBroadcastSending(false);
    }
  };

  // ── 5. PARENT TASK & WAIVER CREATION HANDLER ──
  const handleCreateParentTask = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setFormCreating(true);
    setFormSuccessMsg('');

    try {
      const taskId = `task_${Date.now()}`;
      const taskDoc = {
        taskId,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        dueDate: formDueDate || '',
        docUrl: formDocUrl.trim() || '',
        scope: 'all',
        createdBy: currentUser?.uid || '',
        createdByName: currentUser?.fullName || currentUser?.username || 'Executive Leader',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      };

      await setDoc(doc(db, 'parent_tasks', taskId), taskDoc);

      // Trigger multi-channel parent alert for new form assigned
      const parentUsers = users.filter(u => u.role === 'parent');
      for (const p of parentUsers) {
        await dispatchParentNotification({
          recipientUid: p.uid,
          parentEmail: p.email,
          title: `New Action Item: ${formTitle.trim()}`,
          message: `A new required form/waiver has been assigned. Please submit by ${formDueDate || 'the deadline'}.`,
          type: 'waiver',
          priority: 'urgent',
          actionUrl: '/#tasks'
        });
      }

      setFormSuccessMsg('✓ Required task/waiver published and dispatched to parents!');
      setFormTitle('');
      setFormDescription('');
      setFormDocUrl('');
      setFormDueDate('');
      setTimeout(() => setFormSuccessMsg(''), 3000);
    } catch (err) {
      alert("Error publishing form: " + err.message);
    } finally {
      setFormCreating(false);
    }
  };

  // Filtered Users List
  const scoutsList = users.filter(u => u.role === 'scout');
  const leadersList = users.filter(u => u.role === 'leader' || u.role === 'owner' || u.role === 'admin');
  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (u.fullName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-950/60 shrink-0">
            <Crown size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-black text-white">Executive Admin Hub</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                {isOwner ? 'Troop Superadmin' : 'Scoutmaster Console'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Global governance: user provisioning, role hierarchy, patrol architecture, troop broadcasts, and parent health forms registry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            <UserPlus size={16} />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'users', label: `Global User Directory (${users.length})`, icon: Users },
          { id: 'patrols', label: `Patrol Architecture (${groups.length})`, icon: FolderTree },
          { id: 'broadcasts', label: `Troop Broadcasts (${broadcasts.length})`, icon: Megaphone },
          { id: 'forms', label: `Parent Forms & Waivers (${parentTasks.length})`, icon: FileText }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-850 border border-slate-750 text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 1. GLOBAL USER DIRECTORY TAB ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Roles ({users.length})</option>
                <option value="leader">Leaders ({leadersList.length})</option>
                <option value="parent">Parents ({users.filter(u => u.role === 'parent').length})</option>
                <option value="scout">Scouts ({scoutsList.length})</option>
              </select>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {filteredUsers.length} of {users.length} accounts
            </span>
          </div>

          {/* Users Table */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-750">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role & Position</th>
                    <th className="p-4">Assigned Patrol</th>
                    <th className="p-4">Linked Profile Details</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-750">
                  {filteredUsers.map(u => {
                    const uPatrol = groups.find(g => g.id === u.groupId)?.name || (u.groupId ? 'Patrol' : 'Unassigned');
                    const isSuper = u.role === 'owner' || u.email === 'neoissa@gmail.com';

                    return (
                      <tr key={u.uid} className="hover:bg-slate-800/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xs shrink-0">
                              {u.fullName?.charAt(0) || u.username?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <strong className="text-white block truncate">{u.fullName || u.username}</strong>
                              <span className="text-[11px] text-slate-400 block truncate">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border font-bold ${
                            isSuper ? 'bg-amber-950 text-amber-300 border-amber-600' :
                            u.role === 'leader' ? 'bg-emerald-950 text-emerald-300 border-emerald-600' :
                            u.role === 'parent' ? 'bg-sky-950 text-sky-300 border-sky-600' :
                            'bg-slate-900 text-slate-300 border-slate-700'
                          }`}>
                            {isSuper ? '👑 Owner' : u.role === 'leader' ? `⚜️ ${u.leaderPosition || 'Leader'}` : u.role === 'parent' ? '👨‍👩‍👧 Parent' : '🏕️ Scout'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-300 font-medium">
                            {uPatrol !== 'Unassigned' ? `👥 ${uPatrol} Patrol` : <span className="text-slate-500 italic">None</span>}
                          </span>
                        </td>

                        <td className="p-4 text-slate-400 text-[11px]">
                          {u.role === 'parent' ? (
                            <span>{Array.isArray(u.linkedScoutIds) ? `${u.linkedScoutIds.length} Linked Children` : 'No children linked'}</span>
                          ) : u.role === 'scout' ? (
                            <span>Rank: <strong className="text-white">{u.rank || 'Scout'}</strong></span>
                          ) : (
                            <span>YPT: <strong className={u.yptCompleted ? 'text-emerald-400' : 'text-amber-400'}>{u.yptCompleted ? '✓ Certified' : 'Pending'}</strong></span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                              title="Edit User"
                            >
                              <Edit3 size={13} />
                            </button>
                            {!isSuper && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-2 bg-slate-800 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition"
                                title="Delete User"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. PATROL ARCHITECTURE TAB ── */}
      {activeTab === 'patrols' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Patrol Form */}
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FolderTree size={18} className="text-emerald-400" />
              <span>Establish New Patrol</span>
            </h3>
            <p className="text-xs text-slate-400">
              Create a new patrol unit and delegate an operational patrol leader.
            </p>

            {patrolMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-700">{patrolMsg}</p>}

            <form onSubmit={handleCreatePatrol} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Falcon, Eagle, Wolves"
                  value={newPatrolName}
                  onChange={(e) => setNewPatrolName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Motto / Call</label>
                <input
                  type="text"
                  placeholder="e.g. Soar High with Honor"
                  value={newPatrolMotto}
                  onChange={(e) => setNewPatrolMotto(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Assign Patrol Leader</label>
                <select
                  value={newPatrolLeaderId}
                  onChange={(e) => setNewPatrolLeaderId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select Leader...</option>
                  {leadersList.map(l => (
                    <option key={l.uid} value={l.uid}>{l.fullName || l.username} ({l.leaderPosition || 'Leader'})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={patrolCreating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={15} />
                <span>{patrolCreating ? 'Creating...' : 'Create Patrol Unit'}</span>
              </button>
            </form>
          </div>

          {/* Active Patrols Directory */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-white text-base">Active Patrol Units ({groups.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map(g => {
                const pScouts = scoutsList.filter(s => s.groupId === g.id);
                const pLeader = leadersList.find(l => l.uid === g.leaderId || l.groupId === g.id);

                return (
                  <div key={g.id} className="bg-slate-850 border border-slate-755 p-5 rounded-3xl space-y-3 shadow-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-white text-base">👥 {g.name} Patrol</h4>
                        {g.motto && <p className="text-xs text-slate-400 italic">"{g.motto}"</p>}
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                        {pScouts.length} Scouts
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Patrol Leader:</span>
                      <p className="text-white font-semibold">{pLeader?.fullName || pLeader?.username || 'No Leader Assigned'}</p>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                      <span>ID: {g.id}</span>
                      <span className="text-emerald-400 font-bold">Active Standing</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. TROOP BROADCASTS TAB ── */}
      {activeTab === 'broadcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Megaphone size={18} className="text-amber-400" />
              <span>Publish Troop Broadcast</span>
            </h3>
            <p className="text-xs text-slate-400">
              Only executives can push global announcements to all patrols and parent notification centers.
            </p>

            {broadcastMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-700">{broadcastMsg}</p>}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Broadcast Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Weather Update / Campout Departure"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Priority</label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">🚨 Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Push Scope</label>
                  <select
                    value={broadcastScope}
                    onChange={(e) => setBroadcastScope(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">⚡ Push to All Patrols</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} Patrol Only</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Broadcast Message Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter full details of the announcement to push across all parent feeds and patrol streams..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={broadcastSending}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={15} />
                <span>{broadcastSending ? 'Broadcasting...' : 'Publish Broadcast'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-white text-base">Broadcast History ({broadcasts.length})</h3>
            <div className="space-y-3">
              {broadcasts.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-850 rounded-3xl border border-slate-755">
                  No announcements published yet.
                </p>
              ) : (
                broadcasts.map(b => (
                  <div key={b.id} className="bg-slate-850 border border-slate-755 p-5 rounded-3xl space-y-2 shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          b.priority === 'urgent' ? 'bg-red-950 text-red-300 border-red-600' :
                          b.priority === 'high' ? 'bg-amber-950 text-amber-300 border-amber-600' :
                          'bg-slate-900 text-slate-300 border-slate-700'
                        }`}>
                          {b.priority?.toUpperCase()}
                        </span>
                        <strong className="text-sm font-bold text-white">{b.title}</strong>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{b.createdAt?.split('T')[0] || ''}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{b.message}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>Author: {b.authorName}</span>
                      <span>Scope: {b.scope === 'all' ? 'Troop-Wide' : 'Patrol Scoped'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. PARENT FORMS & WAIVERS REGISTRY TAB ── */}
      {activeTab === 'forms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FileText size={18} className="text-sky-400" />
              <span>Assign Parent Form / Waiver</span>
            </h3>
            <p className="text-xs text-slate-400">
              Publish medical forms (Parts A/B/C), activity waivers, and permission slips to the Parent Action Center.
            </p>

            {formSuccessMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-700">{formSuccessMsg}</p>}

            <form onSubmit={handleCreateParentTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Form / Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual BSA Health Record Part A/B/C"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Medical & Health">Medical & Health</option>
                    <option value="Permission Slip">Permission Slip</option>
                    <option value="Camp Waiver">Camp Waiver</option>
                    <option value="Payment / Fee">Payment / Fee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-emerald-400" /> Due Date
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Document / Template URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://scouting.org/forms/... or Google Drive URL"
                  value={formDocUrl}
                  onChange={(e) => setFormDocUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Instructions for Parents</label>
                <textarea
                  rows={3}
                  placeholder="Explain requirements, where to sign, and what to submit..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={formCreating}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={15} />
                <span>{formCreating ? 'Publishing...' : 'Publish to Parent Action Center'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-white text-base">Published Forms & Waivers ({parentTasks.length})</h3>
            <div className="space-y-3">
              {parentTasks.map(t => (
                <div key={t.id} className="bg-slate-850 border border-slate-755 p-5 rounded-3xl space-y-2.5 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full font-bold">
                          {t.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full">
                          Due: {t.dueDate || 'Ongoing'}
                        </span>
                      </div>
                      <strong className="text-sm font-bold text-white block">{t.title}</strong>
                    </div>
                  </div>
                  {t.description && <p className="text-xs text-slate-300 leading-relaxed font-sans">{t.description}</p>}
                  {t.docUrl && (
                    <a
                      href={t.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-bold pt-1"
                    >
                      <ExternalLink size={12} /> View Blank Template Document
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE USER MODAL ── */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <UserPlus size={18} className="text-emerald-400" />
                <span>Create New User Account</span>
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {userErr && <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-600">{userErr}</p>}
            {userMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{userMsg}</p>}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Account Role</label>
                <div className="flex gap-2">
                  {[
                    { id: 'leader', label: 'Troop Leader' },
                    { id: 'parent', label: 'Parent / Guardian' },
                    { id: 'scout', label: 'Scout' }
                  ].map(r => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setNewUserType(r.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        newUserType === r.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Reza"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address (Login Username) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ali@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {newUserType === 'leader' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Adult Leader Position</label>
                  <select
                    value={newLeaderPosition}
                    onChange={(e) => setNewLeaderPosition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {BSA_LEADER_POSITIONS.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              )}

              {(newUserType === 'leader' || newUserType === 'scout') && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Assign to Patrol</label>
                  <select
                    value={newGroupId}
                    onChange={(e) => setNewGroupId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Patrol...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} Patrol</option>
                    ))}
                  </select>
                </div>
              )}

              {newUserType === 'parent' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Link Scout Children</label>
                  <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-700">
                    {scoutsList.map(s => (
                      <label key={s.uid} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newLinkedScoutIds.includes(s.uid)}
                          onChange={(e) => {
                            if (e.target.checked) setNewLinkedScoutIds([...newLinkedScoutIds, s.uid]);
                            else setNewLinkedScoutIds(newLinkedScoutIds.filter(id => id !== s.uid));
                          }}
                        />
                        <span>{s.fullName || s.username} ({s.rank || 'Scout'})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={userCreating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <UserPlus size={15} />
                  <span>{userCreating ? 'Creating...' : 'Create Account'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT USER MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Edit3 size={18} className="text-emerald-400" />
                <span>Edit User: {editingUser.fullName || editingUser.username}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {editErr && <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-600">{editErr}</p>}
            {editMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{editMsg}</p>}

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Role Elevation</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="scout">Scout</option>
                    <option value="parent">Parent</option>
                    <option value="leader">Leader</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Troop Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Assignment</label>
                  <select
                    value={editGroupId}
                    onChange={(e) => setEditGroupId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Unassigned</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} Patrol</option>
                    ))}
                  </select>
                </div>
              </div>

              {editRole === 'leader' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Leader Position</label>
                    <select
                      value={editLeaderPosition}
                      onChange={(e) => setEditLeaderPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {BSA_LEADER_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={editYptCompleted}
                      onChange={(e) => setEditYptCompleted(e.target.checked)}
                    />
                    <span>Youth Protection Training (YPT) Certified</span>
                  </label>
                </div>
              )}

              {editRole === 'parent' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Linked Children</label>
                  <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-700">
                    {scoutsList.map(s => (
                      <label key={s.uid} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editParentLinkedScoutIds.includes(s.uid)}
                          onChange={(e) => {
                            if (e.target.checked) setEditParentLinkedScoutIds([...editParentLinkedScoutIds, s.uid]);
                            else setEditParentLinkedScoutIds(editParentLinkedScoutIds.filter(id => id !== s.uid));
                          }}
                        />
                        <span>{s.fullName || s.username} ({s.rank || 'Scout'})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave empty to keep existing password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={userUpdating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={15} />
                  <span>{userUpdating ? 'Saving Changes...' : 'Save User Updates'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
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
