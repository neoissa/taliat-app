import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  setDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import RankIcon from './RankIcon';
import ScoutProgressReport from './ScoutProgressReport';
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
  Car,
  Utensils
} from 'lucide-react';
import { dispatchParentNotification } from '../utils/notificationPipeline';

export default function ParentDashboard({ currentUser = {}, onNavigate }) {
  const [parentDoc, setParentDoc] = useState(currentUser);
  const [linkedScouts, setLinkedScouts] = useState([]);
  const [selectedScoutId, setSelectedScoutId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tasks' | 'events' | 'family' | 'reports' | 'notifications'
  const [loading, setLoading] = useState(true);

  // Child Progress States
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [scoutSubmissions, setScoutSubmissions] = useState({});
  const [scoutHomeworkRecords, setScoutHomeworkRecords] = useState({});
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [serviceLogs, setServiceLogs] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

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

  // In-App Notifications Feed
  const [notifications, setNotifications] = useState([]);

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

  // 2. Fetch Users and Groups
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setAllGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    return () => {
      unsubUsers();
      unsubGroups();
    };
  }, []);

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
    if (matchingScouts.length > 0 && (!selectedScoutId || !matchingScouts.some(s => s.uid === selectedScoutId))) {
      setSelectedScoutId(matchingScouts[0].uid);
      setAbsenceScoutId(matchingScouts[0].uid);
    }
    setLoading(false);
  }, [parentDoc, allUsers, selectedScoutId]);

  // Active Selected Child
  const activeScout = linkedScouts.find(s => s.uid === selectedScoutId) || linkedScouts[0] || null;
  const activeScoutId = activeScout?.uid;

  // 4. Progress Listeners for Active Child
  useEffect(() => {
    if (!activeScoutId) return;

    const unsubRanks = onSnapshot(collection(db, 'user_progress', activeScoutId, 'ranks'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });

    const unsubMerit = onSnapshot(collection(db, 'user_progress', activeScoutId, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
    });

    const unsubIslamic = onSnapshot(doc(db, 'user_progress', activeScoutId, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) setIslamicProgress(snap.data() || {});
      else setIslamicProgress({});
    });

    const unsubSub = onSnapshot(collection(db, 'user_progress', activeScoutId, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setScoutSubmissions(map);
    });

    const unsubHw = onSnapshot(collection(db, 'scout_homework'), (snap) => {
      const m = {};
      snap.docs.forEach(d => { m[d.id] = d.data(); });
      setScoutHomeworkRecords(m);
    });

    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubService = onSnapshot(collection(db, 'service_logs'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.scoutId === activeScoutId || l.userId === activeScoutId);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setServiceLogs(list);
    });

    const unsubAttendance = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.records && s.records[activeScoutId]);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setAttendanceSessions(list);
    });

    return () => {
      unsubRanks();
      unsubMerit();
      unsubIslamic();
      unsubSub();
      unsubHw();
      unsubAssign();
      unsubService();
      unsubAttendance();
    };
  }, [activeScoutId]);

  // 5. Parent Tasks & In-App Notifications Listeners
  useEffect(() => {
    const unsubTasks = onSnapshot(collection(db, 'parent_tasks'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
      setParentTasks(list);
    });

    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEventsList(list);
    });

    const unsubNotifs = onSnapshot(collection(db, 'parent_notifications'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => !n.recipientUid || n.recipientUid === currentUser?.uid || n.parentEmail === currentUser?.email);
      list.sort((a, b) => new Date(b.createdAt || '1970-01-01') - new Date(a.createdAt || '1970-01-01'));
      setNotifications(list);
    });

    // Listen to parent form submissions
    if (currentUser?.uid) {
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
      return () => {
        unsubTasks();
        unsubEvents();
        unsubNotifs();
        unsubSubs();
      };
    }

    return () => {
      unsubTasks();
      unsubEvents();
      unsubNotifs();
    };
  }, [currentUser?.uid, currentUser?.email]);

  // ── URGENT 7-DAY DEADLINE CALCULATION ENGINE ──
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
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // ── HANDLERS ──
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

  // Mark notification read
  const handleMarkNotifRead = async (notifId) => {
    try {
      await setDoc(doc(db, 'parent_notifications', notifId), { read: true }, { merge: true });
    } catch (err) {
      console.warn("Mark notif read error:", err);
    }
  };

  // ── ADVANCEMENT & ATTENDANCE CALCULATIONS FOR ACTIVE CHILD ──
  const scoutFullName = activeScout?.fullName || activeScout?.username || 'Child Member';
  const scoutRank = (activeScout?.rank || 'Scout').toLowerCase();
  const groupObj = allGroups.find(g => g.id === activeScout?.groupId) || {};
  const patrolName = groupObj.name || 'Al-Huda';

  const completedRanks = RANKS_DATA.filter(rank => {
    const rp = ranksProgress[rank.id] || {};
    const reqs = rp.completedRequirements || rp.steps || {};
    const total = rank.categories ? rank.categories.reduce((sum, c) => sum + c.requirements.length, 0) : (rank.requirements?.length || 0);
    const done = rank.categories 
      ? rank.categories.reduce((sum, c) => sum + c.requirements.filter(r => reqs[r.id]?.completed).length, 0)
      : (rank.requirements?.filter(r => reqs[r.id]?.completed)?.length || 0);
    return total > 0 && done === total;
  });

  const activeRankData = RANKS_DATA.find(r => r.name.toLowerCase() === scoutRank) || RANKS_DATA[0];
  const activeProg = ranksProgress[activeRankData.id] || {};
  const activeReqs = activeProg.completedRequirements || activeProg.steps || {};
  const activeTotal = activeRankData.categories 
    ? activeRankData.categories.reduce((sum, c) => sum + c.requirements.length, 0) 
    : (activeRankData.requirements?.length || 0);
  const activeDone = activeRankData.categories 
    ? activeRankData.categories.reduce((sum, c) => sum + c.requirements.filter(r => activeReqs[r.id]?.completed).length, 0)
    : (activeRankData.requirements?.filter(r => activeReqs[r.id]?.completed)?.length || 0);
  const rankPercent = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  const earnedBadges = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    const total = b.requirements ? b.requirements.length : 1;
    const done = b.requirements ? b.requirements.filter(r => {
      const s = p.steps?.[r.id] || p.completedSteps?.[r.id];
      return s === true || s?.completed === true || s === 'approved' || s?.approved === true;
    }).length : 0;
    return p.completed === true || (total > 0 && done === total);
  });

  // Attendance stats
  let totalAttendedHours = 0;
  let campingNights = 0;
  let attendedSessionsCount = 0;
  let unexcusedAbsences = 0;

  attendanceSessions.forEach(s => {
    const rec = s.records?.[activeScoutId];
    if (rec) {
      const sType = s.eventType || '';
      const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : 3.0;
      const defaultN = sType.includes('Camp') ? 2 : 0;
      const h = rec.hours !== undefined ? Number(rec.hours) : (s.hours !== undefined ? Number(s.hours) : defaultH);
      const n = rec.nights !== undefined ? Number(rec.nights) : (s.nights !== undefined ? Number(s.nights) : defaultN);

      if (rec.status === 'present' || rec.status === 'late') {
        attendedSessionsCount++;
        totalAttendedHours += h;
        campingNights += n;
      } else if (rec.status === 'absent') {
        unexcusedAbsences++;
      }
    }
  });

  const totalSessions = attendanceSessions.length;
  const attendanceRate = totalSessions > 0 ? Math.round((attendedSessionsCount / totalSessions) * 100) : 100;
  const riskLevel = unexcusedAbsences >= 3 ? 'critical' : unexcusedAbsences === 2 ? 'warning' : 'good';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-emerald-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-semibold">Loading Family Portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* ── 1. URGENT 7-DAY DEADLINE BANNER ── */}
      {urgentTasks.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/90 via-red-900/80 to-amber-950/90 border-2 border-red-500 p-4 sm:p-5 rounded-3xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/30 border border-red-400 flex items-center justify-center text-xl shrink-0">
              ⚡
            </div>
            <div>
              <span className="text-[10px] font-black uppercase bg-red-500 text-white px-2 py-0.5 rounded-full">
                Action Required ({urgentTasks.length} Due Soon)
              </span>
              <h3 className="text-sm font-black text-white mt-1">
                {urgentTasks[0].title} — {urgentTasks[0].isOverdue ? '🚨 OVERDUE!' : `Due in ${urgentTasks[0].daysDiff} days`}
              </h3>
              <p className="text-xs text-red-200">Please review and submit the required medical/camp form before the deadline.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="bg-white hover:bg-slate-100 text-red-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-lg shrink-0 self-start sm:self-center"
          >
            Open Action Center &rarr;
          </button>
        </div>
      )}

      {/* ── 2. TOP HERO & DUAL-PARENT QUICK SUMMARY ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-950/60 shrink-0">
            👨‍👩‍👧
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-black text-white">Dhulfiqār Family Portal</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Parent Hub
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Family household: <strong className="text-white">{parent1Name || parentDoc.fullName || 'Parent'}</strong>
              {parent2Name ? ` & ${parent2Name}` : ''} &bull; {linkedScouts.length} Registered {linkedScouts.length === 1 ? 'Child' : 'Children'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAbsenceModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <AlertCircle size={14} />
            <span>Submit Absence Notice</span>
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <User size={14} />
            <span>Family Profile</span>
          </button>
        </div>
      </div>

      {/* ── 3. MULTI-CHILD SWITCHER TABS ── */}
      {linkedScouts.length > 0 && (
        <div className="bg-slate-850 border border-slate-750 p-3 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none shadow-md">
          <span className="text-[10px] uppercase font-black text-slate-400 px-2 shrink-0">Select Child:</span>
          {linkedScouts.map(scout => {
            const isSelected = scout.uid === selectedScoutId;
            return (
              <button
                key={scout.uid}
                onClick={() => setSelectedScoutId(scout.uid)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-slate-900 border border-slate-750 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-950/60 border border-white/20 flex items-center justify-center text-[10px] font-black">
                  {scout.fullName?.charAt(0) || 'S'}
                </div>
                <span>{scout.fullName || scout.username}</span>
                <span className="text-[10px] opacity-80 font-mono">({scout.rank || 'Scout'})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── 4. PRIMARY PARENT PORTAL TABS ── */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: `${scoutFullName}'s Progress`, icon: Award },
          { id: 'tasks', label: 'Parent Action Center (Forms)', icon: Zap, badge: urgentTasks.length > 0 ? `⚡ ${urgentTasks.length} Due` : null, badgeColor: 'bg-red-500 text-white' },
          { id: 'events', label: 'Troop Calendar & RSVP', icon: Calendar },
          { id: 'reports', label: 'Official Progress Reports', icon: Printer },
          { id: 'family', label: 'Dual-Parent Household Profile', icon: Home },
          { id: 'notifications', label: 'Alerts & Feed', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : null, badgeColor: 'bg-blue-500 text-white' }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-850 border border-slate-750 text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
              {t.badge && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${t.badgeColor}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 5. TAB 1: CHILD PROGRESS & ADVANCEMENT (100% READ-ONLY) ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-850 border border-slate-750 p-4 rounded-3xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Rank</span>
              <strong className="text-lg font-black text-white block truncate">{activeRankData.name}</strong>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full" style={{ width: `${rankPercent}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">{activeDone}/{activeTotal} Req ({rankPercent}%)</span>
            </div>

            <div className="bg-slate-850 border border-slate-750 p-4 rounded-3xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Merit Badges</span>
              <strong className="text-lg font-black text-amber-400 block font-mono">{earnedBadges.length} / 21 Earned</strong>
              <span className="text-[10px] text-slate-400 block mt-1">★ {earnedBadges.filter(b => b.eagleRequired).length} Eagle-Required</span>
            </div>

            <div className="bg-slate-850 border border-slate-750 p-4 rounded-3xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Rate</span>
              <div className="flex items-center gap-2">
                <strong className="text-lg font-black text-emerald-400 font-mono">{attendanceRate}%</strong>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  riskLevel === 'critical' ? 'bg-red-500 text-white' : riskLevel === 'warning' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {riskLevel === 'good' ? '🟢 Good' : riskLevel === 'warning' ? '⚠️ Warning' : '🚨 Critical'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">{Math.round(totalAttendedHours * 10) / 10}h &bull; {campingNights} Nights</span>
            </div>

            <div className="bg-slate-850 border border-slate-750 p-4 rounded-3xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Patrol</span>
              <strong className="text-lg font-black text-sky-400 block truncate">👥 {patrolName}</strong>
              <span className="text-[10px] text-slate-400 block mt-1">Dhulfiqār Troop 313</span>
            </div>
          </div>

          {/* Advancement Checklist View (Strictly Read-Only) */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-750 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">⚜️ {activeRankData.name} Rank Requirements Progress</h3>
                <p className="text-xs text-slate-400">Requirements verified and certified by unit leaders.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-750">
                {activeDone} of {activeTotal} Certified
              </span>
            </div>

            <div className="space-y-2.5">
              {(activeRankData.categories || []).map((cat, cIdx) => (
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
        </div>
      )}

      {/* ── 6. TAB 2: PARENT ACTION CENTER (TASKS & FORMS) ── */}
      {activeTab === 'tasks' && (
        <div className="space-y-5">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-2">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span>Parent Action Center: Required Forms & Registration Waivers</span>
            </h3>
            <p className="text-xs text-slate-400">
              Submit digital acknowledgments, medical record uploads, and activity permission slips for your scouts.
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

                  <div className="flex justify-between items-center pt-2 border-t border-slate-750">
                    {task.isDone ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Submitted on {task.submission?.submittedAt?.split('T')[0]}
                      </span>
                    ) : (
                      <button
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

      {/* ── 7. TAB 3: TROOP CALENDAR & RSVP ── */}
      {activeTab === 'events' && (
        <div className="space-y-5">
          <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-2">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Calendar size={18} className="text-sky-400" />
              <span>Troop Calendar & Interactive RSVPs</span>
            </h3>
            <p className="text-xs text-slate-400">
              Confirm attendance for <strong className="text-white">{scoutFullName}</strong>, log dietary needs, and offer carpool driver assistance.
            </p>
          </div>

          <div className="space-y-3">
            {eventsList.map(ev => (
              <div key={ev.id} className="bg-slate-850 border border-slate-755 p-5 rounded-3xl space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                        {ev.category || 'Event'}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">📅 {ev.date} &bull; ⏰ {ev.time}</span>
                    </div>
                    <h4 className="font-extrabold text-white text-base">{ev.title}</h4>
                    {ev.location && <p className="text-xs text-slate-400 mt-0.5">📍 {ev.location}</p>}
                  </div>

                  <button
                    onClick={() => onNavigate && onNavigate('events')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    View RSVP & Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 8. TAB 4: OFFICIAL PROGRESS REPORTS ── */}
      {activeTab === 'reports' && activeScout && (
        <ScoutProgressReport scout={activeScout} currentUser={currentUser} onBack={() => setActiveTab('overview')} />
      )}

      {/* ── 9. TAB 5: DUAL-PARENT FAMILY PROFILE ── */}
      {activeTab === 'family' && (
        <div className="bg-slate-850 border border-slate-750 p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-750 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-lg">Dual-Parent Household Profile</h3>
              <p className="text-xs text-slate-400">
                Manage contact details for both parents and household emergency contacts. No leader approval required.
              </p>
            </div>
            {!isEditingFamily ? (
              <button
                onClick={() => setIsEditingFamily(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
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

      {/* ── 10. TAB 6: IN-APP NOTIFICATIONS CENTER ── */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-850 border border-slate-750 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-750 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Bell size={18} className="text-emerald-400" />
              <span>Family Alerts & Notifications Feed</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{notifications.length} Messages</span>
          </div>

          <div className="space-y-2.5">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center">No alerts in your notification center.</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                    !n.read ? 'bg-slate-900 border-emerald-500/50 shadow-sm' : 'bg-slate-900/50 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        n.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {n.type || 'Alert'}
                      </span>
                      <strong className="text-xs font-bold text-white">{n.title}</strong>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{n.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono block pt-1">{n.createdAt?.split('T')[0]}</span>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkNotifRead(n.id)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
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
    </div>
  );
}
