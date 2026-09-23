import React, { useState } from 'react';
import { 
  Crown, 
  Shield, 
  Phone, 
  AlertTriangle, 
  QrCode, 
  Printer, 
  RotateCw, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  Compass, 
  Users, 
  Heart,
  Share2
} from 'lucide-react';
import RankIcon from './RankIcon';

export default function ScoutDigitalIdCard({ 
  scout = {}, 
  currentUser = {}, 
  patrolName = 'Dhulfiqār Patrol', 
  rankName = 'Scout',
  attendanceRate = 100
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const profile = { ...currentUser, ...scout };
  const fullName = profile.fullName || profile.username || 'Scout Member';
  const bsaId = profile.bsaId || 'BSA-007-PENDING';
  const photoUrl = profile.photoURL || profile.photo || profile.avatar;
  const birthDate = profile.birthDate || profile.dob || '—';
  const schoolGrade = profile.schoolGrade || profile.grade || '7th Grade';
  const bloodType = profile.bloodType || 'Unknown';
  const allergies = profile.allergies || 'No known allergies reported';
  const parent1Name = profile.parent1Name || 'Primary Guardian';
  const parent1Phone = profile.parentPhone || profile.parent1Phone || '—';
  const emergencyPhone = profile.emergencyContactPhone || parent1Phone;
  const emergencyName = profile.emergencyContactName || parent1Name;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>🪪 Official Digital Scout ID Pass</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-bold uppercase">
              Verified
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Digital membership card for troop check-ins, campout identification, and medical verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-slate-850 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <RotateCw size={13} className="text-emerald-400" />
            <span>{isFlipped ? 'Show Front' : 'Flip to Back (Medical & Emergency)'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
          >
            <Printer size={13} />
            <span>Print ID Card</span>
          </button>
        </div>
      </div>

      {/* ── CARD CONTAINER (PERSPECTIVE FLIP) ── */}
      <div className="max-w-md mx-auto w-full">
        {!isFlipped ? (
          /* ── FRONT OF THE CARD ── */
          <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border-2 border-amber-500/60 shadow-2xl shadow-emerald-950/40 overflow-hidden text-white transition-all duration-300">
            {/* Holographic Top Banner */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-sm">
                  ⚜️
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Dhulfiqār Scouts
                  </h4>
                  <span className="text-[9px] text-slate-400 block font-semibold">
                    Troop 007 &bull; Scouting America (BSA)
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Active Scout
              </span>
            </div>

            {/* Main Info Row */}
            <div className="flex items-center gap-4 mb-4">
              {/* Photo */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 border-emerald-400 bg-slate-950 overflow-hidden shrink-0 shadow-lg relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 font-black text-xl">
                    <Compass size={28} />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>

              {/* Scout Details */}
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white truncate leading-tight">
                  {fullName}
                </h3>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>⚜️ {rankName} Rank</span>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-slate-300">{patrolName}</span>
                </p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  BSA ID: <strong className="text-amber-300">{bsaId}</strong>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>Grade: {schoolGrade}</span>
                  <span>&bull;</span>
                  <span>DOB: {birthDate}</span>
                </div>
              </div>
            </div>

            {/* Bottom Strip: QR Code & Verification */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block">Membership Status</span>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>In Good Standing ({attendanceRate}%)</span>
                </span>
              </div>

              {/* QR Code Graphic */}
              <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0 flex items-center justify-center">
                <QrCode size={40} className="text-slate-950" />
              </div>
            </div>
          </div>
        ) : (
          /* ── BACK OF THE CARD (MEDICAL & EMERGENCY) ── */
          <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border-2 border-rose-500/50 shadow-2xl shadow-rose-950/30 text-white transition-all duration-300 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-300">
                  Emergency & Medical Record
                </h4>
              </div>
              <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                CONFIDENTIAL
              </span>
            </div>

            {/* Critical Medical Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Blood Type</span>
                <strong className="text-xs text-amber-300 font-mono">{bloodType}</strong>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Dietary</span>
                <strong className="text-xs text-emerald-300 truncate block">{profile.dietaryRestrictions || 'Halal Standard'}</strong>
              </div>
            </div>

            {/* Allergies Box */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">
                ⚠️ Known Allergies & Medical Notes:
              </span>
              <p className="text-xs text-slate-200 leading-snug">
                {allergies}
              </p>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Primary Guardian</span>
                  <strong className="text-white text-xs">{emergencyName}</strong>
                </div>
                <a
                  href={`tel:${emergencyPhone.replace(/[^0-9+]/g, '')}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  <Phone size={11} />
                  <span>{emergencyPhone}</span>
                </a>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-800">
              In case of emergency during a Scouting activity, call 911 and contact Unit Leadership immediately.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
