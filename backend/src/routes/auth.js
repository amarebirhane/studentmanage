const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const { registerSchema, loginSchema } = require('../utils/validation');

router.post('/register', protect, admin, validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;

