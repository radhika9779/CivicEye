const express = require('express');
const router = express.Router();
const {
  getAdminIssues,
  assignIssue,
  updateIssueStatus,
  getStats,
  getSosAlerts,
} = require('../controllers/admin.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.use(authMiddleware, requireRole('admin', 'ward_officer'));

router.get('/issues', getAdminIssues);
router.patch('/issues/:id/assign', assignIssue);
router.patch('/issues/:id/status', updateIssueStatus);
router.get('/stats', getStats);
router.get('/sos-alerts', getSosAlerts);

module.exports = router;
