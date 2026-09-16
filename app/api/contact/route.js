import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey || !process.env.CONTACT_TO) {
  const missing = ['RESEND_API_KEY', 'CONTACT_TO'].filter((key) => !process.env[key]);
  console.warn(
    `Missing env: ${missing.join(', ')}. Set them in .env.local (or your Vercel project settings) for the contact form to send email.`
  );
}

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

  if (!resend) {
    console.error('Resend is not configured');
    return NextResponse.json(
      { success: false, error: 'Server is not configured to send mail.' },
      { status: 500 }
    );
  }

  const fromAddress =
    process.env.RESEND_FROM || 'Contact Form <onboarding@resend.dev>';

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\nSubject: ${subject.trim()}\n\n${message.trim()}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject.trim())}</p>
        <hr />
        <p>${escapeHtml(message.trim()).replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Contact send error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message. Please try again later.',
        },
        { status: 500 }
      );
    }

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
