/**
 * Registry of CMS-backed collections: page sections that are a list of items
 * rather than a fixed set of text blocks (see lib/pages.js for those).
 *
 * To make another list editable: add a migration creating a table with an `id`,
 * a `position`, and one column per field, then add an entry here. The API route
 * and the generic edit form work off this definition.
 *
 * `table` and field `name`s are the only values interpolated into SQL, so they
 * must stay hardcoded here — never derived from a request.
 *
 * This module is imported by client components too, so it must not import the
 * database or anything server-only.
 */
const COLLECTIONS = {
  timeline: {
    table: 'timeline',
    path: '/',
    itemLabel: 'entry',
    fields: [
      {
        name: 'event_date',
        label: 'Date',
        type: 'text',
        maxLength: 80,
        placeholder: 'June 2026',
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        maxLength: 300,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        maxLength: 1000,
      },
      {
        name: 'thumbnail',
        label: 'Image',
        type: 'text',
        required: true,
        maxLength: 300,
        placeholder: '/assets/cp.png',
        hint: 'Path to a file in the public folder, or an https:// URL.',
        pattern: /^(\/[^\s]*|https:\/\/[^\s]+)$/,
        patternMessage:
          'Image must be a path starting with / or an https:// URL.',
      },
      {
        name: 'color',
        label: 'Accent color',
        type: 'color',
        required: true,
        maxLength: 7,
        placeholder: '#5DFFBF',
      },
    ],
    // Rendered when the database is unreachable. Mirrors the seed in
    // db/migrations/002_timeline.sql.
    defaults: [
      {
        id: -1,
        event_date: 'June 2026',
        title: 'Joined SESLOC Credit Union as Systems Development Engineer Intern',
        description: 'Building systems and internal tools that power credit union operations',
        thumbnail: '/assets/sesloc.png',
        color: '#4A9EFF',
      },
      {
        id: -2,
        event_date: 'January 2026',
        title: 'Hired as a Web Developer at Cal Poly AIP',
        description:
          'Delivering web projects across departments, including administrative tooling and official university webpages',
        thumbnail: '/assets/cp.png',
        color: '#5DFFBF',
      },
      {
        id: -3,
        event_date: 'September 2025',
        title: 'Joined Hack4Impact Cal Poly as Full Stack Developer',
        description: 'Building full stack applications for non-profit organizations',
        thumbnail: '/assets/hack4impact.png',
        color: '#FF7BC4',
      },
      {
        id: -4,
        event_date: 'July 2025',
        title: 'Transferred to Cal Poly - San Luis Obispo',
        description:
          'Graduated Cuesta College, and began studying Software Engineering at Cal Poly SLO',
        thumbnail: '/assets/cp.png',
        color: '#7B75FF',
      },
      {
        id: -5,
        event_date: 'June 2025',
        title: 'Completed Full Stack Web Development Course on Udemy',
        description: "Completed Angela Yu's Full Stack Web Development Course",
        thumbnail: '/assets/udemy.png',
        color: '#FFF066',
      },
      {
        id: -6,
        event_date: 'June 2024',
        title: 'Robotics & Programming Instructor at iD Tech - Stanford',
        description: 'Teaching robotics and programming to students ages 10-13',
        thumbnail: '/assets/stanford.png',
        color: '#6BA8FF',
      },
      {
        id: -7,
        event_date: 'March 2024',
        title: 'Joined AI Research Project at Cal Poly SLO',
        description: 'Began working as an AI Researcher with other students at Cal Poly',
        thumbnail: '/assets/cp.png',
        color: '#FF7BC4',
      },
      {
        id: -8,
        event_date: 'January 2024',
        title: 'Got hired as a tutor at Cuesta College',
        description: 'Tutoring students in computer science, mathematics, and physics',
        thumbnail: '/assets/cuesta.jpeg',
        color: '#FFF066',
      },
      {
        id: -9,
        event_date: 'August 2022',
        title: 'Started studying Computer Science at Cuesta College',
        description: 'Began pursuing Associates of Science in Math & Computer Science',
        thumbnail: '/assets/cuesta.jpeg',
        color: '#7B75FF',
      },
    ],
  },
};

const IDENTIFIER = /^[a-z][a-z0-9_]*$/;

export function getCollectionConfig(name) {
  const config = COLLECTIONS[name];
  if (!config) return null;

  // Cheap guard against a typo in this file turning into broken SQL.
  const names = config.fields.map((field) => field.name);
  if (!IDENTIFIER.test(config.table) || !names.every((n) => IDENTIFIER.test(n))) {
    throw new Error(`Invalid table or field name configured for collection "${name}".`);
  }
  return config;
}

/** A blank item, used as the starting point for the "add" form. */
export function emptyItem(config) {
  return Object.fromEntries(
    config.fields.map((field) => [field.name, field.type === 'color' ? '#5DFFBF' : ''])
  );
}
