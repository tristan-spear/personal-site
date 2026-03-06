import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const requiredEnv = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.warn(
    `Missing env: ${missing.join(', ')}. Set them in client/api/.env for the contact form to send email.`
  );
}

const transporter =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, subject, message.',
    });
  }

  const toEmail = process.env.CONTACT_TO;
  if (!toEmail) {
    console.error('CONTACT_TO is not set');
    return res.status(500).json({
      success: false,
      error: 'Server is not configured to send mail.',
    });
  }

  if (!transporter) {
    console.error('Nodemailer transporter not configured');
    return res.status(500).json({
      success: false,
      error: 'Server is not configured to send mail.',
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toEmail,
      replyTo: email,
      subject: `[Contact] ${subject.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\nSubject: ${subject.trim()}\n\n${message.trim()}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject.trim())}</p>
        <hr />
        <p>${escapeHtml(message.trim()).replace(/\n/g, '<br>')}</p>
      `,
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('Contact send error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
});

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
