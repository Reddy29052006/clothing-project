const mongoose = require('mongoose');

const fabricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  texture: { type: String },
  surcharge: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
});

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['shirt', 'trousers', 'suit', 'kurta', 'blazer', 'dress'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    images: [{ type: String }],
    primaryImage: { type: String },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    fabrics: [fabricSchema],
    colors: [colorVariantSchema],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, featured: 1 });

module.exports = mongoose.model('Product', productSchema);
