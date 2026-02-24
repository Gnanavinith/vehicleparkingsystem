const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { register, login, loginSuperAdmin, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/register', protect, register);
router.post('/login', login);
router.post('/login-super-admin', loginSuperAdmin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;