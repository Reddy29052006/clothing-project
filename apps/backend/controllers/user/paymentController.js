const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Measurement = require('../../models/Measurement');
const notificationService = require('../../utils/notificationService');
const crypto = require('crypto');

// Returns a live Razorpay instance if keys are configured, otherwise null
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

/**
 * @desc    Create Razorpay Order for Cart items
 * @route   POST /api/payments/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Valid delivery address is required' });
    }

    // Get active measurements
    const measurement = await Measurement.findOne({ userId: req.user._id, isActive: true });
    if (!measurement) {
      return res.status(400).json({ success: false, message: 'Please complete your measurements first' });
    }

    const createdOrders = [];
    let grandTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      // Calculate pricing
      const fabric = product.fabrics.find((f) => f.name === item.selectedFabric);
      const fabricSurcharge = fabric ? fabric.surcharge : 0;
      const totalPrice = product.basePrice + fabricSurcharge;
      grandTotal += totalPrice;

      // Estimated delivery: 10 days from now
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);

      // Create pending order
      const order = await Order.create({
        userId: req.user._id,
        tailorsId: product.tailorsId,
        productId: item.productId,
        measurements: {
          chest: measurement.chest,
          waist: measurement.waist,
          shoulder: measurement.shoulder,
          hip: measurement.hip,
          inseam: measurement.inseam,
          sleeve: measurement.sleeve,
          neck: measurement.neck,
        },
        selectedFabric: item.selectedFabric,
        selectedColor: item.selectedColor,
        fitPreference: item.fitPreference || measurement.fitPreference,
        basePrice: product.basePrice,
        fabricSurcharge,
        totalPrice,
        deliveryAddress,
        estimatedDelivery,
        status: 'pending_payment',
        paymentStatus: 'unpaid',
      });

      createdOrders.push(order);
    }

    // ── MOCK MODE (no Razorpay keys) ───────────────────────────────────────
    const razorpay = getRazorpay();
    if (!razorpay) {
      console.log('⚠️ Razorpay keys missing. Running payment in MOCK mode.');
      const mockOrderId = `mock_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await Order.updateMany(
        { _id: { $in: createdOrders.map((o) => o._id) } },
        { stripeSessionId: mockOrderId }
      );

      const clientUrl = process.env.CLIENT_URL;
      return res.json({
        success: true,
        mode: 'mock',
        orderId: mockOrderId,
        amount: grandTotal,
        currency: 'INR',
        url: `${clientUrl}/payment-success?session_id=${mockOrderId}`,
        orderIds: createdOrders.map((o) => o._id.toString()),
      });
    }

    // ── LIVE MODE ─────────────────────────────────────────────────────────
    const keyId = process.env.RAZORPAY_KEY_ID;
    // Razorpay amount is in paise (1 INR = 100 paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100),
      currency: 'INR',
      receipt: `fc_${Date.now()}`,
      notes: {
        orderIds: createdOrders.map((o) => o._id.toString()).join(','),
        userId: req.user._id.toString(),
      },
    });

    // Tag all pending orders with Razorpay order ID
    await Order.updateMany(
      { _id: { $in: createdOrders.map((o) => o._id) } },
      { stripeSessionId: razorpayOrder.id }
    );

    return res.json({
      success: true,
      mode: 'live',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: keyId,
      orderIds: createdOrders.map((o) => o._id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay Payment Signature and confirm orders
 * @route   POST /api/payments/confirm
 * @access  Private
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { sessionId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Resolve the Razorpay order ID from either field name
    const rzpOrderId = razorpay_order_id || sessionId;

    if (!rzpOrderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    // ── MOCK Confirmation ────────────────────────────────────────────────
    if (rzpOrderId.startsWith('mock_rzp_')) {
      const orders = await Order.find({ stripeSessionId: rzpOrderId })
        .populate('productId', 'name')
        .populate('userId', 'name email')
        .populate('tailorsId', 'email name');

      if (orders.length === 0) {
        return res.status(404).json({ success: false, message: 'No orders found for this session' });
      }

      if (orders[0].paymentStatus === 'paid') {
        return res.json({ success: true, message: 'Payment already confirmed', orders });
      }

      for (const order of orders) {
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        order.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(),
          note: 'Payment completed successfully (Mock Mode)',
        });
        await order.save();

        await notificationService.sendOrderConfirmation(req.user.email, {
          orderId: order.orderId,
          productName: order.productId?.name || 'Garment',
          totalPrice: order.totalPrice,
        });

        // Send email notification to tailor
        if (order.tailorsId && order.tailorsId.email) {
          await notificationService.sendTailorNewOrderNotification(order.tailorsId.email, {
            orderId: order.orderId,
            productName: order.productId?.name || 'Garment',
            clientName: order.userId?.name || req.user?.name || 'Client',
          });
        }
      }

      return res.json({ success: true, message: 'Mock payment confirmed', orders });
    }

    // ── LIVE Signature Verification ──────────────────────────────────────
    const razorpay = getRazorpay();
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpay || !keySecret) {
      return res.status(400).json({ success: false, message: 'Razorpay is not configured' });
    }

    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment ID and signature are required' });
    }

    // Validate Razorpay HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${rzpOrderId}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    // Confirm orders in DB
    const orders = await Order.find({ stripeSessionId: rzpOrderId })
      .populate('productId', 'name')
      .populate('userId', 'name email')
      .populate('tailorsId', 'email name');

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this Razorpay order' });
    }

    for (const order of orders) {
      if (order.paymentStatus !== 'paid') {
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        order.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(),
          note: `Payment completed via Razorpay. Payment ID: ${razorpay_payment_id}`,
        });
        await order.save();

        await notificationService.sendOrderConfirmation(req.user.email, {
          orderId: order.orderId,
          productName: order.productId?.name || 'Garment',
          totalPrice: order.totalPrice,
        });

        // Send email notification to tailor
        if (order.tailorsId && order.tailorsId.email) {
          await notificationService.sendTailorNewOrderNotification(order.tailorsId.email, {
            orderId: order.orderId,
            productName: order.productId?.name || 'Garment',
            clientName: order.userId?.name || req.user?.name || 'Client',
          });
        }
      }
    }

    return res.json({ success: true, message: 'Payment verified and confirmed', orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Razorpay Webhook (asynchronous fulfillment from Razorpay dashboard)
 * @route   POST /api/payments/webhook
 * @access  Public
 */
