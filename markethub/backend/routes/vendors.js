const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.*, u.email, u.first_name, u.last_name, u.phone
       FROM vendors v
       LEFT JOIN users u ON v.user_id = u.id
       ORDER BY v.created_at DESC`
    );

    res.status(200).json({
      success: true,
      vendors: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors'
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { business_name, gst_number, pan_number, bank_name, bank_account_number, bank_ifsc, business_description, business_address, city, state, pincode } = req.body;

    const result = await pool.query(
      `INSERT INTO vendors (user_id, business_name, gst_number, pan_number, bank_name, bank_account_number, bank_ifsc, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
       RETURNING *`,
      [req.body.user_id, business_name, gst_number, pan_number, bank_name, bank_account_number, bank_ifsc]
    );

    res.status(201).json({
      success: true,
      vendor: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering vendor'
    });
  }
});

router.put('/:id/approve', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE vendors SET status = 'APPROVED' WHERE id = $1",
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Vendor approved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving vendor'
    });
  }
});

module.exports = router;
