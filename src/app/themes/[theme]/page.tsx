import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HomeForTheme } from "@/components/home/HomeForTheme";
import { HOME_THEME, HOME_THEMES, isHomeThemeId, type HomeThemeId } from "@/config/theme";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return Object.keys(HOME_THEMES).map((theme) => ({ theme }));
}

export async function generateMetadata({ params }: PageProps<"/themes/[theme]">): Promise<Metadata> {
  const { theme } = await params;
  return {
    title: isHomeThemeId(theme) ? `${HOME_THEMES[theme].label} preview` : "Theme preview",
    robots: { index: false, follow: false },
  };
}

/** Preview any home theme regardless of which one is live, to compare or revert. */
export default function ThemePreviewPage({ params }: PageProps<"/themes/[theme]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <ThemePreview params={params} />
    </Suspense>
  );
}

async function ThemePreview({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  if (!isHomeThemeId(theme)) notFound();
  return (
    <>
      <HomeForTheme theme={theme} />
      <ThemeSwitcher current={theme} />
    </>
  );
}

function ThemeSwitcher({ current }: { current: HomeThemeId }) {
  return (
    <nav
      aria-label="Theme previews"
      className="fixed bottom-5 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border hairline bg-paper/90 p-1 shadow-xl backdrop-blur-md [scrollbar-width:none]"
    >
      {(Object.keys(HOME_THEMES) as HomeThemeId[]).map((id) => (
        <Link
          key={id}
          href={`/themes/${id}`}
          aria-current={id === current ? "page" : undefined}
          className={cn("eyebrow whitespace-nowrap rounded-full px-4 py-2.5", id === current ? "bg-ink text-paper" : "hover:bg-paper-2")}
        >
          {HOME_THEMES[id].label}
          {id === HOME_THEME && <span className="ml-2 opacity-60">· live</span>}
        </Link>
      ))}
    </nav>
  );
}
