/**
 * Emits the café room backdrops served behind the burger and pizza sequences.
 *
 * Both rooms are photographs, and both are blurred in CSS rather than here —
 * see the rule in CLAUDE.md. That decides the one thing worth deciding in
 * this script: resolution.
 *
 * The sources are ~735px wide and the backdrop fills the viewport, so on a
 * 1440px desktop one source pixel covers about two CSS pixels. The CSS blur
 * is 6–7 CSS px, which is three times that, so every upscale artefact lands
 * well inside the blur radius and upscaling the file would add bytes and no
 * detail. They ship at native size.
 *
 *   node scripts/cafe/emit-rooms.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "assets/cafe/rooms");
const OUT = path.join(ROOT, "public/cafe");

const rooms = [
  { from: "room-burger-source.webp", to: "room-burger.webp" },
  { from: "room-pizza-source.webp", to: "room-pizza.webp" },
];

await mkdir(OUT, { recursive: true });

for (const room of rooms) {
  const src = path.join(SRC, room.from);
  const meta = await sharp(src).metadata();

  const info = await sharp(src)
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(OUT, room.to));

  console.log(
    `${room.to.padEnd(18)} ${meta.width}x${meta.height}  ${(info.size / 1024).toFixed(1)} KB`,
  );
}
