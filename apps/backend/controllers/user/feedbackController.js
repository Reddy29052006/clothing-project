const Feedback = require('../../models/Feedback');
const Measurement = require('../../models/Measurement');
const { applyFeedbackAdjustment } = require('../../utils/measurementEngine');

// @desc    Submit fit feedback
// @route   POST /api/feedback
// @access  Private (user)
const submitFeedback = async (req, res, next) => {
  try {
    const { orderId, fitRating, comment, specificIssues } = req.body;

    if (!orderId || !fitRating) {
      return res.status(400).json({ success: false, message: 'Order ID and fit rating are required' });
    }

    // Check if feedback already submitted
    const existing = await Feedback.findOne({ orderId, userId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Feedback already submitted for this order' });
    }

    // Calculate adjustment delta
    const deltaMap = { tight: 1.5, perfect: 0, loose: -1.5 };
    const adjustmentDelta = deltaMap[fitRating] || 0;

    const feedback = await Feedback.create({
      orderId,
      userId: req.user._id,
      fitRating,
      comment,
      specificIssues: specificIssues || [],
      adjustmentDelta,
    });

    // Apply adjustment to current measurements if not perfect
    if (fitRating !== 'perfect') {
      const measurement = await Measurement.findOne({ userId: req.user._id, isActive: true });
      if (measurement) {
        const adjusted = applyFeedbackAdjustment(
          { chest: measurement.chest, waist: measurement.waist, hip: measurement.hip },
          fitRating
        );

        measurement.chest = adjusted.chest;
        measurement.waist = adjusted.waist;
        measurement.hip = adjusted.hip;
        measurement.adjustmentDelta = (measurement.adjustmentDelta || 0) + adjustmentDelta;
        await measurement.save();

        feedback.adjustmentApplied = true;
        await feedback.save();
      }
    }

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's feedback
// @route   GET /api/feedback/my
// @access  Private (user)
const getMyFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id })
      .populate('orderId', 'orderId status productId')
      .sort({ createdAt: -1 });

    res.json({ success: true, feedbacks });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getMyFeedback };
