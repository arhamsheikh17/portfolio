import { env } from "cloudflare:workers";
import { mediaStore } from "@/lib/media";

type Props = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Props) {
  if (!env.DB) return new Response("Media unavailable", { status: 503 });
  const id = (await params).id; const asset = await env.DB.prepare("SELECT kv_key,mime_type,filename FROM media_assets WHERE id = ?1 LIMIT 1").bind(id).first<{ kv_key: string; mime_type: string; filename: string }>();
  if (!asset) return new Response("Not found", { status: 404 });
  try { const bytes = await mediaStore.get(asset.kv_key); if (!bytes) return new Response("Not found", { status: 404 }); return new Response(bytes, { headers: { "content-type": asset.mime_type, "content-disposition": asset.mime_type === "application/pdf" ? `inline; filename="${asset.filename.replaceAll('"', '')}"` : "inline", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } }); }
  catch { return new Response("Media unavailable", { status: 503 }); }
}
