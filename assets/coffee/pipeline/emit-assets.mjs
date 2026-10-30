/**
 * Prepares the beach-café coffee assets.
 *
 * The backdrop ships as an opaque photograph. The machine, the stream and the
 * two glasses are keyed off their flat white backgrounds, eroded by a pixel
 * and given edge colour pulled in from opaque neighbours — the same treatment
 * the pizza needed, for the same reason: a soft edge that still carries white
 * reads as a cut-out halo once it sits on a dark scene.
 *
 * The two glasses are cropped to a SHARED box, so they overlay exactly and
 * the fill can be a simple bottom-up clip of the full one over the empty one.
 * Their saucers sit within a pixel of each other; the full glass is 20px
 * taller only because the foam dome rises above the rim, which is correct.
 *
 * Usage: node scripts/coffee/emit-assets.mjs <sourceDir> <outDir>
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const [srcDir, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

async function keyed(file) {
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
      const a = Math.max(Math.min(1, (sat - 10) / 14), Math.min(1, (242 - lum) / 14));
      if (a > 0) alpha[y * w + x] = Math.round(Math.min(1, a) * 255);
    }
  }

  const eroded = alpha.slice();
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (!alpha[p]) continue;
      let min = alpha[p];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const v = alpha[p + dy * w + dx];
          if (v < min) min = v;
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
        let sr = 0, sg = 0, sb = 0, n = 0;
        for (let dy = -3; dy <= 3; dy++)
          for (let dx = -3; dx <= 3; dx++) {
            const yy = y + dy, xx = x + dx;
            if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
            if (eroded[yy * w + xx] < 250) continue;
            const j = at(xx, yy);
            sr += data[j]; sg += data[j + 1]; sb += data[j + 2]; n++;
          }
        if (n) { out[i] = Math.round(sr/n); out[i+1] = Math.round(sg/n); out[i+2] = Math.round(sb/n); }
        else   { out[i] = data[i]; out[i+1] = data[i+1]; out[i+2] = data[i+2]; }
      }
      if (a > 128) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return { out, w, h, minX, minY, maxX, maxY };
}

const report = (name, file) => {
  const s = statSync(path.join(outDir, file)).size;
  return `${name.padEnd(13)} ${file.padEnd(20)} ${(s / 1024).toFixed(0)} KB`;
};

/* Backdrop: an ordinary photograph, no keying. */
await sharp(path.join(srcDir, "backdrop.webp"))
  .resize(1600, null, { withoutEnlargement: true })
  .webp({ quality: 78, effort: 6 }).toFile(path.join(outDir, "backdrop.webp"));
console.log(report("backdrop", "backdrop.webp"));

/* Machine and stream: cropped to their own content. */
for (const [key, file] of [["machine", "machine.webp"], ["stream", "stream.png"]]) {
  const k = await keyed(file);
  const buf = await sharp(k.out, { raw: { width: k.w, height: k.h, channels: 4 } })
    .extract({ left: k.minX, top: k.minY,
               width: k.maxX - k.minX + 1, height: k.maxY - k.minY + 1 })
    .png().toBuffer();
  await sharp(buf).webp({ quality: 86, alphaQuality: 100, effort: 6 })
    .toFile(path.join(outDir, `${key}.webp`));
  await sharp(buf).resize((k.maxX - k.minX + 1) * 2, null, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 })
    .webp({ quality: 80, alphaQuality: 100, effort: 6 })
    .toFile(path.join(outDir, `${key}@2x.webp`));
  console.log(report(key, `${key}.webp`) + `  (${k.maxX - k.minX + 1}x${k.maxY - k.minY + 1})`);
}

/* The glasses share one crop box so they overlay exactly. */
const ge = await keyed("glass-empty.webp");
const gf = await keyed("glass-full.webp");
const box = {
  left: Math.min(ge.minX, gf.minX),
  top: Math.min(ge.minY, gf.minY),
  width: Math.max(ge.maxX, gf.maxX) - Math.min(ge.minX, gf.minX) + 1,
  height: Math.max(ge.maxY, gf.maxY) - Math.min(ge.minY, gf.minY) + 1,
};
for (const [key, k] of [["glass-empty", ge], ["glass-full", gf]]) {
  const buf = await sharp(k.out, { raw: { width: k.w, height: k.h, channels: 4 } })
    .extract(box).png().toBuffer();
  await sharp(buf).webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(path.join(outDir, `${key}.webp`));
  await sharp(buf).resize(box.width * 2, null, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 })
    .webp({ quality: 82, alphaQuality: 100, effort: 6 })
    .toFile(path.join(outDir, `${key}@2x.webp`));
  console.log(report(key, `${key}.webp`));
}
console.log(`\nshared glass box ${box.width}x${box.height} at (${box.left}, ${box.top})`);
