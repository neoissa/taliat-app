import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Trash2, 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Send, 
  Download, 
  Users, 
  BarChart2, 
  Plus, 
  X, 
  Check, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Unlock, 
  Sparkles,
  Vote,
  Crown,
  Shield
} from 'lucide-react';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PatrolChat({ currentUser }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [groups, setGroups] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // { [uid]: userProfile }
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [fileData, setFileData] = useState(null); // { base64: string, name: string, type: string }
  const [uploading, setUploading] = useState(false);
  const [activeGroupData, setActiveGroupData] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const bottomRef = useRef();

  // ── Accessible Groups Filter ──
  // Troop Owner: Can view and switch to any group
  // Normal Leader / Assistant: Strictly their assigned patrol(s)
  const accessibleGroups = isOwner
    ? groups
    : groups.filter(g => 
        g.id === currentUser?.groupId || 
        g.id === currentUser?.patrolId || 
        g.leaderId === currentUser?.uid || 
        (Array.isArray(g.assignedLeaderIds) && g.assignedLeaderIds.includes(currentUser?.uid)) ||
        (Array.isArray(g.assistantLeaderIds) && g.assistantLeaderIds.includes(currentUser?.uid))
      );

  // Active chat room ID:
  // - Owner: selectedGroupId || groups[0]?.id || 'general-stream'
  // - Leader: selectedGroupId (if in accessibleGroups) || accessibleGroups[0]?.id || currentUser?.groupId || currentUser?.patrolId || 'general-stream'
  // - Scout/Parent: currentUser?.groupId || currentUser?.patrolId || 'general-stream'
  const activeRoomId = isOwner
    ? (selectedGroupId || (groups[0]?.id || 'general-stream'))
    : isLeader
    ? (accessibleGroups.some(g => g.id === selectedGroupId) ? selectedGroupId : (accessibleGroups[0]?.id || currentUser?.groupId || currentUser?.patrolId || 'general-stream'))
    : (currentUser?.groupId || currentUser?.patrolId || 'general-stream');

  // Resolve all members in the current active chat room
  const activeRoomMembers = Object.values(usersMap).filter(u => {
    if (activeRoomId === 'general-stream') return true;
    return (
      u.groupId === activeRoomId ||
      u.patrolId === activeRoomId ||
      u.uid === activeGroupData?.leaderId ||
      (Array.isArray(activeGroupData?.assignedLeaderIds) && activeGroupData.assignedLeaderIds.includes(u.uid)) ||
      (Array.isArray(activeGroupData?.assistantLeaderIds) && activeGroupData.assistantLeaderIds.includes(u.uid))
    );
  });

  const leadershipMembers = activeRoomMembers.filter(u => u.role === 'leader' || u.role === 'owner' || u.role === 'admin' || (activeGroupData?.leaderId === u.uid));
  const scoutMembers = activeRoomMembers.filter(u => u.role === 'scout' || (!u.role && u.role !== 'parent' && u.role !== 'leader' && u.role !== 'owner' && u.role !== 'admin'));
  const parentMembers = activeRoomMembers.filter(u => u.role === 'parent');

  // ── Poll Creation States ──
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollAllowMultiple, setPollAllowMultiple] = useState(false);
  const [pollSubmitting, setPollSubmitting] = useState(false);
  const [expandedPollVoters, setExpandedPollVoters] = useState({}); // { [messageId]: boolean }

  // Listen to all users to resolve live profile pictures & names for chat
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const map = {};
      snap.docs.forEach(docSnap => {
        map[docSnap.id] = { uid: docSnap.id, ...docSnap.data() };
      });
      setUsersMap(map);
    }, (err) => console.warn("Users map snapshot error in chat:", err));

    return () => unsub();
  }, []);

  // 1. Fetch groups to populate room list for Leader/Owner
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(g => !g.archived);
      setGroups(list);
      
      if (list.length > 0) {
        if (isOwner) {
          if (!selectedGroupId) setSelectedGroupId(list[0].id);
        } else if (isLeader) {
          const myGroup = list.find(g => 
            g.id === currentUser?.groupId || 
            g.id === currentUser?.patrolId || 
            g.leaderId === currentUser?.uid || 
            (Array.isArray(g.assignedLeaderIds) && g.assignedLeaderIds.includes(currentUser?.uid)) ||
            (Array.isArray(g.assistantLeaderIds) && g.assistantLeaderIds.includes(currentUser?.uid))
          );
          if (myGroup) {
            setSelectedGroupId(myGroup.id);
          } else if (currentUser?.groupId) {
            setSelectedGroupId(currentUser.groupId);
          }
        }
      }
    }, (err) => {
      console.error('Error fetching groups for chat:', err);
    });

    return () => unsub();
  }, [isOwner, isLeader, currentUser?.uid, currentUser?.groupId, currentUser?.patrolId]);

  // 2. Fetch messages for activeRoomId
  useEffect(() => {
    if (!activeRoomId) return;

    const q = query(
      collection(db, 'chats', activeRoomId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, (err) => {
      console.error('Chat snapshot error:', err);
    });

    return () => unsubscribe();
  }, [activeRoomId]);

  // 3. Fetch active group details in real-time
  useEffect(() => {
    if (!activeRoomId || activeRoomId === 'general-stream') {
      setActiveGroupData(null);
      return;
    }
    const unsub = onSnapshot(doc(db, 'groups', activeRoomId), (snap) => {
      if (snap.exists()) {
        setActiveGroupData(snap.data());
      } else {
        setActiveGroupData(null);
      }
    }, (err) => {
      console.warn("Failed to listen to active group details:", err);
    });
    return () => unsub();
  }, [activeRoomId]);

  const handleClearChat = async () => {
    if (!isOwner) return;
    if (window.confirm("🚨 WARNING: Are you sure you want to PERMANENTLY delete all messages in this stream? This cannot be undone.")) {
      try {
        const promises = messages.map(m => deleteDoc(doc(db, 'chats', activeRoomId, 'messages', m.id)));
        await Promise.all(promises);
      } catch (err) {
        console.error("Failed to clear chat:", err);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData({
        base64: reader.result,
        name: file.name,
        type: file.type
      });
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Error reading file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !fileData) || !activeRoomId) return;

    const messageText = text;
    const currentFile = fileData;

    setText('');
    setFileData(null);

    try {
      await addDoc(collection(db, 'chats', activeRoomId, 'messages'), {
        type: 'text',
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
        role: currentUser.role || 'scout',
        senderPhotoURL: currentUser?.photoURL || usersMap[currentUser?.uid]?.photoURL || null,
        fileUrl: currentFile ? currentFile.base64 : null,
        fileName: currentFile ? currentFile.name : null,
        fileType: currentFile ? currentFile.type : null,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // ── Poll Actions: Create Poll ──
  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (idx) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx, value) => {
    const updated = [...pollOptions];
    updated[idx] = value;
    setPollOptions(updated);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !activeRoomId) return;

    const cleanOptions = pollOptions.map(o => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      alert("Please enter at least 2 poll options.");
      return;
    }

    setPollSubmitting(true);
    const pollData = {
      type: 'poll',
      text: `📊 Poll: ${pollQuestion.trim()}`,
      poll: {
        question: pollQuestion.trim(),
        options: cleanOptions.map((optText, idx) => ({
          id: idx,
          text: optText,
          voterIds: [],
          voterNames: []
        })),
        allowMultiple: pollAllowMultiple,
        closed: false,
        createdBy: currentUser.uid,
        createdByName: currentUser.fullName || currentUser.username || 'Scout Leader'
      },
      senderId: currentUser.uid,
      senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
      role: currentUser.role || 'scout',
      senderPhotoURL: currentUser?.photoURL || usersMap[currentUser?.uid]?.photoURL || null,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'chats', activeRoomId, 'messages'), pollData);
      setShowPollModal(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setPollAllowMultiple(false);
    } catch (err) {
      console.error("Failed to create poll:", err);
      alert("Failed to post poll: " + err.message);
    } finally {
      setPollSubmitting(false);
    }
  };

  // ── Poll Actions: Cast Vote ──
  const handleVote = async (message, optionId) => {
    if (!currentUser?.uid || !message?.poll || message.poll.closed) return;

    const uid = currentUser.uid;
    const userName = currentUser.fullName || currentUser.username || 'Scout';
    const allowMultiple = message.poll.allowMultiple;

    const updatedOptions = message.poll.options.map(opt => {
      const alreadyVoted = (opt.voterIds || []).includes(uid);

      if (opt.id === optionId) {
        if (alreadyVoted) {
          // Toggle off if clicked again
          return {
            ...opt,
            voterIds: (opt.voterIds || []).filter(id => id !== uid),
            voterNames: (opt.voterNames || []).filter(name => name !== userName)
          };
        } else {
          // Add vote
          return {
            ...opt,
            voterIds: [...(opt.voterIds || []), uid],
            voterNames: [...(opt.voterNames || []), userName]
          };
        }
      } else {
        if (!allowMultiple) {
          // Remove vote from other options if single choice
          return {
            ...opt,
            voterIds: (opt.voterIds || []).filter(id => id !== uid),
            voterNames: (opt.voterNames || []).filter(name => name !== userName)
          };
        }
        return opt;
      }
    });

    try {
      const msgRef = doc(db, 'chats', activeRoomId, 'messages', message.id);
      await updateDoc(msgRef, {
        'poll.options': updatedOptions
      });
    } catch (err) {
      console.error("Failed to update poll vote:", err);
    }
  };

  // ── Poll Actions: Close/Reopen Poll ──
  const handleToggleClosePoll = async (message) => {
    if (!isLeaderOrOwner) return;
    try {
      const msgRef = doc(db, 'chats', activeRoomId, 'messages', message.id);
      await updateDoc(msgRef, {
        'poll.closed': !message.poll?.closed
      });
    } catch (err) {
      console.error("Failed to toggle poll status:", err);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!isLeaderOrOwner) return;
    if (window.confirm("Delete this message?")) {
      try {
        await deleteDoc(doc(db, 'chats', activeRoomId, 'messages', msgId));
      } catch (err) {
        console.error('Failed to delete message:', err);
      }
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[580px] shadow-xl overflow-hidden print-hide relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        {/* Clickable Patrol Header */}
        <div 
          onClick={() => setShowMembersModal(true)}
          className="flex items-center gap-3 cursor-pointer group hover:bg-slate-750/70 p-2 -m-1 rounded-2xl transition max-w-full sm:max-w-md select-none"
          title="Click to view all people & leaders in this chat"
        >
          {activeGroupData?.photoURL ? (
            <img 
              src={activeGroupData.photoURL} 
              alt="Group Icon" 
              className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/40 group-hover:border-emerald-400 group-hover:scale-105 transition shrink-0 shadow-sm" 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition shrink-0">
              <Users size={18} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight flex items-center gap-2 flex-wrap">
              <span className="truncate group-hover:text-emerald-300 transition">
                {activeGroupData?.name ? `${activeGroupData.name} Patrol` : (activeRoomId === 'general-stream' ? 'General Stream' : 'Patrol Chat')}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-mono shrink-0">
                Live Chat & Polls
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                <Users size={11} /> {activeRoomMembers.length} {activeRoomMembers.length === 1 ? 'member' : 'members'} &bull; Click to view roster
              </span>
              {activeGroupData?.motto && (
                <span className="text-slate-500 hidden md:inline">&bull; &ldquo;{activeGroupData.motto}&rdquo;</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Dedicated View Roster Button */}
          <button
            onClick={() => setShowMembersModal(true)}
            className="bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="View all people in this chat group"
          >
            <Users size={13} className="text-emerald-400" />
            <span>Roster ({activeRoomMembers.length})</span>
          </button>

          {/* Quick Create Poll Button */}
          <button
            onClick={() => setShowPollModal(true)}
            className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <BarChart2 size={13} />
            <span>Ask with Poll</span>
          </button>

          {/* Clear Chat Button (Owner Only) */}
          {isOwner && activeRoomId && (
            <button
              onClick={handleClearChat}
              className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 hover:border-red-500 text-red-400 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
              title="Clear all messages in this stream"
            >
              Clear Chat
            </button>
          )}

          {/* Room Switcher: STRICTLY Troop Owner or Leaders with >1 assigned patrols */}
          {(isOwner || (isLeader && accessibleGroups.length > 1)) && (
            <div className="flex items-center gap-1.5">
              <select
                value={activeRoomId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {isOwner && <option value="general-stream">🌐 General Stream</option>}
                {(isOwner ? groups : accessibleGroups).map(g => (
                  <option key={g.id} value={g.id}>👥 {g.name} Patrol</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!activeRoomId ? (
          <div className="text-center py-12 text-slate-500 text-xs">Select a patrol stream above.</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">No messages yet. Start chatting or create a poll!</div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === currentUser?.uid;
            const prev = messages[i - 1];
            const isGrouped = prev && prev.senderId === m.senderId && prev.type !== 'poll' && m.type !== 'poll';
            const isPoll = m.type === 'poll' || !!m.poll;

            // Live user profile data for sender
            const senderUser = usersMap[m.senderId] || {};
            const senderAvatar = senderUser.photoURL || (isMe ? currentUser?.photoURL : null) || m.senderPhotoURL;
            const senderDisplayName = senderUser.fullName || m.senderName || senderUser.username || 'Scout';

            return (
              <div key={m.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse items-end' : 'items-start'} ${isGrouped ? 'mt-0.5' : 'mt-3'} group relative`}>
                {!isGrouped ? (
                  senderAvatar ? (
                    <img
                      src={senderAvatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500/50 shrink-0 mt-1 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 uppercase mt-1">
                      {senderDisplayName.charAt(0)}
                    </div>
                  )
                ) : (
                  <div className="w-8 shrink-0" />
                )}

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
                  {!isGrouped && (
                    <div className={`flex items-center gap-1.5 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-semibold text-slate-300">{senderDisplayName}</span>
                      {m.role === 'owner' ? (
                        <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 leading-none font-bold uppercase">
                          Admin
                        </span>
                      ) : m.role === 'leader' ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 leading-none font-bold uppercase">
                          Leader
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600 leading-none font-bold uppercase">
                          Scout
                        </span>
                      )}
                    </div>
                  )}

                  <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''} max-w-full`}>
                    {/* ── 1. RENDER POLL CARD ── */}
                    {isPoll ? (
                      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 w-full max-w-md shadow-xl space-y-3.5">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                              📊
                            </span>
                            <div>
                              <h4 className="font-extrabold text-white text-xs leading-tight">
                                {m.poll.question}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {m.poll.allowMultiple ? 'Multiple choices allowed' : 'Single vote'} • {m.poll.closed ? '🔒 Poll Closed' : 'Active Poll'}
                              </p>
                            </div>
                          </div>

                          {isLeaderOrOwner && (
                            <button
                              onClick={() => handleToggleClosePoll(m)}
                              className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md border border-slate-700 transition cursor-pointer shrink-0"
                            >
                              {m.poll.closed ? 'Reopen' : 'Close'}
                            </button>
                          )}
                        </div>

                        {/* Options List */}
                        {(() => {
                          const totalVotes = m.poll.options.reduce((sum, opt) => sum + (opt.voterIds?.length || 0), 0);
                          const userHasVoted = m.poll.options.some(opt => (opt.voterIds || []).includes(currentUser?.uid));

                          return (
                            <div className="space-y-2">
                              {m.poll.options.map(opt => {
                                const voteCount = opt.voterIds?.length || 0;
                                const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                                const isUserVoted = (opt.voterIds || []).includes(currentUser?.uid);

                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    disabled={m.poll.closed}
                                    onClick={() => handleVote(m, opt.id)}
                                    className={`w-full text-left p-2.5 rounded-xl border transition relative overflow-hidden flex flex-col gap-1 ${
                                      isUserVoted
                                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                                    } ${m.poll.closed ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                                  >
                                    {/* Background Progress Bar */}
                                    <div
                                      className={`absolute left-0 top-0 bottom-0 transition-all duration-500 pointer-events-none opacity-25 ${
                                        isUserVoted ? 'bg-emerald-500' : 'bg-slate-600'
                                      }`}
                                      style={{ width: `${percent}%` }}
                                    />

                                    <div className="relative z-10 flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          isUserVoted ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-500'
                                        }`}>
                                          {isUserVoted && <Check size={10} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-xs font-semibold truncate ${isUserVoted ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                                          {opt.text}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                                        <span className="font-bold text-white">{percent}%</span>
                                        <span className="text-[10px] text-slate-400">({voteCount})</span>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}

                              {/* Poll Footer: Total votes & view voters toggle */}
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total</span>
                                <button
                                  type="button"
                                  onClick={() => setExpandedPollVoters(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                                  className="text-emerald-400 hover:underline cursor-pointer"
                                >
                                  {expandedPollVoters[m.id] ? 'Hide Voters' : 'View Voters'}
                                </button>
                              </div>

                              {/* Expanded voters list */}
                              {expandedPollVoters[m.id] && (
                                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px] animate-fadeIn">
                                  {m.poll.options.map(opt => (
                                    <div key={opt.id} className="text-slate-300 flex items-start gap-1.5">
                                      <strong className="text-emerald-400">{opt.text}:</strong>
                                      <span>
                                        {opt.voterNames && opt.voterNames.length > 0 
                                          ? opt.voterNames.join(', ') 
                                          : 'No votes yet'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      /* ── 2. RENDER STANDARD CHAT MESSAGE ── */
                      <div
                        className={`px-4 py-2.5 max-w-[80%] text-sm break-words leading-relaxed space-y-2 relative ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
                            : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
                        }`}
                      >
                        {m.text && <p>{m.text}</p>}

                        {m.fileUrl && (
                          <div className="mt-1.5 p-2 bg-black/20 rounded-lg flex items-center gap-2 max-w-sm">
                            {m.fileType?.startsWith('image/') ? (
                              <div className="space-y-1">
                                <img src={m.fileUrl} alt={m.fileName} className="max-h-40 rounded object-contain border border-slate-700" />
                                <a
                                  href={m.fileUrl}
                                  download={m.fileName}
                                  className="text-[10px] text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
                                >
                                  <Download size={10} /> Save Image ({m.fileName})
                                </a>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FileText size={20} className="text-slate-300" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs truncate font-medium text-slate-200">{m.fileName}</p>
                                  <a
                                    href={m.fileUrl}
                                    download={m.fileName}
                                    className="text-[10px] text-emerald-300 hover:underline flex items-center gap-1 mt-0.5"
                                  >
                                    <Download size={10} /> Download File
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <span className="text-[9px] text-slate-500 shrink-0 pb-0.5 font-mono">{formatTime(m.timestamp)}</span>

                    {isLeaderOrOwner && (
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-red-400 text-slate-500 rounded cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── CREATE POLL MODAL / POPOVER ── */}
      {showPollModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <BarChart2 className="text-emerald-400" size={18} />
                <span>Create Patrol Poll / Vote</span>
              </h3>
              <button
                onClick={() => setShowPollModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Poll Question / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What time should we meet for Saturday's hike?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Poll Options ({pollOptions.length}/6)
                </label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1 pt-1"
                  >
                    <Plus size={13} /> Add Another Option
                  </button>
                )}
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Allow Multiple Answers</span>
                <input
                  type="checkbox"
                  checked={pollAllowMultiple}
                  onChange={(e) => setPollAllowMultiple(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={pollSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  <BarChart2 size={14} />
                  <span>{pollSubmitting ? 'Posting...' : 'Post Poll to Patrol'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 3. PATROL CHAT MEMBERS ROSTER MODAL ── */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  {activeGroupData?.photoURL ? (
                    <img src={activeGroupData.photoURL} alt={activeGroupData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">👥</span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {activeGroupData?.name ? `${activeGroupData.name} Patrol` : (activeRoomId === 'general-stream' ? 'General Troop Stream' : 'Patrol Chat')}
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
                    <span>👥 {activeRoomMembers.length} {activeRoomMembers.length === 1 ? 'Member' : 'Members'} in Chat</span>
                    {activeGroupData?.motto && (
                      <span className="text-slate-400 font-normal italic">&bull; &ldquo;{activeGroupData.motto}&rdquo;</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMembersModal(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {/* Leadership Section */}
              {leadershipMembers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Crown size={13} />
                      <span>Patrol Leadership ({leadershipMembers.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {leadershipMembers.map(m => {
                      const isOwnerUser = m.role === 'owner' || m.email === 'neoissa@gmail.com';
                      const posLabel = m.leaderPosition || (isOwnerUser ? 'Troop Headmaster / Owner' : 'Patrol Leader');
                      return (
                        <div key={m.uid} className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex items-center justify-between gap-3 transition">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-sm shrink-0 overflow-hidden">
                              {m.photoURL ? (
                                <img src={m.photoURL} alt={m.fullName || m.username} className="w-full h-full object-cover" />
                              ) : (
                                <span>{m.fullName?.charAt(0) || m.username?.charAt(0) || 'L'}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-white truncate">{m.fullName || m.username}</span>
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                                  {isOwnerUser ? 'OWNER' : 'LEADER'}
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
                                {posLabel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {m.username && <span className="text-[10px] text-slate-400 font-mono block">@{m.username}</span>}
                            {m.scoutPhone || m.phone ? (
                              <span className="text-[10px] text-slate-500 font-mono">{m.scoutPhone || m.phone}</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Scouts Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Users size={13} />
                    <span>Patrol Scouts ({scoutMembers.length})</span>
                  </span>
                </div>
                {scoutMembers.length === 0 ? (
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-500 italic">
                    No scouts currently registered in this patrol.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {scoutMembers.map(s => (
                      <div key={s.uid} className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex items-center justify-between gap-3 transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-700/10 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm shrink-0 overflow-hidden">
                            {s.photoURL ? (
                              <img src={s.photoURL} alt={s.fullName || s.username} className="w-full h-full object-cover" />
                            ) : (
                              <span>{s.fullName?.charAt(0) || s.username?.charAt(0) || 'S'}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-white truncate">{s.fullName || s.username}</span>
                              {s.rank && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-1.5 py-0.2 rounded font-mono font-medium">
                                  {s.rank}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {s.schoolGrade ? `${s.schoolGrade} • ` : ''}@{s.username || 'scout'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {s.bsaId ? (
                            <span className="text-[10px] text-slate-400 font-mono block">BSA ID: {s.bsaId}</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Parents Section (if any linked parents) */}
              {parentMembers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <span>👨‍👩‍👧 Family Guardians ({parentMembers.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {parentMembers.map(p => (
                      <div key={p.uid} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0">
                            {p.fullName?.charAt(0) || 'P'}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white truncate block">{p.fullName || p.username}</span>
                            <span className="text-[10px] text-slate-400">Guardian</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Lock size={12} className="text-emerald-400" />
                <span>Private stream for this patrol only.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMembersModal(false)}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload preview state info */}
      {fileData && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-700 flex items-center justify-between text-xs text-emerald-400">
          <span className="flex items-center gap-1 truncate max-w-xs font-semibold">
            <Paperclip size={12} /> Ready to send: {fileData.name}
          </span>
          <button
            onClick={() => setFileData(null)}
            className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Emoji picker popover */}
      {showEmojis && (
        <div className="absolute bottom-16 right-4 bg-slate-950 border border-slate-700 p-3 rounded-2xl shadow-2xl z-50">
          <p className="text-[9px] uppercase font-bold text-slate-500 mb-2 tracking-wider text-center">Select Emoji</p>
          <div className="grid grid-cols-4 gap-2">
            {['😀','😂','😍','👍','🎉','🔥','👏','❤️','🚨','⛺','🌲','⚜️','🙌','👀','✨','🎈'].map(e => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  setText(prev => prev + e);
                  setShowEmojis(false);
                }}
                className="text-lg hover:scale-125 transition p-1 cursor-pointer bg-transparent border-0 focus:outline-none"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex items-center gap-2 relative">
        {/* File attachment button */}
        <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-700 shrink-0" title="Attach file">
          <Paperclip size={18} />
          <input
            type="file"
            onChange={handleFileChange}
            disabled={!activeRoomId || uploading}
            className="hidden"
          />
        </label>

        {/* Create Poll Button */}
        <button
          type="button"
          onClick={() => setShowPollModal(true)}
          disabled={!activeRoomId}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 rounded-xl transition cursor-pointer border border-slate-700 shrink-0"
          title="Create a Poll / Vote"
        >
          <BarChart2 size={18} />
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          disabled={!activeRoomId}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-700 shrink-0"
          title="Add Emoji"
        >
          😊
        </button>

        <input
          type="text"
          disabled={!activeRoomId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={activeRoomId ? "Type a message or ask with a poll..." : "Select patrol room..."}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
        />
        
        <button
          type="submit"
          disabled={!activeRoomId || uploading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Send size={14} /> Send
        </button>
      </form>
    </div>
  );
}
