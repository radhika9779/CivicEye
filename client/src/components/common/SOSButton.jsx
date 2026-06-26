import React from 'react';
import { ShieldAlert, MapPin, PhoneCall } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Button from './Button';
import useAuthStore from '../../store/authStore';
import { useSOSTrigger } from '../../hooks/useSOSTrigger';
import SOSScreen from '../safety/SOSScreen';

export default function SOSButton() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  const { stage, error, open, confirm, reset } = useSOSTrigger();

  const handleOpen = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to use the SOS alert.');
      return;
    }
    open();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Send SOS emergency alert"
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 w-16 h-16 rounded-full bg-severity-critical text-white shadow-floating flex flex-col items-center justify-center gap-0.5 hover:bg-red-700 active:scale-95 transition-all"
      >
        <ShieldAlert size={22} />
        <span className="text-[10px] font-bold tracking-wide">SOS</span>
      </button>

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
              <Button
                variant="danger"
                fullWidth
                loading={stage === 'sending'}
                onClick={confirm}
                icon={MapPin}
              >
                Send SOS now
              </Button>
            </div>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 text-sm font-medium text-civic-blue py-2"
            >
              <PhoneCall size={16} /> Or call 112 directly
            </a>
          </div>
        ) : (
          <SOSScreen userName={user?.name?.split(' ')[0]} onClose={reset} />
        )}
      </Modal>
    </>
  );
}

