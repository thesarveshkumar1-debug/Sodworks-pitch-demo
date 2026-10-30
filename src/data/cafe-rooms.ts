/**
 * The rooms the two food sequences are set in.
 *
 * Both are photographs of a real café. They sit behind the dish, blurred, so
 * the sequences read as happening somewhere rather than on a gradient. The
 * blur, the scrim and the overscale live in `globals.css`; what belongs here
 * is which photo backs which sequence and where to hold the crop.
 *
 * `focus` is an `object-position`. The photos are landscape and the viewport
 * on a phone is not, so the desktop and mobile crops are different framings
 * of the same room, not the same framing at two sizes:
 *
 *  - desktop sees most of the width, so it is held slightly high to favour
 *    the boards and lamps over the empty floor;
 *  - mobile sees a narrow vertical slice, so it is nudged towards the part
 *    of the room that still reads as a café on its own.
 */

export type CafeRoom = {
  /** Served path, emitted by `scripts/cafe/emit-rooms.mjs`. */
  src: string;
  width: number;
  height: number;
  /** `object-position`, per breakpoint. */
  focus: { desktop: string; mobile: string };
};

export const cafeRooms = {
  /** Chalkboard wall, cane chairs, low amber light. Backs the burger. */
  burger: {
    src: "/cafe/room-burger.webp",
    width: 736,
    height: 552,
    focus: { desktop: "50% 40%", mobile: "27% 36%" },
  },

  /** Whitewashed brick, a row of globe lamps, a long green counter.
      Backs the pizza — brighter than the burger's room, so it carries a
      heavier knock-down in `.cafe-hero-oven`. */
  pizza: {
    src: "/cafe/room-pizza.webp",
    width: 735,
    height: 490,
    focus: { desktop: "50% 34%", mobile: "30% 36%" },
  },
} as const satisfies Record<string, CafeRoom>;
