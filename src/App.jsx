import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import StudentHome from './components/StudentHome';
import LeaderHome from './components/LeaderHome';
import AdvancementTracker from './components/AdvancementTracker';
import PatrolChat from './components/PatrolChat';
import AdminPanel from './components/AdminPanel';
import ScoutList from './components/ScoutList';
import PatrolRoster from './components/PatrolRoster';
import MeritBadgeDashboard from './components/MeritBadgeDashboard';
import RoadToEagleGuide from './components/RoadToEagleGuide';
import GlobalAdminPanel from './components/GlobalAdminPanel';
import GroupManager from './components/GroupManager';
import VideoResources from './components/VideoResources';
import ScoutProfile from './components/ScoutProfile';
import LessonPlans from './components/LessonPlans';
import IslamicBasics from './components/IslamicBasics';
import ServiceLogs from './components/ServiceLogs';
import AssignmentsManager from './components/AssignmentsManager';
import EventsManager from './components/EventsManager';
import LeaderReportsCenter from './components/LeaderReportsCenter';
import LeaderMessagingHub from './components/LeaderMessagingHub';
import LeaderBroadcastCenter from './components/LeaderBroadcastCenter';
import LeaderParentRequests from './components/LeaderParentRequests';
import PatrolAttendance from './components/PatrolAttendance';
import ScoutAttendance from './components/ScoutAttendance';
import ScoutJournalNotes from './components/ScoutJournalNotes';
import ParentDashboard from './components/ParentDashboard';
import ScoutAlertsFeed from './components/ScoutAlertsFeed';
import RoleAndLeadershipGuide from './components/RoleAndLeadershipGuide';
import PatrolMeetingView from './components/PatrolMeetingView';
import DynamicIcon from './components/DynamicIcon';
import MobileTabManager from './components/MobileTabManager';
import MobileTabBar from './components/MobileTabBar';
import HubSubNav from './components/HubSubNav';
import { getNavItemColorTheme } from './utils/IconRegistry';
import { 
  subscribeToNavPreferences, 
  saveNavPreferences, 
  resetNavPreferences, 
  buildResolvedNavState 
} from './services/navigationPreferenceService';
import { HASSAN_LEADERSHIP_PROFILE } from './data/leaderCredentialsData';
import { syncAnehmeBadges } from './utils/anehmeMeritBadges';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot, collection, query, orderBy, limit, where } from 'firebase/firestore';
import {
  Menu,
  X,
  Home,
  Award,
  BookOpen,
  Star,
  Calendar,
  Clock,
  MessageSquare,
  Book,
  User,
  Shield,
  Users,
  Layers,
  FileText,
  LogOut,
  Printer,
  Compass,
  Sparkles,
  ChevronRight,
  Crown,
  Sliders,
  Inbox,
  Megaphone,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [authLoading, setAuthLoading] = useState(true);
  const [userGroupName, setUserGroupName] = useState('');
  const [userGroup, setUserGroup] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [unreadRequestsCount, setUnreadRequestsCount] = useState(0);
  const [unreadDirectMessagesCount, setUnreadDirectMessagesCount] = useState(0);
  const [unreadHomeworkCount, setUnreadHomeworkCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customizeNavOpen, setCustomizeNavOpen] = useState(false);
  const [navState, setNavState] = useState(() => buildResolvedNavState(null, { isOwner: false, isScout: true }));

  const [attendanceInitialData, setAttendanceInitialData] = useState(null);
  const [profileInitialTab, setProfileInitialTab] = useState('personal');
  const [profileSubTab, setProfileSubTab] = useState('personal');
  const [sidebarViewMode, setSidebarViewMode] = useState('auto'); // 'auto' | 'main'
  const [adminInitialTab, setAdminInitialTab] = useState('users');
  const [adminExtraData, setAdminExtraData] = useState(null);

  // Sub-tab states for Hub navigation
  const [scoutsHubSubTab, setScoutsHubSubTab] = useState('roster');
  const [commHubSubTab, setCommHubSubTab] = useState('direct-messages');
  const [advancementHubSubTab, setAdvancementHubSubTab] = useState('advancement');
  const [eventsHubSubTab, setEventsHubSubTab] = useState('events');
  const [knowledgeHubSubTab, setKnowledgeHubSubTab] = useState('islamic');
  const [tarbiyahHubSubTab, setTarbiyahHubSubTab] = useState('chat');
  const [adminHubSubTab, setAdminHubSubTab] = useState('admin');

  // Live ticking clock for header and sidebar navigation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Real-time Firebase Auth & User Profile Listener
  useEffect(() => {
    let unsubscribeProfile = () => {};

    // Fallback safety timer so authLoading never spins forever
    const authTimeout = setTimeout(() => {
      setAuthLoading(false);
    }, 2500);

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      clearTimeout(authTimeout);
      unsubscribeProfile();

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        
        // Listen to Firestore profile document in real-time
        unsubscribeProfile = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...snap.data()
            });
          } else {
            const tempProfile = {
              uid: user.uid,
              email: user.email,
              role: user.email === 'neoissa@gmail.com' ? 'owner' : 'scout',
              isOwner: user.email === 'neoissa@gmail.com'
            };
            setCurrentUser(tempProfile);
          }
          setAuthLoading(false);
        }, (err) => {
          console.warn("Firestore profile fetch failed, using auth profile:", err);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: user.email === 'neoissa@gmail.com' ? 'owner' : 'scout'
          });
          setAuthLoading(false);
        });
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => {
      clearTimeout(authTimeout);
      unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isScoutmaster = (currentUser?.role === 'leader' || currentUser?.role === 'admin') && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = (currentUser?.role === 'leader' || currentUser?.role === 'admin') && (currentUser?.leaderPosition === 'Assistant Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scout Master');
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;
  const isLeader = !isOwner && (currentUser?.role === 'leader' || currentUser?.role === 'admin');
  const isParent = !isOwner && !isLeader && currentUser?.role === 'parent';
  const isScout = !isOwner && !isLeader && !isParent;
  const isLeaderOrOwner = isOwner || isLeader;

  const userRoleContext = {
    isOwner,
    isScoutmaster,
    isAssistantScoutmaster,
    isExecutive,
    isLeader,
    isParent,
    isScout,
    isLeaderOrOwner
  };

  // Real-time navigation layout preferences synchronization
  useEffect(() => {
    if (!currentUser?.uid) {
      setNavState(buildResolvedNavState(null, userRoleContext));
      return;
    }

    const unsub = subscribeToNavPreferences(currentUser.uid, userRoleContext, (resolvedState) => {
      setNavState(resolvedState);
    });

    return () => unsub();
  }, [currentUser?.uid, isOwner, isLeader, isExecutive, isParent, isScout]);

  // 2. Proactively sync Owner (neoissa@gmail.com) and Hissa/Hassan leadership credentials on load if missing
  useEffect(() => {
    if (!currentUser?.uid) return;

    const isNeo = currentUser.email === 'neoissa@gmail.com';
    const isHissa = currentUser.username === 'hissa' || currentUser.username === 'hassan' || currentUser.email === 'hissa@talia.app' || currentUser.email === 'hassan@talia.app';
    const isAnehme = currentUser.username === 'anehme' || currentUser.email === 'anehme@talia.app' || currentUser.email?.toLowerCase().includes('anehme') || currentUser.fullName?.toLowerCase().includes('anehme');

    if (isAnehme) {
      syncAnehmeBadges(db, currentUser.uid)
        .then(() => console.log("Anehme merit badges synced successfully."))
        .catch(err => console.warn("Anehme badges sync failed:", err));
    }

    if (isNeo || isHissa || currentUser.role === 'owner') {
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = {};

      if (!currentUser.scoutingLeadership) updates.scoutingLeadership = HASSAN_LEADERSHIP_PROFILE.leadershipPositions;
      if (!currentUser.scoutingTrainings) updates.scoutingTrainings = HASSAN_LEADERSHIP_PROFILE.trainings;
      if (!currentUser.meritBadgeCounselorSubjects) updates.meritBadgeCounselorSubjects = HASSAN_LEADERSHIP_PROFILE.meritBadgeCounselorSubjects;
      if (!currentUser.credentialsValidThrough) updates.credentialsValidThrough = HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough;
      if (!currentUser.credentialsValidFormatted) updates.credentialsValidFormatted = HASSAN_LEADERSHIP_PROFILE.validityFormatted;
      if (!currentUser.bsaCouncil) updates.bsaCouncil = HASSAN_LEADERSHIP_PROFILE.bsaCouncil;
      if (!currentUser.certifyingOrg) updates.certifyingOrg = HASSAN_LEADERSHIP_PROFILE.certifyingOrg;
      if (currentUser.yptCompleted === undefined) updates.yptCompleted = true;

      if (!currentUser.spt) {
        updates.spt = HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough;
        updates.sptDate = HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough;
      }

      if (isNeo && (currentUser.role !== 'owner' || !currentUser.isOwner)) {
        updates.role = 'owner';
        updates.isOwner = true;
        updates.email = 'neoissa@gmail.com';
      }

      if (Object.keys(updates).length > 0) {
        setDoc(userRef, updates, { merge: true })
          .then(() => console.log("Leadership credentials initialized successfully."))
          .catch(err => console.error("Leadership credentials sync failed:", err));
      }
    }
  }, [currentUser?.uid, currentUser?.email, currentUser?.username, currentUser?.role]);

  // Fetch the user's group/patrol data in real-time (supporting Scouts, Leaders, and Parents)
  useEffect(() => {
    let unsubGroup = () => {};
    let unsubScout = () => {};

    const directGroupId = currentUser?.groupId || currentUser?.patrolId;

    if (directGroupId) {
      unsubGroup = onSnapshot(doc(db, 'groups', directGroupId), (snap) => {
        if (snap.exists()) {
          const gData = snap.data();
          setUserGroupName(gData.name || '');
          setUserGroup({ id: snap.id, ...gData });
        } else {
          setUserGroupName('');
          setUserGroup(null);
        }
      }, (err) => {
        console.warn("Failed to fetch user group data:", err);
        setUserGroupName('');
        setUserGroup(null);
      });
    } else if (currentUser?.role === 'parent' && Array.isArray(currentUser?.linkedScoutIds) && currentUser.linkedScoutIds.length > 0) {
      // Listen to first linked scout's group for parents
      const firstScoutId = currentUser.linkedScoutIds[0];
      unsubScout = onSnapshot(doc(db, 'users', firstScoutId), (scoutSnap) => {
        if (scoutSnap.exists()) {
          const sGroupId = scoutSnap.data().groupId || scoutSnap.data().patrolId;
          if (sGroupId) {
            unsubGroup = onSnapshot(doc(db, 'groups', sGroupId), (gSnap) => {
              if (gSnap.exists()) {
                const gData = gSnap.data();
                setUserGroupName(gData.name || '');
                setUserGroup({ id: gSnap.id, ...gData });
              }
            });
          }
        }
      });
    } else {
      setUserGroupName('');
      setUserGroup(null);
    }

    return () => {
      unsubGroup();
      unsubScout();
    };
  }, [currentUser?.groupId, currentUser?.patrolId, currentUser?.role, JSON.stringify(currentUser?.linkedScoutIds || [])]);

  // 3. Real-time Unread Chat Messages Listener
  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadChatCount(0);
      return;
    }

    const roomId = currentUser.groupId || currentUser.patrolId || currentUser.leaderId || 'general-stream';
    const lastReadStorageKey = `last_read_chat_${currentUser.uid}_${roomId}`;

    const isViewingChat = 
      ((currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && tarbiyahHubSubTab === 'chat') ||
      ((currentTab === 'communication-hub' || currentTab === 'comm-hub') && commHubSubTab === 'chat') ||
      currentTab === 'chat';

    if (isViewingChat) {
      const now = Date.now().toString();
      try {
        localStorage.setItem(lastReadStorageKey, now);
        localStorage.setItem(`last_read_chat_${currentUser.uid}_general-stream`, now);
        if (currentUser.groupId) localStorage.setItem(`last_read_chat_${currentUser.uid}_${currentUser.groupId}`, now);
        if (currentUser.patrolId) localStorage.setItem(`last_read_chat_${currentUser.uid}_${currentUser.patrolId}`, now);
      } catch (_) {}
      setUnreadChatCount(0);
      return;
    }

    const q = query(
      collection(db, 'chats', roomId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(40)
    );

    const unsub = onSnapshot(q, (snap) => {
      const isCurrentlyViewingChat = 
        ((currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && tarbiyahHubSubTab === 'chat') ||
        ((currentTab === 'communication-hub' || currentTab === 'comm-hub') && commHubSubTab === 'chat') ||
        currentTab === 'chat';

      if (isCurrentlyViewingChat) {
        const now = Date.now().toString();
        try {
          localStorage.setItem(lastReadStorageKey, now);
          localStorage.setItem(`last_read_chat_${currentUser.uid}_general-stream`, now);
          if (currentUser.groupId) localStorage.setItem(`last_read_chat_${currentUser.uid}_${currentUser.groupId}`, now);
          if (currentUser.patrolId) localStorage.setItem(`last_read_chat_${currentUser.uid}_${currentUser.patrolId}`, now);
        } catch (_) {}
        setUnreadChatCount(0);
        return;
      }

      const lastReadTimeStr = localStorage.getItem(lastReadStorageKey) || 
                              (currentUser.groupId ? localStorage.getItem(`last_read_chat_${currentUser.uid}_${currentUser.groupId}`) : null) ||
                              localStorage.getItem(`last_read_chat_${currentUser.uid}_general-stream`);
      const lastReadTime = lastReadTimeStr ? Number(lastReadTimeStr) : 0;

      let count = 0;
      snap.docs.forEach(docSnap => {
        const m = docSnap.data();
        if (m.senderId !== currentUser.uid) {
          const msgTime = m.timestamp?.toMillis ? m.timestamp.toMillis() : (m.timestamp ? new Date(m.timestamp).getTime() : Date.now());
          if (msgTime > lastReadTime) {
            count++;
          }
        }
      });
      setUnreadChatCount(count);
    }, (err) => console.warn("Unread chat listener error:", err));

    return () => unsub();
  }, [currentUser?.uid, currentUser?.groupId, currentUser?.patrolId, currentUser?.leaderId, currentTab, tarbiyahHubSubTab, commHubSubTab]);

  // Global event listener to immediately clear unread chat count when chat marks messages as read
  useEffect(() => {
    const handleChatReadEvent = () => {
      setUnreadChatCount(0);
    };
    window.addEventListener('patrol_chat_read', handleChatReadEvent);
    return () => window.removeEventListener('patrol_chat_read', handleChatReadEvent);
  }, []);

  // Reset unread count when switching to chat or patrol-hub tab
  useEffect(() => {
    const isViewingChat = 
      ((currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && tarbiyahHubSubTab === 'chat') ||
      ((currentTab === 'communication-hub' || currentTab === 'comm-hub') && commHubSubTab === 'chat') ||
      currentTab === 'chat';

    if (isViewingChat && currentUser?.uid) {
      const now = Date.now().toString();
      const roomId = currentUser.groupId || currentUser.patrolId || currentUser.leaderId || 'general-stream';
      try {
        localStorage.setItem(`last_read_chat_${currentUser.uid}_${roomId}`, now);
        localStorage.setItem(`last_read_chat_${currentUser.uid}_general-stream`, now);
        if (currentUser.groupId) localStorage.setItem(`last_read_chat_${currentUser.uid}_${currentUser.groupId}`, now);
        if (currentUser.patrolId) localStorage.setItem(`last_read_chat_${currentUser.uid}_${currentUser.patrolId}`, now);
      } catch (_) {}
      setUnreadChatCount(0);
    }
  }, [currentTab, tarbiyahHubSubTab, commHubSubTab, currentUser?.uid, currentUser?.groupId, currentUser?.patrolId, currentUser?.leaderId]);

  // Real-time unread notifications listener (Scouts, Parents & Leaders)
  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadAlertsCount(0);
      return;
    }

    const uId = currentUser.uid;
    const isLeaderRole = isLeader || isOwner || isExecutive;
    const unsubs = [];

    if (currentUser.role === 'scout') {
      // 1. Listen to /scout_notifications
      unsubs.push(onSnapshot(collection(db, 'scout_notifications'), (snap) => {
        const pushedUnread = snap.docs
          .map(d => d.data())
          .filter(n => (!n.recipientUid || n.recipientUid === uId || n.scoutEmail === currentUser.email) && !n.read && !n.isRead).length;
        setUnreadAlertsCount(pushedUnread);
      }, (err) => console.warn("Scout notifications listener fallback:", err)));

      // 2. Listen to subcollection /users/{scoutUid}/notifications
      unsubs.push(onSnapshot(collection(db, 'users', uId, 'notifications'), (snap) => {
        const subcolUnread = snap.docs.filter(d => !d.data().read && !d.data().isRead).length;
        if (subcolUnread > 0) {
          setUnreadAlertsCount(prev => Math.max(prev, subcolUnread));
        }
      }, (err) => console.warn("Subcol notifications listener fallback:", err)));
    } else if (isParent) {
      // 1. Listen to /parent_notifications
      unsubs.push(onSnapshot(collection(db, 'parent_notifications'), (snap) => {
        const parentUnread = snap.docs
          .map(d => d.data())
          .filter(n => (!n.recipientUid || n.recipientUid === uId || n.parentEmail === currentUser.email) && !n.read && !n.isRead).length;
        setUnreadAlertsCount(parentUnread);
      }, (err) => console.warn("Parent notifications listener fallback:", err)));

      // 2. Listen to subcollection /users/{parentUid}/notifications
      unsubs.push(onSnapshot(collection(db, 'users', uId, 'notifications'), (snap) => {
        const subcolUnread = snap.docs.filter(d => !d.data().read && !d.data().isRead).length;
        if (subcolUnread > 0) {
          setUnreadAlertsCount(prev => Math.max(prev, subcolUnread));
        }
      }, (err) => console.warn("Parent subcol notifications listener fallback:", err)));
    } else if (isLeaderRole) {
      // Listen to /leader_notifications and subcollection /users/{leaderUid}/notifications
      unsubs.push(onSnapshot(collection(db, 'leader_notifications'), (snap) => {
        const leaderUnread = snap.docs
          .map(d => d.data())
          .filter(n => (!n.recipientUid || n.recipientUid === uId || n.leaderEmail === currentUser.email) && !n.read && !n.isRead).length;
        setUnreadAlertsCount(leaderUnread);
      }, (err) => console.warn("Leader notifications listener fallback:", err)));

      unsubs.push(onSnapshot(collection(db, 'users', uId, 'notifications'), (snap) => {
        const subcolUnread = snap.docs.filter(d => !d.data().read && !d.data().isRead).length;
        if (subcolUnread > 0) {
          setUnreadAlertsCount(prev => Math.max(prev, subcolUnread));
        }
      }, (err) => console.warn("Subcol notifications listener fallback:", err)));
      // 3. Listen to pending parent signups & requests for Leaders/Owners
      unsubs.push(onSnapshot(collection(db, 'parent_signups'), (snap) => {
        const pending = snap.docs.filter(d => d.data().status === 'pending').length;
        setUnreadRequestsCount(pending);
      }, (err) => console.warn("Pending parent signups listener:", err)));
    }

    return () => unsubs.forEach(u => u());
  }, [currentUser?.uid, currentUser?.role, currentUser?.email, isParent, isLeader, isOwner, isExecutive]);

  // Real-time unread direct messages listener (Parents & Leaders)
  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadDirectMessagesCount(0);
      return;
    }

    const unsub = onSnapshot(collection(db, 'direct_messages'), (snap) => {
      let count = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        if (isParent && data.parentUid === currentUser.uid && data.unreadByParent) {
          count++;
        } else if ((isLeader || isOwner || isExecutive) && data.unreadByLeader) {
          if (isOwner || isExecutive || data.leaderUid === currentUser.uid || data.leaderUid === 'leadership') {
            count++;
          }
        }
      });
      setUnreadDirectMessagesCount(count);
    }, (err) => console.warn("Unread direct messages listener fallback:", err));

    return () => unsub();
  }, [currentUser?.uid, currentUser?.role, isParent, isLeader, isOwner, isExecutive]);

  // Real-time Homework & Challenges notification listener (Scouts, Parents & Leaders)
  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadHomeworkCount(0);
      return;
    }

    const unsubs = [];
    const isScout = currentUser.role === 'scout' || (!currentUser.role && !isParent && !isLeader && !isOwner);

    if (isScout) {
      let allAssignments = [];
      let scoutRecords = {};

      const computeScoutHomework = () => {
        const myGroupId = currentUser.groupId || currentUser.patrolId;
        const myUid = currentUser.uid;
        let pendingCount = 0;

        allAssignments.forEach(a => {
          const isAssigned = !a.assignedTarget || a.assignedTarget === 'all' || 
            (a.assignedTarget === 'patrol' && (a.targetGroupId === myGroupId || a.patrolId === myGroupId)) ||
            (a.assignedTarget === 'scout' && (a.targetScoutUid === myUid || a.scoutId === myUid));

          if (isAssigned) {
            const rec = scoutRecords[a.id] || {};
            const isDone = !!(rec.isCompleted || rec.status === 'completed' || rec.verifiedByLeader);
            if (!isDone) {
              pendingCount++;
            }
          }
        });
        setUnreadHomeworkCount(pendingCount);
      };

      unsubs.push(onSnapshot(collection(db, 'assignments'), (snap) => {
        allAssignments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        computeScoutHomework();
      }, (err) => console.warn("Assignments listener error:", err)));

      unsubs.push(onSnapshot(collection(db, 'user_progress', currentUser.uid, 'assignments'), (snap) => {
        const map = {};
        snap.docs.forEach(d => { map[d.id] = d.data(); });
        scoutRecords = map;
        computeScoutHomework();
      }, (err) => console.warn("Scout homework progress listener error:", err)));

    } else if (isParent) {
      let allAssignments = [];
      let homeworkRecords = {};
      let linkedChildren = [];

      const computeParentHomework = () => {
        let pendingCount = 0;
        linkedChildren.forEach(child => {
          const childUid = child.uid;
          const childGroupId = child.groupId || child.patrolId;

          allAssignments.forEach(a => {
            const isAssigned = !a.assignedTarget || a.assignedTarget === 'all' || 
              (a.assignedTarget === 'patrol' && (a.targetGroupId === childGroupId || a.patrolId === childGroupId)) ||
              (a.assignedTarget === 'scout' && (a.targetScoutUid === childUid || a.scoutId === childUid));

            if (isAssigned) {
              const key = `${a.id}_${childUid}`;
              const rec = homeworkRecords[key] || {};
              const isDone = !!(rec.isCompleted || rec.status === 'completed' || rec.verifiedByLeader);
              if (!isDone) {
                pendingCount++;
              }
            }
          });
        });
        setUnreadHomeworkCount(pendingCount);
      };

      unsubs.push(onSnapshot(query(collection(db, 'users'), where('role', '==', 'scout')), (snap) => {
        const scouts = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        linkedChildren = scouts.filter(s => 
          s.parentUid === currentUser.uid || 
          (currentUser.email && s.parentEmail === currentUser.email) ||
          (Array.isArray(currentUser.childrenUids) && currentUser.childrenUids.includes(s.uid)) ||
          (Array.isArray(currentUser.linkedScoutIds) && currentUser.linkedScoutIds.includes(s.uid))
        );
        computeParentHomework();
      }, (err) => console.warn("Linked children listener error:", err)));

      unsubs.push(onSnapshot(collection(db, 'assignments'), (snap) => {
        allAssignments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        computeParentHomework();
      }, (err) => console.warn("Assignments listener error:", err)));

      unsubs.push(onSnapshot(collection(db, 'scout_homework'), (snap) => {
        const map = {};
        snap.docs.forEach(d => { map[d.id] = d.data(); });
        homeworkRecords = map;
        computeParentHomework();
      }, (err) => console.warn("Scout homework listener error:", err)));

    } else if (isLeader || isOwner || isExecutive) {
      unsubs.push(onSnapshot(collection(db, 'scout_homework'), (snap) => {
        const awaitingVerification = snap.docs.filter(d => {
          const rec = d.data();
          return (rec.status === 'submitted' || !!rec.submittedAt) && !rec.verifiedByLeader && !rec.isCompleted;
        }).length;
        setUnreadHomeworkCount(awaitingVerification);
      }, (err) => console.warn("Leader scout homework listener error:", err)));
    }

    return () => unsubs.forEach(u => u());
  }, [currentUser?.uid, currentUser?.role, currentUser?.groupId, currentUser?.patrolId, currentUser?.email, isParent, isLeader, isOwner, isExecutive]);

  // 4. Automatically set default tab when user logs in or role changes
  useEffect(() => {
    if (currentUser) {
      if (!currentTab || currentTab === '') {
        setCurrentTab('home');
      }
    }
  }, [currentUser?.role, currentUser?.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentTab('');
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const handleNavigate = (tab, extraData = null) => {
    setSidebarViewMode('auto');
    // 0. Home & Parent Hub Aliases
    if (tab === 'parent-hub' || tab === 'parent-dashboard' || tab === 'family-hub' || tab === 'home') {
      setCurrentTab('home');
      setMobileMenuOpen(false);
      return;
    }

    // 1. Knowledge Hub Sub-tools (All Roles)
    if (tab === 'knowledge-hub' || tab === 'knowledge') {
      if (extraData?.subTab) {
        setKnowledgeHubSubTab(extraData.subTab);
      }
      setCurrentTab('knowledge-hub');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'islamic' || tab === 'islamic-basics' || tab === 'duas') {
      setCurrentTab('knowledge-hub');
      setKnowledgeHubSubTab('islamic');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'handbooks' || tab === 'field-manuals' || tab === 'scouting-handbook') {
      setCurrentTab('advancement-hub');
      setAdvancementHubSubTab('handbooks');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'videos' || tab === 'video-tutorials' || tab === 'spt-videos') {
      setCurrentTab('advancement-hub');
      setAdvancementHubSubTab('videos');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'leadership' || tab === 'leadership-guide' || tab === 'roles' || tab === 'role-guide') {
      setCurrentTab('advancement-hub');
      setAdvancementHubSubTab('leadership');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'resources') {
      if (isParent) {
        setCurrentTab('resources');
      } else {
        setCurrentTab('advancement-hub');
        setAdvancementHubSubTab('handbooks');
      }
      setMobileMenuOpen(false);
      return;
    }

    // 2. Standalone Homework & Field Notes
    if (tab === 'assignments' || tab === 'homework') {
      if (isParent) {
        setCurrentTab('assignments');
      } else {
        setCurrentTab('assignments');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'journal' || tab === 'notes' || tab === 'field-notes') {
      setCurrentTab('journal');
      setMobileMenuOpen(false);
      return;
    }

    // 3. Pure Troop Schedule & Tasks
    if (tab === 'events' || tab === 'calendar' || tab === 'schedule') {
      if (isParent) {
        setCurrentTab('events');
      } else {
        setCurrentTab('events');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'tasks' || tab === 'forms') {
      if (isParent) {
        setCurrentTab('tasks');
      } else if (isScout) {
        setCurrentTab('assignments');
      } else {
        setCurrentTab('admin-hub');
        setAdminHubSubTab('admin');
        setAdminInitialTab('forms');
      }
      setMobileMenuOpen(false);
      return;
    }

    // 4. Scouts & Patrols Sub-tools (Leaders/Owners)
    if (tab === 'roster') {
      setCurrentTab('scouts-hub');
      setScoutsHubSubTab('roster');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'attendance') {
      if (extraData) setAttendanceInitialData(extraData);
      if (isParent) {
        setCurrentTab('attendance');
      } else if (isScout) {
        setCurrentTab('attendance');
      } else {
        setCurrentTab('scouts-hub');
        setScoutsHubSubTab('attendance');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'scouts') {
      setCurrentTab('scouts-hub');
      setScoutsHubSubTab('advancement');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'reports') {
      if (isParent) {
        setCurrentTab('reports');
      } else if (isScout) {
        setCurrentTab('profile');
        setProfileInitialTab('reports');
      } else {
        setCurrentTab('scouts-hub');
        setScoutsHubSubTab('reports');
      }
      setMobileMenuOpen(false);
      return;
    }

    // 5. Advancement Sub-tools
    if (tab === 'advancement' || tab === 'advancement-hub') {
      if (isParent) {
        setCurrentTab('advancement');
      } else {
        setCurrentTab('advancement-hub');
        setAdvancementHubSubTab('advancement');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'merit-badges') {
      if (isScout) {
        setCurrentTab('advancement-hub');
        setAdvancementHubSubTab('merit-badges');
      } else if (isParent) {
        setCurrentTab('road-to-eagle');
      } else {
        setCurrentTab('merit-badges');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'road-to-eagle' || tab === 'eagle') {
      if (isScout) {
        setCurrentTab('advancement-hub');
        setAdvancementHubSubTab('road-to-eagle');
      } else if (isParent) {
        setCurrentTab('road-to-eagle');
      } else {
        setCurrentTab('road-to-eagle');
      }
      setMobileMenuOpen(false);
      return;
    }

    // 6. Communications & Patrol Hub Sub-tools
    if (tab === 'direct-messages') {
      if (isParent) {
        setCurrentTab('direct-messages');
      } else {
        setCurrentTab('communication-hub');
        setCommHubSubTab('direct-messages');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'broadcasts' || tab === 'troop-broadcasts' || tab === 'broadcast' || tab === 'feed' || tab === 'alerts') {
      if (isLeaderOrOwner || isExecutive) {
        setCurrentTab('communication-hub');
        setCommHubSubTab('broadcasts');
        setAdminInitialTab('broadcasts');
        setAdminExtraData(extraData);
      } else if (isParent) {
        setCurrentTab('feed');
      } else {
        setCurrentTab('feed');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'parent-requests' || tab === 'admin-requests') {
      if (isLeaderOrOwner || isExecutive) {
        setCurrentTab('communication-hub');
        setCommHubSubTab('parent-requests');
        setAdminInitialTab('requests');
        setAdminExtraData(extraData);
      } else {
        setCurrentTab('direct-messages');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'tarbiyah-hub' || tab === 'patrol-hub') {
      if (extraData?.subTab) {
        setTarbiyahHubSubTab(extraData.subTab);
        if (extraData.subTab === 'chat') setUnreadChatCount(0);
      } else {
        setTarbiyahHubSubTab('chat');
        setUnreadChatCount(0);
      }
      const now = Date.now().toString();
      const roomId = currentUser?.groupId || currentUser?.patrolId || currentUser?.leaderId || 'general-stream';
      try {
        localStorage.setItem(`last_read_chat_${currentUser?.uid}_${roomId}`, now);
        localStorage.setItem(`last_read_chat_${currentUser?.uid}_general-stream`, now);
        if (currentUser?.groupId) localStorage.setItem(`last_read_chat_${currentUser?.uid}_${currentUser.groupId}`, now);
        if (currentUser?.patrolId) localStorage.setItem(`last_read_chat_${currentUser?.uid}_${currentUser.patrolId}`, now);
      } catch (_) {}
      setCurrentTab('tarbiyah-hub');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'chat' || tab === 'patrol-chat') {
      setUnreadChatCount(0);
      const now = Date.now().toString();
      const roomId = currentUser?.groupId || currentUser?.patrolId || currentUser?.leaderId || 'general-stream';
      try {
        localStorage.setItem(`last_read_chat_${currentUser?.uid}_${roomId}`, now);
        localStorage.setItem(`last_read_chat_${currentUser?.uid}_general-stream`, now);
        if (currentUser?.groupId) localStorage.setItem(`last_read_chat_${currentUser?.uid}_${currentUser.groupId}`, now);
        if (currentUser?.patrolId) localStorage.setItem(`last_read_chat_${currentUser?.uid}_${currentUser.patrolId}`, now);
      } catch (_) {}
      if (isScout) {
        setCurrentTab('tarbiyah-hub');
        setTarbiyahHubSubTab('chat');
      } else if (isLeaderOrOwner || isExecutive) {
        setCurrentTab('communication-hub');
        setCommHubSubTab('chat');
      } else {
        setCurrentTab('chat');
      }
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'meetings' || tab === 'patrol-meetings' || tab === 'halqa') {
      setCurrentTab('tarbiyah-hub');
      setTarbiyahHubSubTab('meetings');
      setMobileMenuOpen(false);
      return;
    }

    // 6. Admin & Profile Sub-tools
    if (tab === 'admin-hub' || tab === 'admin' || tab === 'global-admin') {
      if (extraData?.tab) {
        setAdminInitialTab(extraData.tab);
        setAdminExtraData(extraData);
      } else {
        setAdminInitialTab('users');
        setAdminExtraData(null);
      }
      setCurrentTab('admin-hub');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'scouts-hub') {
      if (extraData?.subTab) {
        setScoutsHubSubTab(extraData.subTab);
      }
      setCurrentTab('scouts-hub');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'communication-hub' || tab === 'comm-hub') {
      if (extraData?.subTab) {
        setCommHubSubTab(extraData.subTab);
        if (extraData.subTab === 'chat') setUnreadChatCount(0);
      }
      setCurrentTab('communication-hub');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'events-hub') {
      if (extraData?.subTab) {
        setEventsHubSubTab(extraData.subTab);
      }
      setCurrentTab('events-hub');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'lesson-plans' || tab === 'curriculum') {
      setCurrentTab('lesson-plans');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'profile') {
      const pTab = typeof extraData === 'string' ? extraData : extraData?.tab || 'personal';
      setProfileInitialTab(pTab);
      setProfileSubTab(pTab);
      setCurrentTab('profile');
      setSidebarViewMode('auto');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'counselors' || tab === 'counselor-directory') {
      setCurrentTab('profile');
      setProfileInitialTab('credentials');
      setProfileSubTab('credentials');
      setSidebarViewMode('auto');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'service-log') {
      setCurrentTab('profile');
      setProfileInitialTab('service');
      setProfileSubTab('service');
      setSidebarViewMode('auto');
      setMobileMenuOpen(false);
      return;
    }

    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setSidebarViewMode('auto');
    handleNavigate(tabId);
    setMobileMenuOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 font-semibold text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Dhulfiqār Portal...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  const roleLabel = isOwner 
    ? 'Troop Owner / Superadmin' 
    : isScoutmaster 
    ? 'Scoutmaster' 
    : isAssistantScoutmaster 
    ? 'Assistant Scoutmaster' 
    : currentUser?.role === 'admin' 
    ? 'Executive Admin' 
    : isLeader 
    ? (currentUser?.leaderPosition || 'Troop Leader') 
    : isParent 
    ? 'Parent / Guardian' 
    : 'Scout';

  // ── SAVE & RESET NAVIGATION PREFERENCES ──
  const handleSaveNavPreferences = async (updatedNav) => {
    if (!currentUser?.uid) return;
    await saveNavPreferences(currentUser.uid, updatedNav);
    setNavState(buildResolvedNavState(updatedNav, userRoleContext));
  };

  const handleResetNavPreferences = async () => {
    if (!currentUser?.uid) return null;
    const resetState = await resetNavPreferences(currentUser.uid, userRoleContext);
    setNavState(resetState);
    return resetState;
  };

  // Dynamic navigation items filtered by visibility and assigned real-time badge counts
  const navItems = (navState?.tabs || [])
    .filter(tab => tab.visible)
    .map(tab => {
      let badge = 0;
      if (tab.badgeKey === 'unreadChatCount' || tab.id === 'chat' || tab.id === 'tarbiyah-hub' || tab.id === 'patrol-hub') badge = unreadChatCount;
      if (tab.badgeKey === 'unreadAlertsCount' || tab.id === 'feed') badge = unreadAlertsCount;
      if (tab.badgeKey === 'unreadDirectMessagesCount' || tab.id === 'direct-messages') badge = unreadDirectMessagesCount;
      if (tab.badgeKey === 'unreadHomeworkCount' || tab.id === 'assignments' || tab.id === 'homework') badge = unreadHomeworkCount;
      if (tab.id === 'events-hub') badge = unreadHomeworkCount;
      if (tab.id === 'communication-hub' || tab.id === 'comm-hub') badge = unreadDirectMessagesCount + unreadRequestsCount + unreadChatCount;
      return {
        ...tab,
        badge
      };
    });

  // Dynamic mobile bottom navigation items (custom pinned quick slots + permanent Menu)
  const getMobileBottomNavItems = () => {
    const bottomIds = navState?.bottomTabIds || [];
    const items = [];

    for (const tabId of bottomIds) {
      const foundTab = (navState?.tabs || []).find(t => t.id === tabId);
      if (foundTab && foundTab.visible !== false) {
        let badge = 0;
        if (foundTab.badgeKey === 'unreadChatCount' || foundTab.id === 'chat' || foundTab.id === 'tarbiyah-hub' || foundTab.id === 'patrol-hub') badge = unreadChatCount;
        if (foundTab.badgeKey === 'unreadAlertsCount' || foundTab.id === 'feed') badge = unreadAlertsCount;
        if (foundTab.badgeKey === 'unreadDirectMessagesCount' || foundTab.id === 'direct-messages') badge = unreadDirectMessagesCount;
        if (foundTab.badgeKey === 'unreadHomeworkCount' || foundTab.id === 'assignments' || foundTab.id === 'homework') badge = unreadHomeworkCount;
        if (foundTab.id === 'events-hub') badge = unreadHomeworkCount;
        if (foundTab.id === 'communication-hub' || foundTab.id === 'comm-hub') badge = unreadDirectMessagesCount + unreadRequestsCount + unreadChatCount;
        items.push({
          id: foundTab.id,
          label: foundTab.label,
          icon: foundTab.icon,
          badge
        });
      }
    }

    // Always append the permanent More/Menu drawer button
    items.push({
      id: '__more__',
      label: 'Menu',
      icon: '☰',
      badge: 0
    });

    return items;
  };

  // Returns sub-menu configuration for the current active tab
  const getActiveSubMenu = () => {
    if (currentTab === 'profile') {
      const items = [
        {
          id: 'personal',
          label: isParent ? 'Family Profile' : isScout ? 'ID Pass & Personal' : 'Personal Info',
          icon: 'User',
          description: isParent ? 'Household & emergency data' : 'Digital card & bio'
        },
        ...(isScout ? [
          { id: 'medical', label: 'Medical & Safety', icon: 'HeartPulse', description: 'AHMR, allergies & health notes' },
          { id: 'gear', label: 'Uniform & Gear', icon: 'Shirt', description: 'Inspection & 10 Essentials checklist' }
        ] : []),
        ...(!isScout ? [
          { id: 'credentials', label: 'Scouting Credentials', icon: 'Award', description: 'Badges & leadership awards' },
          { id: 'spt', label: isParent ? 'Safety Training (SPT)' : 'SPT Certificate', icon: 'Shield', description: 'Youth protection status' }
        ] : []),
        ...(!isParent ? [
          { id: 'roles-guide', label: 'Role & Leadership Guide', icon: 'Crown', description: 'Duties & expectations' }
        ] : []),
        { id: 'security', label: 'Security & Password', icon: 'Lock', description: 'PIN, password & auth' }
      ];

      return {
        id: 'profile',
        title: isParent ? 'Family Profile' : isScout ? 'Scout Profile' : isOwner ? 'Owner Profile' : 'Leader Profile',
        colorTheme: isOwner ? 'amber' : 'emerald',
        activeTabId: profileSubTab || profileInitialTab || 'personal',
        onSelect: (subId) => {
          setProfileSubTab(subId);
          setProfileInitialTab(subId);
        },
        items
      };
    }

    if (currentTab === 'scouts-hub' && (isLeaderOrOwner || isExecutive)) {
      return {
        id: 'scouts-hub',
        title: 'Scouts & Patrols',
        colorTheme: 'emerald',
        activeTabId: scoutsHubSubTab,
        onSelect: (subId) => setScoutsHubSubTab(subId),
        items: [
          { id: 'roster', label: 'Patrol Roster', icon: 'Users', description: 'Active scouts & member profiles' },
          { id: 'attendance', label: 'Attendance & Roll Call', icon: 'CheckSquare', description: 'Session check-in & logs' },
          { id: 'advancement', label: 'Advancement & Sign-Offs', icon: 'Award', description: 'Rank requirements & approvals' },
          { id: 'assignments', label: 'Weekly Homework', icon: 'BookOpen', badge: unreadHomeworkCount, description: 'Assign, Grade & Review Scout Homework' },
          { id: 'reports', label: 'Reports & Audits', icon: 'FileText', description: 'Official PDF reports & records' }
        ]
      };
    }

    if (currentTab === 'communication-hub' && (isLeaderOrOwner || isExecutive)) {
      return {
        id: 'communication-hub',
        title: 'Communications',
        colorTheme: 'indigo',
        activeTabId: commHubSubTab,
        onSelect: (subId) => setCommHubSubTab(subId),
        items: [
          { id: 'direct-messages', label: 'Parent Inquiries & DMs', icon: 'MessageSquare', badge: unreadDirectMessagesCount, description: '1-on-1 private messaging' },
          { id: 'broadcasts', label: 'Troop Broadcasts', icon: 'Megaphone', description: 'Announcements & SMS/Email' },
          { id: 'chat', label: 'Patrol Messenger', icon: 'Radio', badge: unreadChatCount, description: 'Encrypted patrol discussions' },
          { id: 'parent-requests', label: 'Parent Approvals', icon: 'Inbox', badge: unreadRequestsCount, description: 'Conference & signup reviews' }
        ]
      };
    }

    if (currentTab === 'advancement-hub' && !isParent) {
      return {
        id: 'advancement-hub',
        title: 'Advancement Hub',
        colorTheme: 'emerald',
        activeTabId: advancementHubSubTab,
        onSelect: (subId) => setAdvancementHubSubTab(subId),
        items: [
          { id: 'advancement', label: '7 Ranks Progress', icon: 'Compass', description: 'Scout through Eagle' },
          { id: 'merit-badges', label: 'Merit Badges & Eagle', icon: 'Star', description: 'Required & elective badges' },
          { id: 'road-to-eagle', label: 'Road to Eagle Guide', icon: 'Mountain', description: 'Step-by-step pathway' },
          { id: 'handbooks', label: 'Scouting Handbooks & Forms', icon: 'Book', description: 'Official guides & references' },
          { id: 'videos', label: 'Video Demonstrations & SPT', icon: 'Video', description: 'Skills & safety training' },
          { id: 'leadership', label: 'Leadership Roles Guide', icon: 'Crown', description: 'Position expectations' }
        ]
      };
    }

    if ((currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && !isParent) {
      return {
        id: 'tarbiyah-hub',
        title: 'Patrol Hub',
        colorTheme: 'indigo',
        activeTabId: tarbiyahHubSubTab,
        onSelect: (subId) => setTarbiyahHubSubTab(subId),
        items: [
          { id: 'chat', label: 'Patrol Live Messenger', icon: 'MessageSquare', badge: unreadChatCount, description: 'Real-time patrol channel' },
          { id: 'meetings', label: 'Patrol Meeting & Google Meet', icon: 'Video', description: 'Huddle agendas & links' }
        ]
      };
    }

    if (currentTab === 'events-hub' && !isParent) {
      return {
        id: 'events-hub',
        title: 'Schedule & Tasks',
        colorTheme: 'sky',
        activeTabId: eventsHubSubTab,
        onSelect: (subId) => setEventsHubSubTab(subId),
        items: [
          { id: 'events', label: 'Troop Calendar & RSVPs', icon: 'Calendar', description: 'Meetings, campouts & trips' },
          { id: 'assignments', label: 'Homework & Challenges', icon: 'BookOpen', badge: unreadHomeworkCount, description: 'Weekly tasks & submissions' }
        ]
      };
    }

    if (currentTab === 'knowledge-hub' || currentTab === 'knowledge') {
      return {
        id: 'knowledge-hub',
        title: 'Islamic Tarbiyah',
        colorTheme: 'emerald',
        activeTabId: knowledgeHubSubTab,
        onSelect: (subId) => setKnowledgeHubSubTab(subId),
        items: [
          { id: 'islamic', label: 'Islamic Tarbiyah & Duas', icon: 'Sparkles', description: 'Duas, halqas & character' }
        ]
      };
    }

    return null;
  };

  const getSubItemTheme = (subItem, isActive, colorTheme) => {
    return {
      activeContainer: 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-950/40 border-sky-400 ring-1 ring-sky-300/30',
      activeIconBox: 'bg-slate-950/20 text-slate-950',
      inactiveIconBox: 'bg-slate-800 border border-slate-700/60 text-sky-400 group-hover:text-sky-300',
      activeIcon: 'text-slate-950',
      inactiveIcon: 'text-sky-400 group-hover:text-sky-300',
      activeDesc: 'text-slate-900 font-medium',
      activeBadge: 'bg-slate-950 text-sky-300'
    };
  };

  const renderNavigationArea = (isMobile = false) => {
    const activeSubMenu = sidebarViewMode === 'auto' ? getActiveSubMenu() : null;

    if (activeSubMenu) {
      return (
        <nav className={`flex-1 ${isMobile ? 'p-3' : 'px-3 py-1'} space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800`}>
          {/* Back to Main Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarViewMode('main')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 transition-all duration-200 cursor-pointer shadow-md group select-none"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-700/80 border border-slate-600/60 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform shrink-0">
              <ArrowLeft size={13} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Return to</span>
              <span className="block text-xs font-black truncate text-emerald-400 group-hover:text-emerald-300">Main Menu</span>
            </div>
          </button>

          {/* Section Header */}
          <div className="pt-1 px-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 truncate">
              <Layers size={12} className="text-slate-400 shrink-0" />
              <span>{activeSubMenu.title} Sections</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50 shrink-0 font-bold">
              {activeSubMenu.items.length} {activeSubMenu.items.length === 1 ? 'section' : 'sections'}
            </span>
          </div>

          {/* Sub-Menu Items */}
          <div className="space-y-1 pt-0.5">
            {activeSubMenu.items.map((subItem) => {
              const isSubActive = activeSubMenu.activeTabId === subItem.id;
              const itemTheme = getSubItemTheme(subItem, isSubActive, activeSubMenu.colorTheme);

              return (
                <button
                  key={subItem.id}
                  type="button"
                  onClick={() => {
                    activeSubMenu.onSelect(subItem.id);
                    if (isMobile) setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group min-h-[42px] border ${
                    isSubActive
                      ? itemTheme.activeContainer
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs ${
                      isSubActive ? itemTheme.activeIconBox : itemTheme.inactiveIconBox
                    }`}>
                      <DynamicIcon
                        name={subItem.icon}
                        size={15}
                        className={isSubActive ? itemTheme.activeIcon : itemTheme.inactiveIcon}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className={`block truncate ${isSubActive ? 'font-black' : 'font-semibold'}`}>
                        {subItem.label}
                      </span>
                      {subItem.description && (
                        <span className={`block text-[10px] truncate ${isSubActive ? itemTheme.activeDesc : 'text-slate-400'}`}>
                          {subItem.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {subItem.badge > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs ${
                        isSubActive ? itemTheme.activeBadge : 'bg-red-500 text-white animate-pulse'
                      }`}>
                        {subItem.badge > 99 ? '99+' : subItem.badge}
                      </span>
                    )}
                    <ChevronRight
                      size={13}
                      className={`transition-transform duration-200 ${
                        isSubActive ? 'opacity-90 translate-x-0.5' : 'opacity-0 group-hover:opacity-60'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      );
    }

    // Fallback / Main Navigation Menu
    const currentSubMenuConfig = getActiveSubMenu();
    return (
      <nav className={`flex-1 ${isMobile ? 'p-3' : 'px-3 py-1'} space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800`}>
        {/* If in main menu while viewing a section with sub-tabs, show quick shortcut banner */}
        {currentSubMenuConfig && (
          <button
            type="button"
            onClick={() => setSidebarViewMode('auto')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border border-sky-500/40 transition mb-2 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Layers size={13} className="text-sky-400 shrink-0" />
              <span className="truncate">Open {currentSubMenuConfig.title} Sub-Menu</span>
            </div>
            <ChevronRight size={13} className="text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        )}

        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1.5 flex items-center justify-between">
          <span>Navigation Menu</span>
          <span className="text-[9px] font-mono text-slate-500 font-bold lowercase">{navItems.length} modules</span>
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const itemTheme = getNavItemColorTheme(item, isActive, isOwner);
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 ${isMobile ? 'py-2.5 min-h-[44px]' : 'py-2'} rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group ${
                isActive
                  ? 'bg-sky-500/15 text-white border-l-4 border-sky-400 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 shadow-xs ${
                  isActive
                    ? `${itemTheme.activePill} ${itemTheme.glow}`
                    : `${itemTheme.pillBg} ${itemTheme.border}`
                }`}>
                  <DynamicIcon 
                    name={item.icon} 
                    size={15} 
                    className={isActive ? itemTheme.activeIcon || itemTheme.icon : itemTheme.icon} 
                  />
                </div>
                <span className={`truncate text-xs ${
                  isActive 
                    ? 'text-sky-300 font-black' 
                    : 'font-semibold text-slate-300 group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              </div>
              {item.badge > 0 ? (
                <span className="bg-sky-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0 shadow-sm">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : (
                isActive && <ChevronRight size={13} className="text-sky-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>
    );
  };

  const userPhoto = currentUser.photoURL || currentUser.avatar || currentUser.photo || currentUser.profilePic;
  const userInitials = (currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || (isParent ? 'P' : isLeader ? 'L' : 'S')).toUpperCase();

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="app-viewport-container text-slate-100 font-sans">
      
      {/* ── MOBILE TOP BAR (VISIBLE ON SMALL SCREENS ONLY) ── */}
      <header className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 sticky top-0 z-40 flex items-center justify-between gap-2.5 print-hide">
        <div 
          onClick={() => handleTabClick('profile')}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1"
          title="Open My Profile"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md overflow-hidden shrink-0 group-hover:scale-105 transition border border-sky-500/40 bg-slate-800 text-sky-300">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={currentUser.fullName || currentUser.username}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : isOwner ? (
              <Crown size={18} className="text-sky-300" />
            ) : isLeader || isExecutive ? (
              <Shield size={18} className="text-sky-300" />
            ) : isParent ? (
              <Users size={18} className="text-sky-300" />
            ) : (
              <Compass size={18} className="text-sky-300" />
            )}
            {/* Small Role Badge in Corner */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 bg-sky-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs sm:text-sm font-black text-white leading-tight flex items-center gap-1.5 min-w-0">
              <span className="truncate group-hover:text-sky-300 transition">Dhulfiqār Scouts</span>
              {isOwner ? (
                <span className="text-[8px] sm:text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/40 px-1.5 py-0.2 rounded font-black uppercase shrink-0">
                  👑 OWNER
                </span>
              ) : isLeader || isExecutive ? (
                <span className="text-[8px] sm:text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/40 px-1.5 py-0.2 rounded font-black uppercase shrink-0">
                  ⚜️ LEADER
                </span>
              ) : null}
            </h1>
            <span className="text-[10px] sm:text-[11px] font-semibold truncate block text-sky-300">
              {currentUser.fullName || currentUser.username} • {userGroupName ? `${userGroupName} Patrol` : roleLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 font-mono font-bold text-xs px-2 py-1 rounded-lg border border-slate-800 text-sky-400 bg-slate-950/80 shrink-0">
            <Clock size={12} className="animate-pulse" />
            <span>{formattedTime}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY (MOBILE ONLY) ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex print-hide animate-fadeIn">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-slate-900/95 border-r border-slate-800/80 flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-lg shadow-sky-950/50 bg-slate-900 shrink-0 flex items-center justify-center p-0.5">
                  <img 
                    src="/app-logo.jpg" 
                    alt="Dhulfiqār Scouts" 
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Dhulfiqār Scouts</h2>
                  <span className={`text-[10px] border px-2 py-0.2 rounded-full font-semibold uppercase ${
                    isOwner 
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {isOwner ? '👑 Owner Console' : isLeader || isExecutive ? '⚜️ Leader Console' : 'v3.0'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile Summary */}
            <div className={`p-4 border-b space-y-3 ${
              isOwner 
                ? 'bg-slate-900/95 border-sky-500/20' 
                : 'bg-slate-900/90 border-slate-800/80'
            }`}>
              {/* Authority Badge */}
              {isOwner ? (
                <div className="bg-sky-500/15 border border-sky-500/40 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-black text-sky-300 uppercase tracking-wider">
                  <Crown size={12} className="text-sky-400" />
                  <span>👑 Troop Owner & Superadmin</span>
                </div>
              ) : isLeader || isExecutive ? (
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-extrabold text-sky-300 uppercase tracking-wider">
                  <Shield size={12} className="text-sky-400" />
                  <span>⚜️ Troop Leadership Console</span>
                </div>
              ) : null}

              <div 
                onClick={() => handleTabClick('profile')}
                className="flex items-center gap-3 p-1.5 -m-1.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition group"
                title="Open My Profile"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-md overflow-hidden relative group-hover:scale-105 transition border-2 border-sky-500/40 bg-gradient-to-br from-sky-500/20 to-slate-800 text-sky-300 shadow-sky-950/40">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={currentUser.fullName || currentUser.username}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : isOwner ? (
                    <Crown size={22} className="text-sky-300" />
                  ) : isLeader || isExecutive ? (
                    <Shield size={22} className="text-sky-300" />
                  ) : isParent ? (
                    <Users size={22} className="text-sky-300" />
                  ) : (
                    <Compass size={22} className="text-sky-300" />
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full shadow-sm bg-sky-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-black text-white truncate leading-tight group-hover:text-sky-300 transition">
                      {currentUser.fullName || currentUser.username}
                    </h4>
                    <ChevronRight size={13} className="text-slate-500 group-hover:text-sky-400 shrink-0 transition" />
                  </div>
                  <p className="text-[11px] font-semibold capitalize truncate mt-0.5 text-sky-400">{roleLabel}</p>
                </div>
              </div>

              {/* View / Edit Profile Button */}
              <button
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm ${
                  currentTab === 'profile'
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
                    : 'bg-slate-900 hover:bg-sky-500/15 text-sky-300 border-sky-500/30'
                }`}
              >
                <User size={13} className={currentTab === 'profile' ? 'text-slate-950' : 'text-sky-400'} />
                <span>{currentTab === 'profile' ? 'Viewing Profile' : 'View / Edit Profile'}</span>
              </button>

              {/* Patrol / Organization Badge with Icon */}
              <div className="text-xs px-3 py-2 rounded-xl border flex items-center gap-2.5 shadow-inner bg-slate-950/90 text-sky-300 border-slate-800/90">
                {userGroup?.photoURL ? (
                  <img
                    src={userGroup.photoURL}
                    alt={userGroupName || 'Patrol'}
                    className="w-5 h-5 rounded-md object-cover border border-sky-500/40 shrink-0 shadow-sm"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-sm shrink-0">
                    {isOwner ? '👑' : isParent ? '👨‍👩‍👧' : isExecutive ? '⚜️' : isLeader ? '🛡️' : '👥'}
                  </span>
                )}
                <span className="font-bold truncate text-slate-200">
                  {isOwner 
                    ? '👑 Supreme Troop Administration' 
                    : userGroupName 
                    ? `${userGroupName} Patrol` 
                    : (isParent ? 'Dhulfiqār Family Guardian' : isExecutive ? 'Dhulfiqār Troop HQ' : isLeader ? 'Dhulfiqār Leadership' : 'Dhulfiqār Scouts')}
                </span>
              </div>

              {/* Prominent Live Digital Clock & Date */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono font-black text-sm tracking-wider px-3 py-1.5 rounded-xl border shadow-sm text-sky-300 bg-slate-950/80 border-sky-500/30">
                  <Clock size={15} className="animate-pulse shrink-0 text-sky-400" />
                  <span>{formattedTime}</span>
                </div>
                <div className="text-xs text-slate-300 font-bold font-mono px-2.5 py-1.5 bg-slate-850 rounded-xl border border-slate-750 shrink-0 shadow-sm">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Dynamic Navigation / Sub-Menu Area */}
            {renderNavigationArea(true)}

            {/* Customization & Logout Footer */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/95 space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCustomizeNavOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-sky-300 hover:text-sky-200 text-xs font-bold py-2.5 rounded-xl border border-slate-800 hover:border-sky-500/40 transition cursor-pointer min-h-[44px]"
              >
                <Sliders size={14} className="text-sky-400" />
                <span>Customize Navigation & Quick Bar</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer min-h-[44px]"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP PERMANENT SIDEBAR NAVIGATION ── */}
      <aside className={`hidden md:flex md:flex-col md:w-64 lg:w-72 bg-slate-900/95 border-r shrink-0 h-full max-h-screen select-none print-hide ${
        isOwner ? 'border-amber-500/40' : 'border-slate-800/80'
      }`}>
        {/* Brand Header */}
        <div className={`p-5 border-b flex items-center gap-3 ${
          isOwner ? 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-transparent' : 'border-slate-800/90'
        }`}>
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-500/70 shadow-lg shadow-amber-950/50 bg-black shrink-0 flex items-center justify-center p-0.5">
            <img 
              src="/app-logo.jpg" 
              alt="Dhulfiqār Scouts" 
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <span className="truncate">Dhulfiqār Scouts</span>
              <span className={`text-[9px] border px-2 py-0.2 rounded-full font-bold uppercase shrink-0 ${
                isOwner 
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                  : 'bg-slate-850 text-slate-300 border-slate-700'
              }`}>
                {isOwner ? '👑 Owner' : 'v3.0'}
              </span>
            </h1>
            <p className="text-[11px] font-semibold truncate mt-0.5 text-sky-400">
              {isOwner ? '👑 Supreme Admin Console' : isLeader || isExecutive ? '⚜️ Taliʿa Leadership Portal' : 'Taliʿa Scouting Portal'}
            </p>
          </div>
        </div>

        {/* User Profile Mini-Card */}
        <div className={`p-4 mx-3 my-3 rounded-2xl border shadow-lg space-y-3 transition ${
          currentTab === 'profile'
            ? 'bg-slate-900/95 border-sky-400/60 shadow-sky-950/30 ring-1 ring-sky-400/30'
            : 'bg-slate-900/90 border-slate-800/80'
        }`}>
          {/* Distinctive Authority Banner for Owner vs Leader */}
          {isOwner ? (
            <div className="bg-sky-500/15 border border-sky-500/40 rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] font-black text-sky-300 uppercase tracking-wider shadow-sm">
              <span className="flex items-center gap-1.5">
                <Crown size={12} className="text-sky-400" />
                <span>Superadmin Active</span>
              </span>
              <span className="bg-sky-400 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-black">
                OWNER
              </span>
            </div>
          ) : isLeader || isExecutive ? (
            <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] font-black text-sky-300 uppercase tracking-wider shadow-sm">
              <span className="flex items-center gap-1.5">
                <Shield size={12} className="text-sky-400" />
                <span>Leadership Hub</span>
              </span>
              <span className="bg-sky-500 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-black">
                LEADER
              </span>
            </div>
          ) : null}

          {/* User Row: Avatar + Name + Role (Interactive / Clickable) */}
          <div 
            onClick={() => handleTabClick('profile')}
            className="flex items-center gap-3 p-1.5 -m-1.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition group/user"
            title="Click to view & edit your profile"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-md overflow-hidden relative group-hover/user:scale-105 transition border-2 border-sky-500/40 bg-gradient-to-br from-sky-500/20 to-slate-800 text-sky-300 shadow-sky-950/40">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={currentUser.fullName || currentUser.username || 'User Avatar'}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : isOwner ? (
                <Crown size={22} className="text-sky-300" />
              ) : isLeader || isExecutive ? (
                <Shield size={22} className="text-sky-300" />
              ) : isParent ? (
                <Users size={22} className="text-sky-300" />
              ) : (
                <Compass size={22} className="text-sky-300" />
              )}
              {/* Active Online / Role Indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full shadow-sm bg-sky-400 ring-1 ring-sky-300" title="Active Role Indicator"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-sm font-black text-white truncate leading-tight group-hover/user:text-sky-300 transition">
                  {currentUser.fullName || currentUser.username}
                </h4>
                <ChevronRight size={13} className="text-slate-500 group-hover/user:text-sky-400 shrink-0 transition" />
              </div>
              <p className="text-[11px] font-bold capitalize truncate mt-0.5 text-sky-400">{roleLabel}</p>
            </div>
          </div>

          {/* Dedicated View / Edit Profile Button */}
          <button
            type="button"
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm ${
              currentTab === 'profile'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-sky-950/40'
                : 'bg-slate-950/80 hover:bg-sky-500/15 text-sky-300 hover:text-white border-sky-500/30 hover:border-sky-400'
            }`}
          >
            <User size={13} className={currentTab === 'profile' ? 'text-slate-950' : 'text-sky-400'} />
            <span>{currentTab === 'profile' ? 'Viewing Profile' : 'View / Edit Profile'}</span>
          </button>

          {/* Patrol Unit / Group Badge with Icon */}
          <div className="text-xs px-3 py-2 rounded-xl border flex items-center gap-2.5 shadow-inner bg-slate-950/90 text-sky-300 border-slate-800/90">
            {userGroup?.photoURL ? (
              <img
                src={userGroup.photoURL}
                alt={userGroupName || 'Patrol'}
                className="w-5 h-5 rounded-md object-cover border border-sky-500/40 shrink-0 shadow-sm"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <span className="text-sm shrink-0">
                {isOwner ? '👑' : isParent ? '👨‍👩‍👧' : isExecutive ? '⚜️' : isLeader ? '🛡️' : '👥'}
              </span>
            )}
            <span className="font-bold truncate text-slate-200">
              {isOwner 
                ? '👑 Supreme Troop Admin' 
                : userGroupName 
                ? `${userGroupName} Patrol` 
                : (isParent ? 'Dhulfiqār Family Guardian' : isExecutive ? 'Dhulfiqār Troop HQ' : isLeader ? 'Dhulfiqār Leadership' : 'Dhulfiqār Scouts')}
            </span>
          </div>

          {/* Prominent Live Digital Clock & Date */}
          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-mono font-black text-sm tracking-wider px-3 py-1.5 rounded-xl border shadow-sm text-sky-300 bg-slate-950/80 border-sky-500/30">
              <Clock size={15} className="animate-pulse shrink-0 text-sky-400" />
              <span>{formattedTime}</span>
            </div>
            <div className="text-xs text-slate-300 font-bold font-mono px-2.5 py-1.5 bg-slate-850 rounded-xl border border-slate-750 shrink-0 shadow-sm">
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Dynamic Navigation / Sub-Menu Area */}
        {renderNavigationArea(false)}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/95 space-y-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setCustomizeNavOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 text-xs font-bold py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <Sliders size={13} className="text-sky-400" />
            <span>Customize Tabs</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-600/80 hover:text-white text-slate-300 text-xs font-bold py-2 rounded-xl border border-slate-800 transition cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE (FITS ALL SCREEN SIZES) ── */}
      <main className="main-content-area p-3.5 sm:p-5 lg:p-6 pb-20 md:pb-6">
        <ErrorBoundary onReset={() => setCurrentTab('home')}>
          {/* ── 1. HOME DASHBOARDS ── */}
          {(!currentTab || currentTab === 'home') && isLeaderOrOwner && (
            <LeaderHome 
              currentUser={currentUser} 
              onNavigate={handleNavigate} 
            />
          )}
          
          {(!currentTab || currentTab === 'home') && isParent && (
            <ParentDashboard 
              currentUser={currentUser} 
              initialTab="overview"
              onNavigate={handleNavigate} 
            />
          )}

          {(!currentTab || currentTab === 'home') && !isLeaderOrOwner && !isParent && (
            <StudentHome 
              currentUser={currentUser} 
              unreadChatCount={unreadChatCount} 
              onNavigate={handleNavigate} 
            />
          )}

        {/* ── 2. SCOUTS & PATROLS HUB (LEADER / OWNER) ── */}
        {currentTab === 'scouts-hub' && (isLeaderOrOwner || isExecutive) && (
          <HubSubNav
            hubTitle="Scouts & Patrols Hub"
            hubSubtitle="Manage patrol rosters, record session roll call, sign off rank advancements, and generate reports."
            colorTheme="emerald"
            activeTab={scoutsHubSubTab}
            onChange={(tabId) => setScoutsHubSubTab(tabId)}
            tabs={[
              { id: 'roster', label: 'Patrol Roster', icon: 'Users', description: 'Active scouts & member profiles' },
              { id: 'attendance', label: 'Attendance & Roll Call', icon: 'CheckSquare', description: 'Session check-in & logs' },
              { id: 'advancement', label: 'Advancement & Sign-Offs', icon: 'Award', description: 'Rank requirements & approvals' },
              { id: 'assignments', label: 'Weekly Homework', icon: 'BookOpen', badge: unreadHomeworkCount, description: 'Assign, Grade & Review Scout Homework' },
              { id: 'reports', label: 'Reports & Audits', icon: 'FileText', description: 'Official PDF reports & records' }
            ]}
          >
            {scoutsHubSubTab === 'roster' && <PatrolRoster currentUser={currentUser} />}
            {scoutsHubSubTab === 'attendance' && <PatrolAttendance currentUser={currentUser} initialData={attendanceInitialData} />}
            {scoutsHubSubTab === 'advancement' && <ScoutList currentUser={currentUser} />}
            {scoutsHubSubTab === 'assignments' && <AssignmentsManager currentUser={currentUser} />}
            {scoutsHubSubTab === 'reports' && <LeaderReportsCenter currentUser={currentUser} onNavigate={handleNavigate} />}
          </HubSubNav>
        )}

        {/* ── 3. COMMUNICATIONS HUB (LEADER / OWNER) ── */}
        {currentTab === 'communication-hub' && (isLeaderOrOwner || isExecutive) && (
          <HubSubNav
            hubTitle="Communications Hub"
            hubSubtitle="Direct parent messaging, whole-troop broadcasts, patrol channels, and conference approvals."
            colorTheme="indigo"
            activeTab={commHubSubTab}
            onChange={(tabId) => setCommHubSubTab(tabId)}
            tabs={[
              { id: 'direct-messages', label: 'Parent Inquiries & DMs', icon: 'MessageSquare', badge: unreadDirectMessagesCount, description: '1-on-1 private messaging' },
              { id: 'broadcasts', label: 'Troop Broadcasts', icon: 'Megaphone', description: 'Announcements & SMS/Email' },
              { id: 'chat', label: 'Patrol Messenger', icon: 'Radio', badge: unreadChatCount, description: 'Encrypted patrol discussions' },
              { id: 'parent-requests', label: 'Parent Approvals', icon: 'Inbox', badge: unreadRequestsCount, description: 'Conference & signup reviews' }
            ]}
          >
            {commHubSubTab === 'direct-messages' && <LeaderMessagingHub currentUser={currentUser} onNavigate={handleNavigate} />}
            {commHubSubTab === 'broadcasts' && <LeaderBroadcastCenter currentUser={currentUser} onNavigate={handleNavigate} />}
            {commHubSubTab === 'chat' && <PatrolChat currentUser={currentUser} onMarkRead={() => setUnreadChatCount(0)} />}
            {commHubSubTab === 'parent-requests' && (
              <LeaderParentRequests 
                currentUser={currentUser} 
                onNavigate={handleNavigate} 
                initialRequestId={adminExtraData?.requestId} 
                autoOpenConfirm={adminExtraData?.confirmMeeting} 
                initialFilterTab={adminExtraData?.filterTab || 'pending'} 
              />
            )}
          </HubSubNav>
        )}

        {/* ── 4. COMMUNICATIONS HUB (PARENT) ── */}
        {currentTab === 'communication-hub' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="messages"
            onNavigate={handleNavigate} 
          />
        )}

        {/* ── 5. ADMIN & SETTINGS HUB (LEADER / OWNER) ── */}
        {(currentTab === 'admin-hub' || currentTab === 'admin') && (isLeaderOrOwner || isExecutive) && (
          <AdminPanel 
            currentUser={currentUser} 
            initialTab={adminInitialTab} 
            extraData={adminExtraData} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* ── 6. ADVANCEMENT HUB ── */}
        {currentTab === 'advancement-hub' && !isParent && (
          <HubSubNav
            hubTitle="My Scouting Advancement"
            hubSubtitle="Track your journey from Scout to Eagle, merit badges, scouting handbooks, demonstration videos, and leadership role guides."
            colorTheme="emerald"
            activeTab={advancementHubSubTab}
            onChange={(tabId) => setAdvancementHubSubTab(tabId)}
            tabs={[
              { id: 'advancement', label: '7 Ranks Progress', icon: 'Compass', description: 'Scout through Eagle' },
              { id: 'merit-badges', label: 'Merit Badges & Eagle', icon: 'Star', description: 'Required & elective badges' },
              { id: 'road-to-eagle', label: 'Road to Eagle Guide', icon: 'Mountain', description: 'Step-by-step pathway' },
              { id: 'handbooks', label: 'Scouting Handbooks & Forms', icon: 'Book', description: 'Official guides & references' },
              { id: 'videos', label: 'Video Demonstrations & SPT', icon: 'Video', description: 'Skills & safety training' },
              { id: 'leadership', label: 'Leadership Roles Guide', icon: 'Crown', description: 'Position expectations' }
            ]}
          >
            {advancementHubSubTab === 'advancement' && <AdvancementTracker currentUser={currentUser} onNavigate={handleNavigate} />}
            {advancementHubSubTab === 'merit-badges' && <MeritBadgeDashboard currentUser={currentUser} onNavigate={handleNavigate} />}
            {advancementHubSubTab === 'road-to-eagle' && <RoadToEagleGuide currentUser={currentUser} onNavigate={handleNavigate} />}
            {advancementHubSubTab === 'handbooks' && <VideoResources currentUser={currentUser} initialTab="handbooks" />}
            {advancementHubSubTab === 'videos' && <VideoResources currentUser={currentUser} initialTab="videos" />}
            {advancementHubSubTab === 'leadership' && <RoleAndLeadershipGuide currentUser={currentUser} />}
          </HubSubNav>
        )}
        {currentTab === 'advancement-hub' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="advancement"
            onNavigate={handleNavigate} 
          />
        )}

        {/* ── 7. KNOWLEDGE HUB (ALL ROLES) ── */}
        {(currentTab === 'knowledge-hub' || currentTab === 'knowledge') && (
          <HubSubNav
            hubTitle="Islamic Tarbiyah & Knowledge"
            hubSubtitle="Essential scouting duas, Islamic character development, halqa resources, and spiritual tarbiyah."
            colorTheme="emerald"
            activeTab={knowledgeHubSubTab}
            onChange={(tabId) => setKnowledgeHubSubTab(tabId)}
            tabs={[
              { id: 'islamic', label: 'Islamic Tarbiyah & Duas', icon: 'Sparkles', description: 'Duas, halqas & character' }
            ]}
          >
            {knowledgeHubSubTab === 'islamic' && <IslamicBasics currentUser={currentUser} />}
          </HubSubNav>
        )}

        {/* ── 8. PATROL HUB (SCOUTS & LEADERS) ── */}
        {(currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && !isParent && (
          <HubSubNav
            hubTitle="Patrol Hub"
            hubSubtitle="Real-time encrypted patrol messenger, team coordination, meeting huddles, and halqas."
            colorTheme="indigo"
            activeTab={tarbiyahHubSubTab}
            onChange={(tabId) => setTarbiyahHubSubTab(tabId)}
            tabs={[
              { id: 'chat', label: 'Patrol Live Messenger', icon: 'MessageSquare', badge: unreadChatCount, description: 'Real-time patrol channel' },
              { id: 'meetings', label: 'Patrol Meeting & Google Meet', icon: 'Video', description: 'Huddle agendas & links' }
            ]}
          >
            {tarbiyahHubSubTab === 'chat' && <PatrolChat currentUser={currentUser} onMarkRead={() => setUnreadChatCount(0)} />}
            {tarbiyahHubSubTab === 'meetings' && <PatrolMeetingView currentUser={currentUser} onNavigate={handleNavigate} />}
          </HubSubNav>
        )}
        {(currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="resources"
            onNavigate={handleNavigate} 
          />
        )}

        {/* ── 9. SCHEDULE & TASKS HUB (LEGACY COMPATIBILITY) ── */}
        {currentTab === 'events-hub' && !isParent && (
          <HubSubNav
            hubTitle="Schedule & Weekly Tasks"
            hubSubtitle="Upcoming troop meetings, campouts, packing checklists, and weekly skill challenges."
            colorTheme="sky"
            activeTab={eventsHubSubTab}
            onChange={(tabId) => setEventsHubSubTab(tabId)}
            tabs={[
              { id: 'events', label: 'Troop Calendar & RSVPs', icon: 'Calendar', description: 'Meetings, campouts & trips' },
              { id: 'assignments', label: 'Homework & Challenges', icon: 'BookOpen', badge: unreadHomeworkCount, description: 'Weekly tasks & submissions' }
            ]}
          >
            {eventsHubSubTab === 'events' && <EventsManager currentUser={currentUser} onNavigate={handleNavigate} />}
            {eventsHubSubTab === 'assignments' && <AssignmentsManager currentUser={currentUser} />}
          </HubSubNav>
        )}
        {currentTab === 'events-hub' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="events"
            onNavigate={handleNavigate} 
          />
        )}

        {(currentTab === 'admin' || currentTab === 'global-admin' || currentTab === 'parent-requests' || currentTab === 'admin-requests') && (isLeaderOrOwner || isExecutive) && (
          <AdminPanel 
            currentUser={currentUser} 
            initialTab={adminInitialTab} 
            extraData={adminExtraData} 
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'group-manager' && isOwner && <GroupManager currentUser={currentUser} />}
        {currentTab === 'roster' && isLeaderOrOwner && <PatrolRoster currentUser={currentUser} />}
        {currentTab === 'scouts' && isLeaderOrOwner && <ScoutList currentUser={currentUser} />}
        {currentTab === 'advancement' && !isParent && <AdvancementTracker currentUser={currentUser} onNavigate={handleNavigate} />}
        {currentTab === 'advancement' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="advancement"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'merit-badges' && !isParent && <MeritBadgeDashboard currentUser={currentUser} onNavigate={handleNavigate} />}
        {currentTab === 'merit-badges' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="advancement"
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'road-to-eagle' || currentTab === 'eagle') && !isParent && (
          <RoadToEagleGuide currentUser={currentUser} onNavigate={handleNavigate} />
        )}
        {(currentTab === 'road-to-eagle' || currentTab === 'eagle') && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="eagle"
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'assignments' || currentTab === 'homework') && !isParent && <AssignmentsManager currentUser={currentUser} />}
        {(currentTab === 'assignments' || currentTab === 'homework') && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="homework"
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'tasks' || currentTab === 'forms') && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="tasks"
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'tasks' || currentTab === 'forms') && !isParent && (isLeaderOrOwner || isExecutive) && (
          <AdminPanel 
            currentUser={currentUser} 
            initialTab="forms" 
            extraData={adminExtraData} 
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'events' || currentTab === 'schedule' || currentTab === 'calendar') && !isParent && <EventsManager currentUser={currentUser} onNavigate={handleNavigate} />}
        {(currentTab === 'events' || currentTab === 'schedule' || currentTab === 'calendar') && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="events"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'lesson-plans' && isLeaderOrOwner && <LessonPlans currentUser={currentUser} />}
        {currentTab === 'islamic' && <IslamicBasics currentUser={currentUser} />}
        {currentTab === 'service-log' && <ServiceLogs currentUser={currentUser} />}
        {currentTab === 'resources' && !isParent && <VideoResources currentUser={currentUser} />}
        {currentTab === 'resources' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="resources"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'profile' && !isParent && (
          <ScoutProfile 
            currentUser={currentUser} 
            initialTab={profileInitialTab} 
            activeTab={profileSubTab}
            onTabChange={setProfileSubTab}
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'profile' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="family"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} onMarkRead={() => setUnreadChatCount(0)} />}
        {currentTab === 'reports' && isLeaderOrOwner && <LeaderReportsCenter currentUser={currentUser} onNavigate={handleNavigate} />}
        {currentTab === 'reports' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="reports"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'reports' && isScout && (
          <ScoutProfile 
            currentUser={currentUser} 
            initialTab="reports" 
            activeTab={profileSubTab}
            onTabChange={setProfileSubTab}
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'attendance' && isLeaderOrOwner && <PatrolAttendance currentUser={currentUser} initialData={attendanceInitialData} />}
        {currentTab === 'attendance' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="attendance"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'attendance' && isScout && (
          <ScoutAttendance currentUser={currentUser} />
        )}
        {(currentTab === 'journal' || currentTab === 'notes' || currentTab === 'field-notes') && <ScoutJournalNotes currentUser={currentUser} />}
        {currentTab === 'direct-messages' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="messages"
            onNavigate={handleNavigate} 
          />
        )}
        {currentTab === 'direct-messages' && isLeaderOrOwner && (
          <LeaderMessagingHub 
            currentUser={currentUser} 
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'broadcasts' || currentTab === 'troop-broadcasts' || currentTab === 'broadcast') && (isLeaderOrOwner || isExecutive) && (
          <AdminPanel 
            currentUser={currentUser} 
            initialTab="broadcasts" 
            extraData={adminExtraData} 
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'feed' || currentTab === 'alerts') && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            initialTab="feed" 
            onNavigate={handleNavigate} 
          />
        )}
        {(currentTab === 'feed' || currentTab === 'alerts') && isScout && (
          <ScoutAlertsFeed currentUser={currentUser} onNavigate={handleNavigate} />
        )}
        {(currentTab === 'counselors' || currentTab === 'counselor-directory') && (
          <ScoutProfile 
            currentUser={currentUser} 
            initialTab="counselors" 
            activeTab={profileSubTab}
            onTabChange={setProfileSubTab}
            onNavigate={handleNavigate} 
          />
        )}
        </ErrorBoundary>
      </main>

      {/* ── CONTEXT-AWARE ROLE-SPECIFIC MOBILE BOTTOM TAB BAR ── */}
      <MobileTabBar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenMenu={() => setMobileMenuOpen(true)}
        userRoleContext={userRoleContext}
        customPreferences={navState}
        unreadAlertsCount={unreadAlertsCount}
        unreadRequestsCount={unreadRequestsCount}
        unreadChatCount={unreadChatCount}
        unreadDirectMessagesCount={unreadDirectMessagesCount}
        unreadHomeworkCount={unreadHomeworkCount}
      />

      {/* ── MOBILE & DESKTOP TAB CUSTOMIZATION DRAWER/MODAL ── */}
      <MobileTabManager
        isOpen={customizeNavOpen}
        onClose={() => setCustomizeNavOpen(false)}
        navState={navState}
        onSave={handleSaveNavPreferences}
        onReset={handleResetNavPreferences}
        currentUser={currentUser}
        userRoleContext={userRoleContext}
      />
    </div>
  );
}
