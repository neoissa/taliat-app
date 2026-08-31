import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { doc, onSnapshot, setDoc, collection, query, where, deleteDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Shield, Play, CheckCircle2, Circle, Users, DoorOpen, PhoneCall, FileText, ExternalLink, Calendar, BookOpen, AlertCircle, Plus, Trash2, Video, Link as LinkIcon, Download, Globe, X } from 'lucide-react';

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
  },
  // --- Live Requirements Links (U.S. Scouts BSA) ---
  {
    id: 'scout_rank_reqs',
    title: '⚜️ Scout Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank1.asp',
    description: 'Official Scouts BSA Scout Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'tenderfoot_rank_reqs',
    title: '🥾 Tenderfoot Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank2.asp',
    description: 'Official Scouts BSA Tenderfoot Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'second_class_reqs',
    title: '⛺ Second Class Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank3.asp',
    description: 'Official Scouts BSA Second Class Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'first_class_reqs',
    title: '🏕️ First Class Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank4.asp',
    description: 'Official Scouts BSA First Class Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'star_rank_reqs',
    title: '⭐ Star Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank5.asp',
    description: 'Official Scouts BSA Star Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'life_rank_reqs',
    title: '⭐ Life Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank6.asp',
    description: 'Official Scouts BSA Life Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'eagle_rank_reqs',
    title: '🦅 Eagle Rank Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/rank7.asp',
    description: 'Official Scouts BSA Eagle Rank requirements, worksheets, and guide links from U.S. Scouting Service Project.'
  },
  {
    id: 'eagle_palms_reqs',
    title: '🌴 Eagle Palms Requirements (Online)',
    url: 'http://usscouts.org/advance/ScoutsBSA/palms.asp',
    description: 'Official Scouts BSA Eagle Palms requirements and guide links from U.S. Scouting Service Project.'
  },
  // --- Fillable Workbooks ---
  {
    id: 'scout_rank_workbook',
    title: '⚜️ Scout Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Scout.pdf',
    description: 'Helpful fillable workbook covering Scout Oath, Law, motto, slogan, patrol method, basic knots (square knot, half-hitches, taut-line), and pocketknife safety.'
  },
  {
    id: 'tenderfoot_rank_workbook',
    title: '🥾 Tenderfoot Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Tenderfoot.pdf',
    description: 'Helpful fillable workbook covering camping gear, cooking assistance, basic tools (knife, saw, ax), first aid (cuts, burns, snakebites), hiking buddy system, physical fitness (pushups, situps), and flag display.'
  },
  {
    id: 'second_class_workbook',
    title: '⛺ Second Class Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Second-Class.pdf',
    description: 'Comprehensive workbook covering camping sites, cooking fires/stoves, knots (sheet bend, bowline), compass navigation, animal tracking, water rescue precautions, first aid (second-degree burns, heat exhaustion), and flag ceremonies.'
  },
  {
    id: 'first_class_workbook',
    title: '🏕️ First Class Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/First-Class.pdf',
    description: 'Comprehensive workbook covering camping requirements, cooking menus, lashings, navigation (GPS & map), weather, aquatics (swimmer test), and first aid (CPR).'
  },
  {
    id: 'star_rank_workbook',
    title: '⭐ Star Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Star.pdf',
    description: 'Workbook for tracking Star Scout requirements, including 6 service hours, position of responsibility active service, and earning 6 merit badges (including 4 Eagle-required).'
  },
  {
    id: 'life_rank_workbook',
    title: '⭐ Life Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Life.pdf',
    description: 'Workbook for tracking service hours, leadership positions, Teaching EDGE method demonstration, and merit badges required for the Life Scout rank.'
  },
  {
    id: 'eagle_rank_workbook',
    title: '🦅 Eagle Rank Workbook / Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Eagle.pdf',
    description: 'Preparation workbook detailing the 21 required merit badges, position of responsibility active service, and the Eagle Scout board of review requirements.'
  },
  {
    id: 'eagle_palm_checklist',
    title: '🌴 Eagle Palm Checklist & Worksheet',
    url: 'https://usscouts.org/usscouts/workbooks/Eagle-Palm.pdf',
    description: 'Checklist for tracking Palms (Bronze, Gold, Silver) earned both concurrently with and after the Eagle Scout Board of Review.'
  },
  // --- Extra Scouting Resources & Program Helps ---
  {
    id: 'ask_andy_column',
    title: '💬 Ask Andy Scouting Advice Column',
    url: 'http://netcommissioner.com/askandy/',
    description: 'Frequently asked questions and expert advice regarding Scouts BSA policies, rank advancement, leadership, and troop operations.'
  },
  {
    id: 'baloo_bugle',
    title: '📯 Baloo\'s Bugle Program Helps',
    url: 'http://usscouts.org/bbugle.asp',
    description: 'Monthly program helps, ideas, games, and resources for scouting leaders and volunteers.'
  },
  {
    id: 'scouting_activities_db',
    title: '🎯 Scouting Activities & Games Database',
    url: 'http://usscouts.org/databases/ab2.cgi',
    description: 'A comprehensive searchable database of scouting activities, games, ceremonies, and campfire songs.'
  },
  {
    id: 'scout_camp_db',
    title: '🏕️ USSSP Scout Camp Directory & Database',
    url: 'http://usscouts.org/databases/camp/ocd.cgi',
    description: 'Directory database containing information and reviews of scouting camps across the United States.'
  },
  {
    id: 'us_flag_etiquette',
    title: '🇺🇸 U.S. Flag Etiquette & Ceremonies Guide',
    url: 'http://usscouts.org/flag.asp',
    description: 'Complete guide to the display, care, fold, history, and ceremonies for the United States flag.'
  },
  {
    id: 'campfire_stories_collection',
    title: '🔥 MacScouter\'s Campfire Stories Collection',
    url: 'http://www.macscouter.com/Stories/index.html',
    description: 'A wonderful collection of campfire stories, tales, legends, and scoutmaster minutes for troop gatherings.'
  },
  {
    id: 'scoutmaster_minutes',
    title: '⏱️ MacScouter\'s Scoutmaster Minutes Library',
    url: 'http://www.macscouter.com/Scoutmaster/index.html',
    description: 'Inspirational scoutmaster minutes, reflections, and closing thoughts categorized for patrol and troop meetings.'
  },
  {
    id: 'chow_call_recipes',
    title: '🍳 Chow Call - Camp Cooking & Dutch Oven Recipes',
    url: 'http://usscouts.org/cooking.asp',
    description: 'Outdoor camp cooking tips, patrol menus, guidelines, and detailed dutch oven recipes.'
  },
  {
    id: 'animated_knots_clipart',
    title: '🪢 Clipart & Animated Knots Library',
    url: 'http://clipart.usscouts.org/library/Scouting_Skills_and_Activities/knots/',
    description: 'High-quality clipart and step-by-step knot tying illustrations for scouting skills instruction.'
  },
  {
    id: 'scouting_fact_fiction',
    title: '💡 Scouting: Fact or Fiction?',
    url: 'http://usscouts.org/factfiction.asp',
    description: 'Clarifying myths and sharing historical truths about the origins and operations of Scouting.'
  }
];

