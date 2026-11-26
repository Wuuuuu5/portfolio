import type { CSSProperties } from "react";
import {
  gripColours,
  kitColours,
  racketColours,
  type EquipmentId,
} from "@/lib/setup";

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
  // Strings stay quieter than the frame so the colourway leads.
  s: "var(--fg-faint)",
  // White grip wrap, with its overlap seam.
  G: gripColours.wrap,
  g: gripColours.seam,
  B: "var(--fg-faint)",
};

/**
 * Pixel-art icons for the info card, drawn to match the voxel player.
 * a = accent, f = ink, d = dim ink, l = light (chalk), . = empty.
 * Colours come from the theme, so they follow light and dark mode.
 */
const ICONS: Record<EquipmentId, string[]> = {
  racket: RACKET,
  // w white, b light blue, p purple, o orange, k logo, c collar
  jersey: [
    "...wwc..cpp...",
    ".bwwwwccpppop.",
    "bbwwwwwwppppob",
    "bbwkkwwwwpopbb",
    ".bb.wwwwbpw.b.",
    "....pwwwwb....",
    "....bpwwob....",
    "....bbbpbb....",
    "....bbbbbb....",
    "....bbbbbb....",
    "....bbbbbb....",
  ],
  // k black, b waistband
  shorts: [
    "bbbbbbbbbbbb",
    "kkkkkkkkkkkk",
    "kkkkkkkkkkkk",
    "kkkkk..kkkkk",
    "kkkk....kkkk",
    "kkkk....kkkk",
    "kkkk....kkkk",
    "kkkk....kkkk",
  ],
  // o outline, u white upper, n navy panel, s sole
  shoes: [
    "......ooooo...",
    "....oouuuuuo..",
    "..oouuunnuuo..",
    ".ouuuunnuuuuuo",
    "ouuuuuuuuuuuuo",
    "ssssssssssssss",
    "ssssssssssssss",
  ],
  // k black, B blue panel, w white logo / pinstripes, p purple, c camo, z zip
  bag: [
    ".....kkkkkk.....",
    ".....k....k.....",
    "....kkkkkkkk....",
    ".zzzzzzzzzzzzzz.",
    "kBBBBBBBBBcpkpck",
    "kBBBBBBBBBBwcpkk",
    "kBwBwwwwwwBBwcpk",
    "kBBBwwwwwwBBBwck",
    "kBBBBBBBBBBBBBpk",
    "kBBBBBBBBBBBBBBk",
    ".kkkkkkkkkkkkkk.",
  ],
};

const FILL: Record<string, string> = {
  a: "var(--accent)",
  f: "var(--fg)",
  d: "var(--fg-dim)",
  l: "var(--line-strong)",
};

/** Items with their own real colours (lib/setup.ts), same as the 3D model. */
const ITEM_FILL: Partial<Record<EquipmentId, Record<string, string>>> = {
  racket: RACKET_FILL,
  jersey: {
    w: kitColours.jersey.white,
    b: kitColours.jersey.blue,
    c: kitColours.jersey.blue,
    p: kitColours.jersey.purple,
    o: kitColours.jersey.orange,
    k: kitColours.jersey.logo,
  },
  shorts: { k: kitColours.shorts.main, b: kitColours.shorts.band },
  shoes: {
    o: kitColours.shoes.edge,
    u: kitColours.shoes.upper,
    n: kitColours.shoes.accent,
    s: kitColours.shoes.sole,
  },
  bag: {
    k: kitColours.bag.black,
    B: kitColours.bag.blue,
    w: kitColours.bag.white,
    p: kitColours.bag.purple,
    c: kitColours.bag.camo,
    z: kitColours.bag.zip,
  },
};

/**
 * Draws itself in top to bottom, a row at a time, each time it's mounted.
 * Give it `key={id}` so switching items replays the reveal.
 */
export default function PixelIcon({
  id,
  className,
}: {
  id: EquipmentId;
  className?: string;
}) {
  const rows = ICONS[id];
  const fill = ITEM_FILL[id] ?? FILL;
  const width = Math.max(...rows.map((r) => r.length));
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.map((row, y) => (
        <g
          key={y}
          className="motion-safe:animate-pixel-row"
          style={{ "--row": y } as CSSProperties}
        >
          {[...row].map((ch, x) =>
            fill[ch] ? (
              // 0.86 leaves a hairline gap so the pixels read as separate dots.
              <rect
                key={x}
                x={x + 0.07}
                y={y + 0.07}
                width={0.86}
                height={0.86}
                fill={fill[ch]}
              />
            ) : null,
          )}
        </g>
      ))}
    </svg>
  );
}
