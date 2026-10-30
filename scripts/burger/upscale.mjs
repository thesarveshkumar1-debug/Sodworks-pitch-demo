/**
 * Produces the @2x variants of the six layer images.
 *
 * Honest about what this is: the layers are already at their native
 * resolution — 543px wide, cut straight from a 768px-wide source composition
 * with no downsampling. Doubling them cannot invent detail that was never
 * photographed. What it does buy is control: a Lanczos resample with a
 * measured amount of sharpening looks better than leaving a browser to
 * stretch a 543px image across a 2x retina panel, and it lets srcset serve
 * the small file to phones.
 *
 * Every layer is scaled by the SAME integer factor, so the shared canvas and
 * the calibrated alignment survive exactly.
 *
 * Originals are kept in assets/burger/layers-1x/ (outside public/, so they
 * are never served).
 *
 * Usage: node scripts/burger/upscale.mjs <dir> [factor]
 */
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const [dir, factorArg] = process.argv.slice(2);
const FACTOR = Number(factorArg ?? 2);

const files = readdirSync(dir).filter((f) => f.endsWith(".webp") && !f.includes("@"));
console.log(`factor ${FACTOR}x, kernel lanczos3\n`);

for (const f of files) {
  const src = path.join(dir, f);
  const { width, height } = await sharp(src).metadata();
  const out = path.join(dir, f.replace(/\.webp$/, "@2x.webp"));

  await sharp(src)
    .resize(width * FACTOR, height * FACTOR, {
      kernel: "lanczos3",
      fit: "fill",
    })
    /* Gentle: enough to recover the bite Lanczos softens, not enough to
       ring the edges or crunch the alpha. */
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(out);

  const m = await sharp(out).metadata();
  console.log(
    `${f.replace(".webp", "").padEnd(15)} ${width}x${height} -> ${m.width}x${m.height}` +
    `  ${(statSync(out).size / 1024).toFixed(0)} KB  alpha:${m.hasAlpha}`,
  );
}
