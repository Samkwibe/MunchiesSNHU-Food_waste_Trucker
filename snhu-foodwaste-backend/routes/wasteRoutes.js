const express = require('express');
const router = express.Router();

// Simple test route
router.post('/add', (req, res) => {
  const wasteData = req.body;
  console.log('📦 Received waste data:', wasteData);
  res.status(200).json({ message: 'Waste entry received', data: wasteData });
});

module.exports = router;
