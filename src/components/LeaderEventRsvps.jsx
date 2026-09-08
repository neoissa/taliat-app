import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Utensils,
  Car,
  Phone,
  Mail,
  Printer,
  Download,
  Filter,
  Search,
  X,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { getEventAudienceInfo } from '../utils/kashafVoice';

export default function LeaderEventRsvps({ currentUser = {}, onNavigate }) {
  const isExecutive = currentUser?.role === 'executive_leader' || currentUser?.isExecutive || currentUser?.email === 'admin@taliat.org';

  // Subscriptions State
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [globalRsvps, setGlobalRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [timeFilter, setTimeFilter] = useState('upcoming'); // 'upcoming' | '7days' | 'past' | 'all'
  const [patrolFilter, setPatrolFilter] = useState('all'); // 'all' | groupId
  const [searchQuery, setSearchQuery] = useState('');

  // Attendee Roster Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rosterTab, setRosterTab] = useState('all'); // 'all' | 'attending' | 'tentative' | 'not_attending' | 'pending'
  const [rosterSearch, setRosterSearch] = useState('');
  const [overrideMsg, setOverrideMsg] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  // 1. Subscribe to Users
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    }, (err) => console.warn("LeaderEventRsvps users listener error:", err));
    return () => unsubUsers();
  }, []);

  // 2. Subscribe to Groups
  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn("LeaderEventRsvps groups listener error:", err));
    return () => unsubGroups();
  }, []);

  // 3. Subscribe to Global RSVPs
  useEffect(() => {
    const unsubRsvps = onSnapshot(collection(db, 'event_rsvps'), (snap) => {
      setGlobalRsvps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("LeaderEventRsvps rsvps listener error:", err));
    return () => unsubRsvps();
  }, []);

  // 4. Subscribe to Events
  useEffect(() => {
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEvents(list);
      setLoading(false);
    }, (err) => {
      console.error("LeaderEventRsvps events listener error:", err);
      setLoading(false);
    });
    return () => unsubEvents();
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute Scouts Roster
  const scoutsList = useMemo(() => {
    return users.filter(u => u.role === 'scout' || (!u.role && u.username && !u.isLeader));
  }, [users]);

  // Helper: compute RSVP breakdown & attendee details for an event
  const getEventAttendees = useMemo(() => {
    return (ev) => {
      if (!ev) return { attendees: [], attendingCount: 0, tentativeCount: 0, notAttendingCount: 0, pendingCount: 0, totalDrivers: 0, totalSeats: 0, dietaryAlerts: [] };

      // Determine target scouts
      let targetScouts = scoutsList;
      if (ev.targetGroupId && ev.targetGroupId !== 'all') {
        targetScouts = scoutsList.filter(s => s.groupId === ev.targetGroupId || s.patrolId === ev.targetGroupId);
      }

      // Map RSVPs for this event
      const evRsvps = globalRsvps.filter(r => r.eventId === ev.id || r.id?.startsWith(`rsvp_${ev.id}_`));
      const rsvpByScout = new Map();
      evRsvps.forEach(r => {
        const sId = r.scoutId || r.userId;
        if (sId) {
          rsvpByScout.set(sId, r);
        }
      });

      let attendingCount = 0;
      let tentativeCount = 0;
      let notAttendingCount = 0;
      let pendingCount = 0;
      let totalDrivers = 0;
      let totalSeats = 0;
      const dietaryAlerts = [];

      const attendees = targetScouts.map(scout => {
        const rsvp = rsvpByScout.get(scout.uid);
        let status = 'pending';
        let dietary = '';
        let driverAvailable = false;
        let seats = 0;
        let notes = '';
        let parentName = '';
        let parentPhone = '';
        let parentEmail = '';

        // Resolve parent information
        const parentUser = users.find(u => 
          u.role === 'parent' && 
          (u.linkedScoutIds?.includes(scout.uid) || u.scoutId === scout.uid || (u.children && u.children.includes(scout.uid)))
        );

        if (parentUser) {
          parentName = parentUser.parent1Name || parentUser.fullName || parentUser.username || '';
          parentPhone = parentUser.parent1Phone || parentUser.phone || '';
          parentEmail = parentUser.parent1Email || parentUser.email || '';
        }

        if (rsvp) {
          const rawStatus = (rsvp.status || '').toLowerCase();
          if (rawStatus === 'going' || rawStatus === 'attending' || rawStatus === 'yes') {
            status = 'attending';
            attendingCount++;
          } else if (rawStatus === 'tentative' || rawStatus === 'maybe') {
            status = 'tentative';
            tentativeCount++;
          } else if (rawStatus === 'cant_go' || rawStatus === 'not_attending' || rawStatus === 'no') {
            status = 'not_attending';
            notAttendingCount++;
          } else {
            status = 'pending';
            pendingCount++;
          }

          dietary = rsvp.dietary || '';
          driverAvailable = !!rsvp.driverAvailable;
          seats = parseInt(rsvp.seats, 10) || 0;
          notes = rsvp.notes || '';

          if (rsvp.parentName && !parentName) parentName = rsvp.parentName;
        } else {
          pendingCount++;
        }

        if (driverAvailable && seats > 0) {
          totalDrivers++;
          totalSeats += seats;
        }

        if (dietary && dietary.trim() && status === 'attending') {
          dietaryAlerts.push({
            scoutName: scout.fullName || scout.username,
            dietary: dietary.trim()
          });
        }

        const grp = groups.find(g => g.id === (scout.groupId || scout.patrolId));
        const patrolName = grp?.name || scout.patrolName || scout.patrol || 'Unassigned Patrol';

        return {
          scoutId: scout.uid,
          name: scout.fullName || scout.username || 'Scout Member',
          patrol: patrolName,
          rank: scout.rank || 'Scout',
          scoutPosition: scout.scoutPosition || '',
          status,
          dietary,
          driverAvailable,
          seats,
          notes,
          parentName,
          parentPhone,
          parentEmail,
          updatedAt: rsvp?.updatedAt || rsvp?.submittedAt || null,
          updatedByLeader: rsvp?.updatedByLeader || null
        };
      });

      return {
        attendees,
        attendingCount,
        tentativeCount,
        notAttendingCount,
        pendingCount,
        totalDrivers,
        totalSeats,
        dietaryAlerts
      };
    };
  }, [scoutsList, globalRsvps, users, groups]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      // 1. Time Horizon Filter
      const evDate = ev.date || '';
      if (timeFilter === 'upcoming') {
        if (evDate < todayStr) return false;
      } else if (timeFilter === '7days') {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        if (evDate < todayStr || evDate > nextWeekStr) return false;
      } else if (timeFilter === 'past') {
        if (evDate >= todayStr) return false;
      }

      // 2. Patrol Filter
      if (patrolFilter !== 'all') {
        if (ev.targetGroupId !== 'all' && ev.targetGroupId !== patrolFilter) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (ev.title || '').toLowerCase().includes(q);
        const locMatch = (ev.location || '').toLowerCase().includes(q);
        const descMatch = (ev.description || '').toLowerCase().includes(q);
        const dateMatch = (ev.date || '').includes(q);
        if (!titleMatch && !locMatch && !descMatch && !dateMatch) return false;
      }

      return true;
    });
  }, [events, timeFilter, patrolFilter, searchQuery, todayStr]);

  // High-level KPI aggregates
  const globalKpis = useMemo(() => {
    const upcoming = events.filter(e => (e.date || '') >= todayStr);
    let totalConfirmed = 0;
    let totalCapacity = 0;
    let totalDriverSeats = 0;

    upcoming.forEach(ev => {
      const data = getEventAttendees(ev);
      totalConfirmed += data.attendingCount;
      totalCapacity += (data.attendees.length || 0);
      totalDriverSeats += data.totalSeats;
    });

    const avgRate = totalCapacity > 0 ? Math.round((totalConfirmed / totalCapacity) * 100) : 0;

    return {
      upcomingEventsCount: upcoming.length,
      totalConfirmedRsvps: totalConfirmed,
      avgAttendanceRate: avgRate,
      totalDriverSeats
    };
  }, [events, todayStr, getEventAttendees]);

  // Leader Override Action
  const handleLeaderOverride = async (eventId, attendee, newStatus) => {
    if (!eventId || !attendee) return;
    setIsOverriding(true);
    setOverrideMsg('');

    try {
      const rsvpDocId = `rsvp_${eventId}_${attendee.scoutId}`;
      const payload = {
        eventId,
        scoutId: attendee.scoutId,
        scoutName: attendee.name,
        status: newStatus, // 'going' | 'tentative' | 'cant_go'
        updatedByLeader: currentUser?.fullName || currentUser?.username || 'Executive Leader',
        updatedAt: new Date().toISOString()
      };

      // Write to global event_rsvps collection
      await setDoc(doc(db, 'event_rsvps', rsvpDocId), payload, { merge: true });

      // Write to event subcollection
      await setDoc(doc(db, 'events', eventId, 'rsvps', attendee.scoutId), payload, { merge: true });

      setOverrideMsg(`✓ Status updated to ${newStatus.toUpperCase()} for ${attendee.name}`);
      setTimeout(() => setOverrideMsg(''), 3000);
    } catch (err) {
      console.error("Leader RSVP override failed:", err);
      alert("Failed to update status: " + err.message);
    } finally {
      setIsOverriding(false);
    }
  };

  // CSV Export for Attendee Roster
  const handleExportRosterCsv = (eventObj, attendeesList) => {
    if (!eventObj || !attendeesList || attendeesList.length === 0) return;

    const headers = [
      'Scout Name',
      'Patrol',
      'BSA Rank',
      'Position',
      'RSVP Status',
      'Parent / Guardian',
      'Parent Phone',
      'Parent Email',
      'Dietary Restrictions',
      'Carpool Driver',
      'Seats Offered',
      'Notes',
      'Last Updated'
    ];

    const rows = attendeesList.map(a => [
      `"${a.name}"`,
      `"${a.patrol}"`,
      `"${a.rank}"`,
      `"${a.scoutPosition || 'Scout'}"`,
      `"${a.status.toUpperCase()}"`,
      `"${a.parentName || ''}"`,
      `"${a.parentPhone || ''}"`,
      `"${a.parentEmail || ''}"`,
      `"${(a.dietary || '').replace(/"/g, '""')}"`,
      `"${a.driverAvailable ? 'Yes' : 'No'}"`,
      `"${a.seats || 0}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${a.updatedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RSVP_Roster_${eventObj.title.replace(/[^a-zA-Z0-9]/g, '_')}_${eventObj.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Roster
  const handlePrintRoster = (eventObj, attendeesList) => {
    if (!eventObj) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print the roster.");
      return;
    }

    const data = getEventAttendees(eventObj);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>RSVP Attendee Roster - ${eventObj.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; }
          h1 { margin: 0 0 4px 0; font-size: 20px; }
          .sub { color: #555; font-size: 12px; margin-bottom: 16px; }
          .meta-box { background: #f3f4f6; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
          th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
          th { background: #e5e7eb; font-weight: bold; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          .going { background: #d1fae5; color: #065f46; }
          .tentative { background: #fef3c7; color: #92400e; }
          .declined { background: #fee2e2; color: #991b1b; }
          .pending { background: #f3f4f6; color: #4b5563; }
          .check-col { width: 28px; text-align: center; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${eventObj.title}</h1>
        <div class="sub">Troop 110 &bull; Official RSVP Check-in Roster &bull; Date: ${eventObj.date} &bull; Time: ${eventObj.time || 'TBD'}</div>
        
        <div class="meta-box">
          <div><strong>Location:</strong> ${eventObj.location || 'Troop HQ'}</div>
          <div><strong>Total Headcount:</strong> ${data.attendingCount} Confirmed / ${data.attendees.length} Total</div>
          <div><strong>Carpool Seats:</strong> ${data.totalSeats} seats (${data.totalDrivers} drivers)</div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="check-col">✓</th>
              <th>Scout Name</th>
              <th>Patrol</th>
              <th>Rank</th>
              <th>Status</th>
              <th>Parent Contact</th>
              <th>Dietary / Notes</th>
              <th>Carpool</th>
            </tr>
          </thead>
          <tbody>
            ${attendeesList.map(a => `
              <tr>
                <td class="check-col"></td>
                <td><strong>${a.name}</strong></td>
                <td>${a.patrol}</td>
                <td>${a.rank}</td>
                <td><span class="badge ${a.status}">${a.status === 'attending' ? 'GOING' : a.status === 'tentative' ? 'TENTATIVE' : a.status === 'not_attending' ? 'DECLINED' : 'NO RESPONSE'}</span></td>
                <td>${a.parentName ? `${a.parentName} (${a.parentPhone || 'No tel'})` : '—'}</td>
                <td>${a.dietary || a.notes || '—'}</td>
                <td>${a.driverAvailable ? `🚗 ${a.seats} seats` : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const selectedEventAttendeeData = useMemo(() => {
    if (!selectedEvent) return null;
    return getEventAttendees(selectedEvent);
  }, [selectedEvent, getEventAttendees]);

  return (
    <div className="space-y-6">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-755 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
            <Users size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                Leader Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Sync</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Event RSVPs & Confirmed Attendee Monitor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track live headcount, confirmed scout attendance, parent responses, volunteer carpool capacity, and dietary restrictions across all scheduled troop sessions.
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border border-slate-700 shrink-0 cursor-pointer self-start md:self-center shadow-md"
          >
            <Calendar size={14} className="text-emerald-400" />
            <span>Open Events Manager</span>
          </button>
        )}
      </div>

      {/* ── TOP KPI SUMMARY TILES ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Upcoming Sessions
          </span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-white font-mono">{globalKpis.upcomingEventsCount}</strong>
            <span className="text-xs text-emerald-400 font-bold">Scheduled</span>
          </div>
        </div>

        <div className="bg-slate-850 border border-emerald-500/40 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
            Confirmed RSVPs
          </span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-emerald-300 font-mono">{globalKpis.totalConfirmedRsvps}</strong>
            <span className="text-xs text-slate-400">Scouts Going</span>
          </div>
        </div>

        <div className="bg-slate-850 border border-teal-500/40 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
            Avg Attendance Rate
          </span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-teal-300 font-mono">{globalKpis.avgAttendanceRate}%</strong>
            <span className="text-xs text-slate-400">Troop-Wide</span>
          </div>
        </div>

        <div className="bg-slate-850 border border-amber-500/40 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
            Volunteer Carpools
          </span>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-amber-300 font-mono">{globalKpis.totalDriverSeats}</strong>
            <span className="text-xs text-slate-400">Seats Offered</span>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH TOOLBAR ── */}
      <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Time Horizon Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'upcoming', label: 'Upcoming Events' },
            { id: '7days', label: 'Next 7 Days' },
            { id: 'past', label: 'Past Events' },
            { id: 'all', label: 'All Sessions' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTimeFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                timeFilter === f.id
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-755 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Patrol Dropdown & Search */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <select
            value={patrolFilter}
            onChange={(e) => setPatrolFilter(e.target.value)}
            className="bg-slate-900 border border-slate-755 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Patrols / Troop-Wide</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <div className="relative w-full md:w-56">
            <Search className="absolute left-3 top-2 text-slate-500" size={13} />
            <input
              type="text"
              placeholder="Search event or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-755 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── EVENT CARDS GRID ── */}
      {filteredEvents.length === 0 ? (
        <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center space-y-2 text-slate-400">
          <Calendar size={36} className="mx-auto text-slate-500 opacity-60" />
          <h4 className="text-sm font-bold text-white">No Events Found</h4>
          <p className="text-xs max-w-sm mx-auto">
            {timeFilter === 'past' 
              ? 'No past events match your current filter.'
              : 'No scheduled events match your search query.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map(ev => {
            const data = getEventAttendees(ev);
            const isPast = (ev.date || '') < todayStr;
            const aud = getEventAudienceInfo(ev, currentUser, groups, []);

            return (
              <div 
                key={ev.id}
                className={`border rounded-3xl p-5 sm:p-6 transition shadow-lg space-y-4 flex flex-col justify-between ${
                  isPast
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-slate-850 border-slate-755 hover:border-emerald-500/50'
                }`}
              >
                {/* Event Top Meta */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isPast
                          ? 'text-purple-300 bg-purple-950/60 border-purple-500/30'
                          : 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30'
                      }`}>
                        📅 {ev.date}
                      </span>
                      {ev.time && (
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-755">
                          ⏰ {ev.time}
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${aud.colorClass || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {aud.badge || 'Troop'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug">
                    {ev.title}
                  </h3>

                  {ev.location && (
                    <p className="text-xs text-emerald-300 flex items-center gap-1.5 font-medium truncate">
                      <MapPin size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  )}
                </div>

                {/* Live RSVP Metric Breakdown Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                    <div className="bg-emerald-950/80 border border-emerald-500/40 p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-black tracking-wider text-emerald-400 block">Going</span>
                      <strong className="text-sm font-black text-emerald-200 font-mono">{data.attendingCount}</strong>
                    </div>

                    <div className="bg-amber-950/80 border border-amber-500/40 p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-black tracking-wider text-amber-400 block">Maybe</span>
                      <strong className="text-sm font-black text-amber-200 font-mono">{data.tentativeCount}</strong>
                    </div>

                    <div className="bg-slate-900 border border-slate-755 p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Declined</span>
                      <strong className="text-sm font-black text-slate-300 font-mono">{data.notAttendingCount}</strong>
                    </div>

                    <div className="bg-sky-950/80 border border-sky-500/30 p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-black tracking-wider text-sky-400 block">Pending</span>
                      <strong className="text-sm font-black text-sky-200 font-mono">{data.pendingCount}</strong>
                    </div>
                  </div>

                  {/* Highlights Bar: Carpool Seats & Dietary Alerts */}
                  <div className="flex items-center justify-between gap-2 text-xs flex-wrap pt-1">
                    {data.totalSeats > 0 ? (
                      <span className="text-[11px] text-teal-300 bg-teal-950/60 border border-teal-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                        <Car size={11} className="text-teal-400" />
                        <span>{data.totalSeats} seats offered ({data.totalDrivers} drivers)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">No carpools offered</span>
                    )}

                    {data.dietaryAlerts.length > 0 && (
                      <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-bold">
                        <Utensils size={11} className="text-amber-400" />
                        <span>{data.dietaryAlerts.length} Dietary Note{data.dietaryAlerts.length > 1 ? 's' : ''}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleExportRosterCsv(ev, data.attendees)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-755 transition cursor-pointer"
                      title="Export Roster CSV"
                    >
                      <Download size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrintRoster(ev, data.attendees)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-755 transition cursor-pointer"
                      title="Print Check-in Roster"
                    >
                      <Printer size={13} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEvent(ev);
                      setRosterTab('all');
                      setRosterSearch('');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                  >
                    <span>View Attendee Roster</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ATTENDEE ROSTER MODAL ── */}
      {selectedEvent && selectedEventAttendeeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    RSVP & Attendance Roster
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    📅 {selectedEvent.date} &bull; ⏰ {selectedEvent.time || 'TBD'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white truncate">
                  {selectedEvent.title}
                </h3>
                {selectedEvent.location && (
                  <p className="text-xs text-emerald-300 flex items-center gap-1 truncate">
                    <MapPin size={12} />
                    <span>{selectedEvent.location}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => handleExportRosterCsv(selectedEvent, selectedEventAttendeeData.attendees)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintRoster(selectedEvent, selectedEventAttendeeData.attendees)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Leader Override Feedback Banner */}
              {overrideMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-xs font-bold text-emerald-300 animate-fadeIn flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{overrideMsg}</span>
                </div>
              )}

              {/* Live Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40 text-center">
                  <span className="text-[10px] uppercase font-black text-emerald-400 block">✓ Confirmed</span>
                  <strong className="text-lg font-black text-emerald-300 font-mono">
                    {selectedEventAttendeeData.attendingCount}
                  </strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/40 text-center">
                  <span className="text-[10px] uppercase font-black text-amber-400 block">❓ Tentative</span>
                  <strong className="text-lg font-black text-amber-300 font-mono">
                    {selectedEventAttendeeData.tentativeCount}
                  </strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-755 text-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 block">✗ Declined</span>
                  <strong className="text-lg font-black text-slate-300 font-mono">
                    {selectedEventAttendeeData.notAttendingCount}
                  </strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/30 text-center">
                  <span className="text-[10px] uppercase font-black text-sky-400 block">⏳ No Response</span>
                  <strong className="text-lg font-black text-sky-300 font-mono">
                    {selectedEventAttendeeData.pendingCount}
                  </strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-teal-500/40 text-center">
                  <span className="text-[10px] uppercase font-black text-teal-400 block">🚗 Carpool Seats</span>
                  <strong className="text-lg font-black text-teal-300 font-mono">
                    {selectedEventAttendeeData.totalSeats}
                  </strong>
                </div>
              </div>

              {/* Dietary Alerts Banner */}
              {selectedEventAttendeeData.dietaryAlerts.length > 0 && (
                <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-2xl text-xs space-y-1.5">
                  <strong className="text-amber-400 uppercase text-[10px] font-black flex items-center gap-1.5">
                    <Utensils size={13} />
                    <span>Special Dietary Restrictions & Allergies ({selectedEventAttendeeData.dietaryAlerts.length}):</span>
                  </strong>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedEventAttendeeData.dietaryAlerts.map((d, idx) => (
                      <span key={idx} className="bg-slate-900 border border-amber-500/30 text-slate-200 px-2.5 py-1 rounded-xl text-[11px]">
                        <strong className="text-amber-300">{d.scoutName}:</strong> {d.dietary}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Filters & Search in Modal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: `All (${selectedEventAttendeeData.attendees.length})` },
                    { id: 'attending', label: `✓ Going (${selectedEventAttendeeData.attendingCount})` },
                    { id: 'tentative', label: `❓ Maybe (${selectedEventAttendeeData.tentativeCount})` },
                    { id: 'not_attending', label: `✗ Declined (${selectedEventAttendeeData.notAttendingCount})` },
                    { id: 'pending', label: `⏳ Pending (${selectedEventAttendeeData.pendingCount})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRosterTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                        rosterTab === tab.id
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={13} />
                  <input
                    type="text"
                    placeholder="Search scout, patrol..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-755 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Attendees List */}
              {(() => {
                const list = selectedEventAttendeeData.attendees.filter(a => {
                  if (rosterTab !== 'all' && a.status !== rosterTab) return false;
                  if (rosterSearch.trim()) {
                    const q = rosterSearch.toLowerCase();
                    return a.name.toLowerCase().includes(q) || a.patrol.toLowerCase().includes(q) || (a.parentName || '').toLowerCase().includes(q) || (a.notes || '').toLowerCase().includes(q);
                  }
                  return true;
                });

                if (list.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950/60 rounded-2xl border border-slate-800">
                      No attendees match the current filter.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    {list.map(att => {
                      const isGoing = att.status === 'attending';
                      const isTentative = att.status === 'tentative';
                      const isDeclined = att.status === 'not_attending';
                      const isPending = att.status === 'pending';

                      return (
                        <div
                          key={att.scoutId}
                          className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                            isGoing
                              ? 'bg-emerald-950/20 border-emerald-500/35 hover:border-emerald-400'
                              : isTentative
                              ? 'bg-amber-950/20 border-amber-500/35 hover:border-amber-400'
                              : isDeclined
                              ? 'bg-slate-950/80 border-slate-800 opacity-70'
                              : 'bg-slate-950/50 border-slate-800'
                          }`}
                        >
                          {/* Scout & Parent Info */}
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-sm font-black text-white">
                                {att.name}
                              </strong>
                              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.2 rounded-full">
                                {att.patrol}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-bold">
                                {att.rank}
                              </span>
                              {att.scoutPosition && (
                                <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.2 rounded-full font-bold">
                                  {att.scoutPosition}
                                </span>
                              )}
                            </div>

                            {/* Parent Details */}
                            <div className="flex items-center gap-3 text-[11px] text-slate-300 flex-wrap">
                              {att.parentName ? (
                                <span>Parent: <strong className="text-white">{att.parentName}</strong></span>
                              ) : (
                                <span className="text-slate-500 italic">No parent profile linked</span>
                              )}

                              {att.parentPhone && (
                                <a href={`tel:${att.parentPhone}`} className="text-emerald-400 hover:underline flex items-center gap-1 font-mono">
                                  <Phone size={10} /> {att.parentPhone}
                                </a>
                              )}

                              {att.parentEmail && (
                                <a href={`mailto:${att.parentEmail}`} className="text-teal-400 hover:underline flex items-center gap-1">
                                  <Mail size={10} /> {att.parentEmail}
                                </a>
                              )}
                            </div>

                            {/* Dietary / Carpool / Notes badges */}
                            <div className="flex items-center gap-2 flex-wrap pt-0.5">
                              {att.dietary && (
                                <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold">
                                  <Utensils size={10} /> {att.dietary}
                                </span>
                              )}

                              {att.driverAvailable && (
                                <span className="text-[10px] bg-teal-950/80 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold">
                                  <Car size={10} /> Driver ({att.seats} seats)
                                </span>
                              )}

                              {att.notes && (
                                <span className="text-[10px] text-slate-400 italic">
                                  Note: "{att.notes}"
                                </span>
                              )}

                              {att.updatedByLeader && (
                                <span className="text-[9px] text-slate-500 bg-slate-900 border border-slate-755 px-1.5 py-0.5 rounded">
                                  Leader Set: {att.updatedByLeader}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Leader Override Control Group */}
                          <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center">
                            <button
                              type="button"
                              disabled={isOverriding}
                              onClick={() => handleLeaderOverride(selectedEvent.id, att, 'going')}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                isGoing
                                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border-slate-755'
                              }`}
                              title="Mark as Going"
                            >
                              <Check size={12} />
                              <span>Going</span>
                            </button>

                            <button
                              type="button"
                              disabled={isOverriding}
                              onClick={() => handleLeaderOverride(selectedEvent.id, att, 'tentative')}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                isTentative
                                  ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border-slate-755'
                              }`}
                              title="Mark as Tentative"
                            >
                              <HelpCircle size={12} />
                              <span>Maybe</span>
                            </button>

                            <button
                              type="button"
                              disabled={isOverriding}
                              onClick={() => handleLeaderOverride(selectedEvent.id, att, 'cant_go')}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                isDeclined
                                  ? 'bg-red-600 text-white border-red-400 shadow-md'
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-300 border-slate-755'
                              }`}
                              title="Mark as Declined"
                            >
                              <X size={12} />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
