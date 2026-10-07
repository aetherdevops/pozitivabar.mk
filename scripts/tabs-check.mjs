// Menu tab taps on a phone: prints bar/heading/pill positions per tap + contact sheets. npm run tabs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://localhost:4311";
const OUT = path.resolve(process.argv[3] ?? "design/shots");
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
});
await ctx.addInitScript(() => sessionStorage.setItem("pz-theme", "night"));
const p = await ctx.newPage();
await p.goto(BASE + "/menu/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);

const state = async (label) => {
  const s = await p.evaluate(() => {
    const bar = document.querySelector(".menu-bar").getBoundingClientRect();
    const header = document.querySelector("header").getBoundingClientRect();
    const cur = document.querySelector('[data-tab][aria-current="true"]')?.dataset.tab;
    const pill = document.querySelector(".menu-bar ul > span");
    const pr = pill.getBoundingClientRect();
    const tab = document.querySelector(`[data-tab="${cur}"]`)?.getBoundingClientRect();
    const target = location.hash ? document.querySelector(location.hash) : null;
    const h2 = target?.querySelector("h2")?.getBoundingClientRect();
    return {
      y: Math.round(scrollY),
      hash: location.hash,
      header: { top: Math.round(header.top), bottom: Math.round(header.bottom), hidden: document.querySelector("header").dataset.hidden },
      bar: { top: Math.round(bar.top), bottom: Math.round(bar.bottom) },
      active: cur,
      pill: { left: Math.round(pr.left), width: Math.round(pr.width), opacity: getComputedStyle(pill).opacity },
      activeTab: tab ? { left: Math.round(tab.left), width: Math.round(tab.width) } : null,
      targetH2Top: h2 ? Math.round(h2.top) : null,
      focus: document.activeElement?.dataset?.tab ?? document.activeElement?.tagName,
    };
  });
  console.log(label.padEnd(18), JSON.stringify(s));
  return s;
};

const shots = [];
const snap = async (label) => {
  await state(label);
  shots.push(await p.screenshot());
};

await snap("start");
for (const id of ["pivo", "signature", "bezalkoholni", "klasicni", "kafe"]) {
  await p.tap(`[data-tab="${id}"]`);
  await p.waitForTimeout(150);
  await snap(`tap ${id} +150ms`);
  await p.waitForTimeout(900);
  await snap(`tap ${id} +1s`);
}

// contact sheet (scaled to 1x, 6 per row)
const small = await Promise.all(shots.map((s) => sharp(s).resize(390).png().toBuffer()));
const per = 6;
for (let i = 0; i < small.length; i += per) {
  const g = small.slice(i, i + per);
  await sharp({ create: { width: 390 * per + 8 * (per - 1), height: 844, channels: 3, background: "#ff00ff" } })
    .composite(g.map((buf, k) => ({ input: buf, left: k * 398, top: 0 })))
    .png()
    .toFile(path.join(OUT, `tabs-repro-${i / per + 1}.png`));
}
await b.close();
