import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

const navigation = [
  ["About", "/#about"], ["Projects", "/projects"], ["Experience", "/experience"],
  ["Education", "/education"], ["Achievements", "/achievements"], ["Contact", "/contact"],
];

export function PublicHeader() {
  return <header className="site-header inner-header">
    <Link className="brand" href="/" aria-label="Arham Ul Haq Sheikh home"><span className="brand-mark">AS</span><span><strong>Arham Sheikh</strong><small>Data & DevOps Engineer</small></span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{navigation.slice(0, 5).map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <div className="header-actions">
      <Link className="header-contact" href="/contact">Let’s talk <ArrowUpRight size={15} /></Link>
      <details className="mobile-menu"><summary aria-label="Open navigation"><Menu size={21} /></summary><nav>{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></details>
    </div>
  </header>;
}

export function PublicFooter() {
  return <footer className="site-footer section-shell">
    <div><span className="brand-mark">AS</span><p>Arham Ul Haq Sheikh<br/><small>Multi-Cloud Data & DevOps Engineer</small></p></div>
    <div className="footer-links"><a href="mailto:arhamsheikh2250@gmail.com">Email</a><a href="https://github.com/arhamsheikh17" target="_blank" rel="noreferrer">GitHub</a><Link href="/admin">Owner CMS</Link></div>
  </footer>;
}
