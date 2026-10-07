# DESIGN.md - Позитива Бар (pozitivabar.mk)

## 0. Meta
- Project / repo: `C:\Users\altas\Projects\PozitivaBar` (Next.js 16, App Router, static export)
- Lane: **B (brand / experience)**. Two pages (home, /menu) x two languages (mk at root, en under /en).
- Live URL: https://pozitivabar.mk (hosted on zemi.mk shared hosting, NOT Vercel; static `out/` upload)
- DNA written 2026-10-07 (Claude, first build).

## 1. Subject & audience
- Subject: a new neighbourhood cafe-bar at Ѓорче Петров 3/1, Skopje. Espresso and freddo by day,
  signature cocktails by night, built around a living-wall mural of a woman with ivy for hair and
  coral round sunglasses. Opened Sept 2026.
- Audience: locals of Ѓорче Петров (opening crowd ~20-35), passers-by, and guests who scan the QR on
  the table. Arrival state: curiosity + appetite ("what is this new place, what do they pour, how much").
  Target state: "good energy, I'm going / I'm getting the loyalty card".
- Artifacts from this world that drive visual choices:
  1. The printed menu: cream paper, palm-leaf shadows, dotted price leaders, arch-topped photo frames.
  2. The bar itself: forest-green slatted bar front, green illuminated sign, artificial hedge walls on
     the terrace, gold pendant lamps, white walls, wood counter.
  3. The mural: ivy hair, coral lenses in gold round frames, gold hoops. Coral = the only hot colour.
  4. Their Instagram voice: "Не служиме лошо расположение", "Зборот на денот" dictionary jokes.

