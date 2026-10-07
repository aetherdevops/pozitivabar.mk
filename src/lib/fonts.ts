import { Cormorant_Garamond, Onest, Unbounded } from "next/font/google";

// All three ship Cyrillic glyphs (Macedonian Ѓ Ќ Ѕ Џ Ј Љ Њ are in the basic cyrillic subset).
export const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

export const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

export const fontVars = `${unbounded.variable} ${onest.variable} ${cormorant.variable}`;
