import type { Metadata } from "next";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://arham-engineering-portfolio.arhamsheikh2250.chatgpt.site"),
  title: { default: "Arham Ul Haq Sheikh — Multi-Cloud Data & DevOps Engineer", template: "%s — Arham Ul Haq Sheikh" },
  description: "Portfolio of Arham Ul Haq Sheikh, a multi-cloud data and DevOps engineer building scalable pipelines and analytics systems across AWS, Azure, and GCP.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
