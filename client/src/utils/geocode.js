/**
 * Reverse geocoding via OpenStreetMap's Nominatim — free, no API key required
 * (unlike the Google Maps Geocoding API, which needs a billing-enabled key).
 * Good enough for "what street/area is this" lookups in a hackathon demo;
 * for production-scale traffic you'd want a paid provider with an SLA and
 * to respect Nominatim's usage policy (low volume, no bulk geocoding).
 */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.display_name || null;
  } catch {
    return null; // offline, rate-limited, or blocked — caller falls back to lat/lon
  }
}
