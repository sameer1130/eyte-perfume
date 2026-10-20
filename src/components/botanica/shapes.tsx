import { f } from "./geometry";

/*
 * SVG primitives for the botanicals. Shapes that grow off a stem are drawn
 * along +x from their attachment point at the origin; things that hang
 * (fruit, pods, cones) are drawn pointing down along +y.
 */

/** Petal or leaflet from the origin to (r, 0), half-width `w * r`. */
export function petalPath(r: number, w: number) {
  return `M0 0C${f(r * 0.25)} ${f(-w * r * 1.1)} ${f(r * 0.82)} ${f(-w * r * 1.05)} ${f(r)} 0C${f(r * 0.82)} ${f(w * r * 1.05)} ${f(r * 0.25)} ${f(w * r * 1.1)} 0 0Z`;
}

/** Fat, round-ended petal used for roses. */
function roundPetalPath(r: number, w: number) {
  return `M0 0C${f(r * 0.3)} ${f(-w * r * 1.15)} ${f(r * 1.08)} ${f(-w * r * 0.85)} ${f(r)} 0C${f(r * 1.08)} ${f(w * r * 0.85)} ${f(r * 0.3)} ${f(w * r * 1.15)} 0 0Z`;
}

export function Leaf({
  len,
  width = 0.34,
  fill,
  light,
  vein,
  curl = 0,
}: {
  len: number;
  width?: number;
  fill: string;
  light: string;
  vein?: string;
  curl?: number;
}) {
  const L = len;
  const W = len * width;
  const c = curl * W;
  const top = `C${f(L * 0.18)} ${f(-W * 0.95)} ${f(L * 0.64)} ${f(-W * 1.02 + c)} ${f(L)} ${f(c)}`;
  return (
    <g>
      <path d={`M0 0${top}C${f(L * 0.64)} ${f(W * 1.02 + c)} ${f(L * 0.18)} ${f(W * 0.95)} 0 0Z`} fill={fill} />
      <path d={`M0 0${top}Q${f(L * 0.5)} ${f(-W * 0.05 + c * 0.5)} 0 0Z`} fill={light} />
      {vein && (
        <path
          d={`M${f(L * 0.03)} 0Q${f(L * 0.5)} ${f(-W * 0.05 + c * 0.5)} ${f(L * 0.92)} ${f(c * 0.95)}`}
          fill="none"
          stroke={vein}
          strokeWidth={f(Math.max(0.6, L * 0.016))}
          strokeLinecap="round"
          opacity={0.75}
        />
      )}
    </g>
  );
}

function Calyx({ r, fill, y = 0 }: { r: number; fill: string; y?: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * (Math.PI / 180);
    const rr = i % 2 === 0 ? r : r * 0.38;
    pts.push(`${f(Math.cos(a) * rr)},${f(y + Math.sin(a) * rr * 0.55)}`);
  }
  return <polygon points={pts.join(" ")} fill={fill} />;
}

export function Lemon({
  r,
  fill,
  pedicel,
  stem,
  calyx,
}: {
  r: number;
  fill: string;
  pedicel: number;
  stem: string;
  calyx: string;
}) {
  const t = pedicel;
  return (
    <g>
      <path d={`M0 0Q2 ${f(t * 0.5)} 0 ${f(t + 2)}`} stroke={stem} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path
        d={`M0 ${f(t)}C${f(r * 0.95)} ${f(t + r * 0.02)} ${f(r * 1.02)} ${f(t + r * 1.75)} ${f(r * 0.14)} ${f(t + r * 1.98)}Q0 ${f(t + r * 2.22)} ${f(-r * 0.14)} ${f(t + r * 1.98)}C${f(-r * 1.02)} ${f(t + r * 1.75)} ${f(-r * 0.95)} ${f(t + r * 0.02)} 0 ${f(t)}Z`}
        fill={fill}
      />
      <ellipse
        cx={f(-r * 0.4)}
        cy={f(t + r * 0.8)}
        rx={f(r * 0.12)}
        ry={f(r * 0.42)}
        fill="#fff"
        opacity={0.32}
        transform={`rotate(10 ${f(-r * 0.4)} ${f(t + r * 0.8)})`}
      />
      <Calyx r={r * 0.3} fill={calyx} y={t + 1} />
    </g>
  );
}

