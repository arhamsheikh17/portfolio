import type { Metadata } from "next";
import { Award, ExternalLink } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getPublicRows } from "@/lib/content";

export const metadata: Metadata = { title: "Certifications", description: "Verified cloud, data engineering, and software credentials earned by Arham Ul Haq Sheikh." };
export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  const rows = await getPublicRows("certifications");
  return <main className="portfolio-site"><PublicHeader/>
    <section className="page-hero section-shell">
      <p className="section-kicker">Certifications</p>
      <h1>Credentials grounded in practical engineering.</h1>
      <p>Selected cloud, data platform, and software credentials with direct verification wherever available.</p>
    </section>
    <section className="credential-grid section-shell">
      {rows.map((row, index) => {
        const skills = (() => { try { return JSON.parse(String(row.skills || "[]")) as string[]; } catch { return []; } })();
        const url = row.credential_url ? String(row.credential_url) : "";
        return <article className="credential-card" key={String(row.id ?? index)}>
          <div className="credential-top"><span>{String(index + 1).padStart(2, "0")}</span><Award size={22}/></div>
          <p>{[row.issuer, row.issue_date].filter(Boolean).map(String).join(" · ")}</p>
          <h2>{String(row.title || "")}</h2>
          {Boolean(row.credential_id) && <small>Credential ID {String(row.credential_id)}</small>}
          <div className="neo-tags">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          {url && <a href={url} target="_blank" rel="noreferrer">Verify credential <ExternalLink size={15}/></a>}
        </article>;
      })}
    </section>
    <PublicFooter/>
  </main>;
}
