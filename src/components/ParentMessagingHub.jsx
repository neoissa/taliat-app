import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Users,
  Shield,
  Check,
  X,
  Sparkles,
  ChevronRight,
  Smile,
  Bell,
  FileText,
  Calendar,
  Phone,
  ArrowLeft,
  ArrowRight,
  Filter,
  CheckSquare
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
import { 
  getPermittedLeadersForParent, 
  getLeaderDisplayTag, 
  isOwnerUser 
} from '../utils/patrolScoping';

const COURTESY_PROMPTS = [
  'Assalāmu ʿAlaykum!',
  'Running 10 minutes late today.',
  'Please excuse my scout from this Friday’s session.',
  'Quick question regarding rank advancement.',
  'Jazākallāhu Khayran!'
];

const QUICK_EMOJIS = ['👍', '❤️', '⚜️', '🕌', '🤲', '🏕️', '👏', '✨', '✅', '🫡'];

function getRelativeTime(dateString) {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export default function ParentMessagingHub({ 
  currentUser = {}, 
  linkedScouts = [], 
  allGroups = [],
  initialSection = 'messages',
  onNavigate,
  onOpenAction
}) {
  // Navigation: 'messages' | 'alerts'
  const [activeSection, setActiveSection] = useState(initialSection || 'messages');

  // Groups & Leaders
  const [groups, setGroups] = useState(allGroups || []);
  const [availableLeaders, setAvailableLeaders] = useState([]);

  // Direct Messaging States
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Conversation Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTargetLeaderUid, setNewTargetLeaderUid] = useState('leadership');
  const [newScoutId, setNewScoutId] = useState(linkedScouts[0]?.uid || '');
  const [newSubject, setNewSubject] = useState('');
  const [newInitialMessage, setNewInitialMessage] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Chat Input State
  const [messageInput, setMessageInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Alerts & Notifications States
  const [notifications, setNotifications] = useState([]);
  const [publishedReports, setPublishedReports] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [taskSubmissions, setTaskSubmissions] = useState({});
  const [alertsFilter, setAlertsFilter] = useState('all'); // 'all' | 'urgent' | 'broadcasts' | 'achievements'

  // Update active section if initialSection changes
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // 1. Subscribe to Parent's Direct Threads
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = subscribeToParentThreads(currentUser.uid, (list) => {
      setThreads(list);
      setLoadingThreads(false);
      // Default to first thread on desktop if none selected
      if (!activeThreadId && list.length > 0 && window.innerWidth >= 768) {
        setActiveThreadId(list[0].threadId);
      }
    });

    return () => unsub();
  }, [currentUser?.uid]);

  // 2. Fetch Active Leaders
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', 'in', ['leader', 'admin', 'owner']));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.username || '').localeCompare(b.fullName || b.username || ''));
      setAvailableLeaders(list);
    }, (err) => console.warn('Failed to load leaders list:', err));

    return () => unsub();
  }, []);

  // 3. Fetch Groups / Patrols
  useEffect(() => {
    if (allGroups && allGroups.length > 0) {
      setGroups(allGroups);
      return;
    }
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn('Failed to load groups for parent messaging:', err));

    return () => unsub();
  }, [allGroups]);

  // 4. Subscriptions for Alerts Feed
  useEffect(() => {
    if (!currentUser?.uid) return;

    const parentEmails = [currentUser?.email, currentUser?.parent1Email, currentUser?.parent2Email].filter(Boolean).map(e => e.toLowerCase().trim());
    const linkedUids = linkedScouts.map(s => s.uid);

    const unsubNotifs = onSnapshot(collection(db, 'parent_notifications'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => {
          if (n.recipientUid && n.recipientUid !== currentUser?.uid) return false;
          const targetScoutId = n.scoutId || n.childUid || n.metadata?.scoutId;
          if (targetScoutId && linkedUids.length > 0 && !linkedUids.includes(targetScoutId)) {
            return false;
          }
          if (n.parentEmail && !parentEmails.includes(n.parentEmail.toLowerCase().trim())) {
            return false;
          }
          return true;
        });
      list.sort((a, b) => new Date(b.createdAt || b.timestamp || '1970-01-01') - new Date(a.createdAt || a.timestamp || '1970-01-01'));
      setNotifications(list);
    });

    const unsubReports = onSnapshot(collection(db, 'published_reports'), (snap) => {
      setPublishedReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubTasks = onSnapshot(collection(db, 'parent_tasks'), (snap) => {
      setParentTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubSubs = onSnapshot(collection(db, 'parent_task_submissions'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.parentUid === currentUser.uid) {
          map[data.taskId] = data;
        }
      });
      setTaskSubmissions(map);
    });

    return () => {
      unsubNotifs();
      unsubReports();
      unsubTasks();
      unsubSubs();
    };
  }, [currentUser?.uid, currentUser?.email, linkedScouts]);

  // Permitted leaders list
  const allPermittedLeaders = useMemo(() => {
    return getPermittedLeadersForParent(availableLeaders, linkedScouts, groups, null);
  }, [availableLeaders, linkedScouts, groups]);

  const scopedPermittedLeaders = useMemo(() => {
    return getPermittedLeadersForParent(availableLeaders, linkedScouts, groups, newScoutId || null);
  }, [availableLeaders, linkedScouts, groups, newScoutId]);

  // Subscribe to Active Thread Messages
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    markDirectThreadAsRead(activeThreadId, 'parent');

    const unsub = subscribeToThreadMessages(activeThreadId, (msgs) => {
      setMessages(msgs);
      setLoadingMessages(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsub();
  }, [activeThreadId]);

  const activeThread = useMemo(() => {
    return threads.find(t => t.threadId === activeThreadId) || null;
  }, [threads, activeThreadId]);

  // Filtered Threads
  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const q = searchQuery.toLowerCase();
    return threads.filter(t => 
      (t.leaderName || '').toLowerCase().includes(q) ||
      (t.subject || '').toLowerCase().includes(q) ||
      (t.scoutName || '').toLowerCase().includes(q) ||
      (t.lastMessage || '').toLowerCase().includes(q)
    );
  }, [threads, searchQuery]);

  // Dynamic Alerts & Feed Construction
  const linkedUids = linkedScouts.map(s => s.uid);
  const parentEmails = [currentUser?.email, currentUser?.parent1Email, currentUser?.parent2Email].filter(Boolean).map(e => e.toLowerCase().trim());

  const isReportForFamily = (r) => {
    if (!r) return false;
    if (r.scoutId && linkedUids.includes(r.scoutId)) return true;
    if (r.parentUid && r.parentUid === currentUser?.uid) return true;
    if (r.parentEmail && parentEmails.includes(r.parentEmail.toLowerCase().trim())) return true;
    return false;
  };

  const dynamicReportAlerts = publishedReports
    .filter(r => isReportForFamily(r) && !r.signatures?.parent?.signed)
    .map(r => ({
      id: `dyn_report_${r.id}`,
      type: 'report_signature',
      category: 'urgent',
      priority: 'urgent',
      title: `✍️ Progress Report Ready for Signature`,
      message: `Leader ${r.leaderName || 'Scoutmaster'} certified an official progress report for ${r.scoutName}. Your digital signature is requested.`,
      createdAt: r.publishedAt || new Date().toISOString(),
      childName: r.scoutName,
      actionLabel: 'Sign Progress Report',
      actionTarget: 'reports',
      actionPayload: r,
      read: false
    }));

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const dynamicTaskAlerts = parentTasks
    .filter(t => {
      const sub = taskSubmissions[t.id];
      const isDone = !!(sub?.completed || sub?.status === 'completed');
      if (isDone || !t.dueDate) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      const daysDiff = Math.round((due - now) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    })
    .map(t => ({
      id: `dyn_task_${t.id}`,
      type: 'urgent_form',
      category: 'urgent',
      priority: 'urgent',
      title: `⚡ Required Form: ${t.title}`,
      message: `${t.description || 'Activity permission slip or health waiver is pending.'} (Due: ${t.dueDate})`,
      createdAt: t.createdAt || new Date().toISOString(),
      childName: 'Family Action',
      actionLabel: 'Complete Waiver / Form',
      actionTarget: 'tasks',
      actionPayload: t,
      read: false
    }));

  const combinedAlerts = useMemo(() => {
    const list = [
      ...dynamicReportAlerts,
      ...dynamicTaskAlerts,
      ...notifications.map(n => {
        let cat = 'broadcasts';
        const t = (n.type || '').toLowerCase();
        const title = (n.title || '').toLowerCase();
        if (n.priority === 'urgent' || t.includes('urgent') || t.includes('form') || t.includes('waiver') || t.includes('absence')) {
          cat = 'urgent';
        } else if (t.includes('rank') || t.includes('badge') || t.includes('achievement') || title.includes('congratulations') || title.includes('certified')) {
          cat = 'achievements';
        }

        let childName = n.scoutName || n.childName;
        if (!childName && n.scoutId) {
          const found = linkedScouts.find(s => s.uid === n.scoutId);
          if (found) childName = found.fullName || found.username;
        }

        return {
          ...n,
          category: cat,
          childName: childName || 'All Family'
        };
      })
    ];

    const unique = Array.from(new Map(list.map(i => [i.id, i])).values());
    unique.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return unique;
  }, [dynamicReportAlerts, dynamicTaskAlerts, notifications, linkedScouts]);

  const filteredAlerts = useMemo(() => {
    if (alertsFilter === 'all') return combinedAlerts;
    if (alertsFilter === 'urgent') return combinedAlerts.filter(a => a.category === 'urgent');
    if (alertsFilter === 'broadcasts') return combinedAlerts.filter(a => a.category === 'broadcasts');
    if (alertsFilter === 'achievements') return combinedAlerts.filter(a => a.category === 'achievements');
    return combinedAlerts;
  }, [combinedAlerts, alertsFilter]);

  const unreadMessagesCount = threads.filter(t => t.unreadByParent).length;
  const unreadAlertsCount = combinedAlerts.filter(a => !a.read).length;

  // 1-Click Fast Chat with Leader
  const handleQuickStartLeader = (leaderUid, leaderName, leaderRole) => {
    const existing = threads.find(t => t.leaderUid === leaderUid);
    if (existing) {
      setActiveThreadId(existing.threadId);
      setActiveSection('messages');
      return;
    }
    setNewTargetLeaderUid(leaderUid);
    setNewSubject(`Inquiry to ${leaderName}`);
    setNewInitialMessage('Assalāmu ʿAlaykum!');
    setShowNewModal(true);
  };

  // Send Message
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

  // Create New Thread
  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newInitialMessage.trim() || isSubmittingNew) return;

    setIsSubmittingNew(true);
    try {
      let leaderName = 'Troop Leadership Team';
      let leaderRole = 'Troop Leadership';
      let targetLeaderUid = newTargetLeaderUid;

      if (newTargetLeaderUid !== 'leadership') {
        const targetObj = scopedPermittedLeaders.find(l => l.uid === newTargetLeaderUid) || availableLeaders.find(l => l.uid === newTargetLeaderUid);
        if (targetObj) {
          leaderName = targetObj.fullName || targetObj.username || 'Leader';
          leaderRole = getLeaderDisplayTag(targetObj, groups);
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
        category: 'inquiry',
        subject: newSubject.trim() || 'Parent Inquiry',
        initialMessage: newInitialMessage.trim(),
        currentUser
      });

      setActiveThreadId(threadId);
      setShowNewModal(false);
      setNewSubject('');
      setNewInitialMessage('');
      setActiveSection('messages');
    } catch (err) {
      console.error('Failed to create thread:', err);
      alert('Failed to start conversation: ' + err.message);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!activeThread) return;
    const newStatus = activeThread.status === 'resolved' ? 'active' : 'resolved';
    try {
      await updateThreadStatus(activeThread.threadId, newStatus, currentUser);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAlertAction = (item) => {
    if (item.actionTarget) {
      if (onOpenAction) {
        onOpenAction(item.actionTarget, item.actionPayload);
      } else if (onNavigate) {
        onNavigate(item.actionTarget);
      }
    } else if (onNavigate) {
      onNavigate('overview');
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto font-sans pb-8">
      
      {/* ── TOP STREAMLINED CONTROLS BAR ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sub-Tabs: Messages vs Alerts */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSection('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition cursor-pointer ${
              activeSection === 'messages'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare size={14} />
            <span>Direct Messages</span>
            {unreadMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition cursor-pointer ${
              activeSection === 'alerts'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell size={14} />
            <span>Alerts & Updates</span>
            {unreadAlertsCount > 0 && (
              <span className="bg-sky-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {activeSection === 'messages' && (
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Plus size={14} />
              <span>New Message</span>
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: DIRECT MESSAGES (CHAT CONSOLE) ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'messages' && (
        <div className="space-y-3">
          
          {/* 1-Tap Leader Chips Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
            <span className="text-[10px] uppercase font-black text-slate-400 px-1 shrink-0 flex items-center gap-1">
              <Users size={12} className="text-emerald-400" />
              <span>Chat With:</span>
            </span>
            <button
              type="button"
              onClick={() => handleQuickStartLeader('leadership', 'Troop Leadership Team', 'Troop Leadership')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 transition cursor-pointer shrink-0"
            >
              <span>⚜️ Troop Leadership</span>
            </button>
            {allPermittedLeaders.map(ldr => {
              const isOwner = isOwnerUser(ldr);
              const displayRole = getLeaderDisplayTag(ldr, groups);
              return (
                <button
                  key={ldr.uid}
                  type="button"
                  onClick={() => handleQuickStartLeader(ldr.uid, ldr.fullName || ldr.username, displayRole)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span className="text-[11px]">{isOwner ? '👑' : '👨‍💼'}</span>
                  <span>{ldr.fullName || ldr.username}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({displayRole})</span>
                </button>
              );
            })}
          </div>

          {/* 2-Pane Chat Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
            
            {/* LEFT PANE: Conversations List */}
            <div className={`md:col-span-5 lg:col-span-4 border-r border-slate-800 flex flex-col ${
              activeThreadId ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* Search Bar */}
              <div className="p-3 border-b border-slate-800 bg-slate-900/90">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Thread Cards */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[460px]">
                {loadingThreads ? (
                  <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading messages...</span>
                  </div>
                ) : filteredThreads.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <MessageSquare size={28} className="mx-auto text-slate-600" />
                    <p className="text-xs font-bold text-slate-300">No conversations yet</p>
                    <p className="text-[11px] text-slate-400">Click &ldquo;New Message&rdquo; or select a leader above to start chatting.</p>
                  </div>
                ) : (
                  filteredThreads.map(t => {
                    const isSelected = activeThreadId === t.threadId;
                    const isUnread = t.unreadByParent;

                    return (
                      <button
                        key={t.threadId}
                        type="button"
                        onClick={() => setActiveThreadId(t.threadId)}
                        className={`w-full text-left p-3.5 flex items-start gap-3 transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/40 border-l-4 border-emerald-500'
                            : 'hover:bg-slate-800/60'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 font-bold ${
                          isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'
                        }`}>
                          {t.leaderUid === 'leadership' ? '⚜️' : '👨‍💼'}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs truncate block ${
                              isUnread ? 'text-white font-black' : 'text-slate-200 font-bold'
                            }`}>
                              {t.leaderName || 'Troop Leadership'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {formatThreadTime(t.lastUpdated)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {t.scoutName && (
                              <span className="text-[9px] bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.2 rounded font-medium">
                                👦 {t.scoutName}
                              </span>
                            )}
                            {t.status === 'resolved' && (
                              <span className="text-[9px] text-emerald-400 font-bold">
                                ✓ Resolved
                              </span>
                            )}
                          </div>

                          <p className={`text-xs truncate ${
                            isUnread ? 'text-emerald-300 font-bold' : 'text-slate-400'
                          }`}>
                            {t.lastMessage || 'Conversation started'}
                          </p>
                        </div>

                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 shrink-0 mt-1 animate-pulse" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT PANE: Chat View */}
            <div className={`md:col-span-7 lg:col-span-8 flex flex-col bg-slate-950/40 ${
              !activeThreadId ? 'hidden md:flex' : 'flex'
            }`}>
              {!activeThread ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-lg">
                    💬
                  </div>
                  <h3 className="text-sm font-black text-white">Select a Conversation</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Choose a direct message thread from the left or select a leader above to send a private message.
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => setActiveThreadId(null)}
                        className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                      >
                        <ArrowLeft size={16} />
                      </button>

                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-sm shrink-0 text-emerald-300">
                        {activeThread.leaderUid === 'leadership' ? '⚜️' : '👨‍💼'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white truncate">
                            {activeThread.leaderName || 'Troop Leadership'}
                          </h4>
                          <span className="text-[9px] bg-slate-800 text-emerald-300 border border-slate-700 px-1.5 py-0.2 rounded-full font-bold">
                            {activeThread.leaderRole || 'Leader'}
                          </span>
                        </div>
                        {activeThread.scoutName && (
                          <span className="text-[10px] text-slate-400 block truncate">
                            Regarding: <strong className="text-slate-200">{activeThread.scoutName}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleStatus}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                        activeThread.status === 'resolved'
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      <span>{activeThread.status === 'resolved' ? 'Re-open' : 'Mark Resolved'}</span>
                    </button>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px]">
                    {loadingMessages ? (
                      <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading messages...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                        No messages yet. Send a message below to start chatting!
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isParent = msg.senderRole === 'parent' || msg.senderUid === currentUser.uid;

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                              <strong className={isParent ? 'text-emerald-300' : 'text-sky-300'}>
                                {msg.senderName || (isParent ? 'You' : 'Leader')}
                              </strong>
                              <span>&bull;</span>
                              <span className="font-mono">{formatThreadTime(msg.createdAt)}</span>
                            </div>

                            <div className={`p-3 rounded-2xl max-w-sm sm:max-w-md text-xs leading-relaxed shadow-sm ${
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
                  <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto scrollbar-none">
                    {COURTESY_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMessageInput(prompt)}
                        className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-700"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-900 border-t border-slate-800 space-y-1.5">
                    {showEmojiPicker && (
                      <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
                        {QUICK_EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setMessageInput(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-base hover:scale-125 transition p-1 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                        title="Insert Emoji"
                      >
                        <Smile size={16} />
                      </button>

                      <input
                        type="text"
                        placeholder="Type your message to leadership..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim() || isSendingMessage}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold p-2 rounded-xl transition cursor-pointer flex items-center justify-center shadow-md shrink-0"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: ALERTS & NOTIFICATIONS FEED ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'alerts' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'urgent', label: '⚡ Action Required' },
              { id: 'broadcasts', label: '📢 Troop Broadcasts' },
              { id: 'achievements', label: '🏆 Achievements' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setAlertsFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                  alertsFilter === f.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Alerts Cards List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
                <Bell size={36} className="mx-auto text-slate-600" />
                <h4 className="text-sm font-bold text-white">No notifications in this category</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When leaders post announcements, publish advancement reports, or assign forms, they will appear here.
                </p>
              </div>
            ) : (
              filteredAlerts.map(item => {
                const isUrgent = item.category === 'urgent' || item.priority === 'urgent';
                const isAchievement = item.category === 'achievements';

                return (
                  <div
                    key={item.id}
                    className={`bg-slate-900 border p-4 sm:p-5 rounded-2xl shadow-lg transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isUrgent
                        ? 'border-amber-500/60 ring-1 ring-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900'
                        : isAchievement
                        ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-md ${
                        isUrgent
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                          : isAchievement
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                          : 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                      }`}>
                        {isUrgent ? '⚡' : isAchievement ? '🏆' : '📢'}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full border ${
                            isUrgent
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : isAchievement
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          }`}>
                            {isUrgent ? 'Action Required' : isAchievement ? 'Milestone' : 'Broadcast'}
                          </span>
                          {item.childName && (
                            <span className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.2 rounded-full font-medium">
                              👦 {item.childName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {getRelativeTime(item.createdAt)}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {item.actionLabel && (
                      <button
                        type="button"
                        onClick={() => handleAlertAction(item)}
                        className={`text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shrink-0 self-start sm:self-center ${
                          isUrgent
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

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
                  <p className="text-xs text-slate-400">Direct message to Unit Leaders or Scoutmaster</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Recipient Leader
                </label>
                <select
                  value={newTargetLeaderUid}
                  onChange={(e) => setNewTargetLeaderUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="leadership">⚜️ Troop Leadership Team (General)</option>
                  {scopedPermittedLeaders.map(ldr => {
                    const isOwner = isOwnerUser(ldr);
                    const tag = getLeaderDisplayTag(ldr, groups);
                    return (
                      <option key={ldr.uid} value={ldr.uid}>
                        {isOwner ? '👑' : '👨‍💼'} {ldr.fullName || ldr.username} — {tag}
                      </option>
                    );
                  })}
                </select>
              </div>

              {linkedScouts.length > 0 && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Regarding Child (Optional)
                  </label>
                  <select
                    value={newScoutId}
                    onChange={(e) => setNewScoutId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">General Family Question</option>
                    {linkedScouts.map(s => (
                      <option key={s.uid} value={s.uid}>
                        👦 {s.fullName || s.username} ({s.patrolName || 'Patrol'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question about Friday campout, advancement sign-off..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Initial Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type your message here..."
                  value={newInitialMessage}
                  onChange={(e) => setNewInitialMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newInitialMessage.trim() || isSubmittingNew}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <Send size={14} />
                  <span>{isSubmittingNew ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
