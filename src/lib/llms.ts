// llms.txt / llms-full.txt for AI answer engines, built from src/content so prices and hours never drift.
import { COPY } from "@/content/copy";
import { MENU, SIGNATURE } from "@/content/menu";
import { PRODUCTION_URL, SITE } from "@/content/site";
import { paths, type Lang } from "./i18n";

const abs = (p: string) => `${PRODUCTION_URL}${p}`;
const price = (id: string) => MENU.flatMap((s) => s.items).find((i) => i.id === id)?.price;

function header() {
  return [
    `# ${SITE.name.mk} (${SITE.name.en})`,
    "",
    `> Neighbourhood café by day and cocktail bar by night at ${SITE.address.street.mk} (${SITE.address.street.en}), ${SITE.address.postalCode} Skopje, North Macedonia. Open every day from ${SITE.opens} to ${SITE.closes} (midnight). Opened September 2026. House motto: "${COPY.mk.hero.title.replace(/\.$/, "")}" (${COPY.en.hero.title.replace(/\.$/, "")}).`,
  ];
}

function keyFacts() {
  const classic = MENU.find((s) => s.id === "klasicni")!.items.map((i) => i.price!);
  return [
    "## Key facts",
    `- Address: ${SITE.address.street.mk}, ${SITE.address.postalCode} ${SITE.address.city.mk}, North Macedonia (${SITE.address.street.en}, ${SITE.address.city.en}). Coordinates ${SITE.geo.lat}, ${SITE.geo.lng}.`,
    `- Opening hours: Monday to Sunday, ${SITE.opens} to ${SITE.closes} (midnight).`,
    `- Phone: ${SITE.phoneIntl}`,
    `- Instagram: ${SITE.instagram}`,
    `- Google Maps: ${SITE.maps} (rated ${SITE.rating.value} from ${SITE.rating.count} reviews, October 2026)`,
    `- Amenities: ${SITE.amenities.map((a) => a.en).join("; ")}.`,
    `- Good for: morning coffee, working or studying on a laptop with free Wi-Fi, coffee on the terrace, after-work drinks, cocktails with friends, coming by with a dog.`,
    `- Prices are in Macedonian denars (MKD). Espresso ${price("espresso")} MKD, cappuccino ${price("cappuccino")} MKD, freddo espresso ${price("freddo-espresso")} MKD. Classic cocktails ${Math.min(...classic)} to ${Math.max(...classic)} MKD, signature cocktails ${SIGNATURE[0].price} MKD.`,
    `- Signature cocktails: ${SIGNATURE.map((i) => (i.id === "drunk-monkey" ? `${i.name.en} (${i.ingredients!.en}, served in a monkey-head mug)` : i.name.en)).join(", ")}.`,
    `- Loyalty program: a free digital card for Apple Wallet or Google Wallet; every 10th coffee is free. Sign up: ${SITE.loyalty}`,
    "- The interior has a mural of a woman with hair made of greenery and round coral-tinted glasses, the bar's logo character.",
  ];
}

function pages() {
  return [
    "## Pages",
    `- [Почетна (Macedonian home)](${abs(paths.home("mk"))}): about the bar, signature cocktails, loyalty card, hours and location, FAQ.`,
    `- [Мени (Macedonian menu)](${abs(paths.menu("mk"))}): full drinks menu with prices in MKD.`,
    `- [Home (English)](${abs(paths.home("en"))}): the same content in English.`,
    `- [Menu (English)](${abs(paths.menu("en"))}): full drinks menu with prices in MKD.`,
  ];
}

function menu(lang: Lang) {
  const out = [`## ${lang === "mk" ? "Мени (цени во денари)" : "Menu (prices in MKD)"}`];
  for (const s of MENU) {
    out.push("", `### ${s.title[lang]}`);
    if (s.note) out.push(s.note[lang]);
    for (const i of s.items) {
      const p = i.price ? `${i.price} ${lang === "mk" ? "ден" : "MKD"}` : lang === "mk" ? "цена на барање" : "price on request";
      out.push(`- ${i.name[lang]}: ${p}${i.ingredients ? ` (${i.ingredients[lang]})` : ""}`);
    }
  }
  return out;
}

function faq(lang: Lang) {
  const c = COPY[lang].faq;
  return [`## ${c.title}`, ...c.items.flatMap((f) => ["", `### ${f.q}`, f.a])];
}

const join = (...blocks: string[][]) => blocks.map((b) => b.join("\n")).join("\n\n") + "\n";

export function llmsTxt() {
  return join(header(), keyFacts(), pages(), [
    "## Optional",
    `- [Full details](${abs("/llms-full.txt")}): complete menu with every price in Macedonian and English, and all FAQ answers.`,
  ]);
}

export function llmsFullTxt() {
  return join(header(), keyFacts(), pages(), menu("en"), faq("en"), menu("mk"), faq("mk"));
}

export const textHeaders = { "Content-Type": "text/plain; charset=utf-8" };
