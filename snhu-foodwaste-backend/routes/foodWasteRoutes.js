// routes/foodWasteRoutes.js

// Import the Express framework to create our server routes
const express = require('express');
// Create a new router object from Express
const router = express.Router();
// Import the FoodWasteEntry model (still needed for routes that keep inline logic).
const FoodWasteEntry = require('../models/FoodWasteEntry');
// Import middleware that checks the JWT and verifies staff/admin roles.
const { protect, authorize } = require('../middleware/authMiddleware');
// Import the helper that calculates and sorts pickup priority scores.
const { rankWasteEntries } = require('../utils/wastePriority');
// Import controller functions that handle the core CRUD business logic.
const {
  getPublishedEntries,
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry
} = require('../controllers/wasteEntryController');

const sendError = (res, statusCode, message) => res.status(statusCode).json({
  success: false,
  message
});

// 1. GET all published entries (students can see these)
// Define a GET route at the root path '/' with an asynchronous callback function taking request (req) and response (res)
router.get('/', getPublishedEntries);

// 2. GET all entries for staff/admin management
router.get('/all', protect, authorize('staff', 'admin'), getAllEntries);

// 3. GET ranked pickup priorities for staff/admin users
router.get('/priority', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    // Pull the latest 50 entries so the priority screen focuses on recent operational data.
    const entries = await FoodWasteEntry.find().sort({ createdAt: -1 }).limit(50);
    // rankWasteEntries adds priorityScore, priorityLevel, and reasons to each entry.
    res.json(rankWasteEntries(entries));
  } catch (err) {
    // Return a 500 response if priority data cannot be loaded.
    sendError(res, 500, err.message);
  }
});

// 4. GET reporting summary using MongoDB aggregation
router.get('/reports/summary', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    // This aggregation produces one overall summary document for the dashboard KPI cards.
    const [totals] = await FoodWasteEntry.aggregate([
      {
        // $group combines all records into one group because _id is null.
        $group: {
          _id: null,
          // Add up all recorded waste weight.
          totalWaste: { $sum: '$weight' },
          // Add up all recorded compost weight.
          totalCompost: { $sum: '$compostWeight' },
          // Average the latest sensor-style readings for high-level reporting.
          averageBinFullness: { $avg: '$binFullness' },
          averageHumidity: { $avg: '$humidity' },
          averagePH: { $avg: '$pH' },
          // Count the number of entries included in the report.
          entryCount: { $sum: 1 }
        }
      }
    ]);

    // This aggregation groups records by location so staff can see which areas generate the most waste.
    const byLocation = await FoodWasteEntry.aggregate([
      {
        $group: {
          // The location becomes the grouping key.
          _id: '$location',
          // These fields summarize waste and compost amounts for each location.
          totalWaste: { $sum: '$weight' },
          totalCompost: { $sum: '$compostWeight' },
          averageBinFullness: { $avg: '$binFullness' },
          entryCount: { $sum: 1 }
        }
      },
      // Sort highest waste locations first so the table is more useful.
      { $sort: { totalWaste: -1 } }
    ]);

    // This aggregation groups records by date for charting daily trends.
    const dailyTrend = await FoodWasteEntry.aggregate([
      {
        $group: {
          _id: {
            // Convert the Date value into YYYY-MM-DD so entries from the same day group together.
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          // Sum and average the important reporting fields for each day.
          totalWaste: { $sum: '$weight' },
          totalCompost: { $sum: '$compostWeight' },
          averageBinFullness: { $avg: '$binFullness' },
          entryCount: { $sum: 1 }
        }
      },
      // Sort dates from oldest to newest for the chart.
      { $sort: { _id: 1 } },
      // Limit the result so the frontend chart stays readable.
      { $limit: 14 }
    ]);

    // Use 0 when there are no records yet so the frontend does not receive undefined values.
    const totalWaste = totals?.totalWaste || 0;
    const totalCompost = totals?.totalCompost || 0;

    // Send one combined report object to the dashboard and report pages.
    res.json({
      totalWaste,
      totalCompost,
      // Compost diversion rate shows what percent of waste was redirected to compost.
      compostDiversionRate: totalWaste > 0
        ? Math.min(100, Math.round((totalCompost / totalWaste) * 100))
        : 0,
      // Round averages so KPI cards show clean numbers.
      averageBinFullness: Math.round(totals?.averageBinFullness || 0),
      averageHumidity: Math.round(totals?.averageHumidity || 0),
      averagePH: Number((totals?.averagePH || 0).toFixed(1)),
      entryCount: totals?.entryCount || 0,
      byLocation,
      dailyTrend
    });
  } catch (err) {
    // If any aggregation fails, return a server error.
    sendError(res, 500, err.message);
  }
});

// 5. POST new waste entry (staff/admin usage)
// Delegates to the controller so business logic stays in the MVC controller layer.
router.post('/', protect, authorize('staff', 'admin'), createEntry);

// 6. PUT to update an existing waste entry
router.put('/:id', protect, authorize('staff', 'admin'), updateEntry);

// 7. PUT to publish/unpublish an entry
// Define a PUT route with a dynamic parameter ':id' for the entry's unique ID
router.put('/:id/publish', protect, authorize('staff', 'admin'), async (req, res) => {
  // Start a try block
  try {
    // Await finding the specific entry in the database using the ID from the URL (req.params.id)
    const entry = await FoodWasteEntry.findById(req.params.id);
    // If no entry is found with that ID, return a 404 (Not Found) error
    if (!entry) return sendError(res, 404, 'Entry not found');

    // Update the 'published' property of the entry with the value from the request body (true or false)
    entry.published = req.body.published; // true or false
    // Await saving the updated entry back into the database
    await entry.save();

    // Send a success message and the updated entry back as JSON
    res.json({ message: 'Entry updated', entry });
  // Catch any errors during the update process
  } catch (err) {
    // Send a 500 status code and the error message
    sendError(res, 500, err.message);
  }
});

// 8. DELETE an existing waste entry
router.delete('/:id', protect, authorize('staff', 'admin'), deleteEntry);

// Export the router so it can be used in the main server file
module.exports = router;
