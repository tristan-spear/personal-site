import { NextResponse } from 'next/server';
import { isEditor } from '@/lib/auth';
import { hasR2, putR2Object } from '@/lib/r2';

export const runtime = 'nodejs';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 15 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
}

export async function POST(request) {
  if (!(await isEditor())) return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
  if (!hasR2()) return NextResponse.json({ success: false, error: 'R2 storage is not configured.' }, { status: 503 });
  const form = await request.formData();
  const file = form.get('file');
  const kind = form.get('kind') === 'pdf' ? 'pdf' : 'image';
  if (!file || typeof file.arrayBuffer !== 'function') return NextResponse.json({ success: false, error: 'Choose a file first.' }, { status: 400 });
  if (kind === 'pdf' && file.type !== 'application/pdf') return NextResponse.json({ success: false, error: 'Resume uploads must be PDF files.' }, { status: 400 });
  if (kind === 'image' && !IMAGE_TYPES.has(file.type)) return NextResponse.json({ success: false, error: 'Choose a PNG, JPEG, WebP, GIF, or SVG image.' }, { status: 400 });
  const maxBytes = kind === 'pdf' ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) return NextResponse.json({ success: false, error: `File is larger than ${maxBytes / 1024 / 1024} MB.` }, { status: 400 });
  const key = kind === 'pdf' ? 'assets/Tristan_Spear_Resume.pdf' : `uploads/${crypto.randomUUID()}-${safeName(file.name)}`;
  try {
    const url = await putR2Object({ key, body: Buffer.from(await file.arrayBuffer()), contentType: file.type });
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('R2 upload failed:', error);
    return NextResponse.json({ success: false, error: 'Could not upload the file.' }, { status: 500 });
  }
}
