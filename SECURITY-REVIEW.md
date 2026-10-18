# Portfolio security and database review

## Secret storage
- Local runtime values live only in the ignored .env file. Do not share it or include it in archives.
- Local .env Windows permissions are restricted to the current user, SYSTEM and Administrators.
- .env.example contains key names and non-secret examples only.
- Hosted RESEND_API_KEY and ADMIN_ALLOWED_EMAIL are masked Sites runtime secrets.
- Database and R2 access use Cloudflare bindings; no database password or storage API key is needed in browser code.
- Scans of 272 non-dependency files found no unexpected copy of the current Resend key. Old portfolio archives contained no .env/private-key filenames.
- Source scans found no matching current Resend key in tracked files or Git history. Pattern scans found no common private-key/token strings in tracked source. These scans are bounded checks, not a guarantee against every secret format.

## Changes
- Admin access requires the configured owner's email and Sites-supplied authenticated user ID; bare CF email headers no longer authorize writes.
- Development identity works only in development, and the preview strips user-supplied Sites identity headers. Production must run behind Sites dispatch.
- Admin writes reject cross-site/mismatched Origin requests. SQL values remain parameterized; entity lookup rejects inherited object properties.
- JSON and multipart upload bodies have streamed size limits. Uploaded media types, sizes, names and purposes are validated.
- CMS links must use HTTP/HTTPS without embedded credentials.
- Database-connected public pages no longer replace empty/draft/deleted results with sample content.
- Draft/unattached R2 files require owner access. Public certificate, published project media and current resume links are allowed.
- Contact requests use a D1-backed limit: 5 attempts per source per 15-minute window and 30 total per window. Source addresses are hashed per window, not stored raw. Expired counters are removed. A missing rate-limit table fails closed.
- Responses add nosniff, referrer policy, restricted device permissions, basic CSP directives and no-store for private APIs/admin. Full script CSP is not enabled because the framework uses inline scripts.

## Database
- Live DB binding: DB. Existing production schema has 14 core tables, 6 projects, 6 certifications, 1 profile, and no uploaded media at the time of inspection.
- New schema-only migration 0002_soft_vindicator.sql adds contact_rate_limits without replacing existing records.
- All migrations passed an isolated SQLite migration test. Local migration applied and PRAGMA quick_check returned ok.
- Production migration and hosted API checks are verified after deployment and recorded below.

## Verification
Run node scripts/security-check.mjs for authorization, forged CF header rejection, cross-site writes, request limits, entity allowlists, database migrations, rate limits, draft visibility and contact delivery simulations. No real email is sent by this test.
Run node node_modules/typescript/bin/tsc --noEmit --incremental false.
Run npm audit and build using the Sites build helper. Dependency and deployment results are recorded at completion.

## Operational limits
- Keep the preview bound to 127.0.0.1. Local development sign-in is a simulation and must never be exposed as a production service.
- Resend onboarding@resend.dev is for initial delivery to the account email. A verified sending domain should be configured for production delivery.
- Keep access restricted until you explicitly choose to make the portfolio public.
- A report or passing test does not establish that a system has zero security risk.

## Dependency follow-up
Patched the Next.js, React/server renderer, Vite, Vinext, Cloudflare plugin, Wrangler and Workers-types versions. Patched transitive esbuild and fflate using explicit overrides, verified through tests and build.
An upstream braces stack-exhaustion advisory has no patched release as of this review: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm . It is pulled through build/lint glob tooling. Do not expose development servers or accept untrusted glob patterns/build inputs. Audit totals and build results are added after validation.

## Validation results
- Security regression tests: PASS, including rejected javascript/credential-bearing links and private draft media.
- TypeScript check: PASS.
- npm audit --omit=dev: 0 vulnerabilities.
- Full npm audit: 8 high entries, all in the transitive braces build/lint tooling chain; 0 critical, moderate or low. No patched braces release is available.
- Local D1: 6 projects, 6 certifications; quick_check=ok.
- Local .env stays ignored and has restricted Windows permissions; deployed secrets are masked.

- Production build: PASS. Built Worker HTTP checks: public pages 200, 3 homepage projects, nosniff/security headers present, all anonymous admin methods and forged CF headers rejected, cross-site contact rejected, .env and .git URLs return 404.
- Generated build output contains no copy of the actual Resend API key.
