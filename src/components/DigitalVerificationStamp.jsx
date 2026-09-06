import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, PenTool } from 'lucide-react';

export default function DigitalVerificationStamp({
  title = 'Official Signature',
  signatureData = null,
  canSign = false,
  onSignClick,
  pendingLabel = 'Awaiting Digital Signature in Portal',
  signerRole = null
}) {
  const isSigned = signatureData?.signed && signatureData?.signatureDataUrl;

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-1.5 flex flex-col justify-between h-full page-break-avoid">
      {/* Signature Preview or Line */}
      <div className="min-h-[58px] flex flex-col justify-end border-b border-slate-900 pb-1 relative">
        {isSigned ? (
          <div className="relative group">
            <img
              src={signatureData.signatureDataUrl}
              alt={`${title} Signature`}
              className="h-11 sm:h-13 max-w-full object-contain mx-auto print:h-10 transition-transform"
            />
            {/* Stamp Ribbon */}
            <div className="absolute top-0 right-0 hidden sm:flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider print:flex">
              <ShieldCheck size={10} className="text-emerald-700 shrink-0" />
              <span>Verified</span>
            </div>
          </div>
        ) : canSign ? (
          <div className="py-2 flex justify-center print-hide">
            <button
              type="button"
              onClick={onSignClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
            >
              <PenTool size={13} />
              <span>Sign Digitally Now</span>
            </button>
          </div>
        ) : (
          <div className="h-9 flex items-center justify-center text-[11px] text-slate-400 italic">
            <span className="print:hidden">{pendingLabel}</span>
          </div>
        )}
      </div>

      {/* Label and Signer Metadata */}
      <div>
        <p className="font-extrabold text-slate-950 text-xs flex items-center justify-between">
          <span>{title}</span>
          {isSigned && (
            <span className="text-[10px] text-emerald-800 font-bold hidden print:inline">
              ✓ Verified
            </span>
          )}
        </p>

        {isSigned ? (
          <div className="text-[10px] text-slate-700 leading-tight space-y-0.5 mt-0.5 font-sans">
            <p className="font-bold text-slate-900">
              {signatureData.signerName} {signatureData.signerRole ? `(${signatureData.signerRole})` : ''}
            </p>
            <p className="text-slate-500 font-mono text-[9px] flex items-center gap-1">
              <Clock size={9} className="text-emerald-600 shrink-0" />
              <span>{formatDate(signatureData.signedAt)}</span>
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-slate-600 print:block">
            Date: ________________________
          </p>
        )}
      </div>
    </div>
  );
}
