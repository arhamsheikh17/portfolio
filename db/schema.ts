import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  primaryTitle: text("primary_title").notNull(),
  positioning: text("positioning").notNull(),
  summary: text("summary").notNull().default(""),
  availability: text("availability"),
  ...timestamps,
});

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull().default(""),
  ...timestamps,
}, (table) => [uniqueIndex("idx_site_settings_key").on(table.key)]);

export const skillCategories = sqliteTable("skill_categories", {
  id: text("id").primaryKey(), name: text("name").notNull(), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
});

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(), name: text("name").notNull(), category: text("category").notNull(), note: text("note"), isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
}, (table) => [index("idx_skills_public_order").on(table.isPublished, table.displayOrder)]);

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(), title: text("title").notNull(), slug: text("slug").notNull(), shortDescription: text("short_description").notNull().default(""), problemStatement: text("problem_statement").notNull().default(""), objectives: text("objectives").notNull().default(""), dataSources: text("data_sources").notNull().default(""), architectureText: text("architecture_text").notNull().default(""), implementation: text("implementation").notNull().default(""), engineeringDecisions: text("engineering_decisions").notNull().default(""), challenges: text("challenges").notNull().default(""), results: text("results").notNull().default(""), learning: text("learning").notNull().default(""), techStack: text("tech_stack").notNull().default("[]"), githubUrl: text("github_url"), demoUrl: text("demo_url"), articleUrl: text("article_url"), status: text("status").notNull().default("completed"), isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), startedAt: text("started_at"), completedAt: text("completed_at"), ...timestamps,
}, (table) => [uniqueIndex("idx_projects_slug").on(table.slug), index("idx_projects_public_order").on(table.isPublished, table.isFeatured, table.displayOrder)]);

export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(), title: text("title").notNull(), organization: text("organization").notNull(), kind: text("kind").notNull().default("role"), location: text("location"), startDate: text("start_date"), endDate: text("end_date"), isCurrent: integer("is_current", { mode: "boolean" }).notNull().default(false), summary: text("summary").notNull().default(""), impact: text("impact").notNull().default("[]"), technologies: text("technologies").notNull().default("[]"), verificationUrl: text("verification_url"), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
}, (table) => [index("idx_experiences_public_order").on(table.isPublished, table.displayOrder)]);

export const education = sqliteTable("education", {
  id: text("id").primaryKey(), degree: text("degree").notNull(), institution: text("institution").notNull(), field: text("field").notNull().default(""), startYear: text("start_year"), endYear: text("end_year"), isCurrent: integer("is_current", { mode: "boolean" }).notNull().default(false), highlights: text("highlights").notNull().default("[]"), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
}, (table) => [index("idx_education_public_order").on(table.isPublished, table.displayOrder)]);

export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(), title: text("title").notNull(), issuer: text("issuer").notNull(), issueDate: text("issue_date"), expiryDate: text("expiry_date"), credentialId: text("credential_id"), credentialUrl: text("credential_url"), skills: text("skills").notNull().default("[]"), mediaAssetId: text("media_asset_id"), isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
}, (table) => [index("idx_certifications_public_order").on(table.isPublished, table.displayOrder)]);

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(), title: text("title").notNull(), kind: text("kind").notNull().default("achievement"), organization: text("organization"), date: text("date"), description: text("description").notNull().default(""), externalUrl: text("external_url"), isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
}, (table) => [index("idx_achievements_public_order").on(table.isPublished, table.displayOrder)]);

export const socialLinks = sqliteTable("social_links", {
  id: text("id").primaryKey(), platform: text("platform").notNull(), url: text("url").notNull(), isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
});

export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(), kvKey: text("kv_key").notNull(), filename: text("filename").notNull(), mimeType: text("mime_type").notNull(), sizeBytes: integer("size_bytes").notNull(), altText: text("alt_text"), kind: text("kind").notNull(), ...timestamps,
}, (table) => [uniqueIndex("idx_media_kv_key").on(table.kvKey)]);

export const projectSkills = sqliteTable("project_skills", {
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  skillId: text("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
}, (table) => [uniqueIndex("idx_project_skills_unique").on(table.projectId, table.skillId)]);

export const projectMedia = sqliteTable("project_media", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  mediaAssetId: text("media_asset_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
  caption: text("caption"),
  mediaRole: text("media_role").notNull().default("gallery"),
  displayOrder: integer("display_order").notNull().default(0),
}, (table) => [index("idx_project_media_order").on(table.projectId, table.displayOrder)]);

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull(), subject: text("subject").notNull(), message: text("message").notNull(), status: text("status").notNull().default("new"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_contact_created").on(table.createdAt)]);

export const contactRateLimits = sqliteTable("contact_rate_limits", {
  key: text("key").primaryKey(),
  windowStart: integer("window_start").notNull(),
  attempts: integer("attempts").notNull().default(1),
});
