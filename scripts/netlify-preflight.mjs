// No dotenv loading, database connections, migrations or writes. Never default
// to .env.local, the local launcher, production Neon or an ephemeral SQLite file.
const problems = []
if (process.env.BRANCH !== 'deploy/netlify-staging') problems.push('Only deploy/netlify-staging is eligible for this staging configuration.')
if (process.env.DB_PROVIDER !== 'postgres' || process.env.INTEGRATION_TARGET !== 'staging') problems.push('Set DB_PROVIDER=postgres and INTEGRATION_TARGET=staging.')
if (process.env.PAYLOAD_SCHEMA_PUSH !== 'false' || process.env.ENABLE_DEV_SEED !== 'false') problems.push('Disable schema push and development seeds explicitly.')
if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) problems.push('Provide a unique staging PAYLOAD_SECRET of at least 32 characters.')
const stagingURL = process.env.STAGING_DATABASE_URL
try {
  const url = new URL(stagingURL || '')
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.pathname.slice(1)) throw Error()
} catch { problems.push('Provide an independently verified, separate STAGING_DATABASE_URL (PostgreSQL).') }
if (!stagingURL || process.env.DATABASE_URL !== stagingURL || (process.env.DATABASE_URL_UNPOOLED && process.env.DATABASE_URL_UNPOOLED !== process.env.STAGING_DATABASE_URL_UNPOOLED)) problems.push('DATABASE_URL and optional DATABASE_URL_UNPOOLED must match the explicitly supplied staging URLs in build AND Functions environment scopes.')
if (process.env.DATABASE_URI) problems.push('Remove DATABASE_URI; local SQLite must never be used by Netlify.')
// Keep the release gate until actual public hosting, account bootstrap and worker
// operations have been reviewed. Database/storage verification alone is not a deploy.
problems.push('Release blocked: configure and verify the protected public staging site, permanent administrator and separate worker hosting before enabling publication. See docs/NEON_STAGING_VERIFICATION.md.')
console.error('Netlify staging preflight failed (no credentials printed):\n' + problems.map(problem => '- ' + problem).join('\n'))
process.exitCode = 1
