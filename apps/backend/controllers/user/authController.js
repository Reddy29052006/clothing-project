const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Tailors = require('../../models/Tailors');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('fitcraft_auth_token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax', // 'None' required for cross-origin (Vercel → Render)
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, shopName, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const allowedRole = ['user', 'tailors', 'client'].includes(role) ? role : 'user';

    const user = await User.create({ name, email, password, role: allowedRole, phone });

    // If tailors, create tailors profile
    if (allowedRole === 'tailors') {
      await Tailors.create({
        userId: user._id,
        shopName: shopName || `${name}'s Tailor Shop`,
        phone: phone || '',
      });
    }

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Login or register via Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google ID token is required' });
    }

    let email, name, picture, sub;

    // Check for mock token in non-production environments
    if (process.env.NODE_ENV !== 'production' && token.startsWith('mock_google_token_')) {
      sub = token.replace('mock_google_token_', '');
      email = `${sub}@example.com`;
      name = `Mock Google User ${sub.substring(0, 4)}`;
      picture = '';
    } else {
      // Verify token with Google API
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      const data = await response.json();

      if (data.error_description || !data.email) {
        return res.status(400).json({ success: false, message: 'Invalid Google account token' });
      }

      // Verify Client ID if configured
      const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
      if (clientId && data.aud !== clientId) {
        return res.status(400).json({ success: false, message: 'Token Client ID mismatch' });
      }

      email = data.email;
      name = data.name;
      picture = data.picture;
      sub = data.sub;
    }

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });

    if (!user) {
      // New user via Google: role is pending_onboarding
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId: sub,
        role: 'pending_onboarding',
        avatar: picture || '',
      });
    } else {
      // Link Google ID if not linked yet
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    }

    const jwtToken = generateToken(user._id, user.role);
    setTokenCookie(res, jwtToken);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete user onboarding (role, phone, shopName)
// @route   POST /api/auth/complete-onboarding
// @access  Private
const completeOnboarding = async (req, res, next) => {
  try {
    const { role, phone, shopName } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    if (!['user', 'tailors', 'client'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selection' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'pending_onboarding') {
      return res.status(400).json({ success: false, message: 'User has already completed onboarding' });
    }

    // Validation for tailor shopName
    if (role === 'tailors' && (!shopName || !shopName.trim())) {
      return res.status(400).json({ success: false, message: 'Shop name is required for tailors' });
    }

    user.role = role;
    if (phone) {
      user.phone = phone;
    }
    await user.save();

    // If tailors, create tailors profile
    if (role === 'tailors') {
      await Tailors.create({
        userId: user._id,
        shopName: shopName || `${user.name}'s Tailor Shop`,
        phone: phone || '',
      });
    }

    // Generate new token with updated role
    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, googleLogin, completeOnboarding };
