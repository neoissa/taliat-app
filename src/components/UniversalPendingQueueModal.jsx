import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, onSnapshot, setDoc, getDocs, query, where } from 'firebase/firestore';
import { 
  ISLAMIC_BASICS_TOPICS, 
  KARBALA_CHARACTERS_DATA, 
  TAQIBAT_AND_DUAS_DATA, 
  INFALLIBLES_FULL_BIOGRAPHIES 
} from '../data/islamicBasicsData';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES } from '../data/meritBadges';
import {
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Star,
  CheckCheck,
  RotateCcw,
  Search,
  Filter,
  Check,
  Send,
  User,
  Users,
  Shield,
  HelpCircle,
  FileText,
  Flame,
  Heart
} from 'lucide-react';

const USUL_AL_DIN = [
  { id: 'usul_tawhid', name: 'Tawhid (Monotheism)', arabic: 'التوحيد', prompt: 'Explain why Allah has no partners and recite Surah al-Ikhlas with meaning.' },
  { id: 'usul_adl', name: 'Adl (Divine Justice)', arabic: 'العدل', prompt: 'Explain divine justice and human accountability.' },
  { id: 'usul_nubuwwah', name: 'Nubuwwah (Prophethood)', arabic: 'النبوة', prompt: 'Name the 5 Ulul Azm arch-prophets and define Ismah.' },
  { id: 'usul_imamah', name: 'Imamah (Leadership)', arabic: 'الإمامة', prompt: 'Name the 12 Imams and explain the event of Ghadir Khumm.' },
  { id: 'usul_maad', name: 'Ma\'ad (Resurrection)', arabic: 'المعاد', prompt: 'Describe the stages of the Day of Judgement.' }
];

const FURU_AL_DIN = [
  { id: 'furu_salah', name: 'Salah', arabic: 'الصلاة', prompt: 'Demonstrate proper Wudu and the 11 obligatory acts of Salat.' },
  { id: 'furu_sawm', name: 'Sawm', arabic: 'الصوم', prompt: 'List things that break fasting and the goal of Taqwa.' },
  { id: 'furu_hajj', name: 'Hajj', arabic: 'الحج', prompt: 'Explain Umrah vs Hajj al-Tamattu.' },
  { id: 'furu_zakah', name: 'Zakah', arabic: 'الزكاة', prompt: 'Explain assets subject to Zakah.' },
  { id: 'furu_khums', name: 'Khums', arabic: 'الخمس', prompt: 'Calculate Khums on annual surplus savings.' },
  { id: 'furu_jihad', name: 'Jihad', arabic: 'الجهاد', prompt: 'Contrast Jihad al-Akbar with defensive struggle.' },
  { id: 'furu_amr', name: 'Amr bil-Ma\'ruf', arabic: 'الأمر بالمعروف', prompt: 'Explain conditions for enjoining good.' },
  { id: 'furu_nahi', name: 'Nahi \'anil-Munkar', arabic: 'النهي عن المنكر', prompt: 'Explain stages of forbidding evil.' },
  { id: 'furu_tawalla', name: 'Tawalla', arabic: 'التولي', prompt: 'Explain active love for Ahlul Bayt.' },
  { id: 'furu_tabarra', name: 'Tabarra', arabic: 'التبري', prompt: 'Explain dissociation from oppression.' }
];

