import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { RANKS_DATA, getLatestAchievedRank, getNextIncompleteRank, getRankCompletionPercentage, isRankCompleted } from '../data/ranksData';
import { MERIT_BADGES } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import { signPublishedReportByParent } from '../services/publishedReportsService';
import { createParentRequest, cancelMeetingRequestByParent, parentRespondToMeetingInvite } from '../services/parentRequestService';
import { syncParentProfileToChildren } from '../services/familyProfileSyncService';
import ConferenceCountdown from './ConferenceCountdown';
import RankIcon from './RankIcon';
import ScoutProgressReport from './ScoutProgressReport';
import SignaturePadModal from './SignaturePadModal';
import DigitalVerificationStamp from './DigitalVerificationStamp';
import PublishedReportViewerModal from './PublishedReportViewerModal';
import ParentAlertsFeed from './ParentAlertsFeed';
import ParentEagleTracker from './ParentEagleTracker';
import ParentPatrolResources from './ParentPatrolResources';
import {
  Award,
  Star,
  Compass,
  Target,
  Calendar,
  Clock,
  BookOpen,
  Heart,
  HeartPulse,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  User,
  Users,
  Layers,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Check,
  ArrowRight,
  Zap,
  Bell,
  CheckSquare,
  AlertCircle,
  Home,
  Phone,
  Mail,
  Edit3,
  Save,
  Send,
  X,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bookmark,
  CheckCircle,
  XCircle,
  HelpCircle,
  PenTool,
  Lock,
  Filter,
  Search,
  Download,
  Circle,
  Trophy
} from 'lucide-react';

