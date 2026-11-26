import { experience, sections } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SERVICE_CARD, TAG, TAG_LIST } from "./cardStyles";

export default function Experience() {
  return (
    <section id="experience" className="wrap">
      <SectionHeading {...sections.experience} />
      {/* Layout comes from .court-panel in globals. */}
      <div className="court-panel">
        {experience.map((role, i) => (
          <Reveal key={role.org} delay={i * 80}>
            <article
              className={`${SERVICE_CARD} grid h-full grid-cols-[7rem_minmax(0,1fr)] items-start gap-6 p-[clamp(1.6rem,3vw,2.5rem)] max-[640px]:grid-cols-[minmax(0,1fr)] max-[640px]:gap-[0.7rem]`}
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
                <ul className={TAG_LIST}>
                  {role.tags.map((tag) => (
                    <li key={tag} className={TAG}>
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
