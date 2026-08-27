import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { CheckCircle2, Circle, Trophy, ListChecks, Award } from 'lucide-react';

export default function ProgressDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'remaining', 'completed'

  useEffect(() => {
    // 1. Listen to all patrol requirements
    const unsubscribeTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
    });

    // 2. Listen to this specific user's completions
    const unsubscribeProgress = onSnapshot(collection(db, `users/${user.uid}/progress`), (snapshot) => {
      const progressMap = {};
      snapshot.docs.forEach(doc => {
        progressMap[doc.id] = doc.data();
      });
      setUserProgress(progressMap);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeProgress();
    };
  }, [user.uid]);

  const toggleTaskStatus = async (task) => {
    const isCompleted = !!userProgress[task.id];
    const progressRef = doc(db, `users/${user.uid}/progress`, task.id);

    try {
      if (isCompleted) {
        await deleteDoc(progressRef);
      } else {
        await setDoc(progressRef, {
          taskId: task.id,
          title: task.title,
          category: task.category || 'General',
          completedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const totalTasks = tasks.length;
  const completedCount = Object.keys(userProgress).length;
  const remainingCount = Math.max(0, totalTasks - completedCount);
  const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter(task => {
    const isDone = !!userProgress[task.id];
    if (filter === 'remaining') return !isDone;
    if (filter === 'completed') return isDone;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Progress Summary Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-emerald-400" size={24} />
              Rank & Skill Progress
            </h2>
            <p className="text-sm text-slate-400">Keep completing your patrol requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">{percentage}%</span>
              <p className="text-xs text-slate-400">{completedCount} of {totalTasks} done</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-900/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Completed</p>
              <p className="text-lg font-bold text-white">{completedCount}</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <ListChecks size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Remaining Left</p>
              <p className="text-lg font-bold text-white">{remainingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex gap-2">
        {['all', 'remaining', 'completed'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
              filter === type
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {type === 'all' ? `All (${totalTasks})` : type === 'remaining' ? `What's Left (${remainingCount})` : `Completed (${completedCount})`}
          </button>
        ))}
      </div>

      {/* Requirement List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center text-slate-400">
            {filter === 'remaining' ? '🎉 Great job! You have completed all assigned tasks.' : 'No requirements found.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = !!userProgress[task.id];
            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition cursor-pointer select-none ${
                  isDone
                    ? 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                    : 'bg-slate-800 border-slate-700 text-white hover:border-emerald-500/50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="text-emerald-400" size={22} />
                  ) : (
                    <Circle className="text-slate-500 hover:text-emerald-400" size={22} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                      {task.category || 'General'}
                    </span>
                  </div>
                  <h4 className={`text-base font-semibold mt-1 ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
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
