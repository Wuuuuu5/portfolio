import { experience } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section id="experience" className="wrap">
      <SectionHeading
        num="02"
        title="Experience"
        note="Shipping alongside other engineers, to a real client, on a deadline."
      />
      <div className={styles.list}>
        {experience.map((role, i) => (
          <Reveal key={role.org} delay={i * 80}>
            <article className={styles.role}>
              <div className={styles.when}>{role.when}</div>
              <div>
                <h3 className={styles.title}>{role.title}</h3>
                <p className={styles.org}>{role.org}</p>
                <p className={styles.blurb}>{role.blurb}</p>
                <ul className={styles.tags}>
                  {role.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
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
