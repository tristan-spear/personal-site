import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isEditor } from '@/lib/auth';
import {
  deleteCollectionItem,
  listCollectionItems,
  updateCollectionItem,
  validateItem,
} from '@/lib/content';
import { getCollectionConfig } from '@/lib/collections';

export const runtime = 'nodejs';

/** Shared checks for the protected handlers below. */
async function authorize(params) {
  const { collection, id } = await params;

  const config = getCollectionConfig(collection);
  if (!config) {
    return { response: NextResponse.json({ success: false, error: 'Unknown collection.' }, { status: 404 }) };
  }

  if (!(await isEditor())) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Not signed in. Sign in at /user and try again.' },
        { status: 401 }
      ),
    };
  }

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return { response: NextResponse.json({ success: false, error: 'Invalid id.' }, { status: 400 }) };
  }

  return { collection, config, id: numericId };
}

export async function PUT(request, { params }) {
  const { response, collection, config, id } = await authorize(params);
  if (response) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const { values, error } = validateItem(collection, body, { partial: true });
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }

  try {
    const updated = await updateCollectionItem(collection, id, values);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'That entry no longer exists.' }, { status: 404 });
    }
    const items = await listCollectionItems(collection);
    revalidatePath(config.path);
    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error(`Failed to update "${collection}" item ${id}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not save changes. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { response, collection, config, id } = await authorize(params);
  if (response) return response;

  try {
    const deleted = await deleteCollectionItem(collection, id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'That entry no longer exists.' }, { status: 404 });
    }
    const items = await listCollectionItems(collection);
    revalidatePath(config.path);
    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error(`Failed to delete "${collection}" item ${id}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not delete the entry. Please try again.' },
      { status: 500 }
    );
  }
}
