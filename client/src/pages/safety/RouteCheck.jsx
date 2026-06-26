import React, { useState } from 'react';
import { Crosshair, MapPin, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import RouteScoreCard from '../../components/safety/RouteScoreCard';
import SafetyMap from '../../components/safety/SafetyMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { checkRouteSafety, getSafetyReportsForMap } from '../../api/safety.api';

/** Builds N evenly-spaced points between two coords for the safety scorer & polyline. */
function interpolateRoute(from, to, steps = 6) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      lat: from.lat + (to.lat - from.lat) * t,
      lon: from.lon + (to.lon - from.lon) * t,
    });
  }
  return points;
}

export default function RouteCheck() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [heatPoints, setHeatPoints] = useState([]);
  const { loading: locating, detect } = useGeolocation();

  const handleUseMyLocation = async () => {
    try {
      const coords = await detect();
      setFrom(coords);
      setTo(null);
      setResult(null);
      toast.success('Start point set — now tap your destination on the map');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMapClick = (coords) => {
    if (!from) {
      setFrom(coords);
      toast.success('Start point set — now tap your destination');
    } else if (!to) {
      setTo(coords);
    } else {
      // Both already set — clicking again restarts point selection
      setFrom(coords);
      setTo(null);
      setResult(null);
    }
  };

  const handleCheck = async () => {
    if (!from || !to) {
      toast.error('Tap the map to set both a start (A) and destination (B) point first');
      return;
    }
    setChecking(true);
    try {
      const points = interpolateRoute(from, to);
      const [routeResult, mapReports] = await Promise.all([
        checkRouteSafety(points),
        getSafetyReportsForMap({ lat: from.lat, lon: from.lon, radius: 5 }),
      ]);
      setResult(routeResult);
      setHeatPoints(mapReports.reports);
    } catch (err) {
      toast.error('Could not score this route');
    } finally {
      setChecking(false);
    }
  };

  const routePoints = from && to ? interpolateRoute(from, to) : null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28">
      <h1 className="font-display font-bold text-2xl mb-1">Check Route Safety</h1>
      <p className="text-sm text-civic-ink mb-5">
        Tap the map to drop point A (start), then point B (destination) — or use your current
        location as the start.
      </p>

      <div className="space-y-2 mb-4">
        <button
          onClick={handleUseMyLocation}
          disabled={locating}
          className="flex items-center gap-2 text-sm font-medium text-safety-purple"
        >
          <Crosshair size={16} className={locating ? 'animate-spin' : ''} />
          {locating ? 'Detecting…' : 'Use my location as start'}
        </button>

        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-civic-blue" />
          <span className="text-civic-ink">A (from):</span>
          <span className="font-data">{from ? `${from.lat.toFixed(4)}, ${from.lon.toFixed(4)}` : 'Tap the map'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-safety-purple" />
          <span className="text-civic-ink">B (to):</span>
          <span className="font-data">{to ? `${to.lat.toFixed(4)}, ${to.lon.toFixed(4)}` : 'Tap again after A'}</span>
        </div>
      </div>

      <div className="h-64 rounded-xl overflow-hidden border border-civic-border mb-4">
        <SafetyMap
          onMapClick={handleMapClick}
          routePoints={routePoints}
          safetyReports={heatPoints}
          fromPoint={from}
          toPoint={to}
          center={from ? [from.lat, from.lon] : undefined}
        />
      </div>

      <Button fullWidth variant="safety" icon={ShieldCheck} loading={checking} onClick={handleCheck}>
        Check Route Safety
      </Button>

      {result && (
        <div className="mt-5">
          <RouteScoreCard
            score={result.score}
            label={result.label}
            color={result.color}
            reasons={result.reasons}
            nearbyLocations={result.nearbyLocations}
          />
        </div>
      )}
    </div>
  );
}
