/**
 * notificationRoutes.js
 * Routes for user notification preference management.
 *
 * Any authenticated user can read and update their own notification
 * preferences (email, SMS, high-priority alerts).
 */

// Import the Express framework so we can create routes.
const express = require('express');
// Create a new router instance.
const router = express.Router();
// Import the notification preference controller functions.
const { getPreferences, updatePreferences } = require('../controllers/notificationController');
// Import middleware for JWT authentication.
const { protect } = require('../middleware/authMiddleware');

// GET /api/notifications/preferences — Get the current user's notification preferences.
router.get('/preferences', protect, getPreferences);

// PUT /api/notifications/preferences — Update the current user's notification preferences.
router.put('/preferences', protect, updatePreferences);

// Export the router so it can be mounted in app.js.
module.exports = router;
