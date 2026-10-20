import type { SVGProps } from "react";

/** Crowned "e" monogram, after the EYTE International mark. */
export function Monogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 76" aria-hidden="true" focusable="false" {...props}>
      <g fill="currentColor">
        <path d="M17 21 19.6 10.5 25 16.8 30 7.4 35 16.8 40.4 10.5 43 21Z" />
        <circle cx="19.6" cy="9.4" r="1.7" />
        <circle cx="30" cy="5.6" r="1.9" />
        <circle cx="40.4" cy="9.4" r="1.7" />
        <rect x="16.6" y="22.2" width="26.8" height="2.6" rx="1" />
      </g>
      <rect x="11" y="28" width="38" height="44" rx="12" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <rect x="14" y="31" width="32" height="38" rx="9.5" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <text
        x="30"
        y="61"
        textAnchor="middle"
        fontSize="36"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)" }}
      >
        e
      </text>
    </svg>
  );
}
