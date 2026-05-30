/**
 * tipsController.js
 * Handles sustainability tip retrieval and creation.
 *
 * Future work: Create a Tip Mongoose model and persist tips in MongoDB
 * so staff can add, edit, and delete tips through the dashboard.
 */

// Hardcoded tips used until a database-backed Tip model is created.
const DEFAULT_TIPS = [
  { id: 1, title: 'Compost First', body: 'Separate compostable food scraps before disposing of waste to improve the campus diversion rate.' },
  { id: 2, title: 'Portion Awareness', body: 'Take only what you plan to eat. Smaller portions reduce plate waste significantly.' },
  { id: 3, title: 'Check Expiry Dates', body: 'Rotate stock so items expiring soonest are used first, preventing unnecessary spoilage.' },
  { id: 4, title: 'Report Overflows', body: 'If a bin exceeds 80 percent fullness, notify staff so pickup can be prioritized.' },
  { id: 5, title: 'Reuse Containers', body: 'Bring reusable containers for leftovers instead of discarding excess food.' }
];

/**
 * @desc    Get all sustainability tips
 * @route   GET /api/tips
 * @access  Public
 */
const getTips = (req, res) => {
  res.json({ success: true, count: DEFAULT_TIPS.length, data: DEFAULT_TIPS });
};

/**
 * @desc    Create a new sustainability tip (placeholder)
 * @route   POST /api/tips
 * @access  Private (staff, admin)
 */
const createTip = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Tip creation is planned for a future release. '
           + 'A database-backed Tip model will replace the current hardcoded list.'
  });
};

module.exports = {
  getTips,
  createTip
};
