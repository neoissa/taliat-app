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
  const [spt, setSpt] = useState('');
  
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
          setSpt(data.spt || '');
          
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
      const isScout = currentUser.role === 'scout';
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = {
        fullName: fullName.trim(),
        scoutEmail: scoutEmail.trim(),
        scoutPhone: scoutPhone.trim(),
        photoURL: photoUrl || null
      };

      if (isScout) {
        updates.parentEmail = parentEmail.trim();
        updates.parentPhone = parentPhone.trim();
      } else {
        updates.spt = spt.trim();
      }

      await updateDoc(userRef, updates);
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

              {currentUser.role !== 'scout' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Safety/Protection Training (SPT) Date
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={spt}
                      onChange={(e) => setSpt(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    />
                    {spt && (
                      <div className="flex gap-1 shrink-0">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Salam! Just sharing that I have completed my Safety/Protection Training (SPT) on ${spt}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-3 flex items-center justify-center transition cursor-pointer text-xs font-semibold"
                          title="Share on WhatsApp"
                        >
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.539 0 10.048-4.479 10.052-9.982.002-2.664-1.03-5.167-2.905-7.046C16.545 1.7 14.053.666 11.993.666c-5.545 0-10.054 4.481-10.058 9.984-.002 1.735.454 3.424 1.316 4.908l-.973 3.555 3.779-.983zm11.507-7.747c-.307-.155-1.822-.897-2.103-.997-.282-.102-.487-.154-.69.155-.203.31-.789.997-.968 1.205-.179.208-.359.233-.666.08-1.57-.792-2.73-1.378-3.82-3.238-.29-.497.29-.462.83-1.543.088-.178.044-.334-.022-.487-.066-.154-.689-1.658-.944-2.274-.249-.597-.502-.516-.69-.526l-.588-.01c-.204 0-.537.077-.818.384-.282.31-1.077 1.05-1.077 2.561 0 1.511 1.101 2.973 1.254 3.178.154.205 2.167 3.307 5.25 4.639.734.316 1.307.505 1.753.647.737.233 1.408.201 1.939.12.59-.09 1.822-.743 2.078-1.46.256-.718.256-1.334.18-1.46-.078-.128-.282-.204-.59-.36z"/>
                          </svg>
                        </a>
                        <a
                          href={`mailto:?subject=${encodeURIComponent("Safety/Protection Training (SPT) Completion")}&body=${encodeURIComponent(`Salam,\n\nThis is to share that I have completed my Safety/Protection Training (SPT) on ${spt}.\n\nShukran.`)}`}
                          className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl px-3 flex items-center justify-center transition cursor-pointer text-xs font-semibold"
                          title="Share via Email"
                        >
                          <Mail size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
