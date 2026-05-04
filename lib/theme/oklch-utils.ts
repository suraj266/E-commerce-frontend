/**
 * Color math for the appearance editor.
 *
 * Backend stores raw OKLCH strings ("oklch(L C H)"). The friendliest input
 * surface for a non-designer admin is the native browser color picker,
 * which speaks hex. So we need lossless-as-possible conversions in both
 * directions, with sRGB gamut clipping on the way out (OKLCH covers more
 * colors than sRGB, so we clamp instead of erroring).
 *
 * Math from Björn Ottosson's OKLab spec (https://bottosson.github.io/posts/oklab/).
 */

export interface Oklch {
  L: number; // 0..1
  C: number; // 0..~0.4 (sRGB-bound)
  H: number; // 0..360
}

/** Parse "oklch(L C H)" or "oklch(L C H / A)" — returns null on garbage. */
export function parseOklch(input: string): Oklch | null {
  const m = input
    .trim()
    .match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+%?)?\s*\)$/i);
  if (!m) return null;
  const L = parseFloat(m[1]);
  const C = parseFloat(m[2]);
  const H = parseFloat(m[3]);
  if ([L, C, H].some((n) => Number.isNaN(n))) return null;
  return { L, C, H };
}

/** Format an Oklch object back to a CSS string. */
export function formatOklch({ L, C, H }: Oklch): string {
  const round = (n: number, d = 4) =>
    parseFloat(n.toFixed(d)).toString();
  return `oklch(${round(L)} ${round(C)} ${round(H, 2)})`;
}

// ---------------------------------------------------------------------------
// hex ↔ OKLCH
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace(/^#/, "");
  if (![3, 6].includes(clean.length)) return null;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r / 255, g / 255, b / 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n * 255)));
  const hex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

// sRGB gamma de/encode
const linearize = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const delinearize = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

// linear sRGB → OKLab
function linearSrgbToOklab(r: number, g: number, b: number) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

// OKLab → linear sRGB
function oklabToLinearSrgb(L: number, a: number, b: number) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

export function hexToOklch(hex: string): Oklch | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(linearize) as [number, number, number];
  const { L, a, b: ob } = linearSrgbToOklab(r, g, b);
  const C = Math.sqrt(a * a + ob * ob);
  let H = (Math.atan2(ob, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/**
 * OKLCH → hex with sRGB gamut clipping. Out-of-gamut colors are clamped to
 * the closest sRGB-displayable color (channel-wise), which is "good enough"
 * for the picker's color preview and won't surprise admins.
 */
export function oklchToHex(input: Oklch | string): string {
  const { L, C, H } = typeof input === "string" ? parseOklch(input) ?? { L: 0, C: 0, H: 0 } : input;
  const a = Math.cos((H * Math.PI) / 180) * C;
  const b = Math.sin((H * Math.PI) / 180) * C;
  const lin = oklabToLinearSrgb(L, a, b);
  const r = delinearize(Math.max(0, Math.min(1, lin.r)));
  const g = delinearize(Math.max(0, Math.min(1, lin.g)));
  const bl = delinearize(Math.max(0, Math.min(1, lin.b)));
  return rgbToHex(r, g, bl);
}

/** Convenience: round-trip a hex to a normalized OKLCH string. */
export function hexToOklchString(hex: string): string | null {
  const oklch = hexToOklch(hex);
  return oklch ? formatOklch(oklch) : null;
}
