"use client";

import { useEffect, useRef, useState } from "react";
import { cart } from "@/components/cart/cart-store";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function PurchasePanel({ product }: { product: Product }) {
  const [ml, setMl] = useState(product.sizes[product.sizes.length - 1].ml);
  const [qty, setQty] = useState(1);
  const [stuck, setStuck] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const size = product.sizes.find((s) => s.ml === ml) ?? product.sizes[0];
  const save = size.compareAt ? size.compareAt - size.price : 0;

  // Show the compact bar once the main button has scrolled out of view.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => cart.add(product.slug, size.ml, qty);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="display text-5xl tabular-nums">{formatPrice(size.price)}</span>
        {size.compareAt && (
          <>
            <span className="text-mute line-through tabular-nums">{formatPrice(size.compareAt)}</span>
            <span className="eyebrow rounded-full bg-ink px-2.5 py-1 text-paper">Save {formatPrice(save)}</span>
          </>
        )}
      </div>
      <p className="mt-1.5 text-xs text-mute">Tax included. Shipping calculated at checkout.</p>

      <div className="mt-8">
        <p className="eyebrow text-ink-2">Size</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
          {product.sizes.map((s) => (
            <button
              key={s.ml}
              type="button"
              role="radio"
              aria-checked={s.ml === ml}
              onClick={() => setMl(s.ml)}
              className={cn(
                "cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors",
                s.ml === ml ? "border-ink bg-ink text-paper" : "hairline hover:border-ink",
              )}
            >
              {s.ml} ml
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex items-center rounded-full border hairline">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-[52px] w-11 cursor-pointer text-lg">
            −
          </button>
          <span className="w-6 text-center tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-[52px] w-11 cursor-pointer text-lg">
            +
          </button>
        </div>
        <button ref={buttonRef} type="button" onClick={add} className="btn btn-ink flex-1 cursor-pointer">
          Add to bag · {formatPrice(size.price * qty)}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t hairline bg-paper/90 px-4 py-3 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-expo)] lg:hidden",
          stuck ? "translate-y-0" : "translate-y-full",
        )}
        inert={!stuck}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="display truncate text-xl">{product.name}</p>
            <p className="text-xs text-mute">
              {size.ml} ml · {formatPrice(size.price)}
            </p>
          </div>
          <button type="button" onClick={add} className="btn btn-ink h-11 cursor-pointer px-5">
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
