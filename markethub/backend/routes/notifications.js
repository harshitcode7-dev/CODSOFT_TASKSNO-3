const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    res.status(200).json({
      success: true,
      notifications: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
});

module.exports = router;
