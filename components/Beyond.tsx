import { beyond, sections } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Beyond() {
  return (
    <section id="beyond" className="wrap">
      <SectionHeading {...sections.beyond} />
      {/* Layout comes from .court-panel in globals; this only sets the columns. */}
      <div className="court-panel grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {beyond.map((item, i) => (
          <Reveal key={item.label} delay={i * 80}>
            <article
              // A chalk tick runs the width of the card on hover (the ::before).
              className="relative h-full overflow-hidden bg-bg px-[clamp(1.4rem,2.5vw,1.8rem)] py-[clamp(1.6rem,3vw,2.1rem)] transition-[background] duration-350 ease-soft before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:origin-left before:[transform:scaleX(0)] before:bg-accent before:shadow-[0_0_14px_var(--glow)] before:transition-transform before:duration-550 before:ease-soft before:content-[''] hover:bg-bg-elev hover:before:[transform:scaleX(1)]"
            >
              <h3 className="mb-[0.9rem] font-mono text-[0.72rem] tracking-[0.2em] text-accent uppercase">
                {item.label}
              </h3>
              <p className="text-[0.95rem] text-fg-dim">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
