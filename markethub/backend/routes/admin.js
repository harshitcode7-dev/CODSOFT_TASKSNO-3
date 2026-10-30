const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const pool = require('../config/database');

router.get('/dashboard', protect, authorize('ADMIN'), async (req, res) => {
  try {
    // Get dashboard stats
    const totalRevenue = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'COMPLETED'");
    const totalVendors = await pool.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'APPROVED'");
    const pendingVendors = await pool.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'PENDING'");
    const totalCustomers = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'");
    const totalProducts = await pool.query("SELECT COUNT(*) as count FROM products WHERE status = 'ACTIVE'");
    const totalOrders = await pool.query('SELECT COUNT(*) as count FROM orders');
    const pendingOrders = await pool.query("SELECT COUNT(*) as count FROM orders WHERE order_status = 'PLACED'");

    const platformRevenue = await pool.query("SELECT COALESCE(SUM(commission_amount), 0) as total FROM commissions WHERE status = 'RELEASED'");

    res.status(200).json({
      success: true,
      stats: {
        total_revenue: totalRevenue.rows[0].total,
        platform_revenue: platformRevenue.rows[0].total,
        total_vendors: totalVendors.rows[0].count,
        pending_vendors: pendingVendors.rows[0].count,
        total_customers: totalCustomers.rows[0].count,
        total_products: totalProducts.rows[0].count,
        total_orders: totalOrders.rows[0].count,
        pending_orders: pendingOrders.rows[0].count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

router.get('/vendors/pending', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.*, u.email, u.first_name, u.last_name, u.phone
       FROM vendors v
       LEFT JOIN users u ON v.user_id = u.id
       WHERE v.status = 'PENDING'
       ORDER BY v.created_at DESC`
    );

    res.status(200).json({
      success: true,
      vendors: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending vendors'
    });
  }
});

router.get('/products/pending', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, v.business_name, c.name as category_name
       FROM products p
       LEFT JOIN vendors v ON p.vendor_id = v.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'PENDING_APPROVAL'
       ORDER BY p.created_at DESC`
    );

    res.status(200).json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending products'
    });
  }
});

router.put('/products/:id/approve', protect, authorize('ADMIN'), async (req, res) => {
  try {
    await pool.query(
      "UPDATE products SET status = 'ACTIVE' WHERE id = $1",
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Product approved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving product'
    });
  }
});

router.put('/products/:id/reject', protect, authorize('ADMIN'), async (req, res) => {
  try {
    await pool.query(
      "UPDATE products SET status = 'REJECTED' WHERE id = $1",
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Product rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting product'
    });
  }
});

module.exports = router;
