const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );

    res.status(200).json({
      success: true,
      addresses: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses'
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { address_type, full_name, phone, house_flat, street, city, state, pincode, landmark, is_default } = req.body;

    // If setting as default, remove default from other addresses
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const result = await pool.query(
      `INSERT INTO addresses (user_id, address_type, full_name, phone, house_flat, street, city, state, pincode, landmark, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [userId, address_type, full_name, phone, house_flat, street, city, state, pincode, landmark, is_default]
    );

    // Update customer default address if this is default
    if (is_default) {
      await pool.query(
        'UPDATE customers SET default_address_id = $1 WHERE user_id = $2',
        [result.rows[0].id, userId]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding address'
    });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { address_type, full_name, phone, house_flat, street, city, state, pincode, landmark, is_default } = req.body;

    // If setting as default, remove default from other addresses
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const result = await pool.query(
      `UPDATE addresses
       SET address_type = COALESCE($1, address_type),
           full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           house_flat = COALESCE($4, house_flat),
           street = COALESCE($5, street),
           city = COALESCE($6, city),
           state = COALESCE($7, state),
           pincode = COALESCE($8, pincode),
           landmark = COALESCE($9, landmark),
           is_default = COALESCE($10, is_default),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [address_type, full_name, phone, house_flat, street, city, state, pincode, landmark, is_default, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Update customer default address if this is default
    if (is_default) {
      await pool.query(
        'UPDATE customers SET default_address_id = $1 WHERE user_id = $2',
        [id, userId]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address'
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting address'
    });
  }
});

module.exports = router;
