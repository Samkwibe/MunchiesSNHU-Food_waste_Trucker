/**
 * staffController.js
 * Handles staff-specific management operations.
 *
 * Current scope: Listing staff members for the admin dashboard.
 * Future work: Add endpoints for assigning staff to specific bin zones,
 * viewing staff activity logs, and managing shift schedules.
 */

const User = require('../models/User');

/**
 * @desc    Get all staff members (admin view)
 * @route   GET /api/staff
 * @access  Private (admin)
 */
const getStaffList = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('name email role createdAt');
    res.json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    console.error('Error fetching staff list:', err.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve staff list' });
  }
};

/**
 * @desc    Assign a staff member to a bin zone (planned feature)
 * @route   PUT /api/staff/:id/assign
 * @access  Private (admin)
 */
const assignBin = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Bin zone assignment is planned for a future release. '
           + 'Staff members currently self-select locations when entering waste data.'
  });
};

module.exports = {
  getStaffList,
  assignBin
};
