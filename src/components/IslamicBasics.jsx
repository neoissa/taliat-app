import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, onSnapshot, setDoc, getDocs, query, where } from 'firebase/firestore';
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
  Quote,
  User,
  Users,
  Check,
  CheckSquare,
  Send,
  RotateCcw,
  AlertCircle,
  Zap
} from 'lucide-react';

const USUL_AL_DIN = [
  {
    id: 'usul_tawhid',
    name: 'Tawhid (Monotheism)',
    arabic: 'التوحيد',
    meaning: 'Belief in the Absolute Oneness of God',
    description: 'There is only one God (Allah) who is the Creator, Sustainer, and Ruler of the universe. He has no partners, equals, physical form, or children. He is Eternal, All-Powerful, All-Knowing, and beyond human imagination.',
    testPrompt: 'Explain why Allah cannot have partners or a physical body, and recite Surah al-Ikhlas with meaning.'
  },
  {
    id: 'usul_adl',
    name: 'Adl (Divine Justice)',
    arabic: 'العدل',
    meaning: 'Belief in the Justice of God',
    description: 'Allah is completely just and fair. He does not commit injustice, evil, or oppression against anyone. He rewards righteous deeds and holds accountable wrongful actions based on intention, free will, and capacity.',
    testPrompt: 'Explain how human free will relates to divine justice and accountability on the Day of Judgement.'
  },
  {
    id: 'usul_nubuwwah',
    name: 'Nubuwwah (Prophethood)',
    arabic: 'النبوة',
    meaning: 'Belief in the 124,000 Infallible Prophets',
    description: 'Allah sent 124,000 prophets to guide humanity, starting with Prophet Adam (A.S.) and culminating with the Seal of Prophets, Prophet Muhammad (S.A.W.). All prophets were infallible, noble role models protected from sin and error.',
    testPrompt: 'Name the 5 Ulul Azm (Arch-Prophets) and explain what Ismah (infallibility) means.'
  },
  {
    id: 'usul_imamah',
    name: 'Imamah (Divine Leadership)',
    arabic: 'الإمامة',
    meaning: 'Belief in the 12 Infallible Imams of Ahlul Bayt',
    description: 'After Prophet Muhammad (S.A.W.), Allah appointed 12 infallible leaders (Imams) from the Prophet\'s purified household (Ahlul Bayt) to guide and preserve the religion, starting with Imam Ali (A.S.) and concluding with the living 12th Imam, Imam al-Mahdi (A.T.F.S.).',
    testPrompt: 'Recite the names of the 12 Imams in order and explain the event of Ghadir Khumm.'
  },
  {
    id: 'usul_maad',
    name: 'Ma\'ad (Resurrection & Afterlife)',
    arabic: 'المعاد',
    meaning: 'Belief in the Day of Judgement & Accountability',
    description: 'All human beings will be physically and spiritually resurrected on the Day of Judgement (Yawm al-Qiyamah) to face justice. Those who nurtured righteous faith and deeds will enter eternal Paradise (Jannah).',
    testPrompt: 'Describe the stages of Barzakh, physical resurrection, the Scale (Mizan), and Sirat.'
  }
];

