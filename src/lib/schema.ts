// JSON-LD builders. Facts only from src/content (verified). No aggregateRating: Google ignores
// self-served review markup for local businesses.
import { COPY } from "@/content/copy";
import { MENU } from "@/content/menu";
import { SITE } from "@/content/site";
import { paths, type Lang } from "./i18n";

const BAR_ID = `${SITE.url}/#bar`;
const SITE_ID = `${SITE.url}/#website`;
const abs = (p: string) => `${SITE.url}${p}`;

export function barSchema(lang: Lang) {
  const c = COPY[lang];
  return {
    "@type": ["BarOrPub", "CafeOrCoffeeShop"],
    "@id": BAR_ID,
    name: SITE.name[lang],
    alternateName: [SITE.name.mk, SITE.name.en, "Pozitiva bar"].filter((n) => n !== SITE.name[lang]),
    description: c.meta.homeDescription,
    slogan: c.footer.tagline,
    url: abs(paths.home(lang)),
    logo: abs("/img/logo-badge-512.png"),
    image: [abs("/img/hero-night-1200.webp"), abs("/img/hero-day-1200.webp"), abs("/img/wall-interior-1600.webp")],
    telephone: SITE.phoneIntl,
    priceRange: "80–320 MKD",
    currenciesAccepted: "MKD",
    servesCuisine: lang === "mk" ? ["Кафе", "Коктели"] : ["Coffee", "Cocktails"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street[lang],
      addressLocality: SITE.address.city[lang],
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.maps,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "23:59",
      },
    ],
    hasMenu: abs(paths.menu(lang)),
    sameAs: [SITE.instagram, SITE.maps],
    foundingDate: SITE.openedIn,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: abs("/"),
    name: SITE.name.mk,
    alternateName: SITE.name.en,
    inLanguage: ["mk", "en"],
    publisher: { "@id": BAR_ID },
  };
}

export function webPageSchema(lang: Lang, page: "home" | "menu") {
  const c = COPY[lang].meta;
  const url = abs(paths[page](lang));
  return {
    "@type": page === "home" ? "WebPage" : "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: page === "home" ? c.homeTitle : c.menuTitle,
    description: page === "home" ? c.homeDescription : c.menuDescription,
    inLanguage: lang,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": BAR_ID },
    primaryImageOfPage: abs(`/og/${page}-${lang}.jpg`),
  };
}

export function faqSchema(lang: Lang) {
  return {
    "@type": "FAQPage",
    "@id": `${abs(paths.home(lang))}#faq`,
    inLanguage: lang,
    mainEntity: COPY[lang].faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function menuSchema(lang: Lang) {
  const url = abs(paths.menu(lang));
  return {
    "@type": "Menu",
    "@id": `${url}#menu`,
    name: COPY[lang].menu.title,
    url,
    inLanguage: lang,
    hasMenuSection: MENU.map((s) => ({
      "@type": "MenuSection",
      name: s.title[lang],
      ...(s.note ? { description: s.note[lang] } : {}),
      hasMenuItem: s.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name[lang],
        ...(i.ingredients ? { description: i.ingredients[lang] } : {}),
        ...(i.price
          ? { offers: { "@type": "Offer", price: String(i.price), priceCurrency: "MKD", availability: "https://schema.org/InStock" } }
          : {}),
      })),
    })),
  };
}

export function breadcrumbSchema(lang: Lang) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: COPY[lang].nav.home, item: abs(paths.home(lang)) },
      { "@type": "ListItem", position: 2, name: COPY[lang].nav.menu, item: abs(paths.menu(lang)) },
    ],
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
