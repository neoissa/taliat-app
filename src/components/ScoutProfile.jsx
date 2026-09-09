import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { 
  User,
  Crown,
  KeyRound, 
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
  Filter,
  HeartPulse,
  MapPin,
  Users,
  Award,
  GraduationCap,
  Briefcase,
  Plus,
  FileText,
  PenTool,
  Printer,
  Bell,
  ShieldCheck,
  Send,
  X,
  Flame,
  Target,
  CheckSquare
} from 'lucide-react';
import { SCOUT_YOUTH_POSITIONS, ADULT_LEADER_POSITIONS } from '../data/rolesData';
import AssignmentsManager from './AssignmentsManager';
import RoadToEagleTracker from './RoadToEagleTracker';
import RoleAndLeadershipGuide from './RoleAndLeadershipGuide';
import LiveClockAndCalendar from './LiveClockAndCalendar';
import ServiceLogs from './ServiceLogs';
import PublishedReportViewerModal from './PublishedReportViewerModal';
import SignaturePadModal from './SignaturePadModal';
import { signPublishedReportByScout } from '../services/publishedReportsService';

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

export default function ScoutProfile({ currentUser, initialTab = 'personal', onNavigate }) {
  const [fullUserData, setFullUserData] = useState(null);

  // Accurate Role Flags
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com' || fullUserData?.role === 'owner';
  const isExecutive = isOwner || currentUser?.role === 'admin' || fullUserData?.role === 'admin';
  const isLeader = !isOwner && !isExecutive && (currentUser?.role === 'leader' || currentUser?.role === 'assistant_leader' || fullUserData?.role === 'leader' || fullUserData?.role === 'assistant_leader');
  const isParent = !isOwner && !isExecutive && !isLeader && (currentUser?.role === 'parent' || fullUserData?.role === 'parent');
  const isScout = !isOwner && !isExecutive && !isLeader && !isParent;

  // Profile information states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [scoutEmail, setScoutEmail] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [scoutPhone, setScoutPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Extended Profile fields
  const [bsaId, setBsaId] = useState('');
  const [schoolGrade, setSchoolGrade] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [parent1Name, setParent1Name] = useState('');
  const [parent1Relation, setParent1Relation] = useState('Father');
  const [parent2Name, setParent2Name] = useState('');
  const [parent2Relation, setParent2Relation] = useState('Mother');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [cityStateZip, setCityStateZip] = useState('');
  const [parentLinkedScouts, setParentLinkedScouts] = useState([]);
  const [leaderPosition, setLeaderPosition] = useState('Assistant Scoutmaster');
  const [scoutPosition, setScoutPosition] = useState('General Scout / Member');
  const [previousPositions, setPreviousPositions] = useState([]);

  const [patrolName, setPatrolName] = useState('Taliʿa');
  const [rankName, setRankName] = useState('Scout');
  const [spt, setSpt] = useState('');
  const [sptFileUrl, setSptFileUrl] = useState('');
  const [sptFileName, setSptFileName] = useState('');
  const [uploadingSpt, setUploadingSpt] = useState(false);
  const [savingSpt, setSavingSpt] = useState(false);
  const [leaderData, setLeaderData] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState(initialTab || 'personal'); // 'personal' | 'roles-guide' | 'service' | 'attendance' | 'spt' | 'security'

  useEffect(() => {
    if (initialTab) {
      setActiveProfileTab(initialTab);
    }
  }, [initialTab]);
  
  // Official Published Reports State for Scout
  const [publishedReports, setPublishedReports] = useState([]);
  const [scoutNotifications, setScoutNotifications] = useState([]);
  const [viewingPublishedReport, setViewingPublishedReport] = useState(null);
  const [signingPublishedReport, setSigningPublishedReport] = useState(null);
  const [isSubmittingScoutSignature, setIsSubmittingScoutSignature] = useState(false);
  const [scoutSignSuccessToast, setScoutSignSuccessToast] = useState('');

  // Attendance Tracking & Risk States
  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 0,
    presentCount: 0,
    absentCount: 0,
    excusedCount: 0,
    lateCount: 0,
    attendanceRate: 100,
    riskLevel: 'green', // 'green' | 'yellow' | 'red'
    criticalityLevel: 0, // 0 | 1 | 2 | 3
    totalHours: 0,
    campingNights: 0,
    serviceHours: 0,
    tuesdayHours: 0,
    fridayHours: 0,
    halqaHours: 0,
    campoutHours: 0,
    categories: {
      meetings: { total: 0, attended: 0 },
      halqas: { total: 0, attended: 0 },
      campouts: { total: 0, attended: 0 },
      service: { total: 0, attended: 0 }
    }
  });
  const [scoutAttendanceSessions, setScoutAttendanceSessions] = useState([]);
  const [attendanceExcuses, setAttendanceExcuses] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all' | 'present' | 'absent' | 'excused'
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseDate, setExcuseDate] = useState(new Date().toISOString().split('T')[0]);
  const [excuseReason, setExcuseReason] = useState('Illness');
  const [excuseNotes, setExcuseNotes] = useState('');
  const [excuseSubmitting, setExcuseSubmitting] = useState(false);
  const [excuseSuccessMsg, setExcuseSuccessMsg] = useState('');
  
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
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubProfile = onSnapshot(userRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFullUserData(data);
        setFullName(data.fullName || '');
        setUsername(data.username || currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : ''));
        setBio(data.bio || '');
        setScoutEmail(data.personalEmail || data.scoutEmail || data.email || '');
        setParentEmail(data.parentEmail || '');
        setScoutPhone(data.scoutPhone || data.phone || '');
        setParentPhone(data.parentPhone || '');
        setPhotoUrl(data.photoURL || '');
        setPhotoPreview(data.photoURL || '');
        setBsaId(data.bsaId || '');
        setSchoolGrade(data.schoolGrade || data.grade || '');
        setBirthDate(data.birthDate || data.dob || '');
        setAllergies(data.allergies || '');
        setMedicalNotes(data.medicalNotes || '');
        setDietaryRestrictions(data.dietaryRestrictions || '');
        setParent1Name(data.parent1Name || '');
        setParent1Relation(data.parent1Relation || 'Father');
        setParent2Name(data.parent2Name || '');
        setParent2Relation(data.parent2Relation || 'Mother');
        setEmergencyContactName(data.emergencyContactName || '');
        setEmergencyContactPhone(data.emergencyContactPhone || '');
        setEmergencyContactRelation(data.emergencyContactRelation || '');
        setHomeAddress(data.homeAddress || data.address || '');
        setCityStateZip(data.cityStateZip || '');

        setRankName(data.rank || 'Scout');
        setScoutPosition(data.scoutPosition || data.position || 'General Scout / Member');
        setLeaderPosition(data.leaderPosition || currentUser?.leaderPosition || 'Assistant Scoutmaster');
        setPreviousPositions(Array.isArray(data.previousPositions) ? data.previousPositions : Array.isArray(data.pastPositions) ? data.pastPositions : []);
        setSpt(data.spt || data.sptDate || data.yptDate || '');
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
      setLoading(false);
    }, (err) => {
      console.error("Failed to listen to user profile:", err);
      setLoading(false);
    });
    
    return () => unsubProfile();
  }, [currentUser?.uid]);

  // Real-time listener for linked children if parent
  useEffect(() => {
    const isParent = currentUser?.role === 'parent' || fullUserData?.role === 'parent';
    const linkedIds = fullUserData?.linkedScoutIds || currentUser?.linkedScoutIds || [];
    if (isParent || linkedIds.length > 0) {
      const unsub = onSnapshot(collection(db, 'users'), (snap) => {
        const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setParentLinkedScouts(allUsers.filter(u => linkedIds.includes(u.uid)));
      });
      return () => unsub();
    }
  }, [currentUser?.role, currentUser?.linkedScoutIds, fullUserData?.role, fullUserData?.linkedScoutIds]);

  // ── 0. REAL-TIME ATTENDANCE SESSIONS, EVENTS & ABSENCE RISK ENGINE ──
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubSessions = onSnapshot(collection(db, 'attendance_sessions'), (snap) => {
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
      let totalCampoutHours = 0;
      let meetingCount = 0;
      let meetingPresent = 0;
      let halqaCount = 0;
      let halqaPresent = 0;
      let campoutCount = 0;
      let campoutPresent = 0;
      let serviceCount = 0;
      let servicePresent = 0;

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

          if (sType.includes('Tuesday') || sType.includes('Halqa')) {
            halqaCount++;
            if (isAttended) halqaPresent++;
          } else if (sType.includes('Camp')) {
            campoutCount++;
            if (isAttended) campoutPresent++;
          } else if (sType.includes('Service')) {
            serviceCount++;
            if (isAttended) servicePresent++;
          } else {
            meetingCount++;
            if (isAttended) meetingPresent++;
          }

          if (isAttended) {
            totalAttendedHours += sHours;
            totalCampingNights += sNights;
            if (sType.includes('Tuesday')) totalTuesdayHours += sHours;
            else if (sType.includes('Weekly') || sType.includes('Friday')) totalFridayHours += sHours;
            else if (sType.includes('Halqa') || sType.includes('Study')) totalHalqaHours += sHours;
            else if (sType.includes('Camp')) totalCampoutHours += sHours;
            else if (sType.includes('Service') || sType.includes('Volunteer')) totalServiceHours += sHours;
          }
        }
      });

      // Sort chronological descending
      mySessions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const total = mySessions.length;
      const rate = total > 0 ? Math.round((present / total) * 100) : 100;
      
      // Absence Risk & Criticality Thresholds:
      // Level 0: 0 unexcused absences (Pristine Standing, 100%)
      // Level 1: 1 unexcused absence (Good Standing, Low Risk)
      // Level 2: 2 unexcused absences (Warning / Advisory Threshold)
      // Level 3: >= 3 unexcused absences (Critical Escalation / Action Required)
      let risk = 'green';
      let critLevel = 0;
      if (absent >= 3) {
        risk = 'red';
        critLevel = 3;
      } else if (absent === 2) {
        risk = 'yellow';
        critLevel = 2;
      } else if (absent === 1) {
        risk = 'green';
        critLevel = 1;
      } else {
        risk = 'green';
        critLevel = 0;
      }

      setAttendanceStats({
        totalSessions: total,
        presentCount: present,
        absentCount: absent,
        excusedCount: excused,
        lateCount: late,
        attendanceRate: rate,
        riskLevel: risk,
        criticalityLevel: critLevel,
        totalHours: Math.round(totalAttendedHours * 10) / 10,
        campingNights: totalCampingNights,
        serviceHours: Math.round(totalServiceHours * 10) / 10,
        tuesdayHours: Math.round(totalTuesdayHours * 10) / 10,
        fridayHours: Math.round(totalFridayHours * 10) / 10,
        halqaHours: Math.round(totalHalqaHours * 10) / 10,
        campoutHours: Math.round(totalCampoutHours * 10) / 10,
        categories: {
          meetings: { total: meetingCount, attended: meetingPresent },
          halqas: { total: halqaCount, attended: halqaPresent },
          campouts: { total: campoutCount, attended: campoutPresent },
          service: { total: serviceCount, attended: servicePresent }
        }
      });
      setScoutAttendanceSessions(mySessions);
    }, (err) => {
      console.warn("Scout attendance stats listener fallback:", err);
    });

    const unsubExcuses = onSnapshot(collection(db, 'attendance_excuses'), (snap) => {
      const myExcuses = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.scoutId === currentUser.uid);
      setAttendanceExcuses(myExcuses);
    }, (err) => console.warn("Attendance excuses listener fallback:", err));

    return () => {
      unsubSessions();
      unsubExcuses();
    };
  }, [currentUser?.uid]);

  // ── 0.5. REAL-TIME PUBLISHED REPORTS & SCOUT NOTIFICATIONS ──
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubPub = onSnapshot(collection(db, 'published_reports'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.scoutId === currentUser.uid);
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      setPublishedReports(list);
    }, (err) => console.warn("Published reports listener fallback:", err));

    const unsubNotifs = onSnapshot(collection(db, 'scout_notifications'), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => n.recipientUid === currentUser.uid);
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setScoutNotifications(list);
    }, (err) => console.warn("Scout notifications listener fallback:", err));

    return () => {
      unsubPub();
      unsubNotifs();
    };
  }, [currentUser?.uid]);

  // Scout Digital Signature Handler
  const handleSaveScoutSignature = async ({ signerName, signatureDataUrl }) => {
    if (!signingPublishedReport) return;
    setIsSubmittingScoutSignature(true);
    try {
      await signPublishedReportByScout({
        reportId: signingPublishedReport.reportId || signingPublishedReport.id,
        signerName,
        signatureDataUrl
      });
      setScoutSignSuccessToast(`✓ Official progress report certified and digitally signed!`);
      setSigningPublishedReport(null);

      if (viewingPublishedReport && (viewingPublishedReport.id === signingPublishedReport.id || viewingPublishedReport.reportId === signingPublishedReport.reportId)) {
        setViewingPublishedReport(prev => ({
          ...prev,
          signatures: {
            ...prev.signatures,
            scout: {
              signed: true,
              signerName,
              signatureDataUrl,
              signedAt: new Date().toISOString()
            }
          }
        }));
      }
    } catch (err) {
      console.error('Scout signature error:', err);
      alert('Error saving signature: ' + err.message);
    } finally {
      setIsSubmittingScoutSignature(false);
      setTimeout(() => setScoutSignSuccessToast(''), 4000);
    }
  };

  // ── ABSENCE EXCUSE SUBMISSION HANDLER ──
  const handleSubmitAbsenceExcuse = async (e) => {
    if (e) e.preventDefault();
    if (!excuseDate) {
      alert('Please select the date of the missed session.');
      return;
    }
    setExcuseSubmitting(true);
    setExcuseSuccessMsg('');
    try {
      const excuseId = `${currentUser.uid}_${excuseDate}_${Date.now()}`;
      await setDoc(doc(db, 'attendance_excuses', excuseId), {
        scoutId: currentUser.uid,
        scoutName: fullName || currentUser.username || 'Scout',
        groupId: fullUserData?.groupId || currentUser.groupId || '',
        date: excuseDate,
        reason: excuseReason,
        notes: excuseNotes,
        submittedAt: new Date().toISOString(),
        submittedBy: fullName || currentUser.username,
        status: 'pending'
      }, { merge: true });

      setExcuseSuccessMsg('✓ Absence explanation submitted to unit leadership successfully!');
      setTimeout(() => {
        setExcuseSuccessMsg('');
        setShowExcuseModal(false);
        setExcuseNotes('');
      }, 2000);
    } catch (err) {
      console.error('Error submitting absence excuse:', err);
      alert('Failed to submit excuse: ' + err.message);
    } finally {
      setExcuseSubmitting(false);
    }
  };

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
        sptDate: defaultDate,
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

  // ── 2.5 DIRECT SPT DATE SAVE HANDLER ──
  const handleSaveSptDirectly = async (e) => {
    if (e) e.preventDefault();
    setSavingSpt(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const cleanDate = spt.trim() || null;
      await setDoc(userRef, {
        spt: cleanDate,
        sptDate: cleanDate,
        sptFileUrl: sptFileUrl || null,
        sptFileName: sptFileName || null
      }, { merge: true });

      setProfileSuccess("✓ Safety/Protection Training (SPT) record updated successfully!");
      setTimeout(() => setProfileSuccess(''), 3500);
    } catch (err) {
      console.error("SPT Direct Save error:", err);
      setProfileError("Failed to save SPT record: " + err.message);
    } finally {
      setSavingSpt(false);
    }
  };

  // ── 3. SAVE PROFILE INFORMATION FORM ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = {
        fullName: fullName.trim(),
        ...(isOwner && username.trim() ? { username: username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') } : {}),
        bio: bio.trim(),
        scoutEmail: scoutEmail.trim(),
        personalEmail: scoutEmail.trim(),
        scoutPhone: scoutPhone.trim(),
        phone: scoutPhone.trim(),
        photoURL: photoUrl || null,
        bsaId: bsaId.trim() || null
      };

      // Only non-scouts (parents, leaders, admins, owners) can edit emergency and address fields directly here
      if (!isScout) {
        updates.emergencyContactName = emergencyContactName.trim() || null;
        updates.emergencyContactPhone = emergencyContactPhone.trim() || null;
        updates.emergencyContactRelation = emergencyContactRelation.trim() || null;
        updates.homeAddress = homeAddress.trim() || null;
        updates.cityStateZip = cityStateZip.trim() || null;
        updates.allergies = allergies.trim() || null;
        updates.medicalNotes = medicalNotes.trim() || null;
        updates.dietaryRestrictions = dietaryRestrictions.trim() || null;
        updates.spt = spt.trim() || null;
        updates.sptDate = spt.trim() || null;
        updates.sptFileUrl = sptFileUrl || null;
        updates.sptFileName = sptFileName || null;
      }

      if (isScout) {
        updates.schoolGrade = schoolGrade.trim() || null;
        updates.birthDate = birthDate.trim() || null;
        updates.scoutPosition = scoutPosition || 'General Scout / Member';
        updates.position = scoutPosition || 'General Scout / Member';
        updates.previousPositions = previousPositions;
      }

      if (isLeader || isExecutive) {
        if (leaderPosition) {
          updates.leaderPosition = leaderPosition;
        }
        updates.previousPositions = previousPositions;
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
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isOwner 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : currentUser?.role === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : isLeader
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isParent
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isOwner 
                ? '👑 Troop Owner & Superadmin' 
                : currentUser?.role === 'admin' 
                ? '⚜️ Executive Admin' 
                : isLeader 
                ? (leaderPosition || currentUser?.leaderPosition || 'Troop Leader') 
                : isParent 
                ? '👨‍👩‍👧 Dhulfiqār Parent / Guardian' 
                : '⚜️ Scout'}
            </span>
            {isScout && patrolName && (
              <span className="bg-slate-700 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {patrolName} Patrol
              </span>
            )}
            {isLeader && (
              <span className="bg-slate-700 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {patrolName ? `${patrolName} Unit Leader` : 'Troop Leadership'}
              </span>
            )}
            {isParent && parentLinkedScouts.length > 0 && (
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {parentLinkedScouts.length} Linked Scout{parentLinkedScouts.length === 1 ? '' : 's'}
              </span>
            )}
            {isOwner && (
              <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Supreme Troop HQ
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{fullName || '@' + currentUser.username}</h2>
          <p className="text-xs text-slate-400">
            Username: <span className="text-slate-300 font-mono">@{currentUser.username}</span> &bull; 
            Email: <span className="text-emerald-400 font-medium">{currentUser.email}</span>
          </p>

          {/* Scout-Specific Status in Header */}
          {isScout && (
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pt-1 text-xs">
              <span className="text-slate-400">
                Active Rank: <strong className="text-white">{rankName}</strong> &bull; BSA ID: <strong className="text-slate-300 font-mono">{bsaId || '—'}</strong>
              </span>
              {scoutPosition && scoutPosition !== 'General Scout / Member' && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown size={10} />
                  <span>{scoutPosition}</span>
                </span>
              )}

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

          {/* Leader-Specific Status in Header */}
          {(isLeader || isExecutive) && (
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pt-1 text-xs">
              <span className="text-slate-400">
                Position: <strong className="text-white">{leaderPosition || 'Troop Leader'}</strong>
              </span>
              <span className="text-slate-600">&bull;</span>
              <button
                type="button"
                onClick={() => setActiveProfileTab('spt')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition ${
                  spt 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
                }`}
              >
                {spt ? `✓ SPT Valid: ${spt}` : '⚠️ SPT Required'}
              </button>
            </div>
          )}

          {/* Parent-Specific Status in Header */}
          {isParent && (
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pt-1 text-xs">
              <span className="text-slate-400">
                Children Linked: <strong className="text-white">{parentLinkedScouts.length}</strong>
              </span>
              <span className="text-slate-600">&bull;</span>
              <button
                type="button"
                onClick={() => setActiveProfileTab('spt')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition ${
                  spt 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                    : 'bg-slate-700 text-slate-300 border-slate-600 hover:text-white'
                }`}
              >
                {spt ? `✓ SPT Chaperone Valid: ${spt}` : '🛡️ SPT Volunteer: Optional'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTIFICATION BANNER: OFFICIAL PROGRESS REPORT PUBLISHED ── */}
      {isScout && publishedReports.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-850 to-sky-950/40 border-2 border-emerald-500/50 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl shrink-0 shadow-md">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Official Progress Report Snapshot
                </span>
                {!publishedReports[0].signatures?.scout?.signed ? (
                  <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                    ✍️ Scout Candidate Signature Requested
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    ✓ Scout Signed
                  </span>
                )}
              </div>
              <h3 className="text-sm font-black text-white mt-1">
                Unit Leader {publishedReports[0].leaderName} published your official advancement report snapshot for {publishedReports[0].reportSnapshot?.rank || rankName} Rank
              </h3>
              <p className="text-xs text-slate-300">
                Published on {publishedReports[0].publishedAt?.split('T')[0]} &bull; Parent Status: {publishedReports[0].signatures?.parent?.signed ? '✓ Signed by Parent' : '⏳ Awaiting Parent Review'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => {
                if (!publishedReports[0].signatures?.scout?.signed) {
                  setSigningPublishedReport(publishedReports[0]);
                } else {
                  setViewingPublishedReport(publishedReports[0]);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <FileText size={14} />
              <span>{!publishedReports[0].signatures?.scout?.signed ? 'Review & Sign Report' : 'View Certified PDF'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveProfileTab('reports')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              All Snapshots ({publishedReports.length})
            </button>
          </div>
        </div>
      )}

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
          <span>{isParent ? '👨‍👩‍👧 Family Profile' : '👤 Personal Info'}</span>
        </button>

        {isScout && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeProfileTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <FileText size={15} />
            <span>📜 Official Progress Reports</span>
            {publishedReports.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                publishedReports.some(r => !r.signatures?.scout?.signed)
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : 'bg-slate-900 text-emerald-300'
              }`}>
                {publishedReports.length}
              </span>
            )}
          </button>
        )}

        {!isParent && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('roles-guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeProfileTab === 'roles-guide'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <Crown size={15} className={activeProfileTab === 'roles-guide' ? 'text-slate-950' : 'text-amber-400'} />
            <span>Role & Leadership Guide</span>
          </button>
        )}

        {isScout && (
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

        {isScout && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('service')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeProfileTab === 'service'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            <Clock size={15} />
            <span>⏱️ Service & Volunteering</span>
          </button>
        )}

        {!isScout && (
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
            <span>{isParent ? '🛡️ Safety Training (SPT - Volunteer)' : '🛡️ SPT Certificate'}</span>
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
      
      {/* ── TAB: ROLE & LEADERSHIP GUIDE ── */}
      {activeProfileTab === 'roles-guide' && (
        <RoleAndLeadershipGuide
          currentUser={currentUser}
          userData={fullUserData}
        />
      )}

      {/* ── TAB: DEDICATED ATTENDANCE, EVENTS PARTICIPATION & CRITICALITY DASHBOARD ── */}
      {activeProfileTab === 'attendance' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          
          {/* 1. TOP PACING & CRITICALITY HEADER BANNER */}
          <div className={`border-2 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 transition ${
            attendanceStats.criticalityLevel === 3
              ? 'bg-gradient-to-br from-red-950/90 via-slate-900 to-red-950/60 border-red-500/80 shadow-red-950/60'
              : attendanceStats.criticalityLevel === 2
              ? 'bg-gradient-to-br from-amber-950/90 via-slate-900 to-amber-950/60 border-amber-500/80 shadow-amber-950/60'
              : attendanceStats.criticalityLevel === 1
              ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-teal-950/50 border-emerald-500/60 shadow-emerald-950/40'
              : 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/60 border-emerald-500/70 shadow-emerald-950/50'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-xl ${
                  attendanceStats.criticalityLevel === 3
                    ? 'bg-red-500/20 border-2 border-red-500/60 text-red-400 animate-bounce'
                    : attendanceStats.criticalityLevel === 2
                    ? 'bg-amber-500/20 border-2 border-amber-500/60 text-amber-400'
                    : 'bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400'
                }`}>
                  {attendanceStats.criticalityLevel === 3 ? (
                    <AlertCircle size={30} />
                  ) : attendanceStats.criticalityLevel === 2 ? (
                    <AlertTriangle size={30} />
                  ) : (
                    <CheckCircle2 size={30} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                      attendanceStats.criticalityLevel === 3
                        ? 'bg-red-500 text-slate-950 animate-pulse'
                        : attendanceStats.criticalityLevel === 2
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {attendanceStats.criticalityLevel === 3
                        ? '🚨 Tier 3: Critical Absence Risk'
                        : attendanceStats.criticalityLevel === 2
                        ? '⚠️ Tier 2: Attendance Advisory'
                        : attendanceStats.criticalityLevel === 1
                        ? '🟢 Tier 1: Good Standing (1 Missed)'
                        : '🟢 Tier 0: Perfect Standing (100%)'}
                    </span>
                    <span className="text-xs text-slate-300 font-mono font-bold bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {attendanceStats.presentCount} of {attendanceStats.totalSessions} Sessions Attended
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white tracking-tight">
                    {attendanceStats.criticalityLevel === 3
                      ? `Critical Warning: ${attendanceStats.absentCount} Unexcused Absences Recorded`
                      : attendanceStats.criticalityLevel === 2
                      ? `Attendance Advisory: ${attendanceStats.absentCount} Absences (Approaching Limit)`
                      : attendanceStats.criticalityLevel === 1
                      ? `Active Standing: 1 Absence Recorded (${attendanceStats.attendanceRate}% Attendance)`
                      : `MāshāʾAllāh! Perfect 100% Attendance Record`
                    }
                  </h3>

                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {attendanceStats.criticalityLevel === 3
                      ? `You have accumulated ${attendanceStats.absentCount} unexcused absences (current rate: ${attendanceStats.attendanceRate}%). Active troop attendance (≥80%) is required for rank requirement sign-offs and Board of Review scheduling. Please consult your Scoutmaster or Patrol Leader immediately to schedule a make-up session.`
                      : attendanceStats.criticalityLevel === 2
                      ? `You have ${attendanceStats.absentCount} unexcused absences. Missing 1 more meeting will trigger an advancement hold. Make sure to attend the next 3 consecutive troop meetings and halqas to restore strong standing.`
                      : attendanceStats.criticalityLevel === 1
                      ? `You have 1 absence on record. Your active attendance rate is ${attendanceStats.attendanceRate}%, which is well within the troop benchmark. If this absence was due to illness or school exams, submit an excused note.`
                      : `You have attended every single recorded roll call session! Perfect attendance qualifies you for annual attendance honors and priority high-adventure expeditions.`
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setExcuseDate(new Date().toISOString().split('T')[0]);
                    setShowExcuseModal(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg"
                >
                  <Send size={13} />
                  <span>Submit Absence Excuse Note</span>
                </button>
              </div>
            </div>

            {/* Attendance Progress Bar vs 80% Benchmark */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-755 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-emerald-400" />
                  <span>Overall Attendance Pacing Meter</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-amber-300 font-semibold">
                    🎯 Benchmark: ≥80% Required
                  </span>
                  <span className={`font-mono text-sm font-black ${
                    attendanceStats.attendanceRate >= 80 ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {attendanceStats.attendanceRate}%
                  </span>
                </div>
              </div>

              <div className="relative w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700/80">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    attendanceStats.attendanceRate >= 80
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-400'
                      : attendanceStats.attendanceRate >= 70
                      ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                      : 'bg-gradient-to-r from-red-600 to-red-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, attendanceStats.attendanceRate))}%` }}
                />
                {/* 80% Benchmark Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm z-10"
                  style={{ left: '80%' }}
                  title="80% Minimum Standard"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>0%</span>
                <span className="text-amber-400 font-bold">80% Active Standard (Advancement Gate)</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* 2. THE 5 HERO KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Events Had</span>
              <strong className="text-xl font-black text-white font-mono block">
                {attendanceStats.totalSessions} Held
              </strong>
              <span className="text-[10px] text-slate-400">Recorded troop sessions</span>
            </div>

            <div className="bg-slate-800 border border-emerald-500/40 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Events Attended</span>
              <strong className="text-xl font-black text-emerald-300 font-mono block">
                {attendanceStats.presentCount} / {attendanceStats.totalSessions}
              </strong>
              <span className="text-[10px] text-emerald-400/80 font-bold font-mono">
                {attendanceStats.attendanceRate}% Attendance Rate
              </span>
            </div>

            <div className={`p-4 rounded-2xl space-y-1 shadow-md border ${
              attendanceStats.absentCount >= 3 
                ? 'bg-red-950/40 border-red-500 text-red-300' 
                : attendanceStats.absentCount >= 2 
                ? 'bg-amber-950/40 border-amber-500 text-amber-300' 
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block">Events Missed</span>
              <strong className="text-xl font-black font-mono block">
                {attendanceStats.absentCount} Unexcused
              </strong>
              <span className="text-[10px] opacity-80">
                {attendanceStats.excusedCount > 0 ? `+ ${attendanceStats.excusedCount} Excused Notes` : 'No Excuses Filed'}
              </span>
            </div>

            <div className="bg-slate-800 border border-teal-500/40 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Program Hours</span>
              <strong className="text-xl font-black text-teal-300 font-mono block">
                {attendanceStats.totalHours || 0} Hours
              </strong>
              <span className="text-[10px] text-teal-300/80">Logged in field & meetings</span>
            </div>

            <div className="bg-slate-800 border border-indigo-500/40 p-4 rounded-2xl space-y-1 shadow-md">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Campout Nights</span>
              <strong className="text-xl font-black text-indigo-300 font-mono block">
                {attendanceStats.campingNights || 0} Nights
              </strong>
              <span className="text-[10px] text-indigo-300/80">Outdoor overnights</span>
            </div>
          </div>

          {/* 3. TROOP ATTENDANCE CRITICALITY & ABSENCE POLICY MATRIX (1, 2, 3+ MISSED) */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-750 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Troop Attendance Criticality & Absence Policy Scale</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand what each absence level means for your scout’s rank advancement, privileges, and troop standing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {/* Tier 0: 0 Absences */}
              <div className={`p-4 rounded-2xl border transition space-y-2 flex flex-col justify-between ${
                attendanceStats.absentCount === 0
                  ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-755'
              }`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Level 0: Pristine
                    </span>
                    {attendanceStats.absentCount === 0 && (
                      <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        ACTIVE LEVEL ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>🟢 0 Missed</span>
                    <span className="text-xs text-slate-400 font-normal">(100%)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    <strong>Pristine Record:</strong> Unrestricted rank advancements, eligible for the Troop Attendance Honor Pin, priority selection for high-adventure campouts.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 font-bold">
                  Status: Exemplary Standing
                </div>
              </div>

              {/* Tier 1: 1 Absence */}
              <div className={`p-4 rounded-2xl border transition space-y-2 flex flex-col justify-between ${
                attendanceStats.absentCount === 1
                  ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-755'
              }`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Level 1: Safe Buffer
                    </span>
                    {attendanceStats.absentCount === 1 && (
                      <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        ACTIVE LEVEL ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>🟢 1 Missed</span>
                    <span className="text-xs text-slate-400 font-normal">(Low Risk)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    <strong>Good Standing:</strong> Within standard excused buffer. Check in with your patrol buddy to catch up on missed skills and submit an excuse note if ill.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 font-bold">
                  Status: Standard Active
                </div>
              </div>

              {/* Tier 2: 2 Absences */}
              <div className={`p-4 rounded-2xl border transition space-y-2 flex flex-col justify-between ${
                attendanceStats.absentCount === 2
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/50'
                  : 'bg-slate-900/80 border-slate-755'
              }`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      Level 2: Warning
                    </span>
                    {attendanceStats.absentCount === 2 && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                        ⚠️ CAUTION
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>🟡 2 Missed</span>
                    <span className="text-xs text-amber-300 font-normal">(Advisory)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    <strong>Caution Threshold:</strong> Approaching critical limit. Missing 1 more session places rank advancements on hold. Patrol Leader will conduct an attendance check-in.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-400 font-bold">
                  Status: Advisory Notice
                </div>
              </div>

              {/* Tier 3+: 3+ Absences */}
              <div className={`p-4 rounded-2xl border transition space-y-2 flex flex-col justify-between ${
                attendanceStats.absentCount >= 3
                  ? 'bg-red-950/70 border-red-500 ring-2 ring-red-500/50 shadow-lg shadow-red-950/60'
                  : 'bg-slate-900/80 border-slate-755'
              }`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                      Level 3: Critical
                    </span>
                    {attendanceStats.absentCount >= 3 && (
                      <span className="bg-red-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                        🚨 ACTION REQUIRED
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>🔴 3+ Missed</span>
                    <span className="text-xs text-red-300 font-normal">(Critical)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    <strong>Critical Escalation:</strong> Below 80% active standard. Rank sign-offs, Board of Review, and patrol voting privileges paused until an attendance plan / make-up hours are fulfilled.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-red-400 font-bold">
                  Status: Advancement Hold
                </div>
              </div>
            </div>
          </div>

          {/* 4. EVENT PARTICIPATION BREAKDOWN BY CATEGORY */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-750 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Target size={18} className="text-sky-400" />
                <span>Participation Breakdown by Program Category</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Attendance rate across regular troop meetings, Islamic study halqas, outdoor expeditions, and service logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-slate-900/80 border border-slate-755 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚜️</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Weekly Troop Meetings</h5>
                    <span className="text-[10px] text-slate-400 font-mono">Friday / Sunday</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Attended:</span>
                  <strong className="text-emerald-300 font-mono">
                    {attendanceStats.categories?.meetings?.attended || 0} / {attendanceStats.categories?.meetings?.total || 0}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-755 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕌</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Islamic Knowledge Halqa</h5>
                    <span className="text-[10px] text-slate-400 font-mono">Tuesday Evenings</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Attended:</span>
                  <strong className="text-sky-300 font-mono">
                    {attendanceStats.categories?.halqas?.attended || 0} / {attendanceStats.categories?.halqas?.total || 0}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-755 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⛺</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Outdoor Campouts</h5>
                    <span className="text-[10px] text-slate-400 font-mono">Weekend Expeditions</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Nights Logged:</span>
                  <strong className="text-indigo-300 font-mono">
                    {attendanceStats.campingNights || 0} Nights
                  </strong>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-755 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛠️</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Community Service</h5>
                    <span className="text-[10px] text-slate-400 font-mono">Volunteer Projects</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Service Logged:</span>
                  <strong className="text-amber-300 font-mono">
                    {attendanceStats.serviceHours || 0} Hours
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* 5. CHRONOLOGICAL ATTENDANCE HISTORY TABLE WITH FILTERS */}
          <div className="bg-slate-850 border border-slate-750 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-750 pb-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-teal-400" />
                  <span>Roll Call & Session History ({filteredSessions.length} Entries)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Complete roll call log recorded by your patrol leader during troop events.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-750'
                  }`}
                >
                  All ({scoutAttendanceSessions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('present')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'present'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border border-slate-750'
                  }`}
                >
                  ✓ Attended ({attendanceStats.presentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('absent')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'absent'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-red-300 border border-slate-750'
                  }`}
                >
                  🚨 Missed ({attendanceStats.absentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceFilter('excused')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                    attendanceFilter === 'excused'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-sky-300 border border-slate-750'
                  }`}
                >
                  📝 Excused ({attendanceStats.excusedCount})
                </button>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs italic space-y-2">
                <Calendar size={32} className="mx-auto text-slate-600 opacity-60" />
                <p>No attendance records match the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-3">Session Date</th>
                      <th className="py-3.5 px-3">Program / Event</th>
                      <th className="py-3.5 px-3 text-center">Duration</th>
                      <th className="py-3.5 px-3">Meeting Topic / Notes</th>
                      <th className="py-3.5 px-3">Attendance Status</th>
                      <th className="py-3.5 px-3">Leader Remarks</th>
                      <th className="py-3.5 px-3 text-right">Action</th>
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
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-300 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-teal-400" />
                            <span>{session.date || '—'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-white">
                          {session.eventType}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-teal-300 whitespace-nowrap">
                          {session.status === 'present' || session.status === 'late' ? `${session.hours || 0}h${session.nights > 0 ? ` • ${session.nights}n` : ''}` : '0h'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate">
                          {session.sessionNotes || '—'}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {session.status === 'present' ? (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              <Check size={11} /> Present
                            </span>
                          ) : session.status === 'absent' ? (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              <XCircle size={11} /> Absent (Unexcused)
                            </span>
                          ) : session.status === 'excused' ? (
                            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              📝 Excused
                            </span>
                          ) : session.status === 'late' ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                              ⏳ Late
                            </span>
                          ) : (
                            <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-xl capitalize">
                              {session.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-slate-300 italic max-w-xs truncate">
                          {session.note || '—'}
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {session.status === 'absent' && (
                            <button
                              type="button"
                              onClick={() => {
                                setExcuseDate(session.date || new Date().toISOString().split('T')[0]);
                                setShowExcuseModal(true);
                              }}
                              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition cursor-pointer shadow-sm"
                            >
                              Submit Excuse
                            </button>
                          )}
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

      {/* ── MODAL: SUBMIT ABSENCE EXCUSE NOTE ── */}
      {showExcuseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-400" />
                <span>Submit Absence Excuse Note</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowExcuseModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {excuseSuccessMsg && (
              <p className="text-xs text-emerald-300 bg-emerald-950/80 p-3 rounded-xl border border-emerald-600">
                {excuseSuccessMsg}
              </p>
            )}

            <form onSubmit={handleSubmitAbsenceExcuse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Date of Missed Event *</label>
                <input
                  type="date"
                  required
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reason for Absence *</label>
                <select
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Illness">🤒 Illness / Medical Appointment</option>
                  <option value="Family Travel">✈️ Family Travel / Emergency</option>
                  <option value="School Conflict">📚 School / Academic Exam</option>
                  <option value="Religious Event">🕌 Religious / Community Event</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Explanation / Notes for Leader</label>
                <textarea
                  rows={3}
                  placeholder="Provide context for the unit leader / Scoutmaster..."
                  value={excuseNotes}
                  onChange={(e) => setExcuseNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={excuseSubmitting}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{excuseSubmitting ? 'Submitting...' : 'Submit Excuse Note'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowExcuseModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: SERVICE & VOLUNTEERING ── */}
      {activeProfileTab === 'service' && isScout && (
        <ServiceLogs currentUser={currentUser} scoutId={currentUser.uid} />
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
                {isParent ? (
                  <>
                    <Users size={16} className="text-indigo-400" />
                    <span>Family Guardian Information</span>
                  </>
                ) : isLeader ? (
                  <>
                    <Shield size={16} className="text-emerald-400" />
                    <span>Leader Credentials & Profile</span>
                  </>
                ) : isExecutive ? (
                  <>
                    <Crown size={16} className="text-amber-400" />
                    <span>Executive Profile & Administration</span>
                  </>
                ) : (
                  <>
                    <User size={16} className="text-emerald-400" />
                    <span>Scout Personal Information</span>
                  </>
                )}
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Username Field with Owner-Only Enforcement */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`block text-xs font-semibold uppercase flex items-center gap-1.5 ${isOwner ? 'text-amber-300' : 'text-slate-400'}`}>
                          {isOwner ? <Crown size={12} className="text-amber-400" /> : <Lock size={12} className="text-slate-500" />}
                          <span>Username</span>
                        </label>
                        <span className={`text-[9px] px-2 py-0.2 rounded font-bold uppercase ${
                          isOwner 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {isOwner ? '👑 Owner Editable' : '🔒 Locked'}
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        disabled={!isOwner}
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                        className={`w-full rounded-xl px-4 py-2 text-xs font-mono transition ${
                          isOwner 
                            ? 'bg-slate-900 border-2 border-amber-500/60 focus:border-amber-400 text-amber-200 focus:outline-none' 
                            : 'bg-slate-950/60 border border-slate-800 text-slate-400 cursor-not-allowed select-none'
                        }`}
                        placeholder="username"
                      />
                      <p className={`text-[10px] mt-1 ${isOwner ? 'text-amber-400/80 font-medium' : 'text-slate-500'}`}>
                        {isOwner 
                          ? '👑 Owner Privilege: You can edit this username.' 
                          : '🔒 Locked: Only Troop Owner can modify usernames.'
                        }
                      </p>
                    </div>

                    {/* Official Leader Position (Leader / Executive Only) */}
                    {(isLeader || isExecutive) && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                          <Briefcase size={12} className="text-emerald-400" />
                          <span>Official Leadership Position</span>
                        </label>
                        <select
                          value={leaderPosition}
                          onChange={(e) => setLeaderPosition(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {ADULT_LEADER_POSITIONS.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Current Scouting Position (Scout Only) */}
                    {isScout && (
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 uppercase mb-1 flex items-center gap-1.5">
                          <Crown size={12} className="text-amber-400" />
                          <span>Current Scouting Position</span>
                        </label>
                        <select
                          value={scoutPosition}
                          onChange={(e) => setScoutPosition(e.target.value)}
                          className="w-full bg-slate-900 border-2 border-amber-500/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          {SCOUT_YOUTH_POSITIONS.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* BSA Member ID (Scout or Adult Leader) */}
                    {isScout && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">BSA Member ID</label>
                        <input
                          type="text"
                          disabled={!isOwner}
                          value={bsaId}
                          onChange={(e) => setBsaId(e.target.value)}
                          placeholder="e.g. 13894210"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                      </div>
                    )}

                    {(isLeader || isExecutive) && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                          <Award size={12} className="text-emerald-400" />
                          <span>Adult BSA Member ID</span>
                        </label>
                        <input
                          type="text"
                          value={bsaId}
                          onChange={(e) => setBsaId(e.target.value)}
                          placeholder="e.g. 13894210"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    {/* School Grade Level (Scout Only) */}
                    {isScout && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                          <GraduationCap size={12} className="text-sky-400" />
                          <span>School Grade Level</span>
                        </label>
                        <input
                          type="text"
                          value={schoolGrade}
                          onChange={(e) => setSchoolGrade(e.target.value)}
                          placeholder="e.g. 8th Grade, High School"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Mail size={12} /> {isScout ? 'Scout Email' : isParent ? 'Guardian Email' : 'Contact Email'}
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
                        <Phone size={12} /> {isScout ? 'Scout Phone' : isParent ? 'Guardian Phone' : 'Contact Phone'}
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
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> City, State, Zip</span>
                        {isScout && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 font-normal lowercase bg-sky-950/60 border border-sky-800/60 px-1.5 py-0.5 rounded-full">
                            <Lock size={9} /> Parent-Managed
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={cityStateZip}
                        onChange={(e) => setCityStateZip(e.target.value)}
                        placeholder="Dearborn, MI 48126"
                        disabled={isScout}
                        className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 ${isScout ? 'opacity-80 cursor-not-allowed bg-slate-950 border-slate-800' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center justify-between gap-1">
                      <span className="flex items-center gap-1"><MapPin size={12} /> Street Address</span>
                      {isScout && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 font-normal lowercase bg-sky-950/60 border border-sky-800/60 px-1.5 py-0.5 rounded-full">
                          <Lock size={9} /> Parent-Managed
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      placeholder="e.g. 123 Scouting Way"
                      disabled={isScout}
                      className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 ${isScout ? 'opacity-80 cursor-not-allowed bg-slate-950 border-slate-800' : ''}`}
                    />
                  </div>

                  {/* 📜 Previous Positions / Leadership History Manager (For Scouts) */}
                  {isScout && (
                    <div className="pt-3 border-t border-slate-700/60 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>📜</span> Previous Scouting Positions (Leadership History)
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Log past youth leadership positions held in the troop (terms, patrol, or roles).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviousPositions([
                              ...previousPositions,
                              {
                                id: `prev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                                position: 'Assistant Patrol Leader (APL)',
                                term: '',
                                notes: ''
                              }
                            ]);
                          }}
                          className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer self-start sm:self-auto shrink-0"
                        >
                          <Plus size={13} />
                          <span>Add Previous Position</span>
                        </button>
                      </div>

                      {previousPositions.length === 0 ? (
                        <p className="text-xs text-slate-500 italic p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                          No previous scouting positions recorded yet. Click &quot;Add Previous Position&quot; to log past leadership roles.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {previousPositions.map((item, idx) => (
                            <div key={item.id || idx} className="bg-slate-950/80 border border-slate-750 p-3 rounded-xl space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                                  Past Position #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviousPositions(previousPositions.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/40 transition cursor-pointer"
                                  title="Remove this position"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Position Held</label>
                                  <select
                                    value={item.position || 'General Scout / Member'}
                                    onChange={(e) => {
                                      const next = [...previousPositions];
                                      next[idx] = { ...next[idx], position: e.target.value };
                                      setPreviousPositions(next);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                                  >
                                    {SCOUT_YOUTH_POSITIONS.map(p => (
                                      <option key={p} value={p}>{p}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Term / Year</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 2024–2025"
                                    value={item.term || ''}
                                    onChange={(e) => {
                                      const next = [...previousPositions];
                                      next[idx] = { ...next[idx], term: e.target.value };
                                      setPreviousPositions(next);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Patrol / Notes</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Falcon Patrol (6 mos)"
                                    value={item.notes || ''}
                                    onChange={(e) => {
                                      const next = [...previousPositions];
                                      next[idx] = { ...next[idx], notes: e.target.value };
                                      setPreviousPositions(next);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 📜 Previous Leadership Roles Manager (For Adult Leaders & Executives) */}
                  {(isLeader || isExecutive) && (
                    <div className="pt-3 border-t border-slate-700/60 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>📜</span> Previous Leadership Roles (Leadership History)
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Record previous adult leadership positions held in the troop or district.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviousPositions([
                              ...previousPositions,
                              {
                                id: `prev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                                position: 'Assistant Scoutmaster',
                                term: '',
                                notes: ''
                              }
                            ]);
                          }}
                          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer self-start sm:self-auto shrink-0"
                        >
                          <Plus size={13} />
                          <span>Add Previous Role</span>
                        </button>
                      </div>

                      {previousPositions.length === 0 ? (
                        <p className="text-xs text-slate-500 italic p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                          No previous leadership roles recorded yet. Click &quot;Add Previous Role&quot; to log past terms.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {previousPositions.map((item, idx) => (
                            <div key={item.id || idx} className="bg-slate-950/80 border border-slate-750 p-3 rounded-xl space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold">
                                  Past Role #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviousPositions(previousPositions.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/40 transition cursor-pointer"
                                  title="Remove this role"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Role Held</label>
                                  <select
                                    value={item.position || 'Assistant Scoutmaster'}
                                    onChange={(e) => {
                                      const next = [...previousPositions];
                                      next[idx] = { ...next[idx], position: e.target.value };
                                      setPreviousPositions(next);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                                  >
                                    {ADULT_LEADER_POSITIONS.map(p => (
                                      <option key={p} value={p}>{p}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Term / Duration</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 2022–2024"
                                    value={item.term || ''}
                                    onChange={(e) => {
                                      const next = [...previousPositions];
                                      next[idx] = { ...next[idx], term: e.target.value };
                                      setPreviousPositions(next);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department / Notes</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Unit Advisor / Committee"
                                    value={item.notes || ''}
                                    onChange={(e) => {
                                      const next = [...previousPositions];
                                      next[idx] = { ...next[idx], notes: e.target.value };
                                      setPreviousPositions(next);
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── FAMILY & EMERGENCY CONTACTS SECTION (FOR SCOUTS) ── */}
                  {isScout && (
                    <div className="pt-3 border-t border-slate-700/60 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Users size={14} /> Family & Emergency Contacts
                        </h4>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-[11px] font-semibold text-sky-300 w-fit">
                          <Lock size={11} /> Managed by Parent Account
                        </span>
                      </div>

                      <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-xl flex items-start gap-2.5 text-xs text-sky-200">
                        <ShieldCheck size={16} className="text-sky-400 mt-0.5 shrink-0" />
                        <p className="leading-relaxed">
                          Dual-parent household contact information and emergency contacts are centrally managed by your parent in the <strong className="text-white font-semibold">Parent Portal</strong> and automatically synchronized to your scout records.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Parent 1 */}
                        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {parent1Relation || 'Parent 1 / Guardian'}
                            </span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                              Primary Contact
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {parent1Name || <span className="text-slate-500 italic text-xs">Not recorded</span>}
                          </div>
                          <div className="pt-1.5 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <Mail size={12} className="text-slate-500 shrink-0" />
                              <span className="truncate">{parentEmail || <span className="text-slate-500 italic">No email</span>}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={12} className="text-slate-500 shrink-0" />
                              <span>{parentPhone || <span className="text-slate-500 italic">No phone</span>}</span>
                            </div>
                          </div>
                        </div>

                        {/* Parent 2 */}
                        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {parent2Relation || 'Parent 2 / Guardian'}
                            </span>
                            <span className="text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full font-medium">
                              Secondary Contact
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {parent2Name || <span className="text-slate-500 italic text-xs">Not recorded</span>}
                          </div>
                          <div className="pt-1.5 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <Mail size={12} className="text-slate-500 shrink-0" />
                              <span className="truncate">{fullUserData?.parent2Email || <span className="text-slate-500 italic">No email</span>}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={12} className="text-slate-500 shrink-0" />
                              <span>{fullUserData?.parent2Phone || <span className="text-slate-500 italic">No phone</span>}</span>
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="sm:col-span-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <AlertCircle size={12} /> Emergency Contact
                            </span>
                            {emergencyContactRelation && (
                              <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                                {emergencyContactRelation}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {emergencyContactName || <span className="text-slate-500 italic text-xs">No emergency contact specified</span>}
                          </div>
                          <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                            <Phone size={12} className="text-amber-500 shrink-0" />
                            <span>{emergencyContactPhone || <span className="text-slate-500 italic">No emergency phone</span>}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── PARENT LINKED CHILDREN SECTION (FOR PARENTS) ── */}
                  {isParent && (
                    <div className="pt-3 border-t border-slate-700/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Users size={14} /> My Linked Scout Children ({parentLinkedScouts.length})
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          Managed by Troop Admin
                        </span>
                      </div>

                      {parentLinkedScouts.length === 0 ? (
                        <div className="bg-slate-950/60 p-4 rounded-2xl border border-dashed border-slate-750 text-center space-y-1">
                          <p className="text-xs text-slate-400">No scouts currently linked to this guardian account.</p>
                          <p className="text-[10px] text-slate-500">Please reach out to your Troop Leader or Administrator to connect your children's profiles.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {parentLinkedScouts.map((scout) => (
                            <div 
                              key={scout.uid}
                              className="bg-slate-950/70 p-3.5 rounded-2xl border border-indigo-500/30 flex items-center justify-between gap-3 shadow-md"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
                                  {scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-white truncate">{scout.fullName || '@' + scout.username}</h5>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                    <span className="text-emerald-400 font-semibold">{scout.rank || 'Scout'}</span>
                                    {scout.schoolGrade && <span>&bull; {scout.schoolGrade}</span>}
                                  </div>
                                </div>
                              </div>
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                Active Scout
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-750 mt-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Secondary Emergency Contact</label>
                          <input
                            type="text"
                            value={emergencyContactName}
                            onChange={(e) => setEmergencyContactName(e.target.value)}
                            placeholder="e.g. Uncle / Aunt Name"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Emergency Phone</label>
                          <input
                            type="tel"
                            value={emergencyContactPhone}
                            onChange={(e) => setEmergencyContactPhone(e.target.value)}
                            placeholder="+1234567890"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── EMERGENCY CONTACTS FOR LEADERS & EXECUTIVES ── */}
                  {(isLeader || isExecutive) && (
                    <div className="pt-3 border-t border-slate-700/60 space-y-3">
                      <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone size={14} /> Emergency Contact Details
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-750">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Emergency Contact Name</label>
                          <input
                            type="text"
                            value={emergencyContactName}
                            onChange={(e) => setEmergencyContactName(e.target.value)}
                            placeholder="e.g. Spouse / Sibling Name"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Relationship</label>
                          <input
                            type="text"
                            value={emergencyContactRelation}
                            onChange={(e) => setEmergencyContactRelation(e.target.value)}
                            placeholder="e.g. Spouse, Brother"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Emergency Phone</label>
                          <input
                            type="tel"
                            value={emergencyContactPhone}
                            onChange={(e) => setEmergencyContactPhone(e.target.value)}
                            placeholder="+1234567890"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── HEALTH & MEDICAL NOTES SECTION ── */}
                  <div className="pt-3 border-t border-slate-700/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse size={14} /> Health, Allergies & Dietary Restrictions
                      </h4>
                      {isScout ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-semibold text-red-300 w-fit">
                          <Lock size={11} /> Managed by Parent Account
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          For Campouts & Troop Catering
                        </span>
                      )}
                    </div>

                    {isScout ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
                          <ShieldCheck size={16} className="text-red-400 mt-0.5 shrink-0" />
                          <p className="leading-relaxed">
                            Confidential health, allergies, and dietary profiles are locked for safety and maintained exclusively by parents and troop health officers in the <strong className="text-white font-semibold">Parent Portal</strong>.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                            <label className="block text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1.5">
                              Allergies & Medical Alerts
                            </label>
                            <p className="text-xs text-white bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 min-h-[50px] leading-relaxed">
                              {allergies || <span className="text-slate-500 italic">None reported</span>}
                            </p>
                          </div>

                          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                            <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                              Dietary Restrictions
                            </label>
                            <p className="text-xs text-white bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 min-h-[50px] leading-relaxed">
                              {dietaryRestrictions || <span className="text-slate-500 italic">None reported (Standard Troop Catering)</span>}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                          <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                            Confidential Medical & Health Notes
                          </label>
                          <p className="text-xs text-white bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 min-h-[50px] leading-relaxed">
                            {medicalNotes || <span className="text-slate-500 italic">No confidential medical notes filed by parent.</span>}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Allergies & Medical Alerts</label>
                            <textarea
                              rows={2}
                              value={allergies}
                              onChange={(e) => setAllergies(e.target.value)}
                              placeholder="e.g. Peanuts, Bee stings, Inhaler required..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Dietary Restrictions</label>
                            <textarea
                              rows={2}
                              value={dietaryRestrictions}
                              onChange={(e) => setDietaryRestrictions(e.target.value)}
                              placeholder="e.g. Strictly Zabiha Halal, Gluten-free, Vegetarian..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Confidential Medical & Health Notes</label>
                          <textarea
                            rows={2}
                            value={medicalNotes}
                            onChange={(e) => setMedicalNotes(e.target.value)}
                            placeholder="Confidential health notes visible only to Troop Leadership and Medical First Aiders..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
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
                        <label className="block text-xs font-bold text-white uppercase tracking-wider">
                          {isLeader || isExecutive ? 'Leadership Bio & Background' : isParent ? 'Family Bio & Notes' : 'About Me'}
                        </label>
                        <p className="text-[11px] text-slate-400">
                          {isLeader || isExecutive 
                            ? 'Share your scouting experience, certifications, and leadership background.' 
                            : isParent 
                            ? 'Share notes about your family, availability to chaperone, and volunteer interests.' 
                            : 'Share facts about yourself, your hobbies, interests, and scouting goals.'}
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={isLeader || isExecutive 
                        ? 'Write about your scouting history, wood badge status, professional skills, or leadership philosophy...' 
                        : isParent 
                        ? 'Write about your family, camping experience, volunteer interests, or general notes...' 
                        : 'Write something about yourself, your interests, hobbies, goals in scouting, or a personal intro...'}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>
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

            {/* Troop Affiliation & Standing Card (Role-Specific) */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
                <Shield size={16} className="text-emerald-400" /> Troop Standing
              </h3>
              
              <div className="space-y-3 text-xs">
                {/* Scout Standing */}
                {isScout && (
                  <>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Patrol</span>
                      <strong className="text-white text-sm">{patrolName} Patrol</strong>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Rank</span>
                      <strong className="text-emerald-400 text-sm">{rankName}</strong>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Scouting Position</span>
                      <strong className="text-amber-300 text-sm flex items-center gap-1.5 mt-0.5">
                        <Crown size={13} className="text-amber-400 shrink-0" />
                        <span>{scoutPosition || 'General Scout / Member'}</span>
                      </strong>
                    </div>

                    {previousPositions.length > 0 && (
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750 space-y-1.5">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">📜 Past Scouting Roles ({previousPositions.length})</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {previousPositions.map((p, idx) => (
                            <span key={p.id || idx} className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded-lg">
                              <strong>{p.position}</strong> {p.term ? `(${p.term})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attendance Summary Tile */}
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
                  </>
                )}

                {/* Leader Standing */}
                {isLeader && (
                  <>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Leadership Role</span>
                      <strong className="text-white text-sm">{leaderPosition || 'Troop Leader'}</strong>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Patrol Assignment</span>
                      <strong className="text-emerald-400 text-sm">{patrolName ? `${patrolName} Patrol` : 'General Leadership'}</strong>
                    </div>

                    {previousPositions.length > 0 && (
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750 space-y-1.5">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">📜 Past Leadership Roles ({previousPositions.length})</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {previousPositions.map((p, idx) => (
                            <span key={p.id || idx} className="bg-slate-800 text-emerald-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded-lg">
                              <strong>{p.position}</strong> {p.term ? `(${p.term})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div 
                      onClick={() => setActiveProfileTab('spt')}
                      className={`p-3.5 rounded-xl border transition cursor-pointer group space-y-1.5 ${
                        spt 
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500' 
                          : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Safety Compliance (SPT)</span>
                        <ChevronRight size={13} className="text-slate-500 group-hover:text-white transition" />
                      </div>
                      <strong className={`text-xs font-bold block ${spt ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {spt ? `✓ Verified: ${spt}` : '⚠️ SPT Status: Action Required'}
                      </strong>
                      <span className="text-[10px] text-slate-400 block">Click to upload or review certificate</span>
                    </div>
                  </>
                )}

                {/* Parent Standing */}
                {isParent && (
                  <>
                    <div className="bg-slate-900/70 p-4 rounded-xl border border-indigo-500/40 space-y-2">
                      <span className="text-[10px] text-indigo-400 uppercase font-bold block flex items-center gap-1">
                        <Users size={12} /> Linked Children ({parentLinkedScouts.length})
                      </span>
                      {parentLinkedScouts.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No scout children linked yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {parentLinkedScouts.map(scout => (
                            <div key={scout.uid} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{scout.fullName || scout.username}</span>
                              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                {scout.rank || 'Scout'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div 
                      onClick={() => setActiveProfileTab('spt')}
                      className={`p-3.5 rounded-xl border transition cursor-pointer group space-y-1.5 ${
                        spt 
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500' 
                          : 'bg-slate-900/60 border-slate-750 hover:border-indigo-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Volunteer Training (SPT)</span>
                        <ChevronRight size={13} className="text-slate-500 group-hover:text-white transition" />
                      </div>
                      <strong className={`text-xs font-bold block ${spt ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {spt ? `✓ Chaperone Verified: ${spt}` : '🛡️ Optional for Campouts'}
                      </strong>
                      <span className="text-[10px] text-slate-400 block">Click to upload volunteer certificate</span>
                    </div>
                  </>
                )}

                {/* Executive / Owner Standing */}
                {isExecutive && (
                  <>
                    <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 p-3.5 rounded-xl border border-amber-500/40 space-y-1">
                      <span className="text-amber-400 block text-[10px] uppercase font-black tracking-wider">Supreme Authority</span>
                      <strong className="text-white text-xs block">{isOwner ? '👑 Troop Owner & Superadmin' : '⚜️ Executive Troop Admin'}</strong>
                      <span className="text-[10px] text-slate-400">Full system override privileges enabled</span>
                    </div>

                    <div 
                      onClick={() => setActiveProfileTab('spt')}
                      className={`p-3.5 rounded-xl border transition cursor-pointer group space-y-1.5 ${
                        spt 
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500' 
                          : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Safety Compliance (SPT)</span>
                        <ChevronRight size={13} className="text-slate-500 group-hover:text-white transition" />
                      </div>
                      <strong className={`text-xs font-bold block ${spt ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {spt ? `✓ Verified: ${spt}` : '⚠️ SPT Status: Action Required'}
                      </strong>
                      <span className="text-[10px] text-slate-400 block">Click to manage certificate</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SPT CERTIFICATE (FOR LEADERS, EXECUTIVES, OWNERS, AND PARENTS) ── */}
      {activeProfileTab === 'spt' && !isScout && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 max-w-2xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-700/60 pb-3">
            <Shield size={16} className="text-emerald-400" /> 
            <span>{isParent ? 'Safety Protection Training (SPT - Volunteer)' : 'Safety/Protection Training (SPT) Compliance'}</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-750 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  {isParent ? 'Volunteer Safety Standing' : 'Mandatory Safety Compliance'}
                </span>
                <span className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${spt ? 'text-emerald-400' : isParent ? 'text-slate-300' : 'text-amber-400'}`}>
                  {spt ? `✓ Safety Protection Training (SPT) Valid: ${spt}` : isParent ? 'ℹ️ SPT Status: Optional (Recommended for Chaperones)' : '⚠️ SPT Status: Action Required'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                spt 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' 
                  : isParent
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-amber-950 text-amber-300 border-amber-700/60'
              }`}>
                {spt ? (isParent ? 'Verified Chaperone' : 'Verified Leader') : isParent ? 'Optional' : 'Action Required'}
              </span>
            </div>

            {isParent && (
              <p className="text-xs text-slate-300 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/30 leading-relaxed">
                Parents volunteering to chaperone overnight campouts, participate in high-adventure activities, or transport youth scouts are encouraged to complete BSA Youth Safety/Protection Training and submit their certificate here.
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                SPT Training Completion Date
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="date"
                  value={spt}
                  onChange={(e) => setSpt(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleSaveSptDirectly}
                  disabled={savingSpt}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 shrink-0"
                >
                  <CheckCircle2 size={14} />
                  <span>{savingSpt ? 'Saving...' : 'Save SPT Date'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Updates your official compliance record instantly across all troop rosters.</p>
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

      {/* ── TAB: OFFICIAL PROGRESS REPORTS ── */}
      {activeProfileTab === 'reports' && isScout && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <FileText size={18} className="text-emerald-400" />
                  <span>Official Scout Progress Reports & Certified Snapshots</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Official progress records certified by troop leaders for parent conferences and Court of Honor advancement milestones.
                </p>
              </div>
              <span className="text-xs bg-slate-900 border border-slate-700 text-emerald-300 font-mono font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
                {publishedReports.length} Certified Record{publishedReports.length === 1 ? '' : 's'}
              </span>
            </div>

            {scoutSignSuccessToast && (
              <div className="p-3 bg-emerald-950 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs flex items-center gap-2 font-bold animate-fadeIn shadow-md">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{scoutSignSuccessToast}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {publishedReports.length === 0 ? (
              <div className="bg-slate-800 border border-slate-700 p-12 rounded-2xl text-center space-y-3">
                <FileText size={42} className="mx-auto text-slate-500 opacity-50" />
                <h4 className="text-sm font-bold text-white">No Published Progress Reports Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your Troop Leaders will publish official certified progress report snapshots here prior to your advancement reviews, parent conferences, and Courts of Honor.
                </p>
              </div>
            ) : (
              publishedReports.map(report => {
                const isScoutSigned = report.signatures?.scout?.signed;
                const isParentSigned = report.signatures?.parent?.signed;
                const snapshot = report.reportSnapshot || {};

                return (
                  <div
                    key={report.id}
                    className={`bg-slate-800 border p-6 rounded-2xl space-y-4 shadow-xl transition ${
                      !isScoutSigned ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] bg-slate-900 border border-slate-700 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                            {snapshot.rank || 'Scout'} Rank Snapshot
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            📅 Published {report.publishedAt?.split('T')[0]}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-white text-base">
                          Official Progress Report for {report.scoutName}
                        </h4>

                        <p className="text-xs text-slate-400">
                          Certifying Leader: <strong className="text-slate-200">{report.leaderName}</strong> &bull; Patrol: <strong className="text-slate-200">{report.patrolName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                        {!isScoutSigned && (
                          <button
                            type="button"
                            onClick={() => setSigningPublishedReport(report)}
                            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-950/40 animate-pulse"
                          >
                            <PenTool size={14} />
                            <span>Sign as Scout Candidate</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setViewingPublishedReport(report)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <FileText size={14} />
                          <span>{isScoutSigned ? 'View & Print Signed PDF' : 'Inspect Snapshot'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Summary Metrics & Signature Status Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/80 text-center">
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Rank Progress</span>
                        <strong className="text-emerald-400 font-mono text-sm">{snapshot.rankProgress || 0}%</strong>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance</span>
                        <strong className="text-sky-400 font-mono text-sm">{snapshot.attendanceRate || 100}%</strong>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Parent Review</span>
                        {isParentSigned ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                            <ShieldCheck size={13} /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                            <Clock size={13} /> Awaiting Parent
                          </span>
                        )}
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Signature</span>
                        {isScoutSigned ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                            <ShieldCheck size={13} /> Certified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                            <PenTool size={13} /> Sign Needed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── PUBLISHED REPORT VIEWER & SIGNING MODALS ── */}
      {viewingPublishedReport && (
        <PublishedReportViewerModal
          isOpen={!!viewingPublishedReport}
          onClose={() => setViewingPublishedReport(null)}
          report={viewingPublishedReport}
          currentUser={currentUser}
        />
      )}

      {signingPublishedReport && (
        <SignaturePadModal
          isOpen={!!signingPublishedReport}
          onClose={() => setSigningPublishedReport(null)}
          onSave={handleSaveScoutSignature}
          isSubmitting={isSubmittingScoutSignature}
          signerType="scout"
          defaultSignerName={fullName || currentUser?.fullName || currentUser?.username || 'Scout Candidate'}
          defaultSignerRole="Scout Candidate"
          title="Scout Candidate Digital Signature"
          subtitle={`Certify and sign your official progress report for ${signingPublishedReport.reportSnapshot?.rank || rankName} rank`}
        />
      )}

    </div>
  );
}
