"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, Mail, Menu, Phone } from "lucide-react";

const navigation = [
  ["About", "/#about"], ["Projects", "/projects"], ["Experience", "/experience"],
  ["Education", "/education"], ["Certifications", "/certifications"], ["Contact", "/contact"],
];

export function HeaderActions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setContactOpen(false);
        setMobileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeMenus = () => {
    setContactOpen(false);
    setMobileOpen(false);
  };

  return <div className="header-actions" ref={containerRef}>
    <div className={`contact-menu${contactOpen ? " is-open" : ""}`}>
      <button type="button" aria-expanded={contactOpen} aria-controls="contact-menu-panel" onClick={() => { setContactOpen((open) => !open); setMobileOpen(false); }}>
        Let’s talk <ArrowUpRight size={15} />
      </button>
      <div className="contact-menu-panel" id="contact-menu-panel" aria-hidden={!contactOpen}>
        <p><strong>Connect with Arham</strong><span>Choose the channel that works best.</span></p>
        <a href="mailto:arhamsheikh2250@gmail.com" onClick={closeMenus}><Mail size={17}/><span><small>Email</small>arhamsheikh2250@gmail.com</span></a>
        <a href="tel:+923182219239" onClick={closeMenus}><Phone size={17}/><span><small>Phone</small>+92 318 221 9239</span></a>
        <a href="https://www.linkedin.com/in/arhammsheikh/" target="_blank" rel="noreferrer" onClick={closeMenus}><BriefcaseBusiness size={17}/><span><small>LinkedIn</small>Professional profile</span></a>
        <a href="https://github.com/arhamsheikh17" target="_blank" rel="noreferrer" onClick={closeMenus}><Code2 size={17}/><span><small>GitHub</small>Engineering work</span></a>
        <a href="https://medium.com/@arhamsheikh2250" target="_blank" rel="noreferrer" onClick={closeMenus}><BookOpen size={17}/><span><small>Medium</small>Technical writing</span></a>
      </div>
    </div>
    <div className={`mobile-menu${mobileOpen ? " is-open" : ""}`}>
      <button type="button" aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => { setMobileOpen((open) => !open); setContactOpen(false); }}><Menu size={21} /></button>
      <nav id="mobile-navigation" aria-hidden={!mobileOpen}>{navigation.map(([label, href]) => <a href={href} key={href} onClick={closeMenus}>{label}</a>)}</nav>
    </div>
  </div>;
}
