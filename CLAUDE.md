@AGENTS.md

# SodWorks showcase — project conventions

A curated catalogue of website concepts for prospective clients. Each concept
is a self-contained demo page with its own art direction; the showcase shell
stays neutral so the demos can be loud.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- `output: "export"` — builds to `out/`, no server runtime. Intended host is
  Cloudflare Pages, but Netlify or GitHub Pages would serve `out/` equally.
- `typedRoutes` is deliberately **off**, so `href` stays a plain string and a
  concept can be added to the catalogue before its page exists.
- GSAP + ScrollTrigger drive the café's two scroll sequences. That is their
  only job here — do not add a second animation library for the same work.

## Where things live

| Path | Purpose |
| --- | --- |
| `src/app/globals.css` | **All design tokens.** Colour, type, easing. Start here. |
| `src/data/site.ts` | All SodWorks copy and contact details. Sample content. |
| `src/data/concepts.ts` | The catalogue. One entry per concept. |
| `src/data/cafe.ts` | All café demo content. Sample content. |
| `src/data/burger-layout.ts` | Burger stacking, paint order and separation |
| `src/data/pizza-layout.ts` | Pizza stacking, paint order and separation |
| `src/data/cafe-rooms.ts` | Which room photo backs which sequence, and its crop |
| `scripts/burger/` | Asset pipeline: cut, trim, calibrate, emit, upscale |
| `scripts/pizza/` | Pizza pipeline: key, normalise, emit |
| `assets/burger/layers-1x/` | 1x layer backups. Outside `public/`, not served. |
| `assets/pizza/source/` | Pizza source renders. Outside `public/`, not served. |
| `assets/cafe/rooms/` | Café room photographs, originals. Not served. |
| `scripts/cafe/emit-rooms.mjs` | Emits the served room backdrops |
| `src/components/ui/` | Shared primitives — plates, buttons, rules, tags |
| `src/components/site/` | Showcase header and footer |
| `src/components/demo/` | Demo chrome (`DemoBar`) and per-demo components |
| `src/components/motion/` | Reusable effect components |
| `src/lib/motion.ts` | The one easing curve and duration scale |

## Routing

- `src/app/(showcase)/` — a route group carrying the dark SodWorks chrome.
  The home page lives here. The group does not appear in the URL.
- `src/app/concepts/<concept>/` — demo pages, deliberately **outside** that
  group so each gets its own layout, fonts and palette, with only the slim
  `DemoBar` linking back to the catalogue.
- The root layout holds `<html>`/`<body>` and the shell fonts only.

## Rules

- **Content never lives in components.** Copy goes in `src/data/`.
- **Placeholder content must be visibly marked.** Use `SampleBadge`. The
  `showSampleMarkers` flag in `src/data/site.ts` turns every badge off at once.
- **The café has two scroll sequences**, burger then pizza, on `.cafe-hero`
  and `.cafe-hero-oven`. They share a structure but not a component — keep
  them separate so one can be retuned without touching the other.
- **Each sequence sits in a real café, photographed.** The room is an `<img>`
  behind the dish (`.cafe-room`), blurred in CSS rather than in the file, so
  the blur stays tunable and the served photo stays reusable. It is scaled up
  past the frame so the blur never reveals a soft edge at the viewport. The
  warm scrim over it is `::before`, and it needs its `z-index: 1`: the
  backdrop `<img>` is a later sibling and paints straight over it otherwise.
  Keep the room readable as a room — if a heavier scrim is the only way to
  make copy legible, move the copy instead.
- **The burger is six registered layer images, never a flattened photo.** The
  files in `public/burger/layers/` share one canvas and are already positioned
  so that stacking them at zero offset *is* the assembled burger. The page
  animates only the separation. Do not hand-position layers in a component,
  and never fake separation by cropping a flat image. To change the artwork,
  re-run the pipeline in `scripts/burger/` — see `docs/burger-assets.md`.
- **The pizza is three layers, and that is deliberate.** A sauce layer was
  generated and dropped: it needed a 13% vertical squash to match the master's
  camera angle, past the 10% limit where flat-disc correction starts
  distorting food, and it came back wider than the cheese meant to hide it.
  Pizza layers are concentric discs, so scale and ellipse aspect are both
  measurable and correctable — but only within that 10% limit. Past it,
  regenerate rather than squash.
- **No empty pages.** A concept without a finished demo stays
  `status: "planned"` — rendered, clearly marked, not clickable, no route.
  Only set `status: "live"` once the page at `route` actually exists.
- **Reduced motion is not optional.** Every animation checks
  `prefersReducedMotion()` or sits behind the `globals.css` media query, and
  all information stays reachable with motion disabled.
- **One accent colour.** Laterite. Do not introduce a second accent in the
  showcase shell; individual demo pages get their own palettes.
- Mobile first. Test the catalogue grid at 375px before calling anything done.
- **Demo fonts must be bound on the demo's wrapper, not in `@theme`.**
  `next/font` variables are scoped to the element carrying their class, so an
  alias like `--font-cafe-display: var(--font-bricolage)` declared on `:root`
  resolves to nothing and the text silently falls back. Declare the alias in a
  wrapper class (see `.cafe-root` in `globals.css`) and keep the `@theme`
  entry as a plain fallback so the Tailwind utility still exists.

## Commands

```
npm run dev        # local dev server
npm run build      # static export to out/
npm run typecheck  # tsc --noEmit
npm run lint
```
