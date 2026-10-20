"use client";

import { useEffect, useRef } from "react";
import type { FamilySlug } from "@/data/families";
import { subscribe, windAt } from "./engine";
import { PARTICLES, type Particle, type ParticleKind, type WispConfig } from "./particle-kinds";

const DEG = Math.PI / 180;

function range([a, b]: [number, number]) {
  return a + Math.random() * (b - a);
}

function spawn(p: Particle, kind: ParticleKind, W: number, H: number, initial: boolean) {
  p.s = range(kind.size);
  const spins = kind.spin[1] !== 0;
  p.rot = spins ? Math.random() * 360 : 0;
  p.vr = spins ? range(kind.spin) * (Math.random() < 0.5 ? -1 : 1) : 0;
  p.flip = Math.random() * Math.PI * 2;
  p.vflip = kind.flip ? range(kind.flip) : 0;
  p.phase = Math.random() * Math.PI * 2;
  p.seed = Math.floor(Math.random() * 1000);
  p.max = kind.life ? range(kind.life) : Infinity;
  p.life = initial && kind.life ? Math.random() * p.max : 0;
  kind.init?.(p, Math.random);
  const m = 30 + p.s;
  if (initial || kind.spawn === "any") {
    p.x = Math.random() * W;
    p.y = Math.random() * H;
  } else if (kind.spawn === "top") {
    p.x = -W * 0.15 + Math.random() * W * 1.3;
    p.y = -m;
  } else {
    p.x = Math.random() * W;
    p.y = H + m * (kind.life ? 0 : 1);
  }
  p.vx = 0;
  p.vy = kind.gravity > 0 ? kind.terminal * 0.5 : kind.gravity < 0 ? -kind.terminal * 0.5 : 0;
}

type WispPoint = { x: number; y: number; age: number };
type Wisp = { x: number; phase: number; acc: number; points: WispPoint[] };

/** Advance and paint rising incense trails. */
function drawWisps(
  ctx: CanvasRenderingContext2D,
  cfg: WispConfig,
  wisps: Wisp[],
  W: number,
  H: number,
  t: number,
  dt: number,
  wind: (x: number) => number,
  paint = true,
) {
  const rise = Math.max(36, H * cfg.rise);
  ctx.lineCap = "round";
  for (const w of wisps) {
    const baseX = W * w.x + Math.sin(t * 0.31 + w.phase) * 18;
    w.acc += dt * cfg.emit;
    while (w.acc >= 1) {
      w.points.push({ x: baseX, y: H + 6, age: 0 });
      w.acc -= 1;
    }
    for (const p of w.points) {
      p.age += dt;
      const k = p.age / cfg.life;
      p.y -= rise * dt * (0.85 + 0.3 * Math.sin(p.age * 0.9 + w.phase));
      // The time term makes each new puff take a different path, so the
      // column ripples and curls instead of tracing one fixed curve.
      p.x +=
        (wind(p.x / W) * 34 * (0.3 + k) +
          Math.sin(p.age * 1.1 + t * 0.9 + w.phase) * 70 * k +
          Math.sin(p.age * 2.3 - t * 1.4 + w.phase * 2) * 24 * k) *
        dt;
    }
    while (w.points.length && w.points[0].age > cfg.life) w.points.shift();
    if (!paint) continue;
    // Stroke the trail in age bands so each band is one smooth path with a
    // single alpha: no overlapping caps, no banding.
    const pts = w.points;
    const bands = 28;
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";
    for (let b = 0; b < bands; b++) {
      const lo = (b / bands) * cfg.life;
      const hi = ((b + 1) / bands) * cfg.life;
      const k = (b + 0.5) / bands;
      const alpha = Math.sin(Math.PI * Math.min(1, k * 1.1)) * cfg.alpha;
      if (alpha <= 0.004) continue;
      ctx.beginPath();
      let started = false;
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        if (p.age < lo) continue;
        if (p.age > hi) {
          if (started) ctx.lineTo(p.x, p.y);
          break;
        }
        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else ctx.lineTo(p.x, p.y);
      }
      if (!started) continue;
      // Layered strokes, wide and faint to narrow and dense, fake a soft blur
      // without the cost of a canvas filter.
      const width = cfg.width * (0.6 + k * 6);
      for (const [w, a] of [
        [6, 0.09],
        [3.6, 0.18],
        [2, 0.3],
        [1.1, 0.42],
      ]) {
        ctx.strokeStyle = `rgba(${cfg.color}, ${alpha * a})`;
        ctx.lineWidth = width * w;
        ctx.stroke();
      }
    }
  }
}

