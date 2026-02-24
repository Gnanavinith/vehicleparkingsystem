const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/auth.middleware');
const {
  createParking,
  checkoutParking,
  getTodayParking,
  getActiveParkings,
  getParkingByToken
} = require('../controllers/parking.controller');

// All routes require authentication and staff role
router.use(protect, staffOnly);

// Parking operations
router.route('/in').post(createParking);
router.route('/out').post(checkoutParking);
router.route('/today').get(getTodayParking);
router.route('/active').get(getActiveParkings);
router.route('/token/:tokenId').get(getParkingByToken);

module.exports = router;