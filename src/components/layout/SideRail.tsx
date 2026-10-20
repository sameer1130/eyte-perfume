"use client";

import { useEffect, useRef } from "react";

/** Era-style left rail: a scroll-progress counter between hairlines. */
export function SideRail() {
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (num.current) num.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-8 left-[66px] top-[200px] z-20 hidden w-px flex-col items-center xl:flex">
      <span className="relative block h-28 w-px bg-line">
        <span ref={bar} className="absolute inset-0 origin-top bg-ink" style={{ transform: "scaleY(0)" }} />
      </span>
      <span ref={num} className="eyebrow my-4 -ml-px tabular-nums">
        00
      </span>
      <span className="block w-px flex-1 bg-line" />
      <span className="eyebrow mt-6 [writing-mode:vertical-rl] rotate-180">Scroll</span>
      <svg viewBox="0 0 8 40" className="mt-4 h-10 w-2" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 0v38M1 34l3 4 3-4" />
      </svg>
    </div>
  );
}
