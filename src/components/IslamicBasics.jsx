import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { 
  ISLAMIC_BASICS_TOPICS, 
  KARBALA_CHARACTERS_DATA, 
  TAQIBAT_AND_DUAS_DATA, 
  INFALLIBLES_FULL_BIOGRAPHIES 
} from '../data/islamicBasicsData';
import { 
  BookOpen, 
  Star, 
  Sparkles, 
  Heart, 
  HelpCircle, 
  Shield, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Flame, 
  Scroll, 
  UserCheck, 
  Compass, 
  MapPin, 
  Quote 
} from 'lucide-react';

const USUL_AL_DIN = [
  {
    name: 'Tawhid (Monotheism)',
    arabic: 'التوحيد',
    meaning: 'Belief in the Absolute Oneness of God',
    description: 'There is only one God (Allah) who is the Creator, Sustainer, and Ruler of the universe. He has no partners, equals, physical form, or children. He is Eternal, All-Powerful, All-Knowing, and beyond human imagination.'
  },
  {
    name: 'Adl (Divine Justice)',
    arabic: 'العدل',
    meaning: 'Belief in the Justice of God',
    description: 'Allah is completely just and fair. He does not commit injustice, evil, or oppression against anyone. He rewards righteous deeds and holds accountable wrongful actions based on intention, free will, and capacity.'
  },
  {
    name: 'Nubuwwah (Prophethood)',
    arabic: 'النبوة',
    meaning: 'Belief in the 124,000 Infallible Prophets',
    description: 'Allah sent 124,000 prophets to guide humanity, starting with Prophet Adam (A.S.) and culminating with the Seal of Prophets, Prophet Muhammad (S.A.W.). All prophets were infallible, noble role models protected from sin and error.'
  },
  {
    name: 'Imamah (Divine Leadership)',
    arabic: 'الإمامة',
    meaning: 'Belief in the 12 Infallible Imams of Ahlul Bayt',
    description: 'After Prophet Muhammad (S.A.W.), Allah appointed 12 infallible leaders (Imams) from the Prophet\'s purified household (Ahlul Bayt) to guide and preserve the religion, starting with Imam Ali (A.S.) and concluding with the living 12th Imam, Imam al-Mahdi (A.T.F.S.).'
  },
  {
    name: 'Ma\'ad (Resurrection & Afterlife)',
    arabic: 'المعاد',
    meaning: 'Belief in the Day of Judgement & Accountability',
    description: 'All human beings will be physically and spiritually resurrected on the Day of Judgement (Yawm al-Qiyamah) to face justice. Those who nurtured righteous faith and deeds will enter eternal Paradise (Jannah).'
  }
];

const FURU_AL_DIN = [
  { name: 'Salah', arabic: 'الصلاة', meaning: 'The 5 Daily Obligatory Prayers', details: 'Performing 17 daily rak\'ahs to connect with Allah and purify the soul (Fajr, Dhuhr, Asr, Maghrib, Isha).' },
  { name: 'Sawm', arabic: 'الصوم', meaning: 'Fasting in Holy Ramadan', details: 'Abstaining from food, drink, and spiritual sins from true dawn until Maghrib to develop Taqwa (God-consciousness).' },
  { name: 'Hajj', arabic: 'الحج', meaning: 'Pilgrimage to the Holy Ka\'bah', details: 'Performing the pilgrimage to Makkah once in a lifetime for those with financial, physical, and security capability.' },
  { name: 'Zakah', arabic: 'الزكاة', meaning: 'Almsgiving on Specific Assets', details: 'Purifying wealth by giving a prescribed portion on grains, cattle, and precious metals to the poor.' },
  { name: 'Khums', arabic: 'الخمس', meaning: 'The One-Fifth (20%) Annual Obligation', details: 'Giving 20% of annual surplus savings after living expenses, supporting religious education (Sahm al-Imam) and needy descendants (Sahm al-Sadat).' },
  { name: 'Jihad', arabic: 'الجهاد', meaning: 'Striving in the Path of Allah', details: 'The greater struggle is against one\'s base ego and desires (Jihad al-Nafs); the lesser is defending faith and oppressed humans against tyranny.' },
  { name: 'Amr bil-Ma\'ruf', arabic: 'الأمر بالمعروف', meaning: 'Enjoining the Good', details: 'Encouraging society, family, and friends toward virtue, kindness, truth, and righteous deeds.' },
  { name: 'Nahi \'anil-Munkar', arabic: 'النهي عن المنكر', meaning: 'Forbidding Evil', details: 'Standing against injustice, oppression, dishonesty, and sinful practices with wisdom.' },
  { name: 'Tawalla', arabic: 'التولي', meaning: 'Loving the Prophet & Ahlul Bayt', details: 'Showing active love, allegiance, and devotion to Prophet Muhammad (S.A.W.) and his purified progeny.' },
  { name: 'Tabarra', arabic: 'التبري', meaning: 'Dissociating from Enemies of Ahlul Bayt', details: 'Distancing oneself from and rejecting the cruelty of tyrants and oppressors throughout history.' }
];

