# Phase 1 integration — audit and implementation log

## Baseline (2026-11-10)

Primary: `C:\Code\tinitiateai-website`, Next 16.3.5 / React 19 / Payload 3.89. Integration branch: `integration/phase1-azure-payload`.
Reference: `tinitiateprime/tinitiate-ai-website` commit `d420f2bfb26fa0a996fe4f7e41586837bd4754ef`, cloned into a unique directory under Windows TEMP, outside this project.

Pre-existing changes preserved: package.json, package-lock.json, src/payload-types.ts and three untracked `public/media/tinitiate AI banner (1)*.png` files. Do not stage these indiscriminately.

## Architecture and decisions

The primary App Router separates frontend and Payload route groups. Retain PostgreSQL and SQLite adapters, all 16 collections, the site-settings global, media uploads, Payload REST/GraphQL/admin, students, enrollments, batches, demo scheduling/email, workshops, projects, placement registration and existing public routes. No database reset, seed, production import, Azure deployment or GitHub push is authorized. The configured environment selects PostgreSQL; runtime verification must explicitly override it with an isolated local SQLite database and disable external email/AI calls.

| Responsibility | Primary implementation | Azure implementation | Integration decision |
| --- | --- | --- | --- |
| Homepage | CMS categories, courses, testimonials, campus visits | Animated technology hero, solution/industry/career sections | Reuse Azure homepage sections and assets, retain live CMS sections |
| Navigation/footer | Responsive dropdowns, CMS logo/contact/social data | Simple Home/Training/Company/Work Experience navigation | Extend existing shell with Azure information architecture and blue/black visual styling |
| Course catalog/detail | Payload courses, categories, trainer, curriculum | Several JSON catalogs, some duplicate slugs, client fetches | Payload remains sole runtime catalog; offline normalized import with alias mapping |
| Training | Online/classroom/weekend/internships and real batch data | Corporate/beginner/professional/personalized/campus/OPT | Reuse unique pages; canonical lists use Payload; redirect overlapping paths |
| Company/business | CMS-aware about page | Company mission, services, industry presentation | Reuse company content, retain primary story and trainer links |
| Work Experience | Internships/projects | Rich program/timeline page | Reuse Azure page and connect to callback, projects, courses |
| FAQs/policies | Existing legal/policy components | Five FAQ datasets, duplicated FAQList, large commented copies | Reuse one FAQList and five datasets; retain established local policies |
| Contact/callback | Payload contact-messages, working form | Callback UI + Cosmos enquiry writer/local JSON fallback | Single Payload workflow; preserve Azure callback URL and fields |
| Demo booking | Payload slots, capacity checks, email hook | Callback links | Retain primary real scheduling |
| Students/dashboard | Payload student auth, enrollment dashboard | None | Preserve and expose in navigation |
| Chatbot | Gemini, curated local retrieval, live CMS tools, policy rules | OpenAI streamed answers + crawler/index | Retain Gemini and one widget; bound requests; no crawler/internal diagnostic routes imported |

## Data audit

Azure main catalog: 56 rows (duplicate `html-course`); professional syllabus: 9; backend: 4; cloud: 1; data engineering: 28; reporting: 1. `frontend.json` and `devops.json` are empty, invalid JSON. Supplementary `it-training.json` contains additional course presentations. Preserve source snapshots for offline import only, outside public/. Exact source identifiers, equivalent slug aliases, title normalization and explicit mappings drive deduplication; never fuzzy-merge broad tracks with individual language courses. Preserve original rich course records and append distinct syllabus modules/topics and descriptions. Unknown prices require an operator-supplied reviewed price for new records. Never copy the static catalogs into runtime public serving.

Existing local SQLite was inspected read-only: two courses (`java-full-stack-development`, `Python`). This is not evidence of PostgreSQL contents. Production records remain untouched.

Cosmos enquiry fields: id, pk, type, name, email, phone, course, preferredTime, message, createdAt. Preserve Cosmos unchanged. Prepare export-based import to contact-messages with stable provenance/deduplication and original timestamps/content. Do not require Cosmos SDK or production connection for the unified app. A real Cosmos export and reconciliation are required before retiring the old enquiry system.

## Routing and security audit

Azure `/training` is missing; add a real training hub. `/it-training` and `/training/it-training` duplicate the same page. `/training/online-training` and `/training/new-batches` overlap primary routes. Azure career cards point at six absent routes. Legacy professional catalog detail URLs must resolve to canonical Payload course slugs, including the case-sensitive primary `Python` slug.