export function Particles({
  family,
  density = 1,
  lightSmoke = false,
  className,
}: {
  family: FamilySlug;
  /** Multiplier on the family's base particle count. */
  density?: number;
  lightSmoke?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const base = PARTICLES[family];
    const system =
      lightSmoke && base.wisps ? { ...base, wisps: { ...base.wisps, color: "236, 226, 208", alpha: 0.16 } } : base;
    const totalWeight = system.kinds.reduce((a, k) => a + k.weight, 0);
    let W = 0;
    let H = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let visible = false;
    const wisps: Wisp[] = (system.wisps?.sources ?? []).map((x) => ({
      x,
      phase: Math.random() * Math.PI * 2,
      acc: 0,
      points: [],
    }));

    const populate = () => {
      const areaScale = Math.max(0.45, Math.min(1.25, (W * H) / (1280 * 760)));
      const count = Math.round(system.count * density * areaScale);
      particles = [];
      for (let i = 0; i < count; i++) {
        let pick = Math.random() * totalWeight;
        let kind = 0;
        while (pick > system.kinds[kind].weight && kind < system.kinds.length - 1) {
          pick -= system.kinds[kind].weight;
          kind++;
        }
        const p = { kind } as Particle;
        spawn(p, system.kinds[kind], W, H, true);
        particles.push(p);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const first = W === 0;
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      if (first) populate();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let started = -1;
    let prewarmed = false;
    const unsubscribe = subscribe(({ t, dt: rawDt, gust, dir, reduced }) => {
      if (!visible || W === 0) return;
      if (started < 0) started = t;
      const fadeIn = Math.min(1, (t - started) / 1.2);
      const dt = reduced ? rawDt * 0.15 : rawDt;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (system.wisps) {
        if (!prewarmed) {
          // Fill the trails so smoke is already rising on first view.
          const cfg = system.wisps;
          for (let i = 0; i < cfg.life * 30; i++) {
            drawWisps(ctx, cfg, wisps, W, H, t - cfg.life + i / 30, 1 / 30, (x) => windAt(t, x), false);
          }
          prewarmed = true;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = fadeIn;
        drawWisps(ctx, system.wisps, wisps, W, H, t, dt, (x) => windAt(t, x) * (1 + gust * 1.4) + gust * dir);
      }
      for (const p of particles) {
        const kind = system.kinds[p.kind];
        const wind = (windAt(t, p.x / W) * (1 + gust * 1.4) + gust * dir * 1.1) * kind.windForce;
        p.vx += ((kind.drift ?? 0) + wind - p.vx) * Math.min(1, dt * 1.5);
        p.vy = Math.max(-kind.terminal, Math.min(kind.terminal, p.vy + kind.gravity * dt));
        p.x += (p.vx + Math.sin(t * 1.3 + p.phase) * (kind.wobble ?? 0)) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt * (1 + gust);
        p.flip += p.vflip * dt * (1 + gust * 0.6);
        p.life += dt;

        const m = 40 + p.s * 2;
        if (
          p.life > p.max ||
          (kind.gravity > 0 && p.y > H + m) ||
          (kind.gravity < 0 && p.y < -m)
        ) {
          spawn(p, kind, W, H, false);
        }
        if (p.x > W + m) p.x = -m;
        else if (p.x < -m) p.x = W + m;
        if (kind.gravity === 0) {
          if (p.y > H + m) p.y = -m;
          else if (p.y < -m) p.y = H + m;
        }

        let alpha = (kind.alpha ?? 0.92) * fadeIn * Math.min(1, p.life / 0.8 + (kind.life ? 0 : 1));
        if (Number.isFinite(p.max)) alpha *= Math.min(1, (p.max - p.life) / (p.max * 0.3));
        if (alpha <= 0.01) continue;

        ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot * DEG);
        ctx.globalAlpha = alpha;
        kind.draw(ctx, p, t);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    });

    return () => {
      unsubscribe();
      ro.disconnect();
      io.disconnect();
    };
  }, [family, density, lightSmoke]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
