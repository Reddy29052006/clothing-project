const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Tailors = require('../../models/Tailors');
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
      tailorsId: product.tailorsId, // using  tailorsId from the product
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
      .populate('tailorsId', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Ensure user can only see their own orders (assigned tailor or admin can see all)
    const isCreator = order.userId && order.userId._id.toString() === req.user._id.toString();
    const isAssignedTailor = order.tailorsId && order.tailorsId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignedTailor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Tailors updates order status
// @route   PUT /api/orders/:id/status
// @access  Private (tailors/admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['confirmed', 'pattern', 'stitching', 'qc', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (req.user.role === 'tailors' && order.tailorsId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note });

    if (status === 'delivered' && order.tailorsId) {
      await Tailors.findOneAndUpdate({ userId: order.tailorsId }, { $inc: { totalCompleted: 1 } });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Tailors accepts/rejects order
// @route   PUT /api/orders/:id/accept
// @access  Private (tailors)
const acceptOrder = async (req, res, next) => {
  try {
    const { accepted } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.tailorsAccepted = accepted;
    if (!accepted) {
      order.tailorsId = null;
      // Update tailors rejected count
      await Tailors.findOneAndUpdate({ userId: req.user._id }, { $inc: { totalRejected: 1 } });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tailors's assigned orders
// @route   GET /api/orders/tailors
// @access  Private (tailors)
const getTailorsOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ tailorsId: req.user._id })
      .populate('productId', 'name category images primaryImage')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, updateOrderStatus, acceptOrder, getTailorsOrders };
