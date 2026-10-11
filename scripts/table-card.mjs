// A6 (105 x 148 mm) table card with the menu QR: deliverables/qr/pozitiva-table-card-a6.{pdf,png}
// Run after scripts/qr.mjs.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const OUT = path.resolve("deliverables", "qr");
const qr = fs.readFileSync(path.join(OUT, "pozitiva-menu-qr.svg"), "utf8");
const strip = (f) => fs.readFileSync(path.resolve("public/img", f), "utf8").replace(/<\?xml[^>]*>/, "");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700&family=Onest:wght@500;600&family=Cormorant+Garamond:ital,wght@1,500&display=block&subset=cyrillic" rel="stylesheet">
<style>
@page{size:105mm 148mm;margin:0}
*{margin:0;box-sizing:border-box}
html,body{width:105mm;height:148mm}
body{background:#f4ecdd;color:#14271d;font-family:Onest,sans-serif;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden}
.wm{width:62mm;margin-top:11mm;color:#1f6b43}.wm svg{display:block;width:100%;height:auto}
.bar{width:36mm;margin:2mm auto 0;color:#1f6b43}.bar svg{display:block;width:100%;height:auto}
.k{margin-top:6mm;font-weight:600;font-size:8.5pt;letter-spacing:.2em;text-transform:uppercase;color:#7a5c22}
.qr{margin-top:4mm;width:56mm;padding:3mm;border-radius:6mm;background:#f4ecdd;box-shadow:0 0 0 .5mm #b08a3e}
.qr svg{display:block;width:100%;height:auto}
h1{margin-top:6mm;font-family:Unbounded;font-weight:700;font-size:15pt;letter-spacing:-.02em}
.en{margin-top:1mm;font-family:'Cormorant Garamond';font-style:italic;font-size:14pt;color:#4a5a50}
.foot{margin-top:auto;width:100%;background:#1f6b43;color:#f4ecdd;padding:4mm 6mm 4.5mm;font-size:8.5pt;font-weight:500;line-height:1.45}
.foot b{font-weight:600}
</style></head><body>
<div class="wm">${strip("wordmark.svg")}</div>
<div class="bar">${strip("wordmark-bar.svg")}</div>
<p class="k">Мени · Menu</p>
<div class="qr">${qr}</div>
<h1>Скенирај за менито</h1>
<p class="en">Scan for the menu</p>
<div class="foot"><b>Секое 10-то кафе е на нас.</b> Every 10th coffee is on us.<br>pozitivabar.mk · секој ден 08:00 до 00:00</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 397, height: 559 }, deviceScaleFactor: 1240 / 397 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(OUT, "pozitiva-table-card-a6.pdf"), width: "105mm", height: "148mm", printBackground: true });
await page.screenshot({ path: path.join(OUT, "pozitiva-table-card-a6.png") });
await browser.close();
console.log("table card written");
