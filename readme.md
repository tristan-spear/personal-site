# Personal Site

Tristan Spear's personal site, built with Next.js (App Router) and deployed on Vercel.

## Stack

- Next.js 16 (App Router, Turbopack, JavaScript)
- React 19
- Bootstrap Icons (`bi bi-*`) + hand-written CSS
- Nodemailer for the contact form
- Neon Postgres (`@neondatabase/serverless`) for editable page copy

## Getting started

```bash
npm install
npm run dev
```

For the contact form to send mail, create a `.env.local` with the variables
listed under [Environment variables](#environment-variables).

The site runs at http://localhost:3000.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply pending SQL migrations to Neon |

## Project structure

```
app/
  layout.jsx           Root layout: header, footer, links, global CSS, metadata
  page.jsx             /
  projects/page.jsx    /projects
  resume/page.jsx      /resume
  contact/page.jsx     /contact
  user/page.jsx        /user (password form / edit-mode status)
  api/contact/route.js POST /api/contact (Nodemailer)
  api/auth/            POST /api/auth/login, POST /api/auth/logout
  api/content/[page]/  GET (public) and PUT (session required) page copy
  globals.css
components/            Shared UI, each with colocated CSS
db/migrations/         Numbered .sql files, applied by npm run db:migrate
lib/                   Server-only helpers: db, auth, content, page registry
scripts/db-migrate.js  Migration runner
public/assets/         Images and resume PDF
```

Pages are server components by default. `"use client"` is only used where there
is state, effects, or event handlers: the header (active-link styling via
`usePathname`), the home page body (typing animation and edit controls), the
timeline, project cards, the contact form, and the resume download button.

## Editable content

The home page's name, intro and About Me text live in Postgres instead of in the
JSX, so they can be changed from the browser.

1. Create a Neon project and put its connection string in `DATABASE_URL`.
2. Pick an `EDIT_PASSWORD` and generate a `SESSION_SECRET`:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Run `npm run db:migrate` to create and seed the `home` table.
4. Visit `/user`, enter the password, then use the **Edit** button on any block.

Reading copy is public; every save is authorized on the server against an
httpOnly, HMAC-signed session cookie. Signed-out visitors get the page with no
edit UI at all. Copy supports `**bold**`, a newline for a line break, and a
blank line to start a new paragraph — all rendered as React nodes, never HTML.

If `DATABASE_URL` is unset or Neon is unreachable, pages fall back to the
defaults in `lib/pages.js` rather than erroring.

### Making another page editable

1. Add a migration creating a table shaped like `home`: an `id = 1` singleton
   row with one `text` column per editable block.
2. Add an entry to the `PAGES` registry in `lib/pages.js` with the table name,
   the page path, and the allowlisted field names.
3. In the page's server component, `await getPageContent('<slug>')` and pass the
   result plus `await isEditor()` into a client component that wraps each block
   in `<EditableBlock>`.

The `/api/content/[page]` handlers need no changes — only names present in the
registry are ever accepted or interpolated into SQL.

## Environment variables

Set these in `.env.local` for local development and in your Vercel project
settings for production.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Email shown on the contact page |
| `SMTP_HOST` | Yes | SMTP server hostname |
| `SMTP_PORT` | No | SMTP port (defaults to `587`) |
| `SMTP_SECURE` | No | `true` to use TLS on connect |
| `SMTP_USER` | Yes | SMTP username |
| `SMTP_PASS` | Yes | SMTP password or app password |
| `SMTP_FROM` | No | "From" address (defaults to `SMTP_USER`) |
| `CONTACT_TO` | Yes | Where contact form submissions are delivered |
| `DATABASE_URL` | Yes | Neon Postgres connection string (pooled) |
| `EDIT_PASSWORD` | Yes | Password for `/user`; only ever compared server-side |
| `SESSION_SECRET` | Yes | Random 32+ byte hex string used to sign session cookies |

Without the SMTP variables the site still builds and runs; the contact form
returns a "not configured to send mail" error. Without `DATABASE_URL` pages
render their default copy, and without `EDIT_PASSWORD`/`SESSION_SECRET` signing
in is disabled.

## Deployment

Import the repository into Vercel. It is detected as a Next.js project, so no
build configuration is needed, and the contact endpoint runs as a serverless
function — there is no separate server to deploy. Add the environment variables
above under Project Settings → Environment Variables.
