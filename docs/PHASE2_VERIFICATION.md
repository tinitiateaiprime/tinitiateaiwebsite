# Phase 2 runbook and verification

Current working branch: `integration/phase2-masterclass`.

The later [Phase 2C checkout, approval, notifications and student-preview report](PHASE2C_VERIFICATION.md) contains current behavior and verification. Earlier results below describe the prior phase.

The authentication, student dashboard and Free Demos follow-up supersedes the original public Academy listing and shared-cookie behavior. See [UX fixes, changed files, current verification and inspection URLs](PHASE2_UX_FIXES.md). The latest inspection server runs on loopback port 3100; the original verification run below stopped its server at that earlier handoff.

Earlier authentication follow-up verification: **25 production-browser tests and 20 unit/engine checks passed**, as did TypeScript, lint (three pre-existing warnings), and the production build. Desktop/mobile screens were inspected. Course IDs, 120 imports and six original MP4 hashes were preserved. See the Phase 2C report above for the later test results and current inspection server.

This phase integrates the existing HTML Academy into the Azure-designed Payload site. It adds `/academy`, protected lesson wrappers and `/trainer`, reuses the six Python recordings and upstream recorder, and keeps existing course IDs, student authentication and enrollment workflows. There is no Cosmos migration, production import, deployment or push.

## Local setup

Use Node 24.22.1 or later in the Node 24 release line, FFmpeg/ffprobe on PATH, and Chromium installed for the project Playwright version. Payload 3.93 requires at least this Node patch level. Install from the lockfile with `npm.cmd ci`; no legacy peer flag is needed. The Phase 1 local database/media must first exist; follow its [runbook](PHASE1_RUNBOOK.md) for a fresh checkout. Do not point these commands at production.

Clone the source into a separate reference directory, then run from the website root:

```powershell
git clone https://github.com/AkhilaThorpunuri/masterclass-interactive-web-training-center C:\Code\academy-reference
git -C C:\Code\academy-reference checkout 7f9ee906f353f72f4696c004b20052ddb3751d7f
npm.cmd run academy:prepare -- C:\Code\academy-reference
npm.cmd run academy:init
npm.cmd run academy:import
npm.cmd run academy:fixtures
npm.cmd run academy:dev -- --port 3100
```

`academy:init` creates a separate online backup of `.phase1-local/site.db` and initializes only `.phase2-local/site.db`. Its uploads and session secret are separate. Initialization is only needed for a new schema; regular dev/start/import disable schema push. All launchers override PostgreSQL URLs and disable external email/chat/Google services. Preparation requires network access on the first run to snapshot external JS/CSS. It preserves original lesson bytes privately and produces the checked-in source manifest. Repeat preparation reuses frozen libraries. Review changed source versions before approval.

Local-only fake accounts all use `Phase1-Local-Verification-Only!`:

| Login | Collection | Local purpose |
| --- | --- | --- |
| phase1-admin@example.test | Users | Administrator, assigned Python |
| academy-trainer@example.test | Users | Trainer, assigned Python |
| academy-unassigned@example.test | Users | Trainer without assignments |
| phase1-student@example.test | Students | Explicit Python license |
| academy-unlicensed@example.test | Students | No license; enrollment cannot unlock lessons |
| academy-other@example.test | Students | Other learner for ownership checks |

Use `/login?mode=trainer` for trainer/admin login and `/admin` for license/assignment administration. Fixtures approve only the Data Structures demo. Imported recordings initially require administrator approval in `/trainer`; the browser test exercises approval for all six. These identities and grants exist only in the isolated copy. Never run fixture code against a live database.

Run the worker separately when a job exists:

```powershell
npm.cmd run academy:worker
# Or process at most one queued job:
$env:ACADEMY_WORKER_ONCE='true'
npm.cmd run academy:worker
Remove-Item Env:\ACADEMY_WORKER_ONCE
```

Narration remains disabled unless an administrator sets `ALLOW_PAID_RECORDING=true` and provisions `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` privately for the worker. Model/voice changes must also be reflected in preparation/import. Do not put credentials in source or public environment variables. Silent previews are for local verification and cannot be published.

Stop dev before building or starting the production server:

```powershell
npm.cmd run academy:build
npm.cmd run academy:start -- --port 3100
```

The regular `dev`, `build` and `start` commands retain the original configured backend behavior. Do not use them as a substitute for isolated testing. PostgreSQL deployment needs a reviewed staging migration and matching private content artifact; see [migration notes](../src/migrations/postgres/README.md). The local worker's SQLite claim implementation is not a tested production PostgreSQL worker.

