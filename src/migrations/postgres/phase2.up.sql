BEGIN;
CREATE TYPE "public"."enum_academy_lessons_kind" AS ENUM('lesson', 'course-hub', 'demo');

CREATE TYPE "public"."enum_course_licenses_status" AS ENUM('active', 'revoked');

CREATE TYPE "public"."enum_lesson_recordings_status" AS ENUM('pending-review', 'approved', 'rejected');

CREATE TYPE "public"."enum_recording_jobs_status" AS ENUM('queued', 'processing', 'awaiting-review', 'complete', 'failed');

CREATE TYPE "public"."enum_recording_jobs_mode" AS ENUM('narrated', 'silent-preview');

ALTER TYPE "public"."enum_users_role" ADD VALUE 'trainer';

CREATE TABLE "academy_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"title" varchar NOT NULL,
	"course_id" integer NOT NULL,
	"source_path" varchar NOT NULL,
	"fingerprint" varchar NOT NULL,
	"kind" "enum_academy_lessons_kind" NOT NULL,
	"public_demo" boolean DEFAULT false,
	"published_recording_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "course_licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"student_id" integer NOT NULL,
	"status" "enum_course_licenses_status" DEFAULT 'active' NOT NULL,
	"starts_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone,
	"grant_reason" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "course_licenses_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"courses_id" integer
);


CREATE TABLE "trainer_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"trainer_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"active" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "lesson_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"student_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"state" jsonb NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "lesson_recordings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"lesson_id" integer NOT NULL,
	"fingerprint" varchar NOT NULL,
	"blob" varchar NOT NULL,
	"sha256" varchar NOT NULL,
	"bytes" numeric NOT NULL,
	"duration" numeric NOT NULL,
	"status" "enum_lesson_recordings_status" NOT NULL,
	"review_required" boolean DEFAULT false,
	"metadata" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "recording_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"lesson_id" integer NOT NULL,
	"trainer_id" integer NOT NULL,
	"fingerprint" varchar NOT NULL,
	"status" "enum_recording_jobs_status" NOT NULL,
	"mode" "enum_recording_jobs_mode" NOT NULL,
	"progress" jsonb,
	"lease_expires_at" timestamp(3) with time zone,
	"error" varchar,
	"recording_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;

ALTER TABLE "students" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "academy_lessons_id" integer;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_licenses_id" integer;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "trainer_assignments_id" integer;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lesson_progress_id" integer;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lesson_recordings_id" integer;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "recording_jobs_id" integer;

ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "academy_lessons" ADD CONSTRAINT "academy_lessons_published_recording_id_lesson_recordings_id_fk" FOREIGN KEY ("published_recording_id") REFERENCES "public"."lesson_recordings"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_licenses" ADD CONSTRAINT "course_licenses_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_licenses_rels" ADD CONSTRAINT "course_licenses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_licenses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "course_licenses_rels" ADD CONSTRAINT "course_licenses_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "trainer_assignments" ADD CONSTRAINT "trainer_assignments_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "trainer_assignments" ADD CONSTRAINT "trainer_assignments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "lesson_recordings" ADD CONSTRAINT "lesson_recordings_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "recording_jobs" ADD CONSTRAINT "recording_jobs_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "recording_jobs" ADD CONSTRAINT "recording_jobs_trainer_id_users_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "recording_jobs" ADD CONSTRAINT "recording_jobs_recording_id_lesson_recordings_id_fk" FOREIGN KEY ("recording_id") REFERENCES "public"."lesson_recordings"("id") ON DELETE set null ON UPDATE no action;

CREATE UNIQUE INDEX "academy_lessons_key_idx" ON "academy_lessons" USING btree ("key");

CREATE INDEX "academy_lessons_course_idx" ON "academy_lessons" USING btree ("course_id");

CREATE INDEX "academy_lessons_published_recording_idx" ON "academy_lessons" USING btree ("published_recording_id");

CREATE INDEX "academy_lessons_updated_at_idx" ON "academy_lessons" USING btree ("updated_at");

CREATE INDEX "academy_lessons_created_at_idx" ON "academy_lessons" USING btree ("created_at");

CREATE UNIQUE INDEX "course_licenses_key_idx" ON "course_licenses" USING btree ("key");

CREATE INDEX "course_licenses_student_idx" ON "course_licenses" USING btree ("student_id");

