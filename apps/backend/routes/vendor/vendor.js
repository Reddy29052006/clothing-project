const express = require('express');
const router = express.Router();
const { protect, verifyVendor } = require('../../middleware/auth');
const {
  addVendorProduct,
  getVendorProducts,
  updateVendorProduct,
  getVendorOrders,
  updateOrderStatus
} = require('../../controllers/vendor/vendorController');
const { uploadProductImage } = require('../../middleware/upload');

router.use(protect);
router.use(verifyVendor);

// Products
router.post('/products', uploadProductImage.array('images', 10), addVendorProduct);
router.get('/products', getVendorProducts);
router.put('/products/:id', updateVendorProduct);

// Orders
router.get('/orders', getVendorOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
