const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Vendor = require('../../models/Vendor');
const Measurement = require('../../models/Measurement');

// @desc    Create order
// @route   POST /api/orders
// @access  Private (user)
const createOrder = async (req, res, next) => {
  try {
    const { productId, selectedFabric, selectedColor, fitPreference, deliveryAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Get active measurements
    const measurement = await Measurement.findOne({ userId: req.user._id, isActive: true });
    if (!measurement) {
      return res.status(400).json({ success: false, message: 'Please complete your measurements first' });
    }

    // Calculate pricing
    const fabric = product.fabrics.find((f) => f.name === selectedFabric);
    const fabricSurcharge = fabric ? fabric.surcharge : 0;
    const totalPrice = product.basePrice + fabricSurcharge;

    // Estimated delivery: 10 days from now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);

    const order = await Order.create({
      userId: req.user._id,
      vendorId: product.vendorId, // using  vendorId from the product
      productId,
      measurements: {
        chest: measurement.chest,
        waist: measurement.waist,
        shoulder: measurement.shoulder,
        hip: measurement.hip,
        inseam: measurement.inseam,
        sleeve: measurement.sleeve,
        neck: measurement.neck,
      },
      selectedFabric,
      selectedColor,
      fitPreference: fitPreference || measurement.fitPreference,
      basePrice: product.basePrice,
      fabricSurcharge,
      totalPrice,
      deliveryAddress,
      estimatedDelivery,
    });

    const populated = await Order.findById(order._id).populate('productId', 'name category images primaryImage');

    res.status(201).json({ success: true, order: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private (user)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('productId', 'name category images primaryImage basePrice')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order with tracking
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('productId', 'name category images primaryImage')
      .populate('userId', 'name email')
      .populate('vendorId', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Ensure user can only see their own orders (vendor/admin can see all)
    if (req.user.role === 'user' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Vendor updates order status
// @route   PUT /api/orders/:id/status
// @access  Private (vendor/admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['confirmed', 'pattern', 'stitching', 'qc', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (req.user.role === 'vendor' && order.vendorId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note });

    if (status === 'delivered' && order.vendorId) {
      await Vendor.findOneAndUpdate({ userId: order.vendorId }, { $inc: { totalCompleted: 1 } });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Vendor accepts/rejects order
// @route   PUT /api/orders/:id/accept
// @access  Private (vendor)
const acceptOrder = async (req, res, next) => {
  try {
    const { accepted } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.vendorAccepted = accepted;
    if (!accepted) {
      order.vendorId = null;
      // Update vendor rejected count
      await Vendor.findOneAndUpdate({ userId: req.user._id }, { $inc: { totalRejected: 1 } });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor's assigned orders
// @route   GET /api/orders/vendor
// @access  Private (vendor)
const getVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ vendorId: req.user._id })
      .populate('productId', 'name category images primaryImage')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, updateOrderStatus, acceptOrder, getVendorOrders };
