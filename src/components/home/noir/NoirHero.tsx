import Image from "next/image";
import Link from "next/link";
import { Particles } from "@/components/botanica/Particles";

/**
 * Left-aligned serif headline beside a bottle on dark stone, wreathed in
 * gold dust and smoke. The photograph is feathered into the black so it reads
 * as part of the page rather than a framed picture.
 */
export function NoirHero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-paper" style={{ height: "100svh" }}>
      <div className="absolute inset-0 bg-[radial-gradient(42%_58%_at_74%_46%,rgb(201_164_92/0.2),transparent_72%)]" aria-hidden="true" />

      {/* Photography: Unsplash (see public/images/stock/CREDITS.txt). */}
      <div
        className="absolute inset-x-0 top-0 h-[64%] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] lg:inset-x-auto lg:right-[3%] lg:top-[9%] lg:h-[86%] lg:w-[50%] lg:[mask-image:radial-gradient(closest-side,#000_58%,transparent)]"
        aria-hidden="true"
      >
        <Image
          src="/images/stock/hero-royal-smoke.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="animate-ken-burns object-cover"
          style={{ objectPosition: "50% 58%" }}
        />
        {/* Warms the white smoke to gold; blacks stay black under multiply. */}
        <div className="absolute inset-0 bg-[#d9a94f] opacity-80 mix-blend-multiply" />
      </div>

      <Particles family="gold-smoke" className="pointer-events-none absolute inset-y-0 right-0 h-full w-full lg:w-[62%]" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-paper)_44%,transparent_72%)] lg:bg-[linear-gradient(90deg,var(--color-paper)_28%,transparent_58%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-5 pb-24 md:px-10 lg:items-center lg:pb-0 xl:px-28">
        <div className="max-w-[720px]">
          <p className="eyebrow intro-fade text-gold-2">
            EYTE International<span className="hidden sm:inline"> · Authentic luxury perfumes</span>
          </p>
          <h1 className="display intro-rise mt-6 text-[clamp(2.6rem,4.3vw,4.6rem)]">
            Excellence, Bottled.
            <br />
            Luxury Beyond Borders.
          </h1>
          <p className="intro-rise mt-7 max-w-[30rem] text-[15px] leading-relaxed text-ink-2" style={{ animationDelay: "0.15s" }}>
            The Middle East&apos;s most-loved perfumes and the world&apos;s great maisons. Deep oud, rare amber and soft musks, 100%
            original and chosen to leave an unforgettable impression.
          </p>
          <div className="intro-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
            <Link href="/shop" className="btn btn-ink">
              Explore the collection
            </Link>
            <Link href="/families" className="btn btn-ghost">
              Discover the notes
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#masterpieces"
        aria-label="Scroll to the masterpieces"
        className="absolute bottom-6 left-1/2 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center text-gold-2 transition-transform hover:translate-y-1"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="m5 9 7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}
