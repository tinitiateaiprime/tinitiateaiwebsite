# Phase 2 security and licensing

Current working branch: `integration/phase2-masterclass`.

The [authentication/UX follow-up](PHASE2_UX_FIXES.md) separates Students and Users into collection-specific HTTP-only cookies while retaining Payload JWT verification and database sessions. CMS requests always use Users; frontend requests verify the selected existing identity. Logout revokes that session, and signed read tickets now check their issuing session is still live. Metadata listings are restricted to approved public demos or the viewer's licensed/assigned courses; the complete public Academy inventory page has been replaced by `/demos`.

The existing Payload Students login serves learners; the existing Users login serves administrators and trainers. `/login?mode=trainer` selects the Users login and `/trainer` requires a trainer or administrator. Trainers have no Payload CMS access and receive no existing editor privileges. Role changes, trainer assignments, demo approval and license grants require an administrator. Existing course records remain authoritative.

## License administration

In `/admin`, create a **Course license** with a unique key, a student, one or more existing courses, status `active`, and a required grant reason. One course grants that course; multiple courses form an explicit bundle. Optional start and expiry dates constrain access. Set status to `revoked` to withdraw access. Enrollment and booking records never establish entitlement. There is no payment integration or claim that a local grant proves payment.

Assign a Users account with role `trainer` through **Trainer assignments**, selecting an existing course and active status. Administrators also require an explicit assignment to submit recording jobs. Administrators can review recordings independently. Students cannot create licenses, assignments, recordings or jobs through either the UI or raw Payload REST APIs.

All imported demos start private. Only an administrator can set `publicDemo`, and public access additionally requires kind `demo`. Review the entire demo and its allowed dependencies before approval. The local fixture explicitly approves only `foundational-data-structures-demo`; this fixture is not a production approval list.

## Protected delivery

Original lesson files live in ignored `.academy-private/source`, never `public/`. The content handler authorizes HTML, CSS, JS and assets individually against the lesson and its dependency allowlist. Paths are normalized and checked; other HTML pages, tutor internals and original video directories are excluded. File SHA-256 must match the prepared manifest, otherwise delivery fails closed. Anonymous and unlicensed direct URLs return 403. Learners use the existing course page when access is missing.

The application wraps the complete original HTML in an iframe with `sandbox="allow-scripts"`. The response also supplies CSP sandboxing. There is no `allow-same-origin`: the child has an opaque origin and cannot read application cookies, parent DOM or application storage. Relative resources use short-lived signed read tickets scoped to one lesson, content fingerprint and identity. Every request reloads that identity and checks its current license or assignment; a ticket does not preserve revoked entitlement. Tickets expire after 30 minutes; reload the lesson to renew. They are bearer read capabilities, so redact the `t` parameter in proxy/application access logs and restrict log access. No application session token is passed to the child.

The parent accepts messages only from its own iframe, opaque origin and random channel. It resolves navigation through known lesson IDs. It posts learner progress with the parent session; the server derives student ownership and clamps progress to the current deck. Students cannot choose another owner. The original Python storage API is preserved through a virtual localStorage bridge. On first use only, the parent can migrate the old Python key to server progress; subsequent local caching is namespaced by student and lesson. Writes are serialized to preserve order.

All protected responses use `no-store`, `nosniff` and `no-referrer`. MP4s use private content-addressed storage and authorized range streaming, including suffix ranges, 206, HEAD and 416. Opaque-frame resource access allows origin `null` without credentialed CORS; application API access remains blocked. Original interactive Python requires pinned Pyodide/WASM CDN access and dynamic evaluation; the CSP allows only the reviewed library/CDN origins, blob workers and Google fonts. Fourteen linked JS/CSS dependencies are frozen privately and included in fingerprints. Review these exceptions when adding untrusted material. This boundary does not prevent an entitled user from saving delivered content.

## Storage and public upstream exposure

The Academy upstream repository is public. Its HTML and recordings can be downloaded independently of this website. The website paywall cannot make that public GitHub source private. Proprietary distribution requires the owner to remove public availability and use a private source repository and private artifact/blob distribution with an appropriate retention policy.

`PrivateVideoStorage` separates delivery from storage. The implemented adapter is private local disk; a private Azure Blob adapter is future work, not a deployed service. Upload a prepared private content artifact outside the web root and pair it with the matching manifest release. Rebuild/restart on content-version changes; mixed versions intentionally fail integrity checks. Do not copy original MP4s into a static public folder. Publish only approved recordings after review. The six imported baseline videos have no trustworthy original source fingerprint and therefore require administrator review of the imported baseline.

## Database and release boundary

Phase 2 uses `.phase2-local/site.db`, an online SQLite backup of the existing Phase 1 local database, with separate uploads and a random persistent local session secret. The local launcher overrides PostgreSQL URLs and disables email, external chat and Google integrations. Import, fixture initialization and worker scripts reject nonlocal/non-Phase-2 database paths. Neon and Cosmos were not modified. No deployment or push was performed.

Payload packages were aligned to 3.93.0 for authentication fixes. The generated PostgreSQL migration is offline only: see [migration review notes](../src/migrations/postgres/README.md). It includes six Academy collections, trainer role and new authentication reset timestamps. Compare against a staging copy and test before deployment; do not use production schema push. The worker currently supports only the isolated SQLite queue. Production queue claims and a private storage adapter require infrastructure work and testing before recording in production. Preserve a database/private-storage backup and coordinate application/schema versions for rollback. The original Phase 1 local database remains available separately.

The final audit is recorded in [verification](PHASE2_VERIFICATION.md); remaining advisories are not represented as resolved. Provider narration and actual PostgreSQL migration remain explicitly unverified.
