import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { weightAPI, userAPI } from '../../api';
import { today } from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightTracker() {
  const { user, refreshUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState(user?.profile?.goalWeight || '');

  const load = () => weightAPI.history().then(({ data }) => setLogs(data));

  useEffect(() => { load(); }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    await weightAPI.add({ weight: Number(weight), date: today() });
    setWeight('');
    load();
    toast.success('Weight logged!');
  };

  const saveGoal = async () => {
    await userAPI.setGoalWeight(Number(goalWeight));
    refreshUser();
    toast.success('Goal weight saved');
  };

  const chartData = [...logs].reverse().slice(-14).map((l) => ({ date: l.date.slice(5), weight: l.weight }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Weight Tracker</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <form onSubmit={addEntry} className="card flex gap-2">
          <input type="number" step="0.1" className="input-field" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          <button type="submit" className="btn-primary whitespace-nowrap">Add</button>
        </form>
        <div className="card flex gap-2">
          <input type="number" step="0.1" className="input-field" placeholder="Goal weight (kg)" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} />
          <button onClick={saveGoal} className="btn-secondary whitespace-nowrap">Set Goal</button>
        </div>
      </div>

      {user?.profile?.goalWeight && (
        <p className="text-sm text-slate-600 mb-4">🎯 Goal: <strong>{user.profile.goalWeight} kg</strong></p>
      )}

      {chartData.length > 0 && (
        <div className="card mb-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={['auto', 'auto']} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold mb-3">History</h3>
        {logs.map((l) => (
          <div key={l._id} className="flex justify-between py-2 border-b border-slate-50 text-sm">
            <span>{l.date}</span><strong>{l.weight} kg</strong>
          </div>
        ))}
        {!logs.length && <p className="text-slate-500 text-sm">No entries yet</p>}
      </div>
    </div>
  );
}
