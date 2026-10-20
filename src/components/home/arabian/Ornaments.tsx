import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Eight-pointed star outline, the motif of mashrabiya screens and girih tiles. */
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = ((i * 22.5 - 90) * Math.PI) / 180;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" ");
}

/** A faint gold lattice, faded out towards the edges. */
export function Mashrabiya({ id, className, style }: { id: string; className?: string; style?: CSSProperties }) {
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} style={style} aria-hidden="true">
      <defs>
        <pattern id={`${id}-tile`} width="96" height="96" patternUnits="userSpaceOnUse">
          <polygon points={starPoints(48, 48, 26, 19)} fill="none" stroke="currentColor" strokeWidth="0.7" />
          <polygon points={starPoints(48, 48, 13, 9.5)} fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M48 22 48 0M48 74 48 96M22 48 0 48M74 48 96 48" stroke="currentColor" strokeWidth="0.6" />
          <path d="M0 0 14 14M96 0 82 14M0 96 14 82M96 96 82 82" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-tile)`} mask={`url(#${id}-mask)`} />
    </svg>
  );
}

/** Small eight-pointed star used as a separator glyph. */
export function StarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <polygon points={starPoints(10, 10, 9, 4.2)} fill="currentColor" />
    </svg>
  );
}

/** Endless horizontal band of phrases. */
export function Marquee({
  items,
  reverse = false,
  className,
  itemClassName,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className={cn("whitespace-nowrap px-8", itemClassName)}>{t}</span>
          <StarGlyph className="h-3.5 w-3.5 text-gold" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("flex overflow-hidden", className)}>
      <div className="animate-marquee flex w-max" style={{ animationDirection: reverse ? "reverse" : "normal" }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
