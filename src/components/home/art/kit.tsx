import type { CSSProperties, ReactNode } from 'react';

/*
 * Pictorial scene kit for the hero stories.
 *
 * Every scene is one SVG (560 × 360). Black monoline drawings draw themselves,
 * accent shapes pop in, and objects move between them (a PDF splits, a packet
 * travels, a shield stops a message). All motion is CSS keyed off `t` (ms);
 * remounting a scene replays it. No images to download, no JS animation.
 */

export const INK = '#0a0a0b', ACCENT = '#2f54eb', SOFT = '#e6ecff', OK = '#16a34a', OK_SOFT = '#dcfce7',
  BAD = '#dc2626', BAD_SOFT = '#fee2e2', WARN = '#d97706', WARN_SOFT = '#fef3c7', MUTED = '#a3a3a3', LINE = '#d4d4d4';

type Vars = Record<`--${string}`, string>;
const px = (n: number) => `${n}px`;
export const at = (t: number, extra: Vars = {}) => ({ '--d': `${t}ms`, ...extra }) as CSSProperties;

/* ---------- path helpers ---------- */
export const box = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
export const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
export const oval = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
/** Cloud outline sitting on baseline `by`, centred on `cx`, scale `s` (1 ≈ 250 wide). */
export const cloud = (cx: number, by: number, s: number) =>
  `M${cx - 100 * s} ${by}H${cx + 100 * s}A${42 * s} ${42 * s} 0 0 0 ${cx + 108 * s} ${by - 82 * s}A${58 * s} ${58 * s} 0 0 0 ${cx + 8 * s} ${by - 108 * s}A${50 * s} ${50 * s} 0 0 0 ${cx - 84 * s} ${by - 84 * s}A${44 * s} ${44 * s} 0 0 0 ${cx - 100 * s} ${by}Z`;

/* ---------- primitives ---------- */
export function Art({ label, children }: { label: string; children: ReactNode }) {
  return <svg viewBox="0 0 560 360" role="img" aria-label={label} className="block h-auto w-full overflow-visible">
    <g fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">{children}</g>
  </svg>;
}

/** A line that draws itself. `fill` fades in underneath. */
export function L({ d, t = 0, fill, color = INK, w, dur }: { d: string; t?: number; fill?: string; color?: string; w?: number; dur?: number }) {
  return <>
    {fill && <path d={d} fill={fill} stroke="none" className="sv-fade" style={at(t + 150)} />}
    <path d={d} pathLength={1} stroke={color} strokeWidth={w} className="sv-draw" style={at(t, dur ? { '--dur': `${dur}ms` } : {})} />
  </>;
}
/** A filled shape that pops in. */
export function P({ d, t = 0, fill = ACCENT, stroke = 'none', className = 'sv-pop' }: { d: string; t?: number; fill?: string; stroke?: string; className?: string }) {
  return <path d={d} fill={fill} stroke={stroke} className={className} style={at(t)} />;
}
export function T({ x, y, t = 0, size = 18, weight = 600, color = INK, anchor = 'middle', mono, children }: { x: number; y: number; t?: number; size?: number; weight?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; mono?: boolean; children: ReactNode }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} stroke="none" className={mono ? 'sv-fade font-mono' : 'sv-fade'} style={{ ...at(t), letterSpacing: mono ? 0 : '-0.01em' }}>{children}</text>;
}
/** Dashed connector that keeps flowing. */
export function Flow({ d, t = 0, color = ACCENT }: { d: string; t?: number; color?: string }) {
  return <path d={d} stroke={color} className="sv-flow" style={at(t)} />;
}
/** Arrowhead pointing in a direction, fades in. */
export function Head({ x, y, dir, t = 0, color = ACCENT }: { x: number; y: number; dir: 'r' | 'l' | 'u' | 'd'; t?: number; color?: string }) {
  const d = { r: `M${x - 7} ${y - 6}L${x} ${y}L${x - 7} ${y + 6}`, l: `M${x + 7} ${y - 6}L${x} ${y}L${x + 7} ${y + 6}`, u: `M${x - 6} ${y + 7}L${x} ${y}L${x + 6} ${y + 7}`, d: `M${x - 6} ${y - 7}L${x} ${y}L${x + 6} ${y - 7}` }[dir];
  return <path d={d} stroke={color} className="sv-fade" style={at(t)} />;
}

