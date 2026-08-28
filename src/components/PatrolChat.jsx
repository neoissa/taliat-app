import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  where
} from 'firebase/firestore';
import { Users, User, MessageSquare, ArrowLeft } from 'lucide-react';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PatrolChat({ currentUser, chatScout, setChatScout }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeRoom, setActiveRoom] = useState('group'); // 'group' or scoutId
  const [mobileActive, setMobileActive] = useState(false);
  const [scouts, setScouts] = useState([]);
  const [scoutsLoading, setScoutsLoading] = useState(true);
  const [leaderInfo, setLeaderInfo] = useState(null);
  const bottomRef = useRef();

  const leaderId = currentUser.leaderId || currentUser.uid;
  const activeDMScoutId = currentUser.role === 'leader' ? activeRoom : currentUser.uid;

  // Listen to scouts if leader
  useEffect(() => {
    if (currentUser.role === 'leader') {
      const q = query(
        collection(db, 'users'),
        where('leaderId', '==', currentUser.uid)
      );
      const unsub = onSnapshot(q, (snap) => {
        setScouts(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        setScoutsLoading(false);
      }, (err) => {
        console.error(err);
        setScoutsLoading(false);
      });
      return () => unsub();
    } else {
      setScoutsLoading(false);
    }
  }, [currentUser.role, currentUser.uid]);

  // Fetch leader info if scout
  useEffect(() => {
    if (currentUser.role === 'scout' && currentUser.leaderId) {
      const getLeader = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.leaderId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setLeaderInfo(docSnap.data());
          }
        } catch (err) {
          console.error("Failed to fetch leader info:", err);
        }
      };
      getLeader();
    }
  }, [currentUser.role, currentUser.leaderId]);

  // Apply parent component's scout selection
  useEffect(() => {
    if (chatScout) {
      setActiveRoom(chatScout.uid);
      setMobileActive(true);
      if (setChatScout) {
        setChatScout(null);
      }
    }
  }, [chatScout, setChatScout]);

  // Listen to messages
  useEffect(() => {
    let q;
    if (activeRoom === 'group') {
      q = query(
        collection(db, 'chats', leaderId, 'messages'),
        orderBy('timestamp', 'asc'),
        limit(100)
      );
    } else {
      q = query(
        collection(db, 'private_chats', activeDMScoutId, 'messages'),
        orderBy('timestamp', 'asc'),
        limit(100)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(mDoc => ({ id: mDoc.id, ...mDoc.data() }));
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, (err) => {
      console.error("Failed to fetch messages:", err);
    });

    return () => unsubscribe();
  }, [activeRoom, activeDMScoutId, leaderId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText('');

    try {
      if (activeRoom === 'group') {
        await addDoc(collection(db, 'chats', leaderId, 'messages'), {
          text: messageText,
          senderId: currentUser.uid,
          senderName: currentUser.fullName || currentUser.username || 'Unknown',
          role: currentUser.role || 'member',
          leaderId,
          timestamp: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'private_chats', activeDMScoutId, 'messages'), {
          text: messageText,
          senderId: currentUser.uid,
          senderName: currentUser.fullName || currentUser.username || 'Unknown',
          role: currentUser.role || 'member',
          timestamp: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const activeScout = currentUser.role === 'leader' ? scouts.find(s => s.uid === activeRoom) : null;
  const activeRoomTitle = activeRoom === 'group'
    ? 'Patrol Stream'
    : currentUser.role === 'leader'
      ? activeScout?.fullName || activeScout?.username || 'Private Chat'
      : leaderInfo?.fullName || 'Leader Private Chat';

  const activeRoomSubtitle = activeRoom === 'group'
    ? 'Live chat for your patrol group'
    : currentUser.role === 'leader'
      ? activeScout?.username ? `@${activeScout.username} · Private Chat` : 'Private Chat'
      : leaderInfo?.username ? `@${leaderInfo.username} · Private Chat` : 'Private Chat';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl flex h-[560px] shadow-xl overflow-hidden">
      {/* Sidebar list */}
      <div className={`w-full md:w-64 border-r border-slate-700 bg-slate-800/50 flex flex-col shrink-0 ${mobileActive ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-700 bg-slate-800/80">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <MessageSquare className="text-emerald-400" size={18} />
            Conversations
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Group Chat Section */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveRoom('group');
                setMobileActive(true);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition cursor-pointer ${
                activeRoom === 'group'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Users size={16} />
              <div className="truncate">
                <p className="truncate">Patrol Stream</p>
                {activeRoom !== 'group' && <p className="text-[10px] text-slate-400 truncate">Group patrol chat</p>}
              </div>
            </button>
          </div>

          {/* Private Chats Section */}
          {(currentUser.role === 'leader' || currentUser.leaderId) && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">
                Direct Messages
              </p>

              {currentUser.role === 'leader' ? (
                scoutsLoading ? (
                  <p className="px-3 text-xs text-slate-500">Loading scouts...</p>
                ) : scouts.length === 0 ? (
                  <p className="px-3 text-xs text-slate-500">No scouts in your group yet.</p>
                ) : (
                  scouts.map(s => (
                    <button
                      key={s.uid}
                      onClick={() => {
                        setActiveRoom(s.uid);
                        setMobileActive(true);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition cursor-pointer ${
                        activeRoom === s.uid
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <User size={16} className={activeRoom === s.uid ? 'text-white' : 'text-slate-400'} />
                      <div className="truncate">
                        <p className="truncate">{s.fullName || s.username}</p>
                        {s.username && (
                          <p className={`text-[10px] truncate ${activeRoom === s.uid ? 'text-emerald-200' : 'text-slate-400'}`}>
                            @{s.username}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )
              ) : (
                /* For Scouts: Show direct chat with leader if leaderId exists */
                currentUser.leaderId && (
                  <button
                    onClick={() => {
                      setActiveRoom(currentUser.leaderId);
                      setMobileActive(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition cursor-pointer ${
                      activeRoom === currentUser.leaderId
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <User size={16} className={activeRoom === currentUser.leaderId ? 'text-white' : 'text-slate-400'} />
                    <div className="truncate">
                      <p className="truncate">{leaderInfo?.fullName || 'Patrol Leader'}</p>
                      <p className={`text-[10px] truncate ${activeRoom === currentUser.leaderId ? 'text-emerald-200' : 'text-slate-400'}`}>
                        Private Chat
                      </p>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages Feed panel */}
      <div className={`flex-1 flex flex-col bg-slate-800 ${mobileActive ? 'flex' : 'hidden md:flex'}`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center gap-3">
          {/* Back button for mobile */}
          <button
            onClick={() => setMobileActive(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{activeRoomTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeRoomSubtitle}</p>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No messages yet. Send the first update!</div>
          ) : (
            messages.map((m, i) => {
              const isMe = m.senderId === currentUser.uid;
              const prev = messages[i - 1];
              const isGrouped = prev && prev.senderId === m.senderId;

              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isGrouped ? 'mt-0.5' : 'mt-3'}`}>
                  {/* Sender name + leader badge — show only at start of a group */}
                  {!isGrouped && (
                    <div className={`flex items-center gap-1.5 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-semibold text-slate-300">{m.senderName}</span>
                      {m.role === 'leader' && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 leading-none">
                          Leader
                        </span>
                      )}
                    </div>
                  )}

                  <div className={`flex items-end gap-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`px-3 py-2 max-w-[78%] text-sm break-words leading-snug ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 pb-0.5">{formatTime(m.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={activeRoom === 'group' ? "Share an update or question..." : "Send a private message..."}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
