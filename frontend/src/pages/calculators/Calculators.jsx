import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculatorAPI } from '../../api';
import toast from 'react-hot-toast';

export default function Calculators() {
  const { user } = useAuth();
  const p = user?.profile || {};
  const [bmiResult, setBmiResult] = useState(null);
  const [bmrResult, setBmrResult] = useState(null);
  const [waterResult, setWaterResult] = useState(null);
  const [form, setForm] = useState({
    height: p.height || '', weight: p.weight || '', age: p.age || '',
    gender: p.gender || 'male', activityLevel: p.activityLevel || 'moderate',
    fitnessGoal: p.fitnessGoal || 'maintenance',
  });

  const calcBMI = async () => {
    try {
      const { data } = await calculatorAPI.bmi({ height: form.height, weight: form.weight });
      setBmiResult(data);
    } catch { toast.error('Enter valid height & weight'); }
  };

  const calcBMR = async () => {
    try {
      const { data } = await calculatorAPI.bmr(form);
      setBmrResult(data);
    } catch { toast.error('Fill all required fields'); }
  };

  const calcWater = async () => {
    try {
      const { data } = await calculatorAPI.water({ weight: form.weight, activityLevel: form.activityLevel });
      setWaterResult(data);
    } catch { toast.error('Enter weight'); }
  };

  const bmiColor = { Underweight: 'text-blue-600', Normal: 'text-green-600', Overweight: 'text-amber-600', Obese: 'text-red-600' };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Health Calculators</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          ['height', 'Height (cm)'], ['weight', 'Weight (kg)'], ['age', 'Age'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="text-sm font-medium text-slate-600">{label}</label>
            <input className="input-field mt-1" type="number" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-slate-600">Gender</label>
          <select className="input-field mt-1" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Activity Level</label>
          <select className="input-field mt-1" value={form.activityLevel} onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}>
            <option value="sedentary">Sedentary</option><option value="light">Light</option>
            <option value="moderate">Moderate</option><option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Fitness Goal</label>
          <select className="input-field mt-1" value={form.fitnessGoal} onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })}>
            <option value="weight_loss">Weight Loss</option><option value="maintenance">Maintenance</option>
            <option value="weight_gain">Weight Gain</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">BMI Calculator</h2>
          <button onClick={calcBMI} className="btn-primary w-full mb-4">Calculate BMI</button>
          {bmiResult && (
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-3xl font-bold">{bmiResult.bmi}</p>
              <p className={`font-medium mt-1 ${bmiColor[bmiResult.category]}`}>{bmiResult.category}</p>
            </div>
          )}
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3">BMR / Calories</h2>
          <button onClick={calcBMR} className="btn-primary w-full mb-4">Calculate BMR</button>
          {bmrResult && (
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">BMR:</span> <strong>{bmrResult.bmr} kcal</strong></p>
              <p><span className="text-slate-500">TDEE:</span> <strong>{bmrResult.tdee} kcal</strong></p>
              <p className="text-primary-700 font-semibold">Daily Target: {bmrResult.dailyCalories} kcal</p>
            </div>
          )}
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3">Water Intake</h2>
          <button onClick={calcWater} className="btn-primary w-full mb-4">Calculate Water</button>
          {waterResult && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-700">{waterResult.recommendedMl}</p>
              <p className="text-sm text-blue-600">ml per day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
