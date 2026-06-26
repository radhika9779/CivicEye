import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { getPinColor, getSeverityConfig } from '../../utils/severityConfig';
import { StatusBadge } from '../common/Badge';

const DEFAULT_CENTER = [19.076, 72.8777]; // Mumbai

function buildPinIcon(color, pulse) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width:28px; height:28px;">
        ${pulse ? `<div class="civic-pin-pulse" style="background:${color};"></div>` : ''}
        <div class="civic-pin" style="background:${color};">
          <div class="civic-pin-dot"></div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

/** Recenters the map imperatively when center prop changes (e.g. after geolocation). */
function RecenterOnChange({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
}

export default function IssueMap({ issues = [], center, zoom = 13, height = '100%' }) {
  const icons = useMemo(() => {
    const cache = {};
    issues.forEach((issue) => {
      const color = getPinColor(issue);
      const key = `${color}-${issue.severity === 'critical' && issue.status !== 'resolved'}`;
      if (!cache[key]) {
        cache[key] = buildPinIcon(color, issue.severity === 'critical' && issue.status !== 'resolved');
      }
    });
    return cache;
  }, [issues]);

  return (
    <div style={{ height }} className="w-full">
      <MapContainer
        center={center || DEFAULT_CENTER}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {center && <RecenterOnChange center={center} zoom={zoom} />}

        {issues.map((issue) => {
          const color = getPinColor(issue);
          const key = `${color}-${issue.severity === 'critical' && issue.status !== 'resolved'}`;
          const categoryConfig = getCategoryConfig(issue.category);
          const severityConfig = getSeverityConfig(issue.severity);

          return (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={icons[key] || buildPinIcon(color, false)}
            >
              <Popup>
                <div className="min-w-[200px] space-y-2">
                  <div className="flex items-center gap-2">
                    <categoryConfig.icon size={16} style={{ color: categoryConfig.color }} />
                    <p className="font-display font-semibold text-sm leading-tight">{issue.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-data font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: severityConfig.bg, color: severityConfig.text }}
                    >
                      {severityConfig.label} · {issue.ai_score?.toFixed(1)}
                    </span>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                  <p className="text-xs text-civic-ink">👍 {issue.upvote_count} upvotes</p>
                  <Link
                    to={`/issues/${issue.id}`}
                    className="block text-center text-xs font-semibold text-civic-blue py-1.5 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
