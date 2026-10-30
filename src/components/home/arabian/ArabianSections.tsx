import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { Scene } from "@/components/botanica/Scene";
import { ProductImage } from "@/components/product/ProductImage";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS, INSTAGRAM_URL } from "@/data/instagram";
import { PRODUCTS } from "@/data/products";
import { getProduct } from "@/lib/catalog";
import { NewsletterForm } from "../NewsletterForm";
import { Marquee, Mashrabiya, StarGlyph } from "./Ornaments";

/** Two crossed ribbons of scrolling phrases. */
export function RibbonBand() {
  return (
    <section className="relative overflow-hidden py-16" aria-label="EYTE promises">
      <div className="-mx-4 -rotate-[2.5deg] border-y border-gold/30 bg-[linear-gradient(90deg,#2a170f,#432817,#2a170f)] py-5">
        <Marquee
          items={["Signature scent", "Arabian oud", "100% original", "Long lasting", "Worldwide shipping", "Excellence beyond borders"]}
          itemClassName="display text-[clamp(1.6rem,3vw,2.6rem)] gold-text"
        />
      </div>
      <div className="-mx-4 -mt-3 rotate-[1.5deg] border-y border-ink/10 bg-[linear-gradient(90deg,#101010,#262626,#101010)] py-4">
        <Marquee
          reverse
          items={["Oud", "Amber", "Saffron", "Rose", "Vanilla", "Musk", "Coffee", "Sandalwood"]}
          itemClassName="eyebrow text-[13px] text-ink/80"
        />
      </div>
    </section>
  );
}

