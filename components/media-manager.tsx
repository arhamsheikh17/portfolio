"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaManager() {
  const [state, setState] = useState("Workers KV keeps media bytes separate from D1 records.");
  const [busy, setBusy] = useState(false);
  async function upload(formData: FormData) {
    setBusy(true); setState("Uploading and validating…");
    const response = await fetch("/api/admin/media", { method: "POST", body: formData }); const data = await response.json().catch(() => ({})) as { error?: string; id?: string; url?: string };
    if (!response.ok) { setState(data.error ?? "Upload failed."); setBusy(false); return; }
    if (formData.get("kind") === "resume") {
      const settings = await fetch("/api/admin/site_settings").then((value) => value.json()) as { rows?: Array<{ id: string; key: string }> }; const current = settings.rows?.find((row) => row.key === "current_resume_media_id");
      await fetch("/api/admin/site_settings", { method: current ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: current?.id, values: { key: "current_resume_media_id", value: data.id } }) });
    }
    setState(`Uploaded ${String((formData.get("file") as File).name)}. Public media URL: ${data.url}`); setBusy(false);
  }
  return <section className="media-manager"><div><p className="admin-eyebrow">Media and resume</p><h2>Upload a verified asset</h2><p>{state}</p></div><form action={upload}><label><span>File</span><Input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" required/></label><label><span>Purpose</span><select name="kind" defaultValue="gallery"><option value="gallery">Project gallery</option><option value="certificate">Certificate</option><option value="achievement">Achievement proof</option><option value="resume">Current resume</option></select></label><label><span>Alt text</span><Input name="alt_text" placeholder="Describe meaningful images"/></label><Button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload asset"}</Button></form></section>;
}
