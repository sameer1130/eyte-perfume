import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { FAMILIES } from "@/data/families";
import type { Product, Season } from "@/data/products";
import { familyComposition } from "@/lib/catalog";

const SCALES = {
  projection: ["Intimate", "Soft", "Moderate", "Strong", "Room-filling"],
  sweetness: ["Dry", "Low", "Balanced", "Sweet", "Very sweet"],
  freshness: ["Warm", "Low", "Balanced", "Fresh", "Very fresh"],
};

function Meter({ label, value, score }: { label: string; value: string; score: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="eyebrow text-ink-2">{label}</span>
        <span className="display text-2xl">{value}</span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`h-1 rounded-full ${i < score ? "bg-ink" : "bg-paper-3"}`} />
        ))}
      </div>
    </div>
  );
}

export function ScentProfile({ product }: { product: Product }) {
  const { profile } = product;
  const composition = familyComposition(product);
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionHeading eyebrow="Scent profile" before="How it" script="wears" align="left" />
          <Reveal className="mt-12 space-y-8" stagger={0.08}>
            <Meter label="Longevity" value={profile.longevity} score={profile.longevityScore} />
            <Meter label="Projection" value={SCALES.projection[profile.projection - 1]} score={profile.projection} />
            <Meter label="Sweetness" value={SCALES.sweetness[profile.sweetness - 1]} score={profile.sweetness} />
            <Meter label="Freshness" value={SCALES.freshness[profile.freshness - 1]} score={profile.freshness} />
          </Reveal>
        </div>
        <div>
          <SectionHeading eyebrow="Accord breakdown" before="What it's" script="made of" align="left" />
          <Reveal className="mt-12">
            <div className="flex h-14 overflow-hidden rounded-[3px]">
              {composition.map((c) => (
                <div
                  key={c.family}
                  className="h-full"
                  style={{ width: `${c.share * 100}%`, background: FAMILIES[c.family].colors.accent }}
                  title={`${FAMILIES[c.family].name} ${Math.round(c.share * 100)}%`}
                />
              ))}
            </div>
            <ul className="mt-8 space-y-4">
              {composition.map((c) => {
                const f = FAMILIES[c.family];
                return (
                  <li key={c.family} className="flex items-center justify-between border-b hairline pb-4">
                    <Link href={`/families/${c.family}`} className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ background: f.colors.accent }} />
                      <span className="display text-3xl">{f.name}</span>
                      <span className="script hidden text-3xl sm:inline" style={{ color: f.colors.accent }}>
                        {f.word}
                      </span>
                    </Link>
                    <span className="eyebrow tabular-nums">{Math.round(c.share * 100)}%</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs text-mute">Weighted by how long each note lasts on skin: base notes count most.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const SEASON_ICON: Record<Season, string> = {
  spring: "M12 21v-8M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Zm0-5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z",
  summer: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  autumn: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l8-8M9 15h4M11 13v-3",
  winter: "M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2",
};

export function WearGuide({ product }: { product: Product }) {
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
  return (
    <section className="border-y hairline bg-paper-2">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
        <SectionHeading eyebrow="Best worn for" before="When to" script="wear it" />
        <Reveal className="mx-auto mt-14 flex max-w-3xl flex-wrap items-stretch justify-center gap-3" stagger={0.05}>
          {seasons.map((s) => {
            const on = product.seasons.includes(s);
            return (
              <div key={s} className={`flex w-[calc(50%-6px)] flex-col items-center rounded-[3px] border px-4 py-6 sm:w-36 ${on ? "border-ink bg-paper" : "hairline opacity-45"}`}>
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={SEASON_ICON[s]} />
                </svg>
                <span className="eyebrow mt-3">{s}</span>
                <span className="mt-1 text-[11px] text-mute">{on ? "Recommended" : "Less ideal"}</span>
              </div>
            );
          })}
          <div className="flex w-full flex-col items-center rounded-[3px] border border-ink bg-paper px-4 py-6 sm:w-36">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
            </svg>
            <span className="eyebrow mt-3">{product.time}</span>
            <span className="mt-1 text-[11px] text-mute">Time of day</span>
          </div>
        </Reveal>
        <Reveal className="mt-16 grid gap-4 md:grid-cols-3" stagger={0.08}>
          {product.occasions.map((o, i) => (
            <div key={o.title} className="rounded-[3px] bg-paper p-8">
              <span className="eyebrow text-mute">0{i + 1}</span>
              <h3 className="display mt-6 text-4xl">{o.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{o.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function ComparedTo({ product }: { product: Product }) {
  if (!product.comparedTo?.length) return null;
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-24 text-center md:px-10">
      <Reveal as="p" className="eyebrow text-ink-2">
        Often compared to
      </Reveal>
      {product.comparedTo.map((c) => (
        <Reveal key={c.name} className="mt-8">
          <p className="eyebrow text-mute">{c.house}</p>
          <p className="display mt-2 text-[clamp(3rem,6vw,5.5rem)]">{c.name}</p>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-ink-2">{c.text}</p>
        </Reveal>
      ))}
    </section>
  );
}

const STEPS = [
  { title: "Pulse points", text: "Spray on the wrists, neck and inner elbows, where warmth helps the scent bloom and project." },
  { title: "Don't rub", text: "Rubbing crushes the top notes. Spray, then let it settle on its own." },
  { title: "Mist your clothes", text: "A light spray on a collar or scarf keeps the scent around far longer than skin alone." },
];

export function HowToWear() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
      <SectionHeading eyebrow="Make it last" before="How to" script="wear it" />
      <Reveal className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6" stagger={0.08}>
        {STEPS.map((s, i) => (
          <div key={s.title} className="border-t border-ink pt-6">
            <span className="display text-6xl">0{i + 1}</span>
            <h3 className="display mt-4 text-4xl">{s.title}</h3>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ink-2">{s.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* Placeholder reviews until real ones come from the backend. */
const REVIEWERS = ["Aarav S.", "Meera K.", "Rohan D.", "Sana A.", "Kabir M.", "Ishita R."];

function sampleReviews(product: Product) {
  const base = product.notes.base[0].toLowerCase();
  const top = product.notes.top[0].toLowerCase();
  const seed = product.slug.length;
  return [
    {
      name: REVIEWERS[seed % REVIEWERS.length],
      rating: 5,
      text: `The ${base} dry-down is beautiful. ${product.profile.longevityScore >= 4 ? "Still there when I get home in the evening." : "Light, easy and never too much."}`,
    },
    {
      name: REVIEWERS[(seed + 2) % REVIEWERS.length],
      rating: 5,
      text: `That opening of ${top} gets me compliments every time. Arrived well packed and clearly authentic.`,
    },
    {
      name: REVIEWERS[(seed + 4) % REVIEWERS.length],
      rating: 4,
      text: `My new signature for ${product.seasons.includes("summer") ? "warm days" : "cooler evenings"}. Wish I'd bought the bigger bottle.`,
    },
  ];
}

export function Reviews({ product }: { product: Product }) {
  const reviews = sampleReviews(product);
  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 xl:px-28">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Reviews" before="What people" script="say" align="left" className="text-center md:text-left" />
          <Reveal className="text-center md:text-right">
            <p className="display text-7xl">{product.rating.toFixed(1)}</p>
            <Stars rating={product.rating} />
            <p className="eyebrow mt-2 text-mute">{product.reviewCount} reviews</p>
          </Reveal>
        </div>
        <Reveal className="mt-14 grid gap-4 md:grid-cols-3" stagger={0.08}>
          {reviews.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-[3px] bg-paper-2 p-8">
              <Stars rating={r.rating} />
              <blockquote className="mt-6 flex-1 text-[18px] leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="eyebrow mt-8 flex items-center justify-between text-mute">
                <span>{r.name}</span>
                <span>Verified buyer</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Faq({ product }: { product: Product }) {
  const n = product.notes;
  const list = (xs: string[]) => xs.map((x) => x.toLowerCase()).join(", ");
  const items = [
    {
      q: `What does ${product.name} smell like?`,
      a: `It opens with ${list(n.top)}, develops into a heart of ${list(n.heart)}, and settles on ${list(n.base)}. ${product.tagline}`,
    },
    {
      q: "How long does it last?",
      a: `Expect around ${product.profile.longevity} on skin, with ${SCALES.projection[product.profile.projection - 1].toLowerCase()} projection. A light spray on clothing extends it further.`,
    },
    {
      q: "When should I wear it?",
      a: `It shines in ${product.seasons.join(", ")}, and suits ${product.time === "day & night" ? "both day and night" : `the ${product.time}`}.`,
    },
    {
      q: "Is it 100% original?",
      a: "Yes. EYTE sells only authentic, 100% original perfumes: no copies, no compromises.",
    },
    {
      q: "Do you ship worldwide?",
      a: "Yes, EYTE ships worldwide. Every order is packed with care so it arrives ready to wear, or to gift.",
    },
  ];
  return (
    <section className="border-t hairline bg-paper-2">
      <div className="mx-auto max-w-[900px] px-5 py-28 md:px-10">
        <SectionHeading eyebrow="Questions" before="Good to" script="know" />
        <Reveal className="mt-14 border-t hairline">
          {items.map((it) => (
            <details key={it.q} className="group border-b hairline">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">{it.q}</span>
                <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-ink transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-ink-2">{it.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
