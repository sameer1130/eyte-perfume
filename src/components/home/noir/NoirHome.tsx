import { FAMILY_SLUGS, type FamilySlug } from "@/data/families";
import { productsInFamily } from "@/lib/catalog";
import { RitualEditorial, InstagramWall } from "../arabian/ArabianSections";
import { ScentTypes } from "../arabian/ScentTypes";
import { PromiseStrip } from "../floral/HomeSections";
import { NoirHero } from "./NoirHero";
import { GoldBand, Masterpieces, NoirClose } from "./NoirSections";
import { NoirThemeStyle } from "./ThemeStyle";

/**
 * Theme 3 — "Noir & Gold": near-black, ivory and gold, after the EYE PERFUME
 * reference. NoirThemeStyle re-skins the header, footer and shared sections
 * while this page is shown.
 */
export function NoirHome() {
  const counts = Object.fromEntries(FAMILY_SLUGS.map((f) => [f, productsInFamily(f).length])) as Record<FamilySlug, number>;

  return (
    <div className="bg-paper text-ink">
      <NoirThemeStyle />
      <NoirHero />
      <Masterpieces />
      <GoldBand />
      <ScentTypes counts={counts} />
      <RitualEditorial />
      <InstagramWall />
      <PromiseStrip />
      <NoirClose />
    </div>
  );
}
