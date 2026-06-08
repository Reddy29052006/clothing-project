const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  acceptOrder,
  getVendorOrders,
} = require('../../controllers/user/orderController');

router.use(protect);

router.post('/', authorize('user'), createOrder);
router.get('/my', authorize('user'), getMyOrders);
router.get('/vendor', authorize('vendor'), getVendorOrders);
router.get('/:id', getOrder);
router.put('/:id/status', authorize('vendor', 'admin'), updateOrderStatus);
router.put('/:id/accept', authorize('vendor'), acceptOrder);

module.exports = router;
