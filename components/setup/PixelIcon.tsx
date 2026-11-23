import type { EquipmentId } from "@/lib/setup";

/**
 * Pixel-art icons for the info card, drawn to match the voxel player.
 * a = accent, f = ink, d = dim ink, l = light (chalk), . = empty.
 * Colours come from the theme, so they follow light and dark mode.
 */
const ICONS: Record<EquipmentId, string[]> = {
  racket: [
    "....aaaa....",
    "..aa....aa..",
    ".a..llll..a.",
    ".a.llllll.a.",
    "a.llllllll.a",
    "a.llllllll.a",
    "a.llllllll.a",
    "a.llllllll.a",
    ".a.llllll.a.",
    ".a..llll..a.",
    "..aa....aa..",
    "....ffff....",
    ".....ff.....",
    ".....ff.....",
    ".....ff.....",
    ".....ff.....",
    "....dddd....",
    "....dddd....",
    "....dddd....",
    "....dddd....",
    ".....dd.....",
  ],
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

export default function PixelIcon({ id, className }: { id: EquipmentId; className?: string }) {
  const rows = ICONS[id];
  const width = Math.max(...rows.map((r) => r.length));
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          FILL[ch] ? (
            // 0.86 leaves a hairline gap so the pixels read as separate dots.
            <rect key={`${x}-${y}`} x={x + 0.07} y={y + 0.07} width={0.86} height={0.86} fill={FILL[ch]} />
          ) : null,
        ),
      )}
    </svg>
  );
}
