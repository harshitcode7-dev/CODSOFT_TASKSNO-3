const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/profile', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

module.exports = router;
