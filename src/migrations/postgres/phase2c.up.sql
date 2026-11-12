-- Offline review artifact; never applied. Compare with staging schema first.
BEGIN;
CREATE TYPE "public"."enum_course_subscription_requests_payment_status" AS ENUM('not-collected');

CREATE TYPE "public"."enum_course_subscription_requests_status" AS ENUM('pending', 'approved', 'rejected');

CREATE TYPE "public"."enum_course_request_notifications_delivery_status" AS ENUM('queued', 'sending', 'sent', 'failed', 'not-configured', 'unknown');

CREATE TABLE "course_subscription_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"reference" varchar NOT NULL,
	"checkout_reference" varchar NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"student_name" varchar NOT NULL,
	"student_email" varchar NOT NULL,
	"student_phone" varchar,
	"requested_at" timestamp(3) with time zone NOT NULL,
	"payment_status" "enum_course_subscription_requests_payment_status" DEFAULT 'not-collected' NOT NULL,
	"status" "enum_course_subscription_requests_status" DEFAULT 'pending' NOT NULL,
	"review_note" varchar,
	"license_id" integer,
	"reviewed_by_id" integer,
	"reviewed_at" timestamp(3) with time zone,
	"notification_id" integer,
	"history" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "course_request_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"reference" varchar NOT NULL,
	"student_id" integer NOT NULL,
	"student_name" varchar NOT NULL,
	"student_email" varchar NOT NULL,
	"student_phone" varchar,
	"submitted_at" timestamp(3) with time zone NOT NULL,
	"courses" jsonb NOT NULL,
	"delivery_status" "enum_course_request_notifications_delivery_status" DEFAULT 'queued' NOT NULL,
	"attempts" numeric DEFAULT 0,
	"lease_expires_at" timestamp(3) with time zone,
	"last_error" varchar,
	"sent_at" timestamp(3) with time zone,
	"message_i_d" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "course_request_notifications_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"course_subscription_requests_id" integer
);


ALTER TABLE "courses" ADD COLUMN "preview_lesson_id" integer;

ALTER TABLE "courses" ADD COLUMN "preview_fingerprint" varchar;

ALTER TABLE "courses" ADD COLUMN "approve_preview_version" boolean DEFAULT false;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_subscription_requests_id" integer;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_request_notifications_id" integer;

ALTER TABLE "course_subscription_requests" ADD CONSTRAINT "course_subscription_requests_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_subscription_requests" ADD CONSTRAINT "course_subscription_requests_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_subscription_requests" ADD CONSTRAINT "course_subscription_requests_license_id_course_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."course_licenses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_subscription_requests" ADD CONSTRAINT "course_subscription_requests_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_subscription_requests" ADD CONSTRAINT "course_subscription_requests_notification_id_course_request_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."course_request_notifications"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_request_notifications" ADD CONSTRAINT "course_request_notifications_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "course_request_notifications_rels" ADD CONSTRAINT "course_request_notifications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_request_notifications"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "course_request_notifications_rels" ADD CONSTRAINT "course_request_notifications_rels_course_subscription_req_fk" FOREIGN KEY ("course_subscription_requests_id") REFERENCES "public"."course_subscription_requests"("id") ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX "course_subscription_requests_key_idx" ON "course_subscription_requests" USING btree ("key");

CREATE UNIQUE INDEX "course_subscription_requests_reference_idx" ON "course_subscription_requests" USING btree ("reference");

CREATE INDEX "course_subscription_requests_student_idx" ON "course_subscription_requests" USING btree ("student_id");

CREATE INDEX "course_subscription_requests_course_idx" ON "course_subscription_requests" USING btree ("course_id");

CREATE INDEX "course_subscription_requests_license_idx" ON "course_subscription_requests" USING btree ("license_id");

CREATE INDEX "course_subscription_requests_reviewed_by_idx" ON "course_subscription_requests" USING btree ("reviewed_by_id");

CREATE INDEX "course_subscription_requests_notification_idx" ON "course_subscription_requests" USING btree ("notification_id");

CREATE INDEX "course_subscription_requests_updated_at_idx" ON "course_subscription_requests" USING btree ("updated_at");

CREATE INDEX "course_subscription_requests_created_at_idx" ON "course_subscription_requests" USING btree ("created_at");

CREATE UNIQUE INDEX "course_request_notifications_key_idx" ON "course_request_notifications" USING btree ("key");

CREATE INDEX "course_request_notifications_student_idx" ON "course_request_notifications" USING btree ("student_id");

CREATE INDEX "course_request_notifications_updated_at_idx" ON "course_request_notifications" USING btree ("updated_at");

CREATE INDEX "course_request_notifications_created_at_idx" ON "course_request_notifications" USING btree ("created_at");

CREATE INDEX "course_request_notifications_rels_order_idx" ON "course_request_notifications_rels" USING btree ("order");

CREATE INDEX "course_request_notifications_rels_parent_idx" ON "course_request_notifications_rels" USING btree ("parent_id");

CREATE INDEX "course_request_notifications_rels_path_idx" ON "course_request_notifications_rels" USING btree ("path");

CREATE INDEX "course_request_notifications_rels_course_subscription_re_idx" ON "course_request_notifications_rels" USING btree ("course_subscription_requests_id");

ALTER TABLE "courses" ADD CONSTRAINT "courses_preview_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("preview_lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_subscription_request_fk" FOREIGN KEY ("course_subscription_requests_id") REFERENCES "public"."course_subscription_requests"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_request_notification_fk" FOREIGN KEY ("course_request_notifications_id") REFERENCES "public"."course_request_notifications"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX "courses_preview_lesson_idx" ON "courses" USING btree ("preview_lesson_id");

CREATE INDEX "payload_locked_documents_rels_course_subscription_reques_idx" ON "payload_locked_documents_rels" USING btree ("course_subscription_requests_id");

CREATE INDEX "payload_locked_documents_rels_course_request_notificatio_idx" ON "payload_locked_documents_rels" USING btree ("course_request_notifications_id");
COMMIT;