CREATE INDEX "course_licenses_updated_at_idx" ON "course_licenses" USING btree ("updated_at");

CREATE INDEX "course_licenses_created_at_idx" ON "course_licenses" USING btree ("created_at");

CREATE INDEX "course_licenses_rels_order_idx" ON "course_licenses_rels" USING btree ("order");

CREATE INDEX "course_licenses_rels_parent_idx" ON "course_licenses_rels" USING btree ("parent_id");

CREATE INDEX "course_licenses_rels_path_idx" ON "course_licenses_rels" USING btree ("path");

CREATE INDEX "course_licenses_rels_courses_id_idx" ON "course_licenses_rels" USING btree ("courses_id");

CREATE UNIQUE INDEX "trainer_assignments_key_idx" ON "trainer_assignments" USING btree ("key");

CREATE INDEX "trainer_assignments_trainer_idx" ON "trainer_assignments" USING btree ("trainer_id");

CREATE INDEX "trainer_assignments_course_idx" ON "trainer_assignments" USING btree ("course_id");

CREATE INDEX "trainer_assignments_updated_at_idx" ON "trainer_assignments" USING btree ("updated_at");

CREATE INDEX "trainer_assignments_created_at_idx" ON "trainer_assignments" USING btree ("created_at");

CREATE UNIQUE INDEX "lesson_progress_key_idx" ON "lesson_progress" USING btree ("key");

CREATE INDEX "lesson_progress_student_idx" ON "lesson_progress" USING btree ("student_id");

CREATE INDEX "lesson_progress_lesson_idx" ON "lesson_progress" USING btree ("lesson_id");

CREATE INDEX "lesson_progress_updated_at_idx" ON "lesson_progress" USING btree ("updated_at");

CREATE INDEX "lesson_progress_created_at_idx" ON "lesson_progress" USING btree ("created_at");

CREATE UNIQUE INDEX "lesson_recordings_key_idx" ON "lesson_recordings" USING btree ("key");

CREATE INDEX "lesson_recordings_lesson_idx" ON "lesson_recordings" USING btree ("lesson_id");

CREATE INDEX "lesson_recordings_updated_at_idx" ON "lesson_recordings" USING btree ("updated_at");

CREATE INDEX "lesson_recordings_created_at_idx" ON "lesson_recordings" USING btree ("created_at");

CREATE UNIQUE INDEX "recording_jobs_key_idx" ON "recording_jobs" USING btree ("key");

CREATE INDEX "recording_jobs_lesson_idx" ON "recording_jobs" USING btree ("lesson_id");

CREATE INDEX "recording_jobs_trainer_idx" ON "recording_jobs" USING btree ("trainer_id");

CREATE INDEX "recording_jobs_recording_idx" ON "recording_jobs" USING btree ("recording_id");

CREATE INDEX "recording_jobs_updated_at_idx" ON "recording_jobs" USING btree ("updated_at");

CREATE INDEX "recording_jobs_created_at_idx" ON "recording_jobs" USING btree ("created_at");

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academy_lessons_fk" FOREIGN KEY ("academy_lessons_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_licenses_fk" FOREIGN KEY ("course_licenses_id") REFERENCES "public"."course_licenses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainer_assignments_fk" FOREIGN KEY ("trainer_assignments_id") REFERENCES "public"."trainer_assignments"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lesson_progress_fk" FOREIGN KEY ("lesson_progress_id") REFERENCES "public"."lesson_progress"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lesson_recordings_fk" FOREIGN KEY ("lesson_recordings_id") REFERENCES "public"."lesson_recordings"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recording_jobs_fk" FOREIGN KEY ("recording_jobs_id") REFERENCES "public"."recording_jobs"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX "payload_locked_documents_rels_academy_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("academy_lessons_id");

CREATE INDEX "payload_locked_documents_rels_course_licenses_id_idx" ON "payload_locked_documents_rels" USING btree ("course_licenses_id");

CREATE INDEX "payload_locked_documents_rels_trainer_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("trainer_assignments_id");

CREATE INDEX "payload_locked_documents_rels_lesson_progress_id_idx" ON "payload_locked_documents_rels" USING btree ("lesson_progress_id");

CREATE INDEX "payload_locked_documents_rels_lesson_recordings_id_idx" ON "payload_locked_documents_rels" USING btree ("lesson_recordings_id");

CREATE INDEX "payload_locked_documents_rels_recording_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("recording_jobs_id");
COMMIT;
