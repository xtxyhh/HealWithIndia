export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap:
      "https://healwithindia.vercel.app/sitemap.xml",
  };
}