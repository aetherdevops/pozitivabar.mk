# Critique pass log

Tooling: `npm run preview` (static export on :4311), `npm run shoot -- / day,night 390,1440`
(contact sheets in design/shots), `npm run smoke` (interaction test), Lighthouse mobile.

## Pass 1 (2026-10-07)
Findings
- BLOCKER: hero H1 "расположение" (Unbounded is wide) overflowed 390 px and widened the whole hero
  column, clipping the sub copy and the faux menu card. Same on 1440 (ran under the photo).
- BLOCKER: horizontal page overflow from the tilted marquee band.
- FIX: 4 console 404s per page: Next link prefetch requests flat `__next.*.txt` names while the export
  writes folders; would fail on any static host.
- FIX: rubber stamp covered the "Лошо расположение" text.
- FIX: loyalty phone mockup had an opaque light backdrop (white box on the green band).
- FIX: gallery header misaligned (max-w-3xl replaced the container width).
- POLISH: dictionary card had a stray decorative quote glyph and too much empty height on mobile.
Fixes: hero scale clamp(2rem, 4.6vw+.4rem, 4.2rem) + min-w-0 grid columns; marquee wrapped in
overflow-x: clip; next/link replaced by plain anchors (MPA, no RSC prefetch); stamp moved; backdrop
flood-filled to transparent in the image pipeline; container fix; glyph removed.
Refinement: React effects that set state on mount moved to useSyncExternalStore (lint-clean, no
hydration mismatch for time-based values).

## Pass 2
Findings
- BLOCKER: menu tab pill measured offsetLeft against the <li> (relative), so it sat under the wrong tab.
- FIX: mobile floating "Изненади ме" button covered prices.
- POLISH: stamp still overlapped the price on mobile.
Fixes: li no longer positioned; dice button moved into the sticky search row; stamp sits on the card
corner like a real stamp.
Refinement: OG images (4) rendered from an HTML template with real fonts and photos.

## Pass 3 (performance)
Lighthouse mobile, home: perf 76, LCP 4.5 s. Causes found: 2.4 s style/layout on an 11k px page,
hero LCP image lazy + late, video posters fetched eagerly, inline SVG wordmark (19 KB x2 in HTML+RSC).
Fixes: content-visibility:auto on below-fold sections; theme-aware hero preload in the pre-paint
script + promote the visible hero image to eager; posters attached near viewport; wordmark as cached
CSS mask; palm shadows as a cached SVG file; experimental inlineCss tried and reverted (it duplicated
65 KB of CSS into the RSC payload with no FCP gain).
Menu: rebuilt as server-rendered HTML (MenuList) + small client controls (MenuControls) instead of a
fully hydrated client list. Works without JS.
Refinement: search understands Latin input ("fredo", "kafe", "džin") and prefers whole words
("gin" no longer matches "ginger beer").

## Gates (final run)
- Console errors: 0 on all pages, both themes (shoot + smoke runs).
- Horizontal overflow at 390: none.
- Lighthouse mobile (simulated, varies +/-5 between runs): accessibility 100, best practices 100,
  SEO 100 on every page; performance home 84-90, menu 84-88, EN menu 88; CLS 0 everywhere.
- Interaction smoke test: 22/22 pass.