Azure `/api/rag/reindex` accepts arbitrary origins and page counts, no visible authentication; `/api/diag/embed` permits unauthenticated paid embedding calls. These capabilities are unnecessary for the chosen static retrieval/Gemini implementation and must not be exposed. Primary `/api/dev-seed` mutates data via GET in development; disable unless explicitly enabled and admin-authenticated. Enrollment creation must bind students to their own identity and pending status. Login redirect values need local-path validation. Course/trainer/media and other CMS writes must require CMS users, rather than Payload's generic authenticated-user default (which includes students).

## Baseline verification

- PowerShell blocks npm.ps1/npx.ps1; use npm.cmd/npx.cmd.
- `npx.cmd tsc --noEmit`: passed before changes.
- `npm.cmd run lint`: failed on existing ChatWidget Date.now purity error; also traversed unrelated `.kilo/worktrees`. Three existing unused-variable warnings.
- Existing Azure deployment could not be fetched through the web tool. Source repository is available locally and is the design reference.

Implementation and final verification results follow below as work progresses.
## Implemented result

The public frontend reuses the Azure homepage, animated hero, training layouts/cards, callback form, five FAQ datasets and one FAQ renderer, company overview, Work Experience page, business-service cards, and 90 assets (about 10 MB). Reused files under `src/components/azure/` have obsolete commented implementations removed. Existing Payload-rendered homepage categories, courses, testimonials and campus visits remain. The shell now uses the Azure blue/navy/white visual direction with the primary CMS logo/contact data, responsive dropdown navigation, student dashboard access and one footer/chat widget. Hero slides are slower, pausable and respect reduced-motion preferences. Reveal content remains visible before scrolling.

### Canonical routes

| URL(s) | Final behavior |
| --- | --- |
| `/` | Reused Azure sections surrounding retained live CMS sections |
| `/courses` | All courses by default; text search, category/view filters and pagination read Payload; filter links preserve the query |
| `/courses/[slug]` | Primary rich-text/curriculum/trainer detail page; actual CMS record determines the canonical slug |
| `/training` | New hub linking all existing and integrated programs |
| `/it-training`, `/training/it-training` | 308 to `/training` |
| `/training/beginner-training` | Reused Azure introduction/FAQ layout with CMS beginner course cards |
| `/training/professional-training` | Reused Azure layout/cards; all course records come from Payload |
| `/training/corporate-training`, `/training/personalized-training`, `/training/campus-training`, `/training/opt-training` | Adapted original Azure pages with working enquiry links and existing icons/assets |
| `/training/online-training`, `/training/new-batches` | 308 to existing `/online-training`, `/new-batches` |
| `/training/professional-training/[slug]` | Resolve actual Payload record and 308 to `/courses/[canonical-slug]`; unknown course returns 404 |
| `/courses/professionalCourses/{catalog}/{courseSlug}` | Validate catalog, resolve Payload record and 308 to its canonical detail URL |
| `/courses/coming-soon` | Existing Azure URL retained as guidance to the current catalog/callback |
| `/company`, `/about` | One company page combining the Azure overview and retained CMS-aware primary story; `/about` redirects |
| `/services` | Reused Azure IT/database service cards; enquiries preserve the selected service |
| `/it-development/*`, `/remote-consulting/*` | Previously missing service-detail links redirect to the consolidated service page |
| `/work-experience-program` | Reused program/timeline page with enquiry action; corrected contradictory five/six-month wording to its six-month timeline |
| `/faq/why-tinitiate`, `/faq/parents-stem`, `/faq/parents-nonstem`, `/faq/students-stem`, `/faq/students-nonstem` | Original Azure content, one reused renderer; native mobile disclosure avoids duplicate implementations and effect-driven viewport clamping |
| `/request-callback` | Reused Azure callback UI; course/service URL parameters retained and persisted in Payload |
| Azure missing career-support paths | Appropriate 308 redirects to existing job assistance, beginner training, or real-time projects |
| All other original primary public routes | Retained, including policies, pricing, courses, trainers, blog, placements, workshops, projects and student workflows |

### Database and API changes

