const { User } = require('../models');

// PUT /api/users/emergency-contacts
async function updateEmergencyContacts(req, res) {
  try {
    const { contacts } = req.body;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ success: false, message: 'contacts must be an array' });
    }

    for (const c of contacts) {
      if (!c.name || !c.phone) {
        return res
          .status(400)
          .json({ success: false, message: 'Each contact requires a name and phone' });
      }
    }

    const user = await User.findByPk(req.user.id);
    await user.update({ emergency_contacts: contacts });

    return res.json({ success: true, emergency_contacts: user.emergency_contacts });
  } catch (err) {
    console.error('updateEmergencyContacts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update emergency contacts' });
  }
}

// GET /api/users/profile
async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
}

module.exports = { updateEmergencyContacts, getProfile };
