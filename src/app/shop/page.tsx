import type { Metadata } from "next";
import { Suspense } from "react";
import { Scene } from "@/components/botanica/Scene";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopClient } from "@/components/shop/ShopClient";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Shop authentic Middle Eastern and international perfumes by scent family, collection and more.",
};

/** Static grid shown while the filters hydrate (and to crawlers). */
function ShopFallback() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-32 md:px-10 xl:px-28">
      <div className="h-[132px]" />
      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-40 md:pt-48">
        <Scene family="citrus" sides={["right"]} plantWidth="min(30vw, 420px)" density={0.4} />
        <SectionHeading eyebrow={`${PRODUCTS.length} authentic perfumes`} before="The" script="complete" after="collection" size="lg" />
        <p className="mx-auto mt-10 max-w-md px-5 text-center text-[14px] leading-relaxed text-ink-2">
          Middle Eastern treasures and international icons, all 100% original. Filter by the scent family you love.
        </p>
      </section>
      <Suspense fallback={<ShopFallback />}>
        <ShopClient />
      </Suspense>
    </>
  );
}
