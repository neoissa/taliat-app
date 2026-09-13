import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  MessageSquare,
  Send,
  Plus,
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
  HelpCircle,
  Calendar,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import {
  createDirectThread,
  sendDirectMessage,
  markDirectThreadAsRead,
  updateThreadStatus,
  subscribeToParentThreads,
  subscribeToThreadMessages,
  formatThreadTime
} from '../services/directMessagingService';

const COURTESY_PROMPTS = [
  'Assalāmu ʿAlaykum!',
  'Jazākallāhu Khayran!',
  'Thank you for the update.',
  'Understood, will coordinate with my scout.',
  'Looking forward to Friday’s session.'
];

const QUICK_EMOJIS = ['👍', '❤️', '⚜️', '🕌', '🤲', '🏕️', '👏', '✨', '✅', '🫡'];

export default function ParentMessagingHub({ currentUser = {}, linkedScouts = [] }) {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [availableLeaders, setAvailableLeaders] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'resolved'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'inquiry' | 'request' | 'suggestion'
  const [searchQuery, setSearchQuery] = useState('');

  // New Conversation Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTargetLeaderUid, setNewTargetLeaderUid] = useState('leadership');
  const [newScoutId, setNewScoutId] = useState(linkedScouts[0]?.uid || '');
  const [newCategory, setNewCategory] = useState('inquiry');
  const [newSubject, setNewSubject] = useState('');
  const [newInitialMessage, setNewInitialMessage] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Chat Input State
  const [messageInput, setMessageInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. Subscribe to Parent's Direct Threads
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = subscribeToParentThreads(currentUser.uid, (list) => {
      setThreads(list);
      setLoadingThreads(false);
      // If no active thread selected, default to the first one on desktop
      if (!activeThreadId && list.length > 0 && window.innerWidth >= 768) {
        setActiveThreadId(list[0].threadId);
      }
    });

    return () => unsub();
  }, [currentUser?.uid]);

  // 2. Fetch Active Leaders for Recipient Picker
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', 'in', ['leader', 'admin', 'owner']));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
      setAvailableLeaders(list);
    }, (err) => console.warn('Failed to load leaders list:', err));

    return () => unsub();
  }, []);

  // 3. Subscribe to Active Thread's Messages
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    // Mark as read immediately for parent
    markDirectThreadAsRead(activeThreadId, 'parent');

    const unsub = subscribeToThreadMessages(activeThreadId, (msgs) => {
      setMessages(msgs);
      setLoadingMessages(false);
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsub();
  }, [activeThreadId]);

  // Active Thread Object
  const activeThread = useMemo(() => {
    return threads.find(t => t.threadId === activeThreadId) || null;
  }, [threads, activeThreadId]);

  // Filtered Threads List
  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      // Status filter
      if (statusFilter === 'active' && t.status === 'resolved') return false;
      if (statusFilter === 'resolved' && t.status !== 'resolved') return false;

      // Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLeader = (t.leaderName || '').toLowerCase().includes(q);
        const matchesSubject = (t.subject || '').toLowerCase().includes(q);
        const matchesScout = (t.scoutName || '').toLowerCase().includes(q);
        const matchesMsg = (t.lastMessage || '').toLowerCase().includes(q);
        if (!matchesLeader && !matchesSubject && !matchesScout && !matchesMsg) return false;
      }

      return true;
    });
  }, [threads, statusFilter, categoryFilter, searchQuery]);

  // Send Message Handler
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
        senderName: currentUser.fullName || currentUser.username || 'Parent',
        senderRole: 'parent',
        text: textToSend,
        category: activeThread?.category || 'general'
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Could not send message: ' + err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Create New Thread Handler
  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newInitialMessage.trim() || isSubmittingNew) return;

    setIsSubmittingNew(true);
    try {
      let leaderName = 'Troop Leadership Team';
      let leaderRole = 'Troop Leadership';
      let targetLeaderUid = newTargetLeaderUid;

      if (newTargetLeaderUid !== 'leadership') {
        const targetObj = availableLeaders.find(l => l.uid === newTargetLeaderUid);
        if (targetObj) {
          leaderName = targetObj.fullName || targetObj.username || 'Leader';
          leaderRole = targetObj.leaderPosition || targetObj.role || 'Troop Leader';
        }
      }

      const linkedScoutObj = linkedScouts.find(s => s.uid === newScoutId);

      const threadId = await createDirectThread({
        parentUid: currentUser.uid,
        parentName: currentUser.fullName || currentUser.username || 'Parent / Guardian',
        parentEmail: currentUser.email || '',
        parentPhone: currentUser.phone || currentUser.parentPhone || '',
        leaderUid: targetLeaderUid,
        leaderName,
        leaderRole,
        scoutId: linkedScoutObj?.uid || null,
        scoutName: linkedScoutObj?.fullName || linkedScoutObj?.username || null,
        patrolId: linkedScoutObj?.groupId || null,
        patrolName: linkedScoutObj?.patrolName || null,
        category: newCategory,
        subject: newSubject.trim(),
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

  // Toggle Thread Status (Resolved / Active)
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
      
      {/* ── TOP HERO HEADER & ACTIONS ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl shrink-0 shadow-md shadow-emerald-950/40">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Direct Parent-Leader Communication
              </span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Encrypted & Confidential
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Direct Messages & Leadership Inquiries
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Privately message patrol leaders or troop leadership regarding confidential questions, official requests, or suggestions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] shrink-0"
        >
          <Plus size={16} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* ── 2-PANE CHAT CONSOLE ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* ── LEFT PANE: THREAD LIST (Col 1-5) ── */}
        <div className={`md:col-span-5 lg:col-span-4 border-r border-slate-800 flex flex-col ${
          activeThreadId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Search & Category Filter */}
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/90">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'inquiry', label: '🔒 Inquiries' },
                { id: 'request', label: '📋 Requests' },
                { id: 'suggestion', label: '💡 Suggestions' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Tab (Active vs Resolved) */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
                statusFilter === 'all'
                  ? 'border-emerald-500 text-emerald-300 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({threads.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
                statusFilter === 'active'
                  ? 'border-emerald-500 text-emerald-300 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('resolved')}
              className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
                statusFilter === 'resolved'
                  ? 'border-emerald-500 text-emerald-300 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Threads List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[520px]">
            {loadingThreads ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading conversations...</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <div className="text-2xl">📭</div>
                <p className="font-bold text-slate-300">No conversations found</p>
                <p className="text-[11px] text-slate-500">
                  {searchQuery ? 'Try a different search term.' : 'Click "+ New Conversation" to message a leader.'}
                </p>
              </div>
            ) : (
              filteredThreads.map(t => {
                const isSelected = t.threadId === activeThreadId;
                const isUnread = t.unreadByParent;
                const catBadge = getCategoryBadge(t.category);

                return (
                  <button
                    key={t.threadId}
                    type="button"
                    onClick={() => setActiveThreadId(t.threadId)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-l-4 border-emerald-500'
                        : isUnread
                        ? 'bg-emerald-950/20 hover:bg-slate-800/50'
                        : 'hover:bg-slate-850/60'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0 border ${
                      isUnread
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm shadow-emerald-950/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {t.leaderUid === 'leadership' ? '⚜️' : '👨‍💼'}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className={`text-xs truncate block ${
                          isUnread ? 'text-white font-black' : 'text-slate-200 font-bold'
                        }`}>
                          {t.leaderName || 'Troop Leadership'}
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
                        isUnread ? 'text-emerald-200 font-semibold' : 'text-slate-400'
                      }`}>
                        {t.lastMessage || 'Conversation started'}
                      </p>
                    </div>

                    {isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 shrink-0 mt-1 animate-pulse" />
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
                💬
              </div>
              <h3 className="text-base font-black text-white">Select a Conversation</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose a direct message thread from the left, or click &ldquo;New Conversation&rdquo; to send a private inquiry or suggestion.
              </p>
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                <Plus size={14} />
                <span>Start New Inquiry</span>
              </button>
            </div>
          ) : (
            <>
              {/* Chat View Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveThreadId(null)}
                    className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-lg shrink-0 text-emerald-300">
                    {activeThread.leaderUid === 'leadership' ? '⚜️' : '👨‍💼'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-white truncate">
                        {activeThread.leaderName || 'Troop Leadership Team'}
                      </h3>
                      <span className="text-[10px] bg-slate-800 text-emerald-300 border border-slate-700 px-2 py-0.2 rounded-full font-bold">
                        {activeThread.leaderRole || 'Troop Leader'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                      <span className="text-slate-300 font-bold truncate">
                        Topic: &ldquo;{activeThread.subject}&rdquo;
                      </span>
                      {activeThread.scoutName && (
                        <span>&bull; Scout: <strong className="text-white">{activeThread.scoutName}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No messages in this thread yet. Send a message below to start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isParent = msg.senderRole === 'parent' || msg.senderUid === currentUser.uid;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                          <strong className={isParent ? 'text-emerald-300 font-bold' : 'text-sky-300 font-bold'}>
                            {msg.senderName || (isParent ? 'You' : 'Leader')}
                          </strong>
                          <span>&bull;</span>
                          <span className="font-mono">{formatThreadTime(msg.createdAt)}</span>
                        </div>

                        <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed shadow-md ${
                          isParent
                            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-none border border-emerald-400/40'
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

              {/* Quick Courtesy Prompts */}
              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] uppercase font-black text-slate-400 px-1 shrink-0">
                  Quick Reply:
                </span>
                {COURTESY_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessageInput(prompt)}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-700"
                  >
                    {prompt}
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
                    placeholder="Type your confidential message to leadership... (Press Enter to send)"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSendingMessage}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── MODAL: START NEW CONVERSATION ── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-5 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-black text-white text-base">New Direct Message</h3>
                  <p className="text-xs text-slate-300">Reach troop leadership or a specific patrol leader directly</p>
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

            <form onSubmit={handleCreateThread} className="p-5 space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Message Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'inquiry', label: '🔒 Private Inquiry', desc: 'Confidential scout concern' },
                    { id: 'request', label: '📋 Official Request', desc: 'Advancement / accommodation' },
                    { id: 'suggestion', label: '💡 Troop Suggestion', desc: 'Feedback on meetings/camps' },
                    { id: 'general', label: '💬 General Chat', desc: 'Direct leader check-in' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        newCategory === cat.id
                          ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <strong className="block text-xs font-bold text-emerald-300">{cat.label}</strong>
                      <span className="text-[10px] text-slate-400">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Leader */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Target Recipient *
                </label>
                <select
                  value={newTargetLeaderUid}
                  onChange={(e) => setNewTargetLeaderUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                >
                  <option value="leadership">🌟 Unified Troop Leadership Team (All Leaders & Scoutmaster)</option>
                  {availableLeaders.map(ldr => (
                    <option key={ldr.uid} value={ldr.uid}>
                      👨‍💼 {ldr.fullName || ldr.username} ({ldr.leaderPosition || ldr.role || 'Troop Leader'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Associated Child Scout */}
              {linkedScouts.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                    Regarding Scout (Optional)
                  </label>
                  <select
                    value={newScoutId}
                    onChange={(e) => setNewScoutId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    <option value="">-- General Family / No Specific Child --</option>
                    {linkedScouts.map(s => (
                      <option key={s.uid} value={s.uid}>
                        👦 {s.fullName || s.username} ({s.rank || 'Scout'} Rank)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject Line */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                  Subject / Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding upcoming rank review or Friday schedule..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
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
                  placeholder="Type your message, question, or suggestion for troop leadership..."
                  value={newInitialMessage}
                  onChange={(e) => setNewInitialMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={!newInitialMessage.trim() || isSubmittingNew}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{isSubmittingNew ? 'Starting Conversation...' : 'Send Direct Message'}</span>
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
