import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc 
} from 'firebase/firestore';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Star, 
  Trophy, 
  User, 
  Video, 
  ChevronRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import RankIcon from './RankIcon';
import AssignmentsManager from './AssignmentsManager';
import { RANKS_DATA } from '../data/ranksData';

export default function StudentHome({ currentUser, onNavigate }) {
  const [ranksProgress, setRanksProgress] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [meritBadgesCount, setMeritBadgesCount] = useState(0);
  const [serviceHours, setServiceHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const scoutUid = currentUser?.uid;

  // 1. Subscribe to scout's rank progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'ranks'), (snap) => {
      const pMap = {};
      snap.docs.forEach(d => {
        pMap[d.id] = d.data();
      });
      setRanksProgress(pMap);
      setLoading(false);
    }, (err) => {
      console.warn("Rank progress load fallback:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [scoutUid]);

  // 2. Subscribe to upcoming events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setUpcomingEvents(list.slice(0, 3)); // show top 3 upcoming
    }, (err) => console.warn("Events load fallback:", err));

    return () => unsub();
  }, []);

  // 3. Subscribe to merit badges completed
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      let count = 0;
      snap.docs.forEach(d => {
        if (d.data().completed) count++;
      });
      setMeritBadgesCount(count);
    }, (err) => console.warn("Merit badge count fallback:", err));

    return () => unsub();
  }, [scoutUid]);

  // 4. Subscribe to service logs
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'service_logs'), (snap) => {
      let total = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.userId === scoutUid && data.hours) {
          total += Number(data.hours) || 0;
        }
      });
      setServiceHours(total);
    }, (err) => console.warn("Service hours fallback:", err));

    return () => unsub();
  }, [scoutUid]);

  return (
    <div className="space-y-6">
      {/* ── 1. WELCOME HERO CARD ── */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-950/40 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-3 top-2 opacity-5 pointer-events-none">
          <Trophy size={160} className="text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center p-2 shadow-lg shadow-emerald-950/50 shrink-0">
              <RankIcon rankId={currentUser?.rank || 'scout'} className="w-12 h-12 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {currentUser?.rank ? `${currentUser.rank} Rank` : 'Scout'}
                </span>
                {currentUser?.patrolName && (
                  <span className="bg-slate-700/60 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {currentUser.patrolName} Patrol
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || 'Scout'}! ⚜️
              </h2>
              <p className="text-xs text-slate-350 mt-1">
                Welcome to your Dhulfiqār scouting portal. Track your advancement, complete homework, and prepare for upcoming events.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate && onNavigate('advancement')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <Award size={15} /> My 7 Ranks
            </button>
          </div>
        </div>

        {/* Quick Scout Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="bg-slate-900/60 border border-slate-750/70 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Rank</span>
            <strong className="text-sm font-black text-emerald-400 capitalize">
              {currentUser?.rank || 'Scout'}
            </strong>
          </div>

          <div className="bg-slate-900/60 border border-slate-750/70 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Merit Badges</span>
            <strong className="text-sm font-black text-amber-400">
              {meritBadgesCount} Earned
            </strong>
          </div>

          <div className="bg-slate-900/60 border border-slate-750/70 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Service Hours</span>
            <strong className="text-sm font-black text-sky-400">
              {serviceHours} Hours
            </strong>
          </div>

          <div className="bg-slate-900/60 border border-slate-750/70 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">BSA Member ID</span>
            <strong className="text-xs font-mono text-slate-300">
              {currentUser?.bsaId || '—'}
            </strong>
          </div>
        </div>
      </div>

      {/* ── 2. SCOUT HOMEWORK & DUE TASKS (VIDEOS & WORKSHEETS) ── */}
      <AssignmentsManager currentUser={currentUser} scoutId={currentUser?.uid} isEmbeddedInProfile={false} />

      {/* ── 3. UPCOMING PLANNED EVENTS & ACTIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Upcoming Events */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-750 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Calendar className="text-emerald-400" size={18} />
              <span>Upcoming Troop Events & Campouts</span>
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('events')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs italic">
              No upcoming events scheduled right now.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map(ev => (
                <div
                  key={ev.id}
                  className="bg-slate-900/50 border border-slate-750 p-3.5 rounded-xl flex items-center justify-between gap-3 hover:border-slate-650 transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {ev.date}
                      </span>
                      {ev.time && (
                        <span className="text-[10px] text-slate-400">
                          ⏰ {ev.time}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-white">{ev.title}</h4>
                    {ev.location && (
                      <p className="text-[11px] text-slate-400 mt-0.5">📍 {ev.location}</p>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate && onNavigate('events')}
                    className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 shrink-0 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Action Hub */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-extrabold text-white text-sm border-b border-slate-750 pb-3 flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={16} />
            <span>Scout Quick Hub</span>
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate && onNavigate('advancement')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">⚜️</span>
                <div>
                  <h4 className="font-bold text-xs text-white">My 7 Ranks</h4>
                  <p className="text-[10px] text-slate-400">Submit completed requirements</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('merit-badges')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🏅</span>
                <div>
                  <h4 className="font-bold text-xs text-white">My Merit Badges</h4>
                  <p className="text-[10px] text-slate-400">Explore packets & requirements</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('islamic')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🕌</span>
                <div>
                  <h4 className="font-bold text-xs text-white">Islamic Knowledge</h4>
                  <p className="text-[10px] text-slate-400">Karbala heroes, du'as & fundamentals</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('chat')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">💬</span>
                <div>
                  <h4 className="font-bold text-xs text-white">Patrol Messenger</h4>
                  <p className="text-[10px] text-slate-400">Chat with patrol scouts & leaders</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('service-log')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">⏱️</span>
                <div>
                  <h4 className="font-bold text-xs text-white">Service Log</h4>
                  <p className="text-[10px] text-slate-400">Record community service</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
