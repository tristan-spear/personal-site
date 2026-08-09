import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isEditor } from '@/lib/auth';
import { getPageContent, updatePageContent, validateUpdates } from '@/lib/content';
import { getPageConfig } from '@/lib/pages';

export const runtime = 'nodejs';

/** Public: anyone can read the copy that is already on the page. */
export async function GET(request, { params }) {
  const { page } = await params;
  if (!getPageConfig(page)) {
    return NextResponse.json({ success: false, error: 'Unknown page.' }, { status: 404 });
  }

  const content = await getPageContent(page);
  return NextResponse.json({ success: true, content });
}

/** Protected: requires a valid session cookie, verified here on the server. */
export async function PUT(request, { params }) {
  const { page } = await params;
  const config = getPageConfig(page);
  if (!config) {
    return NextResponse.json({ success: false, error: 'Unknown page.' }, { status: 404 });
  }

  if (!(await isEditor())) {
    return NextResponse.json(
      { success: false, error: 'Not signed in. Sign in at /user and try again.' },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const { updates, error } = validateUpdates(page, body);
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }

  try {
    const content = await updatePageContent(page, updates);
    revalidatePath(config.path);
    return NextResponse.json({ success: true, content });
  } catch (err) {
    console.error(`Failed to save content for "${page}":`, err);
    return NextResponse.json(
      { success: false, error: 'Could not save changes. Please try again.' },
      { status: 500 }
    );
  }
}
