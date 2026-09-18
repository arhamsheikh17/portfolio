import Link from "next/link";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, Mail, Menu, Phone } from "lucide-react";

const navigation = [
  ["About", "/#about"], ["Projects", "/projects"], ["Experience", "/experience"],
  ["Education", "/education"], ["Certifications", "/certifications"], ["Contact", "/contact"],
];

export function PublicHeader() {
  return <header className="site-header inner-header">
    <Link className="brand" href="/" aria-label="Arham Ul Haq Sheikh home"><span className="brand-mark">AS</span><span><strong>Arham Sheikh</strong><small>Data & DevOps Engineer</small></span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{navigation.slice(0, 5).map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <div className="header-actions">
      <details className="contact-menu">
        <summary>Let’s talk <ArrowUpRight size={15} /></summary>
        <div className="contact-menu-panel">
          <p><strong>Connect with Arham</strong><span>Choose the channel that works best.</span></p>
          <a href="mailto:arhamsheikh2250@gmail.com"><Mail size={17}/><span><small>Email</small>arhamsheikh2250@gmail.com</span></a>
          <a href="tel:+923182219239"><Phone size={17}/><span><small>Phone</small>+92 318 221 9239</span></a>
          <a href="https://www.linkedin.com/in/arhammsheikh/" target="_blank" rel="noreferrer"><BriefcaseBusiness size={17}/><span><small>LinkedIn</small>Professional profile</span></a>
          <a href="https://github.com/arhamsheikh17" target="_blank" rel="noreferrer"><Code2 size={17}/><span><small>GitHub</small>Engineering work</span></a>
          <a href="https://medium.com/@arhamsheikh2250" target="_blank" rel="noreferrer"><BookOpen size={17}/><span><small>Medium</small>Technical writing</span></a>
        </div>
      </details>
      <details className="mobile-menu"><summary aria-label="Open navigation"><Menu size={21} /></summary><nav>{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></details>
    </div>
  </header>;
}

export function PublicFooter() {
  return <footer className="site-footer section-shell">
    <div><span className="brand-mark">AS</span><p>Arham Ul Haq Sheikh<br/><small>Multi-Cloud Data & DevOps Engineer</small></p></div>
    <div className="footer-links"><a href="mailto:arhamsheikh2250@gmail.com">Email</a><a href="tel:+923182219239">Phone</a><a href="https://www.linkedin.com/in/arhammsheikh/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/arhamsheikh17" target="_blank" rel="noreferrer">GitHub</a><Link href="/admin">Owner CMS</Link></div>
  </footer>;
}
