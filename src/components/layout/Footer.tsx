import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { FAMILY_LIST } from "@/data/families";

export const INSTAGRAM_URL = "https://www.instagram.com/eyte.perfumes/";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All perfumes" },
      { href: "/shop?collection=middle-eastern", label: "Middle Eastern" },
      { href: "/shop?collection=international", label: "International" },
      { href: "/shop?sort=bestsellers", label: "Bestsellers" },
    ],
  },
  {
    title: "Families",
    links: FAMILY_LIST.map((f) => ({ href: `/families/${f.slug}`, label: f.name })),
  },
  {
    title: "Care",
    links: [
      { href: "/#promise", label: "Authenticity promise" },
      { href: "/#promise", label: "Shipping & delivery" },
      { href: "/#promise", label: "Returns" },
      { href: INSTAGRAM_URL, label: "Contact on Instagram" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t hairline bg-paper-2">
      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-20 md:px-10 xl:px-28">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Monogram className="h-16 w-auto text-ink" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-2">
              Authentic luxury perfumes from the Middle East and the world. 100% original, long lasting, shipped worldwide.
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="eyebrow link-underline mt-6 inline-block">
              @eyte.perfumes
            </a>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-mute">{col.title}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-grow">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mt-20 select-none" aria-hidden="true">
          <p className="display text-center text-[clamp(7rem,30vw,26rem)] leading-[0.78] tracking-[-0.01em] text-ink">EYTE</p>
          <p className="script absolute bottom-[-0.08em] left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(2.2rem,7vw,6.5rem)] text-gold">
            Excellence beyond borders
          </p>
        </div>

        <div className="eyebrow mt-16 flex flex-col justify-between gap-3 border-t hairline pt-6 text-mute md:flex-row">
          <span>© 2026 EYTE International</span>
          <span>Frontend preview · sample catalogue</span>
        </div>
      </div>
    </footer>
  );
}
