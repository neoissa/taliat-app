import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { HASSAN_LEADERSHIP_PROFILE } from '../data/leaderCredentialsData';
import { syncAnehmeBadges, ANEHME_BADGE_NAMES } from '../utils/anehmeMeritBadges';

export default function Login({ onUserAuthenticated, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const notifySuccess = (profile) => {
    if (typeof onLoginSuccess === 'function') onLoginSuccess(profile);
    if (typeof onUserAuthenticated === 'function') onUserAuthenticated(profile);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanInput = username.trim().toLowerCase();
    const email = cleanInput.includes('@') ? cleanInput : `${cleanInput}@talia.app`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      try {
        await setDoc(doc(db, 'users', user.uid, 'private', 'secrets'), { password }, { merge: true });
      } catch (secretsErr) {
        console.warn("Could not save password secret:", secretsErr);
      }
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        let forcedRole = null;
        let forcedOwner = false;
        const isNeo = user.email === 'neoissa@gmail.com';
        const isHissa = cleanInput === 'hissa' || cleanInput === 'hassan' || user.email === 'hissa@talia.app' || user.email === 'hassan@talia.app';
        const isAnehme = cleanInput === 'anehme' || cleanInput.includes('anehme') || user.email === 'anehme@talia.app';

        if (isNeo) {
          forcedRole = 'owner';
          forcedOwner = true;
          await setDoc(userRef, { 
            role: 'owner', 
            isOwner: true, 
            fullName: 'Neo Issa',
            scoutingLeadership: HASSAN_LEADERSHIP_PROFILE.leadershipPositions,
            scoutingTrainings: HASSAN_LEADERSHIP_PROFILE.trainings,
            meritBadgeCounselorSubjects: HASSAN_LEADERSHIP_PROFILE.meritBadgeCounselorSubjects,
            credentialsValidThrough: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
            spt: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
            sptDate: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
            yptCompleted: true
          }, { merge: true });
        } else if (isHissa) {
          forcedRole = 'leader';
          await setDoc(userRef, { 
            role: 'leader',
            leaderPosition: 'Committee Chair / Troop Leader',
            fullName: 'Hassan Nehme',
            scoutingLeadership: HASSAN_LEADERSHIP_PROFILE.leadershipPositions,
            scoutingTrainings: HASSAN_LEADERSHIP_PROFILE.trainings,
            meritBadgeCounselorSubjects: HASSAN_LEADERSHIP_PROFILE.meritBadgeCounselorSubjects,
            credentialsValidThrough: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
            spt: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
            sptDate: HASSAN_LEADERSHIP_PROFILE.credentialsValidThrough,
            yptCompleted: true
          }, { merge: true });
        }

        if (isAnehme) {
          syncAnehmeBadges(db, user.uid).catch(err => console.warn('Anehme badge sync error:', err));
        }

        if (userDoc.exists()) {
          const data = userDoc.data();
          notifySuccess({
            uid: user.uid,
            email: user.email,
            role: forcedRole || data.role || 'scout',
            isOwner: forcedOwner || data.isOwner || false,
            leaderId: data.leaderId || null,
            leaderPosition: data.leaderPosition || null,
            groupId: data.groupId || data.patrolId || null,
            fullName: data.fullName || (isAnehme ? 'Ali Nehme (Anehme)' : cleanInput.split('@')[0]),
            username: data.username || cleanInput.split('@')[0],
            rank: data.rank || 'First Class',
            meritBadges: isAnehme ? ANEHME_BADGE_NAMES : (data.meritBadges || []),
            linkedScoutIds: data.linkedScoutIds || [],
          });
        } else {
          const newProfile = {
            role: forcedRole || 'scout',
            isOwner: forcedOwner,
            leaderId: null,
            leaderPosition: null,
            groupId: null,
            fullName: isAnehme ? 'Ali Nehme (Anehme)' : cleanInput.split('@')[0],
            username: cleanInput.split('@')[0],
            rank: isAnehme ? 'First Class' : '',
            meritBadges: isAnehme ? ANEHME_BADGE_NAMES : [],
          };
          await setDoc(userRef, newProfile);
          notifySuccess({
            uid: user.uid,
            email: user.email,
            ...newProfile
          });
        }
      } catch (dbErr) {
        console.warn('Firestore fetch failed, logging in with auth profile:', dbErr);
        notifySuccess({
          uid: user.uid,
          email: user.email,
          role: 'scout',
          leaderId: null,
          patrolId: null,
          fullName: user.email,
          username: user.email.split('@')[0],
          rank: '',
          meritBadges: [],
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`[${err.code || 'error'}] ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/70 shadow-xl shadow-amber-950/60 bg-black p-1 mb-3">
            <img 
              src="/app-logo.jpg" 
              alt="Dhulfiqār Scouts" 
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <h2 className="text-2xl font-black text-center text-white tracking-tight">Dhulfiqār Scouts</h2>
          <p className="text-xs text-amber-400/90 font-medium text-center mt-0.5">Taliʿat Abi Al-Fadl Al-Abbas Portal</p>
          <p className="text-xs text-slate-400 text-center mt-1">Log in to track requirements, attendance & patrols</p>
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-950 border border-red-800 rounded-xl text-red-300 text-xs break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Username or Email</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. neoissa@gmail.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Enter Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
