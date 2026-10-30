/**
 * Writes the six layers out as the final site assets.
 *
 * Each layer is placed at its calibrated ASSEMBLED position on one shared
 * canvas, then all six are cropped identically. Stacking the published files
 * at zero offset therefore *is* the assembled burger — the page needs no
 * per-layer offsets, only the separation it animates.
 *
 * Usage: node scripts/burger/emit-assets.mjs <layersDir> <outDir>
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [inDir, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

/* Calibration from scripts/burger/calibrate.mjs, converted out of the
   reference's scale (1.36) back into the source's own pixels. */
const SCALE = 1.36;
const CENTRE_X = 382;
const LAYOUT = [
  { file: "top-bun.png",      key: "top-bun",      cyRef: 214, stack: 0 },
  { file: "onion.png",        key: "onion",        cyRef: 300, stack: 1 },
  { file: "tomato.png",       key: "tomato",       cyRef: 330, stack: 2 },
  { file: "lettuce.png",      key: "lettuce",      cyRef: 398, stack: 3 },
  { file: "patty-cheese.png", key: "patty-cheese", cyRef: 474, stack: 4 },
  { file: "bottom-bun.png",   key: "bottom-bun",   cyRef: 600, stack: 5 },
];

async function load(file) {
  const img = sharp(path.join(inDir, file));
  const { width: w, height: h } = await img.metadata();
  const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = w, maxX = 0, minY = h, maxY = 0, sx = 0, sy = 0, n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] <= 128) continue;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    sx += x; sy += y; n++;
  }
  return { data, w, h, minX, maxX, minY, maxY, cx: sx / n, cy: sy / n };
}

const loaded = [];
for (const item of LAYOUT) loaded.push({ ...item, ...(await load(item.file)) });

/* Shift each layer so its centroid lands on the calibrated assembled spot. */
const placed = loaded.map((l) => ({
  ...l,
  dx: Math.round(CENTRE_X - l.cx),
  dy: Math.round(l.cyRef / SCALE - l.cy),
}));

const unionMinX = Math.min(...placed.map((l) => l.minX + l.dx));
const unionMaxX = Math.max(...placed.map((l) => l.maxX + l.dx));
const unionMinY = Math.min(...placed.map((l) => l.minY + l.dy));
const unionMaxY = Math.max(...placed.map((l) => l.maxY + l.dy));

const PAD = 6;
const CW = unionMaxX - unionMinX + 1 + PAD * 2;
const CH = unionMaxY - unionMinY + 1 + PAD * 2;
console.log(`shared canvas ${CW}x${CH}\n`);

for (const l of placed) {
  const src = sharp(path.join(inDir, l.file))
    .extract({ left: l.minX, top: l.minY,
               width: l.maxX - l.minX + 1, height: l.maxY - l.minY + 1 });
  const left = l.minX + l.dx - unionMinX + PAD;
  const top  = l.minY + l.dy - unionMinY + PAD;

  const out = path.join(outDir, `${l.key}.webp`);
  await sharp({ create: { width: CW, height: CH, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await src.png().toBuffer(), left, top }])
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(out);

  const { size } = await sharp(out).metadata().then(async (m) => ({ ...m,
    size: (await import("node:fs")).statSync(out).size }));
  console.log(`${l.key.padEnd(14)} stack ${l.stack}  placed (${left}, ${top})  ${(size / 1024).toFixed(0)} KB`);
}
console.log(`\nStack all six at 0,0 to get the assembled burger.`);
