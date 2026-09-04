import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  where
} from 'firebase/firestore';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Video, 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  AlertTriangle, 
  Check, 
  X, 
  Filter,
  User,
  Users,
  Sparkles,
  Send,
  RotateCcw,
  MessageSquare,
  Search,
  Eye,
  CheckCheck,
  Award,
  Dumbbell
} from 'lucide-react';

// Helper to determine strict status of an assignment for a given scout record
export function getAssignmentStatus(assignment, record) {
  const isCompleted = !!(record?.isCompleted || record?.status === 'completed' || record?.verifiedByLeader || (record?.completed && !record?.pending));
  
  if (isCompleted) {
    return {
      status: 'completed',
      isCompleted: true,
      label: 'Completed & Approved',
      badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-600',
      iconClass: 'text-emerald-400'
    };
  }

  const isSubmitted = record?.status === 'submitted' || (!!record?.submittedAt && !isCompleted);
  if (isSubmitted) {
    return {
      status: 'submitted',
      isCompleted: false,
      label: 'Submitted (Awaiting Review)',
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-600',
      iconClass: 'text-blue-400'
    };
  }

  // Strict Default: Incomplete. Check if Overdue.
  const dueDateStr = assignment?.dueDate;
  let isOverdue = false;
  let diffDays = null;

  if (dueDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      isOverdue = true;
    }
  }

  if (isOverdue) {
    return {
      status: 'overdue',
      isCompleted: false,
      label: diffDays ? `Overdue / Incomplete (${Math.abs(diffDays)}d late)` : 'Overdue / Incomplete',
      badgeClass: 'bg-red-950 text-red-300 border-red-500 font-bold',
      iconClass: 'text-red-400'
    };
  }

  return {
    status: 'incomplete',
    isCompleted: false,
    label: diffDays === 0 ? 'Due Today (Incomplete)' : diffDays === 1 ? 'Due Tomorrow' : diffDays ? `Due in ${diffDays}d` : 'Incomplete',
    badgeClass: 'bg-slate-900 text-slate-300 border-slate-700',
    iconClass: 'text-slate-400'
  };
}

