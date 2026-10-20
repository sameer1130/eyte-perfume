"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { FAMILIES, FAMILY_LIST, isFamilySlug } from "@/data/families";
import { PRODUCTS, type Product } from "@/data/products";
import { lowestPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";

const COLLECTIONS = [
  { value: "", label: "All" },
  { value: "middle-eastern", label: "Middle Eastern" },
  { value: "international", label: "International" },
];
const GENDERS = [
  { value: "", label: "All" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "unisex", label: "Unisex" },
];
const SORTS = [
  { value: "", label: "Featured" },
  { value: "bestsellers", label: "Bestsellers" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

function applyFilters(params: URLSearchParams): Product[] {
  const family = params.get("family") ?? "";
  const collection = params.get("collection") ?? "";
  const gender = params.get("gender") ?? "";
  const sort = params.get("sort") ?? "";
  const list = PRODUCTS.filter(
    (p) =>
      (!isFamilySlug(family) || p.family === family) &&
      (!collection || p.collection === collection) &&
      (!gender || p.gender === gender),
  );
  const sorted = [...list];
  if (sort === "price-asc") sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
  if (sort === "price-desc") sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
  if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  if (sort === "bestsellers")
    sorted.sort((a, b) => Number(!!b.badges?.includes("bestseller")) - Number(!!a.badges?.includes("bestseller")) || b.reviewCount - a.reviewCount);
  return sorted;
}

function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1 rounded-full border hairline p-1">
      {options.map((o) => (
        <button
          key={o.value || "all"}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "eyebrow cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 transition-colors",
            value === o.value ? "bg-ink text-paper" : "hover:bg-paper-2",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const family = params.get("family") ?? "";
  const collection = params.get("collection") ?? "";
  const gender = params.get("gender") ?? "";
  const sort = params.get("sort") ?? "";
  const products = applyFilters(new URLSearchParams(params.toString()));

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const activeFamily = isFamilySlug(family) ? FAMILIES[family] : null;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-32 md:px-10 xl:px-28">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Scent family">
        <button
          type="button"
          aria-pressed={!activeFamily}
          onClick={() => update("family", "")}
          className={cn(
            "eyebrow cursor-pointer rounded-full border px-4 py-2.5 transition-colors",
            !activeFamily ? "border-ink bg-ink text-paper" : "hairline hover:border-ink",
          )}
        >
          All families
        </button>
        {FAMILY_LIST.map((f) => {
          const on = family === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              aria-pressed={on}
              onClick={() => update("family", on ? "" : f.slug)}
              className={cn(
                "eyebrow flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 transition-colors",
                on ? "border-ink bg-ink text-paper" : "hairline hover:border-ink",
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: f.colors.accent }} />
              {f.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-y hairline py-4 lg:flex-row">
        <div className="flex max-w-full flex-wrap justify-center gap-3 lg:flex-1 lg:justify-start">
          <Segmented label="Collection" options={COLLECTIONS} value={collection} onChange={(v) => update("collection", v)} />
          <Segmented label="Gender" options={GENDERS} value={gender} onChange={(v) => update("gender", v)} />
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <p className="eyebrow whitespace-nowrap text-mute" aria-live="polite">
            {products.length} {products.length === 1 ? "perfume" : "perfumes"}
          </p>
          <label className="eyebrow flex items-center gap-2">
            <span className="text-mute">Sort</span>
            <select
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
              className="eyebrow cursor-pointer rounded-full border hairline bg-transparent px-3 py-2 outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {activeFamily && (
        <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-ink-2">
          <span className="script mr-2 text-3xl" style={{ color: activeFamily.colors.accent }}>
            {activeFamily.word}
          </span>
          {activeFamily.description}
        </p>
      )}

      {products.length === 0 ? (
        <div className="py-32 text-center">
          <p className="script text-6xl text-gold">nothing yet</p>
          <p className="mt-4 text-sm text-ink-2">No perfumes match those filters. Try widening your search.</p>
          <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="btn btn-ghost mt-8 cursor-pointer">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
