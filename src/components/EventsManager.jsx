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
  Hourglass
} from 'lucide-react';
import { formatKashafEventWhatsApp, applyIslamicTransliteration } from '../utils/kashafVoice';

export default function EventsManager({ currentUser }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || isOwner;
  const isScout = !isLeader;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

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
  const [targetGroupId, setTargetGroupId] = useState('all');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // 1. Subscribe to events collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort chronologically ascending
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
  }, []);

  // 2. Subscribe to groups for leader filter
  useEffect(() => {
    if (isLeader) {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
        setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
      });
      return () => unsubGroups();
    }
  }, [isLeader]);

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
    setTargetGroupId('all');
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
    const eventData = {
      title: title.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      category,
      description: description.trim(),
      requiredItems: requiredItems.trim(),
      quranVerse: quranVerse.trim(),
      targetGroupId,
      createdBy: currentUser?.uid || '',
      createdByName: currentUser?.fullName || currentUser?.username || 'Leader',
      updatedAt: serverTimestamp()
    };

    try {
      const docId = editingId || `event_${Date.now()}`;
      await setDoc(doc(db, 'events', docId), eventData, { merge: true });
      setMsg(editingId ? "Event updated!" : "New event published!");
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
        setSelectedEvent({ id: docId, ...eventData });
      }, 1200);
    } catch (err) {
      console.error("Failed to save event:", err);
      setError("Failed to save event: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      setSelectedEvent(null);
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  const handleCopyWhatsApp = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Helper for countdown
  const getEventCountdown = (dateStr) => {
    if (!dateStr) return { label: 'Scheduled', color: 'bg-slate-800 text-slate-400', days: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const evDate = new Date(dateStr);
    evDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((evDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Past Event (${Math.abs(diffDays)}d ago)`, color: 'bg-slate-800 text-slate-400', days: diffDays };
    }
    if (diffDays === 0) {
      return { label: '🎯 Event is Today!', color: 'bg-red-500 text-white font-black animate-pulse', days: 0 };
    }
    if (diffDays === 1) {
      return { label: '⏰ Tomorrow!', color: 'bg-amber-500 text-slate-950 font-bold', days: 1 };
    }
    return { label: `⏳ In ${diffDays} Days`, color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold', days: diffDays };
  };

  const selectedCountdown = selectedEvent ? getEventCountdown(selectedEvent.date) : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {isLeader ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> KashafVoice v3.0 Enabled
              </span>
            ) : (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                ⚜️ Dhulfiqār Troop Calendar
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="text-emerald-400" size={24} />
            <span>{isLeader ? 'Planned Events & Troop Calendar' : 'Upcoming Troop Events & Campouts'}</span>
          </h2>
          <p className="text-xs text-slate-350 mt-1 leading-relaxed max-w-2xl">
            {isLeader 
              ? 'Schedule campouts, meetings, ceremonies, and service projects, and share instant faith-rooted WhatsApp announcements with parents.'
              : 'Explore upcoming campouts, meetings, itineraries, and required packing lists with real-time day countdowns.'}
          </p>
        </div>

        {isLeader && !showForm && (
          <button
            onClick={handleOpenNew}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <Plus size={16} /> Plan New Event
          </button>
        )}
      </div>

      {/* Event Creator Form Modal/Panel (Leader Only) */}
      {showForm && isLeader && (
        <div className="bg-slate-800 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{editingId ? 'Edit Planned Event' : 'Schedule New Troop Event'}</span>
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
          {msg && <p className="text-xs text-emerald-400 font-semibold">{msg}</p>}

          <form onSubmit={handleSaveEvent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall Campout & Orienteering Expedition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="campout">🏕️ Campout & Outdoors</option>
                  <option value="meeting">🤝 Troop Meeting</option>
                  <option value="faith">🕌 Faith & Community</option>
                  <option value="service">🛠️ Service Project</option>
                  <option value="ceremony">⚜️ Court of Honor / Ceremony</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={12} className="text-emerald-400" /> Event Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Clock size={12} className="text-emerald-400" /> Event Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM – 2:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" /> Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Camp Rotary / Islamic Center"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Event Details & Program Schedule
              </label>
              <textarea
                rows={3}
                placeholder="Describe the activities, itinerary, meeting spot, and parent instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <CheckSquare size={12} className="text-emerald-400" /> What to Bring / Required Items (1 per line)
              </label>
              <textarea
                rows={2}
                placeholder="Scout handbook, Class A uniform, water bottle, compass, sleeping bag, flashlight..."
                value={requiredItems}
                onChange={(e) => setRequiredItems(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-700/60">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save & Publish Event'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Layout: Events List & Selected Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar: Events List */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3 md:col-span-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
            Upcoming Events ({events.length})
          </h3>

          {loading ? (
            <div className="text-center py-6 text-slate-500 text-xs">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              No events scheduled yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {events.map((ev) => {
                const countdown = getEventCountdown(ev.date);
                const isSelected = selectedEvent?.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-700/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/40 border-slate-750 hover:border-slate-650'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar size={11} className="text-emerald-400" /> {ev.date}
                      </span>
                      {countdown && (
                        <span className={`text-[9px] px-2 py-0.2 rounded-full font-bold ${countdown.color}`}>
                          {countdown.label}
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-white line-clamp-1">{ev.title}</span>
                    {ev.location && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin size={10} className="text-slate-500 shrink-0" /> {ev.location}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel: Event Details */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl md:col-span-2 min-h-[400px]">
          {selectedEvent ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start gap-4 border-b border-slate-700 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      📅 {selectedEvent.date}
                    </span>
                    {selectedEvent.time && (
                      <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-750">
                        ⏰ {selectedEvent.time}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-white text-lg">{selectedEvent.title}</h3>
                  {selectedEvent.location && (
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-emerald-400" />
                      <span>{selectedEvent.location}</span>
                    </p>
                  )}
                </div>

                {isLeader && (
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(selectedEvent)}
                      className="bg-slate-700 hover:bg-slate-650 text-slate-200 p-2 rounded-lg transition cursor-pointer"
                      title="Edit event"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="bg-red-950/30 hover:bg-red-900/30 text-red-400 p-2 rounded-lg transition cursor-pointer border border-red-900/20"
                      title="Delete event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── SCOUT VIEW: EVENT COUNTDOWN & LOGISTICS HERO ── */}
              {isScout && selectedCountdown && (
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-lg shadow-emerald-950/40">
                        <Clock size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Days Remaining
                        </span>
                        <h4 className="text-lg font-black text-white flex items-center gap-2">
                          <span>{selectedCountdown.label}</span>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Date</span>
                        <strong className="text-xs font-mono text-emerald-400">{selectedEvent.date}</strong>
                      </div>
                      {selectedEvent.time && (
                        <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Time</span>
                          <strong className="text-xs font-mono text-slate-200">{selectedEvent.time}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5 truncate">
                        <MapPin size={14} className="text-emerald-400 shrink-0" />
                        <span>{selectedEvent.location}</span>
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-bold shrink-0 flex items-center gap-1 text-[11px]"
                      >
                        <span>Open in Maps</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ── LEADER VIEW ONLY: KASHAFVOICE V3.0 WHATSAPP PARENT MESSENGER CARD ── */}
              {isLeader && (
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <span>WhatsApp Parent Announcement</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                            KashafVoice v3.0
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">Pre-formatted event message ready to share with parents.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleCopyWhatsApp(customWhatsAppMsg)}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        {copiedSuccess ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedSuccess ? 'Copied!' : 'Copy Text'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(customWhatsAppMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                      >
                        <Send size={13} />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Message Editor / Preview */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Live Message Preview (Editable):</span>
                      <button
                        onClick={() => setCustomWhatsAppMsg(formatKashafEventWhatsApp(selectedEvent))}
                        className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles size={11} /> Reset to Default Template
                      </button>
                    </div>

                    <textarea
                      rows={9}
                      value={customWhatsAppMsg}
                      onChange={(e) => setCustomWhatsAppMsg(e.target.value)}
                      className="w-full bg-[#0b141a] border border-[#222e35] text-[#e9edef] rounded-xl p-3.5 text-xs font-sans leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Event Description */}
              {selectedEvent.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Event Details & Program
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/40 p-4 rounded-xl border border-slate-750">
                    {applyIslamicTransliteration(selectedEvent.description)}
                  </p>
                </div>
              )}

              {/* Required Items / What to Bring */}
              {selectedEvent.requiredItems && (
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-750">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare size={13} /> What to Bring / Required Gear
                  </h4>
                  <ul className="space-y-1 mt-1">
                    {selectedEvent.requiredItems.split('\n').map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 h-full py-16 space-y-2.5">
              <Calendar size={48} className="opacity-20" />
              <p className="text-xs italic text-slate-455">Select an event from the calendar list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
