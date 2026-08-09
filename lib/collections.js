/**
 * Registry of CMS-backed collections: page sections that are a list of items
 * rather than a fixed set of text blocks (see lib/pages.js for those).
 *
 * To make another list editable: add a migration creating a table with an `id`,
 * a `position`, and one column per field, then add an entry here. The API route
 * and the generic edit form work off this definition.
 *
 * Field types: text, textarea, lines (newline-separated list), select, color.
 * `defaults` is optional; where present it is what renders if the database is
 * unreachable. The larger lists leave it out rather than keep a second copy of
 * every project and job description in sync with the seed.
 *
 * `table` and field `name`s are the only values interpolated into SQL, so they
 * must stay hardcoded here — never derived from a request.
 *
 * This module is imported by client components too, so it must not import the
 * database or anything server-only.
 */
const IMAGE_PATTERN = /^(\/[^\s]*|https:\/\/[^\s]+)$/;
const IMAGE_MESSAGE = 'Must be a path starting with / or an https:// URL.';

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
        pattern: IMAGE_PATTERN,
        patternMessage: IMAGE_MESSAGE,
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

COLLECTIONS.projects = {
  table: 'projects',
  path: '/projects',
  itemLabel: 'project',
  fields: [
    {
      name: 'category',
      label: 'Section',
      type: 'select',
      required: true,
      maxLength: 20,
      options: [
        { value: 'web', label: 'Web Projects' },
        { value: 'embedded', label: 'Embedded Projects' },
      ],
    },
    { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 300 },
    {
      name: 'short_description',
      label: 'Card description',
      type: 'textarea',
      maxLength: 600,
      hint: 'The one-liner shown on the card.',
    },
    {
      name: 'details',
      label: 'Implementation details',
      type: 'lines',
      maxLength: 5000,
      hint: 'One bullet per line, shown in the pop-up.',
    },
    { name: 'technologies', label: 'Technologies', type: 'lines', maxLength: 600 },
    {
      name: 'media_type',
      label: 'Media type',
      type: 'select',
      required: true,
      maxLength: 20,
      options: [
        { value: 'image', label: 'Image' },
        { value: 'iframe', label: 'Live site embed' },
      ],
    },
    {
      name: 'media_src',
      label: 'Media source',
      type: 'text',
      required: true,
      maxLength: 500,
      pattern: IMAGE_PATTERN,
      patternMessage: IMAGE_MESSAGE,
      hint: 'Image path, or the site URL when embedding.',
    },
    {
      name: 'media_preview',
      label: 'Card preview image',
      type: 'text',
      maxLength: 500,
      pattern: IMAGE_PATTERN,
      patternMessage: IMAGE_MESSAGE,
      hint: 'Only used for embeds; the card shows this instead of the live site.',
    },
    {
      name: 'links',
      label: 'Links',
      type: 'lines',
      maxLength: 1000,
      hint: 'One per line, written as "Label | https://url".',
    },
  ],
};

COLLECTIONS.education = {
  table: 'education',
  path: '/resume',
  itemLabel: 'degree',
  fields: [
    { name: 'degree', label: 'Degree', type: 'text', required: true, maxLength: 200 },
    { name: 'school', label: 'School', type: 'text', maxLength: 200 },
    {
      name: 'years',
      label: 'Years',
      type: 'text',
      maxLength: 100,
      hint: 'Wrap text in *asterisks* for italics, e.g. 2025 - 2027 *(Expected)*.',
    },
    {
      name: 'thumbnail',
      label: 'Logo',
      type: 'text',
      required: true,
      maxLength: 300,
      pattern: IMAGE_PATTERN,
      patternMessage: IMAGE_MESSAGE,
    },
  ],
};

COLLECTIONS.experience = {
  table: 'experience',
  path: '/resume',
  itemLabel: 'role',
  fields: [
    { name: 'title', label: 'Job title', type: 'text', required: true, maxLength: 200 },
    { name: 'company', label: 'Company', type: 'text', maxLength: 200 },
    { name: 'location', label: 'Location', type: 'text', maxLength: 200 },
    {
      name: 'date_range',
      label: 'Dates',
      type: 'text',
      maxLength: 100,
      placeholder: 'Jan. 2026 - Present',
    },
    {
      name: 'thumbnail',
      label: 'Logo',
      type: 'text',
      required: true,
      maxLength: 300,
      pattern: IMAGE_PATTERN,
      patternMessage: IMAGE_MESSAGE,
    },
    { name: 'bullets', label: 'Bullets', type: 'lines', maxLength: 5000 },
  ],
};

COLLECTIONS.skills = {
  table: 'skills',
  path: '/resume',
  itemLabel: 'category',
  fields: [
    { name: 'category', label: 'Category', type: 'text', required: true, maxLength: 100 },
    { name: 'items', label: 'Skills', type: 'lines', maxLength: 1500 },
  ],
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
    config.fields.map((field) => {
      if (field.type === 'color') return [field.name, '#5DFFBF'];
      if (field.type === 'select') return [field.name, field.options[0].value];
      return [field.name, ''];
    })
  );
}

/** Splits a `lines` field into the list it represents. */
export function toLines(value) {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Parses a links field. Each line is `Label | https://url`; the variant (which
 * drives the button style and icon) follows the same rule the page used when
 * these were hardcoded — GitHub is secondary, anything else is primary.
 */
export function parseLinks(value) {
  return toLines(value)
    .map((line) => {
      const [label, href] = line.split('|').map((part) => part.trim());
      return {
        label,
        href,
        variant: (label || '').toLowerCase().includes('github') ? 'secondary' : 'primary',
      };
    })
    .filter((link) => link.label && link.href);
}

/** Maps a projects row onto the shape ProjectCard expects. */
export function toProjectCard(row) {
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    description: toLines(row.details),
    technologies: toLines(row.technologies),
    media: {
      type: row.media_type,
      src: row.media_src,
      previewImage: row.media_preview || undefined,
    },
    links: parseLinks(row.links),
  };
}
