import { site } from "@/lib/content";
import NameSwap from "./NameSwap";
import Reveal from "./Reveal";

/**
 * How long the intro curtain owns the screen. The name fades in behind it so
 * the two read as one motion. Keep in sync with animate-lift in globals.css.
 */
const LOADER_MS = 1250;

/** The hero is my name, with one line under it. Hover the name to see it in Chinese. */
export default function Hero() {
  return (
    <div id="top" className="wrap grid min-h-[calc(100svh-68px)] place-items-center py-16">
      <div className="flex flex-col items-center">
        <Reveal delay={LOADER_MS}>
          <NameSwap />
        </Reveal>
        <Reveal delay={LOADER_MS + 200}>
          {/* The court's floor line sits 0.42em (of the name's size) below the
              letters, so clear that plus a gap. Font size matches NameSwap. */}
          <p className="mt-[calc(clamp(3.5rem,13vw,11rem)*0.42+1.75rem)] font-mono text-[clamp(0.8rem,1.6vw,1rem)] tracking-[0.14em] text-balance text-center text-fg-dim uppercase">
            {site.tagline}
          </p>
        </Reveal>
      </div>
    </div>
  );
}