export function Orange({
  r,
  fill,
  pedicel,
  stem,
  calyx,
}: {
  r: number;
  fill: string;
  pedicel: number;
  stem: string;
  calyx: string;
}) {
  const t = pedicel;
  return (
    <g>
      <path d={`M0 0Q2 ${f(t * 0.5)} 0 ${f(t + 2)}`} stroke={stem} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={f(t + r * 0.96)} r={f(r)} fill={fill} />
      <ellipse cx={f(-r * 0.38)} cy={f(t + r * 0.62)} rx={f(r * 0.16)} ry={f(r * 0.3)} fill="#fff" opacity={0.28} />
      <circle cx={0} cy={f(t + r * 1.9)} r={1.2} fill="#9A4B0C" opacity={0.6} />
      <Calyx r={r * 0.32} fill={calyx} y={t + 1} />
    </g>
  );
}

/** Five-petalled citrus (neroli) blossom on a short stalk. */
export function Blossom({
  r,
  stalk,
  petal,
  stamen,
  center,
  stem,
  twist = 0,
}: {
  r: number;
  stalk: number;
  petal: string;
  stamen: string;
  center: string;
  stem: string;
  twist?: number;
}) {
  const d = petalPath(r, 0.36);
  return (
    <g>
      <path d={`M0 0L${f(stalk)} 0`} stroke={stem} strokeWidth={1.2} strokeLinecap="round" />
      <g transform={`translate(${f(stalk + r * 0.3)} 0) rotate(${f(twist)})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={d} fill={petal} transform={`rotate(${a})`} stroke="#E6DCC0" strokeWidth={0.5} />
        ))}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <g key={a}>
              <line x1={0} y1={0} x2={f(Math.cos(rad) * r * 0.42)} y2={f(Math.sin(rad) * r * 0.42)} stroke="#F2E7B8" strokeWidth={0.7} />
              <circle cx={f(Math.cos(rad) * r * 0.45)} cy={f(Math.sin(rad) * r * 0.45)} r={f(r * 0.07)} fill={stamen} />
            </g>
          );
        })}
        <circle r={f(r * 0.12)} fill={center} />
      </g>
    </g>
  );
}

export function Bud({ len, fill, sepal }: { len: number; fill: string; sepal: string }) {
  return (
    <g>
      <path d={petalPath(len, 0.22)} fill={fill} />
      <path d={petalPath(len * 0.38, 0.3)} fill={sepal} transform="rotate(14)" />
      <path d={petalPath(len * 0.38, 0.3)} fill={sepal} transform="rotate(-14)" />
    </g>
  );
}

export function Rose({
  r,
  stalk,
  outer,
  mid,
  inner,
  core,
  edge,
  stem,
  twist = 0,
}: {
  r: number;
  stalk: number;
  outer: string;
  mid: string;
  inner: string;
  core: string;
  edge: string;
  stem: string;
  twist?: number;
}) {
  const layers = [
    { n: 5, s: 1, rot: 0, fill: outer, w: 0.62 },
    { n: 5, s: 0.74, rot: 36, fill: mid, w: 0.6 },
    { n: 4, s: 0.5, rot: 17, fill: inner, w: 0.62 },
  ];
  return (
    <g>
      {stalk > 0 && <path d={`M0 0L${f(stalk)} 0`} stroke={stem} strokeWidth={1.4} strokeLinecap="round" />}
      <g transform={`translate(${f(stalk + r * 0.55)} 0) rotate(${f(twist)})`}>
        {layers.map((layer) => {
          const d = roundPetalPath(r * layer.s, layer.w);
          return Array.from({ length: layer.n }, (_, i) => (
            <path
              key={`${layer.s}-${i}`}
              d={d}
              fill={layer.fill}
              stroke={edge}
              strokeWidth={0.7}
              strokeOpacity={0.55}
              transform={`rotate(${f(layer.rot + (i * 360) / layer.n)})`}
            />
          ));
        })}
        <circle r={f(r * 0.2)} fill={core} />
        <path
          d={`M${f(-r * 0.1)} ${f(r * 0.02)}a${f(r * 0.11)} ${f(r * 0.11)} 0 1 1 ${f(r * 0.19)} ${f(r * 0.05)}a${f(r * 0.06)} ${f(r * 0.06)} 0 1 1 ${f(-r * 0.1)} ${f(-r * 0.07)}`}
          fill="none"
          stroke={edge}
          strokeWidth={0.8}
          strokeOpacity={0.6}
        />
      </g>
    </g>
  );
}

export function Jasmine({
  r,
  stalk,
  petal,
  center,
  stem,
  twist = 0,
}: {
  r: number;
  stalk: number;
  petal: string;
  center: string;
  stem: string;
  twist?: number;
}) {
  const d = petalPath(r, 0.25);
  return (
    <g>
      <path d={`M0 0L${f(stalk)} 0`} stroke={stem} strokeWidth={1} strokeLinecap="round" />
      <g transform={`translate(${f(stalk + r * 0.2)} 0) rotate(${f(twist)})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={d} fill={petal} stroke="#E9D3DA" strokeWidth={0.5} transform={`rotate(${a + 8})`} />
        ))}
        <circle r={f(r * 0.13)} fill={center} />
      </g>
    </g>
  );
}

