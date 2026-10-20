import type { BottleShape, CapStyle, Product } from "@/data/products";

/*
 * Illustrated perfume bottles, used until real product photography exists.
 * Each product picks a silhouette, cap finish and juice colour; the glass,
 * label and highlights are shared.
 */

type Geometry = {
  body: string;
  /** Where the juice line sits, as a y coordinate. */
  liquidTop: number;
  neck: { x: number; y: number; w: number; h: number };
  cap: string;
  capDetail?: string;
  label: { x: number; y: number; w: number; h: number };
  highlight: string;
};

const SHAPES: Record<BottleShape, Geometry> = {
  tower: {
    body: "M62 104h76a6 6 0 0 1 6 6v168a6 6 0 0 1-6 6H62a6 6 0 0 1-6-6V110a6 6 0 0 1 6-6Z",
    liquidTop: 122,
    neck: { x: 88, y: 92, w: 24, h: 14 },
    cap: "M72 26h56a4 4 0 0 1 4 4v58a4 4 0 0 1-4 4H72a4 4 0 0 1-4-4V30a4 4 0 0 1 4-4Z",
    capDetail: "M68 40h64M68 78h64",
    label: { x: 70, y: 170, w: 60, h: 62 },
    highlight: "M66 116v156",
  },
  dome: {
    body: "M52 150c0-34 18-46 48-46s48 12 48 46v120a14 14 0 0 1-14 14H66a14 14 0 0 1-14-14Z",
    liquidTop: 136,
    neck: { x: 86, y: 92, w: 28, h: 14 },
    cap: "M68 94c0-34 12-50 32-54 20 4 32 20 32 54Z M94 40a6 6 0 1 1 12 0a6 6 0 1 1-12 0Z",
    capDetail: "M76 70c8-4 40-4 48 0M72 86h56",
    label: { x: 68, y: 176, w: 64, h: 60 },
    highlight: "M62 156c0-12 2-22 8-30M60 170v96",
  },
  facet: {
    body: "M64 108h72l20 22v134l-20 20H64l-20-20V130Z",
    liquidTop: 128,
    neck: { x: 88, y: 94, w: 24, h: 16 },
    cap: "M78 40h44l10 12v34l-10 10H78l-10-10V52Z",
    capDetail: "M78 40l-10 12M122 40l10 12M88 40v56M112 40v56",
    label: { x: 66, y: 170, w: 68, h: 60 },
    highlight: "M52 136v124M64 112l-14 16",
  },
  orb: {
    body: "M100 112c44 0 76 32 76 80 0 40-22 72-40 86-6 5-14 6-22 6H86c-8 0-16-1-22-6-18-14-40-46-40-86 0-48 32-80 76-80Z",
    liquidTop: 128,
    neck: { x: 88, y: 98, w: 24, h: 16 },
    cap: "M86 30h28a4 4 0 0 1 4 4v62H82V34a4 4 0 0 1 4-4Z",
    capDetail: "M82 48h36M82 84h36",
    label: { x: 66, y: 176, w: 68, h: 56 },
    highlight: "M44 168c4-20 16-36 34-46M38 200c0 24 8 44 20 58",
  },
  slab: {
    body: "M50 112h100a10 10 0 0 1 10 10v152a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10V122a10 10 0 0 1 10-10Z",
    liquidTop: 130,
    neck: { x: 86, y: 100, w: 28, h: 14 },
    cap: "M70 56h60a6 6 0 0 1 6 6v40H64V62a6 6 0 0 1 6-6Z",
    capDetail: "M64 72h72",
    label: { x: 62, y: 172, w: 76, h: 58 },
    highlight: "M50 124v148",
  },
  flask: {
    body: "M74 116h52c10 50 16 104 12 160a8 8 0 0 1-8 8H70a8 8 0 0 1-8-8c-4-56 2-110 12-160Z",
    liquidTop: 134,
    neck: { x: 90, y: 102, w: 20, h: 16 },
    cap: "M90 34h20v70H90Z M100 14a10 10 0 1 1 0 20a10 10 0 1 1 0-20Z",
    capDetail: "M90 52h20M90 86h20",
    label: { x: 74, y: 178, w: 52, h: 56 },
    highlight: "M76 128c-6 40-8 90-6 140",
  },
};

const CAPS: Record<CapStyle, { stops: string[]; line: string }> = {
  gold: { stops: ["#6F5124", "#C9A35E", "#F2DFA6", "#B88D45", "#6A4C22"], line: "rgba(80,56,20,0.45)" },
  black: { stops: ["#0B0B0C", "#2A2A2D", "#4A4A4E", "#1C1C1E", "#070708"], line: "rgba(255,255,255,0.12)" },
  silver: { stops: ["#6E7376", "#B9BEC1", "#F4F6F7", "#A3A8AB", "#5E6265"], line: "rgba(40,44,46,0.3)" },
  wood: { stops: ["#4A2F1B", "#7C5534", "#A97C52", "#6E4A2C", "#3E2716"], line: "rgba(30,18,8,0.4)" },
};

