# EYTE — perfume store (frontend)

Next.js 16 storefront for **EYTE International**: authentic Middle Eastern & international perfumes.
Design language after [era-residence.com](https://www.era-residence.com/) (condensed Didone caps, script accents,
botanicals swaying in the breeze); product detail structure after fridaycharm.com (notes pyramid, scent profile,
best worn for, comparisons, FAQ).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Home page themes

Only the home page is themed; shop, family and product pages always use the Floral look.

| Theme | Folder | Preview |
| --- | --- | --- |
| **1 · Floral** — cream, era-residence inspired, botanicals in the breeze | `src/components/home/floral/` | `/themes/floral` |
| **2 · Arabian Nights** — aubergine, gold & coffee brown; real EYTE Instagram imagery; ELORA / ZENFOX inspired | `src/components/home/arabian/` | `/themes/arabian` |

- Switch the live home page in `src/config/theme.ts` (`HOME_THEME = "floral" | "arabian"`).
- Theme 1 is also frozen in git: tag `theme-1-floral`, branch `theme/floral`.
- Theme 2 re-skins the header, footer and shared sections by redefining the palette variables in a page-owned
  `<style>` (`home/arabian/ThemeStyle.tsx`) that switches off when Next.js hides the page after navigation.
- Imagery: hero slides and scent-type ovals use Unsplash photography (`public/images/stock/`, sources in
  `CREDITS.txt`, Unsplash licence allows commercial use). The editorial, collections and Instagram wall use real
  EYTE posts (`public/images/instagram/`, cropped from instagram.com/eyte.perfumes; wall data in
  `src/data/instagram.ts`). Swap in EYTE's own campaign photography when available.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero with interactive "scent trail" (cycles all six atmospheres), house intro, family grid, three-acts explainer, bestsellers, collections, promise strip, Instagram/newsletter |
| `/shop` | Full catalogue with family / collection / gender filters and sorting (URL-synced) |
| `/families` | All six scent families, each in its own live atmosphere |
| `/families/[slug]` | One family: hero scene, signature perfumes, perfumes where it leads one act |
| `/perfume/[slug]` | Product detail: purchase panel, story, **pyramid in three acts** (pinned scene changes per act), scent profile + accord breakdown, when to wear, comparisons, how to wear, reviews, FAQ, related |

Cart is a client-side store persisted to `localStorage` (drawer from any page). Checkout is a placeholder.

## Scent families → animations

Every note maps to one of six families (`src/data/notes.ts`). Each family has a scene:

| Family | Botanical (sways in the breeze) | Airborne particles |
| --- | --- | --- |
| Citrus & Zest | Lemon/orange branch with neroli blossom (hangs) | Tumbling citrus slices, zest sparkle |
| Florals | Cascading roses & jasmine (hangs) | Fluttering petals |
| Vanilla & Gourmand | Vanilla orchid vine with pod bunches (hangs) | Warm sugar-dust bokeh |
| Woods & Oud | Cedar sprays (hangs) | Rising bakhoor smoke wisps, oud chips |
| Amber & Spice | Saffron crocus meadow (rises) | Floating star anise, cinnamon, cardamom, saffron, embers |
| Fresh & Aquatic | Seagrass & mint (rises) | Bubbles, droplets |

On the product page each act of the pyramid (top / heart / base) shows the scene of the family that dominates
that act's notes (`tierFamily` in `src/lib/catalog.ts`).

### How the animation works (`src/components/botanica/`)

- `engine.ts` — one shared `requestAnimationFrame` loop and a coherent wind field. Scroll velocity (Lenis) and
  pointer movement add gusts, so every scene on the page reacts to the same breeze. Honours `prefers-reduced-motion`.
- `plants.tsx` + `shapes.tsx` — each family's plant is generated from a seeded RNG (identical on server and client)
  as stems (cubic béziers) carrying leaves, flowers and fruit. `Botanical.tsx` bends the stems every frame (the tip
  lags the base, giving a whip-like sway) and re-places the attachments along the curve.
- `particle-kinds.ts` + `Particles.tsx` — canvas particles per family, pushed by the same wind.
- `Scene.tsx` — composes plants in the corners + particles + a soft colour glow. Scenes pause when off-screen.

## Data

- `src/data/families.ts` — the six families (copy, colours, growth direction)
- `src/data/notes.ts` — note → family map (add new notes here; unmapped notes warn in dev)
- `src/data/products.ts` — **sample catalogue** (18 perfumes). Replace with real inventory.

Products currently render an illustrated SVG bottle (`src/components/product/Bottle.tsx`) tinted per product.

## Open items before launch

- Real product list, prices, sizes, stock, photography (bottles are illustrations for now)
- Official EYTE logo files (the monogram here is redrawn after the Instagram avatar)
- Brand fonts if licensed (currently Google: Instrument Serif, Pinyon Script, Archivo)
- Reviews, ratings and "often compared to" are placeholders
- Policies: free-shipping threshold (₹2,000 placeholder), returns, delivery copy
- Backend: checkout/payments, accounts, newsletter, search
