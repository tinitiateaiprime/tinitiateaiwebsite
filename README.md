# Tinitiate AI website

Next.js App Router application with Payload CMS, PostgreSQL/SQLite, student accounts, enrollments, training programs and business services. Azure frontend components are integrated into this application; Payload is the canonical course catalog.

Use Node 24.22.1 or later in the Node 24 release line (see `.nvmrc`). From PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev:local -- --port 3100
```

The isolated launcher backs up the existing `tinitiateai.db` into `.phase1-local/site.db`, isolates uploads, and disables external email/AI. It does not connect to the PostgreSQL target in `.env.local`. For the configured backend, use `npm.cmd run dev`; schema push is disabled by default.

See the [integration report](docs/PHASE1_INTEGRATION.md), [runbook and safe import instructions](docs/PHASE1_RUNBOOK.md), and [file manifest](docs/PHASE1_FILES.md). Review the report's release blockers before deployment. The later staging Git handoff does not authorize production imports, database changes or deployment.

Phase 2 adds the protected HTML Academy and separate trainer portal. Start with the [Phase 2 runbook and verification](docs/PHASE2_VERIFICATION.md), [licensing and security](docs/PHASE2_SECURITY_AND_LICENSING.md), [recording design](docs/PHASE2_RECORDING_DESIGN.md), [source inventory](docs/PHASE2_ACADEMY_INVENTORY.md), and [canonical course mapping](docs/PHASE2_COURSE_MAPPING.md). Use `academy:*` commands for the separate `.phase2-local` database. Private lesson/video files are deliberately excluded from Git and must be prepared locally before Academy playback.

The [authentication and learning UX report](docs/PHASE2_UX_FIXES.md) describes collection-specific logout, role-aware navigation, the licensed student dashboard, My Learning, student profiles, Free Demos, changed files, and exact local inspection URLs. Public visitors use `/demos`; licensed students use `/learning`. Existing lesson URLs remain valid.

The [Phase 2C verification report](docs/PHASE2C_VERIFICATION.md) covers multi-course checkout without payment, administrator approval, durable email notifications, explicitly approved student interactive previews, the next-module paywall, local schema setup and inspection URLs.

See [Netlify staging readiness and Git handoff](docs/NETLIFY_STAGING.md) for the staging branch, Node/build settings, environment variable names, reviewed migration order and outstanding database/private-storage/worker requirements. The prepared Netlify build intentionally stops before publication while durable storage is unimplemented.
