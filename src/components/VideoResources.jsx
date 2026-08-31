import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Shield, Play, CheckCircle2, Circle, Users, DoorOpen, PhoneCall, FileText, ExternalLink, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const SAFETY_VIDEOS = [
  {
    id: 'parent_overview',
    title: ' Parent Overview Briefing',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/1EcoMswvWmo',
    description: 'Overview briefing designed for parents regarding Scouting America\'s youth safety standard rules.'
  },
  {
    id: 'mod1',
    title: ' Module 1: Barriers to Abuse',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod1%20Final%20Master%20Small.mp4',
    description: 'Establishing physical and behavioral barriers to prevent misconduct.'
  },
  {
    id: 'mod2',
    title: ' Module 2: Awareness & Red Flags',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod2%20Final%20Master%20Small.mp4',
    description: 'Recognizing warning signs, behavioral changes, and inappropriate actions.'
  },
  {
    id: 'mod3',
    title: ' Module 3: Digital Safety & Privacy',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod3%20Final%20Master%20Small.mp4',
    description: 'Guidelines for online communication, social media privacy, and messaging safety.'
  },
  {
    id: 'mod4',
    title: ' Module 4: Reporting Protocols',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod4%20Final%20Master%20Small.mp4',
    description: 'The formal steps required for reporting concerns and safety helpline resources.'
  }
];

const DOCUMENT_RESOURCES = [
  {
    id: 'health_medical',
    title: '📋 BSA Annual Health & Medical Record',
    url: 'https://filestore.scouting.org/filestore/HealthSafety/pdf/680-001_ABC.pdf',
    description: 'Mandatory health history and consent record (Parts A, B, and C) required for all scouting trips, camping activities, and high adventure bases.'
  },
  {
    id: 'ypt_policies',
    title: '🛡️ BSA Youth Protection Guidelines (YPT)',
    url: 'https://filestore.scouting.org/filestore/pdf/100-011.pdf',
    description: 'Official guidebook outlining safety barriers, youth supervision rules, reporting protocols, and scouting standards.'
  },
  {
    id: 'advancement_checklist',
    title: '📈 Scouts BSA Rank Advancement Checklist',
    url: 'https://filestore.scouting.org/filestore/pdf/32450.pdf',
    description: 'Quick reference checklist showing the requirement requirements from Scout rank through Tenderfoot, Second Class, First Class, and Eagle Rank.'
  },
  {
    id: 'merit_badge_list',
    title: '🏅 Scouts BSA Merit Badges & Library',
    url: 'https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/merit-badges/',
    description: 'Complete list of all merit badges, workbooks, guidelines, and counselor resources for Scouting America.'
  },
  {
    id: 'troop_leader_guide',
    title: '👥 Troop Junior Leadership Guide',
    url: 'https://filestore.scouting.org/filestore/training/pdf/511-037.pdf',
    description: 'Reference training guidebook for youth patrol leaders, assistants, and senior patrol leaders on troop operations.'
  }
];

