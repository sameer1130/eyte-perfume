import Link from "next/link";
import { FAMILIES } from "@/data/families";
import type { Product } from "@/data/products";
import { formatPrice, lowestPrice } from "@/lib/catalog";
import { familyInk, familySurface } from "@/lib/family-colors";
import { ProductImage } from "./ProductImage";

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
        style={{ background: familySurface(fam) }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `radial-gradient(60% 70% at 50% 100%, color-mix(in oklab, ${familyInk(fam)} 20%, transparent), transparent 70%)` }}
        />
        <ProductImage
          product={product}
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw"
          cutoutClassName="inset-x-[16%] top-[10%] bottom-[16%]"
          className="transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:-translate-y-[2%] group-hover:scale-[1.03]"
        />
        {/* Keeps the family label legible over a full photograph. */}
        {!product.image.cutout && <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgb(0_0_0/0.55),transparent)]" />}
        {badge && <span className="eyebrow absolute left-4 top-4 rounded-full bg-paper/85 px-2.5 py-1 backdrop-blur">{BADGE[badge]}</span>}
        <span className="eyebrow absolute bottom-4 left-4 flex items-center gap-2 text-ink-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: familyInk(fam) }} />
          {fam.short}
        </span>
        <span className="eyebrow absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Discover →
        </span>
      </div>
      {/* Narrow mobile columns put the price under the name so wide display faces don't collide with it. */}
      <div className="mt-4 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-mute">{product.house}</p>
          <h3 className="display mt-1.5 text-[22px] leading-[0.95] sm:text-[26px]">{product.name}</h3>
        </div>
        <div className="mt-2 flex items-baseline gap-2 sm:mt-0 sm:block sm:shrink-0 sm:pt-0.5 sm:text-right">
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
