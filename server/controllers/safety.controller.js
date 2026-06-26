const { SafetyReport, SafeLocation, SOSAlert, User } = require('../models');
const { calculateRouteSafety, haversineDistanceKm } = require('../services/routeSafety.service');
const { getIO } = require('../config/socket');

// POST /api/safety/report
async function createSafetyReport(req, res) {
  try {
    const { report_type, description, latitude, longitude, address, severity, is_anonymous } =
      req.body;

    if (!report_type || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ success: false, message: 'report_type, latitude and longitude are required' });
    }

    const report = await SafetyReport.create({
      report_type,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      severity: severity || 'medium',
      is_anonymous: is_anonymous !== false,
      reporter_id: req.user ? req.user.id : null,
    });

    return res.status(201).json({ success: true, report });
  } catch (err) {
    console.error('createSafetyReport error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create safety report' });
  }
}

// GET /api/safety/reports/map
async function getSafetyReportsForMap(req, res) {
  try {
    const { lat, lon, radius = 5 } = req.query;

    const allReports = await SafetyReport.findAll({
      attributes: ['id', 'latitude', 'longitude', 'severity', 'report_type'],
    });

    let reports = allReports;
    if (lat && lon) {
      const radiusKm = parseFloat(radius);
      reports = allReports.filter(
        (r) =>
          haversineDistanceKm(parseFloat(lat), parseFloat(lon), r.latitude, r.longitude) <=
          radiusKm
      );
    }

    return res.json({ success: true, reports });
  } catch (err) {
    console.error('getSafetyReportsForMap error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch safety reports' });
  }
}

// GET /api/safety/locations
async function getSafeLocations(req, res) {
  try {
    const { lat, lon, radius = 2 } = req.query;
    const allLocations = await SafeLocation.findAll();

    let locations = allLocations.map((l) => l.toJSON());

    if (lat && lon) {
      const radiusKm = parseFloat(radius);
      locations = locations
        .map((l) => ({
          ...l,
          distance_km:
            Math.round(
              haversineDistanceKm(parseFloat(lat), parseFloat(lon), l.latitude, l.longitude) * 100
            ) / 100,
        }))
        .filter((l) => l.distance_km <= radiusKm)
        .sort((a, b) => a.distance_km - b.distance_km);
    }

    return res.json({ success: true, locations });
  } catch (err) {
    console.error('getSafeLocations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch safe locations' });
  }
}

// POST /api/safety/sos
async function triggerSOS(req, res) {
  try {
    const { latitude, longitude, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'latitude and longitude are required' });
    }

    const alert = await SOSAlert.create({
      user_id: req.user.id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      status: 'active',
      triggered_at: new Date(),
    });

    const payload = {
      id: alert.id,
      userName: req.user.name,
      address: address || null,
      lat: alert.latitude,
      lon: alert.longitude,
      time: alert.triggered_at,
    };

    try {
      getIO().to('admin_room').emit('sos_alert', payload);
    } catch (e) {
      console.warn('Socket emit skipped:', e.message);
    }

    return res.status(201).json({ success: true, alert });
  } catch (err) {
    console.error('triggerSOS error:', err);
    return res.status(500).json({ success: false, message: 'Failed to trigger SOS alert' });
  }
}

// PATCH /api/safety/sos/:id/resolve
async function resolveSOS(req, res) {
  try {
    const alert = await SOSAlert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'SOS alert not found' });
    }

    await alert.update({ status: 'resolved', resolved_at: new Date() });

    return res.json({ success: true, alert });
  } catch (err) {
    console.error('resolveSOS error:', err);
    return res.status(500).json({ success: false, message: 'Failed to resolve SOS alert' });
  }
}

// POST /api/safety/route-safety
async function getRouteSafety(req, res) {
  try {
    const { points } = req.body;

    if (!Array.isArray(points) || points.length === 0) {
      return res.status(400).json({ success: false, message: 'points array is required' });
    }

    const allReports = await SafetyReport.findAll({
      attributes: ['id', 'latitude', 'longitude', 'report_type', 'severity'],
    });
    const allLocations = await SafeLocation.findAll();

    // Narrow down to reports/locations within a generous 1km of any route point
    // before passing to the scoring service (keeps it efficient for long routes).
    const nearbyReports = allReports.filter((r) =>
      points.some(
        (p) => haversineDistanceKm(p.lat, p.lon, r.latitude, r.longitude) <= 1
      )
    );
    const nearbyLocations = allLocations.filter((l) =>
      points.some(
        (p) => haversineDistanceKm(p.lat, p.lon, l.latitude, l.longitude) <= 1
      )
    );

    const result = calculateRouteSafety(points, nearbyReports, nearbyLocations);

    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('getRouteSafety error:', err);
    return res.status(500).json({ success: false, message: 'Failed to calculate route safety' });
  }
}

module.exports = {
  createSafetyReport,
  getSafetyReportsForMap,
  getSafeLocations,
  triggerSOS,
  resolveSOS,
  getRouteSafety,
};