const razorpayWebhook = async (req, res, next) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  // Validate webhook signature if secret is configured
  if (webhookSecret && signature) {
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSig !== signature) {
      console.error('❌ Razorpay Webhook: Invalid signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  const event = req.body;

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const rzpOrderId = payment.order_id;

    try {
      console.log(`🔔 Razorpay Webhook: payment.captured for order ${rzpOrderId}`);
      const orders = await Order.find({ stripeSessionId: rzpOrderId })
        .populate('productId', 'name')
        .populate('userId', 'name email')
        .populate('tailorsId', 'email name');

      for (const order of orders) {
        if (order.paymentStatus !== 'paid') {
          order.status = 'confirmed';
          order.paymentStatus = 'paid';
          order.statusHistory.push({
            status: 'confirmed',
            timestamp: new Date(),
            note: `Payment captured via Razorpay Webhook. Payment ID: ${payment.id}`,
          });
          await order.save();

          if (order.userId && order.userId.email) {
            await notificationService.sendOrderConfirmation(order.userId.email, {
              orderId: order.orderId,
              productName: order.productId?.name || 'Custom Crafted Garment',
              totalPrice: order.totalPrice,
            });
          }

          // Send email notification to tailor
          if (order.tailorsId && order.tailorsId.email) {
            await notificationService.sendTailorNewOrderNotification(order.tailorsId.email, {
              orderId: order.orderId,
              productName: order.productId?.name || 'Custom Crafted Garment',
              clientName: order.userId?.name || 'Client',
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Error updating orders from Razorpay webhook:', error);
      return res.status(500).json({ error: 'Fulfillment failed' });
    }
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  confirmPayment,
  razorpayWebhook,
};
