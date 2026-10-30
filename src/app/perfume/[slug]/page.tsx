import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Scene } from "@/components/botanica/Scene";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { ComparedTo, Faq, HowToWear, Reviews, ScentProfile, WearGuide } from "@/components/product/ProductSections";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ThreeActs, type ActData } from "@/components/product/ThreeActs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { FAMILIES } from "@/data/families";
import { familyOfNote } from "@/data/notes";
import { PRODUCTS } from "@/data/products";
import { COLLECTION_LABEL, familyComposition, getProduct, relatedProducts, tierFamily } from "@/lib/catalog";
import { familyInk, familySurface } from "@/lib/family-colors";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/perfume/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.house} ${product.name}`,
    description: `${product.tagline} ${product.description[0]}`,
  };
}

const ACT_COPY = {
  top: { n: "I", tier: "Top notes", title: "The opening", time: "0–15 min" },
  heart: { n: "II", tier: "Heart notes", title: "The heart", time: "15 min – 4 hrs" },
  base: { n: "III", tier: "Base notes", title: "The signature", time: "4 hrs +" },
} as const;

const GENDER_LABEL = { men: "For him", women: "For her", unisex: "Unisex" } as const;
const CONCENTRATION_SHORT = {
  "Eau de Parfum": "EDP",
  "Eau de Toilette": "EDT",
  "Extrait de Parfum": "Extrait",
  "Elixir de Parfum": "Elixir",
  Parfum: "Parfum",
} as const;

export default function PerfumePage({ params }: PageProps<"/perfume/[slug]">) {
  return (
    <Suspense fallback={<PerfumeSkeleton />}>
      <PerfumeContent params={params} />
    </Suspense>
  );
}

/** URL-independent placeholder shown while a navigation resolves the product. */
function PerfumeSkeleton() {
  return (
    <section className="lg:grid lg:min-h-svh lg:grid-cols-[1.1fr_1fr]" aria-busy="true">
      <div className="min-h-[78svh] animate-pulse bg-paper-2 lg:min-h-svh" />
      <div className="flex flex-col justify-center gap-5 px-5 py-14 md:px-10 lg:px-14 xl:px-20">
        <div className="h-3 w-40 rounded-full bg-paper-2" />
        <div className="h-20 w-3/4 rounded-sm bg-paper-2" />
        <div className="h-6 w-1/2 rounded-full bg-paper-2" />
        <div className="mt-6 h-14 w-full rounded-full bg-paper-2" />
      </div>
    </section>
  );
}

async function PerfumeContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const fam = FAMILIES[product.family];
  const acts: ActData[] = (["top", "heart", "base"] as const).map((tier) => ({
    ...ACT_COPY[tier],
    family: tierFamily(product, tier),
    notes: product.notes[tier].map((name) => ({ name, family: familyOfNote(name) })),
  }));
  const families = familyComposition(product).map((c) => FAMILIES[c.family]);
  const related = relatedProducts(product, 4);

  return (
    <>
      {/* Hero: the bottle in its family's atmosphere + purchase panel */}
      <section className="lg:grid lg:min-h-svh lg:grid-cols-[1.1fr_1fr]">
        <div className="relative min-h-[78svh] overflow-hidden lg:min-h-svh" style={{ background: familySurface(fam) }}>
          {/* A full photograph sits behind the botanicals; a cut-out bottle stands in front of them. */}
          {!product.image.cutout && (
            <>
              <ProductImage product={product} sizes="(min-width: 1024px) 55vw, 100vw" eager />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-paper)_2%,transparent_40%)]" />
            </>
          )}
          <Scene family={product.family} sides={["right", "left"]} plantWidth="clamp(200px, 32vw, 520px)" />
          {product.image.cutout && (
            <ProductImage
              product={product}
              sizes="(min-width: 1024px) 34vw, 70vw"
              cutoutClassName="left-1/2 top-[18%] h-[62%] max-h-[660px] w-[70%] -translate-x-1/2"
              className="intro-rise"
              eager
            />
          )}
          <p
            className="script intro-fade absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(2.6rem,5vw,4.5rem)]"
            style={{ color: familyInk(fam), animationDelay: "0.4s" }}
          >
            {fam.word}
          </p>
        </div>

        <div className="flex flex-col justify-center px-5 py-14 md:px-10 lg:px-14 lg:pb-16 lg:pt-36 xl:px-20">
          <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap gap-x-2 text-mute">
            <Link href="/shop" className="link-grow">
              Shop
            </Link>
            <span>/</span>
            <Link href={`/families/${product.family}`} className="link-grow">
              {fam.name}
            </Link>
          </nav>
          <p className="eyebrow mt-8 text-ink-2">{product.house}</p>
          <h1 className="display mt-3 text-[clamp(3.4rem,6vw,6.2rem)]">{product.name}</h1>
          <p className="mt-3 text-[clamp(1.3rem,2vw,1.7rem)] italic leading-snug text-ink-2" style={{ fontFamily: "var(--font-display)" }}>
            {product.tagline}
          </p>
          {product.rating !== undefined && (
            <div className="mt-5 flex items-center gap-3">
              <Stars rating={product.rating} />
              <a href="#reviews" className="eyebrow link-grow text-mute">
                {product.rating.toFixed(1)} · {product.reviewCount} reviews
              </a>
            </div>
          )}

          <div className="mt-9">
            <PurchasePanel product={product} />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border hairline bg-[var(--color-line)] sm:grid-cols-4">
            {[
              ["Collection", COLLECTION_LABEL[product.collection]],
              ["Type", CONCENTRATION_SHORT[product.concentration]],
              ["For", GENDER_LABEL[product.gender]],
              ["Longevity", product.profile.longevity],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper px-4 py-4">
                <dt className="eyebrow text-mute">{k}</dt>
                <dd className="mt-1.5 text-sm">{v}</dd>
              </div>
            ))}
          </dl>

          <ul className="eyebrow mt-8 flex flex-wrap gap-x-6 gap-y-2 text-ink-2">
            <li>✦ 100% original</li>
            <li>✦ Worldwide shipping</li>
            <li>✦ Gift-ready</li>
          </ul>
        </div>
      </section>

      {/* About + families */}
      <section className="mx-auto max-w-[1100px] px-5 py-28 text-center md:px-10">
        <Reveal as="p" className="eyebrow text-ink-2">
          About the fragrance
        </Reveal>
        <Reveal className="mt-8 flex flex-wrap justify-center gap-2" stagger={0.04}>
          {families.map((f) => (
            <Link key={f.slug} href={`/families/${f.slug}`} className="eyebrow flex items-center gap-2 rounded-full border hairline px-3.5 py-2 transition-colors hover:border-ink">
              <span className="h-2 w-2 rounded-full" style={{ background: familyInk(f) }} />
              {f.name}
            </Link>
          ))}
        </Reveal>
        {product.description.map((para, i) => (
          <Reveal
            key={i}
            as="p"
            className={i === 0 ? "display mt-12 text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.02]" : "mx-auto mt-10 max-w-xl text-[15px] leading-relaxed text-ink-2"}
            delay={i * 0.1}
          >
            {para}
          </Reveal>
        ))}
      </section>

      {/* Fragrance pyramid in three acts */}
      <section className="border-t hairline bg-paper-2">
        <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-28 md:px-10 xl:px-28">
          <SectionHeading eyebrow="Fragrance pyramid" before="The story" script="in" after="three acts" />
        </div>
        <ThreeActs acts={acts} />
      </section>

      <ScentProfile product={product} />
      <WearGuide product={product} />
      <ComparedTo product={product} />
      <HowToWear />
      <div id="reviews">
        <Reviews product={product} />
      </div>
      <Faq product={product} />

      <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
        <SectionHeading eyebrow="Pair it with" before="You may also" script="love" />
        <Reveal className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4" stagger={0.06}>
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </Reveal>
      </section>
    </>
  );
}
