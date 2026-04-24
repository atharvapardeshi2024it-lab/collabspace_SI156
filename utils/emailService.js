const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendWelcomeEmail = async (to, firstName) => {
  try {
    const info = await transporter.sendMail({
      from: `"CollabSpace" <${process.env.EMAIL_USER}>`,
      to,
      subject: '👋 Welcome to CollabSpace!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:2rem">
          <h1 style="color:#3b82f6">⟡ CollabSpace</h1>
          <h2>Welcome, ${firstName}! 🎉</h2>
          <p>You have successfully joined CollabSpace!</p>
          <ul>
            <li>💻 Create and join projects</li>
            <li>📚 Form study groups</li>
            <li>📄 Share resources</li>
            <li>💬 Chat in real-time</li>
            <li>🏆 Earn contribution points</li>
          </ul>
          <p>Happy collaborating! 🚀</p>
        </div>
      `,
    });
    console.log('✅ Email sent!', info.messageId);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

const sendJoinNotification = async (to, ownerName, joinerName, groupName) => {
  try {
    await transporter.sendMail({
      from: `"CollabSpace" <${process.env.EMAIL_USER}>`,
      to,
      subject: `👥 ${joinerName} joined your group — ${groupName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:2rem">
          <h1 style="color:#3b82f6">⟡ CollabSpace</h1>
          <h2>New Member! 🎉</h2>
          <p>Hi ${ownerName}, <strong>${joinerName}</strong> just joined your group <strong>${groupName}</strong>!</p>
        </div>
      `,
    });
    console.log('✅ Join notification sent!');
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

module.exports = { sendWelcomeEmail, sendJoinNotification };
