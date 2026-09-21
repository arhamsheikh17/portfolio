import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { getProjectBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getProjectBySlug((await params).slug);
  if (!item) return { title: "Project not found" };
  return { title: item.title, description: item.short_description, openGraph: { title: item.title, description: item.short_description, images: [] }, twitter: { card: "summary", title: item.title, description: item.short_description, images: [] } };
}

export default async function ProjectPage({ params }: Props) {
  const item = await getProjectBySlug((await params).slug);
  if (!item) notFound();
  const stack = JSON.parse(item.tech_stack || "[]") as string[];
  const isCaseStudy = item.slug === "rebtel-enterprise-intelligence-hub";
  const sections = [["Context", item.problem_statement], ["Objective", item.objectives], ["Data landscape", item.data_sources], ["Architecture", item.architecture_text], ["Implementation", item.implementation], ["Engineering decisions", item.engineering_decisions], ["Challenge", item.challenges], ["Outcome", item.results], ["Learning", item.learning]].filter(([, value]) => value);

  return <main className="portfolio-site">
    <PublicHeader/>
    <article className="case-study section-shell">
      <a className="back-link" href="/projects"><ArrowLeft size={16}/> All projects</a>
      <header>
        <p className="section-kicker">{stack[0] || "Cloud data"} · {isCaseStudy ? "case study" : "project"}</p>
        <h1>{item.title}</h1><p>{item.short_description}</p>
        <div className="tag-row">{stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
      </header>
      <div className="architecture-strip"><div><span>Platform</span><strong>{stack[0] || "Cloud"}</strong></div><i>→</i><div><span>Engineering</span><strong>{stack[1] || "Data pipeline"}</strong></div><i>→</i><div><span>Outcome</span><strong>Analytics-ready data</strong></div></div>
      <div className="case-body">
        <aside><p>On this page</p>{sections.map(([label]) => <a href={`#${label.toLowerCase().replaceAll(" ", "-")}`} key={label}>{label}</a>)}</aside>
        <div>{sections.map(([label, value], index) => <section id={label.toLowerCase().replaceAll(" ", "-")} key={label}><span>{String(index + 1).padStart(2, "0")}</span><h2>{label}</h2><p>{value}</p></section>)}{item.github_url && <div className="case-links"><a href={item.github_url} target="_blank" rel="noreferrer">View GitHub repository <ArrowUpRight size={16}/></a></div>}</div>
      </div>
    </article>
    <PublicFooter/>
  </main>;
}