/** Vanilla orchid flower: five narrow tepals around a trumpet-shaped lip. */
export function Orchid({
  r,
  tepal,
  lip,
  throat,
  stem,
}: {
  r: number;
  tepal: string;
  lip: string;
  throat: string;
  stem: string;
}) {
  const ox = r * 0.35;
  const oy = r * 0.9;
  const tepals: [number, number][] = [
    [-90, 1],
    [-22, 0.92],
    [-158, 0.92],
    [48, 0.98],
    [132, 0.98],
  ];
  return (
    <g>
      <path d={`M0 0Q${f(ox * 0.2)} ${f(oy * 0.6)} ${f(ox)} ${f(oy)}`} stroke={stem} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <g transform={`translate(${f(ox)} ${f(oy)})`}>
        {tepals.map(([a, k]) => (
          <path key={a} d={petalPath(r * k, 0.17)} fill={tepal} transform={`rotate(${a})`} />
        ))}
        <path
          d={`M${f(-r * 0.3)} ${f(-r * 0.05)}C${f(-r * 0.44)} ${f(r * 0.3)} ${f(-r * 0.22)} ${f(r * 0.56)} 0 ${f(r * 0.52)}C${f(r * 0.22)} ${f(r * 0.56)} ${f(r * 0.44)} ${f(r * 0.3)} ${f(r * 0.3)} ${f(-r * 0.05)}Q0 ${f(-r * 0.22)} ${f(-r * 0.3)} ${f(-r * 0.05)}Z`}
          fill={lip}
        />
        <path
          d={`M${f(-r * 0.24)} ${f(r * 0.38)}q${f(r * 0.06)} ${f(r * 0.08)} ${f(r * 0.12)} 0t${f(r * 0.12)} 0t${f(r * 0.12)} 0t${f(r * 0.12)} 0`}
          fill="none"
          stroke={throat}
          strokeWidth={0.8}
          opacity={0.7}
        />
        <ellipse cx={0} cy={f(r * 0.14)} rx={f(r * 0.13)} ry={f(r * 0.17)} fill={throat} opacity={0.75} />
        <ellipse cx={0} cy={f(-r * 0.02)} rx={f(r * 0.06)} ry={f(r * 0.12)} fill="#FBF7E4" />
      </g>
    </g>
  );
}

export type Pod = { len: number; w: number; angle: number; curve: number; fill: string };

