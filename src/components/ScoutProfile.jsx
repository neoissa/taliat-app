import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { 
  User, 
  Sparkles, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  ExternalLink, 
  Camera, 
  Loader2,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';
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
  const [bio, setBio] = useState('');
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
  const [activeProfileTab, setActiveProfileTab] = useState('personal'); // 'personal' | 'eagle' | 'homework' | 'attendance' | 'spt' | 'security'
  
  // Attendance Tracking & Risk States
  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 0,
    presentCount: 0,
    absentCount: 0,
    excusedCount: 0,
    lateCount: 0,
    attendanceRate: 100,
    riskLevel: 'green' // 'green' | 'yellow' | 'red'
  });
  const [scoutAttendanceSessions, setScoutAttendanceSessions] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all' | 'present' | 'absent' | 'excused'
  
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
          setBio(data.bio || '');
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

  // ── 0. REAL-TIME ATTENDANCE SESSIONS & ABSENCE RISK ENGINE ──
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
      const mySessions = [];
      let present = 0;
      let absent = 0;
      let excused = 0;
      let late = 0;
      let totalAttendedHours = 0;
      let totalCampingNights = 0;
      let totalServiceHours = 0;
      let totalTuesdayHours = 0;
      let totalFridayHours = 0;
      let totalHalqaHours = 0;

      snap.docs.forEach((d) => {
        const data = d.data();
        const record = data.records?.[currentUser.uid];
        if (record) {
          const status = record.status || 'present';
          const isAttended = status === 'present' || status === 'late';
          const sType = data.eventType || 'Weekly Troop Meeting (Friday)';
          const defaultH = sType.includes('Tuesday') ? 1.25 : sType.includes('Camp') ? 48.0 : sType.includes('Halqa') ? 1.5 : (sType.includes('Service') ? 3.0 : 3.0);
          const defaultN = sType.includes('Camp') ? 2 : 0;
          const sHours = record.hours !== undefined ? Number(record.hours) : (data.hours !== undefined ? Number(data.hours) : defaultH);
          const sNights = record.nights !== undefined ? Number(record.nights) : (data.nights !== undefined ? Number(data.nights) : defaultN);

          mySessions.push({
            id: d.id,
            date: data.date || '',
            eventType: sType,
            hours: sHours,
            nights: sNights,
            sessionNotes: data.notes || '',
            status: status,
            note: record.note || ''
          });

          if (status === 'present') {
            present++;
          } else if (status === 'late') {
            late++;
            present++;
          } else if (status === 'absent') {
            absent++;
          } else if (status === 'excused') {
            excused++;
          }

          if (isAttended) {
            totalAttendedHours += sHours;
            totalCampingNights += sNights;
            if (sType.includes('Tuesday')) totalTuesdayHours += sHours;
            else if (sType.includes('Weekly') || sType.includes('Friday')) totalFridayHours += sHours;
            else if (sType.includes('Halqa') || sType.includes('Study')) totalHalqaHours += sHours;
            else if (sType.includes('Service') || sType.includes('Volunteer')) totalServiceHours += sHours;
          }
        }
      });

      // Sort chronological descending
      mySessions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const total = mySessions.length;
      const rate = total > 0 ? Math.round((present / total) * 100) : 100;
      
      // Absence Risk Thresholds:
      // Red: >= 3 unexcused absences
      // Yellow: >= 2 unexcused absences
      // Green: 0-1 unexcused absences
      let risk = 'green';
      if (absent >= 3) {
        risk = 'red';
      } else if (absent >= 2) {
        risk = 'yellow';
      }

      setAttendanceStats({
        totalSessions: total,
        presentCount: present,
        absentCount: absent,
        excusedCount: excused,
        lateCount: late,
        attendanceRate: rate,
        riskLevel: risk,
        totalHours: Math.round(totalAttendedHours * 10) / 10,
        campingNights: totalCampingNights,
        serviceHours: Math.round(totalServiceHours * 10) / 10,
        tuesdayHours: Math.round(totalTuesdayHours * 10) / 10,
        fridayHours: Math.round(totalFridayHours * 10) / 10,
        halqaHours: Math.round(totalHalqaHours * 10) / 10
      });
      setScoutAttendanceSessions(mySessions);
    }, (err) => {
      console.warn("Scout attendance stats listener fallback:", err);
    });

    return () => unsub();
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
        bio: bio.trim(),
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

  // Filter sessions by selected tab
  const filteredSessions = scoutAttendanceSessions.filter(s => {
    if (attendanceFilter === 'all') return true;
    return s.status === attendanceFilter;
  });

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
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pt-1 text-xs">
              <span className="text-slate-400">
                Active Rank: <strong className="text-white">{rankName}</strong> &bull; BSA ID: <strong className="text-slate-300 font-mono">{bsaId}</strong>
              </span>

              {/* Attendance Risk Warning Badge in Header */}
              {attendanceStats.totalSessions > 0 && (
                <div className="flex items-center gap-1.5">
                  {attendanceStats.riskLevel === 'red' ? (
                    <button
                      type="button"
                      onClick={() => setActiveProfileTab('attendance')}
                      className="bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse cursor-pointer transition shadow-sm"
                      title="Click to review critical attendance warnings"
                    >
                      <AlertCircle size={11} />
                      <span>🚨 Attendance Warning: {attendanceStats.absentCount} Absences ({attendanceStats.attendanceRate}%)</span>
                    </button>
                  ) : attendanceStats.riskLevel === 'yellow' ? (
                    <button
                      type="button"
                      onClick={() => setActiveProfileTab('attendance')}
                      className="bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition shadow-sm"
                      title="Click to review attendance notice"
                    >
                      <AlertTriangle size={11} />
                      <span>⚠️ Attendance Notice: {attendanceStats.absentCount} Absences ({attendanceStats.attendanceRate}%)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveProfileTab('attendance')}
                      className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition shadow-sm"
                      title="Click to view attendance record"
                    >
                      <CheckCircle2 size={11} />
                      <span>✓ Good Attendance ({attendanceStats.attendanceRate}%)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
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
            onClick={() => setActiveProfileTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeProfileTab === 'attendance'
                ? (attendanceStats.riskLevel === 'red' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/50' 
                    : attendanceStats.riskLevel === 'yellow' 
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50' 
                    : 'bg-teal-600 text-white shadow-lg shadow-teal-950/50')
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <Calendar size={15} />
            <span>📋 My Attendance</span>
            {attendanceStats.absentCount >= 2 && (
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {attendanceStats.absentCount}
              </span>
            )}
          </button>
        )}

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

        {(currentUser.role === 'leader' || currentUser.role === 'owner') && (
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
        )}

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

      
      {/* ── TAB: DEDICATED ATTENDANCE & WARNING TRACKER (FOR SCOUTS) ── */}
      {activeProfileTab === 'attendance' && currentUser.role === 'scout' && (
        <div className="space-y-6">
          {/* Automated Color-Coded Warning Banner */}
          {attendanceStats.riskLevel === 'red' ? (
            <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/60 border-2 border-red-500/80 rounded-3xl p-6 shadow-2xl space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold shrink-0 shadow-lg animate-bounce">
                  <AlertCircle size={26} />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-red-300">
                      🚨 Critical Attendance Warning: {attendanceStats.absentCount} Unexcused Absences
                    </h3>
                    <span className="bg-red-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Immediate Action Required
                    </span>
                  </div>
                  <p className="text-xs text-red-200/90 leading-relaxed font-medium">
                    You have accumulated <strong>{attendanceStats.absentCount} unexcused absences</strong> across recorded patrol meetings and halqas (current attendance rate: <strong>{attendanceStats.attendanceRate}%</strong>). Active troop participation is mandatory for Scout rank advancements, patrol voting, and leadership qualifications.
                  </p>
                  <div className="pt-2 text-xs text-red-300 bg-red-950/50 p-3 rounded-xl border border-red-500/30 flex items-center gap-2">
                    <Info size={15} className="shrink-0" />
                    <span><strong>Action Step:</strong> Please consult with your Patrol Leader or Scoutmaster to review your attendance record and arrange make-up sessions or submit excused absence notes.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : attendanceStats.riskLevel === 'yellow' ? (
            <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 shadow-lg">
                  <AlertTriangle size={26} />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-amber-300">
                      ⚠️ Attendance Advisory: {attendanceStats.absentCount} Absences Recorded
                    </h3>
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Attention Needed
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                    You have <strong>{attendanceStats.absentCount} unexcused absences</strong>. Regular troop meeting and halqa attendance is essential to maintain your active standing and continue advancing toward your next rank.
                  </p>
                  <div className="pt-2 text-xs text-amber-300 bg-amber-950/50 p-3 rounded-xl border border-amber-500/30 flex items-center gap-2">
                    <Info size={15} className="shrink-0" />
                    <span><strong>Pro-Tip:</strong> If you are unable to attend due to illness, school exams, or travel, notify your leader ahead of time so your absence is marked as <em>Excused</em>.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/60 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-lg">
                <CheckCircle2 size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-emerald-300 flex items-center gap-2">
                  <span>🟢 Good Attendance Standing ({attendanceStats.attendanceRate}%)</span>
                </h3>
                <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
                  MāshāʾAllāh! You have attended <strong>{attendanceStats.presentCount} of {attendanceStats.totalSessions}</strong> recorded troop sessions with only {attendanceStats.absentCount} absence{attendanceStats.absentCount === 1 ? '' : 's'}. Keep up the great consistency!
                </p>
              </div>
            </div>
          )}

          {/* Attendance KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-800 border border-teal-500/40 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Total Hours</span>
              <strong className="text-xl font-black text-teal-300 font-mono block">{attendanceStats.totalHours || 0} Hours</strong>
              <span className="text-[10px] text-slate-400">Total earned in troop</span>
            </div>

            <div className="bg-slate-800 border border-emerald-500/40 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Present & Attended</span>
              <strong className="text-xl font-black text-emerald-300 font-mono block">{attendanceStats.presentCount} / {attendanceStats.totalSessions}</strong>
              <span className="text-[10px] text-emerald-400/80">{attendanceStats.attendanceRate}% Attendance Rate</span>
            </div>

            <div className="bg-slate-800 border border-indigo-500/40 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Camping Nights</span>
              <strong className="text-xl font-black text-indigo-300 font-mono block">{attendanceStats.campingNights || 0} Nights</strong>
              <span className="text-[10px] text-indigo-300/80">Outdoor campouts</span>
            </div>

            <div className={`p-4 rounded-2xl space-y-1 shadow-md border ${
              attendanceStats.absentCount >= 3 
                ? 'bg-red-950/40 border-red-500 text-red-300' 
                : attendanceStats.absentCount >= 2 
                ? 'bg-amber-950/40 border-amber-500 text-amber-300' 
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block">Unexcused Absences</span>
              <strong className="text-xl font-black font-mono block">{attendanceStats.absentCount} Missed</strong>
              <span className="text-[10px] opacity-80">
                {attendanceStats.absentCount >= 3 ? '🚨 Critical Alert' : attendanceStats.absentCount >= 2 ? '⚠️ Warning' : 'Within Limits'}
              </span>
            </div>

            <div className="bg-slate-800 border border-sky-500/30 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Excused & Late</span>
              <strong className="text-xl font-black text-sky-300 font-mono block">{attendanceStats.excusedCount} Exc / {attendanceStats.lateCount} Late</strong>
              <span className="text-[10px] text-sky-400/80">Notice / late log</span>
            </div>
          </div>

          {/* Chronological Attendance History Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-750 pb-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-teal-400" />
                  <span>My Attendance Session History ({filteredSessions.length} Entries)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Detailed roll call log recorded by your patrol leader during troop events.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-750'
                  }`}
                >
                  All ({scoutAttendanceSessions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('present')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'present'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border border-slate-750'
                  }`}
                >
                  Present ({attendanceStats.presentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('absent')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-red-300 border border-slate-750'
                  }`}
                >
                  Absent ({attendanceStats.absentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('excused')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'excused'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-sky-300 border border-slate-750'
                  }`}
                >
                  Excused ({attendanceStats.excusedCount})
                </button>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs italic space-y-2">
                <Calendar size={28} className="mx-auto text-slate-600" />
                <p>No attendance logs match the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Session Date</th>
                      <th className="py-3 px-3">Program / Event</th>
                      <th className="py-3 px-3 text-center">Duration</th>
                      <th className="py-3 px-3">Meeting Topic / Notes</th>
                      <th className="py-3 px-3">Your Attendance</th>
                      <th className="py-3 px-3">Leader Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-750/60">
                    {filteredSessions.map((session) => (
                      <tr 
                        key={session.id}
                        className={`transition ${
                          session.status === 'absent'
                            ? 'bg-red-950/20 hover:bg-red-950/30'
                            : session.status === 'late'
                            ? 'bg-amber-950/15 hover:bg-amber-950/25'
                            : 'hover:bg-slate-750/30'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-teal-400" />
                            <span>{session.date || '—'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-white">
                          {session.eventType}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-teal-300">
                          {session.status === 'present' || session.status === 'late' ? `${session.hours || 0}h${session.nights > 0 ? ` • ${session.nights}n` : ''}` : '0h'}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {session.sessionNotes || '—'}
                        </td>
                        <td className="py-3 px-3">
                          {session.status === 'present' ? (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              <Check size={11} /> Present
                            </span>
                          ) : session.status === 'absent' ? (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              <XCircle size={11} /> Absent
                            </span>
                          ) : session.status === 'excused' ? (
                            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              Excused
                            </span>
                          ) : session.status === 'late' ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              Late
                            </span>
                          ) : (
                            <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-xl capitalize">
                              {session.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-300 italic">
                          {session.note || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

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
        <div className="space-y-6">
          {/* If Scout has attendance warnings, show advisory banner on Personal Tab */}
          {currentUser.role === 'scout' && attendanceStats.totalSessions > 0 && attendanceStats.riskLevel !== 'green' && (
            <div 
              onClick={() => setActiveProfileTab('attendance')}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition shadow-lg ${
                attendanceStats.riskLevel === 'red'
                  ? 'bg-red-950/60 border-red-500/80 hover:border-red-400 text-red-200'
                  : 'bg-amber-950/60 border-amber-500/80 hover:border-amber-400 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {attendanceStats.riskLevel === 'red' ? (
                  <AlertCircle size={22} className="text-red-400 shrink-0 animate-bounce" />
                ) : (
                  <AlertTriangle size={22} className="text-amber-400 shrink-0" />
                )}
                <div>
                  <strong className="text-xs font-black block">
                    {attendanceStats.riskLevel === 'red'
                      ? `🚨 Critical Attendance Warning: ${attendanceStats.absentCount} Unexcused Absences (${attendanceStats.attendanceRate}% Attendance)`
                      : `⚠️ Attendance Advisory: ${attendanceStats.absentCount} Absences Recorded (${attendanceStats.attendanceRate}% Attendance)`
                    }
                  </strong>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Click here to view your complete roll call breakdown, session dates, and attendance policy details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="bg-slate-900 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
              >
                <span>View Log</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}

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

                {/* ── ABOUT ME SECTION ── */}
                <div className="pt-3 border-t border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <User size={15} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider">About Me</label>
                      <p className="text-[11px] text-slate-400">
                        Share facts about yourself, your hobbies, interests, and scouting goals.
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself, your interests, hobbies, goals in scouting, or a personal intro..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
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

            {/* Troop Affiliation & Attendance Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
                <Shield size={16} className="text-emerald-400" /> Troop Standing
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

                {/* Attendance Summary Tile */}
                {currentUser.role === 'scout' && (
                  <div 
                    onClick={() => setActiveProfileTab('attendance')}
                    className={`p-3.5 rounded-xl border transition cursor-pointer group space-y-2 ${
                      attendanceStats.riskLevel === 'red'
                        ? 'bg-red-950/30 border-red-500/50 hover:border-red-400'
                        : attendanceStats.riskLevel === 'yellow'
                        ? 'bg-amber-950/30 border-amber-500/50 hover:border-amber-400'
                        : 'bg-slate-900/60 border-slate-750 hover:border-teal-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance & Hours Standing</span>
                      <ChevronRight size={13} className="text-slate-500 group-hover:text-white transition" />
                    </div>
                    <div className="flex items-center justify-between">
                      <strong className={`text-sm font-black font-mono ${
                        attendanceStats.riskLevel === 'red'
                          ? 'text-red-400'
                          : attendanceStats.riskLevel === 'yellow'
                          ? 'text-amber-400'
                          : 'text-teal-300'
                      }`}>
                        {attendanceStats.attendanceRate}% Rate
                      </strong>
                      <span className="text-[10px] text-teal-300 font-mono font-bold">
                        {attendanceStats.totalHours || 0} Hours Earned
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{attendanceStats.presentCount}/{attendanceStats.totalSessions} Sessions</span>
                      <span>{attendanceStats.campingNights || 0} Camping Nights</span>
                    </div>
                    {attendanceStats.absentCount > 0 && (
                      <p className={`text-[10px] font-semibold pt-1 border-t border-slate-800 ${
                        attendanceStats.riskLevel === 'red' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {attendanceStats.riskLevel === 'red' ? '🚨' : '⚠️'} {attendanceStats.absentCount} Unexcused Absence{attendanceStats.absentCount === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SPT CERTIFICATE ── */}
      {activeProfileTab === 'spt' && (currentUser.role === 'leader' || currentUser.role === 'owner') && (
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
