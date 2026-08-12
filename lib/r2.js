import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];

export function hasR2() {
  return required.every((name) => process.env[name]);
}

function getClient() {
  if (!hasR2()) throw new Error('R2 storage is not configured on this server.');
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
}

export function getPublicUrl(key) {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (!base) throw new Error('R2_PUBLIC_URL is not configured on this server.');
  return `${base}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

export async function putR2Object({ key, body, contentType, cacheControl = 'public, max-age=31536000, immutable' }) {
  await getClient().send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: body, ContentType: contentType, CacheControl: cacheControl }));
  return getPublicUrl(key);
}
