import { fallbackProjects, fallbackRows } from "@/lib/content";

type SeedRow = Record<string, string | number | null | undefined>;

function insert(db: D1Database, table: string, row: SeedRow): D1PreparedStatement {
  const entries = Object.entries(row).filter(([, value]) => value !== undefined);
  const columns = entries.map(([column]) => column);
  const placeholders = columns.map((_, index) => `?${index + 1}`);
  return db.prepare(`INSERT OR IGNORE INTO ${table} (${columns.join(",")}) VALUES (${placeholders.join(",")})`).bind(...entries.map(([, value]) => value ?? null));
}

export async function ensurePortfolioSeeded(db: D1Database): Promise<void> {
  const marker = await db.prepare("SELECT value FROM site_settings WHERE key = ?1 LIMIT 1").bind("portfolio_seed_version").first<{ value: string }>();
  if (marker?.value === "1") return;

  const statements: D1PreparedStatement[] = [
    insert(db, "profiles", {
      id: "owner-profile",
      full_name: "Arham Ul Haq Sheikh",
      primary_title: "Data Engineer & Software Engineer",
      positioning: "I build dependable cloud data pipelines, analytics systems, and practical software products.",
      summary: "Software Engineering student and data engineer focused on production-minded cloud systems, data platforms, and automation.",
      availability: "Open to data engineering and software opportunities",
    }),
    ...fallbackProjects.map((row) => insert(db, "projects", row as unknown as SeedRow)),
    ...Object.entries(fallbackRows).flatMap(([table, rows]) => rows.map((row) => insert(db, table, row as SeedRow))),
    insert(db, "social_links", { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/arhammsheikh/", is_published: 1, display_order: 1 }),
    insert(db, "social_links", { id: "github", platform: "GitHub", url: "https://github.com/arhamsheikh17", is_published: 1, display_order: 2 }),
    insert(db, "social_links", { id: "medium", platform: "Medium", url: "https://medium.com/@arhamsheikh2250", is_published: 1, display_order: 3 }),
    insert(db, "site_settings", { id: crypto.randomUUID(), key: "portfolio_seed_version", value: "1" }),
  ];

  await db.batch(statements);
}