export default function VideoResources({ currentUser, scoutId, scout }) {
  const targetScoutId = scoutId || currentUser.uid;
  const isLeaderOrOwner = currentUser.role === 'leader' || currentUser.role === 'owner';
  const isViewingScout = !!scoutId && scoutId !== currentUser.uid;

  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('videos'); // 'videos' | 'documents'

  // Input states for scouts completing videos
  const [tempCompletedDate, setTempCompletedDate] = useState({});
  const [tempLessonLearned, setTempLessonLearned] = useState({});

  // Check permissions
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser.role === 'leader' && currentUser.leaderPosition === 'Scoutmaster';
  const isAssignedLeader = currentUser.role === 'leader' && scout && scout.leaderId === currentUser.uid;
  const canEdit = !scoutId || currentUser.uid === targetScoutId || isOwner || isScoutmaster || isAssignedLeader;

  // Show progress tracking elements only if we are tracking a scout
  const showProgressUI = currentUser.role === 'scout' || isViewingScout;

  useEffect(() => {
    const docRef = doc(db, 'user_progress', targetScoutId, 'safety_videos', 'status');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setProgress(snap.data());
      } else {
        setProgress({});
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to subscribe to safety videos progress:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [targetScoutId]);

  const toggleAssigned = async (videoId, currentAssigned) => {
    if (!isLeaderOrOwner || !isViewingScout) return;
    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'safety_videos', 'status');
      await setDoc(docRef, {
        [videoId]: {
          assigned: !currentAssigned,
          assignedAt: !currentAssigned ? new Date().toISOString() : null
        }
      }, { merge: true });
    } catch (err) {
      console.error("Failed to toggle assigned status:", err);
    }
  };

  const handleMarkComplete = async (videoId) => {
    if (!canEdit) return;

    // Scouts must supply a date and a lesson learned
    const dateVal = tempCompletedDate[videoId] || new Date().toISOString().split('T')[0];
    const lessonVal = tempLessonLearned[videoId] || '';

    if (currentUser.role === 'scout' && !lessonVal.trim()) {
      alert("Please add a lesson learned before marking as completed.");
      return;
    }

    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'safety_videos', 'status');
      await setDoc(docRef, {
        [videoId]: {
          watched: true,
          watchedAt: new Date().toISOString(),
          completedDate: dateVal,
          lessonLearned: lessonVal.trim(),
          updatedBy: currentUser.uid,
          updatedByName: currentUser.fullName || currentUser.username || currentUser.email
        }
      }, { merge: true });

      // Clear temp states
      setTempLessonLearned(prev => ({ ...prev, [videoId]: '' }));
    } catch (err) {
      console.error("Failed to mark completed:", err);
    }
  };

  const handleMarkIncomplete = async (videoId) => {
    if (!canEdit) return;
    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'safety_videos', 'status');
      await setDoc(docRef, {
        [videoId]: {
          watched: false,
          watchedAt: null,
          completedDate: null,
          lessonLearned: null,
          updatedBy: currentUser.uid,
          updatedByName: currentUser.fullName || currentUser.username || currentUser.email
        }
      }, { merge: true });
    } catch (err) {
      console.error("Failed to mark incomplete:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <Shield size={120} className="text-emerald-400" />
        </div>
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="text-emerald-400" size={24} />
            Resource Center
          </h2>
          <p className="text-xs text-slate-350 mt-3 leading-relaxed">
            Access important troop documents, scouting manuals, health forms, and BSA-required youth protection safeguarding video modules.
          </p>
        </div>
      </div>

      {/* Sub-tab selection */}
      <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-750 max-w-xs">
        <button
          onClick={() => setActiveSubTab('videos')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeSubTab === 'videos'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-455 hover:text-slate-200 border border-transparent'
          }`}
        >
          Videos Center
        </button>
        <button
          onClick={() => setActiveSubTab('documents')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeSubTab === 'documents'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-455 hover:text-slate-200 border border-transparent'
          }`}
        >
          Document Center
        </button>
      </div>

      {/* Rendering Content Center */}
      {activeSubTab === 'videos' ? (
        <div className="space-y-6">
          {/* Safety Guidelines Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-emerald-400" /> Two-Deep Leadership
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Leaders never have one-on-one contact with youth—all communication requires at least two registered adults.
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <DoorOpen size={14} className="text-blue-400" /> Open Door Policy
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Parents and guardians are always welcome to attend, observe, and participate in all troop meetings.
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall size={14} className="text-amber-400" /> Reporting Concerns
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Reach out to unit leadership immediately or call the Scouts First Helpline directly at **1-844-726-8871**.
              </p>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="space-y-6">
            {SAFETY_VIDEOS.map((video) => {
              const videoProgress = progress[video.id] || {};
              const isWatched = !!videoProgress.watched;
              const isAssigned = !!videoProgress.assigned;
              const watchedDate = videoProgress.completedDate || (videoProgress.watchedAt ? new Date(videoProgress.watchedAt).toLocaleDateString() : '');
              const lessonLearned = videoProgress.lessonLearned || '';

              // Check validation for completion
              const hasLessonInput = (tempLessonLearned[video.id] || '').trim().length > 0;
              const canSubmit = isLeaderOrOwner || hasLessonInput;

              return (
                <div key={video.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{video.title}</h3>
                        {isAssigned && !isWatched && (
                          <span className="text-[9px] bg-red-950/60 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <AlertCircle size={10} /> Assigned by Leader
                          </span>
                        )}
                        {isWatched && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 size={10} /> Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{video.description}</p>
                    </div>

                    {showProgressUI && (
                      <div className="flex items-center gap-3">
                        {/* Leader Assignment Button */}
                        {isLeaderOrOwner && isViewingScout && (
                          <button
                            onClick={() => toggleAssigned(video.id, isAssigned)}
                            className={`text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border ${
                              isAssigned
                                ? 'bg-amber-950/40 text-amber-400 border-amber-900/40 hover:bg-amber-900/30'
                                : 'bg-slate-700 hover:bg-slate-655 text-slate-300 border-transparent'
                            }`}
                          >
                            {isAssigned ? 'Assigned' : 'Assign to Watch'}
                          </button>
                        )}

                        {/* Status Badge */}
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                          isWatched
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400 border-slate-600'
                        }`}>
                          {isWatched ? 'COMPLETED' : 'INCOMPLETE'}
                        </span>

                        {/* Mark Incomplete Toggle (For Authorized Users) */}
                        {isWatched && canEdit && (
                          <button
                            onClick={() => handleMarkIncomplete(video.id)}
                            className="text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border bg-red-950/20 text-red-400 border-red-900/30 hover:bg-red-900/20"
                          >
                            Mark Incomplete
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Video Player */}
                  <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner max-w-2xl mx-auto">
                    {video.type === 'youtube' ? (
                      <div className="relative aspect-video">
                        <iframe
                          className="absolute inset-0 w-full h-full border-0"
                          src={video.url}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <video
                        className="w-full aspect-video"
                        src={video.url}
                        controls
                        preload="metadata"
                        onEnded={() => handleVideoEnded(video.id)}
                      >
                        Your browser does not support HTML5 video player.
                      </video>
                    )}
                  </div>

                  {/* Watch Form for Incomplete (For Scouts, or Leaders completing for Scout) */}
                  {showProgressUI && !isWatched && canEdit && (
                    <div className="bg-slate-900/40 border border-slate-750 p-4 rounded-xl space-y-3 max-w-2xl mx-auto">
                      <h4 className="text-xs font-bold text-slate-350 flex items-center gap-1.5">
                        <BookOpen size={14} className="text-emerald-400" /> Complete This Module
                      </h4>
                      <p className="text-[11px] text-slate-450">To mark this training module as completed, please provide the completion date and a brief lesson learned summary.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                            <Calendar size={12} /> Completion Date
                          </label>
                          <input
                            type="date"
                            value={tempCompletedDate[video.id] || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setTempCompletedDate(prev => ({ ...prev, [video.id]: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                            Lesson Learned
                          </label>
                          <textarea
                            rows={2}
                            value={tempLessonLearned[video.id] || ''}
                            onChange={(e) => setTempLessonLearned(prev => ({ ...prev, [video.id]: e.target.value }))}
                            placeholder="Briefly summarize what you learned from this video..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleMarkComplete(video.id)}
                          disabled={!canSubmit}
                          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} /> Mark as Completed
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Watch Details metadata */}
                  {showProgressUI && isWatched && (
                    <div className="bg-slate-900/30 border border-slate-750/50 p-4 rounded-xl text-xs space-y-2 max-w-2xl mx-auto">
                      <div className="flex justify-between items-center text-[10px] text-slate-450 border-b border-slate-750 pb-1.5">
                        <span>Completed Date: <strong className="text-slate-300 font-semibold">{watchedDate}</strong></span>
                        {videoProgress.updatedByName && (
                          <span>Confirmed by: <strong className="text-slate-300 font-semibold">{videoProgress.updatedByName}</strong></span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Lesson Learned:</span>
                        <p className="text-slate-200 leading-relaxed italic">"{lessonLearned || '—'}"</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Document Center View */
        <div className="space-y-4">
          {DOCUMENT_RESOURCES.map((docItem) => (
            <div key={docItem.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-600 transition">
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400 shrink-0" />
                  {docItem.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{docItem.description}</p>
              </div>
              <a
                href={docItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-center sm:shrink-0 inline-flex items-center justify-center gap-1.5 border border-slate-650"
              >
                View Document <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
