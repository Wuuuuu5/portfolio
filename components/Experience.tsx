import { experience, sections } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="wrap">
      <SectionHeading {...sections.experience} />
      {/* Layout comes from .court-panel in globals. */}
      <div className="court-panel">
        {experience.map((role, i) => (
          <Reveal key={role.org} delay={i * 80}>
            <article
              // On hover: an accent line paints down the left edge (::before)
              // and a faint glow washes in from the left (::after).
              className="group relative grid h-full grid-cols-[7rem_minmax(0,1fr)] items-start gap-6 overflow-hidden bg-bg p-[clamp(1.6rem,3vw,2.5rem)] transition-[background] duration-350 ease-soft hover:bg-bg-elev max-[640px]:grid-cols-[minmax(0,1fr)] max-[640px]:gap-[0.7rem] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:origin-top before:[transform:scaleY(0)] before:bg-accent before:shadow-[0_0_14px_var(--glow)] before:transition-transform before:duration-550 before:ease-soft before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(100deg,var(--glow),transparent_42%)] after:opacity-0 after:transition-opacity after:duration-450 after:ease-soft after:content-[''] hover:before:[transform:scaleY(1)] hover:after:opacity-16"
            >
              <div className="pt-[0.3rem] font-mono text-[0.72rem] tracking-[0.2em] text-accent uppercase max-[640px]:pt-0">
                {role.when}
              </div>
              <div>
                <h3 className="font-display text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.2] font-semibold tracking-[-0.025em]">
                  {role.title}
                </h3>
                <p className="mt-1 text-[0.92rem] text-accent-2">{role.org}</p>
                <p className="mt-4 max-w-[66ch] text-[0.98rem] text-fg-dim">{role.blurb}</p>
                <ul className="mt-[1.2rem] flex list-none flex-wrap gap-[0.45rem]">
                  {role.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-line-strong px-[0.62rem] py-[0.24rem] font-mono text-[0.71rem] text-fg-faint transition-colors duration-300 group-hover:border-[color-mix(in_srgb,var(--accent-2)_40%,var(--line-strong))] group-hover:text-fg-dim"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
