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
import RankIcon from './RankIcon';
import ScoutProgressReport from './ScoutProgressReport';
import SignaturePadModal from './SignaturePadModal';
import DigitalVerificationStamp from './DigitalVerificationStamp';
import PublishedReportViewerModal from './PublishedReportViewerModal';
import ParentAlertsFeed from './ParentAlertsFeed';
import {
  Award,
  Star,
  Compass,
  Calendar,
  Clock,
  BookOpen,
  Heart,
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
  PenTool
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

  // Dual-Parent Family Profile State
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
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [familySaving, setFamilySaving] = useState(false);
  const [familyMsg, setFamilyMsg] = useState('');

  // Published Reports & Parent Signature State
  const [publishedReports, setPublishedReports] = useState([]);
  const [viewingPublishedReport, setViewingPublishedReport] = useState(null);
  const [signingPublishedReport, setSigningPublishedReport] = useState(null);
  const [isSubmittingParentSignature, setIsSubmittingParentSignature] = useState(false);
  const [parentSignSuccessToast, setParentSignSuccessToast] = useState('');
  const [reportSubTab, setReportSubTab] = useState('published'); // 'published' | 'live'
  const [completedHomeworkOpen, setCompletedHomeworkOpen] = useState(false);

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
        setParent1Name(data.parent1Name || data.fullName || '');
        setParent1Phone(data.parent1Phone || data.phone || '');
        setParent1Email(data.parent1Email || data.email || '');
        setParent1Relation(data.parent1Relation || 'Father');
        setParent2Name(data.parent2Name || '');
        setParent2Phone(data.parent2Phone || '');
        setParent2Email(data.parent2Email || '');
        setParent2Relation(data.parent2Relation || 'Mother');
        setFamilyAddress(data.familyAddress || data.address || '');
        setEmergencyContactName(data.emergencyContactName || '');
        setEmergencyContactPhone(data.emergencyContactPhone || '');
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

    const unsubNotifs = onSnapshot(collection(db, 'parent_notifications'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => !n.recipientUid || n.recipientUid === currentUser?.uid || n.parentEmail === currentUser?.email);
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setNotifications(list);
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
      unsubNotifs();
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

  // Toggle RSVP status for an event
  const handleRsvp = async (eventId, scoutId, status) => {
    const targetId = scoutId === 'all' ? (linkedScouts[0]?.uid || currentUser.uid) : scoutId;
    const rsvpId = `rsvp_${eventId}_${targetId}`;
    try {
      await setDoc(doc(db, 'event_rsvps', rsvpId), {
        eventId,
        scoutId: targetId,
        parentUid: currentUser.uid,
        status, // 'going' | 'cant_go'
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("RSVP update failed:", err);
    }
  };

  // Save Dual-Parent Profile
  const handleSaveFamilyProfile = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid) return;
    setFamilySaving(true);
    setFamilyMsg('');

    const payload = {
      parent1Name: parent1Name.trim(),
      parent1Phone: parent1Phone.trim(),
      parent1Email: parent1Email.trim().toLowerCase(),
      parent1Relation,
      parent2Name: parent2Name.trim(),
      parent2Phone: parent2Phone.trim(),
      parent2Email: parent2Email.trim().toLowerCase(),
      parent2Relation,
      familyAddress: familyAddress.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'users', currentUser.uid), payload, { merge: true });
      setFamilyMsg('✓ Family household profile updated successfully!');
      setIsEditingFamily(false);
      setTimeout(() => setFamilyMsg(''), 3000);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setFamilySaving(false);
    }
  };

  // Active Scoped Scout (or null for all)
  const isAllView = selectedScoutId === 'all';
  const activeScout = !isAllView ? linkedScouts.find(s => s.uid === selectedScoutId) || linkedScouts[0] : null;
  const scopedScouts = isAllView ? linkedScouts : activeScout ? [activeScout] : [];

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

  // Build Homework List for Scoped Scouts
  const buildScoutHomework = (scout) => {
    if (!scout) return [];
    const scoutSubs = scoutSubmissionsMap[scout.uid] || {};
    return assignmentsList.map(assign => {
      const sub = scoutSubs[assign.id];
      const isApproved = sub?.status === 'approved' || sub?.completed === true;
      const isPendingReview = sub?.status === 'submitted' || sub?.status === 'pending_review' || (sub?.submissionText && !isApproved);
      const isPending = !isApproved && !isPendingReview;

      return {
        ...assign,
        scoutId: scout.uid,
        scoutName: scout.fullName || scout.username,
        submission: sub || null,
        status: isApproved ? 'completed' : isPendingReview ? 'in_review' : 'pending',
        leaderFeedback: sub?.leaderFeedback || sub?.leaderNote || assign.instructions || ''
      };
    });
  };

  const allScopedHomework = scopedScouts.flatMap(s => buildScoutHomework(s));
  const activeHomework = allScopedHomework.filter(h => h.status !== 'completed');
  const completedHomework = allScopedHomework.filter(h => h.status === 'completed');

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
              <h2 className="text-xl font-black text-white">
                Welcome back, {parent1Name || parentDoc.fullName || 'Parent'}!
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Family Portal
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Here’s what your family has coming up this week across scouting & learning.
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
            <span>Notify Leader of Absence</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
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

          {/* SECTION 2: CURRENT RANK PROGRESS WIDGET */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚜️</span>
                <div>
                  <h3 className="font-extrabold text-white text-base">Current Rank & Advancement Progress</h3>
                  <p className="text-xs text-slate-400">Real-time status certified by troop leaders.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('advancement')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Requirements</span>
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
                const groupObj = allGroups.find(g => g.id === scout.groupId) || {};

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
                          Patrol: <strong className="text-slate-200">{groupObj.name || 'Al-Huda'}</strong> &bull; Current Rank: <strong className="text-emerald-400">{latestRank.name}</strong>
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
                            : 'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}>
                          {hw.status === 'in_review' ? '📤 Under Review' : '⏳ Needs Submission'}
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
                            : 'bg-amber-950 text-amber-300 border-amber-500/50'
                        }`}>
                          {hw.status === 'in_review' ? '📤 Submitted — Awaiting Review' : '⏳ Pending Scout Submission'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <h4 className="font-black text-white text-base sm:text-lg">{hw.title}</h4>
                      {hw.description && (
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{hw.description}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-755 px-1">
                      <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
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

          {/* Events Stream */}
          {(() => {
            const todayStr = new Date().toISOString().split('T')[0];
            const upcomingList = eventsList.filter(e => (e.date || '') >= todayStr);
            const pastList = eventsList.filter(e => (e.date || '') < todayStr);
            const displayList = eventSubTab === 'past' ? pastList : upcomingList;

            if (displayList.length === 0) {
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

      {/* ── 10. TAB 7: ADVANCEMENT & BADGES (Read-Only) ── */}
      {activeTab === 'advancement' && (
        <div className="space-y-6">
          {scopedScouts.map(scout => {
            const sRanks = ranksProgressMap[scout.uid] || {};
            const sMerit = meritProgressMap[scout.uid] || {};
            const latestRank = getLatestAchievedRank(sRanks, scout.rank);
            const nextRank = getNextIncompleteRank(sRanks);
            const targetStats = getRankCompletionPercentage(nextRank.id, sRanks);
            const activeReqs = (sRanks[nextRank.id] || {}).completedRequirements || (sRanks[nextRank.id] || {}).steps || {};
            const earnedBadges = MERIT_BADGES.filter(b => sMerit[b.id]?.completed === true);

            return (
              <div key={scout.uid} className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-750 pb-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                      <Award size={18} className="text-emerald-400" />
                      <span>{scout.fullName || scout.username} — Advancement Details</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Current Rank: <strong className="text-emerald-400">{latestRank.name}</strong> &bull; Working on: <strong className="text-amber-300">{nextRank.name}</strong> ({targetStats.percentage}%)
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-750">
                    {targetStats.completed} of {targetStats.total} Certified
                  </span>
                </div>

                {/* Requirements Breakdown */}
                <div className="space-y-2.5">
                  {(nextRank.categories || []).map((cat, cIdx) => (
                    <div key={cIdx} className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{cat.name}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.requirements.map(req => {
                          const isDone = activeReqs[req.id]?.completed === true;
                          return (
                            <div
                              key={req.id}
                              className={`p-3 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
                                isDone ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-slate-900/60 border-slate-755 text-slate-400'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <strong className="text-white block">Req {req.id}</strong>
                                <p className="text-[11px] leading-relaxed line-clamp-2">{req.text}</p>
                              </div>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                isDone ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-500'
                              }`}>
                                {isDone ? '✓ Certified' : 'Incomplete'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
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
              <h3 className="font-extrabold text-white text-lg">Dual-Parent Household Profile</h3>
              <p className="text-xs text-slate-400">
                Manage contact details for both parents and household emergency contacts.
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

          {familyMsg && <p className="text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-600">{familyMsg}</p>}

          <form onSubmit={handleSaveFamilyProfile} className="space-y-6">
            {/* Parent 1 (Primary) */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-755 space-y-4">
              <h4 className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider">Parent 1 (Primary Contact)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    value={parent1Name}
                    onChange={(e) => setParent1Name(e.target.value)}
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled={!isEditingFamily}
                    value={parent1Email}
                    onChange={(e) => setParent1Email(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Parent 2 (Secondary) */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-755 space-y-4">
              <h4 className="font-extrabold text-sky-400 text-xs uppercase tracking-wider">Parent 2 (Secondary Contact)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
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

            {/* Address & Emergency */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-755 space-y-4">
              <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider">Household Address & Emergency Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Home Street Address</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="123 Scouting Way, City, State ZIP"
                    value={familyAddress}
                    onChange={(e) => setFamilyAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Emergency Contact (Name & Phone)</label>
                  <input
                    type="text"
                    disabled={!isEditingFamily}
                    placeholder="Grandparent / Relative (555) 123-4567"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {isEditingFamily && (
              <button
                type="submit"
                disabled={familySaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <Save size={15} />
                <span>{familySaving ? 'Saving Profile...' : 'Save Household Updates'}</span>
              </button>
            )}
          </form>
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

      {/* ── MODAL: DIGITAL SIGNATURE PAD (OFFICIAL REPORT SIGNING) ── */}
      {signingPublishedReport && (
        <SignaturePadModal
          isOpen={!!signingPublishedReport}
          onClose={() => setSigningPublishedReport(null)}
          title={`Parent Digital Signature: ${signingPublishedReport.scoutName}`}
          subtitle="Official Progress Report Certification & Verification Stamp"
          defaultSignerName={parent1Name || currentUser.fullName || ''}
          defaultSignerRole={parent1Relation || 'Parent'}
          saving={isSubmittingParentSignature}
          onSave={handleSaveParentSignature}
        />
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
