const express = require('express');
const router = express.Router();
const { protect, superAdminOnly, allRoles, standAdminOnly } = require('../middleware/auth.middleware');
const { 
  getPricing,
  updatePricing,
  getVehiclePricing,
  getStandPricing,
  updateStandPricing
} = require('../controllers/pricing.controller');

// Super admin routes
router.route('/')
  .get(protect, superAdminOnly, getPricing)
  .put(protect, superAdminOnly, updatePricing);

// Stand admin routes - read/write access to their stand's pricing
router.route('/stand')
  .get(protect, (req, res, next) => {
    console.log('STAND PRICING ROUTE - incoming request');
    console.log('User role:', req.user?.role);
    console.log('Available roles in allRoles:', ['super_admin', 'stand_admin', 'staff']);
    console.log('User role allowed?', ['super_admin', 'stand_admin', 'staff'].includes(req.user?.role));
    next();
  }, getStandPricing)
  .put(protect, standAdminOnly, updateStandPricing);

// This route should come AFTER /stand to avoid matching 'stand' as a vehicle type
router.route('/:vehicleType')
  .get(protect, superAdminOnly, getVehiclePricing);

// Test route - no authentication required
router.route('/test')
  .get((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Test route working'
    });
  });

// Debug route - check user authentication
router.route('/debug')
  .get(protect, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: req.user?.id,
        role: req.user?.role,
        stand: req.user?.stand
      }
    });
  });

module.exports = router;