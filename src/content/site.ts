// Verified business facts (Google Business Profile + Instagram, checked 2026-10-07).

export const PRODUCTION_URL = "https://pozitivabar.mk";

// Build-time site address. Unset = production (pozitivabar.mk). A staging build sets
// NEXT_PUBLIC_SITE_URL (e.g. https://pozitivabar.vercel.app): share previews and canonicals then
// point at the staging host, and every page is marked noindex.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL).replace(/\/+$/, "");
export const IS_PRODUCTION = siteUrl === PRODUCTION_URL;

export const SITE = {
  url: siteUrl,
  name: { mk: "Позитива Бар", en: "Pozitiva Bar" },
  phone: "+38975386266",
  phoneDisplay: "075 386 266",
  phoneIntl: "+389 75 386 266",
  address: {
    street: { mk: "Ѓорче Петров 3/1", en: "Gjorche Petrov 3/1" },
    city: { mk: "Скопје", en: "Skopje" },
    postalCode: "1000",
    country: "MK",
  },
  geo: { lat: 42.0069912, lng: 21.3663834 },
  // Same hours every day.
  opens: "08:00",
  closes: "00:00",
  instagram: "https://www.instagram.com/pozitivabar/",
  instagramHandle: "@pozitivabar",
  maps: "https://maps.google.com/?cid=5061748113390125551",
  directions: "https://www.google.com/maps/dir/?api=1&destination=42.0069912%2C21.3663834",
  mapEmbed: "https://maps.google.com/maps?q=42.0069912,21.3663834&z=17&output=embed",
  loyalty: "https://take.cards/lHclf",
  rating: { value: 4.5, count: 14 },
  openedIn: "2026-09",
  // Confirmed by the owner 2026-10-11. Reservations and smoking are unconfirmed: keep them out.
  amenities: [
    { id: "wifi", mk: "Бесплатен Wi-Fi", en: "Free Wi-Fi" },
    { id: "laptop", mk: "Погодно за работа со лаптоп", en: "Laptop friendly" },
    { id: "terrace", mk: "Тераса", en: "Outdoor terrace seating" },
    { id: "pets", mk: "Милениците се добредојдени", en: "Pets welcome" },
    { id: "cards", mk: "Плаќање во готово или со картичка", en: "Cash and card payments accepted" },
  ],
} as const;

export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 24;
