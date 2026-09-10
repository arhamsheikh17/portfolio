import { headers } from "next/headers";

export type AdminIdentity = { email: string; id: string };

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const requestHeaders = await headers();
  const accessEmail = requestHeaders.get("cf-access-authenticated-user-email");
  const siteEmail = requestHeaders.get("oai-authenticated-user-email");
  const email = accessEmail ?? siteEmail;
  const id = requestHeaders.get("oai-authenticated-user-id") ?? email;
  const allowed = process.env.ADMIN_ALLOWED_EMAIL?.trim().toLowerCase();
  if (!email || !id) return null;
  const localOwner = process.env.NODE_ENV !== "production" && siteEmail === "seedy@sites.test";
  if (!accessEmail && !localOwner && (!allowed || email.toLowerCase() !== allowed)) return null;
  if (allowed && email.toLowerCase() !== allowed) return null;
  return { email, id };
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const accessEmail = request.headers.get("cf-access-authenticated-user-email");
  const siteEmail = request.headers.get("oai-authenticated-user-email");
  const email = accessEmail ?? siteEmail;
  const allowed = process.env.ADMIN_ALLOWED_EMAIL?.trim().toLowerCase();
  const localOwner = process.env.NODE_ENV !== "production" && siteEmail === "seedy@sites.test";
  return Boolean(email && (accessEmail || localOwner || (allowed && email.toLowerCase() === allowed)) && (!allowed || email.toLowerCase() === allowed));
}
