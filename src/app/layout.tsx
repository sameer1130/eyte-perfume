import type { Metadata } from "next";
import { Archivo, Aref_Ruqaa, Bodoni_Moda, Cinzel, Instrument_Serif, Pinyon_Script } from "next/font/google";
import { Suspense } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { THEME_CSS } from "@/components/home/HomeForTheme";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SideRail } from "@/components/layout/SideRail";
import { SiteThemeStyle } from "@/components/layout/SiteThemeStyle";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { HOME_THEME } from "@/config/theme";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

const script = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script-face",
});

const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

// Theme 2 and 3 faces: not preloaded, so the Floral theme doesn't pay for them.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  preload: false,
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  preload: false,
});

const arabic = Aref_Ruqaa({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "EYTE — Authentic Luxury Perfumes",
    template: "%s · EYTE",
  },
  description:
    "Authentic luxury perfumes from the Middle East and the world. 100% original, long lasting, shipped worldwide.",
};

const siteCss = THEME_CSS[HOME_THEME];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${sans.variable} ${bodoni.variable} ${cinzel.variable} ${arabic.variable}`}>
      <body className="min-h-svh">
        {siteCss && (
          // Paths not known at build time can't be checked for a preview, so they get the palette straight away.
          <Suspense fallback={<style>{siteCss}</style>}>
            <SiteThemeStyle css={siteCss} />
          </Suspense>
        )}
        <a href="#main" className="eyebrow sr-only z-[60] rounded-full bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <SideRail />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </SmoothScroll>
      </body>
    </html>
  );
}
