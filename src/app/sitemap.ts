import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { paths } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${SITE.url}${p}`;
  const lastModified = new Date("2026-10-10");
  return (["home", "menu"] as const).flatMap((page) => {
    const languages = { mk: abs(paths[page]("mk")), en: abs(paths[page]("en")), "x-default": abs(paths[page]("mk")) };
    return (["mk", "en"] as const).map((lang) => ({
      url: abs(paths[page](lang)),
      lastModified,
      changeFrequency: page === "menu" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "home" ? (lang === "mk" ? 1 : 0.8) : lang === "mk" ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
