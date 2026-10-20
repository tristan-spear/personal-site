'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import RichText from '@/components/richText/RichText';
import { emptyItem, getCollectionConfig, toLines } from '@/lib/collections';
import { mediaUrl } from '@/lib/media';

const config = getCollectionConfig('blog_posts');

function formatPostDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ''));
  if (!match) return value || '';
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function newestFirst(a, b) {
  const byDate = String(b.post_date).localeCompare(String(a.post_date));
  if (byDate) return byDate;
  return b.id - a.id;
}

function PostBody({ text }) {
  return String(text ?? '')
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph, index) => (
      <p key={index}>
        <RichText text={paragraph} />
      </p>
    ));
}

function BlogFeed({ blog, posts = [], canEdit = false }) {
  const collection = useCollection('blog_posts', posts);
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);

  const visible = collection.items
    .filter((post) => post.blog_slug === blog.slug)
    .sort(newestFirst);

  useEffect(() => {
    if (!active) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <div className="blog">
      <div className="blog-wrap blog-wrap-post">
        <Link href="/blog" className="blog-back">
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Blogs
        </Link>

        <header className="blog-heading">
          <h1>{blog.title}</h1>
          {blog.description && (
            <p className="blog-description">
              <RichText text={blog.description} />
            </p>
          )}
        </header>

        {canEdit && (
          <div className="cms-toolbar">
            <button
              type="button"
              className="cms-add"
              onClick={() => collection.startAdding()}
              disabled={collection.addingTo !== null}
            >
              + Add post
            </button>
          </div>
        )}

        {canEdit && collection.addingTo !== null && (
          <ItemForm
            fields={config.fields}
            initialValues={{ ...emptyItem(config), blog_slug: blog.slug }}
            submitLabel="Publish"
            onSubmit={collection.add}
            onCancel={collection.cancel}
          />
        )}

        {visible.length === 0 && <p className="blog-empty">No posts yet.</p>}

        <div className="blog-feed">
          {visible.map((post) =>
            canEdit && collection.editingId === post.id ? (
              <ItemForm
                key={post.id}
                fields={config.fields}
                initialValues={post}
                submitLabel="Save"
                onSubmit={(values) => collection.save(post.id, values)}
                onCancel={collection.cancel}
                onDelete={() => collection.remove(post.id)}
              />
            ) : (
              <EditableItem
                key={post.id}
                canEdit={canEdit}
                onEdit={() => collection.startEditing(post.id)}
              >
                <article className="blog-post">
                  <header className="blog-post-meta">
                    <time dateTime={post.post_date}>{formatPostDate(post.post_date)}</time>
                    <span>{post.location}</span>
                  </header>
                  <PhotoGrid
                    photos={toLines(post.photos)}
                    location={post.location}
                    onOpen={setActive}
                  />
                  <div className="blog-post-body">
                    <PostBody text={post.body} />
                  </div>
                </article>
              </EditableItem>
            )
          )}
        </div>
      </div>

      {active && (
        <div
          className="blog-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={() => setActive(null)}
        >
          <button
            ref={closeRef}
            type="button"
            className="blog-lightbox-close"
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <img
            src={active.src}
            alt={active.alt}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function PhotoGrid({ photos, location, onOpen }) {
  if (!photos.length) return null;

  return (
    <div className={`blog-gallery${photos.length === 1 ? ' blog-gallery-single' : ''}`}>
      {photos.map((photo, index) => {
        const alt =
          photos.length > 1
            ? `${location}, photo ${index + 1} of ${photos.length}`
            : location;
        const src = mediaUrl(photo);
        return (
          <button
            key={photo}
            type="button"
            className="blog-photo"
            onClick={() => onOpen({ src, alt })}
          >
            <img src={src} alt={alt} loading="lazy" />
          </button>
        );
      })}
    </div>
  );
}

export default BlogFeed;
