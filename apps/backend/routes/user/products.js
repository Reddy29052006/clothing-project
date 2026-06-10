const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const { getProducts, getProduct, createProduct, updateProduct } = require('../../controllers/user/productController');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);

module.exports = router;
