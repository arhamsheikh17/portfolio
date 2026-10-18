export async function allowContact(db: D1Database, request: Request): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / 900) * 900;
  const address = request.headers.get("cf-connecting-ip") || "local-or-unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(address + ":" + windowStart));
  const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
  const increment = (key: string) => db.prepare("INSERT INTO contact_rate_limits (key,window_start,attempts) VALUES (?1,?2,1) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts").bind(key, windowStart);
  const results = await db.batch<{ attempts: number }>([
    db.prepare("DELETE FROM contact_rate_limits WHERE window_start < ?1").bind(windowStart - 900),
    increment("ip:" + fingerprint),
    increment("global:" + windowStart),
  ]);
  return (results[1].results[0]?.attempts ?? 999) <= 5 && (results[2].results[0]?.attempts ?? 999) <= 30;
}
