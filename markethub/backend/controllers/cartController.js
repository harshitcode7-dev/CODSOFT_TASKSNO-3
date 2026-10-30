const pool = require('../config/database');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cartResult;
    if (userId) {
      cartResult = await pool.query(
        'SELECT * FROM carts WHERE user_id = $1',
        [userId]
      );
    } else {
      // For guest users, use session_id
      const { session_id } = req.body;
      cartResult = await pool.query(
        'SELECT * FROM carts WHERE session_id = $1',
        [session_id]
      );
    }

    if (cartResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        cart: { items: [], subtotal: 0 }
      });
    }

    const cart = cartResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT ci.*, p.name, p.price, p.discount_price, p.discount_percentage,
              p.slug, pi.image_url as primary_image, v.business_name as vendor_name
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
       LEFT JOIN vendors v ON p.vendor_id = v.id
       WHERE ci.cart_id = $1`,
      [cart.id]
    );

    const items = itemsResult.rows;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      cart: {
        id: cart.id,
        items,
        subtotal
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity, session_id } = req.body;
    const userId = req.user ? req.user.id : null;

    // Get or create cart
    let cartId;
    if (userId) {
      let cartResult = await pool.query(
        'SELECT id FROM carts WHERE user_id = $1',
        [userId]
      );

      if (cartResult.rows.length === 0) {
        cartResult = await pool.query(
          'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
          [userId]
        );
      }
      cartId = cartResult.rows[0].id;
    } else {
      let cartResult = await pool.query(
        'SELECT id FROM carts WHERE session_id = $1',
        [session_id]
      );

      if (cartResult.rows.length === 0) {
        cartResult = await pool.query(
          'INSERT INTO carts (session_id) VALUES ($1) RETURNING id',
          [session_id]
        );
      }
      cartId = cartResult.rows[0].id;
    }

    // Get product price
    const productResult = await pool.query(
      'SELECT price FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const price = productResult.rows[0].price;

    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [quantity, existingItem.rows[0].id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [cartId, product_id, quantity, price]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantity, id]
    );

    res.status(200).json({
      success: true,
      message: 'Cart item updated'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM cart_items WHERE id = $1',
      [id]
    );

    res.status(200).json({
      success: false,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length > 0) {
      await pool.query(
        'DELETE FROM cart_items WHERE cart_id = $1',
        [cartResult.rows[0].id]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};
