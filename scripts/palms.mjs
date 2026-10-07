// Generates public/img/palms.svg: soft palm-frond shadows for the day theme (cached static file
// instead of ~15 KB of inline path data in every page). Run: node scripts/palms.mjs
import fs from "node:fs";
import path from "node:path";

const bezier = (t, a, b, c) => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
};

/** One frond: a curved rib with paired slender leaflets, longest in the middle. */
function frond(length, curl, count = 24) {
  const a = [0, 0];
  const b = [length * 0.5, -curl];
  const c = [length, curl * 0.5];
  const f = (n) => n.toFixed(1);
  const parts = [];
  for (let i = 0; i < count; i++) {
    const t = 0.08 + (i / (count - 1)) * 0.9;
    const [x, y] = bezier(t, a, b, c);
    const [x2, y2] = bezier(Math.min(1, t + 0.01), a, b, c);
    const dir = Math.atan2(y2 - y, x2 - x);
    const len = length * 0.42 * Math.sin(Math.PI * (0.12 + 0.88 * t)) * (1 - 0.3 * t);
    const w = len * 0.085;
    for (const side of [1, -1]) {
      const ang = dir + side * (1.0 - 0.35 * t);
      const droop = Math.abs(side * len * 0.12);
      const tip = [x + Math.cos(ang) * len, y + Math.sin(ang) * len + droop];
      const mx = x + Math.cos(ang) * len * 0.5;
      const my = y + Math.sin(ang) * len * 0.5 + droop * 0.4;
      const nx = -Math.sin(ang) * w;
      const ny = Math.cos(ang) * w;
      parts.push(`M${f(x)} ${f(y)}Q${f(mx + nx)} ${f(my + ny)} ${f(tip[0])} ${f(tip[1])}Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)}Z`);
    }
  }
  parts.push(`M0 0Q${b[0]} ${b[1]} ${c[0]} ${c[1]}L${c[0]} ${c[1] + 3}Q${b[0]} ${b[1] + 3} 0 4Z`);
  return parts.join("");
}

const fronds = [
  [frond(560, 70), "translate(820 -40) rotate(142)"],
  [frond(470, 40, 22), "translate(840 120) rotate(168)"],
  [frond(420, 90, 20), "translate(700 -60) rotate(118)"],
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 760" fill="#1f4a31"><defs><filter id="s" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter></defs><g filter="url(#s)">${fronds
  .map(([d, t]) => `<path d="${d}" transform="${t}"/>`)
  .join("")}</g></svg>`;

const out = path.resolve("public", "img", "palms.svg");
fs.writeFileSync(out, svg);
console.log(`wrote ${out} (${svg.length} bytes)`);
