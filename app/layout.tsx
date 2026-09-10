import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://arham-engineering-portfolio.cozy-cod-2181.chatgpt.site"),
  title: { default: "Arham Ul Haq Sheikh — Data & Cloud Engineer", template: "%s — Arham Ul Haq Sheikh" },
  description: "Data, cloud data, and software engineering portfolio focused on dependable systems and clear outcomes.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
