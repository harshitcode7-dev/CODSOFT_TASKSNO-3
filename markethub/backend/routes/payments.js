const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pool = require('../config/database');

router.post('/', protect, async (req, res) => {
  try {
    const { order_id, payment_method, amount } = req.body;

    // Simulate payment processing
    const paymentId = 'PAY-' + Date.now().toString().slice(-8);
    const transactionId = 'TXN-' + Math.random().toString(36).substring(7).toUpperCase();

    const result = await pool.query(
      `INSERT INTO payments (order_id, payment_id, amount, payment_method, payment_status, transaction_id, payment_date)
       VALUES ($1, $2, $3, $4, 'COMPLETED', $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [order_id, paymentId, amount, payment_method, transactionId]
    );

    // Update order payment status
    await pool.query(
      "UPDATE orders SET payment_status = 'COMPLETED' WHERE id = $1",
      [order_id]
    );

    res.status(201).json({
      success: true,
      message: 'Payment successful',
      payment: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment'
    });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      payment: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment'
    });
  }
});

module.exports = router;
