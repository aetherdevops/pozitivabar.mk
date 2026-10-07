// Search helpers: case/diacritic-insensitive, and Latin input is transliterated to Macedonian
// Cyrillic so "fredo" finds "Фредо" and "kafe" finds "Кафе".

const MULTI: [string, string][] = [
  ["dzh", "џ"],
  ["dž", "џ"],
  ["gj", "ѓ"],
  ["kj", "ќ"],
  ["zh", "ж"],
  ["ch", "ч"],
  ["sh", "ш"],
  ["dz", "џ"], // informal Latin for џ ("dzin" = џин); no drink name uses ѕ
  ["lj", "љ"],
  ["nj", "њ"],
];

const SINGLE: Record<string, string> = {
  a: "а", b: "б", v: "в", g: "г", d: "д", e: "е", z: "з", i: "и", j: "ј", k: "к", l: "л", m: "м",
  n: "н", o: "о", p: "п", r: "р", s: "с", t: "т", u: "у", f: "ф", h: "х", c: "ц", w: "в", y: "ј",
  q: "к", x: "кс", ž: "ж", č: "ч", š: "ш", ǵ: "ѓ", ḱ: "ќ",
};

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function toCyrillic(s: string): string {
  let out = s.toLowerCase();
  for (const [a, b] of MULTI) out = out.split(a).join(b);
  return out.replace(/[a-zžčšǵḱ]/g, (ch) => SINGLE[ch] ?? ch);
}

/** Returns [start, end] of the first match of any needle in the haystack, or null. */
export function findMatch(hay: string, needles: string[]): [number, number] | null {
  const h = normalize(hay);
  for (const n of needles) {
    if (!n) continue;
    const at = h.indexOf(n);
    if (at >= 0) return [at, at + n.length];
  }
  return null;
}

export function needlesFor(query: string): string[] {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];
  const q = normalize(raw);
  // Transliterate before stripping diacritics, so "džin" becomes "џин", not "дзин".
  const cyr = normalize(toCyrillic(raw));
  return cyr === q ? [q] : [q, cyr];
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when a needle appears as a whole word ("gin" in "gin, tonic" but not in "ginger"). */
export function wholeWord(hay: string, needles: string[]): boolean {
  return needles.some((n) => new RegExp(`(^|[^\\p{L}])${escapeRe(n)}([^\\p{L}]|$)`, "u").test(hay));
}
