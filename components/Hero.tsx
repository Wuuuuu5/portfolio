import NameSwap from "./NameSwap";
import Reveal from "./Reveal";

/**
 * How long the intro curtain owns the screen. The name fades in behind it so
 * the two read as one motion. Keep in sync with animate-lift in globals.css.
 */
const LOADER_MS = 1250;

/** The hero is just my name. Hover it to see it in Chinese. */
export default function Hero() {
  return (
    <div id="top" className="wrap grid min-h-[calc(100svh-68px)] place-items-center py-16">
      <Reveal delay={LOADER_MS}>
        <NameSwap />
      </Reveal>
    </div>
  );
}