/** "Some fragrances are more than a scent": EYTE's own campaign line, with real imagery. */
export function RitualEditorial() {
  return (
    <section className="relative overflow-hidden bg-paper-2 py-28 md:py-36">
      <Mashrabiya id="ritual-lattice" className="text-gold opacity-25" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-20 px-5 md:px-10 lg:grid-cols-2 xl:px-28">
        <Reveal className="relative mx-auto w-full max-w-[480px] pb-24 pr-10 md:pr-24">
          <div className="relative">
            <div className="absolute -inset-3 rounded-t-full border border-gold/30" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full">
              <Image
                src="/images/stock/ritual-bakhoor.webp"
                alt="A brass bakhoor burner releasing a ribbon of incense smoke"
                fill
                sizes="(min-width: 1024px) 420px, 80vw"
                className="object-cover"
                style={{ objectPosition: "50% 55%" }}
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 aspect-square w-[55%] overflow-hidden rounded-full border-[6px] border-paper-2 shadow-2xl">
            <Image
              src="/images/instagram/oud-roses-tray.webp"
              alt="Oud & Roses on a gold tray with red roses and candlelight"
              fill
              sizes="260px"
              className="object-cover"
              style={{ objectPosition: "38% 50%" }}
            />
          </div>
          <Monogram className="absolute left-0 top-6 h-14 w-auto text-gold-2 md:-left-6" />
        </Reveal>

        <div>
          <Reveal as="p" className="eyebrow text-gold-2" y={14}>
            The EYTE ritual
          </Reveal>
          <RevealLines className="display mt-6 text-[clamp(2.8rem,5.4vw,5.4rem)]">
            Some fragrances are more than a <span className="gold-text italic">scent</span>
          </RevealLines>
          <Reveal className="mt-8 max-w-md space-y-4 text-[15px] leading-relaxed text-ink-2">
            <p>
              They are the last thing you put on before a wedding, the trail you leave in a majlis, the gift that says what words cannot.
            </p>
            <p>We bring you the Middle East&apos;s most loved perfumes and the world&apos;s great maisons: authentic, long lasting and ready to wear.</p>
          </Reveal>
          <Reveal className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t hairline pt-8" stagger={0.08}>
            {[
              ["100%", "Original"],
              [String(PRODUCTS.length), "Curated scents"],
              ["6", "Scent families"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="display gold-text text-4xl">{n}</p>
                <p className="eyebrow mt-2 text-mute">{l}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <Link href="/shop" className="btn btn-ink">
              Explore the collection
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Rasasi bottles from the catalogues, lined up on the Middle Eastern card. */
const GULF_TRIO = ["nylaa-zahab-al-sahara", "im-rasasi-luxora", "nylaa-72-le-voyage"];

export function CollectionsArabian() {
  const trio = GULF_TRIO.map((s) => getProduct(s)!);
  const sauvage = getProduct("dior-sauvage")!;
  return (
    <section className="mx-auto grid max-w-[1400px] gap-5 px-5 py-28 md:grid-cols-2 md:px-10 xl:px-28">
      <Link href="/shop?collection=middle-eastern" className="group relative flex min-h-[640px] flex-col overflow-hidden rounded-[28px] border border-gold/20 bg-[#0d0e10] p-8 md:p-12">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_55%_at_50%_100%,rgb(211_175_107/0.22),transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_20%_0%,rgb(255_255_255/0.07),transparent_70%)]" />
        <div className="absolute inset-x-[8%] bottom-[7%] flex h-[44%] items-end justify-center gap-[3%]">
          {trio.map((p, i) => (
            <div
              key={p.slug}
              className={`relative w-[30%] transition-transform duration-[1200ms] ease-[var(--ease-expo)] ${i === 1 ? "h-full group-hover:-translate-y-5" : "h-[86%] group-hover:-translate-y-2.5"}`}
            >
              <ProductImage product={p} sizes="(min-width: 768px) 15vw, 30vw" cutoutClassName="inset-0" />
            </div>
          ))}
        </div>
        <div className="relative">
          <p className="eyebrow text-gold-2">From the Gulf</p>
          <h3 className="display mt-4 text-[clamp(2.6rem,3.6vw,4rem)]">Middle Eastern</h3>
          <p className="arabic mt-1 text-5xl text-gold-2" lang="ar" dir="rtl">
            عود
          </p>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-2">
            Oud, saffron, amber and rose from Lattafa and Rasasi, including the I&apos;m Rasasi and Nylaa lines: rich, long-lasting perfumery made to be noticed.
          </p>
        </div>
        <span className="eyebrow link-underline relative mt-6 self-start text-gold-2">Shop Middle Eastern</span>
      </Link>

      <Link href="/shop?collection=international" className="group relative flex min-h-[640px] flex-col overflow-hidden rounded-[28px] border border-gold/20 bg-[#0a0a0b] p-8 md:p-12">
        <ProductImage
          product={sauvage}
          sizes="(min-width: 768px) 50vw, 100vw"
          photoClassName="inset-x-0 bottom-0 h-[58%]"
          className="transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_bottom,#0a0a0b_0%,rgb(10_10_11/0.65)_28%,transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_0%,rgb(255_255_255/0.07),transparent_70%)]" />
        <div className="relative">
          <p className="eyebrow text-gold-2">From the maisons</p>
          <h3 className="display mt-4 text-[clamp(2.6rem,3.6vw,4rem)]">International</h3>
          <p className="script mt-1 text-5xl text-gold-2">Iconic</p>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-2">
            Designer icons from the great maisons, starting with Dior Sauvage Eau de Parfum.
          </p>
        </div>
        <span className="eyebrow link-underline relative mt-6 self-start text-gold-2">Shop International</span>
      </Link>
    </section>
  );
}

export function InstagramWall() {
  return (
    <section className="relative overflow-hidden border-t hairline py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 xl:px-28">
        <SectionHeading eyebrow={`@${INSTAGRAM_HANDLE}`} before="As seen on" script="our" after="Instagram" scriptColor="var(--color-gold-2)" />
        <Reveal className="mt-16 grid grid-cols-2 items-start gap-3 md:grid-cols-3 lg:grid-cols-6" stagger={0.06}>
          {INSTAGRAM_POSTS.map((post, i) => (
            <a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              className={`group relative block overflow-hidden rounded-[18px] border border-gold/15 ${i % 2 ? "lg:mt-10" : ""}`}
            >
              <div className="relative aspect-[9/14]">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 46vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
                  style={post.focus ? { objectPosition: post.focus } : undefined}
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-[linear-gradient(to_top,rgb(10_10_10/0.85),transparent_55%)] p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="eyebrow text-gold-2">{post.kind === "reel" ? "Watch reel" : "View post"} ↗</span>
              </div>
            </a>
          ))}
        </Reveal>
        <Reveal className="mt-12 text-center">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function NightClose() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(70%_80%_at_50%_100%,#2a2a2a,transparent_70%)] py-32">
      <Scene family="woody" sides={[]} density={0.6} glow={false} lightSmoke />
      <div className="relative mx-auto max-w-[900px] px-5 text-center">
        <StarGlyph className="mx-auto h-5 w-5 text-gold-2" />
        <SectionHeading eyebrow="First to know" before="New arrivals," script="every" after="moonrise" scriptColor="var(--color-gold-2)" className="mt-6" />
        <Reveal className="mx-auto mt-10 max-w-md text-[14px] leading-relaxed text-ink-2">
          Fresh drops from Dubai and Paris, restocks of the ones that sell out, and the occasional private offer.
        </Reveal>
        <Reveal className="mt-10 flex justify-center">
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
