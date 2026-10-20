"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleLogo } from "@/components/brand/CircleLogo";
import { cart, useCart } from "@/components/cart/cart-store";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { FAMILY_LIST } from "@/data/families";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/families", label: "Scent families" },
  { href: "/shop?collection=middle-eastern", label: "Middle Eastern" },
  { href: "/shop?collection=international", label: "International" },
];

export function Header() {
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = (open: boolean) => {
    setMenuOpen(open);
    setScrollLocked(open);
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="flex items-start justify-between px-4 pt-3 md:px-8 md:pt-6">
          <Link href="/" aria-label="EYTE home" className="pointer-events-auto block text-ink" onClick={() => toggleMenu(false)}>
            <CircleLogo
              className={cn(
                "transition-[width,height] duration-700 ease-[var(--ease-expo)]",
                compact ? "h-16 w-16 md:h-20 md:w-20" : "h-[72px] w-[72px] md:h-[108px] md:w-[108px]",
              )}
            />
          </Link>

          {/* Desktop: era-style stacked nav that condenses into a pill on scroll */}
          <nav aria-label="Main" className="pointer-events-auto hidden md:block">
            <div
              inert={compact}
              className={cn(
                "halo text-right transition-all duration-700 ease-[var(--ease-expo)]",
                compact ? "pointer-events-none -translate-y-3 opacity-0" : "opacity-100",
              )}
            >
              <Link href="/shop" className="display inline-block text-[30px] leading-[0.9]">
                <span className="link-underline">The</span>
                <br />
                <span className="link-underline">Collection</span>
              </Link>
              <ul className="eyebrow mt-4 space-y-1.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-grow">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={cart.open} className="eyebrow link-grow cursor-pointer">
                    Bag ({count})
                  </button>
                </li>
              </ul>
            </div>
            <div
              inert={!compact}
              className={cn(
                "absolute right-8 top-6 flex items-center gap-1 rounded-full border hairline bg-paper/85 p-1 backdrop-blur-md transition-all duration-700 ease-[var(--ease-expo)]",
                compact ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
              )}
            >
              <Link href="/shop" className="eyebrow rounded-full px-4 py-2.5 hover:bg-paper-2">
                Shop
              </Link>
              <Link href="/families" className="eyebrow rounded-full px-4 py-2.5 hover:bg-paper-2">
                Families
              </Link>
              <button type="button" onClick={cart.open} className="eyebrow cursor-pointer rounded-full bg-ink px-4 py-2.5 text-paper">
                Bag ({count})
              </button>
            </div>
          </nav>

          {/* Mobile */}
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border hairline bg-paper/85 p-1 backdrop-blur-md md:hidden">
            <button type="button" onClick={cart.open} className="eyebrow rounded-full px-3.5 py-2.5">
              Bag ({count})
            </button>
            <button
              type="button"
              onClick={() => toggleMenu(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="eyebrow rounded-full bg-ink px-3.5 py-2.5 text-paper"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={cn(
          "fixed inset-0 z-30 flex flex-col bg-paper px-5 pb-10 pt-28 transition-[opacity,visibility] duration-500 md:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-2">
          {[{ href: "/", label: "Home" }, { href: "/shop", label: "The Collection" }, ...NAV].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => toggleMenu(false)} className="display text-[13vw] leading-[0.95]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <p className="eyebrow text-mute">Shop by family</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FAMILY_LIST.map((f) => (
              <Link
                key={f.slug}
                href={`/families/${f.slug}`}
                onClick={() => toggleMenu(false)}
                className="eyebrow flex items-center gap-2 rounded-full border hairline px-3 py-2"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: f.colors.accent }} />
                {f.short}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
