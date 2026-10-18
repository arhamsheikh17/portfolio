export const adminEntities = {
  profiles: { table: "profiles", title: "Profile", label: "Profile", search: ["full_name", "primary_title"], required: ["full_name", "primary_title", "positioning"], fields: ["full_name", "primary_title", "positioning", "summary", "availability"], publishable: false, order: "updated_at DESC" },
  projects: { table: "projects", title: "Projects", label: "Project", search: ["title", "short_description"], required: ["title"], fields: ["title", "slug", "short_description", "problem_statement", "objectives", "data_sources", "architecture_text", "implementation", "engineering_decisions", "challenges", "results", "learning", "tech_stack", "github_url", "demo_url", "article_url", "status", "is_featured", "is_published", "display_order"] },
  skills: { table: "skills", title: "Skills", label: "Skill", search: ["name", "category"], required: ["name", "category"], fields: ["name", "category", "note", "is_featured", "is_published", "display_order"] },
  experiences: { table: "experiences", title: "Experience", label: "Experience", search: ["title", "organization"], required: ["title", "organization"], fields: ["title", "organization", "kind", "location", "start_date", "end_date", "is_current", "summary", "impact", "technologies", "verification_url", "is_published", "display_order"] },
  certifications: { table: "certifications", title: "Certifications", label: "Certification", search: ["title", "issuer"], required: ["title", "issuer"], fields: ["title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "skills", "media_asset_id", "is_featured", "is_published", "display_order"] },
  achievements: { table: "achievements", title: "Achievements", label: "Achievement", search: ["title", "organization"], required: ["title"], fields: ["title", "kind", "organization", "date", "description", "external_url", "is_featured", "is_published", "display_order"] },
  education: { table: "education", title: "Education", label: "Education", search: ["degree", "institution"], required: ["degree", "institution"], fields: ["degree", "institution", "field", "start_year", "end_year", "is_current", "highlights", "is_published", "display_order"] },
  social_links: { table: "social_links", title: "Social links", label: "Social link", search: ["platform", "url"], required: ["platform", "url"], fields: ["platform", "url", "is_published", "display_order"] },
  site_settings: { table: "site_settings", title: "Site settings", label: "Setting", search: ["key", "value"], required: ["key"], fields: ["key", "value"], publishable: false, order: "key ASC" },
} as const;

export type AdminEntity = keyof typeof adminEntities;
export function isAdminEntity(value: string): value is AdminEntity { return Object.hasOwn(adminEntities, value); }
