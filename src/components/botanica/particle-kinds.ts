import type { FamilySlug } from "@/data/families";

/*
 * Airborne particles for each scent family, drawn on a 2D canvas.
 * Each draw function paints one particle centred at the origin; the
 * Particles component handles position, rotation and opacity.
 */

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  s: number;
  flip: number;
  vflip: number;
  phase: number;
  life: number;
  max: number;
  seed: number;
  kind: number;
  pts?: number[];
};

type Draw = (ctx: CanvasRenderingContext2D, p: Particle, t: number) => void;

export type ParticleKind = {
  weight: number;
  size: [number, number];
  /** Where new particles enter: falling from the top, rising from the bottom, or drifting anywhere. */
  spawn: "top" | "bottom" | "any";
  /** px/s²; positive falls, negative rises, 0 floats. */
  gravity: number;
  terminal: number;
  windForce: number;
  drift?: number;
  spin: [number, number];
  /** rad/s of 3D tumble (simulated with a horizontal squash). */
  flip?: [number, number];
  wobble?: number;
  life?: [number, number];
  alpha?: number;
  draw: Draw;
  init?: (p: Particle, rand: () => number) => void;
};

/** Rising incense trails: points emitted from sources at the bottom edge. */
export type WispConfig = {
  /** Horizontal positions (0–1) of the smoke sources. */
  sources: number[];
  /** Points emitted per second, per source. */
  emit: number;
  life: number;
  /** Rise speed as a fraction of the canvas height per second. */
  rise: number;
  width: number;
  /** "r, g, b" */
  color: string;
  alpha: number;
};

export type ParticleSystem = { count: number; kinds: ParticleKind[]; wisps?: WispConfig };

const TAU = Math.PI * 2;

function tumble(ctx: CanvasRenderingContext2D, p: Particle, min = 0.15) {
  const c = Math.cos(p.flip);
  ctx.scale(Math.abs(c) * (1 - min) + min, 1);
  return c;
}

function circle(ctx: CanvasRenderingContext2D, r: number, x = 0, y = 0) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

function leafShape(ctx: CanvasRenderingContext2D, s: number, w = 0.42) {
  ctx.beginPath();
  ctx.moveTo(-s, 0);
  ctx.bezierCurveTo(-s * 0.5, -s * w * 1.6, s * 0.5, -s * w * 1.4, s, 0);
  ctx.bezierCurveTo(s * 0.5, s * w * 1.4, -s * 0.5, s * w * 1.6, -s, 0);
}

/* ---------------------------------------------------------------- */

const petal =
  (front: string[], back: string[]): Draw =>
  (ctx, p) => {
    const c = tumble(ctx, p);
    const i = p.seed % front.length;
    ctx.fillStyle = c > 0 ? front[i] : back[i];
    const s = p.s;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.75, s * 0.7, s * 0.8, 0, s);
    ctx.bezierCurveTo(-s * 0.7, s * 0.8, -s * 0.95, -s * 0.75, 0, -s);
    ctx.fill();
  };

const citrusSlice: Draw = (ctx, p) => {
  tumble(ctx, p, 0.2);
  const orange = p.seed % 3 === 0;
  const r = p.s;
  ctx.fillStyle = orange ? "#E9831F" : "#E9B722";
  circle(ctx, r);
  ctx.fillStyle = "#FFF5D6";
  circle(ctx, r * 0.86);
  ctx.fillStyle = orange ? "#F6A445" : "#F6D64E";
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a + 0.18) * r * 0.12, Math.sin(a + 0.18) * r * 0.12);
    ctx.arc(0, 0, r * 0.78, a + 0.06, a + TAU / n - 0.06);
    ctx.closePath();
    ctx.fill();
  }
};

const zest: Draw = (ctx, p, t) => {
  ctx.globalAlpha *= 0.35 + 0.65 * Math.abs(Math.sin(t * 2.2 + p.phase));
  ctx.fillStyle = "#E7B419";
  const s = p.s;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(0, 0, s, 0);
  ctx.quadraticCurveTo(0, 0, 0, s);
  ctx.quadraticCurveTo(0, 0, -s, 0);
  ctx.quadraticCurveTo(0, 0, 0, -s);
  ctx.fill();
};

const miniBlossom =
  (fill: string, edge: string, center: string): Draw =>
  (ctx, p) => {
    tumble(ctx, p, 0.3);
    const s = p.s;
    ctx.fillStyle = fill;
    ctx.strokeStyle = edge;
    ctx.lineWidth = 0.6;
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i / 5) * TAU);
      ctx.beginPath();
      ctx.ellipse(s * 0.5, 0, s * 0.5, s * 0.2, 0, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = center;
    circle(ctx, s * 0.14);
  };

