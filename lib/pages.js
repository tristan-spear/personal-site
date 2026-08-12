/**
 * Registry of CMS-backed pages.
 *
 * To make another page editable: add a migration creating a table shaped like
 * `home` (id = 1 singleton, one text column per block), add an entry here, then
 * read it with getPageContent('<slug>'). The API route and edit UI are generic.
 *
 * `table` and `fields` are the only values ever interpolated into SQL, so they
 * must stay hardcoded here — never derived from a request.
 */
const PAGES = {
  home: {
    table: 'home',
    path: '/',
    fields: ['name', 'intro', 'about', 'profile_image'],
    maxLength: 5000,
    // Rendered when the database is unreachable. Mirrors the seed in
    // db/migrations/001_home.sql.
    defaults: {
      name: 'Tristan Spear',
      intro:
        "Hi, I'm **Tristan**, I am a Junior, studying\n**Software Engineering** at Cal Poly SLO 🐎",
      about: [
        'Welcome to my personal website! I’m a Software Engineering student who enjoys building creative solutions and diving into new technologies. I’m currently looking for internship or part-time opportunities in software development, and I’m always learning through my studies and hands-on projects.',
        'I grew up on the Central Coast, in Arroyo Grande, California. I spend my time studying, coding, reading, going to the gym, playing sports, and hanging out with my pets and family.',
        "I'm always open to respond to messages or meet for a coffee chat. Feel free to reach out to me or connect!",
      ].join('\n\n'),
      profile_image: '/assets/headshot.jpeg',
    },
  },
};

const IDENTIFIER = /^[a-z][a-z0-9_]*$/;

export function getPageConfig(page) {
  const config = PAGES[page];
  if (!config) return null;

  // Cheap guard against a typo in this file turning into broken SQL.
  if (!IDENTIFIER.test(config.table) || !config.fields.every((f) => IDENTIFIER.test(f))) {
    throw new Error(`Invalid table or field name configured for page "${page}".`);
  }
  return config;
}

export function listPages() {
  return Object.keys(PAGES);
}
