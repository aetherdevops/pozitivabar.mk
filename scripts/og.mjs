// Renders the four 1200x630 Open Graph images (home/menu x mk/en) to public/og/.
// Needs the static export served locally: node scripts/og.mjs http://localhost:4311
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4311";
const OUT = path.resolve("public", "og");
fs.mkdirSync(OUT, { recursive: true });
const wordmark = fs.readFileSync(path.resolve("public/img/wordmark.svg"), "utf8").replace(/<\?xml[^>]*>/, "");

const T = {
  mk: {
    kicker: "Кафе преку ден · Бар преку ноќ",
    home: "Не служиме лошо расположение.",
    menu: "Мени со цени.",
    foot: "Ѓорче Петров 3/1, Скопје · секој ден 08:00 до 00:00",
    items: [["Еспресо", "80 ден"], ["Фредо еспресо", "170 ден"], ["Aperol Spritz", "240 ден"], ["Drunk Monkey", "320 ден"]],
  },
  en: {
    kicker: "Café by day · Bar by night",
    home: "We don't serve bad moods.",
    menu: "Menu & prices.",
    foot: "Gjorche Petrov 3/1, Skopje · every day 8 am to midnight",
    items: [["Espresso", "80 MKD"], ["Freddo espresso", "170 MKD"], ["Aperol Spritz", "240 MKD"], ["Drunk Monkey", "320 MKD"]],
  },
};

const html = (lang, page) => {
  const t = T[lang];
  const photo = page === "home" ? `${BASE}/img/hero-night-960.webp` : `${BASE}/video/drunk-monkey-poster.webp`;
  const body =
    page === "home"
      ? `<h1>${t.home}</h1>`
      : `<h1>${t.menu}</h1><ul>${t.items.map(([n, p]) => `<li><span>${n}</span><i></i><b>${p}</b></li>`).join("")}</ul>`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Onest:wght@500;600&family=Cormorant+Garamond:ital,wght@1,500&display=block&subset=cyrillic" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f4ecdd;color:#14271d;font-family:Onest,sans-serif;display:flex;overflow:hidden;position:relative}
.l{flex:1;padding:64px 40px 56px 72px;display:flex;flex-direction:column}
.wm{width:250px;color:#1f6b43}.wm svg{width:100%;height:auto;display:block}
.k{margin-top:34px;font-weight:600;font-size:17px;letter-spacing:.16em;text-transform:uppercase;color:#7a5c22}
h1{margin-top:18px;font-family:Unbounded;font-weight:800;font-size:${page === "home" ? 64 : 60}px;line-height:1.02;letter-spacing:-.035em}
ul{list-style:none;padding:0;margin-top:26px;width:520px}li{display:flex;align-items:baseline;font-size:24px;font-weight:500;padding:7px 0}
li i{flex:1;border-bottom:2px dotted rgba(20,39,29,.35);margin:0 12px;transform:translateY(-6px)}li b{font-family:Unbounded;font-weight:600;font-size:22px}
.f{margin-top:auto;font-family:'Cormorant Garamond';font-style:italic;font-size:27px;color:#4a5a50}
.r{width:430px;position:relative}
.arch{position:absolute;right:64px;top:54px;width:330px;height:470px;border-radius:165px 165px 26px 26px;overflow:hidden;background:#0c1712 url(${photo}) center/cover}
.ring{position:absolute;right:50px;top:68px;width:330px;height:470px;border-radius:165px 165px 26px 26px;box-shadow:inset 0 0 0 3px #b08a3e}
.badge{position:absolute;left:12px;bottom:58px;width:132px;height:132px;border-radius:50%;background:#fbf6ec url(${BASE}/img/logo-badge-192.webp) center/86% no-repeat;box-shadow:0 0 0 3px #b08a3e,0 18px 40px -16px rgba(0,0,0,.5)}
.bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:#1f6b43}
</style></head><body>
<div class="l"><div class="wm">${wordmark}</div><p class="k">${t.kicker}</p>${body}<p class="f">${t.foot}</p></div>
<div class="r"><div class="ring"></div><div class="arch"></div><div class="badge"></div></div>
<div class="bar"></div></body></html>`;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ["mk", "en"]) {
  for (const p of ["home", "menu"]) {
    await page.setContent(html(lang, p), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const file = path.join(OUT, `${p}-${lang}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 86 });
    console.log("wrote", file);
  }
}
await browser.close();
