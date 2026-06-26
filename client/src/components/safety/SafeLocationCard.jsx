import React from 'react';
import { Shield, Cross, Home as HomeIcon, Phone, MapPin } from 'lucide-react';
import { formatDistance } from '../../utils/formatters';

const TYPE_CONFIG = {
  police: { Icon: Shield, color: '#2563EB', label: 'Police Booth' },
  hospital: { Icon: Cross, color: '#DC2626', label: 'Hospital' },
  shelter: { Icon: HomeIcon, color: '#9333EA', label: "Women's Shelter" },
};

export default function SafeLocationCard({ location }) {
  const config = TYPE_CONFIG[location.type] || TYPE_CONFIG.police;
  const Icon = config.Icon;

  return (
    <div className="flex items-center gap-3 bg-civic-card rounded-xl border border-civic-border p-4">
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <Icon size={20} style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm truncate">{location.name}</p>
        <p className="text-xs text-civic-ink">{config.label}</p>
        {location.address && (
          <p className="flex items-center gap-1 text-xs text-civic-ink mt-0.5 truncate">
            <MapPin size={11} /> {location.address}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {location.distance_km != null && (
          <span className="text-xs font-data font-semibold text-safety-purple">
            {formatDistance(location.distance_km)}
          </span>
        )}
        {location.phone && (
          <a
            href={`tel:${location.phone}`}
            className="p-1.5 rounded-full bg-safety-bg text-safety-purple"
            aria-label={`Call ${location.name}`}
          >
            <Phone size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
