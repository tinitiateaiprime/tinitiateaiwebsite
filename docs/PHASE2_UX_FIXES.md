# Phase 2 authentication, learning and Free Demos follow-up

Branch: `integration/phase2-masterclass`. Work and verification use only `.phase2-local/site.db`. No Neon/Cosmos writes, schema migration, deployment or push are part of this change.

## Result

Payload still authenticates Students and Users, verifies its own JWTs and manages its database sessions. The previous shared cookie allowed a Students login to replace the credential expected by the CMS Users logout operation, which correctly rejected the collection mismatch. Users now use `tinitiate-users-token`; Students use `tinitiate-students-token`. The existing REST handlers adapt the student cookie name, keeping login, refresh, logout, access checks and session revocation in Payload. No second identity system or client token store was introduced.

CMS always authenticates Users. A CMS login preserves an existing active student website session. The frontend's HTTP-only audience preference selects which existing credential to verify; it grants no permissions. An explicit trainer login selects Users for the frontend. Logout revokes the exact collection/session, expires its cookie, updates navigation and performs a fresh navigation to discard private router state. Logging out of one collection leaves the other collection's session intact, without silently switching the website into that other identity. The logged-out website shows Student Login. Logging into another account in the same collection revokes the replaced session. A CMS tab detects changed Users identities/roles and clears its old screen; a trainer appropriately receives Payload's native Unauthorized screen. Authentication cookies use HTTP-only, SameSite=Lax, and Secure for production HTTPS configurations; the isolated localhost profile permits HTTP.

The global header displays the active student's actual name, My Learning, My Dashboard, Student Profile and one Logout control. Trainers see their dashboard, assigned courses and recordings. Admin/editor website navigation points to Payload CMS and Account. The CMS has a labeled Logout button at the top right; the old icon-only duplicate is removed. The native `/admin/logout` flow still works. Session checks on focus, tab notifications and browser restoration refresh the interface. Protected content boundaries hide another account's cached screen. Read tickets now include a session ID and require that Payload session to remain live, so a captured lesson/video ticket fails after logout or same-collection account switching.

The dashboard uses actual license grants, including bundles, start/expiry dates, and revocation. It shows the student's name/email, licensed courses, completion totals, progress, and Continue Learning. An existing license for a course with no imported lessons is labeled accordingly; no lesson or purchase is invented. Expired/revoked grants appear in license history. Enrollment is a separate section with an explicit explanation that it does not establish payment or lesson access. The empty state offers Browse Courses. The existing local bundle grant was preserved, rather than reset to a Python-only fixture.

`/learning` shows only the current student's active licensed courses and their lessons. Python progress uses counts from the original curriculum, with a source-hash check; offline preparation refreshes those counts. Completion means all source slides explored, or an existing standalone lesson explicitly marked complete. It is not a graded assessment. `/profile` reads the current Students record and saves name/phone through its existing owner-protected API; email remains a read-only account identifier.

`/demos` replaces the public inventory with a themed demo page and cards for rows satisfying both `kind=demo` and `publicDemo=true`. Each card has a visual, topic, description, Try Free Demo, and related-course link. No additional demos were approved for presentation. `/academy` redirects to `/demos`, preserving an optional course filter. Existing `/academy/lessons/:key` URLs remain unchanged. Public lesson metadata REST access is also limited to approved demos; students see only licensed courses plus demos, trainers only assigned courses plus demos, and CMS staff retain catalog metadata access. HTML, dependencies and MP4 authorization remain enforced per request.

## Local URLs

The production build is available on loopback port 3100 for inspection:

| Screen | URL |
| --- | --- |
| Free Demos | http://localhost:3100/demos |
| Approved interactive demo | http://localhost:3100/academy/lessons/foundational-data-structures-demo |
| Student login | http://localhost:3100/login |
| Student dashboard | http://localhost:3100/dashboard |
| My Learning / licensed courses | http://localhost:3100/learning |
| Student profile | http://localhost:3100/profile |
| Original Python Print lesson | http://localhost:3100/academy/lessons/foundational-python-print |
| Trainer login | http://localhost:3100/login?mode=trainer |
| Trainer dashboard | http://localhost:3100/trainer |
| Assigned courses | http://localhost:3100/trainer#assigned-courses |
| Recordings | http://localhost:3100/trainer#recordings |
| Payload CMS login | http://localhost:3100/admin/login |
| CMS account | http://localhost:3100/admin/account |

Only isolated fake credentials are used: `phase1-student@example.test`, `academy-unlicensed@example.test`, `academy-trainer@example.test`, and `phase1-admin@example.test`, with password `Phase1-Local-Verification-Only!`. The first account has its existing active bundle; the second has no licenses. Use the two different login pages for Students and CMS Users. Old shared-cookie browser sessions need one new login after this change.

