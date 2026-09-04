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
import PatrolAttendance from './components/PatrolAttendance';
import ScoutJournalNotes from './components/ScoutJournalNotes';
import ParentDashboard from './components/ParentDashboard';
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
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [userGroupName, setUserGroupName] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const isScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Scoutmaster';
  const isAssistantScoutmaster = currentUser?.role === 'leader' && currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isExecutive = isOwner || currentUser?.role === 'admin' || isScoutmaster || isAssistantScoutmaster;
  const isLeader = !isExecutive && currentUser?.role === 'leader';
  const isParent = !isExecutive && !isLeader && currentUser?.role === 'parent';
  const isScout = !isExecutive && !isLeader && !isParent;

  // 2. Proactively promote neoissa@gmail.com to owner in the database on load
  useEffect(() => {
    if (currentUser && currentUser.email === 'neoissa@gmail.com' && currentUser.role !== 'owner') {
      const userRef = doc(db, 'users', currentUser.uid);
      setDoc(userRef, { role: 'owner', isOwner: true, email: 'neoissa@gmail.com' }, { merge: true })
        .then(() => console.log("Database owner promotion synced successfully."))
        .catch(err => console.error("Database promotion sync failed:", err));
    }
  }, [currentUser]);

  // Fetch the user's group/patrol name in real-time
  useEffect(() => {
    const targetGroupId = currentUser?.groupId || currentUser?.patrolId;
    if (targetGroupId) {
      const unsub = onSnapshot(doc(db, 'groups', targetGroupId), (snap) => {
        if (snap.exists()) {
          setUserGroupName(snap.data().name);
        } else {
          setUserGroupName('');
        }
      }, (err) => {
        console.warn("Failed to fetch user group name:", err);
        setUserGroupName('');
      });
      return () => unsub();
    } else {
      setUserGroupName('');
    }
  }, [currentUser?.groupId, currentUser?.patrolId]);

  // 3. Real-time Unread Chat Messages Listener
  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadChatCount(0);
      return;
    }

    const roomId = currentUser.groupId || currentUser.patrolId || currentUser.leaderId || 'general-stream';
    const lastReadStorageKey = `last_read_chat_${currentUser.uid}_${roomId}`;

    const q = query(
      collection(db, 'chats', roomId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(40)
    );

    const unsub = onSnapshot(q, (snap) => {
      const lastReadTimeStr = localStorage.getItem(lastReadStorageKey);
      const lastReadTime = lastReadTimeStr ? Number(lastReadTimeStr) : 0;

      if (currentTab === 'chat') {
        localStorage.setItem(lastReadStorageKey, Date.now().toString());
        setUnreadChatCount(0);
        return;
      }

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
  }, [currentUser?.uid, currentUser?.groupId, currentUser?.patrolId, currentTab]);

  // Reset unread count when switching to chat tab
  useEffect(() => {
    if (currentTab === 'chat' && currentUser?.uid) {
      const roomId = currentUser.groupId || currentUser.patrolId || currentUser.leaderId || 'general-stream';
      const lastReadStorageKey = `last_read_chat_${currentUser.uid}_${roomId}`;
      localStorage.setItem(lastReadStorageKey, Date.now().toString());
      setUnreadChatCount(0);
    }
  }, [currentTab, currentUser?.uid]);

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

  const handleNavigate = (tab, extraData = null) => {
    if (tab === 'attendance' && extraData) {
      setAttendanceInitialData(extraData);
    }
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
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

  // ── DEFINE NAVIGATION ITEMS BY ROLE ──
  const getNavItems = () => {
    if (isExecutive) {
      return [
        { id: 'home', label: 'Executive Hub', icon: '🏠' },
        { id: 'admin', label: 'Executive Admin Hub', icon: '⚡' },
        { id: 'roster', label: 'Patrol Roster', icon: '👥' },
        { id: 'attendance', label: 'Patrol Attendance', icon: '📋' },
        { id: 'scouts', label: 'Advancement Tracker', icon: '📊' },
        { id: 'reports', label: 'Reports Center', icon: '📈' },
        { id: 'assignments', label: 'Homework & Tasks', icon: '🎒' },
        { id: 'events', label: 'Planned Events', icon: '📅' },
        { id: 'lesson-plans', label: 'Lesson Plans', icon: '📋' },
        { id: 'journal', label: 'Scout Journal & Notes', icon: '📝' },
        { id: 'islamic', label: 'Islamic Knowledge', icon: '🕌' },
        { id: 'chat', label: 'Patrol Messenger', icon: '💬', badge: unreadChatCount },
        { id: 'resources', label: 'Resources & Guide', icon: '📚' },
        { id: 'profile', label: 'My Profile', icon: '👤' }
      ];
    } else if (isLeader) {
      return [
        { id: 'home', label: 'Leader Hub', icon: '🏠' },
        { id: 'roster', label: 'Patrol Roster', icon: '👥' },
        { id: 'attendance', label: 'Patrol Attendance', icon: '📋' },
        { id: 'scouts', label: 'Advancement Tracker', icon: '📊' },
        { id: 'reports', label: 'Reports Center', icon: '📈' },
        { id: 'assignments', label: 'Homework & Tasks', icon: '🎒' },
        { id: 'events', label: 'Planned Events', icon: '📅' },
        { id: 'lesson-plans', label: 'Lesson Plans', icon: '📋' },
        { id: 'journal', label: 'Scout Journal & Notes', icon: '📝' },
        { id: 'islamic', label: 'Islamic Knowledge', icon: '🕌' },
        { id: 'chat', label: 'Patrol Messenger', icon: '💬', badge: unreadChatCount },
        { id: 'resources', label: 'Resources & Guide', icon: '📚' },
        { id: 'profile', label: 'My Profile', icon: '👤' }
      ];
    } else if (isParent) {
      return [
        { id: 'home', label: 'Parent Portal', icon: '👨‍👩‍👧' },
        { id: 'events', label: 'Troop Calendar & Events', icon: '📅' },
        { id: 'resources', label: 'Safety & Guides', icon: '📚' },
        { id: 'profile', label: 'Family Profile', icon: '👤' }
      ];
    } else {
      // Scout Navigation
      return [
        { id: 'home', label: 'Home Dashboard', icon: '🏠' },
        { id: 'advancement', label: 'My 7 Ranks', icon: '⚜️' },
        { id: 'assignments', label: 'My Homework', icon: '🎒' },
        { id: 'merit-badges', label: 'My Merit Badges', icon: '🏅' },
        { id: 'road-to-eagle', label: 'Road to Eagle', icon: '🦅' },
        { id: 'events', label: 'Upcoming Events', icon: '📅' },
        { id: 'islamic', label: 'Islamic Knowledge', icon: '🕌' },
        { id: 'journal', label: 'My Journal & Notes', icon: '📝' },
        { id: 'service-log', label: 'Service Log', icon: '⏱️' },
        { id: 'chat', label: userGroupName ? `${userGroupName} Chat` : 'Patrol Chat', icon: '💬', badge: unreadChatCount },
        { id: 'resources', label: 'Resources', icon: '📚' },
        { id: 'profile', label: 'My Profile', icon: '👤' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* ── MOBILE TOP BAR (VISIBLE ON SMALL SCREENS ONLY) ── */}
      <header className="md:hidden bg-slate-950/95 backdrop-blur border-b border-slate-800 p-4 sticky top-0 z-40 flex items-center justify-between print-hide">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-base shadow-md">
            ⚜️
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight">Dhulfiqār Scouts</h1>
            <span className="text-[10px] text-emerald-400 font-semibold">{currentUser.fullName || currentUser.username}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── MOBILE DRAWER OVERLAY (MOBILE ONLY) ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex print-hide animate-fadeIn">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  ⚜️
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Dhulfiqār Scouts</h2>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold uppercase">
                    v3.0
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
            <div className="p-4 bg-slate-900/60 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 text-xs">
                  {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{currentUser.fullName || currentUser.username}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{roleLabel}</p>
                </div>
              </div>
              {userGroupName && (
                <div className="mt-2 text-[10px] bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1">
                  <span>👥</span> <span className="truncate">{userGroupName} Patrol</span>
                </div>
              )}
            </div>

            {/* Nav Items List */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600/30 to-teal-650/20 text-emerald-300 border-l-4 border-emerald-500 font-extrabold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/80 hover:text-white text-slate-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP PERMANENT SIDEBAR NAVIGATION ── */}
      <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-slate-950 border-r border-slate-800 shrink-0 h-screen sticky top-0 z-30 select-none print-hide">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/90 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-950/40 shrink-0">
            ⚜️
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <span className="truncate">Dhulfiqār Scouts</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold uppercase shrink-0">
                v3.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Taliʿa Leadership Portal</p>
          </div>
        </div>

        {/* User Profile Mini-Card */}
        <div className="p-4 mx-3 my-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xs shrink-0 shadow-sm">
              {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black text-white truncate">{currentUser.fullName || currentUser.username}</h4>
              <p className="text-[10px] text-emerald-400 font-semibold capitalize truncate">{roleLabel}</p>
            </div>
          </div>
          {userGroupName && (
            <div className="text-[10px] bg-slate-800/80 text-emerald-300 px-2.5 py-1 rounded-xl border border-slate-700/50 flex items-center gap-1.5 truncate">
              <span>👥</span>
              <span className="font-semibold truncate">{userGroupName} Patrol</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Clock size={11} className="animate-pulse" />
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-650/20 text-emerald-300 border-l-4 border-emerald-500 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base shrink-0 group-hover:scale-110 transition">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight size={13} className="text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-600/80 hover:text-white text-slate-300 text-xs font-bold py-2.5 rounded-xl border border-slate-800 transition cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE (FITS ALL SCREEN SIZES) ── */}
      <main className="flex-1 min-w-0 bg-slate-900 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'road-to-eagle' && isScout && (
          <RoadToEagleGuide currentUser={currentUser} onNavigate={handleNavigate} />
        )}

        {currentTab === 'home' && (isLeader || isExecutive) && (
          <LeaderHome 
            currentUser={currentUser} 
            onNavigate={handleNavigate} 
          />
        )}
        
        {currentTab === 'home' && isScout && (
          <StudentHome 
            currentUser={currentUser} 
            unreadChatCount={unreadChatCount} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentTab === 'home' && isParent && (
          <ParentDashboard 
            currentUser={currentUser} 
            onNavigate={handleNavigate} 
          />
        )}

        {(currentTab === 'admin' || currentTab === 'global-admin') && isExecutive && (
          <AdminPanel currentUser={currentUser} />
        )}
        {currentTab === 'group-manager' && isOwner && <GroupManager currentUser={currentUser} />}
        {currentTab === 'roster' && (isLeader || isExecutive) && <PatrolRoster currentUser={currentUser} />}
        {currentTab === 'scouts' && (isLeader || isExecutive) && <ScoutList currentUser={currentUser} />}
        {currentTab === 'advancement' && <AdvancementTracker currentUser={currentUser} />}
        {currentTab === 'merit-badges' && isScout && <MeritBadgeDashboard currentUser={currentUser} />}
        {currentTab === 'assignments' && <AssignmentsManager currentUser={currentUser} />}
        {currentTab === 'events' && <EventsManager currentUser={currentUser} onNavigate={handleNavigate} />}
        {currentTab === 'lesson-plans' && (isLeader || isExecutive) && <LessonPlans currentUser={currentUser} />}
        {currentTab === 'islamic' && <IslamicBasics currentUser={currentUser} />}
        {currentTab === 'service-log' && isScout && <ServiceLogs currentUser={currentUser} />}
        {currentTab === 'resources' && <VideoResources currentUser={currentUser} />}
        {currentTab === 'profile' && <ScoutProfile currentUser={currentUser} />}
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} />}
        {currentTab === 'reports' && (isLeader || isExecutive) && <LeaderReportsCenter currentUser={currentUser} onNavigate={handleNavigate} />}
        {currentTab === 'attendance' && (isLeader || isExecutive) && <PatrolAttendance currentUser={currentUser} initialData={attendanceInitialData} />}
        {currentTab === 'journal' && <ScoutJournalNotes currentUser={currentUser} />}
      </main>
    </div>
  );
}