## Verification commands

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:integration
npm.cmd run test:academy
$env:ACADEMY_CAPTURE_ROOT=(Resolve-Path .academy-private/source).Path
node --test vendor/dashboard-tutor/test/basic.test.js
Remove-Item Env:\ACADEMY_CAPTURE_ROOT
npm.cmd run test:e2e
npm.cmd run academy:migrations
npm.cmd audit --json
```

The browser suite expects the isolated server on port 3100, or `E2E_BASE_URL`. It is deliberately serial. Its final worker test modifies the separate reference CSS, reimports into the local copy, records a real silent preview, then restores the original source/manifest, assignments and published approvals in `finally`. Do not run it against any shared environment or interrupt it during source mutation. Test logs, screenshots, reports, private source, MP4s, databases and session secrets are ignored by Git.

## Results

Verified on 11 November 2026 using Node 24.22.1, Payload 3.93.0, Next.js 16.4.6, and the isolated Phase 2 SQLite copy. A temporary npm-cached Node binary was used; the machine's global Node 24.19.0 installation was not changed. Upgrade/select the version in `.nvmrc` before running the commands above.

| Check | Result |
| --- | --- |
| Fresh `npm ci` from the final lockfile | Passed, without legacy peer flags |
| Production `academy:build` after fresh install | Passed; compiled successfully, including TypeScript |
| Explicit `typecheck` | Passed |
| ESLint | Passed with zero errors and three existing unused-variable warnings in policy/pricing components |
| Phase 1 import/security unit checks | 5 passed |
| Academy unit, inventory and HTML dependency checks | 6 passed |
| Reused upstream engine basic tests | 7 passed |
| Full browser suite against the final production build | 18 passed in 2.3 minutes: 10 Phase 1, 7 Academy, 1 actual worker integration |
| Offline PostgreSQL migration generation | Passed with connections disabled; 79 generated UP statements; SQL not applied |
| Canonical catalog preservation | All 101 existing course IDs and slugs match Phase 1 |
| Original private video storage | Six SHA-256-verified blobs, 166,338,752 bytes total; six published fixture recordings |
| Repeated import | Zero lessons created or updated |
| Worker cleanup | Reference CSS restored; no queued/processing jobs remain |

The original Print video was actually played, its time advanced, and the original Python Run produced `Hello, World!`. Mobile iframe layout and the unified website screenshots were inspected. The worker test used the real original scanner/planner/Playwright/FFmpeg path and created a nonzero-duration silent preview. Its source mutation and restoration exercised fingerprint invalidation rather than a mocked hash change. There were no paid narration calls.

Final `npm audit` reports 29 advisories: 6 low, 18 moderate, 5 high and **zero critical**. The high entries involve the Payload/Lexical/happy-dom chain, source-map-js and zod. They remain a production dependency-review item. DOMPurify is overridden to patched 3.4.17 for the newly resolved Monaco peer dependency. No forced major downgrade was applied. npm also reports upstream deprecations/install-script review notices; successful build and worker execution do not mean those advisories are resolved.

Verification logs use the `tinitiate-phase2-*-final` names in the current Windows temporary directory. Browser artifacts are under ignored `test-results/` and `playwright-report/`. Access logs may contain short-lived scoped lesson tickets and should remain private. Port 3100 is stopped after verification. No application changes were committed, pushed or deployed.

The inventory contains 133 HTML pages: 39 course hubs, 32 candidate demos, 53 lessons, three obsolete duplicates and six separate materials. Import maps 120 eligible pages to existing courses; four aggregate pages remain unmapped and private. No new course records are created. Private storage holds six unique original MP4 blobs, with history rows referencing those blobs. All existing files were ffprobe checked. Repeated import reports zero created/updated lessons.

The checks cover explicitly approved public demos, direct paid HTML/CSS/JS/video denial, enrollment independence, exact course licenses, expiry/revocation, all six video ranges, actual Print playback, original Python Run output, slides/navigation, sandbox isolation, persisted progress, mobile layout, trainer assignments, role escalation denial, recording reuse, real CSS fingerprint changes, concurrent job deduplication, actual original-engine FFmpeg preview, failure/retry and preservation of the published video. Phase 1 tests retain public URLs/redirects, catalog, login, account/enrollment, demos, contact and responsive website checks.

## Limits and release work

No newly narrated ElevenLabs recording was generated: credentials/cost enablement were unavailable. Existing narrated videos and actual silent capture were tested. Live payment, email/Google delivery, a private Azure Blob adapter, hosted worker deployment, PostgreSQL schema application/rollback and Azure/Cosmos access were not exercised. They are not claimed as complete.

PostgreSQL UP/DOWN SQL and a schema snapshot were generated with database connections disabled. The reconstructed Phase 1 baseline requires comparison against staging; no Neon writes were made. DOWN is destructive to Academy records, requires an explicit reviewed rollback setting and refuses to proceed while trainer roles remain. Keep backups and coordinate application/schema rollback.

The upstream Academy is public, so this site's access checks cannot protect copies downloaded from GitHub. Proprietary release requires private upstream/artifact distribution. Review remaining npm advisories and Phase 1 release limitations before production use. See [security and licensing](PHASE2_SECURITY_AND_LICENSING.md) for the enforced boundaries.
