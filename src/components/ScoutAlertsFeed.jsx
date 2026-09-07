import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc,
  updateDoc 
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
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  MapPin,
  Flame,
  Shield,
  ShieldCheck,
  Zap,
  ChevronRight,
  ExternalLink,
  Users,
  Compass,
  AlertCircle
} from 'lucide-react';
import PublishedReportViewerModal from './PublishedReportViewerModal';
import { getEventAudienceInfo } from '../utils/kashafVoice';

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

export default function ScoutAlertsFeed({ currentUser, onNavigate }) {
  const scoutUid = currentUser?.uid;

  const [pushedNotifications, setPushedNotifications] = useState([]);
  const [subcollectionNotifs, setSubcollectionNotifs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [homeworkRecords, setHomeworkRecords] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [publishedReports, setPublishedReports] = useState([]);
  const [ranksProgress, setRanksProgress] = useState({});
  const [viewingReport, setViewingReport] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'assignments' | 'events' | 'advancement' | 'broadcasts'
  const [loading, setLoading] = useState(true);
  const [dismissedDynamicIds, setDismissedDynamicIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`dismissed_scout_alerts_${scoutUid}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 1. Subscribe to /scout_notifications
  useEffect(() => {
    if (!scoutUid) return;

    const unsubPushed = onSnapshot(collection(db, 'scout_notifications'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => !n.recipientUid || n.recipientUid === scoutUid || n.scoutEmail === currentUser?.email);
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setPushedNotifications(list);
      setLoading(false);
    }, (err) => {
      console.warn("Scout notifications load fallback:", err);
      setLoading(false);
    });

    // 2. Subscribe to subcollection /users/{scoutUid}/notifications
    const unsubSubcol = onSnapshot(collection(db, 'users', scoutUid, 'notifications'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setSubcollectionNotifs(list);
    }, (err) => console.warn("Subcollection notifications fallback:", err));

    // 3. Subscribe to Assignments & Scout Homework
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubHw = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setHomeworkRecords(map);
    });

    // 4. Subscribe to Events & Groups
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEventsList(list);
    });

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });

    // 5. Subscribe to Published Progress Reports
    const unsubReports = onSnapshot(collection(db, 'published_reports'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.scoutId === scoutUid);
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      setPublishedReports(list);
    });

    // 6. Subscribe to Ranks Progress
    const unsubRanks = onSnapshot(collection(db, 'user_progress', scoutUid, 'ranks'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });

    return () => {
      unsubPushed();
      unsubSubcol();
      unsubAssign();
      unsubHw();
      unsubEvents();
      unsubGroups();
      unsubReports();
      unsubRanks();
    };
  }, [scoutUid, currentUser?.email]);

  // Persist dismissed dynamic IDs to localStorage
  const dismissDynamicItem = (id) => {
    const updated = [...new Set([...dismissedDynamicIds, id])];
    setDismissedDynamicIds(updated);
    try {
      localStorage.setItem(`dismissed_scout_alerts_${scoutUid}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not persist dismissed alert:", e);
    }
  };

  // ── DYNAMIC REAL-TIME ALERTS SYNTHESIS ──
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // 1. Dynamic Published Progress Report Alerts
  const dynamicReportAlerts = publishedReports.map(r => {
    const needsSignature = !r.signatures?.scout?.signed;
    return {
      id: `dyn_report_${r.id}`,
      type: 'report',
      category: 'advancement',
      priority: needsSignature ? 'urgent' : 'normal',
      badgeLabel: needsSignature ? '✍️ Action Required' : '📄 Progress Report',
      badgeColor: needsSignature ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: `Official Progress Report Published: ${r.reportSnapshot?.rank || 'Rank'} Advancement`,
      message: `Unit Leader ${r.leaderName || 'Scoutmaster'} certified your official rank advancement record. ${needsSignature ? 'Your candidate digital signature is requested.' : 'Certified and archived in your profile.'}`,
      date: r.publishedAt || r.date || new Date().toISOString(),
      actionLabel: needsSignature ? 'Review & Sign Report' : 'Inspect Certified Report',
      actionType: 'open_report_modal',
      reportData: r,
      isRead: !needsSignature || dismissedDynamicIds.includes(`dyn_report_${r.id}`)
    };
  });

  // 2. Dynamic Homework & Assignment Alerts (Active & Overdue)
  const dynamicHomeworkAlerts = assignments
    .filter(assign => {
      if (assign.assignedTarget === 'patrol' && assign.targetGroupId && assign.targetGroupId !== currentUser?.groupId && assign.targetGroupId !== currentUser?.patrolId) {
        return false;
      }
      if (assign.assignedTarget === 'scout' && assign.targetScoutUid && assign.targetScoutUid !== scoutUid) {
        return false;
      }
      return true;
    })
    .map(assign => {
      const hwKey = `${assign.id}_${scoutUid}`;
      const hwRecord = homeworkRecords[hwKey];
      const isDone = !!(hwRecord?.isCompleted || hwRecord?.status === 'completed' || hwRecord?.verifiedByLeader);
      const isPendingReview = hwRecord?.status === 'submitted' || hwRecord?.status === 'in_review';

      let isOverdue = false;
      let daysDiff = 0;
      if (assign.dueDate) {
        const due = new Date(assign.dueDate);
        due.setHours(0, 0, 0, 0);
        daysDiff = Math.round((due - now) / (1000 * 60 * 60 * 24));
        if (daysDiff < 0 && !isDone) {
          isOverdue = true;
        }
      }

      const badgeLabel = isDone 
        ? '✓ Completed' 
        : isPendingReview 
        ? '⏳ In Review' 
        : isOverdue 
        ? `⚠️ Overdue by ${Math.abs(daysDiff)}d` 
        : daysDiff <= 3 
        ? `🔥 Due in ${daysDiff}d` 
        : '📝 Assignment';

      const badgeColor = isDone
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        : isPendingReview
        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
        : isOverdue
        ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
        : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

      return {
        id: `dyn_assign_${assign.id}`,
        type: 'assignment',
        category: 'assignments',
        priority: isOverdue ? 'urgent' : 'normal',
        badgeLabel,
        badgeColor,
        title: assign.title || 'Troop Assignment',
        message: assign.description || `Assigned by Leader ${assign.leaderName || 'Scoutmaster'} • Due ${assign.dueDate || 'Soon'} • Category: ${assign.category || 'Scouting'}`,
        date: assign.dueDate || assign.createdAt || new Date().toISOString(),
        dueDate: assign.dueDate,
        leaderName: assign.leaderName,
        actionLabel: isDone ? 'View Submission' : 'Open Assignment & Submit',
        actionType: 'navigate',
        targetTab: 'assignments',
        isRead: isDone || dismissedDynamicIds.includes(`dyn_assign_${assign.id}`)
      };
    });

  // 3. Dynamic Upcoming Events (Next 14 Days)
  const dynamicEventAlerts = eventsList
    .filter(ev => {
      if (!ev.date) return false;
      const evDate = new Date(ev.date);
      evDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((evDate - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 14;
    })
    .map(ev => {
      const aud = getEventAudienceInfo(ev, currentUser, groups);
      const isCamp = (ev.type || '').toLowerCase().includes('camp') || (ev.title || '').toLowerCase().includes('camp');
      return {
        id: `dyn_event_${ev.id}`,
        type: 'event',
        category: 'events',
        priority: 'normal',
        badgeLabel: isCamp ? '⛺ Campout & Outing' : '📅 Upcoming Event',
        badgeColor: isCamp ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        title: ev.title || 'Troop Outing',
        message: `${ev.date} ${ev.time ? `at ${ev.time}` : ''} • Location: ${ev.location || 'Troop Headquarters'} • Scope: ${aud.badge}`,
        date: ev.date || new Date().toISOString(),
        eventData: ev,
        actionLabel: 'View Event Details & RSVP',
        actionType: 'navigate',
        targetTab: 'events',
        isRead: dismissedDynamicIds.includes(`dyn_event_${ev.id}`)
      };
    });

  // ── COMBINE ALL NOTIFICATION SOURCES ──
  const rawPushedItems = [...pushedNotifications, ...subcollectionNotifs].map(n => ({
    id: n.id,
    type: n.type || 'broadcast',
    category: 
      n.type === 'assignment' || n.type === 'homework' ? 'assignments' :
      n.type === 'event' || n.type === 'outing' ? 'events' :
      n.type === 'report' || n.type === 'rank' || n.type === 'badge' || n.type === 'advancement' ? 'advancement' :
      'broadcasts',
    priority: n.priority || 'normal',
    badgeLabel: 
      n.type === 'assignment' ? '📝 Assignment Alert' :
      n.type === 'event' ? '📅 Outing Notice' :
      n.type === 'report' ? '📄 Progress Report' :
      n.type === 'rank' || n.type === 'advancement' ? '⭐ Rank Certified' :
      n.type === 'badge' ? '🏅 Merit Badge' :
      '📢 Troop Broadcast',
    badgeColor: 
      n.type === 'assignment' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
      n.type === 'event' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
      n.type === 'report' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
      n.type === 'rank' || n.type === 'advancement' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
      'bg-red-500/20 text-red-300 border-red-500/40',
    title: n.title || 'Troop Alert',
    message: n.message || '',
    date: n.createdAt || n.timestamp || new Date().toISOString(),
    actionLabel: n.actionLabel || 'View Details',
    actionType: 'navigate',
    targetTab: n.actionUrl ? n.actionUrl.replace('/#', '').replace('/', '') : 'home',
    isRead: !!(n.read || n.isRead)
  }));

  // Unique merge by ID
  const allItemsMap = new Map();
  [...dynamicReportAlerts, ...dynamicHomeworkAlerts, ...dynamicEventAlerts, ...rawPushedItems].forEach(item => {
    if (!allItemsMap.has(item.id)) {
      allItemsMap.set(item.id, item);
    }
  });

  const allAlertsList = Array.from(allItemsMap.values());
  allAlertsList.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  // Category Filter
  const filteredAlerts = allAlertsList.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const unreadCount = allAlertsList.filter(item => !item.isRead).length;

  // ── ACTIONS ──
  // Mark Single Notification as Read
  const handleMarkAsRead = async (item) => {
    if (item.id.startsWith('dyn_')) {
      dismissDynamicItem(item.id);
    } else {
      try {
        await setDoc(doc(db, 'scout_notifications', item.id), { read: true, isRead: true }, { merge: true });
        if (scoutUid) {
          await setDoc(doc(db, 'users', scoutUid, 'notifications', item.id), { read: true, isRead: true }, { merge: true });
        }
      } catch (err) {
        console.warn("Mark as read error:", err);
      }
    }
  };

  // Mark All Notifications as Read
  const handleMarkAllAsRead = async () => {
    // 1. Mark all dynamic items as dismissed
    const dynamicIds = allAlertsList.filter(a => a.id.startsWith('dyn_')).map(a => a.id);
    setDismissedDynamicIds(prev => {
      const merged = [...new Set([...prev, ...dynamicIds])];
      try {
        localStorage.setItem(`dismissed_scout_alerts_${scoutUid}`, JSON.stringify(merged));
      } catch (e) {
        console.warn("Persist error:", e);
      }
      return merged;
    });

    // 2. Mark Firestore items as read
    const staticItems = allAlertsList.filter(a => !a.id.startsWith('dyn_') && !a.isRead);
    await Promise.all(
      staticItems.map(async (item) => {
        try {
          await setDoc(doc(db, 'scout_notifications', item.id), { read: true, isRead: true }, { merge: true });
          if (scoutUid) {
            await setDoc(doc(db, 'users', scoutUid, 'notifications', item.id), { read: true, isRead: true }, { merge: true });
          }
        } catch (e) {
          console.warn("Mark all read error:", e);
        }
      })
    );
  };

  // Handle Action CTA click
  const handleAlertAction = (item) => {
    handleMarkAsRead(item);
    if (item.actionType === 'open_report_modal' && item.reportData) {
      setViewingReport(item.reportData);
    } else if (item.actionType === 'navigate' && item.targetTab) {
      onNavigate && onNavigate(item.targetTab);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-100 pb-12 animate-fadeIn">
      
      {/* ── HEADER & STATS BAR ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-755 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-950/60 shrink-0">
            🔔
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">
                Troop Alerts & Live Feed
              </h2>
              {unreadCount > 0 ? (
                <span className="text-[10px] bg-red-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                  {unreadCount} Unread
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  ✓ All Caught Up
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real-time updates on assignments, published advancement reports, meetings, and troop announcements.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-center"
          >
            <Check size={14} className="text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* ── FILTER CHIPS ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Alerts', count: allAlertsList.length, icon: Bell },
          { 
            id: 'assignments', 
            label: 'Assignments & Tasks', 
            count: allAlertsList.filter(a => a.category === 'assignments').length, 
            icon: BookOpen 
          },
          { 
            id: 'events', 
            label: 'Outings & Events', 
            count: allAlertsList.filter(a => a.category === 'events').length, 
            icon: Calendar 
          },
          { 
            id: 'advancement', 
            label: 'Advancement & Reports', 
            count: allAlertsList.filter(a => a.category === 'advancement').length, 
            icon: Award 
          },
          { 
            id: 'broadcasts', 
            label: 'Troop Broadcasts', 
            count: allAlertsList.filter(a => a.category === 'broadcasts').length, 
            icon: Sparkles 
          }
        ].map(filter => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 scale-[1.02]'
                  : 'bg-slate-850 border border-slate-755 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{filter.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── NOTIFICATION CARDS LIST ── */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-12 text-center space-y-3 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto">
              ✨
            </div>
            <h3 className="text-base font-extrabold text-white">You're all caught up!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              There are no active alerts in this category right now. Be Prepared for the next troop meeting &bull; كُن مُسْتَعِدّاً
            </p>
          </div>
        ) : (
          filteredAlerts.map(item => {
            const isUnread = !item.isRead;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all duration-300 relative shadow-lg ${
                  isUnread
                    ? 'bg-slate-850 border-emerald-500/50 shadow-emerald-950/30 ring-1 ring-emerald-500/20'
                    : 'bg-slate-850/70 border-slate-755 hover:border-slate-700 opacity-90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left Icon & Content */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md ${
                      item.type === 'assignment'
                        ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                        : item.type === 'event'
                        ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                        : item.type === 'report'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                    }`}>
                      {item.type === 'assignment' ? '📝' : item.type === 'event' ? '⛺' : item.type === 'report' ? '📄' : '📢'}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badgeLabel}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock size={11} />
                          <span>{getRelativeTime(item.date)}</span>
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-white leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions CTA */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleAlertAction(item)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 hover:scale-[1.02]"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight size={13} />
                    </button>

                    {isUnread && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(item)}
                        className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Published Report Viewer Modal */}
      {viewingReport && (
        <PublishedReportViewerModal
          isOpen={!!viewingReport}
          onClose={() => setViewingReport(null)}
          report={viewingReport}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
