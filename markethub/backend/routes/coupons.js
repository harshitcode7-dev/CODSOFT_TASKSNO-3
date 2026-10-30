const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM coupons WHERE is_active = true AND valid_until >= CURRENT_TIMESTAMP ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      coupons: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons'
    });
  }
});

router.post('/validate', protect, async (req, res) => {
  try {
    const { code, order_amount } = req.body;

    const result = await pool.query(
      `SELECT * FROM coupons WHERE code = $1 AND is_active = true
       AND valid_from <= CURRENT_TIMESTAMP AND valid_until >= CURRENT_TIMESTAMP`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    const coupon = result.rows[0];

    if (order_amount < coupon.minimum_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount ₹${coupon.minimum_order_amount} required`
      });
    }

    let discountAmount;
    if (coupon.discount_type === 'PERCENTAGE') {
      discountAmount = (order_amount * coupon.discount_value) / 100;
      if (coupon.maximum_discount && discountAmount > coupon.maximum_discount) {
        discountAmount = coupon.maximum_discount;
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    res.status(200).json({
      success: true,
      coupon,
      discount_amount: discountAmount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating coupon'
    });
  }
});

module.exports = router;
