import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.SITE_URL ?? "https://arham-engineering-portfolio.cozy-cod-2181.chatgpt.site";
  const routes = ["", "/projects", "/experience", "/education", "/certifications", "/achievements", "/contact"];
  const projects = await getPublishedProjects();
  return [...routes.map((route) => ({ url: `${origin}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : .7 })), ...projects.map((project) => ({ url: `${origin}/projects/${project.slug}`, changeFrequency: "monthly" as const, priority: .8 }))];
}
