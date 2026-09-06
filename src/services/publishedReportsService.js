import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { dispatchParentNotification } from '../utils/notificationPipeline';

/**
 * Publishes a versioned progress report snapshot to /published_reports
 */
export async function publishProgressReport({
  scoutId,
  scoutName,
  groupId = 'default',
  patrolName = 'Taliʿa Patrol',
  parentEmail = null,
  parentUid = null,
  leaderId,
  leaderName,
  reportingPeriod = 'All-Time Cumulative',
  reportSnapshot = {},
  leaderSignature = {}
}) {
  try {
    if (!scoutId) throw new Error('Scout ID is required to publish a progress report.');

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = Date.now().toString().slice(-4);
    // Unique report ID per publication
    const reportId = `report_${scoutId}_${dateStr}_${timestampStr}`;
    const publishedAt = new Date().toISOString();

    const reportData = {
      reportId,
      scoutId,
      scoutName: scoutName || 'Scout',
      groupId: groupId || 'all',
      patrolName: patrolName || 'Taliʿa Patrol',
      leaderId: leaderId || 'leader',
      leaderName: leaderName || 'Unit Leader',
      publishedAt,
      reportingPeriod: reportingPeriod || 'All-Time Cumulative',
      reportSnapshot: {
        rank: reportSnapshot.rank || 'Scout',
        rankProgress: reportSnapshot.rankProgress !== undefined ? reportSnapshot.rankProgress : 0,
        attendanceRate: reportSnapshot.attendanceRate !== undefined ? reportSnapshot.attendanceRate : 100,
        completedRankSteps: reportSnapshot.completedRankSteps || [],
        meritBadges: reportSnapshot.meritBadges || [],
        serviceHours: reportSnapshot.serviceHours !== undefined ? reportSnapshot.serviceHours : 0,
        homeworkRecords: reportSnapshot.homeworkRecords || [],
        leaderCommentary: {
          strengths: reportSnapshot.leaderCommentary?.strengths || '',
          focusAreas: reportSnapshot.leaderCommentary?.focusAreas || '',
          parentActionItems: reportSnapshot.leaderCommentary?.parentActionItems || ''
        },
        advancementPlan: reportSnapshot.advancementPlan || null,
        totalEventsAttended: reportSnapshot.totalEventsAttended || 0
      },
      signatures: {
        leader: {
          signed: !!leaderSignature.signed,
          signerName: leaderSignature.signerName || leaderName || 'Unit Leader',
          signerRole: leaderSignature.signerRole || 'Scoutmaster / Unit Leader',
          signatureDataUrl: leaderSignature.signatureDataUrl || null,
          signedAt: leaderSignature.signedAt || publishedAt
        },
        parent: {
          signed: false,
          signerName: null,
          signerRole: null, // "Father" | "Mother" | "Guardian"
          signatureDataUrl: null,
          signedAt: null,
          signerUid: null
        },
        scout: {
          signed: false,
          signerName: null,
          signatureDataUrl: null,
          signedAt: null
        }
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'published_reports', reportId), reportData);

    // Notify parent via notification pipeline
    try {
      await dispatchParentNotification({
        recipientUid: parentUid,
        parentEmail: parentEmail,
        title: `Official Progress Report Published for ${scoutName}`,
        message: `Unit Leader ${leaderName || 'Scoutmaster'} has published an official progress report for ${scoutName}. Please log in to your Parent Portal to review, provide feedback, and apply your digital signature.`,
        type: 'homework',
        priority: 'high',
        actionUrl: '/#parent-reports',
        metadata: {
          reportId,
          scoutId,
          scoutName
        }
      });
    } catch (notifErr) {
      console.warn('Could not dispatch parent notification email/alert:', notifErr);
    }

    return { success: true, reportId, reportData };
  } catch (err) {
    console.error('Error publishing progress report:', err);
    throw err;
  }
}

/**
 * Parent signs a published report with digital canvas signature
 */
export async function signPublishedReportByParent({
  reportId,
  signerName,
  signerRole = 'Parent / Guardian',
  signatureDataUrl,
  signerUid = null
}) {
  try {
    if (!reportId) throw new Error('Report ID is required.');
    if (!signatureDataUrl) throw new Error('Signature image is required.');
    if (!signerName) throw new Error('Signer name is required.');

    const signedAt = new Date().toISOString();
    const docRef = doc(db, 'published_reports', reportId);

    await updateDoc(docRef, {
      'signatures.parent': {
        signed: true,
        signerName,
        signerRole: signerRole || 'Parent / Guardian',
        signatureDataUrl,
        signedAt,
        signerUid
      },
      updatedAt: serverTimestamp()
    });

    return { success: true, signedAt };
  } catch (err) {
    console.error('Error signing published report by parent:', err);
    throw err;
  }
}

/**
 * Scout signs a published report with digital canvas signature
 */
export async function signPublishedReportByScout({
  reportId,
  signerName,
  signatureDataUrl
}) {
  try {
    if (!reportId) throw new Error('Report ID is required.');
    if (!signatureDataUrl) throw new Error('Signature image is required.');
    if (!signerName) throw new Error('Signer name is required.');

    const signedAt = new Date().toISOString();
    const docRef = doc(db, 'published_reports', reportId);

    await updateDoc(docRef, {
      'signatures.scout': {
        signed: true,
        signerName,
        signatureDataUrl,
        signedAt
      },
      updatedAt: serverTimestamp()
    });

    return { success: true, signedAt };
  } catch (err) {
    console.error('Error signing published report by scout:', err);
    throw err;
  }
}

/**
 * Retracts / deletes a published report
 */
export async function deletePublishedReport(reportId) {
  try {
    if (!reportId) throw new Error('Report ID is required.');
    await deleteDoc(doc(db, 'published_reports', reportId));
    return { success: true };
  } catch (err) {
    console.error('Error deleting published report:', err);
    throw err;
  }
}
