/**
 * userRoutes.js
 * Routes for admin-level user management.
 *
 * These endpoints let administrators list all accounts and remove users.
 * Authentication (login/register) is handled separately by authRoutes.js.
 */

// Import the Express framework so we can create routes.
const express = require('express');
// Create a new router instance.
const router = express.Router();
// Import the user management controller functions.
const { getAllUsers, deleteUser } = require('../controllers/userController');
// Import middleware for JWT authentication and role-based access.
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/users — Admin can view all registered accounts.
router.get('/', protect, authorize('admin'), getAllUsers);

// DELETE /api/users/:id — Admin can delete a user account.
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Export the router so it can be mounted in app.js.
module.exports = router;
