import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'citizen') {
        logout();
        toast.error('This is the citizen login. Staff should use the Officer/Admin Portal.');
        return;
      }
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-civic-surface px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-civic-blue flex items-center justify-center mb-3">
            <MapPin size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl">CivicEye</h1>
          <p className="text-sm text-civic-ink mt-1">Report it. Track it. Stay Safe.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-civic-card rounded-2xl shadow-card border border-civic-border p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Log in</h2>

          <div>
            <label htmlFor="login-email" className="text-sm font-semibold mb-1.5 block">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-semibold mb-1.5 block">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            Log in
          </Button>

          <p className="text-center text-sm text-civic-ink">
            New here?{' '}
            <Link to="/register" className="font-semibold text-civic-blue">
              Create an account
            </Link>
          </p>
        </form>

        <Link
          to="/admin/login"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-civic-ink mt-5 hover:text-civic-dark"
        >
          <ShieldCheck size={13} /> Municipal staff? Officer / Admin login →
        </Link>

        <div className="mt-5 bg-blue-50 rounded-xl p-3.5 text-xs text-civic-ink space-y-1">
          <p className="font-semibold text-civic-dark">Demo login</p>
          <p className="font-data">citizen1@test.in / Test@123</p>
        </div>
      </div>
    </div>
  );
}

