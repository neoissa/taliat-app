import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PatrolChat({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const dummyRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db, 'patrol_messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => dummyRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText('');

    try {
      await addDoc(collection(db, 'patrol_messages'), {
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email.split('@')[0],
        role: currentUser.role || 'member',
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80">
        <h3 className="font-bold text-white text-base">Patrol Stream</h3>
        <p className="text-xs text-slate-400">Live communication channel for members & leaders</p>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">No messages yet. Send the first update!</div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUser.uid;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-300">{m.senderName}</span>
                  {m.role === 'leader' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Leader
                    </span>
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-sm break-words ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-700 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={dummyRef} />
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
