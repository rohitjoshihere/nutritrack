import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.resetPassword(token, password);
      localStorage.setItem('token', data.token);
      toast.success('Password updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" className="input-field" placeholder="New password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <button type="submit" className="btn-primary w-full">Update Password</button>
        </form>
        <Link to="/login" className="block text-center text-sm text-primary-600 mt-4">Back to Login</Link>
      </div>
    </div>
  );
}
