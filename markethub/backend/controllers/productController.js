const pool = require('../config/database');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, vendor, search, min_price, max_price, sort, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, v.business_name as vendor_name, c.name as category_name,
             pi.image_url as primary_image
      FROM products p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.status = 'ACTIVE'
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND p.category_id = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (vendor) {
      query += ` AND p.vendor_id = $${paramCount}`;
      params.push(vendor);
      paramCount++;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (min_price) {
      query += ` AND p.price >= $${paramCount}`;
      params.push(min_price);
      paramCount++;
    }

    if (max_price) {
      query += ` AND p.price <= $${paramCount}`;
      params.push(max_price);
      paramCount++;
    }

    // Sorting
    if (sort === 'price_low') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_high') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else if (sort === 'popularity') {
      query += ' ORDER BY p.total_sold DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM products p WHERE p.status = "ACTIVE"';
    const countParams = [];
    let countParamCount = 1;

    if (category) {
      countQuery += ` AND p.category_id = $${countParamCount}`;
      countParams.push(category);
      countParamCount++;
    }
    if (vendor) {
      countQuery += ` AND p.vendor_id = $${countParamCount}`;
      countParams.push(vendor);
      countParamCount++;
    }
    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParamCount} OR p.description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products: result.rows
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, v.business_name as vendor_name, v.id as vendor_id, c.name as category_name
       FROM products p
       LEFT JOIN vendors v ON p.vendor_id = v.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = result.rows[0];

    // Get product images
    const imagesResult = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order',
      [id]
    );
    product.images = imagesResult.rows;

    // Get inventory
    const inventoryResult = await pool.query(
      'SELECT * FROM inventory WHERE product_id = $1',
      [id]
    );
    product.inventory = inventoryResult.rows[0];

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { vendor_id, category_id, sku, name, slug, description, specifications, price, discount_price, discount_percentage } = req.body;

    const result = await pool.query(
      `INSERT INTO products (vendor_id, category_id, sku, name, slug, description, specifications, price, discount_price, discount_percentage, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING_APPROVAL')
       RETURNING *`,
      [vendor_id, category_id, sku, name, slug, description, specifications, price, discount_price, discount_percentage]
    );

    // Create inventory record
    await pool.query(
      'INSERT INTO inventory (product_id, current_stock, reserved_stock, available_stock, minimum_stock) VALUES ($1, 0, 0, 0, 10)',
      [result.rows[0].id]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, discount_price, discount_percentage, status } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           discount_price = COALESCE($4, discount_price),
           discount_percentage = COALESCE($5, discount_percentage),
           status = COALESCE($6, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, description, price, discount_price, discount_percentage, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};
