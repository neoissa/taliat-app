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
  Eye,
  Edit3,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { publishTroopBroadcast, deleteTroopBroadcast } from '../services/broadcastService';

const BROADCAST_CATEGORIES = [
  { id: 'General Announcement', label: 'General Announcement', icon: '📢', color: 'bg-slate-800 text-slate-200 border-slate-700' },
  { id: 'Event / Outing Info', label: 'Event / Outing Info', icon: '⛺', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' },
  { id: 'Advancement Update', label: 'Advancement Update', icon: '⭐', color: 'bg-amber-950/80 text-amber-300 border-amber-500/50' },
  { id: 'Urgent Notice', label: 'Urgent Notice', icon: '🚨', color: 'bg-red-950/80 text-red-300 border-red-500/50' },
  { id: 'Waiver / Form Due', label: 'Waiver / Form Due', icon: '📋', color: 'bg-purple-950/80 text-purple-300 border-purple-500/50' },
  { id: 'Halqa & Spiritual Circle', label: 'Halqa & Spiritual Circle', icon: '🕌', color: 'bg-sky-950/80 text-sky-300 border-sky-500/50' }
];

const PRESET_TEMPLATES = [
  {
    title: 'Important Update: Campout Schedule & Gear Checklist',
    category: 'Event / Outing Info',
    priority: 'high',
    targetAudience: 'all',
    message: `Assalāmu ʿAlaykum Dhulfiqār Families,\n\nPlease review the updated weekend campout schedule and required gear checklist:\n\n• Departure: Friday at 5:30 PM from Troop Headquarters (Highview Elementary)\n• Return: Sunday at 12:00 PM\n• Required Gear: Complete Class A & B uniform, sleeping bag, flashlight, personal mess kit, water bottle, and scout handbook.\n\nAll scouts must have their Annual Health Record (Parts A & B) on file prior to departure.`,
    attachmentLabel: 'Campout Packing Guide & Checklist',
    attachmentUrl: 'https://scouting.org'
  },
  {
    title: 'Court of Honor Ceremony & Uniform Inspection',
    category: 'Advancement Update',
    priority: 'normal',
    targetAudience: 'all',
    message: `Assalāmu ʿAlaykum Dhulfiqār Families,\n\nWe are pleased to invite all parents, scouts, and family members to our upcoming Court of Honor Advancement Ceremony.\n\n• Date: This Friday at 6:30 PM\n• Location: Main Assembly Hall (Highview Elementary)\n• Attire: Full Class A Field Uniform (clean neckerchief, sash, badges pinned)\n\nWe will celebrate our candidate rank advancements, merit badge credentials, and special achievements. Refreshments will be served.`,
    attachmentLabel: 'Advancement Candidate Roster',
    attachmentUrl: ''
  },
  {
    title: 'Urgent: Annual BSA Health Record Part A/B/C Submission Required',
    category: 'Waiver / Form Due',
    priority: 'urgent',
    targetAudience: 'parents_only',
    message: `Assalāmu ʿAlaykum Parents & Guardians,\n\nThis is a critical reminder that updated annual health records and emergency contact forms must be submitted to the Parent Portal by this Sunday.\n\nPlease log in to the Parent Hub, review your scout's digital profile, and upload the signed medical form to ensure eligibility for upcoming outings.`,
    attachmentLabel: 'Download Health Record Form A/B/C',
    attachmentUrl: 'https://www.scouting.org/health-and-safety/ahmr/'
  }
];

export default function LeaderBroadcastCenter({ currentUser, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'executive' || currentUser?.isExecutive || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster';

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

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');
  const [publishStats, setPublishStats] = useState(null);
  const [formError, setFormError] = useState('');
  const [copiedBroadcastId, setCopiedBroadcastId] = useState(null);

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

  // Real-time Estimated Audience Reach
  const estimatedReach = useMemo(() => {
    const totalParents = users.filter(u => u.role === 'parent').length;
    const totalScouts = users.filter(u => u.role === 'scout').length;

    let targetParents = totalParents;
    let targetScouts = totalScouts;
    let targetStreams = groups.length;

    if (targetScope === 'patrol_specific' && targetGroupId) {
      targetStreams = 1;
      targetScouts = users.filter(u => u.role === 'scout' && (u.groupId === targetGroupId || u.patrolId === targetGroupId)).length;
      targetParents = users.filter(u => {
        if (u.role !== 'parent') return false;
        const linkedIds = u.linkedScoutIds || [];
        return users.some(s => 
          s.role === 'scout' && 
          (linkedIds.includes(s.uid) || s.parentEmail === u.email) && 
          (s.groupId === targetGroupId || s.patrolId === targetGroupId)
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
    setMessage(tpl.message);
    setAttachmentLabel(tpl.attachmentLabel || '');
    setAttachmentUrl(tpl.attachmentUrl || '');
    setFormError('');
  };

  // Quick Formatting Helpers for Message
  const handleInsertFormatting = (type) => {
    let insertText = '';
    switch (type) {
      case 'bullet':
        insertText = '\n• ';
        break;
      case 'date_time':
        insertText = `\n📅 Date: ${new Date().toISOString().split('T')[0]}\n⏰ Time: 6:30 PM – 9:30 PM\n📍 Location: Troop Headquarters (Highview Elementary)`;
        break;
      case 'gear':
        insertText = '\n🎒 Required Gear & Checklist:\n1. Complete Class A Uniform\n2. Scout Handbook & Pen\n3. Water Bottle';
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
      setFormError('Please provide a broadcast headline / title.');
      return;
    }
    if (!message.trim()) {
      setFormError('Please enter the broadcast message body.');
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
      setPublishSuccessMsg(`✓ Broadcast published successfully! Dispatched to ${res.reachStats.parentsCount} parents, ${res.reachStats.scoutsCount} scouts, and ${res.reachStats.streamsCount} patrol streams.`);
      
      // Reset form
      setTitle('');
      setMessage('');
      setAttachmentUrl('');
      setAttachmentLabel('');
      setPriority('normal');
      setTargetScope('troop_wide');
      setTargetGroupId('');
      setTargetAudience('all');
      setComposerMode('compose');

      setTimeout(() => {
        setPublishSuccessMsg('');
      }, 5000);
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

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-755 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
            <Megaphone size={24} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                Multi-Channel Update Publisher
              </span>
              <span className="text-xs text-slate-400 font-mono">Simultaneous Fan-Out Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Troop Broadcast & Update Publisher
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Instantly broadcast announcements, event gear checklists, and urgent notices across Parent Action Centers, Scout Alert Feeds, Patrol Chat Streams, and Email pipelines.
            </p>
          </div>
        </div>

        {/* Live Delivery Channels Status Indicator */}
        <div className="bg-slate-950/80 border border-slate-755 p-3 rounded-2xl space-y-1.5 shrink-0 self-start md:self-auto shadow-inner text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Delivery Channels
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Parents Feed
            </span>
            <span className="text-sky-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Scout Feed
            </span>
            <span className="text-purple-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Patrol Chats
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Email Queue
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. QUICK KPI TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            📢 Total Broadcasts
          </span>
          <strong className="text-2xl font-black text-white font-mono block">
            {broadcasts.length}
          </strong>
          <span className="text-[10px] text-emerald-400">Published updates</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            👨‍👩‍👧 Family Reach
          </span>
          <strong className="text-2xl font-black text-emerald-300 font-mono block">
            {users.filter(u => u.role === 'parent').length}
          </strong>
          <span className="text-[10px] text-slate-400">Registered parent accounts</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            ⚜️ Scout Reach
          </span>
          <strong className="text-2xl font-black text-sky-300 font-mono block">
            {users.filter(u => u.role === 'scout').length}
          </strong>
          <span className="text-[10px] text-slate-400">Active youth members</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-md space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            🚨 High & Urgent
          </span>
          <strong className="text-2xl font-black text-amber-300 font-mono block">
            {broadcasts.filter(b => b.priority === 'urgent' || b.priority === 'high').length}
          </strong>
          <span className="text-[10px] text-slate-400">Priority dispatches</span>
        </div>
      </div>

      {/* ── 3. BROADCAST COMPOSER & LIVE PREVIEW ── */}
      <div className="bg-slate-850 border border-slate-755 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-755 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Compose & Broadcast Update</span>
              </h3>
              <p className="text-xs text-slate-400">
                Draft your message, select scope, and push to target feeds instantly.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
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
              <span>Compose</span>
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

        {/* Quick Template Presets Bar */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Template Starters:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(tpl)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-755 hover:border-emerald-500/50 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>{tpl.category === 'Event / Outing Info' ? '⛺' : tpl.category === 'Advancement Update' ? '🎖️' : '📋'}</span>
                <span className="truncate max-w-[220px]">{tpl.title}</span>
              </button>
            ))}
          </div>
        </div>

        {formError && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/60 rounded-2xl text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
            <AlertTriangle size={16} className="text-rose-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {publishSuccessMsg && (
          <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs font-bold text-emerald-200 animate-fadeIn flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div className="space-y-0.5">
              <span>{publishSuccessMsg}</span>
            </div>
          </div>
        )}

        {composerMode === 'compose' ? (
          <form onSubmit={handlePublishBroadcast} className="space-y-4">
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Broadcast Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Important Update: Campout Schedule & Gear Checklist"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {BROADCAST_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scope, Audience & Priority Selector Grid */}
            <div className="bg-slate-900/90 border border-slate-755 p-4 rounded-2xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Target Patrol Scope */}
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
                  >
                    <option value="troop_wide">⚡ Entire Troop (All Patrols)</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>👥 {g.name} Patrol Only</option>
                    ))}
                  </select>
                </div>

                {/* 2. Target Audience Roles */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase">
                    Target Audience *
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
                  >
                    <option value="all">👨‍👩‍👧 Parents & ⚜️ Scouts (Simultaneous)</option>
                    <option value="parents_only">👨‍👩‍👧 Parents Only</option>
                    <option value="scouts_only">⚜️ Scouts Only</option>
                  </select>
                </div>

                {/* 3. Priority Level */}
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

              {/* Real-time Estimated Reach Box */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Zap size={14} className="text-amber-400 animate-pulse" />
                  <span>
                    Estimated Reach: <strong>~{estimatedReach.parents} Parents</strong>, <strong>~{estimatedReach.scouts} Scouts</strong>, and <strong>{estimatedReach.streams} Patrol Chat Stream{estimatedReach.streams !== 1 ? 's' : ''}</strong>.
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Live Dispatch
                </span>
              </div>
            </div>

            {/* Message Body & Formatting Toolset */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Broadcast Message Content *
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Quick Inserts:</span>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('bullet')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition"
                  >
                    + Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('date_time')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition"
                  >
                    + Date / Venue
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('gear')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition"
                  >
                    + Gear Checklist
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('closing')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg transition"
                  >
                    + Leadership Sign-off
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                required
                placeholder="Enter detailed announcement message, program instructions, schedule, or campout details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed shadow-inner"
              />
            </div>

            {/* Optional Attachment Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
                  <Paperclip size={12} className="text-emerald-400" />
                  <span>Attachment / Resource URL (Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or external link"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                  Attachment Button Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Download Campout Gear Checklist PDF"
                  value={attachmentLabel}
                  onChange={(e) => setAttachmentLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isPublishing}
                className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-3.5 px-6 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 disabled:opacity-50"
              >
                <Send size={15} />
                <span>{isPublishing ? 'Publishing & Dispatching Feeds...' : '🚀 Publish & Broadcast Update'}</span>
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
              👁️ Live Feed Preview: This is how your update will render on Parent & Scout Dashboards
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
                  {message || 'Your broadcast message content will appear here...'}
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
                    <span>{attachmentLabel || 'Open Attachment / Resource'}</span>
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
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
              >
                &larr; Return to Composer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. PUBLISHED BROADCASTS ARCHIVE & FEED ── */}
      <div className="space-y-4">
        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setFeedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                feedCategoryFilter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-755 hover:text-white'
              }`}
            >
              All Broadcasts ({broadcasts.length})
            </button>
            {BROADCAST_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFeedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                  feedCategoryFilter === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-755 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span> <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={13} />
            <input
              type="text"
              placeholder="Search in broadcast archive..."
              value={feedSearchQuery}
              onChange={(e) => setFeedSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-755 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Broadcast Feed List */}
        {filteredBroadcasts.length === 0 ? (
          <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center space-y-2 text-slate-400">
            <Megaphone size={36} className="mx-auto text-emerald-400 opacity-60" />
            <h4 className="text-sm font-bold text-white">No Broadcasts Found</h4>
            <p className="text-xs max-w-sm mx-auto">
              {feedCategoryFilter !== 'all' || feedSearchQuery.trim()
                ? 'No announcements match your current filter criteria.'
                : 'No announcements have been published to the troop yet. Use the composer above to broadcast an update.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredBroadcasts.map(b => {
              const catObj = BROADCAST_CATEGORIES.find(c => c.id === b.category) || BROADCAST_CATEGORIES[0];
              const isUrgent = b.priority === 'urgent';
              const isHigh = b.priority === 'high';
              const waText = encodeURIComponent(
                `📢 *[Dhulfiqār Scouts BSA]*\n*${b.title}*\n\n${b.message}${b.attachmentUrl ? `\n\n🔗 Attachment: ${b.attachmentUrl}` : ''}\n\n— *${b.authorName} (${b.authorRole || 'Leader'})*`
              );

              return (
                <div
                  key={b.id || b.broadcastId}
                  className={`border rounded-3xl p-5 sm:p-6 transition shadow-lg space-y-4 ${
                    isUrgent
                      ? 'bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-rose-500/60 shadow-rose-950/30'
                      : isHigh
                      ? 'bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/50 shadow-amber-950/20'
                      : 'bg-slate-850 border-slate-755 hover:border-slate-650'
                  }`}
                >
                  {/* Top Row: Category, Priority, Date, Scope */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${catObj.color}`}>
                        <span>{catObj.icon}</span>
                        <span>{b.category || 'Announcement'}</span>
                      </span>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-900 text-slate-300 border-slate-750'
                      }`}>
                        {b.priority?.toUpperCase() || 'NORMAL'}
                      </span>

                      <span className="text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-750 px-2.5 py-0.5 rounded-full">
                        {b.targetScope === 'patrol_specific' ? `👥 ${b.targetGroupName || 'Patrol'}` : '⚡ Entire Troop'}
                      </span>

                      <span className="text-[10px] text-emerald-400 font-mono">
                        {b.targetAudience === 'parents_only' ? '👨‍👩‍👧 Parents Only' : b.targetAudience === 'scouts_only' ? '⚜️ Scouts Only' : '👨‍👩‍👧 Parents & ⚜️ Scouts'}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      📅 {new Date(b.createdAt || 0).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Broadcast Headline & Message Body */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                      {b.message}
                    </p>
                  </div>

                  {/* Attachment Card if present */}
                  {b.attachmentUrl && (
                    <div className="pt-1">
                      <a
                        href={b.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Paperclip size={14} className="text-emerald-400" />
                        <span>{b.attachmentLabel || 'View Attachment / Resource Document'}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {/* Bottom Action Toolbar */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-400">
                      Published by <strong>{b.authorName || 'Leadership'}</strong> ({b.authorRole || 'Leader'})
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* WhatsApp Broadcast Share */}
                      <a
                        href={`https://wa.me/?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title="Share this broadcast to WhatsApp"
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
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Delete Button (for executives or authors) */}
                      {(isExecutive || isOwner || currentUser?.uid === b.authorId) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBroadcast(b.id || b.broadcastId)}
                          className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-600 rounded-xl transition cursor-pointer"
                          title="Delete Broadcast"
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
    </div>
  );
}
