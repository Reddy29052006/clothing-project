const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fitRating: {
      type: String,
      enum: ['tight', 'perfect', 'loose'],
      required: [true, 'Fit rating is required'],
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    specificIssues: [
      {
        type: String,
        enum: ['chest_tight', 'chest_loose', 'waist_tight', 'waist_loose', 'shoulder_tight', 'shoulder_loose', 'length_short', 'length_long'],
      },
    ],
    adjustmentApplied: {
      type: Boolean,
      default: false,
    },
    adjustmentDelta: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ orderId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
