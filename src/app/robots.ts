import type { MetadataRoute } from "next";
import { IS_PRODUCTION, SITE } from "@/content/site";

export const dynamic = "force-static";

// Open to search engines and AI answer engines alike: a local bar wants to be cited.
export default function robots(): MetadataRoute.Robots {
  // Staging builds stay crawlable so crawlers can see each page's noindex, but list no sitemap.
  if (!IS_PRODUCTION) return { rules: [{ userAgent: "*", allow: "/" }] };
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
