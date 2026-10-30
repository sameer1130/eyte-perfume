import type { ReactNode } from "react";
import type { FamilySlug } from "@/data/families";
import { add, dirVec, type Pt, type Rng } from "./geometry";
import {
  BerryCluster,
  Blossom,
  Bud,
  Cone,
  DiscLeaf,
  Frond,
  Jasmine,
  Leaf,
  Lemon,
  Orange,
  Orchid,
  PodBunch,
  Rose,
  type Berry,
  type Pod,
} from "./shapes";

export type Attachment = {
  /** Position along the stem, 0 (base) → 1 (tip). */
  u: number;
  /** `tangent` follows the stem; `gravity` hangs straight down and swings. */
  orient: "tangent" | "gravity";
  angle: number;
  scale: number;
  flutter: number;
  phase: number;
  /** Paint order within the stem (leaves behind flowers behind fruit). */
  z: number;
  node: ReactNode;
};

export type Stem = {
  base: Pt;
  c1: Pt;
  c2: Pt;
  c3: Pt;
  width: number;
  color: string;
  /** Peak bend angle in degrees. */
  amp: number;
  /** How far (seconds) the tip trails the base: gives the whip-like sway. */
  lag: number;
  phase: number;
  /** 0 = foreground, 1 = far background (drawn first, faded). */
  depth: number;
  /** Draw as a filled, tapering ribbon instead of a stroked line. */
  blade?: { fill: string; taper: "grass" | "ribbon" };
  attachments: Attachment[];
};

type Url = (name: string) => string;
type Id = (name: string) => string;

export type PlantDef = {
  size: [number, number];
  growth: "hang" | "rise";
  defs: (id: Id) => ReactNode;
  build: (rng: Rng, url: Url) => Stem[];
};

/* ------------------------------------------------------------------ */
/* Stem helpers                                                        */
/* ------------------------------------------------------------------ */

/** A stem that arches out from its anchor, then drops under its own weight. */
function hanging(base: Pt, len: number, out: number, drop: number) {
  const c1 = add(base, dirVec(out, len * 0.42));
  const c3 = add(add(base, dirVec(out, len * 0.38)), dirVec(drop, len * 0.62));
  const c2 = add(c3, dirVec(drop + 180, len * 0.34));
  return { base, c1, c2, c3 };
}

/**
 * Anchor points spilling from the top-left corner: some along the left edge,
 * most along the top edge. Stems further from the corner are shorter and
 * fall more steeply.
 */
function cornerAnchors(rng: Rng, n: number, W: number, H: number) {
  const out: { base: Pt; out: number; drop: number; k: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1) + rng.range(-0.04, 0.04);
    if (t < 0.28) {
      out.push({
        base: [-8, H * 0.4 * (1 - t / 0.28)],
        out: rng.range(-12, 22),
        drop: rng.range(84, 100),
        k: rng.range(0.85, 1),
      });
    } else {
      const s = (t - 0.28) / 0.72;
      out.push({
        base: [W * 0.66 * s, -8],
        out: rng.range(28, 52) + s * 30,
        drop: rng.range(84, 104),
        k: 1 - s * rng.range(0.35, 0.5),
      });
    }
  }
  return out;
}

function alternate(rng: Rng, start: number, step: [number, number], end = 0.97) {
  const us: { u: number; side: 1 | -1 }[] = [];
  let side: 1 | -1 = rng.chance(0.5) ? 1 : -1;
  for (let u = start; u < end; u += rng.range(step[0], step[1])) {
    side = side === 1 ? -1 : 1;
    us.push({ u, side });
  }
  return us;
}

/* ------------------------------------------------------------------ */
/* Citrus & Zest — lemon branch with neroli blossom                    */
/* ------------------------------------------------------------------ */

