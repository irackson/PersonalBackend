# Vercel migration

The existing Express application, EJS administration interface and MongoDB
collections are retained. Vercel project: `ianrackson-api` in `iracksons-projects`
(Hobby), region `iad1`. Intended custom domain: `api.ianrackson.com`.

The app exports its Express handler on Vercel, while `node server.js` still
listens locally. MongoDB sessions persist across invocations. Connection pools
are bounded, EJS paths are absolute, and async route errors reach an error handler.
Email delivery is awaited before responding so function completion does not
silently discard pending provider requests. Missing credentials fail closed.

Required existing configuration must be copied securely from Heroku to Vercel:
`MONGODB_URL`, `SECRET`, `ADMIN_CODE`, `SALT_ROUNDS`, `DOMAIN`, `MAILGUN_API`,
`MAILGUN_DOMAIN`, and `MAILGUN_FROM`. Preserve values and existing admin accounts.
Do not commit environment files or export credentials into logs.

The existing Atlas `SEIR` cluster is free and contains `PortfolioDB`. This
migration does not seed, rewrite, drop, or copy production database collections.

Verification:
- `node --test test/*.test.js` tests awaited email completion and provider failure
  without sending real email.
- Compare deployed GET responses, including `/all`, with the original API.
- Verify static assets, EJS login, admin protection and session persistence.
- Validate public frontend navigation and deep links after DNS cutover.
- Only retire the old Heroku app after the new API, DNS and TLS work.

Rollback: preserve the old Heroku configuration and Cloudflare web records until
cutover verification passes. Restore those web records if needed; the MongoDB
database is shared and unchanged. Retiring Heroku must not delete Atlas data.
