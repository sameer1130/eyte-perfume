import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { Scene } from "@/components/botanica/Scene";
import { INSTAGRAM_URL } from "@/components/layout/Footer";
import { Bottle } from "@/components/product/Bottle";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAMILY_LIST, type FamilySlug } from "@/data/families";
import { PRODUCTS } from "@/data/products";
import { bestsellers, getProduct, productsInFamily } from "@/lib/catalog";
import { FamilyCard } from "./FamilyCard";
import { NewsletterForm } from "./NewsletterForm";

export function HouseIntro() {
  return (
    <section className="relative overflow-hidden py-[clamp(7rem,18vh,12rem)]">
      <Scene family="floral" sides={["left"]} plantWidth="min(34vw, 460px)" particles={false} glow={false} />
      <div className="relative mx-auto max-w-[1100px] px-5 text-center">
        <Reveal as="p" className="eyebrow text-ink-2" y={14}>
          The house
        </Reveal>
        <RevealLines className="display mt-8 text-[clamp(2rem,4.4vw,4.2rem)] leading-[0.95]">
          EYTE brings the most-loved perfumes of the Middle East and the world&apos;s great maisons together, 100% original, long lasting and shipped worldwide.
        </RevealLines>
        <Reveal className="mx-auto mt-14 max-w-[22rem] text-[14px] leading-relaxed text-ink-2" delay={0.15}>
          From the oud and amber of the Gulf to the icons of Paris and Milan, every bottle is chosen for character, lasting power and the compliments it earns.
        </Reveal>
        <Reveal className="mt-12 flex justify-center" delay={0.25}>
          <Monogram className="h-14 w-auto" />
        </Reveal>
      </div>
    </section>
  );
}

export function FamilyGrid() {
  return (
    <section id="families" className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10 xl:px-28">
      <SectionHeading eyebrow="Shop by scent family" before="Six moods," script="one" after="signature" />
      <Reveal className="mx-auto mt-10 max-w-md text-center text-[14px] leading-relaxed text-ink-2" delay={0.1}>
        Every perfume belongs to a family. Find yours by the notes you already love, and watch each one come to life in the breeze.
      </Reveal>
      <Reveal className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {FAMILY_LIST.map((fam, i) => (
          <FamilyCard key={fam.slug} family={fam} index={i} count={productsInFamily(fam.slug).length} />
        ))}
      </Reveal>
    </section>
  );
}

const ACTS: { n: string; title: string; tier: string; time: string; text: string; family: FamilySlug }[] = [
  {
    n: "I",
    title: "The opening",
    tier: "Top notes",
    time: "First 15 minutes",
    text: "Bright and fleeting. Citrus, fruit and spice that catch attention the moment you spray.",
    family: "citrus",
  },
  {
    n: "II",
    title: "The heart",
    tier: "Heart notes",
    time: "30 minutes – 4 hours",
    text: "The true character blooms on warm skin: florals, fruits and spices settle in.",
    family: "floral",
  },
  {
    n: "III",
    title: "The signature",
    tier: "Base notes",
    time: "4 hours and beyond",
    text: "Woods, amber, musk and vanilla. What lingers on your skin, and in memory.",
    family: "gourmand",
  },
];

