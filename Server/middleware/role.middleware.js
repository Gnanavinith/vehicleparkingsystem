const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    console.log('Role middleware check - Required roles:', roles);
    console.log('Role middleware check - User role:', req.user?.role);
    
    if (!req.user) {
      console.log('Role middleware - No user found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log('Role middleware - Access denied. User role:', req.user.role, 'Required:', roles);
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    console.log('Role middleware - Access granted');
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