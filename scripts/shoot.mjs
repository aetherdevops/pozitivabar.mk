// Critique screenshots: node scripts/shoot.mjs <baseUrl> <path,...> [day,night] [390,1440]
// Scrolls each page top to bottom in viewport steps (so scroll reveals fire), saves contact sheets
// to design/shots/, and prints console errors + horizontal overflow per run.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const [base = "http://localhost:4311", pathsArg = "/", themesArg = "day,night", widthsArg = "390,1440"] = process.argv.slice(2);
const OUT = path.resolve("design", "shots");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const p of pathsArg.split(",")) {
  for (const theme of themesArg.split(",")) {
    for (const w of widthsArg.split(",").map(Number)) {
      const h = w < 800 ? 844 : 900;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await ctx.addInitScript((t) => {
        try {
          sessionStorage.setItem("pz-theme", t);
        } catch {}
      }, theme);
      const page = await ctx.newPage();
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(base + p, { waitUntil: "networkidle" });
      await page.waitForTimeout(1600);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      const shots = [];
      for (let y = 0; y < total; y += h) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(750);
        shots.push(await page.screenshot());
      }
      const per = w < 800 ? 4 : 2;
      const tag = `${p.replace(/\//g, "_") || "_"}-${theme}-${w}`.replace(/^_+/, "");
      for (let i = 0; i < shots.length; i += per) {
        const group = shots.slice(i, i + per);
        const sheet = sharp({ create: { width: w * per + (per - 1) * 8, height: h, channels: 3, background: "#ff00ff" } });
        await sheet
          .composite(group.map((b, k) => ({ input: b, left: k * (w + 8), top: 0 })))
          .png()
          .toFile(path.join(OUT, `${tag}-${String(i / per + 1).padStart(2, "0")}.png`));
      }
      report.push({ page: p, theme, width: w, height: total, slices: shots.length, overflow, errors });
      await ctx.close();
    }
  }
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
