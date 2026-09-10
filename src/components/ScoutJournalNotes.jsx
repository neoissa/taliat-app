import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, collection, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import {
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Printer,
  FileText,
  FileSpreadsheet,
  Download,
  ChevronDown,
  User,
  Users,
  CheckCircle2,
  Tag,
  Flame,
  Tent,
  Heart,
  Award,
  Star,
  Clock,
  Pin,
  X,
  Check
} from 'lucide-react';

const SCOUT_CATEGORIES = [
  { id: 'General Note', label: '📝 General Note', color: 'bg-slate-700 text-slate-200' },
  { id: 'Campout & Outdoors', label: '⛺ Campout & Outdoors', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40' },
  { id: 'Troop Meeting & Halqa', label: '🕌 Meeting & Halqa', color: 'bg-teal-900/60 text-teal-300 border-teal-500/40' },
  { id: 'Service Project', label: '❤️ Service Project', color: 'bg-rose-900/60 text-rose-300 border-rose-500/40' },
  { id: 'Rank Advancement', label: '⚜️ Rank Advancement', color: 'bg-amber-900/60 text-amber-300 border-amber-500/40' },
  { id: 'Merit Badge Reflection', label: '🏅 Merit Badge Reflection', color: 'bg-sky-900/60 text-sky-300 border-sky-500/40' },
  { id: 'Leadership & Patrol Duty', label: '🛡️ Leadership & Patrol Duty', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40' },
  { id: 'Spiritual / Dua Reflection', label: '🤲 Spiritual / Du\'a Reflection', color: 'bg-purple-900/60 text-purple-300 border-purple-500/40' }
];

const LEADER_CATEGORIES = [
  { id: 'General Leadership Note', label: '📝 General Leadership Note', color: 'bg-slate-700 text-slate-200' },
  { id: 'Patrol & Troop Meeting Log', label: '🛡️ Patrol & Troop Meeting Log', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40' },
  { id: 'Campout & Outdoors Log', label: '⛺ Campout & Outdoors Log', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40' },
  { id: 'Halqa & Islamic Lesson Log', label: '🕌 Halqa & Lesson Log', color: 'bg-teal-900/60 text-teal-300 border-teal-500/40' },
  { id: 'Service Project Log', label: '❤️ Service Project Log', color: 'bg-rose-900/60 text-rose-300 border-rose-500/40' },
  { id: 'Advancement & Scout Review', label: '⚜️ Advancement & Review Note', color: 'bg-amber-900/60 text-amber-300 border-amber-500/40' },
  { id: 'Merit Badge Counseling', label: '🏅 Merit Badge Counseling', color: 'bg-sky-900/60 text-sky-300 border-sky-500/40' },
  { id: 'Spiritual / Dua Reflection', label: '🤲 Spiritual / Du\'a Reflection', color: 'bg-purple-900/60 text-purple-300 border-purple-500/40' }
];

export default function ScoutJournalNotes({ currentUser, customScoutId }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster';
  const isLeaderOrOwner = isOwner || isLeader;

  const categories = isLeaderOrOwner ? LEADER_CATEGORIES : SCOUT_CATEGORIES;
  const defaultCategory = isLeaderOrOwner ? 'General Leadership Note' : 'General Note';

  // Target User/Owner of this journal (the current user themselves by default)
  const targetUserId = customScoutId || currentUser?.uid;

  // Journal Notes State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [noteCategory, setNoteCategory] = useState(defaultCategory);
  const [noteText, setNoteText] = useState('');
  const [noteMood, setNoteMood] = useState('⭐');
  const [savingNote, setSavingNote] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  // Editing State
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editText, setEditText] = useState('');
  const [editMood, setEditMood] = useState('⭐');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '30days' | '90days'

  // Print Mode State
  const [showPrintView, setShowPrintView] = useState(false);

  // Real-Time Journal Notes Listener (bound directly to current user's journal)
  useEffect(() => {
    if (!targetUserId) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const docRef = doc(db, 'user_progress', targetUserId, 'journal', 'entries');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists() && Array.isArray(snap.data().notes)) {
        const sorted = [...snap.data().notes].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (b.date || '').localeCompare(a.date || '');
        });
        setNotes(sorted);
      } else {
        setNotes([]);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Journal notes listener error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [targetUserId]);

  // 4. Save New Note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!targetUserId || !noteText.trim()) return;
    setSavingNote(true);
    setFormMsg('');

    const newEntry = {
      id: Date.now().toString(),
      title: noteTitle.trim() || noteCategory,
      date: noteDate || new Date().toISOString().split('T')[0],
      category: noteCategory || defaultCategory,
      text: noteText.trim(),
      mood: noteMood || '⭐',
      pinned: false,
      authorId: currentUser?.uid || '',
      authorName: currentUser?.fullName || currentUser?.username || (isLeaderOrOwner ? 'Leader' : 'Scout'),
      authorRole: currentUser?.role || (isLeaderOrOwner ? 'leader' : 'scout'),
      createdAt: new Date().toISOString()
    };

    const updated = [newEntry, ...notes];

    try {
      const docRef = doc(db, 'user_progress', targetUserId, 'journal', 'entries');
      await setDoc(docRef, { notes: updated }, { merge: true });
      setNoteTitle('');
      setNoteText('');
      setNoteMood('⭐');
      setShowAddForm(false);
      setFormMsg('✓ Note added to journal!');
      setTimeout(() => setFormMsg(''), 3000);
    } catch (err) {
      console.error("Failed to add note:", err);
      setFormMsg('Failed to add note: ' + err.message);
    } finally {
      setSavingNote(false);
    }
  };

  // 5. Save Inline Edit
  const handleSaveEdit = async (noteId) => {
    if (!targetUserId || !noteId || !editText.trim()) return;
    const updated = notes.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          title: editTitle.trim() || editCategory,
          date: editDate || n.date,
          category: editCategory || n.category,
          text: editText.trim(),
          mood: editMood || n.mood,
          updatedAt: new Date().toISOString(),
          updatedByName: currentUser?.fullName || currentUser?.username || 'Editor'
        };
      }
      return n;
    });

    try {
      const docRef = doc(db, 'user_progress', targetUserId, 'journal', 'entries');
      await setDoc(docRef, { notes: updated }, { merge: true });
      setEditingNoteId(null);
    } catch (err) {
      console.error("Failed to save edit:", err);
    }
  };

  // 6. Toggle Pin
  const handleTogglePin = async (noteId) => {
    if (!targetUserId || !noteId) return;
    const updated = notes.map(n => {
      if (n.id === noteId) return { ...n, pinned: !n.pinned };
      return n;
    });
    try {
      const docRef = doc(db, 'user_progress', targetUserId, 'journal', 'entries');
      await setDoc(docRef, { notes: updated }, { merge: true });
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  // 7. Delete Note
  const handleDeleteNote = async (noteId) => {
    if (!targetUserId || !noteId) return;
    if (!window.confirm("Are you sure you want to permanently delete this journal note?")) return;
    const updated = notes.filter(n => n.id !== noteId);
    try {
      const docRef = doc(db, 'user_progress', targetUserId, 'journal', 'entries');
      await setDoc(docRef, { notes: updated }, { merge: true });
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title || note.category || '');
    setEditDate(note.date || '');
    setEditCategory(note.category || defaultCategory);
    setEditText(note.text || '');
    setEditMood(note.mood || '⭐');
  };

  // Filter Notes Engine
  const filteredNotes = notes.filter(n => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (n.text || '').toLowerCase().includes(q);
      const matchTitle = (n.title || '').toLowerCase().includes(q);
      const matchCat = (n.category || '').toLowerCase().includes(q);
      const matchAuthor = (n.authorName || '').toLowerCase().includes(q);
      if (!matchText && !matchTitle && !matchCat && !matchAuthor) return false;
    }

    // Category filter
    if (selectedCategoryFilter !== 'all' && n.category !== selectedCategoryFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== 'all' && n.date) {
      const noteTime = new Date(n.date).getTime();
      const now = Date.now();
      if (dateFilter === '30days' && now - noteTime > 30 * 24 * 60 * 60 * 1000) return false;
      if (dateFilter === '90days' && now - noteTime > 90 * 24 * 60 * 60 * 1000) return false;
    }

    return true;
  });

  // Export Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = currentUser?.fullName || currentUser?.username || (isLeaderOrOwner ? 'Leader' : 'Scout');
  const userRank = currentUser?.leaderPosition || currentUser?.rank || (isLeaderOrOwner ? 'Troop Leader' : 'Scout');
  const userPatrol = currentUser?.patrolName || (isLeaderOrOwner ? 'Leadership' : 'Taliʿa Patrol');

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    if (notes.length === 0) {
      alert("No notes available to export.");
      return;
    }

    const dataToExport = filteredNotes.map(n => ({
      "Date": n.date || '',
      "Title / Topic": n.title || n.category || '',
      "Category": n.category || '',
      "Mood / Tag": n.mood || '',
      "Content / Notes": n.text || '',
      "Author": n.authorName || (isLeaderOrOwner ? 'Leader' : 'Scout'),
      "Role": n.authorRole || (isLeaderOrOwner ? 'leader' : 'scout'),
      "Pinned": n.pinned ? 'Yes' : 'No',
      "Last Updated": n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : ''
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    ws['!cols'] = [
      { wch: 12 }, // Date
      { wch: 30 }, // Title
      { wch: 25 }, // Category
      { wch: 10 }, // Mood
      { wch: 60 }, // Content
      { wch: 18 }, // Author
      { wch: 12 }, // Role
      { wch: 8 },  // Pinned
      { wch: 14 }  // Last Updated
    ];

    const wb = XLSX.utils.book_new();
    const sheetTitle = isLeaderOrOwner ? 'Leader Notes' : 'Scout Journal';
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);

    const sanitizedName = (userName || 'Journal').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${sanitizedName}_Journal_Notes_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
    setShowExportMenu(false);
  };

  // Export to Word Document (.doc)
  const handleExportDoc = () => {
    if (notes.length === 0) {
      alert("No notes available to export.");
      return;
    }

    const sanitizedName = (userName || 'Journal').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${sanitizedName}_Journal_Notes_${dateStr}.doc`;

    const notesHtml = filteredNotes.map(n => `
      <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 16px; background-color: #f8fafc; font-family: Calibri, Arial, sans-serif;">
        <table style="width: 100%; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
          <tr>
            <td style="font-size: 13pt; font-weight: bold; color: #0f172a;">
              ${n.mood || '⭐'} ${n.title || n.category || 'Journal Note'}
            </td>
            <td style="text-align: right; font-size: 10pt; color: #475569; font-weight: bold;">
              ${n.date || ''}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="font-size: 9.5pt; color: #059669; font-weight: bold; padding-top: 2px;">
              Category: ${n.category || ''} ${n.pinned ? ' • [PINNED]' : ''}
            </td>
          </tr>
        </table>
        <p style="font-size: 11pt; color: #1e293b; line-height: 1.5; white-space: pre-wrap; margin: 8px 0;">
          ${(n.text || '').replace(/\n/g, '<br/>')}
        </p>
        <div style="font-size: 8.5pt; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 4px; text-align: right;">
          Author: ${n.authorName || 'User'} (${n.authorRole || 'leader'}) ${n.updatedAt ? ` • Updated: ${new Date(n.updatedAt).toLocaleDateString()}` : ''}
        </div>
      </div>
    `).join('');

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${sanitizedName} Journal Notes</title>
        <style>
          @page {
            margin: 1.0in;
          }
          body {
            font-family: Calibri, 'Segoe UI', Arial, sans-serif;
            color: #0f172a;
          }
          h1 {
            color: #065f46;
            font-size: 20pt;
            margin-bottom: 2px;
          }
          h2 {
            color: #334155;
            font-size: 13pt;
            font-weight: normal;
            margin-top: 0;
            margin-bottom: 12px;
          }
        </style>
      </head>
      <body>
        <div style="border-bottom: 2px solid #065f46; padding-bottom: 10px; margin-bottom: 20px;">
          <h1>Dhulfiqār Scouts BSA</h1>
          <h2>${isLeaderOrOwner ? 'Official Leader Journal & Meeting Notes Record' : 'Official Scout Journal & Dated Notes Record'}</h2>
          <table style="width: 100%; font-size: 10pt; color: #475569;">
            <tr>
              <td><strong>${isLeaderOrOwner ? 'Leader:' : 'Scout:'}</strong> ${userName}</td>
              <td style="text-align: right;"><strong>Date Exported:</strong> ${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>Role / Rank:</strong> ${userRank} &bull; <strong>Patrol:</strong> ${userPatrol}</td>
              <td style="text-align: right;"><strong>Total Entries:</strong> ${filteredNotes.length}</td>
            </tr>
          </table>
        </div>
        ${notesHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const sanitizedName = (userName || 'User').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    
    document.title = `${sanitizedName}_Journal_Notes_${dateStr}`;
    window.print();
    
    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16">
      {/* ── 1. HEADER & HERO CONTROL BANNER ── */}
      <div className="bg-slate-850 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 print-hide">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shadow-lg shrink-0">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {isLeaderOrOwner ? 'Leader Journal & Dated Notes' : 'My Scout Journal & Dated Notes'}
                </h2>
                <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {notes.length} Total Entr{notes.length === 1 ? 'y' : 'ies'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLeaderOrOwner 
                  ? 'Log meeting minutes, patrol observations, campout logs, halqa takeaways, and leadership notes.' 
                  : 'Log campout reflections, meeting notes, skill takeaways, and personal goals.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Export Hub Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} className="text-emerald-400" />
                <span>Export</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Export Format
                  </div>
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 rounded-xl transition text-left cursor-pointer"
                  >
                    <FileSpreadsheet size={15} className="text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div>Export to Excel</div>
                      <div className="text-[10px] font-normal text-slate-400">Microsoft Excel (.xlsx)</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportDoc}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-sky-300 hover:bg-slate-800/80 rounded-xl transition text-left cursor-pointer"
                  >
                    <FileText size={15} className="text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <div>Export to Word</div>
                      <div className="text-[10px] font-normal text-slate-400">Microsoft Word (.doc)</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handlePrint();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 rounded-xl transition text-left cursor-pointer"
                  >
                    <Printer size={15} className="text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div>Export to PDF</div>
                      <div className="text-[10px] font-normal text-slate-400">Printable PDF Report</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Print / Save PDF"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <Plus size={15} />
              <span>{showAddForm ? 'Close Form' : (isLeaderOrOwner ? 'New Leader Note' : 'New Journal Note')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. NEW ENTRY CREATION MODAL / COLLAPSIBLE FORM ── */}
      {showAddForm && (
        <form onSubmit={handleCreateNote} className="bg-slate-800 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl space-y-4 animate-fadeIn print-hide">
          <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-400" />
              <span>{isLeaderOrOwner ? 'Log New Leadership Note' : 'Log New Scout Journal Entry'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Note Title / Topic
              </label>
              <input
                type="text"
                placeholder={isLeaderOrOwner ? "e.g. PLC Meeting Minutes / Camp Logistics" : "e.g. Pine Bush Winter Campout"}
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Date Logged
              </label>
              <input
                type="date"
                required
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Category / Topic
              </label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood / Rating Picker */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {isLeaderOrOwner ? 'Status / Mood Tag:' : 'Scout Spirit Tag:'}
            </span>
            <div className="flex gap-1.5">
              {['⭐', '🛡️', '🏕️', '🔥', '🏆', '💡', '🤝', '🤲'].map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setNoteMood(emoji)}
                  className={`w-8 h-8 rounded-xl border text-sm transition cursor-pointer flex items-center justify-center ${
                    noteMood === emoji
                      ? 'bg-emerald-600/30 border-emerald-400 scale-110'
                      : 'bg-slate-900 border-slate-750 hover:border-slate-650 text-slate-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isLeaderOrOwner ? 'Meeting Minutes, Observations & Action Items' : 'Your Reflection & Detailed Notes'}
            </label>
            <textarea
              required
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={isLeaderOrOwner ? "Meeting notes, scout performance observations, event takeaways, or future action items..." : "What happened? What skills did you practice? What did you learn or plan to accomplish next?"}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-750 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingNote}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{savingNote ? 'Saving...' : 'Save Note'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── 3. SEARCH & CATEGORY FILTER CONTROLS ── */}
      <div className="bg-slate-850 border border-slate-700 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between print-hide">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by keyword, title, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white text-xs cursor-pointer focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-white text-xs cursor-pointer focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Dates</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* ── 4. JOURNAL NOTES STREAM / LIST ── */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading notes...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-750 rounded-3xl p-12 text-center space-y-3">
            <BookOpen size={40} className="mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Notes Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {notes.length === 0
                ? (isLeaderOrOwner
                    ? 'Start recording meeting minutes, patrol observations, campout notes, and leadership action items in your leadership log.'
                    : 'Start recording campouts, halqas, merit badge work, and reflections in your personal scout journal.')
                : 'No notes match your current search or category filter.'}
            </p>
            {notes.length === 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 mt-2"
              >
                <Plus size={14} />
                <span>Create First Note</span>
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isEditing = editingNoteId === note.id;
            const categoryObj = categories.find(c => c.id === note.category) || categories[0] || { label: note.category, color: 'bg-slate-700 text-slate-200' };

            if (isEditing) {
              return (
                <div key={note.id} className="bg-slate-800 border-2 border-amber-500/50 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed"
                  />
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={() => setEditingNoteId(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(note.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <Check size={13} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={note.id}
                className={`bg-slate-800 border rounded-2xl p-5 shadow-lg space-y-3 transition group ${
                  note.pinned ? 'border-amber-500/60 bg-gradient-to-r from-amber-950/20 via-slate-800 to-slate-800' : 'border-slate-700 hover:border-slate-650'
                }`}
              >
                {/* Note Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{note.mood || '⭐'}</span>
                    <span className="font-extrabold text-sm text-white">
                      {note.title || note.category || 'Journal Note'}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${categoryObj.color}`}>
                      {categoryObj.label}
                    </span>
                    {note.pinned && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <Calendar size={12} /> {note.date}
                    </span>
                    <div className="flex items-center gap-1 print-hide">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(note.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          note.pinned ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-amber-400'
                        }`}
                        title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                      >
                        <Pin size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                        title="Edit note"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Note Content */}
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {note.text}
                </p>

                {/* Note Footer Details */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-750/60">
                  <span>Author: <strong className="text-slate-400">{note.authorName || 'User'}</strong> ({note.authorRole || 'leader'})</span>
                  {note.updatedAt && (
                    <span className="italic">Updated on {new Date(note.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 5. CLEAN PRINT REPORT VIEW (VISIBLE ON PRINT ONLY) ── */}
      <div className="hidden print:block bg-white text-slate-900 p-8 space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black uppercase">Dhulfiqār Scouts BSA</h1>
            <h2 className="text-sm font-bold text-slate-700">
              {isLeaderOrOwner ? 'Official Leader Journal & Meeting Notes Record' : 'Official Scout Journal & Dated Notes Record'}
            </h2>
          </div>
          <div className="text-right text-xs font-mono">
            <p><strong>{isLeaderOrOwner ? 'Leader:' : 'Scout:'}</strong> {userName}</p>
            <p><strong>Position/Rank:</strong> {userRank} &bull; <strong>Patrol:</strong> {userPatrol}</p>
            <p><strong>Date Printed:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="border border-slate-300 rounded-lg p-4 space-y-2 page-break-avoid">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <strong className="text-xs font-bold text-slate-950">
                  {note.mood} {note.title || note.category} ({note.category})
                </strong>
                <span className="text-xs font-mono text-slate-700 font-bold">{note.date}</span>
              </div>
              <p className="text-xs text-slate-850 leading-relaxed whitespace-pre-wrap font-serif">
                {note.text}
              </p>
              <div className="text-[10px] text-slate-500 text-right">
                Logged by {note.authorName || 'User'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
