"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { FAMILIES } from "@/data/families";
import { formatPrice, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { cart, useCart } from "./cart-store";
import { familySurface } from "@/lib/family-colors";

const FREE_SHIPPING = 2000;

export function CartDrawer() {
  const { lines, open } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    setScrollLocked(open);
    if (open) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = lines.flatMap((line) => {
    const product = getProduct(line.slug);
    const size = product?.sizes.find((s) => s.ml === line.ml);
    return product && size ? [{ ...line, product, size }] : [];
  });
  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.size.price * i.qty, 0);
  const toFree = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div
        onClick={cart.close}
        className={cn("absolute inset-0 bg-scrim backdrop-blur-[2px] transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        data-lenis-prevent
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col border-l hairline bg-paper shadow-2xl transition-transform duration-700 ease-[var(--ease-expo)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-end justify-between border-b hairline px-6 pb-5 pt-7">
          <div>
            <p className="eyebrow text-mute">{count} {count === 1 ? "item" : "items"}</p>
            <h2 className="display mt-1 text-5xl">Your bag</h2>
          </div>
          <button ref={closeRef} type="button" onClick={cart.close} className="eyebrow link-grow cursor-pointer pb-1">
            Close
          </button>
        </div>

        <div className="border-b hairline px-6 py-4">
          <p className="text-[13px] text-ink-2">
            {toFree > 0 ? (
              <>
                You&apos;re <strong className="font-semibold">{formatPrice(toFree)}</strong> away from free shipping
              </>
            ) : (
              "You've unlocked free shipping."
            )}
          </p>
          <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-paper-3">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-700 ease-[var(--ease-expo)]"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center pb-20 text-center">
              <p className="script text-6xl text-gold">empty</p>
              <p className="mt-3 max-w-[16rem] text-sm text-ink-2">Your bag is waiting for its first scent.</p>
              <Link href="/shop" onClick={cart.close} className="btn btn-ink mt-8">
                Explore the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {items.map(({ product, size, qty }) => {
                const fam = FAMILIES[product.family];
                return (
                  <li key={`${product.slug}-${size.ml}`} className="flex gap-4 py-5">
                    <Link
                      href={`/perfume/${product.slug}`}
                      onClick={cart.close}
                      className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm"
                      style={{ background: familySurface(fam) }}
                    >
                      <ProductImage product={product} sizes="96px" cutoutClassName="inset-x-3 top-2.5 bottom-3" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="eyebrow text-mute">{product.house}</p>
                      <Link href={`/perfume/${product.slug}`} onClick={cart.close} className="display mt-1 truncate text-2xl">
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-mute">
                        {size.ml} ml · {product.concentration}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border hairline">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => cart.setQty(product.slug, size.ml, qty - 1)}
                            className="h-8 w-8 cursor-pointer text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => cart.setQty(product.slug, size.ml, qty + 1)}
                            className="h-8 w-8 cursor-pointer text-lg leading-none"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-medium tabular-nums">{formatPrice(size.price * qty)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(product.slug, size.ml)}
                        className="eyebrow mt-2 self-start text-mute hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t hairline px-6 pb-7 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Subtotal</span>
              <span className="display text-3xl tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-mute">Taxes included. Shipping calculated at checkout.</p>
            <button type="button" onClick={() => setNotice(true)} className="btn btn-ink mt-5 w-full cursor-pointer">
              Checkout
            </button>
            <p aria-live="polite" className="mt-3 min-h-5 text-center text-xs text-mute">
              {notice ? "Checkout connects once the backend is ready." : "100% original · Gift-ready packaging"}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
