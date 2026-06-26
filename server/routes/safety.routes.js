const express = require('express');
const router = express.Router();
const {
  createSafetyReport,
  getSafetyReportsForMap,
  getSafeLocations,
  triggerSOS,
  resolveSOS,
  getRouteSafety,
} = require('../controllers/safety.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth.middleware');

router.post('/report', optionalAuthMiddleware, createSafetyReport);
router.get('/reports/map', getSafetyReportsForMap);
router.get('/locations', getSafeLocations);
router.post('/sos', authMiddleware, triggerSOS);
router.patch('/sos/:id/resolve', authMiddleware, resolveSOS);
router.post('/route-safety', getRouteSafety);

module.exports = router;
