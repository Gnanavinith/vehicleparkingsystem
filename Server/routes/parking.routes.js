const express = require('express');
const router = express.Router();
const { protect, staffOnly, allRoles } = require('../middleware/auth.middleware');
const {
  createParking,
  checkoutParking,
  checkoutParkingById,
  getTodayParking,
  getActiveParkings,
  getParkingByToken,
  searchParkingByVehicleNumber,
  getAllParkings
} = require('../controllers/parking.controller');

// Define the route for getting all parkings (accessible to all authenticated users)
// This route has protect + allRoles middleware
router.route('/').get(protect, allRoles, getAllParkings);

// Define the route for creating new parkings (accessible to staff only)
// This route has protect + staffOnly middleware
router.route('/').post(protect, staffOnly, createParking);

// Define other routes that require staff-only access
router.route('/in').post(protect, staffOnly, createParking);
router.route('/out').post(protect, staffOnly, checkoutParking);
router.route('/today').get(protect, staffOnly, getTodayParking);
router.route('/active').get(protect, staffOnly, getActiveParkings);
router.route('/token/:tokenId').get(protect, staffOnly, getParkingByToken);
router.route('/search').get(protect, staffOnly, searchParkingByVehicleNumber);
router.route('/:id/checkout').post(protect, staffOnly, checkoutParkingById);

module.exports = router;