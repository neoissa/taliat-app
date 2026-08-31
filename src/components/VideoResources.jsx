import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Shield, ShieldCheck, ShieldAlert, Play, CheckCircle2, Circle, Users, DoorOpen, PhoneCall } from 'lucide-react';

const SAFETY_VIDEOS = [
  {
    id: 'parent_overview',
    title: '📹 Parent Overview Briefing',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/1EcoMswvWmo',
    description: 'Overview briefing designed for parents regarding Scouting America\'s youth safety standard rules.'
  },
  {
    id: 'mod1',
    title: '🛡️ Module 1: Barriers to Abuse',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod1%20Final%20Master%20Small.mp4',
    description: 'Establishing physical and behavioral barriers to prevent misconduct.'
  },
  {
    id: 'mod2',
    title: '🚩 Module 2: Awareness & Red Flags',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod2%20Final%20Master%20Small.mp4',
    description: 'Recognizing warning signs, behavioral changes, and inappropriate actions.'
  },
  {
    id: 'mod3',
    title: '💻 Module 3: Digital Safety & Privacy',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod3%20Final%20Master%20Small.mp4',
    description: 'Guidelines for online communication, social media privacy, and messaging safety.'
  },
  {
    id: 'mod4',
    title: '📞 Module 4: Reporting Protocols',
    type: 'native',
    url: 'https://filestore.scouting.org/filestore/YPSAT/YT%20Mod4%20Final%20Master%20Small.mp4',
    description: 'The formal steps required for reporting concerns and safety helpline resources.'
  }
];

export default function VideoResources({ currentUser, scoutId }) {
  const isLeaderOrOwner = currentUser.role === 'leader' || currentUser.role === 'owner';
  const targetScoutId = scoutId || currentUser.uid;

  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Check if current user has edit permission for this scout
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
  const isScoutmaster = currentUser.role === 'leader' && currentUser.leaderPosition === 'Scoutmaster';
  const canEdit = !scoutId || currentUser.uid === targetScoutId || isOwner || isScoutmaster;

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

  const markWatched = async (videoId, isWatched) => {
    if (!canEdit) return;
    try {
      const docRef = doc(db, 'user_progress', targetScoutId, 'safety_videos', 'status');
      await setDoc(docRef, {
        [videoId]: {
          watched: isWatched,
          watchedAt: isWatched ? new Date().toISOString() : null,
          updatedBy: currentUser.uid,
          updatedByName: currentUser.fullName || currentUser.username || currentUser.email
        }
      }, { merge: true });
    } catch (err) {
      console.error("Failed to update video progress:", err);
    }
  };

  const handleVideoEnded = (videoId) => {
    // Auto mark as completed only for the scout themselves
    if (currentUser.uid === targetScoutId) {
      markWatched(videoId, true);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading video resources...</div>;
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
            Youth Protection & Safeguarding Standards
          </h2>
          <p className="text-xs text-slate-350 mt-3 leading-relaxed">
            Completing these safeguarding videos is required by Scouting America (BSA) and is an essential requirement for earning the **Scout** rank. Please watch each video below directly on this page.
          </p>
        </div>
      </div>

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

      {/* Videos List */}
      <div className="space-y-6">
        {SAFETY_VIDEOS.map((video) => {
          const videoProgress = progress[video.id] || {};
          const isWatched = !!videoProgress.watched;
          const watchedDate = videoProgress.watchedAt ? new Date(videoProgress.watchedAt).toLocaleDateString() : '';

          return (
            <div key={video.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">{video.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{video.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                    isWatched
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-700/50 text-slate-400 border-slate-600'
                  }`}>
                    {isWatched ? 'COMPLETED' : 'INCOMPLETE'}
                  </span>

                  {/* Toggle Button */}
                  {canEdit && (
                    <button
                      onClick={() => markWatched(video.id, !isWatched)}
                      className={`text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 border ${
                        isWatched
                          ? 'bg-red-950/20 text-red-400 border-red-900/30 hover:bg-red-900/20'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
                      }`}
                    >
                      {isWatched ? (
                        <>
                          <Circle size={12} /> Mark Incomplete
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> Mark Completed
                        </>
                      )}
                    </button>
                  )}
                </div>
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

              {/* Watch Details metadata */}
              {isWatched && (
                <div className="text-[10px] text-slate-500 flex justify-between px-2 pt-1 border-t border-slate-700/40">
                  <span>Watched Date: {watchedDate}</span>
                  {videoProgress.updatedByName && (
                    <span>Confirmed by: {videoProgress.updatedByName}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
