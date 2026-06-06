import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/calculators', label: 'Calculators', icon: '🧮' },
  { to: '/diet-plans', label: 'Diet Plans', icon: '🥗' },
  { to: '/recipes', label: 'Recipes', icon: '🍳' },
  { to: '/nutrition', label: 'Nutrition', icon: '📝' },
  { to: '/water', label: 'Water', icon: '💧' },
  { to: '/weight', label: 'Weight', icon: '⚖️' },
  { to: '/habits', label: 'Habits', icon: '✅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100">
          <h1 className="text-xl font-bold text-primary-700">🥬 NutriTrack</h1>
          <p className="text-xs text-slate-500 mt-1">Hello, {user?.name}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`
              }
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" onClick={onClose} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`
            }>
              <span>⚙️</span> Admin Panel
            </NavLink>
          )}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full btn-secondary text-sm">Logout</button>
        </div>
      </aside>
    </>
  );
}
