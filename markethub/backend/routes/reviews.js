const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/product/:productId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.is_approved = true
       ORDER BY r.created_at DESC`,
      [req.params.productId]
    );

    res.status(200).json({
      success: true,
      reviews: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { product_id, order_id, rating, title, review } = req.body;
    const userId = req.user.id;

    // Check if user purchased the product
    const orderCheck = await pool.query(
      `SELECT * FROM order_items
       WHERE order_id = $1 AND product_id = $2`,
      [order_id, product_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, order_id, rating, title, review, is_verified_purchase)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [product_id, userId, order_id, rating, title, review]
    );

    // Update product rating
    await pool.query(
      `UPDATE products
       SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1),
           total_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = $1)
       WHERE id = $1`,
      [product_id]
    );

    res.status(201).json({
      success: true,
      review: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review'
    });
  }
});

module.exports = router;
