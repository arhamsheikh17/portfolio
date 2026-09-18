import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getPublicRows } from "@/lib/content";

export const metadata: Metadata = { title: "Resume", description: "Professional resume of Arham Ul Haq Sheikh, Data Engineer and Software Engineering student." };
export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const [experience, education, certifications, skills] = await Promise.all([
    getPublicRows("experiences"), getPublicRows("education"), getPublicRows("certifications"), getPublicRows("skills"),
  ]);
  return <main className="portfolio-site"><PublicHeader/><article className="resume-page section-shell">
    <header className="resume-intro"><div><p className="section-kicker">Professional resume</p><h1>Arham Ul Haq Sheikh</h1><p>Data Engineer and Software Engineering student working across cloud data pipelines, warehouses, analytics, DevOps practices, and responsive frontend systems.</p></div><div className="resume-contact-list"><a href="mailto:arhamsheikh2250@gmail.com"><span>Email</span><strong>arhamsheikh2250@gmail.com</strong></a><a href="tel:+923182219239"><span>Phone</span><strong>+92 318 221 9239</strong></a><a href="https://www.linkedin.com/in/arhammsheikh/" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>View profile <ArrowUpRight size={14}/></strong></a><a href="https://github.com/arhamsheikh17" target="_blank" rel="noreferrer"><span>GitHub</span><strong>View projects <ArrowUpRight size={14}/></strong></a></div></header>
    <section className="resume-section"><h2>Profile</h2><p>Software Engineering undergraduate with hands-on experience in SQL, Python, ETL/ELT pipelines, data warehousing, AWS, Azure, GCP, Snowflake, React, Next.js, and TypeScript. I enjoy turning production constraints and business questions into reliable end-to-end systems.</p></section>
    <section className="resume-section"><h2>Experience</h2><div className="resume-list">{experience.map((row, index)=><article key={String(row.id??index)}><h3>{String(row.title||"")}</h3><small>{[row.organization,row.start_date,row.end_date].filter(Boolean).map(String).join(" · ")}</small><p>{String(row.summary||"")}</p></article>)}</div></section>
    <section className="resume-section"><h2>Education</h2><div className="resume-list">{education.map((row,index)=><article key={String(row.id??index)}><h3>{String(row.degree||"")}</h3><small>{[row.institution,row.start_year,row.end_year].filter(Boolean).map(String).join(" · ")}</small><p>{String(row.field||"")}</p></article>)}</div></section>
    <section className="resume-section"><h2>Certifications</h2><div className="resume-list">{certifications.map((row,index)=><article key={String(row.id??index)}><h3>{String(row.title||"")}</h3><small>{[row.issuer,row.issue_date].filter(Boolean).map(String).join(" · ")}</small>{Boolean(row.credential_url)&&<p><a className="neo-text-link" href={String(row.credential_url)} target="_blank" rel="noreferrer">Verify credential <ArrowUpRight size={14}/></a></p>}</article>)}</div></section>
    <section className="resume-section"><h2>Technical skills</h2><div className="resume-stack">{skills.map((row,index)=><span key={String(row.id??index)}>{String(row.name||"")}</span>)}</div></section>
  </article><PublicFooter/></main>;
}
