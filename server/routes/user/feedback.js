const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const { submitFeedback, getMyFeedback } = require('../../controllers/user/feedbackController');

router.use(protect);
router.post('/', authorize('user'), submitFeedback);
router.get('/my', authorize('user'), getMyFeedback);

module.exports = router;
