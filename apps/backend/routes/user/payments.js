const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { createCheckoutSession, confirmPayment, razorpayWebhook } = require('../../controllers/user/paymentController');

// Razorpay webhook — public, receives JSON body
router.post('/webhook', razorpayWebhook);

// Protected payment endpoints
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/confirm', protect, confirmPayment);

module.exports = router;
