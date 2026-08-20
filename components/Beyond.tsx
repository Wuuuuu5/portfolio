import { beyond, sections } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./Beyond.module.css";

export default function Beyond() {
  return (
    <section id="beyond" className="wrap">
      <SectionHeading {...sections.beyond} />
      <div className={`${styles.grid} court-panel`}>
        {beyond.map((item, i) => (
          <Reveal key={item.label} delay={i * 80}>
            <article className={styles.card}>
              <h3 className={styles.label}>{item.label}</h3>
              <p className={styles.body}>{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
