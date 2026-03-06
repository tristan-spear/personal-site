# Contact API

Sends contact form submissions via Nodemailer. Lives in `client/api/` next to the frontend source.

## Setup

1. From this folder, install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in your SMTP and recipient:

   - **SMTP_*** – Your mail provider (Gmail, SendGrid, Mailgun, etc.). For Gmail use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password.
   - **CONTACT_TO** – Email address where you want to receive form messages.

3. Run the API: `npm start` (or `npm run dev` with auto-reload). Default port is **3001**.

## Development

With the API running on port 3001, the Vite dev server (from `client/`) proxies `/api/*` to it. The contact form posts to `/api/contact` and the proxy forwards to `http://localhost:3001/contact`.

## Production

- Set **VITE_API_URL** in the client build to your API base URL (e.g. `https://api.yoursite.com`) so the form posts to the correct host.
- Or serve the API under the same origin (e.g. `/api`) and do not set `VITE_API_URL` (client uses relative `/api/contact`).