Use Node 24.22.1+ within the Node 24 line. Start commands remain `npm.cmd run academy:build` and `npm.cmd run academy:start -- --port 3100 --hostname 127.0.0.1`. The current machine was verified with the temporary npm-cached Node 24.22.1 binary; its global Node installation was not changed.

## Verification

Final verification on 11 November 2026 used Node 24.22.1 and the isolated Phase 2 database:

| Check | Result |
| --- | --- |
| Production build, including TypeScript | Passed |
| Explicit TypeScript check | Passed |
| ESLint | Zero errors; three existing policy/pricing unused-variable warnings |
| Full browser suite against the final build | **25 passed in 2.7 minutes** |
| Browser breakdown | 7 auth/UX, 10 Phase 1, 7 Academy, 1 real recording-worker regression |
| Unit/security/import checks | 13 passed, including collection-cookie isolation |
| Reused recording-engine basic tests | 7 passed |
| Canonical course catalog | 101 original IDs/slugs preserved |
| Academy lessons | 120 imported records preserved; 133 source pages retained in the manifest |
| Original recordings | Six private MP4 blobs; all six SHA-256 hashes verified; six published local fixture recordings |
| Worker restoration | Original reference CSS restored; zero queued/processing jobs |
| Inspection server | Running on loopback port 3100 against `.phase2-local/site.db` |

All four navigation variants were exercised. Both CMS/student login orders were tested. Student logout retains a separate CMS session while the website shows Student Login. A same-collection switch from admin to trainer clears the old CMS screen and receives Payload's native Unauthorized page. Student account switching and logout both invalidate old scoped read tickets. No `Incorrect collection` failure occurs in the normal logout flows. Lint warnings remain in `LegalPolicyPage.js`, `PolicyPageShell.js`, and `PricingCards.js`; none were introduced by this follow-up.

The browser tests operate the actual login forms and screens, run the public simulation, play the saved tutorial video, save a profile, exercise both CMS/student login orders in separate tabs, use custom and native CMS logout, log out trainers, switch student accounts, verify cached private views disappear, and check old read tickets fail. Desktop/mobile screenshots were inspected. The recording regression still uses actual Playwright/FFmpeg, restores its reference CSS, and makes no paid narration calls.

Screenshots and reports are ignored under `test-results/` and `playwright-report/`. Main screenshots: `ux-free-demos-desktop.png`, `ux-free-demos-mobile.png`, `ux-student-dashboard.png`, `ux-student-mobile.png`, `ux-admin-logout.png`, `ux-trainer-navigation.png`. Logs in the Windows temporary directory use `tinitiate-ux-*`; keep access logs private because scoped lesson tickets can appear in them.

The original 120 imports, 101 course IDs/slugs/relationships, original lesson source and six content-addressed Python video blobs are preserved. Authentication changes require no database schema change. Existing production migration/provider/storage limitations and the public-upstream exposure remain as documented in the original Phase 2 reports.

## Files changed in this follow-up

Authentication and session handling:

```text
src/lib/auth.ts
src/lib/auth/cookies.ts
src/lib/auth/session.ts
src/lib/auth/rest.ts
src/app/api/auth/session/route.ts
src/app/(payload)/api/[...slug]/route.ts
src/app/(payload)/admin/importMap.js
src/payload.config.ts
src/collections/Users.ts
src/collections/Students.ts
src/components/auth/AuthProvider.tsx
src/components/auth/AdminLogout.tsx
src/components/auth/ProfileForm.tsx
```

Website screens and navigation:

```text
src/app/(frontend)/layout.tsx
src/app/(frontend)/login/page.tsx
src/app/(frontend)/signup/page.tsx
src/app/(frontend)/dashboard/page.tsx
src/app/(frontend)/learning/page.tsx
src/app/(frontend)/profile/page.tsx
src/app/(frontend)/demos/page.tsx
src/app/(frontend)/academy/page.tsx
src/app/(frontend)/academy/lessons/[key]/page.tsx
src/app/(frontend)/trainer/page.tsx
src/app/(frontend)/courses/[slug]/page.tsx
src/components/layout/Navbar.tsx
src/components/layout/Footer.tsx
src/components/academy/LearningCards.tsx
src/components/academy/LessonFrame.tsx
```

Licensing/progress, import fixtures, tests and documentation:

```text
src/lib/academy/access.ts
src/lib/academy/authorization.ts
src/lib/academy/learning.ts
src/collections/academy/index.ts
src/integrations/academy/progress-config.json
scripts/academy/prepare.mjs
scripts/academy/fixtures.ts
tests/academy.test.mjs
tests/e2e/auth-experience.spec.ts
docs/PHASE2_UX_FIXES.md
docs/PHASE2_VERIFICATION.md
docs/PHASE2_SECURITY_AND_LICENSING.md
README.md
```
