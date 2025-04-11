const express = require('express');
const router = express.Router();

// Temporary Tip Route
router.get('/', (req, res) => {
  res.send('💡 Tips route working!');
});

module.exports = router;
