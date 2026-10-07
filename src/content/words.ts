// "Зборот на денот" entries, transcribed from @pozitivabar reels (Sept 2026).
// The endings of "Диета" and "Кома" were partly cut off in the videos: confirm wording with the owner.
import type { Lang } from "@/lib/i18n";

export type Word = { word: string; syllables: string; definition: string };

export const WORDS: Record<Lang, Word[]> = {
  mk: [
    { word: "Позитива", syllables: "по·зи·ти·ва", definition: "Состојба што започнува со едно кафе и завршува со „А уште едно!“" },
    { word: "Кинг", syllables: "кинг", definition: "Човек што тргнал на кафе, а испил три Drunk Monkey коктели." },
    { word: "Диета", syllables: "ди·е·та", definition: "План што завршува во моментот кога ќе кажеш „Ај и едно благо со кафето.“" },
    { word: "Кома", syllables: "ко·ма", definition: "Состојба во која се наоѓаш пред да го испиеш првото кафе." },
  ],
  en: [
    { word: "Pozitiva", syllables: "po·zi·ti·va", definition: "A state that starts with one coffee and ends with “okay, one more!”" },
    { word: "King", syllables: "king", definition: "Someone who came in for a coffee and drank three Drunk Monkeys instead." },
    { word: "Diet", syllables: "di·et", definition: "A plan that ends the moment you say “fine, one little something sweet with my coffee.”" },
    { word: "Coma", syllables: "co·ma", definition: "The state you're in before your first coffee." },
  ],
};
