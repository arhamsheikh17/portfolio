import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PublicFooter, PublicHeader } from "@/components/public-shell";

export const metadata: Metadata = { title: "Contact", description: "Contact Arham Ul Haq Sheikh about data, cloud, or software engineering work." };
export default function ContactPage() { return <main><PublicHeader/><section className="contact-page section-shell"><div><p className="section-kicker">Contact</p><h1>Start with the problem.</h1><p>Share what the system does today, what is getting in the way, and what a useful outcome looks like. No sales script—just enough context to begin well.</p><dl><div><dt>Best fit</dt><dd>Data platforms, cloud data systems, pipelines, analytics foundations, and maintainable software.</dd></div><div><dt>Helpful context</dt><dd>Current architecture, constraints, timeline, and the decision this work needs to support.</dd></div></dl></div><ContactForm/></section><PublicFooter/></main>; }
