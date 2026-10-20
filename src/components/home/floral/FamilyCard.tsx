"use client";

import Link from "next/link";
import { gustBy } from "@/components/botanica/engine";
import { Scene } from "@/components/botanica/Scene";
import type { Family } from "@/data/families";

export function FamilyCard({ family, index, count }: { family: Family; index: number; count: number }) {
  // Hanging plants fill the top of the card, rising ones the bottom: put the text on the other side.
  const rise = family.growth === "rise";
  return (
    <Link
      href={`/families/${family.slug}`}
      onPointerEnter={() => gustBy(0.6, index % 2 ? -1 : 1)}
      className={`group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[3px] p-6 md:p-7 ${rise ? "justify-start" : "justify-end"}`}
      style={{ background: family.colors.soft }}
    >
      <Scene
        family={family.slug}
        sides={["right"]}
        plantWidth={rise ? "104%" : "88%"}
        offset="-8%"
        density={0.45}
        seed={index + 3}
        className="transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
      />
      <div
        className={`pointer-events-none absolute inset-x-0 h-2/3 ${rise ? "top-0" : "bottom-0"}`}
        style={{ background: `linear-gradient(${rise ? "to bottom" : "to top"}, ${family.colors.soft} 18%, transparent)` }}
      />
      <div className="relative">
        <p className="eyebrow flex justify-between text-ink-2">
          <span>0{index + 1}</span>
          <span>{count} {count === 1 ? "scent" : "scents"}</span>
        </p>
        <h3 className="display mt-4 text-[clamp(2.4rem,3.6vw,3.4rem)]">{family.name}</h3>
        <p className="script -mt-1 text-[clamp(2rem,3vw,2.8rem)] leading-none" style={{ color: family.colors.accent }}>
          {family.word}
        </p>
        <p className="mt-3 text-[13px] text-ink-2">{family.keyNotes.slice(0, 4).join(" · ")}</p>
        <span className="eyebrow link-underline mt-5 inline-block">Explore</span>
      </div>
    </Link>
  );
}
