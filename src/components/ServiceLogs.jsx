import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, doc, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Calendar, Clock, MapPin, FileText, CheckCircle2, AlertCircle, Plus, Trash2, ShieldCheck, Download, X } from 'lucide-react';

export default function ServiceLogs({ currentUser, scoutId: customScoutId }) {
  const targetScoutId = customScoutId || currentUser.uid;
  const isLeaderOrOwner = currentUser.role === 'leader' || currentUser.role === 'owner';

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('volunteering'); // 'volunteering' | 'service'

  // Uploader Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState('volunteering');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [location, setLocation] = useState('');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Subscribe to scout's logs in real-time
  useEffect(() => {
    if (!targetScoutId) return;
    setLoading(true);
    const q = query(collection(db, 'service_logs'), where('scoutId', '==', targetScoutId));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date descending
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(list);
      setLoading(false);
    }, (err) => {
      console.error("Failed to load service logs:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [targetScoutId]);

  // 2. Submit new log entry
  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!location.trim() || !hours || !notes.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours <= 0) {
      setErrorMsg("Please enter a valid number of hours.");
      return;
    }

    setUploading(true);
    let fileUrl = '';
    let fileName = '';

    try {
      if (selectedFile) {
        fileName = selectedFile.name;
        const fileRef = ref(storage, `service_logs/${targetScoutId}/${Date.now()}_${fileName}`);
        await uploadBytes(fileRef, selectedFile);
        fileUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'service_logs'), {
        scoutId: targetScoutId,
        scoutName: currentUser.fullName || currentUser.username,
        type,
        date,
        timeOfDay: timeOfDay.trim(),
        location: location.trim(),
        hours: numericHours,
        notes: notes.trim(),
        fileUrl,
        fileName,
        verified: false,
        verifiedBy: '',
        verifiedByName: '',
        createdAt: serverTimestamp()
      });

      setSuccessMsg("Hours logged successfully!");
      // Reset form fields
      setLocation('');
      setHours('');
      setNotes('');
      setTimeOfDay('');
      setSelectedFile(null);
      
      setTimeout(() => {
        setShowAddForm(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to log hours: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Verify logged hours (Leaders/Owners only)
  const handleVerifyLog = async (logId) => {
    try {
      const logRef = doc(db, 'service_logs', logId);
      await updateDoc(logRef, {
        verified: true,
        verifiedBy: currentUser.uid,
        verifiedByName: currentUser.fullName || currentUser.username || currentUser.email
      });
    } catch (err) {
      console.error("Failed to verify log:", err);
      alert("Error verifying hours: " + err.message);
    }
  };

  // 4. Delete logged hours
  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this log entry?")) return;
    try {
      await deleteDoc(doc(db, 'service_logs', logId));
    } catch (err) {
      console.error("Failed to delete log:", err);
      alert("Error deleting log: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading service logs...</div>;
  }

  // Filter logs by current tab type
  const currentLogs = logs.filter(log => log.type === activeSubTab);
  
  // Calculate total hours
  const totalVolunteering = logs.filter(l => l.type === 'volunteering').reduce((sum, l) => sum + (l.hours || 0), 0);
  const totalService = logs.filter(l => l.type === 'service').reduce((sum, l) => sum + (l.hours || 0), 0);

  const totalVerifiedVolunteering = logs.filter(l => l.type === 'volunteering' && l.verified).reduce((sum, l) => sum + (l.hours || 0), 0);
  const totalVerifiedService = logs.filter(l => l.type === 'service' && l.verified).reduce((sum, l) => sum + (l.hours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Volunteering Stats */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl relative overflow-hidden flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Volunteering Log</h3>
            <p className="text-3xl font-black text-white">{totalVolunteering} <span className="text-xs font-normal text-slate-400">Total Hours</span></p>
            <p className="text-[10px] text-emerald-400 font-semibold">{totalVerifiedVolunteering} Hours Verified by Leaders</p>
          </div>
          <Clock size={40} className="text-slate-700 opacity-30" />
        </div>

        {/* Community Service Stats */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl relative overflow-hidden flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Community Service Log</h3>
            <p className="text-3xl font-black text-white">{totalService} <span className="text-xs font-normal text-slate-400">Total Hours</span></p>
            <p className="text-[10px] text-cyan-400 font-semibold">{totalVerifiedService} Hours Verified by Leaders</p>
          </div>
          <MapPin size={40} className="text-slate-700 opacity-30" />
        </div>
      </div>

      {/* Tabs list & add button */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-750 max-w-xs w-full">
          <button
            onClick={() => setActiveSubTab('volunteering')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
              activeSubTab === 'volunteering'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Volunteering
          </button>
          <button
            onClick={() => setActiveSubTab('service')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center ${
              activeSubTab === 'service'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Community Service
          </button>
        </div>

        {!showAddForm && (
          <button
            onClick={() => {
              setType(activeSubTab);
              setShowAddForm(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-lg shadow-emerald-950/20"
          >
            <Plus size={14} /> Log Hours
          </button>
        )}
      </div>

      {/* Add hours log form */}
      {showAddForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Log Hours ({type === 'volunteering' ? 'Volunteering' : 'Community Service'})</h4>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmitLog} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1 flex items-center gap-1">
                  <Clock size={11} className="text-emerald-400" /> Session Time / Start Time
                </label>
                <input
                  type="time"
                  required
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold text-slate-350 uppercase">
                    Hours Spent (0.5 hr step)
                  </label>
                  <div className="flex gap-1">
                    {[0.5, 1.0, 1.5, 2.0, 3.0, 4.0].map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHours(h.toString())}
                        className="text-[9px] bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white px-1.5 py-0.5 rounded border border-slate-700 cursor-pointer font-mono"
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  placeholder="e.g. 1.0, 1.5, 2.0, 2.5..."
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Location / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local Shia Mosque / Food Bank"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Certificate / Achievement Document (Optional)</label>
                <input
                  type="file"
                  accept="*/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-slate-700 file:text-emerald-400 hover:file:bg-slate-655 file:cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-350 uppercase mb-1">Notes & Activity Summary</label>
              <textarea
                required
                rows={3}
                placeholder="Explain what activities you performed, lessons learned, or achievements earned..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {successMsg && <p className="text-xs text-emerald-400 font-semibold">{successMsg}</p>}
            {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
              >
                {uploading ? 'Logging...' : 'Log Hours'}
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

      {/* Logs Listing */}
      {currentLogs.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 border border-slate-750 rounded-2xl p-6 italic text-slate-450 text-xs">
          No {activeSubTab === 'volunteering' ? 'volunteering hours' : 'community service hours'} logged yet.
        </div>
      ) : (
        <div className="space-y-4">
          {currentLogs.map((log) => (
            <div
              key={log.id}
              className={`bg-slate-800 border rounded-2xl p-5 shadow-xl space-y-3 transition hover:border-slate-600 ${
                log.verified ? 'border-emerald-500/20' : 'border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-white">{log.hours} Hours</span>
                    <span className="text-slate-400 text-xs">&bull;</span>
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {log.date}
                    </span>
                    {log.timeOfDay && (
                      <>
                        <span className="text-slate-400 text-xs">&bull;</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                          <Clock size={11} /> {log.timeOfDay}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin size={11} className="text-slate-500" />
                    <span>at <strong className="text-slate-300 font-semibold">{log.location}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Verification Badge */}
                  {log.verified ? (
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertCircle size={12} /> Pending Verification
                    </span>
                  )}

                  {/* Leader verification control */}
                  {isLeaderOrOwner && !log.verified && (
                    <button
                      onClick={() => handleVerifyLog(log.id)}
                      className="bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-650 text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded transition cursor-pointer"
                    >
                      Verify
                    </button>
                  )}

                  {/* Delete Option (Scout can delete pending logs, Leaders can delete any) */}
                  {(!log.verified || isLeaderOrOwner) && (
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-950/20 transition cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-750/30">
                {log.notes}
              </p>

              {/* Uploaded Certificate / Achievement Document */}
              {log.fileUrl && (
                <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-750 text-xs">
                  <span className="text-slate-350 flex items-center gap-1.5 min-w-0">
                    <FileText size={14} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{log.fileName || 'Achievement Certificate'}</span>
                  </span>
                  <a
                    href={log.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-655 text-emerald-400 p-1.5 rounded transition cursor-pointer flex items-center gap-1 shrink-0 font-bold text-[11px]"
                  >
                    <Download size={12} /> Download
                  </a>
                </div>
              )}

              {/* Verification Info footer */}
              {log.verified && log.verifiedByName && (
                <div className="text-[9px] text-slate-455 text-right italic">
                  Verified by {log.verifiedByName}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
