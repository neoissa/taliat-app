import React, { useState } from 'react';
import Login from './components/Login';
import AdvancementTracker from './components/AdvancementTracker';
import PatrolChat from './components/PatrolChat';
import AdminPanel from './components/AdminPanel';
import ScoutList from './components/ScoutList';
import PatrolRoster from './components/PatrolRoster';
import MeritBadgeDashboard from './components/MeritBadgeDashboard';
import GlobalAdminPanel from './components/GlobalAdminPanel';
import GroupManager from './components/GroupManager';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('');

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = !isOwner && currentUser?.role === 'leader';
  const isScout = !isOwner && (currentUser?.role === 'scout' || (!isOwner && !isLeader));

  // Automatically set default tab when user logs in
  React.useEffect(() => {
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
  }, [currentUser]);

  // Proactively promote neoissa@gmail.com to owner in the database on load
  React.useEffect(() => {
    if (currentUser && currentUser.email === 'neoissa@gmail.com') {
      const userRef = doc(db, 'users', currentUser.uid);
      setDoc(userRef, { role: 'owner', isOwner: true, email: 'neoissa@gmail.com' }, { merge: true })
        .then(() => {
          console.log("Database owner promotion synced successfully.");
        })
        .catch(err => {
          console.error("Database promotion sync failed:", err);
        });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

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
        <button
          onClick={handleLogout}
          className="bg-slate-700 hover:bg-slate-600 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      {/* Navigation Sub-header */}
      <div className="bg-slate-800/40 border-b border-slate-700/60 px-6 print-hide">
        <div className="max-w-4xl mx-auto flex gap-6 overflow-x-auto scrollbar-none">
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
                Patrol Stream
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
                Scoped Chat
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
                Patrol Chat
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
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} />}
        {currentTab === 'scouts' && isLeader && <ScoutList currentUser={currentUser} />}
        {currentTab === 'admin' && isLeader && <AdminPanel />}
      </main>
    </div>
  );
}
