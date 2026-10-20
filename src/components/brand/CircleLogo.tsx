"use client";

import { useEffect, useRef } from "react";
import { Monogram } from "./Monogram";

const RING = "EYTE · INTERNATIONAL · EXCELLENCE BEYOND BORDERS · ";

/** Monogram inside a ring of text that turns as the page scrolls. */
export function CircleLogo({ className }: { className?: string }) {
  const ring = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ring.current?.setAttribute("transform", `rotate(${(window.scrollY * 0.08) % 360} 60 60)`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <path id="eyte-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
      </defs>
      <g ref={ring}>
        <text fontSize="8.4" letterSpacing="2.6" fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontStretch: "125%" }}>
          <textPath href="#eyte-ring" textLength="285">
            {RING}
          </textPath>
        </text>
      </g>
      <Monogram x="37" y="32" width="46" height="58" />
    </svg>
  );
}
