import { env } from "cloudflare:workers";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(180), subject: z.string().trim().min(3).max(140), message: z.string().trim().min(20).max(4000), company: z.string().max(0).optional() });

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ error: "Cross-site submission blocked." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Check the form fields." }, { status: 400 });
  if (!env.DB) return Response.json({ error: "The inbox is being connected. Please try again soon." }, { status: 503 });
  const id = crypto.randomUUID(); const { name, email, subject, message } = parsed.data;
  try { await env.DB.prepare("INSERT INTO contact_messages (id,name,email,subject,message,status) VALUES (?1,?2,?3,?4,?5,'new')").bind(id, name, email, subject, message).run(); return Response.json({ ok: true }, { status: 201 }); }
  catch { return Response.json({ error: "The inbox is temporarily unavailable." }, { status: 503 }); }
}
