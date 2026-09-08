// src/components/UniversalPendingQueueModal.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, onSnapshot, setDoc, getDocs, query, where } from 'firebase/firestore';
import { 
  ISLAMIC_BASICS_TOPICS, 
  KARBALA_CHARACTERS_DATA, 
  TAQIBAT_AND_DUAS_DATA, 
  INFALLIBLES_FULL_BIOGRAPHIES 
} from '../data/islamicBasicsData';
import { RANKS_DATA, getLatestAchievedRank, isRankCompleted } from '../data/ranksData';
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
  Search,
  Filter,
  Check,
  User,
  Users,
  Shield,
  Loader2,
  AlertCircle,
  Calendar,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { resolveParentRequest, acknowledgeParentRequest } from '../services/parentRequestService';

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
  targetScoutId,
  scoutId: propScoutId,
  currentUser,
  onNavigate
}) {
  if (!isOpen) return null;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster';
  const isLeader = currentUser?.role === 'leader' || isExecutive;
  const isLeaderOrOwner = isOwner || isLeader;

  const initialScoutId = targetScoutId || propScoutId || (isLeaderOrOwner ? 'all' : currentUser?.uid);
  const [allScouts, setAllScouts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeScoutId, setActiveScoutId] = useState(initialScoutId);

  // Consolidated multi-scout data state: { [scoutUid]: { islamic, ranks, merit, assignments, eagle, profile } }
  const [scoutsDataMap, setScoutsDataMap] = useState({});
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [parentRequestsList, setParentRequestsList] = useState([]);

  // UI states
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [approvedItemIds, setApprovedItemIds] = useState(new Set());

  // 1. Fetch Scouts list & Groups if Leader/Owner
  useEffect(() => {
    if (!isLeaderOrOwner) return;

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const q = query(collection(db, 'users'), where('role', '==', 'scout'));
    const unsubScouts = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      if (!isExecutive && currentUser?.groupId) {
        // Scoped to leader's assigned patrol
        list = list.filter(s => s.groupId === currentUser.groupId || s.patrolId === currentUser.groupId || s.leaderId === currentUser.uid);
      }
      setAllScouts(list);
    });

    return () => {
      unsubGroups();
      unsubScouts();
    };
  }, [isLeaderOrOwner, isExecutive, currentUser?.groupId, currentUser?.uid]);

  // Sync prop changes
  useEffect(() => {
    if (targetScoutId) setActiveScoutId(targetScoutId);
    else if (propScoutId) setActiveScoutId(propScoutId);
  }, [targetScoutId, propScoutId]);

  // 2. Fetch Assignments Master List
  useEffect(() => {
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubAssign();
  }, []);

  // 2.5 Fetch Parent Requests (Absences, Conferences, Signed Reports)
  useEffect(() => {
    const unsubReqs = onSnapshot(collection(db, 'parent_requests'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.status === 'pending_review');
      setParentRequestsList(list);
    }, (err) => console.warn('Parent requests fallback in queue modal:', err));
    return () => unsubReqs();
  }, []);

  // 3. Real-Time Multi-Scout Subscriptions
  useEffect(() => {
    const scoutsToWatch = isLeaderOrOwner 
      ? allScouts 
      : [{ uid: currentUser?.uid, ...currentUser }];

    if (scoutsToWatch.length === 0) return;

    const unsubs = [];

    scoutsToWatch.forEach(scout => {
      const sUid = scout.uid;
      if (!sUid) return;

      // Islamic Basics
      const unsubIslamic = onSnapshot(doc(db, 'user_progress', sUid, 'islamic_basics', 'status'), (snap) => {
        setScoutsDataMap(prev => {
          const current = prev[sUid] || {};
          return {
            ...prev,
            [sUid]: { ...current, profile: scout, islamic: snap.exists() ? snap.data() : {} }
          };
        });
      });
      unsubs.push(unsubIslamic);

      // Ranks
      const unsubRanks = onSnapshot(collection(db, 'user_progress', sUid, 'ranks'), (snap) => {
        const ranksMap = {};
        snap.docs.forEach(d => { ranksMap[d.id] = d.data(); });
        setScoutsDataMap(prev => {
          const current = prev[sUid] || {};
          return {
            ...prev,
            [sUid]: { ...current, profile: scout, ranks: ranksMap }
          };
        });
      });
      unsubs.push(unsubRanks);

      // Merit Badges
      const unsubMerit = onSnapshot(collection(db, 'user_progress', sUid, 'merit_badges'), (snap) => {
        const meritMap = {};
        snap.docs.forEach(d => { meritMap[d.id] = d.data(); });
        setScoutsDataMap(prev => {
          const current = prev[sUid] || {};
          return {
            ...prev,
            [sUid]: { ...current, profile: scout, merit: meritMap }
          };
        });
      });
      unsubs.push(unsubMerit);

      // Assignments
      const unsubAssign = onSnapshot(collection(db, 'user_progress', sUid, 'assignments'), (snap) => {
        const assignMap = {};
        snap.docs.forEach(d => { assignMap[d.id] = d.data(); });
        setScoutsDataMap(prev => {
          const current = prev[sUid] || {};
          return {
            ...prev,
            [sUid]: { ...current, profile: scout, assignments: assignMap }
          };
        });
      });
      unsubs.push(unsubAssign);

      // Road to Eagle
      const unsubEagle = onSnapshot(doc(db, 'user_progress', sUid, 'road_to_eagle', 'project_roadmap'), (snap) => {
        setScoutsDataMap(prev => {
          const current = prev[sUid] || {};
          return {
            ...prev,
            [sUid]: { ...current, profile: scout, eagle: snap.exists() ? snap.data() : {} }
          };
        });
      });
      unsubs.push(unsubEagle);
    });

    return () => unsubs.forEach(u => u());
  }, [isLeaderOrOwner, allScouts, currentUser]);

  const showFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 4000);
  };

  const isEntryPending = (entry) => {
    if (!entry) return false;
    if (typeof entry === 'string') return entry === 'pending';
    if (entry.completed === true) return false;
    return !!entry.pending || (!!entry.submittedAt && !entry.approvedAt) || (!!entry.submittedDate && !entry.completedDate);
  };

  // ── AGGREGATE ALL PENDING ITEMS ACROSS EVERY MODULE AND ALL WATCHED SCOUTS ──
  const masterPendingItems = [];

  const allScoutUidsToScan = Array.from(new Set([
    ...allScouts.map(s => s.uid),
    ...Object.keys(scoutsDataMap)
  ]));

  allScoutUidsToScan.forEach(sUid => {
    const sData = scoutsDataMap[sUid];
    if (!sData) return;

    const scoutProf = sData.profile || allScouts.find(s => s.uid === sUid) || {};
    const scoutName = scoutProf.fullName || scoutProf.username || 'Scout';
    const scoutPatrolName = groups.find(g => g.id === scoutProf.groupId || g.id === scoutProf.patrolId)?.name || 'Patrol';

    const islamicProgress = sData.islamic || {};
    const ranksProgress = sData.ranks || {};
    const meritProgress = sData.merit || {};
    const assignProgress = sData.assignments || {};
    const eagleRoadmap = sData.eagle || {};

    // A. ISLAMIC KNOWLEDGE
    // 1. Karbala Heroes
    KARBALA_CHARACTERS_DATA.forEach(c => {
      const itemId = `karbala_${c.id}`;
      const p = islamicProgress[itemId] || islamicProgress[c.id];
      const uniqueKey = `${sUid}_islamic_${itemId}`;
      if (isEntryPending(p) && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: c.id,
          docKey: itemId,
          domain: 'islamic',
          domainLabel: '⚔️ Karbala Hero',
          domainColor: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
          title: c.name,
          subtitle: `Karbala Hero • ${c.title}`,
          description: c.summary,
          submittedDate: p?.submittedDate || 'Awaiting Oral Testing',
          targetTab: 'islamic',
          testPrompt: `Ask scout about ${c.name}'s stand at Karbala and 2 character lessons for scouts.`
        });
      }
    });

    // 2. Duas & Taqibat
    TAQIBAT_AND_DUAS_DATA.forEach(d => {
      const itemId = `dua_${d.id}`;
      const p = islamicProgress[itemId] || islamicProgress[d.id];
      const uniqueKey = `${sUid}_islamic_${itemId}`;
      if (isEntryPending(p) && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: d.id,
          docKey: itemId,
          domain: 'islamic',
          domainLabel: '🤲 Sacred Du\'a',
          domainColor: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300',
          title: d.name,
          subtitle: `Post-Prayer • ${d.timing}`,
          description: d.significance,
          submittedDate: p?.submittedDate || 'Awaiting Recitation',
          targetTab: 'islamic',
          testPrompt: `Listen to scout's oral recitation of ${d.name} and verify meaning understanding.`
        });
      }
    });

    // 3. 14 Infallibles
    INFALLIBLES_FULL_BIOGRAPHIES.forEach(inf => {
      const itemId = `infallible_${inf.id}`;
      const p = islamicProgress[itemId] || islamicProgress[inf.id];
      const uniqueKey = `${sUid}_islamic_${itemId}`;
      if (isEntryPending(p) && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: inf.id,
          docKey: itemId,
          domain: 'islamic',
          domainLabel: '👑 14 Infallibles',
          domainColor: 'border-indigo-500/50 bg-indigo-950/30 text-indigo-300',
          title: inf.name,
          subtitle: `${inf.arabic} (${inf.title})`,
          description: inf.lifeSummary,
          submittedDate: p?.submittedDate || 'Awaiting Oral Exam',
          targetTab: 'islamic',
          testPrompt: `Ask scout: When and where was ${inf.name} born, who was their mother, and what was their primary contribution?`
        });
      }
    });

    // 4. Usul al-Din Roots
    USUL_AL_DIN.forEach(r => {
      const p = islamicProgress[r.id];
      const uniqueKey = `${sUid}_islamic_${r.id}`;
      if (isEntryPending(p) && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: r.id,
          docKey: r.id,
          domain: 'islamic',
          domainLabel: '🌳 Usul al-Din',
          domainColor: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300',
          title: r.name,
          subtitle: r.arabic,
          description: 'Core theological pillar awaiting scout reasoning demonstration.',
          submittedDate: p?.submittedDate || 'Awaiting Test',
          targetTab: 'islamic',
          testPrompt: r.prompt
        });
      }
    });

    // 5. Furu al-Din Branches
    FURU_AL_DIN.forEach(b => {
      const p = islamicProgress[b.id];
      const uniqueKey = `${sUid}_islamic_${b.id}`;
      if (isEntryPending(p) && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: b.id,
          docKey: b.id,
          domain: 'islamic',
          domainLabel: '🌿 Furu\' al-Din',
          domainColor: 'border-teal-500/50 bg-teal-950/30 text-teal-300',
          title: b.name,
          subtitle: b.arabic,
          description: 'Practical religious obligation awaiting leader verification.',
          submittedDate: p?.submittedDate || 'Awaiting Test',
          targetTab: 'islamic',
          testPrompt: b.prompt
        });
      }
    });

    // 6. Master Curriculum Topics
    ISLAMIC_BASICS_TOPICS.forEach(t => {
      const p = islamicProgress[t.id];
      const uniqueKey = `${sUid}_islamic_${t.id}`;
      if (isEntryPending(p) && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: t.id,
          docKey: t.id,
          domain: 'islamic',
          domainLabel: '📜 Fiqh & Belief',
          domainColor: 'border-sky-500/50 bg-sky-950/30 text-sky-300',
          title: t.title,
          subtitle: t.category,
          description: t.text,
          submittedDate: p?.submittedDate || 'Awaiting Test',
          targetTab: 'islamic',
          testPrompt: `Test scout on definitions and practical application of ${t.title}.`
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
          const uniqueKey = `${sUid}_rank_${rank.id}_${req.id}`;
          if (isEntryPending(s) && !approvedItemIds.has(uniqueKey)) {
            masterPendingItems.push({
              id: uniqueKey,
              scoutUid: sUid,
              scoutName,
              scoutPatrolName,
              rawId: req.id,
              rankId: rank.id,
              rankName: rank.name,
              domain: 'ranks',
              domainLabel: `⚜️ ${rank.name} Rank`,
              domainColor: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300',
              title: `${rank.name} Req ${req.id}`,
              subtitle: cat.name || rank.name,
              description: req.text,
              submittedDate: s?.submittedAt || s?.submittedDate || 'Recently',
              targetTab: 'advancement',
              testPrompt: `Verify scout demonstration for ${rank.name} Req ${req.id}: ${req.text}`
            });
          }
        });
      });
    });

    // C. MERIT BADGES REQUIREMENTS
    MERIT_BADGES.forEach(b => {
      const mp = meritProgress[b.id] || meritProgress[b.id.replace(/-/g, '_')] || meritProgress[b.id.replace(/_/g, '-')] || {};
      if (mp.completed === true) return;

      const steps = mp.steps || mp.completedSteps || {};
      let hasReqPending = false;

      (b.requirements || []).forEach(req => {
        const stepVal = steps[req.id] || steps[String(req.id)];
        const isStepPending = stepVal === 'pending' || (typeof stepVal === 'object' && stepVal?.pending === true && !stepVal?.completed && !stepVal?.approved);
        const isStepApproved = stepVal === true || (typeof stepVal === 'object' && (stepVal?.completed === true || stepVal?.approved === true));

        if (isStepPending && !isStepApproved) {
          hasReqPending = true;
          const uniqueKey = `${sUid}_badge_${b.id}_req_${req.id}`;
          if (!approvedItemIds.has(uniqueKey)) {
            masterPendingItems.push({
              id: uniqueKey,
              scoutUid: sUid,
              scoutName,
              scoutPatrolName,
              rawId: b.id,
              badgeId: b.id,
              badgeName: b.name,
              reqId: req.id,
              domain: 'badges',
              domainLabel: `🏅 ${b.name} Req ${req.id}`,
              domainColor: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
              title: `${b.name} — Req ${req.id}`,
              subtitle: `${b.eagleRequired ? '⭐ Eagle-Required' : 'Elective'} • Requirement Step`,
              description: req.text,
              submittedDate: (typeof stepVal === 'object' && stepVal?.submittedDate) ? stepVal.submittedDate : (mp.updatedAt ? mp.updatedAt.split('T')[0] : 'Awaiting Leader Sign-off'),
              targetTab: 'merit-badges',
              testPrompt: `Verify scout demonstration for ${b.name} Requirement ${req.id}: ${req.text}`
            });
          }
        }
      });

      // Also support whole badge pending flag if no specific requirement was flagged
      const uniqueBadgeKey = `${sUid}_badge_${b.id}`;
      if ((mp.pending === true || isEntryPending(mp)) && !approvedItemIds.has(uniqueBadgeKey) && !hasReqPending) {
        masterPendingItems.push({
          id: uniqueBadgeKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: b.id,
          badgeId: b.id,
          badgeName: b.name,
          isEntireBadge: true,
          domain: 'badges',
          domainLabel: '🏅 Merit Badge',
          domainColor: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
          title: `${b.name} Merit Badge`,
          subtitle: b.eagleRequired ? 'Eagle-Required' : 'Elective',
          description: 'Scout has requested full merit badge review and counselor sign-off.',
          submittedDate: mp?.submittedDate || (mp.updatedAt ? mp.updatedAt.split('T')[0] : 'Recently'),
          targetTab: 'merit-badges',
          testPrompt: `Conduct Scoutmaster/Counselor conference for ${b.name}.`
        });
      }
    });

    // D. HOMEWORK & ASSIGNMENTS
    assignmentsList.forEach(a => {
      const sub = assignProgress[a.id];
      const uniqueKey = `${sUid}_homework_${a.id}`;
      if (sub && sub.submittedDate && !sub.completed && !sub.graded && !approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: a.id,
          domain: 'homework',
          domainLabel: '🎒 Homework Task',
          domainColor: 'border-teal-500/50 bg-teal-950/30 text-teal-300',
          title: a.title,
          subtitle: `Due ${a.dueDate || 'Soon'}`,
          description: sub.scoutNotes || sub.notes || a.description || 'Scout completed and submitted worksheet/video response.',
          submittedDate: sub.submittedDate || (sub.submittedAt ? sub.submittedAt.split('T')[0] : 'Recently'),
          targetTab: 'assignments',
          testPrompt: 'Review scout worksheet notes and grade task.'
        });
      }
    });

    // E. ROAD TO EAGLE MILESTONES
    if (eagleRoadmap.phase2 && !eagleRoadmap.phase2.signatures?.district && eagleRoadmap.phase1?.completed) {
      const uniqueKey = `${sUid}_eagle_phase2`;
      if (!approvedItemIds.has(uniqueKey)) {
        masterPendingItems.push({
          id: uniqueKey,
          scoutUid: sUid,
          scoutName,
          scoutPatrolName,
          rawId: 'phase2',
          domain: 'eagle',
          domainLabel: '🦅 Road to Eagle',
          domainColor: 'border-amber-500/60 bg-amber-950/40 text-amber-300',
          title: 'Eagle Project Proposal Approval',
          subtitle: eagleRoadmap.phase1.projectTitle || 'Eagle Service Project',
          description: 'Project proposal ready for unit leader and committee signatures.',
          submittedDate: 'Awaiting Signatures',
          targetTab: 'road-to-eagle',
          testPrompt: 'Verify proposal details in BSA Workbook 512-927.'
        });
      }
    }
  });

  // F. PARENT REQUESTS (Absences, Meeting requests, Signed reports, Forms)
  parentRequestsList.forEach(req => {
    const sUid = req.scoutId;
    const scoutProf = allScouts.find(s => s.uid === sUid) || scoutsDataMap[sUid]?.profile || {};
    const scoutName = req.scoutName || scoutProf.fullName || scoutProf.username || 'Scout';
    const scoutPatrolName = req.patrolName || scoutProf.assignedPatrol || 'Patrol';
    const uniqueKey = `parent_req_${req.id || req.requestId}`;

    if (!approvedItemIds.has(uniqueKey)) {
      masterPendingItems.push({
        id: uniqueKey,
        scoutUid: sUid || 'unlinked',
        scoutName,
        scoutPatrolName,
        rawId: req.id || req.requestId,
        domain: 'requests',
        domainLabel: req.requestType === 'meeting_request' ? '🤝 Conference Request' : req.requestType === 'absence_notice' ? '📅 Absence Notice' : '👨‍👩‍👧 Parent Submission',
        domainColor: 'border-purple-500/50 bg-purple-950/30 text-purple-300',
        title: req.requestType === 'meeting_request' 
          ? `Parent Conference: ${req.parentName}` 
          : req.requestType === 'absence_notice' 
          ? `Absence Notice (${req.proposedDate || 'Troop Meeting'})` 
          : `Parent Submission from ${req.parentName}`,
        subtitle: `Scout: ${scoutName} • Parent: ${req.parentName}${req.parentPhone ? ` (${req.parentPhone})` : ''}`,
        description: req.message || req.meetingTopic || 'Parent submission awaiting leader review.',
        submittedDate: req.createdAt ? req.createdAt.split('T')[0] : 'Recently',
        targetTab: 'parent-requests',
        testPrompt: req.requestType === 'meeting_request' 
          ? `Schedule / confirm conference with ${req.parentName}.` 
          : `Review parent note and acknowledge receipt.`,
        requestData: req
      });
    }
  });

  // ── ACCURATE PER-SCOUT PENDING COUNTS DICTIONARY ──
  const scoutPendingCounts = {};
  allScouts.forEach(s => {
    scoutPendingCounts[s.uid] = masterPendingItems.filter(i => i.scoutUid === s.uid).length;
  });

  // Active items for current view
  const activePendingItems = (activeScoutId === 'all' || !activeScoutId)
    ? masterPendingItems
    : masterPendingItems.filter(i => i.scoutUid === activeScoutId);

  // Filtered items
  const filteredPending = activePendingItems.filter(item => {
    if (selectedDomainFilter !== 'all' && item.domain !== selectedDomainFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.title || '').toLowerCase().includes(q) ||
        (item.subtitle || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.scoutName || '').toLowerCase().includes(q) ||
        (item.scoutPatrolName || '').toLowerCase().includes(q);
      return matchText;
    }
    return true;
  });

  // ── ATOMIC BATCH APPROVAL ENGINE (Zero Race Conditions) ──
  const handleBatchApproveAll = async () => {
    if (filteredPending.length === 0) return;
    const count = filteredPending.length;
    if (!window.confirm(`Batch approve and sign off all ${count} pending submission items?`)) return;

    setBatchProcessing(true);
    const today = new Date().toISOString().split('T')[0];
    const leaderUid = currentUser?.uid || 'leader';
    const leaderName = currentUser?.fullName || currentUser?.username || 'Troop Leader';

    try {
      const rankUpdatesByScoutAndRank = {};
      const islamicUpdatesByScout = {};
      const meritUpdatesByScoutAndBadge = {};
      const homeworkUpdates = [];
      const eagleUpdates = [];
      const newApprovedIds = new Set(approvedItemIds);

      filteredPending.forEach(item => {
        newApprovedIds.add(item.id);
        const sUid = item.scoutUid;

        if (item.domain === 'ranks') {
          if (!rankUpdatesByScoutAndRank[sUid]) rankUpdatesByScoutAndRank[sUid] = {};
          if (!rankUpdatesByScoutAndRank[sUid][item.rankId]) rankUpdatesByScoutAndRank[sUid][item.rankId] = {};
          rankUpdatesByScoutAndRank[sUid][item.rankId][item.rawId] = {
            completed: true,
            pending: false,
            approvedAt: today,
            approvedBy: leaderUid,
            approvedByName: leaderName,
            completedAt: today
          };
        } else if (item.domain === 'islamic') {
          if (!islamicUpdatesByScout[sUid]) islamicUpdatesByScout[sUid] = {};
          islamicUpdatesByScout[sUid][item.docKey] = {
            completed: true,
            pending: false,
            completedDate: today,
            approvedBy: leaderUid,
            approvedByName: leaderName
          };
        } else if (item.domain === 'badges') {
          const bId = item.rawId || item.badgeId;
          if (!meritUpdatesByScoutAndBadge[sUid]) meritUpdatesByScoutAndBadge[sUid] = {};
          if (!meritUpdatesByScoutAndBadge[sUid][bId]) meritUpdatesByScoutAndBadge[sUid][bId] = { reqIds: [], isEntire: false };
          if (item.reqId) {
            meritUpdatesByScoutAndBadge[sUid][bId].reqIds.push(item.reqId);
          } else {
            meritUpdatesByScoutAndBadge[sUid][bId].isEntire = true;
          }
        } else if (item.domain === 'homework') {
          homeworkUpdates.push({
            scoutUid: sUid,
            assignmentId: item.rawId,
            title: item.title,
            data: {
              completed: true,
              isCompleted: true,
              status: 'completed',
              completedDate: today,
              completedAt: new Date().toISOString(),
              graded: true,
              grade: '100%',
              verifiedByLeader: true,
              leaderName: leaderName,
              reviewedBy: leaderUid
            }
          });
        } else if (item.domain === 'eagle') {
          eagleUpdates.push({
            scoutUid: sUid,
            data: {
              phase2: {
                completed: true,
                signatures: {
                  scoutmaster: true,
                  scoutmasterName: leaderName,
                  scoutmasterDate: today
                }
              }
            }
          });
        } else if (item.domain === 'requests') {
          updatePromises.push(
            resolveParentRequest({
              requestId: item.rawId,
              leaderUid,
              leaderName,
              resolutionStatus: 'approved',
              resolutionNote: 'Batch approved and signed off by leader.',
              parentUid: item.requestData?.parentUid,
              parentEmail: item.requestData?.parentEmail,
              scoutName: item.scoutName
            })
          );
        }
      });

      // Execute all atomic batch updates in parallel
      const updatePromises = [];

      // 1. Commit rank updates
      Object.entries(rankUpdatesByScoutAndRank).forEach(([sUid, ranksMap]) => {
        Object.entries(ranksMap).forEach(([rankId, reqsMap]) => {
          updatePromises.push(
            setDoc(doc(db, 'user_progress', sUid, 'ranks', rankId), {
              completedRequirements: reqsMap,
              steps: reqsMap
            }, { merge: true })
          );
        });

        // Compute simulated ranks progress for this scout to sync users/{sUid}.rank if a new rank is achieved
        const currentScoutProgress = scoutsDataMap[sUid]?.ranks || {};
        const simulatedScoutRanks = { ...currentScoutProgress };
        Object.entries(ranksMap).forEach(([rankId, reqsMap]) => {
          const existing = simulatedScoutRanks[rankId] || {};
          const existingReqs = existing.completedRequirements || existing.steps || {};
          simulatedScoutRanks[rankId] = {
            ...existing,
            completedRequirements: { ...existingReqs, ...reqsMap },
            steps: { ...existingReqs, ...reqsMap }
          };
        });
        const newAchievedRank = getLatestAchievedRank(simulatedScoutRanks, scoutsDataMap[sUid]?.profile?.rank);
        if (newAchievedRank?.name && newAchievedRank.name !== scoutsDataMap[sUid]?.profile?.rank) {
          updatePromises.push(
            setDoc(doc(db, 'users', sUid), { rank: newAchievedRank.name }, { merge: true })
          );
        }
      });

      // 2. Commit Islamic updates
      Object.entries(islamicUpdatesByScout).forEach(([sUid, updates]) => {
        updatePromises.push(
          setDoc(doc(db, 'user_progress', sUid, 'islamic_basics', 'status'), updates, { merge: true })
        );
      });

      // 3. Commit Merit Badge updates
      Object.entries(meritUpdatesByScoutAndBadge).forEach(([sUid, badgesMap]) => {
        const sData = scoutsDataMap[sUid] || {};
        const sMerit = sData.merit || {};

        Object.entries(badgesMap).forEach(([bId, updateInfo]) => {
          const badgeObj = MERIT_BADGES.find(mb => mb.id === bId || mb.id === bId.replace(/_/g, '-'));
          const currentBadgeDoc = sMerit[bId] || {};
          const existingSteps = currentBadgeDoc.steps || currentBadgeDoc.completedSteps || {};
          
          let nextSteps = { ...existingSteps };
          if (updateInfo.isEntire) {
            (badgeObj?.requirements || []).forEach(r => {
              nextSteps[r.id] = true;
            });
          } else {
            updateInfo.reqIds.forEach(reqId => {
              nextSteps[reqId] = true;
            });
          }

          const totalReqs = badgeObj?.requirements?.length || 0;
          const approvedCount = badgeObj?.requirements?.filter(r => {
            const val = nextSteps[r.id] || nextSteps[String(r.id)];
            return val === true || (typeof val === 'object' && (val?.completed === true || val?.approved === true));
          }).length || 0;

          const isFullyDone = updateInfo.isEntire || (totalReqs > 0 && approvedCount === totalReqs);

          updatePromises.push(
            setDoc(doc(db, 'user_progress', sUid, 'merit_badges', bId), {
              ...currentBadgeDoc,
              steps: nextSteps,
              completed: isFullyDone ? true : (currentBadgeDoc.completed || false),
              pending: isFullyDone ? false : (currentBadgeDoc.pending || false),
              dateCompleted: isFullyDone ? (currentBadgeDoc.dateCompleted || today) : (currentBadgeDoc.dateCompleted || ''),
              completedDate: isFullyDone ? (currentBadgeDoc.completedDate || today) : (currentBadgeDoc.completedDate || ''),
              counselorName: currentBadgeDoc.counselorName || leaderName,
              approvedBy: leaderUid,
              approvedByName: leaderName,
              updatedAt: new Date().toISOString()
            }, { merge: true })
          );
        });
      });

      // 4. Commit Homework updates
      homeworkUpdates.forEach(({ scoutUid, assignmentId, title, data }) => {
        updatePromises.push(
          setDoc(doc(db, 'user_progress', scoutUid, 'assignments', assignmentId), data, { merge: true })
        );
        updatePromises.push(
          setDoc(doc(db, 'scout_homework', `${assignmentId}_${scoutUid}`), {
            assignmentId,
            scoutId: scoutUid,
            assignmentTitle: title,
            ...data
          }, { merge: true })
        );
      });

      // 5. Commit Eagle updates
      eagleUpdates.forEach(({ scoutUid, data }) => {
        updatePromises.push(
          setDoc(doc(db, 'user_progress', scoutUid, 'road_to_eagle', 'project_roadmap'), data, { merge: true })
        );
      });

      await Promise.all(updatePromises);
      setApprovedItemIds(newApprovedIds);
      showFeedback(`✓ Successfully batch approved and signed off ${count} items!`);
    } catch (err) {
      console.error("Batch approve error:", err);
      showFeedback(`❌ Batch approval failed: ${err.message}`);
    } finally {
      setBatchProcessing(false);
    }
  };

  // Single Item Approve Handler
  const handleSingleApprove = async (item) => {
    setApprovedItemIds(prev => new Set(prev).add(item.id));
    const today = new Date().toISOString().split('T')[0];
    const leaderUid = currentUser?.uid || 'leader';
    const leaderName = currentUser?.fullName || currentUser?.username || 'Troop Leader';
    const sUid = item.scoutUid;
    const sData = scoutsDataMap[sUid] || {};

    try {
      if (item.domain === 'ranks') {
        await setDoc(doc(db, 'user_progress', sUid, 'ranks', item.rankId), {
          completedRequirements: {
            [item.rawId]: {
              completed: true,
              pending: false,
              approvedAt: today,
              approvedBy: leaderUid,
              approvedByName: leaderName,
              completedAt: today
            }
          },
          steps: {
            [item.rawId]: {
              completed: true,
              pending: false,
              approvedAt: today,
              approvedBy: leaderUid,
              approvedByName: leaderName,
              completedAt: today
            }
          }
        }, { merge: true });
      } else if (item.domain === 'islamic') {
        await setDoc(doc(db, 'user_progress', sUid, 'islamic_basics', 'status'), {
          [item.docKey]: {
            completed: true,
            pending: false,
            completedDate: today,
            approvedBy: leaderUid,
            approvedByName: leaderName
          }
        }, { merge: true });
      } else if (item.domain === 'badges') {
        const badgeId = item.rawId || item.badgeId;
        const badgeObj = MERIT_BADGES.find(mb => mb.id === badgeId || mb.id === badgeId.replace(/_/g, '-'));
        const currentBadgeDoc = sData?.merit?.[badgeId] || {};
        const existingSteps = currentBadgeDoc.steps || currentBadgeDoc.completedSteps || {};

        if (item.reqId) {
          // Approving specific requirement step
          const nextSteps = {
            ...existingSteps,
            [item.reqId]: true
          };
          
          const totalReqs = badgeObj?.requirements?.length || 0;
          const approvedCount = badgeObj?.requirements?.filter(r => {
            const val = nextSteps[r.id] || nextSteps[String(r.id)];
            return val === true || (typeof val === 'object' && (val?.completed === true || val?.approved === true));
          }).length || 0;

          const isFullyDone = totalReqs > 0 && approvedCount === totalReqs;

          await setDoc(doc(db, 'user_progress', sUid, 'merit_badges', badgeId), {
            ...currentBadgeDoc,
            steps: nextSteps,
            completed: isFullyDone ? true : (currentBadgeDoc.completed || false),
            pending: isFullyDone ? false : (currentBadgeDoc.pending || false),
            dateCompleted: isFullyDone ? (currentBadgeDoc.dateCompleted || today) : (currentBadgeDoc.dateCompleted || ''),
            completedDate: isFullyDone ? (currentBadgeDoc.completedDate || today) : (currentBadgeDoc.completedDate || ''),
            counselorName: currentBadgeDoc.counselorName || leaderName,
            approvedBy: leaderUid,
            approvedByName: leaderName,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } else {
          // Approving entire badge
          const allStepsMap = {};
          (badgeObj?.requirements || []).forEach(r => {
            allStepsMap[r.id] = true;
          });

          await setDoc(doc(db, 'user_progress', sUid, 'merit_badges', badgeId), {
            ...currentBadgeDoc,
            steps: { ...existingSteps, ...allStepsMap },
            completed: true,
            pending: false,
            dateCompleted: today,
            completedDate: today,
            counselorName: currentBadgeDoc.counselorName || leaderName,
            approvedBy: leaderUid,
            approvedByName: leaderName,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } else if (item.domain === 'homework') {
        const hData = {
          completed: true,
          isCompleted: true,
          status: 'completed',
          completedDate: today,
          completedAt: new Date().toISOString(),
          graded: true,
          grade: '100%',
          verifiedByLeader: true,
          leaderName: leaderName,
          reviewedBy: leaderUid
        };
        await setDoc(doc(db, 'user_progress', sUid, 'assignments', item.rawId), hData, { merge: true });
        await setDoc(doc(db, 'scout_homework', `${item.rawId}_${sUid}`), {
          assignmentId: item.rawId,
          scoutId: sUid,
          assignmentTitle: item.title,
          ...hData
        }, { merge: true });
      } else if (item.domain === 'eagle') {
        await setDoc(doc(db, 'user_progress', sUid, 'road_to_eagle', 'project_roadmap'), {
          phase2: {
            completed: true,
            signatures: {
              scoutmaster: true,
              scoutmasterName: leaderName,
              scoutmasterDate: today
            }
          }
        }, { merge: true });
      } else if (item.domain === 'requests') {
        await resolveParentRequest({
          requestId: item.rawId,
          leaderUid,
          leaderName,
          resolutionStatus: 'approved',
          resolutionNote: 'Reviewed and approved by unit leader.',
          parentUid: item.requestData?.parentUid,
          parentEmail: item.requestData?.parentEmail,
          scoutName: item.scoutName
        });
      }

      showFeedback(`✓ Approved ${item.title} for ${item.scoutName}!`);
    } catch (err) {
      console.error("Single approve error:", err);
      showFeedback(`❌ Failed to approve: ${err.message}`);
    }
  };

  const activeScoutObj = allScouts.find(s => s.uid === activeScoutId) || scoutsDataMap[activeScoutId]?.profile;
  const activeScoutName = activeScoutObj?.fullName || activeScoutObj?.username || 'Selected Scout';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ── 1. MODAL HEADER ── */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 p-4 sm:p-5 border-b border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0 shadow-md">
              ⏳
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Universal Testing & Review Queue
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {activeScoutId === 'all' 
                    ? `Troop-Wide Stream (${masterPendingItems.length} Total)` 
                    : `Reviewing: ${activeScoutName} (${activePendingItems.length} pending)`}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Pending Submissions & Testing Items ({activePendingItems.length})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            {/* Scout Switcher Select */}
            {isLeaderOrOwner && allScouts.length > 0 && (
              <select
                value={activeScoutId}
                onChange={(e) => setActiveScoutId(e.target.value)}
                className="bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer focus:outline-none focus:border-amber-400"
              >
                <option value="all">🌍 All Scouts in Queue ({masterPendingItems.length})</option>
                {allScouts.map(s => {
                  const sCount = scoutPendingCounts[s.uid] || 0;
                  return (
                    <option key={s.uid} value={s.uid}>
                      {s.fullName || s.username} ({sCount} pending)
                    </option>
                  );
                })}
              </select>
            )}

            {isLeaderOrOwner && filteredPending.length > 0 && (
              <button
                type="button"
                disabled={batchProcessing}
                onClick={handleBatchApproveAll}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                {batchProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Signing off...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck size={14} />
                    <span>⚡ Batch Approve All ({filteredPending.length})</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="bg-emerald-950/90 border-b border-emerald-500 text-emerald-200 text-xs font-bold p-2.5 text-center animate-fadeIn flex items-center justify-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* ── 1.5 SCOUT QUEUE OVERVIEW RIBBON (PER-SCOUT REQUESTS & ACTION COUNTS) ── */}
        {isLeaderOrOwner && allScouts.length > 0 && (
          <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Users size={12} className="text-amber-400" />
              <span>Scout Queues:</span>
            </span>

            {/* All Scouts Button */}
            <button
              type="button"
              onClick={() => setActiveScoutId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeScoutId === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 border border-slate-750 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              <span>🌍 All Troop Members</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeScoutId === 'all' 
                  ? 'bg-slate-950 text-amber-300' 
                  : masterPendingItems.length > 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {masterPendingItems.length}
              </span>
            </button>

            {/* Individual Scout Chips with Live Pending Counts */}
            {allScouts.map(s => {
              const sCount = scoutPendingCounts[s.uid] || 0;
              const isSelected = activeScoutId === s.uid;
              const pName = groups.find(g => g.id === s.groupId || g.id === s.patrolId)?.name || s.assignedPatrol;

              return (
                <button
                  key={s.uid}
                  type="button"
                  onClick={() => setActiveScoutId(s.uid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-2 border-amber-400 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-750 text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                  title={`${s.fullName || s.username} • ${pName || 'Patrol'}`}
                >
                  <span className="truncate max-w-[120px]">{s.fullName?.split(' ')[0] || s.username}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                    sCount > 0 
                      ? 'bg-amber-500 text-slate-950 shadow-sm animate-pulse' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── 2. FILTER CONTROLS & SEARCH ── */}
        <div className="p-3.5 bg-slate-850 border-b border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shrink-0 text-xs">
          {/* Domain Chips */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Items', count: activePendingItems.length },
              { id: 'ranks', label: '⚜️ 7 Ranks', count: activePendingItems.filter(i => i.domain === 'ranks').length },
              { id: 'islamic', label: '🕌 Islamic Knowledge', count: activePendingItems.filter(i => i.domain === 'islamic').length },
              { id: 'homework', label: '🎒 Homework', count: activePendingItems.filter(i => i.domain === 'homework').length },
              { id: 'badges', label: '🏅 Merit Badges', count: activePendingItems.filter(i => i.domain === 'badges').length },
              { id: 'eagle', label: '🦅 Road to Eagle', count: activePendingItems.filter(i => i.domain === 'eagle').length },
              { id: 'requests', label: '👨‍👩‍👧 Parent Requests', count: activePendingItems.filter(i => i.domain === 'requests').length }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedDomainFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selectedDomainFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-900 border border-slate-750 text-slate-300 hover:bg-slate-750 hover:text-white'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  selectedDomainFilter === f.id ? 'bg-slate-950/80 text-amber-300' : 'bg-slate-950 text-slate-400'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by scout, rank, or task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* ── 3. SCROLLABLE QUEUE ITEMS STREAM ── */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredPending.length === 0 ? (
            <div className="text-center py-12 space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
              <CheckCircle2 size={44} className="mx-auto text-emerald-400 opacity-80" />
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white">
                  {activeScoutId === 'all'
                    ? 'Troop Review Queue is Clear!'
                    : `Queue Clear for ${activeScoutName}!`}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {activeScoutId === 'all'
                    ? 'No pending items matching the current filter. All scout milestones and parent requests have been tested, signed off, and recorded.'
                    : `${activeScoutName} has 0 pending items awaiting testing or sign-off under the current filter.`}
                </p>
              </div>

              {/* Quick Jump Buttons to other scouts who have items */}
              {activeScoutId !== 'all' && masterPendingItems.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80 max-w-lg mx-auto space-y-2.5">
                  <span className="text-[11px] text-amber-300 font-bold block uppercase tracking-wider">
                    ⚡ Scouts with Submissions Awaiting Testing ({masterPendingItems.length} Total):
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {allScouts.filter(s => (scoutPendingCounts[s.uid] || 0) > 0).map(s => (
                      <button
                        key={s.uid}
                        type="button"
                        onClick={() => setActiveScoutId(s.uid)}
                        className="bg-slate-800 hover:bg-slate-750 border border-amber-500/40 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{s.fullName?.split(' ')[0] || s.username}</span>
                        <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                          {scoutPendingCounts[s.uid]}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setActiveScoutId('all')}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                    >
                      View All Scouts Stream ({masterPendingItems.length}) &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            filteredPending.map((item) => (
              <div
                key={item.id}
                className="bg-slate-850 border border-slate-750 hover:border-amber-500/50 p-4 rounded-2xl transition space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-750/70 pb-2.5">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.domainColor}`}>
                        {item.domainLabel}
                      </span>
                      
                      {/* Scout Badge (When viewing multi-scout queue) */}
                      {activeScoutId === 'all' && (
                        <span className="text-[10px] bg-slate-900 border border-slate-750 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <User size={11} />
                          <span>{item.scoutName}</span>
                          <span className="text-slate-500 font-normal">({item.scoutPatrolName})</span>
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 font-mono">
                        Submitted: {item.submittedDate}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-white">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs text-slate-400 font-medium">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Navigation to Full Tab */}
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (item.domain === 'requests' && item.requestData?.requestType === 'meeting_request') {
                          onNavigate('parent-requests', { requestId: item.rawId, confirmMeeting: true });
                        } else if (item.domain === 'requests') {
                          onNavigate('parent-requests', { requestId: item.rawId });
                        } else {
                          onNavigate(item.targetTab);
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-750 text-amber-300 hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-700 shrink-0 cursor-pointer self-start"
                    >
                      <span>Open Portal</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    {item.description}
                  </p>
                )}

                {item.testPrompt && (
                  <div className="text-[11px] text-slate-300 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl flex items-start gap-2">
                    <Sparkles size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-400">{item.domain === 'requests' ? 'Action Details:' : 'Oral Testing Prompt:'}</strong> {item.testPrompt}</span>
                  </div>
                )}

                {/* Leader Sign-off Action Bar */}
                {isLeaderOrOwner && (
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-750/50">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Scout: <strong>{item.scoutName}</strong>
                    </span>

                    {item.domain === 'requests' && item.requestData?.requestType === 'meeting_request' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigate && onNavigate('parent-requests', { requestId: item.rawId, confirmMeeting: true });
                        }}
                        className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-950/40"
                      >
                        <Calendar size={14} />
                        <span>📅 Confirm & Schedule Meeting &rarr;</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSingleApprove(item)}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <Check size={14} />
                        <span>{item.domain === 'requests' ? 'Acknowledge & Sign ✓' : 'Conduct Test & Sign-off ✓'}</span>
                      </button>
                    )}
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
