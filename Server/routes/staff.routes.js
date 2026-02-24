const express = require('express');
const router = express.Router();
const { protect, standAdminOnly } = require('../middleware/auth.middleware');
const { 
  getStaff, 
  getStaffMember, 
  createStaff, 
  updateStaff, 
  deleteStaff, 
  getStaffStats 
} = require('../controllers/staff.controller');

router.route('/')
  .get(protect, standAdminOnly, getStaff)
  .post(protect, standAdminOnly, createStaff);

router.route('/stats')
  .get(protect, standAdminOnly, getStaffStats);

router.route('/:id')
  .get(protect, standAdminOnly, getStaffMember)
  .put(protect, standAdminOnly, updateStaff)
  .delete(protect, standAdminOnly, deleteStaff);

module.exports = router;