/**
 * tipsController.js
 * Controller for sustainability tips CRUD operations.
 */

const Tip = require('../models/Tip'); // Ensure you have a Tip model defined

const getTips = async (req, res) => {
  try {
    // This looks for all tips in the database that are marked as active (active: true).
    // It's useful so we can disable tips without deleting them.
    const tips = await Tip.find({ active: true });
    
    // If everything goes well, send the array of tips back as JSON.
    res.json(tips);
  } catch (err) {
    // If there's a problem connecting to the database, we catch the error here,
    // log it to the server console, and return a 500 Server Error to the user.
    console.error('Error fetching tips:', err);
    res.status(500).json({ message: 'Failed to retrieve sustainability tips' });
  }
};

const getTipById = async (req, res) => {
  try {
    // We take the ID from the end of the URL (like /api/tips/12345)
    // and use it to ask the database for that specific tip document.
    const tip = await Tip.findById(req.params.id);
    
    // If the database couldn't find a tip with that ID, we return a 404 error.
    if (!tip) return res.status(404).json({ message: 'Tip not found' });
    
    // If it is found, send the tip data back as JSON.
    res.json(tip);
  } catch (err) {
    console.error('Error fetching tip by ID:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createTip = (req, res) => {
  // This is a placeholder function for when we want to allow admins to create new tips via the UI.
  // The 501 status means "Not Implemented". It returns a friendly message instead of crashing.
  res.status(501).json({
    success: false,
    message: 'Tip creation is planned for a future release. '
           + 'A database-backed Tip model will replace the current hardcoded list.'
  });
};

// We export these functions so the tipRoutes.js file can attach them to URL endpoints.
module.exports = {
  getTips,
  getTipById,
  createTip
};
