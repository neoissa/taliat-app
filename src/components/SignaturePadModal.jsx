import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Layers, 
  Palette 
} from 'lucide-react';

export default function SignaturePadModal({
  isOpen = false,
  onClose,
  onSave,
  title = 'Digital Signature Certification',
  subtitle = 'Draw your official signature to verify and acknowledge this progress report.',
  defaultSignerName = '',
  defaultSignerRole = 'Parent / Guardian',
  signerType = 'parent', // 'parent' | 'leader' | 'scout'
  isSubmitting = false
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0f172a'); // default navy
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [signerRole, setSignerRole] = useState(defaultSignerRole);
  const [isCertified, setIsCertified] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Update default inputs when modal opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setSignerName(defaultSignerName || '');
      setSignerRole(defaultSignerRole || (signerType === 'parent' ? 'Father' : signerType === 'leader' ? 'Scoutmaster / Unit Leader' : 'Scout Candidate'));
      setHasDrawn(false);
      setErrorMsg('');
      setIsCertified(true);

      // Initialize canvas
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [isOpen, defaultSignerName, defaultSignerRole, signerType]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    // Clear background to transparent/white
    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    setHasDrawn(true);
    setErrorMsg('');
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (!signerName.trim()) {
      setErrorMsg('Please enter the full name of the signer.');
      return;
    }
    if (!hasDrawn) {
      setErrorMsg('Please draw your signature in the designated box below.');
      return;
    }
    if (!isCertified) {
      setErrorMsg('Please confirm the verification certification checkbox.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export signature as PNG Base64 data URL
    const signatureDataUrl = canvas.toDataURL('image/png');
    const signedAt = new Date().toISOString();

    if (onSave) {
      onSave({
        signerName: signerName.trim(),
        signerRole,
        signatureDataUrl,
        signedAt
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl space-y-5 text-white relative max-h-[95vh] overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <PenTool size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-lg tracking-tight">{title}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Official Verification
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Signer Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-emerald-400" />
              <span>Full Name of Signer *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Hisham Nehme"
              value={signerName}
              onChange={(e) => {
                setSignerName(e.target.value);
                setErrorMsg('');
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers size={13} className="text-emerald-400" />
              <span>Signer Role / Title *</span>
            </label>
            {signerType === 'parent' ? (
              <select
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Legal Guardian</option>
                <option value="Parent / Family Sponsor">Parent / Family Sponsor</option>
              </select>
            ) : signerType === 'leader' ? (
              <select
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Scoutmaster / Unit Leader">Scoutmaster / Unit Leader</option>
                <option value="Assistant Scoutmaster">Assistant Scoutmaster</option>
                <option value="Committee Chair">Troop Committee Chair</option>
                <option value="Patrol Advisor">Patrol Advisor</option>
              </select>
            ) : (
              <input
                type="text"
                disabled
                value="Scout Candidate"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400"
              />
            )}
          </div>
        </div>

        {/* Drawing Canvas Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <PenTool size={13} className="text-emerald-400" />
              <span>Digital Signature Canvas *</span>
            </span>

            {/* Ink Color & Clear Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <Palette size={11} className="text-slate-400 mr-0.5" />
                <button
                  type="button"
                  title="Navy Ink"
                  onClick={() => setStrokeColor('#0f172a')}
                  className={`w-4 h-4 rounded-full border ${strokeColor === '#0f172a' ? 'border-emerald-400 ring-2 ring-emerald-500/50' : 'border-slate-600'}`}
                  style={{ backgroundColor: '#0f172a' }}
                />
                <button
                  type="button"
                  title="Blue Ink"
                  onClick={() => setStrokeColor('#1e3a8a')}
                  className={`w-4 h-4 rounded-full border ${strokeColor === '#1e3a8a' ? 'border-emerald-400 ring-2 ring-emerald-500/50' : 'border-slate-600'}`}
                  style={{ backgroundColor: '#1e3a8a' }}
                />
                <button
                  type="button"
                  title="Emerald Ink"
                  onClick={() => setStrokeColor('#059669')}
                  className={`w-4 h-4 rounded-full border ${strokeColor === '#059669' ? 'border-emerald-400 ring-2 ring-emerald-500/50' : 'border-slate-600'}`}
                  style={{ backgroundColor: '#059669' }}
                />
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl border-2 border-dashed border-slate-400 overflow-hidden shadow-inner touch-none">
            <canvas
              ref={canvasRef}
              className="w-full h-44 cursor-crosshair block"
              style={{ touchAction: 'none' }}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
            />

            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 select-none space-y-1">
                <PenTool size={24} className="opacity-40" />
                <span className="text-xs font-semibold">Sign with mouse, finger, or stylus</span>
                <span className="text-[10px] text-slate-400 opacity-75">Touch-enabled smooth ink canvas</span>
              </div>
            )}

            {/* Official Watermark / Baseline */}
            <div className="absolute bottom-6 left-6 right-6 border-b border-slate-300/80 pointer-events-none flex justify-between items-center text-[10px] text-slate-400 font-mono select-none">
              <span>✕ Signature Baseline</span>
              <span>Troop 313 Digital Certified</span>
            </div>
          </div>
        </div>

        {/* Legal Certification Checkbox */}
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 leading-relaxed select-none">
            <input
              type="checkbox"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 h-4 w-4 shrink-0"
            />
            <span>
              I certify that I am <strong className="text-white">{signerName || 'the designated signer'}</strong> ({signerRole}) and I confirm that I have reviewed this official Troop 313 Progress Report and hereby attach my legally valid digital signature.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            <span>{isSubmitting ? 'Verifying & Saving Signature...' : 'Apply Official Digital Signature'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs px-5 py-3.5 rounded-2xl border border-slate-700 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
