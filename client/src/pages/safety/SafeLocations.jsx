import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Crosshair } from 'lucide-react';
import SafeLocationCard from '../../components/safety/SafeLocationCard';
import { FullPageSpinner } from '../../components/common/Spinner';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getSafeLocations } from '../../api/safety.api';

export default function SafeLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loading: locating, detect } = useGeolocation();

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getSafeLocations(params);
      setLocations(data.locations);
    } catch {
      toast.error('Could not load safe locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUseMyLocation = async () => {
    try {
      const coords = await detect();
      load({ lat: coords.lat, lon: coords.lon, radius: 5 });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28">
      <h1 className="font-display font-bold text-2xl mb-1">Safe Locations</h1>
      <p className="text-sm text-civic-ink mb-4">Police booths, hospitals, and shelters near you.</p>

      <button
        onClick={handleUseMyLocation}
        disabled={locating}
        className="flex items-center gap-2 text-sm font-medium text-safety-purple mb-5"
      >
        <Crosshair size={16} className={locating ? 'animate-spin' : ''} />
        {locating ? 'Detecting…' : 'Sort by distance from my location'}
      </button>

      {loading ? (
        <FullPageSpinner label="Loading locations…" />
      ) : locations.length === 0 ? (
        <p className="text-sm text-civic-ink text-center py-10">No safe locations found nearby.</p>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <SafeLocationCard key={loc.id} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
}
