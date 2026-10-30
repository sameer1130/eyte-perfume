import type { HomeThemeId } from "@/config/theme";
import { ArabianHome } from "./arabian/ArabianHome";
import { ARABIAN_CSS } from "./arabian/ThemeStyle";
import { FloralHome } from "./floral/FloralHome";
import { NoirHome } from "./noir/NoirHome";
import { NOIR_CSS } from "./noir/ThemeStyle";

/** Each theme's palette overrides; Floral is the default palette in globals.css. */
export const THEME_CSS: Partial<Record<HomeThemeId, string>> = {
  arabian: ARABIAN_CSS,
  noir: NOIR_CSS,
};

/** Renders the home page of the given theme. */
export function HomeForTheme({ theme }: { theme: HomeThemeId }) {
  switch (theme) {
    case "floral":
      return <FloralHome />;
    case "arabian":
      return <ArabianHome />;
    case "noir":
      return <NoirHome />;
  }
}
