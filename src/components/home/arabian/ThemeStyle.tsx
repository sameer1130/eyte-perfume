import { ThemeStyle } from "../ThemeStyle";

/*
 * Theme 2 — Arabian Nights palette. While it's the live theme, the root layout
 * applies it to every page; the home page also carries it so /themes/arabian
 * previews it (see ../ThemeStyle.tsx).
 */
export const ARABIAN_CSS = `
:root {
  --color-paper: #0a0a0a;
  --color-paper-2: #131313;
  --color-paper-3: #1f1f1f;
  --color-ink: #f3e8d8;
  --color-ink-2: #d5c4b0;
  --color-mute: #8c8c8c;
  --color-gold: #d3af6b;
  --color-gold-2: #e9d29c;
  --color-line: rgb(243 232 216 / 0.14);
  --font-display: var(--font-bodoni), "Didot", "Bodoni 72", serif;
  --color-scrim: rgb(0 0 0 / 0.6);
  --family-soft: 0%;
  --family-ink: 55%;
  color-scheme: dark;
}
.display {
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 0.92;
}
.eyebrow, .btn {
  font-family: var(--font-cinzel), "Trajan Pro", serif;
  font-stretch: normal;
  font-weight: 600;
  letter-spacing: 0.22em;
}
.btn-ink {
  background: linear-gradient(135deg, #ecd6a0 0%, #c99c4f 55%, #a6772f 100%);
  color: #111111;
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
  return <ThemeStyle css={ARABIAN_CSS} />;
}
