import Link from "next/link";
import { getPublishedProjects, getPublicRows } from "@/lib/content";
import {
  ArrowDownRight,
  ArrowRight,
  Cloud,
  Database,
  Layers3,
  Mail,
  Menu,
  ServerCog,
} from "lucide-react";

const skillGroups = [
  { label: "Data systems", skills: ["SQL", "Data modeling", "ETL / ELT", "Data quality"] },
  { label: "Cloud engineering", skills: ["Cloudflare", "Serverless", "D1", "Workers KV"] },
  { label: "Software", skills: ["TypeScript", "Next.js", "Python", "APIs"] },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, skillRows] = await Promise.all([getPublishedProjects(), getPublicRows("skills")]);
  const project = projects[0];
  const groupedSkills = skillRows.reduce<Record<string, string[]>>((groups, row) => {
    const item = row as { category?: string; name?: string }; const category = item.category || "Other"; (groups[category] ||= []).push(item.name || ""); return groups;
  }, {});
  const dynamicSkillGroups = skillRows.length ? Object.entries(groupedSkills).map(([label, skills]) => ({ label, skills })) : skillGroups;
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Arham Ul Haq Sheikh home">
          <span className="brand-mark">A</span>
          <span>Arham Ul Haq Sheikh</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <Link className="button button-ghost desktop-resume" href="/resume">Resume</Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Menu size={20} /></summary>
            <nav aria-label="Mobile navigation">
              <a href="#about">About</a><a href="#work">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Data engineer · Cloud data engineer · Software engineer</p>
          <h1>I build data systems that stay <em>clear</em> under pressure.</h1>
          <p className="hero-lede">I design dependable pipelines, cloud-native services, and maintainable software—turning scattered data into systems teams can trust and operate.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore selected work <ArrowDownRight size={17} /></a>
            <a className="button button-ghost" href="#contact">Start a conversation</a>
          </div>
          <div className="hero-proof" aria-label="Engineering principles">
            <div><strong>01</strong><span>Architecture before tooling</span></div>
            <div><strong>02</strong><span>Measured, testable outcomes</span></div>
            <div><strong>03</strong><span>Low-maintenance by design</span></div>
          </div>
        </div>

        <div className="system-panel" aria-label="Data system architecture illustration">
          <div className="panel-top"><span>system / portfolio-v2</span><span className="live-label">building</span></div>
          <div className="flow-stage">
            <div className="flow-node source"><Database size={19} /><span>D1</span><small>structured content</small></div>
            <div className="flow-line line-a"><i /></div>
            <div className="flow-node core"><ServerCog size={23} /><span>Worker</span><small>typed repositories</small></div>
            <div className="flow-line line-b"><i /></div>
            <div className="flow-node output"><Cloud size={19} /><span>Public</span><small>fast delivery</small></div>
            <div className="flow-node media"><Layers3 size={18} /><span>KV media</span></div>
            <div className="flow-line line-c"><i /></div>
          </div>
          <div className="panel-log">
            <span><i /> indexed reads</span>
            <span><i /> owner-only writes</span>
            <span><i /> zero keep-alive jobs</span>
          </div>
        </div>
      </section>

      <section className="marquee" aria-label="Current focus">
        <div>DATA PIPELINES <span>◆</span> CLOUD ARCHITECTURE <span>◆</span> ANALYTICS ENGINEERING <span>◆</span> SOFTWARE SYSTEMS <span>◆</span> DATA PIPELINES <span>◆</span> CLOUD ARCHITECTURE</div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-kicker">01 / About</div>
        <div>
          <h2>Engineering for the whole lifecycle, not just the happy path.</h2>
          <p>I focus on how data enters a system, how it changes, how people verify it, and how the system behaves when something goes wrong. The result is work that is easier to understand, safer to evolve, and less expensive to operate.</p>
        </div>
      </section>

      <section className="work section-shell" id="work">
        <div className="section-heading">
          <div><p className="section-kicker">02 / Selected work</p><h2>Architecture and outcomes first.</h2></div>
          <Link className="text-link" href="/projects">All projects <ArrowRight size={17} /></Link>
        </div>
        <article className="project-feature">
          <div className="project-index">01</div>
          <div className="project-copy">
            <p className="project-type">Cloud platform · Full-stack data product</p>
            <h3>{project.title}</h3>
            <p>{project.short_description}</p>
            <div className="tag-row">{JSON.parse(project.tech_stack || "[]").slice(0, 5).map((tech: string) => <span key={tech}>{tech}</span>)}</div>
            <Link className="text-link" href={`/projects/${project.slug}`}>Read case study <ArrowRight size={17} /></Link>
          </div>
          <div className="project-visual" aria-hidden="true">
            <div className="code-window"><span /><span /><span /><pre>{`public reads  → D1\nadmin writes  → verify → D1\nmedia bytes   → KV\nidle backend  → no action`}</pre></div>
          </div>
        </article>
      </section>

      <section className="skills section-shell" id="experience">
        <div className="section-heading"><div><p className="section-kicker">03 / Working set</p><h2>Tools follow the problem.</h2></div></div>
        <div className="skill-grid">
          {dynamicSkillGroups.slice(0, 3).map((group, index) => (
            <article key={group.label}>
              <span>0{index + 1}</span><h3>{group.label}</h3>
              <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <div><p className="section-kicker">04 / Contact</p><h2>Have a data problem worth untangling?</h2></div>
        <div className="contact-copy"><p>Share the context, constraints, and outcome you need. I’ll start with the system, then work backward to the right tools.</p><Link className="button button-light" href="/contact">Send a message <Mail size={17} /></Link></div>
      </section>

      <footer className="site-footer section-shell">
        <div><span className="brand-mark">A</span><p>Arham Ul Haq Sheikh<br /><small>Data · Cloud · Software</small></p></div>
        <div className="footer-links"><a href="#top">Back to top</a><Link href="/projects">Projects</Link><Link href="/contact">Contact</Link></div>
      </footer>
    </main>
  );
}
