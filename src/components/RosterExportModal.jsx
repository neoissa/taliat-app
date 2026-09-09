import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { 
  X, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  HeartPulse, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronDown,
  Layers,
  Award,
  Calendar
} from 'lucide-react';
import { aggregateRosterData, exportRosterToCSV, exportRosterToPrintablePDF } from '../utils/exportRoster';

export default function RosterExportModal({ isOpen, onClose, currentUser }) {
  if (!isOpen) return null;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isLeader = isExecutive || currentUser?.role === 'leader' || currentUser?.role === 'assistant_leader';

  const [loading, setLoading] = useState(true);
  const [scoutsList, setScoutsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [serviceLogs, setServiceLogs] = useState([]);

  // Filter States
  const [selectedPatrolId, setSelectedPatrolId] = useState('all');
  const [selectedRank, setSelectedRank] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

  // 1. Real-time Listeners
  useEffect(() => {
    if (!isLeader) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setAllUsersList(users);
      setScoutsList(users.filter(u => u.role === 'scout' || (!u.role && !u.isParent && !u.isLeader && !u.isAdmin && !u.isOwner)));
    });

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived);
      setGroupsList(list);
    });

    const unsubAtt = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      setAttendanceSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubServ = onSnapshot(collection(db, 'service_logs'), (snap) => {
      setServiceLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubGroups();
      unsubAtt();
      unsubServ();
    };
  }, [isLeader]);

  // 2. Compile Full Dataset
  const [aggregatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    if (scoutsList.length === 0) {
      setAggregatedData([]);
      return;
    }

    let isMounted = true;
    aggregateRosterData({
      scouts: scoutsList,
      groups: groupsList,
      allUsers: allUsersList,
      attendanceSessions,
      serviceLogs
    }).then(data => {
      if (isMounted) {
        setAggregatedData(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [scoutsList, groupsList, allUsersList, attendanceSessions, serviceLogs]);

  // 3. Filtered Roster for View & Export
  const filteredRoster = useMemo(() => {
    return aggregatedData.filter(item => {
      if (selectedPatrolId !== 'all') {
        if (item.patrolId !== selectedPatrolId && item.rawScout?.groupId !== selectedPatrolId && item.rawScout?.patrolId !== selectedPatrolId) {
          return false;
        }
      }

      if (selectedRank !== 'all') {
        if ((item.rank || 'Scout').toLowerCase() !== selectedRank.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.fullName.toLowerCase().includes(q);
        const matchBsa = item.bsaId?.toLowerCase().includes(q);
        const matchPatrol = item.patrolName?.toLowerCase().includes(q);
        const matchParent1 = item.parent1Name?.toLowerCase().includes(q);
        const matchParent2 = item.parent2Name?.toLowerCase().includes(q);
        const matchEmergency = item.emergencyContactName?.toLowerCase().includes(q);
        if (!matchName && !matchBsa && !matchPatrol && !matchParent1 && !matchParent2 && !matchEmergency) {
          return false;
        }
      }

      return true;
    });
  }, [aggregatedData, selectedPatrolId, selectedRank, searchQuery]);

  // KPI calculations
  const totalScouts = filteredRoster.length;
  const withDualParents = filteredRoster.filter(s => s.parent1Name && s.parent2Name).length;
  const withEmergencyContacts = filteredRoster.filter(s => s.emergencyContactName && s.emergencyContactPhone).length;
  const withMedicalAlerts = filteredRoster.filter(s => s.allergies || s.medicalNotes).length;

  // Selected Scope Name
  const selectedScopeName = useMemo(() => {
    if (selectedPatrolId === 'all') return 'All Patrols (Full Troop)';
    const group = groupsList.find(g => g.id === selectedPatrolId);
    return group ? `${group.name} Patrol` : 'Selected Patrol';
  }, [selectedPatrolId, groupsList]);

  // CSV Export Handler
  const handleExportCSV = () => {
    try {
      setExportingCsv(true);
      const dateStr = new Date().toISOString().split('T')[0];
      const scopeSlug = selectedScopeName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
      const filename = `Troop_313_Roster_${scopeSlug}_${dateStr}.csv`;
      exportRosterToCSV({ rosterData: filteredRoster, filename });
      setExportSuccessMsg(`✓ Successfully exported ${filteredRoster.length} scout & household records to CSV!`);
      setTimeout(() => setExportSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error generating CSV: ' + err.message);
    } finally {
      setExportingCsv(false);
    }
  };

  // PDF Export Handler
  const handleExportPDF = () => {
    try {
      setExportingPdf(true);
      exportRosterToPrintablePDF({
        rosterData: filteredRoster,
        troopName: 'Troop 313 — Dhulfiqār Scouts',
        scopeTitle: selectedScopeName,
        generatedBy: currentUser?.fullName || currentUser?.username || 'Troop Leadership'
      });
      setExportSuccessMsg(`✓ Formatted PDF print preview launched for ${filteredRoster.length} scouts!`);
      setTimeout(() => setExportSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error generating printable PDF: ' + err.message);
    } finally {
      setExportingPdf(false);
    }
  };

  // Security Access Guard
  if (!isLeader) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
            <ShieldAlert size={24} />
          </div>
          <h3 className="text-lg font-black text-white">Access Restricted</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Troop roster exports contain sensitive dual-parent contact data, household addresses, and confidential medical records. Access is strictly restricted to authorized troop leadership.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ── MODAL HEADER ── */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-950/40">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                  Executive Command Module
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <ShieldCheck size={12} className="text-emerald-400" /> Authorized Leadership Export
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>Troop & Household Roster Export</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── TOAST NOTIFICATION ── */}
        {exportSuccessMsg && (
          <div className="px-6 py-2.5 bg-emerald-950/90 border-b border-emerald-500/40 flex items-center gap-2 text-xs font-bold text-emerald-200 animate-fadeIn">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>{exportSuccessMsg}</span>
          </div>
        )}

        {/* ── MAIN CONTENT (SCROLLABLE) ── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* 1. FILTER & EXPORT ACTIONS BAR */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Filter Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                {/* Patrol Selector */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Layers size={11} /> Export Scope / Patrol
                  </label>
                  <select
                    value={selectedPatrolId}
                    onChange={(e) => setSelectedPatrolId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">⚜️ All Patrols / Full Troop ({scoutsList.length} Scouts)</option>
                    {groupsList.map(g => (
                      <option key={g.id} value={g.id}>
                        🛡️ {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rank Filter */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Award size={11} /> Active Rank
                  </label>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Ranks</option>
                    <option value="Scout">Scout</option>
                    <option value="Tenderfoot">Tenderfoot</option>
                    <option value="Second Class">Second Class</option>
                    <option value="First Class">First Class</option>
                    <option value="Star">Star</option>
                    <option value="Life">Life</option>
                    <option value="Eagle">Eagle</option>
                  </select>
                </div>

                {/* Search Box */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Search size={11} /> Search Records
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search scout, parent, phone..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                {/* Download CSV */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={filteredRoster.length === 0 || exportingCsv}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02]"
                >
                  <Download size={15} />
                  <span>Export CSV / Excel</span>
                </button>

                {/* Print PDF */}
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={filteredRoster.length === 0 || exportingPdf}
                  className="bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-2"
                >
                  <Printer size={15} className="text-amber-400" />
                  <span>Formatted PDF Roster</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. KPI SUMMARY METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scouts in Scope</span>
              <div className="text-xl font-black text-white mt-0.5">{totalScouts}</div>
              <span className="text-[10px] text-emerald-400 font-medium">{selectedScopeName}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dual-Parent Households</span>
              <div className="text-xl font-black text-sky-400 mt-0.5">{withDualParents}</div>
              <span className="text-[10px] text-slate-400 font-medium">Both parents recorded</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Contacts</span>
              <div className="text-xl font-black text-amber-400 mt-0.5">{withEmergencyContacts}</div>
              <span className="text-[10px] text-slate-400 font-medium">Ready for outings</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health & Allergy Alerts</span>
              <div className="text-xl font-black text-red-400 mt-0.5">{withMedicalAlerts}</div>
              <span className="text-[10px] text-slate-400 font-medium">Campout catering notices</span>
            </div>
          </div>

          {/* 3. LIVE INTERACTIVE DATASET PREVIEW TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users size={14} className="text-emerald-400" />
                <span>Dataset Live Preview ({filteredRoster.length} Records)</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Columns compiled directly from Scout & Dual-Parent profiles
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs font-medium space-y-2">
                <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                <p>Compiling cross-collection roster data...</p>
              </div>
            ) : filteredRoster.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/40 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-1">
                <p className="font-bold text-slate-300">No scouts match the selected filters.</p>
                <p className="text-[11px]">Try selecting "All Patrols" or clearing your search term.</p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-inner">
                <div className="overflow-x-auto max-h-[420px] custom-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-850/90 sticky top-0 z-10 border-b border-slate-750 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="p-3">Scout Name & Rank</th>
                        <th className="p-3">Patrol & Position</th>
                        <th className="p-3">Primary Guardian (Father)</th>
                        <th className="p-3">Secondary Guardian (Mother)</th>
                        <th className="p-3">Household Address</th>
                        <th className="p-3">Emergency Contact</th>
                        <th className="p-3">Health & Allergies</th>
                        <th className="p-3 text-right">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredRoster.map((scout) => (
                        <tr key={scout.uid} className="hover:bg-slate-800/40 transition">
                          {/* Scout Name & Rank */}
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-bold text-white text-xs">{scout.fullName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                              <span className="text-amber-400 font-semibold">⚜️ {scout.rank}</span>
                              {scout.bsaId && <span>• BSA #{scout.bsaId}</span>}
                            </div>
                          </td>

                          {/* Patrol & Position */}
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-semibold text-emerald-400 text-xs">🛡️ {scout.patrolName}</div>
                            <div className="text-[10px] text-slate-400">{scout.youthPosition}</div>
                          </td>

                          {/* Primary Guardian */}
                          <td className="p-3 min-w-[180px]">
                            {scout.parent1Name ? (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-white text-xs">
                                  {scout.parent1Name} <span className="text-[10px] text-slate-400">({scout.parent1Relation})</span>
                                </div>
                                {scout.parent1Phone && (
                                  <div className="text-[11px] text-sky-400 flex items-center gap-1">
                                    <Phone size={10} /> {scout.parent1Phone}
                                  </div>
                                )}
                                {scout.parent1Email && (
                                  <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                    ✉️ {scout.parent1Email}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">Not recorded</span>
                            )}
                          </td>

                          {/* Secondary Guardian */}
                          <td className="p-3 min-w-[180px]">
                            {scout.parent2Name ? (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-white text-xs">
                                  {scout.parent2Name} <span className="text-[10px] text-slate-400">({scout.parent2Relation})</span>
                                </div>
                                {scout.parent2Phone && (
                                  <div className="text-[11px] text-sky-400 flex items-center gap-1">
                                    <Phone size={10} /> {scout.parent2Phone}
                                  </div>
                                )}
                                {scout.parent2Email && (
                                  <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                    ✉️ {scout.parent2Email}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">—</span>
                            )}
                          </td>

                          {/* Address */}
                          <td className="p-3 min-w-[160px]">
                            {scout.fullHouseholdAddress ? (
                              <div className="text-[11px] text-slate-300 leading-snug">
                                📍 {scout.fullHouseholdAddress}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">No address</span>
                            )}
                          </td>

                          {/* Emergency Contact */}
                          <td className="p-3 min-w-[150px]">
                            {scout.emergencyContactName ? (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-white text-xs">
                                  {scout.emergencyContactName}
                                  {scout.emergencyContactRelation && (
                                    <span className="text-[10px] text-amber-300 ml-1">({scout.emergencyContactRelation})</span>
                                  )}
                                </div>
                                {scout.emergencyContactPhone && (
                                  <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                                    <Phone size={10} /> {scout.emergencyContactPhone}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">None specified</span>
                            )}
                          </td>

                          {/* Health & Allergies */}
                          <td className="p-3 min-w-[150px]">
                            {scout.allergies ? (
                              <div className="text-[11px] text-red-300 font-semibold bg-red-950/50 border border-red-800/50 rounded-lg px-2 py-0.5 inline-block">
                                ⚠️ {scout.allergies}
                              </div>
                            ) : scout.dietaryRestrictions ? (
                              <div className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/50 border border-emerald-800/50 rounded-lg px-2 py-0.5 inline-block">
                                🥗 {scout.dietaryRestrictions}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">No alerts</span>
                            )}
                          </td>

                          {/* Attendance */}
                          <td className="p-3 text-right whitespace-nowrap">
                            <span className="font-bold text-white text-xs">{scout.attendanceRate}</span>
                            <div className="text-[10px] text-slate-400">{scout.serviceHours} hrs svc</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Encrypted Dual-Parent and Medical Synchronization Enabled</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredRoster.length === 0 || exportingCsv}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Download size={14} />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
