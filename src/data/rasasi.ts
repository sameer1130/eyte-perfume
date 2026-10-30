import type { FamilySlug } from "./families";
import type { Product } from "./products";

/*
 * Rasasi's I'm Rasasi and Nylaa lines, transcribed from the brand catalogues
 * (names, concentration, size, description, notes and bottle photos).
 *
 * The catalogues don't give prices, ratings or wear guidance:
 * - PRICES below are placeholders until EYTE confirms its own.
 * - There are no ratings or reviews, so the product pages show none.
 * - Seasons, occasions and the scent profile follow from the family and
 *   concentration (see WEAR and STRENGTH).
 */

type Concentration = Product["concentration"];
type Line = "I'm Rasasi" | "Nylaa by Rasasi";

/** Placeholder prices (₹) by line, concentration and size. */
function price(line: Line, concentration: Concentration, ml: number): number {
  if (line === "I'm Rasasi") return ml === 80 ? 4950 : 5950;
  return concentration === "Eau de Parfum" ? 3450 : 3950;
}

const STRENGTH: Partial<Record<Concentration, Pick<Product["profile"], "longevity" | "longevityScore" | "projection">>> = {
  "Extrait de Parfum": { longevity: "8–12 hrs", longevityScore: 5, projection: 4 },
  "Elixir de Parfum": { longevity: "8–12 hrs", longevityScore: 5, projection: 4 },
  "Eau de Parfum": { longevity: "6–8 hrs", longevityScore: 4, projection: 3 },
};

const WEAR: Record<
  FamilySlug,
  Pick<Product, "seasons" | "time" | "occasions"> & Pick<Product["profile"], "sweetness" | "freshness">
> = {
  gourmand: {
    seasons: ["autumn", "winter"],
    time: "night",
    sweetness: 5,
    freshness: 1,
    occasions: [
      { title: "Evening plans", text: "Dinners and late nights, where a sweet trail is welcome." },
      { title: "Cool weather", text: "Sweet notes bloom beautifully in cool air." },
      { title: "Close moments", text: "Soft and warm, made to be noticed up close." },
    ],
  },
  amber: {
    seasons: ["autumn", "winter"],
    time: "night",
    sweetness: 3,
    freshness: 2,
    occasions: [
      { title: "Celebrations", text: "Weddings, Eid and festive evenings call for glowing spice." },
      { title: "Winter nights", text: "Resins and spices open up in cold air." },
      { title: "Statement evenings", text: "Bold enough to be remembered after you leave." },
    ],
  },
  woody: {
    seasons: ["autumn", "winter", "spring"],
    time: "day & night",
    sweetness: 2,
    freshness: 2,
    occasions: [
      { title: "The office", text: "Polished and grounded, never too loud by day." },
      { title: "Evening events", text: "Woods deepen beautifully after dark." },
      { title: "Autumn", text: "Dry, warm woods suit crisp days." },
    ],
  },
  floral: {
    seasons: ["spring", "summer"],
    time: "day & night",
    sweetness: 3,
    freshness: 3,
    occasions: [
      { title: "Brunch & day dates", text: "Pretty, easy and bright." },
      { title: "Weddings", text: "Romantic florals for celebrations." },
      { title: "Spring", text: "Blooms that come alive in the sun." },
    ],
  },
  citrus: {
    seasons: ["spring", "summer"],
    time: "day",
    sweetness: 2,
    freshness: 5,
    occasions: [
      { title: "Daytime", text: "Bright and clean from morning to evening." },
      { title: "Summer", text: "Citrus sparkles in the heat." },
      { title: "The office", text: "Fresh and easy in close quarters." },
    ],
  },
  aquatic: {
    seasons: ["spring", "summer"],
    time: "day",
    sweetness: 1,
    freshness: 5,
    occasions: [
      { title: "Daytime", text: "Effortlessly fresh from morning onwards." },
      { title: "Summer & travel", text: "Cool, clean and easy in the heat." },
      { title: "Weekends", text: "A crisp lift for days on the go." },
    ],
  },
};

