// Build-time media pipeline. Run: `npm run images`
// Reads originals from assets-src/, writes optimized derivatives to public/img and
// src/app (icons), plus a manifest consumed by the <Photo> component.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import potrace from "potrace";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "public", "img");
const MANIFEST = path.join(ROOT, "src", "content", "images.json");

await fs.mkdir(OUT, { recursive: true });

/** name -> { file, widths, crop? ({left, top, width, height} in source px) } */
const PHOTOS = {
  "hero-day": { file: "photos/hero-day-espresso-terrace.jpg", widths: [480, 720, 960, 1200] },
  "hero-night": { file: "photos/hero-night-storefront.jpg", widths: [480, 720, 960, 1200] },
  "wall-interior": { file: "photos/wall-mural-interior.jpg", widths: [640, 960, 1280, 1600] },
  "wall-mural": {
    file: "photos/wall-mural-interior.jpg",
    widths: [480, 720, 960],
    crop: { left: 0, top: 0, width: 1000, height: 1536 },
  },
  ...Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7, 8].map((i) => [`opening-${i}`, { file: `photos/opening-${i}.jpg`, widths: [400, 640, 960] }]),
  ),
  "loyalty-phone": { file: "brand/loyalty-card-phone.png", widths: [267], keyOutBackground: true },
};

/** Flood-fills the flat backdrop around a mockup (from the image edges) to transparent. */
async function keyOutBackground(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const at = (x, y) => (y * W + x) * 4;
  const bg = [data[0], data[1], data[2]];
  const dist = (i) => Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H || seen[y * W + x]) continue;
    seen[y * W + x] = 1;
    const i = at(x, y);
    const d = dist(i);
    if (d > 60) continue;
    // soft edge: fully clear the flat backdrop, fade anti-aliased fringe pixels
    data[i + 3] = d <= 10 ? 0 : Math.round(255 * Math.min(1, (d - 10) / 50));
    if (d <= 10) stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

// Optional generated drink stills (Higgsfield): assets-src/generated/cocktail-<menu id>.(jpg|png|webp)
// are picked up automatically; the Signature cards fall back to poster art without them.
try {
  for (const f of await fs.readdir(path.join(SRC, "generated"))) {
    const m = f.match(/^(cocktail-[a-z0-9-]+)\.(jpe?g|png|webp)$/i);
    if (m) PHOTOS[m[1]] = { file: `generated/${f}`, widths: [480, 720, 960] };
  }
} catch {}

const manifest = {};

for (const [name, spec] of Object.entries(PHOTOS)) {
  const input = spec.keyOutBackground ? await keyOutBackground(path.join(SRC, spec.file)) : path.join(SRC, spec.file);
  const base = () => {
    let s = sharp(input).rotate();
    if (spec.crop) s = s.extract(spec.crop);
    return s;
  };
  const meta = await base().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = meta.info;
  const widths = spec.widths.filter((w) => w <= W);
  if (!widths.length) widths.push(W);
  for (const w of widths) {
    const resized = base().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  // Tiny blurred placeholder (inline data URI) to avoid empty boxes while loading.
  const lqip = await base().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[name] = {
    width: W,
    height: H,
    widths,
    blur: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
  console.log(`photo ${name}: ${W}x${H} -> ${widths.join(", ")}`);
}

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

// ---------- Brand: avatar, icons, wordmark ----------
const POSTER = path.join(SRC, "brand", "logo-poster.jpg"); // 1440x1440

// Round badge (full ring + illustration), used in the header and JSON-LD logo.
const badgeCrop = { left: 262, top: 70, width: 970, height: 970 };
const circleMask = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);

for (const size of [96, 192, 512]) {
  const img = await sharp(POSTER).extract(badgeCrop).resize(size, size).png().toBuffer();
  const round = await sharp(img).composite([{ input: circleMask(size), blend: "dest-in" }]).png().toBuffer();
  await sharp(round).webp({ quality: 85 }).toFile(path.join(OUT, `logo-badge-${size}.webp`));
  if (size === 512) await sharp(round).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(path.join(OUT, "logo-badge-512.png"));
}

// Face crop for small icons (more legible than the full ring at 16-48px).
const faceCrop = { left: 430, top: 250, width: 600, height: 600 };
const face = (size) => sharp(POSTER).extract(faceCrop).resize(size, size);
const APP = path.join(ROOT, "src", "app");
{
  const s = 512;
  const roundIcon = await face(s)
    .png()
    .toBuffer()
    .then((b) => sharp(b).composite([{ input: circleMask(s), blend: "dest-in" }]).png().toBuffer());
  const png = { palette: true, quality: 88, compressionLevel: 9, effort: 10 };
  await sharp(roundIcon).resize(192, 192).png(png).toFile(path.join(APP, "icon.png"));
  await face(180).flatten({ background: "#0C1712" }).png(png).toFile(path.join(APP, "apple-icon.png"));
  await sharp(roundIcon).resize(192, 192).png(png).toFile(path.join(ROOT, "public", "icon-192.png"));
  await sharp(roundIcon).png(png).toFile(path.join(ROOT, "public", "icon-512.png"));
  // favicon.ico containing a single 48x48 PNG (supported by all current browsers).
  const png48 = await sharp(roundIcon).resize(48, 48).png().toBuffer();
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(48, 0);
  dir.writeUInt8(48, 1);
  dir.writeUInt8(0, 2);
  dir.writeUInt8(0, 3);
  dir.writeUInt16LE(1, 4);
  dir.writeUInt16LE(32, 6);
  dir.writeUInt32LE(png48.length, 8);
  dir.writeUInt32LE(22, 12);
  await fs.writeFile(path.join(APP, "favicon.ico"), Buffer.concat([header, dir, png48]));
}

// Wordmark "ПОЗИТИВА" + "— БАР —" traced to a single-colour SVG (fill = currentColor).
async function trace(crop, threshold, outName, turdSize = 20) {
  const buf = await sharp(POSTER)
    .extract(crop)
    .resize({ width: crop.width * 2, kernel: "lanczos3" })
    .grayscale()
    .normalise()
    .png()
    .toBuffer();
  const svg = await new Promise((resolve, reject) =>
    potrace.trace(
      buf,
      { threshold, blackOnWhite: false, turdSize, optTolerance: 0.5, color: "currentColor", background: "transparent" },
      (err, out) => (err ? reject(err) : resolve(out)),
    ),
  );
  await fs.writeFile(path.join(OUT, outName), svg);
  console.log(`traced ${outName} (${svg.length} bytes)`);
}
await trace({ left: 170, top: 1040, width: 1110, height: 210 }, 110, "wordmark.svg", 4000);
await trace({ left: 390, top: 1270, width: 660, height: 70 }, 110, "wordmark-bar.svg");

console.log("done");
