const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  acceptOrder,
  getTailorsOrders,
} = require('../../controllers/user/orderController');

router.use(protect);

router.post('/', authorize('user'), createOrder);
router.get('/my', authorize('user'), getMyOrders);
router.get('/tailors', authorize('tailors'), getTailorsOrders);
router.get('/:id', getOrder);
router.put('/:id/status', authorize('tailors', 'admin'), updateOrderStatus);
router.put('/:id/accept', authorize('tailors'), acceptOrder);

module.exports = router;
