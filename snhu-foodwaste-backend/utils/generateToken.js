/**
 * generateToken.js
 * Creates a signed JSON Web Token for authenticated users.
 *
 * This utility centralises token creation so every part of the app
 * (registration, login, future token refresh) uses the same signing
 * configuration.  Previously the logic was duplicated inside
 * authController.js; it now lives here for reusability.
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT containing the user's ID and role.
 *
 * @param {string} id   - The user's unique MongoDB _id.
 * @param {string} role - The user's role (e.g. 'student', 'staff', 'admin').
 * @returns {string} A signed JWT string valid for 30 days.
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
