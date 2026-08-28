import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { RANKS, RANKS_SCHEMA, RANK_COLORS } from '../data/ranksSchema';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Calendar, MessageSquare, Award } from 'lucide-react';

export default function AdvancementTracker({ currentUser, scoutId: customScoutId, readOnly = false }) {
  const scoutId = customScoutId || currentUser.uid;
  const isLeader = currentUser.role === 'leader';
  
  const [selectedRank, setSelectedRank] = useState('Scout');
  const [allRanksProgress, setAllRanksProgress] = useState({});
  const [expandedReqs, setExpandedReqs] = useState({}); // { [reqId]: boolean }
  const [loading, setLoading] = useState(true);

  // Listen to all rank progress for this scout
  useEffect(() => {
    const colRef = collection(db, 'user_progress', scoutId, 'ranks');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const progressMap = {};
      snapshot.docs.forEach((doc) => {
        progressMap[doc.id] = doc.data();
      });
      setAllRanksProgress(progressMap);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to rank progress:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [scoutId]);

  const activeProgress = allRanksProgress[selectedRank] || { completed: {}, reflections: {}, dates: {} };
  const completedMap = activeProgress.completed || {};
  const reflectionsMap = activeProgress.reflections || {};
  const datesMap = activeProgress.dates || {};

  const schema = RANKS_SCHEMA[selectedRank];
  const colorTheme = RANK_COLORS[schema.color] || RANK_COLORS.emerald;

  // Calculate stats for selected rank
  const totalRequirements = schema.categories.reduce((sum, cat) => sum + cat.requirements.length, 0);
  const completedCount = schema.categories.reduce((sum, cat) => {
    return sum + cat.requirements.filter(r => completedMap[r.id]).length;
  }, 0);
  const percentage = totalRequirements > 0 ? Math.round((completedCount / totalRequirements) * 100) : 0;

  const toggleRequirement = async (reqId) => {
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRank);
    const newCompleted = { ...completedMap, [reqId]: !completedMap[reqId] };
    
    // Auto-fill completion date if marking complete
    const newDates = { ...datesMap };
    if (!completedMap[reqId] && !datesMap[reqId]) {
      newDates[reqId] = new Date().toISOString().split('T')[0];
    }

    try {
      await setDoc(docRef, {
        completed: newCompleted,
        reflections: reflectionsMap,
        dates: newDates
      }, { merge: true });
    } catch (err) {
      console.error('Error updating requirement status:', err);
    }
  };

  const handleTextChange = async (reqId, val) => {
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRank);
    const newReflections = { ...reflectionsMap, [reqId]: val };
    try {
      await setDoc(docRef, {
        reflections: newReflections
      }, { merge: true });
    } catch (err) {
      console.error('Error updating reflection:', err);
    }
  };

  const handleDateChange = async (reqId, val) => {
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRank);
    const newDates = { ...datesMap, [reqId]: val };
    try {
      await setDoc(docRef, {
        dates: newDates
      }, { merge: true });
    } catch (err) {
      console.error('Error updating completion date:', err);
    }
  };

  const toggleExpand = (reqId) => {
    setExpandedReqs(prev => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading advancement portal...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ranks Tabs (Horizontal Scroll on Mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-700/60 print-hide">
        {RANKS.map((rank) => {
          const rankSchema = RANKS_SCHEMA[rank];
          const isActive = selectedRank === rank;
          const rankColor = RANK_COLORS[rankSchema.color] || RANK_COLORS.emerald;
          
          // Calculate rank completion percentage for tab indicator
          const rProg = allRanksProgress[rank] || { completed: {} };
          const rComp = rProg.completed || {};
          const rTotal = rankSchema.categories.reduce((sum, c) => sum + c.requirements.length, 0);
          const rDone = rankSchema.categories.reduce((sum, c) => sum + c.requirements.filter(r => rComp[r.id]).length, 0);
          const rPct = rTotal > 0 ? Math.round((rDone / rTotal) * 100) : 0;

          return (
            <button
              key={rank}
              onClick={() => setSelectedRank(rank)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? rankColor.active
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Award size={14} />
              {rank}
              <span className={`text-[10px] px-1 rounded font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {rPct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Rank Progress Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <Award size={120} className={colorTheme.text} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${colorTheme.badge}`}>
                Rank Tracker
              </span>
              <h2 className="text-xl font-bold text-white">{selectedRank}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Organized requirements checklist and logs</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${colorTheme.text}`}>{percentage}%</span>
            <p className="text-xs text-slate-400">{completedCount} of {totalRequirements} complete</p>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-500 rounded-full ${colorTheme.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Categories & Requirements */}
      <div className="space-y-6">
        {schema.categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700/50 pb-2">
              {cat.name}
            </h3>
            <div className="space-y-3">
              {cat.requirements.map((req) => {
                const isCompleted = !!completedMap[req.id];
                const isExpanded = !!expandedReqs[req.id];
                const noteValue = reflectionsMap[req.id] || '';
                const dateValue = datesMap[req.id] || '';

                return (
                  <div
                    key={req.id}
                    className={`rounded-xl border transition overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-950/10 border-emerald-800/30'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {/* Header line */}
                    <div className="p-4 flex items-start gap-4">
                      <button
                        onClick={() => toggleRequirement(req.id)}
                        disabled={readOnly}
                        className={`mt-0.5 transition shrink-0 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="text-emerald-400" size={20} />
                        ) : (
                          <Circle className="text-slate-500 hover:text-emerald-400" size={20} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0" onClick={() => toggleExpand(req.id)}>
                        <div className="flex items-center justify-between cursor-pointer gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500">Req {req.number}</span>
                          <span className="text-slate-400 hover:text-white transition">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 leading-relaxed ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                          {req.description}
                        </p>
                        
                        {/* Brief status details on header when collapsed */}
                        {!isExpanded && (noteValue || dateValue) && (
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                            {dateValue && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> {dateValue}
                              </span>
                            )}
                            {noteValue && (
                              <span className="flex items-center gap-1 truncate max-w-xs">
                                <MessageSquare size={12} /> {noteValue}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collapsible notes/reflections */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-700/40 bg-slate-900/30 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Date Field */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                              Completion Date
                            </label>
                            <input
                              type="date"
                              disabled={readOnly}
                              value={dateValue}
                              onChange={(e) => handleDateChange(req.id, e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                            />
                          </div>

                          {/* Reflections Field */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                              Scout Reflections & Notes
                            </label>
                            <textarea
                              rows={2}
                              disabled={readOnly}
                              value={noteValue}
                              onChange={(e) => handleTextChange(req.id, e.target.value)}
                              placeholder={readOnly ? 'No notes entered' : 'Write down what you did, learned, or experienced...'}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none disabled:opacity-70"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