const sprites = new Map<string, HTMLCanvasElement>();

/** Soft radial glow, rendered once per colour and reused: per-frame gradients are costly on the GPU. */
function glowSprite(key: string, stops: [number, string][]) {
  const cached = sprites.get(key);
  if (cached) return cached;
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const r = size / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    for (const [at, color] of stops) grad.addColorStop(at, color);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  sprites.set(key, c);
  return c;
}

const BOKEH_STOPS: [number, string][] = [
  [0, "rgba(206, 146, 66, 0.75)"],
  [0.45, "rgba(218, 170, 100, 0.32)"],
  [1, "rgba(230, 190, 130, 0)"],
];

const GOLD_STOPS: [number, string][] = [
  [0, "rgba(255, 226, 160, 0.9)"],
  [0.35, "rgba(233, 190, 110, 0.38)"],
  [1, "rgba(210, 160, 80, 0)"],
];

const bokeh: Draw = (ctx, p, t) => {
  ctx.globalAlpha *= 0.55 + 0.45 * Math.sin(t * 1.4 + p.phase);
  ctx.drawImage(glowSprite("bokeh", BOKEH_STOPS), -p.s, -p.s, p.s * 2, p.s * 2);
};

const goldDust: Draw = (ctx, p, t) => {
  ctx.globalAlpha *= 0.35 + 0.65 * Math.abs(Math.sin(t * 1.1 + p.phase));
  ctx.drawImage(glowSprite("gold", GOLD_STOPS), -p.s, -p.s, p.s * 2, p.s * 2);
};

const goldGlint: Draw = (ctx, p, t) => {
  ctx.globalAlpha *= Math.pow(Math.abs(Math.sin(t * 1.7 + p.phase)), 3);
  ctx.fillStyle = "#F4DEA6";
  const s = p.s;
  ctx.beginPath();
  ctx.moveTo(0, -s * 2.2);
  ctx.quadraticCurveTo(0, 0, s * 2.2, 0);
  ctx.quadraticCurveTo(0, 0, 0, s * 2.2);
  ctx.quadraticCurveTo(0, 0, -s * 2.2, 0);
  ctx.quadraticCurveTo(0, 0, 0, -s * 2.2);
  ctx.fill();
};

const oudChip: Draw = (ctx, p) => {
  tumble(ctx, p, 0.25);
  const pts = p.pts ?? [];
  ctx.fillStyle = p.seed % 2 ? "#4E321F" : "#6A4529";
  ctx.beginPath();
  for (let i = 0; i < pts.length; i += 2) {
    if (i === 0) ctx.moveTo(pts[i] * p.s, pts[i + 1] * p.s);
    else ctx.lineTo(pts[i] * p.s, pts[i + 1] * p.s);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(170, 130, 96, 0.55)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(-p.s * 0.7, -p.s * 0.1);
  ctx.lineTo(p.s * 0.6, p.s * 0.05);
  ctx.moveTo(-p.s * 0.4, p.s * 0.25);
  ctx.lineTo(p.s * 0.5, p.s * 0.3);
  ctx.stroke();
};

const starAnise: Draw = (ctx, p) => {
  tumble(ctx, p, 0.5);
  const s = p.s;
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i / 8) * TAU);
    ctx.fillStyle = "#7A3D1C";
    ctx.beginPath();
    ctx.ellipse(s * 0.55, 0, s * 0.48, s * 0.19, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#C88C4E";
    ctx.beginPath();
    ctx.ellipse(s * 0.6, 0, s * 0.16, s * 0.08, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "#4E230F";
  circle(ctx, s * 0.14);
};

const cinnamon: Draw = (ctx, p) => {
  const s = p.s;
  ctx.fillStyle = "#9A5A2E";
  ctx.beginPath();
  ctx.roundRect(-s, -s * 0.17, s * 2, s * 0.34, s * 0.17);
  ctx.fill();
  ctx.strokeStyle = "rgba(96, 50, 20, 0.7)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-s * 0.9, -s * 0.02);
  ctx.lineTo(s * 0.9, -s * 0.02);
  ctx.stroke();
  ctx.fillStyle = "#BE7D4D";
  ctx.beginPath();
  ctx.ellipse(s, 0, s * 0.09, s * 0.17, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#6E3B1A";
  ctx.beginPath();
  ctx.arc(s, 0, s * 0.07, 0, Math.PI * 1.4);
  ctx.stroke();
};

const cardamom: Draw = (ctx, p) => {
  const s = p.s;
  ctx.fillStyle = "#8EA25A";
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.42, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(92, 112, 52, 0.75)";
  ctx.lineWidth = 0.7;
  for (const k of [-0.18, 0.12]) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.85, 0);
    ctx.quadraticCurveTo(0, s * k * 2.2, s * 0.85, 0);
    ctx.stroke();
  }
  ctx.fillStyle = "#5E6E34";
  circle(ctx, s * 0.1, s * 0.98, 0);
};

