import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Users,
  Shield,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ChevronRight,
  Smile,
  Lock,
  FileText,
  Lightbulb,
  Phone,
  Mail,
  ArrowLeft,
  ExternalLink,
  Award,
  Plus
} from 'lucide-react';
import {
  createDirectThread,
  sendDirectMessage,
  markDirectThreadAsRead,
  updateThreadStatus,
  subscribeToLeaderThreads,
  subscribeToThreadMessages,
  formatThreadTime
} from '../services/directMessagingService';
import { getAccessiblePatrols, isSuperUser } from '../utils/patrolScoping';

const LEADER_PRESET_REPLIES = [
  'Assalāmu ʿAlaykum! Noted, will address at Friday session.',
  'Thank you for bringing this to our attention.',
  'Advancement record has been reviewed and updated.',
  'Let’s discuss this briefly before Friday roll call at 6:30 PM.',
  'Suggestion noted and shared with the troop committee.'
];

const QUICK_EMOJIS = ['👍', '⚜️', '👏', '🕌', '🤲', '🏕️', '✅', '❤️', '✨', '🫡'];

export default function LeaderMessagingHub({ currentUser = {}, onNavigate, initialParentUid = null, initialScoutId = null }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'executive' || currentUser?.isExecutive || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isTroopWide = isOwner || isExecutive;

  const [groups, setGroups] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // All parents & scouts for new message modal
  const [allParents, setAllParents] = useState([]);
  const [allScouts, setAllScouts] = useState([]);

  // New Message to Parent Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newParentUid, setNewParentUid] = useState(initialParentUid || '');
  const [newScoutId, setNewScoutId] = useState(initialScoutId || '');
  const [newCategory, setNewCategory] = useState('inquiry');
  const [newSubject, setNewSubject] = useState('');
  const [newInitialMessage, setNewInitialMessage] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'inquiry' | 'request' | 'suggestion' | 'unread' | 'resolved'
  const [patrolFilter, setPatrolFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Input & Reply state
  const [messageInput, setMessageInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [autoResolveOnSend, setAutoResolveOnSend] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. Fetch Patrol Groups
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn('LeaderMessagingHub groups fallback:', err));
    return () => unsub();
  }, []);

  const accessiblePatrols = useMemo(() => {
    return getAccessiblePatrols(currentUser, groups);
  }, [currentUser, groups]);

  // 1.5 Fetch All Parents and Scouts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const all = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      const parents = all.filter(u => u.role === 'parent' || u.isParent);
      const scouts = all.filter(u => u.role === 'scout');
      setAllParents(parents);
      setAllScouts(scouts);
    }, (err) => console.warn('Failed to load users for leader messaging:', err));
    return () => unsub();
  }, []);

  // 2. Subscribe to Leader-Scoped Threads
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = subscribeToLeaderThreads(
      currentUser,
      accessiblePatrols,
      isTroopWide,
      (list) => {
        setThreads(list);
        setLoadingThreads(false);
        if (!activeThreadId && list.length > 0 && window.innerWidth >= 768) {
          setActiveThreadId(list[0].threadId);
        }
      }
    );

    return () => unsub();
  }, [currentUser, accessiblePatrols, isTroopWide]);

  // 3. Subscribe to Active Thread's Messages
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    // Mark as read immediately for leader
    markDirectThreadAsRead(activeThreadId, currentUser?.role || 'leader');

    const unsub = subscribeToThreadMessages(activeThreadId, (msgs) => {
      setMessages(msgs);
      setLoadingMessages(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsub();
  }, [activeThreadId, currentUser?.role]);

  // Active Thread Object
  const activeThread = useMemo(() => {
    return threads.find(t => t.threadId === activeThreadId) || null;
  }, [threads, activeThreadId]);

  // Unread Count
  const unreadCount = useMemo(() => {
    return threads.filter(t => t.unreadByLeader).length;
  }, [threads]);

  // Filtered Threads
  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      // Category / Tab filter
      if (categoryFilter === 'unread' && !t.unreadByLeader) return false;
      if (categoryFilter === 'resolved' && t.status !== 'resolved') return false;
      if (['inquiry', 'request', 'suggestion'].includes(categoryFilter) && t.category !== categoryFilter) return false;

      // Patrol filter
      if (patrolFilter !== 'all' && t.patrolId !== patrolFilter && t.patrolName !== patrolFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesParent = (t.parentName || '').toLowerCase().includes(q);
        const matchesScout = (t.scoutName || '').toLowerCase().includes(q);
        const matchesSubject = (t.subject || '').toLowerCase().includes(q);
        const matchesMsg = (t.lastMessage || '').toLowerCase().includes(q);
        if (!matchesParent && !matchesScout && !matchesSubject && !matchesMsg) return false;
      }

      return true;
    });
  }, [threads, categoryFilter, patrolFilter, searchQuery]);

  // Send Reply Handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!activeThreadId || !messageInput.trim() || isSendingMessage) return;

    const textToSend = messageInput.trim();
    setMessageInput('');
    setIsSendingMessage(true);

    try {
      await sendDirectMessage({
        threadId: activeThreadId,
        senderUid: currentUser.uid,
        senderName: currentUser.fullName || currentUser.username || 'Leader',
        senderRole: currentUser.role || 'leader',
        text: textToSend,
        category: activeThread?.category || 'general'
      });

      if (autoResolveOnSend && activeThread?.status !== 'resolved') {
        await updateThreadStatus(activeThreadId, 'resolved', currentUser);
        setAutoResolveOnSend(false);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Could not send message: ' + err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Start New Conversation with Parent Handler
  const handleCreateThreadAsLeader = async (e) => {
    e.preventDefault();
    if (!newParentUid || !newInitialMessage.trim() || isSubmittingNew) return;

    setIsSubmittingNew(true);
    try {
      const parentObj = allParents.find(p => p.uid === newParentUid);
      const scoutObj = allScouts.find(s => s.uid === newScoutId);

      const threadId = await createDirectThread({
        parentUid: newParentUid,
        parentName: parentObj?.fullName || parentObj?.username || 'Parent / Guardian',
        parentEmail: parentObj?.email || '',
        parentPhone: parentObj?.phone || parentObj?.parentPhone || '',
        leaderUid: currentUser.uid,
        leaderName: currentUser.fullName || currentUser.username || 'Leader',
        leaderRole: currentUser.leaderPosition || currentUser.role || 'Troop Leader',
        scoutId: scoutObj?.uid || null,
        scoutName: scoutObj?.fullName || scoutObj?.username || null,
        patrolId: scoutObj?.groupId || scoutObj?.patrolId || null,
        patrolName: scoutObj?.patrolName || null,
        category: newCategory,
        subject: newSubject.trim() || 'Leader Inquiry / Update',
        initialMessage: newInitialMessage.trim(),
        currentUser
      });

      setActiveThreadId(threadId);
      setShowNewModal(false);
      setNewSubject('');
      setNewInitialMessage('');
    } catch (err) {
      console.error('Failed to create thread:', err);
      alert('Failed to start conversation: ' + err.message);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Auto-fill parent when scout is selected in new modal
  const handleScoutSelect = (scoutId) => {
    setNewScoutId(scoutId);
    if (!scoutId) return;

    const scoutObj = allScouts.find(s => s.uid === scoutId);
    if (scoutObj?.parentUid) {
      setNewParentUid(scoutObj.parentUid);
    } else if (scoutObj?.parentEmail) {
      const matched = allParents.find(p => p.email === scoutObj.parentEmail);
      if (matched) setNewParentUid(matched.uid);
    }
  };

  // Toggle Thread Status
  const handleToggleStatus = async () => {
    if (!activeThread) return;
    const newStatus = activeThread.status === 'resolved' ? 'active' : 'resolved';
    try {
      await updateThreadStatus(activeThread.threadId, newStatus, currentUser);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'inquiry':
        return { label: '🔒 Private Inquiry', bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
      case 'request':
        return { label: '📋 Official Request', bg: 'bg-sky-950/80 text-sky-300 border-sky-500/40' };
      case 'suggestion':
        return { label: '💡 Troop Suggestion', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40' };
      default:
        return { label: '💬 Direct Chat', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto font-sans pb-10">
      
      {/* ── TOP HERO BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-2xl shrink-0 text-indigo-300 shadow-md">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Leader Direct Messaging Inbox
              </span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Parent Inquiries & Feedback Console
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Review incoming guardian messages or initiate a private 1-on-1 conversation with any parent.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 hover:scale-[1.02] shrink-0"
          >
            <Plus size={15} />
            <span>Message a Parent</span>
          </button>
          
          <span className="text-xs bg-slate-900 border border-slate-750 text-slate-300 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0">
            <Users size={14} className="text-indigo-400" />
            <span>{isTroopWide ? 'Troop-Wide Oversight' : accessiblePatrols[0]?.name ? `${accessiblePatrols[0].name} Patrol` : 'Assigned Patrol'}</span>
          </span>
        </div>
      </div>

      {/* ── 2-PANE CHAT CONSOLE ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* ── LEFT PANE: INBOX & THREADS (Col 1-5) ── */}
        <div className={`md:col-span-5 lg:col-span-4 border-r border-slate-800 flex flex-col ${
          activeThreadId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Search & Patrol Scoping Filter */}
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/90">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search parents, scouts, or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: `⭐ Unread (${unreadCount})` },
                { id: 'inquiry', label: '🔒 Inquiries' },
                { id: 'request', label: '📋 Requests' },
                { id: 'suggestion', label: '💡 Suggestions' },
                { id: 'resolved', label: '✓ Resolved' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[520px]">
            {loadingThreads ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading parent messages...</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <div className="text-2xl">📭</div>
                <p className="font-bold text-slate-300">No matching conversations</p>
                <p className="text-[11px] text-slate-500">
                  {searchQuery ? 'Try a different search term.' : 'Click "+ Message a Parent" to start a 1-on-1 conversation.'}
                </p>
              </div>
            ) : (
              filteredThreads.map(t => {
                const isSelected = t.threadId === activeThreadId;
                const isUnread = t.unreadByLeader;
                const catBadge = getCategoryBadge(t.category);

                return (
                  <button
                    key={t.threadId}
                    type="button"
                    onClick={() => setActiveThreadId(t.threadId)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-l-4 border-indigo-500'
                        : isUnread
                        ? 'bg-indigo-950/20 hover:bg-slate-800/50'
                        : 'hover:bg-slate-850/60'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0 border ${
                      isUnread
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400 shadow-sm shadow-indigo-950/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      👨‍👩‍👧
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className={`text-xs truncate block ${
                          isUnread ? 'text-white font-black' : 'text-slate-200 font-bold'
                        }`}>
                          {t.parentName || 'Parent / Guardian'}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {formatThreadTime(t.lastUpdated)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold border ${catBadge.bg}`}>
                          {catBadge.label}
                        </span>
                        {t.scoutName && (
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-md font-medium">
                            👦 {t.scoutName}
                          </span>
                        )}
                        {t.status === 'resolved' && (
                          <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-md font-bold">
                            ✓ Resolved
                          </span>
                        )}
                      </div>

                      <p className={`text-xs truncate ${
                        isUnread ? 'text-indigo-200 font-semibold' : 'text-slate-400'
                      }`}>
                        {t.lastMessage || 'Conversation started'}
                      </p>
                    </div>

                    {isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/80 shrink-0 mt-1 animate-pulse" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT PANE: LIVE CONVERSATION (Col 6-12) ── */}
        <div className={`md:col-span-7 lg:col-span-8 flex flex-col bg-slate-950/40 ${
          !activeThreadId ? 'hidden md:flex' : 'flex'
        }`}>
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-lg">
                🛡️
              </div>
              <h3 className="text-base font-black text-white">Select a Parent Conversation</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose a direct message thread from the left inbox to view confidential parent messages, or click &ldquo;Message a Parent&rdquo; to start a new thread.
              </p>
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Plus size={15} />
                <span>Message a Parent</span>
              </button>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveThreadId(null)}
                    className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-lg shrink-0 text-indigo-300">
                    👨‍👩‍👧
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-white truncate">
                        {activeThread.parentName || 'Parent / Guardian'}
                      </h3>
                      {activeThread.scoutName && (
                        <span className="text-[10px] bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.2 rounded-full font-bold">
                          Parent of: {activeThread.scoutName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
                      {activeThread.parentPhone && (
                        <a 
                          href={`tel:${activeThread.parentPhone}`}
                          className="hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <Phone size={11} className="text-emerald-400" />
                          <span>{activeThread.parentPhone}</span>
                        </a>
                      )}
                      {activeThread.parentEmail && (
                        <a 
                          href={`mailto:${activeThread.parentEmail}`}
                          className="hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <Mail size={11} className="text-sky-400" />
                          <span className="truncate max-w-[150px]">{activeThread.parentEmail}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Jump to Scout Profile if available */}
                  {activeThread.scoutId && onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('scouts', { scoutId: activeThread.scoutId })}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-750 transition cursor-pointer flex items-center gap-1"
                    >
                      <Award size={13} className="text-amber-400" />
                      <span>Scout Record</span>
                    </button>
                  )}

                  {/* Toggle Status */}
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                      activeThread.status === 'resolved'
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>{activeThread.status === 'resolved' ? 'Re-open' : 'Mark Resolved'}</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[420px]">
                {loadingMessages ? (
                  <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No messages in this thread yet.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isLeader = msg.senderRole !== 'parent';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isLeader ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                          <strong className={isLeader ? 'text-indigo-300 font-bold' : 'text-emerald-300 font-bold'}>
                            {msg.senderName || (isLeader ? 'Leader' : 'Parent')}
                          </strong>
                          <span>&bull;</span>
                          <span className="font-mono">{formatThreadTime(msg.createdAt)}</span>
                        </div>

                        <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed shadow-md ${
                          isLeader
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none border border-indigo-400/40'
                            : 'bg-slate-900 text-slate-100 rounded-bl-none border border-slate-750 shadow-slate-950/50'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Preset Quick Replies */}
              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] uppercase font-black text-slate-400 px-1 shrink-0">
                  Quick Reply:
                </span>
                {LEADER_PRESET_REPLIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessageInput(preset)}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-700"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
                {showEmojiPicker && (
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
                    {QUICK_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageInput(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg hover:scale-125 transition p-1 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    title="Insert Emoji"
                  >
                    <Smile size={18} />
                  </button>

                  <textarea
                    rows={1}
                    placeholder="Type confidential leader response... (Press Enter to send)"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSendingMessage}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoResolveOnSend}
                      onChange={(e) => setAutoResolveOnSend(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Mark conversation as Resolved after sending</span>
                  </label>
                  <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">Enter</kbd> to send</span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── MODAL: START NEW CONVERSATION WITH PARENT ── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 p-5 border-b border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Message a Parent Directly</h3>
                  <p className="text-xs text-slate-300">Start a private 1-on-1 discussion with a parent/guardian</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateThreadAsLeader} className="p-5 space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Topic Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'inquiry', label: '🔒 Private Discussion', desc: 'Confidential scout review' },
                    { id: 'request', label: '📋 Official Notice', desc: 'Forms / campout notice' },
                    { id: 'suggestion', label: '💡 Feedback / Check-in', desc: 'Troop check-in' },
                    { id: 'general', label: '💬 General Message', desc: 'Direct parent discussion' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        newCategory === cat.id
                          ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <strong className="block text-xs font-bold text-indigo-300">{cat.label}</strong>
                      <span className="text-[10px] text-slate-400">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Scout (Quick Helper) */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Select Scout (Optional helper to auto-select parent)
                </label>
                <select
                  value={newScoutId}
                  onChange={(e) => handleScoutSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="">-- Select Scout Member --</option>
                  {allScouts.map(s => (
                    <option key={s.uid} value={s.uid}>
                      👦 {s.fullName || s.username} ({s.patrolName || 'Scout'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Parent Recipient */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Select Parent / Guardian *
                </label>
                <select
                  required
                  value={newParentUid}
                  onChange={(e) => setNewParentUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="">-- Choose Parent Guardian --</option>
                  {allParents.map(p => (
                    <option key={p.uid} value={p.uid}>
                      👨‍👩‍👧 {p.fullName || p.username} ({p.email || p.phone || 'Guardian'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Subject Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Update regarding advancement review / campout preparation..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              {/* Initial Message Text */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Message Body *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type your message to the parent..."
                  value={newInitialMessage}
                  onChange={(e) => setNewInitialMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={!newParentUid || !newInitialMessage.trim() || isSubmittingNew}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{isSubmittingNew ? 'Sending...' : 'Send Message to Parent'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
