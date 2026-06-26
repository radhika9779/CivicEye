import { useState } from 'react';
import { useGeolocation } from './useGeolocation';
import { triggerSOS } from '../api/safety.api';

/**
 * Encapsulates the "confirm -> detect location -> POST /safety/sos -> sent"
 * flow so it can be reused by both the floating SOSButton and the Safety
 * Home hero button without duplicating logic.
 */
export function useSOSTrigger() {
  const [stage, setStage] = useState('idle'); // 'idle' | 'confirm' | 'sending' | 'sent'
  const [error, setError] = useState(null);
  const { detect } = useGeolocation();

  const open = () => {
    setError(null);
    setStage('confirm');
  };

  const confirm = async () => {
    setStage('sending');
    try {
      const { lat, lon } = await detect();
      await triggerSOS({ latitude: lat, longitude: lon, address: 'Live GPS location' });
      setStage('sent');
    } catch (err) {
      setError(err.message || 'Could not send SOS. Try calling 112 directly.');
      setStage('confirm');
    }
  };

  const reset = () => {
    setStage('idle');
    setError(null);
  };

  return { stage, error, open, confirm, reset };
}
