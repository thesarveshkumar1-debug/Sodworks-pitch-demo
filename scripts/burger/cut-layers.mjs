/**
 * Cuts the six burger layers out of the exploded composition.
 *
 * Every layer is written on the SAME full-size canvas at the exact position it
 * occupies in the source, so the six are registered to each other by
 * construction. Nothing is moved, scaled or rotated here.
 *
 * Keying: the source has a light grey gradient background, not flat white, so
 * a plain luminance key eats pale subjects (the onion flesh and the white
 * sauce both sit within ~10 levels of the backdrop). Measured on this image,
 * the backdrop holds saturation 4-7 everywhere while even the palest food is
 * 8+, so SATURATION is the primary key and luminance deviation only catches
 * neutral-but-bright things like the sauce highlights.
 *
 * Usage: node scripts/burger/cut-layers.mjs <exploded.webp> <outDir>
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [src, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

/* Cut lines sit in the middle of each measured empty gap. */
const BANDS = [
  /* sat0/sat1 are per layer. The source has a pale bloom baked around every
     component where it meets the backdrop — opaque, bright, and desaturated.
     Strongly coloured layers can afford a high saturation floor that cuts
     past it; the onion and the buns are pale themselves and cannot. */
  { file: "top-bun.png",      top:    0, bottom:  342, sat0: 12, sat1: 28 },
  { file: "onion.png",        top:  343, bottom:  461, sat0:  7, sat1: 16 },
  { file: "tomato.png",       top:  462, bottom:  615, sat0: 38, sat1: 64 },
  { file: "lettuce.png",      top:  616, bottom:  766, sat0: 46, sat1: 78 },
  { file: "patty-cheese.png", top:  767, bottom: 1027, sat0: 34, sat1: 58 },
  // Clamped: the source has a soft shadow and a watermark below and right of
  // the heel, which must not be cut into the layer.
  { file: "bottom-bun.png",   top: 1028, bottom: 1226, maxX: 665, sat0: 12, sat1: 28 },
];

const SAT0 = 7,  SAT1 = 16;   // backdrop measures 4-7; palest food measures 8+
/* The source has a soft light glow baked around every component, sitting at
   luminance deviation 16-20 with almost no saturation. Keeping DEV0 above it
   stops that glow being keyed in as a white rim; genuinely neutral-but-bright
   food (the sauce, deviation 40+) is caught by saturation instead. */
const DEV0 = 26, DEV1 = 44;
const MIN_BLOB = 160;         // drop keying specks smaller than this

const img = sharp(src).ensureAlpha();
const { width: w, height: h } = await img.metadata();
const { data } = await img.raw().toBuffer({ resolveWithObject: true });
const at = (x, y) => (y * w + x) * 4;
const ramp = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));

/** Remove small disconnected specks of keyed-in background. */
function despeckle(alpha) {
  const seen = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) {
    if (seen[p] || alpha[p] <= 64) continue;
    const blob = [p];
    seen[p] = 1;
    const stack = [p];
    while (stack.length) {
      const q = stack.pop();
      const qx = q % w, qy = (q / w) | 0;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = qx + dx, ny = qy + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (seen[n] || alpha[n] <= 64) continue;
        seen[n] = 1; blob.push(n); stack.push(n);
      }
    }
    if (blob.length < MIN_BLOB) for (const q of blob) alpha[q] = 0;
  }
}

/**
 * Shrink the alpha by one pixel.
 *
 * The key leaves a one-to-two pixel rim of partially transparent pixels that
 * still carry the pale backdrop colour. Composited onto the café's cream that
 * rim reads as a white outline, like a sticker. Eroding removes it.
 */
function erode(alpha, top, bottom) {
  const src = alpha.slice();
  for (let y = Math.max(1, top); y <= Math.min(h - 2, bottom); y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (!src[p]) continue;
      let min = src[p];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const v = src[p + dy * w + dx];
          if (v < min) min = v;
        }
      }
      alpha[p] = min;
    }
  }
}

