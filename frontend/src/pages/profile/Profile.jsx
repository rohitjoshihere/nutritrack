import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const p = user?.profile || {};
  const [form, setForm] = useState({
    name: user?.name || '',
    age: p.age || '', gender: p.gender || '', height: p.height || '',
    weight: p.weight || '', activityLevel: p.activityLevel || 'moderate',
    fitnessGoal: p.fitnessGoal || 'maintenance',
    dailyWaterGoal: p.dailyWaterGoal || 2000, goalWeight: p.goalWeight || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        profile: {
          age: Number(form.age), gender: form.gender,
          height: Number(form.height), weight: Number(form.weight),
          activityLevel: form.activityLevel, fitnessGoal: form.fitnessGoal,
          dailyWaterGoal: Number(form.dailyWaterGoal), goalWeight: Number(form.goalWeight) || undefined,
        },
      });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <form onSubmit={handleSave} className="card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Name</label><input className="input-field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label className="text-sm font-medium">Age</label><input type="number" className="input-field mt-1" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Gender</label>
            <select className="input-field mt-1" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select></div>
          <div><label className="text-sm font-medium">Height (cm)</label><input type="number" className="input-field mt-1" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Weight (kg)</label><input type="number" className="input-field mt-1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Goal Weight (kg)</label><input type="number" className="input-field mt-1" value={form.goalWeight} onChange={(e) => setForm({ ...form, goalWeight: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Activity Level</label>
            <select className="input-field mt-1" value={form.activityLevel} onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}>
              <option value="sedentary">Sedentary</option><option value="light">Light</option><option value="moderate">Moderate</option>
              <option value="active">Active</option><option value="very_active">Very Active</option>
            </select></div>
          <div><label className="text-sm font-medium">Fitness Goal</label>
            <select className="input-field mt-1" value={form.fitnessGoal} onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })}>
              <option value="weight_loss">Weight Loss</option><option value="maintenance">Maintenance</option><option value="weight_gain">Weight Gain</option>
            </select></div>
          <div><label className="text-sm font-medium">Daily Water Goal (ml)</label><input type="number" className="input-field mt-1" value={form.dailyWaterGoal} onChange={(e) => setForm({ ...form, dailyWaterGoal: e.target.value })} /></div>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
}
