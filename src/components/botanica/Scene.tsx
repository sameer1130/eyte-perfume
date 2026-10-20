"use client";

import type { CSSProperties } from "react";
import { FAMILIES, type FamilySlug } from "@/data/families";
import { cn } from "@/lib/cn";
import { Botanical } from "./Botanical";
import { Particles } from "./Particles";

type Side = "left" | "right";

/** Soft atmospheric tint behind each family's plants. */
const GLOW: Record<FamilySlug, string> = {
  citrus: "radial-gradient(60% 50% at 90% 0%, rgb(240 200 60 / 0.16), transparent 70%)",
  floral: "radial-gradient(60% 50% at 90% 0%, rgb(222 96 152 / 0.12), transparent 70%)",
  gourmand: "radial-gradient(60% 55% at 88% 0%, rgb(214 168 96 / 0.2), transparent 70%)",
  woody: "radial-gradient(80% 45% at 50% 100%, rgb(120 96 76 / 0.12), transparent 75%)",
  amber: "radial-gradient(60% 50% at 88% 100%, rgb(226 120 40 / 0.2), transparent 70%), radial-gradient(45% 40% at 10% 100%, rgb(226 120 40 / 0.12), transparent 70%)",
  aquatic: "linear-gradient(to top, rgb(44 134 166 / 0.14), transparent 45%)",
};

/**
 * A family's full atmosphere: botanicals spilling from one or both corners
 * plus its airborne particles. Hanging plants sit in the top corners,
 * rising ones in the bottom corners.
 */
export function Scene({
  family,
  sides = ["right"],
  plantWidth = "clamp(240px, 44vw, 680px)",
  particles = true,
  density = 1,
  seed = 1,
  offset = "-3%",
  glow = true,
  lightSmoke = false,
  className,
  style,
}: {
  family: FamilySlug;
  sides?: Side[];
  plantWidth?: string;
  particles?: boolean;
  density?: number;
  seed?: number;
  offset?: string;
  glow?: boolean;
  /** Pale smoke for scenes on dark backgrounds. */
  lightSmoke?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const vertical = FAMILIES[family].growth === "hang" ? "top" : "bottom";
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ backgroundImage: glow ? GLOW[family] : undefined, ...style }}
      aria-hidden="true"
    >
      {sides.map((side, i) => (
        <Botanical
          key={`${family}-${side}`}
          family={family}
          seed={seed + i * 31}
          mirror={side === "right"}
          screenX={side === "right" ? 0.85 : 0.15}
          className="absolute h-auto"
          style={{
            [side]: offset,
            [vertical]: offset,
            width: i === 0 ? plantWidth : `calc(${plantWidth} * 0.72)`,
          }}
        />
      ))}
      {particles && <Particles family={family} density={density} lightSmoke={lightSmoke} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
