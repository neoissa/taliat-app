import React, { useState } from 'react';
import Login from './components/Login';
import AdvancementTracker from './components/AdvancementTracker';
import PatrolChat from './components/PatrolChat';
import AdminPanel from './components/AdminPanel';
import MeritBadgeDashboard from './components/MeritBadgeDashboard';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('advancement');

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onUserAuthenticated={(user) => setCurrentUser(user)} />;
  }

  const isLeader = currentUser.role === 'leader' || currentUser.email?.includes('neoissa');

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700 px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Taliʿa Patrol Portal</h1>
          <p className="text-xs text-slate-400">
            Logged in as <span className="text-white font-semibold">{currentUser.fullName || currentUser.email}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 uppercase font-bold border border-emerald-500/30">
              {isLeader ? 'Leader' : 'Member'}
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
      <div className="bg-slate-800/40 border-b border-slate-700/60 px-6">
        <div className="max-w-4xl mx-auto flex gap-6">
          <button
            onClick={() => setCurrentTab('advancement')}
            className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
              currentTab === 'advancement'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Advancement Tracker
          </button>
          <button
            onClick={() => setCurrentTab('merit-badges')}
            className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
              currentTab === 'merit-badges'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Merit Badges
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
              currentTab === 'chat'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Patrol Stream
          </button>
          {isLeader && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                currentTab === 'admin'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Add Requirements
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {currentTab === 'advancement' && <AdvancementTracker currentUser={currentUser} />}
        {currentTab === 'merit-badges' && <MeritBadgeDashboard currentUser={currentUser} />}
        {currentTab === 'chat' && <PatrolChat currentUser={currentUser} />}
        {currentTab === 'admin' && isLeader && <AdminPanel />}
      </main>
    </div>
  );
}
