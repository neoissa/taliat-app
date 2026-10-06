import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  Send, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Video, 
  Phone, 
  Compass, 
  FileText,
  Sparkles
} from 'lucide-react';
import { createLeaderInitiatedMeeting } from '../services/parentRequestService';
import { 
  isSuperUser, 
  getAccessiblePatrols, 
  isScoutInPatrol, 
  filterScoutsForUser 
} from '../utils/patrolScoping';
import { resolveNextScheduledDays, checkAutoLoadedCalendar } from '../utils/calendarDateUtils';

const TOPIC_PRESETS = [
  { id: 'scoutmaster_conf', label: 'Scoutmaster Conference', defaultDuration: '30 mins', desc: 'Advancement review and character check-in' },
  { id: 'board_of_review', label: 'Board of Review Prep', defaultDuration: '30 mins', desc: 'Preparation for upcoming committee board of review' },
  { id: 'rank_advancement', label: 'Rank Advancement & Milestone Review', defaultDuration: '30 mins', desc: 'Progress tracking on current and next rank requirements' },
  { id: 'merit_badge', label: 'Merit Badge Progress & Sign-off', defaultDuration: '30 mins', desc: 'Reviewing active merit badges and counselor sign-offs' },
  { id: 'patrol_briefing', label: 'Patrol Parent Briefing & Orientation', defaultDuration: '45 mins', desc: 'Patrol-wide updates, expectations, and upcoming programs' },
  { id: 'camp_logistics', label: 'Camp & Outdoor Logistics Briefing', defaultDuration: '45 mins', desc: 'Packing lists, gear check, itinerary, and safety' },
  { id: 'behavior_support', label: 'Youth Support & Special Accommodation', defaultDuration: '30 mins', desc: 'Personalized attention, learning plans, and behavior support' },
  { id: 'general_checkin', label: 'General Parent Check-in', defaultDuration: '20 mins', desc: 'General questions and parent feedback' },
  { id: 'custom', label: 'Custom Agenda', defaultDuration: '30 mins', desc: 'Custom topic specified by leadership' }
];

const TIME_PRESETS = [
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
];

const DURATION_PRESETS = [
  '15 mins', '20 mins', '30 mins', '45 mins', '1 hour', '1.5 hours'
];

const VENUE_PRESETS = [
  { label: 'Troop Headquarters (Highview Elementary School)', type: 'physical' },
  { label: 'Google Meet / Zoom Video Call', type: 'virtual' },
  { label: 'Direct Phone Conference Call', type: 'phone' },
  { label: 'Camp Agawam / Outdoor Site', type: 'physical' },
  { label: 'Custom Location', type: 'custom' }
];

