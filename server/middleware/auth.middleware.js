const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Verifies the Bearer JWT in the Authorization header and attaches
 * the authenticated user (without password_hash) to req.user.
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user.toSafeJSON();
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

/**
 * Like authMiddleware, but does not fail the request if no token is present.
 * Used for routes where auth is optional (e.g. anonymous safety reports).
 */
async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    req.user = user ? user.toSafeJSON() : null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

module.exports = { authMiddleware, optionalAuthMiddleware };
