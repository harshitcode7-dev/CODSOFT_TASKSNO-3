const pool = require('../config/database');

exports.createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { address_id, payment_method, coupon_code } = req.body;
    const userId = req.user.id;

    // Get user's cart
    const cartResult = await client.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const cartId = cartResult.rows[0].id;

    // Get cart items
    const cartItemsResult = await client.query(
      `SELECT ci.*, p.vendor_id, p.name, p.sku, p.price, p.discount_price
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (cartItemsResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const cartItems = cartItemsResult.rows;

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.discount_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    // Apply coupon if provided
    let discountAmount = 0;
    let couponId = null;

    if (coupon_code) {
      const couponResult = await client.query(
        `SELECT * FROM coupons WHERE code = $1 AND is_active = true
         AND valid_from <= CURRENT_TIMESTAMP AND valid_until >= CURRENT_TIMESTAMP`,
        [coupon_code]
      );

      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];
        if (subtotal >= coupon.minimum_order_amount) {
          if (coupon.discount_type === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.discount_value) / 100;
            if (coupon.maximum_discount && discountAmount > coupon.maximum_discount) {
              discountAmount = coupon.maximum_discount;
            }
          } else {
            discountAmount = coupon.discount_value;
          }
          couponId = coupon.id;
        }
      }
    }

    // Calculate shipping and tax
    const shippingCharge = subtotal > 999 ? 0 : 99;
    const taxAmount = (subtotal - discountAmount) * 0.18;
    const totalAmount = subtotal - discountAmount + shippingCharge + taxAmount;

    // Generate order number
    const orderNumber = 'MH-' + Date.now().toString().slice(-6);

    // Create main order
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount, coupon_id, shipping_charge, tax_amount, total_amount, payment_method, payment_status, order_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', 'PLACED')
       RETURNING *`,
      [orderNumber, userId, address_id, subtotal, discountAmount, couponId, shippingCharge, taxAmount, totalAmount, payment_method]
    );

    const order = orderResult.rows[0];

    // Group items by vendor
    const vendorGroups = {};
    cartItems.forEach(item => {
      if (!vendorGroups[item.vendor_id]) {
        vendorGroups[item.vendor_id] = [];
      }
      vendorGroups[item.vendor_id].push(item);
    });

    // Create vendor orders and order items
    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      // Get vendor commission rate
      const vendorResult = await client.query(
        'SELECT commission_rate FROM vendors WHERE id = $1',
        [vendorId]
      );

      const commissionRate = vendorResult.rows[0].commission_rate;

      const vendorSubtotal = items.reduce((sum, item) => {
        const price = item.discount_price || item.price;
        return sum + (price * item.quantity);
      }, 0);

      const commissionAmount = (vendorSubtotal * commissionRate) / 100;
      const vendorEarnings = vendorSubtotal - commissionAmount;

      const vendorOrderNumber = orderNumber + '-V' + vendorId;

      // Create vendor order
      const vendorOrderResult = await client.query(
        `INSERT INTO vendor_orders (vendor_order_number, main_order_id, vendor_id, subtotal, commission_rate, commission_amount, vendor_earnings, order_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'PLACED')
         RETURNING *`,
        [vendorOrderNumber, order.id, vendorId, vendorSubtotal, commissionRate, commissionAmount, vendorEarnings]
      );

      const vendorOrder = vendorOrderResult.rows[0];

      // Create order items and update inventory
      for (const item of items) {
        const price = item.discount_price || item.price;
        const itemTotal = price * item.quantity;

        await client.query(
          `INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_sku, quantity, price, total_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [order.id, item.product_id, vendorId, item.name, item.sku, item.quantity, price, itemTotal]
        );

        // Update inventory
        await client.query(
          `UPDATE inventory
           SET current_stock = current_stock - $1,
               reserved_stock = reserved_stock + $1,
               available_stock = current_stock - reserved_stock
           WHERE product_id = $2`,
          [item.quantity, item.product_id]
        );
      }

      // Create commission record
      await client.query(
        `INSERT INTO commissions (order_id, vendor_order_id, vendor_id, order_amount, commission_rate, commission_amount, vendor_earnings, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')`,
        [order.id, vendorOrder.id, vendorId, vendorSubtotal, commissionRate, commissionAmount, vendorEarnings]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    // Record coupon usage
    if (couponId) {
      await client.query(
        `INSERT INTO coupon_usage (coupon_id, user_id, order_id, discount_amount)
         VALUES ($1, $2, $3, $4)`,
        [couponId, userId, order.id, discountAmount]
      );

      await client.query(
        'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
        [couponId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, a.full_name, a.city, a.state
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (status) {
      query += ` AND o.order_status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderResult = await pool.query(
      `SELECT o.*, a.full_name, a.phone, a.house_flat, a.street, a.city, a.state, a.pincode
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = $1 AND o.user_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, pi.image_url, v.business_name as vendor_name
       FROM order_items oi
       LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.is_primary = true
       LEFT JOIN vendors v ON oi.vendor_id = v.id
       WHERE oi.order_id = $1`,
      [id]
    );

    order.items = itemsResult.rows;

    // Get vendor orders
    const vendorOrdersResult = await pool.query(
      'SELECT * FROM vendor_orders WHERE main_order_id = $1',
      [id]
    );

    order.vendor_orders = vendorOrdersResult.rows;

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const result = await pool.query(
      `UPDATE orders
       SET order_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [order_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

exports.cancelOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const userId = req.user.id;

    // Get order
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Check if order can be cancelled
    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.order_status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    await client.query(
      "UPDATE orders SET order_status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    // Restore inventory
    const itemsResult = await client.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [id]
    );

    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE inventory
         SET current_stock = current_stock + $1,
             reserved_stock = reserved_stock - $1,
             available_stock = current_stock - reserved_stock
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  } finally {
    client.release();
  }
};
