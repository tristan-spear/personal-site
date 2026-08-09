import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isEditor } from '@/lib/auth';
import {
  createCollectionItem,
  getCollectionItems,
  listCollectionItems,
  validateItem,
} from '@/lib/content';
import { getCollectionConfig } from '@/lib/collections';

export const runtime = 'nodejs';

/** Public: the list as rendered on the page. */
export async function GET(request, { params }) {
  const { collection } = await params;
  if (!getCollectionConfig(collection)) {
    return NextResponse.json({ success: false, error: 'Unknown collection.' }, { status: 404 });
  }

  const items = await getCollectionItems(collection);
  return NextResponse.json({ success: true, items });
}

/** Protected: adds an item at the top of the list. */
export async function POST(request, { params }) {
  const { collection } = await params;
  const config = getCollectionConfig(collection);
  if (!config) {
    return NextResponse.json({ success: false, error: 'Unknown collection.' }, { status: 404 });
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

  const { values, error } = validateItem(collection, body);
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }

  try {
    const created = await createCollectionItem(collection, values);
    const items = await listCollectionItems(collection);
    revalidatePath(config.path);
    return NextResponse.json({ success: true, id: created.id, items }, { status: 201 });
  } catch (err) {
    console.error(`Failed to add to "${collection}":`, err);
    return NextResponse.json(
      { success: false, error: 'Could not add the entry. Please try again.' },
      { status: 500 }
    );
  }
}
