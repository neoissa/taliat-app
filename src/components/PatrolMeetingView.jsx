import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Video, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  Edit3, 
  Plus, 
  Radio, 
  Share2, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Compass, 
  Shield, 
  Crown,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { isSuperUser, getAccessiblePatrols } from '../utils/patrolScoping';
import StatusBadge from './StatusBadge';

export default function PatrolMeetingView({ currentUser, onNavigate }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [patrolGroup, setPatrolGroup] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Edit Meeting Form States
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('6:30 PM');
  const [meetingDuration, setMeetingDuration] = useState('1 hour');
  const [meetLink, setMeetLink] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('Google Meet (Virtual)');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [postToChat, setPostToChat] = useState(true);

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin';
  const isLeaderOrOwner = isOwner || isLeader;

  // 1. Fetch all groups for scoping
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setGroups(list);
    }, (err) => console.warn("Failed to load groups in PatrolMeetingView:", err));

    return () => unsub();
  }, []);

  // 2. Resolve accessible patrols & default selected patrol
  const accessiblePatrols = useMemo(() => {
    return getAccessiblePatrols(currentUser, groups);
  }, [currentUser, groups]);

  useEffect(() => {
    if (accessiblePatrols.length > 0 && !selectedGroupId) {
      // For scouts, find their assigned patrol
      const directId = currentUser?.groupId || currentUser?.patrolId;
      if (directId && accessiblePatrols.some(p => p.id === directId)) {
        setSelectedGroupId(directId);
      } else {
        setSelectedGroupId(accessiblePatrols[0].id);
      }
    }
  }, [accessiblePatrols, currentUser?.groupId, currentUser?.patrolId, selectedGroupId]);

  // 3. Listen in real-time to the selected patrol group document
  useEffect(() => {
    if (!selectedGroupId) {
      setPatrolGroup(null);
      return;
    }

    const unsub = onSnapshot(doc(db, 'groups', selectedGroupId), (snap) => {
      if (snap.exists()) {
        setPatrolGroup({ id: snap.id, ...snap.data() });
      } else {
        setPatrolGroup(null);
      }
    }, (err) => console.warn("Failed to listen to group:", err));

    return () => unsub();
  }, [selectedGroupId]);

  // 4. Listen to upcoming calendar events for this patrol
  useEffect(() => {
    if (!selectedGroupId) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'events'),
      where('date', '>=', todayStr),
      orderBy('date', 'asc'),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const allEvents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Filter for this patrol or whole-troop events
      const patrolEvents = allEvents.filter(ev => {
        if (ev.groupId === selectedGroupId || ev.patrolId === selectedGroupId) return true;
        if (ev.targetAudience === 'all' || !ev.targetAudience) return true;
        if (ev.title && patrolGroup?.name && ev.title.toLowerCase().includes(patrolGroup.name.toLowerCase())) return true;
        return false;
      });
      setUpcomingEvents(patrolEvents);
    }, (err) => console.warn("Upcoming events fetch fallback:", err));

    return () => unsub();
  }, [selectedGroupId, patrolGroup?.name]);

  // Derive the active next meeting data (Prioritizes group's nextMeeting, then falls back to closest calendar event)
  const nextMeeting = useMemo(() => {
    const directMeeting = patrolGroup?.nextMeeting;
    const directLink = patrolGroup?.nextMeetingLink || patrolGroup?.meetingLink || patrolGroup?.googleMeetLink;

    if (directMeeting && (directMeeting.date || directMeeting.meetLink || directMeeting.title)) {
      return {
        title: directMeeting.title || `${patrolGroup.name || 'Patrol'} Weekly Meeting & Halqa`,
        date: directMeeting.date || '',
        time: directMeeting.time || '6:30 PM',
        duration: directMeeting.duration || '1 hour',
        meetLink: directMeeting.meetLink || directMeeting.googleMeetLink || directLink || '',
        location: directMeeting.location || (directMeeting.meetLink ? 'Google Meet (Virtual)' : 'Troop Headquarters'),
        agenda: directMeeting.agenda || directMeeting.notes || '',
        hostName: directMeeting.hostName || directMeeting.updatedByName || (patrolGroup.leaders?.[0]?.name) || 'Patrol Leadership',
        source: 'group'
      };
    }

    // Check if group has a persistent meet link configured
    if (directLink) {
      return {
        title: `${patrolGroup?.name || 'Patrol'} Weekly Meeting & Halqa`,
        date: upcomingEvents[0]?.date || '',
        time: upcomingEvents[0]?.time || '6:30 PM',
        duration: '1 hour',
        meetLink: directLink,
        location: 'Google Meet (Virtual)',
        agenda: upcomingEvents[0]?.description || '',
        hostName: 'Patrol Leadership',
        source: 'groupLink'
      };
    }

    // Check calendar events
    if (upcomingEvents.length > 0) {
      const ev = upcomingEvents[0];
      const evMeetLink = ev.meetLink || ev.googleMeetLink || ev.videoLink || (ev.location?.includes('meet.google.com') ? ev.location : '');
      return {
        title: ev.title || `${patrolGroup?.name || 'Patrol'} Meeting`,
        date: ev.date || '',
        time: ev.time || '6:30 PM',
        duration: ev.duration || '1 hour',
        meetLink: evMeetLink,
        location: ev.location || 'Troop Headquarters',
        agenda: ev.description || '',
        hostName: ev.leaderName || 'Patrol Leadership',
        source: 'calendar'
      };
    }

    // Default placeholder
    return {
      title: `${patrolGroup?.name || 'Patrol'} Meeting & Halqa`,
      date: '',
      time: '6:30 PM',
      duration: '1 hour',
      meetLink: directLink || '',
      location: 'Troop Headquarters',
      agenda: '',
      hostName: 'Patrol Leadership',
      source: 'none'
    };
  }, [patrolGroup, upcomingEvents]);

  // Clean and sanitize the Google Meet link
  const normalizedMeetLink = useMemo(() => {
    let link = (nextMeeting?.meetLink || '').trim();
    if (!link) return '';
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      link = 'https://' + link;
    }
    return link;
  }, [nextMeeting?.meetLink]);

  const hasGoogleMeet = Boolean(
    normalizedMeetLink && 
    (normalizedMeetLink.includes('meet.google.com') || normalizedMeetLink.includes('http'))
  );

  // Compute live meeting status (e.g. "Live Now", "Today", "In X days")
  const meetingStatus = useMemo(() => {
    if (!nextMeeting?.date) {
      return { label: 'Scheduled Patrol Session', isLive: false, colorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (nextMeeting.date === todayStr) {
      return { label: '🟢 Meeting Today!', isLive: true, colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' };
    }

    const meetingD = new Date(nextMeeting.date + 'T12:00:00');
    const todayD = new Date(todayStr + 'T12:00:00');
    const diffDays = Math.ceil((meetingD - todayD) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { label: '⏳ Tomorrow', isLive: false, colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    if (diffDays > 1 && diffDays <= 7) {
      return { label: `📅 In ${diffDays} Days`, isLive: false, colorClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
    }
    if (diffDays > 7) {
      return { label: `📅 ${nextMeeting.date}`, isLive: false, colorClass: 'bg-slate-800 text-slate-300 border-slate-700' };
    }

    return { label: 'Past Session', isLive: false, colorClass: 'bg-slate-800 text-slate-400 border-slate-700' };
  }, [nextMeeting?.date]);

  const handleCopyLink = () => {
    if (!normalizedMeetLink) return;
    navigator.clipboard.writeText(normalizedMeetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenJoinMeeting = () => {
    if (!normalizedMeetLink) return;
    window.open(normalizedMeetLink, '_blank', 'noopener,noreferrer');
  };

  // Open Edit Meeting Modal & prefill values
  const handleOpenEditModal = () => {
    setMeetingTitle(nextMeeting.title || `${patrolGroup?.name || 'Patrol'} Weekly Meeting & Halqa`);
    setMeetingDate(nextMeeting.date || new Date().toISOString().split('T')[0]);
    setMeetingTime(nextMeeting.time || '6:30 PM');
    setMeetingDuration(nextMeeting.duration || '1 hour');
    setMeetLink(normalizedMeetLink || '');
    setMeetingLocation(nextMeeting.location || 'Google Meet (Virtual)');
    setMeetingAgenda(nextMeeting.agenda || '');
    setSaveSuccess('');
    setShowEditModal(true);
  };

  // Save next meeting updates to Firestore
  const handleSaveMeeting = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) return;

    setSavingMeeting(true);
    try {
      const cleanLink = meetLink.trim();
      let formattedLink = cleanLink;
      if (cleanLink && !cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) {
        formattedLink = 'https://' + cleanLink;
      }

      const meetingPayload = {
        title: meetingTitle.trim() || `${patrolGroup?.name || 'Patrol'} Meeting`,
        date: meetingDate || new Date().toISOString().split('T')[0],
        time: meetingTime,
        duration: meetingDuration,
        meetLink: formattedLink,
        googleMeetLink: formattedLink,
        location: formattedLink ? (meetingLocation || 'Google Meet (Virtual)') : (meetingLocation || 'Troop Headquarters'),
        agenda: meetingAgenda.trim(),
        updatedAt: new Date().toISOString(),
        updatedByUid: currentUser?.uid || '',
        updatedByName: currentUser?.fullName || currentUser?.username || 'Patrol Leader'
      };

      // 1. Update Group document
      const groupRef = doc(db, 'groups', selectedGroupId);
      await setDoc(groupRef, {
        nextMeeting: meetingPayload,
        nextMeetingLink: formattedLink,
        meetingLink: formattedLink
      }, { merge: true });

      // 2. Post notification into Patrol Chat if requested
      if (postToChat) {
        try {
          const chatRef = collection(db, 'chats', selectedGroupId, 'messages');
          const messageText = formattedLink
            ? `🎥 *Next Patrol Meeting Updated*\n\n📅 *Date:* ${meetingPayload.date} at ${meetingPayload.time}\n📌 *Topic:* ${meetingPayload.title}\n🔗 *Google Meet Link:* ${formattedLink}\n\n${meetingPayload.agenda ? `_Agenda:_ ${meetingPayload.agenda}` : ''}`
            : `📅 *Next Patrol Meeting Updated*\n\n📅 *Date:* ${meetingPayload.date} at ${meetingPayload.time}\n📌 *Topic:* ${meetingPayload.title}\n📍 *Location:* ${meetingPayload.location}\n\n${meetingPayload.agenda ? `_Agenda:_ ${meetingPayload.agenda}` : ''}`;

          await addDoc(chatRef, {
            text: messageText,
            senderId: 'system',
            senderName: '⚜️ Patrol Dispatch',
            senderRole: 'leader',
            timestamp: serverTimestamp(),
            isSystem: true,
            meetingAttached: true,
            meetLink: formattedLink
          });
        } catch (chatErr) {
          console.warn("Could not dispatch meeting chat alert:", chatErr);
        }
      }

      setSaveSuccess('Patrol meeting and Google Meet link updated successfully!');
      setTimeout(() => {
        setShowEditModal(false);
        setSaveSuccess('');
      }, 1200);
    } catch (err) {
      console.error("Failed to save patrol meeting:", err);
      alert("Failed to save meeting details. Please try again.");
    } finally {
      setSavingMeeting(false);
    }
  };

  const handleCreateInstantGoogleMeet = () => {
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── 1. HEADER & PATROL SELECTOR ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-lg shadow-indigo-950/50">
              <Video size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full">
                  🛡️ Patrol Meeting Room
                </span>
                <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${meetingStatus.colorClass}`}>
                  {meetingStatus.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {patrolGroup?.name ? `${patrolGroup.name} Patrol Meeting` : 'Patrol Meetings & Halqa'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Join your scheduled virtual Google Meet room or review meeting time and agenda.
              </p>
            </div>
          </div>

          {/* Patrol Selector for Multi-Patrol Leaders & Superusers */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {accessiblePatrols.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs font-bold shadow-inner">
                <Users size={13} className="text-indigo-400 shrink-0" />
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
                >
                  {accessiblePatrols.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} Patrol
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isLeaderOrOwner && (
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-indigo-950/40 hover:scale-[1.02]"
              >
                <Edit3 size={13} />
                <span>Edit Meeting Link</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. HERO CARD: NEXT PATROL MEETING & GOOGLE MEET LINK ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background glow when Google Meet is attached */}
        {hasGoogleMeet && (
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
                {patrolGroup?.name ? `${patrolGroup.name} Patrol` : 'Dhulfiqār Patrol'}
              </span>
              {hasGoogleMeet ? (
                <span className="text-xs font-bold text-teal-300 bg-teal-500/15 border border-teal-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
                  <Video size={13} className="text-teal-400" />
                  <span>Google Meet Attached</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-400" />
                  <span>In-Person Meeting</span>
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {nextMeeting.title}
            </h3>

            {/* Date & Time Pills */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl font-bold">
                <Calendar size={15} className="text-indigo-400 shrink-0" />
                <span>{nextMeeting.date || 'Weekly Session'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl font-bold font-mono">
                <Clock size={15} className="text-indigo-400 shrink-0" />
                <span>{nextMeeting.time} ({nextMeeting.duration})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <MapPin size={14} className="text-slate-500 shrink-0" />
                <span>{nextMeeting.location}</span>
              </div>
            </div>
          </div>

          {/* Big Action Column */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            {hasGoogleMeet ? (
              <>
                <button
                  type="button"
                  onClick={handleOpenJoinMeeting}
                  className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base px-6 py-3.5 sm:py-4 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2.5 shadow-xl shadow-teal-950/60 hover:scale-[1.03] active:scale-[0.98] border border-teal-300"
                >
                  <Video size={20} className="text-slate-950 animate-bounce" />
                  <span>Join Google Meet</span>
                  <ExternalLink size={16} className="text-slate-900" />
                </button>

                <div className="flex items-center gap-2 justify-center">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Meeting Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('tarbiyah-hub', { subTab: 'chat' })}
                    className="text-xs bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white border border-slate-700 font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    title="Go to Patrol Live Chat"
                  >
                    <MessageSquare size={14} />
                    <span>Patrol Chat</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center sm:text-right space-y-2">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-300 max-w-xs">
                  <span className="font-bold text-white block mb-0.5">Physical In-Person Session</span>
                  <span>Meet with your patrol at the assigned troop location.</span>
                </div>
                {isLeaderOrOwner && (
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Plus size={14} />
                    <span>Attach Google Meet Link</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── GOOGLE MEET LINK DIRECT BAR ── */}
        {hasGoogleMeet && (
          <div className="bg-slate-950/90 border border-teal-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
                <Radio size={18} className="animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                  Official Google Meet Video Room URL:
                </span>
                <a
                  href={normalizedMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-mono font-bold text-white hover:text-teal-300 underline truncate block transition"
                >
                  {normalizedMeetLink}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenJoinMeeting}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-950/50"
              >
                <span>Open Room</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        )}

        {/* ── MEETING AGENDA & DISCUSSION TOPICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span>Meeting Agenda & Discussion Topics</span>
            </h4>
            {nextMeeting.agenda ? (
              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                {nextMeeting.agenda}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                No custom agenda specified yet. Meeting will follow standard patrol schedule (Opening Dua, Rank Skills, Activity Planning & Reflection).
              </p>
            )}
          </div>

          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Shield size={14} className="text-indigo-400" />
                <span>Patrol Host & Coordination</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Host: <strong className="text-white">{nextMeeting.hostName}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Have questions or cannot attend? Notify your patrol leader in the Patrol Chat beforehand.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('tarbiyah-hub', { subTab: 'chat' })}
              className="w-full bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white text-xs font-bold py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={13} />
              <span>Open Patrol Chat Channel</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. UPCOMING TROOP CALENDAR SESSIONS ── */}
      {upcomingEvents.length > 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-indigo-400" size={17} />
              <h3 className="font-black text-white text-sm sm:text-base">
                Upcoming Troop & Patrol Schedule
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('events')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingEvents.slice(1, 5).map(ev => {
              const evHasMeet = Boolean(ev.meetLink || ev.googleMeetLink || ev.location?.includes('meet.google.com'));
              return (
                <div
                  key={ev.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                        {ev.date}
                      </span>
                      {ev.time && (
                        <span className="text-[10px] font-bold text-indigo-400 font-mono">
                          {ev.time}
                        </span>
                      )}
                      {evHasMeet && (
                        <span className="text-[9px] font-bold text-teal-300 bg-teal-500/20 px-1.5 py-0.2 rounded border border-teal-500/30">
                          Google Meet
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">{ev.title}</h4>
                    {ev.location && (
                      <p className="text-[11px] text-slate-400 truncate">{ev.location}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('events')}
                    className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-slate-700 shrink-0 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. LEADER MODAL: EDIT PATROL MEETING & GOOGLE MEET LINK ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <Edit3 size={17} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Update Next Patrol Meeting
                  </h3>
                  <span className="text-[11px] text-indigo-400 font-semibold">
                    {patrolGroup?.name ? `${patrolGroup.name} Patrol` : 'Patrol'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{saveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveMeeting} className="space-y-4 text-xs">
              {/* Meeting Title */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Meeting Title / Topic:
                </label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g. Weekly Patrol Halqa & Knot Tying"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Meeting Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Start Time:
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="e.g. 6:30 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Duration & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Duration:
                  </label>
                  <select
                    value={meetingDuration}
                    onChange={(e) => setMeetingDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Venue / Location:
                  </label>
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    placeholder="e.g. Google Meet (Virtual)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Google Meet Link Field */}
              <div className="p-3.5 bg-slate-950 border border-teal-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-teal-300 flex items-center gap-1.5">
                    <Video size={14} className="text-teal-400" />
                    <span>Google Meet Link (Virtual Video Call):</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCreateInstantGoogleMeet}
                    className="text-[10px] text-teal-300 hover:text-white bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/40 px-2 py-0.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={10} />
                    <span>Create on Google Meet</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="Paste URL e.g. https://meet.google.com/abc-defg-hij"
                  className="w-full bg-slate-900 border border-teal-500/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-300 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400">
                  Scouts will see a prominent <strong>"Join Google Meet"</strong> button that opens this room in 1-click.
                </p>
              </div>

              {/* Agenda / Notes */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Agenda & Discussion Topics:
                </label>
                <textarea
                  rows={3}
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  placeholder="1. Opening Dua & Surah recitation&#10;2. Tenderfoot knots practice&#10;3. Upcoming campout discussion"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-xs font-sans leading-relaxed"
                />
              </div>

              {/* Notify in Chat Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="postToChatCheck"
                  checked={postToChat}
                  onChange={(e) => setPostToChat(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="postToChatCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  📢 Post meeting update & Google Meet link to Patrol Chat channel
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMeeting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition cursor-pointer shadow-lg shadow-indigo-950/50 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingMeeting ? 'Saving...' : 'Save & Publish Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
