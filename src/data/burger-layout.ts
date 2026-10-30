/* ===========================================================================
   BURGER LAYER LAYOUT  —  generated, but safe to hand-tune
   ===========================================================================

   The six layer images in public/burger/layers/ all share one canvas and are
   already positioned so that stacking them at zero offset gives the assembled
   burger. Nothing here places them; this file only describes how they come
   apart.

     stack   burger order, 0 = crown. Drives the separation direction.
     centre  the layer's vertical centre as a fraction of the canvas, used to
             put its label beside it.

   Regenerate with: node scripts/burger/emit-assets.mjs
   =========================================================================== */

export const burgerCanvas = { width: 543, height: 502 } as const;

export type BurgerLayer = {
  key: string;
  /** Burger order, 0 = crown. */
  stack: number;
  /** Vertical centre as a fraction of the canvas height. */
  centre: number;
};

export const burgerLayers: BurgerLayer[] = [
  { key: "top-bun", stack: 0, centre: 0.2370 },
  { key: "onion", stack: 1, centre: 0.3640 },
  { key: "tomato", stack: 2, centre: 0.4074 },
  { key: "lettuce", stack: 3, centre: 0.5079 },
  { key: "patty-cheese", stack: 4, centre: 0.6186 },
  { key: "bottom-bun", stack: 5, centre: 0.8040 },
];

/**
 * Painting order, back to front — deliberately NOT the burger's stacking
 * order. In a real burger the fillings bulge toward the camera and hide the
 * crown's cut face, so the crown sits at the back despite being the top
 * layer; the patty overhangs the heel; and the lettuce frills sit in front of
 * everything they touch.
 */
export const burgerDrawOrder = ["top-bun", "bottom-bun", "patty-cheese", "onion", "tomato", "lettuce"];

/**
 * How far apart the layers travel at full separation, as a fraction of the
 * burger's displayed height, per step away from the middle of the stack.
 */
export const separationRatio = { desktop: 0.165, mobile: 0.125 } as const;
