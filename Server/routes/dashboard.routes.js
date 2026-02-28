const express = require('express');
const router = express.Router();
const { protect, adminRoles } = require('../middleware/auth.middleware');
const { 
  getDashboardStats
} = require('../controllers/dashboard.controller');

// Admin routes (super_admin and stand_admin)
router.route('/stats')
  .get(protect, adminRoles, getDashboardStats);

module.exports = router;