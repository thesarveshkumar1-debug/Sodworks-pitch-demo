/* ===========================================================================
   THE CONCEPT CATALOGUE  —  EDIT THIS FILE
   ===========================================================================

   Each entry below becomes one specimen plate on the showcase home page.

   HOW A PLATE BEHAVES:
     status: "planned"  ->  dimmed, clearly marked "In development",
                            NOT clickable, no link. Safe to leave here.
     status: "live"     ->  a normal clickable plate. Only set this once the
                            demo page at `route` actually exists.

   TO PUBLISH A CONCEPT: build its page, then set status to "live" and fill
   in `route`. Nothing else needs changing.
   =========================================================================== */

export type ConceptStatus = "live" | "planned";

export type Concept = {
  /** Stable key, also used for React list keys. */
  id: string;
  /** Printed on the plate, e.g. "01". */
  plate: string;
  title: string;
  /** The business type, shown top-right on the plate. */
  niche: string;
  summary: string;
  /** Short mono labels. Keep to three or fewer so plates stay calm. */
  tags: string[];
  status: ConceptStatus;
  /** Only used when status is "live". */
  route?: string;
};

export const concepts: Concept[] = [
  {
    id: "cafe-burger",
    plate: "01",
    title: "The exploded burger",
    niche: "Café",
    summary:
      "A finished burger sits whole on screen. Scrolling lifts it apart layer by layer — bun, sauce, leaf, tomato, onion, patty, cheese — naming each one, then settles it back together over the menu.",
    tags: ["Scroll", "Illustrated", "Menu"],
    status: "live",
    route: "/concepts/cafe-burger",
  },
  {
    id: "gym-progress",
    plate: "02",
    title: "Movement and progress",
    niche: "Gym",
    summary:
      "Warm-up, training, recovery, progress. A single figure carries the visitor through the week, with the schedule and a trial booking always within reach.",
    tags: ["Scroll", "Schedule", "Booking"],
    status: "planned",
  },
  {
    id: "menswear-look",
    plate: "03",
    title: "An outfit, built",
    niche: "Menswear",
    summary:
      "A complete look on a figure separates into its pieces, each one opening into fabric, fit and sizing before the collection closes back into a single outfit.",
    tags: ["Scroll", "Catalogue", "Sizing"],
    status: "planned",
  },
  {
    id: "perfume-notes",
    plate: "04",
    title: "Top, heart, base",
    niche: "Perfume",
    summary:
      "The bottle holds still while the page moves around it. Light and mist carry the visitor down through the three note families to the stockist details.",
    tags: ["Scroll", "Light", "Product"],
    status: "planned",
  },
  {
    id: "shoe-components",
    plate: "05",
    title: "Shoe, in section",
    niche: "Footwear",
    summary:
      "A shoe floats, then separates — outsole, cushioning, upper, laces, insole — each part named plainly, before reassembling over colourways and sizes.",
    tags: ["Scroll", "Exploded", "Sizing"],
    status: "planned",
  },
];

/** Concepts with a finished demo page. */
export const liveConcepts = concepts.filter((c) => c.status === "live");

/** Concepts on the roadmap, shown but not clickable. */
export const plannedConcepts = concepts.filter((c) => c.status === "planned");
