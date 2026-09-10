import { env } from "cloudflare:workers";

export async function GET() {
  if (env.DB) {
    try {
      const row = await env.DB.prepare("SELECT value FROM site_settings WHERE key = 'current_resume_media_id' LIMIT 1").first<{ value: string }>();
      if (row?.value) return Response.redirect(`/media/${encodeURIComponent(row.value)}`, 302);
    } catch {}
  }
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume — Arham Ul Haq Sheikh</title><style>body{margin:0;background:#f4f5f7;color:#10141a;font:16px/1.6 Segoe UI,Arial;display:grid;min-height:100vh;place-items:center}.card{width:min(560px,calc(100% - 40px));background:white;border:1px solid #cfd5df;padding:48px;box-shadow:10px 10px 0 #d7ddea}.mark{display:grid;width:32px;height:32px;place-items:center;background:#10141a;color:white;font-weight:800}h1{font-size:42px;line-height:1;margin:35px 0 18px;letter-spacing:-.05em}p{color:#5c6675}a{display:inline-block;margin-top:18px;color:#1746d1;font-weight:700}</style><body><main class="card"><span class="mark">A</span><h1>Resume publication pending</h1><p>The portfolio is ready for the current resume PDF. The owner can publish it from the private CMS once the verified file is available.</p><a href="/">Return to portfolio →</a></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
