const express = require('express');
const { signup, login, forgotPassword, resetPassword, createMember } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-member', protect, adminOnly, createMember);

module.exports = router;
