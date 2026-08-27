import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login({ onUserAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          onUserAuthenticated({
            uid: user.uid,
            email: user.email,
            role: data.role || 'scout',
            leaderId: data.leaderId || null,
            patrolId: data.patrolId || null,
            fullName: data.fullName || cleanInput.split('@')[0],
            username: data.username || cleanInput.split('@')[0],
            rank: data.rank || '',
            meritBadges: data.meritBadges || [],
          });
        } else {
          onUserAuthenticated({
            uid: user.uid,
            email: user.email,
            role: 'leader',
            leaderId: null,
            patrolId: null,
            fullName: cleanInput.split('@')[0],
            username: cleanInput.split('@')[0],
            rank: '',
            meritBadges: [],
          });
        }
      } catch (dbErr) {
        console.warn('Firestore fetch failed, logging in with auth profile:', dbErr);
        onUserAuthenticated({
          uid: user.uid,
          email: user.email,
          role: 'leader',
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
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Taliʿa Portal</h2>
        <p className="text-sm text-slate-400 text-center mb-6">Log in to track requirements and chat</p>
        
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
