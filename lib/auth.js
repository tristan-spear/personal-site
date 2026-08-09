import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Password-gated edit sessions.
 *
 * EDIT_PASSWORD never leaves the server: the browser posts a candidate to
 * /api/auth/login and gets back an httpOnly cookie holding an HMAC-signed,
 * expiring token. Nothing in the cookie is secret, but it cannot be forged
 * without SESSION_SECRET, and the client is never trusted to say it is logged
 * in — every protected handler re-verifies the cookie.
 */

export const SESSION_COOKIE = 'site_session';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SUBJECT = 'editor';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

export function isAuthConfigured() {
  return Boolean(process.env.EDIT_PASSWORD && process.env.SESSION_SECRET);
}

function sign(payload) {
  return createHmac('sha256', requireEnv('SESSION_SECRET')).update(payload).digest('base64url');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Constant-time password check. Digesting first keeps both sides equal length. */
export function verifyPassword(candidate) {
  if (typeof candidate !== 'string' || !candidate) return false;
  const expected = requireEnv('EDIT_PASSWORD');
  return timingSafeEqual(
    createHash('sha256').update(candidate).digest(),
    createHash('sha256').update(expected).digest()
  );
}

export function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({
      sub: SUBJECT,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  try {
    if (!safeEqual(signature, sign(payload))) return false;
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return (
      claims?.sub === SUBJECT &&
      typeof claims.exp === 'number' &&
      claims.exp * 1000 > Date.now()
    );
  } catch {
    return false;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    // Localhost is served over http, where browsers drop Secure cookies.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}

/**
 * Server-side source of truth for "is this request from the editor?".
 * Reading the cookie opts the caller into dynamic rendering, which is what we
 * want: edit UI must never be baked into a static page.
 */
export async function isEditor() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
