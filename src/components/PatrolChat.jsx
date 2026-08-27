import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PatrolChat({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef();

  const leaderId = currentUser.leaderId || currentUser.uid;

  useEffect(() => {
    const q = query(
      collection(db, 'chats', leaderId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    return () => unsubscribe();
  }, [leaderId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText('');

    try {
      await addDoc(collection(db, 'chats', leaderId, 'messages'), {
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
        role: currentUser.role || 'member',
        leaderId,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[560px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80">
        <h3 className="font-bold text-white text-base">Patrol Stream</h3>
        <p className="text-xs text-slate-400">Live chat for your patrol group</p>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share an update or question..."
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
  );
}
