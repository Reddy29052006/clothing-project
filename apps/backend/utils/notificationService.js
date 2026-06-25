const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

const sendGridKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'notifications@fitcraft.com';

if (sendGridKey) {
  sgMail.setApiKey(sendGridKey);
}

// Configurable SMTP transporter as secondary fallback
let smtpTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send an email using SendGrid, SMTP, or mock console fallback.
 * @param {object} mailOptions - { to, subject, text, html }
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: fromEmail,
    subject,
    text,
    html: html || text,
  };

  // 1. Try SendGrid if configured
  if (sendGridKey) {
    try {
      await sgMail.send(msg);
      console.log(`✉️ Email sent to ${to} via SendGrid: "${subject}"`);
      return;
    } catch (error) {
      console.error('❌ SendGrid Email Error:', error.message);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  // 2. Try SMTP if configured
  if (smtpTransporter) {
    try {
      await smtpTransporter.sendMail(msg);
      console.log(`✉️ Email sent to ${to} via SMTP: "${subject}"`);
      return;
    } catch (error) {
      console.error('❌ SMTP Email Error:', error.message);
    }
  }

  // 3. Fallback: Log to console
  console.log(`
============================================================
✉️  [MOCK EMAIL NOTIFICATION]
To:      ${to}
From:    ${fromEmail}
Subject: ${subject}
Text:    ${text}
============================================================
`);
};

/**
 * Send order placement confirmation email
 */
const sendOrderConfirmation = async (userEmail, { orderId, productName, totalPrice }) => {
  const subject = `🧵 FitCraft Order Confirmed! - ${orderId}`;
  const text = `Thank you for your order! Your payment for ${productName} of $${totalPrice} has been confirmed. Our tailors are reviewing your measurements and will begin pattern crafting shortly.`;
  const html = `
    <h2>FitCraft Custom Tailoring</h2>
    <p>Thank you for choosing FitCraft! Your custom-fit order has been confirmed.</p>
    <ul>
      <li><strong>Order ID:</strong> ${orderId}</li>
      <li><strong>Garment:</strong> ${productName}</li>
      <li><strong>Total Amount Paid:</strong> $${totalPrice}</li>
    </ul>
    <p>We will notify you as soon as your garment enters stitching or is shipped.</p>
  `;

  await sendEmail({ to: userEmail, subject, text, html });
};

/**
 * Send order status update email
 */
const sendOrderStatusUpdate = async (userEmail, orderId, newStatus, note = '') => {
  const subject = `🚚 Order Update - FitCraft Order ${orderId}`;
  
  let text = `Your FitCraft order ${orderId} status has changed to: ${newStatus}.`;
  if (note) {
    text += `\nTailor's update note: ${note}`;
  }
  
  let html = `
    <h2>FitCraft Order Update</h2>
    <p>Your custom garment order <strong>${orderId}</strong> is progressing!</p>
    <p>Current Status: <strong>${newStatus}</strong></p>
  `;
  if (note) {
    html += `<p><em>Tailor Note: "${note}"</em></p>`;
  }
  html += `<p>You can track the live progress directly from your client dashboard.</p>`;

  await sendEmail({ to: userEmail, subject, text, html });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
};
