# Arham Ul Haq Sheikh — Portfolio

Personal portfolio for data engineering, DevOps and cloud work. Includes project case studies, experience, education, certifications, resume, a contact form and a protected owner CMS.

## Stack
React, TypeScript, Vinext/Vite, Tailwind CSS, Cloudflare Workers, D1, R2 and Resend.

## Local setup
Requires Node.js 22.13 or newer and npm.

1. Run npm ci.
2. Copy .env.example to .env and fill in the server-side settings. Never commit .env or an API key.
3. Run npm run build to generate dist/server/wrangler.json.
4. On a NEW local database only, apply the SQL files under drizzle/ in filename order using the command below once per file. Existing databases need only unapplied migrations.

~~~powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_portfolio_core.sql
~~~

5. Start the local preview:

~~~sh
npm run dev -- --host 127.0.0.1
~~~

Open http://127.0.0.1:5173/. For initial content seeding and owner editing, visit http://127.0.0.1:5173/signin-with-chatgpt?return_to=/admin. Local sign-in is a development simulation; keep the preview on loopback. The owner CMS seeds the initial data without replacing existing records.

## Environment
- RESEND_API_KEY: server-side sending key.
- CONTACT_FROM_EMAIL: sender address; use a verified domain for production.
- ADMIN_ALLOWED_EMAIL: the allowed owner email.
- SITE_URL: canonical deployed URL.

D1 and R2 use the DB and BUCKET Cloudflare bindings rather than browser API keys. Hosted values are separate from .env and must be configured as runtime settings/secrets in Sites.

## Checks
~~~sh
node scripts/security-check.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
~~~

See SECURITY-REVIEW.md for the security review and known upstream build-tool advisory, and RESPONSIVE-REVIEW.md for responsive checks. Production and local databases are separate.

## Hosting
The existing Sites identity and D1/R2 declarations are in .openai/hosting.json. A GitHub push backs up development source; it does not deploy the website automatically. Publish through the Sites workflow to apply hosted migrations and deploy.
