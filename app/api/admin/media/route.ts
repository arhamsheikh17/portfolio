import { env } from "cloudflare:workers";
import { isAdminRequest } from "@/lib/auth";
import { mediaStore } from "@/lib/media";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
function validSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  if (type === "image/avif") return new TextDecoder().decode(bytes.slice(4, 12)).includes("ftyp");
  if (type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  return false;
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Owner access required." }, { status: 403 });
  if (!env.DB) return Response.json({ error: "D1 database unavailable." }, { status: 503 });
  const form = await request.formData(); const file = form.get("file"); const kind = String(form.get("kind") ?? "gallery"); const altText = String(form.get("alt_text") ?? "").trim();
  if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });
  const max = imageTypes.has(file.type) ? 5 * 1024 * 1024 : file.type === "application/pdf" ? 15 * 1024 * 1024 : 0;
  if (!max || file.size > max) return Response.json({ error: "Use a JPEG, PNG, WebP, AVIF up to 5 MB, or a PDF up to 15 MB." }, { status: 400 });
  const buffer = await file.arrayBuffer(); if (!validSignature(file.type, new Uint8Array(buffer.slice(0, 16)))) return Response.json({ error: "The file contents do not match the declared type." }, { status: 400 });
  const id = crypto.randomUUID(); const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(-120); const key = `media/${kind}/${id}-${safeName}`;
  try { await mediaStore.put(key, buffer, { filename: file.name, contentType: file.type }); await env.DB.prepare("INSERT INTO media_assets (id,kv_key,filename,mime_type,size_bytes,alt_text,kind) VALUES (?1,?2,?3,?4,?5,?6,?7)").bind(id, key, file.name, file.type, file.size, altText, kind).run(); return Response.json({ id, url: `/media/${id}` }, { status: 201 }); }
  catch (error) { try { await mediaStore.delete(key); } catch {} return Response.json({ error: error instanceof Error && error.message.includes("MEDIA") ? "Connect a Workers KV namespace as the MEDIA binding to enable uploads." : "Upload failed." }, { status: 503 }); }
}
