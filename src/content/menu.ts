// Transcribed from the printed menu (photos supplied 2026-10-07). Prices in MKD (денари).
// Wine has no printed price; SHOTS was empty in print and is left out until it has items.
import type { Lang } from "@/lib/i18n";

export type L10n = Record<Lang, string>;

export type MenuItem = {
  id: string;
  name: L10n;
  price?: number;
  ingredients?: L10n;
  /** Gradient stops for the cocktail "liquid" art. */
  hue?: [string, string, string];
};

export type MenuSection = {
  id: string;
  title: L10n;
  note?: L10n;
  kind: "list" | "cocktails";
  items: MenuItem[];
};

const same = (s: string): L10n => ({ mk: s, en: s });

export const MENU: MenuSection[] = [
  {
    id: "kafe",
    title: { mk: "Кафе", en: "Coffee" },
    kind: "list",
    items: [
      { id: "espresso", name: { mk: "Еспресо", en: "Espresso" }, price: 80 },
      { id: "macchiato-small", name: { mk: "Макијато мало", en: "Macchiato, small" }, price: 90 },
      { id: "macchiato-large", name: { mk: "Макијато големо", en: "Macchiato, large" }, price: 100 },
      { id: "cappuccino", name: { mk: "Капучино", en: "Cappuccino" }, price: 120 },
      { id: "americano", name: { mk: "Американо", en: "Americano" }, price: 90 },
      { id: "latte", name: { mk: "Лате", en: "Latte" }, price: 150 },
      { id: "freddo-espresso", name: { mk: "Фредо еспресо", en: "Freddo espresso" }, price: 170 },
      { id: "freddo-cappuccino", name: { mk: "Фредо капучино", en: "Freddo cappuccino" }, price: 170 },
      { id: "nescafe", name: { mk: "Нес кафе", en: "Nescafé" }, price: 120 },
      { id: "nescafe-flavour", name: { mk: "Нес со вкус", en: "Flavoured Nescafé" }, price: 150 },
      { id: "tea", name: { mk: "Чај", en: "Tea" }, price: 100 },
      { id: "tea-rum", name: { mk: "Чај со рум", en: "Tea with rum" }, price: 110 },
      { id: "hot-chocolate", name: { mk: "Топло чоколадо", en: "Hot chocolate" }, price: 150 },
      { id: "cocoa", name: { mk: "Какао", en: "Cocoa" }, price: 100 },
    ],
  },
  {
    id: "bezalkoholni",
    title: { mk: "Безалкохолни пијалоци", en: "Soft drinks" },
    kind: "list",
    items: [
      { id: "coca-cola", name: { mk: "Кока Кола", en: "Coca-Cola" }, price: 100 },
      { id: "coca-cola-zero", name: { mk: "Кока Кола Зеро", en: "Coca-Cola Zero" }, price: 100 },
      { id: "fanta", name: { mk: "Фанта", en: "Fanta" }, price: 100 },
      { id: "sprite", name: { mk: "Спрајт", en: "Sprite" }, price: 100 },
      { id: "schweppes", name: { mk: "Швепс", en: "Schweppes" }, price: 110 },
      { id: "schweppes-tonic", name: { mk: "Швепс тоник", en: "Schweppes Tonic" }, price: 110 },
      { id: "water", name: { mk: "Вода", en: "Still water" }, price: 80 },
      { id: "sparkling-water", name: { mk: "Газирана вода", en: "Sparkling water" }, price: 80 },
      { id: "nectar", name: { mk: "Нектар негазиран сок", en: "Nectar juice, still" }, price: 120 },
    ],
  },
  {
    id: "pivo",
    title: { mk: "Пиво", en: "Beer" },
    kind: "list",
    items: [
      { id: "skopsko", name: { mk: "Скопско", en: "Skopsko" }, price: 130 },
      { id: "skopsko-smooth", name: { mk: "Скопско Smooth", en: "Skopsko Smooth" }, price: 130 },
      { id: "heineken", name: same("Heineken"), price: 150 },
      { id: "corona", name: same("Corona"), price: 160 },
    ],
  },
  {
    id: "vino",
    title: { mk: "Вино", en: "Wine" },
    note: { mk: "Прашај нѐ за денешниот избор и цената.", en: "Ask us for today's selection and price." },
    kind: "list",
    items: [
      { id: "wine-white", name: { mk: "Бело", en: "White" } },
      { id: "wine-rose", name: { mk: "Розе", en: "Rosé" } },
      { id: "wine-red", name: { mk: "Црвено", en: "Red" } },
    ],
  },
  {
    id: "zestoki",
    title: { mk: "Жестоки пијалоци", en: "Spirits" },
    note: { mk: "Цена за чаша.", en: "Price per glass." },
    kind: "list",
    items: [
      { id: "vodka", name: { mk: "Водка", en: "Vodka" }, price: 160 },
      { id: "jack-daniels", name: same("Jack Daniel's"), price: 250 },
      { id: "jameson", name: same("Jameson"), price: 200 },
      { id: "captain-morgan", name: same("Captain Morgan"), price: 160 },
      { id: "gordons", name: same("Gordon's"), price: 160 },
      { id: "jagermeister", name: same("Jägermeister"), price: 200 },
    ],
  },
  {
    id: "signature",
    title: { mk: "Signature коктели", en: "Signature cocktails" },
    kind: "cocktails",
    items: [
      {
        id: "drunk-monkey",
        name: same("Drunk Monkey"),
        price: 320,
        ingredients: { mk: "Рум, Јегермајстер, банана, ананас, ванила", en: "Rum, Jägermeister, banana, pineapple, vanilla" },
        hue: ["#F6D365", "#E6A23C", "#8C5A2B"],
      },
      {
        id: "parrots-kiss",
        name: same("Parrot's Kiss"),
        price: 320,
        ingredients: { mk: "Водка, манго, лимета, ѓумбирово пиво", en: "Vodka, mango, lime, ginger beer" },
        hue: ["#FFC86B", "#F59A3C", "#7DB24A"],
      },
      {
        id: "mamacita",
        name: same("Mamacita"),
        price: 320,
        ingredients: { mk: "Водка, јагода, кокос, лимета, боровинка", en: "Vodka, strawberry, coconut, lime, blueberry" },
        hue: ["#FFD6DE", "#F05D7E", "#6A4C9C"],
      },
      {
        id: "forest-animal",
        name: same("Forest Animal"),
        price: 320,
        ingredients: {
          mk: "Водка, маракуја, шумско овошје, лимон, сода, ванила",
          en: "Vodka, passion fruit, berries, lemon, soda water, vanilla",
        },
        hue: ["#F7B267", "#C0446B", "#4A2040"],
      },
      {
        id: "tropical-mirage",
        name: same("Tropical Mirage"),
        price: 320,
        ingredients: {
          mk: "Текила, маракуја, лимета, агава, ананас, сода, табаско",
          en: "Tequila, passion fruit, lime, agave, pineapple, soda water, tabasco",
        },
        hue: ["#FFE29A", "#FF9F45", "#D7263D"],
      },
    ],
  },
  {
    id: "klasicni",
    title: { mk: "Класични коктели", en: "Classic cocktails" },
    kind: "list",
    items: [
      { id: "gin-tonic", name: same("Gin Tonic"), price: 210, ingredients: { mk: "Џин, тоник, лимета", en: "Gin, tonic, lime" } },
      { id: "pink-gin-tonic", name: same("Pink Gin Tonic"), price: 210, ingredients: { mk: "Розов џин, тоник, бобинки", en: "Pink gin, tonic, berries" } },
      { id: "mojito", name: same("Mojito"), price: 240, ingredients: { mk: "Рум, кафеав шеќер, лимета, нане, сода", en: "Rum, brown sugar, lime, mint, soda" } },
      { id: "aperol-spritz", name: same("Aperol Spritz"), price: 240, ingredients: { mk: "Просеко, Аперол, портокал, сода", en: "Prosecco, Aperol, orange, soda" } },
      { id: "whiskey-sour", name: same("Whiskey Sour"), price: 250, ingredients: { mk: "Бурбон, сок од лимон, шеќер, ангостура", en: "Bourbon, lemon juice, sugar, Angostura" } },
      { id: "margarita", name: same("Margarita"), price: 230, ingredients: { mk: "Текила, трипл сек, лимета", en: "Tequila, triple sec, lime" } },
      { id: "bramble", name: same("Bramble"), price: 230, ingredients: { mk: "Џин, сируп од капина, сок од лимон, бобинки", en: "Gin, blackberry syrup, lemon juice, berries" } },
      { id: "old-fashioned", name: same("Old Fashioned"), price: 260, ingredients: { mk: "Бурбон, шеќер, ангостура", en: "Bourbon, sugar, Angostura" } },
      { id: "rum-old-fashioned", name: same("Rum Old Fashioned"), price: 280, ingredients: { mk: "Рум, шеќер, демерара сируп, ангостура", en: "Rum, sugar, demerara syrup, Angostura" } },
      { id: "moscow-mule", name: same("Moscow Mule"), price: 290, ingredients: { mk: "Водка, сок од лимета, ѓумбирово пиво, лимета", en: "Vodka, lime juice, ginger beer, lime" } },
    ],
  },
];

export const SIGNATURE = MENU.find((s) => s.id === "signature")!.items;

export function findItem(id: string): MenuItem | undefined {
  for (const s of MENU) for (const i of s.items) if (i.id === id) return i;
  return undefined;
}
