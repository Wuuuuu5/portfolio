import Reveal from "./Reveal";
import styles from "./SectionHeading.module.css";

type Props = {
  num: string;
  title: string;
  note?: string;
};

export default function SectionHeading({ num, title, note }: Props) {
  return (
    <Reveal className={styles.head}>
      <span className={styles.num}>{num}</span>
      <h2 className={styles.title}>{title}</h2>
      {note ? <p className={styles.note}>{note}</p> : null}
    </Reveal>
  );
}
