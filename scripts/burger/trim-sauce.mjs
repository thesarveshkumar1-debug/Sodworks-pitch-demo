/**
 * Trims the crown's sauce spread so it stops bleeding through the lettuce.
 *
 * Only top-bun.png is touched. The heel's sauce is left alone: it is what
 * shows as a thin line under the patty in the reference, which is correct.
 *
 * The sauce is RECOLOURED to the surrounding bread tone, not deleted. The
 * crown is the backmost layer in the assembled pose, so deleting those pixels
 * would simply let the cream page background show through — just as pale as
 * the sauce, and no improvement. Recolouring also keeps the layer solid, so
 * the crown has no hole in it when the layers separate.
 *
 * Preserved: sauce near the crown's left and right silhouette edges, and the
 * drips hanging below the band.
 *
 * Usage: node scripts/burger/trim-sauce.mjs <inDir> <outDir>
 */
import sharp from "sharp";
import { mkdirSync, copyFileSync } from "node:fs";
import path from "node:path";

const [inDir, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const BAND_TOP = 236, BAND_BOTTOM = 292;  // the sauce spread across the cut face
const EDGE_KEEP = 70;                     // px of sauce kept at each outer edge
const SAUCE_LUM = 175, SAUCE_SAT = 58;

for (const f of ["onion.png", "tomato.png", "lettuce.png", "patty-cheese.png", "bottom-bun.png"]) {
  copyFileSync(path.join(inDir, f), path.join(outDir, f));
}

const src = path.join(inDir, "top-bun.png");
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const w = info.width, h = info.height;
const out = Buffer.from(data);
const at = (x, y) => (y * w + x) * 4;

const isSauce = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return (r + g + b) / 3 > SAUCE_LUM && Math.max(r, g, b) - Math.min(r, g, b) < SAUCE_SAT;
};

/* Build a sauce mask for the band first, then grow it by a few pixels: the
   anti-aliased rim where sauce meets bread is not itself "sauce" by colour,
   and leaving it behind draws a white outline around the repainted area. */
const mask = new Uint8Array(w * h);
for (let y = BAND_TOP; y <= BAND_BOTTOM; y++) {
  for (let x = 0; x < w; x++) {
    const i = at(x, y);
    if (data[i + 3] > 128 && isSauce(i)) mask[y * w + x] = 1;
  }
}
const GROW = 3;
const grown = mask.slice();
for (let y = BAND_TOP; y <= BAND_BOTTOM; y++) {
  for (let x = 0; x < w; x++) {
    if (mask[y * w + x]) continue;
    let near = false;
    for (let dy = -GROW; dy <= GROW && !near; dy++) {
      for (let dx = -GROW; dx <= GROW; dx++) {
        const yy = y + dy, xx = x + dx;
        if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
        if (mask[yy * w + xx]) { near = true; break; }
      }
    }
    if (near && data[at(x, y) + 3] > 128) grown[y * w + x] = 1;
  }
}

let recoloured = 0, kept = 0;
for (let y = BAND_TOP; y <= BAND_BOTTOM; y++) {
  let lo = null, hi = null;
  for (let x = 0; x < w; x++) {
    if (data[at(x, y) + 3] > 128) { if (lo === null) lo = x; hi = x; }
  }
  if (lo === null) continue;

  const bread = [[], [], []];
  for (let x = lo; x <= hi; x++) {
    const i = at(x, y);
    if (data[i + 3] <= 128 || grown[y * w + x]) continue;
    for (let c = 0; c < 3; c++) bread[c].push(data[i + c]);
  }
  if (bread[0].length < 20) continue;
  const med = bread.map((v) => v.sort((a, b) => a - b)[v.length >> 1]);

  const FEATHER = 26;
  for (let x = lo; x <= hi; x++) {
    const i = at(x, y);
    if (data[i + 3] <= 128 || !grown[y * w + x]) continue;

    /* Fade the repaint in over FEATHER px so the kept edge sauce blends
       into the repainted middle instead of ending on a hard line. */
    const dEdge = Math.min(x - lo, hi - x);
    if (dEdge < EDGE_KEEP) { kept++; continue; }
    const blend = Math.min(1, (dEdge - EDGE_KEEP) / FEATHER);

    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const k = Math.max(0.78, Math.min(1.18, (lum / 255) * 0.55 + 0.62));
    for (let c = 0; c < 3; c++) {
      const target = Math.max(0, Math.min(255, Math.round(med[c] * k)));
      out[i + c] = Math.round(data[i + c] * (1 - blend) + target * blend);
    }
    recoloured++;
  }
}

await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(outDir, "top-bun.png"));

console.log(`crown sauce: ${recoloured} px repainted as bread, ${kept} px kept at edges/drips`);
