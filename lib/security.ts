export class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function isSameOriginWrite(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function readBoundedBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new RequestError(413, "Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "Request body is required.");
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > maxBytes) { await reader.cancel(); throw new RequestError(413, "Request is too large."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export async function readJsonBody(request: Request, maxBytes = 65536): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new RequestError(415, "Use application/json.");
  const bytes = await readBoundedBody(request, maxBytes);
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new RequestError(400, "Invalid JSON."); }
}

export function requestErrorResponse(error: unknown): Response {
  return Response.json({ error: error instanceof RequestError ? error.message : "Request could not be processed." }, { status: error instanceof RequestError ? error.status : 503, headers: { "Cache-Control": "no-store" } });
}
