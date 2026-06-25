const mongoose = require('mongoose');

const orderStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'pattern', 'stitching', 'qc', 'shipped', 'delivered'],
  },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tailorsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Snapshot of measurements at time of order
    measurements: {
      chest: Number,
      waist: Number,
      shoulder: Number,
      hip: Number,
      inseam: Number,
      sleeve: Number,
      neck: Number,
    },
    // Customizations
    selectedFabric: { type: String },
    selectedColor: { type: String },
    fitPreference: {
      type: String,
      enum: ['slim', 'regular', 'loose'],
    },
    // Pricing
    basePrice: { type: Number },
    fabricSurcharge: { type: Number, default: 0 },
    totalPrice: { type: Number },
    // Status
    status: {
      type: String,
      enum: ['pending_payment', 'confirmed', 'pattern', 'stitching', 'qc', 'shipped', 'delivered'],
      default: 'pending_payment',
    },
    statusHistory: [orderStatusHistorySchema],
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid',
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    // Tailors
    tailorsAccepted: { type: Boolean, default: null },
    estimatedDelivery: { type: Date },
    // Delivery address
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

// Auto-generate order ID before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `FC-${timestamp}-${random}`;
  }
  // Push initial status to history
  if (this.statusHistory.length === 0) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ tailorsId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
