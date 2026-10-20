"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gustBy } from "@/components/botanica/engine";
import { Scene } from "@/components/botanica/Scene";
import { FAMILIES, type FamilySlug } from "@/data/families";

export type ActData = {
  n: string;
  tier: string;
  title: string;
  time: string;
  family: FamilySlug;
  notes: { name: string; family: FamilySlug | null }[];
};

function ActScene({ act, index }: { act: ActData; index: number }) {
  return <Scene family={act.family} sides={["left", "right"]} plantWidth="min(30vw, 460px)" seed={index * 7 + 2} density={0.8} />;
}

/**
 * The fragrance pyramid told as three acts. On large screens the left stage
 * stays pinned and its botanicals change to whichever family leads the act
 * currently in view.
 */
export function ThreeActs({ acts }: { acts: ActData[] }) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const activeRef = useRef(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.act);
          if (i === activeRef.current) continue;
          setLeaving(activeRef.current);
          setActive(i);
          activeRef.current = i;
          gustBy(0.8, i > 0 ? 1 : -1);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blocks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (leaving === null) return;
    const id = window.setTimeout(() => setLeaving(null), 1300);
    return () => window.clearTimeout(id);
  }, [leaving]);

  const fam = FAMILIES[acts[active].family];

  return (
    <div className="relative lg:grid lg:grid-cols-2">
      <div
        className="sticky top-0 hidden h-svh overflow-hidden transition-colors duration-1000 lg:block"
        style={{ background: fam.colors.soft }}
        aria-hidden="true"
      >
        {leaving !== null && (
          <div key={`out-${leaving}`} className="absolute inset-0 animate-[fade-in_1.2s_var(--ease-soft)_reverse_forwards]">
            <ActScene act={acts[leaving]} index={leaving} />
          </div>
        )}
        <div key={`in-${active}`} className="intro-fade absolute inset-0">
          <ActScene act={acts[active]} index={active} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span key={`n-${active}`} className="display intro-rise text-[clamp(8rem,15vw,15rem)] leading-[0.8]">
            {acts[active].n}
          </span>
          <span key={`w-${active}`} className="script intro-rise mt-2 text-6xl transition-colors" style={{ color: fam.colors.accent, animationDelay: "0.1s" }}>
            {fam.word}
          </span>
          <span className="eyebrow halo mt-4 text-ink-2">Led by {fam.name}</span>
        </div>
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3">
          {acts.map((a, i) => (
            <span key={a.n} className="h-1 rounded-full bg-ink transition-all duration-700" style={{ width: i === active ? 32 : 8, opacity: i === active ? 1 : 0.25 }} />
          ))}
        </div>
      </div>

      <div>
        {acts.map((act, i) => {
          const af = FAMILIES[act.family];
          return (
            <section
              key={act.n}
              data-act={i}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              className="flex min-h-[90svh] flex-col justify-center px-5 py-20 md:px-10 lg:min-h-svh lg:px-16 xl:px-24"
            >
              <div className="relative mb-10 aspect-[4/3] overflow-hidden rounded-[3px] lg:hidden" style={{ background: af.colors.soft }} aria-hidden="true">
                <ActScene act={act} index={i} />
                <span className="display absolute inset-0 flex items-center justify-center text-[9rem] leading-none">{act.n}</span>
              </div>
              <p className="eyebrow text-mute">
                Act {act.n} · {act.tier} · {act.time}
              </p>
              <h3 className="display mt-4 text-[clamp(3.2rem,5vw,5rem)]">{act.title}</h3>
              <Link
                href={`/families/${act.family}`}
                className="eyebrow mt-5 inline-flex items-center gap-2 self-start rounded-full border hairline px-3.5 py-2 transition-colors hover:border-ink"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: af.colors.accent }} />
                {af.name}
              </Link>
              <ul className="mt-10 border-t hairline">
                {act.notes.map((note) => {
                  const nf = note.family ? FAMILIES[note.family] : null;
                  return (
                    <li key={note.name} className="flex items-baseline justify-between gap-4 border-b hairline py-4">
                      <span className="display text-[clamp(2rem,3vw,2.8rem)] leading-none">{note.name}</span>
                      <span className="eyebrow flex shrink-0 items-center gap-2 text-mute">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: nf?.colors.accent ?? "var(--color-mute)" }} />
                        {nf?.short ?? "Skin"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
