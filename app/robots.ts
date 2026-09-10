import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] }], sitemap: `${process.env.SITE_URL ?? "https://arham-engineering-portfolio.cozy-cod-2181.chatgpt.site"}/sitemap.xml` }; }
