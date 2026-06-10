const Order = require('../../models/Order');
const User = require('../../models/User');
const Vendor = require('../../models/Vendor');

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .populate('productId', 'name category primaryImage')
      .populate('vendorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      orders,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Get all vendors with stats
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().populate('userId', 'name email phone').sort({ rating: -1 });
    res.json({ success: true, vendors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, totalVendors, pendingOrders, deliveredOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'vendor' }),
      Order.countDocuments({ status: { $in: ['confirmed', 'pattern', 'stitching', 'qc'] } }),
      Order.countDocuments({ status: 'delivered' }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      stats: { totalOrders, totalUsers, totalVendors, pendingOrders, deliveredOrders, totalRevenue },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/unverify vendor
// @route   PUT /api/admin/vendors/:vendorId/verify
// @access  Private/Admin
const verifyVendor = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(req.params.vendorId, { isVerified }, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders, getAllVendors, getStats, verifyVendor };
