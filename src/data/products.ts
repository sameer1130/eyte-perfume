import type { FamilySlug } from "./families";

/*
 * SAMPLE CATALOG: product names, notes and prices are placeholders for the
 * frontend build. Replace with EYTE's real inventory before launch.
 */

export type Collection = "middle-eastern" | "international";
export type Gender = "men" | "women" | "unisex";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type BottleShape = "tower" | "dome" | "facet" | "orb" | "slab" | "flask";
export type CapStyle = "gold" | "black" | "silver" | "wood";

export type Size = { ml: number; price: number; compareAt?: number };

export type Product = {
  slug: string;
  name: string;
  house: string;
  collection: Collection;
  gender: Gender;
  concentration: "Eau de Parfum" | "Eau de Toilette" | "Extrait de Parfum" | "Parfum";
  family: FamilySlug;
  tagline: string;
  description: string[];
  notes: { top: string[]; heart: string[]; base: string[] };
  sizes: Size[];
  profile: {
    longevity: string;
    /** 1–5 scales */
    longevityScore: number;
    projection: number;
    sweetness: number;
    freshness: number;
  };
  seasons: Season[];
  time: "day" | "night" | "day & night";
  occasions: { title: string; text: string }[];
  comparedTo?: { house: string; name: string; text: string }[];
  rating: number;
  reviewCount: number;
  badges?: ("bestseller" | "new" | "limited")[];
  bottle: { shape: BottleShape; cap: CapStyle; liquid: string };
  /** Real product photography (EYTE campaign imagery), used where the theme shows photos. */
  photo?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "lattafa-khamrah",
    name: "Khamrah",
    house: "Lattafa",
    collection: "middle-eastern",
    gender: "unisex",
    concentration: "Eau de Parfum",
    family: "gourmand",
    tagline: "The scent that starts conversations.",
    description: [
      "A warm, spiced oriental that opens with cinnamon and nutmeg before melting into a heart of dates and praline. It is rich, generous and unmistakably Middle Eastern.",
      "As it settles, vanilla, tonka and benzoin leave a glowing, dessert-like trail that lasts well into the night. Khamrah does not shout. It lingers.",
    ],
    notes: {
      top: ["Cinnamon", "Nutmeg", "Bergamot"],
      heart: ["Dates", "Praline", "Tuberose"],
      base: ["Vanilla", "Tonka Bean", "Benzoin", "Myrrh", "Amberwood"],
    },
    sizes: [{ ml: 100, price: 3450, compareAt: 4500 }],
    profile: { longevity: "8–10 hrs", longevityScore: 5, projection: 4, sweetness: 5, freshness: 1 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Evening events", text: "Dinners, weddings and parties, wherever impressions matter." },
      { title: "Winter nights", text: "The spiced vanilla base blooms beautifully in cool air." },
      { title: "Date night", text: "Close-wearing, sensual and magnetic." },
    ],
    comparedTo: [
      { house: "Kilian", name: "Angels' Share", text: "Shares the boozy, spiced-dessert DNA at a fraction of the price." },
    ],
    rating: 4.8,
    reviewCount: 214,
    badges: ["bestseller"],
    bottle: { shape: "dome", cap: "gold", liquid: "#A8612B" },
  },
  {
    slug: "lattafa-khamrah-qahwa",
    name: "Khamrah Qahwa",
    house: "Lattafa",
    collection: "middle-eastern",
    gender: "unisex",
    concentration: "Eau de Parfum",
    family: "gourmand",
    tagline: "Arabic coffee, spiced and sweetened.",
    description: [
      "Cinnamon, cardamom and ginger open like freshly poured qahwa: warm, aromatic and inviting.",
      "Praline and candied fruits sweeten the heart before coffee, vanilla, tonka and benzoin settle into a rich, roasted trail that stays all night.",
    ],
    notes: {
      top: ["Cinnamon", "Cardamom", "Ginger"],
      heart: ["Praline", "Candied Fruits", "White Flowers"],
      base: ["Coffee", "Vanilla", "Tonka Bean", "Benzoin", "Musk"],
    },
    sizes: [{ ml: 100, price: 3650, compareAt: 4600 }],
    profile: { longevity: "8–10 hrs", longevityScore: 5, projection: 4, sweetness: 4, freshness: 1 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Majlis evenings", text: "Coffee and spice, made for long conversations." },
      { title: "Winter nights", text: "Roasted warmth that blooms in cool air." },
      { title: "Gifting", text: "The crystal-cut bottle feels like a treasure." },
    ],
    rating: 4.8,
    reviewCount: 96,
    badges: ["new"],
    bottle: { shape: "facet", cap: "silver", liquid: "#B9782A" },
    photo: "/images/instagram/khamrah-qahwa.webp",
  },
  {
    slug: "lattafa-yara",
    name: "Yara",
    house: "Lattafa",
    collection: "middle-eastern",
    gender: "women",
    concentration: "Eau de Parfum",
    family: "floral",
    tagline: "Soft, creamy and impossibly pretty.",
    description: [
      "Orchid and heliotrope float over a sparkle of tangerine, creating a powdery floral that feels like silk against the skin.",
      "A creamy heart of tropical fruit gives way to vanilla, musk and sandalwood. It is sweet without being heavy, and it is everywhere for a reason.",
    ],
    notes: {
      top: ["Orchid", "Heliotrope", "Tangerine"],
      heart: ["Gourmand Accord", "Tropical Fruits"],
      base: ["Vanilla", "Musk", "Sandalwood"],
    },
    sizes: [{ ml: 100, price: 2250, compareAt: 2800 }],
    profile: { longevity: "6–8 hrs", longevityScore: 4, projection: 3, sweetness: 4, freshness: 2 },
    seasons: ["spring", "autumn", "winter"],
    time: "day & night",
    occasions: [
      { title: "Everyday signature", text: "Soft enough for the office, pretty enough for brunch." },
      { title: "Gifting", text: "The pink bottle and crowd-pleasing scent make it a safe, lovely gift." },
      { title: "Evenings out", text: "The vanilla base turns cosy and warm after dark." },
    ],
    rating: 4.7,
    reviewCount: 188,
    badges: ["bestseller"],
    bottle: { shape: "orb", cap: "gold", liquid: "#E79AB8" },
  },
  {
    slug: "afnan-9pm",
    name: "9PM",
    house: "Afnan",
    collection: "middle-eastern",
    gender: "men",
    concentration: "Eau de Parfum",
    family: "amber",
    tagline: "Made for after dark.",
    description: [
      "Apple and cinnamon open bright and sweet, lifted by wild lavender and bergamot. Orange blossom softens the heart.",
      "Then the night takes over: vanilla, tonka and amber build a sweet, magnetic trail that projects for hours.",
    ],
    notes: {
      top: ["Apple", "Cinnamon", "Lavender", "Bergamot"],
      heart: ["Orange Blossom", "Lily of the Valley"],
      base: ["Vanilla", "Tonka Bean", "Amber", "Patchouli"],
    },
    sizes: [{ ml: 100, price: 2650, compareAt: 3200 }],
    profile: { longevity: "8–10 hrs", longevityScore: 5, projection: 5, sweetness: 4, freshness: 2 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Clubs & parties", text: "Loud in the best way. Compliments guaranteed." },
      { title: "Cool evenings", text: "The amber-vanilla base thrives in colder weather." },
      { title: "Night drives", text: "A sweet, confident trail that fills the space." },
    ],
    comparedTo: [
      { house: "Jean Paul Gaultier", name: "Ultra Male", text: "The same sweet lavender-vanilla energy, with extra spice." },
    ],
    rating: 4.6,
    reviewCount: 156,
    badges: ["bestseller"],
    bottle: { shape: "slab", cap: "black", liquid: "#3B3F58" },
  },
  {
    slug: "rasasi-hawas-for-him",
    name: "Hawas for Him",
    house: "Rasasi",
    collection: "middle-eastern",
    gender: "men",
    concentration: "Eau de Parfum",
    family: "aquatic",
    tagline: "A cool sea breeze, dressed in sweetness.",
    description: [
      "A burst of apple, bergamot and lemon gives way to an aquatic heart of plum, cardamom and orange blossom.",
      "Ambergris, musk and driftwood settle into a fresh, salty-sweet base that stays cool even in Indian summers.",
    ],
    notes: {
      top: ["Apple", "Bergamot", "Lemon", "Cinnamon"],
      heart: ["Aquatic Notes", "Plum", "Orange Blossom", "Cardamom"],
      base: ["Ambergris", "Musk", "Patchouli", "Driftwood"],
    },
    sizes: [{ ml: 100, price: 4200, compareAt: 5500 }],
    profile: { longevity: "7–9 hrs", longevityScore: 4, projection: 4, sweetness: 3, freshness: 5 },
    seasons: ["spring", "summer"],
    time: "day",
    occasions: [
      { title: "Summer days", text: "Stays fresh and clean in heat and humidity." },
      { title: "Beach & travel", text: "The aquatic heart feels right by the water." },
      { title: "Office", text: "Fresh, inoffensive, and always noticed." },
    ],
    rating: 4.7,
    reviewCount: 132,
    badges: ["bestseller"],
    bottle: { shape: "facet", cap: "silver", liquid: "#5FA9C8" },
  },
  {
    slug: "armaf-club-de-nuit-intense-man",
    name: "Club de Nuit Intense Man",
    house: "Armaf",
    collection: "middle-eastern",
    gender: "men",
    concentration: "Eau de Toilette",
    family: "woody",
    tagline: "Smoky, citrus, legendary.",
    description: [
      "Lemon, pineapple and black currant explode at the opening, sharp, juicy and bright.",
      "Smoky birch and rose give the heart its famous edge, before musk, ambergris and patchouli leave a dry, woody trail.",
    ],
    notes: {
      top: ["Lemon", "Pineapple", "Bergamot", "Black Currant", "Apple"],
      heart: ["Birch", "Jasmine", "Rose"],
      base: ["Musk", "Ambergris", "Patchouli", "Vanilla"],
    },
    sizes: [{ ml: 105, price: 2999, compareAt: 3800 }],
    profile: { longevity: "8–12 hrs", longevityScore: 5, projection: 5, sweetness: 2, freshness: 3 },
    seasons: ["spring", "autumn", "winter"],
    time: "day & night",
    occasions: [
      { title: "Boardroom", text: "Commanding, polished and confident." },
      { title: "Formal events", text: "Holds its own in a crowd for hours." },
      { title: "Signature scent", text: "The one people ask about." },
    ],
    comparedTo: [
      { house: "Creed", name: "Aventus", text: "The best-known Aventus-style smoky pineapple, for a fraction of the cost." },
    ],
    rating: 4.6,
    reviewCount: 241,
    bottle: { shape: "tower", cap: "black", liquid: "#2A2A2E" },
  },
  {
    slug: "lattafa-asad",
    name: "Asad",
    house: "Lattafa",
    collection: "middle-eastern",
    gender: "men",
    concentration: "Eau de Parfum",
    family: "amber",
    tagline: "Spice with a lion's roar.",
    description: [
      "Black pepper and tobacco hit first, lit up by a flash of pineapple.",
      "Coffee, patchouli and iris form a dark, elegant heart over a base of vanilla, amber and labdanum.",
    ],
    notes: {
      top: ["Black Pepper", "Pineapple", "Tobacco"],
      heart: ["Coffee", "Patchouli", "Iris"],
      base: ["Vanilla", "Amber", "Benzoin", "Labdanum", "Dry Woods"],
    },
    sizes: [{ ml: 100, price: 2150, compareAt: 2600 }],
    profile: { longevity: "8–10 hrs", longevityScore: 4, projection: 4, sweetness: 3, freshness: 2 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Night out", text: "Spicy, warm and attention-grabbing." },
      { title: "Winter weddings", text: "Rich enough for the grandest occasions." },
      { title: "Smart casual", text: "Dress it down with a leather jacket." },
    ],
    comparedTo: [
      { house: "Dior", name: "Sauvage Elixir", text: "A spicy, ambery take in the same vein." },
    ],
    rating: 4.5,
    reviewCount: 97,
    badges: ["new"],
    bottle: { shape: "tower", cap: "gold", liquid: "#1F1A17" },
  },
  {
    slug: "lattafa-oud-for-glory",
    name: "Oud for Glory",
    house: "Lattafa",
    collection: "middle-eastern",
    gender: "unisex",
    concentration: "Eau de Parfum",
    family: "woody",
    tagline: "Pure, unapologetic oud.",
    description: [
      "Saffron and nutmeg glow at the opening, lifted by a whisper of lavender.",
      "Then oud takes over, dark, resinous and smoky, deepened by patchouli and musk. A modern classic of Arabian perfumery.",
    ],
    notes: {
      top: ["Saffron", "Nutmeg", "Lavender"],
      heart: ["Oud", "Patchouli"],
      base: ["Oud", "Patchouli", "Musk"],
    },
    sizes: [{ ml: 100, price: 2450, compareAt: 2900 }],
    profile: { longevity: "10–12 hrs", longevityScore: 5, projection: 4, sweetness: 1, freshness: 1 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Eid & festivities", text: "Traditional, regal and celebratory." },
      { title: "Evening majlis", text: "Fills a room with quiet authority." },
      { title: "Layering", text: "Pairs beautifully with rose or vanilla scents." },
    ],
    rating: 4.6,
    reviewCount: 119,
    bottle: { shape: "flask", cap: "wood", liquid: "#4A2E1E" },
  },
  {
    slug: "al-haramain-laventure",
    name: "L'Aventure",
    house: "Al Haramain",
    collection: "middle-eastern",
    gender: "men",
    concentration: "Eau de Parfum",
    family: "citrus",
    tagline: "Fresh citrus with a woody pulse.",
    description: [
      "Sharp lemon and bergamot, energised by peppery elemi, make for a crisp, sunny opening.",
      "A clean heart leads to patchouli, musk and ambergris for a bright scent that still has backbone.",
    ],
    notes: {
      top: ["Lemon", "Bergamot", "Elemi"],
      heart: ["Petitgrain", "Rose", "Jasmine"],
      base: ["Patchouli", "Musk", "Ambergris"],
    },
    sizes: [
      { ml: 100, price: 2850, compareAt: 3400 },
      { ml: 200, price: 4600, compareAt: 5200 },
    ],
    profile: { longevity: "6–8 hrs", longevityScore: 4, projection: 4, sweetness: 1, freshness: 4 },
    seasons: ["spring", "summer"],
    time: "day",
    occasions: [
      { title: "Office", text: "Crisp, professional and clean." },
      { title: "Summer afternoons", text: "Bright citrus that holds up in the heat." },
      { title: "Weekend errands", text: "Easy to reach for, every single day." },
    ],
    rating: 4.4,
    reviewCount: 64,
    bottle: { shape: "slab", cap: "silver", liquid: "#E9C756" },
  },
  {
    slug: "lattafa-mayar",
    name: "Mayar",
    house: "Lattafa",
    collection: "middle-eastern",
    gender: "women",
    concentration: "Eau de Parfum",
    family: "floral",
    tagline: "A bouquet with a juicy twist.",
    description: [
      "Lychee and raspberry sparkle over white flowers, playful, bright and cheerful.",
      "Rose, jasmine and peony bloom at the heart before a soft vanilla-musk base. Feminine, elegant and modern.",
    ],
    notes: {
      top: ["Lychee", "Raspberry", "White Flowers"],
      heart: ["Rose", "Jasmine", "Peony"],
      base: ["Vanilla", "Musk", "Cashmere Wood"],
    },
    sizes: [{ ml: 100, price: 2350, compareAt: 2900 }],
    profile: { longevity: "6–8 hrs", longevityScore: 3, projection: 3, sweetness: 4, freshness: 3 },
    seasons: ["spring", "summer"],
    time: "day",
    occasions: [
      { title: "Brunch", text: "Fruity florals made for sunny tables." },
      { title: "Weddings", text: "Romantic and pretty in pictures." },
      { title: "Every day", text: "Light enough for daily wear." },
    ],
    rating: 4.5,
    reviewCount: 58,
    badges: ["new"],
    bottle: { shape: "dome", cap: "gold", liquid: "#F1B4C6" },
  },
  {
    slug: "dolce-gabbana-light-blue",
    name: "Light Blue",
    house: "Dolce & Gabbana",
    collection: "international",
    gender: "women",
    concentration: "Eau de Toilette",
    family: "citrus",
    tagline: "A Sicilian summer in a bottle.",
    description: [
      "Sicilian lemon and crisp apple meet a breezy accord of bellflower and bamboo.",
      "Jasmine and white rose soften the heart before cedar, musk and amber leave a clean, sun-warmed finish.",
    ],
    notes: {
      top: ["Sicilian Lemon", "Apple", "Bellflower"],
      heart: ["Bamboo", "Jasmine", "White Rose"],
      base: ["Cedar", "Musk", "Amber"],
    },
    sizes: [
      { ml: 50, price: 5900, compareAt: 6600 },
      { ml: 100, price: 7900, compareAt: 8800 },
    ],
    profile: { longevity: "4–6 hrs", longevityScore: 3, projection: 3, sweetness: 2, freshness: 5 },
    seasons: ["spring", "summer"],
    time: "day",
    occasions: [
      { title: "Holidays", text: "Pure Mediterranean sunshine." },
      { title: "Daytime", text: "Fresh, clean and effortless." },
      { title: "Hot weather", text: "Never cloying, even at noon." },
    ],
    rating: 4.6,
    reviewCount: 89,
    bottle: { shape: "slab", cap: "silver", liquid: "#BFDDEB" },
  },
  {
    slug: "jo-malone-lime-basil-mandarin",
    name: "Lime Basil & Mandarin",
    house: "Jo Malone London",
    collection: "international",
    gender: "unisex",
    concentration: "Eau de Parfum",
    family: "citrus",
    tagline: "Zesty lime, peppery basil.",
    description: [
      "Lime and mandarin, sharpened with bergamot, sit beside a peppery bunch of fresh basil.",
      "A modern classic with an aromatic heart and a soft vetiver-patchouli finish.",
    ],
    notes: {
      top: ["Lime", "Mandarin", "Bergamot"],
      heart: ["Basil", "Iris"],
      base: ["Vetiver", "Patchouli", "Amber"],
    },
    sizes: [
      { ml: 30, price: 6300 },
      { ml: 100, price: 13500 },
    ],
    profile: { longevity: "4–6 hrs", longevityScore: 2, projection: 2, sweetness: 1, freshness: 5 },
    seasons: ["spring", "summer"],
    time: "day",
    occasions: [
      { title: "Work", text: "Quiet, clean and sophisticated." },
      { title: "Layering", text: "Brightens any woody or floral scent." },
      { title: "Weekend", text: "Effortless, unisex freshness." },
    ],
    rating: 4.5,
    reviewCount: 41,
    bottle: { shape: "tower", cap: "black", liquid: "#E8E3C9" },
  },
  {
    slug: "ysl-libre",
    name: "Libre",
    house: "Yves Saint Laurent",
    collection: "international",
    gender: "women",
    concentration: "Eau de Parfum",
    family: "floral",
    tagline: "Lavender and orange blossom, set free.",
    description: [
      "French lavender meets Moroccan orange blossom, a bold contrast of cool and warm.",
      "Madagascar vanilla and musk give it a sensual, unmistakable trail.",
    ],
    notes: {
      top: ["Lavender", "Mandarin", "Black Currant", "Petitgrain"],
      heart: ["Lavender", "Orange Blossom", "Jasmine"],
      base: ["Madagascar Vanilla", "Musk", "Cedar", "Ambergris"],
    },
    sizes: [
      { ml: 50, price: 10500 },
      { ml: 90, price: 14200 },
    ],
    profile: { longevity: "7–9 hrs", longevityScore: 4, projection: 4, sweetness: 3, freshness: 3 },
    seasons: ["spring", "autumn", "winter"],
    time: "day & night",
    occasions: [
      { title: "Signature", text: "Confident, modern and polished." },
      { title: "Evenings", text: "The vanilla base turns sultry at night." },
      { title: "Gifting", text: "An icon that never misses." },
    ],
    rating: 4.7,
    reviewCount: 73,
    bottle: { shape: "facet", cap: "gold", liquid: "#F2D3A8" },
  },
  {
    slug: "ysl-black-opium",
    name: "Black Opium",
    house: "Yves Saint Laurent",
    collection: "international",
    gender: "women",
    concentration: "Eau de Parfum",
    family: "gourmand",
    tagline: "Coffee, vanilla and adrenaline.",
    description: [
      "Pink pepper and pear crackle over orange blossom at the opening.",
      "Black coffee and jasmine form an addictive heart over vanilla, patchouli and cedar. Rock 'n' roll glamour.",
    ],
    notes: {
      top: ["Pear", "Pink Pepper", "Orange Blossom"],
      heart: ["Coffee", "Jasmine", "Bitter Almond", "Licorice"],
      base: ["Vanilla", "Patchouli", "Cedar", "Cashmere Wood"],
    },
    sizes: [
      { ml: 50, price: 9800 },
      { ml: 90, price: 13200 },
    ],
    profile: { longevity: "8–10 hrs", longevityScore: 4, projection: 4, sweetness: 5, freshness: 1 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Night out", text: "Dark, sweet and addictive." },
      { title: "Date night", text: "Coffee and vanilla, up close." },
      { title: "Winter", text: "Cosy warmth on cold evenings." },
    ],
    rating: 4.7,
    reviewCount: 102,
    badges: ["bestseller"],
    bottle: { shape: "orb", cap: "black", liquid: "#25202A" },
  },
  {
    slug: "tom-ford-oud-wood",
    name: "Oud Wood",
    house: "Tom Ford",
    collection: "international",
    gender: "unisex",
    concentration: "Eau de Parfum",
    family: "woody",
    tagline: "Rare oud, made smooth.",
    description: [
      "Rosewood and cardamom open with a refined, spicy polish.",
      "Smoky oud is softened by sandalwood and vetiver, then wrapped in tonka, vanilla and amber. Effortlessly luxurious.",
    ],
    notes: {
      top: ["Rosewood", "Cardamom", "Chinese Pepper"],
      heart: ["Oud", "Sandalwood", "Vetiver"],
      base: ["Tonka Bean", "Vanilla", "Amber"],
    },
    sizes: [
      { ml: 50, price: 26500 },
      { ml: 100, price: 36500 },
    ],
    profile: { longevity: "6–8 hrs", longevityScore: 3, projection: 3, sweetness: 2, freshness: 1 },
    seasons: ["autumn", "winter", "spring"],
    time: "day & night",
    occasions: [
      { title: "Quiet luxury", text: "Refined, smooth and never loud." },
      { title: "Office to dinner", text: "Versatile enough for both." },
      { title: "Collectors", text: "A benchmark oud for any wardrobe." },
    ],
    rating: 4.8,
    reviewCount: 38,
    bottle: { shape: "slab", cap: "wood", liquid: "#5A3A26" },
  },
  {
    slug: "rabanne-1-million",
    name: "1 Million",
    house: "Rabanne",
    collection: "international",
    gender: "men",
    concentration: "Eau de Toilette",
    family: "amber",
    tagline: "Spiced, golden, unapologetic.",
    description: [
      "Blood mandarin, grapefruit and mint flash bright at the start.",
      "Cinnamon and rose warm the heart before a golden base of amber, leather and patchouli.",
    ],
    notes: {
      top: ["Blood Mandarin", "Grapefruit", "Mint"],
      heart: ["Cinnamon", "Spicy Notes", "Rose"],
      base: ["Amber", "Leather", "Woody Notes", "Patchouli"],
    },
    sizes: [
      { ml: 50, price: 6200 },
      { ml: 100, price: 8200, compareAt: 9100 },
    ],
    profile: { longevity: "6–8 hrs", longevityScore: 3, projection: 4, sweetness: 4, freshness: 2 },
    seasons: ["autumn", "winter"],
    time: "night",
    occasions: [
      { title: "Party", text: "Bold, sweet and spicy." },
      { title: "Festive season", text: "Golden warmth for Diwali and New Year." },
      { title: "Night out", text: "Built to be noticed." },
    ],
    rating: 4.5,
    reviewCount: 67,
    bottle: { shape: "facet", cap: "gold", liquid: "#D8A13A" },
  },
  {
    slug: "mfk-baccarat-rouge-540",
    name: "Baccarat Rouge 540",
    house: "Maison Francis Kurkdjian",
    collection: "international",
    gender: "unisex",
    concentration: "Eau de Parfum",
    family: "amber",
    tagline: "Luminous saffron and ambered air.",
    description: [
      "Saffron and jasmine glow over a mineral, airy amber, at once warm and transparent.",
      "Ambergris and cedar leave an almost sugared, crystalline trail that clings to fabric for days.",
    ],
    notes: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris"],
      base: ["Fir Resin", "Cedar"],
    },
    sizes: [
      { ml: 35, price: 21500 },
      { ml: 70, price: 32000 },
    ],
    profile: { longevity: "10–12 hrs", longevityScore: 5, projection: 5, sweetness: 3, freshness: 2 },
    seasons: ["autumn", "winter", "spring"],
    time: "day & night",
    occasions: [
      { title: "Statement", text: "Instantly recognisable, endlessly complimented." },
      { title: "Occasions", text: "Weddings, galas and evenings that matter." },
      { title: "Fabric", text: "Lingers on a scarf for days." },
    ],
    rating: 4.9,
    reviewCount: 52,
    badges: ["limited"],
    bottle: { shape: "flask", cap: "gold", liquid: "#C74A33" },
  },
  {
    slug: "dior-sauvage",
    name: "Sauvage",
    house: "Dior",
    collection: "international",
    gender: "men",
    concentration: "Eau de Toilette",
    family: "aquatic",
    tagline: "Raw freshness under wide-open skies.",
    description: [
      "Calabrian bergamot and pepper open with a radiant, juicy freshness.",
      "Lavender, Sichuan pepper and elemi give way to an ambroxan base that is clean, mineral and magnetic.",
    ],
    notes: {
      top: ["Calabrian Bergamot", "Pepper"],
      heart: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Geranium", "Elemi"],
      base: ["Ambroxan", "Cedar", "Labdanum"],
    },
    sizes: [
      { ml: 60, price: 8100 },
      { ml: 100, price: 10900 },
    ],
    profile: { longevity: "7–9 hrs", longevityScore: 4, projection: 5, sweetness: 1, freshness: 4 },
    seasons: ["spring", "summer", "autumn"],
    time: "day & night",
    occasions: [
      { title: "All-rounder", text: "Works from the gym to the boardroom." },
      { title: "Summer", text: "Fresh and loud in the heat." },
      { title: "Compliments", text: "The crowd-pleaser of the decade." },
    ],
    rating: 4.6,
    reviewCount: 143,
    badges: ["bestseller"],
    bottle: { shape: "slab", cap: "black", liquid: "#3A6E9C" },
  },
  {
    slug: "armani-acqua-di-gio",
    name: "Acqua di Giò",
    house: "Giorgio Armani",
    collection: "international",
    gender: "men",
    concentration: "Eau de Toilette",
    family: "aquatic",
    tagline: "Sea, sun and Mediterranean salt.",
    description: [
      "Lime, lemon and neroli sparkle like sunlight on water.",
      "A marine heart of sea notes, rosemary and jasmine settles into white musk, cedar and patchouli.",
    ],
    notes: {
      top: ["Lime", "Lemon", "Bergamot", "Neroli"],
      heart: ["Sea Notes", "Calone", "Rosemary", "Jasmine"],
      base: ["White Musk", "Cedar", "Oakmoss", "Patchouli"],
    },
    sizes: [
      { ml: 50, price: 6400 },
      { ml: 100, price: 8500, compareAt: 9400 },
    ],
    profile: { longevity: "5–7 hrs", longevityScore: 3, projection: 3, sweetness: 1, freshness: 5 },
    seasons: ["spring", "summer"],
    time: "day",
    occasions: [
      { title: "Beach days", text: "The original marine fragrance." },
      { title: "Office", text: "Clean and universally liked." },
      { title: "Travel", text: "Light, fresh and easy." },
    ],
    rating: 4.5,
    reviewCount: 81,
    bottle: { shape: "orb", cap: "silver", liquid: "#8FC6D8" },
  },
];
