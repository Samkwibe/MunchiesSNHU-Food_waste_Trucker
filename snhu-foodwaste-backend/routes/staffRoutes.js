/**
 * staffRoutes.js
 * Routes for staff-specific management operations.
 *
 * All routes are protected and require admin privileges because
 * staff management is an administrative function.
 */

// Import the Express framework so we can create routes.
const express = require('express');
// Create a new router instance.
const router = express.Router();
// Import the staff controller functions.
const { getStaffList, assignBin } = require('../controllers/staffController');
// Import middleware for JWT authentication and role-based access.
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/staff — Admin can view all staff members.
router.get('/', protect, authorize('admin'), getStaffList);

// PUT /api/staff/:id/assign — Admin can assign a staff member to a bin zone (planned feature).
router.put('/:id/assign', protect, authorize('admin'), assignBin);

// Export the router so it can be mounted in app.js.
module.exports = router;
