import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot 
} from 'firebase/firestore';
import {
  Megaphone,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Users,
  UserCheck,
  Shield,
  Clock,
  Search,
  Filter,
  Trash2,
  Copy,
  ExternalLink,
  FileText,
  Calendar,
  Award,
  BookOpen,
  MapPin,
  Check,
  Share2,
  X,
  Layers,
  Flame,
  Zap,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Paperclip,
  Plus,
  RefreshCw,
  LayoutGrid,
  Radio,
  Bell
} from 'lucide-react';
import { publishTroopBroadcast, deleteTroopBroadcast } from '../services/broadcastService';
import { 
  isSuperUser, 
  getAccessiblePatrols, 
  isScoutInPatrol 
} from '../utils/patrolScoping';

export const BROADCAST_CATEGORIES = [
  { id: 'General Announcement', label: 'General Announcement', icon: '📢', color: 'bg-slate-800 text-slate-200 border-slate-750' },
  { id: 'Event / Outing Info', label: 'Event / Outing Info', icon: '⛺', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' },
  { id: 'Advancement Update', label: 'Advancement Update', icon: '⭐', color: 'bg-amber-950/80 text-amber-300 border-amber-500/50' },
  { id: 'Urgent Notice', label: 'Urgent Notice', icon: '🚨', color: 'bg-red-950/80 text-red-300 border-red-500/50' },
  { id: 'Waiver / Form Due', label: 'Waiver / Form Due', icon: '📋', color: 'bg-purple-950/80 text-purple-300 border-purple-500/50' },
  { id: 'Halqa & Spiritual Circle', label: 'Halqa & Spiritual Circle', icon: '🕌', color: 'bg-sky-950/80 text-sky-300 border-sky-500/50' }
];

export const PRESET_TEMPLATES = [
  {
    id: 'campout_gear',
    title: 'Important Update: Campout Schedule & Gear Checklist',
    category: 'Event / Outing Info',
    priority: 'high',
    targetAudience: 'all',
    targetScope: 'troop_wide',
    summary: 'Essential schedule, departure timing, and mandatory gear list for upcoming outdoor campouts.',
    message: `Assalāmu ʿAlaykum Dhulfiqār Families,\n\nPlease review the updated weekend campout schedule and required gear checklist:\n\n• Departure: Friday at 5:30 PM from Troop Headquarters (Highview Elementary)\n• Return: Sunday at 12:00 PM\n• Required Gear: Complete Class A & B uniform, sleeping bag, flashlight, personal mess kit, water bottle, and scout handbook.\n\nAll scouts must have their Annual Health Record (Parts A & B) on file prior to departure.`,
    attachmentLabel: 'Campout Packing Guide & Checklist',
    attachmentUrl: 'https://scouting.org'
  },
  {
    id: 'court_of_honor',
    title: 'Court of Honor Advancement Ceremony & Inspection',
    category: 'Advancement Update',
    priority: 'normal',
    targetAudience: 'all',
    targetScope: 'troop_wide',
    summary: 'Invitations for families to celebrate scout rank badges, merit badges, and recognitions.',
    message: `Assalāmu ʿAlaykum Dhulfiqār Families,\n\nWe are pleased to invite all parents, scouts, and family members to our upcoming Court of Honor Advancement Ceremony.\n\n• Date: This Friday at 6:30 PM\n• Location: Main Assembly Hall (Highview Elementary)\n• Attire: Full Class A Field Uniform (clean neckerchief, sash, badges pinned)\n\nWe will celebrate our candidate rank advancements, merit badge credentials, and special achievements. Light refreshments will be served.`,
    attachmentLabel: 'Advancement Program Agenda',
    attachmentUrl: ''
  },
  {
    id: 'health_records',
    title: 'Urgent: Annual BSA Health Record Part A/B/C Due',
    category: 'Waiver / Form Due',
    priority: 'urgent',
    targetAudience: 'parents_only',
    targetScope: 'troop_wide',
    summary: 'Critical reminder for parents to submit required annual medical forms and emergency contacts.',
    message: `Assalāmu ʿAlaykum Parents & Guardians,\n\nThis is a critical reminder that updated annual health records (BSA Parts A, B, and C) and emergency contact authorizations must be submitted to the Parent Portal before this Sunday.\n\nPlease log in to the Parent Hub, review your scout's digital medical profile, and upload the signed medical form to ensure eligibility for upcoming troop activities and campouts.`,
    attachmentLabel: 'Download Health Record Form A/B/C',
    attachmentUrl: 'https://www.scouting.org/health-and-safety/ahmr/'
  },
  {
    id: 'halqa_circle',
    title: 'Weekly Tarbiyah Halqa & Islamic Knowledge Circle',
    category: 'Halqa & Spiritual Circle',
    priority: 'normal',
    targetAudience: 'all',
    targetScope: 'troop_wide',
    summary: 'Weekly Quran reflection, Ahlul Bayt role models, and character building sessions.',
    message: `Assalāmu ʿAlaykum Dhulfiqār Scouts & Parents,\n\nJoin us this Friday for our weekly Tarbiyah Halqa and Islamic Knowledge session:\n\n• Topic: Lessons of Courage & Brotherhood from Hazrat Abbas (A.S.)\n• Schedule: 7:00 PM – 7:45 PM (immediately following congregational Maghribayn prayers)\n• Note: Scouts preparing for Islamic Knowledge rank checkpoints are encouraged to bring their study notes.`,
    attachmentLabel: 'Halqa Study Summary Notes',
    attachmentUrl: ''
  },
  {
    id: 'plc_meeting',
    title: 'Patrol Leaders Council (PLC) Monthly Planning',
    category: 'General Announcement',
    priority: 'high',
    targetAudience: 'scouts_only',
    targetScope: 'troop_wide',
    summary: 'Coordination meeting for Senior Patrol Leaders, Patrol Leaders, and Scribes.',
    message: `Assalāmu ʿAlaykum Patrol Leaders & Troop Youth Staff,\n\nThe monthly Patrol Leaders Council (PLC) will convene this Thursday at 6:00 PM via Troop Conference.\n\n• Agenda: Patrol duty rosters for the next campout, attendance tracking, and youth leadership assignments.\n• Preparation: Each Patrol Leader must bring an updated headcount of their patrol members.`,
    attachmentLabel: 'PLC Meeting Agenda Sheet',
    attachmentUrl: ''
  }
];

export default function LeaderBroadcastCenter({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'executive' || currentUser?.isExecutive || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster';

  // Navigation View: 'feed' | 'compose' | 'templates'
  const [activeView, setActiveView] = useState('feed');

  // Firestore Subscriptions
  const [broadcasts, setBroadcasts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Composer State
  const [composerMode, setComposerMode] = useState('compose'); // 'compose' | 'preview'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Announcement');
  const [priority, setPriority] = useState('normal'); // 'normal' | 'high' | 'urgent'
  const [targetScope, setTargetScope] = useState('troop_wide'); // 'troop_wide' | 'patrol_specific'
  const [targetGroupId, setTargetGroupId] = useState('');
  const [targetAudience, setTargetAudience] = useState('all'); // 'all' | 'parents_only' | 'scouts_only'
  const [message, setMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentLabel, setAttachmentLabel] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');
  const [publishStats, setPublishStats] = useState(null);
  const [formError, setFormError] = useState('');
  const [copiedBroadcastId, setCopiedBroadcastId] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  // Feed Filter States
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState('all');
  const [feedPriorityFilter, setFeedPriorityFilter] = useState('all');
  const [feedScopeFilter, setFeedScopeFilter] = useState('all');

  // 1. Subscribe to /troop_broadcasts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'troop_broadcasts'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setBroadcasts(list);
      setLoading(false);
    }, (err) => {
      console.warn("Failed to subscribe to troop_broadcasts:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Subscribe to /groups
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    return () => unsub();
  }, []);

  // 3. Subscribe to /users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const accessiblePatrols = useMemo(() => getAccessiblePatrols(currentUser, groups), [currentUser, groups]);

  // Real-time Estimated Audience Reach
  const estimatedReach = useMemo(() => {
    const totalParents = users.filter(u => u.role === 'parent').length;
    const totalScouts = users.filter(u => u.role === 'scout').length;

    let targetParents = totalParents;
    let targetScouts = totalScouts;
    let targetStreams = groups.length;

    if (targetScope === 'patrol_specific' && targetGroupId) {
      targetStreams = 1;
      targetScouts = users.filter(u => u.role === 'scout' && isScoutInPatrol(u, targetGroupId, groups)).length;
      targetParents = users.filter(u => {
        if (u.role !== 'parent') return false;
        const linkedIds = u.linkedScoutIds || [];
        return users.some(s => 
          s.role === 'scout' && 
          (linkedIds.includes(s.uid) || s.parentEmail === u.email || (Array.isArray(s.parentUids) && s.parentUids.includes(u.uid))) && 
          isScoutInPatrol(s, targetGroupId, groups)
        );
      }).length;
    }

    if (targetAudience === 'parents_only') targetScouts = 0;
    if (targetAudience === 'scouts_only') targetParents = 0;

    return {
      parents: targetParents,
      scouts: targetScouts,
      streams: targetStreams
    };
  }, [users, groups, targetScope, targetGroupId, targetAudience]);

  // Handle Preset Template Selection
  const handleApplyPreset = (tpl) => {
    setTitle(tpl.title);
    setCategory(tpl.category);
    setPriority(tpl.priority);
    setTargetAudience(tpl.targetAudience);
    setTargetScope(tpl.targetScope || 'troop_wide');
    setMessage(tpl.message);
    setAttachmentLabel(tpl.attachmentLabel || '');
    setAttachmentUrl(tpl.attachmentUrl || '');
    if (tpl.attachmentUrl) setShowAttachments(true);
    setFormError('');
    setActiveView('compose');
    setComposerMode('compose');
  };

  // Quick Formatting Helpers for Message
  const handleInsertFormatting = (type) => {
    let insertText = '';
    switch (type) {
      case 'bullet':
        insertText = '\n• ';
        break;
      case 'date_time':
        insertText = `\n📅 Date: ${new Date().toISOString().split('T')[0]}\n⏰ Time: 6:30 PM – 9:00 PM\n📍 Location: Troop Headquarters (Highview Elementary)`;
        break;
      case 'gear':
        insertText = '\n🎒 Required Gear:\n1. Full Class A Field Uniform\n2. Scout Handbook & Notebook\n3. Personal Water Bottle';
        break;
      case 'closing':
        insertText = `\n\nJazākum Allāhu Khayran,\n${currentUser?.fullName || currentUser?.username || 'Troop Leadership'}\nDhulfiqār Scouts BSA`;
        break;
      default:
        break;
    }
    setMessage(prev => prev + insertText);
  };

  // Submit Broadcast Handler
  const handlePublishBroadcast = async (e) => {
    e.preventDefault();
    setFormError('');
    setPublishSuccessMsg('');
    setPublishStats(null);

    if (!title.trim()) {
      setFormError('Please enter a clear headline / title for this broadcast.');
      return;
    }
    if (!message.trim()) {
      setFormError('Please enter the announcement message content.');
      return;
    }

    setIsPublishing(true);

    try {
      const selectedGroup = groups.find(g => g.id === targetGroupId);
      const res = await publishTroopBroadcast({
        title: title.trim(),
        category,
        priority,
        targetScope,
        targetGroupId: targetScope === 'patrol_specific' ? targetGroupId : null,
        targetGroupName: selectedGroup ? selectedGroup.name : 'Entire Troop',
        targetAudience,
        message: message.trim(),
        attachmentUrl: attachmentUrl.trim(),
        attachmentLabel: attachmentLabel.trim(),
        authorId: currentUser?.uid || '',
        authorName: currentUser?.fullName || currentUser?.username || 'Scoutmaster',
        authorRole: currentUser?.leaderPosition || (isOwner ? 'Troop Owner' : 'Scoutmaster'),
        authorEmail: currentUser?.email || ''
      });

      setPublishStats(res.reachStats);
      setPublishSuccessMsg(`✓ Broadcast published! Dispatched to ${res.reachStats.parentsCount} parents, ${res.reachStats.scoutsCount} scouts, and ${res.reachStats.streamsCount} patrol streams.`);
      
      // Reset form
      setTitle('');
      setMessage('');
      setAttachmentUrl('');
      setAttachmentLabel('');
      setShowAttachments(false);
      setPriority('normal');
      setTargetScope('troop_wide');
      setTargetGroupId('');
      setTargetAudience('all');
      setComposerMode('compose');

      // Switch back to Feed view so leader sees the new broadcast
      setTimeout(() => {
        setActiveView('feed');
      }, 1200);

      setTimeout(() => {
        setPublishSuccessMsg('');
      }, 6000);
    } catch (err) {
      console.error("Broadcast publish failed:", err);
      setFormError(err.message || 'Failed to publish broadcast.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Delete Broadcast Handler
  const handleDeleteBroadcast = async (bId) => {
    if (!window.confirm("Are you sure you want to permanently delete this broadcast announcement?")) return;
    try {
      await deleteTroopBroadcast(bId, currentUser);
    } catch (err) {
      alert("Failed to delete broadcast: " + err.message);
    }
  };

  // Copy Broadcast Text to Clipboard
  const handleCopyText = (b) => {
    const fullText = `📢 *[${b.category?.toUpperCase() || 'ANNOUNCEMENT'}] ${b.title}*\n\n${b.message}${b.attachmentUrl ? `\n\n🔗 Attachment: ${b.attachmentLabel || 'Link'} (${b.attachmentUrl})` : ''}\n\n— ${b.authorName} (${b.authorRole || 'Leader'})\nDhulfiqār Scouts BSA`;
    navigator.clipboard.writeText(fullText);
    setCopiedBroadcastId(b.id || b.broadcastId);
    setTimeout(() => setCopiedBroadcastId(null), 2500);
  };

  // Toggle card expansion
  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Broadcast Feed List
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter(b => {
      // 1. Category Filter
      if (feedCategoryFilter !== 'all' && b.category !== feedCategoryFilter) return false;

      // 2. Priority Filter
      if (feedPriorityFilter !== 'all' && b.priority !== feedPriorityFilter) return false;

      // 3. Scope Filter
      if (feedScopeFilter === 'troop_wide' && b.targetScope !== 'troop_wide') return false;
      if (feedScopeFilter === 'patrol_specific' && b.targetScope !== 'patrol_specific') return false;

      // 4. Search Query
      if (feedSearchQuery.trim()) {
        const q = feedSearchQuery.toLowerCase();
        const titleMatch = (b.title || '').toLowerCase().includes(q);
        const msgMatch = (b.message || '').toLowerCase().includes(q);
        const authorMatch = (b.authorName || '').toLowerCase().includes(q);
        const catMatch = (b.category || '').toLowerCase().includes(q);
        if (!titleMatch && !msgMatch && !authorMatch && !catMatch) return false;
      }

      return true;
    });
  }, [broadcasts, feedCategoryFilter, feedPriorityFilter, feedScopeFilter, feedSearchQuery]);

  const urgentCount = broadcasts.filter(b => b.priority === 'urgent' || b.priority === 'high').length;
  const parentCount = users.filter(u => u.role === 'parent').length;
  const scoutCount = users.filter(u => u.role === 'scout').length;

  return (
    <div className="space-y-5 font-sans max-w-6xl mx-auto pb-12">
      
      {/* ── 1. CLEAN HERO HEADER & METRICS ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-emerald-950/40">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                  Troop Communications
                </span>
                <span className="text-xs text-slate-400 font-mono">Simultaneous Fan-Out</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Troop Broadcast & Announcements Hub
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Publish announcements and urgent notices instantly across Parent Feeds, Scout Alerts, and Patrol Streams.
              </p>
            </div>
          </div>

          {/* Quick CTA Button */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {activeView !== 'compose' ? (
              <button
                type="button"
                onClick={() => {
                  setActiveView('compose');
                  setComposerMode('compose');
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02]"
              >
                <Plus size={16} />
                <span>+ New Broadcast</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('feed')}
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs px-4 py-3 rounded-2xl transition cursor-pointer border border-slate-700 flex items-center gap-1.5"
              >
                <span>View Sent Broadcasts</span>
              </button>
            )}
          </div>
        </div>

        {/* Compact Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-medium">📢 Total Sent:</span>
            <strong className="text-white font-bold font-mono">{broadcasts.length}</strong>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-medium">👨‍👩‍👧 Parents:</span>
            <strong className="text-emerald-400 font-bold font-mono">~{parentCount} Reach</strong>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-medium">⚜️ Scouts:</span>
            <strong className="text-sky-400 font-bold font-mono">~{scoutCount} Reach</strong>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] font-medium">🚨 Priority Alerts:</span>
            <strong className="text-amber-400 font-bold font-mono">{urgentCount}</strong>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN ORGANIZATIONAL VIEW SWITCHER ── */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('feed')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeView === 'feed'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 font-black'
                : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-750'
            }`}
          >
            <Megaphone size={15} />
            <span>📬 Sent Broadcasts ({broadcasts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('compose');
              setComposerMode('compose');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeView === 'compose'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 font-black'
                : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-750'
            }`}
          >
            <Edit3 size={15} />
            <span>✏️ Compose Broadcast</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('templates')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeView === 'templates'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/40 font-black'
                : 'bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-750'
            }`}
          >
            <Sparkles size={15} className="text-amber-300" />
            <span>⚡ Ready Templates ({PRESET_TEMPLATES.length})</span>
          </button>
        </div>
      </div>

      {/* Global Action Notifications */}
      {publishSuccessMsg && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs font-bold text-emerald-200 animate-fadeIn flex items-center gap-3 shadow-xl">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span>{publishSuccessMsg}</span>
        </div>
      )}

      {formError && (
        <div className="p-3.5 bg-rose-950/80 border border-rose-500/60 rounded-2xl text-xs text-rose-300 flex items-center gap-2 animate-fadeIn shadow-lg">
          <AlertTriangle size={16} className="text-rose-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ──────────────── TAB 1: SENT BROADCASTS ARCHIVE & FEED ──────────────── */}
      {activeView === 'feed' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Feed Filter & Search Bar */}
          <div className="bg-slate-850 border border-slate-755 p-3.5 sm:p-4 rounded-2xl shadow-lg space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search broadcasts by headline, message, or author..."
                  value={feedSearchQuery}
                  onChange={(e) => setFeedSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-755 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* Priority & Scope Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={feedPriorityFilter}
                  onChange={(e) => setFeedPriorityFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-755 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                >
                  <option value="all">Priority: All</option>
                  <option value="urgent">🚨 Urgent Only</option>
                  <option value="high">⚡ High Priority</option>
                  <option value="normal">Normal</option>
                </select>

                <select
                  value={feedScopeFilter}
                  onChange={(e) => setFeedScopeFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-755 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                >
                  <option value="all">Scope: All</option>
                  <option value="troop_wide">⚡ Entire Troop</option>
                  <option value="patrol_specific">👥 Patrol Specific</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setFeedCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer border ${
                  feedCategoryFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-755 hover:text-white'
                }`}
              >
                All Categories ({broadcasts.length})
              </button>
              {BROADCAST_CATEGORIES.map(cat => {
                const count = broadcasts.filter(b => b.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFeedCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer border flex items-center gap-1 ${
                      feedCategoryFilter === cat.id
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-755 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-[9px] bg-slate-950/60 px-1.5 py-0.2 rounded-full font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Broadcasts Feed List */}
          {filteredBroadcasts.length === 0 ? (
            <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center space-y-3 text-slate-400">
              <Megaphone size={40} className="mx-auto text-emerald-400 opacity-60" />
              <h4 className="text-base font-bold text-white">No Broadcasts Found</h4>
              <p className="text-xs max-w-md mx-auto">
                {feedCategoryFilter !== 'all' || feedSearchQuery.trim() || feedPriorityFilter !== 'all'
                  ? 'No announcements match your search or filter criteria.'
                  : 'No announcements have been dispatched yet. Click "+ New Broadcast" to send an update.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveView('compose');
                  setComposerMode('compose');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 mt-2"
              >
                <Plus size={14} />
                <span>Create New Announcement</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBroadcasts.map(b => {
                const catObj = BROADCAST_CATEGORIES.find(c => c.id === b.category) || BROADCAST_CATEGORIES[0];
                const isUrgent = b.priority === 'urgent';
                const isHigh = b.priority === 'high';
                const isExpanded = !!expandedCards[b.id || b.broadcastId];
                const waText = encodeURIComponent(
                  `📢 *[Dhulfiqār Scouts BSA]*\n*${b.title}*\n\n${b.message}${b.attachmentUrl ? `\n\n🔗 Attachment: ${b.attachmentUrl}` : ''}\n\n— *${b.authorName} (${b.authorRole || 'Leader'})*`
                );

                const isLongMessage = b.message && b.message.length > 280;

                return (
                  <div
                    key={b.id || b.broadcastId}
                    className={`border-2 rounded-3xl p-5 sm:p-6 transition shadow-xl space-y-4 ${
                      isUrgent
                        ? 'bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-rose-500/60 shadow-rose-950/30'
                        : isHigh
                        ? 'bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/50 shadow-amber-950/20'
                        : 'bg-slate-850 border-slate-755 hover:border-emerald-500/40'
                    }`}
                  >
                    {/* Header Row: Category Badge, Priority Pill, Scope & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${catObj.color}`}>
                          <span>{catObj.icon}</span>
                          <span>{b.category || 'Announcement'}</span>
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isUrgent
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-900 text-slate-300 border-slate-750'
                        }`}>
                          {b.priority?.toUpperCase() || 'NORMAL'}
                        </span>

                        <span className="text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-750 px-2 py-0.5 rounded-full">
                          {b.targetScope === 'patrol_specific' ? `👥 ${b.targetGroupName || 'Patrol'}` : '⚡ Entire Troop'}
                        </span>

                        <span className="text-[10px] text-emerald-400 font-mono">
                          {b.targetAudience === 'parents_only' ? '👨‍👩‍👧 Parents' : b.targetAudience === 'scouts_only' ? '⚜️ Scouts' : '👨‍👩‍👧 Parents & ⚜️ Scouts'}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock size={12} className="text-slate-500" />
                        <span>{new Date(b.createdAt || 0).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    {/* Headline & Body Text */}
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {b.title}
                      </h3>
                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                        {isLongMessage && !isExpanded ? `${b.message.substring(0, 280)}...` : b.message}
                      </div>

                      {isLongMessage && (
                        <button
                          type="button"
                          onClick={() => toggleCardExpansion(b.id || b.broadcastId)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Show Less' : 'Read Full Announcement'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                    </div>

                    {/* Attachment Resource if present */}
                    {b.attachmentUrl && (
                      <div className="pt-1">
                        <a
                          href={b.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          <Paperclip size={13} className="text-emerald-400" />
                          <span>{b.attachmentLabel || 'View Attachment / Document'}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    {/* Footer Action Toolbar */}
                    <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-400 text-[11px]">
                        Published by <strong className="text-slate-200">{b.authorName || 'Leadership'}</strong> ({b.authorRole || 'Leader'})
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* WhatsApp Broadcast Share */}
                        <a
                          href={`https://wa.me/?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          title="Share this broadcast to WhatsApp group"
                        >
                          <Share2 size={12} />
                          <span>WhatsApp</span>
                        </a>

                        {/* Copy Text Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyText(b)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedBroadcastId === (b.id || b.broadcastId) ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button (author or executive) */}
                        {(isExecutive || isOwner || currentUser?.uid === b.authorId) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteBroadcast(b.id || b.broadcastId)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-600 rounded-xl transition cursor-pointer"
                            title="Delete this broadcast"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 2: COMPOSE BROADCAST ──────────────── */}
      {activeView === 'compose' && (
        <div className="bg-slate-850 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-755 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Edit3 size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Compose & Publish Broadcast
                </h3>
                <p className="text-xs text-slate-400">
                  Select target audience and dispatch to all parent & scout feeds simultaneously.
                </p>
              </div>
            </div>

            {/* Compose / Live Preview Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-755 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setComposerMode('compose')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  composerMode === 'compose'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 size={13} />
                <span>Compose Form</span>
              </button>
              <button
                type="button"
                onClick={() => setComposerMode('preview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  composerMode === 'preview'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye size={13} />
                <span>Live Card Preview</span>
              </button>
            </div>
          </div>

          {composerMode === 'compose' ? (
            <form onSubmit={handlePublishBroadcast} className="space-y-4">
              
              {/* Row 1: Headline & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Broadcast Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mandatory Meeting: Friday Campout Departure Schedule"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                  >
                    {BROADCAST_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Audience, Patrol Scope & Priority Box */}
              <div className="bg-slate-900/90 border border-slate-755 p-4 rounded-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Scope */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase">
                      Patrol Scope *
                    </label>
                    <select
                      value={targetScope === 'patrol_specific' ? targetGroupId : 'troop_wide'}
                      onChange={(e) => {
                        if (e.target.value === 'troop_wide') {
                          setTargetScope('troop_wide');
                          setTargetGroupId('');
                        } else {
                          setTargetScope('patrol_specific');
                          setTargetGroupId(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                    >
                      {isSuperUser(currentUser) && (
                        <option value="troop_wide">⚡ Entire Troop (All Patrols)</option>
                      )}
                      {accessiblePatrols.map(g => (
                        <option key={g.id} value={g.id}>👥 {g.name} Patrol Only</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase">
                      Target Audience *
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                    >
                      <option value="all">👨‍👩‍👧 Parents & ⚜️ Scouts (Simultaneous)</option>
                      <option value="parents_only">👨‍👩‍👧 Parents Only</option>
                      <option value="scouts_only">⚜️ Scouts Only</option>
                    </select>
                  </div>

                  {/* Priority Level */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase">
                      Priority Level *
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'normal', label: 'Normal', color: priority === 'normal' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-950 text-slate-400 border-slate-800' },
                        { id: 'high', label: 'High', color: priority === 'high' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800' },
                        { id: 'urgent', label: '🚨 Urgent', color: priority === 'urgent' ? 'bg-rose-600 text-white border-rose-400 animate-pulse' : 'bg-slate-950 text-slate-400 border-slate-800' }
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPriority(p.id)}
                          className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${p.color}`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estimated Audience Reach Bar */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Zap size={14} className="text-amber-400 animate-pulse" />
                    <span>
                      Estimated Live Reach: <strong>~{estimatedReach.parents} Parents</strong>, <strong>~{estimatedReach.scouts} Scouts</strong>, and <strong>{estimatedReach.streams} Patrol Chat Stream{estimatedReach.streams !== 1 ? 's' : ''}</strong>.
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Instant Fan-out
                  </span>
                </div>
              </div>

              {/* Row 3: Message Body & Quick Formatting */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Broadcast Message Body *
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Quick Add:</span>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('bullet')}
                      className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition cursor-pointer"
                    >
                      + Bullet
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('date_time')}
                      className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition cursor-pointer"
                    >
                      + Schedule & Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('gear')}
                      className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition cursor-pointer"
                    >
                      + Gear List
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('closing')}
                      className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition cursor-pointer"
                    >
                      + Leadership Sign-off
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  required
                  placeholder="Enter detailed announcement message, meeting instructions, campout guidelines, or urgent notes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed shadow-inner"
                />
              </div>

              {/* Optional Attachment Link Section (Expandable) */}
              <div>
                {!showAttachments && !attachmentUrl ? (
                  <button
                    type="button"
                    onClick={() => setShowAttachments(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Paperclip size={13} />
                    <span>+ Attach Link or PDF Document URL</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Paperclip size={12} className="text-emerald-400" />
                          <span>Attachment / Resource URL</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachmentUrl('');
                            setAttachmentLabel('');
                            setShowAttachments(false);
                          }}
                          className="text-[10px] text-slate-500 hover:text-slate-300"
                        >
                          Remove
                        </button>
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/... or web link"
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase">
                        Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Download Packing Checklist PDF"
                        value={attachmentLabel}
                        onChange={(e) => setAttachmentLabel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-3.5 px-6 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isPublishing ? 'Publishing & Dispatching...' : '🚀 Publish & Broadcast Update'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setMessage('');
                    setAttachmentUrl('');
                    setAttachmentLabel('');
                    setFormError('');
                  }}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold px-4 py-3.5 rounded-2xl transition cursor-pointer border border-slate-700"
                >
                  Clear Form
                </button>
              </div>
            </form>
          ) : (
            /* Live Card Preview Mode */
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                👁️ Live Preview: This is how your broadcast will appear on Parent & Scout Feeds
              </span>

              <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl space-y-4 max-w-2xl mx-auto">
                <div className="flex justify-between items-start gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      priority === 'urgent' ? 'bg-red-950 text-red-300 border-red-500 animate-pulse' :
                      priority === 'high' ? 'bg-amber-950 text-amber-300 border-amber-500' :
                      'bg-slate-800 text-slate-200 border-slate-700'
                    }`}>
                      {priority === 'urgent' ? '🚨 URGENT NOTICE' : priority === 'high' ? '⚡ HIGH PRIORITY' : '📢 ANNOUNCEMENT'}
                    </span>

                    <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      {category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Just now
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-black text-white">
                    {title || 'Your Broadcast Headline'}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    {message || 'Your announcement message content will appear here...'}
                  </p>
                </div>

                {attachmentUrl && (
                  <div className="pt-1">
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-bold transition"
                    >
                      <Paperclip size={13} />
                      <span>{attachmentLabel || 'Open Attachment / Resource Document'}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span>By: <strong>{currentUser?.fullName || currentUser?.username || 'Troop Leader'}</strong> ({currentUser?.leaderPosition || 'Leader'})</span>
                  <span className="text-emerald-400 font-bold">
                    {targetScope === 'troop_wide' ? '⚡ Entire Troop' : '👥 Patrol Scoped'} &bull; {targetAudience === 'all' ? 'Parents & Scouts' : targetAudience === 'parents_only' ? 'Parents Only' : 'Scouts Only'}
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setComposerMode('compose')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  &larr; Return to Edit Message
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 3: READY TEMPLATES & PRESETS ──────────────── */}
      {activeView === 'templates' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-850 border border-slate-755 p-5 rounded-2xl space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={18} />
              <span>1-Click Ready Broadcast Templates</span>
            </h3>
            <p className="text-xs text-slate-300">
              Pick a pre-formatted template below to immediately populate the broadcast form with recommended schedules, gear lists, or medical reminders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_TEMPLATES.map((tpl) => {
              const catObj = BROADCAST_CATEGORIES.find(c => c.id === tpl.category) || BROADCAST_CATEGORIES[0];
              return (
                <div
                  key={tpl.id}
                  className="bg-slate-850 border border-slate-755 hover:border-amber-500/50 rounded-3xl p-5 shadow-lg space-y-3 flex flex-col justify-between transition hover:scale-[1.01]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${catObj.color}`}>
                        <span>{catObj.icon}</span>
                        <span>{tpl.category}</span>
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tpl.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : tpl.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-900 text-slate-300 border-slate-750'
                      }`}>
                        {tpl.priority.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white">
                      {tpl.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tpl.summary}
                    </p>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono line-clamp-3">
                      {tpl.message}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset(tpl)}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 mt-2"
                  >
                    <Sparkles size={14} />
                    <span>Use This Template & Edit</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
