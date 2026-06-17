const CustomOrder = require('../../models/CustomOrder');
const User = require('../../models/User');
const Tailors = require('../../models/Tailors');

// Helper to sanitize custom order details for privacy (non-admin users)
const sanitizeCustomOrder = (order, user) => {
  if (!order) return order;
  const orderObj = order.toObject ? order.toObject() : order;
  const isOwner = orderObj.clientId && (orderObj.clientId._id || orderObj.clientId).toString() === user._id.toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    if (orderObj.clientDetails) {
      delete orderObj.clientDetails.name;
      delete orderObj.clientDetails.phone;
      delete orderObj.clientDetails.address;
    }
    if (orderObj.clientId && typeof orderObj.clientId === 'object') {
      delete orderObj.clientId.name;
      delete orderObj.clientId.email;
      delete orderObj.clientId.phone;
    }
  }

  const isAssignedTailor = orderObj.tailorId && (orderObj.tailorId._id || orderObj.tailorId).toString() === user._id.toString();
  if (!isOwner && !isAssignedTailor && !isAdmin) {
    if (orderObj.tailorId && typeof orderObj.tailorId === 'object') {
      delete orderObj.tailorId.name;
      delete orderObj.tailorId.email;
      delete orderObj.tailorId.phone;
    }
  }
  return orderObj;
};

const sanitizeCustomOrders = (orders, user) => {
  if (!orders) return orders;
  if (Array.isArray(orders)) {
    return orders.map(order => sanitizeCustomOrder(order, user));
  }
  return sanitizeCustomOrder(orders, user);
};

// @desc    Create a custom tailoring order
// @route   POST /api/custom-orders
// @access  Private (Client)
const createCustomOrder = async (req, res, next) => {
  try {
    const { clientDetails, fabricDetails, products, designRequirements, expectedDeliveryDate, priority, tailorId, notes } = req.body;

    if (!clientDetails || !clientDetails.name || !clientDetails.phone) {
      return res.status(400).json({ success: false, message: 'Client name and contact phone are required' });
    }

    if (!fabricDetails || !fabricDetails.fabricType || !fabricDetails.description) {
      return res.status(400).json({ success: false, message: 'Fabric type and description are required' });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product type must be specified' });
    }

    // Validate size group quantities match total product quantity
    for (const prod of products) {
      if (!prod.productType || !prod.totalQuantity || prod.totalQuantity <= 0) {
        return res.status(400).json({ success: false, message: 'Each product must have a type and quantity greater than zero' });
      }

      if (!prod.sizeGroups || !Array.isArray(prod.sizeGroups) || prod.sizeGroups.length === 0) {
        return res.status(400).json({ success: false, message: `Size details must be entered for ${prod.productType}` });
      }

      const sumGroups = prod.sizeGroups.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      if (sumGroups !== prod.totalQuantity) {
        return res.status(400).json({
          success: false,
          message: `The sum of size group quantities (${sumGroups}) must equal the total quantity (${prod.totalQuantity}) for ${prod.productType}`
        });
      }
    }

    let verifiedTailorId = null;
    let initialStatus = 'Created';

    if (tailorId) {
      const tailor = await User.findById(tailorId);
      if (!tailor || tailor.role !== 'tailors') {
        return res.status(400).json({ success: false, message: 'Invalid tailor selected' });
      }
      verifiedTailorId = tailorId;
      initialStatus = 'Assigned';
    }

    const customOrder = await CustomOrder.create({
      clientId: req.user._id,
      tailorId: verifiedTailorId,
      clientDetails,
      fabricDetails,
      products,
      designRequirements,
      expectedDeliveryDate,
      priority: priority || 'Medium',
      notes,
      status: initialStatus
    });

    // Notify tailors via WebSocket (removed client name to preserve privacy)
    const io = req.app.get('io');
    if (io) {
      io.emit('newCustomOrder', {
        orderId: customOrder.orderId,
        _id: customOrder._id,
        products: products.map(p => `${p.totalQuantity}x ${p.productType}`).join(', '),
      });
    }

    res.status(201).json({ success: true, order: sanitizeCustomOrder(customOrder, req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get custom orders of the logged-in client
// @route   GET /api/custom-orders/my
// @access  Private (Client)
const getClientCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find({ clientId: req.user._id })
      .populate('tailorId', 'name email')
      .sort({ createdAt: -1 });

    const enhancedOrders = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();
      if (orderObj.tailorId) {
        const tailors = await Tailors.findOne({ userId: order.tailorId._id });
        orderObj.tailorId.shopName = tailors ? tailors.shopName : 'Custom Tailor';
      }
      return orderObj;
    }));

    res.json({ success: true, orders: sanitizeCustomOrders(enhancedOrders, req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get open custom orders (unassigned)
// @route   GET /api/custom-orders/open
// @access  Private (Tailor/Tailors)
const getOpenCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find({ tailorId: null, status: { $in: ['Created', 'Assigned'] } })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders: sanitizeCustomOrders(orders, req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get custom orders assigned to/accepted by the logged-in tailor
// @route   GET /api/custom-orders/tailor
// @access  Private (Tailor/Tailors)
const getTailorCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find({ tailorId: req.user._id })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders: sanitizeCustomOrders(orders, req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept custom tailoring order
// @route   PUT /api/custom-orders/:id/accept
// @access  Private (Tailor/Tailors)
const acceptCustomOrder = async (req, res, next) => {
  try {
    const order = await CustomOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order not found' });
    }

    if (order.tailorId && order.tailorId.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'This order is already assigned to another tailor' });
    }

    order.tailorId = req.user._id;
    order.status = 'Accepted';
    order.statusHistory.push({
      status: 'Accepted',
      note: 'Tailor accepted the order. Fabric is to be received.',
      timestamp: new Date()
    });

    // Set default expected delivery date (e.g. 10 days from acceptance) if not specified
    if (!order.expectedDeliveryDate) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 10);
      order.expectedDeliveryDate = deliveryDate;
    }

    await order.save();

    res.json({ success: true, order: sanitizeCustomOrder(order, req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update status of custom order
// @route   PUT /api/custom-orders/:id/status
// @access  Private (Tailor/Tailors)
const updateCustomOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await CustomOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order not found' });
    }

    if (order.tailorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    const allowedStatuses = [
      'Fabric Received',
      'Cutting In Progress',
      'Stitching In Progress',
      'Quality Check',
      'Completed',
      'Delivered'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || `Order updated to: ${status}`,
      timestamp: new Date()
    });

    await order.save();

    res.json({ success: true, order: sanitizeCustomOrder(order, req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tailors
// @route   GET /api/custom-orders/tailors
// @access  Private (Authenticated)
const getTailors = async (req, res, next) => {
  try {
    const tailors = await Tailors.find().populate('userId', 'name email');
    res.json({ success: true, tailors });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomOrder,
  getClientCustomOrders,
  getOpenCustomOrders,
  getTailorCustomOrders,
  acceptCustomOrder,
  updateCustomOrderStatus,
  getTailors,
};