export default function AssignmentsManager({ currentUser, scoutId: propScoutId, isEmbeddedInProfile = false }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || isOwner;
  const isScout = !isLeader;

  const targetScoutId = propScoutId || currentUser?.uid;

  const [assignments, setAssignments] = useState([]);
  const [allHomeworkRecords, setAllHomeworkRecords] = useState({}); // { [assignmentId_scoutId]: record }
  const [scoutProgress, setScoutProgress] = useState({}); // { [assignmentId]: record } for single target scout
  const [loading, setLoading] = useState(true);
  
  // Navigation & Filtering
  const [leaderViewMode, setLeaderViewMode] = useState('matrix'); // 'matrix' | 'assignments'
  const [scoutTab, setScoutTab] = useState('active'); // 'active' | 'completed'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'incomplete' | 'overdue' | 'submitted' | 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'Scouting Skills' | 'Islamic Studies' | 'Fitness' | 'General'
  const [selectedPatrolFilter, setSelectedPatrolFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Groups and Scouts for Leader
  const [groups, setGroups] = useState([]);
  const [scoutsList, setScoutsList] = useState([]);

  // Leader Creation / Edit State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Scouting Skills'); // 'Scouting Skills' | 'Islamic Studies' | 'Fitness' | 'General'
  const [type, setType] = useState('video'); // 'video' | 'document' | 'reading' | 'practical'
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTarget, setAssignedTarget] = useState('all'); // 'all' | 'patrol' | 'scout'
  const [targetGroupId, setTargetGroupId] = useState('');
  const [targetScoutUid, setTargetScoutUid] = useState('');
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');

  // Scout Submission Drawer / Modal State
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionSaving, setSubmissionSaving] = useState(false);
  const [submissionMsg, setSubmissionMsg] = useState('');
  const [submissionErr, setSubmissionErr] = useState('');

  // Leader Verification & Feedback Modal State
  const [feedbackModalRecord, setFeedbackModalRecord] = useState(null); // { assignment, scout, record }
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // 1. Subscribe to /assignments collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'assignments'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
      setAssignments(list);
      setLoading(false);
    }, (err) => {
      console.error("Failed to load assignments:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. Subscribe to /scout_homework collection (Global Homework Records)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setAllHomeworkRecords(map);
    }, (err) => console.error("Failed to load scout_homework:", err));

    return () => unsub();
  }, []);

  // 3. Subscribe to Target Scout's Submissions (dual-check from /user_progress/{scoutId}/assignments and /scout_homework)
  useEffect(() => {
    if (!targetScoutId) return;
    const unsub = onSnapshot(collection(db, 'user_progress', targetScoutId, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setScoutProgress(map);
    }, (err) => console.error("Failed to load scout assignment progress:", err));

    return () => unsub();
  }, [targetScoutId]);

  // 4. Load Groups and Scouts for Leader
  useEffect(() => {
    if (isLeader) {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
        setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
      });
      const unsubScouts = onSnapshot(query(collection(db, 'users'), where('role', '==', 'scout')), (snap) => {
        let list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        if (!isOwner && currentUser?.groupId) {
          list = list.filter(s => s.groupId === currentUser.groupId || s.leaderId === currentUser.uid);
        }
        setScoutsList(list);
      });
      return () => {
        unsubGroups();
        unsubScouts();
      };
    }
  }, [isLeader, isOwner, currentUser]);

  // Helper to fetch the exact record for an assignment and scout
  const getRecord = (assignmentId, scoutUid) => {
    const key = `${assignmentId}_${scoutUid}`;
    return allHomeworkRecords[key] || scoutProgress[assignmentId] || null;
  };

  // ── LEADER ACTIONS ──
  // One-Click "Mark Completed" / Approve
  const handleMarkCompleted = async (assignment, scout, customFeedback = null) => {
    const key = `${assignment.id}_${scout.uid}`;
    const dateVal = new Date().toISOString();
    const existing = getRecord(assignment.id, scout.uid) || {};

    const updatedData = {
      assignmentId: assignment.id,
      scoutId: scout.uid,
      assignmentTitle: assignment.title,
      scoutName: scout.fullName || scout.username || 'Scout',
      status: 'completed',
      isCompleted: true,
      verifiedByLeader: true,
      completedAt: dateVal,
      leaderId: currentUser?.uid || 'leader',
      leaderName: currentUser?.fullName || currentUser?.username || 'Troop Leader',
      leaderFeedback: customFeedback !== null ? customFeedback : (existing.leaderFeedback || 'Verified and approved by leader.'),
      scoutNotes: existing.scoutNotes || '',
      submittedAt: existing.submittedAt || dateVal,
      updatedAt: serverTimestamp()
    };

    try {
      // 1. Write to /scout_homework/{assignmentId_scoutId}
      await setDoc(doc(db, 'scout_homework', key), updatedData, { merge: true });

      // 2. Dual-write to /user_progress/{scoutId}/assignments/{assignmentId} for full backwards compatibility
      await setDoc(doc(db, 'user_progress', scout.uid, 'assignments', assignment.id), {
        completed: true,
        isCompleted: true,
        status: 'completed',
        completedDate: dateVal.split('T')[0],
        completedAt: dateVal,
        graded: true,
        grade: '100%',
        verifiedByLeader: true,
        leaderName: currentUser?.fullName || currentUser?.username || 'Leader',
        leaderFeedback: updatedData.leaderFeedback,
        notes: existing.scoutNotes || '',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to mark completed:", err);
      alert("Error marking completed: " + err.message);
    }
  };

  // Reopen / Revert to Incomplete
  const handleReopenIncomplete = async (assignment, scout, feedback = '') => {
    const key = `${assignment.id}_${scout.uid}`;
    const existing = getRecord(assignment.id, scout.uid) || {};

    const updatedData = {
      assignmentId: assignment.id,
      scoutId: scout.uid,
      assignmentTitle: assignment.title,
      status: 'incomplete',
      isCompleted: false,
      verifiedByLeader: false,
      completedAt: null,
      leaderFeedback: feedback || 'Returned for revision. Please review requirements and resubmit.',
      scoutNotes: existing.scoutNotes || '',
      submittedAt: null,
      updatedAt: serverTimestamp()
    };

    try {
      // 1. Update /scout_homework
      await setDoc(doc(db, 'scout_homework', key), updatedData, { merge: true });

      // 2. Update /user_progress/{scoutId}/assignments
      await setDoc(doc(db, 'user_progress', scout.uid, 'assignments', assignment.id), {
        completed: false,
        isCompleted: false,
        status: 'incomplete',
        completedDate: null,
        completedAt: null,
        graded: false,
        verifiedByLeader: false,
        leaderFeedback: updatedData.leaderFeedback,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to reopen task:", err);
      alert("Error reopening task: " + err.message);
    }
  };

  // Save Feedback from Modal
  const handleSaveFeedbackModal = async () => {
    if (!feedbackModalRecord) return;
    setFeedbackSaving(true);
    setFeedbackMsg('');
    const { assignment, scout } = feedbackModalRecord;
    try {
      await handleMarkCompleted(assignment, scout, feedbackText.trim());
      setFeedbackMsg('✓ Sign-off and feedback saved successfully!');
      setTimeout(() => {
        setFeedbackModalRecord(null);
        setFeedbackMsg('');
      }, 1200);
    } catch (err) {
      alert("Failed to save feedback: " + err.message);
    } finally {
      setFeedbackSaving(false);
    }
  };

  // Open Create Form
  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Scouting Skills');
    setType('video');
    setLink('');
    setDescription('');
    setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 1 week ahead default
    setAssignedTarget('all');
    setTargetGroupId('');
    setTargetScoutUid('');
    setFormErr('');
    setFormMsg('');
    setShowForm(true);
  };

  // Open Edit Form
  const handleOpenEdit = (assign) => {
    setEditingId(assign.id);
    setTitle(assign.title || '');
    setCategory(assign.category || 'Scouting Skills');
    setType(assign.type || 'video');
    setLink(assign.link || '');
    setDescription(assign.description || '');
    setDueDate(assign.dueDate || '');
    setAssignedTarget(assign.assignedTarget || 'all');
    setTargetGroupId(assign.targetGroupId || '');
    setTargetScoutUid(assign.targetScoutUid || '');
    setFormErr('');
    setFormMsg('');
    setShowForm(true);
  };

  // Save Assignment Definition
  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    setFormErr('');
    setFormMsg('');
    if (!title.trim()) {
      setFormErr("Assignment title is required.");
      return;
    }

    setSaving(true);
    const docId = editingId || `assign_${Date.now()}`;
    const data = {
      assignmentId: docId,
      title: title.trim(),
      category: category || 'Scouting Skills',
      type: type || 'video',
      link: link.trim(),
      description: description.trim(),
      dueDate: dueDate || '',
      leaderId: currentUser?.uid || '',
      leaderName: currentUser?.fullName || currentUser?.username || 'Troop Leader',
      groupId: assignedTarget === 'patrol' ? targetGroupId : 'all',
      assignedTarget,
      targetGroupId: assignedTarget === 'patrol' ? targetGroupId : null,
      targetScoutUid: assignedTarget === 'scout' ? targetScoutUid : null,
      createdAt: editingId ? (assignments.find(a => a.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'assignments', docId), data, { merge: true });
      setFormMsg(editingId ? "Assignment updated successfully!" : "New homework assigned to scouts!");
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
      }, 1200);
    } catch (err) {
      console.error("Failed to save assignment:", err);
      setFormErr("Error saving assignment: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteDoc(doc(db, 'assignments', id));
    } catch (err) {
      alert("Failed to delete assignment: " + err.message);
    }
  };

  // ── SCOUT ACTIONS ──
  // Open Submission Drawer
  const handleOpenScoutSubmission = (assign) => {
    const existing = getRecord(assign.id, currentUser?.uid) || {};
    setSubmittingAssignment(assign);
    setSubmissionNotes(existing.scoutNotes || '');
    setSubmissionMsg('');
    setSubmissionErr('');
  };

  // Scout Submits for Review
  const handleSubmitForReview = async (e) => {
    e.preventDefault();
    if (!submittingAssignment) return;
    setSubmissionSaving(true);
    setSubmissionMsg('');
    setSubmissionErr('');

    const scoutUid = currentUser?.uid;
    const assignId = submittingAssignment.id;
    const key = `${assignId}_${scoutUid}`;
    const dateVal = new Date().toISOString();

    const data = {
      assignmentId: assignId,
      scoutId: scoutUid,
      assignmentTitle: submittingAssignment.title,
      scoutName: currentUser?.fullName || currentUser?.username || 'Scout',
      status: 'submitted',
      isCompleted: false,
      submittedAt: dateVal,
      scoutNotes: submissionNotes.trim(),
      verifiedByLeader: false,
      leaderFeedback: '',
      updatedAt: serverTimestamp()
    };

    try {
      // 1. Write to /scout_homework
      await setDoc(doc(db, 'scout_homework', key), data, { merge: true });

      // 2. Dual-write to /user_progress/{scoutId}/assignments/{assignmentId}
      await setDoc(doc(db, 'user_progress', scoutUid, 'assignments', assignId), {
        assignmentId: assignId,
        completed: false,
        isCompleted: false,
        status: 'submitted',
        submittedDate: dateVal.split('T')[0],
        submittedAt: dateVal,
        notes: submissionNotes.trim(),
        scoutNotes: submissionNotes.trim(),
        graded: false,
        verifiedByLeader: false,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setSubmissionMsg("✓ Submitted for leader review! Your leader will verify and sign off soon.");
      setTimeout(() => {
        setSubmittingAssignment(null);
      }, 1600);
    } catch (err) {
      console.error("Failed to submit assignment:", err);
      setSubmissionErr("Error submitting: " + err.message);
    } finally {
      setSubmissionSaving(false);
    }
  };

  // ── FILTERING & DISPLAY LISTS ──
  // Filter assignments applicable to the target context
  const visibleAssignments = assignments.filter(a => {
    if (isLeader) {
      if (selectedPatrolFilter !== 'all' && a.assignedTarget === 'patrol' && a.targetGroupId !== selectedPatrolFilter) return false;
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q);
      }
      return true;
    }
    // For Scout
    if (a.assignedTarget === 'patrol' && currentUser?.groupId && a.targetGroupId !== currentUser.groupId) return false;
    if (a.assignedTarget === 'scout' && a.targetScoutUid !== currentUser?.uid) return false;
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate Scout View Lists (Active vs Completed)
  const scoutActiveList = [];
  const scoutCompletedList = [];

  if (isScout || targetScoutId) {
    visibleAssignments.forEach(a => {
      const rec = getRecord(a.id, targetScoutId);
      const st = getAssignmentStatus(a, rec);
      if (st.isCompleted) {
        scoutCompletedList.push({ assignment: a, record: rec, statusInfo: st });
      } else {
        scoutActiveList.push({ assignment: a, record: rec, statusInfo: st });
      }
    });
  }

  // Calculate Leader Matrix Stats
  let totalSubmissionsPendingReview = 0;
  let totalOverdueIncompleteCount = 0;
  let totalCompletedApprovedCount = 0;

  scoutsList.forEach(s => {
    assignments.forEach(a => {
      const rec = getRecord(a.id, s.uid);
      const st = getAssignmentStatus(a, rec);
      if (st.status === 'submitted') totalSubmissionsPendingReview++;
      if (st.status === 'overdue') totalOverdueIncompleteCount++;
      if (st.status === 'completed') totalCompletedApprovedCount++;
    });
  });

  return (
    <div className="space-y-6">
      {/* ── TOP BANNER & METRICS ── */}
      <div className={`bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
        isEmbeddedInProfile ? 'border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/20' : ''
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-950/50 shrink-0">
            🎒
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-black text-white">
                {isScout ? 'My Homework & Assignments' : 'Assignment & Homework Management'}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                {isScout ? 'Scout Portal' : 'Leader Verification'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isScout 
                ? 'Watch videos, complete worksheets, submit responses for leader verification, and track approved homework.'
                : 'Publish homework tasks, inspect scout submissions, leave feedback notes, and sign off on completion.'}
            </p>
          </div>
        </div>

        {/* Quick Actions & KPIs */}
        <div className="flex items-center gap-3 flex-wrap">
          {isLeader && (
            <>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-755 px-3.5 py-2 rounded-2xl">
                <div className="text-center px-2 border-r border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Pending Review</span>
                  <strong className="text-xs font-black text-blue-400 font-mono">{totalSubmissionsPendingReview}</strong>
                </div>
                <div className="text-center px-2 border-r border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Overdue</span>
                  <strong className="text-xs font-black text-red-400 font-mono">{totalOverdueIncompleteCount}</strong>
                </div>
                <div className="text-center px-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Approved</span>
                  <strong className="text-xs font-black text-emerald-400 font-mono">{totalCompletedApprovedCount}</strong>
                </div>
              </div>

              <button
                onClick={handleOpenNew}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <Plus size={15} />
                <span>Create Assignment</span>
              </button>
            </>
          )}

          {isScout && (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-755 px-4 py-2 rounded-2xl">
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Due</span>
                <strong className="text-xs font-black text-amber-400 font-mono">{scoutActiveList.length}</strong>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Approved</span>
                <strong className="text-xs font-black text-emerald-400 font-mono">{scoutCompletedList.length}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LEADER CREATE / EDIT FORM MODAL ── */}
      {showForm && isLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>{editingId ? 'Edit Homework Assignment' : 'Create & Publish New Homework Task'}</span>
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {formErr && <p className="text-xs text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-500/50">{formErr}</p>}
            {formMsg && <p className="text-xs text-emerald-400 bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/50">{formMsg}</p>}

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Knot Tying Video & Square Knot Practice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Subject Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Scouting Skills">⚜️ Scouting Skills & Fieldcraft</option>
                    <option value="Islamic Studies">🕌 Islamic Studies & Knowledge</option>
                    <option value="Fitness">🏃 Fitness & Health</option>
                    <option value="General">📋 General Troop Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-emerald-400" /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Resource Media Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="video">🎥 Instructional Video</option>
                    <option value="document">📄 Worksheet / PDF Document</option>
                    <option value="reading">📖 Reading & Study Packet</option>
                    <option value="practical">🎯 Practical Scouting Drill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <ExternalLink size={13} /> Resource URL Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/... or Google Drive URL"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Instructions & Requirements for Scouts
                </label>
                <textarea
                  rows={3}
                  placeholder="Clearly explain what the scout needs to study, practice, or submit for review..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* Assignment Target Delegation */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Assign To:
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="assignedTarget"
                      value="all"
                      checked={assignedTarget === 'all'}
                      onChange={() => setAssignedTarget('all')}
                    />
                    <span>Entire Troop (All Scouts)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="assignedTarget"
                      value="patrol"
                      checked={assignedTarget === 'patrol'}
                      onChange={() => setAssignedTarget('patrol')}
                    />
                    <span>Specific Patrol</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="assignedTarget"
                      value="scout"
                      checked={assignedTarget === 'scout'}
                      onChange={() => setAssignedTarget('scout')}
                    />
                    <span>Individual Scout</span>
                  </label>
                </div>

                {assignedTarget === 'patrol' && (
                  <div>
                    <select
                      value={targetGroupId}
                      onChange={(e) => setTargetGroupId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select Patrol...</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name} Patrol</option>
                      ))}
                    </select>
                  </div>
                )}

                {assignedTarget === 'scout' && (
                  <div>
                    <select
                      value={targetScoutUid}
                      onChange={(e) => setTargetScoutUid(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select Scout...</option>
                      {scoutsList.map(s => (
                        <option key={s.uid} value={s.uid}>{s.fullName || s.username} ({s.rank || 'Scout'})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                >
                  <Save size={15} />
                  <span>{saving ? 'Publishing...' : 'Save & Publish Assignment'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SCOUT SUBMISSION DRAWER / MODAL ── */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Submit Homework Task</span>
                <h3 className="font-extrabold text-white text-base mt-0.5">{submittingAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {submittingAssignment.description && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                <strong className="text-white block mb-1">Instructions:</strong>
                {submittingAssignment.description}
              </div>
            )}

            {submittingAssignment.link && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-700/50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-semibold">Attached Resource:</span>
                <a
                  href={submittingAssignment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <ExternalLink size={12} /> Open Link
                </a>
              </div>
            )}

            {submissionErr && <p className="text-xs text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-500/50">{submissionErr}</p>}
            {submissionMsg && <p className="text-xs text-emerald-400 bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/50">{submissionMsg}</p>}

            <form onSubmit={handleSubmitForReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Your Answers, Proof Notes, or Document Links:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe how you completed the assignment, what you learned, or paste links to your uploaded worksheet / video..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <p>
                  ℹ️ <strong>Strict Verification Note:</strong> Submitting will mark this task as <span className="text-blue-400 font-bold">Submitted (Awaiting Review)</span>. Your leader will review and grant official sign-off.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submissionSaving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={15} />
                  <span>{submissionSaving ? 'Submitting...' : 'Submit for Leader Review'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LEADER FEEDBACK & SIGN-OFF MODAL ── */}
      {feedbackModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Leader Review & Sign-Off</span>
                <h3 className="font-extrabold text-white text-base mt-0.5">
                  {feedbackModalRecord.scout.fullName || feedbackModalRecord.scout.username}
                </h3>
                <p className="text-xs text-slate-400">{feedbackModalRecord.assignment.title}</p>
              </div>
              <button
                onClick={() => setFeedbackModalRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {feedbackModalRecord.record?.scoutNotes && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                <strong className="text-slate-400 text-[10px] uppercase block">Scout Submission Notes:</strong>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{feedbackModalRecord.record.scoutNotes}</p>
                {feedbackModalRecord.record.submittedAt && (
                  <span className="text-[10px] text-slate-500 block pt-1">
                    Submitted: {new Date(feedbackModalRecord.record.submittedAt).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {feedbackMsg && <p className="text-xs text-emerald-400 bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/50">{feedbackMsg}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Leader Feedback & Commentary (Visible to Scout & Parents)
                </label>
                <textarea
                  rows={3}
                  placeholder="Great work on completing the knots! Excellent demonstration..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveFeedbackModal}
                  disabled={feedbackSaving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCheck size={15} />
                  <span>{feedbackSaving ? 'Signing Off...' : 'Approve & Mark Completed'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReopenIncomplete(feedbackModalRecord.assignment, feedbackModalRecord.scout, feedbackText)}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  title="Return to incomplete for scout revision"
                >
                  <RotateCcw size={14} />
                  <span>Return Incomplete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Sub-tabs / View Mode */}
        {isLeader ? (
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setLeaderViewMode('matrix')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                leaderViewMode === 'matrix' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 border border-slate-755 text-slate-400 hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Patrol Submission Matrix</span>
            </button>
            <button
              onClick={() => setLeaderViewMode('assignments')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                leaderViewMode === 'assignments' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 border border-slate-755 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Assignments Directory ({assignments.length})</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setScoutTab('active')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                scoutTab === 'active' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 border border-slate-755 text-slate-400 hover:text-white'
              }`}
            >
              <Clock size={14} />
              <span>Active Homework ({scoutActiveList.length})</span>
            </button>
            <button
              onClick={() => setScoutTab('completed')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                scoutTab === 'completed' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 border border-slate-755 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>Completed Archive ({scoutCompletedList.length})</span>
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {isLeader && (
            <select
              value={selectedPatrolFilter}
              onChange={(e) => setSelectedPatrolFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Patrols</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} Patrol</option>
              ))}
            </select>
          )}

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Scouting Skills">⚜️ Scouting Skills</option>
            <option value="Islamic Studies">🕌 Islamic Studies</option>
            <option value="Fitness">🏃 Fitness</option>
            <option value="General">📋 General</option>
          </select>

          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={13} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── 1. LEADER VIEW: PATROL SUBMISSION MATRIX ── */}
      {isLeader && leaderViewMode === 'matrix' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>📋 Patrol Homework Verification Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect scout completion statuses, review notes, and click "Mark Completed" to certify assignments.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-755">
              {scoutsList.length} Scouts &bull; {visibleAssignments.length} Assignments
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading submission matrix...</div>
          ) : visibleAssignments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              No assignments match the selected filters. Click "Create Assignment" to assign homework.
            </div>
          ) : scoutsList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              No scouts registered in this patrol or troop.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-4 min-w-[180px] sticky left-0 bg-slate-900 z-10">Scout Member</th>
                    <th className="p-4 min-w-[200px]">Assignment Task</th>
                    <th className="p-4 min-w-[110px]">Category</th>
                    <th className="p-4 min-w-[110px]">Due Date</th>
                    <th className="p-4 min-w-[170px] text-center">Current Status</th>
                    <th className="p-4 min-w-[220px]">Scout Submission & Feedback</th>
                    <th className="p-4 min-w-[160px] text-right">Leader Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-755">
                  {scoutsList.map(scout => {
                    const scoutPatrol = groups.find(g => g.id === scout.groupId)?.name || 'Patrol';
                    
                    return visibleAssignments.map((assign) => {
                      const rec = getRecord(assign.id, scout.uid);
                      const st = getAssignmentStatus(assign, rec);

                      return (
                        <tr key={`${scout.uid}_${assign.id}`} className="hover:bg-slate-750/40 transition">
                          {/* Scout Column */}
                          <td className="p-4 sticky left-0 bg-slate-800/95 z-10 border-r border-slate-755">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xs shrink-0">
                                {scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}
                              </div>
                              <div className="min-w-0">
                                <strong className="text-white block truncate">{scout.fullName || scout.username}</strong>
                                <span className="text-[10px] text-slate-400 block truncate">{scoutPatrol} &bull; {scout.rank || 'Scout'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Assignment Title */}
                          <td className="p-4 font-semibold text-white">
                            <div className="space-y-0.5">
                              <span className="block font-bold">{assign.title}</span>
                              {assign.link && (
                                <a
                                  href={assign.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink size={10} /> View Material
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="p-4">
                            <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                              {assign.category || 'Scouting'}
                            </span>
                          </td>

                          {/* Due Date */}
                          <td className="p-4 font-mono text-slate-300">
                            {assign.dueDate || 'Ongoing'}
                          </td>

                          {/* Status Badge (Strict) */}
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border ${st.badgeClass}`}>
                              {st.status === 'completed' && <CheckCircle2 size={11} className={st.iconClass} />}
                              {st.status === 'submitted' && <Clock size={11} className={st.iconClass} />}
                              {st.status === 'overdue' && <AlertTriangle size={11} className={st.iconClass} />}
                              {st.status === 'incomplete' && <Circle size={11} className={st.iconClass} />}
                              <span>{st.label}</span>
                            </span>
                          </td>

                          {/* Scout Submission & Feedback */}
                          <td className="p-4 text-xs">
                            <div className="space-y-1">
                              {rec?.scoutNotes ? (
                                <p className="text-slate-300 line-clamp-2 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-755">
                                  "{rec.scoutNotes}"
                                </p>
                              ) : (
                                <span className="text-slate-500 text-[11px] italic">No submission text yet</span>
                              )}
                              {rec?.leaderFeedback && (
                                <p className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                                  <span>💬 Leader Feedback:</span> {rec.leaderFeedback}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Leader Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {st.status === 'completed' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mr-2">
                                    <CheckCheck size={14} /> Approved
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleReopenIncomplete(assign, scout)}
                                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-755 transition cursor-pointer"
                                    title="Revert to Incomplete / Reopen"
                                  >
                                    <RotateCcw size={13} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMarkCompleted(assign, scout)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-sm"
                                    title="Quick 1-Click Approval"
                                  >
                                    <Check size={12} /> Mark Completed
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFeedbackModalRecord({ assignment: assign, scout, record: rec });
                                      setFeedbackText(rec?.leaderFeedback || '');
                                    }}
                                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-755 transition cursor-pointer"
                                    title="Add Feedback & Review Notes"
                                  >
                                    <MessageSquare size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── 2. LEADER VIEW: ASSIGNMENTS DIRECTORY ── */}
      {isLeader && leaderViewMode === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAssignments.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-slate-800 rounded-3xl border border-slate-700 text-slate-400 text-xs">
                No assignments created yet. Click "Create Assignment" above to assign homework.
              </div>
            ) : (
              visibleAssignments.map(assign => {
                // Calculate completion stats for this assignment
                let completedCount = 0;
                let submittedCount = 0;
                let overdueCount = 0;
                let totalTargeted = scoutsList.length;

                scoutsList.forEach(s => {
                  const rec = getRecord(assign.id, s.uid);
                  const st = getAssignmentStatus(assign, rec);
                  if (st.status === 'completed') completedCount++;
                  else if (st.status === 'submitted') submittedCount++;
                  else if (st.status === 'overdue') overdueCount++;
                });

                return (
                  <div key={assign.id} className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            {assign.category || 'Scouting'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-755 px-2 py-0.5 rounded-full">
                            Due: {assign.dueDate || 'Ongoing'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-white text-base">{assign.title}</h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(assign)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assign.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-600/80 text-slate-400 hover:text-white transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {assign.description && (
                      <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                        {assign.description}
                      </p>
                    )}

                    {/* Progress Bar & Counts */}
                    <div className="bg-slate-900 p-3 rounded-2xl border border-slate-755 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Patrol Completion</span>
                        <strong className="text-emerald-400 font-mono font-black">{completedCount}/{totalTargeted} Scouts</strong>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${totalTargeted ? (completedCount / totalTargeted) * 100 : 0}%` }}></div>
                        <div className="bg-blue-500 h-full" style={{ width: `${totalTargeted ? (submittedCount / totalTargeted) * 100 : 0}%` }}></div>
                        <div className="bg-red-500 h-full" style={{ width: `${totalTargeted ? (overdueCount / totalTargeted) * 100 : 0}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span className="text-emerald-400 font-bold">✓ {completedCount} Approved</span>
                        <span className="text-blue-400 font-bold">⏱️ {submittedCount} Submitted</span>
                        <span className="text-red-400 font-bold">🚨 {overdueCount} Overdue</span>
                      </div>
                    </div>

                    {assign.link && (
                      <a
                        href={assign.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-bold"
                      >
                        <ExternalLink size={12} /> Open Resource Link
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── 3. SCOUT VIEW: ACTIVE & COMPLETED LISTS ── */}
      {isScout && (
        <div className="space-y-4">
          {scoutTab === 'active' ? (
            <div className="space-y-3">
              {scoutActiveList.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-3xl border border-slate-700 text-slate-400 text-xs">
                  🎉 MāshāʾAllāh! You have no active homework due right now.
                </div>
              ) : (
                scoutActiveList.map(({ assignment, record, statusInfo }) => (
                  <div
                    key={assignment.id}
                    className={`bg-slate-800 border rounded-3xl p-5 shadow-xl transition space-y-4 ${
                      statusInfo.status === 'overdue'
                        ? 'border-red-500/60 bg-red-950/15'
                        : statusInfo.status === 'submitted'
                        ? 'border-blue-500/50 bg-blue-950/15'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full">
                            {assignment.category || 'Scouting Skills'}
                          </span>

                          <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${statusInfo.badgeClass}`}>
                            {statusInfo.status === 'overdue' && <AlertTriangle size={11} />}
                            {statusInfo.status === 'submitted' && <Clock size={11} />}
                            <span>{statusInfo.label}</span>
                          </span>

                          {assignment.dueDate && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                              📅 Due: {assignment.dueDate}
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-white text-base">{assignment.title}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenScoutSubmission(assignment)}
                        className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shrink-0 ${
                          statusInfo.status === 'submitted'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {statusInfo.status === 'submitted' ? (
                          <>
                            <Edit3 size={14} /> Update Submission
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Submit Homework
                          </>
                        )}
                      </button>
                    </div>

                    {assignment.description && (
                      <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-2xl border border-slate-755">
                        {assignment.description}
                      </p>
                    )}

                    {/* Scout Submission Note / Feedback Status */}
                    {record?.scoutNotes && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                        <strong className="text-[10px] font-bold text-blue-400 uppercase block mb-0.5">Your Submitted Proof / Notes:</strong>
                        <p className="text-slate-300 leading-relaxed">{record.scoutNotes}</p>
                      </div>
                    )}

                    {record?.leaderFeedback && (
                      <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-600/50 text-xs text-amber-200">
                        <strong className="text-[10px] font-bold text-amber-400 uppercase block mb-0.5">Leader Revision Note:</strong>
                        <p className="leading-relaxed">{record.leaderFeedback}</p>
                      </div>
                    )}

                    {/* Attached Material Link */}
                    {assignment.link && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-755/70">
                        <a
                          href={assignment.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                        >
                          <ExternalLink size={13} /> Open Study Link / Resource Video
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {scoutCompletedList.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-3xl border border-slate-700 text-slate-400 text-xs">
                  No completed homework archive yet. Submit your active assignments to get approved!
                </div>
              ) : (
                scoutCompletedList.map(({ assignment, record }) => (
                  <div
                    key={assignment.id}
                    className="bg-emerald-950/20 border border-emerald-600/40 rounded-3xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full">
                            {assignment.category || 'Scouting Skills'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full border font-bold bg-emerald-900/60 text-emerald-300 border-emerald-600">
                            <CheckCheck size={11} /> Verified & Signed Off
                          </span>
                        </div>
                        <h4 className="font-extrabold text-white text-base">{assignment.title}</h4>
                      </div>

                      <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                        ✓ Completed {record?.completedDate || record?.completedAt?.split('T')[0] || ''}
                      </span>
                    </div>

                    {record?.leaderFeedback && (
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-800/40 text-xs">
                        <strong className="text-[10px] font-bold text-emerald-400 uppercase block mb-0.5">Leader Feedback & Sign-Off:</strong>
                        <p className="text-slate-300">{record.leaderFeedback}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
