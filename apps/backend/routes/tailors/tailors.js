const express = require('express');
const router = express.Router();
const { protect, verifyTailors } = require('../../middleware/auth');
const {
  addTailorsProduct,
  getTailorsProducts,
  updateTailorsProduct,
  getTailorsOrders,
  updateOrderStatus
} = require('../../controllers/tailors/tailorsController');
const { uploadProductImage } = require('../../middleware/upload');

router.use(protect);
router.use(verifyTailors);

// Products
router.post('/products', uploadProductImage.array('images', 10), addTailorsProduct);
router.get('/products', getTailorsProducts);
router.put('/products/:id', updateTailorsProduct);

// Orders
router.get('/orders', getTailorsOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