export default function VideoResources({ currentUser, scoutId, scout }) {
  const targetScoutId = scoutId || currentUser.uid;
  const isLeaderOrOwner = currentUser.role === 'leader' || currentUser.role === 'owner';
  const isViewingScout = !!scoutId && scoutId !== currentUser.uid;

  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('videos'); // 'videos' | 'documents' | 'group'

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

  // Group Resources States
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupResources, setGroupResources] = useState([]);
  const [groupLoading, setGroupLoading] = useState(true);
  
  // Group Resource Uploader states
  const [showAddForm, setShowAddForm] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resType, setResType] = useState('document'); // 'video' | 'document' | 'link'
  const [resSourceType, setResSourceType] = useState('link'); // 'file' | 'link'
  const [resUrl, setResUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [resSuccess, setResSuccess] = useState('');
  const [resError, setResError] = useState('');

  // Sharing States
  const [sharingResource, setSharingResource] = useState(null);
  const [customShareMsg, setCustomShareMsg] = useState('');

  const handleOpenShareModal = (resource) => {
    setSharingResource(resource);
    const defaultMsg = `Salam! Here is a resource from the Taliʿa Portal:\n\n*${resource.title || 'Resource'}*\n${resource.description ? `_${resource.description}_\n` : ''}\nLink: ${resource.url || ''}`;
    setCustomShareMsg(defaultMsg);
  };

  // 1. Fetch Group List for Owners
  useEffect(() => {
    if (isOwner) {
      const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(list);
        if (list.length > 0 && !selectedGroupId) {
          setSelectedGroupId(list[0].id);
        }
      });
      return () => unsub();
    }
  }, [isOwner]);

  // Derive target group ID for resources
  // If leader, use their own groupId. If scout, use their own groupId. If owner, use selectedGroupId.
  // If leader is viewing a scout's roster detail, use the scout's groupId.
  const targetGroupId = scout?.groupId || currentUser.groupId || (isOwner ? selectedGroupId : '');

  // 2. Fetch Group Resources in real-time
  useEffect(() => {
    if (!targetGroupId) {
      setGroupLoading(false);
      return;
    }
    setGroupLoading(true);
    const q = query(collection(db, 'group_resources'), where('groupId', '==', targetGroupId));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by creation date descending
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setGroupResources(list);
      setGroupLoading(false);
    }, (err) => {
      console.error("Failed to load group resources:", err);
      setGroupLoading(false);
    });

    return () => unsub();
  }, [targetGroupId]);

  // 3. Fetch Safety Videos Progress
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

  // Group resource save handler
  const handleSaveGroupResource = async (e) => {
    e.preventDefault();
    setResSuccess('');
    setResError('');

    if (!resTitle.trim()) {
      setResError("Please enter a title.");
      return;
    }

    if (!targetGroupId) {
      setResError("Group ID not identified. Ensure the leader is assigned to a patrol.");
      return;
    }

    setUploadingFile(true);
    let finalUrl = resUrl.trim();

    try {
      // 1. Handle File Upload if selected
      if (resSourceType === 'file' && selectedFile) {
        const fileRef = ref(storage, `group_resources/${targetGroupId}/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        finalUrl = await getDownloadURL(fileRef);
      }

      if (!finalUrl) {
        throw new Error("Resource URL or uploaded file is required.");
      }

      // 2. Save metadata to Firestore
      await addDoc(collection(db, 'group_resources'), {
        title: resTitle.trim(),
        description: resDesc.trim(),
        type: resType,
        url: finalUrl,
        groupId: targetGroupId,
        createdBy: currentUser.uid,
        createdByName: currentUser.fullName || currentUser.username,
        createdAt: serverTimestamp()
      });

      setResSuccess("Resource saved successfully!");
      // Reset form
      setResTitle('');
      setResDesc('');
      setResUrl('');
      setSelectedFile(null);
      setTimeout(() => {
        setShowAddForm(false);
        setResSuccess('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setResError("Upload failed: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteGroupResource = async (resId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteDoc(doc(db, 'group_resources', resId));
    } catch (err) {
      alert("Failed to delete resource: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading resources...</div>;
  }

  // Filter Group Resources by categories
  const groupVideos = groupResources.filter(r => r.type === 'video');
  const groupDocs = groupResources.filter(r => r.type === 'document');
  const groupLinks = groupResources.filter(r => r.type === 'link');

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
      <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-750 max-w-sm">
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
        <button
          onClick={() => setActiveSubTab('group')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
            activeSubTab === 'group'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
              : 'text-slate-455 hover:text-slate-200 border border-transparent'
          }`}
        >
          Group Resources
        </button>
      </div>

      {/* Rendering Content Center */}
      {activeSubTab === 'videos' && (
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

                    <div className="flex items-center gap-3">
                      {showProgressUI && (
                        <>
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

                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                            isWatched
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-700/50 text-slate-400 border-slate-600'
                          }`}>
                            {isWatched ? 'COMPLETED' : 'INCOMPLETE'}
                          </span>

                          {isWatched && canEdit && (
                            <button
                              onClick={() => handleMarkIncomplete(video.id)}
                              className="text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border bg-red-950/20 text-red-400 border-red-900/30 hover:bg-red-900/20"
                            >
                              Mark Incomplete
                            </button>
                          )}
                        </>
                      )}

                      <button
                        onClick={() => handleOpenShareModal({ id: video.id, title: video.title, description: video.description, url: video.url })}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg p-1.5 transition flex items-center justify-center cursor-pointer border border-emerald-500/20"
                        title="Share on WhatsApp"
                      >
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

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
                      >
                        Your browser does not support HTML5 video player.
                      </video>
                    )}
                  </div>

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

                  {showProgressUI && isWatched && (
                    <div className="bg-slate-900/30 border border-slate-750/50 p-4 rounded-xl text-xs space-y-2 max-w-2xl mx-auto">
                      <div className="flex justify-between items-center text-[10px] text-slate-455 border-b border-slate-750 pb-1.5">
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
      )}

      {activeSubTab === 'documents' && (
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
              <div className="flex gap-2 sm:shrink-0">
                <a
                  href={docItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-center inline-flex items-center justify-center gap-1.5 border border-slate-650"
                >
                  View Document <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => handleOpenShareModal({ id: docItem.id, title: docItem.title, description: docItem.description, url: docItem.url })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-3 flex items-center justify-center transition cursor-pointer border border-emerald-500/20"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group Resources tab */}
      {activeSubTab === 'group' && (
        <div className="space-y-6">
          {/* Controls header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Patrol Shared Resources</h3>
              <p className="text-xs text-slate-400 mt-0.5">Custom training documents, videos, and references shared within your group.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Owner Select Group Dropdown */}
              {isOwner && groups.length > 0 && (
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name} Patrol</option>
                  ))}
                </select>
              )}

              {isLeaderOrOwner && !showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Resource
                </button>
              )}
            </div>
          </div>

          {/* Leader upload form */}
          {isLeaderOrOwner && showAddForm && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Upload / Save New Patrol Resource</h4>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveGroupResource} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Resource Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Knot Tying Practice Sheet"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Type</label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="document">📄 Document File</option>
                      <option value="video">🎥 Video Player</option>
                      <option value="link">🔗 Web URL Link</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="Provide a brief explanation of how this resource helps..."
                    value={resDesc}
                    onChange={(e) => setResDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Source Selection for Documents or Videos */}
                {resType !== 'link' && (
                  <div className="flex gap-4 p-1 bg-slate-900/40 rounded-lg max-w-xs border border-slate-750">
                    <button
                      type="button"
                      onClick={() => setResSourceType('file')}
                      className={`flex-1 py-1 text-[10px] font-bold rounded transition cursor-pointer text-center ${
                        resSourceType === 'file'
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-450 hover:text-slate-200'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setResSourceType('link')}
                      className={`flex-1 py-1 text-[10px] font-bold rounded transition cursor-pointer text-center ${
                        resSourceType === 'link'
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-450 hover:text-slate-200'
                      }`}
                    >
                      Provide Web URL
                    </button>
                  </div>
                )}

                {/* File Upload Selector */}
                {(resType === 'link' || resSourceType === 'link') ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Resource Web URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={resUrl}
                      onChange={(e) => setResUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Choose File</label>
                    <input
                      type="file"
                      required
                      accept={resType === 'video' ? 'video/mp4,video/webm' : '*'}
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full text-xs text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-slate-700 file:text-emerald-400 hover:file:bg-slate-655 file:cursor-pointer"
                    />
                  </div>
                )}

                {resSuccess && <p className="text-xs text-emerald-400 font-semibold">{resSuccess}</p>}
                {resError && <p className="text-xs text-red-400 font-semibold">{resError}</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={uploadingFile}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    {uploadingFile ? 'Uploading...' : 'Save Resource'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Group Resources Columns Listing */}
          {groupLoading ? (
            <div className="text-center py-10 text-slate-500 text-xs">Loading group assets...</div>
          ) : groupResources.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-750 rounded-2xl p-6 italic text-slate-455 text-xs">
              No files or links have been shared for this patrol yet.
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. Group Videos */}
              {groupVideos.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                    <Video size={14} className="text-emerald-400" /> Shared Videos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupVideos.map(v => (
                      <div key={v.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-md space-y-3 relative group">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h5 className="font-bold text-xs text-white leading-snug">{v.title}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">{v.description || 'No description provided.'}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenShareModal({ id: v.id, title: v.title, description: v.description, url: v.url })}
                              className="text-emerald-400 hover:text-emerald-300 transition p-1 rounded hover:bg-emerald-950/20 cursor-pointer"
                              title="Share on WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                              </svg>
                            </button>
                            {isLeaderOrOwner && (
                              <button
                                onClick={() => handleDeleteGroupResource(v.id)}
                                className="text-red-400 hover:text-red-300 transition p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                title="Delete Resource"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Player */}
                        <div className="bg-slate-900 rounded-lg overflow-hidden aspect-video">
                          {v.url.includes('youtube.com') || v.url.includes('youtu.be') ? (
                            <iframe
                              className="w-full h-full border-0"
                              src={v.url.replace('watch?v=', 'embed/')}
                              title={v.title}
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <video className="w-full h-full" src={v.url} controls preload="metadata"></video>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Group Documents */}
              {groupDocs.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={14} className="text-emerald-400" /> Shared Worksheets & Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {groupDocs.map(d => (
                      <div key={d.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center gap-4 hover:border-slate-600 transition">
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                            <FileText size={13} className="text-emerald-400" />
                            {d.title}
                          </h5>
                          <p className="text-[10px] text-slate-400">{d.description || 'No details provided.'}</p>
                          <span className="text-[9px] text-slate-455 block">Uploaded by {d.createdByName || 'Leader'}</span>
                        </div>

                         <div className="flex items-center gap-1">
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-700 hover:bg-slate-655 text-emerald-400 p-2 rounded-lg transition cursor-pointer"
                            title="Download/View File"
                          >
                            <Download size={13} />
                          </a>
                          <button
                            onClick={() => handleOpenShareModal({ id: d.id, title: d.title, description: d.description, url: d.url })}
                            className="bg-slate-700 hover:bg-slate-655 text-emerald-450 p-2 rounded-lg transition cursor-pointer flex items-center justify-center"
                            title="Share on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                            </svg>
                          </button>
                          {isLeaderOrOwner && (
                            <button
                              onClick={() => handleDeleteGroupResource(d.id)}
                              className="text-red-400 hover:text-red-300 transition p-2 rounded hover:bg-red-950/20 cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Group Links */}
              {groupLinks.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe size={14} className="text-emerald-400" /> External Web Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {groupLinks.map(l => (
                      <div key={l.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center gap-4 hover:border-slate-600 transition">
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                            <Globe size={13} className="text-emerald-400" />
                            {l.title}
                          </h5>
                          <p className="text-[10px] text-slate-400">{l.description || 'No link details.'}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-700 hover:bg-slate-655 text-slate-200 p-2 rounded-lg transition cursor-pointer"
                            title="Open Link"
                          >
                            <LinkIcon size={13} />
                          </a>
                          <button
                            onClick={() => handleOpenShareModal({ id: l.id, title: l.title, description: l.description, url: l.url })}
                            className="bg-slate-700 hover:bg-slate-655 text-emerald-450 p-2 rounded-lg transition cursor-pointer flex items-center justify-center"
                            title="Share on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                            </svg>
                          </button>
                          {isLeaderOrOwner && (
                            <button
                              onClick={() => handleDeleteGroupResource(l.id)}
                              className="text-red-400 hover:text-red-300 transition p-2 rounded hover:bg-red-950/20 cursor-pointer"
                              title="Delete Link"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* WhatsApp Share Modal */}
      {sharingResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                </svg>
                <h4 className="font-bold text-white text-sm">Share Resource on WhatsApp</h4>
              </div>
              <button
                onClick={() => setSharingResource(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-355 font-semibold mb-2">Resource: <span className="text-emerald-400">{sharingResource.title}</span></p>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customize Message</label>
              <textarea
                value={customShareMsg}
                onChange={(e) => setCustomShareMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                placeholder="Type your WhatsApp message..."
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(customShareMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSharingResource(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                </svg>
                Choose Chat / Send to WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setSharingResource(null)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
