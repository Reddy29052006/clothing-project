const Product = require('../../models/Product');
const Order = require('../../models/Order');

// @desc    Add a product (vendor)
// @route   POST /api/vendor/products
const addVendorProduct = async (req, res, next) => {
  try {
    const { name, category, description, basePrice, fabrics, colors, tags } = req.body;

    const parsedFabrics = fabrics ? JSON.parse(fabrics) : [];
    const parsedColors = colors ? JSON.parse(colors) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const product = await Product.create({
      name,
      category,
      description,
      basePrice,
      fabrics: parsedFabrics,
      colors: parsedColors,
      tags: parsedTags,
      vendorId: req.user._id,
      images: imagePaths,
      primaryImage: imagePaths[0] || '',
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor products
// @route   GET /api/vendor/products
const getVendorProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ vendorId: req.user._id }).sort('-createdAt');
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a vendor product (limited patch)
// @route   PUT /api/vendor/products/:id
const updateVendorProduct = async (req, res, next) => {
  try {
    const { price, stock, availability } = req.body;

    // Find the product and ensure it belongs to the vendor
    const product = await Product.findOne({ _id: req.params.id, vendorId: req.user._id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    }

    if (price !== undefined) product.basePrice = price;
    if (availability !== undefined) product.isActive = availability;

    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor orders
// @route   GET /api/vendor/orders
const getVendorOrders = async (req, res, next) => {
  try {
    // Only fetch orders that contain products matching the vendor
    const orders = await Order.find({ vendorId: req.user._id })
      .populate('userId', 'name email phone')
      .populate('productId', 'name category primaryImage')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/vendor/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'confirmed', 'pattern', 'stitching', 'qc'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOne({ _id: req.params.id, vendorId: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note: note || '' });

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVendorProduct,
  getVendorProducts,
  updateVendorProduct,
  getVendorOrders,
  updateOrderStatus
};