const FURU_AL_DIN = [
  { id: 'furu_salah', name: 'Salah', arabic: 'الصلاة', meaning: 'The 5 Daily Obligatory Prayers', details: 'Performing 17 daily rak\'ahs to connect with Allah and purify the soul (Fajr, Dhuhr, Asr, Maghrib, Isha).', testPrompt: 'Demonstrate proper Wudu and demonstrate the 11 obligatory acts of Salat (Rukn & Non-Rukn).' },
  { id: 'furu_sawm', name: 'Sawm', arabic: 'الصوم', meaning: 'Fasting in Holy Ramadan', details: 'Abstaining from food, drink, and spiritual sins from true dawn until Maghrib to develop Taqwa (God-consciousness).', testPrompt: 'List the 9 things that break fasting (Mubtilat al-Sawm) and the spiritual goal of Taqwa.' },
  { id: 'furu_hajj', name: 'Hajj', arabic: 'الحج', meaning: 'Pilgrimage to the Holy Ka\'bah', details: 'Performing the pilgrimage to Makkah once in a lifetime for those with financial, physical, and security capability.', testPrompt: 'Explain the difference between Umrah and Hajj al-Tamattu, and what Ihram represents.' },
  { id: 'furu_zakah', name: 'Zakah', arabic: 'الزكاة', meaning: 'Almsgiving on Specific Assets', details: 'Purifying wealth by giving a prescribed portion on grains, cattle, and precious metals to the poor.', testPrompt: 'Explain the items subject to Zakah and who is eligible to receive it.' },
  { id: 'furu_khums', name: 'Khums', arabic: 'الخمس', meaning: 'The One-Fifth (20%) Annual Obligation', details: 'Giving 20% of annual surplus savings after living expenses, supporting religious education (Sahm al-Imam) and needy descendants (Sahm al-Sadat).', testPrompt: 'Calculate Khums on annual surplus savings and explain Sahm al-Imam vs Sahm al-Sadat.' },
  { id: 'furu_jihad', name: 'Jihad', arabic: 'الجهاد', meaning: 'Striving in the Path of Allah', details: 'The greater struggle is against one\'s base ego and desires (Jihad al-Nafs); the lesser is defending faith and oppressed humans against tyranny.', testPrompt: 'Contrast Jihad al-Akbar (struggle against ego) with defensive military Jihad in Islamic law.' },
  { id: 'furu_amr', name: 'Amr bil-Ma\'ruf', arabic: 'الأمر بالمعروف', meaning: 'Enjoining the Good', details: 'Encouraging society, family, and friends toward virtue, kindness, truth, and righteous deeds.', testPrompt: 'Explain the 4 conditions required before enjoining good on someone else.' },
  { id: 'furu_nahi', name: 'Nahi \'anil-Munkar', arabic: 'النهي عن المنكر', meaning: 'Forbidding Evil', details: 'Standing against injustice, oppression, dishonesty, and sinful practices with wisdom.', testPrompt: 'Explain the 3 progressive stages of forbidding evil (heart/disapproval, verbal, action).' },
  { id: 'furu_tawalla', name: 'Tawalla', arabic: 'التولي', meaning: 'Loving the Prophet & Ahlul Bayt', details: 'Showing active love, allegiance, and devotion to Prophet Muhammad (S.A.W.) and his purified progeny.', testPrompt: 'Recite Ayah al-Mawaddah (42:23) and explain how a scout expresses active Tawalla daily.' },
  { id: 'furu_tabarra', name: 'Tabarra', arabic: 'التبري', meaning: 'Dissociating from Enemies of Ahlul Bayt', details: 'Distancing oneself from and rejecting the cruelty of tyrants and oppressors throughout history.', testPrompt: 'Explain the moral duty to disassociate from oppression, tyranny, and enemies of truth.' }
];

