const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser,
  getCurrentUser,
  updateUserProfile
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Routes (No authentication needed)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Require valid JWT)
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateUserProfile);

// Admin-only Route Example
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;