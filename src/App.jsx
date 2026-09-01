import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdvancementTracker from './components/AdvancementTracker';
import PatrolChat from './components/PatrolChat';
import AdminPanel from './components/AdminPanel';
import ScoutList from './components/ScoutList';
import PatrolRoster from './components/PatrolRoster';
import MeritBadgeDashboard from './components/MeritBadgeDashboard';
import GlobalAdminPanel from './components/GlobalAdminPanel';
import GroupManager from './components/GroupManager';
import VideoResources from './components/VideoResources';
import ScoutProfile from './components/ScoutProfile';
import LessonPlans from './components/LessonPlans';
import IslamicBasics from './components/IslamicBasics';
import ServiceLogs from './components/ServiceLogs';
import AssignmentsManager from './components/AssignmentsManager';
import EventsManager from './components/EventsManager';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [userGroupName, setUserGroupName] = useState('');

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
            // Profile document doesn't exist yet
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
  const isLeader = !isOwner && currentUser?.role === 'leader';
  const isScout = !isOwner && !isLeader;

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

  // 3. Automatically set default tab when user logs in or role changes
  useEffect(() => {
    if (currentUser) {
      if (isOwner) {
        setCurrentTab('global-admin');
      } else if (isLeader) {
        setCurrentTab('roster');
      } else {
        setCurrentTab('advancement');
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 font-semibold text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Dhulfiqār Scouts Portal...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  const roleLabel = isOwner ? 'Troop Owner / Superadmin' : isLeader ? (currentUser?.leaderPosition || 'Troop Leader') : 'Scout';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top App Header */}
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700 sticky top-0 z-50 print-hide">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-950/40">
              ⚜️
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>Dhulfiqār Scouts</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold uppercase">
                  v3.0
                </span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold">{currentUser.fullName || currentUser.username || currentUser.email}</span>
                <span>•</span>
                <span className="capitalize text-slate-350">{roleLabel}</span>
                {userGroupName && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-300 font-medium">{userGroupName} Patrol</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-xs bg-slate-700 hover:bg-red-600/80 hover:text-white text-slate-300 font-semibold px-3 py-1.5 rounded-xl border border-slate-650 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <div className="bg-slate-850 border-b border-slate-750 overflow-x-auto print-hide scrollbar-none">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 sm:gap-2">
          {/* ── OWNER NAVIGATION ── */}
          {isOwner && (
            <>
              <button
                onClick={() => setCurrentTab('global-admin')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'global-admin'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Global Admin
              </button>
              <button
                onClick={() => setCurrentTab('group-manager')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'group-manager'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Organization Hub
              </button>
              <button
                onClick={() => setCurrentTab('roster')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'roster'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Patrol Roster
              </button>
              <button
                onClick={() => setCurrentTab('scouts')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'scouts'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Advancement Overview
              </button>
              <button
                onClick={() => setCurrentTab('assignments')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'assignments'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🎒 Homework & Tasks
              </button>
              <button
                onClick={() => setCurrentTab('events')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'events'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                📅 Planned Events
              </button>
              <button
                onClick={() => setCurrentTab('lesson-plans')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'lesson-plans'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson Plans
              </button>
              <button
                onClick={() => setCurrentTab('islamic')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'islamic'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Islamic Knowledge
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Patrol Messenger
              </button>
              <button
                onClick={() => setCurrentTab('resources')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'resources'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'profile'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Profile
              </button>
            </>
          )}

          {/* ── LEADER NAVIGATION ── */}
          {isLeader && (
            <>
              <button
                onClick={() => setCurrentTab('roster')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'roster'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Patrol Roster
              </button>
              <button
                onClick={() => setCurrentTab('scouts')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'scouts'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Advancement Overview
              </button>
              <button
                onClick={() => setCurrentTab('assignments')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'assignments'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🎒 Homework & Tasks
              </button>
              <button
                onClick={() => setCurrentTab('events')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'events'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                📅 Planned Events
              </button>
              <button
                onClick={() => setCurrentTab('lesson-plans')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'lesson-plans'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson Plans
              </button>
              <button
                onClick={() => setCurrentTab('islamic')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'islamic'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Islamic Knowledge
              </button>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'admin'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Add Requirement
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {userGroupName ? `${userGroupName} Messenger` : 'Patrol Messenger'}
              </button>
              <button
                onClick={() => setCurrentTab('resources')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'resources'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'profile'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Profile
              </button>
            </>
          )}

          {/* ── SCOUT NAVIGATION ── */}
          {isScout && (
            <>
              <button
                onClick={() => setCurrentTab('advancement')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'advancement'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My 7 Ranks
              </button>
              <button
                onClick={() => setCurrentTab('assignments')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'assignments'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🎒 My Homework
              </button>
              <button
                onClick={() => setCurrentTab('merit-badges')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'merit-badges'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Merit Badges
              </button>
              <button
                onClick={() => setCurrentTab('events')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'events'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                📅 Upcoming Events
              </button>
              <button
                onClick={() => setCurrentTab('islamic')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'islamic'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Islamic Knowledge
              </button>
              <button
                onClick={() => setCurrentTab('service-log')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'service-log'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Service Log
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {userGroupName ? `${userGroupName} Messenger` : 'Patrol Messenger'}
              </button>
              <button
                onClick={() => setCurrentTab('resources')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'resources'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'profile'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {currentTab === 'global-admin' && isOwner && <GlobalAdminPanel currentUser={currentUser} />}
        {currentTab === 'group-manager' && isOwner && <GroupManager currentUser={currentUser} />}
        {currentTab === 'roster' && (isLeader || isOwner) && <PatrolRoster currentUser={currentUser} />}
        {currentTab === 'advancement' && <AdvancementTracker currentUser={currentUser} />}
        {currentTab === 'merit-badges' && isScout && <MeritBadgeDashboard currentUser={currentUser} />}
        {currentTab === 'assignments' && <AssignmentsManager currentUser={currentUser} />}
        {currentTab === 'events' && <EventsManager currentUser={currentUser} />}
        {currentTab === 'lesson-plans' && (isLeader || isOwner) && <LessonPlans currentUser={currentUser} />}
        {currentTab === 'islamic' && <IslamicBasics currentUser={currentUser} />}
        {currentTab === 'service-log' && isScout && <ServiceLogs currentUser={currentUser} />}
        {currentTab === 'resources' && <VideoResources currentUser={currentUser} />}
        {currentTab === 'profile' && <ScoutProfile currentUser={currentUser} />}
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} />}
        {currentTab === 'scouts' && (isLeader || isOwner) && <ScoutList currentUser={currentUser} />}
        {currentTab === 'admin' && (isLeader || isOwner) && <AdminPanel />}
      </main>
    </div>
  );
}
