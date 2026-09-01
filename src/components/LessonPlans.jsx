import React, { useState, useEffect } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { formatKashafLessonPlanWhatsApp, applyIslamicTransliteration } from '../utils/kashafVoice';

export default function LessonPlans({ currentUser }) {
  const isLeaderOrOwner = currentUser?.role === 'leader' || currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  
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
  const [customWhatsAppMsg, setCustomWhatsAppMsg] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [editorCopiedSuccess, setEditorCopiedSuccess] = useState(false);

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

  // Update customized WhatsApp message whenever selected plan changes
  useEffect(() => {
    if (selectedPlan) {
      setCustomWhatsAppMsg(formatKashafLessonPlanWhatsApp(selectedPlan));
    }
  }, [selectedPlan]);

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
        setSelectedPlan({ id: docId, ...planData });
      }, 1200);
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

  const handleCopyWhatsAppMsg = (msg) => {
    if (!msg) return;
    navigator.clipboard.writeText(msg);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleCopyEditorWhatsAppMsg = () => {
    const currentEditorPlan = {
      title: planTitle,
      date: planDate,
      content: planContent,
      islamicPrep: islamicPrep,
      resources: resources.filter(r => r.name && r.url)
    };
    const msg = formatKashafLessonPlanWhatsApp(currentEditorPlan);
    navigator.clipboard.writeText(msg);
    setEditorCopiedSuccess(true);
    setTimeout(() => setEditorCopiedSuccess(false), 3000);
  };

  const filteredPlans = plans.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.date.includes(searchTerm) ||
    (p.islamicPrep && p.islamicPrep.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Real-time preview for editor
  const editorPreviewPlan = {
    title: planTitle,
    date: planDate,
    content: planContent,
    islamicPrep: islamicPrep,
    resources: resources.filter(r => r.name && r.url)
  };
  const editorWhatsAppMsg = formatKashafLessonPlanWhatsApp(editorPreviewPlan);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <BookOpen size={120} className="text-emerald-400" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> KashafVoice v3.0 Enabled
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="text-emerald-400" size={24} />
              <span>Lesson Planning & Parent Messenger</span>
            </h2>
            <p className="text-xs text-slate-350 mt-1 leading-relaxed max-w-2xl">
              Design weekly schedules, map scouting activities, and automatically format faith-rooted WhatsApp announcements for parents.
            </p>
          </div>

          {isLeaderOrOwner && !isEditing && (
            <button
              onClick={handleOpenNewEditor}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
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
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <h3 className="font-bold text-white text-sm">
                {editingId ? 'Edit Lesson Plan' : 'Create Weekly Lesson Plan'}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <form onSubmit={handleSavePlan} className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Plan Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Week 1: Knots, Hitches, & Shia Akhlaq"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-emerald-400" /> Meeting Date
                  </label>
                  <input
                    type="date"
                    required
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Scouting Objectives & Activities</label>
                <textarea
                  rows={4}
                  placeholder="List the scouting rank requirements, knots, first aid drills, and patrol activities scheduled..."
                  value={planContent}
                  onChange={(e) => setPlanContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* Shia Islamic Preparation section */}
              <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  🕌 Shia Islamic Preparation (Tarbiyah / Akhlaq)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter Hadiths from Ahlul Bayt (A.S.), Quranic reflection, Karbala heroes connection, or moral lesson..."
                  value={islamicPrep}
                  onChange={(e) => setIslamicPrep(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* Weekly Resource Links */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Resource Materials / Links</label>
                  <button
                    type="button"
                    onClick={handleAddResourceRow}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer flex items-center gap-1"
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
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="url"
                        placeholder="URL (https://...)"
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
                          <Trash2 size={15} />
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
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

            {/* Live WhatsApp KashafVoice Preview Column */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-750 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      📱
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400">Live WhatsApp Summary</h4>
                      <p className="text-[10px] text-slate-400">KashafVoice v3.0 Standard</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEditorWhatsAppMsg}
                    className="text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    {editorCopiedSuccess ? <Check size={12} className="text-emerald-200" /> : <Copy size={12} />}
                    <span>{editorCopiedSuccess ? 'Copied!' : 'Copy Msg'}</span>
                  </button>
                </div>

                {/* Stylized WhatsApp Chat Bubble */}
                <div className="bg-[#0b141a] border border-[#222e35] rounded-xl p-3.5 text-xs text-[#e9edef] font-sans leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                  {editorWhatsAppMsg}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Auto-formats greetings, bullets & academic transliteration</span>
                <span className="text-emerald-400 font-bold">⚜️ Dhulfiqār Team</span>
              </div>
            </div>
          </div>
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
              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {filteredPlans.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1 cursor-pointer ${
                      selectedPlan?.id === p.id
                        ? 'bg-slate-700/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/40 border-slate-750 hover:border-slate-650'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock size={10} className="text-emerald-400" /> {p.date}
                      </span>
                      <span className="text-[10px] text-emerald-400">📱 WhatsApp Ready</span>
                    </div>
                    <span className="font-bold text-xs text-white line-clamp-1">{p.title}</span>
                    {p.islamicPrep && (
                      <span className="text-[9px] bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 px-1.5 py-0.2 rounded w-max mt-0.5 font-semibold">
                        🕌 Shia Akhlāq
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Plan details + KashafVoice WhatsApp Messenger */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl md:col-span-2 min-h-[400px]">
            {selectedPlan ? (
              <div className="space-y-6">
                {/* Header of selected plan */}
                <div className="flex justify-between items-start gap-4 border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mb-1">
                      <Calendar size={12} className="text-emerald-400" /> {selectedPlan.date}
                    </span>
                    <h3 className="font-extrabold text-white text-base leading-tight">{selectedPlan.title}</h3>
                  </div>

                  {isLeaderOrOwner && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditEditor(selectedPlan)}
                        className="bg-slate-700 hover:bg-slate-650 text-slate-200 p-2 rounded-lg transition cursor-pointer"
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

                {/* ── KASHAFVOICE V3.0 WHATSAPP PARENT MESSENGER CARD ── */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <span>WhatsApp Parent Messenger</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                            KashafVoice v3.0
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">Faith-rooted, warm WhatsApp message ready to send to parents.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleCopyWhatsAppMsg(customWhatsAppMsg)}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        {copiedSuccess ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedSuccess ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(customWhatsAppMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                      >
                        <Send size={13} />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Message Editor / Preview */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Live Message Preview (Editable):</span>
                      <button
                        onClick={() => setCustomWhatsAppMsg(formatKashafLessonPlanWhatsApp(selectedPlan))}
                        className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles size={11} /> Reset to Default Template
                      </button>
                    </div>

                    <textarea
                      rows={10}
                      value={customWhatsAppMsg}
                      onChange={(e) => setCustomWhatsAppMsg(e.target.value)}
                      className="w-full bg-[#0b141a] border border-[#222e35] text-[#e9edef] rounded-xl p-3.5 text-xs font-sans leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Scouting Content details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Objectives & Activities</h4>
                  <p className="text-xs text-slate-250 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/40 p-4 rounded-xl border border-slate-750">
                    {selectedPlan.content || 'No scouting details recorded for this meeting.'}
                  </p>
                </div>

                {/* Islamic Prep Detail */}
                {selectedPlan.islamicPrep && (
                  <div className="bg-emerald-950/15 border border-emerald-900/30 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      🕌 Shia Islamic Preparation (Akhlāq / Tarbiyah)
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans italic">
                      "{applyIslamicTransliteration(selectedPlan.islamicPrep)}"
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
