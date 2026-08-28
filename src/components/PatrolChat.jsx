import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Trash2, Paperclip, FileText, Image as ImageIcon, Send, Download } from 'lucide-react';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PatrolChat({ currentUser }) {
  const isOwner = currentUser.role === 'owner' || currentUser.email === 'neoissa@gmail.com';
  const isLeader = currentUser.role === 'leader';
  const isLeaderOrOwner = isOwner || isLeader;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [fileData, setFileData] = useState(null); // { base64: string, name: string, type: string }
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef();

  // Determine chat room ID: Group / Patrol ID
  const defaultGroupId = currentUser.groupId || currentUser.patrolId || currentUser.leaderId || 'general-stream';
  const activeRoomId = isOwner ? (selectedGroupId || (groups[0]?.id || 'general-stream')) : defaultGroupId;

  // 1. Fetch groups to populate room list for Owner
  useEffect(() => {
    if (!isOwner) return;

    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(g => !g.archived);
      setGroups(list);
      if (list.length > 0 && !selectedGroupId) {
        setSelectedGroupId(list[0].id);
      }
    }, (err) => {
      console.error('Error fetching groups for chat:', err);
    });

    return () => unsub();
  }, [isOwner]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit file size to 2MB to keep Base64 firestore load within limits
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
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.fullName || currentUser.email?.split('@')[0] || 'Unknown',
        role: currentUser.role || 'scout',
        fileUrl: currentFile ? currentFile.base64 : null,
        fileName: currentFile ? currentFile.name : null,
        fileType: currentFile ? currentFile.type : null,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to send message:', err);
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
    <div className="bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[560px] shadow-xl overflow-hidden print-hide">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Patrol Stream</h3>
          <p className="text-xs text-slate-400">
            {isOwner 
              ? 'Super Admin global stream switcher' 
              : `Taliʿa Group Chat: ${currentUser.groupId || currentUser.patrolId || 'General'}`}
          </p>
        </div>

        {/* Room Switcher for Owner */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Taliʿa Stream:</span>
            <select
              value={activeRoomId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="general-stream">General Stream</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!activeRoomId ? (
          <div className="text-center py-12 text-slate-500 text-xs">Select a patrol stream above.</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">No messages yet. Start chatting!</div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === currentUser.uid;
            const prev = messages[i - 1];
            const isGrouped = prev && prev.senderId === m.senderId;

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isGrouped ? 'mt-0.5' : 'mt-3'} group relative`}>
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
                    className={`px-4 py-2.5 max-w-[80%] text-sm break-words leading-relaxed space-y-2 relative ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-slate-700 text-slate-100 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {/* Message Text */}
                    {m.text && <p>{m.text}</p>}

                    {/* Shared File Attachment */}
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
                  
                  <span className="text-[9px] text-slate-500 shrink-0 pb-0.5 font-mono">{formatTime(m.timestamp)}</span>

                  {/* Leader/Owner delete message control */}
                  {isLeaderOrOwner && (
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-red-400 text-slate-500 rounded cursor-pointer"
                      title="Delete Message (Leader Control)"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

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

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex items-center gap-2">
        {/* File attachment button */}
        <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-700 shrink-0">
          <Paperclip size={18} />
          <input
            type="file"
            onChange={handleFileChange}
            disabled={!activeRoomId || uploading}
            className="hidden"
          />
        </label>

        <input
          type="text"
          disabled={!activeRoomId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={activeRoomId ? "Type a message..." : "Select patrol room..."}
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
