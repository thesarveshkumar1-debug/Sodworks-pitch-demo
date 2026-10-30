/**
 * Measures the coffee assets' real geometry — the numbers in
 * src/data/coffee-layout.ts come from here, not from the canvas sizes.
 *
 * The canvas tells you nothing useful: every asset is cropped to its own
 * content, so "50% of the canvas" is not the middle of the cup. The first
 * version of the scene placed the pour by eye off canvas percentages and it
 * landed ~31px left of the opening and stopped at the rim.
 *
 * Usage: node scripts/coffee/measure.mjs
 */
import sharp from "sharp";

const px = (b, w, x, y) => {
  const i = (y * w + x) * 4;
  return [b[i], b[i + 1], b[i + 2], b[i + 3]];
};

const glass = await sharp("public/coffee/glass-full.webp")
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const empty = await sharp("public/coffee/glass-empty.webp")
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = glass.info.width, h = glass.info.height;

/* Window the search to the bowl: wider than this and the saucer and the
   handle get counted, which drags the centre to the right. */
const X0 = 190, X1 = 850;
const rows = [];
for (let y = 0; y < h; y++) {
  let lo = null, hi = null, c = 0;
  for (let x = X0; x <= X1; x++) {
    const p = px(glass.data, w, x, y);
    if (p[3] < 150) continue;
    const sat = Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]);
    if (p[0] - p[2] < 34 || sat < 40) continue;
    c++; if (lo === null) lo = x; hi = x;
  }
  if (c > 110) rows.push([y, lo, hi]);
}

const top = rows[0], bottom = rows[rows.length - 1];
const mid = rows[Math.floor(rows.length / 2)];

console.log(`glass canvas ${w}x${h}`);
console.log(`  pourCentre     ${((mid[1] + mid[2]) / 2 / w).toFixed(3)}  (fraction of canvas width)`);
console.log(`  fullSurface    ${(top[0] / h).toFixed(3)}  (finished drink's surface)`);
console.log(`  interiorBottom ${(bottom[0] / h).toFixed(3)}  (inside base of the bowl)`);

let rimY = null;
for (let y = 0; y < h; y++) {
  let c = 0;
  for (let x = 0; x < w; x++) if (px(empty.data, w, x, y)[3] > 140) c++;
  if (c > 260) { rimY = y; break; }
}
console.log(`  rim           ${(rimY / h).toFixed(3)}  (for reference only — its midpoint`);
console.log(`                       is skewed right by the handle, so the pour`);
console.log(`                       must use pourCentre instead)`);
