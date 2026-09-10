import { env } from "cloudflare:workers";

export type ProjectRecord = {
  id: string; title: string; slug: string; short_description: string; problem_statement: string;
  objectives: string; data_sources: string; architecture_text: string; implementation: string;
  engineering_decisions: string; challenges: string; results: string; learning: string;
  tech_stack: string; github_url: string | null; demo_url: string | null; article_url: string | null;
  status: string; is_featured: number; is_published: number; display_order: number;
};

export const fallbackProject: ProjectRecord = {
  id: "portfolio-v2",
  title: "Professional Dynamic Portfolio",
  slug: "dynamic-portfolio",
  short_description: "A public engineering portfolio and private owner CMS built on a low-maintenance Cloudflare architecture.",
  problem_statement: "Professional work changes often, but a portfolio that requires source edits for every update becomes stale. The system needed a credible public experience and a protected content workflow without a separate server or an inactivity-resume routine.",
  objectives: "Create a fast public portfolio, keep routine content editable from one admin area, isolate public reads from protected writes, and preserve a strict zero-cost operating target for normal personal traffic.",
  data_sources: "Owner-managed project, skill, experience, education, certification, achievement, social, and site-profile records.",
  architecture_text: "Next.js renders public and admin routes on Cloudflare Workers. D1 is the source of truth for structured records. A media repository isolates file handling so Workers KV can serve small portfolio assets without coupling CMS forms to a storage implementation.",
  implementation: "The public experience is organized around architecture and outcomes. Typed repository functions use bounded, indexed queries. Admin mutations validate input, require an authenticated owner identity, and maintain draft and published states.",
  engineering_decisions: "One runtime and one codebase reduce operational overhead. D1 stores relational content instead of file blobs. Media keys are immutable. Public collections use published flags, display order, and explicit limits.",
  challenges: "The hosting surface provisions structured persistence but does not automatically provision a Workers KV namespace. The application therefore keeps the KV adapter explicit and returns a recoverable setup state until a MEDIA binding is connected.",
  results: "A responsive portfolio, structured case study, searchable owner CMS, versioned D1 schema, protected write routes, and a clean path to replace starter content with verified career evidence.",
  learning: "Treating the portfolio as a small data product produces clearer content modeling, safer publishing, and less maintenance than treating it as a collection of static sections.",
  tech_stack: JSON.stringify(["Next.js", "TypeScript", "Cloudflare Workers", "D1", "Workers KV", "Tailwind CSS"]),
  github_url: null, demo_url: null, article_url: null, status: "completed", is_featured: 1, is_published: 1, display_order: 0,
};

function hasDb(): boolean { return Boolean(env.DB); }

export async function getPublishedProjects(): Promise<ProjectRecord[]> {
  if (!hasDb()) return [fallbackProject];
  try {
    const result = await env.DB!.prepare(
      "SELECT id,title,slug,short_description,problem_statement,objectives,data_sources,architecture_text,implementation,engineering_decisions,challenges,results,learning,tech_stack,github_url,demo_url,article_url,status,is_featured,is_published,display_order FROM projects WHERE is_published = 1 ORDER BY is_featured DESC, display_order ASC, updated_at DESC LIMIT 24"
    ).all<ProjectRecord>();
    return result.results.length ? result.results : [fallbackProject];
  } catch { return [fallbackProject]; }
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  if (!hasDb()) return slug === fallbackProject.slug ? fallbackProject : null;
  try {
    const row = await env.DB!.prepare(
      "SELECT id,title,slug,short_description,problem_statement,objectives,data_sources,architecture_text,implementation,engineering_decisions,challenges,results,learning,tech_stack,github_url,demo_url,article_url,status,is_featured,is_published,display_order FROM projects WHERE slug = ?1 AND is_published = 1 LIMIT 1"
    ).bind(slug).first<ProjectRecord>();
    return row ?? (slug === fallbackProject.slug ? fallbackProject : null);
  } catch { return slug === fallbackProject.slug ? fallbackProject : null; }
}

export async function getPublicRows(table: "skills" | "experiences" | "education" | "certifications" | "achievements") {
  if (!hasDb()) return [];
  try {
    const allowed = { skills: "skills", experiences: "experiences", education: "education", certifications: "certifications", achievements: "achievements" } as const;
    return (await env.DB!.prepare(`SELECT * FROM ${allowed[table]} WHERE is_published = 1 ORDER BY display_order ASC, updated_at DESC LIMIT 40`).all()).results;
  } catch { return []; }
}
