import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getProjectBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.short_description, openGraph: { title: project.title, description: project.short_description, images: [] }, twitter: { card: "summary", title: project.title, description: project.short_description, images: [] } };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug); if (!project) notFound();
  const sections = [
    ["Context", project.problem_statement], ["Objectives", project.objectives], ["Data sources", project.data_sources], ["Architecture", project.architecture_text], ["Implementation", project.implementation], ["Engineering decisions", project.engineering_decisions], ["Challenges and fixes", project.challenges], ["Results", project.results], ["What I learned", project.learning],
  ].filter(([, value]) => value);
  return <main><PublicHeader/><article className="case-study section-shell"><Link className="back-link" href="/projects"><ArrowLeft size={16}/> All projects</Link><header><p className="section-kicker">Case study · {project.status}</p><h1>{project.title}</h1><p>{project.short_description}</p><div className="tag-row">{JSON.parse(project.tech_stack || "[]").map((tech: string) => <span key={tech}>{tech}</span>)}</div></header><div className="architecture-strip"><div><span>Input</span><strong>Owner-managed records</strong></div><i>→</i><div><span>Runtime</span><strong>Cloudflare Worker</strong></div><i>→</i><div><span>Output</span><strong>Published portfolio</strong></div></div><div className="case-body"><aside><p>On this page</p>{sections.map(([label]) => <a href={`#${label.toLowerCase().replaceAll(" ", "-")}`} key={label}>{label}</a>)}</aside><div>{sections.map(([label, value], index) => <section id={label.toLowerCase().replaceAll(" ", "-")} key={label}><span>{String(index + 1).padStart(2, "0")}</span><h2>{label}</h2><p>{value}</p></section>)}{(project.github_url || project.demo_url || project.article_url) && <div className="case-links">{project.github_url && <a href={project.github_url}>Repository <ArrowUpRight size={16}/></a>}{project.demo_url && <a href={project.demo_url}>Live demo <ArrowUpRight size={16}/></a>}{project.article_url && <a href={project.article_url}>Article <ArrowUpRight size={16}/></a>}</div>}</div></div></article><PublicFooter/></main>;
}
