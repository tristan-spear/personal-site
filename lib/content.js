import 'server-only';

import { getSql, hasDatabase } from '@/lib/db';
import { getCollectionConfig } from '@/lib/collections';
import { getPageConfig } from '@/lib/pages';

/**
 * Reads a page's editable copy. Reading is public.
 *
 * Falls back to the defaults in lib/pages.js if the database is unset or
 * unreachable, so a database hiccup degrades to the previous hardcoded copy
 * instead of a broken page.
 */
export async function getPageContent(page) {
  const config = getPageConfig(page);
  if (!config) throw new Error(`Unknown page "${page}".`);

  if (!hasDatabase()) {
    console.warn(`DATABASE_URL is not set; serving default copy for "${page}".`);
    return { ...config.defaults };
  }

  try {
    const sql = getSql();
    const rows = await sql.query(
      `SELECT ${config.fields.join(', ')} FROM ${config.table} WHERE id = 1`
    );
    if (!rows.length) {
      console.warn(`No row in "${config.table}"; run npm run db:migrate.`);
      return { ...config.defaults };
    }
    return { ...config.defaults, ...rows[0] };
  } catch (err) {
    console.error(`Failed to load content for "${page}":`, err);
    return { ...config.defaults };
  }
}

/**
 * Validates an incoming patch against the page's allowlisted fields.
 * Returns { updates } on success or { error } on the first problem found.
 */
export function validateUpdates(page, body) {
  const config = getPageConfig(page);
  if (!config) return { error: `Unknown page "${page}".` };

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Expected a JSON object of fields to update.' };
  }

  const updates = {};
  for (const [field, value] of Object.entries(body)) {
    if (!config.fields.includes(field)) {
      return { error: `"${field}" is not an editable field on this page.` };
    }
    if (typeof value !== 'string') {
      return { error: `"${field}" must be a string.` };
    }
    const cleaned = value.replace(/\r\n/g, '\n').trim();
    if (!cleaned) {
      return { error: `"${field}" cannot be empty.` };
    }
    if (cleaned.length > config.maxLength) {
      return { error: `"${field}" must be ${config.maxLength} characters or fewer.` };
    }
    updates[field] = cleaned;
  }

  if (!Object.keys(updates).length) {
    return { error: 'No fields to update.' };
  }
  return { updates };
}

/**
 * Writes validated updates and returns the page's full new content.
 * Callers must verify the session first — this does no auth of its own.
 */
export async function updatePageContent(page, updates) {
  const config = getPageConfig(page);
  if (!config) throw new Error(`Unknown page "${page}".`);

  const sql = getSql();
  const returning = config.fields.join(', ');
  const entries = Object.entries(updates);
  const assignments = entries.map(([field], i) => `${field} = $${i + 1}`).join(', ');

  const rows = await sql.query(
    `UPDATE ${config.table} SET ${assignments}, updated_at = now() WHERE id = 1 RETURNING ${returning}`,
    entries.map(([, value]) => value)
  );
  if (rows.length) return rows[0];

  // The singleton row is missing (migration seed skipped or deleted): recreate
  // it from the defaults with this edit applied.
  const seeded = { ...config.defaults, ...updates };
  const inserted = await sql.query(
    `INSERT INTO ${config.table} (id, ${returning}) VALUES (1, ${config.fields
      .map((_, i) => `$${i + 1}`)
      .join(', ')}) RETURNING ${returning}`,
    config.fields.map((field) => seeded[field])
  );
  return inserted[0];
}

/* ------------------------------------------------------------------ *
 * Collections (ordered lists of items, e.g. the timeline)
 * ------------------------------------------------------------------ */

function selectItems(config) {
  const columns = config.fields.map((field) => field.name).join(', ');
  return getSql().query(
    `SELECT id, ${columns} FROM ${config.table} ORDER BY position ASC, id ASC`
  );
}