const saffron: Draw = (ctx, p) => {
  const s = p.s;
  ctx.strokeStyle = "#C2261B";
  ctx.lineCap = "round";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const o = (i - 1) * s * 0.18;
    ctx.beginPath();
    ctx.moveTo(-s, o);
    ctx.quadraticCurveTo(0, o - s * 0.35, s * 0.85, o + s * 0.1);
    ctx.stroke();
    ctx.fillStyle = "#D94A2B";
    ctx.beginPath();
    ctx.moveTo(s * 0.8, o + s * 0.02);
    ctx.lineTo(s * 1.05, o - s * 0.06);
    ctx.lineTo(s * 1.05, o + s * 0.26);
    ctx.closePath();
    ctx.fill();
  }
};

const peppercorn: Draw = (ctx, p) => {
  ctx.fillStyle = "#C2445B";
  circle(ctx, p.s * 0.4);
  ctx.fillStyle = "rgba(255, 220, 226, 0.7)";
  circle(ctx, p.s * 0.12, -p.s * 0.12, -p.s * 0.14);
};

const ember: Draw = (ctx, p, t) => {
  ctx.globalAlpha *= 0.5 + 0.5 * Math.abs(Math.sin(t * 5 + p.phase));
  ctx.shadowColor = "rgba(240, 130, 40, 0.9)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = p.seed % 3 === 0 ? "#F4B24A" : "#E8702A";
  circle(ctx, p.s);
};

const bubble: Draw = (ctx, p) => {
  const r = p.s;
  ctx.fillStyle = "rgba(60, 150, 180, 0.08)";
  circle(ctx, r);
  ctx.strokeStyle = "rgba(36, 118, 148, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = Math.max(1, r * 0.14);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.66, Math.PI * 1.1, Math.PI * 1.45);
  ctx.stroke();
};

const droplet: Draw = (ctx, p) => {
  const s = p.s;
  ctx.fillStyle = "rgba(44, 134, 166, 0.28)";
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.7, -s * 0.1, s * 0.7, s * 0.8, 0, s * 0.8);
  ctx.bezierCurveTo(-s * 0.7, s * 0.8, -s * 0.7, -s * 0.1, 0, -s);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  circle(ctx, s * 0.14, -s * 0.2, s * 0.25);
};

const greenLeaf =
  (fill: string, light: string): Draw =>
  (ctx, p) => {
    const c = tumble(ctx, p, 0.2);
    leafShape(ctx, p.s);
    ctx.fillStyle = c > 0 ? fill : light;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-p.s * 0.9, 0);
    ctx.lineTo(p.s * 0.85, 0);
    ctx.stroke();
  };

/* ---------------------------------------------------------------- */

/** Atmospheres that aren't tied to a scent family. */
export type AmbientSlug = "night-air" | "gold-smoke";
export type ParticleSystemId = FamilySlug | AmbientSlug;

