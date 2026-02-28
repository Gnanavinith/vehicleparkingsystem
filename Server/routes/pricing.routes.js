const express = require('express');
const router = express.Router();
const { protect, superAdminOnly, allRoles } = require('../middleware/auth.middleware');
const { 
  getPricing,
  updatePricing,
  getVehiclePricing,
  getStandPricing
} = require('../controllers/pricing.controller');

// Super admin routes
router.route('/')
  .get(protect, superAdminOnly, getPricing)
  .put(protect, superAdminOnly, updatePricing);

router.route('/:vehicleType')
  .get(protect, superAdminOnly, getVehiclePricing);

// Staff routes - read-only access to pricing for their stand
router.route('/stand')
  .get(protect, allRoles, getStandPricing);

// Test route - no authentication required
router.route('/test')
  .get((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Test route working'
    });
  });

module.exports = router;