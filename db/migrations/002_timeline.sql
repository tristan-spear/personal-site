-- Timeline entries for the home page's Professional Journey section.
--
-- Unlike `home`, this is a collection: many rows, editor-controlled order.
-- `position` ascends from the top of the timeline, and new entries are added
-- with min(position) - 1 so adding to the top never renumbers existing rows.
-- The column is called event_date because `date` is a type name in Postgres.

CREATE TABLE IF NOT EXISTS timeline (
  id          serial PRIMARY KEY,
  position    integer NOT NULL DEFAULT 0,
  event_date  text NOT NULL DEFAULT '',
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  thumbnail   text NOT NULL,
  color       text NOT NULL DEFAULT '#ffffff',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS timeline_position_idx ON timeline (position, id);

-- Seed with the entries that used to be hardcoded in components/timeline/timeline.jsx.
-- Skipped entirely once the table has any rows, so re-running never duplicates.
INSERT INTO timeline (position, event_date, title, description, thumbnail, color)
SELECT *
FROM (
  VALUES
    (0, 'June 2026', 'Joined SESLOC Credit Union as Systems Development Engineer Intern',
     'Building systems and internal tools that power credit union operations',
     '/assets/sesloc.png', '#4A9EFF'),
    (1, 'January 2026', 'Hired as a Web Developer at Cal Poly AIP',
     'Delivering web projects across departments, including administrative tooling and official university webpages',
     '/assets/cp.png', '#5DFFBF'),
    (2, 'September 2025', 'Joined Hack4Impact Cal Poly as Full Stack Developer',
     'Building full stack applications for non-profit organizations',
     '/assets/hack4impact.png', '#FF7BC4'),
    (3, 'July 2025', 'Transferred to Cal Poly - San Luis Obispo',
     'Graduated Cuesta College, and began studying Software Engineering at Cal Poly SLO',
     '/assets/cp.png', '#7B75FF'),
    (4, 'June 2025', 'Completed Full Stack Web Development Course on Udemy',
     'Completed Angela Yu''s Full Stack Web Development Course',
     '/assets/udemy.png', '#FFF066'),
    (5, 'June 2024', 'Robotics & Programming Instructor at iD Tech - Stanford',
     'Teaching robotics and programming to students ages 10-13',
     '/assets/stanford.png', '#6BA8FF'),
    (6, 'March 2024', 'Joined AI Research Project at Cal Poly SLO',
     'Began working as an AI Researcher with other students at Cal Poly',
     '/assets/cp.png', '#FF7BC4'),
    (7, 'January 2024', 'Got hired as a tutor at Cuesta College',
     'Tutoring students in computer science, mathematics, and physics',
     '/assets/cuesta.jpeg', '#FFF066'),
    (8, 'August 2022', 'Started studying Computer Science at Cuesta College',
     'Began pursuing Associates of Science in Math & Computer Science',
     '/assets/cuesta.jpeg', '#7B75FF')
) AS seed (position, event_date, title, description, thumbnail, color)
WHERE NOT EXISTS (SELECT 1 FROM timeline);
