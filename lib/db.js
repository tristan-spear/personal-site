import { neon } from '@neondatabase/serverless';

let client = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Neon HTTP client, created on first use so a missing DATABASE_URL only breaks
 * requests that actually touch the database rather than the whole build.
 */
export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set.');
  }
  if (!client) {
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}
