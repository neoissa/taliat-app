import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { FolderPlus, Users, Edit3, Archive, Check } from 'lucide-react';

export default function GroupManager({ currentUser }) {
  const [groups, setGroups] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [scouts, setScouts] = useState([]);

  // Create Group Form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  // Editing Group State
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLeaders, setEditLeaders] = useState([]); // Array of UIDs

  useEffect(() => {
    // 1. Listen to all groups
    const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Listen to all leaders and scouts
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setLeaders(allUsers.filter(u => u.role === 'leader' || u.role === 'owner'));
      setScouts(allUsers.filter(u => u.role === 'scout'));
    });

    return () => {
      unsubGroups();
      unsubUsers();
    };
  }, []);

  const compressAndResizeGroupIcon = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 120;
          const MAX_HEIGHT = 120;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGroupIconChange = async (groupId, file) => {
    if (!file) return;
    try {
      const compressedBase64 = await compressAndResizeGroupIcon(file);
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, { photoURL: compressedBase64 });
      console.log("Group icon updated successfully!");
    } catch (err) {
      console.error("Failed to upload group icon:", err);
      alert("Failed to update group icon: " + err.message);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setCreating(true);
    setCreateMsg('');

    const newGroupId = newGroupName.trim().toLowerCase().replace(/\s+/g, '-');
    const docRef = doc(db, 'groups', newGroupId);

    try {
      await setDoc(docRef, {
        groupId: newGroupId,
        name: newGroupName.trim(),
        description: newGroupDesc.trim(),
        ownerId: currentUser.uid,
        assignedLeaderIds: [],
        archived: false,
        photoURL: null,
        createdAt: serverTimestamp()
      });
      setNewGroupName('');
      setNewGroupDesc('');
      setCreateMsg('Group created successfully!');
      setTimeout(() => setCreateMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setCreateMsg('Error creating group.');
    } finally {
      setCreating(false);
    }
  };

  const handleEditGroupClick = (group) => {
    setEditingGroupId(group.id);
    setEditName(group.name);
    setEditDesc(group.description || '');
    setEditLeaders(group.assignedLeaderIds || []);
  };

  const handleSaveGroupEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      const ref = doc(db, 'groups', editingGroupId);
      await updateDoc(ref, {
        name: editName.trim(),
        description: editDesc.trim(),
        assignedLeaderIds: editLeaders
      });
      setEditingGroupId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchiveGroup = async (group) => {
    try {
      const ref = doc(db, 'groups', group.id);
      await updateDoc(ref, {
        archived: !group.archived
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeaderToggle = (leaderUid) => {
    setEditLeaders(prev => 
      prev.includes(leaderUid)
        ? prev.filter(uid => uid !== leaderUid)
        : [...prev, leaderUid]
    );
  };

  const handleUserGroupReassign = async (user, newGroupId) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        groupId: newGroupId || null,
        patrolId: newGroupId || null // Keep both fields in sync
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderPlus className="text-emerald-400" size={24} />
          Group & Patrol Manager
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Create, edit, archive patrols and delegate leader assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Group and Edit Group section */}
        <div className="lg:col-span-1 space-y-6">
          {editingGroupId ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-1">
                <Edit3 size={16} /> Edit Group Details
              </h3>
              <form onSubmit={handleSaveGroupEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Group Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Leaders</label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-900 rounded-xl border border-slate-700">
                    {leaders.map(l => (
                      <label key={l.uid} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editLeaders.includes(l.uid)}
                          onChange={() => handleLeaderToggle(l.uid)}
                          className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0"
                        />
                        {l.fullName || l.username} ({l.role})
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingGroupId(null)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-sm mb-4">Create New Group</h3>
              {createMsg && (
                <div className="p-3 mb-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl font-semibold">
                  {createMsg}
                </div>
              )}
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Patrol Name</label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Falcon Patrol"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-sm transition cursor-pointer"
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Group Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-sm mb-4">Active Groups & Patrols</h3>
            <div className="space-y-3">
              {groups.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No active groups found.</div>
              ) : (
                groups.map(group => {
                  const assignedLeaders = leaders.filter(l => group.assignedLeaderIds?.includes(l.uid));
                  return (
                    <div
                      key={group.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
                        group.archived
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                          : 'bg-slate-900/10 border-slate-700/60 hover:border-slate-600 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Group Icon with click-to-upload */}
                        <label className="relative group cursor-pointer shrink-0" title="Click to upload group icon">
                          {group.photoURL ? (
                            <img
                              src={group.photoURL}
                              alt="Group Icon"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-500 transition"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs group-hover:border-emerald-500 transition uppercase">
                              <Users size={16} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[8px] font-bold text-white uppercase leading-none">
                            Edit
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleGroupIconChange(group.id, e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm">{group.name}</h4>
                            {group.archived && (
                              <span className="text-[9px] bg-red-950 text-red-400 border border-red-900 font-bold px-1.5 py-0.5 rounded uppercase">
                                Archived
                              </span>
                            )}
                          </div>
                        {group.description && (
                          <p className="text-xs text-slate-400 mt-1">{group.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Assigned Leaders:</span>
                          {assignedLeaders.length === 0 ? (
                            <span className="text-[10px] text-slate-500 italic">None</span>
                          ) : (
                            assignedLeaders.map(l => (
                              <span key={l.uid} className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                                {l.fullName || l.username} {l.leaderPosition ? `(${l.leaderPosition})` : ''}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditGroupClick(group)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => toggleArchiveGroup(group)}
                          className={`p-1.5 border rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                            group.archived
                              ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400 hover:text-white'
                              : 'bg-red-950/40 border-red-900 text-red-400 hover:text-white'
                          }`}
                        >
                          <Archive size={14} />
                          {group.archived ? 'Restore' : 'Archive'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* User Patrol Reassignments */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <Users size={16} className="text-emerald-400" /> Scout & Leader Allocation
            </h3>
            <p className="text-xs text-slate-400 mb-4">Reassign scouts and leaders to patrols below.</p>
            <div className="max-h-64 overflow-y-auto space-y-2.5 p-3 bg-slate-900 rounded-xl border border-slate-700">
              {/* Combine leaders and scouts for simple reassignment mapping */}
              {[...leaders.filter(u => u.role !== 'owner'), ...scouts].map(user => (
                <div key={user.uid} className="flex justify-between items-center gap-4 border-b border-slate-800/80 pb-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.fullName || user.username}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                      {user.role} &bull; {user.email}
                    </p>
                  </div>
                  <select
                    value={user.groupId || ''}
                    onChange={(e) => handleUserGroupReassign(user, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">No Group</option>
                    {groups.filter(g => !g.archived).map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
