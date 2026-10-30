/**
 * Builds the assembled burger from the six cut layers and compares it against
 * the assembled reference.
 *
 * Positions are NOT inferred from bounding boxes. LAYOUT below holds the
 * target centre of each layer in the reference's coordinate space, set by
 * eye against the reference and adjusted until the reconstruction matches.
 *
 * Usage: node scripts/burger/calibrate.mjs <layersDir> <assembled.webp> <outDir>
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [layersDir, assembledPath, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

/** Scale from the exploded source into the assembled reference's scale. */
const SCALE = 1.36;

/** Horizontal centre of the burger in the reference. */
const CENTRE_X = 686;

/**
 * Target vertical centre of each layer, in reference pixels, hand-set against
 * the reference.
 *
 * ORDER IS DRAW ORDER, back to front — and it is NOT the burger's stacking
 * order. In a real burger the fillings bulge toward the camera and hide the
 * crown's cut face, so the crown sits at the BACK even though it is the top
 * layer. Likewise the patty overhangs the heel, and the lettuce frills sit in
 * front of everything they touch.
 */
const LAYOUT = [
  { file: "top-bun.png",      cy: 214 },
  { file: "bottom-bun.png",   cy: 600 },
  { file: "patty-cheese.png", cy: 474 },
  { file: "onion.png",        cy: 300 },
  { file: "tomato.png",       cy: 330 },
  { file: "lettuce.png",      cy: 398 },
];

async function measure(file) {
  const img = sharp(path.join(layersDir, file));
  const { width: w, height: h } = await img.metadata();
  const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = w, maxX = 0, minY = h, maxY = 0, sx = 0, sy = 0, n = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] <= 128) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      sx += x; sy += y; n++;
    }
  }
  return { file, minX, maxX, minY, maxY, cx: sx / n, cy: sy / n,
           w: maxX - minX + 1, h: maxY - minY + 1 };
}

const meta = await sharp(assembledPath).metadata();
const CW = meta.width, CH = meta.height;

const composites = [];
console.log(`reference ${CW}x${CH}   scale ${SCALE}\n`);
for (const item of LAYOUT) {
  const m = await measure(item.file);
  const sw = Math.round(m.w * SCALE), sh = Math.round(m.h * SCALE);
  const buf = await sharp(path.join(layersDir, item.file))
    .extract({ left: m.minX, top: m.minY, width: m.w, height: m.h })
    .resize(sw, sh)
    .png().toBuffer();

  const left = Math.round(CENTRE_X - (m.cx - m.minX) * SCALE);
  const top  = Math.round(item.cy  - (m.cy - m.minY) * SCALE);
  composites.push({ input: buf, left, top });
  console.log(
    `${item.file.padEnd(17)} src ${String(m.w).padStart(3)}x${String(m.h).padStart(3)}` +
    ` -> ${String(sw).padStart(3)}x${String(sh).padStart(3)}  placed at (${left}, ${top})` +
    `  spans y ${top}-${top + sh}`,
  );
}

/* Reconstruction on the café cream, and on white for the overlay. */
const recon = await sharp({ create: { width: CW, height: CH, channels: 4,
  background: { r: 246, g: 237, b: 224, alpha: 1 } } })
  .composite(composites).png().toBuffer();
await sharp(recon).toFile(path.join(outDir, "reconstruction.png"));

/* 50% overlay on the reference. */
const reconTransparent = await sharp({ create: { width: CW, height: CH, channels: 4,
  background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(composites).png().toBuffer();
const half = await sharp(reconTransparent)
  .composite([{ input: Buffer.from([255, 255, 255, 128]), raw: { width: 1, height: 1, channels: 4 },
               tile: true, blend: "dest-in" }]).png().toBuffer();
await sharp(assembledPath).composite([{ input: half }]).png()
  .toFile(path.join(outDir, "overlay.png"));

/* Side by side: reference left, reconstruction right. */
const ref = await sharp(assembledPath).png().toBuffer();
const pair = await sharp({ create: { width: CW * 2, height: CH, channels: 4,
  background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: ref, left: 0, top: 0 }, { input: recon, left: CW, top: 0 }])
  .png().toBuffer();
await sharp(pair).resize({ width: 1100 }).png()
  .toFile(path.join(outDir, "side-by-side.png"));

console.log("\nwrote reconstruction.png, overlay.png, side-by-side.png");
