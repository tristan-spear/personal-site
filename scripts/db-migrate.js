#!/usr/bin/env node
//
// Applies every .sql file in db/migrations that has not run yet, in filename
// order, recording each one in schema_migrations. Re-running is a no-op.
//
//   npm run db:migrate
//
// Reads DATABASE_URL from .env.local (or the ambient environment in CI).

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';

const MIGRATIONS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'db',
  'migrations'
);

/**
 * Splits a migration file into individual statements. The Neon HTTP driver
 * sends one statement per request, so semicolons inside string literals,
 * dollar-quoted bodies and comments must not be treated as separators.
 */
export function splitStatements(sqlText) {
  const statements = [];
  let current = '';
  let i = 0;

  while (i < sqlText.length) {
    const char = sqlText[i];
    const rest = sqlText.slice(i);

    if (rest.startsWith('--')) {
      const end = sqlText.indexOf('\n', i);
      i = end === -1 ? sqlText.length : end;
      continue;
    }

    if (rest.startsWith('/*')) {
      const end = sqlText.indexOf('*/', i + 2);
      i = end === -1 ? sqlText.length : end + 2;
      continue;
    }

    if (char === "'" || char === '"') {
      const quote = char;
      let j = i + 1;
      while (j < sqlText.length) {
        if (sqlText[j] === quote) {
          if (sqlText[j + 1] === quote) {
            j += 2;
            continue;
          }
          break;
        }
        j += 1;
      }
      current += sqlText.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    const dollarTag = rest.match(/^\$[A-Za-z_]*\$/);
    if (dollarTag) {
      const tag = dollarTag[0];
      const end = sqlText.indexOf(tag, i + tag.length);
      const stop = end === -1 ? sqlText.length : end + tag.length;
      current += sqlText.slice(i, stop);
      i = stop;
      continue;
    }

    if (char === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      i += 1;
      continue;
    }

    current += char;
    i += 1;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      'DATABASE_URL is not set. Add your Neon connection string to .env.local.'
    );
    process.exit(1);
  }

  const sql = neon(connectionString);

  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const applied = new Set(
    (await sql`SELECT name FROM schema_migrations`).map((row) => row.name)
  );

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`- ${file} (already applied)`);
      continue;
    }

    const statements = splitStatements(await readFile(path.join(MIGRATIONS_DIR, file), 'utf8'));
    await sql.transaction([
      ...statements.map((statement) => sql.query(statement)),
      sql`INSERT INTO schema_migrations (name) VALUES (${file})`,
    ]);

    console.log(`✔ ${file} (${statements.length} statement${statements.length === 1 ? '' : 's'})`);
    ran += 1;
  }

  console.log(ran ? `\nApplied ${ran} migration(s).` : '\nDatabase already up to date.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  });
}
