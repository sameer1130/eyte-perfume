import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal, RevealLines } from "./Reveal";

/**
 * Eyebrow + condensed display heading with an overlapping script word,
 * the signature typographic lock-up of the site.
 */
export function SectionHeading({
  eyebrow,
  before,
  script,
  after,
  align = "center",
  scriptColor,
  className,
  size = "md",
}: {
  eyebrow?: string;
  before: ReactNode;
  script?: string;
  after?: ReactNode;
  align?: "center" | "left";
  scriptColor?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow mb-5 text-ink-2" y={14}>
          {eyebrow}
        </Reveal>
      )}
      <RevealLines
        className={cn("display", size === "lg" ? "text-[clamp(3.2rem,8vw,8.5rem)]" : "text-[clamp(2.8rem,6.2vw,6rem)]")}
      >
        <span className="block">{before}</span>{" "}
        {script && (
          <span
            className={cn("script relative z-10 block text-[0.62em] leading-[0.9]", align === "center" ? "-my-[0.12em]" : "-my-[0.12em] pl-[0.6em]")}
            style={{ color: scriptColor ?? "var(--color-gold)" }}
          >
            {script}
          </span>
        )}{" "}
        {after && <span className="block">{after}</span>}
      </RevealLines>
    </div>
  );
}
