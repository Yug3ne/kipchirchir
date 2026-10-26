// A tiny multilayer perceptron trained with Adam, used by the hero playground.
// tanh hidden layers, sigmoid output, binary cross-entropy loss.

export type Point = { x: number; y: number; label: 0 | 1 };
export type Dataset = "circle" | "xor" | "spiral";

type Layer = {
  inSize: number;
  outSize: number;
  w: Float64Array;
  b: Float64Array;
  gw: Float64Array;
  gb: Float64Array;
  mw: Float64Array;
  vw: Float64Array;
  mb: Float64Array;
  vb: Float64Array;
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MLP {
  readonly sizes: number[];
  readonly layers: Layer[];
  private acts: Float64Array[];
  private deltas: Float64Array[];
  private t = 0;
  lr: number;

  constructor(sizes: number[], lr = 0.02, seed = 7) {
    this.sizes = sizes;
    this.lr = lr;
    const rand = mulberry32(seed);
    this.layers = [];
    for (let i = 0; i < sizes.length - 1; i++) {
      const inSize = sizes[i];
      const outSize = sizes[i + 1];
      const n = inSize * outSize;
      const w = new Float64Array(n);
      const scale = Math.sqrt(1 / inSize);
      for (let j = 0; j < n; j++) w[j] = (rand() * 2 - 1) * scale * 1.6;
      this.layers.push({
        inSize,
        outSize,
        w,
        b: new Float64Array(outSize),
        gw: new Float64Array(n),
        gb: new Float64Array(outSize),
        mw: new Float64Array(n),
        vw: new Float64Array(n),
        mb: new Float64Array(outSize),
        vb: new Float64Array(outSize),
      });
    }
    this.acts = sizes.map((s) => new Float64Array(s));
    this.deltas = sizes.map((s) => new Float64Array(s));
  }

  predict(x: number, y: number): number {
    const a0 = this.acts[0];
    a0[0] = x;
    a0[1] = y;
    const last = this.layers.length - 1;
    for (let l = 0; l <= last; l++) {
      const { inSize, outSize, w, b } = this.layers[l];
      const input = this.acts[l];
      const out = this.acts[l + 1];
      for (let o = 0; o < outSize; o++) {
        let sum = b[o];
        const row = o * inSize;
        for (let i = 0; i < inSize; i++) sum += w[row + i] * input[i];
        out[o] = l === last ? 1 / (1 + Math.exp(-sum)) : Math.tanh(sum);
      }
    }
    return this.acts[this.acts.length - 1][0];
  }

  /** One full-batch Adam step. Returns mean loss and accuracy before the update. */
  step(points: Point[]): { loss: number; acc: number } {
    if (points.length === 0) return { loss: 0, acc: 1 };
    for (const layer of this.layers) {
      layer.gw.fill(0);
      layer.gb.fill(0);
    }
    let loss = 0;
    let correct = 0;
    const last = this.layers.length - 1;

    for (const p of points) {
      const out = this.predict(p.x, p.y);
      const clamped = Math.min(Math.max(out, 1e-7), 1 - 1e-7);
      loss += p.label === 1 ? -Math.log(clamped) : -Math.log(1 - clamped);
      if (out >= 0.5 === (p.label === 1)) correct++;

      // sigmoid + BCE gradient
      this.deltas[last + 1][0] = out - p.label;
      for (let l = last; l >= 0; l--) {
        const { inSize, outSize, w, gw, gb } = this.layers[l];
        const input = this.acts[l];
        const delta = this.deltas[l + 1];
        const prev = this.deltas[l];
        if (l > 0) prev.fill(0);
        for (let o = 0; o < outSize; o++) {
          const d = delta[o];
          gb[o] += d;
          const row = o * inSize;
          for (let i = 0; i < inSize; i++) {
            gw[row + i] += d * input[i];
            if (l > 0) prev[i] += d * w[row + i];
          }
        }
        if (l > 0) {
          for (let i = 0; i < inSize; i++) prev[i] *= 1 - input[i] * input[i];
        }
      }
    }

    const n = points.length;
    this.t++;
    const b1 = 0.9;
    const b2 = 0.999;
    const c1 = 1 - Math.pow(b1, this.t);
    const c2 = 1 - Math.pow(b2, this.t);
    const update = (p: Float64Array, g: Float64Array, m: Float64Array, v: Float64Array) => {
      for (let i = 0; i < p.length; i++) {
        const gi = g[i] / n;
        m[i] = b1 * m[i] + (1 - b1) * gi;
        v[i] = b2 * v[i] + (1 - b2) * gi * gi;
        p[i] -= (this.lr * (m[i] / c1)) / (Math.sqrt(v[i] / c2) + 1e-8);
      }
    };
    for (const layer of this.layers) {
      update(layer.w, layer.gw, layer.mw, layer.vw);
      update(layer.b, layer.gb, layer.mb, layer.vb);
    }
    return { loss: loss / n, acc: correct / n };
  }
}

export function makeDataset(kind: Dataset, n = 160, seed = 3): Point[] {
  const rand = mulberry32(seed);
  const noise = () => (rand() - 0.5) * 0.18;
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    if (kind === "circle") {
      const inner = i % 2 === 0;
      const r = inner ? rand() * 0.38 : 0.6 + rand() * 0.32;
      const a = rand() * Math.PI * 2;
      points.push({ x: r * Math.cos(a) + noise() * 0.5, y: r * Math.sin(a) + noise() * 0.5, label: inner ? 1 : 0 });
    } else if (kind === "xor") {
      const x = rand() * 1.8 - 0.9;
      const y = rand() * 1.8 - 0.9;
      const px = x + (x > 0 ? 0.06 : -0.06);
      const py = y + (y > 0 ? 0.06 : -0.06);
      points.push({ x: px, y: py, label: x * y > 0 ? 1 : 0 });
    } else {
      const label = (i % 2) as 0 | 1;
      const t = (Math.floor(i / 2) / (n / 2)) * 1.0;
      const r = t * 0.88 + 0.06;
      const a = t * Math.PI * 2.6 + label * Math.PI;
      points.push({ x: r * Math.cos(a) + noise() * 0.35, y: r * Math.sin(a) + noise() * 0.35, label });
    }
  }
  return points;
}
