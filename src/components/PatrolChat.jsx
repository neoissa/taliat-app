import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PatrolChat({ currentUser }) {
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [leaders, setLeaders] = useState([]);
  const [selectedLeaderId, setSelectedLeaderId] = useState('');
  const bottomRef = useRef();

  const defaultLeaderId = currentUser.leaderId || currentUser.uid;
  const activeRoomId = isOwner ? selectedLeaderId : defaultLeaderId;

  // 1. If owner, fetch all leaders to populate chat room switcher
  useEffect(() => {
    if (!isOwner) return;

    const q = query(collection(db, 'users'), where('role', '==', 'leader'));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      setLeaders(list);
      if (list.length > 0 && !selectedLeaderId) {
        setSelectedLeaderId(list[0].uid);
      }
    }, (err) => {
      console.error('Error fetching leaders for chat:', err);
    });

    return () => unsub();
  }, [isOwner]);

  // 2. Fetch messages in real-time for activeRoomId
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeRoomId) return;

    const messageText = text;
    setText('');

    try {
      await addDoc(collection(db, 'chats', activeRoomId, 'messages'), {
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
        role: currentUser.role || 'scout',
        leaderId: activeRoomId,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[560px] shadow-xl overflow-hidden print-hide">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Patrol Stream</h3>
          <p className="text-xs text-slate-400">Live chat for patrol members</p>
        </div>

        {/* Room Switcher for Owner */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Chat Room:</span>
            <select
              value={selectedLeaderId}
              onChange={(e) => setSelectedLeaderId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">Select Room</option>
              {leaders.map(l => (
                <option key={l.uid} value={l.uid}>{l.fullName || l.username}'s Patrol</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!activeRoomId ? (
          <div className="text-center py-12 text-slate-500 text-xs">Select a chat room above to start stream.</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">No messages yet. Send the first update!</div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === currentUser.uid;
            const prev = messages[i - 1];
            const isGrouped = prev && prev.senderId === m.senderId;

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isGrouped ? 'mt-0.5' : 'mt-3'}`}>
                {/* Sender name + Role badge */}
                {!isGrouped && (
                  <div className={`flex items-center gap-1.5 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-semibold text-slate-300">{m.senderName}</span>
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

                <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`px-4 py-2.5 max-w-[80%] text-sm break-words leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0 pb-0.5 font-mono">{formatTime(m.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          disabled={!activeRoomId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={activeRoomId ? "Type a message..." : "Select room first..."}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!activeRoomId}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}
