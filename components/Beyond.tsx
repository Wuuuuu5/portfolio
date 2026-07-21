import { beyond } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./Beyond.module.css";

export default function Beyond() {
  return (
    <section id="beyond" className="wrap">
      <SectionHeading
        num="04"
        title="Beyond the code"
        note="Study, plus the years of captaining teams that taught me most of what I know about working with people."
      />
      <div className={styles.grid}>
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
