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
  Sparkles,
  Shield
} from 'lucide-react';
import { createLeaderInitiatedMeeting } from '../services/parentRequestService';

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
    let scoutsInScope = allScouts;
    if (targetType === 'patrol_parents' && selectedPatrolId) {
      scoutsInScope = allScouts.filter(s => s.groupId === selectedPatrolId || s.patrolId === selectedPatrolId);
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
        meetingTopic: topicTitle,
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
      <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* ── HEADER ── */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 px-6 py-4.5 border-b border-emerald-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl text-emerald-400 shadow-inner">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full tracking-wider">
                  Leader Console
                </span>
                <span className="text-xs text-emerald-300 font-bold">
                  {leaderName} ({leaderRole})
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Schedule Conference / Meeting with Parents
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── BODY (Scrollable) ── */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-950/90 border border-emerald-400 text-emerald-200 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
              <div className="text-sm font-bold">{successMsg}</div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-red-950/90 border border-red-500/60 text-red-200 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <AlertCircle size={22} className="text-red-400 shrink-0" />
              <div className="text-sm font-semibold">{errorMsg}</div>
            </div>
          )}

          {/* ── STEP 1: SCOPE SELECTOR ── */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users size={14} className="text-emerald-400" />
              <span>1. Choose Meeting Audience & Scope</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTargetType('single_parent')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  targetType === 'single_parent'
                    ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">👤</span>
                  {targetType === 'single_parent' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-white">1-on-1 Parent Conference</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Individual Scout & Parent</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('patrol_parents')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  targetType === 'patrol_parents'
                    ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">👥</span>
                  {targetType === 'patrol_parents' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-white">Patrol Parents Meeting</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">All parents of a selected patrol</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('all_unit')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  targetType === 'all_unit'
                    ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🏛️</span>
                  {targetType === 'all_unit' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </div>
                <div className="mt-2">
                  <div className="font-extrabold text-xs text-white">All Unit Parents</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Troop & Pack general assembly</div>
                </div>
              </button>
            </div>
          </div>

          {/* ── STEP 1.1: TARGET RECIPIENT SELECTION ── */}
          {targetType === 'single_parent' && (
            <div className="bg-slate-950/60 border border-slate-800 p-4.5 rounded-2xl space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Select Scout & Linked Family:
                </label>
                <select
                  value={selectedScoutId}
                  onChange={(e) => setSelectedScoutId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="">-- Choose Scout from Roster --</option>
                  {allScouts.map(scout => (
                    <option key={scout.uid} value={scout.uid}>
                      {scout.fullName || scout.username} &bull; {scout.patrolName || 'Patrol Member'} ({scout.rank || 'Scout'})
                    </option>
                  ))}
                </select>
              </div>

              {currentScout && (
                <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <User size={13} className="text-emerald-400" />
                      Scout: {currentScout.fullName || currentScout.username}
                    </span>
                    <span className="text-[11px] text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-md">
                      Rank: {currentScout.rank || 'Scout'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Linked Parent Contact:</span>
                      <strong className="text-white">{resolvedParent?.fullName || currentScout.parentName || 'Parent / Guardian'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Email & Phone:</span>
                      <span className="text-slate-200">{resolvedParent?.email || currentScout.parentEmail || 'No email'} &bull; {resolvedParent?.phone || currentScout.parentPhone || 'No phone'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {targetType === 'patrol_parents' && (
            <div className="bg-slate-950/60 border border-slate-800 p-4.5 rounded-2xl space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Select Target Patrol / Troop Group:
                </label>
                <select
                  value={selectedPatrolId}
                  onChange={(e) => setSelectedPatrolId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="">-- Choose Patrol --</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name} Patrol &bull; ({allScouts.filter(s => s.groupId === group.id || s.patrolId === group.id).length} Scouts)
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatrolId && (
                <div className="flex items-center justify-between text-xs bg-slate-900 p-3 rounded-xl border border-slate-750">
                  <span className="text-slate-300">
                    Targeted Audience: <strong className="text-white">{targetedParentsList.length} Parent Accounts</strong>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ✓ Multi-Parent Batch Routing
                  </span>
                </div>
              )}
            </div>
          )}

          {targetType === 'all_unit' && (
            <div className="bg-slate-950/60 border border-slate-800 p-4.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">
                  Unit Scope: <strong className="text-white">All Active Troop & Pack Families</strong>
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  {targetedParentsList.length} Parents Targeted
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                An individual meeting invitation and push notification will be dispatched to each registered family in the troop directory.
              </p>
            </div>
          )}

          {/* ── STEP 2: TOPIC & AGENDA ── */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-400" />
              <span>2. Select Meeting Purpose & Agenda Preset</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {TOPIC_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicId(preset.id);
                    setMeetingDuration(preset.defaultDuration);
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedTopicId === preset.id
                      ? 'bg-emerald-950/50 border-emerald-400 text-white ring-1 ring-emerald-500 shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{preset.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{preset.desc}</div>
                </button>
              ))}
            </div>

            {selectedTopicId === 'custom' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customTopicTitle}
                  onChange={(e) => setCustomTopicTitle(e.target.value)}
                  placeholder="Enter custom meeting topic or purpose..."
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            )}
          </div>

          {/* ── STEP 3: DATE, TIME & VENUE ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                📅 Meeting Date:
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ⏰ Meeting Time:
              </label>
              <select
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {TIME_PRESETS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ⏳ Duration:
              </label>
              <select
                value={meetingDuration}
                onChange={(e) => setMeetingDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {DURATION_PRESETS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              📍 Location / Meeting Format:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VENUE_PRESETS.map(v => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVenueType(v.label)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition cursor-pointer flex items-center gap-2 ${
                    venueType === v.label
                      ? 'bg-emerald-950/70 border-emerald-400 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {v.type === 'virtual' && <Video size={13} className="text-teal-400 shrink-0" />}
                  {v.type === 'phone' && <Phone size={13} className="text-teal-400 shrink-0" />}
                  {v.type === 'physical' && <MapPin size={13} className="text-emerald-400 shrink-0" />}
                  {v.type === 'custom' && <Compass size={13} className="text-amber-400 shrink-0" />}
                  <span className="truncate">{v.label}</span>
                </button>
              ))}
            </div>

            {venueType === 'Google Meet / Zoom Video Call' && (
              <input
                type="text"
                value={customVenueDetails}
                onChange={(e) => setCustomVenueDetails(e.target.value)}
                placeholder="Paste video call link (e.g. https://meet.google.com/xyz)..."
                className="w-full bg-slate-950 border border-teal-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 mt-1"
              />
            )}

            {venueType === 'Custom Location' && (
              <input
                type="text"
                value={customVenueDetails}
                onChange={(e) => setCustomVenueDetails(e.target.value)}
                placeholder="Enter specific room number, building, or address..."
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 mt-1"
              />
            )}
          </div>

          {/* ── STEP 4: MESSAGE & AGENDA EDITOR ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                📝 Meeting Agenda & Parent Invitation Message:
              </label>
              <span className="text-[10px] text-slate-400">
                Will be included in the email and notification
              </span>
            </div>
            <textarea
              rows={4}
              value={meetingAgenda}
              onChange={(e) => setMeetingAgenda(e.target.value)}
              placeholder="Provide agenda items or notes for the parent..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* RSVP Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rsvpRequired"
              checked={rsvpRequired}
              onChange={(e) => setRsvpRequired(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700 focus:ring-emerald-500"
            />
            <label htmlFor="rsvpRequired" className="text-xs text-slate-300 cursor-pointer">
              Require Interactive Parent RSVP (*Accept / Reschedule / Decline*) in the Parent Portal
            </label>
          </div>

        </form>

        {/* ── FOOTER ── */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || (targetType === 'single_parent' && !selectedScoutId)}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Dispatching Invitations...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>🚀 Schedule & Dispatch Meeting Invites ({targetedParentsList.length})</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
