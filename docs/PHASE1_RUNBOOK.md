# Phase 1 local run and data reconciliation

Use Node 24 and PowerShell from `C:\Code\tinitiateai-website`. On this machine call `npm.cmd` because PowerShell blocks npm.ps1. Existing dependencies are installed; on a fresh checkout use `npm.cmd ci`.

## Isolated local application

```powershell
npm.cmd run dev:local -- --port 3100
```

Open http://localhost:3100. The launcher creates `.phase1-local/site.db` using SQLite's online backup API from the existing `tinitiateai.db` on its first run, initializes that copy's schema once, and leaves the original unchanged. Subsequent starts disable schema push. The original local database must exist for this snapshot workflow. If schema initialization was interrupted, review the local copy and use `$env:PHASE1_INITIALIZE_SCHEMA='true'` for one run only, then remove that environment variable. Never use this option for the configured PostgreSQL database. All local uploads go to `.phase1-local/media`. Email delivery, external Google integration and paid AI calls are disabled in this launcher. No production seed script runs.

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:integration
npm.cmd run build:local
npm.cmd run start:local -- --port 3100
```

Stop the development server before starting the production server on the same port. Build/start use the isolated database and serve the actual production application.

## Course preview and local import

```powershell
npm.cmd run import:azure
npm.cmd run import:postgres-preview
```

The first command previews against the isolated SQLite copy. The second uses a direct PostgreSQL transaction with `BEGIN READ ONLY` and `ROLLBACK` to compare IDs/titles/slugs from the configured database; it never initializes Payload, pushes schema, or imports records. Reports are written under ignored `.integration-private/`.

Review `course-import-report.json`, `postgres-course-preview.json`, `src/integrations/azure/course-aliases.json`, the preserved source snapshots, and prices/categories before applying anything. The import runner refuses PostgreSQL and production environments. To test the import on the local copy:

```powershell
$env:INTEGRATION_APPLY='true'
$env:INTEGRATION_NEW_COURSE_PRICE='100' # Illustrative local test amount only; never a published fee recommendation.
npm.cmd run import:azure
Remove-Item Env:INTEGRATION_APPLY
Remove-Item Env:INTEGRATION_NEW_COURSE_PRICE
npm.cmd run import:azure
```

The final preview should report unchanged rows. Existing IDs, slugs, prices, categories, trainer relationships, media and enrollment relationships are retained. Descriptions and distinct curriculum topics/outcomes/tools are merged. New records use the explicitly supplied price and source duration, or a contact-for-schedule label when absent. Existing rich text is preserved. Source JSON stays outside public/ and is never a runtime catalog. Existing course lists, search, filters, training views and detail routes all query Payload.

Imports run sequentially: do not run two import processes at the same time. Private JSONL journals record update preimages and created IDs. If a local import needs reversal, stop writers, restore the isolated database backup or use the journal to restore only affected fields and remove newly created records after reviewing their references. No automatic deletion or rollback against production is implemented. Incomplete imports can be rerun; unmatched/ambiguous source mappings stop before catalog writes. Source files with no records (`frontend.json`, `devops.json`) are retained for provenance and explicitly excluded from parsing.

## Cosmos enquiries

The old Cosmos database is neither changed nor deleted. Export the existing enquiry container to a private JSON file with an array, `{ "items": [...] }`, or `{ "Documents": [...] }`. Keep this export and its backup outside Git. Preview against the local copy:

```powershell
$env:COSMOS_EXPORT_PATH='C:\private\enquiries-export.json'
$env:COSMOS_EXPORT_SOURCE='original-database-original-container'
npm.cmd run import:enquiries
```

Set `INTEGRATION_APPLY=true` only to apply to the local SQLite copy, then remove it. Original ID (namespaced in subject), name, email, phone, course, preferred time, original message and createdAt are preserved. Identical IDs/content are skipped on repeat runs; changed content with the same identity requires reconciliation. The original export remains authoritative for additional Cosmos system metadata. Compare original export count, created count and skipped count before any later cutover. No real export was available in this session, so historical enquiry migration is not claimed complete.

New `/request-callback` submissions go directly to Payload `contact-messages`, including requested course/service and preferred callback time. `/contact` uses the same collection. Staff review both in Payload admin; public reads are denied. Do not retire Cosmos or the Azure writer until the owner reconciles historical records and separately approves cutover.

## Browser verification

Prepare test accounts and a future demo slot in the isolated database only:

```powershell
npm.cmd run test:fixtures
npx.cmd playwright install chromium
npm.cmd run start:local -- --port 3100
# In another PowerShell window:
npm.cmd run test:e2e
```

Fixture accounts: `phase1-admin@example.test` and `phase1-student@example.test`, password `Phase1-Local-Verification-Only!`. The fixture runner refuses databases outside `.phase1-local/site.db`; these credentials are local test data and are never configured in production. Browser tests create additional isolated students/contact messages/demo bookings. Playwright reports, screenshots and traces are ignored because they may contain personal information.

For the normal configured backend use `npm.cmd run dev` or `npm.cmd run build` followed by `npm.cmd start`. This loads `.env.local` (currently PostgreSQL). Schema push is disabled unless explicitly enabled with `PAYLOAD_SCHEMA_PUSH=true`; do not enable that on production. Production data import, schema migration, deployment and GitHub push remain separate operations and were not performed.

## AI and deployment configuration

The unified chatbot is the primary Gemini implementation: curated policy retrieval plus live public Payload data, with one widget. It retains source links and live-context priority. Azure conversation history/streaming and arbitrary website crawling were not ported; these require more attack-surface/cost controls and would duplicate the existing implementation. The reindex and embedding diagnostic endpoints are absent. No OpenAI or Cosmos dependency is added.

Configure `GEMINI_API_KEY`, `GEMINI_CHAT_MODEL` and `GEMINI_EMBEDDING_MODEL` on the actual server. `CHAT_ENABLED=false` provides a clean unavailable response. To opt into a single live local verification explicitly, set `PHASE1_ENABLE_CHAT=true` when launching dev:local; all other isolation overrides remain in force. Do not commit credentials. Configure SMTP variables and verify delivery separately before release. A successfully saved booking is not evidence of successful email delivery.

AI requests have bounded JSON body/message sizes, per-process client/global rate limits, a limited model fallback list and model-call timeouts. For multiple server instances add a shared ingress rate limit; `TRUST_PROXY=true` is appropriate only when the ingress overwrites forwarded headers. Internal model/tool identifiers are no longer returned to public clients.
