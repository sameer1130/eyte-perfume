import { FAMILY_SLUGS, type FamilySlug } from "@/data/families";
import { familyOfNote } from "@/data/notes";
import { PRODUCTS, type Product } from "@/data/products";

export type Tier = "top" | "heart" | "base";
export const TIERS: Tier[] = ["top", "heart", "base"];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsInFamily(family: FamilySlug): Product[] {
  return PRODUCTS.filter((p) => p.family === family);
}

/** Badged bestsellers first, topped up with the highest-rated perfumes. */
export function bestsellers(limit = 8): Product[] {
  const badged = PRODUCTS.filter((p) => p.badges?.includes("bestseller"));
  const rest = PRODUCTS.filter((p) => !badged.includes(p)).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return [...badged, ...rest].slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.slug !== product.slug && p.family === product.family);
  const rest = PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.family !== product.family && p.collection === product.collection,
  );
  return [...same, ...rest].slice(0, limit);
}

/**
 * The family that dominates one act of the pyramid. Ties go to the product's
 * own family, then to whichever tied family appears first in the act.
 */
export function tierFamily(product: Product, tier: Tier): FamilySlug {
  const counts = new Map<FamilySlug, number>();
  const order: FamilySlug[] = [];
  for (const note of product.notes[tier]) {
    const fam = familyOfNote(note);
    if (!fam) continue;
    if (!counts.has(fam)) order.push(fam);
    counts.set(fam, (counts.get(fam) ?? 0) + 1);
  }
  if (counts.size === 0) return product.family;
  const max = Math.max(...counts.values());
  const tied = order.filter((f) => counts.get(f) === max);
  return tied.includes(product.family) ? product.family : tied[0];
}

/**
 * Share of each family across all notes, weighted so base notes (which last
 * longest on skin) count a little more than top notes.
 */
export function familyComposition(product: Product): { family: FamilySlug; share: number }[] {
  const weights: Record<Tier, number> = { top: 1, heart: 1.25, base: 1.5 };
  const totals = new Map<FamilySlug, number>();
  for (const tier of TIERS) {
    for (const note of product.notes[tier]) {
      const fam = familyOfNote(note);
      if (fam) totals.set(fam, (totals.get(fam) ?? 0) + weights[tier]);
    }
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  return FAMILY_SLUGS.filter((f) => totals.has(f))
    .map((family) => ({ family, share: (totals.get(family) ?? 0) / sum }))
    .sort((a, b) => b.share - a.share);
}

export function lowestPrice(product: Product): number {
  return Math.min(...product.sizes.map((s) => s.price));
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return inr.format(value);
}

export const COLLECTION_LABEL: Record<Product["collection"], string> = {
  "middle-eastern": "Middle Eastern",
  international: "International",
};
