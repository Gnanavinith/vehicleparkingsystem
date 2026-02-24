const express = require('express');
const router = express.Router();
const { protect, adminRoles, superAdminOnly } = require('../middleware/auth.middleware');
const { 
  getStands, 
  getStand, 
  createStand, 
  updateStand, 
  deleteStand, 
  assignAdmin 
} = require('../controllers/stand.controller');

router.route('/')
  .get(protect, getStands)
  .post(protect, superAdminOnly, createStand);

router.route('/:id')
  .get(protect, getStand)
  .put(protect, superAdminOnly, updateStand)
  .delete(protect, superAdminOnly, deleteStand);

router.put('/:id/assign-admin', protect, superAdminOnly, assignAdmin);

module.exports = router;