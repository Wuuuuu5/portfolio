import type { CSSProperties } from "react";
import { racketColours, type EquipmentId } from "@/lib/setup";

/**
 * My racket, the Yonex Astrox 100 ZZ, in pixels: the squared-off isometric
 * head with a woven string bed, a trim mark on each side of the frame,
 * the slim shaft with its gold rings, and a wrapped grip.
 *
 * F frame, f frame shadow, h frame highlight, w side trim, s string, T throat,
 * S shaft, x gold ring, c grip collar, G/g grip wrap, B butt cap.
 */
const RACKET = [
  "....hhhFFFFFf....",
  "..hhFFFFFFFFFff..",
  ".hFsssssssssssFf.",
  "hFs.s.s.s.s.s.sFf",
  "hFsssssssssssssFf",
  "hFs.s.s.s.s.s.sFf",
  "wFsssssssssssssFw",
  "wFs.s.s.s.s.s.sFw",
  "hFsssssssssssssFf",
  "hFs.s.s.s.s.s.sFf",
  "hFsssssssssssssFf",
  "hFs.s.s.s.s.s.sFf",
  "hFsssssssssssssFf",
  "hFs.s.s.s.s.s.sFf",
  "xFsssssssssssssFx",
  ".hFs.s.s.s.s.sFf.",
  ".hFsssssssssssFf.",
  "..hFs.s.s.s.sFf..",
  "...hFsssssssFf...",
  "....hFs.s.sFf....",
  ".....hFFFFFf.....",
  "......hTTTf......",
  ".......hTf.......",
  "........S........",
  "........x........",
  "........S........",
  "........S........",
  "........S........",
  "........S........",
  "........S........",
  "........S........",
  "........S........",
  "........S........",
  "........x........",
  "........S........",
  ".......ccc.......",
  ".......GGg.......",
  ".......gGG.......",
  ".......GGg.......",
  ".......gGG.......",
  ".......GGg.......",
  ".......gGG.......",
  ".......GGg.......",
  ".......gGG.......",
  ".......GGg.......",
  ".......gGG.......",
  ".......BBB.......",
  "........B........",
];

/** Painted from the colourway in lib/setup.ts, same as the 3D racket. */
const RACKET_FILL: Record<string, string> = {
  F: racketColours.frame,
  T: racketColours.frame,
  f: racketColours.frameShadow,
  h: racketColours.frameHighlight,
  w: racketColours.trim,
  x: racketColours.trim,
  c: racketColours.trim,
  S: racketColours.shaft,
  // Strings and grip stay quieter than the frame so the colourway leads.
  s: "var(--fg-faint)",
  G: "var(--fg-dim)",
  g: "var(--fg-faint)",
  B: "var(--fg-faint)",
};

/**
 * Pixel-art icons for the info card, drawn to match the voxel player.
 * a = accent, f = ink, d = dim ink, l = light (chalk), . = empty.
 * Colours come from the theme, so they follow light and dark mode.
 */
const ICONS: Record<EquipmentId, string[]> = {
  racket: RACKET,
  jersey: [
    "...aaa..aaa...",
    ".aaaaallaaaaa.",
    "aaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaa",
    ".aa.aaaaaa.aa.",
    "....aaaaaa....",
    "....aaaaaa....",
    "....aaaaaa....",
    "....aaaaaa....",
    "....aaaaaa....",
    "....llllll....",
  ],
  shorts: [
    "ffffffffffff",
    "ffffffffffff",
    "ffffffffffff",
    "fffff..fffff",
    "ffff....ffff",
    "ffff....ffff",
    "ffff....ffff",
    "llll....llll",
  ],
  shoes: [
    "......lllll...",
    "....llllllll..",
    "..llllllllll..",
    ".lllllllllllll",
    "llllllllllllll",
    "aaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaa",
  ],
  socks: [
    "llllll....",
    "aaaaaa....",
    "llllll....",
    "llllll....",
    "llllll....",
    "llllll....",
    "lllllll...",
    "llllllllll",
    "llllllllll",
    ".lllllllll",
  ],
  bag: [
    ".....ffffff.....",
    ".....f....f.....",
    ".aaaaaaaaaaaaaa.",
    "aaaaaaaaaaaaaaaa",
    "aallllllllllllaa",
    "aaaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaaa",
    ".aaaaaaaaaaaaaa.",
  ],
};

const FILL: Record<string, string> = {
  a: "var(--accent)",
  f: "var(--fg)",
  d: "var(--fg-dim)",
  l: "var(--line-strong)",
};

/**
 * Draws itself in top to bottom, a row at a time, each time it's mounted.
 * Give it `key={id}` so switching items replays the reveal.
 */
export default function PixelIcon({ id, className }: { id: EquipmentId; className?: string }) {
  const rows = ICONS[id];
  const fill = id === "racket" ? RACKET_FILL : FILL;
  const width = Math.max(...rows.map((r) => r.length));
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.map((row, y) => (
        <g key={y} className="motion-safe:animate-pixel-row" style={{ "--row": y } as CSSProperties}>
          {[...row].map((ch, x) =>
            fill[ch] ? (
              // 0.86 leaves a hairline gap so the pixels read as separate dots.
              <rect key={x} x={x + 0.07} y={y + 0.07} width={0.86} height={0.86} fill={fill[ch]} />
            ) : null,
          )}
        </g>
      ))}
    </svg>
  );
}
