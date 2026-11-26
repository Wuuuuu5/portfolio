import { site } from "@/lib/content";
import NameSwap from "./NameSwap";
import Reveal from "./Reveal";

/**
 * How long the intro curtain owns the screen. The name fades in behind it so
 * the two read as one motion. Keep in sync with animate-lift in globals.css.
 */
const LOADER_MS = 1250;

const button =
  "inline-flex min-h-11 items-center rounded-full border px-6 text-[0.9rem] font-medium transition-all duration-300 ease-flight hover:-translate-y-[2px]";
const quiet = "border-line-strong bg-bg-elev/65 text-fg hover:border-accent hover:text-accent";

/** The hero is my name, one line under it, then what I'm after and where to go next.
    Hover the name to see it in Chinese. */
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
        <Reveal delay={LOADER_MS + 350} className="mt-10 flex flex-col items-center gap-5">
          {site.availability ? (
            <p className="inline-flex items-center gap-2 text-[0.85rem] text-fg-dim">
              <span className="inline-flex size-2 rounded-full bg-accent" aria-hidden="true" />
              {site.availability}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#work" className={`${button} border-accent bg-accent text-accent-ink hover:shadow-[0_16px_40px_-18px_var(--accent)]`}>
              View projects
            </a>
            {site.resume ? (
              <a href={site.resume} target="_blank" rel="noreferrer noopener" className={`${button} ${quiet}`}>
                CV
              </a>
            ) : null}
            <a href={`mailto:${site.email}`} className={`${button} ${quiet}`}>
              Email me
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
