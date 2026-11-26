import { about, sections, skills } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="wrap">
      <SectionHeading {...sections.about} />
      <div className="grid grid-cols-[1.1fr_0.9fr] items-start gap-[clamp(2rem,6vw,4.5rem)] max-[900px]:grid-cols-1">
        <Reveal>
          {about.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? // The opening line gets the weight of a lede.
                    "mb-6 max-w-[58ch] font-display text-[clamp(1.2rem,1.9vw,1.45rem)] leading-[1.4] tracking-[-0.02em] text-fg"
                  : "mb-[1.2rem] max-w-[58ch] text-fg-dim"
              }
            >
              {para}
            </p>
          ))}
        </Reveal>

        <Reveal
          delay={90}
          // Chalk tick in the corner, like the mark on a service court (::before).
          className="relative rounded-[18px] border border-line bg-bg-elev/60 p-[clamp(1.4rem,3vw,2rem)] before:absolute before:-top-px before:left-[clamp(1.4rem,3vw,2rem)] before:h-[2px] before:w-[52px] before:bg-accent before:shadow-[0_0_12px_var(--glow)] before:content-['']"
        >
          <p className="mb-[1.6rem] font-mono text-[0.72rem] tracking-[0.22em] text-fg-faint uppercase">Kit bag</p>
          {skills.map((group) => (
            <div key={group.group} className="mb-[1.6rem] last:mb-0">
              <h3 className="mb-[0.8rem] font-mono text-[0.7rem] tracking-[0.14em] text-accent-2 uppercase">
                {group.group}
              </h3>
              <ul className="flex list-none flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-line-strong bg-bg px-[0.8rem] py-[0.34rem] text-[0.84rem] transition-all duration-300 ease-flight hover:-translate-y-[3px] hover:border-accent hover:text-accent hover:shadow-[0_8px_20px_-12px_var(--accent)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
