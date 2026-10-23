'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import RichText from '@/components/richText/RichText';
import CardDeckCarousel from '@/components/ui/card-deck-carousel';
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

function wrapIndex(index, count) {
  if (!count) return 0;
  return ((index % count) + count) % count;
}

function galleryItems(photos, location) {
  return photos.map((photo, index) => ({
    src: mediaUrl(photo),
    alt:
      photos.length > 1
        ? `${location}, photo ${index + 1} of ${photos.length}`
        : location,
  }));
}

function BlogFeed({ blog, posts = [], canEdit = false }) {
  const collection = useCollection('blog_posts', posts);
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);

  const visible = collection.items
    .filter((post) => post.blog_slug === blog.slug)
    .sort(newestFirst);

  const isOpen = Boolean(active);
  const current = active?.items[active.index];

  useEffect(() => {
    if (!isOpen) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setActive(null);
        return;
      }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      setActive((gallery) => {
        if (!gallery || gallery.items.length < 2) return gallery;
        return { items: gallery.items, index: wrapIndex(gallery.index + dir, gallery.items.length) };
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

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

      {active && current && (
        <div
          className="blog-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
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
          <div className="blog-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            {active.items.length > 1 && (
              <button
                type="button"
                className="blog-lightbox-nav blog-lightbox-prev"
                aria-label="Previous photo"
                onClick={() => {
                  setActive((gallery) => ({
                    items: gallery.items,
                    index: wrapIndex(gallery.index - 1, gallery.items.length),
                  }));
                }}
              >
                <i className="bi bi-chevron-left" aria-hidden="true" />
              </button>
            )}
            <img src={current.src} alt={current.alt} />
            {active.items.length > 1 && (
              <button
                type="button"
                className="blog-lightbox-nav blog-lightbox-next"
                aria-label="Next photo"
                onClick={() => {
                  setActive((gallery) => ({
                    items: gallery.items,
                    index: wrapIndex(gallery.index + 1, gallery.items.length),
                  }));
                }}
              >
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoGrid({ photos, location, onOpen }) {
  if (!photos.length) return null;

  const items = galleryItems(photos, location);

  if (items.length === 1) {
    return (
      <div className="blog-gallery">
        <button
          type="button"
          className="blog-photo"
          onClick={() => onOpen({ items, index: 0 })}
        >
          <img src={items[0].src} alt={items[0].alt} loading="lazy" decoding="async" />
        </button>
      </div>
    );
  }

  return (
    <CardDeckCarousel
      cardWidth="100%"
      aspect="3 / 2"
      scatter={8}
      autoplay={0}
      ariaLabel={`${location} photos`}
      slides={items.map((item) => ({
        image: item.src,
        alt: item.alt,
      }))}
      onSelect={(selected) => onOpen({ items, index: selected.index ?? 0 })}
    />
  );
}

export default BlogFeed;
