"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { FAMILIES } from "@/data/families";
import type { Product } from "@/data/products";
import { formatPrice, lowestPrice } from "@/lib/catalog";

function LovedCard({ product }: { product: Product }) {
  const fam = FAMILIES[product.family];
  return (
    <Link href={`/perfume/${product.slug}`} prefetch className="group block w-[78vw] max-w-[330px] shrink-0 snap-start sm:w-[330px]">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-gold/15"
        style={{ background: `radial-gradient(75% 60% at 50% 78%, ${fam.colors.accent}66, transparent 72%), linear-gradient(165deg, #2c1a13 0%, #0d0d0d 100%)` }}
      >
        <ProductImage
          product={product}
          sizes="330px"
          cutoutClassName="inset-x-[18%] top-[9%] bottom-[34%]"
          className="transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]"
        />
        {product.badges?.[0] && (
          <span className="eyebrow absolute left-4 top-4 rounded-full border border-gold/40 bg-black/30 px-3 py-1 text-gold-2 backdrop-blur">
            {product.badges[0]}
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 rounded-[16px] bg-[#f3e8d8] px-4 py-3.5 text-[#111111]">
          <p className="eyebrow text-[#7a6236]">{product.house}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="display truncate text-[22px] leading-none">{product.name}</p>
            <p className="shrink-0 text-sm font-medium tabular-nums">{formatPrice(lowestPrice(product))}</p>
          </div>
          {product.rating !== undefined && <Stars rating={product.rating} className="mt-1.5 block" />}
        </div>
      </div>
    </Link>
  );
}

/** ZENFOX-style horizontal carousel of best-loved perfumes. */
export function LovedCarousel({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 700), behavior: "smooth" });
  };

  return (
    <section className="relative py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 md:flex-row md:items-end md:px-10 xl:px-28">
        <SectionHeading eyebrow="Most loved" before="Scents for" script="every" after="evening" align="left" scriptColor="var(--color-gold-2)" />
        <Reveal className="max-w-sm text-[14px] leading-relaxed text-ink-2">
          The perfumes our community reaches for again and again, from Arabian treasures to the great maisons.
        </Reveal>
      </div>

      <div
        ref={track}
        data-lenis-prevent
        className="mt-14 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-4 md:scroll-pl-10 xl:scroll-pl-28 [scrollbar-width:none] md:px-10 xl:px-28 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <LovedCard key={p.slug} product={p} />
        ))}
        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>

      <div className="mx-auto mt-8 flex max-w-[1400px] items-center gap-6 px-5 md:px-10 xl:px-28">
        <div className="relative h-px flex-1 bg-ink/15">
          <div className="absolute inset-y-0 left-0 bg-gold-2 transition-[width] duration-300" style={{ width: `${12 + progress * 88}%` }} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll left" className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/40 transition-colors hover:bg-gold/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll right" className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-[#f3e8d8] text-[#111111] transition-transform hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