function isDark(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 90;
}

export function Bottle({
  product,
  className,
  idSuffix = "",
}: {
  product: Pick<Product, "slug" | "name" | "house" | "bottle" | "concentration">;
  className?: string;
  /** Distinguishes gradient ids when the same bottle renders twice with different looks. */
  idSuffix?: string;
}) {
  const { shape, cap, liquid } = product.bottle;
  const g = SHAPES[shape];
  const c = CAPS[cap];
  const id = `btl-${product.slug}${idSuffix}`;
  const dark = isDark(liquid);
  const label = g.label;
  const maxW = label.w - 10;
  const name = product.name.toUpperCase();
  const house = product.house.toUpperCase();
  const nameSize = Math.max(7, Math.min(15, (maxW * 2) / Math.max(4, name.length)));
  // Squeeze long names into the label rather than letting them spill over.
  const fit = (text: string, size: number, tracking: number) =>
    text.length * (size * 0.52 + tracking) > maxW ? { textLength: maxW, lengthAdjust: "spacingAndGlyphs" as const } : {};

  return (
    <svg viewBox="0 0 200 300" className={className} role="img" aria-label={`${product.house} ${product.name} bottle`}>
      <defs>
        <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={liquid} stopOpacity={dark ? 0.92 : 0.7} />
          <stop offset="1" stopColor={liquid} stopOpacity={1} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0.5} />
          <stop offset=".18" stopColor="#fff" stopOpacity={0.08} />
          <stop offset=".7" stopColor="#fff" stopOpacity={0.02} />
          <stop offset=".9" stopColor="#fff" stopOpacity={0.28} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.08} />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="0">
          {c.stops.map((s, i) => (
            <stop key={i} offset={i / (c.stops.length - 1)} stopColor={s} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#14251E" stopOpacity={0.28} />
          <stop offset="1" stopColor="#14251E" stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={g.body} />
        </clipPath>
      </defs>

      <ellipse cx="100" cy="288" rx="78" ry="9" fill={`url(#${id}-shadow)`} />

      {/* glass, juice, highlights */}
      <path d={g.body} fill="#F7F5EF" fillOpacity={0.55} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y={g.liquidTop} width="200" height={300 - g.liquidTop} fill={`url(#${id}-liquid)`} />
        <rect x="0" y={g.liquidTop} width="200" height="3" fill="#fff" opacity={0.35} />
        <rect x="0" y="270" width="200" height="30" fill="#000" opacity={0.12} />
        <rect x="0" y="0" width="200" height="300" fill={`url(#${id}-glass)`} />
      </g>
      <path d={g.highlight} stroke="#fff" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />
      <path d={g.body} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={1.4} />
      <path d={g.body} fill="none" stroke="#14251E" strokeOpacity={0.12} strokeWidth={0.8} />

      {/* label */}
      <rect
        x={label.x}
        y={label.y}
        width={label.w}
        height={label.h}
        fill={dark ? "#141414" : "#F8F4EA"}
        fillOpacity={dark ? 0.7 : 0.92}
        stroke="#B8975A"
        strokeWidth={0.8}
      />
      <rect x={label.x + 3} y={label.y + 3} width={label.w - 6} height={label.h - 6} fill="none" stroke="#B8975A" strokeOpacity={0.6} strokeWidth={0.5} />
      <text
        x="100"
        y={label.y + 16}
        textAnchor="middle"
        fontSize={5.2}
        letterSpacing={1.6}
        fill={dark ? "#D8BF86" : "#7A6236"}
        style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
        {...fit(house, 5.2, 1.6)}
      >
        {house}
      </text>
      <text
        x="100"
        y={label.y + label.h / 2 + nameSize * 0.45}
        textAnchor="middle"
        fontSize={nameSize}
        fill={dark ? "#F0E2BF" : "#14251E"}
        style={{ fontFamily: "var(--font-display)" }}
        {...fit(name, nameSize, 0)}
      >
        {name}
      </text>
      <text
        x="100"
        y={label.y + label.h - 10}
        textAnchor="middle"
        fontSize={3.6}
        letterSpacing={1.2}
        fill={dark ? "#D8BF86" : "#7A6236"}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {product.concentration.toUpperCase()}
      </text>

      {/* neck & cap */}
      <rect {...g.neck} fill={`url(#${id}-cap)`} opacity={0.85} />
      <path d={g.cap} fill={`url(#${id}-cap)`} />
      {g.capDetail && <path d={g.capDetail} stroke={c.line} strokeWidth={1} fill="none" />}
    </svg>
  );
}
