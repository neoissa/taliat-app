import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  addDoc 
} from 'firebase/firestore';
import { dispatchParentNotification, dispatchPatrolStreamAlert } from '../utils/notificationPipeline';

/**
 * Formats a user-friendly notification title based on request type
 */
function getRequestTypeTitle(type, scoutName = 'Scout') {
  switch (type) {
    case 'absence_notice':
      return `Scout Absence Notice: ${scoutName}`;
    case 'signed_report':
      return `Signed Progress Report: ${scoutName}`;
    case 'meeting_request':
      return `Parent Conference Request for ${scoutName}`;
    case 'form_submission':
      return `Parent Form & Waiver Submitted for ${scoutName}`;
    default:
      return `Parent Request for ${scoutName}`;
  }
}

/**
 * Creates a unified parent request, stores in /parent_requests, 
 * and routes notifications to all responsible leaders assigned to that patrol and unit.
 */
export async function createParentRequest({
  requestType = 'absence_notice', // 'absence_notice' | 'signed_report' | 'meeting_request' | 'form_submission'
  parentUid,
  parentName,
  parentEmail = '',
  parentPhone = '',
  scoutId,
  scoutName,
  patrolId = '',
  patrolName = '',
  message,
  metadata = {}
}) {
  try {
    if (!parentUid && !parentName) {
      throw new Error('Parent details are required to file a request.');
    }

    const timestampStr = Date.now().toString();
    const randSuffix = Math.random().toString(36).substring(2, 7);
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const requestId = `req_${datePrefix}_${randSuffix}`;
    const createdAt = new Date().toISOString();

    const requestDoc = {
      requestId,
      requestType,
      parentUid: parentUid || null,
      parentName: parentName || 'Parent / Guardian',
      parentEmail: parentEmail || null,
      parentPhone: parentPhone || null,
      scoutId: scoutId || null,
      scoutName: scoutName || 'Scout Member',
      patrolId: patrolId || null,
      patrolName: patrolName || 'Unassigned Patrol',
      message: message || '',
      status: 'pending_review', // 'pending_review' | 'acknowledged' | 'approved' | 'resolved'
      metadata: metadata || {},
      createdAt,
      timestamp: serverTimestamp()
    };

    // 1. Write the primary record to /parent_requests/{requestId}
    await setDoc(doc(db, 'parent_requests', requestId), requestDoc);

    // 2. Fetch all leader accounts to route notifications
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

      const responsibleLeaders = allUsers.filter(u => {
        if (!u.role) return false;
        const role = u.role.toLowerCase();
        const pos = (u.leaderPosition || '').toLowerCase();
        const isExec = role === 'owner' || role === 'admin' || role === 'executive_leader' || u.isExecutive || pos.includes('scoutmaster') || u.email === 'neoissa@gmail.com';
        
        // Executive leaders receive all unit requests
        if (isExec) return true;

        // Patrol leaders receive requests for their assigned patrol
        if (role === 'leader') {
          const leaderGrp = u.groupId || u.patrolId || u.assignedPatrol;
          if (!leaderGrp) return true; // general unit leader
          if (patrolId && (leaderGrp === patrolId || u.patrolName === patrolName)) return true;
          if (patrolName && (leaderGrp === patrolName || u.assignedPatrol === patrolName)) return true;
        }

        return false;
      });

      const notifTitle = getRequestTypeTitle(requestType, scoutName);

      // 3. Dispatch to all responsible leaders
      for (const leader of responsibleLeaders) {
        const leaderNotifDoc = {
          recipientUid: leader.uid,
          leaderEmail: leader.email || null,
          requestId,
          requestType,
          title: notifTitle,
          message,
          parentName: requestDoc.parentName,
          scoutName: requestDoc.scoutName,
          patrolName: requestDoc.patrolName,
          actionUrl: '/#admin-requests',
          read: false,
          createdAt,
          timestamp: serverTimestamp()
        };

        // Write to leader_notifications
        await addDoc(collection(db, 'leader_notifications'), leaderNotifDoc);

        // Subcollection write for direct live listener
        try {
          await addDoc(collection(db, 'users', leader.uid, 'notifications'), leaderNotifDoc);
        } catch (subErr) {
          console.warn("Leader subcollection notification write fallback:", subErr);
        }

        // Email dispatch if leader email is available
        if (leader.email) {
          try {
            await addDoc(collection(db, 'mail'), {
              to: [leader.email],
              message: {
                subject: `[Dhulfiqār Leaders] ${notifTitle}`,
                text: `${message}\n\nSubmitted by: ${requestDoc.parentName}\nScout: ${requestDoc.scoutName} (${requestDoc.patrolName})\n\nOpen Leader Console to manage: https://taliat-app.web.app/#admin-requests`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #0f172a, #065f46); padding: 16px; border-radius: 8px; color: #ffffff; text-align: center;">
                      <h2 style="margin: 0; font-size: 20px;">Dhulfiqār Troop 313</h2>
                      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Parent Request & Routing Center</p>
                    </div>
                    <div style="padding: 20px 0;">
                      <span style="display: inline-block; padding: 4px 10px; background-color: #ecfdf5; color: #047857; font-weight: bold; font-size: 11px; border-radius: 6px; text-transform: uppercase;">
                        ${requestType.replace('_', ' ')}
                      </span>
                      <h3 style="color: #0f172a; margin-top: 10px;">${notifTitle}</h3>
                      <p style="color: #334155; font-size: 14px; line-height: 1.6; background-color: #f8fafc; padding: 12px; border-left: 4px solid #10b981; border-radius: 4px;">
                        "${message}"
                      </p>
                      <div style="font-size: 12px; color: #64748b; margin-top: 15px;">
                        <p style="margin: 4px 0;"><strong>Parent:</strong> ${requestDoc.parentName} ${requestDoc.parentPhone ? `(${requestDoc.parentPhone})` : ''}</p>
                        <p style="margin: 4px 0;"><strong>Scout:</strong> ${requestDoc.scoutName}</p>
                        <p style="margin: 4px 0;"><strong>Patrol:</strong> ${requestDoc.patrolName}</p>
                      </div>
                      <div style="margin: 25px 0; text-align: center;">
                        <a href="https://taliat-app.web.app/#admin-requests" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                          Acknowledge & Respond &rarr;
                        </a>
                      </div>
                    </div>
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
                      Automated Multi-Leader Routing Engine &bull; Dhulfiqār Scouts BSA
                    </div>
                  </div>
                `
              }
            });
          } catch (mailErr) {
            console.warn("Leader notification email queue error:", mailErr);
          }
        }
      }

      // 4. Send chat stream announcement to patrol room if patrol is known
      if (patrolId && patrolId !== 'all') {
        try {
          await dispatchPatrolStreamAlert(patrolId, `📢 Parent Update: ${requestDoc.parentName} filed ${requestType.replace('_', ' ')} for ${requestDoc.scoutName}.`);
        } catch (chatErr) {
          console.warn("Patrol chat stream notice error:", chatErr);
        }
      }

    } catch (routeErr) {
      console.warn("Leader routing fallback error:", routeErr);
    }

    return { success: true, requestId, requestDoc };
  } catch (err) {
    console.error("Error creating parent request:", err);
    throw err;
  }
}

/**
 * Leader acknowledges a parent request
 */
export async function acknowledgeParentRequest({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  acknowledgmentNote = ''
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const acknowledgedAt = new Date().toISOString();

    await updateDoc(reqRef, {
      status: 'acknowledged',
      acknowledgedBy: leaderName,
      acknowledgedByUid: leaderUid || null,
      acknowledgedAt,
      acknowledgmentNote: acknowledgmentNote || '',
      updatedAt: serverTimestamp()
    });

    return { success: true, acknowledgedAt };
  } catch (err) {
    console.error("Error acknowledging parent request:", err);
    throw err;
  }
}

/**
 * Leader resolves or approves a parent request
 */
export async function resolveParentRequest({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  resolutionStatus = 'resolved', // 'resolved' | 'approved'
  resolutionNote = '',
  parentUid = null,
  parentEmail = null,
  scoutName = 'your scout'
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const resolvedAt = new Date().toISOString();

    await updateDoc(reqRef, {
      status: resolutionStatus,
      resolvedBy: leaderName,
      resolvedByUid: leaderUid || null,
      resolvedAt,
      resolutionNote: resolutionNote || '',
      updatedAt: serverTimestamp()
    });

    // Notify parent back
    if (parentUid || parentEmail) {
      try {
        await dispatchParentNotification({
          recipientUid: parentUid,
          parentEmail: parentEmail,
          title: `Update on your Request for ${scoutName}`,
          message: `Unit Leader ${leaderName} has updated your request status to: ${resolutionStatus.toUpperCase()}.${resolutionNote ? ` Note: "${resolutionNote}"` : ''}`,
          type: 'general',
          priority: 'normal',
          actionUrl: '/#parent-tasks'
        });
      } catch (notifErr) {
        console.warn("Parent resolution alert fallback:", notifErr);
      }
    }

    return { success: true, resolvedAt };
  } catch (err) {
    console.error("Error resolving parent request:", err);
    throw err;
  }
}
