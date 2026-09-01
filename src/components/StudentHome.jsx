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
  Shield,
  ShieldCheck,
  Flame,
  Target,
  Compass,
  Heart,
  MapPin,
  Check
} from 'lucide-react';
import RankIcon from './RankIcon';
import AssignmentsManager from './AssignmentsManager';
import { RANKS_DATA } from '../data/ranksData';

export default function StudentHome({ currentUser, onNavigate, unreadChatCount = 0 }) {
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
        const data = d.data();
        if (data.completed || data.steps && Object.values(data.steps).every(v => v === true || v?.completed === true)) {
          count++;
        }
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
        if ((data.scoutId === scoutUid || data.userId === scoutUid) && data.hours) {
          total += Number(data.hours) || 0;
        }
      });
      setServiceHours(total);
    }, (err) => console.warn("Service hours fallback:", err));

    return () => unsub();
  }, [scoutUid]);

  const activeRank = currentUser?.rank || 'Scout';

  return (
    <div className="space-y-6">
      {/* ── 1. WELCOME HERO CARD ── */}
      <div className="bg-gradient-to-br from-slate-850 via-slate-800 to-emerald-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-4 top-2 opacity-5 pointer-events-none">
          <Trophy size={180} className="text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 flex items-center justify-center p-2.5 shadow-xl shadow-emerald-950/50 shrink-0">
              <RankIcon rankId={activeRank} className="w-14 h-14 text-emerald-400 drop-shadow-md" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <span>⚜️</span> {activeRank} Rank
                </span>
                {currentUser?.patrolName && (
                  <span className="bg-slate-700/70 text-slate-200 border border-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span>👥</span> {currentUser.patrolName} Patrol
                  </span>
                )}
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>✨</span> Be Prepared • كُن مُسْتَعِدّاً
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Assalāmu ʿAlaykum, {currentUser?.fullName || currentUser?.username || 'Scout'}!</span>
                <span className="text-amber-400">⚜️</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Welcome to your official Dhulfiqār scouting headquarters. Complete missions, earn merit badges, log service hours, and advance your rank!
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('advancement')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-xl shadow-emerald-950/60 hover:scale-[1.02]"
            >
              <Award size={16} />
              <span>⚜️ My 7 Ranks</span>
            </button>
          </div>
        </div>

        {/* ── Quick Scout Stats Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 relative z-10">
          {/* Active Rank */}
          <div className="bg-slate-900/70 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Active Rank</span>
              <strong className="text-sm font-black text-emerald-400 capitalize block">
                {activeRank}
              </strong>
            </div>
          </div>

          {/* Merit Badges */}
          <div className="bg-slate-900/70 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Star size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Merit Badges</span>
              <strong className="text-sm font-black text-amber-400 block">
                {meritBadgesCount} Earned
              </strong>
            </div>
          </div>

          {/* Service Hours */}
          <div className="bg-slate-900/70 border border-sky-500/30 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Service Hours</span>
              <strong className="text-sm font-black text-sky-400 block">
                {serviceHours} Hours
              </strong>
            </div>
          </div>

          {/* BSA ID */}
          <div className="bg-slate-900/70 border border-slate-700/70 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">BSA Member ID</span>
              <strong className="text-xs font-mono text-slate-200 block truncate">
                {currentUser?.bsaId || '—'}
              </strong>
            </div>
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
              <span>📅 Upcoming Troop Events & Campouts</span>
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('events')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-900/40 rounded-xl border border-slate-800">
              🏕️ No upcoming troop events scheduled right now. Check back soon!
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(ev => {
                const isToday = ev.date === new Date().toISOString().split('T')[0];
                return (
                  <div
                    key={ev.id}
                    className="bg-slate-900/60 border border-slate-750 hover:border-emerald-500/40 p-4 rounded-xl flex items-center justify-between gap-3 transition shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                          <span>📅</span> {ev.date}
                        </span>
                        {ev.time && (
                          <span className="text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                            <span>⏰</span> {ev.time}
                          </span>
                        )}
                        {isToday && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                            🔥 TODAY!
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{ev.title}</h4>
                      {ev.location && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📍</span> {ev.location}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate && onNavigate('events')}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-3.5 py-2 rounded-xl border border-slate-700 shrink-0 cursor-pointer shadow-sm"
                    >
                      Details & Maps
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Quick Action Hub */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-extrabold text-white text-sm border-b border-slate-750 pb-3 flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={16} />
            <span>⚡ Scout Adventure Hub</span>
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate && onNavigate('advancement')}
              className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition">⚜️</span>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition">My 7 Ranks</h4>
                  <p className="text-[10px] text-slate-400">Complete requirements & advance</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-emerald-400 transition" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('merit-badges')}
              className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-amber-500/50 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition">🏅</span>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition">My Merit Badges</h4>
                  <p className="text-[10px] text-slate-400">Plan your 21 Eagle Merit Badges</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-amber-400 transition" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('islamic')}
              className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-emerald-500/50 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition">🕌</span>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition">Islamic Knowledge</h4>
                  <p className="text-[10px] text-slate-400">14 Infallibles, Karbala & Du'as</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-emerald-400 transition" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('chat')}
              className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-sky-500/50 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition">💬</span>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-sky-300 transition flex items-center gap-1.5">
                    <span>Patrol Messenger</span>
                    {unreadChatCount > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                        {unreadChatCount > 99 ? '99+' : unreadChatCount} new
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400">Chat with patrol & vote in polls</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-sky-400 transition" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('service-log')}
              className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-750 hover:border-teal-500/50 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition">⏱️</span>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-teal-300 transition">Service & Volunteering</h4>
                  <p className="text-[10px] text-slate-400">Record community service hours</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-teal-400 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
