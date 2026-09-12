import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects", description: "Multi-cloud data engineering projects by Arham Ul Haq Sheikh." };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <main className="portfolio-site"><PublicHeader/><section className="page-hero section-shell"><p className="section-kicker">Selected engineering work</p><h1>Data systems built across three clouds.</h1><p>End-to-end work spanning batch and streaming ingestion, warehouse design, transformation, quality, and analytics.</p></section><section className="project-list section-shell">{projects.map((item, index) => <article key={item.id}><div className="project-list-index">{String(index + 1).padStart(2, "0")}</div><div><p className="project-type">{(JSON.parse(item.tech_stack || "[]") as string[])[0]} · case study</p><h2>{item.title}</h2><p>{item.short_description}</p><div className="tag-row">{(JSON.parse(item.tech_stack || "[]") as string[]).map((tech) => <span key={tech}>{tech}</span>)}</div><div className="case-links"><Link href={`/projects/${item.slug}`}>Read case study <ArrowRight size={16}/></Link>{item.github_url && <a href={item.github_url} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a>}</div></div><Link className="project-open" href={`/projects/${item.slug}`} aria-label={`Open ${item.title}`}><ArrowRight/></Link></article>)}</section><PublicFooter/></main>;
}
