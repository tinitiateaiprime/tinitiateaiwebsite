-- Explicit reviewed rollback only. Back up Academy data and reassign trainer users first.
BEGIN;
DO $$ BEGIN IF current_setting('tinitiate.allow_phase2_rollback',true) IS DISTINCT FROM 'on' THEN RAISE EXCEPTION 'Reviewed rollback requires SET tinitiate.allow_phase2_rollback = on'; END IF; IF EXISTS (SELECT 1 FROM users WHERE role::text = 'trainer') THEN RAISE EXCEPTION 'Reassign trainer users before rollback'; END IF; END $$;
ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_academy_lessons_fk";


ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_course_licenses_fk";


ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_trainer_assignments_fk";


ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lesson_progress_fk";


ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lesson_recordings_fk";


ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_recording_jobs_fk";


ALTER TABLE "academy_lessons" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "course_licenses" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "course_licenses_rels" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "trainer_assignments" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "lesson_progress" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "lesson_recordings" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "recording_jobs" DISABLE ROW LEVEL SECURITY;

DROP TABLE "academy_lessons" CASCADE;

DROP TABLE "course_licenses" CASCADE;

DROP TABLE "course_licenses_rels" CASCADE;

DROP TABLE "trainer_assignments" CASCADE;

DROP TABLE "lesson_progress" CASCADE;

DROP TABLE "lesson_recordings" CASCADE;

DROP TABLE "recording_jobs" CASCADE;

DROP INDEX "payload_locked_documents_rels_academy_lessons_id_idx";

DROP INDEX "payload_locked_documents_rels_course_licenses_id_idx";

DROP INDEX "payload_locked_documents_rels_trainer_assignments_id_idx";

DROP INDEX "payload_locked_documents_rels_lesson_progress_id_idx";

DROP INDEX "payload_locked_documents_rels_lesson_recordings_id_idx";

DROP INDEX "payload_locked_documents_rels_recording_jobs_id_idx";

ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";

ALTER TABLE "students" DROP COLUMN "reset_password_requested_at";

ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "academy_lessons_id";

ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "course_licenses_id";

ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "trainer_assignments_id";

ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lesson_progress_id";

ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lesson_recordings_id";

ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "recording_jobs_id";

DROP TYPE "public"."enum_academy_lessons_kind";

DROP TYPE "public"."enum_course_licenses_status";

DROP TYPE "public"."enum_lesson_recordings_status";

DROP TYPE "public"."enum_recording_jobs_status";

DROP TYPE "public"."enum_recording_jobs_mode";
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
ALTER TYPE enum_users_role RENAME TO enum_users_role_phase2_old;
CREATE TYPE enum_users_role AS ENUM ('admin','editor');
ALTER TABLE users ALTER COLUMN role TYPE enum_users_role USING role::text::enum_users_role;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'editor'::enum_users_role;
DROP TYPE enum_users_role_phase2_old;
COMMIT;
