import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
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
  Plus,
  RotateCcw,
  MessageCircle,
  HelpCircle,
  CheckCheck
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
import { getAccessiblePatrols } from '../utils/patrolScoping';

const LEADER_PRESET_REPLIES = [
  'Assalāmu ʿAlaykum! Noted, will address at Friday session.',
  'Thank you for reaching out. We are reviewing this now.',
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

  // Counts for Badges
  const unreadCount = useMemo(() => threads.filter(t => t.unreadByLeader).length, [threads]);
  const inquiryCount = useMemo(() => threads.filter(t => t.category === 'inquiry').length, [threads]);
  const requestCount = useMemo(() => threads.filter(t => t.category === 'request').length, [threads]);
  const suggestionCount = useMemo(() => threads.filter(t => t.category === 'suggestion').length, [threads]);
  const resolvedCount = useMemo(() => threads.filter(t => t.status === 'resolved').length, [threads]);
  const activeCount = useMemo(() => threads.filter(t => t.status !== 'resolved').length, [threads]);

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
        return { label: 'Private Inquiry', icon: '🔒', bg: 'bg-purple-950/70 text-purple-300 border-purple-500/40' };
      case 'request':
        return { label: 'Official Request', icon: '📋', bg: 'bg-sky-950/70 text-sky-300 border-sky-500/40' };
      case 'suggestion':
        return { label: 'Suggestion', icon: '💡', bg: 'bg-amber-950/70 text-amber-300 border-amber-500/40' };
      default:
        return { label: 'Direct Chat', icon: '💬', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40' };
    }
  };

  const displayPatrolName = isTroopWide 
    ? 'Troop-Wide Oversight' 
    : accessiblePatrols[0]?.name 
      ? (accessiblePatrols[0].name.toLowerCase().endsWith('patrol') ? accessiblePatrols[0].name : `${accessiblePatrols[0].name} Patrol`) 
      : 'Assigned Patrol';

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      
      {/* ── 1. SLEEK MODERN HEADER BANNER ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl shadow-inner shrink-0">
              <MessageSquare size={26} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                  Leader Direct Messaging Inbox
                </span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 shadow-sm">
                    <span>{unreadCount}</span>
                    <span>Unread</span>
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Parent Inquiries & Feedback Console
              </h1>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                Review incoming guardian messages, answer private inquiries, or initiate a secure 1-on-1 discussion with any parent.
              </p>
            </div>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3.5 py-2.5 rounded-2xl border border-slate-800 text-slate-300">
              <Users size={14} className="text-indigo-400" />
              <span className="font-semibold">{displayPatrolName}</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">{activeCount} Active</span>
            </div>

            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-950/40 hover:scale-[1.01]"
            >
              <Plus size={16} />
              <span>Message a Parent</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. TWO-PANE CHAT CONSOLE ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* ── LEFT PANE: INBOX & THREADS LIST (Col 1-5) ── */}
        <div className={`md:col-span-5 lg:col-span-4 border-r border-slate-800/80 flex flex-col bg-slate-900/60 ${
          activeThreadId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/90">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search parents, scouts, or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Pills with Counts - Wrapped for 100% Visibility */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { id: 'all', label: 'All', count: threads.length },
                { id: 'unread', label: 'Unread', count: unreadCount, isBadge: unreadCount > 0, icon: '⭐' },
                { id: 'inquiry', label: 'Inquiries', count: inquiryCount, icon: '🔒' },
                { id: 'request', label: 'Requests', count: requestCount, icon: '📋' },
                { id: 'suggestion', label: 'Suggestions', count: suggestionCount, icon: '💡' },
                { id: 'resolved', label: 'Resolved', count: resolvedCount, icon: '✓' }
              ].map(tab => {
                const isActive = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {tab.icon && <span className="text-[10px]">{tab.icon}</span>}
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : tab.isBadge
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Threads List Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[560px]">
            {loadingThreads ? (
              <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
                <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-semibold text-slate-300">Loading parent conversations...</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl mx-auto shadow-inner text-slate-500">
                  📭
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-sm">No matching conversations</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {searchQuery ? 'No results matched your search keywords.' : 'All caught up! No active inquiries from parents.'}
                  </p>
                </div>
                {!searchQuery && (
                  <button
                    type="button"
                    onClick={() => setShowNewModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 hover:bg-indigo-950 px-3.5 py-2 rounded-xl border border-indigo-500/30 transition cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Start New Conversation</span>
                  </button>
                )}
              </div>
            ) : (
              filteredThreads.map(t => {
                const isSelected = t.threadId === activeThreadId;
                const isUnread = t.unreadByLeader;
                const catBadge = getCategoryBadge(t.category);
                const isResolved = t.status === 'resolved';

                // Format parent initials
                const initials = (t.parentName || 'Parent')
                  .split(' ')
                  .map(n => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <button
                    key={t.threadId}
                    type="button"
                    onClick={() => setActiveThreadId(t.threadId)}
                    className={`w-full p-4 text-left transition flex items-start gap-3.5 cursor-pointer border-l-4 ${
                      isSelected
                        ? 'bg-slate-800/80 border-indigo-500 shadow-inner'
                        : isUnread
                        ? 'bg-indigo-950/20 hover:bg-slate-800/40 border-indigo-400'
                        : 'border-transparent hover:bg-slate-850/50'
                    }`}
                  >
                    {/* Avatar Ring */}
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border transition ${
                        isUnread
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-950/50'
                          : isSelected
                          ? 'bg-slate-700 text-white border-slate-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}>
                        {initials || 'P'}
                      </div>
                      {isUnread && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
                      )}
                    </div>

                    {/* Content Meta */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className={`text-xs truncate block ${
                          isUnread ? 'text-white font-black' : isSelected ? 'text-white font-bold' : 'text-slate-300 font-bold'
                        }`}>
                          {t.parentName || 'Parent / Guardian'}
                        </strong>
                        <span className={`text-[10px] font-mono shrink-0 ${
                          isUnread ? 'text-indigo-300 font-bold' : 'text-slate-500'
                        }`}>
                          {formatThreadTime(t.lastUpdated)}
                        </span>
                      </div>

                      {/* Badges Row */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold border flex items-center gap-1 ${catBadge.bg}`}>
                          <span>{catBadge.icon}</span>
                          <span>{catBadge.label}</span>
                        </span>

                        {t.scoutName && (
                          <span className="text-[9px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md font-medium truncate max-w-[130px]">
                            👦 {t.scoutName}
                          </span>
                        )}

                        {isResolved && (
                          <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-md font-bold">
                            ✓ Resolved
                          </span>
                        )}
                      </div>

                      {/* Subject / Snippet */}
                      <p className={`text-xs truncate ${
                        isUnread ? 'text-indigo-100 font-semibold' : 'text-slate-400'
                      }`}>
                        {t.lastMessage || t.subject || 'Conversation opened'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT PANE: LIVE CONVERSATION OR COMMAND CENTER (Col 6-12) ── */}
        <div className={`md:col-span-7 lg:col-span-8 flex flex-col bg-slate-950/40 ${
          !activeThreadId ? 'hidden md:flex' : 'flex'
        }`}>
          {!activeThread ? (
            /* ── RICH COMMAND CENTER EMPTY STATE ── */
            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-3xl shadow-xl shadow-indigo-950/30">
                <MessageCircle size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  Leader & Parent Direct Channel
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Select an inquiry from the left inbox to view messages, or initiate a secure 1-on-1 conversation with any scout parent.
                </p>
              </div>

              {/* 3 Quick Guidance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="text-indigo-400 font-bold text-xs flex items-center gap-1.5">
                    <Lock size={13} />
                    <span>Private & Scoped</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Strictly confidential between leadership and guardian.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <Award size={13} />
                    <span>Scout Linked</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Instant 1-click access to scout advancement & records.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Instant Alerts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Parents receive real-time notifications on their portal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-indigo-950/50 hover:scale-[1.02]"
              >
                <Plus size={16} />
                <span>Message a Parent</span>
              </button>
            </div>
          ) : (
            /* ── ACTIVE CONVERSATION PANE ── */
            <>
              {/* Top Conversation Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveThreadId(null)}
                    className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 border border-slate-700"
                    title="Back to inbox"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {/* Guardian Avatar */}
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center text-sm font-black text-indigo-300 shrink-0">
                    {(activeThread.parentName || 'P').slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black text-white truncate">
                        {activeThread.parentName || 'Parent / Guardian'}
                      </h3>
                      {activeThread.scoutName && (
                        <span className="text-[10px] bg-slate-800 text-indigo-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                          Parent of {activeThread.scoutName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      {activeThread.parentPhone && (
                        <a 
                          href={`tel:${activeThread.parentPhone}`}
                          className="hover:text-white flex items-center gap-1 text-[11px] bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 transition"
                        >
                          <Phone size={11} className="text-emerald-400" />
                          <span>{activeThread.parentPhone}</span>
                        </a>
                      )}
                      {activeThread.parentEmail && (
                        <a 
                          href={`mailto:${activeThread.parentEmail}`}
                          className="hover:text-white flex items-center gap-1 text-[11px] bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 transition"
                        >
                          <Mail size={11} className="text-sky-400" />
                          <span className="truncate max-w-[150px]">{activeThread.parentEmail}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Tools */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeThread.scoutId && onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('scouts', { scoutId: activeThread.scoutId })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Award size={13} className="text-amber-400" />
                      <span className="hidden sm:inline">Scout Record</span>
                    </button>
                  )}

                  {/* Toggle Status */}
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-sm ${
                      activeThread.status === 'resolved'
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                    }`}
                  >
                    {activeThread.status === 'resolved' ? (
                      <>
                        <RotateCcw size={13} className="text-slate-400" />
                        <span>Re-open</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Mark Resolved</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Subject Title Banner if available */}
              {activeThread.subject && (
                <div className="px-5 py-2.5 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="font-bold text-slate-300">Topic:</span>
                    <span className="text-indigo-300 font-semibold">{activeThread.subject}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getCategoryBadge(activeThread.category).bg}`}>
                    {getCategoryBadge(activeThread.category).label}
                  </span>
                </div>
              )}

              {/* Chat Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[420px]">
                {loadingMessages ? (
                  <div className="p-10 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 text-xs italic">
                    No messages in this conversation yet. Send the first response below!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isLeader = msg.senderRole !== 'parent';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isLeader ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1.5 text-[11px] text-slate-400">
                          <strong className={isLeader ? 'text-indigo-300 font-bold' : 'text-emerald-300 font-bold'}>
                            {msg.senderName || (isLeader ? 'Leader' : 'Parent')}
                          </strong>
                          <span>&bull;</span>
                          <span className="font-mono text-slate-500">{formatThreadTime(msg.createdAt)}</span>
                        </div>

                        <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed shadow-lg ${
                          isLeader
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-xs border border-indigo-400/40 shadow-indigo-950/40'
                            : 'bg-slate-900 text-slate-100 rounded-bl-xs border border-slate-750 shadow-slate-950/50'
                        }`}>
                          <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Preset Quick Replies Bar - Wrapped for full visibility */}
              <div className="px-5 py-2.5 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-black text-indigo-400 px-1 shrink-0 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Quick Reply:</span>
                </span>
                {LEADER_PRESET_REPLIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessageInput(preset)}
                    className="px-3 py-1 rounded-xl text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-800 hover:border-slate-700"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Chat Input & Action Composer */}
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5">
                {showEmojiPicker && (
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2 animate-fadeIn">
                    {QUICK_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageInput(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg hover:scale-125 transition p-1.5 cursor-pointer rounded-lg hover:bg-slate-850"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2.5 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-750"
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
                    className="flex-1 bg-slate-950 border border-slate-750 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed transition"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSendingMessage}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold p-3 rounded-2xl transition cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-950/50"
                  >
                    <Send size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1 flex-wrap gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoResolveOnSend}
                      onChange={(e) => setAutoResolveOnSend(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Mark conversation as Resolved after sending</span>
                  </label>
                  <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">Enter</kbd> to send, <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">Shift+Enter</kbd> for new line</span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── 3. MODAL: START NEW CONVERSATION WITH PARENT ── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Message a Parent Directly</h3>
                  <p className="text-xs text-slate-400">Initiate a private 1-on-1 discussion with a parent/guardian</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateThreadAsLeader} className="p-5 space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
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
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        newCategory === cat.id
                          ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
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
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Select Scout (Optional helper to auto-select parent)
                </label>
                <select
                  value={newScoutId}
                  onChange={(e) => handleScoutSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
                >
                  <option value="">-- Select Scout Member (Optional) --</option>
                  {allScouts.map(s => (
                    <option key={s.uid} value={s.uid}>
                      👦 {s.fullName || s.username} ({s.patrolName || 'Scout'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Parent Recipient */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Select Parent / Guardian *
                </label>
                <select
                  required
                  value={newParentUid}
                  onChange={(e) => setNewParentUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
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
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Subject Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Update regarding advancement review / campout preparation..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              {/* Initial Message Text */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Message Body *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type your message to the parent..."
                  value={newInitialMessage}
                  onChange={(e) => setNewInitialMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={!newParentUid || !newInitialMessage.trim() || isSubmittingNew}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
                >
                  <Send size={14} />
                  <span>{isSubmittingNew ? 'Sending...' : 'Send Message to Parent'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold px-5 py-3 rounded-2xl transition cursor-pointer border border-slate-700"
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
