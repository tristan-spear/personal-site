import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { putR2Object, hasR2 } from '../lib/r2.js';

const assetsDir = fileURLToPath(new URL('../public/assets/', import.meta.url));
const contentTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };

if (!hasR2()) throw new Error('Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL first.');
for (const name of await readdir(assetsDir)) {
  if (name.startsWith('favicon')) continue;
  const contentType = contentTypes[extname(name).toLowerCase()];
  if (!contentType) continue;
  const key = `assets/${name}`;
  await putR2Object({ key, body: await readFile(join(assetsDir, name)), contentType });
  console.log(`Uploaded ${key}`);
}
