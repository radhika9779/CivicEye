import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Plus, ShieldCheck, ListChecks, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const tabClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[11px] font-medium transition-colors ${
    isActive ? 'text-civic-blue' : 'text-slate-400'
  }`;

export default function BottomNav() {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  const citizenTabs = [
    { to: '/', icon: MapPin, label: 'Home', end: true },
    { to: '/report', icon: Plus, label: 'Report' },
    { to: '/safety', icon: ShieldCheck, label: 'Safety' },
    { to: '/my-reports', icon: ListChecks, label: 'My Reports' },
  ];

  const adminTabs = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/issues', icon: ListChecks, label: 'Issues' },
  ];

  const tabs = isAdmin ? adminTabs : citizenTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-civic-card border-t border-civic-border flex pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink key={to} to={to} end={end} className={tabClass}>
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
