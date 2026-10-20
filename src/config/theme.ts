/**
 * Home page themes. Only the home page changes between themes; product,
 * family and shop pages keep the Floral look.
 *
 * To switch back to Theme 1, set HOME_THEME to "floral".
 * Both themes can always be previewed at /themes/floral and /themes/arabian.
 * Theme 1 is also preserved in git as tag `theme-1-floral` / branch `theme/floral`.
 */
export const HOME_THEMES = {
  floral: {
    label: "Theme 1 · Floral",
    description: "Cream and botanicals, after era-residence.com.",
  },
  arabian: {
    label: "Theme 2 · Arabian Nights",
    description: "Purple, gold and coffee brown, with real EYTE campaign imagery.",
  },
} as const;

export type HomeThemeId = keyof typeof HOME_THEMES;

export const HOME_THEME: HomeThemeId = "arabian";

export function isHomeThemeId(value: string): value is HomeThemeId {
  return value in HOME_THEMES;
}
