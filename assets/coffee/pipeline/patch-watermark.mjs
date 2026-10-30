/**
 * Paints out the generator's watermark on the café backdrop.
 *
 * It sits on the counter in the bottom-right corner. The counter runs
 * horizontally and its grain with it, so the patch is a straight horizontal
 * clone from further along the same counter — the top edge, the front face
 * and the grain all land at the same height, which an offset in any other
 * direction would break. Edges are feathered so the seam does not show.
 *
 * Usage: node scripts/coffee/patch-watermark.mjs <in> <out>
 */
import sharp from "sharp";

const [src, out] = process.argv.slice(2);

/* Tight box around the sparkle, measured off a luminance map of the corner.
   A bigger box is not safer here: the counter darkens towards the right, so
   the further the clone travels the more obvious the brightness step. */
const BOX = { x0: 1235, x1: 1325, y0: 615, y1: 710 };
/* Short hop, to keep the borrowed wood at the same brightness. */
const SHIFT = 100;
/* The counter runs diagonally — measured slope -0.143 y per x — so the clone
   has to travel ALONG the edge, not straight across it. Shifting purely
   horizontally steps the counter's edge by 14px and the join shows as a
   notch, which is exactly what the first attempt did. */
const SLOPE = -0.1429;
const DY = Math.round(-SLOPE * SHIFT);
/* Feather width, so the patch does not end on a hard line. */
const FEATHER = 14;

const img = sharp(src).ensureAlpha();
const { width: w, height: h } = await img.metadata();
const { data } = await img.raw().toBuffer({ resolveWithObject: true });
const copy = Buffer.from(data);
const at = (x, y) => (y * w + x) * 4;

for (let y = BOX.y0; y <= Math.min(h - 1, BOX.y1); y++) {
  for (let x = BOX.x0; x <= Math.min(w - 1, BOX.x1); x++) {
    const sx = x - SHIFT;
    const sy = y + DY;
    if (sx < 0 || sy < 0 || sy >= h) continue;

    /* 1 in the middle of the box, falling to 0 at its edges. */
    const dx = Math.min(x - BOX.x0, BOX.x1 - x);
    const dy = Math.min(y - BOX.y0, BOX.y1 - y);
    const k = Math.min(1, dx / FEATHER) * Math.min(1, dy / FEATHER);
    if (k <= 0) continue;

    const d = at(x, y), s = at(sx, sy);
    for (let c = 0; c < 3; c++) {
      copy[d + c] = Math.round(data[d + c] * (1 - k) + data[s + c] * k);
    }
  }
}

await sharp(copy, { raw: { width: w, height: h, channels: 4 } })
  .webp({ quality: 92, effort: 6 })
  .toFile(out);
console.log(`patched ${BOX.x1 - BOX.x0}x${BOX.y1 - BOX.y0} at (${BOX.x0}, ${BOX.y0}), cloned ${SHIFT}px left and ${DY}px down, along the counter`);
