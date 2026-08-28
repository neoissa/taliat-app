import React, { useState } from 'react';
import Login from './components/Login';
import AdvancementTracker from './components/AdvancementTracker';
import PatrolChat from './components/PatrolChat';
import AdminPanel from './components/AdminPanel';
import ScoutList from './components/ScoutList';
import PatrolRoster from './components/PatrolRoster';
import MeritBadgeDashboard from './components/MeritBadgeDashboard';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('');

  // Automatically set default tab when user logs in
  React.useEffect(() => {
    if (currentUser) {
      setCurrentTab(currentUser.role === 'leader' ? 'roster' : 'advancement');
    } else {
      setCurrentTab('');
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onUserAuthenticated={(user) => setCurrentUser(user)} />;
  }

  const isLeader = currentUser.role === 'leader';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700 px-6 py-4 sticky top-0 z-50 flex justify-between items-center print-hide">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Taliʿa Patrol Portal</h1>
          <p className="text-xs text-slate-400">
            Logged in as <span className="text-white font-semibold">{currentUser.fullName || currentUser.email}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 uppercase font-bold border border-emerald-500/30">
              {isLeader ? 'Leader' : 'Scout'}
            </span>
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
        <div className="max-w-4xl mx-auto flex gap-6">
          {isLeader ? (
            <>
              <button
                onClick={() => setCurrentTab('roster')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  currentTab === 'roster'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Patrol Roster
              </button>
              <button
                onClick={() => setCurrentTab('scouts')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  currentTab === 'scouts'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Advancement Overview
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  currentTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Scoped Chat
              </button>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  currentTab === 'admin'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Add Requirement
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentTab('advancement')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  currentTab === 'advancement'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My 7 Ranks
              </button>
              <button
                onClick={() => setCurrentTab('merit-badges')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  currentTab === 'merit-badges'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                My Merit Badges
              </button>
              <button
                onClick={() => setCurrentTab('chat')}
                className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
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
        {currentTab === 'advancement' && !isLeader && <AdvancementTracker currentUser={currentUser} />}
        {currentTab === 'merit-badges' && !isLeader && <MeritBadgeDashboard currentUser={currentUser} />}
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} />}
        {currentTab === 'scouts' && isLeader && <ScoutList currentUser={currentUser} />}
        {currentTab === 'roster' && isLeader && <PatrolRoster currentUser={currentUser} />}
        {currentTab === 'admin' && isLeader && <AdminPanel />}
      </main>
    </div>
  );
}
