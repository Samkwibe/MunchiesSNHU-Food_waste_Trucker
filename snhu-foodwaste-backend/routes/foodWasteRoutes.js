// routes/foodWasteRoutes.js

const express = require('express');
const router = express.Router();
const FoodWasteEntry = require('../models/FoodWasteEntry');

// 1. GET all published entries (students can see these)
router.get('/', async (req, res) => {
  try {
    // Only return where published = true
    const entries = await FoodWasteEntry.find({ published: true }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST new waste entry (staff usage)
router.post('/', async (req, res) => {
  try {
    // Staff calls this with body data
    const newEntry = await FoodWasteEntry.create({
      submittedBy: req.body.submittedBy, // staffId
      foodType: req.body.foodType,
      weight: req.body.weight,
      date: req.body.date,
      location: req.body.location,
      notes: req.body.notes,
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      pH: req.body.pH,
      gas: req.body.gas,
      binFullness: req.body.binFullness,
      compostWeight: req.body.compostWeight,
      published: false // default as false
    });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT to publish/unpublish an entry
router.put('/:id/publish', async (req, res) => {
  try {
    const entry = await FoodWasteEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    entry.published = req.body.published; // true or false
    await entry.save();

    res.json({ message: 'Entry updated', entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
