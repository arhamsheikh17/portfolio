import { HeaderActions } from "@/components/header-actions";

const navigation = [
  ["About", "/#about"], ["Projects", "/projects"], ["Experience", "/experience"],
  ["Education", "/education"], ["Certifications", "/certifications"], ["Contact", "/contact"],
];

export function PublicHeader() {
  return <header className="site-header inner-header">
    <a className="brand" href="/" aria-label="Arham Ul Haq Sheikh home"><span className="brand-mark">AS</span><span><strong>Arham Sheikh</strong><small>Data & DevOps Engineer</small></span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">{navigation.slice(0, 5).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
    <HeaderActions />
  </header>;
}

export function PublicFooter() {
  return <footer className="site-footer section-shell">
    <div><span className="brand-mark">AS</span><p>Arham Ul Haq Sheikh<br/><small>Multi-Cloud Data & DevOps Engineer</small></p></div>
    <div className="footer-links"><a href="mailto:arhamsheikh2250@gmail.com">Email</a><a href="tel:+923182219239">Phone</a><a href="https://www.linkedin.com/in/arhammsheikh/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/arhamsheikh17" target="_blank" rel="noreferrer">GitHub</a><a href="/admin">Owner CMS</a></div>
  </footer>;
}
