const mongoose = require('mongoose');

const sizeGroupSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  measurements: {
    type: Map,
    of: Number, // flexible key-value fields like Chest, Shoulder, etc.
  }
});

const customProductSchema = new mongoose.Schema({
  productType: {
    type: String,
    required: true,
    enum: ['Shirt', 'Pant', 'Dress', 'Suit', 'Uniform', 'Blouse', 'Other'],
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 1,
  },
  sizeGroups: [sizeGroupSchema]
});

const customOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tailorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null if open for any tailor to accept
    },
    
    // Client Details (explicitly stored per-order)
    clientDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    
    // Fabric Details
    fabricDetails: {
      fabricType: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: String, default: '' }, // e.g. "3.5 meters" or "2"
      notes: { type: String, default: '' },
    },
    
    // Products and Size Groups
    products: [customProductSchema],
    
    // Design Requirements
    designRequirements: {
      description: { type: String, default: '' },
      styleInstructions: { type: String, default: '' },
      referenceNotes: { type: String, default: '' },
      customInstructions: { type: String, default: '' },
      specialRequests: { type: String, default: '' },
    },
    
    status: {
      type: String,
      enum: [
        'Created',
        'Assigned',
        'Accepted',
        'Fabric Received',
        'Cutting In Progress',
        'Stitching In Progress',
        'Quality Check',
        'Completed',
        'Delivered'
      ],
      default: 'Created',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      }
    ],
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    expectedDeliveryDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

// Auto-generate order ID
customOrderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `TL-${timestamp}-${random}`;
  }
  if (this.statusHistory.length === 0) {
    this.statusHistory.push({ status: this.status, timestamp: new Date(), note: 'Order created' });
  }
  next();
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);
