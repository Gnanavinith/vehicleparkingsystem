const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Predefined role middlewares
const superAdminOnly = roleMiddleware('super_admin');
const standAdminOnly = roleMiddleware('stand_admin');
const staffOnly = roleMiddleware('staff');
const adminRoles = roleMiddleware('super_admin', 'stand_admin');
const allRoles = roleMiddleware('super_admin', 'stand_admin', 'staff');

module.exports = {
  roleMiddleware,
  superAdminOnly,
  standAdminOnly,
  staffOnly,
  adminRoles,
  allRoles
};