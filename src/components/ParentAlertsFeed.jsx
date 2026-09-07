import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Star, 
  FileText, 
  Clock, 
  Check, 
  Filter, 
  ArrowRight,
  User
} from 'lucide-react';

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

export default function ParentAlertsFeed({ currentUser, linkedScouts = [], onNavigate, onOpenAction }) {
  const [notifications, setNotifications] = useState([]);
  const [publishedReports, setPublishedReports] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [taskSubmissions, setTaskSubmissions] = useState({});
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'urgent' | 'broadcasts' | 'achievements'
  const [loading, setLoading] = useState(true);

  // 1. Subscribe to parent notifications
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
      setLoading(false);
    }, (err) => {
      console.error("Failed to load notifications:", err);
      setLoading(false);
    });

    const unsubReports = onSnapshot(collection(db, 'published_reports'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPublishedReports(list);
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

  // Combine real-time notifications with dynamic urgent activity items
  const linkedUids = linkedScouts.map(s => s.uid);
  const parentEmails = [currentUser?.email, currentUser?.parent1Email, currentUser?.parent2Email].filter(Boolean).map(e => e.toLowerCase().trim());

  const isReportForFamily = (r) => {
    if (!r) return false;
    if (r.scoutId && linkedUids.includes(r.scoutId)) return true;
    if (r.parentUid && r.parentUid === currentUser?.uid) return true;
    if (r.parentEmail && parentEmails.includes(r.parentEmail.toLowerCase().trim())) return true;
    return false;
  };

  // Dynamic Item 1: Pending Progress Reports needing signature
  const dynamicReportAlerts = publishedReports
    .filter(r => isReportForFamily(r) && !r.signatures?.parent?.signed)
    .map(r => ({
      id: `dyn_report_${r.id}`,
      type: 'report_signature',
      category: 'urgent',
      priority: 'urgent',
      title: `✍️ Official Progress Report Ready for Signature`,
      message: `Leader ${r.leaderName || 'Scoutmaster'} certified an advancement snapshot for ${r.scoutName}. Your parent digital signature is requested.`,
      createdAt: r.publishedAt || new Date().toISOString(),
      childName: r.scoutName,
      childUid: r.scoutId,
      actionLabel: 'Sign Progress Report',
      actionTarget: 'reports',
      actionPayload: r,
      read: false
    }));

  // Dynamic Item 2: Urgent Parent Tasks/Waivers due in 7 days
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
      title: `⚡ Action Required: ${t.title}`,
      message: `${t.description || 'Required health or event permission slip is pending submission.'} (Due: ${t.dueDate})`,
      createdAt: t.createdAt || new Date().toISOString(),
      childName: 'Family Action',
      actionLabel: 'Complete Waiver / Form',
      actionTarget: 'tasks',
      actionPayload: t,
      read: false
    }));

  // Merge static notifications + dynamic urgent items
  const combinedFeed = [
    ...dynamicReportAlerts,
    ...dynamicTaskAlerts,
    ...notifications.filter(n => {
      const targetScoutId = n.scoutId || n.childUid || n.metadata?.scoutId;
      if (targetScoutId && linkedUids.length > 0 && !linkedUids.includes(targetScoutId)) {
        return false;
      }
      return true;
    }).map(n => {
      // Categorize notification
      let cat = 'broadcasts';
      const t = (n.type || '').toLowerCase();
      const title = (n.title || '').toLowerCase();
      if (n.priority === 'urgent' || t.includes('urgent') || t.includes('form') || t.includes('waiver') || t.includes('absence')) {
        cat = 'urgent';
      } else if (t.includes('rank') || t.includes('badge') || t.includes('achievement') || title.includes('congratulations') || title.includes('certified')) {
        cat = 'achievements';
      } else if (t.includes('homework') || t.includes('assignment')) {
        cat = 'achievements';
      }

      // Associate child name if available
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

  // Remove duplicates by ID and sort descending
  const uniqueFeed = Array.from(new Map(combinedFeed.map(item => [item.id, item])).values());
  uniqueFeed.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Filtered feed based on active pill
  const filteredFeed = uniqueFeed.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return item.category === 'urgent' || item.priority === 'urgent';
    if (activeFilter === 'broadcasts') return item.category === 'broadcasts';
    if (activeFilter === 'achievements') return item.category === 'achievements';
    return true;
  });

  const unreadCount = uniqueFeed.filter(i => !i.read).length;

  const handleMarkRead = async (item) => {
    if (item.id.startsWith('dyn_')) return;
    try {
      await setDoc(doc(db, 'parent_notifications', item.id), { read: true }, { merge: true });
    } catch (err) {
      console.warn("Failed to mark read:", err);
    }
  };

  const handleToggleRead = async (item, e) => {
    e.stopPropagation();
    if (item.id.startsWith('dyn_')) return;
    try {
      await setDoc(doc(db, 'parent_notifications', item.id), { read: !item.read }, { merge: true });
    } catch (err) {
      console.warn("Failed to toggle read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadStatic = notifications.filter(n => !n.read);
    for (const n of unreadStatic) {
      try {
        await setDoc(doc(db, 'parent_notifications', n.id), { read: true }, { merge: true });
      } catch (err) {
        console.warn("Error marking read:", err);
      }
    }
  };

  const handleItemAction = (item) => {
    if (item.actionTarget) {
      if (onOpenAction) {
        onOpenAction(item.actionTarget, item.actionPayload);
      } else if (onNavigate) {
        onNavigate(item.actionTarget);
      }
    } else if (item.type === 'homework' || item.category === 'achievements') {
      if (onNavigate) onNavigate('tasks');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-sky-950/40 border border-slate-750 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-black text-xl shadow-md shrink-0">
            🔔
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white">Alerts & Activity Feed</h2>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-sky-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live chronological stream of troop announcements, rank milestones, required signatures, and scout homework.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 self-start sm:self-center shrink-0"
          >
            <Check size={14} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* ── FILTER PILLS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Updates', icon: Filter, count: uniqueFeed.length },
          { id: 'urgent', label: '⚠️ Urgent Actions', icon: AlertTriangle, count: uniqueFeed.filter(i => i.category === 'urgent' || i.priority === 'urgent').length, color: 'text-amber-400' },
          { id: 'broadcasts', label: '📢 Troop Broadcasts', icon: Bell, count: uniqueFeed.filter(i => i.category === 'broadcasts').length, color: 'text-sky-400' },
          { id: 'achievements', label: '⭐ Child Achievements', icon: Star, count: uniqueFeed.filter(i => i.category === 'achievements').length, color: 'text-emerald-400' }
        ].map(filter => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-100 text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-850 border border-slate-750 text-slate-400 hover:text-white'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isActive ? 'bg-slate-900 text-white' : 'bg-slate-900/80 text-slate-400'
              }`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── ACTIVITY TIMELINE FEED ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading activity stream...
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="bg-slate-850 border border-slate-755 rounded-3xl p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl mx-auto text-slate-500">
              ✨
            </div>
            <h4 className="text-sm font-bold text-white">All Caught Up!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no {activeFilter !== 'all' ? activeFilter : ''} notifications at the moment. We will notify you when new updates arrive!
            </p>
          </div>
        ) : (
          filteredFeed.map((item) => {
            const isUrgent = item.category === 'urgent' || item.priority === 'urgent';
            const isAchievement = item.category === 'achievements';
            const isUnread = !item.read;
            const timeAgo = getRelativeTime(item.createdAt || item.timestamp);

            return (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item)}
                className={`bg-slate-850 border rounded-2xl p-4 sm:p-5 transition-all space-y-3 relative group ${
                  isUnread
                    ? isUrgent
                      ? 'border-red-500/60 bg-gradient-to-r from-red-950/20 via-slate-850 to-slate-850 shadow-md'
                      : isAchievement
                      ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/20 via-slate-850 to-slate-850 shadow-md'
                      : 'border-sky-500/50 bg-gradient-to-r from-sky-950/20 via-slate-850 to-slate-850 shadow-md'
                    : 'border-slate-755 hover:border-slate-700 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Top Row: Badge, Child Tag, Relative Time, Unread Dot */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Badge */}
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      isUrgent
                        ? 'bg-red-950 text-red-300 border-red-500/60 animate-pulse'
                        : isAchievement
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                        : 'bg-sky-950 text-sky-300 border-sky-500/60'
                    }`}>
                      {isUrgent ? '⚠️ Urgent Action' : isAchievement ? '⭐ Achievement' : '📢 Troop Broadcast'}
                    </span>

                    {/* Child Tag */}
                    {item.childName && (
                      <span className="text-[10px] bg-slate-900 border border-slate-750 text-slate-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <User size={10} className="text-slate-400" />
                        <span>{item.childName}</span>
                      </span>
                    )}

                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock size={11} />
                      <span>{timeAgo}</span>
                    </span>

                    {!item.id.startsWith('dyn_') && (
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(item, e)}
                        className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded-lg hover:bg-slate-800 transition"
                        title={isUnread ? 'Mark as read' : 'Mark as unread'}
                      >
                        {isUnread ? 'Mark read' : 'Unread'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Content Headline & Body */}
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.message || item.description || item.body}
                  </p>
                </div>

                {/* Action Button (If action available) */}
                {(item.actionLabel || item.docUrl || item.actionTarget) && (
                  <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemAction(item);
                      }}
                      className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md ${
                        isUrgent
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <span>{item.actionLabel || 'View Details'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
