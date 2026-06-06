import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { waterAPI, userAPI } from '../../api';
import { today } from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';

export default function WaterTracker() {
  const { user, refreshUser } = useAuth();
  const goal = user?.profile?.dailyWaterGoal || 2000;
  const [data, setData] = useState({ total: 0, logs: [] });
  const [amount, setAmount] = useState(250);
  const [goalInput, setGoalInput] = useState(goal);

  const load = () => waterAPI.daily(today()).then(({ data }) => setData(data));

  useEffect(() => { load(); }, []);

  const logWater = async () => {
    await waterAPI.log({ amount });
    load();
    toast.success(`Added ${amount}ml`);
  };

  const setGoal = async () => {
    await userAPI.setWaterGoal(Number(goalInput));
    refreshUser();
    toast.success('Goal updated');
  };

  const remove = async (id) => { await waterAPI.remove(id); load(); };

  const pct = Math.min(100, Math.round((data.total / goal) * 100));

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Water Intake Tracker</h1>

      <div className="card mb-6 text-center">
        <p className="text-slate-500 text-sm">Today's Progress</p>
        <p className="text-4xl font-bold text-blue-600 my-2">{data.total} <span className="text-lg text-slate-400">/ {goal} ml</span></p>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-slate-500 mt-2">{pct}% of daily goal</p>
      </div>

      <div className="card mb-6 flex flex-wrap gap-2">
        {[150, 250, 350, 500].map((ml) => (
          <button key={ml} onClick={() => setAmount(ml)} className={`px-4 py-2 rounded-lg text-sm ${amount === ml ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{ml}ml</button>
        ))}
        <button onClick={logWater} className="btn-primary flex-1 min-w-[120px]">Log Water</button>
      </div>

      <div className="card mb-6 flex gap-2">
        <input type="number" className="input-field" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} />
        <button onClick={setGoal} className="btn-secondary whitespace-nowrap">Set Goal</button>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Today's Log</h3>
        {data.logs?.map((l) => (
          <div key={l._id} className="flex justify-between py-2 border-b border-slate-50 text-sm">
            <span>{l.amount}ml at {l.time}</span>
            <button onClick={() => remove(l._id)} className="text-red-500">Remove</button>
          </div>
        ))}
        {!data.logs?.length && <p className="text-slate-500 text-sm">No entries yet</p>}
      </div>
    </div>
  );
}
