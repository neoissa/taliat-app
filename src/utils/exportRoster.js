/**
 * exportRoster.js
 * 
 * Aggregation engine & export utilities for Troop 313 Roster data.
 * Compiles fully populated records from scout profiles, linked dual-parent household profiles,
 * groups, attendance sessions, and service logs into downloadable CSV and formatted printable PDF rosters.
 */

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Cleanly escapes a string value for RFC-4180 compliant CSV export.
 */
export function escapeCsvCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Aggregates all scout profiles and merges them with dual-parent records,
 * patrol groups, attendance sessions, and service logs.
 * 
 * @param {Object} options
 * @param {Array} [options.scouts] Optional in-memory scouts array
 * @param {Array} [options.groups] Optional in-memory groups array
 * @param {Array} [options.allUsers] Optional in-memory all users array (for parent lookups)
 * @param {Array} [options.attendanceSessions] Optional in-memory attendance sessions
 * @param {Array} [options.serviceLogs] Optional in-memory service logs
 * @returns {Promise<Array>} Aggregated roster records
 */
export async function aggregateRosterData(options = {}) {
  let scouts = options.scouts;
  let groups = options.groups;
  let allUsers = options.allUsers;
  let attendanceSessions = options.attendanceSessions;
  let serviceLogs = options.serviceLogs;

  // If any required dataset is not provided in memory, query Firestore
  if (!allUsers) {
    try {
      const snapUsers = await getDocs(collection(db, 'users'));
      allUsers = snapUsers.docs.map(d => ({ uid: d.id, ...d.data() }));
    } catch (err) {
      console.warn('Error fetching users for roster export:', err);
      allUsers = [];
    }
  }

  if (!scouts) {
    scouts = allUsers.filter(u => u.role === 'scout' || (!u.role && !u.isParent && !u.isLeader && !u.isAdmin && !u.isOwner));
  }

  if (!groups) {
    try {
      const snapGroups = await getDocs(collection(db, 'groups'));
      groups = snapGroups.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived);
    } catch (err) {
      console.warn('Error fetching groups for roster export:', err);
      groups = [];
    }
  }

  if (!attendanceSessions) {
    try {
      const snapAtt = await getDocs(collection(db, 'attendance_sessions'));
      attendanceSessions = snapAtt.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('Error fetching attendance for roster export:', err);
      attendanceSessions = [];
    }
  }

  if (!serviceLogs) {
    try {
      const snapServ = await getDocs(collection(db, 'service_logs'));
      serviceLogs = snapServ.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('Error fetching service logs for roster export:', err);
      serviceLogs = [];
    }
  }

  // Build groups lookup map
  const groupsMap = {};
  groups.forEach(g => {
    groupsMap[g.id] = g;
  });

  // Build parent lookup map
  const parentsList = allUsers.filter(u => u.role === 'parent');
  const parentByUidMap = {};
  parentsList.forEach(p => {
    parentByUidMap[p.uid] = p;
  });

  // Compile aggregated records
  const aggregatedRoster = scouts.map(scout => {
    const scoutUid = scout.uid;
    const patrolGroup = groupsMap[scout.groupId] || groupsMap[scout.patrolId] || groups.find(g => g.id === scout.groupId || g.id === scout.patrolId) || null;
    const patrolName = patrolGroup?.name || scout.patrolName || scout.patrol || 'Unassigned Patrol';

    // Find assigned leader
    let leaderName = '';
    if (patrolGroup?.leaderId) {
      const leaderUser = allUsers.find(u => u.uid === patrolGroup.leaderId);
      leaderName = leaderUser?.fullName || leaderUser?.username || patrolGroup.leaderName || '';
    } else if (scout.leaderId) {
      const leaderUser = allUsers.find(u => u.uid === scout.leaderId);
      leaderName = leaderUser?.fullName || leaderUser?.username || '';
    }

    // Find linked parent documents if available
    let linkedParentDoc = null;
    if (Array.isArray(scout.parentUids) && scout.parentUids.length > 0) {
      linkedParentDoc = parentByUidMap[scout.parentUids[0]];
    } else if (scout.parentUid) {
      linkedParentDoc = parentByUidMap[scout.parentUid];
    } else if (scout.syncedFromParentUid) {
      linkedParentDoc = parentByUidMap[scout.syncedFromParentUid];
    }

    if (!linkedParentDoc) {
      // Check if any parent has this scout in linkedScoutIds
      linkedParentDoc = parentsList.find(p => Array.isArray(p.linkedScoutIds) && p.linkedScoutIds.includes(scoutUid));
    }

    // Resolve Dual-Parent Contact Data
    const parent1Name = scout.parent1Name || linkedParentDoc?.parent1Name || linkedParentDoc?.fullName || (scout.parentEmail ? 'Primary Guardian' : '');
    const parent1Relation = scout.parent1Relation || linkedParentDoc?.parent1Relation || 'Parent / Guardian';
    const parent1Phone = scout.parentPhone || scout.parent1Phone || linkedParentDoc?.parent1Phone || linkedParentDoc?.phone || '';
    const parent1Email = scout.parentEmail || scout.parent1Email || linkedParentDoc?.parent1Email || linkedParentDoc?.email || '';

    const parent2Name = scout.parent2Name || linkedParentDoc?.parent2Name || '';
    const parent2Relation = scout.parent2Relation || linkedParentDoc?.parent2Relation || 'Parent / Guardian';
    const parent2Phone = scout.parent2Phone || linkedParentDoc?.parent2Phone || '';
    const parent2Email = scout.parent2Email || linkedParentDoc?.parent2Email || '';

    // Resolve Household Address
    const homeAddress = scout.homeAddress || scout.familyAddress || scout.address || linkedParentDoc?.familyAddress || linkedParentDoc?.homeAddress || linkedParentDoc?.address || '';
    const cityStateZip = scout.cityStateZip || linkedParentDoc?.cityStateZip || '';
    const fullHouseholdAddress = [homeAddress, cityStateZip].filter(Boolean).join(', ');

    // Resolve Emergency Contact
    const emergencyContactName = scout.emergencyContactName || linkedParentDoc?.emergencyContactName || '';
    const emergencyContactRelation = scout.emergencyContactRelation || linkedParentDoc?.emergencyContactRelation || 'Emergency Contact';
    const emergencyContactPhone = scout.emergencyContactPhone || linkedParentDoc?.emergencyContactPhone || '';

    // Resolve Health & Safety Records
    const allergies = scout.allergies || '';
    const dietaryRestrictions = scout.dietaryRestrictions || '';
    const medicalNotes = scout.medicalNotes || '';

    // Compute Attendance Statistics
    let scoutTotalSessions = 0;
    let scoutPresentCount = 0;
    attendanceSessions.forEach(session => {
      const record = session.records?.[scoutUid];
      if (record) {
        scoutTotalSessions++;
        const status = record.status || 'present';
        if (status === 'present' || status === 'late') {
          scoutPresentCount++;
        }
      }
    });

    const attendanceRate = scoutTotalSessions > 0
      ? Math.round((scoutPresentCount / scoutTotalSessions) * 100)
      : (scout.attendanceRate !== undefined ? Number(scout.attendanceRate) : 100);

    // Compute Total Service Hours
    let totalServiceHours = 0;
    serviceLogs.forEach(log => {
      if ((log.scoutId === scoutUid || log.userId === scoutUid) && (log.approved !== false && log.status !== 'rejected')) {
        totalServiceHours += (Number(log.hours) || 0);
      }
    });

    return {
      uid: scoutUid,
      fullName: scout.fullName || scout.username || 'Unnamed Scout',
      username: scout.username || '',
      bsaId: scout.bsaId || '',
      rank: scout.rank || 'Scout',
      patrolName: patrolName,
      patrolId: patrolGroup?.id || scout.groupId || scout.patrolId || '',
      leaderAssigned: leaderName || 'Troop Scoutmaster',
      youthPosition: scout.scoutPosition || scout.position || 'General Scout / Member',
      birthDate: scout.birthDate || scout.dob || scout.birthday || '',
      schoolGrade: scout.schoolGrade || scout.grade || '',
      scoutEmail: scout.personalEmail || scout.scoutEmail || scout.email || '',
      scoutPhone: scout.scoutPhone || scout.phone || '',
      parent1Name: parent1Name,
      parent1Relation: parent1Relation,
      parent1Phone: parent1Phone,
      parent1Email: parent1Email,
      parent2Name: parent2Name,
      parent2Relation: parent2Relation,
      parent2Phone: parent2Phone,
      parent2Email: parent2Email,
      homeAddress: homeAddress,
      cityStateZip: cityStateZip,
      fullHouseholdAddress: fullHouseholdAddress,
      emergencyContactName: emergencyContactName,
      emergencyContactRelation: emergencyContactRelation,
      emergencyContactPhone: emergencyContactPhone,
      allergies: allergies,
      dietaryRestrictions: dietaryRestrictions,
      medicalNotes: medicalNotes,
      attendanceRate: `${attendanceRate}%`,
      attendancePresent: scoutPresentCount,
      attendanceTotal: scoutTotalSessions,
      serviceHours: totalServiceHours.toFixed(1),
      rawScout: scout,
      rawParent: linkedParentDoc
    };
  });

  // Sort alphabetically by Patrol Name, then by Scout Name
  aggregatedRoster.sort((a, b) => {
    if (a.patrolName.localeCompare(b.patrolName) !== 0) {
      return a.patrolName.localeCompare(b.patrolName);
    }
    return a.fullName.localeCompare(b.fullName);
  });

  return aggregatedRoster;
}

