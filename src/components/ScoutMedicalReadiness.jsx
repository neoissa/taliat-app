import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  HeartPulse, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Download, 
  Edit3, 
  Save, 
  Clock, 
  User, 
  Phone, 
  ExternalLink,
  Waves,
  Syringe,
  FileText
} from 'lucide-react';

export default function ScoutMedicalReadiness({ 
  scout = {}, 
  currentUser = {}, 
  canEdit = false, 
  onSaveSuccess 
}) {
  const profile = { ...currentUser, ...scout };
  const targetUid = profile.uid || currentUser?.uid;

  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin';
  const isParent = currentUser?.role === 'parent';
  const isSelf = currentUser?.uid === targetUid;
  const userCanEdit = canEdit || isOwner || isLeader || isParent || isSelf;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Form States
  const [medPartAValidDate, setMedPartAValidDate] = useState(profile.medPartAValidDate || profile.medicalValidDate || '');
  const [medPartCValidDate, setMedPartCValidDate] = useState(profile.medPartCValidDate || '');
  const [medPartCPhysicianName, setMedPartCPhysicianName] = useState(profile.medPartCPhysicianName || '');
  const [tetanusDate, setTetanusDate] = useState(profile.tetanusDate || '');
  const [swimLevel, setSwimLevel] = useState(profile.swimLevel || 'Swimmer');
  const [swimTestDate, setSwimTestDate] = useState(profile.swimTestDate || '');
  const [bloodType, setBloodType] = useState(profile.bloodType || 'O+');
  const [allergies, setAllergies] = useState(profile.allergies || '');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(profile.dietaryRestrictions || 'Halal Standard');
  const [medicalNotes, setMedicalNotes] = useState(profile.medicalNotes || '');
  const [insuranceCompany, setInsuranceCompany] = useState(profile.insuranceCompany || '');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState(profile.insurancePolicyNumber || '');
  const [primaryDoctorName, setPrimaryDoctorName] = useState(profile.primaryDoctorName || '');
  const [primaryDoctorPhone, setPrimaryDoctorPhone] = useState(profile.primaryDoctorPhone || '');

  // Calculate Medical Form A/B Validity
  const getMedValidityStatus = (dateStr) => {
    if (!dateStr) return { label: '⚠️ Needs Submission', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', isExpired: true };
    const today = new Date();
    const exp = new Date(dateStr + 'T12:00:00');
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: '🚨 Expired', color: 'bg-rose-500/20 text-rose-300 border-rose-500/50', isExpired: true };
    }
    if (diffDays <= 30) {
      return { label: `⚠️ Expires in ${diffDays}d`, color: 'bg-amber-500/20 text-amber-300 border-amber-500/50', isExpiringSoon: true };
    }
    return { label: `✓ Valid (${diffDays}d left)`, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', isValid: true };
  };

  const statusPartAB = getMedValidityStatus(medPartAValidDate);
  const statusPartC = getMedValidityStatus(medPartCValidDate);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!targetUid) return;

    setSaving(true);
    setSaveMsg('');
    try {
      const userRef = doc(db, 'users', targetUid);
      const updates = {
        medPartAValidDate: medPartAValidDate || null,
        medicalValidDate: medPartAValidDate || null,
        medPartCValidDate: medPartCValidDate || null,
        medPartCPhysicianName: medPartCPhysicianName.trim() || null,
        tetanusDate: tetanusDate || null,
        swimLevel: swimLevel || 'Swimmer',
        swimTestDate: swimTestDate || null,
        bloodType: bloodType || 'O+',
        allergies: allergies.trim() || null,
        dietaryRestrictions: dietaryRestrictions.trim() || null,
        medicalNotes: medicalNotes.trim() || null,
        insuranceCompany: insuranceCompany.trim() || null,
        insurancePolicyNumber: insurancePolicyNumber.trim() || null,
        primaryDoctorName: primaryDoctorName.trim() || null,
        primaryDoctorPhone: primaryDoctorPhone.trim() || null,
        updatedMedicalAt: new Date().toISOString()
      };

      await setDoc(userRef, updates, { merge: true });
      setSaveMsg('✓ Medical record saved successfully!');
      setIsEditing(false);
      if (onSaveSuccess) onSaveSuccess(updates);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      console.error("Failed to save medical records:", err);
      alert("Failed to save medical record: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── HEADER WITH ACTIONS ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0 shadow-lg shadow-rose-950/40">
            <HeartPulse size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                BSA Safety & Health Record
              </span>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${statusPartAB.color}`}>
                Part A/B: {statusPartAB.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Health, Medical & High Adventure Readiness
            </h3>
            <p className="text-xs text-slate-400">
              BSA Annual Health & Medical Record (Parts A, B, C) validity, swim certification, and emergency care.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <a
            href="https://filestore.scouting.org/filestore/HealthSafety/pdf/680-001_ABC.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Download size={13} />
            <span>Download Official BSA Form (PDF)</span>
          </a>

          {userCanEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Edit3 size={13} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Medical Info'}</span>
            </button>
          )}
        </div>
      </div>

      {saveMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* ── MAIN CONTENT (DISPLAY OR EDIT FORM) ── */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. BSA Part A & B Clearance */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">BSA Part A & B Record</h4>
              </div>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${statusPartAB.color}`}>
                {statusPartAB.label}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Valid Through:</span>
                <strong className="text-white font-mono">{medPartAValidDate || 'Not specified'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Applies To:</span>
                <span className="text-slate-300">Standard weekend campouts & meetings</span>
              </div>
            </div>
          </div>

          {/* 2. BSA Part C (Physical Exam) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Part C Physician Exam</h4>
              </div>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${statusPartC.color}`}>
                {statusPartC.label}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Exam Valid Through:</span>
                <strong className="text-white font-mono">{medPartCValidDate || 'Pending high adventure'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Examining Physician:</span>
                <span className="text-slate-300 truncate">{medPartCPhysicianName || '—'}</span>
              </div>
            </div>
          </div>

          {/* 3. Swim Classification & Tetanus */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Waves size={16} className="text-teal-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Swim Check & Tetanus</h4>
              </div>
              <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full">
                {swimLevel}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Swim Check Date:</span>
                <strong className="text-white font-mono">{swimTestDate || 'Annual check'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tetanus Immunization:</span>
                <strong className="text-white font-mono">{tetanusDate || 'Up to date'}</strong>
              </div>
            </div>
          </div>

          {/* 4. Blood Type, Allergies & Dietary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <AlertTriangle size={16} className="text-rose-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Allergies, Dietary & Blood Type</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Blood Type</span>
                <strong className="text-amber-300 font-mono text-sm">{bloodType}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 sm:col-span-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Dietary Standard</span>
                <strong className="text-emerald-300 text-xs">{dietaryRestrictions}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 sm:col-span-3">
                <span className="text-[10px] text-rose-400 font-bold uppercase block mb-0.5">Known Allergies / Medical Notes</span>
                <p className="text-xs text-slate-200">{allergies || 'No severe allergies reported.'}</p>
              </div>
            </div>
          </div>

          {/* 5. Doctor & Insurance */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Phone size={16} className="text-indigo-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Doctor & Insurance</h4>
            </div>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Care Doctor</span>
                <strong className="text-white">{primaryDoctorName || 'Pediatrician on file'}</strong>
                {primaryDoctorPhone && <span className="text-slate-400 block font-mono">{primaryDoctorPhone}</span>}
              </div>
              <div className="pt-1 border-t border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Insurance Provider</span>
                <strong className="text-slate-300">{insuranceCompany || 'Policy on file'}</strong>
                {insurancePolicyNumber && <span className="text-slate-400 block font-mono text-[11px]">ID: {insurancePolicyNumber}</span>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── EDIT FORM ── */
        <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl text-xs">
          <h4 className="text-sm font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Edit3 size={15} className="text-emerald-400" />
            <span>Update Scout Health & Medical Clearance</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Part A/B Valid Date */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">BSA Part A & B Valid Through:</label>
              <input
                type="date"
                value={medPartAValidDate}
                onChange={(e) => setMedPartAValidDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Part C Valid Date */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Part C (Physical Exam) Valid Through:</label>
              <input
                type="date"
                value={medPartCValidDate}
                onChange={(e) => setMedPartCValidDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Part C Physician Name */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Examining Physician Name:</label>
              <input
                type="text"
                value={medPartCPhysicianName}
                onChange={(e) => setMedPartCPhysicianName(e.target.value)}
                placeholder="Dr. Full Name, MD"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Swim Classification */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Swim Classification Level:</label>
              <select
                value={swimLevel}
                onChange={(e) => setSwimLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Swimmer">Swimmer (Blue Tag - Deep water)</option>
                <option value="Beginner">Beginner (Red Tag - Standing depth)</option>
                <option value="Non-Swimmer">Non-Swimmer (White Tag - Shallow)</option>
              </select>
            </div>

            {/* Swim Test Date */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Swim Check Date:</label>
              <input
                type="date"
                value={swimTestDate}
                onChange={(e) => setSwimTestDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tetanus Vaccine Date */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Last Tetanus Vaccine Date:</label>
              <input
                type="date"
                value={tetanusDate}
                onChange={(e) => setTetanusDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Blood Type */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Blood Type:</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Dietary Restrictions & Preferences:</label>
              <input
                type="text"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                placeholder="e.g. Halal Standard, Nut-Free, Gluten-Free"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Allergies & Medical Notes */}
            <div className="sm:col-span-3">
              <label className="font-bold text-slate-300 block mb-1">Known Allergies & Medical Conditions:</label>
              <textarea
                rows={2}
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="List any food, insect, seasonal, or medication allergies (e.g. Peanut allergy - carries EpiPen)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Primary Doctor Name & Phone */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Primary Care Physician:</label>
              <input
                type="text"
                value={primaryDoctorName}
                onChange={(e) => setPrimaryDoctorName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Doctor Phone:</label>
              <input
                type="tel"
                value={primaryDoctorPhone}
                onChange={(e) => setPrimaryDoctorPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Insurance Provider & Policy */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Insurance Provider & Policy #:</label>
              <input
                type="text"
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
                placeholder="BlueCross #ABC123456"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Medical Record'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
