const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function addAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@fitcraft.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email: admin@fitcraft.com');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@fitcraft.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1234567890',
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@fitcraft.com');
    console.log('🔐 Password: Admin@123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAdmin();
