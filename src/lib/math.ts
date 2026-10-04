export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function normalPdf(x: number, mu: number, sigma: number) {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/** Round to fixed decimals; keeps SVG path strings short. */
export const r2 = (v: number) => Math.round(v * 100) / 100;

/** Build an SVG polyline path from points. */
export function toPath(points: [number, number][]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${r2(x)} ${r2(y)}`).join("");
}

/**
 * Exponentially weighted running moments. Same spirit as Welford's online
 * algorithm (numerically stable, one pass) but with a forgetting factor, so the
 * estimate follows the process when its drift changes.
 */
export class EwMoments {
  mean = 0;
  variance = 0;
  n = 0;
  constructor(private alpha = 0.004) {}
  push(x: number) {
    this.n++;
    if (this.n === 1) {
      this.mean = x;
      return;
    }
    const a = Math.max(this.alpha, 1 / this.n);
    const d = x - this.mean;
    this.mean += a * d;
    this.variance = (1 - a) * (this.variance + a * d * d);
  }
  get sd() {
    return Math.sqrt(this.variance);
  }
}

/**
 * Marching squares: iso-lines of a scalar field sampled on a grid.
 * Returns line segments in grid coordinates.
 */
export function isoSegments(field: Float32Array, cols: number, rows: number, level: number) {
  const segs: number[] = [];
  const at = (i: number, j: number) => field[j * cols + i] ?? 0;
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const c = at(i + 1, j + 1);
      const d = at(i, j + 1);
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const t = (p: number, q: number) => (level - p) / (q - p || 1e-9);
      const top: [number, number] = [i + t(a, b), j];
      const right: [number, number] = [i + 1, j + t(b, c)];
      const bottom: [number, number] = [i + t(d, c), j + 1];
      const left: [number, number] = [i, j + t(a, d)];
      const push = (p: [number, number], q: [number, number]) => segs.push(p[0], p[1], q[0], q[1]);
      switch (idx) {
        case 1:
        case 14:
          push(left, bottom);
          break;
        case 2:
        case 13:
          push(bottom, right);
          break;
        case 3:
        case 12:
          push(left, right);
          break;
        case 4:
        case 11:
          push(top, right);
          break;
        case 5:
          push(left, top);
          push(bottom, right);
          break;
        case 6:
        case 9:
          push(top, bottom);
          break;
        case 7:
        case 8:
          push(left, top);
          break;
        case 10:
          push(left, bottom);
          push(top, right);
          break;
      }
    }
  }
  return segs;
}
