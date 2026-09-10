import Link from "next/link";

export function PublicHeader() {
  return <header className="site-header inner-header"><Link className="brand" href="/"><span className="brand-mark">A</span><span>Arham Ul Haq Sheikh</span></Link><nav className="desktop-nav" aria-label="Primary navigation"><Link href="/#about">About</Link><Link href="/projects">Projects</Link><Link href="/experience">Experience</Link><Link href="/certifications">Certifications</Link><Link href="/contact">Contact</Link></nav><Link className="button button-ghost" href="/resume">Resume</Link></header>;
}

export function PublicFooter() {
  return <footer className="site-footer section-shell"><div><span className="brand-mark">A</span><p>Arham Ul Haq Sheikh<br/><small>Data · Cloud · Software</small></p></div><div className="footer-links"><Link href="/projects">Projects</Link><Link href="/contact">Contact</Link><Link href="/admin">Owner CMS</Link></div></footer>;
}
