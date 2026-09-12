import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Calendar, 
  FileText, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Search, 
  BookOpen, 
  Clock, 
  X, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  Send,
  MessageSquare,
  Users,
  Shield,
  Filter,
  CheckCircle2,
  CopyPlus,
  UserCheck,
  Lock,
  Unlock,
  Crown,
  Info
} from 'lucide-react';
import { formatKashafLessonPlanWhatsApp, applyIslamicTransliteration } from '../utils/kashafVoice';

export default function LessonPlans({ currentUser }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'executive' || currentUser?.isExecutive || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scout Master';
  const isLeaderOrOwner = currentUser?.role === 'leader' || currentUser?.role === 'owner' || isExecutive;

  const [plans, setPlans] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ── 1. Resolve Accessible Patrols for Current User ──
  // Troop Owner: Access all patrols
  // Leader / Assistant Leader: Strictly patrols they are assigned to lead or assist
  const accessibleGroups = useMemo(() => {
    if (isOwner || isExecutive) return groups;
    return groups.filter(g => {
      const isDirectGroupId = g.id === currentUser?.groupId || g.id === currentUser?.patrolId;
      const isLeaderId = g.leaderId === currentUser?.uid;
      const isAssignedLeader = Array.isArray(g.assignedLeaderIds) && g.assignedLeaderIds.includes(currentUser?.uid);
      const isAssistantLeader = Array.isArray(g.assistantLeaderIds) && g.assistantLeaderIds.includes(currentUser?.uid);
      const isAssignedPatrolName = currentUser?.assignedPatrol && (g.name === currentUser.assignedPatrol || g.id === currentUser.assignedPatrol);
      const isPatrolName = currentUser?.patrol && (g.name === currentUser.patrol || g.id === currentUser.patrol);
      const isAssignedPatrolsArray = Array.isArray(currentUser?.assignedPatrols) && (currentUser.assignedPatrols.includes(g.id) || currentUser.assignedPatrols.includes(g.name));

      return isDirectGroupId || isLeaderId || isAssignedLeader || isAssistantLeader || isAssignedPatrolName || isPatrolName || isAssignedPatrolsArray;
    });
  }, [groups, currentUser, isOwner, isExecutive]);

  // Primary active patrol selection
  const [selectedPatrolId, setSelectedPatrolId] = useState('');

  useEffect(() => {
    if (accessibleGroups.length > 0 && !selectedPatrolId) {
      if (isOwner) {
        setSelectedPatrolId('all');
      } else {
        setSelectedPatrolId(accessibleGroups[0].id);
      }
    }
  }, [accessibleGroups, isOwner, selectedPatrolId]);

  // Active Patrol Object
  const activePatrol = useMemo(() => {
    if (selectedPatrolId === 'all') return null;
    return groups.find(g => g.id === selectedPatrolId) || accessibleGroups[0] || null;
  }, [groups, accessibleGroups, selectedPatrolId]);

  // Leaders and Assistant Leaders of the currently active patrol
  const activePatrolLeadership = useMemo(() => {
    if (!activePatrol) return [];
    return users.filter(u => {
      if (u.role !== 'leader' && u.role !== 'owner' && u.role !== 'admin') return false;
      const isLeaderOfGroup = (
        u.groupId === activePatrol.id ||
        u.patrolId === activePatrol.id ||
        u.assignedPatrol === activePatrol.name ||
        u.patrol === activePatrol.name ||
        u.uid === activePatrol.leaderId ||
        (Array.isArray(activePatrol.assignedLeaderIds) && activePatrol.assignedLeaderIds.includes(u.uid)) ||
        (Array.isArray(activePatrol.assistantLeaderIds) && activePatrol.assistantLeaderIds.includes(u.uid)) ||
        (Array.isArray(u.assignedPatrols) && u.assignedPatrols.includes(activePatrol.id))
      );
      return isLeaderOfGroup;
    });
  }, [users, activePatrol]);

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [targetGroupId, setTargetGroupId] = useState('');
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [planTitle, setPlanTitle] = useState('');
  const [planContent, setPlanContent] = useState('');
  const [islamicPrep, setIslamicPrep] = useState('');
  const [resources, setResources] = useState([{ name: '', url: '' }]);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [editorCopiedSuccess, setEditorCopiedSuccess] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Subscribe to Lesson Plans
  useEffect(() => {
    const plansRef = collection(db, 'lesson_plans');
    const q = query(plansRef);
    
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort plans by date descending
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setPlans(list);
      setLoading(false);
    }, (err) => {
      console.error("Failed to load lesson plans:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. Subscribe to Groups (Patrols)
  useEffect(() => {
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    return () => unsubGroups();
  }, []);

  // 3. Subscribe to Users for Leader & Assistant Resolution
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    return () => unsubUsers();
  }, []);

  // ── Scoped Plans: Strictly Patrol-Specific & Shared Only Among Leaders/Assistants of that Patrol ──
  const scopedPlans = useMemo(() => {
    const accessibleGroupIds = accessibleGroups.map(g => g.id);
    const accessibleGroupNames = accessibleGroups.map(g => g.name);

    return plans.filter(p => {
      // Owner/Executive with 'all' filter sees all plans
      if (isOwner && selectedPatrolId === 'all') return true;

      // Filter by selected patrol
      if (selectedPatrolId && selectedPatrolId !== 'all') {
        const matchesSelected = (
          p.targetGroupId === selectedPatrolId ||
          p.groupId === selectedPatrolId ||
          p.patrolId === selectedPatrolId ||
          (activePatrol && p.patrolName === `${activePatrol.name} Patrol`) ||
          (activePatrol && p.patrolName === activePatrol.name)
        );
        return matchesSelected;
      }

      // If leader, only show plans belonging to their accessible patrols
      const isAssignedPatrol = (
        accessibleGroupIds.includes(p.targetGroupId) ||
        accessibleGroupIds.includes(p.groupId) ||
        accessibleGroupIds.includes(p.patrolId) ||
        accessibleGroupNames.includes(p.patrolName?.replace(' Patrol', '')) ||
        accessibleGroupIds.includes(p.authorPatrolId)
      );

      return isAssignedPatrol;
    });
  }, [plans, isOwner, selectedPatrolId, accessibleGroups, activePatrol]);

  // Auto-select first plan when list changes or filter updates
  useEffect(() => {
    if (scopedPlans.length > 0) {
      if (!selectedPlan || !scopedPlans.some(p => p.id === selectedPlan.id)) {
        setSelectedPlan(scopedPlans[0]);
      }
    } else {
      setSelectedPlan(null);
    }
  }, [scopedPlans]);

  // Filtered plans by search query
  const filteredPlans = useMemo(() => {
    if (!searchTerm.trim()) return scopedPlans;
    const q = searchTerm.toLowerCase();
    return scopedPlans.filter(p => {
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchDate = (p.date || '').includes(q);
      const matchContent = (p.content || '').toLowerCase().includes(q);
      const matchIslamic = (p.islamicPrep || '').toLowerCase().includes(q);
      const matchAuthor = (p.authorName || p.updatedByName || '').toLowerCase().includes(q);
      const matchPatrol = (p.patrolName || '').toLowerCase().includes(q);
      return matchTitle || matchDate || matchContent || matchIslamic || matchAuthor || matchPatrol;
    });
  }, [scopedPlans, searchTerm]);

  // Check if current user can edit the currently selected plan
  const canEditSelectedPlan = useMemo(() => {
    if (!selectedPlan) return false;
    if (isOwner || isExecutive) return true;
    const planPatrolId = selectedPlan.targetGroupId || selectedPlan.groupId || selectedPlan.patrolId;
    return accessibleGroups.some(g => g.id === planPatrolId || g.name === selectedPlan.patrolName?.replace(' Patrol', ''));
  }, [selectedPlan, isOwner, isExecutive, accessibleGroups]);

  // Update customized WhatsApp message whenever selected plan changes
  useEffect(() => {
    if (selectedPlan) {
      const pName = selectedPlan.patrolName || (activePatrol?.name ? `${activePatrol.name} Patrol` : '');
      setCustomWhatsAppMsg(formatKashafLessonPlanWhatsApp(selectedPlan, pName));
    }
  }, [selectedPlan, activePatrol]);

  const handleAddResourceRow = () => {
    setResources([...resources, { name: '', url: '' }]);
  };

  const handleRemoveResourceRow = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleResourceChange = (index, field, value) => {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  };

  const handleOpenNewEditor = () => {
    const defaultGroup = activePatrol?.id || accessibleGroups[0]?.id || '';
    setEditingId(null);
    setTargetGroupId(defaultGroup);
    setPlanDate(new Date().toISOString().split('T')[0]);
    setPlanTitle('');
    setPlanContent('');
    setIslamicPrep('');
    setResources([{ name: '', url: '' }]);
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditing(true);
  };

  const handleOpenEditEditor = (plan) => {
    setEditingId(plan.id);
    setTargetGroupId(plan.targetGroupId || plan.groupId || plan.patrolId || (activePatrol?.id || accessibleGroups[0]?.id || ''));
    setPlanDate(plan.date || '');
    setPlanTitle(plan.title || '');
    setPlanContent(plan.content || '');
    setIslamicPrep(plan.islamicPrep || '');
    setResources(plan.resources && plan.resources.length > 0 ? plan.resources : [{ name: '', url: '' }]);
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditing(true);
  };

  const handleDuplicatePlan = (plan) => {
    setEditingId(null);
    setTargetGroupId(activePatrol?.id || accessibleGroups[0]?.id || plan.targetGroupId || '');
    setPlanDate(new Date().toISOString().split('T')[0]);
    setPlanTitle(`Copy of ${plan.title || 'Lesson Plan'}`);
    setPlanContent(plan.content || '');
    setIslamicPrep(plan.islamicPrep || '');
    setResources(plan.resources && plan.resources.length > 0 ? [...plan.resources] : [{ name: '', url: '' }]);
    setErrorMsg('');
    setSuccessMsg('Cloned plan! You can now customize and save it for your patrol leadership team.');
    setIsEditing(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!planTitle.trim() || !planDate) {
      setErrorMsg("Title and Date are required.");
      return;
    }

    if (!targetGroupId) {
      setErrorMsg("Please select a patrol for this lesson plan.");
      return;
    }

    const cleanResources = resources.filter(r => r.name.trim() && r.url.trim());
    const selectedGroup = groups.find(g => g.id === targetGroupId) || accessibleGroups.find(g => g.id === targetGroupId);
    const resolvedPatrolName = selectedGroup?.name ? `${selectedGroup.name} Patrol` : 'Patrol Plan';

    const existingPlan = editingId ? plans.find(p => p.id === editingId) : null;
    const existingCollaborators = Array.isArray(existingPlan?.collaborators) ? existingPlan.collaborators : [];

    // Track leader/assistant collaborator details
    const userRoleLabel = currentUser?.leaderPosition || (currentUser?.role === 'owner' ? 'Troop Headmaster' : 'Patrol Leader');

    const updatedCollaborators = [
      ...existingCollaborators.filter(c => c.uid !== currentUser?.uid),
      {
        uid: currentUser?.uid || 'leader',
        name: currentUser?.fullName || currentUser?.username || 'Patrol Leader',
        role: userRoleLabel,
        modifiedAt: new Date().toISOString()
      }
    ];

    const planData = {
      title: planTitle.trim(),
      date: planDate,
      content: planContent.trim(),
      islamicPrep: islamicPrep.trim(),
      resources: cleanResources,
      targetGroupId: targetGroupId,
      groupId: targetGroupId,
      patrolId: targetGroupId,
      patrolName: resolvedPatrolName,
      scope: 'patrol',
      authorId: existingPlan?.authorId || currentUser?.uid || 'leader',
      authorName: existingPlan?.authorName || currentUser?.fullName || currentUser?.username || 'Patrol Leader',
      authorRole: existingPlan?.authorRole || userRoleLabel,
      authorPatrolId: targetGroupId,
      authorPatrolName: resolvedPatrolName,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedBy: currentUser?.uid || 'leader',
      updatedByName: currentUser?.fullName || currentUser?.username || 'Patrol Leader',
      updatedByRole: userRoleLabel,
      updatedAt: serverTimestamp(),
      sharedWithPatrol: true,
      collaborators: updatedCollaborators
    };

    try {
      const docId = editingId || `plan_${Date.now()}`;
      await setDoc(doc(db, 'lesson_plans', docId), planData, { merge: true });
      
      setSuccessMsg(editingId ? "Lesson plan updated and synced with patrol leaders!" : "New lesson plan published for your patrol leadership team!");
      setTimeout(() => {
        setIsEditing(false);
        setEditingId(null);
        setSelectedPlan({ id: docId, ...planData });
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save plan: " + err.message);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this lesson plan? This will remove it for all leaders of this patrol.")) return;
    try {
      await deleteDoc(doc(db, 'lesson_plans', planId));
      setSelectedPlan(null);
    } catch (err) {
      alert("Failed to delete plan: " + err.message);
    }
  };

  const handleCopyWhatsAppMsg = (msg) => {
    if (!msg) return;
    navigator.clipboard.writeText(msg);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleCopyEditorWhatsAppMsg = () => {
    const selectedGroup = groups.find(g => g.id === targetGroupId) || accessibleGroups.find(g => g.id === targetGroupId);
    const pName = selectedGroup?.name ? `${selectedGroup.name} Patrol` : '';
    const currentEditorPlan = {
      title: planTitle,
      date: planDate,
      content: planContent,
      islamicPrep: islamicPrep,
      resources: resources.filter(r => r.name && r.url)
    };
    const msg = formatKashafLessonPlanWhatsApp(currentEditorPlan, pName);
    navigator.clipboard.writeText(msg);
    setEditorCopiedSuccess(true);
    setTimeout(() => setEditorCopiedSuccess(false), 3000);
  };

  // Real-time preview for editor
  const editorPreviewPlan = {
    title: planTitle,
    date: planDate,
    content: planContent,
    islamicPrep: islamicPrep,
    resources: resources.filter(r => r.name && r.url)
  };
  const selectedGroupInEditor = groups.find(g => g.id === targetGroupId) || accessibleGroups.find(g => g.id === targetGroupId);
  const previewPatrolName = selectedGroupInEditor?.name ? `${selectedGroupInEditor.name} Patrol` : '';
  const editorWhatsAppMsg = formatKashafLessonPlanWhatsApp(editorPreviewPlan, previewPatrolName);

  return (
    <div className="space-y-5">
      {/* ── HEADER PANEL WITH PATROL SELECTOR ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <BookOpen size={140} className="text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles size={11} /> KashafVoice v4.0
              </span>

              {activePatrol && (
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Users size={11} /> {activePatrol.name} Patrol
                </span>
              )}

              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Lock size={10} /> Leaders & Assistants Only
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <BookOpen className="text-emerald-400 shrink-0" size={24} />
              <span>Patrol Lesson Plans & Weekly Agendas</span>
            </h2>
            
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Each patrol maintains its own exclusive lesson plans, co-created and edited by the patrol leader and assistant leaders.
            </p>
          </div>

          {/* Patrol Switcher & Create Plan Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Patrol Selector Dropdown */}
            {(isOwner || accessibleGroups.length > 1) && (
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 p-1.5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 pl-1.5 flex items-center gap-1">
                  <Filter size={12} className="text-emerald-400" />
                  <span>Patrol:</span>
                </span>
                <select
                  value={selectedPatrolId}
                  onChange={(e) => setSelectedPatrolId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  {isOwner && <option value="all">🌐 All Patrols (Troop Overview)</option>}
                  {accessibleGroups.map(g => (
                    <option key={g.id} value={g.id}>👥 {g.name} Patrol</option>
                  ))}
                </select>
              </div>
            )}

            {isLeaderOrOwner && !isEditing && (
              <button
                onClick={handleOpenNewEditor}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <Plus size={15} />
                <span>New Lesson Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* ── PATROL CO-LEADERSHIP ROSTER BAR ── */}
        {activePatrol && activePatrolLeadership.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-300 flex-wrap">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
              <Crown size={14} className="text-amber-400" />
              <span>{activePatrol.name} Patrol Leadership:</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {activePatrolLeadership.map(ldr => {
                const isAssistant = ldr.leaderPosition?.toLowerCase().includes('assistant') || ldr.role === 'assistant_leader';
                return (
                  <span 
                    key={ldr.uid} 
                    className="bg-slate-900/90 border border-slate-700/80 text-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 shadow-xs"
                  >
                    {isAssistant ? (
                      <UserCheck size={12} className="text-sky-400" />
                    ) : (
                      <Shield size={12} className="text-emerald-400" />
                    )}
                    <span className="font-bold text-white">{ldr.fullName || ldr.username}</span>
                    <span className="text-[9px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                      {ldr.leaderPosition || (isAssistant ? 'Assistant Leader' : 'Patrol Leader')}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      {isEditing ? (
        /* ── EDIT OR CREATE LESSON PLAN UI ── */
        <div className="bg-slate-900 border border-slate-750 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {editingId ? 'Edit & Collaborate on Patrol Lesson Plan' : 'Create New Patrol Lesson Plan'}
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Lock size={11} /> Shared exclusively among the leaders and assistant leaders of this patrol.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <form onSubmit={handleSavePlan} className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Patrol Target Selector */}
                <div className="sm:col-span-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Users size={13} className="text-emerald-400" />
                    <span>Target Patrol (Exclusive Ownership) *</span>
                  </label>
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                  >
                    {accessibleGroups.map(g => (
                      <option key={g.id} value={g.id}>
                        🏕️ {g.name} Patrol (Shared with {g.name} Leaders & Assistants)
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Only assigned leaders and assistant leaders of this patrol will be able to view and modify this plan.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Lesson Plan Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Week 1: Knots, Hitches, & Shia Akhlaq"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-emerald-400" /> Meeting Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Scouting Objectives & Patrol Activities
                </label>
                <textarea
                  rows={4}
                  placeholder="List the scouting rank requirements, knots, first aid drills, and patrol activities scheduled..."
                  value={planContent}
                  onChange={(e) => setPlanContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              {/* Shia Islamic Preparation section */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-black text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  🕌 Shia Islamic Preparation (Tarbiyah / Akhlāq)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter Hadiths from Ahlul Bayt (A.S.), Quranic reflection, Karbala heroes connection, or moral lesson..."
                  value={islamicPrep}
                  onChange={(e) => setIslamicPrep(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              {/* Resource Links */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Resource Materials & Reference Links
                  </label>
                  <button
                    type="button"
                    onClick={handleAddResourceRow}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {resources.map((res, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Label (e.g. Knot Guide PDF)"
                        value={res.name}
                        onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="url"
                        placeholder="URL (https://...)"
                        value={res.url}
                        onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      {resources.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResourceRow(index)}
                          className="text-red-400 hover:text-red-300 transition cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-bold">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                >
                  <Save size={15} />
                  <span>{editingId ? 'Save & Sync with Patrol Leadership' : 'Publish to Patrol Leadership'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold py-3 px-5 rounded-2xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Live WhatsApp KashafVoice Preview Column */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-emerald-500/30 rounded-3xl p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      📱
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-emerald-400">Live WhatsApp Summary</h4>
                      <p className="text-[10px] text-slate-400">
                        {previewPatrolName ? `Scoped to ${previewPatrolName}` : 'KashafVoice v4.0'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEditorWhatsAppMsg}
                    className="text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 font-bold shadow-sm"
                  >
                    {editorCopiedSuccess ? <Check size={12} className="text-emerald-200" /> : <Copy size={12} />}
                    <span>{editorCopiedSuccess ? 'Copied!' : 'Copy Msg'}</span>
                  </button>
                </div>

                {/* Stylized WhatsApp Chat Bubble */}
                <div className="bg-[#0b141a] border border-[#222e35] rounded-2xl p-4 text-xs text-[#e9edef] font-sans leading-relaxed whitespace-pre-wrap max-h-[440px] overflow-y-auto shadow-inner">
                  {editorWhatsAppMsg}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Auto-includes greetings, bullets & transliteration</span>
                <span className="text-emerald-400 font-bold">⚜️ {previewPatrolName || 'Patrol Plan'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── PLAN LISTING & DETAIL SPLIT VIEW ── */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Left panel: Patrol Plan List */}
          <div className="bg-slate-900 border border-slate-750 rounded-3xl p-4 shadow-xl space-y-4 md:col-span-5 lg:col-span-4 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search plans by title, date, topic, leader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Patrol Scope Header */}
              <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Users size={12} className="text-emerald-400" />
                  <span>{activePatrol ? `${activePatrol.name} Patrol Plans` : 'All Available Plans'}</span>
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                  {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
                </span>
              </div>

              {/* Plans List */}
              {loading ? (
                <div className="text-center py-10 text-slate-500 text-xs">Loading patrol lesson plans...</div>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <p>No lesson plans created for this patrol yet.</p>
                  <p className="text-[11px] text-slate-500">Patrol leaders and assistants can create and collaborate on plans here.</p>
                  <button
                    onClick={handleOpenNewEditor}
                    className="mt-2 text-emerald-400 hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Create First Patrol Plan
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                  {filteredPlans.map(p => {
                    const isSelected = selectedPlan?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlan(p)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition flex flex-col gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500 shadow-lg ring-1 ring-emerald-500/40'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border bg-sky-950/80 text-sky-300 border-sky-500/40 flex items-center gap-1">
                            <Users size={10} /> {p.patrolName || 'Patrol Plan'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock size={10} className="text-emerald-400" /> {p.date}
                          </span>
                        </div>

                        <span className="font-extrabold text-xs text-white line-clamp-1">{p.title}</span>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span className="truncate">
                            By: <strong>{p.authorName || 'Patrol Leader'}</strong>
                          </span>
                          {p.islamicPrep && (
                            <span className="text-emerald-400 font-semibold shrink-0">
                              🕌 Akhlāq
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{filteredPlans.length} plans available</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Lock size={11} /> Patrol Exclusive
              </span>
            </div>
          </div>

          {/* Right panel: Plan Details + KashafVoice WhatsApp Messenger */}
          <div className="bg-slate-900 border border-slate-750 rounded-3xl p-5 sm:p-6 shadow-xl md:col-span-7 lg:col-span-8 min-h-[500px]">
            {selectedPlan ? (
              <div className="space-y-6">
                
                {/* Header of selected plan */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-sky-950 text-sky-300 border-sky-500/60 flex items-center gap-1">
                        <Users size={11} /> {selectedPlan.patrolName || 'Patrol Lesson Plan'}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <Calendar size={13} /> {selectedPlan.date}
                      </span>
                    </div>

                    <h3 className="font-black text-white text-lg sm:text-xl leading-tight">
                      {selectedPlan.title}
                    </h3>

                    {/* Attribution & Co-Leader Collaboration Details */}
                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap pt-0.5">
                      <span>Created by: <strong className="text-slate-200">{selectedPlan.authorName || 'Patrol Leader'}</strong> ({selectedPlan.authorRole || 'Leader'})</span>
                      {selectedPlan.updatedByName && selectedPlan.updatedByName !== selectedPlan.authorName && (
                        <span>&bull; Last edited by: <strong className="text-slate-200">{selectedPlan.updatedByName}</strong> ({selectedPlan.updatedByRole || 'Leader'})</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons (Strictly if user has edit rights on this patrol) */}
                  {canEditSelectedPlan && (
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => handleDuplicatePlan(selectedPlan)}
                        className="bg-slate-800 hover:bg-slate-750 text-sky-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-sky-500/30 flex items-center gap-1.5 shadow-sm"
                        title="Duplicate plan for your patrol"
                      >
                        <CopyPlus size={14} />
                        <span>Duplicate</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditEditor(selectedPlan)}
                        className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-emerald-500/50 flex items-center gap-1.5 shadow-sm"
                        title="Edit and collaborate on plan"
                      >
                        <Edit3 size={14} />
                        <span>Edit Plan</span>
                      </button>

                      <button
                        onClick={() => handleDeletePlan(selectedPlan.id)}
                        className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 p-2 rounded-xl transition cursor-pointer border border-rose-900/40"
                        title="Delete plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Shared Patrol Co-Leadership Indicator Banner */}
                <div className="bg-sky-950/40 border border-sky-500/30 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-sky-200">
                  <Users size={16} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">
                      👥 Exclusive {selectedPlan.patrolName || 'Patrol'} Co-Leadership Access
                    </strong>
                    <p className="text-[11px] text-sky-300/90 mt-0.5 leading-relaxed">
                      Only leaders and assistant leaders assigned to <strong>{selectedPlan.patrolName || 'this patrol'}</strong> share editing access to collaborate on and dispatch this lesson plan.
                    </p>
                  </div>
                </div>

                {/* ── KASHAFVOICE V4.0 WHATSAPP PARENT MESSENGER CARD ── */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-5 shadow-xl space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-md">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <span>WhatsApp Parent Messenger</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                            KashafVoice v4.0
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">Faith-rooted briefing ready to send to {selectedPlan.patrolName || 'patrol'} parents.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleCopyWhatsAppMsg(customWhatsAppMsg)}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        {copiedSuccess ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedSuccess ? 'Copied!' : 'Copy Text'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(customWhatsAppMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/50"
                      >
                        <Send size={13} />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Message Editor / Preview */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Live Message Preview (Editable):</span>
                      <button
                        onClick={() => {
                          const pName = selectedPlan.patrolName || (activePatrol?.name ? `${activePatrol.name} Patrol` : '');
                          setCustomWhatsAppMsg(formatKashafLessonPlanWhatsApp(selectedPlan, pName));
                        }}
                        className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                      >
                        <Sparkles size={11} /> Reset to Default Template
                      </button>
                    </div>

                    <textarea
                      rows={10}
                      value={customWhatsAppMsg}
                      onChange={(e) => setCustomWhatsAppMsg(e.target.value)}
                      className="w-full bg-[#0b141a] border border-[#222e35] text-[#e9edef] rounded-2xl p-4 text-xs font-sans leading-relaxed focus:outline-none focus:border-emerald-500 shadow-inner"
                    />
                  </div>
                </div>

                {/* Scouting Content Details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Scouting Objectives & Activities
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    {selectedPlan.content || 'No scouting details recorded for this meeting.'}
                  </p>
                </div>

                {/* Islamic Prep Detail */}
                {selectedPlan.islamicPrep && (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      🕌 Shia Islamic Preparation (Akhlāq / Tarbiyah)
                    </h4>
                    <p className="text-xs text-emerald-100 leading-relaxed whitespace-pre-wrap font-sans italic">
                      "{applyIslamicTransliteration(selectedPlan.islamicPrep)}"
                    </p>
                  </div>
                )}

                {/* Resources Links Grid */}
                {selectedPlan.resources && selectedPlan.resources.length > 0 && (
                  <div className="space-y-2 border-t border-slate-800 pt-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Session Resources & Curriculum Files
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                      {selectedPlan.resources.map((res, index) => (
                        <a
                          key={index}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl transition flex items-center justify-between text-xs text-slate-200 cursor-pointer"
                        >
                          <span className="font-bold flex items-center gap-2 text-xs line-clamp-1">
                            <FileText size={13} className="text-emerald-400 shrink-0" />
                            {res.name}
                          </span>
                          <LinkIcon size={12} className="text-slate-400 shrink-0 ml-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaborators History Log */}
                {Array.isArray(selectedPlan.collaborators) && selectedPlan.collaborators.length > 0 && (
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                      <UserCheck size={12} className="text-emerald-400" />
                      <span>Patrol Leadership Contributors</span>
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedPlan.collaborators.map((c, idx) => (
                        <span key={idx} className="bg-slate-900 border border-slate-750 px-2.5 py-1 rounded-xl text-[11px] text-slate-300 flex items-center gap-1">
                          <strong className="text-white">{c.name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">({c.role || 'Leader'})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 h-full py-20 space-y-3">
                <FileText size={52} className="opacity-20" />
                <p className="text-xs italic text-slate-400">Select a lesson plan from the sidebar to view details and collaborate.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
