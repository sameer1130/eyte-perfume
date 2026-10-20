import type { FamilySlug } from "./families";

/**
 * Maps every fragrance note to the scent family whose animation represents it.
 * `null` marks "skin" notes (musks) that sit under everything and should not
 * decide which family an act of the pyramid belongs to.
 */
const NOTE_FAMILY: Record<string, FamilySlug | null> = {
  // Citrus & bright fruit
  bergamot: "citrus",
  "calabrian bergamot": "citrus",
  lemon: "citrus",
  "sicilian lemon": "citrus",
  lime: "citrus",
  mandarin: "citrus",
  "blood mandarin": "citrus",
  orange: "citrus",
  tangerine: "citrus",
  grapefruit: "citrus",
  neroli: "citrus",
  petitgrain: "citrus",
  yuzu: "citrus",
  pineapple: "citrus",
  pear: "citrus",
  "black currant": "citrus",

  // Florals
  rose: "floral",
  "turkish rose": "floral",
  "white rose": "floral",
  jasmine: "floral",
  "sambac jasmine": "floral",
  tuberose: "floral",
  peony: "floral",
  "orange blossom": "floral",
  "lily of the valley": "floral",
  iris: "floral",
  violet: "floral",
  orchid: "floral",
  heliotrope: "floral",
  freesia: "floral",
  geranium: "floral",
  "white flowers": "floral",
  bellflower: "floral",
  lychee: "floral",
  raspberry: "floral",
  peach: "floral",

  // Vanilla & gourmand
  vanilla: "gourmand",
  "madagascar vanilla": "gourmand",
  "tonka bean": "gourmand",
  praline: "gourmand",
  caramel: "gourmand",
  coffee: "gourmand",
  dates: "gourmand",
  "bitter almond": "gourmand",
  licorice: "gourmand",
  "gourmand accord": "gourmand",
  "tropical fruits": "gourmand",
  plum: "gourmand",
  honey: "gourmand",

  // Woods & oud
  oud: "woody",
  sandalwood: "woody",
  cedar: "woody",
  cedarwood: "woody",
  vetiver: "woody",
  patchouli: "woody",
  birch: "woody",
  driftwood: "woody",
  oakmoss: "woody",
  amberwood: "woody",
  "cashmere wood": "woody",
  "dry woods": "woody",
  "woody notes": "woody",
  rosewood: "woody",
  "fir resin": "woody",
  leather: "woody",

  // Amber & spice
  saffron: "amber",
  cardamom: "amber",
  cinnamon: "amber",
  nutmeg: "amber",
  "pink pepper": "amber",
  "black pepper": "amber",
  "sichuan pepper": "amber",
  "chinese pepper": "amber",
  pepper: "amber",
  ginger: "amber",
  amber: "amber",
  ambergris: "amber",
  incense: "amber",
  myrrh: "amber",
  labdanum: "amber",
  benzoin: "amber",
  tobacco: "amber",
  elemi: "amber",
  "spicy notes": "amber",

  // Fresh & aquatic
  "sea notes": "aquatic",
  "aquatic notes": "aquatic",
  calone: "aquatic",
  mint: "aquatic",
  lavender: "aquatic",
  rosemary: "aquatic",
  sage: "aquatic",
  basil: "aquatic",
  "green notes": "aquatic",
  "green tea": "aquatic",
  apple: "aquatic",
  bamboo: "aquatic",
  ambroxan: "aquatic",
  melon: "aquatic",

  // Skin notes
  musk: null,
  "white musk": null,
};

export function familyOfNote(note: string): FamilySlug | null {
  const key = note.toLowerCase();
  if (key in NOTE_FAMILY) return NOTE_FAMILY[key];
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[eyte] note "${note}" has no family mapping`);
  }
  return null;
}
