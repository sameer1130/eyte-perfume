"use client";

/*
 * A home theme's palette overrides. Redefining the palette variables re-skins
 * the header, footer, cart and every shared section, because all of them read
 * colours and fonts from these variables.
 *
 * The stylesheet is owned by the page and switched off (media="not all") when
 * Next.js hides the page with <Activity> after navigating away, so a theme
 * preview (/themes/<id>) never leaks onto the pages that follow. The live
 * theme's palette is applied site-wide by layout/SiteThemeStyle.tsx instead.
 */
export function ThemeStyle({ css }: { css: string }) {
  return (
    <style
      ref={(el) => {
        if (el) el.media = "all";
        return () => {
          if (el) el.media = "not all";
        };
      }}
    >
      {css}
    </style>
  );
}
