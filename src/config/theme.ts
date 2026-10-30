/**
 * Site themes. Each has its own home page, and the live theme's palette also
 * colours the shop, family and product pages (see SiteThemeStyle).
 *
 * To switch theme, set HOME_THEME to another id below.
 * Every theme can always be previewed at /themes/<id>.
 * Theme 1 is also preserved in git as tag `theme-1-floral` / branch `theme/floral`.
 */
export const HOME_THEMES = {
  floral: {
    label: "Theme 1 · Floral",
    description: "Cream and botanicals, after era-residence.com.",
  },
  arabian: {
    label: "Theme 2 · Arabian Nights",
    description: "Black, gold and coffee brown, with real EYTE campaign imagery.",
  },
  noir: {
    label: "Theme 3 · Noir & Gold",
    description: "Near-black, ivory and gold, with a bottle on stone in gold smoke.",
  },
} as const;

export type HomeThemeId = keyof typeof HOME_THEMES;

export const HOME_THEME: HomeThemeId = "arabian";

export function isHomeThemeId(value: string): value is HomeThemeId {
  return value in HOME_THEMES;
}
