"use client";

import { useSyncExternalStore } from "react";

export type CartLine = { slug: string; ml: number; qty: number };

type CartState = { lines: CartLine[]; open: boolean };

const KEY = "eyte-cart-v1";
const SERVER_STATE: CartState = { lines: [], open: false };

let state: CartState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(saved)) state = { ...state, lines: saved };
  } catch {
    // Storage unavailable (private mode) or corrupt: start with an empty bag.
  }
}

function set(next: Partial<CartState>) {
  state = { ...state, ...next };
  if (next.lines) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state.lines));
    } catch {
      // Ignore: the bag still works for this session.
    }
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  load();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const cart = {
  add(slug: string, ml: number, qty = 1) {
    load();
    const existing = state.lines.find((l) => l.slug === slug && l.ml === ml);
    const lines = existing
      ? state.lines.map((l) => (l === existing ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
      : [...state.lines, { slug, ml, qty }];
    set({ lines, open: true });
  },
  setQty(slug: string, ml: number, qty: number) {
    const lines =
      qty <= 0
        ? state.lines.filter((l) => !(l.slug === slug && l.ml === ml))
        : state.lines.map((l) => (l.slug === slug && l.ml === ml ? { ...l, qty: Math.min(10, qty) } : l));
    set({ lines });
  },
  remove(slug: string, ml: number) {
    set({ lines: state.lines.filter((l) => !(l.slug === slug && l.ml === ml)) });
  },
  open() {
    set({ open: true });
  },
  close() {
    set({ open: false });
  },
};

export function useCart(): CartState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}
