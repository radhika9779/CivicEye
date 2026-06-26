/**
 * routeSafety.service.js
 * Computes a Route Safety Score (0-100) for the Women's Safety module by
 * checking how many safety reports / safe locations sit near the route.
 */

const EARTH_RADIUS_KM = 6371;

/** Haversine distance between two lat/lon points, in kilometers. */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function isWithinMetersOfAnyPoint(targetLat, targetLon, routePoints, meters) {
  const km = meters / 1000;
  return routePoints.some(
    (p) => haversineDistanceKm(targetLat, targetLon, p.lat, p.lon) <= km
  );
}

function scoreToLabel(score) {
  if (score >= 75) return { label: 'Generally Safe ✓', color: '#16A34A' };
  if (score >= 50) return { label: 'Use Caution ⚠️', color: '#D97706' };
  if (score >= 25) return { label: 'Avoid if Possible 🔶', color: '#EA580C' };
  return { label: 'High Risk — Avoid ⛔', color: '#DC2626' };
}

/**
 * @param {{lat:number, lon:number}[]} routePoints
 * @param {Array} safetyReports - rows with latitude, longitude, report_type
 * @param {Array} safeLocations - rows with latitude, longitude, type
 * @returns {{ score:number, label:string, color:string, reasons:string[] }}
 */
function calculateRouteSafety(routePoints, safetyReports = [], safeLocations = []) {
  if (!routePoints || routePoints.length === 0) {
    throw new Error('routePoints must contain at least one {lat, lon} point');
  }

  // STEP 1 — Count safety reports within 300m of any route point, grouped by type
  const nearbyReports = safetyReports.filter((r) =>
    isWithinMetersOfAnyPoint(r.latitude, r.longitude, routePoints, 300)
  );

  const harassment_count = nearbyReports.filter((r) => r.report_type === 'harassment').length;
  const poor_lighting_count = nearbyReports.filter((r) => r.report_type === 'poor_lighting').length;
  const unsafe_count = nearbyReports.filter((r) => r.report_type === 'unsafe_area').length;

  // STEP 2 — Base score
  let score = 100;
  const reasons = [];

  // STEP 3 — Deductions (capped at -70 total)
  let deduction = 0;
  deduction += harassment_count * 12;
  deduction += poor_lighting_count * 8;
  deduction += unsafe_count * 6;
  const cappedDeduction = Math.min(deduction, 70);
  score -= cappedDeduction;

  if (harassment_count > 0) {
    reasons.push(`${harassment_count} harassment report${harassment_count > 1 ? 's' : ''} within 300m`);
  }
  if (poor_lighting_count > 0) {
    reasons.push('Poor lighting zone detected');
  }
  if (unsafe_count > 0) {
    reasons.push(`${unsafe_count} unsafe area report${unsafe_count > 1 ? 's' : ''} nearby`);
  }

  // STEP 4 — Bonus for nearby police/hospital (max +15)
  const nearbySafeLocations = safeLocations.filter(
    (loc) =>
      (loc.type === 'police' || loc.type === 'hospital') &&
      isWithinMetersOfAnyPoint(loc.latitude, loc.longitude, routePoints, 500)
  );
  const bonus = Math.min(nearbySafeLocations.length * 5, 15);
  score += bonus;

  if (nearbySafeLocations.length > 0) {
    const policeCount = nearbySafeLocations.filter((l) => l.type === 'police').length;
    const hospitalCount = nearbySafeLocations.filter((l) => l.type === 'hospital').length;
    if (policeCount > 0) reasons.push(`Police booth nearby (+5)`);
    if (hospitalCount > 0) reasons.push(`Hospital nearby (+5)`);
  } else {
    reasons.push('No police booth within 500m');
  }

  // STEP 5 — Clamp 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // STEP 6 — Label + color
  const { label, color } = scoreToLabel(score);

  return {
    score,
    label,
    color,
    reasons,
    nearbyReports,
    nearbyLocations: nearbySafeLocations,
  };
}

module.exports = { calculateRouteSafety, haversineDistanceKm };
