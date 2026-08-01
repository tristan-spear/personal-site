# Personal Site

Tristan Spear's personal site, built with Next.js (App Router) and deployed on Vercel.

## Stack

- Next.js 15 (App Router, JavaScript)
- React 19
- Bootstrap Icons (`bi bi-*`) + hand-written CSS
- Nodemailer for the contact form

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

The site runs at http://localhost:3000.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run favicon` | Regenerate favicons from `public/assets/favicon.png` |

## Project structure

```
app/
  layout.jsx           Root layout: header, footer, links, global CSS, metadata
  page.jsx             /
  projects/page.jsx    /projects
  resume/page.jsx      /resume
  blog/page.jsx        /blog
  contact/page.jsx     /contact
  api/contact/route.js POST /api/contact (Nodemailer)
  globals.css
components/            Shared UI, each with colocated CSS
public/assets/         Images and resume PDF
scripts/               Favicon generation
```

Pages are server components by default. `"use client"` is only used where there
is state, effects, or event handlers: the header (active-link styling via
`usePathname`), the home page (typing animation), the timeline, project cards,
the contact form, and the resume download button.

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

Without the SMTP variables the site still builds and runs; the contact form
returns a "not configured to send mail" error.

## Deployment

Import the repository into Vercel. It is detected as a Next.js project, so no
build configuration is needed, and the contact endpoint runs as a serverless
function — there is no separate server to deploy. Add the environment variables
above under Project Settings → Environment Variables.
