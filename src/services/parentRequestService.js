import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  getDoc,
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

    // 3. Auto-Add Conference Details and Notes to /scout_notes/{scoutId}
    try {
      const reqSnap = await getDoc(reqRef);
      const reqData = reqSnap.exists() ? reqSnap.data() : {};
      const targetScoutId = reqData.scoutId;
      if (targetScoutId) {
        const scoutNotesRef = doc(db, 'scout_notes', targetScoutId);
        const scoutNotesSnap = await getDoc(scoutNotesRef);
        const existingNotes = scoutNotesSnap.exists() && Array.isArray(scoutNotesSnap.data().notes)
          ? scoutNotesSnap.data().notes
          : [];

        const meetingLogNote = {
          id: `conf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          text: `🤝 Confirmed Parent Conference with ${reqData.parentName || 'Parent / Guardian'}\nTopic: ${meetingTopic || reqData.meetingTopic || 'Scout Advancement & Review'}\n📅 Scheduled Date: ${confirmedDate} at ${confirmedTime || '6:30 PM'}\n📍 Venue: ${meetingLocation || 'Troop Headquarters'}${confirmationNote ? `\n📝 Leader Notes: "${confirmationNote}"` : ''}`,
          date: confirmedDate || new Date().toISOString().split('T')[0],
          authorId: leaderUid || null,
          authorName: leaderName,
          authorPosition: leaderRole || 'Leader',
          type: 'parent_conference',
          createdAt: confirmedAt
        };

        await setDoc(scoutNotesRef, {
          notes: [...existingNotes, meetingLogNote],
          updatedAt: serverTimestamp(),
          updatedBy: leaderUid || 'leader'
        }, { merge: true });
      }
    } catch (noteErr) {
      console.warn("Auto-append to scout notes warning:", noteErr);
    }

    // 4. Record Executive Audit Trail in /audit_logs
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_CONFIRMED_MEETING',
        action: 'CONFIRMED_MEETING',
        category: 'LEADER_PORTAL',
        target: `Parent Conference: ${scoutName}`,
        requestId,
        performedBy: leaderName,
        performedByUid: leaderUid || null,
        role: leaderRole || 'Leader',
        details: `Conference confirmed for ${confirmedDate} at ${confirmedTime} at ${meetingLocation}.${confirmationNote ? ` Note: "${confirmationNote}"` : ''}`,
        scoutName,
        confirmedDate,
        confirmedTime,
        meetingLocation,
        timestamp: serverTimestamp(),
        createdAt: confirmedAt
      });
    } catch (auditErr) {
      console.warn("Audit log write fallback:", auditErr);
    }

    return { success: true, confirmedAt };
  } catch (err) {
    console.error("Error confirming meeting request:", err);
    throw err;
  }
}

/**
 * Parent cancels a requested or confirmed meeting
 */
export async function cancelMeetingRequestByParent({
  requestId,
  parentUid,
  parentName = 'Parent / Guardian',
  cancelReason = '',
  targetLeaderUid = null,
  targetLeaderName = null,
  scoutName = 'Scout',
  patrolName = 'Patrol',
  confirmedDate = null,
  confirmedTime = null
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const cancelledAt = new Date().toISOString();

    const updateData = {
      status: 'cancelled_by_parent',
      cancelledBy: parentName,
      cancelledByUid: parentUid || null,
      cancelledAt,
      cancelReason: cancelReason || 'Meeting cancelled by parent.',
      updatedAt: serverTimestamp()
    };

    await updateDoc(reqRef, updateData);

    // 1. Record Executive Audit Trail in /audit_logs
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'PARENT_CANCELLED_MEETING',
        action: 'CANCELLED_MEETING',
        category: 'PARENT_PORTAL',
        target: `Parent Conference: ${scoutName}`,
        requestId,
        performedBy: parentName,
        performedByUid: parentUid || null,
        role: 'parent',
        details: `Meeting cancelled by ${parentName}.${cancelReason ? ` Reason: "${cancelReason}"` : ''}${confirmedDate ? ` (Originally scheduled: ${confirmedDate} ${confirmedTime || ''})` : ''}`,
        scoutName,
        cancelReason: cancelReason || '',
        timestamp: serverTimestamp(),
        createdAt: cancelledAt
      });
    } catch (auditErr) {
      console.warn("Audit log write fallback for parent cancellation:", auditErr);
    }

    // 2. Dispatch notification to responsible leaders
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

      const targetLeaders = allUsers.filter(u => {
        if (!u.role) return false;
        const role = u.role.toLowerCase();
        const isExec = role === 'owner' || role === 'admin' || role === 'executive_leader' || u.isExecutive || u.email === 'neoissa@gmail.com';
        if (targetLeaderUid && u.uid === targetLeaderUid) return true;
        if (isExec) return true;
        return false;
      });

      const notifMsg = `Parent ${parentName} has cancelled the conference for ${scoutName}.${cancelReason ? ` Reason: "${cancelReason}"` : ''}${confirmedDate ? ` (Scheduled: ${confirmedDate} ${confirmedTime || ''})` : ''}`;

      for (const ldr of targetLeaders) {
        const notifDoc = {
          recipientUid: ldr.uid,
          leaderEmail: ldr.email || null,
          requestId,
          requestType: 'meeting_request',
          title: `⚠️ Conference Cancelled by Parent: ${scoutName}`,
          message: notifMsg,
          parentName,
          scoutName,
          patrolName,
          status: 'cancelled_by_parent',
          actionUrl: '/#admin-requests',
          read: false,
          createdAt: cancelledAt,
          timestamp: serverTimestamp()
        };

        await addDoc(collection(db, 'leader_notifications'), notifDoc);

        try {
          await addDoc(collection(db, 'users', ldr.uid, 'notifications'), notifDoc);
        } catch (e) {}

        if (ldr.email) {
          try {
            await addDoc(collection(db, 'mail'), {
              to: [ldr.email],
              message: {
                subject: `[Dhulfiqār Leaders] ⚠️ Conference Cancelled: ${scoutName}`,
                text: `${notifMsg}\n\nView details: https://taliat-app.web.app/#admin-requests`
              }
            });
          } catch (mErr) {}
        }
      }
    } catch (notifErr) {
      console.warn("Leader cancellation notification error:", notifErr);
    }

    return { success: true, cancelledAt };
  } catch (err) {
    console.error("Error cancelling meeting request by parent:", err);
    throw err;
  }
}

