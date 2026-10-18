// Shared public origin for metadata and crawler routes.
export const siteOrigin = new URL(
  process.env.SITE_URL || "https://arham-engineering-portfolio.arhamsheikh2250.chatgpt.site",
).origin;