type Entry = {
  name: string;
  concentration: Concentration;
  ml: number;
  family: FamilySlug;
  gender?: Product["gender"];
  tagline: string;
  description: [string, string];
  notes: Product["notes"];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function fromCatalogue(line: Line, e: Entry): Product {
  const wear = WEAR[e.family];
  const slug = `${line === "I'm Rasasi" ? "im-rasasi" : "nylaa"}-${slugify(e.name)}`;
  return {
    slug,
    name: e.name,
    house: line,
    collection: "middle-eastern",
    gender: e.gender ?? "unisex",
    concentration: e.concentration,
    family: e.family,
    tagline: e.tagline,
    description: e.description,
    notes: e.notes,
    sizes: [{ ml: e.ml, price: price(line, e.concentration, e.ml) }],
    profile: { ...STRENGTH[e.concentration]!, sweetness: wear.sweetness, freshness: wear.freshness },
    seasons: wear.seasons,
    time: wear.time,
    occasions: wear.occasions,
    // Bottle photos from the catalogues, cut out of their white backgrounds.
    image: { src: `/images/products/${slug}.webp`, cutout: true },
  };
}

/* ------------------------------------------------------------------ */
/* I'm Rasasi                                                          */
/* ------------------------------------------------------------------ */

const IM_RASASI: Entry[] = [
  {
    name: "Burned Sugar",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    tagline: "Caramelised sweetness with a champagne sparkle.",
    description: [
      "Wheat and candied fruits open into a heart of everlasting flower and cedarwood.",
      "The dry-down brings together tolu balsam, styrax and praline.",
    ],
    notes: {
      top: ["Wheat", "Candied Fruits", "Champagne"],
      heart: ["Everlasting Flower", "Cedarwood", "Dry Apricot"],
      base: ["Tolu Balsam", "Styrax", "Praline"],
    },
  },
  {
    name: "Euphoria Blend",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    tagline: "Almond and peony on a soft vanilla glow.",
    description: [
      "Bergamot and bitter almond open into a heart of peony and ylang-ylang.",
      "The dry-down brings together vanilla and almond.",
    ],
    notes: {
      top: ["Bergamot", "Bitter Almond"],
      heart: ["Peony", "Ylang-Ylang"],
      base: ["Vanilla", "Almond"],
    },
  },
  {
    name: "Amber Rush",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    tagline: "Cognac, cinnamon and warm praline.",
    description: [
      "Cognac and tonka bean open into a heart of cinnamon and hedione.",
      "The dry-down brings together praline, sandalwood and vanilla.",
    ],
    notes: {
      top: ["Cognac", "Tonka Bean", "Vanilla"],
      heart: ["Cinnamon", "Hedione", "Oak"],
      base: ["Praline", "Sandalwood", "Vanilla"],
    },
  },
  {
    name: "Aged Infusion",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "aquatic",
    tagline: "Herbal freshness over mineral amber.",
    description: [
      "Rosemary and juniper berry open into a heart of transparent flowers and soft schinus.",
      "The dry-down brings together mineral amber, tonka bean and musk.",
    ],
    notes: {
      top: ["Rosemary", "Juniper Berry", "Lime"],
      heart: ["Transparent Flowers", "Schinus", "Mint Leaf"],
      base: ["Mineral Amber", "Tonka Bean", "Musk"],
    },
  },
  {
    name: "N8E",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    tagline: "Vanilla orchid and brown sugar, after dark.",
    description: [
      "Vanilla orchid and jasmine open into a heart of brown sugar and orange blossom.",
      "The dry-down brings together amber, amberwood and musk.",
    ],
    notes: {
      top: ["Vanilla Orchid", "Jasmine", "Saffron"],
      heart: ["Brown Sugar", "Orange Blossom", "Tonka Bean"],
      base: ["Amber", "Amberwood", "Musk", "Patchouli"],
    },
  },
  {
    name: "D2D",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "woody",
    tagline: "Bright citrus over dry, smoky woods.",
    description: [
      "Amyris and citrus open into a heart of cedarwood and lavender.",
      "The dry-down brings together cypriol oil and vanilla.",
    ],
    notes: {
      top: ["Amyris", "Citrus", "Grapefruit"],
      heart: ["Cedarwood", "Lavender"],
      base: ["Cypriol Oil", "Vanilla"],
    },
  },
  {
    name: "B4V",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "floral",
    tagline: "Juicy pear and rose on a pink praline base.",
    description: [
      "Bergamot and pear open into a heart of peony and rose.",
      "The dry-down brings together amber, sandalwood and pink praline.",
    ],
    notes: {
      top: ["Bergamot", "Pear", "Mango"],
      heart: ["Peony", "Rose", "Orange Blossom"],
      base: ["Amber", "Sandalwood", "Pink Praline"],
    },
  },
  {
    name: "E6S",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "aquatic",
    tagline: "Rum and lavender, warmed with vanilla.",
    description: [
      "Rhum and cardamom open into a heart of lavender and clary sage.",
      "The dry-down brings together vanilla, cedarwood and oakmoss.",
    ],
    notes: {
      top: ["Rhum", "Cardamom", "Lemon"],
      heart: ["Lavender", "Clary Sage", "Orange Blossom"],
      base: ["Vanilla", "Cedarwood", "Oakmoss"],
    },
  },
  {
    name: "His Noir",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    gender: "men",
    tagline: "Tropical fruit and coconut on vanilla sugar.",
    description: [
      "Passion fruit and pineapple open into a heart of coconut and plum.",
      "The dry-down brings together sandalwood, vanillin sugar and white musks.",
    ],
    notes: {
      top: ["Passion Fruit", "Pineapple", "Elemi"],
      heart: ["Coconut", "Plum", "Nuts"],
      base: ["Sandalwood", "Vanillin Sugar", "White Musk"],
    },
  },
  {
    name: "Cobra Silk",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "woody",
    tagline: "Saffron and frankincense over smoky oud.",
    description: [
      "Saffron and frankincense open into a heart of amberwood and patchouli.",
      "The dry-down brings together oakmoss, praline and oud wood.",
    ],
    notes: {
      top: ["Saffron", "Frankincense", "Sacred Spices"],
      heart: ["Amberwood", "Patchouli", "Cypress"],
      base: ["Oakmoss", "Praline", "Oud"],
    },
  },
  {
    name: "Rare Breed",
    concentration: "Extrait de Parfum",
    ml: 80,
    family: "floral",
    tagline: "Osmanthus and tuberose with a vanilla trail.",
    description: [
      "Bergamot and pear open into a heart of osmanthus flower and tuberose.",
      "The dry-down brings together vanilla, patchouli and ambergris.",
    ],
    notes: {
      top: ["Bergamot", "Pear", "Blackberry"],
      heart: ["Osmanthus", "Tuberose", "Jasmine"],
      base: ["Vanilla", "Patchouli", "Ambergris", "Vetiver", "Sandalwood"],
    },
  },
  {
    name: "The Drama",
    concentration: "Extrait de Parfum",
    ml: 80,
    family: "gourmand",
    tagline: "Creamy banana, white flowers and vanilla.",
    description: [
      "Bergamot and banana open into a heart of white flowers and cashmere wood.",
      "The dry-down brings together ambroxan, musk and vanilla.",
    ],
    notes: {
      top: ["Bergamot", "Banana", "Coconut"],
      heart: ["White Flowers", "Cashmere Wood", "Violet"],
      base: ["Ambroxan", "Musk", "Vanilla"],
    },
  },
  {
    name: "Born Unique",
    concentration: "Extrait de Parfum",
    ml: 80,
    family: "aquatic",
    tagline: "Sea salt and incense on warm amber.",
    description: [
      "Bergamot and seaweed open into a heart of incense and coconut.",
      "The dry-down brings together tonka bean, cedarwood and amber.",
    ],
    notes: {
      top: ["Bergamot", "Seaweed", "Salt"],
      heart: ["Incense", "Coconut"],
      base: ["Tonka Bean", "Cedarwood", "Amber"],
    },
  },
  {
    name: "Ophira",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    tagline: "Cherry and jasmine over coffee-dark vanilla.",
    description: [
      "Cherry and green mandarin open into a heart of jasmine and orange blossom.",
      "The dry-down brings together Madagascar vanilla, coffee and Indonesian patchouli leaf.",
    ],
    notes: {
      top: ["Cherry", "Green Mandarin"],
      heart: ["Jasmine", "Orange Blossom", "Black Tea"],
      base: ["Madagascar Vanilla", "Coffee", "Indonesian Patchouli Leaf"],
    },
  },
  {
    name: "Luxora",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "amber",
    tagline: "Spiced pear and rose on a soft amber base.",
    description: [
      "Pear and fresh ginger open into a heart of rose and jasmine.",
      "The dry-down brings together musk, benzoin and ambroxan.",
    ],
    notes: {
      top: ["Pear", "Fresh Ginger", "Black Pepper"],
      heart: ["Rose", "Jasmine", "Vanilla"],
      base: ["Musk", "Benzoin", "Ambroxan", "Sandalwood"],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Nylaa by Rasasi (taglines are the catalogue's own)                  */
/* ------------------------------------------------------------------ */

const NYLAA: Entry[] = [
  {
    name: "Candied Lemon",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "citrus",
    tagline: "From citrus freshness to a creamy, warm dry-down.",
    description: [
      "Lemon and lavender open into a soft jasmine heart.",
      "Sandalwood and vanilla bring a creamy finish, balancing the citrus freshness with warmth.",
    ],
    notes: { top: ["Lemon", "Lavender"], heart: ["Jasmine"], base: ["Sandalwood", "Vanilla"] },
  },
  {
    name: "Milk & Cookies",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "gourmand",
    tagline: "From rich caramel to a soft vanilla finish.",
    description: [
      "A soft gourmand fragrance with a rich caramel opening.",
      "Warm tonka bean leads into vanilla and musk, creating a smooth, comforting finish.",
    ],
    notes: { top: ["Caramel"], heart: ["Tonka Bean"], base: ["Vanilla", "Musk"] },
  },
  {
    name: "Drunk on Roses",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "floral",
    tagline: "From green freshness to rose and dry woods.",
    description: [
      "Bergamot and green leaf introduce a floral heart of rose and peony.",
      "Dry woods and vetiver add a grounded finish to the fresh floral composition.",
    ],
    notes: { top: ["Bergamot", "Green Leaf"], heart: ["Rose", "Peony"], base: ["Dry Woods", "Vetiver"] },
  },
  {
    name: "54 Le Journal",
    concentration: "Elixir de Parfum",
    ml: 100,
    family: "amber",
    tagline: "From aromatic freshness to honeyed warmth.",
    description: [
      "Lavender, mint and bergamot create a fresh aromatic opening.",
      "Cardamom and cinnamon meet tonka bean, settling into a soft base of honey, vanilla and musk.",
    ],
    notes: {
      top: ["Lavender", "Mint", "Bergamot"],
      heart: ["Cardamom", "Cinnamon", "Tonka Bean"],
      base: ["Musk", "Honey", "Vanilla"],
    },
  },
  {
    name: "72 Le Voyage",
    concentration: "Elixir de Parfum",
    ml: 100,
    family: "amber",
    tagline: "From bright fruit and spice to an earthy finish.",
    description: [
      "Grapefruit and pineapple meet cardamom and pink pepper in a vibrant opening.",
      "A lavender and spice heart develops into vetiver, licorice and patchouli, rounded by ambergris.",
    ],
    notes: {
      top: ["Grapefruit", "Cardamom", "Pink Pepper", "Pineapple"],
      heart: ["Lavender", "Cinnamon", "Nutmeg"],
      base: ["Ambergris", "Vetiver", "Licorice", "Patchouli"],
    },
  },
  {
    name: "Noir Heritage",
    concentration: "Eau de Parfum",
    ml: 100,
    family: "woody",
    tagline: "From bright fruit to warm woods and amber.",
    description: [
      "Bergamot, pineapple and pink pepper bring freshness to a rich woody composition.",
      "Rose meets sandalwood and patchouli, with amber, tonka bean and musk adding warmth.",
    ],
    notes: {
      top: ["Bergamot", "Pineapple", "Pink Pepper"],
      heart: ["Rose", "Sandalwood", "Patchouli"],
      base: ["Amber", "Tonka Bean", "Musk"],
    },
  },
  {
    name: "Untamed Grace",
    concentration: "Eau de Parfum",
    ml: 100,
    family: "floral",
    tagline: "From bright spice to florals and warm woods.",
    description: [
      "Bergamot and pink pepper introduce a floral heart of rose, jasmine and orris.",
      "Cedarwood and patchouli bring depth, softened by a warm amber base.",
    ],
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      heart: ["Rose", "Jasmine", "Orris"],
      base: ["Cedarwood", "Patchouli", "Amber"],
    },
  },
  {
    name: "Zahab Al Sahara",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "amber",
    tagline: "From aromatic freshness to warm woody depth.",
    description: [
      "Fresh aromatic accords unfold into a warm heart of spices and florals.",
      "Woody notes, amber and musk form a rich base inspired by the warmth of the desert.",
    ],
    notes: { top: ["Aromatic Notes"], heart: ["Spices", "Floral Notes"], base: ["Woody Notes", "Amber", "Musk"] },
  },
  {
    name: "Malik Al Arabia",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "aquatic",
    tagline: "From citrus and green notes to soft woods.",
    description: [
      "Lemon and lavender open into the green character of galbanum and blackcurrant.",
      "Sandalwood, patchouli and musk create a soft woody finish.",
    ],
    notes: { top: ["Lemon", "Lavender"], heart: ["Galbanum", "Blackcurrant"], base: ["Sandalwood", "Patchouli", "Musk"] },
  },
  {
    name: "Elixir Extreme",
    concentration: "Eau de Parfum",
    ml: 100,
    family: "woody",
    tagline: "From citrus and saffron to a leather finish.",
    description: [
      "Grapefruit and saffron give a bright, spiced opening.",
      "Rose and vetiver develop into a distinctive leather base with a deeper, warmer character.",
    ],
    notes: { top: ["Grapefruit", "Saffron"], heart: ["Rose", "Vetiver"], base: ["Leather"] },
  },
  {
    name: "Elixir Beloved",
    concentration: "Eau de Parfum",
    ml: 100,
    family: "amber",
    tagline: "From aromatic freshness to florals and incense.",
    description: [
      "Rhubarb and coconut meet lavender and cardamom in an aromatic opening.",
      "White florals, patchouli and dry woods lead into a soft trail of incense and musk.",
    ],
    notes: {
      top: ["Rhubarb", "Coconut", "Lavender", "Cardamom"],
      heart: ["Jasmine", "Orange Blossom", "Patchouli", "Dry Woods"],
      base: ["Incense", "Musk"],
    },
  },
  {
    name: "Layers of Gold",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "amber",
    tagline: "From citrus and spice to vanilla and amber.",
    description: [
      "Bergamot and cardamom open into a heart of neroli and cedarwood.",
      "Vanilla and amber bring a rounded warmth to this citrus, spice and wood composition.",
    ],
    notes: { top: ["Bergamot", "Cardamom"], heart: ["Neroli", "Cedarwood"], base: ["Vanilla", "Amber"] },
  },
  {
    name: "No Excuses Elixir",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "aquatic",
    tagline: "From crisp citrus to aromatic spice and woods.",
    description: [
      "Lemon and mint bring a crisp opening to an aromatic, spiced heart.",
      "Lavandin, clary sage, cinnamon and rose settle into cedarwood, patchouli, vanilla and musk.",
    ],
    notes: {
      top: ["Lemon", "Mint"],
      heart: ["Lavandin", "Clary Sage", "Cinnamon", "Rose"],
      base: ["Cedarwood", "Patchouli", "Vanilla", "Musk"],
    },
  },
  {
    name: "Marina Celestia",
    concentration: "Extrait de Parfum",
    ml: 100,
    family: "citrus",
    tagline: "From bright citrus to crisp apple and soft woods.",
    description: [
      "Mandarin and lemon introduce a fresh, fruit-led composition.",
      "Apple adds a crisp heart, settling into a smooth base of sandalwood and musk.",
    ],
    notes: { top: ["Mandarin", "Lemon"], heart: ["Apple"], base: ["Sandalwood", "Musk"] },
  },
];

export const RASASI_PRODUCTS: Product[] = [
  ...IM_RASASI.map((e) => fromCatalogue("I'm Rasasi", e)),
  ...NYLAA.map((e) => fromCatalogue("Nylaa by Rasasi", e)),
];
