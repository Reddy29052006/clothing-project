const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const { getAllOrders, getAllTailors, getStats, verifyTailors } = require('../../controllers/admin/adminController');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.get('/tailors', getAllTailors);
router.put('/tailors/:tailorsId/verify', verifyTailors);

module.exports = router;