export default function UniversalPendingQueueModal({
  isOpen,
  onClose,
  scoutId: propScoutId,
  currentUser,
  onNavigate
}) {
  if (!isOpen) return null;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'assistant_leader';
  const isLeaderOrOwner = isOwner || isLeader;
  const isScout = !isLeaderOrOwner;

  // For Leaders: All scouts list and selector
  const [allScouts, setAllScouts] = useState([]);
  const [activeScoutId, setActiveScoutId] = useState(propScoutId || currentUser?.uid);

  // Progress states
  const [islamicProgress, setIslamicProgress] = useState({});
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [assignmentSubmissions, setAssignmentSubmissions] = useState({});
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [eagleRoadmap, setEagleRoadmap] = useState({});
  const [scoutProfile, setScoutProfile] = useState({});
  
  // UI states
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');

  // 1. Fetch Scouts list if Leader/Owner
  useEffect(() => {
    if (!isLeaderOrOwner) return;
    const fetchScouts = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'scout'));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setAllScouts(list);
        if (list.length > 0 && !activeScoutId) {
          setActiveScoutId(list[0].uid);
        }
      } catch (err) {
        console.warn('Fallback fetching scouts list:', err);
      }
    };
    fetchScouts();
  }, [isLeaderOrOwner]);

  // Sync propScoutId change
  useEffect(() => {
    if (propScoutId) setActiveScoutId(propScoutId);
  }, [propScoutId]);

  // 2. Subscribe to Scout Profile
  useEffect(() => {
    if (!activeScoutId) return;
    const unsub = onSnapshot(doc(db, 'users', activeScoutId), (snap) => {
      if (snap.exists()) setScoutProfile(snap.data());
    });
    return () => unsub();
  }, [activeScoutId]);

  // 3. Subscribe to Islamic Basics
  useEffect(() => {
    if (!activeScoutId) return;
    const unsub = onSnapshot(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) setIslamicProgress(snap.data() || {});
      else setIslamicProgress({});
    });
    return () => unsub();
  }, [activeScoutId]);

  // 4. Subscribe to 7 Ranks
  useEffect(() => {
    if (!activeScoutId) return;
    const unsub = onSnapshot(collection(db, 'user_progress', activeScoutId, 'ranks'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });
    return () => unsub();
  }, [activeScoutId]);

  // 5. Subscribe to Merit Badges
  useEffect(() => {
    if (!activeScoutId) return;
    const unsub = onSnapshot(collection(db, 'user_progress', activeScoutId, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
    });
    return () => unsub();
  }, [activeScoutId]);

  // 6. Subscribe to Assignments & Submissions
  useEffect(() => {
    if (!activeScoutId) return;
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSub = onSnapshot(collection(db, 'user_progress', activeScoutId, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setAssignmentSubmissions(map);
    });
    return () => {
      unsubAssign();
      unsubSub();
    };
  }, [activeScoutId]);

  // 7. Subscribe to Road to Eagle Roadmap
  useEffect(() => {
    if (!activeScoutId) return;
    const unsub = onSnapshot(doc(db, 'user_progress', activeScoutId, 'road_to_eagle', 'project_roadmap'), (snap) => {
      if (snap.exists()) setEagleRoadmap(snap.data() || {});
      else setEagleRoadmap({});
    });
    return () => unsub();
  }, [activeScoutId]);

  const showFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 4000);
  };

  // Helper check if an entry is pending
  const isEntryPending = (entry) => {
    if (!entry) return false;
    if (typeof entry === 'string') return entry === 'pending';
    if (entry.completed === true) return false;
    return !!entry.pending || (!!entry.submittedAt && !entry.approvedAt) || (!!entry.submittedDate && !entry.completedDate);
  };

  // ── AGGREGATE ALL PENDING ITEMS ACROSS EVERY MODULE ──
  const pendingItems = [];

  // A. ISLAMIC KNOWLEDGE
  // 1. Karbala Heroes
  KARBALA_CHARACTERS_DATA.forEach(c => {
    const itemId = `karbala_${c.id}`;
    const p = islamicProgress[itemId] || islamicProgress[c.id];
    if (isEntryPending(p)) {
      pendingItems.push({
        id: itemId,
        rawId: c.id,
        domain: 'islamic',
        domainLabel: '⚔️ Karbala Hero',
        domainColor: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
        title: c.name,
        subtitle: `Karbala Hero • ${c.title}`,
        description: c.summary,
        submittedDate: p?.submittedDate || 'Awaiting Testing',
        targetTab: 'islamic',
        testPrompt: `Ask scout about ${c.name}'s stand at Karbala and 2 character lessons for scouts.`,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          const update = {
            completed: true,
            pending: false,
            completedDate: dateVal,
            approvedBy: currentUser?.uid || 'leader',
            approvedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader'
          };
          await setDoc(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), { [itemId]: update }, { merge: true });
          showFeedback(`✓ Approved ${c.name} testing!`);
        }
      });
    }
  });

  // 2. Duas & Taqibat
  TAQIBAT_AND_DUAS_DATA.forEach(d => {
    const itemId = `dua_${d.id}`;
    const p = islamicProgress[itemId] || islamicProgress[d.id];
    if (isEntryPending(p)) {
      pendingItems.push({
        id: itemId,
        rawId: d.id,
        domain: 'islamic',
        domainLabel: '🤲 Sacred Du\'a',
        domainColor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
        title: d.name,
        subtitle: `Post-Prayer • ${d.timing}`,
        description: d.significance,
        submittedDate: p?.submittedDate || 'Awaiting Recitation',
        targetTab: 'islamic',
        testPrompt: `Listen to scout's oral recitation of ${d.name} and verify meaning understanding.`,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          const update = {
            completed: true,
            pending: false,
            completedDate: dateVal,
            approvedBy: currentUser?.uid || 'leader',
            approvedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader'
          };
          await setDoc(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), { [itemId]: update }, { merge: true });
          showFeedback(`✓ Approved ${d.name} recitation!`);
        }
      });
    }
  });

  // 3. 14 Infallibles
  INFALLIBLES_FULL_BIOGRAPHIES.forEach(inf => {
    const itemId = `infallible_${inf.id}`;
    const p = islamicProgress[itemId] || islamicProgress[inf.id];
    if (isEntryPending(p)) {
      pendingItems.push({
        id: itemId,
        rawId: inf.id,
        domain: 'islamic',
        domainLabel: '👑 14 Infallibles',
        domainColor: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300',
        title: inf.name,
        subtitle: `${inf.arabic} (${inf.title})`,
        description: inf.lifeSummary,
        submittedDate: p?.submittedDate || 'Awaiting Oral Exam',
        targetTab: 'islamic',
        testPrompt: `Ask scout: When and where was ${inf.name} born, who was their mother, and what was their primary contribution?`,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          const update = {
            completed: true,
            pending: false,
            completedDate: dateVal,
            approvedBy: currentUser?.uid || 'leader',
            approvedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader'
          };
          await setDoc(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), { [itemId]: update }, { merge: true });
          showFeedback(`✓ Approved ${inf.name} biography test!`);
        }
      });
    }
  });

  // 4. Usul al-Din Roots
  USUL_AL_DIN.forEach(r => {
    const p = islamicProgress[r.id];
    if (isEntryPending(p)) {
      pendingItems.push({
        id: r.id,
        rawId: r.id,
        domain: 'islamic',
        domainLabel: '🌳 Usul al-Din',
        domainColor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
        title: r.name,
        subtitle: r.arabic,
        description: 'Core theological pillar awaiting scout reasoning demonstration.',
        submittedDate: p?.submittedDate || 'Awaiting Test',
        targetTab: 'islamic',
        testPrompt: r.prompt,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          const update = {
            completed: true,
            pending: false,
            completedDate: dateVal,
            approvedBy: currentUser?.uid || 'leader',
            approvedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader'
          };
          await setDoc(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), { [r.id]: update }, { merge: true });
          showFeedback(`✓ Approved ${r.name} testing!`);
        }
      });
    }
  });

  // 5. Furu al-Din Branches
  FURU_AL_DIN.forEach(b => {
    const p = islamicProgress[b.id];
    if (isEntryPending(p)) {
      pendingItems.push({
        id: b.id,
        rawId: b.id,
        domain: 'islamic',
        domainLabel: '🌿 Furu\' al-Din',
        domainColor: 'border-teal-500/50 bg-teal-950/20 text-teal-300',
        title: b.name,
        subtitle: b.arabic,
        description: 'Practical religious obligation awaiting leader verification.',
        submittedDate: p?.submittedDate || 'Awaiting Test',
        targetTab: 'islamic',
        testPrompt: b.prompt,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          const update = {
            completed: true,
            pending: false,
            completedDate: dateVal,
            approvedBy: currentUser?.uid || 'leader',
            approvedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader'
          };
          await setDoc(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), { [b.id]: update }, { merge: true });
          showFeedback(`✓ Approved ${b.name} testing!`);
        }
      });
    }
  });

  // 6. Master Curriculum Topics
  ISLAMIC_BASICS_TOPICS.forEach(t => {
    const p = islamicProgress[t.id];
    if (isEntryPending(p)) {
      pendingItems.push({
        id: t.id,
        rawId: t.id,
        domain: 'islamic',
        domainLabel: '📜 Fiqh & Belief',
        domainColor: 'border-sky-500/50 bg-sky-950/20 text-sky-300',
        title: t.title,
        subtitle: t.category,
        description: t.text,
        submittedDate: p?.submittedDate || 'Awaiting Test',
        targetTab: 'islamic',
        testPrompt: `Test scout on definitions and practical application of ${t.title}.`,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          const update = {
            completed: true,
            pending: false,
            completedDate: dateVal,
            approvedBy: currentUser?.uid || 'leader',
            approvedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader'
          };
          await setDoc(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), { [t.id]: update }, { merge: true });
          showFeedback(`✓ Approved ${t.title} topic!`);
        }
      });
    }
  });

  // B. 7 RANKS ADVANCEMENT REQUIREMENTS
  RANKS_DATA.forEach(rank => {
    const rp = ranksProgress[rank.id] || {};
    const reqsObj = rp.completedRequirements || rp.steps || {};
    (rank.categories || []).forEach(cat => {
      (cat.requirements || []).forEach(req => {
        const s = reqsObj[req.id];
        if (isEntryPending(s)) {
          pendingItems.push({
            id: `rank_${rank.id}_${req.id}`,
            rawId: req.id,
            domain: 'ranks',
            domainLabel: `⚜️ ${rank.name} Rank`,
            domainColor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
            title: `${rank.name} Req ${req.id}`,
            subtitle: cat.name || rank.name,
            description: req.text,
            submittedDate: s?.submittedAt || s?.submittedDate || 'Recently',
            targetTab: 'advancement',
            testPrompt: `Verify scout demonstration for ${rank.name} Req ${req.id}: ${req.text}`,
            approveHandler: async () => {
              const dateVal = new Date().toISOString().split('T')[0];
              const updatedObj = {
                ...reqsObj,
                [req.id]: {
                  completed: true,
                  pending: false,
                  approvedAt: dateVal,
                  approvedBy: currentUser?.uid || 'leader',
                  approvedByName: currentUser?.fullName || currentUser?.username || 'Leader',
                  completedAt: s?.completedAt || dateVal
                }
              };
              await setDoc(doc(db, 'user_progress', activeScoutId, 'ranks', rank.id), {
                completedRequirements: updatedObj,
                steps: updatedObj
              }, { merge: true });
              showFeedback(`✓ Approved ${rank.name} Req ${req.id}!`);
            }
          });
        }
      });
    });
  });

  // C. MERIT BADGES REQUIREMENTS
  MERIT_BADGES.forEach(b => {
    const mp = meritProgress[b.id] || {};
    if (isEntryPending(mp)) {
      pendingItems.push({
        id: `mb_${b.id}`,
        rawId: b.id,
        domain: 'badges',
        domainLabel: '🏅 Merit Badge',
        domainColor: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
        title: `${b.name} Merit Badge`,
        subtitle: b.eagleRequired ? 'Eagle-Required' : 'Elective',
        description: `Scout has finished workbook and requested counselor conference.`,
        submittedDate: mp?.submittedDate || 'Recently',
        targetTab: 'merit-badges',
        testPrompt: `Conduct Scoutmaster/Counselor conference for ${b.name}.`,
        approveHandler: async () => {
          const dateVal = new Date().toISOString().split('T')[0];
          await setDoc(doc(db, 'user_progress', activeScoutId, 'merit_badges', b.id), {
            completed: true,
            pending: false,
            dateCompleted: dateVal,
            counselorName: currentUser?.fullName || currentUser?.username || 'Counselor'
          }, { merge: true });
          showFeedback(`✓ Approved ${b.name} Merit Badge!`);
        }
      });
    }
  });

  // D. HOMEWORK & ASSIGNMENTS
  assignmentsList.forEach(a => {
    const sub = assignmentSubmissions[a.id];
    if (sub && sub.submittedDate && !sub.completed && !sub.graded) {
      pendingItems.push({
        id: `homework_${a.id}`,
        rawId: a.id,
        domain: 'homework',
        domainLabel: '🎒 Homework Task',
        domainColor: 'border-teal-500/50 bg-teal-950/20 text-teal-300',
        title: a.title,
        subtitle: `Due ${a.dueDate || 'Soon'}`,
        description: sub.notes || a.description || 'Scout completed and submitted worksheet/video response.',
        submittedDate: sub.submittedDate,
        targetTab: 'assignments',
        testPrompt: 'Review scout worksheet notes and grade task.',
        approveHandler: async () => {
          await setDoc(doc(db, 'user_progress', activeScoutId, 'assignments', a.id), {
            completed: true,
            graded: true,
            grade: '100%',
            reviewedBy: currentUser?.uid || 'leader'
          }, { merge: true });
          showFeedback(`✓ Graded and approved task ${a.title}!`);
        }
      });
    }
  });

  // E. ROAD TO EAGLE MILESTONES
  if (eagleRoadmap.phase2 && !eagleRoadmap.phase2.signatures?.district && eagleRoadmap.phase1?.completed) {
    pendingItems.push({
      id: 'eagle_phase2_proposal',
      rawId: 'phase2',
      domain: 'eagle',
      domainLabel: '🦅 Road to Eagle',
      domainColor: 'border-amber-500/60 bg-amber-950/30 text-amber-300',
      title: 'Eagle Project Proposal Approval',
      subtitle: eagleRoadmap.phase1.projectTitle || 'Eagle Service Project',
      description: 'Project proposal ready for unit leader and committee signatures.',
      submittedDate: 'Awaiting Signatures',
      targetTab: 'road-to-eagle',
      testPrompt: 'Verify proposal details in BSA Workbook 512-927.',
      approveHandler: async () => {
        const nextRoadmap = {
          ...eagleRoadmap,
          phase2: {
            ...eagleRoadmap.phase2,
            completed: true,
            signatures: {
              ...eagleRoadmap.phase2.signatures,
              scoutmaster: true,
              scoutmasterName: currentUser?.fullName || 'Scoutmaster',
              scoutmasterDate: new Date().toISOString().split('T')[0]
            }
          }
        };
        await setDoc(doc(db, 'user_progress', activeScoutId, 'road_to_eagle', 'project_roadmap'), nextRoadmap, { merge: true });
        showFeedback('✓ Signed Scoutmaster Eagle Proposal Approval!');
      }
    });
  }

  // Filtered items
  const filteredPending = pendingItems.filter(item => {
    if (selectedDomainFilter !== 'all' && item.domain !== selectedDomainFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Batch approve all pending for leader
  const handleBatchApproveAll = async () => {
    if (!window.confirm(`Approve all ${filteredPending.length} pending items for this scout?`)) return;
    for (const item of filteredPending) {
      if (item.approveHandler) await item.approveHandler();
    }
    showFeedback(`✓ Batch approved ${filteredPending.length} pending items!`);
  };

  const scoutName = scoutProfile.fullName || scoutProfile.username || 'Scout';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/50 p-5 border-b border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0 shadow-md">
              ⏳
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Universal Pending Queue
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  Reviewing: {scoutName}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                All Pending Submissions & Testing Items ({pendingItems.length})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Leader Scout Switcher */}
            {isLeaderOrOwner && allScouts.length > 0 && (
              <select
                value={activeScoutId}
                onChange={(e) => setActiveScoutId(e.target.value)}
                className="bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
              >
                {allScouts.map(s => (
                  <option key={s.uid} value={s.uid}>
                    {s.fullName || s.username} ({s.rank || 'Scout'})
                  </option>
                ))}
              </select>
            )}

            {isLeaderOrOwner && filteredPending.length > 0 && (
              <button
                type="button"
                onClick={handleBatchApproveAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <CheckCheck size={14} />
                <span>Approve All ({filteredPending.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {actionFeedback && (
          <div className="bg-emerald-950/80 border-y border-emerald-500 text-emerald-200 text-xs font-bold p-2.5 text-center animate-fadeIn">
            {actionFeedback}
          </div>
        )}

        {/* Filter Controls & Search Bar */}
        <div className="p-4 bg-slate-850 border-b border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
          {/* Domain Chips */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Items', count: pendingItems.length },
              { id: 'islamic', label: '🕌 Islamic', count: pendingItems.filter(i => i.domain === 'islamic').length },
              { id: 'ranks', label: '⚜️ 7 Ranks', count: pendingItems.filter(i => i.domain === 'ranks').length },
              { id: 'badges', label: '🏅 Merit Badges', count: pendingItems.filter(i => i.domain === 'badges').length },
              { id: 'homework', label: '🎒 Homework', count: pendingItems.filter(i => i.domain === 'homework').length },
              { id: 'eagle', label: '🦅 Eagle', count: pendingItems.filter(i => i.domain === 'eagle').length }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedDomainFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedDomainFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>{f.label}</span>
                <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full font-mono">
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pending items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Scrollable Items List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredPending.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400 opacity-60" />
              <h4 className="text-base font-extrabold text-white">No Pending Items Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no pending submissions in this category. All submitted tasks have been tested and verified!
              </p>
            </div>
          ) : (
            filteredPending.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 border-2 border-slate-700 hover:border-amber-500/50 p-4 sm:p-5 rounded-2xl transition space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-750/70 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.domainColor}`}>
                        {item.domainLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Submitted: {item.submittedDate}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>{item.title}</span>
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Maneuver to Section Button */}
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigate(item.targetTab);
                      }}
                      className="bg-slate-700 hover:bg-slate-650 text-amber-300 hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-600 shrink-0 cursor-pointer self-start"
                    >
                      <span>Open in Portal</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-750">
                    {item.description}
                  </p>
                )}

                {item.testPrompt && (
                  <p className="text-[11px] text-slate-350">
                    <strong className="text-emerald-400 font-semibold">Testing Prompt:</strong> {item.testPrompt}
                  </p>
                )}

                {/* Leader Testing & Approval Action */}
                {isLeaderOrOwner && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-750/50">
                    <button
                      type="button"
                      onClick={item.approveHandler}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Check size={14} />
                      <span>Conduct Test & Sign-off ✓</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
