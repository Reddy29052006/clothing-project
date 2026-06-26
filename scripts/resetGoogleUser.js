require('dotenv').config({ path: './apps/backend/.env' });
const mongoose = require('mongoose');

const email = process.argv[2];

if (!email) {
  console.error('❌ Usage: node scripts/resetGoogleUser.js <email>');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  googleId: String,
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`❌ No user found with email: ${email}`);
    process.exit(1);
  }

  console.log(`📋 Current state → name: ${user.name}, role: ${user.role}, googleId: ${user.googleId}`);

  await User.updateOne({ email }, { $set: { role: 'pending_onboarding' } });
  console.log(`✅ Reset ${email} → role: pending_onboarding`);
  console.log(`   Now you can sign in with Google and go through the full onboarding flow.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
