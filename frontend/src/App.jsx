import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Calculators from './pages/calculators/Calculators';
import Profile from './pages/profile/Profile';
import DietPlans from './pages/diet/DietPlans';
import Recipes from './pages/recipes/Recipes';
import RecipeDetail from './pages/recipes/RecipeDetail';
import Favorites from './pages/recipes/Favorites';
import NutritionTracker from './pages/nutrition/NutritionTracker';
import WaterTracker from './pages/water/WaterTracker';
import WeightTracker from './pages/weight/WeightTracker';
import HabitTracker from './pages/habits/HabitTracker';
import AdminPanel from './pages/admin/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/diet-plans" element={<DietPlans />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/favorites" element={<Favorites />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/water" element={<WaterTracker />} />
            <Route path="/weight" element={<WeightTracker />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
