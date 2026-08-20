import Reveal from "./Reveal";
import styles from "./SectionHeading.module.css";

type Props = {
  num: string;
  /** The badminton framing — sits above the plain-English title. */
  kicker: string;
  title: string;
  note?: string;
};

export default function SectionHeading({ num, kicker, title, note }: Props) {
  return (
    <Reveal className={styles.head}>
      <div className={styles.left}>
        <p className={styles.kicker}>
          <span className={styles.num}>{num}</span>
          {kicker}
        </p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
    </Reveal>
  );
}
