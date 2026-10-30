const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeCartItem);
router.delete('/', protect, clearCart);

module.exports = router;
