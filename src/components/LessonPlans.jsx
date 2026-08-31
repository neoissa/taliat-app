import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, FileText, Link as LinkIcon, Plus, Trash2, Edit3, Save, Search, BookOpen, Clock, X } from 'lucide-react';

export default function LessonPlans({ currentUser }) {
  const isLeaderOrOwner = currentUser.role === 'leader' || currentUser.role === 'owner';
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editor panel states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means new plan
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [planTitle, setPlanTitle] = useState('');
  const [planContent, setPlanContent] = useState('');
  const [islamicPrep, setIslamicPrep] = useState('');
  const [resources, setResources] = useState([{ name: '', url: '' }]);
  
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Status messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const plansRef = collection(db, 'lesson_plans');
    const q = query(plansRef);
    
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort plans by date descending
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPlans(list);
      setLoading(false);
    }, (err) => {
      console.error("Failed to load lesson plans:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

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
    setPlanDate(plan.date || '');
    setPlanTitle(plan.title || '');
    setPlanContent(plan.content || '');
    setIslamicPrep(plan.islamicPrep || '');
    setResources(plan.resources && plan.resources.length > 0 ? plan.resources : [{ name: '', url: '' }]);
    setErrorMsg('');
    setSuccessMsg('');
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

    const planData = {
      title: planTitle.trim(),
      date: planDate,
      content: planContent.trim(),
      islamicPrep: islamicPrep.trim(),
      resources: cleanResources,
      updatedBy: currentUser.uid,
      updatedByName: currentUser.fullName || currentUser.username,
      updatedAt: serverTimestamp()
    };

    try {
      const docId = editingId || `plan_${Date.now()}`;
      await setDoc(doc(db, 'lesson_plans', docId), planData, { merge: true });
      
      setSuccessMsg(editingId ? "Lesson plan updated!" : "New lesson plan saved!");
      setTimeout(() => {
        setIsEditing(false);
        setEditingId(null);
        setSelectedPlan(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save plan: " + err.message);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this lesson plan?")) return;
    try {
      await deleteDoc(doc(db, 'lesson_plans', planId));
      setSelectedPlan(null);
    } catch (err) {
      alert("Failed to delete plan: " + err.message);
    }
  };

  const filteredPlans = plans.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.date.includes(searchTerm) ||
    (p.islamicPrep && p.islamicPrep.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <BookOpen size={120} className="text-emerald-400" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="text-emerald-400" size={24} />
              Lesson Planning & Resources
            </h2>
            <p className="text-xs text-slate-350 mt-1.5 leading-relaxed">
              Design weekly schedules, map study activities, compile web/doc links, and structure Shia Islamic akhlaq preparation.
            </p>
          </div>

          {isLeaderOrOwner && !isEditing && (
            <button
              onClick={handleOpenNewEditor}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} /> Create Lesson Plan
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit or New Plan Creator UI */
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <h3 className="font-bold text-white text-sm">
              {editingId ? 'Edit Lesson Plan' : 'Create Weekly Lesson Plan'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSavePlan} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Week 1: Knots, Hitches, & Shia Akhlaq"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Meeting Date / Week
                </label>
                <input
                  type="date"
                  required
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Scouting Objectives & Activities</label>
              <textarea
                rows={4}
                placeholder="List the scouting rank requirements, patrol operations, and team activities scheduled..."
                value={planContent}
                onChange={(e) => setPlanContent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />
            </div>

            {/* Shia Islamic Preparation section */}
            <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl space-y-2.5">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                🕌 Shia Islamic Preparation (Tarbiyah / Akhlaq)
              </label>
              <textarea
                rows={4}
                placeholder="Enter references to Shia Quranic Tafsir, Hadith from Ahlul Bayt (A.S.), histories, supplications, or moral preparation notes for the session..."
                value={islamicPrep}
                onChange={(e) => setIslamicPrep(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />
            </div>

            {/* Weekly Resource Links */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Save Resources / Links</label>
                <button
                  type="button"
                  onClick={handleAddResourceRow}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Resource
                </button>
              </div>

              <div className="space-y-2">
                {resources.map((res, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Resource Label (e.g. Square Knot Guide PDF)"
                      value={res.name}
                      onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="url"
                      placeholder="URL (e.g. https://...)"
                      value={res.url}
                      onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    {resources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveResourceRow(index)}
                        className="text-red-400 hover:text-red-300 transition cursor-pointer p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {successMsg && <p className="text-xs text-emerald-400 font-semibold">{successMsg}</p>}
            {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}

            <div className="flex gap-2 pt-2 border-t border-slate-700/60">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save size={14} /> Save Lesson Plan
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Plan Listing & Detail Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel: Plan list */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-4 md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plans by date, title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {loading ? (
              <div className="text-center py-6 text-slate-500 text-xs">Loading plans...</div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-6 text-slate-550 text-xs italic">No plans matching search.</div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredPlans.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1 cursor-pointer ${
                      selectedPlan?.id === p.id
                        ? 'bg-slate-700/60 border-emerald-500/60 shadow-md'
                        : 'bg-slate-900/30 border-slate-750 hover:border-slate-650'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock size={10} /> {p.date}
                    </span>
                    <span className="font-bold text-xs text-white line-clamp-1">{p.title}</span>
                    {p.islamicPrep && (
                      <span className="text-[9px] bg-emerald-950/30 text-emerald-400 border border-emerald-900/20 px-1 py-0.5 rounded w-max mt-0.5">
                        🕌 Shia Akhlaq Prep
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Plan details display */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl md:col-span-2 min-h-[300px]">
            {selectedPlan ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start gap-4 border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mb-1">
                      <Calendar size={12} className="text-emerald-400" /> {selectedPlan.date}
                    </span>
                    <h3 className="font-bold text-white text-base leading-tight">{selectedPlan.title}</h3>
                  </div>

                  {isLeaderOrOwner && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditEditor(selectedPlan)}
                        className="bg-slate-700 hover:bg-slate-655 text-slate-200 p-2 rounded-lg transition cursor-pointer"
                        title="Edit plan"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(selectedPlan.id)}
                        className="bg-red-950/30 hover:bg-red-900/30 text-red-400 p-2 rounded-lg transition cursor-pointer border border-red-900/20"
                        title="Delete plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Scouting Content details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Objectives & Activities</h4>
                  <p className="text-xs text-slate-250 leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedPlan.content || 'No scouting details recorded for this meeting.'}
                  </p>
                </div>

                {/* Islamic Prep Detail */}
                {selectedPlan.islamicPrep && (
                  <div className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      🕌 Shia Islamic Preparation (Akhlaq / Tarbiyah)
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans italic">
                      "{selectedPlan.islamicPrep}"
                    </p>
                  </div>
                )}

                {/* Resources Links Grid */}
                {selectedPlan.resources && selectedPlan.resources.length > 0 && (
                  <div className="space-y-2 border-t border-slate-700/60 pt-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Resources & Files</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {selectedPlan.resources.map((res, index) => (
                        <a
                          key={index}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-750 p-2.5 rounded-xl transition flex items-center justify-between text-xs text-slate-200 cursor-pointer"
                        >
                          <span className="font-semibold flex items-center gap-1.5 text-[11px] line-clamp-1">
                            <FileText size={12} className="text-emerald-400 shrink-0" />
                            {res.name}
                          </span>
                          <LinkIcon size={12} className="text-slate-450 shrink-0 ml-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 h-full py-16 space-y-2.5">
                <FileText size={48} className="opacity-20" />
                <p className="text-xs italic text-slate-455">Select a lesson plan from the sidebar to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
