import { about, sections } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="wrap">
      <SectionHeading {...sections.about} />
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
    </section>
  );
}
