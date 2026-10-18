import { env } from "cloudflare:workers";
import { z } from "zod";
import { adminEntities, isAdminEntity } from "@/lib/admin-config";
import { isAdminRequest } from "@/lib/auth";
import { readJsonBody, requestErrorResponse } from "@/lib/security";
import { ensurePortfolioSeeded } from "@/lib/seed";

type RouteProps = { params: Promise<{ entity: string }> };
const valueSchema = z.union([z.string().max(12000), z.number().finite(), z.boolean(), z.null()]);
const recordIdSchema = z.string().min(1).max(120);
const payloadSchema = z.object({ id: recordIdSchema.optional(), values: z.record(valueSchema) });

async function context(request: Request, params: RouteProps["params"]) {
  if (!(await isAdminRequest(request))) return { error: Response.json({ error: "Owner access required." }, { status: 403 }) };
  if (!env.DB) return { error: Response.json({ error: "D1 database unavailable." }, { status: 503 }) };
  const entity = (await params).entity;
  if (!isAdminEntity(entity)) return { error: Response.json({ error: "Unknown content type." }, { status: 404 }) };
  return { config: adminEntities[entity], entity };
}

function normalizeValues(fields: readonly string[], values: Record<string, unknown>) {
  const result: Record<string, string | number | null> = {};
  for (const field of fields) {
    if (!(field in values)) continue;
    const value = values[field];
    if (field.startsWith("is_")) result[field] = value ? 1 : 0;
    else if (field === "display_order") result[field] = Number(value) || 0;
    else if (["tech_stack", "impact", "technologies", "skills", "highlights"].includes(field)) {
      const items = String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
      result[field] = JSON.stringify(items);
    } else if (field.endsWith("_url") || field === "url") {
      const url = String(value ?? "").trim();
      if (url && !/^https?:\/\//i.test(url)) throw new Error("Links must start with https:// or http://.");
      if (url) { const parsed = new URL(url); if (parsed.username || parsed.password) throw new Error("Links cannot contain credentials."); }
      result[field] = url || null;
    } else result[field] = value == null ? null : String(value).trim();
  }
  return result;
}

export async function GET(request: Request, { params }: RouteProps) {
  const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
  await ensurePortfolioSeeded(env.DB!);
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const where = query ? ` WHERE ${ctx.config.search.map((column) => `${column} LIKE ?1`).join(" OR ")}` : "";
  const order = "order" in ctx.config ? ctx.config.order : "display_order ASC, updated_at DESC";
  const statement = env.DB!.prepare(`SELECT * FROM ${ctx.config.table}${where} ORDER BY ${order} LIMIT 100`);
  const result = query ? await statement.bind(`%${query.slice(0, 100)}%`).all() : await statement.all();
  return Response.json({ rows: result.results }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request, { params }: RouteProps) {
  const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
  let body: unknown; try { body = await readJsonBody(request, 262144); } catch (error) { return requestErrorResponse(error); }
  const parsed = payloadSchema.safeParse(body); if (!parsed.success) return Response.json({ error: "Invalid content payload." }, { status: 400 });
  let values: ReturnType<typeof normalizeValues>; try { values = normalizeValues(ctx.config.fields, parsed.data.values); } catch { return Response.json({ error: "Use valid HTTP or HTTPS links without credentials." }, { status: 400 }); }
  for (const field of ctx.config.required) if (!String(values[field] ?? "").trim()) return Response.json({ error: `${field.replaceAll("_", " ")} is required.` }, { status: 400 });
  if (ctx.entity === "projects") { values.slug = String(values.slug || values.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); values.status ||= "completed"; }
  const id = crypto.randomUUID(); const columns = ["id", ...Object.keys(values)]; const placeholders = columns.map((_, index) => `?${index + 1}`);
  try { await env.DB!.prepare(`INSERT INTO ${ctx.config.table} (${columns.join(",")}) VALUES (${placeholders.join(",")})`).bind(id, ...Object.values(values)).run(); return Response.json({ id }, { status: 201 }); }
  catch (error) { return Response.json({ error: error instanceof Error && error.message.includes("UNIQUE") ? "That slug or unique value is already in use." : "Content could not be created." }, { status: 400 }); }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
  let body: unknown; try { body = await readJsonBody(request, 262144); } catch (error) { return requestErrorResponse(error); }
  const parsed = payloadSchema.safeParse(body); if (!parsed.success || !parsed.data.id) return Response.json({ error: "A valid record id is required." }, { status: 400 });
  let values: ReturnType<typeof normalizeValues>; try { values = normalizeValues(ctx.config.fields, parsed.data.values); } catch { return Response.json({ error: "Use valid HTTP or HTTPS links without credentials." }, { status: 400 }); } const columns = Object.keys(values); if (!columns.length) return Response.json({ error: "No changes provided." }, { status: 400 });
  const set = columns.map((column, index) => `${column} = ?${index + 1}`).concat(`updated_at = CURRENT_TIMESTAMP`).join(", ");
  await env.DB!.prepare(`UPDATE ${ctx.config.table} SET ${set} WHERE id = ?${columns.length + 1}`).bind(...Object.values(values), parsed.data.id).run();
  return Response.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const ctx = await context(request, params); if ("error" in ctx) return ctx.error;
  const id = new URL(request.url).searchParams.get("id"); if (!id || !recordIdSchema.safeParse(id).success) return Response.json({ error: "A valid record id is required." }, { status: 400 });
  await env.DB!.prepare(`DELETE FROM ${ctx.config.table} WHERE id = ?1`).bind(id).run(); return Response.json({ ok: true });
}
