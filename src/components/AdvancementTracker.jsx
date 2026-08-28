import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Calendar, MessageSquare, Award } from 'lucide-react';

const RANK_COLORS = {
  emerald: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40',
    ring: 'ring-emerald-500',
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-800/50',
    bg: 'bg-emerald-950/20',
  },
  teal: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    active: 'bg-teal-600 text-white shadow-lg shadow-teal-900/40',
    ring: 'ring-teal-500',
    bar: 'bg-teal-500',
    text: 'text-teal-400',
    border: 'border-teal-800/50',
    bg: 'bg-teal-950/20',
  },
  cyan: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    active: 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40',
    ring: 'ring-cyan-500',
    bar: 'bg-cyan-500',
    text: 'text-cyan-400',
    border: 'border-cyan-800/50',
    bg: 'bg-cyan-950/20',
  },
  yellow: {
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    active: 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/40',
    ring: 'ring-yellow-500',
    bar: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-800/50',
    bg: 'bg-yellow-950/20',
  },
  orange: {
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    active: 'bg-orange-600 text-white shadow-lg shadow-orange-900/40',
    ring: 'ring-orange-500',
    bar: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-orange-800/50',
    bg: 'bg-orange-950/20',
  },
  red: {
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    active: 'bg-red-600 text-white shadow-lg shadow-red-900/40',
    ring: 'ring-red-500',
    bar: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-red-800/50',
    bg: 'bg-red-950/20',
  },
  purple: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    active: 'bg-purple-600 text-white shadow-lg shadow-purple-900/40',
    ring: 'ring-purple-500',
    bar: 'bg-purple-500',
    text: 'text-purple-400',
    border: 'border-purple-800/50',
    bg: 'bg-purple-950/20',
  },
};

export default function AdvancementTracker({ currentUser, scoutId: customScoutId, readOnly = false }) {
  const scoutId = customScoutId || currentUser.uid;

  const [selectedRankId, setSelectedRankId] = useState('scout');
  const [allRanksProgress, setAllRanksProgress] = useState({});
  const [expandedReqs, setExpandedReqs] = useState({}); // { [reqId]: boolean }
  const [loading, setLoading] = useState(true);

  // Listen to all rank progress documents in real-time
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

  const selectedRankData = RANKS_DATA.find((r) => r.id === selectedRankId) || RANKS_DATA[0];
  const activeProgress = allRanksProgress[selectedRankId] || { completedRequirements: {} };
  const completedRequirements = activeProgress.completedRequirements || {};

  const colorTheme = RANK_COLORS[selectedRankData.color] || RANK_COLORS.emerald;

  // Calculate overall requirements count and completed count for selected rank
  const totalRequirements = selectedRankData.categories.reduce((sum, cat) => sum + cat.requirements.length, 0);
  const completedCount = selectedRankData.categories.reduce((sum, cat) => {
    return sum + cat.requirements.filter((r) => completedRequirements[r.id]?.completed).length;
  }, 0);
  const percentage = totalRequirements > 0 ? Math.round((completedCount / totalRequirements) * 100) : 0;

  const toggleRequirement = async (reqId) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};
    const newCompleted = !existingReq.completed;

    const reqData = {
      completed: newCompleted,
      notes: existingReq.notes || '',
      completedAt: newCompleted ? (existingReq.completedAt || new Date().toISOString().split('T')[0]) : ''
    };

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: reqData
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating requirement status:', err);
    }
  };

  const handleNoteChange = async (reqId, noteText) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: {
            completed: !!existingReq.completed,
            notes: noteText,
            completedAt: existingReq.completedAt || ''
          }
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating notes:', err);
    }
  };

  const handleDateChange = async (reqId, dateString) => {
    if (readOnly) return;
    const docRef = doc(db, 'user_progress', scoutId, 'ranks', selectedRankId);
    const existingReq = completedRequirements[reqId] || {};

    try {
      await setDoc(docRef, {
        completedRequirements: {
          [reqId]: {
            completed: !!existingReq.completed,
            notes: existingReq.notes || '',
            completedAt: dateString
          }
        }
      }, { merge: true });
    } catch (err) {
      console.error('Error updating date:', err);
    }
  };

  const toggleExpand = (reqId) => {
    setExpandedReqs((prev) => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading advancement portal...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ranks Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-700/60 scrollbar-none print-hide">
        {RANKS_DATA.map((rank) => {
          const isActive = selectedRankId === rank.id;
          const rankColor = RANK_COLORS[rank.color] || RANK_COLORS.emerald;

          // Calculate rank completion percentage for tab badge
          const rProg = allRanksProgress[rank.id] || { completedRequirements: {} };
          const rComp = rProg.completedRequirements || {};
          const rTotal = rank.categories.reduce((sum, c) => sum + c.requirements.length, 0);
          const rDone = rank.categories.reduce((sum, c) => sum + c.requirements.filter((r) => rComp[r.id]?.completed).length, 0);
          const rPct = rTotal > 0 ? Math.round((rDone / rTotal) * 100) : 0;

          return (
            <button
              key={rank.id}
              onClick={() => setSelectedRankId(rank.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? rankColor.active
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Award size={14} />
              {rank.name}
              <span className={`text-[10px] px-1 rounded font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {rPct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Rank Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <Award size={120} className={colorTheme.text} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${colorTheme.badge}`}>
                Rank {selectedRankData.order} of 7
              </span>
              <h2 className="text-xl font-bold text-white">{selectedRankData.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedRankData.description}</p>
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

      {/* Categories & Requirements Checklist */}
      <div className="space-y-6">
        {selectedRankData.categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700/50 pb-2">
              {cat.name}
            </h3>
            <div className="space-y-3">
              {cat.requirements.map((req) => {
                const reqProgress = completedRequirements[req.id] || {};
                const isCompleted = !!reqProgress.completed;
                const isExpanded = !!expandedReqs[req.id];
                const noteValue = reqProgress.notes || '';
                const dateValue = reqProgress.completedAt || '';

                return (
                  <div
                    key={req.id}
                    className={`rounded-xl border transition overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-950/10 border-emerald-800/30'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {/* Header bar */}
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
                          <span className="text-xs font-mono font-bold text-slate-500">Requirement {req.number}</span>
                          <span className="text-slate-400 hover:text-white transition">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 leading-relaxed ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                          {req.text}
                        </p>

                        {/* Collapsed view status tags */}
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

                    {/* Collapsible Accordion */}
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
                              Notes & Sign-off reflections
                            </label>
                            <textarea
                              rows={2}
                              disabled={readOnly}
                              value={noteValue}
                              onChange={(e) => handleNoteChange(req.id, e.target.value)}
                              placeholder={readOnly ? 'No notes entered' : 'Write notes or sign-off reflections here...'}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none disabled:opacity-75"
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
