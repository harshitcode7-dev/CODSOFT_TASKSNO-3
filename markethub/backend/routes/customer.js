const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/dashboard', protect, authorize('CUSTOMER'), async (req, res) => {
  try {
    const userId = req.user.id;

    const totalOrders = await pool.query('SELECT COUNT(*) as count FROM orders WHERE user_id = $1', [userId]);
    const pendingOrders = await pool.query("SELECT COUNT(*) as count FROM orders WHERE user_id = $1 AND order_status IN ('PLACED', 'CONFIRMED', 'PROCESSING')", [userId]);
    const deliveredOrders = await pool.query("SELECT COUNT(*) as count FROM orders WHERE user_id = $1 AND order_status = 'DELIVERED'", [userId]);

    const wishlistResult = await pool.query(
      'SELECT id FROM wishlists WHERE user_id = $1',
      [userId]
    );

    let wishlistCount = 0;
    if (wishlistResult.rows.length > 0) {
      const wishlistItems = await pool.query(
        'SELECT COUNT(*) as count FROM wishlist_items WHERE wishlist_id = $1',
        [wishlistResult.rows[0].id]
      );
      wishlistCount = wishlistItems.rows[0].count;
    }

    res.status(200).json({
      success: true,
      stats: {
        total_orders: totalOrders.rows[0].count,
        pending_orders: pendingOrders.rows[0].count,
        delivered_orders: deliveredOrders.rows[0].count,
        wishlist_items: wishlistCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

module.exports = router;
