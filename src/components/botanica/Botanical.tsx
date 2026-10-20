"use client";

import { memo, useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import type { FamilySlug } from "@/data/families";
import { FAMILY_SLUGS } from "@/data/families";
import { subscribe, windAt, type Frame } from "./engine";
import { bezier, bezierAngle, createRng, DEG, f, rotateAround, type Pt } from "./geometry";
import { PLANTS, type Stem } from "./plants";

type Pose = { c1: Pt; c2: Pt; c3: Pt; tip: number };

const REST: Frame = { t: 0, dt: 0, gust: 0, dir: 1, reduced: true };

function poseStem(s: Stem, fr: Frame, sx: number, sign: number, envelope: number): Pose {
  if (envelope === 0) return { c1: s.c1, c2: s.c2, c3: s.c3, tip: 0 };
  const amp = s.amp * envelope * (fr.reduced ? 0.15 : 1) * (1 + fr.gust * 1.1);
  const lean = fr.gust * s.amp * 0.8 * fr.dir * envelope;
  const at = (lag: number) => amp * (windAt(fr.t - lag, sx) + 0.25 * Math.sin(fr.t * 1.37 + s.phase)) + lean;
  const tip = at(s.lag) * sign;
  return {
    c1: rotateAround(s.c1, s.base, at(s.lag * 0.3) * 0.35 * sign),
    c2: rotateAround(s.c2, s.base, at(s.lag * 0.65) * 0.7 * sign),
    c3: rotateAround(s.c3, s.base, tip),
    tip,
  };
}

function curvePath(s: Stem, p: Pose) {
  return `M${f(s.base[0])} ${f(s.base[1])}C${f(p.c1[0])} ${f(p.c1[1])} ${f(p.c2[0])} ${f(p.c2[1])} ${f(p.c3[0])} ${f(p.c3[1])}`;
}

function ribbonPath(s: Stem, p: Pose, taper: "grass" | "ribbon") {
  const n = 16;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const [x, y] = bezier(s.base, p.c1, p.c2, p.c3, u);
    const a = bezierAngle(s.base, p.c1, p.c2, p.c3, u) * DEG;
    const w =
      taper === "grass"
        ? (s.width / 2) * Math.pow(1 - u, 0.85) + 0.25
        : (s.width / 2) * (1 - Math.pow(u, 3)) * (0.75 + 0.25 * Math.sin(u * 9 + s.phase)) + 0.3;
    const nx = -Math.sin(a) * w;
    const ny = Math.cos(a) * w;
    left.push(`${f(x + nx)} ${f(y + ny)}`);
    right.push(`${f(x - nx)} ${f(y - ny)}`);
  }
  return `M${left.join("L")}L${right.reverse().join("L")}Z`;
}

function attachmentTransform(s: Stem, p: Pose, a: Stem["attachments"][number], fr: Frame, sx: number, envelope: number) {
  const [x, y] = bezier(s.base, p.c1, p.c2, p.c3, a.u);
  const flutter =
    envelope === 0
      ? 0
      : a.flutter *
        envelope *
        (fr.reduced ? 0.15 : 1) *
        (0.55 * Math.sin(fr.t * (1.6 + (a.phase % 1)) + a.phase) + 0.6 * windAt(fr.t - 0.25, sx)) *
        (1 + fr.gust * 0.9);
  const rot =
    a.orient === "tangent"
      ? bezierAngle(s.base, p.c1, p.c2, p.c3, a.u) + a.angle + flutter
      : a.angle + p.tip * 0.5 + flutter;
  return `translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${a.scale})`;
}

export type BotanicalProps = {
  family: FamilySlug;
  seed?: number;
  /** Flip horizontally, e.g. to spill from the top-right corner. */
  mirror?: boolean;
  /** Where the plant sits on screen (0–1), so gusts reach it at the right moment. */
  screenX?: number;
  className?: string;
  style?: CSSProperties;
};

export const Botanical = memo(function Botanical({
  family,
  seed = 1,
  mirror = false,
  screenX = 0.5,
  className,
  style,
}: BotanicalProps) {
  const def = PLANTS[family];
  const [W, H] = def.size;
  const rawId = useId();
  const uid = `b${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const stems = useMemo(() => {
    const url = (name: string) => `url(#${uid}-${name})`;
    const rng = createRng(seed * 7919 + FAMILY_SLUGS.indexOf(family) * 104729);
    return def
      .build(rng, url)
      .map((s) => ({ ...s, attachments: [...s.attachments].sort((a, b) => a.z - b.z) }))
      .sort((a, b) => b.depth - a.depth);
  }, [def, family, seed, uid]);

  const svgRef = useRef<SVGSVGElement>(null);
  const stemEls = useRef(new Map<number, SVGPathElement>());
  const attEls = useRef(new Map<string, SVGGElement>());

  const grow = def.growth === "hang" ? -1 : 1;
  const sign = mirror ? -grow : grow;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let visible = false;
    let started = -1;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "120px" });
    io.observe(svg);

    const unsubscribe = subscribe((fr) => {
      if (!visible) return;
      if (started < 0) started = fr.t;
      // Ease in so the first frame doesn't snap from the rest pose.
      const k = Math.min(1, (fr.t - started) / 1.6);
      const envelope = k * k * (3 - 2 * k);
      stems.forEach((s, i) => {
        const sx = screenX + (s.base[0] / W - 0.5) * 0.3 * (mirror ? -1 : 1);
        const pose = poseStem(s, fr, sx, sign, envelope);
        stemEls.current.get(i)?.setAttribute("d", s.blade ? ribbonPath(s, pose, s.blade.taper) : curvePath(s, pose));
        s.attachments.forEach((a, j) => {
          attEls.current.get(`${i}.${j}`)?.setAttribute("transform", attachmentTransform(s, pose, a, fr, sx, envelope));
        });
      });
    });
    return () => {
      io.disconnect();
      unsubscribe();
    };
  }, [stems, screenX, mirror, sign, W]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ overflow: "visible", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>{def.defs((name) => `${uid}-${name}`)}</defs>
      <g transform={mirror ? `translate(${W} 0) scale(-1 1)` : undefined}>
        {stems.map((s, i) => {
          const rest = poseStem(s, REST, 0, sign, 0);
          return (
            <g key={i} opacity={s.depth > 0 ? 1 - s.depth * 0.6 : undefined}>
              <path
                ref={(el) => {
                  if (el) stemEls.current.set(i, el);
                  else stemEls.current.delete(i);
                }}
                d={s.blade ? ribbonPath(s, rest, s.blade.taper) : curvePath(s, rest)}
                fill={s.blade ? s.blade.fill : "none"}
                stroke={s.blade ? undefined : s.color}
                strokeWidth={s.blade ? undefined : s.width}
                strokeLinecap="round"
              />
              {s.attachments.map((a, j) => (
                <g
                  key={j}
                  ref={(el) => {
                    if (el) attEls.current.set(`${i}.${j}`, el);
                    else attEls.current.delete(`${i}.${j}`);
                  }}
                  transform={attachmentTransform(s, rest, a, REST, 0, 0)}
                >
                  {a.node}
                </g>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
});
