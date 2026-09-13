import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { dispatchParentNotification } from '../utils/notificationPipeline';

/**
 * Creates or initiates a new direct messaging thread between a parent and leader/leadership.
 */
export async function createDirectThread({
  parentUid,
  parentName,
  parentEmail = '',
  parentPhone = '',
  leaderUid = 'leadership',
  leaderName = 'Troop Leadership Team',
  leaderRole = 'Troop Leadership',
  scoutId = null,
  scoutName = null,
  patrolId = null,
  patrolName = null,
  category = 'inquiry', // 'inquiry' | 'request' | 'suggestion' | 'general'
  subject = '',
  initialMessage = '',
  currentUser
}) {
  if (!parentUid && !currentUser?.uid) {
    throw new Error('Parent UID is required to create a direct thread.');
  }

  const pUid = parentUid || currentUser.uid;
  const pName = parentName || currentUser?.fullName || currentUser?.username || 'Parent / Guardian';
  const pEmail = parentEmail || currentUser?.email || '';
  const pPhone = parentPhone || currentUser?.phone || currentUser?.parentPhone || '';

  const randSuffix = Math.random().toString(36).substring(2, 7);
  const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const threadId = `dm_${datePrefix}_${pUid.substring(0, 5)}_${randSuffix}`;
  const nowIso = new Date().toISOString();

  const formattedSubject = subject.trim() || (
    category === 'inquiry' ? 'Private Inquiry' :
    category === 'suggestion' ? 'Troop Suggestion' :
    category === 'request' ? 'Official Request' : 'Direct Conversation'
  );

  const threadDoc = {
    threadId,
    parentUid: pUid,
    parentName: pName,
    parentEmail: pEmail,
    parentPhone: pPhone,
    leaderUid: leaderUid || 'leadership',
    leaderName: leaderName || 'Troop Leadership Team',
    leaderRole: leaderRole || 'Troop Leadership',
    scoutId: scoutId || null,
    scoutName: scoutName || null,
    patrolId: patrolId || null,
    patrolName: patrolName || null,
    category,
    subject: formattedSubject,
    lastMessage: initialMessage.trim() || 'Conversation opened',
    lastSenderUid: currentUser?.uid || pUid,
    lastSenderName: currentUser?.fullName || currentUser?.username || pName,
    lastSenderRole: currentUser?.role || 'parent',
    lastUpdated: nowIso,
    unreadByParent: currentUser?.role !== 'parent',
    unreadByLeader: currentUser?.role === 'parent',
    unreadCountParent: currentUser?.role !== 'parent' ? 1 : 0,
    unreadCountLeader: currentUser?.role === 'parent' ? 1 : 0,
    status: 'active', // 'active' | 'resolved' | 'archived'
    createdAt: nowIso,
    timestamp: serverTimestamp()
  };

  // 1. Create main thread document
  await setDoc(doc(db, 'direct_messages', threadId), threadDoc);

  // 2. If an initial message is provided, store in subcollection
  if (initialMessage.trim()) {
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, 'direct_messages', threadId, 'messages', msgId), {
      id: msgId,
      threadId,
      senderUid: currentUser?.uid || pUid,
      senderName: currentUser?.fullName || currentUser?.username || pName,
      senderRole: currentUser?.role || 'parent',
      text: initialMessage.trim(),
      category,
      read: false,
      createdAt: nowIso,
      timestamp: serverTimestamp()
    });
  }

  return threadId;
}

/**
 * Appends a message to a direct message thread and updates thread aggregate metadata.
 */
