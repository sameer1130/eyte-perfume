"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gustBy } from "@/components/botanica/engine";
import { Scene } from "@/components/botanica/Scene";
import { FAMILIES, FAMILY_SLUGS, type FamilySlug } from "@/data/families";
import { ScentTrail } from "./ScentTrail";

const CYCLE_MS = 7500;

export function Hero() {
  const [active, setActive] = useState<FamilySlug>("floral");
  const [leaving, setLeaving] = useState<FamilySlug | null>(null);
  const [auto, setAuto] = useState(true);
  const fam = FAMILIES[active];
  // Rising plants share the bottom edge with the scent trail, so keep them smaller.
  const plantWidth = (f: FamilySlug) => (FAMILIES[f].growth === "rise" ? "clamp(190px, 30vw, 440px)" : "clamp(250px, 42vw, 640px)");

  const choose = (next: FamilySlug) => {
    if (next === active) return;
    setLeaving(active);
    setActive(next);
    gustBy(0.9, 1);
  };

  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => {
      const i = FAMILY_SLUGS.indexOf(active);
      setLeaving(active);
      setActive(FAMILY_SLUGS[(i + 1) % FAMILY_SLUGS.length]);
      gustBy(0.9, 1);
    }, CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, auto]);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), 1400);
    return () => window.clearTimeout(id);
  }, [leaving]);

  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden" style={{ height: "100svh" }}>
      {leaving && (
        <div key={`out-${leaving}`} className="absolute inset-0 animate-[fade-in_1.2s_var(--ease-soft)_reverse_forwards]">
          <Scene family={leaving} sides={["right", "left"]} plantWidth={plantWidth(leaving)} />
        </div>
      )}
      <div key={`in-${active}`} className="intro-fade absolute inset-0">
        <Scene family={active} sides={["right", "left"]} plantWidth={plantWidth(active)} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-20 text-center">
        <p className="eyebrow intro-rise text-ink-2" style={{ animationDelay: "0.1s" }}>
          Authentic luxury perfumes · Middle Eastern &amp; International
        </p>
        <h1 className="display mt-6 text-[clamp(3.2rem,12.5vw,10.5rem)]">
          <span className="intro-rise block" style={{ animationDelay: "0.2s" }}>
            Luxury that
          </span>{" "}
          <span
            className="script intro-rise relative z-10 -my-[0.16em] block text-[0.64em] transition-colors duration-1000"
            style={{ color: fam.colors.accent, animationDelay: "0.45s" }}
          >
            lingers
          </span>{" "}
          <span className="intro-rise block" style={{ animationDelay: "0.3s" }}>
            beyond borders
          </span>
        </h1>
        <div className="intro-rise mt-10 flex flex-col items-center gap-3 sm:flex-row" style={{ animationDelay: "0.6s" }}>
          <Link href="/shop" className="btn btn-ink">
            Explore the collection
          </Link>
          <Link href={`/families/${active}`} className="btn btn-ghost bg-paper/60 backdrop-blur">
            Shop {fam.short.toLowerCase()} scents
          </Link>
        </div>
      </div>

      <div className="intro-fade relative z-10 pb-6 md:pb-10" style={{ animationDelay: "0.8s" }}>
        <ScentTrail
          active={active}
          onSelect={(f) => {
            setAuto(false);
            choose(f);
          }}
        />
      </div>
    </section>
  );
}
