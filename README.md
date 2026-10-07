# Позитива Бар website (pozitivabar.mk)

Two pages, two languages, one café-by-day / bar-by-night:

| Route | Page |
|---|---|
| `/` , `/en/` | Home: hero, day/night shifts, signature cocktails, loyalty card, the mural, "word of the day", opening-night gallery, visit info, FAQ |
| `/menu/` , `/en/menu/` | Full menu with prices (target of the table QR code): search, category tabs, "surprise me" |

Next.js 16 (App Router) static export -> plain files in `out/`, hosted on zemi.mk (see `DEPLOY.md`).
Design system and decisions: `design/DESIGN.md`. Critique log: `design/PASSLOG.md`.

## Commands
```
npm run dev        # local dev server
npm run build      # static export to out/
npm run preview    # serve out/ on http://localhost:4311
npm run images     # rebuild optimized images, icons, traced wordmark, palm shadows (from assets-src/)
npm run og         # re-render the 4 Open Graph images (needs preview running)
npm run qr         # menu QR codes + A6 table card in deliverables/qr/ (verifies they decode)
npm run shoot      # screenshot contact sheets to design/shots/ (needs preview running)
npm run smoke      # interaction smoke test (needs preview running)
npm run lint
```

## Where things live
- `src/content/menu.ts`: every drink, MK + EN, prices in MKD. **Edit prices here.**
- `src/content/copy.ts`: all UI text, MK + EN (house rule: no em dashes in site copy).
- `src/content/site.ts`: address, phone, hours, links (Instagram, Maps, loyalty card).
- `src/content/words.ts`: "Зборот на денот" entries from the bar's Instagram reels.
- `assets-src/`: original photos/videos (bar's Instagram + owner's Google photo) and brand sources.
- `src/lib/themeScript.ts`: pre-paint script; day/night follows the real Skopje sunset.

## Notes
- Day/night: before sunset = cafe (cream), after = bar (deep green + gold); the visitor's toggle wins for
  the browser session. No flash: the theme is set before first paint.
- Links are plain `<a>` (full page loads) on purpose: on static hosting this avoids Next's RSC prefetch
  requests, and MK/EN are separate root layouts anyway.
- Generated drink photos (Higgsfield) are optional: see `design/IMAGE-PROMPTS.md`.
