import { hero, site, stats } from "@/lib/content";
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
            as="p"
            // A short chalk tick before the label (::before), nudged down to the
            // first line's midpoint since the label can wrap on narrow screens.
            className="mb-6 flex items-start gap-3 font-mono text-[0.75rem] tracking-[0.18em] text-fg-faint uppercase before:mt-[0.7em] before:h-[2px] before:w-[34px] before:flex-none before:bg-accent before:shadow-[0_0_10px_var(--glow)] before:content-['']"
            delay={LOADER_MS}
          >
            {site.role}
          </Reveal>

          <Reveal
            as="h1"
            className="font-display text-[clamp(2.4rem,4.7vw,3.9rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
            delay={LOADER_MS + 90}
          >
            {hero.headlineBefore}
            <span className="relative animate-shimmer bg-[linear-gradient(102deg,var(--accent)_0%,var(--accent-2)_55%,var(--accent)_100%)] bg-[length:220%_100%] bg-clip-text text-transparent after:absolute after:inset-x-0 after:bottom-[0.04em] after:h-[3px] after:origin-left after:animate-swipe after:rounded-[3px] after:[transform:scaleX(0)] after:bg-accent after:opacity-35 after:content-['']">
              {hero.headlineAccent}
            </span>
            {hero.headlineAfter}
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

      {/* The scoreboard strip: four numbers, chalk-ruled like a scoresheet.
          One row of four on wide screens with rules between them; a 2×2 grid
          on phones, ruled down the middle and across. */}
      <Reveal className="border-y border-line bg-bg-elev/55" delay={LOADER_MS + 440}>
        <dl className="wrap grid grid-cols-4 max-[720px]:grid-cols-2">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "relative py-[clamp(1.1rem,2.4vw,1.6rem)] pe-4",
                i > 0 &&
                  "min-[721px]:ps-[clamp(1rem,2.4vw,2rem)] min-[721px]:before:absolute min-[721px]:before:inset-y-[22%] min-[721px]:before:left-0 min-[721px]:before:w-px min-[721px]:before:bg-line-strong min-[721px]:before:content-['']",
                i % 2 === 1 && "max-[720px]:border-l max-[720px]:border-line-strong max-[720px]:ps-[clamp(1rem,5vw,1.75rem)]",
                i >= 2 && "max-[720px]:border-t max-[720px]:border-line",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <dt className="font-display text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-fg">
                {stat.value}
              </dt>
              <dd className="mt-[0.35rem] font-mono text-[0.68rem] leading-[1.4] tracking-[0.11em] text-fg-faint uppercase">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
