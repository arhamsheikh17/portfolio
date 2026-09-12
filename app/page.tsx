import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness,
  CloudCog, Code2, DatabaseZap, GraduationCap, Mail, MapPin,
} from "lucide-react";
import { getPublishedProjects, getPublicRows } from "@/lib/content";
import { PublicFooter, PublicHeader } from "@/components/public-shell";

export const dynamic = "force-dynamic";

const profiles = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/arhammsheikh/", icon: BriefcaseBusiness },
  { label: "GitHub", href: "https://github.com/arhamsheikh17", icon: Code2 },
  { label: "Medium", href: "https://medium.com/@arhamsheikh2250", icon: BookOpen },
  { label: "Microsoft Learn", href: "https://learn.microsoft.com/en-us/users/arhamulhaqsheikh-9037/", icon: Code2 },
];

export default async function Home() {
  const [projects, skills, experiences] = await Promise.all([
    getPublishedProjects(), getPublicRows("skills"), getPublicRows("experiences"),
  ]);
  const groupedSkills = skills.reduce<Record<string, string[]>>((groups, row) => {
    const item = row as { category?: string; name?: string };
    const category = item.category || "Other";
    (groups[category] ||= []).push(item.name || "");
    return groups;
  }, {});

  return (
    <main className="portfolio-site" id="top">
      <PublicHeader />

      <section className="neo-hero section-shell">
        <div className="neo-hero-copy">
          <p className="neo-status"><span /> Karachi, Pakistan · Open to full-time & part-time roles</p>
          <p className="neo-overline">Multi-Cloud Data & DevOps Engineer</p>
          <h1>Building data systems that move from <em>signal</em> to scale.</h1>
          <p className="neo-lede">Software Engineering graduate-in-progress building scalable ETL/ELT pipelines, data warehouses, and cloud analytics across AWS, Azure, and GCP.</p>
          <div className="neo-actions">
            <a className="neo-button neo-button-primary" href="#projects">View projects <ArrowDownRight size={18} /></a>
            <Link className="neo-button neo-button-outline" href="/resume">Download resume</Link>
            <Link className="neo-text-link" href="/contact">Contact me <ArrowUpRight size={17} /></Link>
          </div>
          <div className="neo-stack-line" aria-label="Strongest technologies">
            <span>Python</span><i /> <span>Kafka</span><i /> <span>Airflow</span><i /> <span>Docker</span><i /> <span>Terraform</span>
          </div>
        </div>

        <div className="portrait-stage">
          <div className="portrait-frame" role="img" aria-label="Profile photograph will be added in the final phase" />
          <div className="portrait-caption"><span>Profile image reserved</span><small>Final phase</small></div>
          <div className="cloud-orbit" aria-hidden="true">
            <span>AWS</span><span>AZURE</span><span>GCP</span>
          </div>
        </div>
      </section>

      <section className="neo-proof" aria-label="Professional snapshot">
        <div><strong>06</strong><span>End-to-end data projects</span></div>
        <div><strong>03</strong><span>Cloud platforms</span></div>
        <div><strong>20+</strong><span>Students taught</span></div>
        <div><strong>4+</strong><span>Years teaching</span></div>
      </section>

      <section className="neo-about section-shell" id="about">
        <div className="neo-section-label"><span>01</span> About</div>
        <div className="neo-about-main">
          <p className="neo-intro">I care about the difficult middle: where raw data, production constraints, and business decisions have to meet.</p>
          <div className="neo-about-grid">
            <p>I began my data engineering journey through Saylani’s Data Engineering program. Today, my focus is designing production-minded pipelines and improving solutions at the architecture level using Python, SQL, dbt, PySpark, and modern cloud platforms.</p>
            <p>I’m completing a BS in Software Engineering at UBIT, University of Karachi, with graduation expected in December 2026. Alongside engineering, I teach O/A-Level students and co-lead the AWS Student Builders Group at UoK—work that has strengthened my leadership and communication.</p>
          </div>
          <div className="neo-focus-cards">
            <article><DatabaseZap /><span>Primary craft</span><strong>Data Engineering</strong></article>
            <article><CloudCog /><span>Cloud focus</span><strong>AWS · Azure · GCP</strong></article>
            <article><BriefcaseBusiness /><span>Career direction</span><strong>Data · DevOps · Cloud</strong></article>
          </div>
        </div>
      </section>

      <section className="neo-projects section-shell" id="projects">
        <div className="neo-section-head">
          <div><div className="neo-section-label"><span>02</span> Projects</div><h2>Systems built end to end.</h2></div>
          <Link className="neo-text-link" href="/projects">View all projects <ArrowRight size={17} /></Link>
        </div>
        <div className="neo-project-grid">
          {projects.slice(0, 6).map((item, index) => {
            const stack = JSON.parse(item.tech_stack || "[]") as string[];
            return <article className={index === 0 ? "neo-project-card featured" : "neo-project-card"} key={item.id}>
              <div className="neo-project-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{stack[0] || "Data engineering"}</span></div>
              <h3>{item.title}</h3>
              <p>{item.short_description}</p>
              <div className="neo-tags">{stack.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
              <div className="neo-project-links">
                <Link href={`/projects/${item.slug}`}>Case study <ArrowRight size={16} /></Link>
                {item.github_url && <a href={item.github_url} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>}
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="neo-experience section-shell" id="experience">
        <div className="neo-section-head">
          <div><div className="neo-section-label"><span>03</span> Experience</div><h2>Engineering, leadership, and teaching.</h2></div>
          <Link className="neo-text-link" href="/experience">Full timeline <ArrowRight size={17} /></Link>
        </div>
        <div className="neo-timeline">
          {experiences.map((row, index) => <article key={String(row.id ?? index)}>
            <span className="neo-timeline-index">{String(index + 1).padStart(2, "0")}</span>
            <div><p>{String(row.kind || "Role")}</p><h3>{String(row.title || "")}</h3><strong>{String(row.organization || "")}</strong></div>
            <p>{String(row.summary || "")}</p>
            <span className="neo-date">{[row.start_date, row.end_date].filter(Boolean).map(String).join(" — ")}</span>
          </article>)}
        </div>
      </section>

      <section className="neo-skills section-shell" id="skills">
        <div className="neo-section-head"><div><div className="neo-section-label"><span>04</span> Technical stack</div><h2>Built across the data lifecycle.</h2></div></div>
        <div className="neo-skill-groups">
          {Object.entries(groupedSkills).map(([category, list], index) => <article key={category}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{category}</h3></div>
            <ul>{list.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </article>)}
        </div>
      </section>

      <section className="neo-education section-shell">
        <div className="neo-section-label"><span>05</span> Education</div>
        <div className="neo-education-card">
          <GraduationCap size={36} />
          <div><p>2023 — Expected December 2026</p><h2>BS Software Engineering</h2><strong>UBIT · University of Karachi</strong></div>
          <div><span>Current standing</span><strong>8th semester</strong><small>Karachi, Pakistan</small></div>
        </div>
      </section>

      <section className="neo-contact section-shell" id="contact">
        <div><p className="neo-overline">Let’s build something reliable.</p><h2>Open to Data Engineering, DevOps, and Cloud opportunities.</h2></div>
        <div>
          <p>For roles, collaborations, and practical cloud or data work, reach out directly.</p>
          <a className="neo-button neo-button-light" href="mailto:arhamsheikh2250@gmail.com"><Mail size={18} /> arhamsheikh2250@gmail.com</a>
          <span className="neo-location"><MapPin size={16} /> Karachi, Pakistan</span>
        </div>
      </section>

      <section className="neo-socials section-shell" aria-label="Professional profiles">
        {profiles.map(({ label, href, icon: Icon }) => <a href={href} target="_blank" rel="noreferrer" key={label}><Icon size={18} /><span>{label}</span><ArrowUpRight size={16} /></a>)}
        <a href="https://builder.aws.com/profile?tab=badges" target="_blank" rel="noreferrer"><CloudCog size={18} /><span>AWS Builder</span><ArrowUpRight size={16} /></a>
      </section>

      <PublicFooter />
    </main>
  );
}
