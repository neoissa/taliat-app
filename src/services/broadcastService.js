import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  dispatchParentNotification, 
  dispatchScoutNotification, 
  dispatchPatrolStreamAlert 
} from '../utils/notificationPipeline';

/**
 * Publishes a unified troop broadcast and simultaneously fans out to:
 * 1. Firestore /troop_broadcasts
 * 2. Parent notification feed (/parent_notifications & /mail)
 * 3. Scout notification feed (/scout_notifications & /users/{scoutUid}/notifications & /mail)
 * 4. Scoped Patrol Chat streams (/chats/{roomId}/messages)
 * 5. Executive Audit Trail (/audit_logs)
 */
export async function publishTroopBroadcast({
  title,
  category = 'General Announcement', // 'General Announcement' | 'Advancement Update' | 'Event / Outing Info' | 'Urgent Notice' | 'Waiver / Form Due' | 'Halqa & Spiritual Circle'
  priority = 'normal', // 'normal' | 'high' | 'urgent'
  targetScope = 'troop_wide', // 'troop_wide' | 'patrol_specific'
  targetGroupId = null,
  targetGroupName = 'All Patrols',
  targetAudience = 'all', // 'all' (Parents & Scouts) | 'parents_only' | 'scouts_only'
  message,
  attachmentUrl = '',
  attachmentLabel = '',
  authorId = '',
  authorName = 'Troop Leader',
  authorRole = 'Scoutmaster',
  authorEmail = ''
}) {
  try {
    if (!title || !title.trim()) {
      throw new Error('Broadcast title is required.');
    }
    if (!message || !message.trim()) {
      throw new Error('Broadcast message content is required.');
    }

    const cleanTitle = title.trim();
    const cleanMessage = message.trim();
    const cleanAttachmentUrl = (attachmentUrl || '').trim();
    const cleanAttachmentLabel = (attachmentLabel || '').trim();

    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.random().toString(36).substring(2, 7);
    const broadcastId = `broadcast_${datePrefix}_${randSuffix}`;
    const createdAt = new Date().toISOString();

    const broadcastDoc = {
      broadcastId,
      id: broadcastId,
      title: cleanTitle,
      category,
      priority,
      targetScope,
      targetGroupId: targetScope === 'patrol_specific' ? targetGroupId : null,
      targetGroupName: targetScope === 'patrol_specific' ? (targetGroupName || 'Assigned Patrol') : 'Entire Troop',
      targetAudience, // 'all' | 'parents_only' | 'scouts_only'
      message: cleanMessage,
      attachmentUrl: cleanAttachmentUrl || null,
      attachmentLabel: cleanAttachmentLabel || null,
      authorId: authorId || null,
      authorName: authorName || 'Leadership',
      authorRole: authorRole || 'Leader',
      authorEmail: authorEmail || null,
      createdAt,
      timestamp: serverTimestamp()
    };

    // 1. Write the primary broadcast record to /troop_broadcasts
    await setDoc(doc(db, 'troop_broadcasts', broadcastId), broadcastDoc);

    // 2. Fetch active users and groups to calculate fan-out targets
    let allUsers = [];
    let allGroups = [];
    try {
      const [usersSnap, groupsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'groups'))
      ]);
      allUsers = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
      allGroups = groupsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived);
    } catch (fetchErr) {
      console.warn("Failed to fetch users/groups for broadcast fan-out:", fetchErr);
    }

    let parentsDispatched = 0;
    let scoutsDispatched = 0;
    let streamsDispatched = 0;

    // ── 3. FAN-OUT: PARENT NOTIFICATIONS ──
    const shouldNotifyParents = targetAudience === 'all' || targetAudience === 'parents_only';
    if (shouldNotifyParents) {
      const parentUsers = allUsers.filter(u => {
        if (u.role !== 'parent') return false;
        if (targetScope === 'patrol_specific' && targetGroupId) {
          // Check if parent is linked to a scout in the targeted patrol
          const linkedIds = u.linkedScoutIds || [];
          const hasScoutInPatrol = allUsers.some(s => 
            s.role === 'scout' && 
            (linkedIds.includes(s.uid) || s.parentEmail === u.email || (Array.isArray(s.parentUids) && s.parentUids.includes(u.uid))) &&
            (s.groupId === targetGroupId || s.patrolId === targetGroupId)
          );
          if (!hasScoutInPatrol) return false;
        }
        return true;
      });

      for (const parent of parentUsers) {
        try {
          await dispatchParentNotification({
            recipientUid: parent.uid,
            parentEmail: parent.email || parent.parent1Email || parent.parent2Email,
            parentPhone: parent.phone || parent.parent1Phone || parent.parent2Phone,
            title: `📢 [${category}] ${cleanTitle}`,
            message: cleanMessage,
            type: 'broadcast',
            priority,
            actionUrl: cleanAttachmentUrl ? cleanAttachmentUrl : '/#feed',
            metadata: {
              broadcastId,
              category,
              priority,
              attachmentUrl: cleanAttachmentUrl || null,
              attachmentLabel: cleanAttachmentLabel || null,
              authorName,
              authorRole
            }
          });
          parentsDispatched++;
        } catch (pErr) {
          console.warn("Failed to dispatch to parent:", parent.uid, pErr);
        }
      }
    }

    // ── 4. FAN-OUT: SCOUT NOTIFICATIONS ──
    const shouldNotifyScouts = targetAudience === 'all' || targetAudience === 'scouts_only';
    if (shouldNotifyScouts) {
      const scoutUsers = allUsers.filter(u => {
        if (u.role !== 'scout') return false;
        if (targetScope === 'patrol_specific' && targetGroupId) {
          if (u.groupId !== targetGroupId && u.patrolId !== targetGroupId) return false;
        }
        return true;
      });

      for (const scout of scoutUsers) {
        try {
          await dispatchScoutNotification({
            recipientUid: scout.uid,
            scoutEmail: scout.email || scout.scoutEmail || scout.personalEmail,
            title: `📢 [${category}] ${cleanTitle}`,
            message: cleanMessage,
            type: 'broadcast',
            priority,
            actionUrl: cleanAttachmentUrl ? cleanAttachmentUrl : '/#feed',
            metadata: {
              broadcastId,
              category,
              priority,
              attachmentUrl: cleanAttachmentUrl || null,
              attachmentLabel: cleanAttachmentLabel || null,
              authorName,
              authorRole
            }
          });
          scoutsDispatched++;
        } catch (sErr) {
          console.warn("Failed to dispatch to scout:", scout.uid, sErr);
        }
      }
    }

    // ── 5. FAN-OUT: PATROL CHAT STREAMS ──
    const streamMessage = priority === 'urgent' 
      ? `🚨 [URGENT TROOP BROADCAST - ${category.toUpperCase()}]\n**${cleanTitle}**\n\n${cleanMessage}${cleanAttachmentUrl ? `\n🔗 Attachment: ${cleanAttachmentLabel || 'Link'} (${cleanAttachmentUrl})` : ''}\n\n— *${authorName} (${authorRole})*`
      : `📢 [TROOP UPDATE - ${category.toUpperCase()}]\n**${cleanTitle}**\n\n${cleanMessage}${cleanAttachmentUrl ? `\n🔗 ${cleanAttachmentLabel || 'Attachment'}: ${cleanAttachmentUrl}` : ''}\n\n— *${authorName} (${authorRole})*`;

    if (targetScope === 'troop_wide') {
      for (const grp of allGroups) {
        try {
          await dispatchPatrolStreamAlert(grp.id, streamMessage);
          streamsDispatched++;
        } catch (gErr) {
          console.warn("Failed to dispatch stream alert to group:", grp.id, gErr);
        }
      }
    } else if (targetScope === 'patrol_specific' && targetGroupId) {
      try {
        await dispatchPatrolStreamAlert(targetGroupId, streamMessage);
        streamsDispatched++;
      } catch (gErr) {
        console.warn("Failed to dispatch stream alert to group:", targetGroupId, gErr);
      }
    }

    // ── 6. EXECUTIVE AUDIT TRAIL ──
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_PUBLISHED_BROADCAST',
        action: 'PUBLISHED_BROADCAST',
        category: 'BROADCAST_CENTER',
        target: cleanTitle,
        broadcastId,
        performedBy: authorName,
        performedByUid: authorId || null,
        role: authorRole,
        details: `Published "${cleanTitle}" (${category}, ${priority.toUpperCase()}) to ${targetScope === 'troop_wide' ? 'Entire Troop' : targetGroupName} [Audience: ${targetAudience}]. Dispatched to ${parentsDispatched} parents, ${scoutsDispatched} scouts, and ${streamsDispatched} chat streams.`,
        scope: targetScope,
        targetGroupId,
        targetGroupName,
        targetAudience,
        parentsDispatched,
        scoutsDispatched,
        streamsDispatched,
        timestamp: serverTimestamp(),
        createdAt
      });
    } catch (auditErr) {
      console.warn("Audit log write fallback for broadcast:", auditErr);
    }

    return {
      success: true,
      broadcastId,
      broadcastDoc,
      reachStats: {
        parentsCount: parentsDispatched,
        scoutsCount: scoutsDispatched,
        streamsCount: streamsDispatched
      }
    };
  } catch (err) {
    console.error("Error publishing troop broadcast:", err);
    throw err;
  }
}

/**
 * Permanently deletes a broadcast from Firestore and logs to audit trail
 */
export async function deleteTroopBroadcast(broadcastId, currentUser = {}) {
  try {
    if (!broadcastId) throw new Error('Broadcast ID is required.');
    await deleteDoc(doc(db, 'troop_broadcasts', broadcastId));

    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_DELETED_BROADCAST',
        action: 'DELETED_BROADCAST',
        category: 'BROADCAST_CENTER',
        target: broadcastId,
        broadcastId,
        performedBy: currentUser?.fullName || currentUser?.username || 'Executive Leader',
        performedByUid: currentUser?.uid || null,
        role: currentUser?.role || 'Leader',
        details: `Deleted broadcast with ID: ${broadcastId}`,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
    } catch (e) {}

    return { success: true };
  } catch (err) {
    console.error("Error deleting troop broadcast:", err);
    throw err;
  }
}
