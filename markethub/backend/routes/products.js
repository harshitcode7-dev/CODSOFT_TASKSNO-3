const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('VENDOR', 'ADMIN'), createProduct);
router.put('/:id', protect, authorize('VENDOR', 'ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('VENDOR', 'ADMIN'), deleteProduct);

module.exports = router;
