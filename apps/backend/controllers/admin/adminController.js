const Order = require('../../models/Order');
const User = require('../../models/User');
const Tailors = require('../../models/Tailors');

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
      .populate('tailorsId', 'name email')
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



// @desc    Get all tailors with stats
// @route   GET /api/admin/tailors
// @access  Private/Admin
const getAllTailors = async (req, res, next) => {
  try {
    const tailors = await Tailors.find().populate('userId', 'name email phone').sort({ rating: -1 });
    res.json({ success: true, tailors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, totalTailors, pendingOrders, deliveredOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'tailors' }),
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
      stats: { totalOrders, totalUsers, totalTailors, pendingOrders, deliveredOrders, totalRevenue },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/unverify tailors
// @route   PUT /api/admin/tailors/:tailorsId/verify
// @access  Private/Admin
const verifyTailors = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const tailors = await Tailors.findByIdAndUpdate(req.params.tailorsId, { isVerified }, { new: true });
    if (!tailors) return res.status(404).json({ success: false, message: 'Tailors not found' });
    res.json({ success: true, tailors });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders, getAllTailors, getStats, verifyTailors };
