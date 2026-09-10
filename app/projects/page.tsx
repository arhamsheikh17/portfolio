import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects", description: "Data, cloud, and software engineering case studies by Arham Ul Haq Sheikh." };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <main><PublicHeader/><section className="page-hero section-shell"><p className="section-kicker">Selected engineering work</p><h1>Projects built around the system, not the screenshot.</h1><p>Each case study documents the context, architecture, engineering decisions, and outcome.</p></section><section className="project-list section-shell">{projects.map((project, index) => <article key={project.id}><div className="project-list-index">{String(index + 1).padStart(2, "0")}</div><div><p className="project-type">{project.status} · case study</p><h2>{project.title}</h2><p>{project.short_description}</p><div className="tag-row">{JSON.parse(project.tech_stack || "[]").map((tech: string) => <span key={tech}>{tech}</span>)}</div></div><Link className="project-open" href={`/projects/${project.slug}`} aria-label={`Open ${project.title}`}><ArrowRight/></Link></article>)}</section><PublicFooter/></main>;
}
