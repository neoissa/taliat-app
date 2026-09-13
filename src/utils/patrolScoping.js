/**
 * src/utils/patrolScoping.js
 * Universal helper functions for patrol resolution, scout membership, and access control.
 */

/**
 * Normalizes patrol name for resilient fuzzy matching.
 * Strips 'Patrol', accents, whitespace, and special characters.
 */
export function normalizePatrolName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents (e.g. Dhulfiqār -> dhulfiqar)
    .replace(/\s+patrol$/i, '')      // remove trailing " patrol"
    .replace(/[^a-z0-9]/g, '');      // keep alphanumeric
}

/**
 * Checks if a user has troop-wide superuser authority.
 */
export function isSuperUser(user) {
  if (!user) return false;
  if (user.role === 'owner' || user.isOwner || user.email === 'neoissa@gmail.com') return true;
  if (user.role === 'admin' || user.isAdmin) return true;
  if (user.role === 'executive' || user.isExecutive) return true;
  const pos = (user.leaderPosition || '').toLowerCase().trim();
  if (pos === 'scoutmaster' || pos === 'assistant scoutmaster' || pos === 'assistant scout master') return true;
  return false;
}

/**
 * Resolves all accessible patrols for a leader (or all patrols for superusers).
 */
export function getAccessiblePatrols(user, groups = []) {
  if (!user) return [];
  if (isSuperUser(user)) return groups;

  const userPatrolNorms = [
    normalizePatrolName(user.groupId),
    normalizePatrolName(user.patrolId),
    normalizePatrolName(user.assignedPatrol),
    normalizePatrolName(user.patrol),
    normalizePatrolName(user.patrolName)
  ].filter(Boolean);

  const assignedPatrolsArray = Array.isArray(user.assignedPatrols) ? user.assignedPatrols : [];
  const assignedPatrolsNorms = assignedPatrolsArray.map(normalizePatrolName).filter(Boolean);

  const accessible = groups.filter(g => {
    // Direct ID match
    if (g.id === user.groupId || g.id === user.patrolId || g.id === user.assignedPatrol || g.id === user.patrol) return true;
    if (assignedPatrolsArray.includes(g.id)) return true;

    // Leader ID assignment on the group document
    if (g.leaderId === user.uid) return true;
    if (Array.isArray(g.assignedLeaderIds) && g.assignedLeaderIds.includes(user.uid)) return true;
    if (Array.isArray(g.assistantLeaderIds) && g.assistantLeaderIds.includes(user.uid)) return true;

    // Name matching
    const groupNorm = normalizePatrolName(g.name);
    if (groupNorm && userPatrolNorms.includes(groupNorm)) return true;
    if (groupNorm && assignedPatrolsNorms.includes(groupNorm)) return true;

    return false;
  });

  // If groups is not yet loaded or user's assigned patrol not in groups list, create fallback group object
  if (accessible.length === 0 && (user.assignedPatrol || user.patrol || user.patrolName || user.groupId || user.patrolId)) {
    const fallbackName = user.assignedPatrol || user.patrol || user.patrolName || user.groupId || 'Assigned Patrol';
    return [{
      id: user.groupId || user.patrolId || fallbackName,
      name: fallbackName.replace(/\s+Patrol$/i, '')
    }];
  }

  return accessible;
}

/**
 * Checks if a scout belongs to a specific patrol (group object, ID, or patrol name).
 */
