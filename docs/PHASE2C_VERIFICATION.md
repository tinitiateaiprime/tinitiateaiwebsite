# Phase 2C — course requests and interactive previews

Current working branch: `integration/phase2-masterclass`.

Implemented in the existing Azure-designed website, Payload CMS and Academy. The only database written is `.phase2-local/site.db`. No payment gateway, Neon change, Cosmos migration, deployment, push or commit was performed.

## Behavior

Signup defaults to `/courses?welcome=1`; explicit preview/checkout return destinations are retained. The canonical catalog supports selecting multiple courses, removing selections and reviewing them at `/checkout`. Selections are kept separately for each student in this browser. Checkout explicitly says **No payment will be collected** and uses **Submit Course Request**.

Checkout saves one request per student/course, with server-owned student/contact snapshots, course IDs, submission date, reference, status and review history. Multi-course checkout shares a checkout reference and email notification. A unique student/course key, transaction and retries prevent concurrent duplicates. Pending submissions reuse existing records. A rejected request, or an approved request whose access has ended, can be resubmitted using the same record and a new history entry. Existing active licenses are skipped. No license is granted at checkout.

The dashboard immediately displays **Subscription Requested — Pending Approval** for each submitted course. It keeps requests, active licenses and enrollment records separate. Payload CMS → **Course Requests → Course Subscription Requests** provides student details, individual approve/reject actions, a student-facing review note and a license link. Approval and the corresponding single-course license grant are transactional. The existing Course Licenses collection remains the authority for revocation, dates and course access; payment remains Not Collected.

## Notifications and real SMTP verification

