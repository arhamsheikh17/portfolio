"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaManager() {
  const [state, setState] = useState("Media files are stored separately from portfolio records.");
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState("gallery");
  const [certifications, setCertifications] = useState<Array<{ id: string; title: string }>>([]);
  useEffect(() => {
    fetch("/api/admin/certifications").then((response) => response.json()).then((data: { rows?: Array<{ id: string; title: string }> }) => setCertifications(data.rows ?? [])).catch(() => setCertifications([]));
  }, []);
  async function upload(formData: FormData) {
    setBusy(true); setState("Uploading and validating…");
    const response = await fetch("/api/admin/media", { method: "POST", body: formData }); const data = await response.json().catch(() => ({})) as { error?: string; id?: string; url?: string };
    if (!response.ok) { setState(data.error ?? "Upload failed."); setBusy(false); return; }
    if (formData.get("kind") === "resume") {
      const settings = await fetch("/api/admin/site_settings").then((value) => value.json()) as { rows?: Array<{ id: string; key: string }> }; const current = settings.rows?.find((row) => row.key === "current_resume_media_id");
      await fetch("/api/admin/site_settings", { method: current ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: current?.id, values: { key: "current_resume_media_id", value: data.id } }) });
    }
    if (formData.get("kind") === "certificate") {
      const certificateId = String(formData.get("certificate_id") ?? "");
      const attachment = await fetch("/api/admin/certifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: certificateId, values: { media_asset_id: data.id } }) });
      if (!attachment.ok) { setState("The file uploaded, but it could not be attached to the selected certificate."); setBusy(false); return; }
    }
    setState(`Uploaded ${String((formData.get("file") as File).name)}. Public media URL: ${data.url}`); setBusy(false);
  }
  return <section className="media-manager"><div><p className="admin-eyebrow">Media and resume</p><h2>Upload a verified asset</h2><p>{state}</p></div><form action={upload}><label><span>File</span><Input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" required/></label><label><span>Purpose</span><select name="kind" value={kind} onChange={(event) => setKind(event.target.value)}><option value="gallery">Project gallery</option><option value="certificate">Certificate</option><option value="achievement">Achievement proof</option><option value="resume">Current resume</option></select></label>{kind === "certificate" && <label><span>Attach to certificate</span><select name="certificate_id" required defaultValue=""><option value="" disabled>Select a certificate</option>{certifications.map((certificate) => <option value={certificate.id} key={certificate.id}>{certificate.title}</option>)}</select></label>}<label><span>Alt text</span><Input name="alt_text" placeholder="Describe meaningful images"/></label><Button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload asset"}</Button></form></section>;
}
