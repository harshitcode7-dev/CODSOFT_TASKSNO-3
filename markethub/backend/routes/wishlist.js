const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistResult = await pool.query(
      'SELECT id FROM wishlists WHERE user_id = $1',
      [userId]
    );

    if (wishlistResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        items: []
      });
    }

    const wishlistId = wishlistResult.rows[0].id;

    const itemsResult = await pool.query(
      `SELECT wi.*, p.name, p.price, p.discount_price, p.discount_percentage, p.slug,
              pi.image_url as primary_image, v.business_name as vendor_name
       FROM wishlist_items wi
       LEFT JOIN products p ON wi.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
       LEFT JOIN vendors v ON p.vendor_id = v.id
       WHERE wi.wishlist_id = $1
       ORDER BY wi.added_at DESC`,
      [wishlistId]
    );

    res.status(200).json({
      success: true,
      items: itemsResult.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist'
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user.id;

    let wishlistResult = await pool.query(
      'SELECT id FROM wishlists WHERE user_id = $1',
      [userId]
    );

    let wishlistId;
    if (wishlistResult.rows.length === 0) {
      wishlistResult = await pool.query(
        'INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
    }
    wishlistId = wishlistResult.rows[0].id;

    await pool.query(
      'INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2)',
      [wishlistId, product_id]
    );

    res.status(201).json({
      success: true,
      message: 'Added to wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist'
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM wishlist_items WHERE id = $1',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist'
    });
  }
});

module.exports = router;
