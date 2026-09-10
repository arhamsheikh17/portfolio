"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    setState("sending"); setMessage("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({})) as { error?: string };
    if (response.ok) { setState("sent"); setMessage("Thanks — your message is safely in the portfolio inbox."); }
    else { setState("error"); setMessage(data.error ?? "Your message could not be sent. Please try again."); }
  }
  if (state === "sent") return <div className="form-success" role="status"><strong>Message received.</strong><p>{message}</p><button onClick={() => setState("idle")}>Send another</button></div>;
  return <form className="contact-form" action={submit}>
    <div className="field"><label htmlFor="name">Name</label><Input id="name" name="name" required maxLength={100}/></div>
    <div className="field"><label htmlFor="email">Email</label><Input id="email" name="email" type="email" required maxLength={180}/></div>
    <div className="field field-wide"><label htmlFor="subject">Subject</label><Input id="subject" name="subject" required maxLength={140}/></div>
    <div className="field field-wide"><label htmlFor="message">Context, constraints, and outcome</label><Textarea id="message" name="message" required minLength={20} maxLength={4000} rows={8}/></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="company">Company</label><input id="company" name="company" tabIndex={-1} autoComplete="off"/></div>
    <div className="form-footer"><Button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</Button><p className={state === "error" ? "form-error" : ""} aria-live="polite">{message}</p></div>
  </form>;
}
