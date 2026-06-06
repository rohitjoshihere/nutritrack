import { useEffect, useState } from 'react';
import { dietAPI } from '../../api';
import toast from 'react-hot-toast';

const emptyMeal = (time) => ({ name: '', items: [], time, calories: 0 });

export default function DietPlans() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', dietType: 'veg', remindersEnabled: false,
    breakfast: emptyMeal('08:00'), lunch: emptyMeal('13:00'),
    eveningSnacks: emptyMeal('17:00'), dinner: emptyMeal('20:00'),
  });

  const load = () => dietAPI.list().then(({ data }) => setPlans(data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dietAPI.create(form);
      toast.success('Diet plan created!');
      setShowForm(false);
      load();
    } catch { toast.error('Failed to create plan'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    await dietAPI.remove(id);
    load();
    toast.success('Deleted');
  };

  const updateMeal = (mealKey, field, value) => {
    setForm({ ...form, [mealKey]: { ...form[mealKey], [field]: value } });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Diet Planner</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">{showForm ? 'Cancel' : '+ New Plan'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Plan title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="input-field" value={form.dietType} onChange={(e) => setForm({ ...form, dietType: e.target.value })}>
              <option value="veg">Vegetarian</option><option value="non_veg">Non-Veg</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.remindersEnabled} onChange={(e) => setForm({ ...form, remindersEnabled: e.target.checked })} /> Enable daily meal reminders</label>
          {['breakfast', 'lunch', 'eveningSnacks', 'dinner'].map((meal) => (
            <div key={meal} className="border border-slate-100 rounded-lg p-4">
              <h3 className="font-medium capitalize mb-2">{meal.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="grid sm:grid-cols-3 gap-2">
                <input className="input-field" placeholder="Meal name" value={form[meal].name} onChange={(e) => updateMeal(meal, 'name', e.target.value)} />
                <input className="input-field" type="time" value={form[meal].time} onChange={(e) => updateMeal(meal, 'time', e.target.value)} />
                <input className="input-field" placeholder="Items (comma separated)" onChange={(e) => updateMeal(meal, 'items', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
            </div>
          ))}
          <button type="submit" className="btn-primary">Save Diet Plan</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{plan.title}</h3>
                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded capitalize">{plan.dietType.replace('_', ' ')}</span>
                {plan.remindersEnabled && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded ml-1">🔔 Reminders</span>}
              </div>
              <button onClick={() => handleDelete(plan._id)} className="text-red-500 text-sm hover:underline">Delete</button>
            </div>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              {['breakfast', 'lunch', 'eveningSnacks', 'dinner'].map((m) => plan[m]?.name && (
                <p key={m}><span className="font-medium capitalize">{m.replace(/([A-Z])/g, ' $1')}:</span> {plan[m].name} @ {plan[m].time}</p>
              ))}
            </div>
          </div>
        ))}
        {plans.length === 0 && <p className="text-slate-500 col-span-2">No diet plans yet. Create one above!</p>}
      </div>
    </div>
  );
}
