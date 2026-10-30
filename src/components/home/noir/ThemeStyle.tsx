import { ThemeStyle } from "../ThemeStyle";

/* Theme 3 — Noir & Gold palette (see ../arabian/ThemeStyle.tsx for how themes apply). */
export const NOIR_CSS = `
:root {
  --color-paper: #080808;
  --color-paper-2: #0f0e0d;
  --color-paper-3: #191714;
  --color-ink: #f4ede0;
  --color-ink-2: #c8bfae;
  --color-mute: #8a8377;
  --color-gold: #c9a45c;
  --color-gold-2: #e6c987;
  --color-line: rgb(201 164 92 / 0.22);
  --font-display: var(--font-bodoni), "Didot", "Bodoni 72", serif;
  --color-scrim: rgb(0 0 0 / 0.6);
  --family-soft: 0%;
  --family-ink: 55%;
  color-scheme: dark;
}
::selection {
  background: var(--color-gold);
  color: #080808;
}
.display {
  text-transform: none;
  font-weight: 600;
  letter-spacing: -0.012em;
  line-height: 1;
  font-variation-settings: "opsz" 72;
}
.btn {
  height: 3rem;
  padding: 0 1.6rem;
  border-radius: 2px;
  font-stretch: 100%;
  letter-spacing: 0.16em;
}
.btn-ink {
  background: linear-gradient(180deg, #edd08a 0%, #d2a95a 52%, #b88c3f 100%);
  color: #0b0a08;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.35), 0 10px 30px -12px rgb(210 169 90 / 0.55);
}
.btn-ink:hover {
  background: linear-gradient(180deg, #f5dea3 0%, #ddb76a 52%, #c4984a 100%);
}
.btn-ghost {
  border-color: rgb(230 201 135 / 0.6);
  color: var(--color-gold-2);
}
.btn-ghost:hover {
  border-color: var(--color-gold-2);
  background: rgb(230 201 135 / 0.08);
}
`;

export function NoirThemeStyle() {
  return <ThemeStyle css={NOIR_CSS} />;
}
