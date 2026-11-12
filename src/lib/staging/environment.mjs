import target from '../../integrations/staging/target.json' with { type: 'json' }
export function assertStagingEnvironment(env = process.env) {
  if (env.DB_PROVIDER !== 'postgres' || env.INTEGRATION_TARGET !== 'staging' || env.PAYLOAD_SCHEMA_PUSH !== 'false' || env.ENABLE_DEV_SEED !== 'false') throw Error('Staging requires PostgreSQL, disabled schema push and disabled development seeds.')
  if (env.STAGING_NEON_PROJECT_ID !== target.projectID || env.STAGING_NEON_BRANCH_ID !== target.branchID) throw Error('Staging project/branch does not match the independently created target.')
  for (const name of ['DATABASE_URL', 'DATABASE_URL_UNPOOLED', 'STAGING_DATABASE_URL']) {
    const value = env[name]
    if (!value && name === 'DATABASE_URL_UNPOOLED') continue
    let url
    try { url = new URL(value || '') } catch { throw Error('A staging PostgreSQL URL is missing or invalid.') }
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || url.hostname.replace('-pooler.', '.') !== target.host || decodeURIComponent(url.pathname.slice(1)) !== target.database || !['require', 'verify-full'].includes(url.searchParams.get('sslmode'))) throw Error('Database target is outside the isolated staging allowlist or TLS is disabled.')
  }
  if (env.DATABASE_URL !== env.STAGING_DATABASE_URL || env.DATABASE_URI) throw Error('Do not supply an unrelated URL or SQLite file to staging.')
  if (!env.PAYLOAD_SECRET || env.PAYLOAD_SECRET.length < 32) throw Error('Staging needs its own strong session secret.')
  if (env.STORAGE_PROVIDER !== 's3' || env.PRIVATE_STORAGE_ENDPOINT !== target.storageEndpoint || env.PRIVATE_STORAGE_CONTENT_BUCKET !== 'academy-content' || env.PRIVATE_STORAGE_RECORDINGS_BUCKET !== 'academy-recordings' || env.PRIVATE_STORAGE_MEDIA_BUCKET !== 'site-media' || !env.PRIVATE_STORAGE_ACCESS_KEY_ID || !env.PRIVATE_STORAGE_SECRET_ACCESS_KEY) throw Error('Staging requires its isolated private storage buckets and credentials; filesystem fallback is forbidden.')
  let appURL
  try { appURL = new URL(env.APP_URL || '') } catch { throw Error('Provide the staging application URL.') }
  if (appURL.protocol !== 'https:' || appURL.username || appURL.password || (env.NETLIFY === 'true' && ['localhost', '127.0.0.1'].includes(appURL.hostname))) throw Error('Staging requires HTTPS and Netlify requires a public application hostname.')
  return target
}
export function assertPrivateVerificationEnvironment(env = process.env) {
  const target = assertStagingEnvironment(env)
  if (!['localhost', '127.0.0.1'].includes(new URL(env.APP_URL).hostname) || env.NETLIFY === 'true') throw Error('Verification identities may be created or removed only during unpublished loopback testing.')
  return target
}
