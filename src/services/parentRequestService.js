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
import { dispatchParentNotification } from '../utils/notificationPipeline';

/**
 * Formats a user-friendly notification title based on request type
 */
function getRequestTypeTitle(type, scoutName = 'Scout', targetLeaderName = null) {
  switch (type) {
    case 'absence_notice':
      return `Scout Absence Notice: ${scoutName}`;
    case 'signed_report':
      return `Signed Progress Report: ${scoutName}`;
    case 'meeting_request':
      return targetLeaderName 
        ? `Conference Request for ${scoutName} with ${targetLeaderName}`
        : `Parent Conference Request for ${scoutName}`;
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
  targetLeaderUid = null,
  targetLeaderName = null,
  targetLeaderRole = null,
  proposedDate = null,
  proposedTime = null,
  meetingTopic = null,
  message,
  metadata = {}
}) {
  try {
    if (!parentUid && !parentName) {
      throw new Error('Parent details are required to file a request.');
    }

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
      targetLeaderUid: targetLeaderUid || null,
      targetLeaderName: targetLeaderName || null,
      targetLeaderRole: targetLeaderRole || null,
      proposedDate: proposedDate || metadata.meetingProposedDate || metadata.absenceDate || null,
      proposedTime: proposedTime || metadata.meetingProposedTime || null,
      meetingTopic: meetingTopic || metadata.meetingTopic || null,
      message: message || '',
      status: 'pending_review', // 'pending_review' | 'acknowledged' | 'confirmed' | 'approved' | 'resolved'
      metadata: {
        ...metadata,
        targetLeaderUid: targetLeaderUid || null,
        targetLeaderName: targetLeaderName || null,
        targetLeaderRole: targetLeaderRole || null,
        proposedDate: proposedDate || metadata.meetingProposedDate || null,
        proposedTime: proposedTime || metadata.meetingProposedTime || null,
        meetingTopic: meetingTopic || metadata.meetingTopic || null
      },
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
        
        // Specifically requested leader always receives
        if (targetLeaderUid && u.uid === targetLeaderUid) return true;

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

      const notifTitle = getRequestTypeTitle(requestType, scoutName, targetLeaderName);

      // 3. Dispatch to all responsible leaders
      for (const leader of responsibleLeaders) {
        const isDirectTarget = targetLeaderUid && leader.uid === targetLeaderUid;
        const leaderNotifDoc = {
          recipientUid: leader.uid,
          leaderEmail: leader.email || null,
          requestId,
          requestType,
          title: isDirectTarget ? `⭐ Direct Request for You: ${notifTitle}` : notifTitle,
          message,
          parentName: requestDoc.parentName,
          scoutName: requestDoc.scoutName,
          patrolName: requestDoc.patrolName,
          targetLeaderName: requestDoc.targetLeaderName,
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
                subject: `[Dhulfiqār Leaders] ${isDirectTarget ? `⭐ Direct Request: ` : ''}${notifTitle}`,
                text: `${message}\n\nSubmitted by: ${requestDoc.parentName} (${requestDoc.parentPhone || 'No phone'})\nScout: ${requestDoc.scoutName} (${requestDoc.patrolName})\n${targetLeaderName ? `Requested Leader: ${targetLeaderName}\n` : ''}${proposedDate ? `Proposed Date: ${proposedDate}\n` : ''}\nOpen Leader Console to confirm: https://taliat-app.web.app/#admin-requests`,
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
                        ${targetLeaderName ? `<p style="margin: 4px 0;"><strong>Requested Leader:</strong> ${targetLeaderName}</p>` : ''}
                        ${proposedDate ? `<p style="margin: 4px 0;"><strong>Preferred Date:</strong> ${proposedDate}</p>` : ''}
                      </div>
                      <div style="margin: 25px 0; text-align: center;">
                        <a href="https://taliat-app.web.app/#admin-requests" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                          Review & Confirm &rarr;
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
 * Leader confirms & schedules a parent meeting request
 */
export async function confirmMeetingRequest({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  leaderRole = 'Scoutmaster',
  confirmedDate,
  confirmedTime = '6:30 PM',
  meetingLocation = 'Troop Headquarters (Highview Elementary School)',
  confirmationNote = '',
  parentUid = null,
  parentEmail = null,
  parentPhone = null,
  scoutName = 'your scout',
  meetingTopic = 'Scout Advancement & Conference'
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    if (!confirmedDate) throw new Error('Confirmed date is required.');

    const reqRef = doc(db, 'parent_requests', requestId);
    const confirmedAt = new Date().toISOString();

    const updateData = {
      status: 'confirmed',
      confirmedDate,
      confirmedTime: confirmedTime || '6:30 PM',
      meetingLocation: meetingLocation || 'Troop Headquarters',
      confirmationNote: confirmationNote || '',
      confirmedBy: leaderName,
      confirmedByUid: leaderUid || null,
      confirmedByRole: leaderRole || 'Leader',
      confirmedAt,
      resolvedAt: confirmedAt,
      updatedAt: serverTimestamp()
    };

    await updateDoc(reqRef, updateData);

    // 1. Send High-Priority In-App Parent Notification
    if (parentUid || parentEmail) {
      try {
        await dispatchParentNotification({
          recipientUid: parentUid,
          parentEmail: parentEmail,
          title: `✓ Meeting Confirmed: ${confirmedDate} with ${leaderName}`,
          message: `Leader ${leaderName} (${leaderRole}) has confirmed your conference for ${scoutName}.\n📅 Date: ${confirmedDate} at ${confirmedTime}\n📍 Location: ${meetingLocation}\n${confirmationNote ? `📝 Note: "${confirmationNote}"` : ''}`,
          type: 'event',
          priority: 'urgent',
          actionUrl: '/#parent-requests',
          metadata: {
            requestId,
            confirmedDate,
            confirmedTime,
            meetingLocation,
            leaderName,
            leaderRole,
            confirmationNote,
            status: 'confirmed'
          }
        });
      } catch (notifErr) {
        console.warn("Parent confirmation notification error:", notifErr);
      }
    }

    // 2. Queue Email to Parent via /mail
    if (parentEmail) {
      try {
        await addDoc(collection(db, 'mail'), {
          to: [parentEmail],
          message: {
            subject: `[Dhulfiqār Scouts] ✓ Meeting Confirmed for ${scoutName} with Leader ${leaderName}`,
            text: `Assalāmu ʿAlaykum,\n\nYour leader conference request for ${scoutName} has been confirmed by Leader ${leaderName}.\n\n📅 Confirmed Date: ${confirmedDate}\n⏰ Time: ${confirmedTime}\n📍 Location: ${meetingLocation}\n${confirmationNote ? `\nLeader Note: "${confirmationNote}"\n` : ''}\nAccess your Parent Portal: https://taliat-app.web.app`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #065f46, #0d9488); padding: 16px; border-radius: 8px; color: #ffffff; text-align: center;">
                  <h2 style="margin: 0; font-size: 20px;">Dhulfiqār Troop 313</h2>
                  <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Leader Conference Confirmation</p>
                </div>
                <div style="padding: 20px 0;">
                  <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong style="color: #065f46; font-size: 15px; display: block;">✓ Meeting Confirmed & Scheduled</strong>
                    <span style="color: #047857; font-size: 13px;">Leader ${leaderName} (${leaderRole}) looks forward to meeting with you.</span>
                  </div>
                  <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.8;">
                    <p style="margin: 4px 0;"><strong>Scout:</strong> ${scoutName}</p>
                    <p style="margin: 4px 0;"><strong>Confirmed Leader:</strong> ${leaderName} (${leaderRole})</p>
                    <p style="margin: 4px 0;"><strong>📅 Confirmed Date:</strong> <span style="color: #059669; font-weight: bold;">${confirmedDate}</span></p>
                    <p style="margin: 4px 0;"><strong>⏰ Time:</strong> <span style="color: #059669; font-weight: bold;">${confirmedTime}</span></p>
                    <p style="margin: 4px 0;"><strong>📍 Location / Venue:</strong> ${meetingLocation}</p>
                    ${confirmationNote ? `<p style="margin: 8px 0 4px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;"><strong>Leader Note:</strong> <em>"${confirmationNote}"</em></p>` : ''}
                  </div>
                  <div style="margin: 25px 0; text-align: center;">
                    <a href="https://taliat-app.web.app" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                      Open Parent Portal &rarr;
                    </a>
                  </div>
                </div>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
                  Dhulfiqār Scouts BSA &bull; Troop 313 Leader Conference Registry
                </div>
              </div>
            `
          }
        });
      } catch (mailErr) {
        console.warn("Mail queue error for meeting confirmation:", mailErr);
      }
    }

    return { success: true, confirmedAt };
  } catch (err) {
    console.error("Error confirming meeting request:", err);
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
