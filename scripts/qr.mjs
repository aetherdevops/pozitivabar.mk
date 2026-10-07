// Print-ready QR codes for the table menu, written to deliverables/qr/.
//   node scripts/qr.mjs            -> menu QR (branded + plain), SVG + 2048px PNG, then verifies they decode
import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";
import jsQR from "jsqr";

const URL = "https://pozitivabar.mk/menu/";
const OUT = path.resolve("deliverables", "qr");
fs.mkdirSync(OUT, { recursive: true });

const INK = "#14271D";
const PAPER = "#F4ECDD";
const GOLD = "#B08A3E";

// Face crop (no gold ring): the ring badge reads as a false finder pattern to some decoders.
const badge = fs.readFileSync(path.resolve("src/app/icon.png")).toString("base64");

function svgFor({ withLogo }) {
  const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const q = 4; // quiet zone in modules
  const size = n + q * 2;
  const isFinder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const c = n / 2;
  const logoR = withLogo ? n * 0.11 : 0; // clear disc radius in modules
  const inLogo = (x, y) => withLogo && Math.hypot(x + 0.5 - c, y + 0.5 - c) < logoR + 1.2;

  let rects = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!qr.modules.get(x, y) || isFinder(x, y) || inLogo(x, y)) continue;
      rects += `<rect x="${x + q}" y="${y + q}" width="1.02" height="1.02"/>`;
    }
  }
  const eye = (x, y) =>
    `<rect x="${x + q + 0.5}" y="${y + q + 0.5}" width="6" height="6" rx="1.6" fill="none" stroke="${INK}" stroke-width="1"/>` +
    `<rect x="${x + q + 2}" y="${y + q + 2}" width="3" height="3" rx="0.8" fill="${INK}"/>`;
  const logo = withLogo
    ? `<circle cx="${c + q}" cy="${c + q}" r="${logoR + 0.5}" fill="${PAPER}" stroke="${GOLD}" stroke-width="0.35"/>` +
      `<image href="data:image/png;base64,${badge}" x="${c + q - logoR}" y="${c + q - logoR}" width="${logoR * 2}" height="${logoR * 2}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="QR: ${URL}">
<rect width="${size}" height="${size}" fill="${PAPER}"/>
<g fill="${INK}">${rects}</g>${eye(0, 0)}${eye(n - 7, 0)}${eye(0, n - 7)}${logo}</svg>`;
}

for (const variant of [
  { name: "pozitiva-menu-qr", withLogo: true },
  { name: "pozitiva-menu-qr-plain", withLogo: false },
]) {
  const svg = svgFor(variant);
  fs.writeFileSync(path.join(OUT, `${variant.name}.svg`), svg);
  const pngPath = path.join(OUT, `${variant.name}.png`);
  await sharp(Buffer.from(svg), { density: 600 }).resize(2048, 2048).png().toFile(pngPath);

  // Verify at camera-realistic sizes (jsQR itself is unreliable above ~1500px, even on a plain code).
  for (const px of [300, 600, 1000]) {
    const { data, info } = await sharp(pngPath).resize(px, px).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const res = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    console.log(`${variant.name} @${px}px ->`, res ? res.data : "NOT DECODED");
    if (!res || res.data !== URL) process.exitCode = 1;
  }
}
