import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { nutritionAPI, waterAPI, habitAPI } from '../../api';
import { today } from '../../components/ProtectedRoute';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [water, setWater] = useState({ total: 0 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    nutritionAPI.getLog(today()).then(({ data }) => setSummary(data.summary)).catch(() => {});
    waterAPI.daily(today()).then(({ data }) => setWater(data)).catch(() => {});
    habitAPI.today().then(({ data }) => setStreak(data.streak)).catch(() => {});
  }, []);

  const cards = [
    { title: 'Calories Today', value: summary?.calories || 0, unit: 'kcal', link: '/nutrition', color: 'bg-orange-50 text-orange-700' },
    { title: 'Water Intake', value: water.total || 0, unit: ` / ${user?.profile?.dailyWaterGoal || 2000} ml`, link: '/water', color: 'bg-blue-50 text-blue-700' },
    { title: 'Protein', value: summary?.protein || 0, unit: 'g', link: '/nutrition', color: 'bg-purple-50 text-purple-700' },
    { title: 'Habit Streak', value: streak, unit: ' days', link: '/habits', color: 'bg-green-50 text-green-700' },
  ];

  const quickLinks = [
    { to: '/calculators', label: 'Health Calculators', desc: 'BMI, BMR & Water' },
    { to: '/diet-plans', label: 'Diet Planner', desc: 'Meal plans & reminders' },
    { to: '/recipes', label: 'Recipes', desc: 'Browse & save favorites' },
    { to: '/weight', label: 'Weight Tracker', desc: 'Track your progress' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">Welcome back, {user?.name}! Here's your health overview.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.title} to={c.link} className={`card ${c.color} hover:shadow-md transition`}>
            <p className="text-xs font-medium opacity-80">{c.title}</p>
            <p className="text-2xl font-bold mt-1">{c.value}<span className="text-sm font-normal">{c.unit}</span></p>
          </Link>
        ))}
      </div>

      <h2 className="font-semibold text-slate-800 mb-3">Quick Access</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to} className="card hover:border-primary-200 hover:shadow-md transition">
            <h3 className="font-medium text-slate-800">{q.label}</h3>
            <p className="text-sm text-slate-500 mt-1">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
