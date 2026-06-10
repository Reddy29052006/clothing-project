require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/user/auth');
const measurementRoutes = require('./routes/user/measurements');
const productRoutes = require('./routes/user/products');
const orderRoutes = require('./routes/user/orders');
const feedbackRoutes = require('./routes/user/feedback');
const adminRoutes = require('./routes/admin/admin');
const vendorRoutes = require('./routes/vendor/vendor');
const path = require('path');

// Connect to database
connectDB();

const app = express();

//  Middleware 
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin)
        return callback(null, true);

      // only CLIENT_URL can access
      if (origin === process.env.CLIENT_URL)
        return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

//  Health Check 
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🧵 FitCraft API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

//  Routes 
app.use('/api/auth', authRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);

//  404 Handler 
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

//  Error Handler 
app.use(errorHandler);

//  Start Server 
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 FitCraft Server running on http://localhost:${PORT}`);
});
