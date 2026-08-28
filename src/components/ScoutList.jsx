import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import ScoutProgressReport from './ScoutProgressReport';
import { Users, ChevronRight } from 'lucide-react';

export default function ScoutList({ currentUser }) {
  const [scouts, setScouts] = useState([]);
  const [selectedScout, setSelectedScout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scoutsQuery = query(
      collection(db, 'users'),
      where('leaderId', '==', currentUser.uid)
    );
    const unsub = onSnapshot(scoutsQuery, (snap) => {
      const all = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      setScouts(all.filter((u) => u.role === 'scout'));
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser.uid]);

  if (selectedScout) {
    return (
      <ScoutProgressReport
        scout={selectedScout}
        currentUser={currentUser}
        onBack={() => setSelectedScout(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Users className="text-emerald-400" size={22} />
          Scout Roster
        </h2>
        <p className="text-xs text-slate-400">
          Select a scout to view their progress report and print for parent conferences.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading scouts…</div>
      ) : scouts.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
          No scouts found. Make sure scout accounts exist in the{' '}
          <span className="font-mono text-xs text-slate-300">users</span> Firestore collection
          with <span className="font-mono text-xs text-slate-300">role: "member"</span>.
        </div>
      ) : (
        <div className="space-y-2">
          {scouts.map((scout) => (
            <button
              key={scout.uid}
              onClick={() => setSelectedScout(scout)}
              className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-4 text-left transition cursor-pointer group"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-300 transition">
                  {scout.fullName || scout.email}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="mr-2 text-emerald-400 font-semibold">{scout.rank || 'Scout'}</span>
                  <span>&bull; {scout.patrolId || scout.patrol || 'Taliʿa'} Patrol</span>
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-500 group-hover:text-emerald-400 transition" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
