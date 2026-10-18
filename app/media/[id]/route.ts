import { env } from "cloudflare:workers";
import { mediaStore } from "@/lib/media";
import { isAdminRequest } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Props) {
  if (!env.DB) return new Response("Media unavailable", { status: 503 });
  const id = (await params).id;
  if (!/^[a-zA-Z0-9-]{1,120}$/.test(id)) return new Response("Not found", { status: 404 });
  try {
    const owner = await isAdminRequest(request);
    // Unattached files and files belonging only to drafts remain owner-only.
    if (!owner) {
      const published = await env.DB.prepare("SELECT 1 AS visible WHERE EXISTS (SELECT 1 FROM certifications WHERE media_asset_id=?1 AND is_published=1) OR EXISTS (SELECT 1 FROM project_media pm JOIN projects p ON p.id=pm.project_id WHERE pm.media_asset_id=?1 AND p.is_published=1) OR EXISTS (SELECT 1 FROM site_settings WHERE key='current_resume_media_id' AND value=?1)").bind(id).first();
      if (!published) return new Response("Not found", { status: 404 });
    }
    const asset = await env.DB.prepare("SELECT kv_key,mime_type,filename FROM media_assets WHERE id=?1 LIMIT 1").bind(id).first<{kv_key:string;mime_type:string;filename:string}>();
    if (!asset) return new Response("Not found", { status: 404 });
    const bytes = await mediaStore.get(asset.kv_key);
    if (!bytes) return new Response("Not found", { status: 404 });
    const safeName = asset.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
    const safeTypes = ["image/jpeg","image/png","image/webp","image/avif","application/pdf"];
    if (!safeTypes.includes(asset.mime_type)) return new Response("Unsupported media", { status: 415 });
    return new Response(bytes, { headers: { "Content-Type":asset.mime_type, "Content-Disposition":'inline; filename="'+safeName+'"', "Cache-Control":"private, no-store", "X-Content-Type-Options":"nosniff", "Content-Security-Policy":"sandbox" } });
  } catch { return new Response("Media unavailable", { status: 503 }); }
}
