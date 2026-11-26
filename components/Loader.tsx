import { site } from "@/lib/content";
import Shuttle from "./Shuttle";

/**
 * Intro curtain — the umpire's call before a match. Deliberately CSS-only:
 * no state, no effects, no JS timers, so it can't mismatch on hydration and
 * costs nothing on the client. It lifts itself away on a timeline and stops
 * catching pointer events when it's gone. The animations live in the
 * Tailwind theme in globals.css (animate-lift, -serve, -rise, -load, -call).
 *
 * Timing here is the source of truth for LOADER_MS in Hero.tsx.
 */
export default function Loader() {
  const letters = [...site.name];

  return (
    <div
      // Faint court markings behind the name (::before). Reduced motion skips
      // the whole performance rather than just shortening it.
      className="fixed inset-0 z-100 grid animate-lift place-items-center bg-bg motion-reduce:hidden before:absolute before:inset-0 before:[background-image:repeating-linear-gradient(90deg,var(--chalk-faint)_0_1px,transparent_1px_26px),repeating-linear-gradient(0deg,var(--chalk-faint)_0_1px,transparent_1px_26px)] before:[mask-image:radial-gradient(46%_46%_at_50%_50%,#000,transparent)] before:content-['']"
      aria-hidden="true"
    >
      <div className="relative grid justify-items-center gap-[1.15rem] px-[var(--gutter)]">
        <Shuttle className="h-auto w-[34px] animate-serve text-accent drop-shadow-[0_0_14px_var(--glow)]" />

        <div className="flex overflow-hidden font-mono text-[clamp(1.1rem,4vw,1.6rem)] tracking-[-0.02em]">
          {letters.map((char, i) => (
            <span
              key={i}
              className="inline-block animate-rise [transform:translateY(110%)] whitespace-pre"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </div>

        <div className="h-[2px] w-[min(210px,46vw)] overflow-hidden rounded-[2px] bg-line-strong">
          <div className="h-full w-full origin-left animate-load rounded-[2px] [transform:scaleX(0)] bg-[linear-gradient(90deg,var(--accent-2),var(--accent))]" />
        </div>

        {/* The umpire's call that starts every match. */}
        <p className="animate-call font-mono text-[0.66rem] tracking-[0.3em] text-fg-faint uppercase">Love all — play</p>
      </div>
    </div>
  );
}
