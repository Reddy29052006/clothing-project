const jwt = require('jsonwebtoken');
const User = require('../models/User');

//  Verify JWT token middleware

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try to read token from cookies
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, c) => {
        const [key, ...val] = c.trim().split('=');
        if (key) acc[key] = val.join('=');
        return acc;
      }, {});
      if (cookies['fitcraft_auth_token']) {
        token = cookies['fitcraft_auth_token'];
      }
    }

    // 2. Fallback to Authorization Bearer header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// access checking
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

const verifyTailors = authorize('tailors', 'admin');
const verifyUser = authorize('user', 'admin');
const verifyClient = authorize('client', 'admin');

module.exports = { protect, authorize, verifyTailors, verifyUser, verifyClient };
