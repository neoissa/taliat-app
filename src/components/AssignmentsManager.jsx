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
  Sparkles
} from 'lucide-react';

export default function AssignmentsManager({ currentUser, scoutId: propScoutId, isEmbeddedInProfile = false }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || isOwner;
  const isScout = !isLeader;

  const targetScoutId = propScoutId || currentUser?.uid;

  const [assignments, setAssignments] = useState([]);
  const [scoutProgress, setScoutProgress] = useState({}); // { [assignmentId]: { completed: boolean, date: string } }
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'pending' | 'completed' | 'video' | 'document'

  // Leader Creation State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('video'); // 'video' | 'document' | 'reading' | 'practical'
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTarget, setAssignedTarget] = useState('all'); // 'all' | 'patrol' | 'scout'
  const [targetGroupId, setTargetGroupId] = useState('');
  const [targetScoutUid, setTargetScoutUid] = useState('');
  const [groups, setGroups] = useState([]);
  const [scoutsList, setScoutsList] = useState([]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // 1. Subscribe to assignments collection
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

  // 2. Subscribe to scout's completion progress
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

  // 3. Load groups and scouts for Leader assignment options
  useEffect(() => {
    if (isLeader) {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
        setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
      });
      const unsubScouts = onSnapshot(query(collection(db, 'users'), where('role', '==', 'scout')), (snap) => {
        setScoutsList(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      });
      return () => {
        unsubGroups();
        unsubScouts();
      };
    }
  }, [isLeader]);

  // Toggle completion handler for scout
  const handleToggleComplete = async (assignmentId) => {
    if (!targetScoutId) return;
    const current = scoutProgress[assignmentId] || {};
    const newCompleted = !current.completed;
    const dateVal = new Date().toISOString().split('T')[0];

    // Optimistic UI update
    setScoutProgress(prev => ({
      ...prev,
      [assignmentId]: {
        completed: newCompleted,
        completedDate: newCompleted ? dateVal : '',
        updatedAt: new Date().toISOString()
      }
    }));

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'assignments', assignmentId);
      await setDoc(docRef, {
        completed: newCompleted,
        completedDate: newCompleted ? dateVal : '',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to update assignment completion:", err);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setType('video');
    setLink('');
    setDescription('');
    setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 1 week ahead default
    setAssignedTarget('all');
    setTargetGroupId('');
    setTargetScoutUid('');
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (assign) => {
    setEditingId(assign.id);
    setTitle(assign.title || '');
    setType(assign.type || 'video');
    setLink(assign.link || '');
    setDescription(assign.description || '');
    setDueDate(assign.dueDate || '');
    setAssignedTarget(assign.assignedTarget || 'all');
    setTargetGroupId(assign.targetGroupId || '');
    setTargetScoutUid(assign.targetScoutUid || '');
    setError('');
    setMsg('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!title.trim()) {
      setError("Assignment title is required.");
      return;
    }

    setSaving(true);
    const data = {
      title: title.trim(),
      type,
      link: link.trim(),
      description: description.trim(),
      dueDate: dueDate || '',
      assignedTarget,
      targetGroupId: assignedTarget === 'patrol' ? targetGroupId : null,
      targetScoutUid: assignedTarget === 'scout' ? targetScoutUid : null,
      createdBy: currentUser?.uid || '',
      createdByName: currentUser?.fullName || currentUser?.username || 'Leader',
      updatedAt: serverTimestamp()
    };

    try {
      const docId = editingId || `assign_${Date.now()}`;
      await setDoc(doc(db, 'assignments', docId), data, { merge: true });
      setMsg(editingId ? "Homework updated successfully!" : "Homework assigned to scouts!");
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
      }, 1200);
    } catch (err) {
      console.error("Failed to save assignment:", err);
      setError("Error saving assignment: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteDoc(doc(db, 'assignments', id));
    } catch (err) {
      alert("Failed to delete assignment: " + err.message);
    }
  };

  // Filter assignments visible to this scout
  const visibleAssignments = assignments.filter(a => {
    if (isLeader) return true;
    if (a.assignedTarget === 'all') return true;
    if (a.assignedTarget === 'patrol' && currentUser?.groupId === a.targetGroupId) return true;
    if (a.assignedTarget === 'scout' && targetScoutId === a.targetScoutUid) return true;
    return false;
  });

  // Filtered by UI category
  const filteredList = visibleAssignments.filter(a => {
    const isComp = !!scoutProgress[a.id]?.completed;
    if (filterType === 'pending') return !isComp;
    if (filterType === 'completed') return isComp;
    if (filterType === 'video') return a.type === 'video';
    if (filterType === 'document') return a.type === 'document';
    return true;
  });

  const totalAssigned = visibleAssignments.length;
  const totalCompleted = visibleAssignments.filter(a => !!scoutProgress[a.id]?.completed).length;
  const pendingCount = totalAssigned - totalCompleted;

  // Due calculation helper
  const getDueStatus = (dueDateStr, isCompleted) => {
    if (isCompleted) return { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (!dueDateStr) return { label: 'No Due Date', color: 'text-slate-400 bg-slate-800 border-slate-700' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-red-400 bg-red-950/40 border-red-500/40 font-bold' };
    }
    if (diffDays === 0) {
      return { label: 'Due Today!', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40 font-black animate-pulse' };
    }
    if (diffDays === 1) {
      return { label: 'Due Tomorrow', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40 font-bold' };
    }
    return { label: `Due in ${diffDays} days`, color: 'text-sky-300 bg-sky-950/40 border-sky-500/30' };
  };

  return (
    <div className="space-y-5">
      {/* Header & Stats Banner */}
      <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isEmbeddedInProfile ? 'border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/20' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            🎒
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white text-base">
                {isScout ? 'My Homework & Assigned Tasks' : 'Homework & Task Assignments'}
              </h3>
              {pendingCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={11} /> {pendingCount} Due
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isScout 
                ? 'Watch required videos, study documents, and complete scouting assignments on time.' 
                : 'Assign homework videos, worksheets, and study packets to your scouts or patrols.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress summary for scout */}
          {totalAssigned > 0 && (
            <div className="bg-slate-900/80 border border-slate-750 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Completion</span>
              <strong className="text-sm font-extrabold text-emerald-400">{totalCompleted}/{totalAssigned}</strong>
            </div>
          )}

          {isLeader && !showForm && (
            <button
              onClick={handleOpenNew}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <Plus size={15} /> Assign Homework
            </button>
          )}
        </div>
      </div>

      {/* Leader Assignment Form */}
      {showForm && isLeader && (
        <div className="bg-slate-800 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{editingId ? 'Edit Homework Assignment' : 'Create New Homework Assignment'}</span>
            </h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
          {msg && <p className="text-xs text-emerald-400 font-semibold">{msg}</p>}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Watch Youth Safeguarding Part 1 Video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={12} className="text-emerald-400" /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Assignment Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="video">🎥 Video to Watch</option>
                  <option value="document">📄 Document / Worksheet to Complete</option>
                  <option value="reading">📖 Reading & Study Packet</option>
                  <option value="practical">🎯 Practical Scouting Drill</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <ExternalLink size={12} /> Video / Document Link (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/... or https://drive.google.com/..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Instructions & Details for Scouts
              </label>
              <textarea
                rows={3}
                placeholder="Explain what the scout needs to do, what to pay attention to, and what questions to answer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Target Assignment selector */}
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-750 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase">
                Who is this assigned to?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="assignedTarget"
                    value="all"
                    checked={assignedTarget === 'all'}
                    onChange={() => setAssignedTarget('all')}
                  />
                  <span>All Scouts in Troop</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="assignedTarget"
                    value="patrol"
                    checked={assignedTarget === 'patrol'}
                    onChange={() => setAssignedTarget('patrol')}
                  />
                  <span>Specific Patrol</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="assignedTarget"
                    value="scout"
                    checked={assignedTarget === 'scout'}
                    onChange={() => setAssignedTarget('scout')}
                  />
                  <span>Specific Scout</span>
                </label>
              </div>

              {assignedTarget === 'patrol' && (
                <div>
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Scout...</option>
                    {scoutsList.map(s => (
                      <option key={s.uid} value={s.uid}>{s.fullName || s.username} ({s.rank || 'Scout'})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-750">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save & Assign Homework'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Tasks', count: totalAssigned },
          { id: 'pending', label: 'Due / Pending', count: pendingCount },
          { id: 'completed', label: 'Completed', count: totalCompleted },
          { id: 'video', label: '🎥 Videos', count: visibleAssignments.filter(a => a.type === 'video').length },
          { id: 'document', label: '📄 Documents', count: visibleAssignments.filter(a => a.type === 'document').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterType === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs">Loading homework tasks...</div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-10 bg-slate-800/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No homework assignments matching this filter.
          </div>
        ) : (
          filteredList.map((assign) => {
            const isCompleted = !!scoutProgress[assign.id]?.completed;
            const completedDate = scoutProgress[assign.id]?.completedDate;
            const dueStatus = getDueStatus(assign.dueDate, isCompleted);

            return (
              <div
                key={assign.id}
                className={`bg-slate-800/90 border rounded-2xl p-4.5 transition space-y-3 shadow-sm ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-slate-700 hover:border-slate-650'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Completion Toggle button */}
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(assign.id)}
                      className="shrink-0 p-1 hover:scale-110 transition cursor-pointer rounded-full focus:outline-none mt-0.5"
                      title={isCompleted ? 'Marked as Completed! (Click to uncheck)' : 'Click to mark complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="text-emerald-400" size={24} />
                      ) : (
                        <Circle className="text-slate-500 hover:text-emerald-400" size={24} />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          assign.type === 'video'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : assign.type === 'document'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : assign.type === 'reading'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {assign.type === 'video' && '🎥 Video'}
                          {assign.type === 'document' && '📄 Document'}
                          {assign.type === 'reading' && '📖 Reading'}
                          {assign.type === 'practical' && '🎯 Practical'}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${dueStatus.color}`}>
                          <Clock size={10} />
                          {dueStatus.label}
                        </span>

                        {assign.assignedTarget !== 'all' && (
                          <span className="text-[9px] bg-slate-900 border border-slate-750 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                            {assign.assignedTarget === 'patrol' ? 'Patrol Task' : 'Direct Task'}
                          </span>
                        )}
                      </div>

                      <h4 className={`font-bold text-sm text-white ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {assign.title}
                      </h4>

                      {assign.description && (
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans whitespace-pre-wrap">
                          {assign.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Leader edit / delete */}
                  {isLeader && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(assign)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition cursor-pointer"
                        title="Edit assignment"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(assign.id)}
                        className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-700 transition cursor-pointer"
                        title="Delete assignment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Resource Actions & Status Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-750/60">
                  <div className="flex items-center gap-2">
                    {assign.link && (
                      <a
                        href={assign.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                          assign.type === 'video'
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {assign.type === 'video' ? <Video size={13} /> : <FileText size={13} />}
                        <span>{assign.type === 'video' ? 'Watch Video' : 'Open Document / Link'}</span>
                        <ExternalLink size={11} className="ml-0.5 opacity-80" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check size={12} /> Completed {completedDate ? `on ${completedDate}` : ''}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(assign.id)}
                        className="text-xs text-slate-300 hover:text-emerald-400 font-semibold px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-500 transition cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} /> Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
