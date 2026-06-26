import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';
import Button from '../common/Button';

export default function SOSScreen({ userName, onClose }) {
  return (
    <div className="text-center py-2 space-y-4">
      <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
        <ShieldAlert size={28} className="text-severity-critical" />
      </div>
      <div>
        <p className="font-display font-semibold text-lg">Your location has been shared</p>
        <p className="text-sm text-civic-ink mt-1">
          Hi {userName || 'there'}, the safety team has been notified with your live GPS location
          and will respond shortly. Stay where you are if it's safe to do so.
        </p>
      </div>
      <a
        href="tel:112"
        className="flex items-center justify-center gap-2 text-sm font-semibold text-severity-critical py-2"
      >
        <PhoneCall size={16} /> Call 112 for immediate police response
      </a>
      <Button variant="secondary" fullWidth onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
