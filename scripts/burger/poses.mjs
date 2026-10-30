/**
 * Renders the burger at several points between assembled and separated, so the
 * layer calibration can be judged in the poses the scroll sequence will use.
 *
 * Usage: node scripts/burger/poses.mjs <layersDir> <outDir> [suffix]
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [layersDir, outDir, suffix = ""] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const SCALE = 1.36;
const SPREAD = 150;              // separation per step, in reference pixels
const CW = 1000, CH = 1500;
const CENTRE_X = 500, SHIFT_Y = 330;

/* stack = burger order (0 = crown). Array order = draw order, back to front. */
const LAYOUT = [
  { file: "top-bun.png",      cy: 214, stack: 0 },
  { file: "bottom-bun.png",   cy: 600, stack: 5 },
  { file: "patty-cheese.png", cy: 474, stack: 4 },
  { file: "onion.png",        cy: 300, stack: 1 },
  { file: "tomato.png",       cy: 330, stack: 2 },
  { file: "lettuce.png",      cy: 398, stack: 3 },
];
const MID = (6 - 1) / 2;

async function measure(file) {
  const img = sharp(path.join(layersDir, file));
  const { width: w, height: h } = await img.metadata();
  const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = w, maxX = 0, minY = h, maxY = 0, sx = 0, sy = 0, n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] <= 128) continue;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    sx += x; sy += y; n++;
  }
  return { minX, minY, cx: sx / n, cy: sy / n, w: maxX - minX + 1, h: maxY - minY + 1 };
}

const cache = {};
for (const l of LAYOUT) cache[l.file] = await measure(l.file);

async function pose(t, name) {
  const comps = [];
  for (const item of LAYOUT) {
    const m = cache[item.file];
    const buf = await sharp(path.join(layersDir, item.file))
      .extract({ left: m.minX, top: m.minY, width: m.w, height: m.h })
      .resize(Math.round(m.w * SCALE), Math.round(m.h * SCALE))
      .png().toBuffer();
    const cy = item.cy + (item.stack - MID) * SPREAD * t;
    comps.push({
      input: buf,
      left: Math.round(CENTRE_X - (m.cx - m.minX) * SCALE),
      top: Math.round(cy + SHIFT_Y - (m.cy - m.minY) * SCALE),
    });
  }
  const buf = await sharp({ create: { width: CW, height: CH, channels: 4,
    background: { r: 246, g: 237, b: 224, alpha: 1 } } })
    .composite(comps).png().toBuffer();
  await sharp(buf).resize({ width: 520 }).toFile(path.join(outDir, name));
  console.log("wrote", name);
}

await pose(0,    `pose-assembled${suffix}.png`);
await pose(0.5,  `pose-mid${suffix}.png`);
await pose(1,    `pose-exploded${suffix}.png`);
