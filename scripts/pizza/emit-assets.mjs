/**
 * Cuts the pizza layers out of their generated sources and writes the site
 * assets.
 *
 * Unlike the burger, these layers were generated separately rather than cut
 * from one composition — which is only safe because a pizza is a stack of
 * concentric discs. That makes the two kinds of drift measurable and
 * correctable: scale (how wide the disc is) and camera elevation (how squashed
 * the ellipse is). Both are normalised here against the master image.
 *
 * The sauce layer was generated but dropped: it needed a 13% vertical squash
 * to match the master, past the 10% limit where food starts to look distorted,
 * and it came back wider than the cheese meant to cover it.
 *
 * Every layer is placed at its assembled position on one shared canvas, so
 * stacking the published files at zero offset *is* the assembled pizza.
 *
 * Usage: node scripts/pizza/emit-assets.mjs <sourceDir> <outDir>
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const [srcDir, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

/** The master's ellipse aspect. Every layer is normalised to it. */
const ASPECT = 0.684;
/** The crust's width in the shared canvas; everything else is a fraction. */
const CRUST_W = 975;

const LAYERS = [
  { key: "crust",      file: "crust.webp",      stack: 2, frac: 1.00, dy:   0 },
  { key: "mozzarella", file: "mozzarella.webp", stack: 1, frac: 0.86, dy: -14 },
  { key: "toppings",   file: "toppings.webp",   stack: 0, frac: 0.74, dy: -32 },
];

/**
 * Flat white backdrop; food is anything saturated or meaningfully darker.
 *
 * The alpha is then eroded by a pixel and the edge colour pulled in from
 * opaque neighbours. Without that, the soft edge keeps pixels that are part
 * food and part white backdrop, and on the café's dark hero those read as a
 * bright outline traced round the cheese and the crust — a sticker, not food.
 */
async function key(file) {
  const img = sharp(path.join(srcDir, file)).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => (y * w + x) * 4;

  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = at(x, y);
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      const lum = (r + g + b) / 3;
      const a = Math.max(
        Math.min(1, (sat - 14) / 16),
        Math.min(1, (236 - lum) / 14),
      );
      if (a > 0) alpha[y * w + x] = Math.round(Math.min(1, a) * 255);
    }
  }

  /* Shrink by a pixel to drop the whitest of the edge ramp. */
  const eroded = alpha.slice();
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (!alpha[p]) continue;
      let min = alpha[p];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const v = alpha[p + dy * w + dx];
          if (v < min) min = v;
        }
      }
      eroded[p] = min;
    }
  }

  const out = Buffer.alloc(w * h * 4, 0);
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = eroded[y * w + x];
      if (!a) continue;
      const i = at(x, y);
      out[i + 3] = a;

      if (a >= 250) {
        out[i] = data[i]; out[i + 1] = data[i + 1]; out[i + 2] = data[i + 2];
      } else {
        /* Pull colour in from nearby opaque pixels rather than keeping the
           half-white original. Only alpha then decides how much shows. */
        let sr = 0, sg = 0, sb = 0, n = 0;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const yy = y + dy, xx = x + dx;
            if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
            if (eroded[yy * w + xx] < 250) continue;
            const j = at(xx, yy);
            sr += data[j]; sg += data[j + 1]; sb += data[j + 2]; n++;
          }
        }
        if (n) {
          out[i] = Math.round(sr / n);
          out[i + 1] = Math.round(sg / n);
          out[i + 2] = Math.round(sb / n);
        } else {
          out[i] = data[i]; out[i + 1] = data[i + 1]; out[i + 2] = data[i + 2];
        }
      }

      if (a > 128) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return { out, w, h, minX, minY, bw: maxX - minX + 1, bh: maxY - minY + 1 };
}

const prepared = [];
for (const layer of LAYERS) {
  const k = await key(layer.file);
  const sw = Math.round(CRUST_W * layer.frac);
  const sh = Math.round(sw * ASPECT);
  const buf = await sharp(k.out, { raw: { width: k.w, height: k.h, channels: 4 } })
    .extract({ left: k.minX, top: k.minY, width: k.bw, height: k.bh })
    .resize(sw, sh, { fit: "fill" })
    .png().toBuffer();
  const squash = (sh / k.bh) / (sw / k.bw);
  prepared.push({ ...layer, buf, sw, sh, squash });
  console.log(
    `${layer.key.padEnd(12)} ${k.bw}x${k.bh} -> ${sw}x${sh}  squash x${squash.toFixed(2)}`,
  );
}

/* Shared canvas: the union of every layer at its assembled position. */
const PAD = 8;
const lefts = prepared.map((p) => -p.sw / 2);
const rights = prepared.map((p) => p.sw / 2);
const tops = prepared.map((p) => p.dy - p.sh / 2);
const bottoms = prepared.map((p) => p.dy + p.sh / 2);
const CW = Math.ceil(Math.max(...rights) - Math.min(...lefts)) + PAD * 2;
const CH = Math.ceil(Math.max(...bottoms) - Math.min(...tops)) + PAD * 2;
const originX = -Math.min(...lefts) + PAD;
const originY = -Math.min(...tops) + PAD;

console.log(`\nshared canvas ${CW}x${CH}\n`);
const centres = {};
for (const p of prepared) {
  const left = Math.round(originX - p.sw / 2);
  const top = Math.round(originY + p.dy - p.sh / 2);
  const base = sharp({ create: { width: CW, height: CH, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: p.buf, left, top }]);

  const one = path.join(outDir, `${p.key}.webp`);
  await base.clone().webp({ quality: 76, alphaQuality: 100, effort: 6 }).toFile(one);

  const two = path.join(outDir, `${p.key}@2x.webp`);
  const png = await base.clone().png().toBuffer();
  await sharp(png).resize(CW * 2, CH * 2, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 })
    .webp({ quality: 70, alphaQuality: 100, effort: 6 }).toFile(two);

  centres[p.key] = (top + p.sh / 2) / CH;
  console.log(
    `${p.key.padEnd(12)} stack ${p.stack}  placed (${left}, ${top})  ` +
    `${(statSync(one).size / 1024).toFixed(0)} KB + ${(statSync(two).size / 1024).toFixed(0)} KB @2x`,
  );
}

console.log(`\ncanvas ${CW}x${CH}`);
for (const p of prepared) {
  console.log(`  ${p.key}: stack ${p.stack}, centre ${centres[p.key].toFixed(4)}`);
}
