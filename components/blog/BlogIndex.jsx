'use client';

import React from 'react';
import Link from 'next/link';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import RichText from '@/components/richText/RichText';
import { emptyItem, getCollectionConfig } from '@/lib/collections';
import { mediaUrl } from '@/lib/media';

const config = getCollectionConfig('blogs');

function BlogIndex({ blogs = [], canEdit = false }) {
  const collection = useCollection('blogs', blogs);

  return (
    <div className="blog">
      <div className="blog-wrap">
        <header className="blog-heading">
          <h1>Blogs</h1>
        </header>

        {canEdit && (
          <div className="cms-toolbar">
            <button
              type="button"
              className="cms-add"
              onClick={() => collection.startAdding()}
              disabled={collection.addingTo !== null}
            >
              + Add blog
            </button>
          </div>
        )}

        {canEdit && collection.addingTo !== null && (
          <ItemForm
            fields={config.fields}
            initialValues={emptyItem(config)}
            submitLabel="Add blog"
            onSubmit={collection.add}
            onCancel={collection.cancel}
          />
        )}

        <div className="blog-grid">
          {collection.items.map((blog) =>
            canEdit && collection.editingId === blog.id ? (
              <ItemForm
                key={blog.id}
                fields={config.fields}
                initialValues={blog}
                submitLabel="Save"
                onSubmit={(values) => collection.save(blog.id, values)}
                onCancel={collection.cancel}
                onDelete={() => collection.remove(blog.id)}
              />
            ) : (
              <EditableItem
                key={blog.id}
                canEdit={canEdit}
                onEdit={() => collection.startEditing(blog.id)}
              >
                <Link href={`/blog/${blog.slug}`} className="blog-card">
                  <div className="blog-card-media">
                    {blog.cover_image ? (
                      <img src={mediaUrl(blog.cover_image)} alt="" />
                    ) : (
                      <div className="blog-card-placeholder" aria-hidden="true">
                        <i className="bi bi-camera" />
                      </div>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <h2>{blog.title}</h2>
                    {blog.description && (
                      <p>
                        <RichText text={blog.description} />
                      </p>
                    )}
                    <span className="blog-card-open">
                      Open <i className="bi bi-arrow-right" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </EditableItem>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogIndex;
