const express = require('express');
const router = express.Router();
const { protect, adminRoles } = require('../middleware/auth.middleware');
const { 
  getDailyReport, 
  getMonthlyReport, 
  getStandReport, 
  getRevenueStats 
} = require('../controllers/report.controller');

router.get('/daily', protect, adminRoles, getDailyReport);
router.get('/monthly', protect, adminRoles, getMonthlyReport);
router.get('/stand/:standId', protect, adminRoles, getStandReport);
router.get('/revenue', protect, adminRoles, getRevenueStats);

module.exports = router;