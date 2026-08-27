import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Knots & Pioneering');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addDoc(collection(db, 'requirements'), {
        title: title.trim(),
        category,
        description: description.trim(),
        completedBy: [],
        createdAt: serverTimestamp()
      });
      setTitle('');
      setDescription('');
      setStatus('Requirement added successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setStatus('Error adding requirement.');
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl mx-auto shadow-xl">
      <h3 className="font-bold text-lg text-white mb-1">Add Scout Requirement</h3>
      <p className="text-xs text-slate-400 mb-6">Create advancement checkpoints for your patrol members.</p>

      {status && (
        <div className="p-3 mb-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold">
          {status}
        </div>
      )}

      <form onSubmit={handleCreateTask} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Requirement Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tie a Clove Hitch & Taut-Line Hitch"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Knots & Pioneering">Knots & Pioneering</option>
            <option value="First Aid">First Aid</option>
            <option value="Navigation & Camping">Navigation & Camping</option>
            <option value="Leadership & Values">Leadership & Values</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Details / Notes</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Demonstrate tying the hitch around a timber spar..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-emerald-900/30"
        >
          Publish Requirement
        </button>
      </form>
    </div>
  );
}