/**
 * Push opaque colour outwards into the soft edge.
 *
 * A partly transparent edge pixel still holds the colour it had in the source,
 * which is part food and part pale backdrop. Composited, that reads as a light
 * rim. Un-mixing it arithmetically does not work — dividing by a small alpha
 * amplifies sensor noise straight to white, which is exactly the halo it was
 * meant to remove. Copying colour from nearby opaque pixels is stable: only
 * the alpha then decides how much of the real food colour shows.
 */
function extendEdgeColour(out, alpha, top, bottom) {
  const R = 3;
  for (let y = Math.max(0, top); y <= Math.min(h - 1, bottom); y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      const a = alpha[p];
      if (a === 0 || a >= 250) continue;
      let sr = 0, sg = 0, sb = 0, n = 0;
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const yy = y + dy, xx = x + dx;
          if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
          if (alpha[yy * w + xx] < 250) continue;
          const j = at(xx, yy);
          sr += out[j]; sg += out[j + 1]; sb += out[j + 2]; n++;
        }
      }
      if (!n) continue;
      const i = at(x, y);
      out[i] = Math.round(sr / n);
      out[i + 1] = Math.round(sg / n);
      out[i + 2] = Math.round(sb / n);
    }
  }
}

function makeLayer({ top, bottom, maxX, sat0 = SAT0, sat1 = SAT1 }) {
  const alpha = new Uint8Array(w * h);

  for (let y = top; y <= bottom && y < h; y++) {
    const l = at(3, y), r = at(w - 4, y);
    for (let x = 0; x < w; x++) {
      if (maxX !== undefined && x > maxX) continue;
      const t = x / (w - 1);
      const i = at(x, y);
      const R = data[i], G = data[i + 1], B = data[i + 2];

      const sat = Math.max(R, G, B) - Math.min(R, G, B);
      const dev = Math.max(
        Math.abs(R - (data[l]     + (data[r]     - data[l])     * t)),
        Math.abs(G - (data[l + 1] + (data[r + 1] - data[l + 1]) * t)),
        Math.abs(B - (data[l + 2] + (data[r + 2] - data[l + 2]) * t)),
      );

      const a = Math.max(ramp(sat, sat0, sat1), ramp(dev, DEV0, DEV1));
      if (a > 0) alpha[y * w + x] = Math.round(a * 255);
    }
  }

  despeckle(alpha);
  erode(alpha, top, bottom);

  const out = Buffer.alloc(w * h * 4, 0);
  let minX = w, maxXSeen = 0, minY = h, maxYSeen = 0, count = 0, sumX = 0, sumY = 0;
  for (let y = top; y <= bottom && y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = alpha[y * w + x];
      if (!a) continue;
      const i = at(x, y);
      out[i + 3] = a;

      out[i] = data[i]; out[i + 1] = data[i + 1]; out[i + 2] = data[i + 2];
      if (a > 128) {
        if (x < minX) minX = x;
        if (x > maxXSeen) maxXSeen = x;
        if (y < minY) minY = y;
        if (y > maxYSeen) maxYSeen = y;
        sumX += x; sumY += y; count++;
      }
    }
  }
  extendEdgeColour(out, alpha, top, bottom);

  return { out, minX, maxX: maxXSeen, minY, maxY: maxYSeen, count,
           cx: sumX / count, cy: sumY / count };
}

console.log(`source ${w}x${h}\n`);
for (const band of BANDS) {
  const r = makeLayer(band);
  await sharp(r.out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, band.file));
  console.log(
    `${band.file.padEnd(17)} x ${String(r.minX).padStart(3)}-${String(r.maxX).padStart(3)}` +
    `  y ${String(r.minY).padStart(4)}-${String(r.maxY).padStart(4)}` +
    `  w=${String(r.maxX - r.minX + 1).padStart(3)} h=${String(r.maxY - r.minY + 1).padStart(3)}` +
    `  centre x=${r.cx.toFixed(1)} y=${r.cy.toFixed(1)}  px=${r.count}`,
  );
}
