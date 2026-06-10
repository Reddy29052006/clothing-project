const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Body inputs
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [140, 'Height must be at least 140cm'],
      max: [220, 'Height cannot exceed 220cm'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [40, 'Weight must be at least 40kg'],
      max: [200, 'Weight cannot exceed 200kg'],
    },
    bodyType: {
      type: String,
      enum: ['slim', 'regular', 'heavy'],
      required: true,
    },
    fitPreference: {
      type: String,
      enum: ['slim', 'regular', 'loose'],
      required: true,
    },
    // Calculated garment measurements (cm)
    chest: { type: Number },
    waist: { type: Number },
    shoulder: { type: Number },
    hip: { type: Number },
    inseam: { type: Number },
    sleeve: { type: Number },
    neck: { type: Number },
    // Feedback adjustments accumulated
    adjustmentDelta: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure one active measurement per user
measurementSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Measurement', measurementSchema);
