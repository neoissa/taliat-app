import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  writeBatch, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Synchronizes parent household data and scout health records atomically
 * across the parent document and all linked child scout documents in Firestore.
 * 
 * @param {Object} params
 * @param {string} params.parentUid - The Firebase Auth UID of the parent.
 * @param {Object} params.familyProfile - Household & dual-parent profile data.
 * @param {Object} params.scoutHealthMap - Keyed by scoutId: { allergies, medicalNotes, dietaryRestrictions }
 * @param {Array<string>} params.linkedScoutIds - List of linked scout UIDs.
 * @returns {Promise<{ success: boolean, syncedScoutCount: number }>}
 */
export async function syncParentProfileToChildren({
  parentUid,
  familyProfile = {},
  scoutHealthMap = {},
  linkedScoutIds = []
}) {
  if (!parentUid) {
    throw new Error('Parent UID is required for family profile sync.');
  }

  const batch = writeBatch(db);
  const nowIso = new Date().toISOString();

  // Normalize family profile fields
  const parent1Name = (familyProfile.parent1Name || '').trim();
  const parent1Phone = (familyProfile.parent1Phone || '').trim();
  const parent1Email = (familyProfile.parent1Email || '').trim().toLowerCase();
  const parent1Relation = familyProfile.parent1Relation || 'Father';

  const parent2Name = (familyProfile.parent2Name || '').trim();
  const parent2Phone = (familyProfile.parent2Phone || '').trim();
  const parent2Email = (familyProfile.parent2Email || '').trim().toLowerCase();
  const parent2Relation = familyProfile.parent2Relation || 'Mother';

  const primaryAccountHolder = familyProfile.primaryAccountHolder || 'parent1';
  const familyAddress = (familyProfile.familyAddress || familyProfile.homeAddress || '').trim();
  const cityStateZip = (familyProfile.cityStateZip || '').trim();

  const emergencyContactName = (familyProfile.emergencyContactName || '').trim();
  const emergencyContactPhone = (familyProfile.emergencyContactPhone || '').trim();
  const emergencyContactRelation = (familyProfile.emergencyContactRelation || '').trim() || 'Emergency Contact';

  // Determine effective primary parent phone/email
  const isParent2Primary = primaryAccountHolder === 'parent2';
  const effectiveParentPhone = isParent2Primary ? (parent2Phone || parent1Phone) : (parent1Phone || parent2Phone);
  const effectiveParentEmail = isParent2Primary ? (parent2Email || parent1Email) : (parent1Email || parent2Email);

  // 1. Prepare Parent Document Payload
  const parentRef = doc(db, 'users', parentUid);
  const parentPayload = {
    primaryAccountHolder,
    parent1Name: parent1Name || null,
    parent1Phone: parent1Phone || null,
    parent1Email: parent1Email || null,
    parent1Relation: parent1Relation || 'Father',
    parent2Name: parent2Name || null,
    parent2Phone: parent2Phone || null,
    parent2Email: parent2Email || null,
    parent2Relation: parent2Relation || 'Mother',
    familyAddress: familyAddress || null,
    homeAddress: familyAddress || null,
    cityStateZip: cityStateZip || null,
    address: familyAddress || null,
    emergencyContactName: emergencyContactName || null,
    emergencyContactPhone: emergencyContactPhone || null,
    emergencyContactRelation: emergencyContactRelation || 'Emergency Contact',
    linkedScoutIds: Array.isArray(linkedScoutIds) ? linkedScoutIds : [],
    lastFamilySyncAt: nowIso,
    updatedAt: serverTimestamp()
  };

  batch.set(parentRef, parentPayload, { merge: true });

  // 2. Prepare Child Scout Documents Payloads
  const validScoutIds = (linkedScoutIds || []).filter(Boolean);
  let syncedScoutCount = 0;

  for (const scoutId of validScoutIds) {
    const scoutRef = doc(db, 'users', scoutId);
    const health = scoutHealthMap[scoutId] || {};

    const scoutPayload = {
      // Dual-parent linkage
      parent1Name: parent1Name || null,
      parent1Phone: parent1Phone || null,
      parent1Email: parent1Email || null,
      parent1Relation: parent1Relation || 'Father',
      parent2Name: parent2Name || null,
      parent2Phone: parent2Phone || null,
      parent2Email: parent2Email || null,
      parent2Relation: parent2Relation || 'Mother',
      parentPhone: effectiveParentPhone || null,
      parentEmail: effectiveParentEmail || null,
      parentPrimaryAccountHolder: primaryAccountHolder,
      
      // Household address
      familyAddress: familyAddress || null,
      homeAddress: familyAddress || null,
      address: familyAddress || null,
      ...(cityStateZip ? { cityStateZip } : {}),

      // Emergency Contacts
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      emergencyContactRelation: emergencyContactRelation || 'Emergency Contact',

      // Health & Medical Notes (if specified)
      ...(health.allergies !== undefined ? { allergies: (health.allergies || '').trim() || null } : {}),
      ...(health.medicalNotes !== undefined ? { medicalNotes: (health.medicalNotes || '').trim() || null } : {}),
      ...(health.dietaryRestrictions !== undefined ? { dietaryRestrictions: (health.dietaryRestrictions || '').trim() || null } : {}),

      // Metadata & Permission verification
      parentUids: arrayUnion(parentUid),
      syncedFromParentUid: parentUid,
      lastParentSyncAt: nowIso
    };

    batch.set(scoutRef, scoutPayload, { merge: true });
    syncedScoutCount++;
  }

  // 3. Commit atomic batch write
  await batch.commit();

  return {
    success: true,
    syncedScoutCount
  };
}

/**
 * Links a scout account to a parent account bi-directionally.
 */
export async function linkScoutToParentAccount(parentUid, scoutId) {
  if (!parentUid || !scoutId) throw new Error('parentUid and scoutId are required.');

  const batch = writeBatch(db);
  const parentRef = doc(db, 'users', parentUid);
  const scoutRef = doc(db, 'users', scoutId);

  batch.set(parentRef, {
    linkedScoutIds: arrayUnion(scoutId),
    updatedAt: serverTimestamp()
  }, { merge: true });

  batch.set(scoutRef, {
    parentUids: arrayUnion(parentUid),
    syncedFromParentUid: parentUid,
    updatedAt: serverTimestamp()
  }, { merge: true });

  await batch.commit();
}

/**
 * Unlinks a scout account from a parent account bi-directionally.
 */
export async function unlinkScoutFromParentAccount(parentUid, scoutId) {
  if (!parentUid || !scoutId) throw new Error('parentUid and scoutId are required.');

  const batch = writeBatch(db);
  const parentRef = doc(db, 'users', parentUid);
  const scoutRef = doc(db, 'users', scoutId);

  batch.set(parentRef, {
    linkedScoutIds: arrayRemove(scoutId),
    updatedAt: serverTimestamp()
  }, { merge: true });

  batch.set(scoutRef, {
    parentUids: arrayRemove(parentUid),
    updatedAt: serverTimestamp()
  }, { merge: true });

  await batch.commit();
}
