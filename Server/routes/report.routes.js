const express = require('express');
const router = express.Router();
const { protect, adminRoles } = require('../middleware/auth.middleware');
const { 
  getDailyReport, 
  getMonthlyReport, 
  getStandReport, 
  getRevenueStats,
  getDashboardStats,
  getOccupancyData,
  getZoneDistribution,
  getHourlyActivity
} = require('../controllers/report.controller');

router.get('/daily', protect, adminRoles, getDailyReport);
router.get('/monthly', protect, adminRoles, getMonthlyReport);
router.get('/stand/:standId', protect, adminRoles, getStandReport);
router.get('/revenue', protect, adminRoles, getRevenueStats);
router.get('/dashboard', protect, getDashboardStats);
router.get('/occupancy', protect, adminRoles, getOccupancyData);
router.get('/zones', protect, adminRoles, getZoneDistribution);
router.get('/hourly', protect, adminRoles, getHourlyActivity);

module.exports = router;