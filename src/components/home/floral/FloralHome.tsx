import { Hero } from "./Hero";
import {
  Bestsellers,
  Collections,
  FamilyGrid,
  HouseIntro,
  PromiseStrip,
  SocialSection,
  ThreeActsIntro,
} from "./HomeSections";

/** Theme 1 — "Floral": cream, era-residence inspired, botanicals in the breeze. */
export function FloralHome() {
  return (
    <>
      <Hero />
      <HouseIntro />
      <FamilyGrid />
      <ThreeActsIntro />
      <Bestsellers />
      <Collections />
      <PromiseStrip />
      <SocialSection />
    </>
  );
}