/** A hanging bunch of vanilla pods. */
export function PodBunch({ pods, stem, sheen }: { pods: Pod[]; stem: string; sheen: string }) {
  return (
    <g>
      <path d="M0 0L0 8" stroke={stem} strokeWidth={2.4} strokeLinecap="round" />
      {pods.map((p, i) => {
        const { len: L, w, curve: c } = p;
        return (
          <g key={i} transform={`translate(0 6) rotate(${f(p.angle)})`}>
            <path
              d={`M0 0C${f(w * 1.2)} ${f(L * 0.22)} ${f(w * 1.1 + c)} ${f(L * 0.72)} ${f(c)} ${f(L)}C${f(c - w * 1.1)} ${f(L * 0.72)} ${f(-w * 1.2)} ${f(L * 0.22)} 0 0Z`}
              fill={p.fill}
            />
            <path
              d={`M${f(w * 0.2)} ${f(L * 0.12)}C${f(w * 0.5)} ${f(L * 0.4)} ${f(w * 0.4 + c * 0.6)} ${f(L * 0.7)} ${f(c * 0.9)} ${f(L * 0.92)}`}
              stroke={sheen}
              strokeWidth={0.8}
              fill="none"
              opacity={0.55}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Flat cedar/cypress spray: a rachis with alternating leaflets. */
export function Frond({ len, fill, light, rachis }: { len: number; fill: string; light: string; rachis: string }) {
  const n = 9;
  const items = [];
  for (let i = 0; i < n; i++) {
    const u = 0.1 + (i * 0.78) / n;
    const side = i % 2 === 0 ? 1 : -1;
    const bl = len * 0.34 * (1 - u * 0.65);
    items.push(
      <path
        key={i}
        d={petalPath(bl, 0.18)}
        fill={side > 0 ? fill : light}
        transform={`translate(${f(u * len)} ${f(-len * 0.02 * Math.sin(u * Math.PI))}) rotate(${side * 48})`}
      />,
    );
  }
  return (
    <g>
      <path d={`M0 0Q${f(len * 0.5)} ${f(-len * 0.04)} ${f(len)} 0`} stroke={rachis} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      {items}
      <path d={petalPath(len * 0.2, 0.2)} fill={fill} transform={`translate(${f(len * 0.84)} 0)`} />
    </g>
  );
}

export function Cone({ r, fill, line }: { r: number; fill: string; line: string }) {
  return (
    <g>
      <path d={`M0 0L0 ${f(r * 0.4)}`} stroke={line} strokeWidth={1.2} />
      <ellipse cx={0} cy={f(r * 1.3)} rx={f(r * 0.72)} ry={f(r)} fill={fill} />
      {[0.9, 1.3, 1.7].map((k) => (
        <path
          key={k}
          d={`M${f(-r * 0.6)} ${f(r * k)}Q0 ${f(r * (k + 0.28))} ${f(r * 0.6)} ${f(r * k)}`}
          stroke={line}
          strokeWidth={0.7}
          fill="none"
          opacity={0.6}
        />
      ))}
    </g>
  );
}

/** Saffron crocus opening toward +x, with its three red stigmas. */
export function Crocus({
  r,
  outer,
  inner,
  vein,
  stigma,
  anther,
}: {
  r: number;
  outer: string;
  inner: string;
  vein: string;
  stigma: string;
  anther: string;
}) {
  const back = petalPath(r, 0.34);
  const front = petalPath(r * 0.94, 0.36);
  return (
    <g>
      {[-30, 0, 30].map((a) => (
        <path key={`b${a}`} d={back} fill={inner} transform={`rotate(${a})`} />
      ))}
      {[-0.26, 0, 0.26].map((k) => (
        <path
          key={`s${k}`}
          d={`M${f(r * 0.2)} 0Q${f(r * 0.75)} ${f(r * k * 0.4)} ${f(r * 1.18)} ${f(r * k)}`}
          stroke={stigma}
          strokeWidth={f(r * 0.06)}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {[-0.08, 0.1].map((k) => (
        <ellipse key={`a${k}`} cx={f(r * 0.72)} cy={f(r * k)} rx={f(r * 0.12)} ry={f(r * 0.04)} fill={anther} />
      ))}
      {[-17, 17, 0].map((a, i) => (
        <g key={`f${a}`} transform={`rotate(${a}) scale(${i === 2 ? 0.88 : 1})`}>
          <path d={front} fill={outer} />
          <path d={`M${f(r * 0.12)} 0L${f(r * 0.78)} 0`} stroke={vein} strokeWidth={0.8} opacity={0.5} />
          <path d={`M${f(r * 0.18)} ${f(r * 0.06)}L${f(r * 0.62)} ${f(r * 0.14)}`} stroke={vein} strokeWidth={0.6} opacity={0.35} />
          <path d={`M${f(r * 0.18)} ${f(-r * 0.06)}L${f(r * 0.62)} ${f(-r * 0.14)}`} stroke={vein} strokeWidth={0.6} opacity={0.35} />
        </g>
      ))}
    </g>
  );
}
