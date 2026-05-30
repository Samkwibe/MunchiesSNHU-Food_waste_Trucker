/**
 * wasteEntryController.js
 * Controller for food waste entry CRUD operations.
 *
 * This file contains the business logic for creating, reading, updating,
 * and deleting food waste entries.  The route file (foodWasteRoutes.js)
 * delegates to these functions, keeping the MVC layers separate.
 */

const FoodWasteEntry = require('../models/FoodWasteEntry');
const { sanitizeWasteBody, formatMongooseError } = require('../utils/sanitizeWasteBody');

// Shared helper for sending error responses in a consistent format.
const sendError = (res, statusCode, message) => res.status(statusCode).json({
  success: false,
  message
});

/**
 * @desc    Get all published waste entries (student-facing)
 * @route   GET /api/waste
 * @access  Public
 */
const getPublishedEntries = async (req, res) => {
  try {
    const entries = await FoodWasteEntry.find({ published: true }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching published entries:', err.message);
    sendError(res, 500, 'Failed to retrieve published entries');
  }
};

/**
 * @desc    Get all waste entries for staff management
 * @route   GET /api/waste/all
 * @access  Private (staff, admin)
 */
const getAllEntries = async (req, res) => {
  try {
    const entries = await FoodWasteEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching all entries:', err.message);
    sendError(res, 500, 'Failed to retrieve entries');
  }
};

/**
 * @desc    Create a new waste entry
 * @route   POST /api/waste
 * @access  Private (staff, admin)
 */
const createEntry = async (req, res) => {
  try {
    // Validate and sanitize the incoming request body.
    const entryFields = sanitizeWasteBody(req.body);
    // Create the entry, linking it to the authenticated user and defaulting to unpublished.
    const newEntry = await FoodWasteEntry.create({
      submittedBy: req.user._id,
      ...entryFields,
      published: false
    });
    res.status(201).json(newEntry);
  } catch (err) {
    sendError(res, err.statusCode || 400, formatMongooseError(err));
  }
};

/**
 * @desc    Update an existing waste entry
 * @route   PUT /api/waste/:id
 * @access  Private (staff, admin)
 */
const updateEntry = async (req, res) => {
  try {
    // Validate and sanitize only the editable fields from the request body.
    const entryFields = sanitizeWasteBody(req.body);
    const entry = await FoodWasteEntry.findByIdAndUpdate(
      req.params.id,
      entryFields,
      { new: true, runValidators: true }
    );

    if (!entry) return sendError(res, 404, 'Entry not found');
    return res.json(entry);
  } catch (err) {
    return sendError(res, err.statusCode || 400, formatMongooseError(err));
  }
};

/**
 * @desc    Delete a waste entry
 * @route   DELETE /api/waste/:id
 * @access  Private (staff, admin)
 */
const deleteEntry = async (req, res) => {
  try {
    const entry = await FoodWasteEntry.findByIdAndDelete(req.params.id);
    if (!entry) return sendError(res, 404, 'Entry not found');
    return res.json({ message: 'Entry deleted' });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

module.exports = {
  getPublishedEntries,
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry
};
