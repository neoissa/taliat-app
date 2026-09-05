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
  getDocs,
  getDoc,
  updateDoc,
  deleteField,
  query,
  where,
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
  Bell,
  RotateCcw,
  Copy,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  CheckSquare,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Eye,
  BarChart3,
  UserCheck,
  Archive,
  Camera,
  TrendingUp
} from 'lucide-react';
import { dispatchParentNotification, dispatchPatrolStreamAlert } from '../utils/notificationPipeline';
import { RANKS_DATA } from '../data/ranksData';
import { 
  getKashafGreeting, 
  getLockedClosing, 
  generateLeaderInviteMessage, 
  generateScoutInviteMessage, 
  generateParentInviteMessage, 
  applyIslamicTransliteration 
} from '../utils/kashafVoice';

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


function compressImage(file, maxWidth = 300, maxHeight = 300, quality = 0.8) {
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
  const [editUsername, setEditUsername] = useState('');
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

  // WhatsApp Share Modal State
  const [whatsappUser, setWhatsappUser] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappPassword, setWhatsappPassword] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('scout_invite');
  const [whatsappCustomMsg, setWhatsappCustomMsg] = useState('');
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // Profile Progress Reset Modal State
  const [resettingUser, setResettingUser] = useState(null);
  const [resetConfirmationInput, setResetConfirmationInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetProgressStep, setResetProgressStep] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [resetErrMsg, setResetErrMsg] = useState('');

  // Additional Collections for Patrol Progress
  const [serviceLogs, setServiceLogs] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);

  // Patrol Progress Filtering
  const [selectedProgressPatrolId, setSelectedProgressPatrolId] = useState('all');
  const [progressSearchQuery, setProgressSearchQuery] = useState('');

  // Patrol Creation & Edit State
  const [newPatrolName, setNewPatrolName] = useState('');
  const [newPatrolMotto, setNewPatrolMotto] = useState('');
  const [newPatrolLeaderId, setNewPatrolLeaderId] = useState('');
  const [newPatrolPhotoURL, setNewPatrolPhotoURL] = useState('');
  const [patrolCreating, setPatrolCreating] = useState(false);
  const [patrolMsg, setPatrolMsg] = useState('');

  // Editing Patrol Modal State
  const [editingPatrol, setEditingPatrol] = useState(null);
  const [editPatrolName, setEditPatrolName] = useState('');
  const [editPatrolMotto, setEditPatrolMotto] = useState('');
  const [editPatrolLeaderId, setEditPatrolLeaderId] = useState('');
  const [editPatrolPhotoURL, setEditPatrolPhotoURL] = useState('');
  const [editPatrolScoutIds, setEditPatrolScoutIds] = useState([]);
  const [patrolUpdating, setPatrolUpdating] = useState(false);
  const [editPatrolMsg, setEditPatrolMsg] = useState('');
  const [editPatrolErr, setEditPatrolErr] = useState('');

  // Quick Roster Management Modal
  const [managingPatrolScouts, setManagingPatrolScouts] = useState(null);


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

    const unsubService = onSnapshot(collection(db, 'service_logs'), (snap) => {
      setServiceLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      setAttendanceSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubGroups();
      unsubBroadcasts();
      unsubTasks();
      unsubService();
      unsubAttendance();
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
    setEditUsername(u.username || (u.email ? u.email.split('@')[0] : ''));
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

      // Owner-only: Allow username modification
      if (isOwner && editUsername.trim()) {
        const cleanedUsername = editUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
        updatePayload.username = cleanedUsername;
      }

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

  // ── 2.4 WHATSAPP LOGIN SHARING HANDLER ──
  const handleOpenWhatsAppModal = async (u) => {
    setWhatsappUser(u);
    const phone = u.scoutPhone || u.parentPhone || u.phone || '';
    setWhatsappPhone(phone);
    
    // Auto-select template based on recipient role
    if (u.role === 'leader' || u.role === 'owner') {
      setWhatsappTemplate('leader_invite');
    } else if (u.role === 'parent') {
      setWhatsappTemplate('parent_invite');
    } else {
      setWhatsappTemplate('scout_invite');
    }

    setWhatsappCustomMsg('');
    setWhatsappCopied(false);
    setWhatsappLoading(true);

    let pass = '';
    try {
      const snap = await getDoc(doc(db, 'users', u.uid, 'private', 'secrets'));
      if (snap.exists() && snap.data().password) {
        pass = snap.data().password;
      }
    } catch (e) {
      console.warn("Could not fetch secrets:", e);
    }
    if (!pass) {
      pass = u.tempPassword || u.username || 'taliat2026';
    }
    setWhatsappPassword(pass);
    setWhatsappLoading(false);
  };

  const getWhatsAppMessageText = () => {
    if (!whatsappUser) return '';
    const name = whatsappUser.fullName || whatsappUser.username || 'Member';
    const username = whatsappUser.username || whatsappUser.email || 'username';
    const password = whatsappPassword || 'taliat2026';
    const uPatrol = groups.find(g => g.id === whatsappUser.groupId)?.name || '';
    const patrolName = uPatrol;
    const leaderPosition = whatsappUser.leaderPosition || (whatsappUser.role === 'owner' ? 'Troop Headmaster / Lead Admin' : 'Scout Leader');

    if (whatsappTemplate === 'leader_invite') {
      return generateLeaderInviteMessage({
        name,
        username,
        password,
        leaderPosition,
        patrolName,
        appUrl
      });
    }

    if (whatsappTemplate === 'scout_invite') {
      return generateScoutInviteMessage({
        name,
        username,
        password,
        patrolName,
        appUrl
      });
    }

    if (whatsappTemplate === 'parent_invite') {
      return generateParentInviteMessage({
        name,
        email: whatsappUser.email || '',
        username,
        password,
        patrolName,
        appUrl
      });
    }

    // Role-aware greeting for Meeting & Custom messages
    let recipientType = 'parent';
    if (whatsappUser.role === 'leader' || whatsappUser.role === 'owner') {
      recipientType = 'leader';
    } else if (whatsappUser.role === 'scout') {
      recipientType = 'scout';
    }
    const greeting = getKashafGreeting(recipientType, name);
    const lockedClosing = getLockedClosing(patrolName);

    if (whatsappTemplate === 'meeting') {
      return `${greeting}

Just a quick note to remind you about our upcoming Dhulfiqār Scouting Session.

🔗 *Portal Link:* ${appUrl}
📍 *Preparation:* Please arrive on time in full uniform with your Scout Handbook and notebook ready.${lockedClosing}`;
    }

    if (whatsappTemplate === 'custom') {
      const customContent = whatsappCustomMsg.trim();
      return customContent 
        ? `${greeting}\n\n${applyIslamicTransliteration(customContent)}${lockedClosing}` 
        : '';
    }

    return '';
  };

  const handleCopyWhatsAppMsg = () => {
    const text = getWhatsAppMessageText();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2500);
    });
  };

  // ── 2.5 CLEAR ALL PROGRESS & PROFILE RESET HANDLER ──
  const handleExecuteResetProgress = async (userToReset) => {
    if (!userToReset?.uid) return;
    setIsResetting(true);
    setResetErrMsg('');
    setResetSuccessMsg('');
    setResetProgressStep('Starting profile reset...');

    const uid = userToReset.uid;

    try {
      // 1. Delete all rank progress docs: /user_progress/{uid}/ranks/*
      setResetProgressStep('1/9: Clearing BSA Rank advancement & signoffs...');
      const ranksRef = collection(db, 'user_progress', uid, 'ranks');
      const ranksSnap = await getDocs(ranksRef);
      await Promise.all(ranksSnap.docs.map(d => deleteDoc(d.ref)));

      // 2. Delete all merit badges progress docs: /user_progress/{uid}/merit_badges/*
      setResetProgressStep('2/9: Clearing merit badge steps & completions...');
      const meritRef = collection(db, 'user_progress', uid, 'merit_badges');
      const meritSnap = await getDocs(meritRef);
      await Promise.all(meritSnap.docs.map(d => deleteDoc(d.ref)));

      // 3. Delete islamic basics progress: /user_progress/{uid}/islamic_basics/*
      setResetProgressStep('3/9: Clearing Islamic studies test records...');
      try {
        await deleteDoc(doc(db, 'user_progress', uid, 'islamic_basics', 'status'));
      } catch (e) { /* ignore */ }
      const islamicRef = collection(db, 'user_progress', uid, 'islamic_basics');
      const islamicSnap = await getDocs(islamicRef);
      await Promise.all(islamicSnap.docs.map(d => deleteDoc(d.ref)));

      // 4. Delete user assignments progress: /user_progress/{uid}/assignments/*
      setResetProgressStep('4/9: Clearing assignment submissions...');
      const userAssignRef = collection(db, 'user_progress', uid, 'assignments');
      const userAssignSnap = await getDocs(userAssignRef);
      await Promise.all(userAssignSnap.docs.map(d => deleteDoc(d.ref)));

      // 5. Delete global scout_homework docs where scoutId == uid
      setResetProgressStep('5/9: Clearing homework records...');
      const hwQuery = query(collection(db, 'scout_homework'), where('scoutId', '==', uid));
      const hwSnap = await getDocs(hwQuery);
      await Promise.all(hwSnap.docs.map(d => deleteDoc(d.ref)));

      // 6. Delete service logs: /service_logs where scoutId == uid or userId == uid
      setResetProgressStep('6/9: Clearing service hours & volunteering logs...');
      const srvQuery1 = query(collection(db, 'service_logs'), where('scoutId', '==', uid));
      const srvSnap1 = await getDocs(srvQuery1);
      await Promise.all(srvSnap1.docs.map(d => deleteDoc(d.ref)));

      const srvQuery2 = query(collection(db, 'service_logs'), where('userId', '==', uid));
      const srvSnap2 = await getDocs(srvQuery2);
      await Promise.all(srvSnap2.docs.map(d => deleteDoc(d.ref)));

      // 7. Delete scout notes: /scout_notes/{uid}
      setResetProgressStep('7/9: Clearing private leader notes & journal logs...');
      try {
        await deleteDoc(doc(db, 'scout_notes', uid));
      } catch (e) { /* ignore */ }

      // 8. Delete attendance excuses: /attendance_excuses where scoutId == uid
      setResetProgressStep('8/9: Clearing attendance absence notices...');
      const excuseQuery = query(collection(db, 'attendance_excuses'), where('scoutId', '==', uid));
      const excuseSnap = await getDocs(excuseQuery);
      await Promise.all(excuseSnap.docs.map(d => deleteDoc(d.ref)));

      // 9. Remove scout from attendance_sessions records map
      setResetProgressStep('9/9: Resetting patrol attendance roll call records...');
      const sessionsSnap = await getDocs(collection(db, 'attendance_sessions'));
      const sessionUpdates = [];
      sessionsSnap.docs.forEach(sessionDoc => {
        const data = sessionDoc.data();
        if (data.records && data.records[uid]) {
          sessionUpdates.push(
            updateDoc(sessionDoc.ref, {
              [`records.${uid}`]: deleteField()
            })
          );
        }
      });
      await Promise.all(sessionUpdates);

      // 10. Reset user document progress fields: /users/{uid}
      setResetProgressStep('Finalizing profile reset to Scout rank (0% progress)...');
      await setDoc(doc(db, 'users', uid), {
        rank: 'Scout',
        rankAdvancementPercent: 0,
        meritBadgesCount: 0,
        serviceHours: 0,
        completedRequirements: {},
        rankProgress: {},
        badges: [],
        bio: '',
        updatedAt: serverTimestamp()
      }, { merge: true });

      setResetProgressStep('✓ Profile reset completed successfully!');
      setResetSuccessMsg(`✓ All progress for "${userToReset.fullName || userToReset.username}" has been completely cleared and restored to initial standing.`);
      setTimeout(() => {
        setResettingUser(null);
        setResetConfirmationInput('');
        setResetSuccessMsg('');
        if (editingUser?.uid === uid) {
          setEditingUser(null);
        }
      }, 2000);
    } catch (err) {
      console.error("Failed to reset user progress:", err);
      setResetErrMsg("Error resetting profile: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  // ── 3. PATROL CREATION & UPDATE HANDLERS ──
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
        photoURL: newPatrolPhotoURL || null,
        archived: false,
        createdAt: serverTimestamp()
      });

      // If leader assigned, update leader's groupId
      if (newPatrolLeaderId) {
        await setDoc(doc(db, 'users', newPatrolLeaderId), { groupId: patrolId, patrolId: patrolId }, { merge: true });
      }

      setPatrolMsg(`✓ Patrol "${newPatrolName}" created successfully!`);
      setNewPatrolName('');
      setNewPatrolMotto('');
      setNewPatrolLeaderId('');
      setNewPatrolPhotoURL('');
      setTimeout(() => setPatrolMsg(''), 3000);
    } catch (err) {
      alert("Error creating patrol: " + err.message);
    } finally {
      setPatrolCreating(false);
    }
  };

  const handleOpenEditPatrol = (patrol) => {
    setEditingPatrol(patrol);
    setEditPatrolName(patrol.name || '');
    setEditPatrolMotto(patrol.motto || '');
    setEditPatrolLeaderId(patrol.leaderId || '');
    setEditPatrolPhotoURL(patrol.photoURL || '');
    const currentScouts = scoutsList.filter(s => s.groupId === patrol.id || s.patrolId === patrol.id).map(s => s.uid);
    setEditPatrolScoutIds(currentScouts);
    setEditPatrolMsg('');
    setEditPatrolErr('');
  };

  const handleSaveEditPatrol = async (e) => {
    e.preventDefault();
    if (!editingPatrol || !editPatrolName.trim()) return;
    setPatrolUpdating(true);
    setEditPatrolMsg('');
    setEditPatrolErr('');

    try {
      const patrolRef = doc(db, 'groups', editingPatrol.id);
      await updateDoc(patrolRef, {
        name: editPatrolName.trim(),
        motto: editPatrolMotto.trim() || 'Forward with Honor',
        leaderId: editPatrolLeaderId || null,
        photoURL: editPatrolPhotoURL || null,
        updatedAt: serverTimestamp()
      });

      // Sync leader assignment
      if (editPatrolLeaderId) {
        await setDoc(doc(db, 'users', editPatrolLeaderId), { groupId: editingPatrol.id, patrolId: editingPatrol.id }, { merge: true });
      }
      if (editingPatrol.leaderId && editingPatrol.leaderId !== editPatrolLeaderId) {
        // Clear previous leader's groupId if reassigned
        await updateDoc(doc(db, 'users', editingPatrol.leaderId), { groupId: null, patrolId: null });
      }

      // Sync scout assignments
      const previousScouts = scoutsList.filter(s => s.groupId === editingPatrol.id || s.patrolId === editingPatrol.id).map(s => s.uid);
      
      // Add newly assigned scouts
      for (const sUid of editPatrolScoutIds) {
        if (!previousScouts.includes(sUid)) {
          await updateDoc(doc(db, 'users', sUid), { groupId: editingPatrol.id, patrolId: editingPatrol.id });
        }
      }

      // Remove unassigned scouts
      for (const sUid of previousScouts) {
        if (!editPatrolScoutIds.includes(sUid)) {
          await updateDoc(doc(db, 'users', sUid), { groupId: null, patrolId: null });
        }
      }

      setEditPatrolMsg('✓ Patrol details and scout roster successfully updated!');
      setTimeout(() => setEditingPatrol(null), 1200);
    } catch (err) {
      console.error("Failed to update patrol:", err);
      setEditPatrolErr("Error updating patrol: " + err.message);
    } finally {
      setPatrolUpdating(false);
    }
  };

  const handleDirectEmblemUpload = async (file, patrolId) => {
    if (!file) return;
    try {
      const compressed = await compressImage(file, 250, 250, 0.85);
      await updateDoc(doc(db, 'groups', patrolId), { photoURL: compressed });
    } catch (err) {
      console.error("Failed to upload emblem:", err);
      alert("Failed to upload emblem image: " + err.message);
    }
  };

  const handleDeletePatrol = async (patrol) => {
    if (!window.confirm(`Are you sure you want to delete the "${patrol.name}" Patrol? All assigned scouts will be unassigned.`)) return;
    try {
      // Unassign scouts
      const assignedScouts = scoutsList.filter(s => s.groupId === patrol.id || s.patrolId === patrol.id);
      for (const s of assignedScouts) {
        await updateDoc(doc(db, 'users', s.uid), { groupId: null, patrolId: null });
      }
      // Unassign leader
      if (patrol.leaderId) {
        await updateDoc(doc(db, 'users', patrol.leaderId), { groupId: null, patrolId: null });
      }
      await deleteDoc(doc(db, 'groups', patrol.id));
    } catch (err) {
      alert("Failed to delete patrol: " + err.message);
    }
  };

  const handleToggleArchivePatrol = async (patrol) => {
    try {
      await updateDoc(doc(db, 'groups', patrol.id), { archived: !patrol.archived });
    } catch (err) {
      alert("Failed to archive patrol: " + err.message);
    }
  };

  const handleQuickAssignScout = async (scoutUid, newGroupId) => {
    try {
      await updateDoc(doc(db, 'users', scoutUid), {
        groupId: newGroupId || null,
        patrolId: newGroupId || null
      });
    } catch (err) {
      console.error("Failed to assign scout:", err);
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
      <div className={`border-2 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
        isOwner 
          ? 'bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-amber-500/60 shadow-amber-950/40' 
          : 'bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-emerald-500/40 shadow-emerald-950/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0 ${
            isOwner 
              ? 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-950/60' 
              : 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-950/60'
          }`}>
            {isOwner ? <Crown size={28} /> : <Shield size={28} />}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-black text-white">
                {isOwner ? '👑 Supreme Troop Owner & Executive Hub' : '⚡ Executive Leadership & Management Hub'}
              </h2>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${
                isOwner 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {isOwner ? '👑 Troop Superadmin (Full Authority)' : '⚜️ Scoutmaster Console'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isOwner 
                ? 'Supreme troop governance: full username modification privileges, account provisioning, role elevations, patrol architecture, broadcasts, and system registries.'
                : 'Executive troop management: patrol administration, scout advancement oversight, event coordination, and parent communications. (Username modifications are restricted to Troop Owner).'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUserModal(true)}
            className={`font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg ${
              isOwner 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/50' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
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
          { id: 'patrols', label: `Patrol Architecture & Edit (${groups.length})`, icon: FolderTree },
          { id: 'patrol-progress', label: 'Patrol Progress & Insights', icon: TrendingUp },
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
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                              title="Edit User Details"
                            >
                              <Edit3 size={13} />
                            </button>

                            {/* WhatsApp Share Button */}
                            <button
                              onClick={() => handleOpenWhatsAppModal(u)}
                              className="p-2 bg-slate-800 hover:bg-emerald-950/80 text-emerald-400 hover:text-emerald-300 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
                              title="Share Credentials & App Link via WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5 fill-emerald-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                              </svg>
                            </button>

                            {/* Reset Progress Button */}
                            <button
                              onClick={() => {
                                setResettingUser(u);
                                setResetConfirmationInput('');
                                setResetErrMsg('');
                                setResetSuccessMsg('');
                              }}
                              className="p-2 bg-slate-800 hover:bg-amber-950/80 text-amber-400 hover:text-amber-200 rounded-xl border border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                              title="Clear All Progress & Reset Profile"
                            >
                              <RotateCcw size={13} />
                            </button>

                            {!isSuper && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-2 bg-slate-800 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                                title="Delete User Account"
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

            {/* ── 2. PATROL ARCHITECTURE & EDIT TAB ── */}
      {activeTab === 'patrols' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Patrol Form */}
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FolderTree size={18} className="text-emerald-400" />
              <span>Establish New Patrol</span>
            </h3>
            <p className="text-xs text-slate-400">
              Create a new patrol unit, upload an emblem, and delegate an operational patrol leader.
            </p>

            {patrolMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-700">{patrolMsg}</p>}

            <form onSubmit={handleCreatePatrol} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Falcon, Eagle, Wolves, Abu al-Fadl"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">Select Leader...</option>
                  {leadersList.map(l => (
                    <option key={l.uid} value={l.uid}>{l.fullName || l.username} ({l.leaderPosition || 'Leader'})</option>
                  ))}
                </select>
              </div>

              {/* Patrol Emblem Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Emblem / Logo (Optional)</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {newPatrolPhotoURL ? (
                      <img src={newPatrolPhotoURL} alt="Patrol Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">⚜️</span>
                    )}
                  </div>
                  <label className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold cursor-pointer text-center transition flex items-center justify-center gap-2">
                    <Camera size={14} className="text-emerald-400" />
                    <span>{newPatrolPhotoURL ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await compressImage(file, 250, 250, 0.85);
                          setNewPatrolPhotoURL(base64);
                        }
                      }}
                    />
                  </label>
                  {newPatrolPhotoURL && (
                    <button
                      type="button"
                      onClick={() => setNewPatrolPhotoURL('')}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
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

          {/* Active Patrols Directory with Edit Capabilities */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Active Patrol Units ({groups.length})</h3>
              <span className="text-xs text-slate-400">Click Edit to modify info, emblem, or scout roster</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map(g => {
                const pScouts = scoutsList.filter(s => s.groupId === g.id || s.patrolId === g.id);
                const pLeader = leadersList.find(l => l.uid === g.leaderId || l.groupId === g.id);

                return (
                  <div key={g.id} className="bg-slate-850 border border-slate-755 p-5 rounded-3xl space-y-3.5 shadow-xl hover:border-emerald-500/40 transition">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Emblem with Hover Upload */}
                        <div className="relative group w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border-2 border-emerald-500/40 flex items-center justify-center text-white font-black text-lg overflow-hidden shrink-0 shadow-md">
                          {g.photoURL ? (
                            <img src={g.photoURL} alt={g.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>👥</span>
                          )}
                          <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-emerald-400" title="Change Patrol Emblem">
                            <Camera size={16} />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleDirectEmblemUpload(e.target.files?.[0], g.id)}
                            />
                          </label>
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-white text-base truncate">{g.name} Patrol</h4>
                          {g.motto && <p className="text-xs text-slate-400 italic truncate">"{g.motto}"</p>}
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono shrink-0">
                        {pScouts.length} Scouts
                      </span>
                    </div>

                    {/* Assigned Leader Box */}
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Patrol Leader:</span>
                      <p className="text-white font-semibold flex items-center gap-1.5">
                        <span>{pLeader?.fullName || pLeader?.username || 'No Leader Assigned'}</span>
                        {pLeader?.leaderPosition && (
                          <span className="text-[10px] text-emerald-400 font-normal">({pLeader.leaderPosition})</span>
                        )}
                      </p>
                    </div>

                    {/* Scouts Roster Chips */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                        <span>Assigned Scouts ({pScouts.length}):</span>
                        <button
                          onClick={() => setManagingPatrolScouts(g)}
                          className="text-emerald-400 hover:text-emerald-300 lowercase hover:underline font-normal cursor-pointer"
                        >
                          + manage roster
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto scrollbar-none">
                        {pScouts.length === 0 ? (
                          <span className="text-[11px] text-slate-500 italic">No scouts assigned yet.</span>
                        ) : (
                          pScouts.map(s => (
                            <span key={s.uid} className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-750 text-slate-300 px-2 py-0.5 rounded-lg">
                              <span>{s.fullName || s.username}</span>
                              <span className="text-emerald-400 font-mono">({s.rank || 'Scout'})</span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditPatrol(g)}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Edit3 size={13} />
                          <span>Edit Patrol</span>
                        </button>

                        <button
                          onClick={() => setManagingPatrolScouts(g)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Users size={13} />
                          <span>Roster</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleArchivePatrol(g)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                          title={g.archived ? 'Unarchive Patrol' : 'Archive Patrol'}
                        >
                          <Archive size={13} />
                        </button>

                        <button
                          onClick={() => handleDeletePatrol(g)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                          title="Delete Patrol"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 2.5 PATROL PROGRESS & INSIGHTS TAB ── */}
      {activeTab === 'patrol-progress' && (
        <div className="space-y-6">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Patrols</span>
              <p className="text-xl font-black text-white">{groups.length}</p>
              <span className="text-[10px] text-emerald-400">Troop Units</span>
            </div>

            <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Scouts</span>
              <p className="text-xl font-black text-white">{scoutsList.length}</p>
              <span className="text-[10px] text-sky-400 font-medium">
                {scoutsList.filter(s => s.groupId).length} Assigned / {scoutsList.filter(s => !s.groupId).length} Unassigned
              </span>
            </div>

            <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Service Hours Logged</span>
              <p className="text-xl font-black text-emerald-400">
                {serviceLogs.reduce((acc, l) => acc + (Number(l.hours) || 0), 0)} hrs
              </p>
              <span className="text-[10px] text-slate-400">{serviceLogs.length} verified logs</span>
            </div>

            <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendance Recorded</span>
              <p className="text-xl font-black text-amber-400">{attendanceSessions.length}</p>
              <span className="text-[10px] text-slate-400">Total sessions</span>
            </div>
          </div>

          {/* Troop Rank Distribution Pills */}
          <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Troop Rank Advancement Distribution
            </span>
            <div className="flex flex-wrap gap-2">
              {['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle'].map(rk => {
                const count = scoutsList.filter(s => (s.rank || 'Scout') === rk).length;
                return (
                  <div key={rk} className="flex items-center gap-1.5 bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-xl text-xs">
                    <span className="text-slate-300 font-semibold">{rk}:</span>
                    <strong className="text-emerald-400 font-mono font-bold">{count}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patrol Filter Selector & Search */}
          <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedProgressPatrolId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedProgressPatrolId === 'all'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                All Patrols ({groups.length})
              </button>
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedProgressPatrolId(g.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedProgressPatrolId === g.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  👥 {g.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search scout in patrol..."
                value={progressSearchQuery}
                onChange={(e) => setProgressSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Patrol Progress Sections */}
          <div className="space-y-6">
            {groups
              .filter(g => selectedProgressPatrolId === 'all' || selectedProgressPatrolId === g.id)
              .map(g => {
                const patrolScouts = scoutsList.filter(s => s.groupId === g.id || s.patrolId === g.id);
                const pLeader = leadersList.find(l => l.uid === g.leaderId || l.groupId === g.id);
                const pServiceHours = serviceLogs
                  .filter(l => patrolScouts.some(s => s.uid === l.scoutId || s.uid === l.userId))
                  .reduce((acc, l) => acc + (Number(l.hours) || 0), 0);

                const filteredScouts = patrolScouts.filter(s => {
                  if (!progressSearchQuery.trim()) return true;
                  const q = progressSearchQuery.toLowerCase();
                  return (s.fullName || '').toLowerCase().includes(q) || (s.username || '').toLowerCase().includes(q) || (s.rank || '').toLowerCase().includes(q);
                });

                return (
                  <div key={g.id} className="bg-slate-850 border border-slate-755 rounded-3xl p-6 shadow-xl space-y-5">
                    {/* Patrol Header Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-755 pb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/40 flex items-center justify-center text-white font-black text-xl overflow-hidden shrink-0 shadow-md">
                          {g.photoURL ? (
                            <img src={g.photoURL} alt={g.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>👥</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white">{g.name} Patrol</h3>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                              {patrolScouts.length} Scouts
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Leader: <strong className="text-slate-200">{pLeader?.fullName || pLeader?.username || 'None'}</strong> • Motto: <em className="text-slate-300">"{g.motto || 'Forward'}"</em>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-750">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Patrol Service</span>
                          <span className="text-xs font-mono font-black text-emerald-400">{pServiceHours} Hours</span>
                        </div>
                        <button
                          onClick={() => handleOpenEditPatrol(g)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                    {/* Scouts Progress Table */}
                    {filteredScouts.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">No scouts found in this patrol matching your query.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-755">
                            <tr>
                              <th className="p-3">Scout Name</th>
                              <th className="p-3">Current Rank</th>
                              <th className="p-3">Service Hours</th>
                              <th className="p-3">Attendance</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-755">
                            {filteredScouts.map(scout => {
                              const sHours = serviceLogs
                                .filter(l => l.scoutId === scout.uid || l.userId === scout.uid)
                                .reduce((acc, l) => acc + (Number(l.hours) || 0), 0);
                              const sAttCount = attendanceSessions.filter(s => s.records && s.records[scout.uid]).length;

                              return (
                                <tr key={scout.uid} className="hover:bg-slate-800/40 transition">
                                  <td className="p-3">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0 overflow-hidden">
                                        {scout.photoURL ? (
                                          <img src={scout.photoURL} alt={scout.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                          <span>{scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}</span>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <strong className="text-white block truncate">{scout.fullName || scout.username}</strong>
                                        <span className="text-[10px] text-slate-400 block truncate">{scout.email}</span>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-3">
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-full font-bold">
                                      ⚜️ {scout.rank || 'Scout'}
                                    </span>
                                  </td>

                                  <td className="p-3 font-mono font-bold text-emerald-400">
                                    {sHours} hrs
                                  </td>

                                  <td className="p-3 font-mono text-slate-300">
                                    {sAttCount} sessions
                                  </td>

                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleOpenWhatsAppModal(scout)}
                                        className="p-1.5 bg-slate-800 hover:bg-emerald-950 text-emerald-400 rounded-lg border border-slate-700 transition cursor-pointer"
                                        title="WhatsApp Onboarding / Message"
                                      >
                                        <MessageSquare size={12} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setResettingUser(scout);
                                          setResetConfirmationInput('');
                                          setResetErrMsg('');
                                          setResetSuccessMsg('');
                                        }}
                                        className="p-1.5 bg-slate-800 hover:bg-amber-950 text-amber-400 rounded-lg border border-slate-700 transition cursor-pointer"
                                        title="Clear All Progress / Reset Profile"
                                      >
                                        <RotateCcw size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleOpenEditUser(scout)}
                                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
                                        title="Edit Scout Details"
                                      >
                                        <Edit3 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Unassigned Scouts Card */}
            {scoutsList.filter(s => !s.groupId).length > 0 && (
              <div className="bg-amber-950/20 border border-amber-600/40 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span>Unassigned Scouts ({scoutsList.filter(s => !s.groupId).length})</span>
                  </h3>
                  <span className="text-xs text-amber-400/80">Select a patrol below to assign immediately</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {scoutsList.filter(s => !s.groupId).map(s => (
                    <div key={s.uid} className="bg-slate-900 border border-slate-750 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md">
                      <div className="min-w-0">
                        <strong className="text-white text-xs block truncate">{s.fullName || s.username}</strong>
                        <span className="text-[10px] text-slate-400 block truncate">{s.rank || 'Scout'} • {s.email}</span>
                      </div>
                      <select
                        onChange={(e) => handleQuickAssignScout(s.uid, e.target.value)}
                        defaultValue=""
                        className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="" disabled>Assign...</option>
                        {groups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      {/* ── WHATSAPP PREDEFINED CREDENTIALS & INVITATION MODAL ── */}
      {whatsappUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  <svg className="w-5 h-5 fill-emerald-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Share Credentials via WhatsApp</h3>
                  <p className="text-[11px] text-slate-400">Predefined template with login link & profile setup instructions</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Target User Info & Editable Phone Number */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white block font-bold">{whatsappUser.fullName || whatsappUser.username}</strong>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      whatsappUser.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      whatsappUser.role === 'leader' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      whatsappUser.role === 'parent' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {whatsappUser.role || 'scout'}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5 space-x-2">
                    <span>User: <strong className="text-slate-200">{whatsappUser.username || whatsappUser.email}</strong></span>
                    {whatsappUser.leaderPosition && <span>• Pos: <strong className="text-emerald-300">{whatsappUser.leaderPosition}</strong></span>}
                    {groups.find(g => g.id === whatsappUser.groupId)?.name && (
                      <span>• Patrol: <strong className="text-slate-300">{groups.find(g => g.id === whatsappUser.groupId)?.name}</strong></span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-slate-800 text-teal-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono font-bold block">
                    Pass: {whatsappPassword || 'taliat2026'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Recipient WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 13135551234 or +13135551234"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Template Selector Pills */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Message Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('scout_invite')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'scout_invite'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>⚜️ Scout Login & Setup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('leader_invite')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'leader_invite'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🛡️ Leader Onboarding</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('parent_invite')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'parent_invite'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>👨‍👩‍👧 Parent Invite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('meeting')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    whatsappTemplate === 'meeting'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>📅 Meeting Reminder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappTemplate('custom')}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 col-span-2 sm:col-span-1 ${
                    whatsappTemplate === 'custom'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>✏️ Custom Message</span>
                </button>
              </div>
            </div>

            {/* Custom message textarea if custom selected */}
            {whatsappTemplate === 'custom' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Custom Message Content:
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your WhatsApp message..."
                  value={whatsappCustomMsg}
                  onChange={(e) => setWhatsappCustomMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>
            )}

            {/* Message Preview Box */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Message Preview:
                </label>
                <span className="text-[10px] text-teal-300 font-mono">App Link: https://taliat-app.vercel.app/</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-sans text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                {getWhatsAppMessageText() || <span className="text-slate-500 italic">Enter message content above...</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyWhatsAppMsg}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
              >
                {whatsappCopied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-300">✓ Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getWhatsAppMessageText())}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => setWhatsappUser(null), 1000);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                </svg>
                <span>Open in WhatsApp &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}

            {/* ── RESET PROFILE PROGRESS SAFETY CONFIRMATION MODAL ── */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold shrink-0">
                  <RotateCcw size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Reset Profile & Clear All Progress</h3>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Permanent Danger Action</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isResetting) {
                    setResettingUser(null);
                    setResetConfirmationInput('');
                    setResetErrMsg('');
                    setResetSuccessMsg('');
                  }
                }}
                disabled={isResetting}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {resetErrMsg && (
              <div className="p-3 bg-red-950/80 border border-red-600 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-red-400" />
                <span>{resetErrMsg}</span>
              </div>
            )}

            {resetSuccessMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            {/* Target User Summary Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-sm shrink-0">
                {resettingUser.fullName?.charAt(0) || resettingUser.username?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-white truncate">{resettingUser.fullName || resettingUser.username}</h4>
                <p className="text-[11px] text-slate-400 truncate">{resettingUser.email} &bull; <strong className="text-emerald-400 capitalize">{resettingUser.role || 'Scout'}</strong></p>
                <span className="text-[10px] text-slate-500 font-mono">Current Rank: {resettingUser.rank || 'Scout'}</span>
              </div>
            </div>

            {/* Deletion Scope Warning List */}
            <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-4 space-y-2 text-xs">
              <p className="text-red-300 font-bold flex items-center gap-1.5">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <span>This will permanently wipe and reset the following records:</span>
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px] pl-5 list-disc">
                <li><strong>⚜️ Rank Advancement:</strong> All 7 BSA Ranks progress and requirement sign-offs.</li>
                <li><strong>🏅 Merit Badges:</strong> All earned badges, requirement checkmarks & approvals.</li>
                <li><strong>🕌 Islamic Knowledge:</strong> All Usul/Furu test submissions and completed topics.</li>
                <li><strong>🎒 Homework & Tasks:</strong> All submitted homework, proofs, and leader grades.</li>
                <li><strong>⏱️ Service Logs:</strong> All recorded service hours and volunteering entries.</li>
                <li><strong>📋 Attendance Records:</strong> All attendance entries for this scout in historical sessions.</li>
                <li><strong>📝 Notes & Excuses:</strong> Private leader notes and filed absence notices.</li>
                <li><strong>🔄 Profile Status:</strong> Restored to fresh <strong>"Scout"</strong> rank with 0% progress.</li>
              </ul>
            </div>

            {isResetting ? (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-red-300 animate-pulse">{resetProgressStep}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Type <strong className="text-red-400 font-mono bg-red-950 px-1.5 py-0.5 rounded border border-red-800">RESET</strong> below to confirm:
                  </label>
                  <input
                    type="text"
                    placeholder='Type "RESET" here'
                    value={resetConfirmationInput}
                    onChange={(e) => setResetConfirmationInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500 placeholder-slate-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteResetProgress(resettingUser)}
                    disabled={resetConfirmationInput.trim() !== 'RESET' || isResetting}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
                  >
                    <RotateCcw size={15} />
                    <span>Confirm & Clear All Progress</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResettingUser(null);
                      setResetConfirmationInput('');
                    }}
                    disabled={isResetting}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

            {/* ── EDIT PATROL MODAL ── */}
      {editingPatrol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Edit3 size={18} className="text-emerald-400" />
                <span>Edit Patrol: {editingPatrol.name}</span>
              </h3>
              <button
                onClick={() => setEditingPatrol(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {editPatrolErr && <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-600">{editPatrolErr}</p>}
            {editPatrolMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{editPatrolMsg}</p>}

            <form onSubmit={handleSaveEditPatrol} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Name</label>
                <input
                  type="text"
                  required
                  value={editPatrolName}
                  onChange={(e) => setEditPatrolName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Motto / Call</label>
                <input
                  type="text"
                  value={editPatrolMotto}
                  onChange={(e) => setEditPatrolMotto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Assigned Patrol Leader</label>
                <select
                  value={editPatrolLeaderId}
                  onChange={(e) => setEditPatrolLeaderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">No Assigned Leader</option>
                  {leadersList.map(l => (
                    <option key={l.uid} value={l.uid}>
                      {l.fullName || l.username} ({l.leaderPosition || 'Leader'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Emblem Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patrol Emblem / Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {editPatrolPhotoURL ? (
                      <img src={editPatrolPhotoURL} alt="Emblem Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👥</span>
                    )}
                  </div>
                  <label className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold cursor-pointer text-center transition flex items-center justify-center gap-2">
                    <Camera size={14} className="text-emerald-400" />
                    <span>{editPatrolPhotoURL ? 'Change Emblem' : 'Upload Emblem'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await compressImage(file, 250, 250, 0.85);
                          setEditPatrolPhotoURL(base64);
                        }
                      }}
                    />
                  </label>
                  {editPatrolPhotoURL && (
                    <button
                      type="button"
                      onClick={() => setEditPatrolPhotoURL('')}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Assigned Scouts Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">Assigned Scouts ({editPatrolScoutIds.length})</label>
                  <span className="text-[10px] text-slate-400">Toggle checkboxes to assign scouts</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {scoutsList.map(s => {
                    const isAssigned = editPatrolScoutIds.includes(s.uid);
                    const currentGroup = groups.find(g => g.id === s.groupId);
                    return (
                      <label
                        key={s.uid}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                          isAssigned
                            ? 'bg-emerald-950/40 border-emerald-600 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditPatrolScoutIds(prev => [...prev, s.uid]);
                              } else {
                                setEditPatrolScoutIds(prev => prev.filter(id => id !== s.uid));
                              }
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span className="truncate">{s.fullName || s.username}</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-normal">({s.rank || 'Scout'})</span>
                        </div>
                        {currentGroup && currentGroup.id !== editingPatrol.id && (
                          <span className="text-[10px] text-slate-500 font-normal">currently: {currentGroup.name}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={patrolUpdating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={15} />
                  <span>{patrolUpdating ? 'Saving...' : 'Save Patrol Updates'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPatrol(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MANAGE PATROL SCOUTS ROSTER MODAL ── */}
      {managingPatrolScouts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Users size={18} className="text-emerald-400" />
                <span>Manage Roster: {managingPatrolScouts.name} Patrol</span>
              </h3>
              <button
                onClick={() => setManagingPatrolScouts(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select or deselect scouts to include in <strong>{managingPatrolScouts.name} Patrol</strong>.
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              {scoutsList.map(s => {
                const isAssigned = s.groupId === managingPatrolScouts.id || s.patrolId === managingPatrolScouts.id;
                const currentGroup = groups.find(g => g.id === s.groupId);
                return (
                  <div
                    key={s.uid}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                      isAssigned
                        ? 'bg-emerald-950/40 border-emerald-600 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <strong className="truncate">{s.fullName || s.username}</strong>
                      <span className="text-[10px] text-emerald-400 font-mono">({s.rank || 'Scout'})</span>
                    </div>

                    <button
                      onClick={() => handleQuickAssignScout(s.uid, isAssigned ? null : managingPatrolScouts.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isAssigned
                          ? 'bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      }`}
                    >
                      {isAssigned ? 'Remove' : 'Assign'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setManagingPatrolScouts(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── EDIT USER MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`bg-slate-900 border-2 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isOwner ? 'border-amber-500/60 shadow-amber-950/50' : 'border-emerald-500/50'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                {isOwner ? <Crown size={18} className="text-amber-400" /> : <Edit3 size={18} className="text-emerald-400" />}
                <span>Edit User: {editingUser.fullName || editingUser.username}</span>
                {isOwner && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-black">
                    👑 OWNER EDIT
                  </span>
                )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                {/* Username Field with Strict Owner-Only Permissions */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`block text-xs font-bold uppercase flex items-center gap-1 ${
                      isOwner ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {isOwner ? <Crown size={12} className="text-amber-400" /> : <Lock size={12} className="text-slate-500" />}
                      <span>Username</span>
                    </label>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                      isOwner 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {isOwner ? '👑 Editable' : '🔒 Locked'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    disabled={!isOwner}
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                    className={`w-full rounded-xl px-4 py-2 text-xs font-mono transition ${
                      isOwner 
                        ? 'bg-slate-950 border-2 border-amber-500/60 focus:border-amber-400 text-amber-200 focus:outline-none' 
                        : 'bg-slate-950/60 border border-slate-800 text-slate-500 cursor-not-allowed select-none'
                    }`}
                    placeholder="username"
                  />
                  <p className={`text-[10px] mt-1 flex items-center gap-1 ${
                    isOwner ? 'text-amber-400/90 font-medium' : 'text-slate-500 font-normal'
                  }`}>
                    {isOwner ? (
                      <span>👑 Owner Authority: You can modify this login username.</span>
                    ) : (
                      <span>🔒 Locked: Only Troop Owner can modify usernames.</span>
                    )}
                  </p>
                </div>
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

              {/* Danger Zone: Reset Profile Progress */}
              <div className="bg-red-950/30 border border-red-900/60 p-4 rounded-2xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-black text-red-400 flex items-center gap-1.5">
                      <RotateCcw size={13} /> Reset Profile Progress
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Wipe all ranks, merit badges, homework, service hours, and restore to initial Scout standing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResettingUser(editingUser);
                      setResetConfirmationInput('');
                      setResetErrMsg('');
                      setResetSuccessMsg('');
                    }}
                    className="bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-md flex items-center gap-1 self-start sm:self-center"
                  >
                    <RotateCcw size={12} />
                    <span>Clear All Progress</span>
                  </button>
                </div>
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
