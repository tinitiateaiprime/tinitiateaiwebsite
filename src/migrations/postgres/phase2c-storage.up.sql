-- Additive durable-media adapter fields; staging-only reviewed application.
BEGIN;
ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
COMMIT;
