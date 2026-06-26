import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SafetyMap from '../../components/safety/SafetyMap';
import { FullPageSpinner } from '../../components/common/Spinner';
import { getSafetyReportsForMap, getSafeLocations } from '../../api/safety.api';

export default function SafeMap() {
  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSafetyReportsForMap({}), getSafeLocations({})])
      .then(([reportsData, locationsData]) => {
        setReports(reportsData.reports);
        setLocations(locationsData.locations);
      })
      .catch(() => toast.error('Could not load the safety map'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] relative">
      <div className="absolute top-3 left-3 right-3 z-20 bg-civic-card rounded-xl shadow-card border border-civic-border px-4 py-2.5">
        <p className="text-sm font-display font-semibold text-safety-purple">Safety Heatmap</p>
        <p className="text-xs text-civic-ink">Darker zones have more reported incidents nearby</p>
      </div>
      {loading ? (
        <FullPageSpinner label="Loading the heatmap…" />
      ) : (
        <SafetyMap safetyReports={reports} safeLocations={locations} />
      )}
    </div>
  );
}
