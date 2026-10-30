import type { Metadata } from "next";
import Link from "next/link";
import { Scene } from "@/components/botanica/Scene";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAMILY_LIST } from "@/data/families";
import { productsInFamily } from "@/lib/catalog";
import { familyInk, familySurface } from "@/lib/family-colors";

export const metadata: Metadata = {
  title: "Scent Families",
  description: "Six scent families, from bright citrus to smoky oud. Find the mood that's yours.",
};

export default function FamiliesPage() {
  return (
    <>
      <section className="relative pb-20 pt-40 md:pt-48">
        <SectionHeading eyebrow="The fragrance wheel, simplified" before="Six" script="scent" after="families" size="lg" />
        <Reveal className="mx-auto mt-10 max-w-lg px-5 text-center text-[14px] leading-relaxed text-ink-2" delay={0.1}>
          Every note in every perfume belongs to one of six families. Each has its own atmosphere: scroll through and feel the air change.
        </Reveal>
      </section>
      {FAMILY_LIST.map((fam, i) => {
        const count = productsInFamily(fam.slug).length;
        const flip = i % 2 === 1;
        return (
          <section key={fam.slug} className="relative flex min-h-[92svh] items-center overflow-hidden" style={{ background: i % 2 ? "var(--color-paper)" : familySurface(fam) }}>
            <Scene family={fam.slug} sides={flip ? ["left"] : ["right"]} plantWidth="clamp(280px, 52vw, 760px)" seed={i + 11} />
            <div className={`relative mx-auto flex w-full max-w-[1400px] px-5 md:px-10 xl:px-28 ${flip ? "justify-end" : "justify-start"}`}>
              <div className="max-w-xl">
                <p className="eyebrow text-ink-2">
                  0{i + 1} · {count} {count === 1 ? "perfume" : "perfumes"}
                </p>
                <RevealLines as="h2" className="display mt-5 text-[clamp(3.6rem,8vw,8rem)]">
                  {fam.name}
                </RevealLines>
                <p className="script -mt-2 text-[clamp(2.6rem,5vw,4.4rem)] leading-none" style={{ color: familyInk(fam) }}>
                  {fam.word}
                </p>
                <Reveal className="mt-6 text-[15px] leading-relaxed text-ink-2">{fam.description}</Reveal>
                <Reveal className="mt-6 flex flex-wrap gap-2" stagger={0.04}>
                  {fam.keyNotes.map((n) => (
                    <span key={n} className="eyebrow rounded-full border hairline bg-paper/60 px-3 py-1.5 backdrop-blur">
                      {n}
                    </span>
                  ))}
                </Reveal>
                <p className="eyebrow mt-6 text-mute">Wears best · {fam.wearsBest}</p>
                <Link href={`/families/${fam.slug}`} className="btn btn-ink mt-9">
                  Explore {fam.short.toLowerCase()} perfumes
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
