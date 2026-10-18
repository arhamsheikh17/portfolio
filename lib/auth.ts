import { headers } from "next/headers";
import { env } from "cloudflare:workers";
import { isSameOriginWrite } from "@/lib/security";

export type AdminIdentity = { email: string; id: string };

function ownerIdentity(requestHeaders: Headers): AdminIdentity | null {
  // Sites dispatch strips and supplies these identity headers. Never trust a bare CF email header.
  const email = requestHeaders.get("oai-authenticated-user-email")?.trim().toLowerCase();
  const id = requestHeaders.get("oai-authenticated-user-id");
  if (!email || !id) return null;
  const localOwner = process.env.NODE_ENV === "development" && email === "seedy@sites.test" && id === "local_seedy";
  if (localOwner) return { email, id };
  const allowed = (env.ADMIN_ALLOWED_EMAIL || process.env.ADMIN_ALLOWED_EMAIL)?.trim().toLowerCase();
  return allowed && email === allowed ? { email, id } : null;
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  return ownerIdentity(await headers());
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  return isSameOriginWrite(request) && Boolean(ownerIdentity(request.headers));
}
