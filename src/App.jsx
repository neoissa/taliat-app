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
            // Profile document doesn't exist yet (e.g. fresh admin login)
            const tempProfile = {
              uid: user.uid,
              email: user.email,
              role: user.email === 'neoissa@gmail.com' ? 'owner' : 'leader',
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
  const isScout = !isOwner && (currentUser?.role === 'scout' || (!isOwner && !isLeader));

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

  const compressAndResizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 120;
          const MAX_HEIGHT = 120;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressAndResizeImage(file);
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { photoURL: compressedBase64 }, { merge: true });
      console.log("Avatar updated successfully!");
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      alert("Failed to update profile picture: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
        Signing in to Taliʿa Portal...
      </div>
    );
  }

  if (!currentUser) {
    return <Login onUserAuthenticated={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700 px-6 py-4 sticky top-0 z-50 flex justify-between items-center print-hide">
        <div>
          <h1 className="text-xl font-bold text-emerald-400 font-sans tracking-wide">Taliʿa Scouting Portal</h1>
          <p className="text-xs text-slate-400">
            Logged in as <span className="text-white font-semibold">{currentUser.fullName || currentUser.email}</span>
            {isOwner && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 uppercase font-bold border border-amber-500/30">
                Owner
              </span>
            )}
            {isLeader && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 uppercase font-bold border border-emerald-500/30">
                Leader
              </span>
            )}
            {isScout && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300 uppercase font-bold border border-slate-600">
                Scout
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Avatar with click-to-upload */}
          <label className="relative group cursor-pointer shrink-0" title="Click to upload profile picture">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50 group-hover:border-emerald-400 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-slate-200 group-hover:bg-slate-650 transition text-sm">
                {(currentUser.fullName || currentUser.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            {/* Edit overlay */}
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[9px] font-bold text-white leading-none text-center">
              Edit
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <div className="bg-slate-800/40 border-b border-slate-700/60 px-6 print-hide">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-x-6 gap-y-1">
          {isOwner && (
            <>
              <button
                onClick={() => setCurrentTab('global-admin')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'global-admin'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Global Admin Panel
              </button>
              <button
                onClick={() => setCurrentTab('group-manager')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'group-manager'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Group Manager
              </button>
              <button
                onClick={() => setCurrentTab('roster')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'roster'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Patrol Roster
              </button>
              <button
                onClick={() => setCurrentTab('advancement')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'advancement'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Advancement Tracker
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {userGroupName ? `${userGroupName} Messenger` : 'Patrol Messenger'}
              </button>
              <button
                onClick={() => setCurrentTab('resources')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'resources'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentTab('islamic')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'islamic'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Islamic Knowledge
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'profile'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Profile
              </button>
            </>
          )}

          {isLeader && (
            <>
              <button
                onClick={() => setCurrentTab('roster')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'roster'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Patrol Roster
              </button>
              <button
                onClick={() => setCurrentTab('scouts')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'scouts'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Advancement Overview
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {userGroupName ? `${userGroupName} Messenger` : 'Patrol Messenger'}
              </button>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'admin'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Add Requirement
              </button>
              <button
                onClick={() => setCurrentTab('resources')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'resources'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentTab('lesson-plans')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'lesson-plans'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson Plans
              </button>
              <button
                onClick={() => setCurrentTab('islamic')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'islamic'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Islamic Knowledge
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'profile'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Profile
              </button>
            </>
          )}

          {isScout && (
            <>
              <button
                onClick={() => setCurrentTab('advancement')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'advancement'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My 7 Ranks
              </button>
              <button
                onClick={() => setCurrentTab('merit-badges')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'merit-badges'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Merit Badges
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {userGroupName ? `${userGroupName} Messenger` : 'Patrol Messenger'}
              </button>
              <button
                onClick={() => setCurrentTab('resources')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'resources'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'profile'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setCurrentTab('islamic')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'islamic'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Islamic Knowledge
              </button>
              <button
                onClick={() => setCurrentTab('service-log')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                  currentTab === 'service-log'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Service Log
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {currentTab === 'global-admin' && isOwner && <GlobalAdminPanel currentUser={currentUser} />}
        {currentTab === 'group-manager' && isOwner && <GroupManager currentUser={currentUser} />}
        {currentTab === 'roster' && (isLeader || isOwner) && <PatrolRoster currentUser={currentUser} />}
        {currentTab === 'advancement' && <AdvancementTracker currentUser={currentUser} />}
        {currentTab === 'merit-badges' && isScout && <MeritBadgeDashboard currentUser={currentUser} />}
        {currentTab === 'resources' && <VideoResources currentUser={currentUser} />}
        {currentTab === 'profile' && <ScoutProfile currentUser={currentUser} />}
        {currentTab === 'lesson-plans' && (isLeader || isOwner) && <LessonPlans currentUser={currentUser} />}
        {currentTab === 'events' && <EventsManager currentUser={currentUser} />}
        {currentTab === 'assignments' && <AssignmentsManager currentUser={currentUser} />}
        {currentTab === 'islamic' && <IslamicBasics currentUser={currentUser} />}
        {currentTab === 'service-log' && isScout && <ServiceLogs currentUser={currentUser} />}
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} />}
        {currentTab === 'scouts' && isLeader && <ScoutList currentUser={currentUser} />}
        {currentTab === 'admin' && isLeader && <AdminPanel />}
      </main>
    </div>
  );
}
