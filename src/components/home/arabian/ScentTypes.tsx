"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { gustBy } from "@/components/botanica/engine";
import { Scene } from "@/components/botanica/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { FAMILIES, FAMILY_LIST, type FamilySlug } from "@/data/families";
import { cn } from "@/lib/cn";
import { familyInk } from "@/lib/family-colors";

/* Photography: Unsplash (see public/images/stock/CREDITS.txt). */
const PHOTOS: Record<FamilySlug, { src: string; alt: string; focus: string }> = {
  citrus: { src: "/images/stock/family-citrus.webp", alt: "A neroli cologne among citrus fruit and orange blossom", focus: "58% 50%" },
  floral: { src: "/images/stock/family-floral.webp", alt: "A perfume bottle on a red flower floating on water", focus: "50% 58%" },
  gourmand: { src: "/images/stock/family-gourmand.webp", alt: "A frosted perfume bottle glowing among warm fairy lights", focus: "50% 55%" },
  woody: { src: "/images/stock/family-woody.webp", alt: "A dark amber bottle cradled by driftwood", focus: "50% 50%" },
  amber: { src: "/images/stock/family-amber.webp", alt: "A perfume bottle lit by a streak of golden light", focus: "50% 66%" },
  aquatic: { src: "/images/stock/family-aquatic.webp", alt: "A faceted glass bottle reflected on teal water", focus: "50% 55%" },
};

/**
 * ZENFOX-style "shop by scent type": a list of families on the left; the
 * hovered family's photograph fills an oval, and its botanicals sway over it.
 */
export function ScentTypes({ counts }: { counts: Record<FamilySlug, number> }) {
  const [active, setActive] = useState<FamilySlug>("woody");
  const [leaving, setLeaving] = useState<FamilySlug | null>(null);
  const fam = FAMILIES[active];

  const choose = (slug: FamilySlug) => {
    if (slug === active) return;
    setLeaving(active);
    setActive(slug);
    gustBy(0.5, 1);
  };

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), 1100);
    return () => window.clearTimeout(id);
  }, [leaving]);

  const stage = (slug: FamilySlug) => (
    <>
      <Image
        src={PHOTOS[slug].src}
        alt={PHOTOS[slug].alt}
        fill
        sizes="(min-width: 1024px) 440px, 90vw"
        className="animate-ken-burns object-cover"
        style={{ objectPosition: PHOTOS[slug].focus }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent_55%,rgb(10_10_10/0.55))]" />
      {/* The oval clips its corners, so hanging plants start outside it. */}
      <Scene family={slug} sides={["right", "left"]} plantWidth="92%" offset="-12%" density={0.45} lightSmoke glow={false} />
    </>
  );

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-5 md:px-10 lg:grid-cols-[1.1fr_1fr] xl:px-28">
        <div>
          <Reveal as="p" className="eyebrow text-gold-2" y={14}>
            Shop by scent type
          </Reveal>
          <ul className="mt-8">
            {FAMILY_LIST.map((f) => {
              const on = f.slug === active;
              return (
                <li key={f.slug}>
                  <Link
                    href={`/families/${f.slug}`}
                    onPointerEnter={() => choose(f.slug)}
                    onFocus={() => choose(f.slug)}
                    className="group flex items-center gap-4 py-2 md:py-2.5"
                  >
                    <svg
                      viewBox="0 0 48 12"
                      className={cn("h-3 shrink-0 text-gold-2 transition-all duration-700 ease-[var(--ease-expo)]", on ? "w-12 opacity-100" : "w-0 opacity-0")}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      aria-hidden="true"
                    >
                      <path d="M0 6h46M40 1l6 5-6 5" />
                    </svg>
                    <span
                      className={cn(
                        "display text-[clamp(1.9rem,3.3vw,3.4rem)] transition-colors duration-500 sm:whitespace-nowrap",
                        on ? "gold-text" : "text-ink/45 group-hover:text-ink/80",
                      )}
                    >
                      {f.name}
                    </span>
                    <sup className={cn("eyebrow transition-colors", on ? "text-gold-2" : "text-mute")}>{String(counts[f.slug]).padStart(2, "0")}</sup>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full border border-gold/30" aria-hidden="true" />
            <div className="relative aspect-[3/4.3] overflow-hidden rounded-full bg-paper-3">
              {leaving && (
                <div key={`out-${leaving}`} className="absolute inset-0 animate-[fade-in_1s_var(--ease-soft)_reverse_forwards]">
                  {stage(leaving)}
                </div>
              )}
              <div key={`in-${active}`} className="intro-fade absolute inset-0">
                {stage(active)}
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="script text-4xl" style={{ color: familyInk(fam) }}>
              {fam.word}
            </p>
            <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-ink-2">{fam.tagline}</p>
            <Link href={`/families/${active}`} className="eyebrow link-underline mt-5 inline-block text-gold-2">
              Explore {fam.short.toLowerCase()}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
