# Reused Dashboard Tutor engine

Source: https://github.com/AkhilaThorpunuri/masterclass-interactive-web-training-center/tree/7f9ee906f353f72f4696c004b20052ddb3751d7f/dashboard-tutor

`scripts/academy/prepare.mjs` copies the upstream JavaScript/JSON and retains CommonJS through this directory's package metadata. The only engine source adaptations are four directory bindings in `lib/common.js`: `ACADEMY_CAPTURE_ROOT`, `ACADEMY_GENERATED_DIR`, `ACADEMY_MANIFESTS_DIR`, and `ACADEMY_WORK_DIR`. Scanner, planner, capture scenes, narration and FFmpeg assembly are reused.

Run through `npm.cmd run academy:worker`. Do not start the upstream authoring server or `serve` CLI: its unauthenticated local API is not the integrated authorization boundary. The integration instead claims authenticated Payload jobs in a separate restricted local process. See [recording design](../../docs/PHASE2_RECORDING_DESIGN.md).
