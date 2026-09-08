import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import {
  MessageSquare,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  Check,
  Send,
  ExternalLink,
  ChevronRight,
  Shield,
  X,
  Sparkles,
  AlertTriangle,
  Award,
  RefreshCw,
  Eye
} from 'lucide-react';
import { acknowledgeParentRequest, resolveParentRequest } from '../services/parentRequestService';

export default function LeaderParentRequests({ currentUser = {}, onNavigate }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isExecutive = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'executive' || currentUser?.isExecutive || currentUser?.leaderPosition === 'Scoutmaster' || currentUser?.leaderPosition === 'Assistant Scoutmaster';

  const [requests, setRequests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeTab, setActiveTab] = useState('pending'); // 'all' | 'pending' | 'absence_notice' | 'signed_report' | 'meeting_request' | 'form_submission' | 'resolved'
  const [patrolFilter, setPatrolFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution Modal State
  const [resolvingRequest, setResolvingRequest] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('resolved'); // 'resolved' | 'approved'
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // 1. Subscribe to Parent Requests
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'parent_requests'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setRequests(list);
      setLoading(false);
    }, (err) => {
      console.warn("Parent requests listener fallback:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Subscribe to Groups
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => !g.archived));
    });
    return () => unsub();
  }, []);

  // 3. Subscribe to Users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Leader Scoped Requests
  const scopedRequests = useMemo(() => {
    return requests.filter(req => {
      // Normal leaders only see their patrol
      if (!isExecutive && currentUser?.groupId) {
        if (req.patrolId && req.patrolId !== currentUser.groupId && req.patrolName !== currentUser.assignedPatrol) {
          return false;
        }
      }
      return true;
    });
  }, [requests, isExecutive, currentUser?.groupId, currentUser?.assignedPatrol]);

  // Filtered List
  const filteredRequests = useMemo(() => {
    return scopedRequests.filter(req => {
      // 1. Tab Filter
      if (activeTab === 'pending') {
        if (req.status !== 'pending_review') return false;
      } else if (activeTab === 'resolved') {
        if (req.status !== 'resolved' && req.status !== 'approved') return false;
      } else if (activeTab !== 'all') {
        if (req.requestType !== activeTab) return false;
      }

      // 2. Patrol Filter
      if (patrolFilter !== 'all') {
        if (req.patrolId !== patrolFilter && req.patrolName !== patrolFilter) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const scoutMatch = (req.scoutName || '').toLowerCase().includes(q);
        const parentMatch = (req.parentName || '').toLowerCase().includes(q);
        const msgMatch = (req.message || '').toLowerCase().includes(q);
        const typeMatch = (req.requestType || '').toLowerCase().includes(q);
        const patrolMatch = (req.patrolName || '').toLowerCase().includes(q);
        if (!scoutMatch && !parentMatch && !msgMatch && !typeMatch && !patrolMatch) return false;
      }

      return true;
    });
  }, [scopedRequests, activeTab, patrolFilter, searchQuery]);

  // KPI Counts
  const kpis = useMemo(() => {
    return {
      pending: scopedRequests.filter(r => r.status === 'pending_review').length,
      absences: scopedRequests.filter(r => r.requestType === 'absence_notice').length,
      signedReports: scopedRequests.filter(r => r.requestType === 'signed_report').length,
      meetingRequests: scopedRequests.filter(r => r.requestType === 'meeting_request').length,
      formSubmissions: scopedRequests.filter(r => r.requestType === 'form_submission').length,
      resolved: scopedRequests.filter(r => r.status === 'resolved' || r.status === 'approved').length
    };
  }, [scopedRequests]);

  // Quick Acknowledge Action
  const handleAcknowledge = async (req) => {
    try {
      await acknowledgeParentRequest({
        requestId: req.requestId || req.id,
        leaderUid: currentUser?.uid,
        leaderName: currentUser?.fullName || currentUser?.username || 'Troop Leader',
        acknowledgmentNote: 'Reviewed by Unit Leadership'
      });
      setActionSuccessMsg(`✓ Acknowledged submission for ${req.scoutName}`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err) {
      alert("Failed to acknowledge: " + err.message);
    }
  };

  // Submit Resolution Modal
  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!resolvingRequest) return;
    setIsSubmittingResolution(true);

    try {
      await resolveParentRequest({
        requestId: resolvingRequest.requestId || resolvingRequest.id,
        leaderUid: currentUser?.uid,
        leaderName: currentUser?.fullName || currentUser?.username || 'Troop Leader',
        resolutionStatus,
        resolutionNote: resolutionNote.trim(),
        parentUid: resolvingRequest.parentUid,
        parentEmail: resolvingRequest.parentEmail,
        scoutName: resolvingRequest.scoutName
      });

      setActionSuccessMsg(`✓ Request ${resolutionStatus.toUpperCase()} and parent notified.`);
      setTimeout(() => {
        setResolvingRequest(null);
        setResolutionNote('');
        setActionSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert("Failed to resolve request: " + err.message);
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  // Helper for Request Type Badge Info
  const getTypeBadge = (type) => {
    switch (type) {
      case 'absence_notice':
        return {
          icon: '🤒',
          label: 'Absence Notice',
          color: 'bg-amber-950/80 text-amber-300 border-amber-500/50'
        };
      case 'signed_report':
        return {
          icon: '⚜️',
          label: 'Signed Progress Report',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
        };
      case 'meeting_request':
        return {
          icon: '🤝',
          label: 'Conference Request',
          color: 'bg-sky-950/80 text-sky-300 border-sky-500/50'
        };
      case 'form_submission':
        return {
          icon: '📋',
          label: 'Form & Waiver',
          color: 'bg-purple-950/80 text-purple-300 border-purple-500/50'
        };
      default:
        return {
          icon: '📩',
          label: 'General Inquiry',
          color: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-755 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
            <MessageSquare size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                Multi-Leader Routing Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Sync</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Parent Inquiries & Request Dispatch Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time multi-leader inbox for parent absence notices, certified digital signatures, conference requests, and medical form submissions.
            </p>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs font-bold text-emerald-300 animate-fadeIn flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* ── TOP KPI TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 shadow-md ${
            activeTab === 'pending' ? 'bg-amber-950/30 border-amber-500/70 shadow-amber-950/40' : 'bg-slate-850 border-slate-755 hover:border-slate-650'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
            ⏳ Pending Review
          </span>
          <strong className="text-2xl font-black text-amber-300 font-mono block">{kpis.pending}</strong>
          <span className="text-[10px] text-slate-400">Needs Action</span>
        </div>

        <div 
          onClick={() => setActiveTab('absence_notice')}
          className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 shadow-md ${
            activeTab === 'absence_notice' ? 'bg-amber-950/30 border-amber-500/70 shadow-amber-950/40' : 'bg-slate-850 border-slate-755 hover:border-slate-650'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
            🤒 Absences
          </span>
          <strong className="text-2xl font-black text-white font-mono block">{kpis.absences}</strong>
          <span className="text-[10px] text-slate-400">Roll Call Excuses</span>
        </div>

        <div 
          onClick={() => setActiveTab('signed_report')}
          className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 shadow-md ${
            activeTab === 'signed_report' ? 'bg-emerald-950/30 border-emerald-500/70 shadow-emerald-950/40' : 'bg-slate-850 border-slate-755 hover:border-slate-650'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
            ⚜️ Signed Reports
          </span>
          <strong className="text-2xl font-black text-emerald-300 font-mono block">{kpis.signedReports}</strong>
          <span className="text-[10px] text-slate-400">Parent Signatures</span>
        </div>

        <div 
          onClick={() => setActiveTab('meeting_request')}
          className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 shadow-md ${
            activeTab === 'meeting_request' ? 'bg-sky-950/30 border-sky-500/70 shadow-sky-950/40' : 'bg-slate-850 border-slate-755 hover:border-slate-650'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
            🤝 Conferences
          </span>
          <strong className="text-2xl font-black text-sky-300 font-mono block">{kpis.meetingRequests}</strong>
          <span className="text-[10px] text-slate-400">Parent Meetings</span>
        </div>

        <div 
          onClick={() => setActiveTab('form_submission')}
          className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 shadow-md ${
            activeTab === 'form_submission' ? 'bg-purple-950/30 border-purple-500/70 shadow-purple-950/40' : 'bg-slate-850 border-slate-755 hover:border-slate-650'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
            📋 Forms & Waivers
          </span>
          <strong className="text-2xl font-black text-purple-300 font-mono block">{kpis.formSubmissions}</strong>
          <span className="text-[10px] text-slate-400">Health & Activity</span>
        </div>

        <div 
          onClick={() => setActiveTab('resolved')}
          className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 shadow-md ${
            activeTab === 'resolved' ? 'bg-emerald-950/30 border-emerald-500/70 shadow-emerald-950/40' : 'bg-slate-850 border-slate-755 hover:border-slate-650'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            ✓ Resolved
          </span>
          <strong className="text-2xl font-black text-slate-300 font-mono block">{kpis.resolved}</strong>
          <span className="text-[10px] text-slate-400">Processed</span>
        </div>
      </div>

      {/* ── TOOLBAR & TABS ── */}
      <div className="bg-slate-850 border border-slate-755 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'pending', label: `⏳ Pending Action (${kpis.pending})` },
            { id: 'all', label: `All Inquiries (${scopedRequests.length})` },
            { id: 'absence_notice', label: '🤒 Absences' },
            { id: 'signed_report', label: '⚜️ Signed Reports' },
            { id: 'meeting_request', label: '🤝 Conferences' },
            { id: 'form_submission', label: '📋 Forms' },
            { id: 'resolved', label: '✓ Resolved' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                activeTab === t.id
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-755 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Patrol & Search */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <select
            value={patrolFilter}
            onChange={(e) => setPatrolFilter(e.target.value)}
            className="bg-slate-900 border border-slate-755 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Patrols</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <div className="relative w-full md:w-56">
            <Search className="absolute left-3 top-2 text-slate-500" size={13} />
            <input
              type="text"
              placeholder="Search scout, parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-755 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── REQUESTS FEED ── */}
      {filteredRequests.length === 0 ? (
        <div className="bg-slate-850 border border-slate-755 p-12 rounded-3xl text-center space-y-2 text-slate-400">
          <CheckCircle2 size={36} className="mx-auto text-emerald-400 opacity-60" />
          <h4 className="text-sm font-bold text-white">All Caught Up!</h4>
          <p className="text-xs max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'No pending parent requests requiring review at this time.'
              : 'No requests match your current filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredRequests.map(req => {
            const badge = getTypeBadge(req.requestType);
            const isPending = req.status === 'pending_review';
            const isAcknowledged = req.status === 'acknowledged';
            const isResolved = req.status === 'resolved' || req.status === 'approved';

            const waMsg = encodeURIComponent(
              `Salam ${req.parentName}, this is regarding your ${req.requestType.replace('_', ' ')} for ${req.scoutName} in Troop 313. We have received your submission and are following up.`
            );
            const waPhone = (req.parentPhone || '').replace(/[^0-9]/g, '');

            return (
              <div
                key={req.requestId || req.id}
                className={`border rounded-3xl p-5 sm:p-6 transition shadow-lg space-y-4 ${
                  isPending
                    ? 'bg-slate-850 border-amber-500/50 shadow-amber-950/20'
                    : isAcknowledged
                    ? 'bg-slate-850 border-sky-500/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                {/* Top Row: Type Badge, Timestamp, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${badge.color}`}>
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      📅 {new Date(req.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      isPending
                        ? 'bg-amber-950 text-amber-300 border-amber-500 animate-pulse'
                        : isAcknowledged
                        ? 'bg-sky-950 text-sky-300 border-sky-500'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    }`}>
                      {isPending ? '⏳ Pending Review' : isAcknowledged ? '👁️ Acknowledged' : '✓ Resolved'}
                    </span>
                  </div>
                </div>

                {/* Main Content: Scout & Parent Details, Message */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column: Scout & Patrol */}
                  <div className="space-y-1.5 bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Scout & Patrol</span>
                    <strong className="text-sm sm:text-base font-black text-white block">
                      {req.scoutName}
                    </strong>
                    <span className="text-xs text-emerald-400 font-bold block">
                      {req.patrolName}
                    </span>
                  </div>

                  {/* Middle Column: Parent Contact */}
                  <div className="space-y-1.5 bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Parent / Guardian</span>
                    <strong className="text-sm font-bold text-white block">
                      {req.parentName}
                    </strong>
                    <div className="space-y-1 text-xs pt-1">
                      {req.parentPhone && (
                        <a href={`tel:${req.parentPhone}`} className="text-slate-300 hover:text-emerald-400 flex items-center gap-1 font-mono">
                          <Phone size={11} className="text-emerald-400" />
                          <span>{req.parentPhone}</span>
                        </a>
                      )}
                      {req.parentEmail && (
                        <a href={`mailto:${req.parentEmail}`} className="text-slate-300 hover:text-teal-400 flex items-center gap-1 truncate" title={req.parentEmail}>
                          <Mail size={11} className="text-teal-400" />
                          <span className="truncate">{req.parentEmail}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Submission Notes & Message */}
                  <div className="space-y-1.5 bg-slate-900/90 border border-slate-755 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Submission Detail</span>
                    <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      "{req.message || 'No additional note provided.'}"
                    </p>
                  </div>
                </div>

                {/* Audit & Follow-up History Trail */}
                {(req.acknowledgedBy || req.resolvedBy) && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    {req.acknowledgedBy && (
                      <span className="flex items-center gap-1 text-sky-300">
                        <Eye size={12} />
                        <span>Acknowledged by <strong>{req.acknowledgedBy}</strong></span>
                      </span>
                    )}
                    {req.resolvedBy && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check size={12} />
                        <span>Resolved by <strong>{req.resolvedBy}</strong> {req.resolutionNote ? `("${req.resolutionNote}")` : ''}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  {/* Left: Direct Contact Options */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {req.parentPhone && (
                      <a
                        href={`https://wa.me/${waPhone}?text=${waMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>💬 WhatsApp Parent</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {req.parentPhone && (
                      <a
                        href={`tel:${req.parentPhone}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <Phone size={11} />
                        <span>Call</span>
                      </a>
                    )}
                  </div>

                  {/* Right: Leader Status Update Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(req)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded-xl text-xs font-bold transition border border-sky-500/40 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>Mark Acknowledged</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setResolvingRequest(req);
                        setResolutionStatus('resolved');
                        setResolutionNote('');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      <Check size={13} />
                      <span>{isResolved ? 'Update Resolution' : 'Resolve & Reply'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: RESOLVE & REPLY TO PARENT ── */}
      {resolvingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-400 block">
                  Parent Request Resolution & Notification
                </span>
                <h3 className="font-extrabold text-white text-base mt-0.5">
                  Resolve Request for {resolvingRequest.scoutName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResolvingRequest(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitResolution} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Set Status *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolutionStatus('resolved')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      resolutionStatus === 'resolved'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ✓ Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolutionStatus('approved')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      resolutionStatus === 'approved'
                        ? 'bg-teal-600 text-white border-teal-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ✓ Approved
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Leader Reply / Follow-up Note (Sent to Parent)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Received and confirmed! We have excused Hussein from roll call and updated the patrol roster..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingResolution}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{isSubmittingResolution ? 'Saving & Notifying...' : 'Save Resolution & Notify Parent'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResolvingRequest(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
