# Phase 2 recording design

The source engine at commit `7f9ee906f353f72f4696c004b20052ddb3751d7f` is reused under `vendor/dashboard-tutor/`: scanner, lesson planner, Playwright scenes, ElevenLabs narration and FFmpeg assembly. The adapter changes four common directory bindings to environment-controlled private roots. No second recording engine was written. The upstream authoring server and its unauthenticated POST API are never started by this integration.

## Versions and saved recordings

Preparation assigns a stable ID from each original source path. SHA-256 fingerprints include HTML, allowed local dependency bytes, frozen external libraries, engine/configuration inputs, and narration model/voice profile. Conservative shared assets can invalidate multiple lessons. Secrets are never included in the manifest. Changing the configured voice/model requires preparation and import again. External snapshots are reused for repeatable builds; refreshing those bytes deliberately changes the fingerprint and requires review.

The six Python videos and JSON scene metadata are imported before any generation. Upstream duplicate directories contain identical video bytes: only one `.academy-private/blobs/<sha256>.mp4` exists per unique video. Registry versions may reference the same blob. Repeated preparation/import creates neither new course records nor duplicate lessons/current recording rows. Old registry versions are retained for review history. The old files lack reliable recording-time content fingerprints: import associates them with an explicitly reviewed baseline, rather than asserting that they were recorded from today's source.

An approved recording with the current fingerprint and no review flag is returned immediately by job submission. Student visits never create jobs. Import changes mark earlier recordings `reviewRequired`; the previously published video remains available while a replacement is reviewed. This avoids publishing an unvalidated replacement or interrupting existing playback.

## Job submission and worker

`POST /api/academy/jobs` authenticates the existing Users account and checks an active assignment for the exact lesson course. A unique `lessonKey:fingerprint` database key coalesces concurrent requests. Submission is rate limited. Failed jobs or expired processing leases can be retried using the same job row. Silent previews are local-only. Narrated jobs require explicit administrator configuration `ALLOW_PAID_RECORDING=true`, and the worker additionally requires `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`.

Run `npm.cmd run academy:worker` in a separate restricted process. It refuses production/PostgreSQL targets. The local SQLite claim uses conditional `UPDATE ... WHERE status='queued' RETURNING id`, so two worker processes cannot claim one queued row. Claims receive a two-minute lease with a heartbeat every 30 seconds. The worker stores progress and failures in Payload. A one-shot verification mode uses `ACADEMY_WORKER_ONCE=true`.

Each capture uses a fresh browser without application login cookies and unique private work/output directories. A random 256-bit nonce protects a temporary GET-only loopback source server. That server serves only the current HTML and manifest-approved assets, verifies hashes and has no recording control API. A browser network allowlist permits the capture server and reviewed library/font origins. The adapter removes the upstream `--no-sandbox` Chromium option. Provider HTTP requests time out after 30 seconds; a 30-minute job deadline aborts network requests and closes capture browsers. Run the worker under an OS-level restricted account with a process supervisor and resource limits before production use; this local implementation does not provide a hosted worker service.

The worker rechecks assignment and content version after capture. Silent preview invokes the real original engine with three scenes, produces a private preview and records duration, but cannot create a publishable recording. A narrated result goes to content-addressed private storage and `pending-review`; it never changes the published pointer automatically. Failure is persisted and old playback remains untouched. Restricted worker logs hold diagnostic detail; API responses do not expose secrets or filesystem paths.

## Review and publication

The trainer portal exposes assigned lesson jobs and recording controls separately from students. Administrators can preview registry entries through `/api/academy/recordings/:id/preview` before approval; assigned trainers can review their course, students cannot. Approval requires an administrator, current lesson fingerprint, matching stored byte size and SHA-256, ffprobe-valid duration, a video stream with dimensions, and an audio stream. Silent preview metadata is rejected. Only after validation does the lesson point to the approved recording. Old files remain for rollback/history; retention cleanup is intentionally separate.

## What was exercised

The local integration test modifies the reference Python CSS, prepares/imports it, confirms a new fingerprint and review flag, submits three concurrent requests and gets one job ID, then runs the actual Playwright/FFmpeg engine in silent preview mode. It verifies nonzero duration and preservation of the old published recording. Another job fails after trainer assignment revocation, then can be retried using the same ID. Finally it restores source, imports the original version and restores fixture approval. No ElevenLabs credentials or paid calls were used. The six original narrated recordings were reused and validated; a newly narrated provider result remains an external verification step.
