import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';

export default function AdminLogin() {
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
      if (user.role !== 'admin' && user.role !== 'ward_officer') {
        logout();
        toast.error('This account is not a staff account. Use the citizen login instead.');
        return;
      }
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-civic-dark px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">CivicEye Ops</h1>
          <p className="text-sm text-slate-400 mt-1">Officer & Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-lg text-white">Staff sign in</h2>

          <div>
            <label htmlFor="admin-email" className="text-sm font-semibold mb-1.5 block text-slate-300">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@civiceye.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-sm font-semibold mb-1.5 block text-slate-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            Sign in
          </Button>

          <p className="text-center text-xs text-slate-500">
            Staff accounts are provisioned by your municipal administrator — there's no public
            sign-up here.
          </p>
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 mt-5 hover:text-white"
        >
          <ArrowLeft size={13} /> Back to citizen login
        </Link>

        <div className="mt-5 bg-white/5 rounded-xl p-3.5 text-xs text-slate-400 space-y-1 border border-white/10">
          <p className="font-semibold text-slate-300">Demo logins</p>
          <p className="font-data">admin@civiceye.in / Admin@123</p>
          <p className="font-data">officer@civiceye.in / Officer@123</p>
        </div>
      </div>
    </div>
  );
}
