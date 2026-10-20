import Link from "next/link";
import { FAMILIES } from "@/data/families";
import type { Product } from "@/data/products";
import { formatPrice, lowestPrice } from "@/lib/catalog";
import { Bottle } from "./Bottle";

const BADGE: Record<NonNullable<Product["badges"]>[number], string> = {
  bestseller: "Bestseller",
  new: "New",
  limited: "Limited",
};

export function ProductCard({ product }: { product: Product }) {
  const fam = FAMILIES[product.family];
  const from = lowestPrice(product);
  const compare = product.sizes.find((s) => s.price === from)?.compareAt;
  const badge = product.badges?.[0];

  return (
    <Link href={`/perfume/${product.slug}`} prefetch className="group block">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[3px] transition-colors duration-700"
        style={{ background: fam.colors.soft }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `radial-gradient(60% 70% at 50% 100%, ${fam.colors.accent}33, transparent 70%)` }}
        />
        <Bottle
          product={product}
          className="absolute left-1/2 top-[52%] h-[74%] w-auto -translate-x-1/2 -translate-y-1/2 transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:-translate-y-[54%] group-hover:scale-[1.03]"
        />
        {badge && <span className="eyebrow absolute left-4 top-4 rounded-full bg-paper/85 px-2.5 py-1 backdrop-blur">{BADGE[badge]}</span>}
        <span className="eyebrow absolute bottom-4 left-4 flex items-center gap-2 text-ink-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: fam.colors.accent }} />
          {fam.short}
        </span>
        <span className="eyebrow absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Discover →
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-mute">{product.house}</p>
          <h3 className="display mt-1.5 text-[26px] leading-[0.95]">{product.name}</h3>
        </div>
        <div className="shrink-0 pt-0.5 text-right">
          <p className="text-sm font-medium tabular-nums">
            {product.sizes.length > 1 && <span className="text-mute">from </span>}
            {formatPrice(from)}
          </p>
          {compare && <p className="text-xs text-mute line-through tabular-nums">{formatPrice(compare)}</p>}
        </div>
      </div>
      <p className="mt-2 truncate text-[13px] text-mute">
        {product.notes.top[0]} · {product.notes.heart[0]} · {product.notes.base[0]}
      </p>
    </Link>
  );
}
