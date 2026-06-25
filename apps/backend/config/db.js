const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`🔗 Connecting to MongoDB (Attempt ${i}/${retries})...`);
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error (Attempt ${i}/${retries}): ${error.message}`);
      if (i === retries) {
        console.error('💥 Max database connection attempts reached. Exiting...');
        process.exit(1);
      }
      console.log(`⏳ Waiting ${delay / 1000}s before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
