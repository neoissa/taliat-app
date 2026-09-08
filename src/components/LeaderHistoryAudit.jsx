import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { 
  History, 
  CheckCheck, 
  Search, 
  Filter, 
  Clock, 
  Printer, 
  Download, 
  ShieldCheck, 
  Award, 
  Star, 
  BookOpen, 
  HeartPulse, 
  Check, 
  X, 
  FileSpreadsheet, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare 
} from 'lucide-react';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS, KARBALA_CHARACTERS_DATA } from '../data/islamicBasicsData';

export default function LeaderHistoryAudit({ currentUser, onNavigate }) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [serviceLogs, setServiceLogs] = useState([]);
  const [scoutsAdvancementData, setScoutsAdvancementData] = useState({});
  const [loading, setLoading] = useState(true);

  // Filter States
  const [scoutFilter, setScoutFilter] = useState('all');
  const [patrolFilter, setPatrolFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [approverFilter, setApproverFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7days' | '30days' | '90days' | 'season'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'timeline'
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // 1. Subscribe to Core Collections (Users, Groups, Service Logs)
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => console.warn("LeaderHistoryAudit users error:", err));

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    }, (err) => console.warn("LeaderHistoryAudit groups error:", err));

    const unsubService = onSnapshot(collection(db, 'service_logs'), (snap) => {
      setServiceLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("LeaderHistoryAudit service_logs error:", err));

    return () => {
      unsubUsers();
      unsubGroups();
      unsubService();
    };
  }, []);

  // 2. Real-time Multi-Scout Subcollection Listener for Advancement & Approvals
  useEffect(() => {
    const scoutList = users.filter(u => u.role === 'scout');
    if (scoutList.length === 0) return;

    const unsubs = [];

    scoutList.forEach(scout => {
      const sUid = scout.uid;

      // 1. BSA Ranks
      unsubs.push(onSnapshot(collection(db, 'user_progress', sUid, 'ranks'), (snap) => {
        const ranksMap = {};
        snap.docs.forEach(d => { ranksMap[d.id] = d.data(); });
        setScoutsAdvancementData(prev => ({
          ...prev,
          [sUid]: { ...(prev[sUid] || {}), ranks: ranksMap }
        }));
      }, (err) => console.warn(`History ranks listener [${sUid}]:`, err)));

      // 2. Merit Badges
      unsubs.push(onSnapshot(collection(db, 'user_progress', sUid, 'merit_badges'), (snap) => {
        const meritMap = {};
        snap.docs.forEach(d => { meritMap[d.id] = d.data(); });
        setScoutsAdvancementData(prev => ({
          ...prev,
          [sUid]: { ...(prev[sUid] || {}), merit: meritMap }
        }));
      }, (err) => console.warn(`History merit listener [${sUid}]:`, err)));

      // 3. Islamic Basics
      unsubs.push(onSnapshot(doc(db, 'user_progress', sUid, 'islamic_basics', 'status'), (snap) => {
        setScoutsAdvancementData(prev => ({
          ...prev,
          [sUid]: { ...(prev[sUid] || {}), islamic: snap.exists() ? snap.data() : {} }
        }));
      }, (err) => console.warn(`History islamic listener [${sUid}]:`, err)));

      // 4. Assignments & Homework
      unsubs.push(onSnapshot(collection(db, 'user_progress', sUid, 'assignments'), (snap) => {
        const assignMap = {};
        snap.docs.forEach(d => { assignMap[d.id] = d.data(); });
        setScoutsAdvancementData(prev => ({
          ...prev,
          [sUid]: { ...(prev[sUid] || {}), assignments: assignMap }
        }));
      }, (err) => console.warn(`History assignments listener [${sUid}]:`, err)));

      // 5. Road to Eagle
      unsubs.push(onSnapshot(doc(db, 'user_progress', sUid, 'road_to_eagle', 'project_roadmap'), (snap) => {
        setScoutsAdvancementData(prev => ({
          ...prev,
          [sUid]: { ...(prev[sUid] || {}), eagle: snap.exists() ? snap.data() : {} }
        }));
      }, (err) => console.warn(`History eagle listener [${sUid}]:`, err)));
    });

    return () => unsubs.forEach(u => u());
  }, [users]);

  // 3. Aggregate All Sign-Offs into Unified Historical Audit Records
  const allApprovalHistory = useMemo(() => {
    const list = [];
    const scoutUsers = users.filter(u => u.role === 'scout');

    scoutUsers.forEach(scout => {
      const sData = scoutsAdvancementData[scout.uid] || {};
      const sRanks = sData.ranks || {};
      const sMerit = sData.merit || {};
      const sIslamic = sData.islamic || {};
      const sAssignments = sData.assignments || {};
      const sEagle = sData.eagle || {};
      const scoutPatrol = groups.find(g => g.id === scout.groupId || g.id === scout.patrolId)?.name || scout.patrolName || scout.patrol || 'Unassigned Patrol';

      // 1. BSA Ranks & Category Requirements
      RANKS_DATA.forEach(rank => {
        const rData = sRanks[rank.id];
        if (!rData) return;

        // Overall Rank Sign-off
        const isRankDone = rData.completed === true || rData.approved === true || rData.status === 'completed';
        if (isRankDone) {
          const approver = rData.approvedBy || rData.completedBy || rData.signerName || rData.leaderName || 'Scoutmaster';
          const approverRole = rData.approverRole || rData.signerRole || 'Scoutmaster';
          const approvedAt = rData.approvedAt || rData.completedAt || rData.completedDate || rData.updatedAt || new Date().toISOString();
          list.push({
            id: `rank_${scout.uid}_${rank.id}`,
            scoutId: scout.uid,
            scoutName: scout.fullName || scout.username || 'Scout',
            scoutRank: scout.rank || 'Scout',
            scoutPhotoURL: scout.photoURL || null,
            patrolId: scout.groupId || scout.patrolId || '',
            patrolName: scoutPatrol,
            domain: 'ranks',
            actionType: 'Rank Milestone Achievement',
            domainLabel: 'BSA Rank Achieved',
            domainBadgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600',
            domainIcon: '⚜️',
            itemTitle: `${rank.name} Rank Achieved`,
            itemSubtitle: rank.description || 'All category requirements verified and approved by Scoutmaster Board of Review.',
            approvedBy: approver,
            approverRole: approverRole,
            approvedAt: approvedAt,
            timestamp: new Date(approvedAt).getTime() || 0,
            feedback: rData.notes || rData.feedback || ''
          });
        }

        // Individual Category Requirements
        (rank.categories || []).forEach(cat => {
          (cat.requirements || []).forEach(req => {
            const reqData = (rData.completedRequirements && rData.completedRequirements[req.id]) || (rData.steps && rData.steps[req.id]) || rData[req.id];
            const isReqDone = reqData === true || reqData?.completed === true || reqData === 'completed' || reqData === 'approved' || reqData?.approved === true;
            if (isReqDone) {
              const approver = reqData?.approvedBy || reqData?.signerName || reqData?.completedBy || rData.approvedBy || 'Troop Leader';
              const approverRole = reqData?.approverRole || reqData?.signerRole || rData.approverRole || 'Leader';
              const approvedAt = reqData?.approvedAt || reqData?.completedAt || reqData?.completedDate || rData.approvedAt || rData.completedAt || new Date().toISOString();
              list.push({
                id: `rankreq_${scout.uid}_${rank.id}_${req.id}`,
                scoutId: scout.uid,
                scoutName: scout.fullName || scout.username || 'Scout',
                scoutRank: scout.rank || 'Scout',
                scoutPhotoURL: scout.photoURL || null,
                patrolId: scout.groupId || scout.patrolId || '',
                patrolName: scoutPatrol,
                domain: 'ranks',
                actionType: 'Rank Step Sign-Off',
                domainLabel: `${rank.name} Requirement`,
                domainBadgeColor: 'bg-emerald-950/70 text-emerald-200 border-emerald-700/60',
                domainIcon: '⚜️',
                itemTitle: `${rank.name} — Req ${req.number || req.id}`,
                itemSubtitle: req.text,
                approvedBy: approver,
                approverRole: approverRole,
                approvedAt: approvedAt,
                timestamp: new Date(approvedAt).getTime() || 0,
                feedback: reqData?.notes || reqData?.feedback || ''
              });
            }
          });
        });
      });

      // 2. Merit Badges & Steps
      MERIT_BADGES.forEach(badge => {
        const normId = badge.id.replace(/-/g, '_');
        const bData = sMerit[badge.id] || sMerit[normId];
        if (!bData) return;

        const isBadgeDone = bData.status === 'completed' || bData.isCompleted === true || bData.completed === true || bData.approved === true;
        if (isBadgeDone) {
          const approver = bData.approvedBy || bData.counselorName || bData.completedBy || 'Merit Badge Counselor';
          const approverRole = bData.approverRole || 'Counselor';
          const approvedAt = bData.approvedAt || bData.earnedDate || bData.completedDate || bData.completedAt || bData.updatedAt || new Date().toISOString();
          list.push({
            id: `mb_${scout.uid}_${badge.id}`,
            scoutId: scout.uid,
            scoutName: scout.fullName || scout.username || 'Scout',
            scoutRank: scout.rank || 'Scout',
            scoutPhotoURL: scout.photoURL || null,
            patrolId: scout.groupId || scout.patrolId || '',
            patrolName: scoutPatrol,
            domain: 'merit_badges',
            actionType: 'Merit Badge Completion',
            domainLabel: badge.eagleRequired ? 'Eagle-Required Badge' : 'Elective Merit Badge',
            domainBadgeColor: badge.eagleRequired ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-sky-950 text-sky-300 border-sky-600',
            domainIcon: badge.eagleRequired ? '🏅' : '🎖️',
            itemTitle: `${badge.name} Merit Badge`,
            itemSubtitle: badge.description || 'Full badge requirements completed and certified by registered counselor.',
            approvedBy: approver,
            approverRole: approverRole,
            approvedAt: approvedAt,
            timestamp: new Date(approvedAt).getTime() || 0,
            feedback: bData.notes || bData.feedback || ''
          });
        }

        // Individual Steps
        (badge.requirements || []).forEach(req => {
          const stepData = (bData.completedSteps && bData.completedSteps[req.id]) || (bData.steps && bData.steps[req.id]) || bData[req.id];
          const isStepDone = stepData === true || stepData?.completed === true || stepData === 'completed' || stepData === 'approved' || stepData?.approved === true;
          if (isStepDone) {
            const approver = stepData?.approvedBy || stepData?.signerName || bData.approvedBy || 'Merit Badge Counselor';
            const approverRole = stepData?.approverRole || bData.approverRole || 'Counselor';
            const approvedAt = stepData?.approvedAt || stepData?.completedAt || stepData?.completedDate || bData.approvedAt || bData.completedAt || new Date().toISOString();
            list.push({
              id: `mbreq_${scout.uid}_${badge.id}_${req.id}`,
              scoutId: scout.uid,
              scoutName: scout.fullName || scout.username || 'Scout',
              scoutRank: scout.rank || 'Scout',
              scoutPhotoURL: scout.photoURL || null,
              patrolId: scout.groupId || scout.patrolId || '',
              patrolName: scoutPatrol,
              domain: 'merit_badges',
              actionType: 'Badge Requirement Step',
              domainLabel: `${badge.name} Requirement`,
              domainBadgeColor: 'bg-sky-950/70 text-sky-200 border-sky-700/60',
              domainIcon: '🎖️',
              itemTitle: `${badge.name} — Req ${req.id}`,
              itemSubtitle: req.text,
              approvedBy: approver,
              approverRole: approverRole,
              approvedAt: approvedAt,
              timestamp: new Date(approvedAt).getTime() || 0,
              feedback: stepData?.notes || stepData?.feedback || ''
            });
          }
        });
      });

      // 3. Islamic Foundations & Topics
      ISLAMIC_BASICS_TOPICS.forEach(topic => {
        const tData = sIslamic[topic.id] || (sIslamic.completedTopics && sIslamic.completedTopics[topic.id]);
        const isTopicDone = tData === true || tData?.completed === true || tData === 'completed' || tData === 'approved' || tData?.approved === true;
        if (isTopicDone) {
          const approver = tData?.approvedBy || tData?.signerName || sIslamic.approvedBy || 'Murshid / Halqa Leader';
          const approverRole = tData?.approverRole || 'Halqa Leader';
          const approvedAt = tData?.approvedAt || tData?.completedDate || tData?.completedAt || sIslamic.updatedAt || new Date().toISOString();
          list.push({
            id: `islamic_${scout.uid}_${topic.id}`,
            scoutId: scout.uid,
            scoutName: scout.fullName || scout.username || 'Scout',
            scoutRank: scout.rank || 'Scout',
            scoutPhotoURL: scout.photoURL || null,
            patrolId: scout.groupId || scout.patrolId || '',
            patrolName: scoutPatrol,
            domain: 'islamic',
            actionType: 'Islamic Knowledge Mastery',
            domainLabel: topic.category || 'Islamic Foundations',
            domainBadgeColor: 'bg-purple-950 text-purple-300 border-purple-600',
            domainIcon: '🕌',
            itemTitle: `${topic.category}: ${topic.title}`,
            itemSubtitle: topic.text?.split('\n')[0] || 'Knowledge checkpoint demonstrated and verified.',
            approvedBy: approver,
            approverRole: approverRole,
            approvedAt: approvedAt,
            timestamp: new Date(approvedAt).getTime() || 0,
            feedback: tData?.notes || tData?.feedback || ''
          });
        }
      });

      KARBALA_CHARACTERS_DATA.forEach(char => {
        const cData = sIslamic[char.id] || (sIslamic.completedTopics && sIslamic.completedTopics[char.id]);
        const isCharDone = cData === true || cData?.completed === true || cData === 'completed' || cData === 'approved';
        if (isCharDone) {
          const approver = cData?.approvedBy || sIslamic.approvedBy || 'Halqa Leader';
          const approvedAt = cData?.approvedAt || cData?.completedDate || cData?.completedAt || new Date().toISOString();
          list.push({
            id: `karbala_${scout.uid}_${char.id}`,
            scoutId: scout.uid,
            scoutName: scout.fullName || scout.username || 'Scout',
            scoutRank: scout.rank || 'Scout',
            scoutPhotoURL: scout.photoURL || null,
            patrolId: scout.groupId || scout.patrolId || '',
            patrolName: scoutPatrol,
            domain: 'islamic',
            actionType: 'Karbala Role Model Mastery',
            domainLabel: 'Karbala Role Models',
            domainBadgeColor: 'bg-purple-950 text-purple-300 border-purple-600',
            domainIcon: '🕌',
            itemTitle: `Karbala Personality: ${char.name}`,
            itemSubtitle: char.summary || char.title || 'Life story and moral lessons mastered.',
            approvedBy: approver,
            approverRole: 'Halqa Leader',
            approvedAt: approvedAt,
            timestamp: new Date(approvedAt).getTime() || 0,
            feedback: cData?.notes || ''
          });
        }
      });

      // 4. Assignments & Homework
      Object.entries(sAssignments).forEach(([assignId, aData]) => {
        const isAssignDone = aData?.completed === true || aData?.status === 'completed' || aData?.approved === true;
        if (isAssignDone) {
          const approver = aData.approvedBy || aData.gradedBy || aData.leaderName || 'Patrol Leader';
          const approverRole = aData.approverRole || 'Leader';
          const approvedAt = aData.approvedAt || aData.completedAt || aData.gradedAt || aData.submittedAt || new Date().toISOString();
          list.push({
            id: `assign_${scout.uid}_${assignId}`,
            scoutId: scout.uid,
            scoutName: scout.fullName || scout.username || 'Scout',
            scoutRank: scout.rank || 'Scout',
            scoutPhotoURL: scout.photoURL || null,
            patrolId: scout.groupId || scout.patrolId || '',
            patrolName: scoutPatrol,
            domain: 'assignments',
            actionType: 'Homework / Quest Sign-Off',
            domainLabel: aData.category || 'Homework & Quests',
            domainBadgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-600',
            domainIcon: '🎒',
            itemTitle: aData.title || 'Homework Assignment',
            itemSubtitle: aData.description || 'Weekly assignment quest submitted and signed off.',
            approvedBy: approver,
            approverRole: approverRole,
            approvedAt: approvedAt,
            timestamp: new Date(approvedAt).getTime() || 0,
            feedback: aData.leaderFeedback || aData.notes || ''
          });
        }
      });

      // 5. Road to Eagle Milestones
      if (sEagle && typeof sEagle === 'object') {
        const milestones = [
          { key: 'projectProposal', title: 'Eagle Project Proposal Approved' },
          { key: 'fundraisingApp', title: 'Eagle Project Fundraising Application Approved' },
          { key: 'projectExecution', title: 'Eagle Service Project Execution Certified' },
          { key: 'projectReport', title: 'Eagle Final Project Report & Beneficiary Sign-Off' },
          { key: 'scoutmasterConference', title: 'Eagle Scoutmaster Conference Completed' },
          { key: 'boardOfReview', title: 'Eagle Board of Review Passed' }
        ];

        milestones.forEach(m => {
          const mData = sEagle[m.key];
          if (mData && (mData.completed === true || mData.approved === true || mData.status === 'approved' || mData.status === 'completed')) {
            const approver = mData.approvedBy || 'Eagle Scout Board';
            const approvedAt = mData.approvedAt || mData.completedAt || new Date().toISOString();
            list.push({
              id: `eagle_${scout.uid}_${m.key}`,
              scoutId: scout.uid,
              scoutName: scout.fullName || scout.username || 'Scout',
              scoutRank: scout.rank || 'Scout',
              scoutPhotoURL: scout.photoURL || null,
              patrolId: scout.groupId || scout.patrolId || '',
              patrolName: scoutPatrol,
              domain: 'eagle',
              actionType: 'Eagle Milestone Sign-Off',
              domainLabel: 'Road to Eagle Milestone',
              domainBadgeColor: 'bg-rose-950 text-rose-300 border-rose-600',
              domainIcon: '🦅',
              itemTitle: m.title,
              itemSubtitle: 'Official BSA Eagle Scout milestone certification.',
              approvedBy: approver,
              approverRole: 'Eagle Board / Scoutmaster',
              approvedAt: approvedAt,
              timestamp: new Date(approvedAt).getTime() || 0,
              feedback: mData.notes || ''
            });
          }
        });
      }

      // 6. Service Hours
      const scoutService = serviceLogs.filter(l => l.scoutId === scout.uid || l.userId === scout.uid);
      scoutService.forEach(log => {
        if (log.status === 'approved' || log.verified === true || Number(log.hours) > 0) {
          const approver = log.approvedBy || log.verifiedBy || 'Service Project Coordinator';
          const approvedAt = log.approvedAt || log.date || log.createdAt || new Date().toISOString();
          list.push({
            id: `service_${log.id}`,
            scoutId: scout.uid,
            scoutName: scout.fullName || scout.username || 'Scout',
            scoutRank: scout.rank || 'Scout',
            scoutPhotoURL: scout.photoURL || null,
            patrolId: scout.groupId || scout.patrolId || '',
            patrolName: scoutPatrol,
            domain: 'service',
            actionType: 'Service Hours Verification',
            domainLabel: 'Service Hours Verified',
            domainBadgeColor: 'bg-teal-950 text-teal-300 border-teal-600',
            domainIcon: '🤝',
            itemTitle: `${log.activity || 'Community Service'} (${log.hours || 0} Hours)`,
            itemSubtitle: log.notes || log.description || 'Verified community service project hours.',
            approvedBy: approver,
            approverRole: 'Service Coordinator',
            approvedAt: approvedAt,
            timestamp: new Date(approvedAt).getTime() || 0,
            feedback: log.notes || ''
          });
        }
      });
    });

    // Sort descending by timestamp (newest first)
    list.sort((a, b) => b.timestamp - a.timestamp);
    return list;
  }, [users, scoutsAdvancementData, groups, serviceLogs]);

  // Unique Approvers List
  const uniqueApproversList = useMemo(() => {
    const map = new Set();
    allApprovalHistory.forEach(item => {
      if (item.approvedBy && item.approvedBy !== 'Troop Leader') {
        map.add(item.approvedBy);
      }
    });
    return Array.from(map).sort();
  }, [allApprovalHistory]);

  const scoutsList = useMemo(() => users.filter(u => u.role === 'scout'), [users]);

  // Filtered History
  const filteredApprovalHistory = useMemo(() => {
    let list = [...allApprovalHistory];

    if (scoutFilter !== 'all') {
      list = list.filter(item => item.scoutId === scoutFilter);
    }
    if (patrolFilter !== 'all') {
      list = list.filter(item => item.patrolId === patrolFilter);
    }
    if (domainFilter !== 'all') {
      list = list.filter(item => item.domain === domainFilter);
    }
    if (approverFilter !== 'all') {
      list = list.filter(item => item.approvedBy === approverFilter);
    }
    if (dateFilter !== 'all') {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (dateFilter === '7days') {
        list = list.filter(item => now - item.timestamp <= 7 * oneDay);
      } else if (dateFilter === '30days') {
        list = list.filter(item => now - item.timestamp <= 30 * oneDay);
      } else if (dateFilter === '90days') {
        list = list.filter(item => now - item.timestamp <= 90 * oneDay);
      } else if (dateFilter === 'season') {
        const year = new Date().getFullYear();
        const seasonStart = new Date(year, 8, 1).getTime();
        list = list.filter(item => item.timestamp >= seasonStart);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => {
        return (
          item.scoutName.toLowerCase().includes(q) ||
          item.itemTitle.toLowerCase().includes(q) ||
          (item.itemSubtitle && item.itemSubtitle.toLowerCase().includes(q)) ||
          item.approvedBy.toLowerCase().includes(q) ||
          item.domainLabel.toLowerCase().includes(q) ||
          item.actionType.toLowerCase().includes(q) ||
          (item.feedback && item.feedback.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [allApprovalHistory, scoutFilter, patrolFilter, domainFilter, approverFilter, dateFilter, searchQuery]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredApprovalHistory.length === 0) {
      alert("No approval records match your current filter criteria.");
      return;
    }

    const headers = [
      "Timestamp",
      "Date",
      "Scout Name",
      "Patrol",
      "Action Type",
      "Domain",
      "Milestone / Requirement Approved",
      "Approved By (Leader Name)",
      "Approver Role",
      "Feedback / Notes"
    ];

    const rows = filteredApprovalHistory.map(item => [
      `"${item.approvedAt || ''}"`,
      `"${(item.approvedAt || '').split('T')[0]}"`,
      `"${item.scoutName}"`,
      `"${item.patrolName}"`,
      `"${item.actionType}"`,
      `"${item.domainLabel}"`,
      `"${item.itemTitle.replace(/"/g, '""')}"`,
      `"${item.approvedBy.replace(/"/g, '""')}"`,
      `"${item.approverRole || ''}"`,
      `"${(item.feedback || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `troop100_approvals_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <CheckCheck size={13} className="text-emerald-400" />
            <span>Total Sign-Offs</span>
          </span>
          <span className="text-2xl font-black text-white font-mono block">
            {allApprovalHistory.length}
          </span>
          <span className="text-[10px] text-slate-400">Certified entries</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Award size={13} className="text-emerald-400" />
            <span>BSA 7 Ranks</span>
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">
            {allApprovalHistory.filter(i => i.domain === 'ranks').length}
          </span>
          <span className="text-[10px] text-slate-400">Rank requirements</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Star size={13} className="text-amber-400" />
            <span>Merit Badges</span>
          </span>
          <span className="text-2xl font-black text-amber-400 font-mono block">
            {allApprovalHistory.filter(i => i.domain === 'merit_badges').length}
          </span>
          <span className="text-[10px] text-slate-400">Badges & steps</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <BookOpen size={13} className="text-purple-400" />
            <span>Islamic Basics</span>
          </span>
          <span className="text-2xl font-black text-purple-400 font-mono block">
            {allApprovalHistory.filter(i => i.domain === 'islamic').length}
          </span>
          <span className="text-[10px] text-slate-400">Mastered topics</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <HeartPulse size={13} className="text-teal-400" />
            <span>Service Logs</span>
          </span>
          <span className="text-2xl font-black text-teal-400 font-mono block">
            {allApprovalHistory.filter(i => i.domain === 'service').length}
          </span>
          <span className="text-[10px] text-slate-400">Verified projects</span>
        </div>

        <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-sky-400" />
            <span>Approving Leaders</span>
          </span>
          <span className="text-2xl font-black text-sky-400 font-mono block">
            {uniqueApproversList.length}
          </span>
          <span className="text-[10px] text-slate-400">Active signers</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-850 border border-slate-750 p-5 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
              <History size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">History & Approvals Audit Log</h3>
              <p className="text-xs text-slate-400">
                Track who approved each scout advancement requirement, badge, or assignment and when.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-755">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={13} />
                <span>Audit Table</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'timeline'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock size={13} />
                <span>Timeline</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Export filtered audit log to CSV"
            >
              <Download size={13} className="text-sky-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Print Official Advancement Record"
            >
              <Printer size={13} />
              <span>Print Audit Sheet</span>
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-755">
          {/* Scout Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Scout</label>
            <select
              value={scoutFilter}
              onChange={(e) => setScoutFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Scouts ({scoutsList.length})</option>
              {scoutsList.map(s => (
                <option key={s.uid} value={s.uid}>{s.fullName || s.username} ({s.rank || 'Scout'})</option>
              ))}
            </select>
          </div>

          {/* Patrol Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patrol</label>
            <select
              value={patrolFilter}
              onChange={(e) => setPatrolFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Patrols ({groups.length})</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} Patrol</option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Advancement Domain</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Domains (Ranks, Badges, Islamic, etc.)</option>
              <option value="ranks">⚜️ BSA 7 Ranks & Reqs</option>
              <option value="merit_badges">🏅 Merit Badges & Steps</option>
              <option value="islamic">🕌 Islamic Foundations & Karbala</option>
              <option value="assignments">🎒 Homework & Quests</option>
              <option value="eagle">🦅 Road to Eagle Milestones</option>
              <option value="service">🤝 Community Service Logs</option>
            </select>
          </div>

          {/* Approver Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Approved By (Leader)</label>
            <select
              value={approverFilter}
              onChange={(e) => setApproverFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Approving Leaders ({uniqueApproversList.length})</option>
              {uniqueApproversList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Date Horizon Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date Horizon</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="7days">⚡ Last 7 Days</option>
              <option value="30days">📅 Last 30 Days</option>
              <option value="90days">🗓️ Last 90 Days</option>
              <option value="season">⚜️ Current 2026-2027 Season</option>
            </select>
          </div>
        </div>

        {/* Live Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search audit records by scout name, requirement title, badge, action type, approver, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white font-mono">{filteredApprovalHistory.length}</strong> verified audit records
            {(scoutFilter !== 'all' || domainFilter !== 'all' || approverFilter !== 'all' || dateFilter !== 'all' || searchQuery) && ' (Filtered)'}
          </span>

          {(scoutFilter !== 'all' || patrolFilter !== 'all' || domainFilter !== 'all' || approverFilter !== 'all' || dateFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setScoutFilter('all');
                setPatrolFilter('all');
                setDomainFilter('all');
                setApproverFilter('all');
                setDateFilter('all');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer text-[11px]"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* ── VIEW MODE 1: AUDIT TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="bg-slate-850 border border-slate-750 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-755">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Scout Name</th>
                  <th className="p-3.5">Patrol</th>
                  <th className="p-3.5">Action Type</th>
                  <th className="p-3.5">Milestone / Requirement Approved</th>
                  <th className="p-3.5">Approved By (Leader Name)</th>
                  <th className="p-3.5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-755">
                {filteredApprovalHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500 italic">
                      No approval audit records found matching your active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApprovalHistory.map((item) => {
                    const dateStr = item.approvedAt ? item.approvedAt.split('T')[0] : '';
                    const timeStr = item.approvedAt && item.approvedAt.includes('T') ? item.approvedAt.split('T')[1].substring(0, 5) : '';

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">
                          <span className="block font-bold text-white">{dateStr}</span>
                          <span className="text-[10px] text-slate-500">{timeStr}</span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <strong className="text-white block truncate">{item.scoutName}</strong>
                            <span className="text-[9px] bg-slate-900 border border-slate-750 text-slate-400 px-1.5 py-0.2 rounded font-bold">
                              {item.scoutRank}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-300 whitespace-nowrap">
                          {item.patrolName}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.domainBadgeColor}`}>
                            {item.domainIcon} {item.actionType}
                          </span>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <strong className="text-white block font-bold truncate">{item.itemTitle}</strong>
                          {item.itemSubtitle && (
                            <span className="text-[11px] text-slate-400 block truncate font-sans">{item.itemSubtitle}</span>
                          )}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-bold text-emerald-300 block">{item.approvedBy}</span>
                          {item.approverRole && (
                            <span className="text-[10px] text-slate-400 font-mono block">{item.approverRole}</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full">
                            <Check size={10} /> Certified
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── VIEW MODE 2: VISUAL TIMELINE VIEW ── */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {filteredApprovalHistory.length === 0 ? (
            <div className="bg-slate-850 border border-slate-755 p-16 rounded-3xl text-center space-y-3">
              <CheckCheck size={48} className="mx-auto text-slate-600" />
              <h4 className="text-base font-extrabold text-white">No Approval Records Found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No verified advancement sign-offs match your active filters. Try clearing the search query or changing filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApprovalHistory.map((item) => {
                const isExpanded = expandedCardId === item.id;
                const formattedDate = item.approvedAt ? new Date(item.approvedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }) : 'Recorded';

                return (
                  <div
                    key={item.id}
                    className="bg-slate-850 border border-slate-755 hover:border-slate-700 transition p-5 sm:p-6 rounded-3xl shadow-xl space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-sm shrink-0 overflow-hidden shadow-md">
                          {item.scoutPhotoURL ? (
                            <img src={item.scoutPhotoURL} alt={item.scoutName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.scoutName?.charAt(0) || 'S'}</span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-white text-sm sm:text-base font-extrabold">{item.scoutName}</strong>
                            <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                              ⚜️ {item.scoutRank}
                            </span>
                            <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                              👥 {item.patrolName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${item.domainBadgeColor}`}>
                          {item.domainIcon} {item.actionType}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                          🕒 {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <span>{item.itemTitle}</span>
                      </h4>
                      {item.itemSubtitle && (
                        <p className={`text-xs text-slate-300 leading-relaxed font-sans ${!isExpanded ? 'line-clamp-2' : ''}`}>
                          {item.itemSubtitle}
                        </p>
                      )}
                      {item.itemSubtitle && item.itemSubtitle.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer flex items-center gap-1 pt-0.5"
                        >
                          <span>{isExpanded ? 'Show less' : 'Read full requirement text'}</span>
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-900/90 border border-slate-750 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                          <ShieldCheck size={15} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Approved By:</span>
                            <strong className="text-emerald-300 font-extrabold">{item.approvedBy}</strong>
                            {item.approverRole && (
                              <span className="text-[10px] text-slate-400 font-mono">({item.approverRole})</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            Digitally signed & verified in official Troop 100 advancement register.
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 self-start sm:self-auto">
                        <Check size={11} /> Verified Audit Entry
                      </span>
                    </div>

                    {item.feedback && (
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 italic flex items-start gap-2">
                        <MessageSquare size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-400 font-bold not-italic block text-[10px]">Leader Examination Notes & Feedback:</strong>
                          <p className="mt-0.5 font-sans not-italic">{item.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PRINTABLE AUDIT SHEET MODAL ── */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-4xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Printer size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Official Advancement Audit Sheet</h3>
                  <span className="text-[11px] text-slate-400">Troop Dhulfiqār 100 &bull; Ready for Council Inspection & Print</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Printer size={13} />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-200">
              <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono font-black block">
                    Scouting America &bull; Muslim Scout Fellowship
                  </span>
                  <h2 className="text-xl font-black text-white">Troop Dhulfiqār 100 — Advancement History Log</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official record of certified BSA Rank Requirements, Merit Badges, and Islamic Foundations masteries.
                  </p>
                </div>
                <div className="text-right text-xs font-mono shrink-0">
                  <span className="text-slate-400 block">Date Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="text-emerald-400 font-bold block">Total Verified Records: {filteredApprovalHistory.length}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-700 text-[10px] uppercase font-bold text-slate-400">
                      <th className="py-2.5 px-2">#</th>
                      <th className="py-2.5 px-2">Date</th>
                      <th className="py-2.5 px-2">Scout Name</th>
                      <th className="py-2.5 px-2">Patrol</th>
                      <th className="py-2.5 px-2">Action Type</th>
                      <th className="py-2.5 px-2">Advancement Item</th>
                      <th className="py-2.5 px-2">Approved By</th>
                      <th className="py-2.5 px-2 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredApprovalHistory.map((item, idx) => (
                      <tr key={`print_${item.id}_${idx}`} className="text-[11px]">
                        <td className="py-2 px-2 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-2 px-2 font-mono whitespace-nowrap text-slate-300">
                          {item.approvedAt ? item.approvedAt.split('T')[0] : 'Recorded'}
                        </td>
                        <td className="py-2 px-2 font-bold text-white whitespace-nowrap">
                          {item.scoutName} <span className="font-normal text-slate-400 text-[10px]">({item.scoutRank})</span>
                        </td>
                        <td className="py-2 px-2 text-slate-300 whitespace-nowrap">{item.patrolName}</td>
                        <td className="py-2 px-2 whitespace-nowrap text-[10px] font-bold text-sky-400">{item.actionType}</td>
                        <td className="py-2 px-2 max-w-xs truncate text-slate-200 font-semibold">{item.itemTitle}</td>
                        <td className="py-2 px-2 whitespace-nowrap text-slate-300 font-medium">
                          {item.approvedBy} {item.approverRole ? `(${item.approverRole})` : ''}
                        </td>
                        <td className="py-2 px-2 text-right whitespace-nowrap text-emerald-400 font-mono font-bold">
                          ✓ Signed
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 border-t-2 border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Scoutmaster Sign-Off:</span>
                  <div className="border-b border-slate-600 h-6"></div>
                  <span className="text-[10px] text-slate-500 font-mono block">Signature & Date</span>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Advancement Chair:</span>
                  <div className="border-b border-slate-600 h-6"></div>
                  <span className="text-[10px] text-slate-500 font-mono block">Signature & Date</span>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Troop Committee Official Stamp:</span>
                  <div className="border border-dashed border-slate-700 h-14 rounded-xl flex items-center justify-center text-[10px] text-slate-600">
                    Official Troop Seal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
