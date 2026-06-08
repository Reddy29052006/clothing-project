const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const { getAllOrders, getAllVendors, getStats, verifyVendor } = require('../../controllers/admin/adminController');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.get('/vendors', getAllVendors);
router.put('/vendors/:vendorId/verify', verifyVendor);

module.exports = router;
