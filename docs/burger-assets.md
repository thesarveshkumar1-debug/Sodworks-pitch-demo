# Burger layer assets — workflow and specification

**Status: built and live.** The café hero runs the scroll-apart sequence on
six registered transparent layers in `public/burger/layers/`, with `@2x`
variants for high-density screens and 1x backups in `assets/burger/layers-1x/`.

This file remains the record of how those layers were produced, and the
specification to follow if the artwork is ever regenerated.

**Nothing here is final.** The six-layer grouping is provisional and is
confirmed, changed or re-cut only after we have reviewed the generated images
together.

---

## Why the supplied references can't be used

**Neither has an alpha channel.** Both are `1376 × 768` WebP. Confirmed three
ways — `sips` reports `hasAlpha: no`, the VP8X header flags byte is `0x20`
with the alpha bit clear, and neither file contains an `ALPH` chunk.

**The exploded reference cannot be cut apart.** Its background is clean white,
but a row-by-row scan found exactly **one** clean horizontal gap in the whole
image (rows 591–597, above the bottom bun). Everywhere else the components
touch or overlap, and where the lettuce sits in front of the tomato, the
hidden part of the tomato *is not in the file*.

---

## The registration problem

Six separately generated images will **not** line up just because they are the
same pixel size. Each generation drifts in scale, camera angle, lighting
direction, colour temperature and position.

Registration cannot be requested. It has to be **inherited** — so every layer
is cut from one image.

---

## Required images

**Two images are required.** Not one, and the second is not optional: without
the assembled view there is no target to calibrate the reconstruction against.

| # | Image | Role |
| --- | --- | --- |
| A | **Assembled burger** | The visual target. What the collapsed stack must look like. |
| B | **Exploded composition** | The source every layer is cut from. |

They must depict **the same burger**: same ingredients, same build order, same
proportions, same camera, same lighting, same colour grade.

### The constraint that makes calibration possible

**The burger's maximum width must be the same number of pixels in both
images** — target ~1400px — and the burger must be centred on the same
vertical axis in both. This lets image B's layers be overlaid directly on
image A with no rescaling, which is the whole basis of the calibration step.

Generate **A first**, then generate **B from A as a style/content reference**,
so B inherits A's burger rather than inventing a new one.

| Property | Image A (assembled) | Image B (exploded) |
| --- | --- | --- |
| Dimensions | `1600 × 1400` | `1600 × 2400` |
| Background | Neutral light grey seamless | **Transparent PNG preferred**, else flat `#FFFFFF` |
| Format | PNG or high-quality WebP | **PNG with alpha** preferred |
| Colour space | sRGB, 8 bit/channel | sRGB, 8 bit/channel |
| Camera | Dead straight on, at the burger's midline | **Identical to A** |
| Burger width | ~1400px | ~1400px, same centre axis |

---

## Composition rules for image B

These matter more than the pixel dimensions. They are what make the split
possible.

- **Components in burger order**, top to bottom.
- **Centred on one vertical axis**, the same axis as image A.
- **Clear empty gaps between every pair** — at least **80px**, preferably
  **120px**, of completely empty pixels. No component may share a single pixel
  row with another.
- **Every component fully visible**, nothing occluded by a neighbour.
- **No cast shadows, contact shadows, reflections, plate, board or props.** A
  shadow falling into the gap below bridges it and gets cut into the wrong
  layer. The page adds its own shadows.
- **Assembled proportions.** Each component keeps the shape and compression it
  has *inside* the burger — lettuce squashed, tomato slices sitting as a pair,
  cheese draped over the chicken. Not relaxed, not spread out. The collapsed
  state has to look like a real burger, not a tidy stack of ingredients.
- **If the background can't be transparent**, flat `#FFFFFF` with no gradient,
  vignette or texture.

---

## Workflow

### Step 1 — generate image A, the assembled burger

The visual target. Prompt below.

### Step 2 — generate image B, the exploded composition

Using A as a reference so it is the same burger. Prompt below.

### Step 3 — review both together

Before anything is cut. This is where the six-layer grouping is confirmed or
changed: if the generator drapes the cheese differently, separates the sauce
convincingly, or the lettuce reads better as two pieces, the grouping follows
what the images actually show.

### Step 4 — split image B into six layers

Each component is cut onto its own full-size canvas **at the exact position it
occupies in image B**. Nothing moved, scaled or rotated, so the six layers are
registered to each other by construction.

`sharp` gets added as a dev-only dependency for this. It is a build-time asset
tool and is not shipped to the browser.

### Step 5 — calibrate the assembled positions against image A

**Positions are not inferred from bounding boxes.** A bounding-box nest
assumes each component sits directly on the one below, and real burgers do not
work that way: the lettuce is crushed, the tomato is half-hidden behind it,
the crown settles down into the fillings, and the cheese drape overlaps the
chicken it is already part of. Stacking by bounding box leaves visible seams
and gaps.

Instead:

1. Image A is used as an underlay.
2. Each cut layer is positioned over it by eye to match where that component
   actually sits in the assembled burger — vertical offset primarily, with
   small horizontal and scale nudges allowed if a component needs them.
3. Bounding boxes are used only as the **starting estimate** for that
   adjustment, never as the final answer.
4. The calibrated offsets are saved as **editable data**
   (`src/data/burger-layout.ts`), not hard-coded into a component, so they can
   be corrected later without touching the animation.

### Step 6 — verify the reconstruction before building anything

The six layers are rendered stacked at their calibrated positions, then:

- overlaid on image A at 50% opacity to check silhouette alignment
- compared side by side with image A at full size
- checked for seams, gaps, doubled edges and wrong overlaps

Both comparisons are shown for review. **The scroll animation is built only
once the reconstruction convincingly reads as the burger in image A.** If it
does not, we recalibrate, re-cut, or regenerate — whichever the mismatch calls
for.

---

## Generation prompt — image A (assembled burger)

> Photorealistic studio food photograph of a single fried chicken burger,
> shot dead straight on, camera at the burger's own midline height, with no
> downward or upward tilt and no perspective distortion. The burger is centred
> in the frame and fills about 80% of the frame height.
>
> Built from bottom to top: a toasted brioche bun heel with a thin smear of
> creamy white herb-flecked sauce; one thick fried chicken thigh fillet with a
> craggy, uneven golden-brown crust; a slice of mild cheddar melted over the
> chicken and draping down its sides; one frilly green leaf lettuce, slightly
> compressed; two thick slices of ripe red tomato; three thin rings of red
> onion; a drizzle of the same creamy white herb sauce; and a domed, glossy,
> glazed brioche crown with a smooth plain top and no sesame seeds.
>
> Lighting: one soft warm key light from the upper left, gentle fill from the
> right, no hard specular hotspots. Warm, appetising colour grade. Neutral
> light grey seamless studio backdrop with a soft gradient.
>
> Sharp focus throughout, high detail in the chicken's crust and the bun's
> glaze. Commercial food photography, high resolution.
>
> Negative: no hands, no cutlery, no plate, no board, no table, no garnish,
> no fries, no drink, no sesame seeds, no text, no watermark, no logo, no
> motion blur, no tilted or three-quarter camera angle, no fisheye.

Output `1600 × 1400`, burger about 1400px wide, centred.

## Generation prompt — image B (exploded composition)

Generate this **using image A as a reference image**, so it is the same
burger.

> The exact same fried chicken burger as the reference image, same
> ingredients, same colour, same styling, photographed with the exact same
> camera position, same straight-on eye-level angle and the same soft warm key
> light from the upper left — but with its components separated and floating
> apart vertically in an exploded view.
>
> From top to bottom, with a large clear empty gap between each one: the
> domed glossy glazed brioche crown with the creamy white herb sauce clinging
> to its underside; three thin rings of red onion; two thick slices of ripe
> red tomato; one frilly green leaf lettuce; the thick fried chicken thigh
> fillet with the melted cheddar still draped over it as a single piece; and
> the toasted brioche heel with sauce spread across its face.
>
> Every component is complete and fully visible, with nothing hidden behind
> anything else, and every component is centred on the same vertical axis.
> Each component keeps the squashed, settled shape it has inside the assembled
> burger rather than being relaxed or flattened out.
>
> Tall portrait composition with generous empty space between the components.
> Transparent background.
>
> Negative: no overlapping components, no touching components, no cast
> shadows, no contact shadows, no reflections, no plate, no board, no table,
> no background scenery, no hands, no text, no watermark, no logo, no sesame
> seeds, no tilted or three-quarter camera angle, no extra ingredients, no
> duplicated layers.

Output `1600 × 2400`, transparent PNG if available (otherwise flat `#FFFFFF`),
burger components about 1400px at their widest, same centre axis as image A.

---

## The six layers (provisional)

What I expect to cut out of image B, pending the step 3 review:

| File | Contents |
| --- | --- |
| `top-bun.png` | Glazed brioche crown, sauce on the underside |
| `onion.png` | The red onion rings, as one cluster |
| `tomato.png` | Both tomato slices, as one group |
| `lettuce.png` | The green leaf |
| `patty-cheese.png` | Fried chicken fillet with the cheddar melted over it |
| `bottom-bun.png` | Toasted heel, sauce spread to the edge |

Six rather than eight, because the cheese is melted into the chicken's coating
and the sauce is spread on the bun faces — on the evidence of the references,
neither lifts away as its own slice without looking wrong. **If the generated
composition shows otherwise, this changes.**

Delivered layers go in `public/burger/layers/`. `src/data/cafe.ts` already
names each expected file in `cafe.burger.layers[].asset`. Nothing reads them
yet.

## Where the files go

```
public/burger/layers/        the six cut layers
docs/reference/image-a.png   assembled target (keep alongside the project)
docs/reference/image-b.png   exploded source
```