/**
 * Leader declines a parent meeting request
 */
export async function declineMeetingRequestByLeader({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  leaderRole = 'Scoutmaster',
  declineReason = '',
  parentUid = null,
  parentEmail = null,
  scoutName = 'your scout',
  meetingTopic = 'Scout Conference'
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const declinedAt = new Date().toISOString();

    const updateData = {
      status: 'declined_by_leader',
      declinedBy: leaderName,
      declinedByUid: leaderUid || null,
      declinedByRole: leaderRole || 'Leader',
      declinedAt,
      declineReason: declineReason || 'Leader is unavailable for this time. Please request an alternative.',
      updatedAt: serverTimestamp()
    };

    await updateDoc(reqRef, updateData);

    // 1. Record Executive Audit Trail in /audit_logs
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_DECLINED_MEETING',
        action: 'DECLINED_MEETING',
        category: 'LEADER_PORTAL',
        target: `Parent Conference: ${scoutName}`,
        requestId,
        performedBy: leaderName,
        performedByUid: leaderUid || null,
        role: leaderRole || 'Leader',
        details: `Conference request declined by ${leaderName} (${leaderRole}).${declineReason ? ` Note: "${declineReason}"` : ''}`,
        scoutName,
        declineReason: declineReason || '',
        timestamp: serverTimestamp(),
        createdAt: declinedAt
      });
    } catch (auditErr) {
      console.warn("Audit log write fallback for leader decline:", auditErr);
    }

    // 2. Send Parent In-App Notification
    if (parentUid || parentEmail) {
      try {
        await dispatchParentNotification({
          recipientUid: parentUid,
          parentEmail: parentEmail,
          title: `Leader Conference Update for ${scoutName}`,
          message: `Leader ${leaderName} (${leaderRole}) was unable to confirm your conference request regarding "${meetingTopic}".\n📝 Leader Note: "${declineReason || 'Please feel free to propose an alternative date or speak with us at the next troop meeting.'}"`,
          type: 'general',
          priority: 'urgent',
          actionUrl: '/#parent-requests',
          metadata: {
            requestId,
            leaderName,
            leaderRole,
            declineReason,
            status: 'declined_by_leader'
          }
        });
      } catch (notifErr) {
        console.warn("Parent decline notification error:", notifErr);
      }
    }

    // 3. Queue Email to Parent via /mail
    if (parentEmail) {
      try {
        await addDoc(collection(db, 'mail'), {
          to: [parentEmail],
          message: {
            subject: `[Dhulfiqār Scouts] Leader Conference Update for ${scoutName}`,
            text: `Assalāmu ʿAlaykum,\n\nLeader ${leaderName} (${leaderRole}) reviewed your conference request regarding "${meetingTopic}" for ${scoutName}.\n\nLeader Note / Explanation: "${declineReason || 'Please propose an alternative date or meet at our regular troop gathering.'}"\n\nYou may submit a new request via the Parent Portal: https://taliat-app.web.app`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #0f172a, #334155); padding: 16px; border-radius: 8px; color: #ffffff; text-align: center;">
                  <h2 style="margin: 0; font-size: 20px;">Dhulfiqār Troop 313</h2>
                  <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Conference Request Status</p>
                </div>
                <div style="padding: 20px 0;">
                  <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong style="color: #991b1b; font-size: 15px; display: block;">Conference Request Update</strong>
                    <span style="color: #b91c1c; font-size: 13px;">Leader ${leaderName} (${leaderRole}) is unavailable for the requested slot.</span>
                  </div>
                  <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.8;">
                    <p style="margin: 4px 0;"><strong>Scout:</strong> ${scoutName}</p>
                    <p style="margin: 4px 0;"><strong>Topic:</strong> ${meetingTopic}</p>
                    <p style="margin: 4px 0;"><strong>Leader:</strong> ${leaderName} (${leaderRole})</p>
                    ${declineReason ? `<p style="margin: 8px 0 4px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;"><strong>Leader Note:</strong> <em>"${declineReason}"</em></p>` : ''}
                  </div>
                  <div style="margin: 25px 0; text-align: center;">
                    <a href="https://taliat-app.web.app" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
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
        console.warn("Mail queue error for meeting decline:", mailErr);
      }
    }

    return { success: true, declinedAt };
  } catch (err) {
    console.error("Error declining meeting request:", err);
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

/**
 * Leader directly initiates and schedules a meeting with a single parent or all parents of a patrol/unit.
 */
export async function createLeaderInitiatedMeeting({
  leaderUid,
  leaderName = 'Troop Leader',
  leaderRole = 'Scoutmaster',
  targetType = 'single_parent', // 'single_parent' | 'patrol_parents' | 'all_unit'
  scoutId = null,
  scoutName = null,
  parentUid = null,
  parentName = null,
  parentEmail = null,
  parentPhone = null,
  patrolId = null,
  patrolName = null,
  meetingDate,
  meetingTime = '6:30 PM',
  meetingDuration = '30 mins',
  meetingLocation = 'Troop Headquarters (Highview Elementary School)',
  meetingTopic = 'Scoutmaster Conference & Progress Review',
  meetingAgenda = '',
  leaderNotes = '',
  rsvpRequired = true,
  targetedParents = [] // Array of { parentUid, parentName, parentEmail, parentPhone, scoutId, scoutName, patrolId, patrolName }
}) {
  try {
    if (!meetingDate) throw new Error('Meeting date is required.');
    if (!meetingTopic) throw new Error('Meeting topic is required.');

    const createdIds = [];
    const createdAt = new Date().toISOString();

    // Helper to send individual invite and notification
    const dispatchSingleInvite = async (target) => {
      const randSuffix = Math.random().toString(36).substring(2, 7);
      const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const reqId = `meet_${datePrefix}_${randSuffix}`;

      const meetingDoc = {
        requestId: reqId,
        requestType: 'meeting_request',
        initiatedBy: 'leader',
        targetType,
        status: 'confirmed', // Scheduled and confirmed by leader
        rsvpStatus: 'pending', // 'pending' | 'attending' | 'declined' | 'reschedule_requested'
        parentUid: target.parentUid || null,
        parentName: target.parentName || 'Parent / Guardian',
        parentEmail: target.parentEmail || null,
        parentPhone: target.parentPhone || null,
        scoutId: target.scoutId || null,
        scoutName: target.scoutName || 'Scout Member',
        patrolId: target.patrolId || patrolId || null,
        patrolName: target.patrolName || patrolName || 'Troop 1318',
        targetLeaderUid: leaderUid || null,
        targetLeaderName: leaderName,
        targetLeaderRole: leaderRole,
        leaderUid: leaderUid || null,
        leaderName,
        leaderRole,
        confirmedBy: leaderName,
        confirmedByUid: leaderUid || null,
        confirmedByRole: leaderRole,
        confirmedDate: meetingDate,
        confirmedTime: meetingTime,
        meetingDuration: meetingDuration || '30 mins',
        meetingLocation: meetingLocation || 'Troop Headquarters',
        meetingTopic,
        meetingAgenda: meetingAgenda || '',
        message: meetingAgenda || `Meeting invitation from Leader ${leaderName} regarding ${meetingTopic}`,
        confirmationNote: leaderNotes || '',
        rsvpRequired: Boolean(rsvpRequired),
        createdAt,
        confirmedAt: createdAt,
        timestamp: serverTimestamp()
      };

      await setDoc(doc(db, 'parent_requests', reqId), meetingDoc);
      createdIds.push(reqId);

      // In-app Notification to Parent
      if (target.parentUid || target.parentEmail) {
        try {
          await dispatchParentNotification({
            recipientUid: target.parentUid,
            parentEmail: target.parentEmail,
            title: `📅 New Conference Invitation: ${meetingTopic}`,
            message: `Leader ${leaderName} (${leaderRole}) has scheduled a meeting with you regarding ${target.scoutName || 'Scout'}.\n📅 Date: ${meetingDate} @ ${meetingTime}\n📍 Venue: ${meetingLocation}\n\nPlease review and confirm your attendance in the Parent Portal.`,
            type: 'event',
            priority: 'urgent',
            actionUrl: '/#parent-requests',
            metadata: {
              requestId: reqId,
              meetingDate,
              meetingTime,
              meetingLocation,
              meetingTopic,
              leaderName,
              leaderRole
            }
          });
        } catch (notifErr) {
          console.warn("Parent meeting invite notification warning:", notifErr);
        }
      }

      // Email Dispatch to Parent via /mail
      if (target.parentEmail) {
        try {
          await addDoc(collection(db, 'mail'), {
            to: [target.parentEmail],
            message: {
              subject: `[Dhulfiqār Scouts] 📅 Meeting Invitation: ${meetingTopic} with Leader ${leaderName}`,
              text: `Assalāmu ʿAlaykum ${target.parentName || 'Parent'},\n\nLeader ${leaderName} (${leaderRole}) has scheduled a conference with you regarding ${target.scoutName || 'your scout'}.\n\n📅 Date: ${meetingDate}\n⏰ Time: ${meetingTime} (${meetingDuration || '30 mins'})\n📍 Location: ${meetingLocation}\n📌 Topic: ${meetingTopic}\n${meetingAgenda ? `📝 Agenda / Notes: ${meetingAgenda}\n` : ''}\nPlease open your Parent Portal to confirm attendance: https://taliat-app.web.app`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                  <div style="background: linear-gradient(135deg, #065f46, #0284c7); padding: 16px; border-radius: 8px; color: #ffffff; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px;">Dhulfiqār Troop & Pack 1318</h2>
                    <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Leader Conference Invitation</p>
                  </div>
                  <div style="padding: 20px 0;">
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                      <strong style="color: #166534; font-size: 15px; display: block;">📅 Meeting Scheduled by Leadership</strong>
                      <span style="color: #15803d; font-size: 13px;">Leader ${leaderName} (${leaderRole}) invites you to a conference.</span>
                    </div>
                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.8;">
                      <p style="margin: 4px 0;"><strong>Scout:</strong> ${target.scoutName || 'All Patrol Youth'}</p>
                      <p style="margin: 4px 0;"><strong>Patrol:</strong> ${target.patrolName || patrolName || 'Troop 1318'}</p>
                      <p style="margin: 4px 0;"><strong>Topic:</strong> <span style="color: #0284c7; font-weight: bold;">${meetingTopic}</span></p>
                      <p style="margin: 4px 0;"><strong>📅 Date:</strong> <span style="color: #059669; font-weight: bold;">${meetingDate}</span></p>
                      <p style="margin: 4px 0;"><strong>⏰ Time:</strong> <span style="color: #059669; font-weight: bold;">${meetingTime} (${meetingDuration || '30 mins'})</span></p>
                      <p style="margin: 4px 0;"><strong>📍 Location / Format:</strong> ${meetingLocation}</p>
                      ${meetingAgenda ? `<p style="margin: 8px 0 4px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;"><strong>Agenda / Leader Note:</strong> <em>"${meetingAgenda}"</em></p>` : ''}
                    </div>
                    <div style="margin: 25px 0; text-align: center;">
                      <a href="https://taliat-app.web.app/#parent-requests" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                        Confirm Attendance & RSVP &rarr;
                      </a>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
                    Dhulfiqār Scouting Leadership Portal &bull; Michigan Crossroads Council 780
                  </div>
                </div>
              `
            }
          });
        } catch (mailErr) {
          console.warn("Parent meeting email queue error:", mailErr);
        }
      }
    };

    if (targetType === 'single_parent') {
      await dispatchSingleInvite({
        parentUid,
        parentName,
        parentEmail,
        parentPhone,
        scoutId,
        scoutName,
        patrolId,
        patrolName
      });
    } else if (Array.isArray(targetedParents) && targetedParents.length > 0) {
      for (const parentTarget of targetedParents) {
        await dispatchSingleInvite(parentTarget);
      }
    } else {
      // Fallback query users for patrol or all unit
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
      const scoutsInScope = allUsers.filter(u => {
        if (u.role !== 'scout') return false;
        if (targetType === 'patrol_parents' && patrolId) {
          return u.groupId === patrolId || u.patrolId === patrolId || u.patrolName === patrolName;
        }
        return true;
      });

      const processedParents = new Set();
      for (const s of scoutsInScope) {
        const pEmail = s.parentEmail;
        const pPhone = s.parentPhone;
        const pUid = Array.isArray(s.parentUids) && s.parentUids.length > 0 ? s.parentUids[0] : null;
        const pKey = pUid || pEmail || pPhone || s.uid;

        if (!processedParents.has(pKey)) {
          processedParents.add(pKey);
          await dispatchSingleInvite({
            parentUid: pUid,
            parentName: s.parentName || `Parent of ${s.fullName || s.username}`,
            parentEmail: pEmail,
            parentPhone: pPhone,
            scoutId: s.uid,
            scoutName: s.fullName || s.username,
            patrolId: s.groupId || s.patrolId || patrolId,
            patrolName: s.patrolName || patrolName || 'Troop 1318'
          });
        }
      }
    }

    return { success: true, count: createdIds.length, createdIds };
  } catch (err) {
    console.error("Error creating leader initiated meeting:", err);
    throw err;
  }
}

/**
 * Parent responds to a leader-initiated meeting invite (RSVP)
 */
export async function parentRespondToMeetingInvite({
  requestId,
  parentUid,
  parentName = 'Parent',
  rsvpStatus = 'attending', // 'attending' | 'declined' | 'reschedule_requested'
  parentNote = '',
  proposedAlternateDate = null,
  proposedAlternateTime = null
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const snap = await getDoc(reqRef);
    if (!snap.exists()) throw new Error('Meeting request not found.');

    const reqData = snap.data();
    const respondedAt = new Date().toISOString();

    let newStatus = reqData.status;
    if (rsvpStatus === 'attending') {
      newStatus = 'confirmed';
    } else if (rsvpStatus === 'declined') {
      newStatus = 'declined_by_parent';
    } else if (rsvpStatus === 'reschedule_requested') {
      newStatus = 'pending_review';
    }

    await updateDoc(reqRef, {
      status: newStatus,
      rsvpStatus,
      parentRsvpNote: parentNote.trim(),
      proposedAlternateDate: proposedAlternateDate || null,
      proposedAlternateTime: proposedAlternateTime || null,
      parentRespondedAt: respondedAt,
      updatedAt: serverTimestamp()
    });

    // Notify Leader of Parent's Response
    const leaderUid = reqData.leaderUid || reqData.confirmedByUid || reqData.targetLeaderUid;
    if (leaderUid) {
      try {
        const notifTitle = rsvpStatus === 'attending'
          ? `✓ Meeting RSVP Confirmed: ${parentName}`
          : rsvpStatus === 'reschedule_requested'
            ? `🔄 Reschedule Requested by ${parentName}`
            : `❌ Meeting Declined by ${parentName}`;

        const notifMsg = `Parent ${parentName} for scout ${reqData.scoutName || 'Scout'} has updated their RSVP status to: ${rsvpStatus.toUpperCase()}.\n📅 Meeting: ${reqData.confirmedDate || reqData.proposedDate} @ ${reqData.confirmedTime || reqData.proposedTime}${parentNote ? `\n📝 Note: "${parentNote}"` : ''}${proposedAlternateDate ? `\nAlternate Proposed: ${proposedAlternateDate} @ ${proposedAlternateTime || 'Flexible'}` : ''}`;

        const leaderNotifDoc = {
          recipientUid: leaderUid,
          requestId,
          requestType: 'meeting_request',
          title: notifTitle,
          message: notifMsg,
          parentName,
          scoutName: reqData.scoutName || '',
          rsvpStatus,
          actionUrl: '/#admin-requests',
          read: false,
          createdAt: respondedAt,
          timestamp: serverTimestamp()
        };

        await addDoc(collection(db, 'leader_notifications'), leaderNotifDoc);
        try {
          await addDoc(collection(db, 'users', leaderUid, 'notifications'), leaderNotifDoc);
        } catch (subErr) {
          console.warn("Leader notification subcollection write fallback:", subErr);
        }
      } catch (leaderNotifErr) {
        console.warn("Failed to notify leader of parent RSVP:", leaderNotifErr);
      }
    }

    return { success: true, respondedAt, rsvpStatus };
  } catch (err) {
    console.error("Error responding to meeting invite:", err);
    throw err;
  }
}

/**
 * Leader modifies/reschedules an existing conference request or invitation
 */
export async function updateLeaderMeeting({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  leaderRole = 'Scoutmaster',
  confirmedDate,
  confirmedTime = '6:30 PM',
  meetingLocation = 'Troop Headquarters (Highview Elementary School)',
  confirmationNote = '',
  meetingTopic = 'Scout Advancement & Review',
  parentUid = null,
  parentEmail = null,
  parentPhone = null,
  scoutName = 'your scout'
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    if (!confirmedDate) throw new Error('Confirmed date is required.');

    const reqRef = doc(db, 'parent_requests', requestId);
    const updatedDateIso = new Date().toISOString();

    const updateData = {
      status: 'confirmed',
      rsvpStatus: 'pending', // Reset RSVP so parent can re-confirm if rescheduled
      confirmedDate,
      confirmedTime: confirmedTime || '6:30 PM',
      meetingLocation: meetingLocation || 'Troop Headquarters',
      confirmationNote: confirmationNote || '',
      meetingTopic: meetingTopic || 'Scout Advancement & Review',
      confirmedBy: leaderName,
      confirmedByUid: leaderUid || null,
      confirmedByRole: leaderRole || 'Leader',
      lastModifiedBy: leaderName,
      lastModifiedAt: updatedDateIso,
      updatedAt: serverTimestamp()
    };

    await updateDoc(reqRef, updateData);

    // 1. Record Audit Log
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_UPDATED_MEETING',
        action: 'UPDATED_MEETING',
        category: 'LEADER_PORTAL',
        target: `Parent Conference: ${scoutName}`,
        requestId,
        performedBy: leaderName,
        performedByUid: leaderUid || null,
        role: leaderRole || 'Leader',
        details: `Conference rescheduled to ${confirmedDate} at ${confirmedTime} at ${meetingLocation}.${confirmationNote ? ` Note: "${confirmationNote}"` : ''}`,
        scoutName,
        confirmedDate,
        confirmedTime,
        meetingLocation,
        timestamp: serverTimestamp(),
        createdAt: updatedDateIso
      });
    } catch (auditErr) {
      console.warn("Audit log fallback for meeting update:", auditErr);
    }

    // 2. Send Parent In-App Notification
    if (parentUid || parentEmail) {
      try {
        await dispatchParentNotification({
          recipientUid: parentUid,
          parentEmail: parentEmail,
          title: `📅 Conference Schedule Updated: ${scoutName}`,
          message: `Leader ${leaderName} (${leaderRole}) updated the meeting details for ${scoutName}.\n📅 New Date: ${confirmedDate} @ ${confirmedTime}\n📍 Venue: ${meetingLocation}${confirmationNote ? `\n📝 Leader Note: "${confirmationNote}"` : ''}`,
          type: 'event',
          priority: 'urgent',
          actionUrl: '/#parent-requests',
          metadata: {
            requestId,
            confirmedDate,
            confirmedTime,
            meetingLocation,
            leaderName
          }
        });
      } catch (notifErr) {
        console.warn("Parent meeting update notification warning:", notifErr);
      }
    }

    // 3. Email Dispatch via /mail
    if (parentEmail) {
      try {
        await addDoc(collection(db, 'mail'), {
          to: [parentEmail],
          message: {
            subject: `[Dhulfiqār Scouts] 📅 Conference Updated: ${meetingTopic} for ${scoutName}`,
            text: `Assalāmu ʿAlaykum,\n\nLeader ${leaderName} (${leaderRole}) has updated the conference schedule for ${scoutName}.\n\n📅 Date: ${confirmedDate}\n⏰ Time: ${confirmedTime}\n📍 Location: ${meetingLocation}\n📌 Topic: ${meetingTopic}\n${confirmationNote ? `📝 Note: ${confirmationNote}\n` : ''}\nPlease review and confirm in your Parent Portal: https://taliat-app.web.app/#parent-requests`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #0284c7, #065f46); padding: 16px; border-radius: 8px; color: #ffffff; text-align: center;">
                  <h2 style="margin: 0; font-size: 20px;">Dhulfiqār Troop 313</h2>
                  <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Conference Schedule Updated</p>
                </div>
                <div style="padding: 20px 0;">
                  <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong style="color: #0369a1; font-size: 15px; display: block;">📅 Meeting Details Modified</strong>
                    <span style="color: #0284c7; font-size: 13px;">Leader ${leaderName} has updated the date, time, or venue.</span>
                  </div>
                  <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.8;">
                    <p style="margin: 4px 0;"><strong>Scout:</strong> ${scoutName}</p>
                    <p style="margin: 4px 0;"><strong>Topic:</strong> ${meetingTopic}</p>
                    <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${confirmedDate}</p>
                    <p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${confirmedTime}</p>
                    <p style="margin: 4px 0;"><strong>📍 Venue:</strong> ${meetingLocation}</p>
                    ${confirmationNote ? `<p style="margin: 8px 0 4px 0; border-top: 1px solid #e2e8f0; padding-top: 8px;"><strong>Leader Note:</strong> <em>"${confirmationNote}"</em></p>` : ''}
                  </div>
                  <div style="margin: 25px 0; text-align: center;">
                    <a href="https://taliat-app.web.app/#parent-requests" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                      View in Parent Portal &rarr;
                    </a>
                  </div>
                </div>
              </div>
            `
          }
        });
      } catch (mailErr) {
        console.warn("Mail queue error for meeting update:", mailErr);
      }
    }

    return { success: true, updatedDateIso };
  } catch (err) {
    console.error("Error updating leader meeting:", err);
    throw err;
  }
}

/**
 * Leader cancels a confirmed or scheduled meeting and removes it from the list if unaccepted
 */
export async function cancelMeetingByLeader({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  leaderRole = 'Scoutmaster',
  cancelReason = '',
  parentUid = null,
  parentEmail = null,
  scoutName = 'your scout',
  meetingTopic = 'Scout Conference',
  removeDoc = true // When true, deletes the document from Firestore so it is removed from the list immediately
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const cancelledAt = new Date().toISOString();

    // 1. Audit Log
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_CANCELLED_MEETING',
        action: 'CANCELLED_MEETING',
        category: 'LEADER_PORTAL',
        target: `Parent Conference: ${scoutName}`,
        requestId,
        performedBy: leaderName,
        performedByUid: leaderUid || null,
        role: leaderRole || 'Leader',
        details: `Conference cancelled ${removeDoc ? 'and removed from list ' : ''}by ${leaderName}.${cancelReason ? ` Reason: "${cancelReason}"` : ''}`,
        scoutName,
        cancelReason: cancelReason || '',
        timestamp: serverTimestamp(),
        createdAt: cancelledAt
      });
    } catch (auditErr) {
      console.warn("Audit log fallback for leader cancellation:", auditErr);
    }

    // 2. Parent Notification (if parent contact exists)
    if (parentUid || parentEmail) {
      try {
        await dispatchParentNotification({
          recipientUid: parentUid,
          parentEmail: parentEmail,
          title: `❌ Conference Cancelled: ${scoutName}`,
          message: `Leader ${leaderName} (${leaderRole}) has cancelled the scheduled conference regarding "${meetingTopic}".\n📝 Reason: "${cancelReason || 'Cancelled by leadership'}"`,
          type: 'general',
          priority: 'urgent',
          actionUrl: '/#parent-requests'
        });
      } catch (notifErr) {
        console.warn("Parent cancel notification error:", notifErr);
      }
    }

    // 3. Remove document from Firestore collection
    if (removeDoc) {
      await deleteDoc(reqRef);
    } else {
      await updateDoc(reqRef, {
        status: 'cancelled_by_leader',
        cancelledBy: leaderName,
        cancelledByUid: leaderUid || null,
        cancelledByRole: leaderRole || 'Leader',
        cancelledAt,
        cancelReason: cancelReason || 'Meeting cancelled by troop leadership.',
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, cancelledAt, removed: removeDoc };
  } catch (err) {
    console.error("Error cancelling meeting by leader:", err);
    throw err;
  }
}

/**
 * Direct delete / purge of a parent request or conference from Firestore
 */
export async function deleteParentRequest({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  scoutName = 'Scout'
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    await deleteDoc(reqRef);

    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_DELETED_REQUEST',
        action: 'DELETED_REQUEST',
        category: 'LEADER_PORTAL',
        target: `Parent Request: ${scoutName}`,
        requestId,
        performedBy: leaderName,
        performedByUid: leaderUid || null,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
    } catch (auditErr) {
      console.warn("Audit log fallback for delete request:", auditErr);
    }

    return { success: true };
  } catch (err) {
    console.error("Error deleting parent request:", err);
    throw err;
  }
}

/**
 * Leader marks a conference as completed & resolved with final summary notes
 */
export async function completeConference({
  requestId,
  leaderUid,
  leaderName = 'Troop Leader',
  leaderRole = 'Scoutmaster',
  completionNotes = '',
  scoutId = null,
  scoutName = 'Scout',
  parentUid = null,
  parentEmail = null
}) {
  try {
    if (!requestId) throw new Error('Request ID is required.');
    const reqRef = doc(db, 'parent_requests', requestId);
    const completedAt = new Date().toISOString();

    const updateData = {
      status: 'resolved',
      resolvedBy: leaderName,
      resolvedByUid: leaderUid || null,
      resolvedByRole: leaderRole || 'Leader',
      resolvedAt: completedAt,
      resolutionNote: completionNotes || 'Conference completed and documented by leadership.',
      completedAt,
      completionNotes: completionNotes || '',
      updatedAt: serverTimestamp()
    };

    await updateDoc(reqRef, updateData);

    // 1. Append notes to scout profile if scoutId exists
    if (scoutId) {
      try {
        const scoutNotesRef = doc(db, 'scout_notes', scoutId);
        const sSnap = await getDoc(scoutNotesRef);
        const existingNotes = sSnap.exists() ? (sSnap.data().notes || []) : [];
        const completionLog = {
          id: `conf_${Date.now()}`,
          text: `🤝 Completed Parent Conference with leadership (${leaderName})\n📝 Summary & Action Items: "${completionNotes || 'Conference conducted successfully.'}"`,
          date: new Date().toISOString().split('T')[0],
          authorId: leaderUid || null,
          authorName: leaderName,
          authorPosition: leaderRole || 'Leader',
          type: 'parent_conference_completed',
          createdAt: completedAt
        };

        await setDoc(scoutNotesRef, {
          notes: [...existingNotes, completionLog],
          updatedAt: serverTimestamp(),
          updatedBy: leaderUid || 'leader'
        }, { merge: true });
      } catch (noteErr) {
        console.warn("Scout note append fallback:", noteErr);
      }
    }

    // 2. Audit Log
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actionType: 'LEADER_COMPLETED_CONFERENCE',
        action: 'COMPLETED_CONFERENCE',
        category: 'LEADER_PORTAL',
        target: `Parent Conference: ${scoutName}`,
        requestId,
        performedBy: leaderName,
        performedByUid: leaderUid || null,
        role: leaderRole || 'Leader',
        details: `Conference completed and marked resolved by ${leaderName}.${completionNotes ? ` Notes: "${completionNotes}"` : ''}`,
        scoutName,
        timestamp: serverTimestamp(),
        createdAt: completedAt
      });
    } catch (auditErr) {
      console.warn("Audit log fallback for completion:", auditErr);
    }

    // 3. Parent notification
    if (parentUid || parentEmail) {
      try {
        await dispatchParentNotification({
          recipientUid: parentUid,
          parentEmail: parentEmail,
          title: `✓ Conference Completed: ${scoutName}`,
          message: `Thank you for meeting with Leader ${leaderName}. Your conference has been marked completed in the troop registry.${completionNotes ? `\n📝 Summary: "${completionNotes}"` : ''}`,
          type: 'general',
          priority: 'normal',
          actionUrl: '/#parent-tasks'
        });
      } catch (notifErr) {
        console.warn("Parent completion notification fallback:", notifErr);
      }
    }

    return { success: true, completedAt };
  } catch (err) {
    console.error("Error completing conference:", err);
    throw err;
  }
}


