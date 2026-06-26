import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Map as MapIcon, AlertTriangle, Users, PhoneCall, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SOSScreen from '../../components/safety/SOSScreen';
import useAuthStore from '../../store/authStore';
import { useSOSTrigger } from '../../hooks/useSOSTrigger';

const NAV_CARDS = [
  { to: '/safety/route-check', icon: MapIcon, title: 'Check Route Safety', desc: 'Score any path before you walk it' },
  { to: '/safety/report-unsafe', icon: AlertTriangle, title: 'Report Unsafe Area', desc: 'Flag harassment or poor lighting' },
  { to: '/safety/map', icon: MapPin, title: 'Safety Map', desc: 'View the full risk heatmap' },
  { to: '/safety/locations', icon: Users, title: 'Safe Locations', desc: 'Nearby police, hospitals, shelters' },
];

const HELPLINES = [
  { number: '112', label: 'National Emergency' },
  { number: '181', label: "Women's Helpline" },
  { number: '1091', label: 'Women in Distress' },
];

export default function SafetyHome() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  const { stage, error, open, confirm, reset } = useSOSTrigger();

  const handleHeroPress = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to use the SOS alert.');
      return;
    }
    open();
  };

  return (
    <div className="bg-safety-bg min-h-[calc(100vh-64px)] pb-28">
      <div className="px-4 pt-10 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-safety-purple mb-1">
          Women's Safety
        </p>
        <h1 className="font-display font-bold text-2xl mb-6">You're not walking alone</h1>

        <button
          onClick={handleHeroPress}
          className="w-36 h-36 mx-auto rounded-full bg-severity-critical text-white shadow-floating flex flex-col items-center justify-center gap-1 hover:bg-red-700 active:scale-95 transition-all"
        >
          <ShieldAlert size={36} />
          <span className="font-display font-bold text-sm">Press in Emergency</span>
        </button>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {NAV_CARDS.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-civic-card rounded-xl border border-civic-border p-4 hover:border-safety-purple/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-safety-bg flex items-center justify-center mb-3">
              <Icon size={20} className="text-safety-purple" />
            </div>
            <p className="font-display font-semibold text-sm leading-snug">{title}</p>
            <p className="text-xs text-civic-ink mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="px-4 mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-civic-ink mb-2">
          Emergency Helplines
        </p>
        <div className="bg-civic-card rounded-xl border border-civic-border divide-y divide-civic-border">
          {HELPLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-medium">{h.label}</span>
              <span className="flex items-center gap-1.5 text-sm font-data font-semibold text-safety-purple">
                <PhoneCall size={14} /> {h.number}
              </span>
            </a>
          ))}
        </div>
      </div>

      <Modal open={stage !== 'idle'} onClose={reset} title={stage === 'sent' ? 'Alert sent' : 'Emergency SOS'}>
        {stage !== 'sent' ? (
          <div className="space-y-4">
            <p className="text-sm text-civic-ink">
              This sends your live location to the CivicEye safety team immediately. Use it only
              for a genuine emergency.
            </p>
            {error && (
              <p className="text-sm text-severity-critical bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={reset}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth loading={stage === 'sending'} onClick={confirm}>
                Send SOS now
              </Button>
            </div>
          </div>
        ) : (
          <SOSScreen userName={user?.name?.split(' ')[0]} onClose={reset} />
        )}
      </Modal>
    </div>
  );
}
