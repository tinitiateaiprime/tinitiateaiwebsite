-- Empty isolated staging database only; reconstructed from the original Phase 2 snapshot.
BEGIN;
CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');

CREATE TYPE "public"."enum_courses_tags" AS ENUM('placement-assistance', 'internship', 'certification');

CREATE TYPE "public"."enum_courses_level" AS ENUM('beginner', 'intermediate', 'advanced');

CREATE TYPE "public"."enum_workshops_mode" AS ENUM('online', 'classroom', 'hybrid');

CREATE TYPE "public"."enum_real_time_projects_level" AS ENUM('beginner', 'intermediate', 'advanced');

CREATE TYPE "public"."enum_enrollments_status" AS ENUM('pending', 'active', 'completed');

CREATE TYPE "public"."enum_demo_bookings_status" AS ENUM('pending', 'confirmed', 'cancelled');

CREATE TYPE "public"."enum_batches_mode" AS ENUM('online', 'classroom', 'weekend', 'workshop', 'internship');

CREATE TYPE "public"."enum_placement_registrations_current_status" AS ENUM('student', 'fresher', 'working', 'career-break');

CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('LinkedIn', 'Instagram', 'YouTube', 'Facebook', 'X');

CREATE TABLE "users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
);


CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
);


CREATE TABLE "students_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
);


CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
);


CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar,
	"sizes_card_url" varchar,
	"sizes_card_width" numeric,
	"sizes_card_height" numeric,
	"sizes_card_mime_type" varchar,
	"sizes_card_filesize" numeric,
	"sizes_card_filename" varchar
);


CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "trainers_expertise" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"skill" varchar NOT NULL
);


CREATE TABLE "trainers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"photo_id" integer,
	"years_experience" numeric NOT NULL,
	"bio" jsonb,
	"linked_in" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "courses_curriculum_topics" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"topic" varchar NOT NULL
);


CREATE TABLE "courses_curriculum" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"module_title" varchar NOT NULL
);


CREATE TABLE "courses_key_features" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"feature" varchar NOT NULL
);


CREATE TABLE "courses_tools" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tool" varchar NOT NULL
);


CREATE TABLE "courses_target_audience" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"audience" varchar NOT NULL
);


CREATE TABLE "courses_tags" (
	"order" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"value" "enum_courses_tags",
	"id" serial PRIMARY KEY NOT NULL
);


CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"category_id" integer NOT NULL,
	"thumbnail_id" integer,
	"card_logo_id" integer,
	"short_description" varchar NOT NULL,
	"description" jsonb NOT NULL,
	"level" "enum_courses_level" DEFAULT 'beginner' NOT NULL,
	"duration" varchar NOT NULL,
	"price" numeric NOT NULL,
	"discounted_price" numeric,
	"trainer_id" integer,
	"rating" numeric DEFAULT 5,
	"featured" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"start_date" timestamp(3) with time zone,
	"banner_label" varchar,
	"banner_tag" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "workshops" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"short_description" varchar NOT NULL,
	"description" jsonb,
	"thumbnail_id" integer,
	"duration" varchar,
	"mode" "enum_workshops_mode",
	"scheduled_at" timestamp(3) with time zone,
	"featured" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "real_time_projects_tools" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tool" varchar NOT NULL
);


CREATE TABLE "real_time_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"short_description" varchar NOT NULL,
	"description" jsonb,
	"thumbnail_id" integer,
	"category_id" integer,
	"level" "enum_real_time_projects_level",
	"featured" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_name" varchar NOT NULL,
	"photo_id" integer,
	"course_id" integer,
	"quote" varchar NOT NULL,
	"rating" numeric DEFAULT 5,
	"placed_at" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "blog_posts_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar NOT NULL
);


CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"cover_image_id" integer,
	"excerpt" varchar NOT NULL,
	"content" jsonb NOT NULL,
	"author_id" integer,
	"published_date" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"status" "enum_enrollments_status" DEFAULT 'pending',
	"enrolled_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "demo_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"starts_at" timestamp(3) with time zone NOT NULL,
	"ends_at" timestamp(3) with time zone NOT NULL,
	"course_id" integer,
	"capacity" numeric DEFAULT 20 NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "demo_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"course_id" integer,
	"slot_id" integer NOT NULL,
	"message" varchar,
	"status" "enum_demo_bookings_status" DEFAULT 'pending',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"subject" varchar NOT NULL,
	"message" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"faculty_name" varchar NOT NULL,
	"mode" "enum_batches_mode" NOT NULL,
	"starts_at" timestamp(3) with time zone NOT NULL,
	"meeting_link" varchar,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "placement_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"course_completed_id" integer,
	"current_status" "enum_placement_registrations_current_status" NOT NULL,
	"resume_link" varchar,
	"message" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
);


CREATE TABLE "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"students_id" integer,
	"media_id" integer,
	"categories_id" integer,
	"trainers_id" integer,
	"courses_id" integer,
	"workshops_id" integer,
	"real_time_projects_id" integer,
	"testimonials_id" integer,
	"blog_posts_id" integer,
	"enrollments_id" integer,
	"demo_slots_id" integer,
	"demo_bookings_id" integer,
	"contact_messages_id" integer,
	"batches_id" integer,
	"placement_registrations_id" integer
);


CREATE TABLE "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"students_id" integer
);


CREATE TABLE "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);


CREATE TABLE "site_settings_social_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"platform" "enum_site_settings_social_links_platform" NOT NULL,
	"url" varchar NOT NULL
);


CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" varchar DEFAULT 'TinitiateAI' NOT NULL,
	"tagline" varchar DEFAULT 'Practical AI & Data Training for Real Careers',
	"logo_id" integer,
	"contact_phone" varchar,
	"contact_email" varchar,
	"address" varchar,
	"students_placed" numeric DEFAULT 0,
	"courses_offered" numeric DEFAULT 0,
	"hiring_partners" numeric DEFAULT 0,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);


ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "students_sessions" ADD CONSTRAINT "students_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "trainers_expertise" ADD CONSTRAINT "trainers_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trainers"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "trainers" ADD CONSTRAINT "trainers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "courses_curriculum_topics" ADD CONSTRAINT "courses_curriculum_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_curriculum"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "courses_curriculum" ADD CONSTRAINT "courses_curriculum_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "courses_key_features" ADD CONSTRAINT "courses_key_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "courses_tools" ADD CONSTRAINT "courses_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "courses_target_audience" ADD CONSTRAINT "courses_target_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "courses_tags" ADD CONSTRAINT "courses_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "courses" ADD CONSTRAINT "courses_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "courses" ADD CONSTRAINT "courses_card_logo_id_media_id_fk" FOREIGN KEY ("card_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "courses" ADD CONSTRAINT "courses_trainer_id_trainers_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."trainers"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "workshops" ADD CONSTRAINT "workshops_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "real_time_projects_tools" ADD CONSTRAINT "real_time_projects_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."real_time_projects"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "real_time_projects" ADD CONSTRAINT "real_time_projects_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "real_time_projects" ADD CONSTRAINT "real_time_projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_trainers_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."trainers"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "demo_slots" ADD CONSTRAINT "demo_slots_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "demo_bookings" ADD CONSTRAINT "demo_bookings_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "demo_bookings" ADD CONSTRAINT "demo_bookings_slot_id_demo_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."demo_slots"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "batches" ADD CONSTRAINT "batches_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "placement_registrations" ADD CONSTRAINT "placement_registrations_course_completed_id_courses_id_fk" FOREIGN KEY ("course_completed_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainers_fk" FOREIGN KEY ("trainers_id") REFERENCES "public"."trainers"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workshops_fk" FOREIGN KEY ("workshops_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_real_time_projects_fk" FOREIGN KEY ("real_time_projects_id") REFERENCES "public"."real_time_projects"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demo_slots_fk" FOREIGN KEY ("demo_slots_id") REFERENCES "public"."demo_slots"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demo_bookings_fk" FOREIGN KEY ("demo_bookings_id") REFERENCES "public"."demo_bookings"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_batches_fk" FOREIGN KEY ("batches_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_placement_registrations_fk" FOREIGN KEY ("placement_registrations_id") REFERENCES "public"."placement_registrations"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");

CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");

CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");

CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");

CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");

CREATE INDEX "students_sessions_order_idx" ON "students_sessions" USING btree ("_order");

CREATE INDEX "students_sessions_parent_id_idx" ON "students_sessions" USING btree ("_parent_id");

CREATE INDEX "students_updated_at_idx" ON "students" USING btree ("updated_at");

CREATE INDEX "students_created_at_idx" ON "students" USING btree ("created_at");

CREATE UNIQUE INDEX "students_email_idx" ON "students" USING btree ("email");

CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");

CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");

CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");

CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");

CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");

CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");

CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");

CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");

CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");

CREATE INDEX "trainers_expertise_order_idx" ON "trainers_expertise" USING btree ("_order");

CREATE INDEX "trainers_expertise_parent_id_idx" ON "trainers_expertise" USING btree ("_parent_id");

CREATE UNIQUE INDEX "trainers_slug_idx" ON "trainers" USING btree ("slug");

CREATE INDEX "trainers_photo_idx" ON "trainers" USING btree ("photo_id");

CREATE INDEX "trainers_updated_at_idx" ON "trainers" USING btree ("updated_at");

CREATE INDEX "trainers_created_at_idx" ON "trainers" USING btree ("created_at");

CREATE INDEX "courses_curriculum_topics_order_idx" ON "courses_curriculum_topics" USING btree ("_order");

CREATE INDEX "courses_curriculum_topics_parent_id_idx" ON "courses_curriculum_topics" USING btree ("_parent_id");

CREATE INDEX "courses_curriculum_order_idx" ON "courses_curriculum" USING btree ("_order");

CREATE INDEX "courses_curriculum_parent_id_idx" ON "courses_curriculum" USING btree ("_parent_id");

CREATE INDEX "courses_key_features_order_idx" ON "courses_key_features" USING btree ("_order");

CREATE INDEX "courses_key_features_parent_id_idx" ON "courses_key_features" USING btree ("_parent_id");

CREATE INDEX "courses_tools_order_idx" ON "courses_tools" USING btree ("_order");

CREATE INDEX "courses_tools_parent_id_idx" ON "courses_tools" USING btree ("_parent_id");

CREATE INDEX "courses_target_audience_order_idx" ON "courses_target_audience" USING btree ("_order");

CREATE INDEX "courses_target_audience_parent_id_idx" ON "courses_target_audience" USING btree ("_parent_id");

CREATE INDEX "courses_tags_order_idx" ON "courses_tags" USING btree ("order");

CREATE INDEX "courses_tags_parent_idx" ON "courses_tags" USING btree ("parent_id");

CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");

CREATE INDEX "courses_category_idx" ON "courses" USING btree ("category_id");

CREATE INDEX "courses_thumbnail_idx" ON "courses" USING btree ("thumbnail_id");

CREATE INDEX "courses_card_logo_idx" ON "courses" USING btree ("card_logo_id");

CREATE INDEX "courses_trainer_idx" ON "courses" USING btree ("trainer_id");

CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");

CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");

CREATE UNIQUE INDEX "workshops_slug_idx" ON "workshops" USING btree ("slug");

CREATE INDEX "workshops_thumbnail_idx" ON "workshops" USING btree ("thumbnail_id");

CREATE INDEX "workshops_updated_at_idx" ON "workshops" USING btree ("updated_at");

CREATE INDEX "workshops_created_at_idx" ON "workshops" USING btree ("created_at");

CREATE INDEX "real_time_projects_tools_order_idx" ON "real_time_projects_tools" USING btree ("_order");

CREATE INDEX "real_time_projects_tools_parent_id_idx" ON "real_time_projects_tools" USING btree ("_parent_id");

CREATE UNIQUE INDEX "real_time_projects_slug_idx" ON "real_time_projects" USING btree ("slug");

CREATE INDEX "real_time_projects_thumbnail_idx" ON "real_time_projects" USING btree ("thumbnail_id");

CREATE INDEX "real_time_projects_category_idx" ON "real_time_projects" USING btree ("category_id");

CREATE INDEX "real_time_projects_updated_at_idx" ON "real_time_projects" USING btree ("updated_at");

CREATE INDEX "real_time_projects_created_at_idx" ON "real_time_projects" USING btree ("created_at");

CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");

CREATE INDEX "testimonials_course_idx" ON "testimonials" USING btree ("course_id");

CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");

CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");

CREATE INDEX "blog_posts_tags_order_idx" ON "blog_posts_tags" USING btree ("_order");

CREATE INDEX "blog_posts_tags_parent_id_idx" ON "blog_posts_tags" USING btree ("_parent_id");

CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");

CREATE INDEX "blog_posts_cover_image_idx" ON "blog_posts" USING btree ("cover_image_id");

CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");

CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");

CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");

CREATE INDEX "enrollments_student_idx" ON "enrollments" USING btree ("student_id");

CREATE INDEX "enrollments_course_idx" ON "enrollments" USING btree ("course_id");

CREATE INDEX "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");

CREATE INDEX "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");

CREATE INDEX "demo_slots_course_idx" ON "demo_slots" USING btree ("course_id");

CREATE INDEX "demo_slots_updated_at_idx" ON "demo_slots" USING btree ("updated_at");

CREATE INDEX "demo_slots_created_at_idx" ON "demo_slots" USING btree ("created_at");

CREATE INDEX "demo_bookings_course_idx" ON "demo_bookings" USING btree ("course_id");

CREATE INDEX "demo_bookings_slot_idx" ON "demo_bookings" USING btree ("slot_id");

CREATE INDEX "demo_bookings_updated_at_idx" ON "demo_bookings" USING btree ("updated_at");

CREATE INDEX "demo_bookings_created_at_idx" ON "demo_bookings" USING btree ("created_at");

CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");

CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");

CREATE INDEX "batches_course_idx" ON "batches" USING btree ("course_id");

CREATE INDEX "batches_updated_at_idx" ON "batches" USING btree ("updated_at");

CREATE INDEX "batches_created_at_idx" ON "batches" USING btree ("created_at");

CREATE INDEX "placement_registrations_course_completed_idx" ON "placement_registrations" USING btree ("course_completed_id");

CREATE INDEX "placement_registrations_updated_at_idx" ON "placement_registrations" USING btree ("updated_at");

CREATE INDEX "placement_registrations_created_at_idx" ON "placement_registrations" USING btree ("created_at");

CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");

CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");

CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");

CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");

CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");

CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");

CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");

CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");

CREATE INDEX "payload_locked_documents_rels_students_id_idx" ON "payload_locked_documents_rels" USING btree ("students_id");

CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");

CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");

CREATE INDEX "payload_locked_documents_rels_trainers_id_idx" ON "payload_locked_documents_rels" USING btree ("trainers_id");

CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");

CREATE INDEX "payload_locked_documents_rels_workshops_id_idx" ON "payload_locked_documents_rels" USING btree ("workshops_id");

CREATE INDEX "payload_locked_documents_rels_real_time_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("real_time_projects_id");

CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");

CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");

CREATE INDEX "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");

CREATE INDEX "payload_locked_documents_rels_demo_slots_id_idx" ON "payload_locked_documents_rels" USING btree ("demo_slots_id");

CREATE INDEX "payload_locked_documents_rels_demo_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("demo_bookings_id");

CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");

CREATE INDEX "payload_locked_documents_rels_batches_id_idx" ON "payload_locked_documents_rels" USING btree ("batches_id");

CREATE INDEX "payload_locked_documents_rels_placement_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("placement_registrations_id");

CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");

CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");

CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");

CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");

CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");

CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");

CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");

CREATE INDEX "payload_preferences_rels_students_id_idx" ON "payload_preferences_rels" USING btree ("students_id");

CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");

CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");

CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");

CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");

CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
COMMIT;
