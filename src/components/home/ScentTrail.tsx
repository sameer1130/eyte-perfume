"use client";

import { Monogram } from "@/components/brand/Monogram";
import { FAMILIES, FAMILY_SLUGS, type FamilySlug } from "@/data/families";
import { cn } from "@/lib/cn";

/** Stops along the trail, in % of the trail box. The centre stop holds the monogram. */
const STOPS: [number, number][] = [
  [6, 70],
  [21, 38],
  [36, 60],
  [64, 52],
  [79, 30],
  [94, 64],
];
const CENTRE: [number, number] = [50, 44];

/** Smooth Catmull-Rom curve through the points, as an SVG path in a 1000×100 box. */
function trailPath(points: [number, number][]) {
  const p = points.map(([x, y]) => [x * 10, y] as const);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const PATH = trailPath([[0, 86], ...STOPS.slice(0, 3), CENTRE, ...STOPS.slice(3), [100, 78]]);

export function ScentTrail({ active, onSelect }: { active: FamilySlug; onSelect: (f: FamilySlug) => void }) {
  return (
    <div>
      {/* Desktop: era-style wavy trail with labelled stops */}
      <div className="relative mx-auto hidden h-[132px] max-w-[1180px] md:block">
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-[92px] w-full animate-[wipe_2.6s_var(--ease-soft)_0.6s_both] overflow-visible"
          aria-hidden="true"
        >
          <path d={PATH} fill="none" stroke="currentColor" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-[92px]">
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${CENTRE[0]}%`, top: `${CENTRE[1]}%` }}
            aria-hidden="true"
          >
            <span className="block bg-paper px-2">
              <Monogram className="h-12 w-auto" />
            </span>
          </span>
          {FAMILY_SLUGS.map((slug, i) => {
            const fam = FAMILIES[slug];
            const [x, y] = STOPS[i];
            const on = slug === active;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => onSelect(slug)}
                aria-pressed={on}
                className="halo group absolute flex cursor-pointer flex-col items-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, calc(-100% + 5px))" }}
              >
                <span className={cn("eyebrow whitespace-nowrap transition-colors duration-500", on ? "text-ink" : "text-mute group-hover:text-ink")}>
                  {fam.short}
                </span>
                <span
                  className={cn(
                    "mt-0.5 whitespace-nowrap text-[12px] transition-colors duration-500",
                    on ? "text-ink-2" : "text-mute/80 group-hover:text-ink-2",
                  )}
                >
                  {fam.keyNotes.slice(0, 2).join(" · ")}
                </span>
                <span
                  className="mt-3 block h-2.5 w-2.5 rounded-full transition-all duration-500"
                  style={{
                    background: on ? fam.colors.accent : "var(--color-ink)",
                    boxShadow: on ? `0 0 0 5px var(--color-paper), 0 0 0 6px ${fam.colors.accent}` : "none",
                    transform: on ? "scale(1.25)" : "scale(1)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: chips */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:hidden">
        {FAMILY_SLUGS.map((slug) => {
          const fam = FAMILIES[slug];
          const on = slug === active;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onSelect(slug)}
              aria-pressed={on}
              className={cn(
                "eyebrow flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 transition-colors",
                on ? "border-ink bg-ink text-paper" : "hairline bg-paper/70",
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: fam.colors.accent }} />
              {fam.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