/**
 * Generates and downloads a flat CSV spreadsheet containing every filled data column
 * for offline analysis, spreadsheet reporting, and administrative record-keeping.
 * 
 * @param {Object} params
 * @param {Array} params.rosterData Aggregated roster records
 * @param {string} [params.filename] Optional custom output filename
 */
export function exportRosterToCSV({ rosterData = [], filename = '' }) {
  if (!rosterData || rosterData.length === 0) {
    throw new Error('No roster records available to export.');
  }

  // Define exact column headers mapped to requirements
  const headers = [
    'Scout Name',
    'BSA ID',
    'Rank',
    'Patrol Name',
    'Leader Assigned',
    'Youth Position',
    'Date of Birth',
    'Grade',
    'Scout Email',
    'Scout Phone',
    'Primary Parent Name',
    'Primary Parent Relation',
    'Primary Parent Phone',
    'Primary Parent Email',
    'Secondary Parent Name',
    'Secondary Parent Relation',
    'Secondary Parent Phone',
    'Secondary Parent Email',
    'Home Address',
    'City State Zip',
    'Emergency Contact Name',
    'Emergency Relation',
    'Emergency Phone',
    'Medical/Allergy Notes',
    'Dietary Restrictions',
    'Confidential Medical Notes',
    'Attendance Rate',
    'Total Service Hours'
  ];

  // Map rows
  const rows = rosterData.map(item => [
    escapeCsvCell(item.fullName),
    escapeCsvCell(item.bsaId),
    escapeCsvCell(item.rank),
    escapeCsvCell(item.patrolName),
    escapeCsvCell(item.leaderAssigned),
    escapeCsvCell(item.youthPosition),
    escapeCsvCell(item.birthDate),
    escapeCsvCell(item.schoolGrade),
    escapeCsvCell(item.scoutEmail),
    escapeCsvCell(item.scoutPhone),
    escapeCsvCell(item.parent1Name),
    escapeCsvCell(item.parent1Relation),
    escapeCsvCell(item.parent1Phone),
    escapeCsvCell(item.parent1Email),
    escapeCsvCell(item.parent2Name),
    escapeCsvCell(item.parent2Relation),
    escapeCsvCell(item.parent2Phone),
    escapeCsvCell(item.parent2Email),
    escapeCsvCell(item.homeAddress),
    escapeCsvCell(item.cityStateZip),
    escapeCsvCell(item.emergencyContactName),
    escapeCsvCell(item.emergencyContactRelation),
    escapeCsvCell(item.emergencyContactPhone),
    escapeCsvCell(item.allergies),
    escapeCsvCell(item.dietaryRestrictions),
    escapeCsvCell(item.medicalNotes),
    escapeCsvCell(item.attendanceRate),
    escapeCsvCell(item.serviceHours)
  ]);

  // Combine headers and rows
  const csvContent = '\uFEFF' + [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `Troop_313_Roster_Export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and launches a formatted, print-optimized PDF roster window
 * organized cleanly by patrol with dual-parent contacts, emergency records, and medical notes.
 * 
 * @param {Object} params
 * @param {Array} params.rosterData Aggregated roster records
 * @param {string} [params.troopName] Troop designation title
 * @param {string} [params.scopeTitle] Scope of export (e.g. 'All Patrols (Full Troop)' or specific patrol)
 * @param {string} [params.generatedBy] Name / role of the exporting leader
 */
export function exportRosterToPrintablePDF({
  rosterData = [],
  troopName = 'Troop 313 — Dhulfiqār Scouts',
  scopeTitle = 'Full Troop Roster',
  generatedBy = 'Troop Leadership'
}) {
  if (!rosterData || rosterData.length === 0) {
    throw new Error('No roster records available to print.');
  }

  const generationDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generationTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Group scouts by Patrol
  const patrolGroups = {};
  rosterData.forEach(scout => {
    const pName = scout.patrolName || 'Unassigned Patrol';
    if (!patrolGroups[pName]) {
      patrolGroups[pName] = [];
    }
    patrolGroups[pName].push(scout);
  });

  const patrolNames = Object.keys(patrolGroups).sort();

  // Build clean HTML string
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${troopName} - ${scopeTitle}</title>
  <style>
    @page {
      margin: 12mm 12mm 12mm 12mm;
      size: letter portrait;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
      padding: 0;
    }
    .print-banner {
      background: #f8fafc;
      border-bottom: 2px solid #047857;
      padding: 14px 18px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .troop-title {
      font-size: 18px;
      font-weight: 900;
      color: #047857;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bismillah {
      font-size: 11px;
      color: #64748b;
      font-style: italic;
      margin-bottom: 3px;
    }
    .meta-box {
      text-align: right;
      font-size: 10px;
      color: #475569;
    }
    .meta-badge {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
      margin-bottom: 4px;
      font-size: 10px;
    }
    .summary-bar {
      display: flex;
      gap: 12px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 14px;
      margin: 0 18px 18px 18px;
      font-size: 10px;
    }
    .summary-item {
      display: flex;
      gap: 4px;
    }
    .summary-label {
      color: #64748b;
      font-weight: 600;
    }
    .summary-val {
      font-weight: 800;
      color: #0f172a;
    }
    .patrol-section {
      margin: 0 18px 24px 18px;
      page-break-inside: auto;
    }
    .patrol-header {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 800;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      break-after: avoid;
    }
    .scout-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .scout-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
    }
    .scout-name {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }
    .scout-badges {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-rank {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .badge-bsa {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    .badge-kpi {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .scout-grid {
      display: grid;
      grid-template-columns: 1.1fr 1.1fr 0.9fr;
      gap: 10px;
      padding: 10px 12px;
    }
    .section-box {
      background: #fafafa;
      border: 1px solid #f1f5f9;
      border-radius: 6px;
      padding: 7px 9px;
    }
    .box-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      display: flex;
      justify-content: space-between;
    }
    .field-row {
      margin-bottom: 2.5px;
      font-size: 10px;
    }
    .field-row:last-child {
      margin-bottom: 0;
    }
    .field-label {
      color: #64748b;
      font-weight: 600;
      font-size: 9px;
    }
    .field-value {
      font-weight: 600;
      color: #1e293b;
    }
    .alert-box {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 5px;
      padding: 4px 6px;
      margin-top: 4px;
    }
    .alert-title {
      font-size: 8.5px;
      font-weight: 800;
      color: #be123c;
      text-transform: uppercase;
    }
    .alert-content {
      font-size: 9.5px;
      color: #9f1239;
      font-weight: 600;
    }
    .diet-box {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 5px;
      padding: 4px 6px;
      margin-top: 4px;
    }
    .diet-title {
      font-size: 8.5px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
    }
    .diet-content {
      font-size: 9.5px;
      color: #065f46;
      font-weight: 600;
    }
    .print-footer {
      border-top: 1px solid #cbd5e1;
      margin: 20px 18px 0 18px;
      padding-top: 8px;
      font-size: 9px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-banner">
    <div>
      <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      <div class="troop-title">
        <span>⚜️ ${troopName}</span>
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #334155; margin-top: 2px;">
        Official Troop & Household Contact Roster
      </div>
    </div>
    <div class="meta-box">
      <div><span class="meta-badge">${scopeTitle}</span></div>
      <div><strong>Date:</strong> ${generationDate} at ${generationTime}</div>
      <div><strong>Generated By:</strong> ${generatedBy}</div>
      <div style="color: #be123c; font-weight: 700; font-size: 9px; margin-top: 2px;">🔒 CONFIDENTIAL — FOR LEADER USE ONLY</div>
    </div>
  </div>

  <div class="summary-bar">
    <div class="summary-item">
      <span class="summary-label">Total Scouts:</span>
      <span class="summary-val">${rosterData.length}</span>
    </div>
    <div class="summary-item" style="margin-left: 14px;">
      <span class="summary-label">Active Patrol Units:</span>
      <span class="summary-val">${patrolNames.length}</span>
    </div>
    <div class="summary-item" style="margin-left: 14px;">
      <span class="summary-label">Medical / Allergy Alerts:</span>
      <span class="summary-val">${rosterData.filter(s => s.allergies || s.medicalNotes).length} Scouts</span>
    </div>
    <div class="summary-item" style="margin-left: 14px;">
      <span class="summary-label">Special Dietary Needs:</span>
      <span class="summary-val">${rosterData.filter(s => s.dietaryRestrictions).length} Scouts</span>
    </div>
  </div>

  ${patrolNames.map(patrolName => {
    const scoutsInPatrol = patrolGroups[patrolName];
    return `
      <div class="patrol-section">
        <div class="patrol-header">
          <span>🛡️ ${patrolName}</span>
          <span style="font-size: 11px; font-weight: 600; opacity: 0.9;">${scoutsInPatrol.length} Member${scoutsInPatrol.length === 1 ? '' : 's'}</span>
        </div>

        ${scoutsInPatrol.map(scout => `
          <div class="scout-card">
            <div class="scout-card-header">
              <div class="scout-name">
                ${scout.fullName}
                ${scout.youthPosition && scout.youthPosition !== 'General Scout / Member' ? `<span style="font-size: 10px; color: #047857; font-weight: 700; margin-left: 6px;">(${scout.youthPosition})</span>` : ''}
              </div>
              <div class="scout-badges">
                ${scout.bsaId ? `<span class="badge badge-bsa">BSA #${scout.bsaId}</span>` : ''}
                <span class="badge badge-rank">⚜️ ${scout.rank}</span>
                <span class="badge badge-kpi">📅 ${scout.attendanceRate} Att.</span>
                <span class="badge badge-kpi">⭐ ${scout.serviceHours} hrs Svc</span>
              </div>
            </div>

            <div class="scout-grid">
              <!-- Column 1: Dual-Parent Household -->
              <div class="section-box">
                <div class="box-title">
                  <span>👨‍👩‍👧 Family & Guardians</span>
                </div>
                
                <!-- Parent 1 -->
                <div class="field-row">
                  <div class="field-label">${scout.parent1Relation || 'Parent 1'}:</div>
                  <div class="field-value">${scout.parent1Name || '<span style="color:#94a3b8;font-style:italic;">Not recorded</span>'}</div>
                  ${scout.parent1Phone ? `<div style="font-size: 9.5px; color:#0369a1;">📞 ${scout.parent1Phone}</div>` : ''}
                  ${scout.parent1Email ? `<div style="font-size: 9px; color:#475569;">✉️ ${scout.parent1Email}</div>` : ''}
                </div>

                <!-- Parent 2 -->
                ${scout.parent2Name ? `
                  <div class="field-row" style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">
                    <div class="field-label">${scout.parent2Relation || 'Parent 2'}:</div>
                    <div class="field-value">${scout.parent2Name}</div>
                    ${scout.parent2Phone ? `<div style="font-size: 9.5px; color:#0369a1;">📞 ${scout.parent2Phone}</div>` : ''}
                    ${scout.parent2Email ? `<div style="font-size: 9px; color:#475569;">✉️ ${scout.parent2Email}</div>` : ''}
                  </div>
                ` : ''}

                <!-- Household Address -->
                ${scout.fullHouseholdAddress ? `
                  <div class="field-row" style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">
                    <div class="field-label">Home Address:</div>
                    <div class="field-value" style="font-size: 9.5px;">📍 ${scout.fullHouseholdAddress}</div>
                  </div>
                ` : ''}
              </div>

              <!-- Column 2: Emergency & Youth Profile -->
              <div class="section-box">
                <div class="box-title">
                  <span>🚨 Emergency & Scout Info</span>
                </div>

                <div class="field-row">
                  <div class="field-label">Emergency Contact:</div>
                  <div class="field-value">${scout.emergencyContactName || '<span style="color:#94a3b8;font-style:italic;">Not specified</span>'} ${scout.emergencyContactRelation ? `(${scout.emergencyContactRelation})` : ''}</div>
                  ${scout.emergencyContactPhone ? `<div style="font-size: 9.5px; color:#b91c1c; font-weight: 700;">📞 ${scout.emergencyContactPhone}</div>` : ''}
                </div>

                <div class="field-row" style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">
                  <div class="field-label">Date of Birth / Grade:</div>
                  <div class="field-value">
                    ${scout.birthDate || 'DOB N/A'} ${scout.schoolGrade ? `• Grade ${scout.schoolGrade}` : ''}
                  </div>
                </div>

                ${scout.scoutPhone || scout.scoutEmail ? `
                  <div class="field-row" style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #e2e8f0;">
                    <div class="field-label">Direct Scout Contact:</div>
                    ${scout.scoutPhone ? `<div style="font-size: 9px; color:#334155;">📞 ${scout.scoutPhone}</div>` : ''}
                    ${scout.scoutEmail ? `<div style="font-size: 9px; color:#475569;">✉️ ${scout.scoutEmail}</div>` : ''}
                  </div>
                ` : ''}
              </div>

              <!-- Column 3: Health, Allergies & Dietary -->
              <div class="section-box">
                <div class="box-title">
                  <span>🩺 Health & Dietary</span>
                </div>

                ${scout.allergies ? `
                  <div class="alert-box">
                    <div class="alert-title">⚠️ Allergies / Alerts:</div>
                    <div class="alert-content">${scout.allergies}</div>
                  </div>
                ` : `
                  <div class="field-row">
                    <div class="field-label">Allergies:</div>
                    <div class="field-value" style="color: #64748b; font-style: italic;">None reported</div>
                  </div>
                `}

                ${scout.dietaryRestrictions ? `
                  <div class="diet-box">
                    <div class="diet-title">🥗 Dietary Needs:</div>
                    <div class="diet-content">${scout.dietaryRestrictions}</div>
                  </div>
                ` : ''}

                ${scout.medicalNotes ? `
                  <div style="margin-top: 4px; font-size: 9px; color: #475569; background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
                    <strong>Notes:</strong> ${scout.medicalNotes}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('')}

  <div class="print-footer">
    <div>${troopName} — Confidential Leadership Document</div>
    <div>Page generated on ${generationDate}</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  // Open printable window
  const printWindow = window.open('', '_blank', 'width=960,height=800,menubar=yes,toolbar=no,status=no');
  if (!printWindow) {
    throw new Error('Pop-up window blocked by browser. Please allow pop-ups for this site to print the PDF roster.');
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
