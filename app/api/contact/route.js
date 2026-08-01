import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const requiredEnv = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.warn(
    `Missing env: ${missing.join(', ')}. Set them in .env.local (or your Vercel project settings) for the contact form to send email.`
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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing required fields: name, email, subject, message.',
      },
      { status: 400 }
    );
  }

  const toEmail = process.env.CONTACT_TO;
  if (!toEmail) {
    console.error('CONTACT_TO is not set');
    return NextResponse.json(
      { success: false, error: 'Server is not configured to send mail.' },
      { status: 500 }
    );
  }

  if (!transporter) {
    console.error('Nodemailer transporter not configured');
    return NextResponse.json(
      { success: false, error: 'Server is not configured to send mail.' },
      { status: 500 }
    );
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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact send error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