Notifications reuse the demo booking Nodemailer configuration helper. Recipient precedence for course requests is `COURSE_REQUEST_NOTIFICATION_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`, then existing `DEMO_NOTIFICATION_EMAIL`. Credentials and recipients are never hardcoded. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` and `SMTP_FROM`.

Each committed checkout has a persistent notification snapshot containing student name/email/contact, course titles and IDs, references, submitted date, Payment status: Not Collected and Approval status at submission: Pending. Mail failure cannot undo the saved requests. The CMS shows attempts/errors and offers a retry that never creates another request. An atomic claim prevents concurrent delivery attempts. SMTP acceptance uncertainty requires checking the mail server and explicitly acknowledging possible duplicate email before retry. A deterministic Message-ID helps correlation; SMTP cannot provide an exactly-once delivery guarantee.

The isolated web launcher disables email by default. Browser tests verified this produces `not-configured`, a refused local SMTP connection produces `failed`, and a real TCP SMTP capture accepts the complete message and persists `sent`. Retrying that accepted notification did not send again or create new requests. The capture is a test server, not evidence of external delivery.

**Real configured SMTP was tested separately on 11 November 2026.** A fresh notification (local outbox ID **4**) was sent using the existing `.env.local` credentials and configured administrator recipient. Nodemailer reported SMTP acceptance; its persisted status is `sent`. This is actual SMTP acceptance, not Payload's console email fallback. Recipient inbox receipt, spam placement and delivery after SMTP acceptance were not independently verified. Credentials/recipient values are deliberately omitted from this report.

To enable real email deliberately for the isolated server, set `PHASE2_ENABLE_EMAIL=true` in the launching shell. For a specific saved notification, with Node from `.nvmrc` selected:

```powershell
$env:PHASE2_ENABLE_EMAIL = 'true'
$env:COURSE_NOTIFICATION_ID = '<local notification ID>'
node --env-file=.env.local scripts/academy/local.mjs notifications
Remove-Item Env:\PHASE2_ENABLE_EMAIL
Remove-Item Env:\COURSE_NOTIFICATION_ID
```

Omitting the ID processes up to 20 queued/failed/not-configured rows. Uncertain or abandoned sending rows require CMS review and explicit acknowledgement; the batch command never blindly retries them. A scheduled isolated worker or an operations retry procedure is required for unattended retries. The final inspection server keeps external email disabled to avoid sending mail during additional manual test checkouts.

## Explicit previews and paywall

Courses now have an administrator-controlled **Approved student MasterClass preview** relationship. Approval records the exact lesson fingerprint and validates that the original lesson belongs to that course. **Approve the current preview content on Save** is needed after reviewing an updated version. A changed fingerprint closes preview access until reviewed; assigning a preview never changes `publicDemo`.

Only the existing Python course (ID **2**) is configured, using the original Python Print lesson (ID **75**). Other courses remain closed until an administrator explicitly selects and reviews a preview. The idempotent local setup is `npm.cmd run academy:preview-setup` after schema initialization/import.

`/demos` keeps the explicitly approved public demo and adds configured student-preview cards. MasterClass cards preserve the lesson destination through login/signup. Authenticated students can use the original Python Print HTML, its slides and **Run** code execution without a paid license. The six original video recordings still require an active course license. Preview asset delivery includes only the approved lesson's dependencies. The original shared Python JavaScript receives an AST-based delivery projection: only the active deck, its later replacement assignment (if any) and one-entry module order remain. Original renderer/helpers/controls and stored source files are preserved; other paid decks/HTML/videos are excluded. No lesson is rebuilt in React.

**Continue to Next Module** opens the existing Variables URL. An unlicensed student sees **Continue Your Learning**, the requested explanation and Request Subscription / View Course Details / Back to My Dashboard. A pending request changes the action to **Subscription Requested — Awaiting Approval**. An active license opens the original module and video. Session, course, version and license checks remain server-side for HTML, assets, progress and video; neither enrollment nor request status grants paid content.

## Verification

Verified on **11 November 2026** using Node **24.22.1**, Payload **3.93.0**, Next.js **16.4.6** and the isolated Phase 2 SQLite database.

| Check | Actual result |
| --- | --- |
| TypeScript `tsc --noEmit` | Passed |
| ESLint | Zero errors; three pre-existing unused-variable warnings in legal/pricing components |
| Production build (`scripts/academy/local.mjs build`) | Passed; browser tests used this build |
| Unit / import / authorization / preview projection | 14 passed |
| Original recording-engine basic tests | 7 passed |
| Production browser regressions | All 27 passed in one complete pre-push run; see the later Netlify staging handoff report |
| Real SMTP | Fresh notification ID 4 accepted by configured SMTP; external inbox receipt unverified |
| Integrity | 101 course identities/relationships, all 14 original students, 120 imports, 133 pages, 415 source hashes and six MP4 hashes preserved |
| Recording worker cleanup | Original stylesheet restored, reference Git tree clean; zero queued/running jobs |
| Duplicate requests | Zero duplicate student/course rows |

An earlier browser run expected the label **Expired** for an existing local fixture grant that was actually saved as **Revoked**. The screen correctly showed Revoked. The test now checks saved license states without changing existing grants. Its targeted rerun passed, followed by a later clean full run of all 27 tests before the Git push, including original video playback, immediate authenticated navigation, logout, stale-ticket denial and browser Back protection. New checkout tests separately exercised expired and revoked access denial. This was a test-data assumption correction; there is no outstanding application failure. The latest full-run log is `%TEMP%/tinitiate-push-browser.log`; the prior targeted passing log is `%TEMP%/tinitiate-2c-browser-auth-rerun.log`. See [Netlify staging handoff](NETLIFY_STAGING.md) for current release blockers.

Run these with the Node version in `.nvmrc` selected:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run academy:build
npm.cmd run academy:start -- --port 3100 --hostname 127.0.0.1
# In another terminal:
node --test tests/import-utils.test.mjs tests/academy.test.mjs tests/preview-projection.test.mjs
$env:ACADEMY_CAPTURE_ROOT = (Get-Content .academy-private/import-reference.txt -Raw).Trim()
node --test vendor/dashboard-tutor/test/basic.test.js
npm.cmd run test:e2e
```

Desktop checkout, pending dashboard and CMS request screens, plus mobile preview, paywall and checkout screenshots were visually inspected. Evidence is in the ignored `test-results/phase2c-*.png` files. The original private HTML remains inside its sandbox, with the site's existing navigation and theme around it.

The browser workflow exercises real signup, two-course selection and checkout, immediate owner-only request display, concurrent duplicate submissions, forged student approval denial, native CMS individual approval/rejection, correct single-course licensing, original preview execution, removal of other decks, next-module paywall, active-license bypass, revoked/expired access denial, notification errors and safe retry. A mobile flow verifies `/demos` → login → signup → original preview → paywall → checkout with no horizontal overflow. Existing authentication, logout, account-switch, public demo, video, enrollment and recording-worker regressions are retained.

Local schema initialization was tested against a fresh copy of the pre-Phase-2C backup (100 additive/rebuild statements), as well as idempotent initialization of the current database (zero remaining statements). SQLite transactions are now explicitly enabled, with immediate transactions, WAL and a busy timeout. The local initializer refuses a non-isolated path or a data-loss plan, applies its plan transactionally and checks original course identity/relationships. Its documented adapter workaround pre-adds new nullable relation columns and makes generated index creation idempotent.

