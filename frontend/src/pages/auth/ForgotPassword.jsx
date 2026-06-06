import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      setSent(true);
      if (data.resetUrl) toast.success('Check console/dev for reset link');
      else toast.success('Reset link sent if email exists');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-slate-100">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-bold text-slate-800 mb-2">Forgot Password</h1>
        {sent ? (
          <p className="text-slate-600 text-sm">If an account exists for {email}, you will receive reset instructions.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input type="email" className="input-field" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="btn-primary w-full" disabled={loading}>Send Reset Link</button>
          </form>
        )}
        <Link to="/login" className="block text-center text-sm text-primary-600 mt-4 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
}
