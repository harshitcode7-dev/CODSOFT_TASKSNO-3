const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/assignments', protect, authorize('DELIVERY_PARTNER'), async (req, res) => {
  try {
    const userId = req.user.id;

    // Get orders assigned to this delivery partner
    const result = await pool.query(
      `SELECT o.*, a.full_name, a.phone, a.city, a.state, a.pincode
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.order_status IN ('SHIPPED', 'OUT_FOR_DELIVERY')
       ORDER BY o.created_at DESC`
    );

    res.status(200).json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery assignments'
    });
  }
});

router.put('/:id/status', protect, authorize('DELIVERY_PARTNER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    await pool.query(
      `UPDATE orders
       SET order_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [order_status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Delivery status updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery status'
    });
  }
});

module.exports = router;