export function ThreeActsIntro() {
  return (
    <section className="relative overflow-hidden bg-paper-2 py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 xl:px-28">
        <SectionHeading eyebrow="How a perfume unfolds" before="Every perfume tells" script="a story in" after="three acts" />
        <Reveal className="mt-20 grid gap-10 md:grid-cols-3 md:gap-6" stagger={0.12}>
          {ACTS.map((act) => (
            <article key={act.n} className="text-center">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-t-full bg-paper">
                <Scene family={act.family} sides={["right"]} plantWidth="120%" offset="-14%" density={0.4} seed={7} />
                <span className="display absolute inset-x-0 bottom-6 text-[96px] leading-none text-ink/90">{act.n}</span>
              </div>
              <p className="eyebrow mt-8 text-mute">
                {act.tier} · {act.time}
              </p>
              <h3 className="display mt-3 text-5xl">{act.title}</h3>
              <p className="mx-auto mt-4 max-w-[19rem] text-[14px] leading-relaxed text-ink-2">{act.text}</p>
            </article>
          ))}
        </Reveal>
        <Reveal className="mt-16 text-center">
          <p className="script text-5xl text-gold">Which one is yours?</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Bestsellers() {
  const items = bestsellers(8);
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading eyebrow="Bestsellers" before="The most" script="loved" align="left" className="text-center md:text-left" />
        <Reveal>
          <Link href="/shop" className="btn btn-ghost">
            View all {PRODUCTS.length} perfumes
          </Link>
        </Reveal>
      </div>
      <Reveal className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4" stagger={0.06}>
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Reveal>
    </section>
  );
}

export function Collections() {
  const me = ["lattafa-khamrah", "lattafa-oud-for-glory", "lattafa-yara"].map((s) => getProduct(s)!);
  const intl = ["dior-sauvage", "mfk-baccarat-rouge-540", "ysl-libre"].map((s) => getProduct(s)!);
  return (
    <section className="grid md:grid-cols-2">
      <Link href="/shop?collection=middle-eastern" className="group relative flex min-h-[620px] flex-col overflow-hidden bg-ink p-8 text-paper md:min-h-[760px] md:p-14">
        <Scene family="woody" sides={[]} density={0.8} glow={false} lightSmoke />
        <div className="relative">
          <p className="eyebrow text-gold-2">From the Gulf</p>
          <h3 className="display mt-5 text-[clamp(3.4rem,6vw,6rem)]">Middle Eastern</h3>
          <p className="script -mt-2 text-5xl text-gold-2">Arabian nights</p>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-paper/75">
            Oud, saffron, amber and rose: the rich, long-lasting perfumery of Dubai and beyond, from Lattafa, Afnan, Rasasi and more.
          </p>
        </div>
        <div className="relative mt-auto flex items-end justify-center gap-2 pt-10">
          {me.map((p, i) => (
            <Bottle
              key={p.slug}
              product={p}
              idSuffix="-col"
              className={`h-auto w-[30%] max-w-[170px] transition-transform duration-[1200ms] ease-[var(--ease-expo)] ${i === 1 ? "group-hover:-translate-y-6" : "group-hover:-translate-y-3"}`}
            />
          ))}
        </div>
        <span className="eyebrow link-underline relative mt-8 self-start">Shop Middle Eastern</span>
      </Link>
      <Link href="/shop?collection=international" className="group relative flex min-h-[620px] flex-col overflow-hidden bg-paper-3 p-8 md:min-h-[760px] md:p-14">
        <Scene family="aquatic" sides={[]} density={0.7} glow={false} />
        <div className="relative">
          <p className="eyebrow text-ink-2">From the maisons</p>
          <h3 className="display mt-5 text-[clamp(3.4rem,6vw,6rem)]">International</h3>
          <p className="script -mt-2 text-5xl text-gold">Iconic</p>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-2">
            The designer and niche icons the world falls for, from Paris to Milan: Dior, Yves Saint Laurent, Tom Ford, Maison Francis Kurkdjian.
          </p>
        </div>
        <div className="relative mt-auto flex items-end justify-center gap-2 pt-10">
          {intl.map((p, i) => (
            <Bottle
              key={p.slug}
              product={p}
              idSuffix="-col"
              className={`h-auto w-[30%] max-w-[170px] transition-transform duration-[1200ms] ease-[var(--ease-expo)] ${i === 1 ? "group-hover:-translate-y-6" : "group-hover:-translate-y-3"}`}
            />
          ))}
        </div>
        <span className="eyebrow link-underline relative mt-8 self-start">Shop International</span>
      </Link>
    </section>
  );
}

const PROMISES = [
  {
    title: "100% original",
    text: "Authentic perfumes only. What you see is exactly what you receive.",
    icon: "M12 2l7 3v6c0 5-3 9-7 11-4-2-7-6-7-11V5Zm-3 10 2 2 4-4",
  },
  {
    title: "Long lasting",
    text: "Chosen for performance: scents that stay with you from morning to night.",
    icon: "M7 2h10M7 22h10M8 2c0 5 8 7 8 10s-8 5-8 10M16 2c0 5-8 7-8 10s8 5 8 10",
  },
  {
    title: "Worldwide shipping",
    text: "Carefully packed and tracked, wherever you are.",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-10 10h20M12 2c3 3 4 6.5 4 10s-1 7-4 10c-3-3-4-6.5-4-10s1-7 4-10Z",
  },
  {
    title: "Gift-ready",
    text: "Every order arrives beautifully wrapped, ready to give.",
    icon: "M3 9h18v4H3zM5 13h14v8H5zM12 9v12M12 9c-2-4-6-4-6-1.5S10 9 12 9Zm0 0c2-4 6-4 6-1.5S14 9 12 9Z",
  },
];

export function PromiseStrip() {
  return (
    <section id="promise" className="border-y hairline">
      <Reveal className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4" stagger={0.06}>
        {PROMISES.map((p, i) => (
          <div key={p.title} className={`px-5 py-12 text-center md:px-8 ${i > 0 ? "md:border-l hairline" : ""} ${i % 2 ? "border-l hairline md:border-l" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""}`}>
            <svg viewBox="0 0 24 24" className="mx-auto h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={p.icon} />
            </svg>
            <h3 className="display mt-5 text-3xl">{p.title}</h3>
            <p className="mx-auto mt-2 max-w-[15rem] text-[13px] leading-relaxed text-ink-2">{p.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function SocialSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <Scene family="citrus" sides={["right"]} plantWidth="min(30vw, 420px)" density={0.5} />
      <div className="relative mx-auto max-w-[900px] px-5 text-center">
        <SectionHeading eyebrow="@eyte.perfumes" before="Follow the" script="scent" after="trail" />
        <Reveal className="mx-auto mt-10 max-w-md text-[14px] leading-relaxed text-ink-2" delay={0.1}>
          New arrivals, honest reviews and the stories behind every bottle. Join us on Instagram, or get first word of new drops by email.
        </Reveal>
        <Reveal className="mt-10 flex flex-col items-center gap-6" delay={0.2}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn btn-ink">
            Follow on Instagram
          </a>
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
