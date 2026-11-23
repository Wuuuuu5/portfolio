import { hero, site } from "@/lib/content";
import Court from "./Court";
import Reveal from "./Reveal";

/**
 * How long the intro curtain owns the screen. The hero staggers in behind it
 * so the two read as one motion. Keep in sync with animate-lift in globals.css.
 */
const LOADER_MS = 1250;

const BUTTON =
  "group/btn inline-flex items-center gap-[0.6rem] rounded-full border px-[1.45rem] py-[0.8rem] text-[0.92rem] transition-[translate,background,border-color,box-shadow,color] duration-350 ease-flight hover:-translate-y-[3px]";

export default function Hero() {
  return (
    <div className="relative pt-[clamp(2.5rem,8vh,5rem)]" id="top">
      <div className="wrap grid grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] items-center gap-[clamp(2rem,5vw,4.5rem)] pb-[clamp(3rem,8vh,5rem)] max-[980px]:grid-cols-1 max-[980px]:gap-12">
        <div>
          <Reveal
            as="h1"
            className="font-display text-[clamp(2.4rem,4.7vw,3.9rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
            delay={LOADER_MS}
          >
            {hero.headline}
          </Reveal>

          <Reveal
            as="p"
            className="mt-[1.8rem] max-w-[52ch] text-[clamp(1rem,0.94rem+0.35vw,1.16rem)] text-fg-dim"
            delay={LOADER_MS + 180}
          >
            {hero.lede}
          </Reveal>

          <Reveal className="mt-[2.4rem] flex flex-wrap gap-[0.85rem]" delay={LOADER_MS + 270}>
            <a
              href="#work"
              className={`${BUTTON} border-accent bg-accent font-semibold text-accent-ink hover:shadow-[0_14px_38px_-12px_var(--accent)]`}
            >
              See what I&apos;ve built
              <svg
                className="size-[15px] transition-transform duration-350 ease-flight group-hover/btn:translate-x-[3px] group-hover/btn:-translate-y-[3px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <a
              href={`mailto:${site.email}`}
              className={`${BUTTON} border-line-strong font-medium hover:border-accent-2 hover:text-accent-2`}
            >
              Get in touch
            </a>
          </Reveal>
        </div>

        {/* Stays after the copy when the columns collapse: on a phone the
            pitch should land before the set piece does. */}
        <Reveal className="min-w-0" delay={LOADER_MS + 120}>
          <Court />
        </Reveal>
      </div>
    </div>
  );
}