/** Reads a collection, falling back to defaults if the database is unavailable. */
export async function getCollectionItems(name) {
  const config = getCollectionConfig(name);
  if (!config) throw new Error(`Unknown collection "${name}".`);

  if (!hasDatabase()) {
    console.warn(`DATABASE_URL is not set; serving default "${name}" items.`);
    return config.defaults;
  }

  try {
    return await selectItems(config);
  } catch (err) {
    console.error(`Failed to load collection "${name}":`, err);
    return config.defaults;
  }
}

/** Same read, but surfaces errors. Used to return fresh state after a write. */
export async function listCollectionItems(name) {
  const config = getCollectionConfig(name);
  if (!config) throw new Error(`Unknown collection "${name}".`);
  return selectItems(config);
}

/**
 * Validates an incoming item against the collection's field definitions.
 * With `partial`, only the fields present in the body are checked.
 */
export function validateItem(name, body, { partial = false } = {}) {
  const config = getCollectionConfig(name);
  if (!config) return { error: `Unknown collection "${name}".` };

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Expected a JSON object.' };
  }

  const known = new Set(config.fields.map((field) => field.name));
  for (const key of Object.keys(body)) {
    if (!known.has(key)) {
      return { error: `"${key}" is not an editable field.` };
    }
  }

  const values = {};
  for (const field of config.fields) {
    if (partial && !(field.name in body)) continue;

    const raw = body[field.name] ?? '';
    if (typeof raw !== 'string') {
      return { error: `"${field.label}" must be text.` };
    }

    const cleaned = raw.replace(/\r\n/g, '\n').trim();
    if (field.required && !cleaned) {
      return { error: `${field.label} is required.` };
    }
    // Format before length, so a malformed color reports the format rather
    // than just being too long.
    if (field.type === 'color' && cleaned && !/^#[0-9a-f]{6}$/i.test(cleaned)) {
      return { error: `${field.label} must be a hex color like #5DFFBF.` };
    }
    if (cleaned.length > field.maxLength) {
      return { error: `${field.label} must be ${field.maxLength} characters or fewer.` };
    }
    if (field.pattern && cleaned && !field.pattern.test(cleaned)) {
      return { error: field.patternMessage || `${field.label} is not valid.` };
    }
    values[field.name] = cleaned;
  }

  if (!Object.keys(values).length) {
    return { error: 'No fields to update.' };
  }
  return { values };
}

/**
 * Adds an item at the top of the collection.
 *
 * The new position is min(position) - 1 so existing rows never need renumbering.
 * Callers must verify the session first — this does no auth of its own.
 */
export async function createCollectionItem(name, values) {
  const config = getCollectionConfig(name);
  if (!config) throw new Error(`Unknown collection "${name}".`);

  const columns = config.fields.map((field) => field.name);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const [row] = await getSql().query(
    `INSERT INTO ${config.table} (${columns.join(', ')}, position)
     VALUES (${placeholders}, COALESCE((SELECT MIN(position) FROM ${config.table}), 0) - 1)
     RETURNING id`,
    columns.map((column) => values[column] ?? '')
  );
  return row;
}

/** Updates one item. Returns null if no row has that id. */
export async function updateCollectionItem(name, id, values) {
  const config = getCollectionConfig(name);
  if (!config) throw new Error(`Unknown collection "${name}".`);

  const entries = Object.entries(values);
  const assignments = entries.map(([column], i) => `${column} = $${i + 1}`).join(', ');

  const [row] = await getSql().query(
    `UPDATE ${config.table} SET ${assignments}, updated_at = now()
     WHERE id = $${entries.length + 1} RETURNING id`,
    [...entries.map(([, value]) => value), id]
  );
  return row ?? null;
}

/** Deletes one item. Returns null if no row has that id. */
export async function deleteCollectionItem(name, id) {
  const config = getCollectionConfig(name);
  if (!config) throw new Error(`Unknown collection "${name}".`);

  const [row] = await getSql().query(
    `DELETE FROM ${config.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  return row ?? null;
}