export const PARTICLES: Record<ParticleSystemId, ParticleSystem> = {
  "night-air": {
    count: 46,
    wisps: { sources: [0.3, 0.72], emit: 16, life: 9, rise: 0.09, width: 2.2, color: "232, 214, 190", alpha: 0.11 },
    kinds: [
      { weight: 26, size: [2, 7], spawn: "bottom", gravity: -5, terminal: 16, windForce: 16, spin: [0, 0], wobble: 14, draw: goldDust },
      { weight: 12, size: [1.2, 2.6], spawn: "any", gravity: 0, terminal: 8, windForce: 10, spin: [10, 40], wobble: 6, draw: goldGlint },
    ],
  },
  "gold-smoke": {
    count: 64,
    wisps: { sources: [0.4, 0.58, 0.74], emit: 18, life: 8, rise: 0.1, width: 2.6, color: "214, 172, 96", alpha: 0.2 },
    kinds: [
      { weight: 30, size: [1.6, 5.5], spawn: "bottom", gravity: -6, terminal: 18, windForce: 18, spin: [0, 0], wobble: 16, draw: goldDust },
      { weight: 14, size: [1, 2.4], spawn: "any", gravity: 0, terminal: 8, windForce: 12, spin: [10, 40], wobble: 6, draw: goldGlint },
    ],
  },
  citrus: {
    count: 34,
    kinds: [
      { weight: 7, size: [9, 16], spawn: "top", gravity: 16, terminal: 46, windForce: 34, drift: 6, spin: [20, 70], flip: [0.6, 1.6], draw: citrusSlice },
      { weight: 20, size: [2, 4], spawn: "any", gravity: -2, terminal: 14, windForce: 26, spin: [30, 120], wobble: 10, draw: zest },
      { weight: 6, size: [6, 9], spawn: "top", gravity: 18, terminal: 40, windForce: 40, spin: [40, 120], flip: [1, 2.4], draw: miniBlossom("#FFFDF6", "#E3D7B4", "#E3B21E") },
    ],
  },
  floral: {
    count: 34,
    kinds: [
      {
        weight: 26,
        size: [5, 10],
        spawn: "top",
        gravity: 14,
        terminal: 38,
        windForce: 48,
        drift: 8,
        spin: [30, 110],
        flip: [1.2, 3.2],
        wobble: 14,
        draw: petal(["#E9679C", "#F3A3C0", "#C8336D", "#F7C3D5"], ["#C94E80", "#DC88A6", "#9E2453", "#E3A7BC"]),
      },
      { weight: 6, size: [6, 9], spawn: "top", gravity: 16, terminal: 40, windForce: 44, spin: [40, 120], flip: [1, 2.5], draw: miniBlossom("#FFFFFF", "#EAD3DB", "#E8CF74") },
    ],
  },
  gourmand: {
    count: 30,
    kinds: [
      { weight: 26, size: [5, 16], spawn: "bottom", gravity: -5, terminal: 18, windForce: 18, spin: [0, 0], wobble: 12, draw: bokeh },
      { weight: 5, size: [7, 10], spawn: "top", gravity: 14, terminal: 34, windForce: 36, spin: [30, 90], flip: [0.8, 2], draw: miniBlossom("#F2ECBE", "#D9CF86", "#E8C04A") },
      { weight: 4, size: [7, 11], spawn: "top", gravity: 12, terminal: 30, windForce: 26, spin: [20, 50], flip: [0.4, 1], draw: greenLeaf("#5A7F3A", "#86A85C") },
    ],
  },
  woody: {
    count: 14,
    wisps: { sources: [0.2, 0.55, 0.86], emit: 20, life: 9, rise: 0.1, width: 2, color: "92, 80, 72", alpha: 0.26 },
    kinds: [
      {
        weight: 9,
        size: [5, 9],
        spawn: "top",
        gravity: 12,
        terminal: 32,
        windForce: 28,
        spin: [20, 70],
        flip: [0.5, 1.4],
        draw: oudChip,
        init: (p, rand) => {
          const n = 5;
          p.pts = [];
          for (let i = 0; i < n; i++) {
            const a = (i / n) * TAU + rand() * 0.6;
            const r = 0.6 + rand() * 0.6;
            p.pts.push(Math.cos(a) * r * 1.3, Math.sin(a) * r * 0.6);
          }
        },
      },
      { weight: 3, size: [9, 13], spawn: "top", gravity: 10, terminal: 28, windForce: 30, spin: [20, 60], flip: [0.6, 1.4], draw: greenLeaf("#2F4B3B", "#4E7461") },
    ],
  },
  amber: {
    count: 30,
    kinds: [
      { weight: 4, size: [13, 19], spawn: "any", gravity: 0, terminal: 10, windForce: 22, spin: [10, 30], flip: [0.2, 0.6], wobble: 8, draw: starAnise },
      { weight: 3, size: [18, 26], spawn: "any", gravity: 0, terminal: 10, windForce: 20, spin: [8, 24], wobble: 8, draw: cinnamon },
      { weight: 4, size: [8, 11], spawn: "any", gravity: 0, terminal: 10, windForce: 22, spin: [15, 40], wobble: 8, draw: cardamom },
      { weight: 4, size: [11, 16], spawn: "any", gravity: 0, terminal: 10, windForce: 26, spin: [15, 45], wobble: 10, draw: saffron },
      { weight: 3, size: [8, 11], spawn: "any", gravity: 0, terminal: 10, windForce: 22, spin: [10, 30], wobble: 8, draw: peppercorn },
      { weight: 16, size: [1.4, 2.6], spawn: "bottom", gravity: -14, terminal: 46, windForce: 30, spin: [0, 0], wobble: 16, life: [4, 8], draw: ember },
    ],
  },
  aquatic: {
    count: 34,
    kinds: [
      { weight: 24, size: [3, 11], spawn: "bottom", gravity: -26, terminal: 60, windForce: 16, spin: [0, 0], wobble: 18, draw: bubble },
      { weight: 6, size: [4, 7], spawn: "top", gravity: 30, terminal: 70, windForce: 24, spin: [0, 0], draw: droplet },
      { weight: 4, size: [8, 12], spawn: "top", gravity: 10, terminal: 28, windForce: 34, spin: [30, 80], flip: [0.6, 1.6], draw: greenLeaf("#4E9A5E", "#7CC587") },
    ],
  },
};
