const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { email, password, role, first_name, last_name, phone } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password, role, first_name, last_name, phone, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, true, true)
       RETURNING id, email, role, first_name, last_name, phone`,
      [email, hashedPassword, role || 'CUSTOMER', first_name, last_name, phone]
    );

    const user = result.rows[0];

    // Create customer or vendor record based on role
    if (user.role === 'CUSTOMER') {
      await pool.query(
        'INSERT INTO customers (user_id) VALUES ($1)',
        [user.id]
      );
    } else if (user.role === 'VENDOR') {
      // Vendor registration will be handled separately
    }

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, first_name, last_name, phone, is_active, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    // Get additional data based on role
    let additionalData = {};
    if (user.role === 'CUSTOMER') {
      const customerResult = await pool.query(
        'SELECT * FROM customers WHERE user_id = $1',
        [user.id]
      );
      additionalData = customerResult.rows[0] || {};
    } else if (user.role === 'VENDOR') {
      const vendorResult = await pool.query(
        'SELECT v.*, vp.business_description, vp.city, vp.state, vp.rating, vp.total_reviews FROM vendors v LEFT JOIN vendor_profiles vp ON v.id = vp.vendor_id WHERE v.user_id = $1',
        [user.id]
      );
      additionalData = vendorResult.rows[0] || {};
    }

    res.status(200).json({
      success: true,
      user: { ...user, ...additionalData }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out'
    });
  }
};