export async function sendDirectMessage({
  threadId,
  senderUid,
  senderName,
  senderRole = 'parent',
  text,
  category = null,
  attachments = []
}) {
  if (!threadId || !text?.trim()) {
    throw new Error('Thread ID and message text are required.');
  }

  const nowIso = new Date().toISOString();
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cleanText = text.trim();

  // 1. Create message document in subcollection
  const messageDoc = {
    id: msgId,
    threadId,
    senderUid,
    senderName: senderName || 'User',
    senderRole: senderRole || 'parent',
    text: cleanText,
    category: category || null,
    attachments: attachments || [],
    read: false,
    createdAt: nowIso,
    timestamp: serverTimestamp()
  };

  await setDoc(doc(db, 'direct_messages', threadId, 'messages', msgId), messageDoc);

  // 2. Update thread header with unread flags and counters
  const isParentSender = senderRole === 'parent';
  const threadUpdate = {
    lastMessage: cleanText,
    lastSenderUid: senderUid,
    lastSenderName: senderName || 'User',
    lastSenderRole: senderRole,
    lastUpdated: nowIso,
    timestamp: serverTimestamp(),
    status: 'active', // Automatically reopen active if new message sent
    unreadByParent: !isParentSender,
    unreadByLeader: isParentSender,
    unreadCountParent: !isParentSender ? increment(1) : 0,
    unreadCountLeader: isParentSender ? increment(1) : 0
  };

  await updateDoc(doc(db, 'direct_messages', threadId), threadUpdate);

  return msgId;
}

/**
 * Marks a direct messaging thread as read for a given role (parent vs leader).
 */
export async function markDirectThreadAsRead(threadId, role = 'parent') {
  if (!threadId) return;

  try {
    const isParent = role === 'parent';
    const updatePayload = isParent
      ? { unreadByParent: false, unreadCountParent: 0 }
      : { unreadByLeader: false, unreadCountLeader: 0 };

    await updateDoc(doc(db, 'direct_messages', threadId), updatePayload);
  } catch (err) {
    console.warn('Failed to mark thread as read:', err);
  }
}

/**
 * Updates thread status (e.g., 'active' | 'resolved' | 'archived') with audit metadata.
 */
export async function updateThreadStatus(threadId, status = 'resolved', user = {}) {
  if (!threadId) return;

  const nowIso = new Date().toISOString();
  await updateDoc(doc(db, 'direct_messages', threadId), {
    status,
    statusUpdatedAt: nowIso,
    statusUpdatedByUid: user?.uid || null,
    statusUpdatedByName: user?.fullName || user?.username || 'Leadership',
    lastUpdated: nowIso,
    timestamp: serverTimestamp()
  });
}

/**
 * Subscribes in real-time to direct threads belonging to a parent account.
 */
export function subscribeToParentThreads(parentUid, onData, onError) {
  if (!parentUid) return () => {};

  const q = query(
    collection(db, 'direct_messages'),
    where('parentUid', '==', parentUid)
  );

  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''));
    onData(list);
  }, (err) => {
    console.warn('subscribeToParentThreads error:', err);
    if (onError) onError(err);
  });
}

/**
 * Subscribes in real-time to direct threads visible to a leader based on role and patrol permissions.
 */
export function subscribeToLeaderThreads(currentUser, accessiblePatrols = [], isTroopWide = false, onData, onError) {
  if (!currentUser?.uid) return () => {};

  return onSnapshot(collection(db, 'direct_messages'), (snap) => {
    let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!isTroopWide) {
      const myUid = currentUser.uid;
      const accessibleGroupIds = (accessiblePatrols || []).map(g => g.id || g.groupId);
      const accessibleNames = (accessiblePatrols || []).map(g => (g.name || '').toLowerCase());

      list = list.filter(thread => {
        // Direct messages explicitly addressed to this leader
        if (thread.leaderUid === myUid) return true;
        
        // General leadership messages for assigned patrol
        if (thread.patrolId && accessibleGroupIds.includes(thread.patrolId)) return true;
        if (thread.patrolName && accessibleNames.some(n => thread.patrolName.toLowerCase().includes(n))) return true;

        // If sent to general 'leadership' and leader has assigned patrols
        if (thread.leaderUid === 'leadership' && accessibleGroupIds.length > 0) return true;

        return false;
      });
    }

    list.sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''));
    onData(list);
  }, (err) => {
    console.warn('subscribeToLeaderThreads error:', err);
    if (onError) onError(err);
  });
}

/**
 * Subscribes in real-time to ordered chat messages within a specific direct thread.
 */
export function subscribeToThreadMessages(threadId, onData, onError) {
  if (!threadId) return () => {};

  const q = query(
    collection(db, 'direct_messages', threadId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    onData(list);
  }, (err) => {
    console.warn('subscribeToThreadMessages error:', err);
    if (onError) onError(err);
  });
}

/**
 * Formats user-friendly relative timestamp for thread previews.
 */
export function formatThreadTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}