export default function IslamicBasics({ currentUser, scoutId }) {
  const targetScoutId = scoutId || currentUser?.uid;
  const isOwner = currentUser?.role === 'owner' || currentUser?.isOwner || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'assistant_leader' || !!currentUser?.leaderPosition;
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;
  
  // Navigation tabs: 'roots' | 'branches' | 'infallibles' | 'karbala' | 'duas' | 'tracker'
  const [activeTab, setActiveTab] = useState('karbala');
  
  // Search & filter states
  const [karbalaSearch, setKarbalaSearch] = useState('');
  const [infallibleSearch, setInfallibleSearch] = useState('');
  const [selectedInfallible, setSelectedInfallible] = useState(null);
  const [selectedKarbalaChar, setSelectedKarbalaChar] = useState(null);
  const [duaFilter, setDuaFilter] = useState('all');
  const [trackerCategory, setTrackerCategory] = useState('all');
  
  // Progress tracker states
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [tempDates, setTempDates] = useState({});

  // Real-time subscription to scout's islamic progress
  useEffect(() => {
    if (!targetScoutId) {
      setLoading(false);
      return;
    }
    const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setProgress(snap.data() || {});
      } else {
        setProgress({});
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to load Islamic progress:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [targetScoutId]);

  // Toggle handler for circular checkbox with optimistic update
  const handleToggleTopic = async (topicId) => {
    if (!targetScoutId) return;
    const existing = progress[topicId] || {};
    const isCompleted = !!existing.completed;
    const isPending = !!existing.pending && !isCompleted;
    const dateVal = tempDates[topicId] || existing.completedDate || existing.submittedDate || new Date().toISOString().split('T')[0];

    const newCompleted = !isCompleted;
    const updatedData = isLeaderOrOwner
      ? {
          completed: newCompleted,
          pending: false,
          completedDate: newCompleted ? dateVal : '',
          approvedBy: newCompleted ? (currentUser?.uid || 'leader') : '',
          approvedByName: newCompleted ? (currentUser?.fullName || currentUser?.username || 'Leader') : ''
        }
      : {
          completed: false,
          pending: !isPending,
          submittedDate: !isPending ? dateVal : '',
          updatedBy: currentUser?.uid || 'scout',
          updatedByName: currentUser?.fullName || currentUser?.username || 'Scout'
        };

    setProgress(prev => ({
      ...prev,
      [topicId]: { ...prev[topicId], ...updatedData }
    }));

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, {
        [topicId]: updatedData
      }, { merge: true });
    } catch (err) {
      console.error("Failed to toggle topic status:", err);
      setProgress(prev => ({ ...prev, [topicId]: existing }));
    }
  };

  const handleToggleSubmitScout = async (topicId) => {
    await handleToggleTopic(topicId);
  };

  const handleApproveLeader = async (topicId) => {
    if (!targetScoutId) return;
    const existing = progress[topicId] || {};
    const isCompleted = !!existing.completed;
    const newCompleted = !isCompleted;
    const dateVal = tempDates[topicId] || existing.completedDate || new Date().toISOString().split('T')[0];

    const updatedData = {
      completed: newCompleted,
      pending: false,
      completedDate: newCompleted ? dateVal : '',
      approvedBy: newCompleted ? (currentUser?.uid || 'leader') : '',
      approvedByName: newCompleted ? (currentUser?.fullName || currentUser?.username || 'Leader') : ''
    };

    setProgress(prev => ({
      ...prev,
      [topicId]: { ...prev[topicId], ...updatedData }
    }));

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, {
        [topicId]: updatedData
      }, { merge: true });
    } catch (err) {
      console.error("Failed to approve topic:", err);
      setProgress(prev => ({ ...prev, [topicId]: existing }));
    }
  };

  const handleResetTopic = async (topicId) => {
    if (!targetScoutId) return;
    if (!window.confirm("Are you sure you want to reset this topic status?")) return;
    const existing = progress[topicId] || {};
    const resetData = {
      completed: false,
      pending: false,
      completedDate: '',
      submittedDate: '',
      approvedBy: '',
      approvedByName: ''
    };

    setProgress(prev => ({
      ...prev,
      [topicId]: resetData
    }));

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, {
        [topicId]: resetData
      }, { merge: true });
    } catch (err) {
      console.error("Failed to reset topic:", err);
      setProgress(prev => ({ ...prev, [topicId]: existing }));
    }
  };

  const totalTopics = ISLAMIC_BASICS_TOPICS.length;
  const completedTopicsCount = ISLAMIC_BASICS_TOPICS.filter(t => progress[t.id]?.completed).length;
  const pendingTopicsCount = ISLAMIC_BASICS_TOPICS.filter(t => progress[t.id]?.pending && !progress[t.id]?.completed).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  // Filtered topics for Curriculum Tracker
  const filteredTopics = ISLAMIC_BASICS_TOPICS.filter(topic => {
    if (trackerCategory === 'all') return true;
    if (trackerCategory === 'belief') return topic.category === 'Belief & Practice';
    if (trackerCategory === 'fiqh') return topic.category === 'Ritual Law (Fiqh)';
    if (trackerCategory === 'akhlaq') return topic.category === 'Ethics & Character (Akhlaq)';
    if (trackerCategory === 'karbala') return topic.category === 'Karbala Heroes & Personalities';
    if (trackerCategory === 'duas') return topic.category === 'Post-Prayer Ta\'qibat & Duas';
    return true;
  });

  // Filtered Karbala Characters
  const filteredKarbala = KARBALA_CHARACTERS_DATA.filter(c => {
    const q = karbalaSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
  });

  // Filtered Infallibles
  const filteredInfallibles = INFALLIBLES_FULL_BIOGRAPHIES.filter(inf => {
    const q = infallibleSearch.toLowerCase();
    return inf.name.toLowerCase().includes(q) || inf.title.toLowerCase().includes(q) || inf.kunya.toLowerCase().includes(q) || inf.arabic.includes(q);
  });

  // Filtered Duas & Ta'qibat
  const filteredDuas = TAQIBAT_AND_DUAS_DATA.filter(dua => {
    if (duaFilter === 'all') return true;
    if (duaFilter === 'taqibat') return dua.category.includes('Post-Salat');
    if (duaFilter === 'supplications') return dua.category.includes('Major');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                🕌 Shia Islamic Comprehensive Curriculum
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                🏴 Karbala Youth Theme
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Islamic Shia Basics & Karbala Library</span>
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Explore authentic biographies of the 14 Infallibles, hero profiles from the Tragedy of Karbala, post-Salat Ta'qibat & sacred supplications, and test scout knowledge in real-time.
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 shrink-0 flex items-center gap-4">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Curriculum</span>
              <span className="text-2xl font-black text-emerald-400">{completedTopicsCount}/{totalTopics}</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-750"></div>
            <div className="text-center">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Mastery</span>
              <span className="text-2xl font-black text-amber-400">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-750 pb-2">
        <button
          onClick={() => setActiveTab('karbala')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'karbala'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 border border-amber-400/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <Flame size={15} className="text-amber-300" />
          <span>⚔️ Karbala Heroes & Personalities ({KARBALA_CHARACTERS_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('duas')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'duas'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <Heart size={15} className="text-emerald-300" />
          <span>🤲 Duas & Post-Salat Ta'qibat ({TAQIBAT_AND_DUAS_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('infallibles')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'infallibles'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-indigo-400/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <Sparkles size={15} className="text-indigo-300" />
          <span>👑 14 Infallibles Biographies ({INFALLIBLES_FULL_BIOGRAPHIES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'tracker'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40 border border-sky-400/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <CheckCircle2 size={15} className="text-sky-300" />
          <span>📊 Knowledge Check & Tracker ({totalTopics})</span>
          {pendingTopicsCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingTopicsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('roots')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'roots'
              ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <Star size={15} className="text-emerald-400" />
          <span>Usul al-Din (Roots)</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'branches'
              ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <BookOpen size={15} className="text-emerald-400" />
          <span>Furu al-Din (Branches)</span>
        </button>
      </div>

      {/* ──────────────── TAB 1: KARBALA HEROES & CHARACTERS ──────────────── */}
      {activeTab === 'karbala' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-950/40 via-amber-950/20 to-slate-900 border border-amber-600/30 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="text-amber-400" size={20} />
                  <span>Personalities & Heroes of Karbala (شخصيات كربلاء)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Authentic Shia historical records of the martyrs, companions, women, and youth who stood with Imam Husayn (A.S.) in 61 AH.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search heroes (e.g. Abbas, Hurr, John)..."
                  value={karbalaSearch}
                  onChange={(e) => setKarbalaSearch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKarbala.map((char) => {
              const isSelected = selectedKarbalaChar === char.id;
              return (
                <div
                  key={char.id}
                  className={`bg-slate-800/90 border transition rounded-2xl p-5 flex flex-col justify-between ${
                    isSelected ? 'border-amber-500 ring-1 ring-amber-500/50 bg-slate-800' : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          {char.role}
                        </span>
                        <h4 className="text-base font-extrabold text-white">{char.name}</h4>
                        <p className="text-xs font-serif text-amber-200/90 italic">{char.title}</p>
                      </div>
                      <span className="text-[10px] bg-slate-900 border border-slate-750 text-slate-400 px-2 py-1 rounded font-mono shrink-0">
                        {char.life}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {char.summary}
                    </p>

                    {char.famousSaying && (
                      <div className="bg-amber-950/20 border-l-2 border-amber-500 p-2.5 rounded-r-lg text-xs text-amber-100 font-serif">
                        <Quote size={12} className="inline mr-1 text-amber-400" />
                        {char.famousSaying}
                      </div>
                    )}

                    {isSelected && (
                      <div className="pt-3 border-t border-slate-700 space-y-3 animate-fadeIn">
                        <div>
                          <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Scroll size={12} /> Authentic Biography (Maqtal Record)
                          </h5>
                          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {char.biography}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg">
                          <MapPin size={14} className="text-emerald-400 shrink-0" />
                          <span><strong>Resting Place:</strong> {char.burial}</span>
                        </div>

                        <div>
                          <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Award size={12} /> Key Character Lessons for Scouts
                          </h5>
                          <ul className="space-y-1">
                            {char.keyLessons.map((les, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{les}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-750/60 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedKarbalaChar(isSelected ? null : char.id)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
                    >
                      {isSelected ? (
                        <><span>Show Less</span> <ChevronUp size={14} /></>
                      ) : (
                        <><span>Read Full Biography & Lessons</span> <ChevronDown size={14} /></>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('tracker');
                        setTrackerCategory('karbala');
                      }}
                      className="text-[11px] bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck size={12} /> Test Knowledge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: POST-SALAT TA'QIBAT & DUAS ──────────────── */}
      {activeTab === 'duas' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950/50 via-teal-950/20 to-slate-900 border border-emerald-600/30 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="text-emerald-400" size={20} />
                  <span>Post-Prayer Ta'qibat & Sacred Duas (تعقيبات الصلاة والأدعية)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Authentic supplications from Mafatih al-Jinan with full Arabic text, transliteration, and English translation.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDuaFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    duaFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All ({TAQIBAT_AND_DUAS_DATA.length})
                </button>
                <button
                  onClick={() => setDuaFilter('taqibat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    duaFilter === 'taqibat' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  5 Daily Ta'qibat
                </button>
                <button
                  onClick={() => setDuaFilter('supplications')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    duaFilter === 'supplications' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Major Duas
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDuas.map((dua) => (
              <div key={dua.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {dua.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{dua.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 px-3 py-1 rounded-lg">
                    <Clock size={13} />
                    <span>{dua.timing}</span>
                  </div>
                </div>

                {/* Arabic Text Block */}
                <div className="bg-slate-900 border border-slate-750 rounded-xl p-4 text-right">
                  <p className="text-lg md:text-xl font-serif text-emerald-300 leading-loose tracking-wide dir-rtl" style={{ direction: 'rtl' }}>
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="bg-slate-850/60 border border-slate-750 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phonetic Transliteration
                  </span>
                  <p className="text-xs text-amber-200/90 font-mono leading-relaxed">
                    {dua.transliteration}
                  </p>
                </div>

                {/* English Translation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    English Translation
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {dua.translation}
                  </p>
                </div>

                {/* Spiritual Significance */}
                <div className="bg-emerald-950/20 border-l-2 border-emerald-500 p-3 rounded-r-xl text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Merits & Hadith:</strong> {dua.significance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: 14 INFALLIBLES BIOGRAPHIES ──────────────── */}
      {activeTab === 'infallibles' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-600/30 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-indigo-400" size={20} />
                  <span>The 14 Infallibles (Al-Ma'sumeen A.S. - المعصومون الأربعة عشر)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Comprehensive Shia biographies from Kitab al-Irshad, Al-Kafi, and authentic historical Hadith.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Infallibles (e.g. Sajjad, Rida, Baqir)..."
                  value={infallibleSearch}
                  onChange={(e) => setInfallibleSearch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInfallibles.map((inf) => {
              const isSelected = selectedInfallible === inf.id;
              return (
                <div
                  key={inf.id}
                  className={`bg-slate-800/90 border transition rounded-2xl p-5 flex flex-col justify-between ${
                    isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-slate-800' : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-extrabold flex items-center justify-center text-sm shrink-0">
                          {inf.number}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{inf.name}</h4>
                          <p className="text-xs font-serif text-emerald-300/90 mt-0.5">{inf.arabic}</p>
                          <p className="text-xs text-slate-400 mt-0.5 italic">{inf.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-750 text-slate-300">
                      <div><span className="text-slate-400">Kunya:</span> <strong className="text-white">{inf.kunya}</strong></div>
                      <div><span className="text-slate-400">Mother:</span> <strong className="text-white">{inf.mother}</strong></div>
                      <div className="col-span-2"><span className="text-slate-400">Birth:</span> {inf.birth}</div>
                      <div className="col-span-2"><span className="text-slate-400">Martyrdom:</span> {inf.martyrdom}</div>
                      <div className="col-span-2"><span className="text-slate-400">Shrine:</span> <strong className="text-emerald-400">{inf.burial}</strong></div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {inf.lifeSummary}
                    </p>

                    {isSelected && (
                      <div className="pt-3 border-t border-slate-700 space-y-3 animate-fadeIn">
                        <div>
                          <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Star size={12} /> Major Historic Achievements & Contributions
                          </h5>
                          <ul className="space-y-1">
                            {inf.majorContributions.map((c, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Quote size={12} /> Famous Hadiths & Divine Sayings
                          </h5>
                          <div className="space-y-1.5">
                            {inf.famousSayings.map((s, i) => (
                              <div key={i} className="bg-amber-950/20 border-l-2 border-amber-500 p-2 rounded-r-lg text-xs text-amber-100 italic font-serif">
                                {s}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-750/60 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedInfallible(isSelected ? null : inf.id)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
                    >
                      {isSelected ? (
                        <><span>Show Less</span> <ChevronUp size={14} /></>
                      ) : (
                        <><span>Read Full Biography & Sayings</span> <ChevronDown size={14} /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: CURRICULUM & KNOWLEDGE CHECK TRACKER ──────────────── */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Tracker Header & Filters */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-400" size={20} />
                  <span>Curriculum Topics & Knowledge Check Tracker</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Test, check off, and verify scout knowledge across all Shia Islamic curriculum modules.
                </p>
              </div>

              {/* Progress Summary */}
              <div className="bg-slate-900 border border-slate-750 rounded-xl px-4 py-2 flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold uppercase">Progress</span>
                <span className="text-sm font-extrabold text-emerald-400">{completedTopicsCount} / {totalTopics} Completed</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-750">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-750/60">
              {[
                { id: 'all', label: 'All Topics', count: totalTopics },
                { id: 'karbala', label: '⚔️ Karbala Heroes Check', count: ISLAMIC_BASICS_TOPICS.filter(t => t.category === 'Karbala Heroes & Personalities').length },
                { id: 'duas', label: '🤲 Duas & Ta\'qibat', count: ISLAMIC_BASICS_TOPICS.filter(t => t.category === 'Post-Prayer Ta\'qibat & Duas').length },
                { id: 'belief', label: 'Belief & Practice', count: ISLAMIC_BASICS_TOPICS.filter(t => t.category === 'Belief & Practice').length },
                { id: 'fiqh', label: 'Ritual Law (Fiqh)', count: ISLAMIC_BASICS_TOPICS.filter(t => t.category === 'Ritual Law (Fiqh)').length },
                { id: 'akhlaq', label: 'Ethics & Akhlaq', count: ISLAMIC_BASICS_TOPICS.filter(t => t.category === 'Ethics & Character (Akhlaq)').length }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setTrackerCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    trackerCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-750 border border-slate-750'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full font-mono">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Topics List Accordion */}
          <div className="space-y-3">
            {filteredTopics.map((topic) => {
              const topicProg = progress[topic.id] || {};
              const isCompleted = !!topicProg.completed;
              const isPending = !!topicProg.pending && !isCompleted;
              const completedDate = topicProg.completedDate || '';
              const submittedDate = topicProg.submittedDate || '';
              const isExpanded = expandedTopic === topic.id;

              return (
                <div
                  key={topic.id}
                  className={`bg-slate-800/90 border rounded-2xl transition overflow-hidden shadow-sm ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-emerald-950/15'
                      : isPending
                      ? 'border-amber-500/40 bg-amber-950/15'
                      : 'border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-750/30 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Circular Toggle Button with e.stopPropagation() */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTopic(topic.id);
                        }}
                        className="shrink-0 p-1 hover:scale-110 transition cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        title={
                          isCompleted
                            ? 'Approved & Completed (Click to reset)'
                            : isPending
                            ? 'Pending Leader Approval (Click to cancel)'
                            : isLeaderOrOwner
                            ? 'Click to Approve / Mark Complete'
                            : 'Click to Submit to Leader'
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="text-emerald-400" size={22} />
                        ) : isPending ? (
                          <Clock className="text-amber-400 animate-pulse" size={22} />
                        ) : (
                          <Circle className="text-slate-500 hover:text-emerald-400" size={22} />
                        )}
                      </button>

                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white flex items-center gap-2 flex-wrap">
                          <span>{topic.title}</span>
                          <span className="text-[9px] bg-slate-900 border border-slate-750 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {topic.category}
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {isCompleted && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                          <CheckCircle2 size={11} /> Approved {completedDate ? `(${completedDate})` : ''}
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                          <Clock size={11} /> Pending {submittedDate ? `(${submittedDate})` : ''}
                        </span>
                      )}
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-750/40 space-y-4 bg-slate-900/20">
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {topic.text}
                      </p>

                      {/* Complete Form panel */}
                      <div className="border-t border-slate-750/60 pt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Calendar size={12} /> {isCompleted ? 'Approved Date' : 'Completion Date'}
                          </label>
                          <input
                            type="date"
                            value={tempDates[topic.id] || completedDate || submittedDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setTempDates(prev => ({ ...prev, [topic.id]: e.target.value }))}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                          />
                        </div>

                        <div className="flex gap-2">
                          {isScout && (
                            <button
                              onClick={() => handleToggleSubmitScout(topic.id)}
                              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                                isPending
                                  ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40'
                                  : isCompleted
                                  ? 'opacity-60 cursor-not-allowed bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                              disabled={isCompleted}
                            >
                              {isPending ? 'Cancel Submission' : isCompleted ? 'Approved ✓' : 'Submit to Leader'}
                            </button>
                          )}

                          {isLeaderOrOwner && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveLeader(topic.id)}
                                className={`text-xs px-4 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                                  isCompleted
                                    ? 'bg-emerald-700/40 text-emerald-300 hover:bg-red-900/40 hover:text-red-300 border border-emerald-600/30'
                                    : isPending
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 animate-pulse'
                                    : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                                }`}
                              >
                                <CheckCircle2 size={12} /> {isCompleted ? 'Approved ✓' : isPending ? 'Approve Topic' : 'Mark Tested / Sign-off'}
                              </button>
                              {(isCompleted || isPending) && (
                                <button
                                  onClick={() => handleResetTopic(topic.id)}
                                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 5: USUL AL-DIN (ROOTS) ──────────────── */}
      {activeTab === 'roots' && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Star className="text-emerald-400" size={20} />
              <span>Usul al-Din (أصول الدين - The 5 Roots of Religion)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              These are the foundational theological beliefs every Muslim must understand and accept through personal reason and reflection (Tafakkur). Taqleed (blind following) is not permitted in Usul al-Din.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USUL_AL_DIN.map((root, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-white">{root.name}</h4>
                  <span className="text-sm font-serif text-emerald-400 font-bold">{root.arabic}</span>
                </div>
                <p className="text-xs text-amber-300 font-semibold">{root.meaning}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{root.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 6: FURU AL-DIN (BRANCHES) ──────────────── */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="text-emerald-400" size={20} />
              <span>Furu al-Din (فروع الدين - The 10 Branches of Practice)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              These are the essential practical obligations and acts of worship in Shia Islam. Believers follow the practical rulings (Fatwas) of their chosen Marja' al-Taqlid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FURU_AL_DIN.map((branch, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-white">{idx + 1}. {branch.name}</h4>
                  <span className="text-sm font-serif text-emerald-400 font-bold">{branch.arabic}</span>
                </div>
                <p className="text-xs text-amber-300 font-semibold">{branch.meaning}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{branch.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
