import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  Award, 
  Search, 
  Filter, 
  UserCheck, 
  CheckCircle2, 
  ExternalLink, 
  Send, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star, 
  Check, 
  X, 
  ChevronRight, 
  Sparkles, 
  MessageSquare,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { MERIT_BADGE_COUNSELORS } from "../data/counselorsData";
import { MERIT_BADGES } from "../data/meritBadges";

export default function ScoutCounselorsTab({ currentUser, onNavigate }) {
  const [counselors, setCounselors] = useState(MERIT_BADGE_COUNSELORS);
  const [selectedCounselorId, setSelectedCounselorId] = useState("counselor_hassan_issa");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [eagleOnlyFilter, setEagleOnlyFilter] = useState(false);

  // Blue card request modal state
  const [requestModalBadge, setRequestModalBadge] = useState(null);
  const [requestCounselor, setRequestCounselor] = useState(null);
  const [requestNotes, setRequestNotes] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const activeCounselor = counselors.find(c => c.id === selectedCounselorId) || counselors[0];

  const filteredBadges = (activeCounselor?.badgeDetails || []).filter(b => {
    if (eagleOnlyFilter && !b.eagleRequired) return false;
    if (categoryFilter !== "all" && !b.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchCat = (b.category || "").toLowerCase().includes(q);
      return matchName || matchCat;
    }
    return true;
  });

  const handleOpenRequest = (badge, counselor) => {
    setRequestModalBadge(badge);
    setRequestCounselor(counselor);
    setRequestNotes("");
    setRequestSuccess(false);
  };

  const handleSendBlueCardRequest = async (e) => {
    e.preventDefault();
    if (!requestModalBadge || !requestCounselor) return;

    setRequestSending(true);

    try {
      const scoutName = currentUser?.fullName || currentUser?.username || "Scout Member";
      const scoutUid = currentUser?.uid || "anonymous_scout";

      const requestPayload = {
        type: "blue_card_request",
        badgeName: requestModalBadge.name,
        badgeId: requestModalBadge.id,
        isEagleRequired: !!requestModalBadge.eagleRequired,
        scoutName: scoutName,
        scoutUid: scoutUid,
        scoutEmail: currentUser?.email || "",
        counselorName: requestCounselor.leaderName,
        counselorId: requestCounselor.leaderId || requestCounselor.id,
        counselorEmail: requestCounselor.email,
        notes: requestNotes.trim(),
        status: "pending_testing",
        read: false,
        isRead: false,
        createdAt: serverTimestamp(),
        title: `📋 Blue Card Request: ${requestModalBadge.name}`,
        message: `Scout ${scoutName} has requested a Merit Badge sign-off for ${requestModalBadge.name}.`
      };

      // 1. Dispatch to global leader_notifications collection
      await addDoc(collection(db, "leader_notifications"), requestPayload);

      // 2. Dispatch to dedicated user subcollection if UID known
      if (requestCounselor.leaderId) {
        try {
          await addDoc(collection(db, "users", requestCounselor.leaderId, "notifications"), requestPayload);
        } catch (subErr) {
          console.warn("Subcollection dispatch fallback:", subErr);
        }
      }

      setRequestSuccess(true);
      setRequestSending(false);
    } catch (err) {
      console.error("Failed to send blue card request:", err);
      alert("Failed to submit request: " + err.message);
      setRequestSending(false);
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <span>⚜️ Troop Counselor Directory</span>
              <span className="text-amber-400">•</span>
              <span>In-House Testing & Sign-Offs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <span>Merit Badge Counselors & Sign-Offs</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Connect with certified Merit Badge Counselors in our troop. Schedule oral testing, request Blue Cards, and receive immediate in-house sign-offs on your road to Eagle.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <div className="bg-slate-950/90 border border-amber-500/40 p-4 rounded-2xl text-center shadow-inner">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">In-House Subjects</span>
              <span className="text-xl font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <span>27+ Certified</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">✓ Council 780 Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Counselor Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {counselors.map((c) => {
          const isSelected = selectedCounselorId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCounselorId(c.id)}
              className={`p-5 rounded-3xl border-2 transition cursor-pointer relative overflow-hidden shadow-xl ${
                isSelected
                  ? "bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-900 border-amber-500 shadow-amber-950/50 ring-2 ring-amber-500/20"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 ${c.avatarBg}`}>
                  {c.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base font-black text-white truncate">{c.leaderName}</h3>
                    {isSelected && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                        Viewing Roster
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-amber-300 font-bold block">{c.title}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{c.bsaCouncil}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck size={14} />
                  <span>Valid Thru: {c.validityFormatted}</span>
                </div>
                <span className="bg-slate-800 text-slate-200 border border-slate-700 font-black text-[11px] px-2.5 py-1 rounded-xl">
                  {c.authorizedBadges.length} Authorized Badges
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Counselor Detail & Badges Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        
        {/* Counselor Bio & Stats Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-white">{activeCounselor.leaderName}&apos;s Authorized Subjects</h3>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {activeCounselor.authorizedBadges.length} Total Subjects
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{activeCounselor.bio}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
              <Mail size={13} className="text-amber-400" />
              <span>{activeCounselor.email}</span>
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search authorized badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setEagleOnlyFilter(!eagleOnlyFilter)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                eagleOnlyFilter
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-750"
              }`}
            >
              <Star size={13} className={eagleOnlyFilter ? "text-amber-300 fill-amber-300" : "text-slate-400"} />
              <span>Eagle-Required Only</span>
            </button>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-750 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="STEM">STEM & Computing</option>
              <option value="Civics">Civics & Ethics</option>
              <option value="Outdoor">Outdoor & Survival</option>
              <option value="Life Skills">Life Skills</option>
              <option value="Safety">Safety & Health</option>
            </select>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBadges.map((badge, idx) => (
            <div
              key={badge.id || idx}
              className={`p-4 rounded-2xl border transition group hover:scale-[1.01] flex flex-col justify-between ${
                badge.eagleRequired
                  ? "bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 hover:border-emerald-400 shadow-md"
                  : "bg-slate-950/80 border-slate-800 hover:border-amber-500/40"
              }`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-750 flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-110 transition">
                    {badge.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-white truncate group-hover:text-amber-300 transition">
                        {badge.name}
                      </h4>
                      {badge.eagleRequired && (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                          Eagle Req
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{badge.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenRequest(badge, activeCounselor)}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
                >
                  <Send size={11} />
                  <span>Request Sign-Off</span>
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate("merit-badges")}
                    className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                    title="View Full Requirements & Worksheets"
                  >
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredBadges.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
              <Award size={32} className="mx-auto text-slate-600" />
              <p className="text-xs">No authorized badges match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BLUE CARD / SIGN-OFF REQUEST MODAL ── */}
      {requestModalBadge && requestCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-black shrink-0">
                  {requestModalBadge.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Request Blue Card Sign-Off</h3>
                  <p className="text-[11px] text-amber-400 font-semibold">{requestModalBadge.name} • {requestCounselor.leaderName}</p>
                </div>
              </div>
              <button
                onClick={() => setRequestModalBadge(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {requestSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/60 p-5 rounded-2xl text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-sm font-black text-white">Blue Card Request Dispatched!</h4>
                <p className="text-xs text-slate-300">
                  A direct notification and testing queue record was sent to <strong className="text-emerald-300">{requestCounselor.leaderName}</strong>. You can also follow up via WhatsApp.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Salam ${requestCounselor.leaderName}, I have submitted a Blue Card testing request for the ${requestModalBadge.name} Merit Badge in the Dhulfiqar portal. Please let me know when you are available for oral examination.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Follow up on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setRequestModalBadge(null)}
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendBlueCardRequest} className="space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Counselor:</span>
                    <strong className="text-amber-300">{requestCounselor.leaderName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Badge Classification:</span>
                    <strong className={requestModalBadge.eagleRequired ? "text-emerald-400 font-bold" : "text-slate-200"}>
                      {requestModalBadge.eagleRequired ? "⭐ Eagle-Required Badge" : "General Elective"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">BSA Council:</span>
                    <strong className="text-slate-300">{requestCounselor.bsaCouncil}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Notes / Completed Requirements Summary (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. I have finished requirements 1 through 5, completed the worksheet, and am ready for oral testing..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={requestSending}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                  >
                    <Send size={14} />
                    <span>{requestSending ? "Sending Request..." : "Submit Blue Card Request"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestModalBadge(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
