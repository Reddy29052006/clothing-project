const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
  saveMeasurements,
  getMyMeasurements,
  calculatePreview,
  getMeasurementHistory,
} = require('../../controllers/user/measurementController');

router.post('/calculate', calculatePreview);
router.use(protect);
router.post('/', saveMeasurements);
router.get('/me', getMyMeasurements);
router.get('/history', getMeasurementHistory);

module.exports = router;
