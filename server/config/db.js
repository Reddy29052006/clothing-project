const mongoose = require('mongoose');
const seedData = require('../seed/seedData');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await seedData();
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = connectDB;
