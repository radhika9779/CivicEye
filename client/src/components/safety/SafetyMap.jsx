import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Shield, Cross, Home as HomeIcon } from 'lucide-react';

const DEFAULT_CENTER = [19.076, 72.8777];

const SAFE_LOCATION_ICONS = {
  police: { Icon: Shield, color: '#2563EB' },
  hospital: { Icon: Cross, color: '#DC2626' },
  shelter: { Icon: HomeIcon, color: '#9333EA' },
};

function buildSafeIcon(type) {
  const { Icon, color } = SAFE_LOCATION_ICONS[type] || SAFE_LOCATION_ICONS.police;
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(15,23,42,.3);">
      <div style="width:12px;height:12px;background:white;mask-size:contain;"></div>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function buildEndpointIcon(label, color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(15,23,42,.35);color:white;font-size:11px;font-weight:700;">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function ClickCatcher({ onClick }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

/** Same fix as IssueMap/IssueForm: MapContainer's `center` prop only applies
 * on first mount, so without this the map won't pan when `center` changes
 * later (e.g. after the user taps "Use my location"). */
function RecenterOnChange({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

/** Imperatively manages a leaflet.heat layer since react-leaflet has no native wrapper for it. */
function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const intensityByType = { harassment: 1.0, unsafe_area: 0.8, poor_lighting: 0.6, other: 0.5 };
    const heatPoints = points.map((p) => [
      p.latitude,
      p.longitude,
      intensityByType[p.report_type] || 0.6,
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      gradient: { 0.2: '#9333EA', 0.5: '#DC2626', 0.8: '#DC2626', 1.0: '#7F1D1D' },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
}

export default function SafetyMap({
  safetyReports = [],
  safeLocations = [],
  routePoints = null,
  fromPoint = null,
  toPoint = null,
  center,
  zoom = 13,
  height = '100%',
  onMapClick = null,
}) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden">
      <MapContainer
        center={center || DEFAULT_CENTER}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer points={safetyReports} />

        {center && <RecenterOnChange center={center} />}

        {onMapClick && <ClickCatcher onClick={onMapClick} />}

        {routePoints && routePoints.length > 1 && (
          <Polyline
            positions={routePoints.map((p) => [p.lat, p.lon])}
            pathOptions={{ color: '#9333EA', weight: 4, opacity: 0.85 }}
          />
        )}

        {fromPoint && (
          <Marker position={[fromPoint.lat, fromPoint.lon]} icon={buildEndpointIcon('A', '#2563EB')} />
        )}
        {toPoint && (
          <Marker position={[toPoint.lat, toPoint.lon]} icon={buildEndpointIcon('B', '#9333EA')} />
        )}

        {safeLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={buildSafeIcon(loc.type)}>
            <Popup>
              <div className="space-y-1">
                <p className="font-display font-semibold text-sm">{loc.name}</p>
                <p className="text-xs text-civic-ink capitalize">{loc.type}</p>
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="text-xs font-semibold text-civic-blue">
                    {loc.phone}
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
