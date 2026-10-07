export type Lang = "mk" | "en";

export const LANGS: readonly Lang[] = ["mk", "en"];

export const paths = {
  home: (l: Lang) => (l === "mk" ? "/" : "/en/"),
  menu: (l: Lang) => (l === "mk" ? "/menu/" : "/en/menu/"),
};

export const otherLang = (l: Lang): Lang => (l === "mk" ? "en" : "mk");

export const ogLocale: Record<Lang, string> = { mk: "mk_MK", en: "en_US" };

/** "1.250" style grouping is not needed below 1000; prices stay plain integers. */
export const currency: Record<Lang, string> = { mk: "ден", en: "MKD" };
