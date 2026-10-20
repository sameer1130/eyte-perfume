import { Hero } from "@/components/home/Hero";
import {
  Bestsellers,
  Collections,
  FamilyGrid,
  HouseIntro,
  PromiseStrip,
  SocialSection,
  ThreeActsIntro,
} from "@/components/home/HomeSections";

export default function HomePage() {
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
