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
  UserCheck
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
  const [patrolFilter, setPatrolFilter] = useState('all'); // 'all' | 'my_patrol' | 'troop_wide' | specificGroupId

  // Leader Patrol Resolution
  const leaderPatrolId = currentUser?.groupId || currentUser?.patrolId || currentUser?.assignedPatrol;
  const myGroup = useMemo(() => {
    return groups.find(g => 
      g.id === leaderPatrolId || 
      g.name === leaderPatrolId || 
      (currentUser?.assignedPatrol && (g.name === currentUser.assignedPatrol || g.id === currentUser.assignedPatrol)) ||
      (currentUser?.patrol && (g.name === currentUser.patrol || g.id === currentUser.patrol))
    );
  }, [groups, leaderPatrolId, currentUser?.assignedPatrol, currentUser?.patrol]);

  // Fellow leaders of the same patrol
  const fellowPatrolLeaders = useMemo(() => {
    if (!myGroup) return [];
    return users.filter(u => 
      u.role === 'leader' && (
        u.groupId === myGroup.id || 
        u.patrolId === myGroup.id || 
        u.assignedPatrol === myGroup.name ||
        u.patrol === myGroup.name ||
        (Array.isArray(u.assignedPatrols) && u.assignedPatrols.includes(myGroup.id))
      )
    );
  }, [users, myGroup]);

  // Editor panel states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means new plan
  const [targetGroupId, setTargetGroupId] = useState(myGroup?.id || 'all');
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [planTitle, setPlanTitle] = useState('');
  const [planContent, setPlanContent] = useState('');
  const [islamicPrep, setIslamicPrep] = useState('');
  const [resources, setResources] = useState([{ name: '', url: '' }]);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [editorCopiedSuccess, setEditorCopiedSuccess] = useState(false);

  // Status messages
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
      
      // Auto-select first plan if none selected
      if (list.length > 0 && !selectedPlan && !isEditing) {
        setSelectedPlan(list[0]);
      }
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

  // 3. Subscribe to Users for Leader Roster Resolution
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    return () => unsubUsers();
  }, []);

  // Scoped Plans: Shared among leaders of the same patrol + Troop-wide
  const scopedPlans = useMemo(() => {
    return plans.filter(p => {
      // If Executive/Troop-wide authority: can see everything
      if (isExecutive) return true;

      // Check if plan belongs to leader's patrol
      const isMyPatrol = myGroup && (
        p.targetGroupId === myGroup.id || 
        p.groupId === myGroup.id || 
        p.patrolId === myGroup.id || 
        p.patrolName === myGroup.name ||
        p.authorPatrolId === myGroup.id
      );

      // Check if troop-wide / all patrols
      const isTroopWide = p.targetGroupId === 'all' || p.groupId === 'all' || p.patrolId === 'all' || p.scope === 'all' || (!p.targetGroupId && !p.groupId && !p.patrolId);

      // Check if created or updated by this leader
      const isAuthor = p.authorId === currentUser?.uid || p.updatedBy === currentUser?.uid;

      return isMyPatrol || isTroopWide || isAuthor;
    });
  }, [plans, isExecutive, myGroup, currentUser?.uid]);

  // Filtered Plans by Search & Patrol Filter Tab
  const filteredPlans = useMemo(() => {
    return scopedPlans.filter(p => {
      // 1. Patrol Filter Tab
      if (patrolFilter === 'my_patrol' && myGroup) {
        const isMyPatrol = (
          p.targetGroupId === myGroup.id || 
          p.groupId === myGroup.id || 
          p.patrolId === myGroup.id || 
          p.patrolName === myGroup.name ||
          p.authorPatrolId === myGroup.id
        );
        if (!isMyPatrol) return false;
      } else if (patrolFilter === 'troop_wide') {
        const isTroopWide = p.targetGroupId === 'all' || p.groupId === 'all' || p.patrolId === 'all' || p.scope === 'all' || (!p.targetGroupId && !p.groupId && !p.patrolId);
        if (!isTroopWide) return false;
      } else if (patrolFilter !== 'all') {
        if (p.targetGroupId !== patrolFilter && p.groupId !== patrolFilter && p.patrolId !== patrolFilter) return false;
      }

      // 2. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchDate = (p.date || '').includes(q);
        const matchContent = (p.content || '').toLowerCase().includes(q);
        const matchIslamic = (p.islamicPrep || '').toLowerCase().includes(q);
        const matchAuthor = (p.authorName || p.updatedByName || '').toLowerCase().includes(q);
        const matchPatrol = (p.patrolName || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDate && !matchContent && !matchIslamic && !matchAuthor && !matchPatrol) return false;
      }

      return true;
    });
  }, [scopedPlans, patrolFilter, myGroup, searchTerm]);

  // Update customized WhatsApp message whenever selected plan changes
  useEffect(() => {
    if (selectedPlan) {
      const pName = selectedPlan.patrolName || (selectedPlan.targetGroupId !== 'all' ? groups.find(g => g.id === selectedPlan.targetGroupId)?.name : '') || (myGroup?.name ? `${myGroup.name} Patrol` : '');
      setCustomWhatsAppMsg(formatKashafLessonPlanWhatsApp(selectedPlan, pName));
    }
  }, [selectedPlan, groups, myGroup]);

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
    setEditingId(null);
    setTargetGroupId(myGroup?.id || 'all');
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
    setTargetGroupId(plan.targetGroupId || plan.groupId || plan.patrolId || (myGroup?.id || 'all'));
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
    setTargetGroupId(myGroup?.id || plan.targetGroupId || 'all');
    setPlanDate(new Date().toISOString().split('T')[0]);
    setPlanTitle(`Copy of ${plan.title || 'Lesson Plan'}`);
    setPlanContent(plan.content || '');
    setIslamicPrep(plan.islamicPrep || '');
    setResources(plan.resources && plan.resources.length > 0 ? [...plan.resources] : [{ name: '', url: '' }]);
    setErrorMsg('');
    setSuccessMsg('Cloned plan! You can now customize and save it for your patrol leaders.');
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

    // Filter out incomplete resources
    const cleanResources = resources.filter(r => r.name.trim() && r.url.trim());

    const selectedGroup = groups.find(g => g.id === targetGroupId);
    const resolvedPatrolName = targetGroupId === 'all' 
      ? 'All Patrols (Troop-wide)' 
      : (selectedGroup?.name ? `${selectedGroup.name} Patrol` : (myGroup?.name ? `${myGroup.name} Patrol` : 'Patrol'));

    const existingPlan = editingId ? plans.find(p => p.id === editingId) : null;
    const existingCollaborators = Array.isArray(existingPlan?.collaborators) ? existingPlan.collaborators : [];

    // Append / update current leader in collaborators array
    const updatedCollaborators = [
      ...existingCollaborators.filter(c => c.uid !== currentUser?.uid),
      {
        uid: currentUser?.uid || 'leader',
        name: currentUser?.fullName || currentUser?.username || 'Troop Leader',
        role: currentUser?.leaderPosition || currentUser?.role || 'Leader',
        modifiedAt: new Date().toISOString()
      }
    ];

    const planData = {
      title: planTitle.trim(),
      date: planDate,
      content: planContent.trim(),
      islamicPrep: islamicPrep.trim(),
      resources: cleanResources,
      targetGroupId: targetGroupId || 'all',
      groupId: targetGroupId || 'all',
      patrolId: targetGroupId || 'all',
      patrolName: resolvedPatrolName,
      scope: targetGroupId === 'all' ? 'all' : 'patrol',
      authorId: existingPlan?.authorId || currentUser?.uid || 'leader',
      authorName: existingPlan?.authorName || currentUser?.fullName || currentUser?.username || 'Troop Leader',
      authorRole: existingPlan?.authorRole || currentUser?.leaderPosition || currentUser?.role || 'Leader',
      authorPatrolId: existingPlan?.authorPatrolId || myGroup?.id || null,
      authorPatrolName: existingPlan?.authorPatrolName || myGroup?.name || 'Troop 1318',
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedBy: currentUser?.uid || 'leader',
      updatedByName: currentUser?.fullName || currentUser?.username || 'Troop Leader',
      updatedByRole: currentUser?.leaderPosition || currentUser?.role || 'Leader',
      updatedAt: serverTimestamp(),
      sharedWithPatrol: true,
      collaborators: updatedCollaborators
    };

    try {
      const docId = editingId || `plan_${Date.now()}`;
      await setDoc(doc(db, 'lesson_plans', docId), planData, { merge: true });
      
      setSuccessMsg(editingId ? "Lesson plan updated and shared with patrol leaders!" : "New lesson plan published and shared with patrol leaders!");
      setTimeout(() => {
        setIsEditing(false);
        setEditingId(null);
        setSelectedPlan({ id: docId, ...planData });
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save plan: " + err.message);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this lesson plan? This will remove it for all leaders.")) return;
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
    const selectedGroup = groups.find(g => g.id === targetGroupId);
    const pName = targetGroupId === 'all' ? '' : (selectedGroup?.name ? `${selectedGroup.name} Patrol` : '');
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
  const selectedGroupInEditor = groups.find(g => g.id === targetGroupId);
  const previewPatrolName = targetGroupId === 'all' ? '' : (selectedGroupInEditor?.name ? `${selectedGroupInEditor.name} Patrol` : '');
  const editorWhatsAppMsg = formatKashafLessonPlanWhatsApp(editorPreviewPlan, previewPatrolName);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-700 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <BookOpen size={140} className="text-emerald-400" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} /> KashafVoice v4.0 Enabled
              </span>
              {myGroup && (
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Users size={12} /> {myGroup.name} Patrol
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              <BookOpen className="text-emerald-400 shrink-0" size={26} />
              <span>Patrol Lesson Planning & Shared Curriculum</span>
            </h2>
            <p className="text-xs text-slate-350 mt-1.5 leading-relaxed max-w-2xl">
              Collaboratively design weekly scouting agendas, align tarbiyah milestones, and share formatted WhatsApp briefings directly among all leaders of your patrol.
            </p>
          </div>

          {isLeaderOrOwner && !isEditing && (
            <button
              onClick={handleOpenNewEditor}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <Plus size={16} />
              <span>Create Lesson Plan</span>
            </button>
          )}
        </div>

        {/* Patrol Co-Leadership Banner */}
        {myGroup && fellowPatrolLeaders.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Users size={13} /> {myGroup.name} Patrol Leadership Team:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {fellowPatrolLeaders.map(ldr => (
                <span 
                  key={ldr.uid} 
                  className="bg-slate-900/90 border border-slate-700/80 text-slate-200 px-2.5 py-0.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                >
                  <UserCheck size={11} className="text-emerald-400" />
                  <span>{ldr.fullName || ldr.username}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({ldr.leaderPosition || 'Leader'})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditing ? (
        /* Edit or New Plan Creator UI */
        <div className="bg-slate-900 border border-slate-750 rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {editingId ? 'Edit & Collaborate on Lesson Plan' : 'Create New Patrol Lesson Plan'}
                </h3>
                <p className="text-[11px] text-emerald-400">
                  ✓ This lesson plan will automatically sync and be shared among all leaders of the selected patrol.
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
                    <span>Shared Patrol Audience *</span>
                  </label>
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
                  >
                    <option value="all">⚜️ Troop-Wide (Shared with All Troop Leaders)</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>
                        🏕️ {g.name} Patrol (Shared with all {g.name} Leaders)
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400">
                    {targetGroupId === 'all' 
                      ? 'Visible to and editable by all troop leaders.' 
                      : `Shared with all leaders assigned to ${groups.find(g => g.id === targetGroupId)?.name || 'this'} Patrol.`}
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

              {/* Weekly Resource Links */}
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
                  <span>{editingId ? 'Save & Sync with Patrol Leaders' : 'Publish & Share with Patrol Leaders'}</span>
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
                        {previewPatrolName ? `Scoped to ${previewPatrolName}` : 'KashafVoice v4.0 Standard'}
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
                <span className="text-emerald-400 font-bold">⚜️ {previewPatrolName || 'Dhulfiqār Troop 313'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Plan Listing & Detail Layout */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left panel: Plan list & Patrol Filter */}
          <div className="bg-slate-900 border border-slate-750 rounded-3xl p-4 shadow-xl space-y-4 md:col-span-5 lg:col-span-4 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search plans by title, date, topic, or leader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Patrol Scope Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPatrolFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer text-[11px] ${
                    patrolFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Plans ({scopedPlans.length})
                </button>

                {myGroup && (
                  <button
                    type="button"
                    onClick={() => setPatrolFilter('my_patrol')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer text-[11px] flex items-center gap-1 ${
                      patrolFilter === 'my_patrol'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Users size={11} />
                    <span>My Patrol ({scopedPlans.filter(p => p.targetGroupId === myGroup.id || p.groupId === myGroup.id || p.patrolName === myGroup.name || p.authorPatrolId === myGroup.id).length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPatrolFilter('troop_wide')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer text-[11px] ${
                    patrolFilter === 'troop_wide'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Troop-Wide
                </button>
              </div>

              {/* Plans List */}
              {loading ? (
                <div className="text-center py-10 text-slate-500 text-xs">Loading shared lesson plans...</div>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs italic bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                  <p>No lesson plans found matching this filter.</p>
                  <button
                    onClick={handleOpenNewEditor}
                    className="mt-3 text-emerald-400 hover:underline font-bold text-xs inline-flex items-center gap-1"
                  >
                    <Plus size={13} /> Create the first plan
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                  {filteredPlans.map(p => {
                    const isSelected = selectedPlan?.id === p.id;
                    const isTroopWide = p.targetGroupId === 'all' || p.groupId === 'all' || p.scope === 'all' || (!p.targetGroupId && !p.groupId);
                    const pName = p.patrolName || (isTroopWide ? 'Troop-wide' : 'Patrol Plan');

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
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                            isTroopWide
                              ? 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                              : 'bg-sky-950/70 text-sky-300 border-sky-500/40'
                          }`}>
                            {pName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock size={10} className="text-emerald-400" /> {p.date}
                          </span>
                        </div>

                        <span className="font-extrabold text-xs text-white line-clamp-1">{p.title}</span>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span className="truncate">
                            By: <strong>{p.authorName || p.updatedByName || 'Leader'}</strong>
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
              <span className="text-emerald-400 font-bold">👥 Shared with Patrol Leaders</span>
            </div>
          </div>

          {/* Right panel: Plan details + KashafVoice WhatsApp Messenger */}
          <div className="bg-slate-900 border border-slate-750 rounded-3xl p-6 shadow-xl md:col-span-7 lg:col-span-8 min-h-[500px]">
            {selectedPlan ? (
              <div className="space-y-6">
                {/* Header of selected plan */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        selectedPlan.targetGroupId === 'all' || selectedPlan.scope === 'all' || (!selectedPlan.targetGroupId && !selectedPlan.groupId)
                          ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                          : 'bg-sky-950 text-sky-300 border-sky-500/60'
                      }`}>
                        {selectedPlan.patrolName || (selectedPlan.targetGroupId === 'all' ? '⚜️ Troop-Wide Plan' : '🏕️ Patrol Plan')}
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
                      <span>Created by: <strong className="text-slate-200">{selectedPlan.authorName || 'Troop Leader'}</strong> ({selectedPlan.authorRole || 'Leader'})</span>
                      {selectedPlan.updatedByName && selectedPlan.updatedByName !== selectedPlan.authorName && (
                        <span>&bull; Last edited by: <strong className="text-slate-200">{selectedPlan.updatedByName}</strong></span>
                      )}
                    </div>
                  </div>

                  {isLeaderOrOwner && (
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => handleDuplicatePlan(selectedPlan)}
                        className="bg-slate-800 hover:bg-slate-750 text-sky-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-sky-500/30 flex items-center gap-1.5 shadow-sm"
                        title="Duplicate and branch this plan for your patrol"
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
                      👥 Shared Patrol Collaboration Enabled
                    </strong>
                    <p className="text-[11px] text-sky-300/90 mt-0.5 leading-relaxed">
                      All leaders assigned to <strong>{selectedPlan.patrolName || (myGroup?.name ? `${myGroup.name} Patrol` : 'this patrol')}</strong> have collaborative access to view, update, and dispatch this lesson plan to parents.
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
                        <p className="text-[11px] text-slate-400">Faith-rooted, warm WhatsApp message ready to send to patrol parents.</p>
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
                          const pName = selectedPlan.patrolName || (selectedPlan.targetGroupId !== 'all' ? groups.find(g => g.id === selectedPlan.targetGroupId)?.name : '') || (myGroup?.name ? `${myGroup.name} Patrol` : '');
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

                {/* Scouting Content details */}
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