export default function ScheduleParentMeetingModal({
  isOpen,
  onClose,
  currentUser = {},
  initialScout = null,
  initialPatrolId = null,
  initialTargetType = 'single_parent',
  onMeetingScheduled = null
}) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const leaderName = currentUser?.fullName || currentUser?.username || 'Troop Leader';
  const leaderRole = currentUser?.leaderPosition || (isOwner ? 'Owner / Scoutmaster' : currentUser?.role || 'Leader');

  // Directory Data
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingDirectory, setLoadingDirectory] = useState(true);

  // Form State
  const [targetType, setTargetType] = useState(initialTargetType || 'single_parent'); // 'single_parent' | 'patrol_parents' | 'all_unit'
  const [selectedScoutId, setSelectedScoutId] = useState(initialScout?.uid || initialScout?.id || '');
  const [selectedPatrolId, setSelectedPatrolId] = useState(initialPatrolId || initialScout?.groupId || initialScout?.patrolId || '');
  
  // Custom single parent overrides
  const [customParentName, setCustomParentName] = useState('');
  const [customParentEmail, setCustomParentEmail] = useState('');
  const [customParentPhone, setCustomParentPhone] = useState('');

  // Meeting Details
  const [selectedTopicId, setSelectedTopicId] = useState('scoutmaster_conf');
  const [meetingTitle, setMeetingTitle] = useState('Scoutmaster Conference');
  const [customTopicTitle, setCustomTopicTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [meetingTime, setMeetingTime] = useState('6:30 PM');
  const [meetingDuration, setMeetingDuration] = useState('30 mins');
  const [venueType, setVenueType] = useState(VENUE_PRESETS[0].label);
  const [customVenueDetails, setCustomVenueDetails] = useState('');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [leaderNotes, setLeaderNotes] = useState('');
  const [rsvpRequired, setRsvpRequired] = useState(true);

  // Auto-loaded calendar checks for conferences
  const nextScheduledDays = useMemo(() => {
    return resolveNextScheduledDays();
  }, []);

  const calendarCheckForParentMeeting = useMemo(() => {
    return checkAutoLoadedCalendar(meetingDate);
  }, [meetingDate]);

  // Predefined selector that automatically populates the title
  const handleSelectPreset = (preset) => {
    setSelectedTopicId(preset.id);
    if (preset.id !== 'custom') {
      setMeetingTitle(preset.label);
    } else {
      setMeetingTitle('');
    }
    if (preset.defaultDuration) {
      setMeetingDuration(preset.defaultDuration);
    }
  };

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch Users & Groups
  useEffect(() => {
    if (!isOpen) return;
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      setLoadingDirectory(false);
    });

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });

    return () => {
      unsubUsers();
      unsubGroups();
    };
  }, [isOpen]);

  // Handle Initial Props Sync
  useEffect(() => {
    if (initialScout) {
      setSelectedScoutId(initialScout.uid || initialScout.id || '');
      setTargetType('single_parent');
      if (initialScout.groupId || initialScout.patrolId) {
        setSelectedPatrolId(initialScout.groupId || initialScout.patrolId);
      }
    } else if (initialPatrolId) {
      setSelectedPatrolId(initialPatrolId);
      setTargetType('patrol_parents');
    } else if (initialTargetType) {
      setTargetType(initialTargetType);
    }
  }, [initialScout, initialPatrolId, initialTargetType, isOpen]);

  // Derived Lists
  const allScouts = useMemo(() => {
    return users.filter(u => u.role === 'scout');
  }, [users]);

  const allParents = useMemo(() => {
    return users.filter(u => u.role === 'parent');
  }, [users]);

  // Patrol scoping
  const accessiblePatrols = useMemo(() => getAccessiblePatrols(currentUser, groups), [currentUser, groups]);
  const accessibleScouts = useMemo(() => filterScoutsForUser(allScouts, currentUser, groups, 'all'), [allScouts, currentUser, groups]);

  // Selected Scout Details
  const currentScout = useMemo(() => {
    return allScouts.find(s => s.uid === selectedScoutId) || null;
  }, [allScouts, selectedScoutId]);

  // Linked Parent for Selected Scout
  const resolvedParent = useMemo(() => {
    if (!currentScout) return null;
    
    // Check parentUids array
    if (Array.isArray(currentScout.parentUids) && currentScout.parentUids.length > 0) {
      const p = allParents.find(par => currentScout.parentUids.includes(par.uid));
      if (p) return p;
    }

    // Check linkedScoutIds in parent docs
    const byLink = allParents.find(p => Array.isArray(p.linkedScoutIds) && p.linkedScoutIds.includes(currentScout.uid));
    if (byLink) return byLink;

    // Check email match
    if (currentScout.parentEmail) {
      const byEmail = allParents.find(p => p.email && p.email.toLowerCase().trim() === currentScout.parentEmail.toLowerCase().trim());
      if (byEmail) return byEmail;
    }

    return null;
  }, [currentScout, allParents]);

  // Resolved Targeted Parents List for Patrol or Unit
  const targetedParentsList = useMemo(() => {
    if (targetType === 'single_parent') {
      if (!currentScout) return [];
      return [{
        scoutId: currentScout.uid,
        scoutName: currentScout.fullName || currentScout.username,
        patrolId: currentScout.groupId || currentScout.patrolId,
        patrolName: currentScout.patrolName || groups.find(g => g.id === (currentScout.groupId || currentScout.patrolId))?.name || 'Patrol',
        parentUid: resolvedParent?.uid || null,
        parentName: customParentName || resolvedParent?.fullName || currentScout.parentName || 'Parent / Guardian',
        parentEmail: customParentEmail || resolvedParent?.email || currentScout.parentEmail || null,
        parentPhone: customParentPhone || resolvedParent?.phone || currentScout.parentPhone || null
      }];
    }

    // Patrol or Unit Scope
    let scoutsInScope = accessibleScouts;
    if (targetType === 'patrol_parents' && selectedPatrolId) {
      scoutsInScope = allScouts.filter(s => isScoutInPatrol(s, selectedPatrolId, groups));
    }

    const uniqueParentsMap = new Map();

    scoutsInScope.forEach(scout => {
      const pParent = allParents.find(p => 
        (Array.isArray(scout.parentUids) && scout.parentUids.includes(p.uid)) ||
        (Array.isArray(p.linkedScoutIds) && p.linkedScoutIds.includes(scout.uid)) ||
        (scout.parentEmail && p.email && p.email.toLowerCase().trim() === scout.parentEmail.toLowerCase().trim())
      );

      const parentUid = pParent?.uid || null;
      const parentEmail = pParent?.email || scout.parentEmail || null;
      const parentPhone = pParent?.phone || scout.parentPhone || null;
      const parentName = pParent?.fullName || scout.parentName || `Parent of ${scout.fullName || scout.username}`;
      const patrolName = scout.patrolName || groups.find(g => g.id === (scout.groupId || scout.patrolId))?.name || 'Troop 1318';

      const key = parentUid || parentEmail || parentPhone || scout.uid;

      if (!uniqueParentsMap.has(key)) {
        uniqueParentsMap.set(key, {
          parentUid,
          parentName,
          parentEmail,
          parentPhone,
          scoutId: scout.uid,
          scoutName: scout.fullName || scout.username,
          patrolId: scout.groupId || scout.patrolId || selectedPatrolId,
          patrolName
        });
      }
    });

    return Array.from(uniqueParentsMap.values());
  }, [targetType, currentScout, resolvedParent, customParentName, customParentEmail, customParentPhone, allScouts, allParents, selectedPatrolId, groups]);

  // Selected Topic Details
  const topicTitle = useMemo(() => {
    if (selectedTopicId === 'custom') {
      return customTopicTitle.trim() || 'Leadership Parent Conference';
    }
    const t = TOPIC_PRESETS.find(item => item.id === selectedTopicId);
    return t ? t.label : 'Scoutmaster Conference';
  }, [selectedTopicId, customTopicTitle]);

  // Auto-generate Default Agenda on topic or target change
  useEffect(() => {
    if (meetingAgenda) return;

    let scopeLabel = 'your scout';
    if (targetType === 'single_parent' && currentScout) {
      scopeLabel = currentScout.fullName || currentScout.username;
    } else if (targetType === 'patrol_parents') {
      const pName = groups.find(g => g.id === selectedPatrolId)?.name || 'the patrol';
      scopeLabel = `${pName} Patrol youth`;
    } else if (targetType === 'all_unit') {
      scopeLabel = 'our Troop & Pack members';
    }

    const defaultText = `Assalāmu ʿAlaykum!\n\nLeader ${leaderName} (${leaderRole}) would like to invite you to a ${topicTitle} regarding ${scopeLabel}.\n\nAgenda:\n1. Unit updates and upcoming schedule\n2. Advancement and milestone review\n3. Parent Q&A and support`;

    setMeetingAgenda(defaultText);
  }, [selectedTopicId, targetType, currentScout, selectedPatrolId, groups, leaderName, leaderRole, topicTitle]);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (targetType === 'single_parent' && !selectedScoutId) {
      setErrorMsg('Please select a scout for this 1-on-1 parent conference.');
      return;
    }

    if (targetType === 'patrol_parents' && !selectedPatrolId) {
      setErrorMsg('Please select a patrol to dispatch parent meeting invitations.');
      return;
    }

    if (!meetingDate) {
      setErrorMsg('Please select a meeting date.');
      return;
    }

    setSubmitting(true);

    try {
      const finalLocation = venueType === 'Custom Location' 
        ? (customVenueDetails.trim() || 'Troop Headquarters')
        : venueType;

      const pPatrolName = targetType === 'patrol_parents'
        ? (groups.find(g => g.id === selectedPatrolId)?.name ? `${groups.find(g => g.id === selectedPatrolId)?.name} Patrol` : 'Troop 1318')
        : (currentScout?.patrolName || 'Troop 1318');

      const result = await createLeaderInitiatedMeeting({
        leaderUid: currentUser?.uid,
        leaderName,
        leaderRole,
        targetType,
        scoutId: targetType === 'single_parent' ? currentScout?.uid : null,
        scoutName: targetType === 'single_parent' ? (currentScout?.fullName || currentScout?.username) : `All ${pPatrolName} Scouts`,
        parentUid: targetType === 'single_parent' ? (resolvedParent?.uid || null) : null,
        parentName: targetType === 'single_parent' ? (customParentName || resolvedParent?.fullName || currentScout?.parentName || 'Parent') : 'Patrol Parents',
        parentEmail: targetType === 'single_parent' ? (customParentEmail || resolvedParent?.email || currentScout?.parentEmail || null) : null,
        parentPhone: targetType === 'single_parent' ? (customParentPhone || resolvedParent?.phone || currentScout?.parentPhone || null) : null,
        patrolId: selectedPatrolId || currentScout?.groupId || currentScout?.patrolId || null,
        patrolName: pPatrolName,
        meetingDate,
        meetingTime,
        meetingDuration,
        meetingLocation: finalLocation,
        meetingTopic: meetingTitle || topicTitle,
        meetingAgenda: meetingAgenda.trim(),
        leaderNotes: leaderNotes.trim(),
        rsvpRequired,
        targetedParents: targetedParentsList
      });

      setSuccessMsg(`✓ Successfully scheduled and dispatched invitations to ${result.count || 1} parent account(s)!`);

      if (onMeetingScheduled) {
        onMeetingScheduled(result);
      }

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Meeting dispatch error:", err);
      setErrorMsg(err.message || 'Failed to dispatch meeting invitations.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        
        {/* ── HEADER ── */}
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Schedule Meeting
              </h3>
              <p className="text-[11px] text-slate-400">
                {leaderName} &bull; {leaderRole}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── BODY (Scrollable) ── */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Success Banner */}
          {successMsg && (
            <div className="bg-sky-950/80 border border-sky-500/40 text-sky-200 p-3 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-sky-400 shrink-0" />
              <div className="text-xs font-bold">{successMsg}</div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-500/60 text-red-200 p-3 rounded-xl flex items-center gap-2.5">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <div className="text-xs font-semibold">{errorMsg}</div>
            </div>
          )}

          {/* ── AUDIENCE SELECTOR ── */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block">
              Meeting Audience:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single_parent', label: '1-on-1 Parent' },
                { id: 'patrol_parents', label: 'Patrol Parents' },
                { id: 'all_unit', label: 'All Parents' }
              ].map(mode => {
                const isSel = targetType === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTargetType(mode.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer text-center border ${
                      isSel
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient Dropdown */}
          {targetType === 'single_parent' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300">
                Select Scout:
              </label>
              <select
                value={selectedScoutId}
                onChange={(e) => setSelectedScoutId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                required
              >
                <option value="">-- Choose Scout from Roster --</option>
                {accessibleScouts.map(scout => (
                  <option key={scout.uid} value={scout.uid}>
                    {scout.fullName || scout.username} ({scout.patrolName || 'Patrol'}) &bull; Rank: {scout.rank || 'Scout'}
                  </option>
                ))}
              </select>
              {currentScout && (
                <div className="text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center justify-between">
                  <span>Parent: <strong className="text-white">{resolvedParent?.fullName || currentScout.parentName || 'Parent / Guardian'}</strong></span>
                  <span className="text-sky-300">{resolvedParent?.email || currentScout.parentEmail || 'No email'}</span>
                </div>
              )}
            </div>
          )}

          {targetType === 'patrol_parents' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300">
                Select Patrol:
              </label>
              <select
                value={selectedPatrolId}
                onChange={(e) => setSelectedPatrolId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                required
              >
                <option value="">-- Choose Patrol --</option>
                {accessiblePatrols.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name} Patrol ({allScouts.filter(s => isScoutInPatrol(s, group.id, groups)).length} Scouts)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ── PREDEFINED TEMPLATES (AUTO-FILLS TITLE) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300">
                Predefined Templates (Auto-fills Title):
              </label>
              <span className="text-[10px] text-sky-400 font-semibold">Click to select</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_PRESETS.map(preset => {
                const isSelected = selectedTopicId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── EDITABLE MEETING TITLE FIELD ── */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Meeting Title / Topic *
            </label>
            <input
              type="text"
              required
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g. Scoutmaster Conference"
              className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-semibold"
            />
          </div>

          {/* ── DATE, TIME & DURATION ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300">
                Conference Date & Time:
              </label>
              <span className="text-[10px] text-sky-400 font-semibold">Checks auto-loaded calendar</span>
            </div>

            {/* Quick Target Day Chips (Next Tuesday, Next Friday) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {nextScheduledDays.todayTuesday && (
                <button
                  type="button"
                  onClick={() => setMeetingDate(nextScheduledDays.todayTuesday.date)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                    meetingDate === nextScheduledDays.todayTuesday.date
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {nextScheduledDays.todayTuesday.friendlyLabel}
                </button>
              )}
              <button
                type="button"
                onClick={() => setMeetingDate(nextScheduledDays.nextTuesday.date)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  meetingDate === nextScheduledDays.nextTuesday.date
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                Next Tuesday ({nextScheduledDays.nextTuesday.friendlyLabel})
              </button>
              <button
                type="button"
                onClick={() => setMeetingDate(nextScheduledDays.nextFriday.date)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  meetingDate === nextScheduledDays.nextFriday.date
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                Next Friday ({nextScheduledDays.nextFriday.friendlyLabel})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Time
                </label>
                <select
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {TIME_PRESETS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Duration
                </label>
                <select
                  value={meetingDuration}
                  onChange={(e) => setMeetingDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {DURATION_PRESETS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auto-Loaded Calendar Verification Card */}
            {calendarCheckForParentMeeting && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                calendarCheckForParentMeeting.isBlackout
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-slate-950 border-sky-500/40 text-sky-200'
              }`}>
                <Calendar size={15} className="text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="font-bold text-white text-[11px] truncate">
                      📅 Auto-Loaded Calendar: {calendarCheckForParentMeeting.title}
                    </span>
                    <span className="text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded font-bold">
                      Troop Session on Calendar
                    </span>
                  </div>
                  {calendarCheckForParentMeeting.time && (
                    <div className="text-[10px] text-slate-300">
                      Scheduled: {calendarCheckForParentMeeting.time}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── VENUE / FORMAT ── */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300">
              Format / Venue:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { label: 'Troop Headquarters (Highview Elementary School)', shortLabel: 'Headquarters', type: 'physical' },
                { label: 'Google Meet / Zoom Video Call', shortLabel: 'Google Meet', type: 'virtual' },
                { label: 'Direct Phone Conference Call', shortLabel: 'Phone Call', type: 'phone' },
                { label: 'Custom Location', shortLabel: 'Custom', type: 'custom' }
              ].map(v => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVenueType(v.label)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer text-center truncate border ${
                    venueType === v.label
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-sm'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                  }`}
                >
                  {v.shortLabel}
                </button>
              ))}
            </div>

            {venueType === 'Google Meet / Zoom Video Call' && (
              <input
                type="text"
                value={customVenueDetails}
                onChange={(e) => setCustomVenueDetails(e.target.value)}
                placeholder="Paste video call link (e.g. https://meet.google.com/xyz)..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none mt-1"
              />
            )}

            {venueType === 'Custom Location' && (
              <input
                type="text"
                value={customVenueDetails}
                onChange={(e) => setCustomVenueDetails(e.target.value)}
                placeholder="Enter specific room number, building, or address..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none mt-1"
              />
            )}
          </div>

          {/* ── AGENDA ── */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 block">
              Meeting Agenda / Notes:
            </label>
            <textarea
              rows={3}
              value={meetingAgenda}
              onChange={(e) => setMeetingAgenda(e.target.value)}
              placeholder="Provide agenda items for the meeting..."
              className="w-full bg-slate-950 border border-slate-750 focus:border-sky-400 rounded-xl p-2.5 text-xs text-white focus:outline-none leading-relaxed font-sans"
            />
          </div>

        </form>

        {/* ── FOOTER ── */}
        <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || (targetType === 'single_parent' && !selectedScoutId)}
            className="px-5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <span>Scheduling...</span>
            ) : (
              <>
                <Send size={13} />
                <span>Schedule Meeting</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
