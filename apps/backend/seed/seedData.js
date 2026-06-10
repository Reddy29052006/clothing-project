const User = require('../models/User');

const seedData = async () => {
  console.log(' Checking seed data...');

  // ─── Admin User ───────────────────────────────────────
  const adminExists = await User.findOne({ email: 'admin@fitcraft.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@fitcraft.com',
      password: 'admin123',
      role: 'admin',
      phone: '0000000000',
    });
    console.log('    Admin user seeded.');
  } else {
    console.log('   Admin user already exists. Skipping.');
  }

  // ─── Regular User ─────────────────────────────────────
  const userExists = await User.findOne({ email: 'user@fitcraft.com' });
  if (!userExists) {
    await User.create({
      name: 'Rahul Sharma',
      email: 'user@fitcraft.com',
      password: 'user1234',
      role: 'user',
      phone: '9123456789',
    });
    console.log('    Regular user seeded.');
  } else {
    console.log('   Regular user already exists. Skipping.');
  }

  console.log(' Seeding complete.');
};

module.exports = seedData;
