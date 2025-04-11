const express = require('express');
const router = express.Router();

// Temporary feedback route (placeholder)
router.get('/', (req, res) => {
  res.send('📝 Feedback route working!');
});

module.exports = router;
