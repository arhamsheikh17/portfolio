import type { Metadata } from "next";
import { Award, ExternalLink } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getPublicRows } from "@/lib/content";

const certificateImages: Record<string, string> = {
  "fabric-data-engineer": "/certificates/microsoft-fabric-data-engineer.webp",
  "aws-cloud-practitioner": "/certificates/aws-cloud-practitioner-essentials.webp",
  "snowflake-warehouse": "/certificates/snowflake-data-warehouse.webp",
  "snowflake-marketplace": "/certificates/snowflake-collaboration-marketplace.webp",
  "advanced-javascript": "/certificates/advanced-javascript-3.webp",
};

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
        const image = row.media_asset_id ? `/media/${String(row.media_asset_id)}` : certificateImages[String(row.id || "")];
        return <article className="credential-card" key={String(row.id ?? index)}>
          {image ? <a className="credential-image" href={image} target="_blank" rel="noreferrer" aria-label={`View ${String(row.title || "certificate")}`}><img src={image} alt={`${String(row.title || "Certificate")} issued to Arham Sheikh`} loading="lazy"/></a> : <div className="credential-image credential-placeholder"><Award size={54}/><span>Verified digital badge</span></div>}
          <div className="credential-top"><span>{String(index + 1).padStart(2, "0")}</span><Award size={22}/></div>
          <p>{[row.issuer, row.issue_date].filter(Boolean).map(String).join(" · ")}</p>
          <h2>{String(row.title || "")}</h2>
          {Boolean(row.credential_id) && <small>Credential ID {String(row.credential_id)}</small>}
          {Boolean(row.expiry_date) && <small>Valid until {String(row.expiry_date)}</small>}
          <div className="neo-tags">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          {url ? <a href={url} target="_blank" rel="noreferrer">Verify credential <ExternalLink size={15}/></a> : image && <a href={image} target="_blank" rel="noreferrer">View certificate <ExternalLink size={15}/></a>}
        </article>;
      })}
    </section>
    <PublicFooter/>
  </main>;
}
