/**
 * Shared motion values. Defined once so every animation on the site moves
 * with the same character: slow, deliberate, no bounce.
 */

export const EASE_SOD = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  quick: 320,
  base: 600,
  slow: 900,
} as const;

/** True when the visitor's system asks for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
