// Smoke test of the interactive bits against the static export: npm run smoke (needs npm run preview)
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4311";
const b = await chromium.launch();
const errors = [];
const ok = (cond, msg) => console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`) || (cond ? 0 : (process.exitCode = 1));

// ---- menu (mobile) ----
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const p = await ctx.newPage();
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(BASE + "/menu/", { waitUntil: "networkidle" });

const visibleItems = () => p.$$eval("[data-menu-item]", (els) => els.filter((e) => !e.hidden).length);
const total = await visibleItems();
ok(total === 51, `menu renders all items without JS filtering (${total})`);

await p.fill("#menu-search", "fredo");
await p.waitForTimeout(150);
const fredo = await p.$$eval("[data-menu-item]:not([hidden]) [data-hl]", (els) => els.map((e) => e.textContent));
ok(fredo.length >= 2 && fredo.every((t) => /Фредо/i.test(t)), `Latin "fredo" finds Фредо items: ${fredo.join(", ")}`);
ok((await p.$$eval("mark", (m) => m.length)) >= 2, "matches are highlighted with <mark>");

await p.fill("#menu-search", "džin");
await p.waitForTimeout(150);
const gin = await visibleItems();
ok(gin >= 3, `"džin" finds gin drinks via ingredients (${gin})`);
await p.fill("#menu-search", "kafe");
await p.waitForTimeout(150);
ok((await visibleItems()) >= 14, `Latin "kafe" finds the coffee section (${await visibleItems()})`);

await p.fill("#menu-search", "zzzz");
await p.waitForTimeout(150);
ok(!(await p.$eval("[data-menu-empty]", (e) => e.hidden)), "empty state shows for no results");
ok(await p.$eval("[data-menu-promo]", (e) => e.hidden), "loyalty banner hides while searching");

await p.click('button[aria-label="Исчисти пребарување"]');
await p.waitForTimeout(150);
ok((await visibleItems()) === total, "clear restores the full menu");
ok((await p.$$eval("mark", (m) => m.length)) === 0, "clear removes highlights");

await p.click('button[aria-label="Изненади ме"]');
await p.waitForTimeout(1800);
const pick = await p.$eval('[role="status"] .font-display', (e) => e.textContent).catch(() => null);
ok(!!pick, `surprise me lands on a drink: ${pick}`);
await p.click('text=Покажи во менито');
await p.waitForTimeout(900);
ok((await p.$$eval("[data-flash]", (e) => e.length)) === 1, "picked drink is highlighted in the menu");

// tabs follow scrolling
await p.evaluate(() => document.getElementById("signature").scrollIntoView());
await p.waitForTimeout(900);
const cur = await p.$eval('[data-tab][aria-current="true"]', (e) => e.dataset.tab).catch(() => null);
ok(cur === "signature", `active tab follows scroll (${cur})`);

// theme switch (scroll up first: the header tucks away while scrolling down)
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(500);
const before = await p.$eval("html", (h) => h.dataset.theme);
await p.click('button[role="switch"]');
await p.waitForTimeout(1000);
const after = await p.$eval("html", (h) => h.dataset.theme);
ok(before !== after, `theme switch flips ${before} -> ${after}`);
ok((await p.$eval('button[role="switch"]', (e) => e.getAttribute("aria-checked"))) === String(after === "night"), "switch aria-checked matches theme");

// mobile nav
await p.click('button[aria-label="Отвори навигација"]');
await p.waitForTimeout(300);
ok(await p.$eval("#mobile-nav", (e) => !e.hidden), "mobile nav opens");
await p.keyboard.press("Escape");
await p.waitForTimeout(200);
ok(await p.$eval("#mobile-nav", (e) => e.hidden), "Escape closes mobile nav");
await ctx.close();

// English menu: "gin" means gin drinks (whole word), "ginger" still finds ginger beer.
const e = await b.newPage({ viewport: { width: 390, height: 844 } });
await e.goto(BASE + "/en/menu/", { waitUntil: "networkidle" });
await e.fill("#menu-search", "gin");
await e.waitForTimeout(150);
const ginEn = await e.$$eval("[data-menu-item]:not([hidden])", (els) => els.map((x) => x.querySelector("[data-hl]").textContent));
ok(ginEn.length === 3 && !ginEn.some((t) => /Mule|Parrot/.test(t)), `EN "gin" -> ${ginEn.join(", ")}`);
await e.fill("#menu-search", "ginger");
await e.waitForTimeout(150);
const ginger = await e.$$eval("[data-menu-item]:not([hidden])", (els) => els.map((x) => x.querySelector("[data-hl]").textContent));
ok(ginger.length === 2, `EN "ginger" -> ${ginger.join(", ")}`);
await e.close();

// ---- home (desktop) ----
const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
d.on("console", (m) => m.type() === "error" && errors.push(m.text()));
d.on("pageerror", (e) => errors.push(String(e)));
await d.goto(BASE + "/en/", { waitUntil: "networkidle" });
const w1 = await d.$eval("#words-title", (e) => e.closest("section").querySelector(".font-display.uppercase")?.textContent);
await d.click("text=Next word");
await d.waitForTimeout(800);
const w2 = await d.$eval("#words-title", (e) => e.closest("section").querySelector(".font-display.uppercase")?.textContent);
ok(w1 && w2 && w1 !== w2, `word of the day advances: ${w1} -> ${w2}`);
ok((await d.$eval('a[hreflang="mk"]', (a) => a.getAttribute("href"))) === "/", "language switch links to the Macedonian page");
const status = await d.$eval(".live-dot", (e) => e.parentElement.textContent);
ok(/Open now|Closed/.test(status), `live status computed: ${status.trim()}`);
await d.close();

ok(errors.length === 0, `no console errors${errors.length ? ": " + errors.join(" | ") : ""}`);
await b.close();
