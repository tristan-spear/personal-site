import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  createSessionToken,
  isAuthConfigured,
  sessionCookieOptions,
  verifyPassword,
} from '@/lib/auth';

export const runtime = 'nodejs';

// Best-effort brute-force brake. Per server instance and lost on restart, which
// is fine for a single-editor site — it only needs to make guessing tedious.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

function rateLimited(key) {
  const now = Date.now();
  for (const [ip, entry] of attempts) {
    if (now - entry.first > WINDOW_MS) attempts.delete(ip);
  }

  const entry = attempts.get(key);
  if (!entry) {
    attempts.set(key, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request) {
  if (!isAuthConfigured()) {
    console.error('EDIT_PASSWORD and/or SESSION_SECRET are not set.');
    return NextResponse.json(
      { success: false, error: 'Editing is not configured on this server.' },
      { status: 500 }
    );
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Try again later.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (!verifyPassword(body?.password)) {
    return NextResponse.json({ success: false, error: 'Incorrect password.' }, { status: 401 });
  }

  attempts.delete(ip);

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}
