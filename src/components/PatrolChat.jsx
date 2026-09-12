import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  setDoc,
  getDoc,
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
  Shield,
  SmilePlus,
  Smile,
  Heart,
  Search,
  Mic,
  MicOff,
  Play,
  Pause,
  Star,
  Pin,
  PinOff,
  Reply,
  CheckCheck,
  MoreVertical,
  Copy,
  Edit2,
  Bookmark,
  Volume2,
  VolumeX,
  ChevronDown
} from 'lucide-react';

const QUICK_REACTION_EMOJIS = ['👍', '❤️', '⚜️', '🔥', '😂', '👏', '🎉', '💪', '🏕️', '✨'];

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  const date1 = d1.toDate ? d1.toDate() : new Date(d1);
  const date2 = d2.toDate ? d2.toDate() : new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDateSeparator(timestamp) {
  if (!timestamp) return 'Today';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
}

function formatAudioDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PatrolChat({ currentUser }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;

  // ── Core Message & Room State ──
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [groups, setGroups] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // { [uid]: userProfile }
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [fileData, setFileData] = useState(null); // { base64: string, name: string, type: string }
  const [uploading, setUploading] = useState(false);
  const [activeGroupData, setActiveGroupData] = useState(null);
  const [roomMetadata, setRoomMetadata] = useState({}); // Pinned messages, description
  
  // ── Modals & Popovers ──
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showStarredDrawer, setShowStarredDrawer] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
  
  // ── WhatsApp Reply-To Quoting ──
  const [replyingTo, setReplyingTo] = useState(null); // message object or null
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  // ── WhatsApp In-Chat Search ──
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);

  // ── WhatsApp Message Editing ──
  const [editingMessage, setEditingMessage] = useState(null); // { id: string, text: string }

  // ── WhatsApp Voice Note Recording ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // ── WhatsApp Audio Playback Engine ──
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 1
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioElementRef = useRef(null);

  // ── Typing Indicator ──
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef(null);

  // ── Toast Feedback ──
  const [toastMessage, setToastMessage] = useState('');

  // ── Poll Creation States ──
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollAllowMultiple, setPollAllowMultiple] = useState(false);
  const [pollSubmitting, setPollSubmitting] = useState(false);
  const [expandedPollVoters, setExpandedPollVoters] = useState({}); // { [messageId]: boolean }

  const bottomRef = useRef();
  const chatContainerRef = useRef();
  const fileInputRef = useRef();
  const imageInputRef = useRef();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // ── Accessible Groups Filter ──
  const accessibleGroups = isOwner
    ? groups
    : groups.filter(g => 
        g.id === currentUser?.groupId || 
        g.id === currentUser?.patrolId || 
        g.leaderId === currentUser?.uid || 
        (Array.isArray(g.assignedLeaderIds) && g.assignedLeaderIds.includes(currentUser?.uid)) ||
        (Array.isArray(g.assistantLeaderIds) && g.assistantLeaderIds.includes(currentUser?.uid))
      );

  // Active chat room ID
  const activeRoomId = isOwner
    ? (selectedGroupId || (groups[0]?.id || 'general-stream'))
    : isLeader
    ? (accessibleGroups.some(g => g.id === selectedGroupId) ? selectedGroupId : (accessibleGroups[0]?.id || currentUser?.groupId || currentUser?.patrolId || 'general-stream'))
    : (currentUser?.groupId || currentUser?.patrolId || 'general-stream');

  // Resolve all members in active chat
  const activeRoomMembers = useMemo(() => {
    return Object.values(usersMap).filter(u => {
      if (activeRoomId === 'general-stream') return true;
      return (
        u.groupId === activeRoomId ||
        u.patrolId === activeRoomId ||
        u.uid === activeGroupData?.leaderId ||
        (Array.isArray(activeGroupData?.assignedLeaderIds) && activeGroupData.assignedLeaderIds.includes(u.uid)) ||
        (Array.isArray(activeGroupData?.assistantLeaderIds) && activeGroupData.assistantLeaderIds.includes(u.uid))
      );
    });
  }, [usersMap, activeRoomId, activeGroupData]);

  const leadershipMembers = activeRoomMembers.filter(u => u.role === 'leader' || u.role === 'owner' || u.role === 'admin' || (activeGroupData?.leaderId === u.uid));
  const scoutMembers = activeRoomMembers.filter(u => u.role === 'scout' || (!u.role && u.role !== 'parent' && u.role !== 'leader' && u.role !== 'owner' && u.role !== 'admin'));
  const parentMembers = activeRoomMembers.filter(u => u.role === 'parent');

  // ── 1. Fetch Users Roster for Avatars & Live Details ──
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

  // ── 2. Fetch Groups ──
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
    }, (err) => console.error('Error fetching groups for chat:', err));

    return () => unsub();
  }, [isOwner, isLeader, currentUser?.uid, currentUser?.groupId, currentUser?.patrolId]);

  // ── 3. Fetch Messages for activeRoomId ──
  useEffect(() => {
    if (!activeRoomId) return;

    const q = query(
      collection(db, 'chats', activeRoomId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(150)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }, (err) => {
      console.error('Chat snapshot error:', err);
    });

    return () => unsubscribe();
  }, [activeRoomId]);

  // ── 4. Fetch Active Group Details & Room Metadata (Pinned Messages) ──
  useEffect(() => {
    if (!activeRoomId || activeRoomId === 'general-stream') {
      setActiveGroupData(null);
      setRoomMetadata({});
      return;
    }

    const unsubGroup = onSnapshot(doc(db, 'groups', activeRoomId), (snap) => {
      if (snap.exists()) {
        setActiveGroupData(snap.data());
      } else {
        setActiveGroupData(null);
      }
    }, (err) => console.warn("Failed to listen to group details:", err));

    const unsubRoom = onSnapshot(doc(db, 'chats', activeRoomId), (snap) => {
      if (snap.exists()) {
        setRoomMetadata(snap.data() || {});
      } else {
        setRoomMetadata({});
      }
    }, (err) => console.warn("Failed to listen to room metadata:", err));

    return () => {
      unsubGroup();
      unsubRoom();
    };
  }, [activeRoomId]);

  // ── 5. Listen to Typing Status in Room ──
  useEffect(() => {
    if (!activeRoomId) return;

    const unsubTyping = onSnapshot(collection(db, 'chats', activeRoomId, 'typing'), (snap) => {
      const activeTypers = {};
      const now = Date.now();
      snap.docs.forEach(d => {
        const data = d.data();
        if (d.id !== currentUser?.uid && data.isTyping) {
          if (!data.updatedAt || (now - data.updatedAt < 4500)) {
            activeTypers[d.id] = data.name || 'A scout';
          }
        }
      });
      setTypingUsers(activeTypers);
    }, (err) => console.warn("Typing listener error:", err));

    return () => unsubTyping();
  }, [activeRoomId, currentUser?.uid]);

  // Broadcast user typing state
  const handleTyping = (val) => {
    setText(val);
    if (!activeRoomId || !currentUser?.uid) return;

    try {
      const typingDocRef = doc(db, 'chats', activeRoomId, 'typing', currentUser.uid);
      setDoc(typingDocRef, {
        isTyping: val.length > 0,
        name: currentUser.fullName || currentUser.username || 'Scout',
        updatedAt: Date.now()
      }, { merge: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setDoc(typingDocRef, { isTyping: false, updatedAt: Date.now() }, { merge: true });
      }, 3000);
    } catch (err) {
      console.warn("Typing broadcast error:", err);
    }
  };

  // ── WhatsApp In-Chat Search Matches ──
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const queryLower = searchQuery.toLowerCase().trim();
    return messages
      .map((m, idx) => ({ ...m, originalIndex: idx }))
      .filter(m => (m.text && m.text.toLowerCase().includes(queryLower)) || (m.fileName && m.fileName.toLowerCase().includes(queryLower)));
  }, [messages, searchQuery]);

  const handleNextSearchMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIdx = (searchIndex + 1) % searchMatches.length;
    setSearchIndex(nextIdx);
    jumpToMessage(searchMatches[nextIdx].id);
  };

  const handlePrevSearchMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIdx = (searchIndex - 1 + searchMatches.length) % searchMatches.length;
    setSearchIndex(prevIdx);
    jumpToMessage(searchMatches[prevIdx].id);
  };

  // ── Jump to specific message with highlight flash ──
  const jumpToMessage = (msgId) => {
    if (!msgId) return;
    const element = document.getElementById(`chat-msg-${msgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(msgId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    } else {
      showToast("Original message is further up in history.");
    }
  };

  // ── File Selection Handler ──
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
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
      setShowAttachmentMenu(false);
    };
    reader.onerror = () => {
      alert("Error reading file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // ── Send Standard / Attachment / Reply Message ──
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !fileData) || !activeRoomId) return;

    const messageText = text.trim();
    const currentFile = fileData;
    const currentReply = replyingTo;

    setText('');
    setFileData(null);
    setReplyingTo(null);
    setShowEmojis(false);

    // Reset typing status
    if (currentUser?.uid) {
      setDoc(doc(db, 'chats', activeRoomId, 'typing', currentUser.uid), { isTyping: false, updatedAt: Date.now() }, { merge: true });
    }

    try {
      const payload = {
        type: currentFile ? (currentFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
        role: currentUser.role || 'scout',
        senderPhotoURL: currentUser?.photoURL || usersMap[currentUser?.uid]?.photoURL || null,
        fileUrl: currentFile ? currentFile.base64 : null,
        fileName: currentFile ? currentFile.name : null,
        fileType: currentFile ? currentFile.type : null,
        timestamp: serverTimestamp(),
        delivered: true,
        read: true,
        starredBy: {},
        reactions: {}
      };

      if (currentReply) {
        payload.replyTo = {
          id: currentReply.id,
          senderName: currentReply.senderName || 'Scout',
          text: currentReply.text || currentReply.fileName || (currentReply.type === 'poll' ? currentReply.poll?.question : 'Attachment'),
          type: currentReply.type || 'text',
          fileType: currentReply.fileType || null,
          role: currentReply.role || 'scout'
        };
      }

      await addDoc(collection(db, 'chats', activeRoomId, 'messages'), payload);
    } catch (err) {
      console.error('Failed to send message:', err);
      showToast('Failed to send: ' + err.message);
    }
  };

  // ── WhatsApp Voice Note: Recording Engine ──
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          if (base64Audio && recordingDuration > 0) {
            await sendVoiceNoteMessage(base64Audio, recordingDuration);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setShowAttachmentMenu(false);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Audio recording permission error:", err);
      alert("Microphone access is required to record voice notes.");
    }
  };

  const handleStopAndSendRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      showToast("Voice memo cancelled");
    }
  };

  const sendVoiceNoteMessage = async (audioBase64, durationSecs) => {
    if (!activeRoomId || !currentUser?.uid) return;

    try {
      const payload = {
        type: 'voice',
        text: '🎙️ Voice Note',
        audioUrl: audioBase64,
        audioDuration: durationSecs,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
        role: currentUser.role || 'scout',
        senderPhotoURL: currentUser?.photoURL || usersMap[currentUser?.uid]?.photoURL || null,
        timestamp: serverTimestamp(),
        delivered: true,
        read: true,
        starredBy: {},
        reactions: {}
      };

      if (replyingTo) {
        payload.replyTo = {
          id: replyingTo.id,
          senderName: replyingTo.senderName || 'Scout',
          text: replyingTo.text || replyingTo.fileName || 'Attachment',
          type: replyingTo.type || 'text',
          role: replyingTo.role || 'scout'
        };
        setReplyingTo(null);
      }

      await addDoc(collection(db, 'chats', activeRoomId, 'messages'), payload);
      showToast("Voice note sent!");
    } catch (err) {
      console.error("Failed to send voice note:", err);
    }
  };

  // ── WhatsApp Audio Player Handler ──
  const handleTogglePlayAudio = (message) => {
    if (playingAudioId === message.id) {
      if (audioElementRef.current) {
        if (audioElementRef.current.paused) {
          audioElementRef.current.play();
        } else {
          audioElementRef.current.pause();
          setPlayingAudioId(null);
        }
      }
    } else {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      const audio = new Audio(message.audioUrl);
      audio.playbackRate = playbackRate;
      audioElementRef.current = audio;
      setPlayingAudioId(message.id);
      setAudioCurrentTime(0);
      setAudioProgress(0);

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioCurrentTime(audio.currentTime);
          setAudioProgress(audio.currentTime / audio.duration);
        }
      };

      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioProgress(0);
        setAudioCurrentTime(0);
      };

      audio.play().catch(e => console.warn("Audio play blocked:", e));
    }
  };

  const handleCyclePlaybackRate = (e) => {
    e.stopPropagation();
    const rates = [1, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = newRate;
    }
  };

  // ── WhatsApp Star / Unstar Message ──
  const handleToggleStar = async (message) => {
    if (!currentUser?.uid || !activeRoomId || !message?.id) return;
    const isStarred = !!message.starredBy?.[currentUser.uid];
    try {
      const msgRef = doc(db, 'chats', activeRoomId, 'messages', message.id);
      await updateDoc(msgRef, {
        [`starredBy.${currentUser.uid}`]: !isStarred
      });
      showToast(!isStarred ? "Message starred ⭐" : "Message unstarred");
    } catch (err) {
      console.error("Star toggle error:", err);
    } finally {
      setActiveMenuMessageId(null);
    }
  };

  // ── WhatsApp Pin / Unpin Message (Sticky Top Banner) ──
  const handleTogglePinMessage = async (message) => {
    if (!isLeaderOrOwner || !activeRoomId) return;
    const isCurrentlyPinned = roomMetadata.pinnedMessage?.id === message.id;
    try {
      const roomRef = doc(db, 'chats', activeRoomId);
      if (isCurrentlyPinned) {
        await setDoc(roomRef, { pinnedMessage: null }, { merge: true });
        showToast("Message unpinned");
      } else {
        await setDoc(roomRef, {
          pinnedMessage: {
            id: message.id,
            text: message.text || message.fileName || (message.type === 'poll' ? message.poll?.question : 'Voice Note'),
            senderName: message.senderName || 'Scout',
            pinnedAt: new Date().toISOString()
          }
        }, { merge: true });
        showToast("Message pinned to top 📌");
      }
    } catch (err) {
      console.error("Failed to pin message:", err);
    } finally {
      setActiveMenuMessageId(null);
    }
  };

  // ── WhatsApp Copy Message Text ──
  const handleCopyText = (message) => {
    const textToCopy = message.text || message.fileName || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      showToast("Copied to clipboard 📋");
    }
    setActiveMenuMessageId(null);
  };

  // ── WhatsApp Edit Message ──
  const handleStartEdit = (message) => {
    if (message.senderId !== currentUser?.uid) return;
    setEditingMessage({ id: message.id, text: message.text || '' });
    setActiveMenuMessageId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !editingMessage.text.trim() || !activeRoomId) return;
    try {
      const msgRef = doc(db, 'chats', activeRoomId, 'messages', editingMessage.id);
      await updateDoc(msgRef, {
        text: editingMessage.text.trim(),
        edited: true,
        editedAt: serverTimestamp()
      });
      showToast("Message updated (edited)");
      setEditingMessage(null);
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  };

  // ── WhatsApp Soft Delete / Hard Delete ──
  const handleDeleteMessage = async (message, forEveryone = true) => {
    if (!activeRoomId || !message?.id) return;
    const canDelete = isLeaderOrOwner || message.senderId === currentUser?.uid;
    if (!canDelete) return;

    if (window.confirm("Delete this message?")) {
      try {
        if (forEveryone && !isOwner) {
          const msgRef = doc(db, 'chats', activeRoomId, 'messages', message.id);
          await updateDoc(msgRef, {
            text: '🚫 This message was deleted',
            type: 'deleted',
            deleted: true,
            fileUrl: null,
            fileName: null,
            audioUrl: null,
            poll: null
          });
          showToast("Message deleted");
        } else {
          await deleteDoc(doc(db, 'chats', activeRoomId, 'messages', message.id));
          showToast("Message permanently removed");
        }
      } catch (err) {
        console.error('Failed to delete message:', err);
      } finally {
        setActiveMenuMessageId(null);
      }
    }
  };

  // ── Clear Chat (Owner only) ──
  const handleClearChat = async () => {
    if (!isOwner) return;
    if (window.confirm("🚨 WARNING: Are you sure you want to PERMANENTLY delete all messages in this stream? This cannot be undone.")) {
      try {
        const promises = messages.map(m => deleteDoc(doc(db, 'chats', activeRoomId, 'messages', m.id)));
        await Promise.all(promises);
        showToast("Chat cleared");
      } catch (err) {
        console.error("Failed to clear chat:", err);
      }
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
      timestamp: serverTimestamp(),
      delivered: true,
      read: true,
      starredBy: {},
      reactions: {}
    };

    try {
      await addDoc(collection(db, 'chats', activeRoomId, 'messages'), pollData);
      setShowPollModal(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setPollAllowMultiple(false);
      showToast("Poll posted!");
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
          return {
            ...opt,
            voterIds: (opt.voterIds || []).filter(id => id !== uid),
            voterNames: (opt.voterNames || []).filter(name => name !== userName)
          };
        } else {
          return {
            ...opt,
            voterIds: [...(opt.voterIds || []), uid],
            voterNames: [...(opt.voterNames || []), userName]
          };
        }
      } else {
        if (!allowMultiple) {
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

  const handleToggleClosePoll = async (message) => {
    if (!isLeaderOrOwner) return;
    try {
      const msgRef = doc(db, 'chats', activeRoomId, 'messages', message.id);
      await updateDoc(msgRef, {
        'poll.closed': !message.poll?.closed
      });
      showToast(message.poll?.closed ? "Poll reopened" : "Poll closed");
    } catch (err) {
      console.error("Failed to toggle poll status:", err);
    }
  };

  // ── Emoji Reactions Handler ──
  const handleToggleReaction = async (message, emoji) => {
    if (!currentUser?.uid || !activeRoomId || !message?.id) return;
    const uid = currentUser.uid;
    const userName = currentUser.fullName || currentUser.username || currentUser.email?.split('@')[0] || 'Scout';

    const currentReactions = message.reactions || {};
    const emojiMap = currentReactions[emoji] ? { ...currentReactions[emoji] } : {};

    if (emojiMap[uid]) {
      delete emojiMap[uid];
    } else {
      emojiMap[uid] = userName;
    }

    const updatedReactions = { ...currentReactions };
    if (Object.keys(emojiMap).length > 0) {
      updatedReactions[emoji] = emojiMap;
    } else {
      delete updatedReactions[emoji];
    }

    try {
      const msgRef = doc(db, 'chats', activeRoomId, 'messages', message.id);
      await updateDoc(msgRef, { reactions: updatedReactions });
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    } finally {
      setActiveReactionMessageId(null);
    }
  };

  // ── Starred Messages List Filter ──
  const starredMessages = useMemo(() => {
    if (!currentUser?.uid) return [];
    return messages.filter(m => !!m.starredBy?.[currentUser.uid]);
  }, [messages, currentUser?.uid]);

  const typingNames = Object.values(typingUsers);

  return (
    <div className="bg-slate-900 border border-slate-750 rounded-2xl flex flex-col h-[calc(100vh-140px)] min-h-[540px] max-h-[760px] shadow-2xl overflow-hidden print-hide relative select-none">
      
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 border border-emerald-500/60 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-1.5">
          <Sparkles size={13} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. WHATSAPP HEADER ── */}
      <div className="p-3 sm:p-4 border-b border-slate-750 bg-slate-850/95 backdrop-blur-md flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 z-20 shrink-0">
        
        {/* Left: Avatar & Patrol Info */}
        <div 
          onClick={() => setShowMembersModal(true)}
          className="flex items-center gap-3 cursor-pointer group hover:bg-slate-800/80 p-1.5 -m-1 rounded-2xl transition max-w-full sm:max-w-md select-none"
          title="Click to view all patrol members & leaders"
        >
          <div className="relative shrink-0">
            {activeGroupData?.photoURL ? (
              <img 
                src={activeGroupData.photoURL} 
                alt="Group Icon" 
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50 group-hover:border-emerald-400 group-hover:scale-105 transition shadow-sm" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition">
                <Users size={18} />
              </div>
            )}
            <span className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute bottom-0 right-0" title="Live stream active" />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight flex items-center gap-2 flex-wrap">
              <span className="truncate group-hover:text-emerald-300 transition">
                {activeGroupData?.name ? `${activeGroupData.name} Patrol` : (activeRoomId === 'general-stream' ? 'General Troop Stream' : 'Patrol Chat')}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-mono shrink-0">
                Live Chat
              </span>
            </h3>
            
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap truncate">
              {typingNames.length > 0 ? (
                <span className="text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                  <span>🟢 {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...</span>
                </span>
              ) : (
                <span className="text-slate-400 group-hover:text-emerald-400 transition flex items-center gap-1">
                  <Users size={11} /> {activeRoomMembers.length} {activeRoomMembers.length === 1 ? 'member' : 'members'} &bull; Tap for roster
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Header Action Icons */}
        <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
          
          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery('');
            }}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              showSearch 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Search messages in chat"
          >
            <Search size={16} />
          </button>

          {/* Starred Messages Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowStarredDrawer(true)}
            className="p-2 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-700 transition cursor-pointer relative"
            title="View Starred Messages"
          >
            <Star size={16} />
            {starredMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center">
                {starredMessages.length}
              </span>
            )}
          </button>

          {/* Create Poll Button */}
          <button
            type="button"
            onClick={() => setShowPollModal(true)}
            className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Create interactive poll"
          >
            <BarChart2 size={14} />
            <span className="hidden md:inline">Poll</span>
          </button>

          {/* Owner Clear Chat */}
          {isOwner && activeRoomId && (
            <button
              onClick={handleClearChat}
              className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 hover:border-red-500 text-red-400 hover:text-white px-2.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              title="Clear all messages in stream"
            >
              Clear
            </button>
          )}

          {/* Room Switcher */}
          {(isOwner || (isLeader && accessibleGroups.length > 1)) && (
            <select
              value={activeRoomId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[140px] sm:max-w-[180px] truncate"
            >
              {isOwner && <option value="general-stream">🌐 General Stream</option>}
              {(isOwner ? groups : accessibleGroups).map(g => (
                <option key={g.id} value={g.id}>👥 {g.name} Patrol</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── 2. IN-CHAT SEARCH BAR (TOGGLED) ── */}
      {showSearch && (
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-750 flex items-center gap-2 animate-fadeIn z-20">
          <Search size={15} className="text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchIndex(0);
            }}
            placeholder="Search words, topics, media names..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          {searchMatches.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">{searchIndex + 1}/{searchMatches.length}</span>
              <button onClick={handlePrevSearchMatch} className="p-1 hover:text-white cursor-pointer" title="Previous match">▲</button>
              <button onClick={handleNextSearchMatch} className="p-1 hover:text-white cursor-pointer" title="Next match">▼</button>
            </div>
          )}
          {searchQuery && searchMatches.length === 0 && (
            <span className="text-[11px] text-slate-500">No matches</span>
          )}
          <button 
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── 3. WHATSAPP PINNED MESSAGE STICKY BANNER ── */}
      {roomMetadata.pinnedMessage && (
        <div 
          onClick={() => jumpToMessage(roomMetadata.pinnedMessage.id)}
          className="px-4 py-2 bg-slate-850/95 border-b border-amber-500/30 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800 transition z-15 shadow-sm group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Pin size={12} className="rotate-45" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
                <span>PINNED MESSAGE</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-300 font-normal">{roomMetadata.pinnedMessage.senderName}</span>
              </div>
              <p className="text-xs text-slate-200 truncate group-hover:text-white font-medium">
                {roomMetadata.pinnedMessage.text}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-emerald-400 font-semibold group-hover:underline">View</span>
            {isLeaderOrOwner && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePinMessage({ id: roomMetadata.pinnedMessage.id });
                }}
                className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                title="Unpin message"
              >
                <PinOff size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 4. MESSAGES FEED WITH WHATSAPP DOODLE PATTERN ── */}
      <div 
        ref={chatContainerRef}
        onClick={() => {
          setActiveReactionMessageId(null);
          setActiveMenuMessageId(null);
          setShowEmojis(false);
          setShowAttachmentMenu(false);
        }}
        className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3 bg-[#0b141a]/95 select-text"
        style={{
          backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      >
        {!activeRoomId ? (
          <div className="text-center py-16 text-slate-500 text-xs">Select a patrol room from the top bar.</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
              <Smile size={24} />
            </div>
            <p className="font-semibold text-slate-400">No messages in this patrol yet.</p>
            <p className="text-[11px] text-slate-600">Send the first note, voice memo, or start a poll!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === currentUser?.uid;
            const prev = messages[i - 1];
            const isFirstOfDay = !prev || !isSameDay(prev.timestamp, m.timestamp);
            const isGrouped = !isFirstOfDay && prev && prev.senderId === m.senderId && prev.type !== 'poll' && m.type !== 'poll';
            const isPoll = m.type === 'poll' || !!m.poll;
            const isVoice = m.type === 'voice';
            const isDeleted = m.deleted || m.type === 'deleted';
            const isStarred = !!m.starredBy?.[currentUser?.uid];
            const isPinned = roomMetadata.pinnedMessage?.id === m.id;
            const isHighlighted = highlightedMessageId === m.id;

            // Sender profile
            const senderUser = usersMap[m.senderId] || {};
            const senderAvatar = senderUser.photoURL || (isMe ? currentUser?.photoURL : null) || m.senderPhotoURL;
            const senderDisplayName = senderUser.fullName || m.senderName || senderUser.username || 'Scout';

            // Role colors
            const roleColor = m.role === 'owner' ? 'text-amber-400' : m.role === 'leader' ? 'text-emerald-400' : 'text-sky-400';

            return (
              <React.Fragment key={m.id}>
                {/* Date Divider */}
                {isFirstOfDay && (
                  <div className="flex justify-center my-3 sticky top-2 z-10 select-none">
                    <span className="bg-slate-800/90 border border-slate-700/80 text-slate-300 text-[10px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                      {formatDateSeparator(m.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message Bubble Container */}
                <div 
                  id={`chat-msg-${m.id}`}
                  className={`flex gap-2 ${isMe ? 'flex-row-reverse items-end' : 'items-start'} ${isGrouped ? 'mt-1' : 'mt-3.5'} group relative transition-all duration-300 ${
                    isHighlighted ? 'ring-2 ring-emerald-400 bg-emerald-500/15 rounded-2xl p-1' : ''
                  }`}
                >
                  {/* Sender Avatar */}
                  {!isGrouped ? (
                    senderAvatar ? (
                      <img
                        src={senderAvatar}
                        alt="Avatar"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-emerald-500/40 shrink-0 mt-0.5 shadow-sm"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 uppercase mt-0.5">
                        {senderDisplayName.charAt(0)}
                      </div>
                    )
                  ) : (
                    <div className="w-7 sm:w-8 shrink-0" />
                  )}

                  {/* Bubble & Metadata */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] min-w-0`}>
                    
                    {/* Sender Name & Role (Only on first of group) */}
                    {!isGrouped && !isMe && (
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className={`text-xs font-bold ${roleColor}`}>{senderDisplayName}</span>
                        {m.role === 'owner' ? (
                          <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            Admin
                          </span>
                        ) : m.role === 'leader' ? (
                          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            Leader
                          </span>
                        ) : null}
                      </div>
                    )}

                    {/* ── BUBBLE BODY ── */}
                    <div className="relative group/bubble flex items-end gap-1.5 max-w-full">
                      
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 shadow-md relative break-words transition-colors ${
                          isMe
                            ? 'bg-[#005c4b] text-white rounded-tr-xs border border-emerald-600/30'
                            : 'bg-[#202c33] text-slate-100 rounded-tl-xs border border-slate-700/60'
                        } ${isDeleted ? 'italic text-slate-400 opacity-70 bg-slate-900 border-slate-800' : ''}`}
                      >
                        {/* Pinned Tag Badge inside bubble */}
                        {isPinned && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-amber-300 mb-1.5 pb-1 border-b border-white/10">
                            <Pin size={10} className="rotate-45 text-amber-400" />
                            <span>Pinned Announcement</span>
                          </div>
                        )}

                        {/* ── QUOTED REPLY PREVIEW ── */}
                        {m.replyTo && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToMessage(m.replyTo.id);
                            }}
                            className={`mb-2 p-2 rounded-xl text-xs cursor-pointer transition border-l-4 flex flex-col gap-0.5 select-none ${
                              isMe 
                                ? 'bg-black/25 border-emerald-400 hover:bg-black/35 text-slate-200' 
                                : 'bg-black/30 border-sky-400 hover:bg-black/40 text-slate-300'
                            }`}
                          >
                            <span className="font-bold text-[11px] text-emerald-400 flex items-center gap-1">
                              <Reply size={10} /> {m.replyTo.senderName}
                            </span>
                            <span className="truncate text-[11px] opacity-90">
                              {m.replyTo.text}
                            </span>
                          </div>
                        )}

                        {/* ── POLL CARD ── */}
                        {isPoll && !isDeleted ? (
                          <div className="space-y-3 min-w-[240px] sm:min-w-[280px]">
                            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
                                  📊
                                </span>
                                <div>
                                  <h4 className="font-extrabold text-white text-xs leading-tight">
                                    {m.poll.question}
                                  </h4>
                                  <p className="text-[10px] text-slate-300 mt-0.5">
                                    {m.poll.allowMultiple ? 'Multiple choices' : 'Single choice'} • {m.poll.closed ? '🔒 Closed' : 'Active'}
                                  </p>
                                </div>
                              </div>

                              {isLeaderOrOwner && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleClosePoll(m)}
                                  className="text-[10px] text-slate-300 hover:text-white bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded border border-white/10 transition cursor-pointer shrink-0"
                                >
                                  {m.poll.closed ? 'Reopen' : 'Close'}
                                </button>
                              )}
                            </div>

                            {/* Options List */}
                            {(() => {
                              const totalVotes = m.poll.options.reduce((sum, opt) => sum + (opt.voterIds?.length || 0), 0);

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
                                            ? 'bg-emerald-950/70 border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                                            : 'bg-black/20 border-white/10 hover:border-white/20'
                                        } ${m.poll.closed ? 'cursor-default opacity-85' : 'cursor-pointer'}`}
                                      >
                                        <div
                                          className={`absolute left-0 top-0 bottom-0 transition-all duration-500 pointer-events-none opacity-30 ${
                                            isUserVoted ? 'bg-emerald-400' : 'bg-slate-400'
                                          }`}
                                          style={{ width: `${percent}%` }}
                                        />

                                        <div className="relative z-10 flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                              isUserVoted ? 'bg-emerald-500 border-emerald-300 text-white' : 'border-slate-400'
                                            }`}>
                                              {isUserVoted && <Check size={10} strokeWidth={3} />}
                                            </div>
                                            <span className={`text-xs truncate ${isUserVoted ? 'text-emerald-300 font-bold' : 'text-slate-100'}`}>
                                              {opt.text}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                                            <span className="font-bold text-white">{percent}%</span>
                                            <span className="text-[10px] text-slate-300">({voteCount})</span>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}

                                  {/* Poll Footer */}
                                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
                                    <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
                                    <button
                                      type="button"
                                      onClick={() => setExpandedPollVoters(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                                      className="text-emerald-300 hover:underline cursor-pointer font-medium"
                                    >
                                      {expandedPollVoters[m.id] ? 'Hide Voters' : 'View Voters'}
                                    </button>
                                  </div>

                                  {/* Voters Details Dropdown */}
                                  {expandedPollVoters[m.id] && (
                                    <div className="bg-black/40 p-2 rounded-xl border border-white/10 space-y-1 text-[11px] animate-fadeIn">
                                      {m.poll.options.map(opt => (
                                        <div key={opt.id} className="text-slate-200 flex items-start gap-1.5">
                                          <strong className="text-emerald-300">{opt.text}:</strong>
                                          <span>
                                            {opt.voterNames && opt.voterNames.length > 0 
                                              ? opt.voterNames.join(', ') 
                                              : 'No votes'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        ) : isVoice && !isDeleted ? (
                          /* ── WHATSAPP VOICE NOTE CARD ── */
                          <div className="flex items-center gap-3 py-1 min-w-[220px] sm:min-w-[260px]">
                            <button
                              type="button"
                              onClick={() => handleTogglePlayAudio(m)}
                              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition shadow-md shrink-0 cursor-pointer"
                              title={playingAudioId === m.id ? "Pause" : "Play Voice Note"}
                            >
                              {playingAudioId === m.id ? (
                                <Pause size={18} fill="currentColor" />
                              ) : (
                                <Play size={18} fill="currentColor" className="ml-0.5" />
                              )}
                            </button>

                            <div className="flex-1 space-y-1.5 min-w-0">
                              {/* Waveform Bar */}
                              <div className="h-4 flex items-center gap-0.5 overflow-hidden">
                                {[40, 70, 30, 90, 60, 45, 80, 100, 65, 45, 90, 75, 35, 60, 85, 50, 40, 95, 60, 30].map((heightPct, idx) => {
                                  const barProgress = idx / 20;
                                  const isPlayed = playingAudioId === m.id && audioProgress >= barProgress;
                                  return (
                                    <div 
                                      key={idx} 
                                      className={`w-1 rounded-full transition-all duration-150 ${
                                        isPlayed ? 'bg-emerald-400' : 'bg-slate-500/60'
                                      }`}
                                      style={{ height: `${heightPct}%` }}
                                    />
                                  );
                                })}
                              </div>

                              {/* Duration & Speed */}
                              <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                                <span>
                                  {playingAudioId === m.id 
                                    ? formatAudioDuration(audioCurrentTime) 
                                    : formatAudioDuration(m.audioDuration || 0)}
                                </span>

                                <button
                                  type="button"
                                  onClick={handleCyclePlaybackRate}
                                  className="px-1.5 py-0.5 bg-black/25 hover:bg-black/40 rounded text-[9px] font-bold text-emerald-300 transition cursor-pointer"
                                  title="Playback Speed"
                                >
                                  {playbackRate}x
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* ── STANDARD TEXT & ATTACHMENT MESSAGE ── */
                          <div className="space-y-1.5">
                            {/* Message Text with Search Highlight */}
                            {m.text && (
                              <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                                {searchQuery.trim() && m.text.toLowerCase().includes(searchQuery.toLowerCase().trim()) ? (
                                  m.text.split(new RegExp(`(${searchQuery.trim()})`, 'gi')).map((part, idx) => 
                                    part.toLowerCase() === searchQuery.toLowerCase().trim() ? (
                                      <mark key={idx} className="bg-amber-400 text-slate-950 font-bold px-0.5 rounded">
                                        {part}
                                      </mark>
                                    ) : (
                                      part
                                    )
                                  )
                                ) : (
                                  m.text
                                )}
                              </p>
                            )}

                            {/* Image Attachment */}
                            {m.fileUrl && m.fileType?.startsWith('image/') && (
                              <div className="rounded-xl overflow-hidden border border-white/10 mt-1 max-w-sm space-y-1">
                                <img 
                                  src={m.fileUrl} 
                                  alt={m.fileName} 
                                  className="w-full max-h-56 object-cover cursor-pointer hover:opacity-95 transition"
                                  onClick={() => window.open(m.fileUrl, '_blank')}
                                />
                                <div className="p-1 flex justify-between items-center bg-black/30 text-[10px]">
                                  <span className="truncate max-w-[150px] text-slate-300">{m.fileName}</span>
                                  <a href={m.fileUrl} download={m.fileName} className="text-emerald-300 hover:underline flex items-center gap-1 font-bold">
                                    <Download size={11} /> Save
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* Document Attachment */}
                            {m.fileUrl && !m.fileType?.startsWith('image/') && (
                              <div className="p-2.5 bg-black/30 rounded-xl border border-white/10 flex items-center gap-2.5 mt-1 max-w-xs">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                                  <FileText size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-white truncate">{m.fileName}</p>
                                  <a
                                    href={m.fileUrl}
                                    download={m.fileName}
                                    className="text-[10px] text-emerald-300 hover:underline flex items-center gap-1 mt-0.5 font-bold"
                                  >
                                    <Download size={10} /> Download File
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── BUBBLE TIMESTAMP & WHATSAPP TICKS ── */}
                        <div className={`flex items-center gap-1 text-[9px] mt-1 text-slate-300 font-mono ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {isStarred && <Star size={10} className="text-amber-300 fill-amber-300" />}
                          {m.edited && <span className="italic text-[8px] opacity-80">(edited)</span>}
                          <span>{formatTime(m.timestamp)}</span>
                          
                          {/* WhatsApp Double Checkmarks */}
                          {isMe && !isDeleted && (
                            <span title="Read receipt: Delivered & Seen" className="text-emerald-300 flex items-center ml-0.5">
                              <CheckCheck size={13} strokeWidth={2.5} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ── HOVER / TAP 3-DOTS ACTION TRIGGER ── */}
                      <div className="relative shrink-0 self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuMessageId(activeMenuMessageId === m.id ? null : m.id);
                            setActiveReactionMessageId(null);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition opacity-0 group-hover:opacity-100 max-sm:opacity-70 cursor-pointer"
                          title="Message actions"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {/* ── WHATSAPP MESSAGE DROPDOWN MENU ── */}
                        {activeMenuMessageId === m.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute bottom-full mb-1 z-40 bg-slate-900 border border-slate-750 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md w-44 animate-fadeIn space-y-0.5 ${
                              isMe ? 'right-0' : 'left-0'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(m);
                                setActiveMenuMessageId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2 transition cursor-pointer"
                            >
                              <Reply size={13} className="text-emerald-400" />
                              <span>Reply</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStar(m)}
                              className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2 transition cursor-pointer"
                            >
                              <Star size={13} className={isStarred ? "text-amber-400 fill-amber-400" : "text-amber-400"} />
                              <span>{isStarred ? 'Unstar Message' : 'Star Message'}</span>
                            </button>

                            {isLeaderOrOwner && (
                              <button
                                type="button"
                                onClick={() => handleTogglePinMessage(m)}
                                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2 transition cursor-pointer"
                              >
                                <Pin size={13} className="text-amber-400 rotate-45" />
                                <span>{isPinned ? 'Unpin from Top' : 'Pin to Top'}</span>
                              </button>
                            )}

                            {m.text && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(m)}
                                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2 transition cursor-pointer"
                              >
                                <Copy size={13} className="text-sky-400" />
                                <span>Copy Text</span>
                              </button>
                            )}

                            {isMe && !isDeleted && m.type === 'text' && (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(m)}
                                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2 transition cursor-pointer"
                              >
                                <Edit2 size={13} className="text-emerald-400" />
                                <span>Edit Message</span>
                              </button>
                            )}

                            {(isLeaderOrOwner || isMe) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(m)}
                                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-red-950/50 text-xs text-red-400 flex items-center gap-2 transition cursor-pointer"
                              >
                                <Trash2 size={13} />
                                <span>Delete Message</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ── QUICK EMOJI REACTION TRIGGER ── */}
                      <div className="relative shrink-0 self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReactionMessageId(activeReactionMessageId === m.id ? null : m.id);
                            setActiveMenuMessageId(null);
                          }}
                          className={`p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition cursor-pointer ${
                            activeReactionMessageId === m.id
                              ? 'text-amber-300 bg-slate-800 opacity-100'
                              : 'opacity-0 group-hover:opacity-100 max-sm:opacity-70'
                          }`}
                          title="React with Emoji"
                        >
                          <SmilePlus size={14} />
                        </button>

                        {/* Floating Quick Reaction Popover */}
                        {activeReactionMessageId === m.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute bottom-full mb-1 z-30 bg-slate-900/95 border border-slate-700 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1 animate-fadeIn ${
                              isMe ? 'right-0' : 'left-0'
                            }`}
                          >
                            {QUICK_REACTION_EMOJIS.map(emoji => {
                              const hasReacted = m.reactions?.[emoji]?.[currentUser?.uid];
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleToggleReaction(m, emoji)}
                                  className={`text-base p-1 rounded-lg hover:scale-125 transition cursor-pointer border ${
                                    hasReacted 
                                      ? 'bg-emerald-500/30 border-emerald-400 shadow-xs' 
                                      : 'border-transparent hover:bg-slate-800'
                                  }`}
                                  title={`React with ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── 4. EMOJI REACTION BADGES ROW ── */}
                    {m.reactions && Object.keys(m.reactions).length > 0 && (
                      <div className={`flex items-center gap-1.5 flex-wrap mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(m.reactions).map(([emoji, usersMapObj]) => {
                          const uids = Object.keys(usersMapObj || {});
                          if (uids.length === 0) return null;
                          const hasReacted = uids.includes(currentUser?.uid);
                          const userNames = Object.values(usersMapObj || {}).join(', ');

                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(m, emoji)}
                              className={`text-xs px-2 py-0.5 rounded-full border transition-all duration-150 flex items-center gap-1 cursor-pointer shadow-xs select-none ${
                                hasReacted
                                  ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300 font-bold ring-1 ring-emerald-500/40'
                                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                              title={`${emoji} • Reacted by: ${userNames}`}
                            >
                              <span className="text-xs leading-none">{emoji}</span>
                              <span className="text-[10px] font-mono font-bold leading-none">{uids.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── 5. WHATSAPP REPLY-TO PREVIEW BAR DOCKED ABOVE INPUT ── */}
      {replyingTo && (
        <div className="px-4 py-2 bg-slate-850 border-t border-slate-750 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-1 self-stretch bg-emerald-500 rounded-full shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-emerald-400 block truncate">
                Replying to {replyingTo.senderName}
              </span>
              <p className="text-xs text-slate-300 truncate">
                {replyingTo.text || replyingTo.fileName || 'Attachment'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="p-1 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg transition"
            title="Cancel reply"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── 6. EDITING MESSAGE BAR DOCKED ABOVE INPUT ── */}
      {editingMessage && (
        <div className="px-4 py-2 bg-slate-850 border-t border-amber-500/40 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <Edit2 size={15} className="text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-300">Editing Message</span>
          </div>
          <button
            type="button"
            onClick={() => setEditingMessage(null)}
            className="p-1 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── 7. ATTACHMENT PREVIEW INFO ── */}
      {fileData && (
        <div className="px-4 py-2 bg-slate-850 border-t border-slate-750 flex items-center justify-between text-xs text-emerald-400 animate-fadeIn">
          <span className="flex items-center gap-1.5 truncate max-w-xs font-semibold">
            <Paperclip size={13} /> {fileData.name} ready to send
          </span>
          <button
            onClick={() => setFileData(null)}
            className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      {/* ── 8. WHATSAPP ATTACHMENT ACTION SHEET (DRAWER) ── */}
      {showAttachmentMenu && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-16 left-4 bg-slate-900 border border-slate-700 rounded-3xl p-3 shadow-2xl z-40 animate-fadeIn grid grid-cols-3 gap-2 w-64"
        >
          {/* Photos & Videos */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-slate-800 transition cursor-pointer text-slate-200 hover:text-white"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <span className="text-[10px] font-semibold">Photos</span>
          </button>

          {/* Documents */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-slate-800 transition cursor-pointer text-slate-200 hover:text-white"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="text-[10px] font-semibold">Document</span>
          </button>

          {/* Poll */}
          <button
            type="button"
            onClick={() => {
              setShowAttachmentMenu(false);
              setShowPollModal(true);
            }}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-slate-800 transition cursor-pointer text-slate-200 hover:text-white"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BarChart2 size={20} />
            </div>
            <span className="text-[10px] font-semibold">Poll</span>
          </button>

          {/* Hidden inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* ── 9. EMOJI PICKER POPOVER ── */}
      {showEmojis && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-16 left-12 bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-2xl z-40 animate-fadeIn"
        >
          <p className="text-[9px] uppercase font-bold text-slate-400 mb-2 tracking-wider text-center">Quick Emoji</p>
          <div className="grid grid-cols-4 gap-2">
            {['😀','😂','😍','👍','🎉','🔥','👏','❤️','🚨','⛺','🌲','⚜️','🙌','👀','✨','🎈'].map(e => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  if (editingMessage) {
                    setEditingMessage(prev => ({ ...prev, text: prev.text + e }));
                  } else {
                    handleTyping(text + e);
                  }
                  setShowEmojis(false);
                }}
                className="text-lg hover:scale-125 transition p-1 cursor-pointer bg-transparent border-0"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. WHATSAPP INPUT FORM / VOICE MEMO RECORDER ── */}
      <div className="p-2.5 sm:p-3 bg-slate-850 border-t border-slate-750 flex items-center gap-2 relative z-20 shrink-0">
        
        {isRecording ? (
          /* ── ACTIVE VOICE MEMO RECORDING BAR ── */
          <div className="flex-1 flex items-center justify-between bg-slate-900 border border-red-500/50 rounded-2xl px-4 py-2 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-red-400">
                Recording: {formatAudioDuration(recordingDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelRecording}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
                title="Cancel recording"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={handleStopAndSendRecording}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Send size={13} /> Send Memo
              </button>
            </div>
          </div>
        ) : (
          /* ── STANDARD WHATSAPP TEXT INPUT ── */
          <form 
            onSubmit={editingMessage ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSend} 
            className="flex-1 flex items-center gap-1.5 sm:gap-2"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              disabled={!activeRoomId}
              className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                showAttachmentMenu 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Attach media, files or polls"
            >
              <Paperclip size={18} />
            </button>

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              disabled={!activeRoomId}
              className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-700 shrink-0"
              title="Add emoji"
            >
              😊
            </button>

            {/* Input Box */}
            <input
              type="text"
              disabled={!activeRoomId}
              value={editingMessage ? editingMessage.text : text}
              onChange={(e) => {
                if (editingMessage) {
                  setEditingMessage({ ...editingMessage, text: e.target.value });
                } else {
                  handleTyping(e.target.value);
                }
              }}
              placeholder={
                editingMessage
                  ? "Update message..."
                  : activeRoomId 
                  ? "Type a message, note, or announcement..." 
                  : "Select patrol room..."
              }
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 min-w-0"
            />

            {/* Send Button or Voice Memo Trigger */}
            {(text.trim() || fileData || editingMessage) ? (
              <button
                type="submit"
                disabled={!activeRoomId || uploading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
              >
                {editingMessage ? <Check size={16} /> : <Send size={15} />}
                <span className="hidden sm:inline">{editingMessage ? 'Save' : 'Send'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                disabled={!activeRoomId}
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition cursor-pointer shrink-0 shadow-md"
                title="Record Voice Memo"
              >
                <Mic size={18} />
              </button>
            )}
          </form>
        )}
      </div>

      {/* ── 11. STARRED MESSAGES DRAWER / MODAL ── */}
      {showStarredDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Star className="text-amber-400 fill-amber-400" size={20} />
                <h3 className="font-extrabold text-white text-base">Starred Messages</h3>
              </div>
              <button onClick={() => setShowStarredDrawer(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            {starredMessages.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No starred messages in this patrol stream yet. Click the ⭐ icon on any message to save it here!
              </div>
            ) : (
              <div className="space-y-2.5">
                {starredMessages.map(m => (
                  <div key={m.id} className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">{m.senderName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{formatTime(m.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-200">{m.text || m.fileName || 'Attachment'}</p>
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => {
                          setShowStarredDrawer(false);
                          jumpToMessage(m.id);
                        }}
                        className="text-[11px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        Jump to message →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 12. CREATE POLL MODAL ── */}
      {showPollModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
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

      {/* ── 13. PATROL ROSTER MODAL ── */}
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

              {/* Parents Section */}
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

    </div>
  );
}
