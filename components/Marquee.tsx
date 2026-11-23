import { stack } from "@/lib/content";
import Shuttle from "./Shuttle";

/** How many times the stack repeats in each half of the track. */
const REPEATS = 4;

export default function Marquee() {
  // Each half of the track must be wider than the screen, or the right edge
  // runs out of words on wide monitors. One pass of the stack is ~1100px, so
  // four passes covers screens up to ~4400px. The two identical halves let
  // the -50% translate (animate-marquee, in globals.css) loop with no seam.
  const half = Array.from({ length: REPEATS }, () => stack).flat();
  const items = [...half, ...half];

  return (
    <div
      className="group overflow-hidden border-y border-line bg-bg-elev/40 py-[1.15rem] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      aria-hidden="true"
    >
      {/* No gap on the track: spacing lives on the items, so the duplicated
          set is exactly half the track width and the loop has no seam. */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mr-[2.6rem] flex items-center gap-[2.6rem] font-mono text-[0.84rem] tracking-[0.08em] whitespace-nowrap text-fg-dim uppercase"
          >
            {item}
            {/* A shuttle between every item, tumbling slowly as the strip passes. */}
            <Shuttle className="h-auto w-[11px] flex-none animate-tumble text-accent opacity-75" />
          </span>
        ))}
      </div>
    </div>
  );
}
