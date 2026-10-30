import type { FamilySlug } from "./families";
import { RASASI_PRODUCTS } from "./rasasi";

/*
 * The catalogue: two products photographed by EYTE (Instagram) and Unsplash,
 * plus the Rasasi lines in ./rasasi.ts transcribed from the brand catalogues.
 * Every product has a real photo. Prices (and the ratings below) are
 * placeholders until EYTE confirms its own.
 */

export type Collection = "middle-eastern" | "international";
export type Gender = "men" | "women" | "unisex";
export type Season = "spring" | "summer" | "autumn" | "winter";

export type Size = { ml: number; price: number; compareAt?: number };

export type Product = {
  slug: string;
  name: string;
  house: string;
  collection: Collection;
  gender: Gender;
  concentration: "Eau de Parfum" | "Eau de Toilette" | "Extrait de Parfum" | "Elixir de Parfum" | "Parfum";
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
  /** Absent until a product has real reviews; the product page then shows none. */
  rating?: number;
  reviewCount?: number;
  badges?: ("bestseller" | "new" | "limited")[];
  /**
   * Real product photography. A `cutout` is the bottle alone on a transparent
   * background, shown whole; anything else is a full photograph, cropped to fill
   * (`focus` is its object-position).
   */
  image: { src: string; cutout?: boolean; focus?: string };
};

const SAMPLES: Product[] = [
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
    image: { src: "/images/instagram/khamrah-qahwa.webp", focus: "55% 62%" },
  },
  {
    slug: "dior-sauvage",
    name: "Sauvage",
    house: "Dior",
    collection: "international",
    gender: "men",
    concentration: "Eau de Parfum",
    family: "aquatic",
    tagline: "Raw freshness under wide-open skies.",
    description: [
      "Calabrian bergamot opens with a radiant, juicy freshness.",
      "Sichuan pepper, lavender, star anise and nutmeg give way to ambroxan softened by vanilla: fresh, warm and magnetic.",
    ],
    notes: {
      top: ["Calabrian Bergamot"],
      heart: ["Sichuan Pepper", "Lavender", "Star Anise", "Nutmeg"],
      base: ["Ambroxan", "Vanilla"],
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
    image: { src: "/images/stock/card-sauvage.webp" },
  },
];

export const PRODUCTS: Product[] = [...SAMPLES, ...RASASI_PRODUCTS];
