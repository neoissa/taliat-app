import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { RANKS_DATA } from '../data/ranksData';
import { MERIT_BADGES, TOTAL_EAGLE_REQUIRED_FOR_RANK } from '../data/meritBadges';
import { ISLAMIC_BASICS_TOPICS } from '../data/islamicBasicsData';
import { Printer, ArrowLeft, Award, Star, BookOpen, Calendar, Clock, CheckCircle2, MapPin, CheckSquare, FileText, User, Shield, Video, Check } from 'lucide-react';
import RankIcon from './RankIcon';

export default function ScoutProgressReport({ scout, currentUser, onBack }) {
  const scoutUid = scout?.uid || currentUser?.uid;

  // Real-time data states
  const [profileData, setProfileData] = useState(null);
  const [ranksProgress, setRanksProgress] = useState({});
  const [meritProgress, setMeritProgress] = useState({});
  const [islamicProgress, setIslamicProgress] = useState({});
  const [serviceLogs, setServiceLogs] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [scoutSubmissions, setScoutSubmissions] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [journalNotes, setJournalNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 1. Fetch Scout User Profile Info
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'users', scoutUid), (snap) => {
      if (snap.exists()) {
        setProfileData(snap.data());
      }
    });
    return () => unsub();
  }, [scoutUid]);

  // 2. Fetch 7 Ranks Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'ranks'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setRanksProgress(map);
    });
    return () => unsub();
  }, [scoutUid]);

  // 3. Fetch Merit Badges Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'user_progress', scoutUid, 'merit_badges'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setMeritProgress(map);
    });
    return () => unsub();
  }, [scoutUid]);

  // 4. Fetch Islamic Knowledge Progress
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'user_progress', scoutUid, 'islamic_basics', 'status'), (snap) => {
      if (snap.exists()) {
        setIslamicProgress(snap.data());
      }
    });
    return () => unsub();
  }, [scoutUid]);

  // 5. Fetch Service & Volunteering Logs
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(collection(db, 'service_logs'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.scoutId === scoutUid || l.userId === scoutUid);
      list.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
      setServiceLogs(list);
    });
    return () => unsub();
  }, [scoutUid]);

  // 6. Fetch Assignments & Scout Submissions
  useEffect(() => {
    if (!scoutUid) return;
    const unsubAssign = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignmentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSub = onSnapshot(collection(db, 'user_progress', scoutUid, 'assignments'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setScoutSubmissions(map);
    });
    return () => {
      unsubAssign();
      unsubSub();
    };
  }, [scoutUid]);

  // 7. Fetch Upcoming/Attended Events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
      setEventsList(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 8. Fetch Journal Notes
  useEffect(() => {
    if (!scoutUid) return;
    const unsub = onSnapshot(doc(db, 'user_progress', scoutUid, 'journal', 'entries'), (snap) => {
      if (snap.exists() && Array.isArray(snap.data().notes)) {
        setJournalNotes(snap.data().notes);
      }
    });
    return () => unsub();
  }, [scoutUid]);

  // Calculate totals
  const scoutInfo = profileData || scout || currentUser || {};
  const scoutFullName = scoutInfo.fullName || scoutInfo.username || 'Scout Member';
  const scoutRank = scoutInfo.rank || 'Scout';
  const scoutPatrol = scoutInfo.patrolName || scoutInfo.patrolId || 'Taliʿa Patrol';

  const totalServiceHours = serviceLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  const verifiedServiceHours = serviceLogs.filter(l => l.verified).reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  const earnedMeritBadges = MERIT_BADGES.filter(b => {
    const p = meritProgress[b.id];
    if (!p) return false;
    const total = b.requirements.length;
    const approved = b.requirements.filter(r => p.steps?.[r.id] === true || p.steps?.[r.id]?.completed === true).length;
    return total > 0 && approved === total;
  });

  const plannedMeritBadges = MERIT_BADGES.filter(b => meritProgress[b.id]?.planned && !earnedMeritBadges.some(e => e.id === b.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12 text-slate-900">
      {/* Print / Back Toolbar (Screen Only) */}
      <div className="flex justify-between items-center bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-xl print-hide">
        <button
          type="button"
          onClick={onBack}
          className="bg-slate-700 hover:bg-slate-650 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Tracker
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Printer size={16} /> Print Full Official Report (PDF)
        </button>
      </div>

      {/* ── PRINTABLE REPORT CONTAINER ── */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl space-y-8 border border-slate-300 text-slate-900 print:p-0 print:border-none print:shadow-none print:m-0 print:rounded-none">
        
        {/* 1. OFFICIAL HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-emerald-800 pb-5 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-white flex items-center justify-center text-3xl font-black shrink-0 print:border print:border-emerald-950">
              ⚜️
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-emerald-950 uppercase">
                DHULFIQĀR SCOUTS BSA
              </h1>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-0.5">
                Official Comprehensive Advancement & Progress Record
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 font-mono space-y-0.5">
            <p><strong>Report Date:</strong> {reportDate}</p>
            <p><strong>Troop Unit:</strong> Taliʿa Troop 110</p>
            <p><strong>Status:</strong> Official Member Record</p>
          </div>
        </div>

        {/* 2. SCOUT DEMOGRAPHICS & PROFILE BOX */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Scout Name</span>
            <strong className="text-sm text-slate-900 font-black">{scoutFullName}</strong>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Active Rank</span>
            <strong className="text-sm text-emerald-800 font-black capitalize">{scoutRank} Rank</strong>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Patrol Unit</span>
            <strong className="text-sm text-slate-900 font-bold">{scoutPatrol}</strong>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">BSA Member ID</span>
            <strong className="text-sm text-slate-900 font-mono">{scoutInfo.bsaId || '—'}</strong>
          </div>
        </div>

        {/* 3. ADVANCEMENT & BSA 7 RANKS DETAILED BREAKDOWN */}
        <div className="space-y-4">
          <div className="border-b-2 border-emerald-800 pb-1.5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span>⚜️ Section 1: BSA 7 Ranks Advancement Checklist</span>
            </h3>
            <span className="text-xs font-bold text-emerald-900">Official Sign-off Record</span>
          </div>

          <div className="space-y-4">
            {RANKS_DATA.map(rank => {
              const rProgress = ranksProgress[rank.id] || {};
              const completedReqs = rProgress.completedRequirements || {};
              const totalReqs = rank.categories.reduce((s, c) => s + c.requirements.length, 0);
              const approvedCount = rank.categories.reduce((s, c) => s + c.requirements.filter(r => completedReqs[r.id]?.completed).length, 0);
              const isRankComplete = totalReqs > 0 && approvedCount === totalReqs;

              return (
                <div key={rank.id} className="border border-slate-200 rounded-xl overflow-hidden break-inside-avoid bg-slate-50/50">
                  <div className="bg-slate-100 p-3 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{rank.name} Rank</span>
                      {isRankComplete ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                          ✓ Completed & Conferred
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.2 rounded-full">
                          {approvedCount} / {totalReqs} Completed ({Math.round((approvedCount/totalReqs)*100)}%)
                        </span>
                      )}
                    </div>
                    {rProgress.approvedAt && (
                      <span className="text-[11px] text-slate-600 font-mono">
                        Conferred: {rProgress.approvedAt}
                      </span>
                    )}
                  </div>

                  <div className="p-3 text-xs space-y-1.5">
                    {rank.categories.map(cat => (
                      <div key={cat.name} className="space-y-1">
                        <span className="font-bold text-[10px] uppercase text-slate-500 block">{cat.name}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {cat.requirements.map(req => {
                            const reqData = completedReqs[req.id] || {};
                            const isDone = !!reqData.completed;

                            return (
                              <div key={req.id} className={`p-1.5 rounded-lg border text-[11px] flex items-start gap-1.5 ${isDone ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-white border-slate-200 text-slate-600'}`}>
                                <span className="font-bold mt-0.5">{isDone ? '✓' : '○'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="line-clamp-2 leading-tight">{req.text}</p>
                                  {isDone && reqData.approvedAt && (
                                    <span className="text-[9px] text-emerald-700 block mt-0.5 font-mono">
                                      Signed: {reqData.approvedAt} {reqData.approvedByName ? `(${reqData.approvedByName})` : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. ISLAMIC KNOWLEDGE & KARBALA CURRICULUM */}
        <div className="space-y-3 break-inside-avoid">
          <div className="border-b-2 border-emerald-800 pb-1.5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span>🕌 Section 2: Islamic Knowledge, 14 Infallibles & Karbala Curriculum</span>
            </h3>
            <span className="text-xs font-bold text-emerald-900">Faith Modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">The 14 Infallibles (Ma'sumeen)</span>
              <p className="text-[11px] text-slate-600">
                Biographies, life lessons, virtues & teachings of Prophet Muhammad (S) and Ahl al-Bayt (A).
              </p>
              <span className="text-[10px] text-emerald-800 font-bold block mt-1">
                ✓ Curriculum Covered
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Karbala Heroes & Martyrs</span>
              <p className="text-[11px] text-slate-600">
                Imam Husayn, al-Abbas, Ali al-Akbar, Qasim, Muslim ibn Aqil, Habib ibn Madhahir & Karbala values.
              </p>
              <span className="text-[10px] text-emerald-800 font-bold block mt-1">
                ✓ Curriculum Covered
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Daily Du'as & Post-Prayer Ta'qibat</span>
              <p className="text-[11px] text-slate-600">
                Ayat al-Kursi, Tasbih az-Zahra (SA), Du'a al-Faraj, Du'a al-Ahd & daily supplications.
              </p>
              <span className="text-[10px] text-emerald-800 font-bold block mt-1">
                ✓ Curriculum Covered
              </span>
            </div>
          </div>
        </div>

        {/* 5. MERIT BADGES & EAGLE ROADMAP */}
        <div className="space-y-3 break-inside-avoid">
          <div className="border-b-2 border-emerald-800 pb-1.5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span>🏅 Section 3: Merit Badges & 21-Badge Eagle Roadmap</span>
            </h3>
            <span className="text-xs font-bold text-emerald-900">
              {earnedMeritBadges.length} Earned • {plannedMeritBadges.length} Planned
            </span>
          </div>

          {earnedMeritBadges.length === 0 && plannedMeritBadges.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
              No merit badges earned or planned yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {earnedMeritBadges.map(b => (
                <div key={b.id} className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 truncate">{b.name}</span>
                    {b.eagleRequired && <span className="text-[9px] text-amber-700 font-black">★ EAGLE</span>}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">✓ Earned & Signed</span>
                </div>
              ))}

              {plannedMeritBadges.map(b => (
                <div key={b.id} className="p-2.5 bg-amber-50 rounded-xl border border-amber-300 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 truncate">{b.name}</span>
                    {b.eagleRequired && <span className="text-[9px] text-amber-800 font-black">★ EAGLE</span>}
                  </div>
                  <span className="text-[10px] text-amber-800 font-semibold block">🎯 Planned for Eagle</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. SERVICE & VOLUNTEERING HOURS LOG TABLE */}
        <div className="space-y-3 break-inside-avoid">
          <div className="border-b-2 border-emerald-800 pb-1.5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span>⏱️ Section 4: Community Service & Volunteering Logs</span>
            </h3>
            <span className="text-xs font-bold text-emerald-900">
              Total: {totalServiceHours} Hours ({verifiedServiceHours} Verified)
            </span>
          </div>

          {serviceLogs.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
              No community service or volunteering hours logged yet.
            </p>
          ) : (
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-600">
                  <th className="p-2">Date</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Location / Organization</th>
                  <th className="p-2">Hours</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="border-b border-slate-200">
                    <td className="p-2 font-mono">{log.date}</td>
                    <td className="p-2 capitalize">{log.type}</td>
                    <td className="p-2">{log.location}</td>
                    <td className="p-2 font-bold text-emerald-900">{log.hours} hrs</td>
                    <td className="p-2">
                      {log.verified ? (
                        <span className="text-emerald-700 font-bold">✓ Verified</span>
                      ) : (
                        <span className="text-slate-500 italic">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 7. ASSIGNMENTS & HOMEWORK TASKS */}
        <div className="space-y-3 break-inside-avoid">
          <div className="border-b-2 border-emerald-800 pb-1.5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span>🎒 Section 5: Homework, Videos & Tasks Record</span>
            </h3>
            <span className="text-xs font-bold text-emerald-900">
              {assignmentsList.length} Total Assigned
            </span>
          </div>

          {assignmentsList.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
              No homework tasks assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {assignmentsList.map(item => {
                const sub = scoutSubmissions[item.id] || {};
                const isCompleted = sub.completed || false;

                return (
                  <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Due: {item.dueDate || '—'}</span>
                    </div>
                    <div>
                      {isCompleted ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 8. SCOUT STATEMENT & DATED JOURNAL REFLECTIONS */}
        <div className="space-y-3 break-inside-avoid">
          <div className="border-b-2 border-emerald-800 pb-1.5">
            <h3 className="font-black text-sm uppercase tracking-wider text-emerald-950">
              📝 Section 6: Scout Biography & Journal Notes ({journalNotes.length} Entries)
            </h3>
          </div>

          {scoutInfo.bio && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">About Me Statement</span>
              <p className="text-slate-800 whitespace-pre-wrap">{scoutInfo.bio}</p>
            </div>
          )}

          {journalNotes.length > 0 && (
            <div className="space-y-2">
              {journalNotes.slice(0, 5).map((note, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>📅 {note.date} • {note.category || 'Note'}</span>
                    <span>By: {note.authorName || scoutFullName}</span>
                  </div>
                  <p className="text-slate-800">{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 9. OFFICIAL SIGNATURES & TROOP ENDORSEMENT */}
        <div className="pt-8 border-t-2 border-slate-300 text-xs break-inside-avoid space-y-8">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div className="border-b-2 border-slate-400 h-10 mb-1.5"></div>
              <p className="font-bold text-slate-800">Scout Member Signature</p>
              <p className="text-[10px] text-slate-500 font-mono">Date: ________________________</p>
            </div>

            <div>
              <div className="border-b-2 border-slate-400 h-10 mb-1.5"></div>
              <p className="font-bold text-slate-800">Scoutmaster / Troop Leader Signature</p>
              <p className="text-[10px] text-slate-500 font-mono">Date: ________________________</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-mono pt-4 border-t border-slate-200">
            Official Document of Taliʿa / Dhulfiqār Scouts BSA • Generated on {reportDate} • Valid with Leader Signature
          </div>
        </div>

      </div>
    </div>
  );
}
