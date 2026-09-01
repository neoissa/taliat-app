import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { User, Mail, Phone, Lock, Shield, Image as ImageIcon, Check, Trash2, ExternalLink, Camera, Loader2 } from 'lucide-react';
import AssignmentsManager from './AssignmentsManager';
import RoadToEagleTracker from './RoadToEagleTracker';

// Helper function to compress images locally in the browser to small, high-quality Base64 strings (~30KB-80KB)
function compressImage(file, maxWidth = 600, maxHeight = 600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function ScoutProfile({ currentUser }) {
  // Profile information states
  const [fullName, setFullName] = useState('');
  const [scoutEmail, setScoutEmail] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [scoutPhone, setScoutPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [bsaId, setBsaId] = useState('');
  const [patrolName, setPatrolName] = useState('Taliʿa');
  const [rankName, setRankName] = useState('Scout');
  const [spt, setSpt] = useState('');
  const [sptFileUrl, setSptFileUrl] = useState('');
  const [sptFileName, setSptFileName] = useState('');
  const [uploadingSpt, setUploadingSpt] = useState(false);
  const [leaderData, setLeaderData] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('personal'); // 'personal' | 'eagle' | 'homework' | 'spt' | 'security'
  
  // Loading & Saving states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setLoading(false);
      return;
    }
    const loadProfile = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || '');
          setScoutEmail(data.scoutEmail || data.email || '');
          setParentEmail(data.parentEmail || '');
          setScoutPhone(data.scoutPhone || '');
          setParentPhone(data.parentPhone || '');
          setPhotoUrl(data.photoURL || '');
          setPhotoPreview(data.photoURL || '');
          setBsaId(data.bsaId || '—');
          setRankName(data.rank || 'Scout');
          setSpt(data.spt || '');
          setSptFileUrl(data.sptFileUrl || '');
          setSptFileName(data.sptFileName || '');
          
          if (data.leaderId) {
            const leaderSnap = await getDoc(doc(db, 'users', data.leaderId));
            if (leaderSnap.exists()) {
              setLeaderData(leaderSnap.data());
            }
          }
          
          if (data.groupId) {
            const groupSnap = await getDoc(doc(db, 'groups', data.groupId));
            if (groupSnap.exists()) {
              setPatrolName(groupSnap.data().name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [currentUser?.uid]);

  // ── 1. ROBUST PROFILE PHOTO UPLOAD WITH COMPRESSION & INSTANT AUTO-SAVE ──
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      // Step 1: Compress image client-side to 400x400 (~35KB JPEG)
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      setPhotoPreview(compressedDataUrl);
      setPhotoUrl(compressedDataUrl);

      let finalPhotoUrl = compressedDataUrl;

      // Step 2: Try Firebase Storage if available
      try {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalPhotoUrl = await getDownloadURL(snapshot.ref);
        setPhotoUrl(finalPhotoUrl);
      } catch (storageErr) {
        console.warn("Storage upload fallback to compressed Base64:", storageErr);
      }

      // Step 3: Automatically persist directly to Firestore immediately
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { photoURL: finalPhotoUrl }, { merge: true });

      setProfileSuccess("✓ Profile photo updated and saved successfully!");
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      console.error("Photo upload error:", err);
      setProfileError("Failed to update profile picture: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm("Remove your profile picture?")) return;
    setPhotoPreview('');
    setPhotoUrl('');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { photoURL: null }, { merge: true });
      setProfileSuccess("✓ Profile photo removed.");
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError("Failed to remove photo: " + err.message);
    }
  };

  // ── 2. ROBUST SPT CERTIFICATE UPLOAD & INSTANT AUTO-SAVE ──
  const handleSptFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingSpt(true);
    setProfileError('');
    setProfileSuccess('');

    const fileName = file.name;
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');

    try {
      let finalUrl = '';

      if (isImage) {
        // High quality compressed image for certificate readability (~90KB)
        finalUrl = await compressImage(file, 1400, 1400, 0.75);
      } else if (isPdf) {
        if (file.size > 1.5 * 1024 * 1024) {
          setProfileError("PDF is too large (> 1.5MB). Please upload a smaller PDF or a photo/screenshot of the certificate.");
          setUploadingSpt(false);
          return;
        }
        // Read PDF as Data URL
        finalUrl = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
      } else {
        setProfileError("Please upload an image (.jpg, .png) or .pdf certificate file.");
        setUploadingSpt(false);
        return;
      }

      // Try Storage if available
      try {
        const storageRef = ref(storage, `leader_spt/${currentUser.uid}/${Date.now()}_${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalUrl = await getDownloadURL(snapshot.ref);
      } catch (storageErr) {
        console.warn("Storage upload fallback to compressed Base64:", storageErr);
      }

      setSptFileUrl(finalUrl);
      setSptFileName(fileName);

      // Auto-save to Firestore immediately
      const defaultDate = spt || new Date().toISOString().split('T')[0];
      setSpt(defaultDate);

      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        spt: defaultDate,
        sptFileUrl: finalUrl,
        sptFileName: fileName
      }, { merge: true });

      setProfileSuccess("✓ SPT Certificate uploaded and saved successfully!");
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      console.error("SPT Upload error:", err);
      setProfileError("Failed to upload certificate: " + err.message);
    } finally {
      setUploadingSpt(false);
    }
  };

  const handleRemoveSptFile = async () => {
    if (!window.confirm("Remove your current SPT certificate file?")) return;
    setSptFileUrl('');
    setSptFileName('');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        sptFileUrl: null,
        sptFileName: null
      }, { merge: true });
      setProfileSuccess("✓ Certificate removed.");
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError("Failed to remove certificate: " + err.message);
    }
  };

  // ── 3. SAVE PROFILE INFORMATION FORM ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const isScout = currentUser.role === 'scout';
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = {
        fullName: fullName.trim(),
        scoutEmail: scoutEmail.trim(),
        scoutPhone: scoutPhone.trim(),
        photoURL: photoUrl || null,
        spt: spt.trim() || null,
        sptFileUrl: sptFileUrl || null,
        sptFileName: sptFileName || null
      };

      if (isScout) {
        updates.parentEmail = parentEmail.trim();
        updates.parentPhone = parentPhone.trim();
      }

      await setDoc(userRef, updates, { merge: true });
      setProfileSuccess("✓ Profile updated and saved successfully!");
      setTimeout(() => setProfileSuccess(''), 3500);
    } catch (err) {
      console.error("Profile save error:", err);
      setProfileError("Failed to update profile: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      // Re-authenticate
      await reauthenticateWithCredential(user, credential);
      
      // Update Auth
      await updatePassword(user, newPassword);
      
      // Update secrets document
      const secretsRef = doc(db, 'users', currentUser.uid, 'private', 'secrets');
      await setDoc(secretsRef, { password: newPassword }, { merge: true });

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setPasswordError("Failed to update password. Check your current password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading profile settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ── PROFILE OVERVIEW CARD & AVATAR UPLOADER ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-3 border-emerald-500 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-slate-650 flex items-center justify-center font-bold text-slate-350 text-3xl uppercase shadow-xl">
                {fullName.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </div>
            )}

            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                <Loader2 size={18} className="animate-spin text-emerald-400" />
                <span>Saving...</span>
              </div>
            )}
          </div>

          {/* Avatar Action Controls */}
          <div className="flex items-center gap-2 mt-1">
            <label className="bg-slate-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-sm">
              <Camera size={13} />
              <span>{uploadingPhoto ? 'Saving...' : (photoPreview ? 'Change Photo' : 'Upload Photo')}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>

            {photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-[11px] text-red-400 hover:text-red-300 p-1.5 hover:bg-slate-700/50 rounded-lg cursor-pointer"
                title="Remove photo"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="text-center md:text-left space-y-1.5 flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentUser.role === 'owner' ? 'Troop Owner / Admin' : currentUser.role === 'leader' ? (currentUser?.leaderPosition || 'Troop Leader') : 'Scout'}
            </span>
            {patrolName && (
              <span className="bg-slate-700 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {patrolName} Patrol
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{fullName || '@' + currentUser.username}</h2>
          <p className="text-xs text-slate-400">
            Username: <span className="text-slate-300 font-mono">@{currentUser.username}</span> &bull; 
            Email: <span className="text-emerald-400 font-medium">{currentUser.email}</span>
          </p>
          {currentUser.role === 'scout' && (
            <p className="text-xs text-slate-400">
              Active Rank: <span className="text-white font-semibold">{rankName}</span> &bull; BSA ID: <span className="text-slate-300 font-mono">{bsaId}</span>
            </p>
          )}
        </div>
      </div>

      
      {/* ── PROFILE SUB-NAVIGATION TABS ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-750 pb-3">
        <button
          type="button"
          onClick={() => setActiveProfileTab('personal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'personal'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <User size={15} />
          <span>👤 Personal Info</span>
        </button>

        {currentUser.role === 'scout' && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('eagle')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeProfileTab === 'eagle'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <span className="text-base">🦅</span>
            <span>Road to Eagle & Palms</span>
          </button>
        )}

        {currentUser.role === 'scout' && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('homework')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeProfileTab === 'homework'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <span className="text-base">🎒</span>
            <span>My Homework & Quests</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveProfileTab('spt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'spt'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <Shield size={15} />
          <span>SPT Certificate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveProfileTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'security'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
          }`}
        >
          <Lock size={15} />
          <span>Security & Password</span>
        </button>
      </div>

      
      {/* ── TAB 1: ROAD TO EAGLE & PALMS ── */}
      {activeProfileTab === 'eagle' && currentUser.role === 'scout' && (
        <RoadToEagleTracker currentUser={currentUser} scoutId={currentUser.uid} />
      )}

      {/* ── TAB 2: SCOUT HOMEWORK & ASSIGNED TASKS ── */}
      {activeProfileTab === 'homework' && currentUser.role === 'scout' && (
        <AssignmentsManager currentUser={currentUser} scoutId={currentUser.uid} isEmbeddedInProfile={false} />
      )}

      {/* ── TAB 3: PERSONAL INFORMATION ── */}
      {activeProfileTab === 'personal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
              <User size={16} className="text-emerald-400" /> Personal Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">BSA Member ID</label>
                  <input
                    type="text"
                    disabled={currentUser.role === 'scout'}
                    value={bsaId}
                    onChange={(e) => setBsaId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Mail size={12} /> {currentUser.role === 'scout' ? 'Scout Email' : 'Personal Email'}
                  </label>
                  <input
                    type="email"
                    value={scoutEmail}
                    onChange={(e) => setScoutEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                    <Phone size={12} /> {currentUser.role === 'scout' ? 'Scout Phone' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={scoutPhone}
                    onChange={(e) => setScoutPhone(e.target.value)}
                    placeholder="e.g. +1234567890"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {currentUser.role === 'scout' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Mail size={12} /> Parent Email
                      </label>
                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Phone size={12} /> Parent Phone
                      </label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="e.g. +1234567890"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-700/60 pt-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  {updating ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
              <Shield size={16} className="text-emerald-400" /> Troop Affiliation
            </h3>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Patrol</span>
                <strong className="text-white text-sm">{patrolName} Patrol</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Rank</span>
                <strong className="text-emerald-400 text-sm">{rankName}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SPT CERTIFICATE ── */}
      {activeProfileTab === 'spt' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 max-w-2xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
            <Shield size={16} className="text-emerald-400" /> Safety/Protection Training (SPT)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                SPT Training Completion Date
              </label>
              <input
                type="date"
                value={spt}
                onChange={(e) => setSpt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Upload Certificate (PDF / Image)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleSptFileChange}
                  disabled={uploadingSpt}
                  className="hidden"
                  id="spt-file-upload"
                />
                <label
                  htmlFor="spt-file-upload"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <ImageIcon size={14} /> 
                  <span>{uploadingSpt ? 'Saving...' : (sptFileUrl ? 'Replace Certificate' : 'Upload Certificate')}</span>
                </label>

                {sptFileUrl && (
                  <>
                    <a
                      href={sptFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 border border-slate-750 hover:border-emerald-500 text-emerald-400 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      <span>View Cert</span>
                      <ExternalLink size={11} />
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveSptFile}
                      className="text-xs text-red-400 hover:text-red-300 bg-slate-900 border border-slate-750 px-2.5 py-2 rounded-xl cursor-pointer"
                      title="Remove Certificate"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {spt && (
              <div className="pt-2 border-t border-slate-700/60">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase mb-2">Share Completion Status</span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Salam! Sharing that I have completed my Safety/Protection Training (SPT) on ${spt}.${sptFileUrl ? ` View my certificate: ${sptFileUrl}` : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 transition cursor-pointer text-xs font-bold shadow-md"
                    title="Share on WhatsApp"
                  >
                    <span>Share on WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Safety/Protection Training (SPT) Completion")}&body=${encodeURIComponent(`Salam,\n\nI have completed my Safety/Protection Training (SPT) on ${spt}.${sptFileUrl ? ` View my certificate here: ${sptFileUrl}` : ''}\n\nShukran.`)}`}
                    className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 transition cursor-pointer text-xs font-bold"
                    title="Share via Email"
                  >
                    <Mail size={14} />
                    <span>Share via Email</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: SECURITY & PASSWORD ── */}
      {activeProfileTab === 'security' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 max-w-md">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
            <Lock size={16} className="text-emerald-400" /> Security Settings
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {passwordSuccess && <p className="text-xs text-emerald-400 font-semibold">{passwordSuccess}</p>}
            {passwordError && <p className="text-xs text-red-400 font-semibold">{passwordError}</p>}

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