An offline PostgreSQL diff, `src/migrations/postgres/phase2c.up.sql`, was generated against the original Phase 2 snapshot with database connections disabled: **42 additive statements, zero production writes**. It is a review artifact only. Before any future production use, back up and compare the actual staging schema, review/apply both phase baselines in order, provision private asset/video storage, configure SMTP/outbox operations and perform staging browser tests. No production migration was run.

Integrity audit checks 101 original course IDs/slugs/category/trainer relationships, all 14 pre-existing student identities, 120 imported records, 133 source pages, SHA-256 of all 415 private source files and all six original video blobs. Comparison with the pre-phase backup also confirms all four original licenses, seven license/course relationships and ten original enrollments are preserved (Payload may regenerate internal relationship-row IDs during ordinary saves; their actual associations are unchanged). Test signups add uniquely named fake local accounts; existing accounts are preserved. No duplicate student/course request rows or queued/running recording jobs remain after verification.

## Files changed for Phase 2C

| Area | Files |
| --- | --- |
| Payload data/approval | `src/collections/CourseSubscriptionRequests.ts`, `src/collections/Courses.ts`, `src/payload.config.ts`, generated `src/payload-types.ts` and admin `importMap.js` |
| Checkout and mail services | `src/lib/commerce/requests.ts`, `notifications.ts`, `src/lib/mail.ts`, shared `src/lib/demoBookingEmail.ts`; `src/app/api/subscriptions/route.ts`, `[id]/review/route.ts`, `notifications/[id]/retry/route.ts` |
| Selection and request UI | `src/components/commerce/{CartProvider,Checkout,RequestSummary,CoursePaywall,AdminRequestActions}.tsx`, `/checkout/page.tsx`, frontend layout, Navbar, course cards/detail/catalog, signup/login and dashboard |
| Preview delivery | `src/lib/academy/{previews.ts,preview-projection.mjs,authorization.ts,render.ts}`, Academy metadata access, protected content/video routes, existing lesson wrapper, `src/components/academy/PreviewCards.tsx`, `/demos` and `/learning` |
| Local setup/schema | `scripts/local.mjs`, `scripts/academy/{initialize.ts,initialize-local.mjs,phase2c-setup.ts,notifications.ts,phase2c-migrations.mjs,prepare.mjs}`, generated manifest and offline Phase 2C migration/snapshot |
| Tests/docs/dependency | `tests/e2e/course-requests.spec.ts`, adjusted Academy/auth/Phase 1 expectations, `tests/preview-projection.test.mjs`, package scripts/lock (Acorn), README and this report |

The workspace already contained the earlier Phase 1/2/UX changes; those were preserved. This table identifies the new phase's scope, rather than attributing every existing uncommitted file to Phase 2C.

## Exact local inspection URLs

Use **localhost** consistently for this session (do not mix localhost and 127.0.0.1 cookies). The server is bound to loopback port **3100**.

| Screen | URL |
| --- | --- |
| Signup / course selection | http://localhost:3100/signup → http://localhost:3100/courses |
| Python selection ready for review | http://localhost:3100/checkout?add=2 |
| Multi-course review | http://localhost:3100/checkout |
| Student requests/dashboard | http://localhost:3100/dashboard#subscription-requests |
| Licensed course lessons | http://localhost:3100/learning |
| Public Free Demos | http://localhost:3100/demos |
| Student interactive preview | http://localhost:3100/academy/lessons/foundational-python-print |
| Next-module paywall (unlicensed student) | http://localhost:3100/academy/lessons/foundational-python-variables |
| CMS login | http://localhost:3100/admin/login |
| Admin course requests | http://localhost:3100/admin/collections/course-subscription-requests |
| Admin notification outcomes/retries | http://localhost:3100/admin/collections/course-request-notifications |
| Existing license management | http://localhost:3100/admin/collections/course-licenses |
| Python preview configuration | http://localhost:3100/admin/collections/courses/2 |

Local fixture accounts use password `Phase1-Local-Verification-Only!`: administrator `phase1-admin@example.test`, unlicensed student `academy-unlicensed@example.test`, licensed student `phase1-student@example.test` and trainer `academy-trainer@example.test`. These are isolated verification fixtures. Use a fresh signup for an empty selection/request experience. The unlicensed fixture shows the paywall; the licensed fixture opens Variables with its original tutorial video.