export function isScoutInPatrol(scout, groupOrId, groups = []) {
  if (!scout || !groupOrId) return false;
  if (groupOrId === 'all') return true;

  // Resolve target group
  let targetGroup = typeof groupOrId === 'object' ? groupOrId : groups.find(g => g.id === groupOrId || normalizePatrolName(g.name) === normalizePatrolName(groupOrId));
  const targetId = typeof groupOrId === 'string' ? groupOrId : (targetGroup?.id || '');
  const targetName = targetGroup?.name || (typeof groupOrId === 'string' ? groupOrId : '');
  const targetNorm = normalizePatrolName(targetName || targetId);

  // 1. Direct ID match
  if (targetId && (
    scout.groupId === targetId ||
    scout.patrolId === targetId ||
    scout.assignedPatrol === targetId ||
    scout.patrol === targetId ||
    (Array.isArray(scout.assignedPatrols) && scout.assignedPatrols.includes(targetId))
  )) {
    return true;
  }

  // 2. Normalized name match
  const scoutNorms = [
    normalizePatrolName(scout.groupId),
    normalizePatrolName(scout.patrolId),
    normalizePatrolName(scout.patrol),
    normalizePatrolName(scout.patrolName),
    normalizePatrolName(scout.assignedPatrol)
  ].filter(Boolean);

  if (Array.isArray(scout.assignedPatrols)) {
    scout.assignedPatrols.forEach(p => {
      const n = normalizePatrolName(p);
      if (n) scoutNorms.push(n);
    });
  }

  if (targetNorm && scoutNorms.includes(targetNorm)) {
    return true;
  }

  // 3. Leader match if target group has leaderId
  if (targetGroup && targetGroup.leaderId && scout.leaderId && scout.leaderId === targetGroup.leaderId) {
    return true;
  }

  return false;
}

/**
 * Resolves the display patrol name for a scout.
 */
export function getScoutPatrolName(scout, groups = []) {
  if (!scout) return 'Assigned Patrol';
  const foundGroup = groups.find(g => isScoutInPatrol(scout, g, groups));
  if (foundGroup?.name) return `${foundGroup.name} Patrol`;
  if (scout.patrolName) return scout.patrolName.toLowerCase().includes('patrol') ? scout.patrolName : `${scout.patrolName} Patrol`;
  if (scout.patrol) return scout.patrol.toLowerCase().includes('patrol') ? scout.patrol : `${scout.patrol} Patrol`;
  if (scout.assignedPatrol) return scout.assignedPatrol.toLowerCase().includes('patrol') ? scout.assignedPatrol : `${scout.assignedPatrol} Patrol`;
  return 'Taliʿa Patrol';
}

/**
 * Robustly filters a list of scouts for the current user based on authority and selected filter.
 */
export function filterScoutsForUser(allScouts = [], user, groups = [], selectedFilter = 'all') {
  if (!allScouts || allScouts.length === 0) return [];
  const superUser = isSuperUser(user);
  const accessible = getAccessiblePatrols(user, groups);
  const accessibleIds = accessible.map(g => g.id);

  return allScouts.filter(scout => {
    // Exclude non-scouts if role is explicitly defined
    if (scout.role && scout.role !== 'scout' && scout.role !== 'member') return false;

    if (superUser) {
      if (!selectedFilter || selectedFilter === 'all') return true;
      return isScoutInPatrol(scout, selectedFilter, groups);
    }

    // For regular leader:
    // If they selected a specific patrol from their accessible patrols
    if (selectedFilter && selectedFilter !== 'all') {
      const isAllowed = accessibleIds.includes(selectedFilter) || accessible.some(g => normalizePatrolName(g.name) === normalizePatrolName(selectedFilter));
      if (isAllowed) {
        return isScoutInPatrol(scout, selectedFilter, groups);
      }
    }

    // Direct leader assignment
    if (scout.leaderId && user?.uid && scout.leaderId === user.uid) return true;

    // Belongs to any of leader's accessible patrols
    if (accessible.length > 0) {
      return accessible.some(g => isScoutInPatrol(scout, g, groups));
    }

    // Fallback: direct match on user's own fields
    const userPatrolNorm = normalizePatrolName(user?.groupId || user?.patrolId || user?.assignedPatrol || user?.patrol || user?.patrolName);
    if (userPatrolNorm) {
      const sNorm = normalizePatrolName(scout.groupId || scout.patrolId || scout.assignedPatrol || scout.patrol || scout.patrolName);
      if (sNorm && sNorm === userPatrolNorm) return true;
    }

    return false;
  });
}
