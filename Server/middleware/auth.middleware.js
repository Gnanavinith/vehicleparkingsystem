const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { superAdminOnly, adminRoles, standAdminOnly, staffOnly, allRoles } = require('./role.middleware');

const protect = async (req, res, next) => {
  let token;

  console.log('Authorization header:', req.headers.authorization);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Present' : 'Missing');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      // Set user information from token
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role,
        stand: decoded.stand
      };
      console.log('req.user set:', req.user);

      // For stand_admin and staff roles, we need to populate the stand information
      if (decoded.role !== 'super_admin' && decoded.stand) {
        const User = require('../models/User');
        const userWithStand = await User.findById(decoded.id).populate('stand', 'name location').select('-password');
        if (userWithStand && userWithStand.stand) {
          req.user.stand = userWithStand.stand;
        }
      }

      if (!req.user) {
        console.log('User not found in request');
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = { protect, superAdminOnly, adminRoles, standAdminOnly, staffOnly, allRoles };