CREATE TABLE `profiles` (`id` text PRIMARY KEY NOT NULL, `full_name` text NOT NULL, `primary_title` text NOT NULL, `positioning` text NOT NULL, `summary` text DEFAULT '' NOT NULL, `availability` text, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE TABLE `site_settings` (`id` text PRIMARY KEY NOT NULL, `key` text NOT NULL, `value` text DEFAULT '' NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_site_settings_key` ON `site_settings` (`key`);
--> statement-breakpoint
CREATE TABLE `skill_categories` (`id` text PRIMARY KEY NOT NULL, `name` text NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE TABLE `skills` (`id` text PRIMARY KEY NOT NULL, `name` text NOT NULL, `category` text NOT NULL, `note` text, `is_featured` integer DEFAULT false NOT NULL, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_skills_public_order` ON `skills` (`is_published`,`display_order`);
--> statement-breakpoint
CREATE TABLE `projects` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `slug` text NOT NULL, `short_description` text DEFAULT '' NOT NULL, `problem_statement` text DEFAULT '' NOT NULL, `objectives` text DEFAULT '' NOT NULL, `data_sources` text DEFAULT '' NOT NULL, `architecture_text` text DEFAULT '' NOT NULL, `implementation` text DEFAULT '' NOT NULL, `engineering_decisions` text DEFAULT '' NOT NULL, `challenges` text DEFAULT '' NOT NULL, `results` text DEFAULT '' NOT NULL, `learning` text DEFAULT '' NOT NULL, `tech_stack` text DEFAULT '[]' NOT NULL, `github_url` text, `demo_url` text, `article_url` text, `status` text DEFAULT 'completed' NOT NULL, `is_featured` integer DEFAULT false NOT NULL, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `started_at` text, `completed_at` text, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_projects_slug` ON `projects` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_projects_public_order` ON `projects` (`is_published`,`is_featured`,`display_order`);
--> statement-breakpoint
CREATE TABLE `experiences` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `organization` text NOT NULL, `kind` text DEFAULT 'role' NOT NULL, `location` text, `start_date` text, `end_date` text, `is_current` integer DEFAULT false NOT NULL, `summary` text DEFAULT '' NOT NULL, `impact` text DEFAULT '[]' NOT NULL, `technologies` text DEFAULT '[]' NOT NULL, `verification_url` text, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_experiences_public_order` ON `experiences` (`is_published`,`display_order`);
--> statement-breakpoint
CREATE TABLE `education` (`id` text PRIMARY KEY NOT NULL, `degree` text NOT NULL, `institution` text NOT NULL, `field` text DEFAULT '' NOT NULL, `start_year` text, `end_year` text, `is_current` integer DEFAULT false NOT NULL, `highlights` text DEFAULT '[]' NOT NULL, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_education_public_order` ON `education` (`is_published`,`display_order`);
--> statement-breakpoint
CREATE TABLE `certifications` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `issuer` text NOT NULL, `issue_date` text, `expiry_date` text, `credential_id` text, `credential_url` text, `skills` text DEFAULT '[]' NOT NULL, `is_featured` integer DEFAULT false NOT NULL, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_certifications_public_order` ON `certifications` (`is_published`,`display_order`);
--> statement-breakpoint
CREATE TABLE `achievements` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `kind` text DEFAULT 'achievement' NOT NULL, `organization` text, `date` text, `description` text DEFAULT '' NOT NULL, `external_url` text, `is_featured` integer DEFAULT false NOT NULL, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_achievements_public_order` ON `achievements` (`is_published`,`display_order`);
--> statement-breakpoint
CREATE TABLE `social_links` (`id` text PRIMARY KEY NOT NULL, `platform` text NOT NULL, `url` text NOT NULL, `is_published` integer DEFAULT false NOT NULL, `display_order` integer DEFAULT 0 NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE TABLE `media_assets` (`id` text PRIMARY KEY NOT NULL, `kv_key` text NOT NULL, `filename` text NOT NULL, `mime_type` text NOT NULL, `size_bytes` integer NOT NULL, `alt_text` text, `kind` text NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_media_kv_key` ON `media_assets` (`kv_key`);
--> statement-breakpoint
CREATE TABLE `project_skills` (`project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE cascade, `skill_id` text NOT NULL REFERENCES `skills`(`id`) ON DELETE cascade);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_project_skills_unique` ON `project_skills` (`project_id`,`skill_id`);
--> statement-breakpoint
CREATE TABLE `project_media` (`id` text PRIMARY KEY NOT NULL, `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE cascade, `media_asset_id` text NOT NULL REFERENCES `media_assets`(`id`) ON DELETE cascade, `caption` text, `media_role` text DEFAULT 'gallery' NOT NULL, `display_order` integer DEFAULT 0 NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_project_media_order` ON `project_media` (`project_id`,`display_order`);
--> statement-breakpoint
CREATE TABLE `contact_messages` (`id` text PRIMARY KEY NOT NULL, `name` text NOT NULL, `email` text NOT NULL, `subject` text NOT NULL, `message` text NOT NULL, `status` text DEFAULT 'new' NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `idx_contact_created` ON `contact_messages` (`created_at`);
--> statement-breakpoint
PRAGMA optimize;
