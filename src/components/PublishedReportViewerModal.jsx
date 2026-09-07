import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Clock, 
  Heart, 
  BookOpen, 
  PenTool, 
  Lock, 
  Sparkles,
  FileText,
  User,
  Shield,
  Star
} from 'lucide-react';
import RankIcon from './RankIcon';
import DigitalVerificationStamp from './DigitalVerificationStamp';
import SignaturePadModal from './SignaturePadModal';
import { signPublishedReportByParent, signPublishedReportByScout } from '../services/publishedReportsService';

export default function PublishedReportViewerModal({
  report = null,
  isOpen = false,
  onClose,
  currentUser = {},
  onReportUpdated
}) {
  const [showSignModal, setShowSignModal] = useState(false);
  const [signingType, setSigningType] = useState('parent'); // 'parent' | 'scout'
  const [isSubmittingSignature, setIsSubmittingSignature] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  if (!isOpen || !report) return null;

  const isParent = currentUser?.role === 'parent' || currentUser?.parentEmail || currentUser?.role === 'guardian';
  const isScout = currentUser?.role === 'scout';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'scoutmaster' || currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';

  const linkedIds = currentUser?.linkedScoutIds || [];
  const parentEmails = [currentUser?.email, currentUser?.parent1Email, currentUser?.parent2Email].filter(Boolean).map(e => e.toLowerCase().trim());
  
  // Guard: if viewer is a parent (and not a troop leader/admin), report must be for their linked child or parent email/UID
  const isAuthorizedViewer = !isParent || isLeader || (
    (report.scoutId && linkedIds.includes(report.scoutId)) ||
    (report.parentUid && report.parentUid === currentUser?.uid) ||
    (report.parentEmail && parentEmails.includes(report.parentEmail.toLowerCase().trim())) ||
    linkedIds.length === 0 // fallback if parent has no linked IDs loaded yet
  );

  if (isParent && !isLeader && !isAuthorizedViewer) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <h3 className="text-base font-bold text-white">Access Restricted</h3>
          <p className="text-xs text-slate-400">
            This progress report belongs to another scout and cannot be viewed from this family portal account.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const snapshot = report.reportSnapshot || {};
  const commentary = snapshot.leaderCommentary || {};
  const signatures = report.signatures || {};

  const canParentSign = (isParent || isLeader) && isAuthorizedViewer && !signatures.parent?.signed;
  const canScoutSign = (isScout || isLeader) && !signatures.scout?.signed;

  const handlePrint = () => {
    const originalTitle = document.title;
    const sanitizedName = (report.scoutName || 'Scout').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = (report.publishedAt || new Date().toISOString()).split('T')[0];
    
    document.title = `${sanitizedName}_Published_Report_${dateStr}`;
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

  const handleOpenSignModal = (type) => {
    setSigningType(type);
    setShowSignModal(true);
  };

  const handleSaveSignature = async ({ signerName, signerRole, signatureDataUrl, signedAt }) => {
    setIsSubmittingSignature(true);
    try {
      if (signingType === 'parent') {
        await signPublishedReportByParent({
          reportId: report.reportId || report.id,
          signerName,
          signerRole,
          signatureDataUrl,
          signerUid: currentUser?.uid || null
        });
        setSuccessToast('Parent digital signature successfully recorded and verified!');
      } else {
        await signPublishedReportByScout({
          reportId: report.reportId || report.id,
          signerName,
          signatureDataUrl
        });
        setSuccessToast('Scout candidate digital signature recorded!');
      }

      setShowSignModal(false);
      if (onReportUpdated) onReportUpdated();
    } catch (err) {
      console.error('Failed to save signature:', err);
      alert('Failed to save signature: ' + err.message);
    } finally {
      setIsSubmittingSignature(false);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const formattedPublishDate = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* ── HEADER CONTROLS (SCREEN ONLY) ── */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0 print-hide">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">Published Progress Report Snapshot</h3>
                {signatures.parent?.signed ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck size={11} /> Fully Signed & Verified
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Clock size={11} /> Awaiting Parent Signature
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Official certified record for <strong className="text-white">{report.scoutName}</strong> published on {formattedPublishDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canParentSign && (
              <button
                type="button"
                onClick={() => handleOpenSignModal('parent')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
              >
                <PenTool size={14} />
                <span>Sign as Parent</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-900/90 border-b border-emerald-500 text-emerald-100 text-xs px-6 py-2.5 flex items-center gap-2 font-bold animate-fadeIn shrink-0">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* ── REPORT CONTENT (PRINTABLE SHEET) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/40">
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 max-w-4xl mx-auto space-y-6 text-xs font-sans print:p-0 print:border-none print:shadow-none">
            
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                    Dhulfiqār Scouts BSA
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">Troop 313</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 mt-1">
                  Official Scout Progress Report
                </h1>
                <p className="text-xs text-slate-600 font-serif italic">
                  Advancement Audit, Attendance & Leader Parent Conference
                </p>
              </div>

              <div className="text-left sm:text-right space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 w-full sm:w-auto">
                <p className="text-xs font-bold text-slate-900">
                  Published: <span className="font-mono">{formattedPublishDate}</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  Period: <strong>{report.reportingPeriod || 'All-Time Cumulative'}</strong>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Report ID: {report.reportId || report.id}
                </p>
              </div>
            </div>

            {/* Scout Demographics Banner */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Scout Name</span>
                <strong className="text-sm font-black text-slate-950">{report.scoutName}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Rank</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <RankIcon rank={snapshot.rank || 'scout'} size={16} />
                  <strong className="text-xs font-bold text-slate-900 uppercase">
                    {snapshot.rank || 'Scout'}
                  </strong>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Patrol Unit</span>
                <strong className="text-xs font-bold text-slate-900">{report.patrolName || 'Taliʿa Patrol'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Certifying Leader</span>
                <strong className="text-xs font-bold text-slate-900">{report.leaderName || 'Unit Leader'}</strong>
              </div>
            </div>

            {/* Core KPI Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Rank Advancement</span>
                <strong className="text-lg font-black text-emerald-700 font-mono">
                  {snapshot.rankProgress || 0}%
                </strong>
                <span className="text-[9px] text-slate-500 block">Complete</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Troop Attendance</span>
                <strong className="text-lg font-black text-sky-700 font-mono">
                  {snapshot.attendanceRate || 100}%
                </strong>
                <span className="text-[9px] text-slate-500 block">Active Participation</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Community Service</span>
                <strong className="text-lg font-black text-amber-700 font-mono">
                  {snapshot.serviceHours || 0} hrs
                </strong>
                <span className="text-[9px] text-slate-500 block">Logged Service</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Merit Badges</span>
                <strong className="text-lg font-black text-purple-700 font-mono">
                  {(snapshot.meritBadges || []).length} Badges
                </strong>
                <span className="text-[9px] text-slate-500 block">Earned & In-Progress</span>
              </div>
            </div>

            {/* Merit Badges Snapshot */}
            {snapshot.meritBadges && snapshot.meritBadges.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-950 flex items-center gap-1.5 border-b border-slate-300 pb-1">
                  <Award size={14} className="text-emerald-600" />
                  <span>Merit Badges Portfolio ({snapshot.meritBadges.length})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {snapshot.meritBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold ${
                        badge.status === 'completed' || badge.completed
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {badge.name || badge.badgeName || badge.id} {badge.status === 'completed' ? '✓' : `(${badge.percentage || 0}%)`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Leader Commentary Section */}
            <div className="border-t-2 border-slate-800 pt-4 space-y-3 page-break-avoid">
              <h3 className="text-xs font-black uppercase text-slate-950 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-700" />
                <span>Leader Commentary & Parent Action Plan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-1">
                  <strong className="text-emerald-900 block font-bold uppercase text-[10px]">1. Strengths & Achievements</strong>
                  <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap text-[11px]">
                    {commentary.strengths || 'Scout displays strong scout spirit and dedication to patrol activities.'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-1">
                  <strong className="text-amber-900 block font-bold uppercase text-[10px]">2. Areas of Focus</strong>
                  <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap text-[11px]">
                    {commentary.focusAreas || 'Focus on completing pending rank requirements and merit badge prerequisites.'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-1">
                  <strong className="text-sky-900 block font-bold uppercase text-[10px]">3. Parent Action Items</strong>
                  <p className="text-slate-800 leading-relaxed font-serif whitespace-pre-wrap text-[11px]">
                    {commentary.parentActionItems || 'Assist scout with home practice and support attendance at upcoming weekend campout.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── OFFICIAL DIGITAL SIGNATURES & VERIFICATION BLOCK ── */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs page-break-avoid">
              
              {/* 1. Unit Leader Signature */}
              <DigitalVerificationStamp
                title="Unit Leader / Scoutmaster"
                signatureData={signatures.leader}
                pendingLabel="Pending Leader Signature"
                signerRole="Unit Leader"
              />

              {/* 2. Parent / Guardian Signature */}
              <DigitalVerificationStamp
                title="Parent / Guardian Signature"
                signatureData={signatures.parent}
                canSign={canParentSign}
                onSignClick={() => handleOpenSignModal('parent')}
                pendingLabel="Awaiting Parent Signature in Portal"
              />

              {/* 3. Scout Candidate Signature */}
              <DigitalVerificationStamp
                title="Scout Candidate Signature"
                signatureData={signatures.scout}
                canSign={canScoutSign}
                onSignClick={() => handleOpenSignModal('scout')}
                pendingLabel="Awaiting Scout Signature"
              />
            </div>

            {/* Verification Footer Note */}
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>Dhulfiqār Troop 313 &bull; Digital Advancement Verification System</span>
              <span>Document Hash: {report.reportId ? btoa(report.reportId).slice(0, 16) : 'VERIFIED'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Pad Modal */}
      {showSignModal && (
        <SignaturePadModal
          isOpen={showSignModal}
          onClose={() => setShowSignModal(false)}
          onSave={handleSaveSignature}
          isSubmitting={isSubmittingSignature}
          signerType={signingType}
          defaultSignerName={
            signingType === 'parent' 
              ? (currentUser?.parent1Name || currentUser?.fullName || '')
              : (report.scoutName || '')
          }
          defaultSignerRole={signingType === 'parent' ? (currentUser?.parent1Relation || 'Father') : 'Scout Candidate'}
          title={signingType === 'parent' ? 'Parent Digital Signature & Verification' : 'Scout Candidate Digital Signature'}
          subtitle={`Certify and sign the official progress report for ${report.scoutName}`}
        />
      )}
    </div>
  );
}
