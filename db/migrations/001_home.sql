-- Editable copy for the home page.
--
-- One row per page, keyed to id = 1: the page always exists, so the app never
-- has to deal with a missing row, and columns map 1:1 to the blocks the editor
-- can change. Adding another page means adding another table shaped like this
-- one plus an entry in lib/pages.js.

CREATE TABLE IF NOT EXISTS home (
  id         integer PRIMARY KEY DEFAULT 1,
  name       text NOT NULL,
  intro      text NOT NULL,
  about      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT home_single_row CHECK (id = 1)
);

-- Seed with the copy that used to be hardcoded in app/page.jsx.
-- Markup the renderer understands: `**bold**`, a newline for a line break, and
-- a blank line to start a new paragraph.
INSERT INTO home (id, name, intro, about)
VALUES (
  1,
  'Tristan Spear',
  'Hi, I''m **Tristan**, I am a Junior, studying
**Software Engineering** at Cal Poly SLO 🐎',
  'Welcome to my personal website! I’m a Software Engineering student who enjoys building creative solutions and diving into new technologies. I’m currently looking for internship or part-time opportunities in software development, and I’m always learning through my studies and hands-on projects.

I grew up on the Central Coast, in Arroyo Grande, California. I spend my time studying, coding, reading, going to the gym, playing sports, and hanging out with my pets and family.

I''m always open to respond to messages or meet for a coffee chat. Feel free to reach out to me or connect!'
)
ON CONFLICT (id) DO NOTHING;
