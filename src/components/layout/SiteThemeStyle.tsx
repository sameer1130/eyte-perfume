"use client";

import { usePathname } from "next/navigation";

/**
 * The live theme's palette on every page. Theme previews (/themes/*) carry
 * their own palette, so this one steps aside there.
 */
export function SiteThemeStyle({ css }: { css: string }) {
  return usePathname().startsWith("/themes/") ? null : <style>{css}</style>;
}
