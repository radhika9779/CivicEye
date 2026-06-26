/**
 * requireRole(...roles)
 * Usage: router.get('/stats', authMiddleware, requireRole('admin', 'ward_officer'), handler)
 * Must run AFTER authMiddleware since it relies on req.user.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
}

module.exports = { requireRole };
