import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function AdvancementTracker({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'requirements'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTask = async (task) => {
    const isCompleted = task.completedBy?.includes(currentUser.uid);
    const taskRef = doc(db, 'requirements', task.id);
    try {
      await updateDoc(taskRef, {
        completedBy: isCompleted ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const completedCount = tasks.filter(t => t.completedBy?.includes(currentUser.uid)).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    const done = t.completedBy?.includes(currentUser.uid);
    if (filter === 'completed') return done;
    if (filter === 'remaining') return !done;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Progress Header Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-white">Patrol Advancement Progress</h3>
          <span className="text-emerald-400 font-bold">{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden mb-4">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">
          Completed {completedCount} of {tasks.length} requirements.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'remaining', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab === 'all' ? 'All Tasks' : tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading requirements...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800">
            No requirements found in this category.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.completedBy?.includes(currentUser.uid);
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task)}
                className={`p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer select-none ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-800/50 text-slate-300'
                    : 'bg-slate-800 border-slate-700 text-white hover:border-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!isDone}
                  readOnly
                  className="mt-1 w-5 h-5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase">
                      {task.category || 'Core'}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-400">{task.description}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
