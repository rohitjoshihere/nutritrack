import { useEffect, useState } from 'react';
import { habitAPI } from '../../api';
import { today } from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';

const HABITS = [
  { key: 'drinkWater', label: 'Drink Water', icon: '💧' },
  { key: 'exercise', label: 'Exercise', icon: '🏃' },
  { key: 'sleep8Hours', label: 'Sleep 8 Hours', icon: '😴' },
  { key: 'walkDaily', label: 'Walk Daily', icon: '🚶' },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState({});
  const [streak, setStreak] = useState(0);

  const load = () => habitAPI.today().then(({ data }) => {
    setHabits(data.record.habits);
    setStreak(data.streak);
  });

  useEffect(() => { load(); }, []);

  const toggle = async (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    try {
      const { data } = await habitAPI.update({ date: today(), habits: updated });
      setStreak(data.streak);
      toast.success('Habit updated!');
    } catch { load(); }
  };

  const done = HABITS.filter((h) => habits[h.key]).length;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Habit Tracker</h1>
      <p className="text-slate-500 text-sm mb-6">Daily check-ins • {done}/{HABITS.length} completed today</p>

      <div className="card mb-6 text-center bg-gradient-to-r from-primary-50 to-green-50">
        <p className="text-sm text-slate-600">Current Streak</p>
        <p className="text-5xl font-bold text-primary-700">{streak}</p>
        <p className="text-sm text-slate-500">days</p>
      </div>

      <div className="space-y-3">
        {HABITS.map((h) => (
          <button key={h.key} onClick={() => toggle(h.key)}
            className={`w-full card flex items-center gap-4 text-left transition ${habits[h.key] ? 'border-primary-300 bg-primary-50' : 'hover:border-slate-200'}`}>
            <span className="text-2xl">{h.icon}</span>
            <span className="flex-1 font-medium">{h.label}</span>
            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${habits[h.key] ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300'}`}>
              {habits[h.key] && '✓'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
