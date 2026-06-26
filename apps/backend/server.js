require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/user/auth');
const measurementRoutes = require('./routes/user/measurements');
const productRoutes = require('./routes/user/products');
const orderRoutes = require('./routes/user/orders');
const feedbackRoutes = require('./routes/user/feedback');
const adminRoutes = require('./routes/admin/admin');
const tailorsRoutes = require('./routes/tailors/tailors');
const customOrderRoutes = require('./routes/user/customOrders');
const paymentRoutes = require('./routes/user/payments');
const path = require('path');

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Security and Performance Hardening
app.use(helmet());
app.use(compression());

// Validate production secrets
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fitcraft_jwt')) {
  console.warn('⚠️ WARNING: JWT_SECRET is unset or using a default insecure value in production mode!');
}

//  Middleware 
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin)
        return callback(null, true);

      // Allow CLIENT_URL, localhost, or any ngrok tunnel domain
      if (
        origin === process.env.CLIENT_URL ||
        origin.includes('localhost') ||
        origin.includes('ngrok-free.dev')
      ) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
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
app.use('/api/tailors', tailorsRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/payments', paymentRoutes);

//  404 Handler 
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

//  Error Handler 
app.use(errorHandler);

//  Start Server 
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT"]
  }
});

// Attach socket.io server instance to app settings so controllers can access it
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`👤 Client ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`\n🚀 FitCraft Server running on http://localhost:${PORT}`);
  }); // Force nodemon automatic restart
}

module.exports = { app, server };