// ── REUSABLE SCOUT CONFIRMATION & LEADER TESTING SIGN-OFF BAR ──
function IslamicTestingBar({
  itemId,
  itemTitle,
  progressEntry = {},
  onToggleSubmitScout,
  onApproveLeader,
  onReset,
  isLeaderOrOwner,
  isScout,
  testPrompt
}) {
  const isCompleted = !!progressEntry.completed;
  const isPending = !!progressEntry.pending && !isCompleted;
  const completedDate = progressEntry.completedDate || '';
  const submittedDate = progressEntry.submittedDate || '';
  const approvedByName = progressEntry.approvedByName || 'Leader / Assistant';

  return (
    <div className={`p-3.5 rounded-2xl border transition-all mt-3 ${
      isCompleted
        ? 'bg-emerald-950/30 border-emerald-500/40'
        : isPending
        ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/20'
        : 'bg-slate-900/60 border-slate-750'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Status & Metadata */}
        <div className="flex items-center gap-2.5">
          <div className="shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="text-emerald-400" size={20} />
            ) : isPending ? (
              <Clock className="text-amber-400 animate-pulse" size={20} />
            ) : (
              <Circle className="text-slate-500" size={20} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Knowledge Testing Status:
              </span>
              {isCompleted && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  ✓ Tested & Approved by {approvedByName} {completedDate ? `(${completedDate})` : ''}
                </span>
              )}
              {isPending && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                  <Clock size={10} /> Submitted on {submittedDate || 'today'} • Ready for Leader Oral/Written Test
                </span>
              )}
              {!isCompleted && !isPending && (
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                  Study in progress • Not yet submitted
                </span>
              )}
            </div>

            {testPrompt && (
              <p className="text-[11px] text-slate-350 mt-1 leading-snug">
                <strong className="text-emerald-400/90 font-semibold">Leader Test Prompt:</strong> {testPrompt}
              </p>
            )}
          </div>
        </div>

        {/* Right: Interactive Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {/* Scout Confirmation Button */}
          {isScout && (
            <button
              type="button"
              onClick={() => onToggleSubmitScout(itemId)}
              disabled={isCompleted}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isPending
                  ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50'
                  : isCompleted
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-default opacity-80'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:scale-[1.02]'
              }`}
            >
              {isPending ? (
                <>
                  <Clock size={13} className="animate-pulse" />
                  <span>Pending Test (Cancel)</span>
                </>
              ) : isCompleted ? (
                <>
                  <Check size={13} />
                  <span>Mastered & Signed</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>✋ I Know This — Submit for Testing</span>
                </>
              )}
            </button>
          )}

          {/* Leader Testing & Sign-off Controls */}
          {isLeaderOrOwner && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onApproveLeader(itemId)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md ${
                  isCompleted
                    ? 'bg-emerald-800/40 text-emerald-300 hover:bg-red-900/40 hover:text-red-300 border border-emerald-600/30'
                    : isPending
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 animate-pulse'
                    : 'bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white'
                }`}
              >
                <CheckCircle2 size={13} />
                <span>{isCompleted ? '✓ Signed (Click to Re-test)' : isPending ? 'Conduct Test & Sign-off ✓' : 'Mark Tested & Sign-off'}</span>
              </button>

              {(isCompleted || isPending) && (
                <button
                  type="button"
                  onClick={() => onReset(itemId)}
                  className="p-1.5 bg-slate-800 hover:bg-red-900/40 hover:text-red-400 text-slate-400 rounded-xl transition cursor-pointer"
                  title="Reset topic status"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IslamicKnowledge({ currentUser, scoutId: propScoutId }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.isOwner || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'assistant_leader' || !!currentUser?.leaderPosition;
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  // Scouts list for Leader dropdown selector
  const [allScouts, setAllScouts] = useState([]);
  const [selectedLeaderScoutId, setSelectedLeaderScoutId] = useState('');

  // Determine active target scout ID
  const targetScoutId = propScoutId || (isLeaderOrOwner ? (selectedLeaderScoutId || currentUser?.uid) : currentUser?.uid);
  
  // Navigation tabs: 'karbala' | 'duas' | 'infallibles' | 'tracker' | 'roots' | 'branches'
  const [activeTab, setActiveTab] = useState('karbala');
  
  // Search & filter states
  const [karbalaSearch, setKarbalaSearch] = useState('');
  const [infallibleSearch, setInfallibleSearch] = useState('');
  const [duaFilter, setDuaFilter] = useState('all');
  const [trackerCategory, setTrackerCategory] = useState('all');

  // Selected item modal / expanded cards
  const [selectedKarbalaChar, setSelectedKarbalaChar] = useState(null);
  const [selectedInfallible, setSelectedInfallible] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);

  // Real-time progress map
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState('');
  const [tempDates, setTempDates] = useState({});

  // 1. Fetch all scouts if Leader/Owner
  useEffect(() => {
    if (!isLeaderOrOwner) return;
    const fetchScouts = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'scout'));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setAllScouts(list);
        if (list.length > 0 && !selectedLeaderScoutId && !propScoutId) {
          setSelectedLeaderScoutId(list[0].uid);
        }
      } catch (err) {
        console.warn("Fallback fetching scouts:", err);
      }
    };
    fetchScouts();
  }, [isLeaderOrOwner]);

  // 2. Real-time Subscription to Scout's Islamic Progress
  useEffect(() => {
    if (!targetScoutId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProgress(docSnap.data() || {});
      } else {
        setProgress({});
      }
      setLoading(false);
    }, (err) => {
      console.warn("Islamic progress listener error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [targetScoutId]);

  const showFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 4000);
  };

  // Toggle submit for scout
  const handleToggleSubmitScout = async (itemId) => {
    if (!targetScoutId) return;
    const existing = progress[itemId] || {};
    const isCompleted = !!existing.completed;
    const isPending = !!existing.pending && !isCompleted;
    const dateVal = new Date().toISOString().split('T')[0];

    const updatedData = {
      completed: false,
      pending: !isPending,
      submittedDate: !isPending ? dateVal : '',
      scoutUid: currentUser?.uid || 'scout',
      scoutName: currentUser?.fullName || currentUser?.username || 'Scout'
    };

    setProgress(prev => ({ ...prev, [itemId]: { ...prev[itemId], ...updatedData } }));
    showFeedback(!isPending ? "✓ Submitted to Leader/Assistant for testing!" : "Submission cancelled.");

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, { [itemId]: updatedData }, { merge: true });
    } catch (err) {
      console.error("Firestore save error:", err);
      setProgress(prev => ({ ...prev, [itemId]: existing }));
    }
  };

  // Approve & Test for Leader / Assistant
  const handleApproveLeader = async (itemId) => {
    if (!targetScoutId) return;
    const existing = progress[itemId] || {};
    const isCompleted = !!existing.completed;
    const newCompleted = !isCompleted;
    const dateVal = new Date().toISOString().split('T')[0];

    const updatedData = {
      completed: newCompleted,
      pending: false,
      completedDate: newCompleted ? dateVal : '',
      approvedBy: newCompleted ? (currentUser?.uid || 'leader') : '',
      approvedByName: newCompleted ? (currentUser?.fullName || currentUser?.username || currentUser?.leaderPosition || 'Troop Leader') : ''
    };

    setProgress(prev => ({ ...prev, [itemId]: { ...prev[itemId], ...updatedData } }));
    showFeedback(newCompleted ? "✓ Scout Tested & Signed-off!" : "Sign-off removed.");

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, { [itemId]: updatedData }, { merge: true });
    } catch (err) {
      console.error("Firestore approve error:", err);
      setProgress(prev => ({ ...prev, [itemId]: existing }));
    }
  };

  // Reset item status
  const handleReset = async (itemId) => {
    if (!targetScoutId) return;
    if (!window.confirm("Reset this item\'s testing and submission status?")) return;
    const existing = progress[itemId] || {};
    const resetData = {
      completed: false,
      pending: false,
      completedDate: '',
      submittedDate: '',
      approvedBy: '',
      approvedByName: ''
    };

    setProgress(prev => ({ ...prev, [itemId]: resetData }));
    showFeedback("Status reset.");

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'islamic_basics', 'status');
      await setDoc(docRef, { [itemId]: resetData }, { merge: true });
    } catch (err) {
      console.error("Firestore reset error:", err);
      setProgress(prev => ({ ...prev, [itemId]: existing }));
    }
  };

  // Total calculation across curriculum
  const totalTopics = ISLAMIC_BASICS_TOPICS.length;
  const completedTopicsCount = ISLAMIC_BASICS_TOPICS.filter(t => progress[t.id]?.completed).length;
  const pendingTopicsCount = Object.values(progress).filter(p => p.pending && !p.completed).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  // Filtered lists
  const filteredTopics = ISLAMIC_BASICS_TOPICS.filter(topic => {
    if (trackerCategory === 'all') return true;
    if (trackerCategory === 'belief') return topic.category === 'Belief & Practice';
    if (trackerCategory === 'fiqh') return topic.category === 'Ritual Law (Fiqh)';
    if (trackerCategory === 'akhlaq') return topic.category === 'Ethics & Character (Akhlaq)';
    if (trackerCategory === 'karbala') return topic.category === 'Karbala Heroes & Personalities';
    if (trackerCategory === 'duas') return topic.category === 'Post-Prayer Ta\'qibat & Duas';
    return true;
  });

  const filteredKarbala = KARBALA_CHARACTERS_DATA.filter(c => {
    const q = karbalaSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
  });

  const filteredInfallibles = INFALLIBLES_FULL_BIOGRAPHIES.filter(inf => {
    const q = infallibleSearch.toLowerCase();
    return inf.name.toLowerCase().includes(q) || inf.title.toLowerCase().includes(q) || inf.kunya.toLowerCase().includes(q) || inf.arabic.includes(q);
  });

  const filteredDuas = TAQIBAT_AND_DUAS_DATA.filter(dua => {
    if (duaFilter === 'all') return true;
    if (duaFilter === 'taqibat') return dua.category.includes('Post-Salat');
    if (duaFilter === 'supplications') return dua.category.includes('Major');
    return true;
  });

  const selectedScoutObj = allScouts.find(s => s.uid === targetScoutId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                🕌 Shia Islamic Knowledge Curriculum
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                ✋ Scout Submissions & Leader Testing
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Islamic Knowledge & Karbala Testing Portal</span>
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
              Every section is an interactive test module. Scouts study and confirm their mastery, submit to troop leaders/assistants, and undergo oral/knowledge testing to earn sign-offs!
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 shrink-0 flex items-center gap-4">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Mastered</span>
              <span className="text-2xl font-black text-emerald-400">{completedTopicsCount}/{totalTopics}</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-750"></div>
            <div className="text-center">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Pending Tests</span>
              <span className="text-2xl font-black text-amber-400">{pendingTopicsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leader Scout Selector */}
      {isLeaderOrOwner && !propScoutId && allScouts.length > 0 && (
        <div className="bg-slate-850 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <Users size={18} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Testing & Reviewing Scout Knowledge
              </label>
              <span className="text-sm font-extrabold text-white">
                {selectedScoutObj ? (selectedScoutObj.fullName || selectedScoutObj.username) : 'Select Scout'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden md:inline">Reviewing:</span>
            <select
              value={targetScoutId}
              onChange={(e) => setSelectedLeaderScoutId(e.target.value)}
              className="bg-slate-900 border border-emerald-500/50 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer shadow-inner"
            >
              {allScouts.map((scout) => (
                <option key={scout.uid} value={scout.uid}>
                  {scout.fullName || scout.username} ({scout.rank || 'Scout'})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action Feedback Notification */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

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
          <span>⚔️ Karbala Heroes ({KARBALA_CHARACTERS_DATA.length})</span>
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
          <span>🤲 Duas & Ta'qibat ({TAQIBAT_AND_DUAS_DATA.length})</span>
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
          <span>👑 14 Infallibles ({INFALLIBLES_FULL_BIOGRAPHIES.length})</span>
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
          <span>🌳 Usul al-Din (5 Roots)</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'branches'
              ? 'bg-teal-700 text-white shadow-lg shadow-teal-950/40 border border-teal-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <BookOpen size={15} className="text-teal-400" />
          <span>🌿 Furu al-Din (10 Branches)</span>
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
          <span>📊 Master Curriculum Tracker</span>
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
                  Read authentic Shia historical records of Karbala martyrs, submit your study completion, and complete leader oral testing.
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
              const itemId = `karbala_${char.id}`;
              const prog = progress[itemId] || progress[char.id] || {};

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

                  <div>
                    <div className="pt-3 flex items-center justify-between border-t border-slate-750/60 mt-3">
                      <button
                        onClick={() => setSelectedKarbalaChar(isSelected ? null : char.id)}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
                      >
                        {isSelected ? (
                          <><span>Show Less</span> <ChevronUp size={14} /></>
                        ) : (
                          <><span>Read Biography & Lessons</span> <ChevronDown size={14} /></>
                        )}
                      </button>
                    </div>

                    {/* Interactive Scout Submit & Leader Testing Bar */}
                    <IslamicTestingBar
                      itemId={itemId}
                      itemTitle={char.name}
                      progressEntry={prog}
                      onToggleSubmitScout={handleToggleSubmitScout}
                      onApproveLeader={handleApproveLeader}
                      onReset={handleReset}
                      isLeaderOrOwner={isLeaderOrOwner}
                      isScout={isScout}
                      testPrompt={`Ask scout about ${char.name}'s key heroic stand at Karbala and 2 character lessons for scouts.`}
                    />
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
                  Practice Arabic recitation and English translation. Submit to leaders for oral recitation testing!
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
            {filteredDuas.map((dua) => {
              const itemId = `dua_${dua.id}`;
              const prog = progress[itemId] || progress[dua.id] || {};

              return (
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
                  <div className="bg-slate-850/60 border border-slate-755 rounded-xl p-3.5">
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

                  {/* Merits */}
                  <div className="bg-emerald-950/20 border-l-2 border-emerald-500 p-3 rounded-r-xl text-xs text-slate-300 flex items-start gap-2">
                    <Sparkles size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Merits & Hadith:</strong> {dua.significance}</span>
                  </div>

                  {/* Interactive Scout Submit & Leader Testing Bar */}
                  <IslamicTestingBar
                    itemId={itemId}
                    itemTitle={dua.name}
                    progressEntry={prog}
                    onToggleSubmitScout={handleToggleSubmitScout}
                    onApproveLeader={handleApproveLeader}
                    onReset={handleReset}
                    isLeaderOrOwner={isLeaderOrOwner}
                    isScout={isScout}
                    testPrompt={`Listen to scout's oral recitation of ${dua.name} and verify understanding of key meanings.`}
                  />
                </div>
              );
            })}
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
                  Study the life, historic roles, and hadiths of the 14 Infallibles, and submit for leader testing.
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
              const itemId = `infallible_${inf.id}`;
              const prog = progress[itemId] || progress[inf.id] || {};

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

                  <div>
                    <div className="pt-3 flex items-center justify-between border-t border-slate-750/60 mt-3">
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

                    {/* Interactive Scout Submit & Leader Testing Bar */}
                    <IslamicTestingBar
                      itemId={itemId}
                      itemTitle={inf.name}
                      progressEntry={prog}
                      onToggleSubmitScout={handleToggleSubmitScout}
                      onApproveLeader={handleApproveLeader}
                      onReset={handleReset}
                      isLeaderOrOwner={isLeaderOrOwner}
                      isScout={isScout}
                      testPrompt={`Ask scout: When and where was ${inf.name} born, who was their mother, and what was their primary contribution?`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: USUL AL-DIN (5 ROOTS) ──────────────── */}
      {activeTab === 'roots' && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Star className="text-emerald-400" size={20} />
              <span>Usul al-Din (أصول الدين - The 5 Roots of Religion)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Foundational theological pillars. Scouts must understand and demonstrate personal conviction through reason before leader sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USUL_AL_DIN.map((root) => {
              const prog = progress[root.id] || {};
              return (
                <div key={root.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{root.name}</h4>
                      <span className="text-sm font-serif text-emerald-400 font-bold">{root.arabic}</span>
                    </div>
                    <p className="text-xs text-amber-300 font-semibold">{root.meaning}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{root.description}</p>
                  </div>

                  <IslamicTestingBar
                    itemId={root.id}
                    itemTitle={root.name}
                    progressEntry={prog}
                    onToggleSubmitScout={handleToggleSubmitScout}
                    onApproveLeader={handleApproveLeader}
                    onReset={handleReset}
                    isLeaderOrOwner={isLeaderOrOwner}
                    isScout={isScout}
                    testPrompt={root.testPrompt}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 5: FURU AL-DIN (10 BRANCHES) ──────────────── */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="text-teal-400" size={20} />
              <span>Furu al-Din (فروع الدين - The 10 Branches of Practice)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Practical obligations and acts of worship. Scouts confirm their practical understanding and undergo demonstration testing with unit leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FURU_AL_DIN.map((branch, idx) => {
              const prog = progress[branch.id] || {};
              return (
                <div key={branch.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{idx + 1}. {branch.name}</h4>
                      <span className="text-sm font-serif text-emerald-400 font-bold">{branch.arabic}</span>
                    </div>
                    <p className="text-xs text-amber-300 font-semibold">{branch.meaning}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{branch.details}</p>
                  </div>

                  <IslamicTestingBar
                    itemId={branch.id}
                    itemTitle={branch.name}
                    progressEntry={prog}
                    onToggleSubmitScout={handleToggleSubmitScout}
                    onApproveLeader={handleApproveLeader}
                    onReset={handleReset}
                    isLeaderOrOwner={isLeaderOrOwner}
                    isScout={isScout}
                    testPrompt={branch.testPrompt}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 6: CURRICULUM & KNOWLEDGE CHECK TRACKER ──────────────── */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Tracker Header & Filters */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-400" size={20} />
                  <span>Master Islamic Knowledge Curriculum Tracker</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Comprehensive checklist across all Fiqh, Akhlaq, Belief, Karbala, and Du'as modules.
                </p>
              </div>

              {/* Progress Summary */}
              <div className="bg-slate-900 border border-slate-750 rounded-xl px-4 py-2 flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold uppercase">Mastery</span>
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
                { id: 'karbala', label: '⚔️ Karbala Heroes', count: ISLAMIC_BASICS_TOPICS.filter(t => t.category === 'Karbala Heroes & Personalities').length },
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
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="text-emerald-400" size={22} />
                        ) : isPending ? (
                          <Clock className="text-amber-400 animate-pulse" size={22} />
                        ) : (
                          <Circle className="text-slate-500" size={22} />
                        )}
                      </div>

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
                          <Clock size={11} /> Pending Test {submittedDate ? `(${submittedDate})` : ''}
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

                      <IslamicTestingBar
                        itemId={topic.id}
                        itemTitle={topic.title}
                        progressEntry={topicProg}
                        onToggleSubmitScout={handleToggleSubmitScout}
                        onApproveLeader={handleApproveLeader}
                        onReset={handleReset}
                        isLeaderOrOwner={isLeaderOrOwner}
                        isScout={isScout}
                        testPrompt={`Test scout on the key definitions and practical application of ${topic.title}.`}
                      />
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

export const IslamicBasics = IslamicKnowledge;
