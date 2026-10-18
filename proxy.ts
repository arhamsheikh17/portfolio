import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "object-src 'none'; base-uri 'self'; form-action 'self'");
  if (request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/api/")) response.headers.set("Cache-Control", "no-store");
  if (request.nextUrl.pathname === "/admin") response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
