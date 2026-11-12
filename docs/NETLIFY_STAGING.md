# Netlify staging readiness and Git handoff

Reviewed **11 November 2026**, from `integration/phase2-masterclass` in `C:\Code\tinitiateai-website`.

**Readiness: source is ready for a private Git handoff; the application is not yet ready for a Netlify deployment.** No Netlify deployment, PostgreSQL migration, production Neon access or Azure Cosmos operation was performed. Staging database/storage/Netlify credentials are unavailable in the shell and local environment file. This report intentionally does not substitute local verification for staging verification.

## Repository handoff

Destination: private repository [vikasreddymusku/Tinitiateai.com](https://github.com/vikasreddymusku/Tinitiateai.com), branch [deploy/netlify-staging](https://github.com/vikasreddymusku/Tinitiateai.com/tree/deploy/netlify-staging). The final commit SHA is supplied in the handoff message and can be read with `git ls-remote origin refs/heads/deploy/netlify-staging`.

`main` initially pointed to the existing Phase 1 backup, `41b4c40f8120a3099191facda2ad46989be72eb0`. That commit is an ancestor of the staged Phase 2/UX/2C source. Push uses only `HEAD:refs/heads/deploy/netlify-staging`, without force, leaving `main`, `old-origin` and `upstream` unchanged. Existing Git CLI authentication is used; the connected GitHub app did not have access to this private repository.

The handoff includes source, public design assets already in Git, tests, documentation, generated Payload types/import map, the Academy metadata manifest, vendored recording engine and offline SQL schema artifacts. It excludes `.env*`, credentials, local databases/sidecars, `.academy-private`, private HTML/assets/videos, local account/data copies, test reports, browser storage states and Netlify state. `.gitignore` now also covers SQLite suffixes/sidecars, private recording extensions and deployment state.

Before committing, the complete index is scanned for prohibited paths, private-key/API-token/embedded PostgreSQL credential signatures and exact matches to ten locally configured secret values (values are never printed). Newly added/changed files are checked for large assets. One 7.1 MB public campus JPG was already in the Phase 1 tree, is unchanged and is not a private recording. All 16 existing ancestor commits (488 blobs) also passed filename, signature and known-value checks. This is a repository review and pattern/known-value audit, not a guarantee against every possible unknown secret encoding. Local-only test passwords in test/fixture source are deliberate verification credentials; those accounts/databases must never be imported to staging or production.

## Build and runtime configuration

The existing **Next.js 16 App Router + Payload CMS 3** architecture is retained. It needs server rendering and Node route handlers; do not use static export, SPA fallbacks, a second website or a SQLite deployment. Netlify's current Next.js integration automatically supplies its OpenNext adapter; no legacy plugin is added or pinned. See [Netlify Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

| Setting | Prepared value / action |
| --- | --- |
| Git branch | `deploy/netlify-staging` only; use a separate staging Netlify site |
| Base/package directory | Repository root |
| Build command | `node scripts/netlify-preflight.mjs && npm run build` |
| Publish directory | `.next` (handled by the Next.js integration; do not upload it manually) |
| Node build version | `24.22.1`, matching `.nvmrc` and `engines.node` (`>=24.22.1 <25`) |
| Node Functions runtime | Set `AWS_LAMBDA_JS_RUNTIME=nodejs24.x` in Netlify UI/API, not `netlify.toml` |
| Schema changes during build | Disabled; apply reviewed migrations as a separate staging operation |
| Local setup/import/fixtures during build | Never run any `*:local`, `academy:init`, `academy:fixtures`, `test:fixtures` or local backup command |
| Indexing/access | `X-Robots-Tag: noindex, nofollow, noarchive` prepared; enable actual Netlify staging access protection too |

`netlify.toml` provides the build settings and safe non-secret defaults. The ignore script skips other branches. Netlify's ignore hook cannot stop every manually triggered build, so the **build preflight also refuses other branches and deliberately fails while durable storage is unimplemented**. It performs no database/network operation and prints no configuration values. There is no environment flag to bypass the missing adapters; lift this gate only in a reviewed source change implementing and testing them. This prevents a routine Git push from silently publishing the filesystem-based local application. See [file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/) and [ignore semantics](https://docs.netlify.com/build/configure-builds/ignore-builds/).

Netlify's runtime selection must be set through its UI/CLI/API. Build-file environment variables alone are insufficient for all Functions runtime settings; configure secret/application variables with **Builds and Functions** scopes. See [Functions runtime configuration](https://docs.netlify.com/build/functions/configuration/#node-js-version-for-runtime).

## Required environment variable names

Provide values through the staging site's secret environment settings. Do not commit an actual environment file, expose secrets with `NEXT_PUBLIC_`, reuse production credentials or paste them into reports.

| Names | Requirement |
| --- | --- |
| `NODE_VERSION` | `24.22.1` for builds |
| `AWS_LAMBDA_JS_RUNTIME` | `nodejs24.x`, set in Netlify settings |
| `DB_PROVIDER`, `INTEGRATION_TARGET` | `postgres`, `staging` |
| `STAGING_DATABASE_URL` | Explicit separately verified staging PostgreSQL URL |
| `DATABASE_URL` | Same staging URL as `STAGING_DATABASE_URL`, in Builds and Functions scopes |
| `STAGING_DATABASE_URL_UNPOOLED`, `DATABASE_URL_UNPOOLED` | Optional matching staging direct URLs; current Payload config prefers the unpooled URL when set |
| `PAYLOAD_SECRET` | Unique random staging secret, at least 32 characters; keep stable across staging instances/redeploys |
| `PAYLOAD_SCHEMA_PUSH`, `ENABLE_DEV_SEED`, `ALLOW_PAID_RECORDING` | Explicitly `false` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Staging mail transport and sender |
| `COURSE_REQUEST_NOTIFICATION_EMAIL` | Staging administrator/test mailbox for checkout notifications |
| `DEMO_NOTIFICATION_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` | Configure the demo recipient and optional fallback; avoid unintended real-recipient test mail |
| `CHAT_ENABLED` | `false` unless the staging AI integration is intentionally configured |
| `GEMINI_API_KEY`, `GEMINI_CHAT_MODEL`, `GEMINI_EMBEDDING_MODEL` | Optional server-side AI settings only |
| `TRUST_PROXY` | Leave unset/false until verified trusted ingress overwrites forwarded IP headers; add distributed ingress rate limits |
| `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN` | Deployment automation credentials only if using CLI/API; not required as app runtime variables |

Remove `DATABASE_URI`, `PHASE1_INITIALIZE_SCHEMA`, `PHASE2_LOCAL` and local verification options from Netlify. `PAYLOAD_MEDIA_DIR` and `ACADEMY_PRIVATE_ROOT` currently select **local filesystem directories**; setting them to a bucket URL does not implement durable storage. Bucket/provider credential variable names must be finalized with the actual adapters, which do not exist yet; they are not represented as functioning configuration here.

## Staging PostgreSQL and migrations

**Not applied: no separate staging connection is available.** The configured production URL was not used, nor was the Neon connector queried. The SQLite test copy is not a deployment database.

Static review of the existing artifacts:

- `src/migrations/postgres/phase2.up.sql`: adds Academy collections/relations/indexes, the trainer role and authentication reset timestamps to an existing Phase 1 PostgreSQL schema. It is not a complete baseline for an empty database.
- `phase2c.up.sql`: 42 additive statements for course requests, notifications, preview configuration and their relations/indexes. It creates unique request keys used by checkout and retains the existing Course Licenses authorization model.
- Both UP scripts contain explicit transactions and no data imports, fake-account inserts, `DROP TABLE`, `TRUNCATE` or `DELETE FROM`. Generated snapshots describe schema, not student/database rows. DOWN is a separately guarded, destructive rollback and is not part of staging setup.
- The original Phase 2 baseline was reconstructed offline. Actual schema drift must be compared before application; neither UP is an automatically safe migration against an unknown live schema.

When a dedicated staging instance exists, verify its provider/project/branch/host/database identity independently, ensure it is neither production Neon nor a production credential alias, take a staging backup and compare its schema against the Phase 1 baseline. Establish the missing Phase 1 schema through a reviewed baseline if the database is empty. Then apply Phase 2 followed by Phase 2C through a staging-only migration session, stopping on the first error; record each checksum/application in the deployment change log. Never run schema push or automatically apply these scripts in `next build`. Validate the actual PostgreSQL transactions, FKs, unique keys and approval/checkout concurrency before deployment.

Populate only an audited canonical course/content metadata dataset preserving course IDs/relationships. Do not copy `.phase2-local/site.db`, the local backup, student/session tables, local licenses, enquiries, checkout requests or fake admin/trainer accounts. Existing importers and the recording worker are deliberately local-guarded; a reviewed staging-only content import path is another outstanding requirement. Bootstrap a real staging administrator and test identities with unique credentials under staging access protection; never enable `/api/dev-seed`.

## Durable storage and worker blockers

| Area | Current implementation | Required before release |
| --- | --- | --- |
| Payload media | `Media.upload.staticDir`, local image derivatives | Durable object-storage upload adapter for media/derivatives; preserve URL/relationship behavior; use separate storage/ACLs from paid lessons |
| Original Academy HTML/CSS/JS | `sourceFile()` reads `.academy-private/source` | Private versioned object reads verified against manifest hashes; preserve per-lesson and preview allowlists, safe paths, CSP rewriting and signed session-bound access |
| Protected original/generated videos | `LocalVideoStorage` and filesystem byte-range streams | Durable private recording store, streaming ranges/HEAD with existing session/license/version checks; no public buckets/CDN paid URLs; fail closed on missing objects |
| Approval/integrity verification | Filesystem hash plus `ffprobe` subprocess in approval route | Adapt verification to object storage and a worker with ffprobe; retain review/version integrity instead of hiding failures |
| Recording queue | Local-only SQLite claim and long-running Playwright/FFmpeg worker | Separate authenticated staging PostgreSQL worker with atomic leasing, shared private storage and durable job state; it cannot run as the current local script in a Netlify request |
| Mail outbox | Durable database notification state, request-triggered delivery and admin retry | Staging SMTP credentials and operations/scheduled retry process; review uncertain SMTP acceptance before retries |

No provider credentials or buckets were available, so none was provisioned or configured. Source/video files are not committed, traced into a Function bundle or copied into `public`. The public source manifest alone cannot serve the Academy. Do not weaken authorization to make missing storage look functional. The current single-process request limits also need shared ingress limits for a multi-instance deployment.

The SMTP helper covers checkout and demo notifications. Payload itself still reports that no native email adapter is configured; configure that adapter before relying on password-reset or verification notices. Its console fallback is not external delivery.

## Verification and release decision

All checks were rerun on **11 November 2026** with Node **24.22.1** and only the isolated Phase 2 SQLite copy:

| Check | Result |
| --- | --- |
| TypeScript (`tsc --noEmit`) | Passed |
| Full ESLint plus lint of the added deployment scripts/tests | Zero errors; three pre-existing unused-variable warnings |
| Production Next.js build (`scripts/academy/local.mjs build`) | Passed |
| Import / authorization / Academy projection / recording-engine unit tests | 21 passed |
| Netlify branch/preflight tests | 4 passed, including no secret output and no storage-gate bypass |
| Complete production-browser regression suite | **27 passed in one complete run** |
| Netlify preflight without staging infrastructure | Correctly refuses publication before starting Next.js or connecting to a database |
| Candidate tree, index and prior history security review | No prohibited sensitive files or matching real secrets; no new large/private assets |

Browser coverage includes actual signup/login/screens, multi-course checkout, deduplication, individual CMS approval/rejection, scoped licenses, SMTP failure/retry capture, original interactive Print execution, preview isolation, next-module paywall, expiry/revocation, all six original video ranges/playback, student/admin/trainer logout, account switching, mobile navigation, existing public routes/forms and a real recording-worker regression. The worker restored its stylesheet after the test. Private integrity checks and the staged-file audit are recorded in ignored local reports, not uploaded to GitHub. Earlier feature evidence is in [Phase 2](PHASE2_VERIFICATION.md), [authentication/UX](PHASE2_UX_FIXES.md) and [Phase 2C](PHASE2C_VERIFICATION.md).

Before lifting the deployment gate, test the real staging screens over HTTPS: login changes navigation immediately; independent student/CMS logout and stale-ticket denial; multi-course checkout saved for the correct student without duplicates/payment; actual SMTP acceptance with the staging recipient; individual CMS approval and correct course license; original interactive Print execution; anonymous demo vs authenticated preview; paid next-module HTML/JS/video denial for unlicensed/expired/revoked accounts; all six original video ranges/playback; mobile menus; browser account switching; storage persistence after a new deploy; and cross-instance concurrency. Netlify's adapter/Functions packaging and PostgreSQL/storage integration remain untested, even though the same application passes locally.

**No deployment is authorized by this source push.** Keep staging private and the build gate intact until missing infrastructure and adapters are implemented and verified. Azure Cosmos DB and production Neon remain unchanged.
