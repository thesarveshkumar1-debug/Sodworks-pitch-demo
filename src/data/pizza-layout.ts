/* ===========================================================================
   PIZZA LAYER LAYOUT  —  generated, but safe to hand-tune
   ===========================================================================

   The three layer images in public/pizza/layers/ share one canvas and are
   already positioned so that stacking them at zero offset gives the assembled
   pizza. Nothing here places them; this file only describes how they separate.

     stack   pizza order, 0 = toppings on top. Drives separation direction.
     centre  the layer's vertical centre as a fraction of the canvas, used to
             put its label beside it.

   Three layers, not four: the sauce was generated and dropped. It needed a
   13% vertical squash to match the master's camera angle — past the 10% limit
   where flat-disc correction starts distorting the food — and came back wider
   than the cheese meant to cover it. The cheese hid it anyway.

   Regenerate with: node scripts/pizza/emit-assets.mjs
   =========================================================================== */

export const pizzaCanvas = { width: 991, height: 683 } as const;

export type PizzaLayer = {
  key: string;
  /** Pizza order, 0 = top. */
  stack: number;
  /** Vertical centre as a fraction of the canvas height. */
  centre: number;
};

export const pizzaLayers: PizzaLayer[] = [
  { key: "toppings", stack: 0, centre: 0.4487 },
  { key: "mozzarella", stack: 1, centre: 0.4652 },
  { key: "crust", stack: 2, centre: 0.5031 },
];

/**
 * Painting order, back to front. For a pizza this *is* the stacking order
 * reversed — unlike the burger, nothing bulges toward the camera, so each
 * layer simply sits on the one below.
 */
export const pizzaDrawOrder = ["crust", "mozzarella", "toppings"];

/**
 * How far apart the layers travel at full separation, as a fraction of the
 * pizza's displayed height, per step away from the middle of the stack.
 * Larger than the burger's: three flat discs need more air to read apart.
 * Mobile is the larger of the two here — with no side columns the phone has
 * more vertical room to spend than the desktop layout does.
 */
export const pizzaSeparationRatio = { desktop: 0.62, mobile: 0.78 } as const;
