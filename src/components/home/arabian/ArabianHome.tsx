import { FAMILY_SLUGS, type FamilySlug } from "@/data/families";
import { bestsellers, getProduct, productsInFamily } from "@/lib/catalog";
import { PromiseStrip, ThreeActsIntro } from "../floral/HomeSections";
import { CollectionsArabian, InstagramWall, NightClose, RibbonBand, RitualEditorial } from "./ArabianSections";
import { HeroSlider } from "./HeroSlider";
import { LovedCarousel } from "./LovedCarousel";
import { ScentTypes } from "./ScentTypes";
import { ArabianThemeStyle } from "./ThemeStyle";

/**
 * Theme 2 — "Arabian Nights": aubergine, gold and coffee brown, real EYTE
 * campaign imagery, after the ELORA and ZENFOX references. ArabianThemeStyle
 * re-skins the header, footer and shared sections while this page is shown.
 */
export function ArabianHome() {
  const counts = Object.fromEntries(FAMILY_SLUGS.map((f) => [f, productsInFamily(f).length])) as Record<FamilySlug, number>;
  const qahwa = getProduct("lattafa-khamrah-qahwa")!;
  const loved = [qahwa, ...bestsellers(9).filter((p) => p.slug !== qahwa.slug)];

  return (
    <div className="bg-paper text-ink">
      <ArabianThemeStyle />
      <HeroSlider />
      <RibbonBand />
      <ScentTypes counts={counts} />
      <LovedCarousel products={loved} />
      <RitualEditorial />
      <ThreeActsIntro />
      <CollectionsArabian />
      <InstagramWall />
      <PromiseStrip />
      <NightClose />
    </div>
  );
}
