-- Blogs and the posts inside them.
--
-- `blogs.slug` is the URL segment (/blog/drone-photography). Posts store that
-- slug, and the foreign key follows a rename or delete of the blog.
-- Photos are one object-storage URL per line.

CREATE TABLE IF NOT EXISTS blogs (
  id          serial PRIMARY KEY,
  position    integer NOT NULL DEFAULT 0,
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blogs_position_idx ON blogs (position, id);

INSERT INTO blogs (position, slug, title, description)
SELECT 0, 'drone-photography', 'Drone Photography', 'Aerial photos and notes from flights.'
WHERE NOT EXISTS (SELECT 1 FROM blogs WHERE slug = 'drone-photography');

CREATE TABLE IF NOT EXISTS blog_posts (
  id         serial PRIMARY KEY,
  position   integer NOT NULL DEFAULT 0,
  blog_slug  text NOT NULL REFERENCES blogs (slug) ON UPDATE CASCADE ON DELETE CASCADE,
  post_date  text NOT NULL DEFAULT '',
  location   text NOT NULL DEFAULT '',
  body       text NOT NULL DEFAULT '',
  photos     text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_blog_idx ON blog_posts (blog_slug, post_date DESC, id);
