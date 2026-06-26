const path = require('path');

// Load environment variables from apps/backend/.env
const envPath = path.join(__dirname, '../apps/backend/.env');
require('dotenv').config({ path: envPath });

const { sendEmail } = require('../apps/backend/utils/notificationService');

// Get test email address from arguments
const testEmail = process.argv[2];

if (!testEmail) {
  console.error('❌ Error: Please provide a recipient email address.');
  console.log('Usage: node scripts/testEmail.js recipient@example.com');
  process.exit(1);
}

async function testNotification() {
  console.log('🔄 Initiating test email...');
  console.log(`To: ${testEmail}`);
  console.log(`From: ${process.env.FROM_EMAIL || 'notifications@fitcraft.com'}`);
  console.log(`SMTP Configured: ${process.env.SMTP_HOST ? 'Yes' : 'No'}`);
  console.log(`SendGrid Configured: ${process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}`);

  try {
    await sendEmail({
      to: testEmail,
      subject: '🧪 FitCraft SMTP/SendGrid Test Email',
      text: 'Congratulations! Your FitCraft notification system is properly configured and functional.',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #c5a880;">FitCraft Notification Engine</h2>
          <p>This is a test notification verifying that your cloud email configuration works correctly.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">If you received this message, your integration is fully operational.</p>
        </div>
      `,
    });
    console.log('✅ Email trigger completed.');
  } catch (error) {
    console.error('❌ Failed to run email notification test:', error);
  }
}

testNotification();
