const express = require('express');
const router = express.Router();
const { register, login, getMe, googleLogin, completeOnboarding } = require('../../controllers/user/authController');
const { protect } = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/google', googleLogin);
router.post('/complete-onboarding', protect, completeOnboarding);
router.post('/logout', (req, res) => {
  res.cookie('fitcraft_auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
