import type { Family } from "@/data/families";

/*
 * A family's colours, adjusted to the live palette. On the cream palette these
 * are exactly the family's own soft and accent colours. Dark palettes lower
 * --family-soft and --family-ink (see the theme styles), so panels turn
 * charcoal with a hint of the family and accents warm toward gold.
 */

/** Panel behind a family's bottles and botanicals. */
export function familySurface(f: Family) {
  return `color-mix(in oklab, ${f.colors.soft} var(--family-soft), color-mix(in oklab, ${f.colors.accent} 9%, var(--color-paper-2)))`;
}

/** Script words, dots and bars in the family's accent. */
export function familyInk(f: Family) {
  return `color-mix(in oklab, ${f.colors.accent} var(--family-ink), var(--color-gold-2))`;
}
