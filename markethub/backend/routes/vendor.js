const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/dashboard', protect, authorize('VENDOR'), async (req, res) => {
  try {
    const userId = req.user.id;

    const vendorResult = await pool.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [userId]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const vendorId = vendorResult.rows[0].id;

    const totalSales = await pool.query("SELECT COALESCE(SUM(vendor_earnings), 0) as total FROM vendor_orders WHERE vendor_id = $1 AND order_status = 'DELIVERED'", [vendorId]);
    const totalOrders = await pool.query('SELECT COUNT(*) as count FROM vendor_orders WHERE vendor_id = $1', [vendorId]);
    const totalProducts = await pool.query("SELECT COUNT(*) as count FROM products WHERE vendor_id = $1 AND status = 'ACTIVE'", [vendorId]);
    const pendingOrders = await pool.query("SELECT COUNT(*) as count FROM vendor_orders WHERE vendor_id = $1 AND order_status = 'PLACED'", [vendorId]);
    const earnings = await pool.query('SELECT total_earnings, available_balance FROM vendors WHERE id = $1', [vendorId]);

    const lowStock = await pool.query(
      `SELECT COUNT(*) as count FROM inventory i
       LEFT JOIN products p ON i.product_id = p.id
       WHERE p.vendor_id = $1 AND i.available_stock <= i.minimum_stock`,
      [vendorId]
    );

    res.status(200).json({
      success: true,
      stats: {
        total_sales: totalSales.rows[0].total,
        total_orders: totalOrders.rows[0].count,
        total_products: totalProducts.rows[0].count,
        pending_orders: pendingOrders.rows[0].count,
        total_earnings: earnings.rows[0].total_earnings,
        available_balance: earnings.rows[0].available_balance,
        low_stock: lowStock.rows[0].count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

router.get('/orders', protect, authorize('VENDOR'), async (req, res) => {
  try {
    const userId = req.user.id;

    const vendorResult = await pool.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [userId]
    );

    const vendorId = vendorResult.rows[0].id;

    const result = await pool.query(
      `SELECT vo.*, o.order_number, o.user_id
       FROM vendor_orders vo
       LEFT JOIN orders o ON vo.main_order_id = o.id
       WHERE vo.vendor_id = $1
       ORDER BY vo.created_at DESC`,
      [vendorId]
    );

    res.status(200).json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

router.get('/products', protect, authorize('VENDOR'), async (req, res) => {
  try {
    const userId = req.user.id;

    const vendorResult = await pool.query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [userId]
    );

    const vendorId = vendorResult.rows[0].id;

    const result = await pool.query(
      `SELECT p.*, c.name as category_name, i.current_stock, i.available_stock
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.vendor_id = $1
       ORDER BY p.created_at DESC`,
      [vendorId]
    );

    res.status(200).json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

router.put('/orders/:id/status', protect, authorize('VENDOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    await pool.query(
      `UPDATE vendor_orders
       SET order_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [order_status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
});

module.exports = router;
