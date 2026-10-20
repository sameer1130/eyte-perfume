"use client";

/*
 * Theme 2 — Arabian Nights palette. Redefining the palette variables re-skins
 * the header, footer, cart and every shared section, because all of them read
 * colours and fonts from these variables.
 *
 * The stylesheet is owned by the page and switched off (media="not all") when
 * Next.js hides the page with <Activity> after navigating away, so the theme
 * never leaks onto product or shop pages.
 */
const ARABIAN_CSS = `
:root {
  --color-paper: #140a17;
  --color-paper-2: #1c0f21;
  --color-paper-3: #2a1631;
  --color-ink: #f3e8d8;
  --color-ink-2: #d5c4b0;
  --color-mute: #9c8794;
  --color-gold: #d3af6b;
  --color-gold-2: #e9d29c;
  --color-line: rgb(243 232 216 / 0.14);
  --font-display: var(--font-bodoni), "Didot", "Bodoni 72", serif;
  color-scheme: dark;
}
.display {
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 0.92;
  font-variation-settings: "opsz" 96;
}
.eyebrow, .btn {
  font-family: var(--font-cinzel), "Trajan Pro", serif;
  font-stretch: normal;
  font-weight: 600;
  letter-spacing: 0.22em;
}
.btn-ink {
  background: linear-gradient(135deg, #ecd6a0 0%, #c99c4f 55%, #a6772f 100%);
  color: #1a0e12;
}
.btn-ink:hover {
  background: linear-gradient(135deg, #f3e1b4 0%, #d4a95c 55%, #b5843a 100%);
}
.btn-ghost {
  border-color: rgb(233 210 156 / 0.35);
}
.btn-ghost:hover {
  border-color: var(--color-gold-2);
}
`;

export function ArabianThemeStyle() {
  return (
    <style
      ref={(el) => {
        if (el) el.media = "all";
        return () => {
          if (el) el.media = "not all";
        };
      }}
    >
      {ARABIAN_CSS}
    </style>
  );
}
