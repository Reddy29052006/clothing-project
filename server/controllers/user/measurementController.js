const Measurement = require('../../models/Measurement');
const { calculateMeasurements } = require('../../utils/measurementEngine');

// @desc    Save / update measurements
// @route   POST /api/measurements
// @access  Private (user)
const saveMeasurements = async (req, res, next) => {
  try {
    const { height, weight, bodyType, fitPreference } = req.body;

    if (!height || !weight || !bodyType || !fitPreference) {
      return res.status(400).json({ success: false, message: 'All measurement inputs are required' });
    }

    const calculated = calculateMeasurements(
      parseFloat(height),
      parseFloat(weight),
      bodyType,
      fitPreference
    );

    // Deactivate previous measurements
    await Measurement.updateMany({ userId: req.user._id }, { isActive: false });

    const measurement = await Measurement.create({
      userId: req.user._id,
      height,
      weight,
      bodyType,
      fitPreference,
      ...calculated,
    });

    res.status(201).json({ success: true, measurement });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's active measurement
// @route   GET /api/measurements/me
// @access  Private (user)
const getMyMeasurements = async (req, res, next) => {
  try {
    const measurement = await Measurement.findOne({
      userId: req.user._id,
      isActive: true,
    });

    res.json({ success: true, measurement });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate measurements without saving (preview)
// @route   POST /api/measurements/calculate
// @access  Public
const calculatePreview = async (req, res, next) => {
  try {
    const { height, weight, bodyType, fitPreference } = req.body;

    if (!height || !weight || !bodyType || !fitPreference) {
      return res.status(400).json({ success: false, message: 'All inputs are required' });
    }

    const calculated = calculateMeasurements(
      parseFloat(height),
      parseFloat(weight),
      bodyType || 'regular',
      fitPreference || 'regular'
    );

    res.json({ success: true, measurements: calculated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all measurements for a user (history)
// @route   GET /api/measurements/history
// @access  Private (user)
const getMeasurementHistory = async (req, res, next) => {
  try {
    const measurements = await Measurement.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, measurements });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveMeasurements, getMyMeasurements, calculatePreview, getMeasurementHistory };
