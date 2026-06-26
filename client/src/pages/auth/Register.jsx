import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/', { replace: true });
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
          <h2 className="font-display font-semibold text-lg">Create an account</h2>

          <div>
            <label htmlFor="reg-name" className="text-sm font-semibold mb-1.5 block">
              Full name
            </label>
            <input
              id="reg-name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Aisha Khan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="text-sm font-semibold mb-1.5 block">
              Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="reg-phone" className="text-sm font-semibold mb-1.5 block">
              Phone
            </label>
            <input
              id="reg-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="98765 00000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="text-sm font-semibold mb-1.5 block">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            Create account
          </Button>

          <p className="text-center text-sm text-civic-ink">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-civic-blue">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
