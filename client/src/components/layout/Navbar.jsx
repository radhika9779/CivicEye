import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Plus, ShieldCheck, ListChecks, LayoutDashboard, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const linkClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-50 text-civic-blue' : 'text-civic-ink hover:bg-slate-50'
  }`;

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="hidden md:flex items-center justify-between px-6 h-16 bg-civic-card border-b border-civic-border sticky top-0 z-30">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-civic-blue flex items-center justify-center">
          <MapPin size={18} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg">CivicEye</span>
      </Link>

      <div className="flex items-center gap-1">
        {isAdmin ? (
          <>
            <NavLink to="/admin" className={linkClass}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink to="/admin/issues" className={linkClass}>
              <ListChecks size={16} /> Issues
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end className={linkClass}>
              <MapPin size={16} /> Home
            </NavLink>
            <NavLink to="/report" className={linkClass}>
              <Plus size={16} /> Report
            </NavLink>
            <NavLink to="/my-reports" className={linkClass}>
              <ListChecks size={16} /> My Reports
            </NavLink>
            <NavLink to="/safety" className={linkClass}>
              <ShieldCheck size={16} /> Safety
            </NavLink>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-civic-ink">{user.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-50 text-civic-ink"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm font-medium text-civic-blue">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
