const express = require('express');
const router = express.Router();
const { protect, verifyClient, verifyTailors } = require('../../middleware/auth');
const {
  createCustomOrder,
  getClientCustomOrders,
  getOpenCustomOrders,
  getTailorCustomOrders,
  acceptCustomOrder,
  updateCustomOrderStatus,
  getTailors,
} = require('../../controllers/user/customOrderController');

// All custom order routes require authentication
router.use(protect);

// Client-specific routes
router.post('/', verifyClient, createCustomOrder);
router.get('/my', verifyClient, getClientCustomOrders);
router.get('/tailors', getTailors);

// Tailor-specific routes
router.get('/open', verifyTailors, getOpenCustomOrders);
router.get('/tailor', verifyTailors, getTailorCustomOrders);
router.put('/:id/accept', verifyTailors, acceptCustomOrder);
router.put('/:id/status', verifyTailors, updateCustomOrderStatus);

module.exports = router;
