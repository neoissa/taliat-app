import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import { BookOpen, Star, Sparkles, Heart, HelpCircle, Shield, Award, Calendar, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const USUL_AL_DIN = [
  {
    name: 'Tawhid (Monotheism)',
    arabic: 'التوحيد',
    meaning: 'Belief in the Oneness of God',
    description: 'There is only one God (Allah) who is the Creator, Sustainer, and Ruler of the universe. He has no partners, equals, or children. He is Eternal, All-Powerful, and All-Knowing.'
  },
  {
    name: 'Adl (Divine Justice)',
    arabic: 'العدل',
    meaning: 'Belief in the Justice of God',
    description: 'Allah is completely just and fair. He does not commit injustice or oppress anyone. He rewards those who do good and holds accountable those who do bad, based on their intentions and deeds.'
  },
  {
    name: 'Nubuwwah (Prophethood)',
    arabic: 'النبوة',
    meaning: 'Belief in the Prophets',
    description: 'Allah sent 124,000 prophets to guide humanity, starting with Prophet Adam (A.S.) and ending with Prophet Muhammad (S.A.W.). They were infallible, noble role models who carried Allah\'s divine message.'
  },
  {
    name: 'Imamah (Divine Leadership)',
    arabic: 'الإمامة',
    meaning: 'Belief in the Imams of Ahlul Bayt',
    description: 'Shia Muslims believe that after Prophet Muhammad (S.A.W.), Allah appointed 12 infallible leaders (Imams) from the Prophet\'s lineage (Ahlul Bayt) to guide and protect the religion, starting with Imam Ali (A.S.) and ending with Imam al-Mahdi (A.T.F.S.).'
  },
  {
    name: 'Ma\'ad (Resurrection)',
    arabic: 'المعاد',
    meaning: 'Belief in the Day of Judgement',
    description: 'All humans will be resurrected by Allah on the Day of Judgement to face accountability for their actions. Those who did righteous deeds will enter Paradise (Jannah), and those who did evil deeds will be judged accordingly.'
  }
];

const FURU_AL_DIN = [
  { name: 'Salah', arabic: 'الصلاة', meaning: 'The Five Daily Prayers', details: 'Performing the ritual daily prayers to remember Allah and maintain spiritual connection.' },
  { name: 'Sawm', arabic: 'الصوم', meaning: 'Fasting in Ramadan', details: 'Abstaining from food, drink, and sins from dawn until sunset to build self-discipline and empathy.' },
  { name: 'Hajj', arabic: 'الحج', meaning: 'Pilgrimage to Mecca', details: 'Performing the pilgrimage to the Kaaba at least once in a lifetime, if physically and financially capable.' },
  { name: 'Zakah', arabic: 'الزكاة', meaning: 'Almsgiving (Charity)', details: 'Giving a fixed portion of wealth to support the needy and purify assets.' },
  { name: 'Khums', arabic: 'الخمس', meaning: 'The One-Fifth Tax', details: 'Giving 20% of annual surplus savings, split between supporting descendants of the Prophet (Sadaat) and supporting Islamic education (Sahm-al-Imam).' },
  { name: 'Jihad', arabic: 'الجهاد', meaning: 'Striving in Allah\'s Way', details: 'The greater struggle is against one\'s own bad desires (Jihad al-Nafs); the lesser is defending the oppressed and faith (Jihad al-Asghar).' },
  { name: 'Amr bil-Ma\'ruf', arabic: 'الأمر بالمعروف', meaning: 'Enjoining Good', details: 'Encouraging others to perform good deeds and act righteously.' },
  { name: 'Nahi \'anil-Munkar', arabic: 'النهي عن المنكر', meaning: 'Forbidding Evil', details: 'Discouraging others from committing sins, injustice, and harmful actions.' },
  { name: 'Tawalla', arabic: 'التولي', meaning: 'Loving Ahlul Bayt', details: 'Loving and showing loyalty to Prophet Muhammad (S.A.W.) and his pure family (Ahlul Bayt).' },
  { name: 'Tabarra', arabic: 'التبري', meaning: 'Dissociating from Enemies of Ahlul Bayt', details: 'Distancing oneself from and rejecting the actions of those who oppressed the Ahlul Bayt and stood against justice.' }
];

const INFALLIBLES = [
  { number: 1, name: 'Prophet Muhammad (S.A.W.)', title: 'Al-Mustafa (The Chosen)', life: '570 - 632 CE', note: 'The Seal of the Prophets and the Messenger of Allah.' },
  { number: 2, name: 'Imam Ali (A.S.)', title: 'Al-Murtadha (The Well-Pleased) / Amir al-Mu\'minin', life: '600 - 661 CE', note: 'The first Imam, son-in-law, and successor of the Prophet.' },
  { number: 3, name: 'Sayyida Fatima al-Zahra (A.S.)', title: 'Sayyidat Nisa al-Alamin (Leader of Women)', life: '615 - 632 CE', note: 'The beloved daughter of the Prophet and wife of Imam Ali.' },
  { number: 4, name: 'Imam Hasan al-Mujtaba (A.S.)', title: 'Al-Mujtaba (The Chosen)', life: '624 - 670 CE', note: 'The second Imam, known for his generosity and peace treaty.' },
  { number: 5, name: 'Imam Husayn al-Shahid (A.S.)', title: 'Sayyid al-Shuhada (Master of Martyrs)', life: '626 - 680 CE', note: 'The third Imam, who stood against tyranny at Karbala.' },
  { number: 6, name: 'Imam Ali al-Sajjad (A.S.)', title: 'Zayn al-Abidin (Ornament of Worshippers)', life: '659 - 713 CE', note: 'The fourth Imam, author of Sahifa al-Sajjadiyya supplications.' },
  { number: 7, name: 'Imam Muhammad al-Baqir (A.S.)', title: 'Baqir al-Ulum (Splitter of Knowledge)', life: '677 - 733 CE', note: 'The fifth Imam, who systematically spread Islamic sciences.' },
  { number: 8, name: 'Imam Ja\'far al-Sadiq (A.S.)', title: 'Al-Sadiq (The Truthful)', life: '702 - 765 CE', note: 'The sixth Imam, founder of the Ja\'fari school of jurisprudence.' },
  { number: 9, name: 'Imam Musa al-Kadhim (A.S.)', title: 'Al-Kadhim (The Restrainer of Anger)', life: '745 - 799 CE', note: 'The seventh Imam, known for his patience and long imprisonments.' },
  { number: 10, name: 'Imam Ali al-Rida (A.S.)', title: 'Al-Rida (The Pleasing)', life: '765 - 818 CE', note: 'The eighth Imam, buried in Mashhad, Iran.' },
  { number: 11, name: 'Imam Muhammad al-Taqi (A.S.)', title: 'Al-Jawad (The Generous)', life: '811 - 835 CE', note: 'The ninth Imam, who assumed leadership at a very young age.' },
  { number: 12, name: 'Imam Ali al-Naqi (A.S.)', title: 'Al-Hadi (The Guide)', life: '829 - 868 CE', note: 'The tenth Imam, composer of Ziyarat al-Jami\'ah al-Kabirah.' },
  { number: 13, name: 'Imam Hasan al-Askari (A.S.)', title: 'Al-Askari (The Soldier)', life: '846 - 874 CE', note: 'The eleventh Imam, kept under surveillance in Samarra, Iraq.' },
  { number: 14, name: 'Imam Muhammad al-Mahdi (A.T.F.S.)', title: 'Al-Qaim (The Riser) / Al-Muntadhar (The Awaited)', life: '869 CE - Present', note: 'The twelfth Imam, currently in occultation (Ghaybah) by Allah\'s command.' }
];

export default function IslamicBasics({ currentUser, scoutId }) {
  const targetScoutId = scoutId || currentUser?.uid;
  const isLeaderOrOwner = currentUser?.role === 'leader' || currentUser?.role === 'owner';
  
  const [activeTab, setActiveTab] = useState('roots'); // 'roots' | 'branches' | 'infallibles' | 'duas' | 'tracker'
  
  // Progress tracker states
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [tempDates, setTempDates] = useState({});

  // 1. Subscribe to scout's islamic progress
  useEffect(() => {
    if (!targetScoutId) {
      setLoading(false);
      return;
    }
    const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setProgress(snap.data());
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

  // Scout submits topic -> marks pending (yellow)
  const handleToggleSubmitScout = async (topicId) => {
    if (!targetScoutId) return;
    const existing = progress[topicId] || {};
    if (existing.completed) return; // Scout cannot alter approved topic

    const isPending = !!existing.pending;
    const newPending = !isPending;
    const dateVal = tempDates[topicId] || new Date().toISOString().split('T')[0];

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, {
        [topicId]: {
          completed: false,
          pending: newPending,
          submittedDate: newPending ? dateVal : '',
          updatedBy: currentUser?.uid || 'scout',
          updatedByName: currentUser?.fullName || currentUser?.username || 'Scout'
        }
      }, { merge: true });
    } catch (err) {
      console.error("Failed to submit topic:", err);
    }
  };

  // Leader approves topic -> marks complete & approved (green)
  const handleApproveLeader = async (topicId) => {
    if (!targetScoutId) return;
    const existing = progress[topicId] || {};
    const isCompleted = !!existing.completed;
    const newCompleted = !isCompleted;
    const dateVal = tempDates[topicId] || new Date().toISOString().split('T')[0];

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, {
        [topicId]: {
          completed: newCompleted,
          pending: false,
          completedDate: newCompleted ? dateVal : '',
          approvedBy: newCompleted ? (currentUser?.uid || 'leader') : '',
          approvedByName: newCompleted ? (currentUser?.fullName || currentUser?.username || 'Leader') : ''
        }
      }, { merge: true });
    } catch (err) {
      console.error("Failed to approve topic:", err);
    }
  };

  const handleResetTopic = async (topicId) => {
    if (!targetScoutId) return;
    if (!window.confirm("Are you sure you want to reset this topic status?")) return;
    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, {
        [topicId]: {
          completed: false,
          pending: false,
          completedDate: '',
          submittedDate: ''
        }
      }, { merge: true });
    } catch (err) {
      console.error("Failed to reset topic:", err);
    }
  };

  const totalTopics = ISLAMIC_BASICS_TOPICS.length;
  const completedTopicsCount = ISLAMIC_BASICS_TOPICS.filter(t => progress[t.id]?.completed).length;
  const pendingTopicsCount = ISLAMIC_BASICS_TOPICS.filter(t => progress[t.id]?.pending && !progress[t.id]?.completed).length;
  const percentage = Math.round((completedTopicsCount / totalTopics) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <BookOpen size={120} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-amber-400" size={24} />
            Islamic Shia Basics
          </h2>
          <p className="text-xs text-slate-350 mt-1.5 leading-relaxed">
            Welcome to the Islamic Shia basics library! Explore the core roots of belief (Usul al-Din), the branches of practice (Furu al-Din), the biographies of the 14 Infallibles, and supplications. Track your learning progress through essential Shia topics.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-750 max-w-2xl">
        <button
          onClick={() => setActiveTab('roots')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeTab === 'roots'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-450 hover:text-slate-200 border border-transparent'
          }`}
        >
          Usul al-Din (Roots)
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeTab === 'branches'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-450 hover:text-slate-200 border border-transparent'
          }`}
        >
          Furu al-Din (Branches)
        </button>
        <button
          onClick={() => setActiveTab('infallibles')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeTab === 'infallibles'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-455 hover:text-slate-200 border border-transparent'
          }`}
        >
          14 Infallibles
        </button>
        <button
          onClick={() => setActiveTab('duas')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeTab === 'duas'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-455 hover:text-slate-200 border border-transparent'
          }`}
        >
          Duas
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeTab === 'tracker'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-455 hover:text-slate-200 border border-transparent'
          }`}
        >
          Topics Tracker
        </button>
      </div>

      {/* Roots View */}
      {activeTab === 'roots' && (
        <div className="space-y-4">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award size={16} className="text-emerald-400" />
              Usul al-Din (Roots of Religion)
            </h3>
            <p className="text-[11px] text-slate-450 mt-0.5">The 5 core pillars of belief in Shia theology. A scout must understand and embrace these fundamentals.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {USUL_AL_DIN.map((item, index) => (
              <div key={item.name} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow space-y-2 hover:border-slate-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{index + 1}. {item.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">{item.meaning}</span>
                  </div>
                  <span className="text-base text-amber-400 font-serif" dir="rtl">{item.arabic}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-750">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branches View */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award size={16} className="text-emerald-400" />
              Furu al-Din (Branches of Religion)
            </h3>
            <p className="text-[11px] text-slate-450 mt-0.5">The 10 practical actions and acts of worship required of a practicing Shia Muslim.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FURU_AL_DIN.map((item, index) => (
              <div key={item.name} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow space-y-2 hover:border-slate-650 transition flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-white">{index + 1}. {item.name}</h4>
                    <span className="text-sm text-amber-400 font-serif" dir="rtl">{item.arabic}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.meaning}</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1.5 border-t border-slate-750">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Infallibles View */}
      {activeTab === 'infallibles' && (
        <div className="space-y-4">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award size={16} className="text-emerald-400" />
              The 14 Infallibles (Ma'sumeen)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Those appointed by Allah who are free from sin and error, acting as beacons of complete guidance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INFALLIBLES.map((inf) => (
              <div key={inf.number} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-2 hover:border-emerald-500/30 transition relative overflow-hidden">
                <div className="absolute right-2 top-2 w-6 h-6 bg-slate-900/60 border border-slate-700 rounded-full flex items-center justify-center text-[9px] font-bold text-amber-400">
                  #{inf.number}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white pr-6">{inf.name}</h4>
                  <span className="text-[9px] bg-slate-900 border border-slate-700 text-amber-400/90 px-1.5 py-0.5 rounded font-semibold inline-block mt-1">
                    {inf.title}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1.5 border-t border-slate-750/60">
                  <span>Life: <strong>{inf.life}</strong></span>
                </div>
                <p className="text-[10px] text-slate-300 italic leading-relaxed font-serif">
                  "{inf.note}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duas View */}
      {activeTab === 'duas' && (
        <div className="space-y-6">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award size={16} className="text-emerald-400" />
              Supplications & Supplications (Duas)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Essential supplications and narrations commonly recited by Shia youth.</p>
          </div>

          {/* Dua Faraj (Imam Mahdi A.T.F.S.) */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-750 pb-2 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Dua Faraj (Allahumma Kun Li-Waliyyik)</h4>
                <p className="text-[10px] text-slate-400">Prayer for the protection and hastening of the reappearance of Imam al-Mahdi (A.T.F.S.)</p>
              </div>
              <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-semibold">
                Highly Recommended
              </span>
            </div>

            {/* Arabic Script */}
            <div className="text-center bg-slate-900/40 py-4 px-3 rounded-lg border border-slate-750" dir="rtl">
              <p className="text-lg text-amber-100 font-serif leading-loose">
                اللَّهُمَّ كُنْ لِوَلِيِّكَ الحُجَّةِ بْنِ الحَسَنِ، صَلَواتُكَ عَلَيْهِ وَعَلَى آبائِهِ، فِي هذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ، وَلِيّاً وَحافِظاً، وَقائِداً وَناصِراً، وَدَلِيلاً وَعَيْناً، حَتَّى تُسْكِنَهُ أَرْضَكَ طَوْعاً، وَتُمَتِّعَهُ فِيها طَوِيلاً.
              </p>
            </div>

            {/* Transliteration */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Transliteration</span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                "Allahumma kun li-waliyyikal Hujjatibnil Hasan, salawatuka 'alayhi wa 'ala aba'ih, fee hazihis sa'ati wa fee kulli sa'ah, waliyyan wa hafiza, wa qa'idan wa nasira, wa daleelan wa 'ayna, hatta tuskinahu arzaka taw'a, wa tumatti'ahu feeha taweela."
              </p>
            </div>

            {/* Translation */}
            <div className="space-y-1 border-t border-slate-750/50 pt-3">
              <span className="text-[10px] font-bold text-slate-455 uppercase block">Translation</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "O Allah, be, for Your representative, the Hujjah (Proof), son of al-Hasan, Your blessings be on him and on his forefathers, in this hour and in every hour, a guardian, a protector, a leader, a helper, a guide, and an eye, until You enable him to dwell on Your earth in obedience and cause him to live in it for a long time."
              </p>
            </div>
          </div>

          {/* Hadith al-Kisa Summary */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Hadith al-Kisa (The Tradition of the Cloak)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              This famous narration details Sayyida Fatima (A.S.) welcoming her father, Prophet Muhammad (S.A.W.), her husband Imam Ali (A.S.), and her sons Imam Hasan (A.S.) and Imam Husayn (A.S.) under a Yemeni cloak (Kisa).
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once gathered, Allah sent Angel Jibra'il to reveal Ayat al-Tathir (The Verse of Purification):
              <strong className="text-amber-100 block my-2 text-center text-sm font-serif font-normal" dir="rtl">
                "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا"
              </strong>
              <span className="italic block text-center text-[11px] text-slate-400">
                "Indeed, Allah desires to repel all impurity from you, O People of the Cloak (Ahlul Bayt), and purify you with a thorough purification." (Quran 33:33)
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Topics Tracker & Progress Tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={16} className="text-emerald-400" />
                Islamic Basics Progress Tracker
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Track your understanding of core Shia beliefs, Islamic laws, rituals, and history.</p>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-4 shrink-0 text-xs">
              <div>
                <span className="font-extrabold text-white">{completedTopicsCount} / {totalTopics}</span>
                <span className="text-slate-400 block text-[9px] uppercase">Completed</span>
              </div>
              <div className="w-16 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-750">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="font-black text-emerald-400">{percentage}%</span>
            </div>
          </div>

          {/* List of topics */}
          <div className="space-y-3">
            {ISLAMIC_BASICS_TOPICS.map((topic, index) => {
              const itemProg = progress[topic.id] || {};
              const isCompleted = !!itemProg.completed;
              const isPending = !!itemProg.pending && !isCompleted;
              const isExpanded = expandedTopic === topic.id;
              const completedDate = itemProg.completedDate || '';
              const submittedDate = itemProg.submittedDate || '';
              const isScout = currentUser?.role === 'scout';

              return (
                <div
                  key={topic.id}
                  className={`bg-slate-800 border rounded-2xl overflow-hidden transition ${
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : isPending
                      ? 'border-amber-500/40 bg-amber-950/15'
                      : 'border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-750/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                      ) : isPending ? (
                        <Clock className="text-amber-400 shrink-0 animate-pulse" size={20} />
                      ) : (
                        <Circle className="text-slate-500 hover:text-emerald-400 shrink-0" size={20} />
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-2">
                          <span>{index + 1}. {topic.title}</span>
                          <span className="text-[9px] bg-slate-900 border border-slate-750 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {topic.category}
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {isCompleted && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                          <CheckCircle2 size={11} /> Approved on {completedDate}
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                          <Clock size={11} /> Pending Approval ({submittedDate})
                        </span>
                      )}
                      {isExpanded ? <ChevronUp size={16} className="text-slate-450" /> : <ChevronDown size={16} className="text-slate-455" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-750/40 space-y-4 bg-slate-900/10">
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
                            value={tempDates[topic.id] || new Date().toISOString().split('T')[0]}
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
                                  className="bg-slate-700 hover:bg-slate-655 text-slate-300 text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
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
    </div>
  );
}
