const express = require('express');
const router = express.Router();
const { updateEmergencyContacts, getProfile } = require('../controllers/users.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.put('/emergency-contacts', authMiddleware, updateEmergencyContacts);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