const citrus: PlantDef = {
  size: [600, 680],
  growth: "hang",
  defs: (id) => (
    <>
      <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2A5126" />
        <stop offset=".6" stopColor="#386730" />
        <stop offset="1" stopColor="#2D5828" />
      </linearGradient>
      <linearGradient id={id("leafLight")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4C7E3E" />
        <stop offset="1" stopColor="#6C9C52" />
      </linearGradient>
      <radialGradient id={id("lemon")} cx=".38" cy=".3" r=".8" fx=".3" fy=".22">
        <stop offset="0" stopColor="#FFF6BA" />
        <stop offset=".3" stopColor="#F8DA48" />
        <stop offset=".7" stopColor="#E5B21B" />
        <stop offset="1" stopColor="#B07F0B" />
      </radialGradient>
      <radialGradient id={id("orange")} cx=".38" cy=".3" r=".8" fx=".3" fy=".22">
        <stop offset="0" stopColor="#FFE3A8" />
        <stop offset=".3" stopColor="#FCAA4A" />
        <stop offset=".72" stopColor="#EA7C1C" />
        <stop offset="1" stopColor="#B0530A" />
      </radialGradient>
      <linearGradient id={id("petal")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#EADFBE" />
        <stop offset=".45" stopColor="#FFFDF6" />
        <stop offset="1" stopColor="#FFFFFF" />
      </linearGradient>
    </>
  ),
  build: (rng, url) => {
    const [W, H] = citrus.size;
    const stemColor = "#4A5A2C";
    return cornerAnchors(rng, 9, W, H).map((a, i) => {
      const depth = i % 3 === 1 ? 0.7 : 0;
      const len = a.k * rng.range(300, 480);
      const atts: Attachment[] = [];
      for (const { u, side } of alternate(rng, rng.range(0.05, 0.1), [0.055, 0.085])) {
        atts.push({
          u,
          orient: "tangent",
          angle: side * rng.range(26, 52),
          scale: 1,
          flutter: rng.range(4, 9),
          phase: rng.range(0, 6.3),
          z: 0,
          node: (
            <Leaf len={rng.range(48, 70) * (1 - u * 0.35)} width={0.37} fill={url("leaf")} light={url("leafLight")} vein="#A3C285" curl={rng.range(-0.3, 0.3)} />
          ),
        });
      }
      atts.push({
        u: 1,
        orient: "tangent",
        angle: rng.range(-12, 12),
        scale: 1,
        flutter: 8,
        phase: rng.range(0, 6.3),
        z: 0,
        node: <Leaf len={rng.range(40, 52)} width={0.36} fill={url("leaf")} light={url("leafLight")} vein="#A3C285" />,
      });
      if (depth === 0) {
        const fruits = rng.int(1, 2);
        for (let k = 0; k < fruits; k++) {
          const lemon = rng.chance(0.65);
          const r = rng.range(19, 28);
          const props = { r, fill: url(lemon ? "lemon" : "orange"), pedicel: rng.range(6, 14), stem: stemColor, calyx: "#5C7A34" };
          atts.push({
            u: rng.range(0.42, 0.92),
            orient: "gravity",
            angle: rng.range(-10, 10),
            scale: 1,
            flutter: rng.range(5, 9),
            phase: rng.range(0, 6.3),
            z: 2,
            node: lemon ? <Lemon {...props} /> : <Orange {...props} />,
          });
        }
        const blooms = rng.int(2, 4);
        for (let k = 0; k < blooms; k++) {
          const side = rng.chance(0.5) ? 1 : -1;
          const bud = rng.chance(0.3);
          atts.push({
            u: rng.range(0.12, 0.88),
            orient: "tangent",
            angle: side * rng.range(25, 75),
            scale: 1,
            flutter: rng.range(6, 11),
            phase: rng.range(0, 6.3),
            z: 1,
            node: bud ? (
              <Bud len={rng.range(10, 14)} fill="#FFFBEF" sepal="#6E8F3E" />
            ) : (
              <Blossom
                r={rng.range(9, 13)}
                stalk={rng.range(5, 11)}
                petal={url("petal")}
                stamen="#E3B21E"
                center="#9DB24C"
                stem={stemColor}
                twist={rng.range(0, 72)}
              />
            ),
          });
        }
      }
      return {
        ...hanging(a.base, len, a.out, a.drop),
        width: 2.2,
        color: stemColor,
        amp: rng.range(5, 8.5),
        lag: rng.range(0.25, 0.45),
        phase: rng.range(0, 6.3),
        depth,
        attachments: atts,
      };
    });
  },
};

/* ------------------------------------------------------------------ */
/* Florals — cascading roses and jasmine                               */
/* ------------------------------------------------------------------ */

const ROSE_TONES = {
  pink: { outer: "rose", mid: "#E7679A", inner: "#C83A73", core: "#8F1F4F", edge: "#FFD6E5" },
  blush: { outer: "blush", mid: "#F2A2BF", inner: "#E07AA0", core: "#B44C76", edge: "#FFF0F5" },
  deep: { outer: "deep", mid: "#C22A5E", inner: "#9A1844", core: "#5E0D2A", edge: "#F79BB9" },
} as const;

const floral: PlantDef = {
  size: [600, 680],
  growth: "hang",
  defs: (id) => (
    <>
      <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#35592D" />
        <stop offset="1" stopColor="#47703A" />
      </linearGradient>
      <linearGradient id={id("leafLight")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5A8648" />
        <stop offset="1" stopColor="#7AA35E" />
      </linearGradient>
      <radialGradient id={id("rose")} cx="0" cy=".5" r="1">
        <stop offset="0" stopColor="#B7245E" />
        <stop offset=".55" stopColor="#E2609A" />
        <stop offset="1" stopColor="#F8B6CE" />
      </radialGradient>
      <radialGradient id={id("blush")} cx="0" cy=".5" r="1">
        <stop offset="0" stopColor="#D9779E" />
        <stop offset=".55" stopColor="#F3A9C3" />
        <stop offset="1" stopColor="#FCDCE7" />
      </radialGradient>
      <radialGradient id={id("deep")} cx="0" cy=".5" r="1">
        <stop offset="0" stopColor="#7E0F33" />
        <stop offset=".55" stopColor="#B8204F" />
        <stop offset="1" stopColor="#E0587F" />
      </radialGradient>
      <linearGradient id={id("jasmine")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#F1CFDB" />
        <stop offset=".4" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FFFDFB" />
      </linearGradient>
    </>
  ),
  build: (rng, url) => {
    const [W, H] = floral.size;
    const stemColor = "#4C5F33";
    return cornerAnchors(rng, 10, W, H).map((a, i) => {
      const depth = i % 4 === 2 ? 0.7 : 0;
      const len = a.k * rng.range(280, 540);
      const toneKey = rng.pick(["pink", "pink", "blush", "deep"] as const);
      const tone = ROSE_TONES[toneKey];
      const atts: Attachment[] = [];
      for (const { u, side } of alternate(rng, rng.range(0.04, 0.08), [0.06, 0.09])) {
        atts.push({
          u,
          orient: "tangent",
          angle: side * rng.range(30, 60),
          scale: 1,
          flutter: rng.range(5, 10),
          phase: rng.range(0, 6.3),
          z: 0,
          node: <Leaf len={rng.range(24, 38)} width={0.46} fill={url("leaf")} light={url("leafLight")} vein="#9FC083" />,
        });
      }
      for (let u = rng.range(0.1, 0.2); u < 0.98; u += rng.range(0.09, 0.15)) {
        const cluster = rng.int(1, 3);
        for (let k = 0; k < cluster; k++) {
          const side = rng.chance(0.5) ? 1 : -1;
          const r = rng.range(12, 20) * (1 - u * 0.3);
          atts.push({
            u: Math.min(1, u + rng.range(-0.02, 0.02)),
            orient: "tangent",
            angle: side * rng.range(8, 70),
            scale: 1,
            flutter: rng.range(5, 10),
            phase: rng.range(0, 6.3),
            z: 1 + rng.next(),
            node: (
              <Rose
                r={r}
                stalk={rng.range(2, 9)}
                outer={url(tone.outer)}
                mid={tone.mid}
                inner={tone.inner}
                core={tone.core}
                edge={tone.edge}
                stem={stemColor}
                twist={rng.range(0, 72)}
              />
            ),
          });
        }
        if (rng.chance(0.55)) {
          atts.push({
            u: Math.min(1, u + rng.range(0.02, 0.05)),
            orient: "tangent",
            angle: (rng.chance(0.5) ? 1 : -1) * rng.range(20, 80),
            scale: 1,
            flutter: rng.range(8, 13),
            phase: rng.range(0, 6.3),
            z: 1.5,
            node: <Jasmine r={rng.range(7, 10)} stalk={rng.range(4, 10)} petal={url("jasmine")} center="#E9D37A" stem={stemColor} twist={rng.range(0, 72)} />,
          });
        }
      }
      atts.push({
        u: 1,
        orient: "tangent",
        angle: rng.range(-10, 10),
        scale: 1,
        flutter: 9,
        phase: rng.range(0, 6.3),
        z: 1,
        node: <Bud len={rng.range(13, 18)} fill={tone.mid} sepal="#5E7F3E" />,
      });
      return {
        ...hanging(a.base, len, a.out, a.drop),
        width: 1.7,
        color: stemColor,
        amp: rng.range(5, 9),
        lag: rng.range(0.3, 0.5),
        phase: rng.range(0, 6.3),
        depth,
        attachments: atts,
      };
    });
  },
};

/* ------------------------------------------------------------------ */
/* Vanilla & Gourmand — vanilla orchid vine with hanging pods          */
/* ------------------------------------------------------------------ */

const gourmand: PlantDef = {
  size: [600, 680],
  growth: "hang",
  defs: (id) => (
    <>
      <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4A6E33" />
        <stop offset="1" stopColor="#628A42" />
      </linearGradient>
      <linearGradient id={id("leafLight")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7A9E52" />
        <stop offset="1" stopColor="#97B668" />
      </linearGradient>
      <linearGradient id={id("tepal")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#D9CF86" />
        <stop offset=".55" stopColor="#F2ECBE" />
        <stop offset="1" stopColor="#EADFA2" />
      </linearGradient>
      <radialGradient id={id("lip")} cx=".5" cy=".3" r=".75">
        <stop offset="0" stopColor="#FBEA9A" />
        <stop offset=".6" stopColor="#F1D05A" />
        <stop offset="1" stopColor="#D8AA34" />
      </radialGradient>
      <linearGradient id={id("pod")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#22120A" />
        <stop offset=".45" stopColor="#4B2E1E" />
        <stop offset=".58" stopColor="#6A4630" />
        <stop offset="1" stopColor="#28150B" />
      </linearGradient>
      <linearGradient id={id("podGreen")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4E6826" />
        <stop offset=".5" stopColor="#8AA44A" />
        <stop offset="1" stopColor="#56702B" />
      </linearGradient>
    </>
  ),
  build: (rng, url) => {
    const [W, H] = gourmand.size;
    const stemColor = "#5E7034";
    return cornerAnchors(rng, 8, W, H).map((a, i) => {
      const depth = i % 3 === 2 ? 0.7 : 0;
      const len = a.k * rng.range(300, 520);
      const atts: Attachment[] = [];
      const nodes = alternate(rng, rng.range(0.06, 0.12), [0.1, 0.14]);
      for (const { u, side } of nodes) {
        atts.push({
          u,
          orient: "tangent",
          angle: side * rng.range(32, 58),
          scale: 1,
          flutter: rng.range(4, 8),
          phase: rng.range(0, 6.3),
          z: 0,
          node: <Leaf len={rng.range(56, 84) * (1 - u * 0.3)} width={0.4} fill={url("leaf")} light={url("leafLight")} vein="#B8CF8A" curl={rng.range(-0.25, 0.25)} />,
        });
      }
      const podNodes = depth === 0 ? rng.int(1, 2) : 1;
      for (let k = 0; k < podNodes; k++) {
        const count = rng.int(3, 4);
        const pods: Pod[] = Array.from({ length: count }, (_, j) => ({
          len: rng.range(84, 128),
          w: rng.range(4.6, 5.8),
          angle: (j - (count - 1) / 2) * rng.range(3.5, 5.5) + rng.range(-1.5, 1.5),
          curve: rng.range(-10, 10),
          fill: url(rng.chance(0.75) ? "pod" : "podGreen"),
        }));
        atts.push({
          u: rng.range(0.35, 0.9),
          orient: "gravity",
          angle: rng.range(-6, 6),
          scale: 1,
          flutter: rng.range(4, 7),
          phase: rng.range(0, 6.3),
          z: 2,
          node: <PodBunch pods={pods} stem={stemColor} sheen="#B48B66" />,
        });
      }
      if (depth === 0) {
        const flowers = rng.int(3, 5);
        for (let k = 0; k < flowers; k++) {
          atts.push({
            u: rng.range(0.12, 0.98),
            orient: "gravity",
            angle: rng.range(-40, 40),
            scale: rng.range(1.1, 1.45),
            flutter: rng.range(6, 10),
            phase: rng.range(0, 6.3),
            z: 1,
            node: <Orchid r={rng.range(17, 22)} tepal={url("tepal")} lip={url("lip")} throat="#B98A26" stem={stemColor} />,
          });
        }
      }
      return {
        ...hanging(a.base, len, a.out, a.drop),
        width: 2.8,
        color: stemColor,
        amp: rng.range(4.5, 7.5),
        lag: rng.range(0.3, 0.5),
        phase: rng.range(0, 6.3),
        depth,
        attachments: atts,
      };
    });
  },
};

/* ------------------------------------------------------------------ */
/* Woods & Oud — hanging cedar sprays (smoke comes from particles)     */
/* ------------------------------------------------------------------ */

const woody: PlantDef = {
  size: [600, 680],
  growth: "hang",
  defs: (id) => (
    <>
      <linearGradient id={id("frond")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#263F31" />
        <stop offset="1" stopColor="#3A5C49" />
      </linearGradient>
      <linearGradient id={id("frondLight")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3F6350" />
        <stop offset="1" stopColor="#5B8169" />
      </linearGradient>
      <radialGradient id={id("cone")} cx=".4" cy=".35" r=".8">
        <stop offset="0" stopColor="#A47C55" />
        <stop offset="1" stopColor="#5A3C24" />
      </radialGradient>
      <linearGradient id={id("bark")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6B5038" />
        <stop offset="1" stopColor="#43301F" />
      </linearGradient>
    </>
  ),
  build: (rng, url) => {
    const [W, H] = woody.size;
    return cornerAnchors(rng, 7, W, H).map((a, i) => {
      const depth = i % 3 === 1 ? 0.7 : 0;
      const len = a.k * rng.range(320, 540);
      const atts: Attachment[] = [];
      for (const { u, side } of alternate(rng, rng.range(0.05, 0.1), [0.075, 0.11])) {
        atts.push({
          u,
          orient: "tangent",
          angle: side * rng.range(34, 62),
          scale: 1,
          flutter: rng.range(6, 11),
          phase: rng.range(0, 6.3),
          z: 0,
          node: <Frond len={rng.range(100, 150) * (1 - u * 0.45)} fill={url("frond")} light={url("frondLight")} rachis="#5A4632" />,
        });
        if (depth === 0 && rng.chance(0.22)) {
          atts.push({
            u: u + 0.02,
            orient: "gravity",
            angle: rng.range(-10, 10),
            scale: 1,
            flutter: rng.range(6, 9),
            phase: rng.range(0, 6.3),
            z: 1,
            node: <Cone r={rng.range(6, 9)} fill={url("cone")} line="#3E2A19" />,
          });
        }
      }
      atts.push({
        u: 1,
        orient: "tangent",
        angle: rng.range(-8, 8),
        scale: 1,
        flutter: 9,
        phase: rng.range(0, 6.3),
        z: 0,
        node: <Frond len={rng.range(80, 110)} fill={url("frond")} light={url("frondLight")} rachis="#5A4632" />,
      });
      return {
        ...hanging(a.base, len, a.out, a.drop),
        width: 7,
        color: "#5B4632",
        blade: { fill: url("bark"), taper: "grass" as const },
        amp: rng.range(3.5, 6),
        lag: rng.range(0.35, 0.55),
        phase: rng.range(0, 6.3),
        depth,
        attachments: atts,
      };
    });
  },
};

/** A drooping, grape-like cluster, widest at the top. */
function berryCluster(rng: Rng, count: [number, number], length: number, size: [number, number]): Berry[] {
  return Array.from({ length: rng.int(count[0], count[1]) }, () => {
    const y = rng.range(5, length);
    const spread = length * 0.34 * (1 - (y / length) * 0.6);
    return { x: rng.range(-spread, spread), y, r: rng.range(size[0], size[1]) };
  }).sort((a, b) => a.y - b.y);
}

/* ------------------------------------------------------------------ */
/* Amber & Spice — weeping pink-pepper branches                       */
/* ------------------------------------------------------------------ */

const amber: PlantDef = {
  size: [600, 680],
  growth: "hang",
  defs: (id) => (
    <>
      <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4F5B2A" />
        <stop offset="1" stopColor="#6C7B39" />
      </linearGradient>
      <linearGradient id={id("leafLight")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#808F47" />
        <stop offset="1" stopColor="#A0AE61" />
      </linearGradient>
      <radialGradient id={id("berry")} cx=".4" cy=".35" r=".7" fx=".32" fy=".28">
        <stop offset="0" stopColor="#FFD6CF" />
        <stop offset=".35" stopColor="#EC7C82" />
        <stop offset=".75" stopColor="#C23C4F" />
        <stop offset="1" stopColor="#7C1A2C" />
      </radialGradient>
    </>
  ),
  build: (rng, url) => {
    const [W, H] = amber.size;
    const stemColor = "#6B4231";
    return cornerAnchors(rng, 9, W, H).map((a, i) => {
      const depth = i % 3 === 1 ? 0.7 : 0;
      const len = a.k * rng.range(300, 480);
      const atts: Attachment[] = [];
      for (const { u, side } of alternate(rng, rng.range(0.04, 0.08), [0.05, 0.08])) {
        atts.push({
          u,
          orient: "tangent",
          angle: side * rng.range(20, 38),
          scale: 1,
          flutter: rng.range(6, 11),
          phase: rng.range(0, 6.3),
          z: 0,
          node: <Frond len={rng.range(84, 124) * (1 - u * 0.4)} fill={url("leaf")} light={url("leafLight")} rachis="#7A5A3A" />,
        });
      }
      atts.push({
        u: 1,
        orient: "tangent",
        angle: rng.range(-8, 8),
        scale: 1,
        flutter: 9,
        phase: rng.range(0, 6.3),
        z: 0,
        node: <Frond len={rng.range(70, 96)} fill={url("leaf")} light={url("leafLight")} rachis="#7A5A3A" />,
      });
      if (depth === 0) {
        const clusters = rng.int(3, 5);
        for (let k = 0; k < clusters; k++) {
          atts.push({
            u: rng.range(0.3, 0.95),
            orient: "gravity",
            angle: rng.range(-8, 8),
            scale: 1,
            flutter: rng.range(5, 9),
            phase: rng.range(0, 6.3),
            z: 2,
            node: <BerryCluster berries={berryCluster(rng, [18, 28], rng.range(32, 48), [2.6, 3.8])} fill={url("berry")} stem="#8A5A3C" />,
          });
        }
      }
      return {
        ...hanging(a.base, len, a.out, a.drop + 4),
        width: 1.9,
        color: stemColor,
        amp: rng.range(6, 9),
        lag: rng.range(0.3, 0.5),
        phase: rng.range(0, 6.3),
        depth,
        attachments: atts,
      };
    });
  },
};

/* ------------------------------------------------------------------ */
/* Fresh & Aquatic — silver-dollar eucalyptus                         */
/* ------------------------------------------------------------------ */

const aquatic: PlantDef = {
  size: [600, 680],
  growth: "hang",
  defs: (id) => (
    <>
      <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4A7A72" />
        <stop offset="1" stopColor="#6A968C" />
      </linearGradient>
      <linearGradient id={id("leafAlt")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5A8A80" />
        <stop offset="1" stopColor="#7EA79C" />
      </linearGradient>
      <linearGradient id={id("leafLight")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#77A196" />
        <stop offset="1" stopColor="#9FC2B7" />
      </linearGradient>
      <radialGradient id={id("bud")} cx=".4" cy=".35" r=".7" fx=".32" fy=".28">
        <stop offset="0" stopColor="#F1F7F4" />
        <stop offset=".45" stopColor="#B4CBC6" />
        <stop offset="1" stopColor="#6E8B88" />
      </radialGradient>
    </>
  ),
  build: (rng, url) => {
    const [W, H] = aquatic.size;
    const stemColor = "#7C6A69";
    return cornerAnchors(rng, 10, W, H).map((a, i) => {
      const depth = i % 3 === 1 ? 0.7 : 0;
      const len = a.k * rng.range(320, 520);
      const atts: Attachment[] = [];
      // Leaves grow in opposite pairs, shrinking toward the tip.
      for (let u = rng.range(0.04, 0.07); u < 0.97; u += rng.range(0.06, 0.085)) {
        const r = rng.range(17, 25) * (1 - u * 0.45);
        for (const side of [1, -1]) {
          atts.push({
            u,
            orient: "tangent",
            angle: side * rng.range(56, 78),
            scale: 1,
            flutter: rng.range(6, 12),
            phase: rng.range(0, 6.3),
            z: 0,
            node: <DiscLeaf r={r} stalk={rng.range(2, 4)} fill={url(rng.chance(0.5) ? "leaf" : "leafAlt")} light={url("leafLight")} vein="#D9ECE6" />,
          });
        }
      }
      if (depth === 0 && rng.chance(0.7)) {
        atts.push({
          u: rng.range(0.4, 0.9),
          orient: "gravity",
          angle: rng.range(-8, 8),
          scale: 1,
          flutter: rng.range(5, 9),
          phase: rng.range(0, 6.3),
          z: 1,
          node: <BerryCluster berries={berryCluster(rng, [6, 9], rng.range(16, 24), [2, 2.8])} fill={url("bud")} stem={stemColor} />,
        });
      }
      return {
        ...hanging(a.base, len, a.out, a.drop),
        width: 2,
        color: stemColor,
        amp: rng.range(5, 8),
        lag: rng.range(0.3, 0.45),
        phase: rng.range(0, 6.3),
        depth,
        attachments: atts,
      };
    });
  },
};

export const PLANTS: Record<FamilySlug, PlantDef> = {
  citrus,
  floral,
  gourmand,
  woody,
  amber,
  aquatic,
};
