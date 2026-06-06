import { useEffect, useState } from 'react';
import { nutritionAPI } from '../../api';
import { today } from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';

const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function NutritionTracker() {
  const [log, setLog] = useState(null);
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [food, setFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: '1 serving' });

  const load = () => nutritionAPI.getLog(today()).then(({ data }) => {
    setLog(data.log);
    setSummary(data.summary);
  });

  useEffect(() => { load(); }, []);

  const addFood = async (e) => {
    e.preventDefault();
    try {
      await nutritionAPI.addFood({
        date: today(), mealType: activeMeal,
        food: { ...food, calories: +food.calories, protein: +food.protein, carbs: +food.carbs, fat: +food.fat },
      });
      setFood({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: '1 serving' });
      load();
      toast.success('Food logged!');
    } catch { toast.error('Failed to log food'); }
  };

  const removeFood = async (mealType, index) => {
    await nutritionAPI.removeFood({ date: today(), mealType, index });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nutrition Tracker</h1>

      {/* Daily summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-orange-50"><p className="text-sm text-slate-600">Calories</p><p className="text-2xl font-bold">{Math.round(summary.calories)}kcal</p></div>
        <div className="card bg-purple-50"><p className="text-sm text-slate-600">Protein</p><p className="text-2xl font-bold">{Math.round(summary.protein)}g</p></div>
        <div className="card bg-blue-50"><p className="text-sm text-slate-600">Carbs</p><p className="text-2xl font-bold">{Math.round(summary.carbs)}g</p></div>
        <div className="card bg-amber-50"><p className="text-sm text-slate-600">Fat</p><p className="text-2xl font-bold">{Math.round(summary.fat)}g</p></div>
      </div>

      {/* Meal tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MEALS.map((m) => (
          <button key={m} onClick={() => setActiveMeal(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeMeal === m ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200'}`}>
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={addFood} className="card mb-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input className="input-field sm:col-span-2" placeholder="Food name" value={food.name} onChange={(e) => setFood({ ...food, name: e.target.value })} required />
        <input className="input-field" type="number" placeholder="Calories" value={food.calories} onChange={(e) => setFood({ ...food, calories: e.target.value })} />
        <input className="input-field" type="number" placeholder="Protein (g)" value={food.protein} onChange={(e) => setFood({ ...food, protein: e.target.value })} />
        <input className="input-field" type="number" placeholder="Carbs (g)" value={food.carbs} onChange={(e) => setFood({ ...food, carbs: e.target.value })} />
        <input className="input-field" type="number" placeholder="Fat (g)" value={food.fat} onChange={(e) => setFood({ ...food, fat: e.target.value })} />
        <button type="submit" className="btn-primary sm:col-span-3 lg:col-span-6">Add to {activeMeal}</button>
      </form>

      {MEALS.map((meal) => (
        log?.[meal]?.length > 0 && (
          <div key={meal} className="card mb-4">
            <h3 className="font-semibold capitalize mb-2">{meal}</h3>
            {log[meal].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 text-sm">
                <span>{item.name} — {item.calories} kcal (P:{item.protein}g C:{item.carbs}g F:{item.fat}g)</span>
                <button onClick={() => removeFood(meal, idx)} className="text-red-500 hover:underline">Remove</button>
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  );
}
