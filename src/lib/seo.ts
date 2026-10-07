import type { Metadata, Viewport } from "next";
import { COPY } from "@/content/copy";
import { IS_PRODUCTION, SITE } from "@/content/site";
import { ogLocale, otherLang, paths, type Lang } from "./i18n";
import type { Page } from "@/components/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4ecdd",
};

/** Full per-page metadata (Next merges shallowly, so every page sets its own alternates + OG). */
export function pageMetadata(lang: Lang, page: Page): Metadata {
  const c = COPY[lang].meta;
  const path = paths[page](lang);
  const title = page === "home" ? c.homeTitle : c.menuTitle;
  const description = page === "home" ? c.homeDescription : c.menuDescription;
  const image = { url: `/og/${page}-${lang}.jpg`, width: 1200, height: 630, alt: page === "home" ? c.ogAltHome : c.ogAltMenu };

  return {
    metadataBase: new URL(SITE.url),
    title: { absolute: title },
    description,
    applicationName: c.siteName,
    alternates: {
      canonical: path,
      languages: { mk: paths[page]("mk"), en: paths[page]("en"), "x-default": paths[page]("mk") },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: c.siteName,
      title,
      description,
      locale: ogLocale[lang],
      alternateLocale: [ogLocale[otherLang(lang)]],
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
    robots: IS_PRODUCTION
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        }
      : { index: false, follow: false }, // staging copy: never indexed
    formatDetection: { telephone: false, address: false, email: false },
    category: "food & drink",
    other: {
      "geo.region": "MK",
      "geo.placename": lang === "mk" ? "Скопје" : "Skopje",
      "geo.position": `${SITE.geo.lat};${SITE.geo.lng}`,
      ICBM: `${SITE.geo.lat}, ${SITE.geo.lng}`,
    },
  };
}
