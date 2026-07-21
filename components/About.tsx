import { about, skills } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className="wrap">
      <SectionHeading num="03" title="About" />
      <div className={styles.cols}>
        <Reveal className={styles.prose}>
          {about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Reveal>

        <Reveal delay={90}>
          {skills.map((group) => (
            <div key={group.group} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.group}</h3>
              <ul className={styles.chips}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chip}>
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