- No collection fields, tables, database provider or identity system were added or replaced. No production migration or seed ran. All 16 business/auth collections and the site-settings global remain.
- Schema push now requires explicit `PAYLOAD_SCHEMA_PUSH=true` for both adapters. This prevents an ordinary configured PostgreSQL start/build from automatically changing schema.
- Verification uses SQLite's online backup into `.phase1-local/site.db`; initial schema synchronization affects that copy only. Existing public media is copied without overwriting, and new verification uploads are isolated under `.phase1-local/media`.
- `POST /api/request-callback` validates and bounds JSON, rate-limits requests, and creates a private Payload contact-message. It returns success only after persistence. No Cosmos writer is present in the unified app.
- Existing Payload REST, GraphQL and admin routes remain. CMS collections and site settings now require CMS users for writes. Student enrollment creation binds the student ID and forces pending status. Existing enrollment/course IDs and dashboard records are preserved.
- Demo bookings force public submissions to pending and reject past/inactive/full slots. Existing email handling is preserved. Capacity enforcement still uses the original count-before-create approach; simultaneous bookings require a later transactional reservation improvement before high-volume launch.
- `/api/dev-seed` no longer mutates via GET. POST is disabled by default and always unavailable in production; explicitly enabled development use additionally requires an authenticated CMS administrator.
- The existing `/api/chat` keeps Gemini policy retrieval and live Payload tools, bounds payloads/messages/call attempts, adds rate limits/timeouts, and returns clean unavailable responses. Model/tool diagnostic names are no longer exposed. The Azure reindex/embedding diagnostic routes and arbitrary-origin crawler are not imported.
- Login/signup redirect destinations are restricted to local application paths.

### Course reconciliation evidence

A direct PostgreSQL transaction using `BEGIN READ ONLY` confirmed **18 existing courses**. The planned merge maps Azure `java-full-stack-development` to existing PostgreSQL **ID 10 / `full-stack-java`**. Broader/different offerings (for example Machine Learning with Python versus Python language foundations) remain distinct. A read-only preview proposes one merge and 100 new records; it applies nothing. Reports include all source-to-canonical mappings.

The existing local SQLite snapshot contains two different courses. On its isolated copy, the import created 99 and enriched two. After the final alias mappings, another preview reports **101 unchanged**. This demonstrates repeatability on an actual Payload database, not a replacement JSON catalog. Existing IDs/slugs/prices/trainer/category/media fields survive enrichment. Raw source snapshots retain all original descriptions, syllabus data and image references. Sixty-five source image references have no corresponding file in the Azure repository; these are reported by the import and render intentional course-card fallbacks rather than broken image URLs. All image paths referenced by integrated public components exist, including corrected case-sensitive TypeScript/Oracle/DevOps paths.

The original `tinitiateai.db` still has its original two courses. PostgreSQL was only read, never changed. The import tool refuses production and PostgreSQL writes.

### Enquiry reconciliation evidence

A synthetic, explicitly local Cosmos-format export was imported through the actual Payload API client. The original `2025-12-30T12:00:00.000Z` createdAt was preserved. A second run reported one skipped and zero new records. UTF-8 BOM exports are supported after practical testing exposed the need. Real historical Cosmos enquiries were not accessible as an export; their actual migration remains pending. The Azure Cosmos database has not been modified, retired or deleted.

### Verification and fixes

- `npm.cmd install framer-motion`: required to reuse Azure motion components.
- `npm.cmd install --save-dev @playwright/test`, `npx.cmd playwright install chromium`: browser test tooling. Existing cached Chromium revisions did not match the installed Playwright; the matching revision was installed.
- `npm.cmd install --save-exact next@16.4.6 eslint-config-next@16.4.6`: removed the reported Next.js vulnerability range. Installed Next guides were reread after the update.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed with only three pre-existing unused-variable warnings in the original policy/pricing components. The original ChatWidget render-purity error was corrected with a message sequence ref; unrelated `.kilo/worktrees` are excluded from checks.
- `npm.cmd run test:integration`: **5/5 passed** (source deduplication, ambiguity rejection, identity preservation, idempotent curriculum merge, enquiry preservation and production-target refusal).
- `npm.cmd run import:azure`: preview; applied only with explicit local verification settings; repeat preview **101 unchanged**.
- `npm.cmd run import:postgres-preview`: **read-only passed**, 18 original courses, one merge / 100 create proposals, zero writes.
- `npm.cmd run import:enquiries`: local sample import passed; repeat skipped existing identity and content. Actual timestamp checked directly in SQLite.
- `npm.cmd run build:local`: production build passed on Next 16.4.6. Next reported compilation warnings without a detailed diagnostic in the captured output; TypeScript, page generation and build tracing completed.
- `npm.cmd run start:local -- --port 3100`: actual production server started successfully.
- `npm.cmd run test:e2e`: **10/10 passed in 48 seconds** against that production server: public routes/redirects; search/category filters/empty and 404 states; all 101 canonical course details; all 90 Azure assets; 390px mobile layout and navigation; contact/callback persistence; real demo booking and invalid slot handling; signup/login/error/dashboard; CMS login/course list; student ownership and CMS-write denials; disabled internal endpoints and chat unavailable state.
- One explicitly enabled live Gemini check on a separate isolated local server returned **HTTP 200 / ok:true**, using retrieval and actual imported course information. It did not use the PostgreSQL database or send enquiries/emails externally.
- Initial practical failures were fixed, not hidden: unsupported React Icons exports were adapted to installed equivalent icons; a misplaced client directive was corrected; the browser version was installed; media isolation was extended to include existing uploads; a test was corrected to click the Python result specifically (Django legitimately matches a Python search); tests dismiss the existing promotion dialog through its close button.
- Desktop/mobile screenshots and Playwright traces are under ignored `test-results/` and `playwright-report/`. The final verification addendum below records the successful visual rebuild and complete repeated browser run.

