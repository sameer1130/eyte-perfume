export const FAMILY_SLUGS = [
  "citrus",
  "floral",
  "gourmand",
  "woody",
  "amber",
  "aquatic",
] as const;

export type FamilySlug = (typeof FAMILY_SLUGS)[number];

export type Family = {
  slug: FamilySlug;
  name: string;
  short: string;
  /** Single script word used as an accent over display type. */
  word: string;
  tagline: string;
  description: string;
  keyNotes: string[];
  wearsBest: string;
  /** Which way the botanical grows in its scene. */
  growth: "hang" | "rise";
  colors: {
    accent: string;
    deep: string;
    soft: string;
  };
};

export const FAMILIES: Record<FamilySlug, Family> = {
  citrus: {
    slug: "citrus",
    name: "Citrus & Zest",
    short: "Citrus",
    word: "bright",
    tagline: "Sun-struck peel, cold-pressed.",
    description:
      "Bergamot, lemon and neroli: the sparkling openers that feel like the first breath of morning. Clean, uplifting and made for daylight.",
    keyNotes: ["Bergamot", "Lemon", "Mandarin", "Grapefruit", "Neroli", "Lime"],
    wearsBest: "Daytime · Summer · Office",
    growth: "hang",
    colors: { accent: "#E0AE1B", deep: "#7D5B0E", soft: "#F8EFCF" },
  },
  floral: {
    slug: "floral",
    name: "Florals",
    short: "Floral",
    word: "romantic",
    tagline: "Petals in full bloom.",
    description:
      "Rose, jasmine and tuberose, gathered at their most fragrant. From dewy and soft to lush and heady, florals are the heart of perfumery.",
    keyNotes: ["Rose", "Jasmine", "Tuberose", "Peony", "Orange Blossom", "Iris"],
    wearsBest: "Spring · Brunch · Weddings",
    growth: "hang",
    colors: { accent: "#D4458A", deep: "#8C2457", soft: "#F7E1EA" },
  },
  gourmand: {
    slug: "gourmand",
    name: "Vanilla & Gourmand",
    short: "Gourmand",
    word: "indulgent",
    tagline: "Vanilla pods, praline and warm tonka.",
    description:
      "Edible, addictive and endlessly cosy. Vanilla, caramel, coffee and tonka wrap the skin like cashmere and linger long after you leave.",
    keyNotes: ["Vanilla", "Tonka Bean", "Praline", "Caramel", "Coffee", "Dates"],
    wearsBest: "Evenings · Winter · Date night",
    growth: "hang",
    colors: { accent: "#C08F4F", deep: "#5E3B22", soft: "#F5EBDA" },
  },
  woody: {
    slug: "woody",
    name: "Woods & Oud",
    short: "Woody",
    word: "grounded",
    tagline: "Oud, sandalwood and cedar in slow smoke.",
    description:
      "The soul of Arabian perfumery. Precious oud, creamy sandalwood and dry cedar burn slowly, like bakhoor drifting through a quiet room.",
    keyNotes: ["Oud", "Sandalwood", "Cedarwood", "Vetiver", "Patchouli", "Birch"],
    wearsBest: "Evenings · Autumn · Occasions",
    growth: "hang",
    colors: { accent: "#7E5A3A", deep: "#3A281B", soft: "#EBE2D5" },
  },
  amber: {
    slug: "amber",
    name: "Amber & Spice",
    short: "Amber",
    word: "magnetic",
    tagline: "Saffron, cardamom and glowing amber.",
    description:
      "Warm resins and precious spices from the old trade routes. Saffron, cardamom and cinnamon over a glowing amber base: bold and unforgettable.",
    keyNotes: ["Saffron", "Cardamom", "Cinnamon", "Amber", "Incense", "Pink Pepper"],
    wearsBest: "Night · Winter · Celebrations",
    growth: "rise",
    colors: { accent: "#C4521C", deep: "#74290E", soft: "#F6E2D3" },
  },
  aquatic: {
    slug: "aquatic",
    name: "Fresh & Aquatic",
    short: "Aquatic",
    word: "free",
    tagline: "Sea salt, mint and open air.",
    description:
      "Crisp marine accords, cool mint and aromatic lavender. Effortless freshness that feels like a sea breeze on sun-warmed skin.",
    keyNotes: ["Sea Notes", "Mint", "Lavender", "Green Tea", "Ambroxan", "Sage"],
    wearsBest: "Daytime · Summer · Gym & travel",
    growth: "rise",
    colors: { accent: "#2C86A6", deep: "#174A5E", soft: "#DCEEF2" },
  },
};

export const FAMILY_LIST: Family[] = FAMILY_SLUGS.map((s) => FAMILIES[s]);

export function isFamilySlug(value: string): value is FamilySlug {
  return (FAMILY_SLUGS as readonly string[]).includes(value);
}