function getRelativeDueDate(dateStr) {
  if (!dateStr) return 'No due date';
  try {
    const due = new Date(dateStr);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`;
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays <= 6) {
      const dayName = due.toLocaleDateString('en-US', { weekday: 'long' });
      return `Due this ${dayName}`;
    }
    return `Due in ${diffDays} days (${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
  } catch {
    return `Due ${dateStr}`;
  }
}

import { getEventAudienceInfo, formatKashafEventWhatsApp } from '../utils/kashafVoice';

function getEventTargeting(event, activeScout, allGroups = [], linkedScouts = []) {
  return getEventAudienceInfo(event, activeScout, allGroups, linkedScouts);
}

// Helper to evaluate badge status and detailed progress
export function getBadgeStatusAndProgress(badge, sMerit = {}) {
  if (!badge) {
    return {
      status: 'not_started',
      isEarned: false,
      isPlanned: false,
      isInProgress: false,
      approvedCount: 0,
      pendingCount: 0,
      total: 0,
      percentage: 0,
      mbData: {}
    };
  }

  const rawId = badge.id;
  const normId = (rawId || '').toLowerCase().replace(/_/g, '-');
  const underId = (rawId || '').toLowerCase().replace(/-/g, '_');
  const mbData = sMerit[rawId] || sMerit[normId] || sMerit[underId] || {};

  const total = badge.requirements ? badge.requirements.length : 0;
  const steps = mbData.steps || mbData.completedRequirements || mbData.requirements || {};

  let approvedCount = 0;
  let pendingCount = 0;

  if (badge.requirements && badge.requirements.length > 0) {
    badge.requirements.forEach(req => {
      const val = steps[req.id];
      if (val === true || val?.completed === true || val === 'approved' || val?.approved === true || val === 'completed') {
        approvedCount++;
      } else if (val === 'pending' || val?.pending === true) {
        pendingCount++;
      }
    });
  } else {
    approvedCount = Object.values(steps).filter(v => v === true || v?.completed === true || v === 'approved' || v?.approved === true || v === 'completed').length;
  }

  const isExplicitlyEarned = mbData.completed === true || mbData.earned === true;
  const isAllApproved = total > 0 && approvedCount >= total;
  const isEarned = isExplicitlyEarned || isAllApproved;

  const isPlanned = (mbData.planned === true || mbData.isPlanned === true) && !isEarned;
  const isInProgress = !isEarned && (approvedCount > 0 || pendingCount > 0 || mbData.inProgress === true);

  let status = 'not_started';
  if (isEarned) status = 'earned';
  else if (isInProgress) status = 'in_progress';
  else if (isPlanned) status = 'planned';

  const percentage = total > 0 ? Math.round((approvedCount / total) * 100) : (isEarned ? 100 : 0);

  return {
    mbData,
    status,
    isEarned,
    isPlanned,
    isInProgress,
    approvedCount,
    pendingCount,
    total,
    percentage,
    plannedTarget: mbData.plannedTarget || null,
    plannedAt: mbData.plannedAt || null,
    earnedDate: mbData.completedDate || mbData.dateCompleted || mbData.earnedDate || mbData.completedAt || null,
    counselor: mbData.counselorName || mbData.approvedByName || mbData.counselor || mbData.signerName || mbData.approvedBy || null,
    notes: mbData.notes || null,
    steps
  };
}

const EAGLE_MANDATORY_SOLOS = [
  { id: 'first-aid', name: 'First Aid', icon: '🩹', timeAlert: null },
  { id: 'citizenship-in-society', name: 'Citizenship in Society', icon: '🤝', timeAlert: null },
  { id: 'citizenship-in-the-community', name: 'Citizenship in the Community', icon: '🏛️', timeAlert: null },
  { id: 'citizenship-in-the-nation', name: 'Citizenship in the Nation', icon: '🇺🇸', timeAlert: null },
  { id: 'citizenship-in-the-world', name: 'Citizenship in the World', icon: '🌐', timeAlert: null },
  { id: 'communication', name: 'Communication', icon: '📢', timeAlert: null },
  { id: 'cooking', name: 'Cooking', icon: '🍳', timeAlert: null },
  { id: 'personal-fitness', name: 'Personal Fitness', icon: '🏃', timeAlert: 'Requires 90-day physical fitness tracking log' },
  { id: 'personal-management', name: 'Personal Management', icon: '📊', timeAlert: 'Requires 90-day personal budget & finance tracking log' },
  { id: 'camping', name: 'Camping', icon: '⛺', timeAlert: 'Requires 20 days and nights of logged campouts' },
  { id: 'family-life', name: 'Family Life', icon: '🏡', timeAlert: 'Requires 90-day family chore & project tracking log' },
];

const EAGLE_CHOICE_GROUPS = [
  {
    groupId: 'group1',
    groupName: 'Emergency Preparedness OR Lifesaving',
    badges: [
      { id: 'emergency-preparedness', name: 'Emergency Preparedness', icon: '🚨' },
      { id: 'lifesaving', name: 'Lifesaving', icon: '🛟' }
    ]
  },
  {
    groupId: 'group2',
    groupName: 'Environmental Science OR Sustainability',
    badges: [
      { id: 'environmental-science', name: 'Environmental Science', icon: '🔬' },
      { id: 'sustainability', name: 'Sustainability', icon: '🌱' }
    ]
  },
  {
    groupId: 'group3',
    groupName: 'Swimming OR Hiking OR Cycling',
    badges: [
      { id: 'swimming', name: 'Swimming', icon: '🏊' },
      { id: 'hiking', name: 'Hiking', icon: '🥾' },
      { id: 'cycling', name: 'Cycling', icon: '🚴' }
    ]
  }
];

export default function ParentDashboard({ currentUser = {}, initialTab = 'overview', onNavigate }) {
  const [parentDoc, setParentDoc] = useState(currentUser);
  const [linkedScouts, setLinkedScouts] = useState([]);
  const [selectedScoutId, setSelectedScoutId] = useState('all'); // 'all' | scoutId
  const [activeTab, setActiveTab] = useState(initialTab || 'overview'); // 'overview' | 'homework' | 'advancement' | 'events' | 'feed' | 'reports' | 'tasks' | 'family'
  const [eventSubTab, setEventSubTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [loading, setLoading] = useState(true);

  // Synced Collections
  const [ranksProgressMap, setRanksProgressMap] = useState({}); // { [scoutId]: ranksData }
  const [meritProgressMap, setMeritProgressMap] = useState({});
  const [islamicProgressMap, setIslamicProgressMap] = useState({});
  const [scoutSubmissionsMap, setScoutSubmissionsMap] = useState({});
  const [scoutHomeworkMap, setScoutHomeworkMap] = useState({});
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [eventRsvps, setEventRsvps] = useState({}); // { [rsvpKey]: { status } }
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Parent Action Center (Tasks & Forms)
  const [parentTasks, setParentTasks] = useState([]);
  const [taskSubmissions, setTaskSubmissions] = useState({});
  const [submittingTask, setSubmittingTask] = useState(null);
  const [taskSignature, setTaskSignature] = useState('');
  const [taskFileUploadUrl, setTaskFileUploadUrl] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

  // Absence Notice Submission State
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceScoutId, setAbsenceScoutId] = useState('');
  const [absenceDate, setAbsenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [absenceReason, setAbsenceReason] = useState('Illness'); // 'Illness' | 'Family Travel' | 'School Conflict' | 'Other'
  const [absenceNotes, setAbsenceNotes] = useState('');
  const [absenceSubmitting, setAbsenceSubmitting] = useState(false);
  const [absenceSuccessMsg, setAbsenceSuccessMsg] = useState('');

  // Leader Conference / Meeting Request State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingScoutId, setMeetingScoutId] = useState('');
  const [meetingTargetLeaderUid, setMeetingTargetLeaderUid] = useState('');
  const [meetingTopic, setMeetingTopic] = useState('Advancement & Rank Review'); // 'Advancement & Rank Review' | 'Special Accommodation' | 'Behavioral & Leadership' | 'General Inquiry'
  const [meetingProposedDate, setMeetingProposedDate] = useState('');
  const [meetingProposedTime, setMeetingProposedTime] = useState('6:30 PM');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingSubmitting, setMeetingSubmitting] = useState(false);
  const [meetingSuccessMsg, setMeetingSuccessMsg] = useState('');
  const [parentRequestsList, setParentRequestsList] = useState([]);

  // Dual-Parent Family Profile State
  const [primaryAccountHolder, setPrimaryAccountHolder] = useState('parent1'); // 'parent1' | 'parent2'
  const [isEditingFamily, setIsEditingFamily] = useState(false);
  const [parent1Name, setParent1Name] = useState('');
  const [parent1Phone, setParent1Phone] = useState('');
  const [parent1Email, setParent1Email] = useState('');
  const [parent1Relation, setParent1Relation] = useState('Father');
  const [parent2Name, setParent2Name] = useState('');
  const [parent2Phone, setParent2Phone] = useState('');
  const [parent2Email, setParent2Email] = useState('');
  const [parent2Relation, setParent2Relation] = useState('Mother');
  const [familyAddress, setFamilyAddress] = useState('');
  const [cityStateZip, setCityStateZip] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Emergency Contact');
  const [scoutHealthMap, setScoutHealthMap] = useState({}); // { [scoutId]: { allergies, medicalNotes, dietaryRestrictions } }
  const [familySaving, setFamilySaving] = useState(false);
  const [familyMsg, setFamilyMsg] = useState('');

  // Conference Cancellation State
  const [cancellingConference, setCancellingConference] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancellingConference, setIsCancellingConference] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  // Parent RSVP & Reschedule State for Leader-Initiated Meetings
  const [reschedulingConference, setReschedulingConference] = useState(null);
  const [proposedAltDate, setProposedAltDate] = useState('');
  const [proposedAltTime, setProposedAltTime] = useState('6:30 PM');
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccessMsg, setRsvpSuccessMsg] = useState('');

  // Published Reports & Parent Signature State
  const [publishedReports, setPublishedReports] = useState([]);
  const [viewingPublishedReport, setViewingPublishedReport] = useState(null);
  const [signingPublishedReport, setSigningPublishedReport] = useState(null);
  const [isSubmittingParentSignature, setIsSubmittingParentSignature] = useState(false);
  const [parentSignSuccessToast, setParentSignSuccessToast] = useState('');
  const [reportSubTab, setReportSubTab] = useState('published'); // 'published' | 'live'
  const [completedHomeworkOpen, setCompletedHomeworkOpen] = useState(false);
  const [selectedRankMap, setSelectedRankMap] = useState({}); // { [scoutUid]: rankId }
  const [advancementViewFilter, setAdvancementViewFilter] = useState('all'); // 'all' | 'completed' | 'inprogress' | 'merit' | 'islamic'
  const [meritSubTabMap, setMeritSubTabMap] = useState({}); // { [scoutUid]: 'planned' | 'earned' | 'in_progress' | 'eagle_required' | 'all' }
  const [expandedBadgeMap, setExpandedBadgeMap] = useState({}); // { [badgeKey]: boolean }
  const [badgeSearchMap, setBadgeSearchMap] = useState({}); // { [scoutUid]: string }

  // Sync initial tab when changed by parent container
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // 1. Keep Parent Document updated
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setParentDoc({ uid: snap.id, ...data });
        
        // Sync family profile initial fields
        setPrimaryAccountHolder(data.primaryAccountHolder || 'parent1');
        setParent1Name(data.parent1Name || data.fullName || '');
        setParent1Phone(data.parent1Phone || data.phone || '');
        setParent1Email(data.parent1Email || data.email || '');
        setParent1Relation(data.parent1Relation || 'Father');
        setParent2Name(data.parent2Name || '');
        setParent2Phone(data.parent2Phone || '');
        setParent2Email(data.parent2Email || '');
        setParent2Relation(data.parent2Relation || 'Mother');
        setFamilyAddress(data.familyAddress || data.homeAddress || data.address || '');
        setCityStateZip(data.cityStateZip || '');
        setEmergencyContactName(data.emergencyContactName || '');
        setEmergencyContactPhone(data.emergencyContactPhone || '');
        setEmergencyContactRelation(data.emergencyContactRelation || 'Emergency Contact');
      }
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // 2. Fetch Users, Groups, Events, RSVPs & Published Reports
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setAllGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    const unsubPub = onSnapshot(collection(db, 'published_reports'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      setPublishedReports(list);
    });
    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEventsList(list);
    });
    const unsubRsvps = onSnapshot(collection(db, 'event_rsvps'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setEventRsvps(map);
    });
    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAttendanceSessions(list);
    });
    const unsubTasks = onSnapshot(collection(db, 'parent_tasks'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
      setParentTasks(list);
    });
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubHw = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setScoutHomeworkMap(map);
    });

    const unsubNotifs = onSnapshot(collection(db, 'parent_notifications'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => !n.recipientUid || n.recipientUid === currentUser?.uid || n.parentEmail === currentUser?.email);
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setNotifications(list);
    });

    const unsubRequests = onSnapshot(collection(db, 'parent_requests'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setParentRequestsList(list);
    });

    return () => {
      unsubUsers();
      unsubGroups();
      unsubPub();
      unsubEvents();
      unsubRsvps();
      unsubAttendance();
      unsubTasks();
      unsubAssign();
      unsubHw();
      unsubNotifs();
      unsubRequests();
    };
  }, []);

  // Listen to parent form submissions
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubSubs = onSnapshot(collection(db, 'parent_task_submissions'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.parentUid === currentUser.uid) {
          map[data.taskId] = data;
        }
      });
      setTaskSubmissions(map);
    });
    return () => unsubSubs();
  }, [currentUser?.uid]);

  // 3. Resolve Linked Children
  useEffect(() => {
    const linkedIds = parentDoc?.linkedScoutIds || [];
    const matchingScouts = allUsers.filter(u => {
      if (u.role !== 'scout') return false;
      if (linkedIds.includes(u.uid)) return true;
      if (Array.isArray(u.parentUids) && u.parentUids.includes(parentDoc?.uid)) return true;
      if (parentDoc?.email && u.parentEmail && u.parentEmail.toLowerCase().trim() === parentDoc.email.toLowerCase().trim()) return true;
      return false;
    });

    setLinkedScouts(matchingScouts);
    setScoutHealthMap(prev => {
      const next = { ...prev };
      matchingScouts.forEach(s => {
        if (!next[s.uid]) {
          next[s.uid] = {
            allergies: s.allergies || '',
            medicalNotes: s.medicalNotes || '',
            dietaryRestrictions: s.dietaryRestrictions || ''
          };
        }
      });
      return next;
    });

    if (matchingScouts.length > 0 && selectedScoutId !== 'all' && !matchingScouts.some(s => s.uid === selectedScoutId)) {
      setSelectedScoutId(matchingScouts[0].uid);
      setAbsenceScoutId(matchingScouts[0].uid);
    } else if (matchingScouts.length === 1 && selectedScoutId === 'all') {
      setSelectedScoutId(matchingScouts[0].uid);
      setAbsenceScoutId(matchingScouts[0].uid);
    } else if (matchingScouts.length > 0 && !absenceScoutId) {
      setAbsenceScoutId(matchingScouts[0].uid);
    }
    setLoading(false);
  }, [parentDoc, allUsers]);

  // 4. Progress Listeners for All Linked Children
  useEffect(() => {
    if (linkedScouts.length === 0) return;

    const unsubs = [];
    linkedScouts.forEach(scout => {
      const sId = scout.uid;
      // Ranks
      unsubs.push(onSnapshot(collection(db, 'user_progress', sId, 'ranks'), (snap) => {
        const map = {};
        snap.docs.forEach(d => { map[d.id] = d.data(); });
        setRanksProgressMap(prev => ({ ...prev, [sId]: map }));
      }));

      // Merit Badges
      unsubs.push(onSnapshot(collection(db, 'user_progress', sId, 'merit_badges'), (snap) => {
        const map = {};
        snap.docs.forEach(d => { map[d.id] = d.data(); });
        setMeritProgressMap(prev => ({ ...prev, [sId]: map }));
      }));

      // Islamic Basics
      unsubs.push(onSnapshot(doc(db, 'user_progress', sId, 'islamic_basics', 'status'), (snap) => {
        setIslamicProgressMap(prev => ({ ...prev, [sId]: snap.exists() ? snap.data() : {} }));
      }));

      // Assignments Submissions
      unsubs.push(onSnapshot(collection(db, 'user_progress', sId, 'assignments'), (snap) => {
        const map = {};
        snap.docs.forEach(d => { map[d.id] = d.data(); });
        setScoutSubmissionsMap(prev => ({ ...prev, [sId]: map }));
      }));
    });

    return () => unsubs.forEach(u => u());
  }, [linkedScouts]);

  // Handle Parent Digital Signature for Progress Report
  const handleSaveParentSignature = async ({ signerName, signerRole, signatureDataUrl, signedAt }) => {
    if (!signingPublishedReport) return;
    setIsSubmittingParentSignature(true);
    try {
      await signPublishedReportByParent({
        reportId: signingPublishedReport.reportId || signingPublishedReport.id,
        signerName,
        signerRole,
        signatureDataUrl,
        signerUid: currentUser.uid
      });

      // Dispatch unified parent request & multi-leader notification
      const targetScout = linkedScouts.find(s => s.uid === signingPublishedReport.scoutId) || {};
      const scoutGrp = allGroups.find(g => g.id === (targetScout.groupId || targetScout.patrolId || signingPublishedReport.groupId));
      const pName = scoutGrp?.name || targetScout.patrolName || targetScout.patrol || signingPublishedReport.patrolName || 'Unassigned Patrol';

      try {
        await createParentRequest({
          requestType: 'signed_report',
          parentUid: currentUser.uid,
          parentName: signerName || parent1Name || currentUser.fullName || 'Parent',
          parentEmail: parent1Email || currentUser.email || '',
          parentPhone: parent1Phone || currentUser.phone || '',
          scoutId: signingPublishedReport.scoutId,
          scoutName: signingPublishedReport.scoutName || targetScout.fullName || 'Scout Member',
          patrolId: scoutGrp?.id || targetScout.groupId || '',
          patrolName: pName,
          message: `Parent ${signerName || 'Guardian'} digitally signed and certified the official progress report snapshot for ${signingPublishedReport.scoutName}.`,
          metadata: {
            reportId: signingPublishedReport.reportId || signingPublishedReport.id,
            signerRole: signerRole || 'Parent / Guardian',
            signedAt: signedAt || new Date().toISOString()
          }
        });
      } catch (reqErr) {
        console.warn("Parent request dispatch error:", reqErr);
      }

      setParentSignSuccessToast(`✓ Official progress report for ${signingPublishedReport.scoutName} successfully signed and certified!`);
      setSigningPublishedReport(null);

      // Refresh viewing report if open
      if (viewingPublishedReport && (viewingPublishedReport.id === signingPublishedReport.id || viewingPublishedReport.reportId === signingPublishedReport.reportId)) {
        setViewingPublishedReport(prev => ({
          ...prev,
          signatures: {
            ...prev.signatures,
            parent: {
              signed: true,
              signerName,
              signerRole,
              signatureDataUrl,
              signedAt,
              signerUid: currentUser.uid
            }
          }
        }));
      }
    } catch (err) {
      console.error('Parent signature error:', err);
      alert('Error saving signature: ' + err.message);
    } finally {
      setIsSubmittingParentSignature(false);
      setTimeout(() => setParentSignSuccessToast(''), 4000);
    }
  };

  // Submit Parent Task / Waiver
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!submittingTask || !currentUser?.uid) return;
    setTaskSubmitting(true);
    setTaskSuccessMsg('');

    const subData = {
      taskId: submittingTask.id,
      taskTitle: submittingTask.title,
      parentUid: currentUser.uid,
      parentName: parent1Name || currentUser.fullName || 'Parent',
      parentEmail: parent1Email || currentUser.email || '',
      digitalSignature: taskSignature.trim(),
      fileUploadUrl: taskFileUploadUrl.trim(),
      notes: taskNotes.trim(),
      status: 'completed',
      completed: true,
      submittedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    };

    try {
      const subId = `${submittingTask.id}_${currentUser.uid}`;
      await setDoc(doc(db, 'parent_task_submissions', subId), subData, { merge: true });

      // Dispatch unified parent request & multi-leader notification
      const targetScout = linkedScouts[0] || {};
      const scoutGrp = allGroups.find(g => g.id === (targetScout.groupId || targetScout.patrolId));
      const pName = scoutGrp?.name || targetScout.patrolName || targetScout.patrol || 'Unassigned Patrol';

      try {
        await createParentRequest({
          requestType: 'form_submission',
          parentUid: currentUser.uid,
          parentName: parent1Name || currentUser.fullName || 'Parent',
          parentEmail: parent1Email || currentUser.email || '',
          parentPhone: parent1Phone || currentUser.phone || '',
          scoutId: targetScout.uid || null,
          scoutName: targetScout.fullName || 'Scout Member',
          patrolId: scoutGrp?.id || targetScout.groupId || '',
          patrolName: pName,
          message: `Parent submitted form "${submittingTask.title}" with digital signature "${taskSignature}".${taskNotes.trim() ? ` Notes: "${taskNotes.trim()}"` : ''}`,
          metadata: {
            taskId: submittingTask.id,
            taskTitle: submittingTask.title,
            digitalSignature: taskSignature.trim(),
            fileUploadUrl: taskFileUploadUrl.trim(),
            notes: taskNotes.trim()
          }
        });
      } catch (reqErr) {
        console.warn("Parent request dispatch error:", reqErr);
      }

      setTaskSuccessMsg('✓ Form submitted and acknowledged!');
      setTimeout(() => {
        setSubmittingTask(null);
        setTaskSignature('');
        setTaskNotes('');
      }, 1200);
    } catch (err) {
      alert("Failed to submit form: " + err.message);
    } finally {
      setTaskSubmitting(false);
    }
  };

  // Submit Absence Notice
  const handleSubmitAbsenceNotice = async (e) => {
    e.preventDefault();
    if (!absenceScoutId || !absenceDate) return;
    setAbsenceSubmitting(true);
    setAbsenceSuccessMsg('');

    const targetScout = linkedScouts.find(s => s.uid === absenceScoutId);
    const scoutName = targetScout?.fullName || targetScout?.username || 'Scout';
    const scoutGrp = allGroups.find(g => g.id === (targetScout?.groupId || targetScout?.patrolId));
    const pName = scoutGrp?.name || targetScout?.patrolName || targetScout?.patrol || 'Unassigned Patrol';

    const excuseDoc = {
      scoutId: absenceScoutId,
      scoutName,
      date: absenceDate,
      reason: absenceReason,
      notes: absenceNotes.trim(),
      submittedByUid: currentUser.uid,
      submittedByName: parent1Name || currentUser.fullName || 'Parent',
      status: 'approved_excused',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    };

    try {
      const excuseId = `excuse_${absenceScoutId}_${absenceDate}`;
      await setDoc(doc(db, 'attendance_excuses', excuseId), excuseDoc, { merge: true });

      // Dispatch unified parent request & multi-leader notification
      try {
        await createParentRequest({
          requestType: 'absence_notice',
          parentUid: currentUser.uid,
          parentName: parent1Name || currentUser.fullName || 'Parent',
          parentEmail: parent1Email || currentUser.email || '',
          parentPhone: parent1Phone || currentUser.phone || '',
          scoutId: absenceScoutId,
          scoutName,
          patrolId: scoutGrp?.id || targetScout?.groupId || '',
          patrolName: pName,
          message: `${scoutName} will be absent from meeting on ${absenceDate}. Reason: ${absenceReason}.${absenceNotes.trim() ? ` Notes: "${absenceNotes.trim()}"` : ''}`,
          metadata: {
            absenceDate,
            absenceReason,
            absenceNotes: absenceNotes.trim()
          }
        });
      } catch (reqErr) {
        console.warn("Parent request dispatch error:", reqErr);
      }

      setAbsenceSuccessMsg(`✓ Absence notice filed! ${scoutName} is flagged as Excused on leader roll call.`);
      setTimeout(() => {
        setShowAbsenceModal(false);
        setAbsenceNotes('');
        setAbsenceSuccessMsg('');
      }, 1800);
    } catch (err) {
      alert("Error submitting absence notice: " + err.message);
    } finally {
      setAbsenceSubmitting(false);
    }
  };

  // Submit Leader Conference / Meeting Request
  const handleSubmitMeetingRequest = async (e) => {
    e.preventDefault();
    const effectiveScoutId = meetingScoutId || linkedScouts[0]?.uid;
    if (!effectiveScoutId) {
      alert("Please link a scout to submit a meeting request.");
      return;
    }
    setMeetingSubmitting(true);
    setMeetingSuccessMsg('');

    const targetScout = linkedScouts.find(s => s.uid === effectiveScoutId) || linkedScouts[0] || {};
    const scoutName = targetScout.fullName || targetScout.username || 'Scout';
    const scoutGrp = allGroups.find(g => g.id === (targetScout.groupId || targetScout.patrolId));
    const pName = scoutGrp?.name || targetScout.patrolName || targetScout.patrol || 'Unassigned Patrol';

    const targetLeader = allUsers.find(u => u.uid === meetingTargetLeaderUid) || null;
    const targetLeaderName = targetLeader ? (targetLeader.fullName || targetLeader.username) : null;
    const targetLeaderRole = targetLeader ? (targetLeader.leaderPosition || targetLeader.role || 'Troop Leader') : null;

    try {
      await createParentRequest({
        requestType: 'meeting_request',
        parentUid: currentUser.uid,
        parentName: parent1Name || currentUser.fullName || 'Parent',
        parentEmail: parent1Email || currentUser.email || '',
        parentPhone: parent1Phone || currentUser.phone || '',
        scoutId: targetScout.uid,
        scoutName,
        patrolId: scoutGrp?.id || targetScout.groupId || '',
        patrolName: pName,
        targetLeaderUid: targetLeader?.uid || null,
        targetLeaderName,
        targetLeaderRole,
        proposedDate: meetingProposedDate || null,
        proposedTime: meetingProposedTime || null,
        meetingTopic,
        message: `Parent requested a leader conference regarding "${meetingTopic}" for ${scoutName}.${targetLeaderName ? ` Requested Leader: ${targetLeaderName} (${targetLeaderRole}).` : ''} Proposed Date: ${meetingProposedDate || 'Flexible'}${meetingProposedTime ? ` at ${meetingProposedTime}` : ''}.${meetingNotes.trim() ? ` Notes: "${meetingNotes.trim()}"` : ''}`,
        metadata: {
          meetingTopic,
          meetingProposedDate,
          meetingProposedTime,
          targetLeaderUid: targetLeader?.uid || null,
          targetLeaderName,
          targetLeaderRole,
          meetingNotes: meetingNotes.trim()
        }
      });

      setMeetingSuccessMsg(`✓ Conference request submitted! ${targetLeaderName ? `Leader ${targetLeaderName}` : 'Troop leadership'} has been notified.`);
      setTimeout(() => {
        setShowMeetingModal(false);
        setMeetingNotes('');
        setMeetingProposedDate('');
        setMeetingProposedTime('6:30 PM');
        setMeetingTargetLeaderUid('');
        setMeetingSuccessMsg('');
      }, 1800);
    } catch (err) {
      alert("Error submitting meeting request: " + err.message);
    } finally {
      setMeetingSubmitting(false);
    }
  };

  // Toggle RSVP status for an event (Dual sync to event_rsvps and events/{eventId}/rsvps)
  const handleRsvp = async (eventId, scoutId, status) => {
    if (!eventId || !currentUser?.uid) return;
    const targetScouts = scoutId === 'all' 
      ? (linkedScouts.length > 0 ? linkedScouts : [{ uid: currentUser.uid, fullName: currentUser.fullName || currentUser.username }]) 
      : [linkedScouts.find(s => s.uid === scoutId) || { uid: scoutId, fullName: 'Scout' }];

    try {
      for (const sc of targetScouts) {
        const targetId = sc.uid;
        const rsvpId = `rsvp_${eventId}_${targetId}`;
        const normalizedStatus = status === 'going' ? 'attending' : (status === 'cant_go' ? 'not_attending' : 'tentative');

        const rsvpPayload = {
          eventId,
          userId: targetId,
          scoutId: targetId,
          scoutName: sc.fullName || sc.username || 'Scout',
          scoutRank: sc.rank || 'Scout',
          patrolName: sc.patrolId || sc.patrol || '',
          parentUid: currentUser.uid,
          parentName: parent1Name || currentUser.fullName || currentUser.username || 'Parent',
          parentPhone: parent1Phone || currentUser.phoneNumber || '',
          parentEmail: parent1Email || currentUser.email || '',
          userRole: 'scout',
          status: normalizedStatus, // 'attending' | 'not_attending' | 'tentative'
          updatedAt: new Date().toISOString()
        };

        // 1. Write to global event_rsvps
        await setDoc(doc(db, 'event_rsvps', rsvpId), {
          ...rsvpPayload,
          status: status // 'going' | 'cant_go' for backward compatibility
        }, { merge: true });

        // 2. Write to events subcollection
        await setDoc(doc(db, 'events', eventId, 'rsvps', targetId), rsvpPayload, { merge: true });
      }

      // Also mark parent record in event subcollection
      const parentRsvpId = `rsvp_${eventId}_${currentUser.uid}`;
      const parentPayload = {
        eventId,
        userId: currentUser.uid,
        userName: parent1Name || currentUser.fullName || currentUser.username || 'Parent',
        userRole: 'parent',
        userPhone: parent1Phone || currentUser.phoneNumber || '',
        userEmail: parent1Email || currentUser.email || '',
        status: status === 'going' ? 'attending' : 'not_attending',
        linkedScoutIds: linkedScouts.map(s => s.uid),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'events', eventId, 'rsvps', currentUser.uid), parentPayload, { merge: true });
      await setDoc(doc(db, 'event_rsvps', parentRsvpId), parentPayload, { merge: true });

    } catch (err) {
      console.error("RSVP update failed:", err);
    }
  };

  // Save Dual-Parent Profile and Sync to Linked Children
  const handleSaveFamilyProfile = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid) return;
    setFamilySaving(true);
    setFamilyMsg('');

    const familyProfile = {
      primaryAccountHolder: primaryAccountHolder || 'parent1',
      parent1Name: parent1Name.trim(),
      parent1Phone: parent1Phone.trim(),
      parent1Email: parent1Email.trim().toLowerCase(),
      parent1Relation: parent1Relation || 'Father',
      parent2Name: parent2Name.trim(),
      parent2Phone: parent2Phone.trim(),
      parent2Email: parent2Email.trim().toLowerCase(),
      parent2Relation: parent2Relation || 'Mother',
      familyAddress: familyAddress.trim(),
      cityStateZip: cityStateZip.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation: emergencyContactRelation.trim() || 'Emergency Contact'
    };

    try {
      const syncResult = await syncParentProfileToChildren({
        parentUid: currentUser.uid,
        familyProfile,
        scoutHealthMap,
        linkedScoutIds: linkedScouts.map(s => s.uid)
      });

      const count = syncResult?.syncedScoutCount || 0;
      setFamilyMsg(`✓ Household profile & ${count} linked scout profile${count === 1 ? '' : 's'} updated and synced!`);
      setIsEditingFamily(false);
      setTimeout(() => setFamilyMsg(''), 4000);
    } catch (err) {
      console.error("Failed to sync family profile:", err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setFamilySaving(false);
    }
  };

  // Submit Meeting Cancellation by Parent
  const handleCancelConferenceSubmit = async (e) => {
    e.preventDefault();
    if (!cancellingConference || !currentUser?.uid) return;
    setIsCancellingConference(true);
    setCancelSuccessMsg('');

    const effectiveParentName = (parentDoc?.primaryAccountHolder || primaryAccountHolder) === 'parent2' 
      ? (parent2Name || 'Mother') 
      : (parent1Name || parentDoc?.fullName || 'Father');

    try {
      await cancelMeetingRequestByParent({
        requestId: cancellingConference.requestId || cancellingConference.id,
        parentUid: currentUser.uid,
        parentName: effectiveParentName,
        cancelReason: cancelReason.trim(),
        targetLeaderUid: cancellingConference.targetLeaderUid || cancellingConference.confirmedByUid,
        targetLeaderName: cancellingConference.targetLeaderName || cancellingConference.confirmedBy,
        scoutName: cancellingConference.scoutName,
        patrolName: cancellingConference.patrolName,
        confirmedDate: cancellingConference.confirmedDate,
        confirmedTime: cancellingConference.confirmedTime
      });

      setCancelSuccessMsg(`✓ Meeting for ${cancellingConference.scoutName} has been cancelled. Leadership notified.`);
      setTimeout(() => {
        setCancellingConference(null);
        setCancelReason('');
        setCancelSuccessMsg('');
      }, 1800);
    } catch (err) {
      alert("Failed to cancel meeting: " + err.message);
    } finally {
      setIsCancellingConference(false);
    }
  };

  // Active Scoped Scout (or null for all)
  const isAllView = selectedScoutId === 'all';
  const activeScout = !isAllView ? linkedScouts.find(s => s.uid === selectedScoutId) || linkedScouts[0] : null;
  const scopedScouts = isAllView ? linkedScouts : activeScout ? [activeScout] : [];

  // Resolved Primary Account Holder & Dynamic Greeting
  const effectivePrimaryHolder = parentDoc?.primaryAccountHolder || primaryAccountHolder || 'parent1';
  const isParent2Primary = effectivePrimaryHolder === 'parent2';
  const primaryName = isParent2Primary
    ? (parent2Name || parentDoc?.parent2Name || 'Mother / Guardian 2')
    : (parent1Name || parentDoc?.parent1Name || parentDoc?.fullName || parentDoc?.username || 'Father / Guardian 1');
  const primaryRelation = isParent2Primary
    ? (parent2Relation || parentDoc?.parent2Relation || 'Mother')
    : (parent1Relation || parentDoc?.parent1Relation || 'Father');

  // Urgent 7-Day Deadline Evaluation
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const evaluatedTasks = parentTasks.map(task => {
    const sub = taskSubmissions[task.id];
    const isDone = !!(sub?.completed || sub?.status === 'completed');
    let isUrgent = false;
    let isOverdue = false;
    let daysDiff = null;

    if (!isDone && task.dueDate) {
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      daysDiff = Math.round((due - now) / (1000 * 60 * 60 * 24));

      if (daysDiff < 0) {
        isOverdue = true;
      } else if (daysDiff <= 7) {
        isUrgent = true;
      }
    }

    return {
      ...task,
      isDone,
      isUrgent,
      isOverdue,
      daysDiff,
      submission: sub || null
    };
  });

  const urgentTasks = evaluatedTasks.filter(t => !t.isDone && (t.isUrgent || t.isOverdue));
  
  const linkedUids = linkedScouts.map(s => s.uid);
  const parentEmails = [parentDoc?.email, parentDoc?.parent1Email, parentDoc?.parent2Email, currentUser?.email].filter(Boolean).map(e => e.toLowerCase().trim());

  // Strict privacy filter: only reports that belong to this parent's linked children
  const isReportForFamily = (r) => {
    if (!r) return false;
    if (r.scoutId && linkedUids.includes(r.scoutId)) return true;
    if (r.parentUid && (r.parentUid === currentUser?.uid || r.parentUid === parentDoc?.uid)) return true;
    if (r.parentEmail && parentEmails.includes(r.parentEmail.toLowerCase().trim())) return true;
    return false;
  };

  const familyPublishedReports = publishedReports.filter(r => isReportForFamily(r));
  const filteredPublishedReports = familyPublishedReports.filter(r => {
    if (selectedScoutId !== 'all' && r.scoutId !== selectedScoutId) return false;
    return true;
  });
  const pendingReportsToSign = familyPublishedReports.filter(r => !r.signatures?.parent?.signed);
  const unreadNotifsCount = notifications.filter(n => !n.read).length + pendingReportsToSign.length;

  // Available Troop Leaders for Conference Selection
  const availableLeaders = allUsers.filter(u => {
    if (!u.role) return false;
    const role = (u.role || '').toLowerCase();
    const pos = (u.leaderPosition || '').toLowerCase();
    return role === 'leader' || role === 'executive_leader' || role === 'admin' || role === 'owner' || u.isLeader || u.isExecutive || pos.length > 0;
  });

  // Family Parent Requests (Conferences, Absences, Signatures)
  const linkedPatrolIds = linkedScouts.map(s => s.groupId || s.patrolId).filter(Boolean);
  const familyRequests = parentRequestsList.filter(r => {
    if (r.parentUid && (r.parentUid === currentUser?.uid || r.parentUid === parentDoc?.uid)) return true;
    if (r.parentEmail && parentEmails.includes(r.parentEmail.toLowerCase().trim())) return true;
    if (r.scoutId && linkedUids.includes(r.scoutId)) return true;
    if (r.targetType === 'patrol_parents' && r.patrolId && linkedPatrolIds.includes(r.patrolId)) return true;
    if (r.targetType === 'all_unit') return true;
    return false;
  });

  const confirmedConferences = familyRequests.filter(r => r.requestType === 'meeting_request' && r.status === 'confirmed');
  const pendingConferences = familyRequests.filter(r => r.requestType === 'meeting_request' && (r.status === 'pending_review' || r.status === 'acknowledged' || r.status === 'reschedule_requested'));

  // Parent RSVP Submission Handler
  const handleParentRsvpSubmit = async (conf, rsvpStatus, altDate = null, altTime = null, note = '') => {
    setIsSubmittingRsvp(true);
    setRsvpSuccessMsg('');
    try {
      await parentRespondToMeetingInvite({
        requestId: conf.requestId || conf.id,
        parentUid: currentUser?.uid || parentDoc?.uid,
        parentName: parentDoc?.fullName || currentUser?.fullName || primaryName || 'Parent',
        rsvpStatus,
        parentNote: note,
        proposedAlternateDate: altDate,
        proposedAlternateTime: altTime
      });
      setRsvpSuccessMsg(
        rsvpStatus === 'attending'
          ? '✓ Attendance Confirmed! We look forward to meeting with leadership.'
          : rsvpStatus === 'reschedule_requested'
          ? '✓ Alternate time proposal sent to leadership.'
          : '✓ Meeting invitation declined.'
      );
      if (reschedulingConference) setReschedulingConference(null);
      setTimeout(() => setRsvpSuccessMsg(''), 4000);
    } catch (err) {
      alert("Failed to submit RSVP: " + err.message);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Build Homework List for Scoped Scouts
  const buildScoutHomework = (scout) => {
    if (!scout) return [];
    const scoutSubs = scoutSubmissionsMap[scout.uid] || {};
    const scoutGroupId = scout.groupId || scout.patrolId || null;

    return assignmentsList
      .filter(assign => {
        if (assign.archived) return false;

        // Strict Scope / Target filter
        if (assign.assignedTarget === 'patrol') {
          if (assign.targetGroupId && scoutGroupId && assign.targetGroupId !== scoutGroupId) {
            return false;
          }
          if (assign.groupId && scoutGroupId && assign.groupId !== 'all' && assign.groupId !== scoutGroupId) {
            return false;
          }
          if (!scoutGroupId && (assign.targetGroupId || (assign.groupId && assign.groupId !== 'all'))) {
            return false;
          }
        } else if (assign.assignedTarget === 'scout' || assign.assignedTarget === 'single_scout') {
          const targetUid = assign.targetScoutUid || assign.targetScoutId || assign.scoutId;
          if (targetUid && targetUid !== scout.uid) {
            return false;
          }
        }
        return true;
      })
      .map(assign => {
        const key = `${assign.id}_${scout.uid}`;
        const sub = scoutHomeworkMap[key] || scoutSubs[assign.id] || null;

        const isApproved = sub?.status === 'approved' || sub?.status === 'completed' || sub?.completed === true;
        const isPendingReview = !isApproved && (
          sub?.status === 'submitted' ||
          sub?.status === 'pending_review' ||
          Boolean(sub?.submissionText && sub.submissionText.trim().length > 0) ||
          Boolean(sub?.submissionDate)
        );

        let isOverdue = false;
        let diffDays = null;
        if (assign.dueDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const due = new Date(assign.dueDate);
          due.setHours(0, 0, 0, 0);
          diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
          if (diffDays < 0) {
            isOverdue = true;
          }
        }

        let status = 'pending';
        if (isApproved) {
          status = 'completed';
        } else if (isPendingReview) {
          status = 'in_review';
        } else if (isOverdue) {
          status = 'overdue';
        }

        return {
          ...assign,
          scoutId: scout.uid,
          scoutName: scout.fullName || scout.username,
          submission: sub || null,
          status,
          isOverdue,
          diffDays,
          leaderFeedback: sub?.leaderFeedback || sub?.feedback || sub?.leaderNote || assign.instructions || ''
        };
      });
  };

  const allScopedHomework = scopedScouts.flatMap(s => buildScoutHomework(s));
  const activeHomework = allScopedHomework.filter(h => h.status !== 'completed');
  const completedHomework = allScopedHomework.filter(h => h.status === 'completed');
  const primaryScopedScout = (!isAllView ? linkedScouts.find(s => s.uid === selectedScoutId) : null) || linkedScouts[0] || null;
  const primaryPatrolName = primaryScopedScout?.patrol || primaryScopedScout?.patrolName || primaryScopedScout?.talia || allGroups.find(g => g.id === primaryScopedScout?.groupId)?.name || 'Patrol';
  const resourcesTabTitle = primaryScopedScout ? `📚 ${primaryPatrolName.replace('Taliʿat ', '')} Resources` : '📚 Patrol Resources';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-semibold">Loading Dhulfiqār Family Portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16 text-slate-100">
      
      {/* ── 1. WARM WELCOME & ACTION BAR ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-750 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-950/60 shrink-0">
            👨‍👩‍👧
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Assalāmu ʿAlaykum, {primaryName} <span className="text-emerald-400 font-bold text-sm">({primaryRelation})</span>
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                ⭐ Primary Account Holder
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Here’s what your family has coming up this week across scouting, advancement & learning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAbsenceModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <AlertCircle size={14} />
            <span>Notify Absence</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMeetingModal(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Users size={14} />
            <span>Request Conference</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <User size={14} />
            <span>Household Profile</span>
          </button>
        </div>
      </div>

      {/* ── 2. STICKY PROMINENT CHILD SWITCHER ── */}
      {linkedScouts.length > 0 && (
        <div className="sticky top-2 z-30 bg-slate-900/95 backdrop-blur border border-slate-750 p-2.5 rounded-2xl shadow-lg flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase font-black text-slate-400 px-2 shrink-0 flex items-center gap-1">
            <Users size={12} className="text-emerald-400" />
            <span>Child View:</span>
          </span>

          {linkedScouts.length > 1 && (
            <button
              type="button"
              onClick={() => setSelectedScoutId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                isAllView
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 scale-[1.02]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
              }`}
            >
              <span>👨‍👩‍👧 All Family View</span>
              <span className="text-[10px] bg-black/25 px-1.5 py-0.2 rounded-full font-mono">{linkedScouts.length}</span>
            </button>
          )}

          {linkedScouts.map(scout => {
            const isSelected = scout.uid === selectedScoutId;
            const sRanks = ranksProgressMap[scout.uid] || {};
            const latestRank = getLatestAchievedRank(sRanks, scout.rank);
            return (
              <button
                key={scout.uid}
                type="button"
                onClick={() => setSelectedScoutId(scout.uid)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 scale-[1.02]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-950/60 border border-white/20 flex items-center justify-center text-[10px] font-black shrink-0 uppercase">
                  {scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}
                </div>
                <span>{scout.fullName || scout.username}</span>
                <span className="text-[10px] opacity-80 font-mono">({latestRank.name})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── 3. PRIMARY PARENT PORTAL TABS ── */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Family Overview', icon: Home },
          { 
            id: 'homework', 
            label: 'Assignments & Learning', 
            icon: BookOpen,
            badge: activeHomework.length > 0 ? `${activeHomework.length} Active` : null,
            badgeColor: 'bg-amber-500 text-slate-950 font-black'
          },
          { id: 'events', label: 'Upcoming Schedule & RSVP', icon: Calendar },
          { 
            id: 'feed', 
            label: 'Alerts & Activity Feed', 
            icon: Bell, 
            badge: unreadNotifsCount > 0 ? unreadNotifsCount : null, 
            badgeColor: 'bg-sky-500 text-white font-black animate-pulse' 
          },
          { 
            id: 'reports', 
            label: 'Official Progress Reports', 
            icon: Printer,
            badge: pendingReportsToSign.length > 0 ? `✍️ ${pendingReportsToSign.length} To Sign` : null,
            badgeColor: 'bg-amber-500 text-slate-950 font-black animate-pulse'
          },
          { 
            id: 'tasks', 
            label: 'Forms & Waivers', 
            icon: Zap, 
            badge: urgentTasks.length > 0 ? `⚡ ${urgentTasks.length}` : null, 
            badgeColor: 'bg-red-500 text-white font-black' 
          },
          { id: 'eagle', label: '🦅 Road to Eagle', icon: Target },
          { id: 'resources', label: resourcesTabTitle, icon: Compass },
          { id: 'advancement', label: 'Advancement & Badges', icon: Award },
          { id: 'family', label: 'Household Profile', icon: User }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 scale-[1.02]'
                  : 'bg-slate-850 border border-slate-750 text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
              {t.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${t.badgeColor}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 4. TAB 1: CONSOLIDATED AT-A-GLANCE FAMILY OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* SECTION 1: URGENT ACTION BANNER (Only renders when action required) */}
          {(pendingReportsToSign.length > 0 || urgentTasks.length > 0) && (
            <div className="bg-gradient-to-r from-red-950/90 via-amber-950/80 to-slate-900 border-2 border-amber-500/80 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                      Immediate Action Required
                    </span>
                    <span className="text-xs text-amber-200 font-mono">
                      {pendingReportsToSign.length > 0 ? `${pendingReportsToSign.length} Report to Sign` : `${urgentTasks.length} Form Due`}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-1">
                    {pendingReportsToSign.length > 0 
                      ? `Official Progress Report published for ${pendingReportsToSign[0].scoutName}`
                      : `${urgentTasks[0].title} — ${urgentTasks[0].isOverdue ? 'Overdue' : `Due in ${urgentTasks[0].daysDiff} days`}`
                    }
                  </h3>
                  <p className="text-xs text-slate-300">
                    {pendingReportsToSign.length > 0 
                      ? 'Review and apply your parent digital signature for troop advancement sign-offs.'
                      : 'Please complete and submit the required activity waiver or health disclosure.'
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (pendingReportsToSign.length > 0) {
                    setViewingPublishedReport(pendingReportsToSign[0]);
                  } else {
                    setActiveTab('tasks');
                  }
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer shadow-lg shrink-0 self-start sm:self-center"
              >
                {pendingReportsToSign.length > 0 ? 'Review & Sign Report →' : 'Complete Form →'}
              </button>
            </div>
          )}

          {/* SECTION 1.5: DUAL-PARENT HOUSEHOLD SUMMARY WIDGET */}
          <div className="bg-slate-850 border border-slate-755 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Home size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Household & Guardian Profile</h3>
                  <p className="text-xs text-slate-400">Primary family contacts, address & emergency details on file.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditingFamily(true);
                  setActiveTab('family');
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700 self-start sm:self-center"
              >
                <Edit3 size={13} />
                <span>Edit Household</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Parent 1 (Father / Primary) */}
              <div className={`bg-slate-900/90 border p-4 rounded-2xl space-y-2 transition ${
                !isParent2Primary ? 'border-emerald-500/70 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30' : 'border-slate-755'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {parent1Relation || 'Father'}
                    </span>
                    {!isParent2Primary && (
                      <span className="text-[9px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full">
                        ⭐ Primary Holder
                      </span>
                    )}
                  </div>
                  <User size={13} className="text-emerald-400 shrink-0" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">
                    {parent1Name || parentDoc.fullName || parentDoc.username || 'Not Recorded'}
                  </strong>
                  <div className="space-y-1 mt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-emerald-400 shrink-0" />
                      {parent1Phone || parentDoc.phone ? (
                        <a href={`tel:${parent1Phone || parentDoc.phone}`} className="hover:underline text-slate-200 font-mono">
                          {parent1Phone || parentDoc.phone}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">No phone on record</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-emerald-400 shrink-0" />
                      {parent1Email || parentDoc.email ? (
                        <a href={`mailto:${parent1Email || parentDoc.email}`} className="hover:underline text-slate-200 truncate max-w-[200px]" title={parent1Email || parentDoc.email}>
                          {parent1Email || parentDoc.email}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">No email</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent 2 (Mother / Secondary) */}
              <div className={`bg-slate-900/90 border p-4 rounded-2xl space-y-2 transition ${
                isParent2Primary ? 'border-teal-500/70 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/30' : 'border-slate-755'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded-full">
                      {parent2Relation || 'Mother'}
                    </span>
                    {isParent2Primary && (
                      <span className="text-[9px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full">
                        ⭐ Primary Holder
                      </span>
                    )}
                  </div>
                  <User size={13} className="text-teal-400 shrink-0" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">
                    {parent2Name || 'Not Recorded'}
                  </strong>
                  <div className="space-y-1 mt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-teal-400 shrink-0" />
                      {parent2Phone ? (
                        <a href={`tel:${parent2Phone}`} className="hover:underline text-slate-200 font-mono">
                          {parent2Phone}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">No phone on record</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-teal-400 shrink-0" />
                      {parent2Email ? (
                        <a href={`mailto:${parent2Email}`} className="hover:underline text-slate-200 truncate max-w-[200px]" title={parent2Email}>
                          {parent2Email}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">No email</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address & Emergency Contact */}
              <div className="bg-slate-900/90 border border-slate-755 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Residence & Emergency
                  </span>
                  <ShieldCheck size={13} className="text-amber-400" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-200">
                    <MapPin size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{familyAddress || parentDoc.address || 'Address not provided'}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Contact:</span>
                    <strong className="text-white block font-bold">
                      {emergencyContactName || 'Not specified'}
                    </strong>
                    {emergencyContactPhone && (
                      <span className="text-amber-300 font-mono flex items-center gap-1">
                        <Phone size={10} /> {emergencyContactPhone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1.7: UPCOMING CONFIRMED LEADER CONFERENCES & INQUIRIES WIDGET */}
          {(confirmedConferences.length > 0 || pendingConferences.length > 0) && (
            <div className="bg-slate-850 border border-slate-755 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">Leader Conferences & Inquiries</h3>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Live Status
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Scheduled 1-on-1 parent conferences and advancement reviews with troop leadership.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMeetingModal(true)}
                  className="px-3.5 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-sky-500/40 self-start sm:self-center"
                >
                  <span>＋ Request Another Meeting</span>
                </button>
              </div>

              {rsvpSuccessMsg && (
                <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs font-bold text-emerald-300 animate-fadeIn flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{rsvpSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Confirmed Conferences */}
                {confirmedConferences.map(conf => (
                  <div 
                    key={conf.requestId || conf.id}
                    className={`border-2 p-5 rounded-2xl space-y-3 shadow-lg flex flex-col justify-between ${
                      conf.initiatedBy === 'leader' && conf.rsvpStatus !== 'attending'
                        ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/70 shadow-purple-950/30'
                        : 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            conf.initiatedBy === 'leader'
                              ? 'bg-purple-500 text-slate-950'
                              : 'bg-emerald-500 text-slate-950'
                          }`}>
                            <CheckCircle2 size={12} />
                            <span>{conf.initiatedBy === 'leader' ? 'Leader Invitation' : 'Confirmed Conference'}</span>
                          </span>

                          {conf.rsvpStatus && (
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              conf.rsvpStatus === 'attending'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                                : conf.rsvpStatus === 'reschedule_requested'
                                ? 'bg-amber-950 text-amber-300 border-amber-500'
                                : conf.rsvpStatus === 'declined'
                                ? 'bg-rose-950 text-rose-300 border-rose-500'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              RSVP: {conf.rsvpStatus.replace('_', ' ')}
                            </span>
                          )}
                        </div>

                        <ConferenceCountdown date={conf.confirmedDate} time={conf.confirmedTime} variant="pill" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-white text-sm">
                            {conf.scoutName} &bull; <span className="text-slate-300 text-xs font-normal">{conf.patrolName}</span>
                          </h4>
                          <span className="text-xs font-bold text-emerald-300 font-mono">
                            📅 {conf.confirmedDate} @ {conf.confirmedTime || '6:30 PM'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Topic: <strong className="text-emerald-300">{conf.meetingTopic || 'Advancement & Progress'}</strong>
                        </p>
                      </div>

                      <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <User size={12} className="text-emerald-400 shrink-0" />
                          <span><strong>Confirmed Leader:</strong> {conf.confirmedBy || conf.leaderName || 'Troop Leader'} ({conf.confirmedByRole || conf.leaderRole || 'Scoutmaster'})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <MapPin size={12} className="text-emerald-400 shrink-0" />
                          <span><strong>Venue / Location:</strong> {conf.meetingLocation || 'Troop Headquarters'}</span>
                        </div>
                        {(conf.confirmationNote || conf.meetingAgenda) && (
                          <p className="text-xs text-emerald-200/90 italic pt-1 border-t border-slate-800">
                            📝 {conf.confirmationNote ? `Leader Note: "${conf.confirmationNote}"` : `Agenda: "${conf.meetingAgenda}"`}
                          </p>
                        )}
                      </div>
                    </div>

                    {conf.initiatedBy === 'leader' && conf.rsvpStatus !== 'attending' && conf.rsvpStatus !== 'declined' ? (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 flex-wrap">
                        <span className="text-[11px] text-purple-300 font-semibold">Please Confirm Attendance:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleParentRsvpSubmit(conf, 'attending')}
                            disabled={isSubmittingRsvp}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md"
                          >
                            <CheckCircle2 size={13} />
                            <span>Accept & Attend</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReschedulingConference(conf);
                              setProposedAltDate(conf.confirmedDate || new Date().toISOString().split('T')[0]);
                              setProposedAltTime(conf.confirmedTime || '6:30 PM');
                              setRescheduleNote('');
                            }}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Clock size={13} />
                            <span>Reschedule</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleParentRsvpSubmit(conf, 'declined')}
                            disabled={isSubmittingRsvp}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-emerald-400 font-mono">✓ Confirmed with Leadership</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCancellingConference(conf);
                            setCancelReason('');
                          }}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-red-500/40 cursor-pointer"
                        >
                          <XCircle size={13} />
                          <span>Cancel Meeting</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pending Conferences */}
                {pendingConferences.map(conf => (
                  <div 
                    key={conf.requestId || conf.id}
                    className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          <span>Awaiting Leader Confirmation</span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Pref: {conf.proposedDate || 'Flexible'} {conf.proposedTime ? `at ${conf.proposedTime}` : ''}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-sm">
                          {conf.scoutName} &bull; <span className="text-slate-300 text-xs font-normal">{conf.patrolName}</span>
                        </h4>
                        <p className="text-xs text-slate-300">
                          Requested Leader: <strong className="text-amber-300">{conf.targetLeaderName || 'Any Available Leader / Scoutmaster'}</strong>
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 italic">
                        "{conf.message}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-amber-400 font-mono">⏳ In Leader Review Queue</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingConference(conf);
                          setCancelReason('');
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-red-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <XCircle size={13} />
                        <span>Cancel Request</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: CURRENT RANK & COMPLETED ADVANCEMENT PROGRESS WIDGET */}
          <div className="bg-slate-850 border border-slate-755 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚜️</span>
                <div>
                  <h3 className="font-extrabold text-white text-base">Current Rank & Advancement Progress</h3>
                  <p className="text-xs text-slate-400">Real-time status certified by troop leaders — Completed & In Progress.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('advancement')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Roadmap & Requirements</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scopedScouts.map(scout => {
                const sRanks = ranksProgressMap[scout.uid] || {};
                const latestRank = getLatestAchievedRank(sRanks, scout.rank);
                const nextRank = getNextIncompleteRank(sRanks);
                const targetStats = getRankCompletionPercentage(nextRank.id, sRanks);
                const sMerit = meritProgressMap[scout.uid] || {};
                const earnedBadgesCount = MERIT_BADGES.filter(b => sMerit[b.id]?.completed === true).length;
                const groupObj = allGroups.find(g => g.id === (scout.groupId || scout.patrolId)) || {};
                const bsaRanks = RANKS_DATA.filter(r => r.id !== 'arrow_of_light');

                return (
                  <div key={scout.uid} className="bg-slate-900 border border-slate-755 p-5 rounded-2xl space-y-3 shadow-md">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                          <span>{scout.fullName || scout.username}</span>
                          <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold">
                            {scout.scoutPosition || 'Scout'}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Patrol: <strong className="text-slate-200">{groupObj.name || scout.patrolName || scout.patrol || 'Unassigned Patrol'}</strong> &bull; Current Rank: <strong className="text-emerald-400">{latestRank.name}</strong>
                        </p>
                      </div>

                      <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/50 border border-amber-500/40 px-2.5 py-1 rounded-xl">
                        {targetStats.percentage}% to {nextRank.name}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${targetStats.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{targetStats.completed} of {targetStats.total} Requirements Certified</span>
                        <span>{earnedBadgesCount} Merit Badges Earned</span>
                      </div>
                    </div>

                    {/* 7-Rank Pathway Mini-Chips */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        Rank Milestones Completed & Active:
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                        {bsaRanks.map(rank => {
                          const isDone = isRankCompleted(rank, sRanks);
                          const isActiveNext = rank.id === nextRank.id && !isDone;
                          return (
                            <button
                              key={rank.id}
                              type="button"
                              onClick={() => {
                                setSelectedRankMap(prev => ({ ...prev, [scout.uid]: rank.id }));
                                setActiveTab('advancement');
                              }}
                              title={`${rank.name}: ${isDone ? 'Earned & Certified' : isActiveNext ? 'In Progress' : 'Upcoming'}`}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80 hover:bg-emerald-900'
                                  : isActiveNext
                                  ? 'bg-amber-950 text-amber-300 border border-amber-600 animate-pulse hover:bg-amber-900'
                                  : 'bg-slate-800/80 text-slate-500 border border-slate-755 hover:text-slate-400'
                              }`}
                            >
                              <RankIcon rankId={rank.id} size={11} />
                              <span>{rank.name}</span>
                              {isDone && <Check size={10} className="text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Merit Badges Earned & Planned Quick Row */}
                    {(() => {
                      const plannedCount = MERIT_BADGES.filter(b => {
                        const ed = getBadgeStatusAndProgress(b, sMerit);
                        return ed.isPlanned;
                      }).length;
                      return (
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-amber-400">Merit Badges:</span>
                            <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-lg font-bold">
                              ✓ {earnedBadgesCount} Earned
                            </span>
                            {plannedCount > 0 && (
                              <span className="text-[11px] bg-sky-950/80 text-sky-300 border border-sky-700/60 px-2.5 py-0.5 rounded-lg font-bold">
                                🎯 {plannedCount} Planned
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAdvancementViewFilter('merit');
                              setMeritSubTabMap(prev => ({ ...prev, [scout.uid]: plannedCount > 0 ? 'planned' : 'earned' }));
                              setActiveTab('advancement');
                            }}
                            className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Inspect Badges &rarr;</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: THIS WEEK'S HOMEWORK (Top 1–2 Active Tasks) */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎒</span>
                <div>
                  <h3 className="font-extrabold text-white text-base">This Week's Homework & Quests</h3>
                  <p className="text-xs text-slate-400">
                    {activeHomework.length > 0 
                      ? `${activeHomework.length} active assignments requiring scout attention.`
                      : 'All assigned tasks completed! Great work.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('homework')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Homework</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {activeHomework.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-400 italic">
                ✨ No pending homework assignments! All learning modules are completed.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeHomework.slice(0, 2).map((hw, idx) => {
                  const relDue = getRelativeDueDate(hw.dueDate);
                  return (
                    <div key={`${hw.id}_${idx}`} className="bg-slate-900 border border-slate-755 p-5 rounded-2xl space-y-3 shadow-md">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Prominent Scout Name Badge */}
                        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl shadow-sm">
                          <span className="text-base">👦</span>
                          <span className="text-[11px] uppercase font-black tracking-wider text-slate-300">Child:</span>
                          <strong className="text-sm sm:text-base font-black text-white">{hw.scoutName}</strong>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border ${
                          hw.status === 'in_review'
                            ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                            : hw.status === 'overdue'
                            ? 'bg-red-950 text-red-300 border-red-500/40'
                            : 'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}>
                          {hw.status === 'in_review' ? '📤 Under Review' : hw.status === 'overdue' ? '⚠️ Overdue' : '⏳ Needs Submission'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold bg-slate-800 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full inline-block">
                          {hw.category || 'Scouting Skills'}
                        </span>
                        <h4 className="font-extrabold text-white text-sm sm:text-base">{hw.title}</h4>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                        <span className="font-mono text-amber-300 font-bold flex items-center gap-1">
                          <Clock size={12} /> {relDue}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('homework')}
                          className="text-emerald-400 hover:text-emerald-300 font-bold"
                        >
                          Inspect &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 4: UPCOMING CALENDAR STREAM (Next 2–3 Troop Events) */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <div>
                  <h3 className="font-extrabold text-white text-base">Upcoming Troop Schedule</h3>
                  <p className="text-xs text-slate-400">Next meetings, campouts, and family gatherings.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Calendar & RSVPs</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {(() => {
              const todayStr = new Date().toISOString().split('T')[0];
              const upcomingEvents = eventsList
                .filter(e => (e.date || '') >= todayStr)
                .slice(0, 3);

              if (upcomingEvents.length === 0) {
                return (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-400 italic">
                    No upcoming events scheduled right now. Check back soon!
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {upcomingEvents.map(ev => {
                    const targetInfo = getEventTargeting(ev, activeScout, allGroups);
                    const rsvpKey = `rsvp_${ev.id}_${activeScout?.uid || linkedScouts[0]?.uid || currentUser.uid}`;
                    const currentRsvp = eventRsvps[rsvpKey]?.status;

                    return (
                      <div key={ev.id} className="bg-slate-900 border border-slate-755 p-4 sm:p-5 rounded-2xl space-y-3 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${targetInfo.color}`}>
                                {targetInfo.badge}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-300">
                                📅 {ev.date} &bull; ⏰ {ev.time || '6:30 PM'}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-white text-sm sm:text-base">{ev.title}</h4>
                            
                            {ev.location && (
                              <p className="text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
                                <MapPin size={12} className="text-emerald-400 shrink-0" />
                                <span>{ev.location}</span>
                              </p>
                            )}
                          </div>

                          {/* Quick RSVP Actions */}
                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleRsvp(ev.id, selectedScoutId, 'going')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                currentRsvp === 'going'
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
                              }`}
                            >
                              <CheckCircle2 size={13} />
                              <span>{currentRsvp === 'going' ? 'Going ✓' : 'Going'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRsvp(ev.id, selectedScoutId, 'cant_go')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                currentRsvp === 'cant_go'
                                  ? 'bg-red-600 text-white shadow-md'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
                              }`}
                            >
                              <XCircle size={13} />
                              <span>{currentRsvp === 'cant_go' ? "Can't Go" : "Can't Go"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setAbsenceDate(ev.date || todayStr);
                                setShowAbsenceModal(true);
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold ml-1 cursor-pointer"
                              title="Notify leader with reason for absence"
                            >
                              Notify Leader
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── 5. TAB 2: DEDICATED CHILD HOMEWORK & TASKS CHECKLIST ── */}
      {activeTab === 'homework' && (
        <div className="space-y-6">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <BookOpen size={18} className="text-sky-400" />
                  <span>Assignments & Learning Checklist</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track weekly quests, Islamic reflections, and skill practice for {isAllView ? 'your family' : activeScout?.fullName || activeScout?.username}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {completedHomework.length} Completed
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-950 text-amber-300 border border-amber-700">
                  {activeHomework.length} In Progress
                </span>
              </div>
            </div>
          </div>

          {/* Active Homework Items */}
          <div className="space-y-3">
            {activeHomework.length === 0 ? (
              <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center space-y-2">
                <CheckCircle2 size={40} className="mx-auto text-emerald-400 opacity-60" />
                <h4 className="text-sm font-bold text-white">All Caught Up on Homework!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No active assignments requiring submission at this time.
                </p>
              </div>
            ) : (
              activeHomework.map((hw, idx) => {
                const relDue = getRelativeDueDate(hw.dueDate);
                return (
                  <div 
                    key={`${hw.id}_${idx}`}
                    className="bg-slate-850 border border-slate-755 p-5 rounded-2xl space-y-3 shadow-md hover:border-slate-700 transition"
                  >
                    {/* Prominent Large Scout Name Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 p-3.5 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-base font-black text-emerald-300 shrink-0 shadow-md">
                          👦
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block leading-tight">
                            Assigned Scout:
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                            {hw.scoutName}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                        <span className="text-xs font-bold bg-slate-800 border border-slate-700 text-sky-300 px-3 py-1 rounded-xl">
                          {hw.category || 'Scouting Skills'}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                          hw.status === 'in_review'
                            ? 'bg-sky-950 text-sky-300 border-sky-500/50'
                            : hw.status === 'overdue'
                            ? 'bg-red-950 text-red-300 border-red-500/50'
                            : 'bg-amber-950 text-amber-300 border-amber-500/50'
                        }`}>
                          {hw.status === 'in_review' 
                            ? '📤 Submitted — Awaiting Review' 
                            : hw.status === 'overdue'
                            ? '⚠️ Overdue — Action Needed'
                            : '⏳ Pending Scout Submission'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <h4 className="font-black text-white text-base sm:text-lg">{hw.title}</h4>
                      {hw.description && (
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{hw.description}</p>
                      )}
                    </div>

                    {/* Scout Submission Details if already submitted */}
                    {hw.submission?.submissionText && (
                      <div className="bg-slate-900/80 border border-slate-750 p-3.5 rounded-2xl text-xs text-slate-300 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                          📝 Child's Submission Text:
                        </span>
                        <p className="whitespace-pre-wrap font-sans text-slate-200">{hw.submission.submissionText}</p>
                        {hw.submission.submittedAt && (
                          <span className="text-[10px] text-slate-400 block pt-1">
                            Submitted on {new Date(hw.submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-755 px-1">
                      <span className={`font-mono font-bold flex items-center gap-1.5 ${hw.status === 'overdue' ? 'text-red-400' : 'text-amber-300'}`}>
                        <Clock size={13} />
                        <span>{relDue}</span>
                      </span>
                    </div>

                    {/* Leader Feedback Quote Bubble */}
                    {hw.leaderFeedback && (
                      <div className="bg-slate-900/90 border border-slate-750 p-3.5 rounded-2xl text-xs text-slate-300 italic flex items-start gap-2.5">
                        <MessageSquare size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-400 font-bold not-italic block text-[11px]">💬 Leader Instructions & Feedback:</strong>
                          <p className="mt-0.5 leading-relaxed">"{hw.leaderFeedback}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Collapsible Completed Homework Archive */}
          {completedHomework.length > 0 && (
            <div className="bg-slate-850 border border-slate-750 rounded-3xl overflow-hidden shadow-md">
              <button
                type="button"
                onClick={() => setCompletedHomeworkOpen(!completedHomeworkOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer bg-slate-900/50"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>View Completed Homework Archive ({completedHomework.length} Finished Tasks)</span>
                </div>
                {completedHomeworkOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {completedHomeworkOpen && (
                <div className="p-5 space-y-2.5 border-t border-slate-800">
                  {completedHomework.map((hw, idx) => (
                    <div key={`comp_${hw.id}_${idx}`} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                            👦 {hw.scoutName}
                          </span>
                          <span className="text-[11px] text-slate-400">{hw.category || 'General'}</span>
                        </div>
                        <strong className="text-white text-sm block font-bold">{hw.title}</strong>
                        {hw.submission?.submissionText && (
                          <p className="text-slate-400 text-xs line-clamp-1 italic">"{hw.submission.submissionText}"</p>
                        )}
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto">
                        <Check size={12} /> Completed & Signed Off
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 6. TAB 3: UPCOMING SCHEDULE & CHILD TARGETING ── */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Calendar size={18} className="text-sky-400" />
                  <span>Troop Schedule & Child Targeting</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Transparent audience tags clarify exactly which events apply to your scouts and family.
                </p>
              </div>

              {/* Sub Tabs: Upcoming vs Past */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-750 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setEventSubTab('upcoming')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    eventSubTab === 'upcoming'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Upcoming Schedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEventSubTab('past')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    eventSubTab === 'past'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Past Events</span>
                </button>
              </div>
            </div>
          </div>

          {/* Confirmed 1-on-1 Leader Conferences (Pinned to top of Upcoming Schedule) */}
          {eventSubTab === 'upcoming' && confirmedConferences.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Personal 1-on-1 Leader Conferences ({confirmedConferences.length})</span>
                </span>
                <span className="text-[11px] text-slate-400 italic">Confirmed with Troop Leadership</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {confirmedConferences.map(conf => (
                  <div
                    key={`ev_conf_${conf.requestId || conf.id}`}
                    className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-2 border-emerald-500/70 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                          <CheckCircle2 size={13} />
                          <span>Confirmed 1-on-1 Conference</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          📅 {conf.confirmedDate} @ {conf.confirmedTime || '6:30 PM'}
                        </span>
                      </div>

                      {/* Live Segmented Countdown Timer */}
                      <ConferenceCountdown date={conf.confirmedDate} time={conf.confirmedTime} variant="full" />

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-lg flex items-center gap-2">
                          <span>🤝 Conference for {conf.scoutName}</span>
                        </h4>
                        <p className="text-xs text-slate-300">
                          Patrol: <strong className="text-slate-200">{conf.patrolName}</strong> &bull; Topic: <strong className="text-emerald-300">{conf.meetingTopic || 'Advancement Review'}</strong>
                        </p>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-200">
                          <User size={13} className="text-emerald-400 shrink-0" />
                          <span><strong>Confirmed Leader:</strong> {conf.confirmedBy || 'Troop Leader'} ({conf.confirmedByRole || 'Scoutmaster'})</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-200">
                          <MapPin size={13} className="text-emerald-400 shrink-0" />
                          <span><strong>Meeting Location:</strong> {conf.meetingLocation || 'Troop Headquarters (Highview Elementary School)'}</span>
                        </div>
                        {conf.confirmationNote && (
                          <div className="pt-2 border-t border-slate-800 text-xs text-emerald-200/90 italic">
                            📝 Leader Note: "{conf.confirmationNote}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">✓ Active Personal Appointment</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingConference(conf);
                          setCancelReason('');
                        }}
                        className="px-4 py-2 bg-red-950/70 hover:bg-red-900/90 text-red-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-red-500/50 cursor-pointer shadow-md"
                      >
                        <XCircle size={14} />
                        <span>Cancel Conference</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Stream */}
          {(() => {
            const todayStr = new Date().toISOString().split('T')[0];
            const upcomingList = eventsList.filter(e => (e.date || '') >= todayStr);
            const pastList = eventsList.filter(e => (e.date || '') < todayStr);
            const displayList = eventSubTab === 'past' ? pastList : upcomingList;

            if (displayList.length === 0 && (eventSubTab !== 'upcoming' || confirmedConferences.length === 0)) {
              return (
                <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center text-xs text-slate-400 italic">
                  {eventSubTab === 'past' ? 'No past events found.' : 'No upcoming troop events scheduled right now.'}
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {displayList.map(ev => {
                  const targetInfo = getEventTargeting(ev, activeScout, allGroups);
                  const rsvpKey = `rsvp_${ev.id}_${activeScout?.uid || linkedScouts[0]?.uid || currentUser.uid}`;
                  const currentRsvp = eventRsvps[rsvpKey]?.status;

                  return (
                    <div key={ev.id} className="bg-slate-850 border border-slate-755 p-6 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${targetInfo.color}`}>
                              {targetInfo.badge}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-300">
                              📅 {ev.date} &bull; ⏰ {ev.time || '6:30 PM - 8:30 PM'}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-white text-lg">{ev.title}</h4>

                          {/* Targeting Context Description */}
                          <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                            <Compass size={13} className="text-sky-400 shrink-0" />
                            <span>{targetInfo.label}</span>
                          </p>

                          {/* Meeting Location */}
                          {ev.location && (
                            <p className="text-xs text-emerald-300 flex items-center gap-1.5 font-medium bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-xl w-fit max-w-full">
                              <MapPin size={12} className="text-emerald-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </p>
                          )}

                          {/* Preparation / Required Gear Notes */}
                          {(ev.gear || ev.notes || ev.description) && (
                            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-750 leading-relaxed font-sans">
                              🎒 <strong className="text-white">Gear & Prep:</strong> {ev.gear || ev.notes || ev.description}
                            </p>
                          )}
                        </div>

                        {/* RSVP & Absence Actions */}
                        <div className="bg-slate-900 border border-slate-750 p-4 rounded-2xl space-y-2 shrink-0 self-start sm:self-auto min-w-[200px]">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">Family RSVP</span>
                          
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRsvp(ev.id, selectedScoutId, 'going')}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                                currentRsvp === 'going'
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
                              }`}
                            >
                              <CheckCircle2 size={13} />
                              <span>{currentRsvp === 'going' ? 'Going ✓' : 'Going'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRsvp(ev.id, selectedScoutId, 'cant_go')}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                                currentRsvp === 'cant_go'
                                  ? 'bg-red-600 text-white shadow-md'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
                              }`}
                            >
                              <XCircle size={13} />
                              <span>{currentRsvp === 'cant_go' ? "Can't Go" : "Can't Go"}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setAbsenceDate(ev.date || todayStr);
                              setShowAbsenceModal(true);
                            }}
                            className="w-full text-center text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold pt-1 cursor-pointer block"
                          >
                            Can't attend? Notify Leader &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── 7. TAB 4: STANDALONE ALERTS & ACTIVITY FEED ── */}
      {activeTab === 'feed' && (
        <ParentAlertsFeed 
          currentUser={currentUser} 
          linkedScouts={linkedScouts} 
          onNavigate={(targetTab) => setActiveTab(targetTab)}
          onOpenAction={(targetTab, payload) => {
            if (targetTab === 'reports' && payload) {
              setViewingPublishedReport(payload);
            } else if (targetTab === 'tasks' && payload) {
              setSubmittingTask(payload);
            } else {
              setActiveTab(targetTab);
            }
          }}
        />
      )}

      {/* ── 8. TAB 5: OFFICIAL PROGRESS REPORTS ── */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Printer size={18} className="text-emerald-400" />
                  <span>Official Progress Reports & Digital Signatures</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  View certified report snapshots for your scouts, apply parent digital signatures, and export official records.
                </p>
              </div>

              {/* Sub-tabs: Published Snapshots vs Live Interactive Report */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-750 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setReportSubTab('published')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    reportSubTab === 'published'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Published Snapshots</span>
                  <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">{filteredPublishedReports.length}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportSubTab('live')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    reportSubTab === 'live'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Live Roadmap</span>
                </button>
              </div>
            </div>

            {parentSignSuccessToast && (
              <div className="p-3.5 bg-emerald-950 border border-emerald-500/60 rounded-2xl text-emerald-200 text-xs flex items-center gap-2 font-bold animate-fadeIn shadow-lg">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{parentSignSuccessToast}</span>
              </div>
            )}
          </div>

          {reportSubTab === 'published' ? (
            <div className="space-y-4">
              {filteredPublishedReports.length === 0 ? (
                <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center space-y-3">
                  <FileText size={42} className="mx-auto text-slate-500 opacity-50" />
                  <h4 className="text-sm font-bold text-white">No Published Reports Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Troop leaders publish official progress report snapshots prior to parent conferences and Court of Honor advancement milestones.
                  </p>
                </div>
              ) : (
                filteredPublishedReports.map(report => {
                  const isParentSigned = report.signatures?.parent?.signed;
                  return (
                    <div
                      key={report.id}
                      className={`bg-slate-850 border p-6 rounded-3xl space-y-4 shadow-xl transition ${
                        !isParentSigned ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-slate-755'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-slate-900 border border-slate-700 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                              {report.reportSnapshot?.rank || 'Scout'} Rank Snapshot
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-300">
                              📅 Published {report.publishedAt?.split('T')[0]}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-white text-base">
                            Official Progress Report for {report.scoutName}
                          </h4>

                          <p className="text-xs text-slate-400">
                            Certifying Leader: <strong className="text-slate-200">{report.leaderName}</strong> &bull; Patrol: <strong className="text-slate-200">{report.patrolName}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                          {!isParentSigned && (
                            <button
                              type="button"
                              onClick={() => setSigningPublishedReport(report)}
                              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-950/40 animate-pulse"
                            >
                              <PenTool size={14} />
                              <span>Review & Sign as Parent</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setViewingPublishedReport(report)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                          >
                            <FileText size={14} />
                            <span>{isParentSigned ? 'View & Print Signed PDF' : 'Inspect Snapshot'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Summary Metrics & Signature Status Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-755 text-center">
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Advancement</span>
                          <strong className="text-emerald-400 font-mono text-sm">{report.reportSnapshot?.rankProgress || 0}%</strong>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance</span>
                          <strong className="text-sky-400 font-mono text-sm">{report.reportSnapshot?.attendanceRate || 100}%</strong>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Service Hours</span>
                          <strong className="text-amber-400 font-mono text-sm">{report.reportSnapshot?.serviceHours || 0} hrs</strong>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Signing Status</span>
                          {isParentSigned ? (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                              <ShieldCheck size={13} /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                              <Clock size={13} /> Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <ScoutProgressReport scout={activeScout || linkedScouts[0]} currentUser={currentUser} onBack={() => setReportSubTab('published')} />
          )}
        </div>
      )}

      {/* ── 9. TAB 6: FORMS & WAIVERS (Parent Action Center) ── */}
      {activeTab === 'tasks' && (
        <div className="space-y-5">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-2">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span>Parent Action Center: Forms & Waivers</span>
            </h3>
            <p className="text-xs text-slate-400">
              Submit digital acknowledgments, medical record uploads, and activity permission slips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluatedTasks.length === 0 ? (
              <p className="col-span-full text-center py-12 bg-slate-850 rounded-3xl border border-slate-750 text-slate-400 text-xs">
                No active forms assigned right now. All requirements are up to date!
              </p>
            ) : (
              evaluatedTasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-slate-850 border rounded-3xl p-6 shadow-xl space-y-3 transition ${
                    task.isDone ? 'border-emerald-600/40 bg-emerald-950/15' :
                    task.isOverdue ? 'border-red-500/60 bg-red-950/20' :
                    task.isUrgent ? 'border-amber-500/60 bg-amber-950/20' :
                    'border-slate-755'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full text-slate-300 font-bold">
                          {task.category}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                          task.isDone ? 'bg-emerald-950 text-emerald-300 border-emerald-600' :
                          task.isOverdue ? 'bg-red-950 text-red-300 border-red-500' :
                          task.isUrgent ? 'bg-amber-950 text-amber-300 border-amber-500' :
                          'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {task.isDone ? '✓ Completed' : task.isOverdue ? '🚨 Overdue' : task.isUrgent ? `⚡ Due in ${task.daysDiff}d` : 'Pending Action'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-white text-base">{task.title}</h4>
                    </div>

                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      Due: {task.dueDate || 'Ongoing'}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3.5 rounded-2xl border border-slate-755">
                      {task.description}
                    </p>
                  )}

                  {task.docUrl && (
                    <a
                      href={task.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-bold"
                    >
                      <ExternalLink size={12} /> View Blank Template / Guidelines
                    </a>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-755">
                    {task.isDone ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Submitted on {task.submission?.submittedAt?.split('T')[0]}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSubmittingTask(task)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <Send size={13} />
                        <span>Sign & Submit Form</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB: ROAD TO EAGLE CAPSTONE TRACKER ── */}
      {activeTab === 'eagle' && (
        <ParentEagleTracker
          linkedScouts={linkedScouts}
          selectedScoutId={selectedScoutId}
          onSelectScout={(sId) => setSelectedScoutId(sId)}
          allGroups={allGroups}
          ranksProgressMap={ranksProgressMap}
          meritProgressMap={meritProgressMap}
        />
      )}

      {/* ── TAB: PATROL-SCOPED RESOURCES & SAFETY DIRECTORY ── */}
      {activeTab === 'resources' && (
        <ParentPatrolResources
          linkedScouts={linkedScouts}
          selectedScoutId={selectedScoutId}
          onSelectScout={(sId) => setSelectedScoutId(sId)}
          allGroups={allGroups}
          allUsers={allUsers}
          onNavigate={onNavigate}
        />
      )}

      {/* ── 10. TAB 7: ADVANCEMENT & BADGES (Complete & In-Progress Progress) ── */}
      {activeTab === 'advancement' && (
        <div className="space-y-8">
          {scopedScouts.map(scout => {
            const sRanks = ranksProgressMap[scout.uid] || {};
            const sMerit = meritProgressMap[scout.uid] || {};
            const sIslamic = islamicProgressMap[scout.uid] || {};

            // Available BSA ranks (including AOL if scout has progress)
            const aolHasProgress = sRanks['arrow_of_light'] && (
              sRanks['arrow_of_light'].completed ||
              Object.keys(sRanks['arrow_of_light'].completedRequirements || sRanks['arrow_of_light'].steps || {}).length > 0
            );
            const bsaRanks = aolHasProgress ? RANKS_DATA : RANKS_DATA.filter(r => r.id !== 'arrow_of_light');

            const latestRank = getLatestAchievedRank(sRanks, scout.rank);
            const nextRank = getNextIncompleteRank(sRanks);
            const completedRanks = bsaRanks.filter(r => isRankCompleted(r, sRanks));

            // Active inspected rank for this scout
            const currentSelectedRankId = selectedRankMap[scout.uid] || nextRank.id || 'scout';
            const selectedRank = RANKS_DATA.find(r => r.id === currentSelectedRankId) || nextRank || RANKS_DATA[0];
            const isSelectedRankCompleted = isRankCompleted(selectedRank, sRanks);
            const selectedRankStats = getRankCompletionPercentage(selectedRank.id, sRanks);
            const selectedRankReqs = (sRanks[selectedRank.id] || {}).completedRequirements || (sRanks[selectedRank.id] || {}).steps || {};
            const selectedRankDate = (sRanks[selectedRank.id] || {}).completedDate || (sRanks[selectedRank.id] || {}).dateCompleted || (sRanks[selectedRank.id] || {}).approvedAt || null;

            // Total Requirements Certified across all ranks
            let totalCertifiedReqsAllRanks = 0;
            let totalReqsAllRanks = 0;
            bsaRanks.forEach(r => {
              const st = getRankCompletionPercentage(r.id, sRanks);
              totalCertifiedReqsAllRanks += st.completed;
              totalReqsAllRanks += st.total;
            });

            // Evaluate all merit badges for this scout using helper
            const evaluatedBadges = MERIT_BADGES.map(badge => {
              const evalData = getBadgeStatusAndProgress(badge, sMerit);
              return {
                badge,
                ...evalData
              };
            });

            const plannedBadges = evaluatedBadges.filter(b => b.isPlanned);
            const earnedBadges = evaluatedBadges.filter(b => b.isEarned);
            const inProgressBadges = evaluatedBadges.filter(b => b.isInProgress);

            const eagleRequiredEarned = earnedBadges.filter(b => b.badge.eagleRequired).length;
            const eagleRequiredPlanned = plannedBadges.filter(b => b.badge.eagleRequired).length;
            const electiveEarned = earnedBadges.filter(b => !b.badge.eagleRequired).length;
            const electivePlanned = plannedBadges.filter(b => !b.badge.eagleRequired).length;
            const totalEagleTracked = Math.min(14, eagleRequiredEarned + eagleRequiredPlanned) + Math.min(7, electiveEarned + electivePlanned);

            const activeMeritTab = meritSubTabMap[scout.uid] || (plannedBadges.length > 0 ? 'planned' : earnedBadges.length > 0 ? 'earned' : 'eagle_required');
            const scoutSearchTerm = (badgeSearchMap[scout.uid] || '').toLowerCase().trim();

            // Islamic Topics metrics
            const completedIslamicTopics = ISLAMIC_BASICS_TOPICS.filter(t => {
              const st = sIslamic[t.id];
              return st === true || st?.completed === true || (sIslamic.completedTopics && sIslamic.completedTopics[t.id]);
            });

            const currentFilter = advancementViewFilter; // 'all' | 'completed' | 'inprogress' | 'merit' | 'islamic'

            return (
              <div key={scout.uid} className="bg-slate-850 border border-slate-750 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
                
                {/* 1. Scout Advancement Header Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 p-5 rounded-2xl border border-slate-755 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                      {scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-white text-lg sm:text-xl">
                          {scout.fullName || scout.username}
                        </h3>
                        <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                          {allGroups.find(g => g.id === (scout.groupId || scout.patrolId))?.name || scout.patrol || scout.patrolName || scout.talia || 'Unassigned Patrol'}
                        </span>
                        {scout.scoutPosition && (
                          <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                            {scout.scoutPosition}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                        <span>Current Rank: <strong className="text-emerald-400 font-bold">{latestRank.name}</strong></span>
                        <span>&bull;</span>
                        <span>Working Toward: <strong className="text-amber-300 font-bold">{nextRank.name}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* High-level Metric Stat Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                    <div className="bg-slate-900/90 border border-emerald-500/30 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Ranks Achieved</span>
                      <span className="text-sm font-black text-emerald-300 font-mono">{completedRanks.length} / {bsaRanks.length}</span>
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/30 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Certified Reqs</span>
                      <span className="text-sm font-black text-sky-300 font-mono">{totalCertifiedReqsAllRanks} / {totalReqsAllRanks}</span>
                    </div>
                    <div className="bg-slate-900/90 border border-amber-500/30 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Merit Badges</span>
                      <span className="text-sm font-black text-amber-300 font-mono">
                        {earnedBadges.length} Earned &bull; {plannedBadges.length} Planned
                      </span>
                    </div>
                    <div className="bg-slate-900/90 border border-purple-500/30 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Islamic Topics</span>
                      <span className="text-sm font-black text-purple-300 font-mono">{completedIslamicTopics.length} Mastered</span>
                    </div>
                  </div>
                </div>

                {/* 2. Quick View Filter Switcher */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                  {[
                    { id: 'all', label: '🗺️ Full 7-Rank Pathway' },
                    { id: 'completed', label: `✓ Completed Ranks (${completedRanks.length})` },
                    { id: 'inprogress', label: `⚡ In Progress (${nextRank.name})` },
                    { id: 'merit', label: `🏅 Planned & Earned Merit Badges (${earnedBadges.length + plannedBadges.length})` },
                    { id: 'islamic', label: `📖 Islamic Foundations (${completedIslamicTopics.length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setAdvancementViewFilter(tab.id);
                        if (tab.id === 'inprogress') {
                          setSelectedRankMap(prev => ({ ...prev, [scout.uid]: nextRank.id }));
                        } else if (tab.id === 'completed' && completedRanks.length > 0) {
                          setSelectedRankMap(prev => ({ ...prev, [scout.uid]: completedRanks[completedRanks.length - 1].id }));
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        currentFilter === tab.id
                          ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-755 hover:bg-slate-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* 3. 7-Rank Pathway Stepper / Interactive Selector */}
                {(currentFilter === 'all' || currentFilter === 'completed' || currentFilter === 'inprogress') && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Target size={14} className="text-emerald-400" />
                        <span>Official BSA Advancement Pathway</span>
                      </span>
                      <span className="text-[11px] text-slate-400 italic">Click any rank to inspect certified requirements</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                      {bsaRanks.map(rank => {
                        const isDone = isRankCompleted(rank, sRanks);
                        const isActiveNext = rank.id === nextRank.id && !isDone;
                        const isCurrentSelected = rank.id === selectedRank.id;
                        const rankStats = getRankCompletionPercentage(rank.id, sRanks);

                        return (
                          <button
                            key={rank.id}
                            type="button"
                            onClick={() => setSelectedRankMap(prev => ({ ...prev, [scout.uid]: rank.id }))}
                            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer relative ${
                              isCurrentSelected
                                ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg scale-[1.03]'
                                : isDone
                                ? 'bg-emerald-950/30 border-emerald-800/50 hover:bg-emerald-950/50 text-slate-200'
                                : isActiveNext
                                ? 'bg-amber-950/30 border-amber-500/50 hover:bg-amber-950/50 text-slate-200'
                                : 'bg-slate-900/80 border-slate-755 hover:bg-slate-800/80 opacity-70 hover:opacity-100 text-slate-400'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className={`p-2 rounded-xl ${
                                isDone 
                                  ? 'bg-emerald-900/60 text-emerald-300' 
                                  : isActiveNext 
                                  ? 'bg-amber-900/60 text-amber-300' 
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                <RankIcon rankId={rank.id} size={20} />
                              </div>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isDone
                                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                                  : isActiveNext
                                  ? 'bg-amber-900 text-amber-200 border border-amber-600 animate-pulse'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}>
                                {isDone ? '✓ Achieved' : isActiveNext ? '⚡ Active' : 'Upcoming'}
                              </span>
                            </div>

                            <div>
                              <strong className="text-white text-xs block truncate">{rank.name}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {rankStats.completed} / {rankStats.total} ({rankStats.percentage}%)
                              </span>
                            </div>

                            {/* Progress Micro Bar */}
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isDone ? 'bg-emerald-400' : isActiveNext ? 'bg-amber-400' : 'bg-slate-600'
                                }`}
                                style={{ width: `${rankStats.percentage}%` }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Inspected Rank Details Card */}
                {(currentFilter === 'all' || currentFilter === 'completed' || currentFilter === 'inprogress') && (
                  <div className="bg-slate-900 border border-slate-755 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
                    
                    {/* Selected Rank Hero Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          isSelectedRankCompleted
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                            : selectedRank.id === nextRank.id
                            ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                            : 'bg-slate-800 border border-slate-700 text-slate-400'
                        }`}>
                          <RankIcon rankId={selectedRank.id} size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-lg font-black text-white">{selectedRank.name} Rank Requirements</h4>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              isSelectedRankCompleted
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                : selectedRank.id === nextRank.id
                                ? 'bg-amber-950 text-amber-300 border border-amber-600'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {isSelectedRankCompleted 
                                ? (selectedRankDate ? `✓ Fully Certified on ${selectedRankDate}` : '✓ Fully Certified Rank')
                                : selectedRank.id === nextRank.id 
                                ? '⚡ Currently in Progress' 
                                : '🔒 Locked / Future Rank Roadmap'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{selectedRank.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right shrink-0">
                        <div>
                          <span className="text-xs font-mono font-black text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 block">
                            {selectedRankStats.completed} of {selectedRankStats.total} Certified ({selectedRankStats.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for Selected Rank */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSelectedRankCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                          }`}
                          style={{ width: `${selectedRankStats.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Requirement Categories & Individual Checklists */}
                    <div className="space-y-4 pt-1">
                      {(selectedRank.categories || []).map((cat, cIdx) => (
                        <div key={cIdx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {cat.requirements.filter(r => selectedRankReqs[r.id]?.completed === true || selectedRankReqs[r.id] === true).length} / {cat.requirements.length} Done
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {cat.requirements.map(req => {
                              const reqData = selectedRankReqs[req.id];
                              const isDone = reqData === true || reqData?.completed === true || reqData === 'completed' || reqData === 'approved' || reqData?.approved === true;
                              const isPending = !isDone && (reqData?.pending === true || reqData === 'pending');
                              const signOffDate = reqData?.completedAt || reqData?.approvedAt || reqData?.completedDate || null;
                              const approver = reqData?.approvedByName || reqData?.signerName || (reqData?.approvedBy ? (allUsers.find(u => u.uid === reqData.approvedBy)?.fullName || allUsers.find(u => u.uid === reqData.approvedBy)?.username || reqData.approvedBy) : null);

                              return (
                                <div
                                  key={req.id}
                                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs transition ${
                                    isDone
                                      ? 'bg-emerald-950/25 border-emerald-800/50 text-emerald-100 shadow-sm'
                                      : isPending
                                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 shadow-sm'
                                      : 'bg-slate-900/70 border-slate-755 text-slate-400'
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <strong className={`${isDone ? 'text-emerald-300 font-black' : isPending ? 'text-amber-300 font-black' : 'text-white'}`}>
                                        Req {req.number || req.id}
                                      </strong>
                                      {isDone && (
                                        <span className="text-[9px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded font-mono font-bold">
                                          ✓ Signed Off
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] leading-relaxed line-clamp-3 font-sans">
                                      {req.text}
                                    </p>
                                    {(signOffDate || approver) && isDone && (
                                      <span className="text-[10px] text-emerald-400/80 font-mono block pt-0.5">
                                        Certified {signOffDate ? `on ${signOffDate.split('T')[0]}` : ''} {approver ? `by ${approver}` : ''}
                                      </span>
                                    )}
                                  </div>

                                  <div className="shrink-0 self-start">
                                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                                      isDone
                                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700 shadow-sm'
                                        : isPending
                                        ? 'bg-amber-900/80 text-amber-300 border border-amber-600 animate-pulse'
                                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                                    }`}>
                                      {isDone ? (
                                        <>
                                          <Check size={11} />
                                          <span>Certified</span>
                                        </>
                                      ) : isPending ? (
                                        <>
                                          <Clock size={11} />
                                          <span>In Review</span>
                                        </>
                                      ) : (
                                        <span>Incomplete</span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Dedicated Planned, Earned & In-Progress Merit Badges Section */}
                {(currentFilter === 'all' || currentFilter === 'merit') && (
                  <div className="bg-slate-900 border border-slate-755 rounded-3xl p-5 sm:p-6 space-y-6 shadow-lg">
                    
                    {/* Header with KPI and Eagle Pacing */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-black text-white flex items-center gap-2">
                            <Award size={20} className="text-amber-400" />
                            <span>Merit Badges & Planned Advancement</span>
                          </h4>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                            Eagle Pathway
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Track planned target dates, requirement steps progress, and officially earned badges for {scout.fullName || scout.username}.
                        </p>
                      </div>

                      {/* Eagle Readiness Stats Box */}
                      <div className="bg-slate-950/80 border border-slate-755 p-3 rounded-2xl flex items-center gap-3.5 shrink-0 text-xs">
                        <div className="text-center pr-3 border-r border-slate-800">
                          <span className="text-[10px] uppercase font-black text-amber-400 block">Eagle Reqs</span>
                          <span className="text-xs font-mono font-bold text-white">
                            {eagleRequiredEarned} Earned + {eagleRequiredPlanned} Planned
                          </span>
                        </div>
                        <div className="text-center pr-3 border-r border-slate-800">
                          <span className="text-[10px] uppercase font-black text-sky-400 block">Electives</span>
                          <span className="text-xs font-mono font-bold text-white">
                            {electiveEarned} Earned + {electivePlanned} Planned
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] uppercase font-black text-emerald-400 block">21-Badge Total</span>
                          <span className="text-xs font-mono font-black text-emerald-300">
                            {totalEagleTracked} / 21 Tracked
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar toward 21 Eagle Badges */}
                    <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Target size={14} className="text-amber-400" />
                          <span>Road to 21 Merit Badges for Eagle:</span>
                        </span>
                        <span className="font-mono text-amber-300">
                          {earnedBadges.length} Earned ({Math.round((earnedBadges.length / 21) * 100)}%) &bull; {plannedBadges.length} Selected Planned
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (earnedBadges.length / 21) * 100)}%` }}
                          title={`${earnedBadges.length} Earned`}
                        />
                        <div
                          className="bg-sky-500/80 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100 - (earnedBadges.length / 21) * 100, (plannedBadges.length / 21) * 100)}%` }}
                          title={`${plannedBadges.length} Planned`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> {earnedBadges.length} Officially Completed</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span> {plannedBadges.length} Selected to Complete</span>
                        <span>{Math.max(0, 21 - earnedBadges.length - plannedBadges.length)} Remaining to Plan</span>
                      </div>
                    </div>

                    {/* Sub-Tab Navigation Bar & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                        {[
                          { id: 'planned', label: `🎯 Planned Badges (${plannedBadges.length})` },
                          { id: 'earned', label: `✓ Completed (${earnedBadges.length})` },
                          { id: 'in_progress', label: `⚡ In Progress (${inProgressBadges.length})` },
                          { id: 'eagle_required', label: `🦅 14 Eagle-Required` },
                          { id: 'all', label: `🔍 All Catalog (${MERIT_BADGES.length})` }
                        ].map(subTab => (
                          <button
                            key={subTab.id}
                            type="button"
                            onClick={() => setMeritSubTabMap(prev => ({ ...prev, [scout.uid]: subTab.id }))}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              activeMeritTab === subTab.id
                                ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-[1.02]'
                                : 'bg-slate-850 text-slate-400 hover:text-white border border-slate-755 hover:bg-slate-800'
                            }`}
                          >
                            <span>{subTab.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Search Bar for Badges */}
                      <div className="relative shrink-0 sm:w-60">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search badges..."
                          value={badgeSearchMap[scout.uid] || ''}
                          onChange={(e) => setBadgeSearchMap(prev => ({ ...prev, [scout.uid]: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-755 text-white placeholder-slate-500 text-xs pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* ── SUB-TAB 1: PLANNED BADGES ── */}
                    {activeMeritTab === 'planned' && (
                      <div className="space-y-3">
                        {plannedBadges.length === 0 ? (
                          <div className="bg-slate-850 border border-slate-800 p-8 rounded-2xl text-center space-y-2">
                            <Target size={36} className="mx-auto text-sky-400 opacity-60" />
                            <h5 className="text-sm font-bold text-white">No Planned Badges Selected Yet</h5>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                              Scouts can designate badges as planned in their Merit Badge Dashboard. You can also explore the <strong>🦅 14 Eagle-Required</strong> tab above to view the mandatory badge pathway.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {plannedBadges
                              .filter(b => !scoutSearchTerm || b.badge.name.toLowerCase().includes(scoutSearchTerm))
                              .map(b => {
                                const badgeKey = `${scout.uid}_${b.badge.id}`;
                                const isExpanded = !!expandedBadgeMap[badgeKey];

                                return (
                                  <div
                                    key={b.badge.id}
                                    className="bg-slate-850/90 border border-sky-500/40 p-4 rounded-2xl space-y-3 shadow-md hover:border-sky-400 transition flex flex-col justify-between"
                                  >
                                    <div className="space-y-2.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            b.badge.eagleRequired
                                              ? 'bg-amber-950 text-amber-300 border border-amber-600'
                                              : 'bg-sky-950 text-sky-300 border border-sky-600'
                                          }`}>
                                            {b.badge.eagleRequired ? '🦅 Eagle Required' : '⭐ Elective Badge'}
                                          </span>
                                          <h5 className="font-extrabold text-white text-sm mt-1">{b.badge.name}</h5>
                                        </div>
                                        <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-600 px-2.5 py-0.5 rounded-full font-bold shrink-0">
                                          🎯 Planned
                                        </span>
                                      </div>

                                      {/* Target Completion & Timing */}
                                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                          <span className="text-slate-400">Target Timeframe:</span>
                                          <strong className="text-amber-300 font-mono">
                                            {b.plannedTarget || (b.plannedAt ? `Added ${b.plannedAt.split('T')[0]}` : 'Assigned in Plan')}
                                          </strong>
                                        </div>
                                        {b.counselor && (
                                          <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-400">Counselor:</span>
                                            <strong className="text-slate-200">{b.counselor}</strong>
                                          </div>
                                        )}
                                      </div>

                                      {/* Requirement Steps Progress Bar */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[11px]">
                                          <span className="text-slate-400">Requirements Progress:</span>
                                          <span className="font-mono text-emerald-400 font-bold">
                                            {b.approvedCount} of {b.total} Certified ({b.percentage}%)
                                          </span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                          <div
                                            className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${b.percentage}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Expandable Requirements Details */}
                                    <div className="pt-2 border-t border-slate-800 space-y-2">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedBadgeMap(prev => ({ ...prev, [badgeKey]: !prev[badgeKey] }))}
                                        className="w-full text-left text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center justify-between cursor-pointer py-1"
                                      >
                                        <span>{isExpanded ? 'Hide Requirements' : `View Requirements Checklist (${b.approvedCount}/${b.total})`}</span>
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                      </button>

                                      {isExpanded && (
                                        <div className="pt-2 space-y-2 border-t border-slate-755 animate-fadeIn">
                                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                            {(b.badge.requirements || []).map(req => {
                                              const stepVal = b.steps[req.id];
                                              const isReqDone = stepVal === true || stepVal?.completed === true || stepVal === 'approved' || stepVal?.approved === true || stepVal === 'completed';
                                              const isReqPending = !isReqDone && (stepVal === 'pending' || stepVal?.pending === true);

                                              return (
                                                <div
                                                  key={req.id}
                                                  className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 ${
                                                    isReqDone
                                                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                                                      : isReqPending
                                                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                                                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                                                  }`}
                                                >
                                                  <div className="space-y-0.5 min-w-0">
                                                    <strong className="text-white text-[11px] block">Req {req.id}</strong>
                                                    <p className="text-[11px] leading-relaxed line-clamp-2">{req.text}</p>
                                                  </div>
                                                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                                                    isReqDone
                                                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                                                      : isReqPending
                                                      ? 'bg-amber-900/80 text-amber-300 border border-amber-600 animate-pulse'
                                                      : 'bg-slate-800 text-slate-500'
                                                  }`}>
                                                    {isReqDone ? <><Check size={10} /> Certified</> : isReqPending ? <><Clock size={10} /> In Review</> : 'Incomplete'}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>

                                          {/* Worksheets & Official Links */}
                                          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 flex-wrap text-[11px]">
                                            {b.badge.packetPdfUrl && (
                                              <a
                                                href={b.badge.packetPdfUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-slate-800 hover:bg-slate-750 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 font-bold"
                                              >
                                                <Download size={11} className="text-amber-400" />
                                                <span>Worksheet (PDF)</span>
                                              </a>
                                            )}
                                            {b.badge.pageUrl && (
                                              <a
                                                href={b.badge.pageUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-slate-800 hover:bg-slate-750 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 font-bold"
                                              >
                                                <ExternalLink size={11} className="text-emerald-400" />
                                                <span>Official Guide</span>
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── SUB-TAB 2: EARNED / COMPLETED BADGES ── */}
                    {activeMeritTab === 'earned' && (
                      <div className="space-y-3">
                        {earnedBadges.length === 0 ? (
                          <div className="bg-slate-850 border border-slate-800 p-8 rounded-2xl text-center space-y-2 text-xs text-slate-400">
                            🏅 No merit badges officially completed yet. Badges in progress and planned will appear here once certified.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {earnedBadges
                              .filter(b => !scoutSearchTerm || b.badge.name.toLowerCase().includes(scoutSearchTerm))
                              .map(b => {
                                const badgeKey = `${scout.uid}_${b.badge.id}`;
                                const isExpanded = !!expandedBadgeMap[badgeKey];

                                return (
                                  <div
                                    key={b.badge.id}
                                    className="bg-slate-850/90 border border-emerald-500/40 p-4 rounded-2xl space-y-3 shadow-md hover:border-emerald-400 transition flex flex-col justify-between"
                                  >
                                    <div className="space-y-2.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            b.badge.eagleRequired
                                              ? 'bg-amber-950 text-amber-300 border border-amber-600'
                                              : 'bg-sky-950 text-sky-300 border border-sky-600'
                                          }`}>
                                            {b.badge.eagleRequired ? '🦅 Eagle Required' : '⭐ Elective Badge'}
                                          </span>
                                          <h5 className="font-extrabold text-white text-sm mt-1">{b.badge.name}</h5>
                                        </div>
                                        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-0.5 rounded-full font-bold shrink-0">
                                          ✓ Earned
                                        </span>
                                      </div>

                                      {/* Earned Metadata */}
                                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                          <span className="text-slate-400">Certified Date:</span>
                                          <strong className="text-emerald-300 font-mono">
                                            {b.earnedDate ? b.earnedDate.split('T')[0] : 'Certified by Troop'}
                                          </strong>
                                        </div>
                                        {b.counselor && (
                                          <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-400">Counselor:</span>
                                            <strong className="text-slate-200">{b.counselor}</strong>
                                          </div>
                                        )}
                                      </div>

                                      {/* 100% Bar */}
                                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-400 h-full rounded-full w-full" />
                                      </div>
                                    </div>

                                    {/* Expandable Details */}
                                    <div className="pt-2 border-t border-slate-800 space-y-2">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedBadgeMap(prev => ({ ...prev, [badgeKey]: !prev[badgeKey] }))}
                                        className="w-full text-left text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center justify-between cursor-pointer py-1"
                                      >
                                        <span>{isExpanded ? 'Hide Requirements' : 'View Certified Requirements'}</span>
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                      </button>

                                      {isExpanded && (
                                        <div className="pt-2 space-y-2 border-t border-slate-755 animate-fadeIn">
                                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                            {(b.badge.requirements || []).map(req => (
                                              <div
                                                key={req.id}
                                                className="p-2.5 rounded-xl border border-emerald-800/40 bg-emerald-950/20 text-xs flex items-start justify-between gap-2.5"
                                              >
                                                <div className="space-y-0.5 min-w-0">
                                                  <strong className="text-emerald-300 text-[11px] block">Req {req.id}</strong>
                                                  <p className="text-[11px] leading-relaxed text-slate-300">{req.text}</p>
                                                </div>
                                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700 shrink-0 flex items-center gap-1">
                                                  <Check size={10} /> Certified
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── SUB-TAB 3: IN-PROGRESS BADGES ── */}
                    {activeMeritTab === 'in_progress' && (
                      <div className="space-y-3">
                        {inProgressBadges.length === 0 ? (
                          <div className="bg-slate-850 border border-slate-800 p-8 rounded-2xl text-center space-y-2 text-xs text-slate-400">
                            ⚡ No merit badges currently marked in progress. Badges with partially approved requirements will appear here.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {inProgressBadges
                              .filter(b => !scoutSearchTerm || b.badge.name.toLowerCase().includes(scoutSearchTerm))
                              .map(b => {
                                const badgeKey = `${scout.uid}_${b.badge.id}`;
                                const isExpanded = !!expandedBadgeMap[badgeKey];

                                return (
                                  <div
                                    key={b.badge.id}
                                    className="bg-slate-850/90 border border-amber-500/40 p-4 rounded-2xl space-y-3 shadow-md hover:border-amber-400 transition flex flex-col justify-between"
                                  >
                                    <div className="space-y-2.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            b.badge.eagleRequired
                                              ? 'bg-amber-950 text-amber-300 border border-amber-600'
                                              : 'bg-sky-950 text-sky-300 border border-sky-600'
                                          }`}>
                                            {b.badge.eagleRequired ? '🦅 Eagle Required' : '⭐ Elective Badge'}
                                          </span>
                                          <h5 className="font-extrabold text-white text-sm mt-1">{b.badge.name}</h5>
                                        </div>
                                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-600 px-2.5 py-0.5 rounded-full font-bold shrink-0">
                                          In Progress
                                        </span>
                                      </div>

                                      {/* Requirements Counters */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[11px]">
                                          <span className="text-slate-400">Steps Approved:</span>
                                          <span className="font-mono text-amber-300 font-bold">
                                            {b.approvedCount} of {b.total} ({b.percentage}%)
                                          </span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                          <div
                                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${b.percentage}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Expandable Details */}
                                    <div className="pt-2 border-t border-slate-800 space-y-2">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedBadgeMap(prev => ({ ...prev, [badgeKey]: !prev[badgeKey] }))}
                                        className="w-full text-left text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center justify-between cursor-pointer py-1"
                                      >
                                        <span>{isExpanded ? 'Hide Requirements' : `Inspect Requirements (${b.approvedCount}/${b.total})`}</span>
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                      </button>

                                      {isExpanded && (
                                        <div className="pt-2 space-y-2 border-t border-slate-755 animate-fadeIn">
                                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                            {(b.badge.requirements || []).map(req => {
                                              const stepVal = b.steps[req.id];
                                              const isReqDone = stepVal === true || stepVal?.completed === true || stepVal === 'approved' || stepVal?.approved === true || stepVal === 'completed';
                                              const isReqPending = !isReqDone && (stepVal === 'pending' || stepVal?.pending === true);

                                              return (
                                                <div
                                                  key={req.id}
                                                  className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 ${
                                                    isReqDone
                                                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                                                      : isReqPending
                                                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                                                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                                                  }`}
                                                >
                                                  <div className="space-y-0.5 min-w-0">
                                                    <strong className="text-white text-[11px] block">Req {req.id}</strong>
                                                    <p className="text-[11px] leading-relaxed line-clamp-2">{req.text}</p>
                                                  </div>
                                                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                                                    isReqDone
                                                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                                                      : isReqPending
                                                      ? 'bg-amber-900/80 text-amber-300 border border-amber-600 animate-pulse'
                                                      : 'bg-slate-800 text-slate-500'
                                                  }`}>
                                                    {isReqDone ? <><Check size={10} /> Certified</> : isReqPending ? <><Clock size={10} /> In Review</> : 'Incomplete'}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── SUB-TAB 4: 14 EAGLE-REQUIRED MATRIX ── */}
                    {activeMeritTab === 'eagle_required' && (
                      <div className="space-y-5">
                        
                        {/* 11 Solo Mandatory Badges */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                              11 Mandatory Solo Badges ({eagleRequiredEarned} Earned &bull; {eagleRequiredPlanned} Planned)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">No substitutions permitted</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {EAGLE_MANDATORY_SOLOS.map(solo => {
                              const bObj = MERIT_BADGES.find(mb => mb.id === solo.id || mb.id === solo.id.replace(/-/g, '_')) || { id: solo.id, name: solo.name, eagleRequired: true, requirements: [] };
                              const evalData = getBadgeStatusAndProgress(bObj, sMerit);
                              const badgeKey = `${scout.uid}_${bObj.id}`;
                              const isExpanded = !!expandedBadgeMap[badgeKey];

                              return (
                                <div
                                  key={solo.id}
                                  className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-2.5 ${
                                    evalData.isEarned
                                      ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
                                      : evalData.isPlanned
                                      ? 'bg-sky-950/20 border-sky-800/50 text-sky-200'
                                      : evalData.isInProgress
                                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                                      : 'bg-slate-900/60 border-slate-755 text-slate-400'
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-xl shrink-0">{solo.icon}</span>
                                        <div className="min-w-0">
                                          <strong className="text-white text-xs block truncate">{solo.name}</strong>
                                          <span className="text-[10px] text-slate-400 block font-mono">
                                            {evalData.isEarned 
                                              ? `✓ Earned ${evalData.earnedDate ? evalData.earnedDate.split('T')[0] : ''}` 
                                              : evalData.isPlanned 
                                              ? `🎯 Target: ${evalData.plannedTarget || 'Planned'}`
                                              : evalData.isInProgress
                                              ? `⚡ ${evalData.approvedCount} of ${evalData.total} Approved`
                                              : '○ Needed for Eagle'}
                                          </span>
                                        </div>
                                      </div>

                                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                        evalData.isEarned
                                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                                          : evalData.isPlanned
                                          ? 'bg-sky-900/80 text-sky-300 border border-sky-700'
                                          : evalData.isInProgress
                                          ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                                          : 'bg-slate-800 text-slate-500'
                                      }`}>
                                        {evalData.isEarned ? '✓ Earned' : evalData.isPlanned ? '🎯 Planned' : evalData.isInProgress ? '⚡ In Progress' : 'Needed'}
                                      </span>
                                    </div>

                                    {solo.timeAlert && (
                                      <div className="text-[10px] bg-black/30 px-2 py-1 rounded-lg text-amber-300/90 flex items-center gap-1.5">
                                        <Clock size={11} className="shrink-0 text-amber-400" />
                                        <span className="truncate">{solo.timeAlert}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Expand requirements */}
                                  {bObj.requirements && bObj.requirements.length > 0 && (
                                    <div className="pt-2 border-t border-slate-800/80">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedBadgeMap(prev => ({ ...prev, [badgeKey]: !prev[badgeKey] }))}
                                        className="text-[11px] text-slate-300 hover:text-white font-bold flex items-center justify-between w-full cursor-pointer"
                                      >
                                        <span>{isExpanded ? 'Hide Checklist' : `Checklist (${evalData.approvedCount}/${evalData.total})`}</span>
                                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                      </button>

                                      {isExpanded && (
                                        <div className="pt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1 border-t border-slate-755 mt-1.5">
                                          {bObj.requirements.map(req => {
                                            const stepVal = evalData.steps[req.id];
                                            const isReqDone = stepVal === true || stepVal?.completed === true || stepVal === 'approved' || stepVal?.approved === true || stepVal === 'completed';
                                            return (
                                              <div key={req.id} className="p-2 bg-slate-950/80 rounded-lg text-[10px] flex justify-between gap-2 border border-slate-800">
                                                <span className="text-slate-300 truncate">Req {req.id}: {req.text}</span>
                                                <span className={`font-mono font-bold shrink-0 ${isReqDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                  {isReqDone ? '✓ Certified' : '○ Pending'}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3 Alternate Choice Groups */}
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                              3 Choice Groups (1 Required From Each Group)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Excess badges count as Electives</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {EAGLE_CHOICE_GROUPS.map(group => {
                              return (
                                <div key={group.groupId} className="bg-slate-950/70 border border-slate-755 p-4 rounded-2xl space-y-3">
                                  <h6 className="text-xs font-black text-white">{group.groupName}</h6>
                                  <div className="space-y-2">
                                    {group.badges.map(bInfo => {
                                      const bObj = MERIT_BADGES.find(mb => mb.id === bInfo.id || mb.id === bInfo.id.replace(/-/g, '_')) || { id: bInfo.id, name: bInfo.name, eagleRequired: true, requirements: [] };
                                      const evalData = getBadgeStatusAndProgress(bObj, sMerit);

                                      return (
                                        <div
                                          key={bInfo.id}
                                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                                            evalData.isEarned
                                              ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                                              : evalData.isPlanned
                                              ? 'bg-sky-950/30 border-sky-700/60 text-sky-200'
                                              : evalData.isInProgress
                                              ? 'bg-amber-950/30 border-amber-700/60 text-amber-200'
                                              : 'bg-slate-900 border-slate-800 text-slate-400'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span>{bInfo.icon}</span>
                                            <span className="font-bold text-white text-[11px]">{bInfo.name}</span>
                                          </div>
                                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/40">
                                            {evalData.isEarned ? '✓ Earned' : evalData.isPlanned ? '🎯 Planned' : evalData.isInProgress ? '⚡ Active' : 'Needed'}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-TAB 5: ALL MERIT BADGES DIRECTORY ── */}
                    {activeMeritTab === 'all' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {evaluatedBadges
                          .filter(b => !scoutSearchTerm || b.badge.name.toLowerCase().includes(scoutSearchTerm))
                          .map(b => {
                            const badgeKey = `${scout.uid}_${b.badge.id}`;
                            const isExpanded = !!expandedBadgeMap[badgeKey];

                            return (
                              <div
                                key={b.badge.id}
                                className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-2.5 ${
                                  b.isEarned
                                    ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
                                    : b.isPlanned
                                    ? 'bg-sky-950/20 border-sky-800/50 text-sky-200'
                                    : b.isInProgress
                                    ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                                    : 'bg-slate-850/60 border-slate-755 text-slate-400'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                        b.badge.eagleRequired
                                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                                          : 'bg-slate-800 text-slate-400'
                                      }`}>
                                        {b.badge.eagleRequired ? '🦅 Eagle Required' : '⭐ Elective'}
                                      </span>
                                      <h5 className="font-extrabold text-white text-xs sm:text-sm mt-1">{b.badge.name}</h5>
                                    </div>
                                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                      b.isEarned
                                        ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                                        : b.isPlanned
                                        ? 'bg-sky-900 text-sky-200 border border-sky-600'
                                        : b.isInProgress
                                        ? 'bg-amber-900 text-amber-200 border border-amber-600'
                                        : 'bg-slate-800 text-slate-500'
                                    }`}>
                                      {b.isEarned ? '✓ Earned' : b.isPlanned ? '🎯 Planned' : b.isInProgress ? 'In Progress' : 'Not Started'}
                                    </span>
                                  </div>

                                  {b.plannedTarget && (
                                    <span className="text-[10px] text-sky-300 font-mono block">
                                      🎯 Target: {b.plannedTarget}
                                    </span>
                                  )}

                                  {b.total > 0 && (
                                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                                      {b.approvedCount} of {b.total} requirements completed ({b.percentage}%)
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setExpandedBadgeMap(prev => ({ ...prev, [badgeKey]: !prev[badgeKey] }))}
                                  className="text-[11px] font-bold text-slate-300 hover:text-white pt-2 border-t border-slate-800 flex items-center justify-between cursor-pointer"
                                >
                                  <span>{isExpanded ? 'Hide Details' : 'View Requirements'}</span>
                                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                </button>

                                {isExpanded && (
                                  <div className="pt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1 border-t border-slate-755 mt-1">
                                    {(b.badge.requirements || []).map(req => {
                                      const stepVal = b.steps[req.id];
                                      const isReqDone = stepVal === true || stepVal?.completed === true || stepVal === 'approved' || stepVal?.approved === true || stepVal === 'completed';
                                      return (
                                        <div key={req.id} className="p-2 bg-slate-950/80 rounded-lg text-[10px] flex justify-between gap-2 border border-slate-800">
                                          <span className="text-slate-300 truncate">Req {req.id}: {req.text}</span>
                                          <span className={`font-mono font-bold shrink-0 ${isReqDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {isReqDone ? '✓ Certified' : '○ Pending'}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                  </div>
                )}

                {/* 6. Islamic Foundations & Core Knowledge Section */}
                {(currentFilter === 'all' || currentFilter === 'islamic') && (
                  <div className="bg-slate-900 border border-slate-755 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="text-base font-black text-white flex items-center gap-2">
                          <BookOpen size={18} className="text-purple-400" />
                          <span>Islamic Foundations & Spiritual Growth</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Fiqh, Aqa'id, Akhlaq, and Karbala personality mastery certified for {scout.fullName || scout.username}.
                        </p>
                      </div>

                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-700 self-start sm:self-auto">
                        {completedIslamicTopics.length} of {ISLAMIC_BASICS_TOPICS.length} Topics Mastered
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ISLAMIC_BASICS_TOPICS.map(topic => {
                        const st = sIslamic[topic.id];
                        const isDone = st === true || st?.completed === true || (sIslamic.completedTopics && sIslamic.completedTopics[topic.id]);
                        const isPending = !isDone && (st?.pending === true);
                        const doneDate = st?.completedDate || st?.completedAt || null;

                        return (
                          <div
                            key={topic.id}
                            className={`p-4 rounded-2xl border space-y-2 transition ${
                              isDone
                                ? 'bg-purple-950/20 border-purple-600/40 text-purple-100'
                                : isPending
                                ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                                : 'bg-slate-850/60 border-slate-755 text-slate-400'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[9px] font-black uppercase text-purple-300 bg-purple-950/60 border border-purple-700/50 px-2 py-0.5 rounded-full">
                                {topic.category}
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isDone
                                  ? 'bg-purple-900/80 text-purple-200 border border-purple-600'
                                  : isPending
                                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                                  : 'bg-slate-800 text-slate-500'
                              }`}>
                                {isDone ? '✓ Mastered' : isPending ? '⏳ In Review' : 'Incomplete'}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-white text-xs sm:text-sm">{topic.title}</h5>

                            {doneDate && (
                              <span className="text-[10px] text-purple-300/80 font-mono block pt-1 border-t border-purple-900/40">
                                Certified on {doneDate.split('T')[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 11. TAB 8: HOUSEHOLD PROFILE ── */}
      {activeTab === 'family' && (
        <div className="bg-slate-850 border border-slate-750 p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-750 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-lg">Dual-Parent Household & Identity Profile</h3>
              <p className="text-xs text-slate-400">
                Identify Father, Mother, and Guardians, designate the Primary Account Holder for greetings, and manage emergency contacts.
              </p>
            </div>
            {!isEditingFamily ? (
              <button
                type="button"
                onClick={() => setIsEditingFamily(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingFamily(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            )}
          </div>

          {familyMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600 font-bold">{familyMsg}</p>}

          <form onSubmit={handleSaveFamilyProfile} className="space-y-6">
            {/* 1. Primary Account Holder Selector */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>⭐ Primary Account Holder & Portal Greeting</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Select which parent or guardian receives main dashboard greetings and primary correspondence.
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  Active: {primaryName} ({primaryRelation})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Radio Card 1: Parent 1 */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  primaryAccountHolder === 'parent1'
                    ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-755 hover:border-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="primaryAccountHolder"
                    value="parent1"
                    disabled={!isEditingFamily}
                    checked={primaryAccountHolder === 'parent1'}
                    onChange={() => setPrimaryAccountHolder('parent1')}
                    className="mt-1 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-white block">
                      {parent1Name || 'Parent 1'}
                    </strong>
                    <span className="text-xs text-emerald-400 block font-medium">
                      Relationship: {parent1Relation || 'Father'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {parent1Email || 'Primary email'}
                    </span>
                  </div>
                </label>

                {/* Radio Card 2: Parent 2 */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  primaryAccountHolder === 'parent2'
                    ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-755 hover:border-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="primaryAccountHolder"
                    value="parent2"
                    disabled={!isEditingFamily}
                    checked={primaryAccountHolder === 'parent2'}
                    onChange={() => setPrimaryAccountHolder('parent2')}
                    className="mt-1 text-teal-500 focus:ring-teal-500"
                  />
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-white block">
                      {parent2Name || 'Parent 2 (Mother / Guardian)'}
                    </strong>
                    <span className="text-xs text-teal-400 block font-medium">
                      Relationship: {parent2Relation || 'Mother'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {parent2Email || 'Secondary email'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Parent 1 Details */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-755 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} />
                  <span>Parent 1 Profile</span>
                </h4>
                {primaryAccountHolder === 'parent1' && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    ⭐ Designated Primary Holder
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Relationship *</label>
                  <select
                    disabled={!isEditingFamily}
                    value={parent1Relation}
                    onChange={(e) => setParent1Relation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 font-medium"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    value={parent1Name}
                    onChange={(e) => setParent1Name(e.target.value)}
                    placeholder="e.g. Ghadeer Fares"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingFamily}
                    value={parent1Phone}
                    onChange={(e) => setParent1Phone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled={!isEditingFamily}
                    value={parent1Email}
                    onChange={(e) => setParent1Email(e.target.value)}
                    placeholder="parent1@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* 3. Parent 2 Details */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-755 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-teal-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} />
                  <span>Parent 2 Profile</span>
                </h4>
                {primaryAccountHolder === 'parent2' && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    ⭐ Designated Primary Holder
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Relationship *</label>
                  <select
                    disabled={!isEditingFamily}
                    value={parent2Relation}
                    onChange={(e) => setParent2Relation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 font-medium"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="Mother / Second Parent Full Name"
                    value={parent2Name}
                    onChange={(e) => setParent2Name(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingFamily}
                    placeholder="(555) 000-0000"
                    value={parent2Phone}
                    onChange={(e) => setParent2Phone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled={!isEditingFamily}
                    placeholder="second.parent@example.com"
                    value={parent2Email}
                    onChange={(e) => setParent2Email(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* 4. Address & Emergency */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-755 space-y-4">
              <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Home size={14} />
                <span>Household Address & Emergency Contact</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Home Street Address</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="123 Scouting Way"
                    value={familyAddress}
                    onChange={(e) => setFamilyAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">City, State, Zip</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="Dearborn, MI 48126"
                    value={cityStateZip}
                    onChange={(e) => setCityStateZip(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="e.g. Grandparent / Relative"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    disabled={!isEditingFamily}
                    placeholder="(555) 123-4567"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Emergency Contact Relationship</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="e.g. Grandparent, Uncle, Family Friend"
                    value={emergencyContactRelation}
                    onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* 5. Linked Scouts Health & Safety Profiles */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-red-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-red-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse size={14} />
                    <span>Linked Scouts Health, Allergies & Dietary Profiles</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Parent-managed health records automatically synchronize with linked scout documents and are locked from scout editing.
                  </p>
                </div>
                <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                  🔒 Parent-Only Governance
                </span>
              </div>

              {linkedScouts.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  No scouts currently linked to this guardian account.
                </p>
              ) : (
                <div className="space-y-4">
                  {linkedScouts.map((scout) => {
                    const health = scoutHealthMap[scout.uid] || {
                      allergies: scout.allergies || '',
                      medicalNotes: scout.medicalNotes || '',
                      dietaryRestrictions: scout.dietaryRestrictions || ''
                    };

                    return (
                      <div 
                        key={scout.uid}
                        className="bg-slate-950/80 p-4 rounded-2xl border border-slate-755 space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">⚜️</span>
                            <strong className="text-xs font-bold text-white">
                              {scout.fullName || scout.username}
                            </strong>
                            <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                              {scout.rank || 'Scout'} Rank
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            ID: {scout.uid?.substring(0, 8)}...
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                              Allergies & Medical Alerts
                            </label>
                            <textarea
                              rows={2}
                              disabled={!isEditingFamily}
                              value={health.allergies || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setScoutHealthMap(prev => ({
                                  ...prev,
                                  [scout.uid]: {
                                    ...(prev[scout.uid] || {}),
                                    allergies: val
                                  }
                                }));
                              }}
                              placeholder="e.g. Peanuts, Bee stings, Inhaler needed..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 disabled:opacity-60 font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                              Dietary Restrictions
                            </label>
                            <textarea
                              rows={2}
                              disabled={!isEditingFamily}
                              value={health.dietaryRestrictions || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setScoutHealthMap(prev => ({
                                  ...prev,
                                  [scout.uid]: {
                                    ...(prev[scout.uid] || {}),
                                    dietaryRestrictions: val
                                  }
                                }));
                              }}
                              placeholder="e.g. Strictly Zabiha Halal, Gluten-free, Vegetarian..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 disabled:opacity-60 font-sans"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                            Confidential Medical Instructions & Physician Notes
                          </label>
                          <textarea
                            rows={2}
                            disabled={!isEditingFamily}
                            value={health.medicalNotes || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setScoutHealthMap(prev => ({
                                ...prev,
                                  [scout.uid]: {
                                  ...(prev[scout.uid] || {}),
                                  medicalNotes: val
                                }
                              }));
                            }}
                            placeholder="Medication administration instructions, emergency protocols, or confidential health notes for troop leadership..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 disabled:opacity-60 font-sans"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sync Notice Banner */}
            <div className="bg-sky-950/40 border border-sky-500/30 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="text-xs text-slate-300">
                <strong className="text-white block font-bold">Automatic Multi-Child Profile Propagation</strong>
                Saving updates will instantly sync parent contact info, household address, emergency contacts, and medical profiles across all <strong>{linkedScouts.length}</strong> linked child scout records.
              </div>
            </div>

            {isEditingFamily && (
              <button
                type="submit"
                disabled={familySaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <Save size={15} />
                <span>{familySaving ? 'Saving & Propagating...' : 'Save Household Updates & Sync to Scouts'}</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* ── MODAL: CANCEL CONFERENCE (PARENT) ── */}
      {cancellingConference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" />
                <span>Cancel Leader Conference</span>
              </h3>
              <button
                type="button"
                onClick={() => setCancellingConference(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {cancelSuccessMsg && (
              <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600 font-bold">
                {cancelSuccessMsg}
              </p>
            )}

            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1 text-xs text-slate-300">
              <p><strong>Scout:</strong> {cancellingConference.scoutName}</p>
              <p><strong>Topic:</strong> {cancellingConference.meetingTopic || 'Conference'}</p>
              {cancellingConference.confirmedDate && (
                <p><strong>Scheduled:</strong> {cancellingConference.confirmedDate} at {cancellingConference.confirmedTime || '6:30 PM'}</p>
              )}
              {cancellingConference.confirmedBy && (
                <p><strong>Leader:</strong> {cancellingConference.confirmedBy}</p>
              )}
            </div>

            <form onSubmit={handleCancelConferenceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Schedule conflict, family travel, or will reschedule next week..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isCancellingConference}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <XCircle size={14} />
                  <span>{isCancellingConference ? 'Cancelling...' : 'Confirm Cancellation'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCancellingConference(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Keep Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: SIGN & SUBMIT FORM ── */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Digital Submission & Acknowledgment</span>
                <h3 className="font-extrabold text-white text-base mt-0.5">{submittingTask.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingTask(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {taskSuccessMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{taskSuccessMsg}</p>}

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Parent Digital Signature *</label>
                <input
                  type="text"
                  required
                  placeholder="Type full legal parent name (e.g. Ali Reza)"
                  value={taskSignature}
                  onChange={(e) => setTaskSignature(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-serif text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Uploaded Form URL / Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or cloud document link"
                  value={taskFileUploadUrl}
                  onChange={(e) => setTaskFileUploadUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Additional Notes / Medical Disclosures</label>
                <textarea
                  rows={2}
                  placeholder="Any special medical conditions, physician signatures, or notes for the leader..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={taskSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={15} />
                  <span>{taskSubmitting ? 'Submitting...' : 'Sign & Submit Document'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: SUBMIT ABSENCE NOTICE ── */}
      {showAbsenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-400" />
                <span>Submit Scout Absence Notice</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAbsenceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {absenceSuccessMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{absenceSuccessMsg}</p>}

            <form onSubmit={handleSubmitAbsenceNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Child *</label>
                <select
                  value={absenceScoutId}
                  onChange={(e) => setAbsenceScoutId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {linkedScouts.map(s => (
                    <option key={s.uid} value={s.uid}>{s.fullName || s.username} ({s.rank || 'Scout'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Date of Meeting / Campout *</label>
                <input
                  type="date"
                  required
                  value={absenceDate}
                  onChange={(e) => setAbsenceDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reason for Absence *</label>
                <select
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Illness">🤒 Illness / Medical</option>
                  <option value="Family Travel">✈️ Family Travel</option>
                  <option value="School Conflict">📚 School / Exam Conflict</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Notes for Unit Leader</label>
                <textarea
                  rows={2}
                  placeholder="Additional context for the scoutmaster..."
                  value={absenceNotes}
                  onChange={(e) => setAbsenceNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={absenceSubmitting}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{absenceSubmitting ? 'Submitting...' : 'File Absence Notice'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAbsenceModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: REQUEST LEADER CONFERENCE / MEETING ── */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-sky-500/50 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Users size={18} className="text-sky-400" />
                <span>Request Leader Conference</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {meetingSuccessMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{meetingSuccessMsg}</p>}

            <form onSubmit={handleSubmitMeetingRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Child *</label>
                <select
                  value={meetingScoutId}
                  onChange={(e) => setMeetingScoutId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                >
                  {linkedScouts.map(s => (
                    <option key={s.uid} value={s.uid}>{s.fullName || s.username} ({s.rank || 'Scout'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Leader *</label>
                <select
                  value={meetingTargetLeaderUid}
                  onChange={(e) => setMeetingTargetLeaderUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                >
                  <option value="">⭐ Any Available Leader / Scoutmaster</option>
                  {availableLeaders.map(ldr => (
                    <option key={ldr.uid} value={ldr.uid}>
                      {ldr.fullName || ldr.username} ({ldr.leaderPosition || ldr.role || 'Troop Leader'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Meeting Topic / Agenda *</label>
                <select
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                >
                  <option value="Advancement & Rank Review">⚜️ Advancement & Rank Review</option>
                  <option value="Merit Badge Guidance">🎖️ Merit Badge Guidance</option>
                  <option value="Special Accommodation & Health">🩹 Special Accommodation & Health</option>
                  <option value="Behavioral & Patrol Leadership">⭐ Behavioral & Leadership</option>
                  <option value="General Inquiry & Discussion">📋 General Discussion</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Preferred Date (Optional)</label>
                  <input
                    type="date"
                    value={meetingProposedDate}
                    onChange={(e) => setMeetingProposedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Preferred Time</label>
                  <select
                    value={meetingProposedTime}
                    onChange={(e) => setMeetingProposedTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                  >
                    <option value="6:00 PM">6:00 PM (Pre-Meeting)</option>
                    <option value="6:30 PM">6:30 PM (Opening Roll Call)</option>
                    <option value="7:00 PM">7:00 PM (During Meeting)</option>
                    <option value="7:30 PM">7:30 PM (Patrol Activity)</option>
                    <option value="8:00 PM">8:00 PM (Post-Meeting)</option>
                    <option value="Flexible">Flexible / Anytime Friday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Notes / Specific Questions for Leaders</label>
                <textarea
                  rows={2}
                  placeholder="What would you like to discuss with the scoutmaster or patrol leader?..."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={meetingSubmitting}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{meetingSubmitting ? 'Submitting...' : 'Send Conference Request'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DIGITAL SIGNATURE PAD (OFFICIAL REPORT SIGNING) ── */}
      {signingPublishedReport && (
        <SignaturePadModal
          isOpen={!!signingPublishedReport}
          onClose={() => setSigningPublishedReport(null)}
          title={`Parent Digital Signature: ${signingPublishedReport.scoutName}`}
          subtitle="Official Progress Report Certification & Verification Stamp"
          defaultSignerName={primaryName}
          defaultSignerRole={primaryRelation || 'Parent'}
          saving={isSubmittingParentSignature}
          onSave={handleSaveParentSignature}
        />
      )}

      {/* ── MODAL: RESCHEDULE PROPOSAL MODAL (PARENT RSVP) ── */}
      {reschedulingConference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-6 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Propose Alternate Conference Time</h3>
                  <p className="text-xs text-slate-300">Suggest a new date/time to Leader {reschedulingConference.confirmedBy || reschedulingConference.leaderName || 'Leadership'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingConference(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleParentRsvpSubmit(
                  reschedulingConference,
                  'reschedule_requested',
                  proposedAltDate,
                  proposedAltTime,
                  rescheduleNote
                );
              }}
              className="p-6 space-y-4"
            >
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p><strong>Scout:</strong> {reschedulingConference.scoutName}</p>
                <p><strong>Original Scheduled Time:</strong> {reschedulingConference.confirmedDate} @ {reschedulingConference.confirmedTime}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Proposed Date</label>
                  <input
                    type="date"
                    required
                    value={proposedAltDate}
                    onChange={(e) => setProposedAltDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Proposed Time</label>
                  <select
                    value={proposedAltTime}
                    onChange={(e) => setProposedAltTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="Flexible">Flexible Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reason / Note for Leadership</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Assalāmu ʿAlaykum, we have a conflicting appointment at 6:30 PM. Would 7:30 PM work instead?..."
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Clock size={14} />
                  <span>{isSubmittingRsvp ? 'Submitting...' : 'Send Reschedule Proposal'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReschedulingConference(null)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW PUBLISHED REPORT WITH VERIFICATION STAMP ── */}
      {viewingPublishedReport && (
        <PublishedReportViewerModal
          isOpen={!!viewingPublishedReport}
          onClose={() => setViewingPublishedReport(null)}
          report={viewingPublishedReport}
          currentUser={currentUser}
          onSignClick={(rep) => {
            setViewingPublishedReport(null);
            setSigningPublishedReport(rep);
          }}
        />
      )}
    </div>
  );
}
