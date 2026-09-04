import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  ExternalLink, 
  CheckSquare, 
  Sparkles,
  Tent,
  Users,
  Compass,
  Hourglass,
  Car,
  Utensils,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Megaphone
} from 'lucide-react';
import { formatKashafEventWhatsApp, applyIslamicTransliteration } from '../utils/kashafVoice';
import { dispatchParentNotification, dispatchPatrolStreamAlert } from '../utils/notificationPipeline';

export default function EventsManager({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;
  const isLeader = currentUser?.role === 'leader' || isOwner || isExecutive;
  const isParent = currentUser?.role === 'parent';
  const isScout = !isLeader && !isParent;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // RSVPs Map: { [eventId]: { [scoutOrParentUid]: rsvpData } }
  const [eventRsvps, setEventRsvps] = useState({});

  // Event Creator Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM – 2:00 PM');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('meeting'); // 'campout' | 'meeting' | 'service' | 'faith' | 'ceremony'
  const [description, setDescription] = useState('');
  const [requiredItems, setRequiredItems] = useState('');
  const [quranVerse, setQuranVerse] = useState('');
  const [groups, setGroups] = useState([]);
  const [targetGroupId, setTargetGroupId] = useState(isExecutive ? 'all' : (currentUser?.groupId || 'all'));

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Parent / Scout RSVP Form State
  const [rsvpStatus, setRsvpStatus] = useState('attending'); // 'attending' | 'not_attending' | 'tentative'
  const [rsvpDietary, setRsvpDietary] = useState('');
  const [rsvpDriverAvailable, setRsvpDriverAvailable] = useState(false);
  const [rsvpSeats, setRsvpSeats] = useState(0);
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpSuccessMsg, setRsvpSuccessMsg] = useState('');

  // 1. Subscribe to events collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter scoped to patrol if regular leader
      if (!isExecutive && currentUser?.groupId) {
        list = list.filter(ev => ev.targetGroupId === 'all' || ev.targetGroupId === currentUser.groupId || !ev.targetGroupId);
      }

      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEvents(list);
      if (list.length > 0 && !selectedEvent && !showForm) {
        setSelectedEvent(list[0]);
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to load events:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [isExecutive, currentUser?.groupId]);

  // 2. Subscribe to groups for leader filter
  useEffect(() => {
    if (isLeader) {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
        setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
      });
      return () => unsubGroups();
    }
  }, [isLeader]);

  // 3. Subscribe to RSVPs for the selected event
  useEffect(() => {
    if (!selectedEvent?.id) return;
    const unsubRsvp = onSnapshot(collection(db, 'events', selectedEvent.id, 'rsvps'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setEventRsvps(prev => ({ ...prev, [selectedEvent.id]: map }));
    });
    return () => unsubRsvp();
  }, [selectedEvent?.id]);

  // Sync existing RSVP if user already submitted
  useEffect(() => {
    if (selectedEvent && currentUser?.uid) {
      const currentRsvp = eventRsvps[selectedEvent.id]?.[currentUser.uid];
      if (currentRsvp) {
        setRsvpStatus(currentRsvp.status || 'attending');
        setRsvpDietary(currentRsvp.dietary || '');
        setRsvpDriverAvailable(!!currentRsvp.driverAvailable);
        setRsvpSeats(currentRsvp.seats || 0);
        setRsvpNotes(currentRsvp.notes || '');
      } else {
        setRsvpStatus('attending');
        setRsvpDietary('');
        setRsvpDriverAvailable(false);
        setRsvpSeats(0);
        setRsvpNotes('');
      }
    }
  }, [selectedEvent, currentUser?.uid, eventRsvps]);

  // Update WhatsApp text when selected event changes (leaders only)
  useEffect(() => {
    if (selectedEvent && isLeader) {
      setCustomWhatsAppMsg(formatKashafEventWhatsApp(selectedEvent));
    }
  }, [selectedEvent, isLeader]);

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00 AM – 2:00 PM');
    setLocation('');
    setCategory('meeting');
    setDescription('');
    setRequiredItems('');
    setQuranVerse('');
    setTargetGroupId(isExecutive ? 'all' : (currentUser?.groupId || 'all'));
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingId(ev.id);
    setTitle(ev.title || '');
    setDate(ev.date || '');
    setTime(ev.time || '');
    setLocation(ev.location || '');
    setCategory(ev.category || 'meeting');
    setDescription(ev.description || '');
    setRequiredItems(ev.requiredItems || '');
    setQuranVerse(ev.quranVerse || '');
    setTargetGroupId(ev.targetGroupId || 'all');
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!title.trim() || !date) {
      setError("Event title and date are required.");
      return;
    }

    setSaving(true);
    const scope = isExecutive ? targetGroupId : (currentUser?.groupId || 'all');
    const eventData = {
      title: title.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      category,
      description: description.trim(),
      requiredItems: requiredItems.trim(),
      quranVerse: quranVerse.trim(),
      targetGroupId: scope,
      createdBy: currentUser?.uid || '',
      createdByName: currentUser?.fullName || currentUser?.username || 'Leader',
      isGlobalScope: scope === 'all',
      updatedAt: serverTimestamp()
    };

    try {
      const docId = editingId || `event_${Date.now()}`;
      await setDoc(doc(db, 'events', docId), eventData, { merge: true });

      // Automatically post announcement alert to patrol stream
      if (scope === 'all') {
        groups.forEach(g => {
          dispatchPatrolStreamAlert(g.id, `📅 New Troop Event Posted: ${title.trim()} on ${date} at ${time.trim()}.`);
        });
      } else {
        dispatchPatrolStreamAlert(scope, `📅 New Patrol Event: ${title.trim()} on ${date} at ${time.trim()}.`);
      }

      setMsg(editingId ? "Event updated!" : "New event published!");
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
      }, 1200);
    } catch (err) {
      console.error("Failed to save event:", err);
      setError("Error saving event: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this event?")) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  // Submit RSVP Handler (For Parents & Scouts)
  const handleSubmitRsvp = async (e) => {
    e.preventDefault();
    if (!selectedEvent?.id || !currentUser?.uid) return;
    setRsvpSaving(true);
    setRsvpSuccessMsg('');

    const rsvpData = {
      userId: currentUser.uid,
      userName: currentUser.fullName || currentUser.username || 'Family',
      userRole: currentUser.role || 'parent',
      status: rsvpStatus, // 'attending' | 'not_attending' | 'tentative'
      dietary: rsvpDietary.trim(),
      driverAvailable: rsvpDriverAvailable,
      seats: rsvpDriverAvailable ? Number(rsvpSeats) : 0,
      notes: rsvpNotes.trim(),
      submittedAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'events', selectedEvent.id, 'rsvps', currentUser.uid), rsvpData, { merge: true });
      setRsvpSuccessMsg('✓ RSVP confirmed! Leader roster updated.');
      setTimeout(() => setRsvpSuccessMsg(''), 3000);
    } catch (err) {
      alert("Failed to submit RSVP: " + err.message);
    } finally {
      setRsvpSaving(false);
    }
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(customWhatsAppMsg);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // RSVP statistics for currently selected event
  const currentEventRsvpsList = selectedEvent ? Object.values(eventRsvps[selectedEvent.id] || {}) : [];
  const attendingCount = currentEventRsvpsList.filter(r => r.status === 'attending').length;
  const tentativeCount = currentEventRsvpsList.filter(r => r.status === 'tentative').length;
  const notAttendingCount = currentEventRsvpsList.filter(r => r.status === 'not_attending').length;
  const volunteerDrivers = currentEventRsvpsList.filter(r => r.driverAvailable);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── HEADER BANNER ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-950/50 shrink-0">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-black text-white">
                {isParent ? 'Troop Calendar & Event RSVPs' : 'Troop Calendar & Planned Events'}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                {isExecutive ? 'Executive Broadcast Control' : isLeader ? 'Patrol Leader' : 'Family RSVP Portal'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isParent 
                ? 'Review upcoming campouts, meetings, and volunteer service events. Confirm your family attendance and carpool seats.'
                : 'Plan weekly meetings, campouts, and halqas. Track family RSVPs, volunteer drivers, and broadcast announcements.'}
            </p>
          </div>
        </div>

        {isLeader && (
          <button
            onClick={handleOpenNew}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <Plus size={16} />
            <span>Publish New Event</span>
          </button>
        )}
      </div>

      {/* ── CREATE / EDIT EVENT MODAL ── */}
      {showForm && isLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">
                {editingId ? 'Edit Event Details' : 'Publish Planned Event'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {error && <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-600">{error}</p>}
            {msg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{msg}</p>}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall Camporee & Pioneering Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Time Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM – 2:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="meeting">🏕️ Troop Meeting</option>
                    <option value="campout">⛺ Overnight Campout</option>
                    <option value="service">🤝 Service Project</option>
                    <option value="faith">🕌 Halqa / Spiritual Circle</option>
                    <option value="ceremony">🎖️ Court of Honor / Ceremony</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Camp Alpine / Mosque Community Hall"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Push Scope & Executive Controls */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Event Visibility & Scope
                </label>
                {isExecutive ? (
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">⚡ Push to Entire Troop (All Patrols)</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} Patrol Only</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-400">
                    Scoped to your assigned patrol: <strong className="text-emerald-400">{groups.find(g => g.id === currentUser?.groupId)?.name || 'My'} Patrol</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Event Description & Program Details</label>
                <textarea
                  rows={3}
                  placeholder="Detailed schedule, objective, and instructions for parents & scouts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Required Gear / Items to Bring</label>
                <input
                  type="text"
                  placeholder="e.g. Class A Uniform, Pocket Knife, Water Bottle, Mess Kit"
                  value={requiredItems}
                  onChange={(e) => setRequiredItems(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Publish Event'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EVENTS WORKSPACE: LIST & DETAIL VIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Events List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-sm">Scheduled Calendar ({events.length})</h3>
            <span className="text-[10px] font-mono text-slate-400">Chronological</span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 bg-slate-850 rounded-3xl border border-slate-750 text-slate-400 text-xs italic">
              No events scheduled in the calendar.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {events.map(ev => {
                const isSelected = selectedEvent?.id === ev.id;
                const rsvps = Object.values(eventRsvps[ev.id] || {});
                const countAttending = rsvps.filter(r => r.status === 'attending').length;

                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 shadow-sm ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-950/30'
                        : 'bg-slate-850 border-slate-755 hover:border-slate-650'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        📅 {ev.date}
                      </span>
                      <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {countAttending} Going
                      </span>
                    </div>
                    <strong className="text-sm font-bold text-white block leading-snug truncate">{ev.title}</strong>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                      <span>⏰ {ev.time}</span>
                      {ev.location && <span>&bull; 📍 {ev.location}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Event Detail & RSVP Center */}
        {selectedEvent ? (
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-750 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase">
                      {selectedEvent.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full">
                      {selectedEvent.targetGroupId === 'all' ? '⚡ Troop-Wide Broadcast' : 'Patrol Scoped'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 flex-wrap font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-emerald-400" /> {selectedEvent.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-emerald-400" /> {selectedEvent.time}</span>
                    {selectedEvent.location && (
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-emerald-400" /> {selectedEvent.location}</span>
                    )}
                  </div>
                </div>

                {isLeader && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(selectedEvent)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                      title="Edit Event"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="p-2 bg-slate-800 hover:bg-red-600/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition"
                      title="Delete Event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div className="space-y-1 text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-2xl border border-slate-755">
                  <strong className="text-white block uppercase text-[10px] font-bold text-slate-400">Program Outline & Instructions:</strong>
                  <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              )}

              {/* Required Items */}
              {selectedEvent.requiredItems && (
                <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs space-y-1">
                  <strong className="text-amber-400 uppercase text-[10px] block font-bold">🎒 Packing List & Required Gear:</strong>
                  <p className="text-slate-200">{selectedEvent.requiredItems}</p>
                </div>
              )}

              {/* ── INTERACTIVE RSVP MODULE (PARENTS & SCOUTS) ── */}
              <div className="bg-slate-900 border border-slate-750 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <CheckSquare size={16} className="text-emerald-400" />
                    <span>Your Family Event RSVP</span>
                  </h4>
                  {rsvpSuccessMsg && <span className="text-xs text-emerald-400 font-bold">{rsvpSuccessMsg}</span>}
                </div>

                <form onSubmit={handleSubmitRsvp} className="space-y-3.5">
                  <div className="flex gap-2">
                    {[
                      { id: 'attending', label: '✓ Going / Attending', color: 'bg-emerald-600 text-white' },
                      { id: 'tentative', label: '❓ Tentative', color: 'bg-amber-600 text-white' },
                      { id: 'not_attending', label: '✗ Not Attending', color: 'bg-slate-800 text-slate-400' }
                    ].map(st => (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setRsvpStatus(st.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          rsvpStatus === st.id ? `${st.color} border-emerald-500 shadow-md` : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Utensils size={12} className="text-amber-400" /> Dietary Restrictions / Allergies
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Halal, Peanut Allergy"
                        value={rsvpDietary}
                        onChange={(e) => setRsvpDietary(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Car size={12} className="text-sky-400" /> Carpool Driver Volunteer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rsvpDriverAvailable}
                            onChange={(e) => setRsvpDriverAvailable(e.target.checked)}
                          />
                          <span>Can drive scouts</span>
                        </label>
                        {rsvpDriverAvailable && (
                          <input
                            type="number"
                            min="1"
                            max="8"
                            placeholder="Seats"
                            value={rsvpSeats}
                            onChange={(e) => setRsvpSeats(e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white text-center"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Carpool / Additional Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Leaving at 9:30 AM from North side..."
                      value={rsvpNotes}
                      onChange={(e) => setRsvpNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpSaving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <Check size={14} />
                    <span>{rsvpSaving ? 'Saving RSVP...' : 'Submit / Update RSVP'}</span>
                  </button>
                </form>
              </div>

              {/* ── LEADER RSVP PLANNING ROSTER ── */}
              {isLeader && (
                <div className="bg-slate-900 border border-slate-750 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <Users size={14} className="text-emerald-400" />
                      <span>Roster RSVPs ({currentEventRsvpsList.length} Responses)</span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400 font-bold">✓ {attendingCount} Attending</span>
                      <span className="text-amber-400 font-bold">? {tentativeCount} Tentative</span>
                      <span className="text-slate-400">✗ {notAttendingCount} Out</span>
                    </div>
                  </div>

                  {currentEventRsvpsList.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No RSVPs recorded yet for this event.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {currentEventRsvpsList.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-950 text-xs border border-slate-800">
                          <div>
                            <strong className="text-white block">{r.userName}</strong>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              {r.dietary && <span>Dietary: {r.dietary}</span>}
                              {r.driverAvailable && <span className="text-sky-400 font-semibold">🚗 Driver ({r.seats} seats)</span>}
                              {r.notes && <span className="italic">"{r.notes}"</span>}
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            r.status === 'attending' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            r.status === 'tentative' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                            'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            {r.status === 'attending' ? 'Attending' : r.status === 'tentative' ? 'Tentative' : 'Declined'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 text-center py-20 bg-slate-850 rounded-3xl border border-slate-750 text-slate-400 text-xs">
            Select an event from the schedule to view details and submit RSVP.
          </div>
        )}
      </div>
    </div>
  );
}