### Remaining issues and release gates

1. **Do not call this production-ready yet.** `npm audit` after the Next update reports **31 vulnerabilities: 2 critical, 5 high, 23 moderate, 1 low**. Critical packages are the pre-existing Payload version and transitive DOMPurify. Upgrading Payload requires coordinated package/type updates and a reviewed database migration; its security release adds an auth timestamp field. No such migration was run, and the user's pre-existing generated types were preserved. See [Payload 3.90 security/migration notes](https://github.com/payloadcms/payload/releases/tag/v3.90.0). This work must precede a production release; do not use `npm audit fix --force` against the existing stack without migration review.
2. Actual Cosmos export, customer-record reconciliation and later cutover are pending. The old service remains authoritative for historical records.
3. SMTP delivery is intentionally disabled in isolated verification. Booking persistence passed; real delivery requires a separately authorized SMTP test. Real customer email was not sent.
4. Final import prices/categories/source images need business review. The local `100` import price was only test data in the isolated database, never a production price.
5. Per-process rate limits need a shared ingress limit for multiple app instances. Demo capacity needs a transactional reservation for high-concurrency guarantees.
6. No production write-path test was run. PostgreSQL connectivity and identifier reconciliation were verified read-only; all mutation/auth/browser verification used the isolated copy.
7. The existing Azure deployment was inaccessible via the web fetch tool, so visual reuse was based on the cloned source rather than a claim of pixel comparison against the live Azure deployment.

## Delivery and operating instructions

See [PHASE1_RUNBOOK.md](PHASE1_RUNBOOK.md) for exact run/build/test/import commands and local fixture credentials; [PHASE1_FILES.md](PHASE1_FILES.md) for the full working-tree file manifest; and [AZURE_SOURCE_INVENTORY.json](AZURE_SOURCE_INVENTORY.json) for reference provenance, routes and assets. Work remains on `integration/phase1-azure-payload`, uncommitted for review. No push or Azure deployment was performed. Future modules can continue using the existing student/course/enrollment IDs; no MasterClass, license, paywall, trainer-recording or second user-system code was introduced.

## Final verification addendum

- The final visual rebuild compiled successfully without the earlier compilation warnings (`Compiled successfully in 24.7s`), passed TypeScript, page generation and build tracing.
- The entire production browser suite was rerun after the image-isolation, reveal-visibility and technology-icon fixes: **10/10 passed in 47.7 seconds**. This includes the added 413 oversized-body check and POST rejection of the old arbitrary-origin RAG endpoint.
- Desktop homepage and 390px training/mobile screenshots were visually inspected. Content no longer stays hidden before scroll, original CMS uploads resolve from the isolated media snapshot, and responsive navigation/callback pages fit the viewport.
- The live Gemini request returned 200 with real course summaries. The default local launcher still disables paid AI/email, so normal browser tests remain isolated.
- The delivery artifact was rebuilt successfully after a one-word carousel label cleanup. A focused homepage/catalog browser check passed (1/1 in 12.4 seconds). The production server is running at http://localhost:3100 with the isolated database and external AI/email disabled.

- Machine-readable results: [PHASE1_VERIFICATION.json](PHASE1_VERIFICATION.json). The complete 10-test production run is retained there even though the current Playwright HTML report reflects the final focused check.
- The first repeated local SQLite schema push hit an existing-index error (`payload_locked_documents_rels_order_idx`). Initialization now happens only for the newly copied database, with later pushes explicitly opt-in. The original database was not changed.
