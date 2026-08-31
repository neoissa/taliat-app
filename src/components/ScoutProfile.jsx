import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { User, Mail, Phone, Lock, Shield, Image as ImageIcon } from 'lucide-react';

export default function ScoutProfile({ currentUser }) {
  // Profile information states
  const [fullName, setFullName] = useState('');
  const [scoutEmail, setScoutEmail] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [scoutPhone, setScoutPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [bsaId, setBsaId] = useState('');
  const [patrolName, setPatrolName] = useState('Taliʿa');
  const [rankName, setRankName] = useState('Scout');
  
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
    const loadProfile = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || '');
          setScoutEmail(data.scoutEmail || '');
          setParentEmail(data.parentEmail || '');
          setScoutPhone(data.scoutPhone || '');
          setParentPhone(data.parentPhone || '');
          setPhotoUrl(data.photoURL || '');
          setPhotoPreview(data.photoURL || '');
          setBsaId(data.bsaId || '—');
          setRankName(data.rank || 'Scout');
          
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
  }, [currentUser.uid]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);

    try {
      // 1. Try Firebase Storage upload
      const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setPhotoUrl(downloadUrl);
    } catch (storageErr) {
      console.warn("Storage upload failed, falling back to Base64 URL:", storageErr);
      
      // 2. Base64 fallback if storage bucket is not set up
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        fullName: fullName.trim(),
        scoutEmail: scoutEmail.trim(),
        parentEmail: parentEmail.trim(),
        scoutPhone: scoutPhone.trim(),
        parentPhone: parentPhone.trim(),
        photoURL: photoUrl || null
      });
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      console.error(err);
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
      {/* Profile Overview Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Upload Container */}
        <div className="relative group shrink-0">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-slate-650 flex items-center justify-center font-bold text-slate-350 text-3xl uppercase shadow-lg">
              {fullName.charAt(0) || currentUser.email.charAt(0)}
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <ImageIcon className="text-white w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-center md:text-left space-y-1.5">
          <h2 className="text-xl font-bold text-white">{fullName || '@' + currentUser.username}</h2>
          <p className="text-xs text-slate-400">
            Username: <span className="text-slate-300 font-mono">@{currentUser.username}</span> &bull; 
            Patrol: <span className="text-emerald-400 font-semibold">{patrolName} Patrol</span>
          </p>
          <p className="text-xs text-slate-400">
            Active Rank: <span className="text-white font-semibold">{rankName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details Form */}
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
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">BSA Member ID (Read-only)</label>
                <input
                  type="text"
                  disabled
                  value={bsaId}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Mail size={12} /> Scout Email
                </label>
                <input
                  type="email"
                  value={scoutEmail}
                  onChange={(e) => setScoutEmail(e.target.value)}
                  placeholder="scout@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

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
                  <Phone size={12} /> Scout Phone
                </label>
                <input
                  type="tel"
                  value={scoutPhone}
                  onChange={(e) => setScoutPhone(e.target.value)}
                  placeholder="e.g. +1234567890"
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
            </div>

            {profileSuccess && <p className="text-xs text-emerald-400 font-semibold">{profileSuccess}</p>}
            {profileError && <p className="text-xs text-red-400 font-semibold">{profileError}</p>}

            <div className="flex justify-end border-t border-slate-700/60 pt-3">
              <button
                type="submit"
                disabled={updating}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-xl transition cursor-pointer"
              >
                {updating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
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
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {passwordSuccess && <p className="text-xs text-emerald-400 font-semibold">{passwordSuccess}</p>}
            {passwordError && <p className="text-xs text-red-400 font-semibold">{passwordError}</p>}

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
            >
              {updatingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
