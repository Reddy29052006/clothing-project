const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    specializations: [
      {
        type: String,
        enum: ['shirt', 'trousers', 'suit', 'kurta', 'blazer', 'dress'],
      },
    ],
    location: { type: String },
    phone: { type: String },
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    totalCompleted: { type: Number, default: 0 },
    totalRejected: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