## 2. Conversion map
| Page | Single conversion action | Proof beside it |
|---|---|---|
| Home | **Get the loyalty card** (https://take.cards/lHclf) | "Секое 10-то кафе е на нас", phone mockup of the real card, 3-step how-to, QR for desktop |
| Home (secondary) | Get directions / call | live open/closed status, hours, Google 4.5 (14 reviews) |
| Menu | **Find a drink + price in under 10 s** (search, sticky tabs) | real prices in денари, ingredients for every cocktail |
| Menu (secondary) | Get the loyalty card | inline banner after coffee section |

## 3. Voice & copy rules
- Register: playful, warm, short sentences, the bar's own humour. Macedonian first (natural, correct),
  English written fresh, never word-for-word.
- Specificity sources: real prices, 08:00-24:00 every day, Ѓорче Петров 3/1, every 10th coffee free,
  Google 4.5 from 14 reviews, the opening in September 2026.
- Banned: superlatives ("најдобро кафе во Скопје", "world-class"), lorem, "Submit", stacks of "!",
  **em dashes anywhere in user-facing copy** (owner rule), emoji as icons.
- CTA verbs say what happens: "Земи ја картичката", "Види го менито", "Упатства до нас", "Јави се".

## 4. Palette (two themes, switched by `data-theme` on <html>)
DAY "Кафе преку ден" (default, also no-JS)
| Name | Hex | Role | ~Usage |
|---|---|---|---|
| paper | #F4ECDD | background | 60% |
| paper-2 | #FBF6EC | cards, surfaces | 20% |
| ink | #14271D | text (bottle-green black) | 12% |
| bar-green | #1F6B43 | brand structure, active tab, links (5.5:1 on paper) | 5% |
| coral | #E8664A | ACTION ONLY (buttons), ink text on it (4.8:1) | 3% |
| gold | #B08A3E | rings, hairlines, ornaments (never body text on paper) | decor |

NIGHT "Бар преку ноќ"
| Name | Hex | Role |
|---|---|---|
| night | #0C1712 | background |
| night-2 | #13231B | surfaces |
| cream | #F1E8D6 | text |
| gold | #D8B26A | headline accents, rings (9:1 on night) |
| neon-coral | #FF7A5C | ACTION ONLY, night text on it |
| sign-green | #2FA46A | open-now dot, small glows |

Anti-default check: cream + serif + terracotta is a known AI tell. We keep cream (it is the printed
menu) but the ink is bottle green, the accent is the mural's coral used only on actions, and the display
face is a wide geometric, not a high-contrast serif. Night is green-black (the lit sign), not pure black.

## 5. Typography
- Display: **Unbounded** (variable, latin + cyrillic). Wide, round, 70s-poster energy that still reads
  cleanly in Cyrillic. Headlines 600-800, tracking -0.02em, line-height 1.02.
- Body/UI: **Onest** (variable, Cyrillic-native grotesk). 16px mobile / 17px desktop, lh 1.6.
- Editorial accent: **Cormorant Garamond Italic** (cyrillic) for taglines, dictionary entries and
  menu sub-lines only. Echoes the logo's elegance. Never for UI controls.
- Scale: hero clamp(2.6rem, 6.4vw + .4rem, 6.25rem) / h1 clamp(2.25rem, 5vw, 4rem) /
  h2 clamp(1.8rem, 3.4vw, 3rem) / h3 1.375rem / body 1rem-1.0625rem / small .875rem /
  label .75rem uppercase Onest 600 tracking .16em.
- Prices: tabular figures (`font-variant-numeric: tabular-nums`).

## 6. Space, radius, shadow, border
- Space scale: 4 8 12 16 24 32 48 64 96 128. Sections: 72px mobile / 128px desktop.
- Container 1240px, gutters 20 / 32 / 48.
- Radius: pills (buttons, chips) 999px; cards 28px; images use the **arch** (999px 999px 28px 28px),
  lifted from the printed menu. Arches are the brand's frame; plain rectangles only in galleries.
- Shadow: day = soft warm drop (0 24px 48px -24px rgb(20 39 29 / .35)); night = gold hairline ring
  (0 0 0 1px gold/25%) + deep drop; coral glow only on hovered primary CTA at night.
- Borders: 1px ink/12% (day) or cream/12% (night). Menu rows use dotted leaders.

## 7. Motion budget
- Orchestrated moment: **"Залез" (Sunset switch)**, see section 8.
- Micro-interactions (150-300ms, springs, transform/opacity only):
  magnetic primary buttons (fine pointers only), press scale .97, wordmark letter wave on hover,
  section reveal (fade + 16px rise, 50ms stagger, once), marquee ticker (pauses on hover),
  slow palm-shadow sway (day only), dictionary card flip, cocktail card tilt + glare,
  loyalty stamps filling 1-10 when in view, open-now pulse, copy-address toast,
  menu tab pill sliding, "Изненади ме" shuffle (≤ 1.2s).
- Reduced motion: no transforms, reveals instant, theme switch instant (no circle), marquee static,
  videos show posters only.

## 8. Signature element
- **The Sunset switch.** The site is a cafe by day and a bar by night, for real: on load it reads Skopje
  time and the computed Skopje sunset; before sunset it is Day, after it is Night. A toggle in the header
  (coffee cup <-> martini, the two icons from the logo) lets anyone flip it; the new theme spreads from
  the toggle as a circular reveal (View Transitions API). Hero photo swaps (terrace espresso <-> lit
  storefront), the hero subline changes, palm shadows give way to warm bokeh.
- Everything else stays disciplined. No other full-page effects, no custom cursor, no scroll-jacking.

## 9. Component specs
- Nav: sticky, 64/72px, translucent paper or night with blur. Left: round logo 40px + "Позитива" in
  Unbounded 600. Desktop links: Мени, Лојалност, Локација. Right: MK/EN pill, Sunset toggle (44px).
  Mobile: logo, toggle, menu button -> full-screen sheet with big links + loyalty CTA.
- Hero: H1 "Не служиме лошо расположение." + faux menu line "Лошо расположение ....... 0 ден" with a
  stamp "НЕ СЕ СЛУЖИ" that lands after load. Primary CTA "Види го менито", secondary loyalty.
  Arch photo right (stacked below on mobile) with gold ring and an open-now sticker.
- Cards: cocktail card = arch top, per-drink liquid gradient, name (Unbounded), ingredient chips, price.
  Menu row = name, dotted leader, tabular price; optional italic sub-line.
- Proof module: "4,5 на Google · 14 рецензии" chip next to Directions. Real numbers only.
- CTA block (loyalty): heading "Биди дел од нашата програма за лојалност", phone image of the real card,
  stamp strip that fills to 10, 3 steps, primary button, QR for desktop visitors.
- Footer: oversized ПОЗИТИВА wordmark, tagline in Cormorant italic, address/hours/phone, IG, languages.

## 10. Asset direction
- Photography: real photos only for the venue and people (bar's own Instagram + owner's Google photo).
  Same treatment everywhere: arch masks, subtle CSS grain overlay to unify phone photos.
- Generated (Higgsfield, pending key): drink stills only, staged on the real green slatted bar or
  terrace glass table, warm practical light, 50mm, shallow depth. Never generate the venue or people.
  Note: 2 of 14 Google reviews already mock the "AI logo", so generated images must be photoreal and few.
- Icons: Phosphor (regular weight) for UI; custom SVG for cup/martini toggle.

## 11. Non-negotiables & gates
- Lighthouse mobile: perf >= 85 (target 90) / a11y >= 95 / SEO 100. 0 console errors. CLS < 0.1.
- WCAG AA contrast in BOTH themes, focus visible, tap targets >= 44px, no overflow at 360-390px.
- All copy exists in mk + en. hreflang pairs on every page. No em dashes in user-facing text.

## 12. Tailwind wiring
- `src/app/globals.css`: raw palette in `:root` / `[data-theme="night"]` as `--pz-*` variables;
  Tailwind v4 `@theme inline` maps semantic tokens: `bg`, `surface`, `ink`, `ink-soft`, `line`,
  `brand`, `gold`, `action`, `on-action`. Components use `bg-bg text-ink` etc., never raw hex.
- Fonts exposed as `--font-display`, `--font-body`, `--font-serif` -> `font-display`, `font-sans`, `font-serif`.
