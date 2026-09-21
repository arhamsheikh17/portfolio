import type { Metadata } from "next";
import Link from "next/link";
import { AdminManager } from "@/components/admin-manager";
import { MediaManager } from "@/components/media-manager";
import { chatGPTSignInPath } from "@/app/chatgpt-auth";
import { getAdminIdentity } from "@/lib/auth";

export const metadata: Metadata = { title: "Owner CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const identity = await getAdminIdentity();
  if (!identity) return <main className="access-page"><div className="access-card"><span className="brand-mark">A</span><p className="admin-eyebrow">Private owner area</p><h1>Owner access required</h1><p>Sign in with the ChatGPT account that owns this portfolio to manage its content and media.</p><a className="button button-primary" href={chatGPTSignInPath("/admin")} target="_top">Sign in with ChatGPT</a><Link className="text-link" href="/">Return to portfolio</Link></div></main>;
  return <main className="admin-page"><header className="admin-header"><Link className="brand" href="/"><span className="brand-mark">A</span><span>Portfolio CMS</span></Link><div><span>{identity.email}</span><Link className="button button-ghost" href="/">View site</Link></div></header><section className="admin-overview"><div><p className="admin-eyebrow">Owner dashboard</p><h1>Publish the work. Keep the system quiet.</h1></div><p>Manage verified career evidence from one place. Public pages only read published records; drafts stay private.</p></section><AdminManager/><MediaManager/></main>;
}
