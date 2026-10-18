import { env } from "cloudflare:workers";
import { z } from "zod";
import { isSameOriginWrite, readJsonBody, requestErrorResponse } from "@/lib/security";
import { allowContact } from "@/lib/contact-rate-limit";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(180), subject: z.string().trim().min(3).max(140), message: z.string().trim().min(20).max(4000), company: z.string().max(0).optional() });
const recipient = "arhamsheikh2250@gmail.com";

export async function POST(request: Request) {
  if (!isSameOriginWrite(request)) return Response.json({ error: "Cross-site submission blocked." }, { status: 403 });
  let body: unknown; try { body = await readJsonBody(request, 24576); } catch (error) { return requestErrorResponse(error); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Check the form fields." }, { status: 400 });
  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  const from = env.CONTACT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return Response.json({ error: `Email delivery is being connected. Please email ${recipient} directly.` }, { status: 503 });
  if (!env.DB) return Response.json({ error: "Contact service is temporarily unavailable. Please email " + recipient + " directly." }, { status: 503 });
  try {
    if (!(await allowContact(env.DB, request))) return Response.json({ error: "Too many messages. Please try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });
  } catch { return Response.json({ error: "Contact service is temporarily unavailable. Please email " + recipient + " directly." }, { status: 503 }); }
  const id = crypto.randomUUID();
  const { name, email, subject, message } = parsed.data;
  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `contact-${id}` },
      body: JSON.stringify({ from, to: [recipient], reply_to: email, subject: `Portfolio enquiry: ${subject}`, text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}` }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await delivery.json().catch(() => null) as { id?: string } | null;
    if (!delivery.ok || !result?.id) {
      console.error("Contact email rejected by provider:", delivery.status);
      return Response.json({ error: `Email delivery is temporarily unavailable. Please email ${recipient} directly.` }, { status: 503 });
    }
  } catch {
    return Response.json({ error: `Could not send your message. Please try again or email ${recipient} directly.` }, { status: 503 });
  }
  // Keep an inbox copy when storage is available; storage failure must not undo an accepted email.
  if (env.DB) {
    try {
      await env.DB.prepare("INSERT INTO contact_messages (id,name,email,subject,message,status) VALUES (?1,?2,?3,?4,?5,'new')").bind(id, name, email, subject, message).run();
    } catch { console.error("Contact email accepted, but inbox copy could not be stored."); }
  }
  return Response.json({ ok: true }, { status: 201 });
}
