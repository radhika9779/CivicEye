import { useState, useCallback } from 'react';

/**
 * Wraps the browser Geolocation API in a simple { detect, coords, loading, error } interface.
 * Used for "Use My Location" buttons in the report form and route check.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoords(next);
          setLoading(false);
          resolve(next);
        },
        (err) => {
          const message =
            err.code === 1
              ? 'Location permission denied. Please enable it in your browser settings.'
              : 'Could not detect your location. Try again.';
          setError(message);
          setLoading(false);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  return { coords, loading, error, detect };
}
