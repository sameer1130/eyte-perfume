import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { Particles } from "@/components/botanica/Particles";
import { ProductImage } from "@/components/product/ProductImage";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/data/products";
import { formatPrice, getProduct, lowestPrice } from "@/lib/catalog";
import { NewsletterForm } from "../NewsletterForm";
import { Marquee } from "../arabian/Ornaments";

const MASTERPIECES = ["lattafa-khamrah-qahwa", "im-rasasi-luxora", "dior-sauvage"];

export function Masterpieces() {
  return (
    <section id="masterpieces" className="relative scroll-mt-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <RevealLines className="display text-center text-[clamp(2.4rem,4.2vw,4rem)]">The Masterpieces</RevealLines>
        <Reveal as="p" className="eyebrow mt-5 text-center text-gold-2" y={14}>
          Three signatures our clients return to
        </Reveal>

        <Reveal className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {MASTERPIECES.map((slug) => {
            const p = getProduct(slug)!;
            return (
              <Link
                key={slug}
                href={`/perfume/${slug}`}
                className="group relative flex flex-col items-center border border-gold/30 bg-[linear-gradient(180deg,#131210_0%,#0a0a09_100%)] p-4 pb-8 text-center transition-colors duration-500 hover:border-gold/70"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <ProductImage
                    product={p}
                    sizes="(min-width: 768px) 380px, 90vw"
                    cutoutClassName="inset-x-[24%] top-[8%] bottom-[8%]"
                    className="transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(85%_80%_at_50%_45%,transparent_55%,#0f0e0c)]" aria-hidden="true" />
                </div>
                <p className="eyebrow mt-7 text-gold">{p.house}</p>
                <h3 className="mt-2 text-[28px] font-medium uppercase leading-none tracking-[0.02em] [font-stretch:72%]">{p.name}</h3>
                <p className="mt-3 max-w-[17rem] text-[14px] leading-relaxed text-ink-2">{p.tagline}</p>
                <p className="mb-6 mt-3 text-sm tabular-nums text-gold-2">{formatPrice(lowestPrice(p))}</p>
                <span className="btn btn-ink mt-auto h-10 px-5 text-[10px]">Discover {p.name}</span>
              </Link>
            );
          })}
        </Reveal>

        <Reveal className="mt-14 text-center">
          <Link href="/shop" className="btn btn-ghost">
            View all {PRODUCTS.length} perfumes
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/** One slow ribbon of phrases between gold hairlines. */
export function GoldBand() {
  return (
    <section aria-label="EYTE promises" className="border-y hairline bg-[linear-gradient(90deg,#0b0a09,#17140f,#0b0a09)] py-6">
      <Marquee
        items={["Signature scent", "Arabian oud", "100% original", "Long lasting", "Worldwide shipping", "Excellence beyond borders"]}
        itemClassName="display gold-text text-[clamp(1.5rem,2.6vw,2.3rem)] italic"
      />
    </section>
  );
}

export function NoirClose() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(60%_80%_at_50%_110%,rgb(201_164_92/0.22),transparent_70%)] py-32">
      <Particles family="gold-smoke" density={0.6} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative mx-auto max-w-[900px] px-5 text-center">
        <Monogram className="mx-auto h-14 w-auto text-gold-2" />
        <SectionHeading eyebrow="The private list" before="Rare finds," script="first" after="to you" scriptColor="var(--color-gold-2)" className="mt-8" />
        <Reveal className="mx-auto mt-10 max-w-md text-[14px] leading-relaxed text-ink-2">
          New arrivals from Dubai and Paris, restocks of the ones that sell out, and the occasional private offer.
        </Reveal>
        <Reveal className="mt-10 flex justify-center">
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
