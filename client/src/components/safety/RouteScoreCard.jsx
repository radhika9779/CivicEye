import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import ScoreGauge from '../common/ScoreGauge';
import { formatDistance } from '../../utils/formatters';

export default function RouteScoreCard({ score, label, color, reasons = [], nearbyLocations = [] }) {
  return (
    <div className="bg-civic-card rounded-2xl shadow-floating border border-civic-border p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4 text-safety-purple">
        <ShieldCheck size={16} />
        <span className="text-xs font-semibold uppercase tracking-wide">Route Safety Score</span>
      </div>

      <div className="flex items-center gap-5">
        <ScoreGauge value={score} max={100} color={color} />
        <div className="flex-1">
          <p className="font-display font-bold text-lg" style={{ color }}>
            {label}
          </p>
          <div className="space-y-1.5 mt-2">
            {reasons.map((reason, idx) => (
              <p key={idx} className="text-xs font-data text-civic-ink leading-snug">
                • {reason}
              </p>
            ))}
          </div>
        </div>
      </div>

      {nearbyLocations.length > 0 && (
        <div className="mt-5 pt-5 border-t border-civic-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-civic-ink mb-2">
            Nearby safe locations
          </p>
          <div className="space-y-2">
            {nearbyLocations.slice(0, 3).map((loc) => (
              <div key={loc.id} className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-safety-purple flex-shrink-0" />
                <span className="flex-1 truncate">{loc.name}</span>
                {loc.distance_km != null && (
                  <span className="text-xs font-data text-civic-ink">{formatDistance(loc.distance_km)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
