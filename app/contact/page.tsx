import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PublicFooter, PublicHeader } from "@/components/public-shell";

export const metadata: Metadata = { title: "Contact", description: "Contact Arham Ul Haq Sheikh about data engineering, DevOps, or cloud opportunities." };
export default function ContactPage() { return <main className="portfolio-site"><PublicHeader/><section className="contact-page section-shell"><div><p className="section-kicker">Contact</p><h1>Let’s work on the system behind the outcome.</h1><p>I’m open to full-time and part-time opportunities across Data Engineering, DevOps, and Cloud. Share the context, constraints, and result you need.</p><dl><div><dt>Email</dt><dd><a href="mailto:arhamsheikh2250@gmail.com">arhamsheikh2250@gmail.com</a></dd></div><div><dt>Location</dt><dd>Karachi, Pakistan · Open to relevant remote opportunities</dd></div></dl></div><ContactForm/></section><PublicFooter/></main>; }
