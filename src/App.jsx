import React, { useState, useEffect } from 'react';
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
import { doc, setDoc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
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
  Megaphone
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customizeNavOpen, setCustomizeNavOpen] = useState(false);
  const [navState, setNavState] = useState(null);

  // Live ticking clock for header and sidebar navigation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Real-time Firebase Auth & User Profile Listener
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        
        // Listen to Firestore profile document in real-time
        const unsubscribeProfile = onSnapshot(userRef, (snap) => {
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

        return () => unsubscribeProfile();
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
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

  // 2. Proactively sync Owner (neoissa@gmail.com) and Hissa/Hassan leadership credentials on load
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
      const updates = {
        scoutingLeadership: HASSAN_LEADERSHIP_PROFILE.leadershipPositions,
        scoutingTrainings: HASSAN_LEADERSHIP_PROFILE.trainings,
        meritBadgeCounselorSubjects: HASSAN_LEADERSHIP_PROFILE.meritBadgeCounselorSubjects,
        credentialsValidThrough: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
        credentialsValidFormatted: HASSAN_LEADERSHIP_PROFILE.validityFormatted,
        bsaCouncil: HASSAN_LEADERSHIP_PROFILE.bsaCouncil,
        certifyingOrg: HASSAN_LEADERSHIP_PROFILE.certifyingOrg,
        yptCompleted: true
      };

      if (!currentUser.spt) {
        updates.spt = HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough;
        updates.sptDate = HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough;
      }

      if (isNeo) {
        updates.role = 'owner';
        updates.isOwner = true;
        updates.email = 'neoissa@gmail.com';
      }

      setDoc(userRef, updates, { merge: true })
        .then(() => console.log("Leadership credentials synced successfully."))
        .catch(err => console.error("Leadership credentials sync failed:", err));
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

  // Real-time unread notifications listener (Scouts & Leaders)
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
  }, [currentUser?.uid, currentUser?.role, currentUser?.email, isLeader, isOwner, isExecutive]);

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

  // 4. Automatically set default tab when user logs in or role changes
  useEffect(() => {
    if (currentUser) {
      if (!currentTab) {
        setCurrentTab('home');
      }
    } else {
      setCurrentTab('');
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

  const [attendanceInitialData, setAttendanceInitialData] = useState(null);
  const [profileInitialTab, setProfileInitialTab] = useState('personal');
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

  const handleNavigate = (tab, extraData = null) => {
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
    if (tab === 'admin-hub') {
      if (extraData?.subTab) {
        setAdminHubSubTab(extraData.subTab);
      }
      if (extraData?.tab) {
        setAdminInitialTab(extraData.tab);
        setAdminExtraData(extraData);
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
    if (tab === 'admin' || tab === 'global-admin') {
      if (extraData?.tab) {
        setAdminInitialTab(extraData.tab);
        setAdminExtraData(extraData);
      } else {
        setAdminInitialTab('users');
        setAdminExtraData(null);
      }
      setCurrentTab('admin-hub');
      setAdminHubSubTab('admin');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'lesson-plans') {
      setCurrentTab('admin-hub');
      setAdminHubSubTab('lesson-plans');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'profile') {
      if (extraData) {
        if (typeof extraData === 'string') {
          setProfileInitialTab(extraData);
        } else if (extraData.tab) {
          setProfileInitialTab(extraData.tab);
        }
      } else {
        setProfileInitialTab('personal');
      }
      setCurrentTab('profile');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'counselors' || tab === 'counselor-directory') {
      setCurrentTab('profile');
      setProfileInitialTab('counselors');
      setMobileMenuOpen(false);
      return;
    }
    if (tab === 'service-log') {
      setCurrentTab('profile');
      setProfileInitialTab('service');
      setMobileMenuOpen(false);
      return;
    }

    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
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
      if (tab.id === 'communication-hub' || tab.id === 'comm-hub') badge = unreadDirectMessagesCount + unreadAlertsCount + unreadRequestsCount;
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
        if (foundTab.id === 'communication-hub' || foundTab.id === 'comm-hub') badge = unreadDirectMessagesCount + unreadAlertsCount + unreadRequestsCount;
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

  const handleBottomNavClick = (itemId) => {
    if (itemId === '__more__') {
      setMobileMenuOpen(true);
    } else {
      handleTabClick(itemId);
    }
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
      <header className={`md:hidden bg-slate-900/90 backdrop-blur-md border-b px-3.5 py-2.5 sticky top-0 z-40 flex items-center justify-between gap-2.5 print-hide ${
        isOwner ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900' : 'border-slate-800/80'
      }`}>
        <div 
          onClick={() => handleTabClick('profile')}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1"
          title="Open My Profile"
        >
          <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md overflow-hidden shrink-0 group-hover:scale-105 transition border-2 ${
            isOwner 
              ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-amber-400 text-amber-300 shadow-amber-950/40' 
              : isLeader || isExecutive
              ? 'bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-emerald-400 text-emerald-300 shadow-emerald-950/40'
              : isParent
              ? 'bg-gradient-to-br from-indigo-600/30 to-purple-700/20 border-indigo-400 text-indigo-300 shadow-indigo-950/40'
              : 'bg-gradient-to-br from-teal-600/30 to-emerald-700/20 border-teal-400 text-teal-300 shadow-teal-950/40'
          }`}>
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={currentUser.fullName || currentUser.username}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : isOwner ? (
              <Crown size={18} className="text-amber-300" />
            ) : isLeader || isExecutive ? (
              <Shield size={18} className="text-emerald-300" />
            ) : isParent ? (
              <Users size={18} className="text-indigo-300" />
            ) : (
              <Compass size={18} className="text-teal-300" />
            )}
            {/* Small Role Badge in Corner */}
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-slate-950 shadow-sm flex items-center justify-center ${
              isOwner ? 'bg-amber-400' : isLeader || isExecutive ? 'bg-emerald-400' : isParent ? 'bg-indigo-400' : 'bg-teal-400'
            }`} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs sm:text-sm font-black text-white leading-tight flex items-center gap-1.5 min-w-0">
              <span className="truncate group-hover:text-emerald-300 transition">Dhulfiqār Scouts</span>
              {isOwner ? (
                <span className="text-[8px] sm:text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-black uppercase shrink-0">
                  👑 OWNER
                </span>
              ) : isLeader || isExecutive ? (
                <span className="text-[8px] sm:text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-black uppercase shrink-0">
                  ⚜️ LEADER
                </span>
              ) : null}
            </h1>
            <span className={`text-[10px] sm:text-[11px] font-semibold truncate block ${isOwner ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentUser.fullName || currentUser.username} • {userGroupName ? `${userGroupName} Patrol` : roleLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className={`hidden sm:flex items-center gap-1 font-mono font-bold text-xs px-2 py-1 rounded-lg border shrink-0 ${
            isOwner 
              ? 'text-amber-300 bg-amber-950/50 border-amber-500/40' 
              : 'text-emerald-400 bg-slate-900 border-slate-800'
          }`}>
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
                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-500/70 shadow-lg shadow-amber-950/50 bg-slate-900 shrink-0 flex items-center justify-center p-0.5">
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
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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
                ? 'bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/30' 
                : 'bg-slate-900/90 border-slate-800/80'
            }`}>
              {/* Authority Badge */}
              {isOwner ? (
                <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                  <Crown size={12} className="text-amber-400" />
                  <span>👑 Troop Owner & Superadmin</span>
                </div>
              ) : isLeader || isExecutive ? (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">
                  <Shield size={12} className="text-emerald-400" />
                  <span>⚜️ Troop Leadership Console</span>
                </div>
              ) : null}

              <div 
                onClick={() => handleTabClick('profile')}
                className="flex items-center gap-3 p-1.5 -m-1.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition group"
                title="Open My Profile"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-md overflow-hidden relative group-hover:scale-105 transition border-2 ${
                  isOwner 
                    ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-amber-400 text-amber-300 shadow-amber-950/50' 
                    : isLeader || isExecutive
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-emerald-400 text-emerald-300 shadow-emerald-950/40'
                    : isParent
                    ? 'bg-gradient-to-br from-indigo-600/30 to-purple-700/20 border-indigo-400 text-indigo-300 shadow-indigo-950/40'
                    : 'bg-gradient-to-br from-teal-600/30 to-emerald-700/20 border-teal-400 text-teal-300 shadow-teal-950/40'
                }`}>
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={currentUser.fullName || currentUser.username}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : isOwner ? (
                    <Crown size={22} className="text-amber-300" />
                  ) : isLeader || isExecutive ? (
                    <Shield size={22} className="text-emerald-300" />
                  ) : isParent ? (
                    <Users size={22} className="text-indigo-300" />
                  ) : (
                    <Compass size={22} className="text-teal-300" />
                  )}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full shadow-sm ${
                    isOwner ? 'bg-amber-400' : isLeader || isExecutive ? 'bg-emerald-400' : isParent ? 'bg-indigo-400' : 'bg-teal-400'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-black text-white truncate leading-tight group-hover:text-emerald-300 transition">
                      {currentUser.fullName || currentUser.username}
                    </h4>
                    <ChevronRight size={13} className="text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
                  </div>
                  <p className={`text-[11px] font-semibold capitalize truncate mt-0.5 ${
                    isOwner ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{roleLabel}</p>
                </div>
              </div>

              {/* View / Edit Profile Button */}
              <button
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm ${
                  currentTab === 'profile'
                    ? isOwner 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
                      : 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                    : isOwner
                    ? 'bg-slate-900 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-slate-900 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <User size={13} className={currentTab === 'profile' ? 'text-slate-950' : isOwner ? 'text-amber-400' : 'text-emerald-400'} />
                <span>{currentTab === 'profile' ? 'Viewing Profile' : 'View / Edit Profile'}</span>
              </button>

              {/* Patrol / Organization Badge with Icon */}
              <div className={`text-xs px-3 py-2 rounded-xl border flex items-center gap-2.5 shadow-inner ${
                isOwner 
                  ? 'bg-slate-950/90 text-amber-300 border-amber-500/30' 
                  : 'bg-slate-950/90 text-emerald-300 border-slate-800/90'
              }`}>
                {userGroup?.photoURL ? (
                  <img
                    src={userGroup.photoURL}
                    alt={userGroupName || 'Patrol'}
                    className="w-5 h-5 rounded-md object-cover border border-emerald-500/40 shrink-0 shadow-sm"
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
                <div className={`flex items-center gap-1.5 font-mono font-black text-sm tracking-wider px-3 py-1.5 rounded-xl border shadow-sm ${
                  isOwner 
                    ? 'text-amber-300 bg-amber-950/50 border-amber-500/40' 
                    : 'text-emerald-400 bg-slate-950/80 border-slate-800/90'
                }`}>
                  <Clock size={15} className="animate-pulse shrink-0" />
                  <span>{formattedTime}</span>
                </div>
                <div className="text-xs text-slate-300 font-bold font-mono px-2.5 py-1.5 bg-slate-850 rounded-xl border border-slate-750 shrink-0 shadow-sm">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Nav Items List */}
            <nav className="flex-1 p-3 space-y-1">
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group min-h-[44px] ${
                      isActive
                        ? isOwner
                          ? 'bg-gradient-to-r from-amber-600/30 to-amber-700/20 text-white border-l-4 border-amber-400 font-extrabold shadow-sm'
                          : 'bg-gradient-to-r from-emerald-600/30 to-teal-650/20 text-white border-l-4 border-emerald-400 font-extrabold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 shadow-xs ${
                        isActive
                          ? `${itemTheme.activePill} ${itemTheme.glow}`
                          : `${itemTheme.pillBg} ${itemTheme.border}`
                      }`}>
                        <DynamicIcon 
                          name={item.icon} 
                          size={16} 
                          className={isActive ? itemTheme.activeIcon || itemTheme.icon : itemTheme.icon} 
                        />
                      </div>
                      <span className={`truncate text-xs ${
                        isActive 
                          ? (isOwner ? 'text-amber-300 font-black' : 'text-emerald-300 font-black') 
                          : 'font-semibold text-slate-300 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0 shadow-sm">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Customization & Logout Footer */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/95 space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCustomizeNavOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-emerald-300 hover:text-emerald-200 text-xs font-bold py-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer min-h-[44px]"
              >
                <Sliders size={14} className="text-emerald-400" />
                <span>Customize Navigation & Quick Bar</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/80 hover:text-white text-slate-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer min-h-[44px]"
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
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {isOwner ? '👑 Owner' : 'v3.0'}
              </span>
            </h1>
            <p className={`text-[11px] font-medium truncate mt-0.5 ${
              isOwner ? 'text-amber-300/80 font-bold' : isLeader || isExecutive ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}>
              {isOwner ? '👑 Supreme Admin Console' : isLeader || isExecutive ? '⚜️ Taliʿa Leadership Portal' : 'Taliʿa Scouting Portal'}
            </p>
          </div>
        </div>

        {/* User Profile Mini-Card */}
        <div className={`p-4 mx-3 my-3 rounded-2xl border shadow-lg space-y-3 transition ${
          currentTab === 'profile'
            ? isOwner 
              ? 'bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-900 border-amber-400/80 shadow-amber-950/40 ring-1 ring-amber-400/40' 
              : 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-400/80 shadow-emerald-950/40 ring-1 ring-emerald-400/40'
            : isOwner 
            ? 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/40 shadow-amber-950/30' 
            : isLeader || isExecutive 
            ? 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/40 shadow-emerald-950/20' 
            : 'bg-slate-900/90 border-slate-800/80'
        }`}>
          {/* Distinctive Authority Banner for Owner vs Leader */}
          {isOwner ? (
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] font-black text-amber-300 uppercase tracking-wider shadow-sm">
              <span className="flex items-center gap-1.5">
                <Crown size={12} className="text-amber-400 animate-pulse" />
                <span>Superadmin Active</span>
              </span>
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-black">
                OWNER
              </span>
            </div>
          ) : isLeader || isExecutive ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] font-black text-emerald-300 uppercase tracking-wider shadow-sm">
              <span className="flex items-center gap-1.5">
                <Shield size={12} className="text-emerald-400" />
                <span>Leadership Hub</span>
              </span>
              <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-black">
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
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-md overflow-hidden relative group-hover/user:scale-105 transition border-2 ${
              isOwner 
                ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/20 border-amber-400 text-amber-300 shadow-amber-950/50 ring-2 ring-amber-500/20' 
                : isLeader || isExecutive
                ? 'bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-emerald-500/60 text-emerald-300 shadow-emerald-950/40 ring-2 ring-emerald-500/20'
                : isParent
                ? 'bg-gradient-to-br from-indigo-600/30 to-purple-700/20 border-indigo-400 text-indigo-300 shadow-indigo-950/40'
                : 'bg-gradient-to-br from-teal-600/30 to-emerald-700/20 border-teal-400 text-teal-300 shadow-teal-950/40'
            }`}>
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={currentUser.fullName || currentUser.username || 'User Avatar'}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : isOwner ? (
                <Crown size={22} className="text-amber-300" />
              ) : isLeader || isExecutive ? (
                <Shield size={22} className="text-emerald-300" />
              ) : isParent ? (
                <Users size={22} className="text-indigo-300" />
              ) : (
                <Compass size={22} className="text-teal-300" />
              )}
              {/* Active Online / Role Indicator */}
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full shadow-sm ${
                isOwner ? 'bg-amber-400 ring-1 ring-amber-300' : isLeader || isExecutive ? 'bg-emerald-400 ring-1 ring-emerald-300' : isParent ? 'bg-indigo-400' : 'bg-teal-400 ring-1 ring-teal-300'
              }`} title="Active Role Indicator"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-sm font-black text-white truncate leading-tight group-hover/user:text-emerald-300 transition">
                  {currentUser.fullName || currentUser.username}
                </h4>
                <ChevronRight size={13} className="text-slate-500 group-hover/user:text-emerald-400 shrink-0 transition" />
              </div>
              <p className={`text-[11px] font-bold capitalize truncate mt-0.5 ${
                isOwner ? 'text-amber-300 font-black' : isLeader || isExecutive ? 'text-emerald-300 font-extrabold' : 'text-slate-400'
              }`}>{roleLabel}</p>
            </div>
          </div>

          {/* Dedicated View / Edit Profile Button */}
          <button
            type="button"
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm ${
              currentTab === 'profile'
                ? isOwner 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-amber-950/40' 
                  : 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-emerald-950/40'
                : isOwner
                ? 'bg-slate-950/80 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 hover:border-amber-400'
                : 'bg-slate-950/80 hover:bg-emerald-500/20 text-emerald-300 hover:text-white border-emerald-500/30 hover:border-emerald-400'
            }`}
          >
            <User size={13} className={currentTab === 'profile' ? 'text-slate-950' : isOwner ? 'text-amber-400' : 'text-emerald-400'} />
            <span>{currentTab === 'profile' ? 'Viewing Profile' : 'View / Edit Profile'}</span>
          </button>

          {/* Patrol Unit / Group Badge with Icon */}
          <div className={`text-xs px-3 py-2 rounded-xl border flex items-center gap-2.5 shadow-inner ${
            isOwner 
              ? 'bg-slate-950/90 text-amber-300 border-amber-500/40' 
              : isLeader || isExecutive
              ? 'bg-slate-950/90 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-950/90 text-slate-300 border-slate-800/90'
          }`}>
            {userGroup?.photoURL ? (
              <img
                src={userGroup.photoURL}
                alt={userGroupName || 'Patrol'}
                className="w-5 h-5 rounded-md object-cover border border-emerald-500/40 shrink-0 shadow-sm"
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
            <div className={`flex items-center gap-1.5 font-mono font-black text-sm tracking-wider px-3 py-1.5 rounded-xl border shadow-sm ${
              isOwner 
                ? 'text-amber-300 bg-amber-950/60 border-amber-500/50 shadow-amber-950/40' 
                : 'text-emerald-400 bg-slate-950/80 border-slate-800/90'
            }`}>
              <Clock size={15} className={`animate-pulse shrink-0 ${isOwner ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span>{formattedTime}</span>
            </div>
            <div className="text-xs text-slate-300 font-bold font-mono px-2.5 py-1.5 bg-slate-850 rounded-xl border border-slate-750 shrink-0 shadow-sm">
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group ${
                  isActive
                    ? isOwner
                      ? 'bg-gradient-to-r from-amber-600/25 to-amber-700/15 text-white border-l-4 border-amber-500 shadow-sm font-extrabold'
                      : 'bg-gradient-to-r from-emerald-600/25 to-teal-650/15 text-white border-l-4 border-emerald-500 shadow-sm font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
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
                      ? (isOwner ? 'text-amber-300 font-black' : 'text-emerald-300 font-black') 
                      : 'font-semibold text-slate-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {item.badge > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0 shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight size={13} className={isOwner ? 'text-amber-400 shrink-0' : 'text-emerald-400 shrink-0'} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/95 space-y-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setCustomizeNavOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 text-xs font-bold py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <Sliders size={13} className="text-emerald-400" />
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
        {/* ── 1. HOME DASHBOARDS ── */}
        {(!currentTab || currentTab === 'home') && isLeaderOrOwner && (
          <LeaderHome 
            currentUser={currentUser} 
            onNavigate={handleNavigate} 
          />
        )}
        
        {(!currentTab || currentTab === 'home') && isScout && (
          <StudentHome 
            currentUser={currentUser} 
            unreadChatCount={unreadChatCount} 
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

        {/* ── 2. SCOUTS & PATROLS HUB (LEADER / OWNER) ── */}
        {currentTab === 'scouts-hub' && (isLeaderOrOwner || isExecutive) && (
          <div className="space-y-4">
            <HubSubNav
              hubTitle="Scouts & Patrols Hub"
              hubSubtitle="Manage patrol rosters, record session roll call, sign off rank advancements, and generate reports."
              colorTheme="emerald"
              activeTab={scoutsHubSubTab}
              onChange={(tabId) => setScoutsHubSubTab(tabId)}
              tabs={[
                { id: 'roster', label: 'Patrol Roster', icon: 'Users' },
                { id: 'attendance', label: 'Attendance & Roll Call', icon: 'CheckSquare' },
                { id: 'advancement', label: 'Advancement & Sign-Offs', icon: 'Award' },
                { id: 'reports', label: 'Reports & Audits', icon: 'FileText' }
              ]}
            />
            {scoutsHubSubTab === 'roster' && <PatrolRoster currentUser={currentUser} />}
            {scoutsHubSubTab === 'attendance' && <PatrolAttendance currentUser={currentUser} initialData={attendanceInitialData} />}
            {scoutsHubSubTab === 'advancement' && <ScoutList currentUser={currentUser} />}
            {scoutsHubSubTab === 'reports' && <LeaderReportsCenter currentUser={currentUser} onNavigate={handleNavigate} />}
          </div>
        )}

        {/* ── 3. COMMUNICATIONS HUB (LEADER / OWNER) ── */}
        {currentTab === 'communication-hub' && (isLeaderOrOwner || isExecutive) && (
          <div className="space-y-4">
            <HubSubNav
              hubTitle="Communications Hub"
              hubSubtitle="Direct parent messaging, whole-troop broadcasts, patrol channels, and conference approvals."
              colorTheme="indigo"
              activeTab={commHubSubTab}
              onChange={(tabId) => setCommHubSubTab(tabId)}
              tabs={[
                { id: 'direct-messages', label: 'Parent Inquiries & DMs', icon: 'MessageSquare', badge: unreadDirectMessagesCount },
                { id: 'broadcasts', label: 'Troop Broadcasts', icon: 'Megaphone', badge: unreadAlertsCount },
                { id: 'chat', label: 'Patrol Messenger', icon: 'Radio', badge: unreadChatCount },
                { id: 'parent-requests', label: 'Parent Approvals', icon: 'Inbox', badge: unreadRequestsCount }
              ]}
            />
            {commHubSubTab === 'direct-messages' && <LeaderMessagingHub currentUser={currentUser} onNavigate={handleNavigate} />}
            {commHubSubTab === 'broadcasts' && <AdminPanel currentUser={currentUser} initialTab="broadcasts" onNavigate={handleNavigate} />}
            {commHubSubTab === 'chat' && <PatrolChat currentUser={currentUser} onMarkRead={() => setUnreadChatCount(0)} />}
            {commHubSubTab === 'parent-requests' && <AdminPanel currentUser={currentUser} initialTab="requests" extraData={adminExtraData} onNavigate={handleNavigate} />}
          </div>
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
        {currentTab === 'admin-hub' && (isLeaderOrOwner || isExecutive) && (
          <div className="space-y-4">
            <HubSubNav
              hubTitle={isOwner ? "👑 Troop Owner Administration" : "⚜️ Leadership Administration"}
              hubSubtitle="Manage system user credentials, security permissions, lesson curriculums, and safety training."
              colorTheme={isOwner ? "amber" : "purple"}
              activeTab={adminHubSubTab}
              onChange={(tabId) => setAdminHubSubTab(tabId)}
              tabs={[
                { id: 'admin', label: isOwner ? '👑 Superadmin Console' : '⚜️ Leader Administration', icon: isOwner ? 'Crown' : 'Shield' },
                { id: 'profile', label: 'My Profile & Safety Training (SPT)', icon: 'User' },
                { id: 'lesson-plans', label: 'Lesson Curriculum', icon: 'GraduationCap' }
              ]}
            />
            {adminHubSubTab === 'admin' && (
              <AdminPanel 
                currentUser={currentUser} 
                initialTab={adminInitialTab} 
                extraData={adminExtraData} 
                onNavigate={handleNavigate} 
              />
            )}
            {adminHubSubTab === 'profile' && (
              <ScoutProfile 
                currentUser={currentUser} 
                initialTab={profileInitialTab || 'personal'} 
                onNavigate={handleNavigate} 
              />
            )}
            {adminHubSubTab === 'lesson-plans' && (
              <LessonPlans currentUser={currentUser} />
            )}
          </div>
        )}

        {/* ── 6. ADVANCEMENT HUB ── */}
        {currentTab === 'advancement-hub' && !isParent && (
          <div className="space-y-4">
            <HubSubNav
              hubTitle="My Scouting Advancement"
              hubSubtitle="Track your journey from Scout to Eagle, merit badges, scouting handbooks, demonstration videos, and leadership role guides."
              colorTheme="emerald"
              activeTab={advancementHubSubTab}
              onChange={(tabId) => setAdvancementHubSubTab(tabId)}
              tabs={[
                { id: 'advancement', label: '7 Ranks Progress', icon: 'Compass' },
                { id: 'merit-badges', label: 'Merit Badges & Eagle', icon: 'Star' },
                { id: 'road-to-eagle', label: 'Road to Eagle Guide', icon: 'Mountain' },
                { id: 'handbooks', label: 'Scouting Handbooks & Forms', icon: 'Book' },
                { id: 'videos', label: 'Video Demonstrations & SPT', icon: 'Video' },
                { id: 'leadership', label: 'Leadership Roles Guide', icon: 'Crown' }
              ]}
            />
            {advancementHubSubTab === 'advancement' && <AdvancementTracker currentUser={currentUser} onNavigate={handleNavigate} />}
            {advancementHubSubTab === 'merit-badges' && <MeritBadgeDashboard currentUser={currentUser} onNavigate={handleNavigate} />}
            {advancementHubSubTab === 'road-to-eagle' && <RoadToEagleGuide currentUser={currentUser} onNavigate={handleNavigate} />}
            {advancementHubSubTab === 'handbooks' && <VideoResources currentUser={currentUser} initialTab="handbooks" />}
            {advancementHubSubTab === 'videos' && <VideoResources currentUser={currentUser} initialTab="videos" />}
            {advancementHubSubTab === 'leadership' && <RoleAndLeadershipGuide currentUser={currentUser} />}
          </div>
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
          <div className="space-y-4">
            <HubSubNav
              hubTitle="Islamic Tarbiyah & Knowledge"
              hubSubtitle="Essential scouting duas, Islamic character development, halqa resources, and spiritual tarbiyah."
              colorTheme="emerald"
              activeTab={knowledgeHubSubTab}
              onChange={(tabId) => setKnowledgeHubSubTab(tabId)}
              tabs={[
                { id: 'islamic', label: 'Islamic Tarbiyah & Duas', icon: 'Sparkles' }
              ]}
            />
            {knowledgeHubSubTab === 'islamic' && <IslamicBasics currentUser={currentUser} />}
          </div>
        )}

        {/* ── 8. PATROL HUB (SCOUTS & LEADERS) ── */}
        {(currentTab === 'tarbiyah-hub' || currentTab === 'patrol-hub') && !isParent && (
          <div className="space-y-4">
            <HubSubNav
              hubTitle="Patrol Hub"
              hubSubtitle="Real-time encrypted patrol messenger, team coordination, meeting huddles, and halqas."
              colorTheme="indigo"
              activeTab={tarbiyahHubSubTab}
              onChange={(tabId) => setTarbiyahHubSubTab(tabId)}
              tabs={[
                { id: 'chat', label: 'Patrol Live Messenger', icon: 'MessageSquare', badge: unreadChatCount },
                { id: 'meetings', label: 'Patrol Meeting & Google Meet', icon: 'Video' }
              ]}
            />
            {tarbiyahHubSubTab === 'chat' && <PatrolChat currentUser={currentUser} onMarkRead={() => setUnreadChatCount(0)} />}
            {tarbiyahHubSubTab === 'meetings' && <PatrolMeetingView currentUser={currentUser} onNavigate={handleNavigate} />}
          </div>
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
          <div className="space-y-4">
            <HubSubNav
              hubTitle="Schedule & Weekly Tasks"
              hubSubtitle="Upcoming troop meetings, campouts, packing checklists, and weekly skill challenges."
              colorTheme="sky"
              activeTab={eventsHubSubTab}
              onChange={(tabId) => setEventsHubSubTab(tabId)}
              tabs={[
                { id: 'events', label: 'Troop Calendar & RSVPs', icon: 'Calendar' },
                { id: 'assignments', label: 'Homework & Challenges', icon: 'BookOpen' }
              ]}
            />
            {eventsHubSubTab === 'events' && <EventsManager currentUser={currentUser} onNavigate={handleNavigate} />}
            {eventsHubSubTab === 'assignments' && <AssignmentsManager currentUser={currentUser} />}
          </div>
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
        {currentTab === 'profile' && !isParent && <ScoutProfile currentUser={currentUser} initialTab={profileInitialTab} onNavigate={handleNavigate} />}
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
          <ScoutProfile currentUser={currentUser} initialTab="reports" onNavigate={handleNavigate} />
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
          <ScoutProfile currentUser={currentUser} initialTab="counselors" onNavigate={handleNavigate} />
        )}
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
