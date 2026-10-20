import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Scene } from "@/components/botanica/Scene";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAMILIES, FAMILY_LIST, FAMILY_SLUGS, isFamilySlug } from "@/data/families";
import { PRODUCTS } from "@/data/products";
import { productsInFamily, tierFamily, TIERS } from "@/lib/catalog";

export function generateStaticParams() {
  return FAMILY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/families/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isFamilySlug(slug)) return {};
  const fam = FAMILIES[slug];
  return { title: `${fam.name} Perfumes`, description: fam.description };
}

export default function FamilyPage({ params }: PageProps<"/families/[slug]">) {
  return (
    <Suspense fallback={<section className="min-h-svh animate-pulse bg-paper-2" aria-busy="true" />}>
      <FamilyContent params={params} />
    </Suspense>
  );
}

async function FamilyContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isFamilySlug(slug)) notFound();
  const fam = FAMILIES[slug];
  const index = FAMILY_SLUGS.indexOf(slug);
  const primary = productsInFamily(slug);
  // Perfumes from other families with an act led by this one.
  const accents = PRODUCTS.filter((p) => p.family !== slug && TIERS.some((t) => tierFamily(p, t) === slug));

  return (
    <>
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-36 text-center" style={{ background: fam.colors.soft }}>
        <Scene family={slug} sides={["right", "left"]} plantWidth="clamp(240px, 44vw, 680px)" />
        <div className="relative">
          <nav aria-label="Breadcrumb" className="eyebrow text-ink-2">
            <Link href="/families" className="link-grow">
              Scent families
            </Link>
            <span className="mx-2 text-mute">/</span>
            <span>0{index + 1}</span>
          </nav>
          <h1 className="display intro-rise mt-6 text-[clamp(4rem,12vw,12rem)]">{fam.name}</h1>
          <p className="script intro-rise -mt-[0.1em] text-[clamp(3rem,7vw,6.5rem)] leading-none" style={{ color: fam.colors.accent, animationDelay: "0.2s" }}>
            {fam.word}
          </p>
          <p className="intro-rise mx-auto mt-8 max-w-lg text-[15px] leading-relaxed text-ink-2" style={{ animationDelay: "0.3s" }}>
            {fam.description}
          </p>
          <div className="intro-rise mt-8 flex flex-wrap justify-center gap-2" style={{ animationDelay: "0.4s" }}>
            {fam.keyNotes.map((n) => (
              <span key={n} className="eyebrow rounded-full border hairline bg-paper/70 px-3 py-1.5 backdrop-blur">
                {n}
              </span>
            ))}
          </div>
          <p className="eyebrow intro-rise mt-6 text-mute" style={{ animationDelay: "0.5s" }}>
            Wears best · {fam.wearsBest}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
        <SectionHeading eyebrow={`${primary.length} ${primary.length === 1 ? "perfume" : "perfumes"}`} before={fam.short} script="signatures" scriptColor={fam.colors.accent} />
        <Reveal className="mt-16 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4" stagger={0.06}>
          {primary.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </Reveal>
      </section>

      {accents.length > 0 && (
        <section className="border-t hairline">
          <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
            <SectionHeading eyebrow={`With a touch of ${fam.short.toLowerCase()}`} before="Also" script="featuring" scriptColor={fam.colors.accent} />
            <Reveal className="mx-auto mt-6 max-w-md text-center text-[14px] text-ink-2">
              Perfumes from other families where {fam.name.toLowerCase()} leads one of the three acts.
            </Reveal>
            <Reveal className="mt-16 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4" stagger={0.06}>
              {accents.slice(0, 8).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section className="border-t hairline bg-paper-2">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 xl:px-28">
          <p className="eyebrow text-center text-mute">Explore another family</p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            {FAMILY_LIST.filter((f) => f.slug !== slug).map((f) => (
              <Link key={f.slug} href={`/families/${f.slug}`} className="group rounded-[3px] p-5 transition-colors" style={{ background: f.colors.soft }}>
                <span className="h-2 w-2 rounded-full" style={{ background: f.colors.accent, display: "block" }} />
                <span className="display mt-6 block text-3xl leading-[0.95]">{f.name}</span>
                <span className="script mt-1 block text-2xl" style={{ color: f.colors.accent }}>
                  {f.word}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
