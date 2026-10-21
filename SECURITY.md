# Security

Never commit API keys, passwords, private keys, local .env files, database files, or credential exports. Use the ignored .env locally and masked runtime secrets on the hosting platform. .env.example contains configuration names and non-secret examples only.

Run npm run security:scan before pushing. The scanner checks tracked files and reachable Git history without printing secret values. The optional .githooks/pre-push hook runs this check automatically when configured with git config core.hooksPath .githooks. Pattern scanning is a safeguard, not a guarantee against every credential format.

If a key is exposed, revoke or rotate it at its provider immediately. Deleting a file in a later commit does not remove it from Git history or invalidate the key. Coordinate any necessary history cleanup afterward.

Keep dependencies updated and check npm audit. Development/build-tool advisories may exist even when the production-only audit is clean. Keep the development preview on loopback.