type Motion = { t?: number; from?: [number, number]; fly?: [number, number]; dur?: number; out?: number; pop?: boolean; className?: string; children: ReactNode };
/** Group that appears (fade/pop), arrives from an offset, or travels and vanishes. */
export function G({ t = 0, from, fly, dur, out, pop, className, children }: Motion) {
  const vars: Vars = { '--d': `${t}ms` };
  if (dur) vars['--dur'] = `${dur}ms`;
  if (from) { vars['--fx'] = px(from[0]); vars['--fy'] = px(from[1]); }
  if (fly) { vars['--tx'] = px(fly[0]); vars['--ty'] = px(fly[1]); }
  const cls = fly ? 'sv-fly' : from ? 'sv-from' : pop ? 'sv-pop' : 'sv-fade';
  const inner = <g className={`${cls} ${className ?? ''}`} style={vars as CSSProperties}>{children}</g>;
  return out == null ? inner : <g className="sv-out" style={{ '--o': `${out}ms` } as CSSProperties}>{inner}</g>;
}

/* ---------- reusable pictures ---------- */
export function Check({ cx, cy, r = 13, t = 0, color = OK }: { cx: number; cy: number; r?: number; t?: number; color?: string }) {
  return <g className="sv-pop" style={at(t)}>
    <path d={ring(cx, cy, r)} fill={color} stroke="none" />
    <path d={`M${cx - r * 0.42} ${cy + r * 0.02}L${cx - r * 0.1} ${cy + r * 0.34}L${cx + r * 0.45} ${cy - r * 0.3}`} stroke="#fff" strokeWidth={2.4} />
  </g>;
}
export function Cross({ cx, cy, r = 13, t = 0 }: { cx: number; cy: number; r?: number; t?: number }) {
  const k = r * 0.36;
  return <g className="sv-pop" style={at(t)}>
    <path d={ring(cx, cy, r)} fill={BAD} stroke="none" />
    <path d={`M${cx - k} ${cy - k}L${cx + k} ${cy + k}M${cx + k} ${cy - k}L${cx - k} ${cy + k}`} stroke="#fff" strokeWidth={2.4} />
  </g>;
}
export function Cylinder({ cx, top, rx, ry, h, t = 0, fill = '#fff' }: { cx: number; top: number; rx: number; ry: number; h: number; t?: number; fill?: string }) {
  const l = cx - rx;
  return <>
    <L d={`M${l} ${top}V${top + h}a${rx} ${ry} 0 0 0 ${2 * rx} 0V${top}`} t={t} fill={fill} />
    <L d={oval(cx, top, rx, ry)} t={t + 150} fill={fill} />
  </>;
}
/** Document page with a folded corner. */
export function Doc({ x, y, w, h, t = 0, lines = 4 }: { x: number; y: number; w: number; h: number; t?: number; lines?: number }) {
  const f = Math.min(22, w * 0.22);
  return <>
    <L d={`M${x} ${y + 6}a6 6 0 0 1 6 -6H${x + w - f}L${x + w} ${y + f}V${y + h - 6}a6 6 0 0 1 -6 6H${x + 6}a6 6 0 0 1 -6 -6Z`} t={t} fill="#fff" />
    <L d={`M${x + w - f} ${y}V${y + f}H${x + w}`} t={t + 300} />
    <L d={Array.from({ length: lines }, (_, i) => `M${x + 14} ${y + 30 + i * 14}H${x + w - 14 - ((i * 23) % 30)}`).join('')} t={t + 400} color={LINE} w={3} />
  </>;
}
/** AI chip with pins and a sparkle that lights up at `lit`. */
export function Chip({ cx, cy, s = 46, t = 0, lit }: { cx: number; cy: number; s?: number; t?: number; lit: number }) {
  const pins = [-0.5, 0, 0.5].map(k => k * s * 0.9);
  const e = s + 12;
  return <>
    <L d={box(cx - s, cy - s, 2 * s, 2 * s, 16)} t={t} fill="#fff" />
    <L d={pins.map(p => `M${cx + p} ${cy - e}V${cy - s}M${cx + p} ${cy + s}V${cy + e}M${cx - e} ${cy + p}H${cx - s}M${cx + s} ${cy + p}H${cx + e}`).join('')} t={t + 250} />
    <P d={`M${cx} ${cy - 26}C${cx + 3} ${cy - 8} ${cx + 8} ${cy - 3} ${cx + 26} ${cy}C${cx + 8} ${cy + 3} ${cx + 3} ${cy + 8} ${cx} ${cy + 26}C${cx - 3} ${cy + 8} ${cx - 8} ${cy + 3} ${cx - 26} ${cy}C${cx - 8} ${cy - 3} ${cx - 3} ${cy - 8} ${cx} ${cy - 26}Z`} t={lit} />
  </>;
}
/** Speech bubble with a tail on the left or right. */
export function Bubble({ x, y, w, h, t = 0, tail = 'left', fill = '#fff', color = INK }: { x: number; y: number; w: number; h: number; t?: number; tail?: 'left' | 'right'; fill?: string; color?: string }) {
  const tx = tail === 'left' ? x + 22 : x + w - 22;
  const d = `${box(x, y, w, h, 16)}M${tx - 8} ${y + h}L${tx + (tail === 'left' ? -6 : 6)} ${y + h + 14}L${tx + 8} ${y + h}`;
  return <L d={d} t={t} fill={fill} color={color} />;
}
export function Robot({ x, y, t = 0 }: { x: number; y: number; t?: number }) {
  return <>
    <L d={box(x, y, 96, 78, 22)} t={t} fill="#fff" />
    <L d={`M${x + 48} ${y}V${y - 16}${ring(x + 48, y - 22, 6)}`} t={t + 300} />
    <L d={`M${x - 8} ${y + 32}V${y + 48}M${x + 104} ${y + 32}V${y + 48}`} t={t + 350} />
    <g className="sv-blink"><P d={`${ring(x + 30, y + 36, 7)}${ring(x + 66, y + 36, 7)}`} t={t + 500} /></g>
    <L d={`M${x + 34} ${y + 58}Q${x + 48} ${y + 66} ${x + 62} ${y + 58}`} t={t + 550} />
  </>;
}
export function Browser({ x, y, w, h, t = 0 }: { x: number; y: number; w: number; h: number; t?: number }) {
  return <>
    <L d={box(x, y, w, h, 14)} t={t} fill="#fff" />
    <L d={`M${x} ${y + 26}H${x + w}`} t={t + 250} />
    <P d={`${ring(x + 16, y + 13, 3.5)}${ring(x + 28, y + 13, 3.5)}${ring(x + 40, y + 13, 3.5)}`} t={t + 300} fill={LINE} />
  </>;
}
/** Tech logo from the MasterClass icon set, placed inside the SVG. */
export function Logo({ name, x, y, s = 30, t = 0 }: { name: string; x: number; y: number; s?: number; t?: number }) {
  return <image href={`/masterclasses/assets/icons/tech/${name}.svg`} x={x} y={y} width={s} height={s} className="sv-pop" style={at(t)} />;
}

/** Head-and-shoulders avatar. */
export function Person({ cx, cy, r = 15, t = 0, fill = '#fff', color = INK }: { cx: number; cy: number; r?: number; t?: number; fill?: string; color?: string }) {
  const w = r * 1.65, top = cy + r * 1.45;
  return <>
    <L d={ring(cx, cy, r)} t={t} fill={fill} color={color} />
    <L d={`M${cx - w} ${top + r * 1.9}C${cx - w + 2} ${top + r * 0.6} ${cx - r * 0.8} ${top} ${cx} ${top}C${cx + r * 0.8} ${top} ${cx + w - 2} ${top + r * 0.6} ${cx + w} ${top + r * 1.9}`} t={t + 150} fill={fill} color={color} />
  </>;
}
